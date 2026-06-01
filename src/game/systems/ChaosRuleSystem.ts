import type { ActiveHazardKind, GameplayEffect, RewardModifier, RunState } from '../types/GameTypes';
import { weightedChoice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { GameplayEffectSystem } from './GameplayEffectSystem';

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
  private readonly effectSystem = new GameplayEffectSystem();

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

  applyStartEffects(
    state: RunState,
    addLog: (message: string) => void,
    board?: { addConfettiBlocks(count: number): number; addJunkRows(count: number): void; addStickyBlocks?(count: number): number; addRoyalBlocks?(count: number): number; addSpecialBlocksForSpell?(blockId: string, count: number): number; swapNextAndHold?(): boolean; clearRandomCluster?(count: number): number },
    reactiveHooks?: {
      queueHazard?: (kind: ActiveHazardKind, options?: { amount?: number; blockId?: string; delayPieces?: number; sourceId?: string }) => void;
      queueIncomingJunk?: (amount: number, sourceId: string, delayPieces: number, blockId?: string) => void;
    }
  ): void {
    const rule = this.getActive(state);
    if (!rule) {
      return;
    }
    addLog(`Festival Chaos: ${rule.name} - ${rule.description}`);
    this.effectSystem.applyMany(rule.effects, { state, board: board as never, addLog, sourceName: rule.id, ...reactiveHooks });
  }

  clear(state: RunState): void {
    state.activeChaosRule = undefined;
  }
}
