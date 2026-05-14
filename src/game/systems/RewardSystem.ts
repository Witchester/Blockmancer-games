import type { RewardDefinition, RewardId, RunState, SpellId } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { sampleSize } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { RelicSystem } from './RelicSystem';
import { UpgradeSystem } from './UpgradeSystem';
import { InventorySystem } from './InventorySystem';

type RewardContentEntry = {
  id: string;
  name: string;
  description?: string;
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
      persistent: true
    }));
    const relics = contentRegistry.listEnabled<RewardContentEntry>('relic').map((entry) => ({
      id: entry.id,
      name: entry.name,
      type: 'Relic',
      description: entry.description ?? 'A helpful relic.',
      persistent: true
    }));
    const items = contentRegistry.listEnabled<RewardContentEntry>('item').map((entry) => ({
      id: entry.id,
      name: entry.name,
      type: 'Item',
      description: entry.description ?? 'A helpful consumable item.',
      persistent: false
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
        persistent: false
      },
      {
        id: 'healing-glyph',
        name: 'Healing Glyph',
        type: 'Heal',
        description: 'Recover 8 HP immediately.',
        persistent: false
      }
    ];
  }

  getRandomRewards(count = 3): RewardDefinition[] {
    return sampleSize(this.getRewardPool(), count);
  }

  applyReward(state: RunState, rewardId: RewardId): string {
    const reward = this.getRewardPool().find((entry) => entry.id === rewardId);
    if (!reward) {
      return 'The reward fades before it can take shape.';
    }

    if (reward.type === 'Relic') {
      if (!state.relics.includes(rewardId)) {
        state.relics.push(rewardId);
      }
      if (reward.persistent && !state.ownedRewards.includes(rewardId)) {
        state.ownedRewards.push(rewardId);
      }
      return this.relicSystem.applyRelic(state, rewardId);
    }

    if (reward.type === 'Upgrade' || reward.type === 'Spell Upgrade') {
      if (!state.upgrades.includes(rewardId)) {
        state.upgrades.push(rewardId);
      }
      if (reward.persistent && !state.ownedRewards.includes(rewardId)) {
        state.ownedRewards.push(rewardId);
      }
      return this.upgradeSystem.applyUpgrade(state, rewardId);
    }

    if (reward.type === 'Item') {
      this.inventorySystem.addItem(state, rewardId);
      return `${reward.name} added to your bag.`;
    }

    if (reward.type === 'Gold') {
      state.player.gold += 40;
      state.player.totalGoldCollected += 40;
      state.gold = state.player.gold;
      return 'Gold Cache grants 40 gold.';
    }

    if (reward.type === 'Heal') {
      state.player.hp = clamp(state.player.hp + 8, 0, state.player.maxHp);
      return 'Healing Glyph restores 8 HP.';
    }

    return 'The reward hums, but nothing obvious happens.';
  }

  applySpellUpgrade(state: RunState, spellId: SpellId): string {
    return this.upgradeSystem.applySpellUpgrade(state, spellId);
  }

  applyPostBattleEffects(state: RunState): string[] {
    return this.relicSystem.applyPostBattleEffects(state);
  }
}
