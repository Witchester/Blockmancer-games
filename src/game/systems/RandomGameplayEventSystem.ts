import type { ActiveHazardKind, GameplayEffect, RewardModifier, RunState } from '../types/GameTypes';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { GameplayEffectSystem } from './GameplayEffectSystem';

export type RandomGameplayEventEntry = {
  id: string;
  name: string;
  description: string;
  allowedStages: number[];
  allowedNodeTypes: Array<'normal' | 'elite' | 'boss' | 'event' | 'shop' | 'rest' | 'treasure'>;
  triggerTiming: 'battle_start' | 'piece_count' | 'enemy_turn' | 'map_node_enter' | 'event_choice' | 'boss_phase';
  triggerChance: number;
  maxPerRoom?: number;
  effects: GameplayEffect[];
  rewardModifier?: RewardModifier;
  failEffect?: GameplayEffect[];
  toneText?: string;
  enabled?: boolean;
};

type BoardHooks = {
  addStickyBlocks(count: number): number;
  addConfettiBlocks(count: number): number;
  addJunkRows(count: number): void;
  addRoyalBlocks(count: number): number;
  swapNextAndHold(): boolean;
  clearRandomCluster(count: number): number;
};

type ReactiveHooks = {
  queueHazard?: (kind: ActiveHazardKind, options?: { amount?: number; blockId?: string; delayPieces?: number; sourceId?: string }) => void;
  queueIncomingJunk?: (amount: number, sourceId: string, delayPieces: number, blockId?: string) => void;
};

export class RandomGameplayEventSystem {
  private readonly effectSystem = new GameplayEffectSystem();

  roll(state: RunState, triggerTiming: RandomGameplayEventEntry['triggerTiming']): RandomGameplayEventEntry | null {
    const maxActive = this.getMaxActive(state);
    if (state.activeRandomGameplayEvents.length >= maxActive) {
      return null;
    }

    const nodeType = this.getNodeType(state);
    const candidates = contentRegistry.listEnabled<RandomGameplayEventEntry>('randomGameplayEvent').filter((eventEntry) =>
      eventEntry.triggerTiming === triggerTiming &&
      eventEntry.allowedStages.includes(state.stage) &&
      eventEntry.allowedNodeTypes.includes(nodeType) &&
      !state.activeRandomGameplayEvents.includes(eventEntry.id) &&
      Math.random() <= eventEntry.triggerChance
    );
    const selected = candidates.length > 0 ? choice(candidates) : null;
    if (selected) {
      state.activeRandomGameplayEvents.push(selected.id);
    }
    return selected;
  }

  getActive(state: RunState): RandomGameplayEventEntry[] {
    return state.activeRandomGameplayEvents
      .map((id) => contentRegistry.getOptionalById<RandomGameplayEventEntry>('randomGameplayEvent', id))
      .filter((entry): entry is RandomGameplayEventEntry => Boolean(entry));
  }

  clearRoomEvents(state: RunState): void {
    state.activeRandomGameplayEvents = [];
  }

  applyEffects(state: RunState, eventEntry: RandomGameplayEventEntry, addLog: (message: string) => void, board?: BoardHooks, reactiveHooks?: ReactiveHooks): void {
    addLog(`Random Event: ${eventEntry.name} - ${eventEntry.toneText ?? eventEntry.description}`);
    this.effectSystem.applyMany(eventEntry.effects, { state, board, addLog, sourceName: eventEntry.id, ...reactiveHooks });
  }

  private getMaxActive(state: RunState): number {
    if (state.stage <= 2) {
      return 1;
    }
    if (state.stage <= 4) {
      return state.currentRoomType === 'elite' || state.currentRoomType === 'boss' ? 2 : 1;
    }
    return state.currentRoomType === 'fight' ? 1 : 2;
  }

  private getNodeType(state: RunState): RandomGameplayEventEntry['allowedNodeTypes'][number] {
    switch (state.currentRoomType) {
      case 'fight':
        return 'normal';
      case 'elite':
      case 'boss':
      case 'event':
      case 'shop':
      case 'rest':
      case 'treasure':
        return state.currentRoomType;
      default:
        return 'normal';
    }
  }
}
