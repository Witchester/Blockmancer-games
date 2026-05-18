import type {
  BoardBlockCell,
  BoardCell,
  BoardTickResult,
  CascadeResult,
  ClearedBoardCell,
  PieceState,
  RunState,
  TetrominoType
} from '../types/GameTypes';
import { BOARD_COLS, BOARD_ROWS, TETROMINO_COLORS, TETROMINO_SHAPES } from '../utils/constants';
import { choice, randInt } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { OopsieSystem } from './OopsieSystem';

const PIECE_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const SPECIAL_BLOCK_IDS = [
  'block_sprinkle',
  'block_cupcake',
  'block_bomb',
  'block_star',
  'block_confetti',
  'block_toolbox',
  'block_royal'
];

export function getBoardCellColor(cell: BoardCell): number {
  return typeof cell === 'number' ? cell : cell.color;
}

export class BoardSystem {
  readonly columns: number;
  readonly rows: number;
  grid: BoardCell[][];
  currentPiece: PieceState | null;
  nextPieceType: TetrominoType;
  holdPieceType: TetrominoType | null = null;
  holdUsedThisPiece = false;
  private readonly completedLineBuffer: number[] = [];
  private readonly filledCellBuffer: Array<[number, number]> = [];
  private readonly oopsieSystem = new OopsieSystem();

  constructor(private readonly state?: RunState) {
    this.columns = state?.board.columns ?? BOARD_COLS;
    this.rows = state?.board.rows ?? BOARD_ROWS;
    this.grid = this.createEmptyGrid();
    this.currentPiece = null;
    this.nextPieceType = this.rollPieceType();
    this.restoreFromState();
  }

  reset(): void {
    this.grid = this.createEmptyGrid();
    this.currentPiece = null;
    this.nextPieceType = this.rollPieceType();
    this.holdPieceType = null;
    this.holdUsedThisPiece = false;
    this.spawnPiece();
  }

  private createEmptyGrid(): BoardCell[][] {
    return Array.from({ length: this.rows }, () => Array.from({ length: this.columns }, () => 0 as BoardCell));
  }

  private cloneMatrix(matrix: number[][]): number[][] {
    return matrix.map((row) => [...row]);
  }

  private cloneCell(cell: BoardCell): BoardCell {
    if (typeof cell === 'number') {
      return cell;
    }

    return {
      ...cell,
      clearEffects: cell.clearEffects.map((effect) => ({ ...effect }))
    };
  }

  private cloneGrid(matrix: BoardCell[][]): BoardCell[][] {
    return matrix.map((row) => row.map((cell) => this.cloneCell(cell)));
  }

  private restoreFromState(): void {
    const board = this.state?.board;
    if (!board?.grid?.length) {
      this.reset();
      return;
    }

    this.grid = this.cloneGrid(board.grid);
    this.currentPiece = board.currentPiece
      ? {
          ...board.currentPiece,
          matrix: this.cloneMatrix(board.currentPiece.matrix)
        }
      : null;
    this.nextPieceType = board.nextPieceType ?? this.rollPieceType();
    this.holdPieceType = board.holdPieceType ?? null;
    this.holdUsedThisPiece = board.holdUsedThisPiece;

    if (!this.currentPiece && !this.spawnPiece()) {
      this.currentPiece = this.makePiece(this.nextPieceType);
    }
  }

  private createBoardBlockCell(blockId: string): BoardBlockCell {
    const block = contentRegistry.getBoardBlock(blockId);
    const defaultColor = 0x888888;
    const color = typeof block?.color === 'string' ? parseInt(block.color.replace('#', ''), 16) : defaultColor;

    return {
      color,
      blockId: (typeof block?.id === 'string' ? block.id : blockId),
      blockType: (block?.blockType as BoardBlockCell['blockType']) ?? 'special',
      clearEffects: Array.isArray(block?.clearEffects) ? block.clearEffects.map((effect) => ({ ...effect })) : [],
    };
  }

  createBlockCell(blockId: string): BoardBlockCell {
    return this.createBoardBlockCell(blockId);
  }

  private isBoardBlock(cell: BoardCell): cell is BoardBlockCell {
    return typeof cell !== 'number';
  }

  private makePiece(type: TetrominoType): PieceState {
    const matrix = this.cloneMatrix(TETROMINO_SHAPES[type]);
    return {
      type,
      matrix,
      color: TETROMINO_COLORS[type],
      x: Math.floor((this.columns - matrix[0].length) / 2),
      y: 0
    };
  }

  private rollPieceType(): TetrominoType {
    return choice(this.state ? this.oopsieSystem.getPiecePool(this.state, PIECE_TYPES) : PIECE_TYPES);
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]).reverse());
  }

  spawnPiece(): boolean {
    const piece = this.makePiece(this.nextPieceType);
    this.nextPieceType = this.rollPieceType();
    this.holdUsedThisPiece = false;

    if (this.collides(piece.matrix, piece.x, piece.y)) {
      this.currentPiece = piece;
      return false;
    }

    this.currentPiece = piece;
    return true;
  }

  hold(): boolean {
    if (!this.currentPiece || this.holdUsedThisPiece) {
      return false;
    }

    const currentType = this.currentPiece.type;
    if (!this.holdPieceType) {
      this.holdPieceType = currentType;
      const spawned = this.spawnPiece();
      this.holdUsedThisPiece = true;
      return spawned;
    }

    const nextHeldType = this.holdPieceType;
    this.holdPieceType = currentType;
    const piece = this.makePiece(nextHeldType);
    if (this.collides(piece.matrix, piece.x, piece.y)) {
      this.holdPieceType = nextHeldType;
      return false;
    }

    this.currentPiece = piece;
    this.holdUsedThisPiece = true;
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

        if (x < 0 || x >= this.columns || y >= this.rows) {
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

        const specialChance = this.state?.hero.passiveId === 'passive_bombs_are_features' ? 0.14 : 0.08;
        const specialPool = this.state?.hero.passiveId === 'passive_bombs_are_features'
          ? [...SPECIAL_BLOCK_IDS, 'block_bomb', 'block_bomb', 'block_crumb_junk']
          : SPECIAL_BLOCK_IDS;
        this.grid[y][x] = Math.random() < specialChance
          ? this.createBoardBlockCell(choice(specialPool))
          : this.currentPiece.color;
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

  private detectCompletedLines(out: number[]): void {
    out.length = 0;

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex += 1) {
      let complete = true;
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
        if (this.grid[rowIndex][columnIndex] === 0) {
          complete = false;
          break;
        }
      }

      if (complete) {
        out.push(rowIndex);
      }
    }
  }

  private removeCompletedLines(rowIndices: number[], triggered: string[]): ClearedBoardCell[] {
    const clearedCells: ClearedBoardCell[] = [];
    for (const rowIndex of rowIndices) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
        const cellValue = this.grid[rowIndex][columnIndex];
        if (cellValue !== 0) {
          clearedCells.push({
            row: rowIndex,
            col: columnIndex,
            cell: this.cloneCell(cellValue)
          });
          this.handleSpecialBlockClear(rowIndex, columnIndex, cellValue, triggered);
          this.grid[rowIndex][columnIndex] = 0;
        }
      }
    }
    return clearedCells;
  }

  private applyCascadeGravity(): { blocksDropped: number; maxDroppedRows: number } {
    let blocksDropped = 0;
    let maxDroppedRows = 0;

    for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
      let targetRow = this.rows - 1;
      for (let rowIndex = this.rows - 1; rowIndex >= 0; rowIndex -= 1) {
        const value = this.grid[rowIndex][columnIndex];
        if (value !== 0) {
          if (rowIndex !== targetRow) {
            const droppedRows = targetRow - rowIndex;
            this.grid[targetRow][columnIndex] = this.cloneCell(value);
            this.grid[rowIndex][columnIndex] = 0;
            blocksDropped += droppedRows;
            maxDroppedRows = Math.max(maxDroppedRows, droppedRows);
          }
          targetRow -= 1;
        }
      }
    }

    return { blocksDropped, maxDroppedRows };
  }

  private handleSpecialBlockClear(row: number, column: number, cellValue: BoardCell, triggered: string[]): void {
    if (!this.isBoardBlock(cellValue)) {
      return;
    }

    triggered.push(cellValue.blockId);
    for (const effect of cellValue.clearEffects) {
      const valueSuffix = typeof effect.value === 'number' ? `:${effect.value}` : '';
      triggered.push(`${cellValue.blockId}:${effect.type}${valueSuffix}`);
      switch (effect.type) {
        case 'clear_board_area':
          this.clearArea(row, column, effect.value ?? 1);
          break;
        case 'damage_enemy':
          // Damage application is handled elsewhere in combat.
          break;
        case 'gain_mana':
        case 'heal_player':
        case 'boost_cascade':
        case 'random_bonus':
        case 'item_charge':
          break;
        default:
          break;
      }
    }
  }

  private clearLinesCascade(): CascadeResult {
    const result: CascadeResult = {
      totalLinesCleared: 0,
      cascadeCount: 0,
      clearedLinesPerCascade: [],
      blocksDropped: 0,
      specialBlocksTriggered: [],
      causedCombo: false,
      animationFrames: []
    };

    const completedLines = this.completedLineBuffer;
    this.detectCompletedLines(completedLines);
    while (completedLines.length > 0) {
      result.cascadeCount += 1;
      result.clearedLinesPerCascade.push(completedLines.length);
      result.totalLinesCleared += completedLines.length;

      const clearedLineCount = completedLines.length;
      const clearedCells = this.removeCompletedLines(completedLines, result.specialBlocksTriggered);
      result.animationFrames?.push({
        type: 'clear',
        grid: this.cloneGrid(this.grid),
        clearedLines: clearedLineCount,
        droppedRows: 0,
        clearedCells
      });

      const gravity = this.applyCascadeGravity();
      result.blocksDropped += gravity.blocksDropped;
      if (gravity.blocksDropped > 0) {
        result.animationFrames?.push({
          type: 'gravity',
          grid: this.cloneGrid(this.grid),
          clearedLines: clearedLineCount,
          droppedRows: gravity.maxDroppedRows
        });
      }

      this.detectCompletedLines(completedLines);
    }

    result.causedCombo = result.cascadeCount > 1;
    return result;
  }

  addJunkRows(rowCount: number): void {
    for (let row = 0; row < rowCount; row += 1) {
      this.grid.shift();
      const gap = randInt(0, this.columns - 1);
      const junkRow = Array.from({ length: this.columns }, (_, index) =>
        index === gap ? 0 : this.createBoardBlockCell(rowCount > 1 ? 'block_royal' : 'block_crumb_junk')
      );
      this.grid.push(junkRow);
    }
  }

  addJunkToColumn(column: number, blockId = 'block_crumb_junk'): boolean {
    const safeColumn = Math.max(0, Math.min(this.columns - 1, column));
    for (let row = this.rows - 1; row >= 0; row -= 1) {
      if (this.grid[row][safeColumn] === 0) {
        this.grid[row][safeColumn] = this.createBoardBlockCell(blockId);
        return true;
      }
    }
    return false;
  }

  addPatternJunk(): void {
    this.grid.shift();
    const junkRow = Array.from({ length: this.columns }, (_, index) =>
      index % 3 === 1 ? 0 : this.createBoardBlockCell('block_crumb_junk')
    );
    this.grid.push(junkRow);
  }

  addRoyalBlocks(count: number): number {
    return this.addSpecialBlocks('block_royal', count);
  }

  addConfettiBlocks(count: number): number {
    return this.addSpecialBlocks('block_confetti', count);
  }

  addStickyBlocks(count: number): number {
    return this.addSpecialBlocks('block_sticky', count);
  }

  addCloudJunkBlocks(count: number): number {
    return this.addSpecialBlocks('block_cloud_junk', count);
  }

  addSpecialBlocksForSpell(blockId: string, count: number): number {
    return this.addSpecialBlocks(blockId, count);
  }

  setNextPieceType(type: TetrominoType): void {
    this.nextPieceType = type;
  }

  rerollActiveAndNext(): void {
    this.currentPiece = this.makePiece(this.rollPieceType());
    this.nextPieceType = this.rollPieceType();
    this.holdUsedThisPiece = false;
  }

  swapNextAndHold(): boolean {
    if (!this.holdPieceType) {
      this.holdPieceType = this.nextPieceType;
      this.nextPieceType = this.rollPieceType();
      return true;
    }

    const previousNext = this.nextPieceType;
    this.nextPieceType = this.holdPieceType;
    this.holdPieceType = previousNext;
    return true;
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
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex += 1) {
      let count = 0;
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
        if (this.grid[rowIndex][columnIndex] !== 0) {
          count += 1;
        }
      }
      if (count > bestCount) {
        bestCount = count;
        bestRow = rowIndex;
      }
    }

    if (bestRow === -1) {
      return 0;
    }

    for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
      this.grid[bestRow][columnIndex] = 0;
    }
    return bestCount;
  }

  clearBlocksByIds(blockIds: string[], maxCount: number): number {
    const targets = new Set(blockIds);
    let cleared = 0;
    for (let row = 0; row < this.rows && cleared < maxCount; row += 1) {
      for (let col = 0; col < this.columns && cleared < maxCount; col += 1) {
        const cell = this.grid[row][col];
        if (typeof cell !== 'number' && targets.has(cell.blockId)) {
          this.grid[row][col] = 0;
          cleared += 1;
        }
      }
    }
    return cleared;
  }

  convertBlocksByIds(blockIds: string[], replacementColor: number, maxCount: number): number {
    const targets = new Set(blockIds);
    let converted = 0;
    for (let row = 0; row < this.rows && converted < maxCount; row += 1) {
      for (let col = 0; col < this.columns && converted < maxCount; col += 1) {
        const cell = this.grid[row][col];
        if (typeof cell !== 'number' && targets.has(cell.blockId)) {
          this.grid[row][col] = replacementColor;
          converted += 1;
        }
      }
    }
    return converted;
  }

  clearTopOccupiedCells(maxCount: number): number {
    let cleared = 0;
    for (let row = 0; row < this.rows && cleared < maxCount; row += 1) {
      for (let col = 0; col < this.columns && cleared < maxCount; col += 1) {
        if (this.grid[row][col] !== 0) {
          this.grid[row][col] = 0;
          cleared += 1;
        }
      }
    }
    return cleared;
  }

  getGhostPreviewTypes(): TetrominoType[] {
    return [this.nextPieceType, this.rollPieceType()];
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
        if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) {
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
    const cells = this.filledCellBuffer;
    cells.length = 0;
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
        if (this.grid[rowIndex][columnIndex] !== 0) {
          cells.push([rowIndex, columnIndex]);
        }
      }
    }
    return cells;
  }

  private addSpecialBlocks(blockId: string, count: number): number {
    const emptyCells: Array<[number, number]> = [];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex += 1) {
        if (this.grid[rowIndex][columnIndex] === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      }
    }

    let added = 0;
    for (let index = 0; index < count && emptyCells.length > 0; index += 1) {
      const selectedIndex = randInt(0, emptyCells.length - 1);
      const [row, col] = emptyCells.splice(selectedIndex, 1)[0];
      this.grid[row][col] = this.createBoardBlockCell(blockId);
      added += 1;
    }

    return added;
  }

}
