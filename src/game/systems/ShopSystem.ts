import type { RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';
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
      transition: 'map',
      messages: ['You buy healing draughts.']
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
    const reward = this.rewardSystem.getRandomRewards(1)[0];
    return {
      transition: 'map',
      messages: [this.rewardSystem.applyReward(state, reward.id)]
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
      transition: 'map',
      messages: ['A curse is lifted.']
    };
  }

  leave(): ShopResolution {
    return {
      transition: 'map',
      messages: ['You leave the shop with supplies untouched.']
    };
  }
}
