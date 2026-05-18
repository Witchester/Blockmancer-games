import type { GameplayEffect, RunState } from '../types/GameTypes';

export type GameplayEffectBoardHooks = {
  addStickyBlocks?(count: number): number;
  addConfettiBlocks?(count: number): number;
  addJunkRows?(count: number): void;
  addRoyalBlocks?(count: number): number;
  addSpecialBlocksForSpell?(blockId: string, count: number): number;
  swapNextAndHold?(): boolean;
  clearRandomCluster?(count: number): number;
};

export type GameplayEffectContext = {
  state: RunState;
  board?: GameplayEffectBoardHooks;
  addLog?: (message: string) => void;
  sourceName?: string;
};

export type GameplayEffectHandlerResult = {
  handled: boolean;
  message?: string;
};

export const SUPPORTED_GAMEPLAY_EFFECTS = [
  'add_sticky_blocks',
  'add_confetti_blocks',
  'add_junk_rows',
  'add_royal_blocks',
  'add_special_blocks',
  'swap_next_hold',
  'clear_random_blocks',
  'gain_mana',
  'heal_player',
  'gain_fever',
  'enemy_sleep',
  'slow_fall_speed',
  'speed_spike',
  'increase_fall_speed',
  'stage_goal_progress'
] as const;

export class GameplayEffectSystem {
  apply(effect: GameplayEffect, context: GameplayEffectContext): GameplayEffectHandlerResult {
    const { state, board } = context;
    const value = effect.value ?? 1;

    switch (effect.type) {
      case 'add_sticky_blocks': {
        const count = board?.addStickyBlocks?.(value) ?? 0;
        return { handled: true, message: `Sticky frosting adds ${count} block${count === 1 ? '' : 's'}.` };
      }
      case 'add_confetti_blocks': {
        const count = board?.addConfettiBlocks?.(value) ?? 0;
        return { handled: true, message: `Confetti adds ${count} sparkle block${count === 1 ? '' : 's'}.` };
      }
      case 'add_junk_rows':
        board?.addJunkRows?.(Math.max(1, value));
        return { handled: true, message: `${Math.max(1, value)} junk row${value === 1 ? '' : 's'} rumble in.` };
      case 'add_royal_blocks': {
        const count = board?.addRoyalBlocks?.(value) ?? 0;
        return { handled: true, message: `Royal blocks appear: ${count}.` };
      }
      case 'add_special_blocks': {
        const blockId = effect.blockId ?? effect.targetId ?? 'block_sprinkle';
        const count = board?.addSpecialBlocksForSpell?.(blockId, value) ?? 0;
        return { handled: true, message: `${count} ${blockId.replace(/^block_/, '').replace(/_/g, ' ')} block${count === 1 ? '' : 's'} appear.` };
      }
      case 'swap_next_hold':
        return { handled: true, message: board?.swapNextAndHold?.() ? 'Next and Hold swap places.' : 'Next and Hold try to swap, but nothing changes.' };
      case 'clear_random_blocks': {
        const cleared = board?.clearRandomCluster?.(value) ?? 0;
        return { handled: true, message: `A helpful pop clears ${cleared} block${cleared === 1 ? '' : 's'}.` };
      }
      case 'gain_mana':
        state.player.mana = Math.min(state.player.maxMana, state.player.mana + value);
        return { handled: true, message: `Mana +${value}.` };
      case 'heal_player':
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + value);
        return { handled: true, message: `HP +${value}.` };
      case 'gain_fever':
        state.player.fever = Math.min(100, state.player.fever + value);
        return { handled: true, message: `Fever +${value}.` };
      case 'enemy_sleep':
        if (state.activeEnemy) {
          state.activeEnemy.sleepTurns += value;
        }
        return { handled: true, message: 'The enemy gets a cozy sleepy beat.' };
      case 'slow_fall_speed':
        state.fallSpeed = Math.max(0.7, state.fallSpeed - value);
        return { handled: true, message: 'The board slows down for a breath.' };
      case 'speed_spike':
      case 'increase_fall_speed':
        state.fallSpeed = Math.min(1.85, state.fallSpeed + value);
        return { handled: true, message: 'The board gets a little faster.' };
      case 'stage_goal_progress':
        for (const progress of Object.values(state.stageGoals)) {
          if (!progress.completed && !progress.failed) {
            progress.progress = Math.min(progress.requiredAmount, progress.progress + value);
            progress.completed = progress.progress >= progress.requiredAmount;
            return { handled: true, message: `Stage goal progress ${progress.progress}/${progress.requiredAmount}.` };
          }
        }
        return { handled: true, message: 'The stage goal sparkles, but has nothing new to track.' };
      default:
        return {
          handled: false,
          message: `Unsupported effect "${effect.type}" from ${context.sourceName ?? 'content'} was safely ignored.`
        };
    }
  }

  applyMany(effects: GameplayEffect[], context: GameplayEffectContext): string[] {
    return effects.map((effect) => {
      const result = this.apply(effect, context);
      if (!result.handled && result.message) {
        console.warn(`[Blockmancer] ${result.message}`);
      }
      if (result.message) {
        context.addLog?.(result.message);
      }
      return result.message;
    }).filter((message): message is string => Boolean(message));
  }
}
