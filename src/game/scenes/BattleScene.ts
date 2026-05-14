import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { SPELLS } from '../data/spells';
import { BoardSystem, getBoardCellColor } from '../systems/BoardSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { InputSystem } from '../systems/InputSystem';
import { SpellSystem } from '../systems/SpellSystem';
import type { BoardTickResult, SpellId } from '../types/GameTypes';
import { EventLog } from '../ui/EventLog';
import { Hud } from '../ui/Hud';
import { MobileControls } from '../ui/MobileControls';
import { ProgressBar } from '../ui/ProgressBar';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';
import {
  BASE_DROP_MS,
  BOARD_COLS,
  BOARD_ROWS,
  CELL_SIZE,
  COLORS,
  FONT_FAMILY,
  MAX_FALL_SPEED,
  TETROMINO_COLORS,
  TETROMINO_SHAPES
} from '../utils/constants';

export class BattleScene extends Phaser.Scene {
  private board!: BoardSystem;
  private combat!: CombatSystem;
  private spells!: SpellSystem;
  private hud!: Hud;
  private log!: EventLog;
  private boardCells: Phaser.GameObjects.Rectangle[][] = [];
  private enemyNameText?: Phaser.GameObjects.Text;
  private enemyStatsText?: Phaser.GameObjects.Text;
  private enemyIntentText?: Phaser.GameObjects.Text;
  private enemyCountdownText?: Phaser.GameObjects.Text;
  private upgradesText?: Phaser.GameObjects.Text;
  private enemyHpBar?: ProgressBar;
  private previewTiles: Phaser.GameObjects.Rectangle[] = [];
  private previewLabel?: Phaser.GameObjects.Text;
  private previewExtraText?: Phaser.GameObjects.Text;
  private holdText?: Phaser.GameObjects.Text;
  private inventoryText?: Phaser.GameObjects.Text;
  private feverText?: Phaser.GameObjects.Text;
  private inventoryExpanded = false;
  private inputSystem?: InputSystem;
  private compactLayout = false;
  private screenWidth = 0;
  private screenHeight = 0;
  private topSectionHeight = 0;
  private middleSectionHeight = 0;
  private bottomSectionHeight = 0;
  private boardOffsetX = 0;
  private boardOffsetY = 0;
  private previewCenterX = 0;
  private previewCenterY = 0;
  private controlsCenterX = 0;
  private controlsY = 0;
  private logX = 0;
  private logY = 0;
  private logWidth = 0;
  private logHeight = 0;
  private dropTimer = 0;
  private handlePause = () => this.combat.addLog('Pause menu is not open during this battle build.');

  constructor() {
    super('BattleScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    state.runStatus = 'battle';
    this.compactLayout = isCompactLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);

    if (!state.activeEnemy) {
      const enemy = game.enemySystem.spawnEnemy(state.currentRoomType, state.stage);
      if (!enemy) {
        this.scene.start('MapScene');
        return;
      }
      state.activeEnemy = enemy;
    }

    this.boardCells = [];
    this.previewTiles = [];
    this.dropTimer = 0;
    this.board = new BoardSystem();
    this.combat = new CombatSystem(state);
    this.spells = new SpellSystem(state, this.board, this.combat);

    const layout = getPortraitLayout(this);
    this.screenWidth = layout.width;
    this.screenHeight = layout.height;
    this.topSectionHeight = layout.topHeight;
    this.bottomSectionHeight = layout.bottomHeight;
    this.middleSectionHeight = layout.middleHeight;
    this.boardOffsetX = Math.round((this.screenWidth - BOARD_COLS * CELL_SIZE) / 2);
    this.boardOffsetY = this.topSectionHeight + 84;
    this.previewCenterX = this.screenWidth - 88;
    this.previewCenterY = this.topSectionHeight + 126;
    this.controlsCenterX = this.screenWidth / 2;
    this.controlsY = this.topSectionHeight + this.middleSectionHeight + Math.round(this.bottomSectionHeight / 2) - 4;
    this.logWidth = this.screenWidth - 48;
    this.logHeight = 100;
    this.logX = 24;
    this.logY = this.topSectionHeight + this.middleSectionHeight - this.logHeight - 12;

    this.drawLayout();
    this.buildBoard();
    this.createPreviewPanel();
    this.hud = new Hud(this, {
      compact: true,
      x: this.screenWidth / 2,
      y: 76,
      width: this.screenWidth - 64,
      height: 62
    });
    this.log = new EventLog(this, this.logX, this.logY, this.logWidth, this.logHeight);
    this.createMobileControls();
    this.createInputSystem();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    this.combat.addLog(`Battle started against ${state.activeEnemy.name}.`);
    this.syncBoardState();
    game.saveRun();
    this.renderAll();
  }

  private get sharedGame(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private drawLayout(): void {
    const topPanelWidth = this.screenWidth - 32;
    const topPanelHeight = this.topSectionHeight - 18;
    const topPanelCenterY = Math.round(this.topSectionHeight / 2) + 3;

    this.add.rectangle(this.screenWidth / 2, topPanelCenterY, topPanelWidth, topPanelHeight, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accent, 0.25);
    this.add.text(28, 20, 'Blockmancer Battle', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      fontStyle: 'bold'
    });

    this.add.text(this.screenWidth - 28, 24, `Stage ${this.sharedGame.runState.stage}`, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(1, 0);

    const middleCenterY = this.topSectionHeight + this.middleSectionHeight / 2;
    this.add.rectangle(this.screenWidth / 2, middleCenterY, this.screenWidth - 24, this.middleSectionHeight - 16, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accentSoft, 0.25);

    const controlsCenterY = this.topSectionHeight + this.middleSectionHeight + this.bottomSectionHeight / 2;
    this.add.rectangle(this.screenWidth / 2, controlsCenterY, this.screenWidth - 24, this.bottomSectionHeight - 16, COLORS.panel, 0.92).setStrokeStyle(2, COLORS.accent, 0.22);

    this.enemyNameText = this.add.text(28, 112, '', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      fontStyle: 'bold'
    });
    this.enemyStatsText = this.add.text(28, 140, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '16px'
    });
    this.enemyIntentText = this.add.text(28, 164, '', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      wordWrap: { width: topPanelWidth - 56 }
    });
    this.enemyCountdownText = this.add.text(this.screenWidth - 28, 140, '', {
      color: '#ff6673',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.enemyHpBar = new ProgressBar(this, 28, 218, {
      label: 'Enemy HP',
      width: topPanelWidth - 56,
      height: 14,
      fillColor: COLORS.danger
    });

    this.add.text(28, this.topSectionHeight + 26, 'Hold', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold'
    });
    this.add.rectangle(88, this.topSectionHeight + 78, 116, 72, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.24);
    this.holdText = this.add.text(88, this.topSectionHeight + 78, 'Empty', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      align: 'center',
      wordWrap: { width: 96 }
    }).setOrigin(0.5);

    this.add.text(28, this.boardOffsetY + BOARD_ROWS * CELL_SIZE + 14, 'Inventory', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold'
    });
    this.add.rectangle(128, this.boardOffsetY + BOARD_ROWS * CELL_SIZE + 58, 208, 58, COLORS.panelAlt, 0.96).setStrokeStyle(2, COLORS.accentSoft, 0.2);
    this.inventoryText = this.add.text(128, this.boardOffsetY + BOARD_ROWS * CELL_SIZE + 58, 'Items: compact pack', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      align: 'center',
      wordWrap: { width: 184 }
    }).setOrigin(0.5);

    this.feverText = this.add.text(this.screenWidth - 28, this.boardOffsetY + BOARD_ROWS * CELL_SIZE + 30, '', {
      color: '#65d6a5',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold',
      align: 'right'
    }).setOrigin(1, 0);

    this.upgradesText = this.add.text(this.screenWidth - 28, this.boardOffsetY + BOARD_ROWS * CELL_SIZE + 56, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '12px',
      align: 'right',
      wordWrap: { width: 132 },
      lineSpacing: 4
    }).setOrigin(1, 0);
  }

  private buildBoard(): void {
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      const cellRow: Phaser.GameObjects.Rectangle[] = [];
      for (let col = 0; col < BOARD_COLS; col += 1) {
        const cell = this.add
          .rectangle(
            this.boardOffsetX + col * CELL_SIZE + CELL_SIZE / 2,
            this.boardOffsetY + row * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE - 2,
            CELL_SIZE - 2,
            COLORS.boardEmpty,
            1
          )
          .setStrokeStyle(1, COLORS.boardGrid, 0.9);
        cellRow.push(cell);
      }
      this.boardCells.push(cellRow);
    }
  }

  private createPreviewPanel(): void {
    this.add.rectangle(this.previewCenterX, this.previewCenterY, 116, 116, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.24);
    this.previewLabel = this.add.text(this.previewCenterX, this.previewCenterY - 62, 'Next', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '17px'
    }).setOrigin(0.5);

    for (let index = 0; index < 16; index += 1) {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const tile = this.add
        .rectangle(this.previewCenterX - 42 + col * 20, this.previewCenterY - 42 + row * 20, 18, 18, COLORS.boardEmpty, 1)
        .setStrokeStyle(1, COLORS.boardGrid, 0.8)
        .setOrigin(0, 0);
      this.previewTiles.push(tile);
    }

    this.previewExtraText = this.add.text(this.previewCenterX, this.previewCenterY + 66, '', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      align: 'center',
      wordWrap: { width: 136 }
    }).setOrigin(0.5);
  }

  private createMobileControls(): void {
    new MobileControls(
      this,
      this.controlsCenterX,
      this.controlsY,
      [
        [
          { label: '<', width: 58, height: 48, onPress: () => this.board.move(-1, 0) && this.renderBoard(), repeat: true, repeatDelayMs: 180, repeatIntervalMs: 90 },
          { label: '>', width: 58, height: 48, onPress: () => this.board.move(1, 0) && this.renderBoard(), repeat: true, repeatDelayMs: 180, repeatIntervalMs: 90 },
          { label: 'Rot', width: 64, height: 48, onPress: () => this.board.rotate() && this.renderBoard() },
          { label: 'Soft', width: 66, height: 48, onPress: () => this.resolveTick(this.board.tick()), repeat: true, repeatDelayMs: 120, repeatIntervalMs: 60 },
          { label: 'Drop', width: 70, height: 48, onPress: () => this.resolveTick(this.board.hardDrop()) },
          { label: 'Hold', width: 64, height: 48, onPress: () => this.handleHold() }
        ],
        [
          ...SPELLS.map((spell) => ({
            label: spell.key,
            width: 58,
            height: 46,
            onPress: () => this.tryCast(spell.id)
          })),
          { label: 'Bag', width: 64, height: 46, onPress: () => this.toggleInventory() }
        ]
      ],
      { title: 'Touch Controls', padding: 14, rowGap: 9, buttonGap: 8 }
    );
  }

  private handleHold(): void {
    if (this.board.hold()) {
      this.combat.addLog('Held the current block.');
      this.syncBoardState();
      this.renderAll();
      return;
    }

    this.combat.addLog('Hold is already used for this block.');
    this.renderAll();
  }

  private toggleInventory(): void {
    this.inventoryExpanded = !this.inventoryExpanded;
    this.renderMiddleOverlays();
  }

  private createInputSystem(): void {
    this.inputSystem = new InputSystem(this, {
      moveLeft: () => this.board.move(-1, 0) && this.renderBoard(),
      moveRight: () => this.board.move(1, 0) && this.renderBoard(),
      rotate: () => this.board.rotate() && this.renderBoard(),
      softDrop: () => this.resolveTick(this.board.tick()),
      hardDrop: () => this.resolveTick(this.board.hardDrop()),
      hold: () => this.handleHold(),
      castSpell: (slot) => {
        const spell = SPELLS[slot];
        if (spell) {
          this.tryCast(spell.id);
        }
      },
      inventory: () => this.toggleInventory(),
      pause: this.handlePause
    });
  }

  private handleShutdown(): void {
    this.inputSystem?.destroy();
    this.inputSystem = undefined;
  }

  update(_time: number, delta: number): void {
    this.dropTimer += delta;
    const dropInterval = Math.max(120, BASE_DROP_MS / this.sharedGame.runState.fallSpeed);

    if (this.dropTimer >= dropInterval) {
      this.dropTimer = 0;
      this.resolveTick(this.board.tick());
    }

    this.inputSystem?.update(delta);
  }

  private resolveTick(result: BoardTickResult): void {
    const state = this.sharedGame.runState;

    if (result.toppedOut) {
      state.board.topOut = true;
      this.combat.addLog('The board reaches the top. The festival machine calls a reset.');
      this.finishRun(false);
      return;
    }

    if (result.locked) {
      this.advanceStatusTimers();
      const cascade = result.cascadeResult ?? {
        totalLinesCleared: result.clearedLines,
        cascadeCount: result.clearedLines > 0 ? 1 : 0,
        clearedLinesPerCascade: result.clearedLines > 0 ? [result.clearedLines] : [],
        blocksDropped: 0,
        specialBlocksTriggered: [],
        causedCombo: false
      };

      this.combat.resolveCascadeClear(cascade);

      if (state.activeEnemy && state.activeEnemy.currentHp <= 0) {
        this.handleVictory();
        return;
      }

      if (this.combat.countDownEnemyAttack()) {
        this.resolveEnemyAttack();
      } else {
        this.logEnemyCountdown();
      }
    }

    this.syncBoardState();
    this.sharedGame.saveRun();
    this.renderAll();
  }

  private advanceStatusTimers(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    if (enemy.previewHiddenTurns > 0) {
      enemy.previewHiddenTurns -= 1;
    }
    if (enemy.manaHexTurns > 0) {
      enemy.manaHexTurns -= 1;
    }
  }

  private resolveEnemyAttack(): void {
    const state = this.sharedGame.runState;
    const enemy = state.activeEnemy;
    if (!enemy) {
      return;
    }

    let damage = enemy.attack;
    this.combat.addLog(`${enemy.name} uses ${enemy.intent}.`);

    switch (enemy.behavior) {
      case 'spawn_junk':
        this.board.addJunkRows(1);
        this.combat.addLog('Junk blocks rise from below.');
        break;
      case 'hide_next_piece':
        enemy.previewHiddenTurns = 2;
        this.combat.addLog('The next-piece preview gets covered in glitter.');
        break;
      case 'mana_hex':
        enemy.manaHexTurns = 2;
        this.combat.addLog('Mana Hex raises spell costs for a short time.');
        break;
      case 'shake_board':
        damage += 2;
        this.cameras.main.shake(220, 0.0075);
        this.combat.addLog('Heavy Slam rattles the board violently.');
        break;
      case 'increase_fall_speed':
        this.board.addJunkRows(2);
        state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + 0.1);
        this.combat.addLog('The board accelerates.');
        break;
      case 'reduce_line_damage':
      case 'armor_up':
        this.combat.addLog('Guarded blocks soften your next clear.');
        break;
      case 'freeze_piece':
        this.combat.addLog('Frost gathers around the falling block.');
        break;
      default:
        break;
    }

    this.cameras.main.shake(140, 0.0035);
    const defeated = this.combat.applyEnemyDamage(damage);
    this.combat.addLog(`You take ${damage} damage.`);
    this.combat.resetEnemyCounter();

    if (defeated) {
      this.finishRun(false);
      return;
    }

    this.syncBoardState();
    this.renderAll();
  }

  private logEnemyCountdown(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    this.combat.addLog(`${enemy.name} attacks in ${enemy.attackCounter} block${enemy.attackCounter === 1 ? '' : 's'}.`);
  }

  private tryCast(spellId: SpellId): void {
    const cast = this.spells.cast(spellId);
    if (!cast) {
      this.renderAll();
      return;
    }

    if (this.sharedGame.runState.activeEnemy?.currentHp === 0) {
      this.handleVictory();
      return;
    }

    this.syncBoardState();
    this.sharedGame.saveRun();
    this.renderAll();
  }

  private handleVictory(): void {
    const state = this.sharedGame.runState;
    if (!state.activeEnemy) {
      return;
    }

    const enemyName = state.activeEnemy.name;
    state.enemiesDefeated += 1;
    this.combat.addLog(`${enemyName} tumbles out of the way.`);

    if (state.lastBattleWasBoss) {
      this.sharedGame.mapSystem.completeNode(state, state.currentNodeId);
      state.victory = true;
      state.currentRoomProgress = 'cleared';
      this.sharedGame.clearSave();
      this.scene.start('GameOverScene', { victory: true });
      return;
    }

    state.pendingRewards = this.sharedGame.rewardSystem.getRandomRewards(3);
    state.currentRoomProgress = 'reward';
    state.runStatus = 'reward';
    this.sharedGame.saveRun();
    this.scene.start('RewardScene');
  }

  private finishRun(victory: boolean): void {
    const state = this.sharedGame.runState;
    state.victory = victory;
    state.runStatus = victory ? 'victory' : 'game-over';
    this.sharedGame.clearSave();
    this.scene.start('GameOverScene', { victory });
  }

  private renderAll(): void {
    this.renderBoard();
    this.renderEnemy();
    this.renderPreview();
    this.renderUpgrades();
    this.renderMiddleOverlays();
    this.hud.update(this.sharedGame.runState);
    this.log.update(this.sharedGame.runState);
  }

  private renderBoard(): void {
    const boardState = this.board.grid.map((row) => [...row]);
    const alphaState = this.board.grid.map((row) => row.map((cell) => (cell === 0 ? 1 : 1)));
    const ghost = this.board.getGhostPiece();
    if (ghost && ghost.y !== this.board.currentPiece?.y) {
      ghost.matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (!value) {
            return;
          }

          const targetRow = ghost.y + rowIndex;
          const targetCol = ghost.x + colIndex;
          if (
            targetRow >= 0 &&
            targetRow < BOARD_ROWS &&
            targetCol >= 0 &&
            targetCol < BOARD_COLS &&
            boardState[targetRow][targetCol] === 0
          ) {
            boardState[targetRow][targetCol] = COLORS.boardGhost;
            alphaState[targetRow][targetCol] = 0.32;
          }
        });
      });
    }

    const current = this.board.currentPiece;
    if (current) {
      current.matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (!value) {
            return;
          }

          const targetRow = current.y + rowIndex;
          const targetCol = current.x + colIndex;
          if (targetRow >= 0 && targetRow < BOARD_ROWS && targetCol >= 0 && targetCol < BOARD_COLS) {
            boardState[targetRow][targetCol] = current.color;
            alphaState[targetRow][targetCol] = 1;
          }
        });
      });
    }

    for (let row = 0; row < BOARD_ROWS; row += 1) {
      for (let col = 0; col < BOARD_COLS; col += 1) {
        const cell = boardState[row][col];
        const color = cell === 0 ? COLORS.boardEmpty : getBoardCellColor(cell);
        this.boardCells[row][col].setFillStyle(color, alphaState[row][col]);
      }
    }
  }

  private renderEnemy(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    this.enemyNameText?.setText(enemy.name);
    this.enemyStatsText?.setText(`HP ${enemy.currentHp}/${enemy.maxHp}   ATK ${enemy.attack}`);
    this.enemyIntentText?.setText(
      `${enemy.intent}\n${this.getBehaviorLabel(enemy.behavior)}`
    );
    this.enemyCountdownText?.setText(
      `Attack in ${enemy.attackCounter} block${enemy.attackCounter === 1 ? '' : 's'}`
    );
    this.enemyHpBar?.setValue(enemy.currentHp, enemy.maxHp);
  }

  private getBehaviorLabel(behavior: string): string {
    switch (behavior) {
      case 'basic_attack':
        return 'Basic attack';
      case 'spawn_junk':
        return 'Spawn junk';
      case 'shake_board':
        return 'Shake board';
      case 'increase_fall_speed':
        return 'Increase fall speed';
      case 'hide_next_piece':
        return 'Hide next piece';
      case 'reduce_line_damage':
        return 'Reduce line damage';
      case 'mana_hex':
        return 'Mana hex';
      default:
        return behavior;
    }
  }

  private renderPreview(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    const hidden = enemy.previewHiddenTurns > 0;
    const nextType = this.board.nextPieceType;
    const matrix = TETROMINO_SHAPES[nextType];
    this.previewLabel?.setText(hidden ? 'Preview Hexed' : 'Next');

    this.previewTiles.forEach((tile, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const value = hidden ? 0 : matrix[row]?.[col] ?? 0;
      tile.setFillStyle(value ? TETROMINO_COLORS[nextType] : COLORS.boardEmpty, 1);
    });

    if (this.sharedGame.runState.player.extraPreview) {
      const extra = this.board.getGhostPreviewTypes()[1];
      this.previewExtraText?.setText(hidden ? 'Arcane Preview disrupted' : `After that: ${extra}`);
    } else {
      this.previewExtraText?.setText('');
    }
  }

  private renderUpgrades(): void {
    const owned = this.sharedGame.runState.ownedRewards;
    this.upgradesText?.setText(owned.length ? `Relics: ${owned.length}` : 'Relics: none');
  }

  private renderMiddleOverlays(): void {
    const state = this.sharedGame.runState;
    this.holdText?.setText(this.board.holdPieceType ? `Held\n${this.board.holdPieceType}` : 'Hold\nEmpty');
    this.inventoryText?.setText(
      this.inventoryExpanded
        ? [`Gold ${state.player.gold}`, 'Mini Cupcake x1', 'Mana Lemonade x1'].join('\n')
        : `Gold ${state.player.gold}  Bag`
    );
    this.feverText?.setText(`Fever ${Math.min(100, state.combo * 10)}%\nCombo ${state.combo}`);
  }

  private syncBoardState(): void {
    this.sharedGame.runState.board = {
      columns: BOARD_COLS,
      rows: BOARD_ROWS,
      activePieceType: this.board.currentPiece?.type ?? null,
      nextPieceType: this.board.nextPieceType,
      holdPieceType: this.board.holdPieceType,
      topOut: false
    };
  }
}
