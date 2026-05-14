import type { MetaState } from '../types/MetaTypes';
import { SaveSystem } from './SaveSystem';

const DEFAULT_META_STATE: MetaState = {
  unlockedHeroes: [],
  totalGoldCollected: 0,
  stage1BossDefeated: false,
  stage2BossDefeated: false,
  normalEndingFinished: false,
  totalCascadeCombos: 0,
  slimesBefriended: 0,
  roomsClearedWithoutDamage: 0,
  tutorialCompleted: false,
  tutorialLessonIndex: 0
};

export class MetaSystem {
  private meta: MetaState;
  
  constructor(private readonly saveSystem: SaveSystem) {
    const loaded = this.saveSystem.loadMeta();
    this.meta = { ...DEFAULT_META_STATE, ...(loaded || {}) };
    
    // Ensure milo is always unlocked
    if (!this.meta.unlockedHeroes.includes('hero_milo_blockmancer')) {
      this.meta.unlockedHeroes.push('hero_milo_blockmancer');
    }
    this.save();
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
    if (!this.isHeroUnlocked('hero_nixie_frostbinder') && this.meta.roomsClearedWithoutDamage >= 3) {
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
    if (!this.isHeroUnlocked('hero_bloop_slime_friend') && this.meta.slimesBefriended >= 20) {
      this.meta.unlockedHeroes.push('hero_bloop_slime_friend');
      changed = true;
    }
    
    if (changed) {
      this.save();
    }
  }
}
