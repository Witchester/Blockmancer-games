import type { GameplayEffect, RewardModifier, RunState } from '../types/GameTypes';
import { weightedChoice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';

export type ChaosRuleEntry = {
  id: string;
  name: string;
  description: string;
  allowedStages: number[];
  allowedNodeTypes: Array<'normal' | 'elite' | 'boss'>;
  weight: number;
  effects: GameplayEffect[];
  rewardModifier?: RewardModifier;
  enabled?: boolean;
};

export class ChaosRuleSystem {
  rollForCombat(state: RunState): ChaosRuleEntry | null {
    if (!['fight', 'elite', 'boss'].includes(state.currentRoomType)) {
      state.activeChaosRule = undefined;
      return null;
    }

    const nodeType = state.currentRoomType === 'fight' ? 'normal' : state.currentRoomType;
    const chance = state.currentRoomType === 'boss' ? 0.35 : state.currentRoomType === 'elite' ? 0.45 : 0.3;
    if (Math.random() > chance) {
      state.activeChaosRule = undefined;
      return null;
    }

    const candidates = contentRegistry.listEnabled<ChaosRuleEntry>('chaosRule').filter((rule) =>
      rule.allowedStages.includes(state.stage) && rule.allowedNodeTypes.includes(nodeType as 'normal' | 'elite' | 'boss')
    );
    if (candidates.length === 0) {
      state.activeChaosRule = undefined;
      return null;
    }

    const selected = weightedChoice(candidates, (rule) => rule.weight);
    state.activeChaosRule = selected.id;
    return selected;
  }

  getActive(state: RunState): ChaosRuleEntry | null {
    return state.activeChaosRule ? contentRegistry.getOptionalById<ChaosRuleEntry>('chaosRule', state.activeChaosRule) : null;
  }

  applyStartEffects(state: RunState, addLog: (message: string) => void, board?: { addConfettiBlocks(count: number): number; addJunkRows(count: number): void }): void {
    const rule = this.getActive(state);
    if (!rule) {
      return;
    }
    addLog(`Festival Chaos: ${rule.name} - ${rule.description}`);
    for (const effect of rule.effects) {
      switch (effect.type) {
        case 'gain_mana':
          state.player.mana = Math.min(state.player.maxMana, state.player.mana + (effect.value ?? 5));
          break;
        case 'gain_fever':
          state.player.fever = Math.min(100, state.player.fever + (effect.value ?? 10));
          break;
        case 'add_confetti_blocks':
          board?.addConfettiBlocks(effect.value ?? 1);
          break;
        case 'add_junk_rows':
          board?.addJunkRows(Math.max(1, effect.value ?? 1));
          break;
        case 'increase_fall_speed':
          state.fallSpeed += effect.value ?? 0.04;
          break;
        default:
          break;
      }
    }
  }

  clear(state: RunState): void {
    state.activeChaosRule = undefined;
  }
}
