import type { BattleObjectiveProgress, BoardCell, CascadeResult, RewardDefinition, RunState } from '../types/GameTypes';
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
    state.battleObjectiveProgress = selected ? this.createProgress(state, selected.id) : undefined;
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
    if (!objective) {
      return 'Objective: none';
    }
    const progress = this.getProgressText(state, objective);
    return progress ? `Objective: ${objective.name} (${progress})` : `Objective: ${objective.name}`;
  }

  recordHold(state: RunState): void {
    if (state.battleObjectiveProgress) {
      state.battleObjectiveProgress.usedHold = true;
    }
  }

  recordSpellCast(state: RunState): void {
    if (state.battleObjectiveProgress) {
      state.battleObjectiveProgress.spellsCast += 1;
    }
  }

  recordEnemyAttack(state: RunState): void {
    if (state.battleObjectiveProgress) {
      state.battleObjectiveProgress.enemyAttacks += 1;
    }
  }

  recordCascade(state: RunState, cascade: CascadeResult): void {
    const progress = state.battleObjectiveProgress;
    if (!progress) {
      return;
    }
    progress.maxCascade = Math.max(progress.maxCascade, cascade.cascadeCount);
    progress.maxLinesWithOnePiece = Math.max(progress.maxLinesWithOnePiece, cascade.totalLinesCleared);
    if (cascade.cascadeCount > 1) {
      progress.maxCascade = Math.max(progress.maxCascade, cascade.cascadeCount);
    }
    for (const trigger of cascade.specialBlocksTriggered) {
      const blockId = trigger.split(':')[0];
      progress.clearedBlockCounts[blockId] = (progress.clearedBlockCounts[blockId] ?? 0) + 1;
    }
    if (cascade.totalLinesCleared > 0) {
      const junkClears = cascade.specialBlocksTriggered.filter((trigger) => this.isJunkBlockId(trigger.split(':')[0])).length;
      if (junkClears > 0) {
        progress.clearedBlockCounts.block_any_junk = (progress.clearedBlockCounts.block_any_junk ?? 0) + junkClears;
      }
    }
  }

  recordFeverTriggered(state: RunState): void {
    if (state.battleObjectiveProgress) {
      state.battleObjectiveProgress.feverTriggered = true;
    }
  }

  private isComplete(state: RunState, objective: BattleObjectiveEntry): boolean {
    const progress = this.getProgress(state, objective.id);
    const amount = typeof objective.requiredAmount === 'number' ? objective.requiredAmount : 1;
    switch (objective.targetType) {
      case 'cascade_count':
        return (progress?.maxCascade ?? 0) > amount || (amount <= 1 && (progress?.maxCascade ?? 0) >= 2);
      case 'lines_with_one_piece':
        return (progress?.maxLinesWithOnePiece ?? 0) >= amount;
      case 'clear_block_type':
        return (progress?.clearedBlockCounts[objective.targetId ?? ''] ?? 0) >= amount;
      case 'clear_all_junk':
        return this.countBlocks(state.board.grid, (cell) => typeof cell !== 'number' && this.isJunkBlockId(cell.blockId)) === 0;
      case 'no_spell':
        return (progress?.spellsCast ?? 0) === 0;
      case 'win_before_enemy_attacks':
        return (progress?.enemyAttacks ?? amount) < amount;
      case 'use_hold':
        return Boolean(progress?.usedHold);
      case 'cast_spells':
        return (progress?.spellsCast ?? 0) >= amount;
      case 'low_board_height':
        return this.isBoardBelowHalfHeight(state.board.grid);
      case 'trigger_fever':
        return Boolean(progress?.feverTriggered) || state.player.feverActiveLocks > 0;
      default:
        return false;
    }
  }

  private createProgress(state: RunState, objectiveId: string): BattleObjectiveProgress {
    return {
      objectiveId,
      startedAtPiecesLocked: state.runStats.piecesLocked,
      startedAtSpellsCast: state.runStats.spellsCast,
      startedAtHoldsUsed: state.runStats.holdsUsed,
      startedAtEnemyAttacks: state.runStats.enemyAttacks,
      maxCascade: 0,
      maxLinesWithOnePiece: 0,
      clearedBlockCounts: {},
      usedHold: false,
      spellsCast: 0,
      enemyAttacks: 0,
      feverTriggered: false
    };
  }

  private getProgress(state: RunState, objectiveId: string): BattleObjectiveProgress | undefined {
    if (state.battleObjectiveProgress?.objectiveId === objectiveId) {
      return state.battleObjectiveProgress;
    }
    return undefined;
  }

  private getProgressText(state: RunState, objective: BattleObjectiveEntry): string {
    const progress = this.getProgress(state, objective.id);
    const amount = typeof objective.requiredAmount === 'number' ? objective.requiredAmount : 1;
    switch (objective.targetType) {
      case 'cascade_count':
        return `${Math.min(amount, Math.max(0, (progress?.maxCascade ?? 0) - 1))}/${amount}`;
      case 'lines_with_one_piece':
        return `${progress?.maxLinesWithOnePiece ?? 0}/${amount}`;
      case 'clear_block_type':
        return `${progress?.clearedBlockCounts[objective.targetId ?? ''] ?? 0}/${amount}`;
      case 'clear_all_junk':
        return `${this.countBlocks(state.board.grid, (cell) => typeof cell !== 'number' && this.isJunkBlockId(cell.blockId))} junk left`;
      case 'no_spell':
        return `${progress?.spellsCast ?? 0} spells`;
      case 'win_before_enemy_attacks':
        return `${progress?.enemyAttacks ?? 0}/${amount} attacks`;
      case 'use_hold':
        return progress?.usedHold ? 'done' : '0/1';
      case 'cast_spells':
        return `${progress?.spellsCast ?? 0}/${amount}`;
      case 'low_board_height':
        return this.isBoardBelowHalfHeight(state.board.grid) ? 'tidy' : 'too tall';
      case 'trigger_fever':
        return progress?.feverTriggered || state.player.feverActiveLocks > 0 ? 'done' : 'waiting';
      default:
        return '';
    }
  }

  private countBlocks(grid: BoardCell[][], predicate: (cell: BoardCell) => boolean): number {
    return grid.reduce((total, row) => total + row.filter(predicate).length, 0);
  }

  private isBoardBelowHalfHeight(grid: BoardCell[][]): boolean {
    const firstOccupied = grid.findIndex((row) => row.some((cell) => cell !== 0));
    return firstOccupied === -1 || firstOccupied >= Math.floor(grid.length / 2);
  }

  private isJunkBlockId(blockId: string): boolean {
    return blockId.includes('junk') || blockId === 'block_sticky' || blockId === 'block_royal';
  }
}
