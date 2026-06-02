import type { NodeResultSummary, PlayerLevelState, RunState, RunUpgradeState, UpgradeCategory } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';
import { seededRandom, weightedChoice } from '../utils/random';
import { getUpgradeCategorySlotCounts } from '../data/defaultRunState';
import { upgradeCardEffectHandler } from './UpgradeCardEffectHandler';

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

  canSelectCategory(state: RunState, category: UpgradeCategory): boolean {
    const counts = getUpgradeCategorySlotCounts(state.runUpgradeState);
    if (counts.total >= 5) return false;
    if (category === 'hero' && counts.hero >= 2) return false;
    if (category === 'board' && counts.board >= 2) return false;
    if (category === 'fever' && counts.fever >= 2) return false;
    return true;
  }

  getAvailableCategories(state: RunState): UpgradeCategory[] {
    const all: UpgradeCategory[] = ['hero', 'board', 'fever'];
    return all.filter((cat) => this.canSelectCategory(state, cat));
  }

  isCategoryFull(state: RunState, category: UpgradeCategory): boolean {
    return !this.canSelectCategory(state, category);
  }

  getUsedSlotCount(state: RunState, category?: UpgradeCategory): number {
    const counts = getUpgradeCategorySlotCounts(state.runUpgradeState);
    if (!category) return counts.total;
    return counts[category] ?? 0;
  }

  findAvailableSlotIndex(state: RunState, category: UpgradeCategory): number {
    const slots = state.runUpgradeState.slots;
    const usedIndices = new Set(
      Object.values(state.runUpgradeState.ownedCards).map((card) => card.slotIndex)
    );
    for (const slot of slots) {
      if (!slot.category && !usedIndices.has(slot.index)) {
        return slot.index;
      }
    }
    const maxSlot = Math.max(0, ...slots.map((s) => s.index), 4);
    for (let i = 0; i <= maxSlot + 1; i++) {
      if (!usedIndices.has(i)) return i;
    }
    return maxSlot + 1;
  }

  claimSlotForCategory(state: RunState, category: UpgradeCategory, cardId: string, level: 1 | 2 | 3 | 4 | 5 = 1): void {
    const slotIndex = this.findAvailableSlotIndex(state, category);
    const slots = state.runUpgradeState.slots;
    let slot = slots.find((s) => s.index === slotIndex);
    if (!slot) {
      slot = { index: slotIndex };
      slots.push(slot);
      slots.sort((a, b) => a.index - b.index);
    }
    slot.category = category;
    slot.cardId = cardId;

    state.runUpgradeState.ownedCards[cardId] = {
      cardId,
      category,
      level,
      slotIndex
    };
  }

  levelUpOwnedCard(state: RunState, cardId: string): boolean {
    const existing = state.runUpgradeState.ownedCards[cardId];
    if (!existing) return false;
    if (existing.level >= 5) return false;
    const nextLevel = (existing.level + 1) as 1 | 2 | 3 | 4 | 5;
    state.runUpgradeState.ownedCards[cardId] = {
      ...existing,
      level: nextLevel,
      readyToEvolve: nextLevel >= 5 ? true : undefined
    };
    return true;
  }

  isCardAlreadyOwned(state: RunState, cardId: string): boolean {
    return cardId in state.runUpgradeState.ownedCards;
  }

  getCardLevel(state: RunState, cardId: string): number {
    return state.runUpgradeState.ownedCards[cardId]?.level ?? 0;
  }

  isCardMaxed(state: RunState, cardId: string): boolean {
    const existing = state.runUpgradeState.ownedCards[cardId];
    if (!existing) return false;
    return existing.level >= 5;
  }

  isCardReadyToEvolve(state: RunState, cardId: string): boolean {
    const existing = state.runUpgradeState.ownedCards[cardId];
    if (!existing) return false;
    return existing.readyToEvolve === true;
  }

  isCardLegendary(state: RunState, cardId: string): boolean {
    const existing = state.runUpgradeState.ownedCards[cardId];
    if (!existing) return false;
    return typeof existing.legendaryEvolutionId === 'string' && existing.legendaryEvolutionId.length > 0;
  }

  isCardExcludedFromOffers(state: RunState, cardId: string): boolean {
    if (this.isCardMaxed(state, cardId) || this.isCardLegendary(state, cardId)) {
      return true;
    }
    if (
      state.levelUpScreenState.pendingLegendaryEvolution?.cardId === cardId
    ) {
      return true;
    }
    return false;
  }

  getPendingEvolutionCards(state: RunState): Array<{ cardId: string; slotIndex: number }> {
    const cards = state.runUpgradeState.ownedCards;
    return Object.values(cards)
      .filter((card) => card.readyToEvolve === true && card.level >= 5 && !card.legendaryEvolutionId)
      .map((card) => ({ cardId: card.cardId, slotIndex: card.slotIndex }));
  }

  getLegendaryPoolForCard(cardId: string): Array<{
    id: string;
    name: string;
    description: string;
    effectType: string;
    effectConfig: Record<string, unknown>;
    tags: string[];
  }> {
    type CardEntry = {
      id: string;
      legendaryPool?: Array<{
        id: string;
        name: string;
        description: string;
        effectType: string;
        effectConfig: Record<string, unknown>;
        tags: string[];
        placeholder?: boolean;
      }>;
    };
    const card = contentRegistry.getOptionalById('upgradeCard', cardId) as CardEntry | null;
    if (!card || !Array.isArray(card.legendaryPool) || card.legendaryPool.length === 0) {
      console.warn(`[LevelUpSystem] No legendaryPool for card "${cardId}". Safe fallback applied.`);
      return [];
    }
    return card.legendaryPool
      .filter((entry) => !entry.placeholder)
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        description: entry.description,
        effectType: entry.effectType,
        effectConfig: entry.effectConfig,
        tags: entry.tags
      }));
  }

  getEligibleLegendaryOptions(
    cardId: string,
    state: RunState
  ): Array<{
    id: string;
    name: string;
    description: string;
    effectType: string;
    effectConfig: Record<string, unknown>;
    tags: string[];
  }> {
    const pool = this.getLegendaryPoolForCard(cardId);
    const alreadyChosen = state.runUpgradeState.ownedCards[cardId]?.legendaryEvolutionId;
    return pool.filter((option) => option.id !== alreadyChosen);
  }

  generateLegendaryEvolutionChoices(
    cardId: string,
    state: RunState,
    count: number = 2,
    seed: number = Date.now()
  ): Array<{
    id: string;
    name: string;
    description: string;
    effectType: string;
    effectConfig: Record<string, unknown>;
    tags: string[];
  }> {
    const eligible = this.getEligibleLegendaryOptions(cardId, state);
    if (eligible.length === 0) {
      console.warn(`[LevelUpSystem] No eligible Legendary options for card "${cardId}".`);
      return [];
    }
    if (eligible.length <= count) {
      return [...eligible];
    }
    const shuffled = [...eligible];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i, 0, i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  applyLegendaryEvolution(
    state: RunState,
    cardId: string,
    legendaryEvolutionId: string
  ): string {
    const cardState = state.runUpgradeState.ownedCards[cardId];
    if (!cardState) {
      return `[Legendary Evolution] Card "${cardId}" not owned. Safe fallback.`;
    }

    const eligible = this.getEligibleLegendaryOptions(cardId, state);
    const chosen = eligible.find((opt) => opt.id === legendaryEvolutionId);
    if (!chosen) {
      console.warn(`[LevelUpSystem] Legendary option "${legendaryEvolutionId}" not found for card "${cardId}". Safe fallback applied.`);
      cardState.readyToEvolve = false;
      cardState.legendaryEvolutionId = legendaryEvolutionId;
      return `Legendary evolution applied: ${legendaryEvolutionId}. Festival celebration complete!`;
    }

    state.runUpgradeState.ownedCards[cardId] = {
      ...cardState,
      readyToEvolve: false,
      legendaryEvolutionId: chosen.id
    };

    state.levelUpScreenState.pendingLegendaryEvolution = null;

    // Apply effect via the shared handler
    const message = upgradeCardEffectHandler.applyCardEffect(state, cardId, chosen.effectType, chosen.effectConfig, 5);
    return `Legendary Evolution: ${chosen.name}! ${message}`;
  }

  hasPendingLegendaryEvolution(state: RunState): boolean {
    const pending = state.levelUpScreenState.pendingLegendaryEvolution;
    if (!pending || !pending.cardId) return false;
    const card = state.runUpgradeState.ownedCards[pending.cardId];
    if (!card || !card.readyToEvolve || card.legendaryEvolutionId) {
      // Stale pending — clear it
      state.levelUpScreenState.pendingLegendaryEvolution = null;
      return false;
    }
    return true;
  }

  getCardOfferWeight(state: RunState, cardId: string): number {
    const existing = state.runUpgradeState.ownedCards[cardId];
    if (!existing) return 100;
    if (existing.level >= 5 || this.isCardLegendary(state, cardId)) return 0;
    const weights: Record<number, number> = {
      1: 150,
      2: 220,
      3: 320,
      4: 500
    };
    return weights[existing.level] ?? 100;
  }

  canApplyCardToRun(state: RunState, cardId: string, category: UpgradeCategory): boolean {
    if (this.isCardAlreadyOwned(state, cardId)) {
      const existing = state.runUpgradeState.ownedCards[cardId];
      return existing.level < 5;
    }
    return this.canSelectCategory(state, category);
  }

  filterLevelUpChoicesByCategory(
    state: RunState,
    category: UpgradeCategory,
    count = 3,
    seed: string | number = this.defaultChoiceSeed(state)
  ): LevelUpUpgradeContent[] {
    const baseSeed = this.hashSeed(seed);

    const newCards = this.loadNewCardsForCategory(state, category);
    let pool: LevelUpUpgradeContent[];

    if (newCards.length >= 3) {
      pool = newCards;
    } else {
      const legacyCards = contentRegistry.listEnabled<LevelUpUpgradeContent>('upgrade')
        .filter((upg) => upg.levelUpOnly === true || upg.id.startsWith('upg_lvl_'))
        .filter((upg) => this.canOfferUpgrade(state, upg))
        .filter((upg) => !this.isCardExcludedFromOffers(state, upg.id))
        .filter((upg) => {
          if (category === 'hero') return upg.upgradeType === 'hero_specific';
          if (category === 'board') return upg.upgradeType === 'general' || upg.upgradeType === undefined;
          if (category === 'fever') return (upg.upgradeType === 'general' || upg.upgradeType === undefined) && (upg.effectId === 'lvl_fever_gain' || upg.id.includes('fever'));
          return true;
        })
        .sort((left, right) => left.id.localeCompare(right.id));

      const mergedIds = new Set(newCards.map(c => c.id));
      const uniqueLegacy = legacyCards.filter(c => !mergedIds.has(c.id));
      pool = [...newCards, ...uniqueLegacy];
    }

    const chosen: LevelUpUpgradeContent[] = [];
    if (pool.length <= 0) return chosen;

    const heroEligible = pool.filter((u) => (u as LevelUpUpgradeContent & { heroId?: string }).heroId === state.hero.id);
    if (category === 'hero' && state.playerLevelState.level >= 3 && heroEligible.length > 0) {
      const heroPick = this.seededWeightedPick(heroEligible, (upg) => this.getCardOfferWeight(state, upg.id), baseSeed + 17);
      chosen.push(heroPick);
    }

    let rollIndex = 0;
    while (chosen.length < count) {
      const remaining = pool.filter((upg) => !chosen.some((existing) => existing.id === upg.id));
      if (remaining.length <= 0) break;
      const pick = this.seededWeightedPick(remaining, (upg) => this.getCardOfferWeight(state, upg.id), baseSeed + 211 + rollIndex * 53);
      chosen.push(pick);
      rollIndex += 1;
    }

    const uniqueRemaining = pool.filter((upg) => !chosen.some((existing) => existing.id === upg.id));
    while (chosen.length < count && uniqueRemaining.length > 0) {
      const item = uniqueRemaining.shift()!;
      chosen.push(item);
    }

    while (chosen.length < count) {
      chosen.push({
        id: "upg_lvl_fallback_" + chosen.length,
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

  private loadNewCardsForCategory(state: RunState, category: UpgradeCategory): LevelUpUpgradeContent[] {
    type UpgradeCardEntry = {
      id: string; name: string; description?: string; flavorText?: string;
      iconKey?: string; rarity?: string; category: string;
      heroId?: string; isGenericHeroCard?: boolean; enabled?: boolean;
      levels?: Array<{ effectType?: string; title?: string; description?: string }>;
      tags?: string[];
    };
    const allCards = contentRegistry.listEnabled<UpgradeCardEntry>('upgradeCard');
    return allCards
      .filter((card) => card.category === category)
      .filter((card) => !this.isCardExcludedFromOffers(state, card.id))
      .filter((card) => {
        if (category === 'hero') {
          if (!card.heroId && !card.isGenericHeroCard) return false;
          if (card.heroId && card.heroId !== state.hero.id) return false;
        }
        return true;
      })
      .map((card) => ({
        id: card.id,
        name: card.name || card.id,
        description: card.description || '',
        flavorText: card.flavorText,
        iconKey: card.iconKey || 'placeholder_upgrade',
        upgradeType: card.heroId ? 'hero_specific' as const : 'general' as const,
        cardType: card.heroId ? 'hero' as const : 'general' as const,
        rarity: card.rarity || 'common',
        stackLimit: 5,
        effectId: card.levels?.[0]?.effectType || 'lvl_reward_reroll',
        heroId: card.heroId,
        levelUpOnly: true,
        enabled: true
      }));
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

  private seededWeightedPick<T>(items: T[], getWeight: (item: T) => number, seed: number): T {
    if (items.length <= 1) return items[0];
    const totalWeight = items.reduce((total, item) => total + Math.max(0, getWeight(item)), 0);
    if (totalWeight <= 0) return this.seededPick(items, seed);
    let roll = seededRandom(seed, 0, totalWeight);
    for (const item of items) {
      roll -= Math.max(0, getWeight(item));
      if (roll <= 0) return item;
    }
    return items[items.length - 1];
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
