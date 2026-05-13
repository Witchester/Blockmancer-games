import type { BoardTickResult, CascadeResult, PieceState, TetrominoType } from '../types/GameTypes';
import { BOARD_COLS, BOARD_ROWS, TETROMINO_COLORS, TETROMINO_SHAPES } from '../utils/constants';
import { choice, randInt } from '../utils/random';

const PIECE_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export class BoardSystem {
  grid: number[][];
  currentPiece: PieceState | null;
  nextPieceType: TetrominoType;

  constructor() {
    this.grid = this.createEmptyGrid();
    this.currentPiece = null;
    this.nextPieceType = choice(PIECE_TYPES);
    this.reset();
  }

  reset(): void {
    this.grid = this.createEmptyGrid();
    this.currentPiece = null;
    this.nextPieceType = choice(PIECE_TYPES);
    this.spawnPiece();
  }

  private createEmptyGrid(): number[][] {
    return Array.from({ length: BOARD_ROWS }, () => Array.from({ length: BOARD_COLS }, () => 0));
  }

  private cloneMatrix(matrix: number[][]): number[][] {
    return matrix.map((row) => [...row]);
  }

  private makePiece(type: TetrominoType): PieceState {
    const matrix = this.cloneMatrix(TETROMINO_SHAPES[type]);
    return {
      type,
      matrix,
      color: TETROMINO_COLORS[type],
      x: Math.floor((BOARD_COLS - matrix[0].length) / 2),
      y: 0
    };
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]).reverse());
  }

  spawnPiece(): boolean {
    const piece = this.makePiece(this.nextPieceType);
    this.nextPieceType = choice(PIECE_TYPES);

    if (this.collides(piece.matrix, piece.x, piece.y)) {
      this.currentPiece = piece;
      return false;
    }

    this.currentPiece = piece;
    return true;
  }

  collides(matrix: number[][], offsetX: number, offsetY: number): boolean {
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex += 1) {
        if (!matrix[rowIndex][columnIndex]) {
          continue;
        }

        const x = offsetX + columnIndex;
        const y = offsetY + rowIndex;

        if (x < 0 || x >= BOARD_COLS || y >= BOARD_ROWS) {
          return true;
        }

        if (y >= 0 && this.grid[y][x] !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  move(dx: number, dy: number): boolean {
    if (!this.currentPiece) {
      return false;
    }

    const targetX = this.currentPiece.x + dx;
    const targetY = this.currentPiece.y + dy;
    if (this.collides(this.currentPiece.matrix, targetX, targetY)) {
      return false;
    }

    this.currentPiece.x = targetX;
    this.currentPiece.y = targetY;
    return true;
  }

  rotate(): boolean {
    if (!this.currentPiece) {
      return false;
    }

    const rotated = this.rotateMatrix(this.currentPiece.matrix);
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!this.collides(rotated, this.currentPiece.x + kick, this.currentPiece.y)) {
        this.currentPiece.matrix = rotated;
        this.currentPiece.x += kick;
        return true;
      }
    }

    return false;
  }

  tick(): BoardTickResult {
    if (this.move(0, 1)) {
      return {
        moved: true,
        locked: false,
        clearedLines: 0,
        toppedOut: false
      };
    }

    return this.lockPiece();
  }

  hardDrop(): BoardTickResult {
    while (this.move(0, 1)) {
      continue;
    }
    return this.lockPiece();
  }

  private lockPiece(): BoardTickResult {
    if (!this.currentPiece) {
      return {
        moved: false,
        locked: false,
        clearedLines: 0,
        toppedOut: false
      };
    }

    for (let rowIndex = 0; rowIndex < this.currentPiece.matrix.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < this.currentPiece.matrix[rowIndex].length; columnIndex += 1) {
        if (!this.currentPiece.matrix[rowIndex][columnIndex]) {
          continue;
        }

        const x = this.currentPiece.x + columnIndex;
        const y = this.currentPiece.y + rowIndex;

        if (y < 0) {
          continue;
        }

        this.grid[y][x] = this.currentPiece.color;
      }
    }

    const cascadeResult = this.clearLinesCascade();
    const spawned = this.spawnPiece();

    return {
      moved: false,
      locked: true,
      clearedLines: cascadeResult.totalLinesCleared,
      cascadeResult,
      toppedOut: !spawned
    };
  }

  private detectCompletedLines(): number[] {
    const completedLines: number[] = [];

    for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex += 1) {
      if (this.grid[rowIndex].every((cell) => cell !== 0)) {
        completedLines.push(rowIndex);
      }
    }

    return completedLines;
  }

  private removeCompletedLines(rowIndices: number[]): void {
    for (const rowIndex of rowIndices) {
      for (let columnIndex = 0; columnIndex < BOARD_COLS; columnIndex += 1) {
        if (this.grid[rowIndex][columnIndex] !== 0) {
          this.handleSpecialBlockClear(this.grid[rowIndex][columnIndex]);
          this.grid[rowIndex][columnIndex] = 0;
        }
      }
    }
  }

  private applyCascadeGravity(): number {
    let blocksDropped = 0;

    for (let columnIndex = 0; columnIndex < BOARD_COLS; columnIndex += 1) {
      const columnCells: Array<{ row: number; value: number }> = [];

      for (let rowIndex = BOARD_ROWS - 1; rowIndex >= 0; rowIndex -= 1) {
        const value = this.grid[rowIndex][columnIndex];
        if (value !== 0) {
          columnCells.push({ row: rowIndex, value });
        }
      }

      let targetRow = BOARD_ROWS - 1;
      for (const cell of columnCells) {
        if (cell.row !== targetRow) {
          blocksDropped += targetRow - cell.row;
        }
        this.grid[targetRow][columnIndex] = cell.value;
        targetRow -= 1;
      }

      for (let rowIndex = targetRow; rowIndex >= 0; rowIndex -= 1) {
        this.grid[rowIndex][columnIndex] = 0;
      }
    }

    return blocksDropped;
  }

  private handleSpecialBlockClear(cellValue: number): void {
    // Placeholder hook for future special block types.
    // Special block values can be reserved separately from tetromino colors.
    // For example:
    // - block_magic: bonus mana when cleared
    // - block_bomb: clears nearby cells then triggers another cascade
    // - block_stone: heavy block placeholder
    // - block_ice: future slide/freeze behavior
    // - block_void: deletes nearby blocks
  }

  private clearLinesCascade(): CascadeResult {
    const result: CascadeResult = {
      totalLinesCleared: 0,
      cascadeCount: 0,
      clearedLinesPerCascade: [],
      blocksDropped: 0,
      causedCombo: false
    };

    let completedLines = this.detectCompletedLines();
    while (completedLines.length > 0) {
      result.cascadeCount += 1;
      result.clearedLinesPerCascade.push(completedLines.length);
      result.totalLinesCleared += completedLines.length;

      this.removeCompletedLines(completedLines);
      result.blocksDropped += this.applyCascadeGravity();

      completedLines = this.detectCompletedLines();
    }

    result.causedCombo = result.cascadeCount > 1;
    return result;
  }

  addJunkRows(rowCount: number): void {
    for (let row = 0; row < rowCount; row += 1) {
      this.grid.shift();
      const gap = randInt(0, BOARD_COLS - 1);
      const junkRow = Array.from({ length: BOARD_COLS }, (_, index) => (index === gap ? 0 : 0x3f466f));
      this.grid.push(junkRow);
    }
  }

  clearRandomCluster(cellCount: number): number {
    const filledCells = this.collectFilledCells();
    let cleared = 0;
    for (let index = 0; index < cellCount && filledCells.length > 0; index += 1) {
      const selectedIndex = randInt(0, filledCells.length - 1);
      const [row, col] = filledCells.splice(selectedIndex, 1)[0];
      this.grid[row][col] = 0;
      cleared += 1;
    }
    return cleared;
  }

  clearRandomFilledArea(radius: number): number {
    const filledCells = this.collectFilledCells();
    if (filledCells.length === 0) {
      return 0;
    }

    const [centerRow, centerCol] = filledCells[randInt(0, filledCells.length - 1)];
    return this.clearArea(centerRow, centerCol, radius);
  }

  clearMessiestRow(): number {
    let bestRow = -1;
    let bestCount = 0;
    for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex += 1) {
      const count = this.grid[rowIndex].filter((cell) => cell !== 0).length;
      if (count > bestCount) {
        bestCount = count;
        bestRow = rowIndex;
      }
    }

    if (bestRow === -1) {
      return 0;
    }

    const cleared = this.grid[bestRow].filter((cell) => cell !== 0).length;
    this.grid[bestRow] = Array.from({ length: BOARD_COLS }, () => 0);
    return cleared;
  }

  getGhostPreviewTypes(): TetrominoType[] {
    return [this.nextPieceType, choice(PIECE_TYPES)];
  }

  getGhostPiece(): PieceState | null {
    if (!this.currentPiece) {
      return null;
    }

    let ghostY = this.currentPiece.y;
    while (!this.collides(this.currentPiece.matrix, this.currentPiece.x, ghostY + 1)) {
      ghostY += 1;
    }

    return {
      ...this.currentPiece,
      matrix: this.cloneMatrix(this.currentPiece.matrix),
      y: ghostY
    };
  }

  private clearArea(centerRow: number, centerCol: number, radius: number): number {
    let cleared = 0;

    for (let row = centerRow - radius; row <= centerRow + radius; row += 1) {
      for (let col = centerCol - radius; col <= centerCol + radius; col += 1) {
        if (row < 0 || row >= BOARD_ROWS || col < 0 || col >= BOARD_COLS) {
          continue;
        }

        if (this.grid[row][col] !== 0) {
          this.grid[row][col] = 0;
          cleared += 1;
        }
      }
    }

    return cleared;
  }

  private collectFilledCells(): Array<[number, number]> {
    const cells: Array<[number, number]> = [];
    for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < BOARD_COLS; columnIndex += 1) {
        if (this.grid[rowIndex][columnIndex] !== 0) {
          cells.push([rowIndex, columnIndex]);
        }
      }
    }
    return cells;
  }
}
