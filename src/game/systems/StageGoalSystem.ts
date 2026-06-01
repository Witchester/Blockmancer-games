import type { CascadeResult, GameplayEffect, RewardModifier, RunState, StageGoalProgress } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';

export type StageGoalEntry = {
  id: string;
  name: string;
  stageId: string;
  stage: number;
  description: string;
  targetType: string;
  targetId?: string;
  requiredAmount: number;
  successReward?: RewardModifier;
  failEffect?: GameplayEffect[];
  bossDebuff?: string;
  bossBuffOnFail?: string;
  enabled?: boolean;
};

export class StageGoalSystem {
  getGoalForStage(stage: number): StageGoalEntry | null {
    return contentRegistry.listEnabled<StageGoalEntry>('stageGoal').find((goal) => goal.stage === stage) ?? null;
  }

  ensureGoal(state: RunState): StageGoalEntry | null {
    const goal = this.getGoalForStage(state.stage);
    if (!goal) {
      return null;
    }
    if (!state.stageGoals[goal.id]) {
      state.stageGoals[goal.id] = {
        goalId: goal.id,
        progress: 0,
        requiredAmount: goal.requiredAmount,
        completed: false,
        failed: false
      };
    }
    return goal;
  }

  addProgress(state: RunState, targetType: string, amount = 1, targetId?: string): string | null {
    const goal = this.ensureGoal(state);
    if (!goal) {
      return null;
    }
    const targetMismatch = goal.targetType !== 'battle_objective' && goal.targetId && targetId && goal.targetId !== targetId;
    if (goal.targetType !== targetType || targetMismatch) {
      return null;
    }
    const progress = state.stageGoals[goal.id];
    if (!progress || progress.completed || progress.failed) {
      return null;
    }
    progress.progress = Math.min(progress.requiredAmount, progress.progress + amount);
    progress.completed = progress.progress >= progress.requiredAmount;
    return progress.completed
      ? `Stage goal complete: ${goal.name}.`
      : `Stage goal: ${goal.name} ${progress.progress}/${progress.requiredAmount}.`;
  }

  recordCascadeProgress(state: RunState, cascade: CascadeResult): string[] {
    const goal = this.ensureGoal(state);
    if (!goal || cascade.totalLinesCleared <= 0) {
      return [];
    }

    const messages: string[] = [];
    const triggeredIds = new Set(cascade.specialBlocksTriggered);
    if (goal.id === 'goal_stage1_lost_cupcakes' && (triggeredIds.has('block_cupcake') || triggeredIds.has('block_sprinkle'))) {
      const message = this.addProgress(state, 'cupcake_recovered', 1);
      if (message) {
        messages.push(message);
      }
    }

    if (goal.id === 'goal_stage5_combo_score' && cascade.cascadeCount > 1) {
      const message = this.addProgress(state, 'combo_score', cascade.cascadeCount);
      if (message) {
        messages.push(message);
      }
    }

    if (goal.id === 'goal_stage6_royal_seals' && triggeredIds.has('block_royal')) {
      const message = this.addProgress(state, 'royal_seal_broken', 1);
      if (message) {
        messages.push(message);
      }
    }

    return messages;
  }

  recordBattleVictoryProgress(
    state: RunState,
    context: { objectiveSucceeded: boolean; enemySleepTurns: number; roomType: RunState['currentRoomType'] }
  ): string[] {
    const goal = this.ensureGoal(state);
    if (!goal || context.roomType === 'boss') {
      return [];
    }

    const messages: string[] = [];
    if (goal.id === 'goal_stage2_goblin_machines' && context.objectiveSucceeded) {
      const message = this.addProgress(state, 'machine_disabled', 1);
      if (message) {
        messages.push(message);
      }
    }
    if (goal.id === 'goal_stage3_ice_cream_crates' && context.objectiveSucceeded) {
      const message = this.addProgress(state, 'crate_saved', 1);
      if (message) {
        messages.push(message);
      }
    }
    if (goal.id === 'goal_stage4_sleeping_guards' && (context.enemySleepTurns > 0 || context.objectiveSucceeded)) {
      const message = this.addProgress(state, 'guard_kept_asleep', 1);
      if (message) {
        messages.push(message);
      }
    }
    return messages;
  }

  getProgress(state: RunState): { goal: StageGoalEntry; progress: StageGoalProgress } | null {
    const goal = this.ensureGoal(state);
    if (!goal) {
      return null;
    }
    return { goal, progress: state.stageGoals[goal.id] };
  }

  applyBossStartEffect(state: RunState): string | null {
    const current = this.getProgress(state);
    const enemy = state.activeEnemy;
    if (!current || !enemy || enemy.roomType !== 'boss') {
      return null;
    }
    const { goal, progress } = current;
    if (progress.bossEffectApplied) {
      return null;
    }
    if (progress.completed) {
      progress.bossEffectApplied = true;
      switch (goal.bossDebuff) {
        case 'fewer_sticky_blocks':
          enemy.attackIntervalLocks += 1;
          enemy.attackCounter += 1;
          state.reactiveState.cleanupCouponPieces = Math.max(state.reactiveState.cleanupCouponPieces, 2);
          return `${goal.name} succeeded: sticky pressure starts lighter.`;
        case 'less_junk':
          enemy.attackIntervalLocks += 1;
          enemy.attackCounter += 1;
          return `${goal.name} succeeded: the boss machine drops junk more slowly.`;
        case 'start_shield':
          state.player.shield += 8;
          return `${goal.name} succeeded: you start the boss with 8 shield.`;
        case 'start_fever':
          state.player.fever = Math.max(state.player.fever, 50);
          return `${goal.name} succeeded: Fever starts halfway charged.`;
        case 'rare_treasure':
          state.reactiveState.sleepGuardPieces = Math.max(state.reactiveState.sleepGuardPieces, 3);
          return `${goal.name} succeeded: sleepy effects are softened for the boss battle.`;
        case 'weaken_boss':
          enemy.currentHp = Math.max(1, enemy.currentHp - Math.ceil(enemy.maxHp * 0.12));
          return `${goal.name} succeeded: ${enemy.name} starts weakened.`;
        default:
          return `${goal.name} succeeded: the boss looks less bossy.`;
      }
    }

    progress.failed = true;
    progress.bossEffectApplied = true;
    switch (goal.bossBuffOnFail) {
      case 'extra_sticky':
        state.activeHazards.push({
          hazardId: 'hazard_incoming_junk_queue',
          instanceId: `goal_fail_sticky_${Date.now()}`,
          kind: 'incoming_junk',
          name: 'Sticky Pressure',
          warningText: 'Missed cupcakes: extra sticky pressure enters the junk tray.',
          counterTags: ['counter_incoming_junk', 'counter_sticky'],
          counterWindowPieces: 3,
          remainingPieces: 3,
          severity: 'moderate',
          defaultFailureEffect: 'Sticky junk drops onto random columns.',
          itemCounterHints: ['Festival Mop', 'Snack Shield'],
          spellCounterHints: ['Fireball'],
          amount: 2,
          sourceId: goal.id,
          blockId: 'block_sticky'
        });
        return `${goal.name} missed: extra sticky pressure is queued with warning.`;
      case 'overclocked':
        enemy.attackCounter = Math.max(1, enemy.attackCounter - 1);
        return `${goal.name} missed: ${enemy.name} starts overclocked.`;
      case 'speed_spike':
        state.fallSpeed += 0.05;
        enemy.attackCounter = Math.max(1, enemy.attackCounter - 1);
        return `${goal.name} missed: the first speed wave arrives earlier.`;
      case 'extra_royal_blocks':
        state.activeHazards.push({
          hazardId: 'hazard_royal_pattern',
          instanceId: `goal_fail_royal_${Date.now()}`,
          kind: 'royal_pattern',
          name: 'Royal Pattern Pressure',
          warningText: 'Missed seals: the final phase begins with extra royal pattern pressure.',
          counterTags: ['counter_royal', 'counter_pattern'],
          counterWindowPieces: 3,
          remainingPieces: 3,
          severity: 'boss',
          defaultFailureEffect: 'Extra royal blocks appear.',
          itemCounterHints: ['Royal Eraser'],
          spellCounterHints: ['Bomb Rune', 'Clean Cut'],
          amount: 3,
          sourceId: goal.id
        });
        return `${goal.name} missed: extra royal pattern pressure is queued.`;
      case 'sleepier_boss':
        enemy.shield += 6;
        return `${goal.name} missed: ${enemy.name} starts with extra shield.`;
      case 'hydra_combo_punishment':
        enemy.shield += 6;
        return `${goal.name} missed: ${enemy.name} starts with a bonus-round shield.`;
      default:
        return `${goal.name} missed: the boss keeps its full festival plan.`;
    }
  }
}
