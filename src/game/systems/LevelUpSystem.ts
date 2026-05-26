import type { NodeResultSummary, PlayerLevelState, RunState } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';
import { seededRandom } from '../utils/random';

type LevelUpCardRarity = 'general' | 'hero' | 'rare';

type LevelUpUpgradeContent = {
  id: string;
  name: string;
  description?: string;
  flavorText?: string;
  iconKey?: string;
  enabled?: boolean;
  upgradeType?: 'general' | 'hero_specific';
  cardType?: 'general' | 'hero' | 'hero_specific' | 'rare';
  rarity?: string;
  stackLimit?: number;
  effectId?: string;
  heroId?: string;
  levelUpOnly?: boolean;
};

const HERO_IDS = new Set([
  'hero_milo_blockmancer',
  'hero_pippa_pyromancer',
  'hero_zuzu_goblin_engineer',
  'hero_nixie_frostbinder',
  'hero_bruk_snack_knight',
  'hero_lumi_star_witch'
]);

export class LevelUpSystem {
  getDefaultPlayerLevelState(): PlayerLevelState {
    return {
      level: 1,
      currentXp: 0,
      xpToNextLevel: 25,
      pendingLevelUps: 0,
      chosenUpgrades: {},
      rerollCharges: 0
    };
  }

  getXpToNextLevel(level: number): number {
    if (level <= 1) return 25;
    if (level === 2) return 35;
    if (level === 3) return 50;
    if (level === 4) return 70;
    return 70 + (level - 4) * 25;
  }

  calculateNodeXp(summary: NodeResultSummary): number {
    return Math.max(0, Math.floor(summary.xpGainedTotal));
  }

  applyNodeXpOnce(state: RunState, summary: NodeResultSummary): void {
    const claim = state.nodeResultClaims.find((entry) => entry.resultId === summary.resultId);
    if (claim?.xpApplied) {
      return;
    }

    const level = state.playerLevelState ?? this.getDefaultPlayerLevelState();
    let currentXp = level.currentXp + this.calculateNodeXp(summary);
    let currentLevel = level.level;
    let threshold = Math.max(1, level.xpToNextLevel || this.getXpToNextLevel(currentLevel));
    let pending = 0;

    while (currentXp >= threshold) {
      currentXp -= threshold;
      currentLevel += 1;
      pending += 1;
      threshold = this.getXpToNextLevel(currentLevel);
    }

    state.playerLevelState = {
      ...level,
      level: currentLevel,
      currentXp,
      xpToNextLevel: threshold,
      pendingLevelUps: level.pendingLevelUps + pending
    };
    state.player.level = currentLevel;
    state.player.experience = currentXp;
    state.player.xpToNextLevel = threshold;
  }

  hasPendingLevelUp(state: RunState): boolean {
    return (state.playerLevelState?.pendingLevelUps ?? 0) > 0;
  }

  consumePendingLevelUp(state: RunState): void {
    state.playerLevelState.pendingLevelUps = Math.max(0, state.playerLevelState.pendingLevelUps - 1);
  }

  getChosenUpgradeStack(state: RunState, upgradeId: string): number {
    return Math.max(0, state.playerLevelState.chosenUpgrades[upgradeId] ?? 0);
  }

  canOfferUpgrade(state: RunState, upgrade: LevelUpUpgradeContent): boolean {
    if (!upgrade || upgrade.enabled === false) return false;
    if (!upgrade.effectId || !LEVEL_UP_EFFECT_IDS.has(upgrade.effectId)) return false;
    if (upgrade.upgradeType === 'hero_specific' && upgrade.heroId !== state.hero.id) return false;
    const limit = Math.max(1, Math.floor(upgrade.stackLimit ?? 1));
    return this.getChosenUpgradeStack(state, upgrade.id) < limit;
  }

  pickLevelUpChoices(state: RunState, count = 3, seed: string | number = this.defaultChoiceSeed(state)): LevelUpUpgradeContent[] {
    const baseSeed = this.hashSeed(seed);
    const allUpgrades = contentRegistry.listEnabled<LevelUpUpgradeContent>('upgrade');
    const valid = allUpgrades
      .filter((upg) => upg.levelUpOnly === true || upg.id.startsWith('upg_lvl_'))
      .filter((upg) => this.canOfferUpgrade(state, upg))
      .sort((left, right) => left.id.localeCompare(right.id));
    const chosen: LevelUpUpgradeContent[] = [];

    const heroEligible = valid.filter((u) => u.upgradeType === 'hero_specific' && u.heroId === state.hero.id);
    if (state.playerLevelState.level >= 3 && heroEligible.length > 0) {
      chosen.push(this.seededPick(heroEligible, baseSeed + 17));
    }

    let rollIndex = 0;
    while (chosen.length < count) {
      const rarity = this.rollCardRarity(baseSeed + 101 + rollIndex * 37);
      const pool = this.getPoolByRarity(valid, rarity, state.hero.id)
        .filter((upg) => !chosen.some((existing) => existing.id === upg.id));
      if (pool.length <= 0) {
        break;
      }
      chosen.push(this.seededPick(pool, baseSeed + 211 + rollIndex * 53));
      rollIndex += 1;
    }

    const uniqueValid = valid.filter((upg) => !chosen.some((existing) => existing.id === upg.id));
    while (chosen.length < count && uniqueValid.length > 0) {
      const item = uniqueValid.shift()!;
      chosen.push(item);
    }

    while (chosen.length < count) {
      chosen.push({
        id: `upg_lvl_fallback_${chosen.length}`,
        name: 'Festival Favor',
        description: 'Gain +1 level-up reroll charge.',
        iconKey: 'ui_level_up_stack_chip',
        upgradeType: 'general',
        cardType: 'general',
        stackLimit: 999,
        effectId: 'lvl_reward_reroll'
      });
    }

    return chosen.slice(0, count);
  }

  applyChosenUpgrade(state: RunState, upgrade: LevelUpUpgradeContent): void {
    const stacks = this.getChosenUpgradeStack(state, upgrade.id);
    state.playerLevelState.chosenUpgrades[upgrade.id] = stacks + 1;
  }

  private rollCardRarity(seed: number): LevelUpCardRarity {
    const roll = seededRandom(seed, 0, 1);
    if (roll < 0.65) return 'general';
    if (roll < 0.9) return 'hero';
    return 'rare';
  }

  private getPoolByRarity(valid: LevelUpUpgradeContent[], rarity: LevelUpCardRarity, heroId: string): LevelUpUpgradeContent[] {
    if (rarity === 'hero') {
      return valid.filter((entry) => entry.upgradeType === 'hero_specific' && entry.heroId === heroId);
    }
    if (rarity === 'rare') {
      return valid.filter((entry) => (entry.cardType ?? entry.rarity) === 'rare');
    }
    return valid.filter((entry) => entry.upgradeType !== 'hero_specific');
  }

  private seededPick<T>(items: T[], seed: number): T {
    const index = Math.min(items.length - 1, Math.floor(seededRandom(seed, 0, items.length)));
    return items[index];
  }

  private defaultChoiceSeed(state: RunState): string {
    return [
      state.currentNodeId,
      state.playerLevelState.level,
      state.playerLevelState.pendingLevelUps,
      Object.keys(state.playerLevelState.chosenUpgrades).sort().join(',')
    ].join(':');
  }

  private hashSeed(seed: string | number): number {
    if (typeof seed === 'number') {
      return Number.isFinite(seed) ? seed : 0;
    }
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

export const LEVEL_UP_EFFECT_IDS = new Set([
  'lvl_clear_line_damage',
  'lvl_max_hp_percent',
  'lvl_flat_hp',
  'lvl_mana_gain',
  'lvl_cascade_damage',
  'lvl_starting_shield',
  'lvl_heal_after_node',
  'lvl_spell_damage',
  'lvl_fever_gain',
  'lvl_hazard_resist',
  'lvl_entry_grace',
  'lvl_reward_reroll',
  'lvl_milo_plink_mana',
  'lvl_milo_calm_board',
  'lvl_milo_listener',
  'lvl_milo_gentle_finish',
  'lvl_pippa_preheat',
  'lvl_pippa_burn_sticky',
  'lvl_pippa_oven_guard',
  'lvl_pippa_hot_combo',
  'lvl_zuzu_bomb_friend',
  'lvl_zuzu_safety_clamp',
  'lvl_zuzu_extra_fuse',
  'lvl_zuzu_gadget_retry',
  'lvl_nixie_chill_timing',
  'lvl_nixie_soft_thaw',
  'lvl_nixie_slow_entry',
  'lvl_nixie_preserve',
  'lvl_bruk_snack_armor',
  'lvl_bruk_table_shield',
  'lvl_bruk_no_snack_lost',
  'lvl_bruk_victory_plate',
  'lvl_lumi_star_guidance',
  'lvl_lumi_cascade_wish',
  'lvl_lumi_preview_light',
  'lvl_lumi_wishkeeper'
]);

export function isValidHeroId(heroId: string | undefined): boolean {
  return typeof heroId === 'string' && HERO_IDS.has(heroId);
}
