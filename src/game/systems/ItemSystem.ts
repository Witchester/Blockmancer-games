import type { RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { contentRegistry } from './ContentRegistry';

type ItemEntry = {
  id: string;
  name: string;
  effect?: {
    type?: string;
    mana?: number;
    heal?: number;
    value?: number;
  };
};

export class ItemSystem {
  getItem(id: string): ItemEntry | null {
    return contentRegistry.getItem(id) as ItemEntry | null;
  }

  applyItem(state: RunState, itemId: string): string {
    const item = this.getItem(itemId);
    if (!item) {
      return 'The item fizzles harmlessly.';
    }

    const effect = item.effect ?? {};
    if (effect.mana) {
      state.player.mana = clamp(state.player.mana + effect.mana, 0, state.player.maxMana);
    }
    if (effect.heal || effect.type === 'heal') {
      state.player.hp = clamp(state.player.hp + (effect.heal ?? effect.value ?? 0), 0, state.player.maxHp);
    }

    return `${item.name} is used.`;
  }
}
