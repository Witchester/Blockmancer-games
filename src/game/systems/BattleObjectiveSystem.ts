import type { RewardDefinition, RunState } from '../types/GameTypes';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { RewardSystem } from './RewardSystem';

export type BattleObjectiveEntry = {
  id: string;
  name: string;
  description: string;
  allowedStages?: number[];
  allowedNodeTypes?: Array<'normal' | 'elite' | 'boss'>;
  targetType: string;
  targetId?: string;
  requiredAmount: number | 'all';
  reward: RewardDefinition;
  enabled?: boolean;
};

export class BattleObjectiveSystem {
  constructor(private readonly rewardSystem: RewardSystem = new RewardSystem()) {}

  rollForCombat(state: RunState): BattleObjectiveEntry | null {
    if (!['fight', 'elite', 'boss'].includes(state.currentRoomType) || Math.random() > 0.65) {
      state.activeBattleObjective = undefined;
      return null;
    }

    const nodeType = state.currentRoomType === 'fight' ? 'normal' : state.currentRoomType;
    const candidates = contentRegistry.listEnabled<BattleObjectiveEntry>('battleObjective').filter((objective) =>
      (!objective.allowedStages || objective.allowedStages.includes(state.stage)) &&
      (!objective.allowedNodeTypes || objective.allowedNodeTypes.includes(nodeType as 'normal' | 'elite' | 'boss'))
    );
    const selected = candidates.length > 0 ? choice(candidates) : null;
    state.activeBattleObjective = selected?.id;
    return selected;
  }

  getActive(state: RunState): BattleObjectiveEntry | null {
    return state.activeBattleObjective
      ? contentRegistry.getOptionalById<BattleObjectiveEntry>('battleObjective', state.activeBattleObjective)
      : null;
  }

  evaluateVictory(state: RunState): string | null {
    const objective = this.getActive(state);
    if (!objective || state.completedBattleObjectives.includes(objective.id)) {
      return null;
    }

    if (!this.isComplete(state, objective)) {
      return `Mini-objective missed: ${objective.name}.`;
    }

    state.completedBattleObjectives.push(objective.id);
    if (objective.reward?.id) {
      this.rewardSystem.applyReward(state, objective.reward.id);
    } else if (objective.reward?.amount) {
      state.player.gold += objective.reward.amount;
      state.gold = state.player.gold;
    }
    return `Mini-objective complete: ${objective.name}.`;
  }

  getSummary(state: RunState): string {
    const objective = this.getActive(state);
    return objective ? `Objective: ${objective.name}` : 'Objective: none';
  }

  private isComplete(state: RunState, objective: BattleObjectiveEntry): boolean {
    const amount = typeof objective.requiredAmount === 'number' ? objective.requiredAmount : 1;
    switch (objective.targetType) {
      case 'cascade_count':
        return state.lastCascadeLevel >= amount || state.runStats.maxCascade >= amount + 1;
      case 'lines_with_one_piece':
        return state.lastCascadeLines >= amount;
      case 'clear_block_type':
        return state.runStats.linesCleared >= amount;
      case 'clear_all_junk':
        return true;
      case 'no_spell':
        return state.runStats.spellsCast === 0;
      case 'win_before_enemy_attacks':
        return state.runStats.damageTaken === 0 || state.activeEnemy?.attackCounter !== undefined;
      case 'use_hold':
        return Boolean(state.board.holdPieceType);
      case 'cast_spells':
        return state.runStats.spellsCast >= amount;
      case 'low_board_height':
        return true;
      case 'trigger_fever':
        return state.player.feverActiveLocks > 0 || state.player.fever >= 100;
      default:
        return false;
    }
  }
}
