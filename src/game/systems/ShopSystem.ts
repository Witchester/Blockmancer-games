import type { RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { choice } from '../utils/random';
import { OopsieSystem } from './OopsieSystem';
import { RewardSystem } from './RewardSystem';

export type ShopResolution = {
  transition: 'stay' | 'map';
  messages: string[];
};

export class ShopSystem {
  constructor(
    private readonly rewardSystem: RewardSystem = new RewardSystem(),
    private readonly oopsieSystem: OopsieSystem = new OopsieSystem()
  ) {}

  healForGold(state: RunState): ShopResolution {
    const cost = this.getScaledPrice(state, 30);
    if (state.player.gold < cost) {
      return {
        transition: 'stay',
        messages: ['Not enough gold for healing.']
      };
    }

    state.player.gold -= cost;
    state.gold = state.player.gold;
    state.player.hp = clamp(state.player.hp + 8, 0, state.player.maxHp);
    return {
      transition: 'stay',
      messages: [`You buy fizzy healing draughts for ${cost} gold.`]
    };
  }

  buyRandomReward(state: RunState): ShopResolution {
    const cost = this.getScaledPrice(state, 60);
    if (state.player.gold < cost) {
      return {
        transition: 'stay',
        messages: ['Not enough gold for a relic.']
      };
    }

    state.player.gold -= cost;
    state.gold = state.player.gold;
    const reward = this.rewardSystem.getRandomRewards(1, state, 'shop')[0];
    if (reward?.type === 'Item' && state.inventory.length >= state.player.inventoryCapacity) {
      state.player.gold += cost;
      state.gold = state.player.gold;
      return {
        transition: 'stay',
        messages: ['Your bag is full, so the merchant keeps that item on the shelf.']
      };
    }
    state.pendingRewards = [reward];
    const message = this.rewardSystem.applyReward(state, reward.id);
    state.pendingRewards = [];
    return {
      transition: 'stay',
      messages: [message]
    };
  }

  removeOopsie(state: RunState): ShopResolution {
    const cost = this.oopsieSystem.getRemovalCost(state);
    if (state.player.gold < cost || state.player.oopsies.length <= 0) {
      return {
        transition: 'stay',
        messages: ['The merchant has no oopsie cleanup to do.']
      };
    }

    state.player.gold -= cost;
    state.gold = state.player.gold;
    const removed = this.oopsieSystem.removeOopsie(state);
    return {
      transition: 'stay',
      messages: [removed ? `${removed.name} is cleaned up.` : 'An oopsie is cleaned up.']
    };
  }

  /** @deprecated use removeOopsie */
  removeCurse(state: RunState): ShopResolution {
    return this.removeOopsie(state);
  }

  buyItem(state: RunState): ShopResolution {
    const cost = this.getScaledPrice(state, 25);
    if (state.player.gold < cost) {
      return {
        transition: 'stay',
        messages: ['Not enough gold for an item.']
      };
    }
    if (state.inventory.length >= state.player.inventoryCapacity) {
      return {
        transition: 'stay',
        messages: ['Your bag is full!']
      };
    }
    
    state.player.gold -= cost;
    state.gold = state.player.gold;
    
    const items = this.rewardSystem.getRewardPool().filter(r => r.type === 'Item');
    const reward = items.length > 0 ? choice(items) : null;
    
    if (reward) {
      return {
        transition: 'stay',
        messages: [this.rewardSystem.applyReward(state, reward.id)]
      };
    }
    
    return {
      transition: 'stay',
      messages: ['No items in stock.']
    };
  }

  leave(): ShopResolution {
    return {
      transition: 'map',
      messages: ['You leave the shop with supplies untouched.']
    };
  }

  getScaledPrice(state: RunState, baseCost: number): number {
    const stageMultiplier = 1 + Math.max(0, state.stage - 1) * 0.08;
    return this.oopsieSystem.adjustShopPrice(state, Math.round(baseCost * stageMultiplier));
  }
}
