import type { BoardCell, BoardSizeModifier, EncounterNodeType, RoomType, RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { contentRegistry } from './ContentRegistry';

type BoardSizeRuleEntry = BoardSizeModifier & {
  allowedStages?: number[];
  bossId?: string;
  phase?: number;
  enabled?: boolean;
};

const MIN_WIDTH = 6;
const MIN_HEIGHT = 12;
const MAX_WIDTH = 10;
const MAX_HEIGHT = 21;

const STAGE_BASE_SIZE: Record<number, { columns: number; rows: number }> = {
  1: { columns: 8, rows: 16 },
  2: { columns: 9, rows: 17 },
  3: { columns: 9, rows: 18 },
  4: { columns: 10, rows: 18 },
  5: { columns: 10, rows: 19 },
  6: { columns: 10, rows: 20 }
};

const DEFAULT_RULES: BoardSizeRuleEntry[] = [
  {
    id: 'bsize_elite_tight',
    encounterType: 'elite',
    widthDelta: -1,
    duration: 'room',
    reasonText: 'Elite room: tighter stacking space.'
  },
  {
    id: 'bsize_treasure_roomy',
    encounterType: 'treasure',
    heightDelta: 1,
    duration: 'room',
    reasonText: 'Treasure challenge: extra room to plan.'
  },
  {
    id: 'bsize_rest_roomy',
    encounterType: 'rest',
    heightDelta: 1,
    duration: 'room',
    reasonText: 'Rest room: cozy breathing room.'
  },
  {
    id: 'bsize_bloxley_square',
    encounterType: 'boss',
    bossId: 'mon_boss_king_bloxley',
    widthDelta: -2,
    duration: 'phase',
    reasonText: 'King Bloxley demands a narrower square-ish board.'
  }
];

export class BoardSizeModifierSystem {
  getBaseSize(stage: number): { columns: number; rows: number } {
    return STAGE_BASE_SIZE[clamp(Math.round(stage), 1, 6)] ?? STAGE_BASE_SIZE[1];
  }

  toEncounterType(roomType: RoomType): EncounterNodeType {
    switch (roomType) {
      case 'fight':
        return 'normal';
      case 'elite':
        return 'elite';
      case 'boss':
        return 'boss';
      case 'event':
        return 'event';
      case 'shop':
        return 'shop';
      case 'rest':
        return 'rest';
      case 'treasure':
        return 'treasure';
      default:
        return 'normal';
    }
  }

  applyEncounterBoardSize(state: RunState): string | null {
    const base = this.getBaseSize(state.stage);
    const encounterType = this.toEncounterType(state.currentRoomType);
    const rule = this.pickRule(state, encounterType);
    const width = clamp(base.columns + (rule?.widthDelta ?? 0), rule?.minWidth ?? MIN_WIDTH, rule?.maxWidth ?? MAX_WIDTH);
    const height = clamp(base.rows + (rule?.heightDelta ?? 0), rule?.minHeight ?? MIN_HEIGHT, rule?.maxHeight ?? MAX_HEIGHT);

    state.boardSizeModifier = rule ? { ...rule } : undefined;
    this.resizeBoard(state, width, height);
    return rule?.reasonText ?? null;
  }

  applyBossPhaseBoardSize(state: RunState): string | null {
    const enemy = state.activeEnemy;
    if (!enemy || enemy.roomType !== 'boss') {
      return null;
    }

    const base = this.getBaseSize(state.stage);
    const rules = this.getRules().filter((rule) =>
      rule.encounterType === 'boss' &&
      (!rule.bossId || rule.bossId === enemy.id) &&
      (!rule.phase || rule.phase === enemy.phase)
    );
    const rule = rules[0];
    if (!rule) {
      return null;
    }

    const width = clamp(base.columns + (rule.widthDelta ?? 0), rule.minWidth ?? MIN_WIDTH, rule.maxWidth ?? MAX_WIDTH);
    const height = clamp(base.rows + (rule.heightDelta ?? 0), rule.minHeight ?? MIN_HEIGHT, rule.maxHeight ?? MAX_HEIGHT);
    state.boardSizeModifier = { ...rule };
    this.resizeBoard(state, width, height);
    return rule.reasonText;
  }

  private pickRule(state: RunState, encounterType: EncounterNodeType): BoardSizeRuleEntry | null {
    const enemyId = state.activeEnemy?.id;
    const dynamicRules = this.getDynamicRules(state);
    const rules = [...this.getRules(), ...dynamicRules].filter((rule) =>
      rule.encounterType === encounterType &&
      (!rule.allowedStages || rule.allowedStages.includes(state.stage)) &&
      (!rule.bossId || rule.bossId === enemyId)
    );
    return rules[0] ?? null;
  }

  private getRules(): BoardSizeRuleEntry[] {
    return DEFAULT_RULES;
  }

  private getDynamicRules(state: RunState): BoardSizeRuleEntry[] {
    const rules: BoardSizeRuleEntry[] = [];
    for (const eventId of state.activeRandomGameplayEvents) {
      const eventEntry = contentRegistry.getOptionalById('randomGameplayEvent', eventId) as
        | { boardSizeModifiers?: BoardSizeRuleEntry[] }
        | null;
      if (Array.isArray(eventEntry?.boardSizeModifiers)) {
        rules.push(...eventEntry.boardSizeModifiers);
      }
    }
    return rules;
  }

  private resizeBoard(state: RunState, columns: number, rows: number): void {
    const safeColumns = clamp(Math.round(columns), MIN_WIDTH, MAX_WIDTH);
    const safeRows = clamp(Math.round(rows), MIN_HEIGHT, MAX_HEIGHT);
    if (state.board.columns === safeColumns && state.board.rows === safeRows && state.board.grid.length === safeRows) {
      return;
    }

    const oldGrid = state.board.grid ?? [];
    const nextGrid: BoardCell[][] = Array.from({ length: safeRows }, () => Array.from({ length: safeColumns }, () => 0 as BoardCell));
    const copyRows = Math.min(oldGrid.length, safeRows);
    for (let rowOffset = 0; rowOffset < copyRows; rowOffset += 1) {
      const sourceRow = oldGrid[oldGrid.length - 1 - rowOffset];
      const targetRow = safeRows - 1 - rowOffset;
      if (!Array.isArray(sourceRow)) {
        continue;
      }
      const copyColumns = Math.min(sourceRow.length, safeColumns);
      for (let column = 0; column < copyColumns; column += 1) {
        nextGrid[targetRow][column] = sourceRow[column] ?? 0;
      }
    }

    state.board.columns = safeColumns;
    state.board.rows = safeRows;
    state.board.grid = nextGrid;
    state.board.currentPiece = null;
    state.board.activePieceType = null;
    state.board.holdUsedThisPiece = false;
  }
}
