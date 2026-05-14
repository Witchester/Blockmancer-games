import type { RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { choice } from '../utils/random';
import { RewardSystem } from './RewardSystem';

export type ShopResolution = {
  transition: 'stay' | 'map';
  messages: string[];
};

export class ShopSystem {
  constructor(private readonly rewardSystem: RewardSystem = new RewardSystem()) {}

  healForGold(state: RunState): ShopResolution {
    if (state.player.gold < 30) {
      return {
        transition: 'stay',
        messages: ['Not enough gold for healing.']
      };
    }

    state.player.gold -= 30;
    state.gold = state.player.gold;
    state.player.hp = clamp(state.player.hp + 8, 0, state.player.maxHp);
    return {
      transition: 'stay',
      messages: ['You buy fizzy healing draughts for 30 gold.']
    };
  }

  buyRandomReward(state: RunState): ShopResolution {
    if (state.player.gold < 60) {
      return {
        transition: 'stay',
        messages: ['Not enough gold for a relic.']
      };
    }

    state.player.gold -= 60;
    state.gold = state.player.gold;
    const reward = this.rewardSystem.getRandomRewards(1, state, 'shop')[0];
    state.pendingRewards = [reward];
    const message = this.rewardSystem.applyReward(state, reward.id);
    state.pendingRewards = [];
    return {
      transition: 'stay',
      messages: [message]
    };
  }

  removeCurse(state: RunState): ShopResolution {
    if (state.player.gold < 50 || state.player.curses <= 0) {
      return {
        transition: 'stay',
        messages: ['The merchant shrugs. No deal to make.']
      };
    }

    state.player.gold -= 50;
    state.gold = state.player.gold;
    state.player.curses -= 1;
    return {
      transition: 'stay',
      messages: ['An oopsie is cleaned up.']
    };
  }

  buyItem(state: RunState): ShopResolution {
    if (state.player.gold < 25) {
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
    
    state.player.gold -= 25;
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
}
