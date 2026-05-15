import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { SPELLS } from '../data/spells';
import { BoardSystem, getBoardCellColor } from '../systems/BoardSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { FeverSystem } from '../systems/FeverSystem';
import { InputSystem } from '../systems/InputSystem';
import { OopsieSystem } from '../systems/OopsieSystem';
import { SpellSystem } from '../systems/SpellSystem';
import { contentRegistry } from '../systems/ContentRegistry';
import type { BoardCell, BoardTickResult, CascadeAnimationFrame, CascadeResult, EnemyInstance, RunState, SpellId } from '../types/GameTypes';
import { EventLog } from '../ui/EventLog';
import { Hud } from '../ui/Hud';
import { MobileControls } from '../ui/MobileControls';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
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
  private fever!: FeverSystem;
  private spells!: SpellSystem;
  private oopsies!: OopsieSystem;
  private hud!: Hud;
  private log!: EventLog;
  private boardCells: Phaser.GameObjects.Rectangle[][] = [];
  private boardSprites: Phaser.GameObjects.Image[][] = [];
  private boardSymbols: Phaser.GameObjects.Text[][] = [];
  private displayBoard: BoardCell[][] = [];
  private displayAlpha: number[][] = [];
  private renderedCellColors: number[][] = [];
  private renderedCellAlphas: number[][] = [];
  private renderedTextureKeys: string[][] = [];
  private renderedSymbols: string[][] = [];
  private previewSymbols: Phaser.GameObjects.Text[] = [];
  private heroPortrait?: Phaser.GameObjects.Image;
  private enemySprite?: Phaser.GameObjects.Image;
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
  private feverBarFill?: Phaser.GameObjects.Rectangle;
  private cascadeText?: Phaser.GameObjects.Text;
  private inventoryExpanded = false;
  private inventoryOverlay!: Phaser.GameObjects.Container;
  private inventoryButtons: Button[] = [];
  private inventoryDynamicObjects: Phaser.GameObjects.GameObject[] = [];
  private inventoryRenderKey = '';
  private spellButtons: Array<{ spellId: SpellId; button: Button }> = [];
  private readonly floatingTextPool: Phaser.GameObjects.Text[] = [];
  private activeBossIntroObjects: Phaser.GameObjects.GameObject[] = [];
  private cascadeResolving = false;
  private inputSystem?: InputSystem;
  private compactLayout = false;
  private screenWidth = 0;
  private screenHeight = 0;
  private topSectionHeight = 0;
  private middleSectionHeight = 0;
  private bottomSectionHeight = 0;
  private boardColumns = BOARD_COLS;
  private boardRows = BOARD_ROWS;
  private boardCellSize = CELL_SIZE;
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
  private readonly cascadeSettlePauseMs = 260;

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
      state.activeEnemy.attackCounter = game.oopsieSystem.adjustEnemyAttackInterval(state, enemy.attackIntervalLocks);
    }

    this.boardCells = [];
    this.boardSprites = [];
    this.boardSymbols = [];
    this.displayBoard = [];
    this.displayAlpha = [];
    this.renderedCellColors = [];
    this.renderedCellAlphas = [];
    this.renderedTextureKeys = [];
    this.renderedSymbols = [];
    this.previewSymbols = [];
    this.spellButtons = [];
    this.previewTiles = [];
    this.inventoryRenderKey = '';
    this.dropTimer = 0;
    this.oopsies = game.oopsieSystem;
    this.oopsies.normalizeState(state);
    game.boardSizeModifierSystem.applyEncounterBoardSize(state);
    this.board = new BoardSystem(state);
    this.boardColumns = this.board.columns;
    this.boardRows = this.board.rows;
    this.combat = new CombatSystem(state);
    this.fever = new FeverSystem();
    this.spells = new SpellSystem(state, this.board, this.combat);

    const layout = getPortraitLayout(this);
    this.screenWidth = layout.width;
    this.screenHeight = layout.height;
    this.topSectionHeight = layout.topHeight;
    this.bottomSectionHeight = layout.bottomHeight;
    this.middleSectionHeight = layout.middleHeight;
    this.logWidth = this.screenWidth - 48;
    this.logHeight = 88;
    const compactSideSpace = this.screenWidth <= 520 ? 148 : 230;
    const horizontalCellSize = Math.floor((this.screenWidth - compactSideSpace) / Math.max(1, this.boardColumns));
    const verticalCellSize = Math.floor((this.middleSectionHeight - this.logHeight - 112) / Math.max(1, this.boardRows));
    this.boardCellSize = Math.max(12, Math.min(CELL_SIZE, horizontalCellSize, verticalCellSize));
    this.boardOffsetX = Math.round((this.screenWidth - this.boardColumns * this.boardCellSize) / 2);
    this.boardOffsetY = this.topSectionHeight + 16;
    const sideCenterX = Math.max(48, Math.round(this.boardOffsetX / 2));
    this.previewCenterX = this.screenWidth - sideCenterX;
    this.previewCenterY = this.boardOffsetY + 58;
    this.controlsCenterX = this.screenWidth / 2;
    this.controlsY = this.topSectionHeight + this.middleSectionHeight + Math.round(this.bottomSectionHeight / 2) - 4;
    this.logX = 24;
    this.logY = this.topSectionHeight + this.middleSectionHeight - this.logHeight - 10;

    this.drawLayout();
    this.createRenderBuffers();
    this.buildBoard();
    this.createPreviewPanel();
    this.hud = new Hud(this, {
      compact: true,
      showMeta: false,
      x: this.screenWidth / 2,
      y: 76,
      width: this.screenWidth - 64,
      height: 76
    });
    this.log = new EventLog(this, this.logX, this.logY, this.logWidth, this.logHeight);
    this.createMobileControls();
    this.createInventoryOverlay();
    this.createInputSystem();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    this.combat.addLog(`Battle started against ${state.activeEnemy.name}.`);
    if (this.sharedGame.bossSystem.isBoss(state.activeEnemy)) {
      const fallbackIntro = this.sharedGame.bossSystem.getIntro(state.activeEnemy);
      const bossBeat = this.sharedGame.storySystem.getBossIntro(state.activeEnemy.id, fallbackIntro);
      bossBeat.lines.forEach((line) => this.combat.addLog(line));
      this.sharedGame.audioSystem.play('boss_intro', this);
      this.showBossIntro(state.activeEnemy.name, bossBeat.lines[0] ?? fallbackIntro);
      this.showBossRuleCard(state.activeEnemy.id);
    }
    const chaos = this.sharedGame.chaosRuleSystem.getActive(state);
    if (chaos) {
      this.sharedGame.chaosRuleSystem.applyStartEffects(state, (message) => this.combat.addLog(message), this.board);
    }
    for (const eventEntry of this.sharedGame.randomGameplayEventSystem.getActive(state)) {
      this.sharedGame.randomGameplayEventSystem.applyEffects(state, eventEntry, (message) => this.combat.addLog(message), this.board);
    }
    this.syncBoardState();
    game.saveRun();
    this.renderAll();
  }

  private get sharedGame(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private drawLayout(): void {
    const stageBackground = this.sharedGame.assetSystem.addImage(
      this,
      this.screenWidth / 2,
      this.screenHeight / 2,
      this.sharedGame.stageSystem.getStageBackgroundKey(this.sharedGame.runState.stage),
      'background'
    );
    stageBackground.setDisplaySize(this.screenWidth, this.screenHeight).setAlpha(0.18);

    const topPanelWidth = this.screenWidth - 32;
    const topPanelHeight = this.topSectionHeight - 18;
    const topPanelCenterY = Math.round(this.topSectionHeight / 2) + 3;

    this.add.rectangle(this.screenWidth / 2, topPanelCenterY, topPanelWidth, topPanelHeight, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accent, 0.25);
    this.add.text(28, 20, 'Blockmancer Battle', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    });

    this.add.text(this.screenWidth - 28, 20, `Stage ${this.sharedGame.runState.stage}`, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      fontStyle: 'bold'
    }).setOrigin(1, 0);

    const middleCenterY = this.topSectionHeight + this.middleSectionHeight / 2;
    this.add.rectangle(this.screenWidth / 2, middleCenterY, this.screenWidth - 24, this.middleSectionHeight - 16, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accentSoft, 0.25);

    const controlsCenterY = this.topSectionHeight + this.middleSectionHeight + this.bottomSectionHeight / 2;
    this.add.rectangle(this.screenWidth / 2, controlsCenterY, this.screenWidth - 24, this.bottomSectionHeight - 16, COLORS.panel, 0.92).setStrokeStyle(2, COLORS.accent, 0.22);

    this.enemyNameText = this.add.text(28, 128, '', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      fontStyle: 'bold'
    });
    this.enemyStatsText = this.add.text(28, 158, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    });
    this.enemyIntentText = this.add.text(28, 184, '', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      wordWrap: { width: topPanelWidth - 190 }
    });
    this.enemyCountdownText = this.add.text(this.screenWidth - 28, 206, '', {
      color: '#ff6673',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.enemyHpBar = new ProgressBar(this, 28, 204, {
      label: 'Enemy HP',
      width: topPanelWidth - 232,
      height: 16,
      fillColor: COLORS.danger
    });

    this.heroPortrait = this.sharedGame.assetSystem.addImage(
      this,
      this.screenWidth - 170,
      160,
      this.sharedGame.runState.hero.id,
      'sprite'
    ).setDisplaySize(64, 64).setAlpha(0.95);

    this.enemySprite = this.sharedGame.assetSystem.addImage(
      this,
      this.screenWidth - 78,
      160,
      null,
      'sprite'
    ).setDisplaySize(64, 64).setAlpha(0.95);

    const sideCenterX = Math.max(48, Math.round(this.boardOffsetX / 2));
    const sidePanelWidth = this.screenWidth <= 520 ? 82 : 124;
    const sidePanelHeight = this.screenWidth <= 520 ? 72 : 82;
    this.add.text(sideCenterX, this.boardOffsetY - 24, 'Hold', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    this.add.rectangle(sideCenterX, this.boardOffsetY + 34, sidePanelWidth, sidePanelHeight, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.45);
    this.holdText = this.add.text(sideCenterX, this.boardOffsetY + 34, 'Empty', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: this.screenWidth <= 520 ? '15px' : '18px',
      align: 'center',
      wordWrap: { width: sidePanelWidth - 14 }
    }).setOrigin(0.5);

    const boardBottom = this.boardOffsetY + this.boardRows * this.boardCellSize;
    this.add.text(28, boardBottom + 10, 'Inventory', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold'
    });
    this.add.rectangle(132, boardBottom + 50, 216, 56, COLORS.panelAlt, 0.96).setStrokeStyle(2, COLORS.accentSoft, 0.45);
    this.inventoryText = this.add.text(128, boardBottom + 50, 'Items: compact pack', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      align: 'center',
      wordWrap: { width: 184 }
    }).setOrigin(0.5);

    this.feverText = this.add.text(this.screenWidth - 28, boardBottom + 12, '', {
      color: '#65d6a5',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold',
      align: 'right'
    }).setOrigin(1, 0);

    this.add.rectangle(this.screenWidth - 94, boardBottom + 56, 132, 14, COLORS.boardEmpty, 1)
      .setStrokeStyle(1, COLORS.accent, 0.55);
    this.feverBarFill = this.add.rectangle(this.screenWidth - 160, boardBottom + 56, 0, 10, COLORS.success, 1)
      .setOrigin(0, 0.5);
    this.cascadeText = this.add.text(this.screenWidth - 28, boardBottom + 70, '', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      fontStyle: 'bold',
      align: 'right',
      wordWrap: { width: 150 }
    }).setOrigin(1, 0);

    this.upgradesText = this.add.text(this.screenWidth - 28, boardBottom + 38, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      align: 'right',
      wordWrap: { width: 132 },
      lineSpacing: 4
    }).setOrigin(1, 0).setVisible(false);
  }

  private buildBoard(): void {
    for (let row = 0; row < this.boardRows; row += 1) {
      const cellRow: Phaser.GameObjects.Rectangle[] = [];
      const spriteRow: Phaser.GameObjects.Image[] = [];
      const symbolRow: Phaser.GameObjects.Text[] = [];
      for (let col = 0; col < this.boardColumns; col += 1) {
        const settings = this.sharedGame.getSettings();
        const cell = this.add
          .rectangle(
            this.boardOffsetX + col * this.boardCellSize + this.boardCellSize / 2,
            this.boardOffsetY + row * this.boardCellSize + this.boardCellSize / 2,
            this.boardCellSize - 2,
            this.boardCellSize - 2,
            COLORS.boardEmpty,
            1
          )
          .setStrokeStyle(1, COLORS.boardGrid, settings.showGrid ? 0.9 : 0);
        cellRow.push(cell);
        const sprite = this.sharedGame.assetSystem
          .addImage(
            this,
            this.boardOffsetX + col * this.boardCellSize + this.boardCellSize / 2,
            this.boardOffsetY + row * this.boardCellSize + this.boardCellSize / 2,
            null,
            'block'
          )
          .setDisplaySize(this.boardCellSize - 6, this.boardCellSize - 6)
          .setVisible(false);
        spriteRow.push(sprite);
        const symbol = this.add.text(
          this.boardOffsetX + col * this.boardCellSize + this.boardCellSize / 2,
          this.boardOffsetY + row * this.boardCellSize + this.boardCellSize / 2 + 1,
          '',
          {
            color: '#f6f7ff',
            fontFamily: FONT_FAMILY,
            fontSize: `${Math.max(12, Math.min(15, this.boardCellSize - 9))}px`,
            fontStyle: 'bold',
            stroke: '#05060a',
            strokeThickness: 2
          }
        ).setOrigin(0.5).setVisible(false);
        symbolRow.push(symbol);
      }
      this.boardCells.push(cellRow);
      this.boardSprites.push(spriteRow);
      this.boardSymbols.push(symbolRow);
    }
  }

  private createRenderBuffers(): void {
    for (let row = 0; row < this.boardRows; row += 1) {
      this.displayBoard[row] = [];
      this.displayAlpha[row] = [];
      this.renderedCellColors[row] = [];
      this.renderedCellAlphas[row] = [];
      this.renderedTextureKeys[row] = [];
      this.renderedSymbols[row] = [];
      for (let col = 0; col < this.boardColumns; col += 1) {
        this.displayBoard[row][col] = 0;
        this.displayAlpha[row][col] = 1;
        this.renderedCellColors[row][col] = -1;
        this.renderedCellAlphas[row][col] = -1;
        this.renderedTextureKeys[row][col] = '';
        this.renderedSymbols[row][col] = '';
      }
    }
  }

  private createPreviewPanel(): void {
    const compact = this.screenWidth <= 520;
    const panelSize = compact ? 84 : 116;
    const tileSize = compact ? 16 : 18;
    const tileStep = compact ? 17 : 20;
    const startOffset = compact ? -34 : -42;
    this.add.rectangle(this.previewCenterX, this.previewCenterY, panelSize, panelSize, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.24);
    this.previewLabel = this.add.text(this.previewCenterX, this.previewCenterY - panelSize / 2 - 18, 'Next', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '15px' : '17px'
    }).setOrigin(0.5);

    for (let index = 0; index < 16; index += 1) {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const tile = this.add
        .rectangle(this.previewCenterX + startOffset + col * tileStep, this.previewCenterY + startOffset + row * tileStep, tileSize, tileSize, COLORS.boardEmpty, 1)
        .setStrokeStyle(1, COLORS.boardGrid, this.sharedGame.getSettings().showGrid ? 0.8 : 0)
        .setOrigin(0, 0);
      this.previewTiles.push(tile);
      this.previewSymbols.push(this.add.text(tile.x + tileSize / 2, tile.y + tileSize / 2 + 1, '', {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '10px' : '12px',
        fontStyle: 'bold',
        stroke: '#05060a',
        strokeThickness: 2
      }).setOrigin(0.5).setVisible(false));
    }

    this.previewExtraText = this.add.text(this.previewCenterX, this.previewCenterY + panelSize / 2 + 18, '', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '11px' : '13px',
      align: 'center',
      wordWrap: { width: compact ? 90 : 136 }
    }).setOrigin(0.5);
  }

  private createMobileControls(): void {
    const settings = this.sharedGame.getSettings();
    const buttonScale = settings.buttonSize === 'large' ? 1.12 : 1;
    const size = (value: number) => Math.round(value * buttonScale);
    const movementRow = [
      { label: '<', width: size(58), height: size(48), onPress: () => this.moveHorizontal(-1), repeat: true, repeatDelayMs: 180, repeatIntervalMs: 90 },
      { label: '>', width: size(58), height: size(48), onPress: () => this.moveHorizontal(1), repeat: true, repeatDelayMs: 180, repeatIntervalMs: 90 },
      { label: 'Rot', width: size(64), height: size(48), onPress: () => this.rotatePiece() },
      { label: 'Soft', width: size(66), height: size(48), onPress: () => this.softDrop(), repeat: true, repeatDelayMs: 120, repeatIntervalMs: 60 },
      { label: 'Drop', width: size(70), height: size(48), onPress: () => this.hardDrop() },
      { label: 'Hold', width: size(64), height: size(48), onPress: () => this.handleHold() }
    ];
    const spellRow = [
      ...SPELLS.map((spell) => {
        const spellContent = contentRegistry.getSpell(`spl_${spell.id.replace(/-/g, '_')}`) as { iconKey?: string } | null;
        return {
          label: `${spell.key}\n${this.spells.getCost(spell.id)}`,
          width: size(58),
          height: size(46),
          iconKey: spellContent?.iconKey,
          disabled: this.sharedGame.runState.player.mana < this.spells.getCost(spell.id),
          onPress: () => this.tryCast(spell.id),
          onCreate: (button: Button) => this.spellButtons.push({ spellId: spell.id, button })
        };
      }),
      { label: 'Bag', width: size(64), height: size(46), onPress: () => this.toggleInventory() }
    ];
    new MobileControls(
      this,
      this.controlsCenterX,
      this.controlsY,
      settings.leftHandedControls
        ? [movementRow.slice().reverse(), spellRow.slice().reverse()]
        : [movementRow, spellRow],
      { padding: 14, rowGap: 10, buttonGap: 8 }
    );
  }

  private createInventoryOverlay(): void {
    this.inventoryOverlay = this.add.container(0, 0);
    this.inventoryOverlay.setDepth(100);
    this.inventoryOverlay.setVisible(false);
    
    const middleCenterY = this.topSectionHeight + this.middleSectionHeight / 2;
    const bg = this.add.rectangle(
      this.screenWidth / 2,
      middleCenterY,
      this.screenWidth - 24,
      this.middleSectionHeight - 16,
      COLORS.panel,
      0.98
    ).setStrokeStyle(2, COLORS.accentSoft, 0.5);
    
    const title = this.add.text(
      this.screenWidth / 2,
      this.topSectionHeight + 30,
      'Bag',
      {
        color: '#ffca6b',
        fontFamily: FONT_FAMILY,
        fontSize: '28px',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    
    this.inventoryOverlay.add([bg, title]);
  }

  private handleHold(): void {
    if (this.cascadeResolving) {
      return;
    }

    if (this.board.hold()) {
      this.combat.addLog('Held the current block.');
      this.syncBoardState();
      this.sharedGame.saveRun();
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
      moveLeft: () => this.moveHorizontal(-1),
      moveRight: () => this.moveHorizontal(1),
      rotate: () => this.rotatePiece(),
      softDrop: () => this.softDrop(),
      hardDrop: () => this.hardDrop(),
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

  private moveHorizontal(direction: -1 | 1): void {
    if (this.cascadeResolving) {
      return;
    }

    const enemy = this.sharedGame.runState.activeEnemy;
    const slipped = this.sharedGame.oopsieSystem.shouldSlipButton(this.sharedGame.runState);
    const resolvedDirection = enemy?.reverseControlsTurns || slipped ? -direction : direction;
    if (slipped) {
      this.combat.addLog('Slippery Buttons wiggles the move the other way.');
    }
    if (this.board.move(resolvedDirection, 0)) {
      this.syncBoardState();
      this.sharedGame.saveRun();
      this.renderBoard();
    }
  }

  private rotatePiece(): void {
    if (this.cascadeResolving) {
      return;
    }

    if (this.board.rotate()) {
      this.syncBoardState();
      this.sharedGame.saveRun();
      this.renderBoard();
    }
  }

  private softDrop(): void {
    if (!this.cascadeResolving) {
      this.resolveTick(this.board.tick());
    }
  }

  private hardDrop(): void {
    if (!this.cascadeResolving) {
      this.resolveTick(this.board.hardDrop());
    }
  }

  private handleShutdown(): void {
    this.inputSystem?.destroy();
    this.inputSystem = undefined;
    this.tweens.killAll();
    this.time.removeAllEvents();
    this.inventoryButtons.forEach((button) => button.destroy());
    this.inventoryButtons = [];
    this.inventoryDynamicObjects.forEach((item) => item.destroy());
    this.inventoryDynamicObjects = [];
    this.activeBossIntroObjects.forEach((item) => item.destroy());
    this.activeBossIntroObjects = [];
    this.floatingTextPool.forEach((label) => label.destroy());
    this.floatingTextPool.length = 0;
    this.hud?.destroy();
  }

  private applyOopsieBoardEffects(linesCleared: number): void {
    const state = this.sharedGame.runState;
    if (this.sharedGame.oopsieSystem.shouldAddConfettiJunk(state)) {
      const added = this.board.addConfettiBlocks(1);
      if (added > 0) {
        this.combat.addLog('Too Much Confetti adds a sparkle block.');
      }
    }

    if (linesCleared === 0 && this.sharedGame.oopsieSystem.shouldAddStickyJunk(state)) {
      const added = this.board.addStickyBlocks(1);
      if (added > 0) {
        this.combat.addLog('Sticky Floor leaves one sticky block behind.');
      }
    }
  }

  update(_time: number, delta: number): void {
    if (this.cascadeResolving) {
      return;
    }

    this.dropTimer += delta;
    const effectiveFallSpeed = this.sharedGame.oopsieSystem.adjustFallSpeed(
      this.sharedGame.runState,
      this.sharedGame.runState.fallSpeed
    );
    const dropInterval = Math.max(120, BASE_DROP_MS / effectiveFallSpeed);

    if (this.dropTimer >= dropInterval) {
      this.dropTimer = 0;
      this.resolveTick(this.board.tick());
    }

    this.inputSystem?.update(delta);
  }

  private resolveTick(result: BoardTickResult): void {
    if (this.cascadeResolving) {
      return;
    }

    const state = this.sharedGame.runState;

    if (result.toppedOut) {
      if (
        state.hero.passiveId === 'passive_no_snack_left_behind' &&
        !state.player.emergencyBarrierUsed
      ) {
        state.player.emergencyBarrierUsed = true;
        state.player.shield += 10;
        state.board.topOut = false;
        this.board.clearMessiestRow();
        this.combat.addLog('No Snack Left Behind saves the run and clears breathing room.');
        this.syncBoardState();
        this.sharedGame.saveRun();
        this.renderAll();
        return;
      }
      state.board.topOut = true;
      this.combat.addLog('The board reaches the top. The festival machine calls a reset.');
      this.finishRun(false);
      return;
    }

    if (result.locked) {
      const cascade = result.cascadeResult ?? {
        totalLinesCleared: result.clearedLines,
        cascadeCount: result.clearedLines > 0 ? 1 : 0,
        clearedLinesPerCascade: result.clearedLines > 0 ? [result.clearedLines] : [],
        blocksDropped: 0,
        specialBlocksTriggered: [],
        causedCombo: false
      };
      void this.resolveLockedPiece(cascade);
      return;
    }

    this.syncBoardState();
    this.sharedGame.saveRun();
    this.renderAll();
  }

  private async resolveLockedPiece(cascade: CascadeResult): Promise<void> {
    const state = this.sharedGame.runState;
    this.cascadeResolving = true;
    this.advanceStatusTimers();
    if (cascade.animationFrames?.length) {
      this.renderBoardSnapshot(cascade.animationFrames[0].grid);
      this.renderEnemy();
      this.renderPreview();
      this.renderUpgrades();
      this.renderMiddleOverlays();
      this.hud.update(state);
      this.log.update(state);
    } else {
      this.syncBoardState();
      this.renderAll();
    }

    if (cascade.totalLinesCleared > 0) {
      this.sharedGame.audioSystem.play('line_clear', this);
    }
    if (cascade.cascadeCount > 1 || cascade.blocksDropped > 0) {
      this.sharedGame.audioSystem.play('cascade', this);
      this.showFloatingText(
        `Cascade Gravity x${Math.max(1, cascade.cascadeCount)}`,
        this.screenWidth / 2,
        this.boardOffsetY + 118,
        '#65d6a5',
        28
      );
      await this.playCascadeGravityFeedback(cascade);
      await this.wait(this.cascadeSettlePauseMs);
    }

    const result = this.combat.resolveCascadeClear(cascade);
    if (cascade.cascadeCount > 1) {
      this.showFloatingText('Cascade Combo!', this.screenWidth / 2, this.boardOffsetY + 164, '#ffca6b', 30);
      this.showFloatingText(`Combo x${state.combo}`, this.screenWidth / 2, this.boardOffsetY + 206, '#f6f7ff', 25);
    }
    if (result.damage > 0) {
      this.sharedGame.audioSystem.play('enemy_hit', this);
      this.showFloatingText(`-${result.damage}`, this.screenWidth - 78, 92, result.specialDamage > 0 ? '#65d6a5' : '#ffca6b');
      this.flashEnemyHit(result.damage);
    }
    if (result.feverGained > 0 || result.feverTriggered) {
      this.pulseFeverMeter(result.feverTriggered);
    }
    state.runStats.piecesLocked += 1;
    state.runStats.linesCleared += cascade.totalLinesCleared;
    state.runStats.cascadesTriggered += cascade.cascadeCount > 1 ? 1 : 0;
    state.runStats.maxCascade = Math.max(state.runStats.maxCascade, cascade.cascadeCount);
    state.runStats.damageDealt += result.damage;
    if (cascade.cascadeCount > 1) {
      const stageGoalMessage = this.sharedGame.stageGoalSystem.addProgress(state, 'combo_score', cascade.cascadeCount);
      if (stageGoalMessage) {
        this.combat.addLog(stageGoalMessage);
      }
    }
    this.applyOopsieBoardEffects(cascade.totalLinesCleared);
    this.renderCombatUi();

    if (state.activeEnemy && state.activeEnemy.currentHp <= 0) {
      await this.wait(280);
      this.cascadeResolving = false;
      this.sharedGame.saveRun();
      this.handleVictory();
      return;
    }

    this.checkBossPhase();

    if (this.combat.countDownEnemyAttack()) {
      this.cascadeResolving = false;
      this.resolveEnemyAttack();
      return;
    }

    this.logEnemyCountdown();
    this.syncBoardState();
    this.sharedGame.saveRun();
    this.cascadeResolving = false;
    this.renderAll();
  }

  private playCascadeGravityFeedback(cascade: CascadeResult): Promise<void> {
    const frames = cascade.animationFrames ?? [];
    if (frames.length > 0) {
      return this.playCascadeFrames(frames);
    }

    if (cascade.blocksDropped <= 0) {
      return Promise.resolve();
    }

    const effectiveFallSpeed = this.sharedGame.oopsieSystem.adjustFallSpeed(
      this.sharedGame.runState,
      this.sharedGame.runState.fallSpeed
    );
    const dropInterval = Math.max(120, BASE_DROP_MS / effectiveFallSpeed);
    const visualRows = Math.min(4, Math.max(1, cascade.cascadeCount));
    const distance = this.boardCellSize * visualRows;
    const duration = Math.min(2600, dropInterval * visualRows);
    const targets: Phaser.GameObjects.GameObject[] = [
      ...this.boardCells.flat(),
      ...this.boardSprites.flat().filter((sprite) => sprite.visible),
      ...this.boardSymbols.flat().filter((symbol) => symbol.visible)
    ];

    targets.forEach((target) => {
      const object = target as unknown as Phaser.GameObjects.Components.Transform;
      object.y -= distance;
    });

    return new Promise((resolve) => {
      this.tweens.add({
        targets,
        y: `+=${distance}`,
        duration,
        ease: 'Linear',
        onComplete: () => resolve()
      });
    });
  }

  private async playCascadeFrames(frames: CascadeAnimationFrame[]): Promise<void> {
    const effectiveFallSpeed = this.sharedGame.oopsieSystem.adjustFallSpeed(
      this.sharedGame.runState,
      this.sharedGame.runState.fallSpeed
    );
    const dropInterval = Math.max(120, BASE_DROP_MS / effectiveFallSpeed);

    for (const frame of frames) {
      this.renderBoardSnapshot(frame.grid);
      this.renderMiddleOverlays();
      if (frame.type === 'clear') {
        await this.wait(150);
      } else {
        const duration = Math.min(2400, Math.max(220, dropInterval * Math.max(1, frame.droppedRows)));
        await this.wait(duration);
      }
    }
  }

  private pulseFeverMeter(triggered: boolean): void {
    const targets = [this.feverText, this.feverBarFill].filter((target): target is NonNullable<typeof target> => Boolean(target));
    if (targets.length === 0) {
      return;
    }

    this.tweens.add({
      targets,
      scaleX: triggered ? 1.18 : 1.08,
      scaleY: triggered ? 1.18 : 1.08,
      duration: 120,
      yoyo: true,
      ease: 'Sine.easeOut'
    });
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
    if (enemy.holdHiddenTurns > 0) {
      enemy.holdHiddenTurns -= 1;
    }
    if (enemy.frozenTurns > 0) {
      enemy.frozenTurns -= 1;
    }
    if (enemy.sleepTurns > 0) {
      enemy.sleepTurns -= 1;
    }
    if (enemy.reverseControlsTurns > 0) {
      enemy.reverseControlsTurns -= 1;
    }
    if (enemy.lineDamageBlockedTurns > 0) {
      enemy.lineDamageBlockedTurns -= 1;
    }
    if (this.fever.tickActiveLock(this.sharedGame.runState)) {
      this.combat.addLog('Fever cools down.');
    }
  }

  private resolveEnemyAttack(): void {
    const state = this.sharedGame.runState;
    const enemy = state.activeEnemy;
    if (!enemy) {
      return;
    }

    if (enemy.frozenTurns > 0) {
      this.combat.addLog(`${enemy.name} is frozen and misses a beat.`);
      this.combat.resetEnemyCounter();
      this.renderAll();
      return;
    }

    if (enemy.sleepTurns > 0) {
      this.combat.addLog('You shake off the sleepy tune and skip the damage.');
      this.combat.resetEnemyCounter();
      this.renderAll();
      return;
    }

    const behavior = this.getNextEnemyBehavior(enemy);
    let damage = enemy.attack;
    this.combat.addLog(`${enemy.name} uses ${enemy.intent}.`);

    switch (behavior) {
      case 'basic_attack':
        break;
      case 'spawn_junk':
        this.board.addJunkRows(1);
        this.combat.addLog('Junk blocks rise from below.');
        break;
      case 'pattern_junk':
        this.board.addPatternJunk();
        this.combat.addLog('A patterned junk row marches onto the board.');
        break;
      case 'royal_block_spawn': {
        const added = this.board.addRoyalBlocks(4);
        this.combat.addLog(`Royal blocks appear in ${added} open spaces.`);
        break;
      }
      case 'hide_next_piece':
      case 'hide_next_block':
        enemy.previewHiddenTurns = 2;
        this.combat.addLog('The next-piece preview gets covered in glitter.');
        break;
      case 'hide_hold_block':
        enemy.holdHiddenTurns = 2;
        this.combat.addLog('The hold box gets hidden behind parade banners.');
        break;
      case 'mana_hex':
      case 'mana_zap':
        enemy.manaHexTurns = 2;
        state.player.mana = Math.max(0, state.player.mana - 12);
        this.combat.addLog('Mana Hex raises spell costs for a short time.');
        break;
      case 'shake_board':
        damage += 2;
        this.shakeCamera(220, 0.0075);
        this.combat.addLog('Heavy Slam rattles the board violently.');
        break;
      case 'increase_fall_speed':
        this.board.addJunkRows(1);
        state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + 0.06);
        this.combat.addLog('The board accelerates.');
        break;
      case 'hydra_combo_check':
        if (state.combo >= 3 || state.player.feverActiveLocks > 0) {
          damage = Math.max(0, damage - 4);
          state.player.fever = Math.min(100, state.player.fever + 8);
          this.combat.addLog('High Score Hydra awards a fever ticket for keeping the combo alive.');
        } else {
          damage += 3;
          this.board.addConfettiBlocks(2);
          this.combat.addLog('High Score Hydra taxes the low combo with flashy blocks.');
        }
        break;
      case 'reduce_line_damage':
      case 'armor_up':
        enemy.lineDamageBlockedTurns = 2;
        this.combat.addEnemyShield(6);
        this.combat.addLog('Guarded blocks soften your next clear.');
        break;
      case 'shield_self':
        this.combat.addEnemyShield(10);
        break;
      case 'heal_self':
        this.combat.healEnemy(Math.ceil(enemy.maxHp * 0.08));
        break;
      case 'freeze_piece':
        enemy.frozenTurns = 1;
        state.fallSpeed = Math.max(0.75, state.fallSpeed - 0.05);
        this.combat.addLog('Frost gathers around the falling block.');
        break;
      case 'sleep_player':
        enemy.sleepTurns = 1;
        damage = 0;
        this.combat.addLog('A cozy lullaby makes your next moment sluggish.');
        break;
      case 'swap_next_hold':
        this.board.swapNextAndHold();
        this.combat.addLog('Next and hold blocks swap in a festival shuffle.');
        break;
      case 'reverse_controls':
        enemy.reverseControlsTurns = 3;
        this.combat.addLog('Controls are reversed for a few locks.');
        break;
      default:
        this.combat.addLog(`${behavior} is handled as a simple festival bonk.`);
        break;
    }

    const attackResult = damage > 0
      ? this.combat.applyEnemyAttack(damage)
      : { defeated: false, hpDamage: 0, shieldBlocked: 0 };
    if (damage > 0) {
      const shakeIntensity = this.getDamageShakeIntensity(attackResult.hpDamage, attackResult.shieldBlocked);
      this.shakeCamera(180 + Math.min(220, damage * 18), shakeIntensity);
      this.flashPlayerHit(attackResult.hpDamage);
      this.showPlayerAttackBanner(enemy.name, attackResult.hpDamage, attackResult.shieldBlocked);
      this.combat.addLog(
        attackResult.hpDamage > 0
          ? `You take ${attackResult.hpDamage} damage.`
          : 'Your shield absorbs the hit.'
      );
      this.sharedGame.audioSystem.play('player_hit', this);
      this.vibrate(50);
      this.showFloatingText(
        attackResult.hpDamage > 0 ? `-${attackResult.hpDamage} HP` : 'Blocked',
        this.heroPortrait?.x ?? 112,
        this.heroPortrait?.y ?? 94,
        attackResult.hpDamage > 0 ? '#ff6673' : '#9adfff'
      );
    }
    this.combat.resetEnemyCounter();
    this.renderCombatUi();

    if (attackResult.defeated) {
      this.sharedGame.saveRun();
      this.finishRun(false);
      return;
    }

    this.syncBoardState();
    this.renderAll();
  }

  private showPlayerAttackBanner(enemyName: string, hpDamage: number, shieldBlocked: number): void {
    const text = hpDamage > 0
      ? `${enemyName} bonks you for ${hpDamage}!`
      : `${enemyName} bonks your shield!`;
    const color = hpDamage > 0 ? COLORS.danger : COLORS.accent;
    const panel = this.add.rectangle(this.screenWidth / 2, this.topSectionHeight + 26, this.screenWidth - 56, 44, color, 0.9)
      .setDepth(128)
      .setStrokeStyle(2, COLORS.text, shieldBlocked > 0 ? 0.5 : 0.35);
    const label = this.add.text(this.screenWidth / 2, this.topSectionHeight + 26, text, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '20px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.screenWidth - 80 }
    }).setOrigin(0.5).setDepth(129);

    this.tweens.add({
      targets: [panel, label],
      y: '-=16',
      alpha: 0,
      delay: 520,
      duration: 360,
      ease: 'Sine.easeIn',
      onComplete: () => {
        panel.destroy();
        label.destroy();
      }
    });
  }

  private getDamageShakeIntensity(hpDamage: number, shieldBlocked: number): number {
    const pressure = Math.max(hpDamage, Math.ceil(shieldBlocked / 2));
    return Math.min(0.018, 0.0035 + pressure * 0.0015);
  }

  private flashPlayerHit(hpDamage: number): void {
    const color = hpDamage > 0 ? COLORS.danger : COLORS.accent;
    const flash = this.add.rectangle(this.screenWidth / 2, 82, this.screenWidth - 48, 116, color, 0.24)
      .setDepth(125)
      .setStrokeStyle(2, color, 0.6);
    const border = this.add.rectangle(this.screenWidth / 2, this.screenHeight / 2, this.screenWidth - 18, this.screenHeight - 18, color, 0)
      .setDepth(126)
      .setStrokeStyle(6, color, hpDamage > 0 ? 0.9 : 0.6);
    if (this.heroPortrait) {
      const originalX = this.heroPortrait.x;
      this.heroPortrait.setTint(color);
      this.tweens.add({
        targets: this.heroPortrait,
        x: originalX - 8,
        duration: 45,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.heroPortrait?.setX(originalX);
          this.heroPortrait?.clearTint();
        }
      });
    }
    this.tweens.add({
      targets: [flash, border],
      alpha: 0,
      duration: 360,
      onComplete: () => {
        flash.destroy();
        border.destroy();
      }
    });
  }

  private flashEnemyHit(damage: number): void {
    if (!this.enemySprite) {
      return;
    }

    const originalX = this.enemySprite.x;
    const originalScaleX = this.enemySprite.scaleX;
    const originalScaleY = this.enemySprite.scaleY;
    this.enemySprite.setTint(damage > 0 ? COLORS.danger : COLORS.gold);
    this.tweens.add({
      targets: this.enemySprite,
      x: originalX + 8,
      scaleX: originalScaleX * 1.08,
      scaleY: originalScaleY * 1.08,
      duration: 60,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.enemySprite?.setX(originalX);
        this.enemySprite?.setScale(originalScaleX, originalScaleY);
        this.enemySprite?.clearTint();
      }
    });
  }

  private renderCombatUi(): void {
    this.renderBoard();
    this.renderEnemy();
    this.renderPreview();
    this.renderUpgrades();
    this.renderMiddleOverlays();
    this.hud.update(this.sharedGame.runState);
    this.log.update(this.sharedGame.runState);
  }

  private getNextEnemyBehavior(enemy: EnemyInstance): string {
    const behaviors = enemy.behaviors.length > 0 ? enemy.behaviors : [enemy.behavior || 'basic_attack'];
    const behavior = behaviors[enemy.behaviorIndex % behaviors.length] ?? 'basic_attack';
    enemy.behavior = behavior;
    enemy.behaviorIndex = (enemy.behaviorIndex + 1) % behaviors.length;
    return behavior;
  }

  private logEnemyCountdown(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    this.combat.addLog(`${enemy.name} attacks in ${enemy.attackCounter} block${enemy.attackCounter === 1 ? '' : 's'}.`);
  }

  private async tryCast(spellId: SpellId): Promise<void> {
    if (this.cascadeResolving) {
      return;
    }

    const state = this.sharedGame.runState;
    const enemyHpBefore = state.activeEnemy?.currentHp ?? 0;
    const playerHpBefore = state.player.hp;
    const cast = this.spells.cast(spellId);
    if (!cast) {
      this.renderAll();
      return;
    }

    state.runStats.spellsCast += 1;
    this.sharedGame.audioSystem.play('spell_cast', this);
    const damageDealt = Math.max(0, enemyHpBefore - (state.activeEnemy?.currentHp ?? enemyHpBefore));
    const hpSpent = Math.max(0, playerHpBefore - state.player.hp);

    if (state.activeEnemy) {
      this.sharedGame.audioSystem.play('enemy_hit', this);
      if (damageDealt > 0) {
        this.showFloatingText(`-${damageDealt}`, this.screenWidth - 78, 126, '#ffca6b', 28);
        this.flashEnemyHit(damageDealt);
      }
    }
    if (hpSpent > 0) {
      this.showFloatingText(`-${hpSpent} HP`, this.heroPortrait?.x ?? 112, this.heroPortrait?.y ?? 94, '#ff6673', 26);
      this.flashPlayerHit(hpSpent);
    }
    this.renderCombatUi();

    if (state.activeEnemy?.currentHp === 0) {
      await this.wait(280);
      this.handleVictory();
      return;
    }

    this.checkBossPhase();
    this.syncBoardState();
    this.sharedGame.saveRun();
    this.renderAll();
  }

  private checkBossPhase(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy || !this.sharedGame.bossSystem.shouldEnterPhaseTwo(enemy)) {
      return;
    }

    this.combat.addLog(this.sharedGame.bossSystem.enterPhaseTwo(enemy));
    this.showFloatingText('Phase 2', this.screenWidth / 2, 184, '#ffca6b', 34);
    if (!this.sharedGame.getSettings().reducedFlashing) {
      this.cameras.main.flash(180, 255, 202, 107, false);
    }
  }

  private handleVictory(): void {
    const state = this.sharedGame.runState;
    if (!state.activeEnemy) {
      return;
    }

    const enemyName = state.activeEnemy.name;
    const enemyId = state.activeEnemy.id;
    state.enemiesDefeated += 1;
    state.runStats.roomsCleared += 1;
    this.combat.addLog(`${enemyName} tumbles out of the way.`);
    const objectiveMessage = this.sharedGame.battleObjectiveSystem.evaluateVictory(state);
    if (objectiveMessage) {
      this.combat.addLog(objectiveMessage);
    }
    const friendshipMessage = this.sharedGame.friendshipSystem.gain(this.sharedGame.metaSystem.state, enemyId, 'defeat');
    if (friendshipMessage) {
      this.combat.addLog(friendshipMessage);
      this.sharedGame.metaSystem.save();
    }
    const goalMessage = this.sharedGame.stageGoalSystem.addProgress(state, 'battle_objective', 1, enemyId);
    if (goalMessage) {
      this.combat.addLog(goalMessage);
      const goalProgress = this.sharedGame.stageGoalSystem.getProgress(state);
      if (goalProgress?.progress.completed) {
        this.sharedGame.metaSystem.recordStageGoalCompleted(goalProgress.goal.id);
      }
    }
    this.sharedGame.chaosRuleSystem.clear(state);
    this.sharedGame.randomGameplayEventSystem.clearRoomEvents(state);

    if (state.lastBattleWasBoss) {
      if (!state.runStats.bossesDefeated.includes(enemyId)) {
        state.runStats.bossesDefeated.push(enemyId);
      }
      this.sharedGame.metaSystem.recordBossDefeated(enemyId, state.stage);
      if (this.sharedGame.stageSystem.isFinalStage(state.stage)) {
        this.sharedGame.mapSystem.advanceAfterBoss(state, this.sharedGame.stageSystem);
        state.victory = true;
        const endingKind = this.sharedGame.storySystem.getEndingKind(this.sharedGame.metaSystem.state);
        const beforeUnlocks = [...this.sharedGame.metaSystem.state.unlockedHeroes];
        this.sharedGame.metaSystem.recordRunEnd(state, true);
        if (endingKind === 'true') {
          this.sharedGame.metaSystem.unlockTrueEnding();
        }
        const heroUnlocks = this.sharedGame.storySystem.getHeroUnlockMessages(beforeUnlocks, this.sharedGame.metaSystem.state.unlockedHeroes);
        this.sharedGame.audioSystem.play('victory', this);
        this.sharedGame.clearSave();
        this.scene.start('VictoryScene', { endingKind, heroUnlocks });
        return;
      }

      this.sharedGame.bossSystem.grantBossRewards(state, this.sharedGame.rewardSystem);
      state.pendingStageAdvance = true;
      state.currentRoomProgress = 'reward';
      state.runStatus = 'reward';
      this.sharedGame.saveRun();
      this.scene.start('RewardScene');
      return;
    }

    state.pendingRewardSource = state.currentRoomType === 'elite' ? 'elite' : 'battle';
    state.pendingRewards = this.sharedGame.rewardSystem.getRandomRewards(3, state, state.pendingRewardSource);
    state.currentRoomProgress = 'reward';
    state.runStatus = 'reward';
    this.sharedGame.saveRun();
    this.scene.start('RewardScene');
  }

  private finishRun(victory: boolean): void {
    const state = this.sharedGame.runState;
    state.victory = victory;
    state.runStatus = victory ? 'victory' : 'game-over';
    this.sharedGame.metaSystem.recordRunEnd(state, victory);
    this.sharedGame.audioSystem.play(victory ? 'victory' : 'defeat', this);
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

  private renderBoard(showActivePiece = !this.cascadeResolving): void {
    this.copyBoardToDisplayBuffer();
    if (showActivePiece) {
      this.overlayGhostPiece();
    }

    const current = this.board.currentPiece;
    if (showActivePiece && current) {
      for (let rowIndex = 0; rowIndex < current.matrix.length; rowIndex += 1) {
        for (let colIndex = 0; colIndex < current.matrix[rowIndex].length; colIndex += 1) {
          if (!current.matrix[rowIndex][colIndex]) continue;
          const targetRow = current.y + rowIndex;
          const targetCol = current.x + colIndex;
          if (targetRow >= 0 && targetRow < this.boardRows && targetCol >= 0 && targetCol < this.boardColumns) {
            this.displayBoard[targetRow][targetCol] = current.color;
            this.displayAlpha[targetRow][targetCol] = 1;
          }
        }
      }
    }

    const colorblindSymbols = this.sharedGame.getSettings().colorblindSymbols;
    for (let row = 0; row < this.boardRows; row += 1) {
      for (let col = 0; col < this.boardColumns; col += 1) {
        const cell = this.displayBoard[row][col];
        const color = cell === 0 ? COLORS.boardEmpty : getBoardCellColor(cell);
        const alpha = this.displayAlpha[row][col];
        if (this.renderedCellColors[row][col] !== color || this.renderedCellAlphas[row][col] !== alpha) {
          this.boardCells[row][col].setFillStyle(color, alpha);
          this.renderedCellColors[row][col] = color;
          this.renderedCellAlphas[row][col] = alpha;
        }
        this.renderBoardSprite(row, col, cell);
        this.renderBoardSymbol(row, col, cell, colorblindSymbols);
      }
    }
  }

  private renderBoardSnapshot(grid: BoardCell[][]): void {
    for (let row = 0; row < this.boardRows; row += 1) {
      for (let col = 0; col < this.boardColumns; col += 1) {
        this.displayBoard[row][col] = grid[row]?.[col] ?? 0;
        this.displayAlpha[row][col] = 1;
      }
    }
    this.paintDisplayBoard();
  }

  private copyBoardToDisplayBuffer(): void {
    for (let row = 0; row < this.boardRows; row += 1) {
      for (let col = 0; col < this.boardColumns; col += 1) {
        this.displayBoard[row][col] = this.board.grid[row][col];
        this.displayAlpha[row][col] = 1;
      }
    }
  }

  private paintDisplayBoard(): void {
    const colorblindSymbols = this.sharedGame.getSettings().colorblindSymbols;
    for (let row = 0; row < this.boardRows; row += 1) {
      for (let col = 0; col < this.boardColumns; col += 1) {
        const cell = this.displayBoard[row][col];
        const color = cell === 0 ? COLORS.boardEmpty : getBoardCellColor(cell);
        const alpha = this.displayAlpha[row][col];
        if (this.renderedCellColors[row][col] !== color || this.renderedCellAlphas[row][col] !== alpha) {
          this.boardCells[row][col].setFillStyle(color, alpha);
          this.renderedCellColors[row][col] = color;
          this.renderedCellAlphas[row][col] = alpha;
        }
        this.renderBoardSprite(row, col, cell);
        this.renderBoardSymbol(row, col, cell, colorblindSymbols);
      }
    }
  }

  private overlayGhostPiece(): void {
    const current = this.board.currentPiece;
    if (!current) {
      return;
    }

    let ghostY = current.y;
    while (!this.board.collides(current.matrix, current.x, ghostY + 1)) {
      ghostY += 1;
    }
    if (ghostY === current.y) {
      return;
    }

    for (let rowIndex = 0; rowIndex < current.matrix.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < current.matrix[rowIndex].length; colIndex += 1) {
        if (!current.matrix[rowIndex][colIndex]) continue;
        const targetRow = ghostY + rowIndex;
        const targetCol = current.x + colIndex;
        if (
          targetRow >= 0 &&
          targetRow < this.boardRows &&
          targetCol >= 0 &&
          targetCol < this.boardColumns &&
          this.displayBoard[targetRow][targetCol] === 0
        ) {
          this.displayBoard[targetRow][targetCol] = COLORS.boardGhost;
          this.displayAlpha[targetRow][targetCol] = 0.32;
        }
      }
    }
  }

  private renderBoardSprite(row: number, col: number, cell: BoardCell): void {
    const sprite = this.boardSprites[row]?.[col];
    if (!sprite || typeof cell === 'number') {
      if (sprite?.visible) {
        sprite.setVisible(false);
      }
      if (this.renderedTextureKeys[row]) {
        this.renderedTextureKeys[row][col] = '';
      }
      return;
    }

    const block = contentRegistry.getBoardBlock(cell.blockId) as { spriteKey?: string } | null;
    const textureKey = this.sharedGame.assetSystem.getTextureKey(this, block?.spriteKey, 'block');
    if (this.renderedTextureKeys[row][col] !== textureKey) {
      sprite.setTexture(textureKey);
      this.renderedTextureKeys[row][col] = textureKey;
    }
    if (!sprite.visible) {
      sprite.setVisible(true);
    }
  }

  private renderBoardSymbol(row: number, col: number, cell: BoardCell, colorblindSymbols: boolean): void {
    const symbol = this.boardSymbols[row]?.[col];
    if (!symbol) {
      return;
    }

    if (!colorblindSymbols || cell === 0 || cell === COLORS.boardGhost) {
      if (symbol.visible) {
        symbol.setVisible(false);
      }
      this.renderedSymbols[row][col] = '';
      return;
    }

    const text = typeof cell === 'number' ? this.getTetrominoSymbol(cell) : this.getBlockSymbol(cell.blockId);
    if (this.renderedSymbols[row][col] !== text) {
      symbol.setText(text);
      this.renderedSymbols[row][col] = text;
    }
    if (!symbol.visible) {
      symbol.setVisible(true);
    }
  }

  private renderEnemy(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    const monster = contentRegistry.getMonster(enemy.id) as { spriteKey?: string } | null;
    this.enemySprite
      ?.setTexture(this.sharedGame.assetSystem.getTextureKey(this, monster?.spriteKey, 'sprite'))
      .setVisible(true);

    this.enemyNameText?.setText(enemy.name);
    this.enemyStatsText?.setText(`HP ${enemy.currentHp}/${enemy.maxHp}   SH ${enemy.shield}   ATK ${enemy.attack}`);
    this.enemyIntentText?.setText(
      `${enemy.roomType === 'boss' ? `Phase ${enemy.phase}  ` : ''}${enemy.intent}\n${this.getBehaviorLabel(enemy.behavior)}`
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
      case 'pattern_junk':
        return 'Pattern junk';
      case 'royal_block_spawn':
        return 'Royal blocks';
      case 'shake_board':
        return 'Shake board';
      case 'increase_fall_speed':
        return 'Increase fall speed';
      case 'hide_next_piece':
      case 'hide_next_block':
        return 'Hide next piece';
      case 'hide_hold_block':
        return 'Hide hold';
      case 'reduce_line_damage':
        return 'Reduce line damage';
      case 'mana_hex':
      case 'mana_zap':
        return 'Mana hex';
      case 'freeze_piece':
        return 'Freeze piece';
      case 'shield_self':
      case 'armor_up':
        return 'Shield self';
      case 'heal_self':
        return 'Heal self';
      case 'sleep_player':
        return 'Sleepy tune';
      case 'swap_next_hold':
        return 'Swap next/hold';
      case 'reverse_controls':
        return 'Reverse controls';
      case 'hydra_combo_check':
        return 'Combo challenge';
      default:
        return behavior;
    }
  }

  private renderPreview(): void {
    const enemy = this.sharedGame.runState.activeEnemy;
    if (!enemy) {
      return;
    }

    const settings = this.sharedGame.getSettings();
    const hidden = enemy.previewHiddenTurns > 0 || this.sharedGame.oopsieSystem.shouldHidePreview(this.sharedGame.runState);
    const nextType = this.board.nextPieceType;
    const matrix = TETROMINO_SHAPES[nextType];
    this.previewLabel?.setText(hidden ? 'Preview Hexed' : 'Next');

    this.previewTiles.forEach((tile, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const value = hidden ? 0 : matrix[row]?.[col] ?? 0;
      tile.setFillStyle(value ? TETROMINO_COLORS[nextType] : COLORS.boardEmpty, 1);
      this.previewSymbols[index]?.setText(value && settings.colorblindSymbols ? nextType : '');
      this.previewSymbols[index]?.setVisible(Boolean(value && settings.colorblindSymbols));
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
    const oopsieCount = this.sharedGame.runState.player.oopsies.length;
    this.upgradesText?.setText(
      `${owned.length ? `Relics: ${owned.length}` : 'Relics: none'}\n${oopsieCount ? `Oopsies: ${oopsieCount}` : 'Oopsies: none'}`
    );
  }

  private renderMiddleOverlays(): void {
    const state = this.sharedGame.runState;
    const enemy = state.activeEnemy;
    this.holdText?.setText(
      enemy?.holdHiddenTurns
        ? 'Hold\nHidden'
        : this.board.holdPieceType
          ? `Held\n${this.board.holdPieceType}`
          : 'Hold\nEmpty'
    );
    
    const inventorySummary = state.inventory.slice(0, 1).map(stack => `${this.sharedGame.itemSystem.getItem(stack.itemId)?.name} x${stack.count}`).join(', ');
    const bagText = state.inventory.length ? inventorySummary : 'Bag Empty';
    const chaos = this.sharedGame.chaosRuleSystem.getActive(state);
    const objective = this.sharedGame.battleObjectiveSystem.getActive(state);
    const battleStatusText = [
      `Relics ${state.ownedRewards.length}  Oops ${state.player.oopsies.length}`,
      chaos ? `Chaos: ${chaos.name}` : '',
      objective ? `Obj: ${objective.name}` : ''
    ].filter(Boolean).join('\n');
    
    this.inventoryText?.setText(
      this.inventoryExpanded
        ? `Bag Open`
        : `Gold ${state.player.gold}\n${bagText}\n${battleStatusText}`
    );
    
    this.inventoryOverlay.setVisible(this.inventoryExpanded);
    if (this.inventoryExpanded) {
      const renderKey = this.getInventoryRenderKey(state);
      if (renderKey === this.inventoryRenderKey) {
        this.renderFeverAndButtons(state);
        return;
      }
      this.inventoryRenderKey = renderKey;
      this.clearInventoryOverlayContent();
      
      const startX = this.screenWidth / 2 - 160;
      const startY = this.topSectionHeight + 84;

      if (state.inventory.length === 0) {
        const emptyText = this.add.text(this.screenWidth / 2, startY + 92, 'Your bag is empty.', {
          color: '#d8deff',
          fontFamily: FONT_FAMILY,
          fontSize: '24px',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        this.inventoryOverlay.add(emptyText);
        this.inventoryDynamicObjects.push(emptyText);
      }
      
      state.inventory.forEach((stack, index) => {
        const itemDef = this.sharedGame.itemSystem.getItem(stack.itemId);
        if (!itemDef) return;
        
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = startX + col * 170;
        const y = startY + row * 70;
        
        const btn = new Button(this, x + 70, y + 30, 158, 58, `${itemDef.name}\n(x${stack.count})`, () => {
          const msg = this.sharedGame.itemSystem.applyItem(state, stack.itemId, this.board, this.combat);
          this.combat.addLog(msg);
          this.sharedGame.inventorySystem.removeItem(state, stack.itemId, 1);
          state.runStats.itemsUsed += 1;
          this.sharedGame.audioSystem.play('item_use', this);
          this.sharedGame.saveRun();
          
          if (state.inventory.length === 0) {
            this.inventoryExpanded = false;
          }
          this.renderAll();
        }, { iconKey: itemDef.iconKey });
        this.inventoryOverlay.add(btn);
        this.inventoryButtons.push(btn);
      });
      
      const closeBtn = new Button(this, this.screenWidth / 2, this.topSectionHeight + this.middleSectionHeight - 46, 132, 52, 'Close', () => {
        this.toggleInventory();
      });
      this.inventoryOverlay.add(closeBtn);
      this.inventoryButtons.push(closeBtn);
    } else {
      this.inventoryRenderKey = '';
      this.clearInventoryOverlayContent();
    }

    this.renderFeverAndButtons(state);
  }

  private renderFeverAndButtons(state: RunState): void {
    this.feverText?.setText(
      state.player.feverActiveLocks > 0
        ? `Fever ON\n${state.player.feverActiveLocks} locks`
        : `Fever ${state.player.fever}%\nCombo ${state.combo}`
    );
    this.feverBarFill?.setSize(Math.max(0, Math.min(1, state.player.fever / 100)) * 132, 8);
    this.feverBarFill?.setFillStyle(state.player.feverActiveLocks > 0 ? COLORS.gold : COLORS.success, 1);
    this.cascadeText?.setText(
      state.lastCascadeLevel > 0
        ? `Cascade x${state.lastCascadeLevel} / ${state.lastCascadeLines} line${state.lastCascadeLines === 1 ? '' : 's'}`
        : 'Cascade x0'
    );
    this.spellButtons.forEach(({ spellId, button }) => {
      button.setDisabled(state.player.mana < this.spells.getCost(spellId));
      const spell = SPELLS.find((entry) => entry.id === spellId);
      if (spell) {
        button.setText(`${spell.key}\n${this.spells.getCost(spellId)}`);
      }
    });
  }

  private getInventoryRenderKey(state: RunState): string {
    return state.inventory.map((stack) => `${stack.itemId}:${stack.count}`).join('|');
  }

  private clearInventoryOverlayContent(): void {
    this.inventoryButtons.forEach(btn => btn.destroy());
    this.inventoryButtons = [];
    this.inventoryDynamicObjects.forEach((item) => item.destroy());
    this.inventoryDynamicObjects = [];
  }

  private showFloatingText(text: string, x: number, y: number, color: string, fontSize = 30): void {
    const label = this.getFloatingText();
    label
      .setText(text)
      .setPosition(x, y)
      .setStyle({
        color,
        fontFamily: FONT_FAMILY,
        fontSize: `${fontSize}px`,
        fontStyle: 'bold',
        stroke: '#05060a',
        strokeThickness: 4
      })
      .setAlpha(1)
      .setVisible(true)
      .setActive(true)
      .setDepth(120);

    this.tweens.add({
      targets: label,
      y: y - 44,
      alpha: 0,
      duration: 850,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        label.setVisible(false).setActive(false);
      }
    });
  }

  private getFloatingText(): Phaser.GameObjects.Text {
    const pooled = this.floatingTextPool.find((label) => !label.active);
    if (pooled) {
      return pooled;
    }

    const label = this.add.text(0, 0, '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '30px',
      fontStyle: 'bold',
      stroke: '#05060a',
      strokeThickness: 4
    }).setOrigin(0.5).setVisible(false).setActive(false);
    this.floatingTextPool.push(label);
    return label;
  }

  private showBossIntro(name: string, line: string): void {
    const panel = this.add.rectangle(this.screenWidth / 2, 186, this.screenWidth - 64, 96, COLORS.panelAlt, 0.98)
      .setStrokeStyle(3, COLORS.gold, 0.85)
      .setDepth(130);
    const title = this.add.text(this.screenWidth / 2, 166, 'Boss Battle', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '30px',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(131);
    const body = this.add.text(this.screenWidth / 2, 202, `${name}\n${line}`, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '21px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.screenWidth - 104 }
    }).setOrigin(0.5).setDepth(131);
    this.activeBossIntroObjects = [panel, title, body];

    this.time.delayedCall(1250, () => {
      this.tweens.add({
        targets: [panel, title, body],
        alpha: 0,
        duration: 350,
        onComplete: () => {
          panel.destroy();
          title.destroy();
          body.destroy();
          this.activeBossIntroObjects = [];
        }
      });
    });
  }

  private showBossRuleCard(bossId: string): void {
    const card = this.sharedGame.bossRuleSystem.getForBoss(bossId);
    if (!card) {
      return;
    }
    const rules = card.phaseRules
      .slice(0, 2)
      .map((rule) => `P${rule.phase}: ${rule.effect}${rule.playerTip ? ` Tip: ${rule.playerTip}` : ''}`)
      .join('\n');
    const panel = this.add.rectangle(this.screenWidth / 2, 310, this.screenWidth - 72, 150, COLORS.panelAlt, 0.98)
      .setStrokeStyle(3, COLORS.gold, 0.8)
      .setDepth(132);
    const title = this.add.text(this.screenWidth / 2, 258, card.title, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.screenWidth - 104 }
    }).setOrigin(0.5).setDepth(133);
    const body = this.add.text(this.screenWidth / 2, 326, `${card.description}\n${rules}`, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      align: 'center',
      wordWrap: { width: this.screenWidth - 112 },
      lineSpacing: 4
    }).setOrigin(0.5).setDepth(133);
    const dismiss = new Button(this, this.screenWidth / 2, 392, 160, 42, 'Got It', () => {
      panel.destroy();
      title.destroy();
      body.destroy();
      dismiss.destroy();
    });
    dismiss.setDepth(134);
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.time.delayedCall(ms, resolve);
    });
  }

  private shakeCamera(duration: number, intensity: number): void {
    if (this.sharedGame.getSettings().screenShake) {
      this.cameras.main.shake(duration, intensity);
    }
  }

  private vibrate(duration: number): void {
    if (this.sharedGame.getSettings().vibration && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }

  private getTetrominoSymbol(color: number): string {
    const match = Object.entries(TETROMINO_COLORS).find(([, value]) => value === color);
    return match?.[0] ?? '';
  }

  private getBlockSymbol(blockId: string): string {
    const parts = blockId.split('_');
    return (parts[1]?.[0] ?? blockId[0] ?? '?').toUpperCase();
  }

  private syncBoardState(): void {
    this.sharedGame.runState.board = {
      columns: this.boardColumns,
      rows: this.boardRows,
      activePieceType: this.board.currentPiece?.type ?? null,
      nextPieceType: this.board.nextPieceType,
      holdPieceType: this.board.holdPieceType,
      topOut: false,
      grid: this.board.grid.map((row) => row.map((cell) => (typeof cell === 'number' ? cell : {
        ...cell,
        clearEffects: cell.clearEffects.map((effect) => ({ ...effect }))
      }))),
      currentPiece: this.board.currentPiece ? {
        ...this.board.currentPiece,
        matrix: this.board.currentPiece.matrix.map((row) => [...row])
      } : null,
      holdUsedThisPiece: this.board.holdUsedThisPiece
    };
  }
}
