import type { RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { contentRegistry } from './ContentRegistry';
import type { BoardSystem } from './BoardSystem';
import type { CombatSystem } from './CombatSystem';

type ItemEntry = {
  id: string;
  name: string;
  effect?: {
    type?: string;
    mana?: number;
    heal?: number;
    value?: number;
    healAmount?: number;
    damageBonus?: number;
    amount?: number;
  };
};

export class ItemSystem {
  getItem(id: string): ItemEntry | null {
    return contentRegistry.getItem(id) as ItemEntry | null;
  }

  applyItem(state: RunState, itemId: string, boardSystem?: BoardSystem, combatSystem?: CombatSystem): string {
    const item = this.getItem(itemId);
    if (!item) {
      return 'The item fizzles harmlessly.';
    }

    const effect = item.effect ?? {};
    const type = effect.type;

    if (type === 'healAndBoost') {
      state.player.hp = clamp(state.player.hp + (effect.healAmount ?? 0), 0, state.player.maxHp);
      state.player.lineDamageBonus += (effect.damageBonus ?? 0);
      return `${item.name} restores HP and boosts your next attack!`;
    }

    if (type === 'restoreMana') {
      state.player.mana = clamp(state.player.mana + (effect.amount ?? 0), 0, state.player.maxMana);
      return `${item.name} restores mana!`;
    }

    if (type === 'mana_and_heal') {
      state.player.mana = clamp(state.player.mana + (effect.mana ?? 0), 0, state.player.maxMana);
      state.player.hp = clamp(state.player.hp + (effect.heal ?? 0), 0, state.player.maxHp);
      return `${item.name} restores mana and health!`;
    }

    if (type === 'luck') {
      state.player.gold += (effect.value ?? 10) * 5;
      state.gold = state.player.gold;
      return `${item.name} gleams! You found some quick gold!`;
    }

    // Following effects require battle context
    if (!boardSystem || !combatSystem) {
      return `${item.name} can only be used during battle!`;
    }

    if (type === 'clear_row') {
      boardSystem.clearMessiestRow();
      return `${item.name} clears a messy row!`;
    }

    if (type === 'clear_area') {
      boardSystem.clearRandomFilledArea(effect.value ?? 1);
      return `${item.name} blasts an area!`;
    }

    if (type === 'clear_cluster') {
      boardSystem.clearRandomCluster(effect.value ?? 4);
      return `${item.name} clears a cluster of blocks!`;
    }

    if (type === 'shield') {
      combatSystem.addPlayerShield(effect.value ?? 4);
      return `${item.name} grants shield!`;
    }

    if (type === 'refresh_hold') {
      state.board.holdPieceType = null;
      return `${item.name} refreshes your hold box!`;
    }

    if (type === 'delay_enemy') {
      if (state.activeEnemy) {
        state.activeEnemy.sleepTurns += (effect.value ?? 1);
        return `${item.name} puts the enemy to sleep for a moment!`;
      }
      return `${item.name} has no effect.`;
    }

    // Fallback for legacy effect format
    if (effect.mana) {
      state.player.mana = clamp(state.player.mana + effect.mana, 0, state.player.maxMana);
    }
    if (effect.heal || type === 'heal') {
      state.player.hp = clamp(state.player.hp + (effect.heal ?? effect.value ?? 0), 0, state.player.maxHp);
    }

    return `${item.name} is used.`;
  }
}
