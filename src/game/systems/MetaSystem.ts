import type { MetaState } from '../types/MetaTypes';
import type { RunState } from '../types/GameTypes';
import { DEFAULT_SETTINGS } from '../types/SettingsTypes';
import { CURRENT_SAVE_VERSION } from './SaveSystem';
import { SaveSystem } from './SaveSystem';

const DEFAULT_META_STATE: MetaState = {
  saveVersion: CURRENT_SAVE_VERSION,
  unlockedHeroes: [],
  totalGoldCollected: 0,
  totalCascades: 0,
  bossesDefeated: [],
  endingsUnlocked: [],
  hubBuildings: {},
  monsterFriendship: {},
  completedStageGoals: [],
  discoveredChaosRules: [],
  discoveredBossRules: [],
  stage1BossDefeated: false,
  stage2BossDefeated: false,
  normalEndingFinished: false,
  totalCascadeCombos: 0,
  slimesBefriended: 0,
  roomsClearedWithoutDamage: 0,
  tutorialCompleted: false,
  tutorialLessonIndex: 0,
  settings: DEFAULT_SETTINGS
};

export class MetaSystem {
  private meta: MetaState;
  
  constructor(private readonly saveSystem: SaveSystem) {
    const loaded = this.saveSystem.loadMeta();
    this.meta = {
      ...DEFAULT_META_STATE,
      ...(loaded || {}),
      settings: {
        ...DEFAULT_META_STATE.settings,
        ...(loaded?.settings || {})
      },
      unlockedHeroes: loaded?.unlockedHeroes ? [...loaded.unlockedHeroes] : [],
      bossesDefeated: loaded?.bossesDefeated ? [...loaded.bossesDefeated] : [],
      endingsUnlocked: loaded?.endingsUnlocked ? [...loaded.endingsUnlocked] : [],
      hubBuildings: { ...(loaded?.hubBuildings || {}) },
      monsterFriendship: { ...(loaded?.monsterFriendship || {}) },
      completedStageGoals: loaded?.completedStageGoals ? [...loaded.completedStageGoals] : [],
      discoveredChaosRules: loaded?.discoveredChaosRules ? [...loaded.discoveredChaosRules] : [],
      discoveredBossRules: loaded?.discoveredBossRules ? [...loaded.discoveredBossRules] : []
    };
    
    // Ensure milo is always unlocked
    if (!this.meta.unlockedHeroes.includes('hero_milo_blockmancer')) {
      this.meta.unlockedHeroes.push('hero_milo_blockmancer');
    }
    this.save();
  }

  recordStageGoalCompleted(goalId: string): void {
    if (!this.meta.completedStageGoals.includes(goalId)) {
      this.meta.completedStageGoals.push(goalId);
      this.save();
    }
  }

  recordChaosRuleDiscovered(ruleId: string): void {
    if (!this.meta.discoveredChaosRules.includes(ruleId)) {
      this.meta.discoveredChaosRules.push(ruleId);
      this.save();
    }
  }

  recordBossRuleDiscovered(ruleId: string): void {
    if (!this.meta.discoveredBossRules.includes(ruleId)) {
      this.meta.discoveredBossRules.push(ruleId);
      this.save();
    }
  }

  addFriendship(monsterId: string, points: number): number {
    const current = this.meta.monsterFriendship[monsterId] ?? 0;
    const next = Math.max(0, current + points);
    this.meta.monsterFriendship[monsterId] = next;
    this.save();
    return next;
  }

  upgradeHubBuilding(buildingId: string): number {
    const next = (this.meta.hubBuildings[buildingId] ?? 0) + 1;
    this.meta.hubBuildings[buildingId] = next;
    this.save();
    return next;
  }

  get state(): MetaState {
    return this.meta;
  }

  save(): void {
    this.saveSystem.saveMeta(this.meta);
  }

  isHeroUnlocked(id: string): boolean {
    return this.meta.unlockedHeroes.includes(id);
  }

  unlockHero(id: string): void {
    if (!this.isHeroUnlocked(id)) {
      this.meta.unlockedHeroes.push(id);
      this.save();
    }
  }

  recordBossDefeated(bossId: string, stage: number): void {
    if (!this.meta.bossesDefeated.includes(bossId)) {
      this.meta.bossesDefeated.push(bossId);
    }
    if (stage === 1) {
      this.meta.stage1BossDefeated = true;
    }
    if (stage === 2) {
      this.meta.stage2BossDefeated = true;
    }
    this.checkUnlockConditions();
    this.save();
  }

  recordRunEnd(runState: RunState, victory: boolean): void {
    this.meta.totalGoldCollected += Math.max(0, runState.player.totalGoldCollected);
    this.meta.totalCascades += Math.max(0, runState.runStats.cascadesTriggered);
    this.meta.totalCascadeCombos = this.meta.totalCascades;
    for (const bossId of runState.runStats.bossesDefeated) {
      if (!this.meta.bossesDefeated.includes(bossId)) {
        this.meta.bossesDefeated.push(bossId);
      }
    }
    if (victory) {
      this.meta.normalEndingFinished = true;
      if (!this.meta.endingsUnlocked.includes('normal')) {
        this.meta.endingsUnlocked.push('normal');
      }
    }
    this.checkUnlockConditions();
    this.save();
  }

  unlockTrueEnding(): void {
    if (!this.meta.endingsUnlocked.includes('true')) {
      this.meta.endingsUnlocked.push('true');
    }
    this.save();
  }

  // Hook helpers to check unlock conditions dynamically
  checkUnlockConditions(): void {
    let changed = false;
    
    if (!this.isHeroUnlocked('hero_bruk_snack_knight') && this.meta.totalGoldCollected >= 500) {
      this.meta.unlockedHeroes.push('hero_bruk_snack_knight');
      changed = true;
    }
    if (!this.isHeroUnlocked('hero_lumi_star_witch') && this.meta.totalCascadeCombos >= 10) {
      this.meta.unlockedHeroes.push('hero_lumi_star_witch');
      changed = true;
    }
    if (!this.isHeroUnlocked('hero_nixie_frostbinder') && this.meta.totalCascades >= 6) {
      this.meta.unlockedHeroes.push('hero_nixie_frostbinder');
      changed = true;
    }
    if (!this.isHeroUnlocked('hero_pippa_pyromancer') && this.meta.stage1BossDefeated) {
      this.meta.unlockedHeroes.push('hero_pippa_pyromancer');
      changed = true;
    }
    if (!this.isHeroUnlocked('hero_zuzu_goblin_engineer') && this.meta.stage2BossDefeated) {
      this.meta.unlockedHeroes.push('hero_zuzu_goblin_engineer');
      changed = true;
    }
    if (!this.isHeroUnlocked('hero_poplin_professor') && this.meta.normalEndingFinished) {
      this.meta.unlockedHeroes.push('hero_poplin_professor');
      changed = true;
    }
    if (!this.isHeroUnlocked('hero_bloop_slime_friend') && this.meta.bossesDefeated.length >= 4) {
      this.meta.unlockedHeroes.push('hero_bloop_slime_friend');
      changed = true;
    }
    
    if (changed) {
      this.save();
    }
  }
}
