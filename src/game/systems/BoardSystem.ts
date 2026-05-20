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

export function getTetrominoBlockId(type: TetrominoType): string {
  const blockIds: Record<TetrominoType, string> = {
    I: 'block_blue',
    O: 'block_yellow',
    T: 'block_red',
    S: 'block_green',
    Z: 'block_red',
    J: 'block_blue',
    L: 'block_yellow'
  };
  return blockIds[type];
}

export function getBoardCellColor(cell: BoardCell): number {
  return typeof cell === 'number' ? cell : cell.color;
}

export class BoardSystem {
  readonly columns: number;
  readonly rows: number;
  grid: BoardCell[][];
  currentPiece: PieceState | null;
  nextPieceType: TetrominoType;
  private nextQueue: TetrominoType[] = [];
  holdPieceType: TetrominoType | null = null;
  holdUsedThisPiece = false;
  private readonly completedLineBuffer: number[] = [];
  private readonly filledCellBuffer: Array<[number, number]> = [];
  private readonly oopsieSystem = new OopsieSystem();
  private readonly junkBlockIds = new Set(['block_crumb_junk', 'block_cloud_junk', 'block_cracked_junk', 'block_royal', 'block_sticky']);

  constructor(private readonly state?: RunState) {
    this.columns = state?.board.columns ?? BOARD_COLS;
    this.rows = state?.board.rows ?? BOARD_ROWS;
    this.grid = this.createEmptyGrid();
    this.currentPiece = null;
    this.nextPieceType = this.rollPieceType();
    this.nextQueue = [this.nextPieceType];
    this.refillNextQueue(5);
    this.restoreFromState();
  }

  reset(): void {
    this.grid = this.createEmptyGrid();
    this.currentPiece = null;
    this.nextPieceType = this.rollPieceType();
    this.nextQueue = [this.nextPieceType];
    this.refillNextQueue(5);
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

    this.grid = this.cloneGrid(board.grid).map((row) => row.map((cell) => this.normalizeLegacyCell(cell)));
    this.currentPiece = board.currentPiece
      ? {
          ...board.currentPiece,
          matrix: this.cloneMatrix(board.currentPiece.matrix),
          blockIdsMatrix: board.currentPiece.blockIdsMatrix?.map((row) => row.map((cell) => cell))
        }
      : null;
    this.nextPieceType = board.nextPieceType ?? this.rollPieceType();
    this.nextQueue = Array.isArray(board.nextQueue)
      ? board.nextQueue.filter((entry): entry is TetrominoType => PIECE_TYPES.includes(entry as TetrominoType))
      : [];
    if (this.nextQueue.length === 0) {
      this.nextQueue = [this.nextPieceType];
    }
    this.refillNextQueue(5);
    this.nextPieceType = this.nextQueue[0];
    this.holdPieceType = board.holdPieceType ?? null;
    this.holdUsedThisPiece = board.holdUsedThisPiece;

    if (!this.currentPiece && !this.spawnPiece()) {
      this.currentPiece = this.makePiece(this.nextPieceType);
      this.refillNextQueue(5);
    }
  }

  private createBoardBlockCell(blockId: string): BoardBlockCell {
    const normalizedBlockId = this.normalizeBlockId(blockId);
    const block = contentRegistry.getBoardBlock(normalizedBlockId);
    const defaultColor = 0x888888;
    const color = typeof block?.color === 'string' ? parseInt(block.color.replace('#', ''), 16) : defaultColor;

    return {
      color,
      blockId: (typeof block?.id === 'string' ? block.id : normalizedBlockId),
      blockType: (block?.blockType as BoardBlockCell['blockType']) ?? 'special',
      clearEffects: Array.isArray(block?.clearEffects) ? block.clearEffects.map((effect) => ({ ...effect })) : [],
    };
  }

  private normalizeLegacyCell(cell: BoardCell): BoardCell {
    if (typeof cell === 'number') {
      if (cell === 0) {
        return 0;
      }
      return this.createBoardBlockCell(this.colorToBlockId(cell));
    }
    return this.createBoardBlockCell(this.normalizeBlockId(cell.blockId));
  }

  private colorToBlockId(color: number): string {
    if (color === TETROMINO_COLORS.I || color === TETROMINO_COLORS.J) {
      return 'block_blue';
    }
    if (color === TETROMINO_COLORS.O || color === TETROMINO_COLORS.L) {
      return 'block_yellow';
    }
    if (color === TETROMINO_COLORS.S) {
      return 'block_green';
    }
    if (color === TETROMINO_COLORS.T || color === TETROMINO_COLORS.Z) {
      return 'block_red';
    }
    return 'block_red';
  }

  private normalizeBlockId(rawId: string): string {
    const aliases: Record<string, string> = {
      red: 'block_red',
      blue: 'block_blue',
      green: 'block_green',
      yellow: 'block_yellow',
      sprinkle: 'block_sprinkle',
      spr_block_red: 'block_red',
      spr_block_blue: 'block_blue',
      spr_block_green: 'block_green',
      spr_block_yellow: 'block_yellow',
      spr_block_sprinkle: 'block_sprinkle',
      block_red_rune: 'block_red',
      block_blue_rune: 'block_blue',
      block_green_rune: 'block_green',
      block_yellow_rune: 'block_yellow',
      spr_block_red_rune: 'block_red',
      spr_block_blue_rune: 'block_blue',
      spr_block_green_rune: 'block_green',
      spr_block_yellow_rune: 'block_yellow'
    };
    return aliases[rawId] ?? rawId;
  }

  createBlockCell(blockId: string): BoardBlockCell {
    return this.createBoardBlockCell(blockId);
  }

  private isBoardBlock(cell: BoardCell): cell is BoardBlockCell {
    return typeof cell !== 'number';
  }

  private makePiece(type: TetrominoType): PieceState {
    const matrix = this.cloneMatrix(TETROMINO_SHAPES[type]);
    const blockIdsMatrix = this.rollPieceBlockIds(type, matrix);
    return {
      type,
      matrix,
      blockIdsMatrix,
      color: TETROMINO_COLORS[type],
      x: Math.floor((this.columns - matrix[0].length) / 2),
      y: 0
    };
  }

  private rollPieceBlockIds(type: TetrominoType, matrix: number[][]): (string | null)[][] {
    const specialChance = this.state?.hero.passiveId === 'passive_bombs_are_features' ? 0.14 : 0.08;
    const specialPool = this.state?.hero.passiveId === 'passive_bombs_are_features'
      ? [...SPECIAL_BLOCK_IDS, 'block_bomb', 'block_bomb', 'block_crumb_junk']
      : SPECIAL_BLOCK_IDS;
    const normalBlockId = getTetrominoBlockId(type);

    return matrix.map((row) =>
      row.map((cell) => {
        if (!cell) {
          return null;
        }
        return Math.random() < specialChance ? choice(specialPool) : normalBlockId;
      })
    );
  }

  private rollPieceType(): TetrominoType {
    return choice(this.state ? this.oopsieSystem.getPiecePool(this.state, PIECE_TYPES) : PIECE_TYPES);
  }

  private refillNextQueue(minLength: number): void {
    while (this.nextQueue.length < minLength) {
      this.nextQueue.push(this.rollPieceType());
    }
    this.nextPieceType = this.nextQueue[0] ?? this.rollPieceType();
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]).reverse());
  }

  spawnPiece(): boolean {
    const pieceType = this.nextQueue.shift() ?? this.nextPieceType;
    const piece = this.makePiece(pieceType);
    this.refillNextQueue(5);
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

        const blockId = this.currentPiece.blockIdsMatrix?.[rowIndex]?.[columnIndex] ?? getTetrominoBlockId(this.currentPiece.type);
        this.grid[y][x] = this.createBoardBlockCell(blockId);
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
          if (this.isJunkBlockCell(value)) {
            targetRow = rowIndex - 1;
            continue;
          }
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
    const topUnsafeRows = Math.max(2, Math.floor(this.rows * 0.22));
    for (let row = this.rows - 1; row >= topUnsafeRows; row -= 1) {
      if (this.grid[row][safeColumn] === 0) {
        this.grid[row][safeColumn] = this.createBoardBlockCell(blockId);
        return true;
      }
    }
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
    if (this.nextQueue.length === 0) {
      this.nextQueue.push(type);
    } else {
      this.nextQueue[0] = type;
    }
    this.refillNextQueue(5);
  }

  rerollActiveAndNext(): void {
    this.currentPiece = this.makePiece(this.rollPieceType());
    this.nextQueue = [this.rollPieceType()];
    this.refillNextQueue(5);
    this.nextPieceType = this.nextQueue[0];
    this.holdUsedThisPiece = false;
  }

  swapNextAndHold(): boolean {
    if (!this.holdPieceType) {
      this.holdPieceType = this.nextQueue[0] ?? this.nextPieceType;
      if (this.nextQueue.length > 0) {
        this.nextQueue.shift();
      }
      this.refillNextQueue(5);
      return true;
    }

    const previousNext = this.nextQueue[0] ?? this.nextPieceType;
    this.nextQueue[0] = this.holdPieceType;
    this.holdPieceType = previousNext;
    this.refillNextQueue(5);
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

  spawnFloatingBlock(blockId: string, column: number, row: number, countdownPieces: number): boolean {
    if (!this.state) {
      return false;
    }
    const safeColumn = Math.max(0, Math.min(this.columns - 1, column));
    const safeRow = Math.max(0, Math.min(this.rows - 1, row));
    this.state.activeHazards.push({
      hazardId: 'hazard_floaty_rune',
      instanceId: `board_float_${Date.now()}_${safeColumn}_${safeRow}`,
      kind: 'floating_block',
      name: 'Floaty Rune',
      warningText: 'A Floaty Rune is wobbling overhead!',
      counterTags: ['counter_float'],
      counterWindowPieces: Math.max(1, countdownPieces),
      remainingPieces: Math.max(1, countdownPieces),
      severity: 'minor',
      defaultFailureEffect: 'Drops as cloud junk.',
      itemCounterHints: ['Cloud Pin', 'Balloon Pop'],
      spellCounterHints: ['Bomb Rune', 'Clean Cut'],
      cascadeCounterHint: 'Clear space below it before it drops.',
      sourceId: 'board',
      blockId,
      onExpireBlockId: 'block_cloud_junk',
      column: safeColumn,
      row: safeRow
    });
    return true;
  }

  resolveFloatingCountdown(): number {
    if (!this.state) {
      return 0;
    }
    let expired = 0;
    this.state.activeHazards.forEach((hazard) => {
      if (hazard.kind === 'floating_block') {
        hazard.remainingPieces = Math.max(0, hazard.remainingPieces - 1);
        if (hazard.remainingPieces === 0) {
          expired += 1;
        }
      }
    });
    return expired;
  }

  pinFloatingBlocks(): number {
    if (!this.state) {
      return 0;
    }
    const floaters = this.state.activeHazards.filter((hazard) => hazard.kind === 'floating_block');
    floaters.forEach((hazard) => {
      this.addJunkToColumn(hazard.column ?? 0, hazard.blockId ?? 'block_floaty_rune');
    });
    this.state.activeHazards = this.state.activeHazards.filter((hazard) => hazard.kind !== 'floating_block');
    return floaters.length;
  }

  popFloatingBlocks(): number {
    if (!this.state) {
      return 0;
    }
    const before = this.state.activeHazards.length;
    this.state.activeHazards = this.state.activeHazards.filter((hazard) => hazard.kind !== 'floating_block');
    return before - this.state.activeHazards.length;
  }

  expireFloatingBlocks(): number {
    if (!this.state) {
      return 0;
    }
    const expired = this.state.activeHazards.filter((hazard) => hazard.kind === 'floating_block' && hazard.remainingPieces <= 0);
    expired.forEach((hazard) => {
      this.addJunkToColumn(hazard.column ?? 0, hazard.onExpireBlockId ?? 'block_cloud_junk');
    });
    this.state.activeHazards = this.state.activeHazards.filter((hazard) => !(hazard.kind === 'floating_block' && hazard.remainingPieces <= 0));
    return expired.length;
  }

  getFloatingBlocks() {
    return this.state?.activeHazards.filter((hazard) => hazard.kind === 'floating_block') ?? [];
  }

  hasFloatingBlocks(): boolean {
    return this.getFloatingBlocks().length > 0;
  }

  getGhostPreviewTypes(): TetrominoType[] {
    return this.getNextQueueTypes(2);
  }

  getNextQueueTypes(count = 4): TetrominoType[] {
    const safeCount = Math.max(1, count);
    this.refillNextQueue(Math.max(5, safeCount));
    return this.nextQueue.slice(0, safeCount);
  }

  getNextQueueSnapshot(): TetrominoType[] {
    this.refillNextQueue(5);
    return [...this.nextQueue];
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

  private isJunkBlockCell(cell: BoardCell): boolean {
    return typeof cell !== 'number' && this.junkBlockIds.has(cell.blockId);
  }

}
