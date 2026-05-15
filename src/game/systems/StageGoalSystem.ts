import type { GameplayEffect, RewardModifier, RunState, StageGoalProgress } from '../types/GameTypes';
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
    if (!goal || goal.targetType !== targetType || (goal.targetId && targetId && goal.targetId !== targetId)) {
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
    if (progress.completed) {
      switch (goal.bossDebuff) {
        case 'fewer_sticky_blocks':
          return `${goal.name} succeeded: the boss starts with fewer sticky blocks.`;
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
        case 'weaken_boss':
          enemy.currentHp = Math.max(1, enemy.currentHp - Math.ceil(enemy.maxHp * 0.12));
          return `${goal.name} succeeded: ${enemy.name} starts weakened.`;
        default:
          return `${goal.name} succeeded: the boss looks less bossy.`;
      }
    }

    progress.failed = true;
    switch (goal.bossBuffOnFail) {
      case 'extra_sticky':
        return `${goal.name} missed: extra sticky blocks may appear.`;
      case 'overclocked':
        enemy.attackCounter = Math.max(1, enemy.attackCounter - 1);
        return `${goal.name} missed: ${enemy.name} starts overclocked.`;
      case 'speed_spike':
        state.fallSpeed += 0.08;
        return `${goal.name} missed: a freezer draft speeds up the board.`;
      case 'extra_royal_blocks':
        return `${goal.name} missed: royal blocks are ready for the finale.`;
      default:
        return `${goal.name} missed: the boss keeps its full festival plan.`;
    }
  }
}
