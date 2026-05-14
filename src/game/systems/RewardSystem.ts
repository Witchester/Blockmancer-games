import type { RewardDefinition, RewardId, RoomType, RunState, SpellId } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { sampleSize, weightedChoice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { RelicSystem } from './RelicSystem';
import { UpgradeSystem } from './UpgradeSystem';
import { InventorySystem } from './InventorySystem';

type RewardContentEntry = {
  id: string;
  name: string;
  description?: string;
  rarity?: string;
  maxLevel?: number;
  stacking?: {
    stackable?: boolean;
    maxStacks?: number;
  };
};

type LootEntry = {
  contentType: string;
  id: string;
  weight?: number;
  rarity?: string;
  amount?: number;
  condition?: string;
};

type LootTable = {
  id: string;
  source: string;
  entries: LootEntry[];
  rollConfig?: {
    choicesShown?: number;
    allowDuplicates?: boolean;
    rarityBias?: string;
  };
};

const STAGE_LOOT_TABLES = [
  'loot_stage_sprinkle_sewers',
  'loot_stage_goblin_workshop',
  'loot_stage_frosty_pantry',
  'loot_stage_pillow_castle',
  'loot_stage_starfall_arcade',
  'loot_battle_default'
];

const SOURCE_TABLES: Record<string, string> = {
  fight: 'loot_battle_default',
  battle: 'loot_battle_default',
  elite: 'loot_elite_default',
  boss: 'loot_boss_default',
  shop: 'loot_shop_default',
  treasure: 'loot_treasure_default',
  event: 'loot_event_default'
};

const RARITY_BIAS: Record<string, Record<string, number>> = {
  low: { common: 1.25, uncommon: 0.9, rare: 0.55, epic: 0.3, legendary: 0.15 },
  normal: { common: 1, uncommon: 1, rare: 0.75, epic: 0.45, legendary: 0.25 },
  high: { common: 0.7, uncommon: 1, rare: 1.1, epic: 0.8, legendary: 0.45 },
  boss: { common: 0.35, uncommon: 0.9, rare: 1.35, epic: 1.15, legendary: 0.7 },
  debug: { common: 1, uncommon: 1, rare: 1, epic: 1, legendary: 1 }
};

export class RewardSystem {
  private readonly relicSystem = new RelicSystem();
  private readonly upgradeSystem = new UpgradeSystem();
  private readonly inventorySystem = new InventorySystem();

  getRewardPool(): RewardDefinition[] {
    const upgrades = contentRegistry.listEnabled<RewardContentEntry>('upgrade').map((entry) => ({
      id: entry.id,
      name: entry.name,
        type: 'Upgrade',
        description: entry.description ?? 'A helpful upgrade.',
        persistent: true,
        rarity: entry.rarity,
        contentType: 'upgrade'
      }));
    const relics = contentRegistry.listEnabled<RewardContentEntry>('relic').map((entry) => ({
      id: entry.id,
      name: entry.name,
      type: 'Relic',
      description: entry.description ?? 'A helpful relic.',
      persistent: true,
      rarity: entry.rarity,
      contentType: 'relic'
    }));
    const items = contentRegistry.listEnabled<RewardContentEntry>('item').map((entry) => ({
      id: entry.id,
      name: entry.name,
      type: 'Item',
      description: entry.description ?? 'A helpful consumable item.',
      persistent: false,
      rarity: entry.rarity,
      contentType: 'item'
    }));

    return [
      ...upgrades,
      ...relics,
      ...items,
      {
        id: 'gold-cache',
        name: 'Gold Cache',
        type: 'Gold',
        description: 'Gain 40 gold immediately.',
        persistent: false,
        rarity: 'common',
        amount: 40,
        contentType: 'gold'
      },
      {
        id: 'healing-glyph',
        name: 'Healing Glyph',
        type: 'Heal',
        description: 'Recover 8 HP immediately.',
        persistent: false,
        rarity: 'common',
        amount: 8,
        contentType: 'heal'
      }
    ];
  }

  getRandomRewards(count = 3, state?: RunState, source: RoomType | string = 'battle'): RewardDefinition[] {
    if (!state) {
      return sampleSize(this.getRewardPool(), count);
    }

    return this.rollRewards(state, source, count);
  }

  rerollRewards(state: RunState): string {
    if (state.rewardRerolls <= 0) {
      return 'No reward rerolls are ready right now.';
    }

    const count = Math.max(1, state.pendingRewards.length || 3);
    state.rewardRerolls -= 1;
    state.pendingRewards = this.rollRewards(state, state.pendingRewardSource || 'battle', count);
    return 'The reward cards twirl into a fresh set.';
  }

  applyReward(state: RunState, rewardId: RewardId): string {
    const reward = state.pendingRewards.find((entry) => entry.id === rewardId)
      ?? this.getRewardPool().find((entry) => entry.id === rewardId);
    if (!reward) {
      return 'The reward fades before it can take shape.';
    }

    if (reward.type === 'Relic') {
      const relic = contentRegistry.getOptionalById<RewardContentEntry>('relic', rewardId);
      const currentStacks = this.countOwned(state.relics, rewardId);
      const maxStacks = relic?.stacking?.stackable ? relic.stacking.maxStacks ?? 1 : 1;
      if (currentStacks >= maxStacks) {
        return `${reward.name} is already at its stack limit.`;
      }
      state.relics.push(rewardId);
      if (reward.persistent && !state.ownedRewards.includes(rewardId)) {
        state.ownedRewards.push(rewardId);
      }
      return this.relicSystem.applyRelic(state, rewardId);
    }

    if (reward.type === 'Upgrade' || reward.type === 'Spell Upgrade') {
      const upgrade = contentRegistry.getOptionalById<RewardContentEntry>('upgrade', rewardId);
      const currentLevel = this.countOwned(state.upgrades, rewardId);
      const maxLevel = upgrade?.maxLevel ?? 1;
      if (currentLevel >= maxLevel) {
        return `${reward.name} is already fully upgraded.`;
      }
      state.upgrades.push(rewardId);
      if (reward.persistent && !state.ownedRewards.includes(rewardId)) {
        state.ownedRewards.push(rewardId);
      }
      return this.upgradeSystem.applyUpgrade(state, rewardId, currentLevel + 1);
    }

    if (reward.type === 'Item') {
      this.inventorySystem.addItem(state, rewardId);
      return `${reward.name} added to your bag.`;
    }

    if (reward.type === 'Gold') {
      const amount = reward.amount ?? 40;
      state.player.gold += amount;
      state.player.totalGoldCollected += amount;
      state.gold = state.player.gold;
      return `${reward.name} grants ${amount} gold.`;
    }

    if (reward.type === 'Heal') {
      const amount = reward.amount ?? 8;
      state.player.hp = clamp(state.player.hp + amount, 0, state.player.maxHp);
      return `${reward.name} restores ${amount} HP.`;
    }

    return 'The reward hums, but nothing obvious happens.';
  }

  applySpellUpgrade(state: RunState, spellId: SpellId): string {
    return this.upgradeSystem.applySpellUpgrade(state, spellId);
  }

  applyPostBattleEffects(state: RunState): string[] {
    return this.relicSystem.applyPostBattleEffects(state);
  }

  private rollRewards(state: RunState, source: RoomType | string, countOverride?: number): RewardDefinition[] {
    const tables = this.getLootTables(state, source);
    const entries = tables.flatMap((table) => table.entries.map((entry) => ({ entry, table })))
      .filter(({ entry }) => this.canRollEntry(state, entry));
    const fallback = this.getRewardPool().filter((reward) => this.canOfferReward(state, reward));
    if (entries.length === 0) {
      return sampleSize(fallback, countOverride ?? 3);
    }

    const primaryTable = tables[0];
    const count = countOverride ?? primaryTable?.rollConfig?.choicesShown ?? 3;
    const allowDuplicates = primaryTable?.rollConfig?.allowDuplicates ?? false;
    const bias = primaryTable?.rollConfig?.rarityBias ?? 'normal';
    const rolled: RewardDefinition[] = [];
    const remaining = [...entries];

    while (rolled.length < count && remaining.length > 0) {
      const selected = weightedChoice(remaining, ({ entry }) => this.getEntryWeight(entry, bias));
      const reward = this.createRewardDefinition(selected.entry, selected.table.id);
      if (reward && (allowDuplicates || !rolled.some((existing) => existing.id === reward.id))) {
        rolled.push(reward);
      }

      if (!allowDuplicates) {
        const index = remaining.indexOf(selected);
        remaining.splice(index, 1);
      }
    }

    if (rolled.length < count) {
      for (const reward of sampleSize(fallback, count)) {
        if (rolled.length >= count) break;
        if (!rolled.some((existing) => existing.id === reward.id)) {
          rolled.push(reward);
        }
      }
    }

    return rolled;
  }

  private getLootTables(state: RunState, source: RoomType | string): LootTable[] {
    const ids = [SOURCE_TABLES[source] ?? SOURCE_TABLES.battle];
    if (source === 'battle' || source === 'fight') {
      ids.push(STAGE_LOOT_TABLES[state.stage - 1] ?? SOURCE_TABLES.battle);
    }

    return [...new Set(ids)]
      .map((id) => contentRegistry.getOptionalById<LootTable>('lootTable', id))
      .filter((table): table is LootTable => Boolean(table?.entries?.length));
  }

  private createRewardDefinition(entry: LootEntry, lootTableId: string): RewardDefinition | null {
    if (entry.contentType === 'gold') {
      const amount = entry.amount ?? 30;
      return {
        id: entry.id,
        name: amount >= 100 ? 'Festival Gold Chest' : 'Gold Bundle',
        type: 'Gold',
        description: `Gain ${amount} gold immediately.`,
        persistent: false,
        rarity: entry.rarity,
        amount,
        contentType: 'gold',
        source: lootTableId
      };
    }

    if (entry.contentType === 'heal' || entry.contentType === 'healing') {
      const amount = entry.amount ?? 8;
      return {
        id: entry.id,
        name: amount >= 12 ? 'Big Healing Glyph' : 'Healing Glyph',
        type: 'Heal',
        description: `Recover ${amount} HP immediately.`,
        persistent: false,
        rarity: entry.rarity,
        amount,
        contentType: 'heal',
        source: lootTableId
      };
    }

    if (entry.contentType === 'item') {
      return this.fromContentEntry('item', entry, 'Item', lootTableId);
    }

    if (entry.contentType === 'relic') {
      return this.fromContentEntry('relic', entry, 'Relic', lootTableId);
    }

    if (entry.contentType === 'upgrade') {
      return this.fromContentEntry('upgrade', entry, 'Upgrade', lootTableId);
    }

    return null;
  }

  private fromContentEntry(
    contentType: 'item' | 'relic' | 'upgrade',
    entry: LootEntry,
    rewardType: string,
    lootTableId: string
  ): RewardDefinition | null {
    const content = contentRegistry.getOptionalById<RewardContentEntry>(contentType, entry.id);
    if (!content) {
      return null;
    }

    return {
      id: content.id,
      name: content.name,
      type: rewardType,
      description: content.description ?? `A helpful ${rewardType.toLowerCase()}.`,
      persistent: rewardType !== 'Item',
      rarity: entry.rarity ?? content.rarity,
      contentType,
      source: lootTableId
    };
  }

  private canRollEntry(state: RunState, entry: LootEntry): boolean {
    const reward = this.createRewardDefinition(entry, 'preview');
    return Boolean(reward && this.canOfferReward(state, reward));
  }

  private canOfferReward(state: RunState, reward: RewardDefinition): boolean {
    if (reward.type === 'Upgrade') {
      const upgrade = contentRegistry.getOptionalById<RewardContentEntry>('upgrade', reward.id);
      return this.countOwned(state.upgrades, reward.id) < (upgrade?.maxLevel ?? 1);
    }

    if (reward.type === 'Relic') {
      const relic = contentRegistry.getOptionalById<RewardContentEntry>('relic', reward.id);
      const maxStacks = relic?.stacking?.stackable ? relic.stacking.maxStacks ?? 1 : 1;
      return this.countOwned(state.relics, reward.id) < maxStacks;
    }

    return true;
  }

  private getEntryWeight(entry: LootEntry, bias: string): number {
    const rarityWeight = RARITY_BIAS[bias]?.[entry.rarity ?? 'common'] ?? 1;
    return (entry.weight ?? 1) * rarityWeight;
  }

  private countOwned(ids: RewardId[], rewardId: RewardId): number {
    return ids.filter((id) => id === rewardId).length;
  }
}
