import type { GameplayEffect, RewardModifier, RunState } from '../types/GameTypes';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';

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

export class RandomGameplayEventSystem {
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

  applyEffects(state: RunState, eventEntry: RandomGameplayEventEntry, addLog: (message: string) => void, board?: BoardHooks): void {
    addLog(`Random Event: ${eventEntry.name} - ${eventEntry.toneText ?? eventEntry.description}`);
    for (const effect of eventEntry.effects) {
      switch (effect.type) {
        case 'add_sticky_blocks':
          board?.addStickyBlocks(effect.value ?? 2);
          break;
        case 'add_confetti_blocks':
          board?.addConfettiBlocks(effect.value ?? 2);
          break;
        case 'add_junk_rows':
          board?.addJunkRows(Math.max(1, effect.value ?? 1));
          break;
        case 'add_royal_blocks':
          board?.addRoyalBlocks(effect.value ?? 2);
          break;
        case 'swap_next_hold':
          board?.swapNextAndHold();
          break;
        case 'clear_random_blocks':
          board?.clearRandomCluster(effect.value ?? 1);
          break;
        case 'gain_mana':
          state.player.mana = Math.min(state.player.maxMana, state.player.mana + (effect.value ?? 10));
          break;
        case 'heal_player':
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + (effect.value ?? 3));
          break;
        case 'gain_fever':
          state.player.fever = Math.min(100, state.player.fever + (effect.value ?? 10));
          break;
        case 'enemy_sleep':
          if (state.activeEnemy) {
            state.activeEnemy.sleepTurns += effect.value ?? 1;
          }
          break;
        case 'slow_fall_speed':
          state.fallSpeed = Math.max(0.7, state.fallSpeed - (effect.value ?? 0.08));
          break;
        case 'speed_spike':
          state.fallSpeed = Math.min(1.85, state.fallSpeed + (effect.value ?? 0.08));
          break;
        case 'stage_goal_progress':
          for (const progress of Object.values(state.stageGoals)) {
            if (!progress.completed && !progress.failed) {
              progress.progress = Math.min(progress.requiredAmount, progress.progress + (effect.value ?? 1));
              progress.completed = progress.progress >= progress.requiredAmount;
              break;
            }
          }
          break;
        default:
          break;
      }
    }
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
