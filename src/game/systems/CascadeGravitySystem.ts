import type { BoardCell, CascadeResult, ClearedBoardCell } from '../types/GameTypes';

export type CascadeGravityOptions = {
  cloneCell: (cell: BoardCell) => BoardCell;
  isAnchoredCell: (cell: BoardCell) => boolean;
  onCellCleared?: (row: number, column: number, cell: BoardCell, triggered: string[]) => void;
};

function detectCompletedLines(grid: BoardCell[][], rows: number, columns: number, out: number[]): void {
  out.length = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    let complete = true;
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      if (grid[rowIndex][columnIndex] === 0) {
        complete = false;
        break;
      }
    }

    if (complete) {
      out.push(rowIndex);
    }
  }
}

function cloneGrid(grid: BoardCell[][], cloneCell: (cell: BoardCell) => BoardCell): BoardCell[][] {
  return grid.map((row) => row.map((cell) => cloneCell(cell)));
}

function removeCompletedLines(
  grid: BoardCell[][],
  rowIndices: number[],
  columns: number,
  triggered: string[],
  options: CascadeGravityOptions
): ClearedBoardCell[] {
  const clearedCells: ClearedBoardCell[] = [];
  for (const rowIndex of rowIndices) {
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const cellValue = grid[rowIndex][columnIndex];
      if (cellValue !== 0) {
        clearedCells.push({
          row: rowIndex,
          col: columnIndex,
          cell: options.cloneCell(cellValue)
        });
        options.onCellCleared?.(rowIndex, columnIndex, cellValue, triggered);
        grid[rowIndex][columnIndex] = 0;
      }
    }
  }
  return clearedCells;
}

function applyCascadeGravity(
  grid: BoardCell[][],
  rows: number,
  columns: number,
  options: CascadeGravityOptions
): { blocksDropped: number; maxDroppedRows: number } {
  let blocksDropped = 0;
  let maxDroppedRows = 0;

  for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
    let targetRow = rows - 1;
    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex -= 1) {
      const value = grid[rowIndex][columnIndex];
      if (value !== 0) {
        if (options.isAnchoredCell(value)) {
          targetRow = rowIndex - 1;
          continue;
        }
        if (rowIndex !== targetRow) {
          const droppedRows = targetRow - rowIndex;
          grid[targetRow][columnIndex] = options.cloneCell(value);
          grid[rowIndex][columnIndex] = 0;
          blocksDropped += droppedRows;
          maxDroppedRows = Math.max(maxDroppedRows, droppedRows);
        }
        targetRow -= 1;
      }
    }
  }

  return { blocksDropped, maxDroppedRows };
}

export function resolveCascadeGravity(
  grid: BoardCell[][],
  columns: number,
  rows: number,
  options: CascadeGravityOptions
): CascadeResult {
  const result: CascadeResult = {
    totalLinesCleared: 0,
    cascadeCount: 0,
    clearedLinesPerCascade: [],
    blocksDropped: 0,
    specialBlocksTriggered: [],
    causedCombo: false,
    animationFrames: []
  };

  const completedLines: number[] = [];
  detectCompletedLines(grid, rows, columns, completedLines);
  while (completedLines.length > 0) {
    result.cascadeCount += 1;
    result.clearedLinesPerCascade.push(completedLines.length);
    result.totalLinesCleared += completedLines.length;

    const clearedLineCount = completedLines.length;
    const clearedCells = removeCompletedLines(grid, completedLines, columns, result.specialBlocksTriggered, options);
    result.animationFrames?.push({
      type: 'clear',
      grid: cloneGrid(grid, options.cloneCell),
      clearedLines: clearedLineCount,
      droppedRows: 0,
      clearedCells
    });

    const gravity = applyCascadeGravity(grid, rows, columns, options);
    result.blocksDropped += gravity.blocksDropped;
    if (gravity.blocksDropped > 0) {
      result.animationFrames?.push({
        type: 'gravity',
        grid: cloneGrid(grid, options.cloneCell),
        clearedLines: clearedLineCount,
        droppedRows: gravity.maxDroppedRows
      });
    }

    detectCompletedLines(grid, rows, columns, completedLines);
  }

  result.causedCombo = result.cascadeCount > 1;
  return result;
}
