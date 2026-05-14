import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { SPELLS } from '../data/spells';
import { BoardSystem, getBoardCellColor } from '../systems/BoardSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { SpellSystem } from '../systems/SpellSystem';
import type { BoardTickResult, SpellId } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { EventLog } from '../ui/EventLog';
import { Hud } from '../ui/Hud';
import { MobileControls } from '../ui/MobileControls';
import { ProgressBar } from '../ui/ProgressBar';
import { isCompactLayout } from '../utils/layout';
import {
  BASE_DROP_MS,
  BOARD_COLS,
  BOARD_OFFSET_X,
  BOARD_OFFSET_Y,
  BOARD_ROWS,
  CELL_SIZE,
  COLORS,
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
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
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
  private horizontalRepeat = 0;
  private softDropRepeat = 0;
  private handleRotateUp = () => {
    this.board.rotate();
    this.renderBoard();
  };
  private handleRotateW = () => {
    this.board.rotate();
    this.renderBoard();
  };
  private handleHardDrop = () => this.resolveTick(this.board.hardDrop());
  private handleCastOne = () => this.tryCast('fireball');
  private handleCastTwo = () => this.tryCast('frost-lock');
  private handleCastThree = () => this.tryCast('bomb-rune');
  private handleCastFour = () => this.tryCast('void-cut');
  private handlePause = () => this.combat.addLog('Pause is a placeholder in this MVP.');

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
    this.horizontalRepeat = 0;
    this.softDropRepeat = 0;
    this.board = new BoardSystem();
    this.combat = new CombatSystem(state);
    this.spells = new SpellSystem(state, this.board, this.combat);

    this.screenWidth = this.scale.width;
    this.screenHeight = this.scale.height;
    this.topSectionHeight = Math.round(this.screenHeight * 0.2);
    this.bottomSectionHeight = Math.round(this.screenHeight * 0.2);
    this.middleSectionHeight = this.screenHeight - this.topSectionHeight - this.bottomSectionHeight;
    this.boardOffsetX = Math.round((this.screenWidth - BOARD_COLS * CELL_SIZE) / 2);
    this.boardOffsetY = this.topSectionHeight + 140;
    this.previewCenterX = this.screenWidth / 2;
    this.previewCenterY = this.topSectionHeight + 78;
    this.controlsCenterX = this.screenWidth / 2;
    this.controlsY = this.screenHeight - Math.round(this.bottomSectionHeight / 2) + 4;
    this.logX = 24;
    this.logWidth = this.screenWidth - 48;
    this.logHeight = 140;
    this.logY = this.topSectionHeight + this.middleSectionHeight - this.logHeight - 14;

    this.drawLayout();
    this.buildBoard();
    this.createPreviewPanel();
    this.hud = new Hud(this, { compact: this.compactLayout });
    this.log = new EventLog(this, this.logX, this.logY, this.logWidth, this.logHeight);
    this.createSpellButtons();
    this.createMobileControls();
    this.createInputs();
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
    const topPanelWidth = this.screenWidth - 48;
    const topPanelHeight = this.topSectionHeight - 24;
    const topPanelCenterY = Math.round(this.topSectionHeight / 2);

    this.add.rectangle(this.screenWidth / 2, topPanelCenterY, topPanelWidth, topPanelHeight, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accent, 0.25);
    this.add.text(36, 26, 'Battlefield', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold'
    });

    const boardPanelHeight = this.middleSectionHeight - 24;
    const boardPanelCenterY = this.boardOffsetY + Math.round((BOARD_ROWS * CELL_SIZE) / 2) - 14;
    this.add.rectangle(this.screenWidth / 2, boardPanelCenterY, this.screenWidth - 32, boardPanelHeight, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accentSoft, 0.25);

    this.enemyNameText = this.add.text(36, 60, '', {
      color: '#ffca6b',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '26px',
      fontStyle: 'bold'
    });
    this.enemyStatsText = this.add.text(36, 94, '', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '18px'
    });
    this.enemyIntentText = this.add.text(36, 126, '', {
      color: '#98a0c7',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '17px',
      wordWrap: { width: topPanelWidth - 72 }
    });
    this.enemyCountdownText = this.add.text(36, 178, '', {
      color: '#ff6673',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold'
    });
    this.enemyHpBar = new ProgressBar(this, 36, 214, {
      label: 'Enemy Vitality',
      width: topPanelWidth - 72,
      height: 18,
      fillColor: COLORS.danger
    });

    this.add.text(36, 252, 'Relics & Upgrades', {
      color: '#ffca6b',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold'
    });
    this.upgradesText = this.add.text(36, 280, '', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '16px',
      wordWrap: { width: topPanelWidth - 72 },
      lineSpacing: 6
    });
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
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '22px'
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
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '15px',
      align: 'center',
      wordWrap: { width: 320 }
    }).setOrigin(0.5);
  }

  private createSpellButtons(): void {
    const startX = Math.round(this.screenWidth / 2) - 148;
    const startY = this.logY - 64;
    SPELLS.forEach((spell, index) => {
      const x = startX + index * 76;
      new Button(this, x, startY, 68, 50, spell.key, () => {
        this.tryCast(spell.id);
      });
    });
  }

  private createMobileControls(): void {
    new MobileControls(
      this,
      this.controlsCenterX,
      this.controlsY,
      [
        [
          { label: '<', width: 58, onPress: () => this.board.move(-1, 0) && this.renderBoard() },
          { label: '>', width: 58, onPress: () => this.board.move(1, 0) && this.renderBoard() },
          { label: 'Rot', width: 64, onPress: () => this.board.rotate() && this.renderBoard() },
          { label: 'Hold', width: 64, onPress: () => this.combat.addLog('Hold block is coming soon.') },
          { label: 'Drop', width: 70, onPress: () => this.resolveTick(this.board.hardDrop()) }
        ],
        SPELLS.map((spell) => ({
          label: spell.key,
          width: 64,
          onPress: () => this.tryCast(spell.id)
        }))
      ],
      { title: 'Touch Controls', padding: 16, rowGap: 10, buttonGap: 10 }
    );
  }

  private createInputs(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.input.keyboard!.on('keydown-UP', this.handleRotateUp);
    this.input.keyboard!.on('keydown-W', this.handleRotateW);
    this.input.keyboard!.on('keydown-SPACE', this.handleHardDrop);
    this.input.keyboard!.on('keydown-ONE', this.handleCastOne);
    this.input.keyboard!.on('keydown-TWO', this.handleCastTwo);
    this.input.keyboard!.on('keydown-THREE', this.handleCastThree);
    this.input.keyboard!.on('keydown-FOUR', this.handleCastFour);
    this.input.keyboard!.on('keydown-ESC', this.handlePause);
  }

  private handleShutdown(): void {
    this.input.keyboard?.off('keydown-UP', this.handleRotateUp);
    this.input.keyboard?.off('keydown-W', this.handleRotateW);
    this.input.keyboard?.off('keydown-SPACE', this.handleHardDrop);
    this.input.keyboard?.off('keydown-ONE', this.handleCastOne);
    this.input.keyboard?.off('keydown-TWO', this.handleCastTwo);
    this.input.keyboard?.off('keydown-THREE', this.handleCastThree);
    this.input.keyboard?.off('keydown-FOUR', this.handleCastFour);
    this.input.keyboard?.off('keydown-ESC', this.handlePause);
  }

  update(_time: number, delta: number): void {
    this.dropTimer += delta;
    const dropInterval = Math.max(120, BASE_DROP_MS / this.sharedGame.runState.fallSpeed);

    if (this.dropTimer >= dropInterval) {
      this.dropTimer = 0;
      this.resolveTick(this.board.tick());
    }

    this.handleHeldInput(delta);
  }

  private handleHeldInput(delta: number): void {
    this.horizontalRepeat += delta;
    this.softDropRepeat += delta;

    if ((this.cursors.left.isDown || this.keyA.isDown) && this.horizontalRepeat >= 110) {
      this.board.move(-1, 0);
      this.horizontalRepeat = 0;
      this.renderBoard();
    }

    if ((this.cursors.right.isDown || this.keyD.isDown) && this.horizontalRepeat >= 110) {
      this.board.move(1, 0);
      this.horizontalRepeat = 0;
      this.renderBoard();
    }

    if ((this.cursors.down.isDown || this.keyS.isDown) && this.softDropRepeat >= 55) {
      this.softDropRepeat = 0;
      this.resolveTick(this.board.tick());
    }
  }

  private resolveTick(result: BoardTickResult): void {
    const state = this.sharedGame.runState;

    if (result.toppedOut) {
      state.board.topOut = true;
      this.combat.addLog('The board reaches the top. The dungeon takes you.');
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

    switch (enemy.id) {
      case 'goblin':
        this.board.addJunkRows(1);
        this.combat.addLog('Goblin junk blocks rise from below.');
        break;
      case 'bat':
        enemy.previewHiddenTurns = 2;
        this.combat.addLog('The next-piece preview vanishes in the dark.');
        break;
      case 'witch':
        enemy.manaHexTurns = 2;
        this.combat.addLog('Mana Hex raises spell costs for a short time.');
        break;
      case 'elite-knight':
        damage += 2;
        this.cameras.main.shake(220, 0.0075);
        this.combat.addLog('Heavy Slam rattles the board violently.');
        break;
      case 'falling-king':
        this.board.addJunkRows(2);
        state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + 0.1);
        this.combat.addLog('Royal Collapse accelerates the board.');
        break;
      case 'stone-golem':
        this.combat.addLog('Stone Guard shrugs off blunt line pressure.');
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
    this.combat.addLog(`${enemyName} falls.`);

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
    this.upgradesText?.setText(owned.length ? owned.map((id) => `- ${id}`).join('\n') : 'No relics claimed yet.');
  }

  private syncBoardState(): void {
    this.sharedGame.runState.board = {
      columns: BOARD_COLS,
      rows: BOARD_ROWS,
      activePieceType: this.board.currentPiece?.type ?? null,
      nextPieceType: this.board.nextPieceType,
      topOut: false
    };
  }
}
