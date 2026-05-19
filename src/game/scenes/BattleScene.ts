import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { getAnimationDefinition } from '../data/animations';
import { SPELLS } from '../data/spells';
import { BoardSystem, getBoardCellColor, getTetrominoBlockId } from '../systems/BoardSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { FeverSystem } from '../systems/FeverSystem';
import { InputSystem } from '../systems/InputSystem';
import { OopsieSystem } from '../systems/OopsieSystem';
import { SpellSystem } from '../systems/SpellSystem';
import { contentRegistry } from '../systems/ContentRegistry';
import type { ActiveHazardKind, ActiveHazardState, BoardCell, BoardTickResult, CascadeAnimationFrame, CascadeResult, CounterTag, EnemyInstance, RunState, SpellId, TetrominoType } from '../types/GameTypes';
import { EventLog } from '../ui/EventLog';
import { Hud } from '../ui/Hud';
import { MobileControls } from '../ui/MobileControls';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';
import {
  BOARD_CELL_SIZE,
  BOARD_PREVIEW_CELL_SIZE,
  BOSS_BATTLE_BOX_SIZE,
  COMBAT_HIT_VFX_BOX_SIZE,
  HERO_BATTLE_BOX_SIZE,
  ITEM_VFX_BOX_SIZE,
  MOBILE_CONTROL_BUTTON_SIZE,
  MONSTER_BATTLE_BOX_SIZE,
  SPELL_VFX_BOX_SIZE,
  UI_BUTTON_HEIGHT,
  fitSpriteToBox,
  setBoardBlockDisplaySize,
  setBoardPreviewBlockDisplaySize,
  setBoardVfxDisplaySize
} from '../data/renderSizes';
import {
  BASE_DROP_MS,
  BLOCK_ANIM,
  BOARD_COLS,
  BOARD_ROWS,
  COLORS,
  FONT_FAMILY,
  MAX_FALL_SPEED,
  TETROMINO_COLORS,
  TETROMINO_SHAPES
} from '../utils/constants';

const HAZARD_WINDOWS: Record<ActiveHazardKind, Omit<ActiveHazardState, 'instanceId' | 'kind' | 'remainingPieces'>> = {
  incoming_junk: {
    hazardId: 'hazard_incoming_junk_queue',
    name: 'Incoming Junk',
    warningText: 'Crumb junk is lining up in the snack tray!',
    counterTags: ['counter_incoming_junk', 'counter_junk'],
    counterWindowPieces: 3,
    severity: 'moderate',
    defaultFailureEffect: 'Remaining junk drops onto random columns.',
    itemCounterHints: ['Snack Shield', 'Return Stamp', 'Snack Vacuum'],
    spellCounterHints: ['Bomb Rune', 'Void Cut'],
    cascadeCounterHint: 'Trigger a cascade to reduce incoming junk.'
  },
  floating_block: {
    hazardId: 'hazard_floaty_rune',
    name: 'Floaty Rune',
    warningText: 'A Floaty Rune is wobbling overhead!',
    counterTags: ['counter_float'],
    counterWindowPieces: 3,
    severity: 'minor',
    defaultFailureEffect: 'Drops as cloud junk.',
    itemCounterHints: ['Cloud Pin'],
    spellCounterHints: ['Bomb Rune', 'Void Cut'],
    cascadeCounterHint: 'Clear space below it before it drops.'
  },
  freeze: {
    hazardId: 'hazard_freeze_warning',
    name: 'Freeze Warning',
    warningText: 'Frost is gathering around your active block!',
    counterTags: ['counter_freeze'],
    counterWindowPieces: 2,
    severity: 'moderate',
    defaultFailureEffect: 'The board gets a small speed nudge.',
    itemCounterHints: ['Hot Cocoa'],
    spellCounterHints: ['Frost Lock']
  },
  preview: {
    hazardId: 'hazard_preview_hidden',
    name: 'Preview Glitter',
    warningText: 'A Sugar Bat is blocking your preview!',
    counterTags: ['counter_preview'],
    counterWindowPieces: 3,
    severity: 'minor',
    defaultFailureEffect: 'Next and Hold previews are hidden briefly.',
    itemCounterHints: ['Preview Glasses'],
    spellCounterHints: []
  },
  low_ceiling: {
    hazardId: 'hazard_low_ceiling',
    name: 'Low Ceiling',
    warningText: 'The ceiling is getting suspiciously lower!',
    counterTags: ['counter_low_ceiling', 'counter_board_size'],
    counterWindowPieces: 6,
    severity: 'major',
    defaultFailureEffect: 'The top row is pressured but not soft-locked.',
    itemCounterHints: ['Tent Pole', 'Safety Net'],
    spellCounterHints: ['Void Cut'],
    cascadeCounterHint: 'Clear high rows before the ceiling dips.'
  },
  bad_piece: {
    hazardId: 'hazard_bad_piece_delivery',
    name: 'Weird Delivery',
    warningText: 'A goblin put something weird in the queue!',
    counterTags: ['counter_piece_queue'],
    counterWindowPieces: 2,
    severity: 'minor',
    defaultFailureEffect: 'An awkward piece enters Next.',
    itemCounterHints: ['Nope Stamp', 'Queue Comb'],
    spellCounterHints: []
  },
  sleep: {
    hazardId: 'hazard_sleep_warning',
    name: 'Sleepy Tune',
    warningText: 'A pillow-soft tune is trying to make the room drowsy!',
    counterTags: ['counter_sleep'],
    counterWindowPieces: 3,
    severity: 'moderate',
    defaultFailureEffect: 'A cozy tune slows the next beat.',
    itemCounterHints: ['Alarm Cookie'],
    spellCounterHints: []
  },
  speed_wave: {
    hazardId: 'hazard_speed_wave',
    name: 'Speed Wave',
    warningText: 'The floor is wobbling faster!',
    counterTags: ['counter_speed'],
    counterWindowPieces: 4,
    severity: 'moderate',
    defaultFailureEffect: 'Fall speed rises slightly.',
    itemCounterHints: ['Speed Brake'],
    spellCounterHints: ['Frost Lock']
  },
  royal_pattern: {
    hazardId: 'hazard_royal_pattern',
    name: 'Royal Pattern',
    warningText: 'Bloxley demands a proper rectangle!',
    counterTags: ['counter_royal', 'counter_pattern'],
    counterWindowPieces: 3,
    severity: 'boss',
    defaultFailureEffect: 'Royal blocks appear in open spaces.',
    itemCounterHints: ['Royal Eraser', 'Snack Vacuum'],
    spellCounterHints: ['Void Cut', 'Bomb Rune'],
    cascadeCounterHint: 'Cascades soften pattern pressure.'
  }
};

export class BattleScene extends Phaser.Scene {
  private board!: BoardSystem;
  private combat!: CombatSystem;
  private fever!: FeverSystem;
  private spells!: SpellSystem;
  private oopsies!: OopsieSystem;
  private hud!: Hud;
  private log!: EventLog;
  private boardCells: Phaser.GameObjects.Rectangle[][] = [];
  private boardSprites: Phaser.GameObjects.Sprite[][] = [];
  private boardSymbols: Phaser.GameObjects.Text[][] = [];
  private displayBoard: BoardCell[][] = [];
  private displayAlpha: number[][] = [];
  private boardVisualState: 'base' | 'glow' | 'clear' = 'base';
  private renderedCellColors: number[][] = [];
  private renderedCellAlphas: number[][] = [];
  private renderedTextureKeys: string[][] = [];
  private renderedAnimationKeys: string[][] = [];
  private renderedSymbols: string[][] = [];
  private previewSymbols: Phaser.GameObjects.Text[] = [];
  private holdPreviewSymbols: Phaser.GameObjects.Text[] = [];
  private previewSprites: Phaser.GameObjects.Sprite[] = [];
  private holdPreviewSprites: Phaser.GameObjects.Sprite[] = [];
  private heroPortrait?: Phaser.GameObjects.Image;
  private enemySprite?: Phaser.GameObjects.Image;
  private enemyNameText?: Phaser.GameObjects.Text;
  private enemyStatsText?: Phaser.GameObjects.Text;
  private enemyIntentText?: Phaser.GameObjects.Text;
  private enemyCountdownText?: Phaser.GameObjects.Text;
  private upgradesText?: Phaser.GameObjects.Text;
  private enemyHpBar?: ProgressBar;
  private previewTiles: Phaser.GameObjects.Rectangle[] = [];
  private holdPreviewTiles: Phaser.GameObjects.Rectangle[] = [];
  private previewLabel?: Phaser.GameObjects.Text;
  private previewExtraText?: Phaser.GameObjects.Text;
  private holdText?: Phaser.GameObjects.Text;
  private inventoryText?: Phaser.GameObjects.Text;
  private feverText?: Phaser.GameObjects.Text;
  private feverBarFill?: Phaser.GameObjects.Rectangle;
  private cascadeText?: Phaser.GameObjects.Text;
  private hazardTrayBg?: Phaser.GameObjects.Rectangle;
  private hazardTrayText?: Phaser.GameObjects.Text;
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
  private boardCellSize: number = BOARD_CELL_SIZE;
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
    this.renderedAnimationKeys = [];
    this.renderedSymbols = [];
    this.previewSymbols = [];
    this.holdPreviewSymbols = [];
    this.previewSprites = [];
    this.holdPreviewSprites = [];
    this.spellButtons = [];
    this.previewTiles = [];
    this.holdPreviewTiles = [];
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
    this.boardCellSize = BOARD_CELL_SIZE;
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
    this.sharedGame.weaponSystem.applyBattleStart(state, this.combat, this.board);
    if (this.sharedGame.bossSystem.isBoss(state.activeEnemy)) {
      const fallbackIntro = this.sharedGame.bossSystem.getIntro(state.activeEnemy);
      const bossBeat = this.sharedGame.storySystem.getBossIntro(state.activeEnemy.id, fallbackIntro);
      bossBeat.lines.forEach((line) => this.combat.addLog(line));
      const stageId = this.sharedGame.stageSystem.getStageByIndex(state.stage)?.id ?? 'stage_sprinkle_sewers';
      const routeLines = this.sharedGame.routeStorySystem.getBossCallback(state.hero.id, stageId, state.routeProgress);
      routeLines.forEach((line) => this.combat.addLog(this.sharedGame.dialogueSystem.formatLine(line)));
      const routeModifierMessage = this.sharedGame.routeStorySystem.applyBossCallbackModifier(state);
      if (routeModifierMessage) {
        this.combat.addLog(routeModifierMessage);
      }
      this.sharedGame.audioSystem.play('boss_intro', this);
      this.showBossIntro(state.activeEnemy.name, bossBeat.lines[0] ?? fallbackIntro);
      this.showBossRuleCard(state.activeEnemy.id);
      this.sharedGame.bossSystem.applyBossStartMechanic(state, this.board).forEach((message) => this.combat.addLog(message));
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
    this.addStageBackgroundLayers();

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
      null,
      'sprite'
    ).setAlpha(0.95);
    this.heroPortrait.setTexture(
      this.sharedGame.assetSystem.getHeroTexture(this, this.sharedGame.runState.hero.id, 'idle')
    );
    fitSpriteToBox(this.heroPortrait, HERO_BATTLE_BOX_SIZE, HERO_BATTLE_BOX_SIZE);

    this.enemySprite = this.sharedGame.assetSystem.addImage(
      this,
      this.screenWidth - 78,
      160,
      null,
      'sprite'
    ).setAlpha(0.95);
    fitSpriteToBox(this.enemySprite, MONSTER_BATTLE_BOX_SIZE, MONSTER_BATTLE_BOX_SIZE);

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
    this.createTetrominoPreviewTiles(
      sideCenterX,
      this.boardOffsetY + 34,
      this.holdPreviewTiles,
      this.holdPreviewSprites,
      this.holdPreviewSymbols,
      this.screenWidth <= 520
    );

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

    this.hazardTrayBg = this.add.rectangle(this.screenWidth / 2, this.logY - 28, this.screenWidth - 48, 44, COLORS.panelAlt, 0.96)
      .setStrokeStyle(2, COLORS.gold, 0.35)
      .setVisible(false);
    this.hazardTrayText = this.add.text(this.screenWidth / 2, this.logY - 28, '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      align: 'center',
      wordWrap: { width: this.screenWidth - 72 }
    }).setOrigin(0.5).setVisible(false);
  }

  private addStageBackgroundLayers(): void {
    const far = this.sharedGame.assetSystem.getStageBackground(this, this.sharedGame.runState.stage, 'battleFar');
    const mid = this.sharedGame.assetSystem.getStageBackground(this, this.sharedGame.runState.stage, 'battleMid');
    const near = this.sharedGame.assetSystem.getStageBackground(this, this.sharedGame.runState.stage, 'battleNear');
    const layers = [far, mid, near].filter((key, index, all) => all.indexOf(key) === index);

    layers.forEach((key, index) => {
      this.add.image(this.screenWidth / 2, this.screenHeight / 2, key)
        .setDisplaySize(this.screenWidth, this.screenHeight)
        .setAlpha(layers.length > 1 ? [0.1, 0.14, 0.09][index] ?? 0.1 : 0.18);
    });
  }

  private buildBoard(): void {
    for (let row = 0; row < this.boardRows; row += 1) {
      const cellRow: Phaser.GameObjects.Rectangle[] = [];
      const spriteRow: Phaser.GameObjects.Sprite[] = [];
      const symbolRow: Phaser.GameObjects.Text[] = [];
      for (let col = 0; col < this.boardColumns; col += 1) {
        const settings = this.sharedGame.getSettings();
        const cell = this.add
          .rectangle(
            this.boardOffsetX + col * this.boardCellSize + this.boardCellSize / 2,
            this.boardOffsetY + row * this.boardCellSize + this.boardCellSize / 2,
            BOARD_CELL_SIZE,
            BOARD_CELL_SIZE,
            COLORS.boardEmpty,
            1
          )
          .setStrokeStyle(1, COLORS.boardGrid, settings.showGrid ? 0.9 : 0);
        cellRow.push(cell);
        const sprite = this.add
          .sprite(
            this.boardOffsetX + col * this.boardCellSize + this.boardCellSize / 2,
            this.boardOffsetY + row * this.boardCellSize + this.boardCellSize / 2,
            this.sharedGame.assetSystem.getTextureKey(this, null, 'block')
          )
          .setVisible(false);
        setBoardBlockDisplaySize(sprite);
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
      this.renderedAnimationKeys[row] = [];
      this.renderedSymbols[row] = [];
      for (let col = 0; col < this.boardColumns; col += 1) {
        this.displayBoard[row][col] = 0;
        this.displayAlpha[row][col] = 1;
        this.renderedCellColors[row][col] = -1;
        this.renderedCellAlphas[row][col] = -1;
        this.renderedTextureKeys[row][col] = '';
        this.renderedAnimationKeys[row][col] = '';
        this.renderedSymbols[row][col] = '';
      }
    }
  }

  private createPreviewPanel(): void {
    const compact = this.screenWidth <= 520;
    const panelSize = compact ? 84 : 116;
    const tileSize = BOARD_PREVIEW_CELL_SIZE;
    const tileStep = BOARD_PREVIEW_CELL_SIZE + (compact ? 1 : 4);
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
      setBoardPreviewBlockDisplaySize(tile);
      this.previewTiles.push(tile);
      const sprite = this.add
        .sprite(tile.x + tileSize / 2, tile.y + tileSize / 2, this.sharedGame.assetSystem.getTextureKey(this, null, 'block'))
        .setVisible(false);
      setBoardPreviewBlockDisplaySize(sprite);
      this.previewSprites.push(sprite);
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

  private createTetrominoPreviewTiles(
    centerX: number,
    centerY: number,
    tiles: Phaser.GameObjects.Rectangle[],
    sprites: Phaser.GameObjects.Sprite[],
    symbols: Phaser.GameObjects.Text[],
    compact: boolean
  ): void {
    const tileSize = BOARD_PREVIEW_CELL_SIZE;
    const tileStep = BOARD_PREVIEW_CELL_SIZE + (compact ? 1 : 4);
    const startOffset = compact ? -34 : -38;
    for (let index = 0; index < 16; index += 1) {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const tile = this.add
        .rectangle(centerX + startOffset + col * tileStep, centerY + startOffset + row * tileStep, tileSize, tileSize, COLORS.boardEmpty, 1)
        .setStrokeStyle(1, COLORS.boardGrid, this.sharedGame.getSettings().showGrid ? 0.8 : 0)
        .setOrigin(0, 0)
        .setVisible(false);
      setBoardPreviewBlockDisplaySize(tile);
      tiles.push(tile);
      const sprite = this.add
        .sprite(tile.x + tileSize / 2, tile.y + tileSize / 2, this.sharedGame.assetSystem.getTextureKey(this, null, 'block'))
        .setVisible(false);
      setBoardPreviewBlockDisplaySize(sprite);
      sprites.push(sprite);
      symbols.push(this.add.text(tile.x + tileSize / 2, tile.y + tileSize / 2 + 1, '', {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '10px' : '12px',
        fontStyle: 'bold',
        stroke: '#05060a',
        strokeThickness: 2
      }).setOrigin(0.5).setVisible(false));
    }
  }

  private createMobileControls(): void {
    const settings = this.sharedGame.getSettings();
    const buttonScale = settings.buttonSize === 'large' ? 1.12 : 1;
    const size = (value: number) => Math.round(value * buttonScale);
    const movementRow = [
      { label: '<', width: size(MOBILE_CONTROL_BUTTON_SIZE), height: size(UI_BUTTON_HEIGHT), onPress: () => this.moveHorizontal(-1), repeat: true, repeatDelayMs: 180, repeatIntervalMs: 90 },
      { label: '>', width: size(MOBILE_CONTROL_BUTTON_SIZE), height: size(UI_BUTTON_HEIGHT), onPress: () => this.moveHorizontal(1), repeat: true, repeatDelayMs: 180, repeatIntervalMs: 90 },
      { label: 'Rot', width: size(MOBILE_CONTROL_BUTTON_SIZE), height: size(UI_BUTTON_HEIGHT), onPress: () => this.rotatePiece() },
      { label: 'Soft', width: size(MOBILE_CONTROL_BUTTON_SIZE + 10), height: size(UI_BUTTON_HEIGHT), onPress: () => this.softDrop(), repeat: true, repeatDelayMs: 120, repeatIntervalMs: 60 },
      { label: 'Drop', width: size(MOBILE_CONTROL_BUTTON_SIZE + 14), height: size(UI_BUTTON_HEIGHT), onPress: () => this.hardDrop() },
      { label: 'Hold', width: size(MOBILE_CONTROL_BUTTON_SIZE + 8), height: size(UI_BUTTON_HEIGHT), onPress: () => this.handleHold() }
    ];
    const playableSpells = SPELLS.filter((spell) => this.sharedGame.runState.spells.includes(spell.id));
    const spellButtons = playableSpells.map((spell) => {
        const spellContent = contentRegistry.getSpell(`spl_${spell.id.replace(/-/g, '_')}`) as { iconKey?: string } | null;
        return {
          label: `${spell.key}\n${this.spells.getCost(spell.id)}`,
          width: size(MOBILE_CONTROL_BUTTON_SIZE),
          height: size(UI_BUTTON_HEIGHT),
          iconKey: this.sharedGame.assetSystem.getIcon(this, 'spell', `spl_${spell.id.replace(/-/g, '_')}`, spellContent?.iconKey),
          disabled: this.sharedGame.runState.player.mana < this.spells.getCost(spell.id),
          onPress: () => this.tryCast(spell.id),
          onCreate: (button: Button) => this.spellButtons.push({ spellId: spell.id, button })
        };
      });
    const spellRows = this.chunkControls([
      ...spellButtons,
      { label: 'Bag', width: size(MOBILE_CONTROL_BUTTON_SIZE), height: size(UI_BUTTON_HEIGHT), onPress: () => this.toggleInventory() }
    ], this.screenWidth <= 520 ? 5 : 8);
    new MobileControls(
      this,
      this.controlsCenterX,
      this.controlsY,
      settings.leftHandedControls
        ? [movementRow.slice().reverse(), ...spellRows.map((row) => row.slice().reverse())]
        : [movementRow, ...spellRows],
      { padding: 10, rowGap: 6, buttonGap: 6 }
    );
  }

  private chunkControls<T>(items: T[], size: number): T[][] {
    const rows: T[][] = [];
    for (let index = 0; index < items.length; index += size) {
      rows.push(items.slice(index, index + size));
    }
    return rows;
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
      this.sharedGame.runState.runStats.holdsUsed += 1;
      this.sharedGame.battleObjectiveSystem.recordHold(this.sharedGame.runState);
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
      const result = this.board.hardDrop();
      if (result.locked) {
        this.sharedGame.weaponSystem.onHardDrop(this.sharedGame.runState, this.combat);
      }
      this.resolveTick(result);
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
      if (state.reactiveState.safetyNetArmed) {
        state.reactiveState.safetyNetArmed = false;
        const cleared = this.board.clearTopOccupiedCells(this.boardColumns);
        state.board.topOut = false;
        this.combat.addLog(`Safety Net catches the overflow and clears ${cleared} top block${cleared === 1 ? '' : 's'}.`);
        this.syncBoardState();
        this.sharedGame.saveRun();
        this.renderAll();
        return;
      }
      if (
        state.hero.passiveId === 'passive_no_snack_left_behind' &&
        !state.player.emergencyBarrierUsed
      ) {
        state.player.emergencyBarrierUsed = true;
        state.player.shield += 10;
        this.playVfx('anim_vfx_shield_gain', this.heroPortrait?.x ?? 112, this.heroPortrait?.y ?? 94, COMBAT_HIT_VFX_BOX_SIZE, 126);
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
      this.playVfx('anim_vfx_line_clear', this.screenWidth / 2, this.boardOffsetY + this.boardRows * this.boardCellSize * 0.5, SPELL_VFX_BOX_SIZE, 95);
    }
    if (cascade.cascadeCount > 1 || cascade.blocksDropped > 0) {
      this.sharedGame.audioSystem.play('cascade', this);
      this.playVfx('anim_vfx_cascade_pop', this.screenWidth / 2, this.boardOffsetY + 118, SPELL_VFX_BOX_SIZE, 96);
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
      this.playVfx('anim_vfx_cascade_chain_bonus', this.screenWidth / 2, this.boardOffsetY + 164, SPELL_VFX_BOX_SIZE, 97);
      this.showFloatingText('Cascade Combo!', this.screenWidth / 2, this.boardOffsetY + 164, '#ffca6b', 30);
      this.showFloatingText(`Combo x${state.combo}`, this.screenWidth / 2, this.boardOffsetY + 206, '#f6f7ff', 25);
    }
    if (result.damage > 0) {
      this.sharedGame.audioSystem.play('enemy_hit', this);
      this.playVfx('anim_vfx_enemy_hit', this.enemySprite?.x ?? this.screenWidth - 78, this.enemySprite?.y ?? 92, COMBAT_HIT_VFX_BOX_SIZE, 126);
      this.showFloatingText(`-${result.damage}`, this.screenWidth - 78, 92, result.specialDamage > 0 ? '#65d6a5' : '#ffca6b');
      this.flashEnemyHit(result.damage);
    }
    if (result.feverGained > 0 || result.feverTriggered) {
      this.pulseFeverMeter(result.feverTriggered);
    }
    if (result.feverTriggered) {
      state.runStats.feverTriggers += 1;
      this.sharedGame.battleObjectiveSystem.recordFeverTriggered(state);
    }
    state.runStats.piecesLocked += 1;
    state.runStats.linesCleared += cascade.totalLinesCleared;
    state.runStats.cascadesTriggered += cascade.cascadeCount > 1 ? 1 : 0;
    state.runStats.maxCascade = Math.max(state.runStats.maxCascade, cascade.cascadeCount);
    state.runStats.damageDealt += result.damage;
    this.sharedGame.battleObjectiveSystem.recordCascade(state, cascade);
    this.sharedGame.weaponSystem.afterPieceLock(state, this.board, this.combat, cascade);
    this.reduceIncomingJunkFromCascade(cascade);
    if (cascade.cascadeCount > 1) {
      const stageGoalMessage = this.sharedGame.stageGoalSystem.addProgress(state, 'combo_score', cascade.cascadeCount);
      if (stageGoalMessage) {
        this.combat.addLog(stageGoalMessage);
      }
    }
    this.applyOopsieBoardEffects(cascade.totalLinesCleared);
    this.tickActiveHazards();
    this.renderCombatUi();

    if (state.activeEnemy && state.activeEnemy.currentHp <= 0) {
      await this.wait(280);
      this.cascadeResolving = false;
      this.syncBoardState();
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
      this.boardVisualState = frame.type === 'clear' ? 'clear' : 'glow';
      this.renderBoardSnapshot(frame.grid);
      this.renderMiddleOverlays();
      if (frame.type === 'clear') {
        const clearAnimations = (frame.clearedCells ?? [])
          .flatMap((cleared) => typeof cleared.cell === 'number' ? [] : [this.playBoardBlockClearAnimation(
            this.boardOffsetX + cleared.col * this.boardCellSize + this.boardCellSize / 2,
            this.boardOffsetY + cleared.row * this.boardCellSize + this.boardCellSize / 2,
            cleared.cell.blockId
          )]);
        if (clearAnimations.length > 0) {
          await Promise.all(clearAnimations);
        } else {
          await this.wait(BLOCK_ANIM.CLEAR_TOTAL_MS);
        }
      } else {
        const duration = Math.min(2400, Math.max(220, dropInterval * Math.max(1, frame.droppedRows)));
        await this.wait(duration);
      }
    }
    this.boardVisualState = 'base';
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
    const reactive = this.sharedGame.runState.reactiveState;
    reactive.previewRevealPieces = Math.max(0, reactive.previewRevealPieces - 1);
    reactive.speedBrakePieces = Math.max(0, reactive.speedBrakePieces - 1);
    reactive.freezeGuardPieces = Math.max(0, reactive.freezeGuardPieces - 1);
    reactive.anchorCookiePieces = Math.max(0, reactive.anchorCookiePieces - 1);
    reactive.cleanupCouponPieces = Math.max(0, reactive.cleanupCouponPieces - 1);
    reactive.nopeStampPieces = Math.max(0, reactive.nopeStampPieces - 1);
    reactive.sleepGuardPieces = Math.max(0, reactive.sleepGuardPieces - 1);

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
    state.runStats.enemyAttacks += 1;
    this.sharedGame.battleObjectiveSystem.recordEnemyAttack(state);
    this.combat.addLog(`${enemy.name} uses ${enemy.intent}.`);
    this.enemySprite?.setTexture(this.sharedGame.assetSystem.getMonsterTexture(this, enemy.id, 'attack'));
    this.fitEnemyBattleSprite(enemy);

    switch (behavior) {
      case 'basic_attack':
        break;
      case 'spawn_junk':
        this.queueIncomingJunk(this.getStageHazardAmount(2), enemy.id, this.getStageCounterWindow(), 'block_crumb_junk');
        if (state.stage >= 2) {
          this.spawnFloatingBlock('block_floaty_rune', this.getStageCounterWindow());
        }
        this.combat.addLog('Crumb junk lines up in the snack tray.');
        break;
      case 'pattern_junk':
        this.queueIncomingJunk(this.getStageHazardAmount(3), enemy.id, this.getStageCounterWindow(), 'block_crumb_junk');
        this.startHazardWarning('royal_pattern', {
          sourceId: enemy.id,
          amount: 1,
          delayPieces: Math.max(2, this.getStageCounterWindow())
        });
        this.combat.addLog('Pattern junk waits for a readable opening.');
        break;
      case 'royal_block_spawn': {
        this.startHazardWarning('royal_pattern', {
          sourceId: enemy.id,
          amount: 4,
          delayPieces: Math.max(2, this.getStageCounterWindow())
        });
        this.combat.addLog('Royal blocks are being measured for a fancy pattern.');
        break;
      }
      case 'hide_next_piece':
      case 'hide_next_block':
        this.startHazardWarning('preview', { sourceId: enemy.id, delayPieces: 3 });
        this.combat.addLog('The next-piece preview is about to get covered in glitter.');
        break;
      case 'hide_hold_block':
        this.startHazardWarning('preview', { sourceId: enemy.id, delayPieces: 3 });
        this.combat.addLog('The hold box is about to get hidden behind parade banners.');
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
        this.startHazardWarning('speed_wave', { sourceId: enemy.id, delayPieces: Math.max(3, this.getStageCounterWindow()) });
        this.queueIncomingJunk(1, enemy.id, this.getStageCounterWindow(), 'block_crumb_junk');
        this.combat.addLog('The floor starts wobbling faster.');
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
        this.startHazardWarning('freeze', { sourceId: enemy.id, delayPieces: Math.min(2, this.getStageCounterWindow()) });
        this.combat.addLog('Frost gathers around the falling block.');
        break;
      case 'sleep_player':
        this.startHazardWarning('sleep', { sourceId: enemy.id, delayPieces: 3 });
        damage = 0;
        this.combat.addLog('A cozy lullaby is warming up with a clear counter window.');
        break;
      case 'swap_next_hold':
        this.startHazardWarning('bad_piece', { sourceId: enemy.id, delayPieces: 2 });
        this.combat.addLog('A goblin is carrying a weird piece toward the queue.');
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
      this.playVfx(
        attackResult.hpDamage > 0 ? 'anim_vfx_player_hit' : 'anim_vfx_shield_gain',
        this.heroPortrait?.x ?? 112,
        this.heroPortrait?.y ?? 94,
        COMBAT_HIT_VFX_BOX_SIZE,
        126
      );
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
      this.heroPortrait.setTexture(this.sharedGame.assetSystem.getHeroTexture(this, this.sharedGame.runState.hero.id, 'hit'));
      this.heroPortrait.setTint(color);
      this.tweens.add({
        targets: this.heroPortrait,
        x: originalX - 8,
        duration: 45,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.heroPortrait?.setX(originalX);
          this.heroPortrait?.setTexture(this.sharedGame.assetSystem.getHeroTexture(this, this.sharedGame.runState.hero.id, 'idle'));
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
    this.enemySprite.setTexture(this.sharedGame.assetSystem.getMonsterTexture(this, this.sharedGame.runState.activeEnemy?.id, 'hit'));
    if (this.sharedGame.runState.activeEnemy) {
      this.fitEnemyBattleSprite(this.sharedGame.runState.activeEnemy);
    }
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
        this.enemySprite?.setTexture(this.sharedGame.assetSystem.getMonsterTexture(this, this.sharedGame.runState.activeEnemy?.id, 'idle'));
        if (this.enemySprite && this.sharedGame.runState.activeEnemy) {
          this.fitEnemyBattleSprite(this.sharedGame.runState.activeEnemy);
        }
        this.enemySprite?.clearTint();
      }
    });
  }

  private queueIncomingJunk(amount: number, sourceId: string, delayPieces: number, blockId = 'block_crumb_junk'): void {
    const existing = this.sharedGame.runState.activeHazards.find((hazard) => hazard.kind === 'incoming_junk');
    if (existing) {
      existing.amount = Math.min(12, (existing.amount ?? 0) + amount);
      existing.remainingPieces = Math.max(existing.remainingPieces, delayPieces);
      this.combat.addLog(`Incoming junk grows to ${existing.amount}. Cascades can still trim it.`);
      return;
    }

    if (!this.canStartNewHazard('incoming_junk')) {
      this.combat.addLog('The junk tray waits so active warnings stay readable.');
      return;
    }

    this.sharedGame.runState.activeHazards.push(this.createHazard('incoming_junk', {
      sourceId,
      amount,
      blockId,
      delayPieces
    }));
    this.playVfx('anim_hazard_incoming_junk_warning', this.screenWidth - 76, this.topSectionHeight + 52, ITEM_VFX_BOX_SIZE, 127);
  }

  private spawnFloatingBlock(blockId = 'block_floaty_rune', delayPieces = 3): void {
    if (!this.canStartNewHazard('floating_block')) {
      this.combat.addLog('The warning tray is full, so the extra floaty block waits its turn.');
      return;
    }
    if (this.sharedGame.runState.reactiveState.anchorCookiePieces > 0) {
      const added = this.board.addJunkToColumn(Phaser.Math.Between(0, this.boardColumns - 1), 'block_crumb_junk');
      this.combat.addLog(added ? 'Anchor Cookie turns a floaty block into normal crumb junk.' : 'Anchor Cookie catches a floaty block safely.');
      return;
    }

    const column = Phaser.Math.Between(0, this.boardColumns - 1);
    const row = Math.max(0, Math.min(2, this.boardRows - 1));
    this.sharedGame.runState.activeHazards.push(this.createHazard('floating_block', {
      sourceId: 'battle',
      blockId,
      onExpireBlockId: 'block_cloud_junk',
      column,
      row,
      delayPieces
    }));
    this.playVfx('anim_hazard_floaty_countdown', this.boardOffsetX + column * this.boardCellSize + this.boardCellSize / 2, this.boardOffsetY + row * this.boardCellSize + this.boardCellSize / 2, BOARD_CELL_SIZE, 80);
    this.combat.addLog('A Floaty Rune wobbles overhead.');
  }

  private startHazardWarning(kind: ActiveHazardKind, options: {
    sourceId?: string;
    amount?: number;
    blockId?: string;
    delayPieces?: number;
  } = {}): void {
    if (kind === 'bad_piece' && this.sharedGame.runState.reactiveState.nopeStampPieces > 0) {
      this.sharedGame.runState.reactiveState.nopeStampPieces = 0;
      this.combat.addLog('Nope Stamp rejects the weird delivery before it reaches the queue.');
      return;
    }
    if (kind === 'sleep' && this.sharedGame.runState.reactiveState.sleepGuardPieces > 0) {
      this.combat.addLog('Alarm Cookie keeps the Sleepy tune polite and brief.');
      return;
    }
    if (
      (kind === 'freeze' || kind === 'speed_wave') &&
      this.sharedGame.runState.hero.passiveId === 'passive_stay_chill' &&
      !this.sharedGame.runState.reactiveState.nixieMitigationUsed
    ) {
      this.sharedGame.runState.reactiveState.nixieMitigationUsed = true;
      this.combat.addLog('Stay Chill softens this hazard before it becomes sharp.');
      return;
    }
    if (kind === 'low_ceiling' && this.sharedGame.runState.reactiveState.lowCeilingCanceled) {
      this.combat.addLog('Tent Pole keeps the low ceiling away.');
      return;
    }
    if (kind === 'freeze' && this.sharedGame.runState.reactiveState.freezeGuardPieces > 0) {
      this.combat.addLog('Hot Cocoa keeps the frost from sticking.');
      return;
    }
    if (kind === 'speed_wave' && this.sharedGame.runState.reactiveState.speedBrakePieces > 0) {
      this.combat.addLog('Speed Brake keeps the wobbly floor steady.');
      return;
    }
    if (kind === 'preview' && this.sharedGame.runState.reactiveState.previewRevealPieces > 0) {
      this.combat.addLog('Preview Glasses keep the next block readable.');
      return;
    }

    const existing = this.sharedGame.runState.activeHazards.find((hazard) => hazard.kind === kind);
    if (existing) {
      existing.remainingPieces = Math.max(existing.remainingPieces, options.delayPieces ?? existing.remainingPieces);
      return;
    }

    if (!this.canStartNewHazard(kind)) {
      this.combat.addLog('A hazard warning waits so the board stays readable.');
      return;
    }

    this.sharedGame.runState.activeHazards.push(this.createHazard(kind, options));
    this.playVfx(this.getHazardWarningAnimationId(kind), this.screenWidth - 76, this.topSectionHeight + 52, ITEM_VFX_BOX_SIZE, 127);
  }

  private createHazard(kind: ActiveHazardKind, options: {
    sourceId?: string;
    amount?: number;
    blockId?: string;
    onExpireBlockId?: string;
    column?: number;
    row?: number;
    delayPieces?: number;
  }): ActiveHazardState {
    const delay = options.delayPieces ?? this.getDefaultHazardWindow(kind);
    const base = HAZARD_WINDOWS[kind];
    return {
      ...base,
      instanceId: `${base.hazardId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      kind,
      remainingPieces: delay,
      counterWindowPieces: delay,
      amount: options.amount,
      sourceId: options.sourceId,
      blockId: options.blockId,
      onExpireBlockId: options.onExpireBlockId,
      column: options.column,
      row: options.row
    };
  }

  private reduceIncomingJunkFromCascade(cascade: CascadeResult): void {
    if (cascade.totalLinesCleared <= 0) {
      return;
    }

    const incoming = this.sharedGame.runState.activeHazards.find((hazard) => hazard.kind === 'incoming_junk');
    if (!incoming || !incoming.amount) {
      return;
    }

    if (this.sharedGame.runState.reactiveState.cleanupCouponPieces > 0) {
      this.sharedGame.runState.reactiveState.cleanupCouponPieces = 0;
      incoming.amount = 0;
      this.sharedGame.runState.activeHazards = this.sharedGame.runState.activeHazards.filter((hazard) => hazard !== incoming);
      this.combat.addLog('Cleanup Coupon cashes in the line clear and cancels incoming junk.');
      return;
    }

    let reduction = 1;
    if (cascade.cascadeCount >= 4) {
      reduction = incoming.amount;
    } else if (cascade.cascadeCount >= 3) {
      reduction = 6;
    } else if (cascade.cascadeCount >= 2) {
      reduction = 4;
    } else {
      reduction = 2;
    }
    const starClears = cascade.specialBlocksTriggered.filter((trigger) => trigger.startsWith('block_star')).length;
    reduction += starClears;
    if (this.sharedGame.runState.hero.passiveId === 'passive_main_character_energy' && starClears > 0) {
      reduction += starClears;
      this.combat.addLog('Main Character Energy makes star blocks shove extra junk out of line.');
    }
    if (this.sharedGame.runState.relics.includes('rel_star_sticker')) {
      reduction += 1;
      this.combat.addLog('Star Sticker helps the cascade trim one extra junk.');
    }

    incoming.amount = Math.max(0, incoming.amount - reduction);
    this.combat.addLog(`Cascade counterplay trims incoming junk by ${reduction}.`);
    if (incoming.amount <= 0) {
      this.sharedGame.runState.activeHazards = this.sharedGame.runState.activeHazards.filter((hazard) => hazard !== incoming);
      this.combat.addLog('Incoming junk is fully cleared before it lands.');
    }
  }

  private tickActiveHazards(): void {
    const hazards = [...this.sharedGame.runState.activeHazards];
    hazards.forEach((hazard) => {
      hazard.remainingPieces = Math.max(0, hazard.remainingPieces - 1);
      if (hazard.remainingPieces === 0) {
        this.resolveHazard(hazard);
      }
    });
    this.sharedGame.runState.activeHazards = this.sharedGame.runState.activeHazards.filter((hazard) => hazard.remainingPieces > 0);
  }

  private resolveHazard(hazard: ActiveHazardState): void {
    switch (hazard.kind) {
      case 'incoming_junk':
        this.dropIncomingJunk(hazard);
        break;
      case 'floating_block':
        this.dropFloatingBlock(hazard);
        break;
      case 'freeze':
        this.sharedGame.runState.fallSpeed = Math.min(MAX_FALL_SPEED, this.sharedGame.runState.fallSpeed + 0.04);
        this.combat.addLog('The chilly block moment makes the board a little quicker.');
        break;
      case 'preview': {
        const enemy = this.sharedGame.runState.activeEnemy;
        if (enemy) {
          enemy.previewHiddenTurns = Math.max(enemy.previewHiddenTurns, 2);
          enemy.holdHiddenTurns = Math.max(enemy.holdHiddenTurns, 1);
        }
        this.combat.addLog('Preview gets covered by festival glitter.');
        break;
      }
      case 'low_ceiling':
        this.board.clearTopOccupiedCells(Math.ceil(this.boardColumns / 2));
        this.combat.addLog('The low ceiling nudges the top row clear instead of trapping you.');
        break;
      case 'bad_piece':
        this.board.setNextPieceType(Phaser.Math.Between(0, 1) === 0 ? 'S' : 'Z');
        this.combat.addLog('A wiggly piece enters the next queue.');
        break;
      case 'sleep': {
        const enemy = this.sharedGame.runState.activeEnemy;
        if (enemy) {
          enemy.sleepTurns = Math.max(enemy.sleepTurns, 1);
        }
        this.combat.addLog('The Sleepy tune lands softly; one beat gets drowsy.');
        break;
      }
      case 'speed_wave':
        this.sharedGame.runState.fallSpeed = Math.min(MAX_FALL_SPEED, this.sharedGame.runState.fallSpeed + 0.08);
        this.combat.addLog('The floor wobbles faster for a bit.');
        break;
      case 'royal_pattern': {
        const added = this.board.addRoyalBlocks(Math.max(1, hazard.amount ?? 2));
        this.combat.addLog(`Bloxley places ${added} royal pattern block${added === 1 ? '' : 's'}.`);
        break;
      }
      default:
        break;
    }
  }

  private dropIncomingJunk(hazard: ActiveHazardState): void {
    const amount = Math.min(8, Math.max(0, hazard.amount ?? 0));
    let added = 0;
    for (let index = 0; index < amount; index += 1) {
      if (this.board.addJunkToColumn(Phaser.Math.Between(0, this.boardColumns - 1), hazard.blockId ?? 'block_crumb_junk')) {
        added += 1;
      }
    }
    this.combat.addLog(`${added} incoming junk block${added === 1 ? '' : 's'} land with room to react.`);
  }

  private dropFloatingBlock(hazard: ActiveHazardState): void {
    const column = Math.max(0, Math.min(this.boardColumns - 1, hazard.column ?? Phaser.Math.Between(0, this.boardColumns - 1)));
    const added = this.board.addJunkToColumn(column, hazard.onExpireBlockId ?? 'block_cloud_junk');
    this.combat.addLog(added ? 'A Floaty Rune drops as cloud junk.' : 'A Floaty Rune bumps the ceiling and fizzles safely.');
  }

  private renderHazardTray(): void {
    const state = this.sharedGame.runState;
    const hazard = state.activeHazards[0];
    if (!hazard) {
      this.hazardTrayBg?.setVisible(false);
      this.hazardTrayText?.setVisible(false);
      return;
    }

    const counters = this.getAvailableCounterNames(hazard);
    const amount = hazard.amount ? ` ${hazard.amount}` : '';
    const line1 = `${hazard.name}${amount} in ${hazard.remainingPieces} piece${hazard.remainingPieces === 1 ? '' : 's'}`;
    const line2 = `${counters.length ? `Counters: ${counters.join(', ')}` : hazard.cascadeCounterHint ?? 'Cascade or cleanup item can help.'}`;
    this.hazardTrayBg?.setVisible(true);
    this.hazardTrayText?.setText(`${line1}\n${line2}`).setVisible(true);
  }

  private getAvailableCounterNames(hazard: ActiveHazardState): string[] {
    const tags = new Set<CounterTag>(hazard.counterTags);
    const itemNames = this.sharedGame.runState.inventory
      .map((stack) => this.sharedGame.itemSystem.getItem(stack.itemId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .filter((item) => item.counterTags?.some((tag) => tags.has(tag)))
      .slice(0, 2)
      .map((item) => item.name);
    const spellNames = SPELLS
      .filter((spell) => this.spells.getCost(spell.id) <= this.sharedGame.runState.player.mana)
      .filter((spell) => {
        if (tags.has('counter_junk') || tags.has('counter_sticky') || tags.has('counter_royal')) {
          return spell.id === 'bomb-rune' || spell.id === 'void-cut' || spell.id === 'clean-cut' || spell.id === 'fireball';
        }
        if (tags.has('counter_freeze') || tags.has('counter_speed')) {
          return spell.id === 'frost-lock' || spell.id === 'snowcone-burst';
        }
        return false;
      })
      .slice(0, 1)
      .map((spell) => spell.label);
    return [...itemNames, ...spellNames];
  }

  private getStageHazardAmount(base: number): number {
    return Math.min(8, base + Math.floor(Math.max(0, this.sharedGame.runState.stage - 1) / 2));
  }

  private getStageCounterWindow(): number {
    return Math.max(2, 5 - Math.ceil(this.sharedGame.runState.stage / 2));
  }

  private getDefaultHazardWindow(kind: ActiveHazardKind): number {
    if (kind === 'freeze' || kind === 'bad_piece') {
      return 2;
    }
    if (kind === 'sleep') {
      return 3;
    }
    if (kind === 'low_ceiling') {
      return 6;
    }
    if (kind === 'speed_wave') {
      return 4;
    }
    return this.getStageCounterWindow();
  }

  private canStartNewHazard(kind: ActiveHazardKind): boolean {
    const state = this.sharedGame.runState;
    const activeKinds = new Set(state.activeHazards.map((hazard) => hazard.kind));
    if (kind === 'low_ceiling' && activeKinds.has('freeze')) {
      return false;
    }
    if (kind === 'freeze' && activeKinds.has('low_ceiling')) {
      return false;
    }
    return state.activeHazards.length < this.getMaxActiveHazards();
  }

  private getMaxActiveHazards(): number {
    const state = this.sharedGame.runState;
    if (state.stage <= 2) {
      return 1;
    }
    if (state.stage <= 4) {
      return state.currentRoomType === 'elite' || state.currentRoomType === 'boss' ? 2 : 1;
    }
    return state.currentRoomType === 'fight' ? 1 : 2;
  }

  private renderCombatUi(): void {
    this.renderBoard();
    this.renderEnemy();
    this.renderPreview();
    this.renderUpgrades();
    this.renderMiddleOverlays();
    this.renderHazardTray();
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
    this.sharedGame.battleObjectiveSystem.recordSpellCast(state);
    this.sharedGame.audioSystem.play('spell_cast', this);
    this.heroPortrait?.setTexture(this.sharedGame.assetSystem.getHeroTexture(this, state.hero.id, 'cast'));
    this.fitHeroBattleSprite();
    this.playVfx(this.getSpellVfxKey(spellId), this.heroPortrait?.x ?? 96, this.heroPortrait?.y ?? 92, SPELL_VFX_BOX_SIZE, 126);
    const damageDealt = Math.max(0, enemyHpBefore - (state.activeEnemy?.currentHp ?? enemyHpBefore));
    const hpSpent = Math.max(0, playerHpBefore - state.player.hp);

    if (state.activeEnemy) {
      this.sharedGame.audioSystem.play('enemy_hit', this);
      if (damageDealt > 0) {
        this.playVfx('anim_vfx_enemy_hit', this.enemySprite?.x ?? this.screenWidth - 78, this.enemySprite?.y ?? 126, COMBAT_HIT_VFX_BOX_SIZE, 126);
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
      this.syncBoardState();
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
    const phaseMechanicMessage = this.sharedGame.bossSystem.applyPhaseTwoBoardMechanic(this.sharedGame.runState, this.board);
    if (phaseMechanicMessage) {
      this.combat.addLog(phaseMechanicMessage);
    }
    this.showFloatingText('Phase 2', this.screenWidth / 2, 184, '#ffca6b', 34);
    this.enemySprite?.setTexture(this.sharedGame.assetSystem.getMonsterTexture(this, enemy.id, 'phase_2'));
    this.fitEnemyBattleSprite(enemy);
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
    this.enemySprite?.setTexture(this.sharedGame.assetSystem.getMonsterTexture(this, enemyId, 'defeat'));
    if (state.activeEnemy) {
      this.fitEnemyBattleSprite(state.activeEnemy);
    }
    this.playVfx('anim_vfx_enemy_defeat_poof', this.enemySprite?.x ?? this.screenWidth - 78, this.enemySprite?.y ?? 92, COMBAT_HIT_VFX_BOX_SIZE, 126);
    this.heroPortrait?.setTexture(this.sharedGame.assetSystem.getHeroTexture(this, state.hero.id, 'victory'));
    this.fitHeroBattleSprite();
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
    const objectiveSucceeded = objectiveMessage?.startsWith('Mini-objective complete');
    const goalMessage = objectiveSucceeded
      ? this.sharedGame.stageGoalSystem.addProgress(state, 'battle_objective', 1, enemyId)
      : null;
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
        const routeEnding = this.sharedGame.routeStorySystem.resolveHeroEnding(state.hero.id, state.routeProgress);
        const endingKind = routeEnding.endingKind;
        const heroRouteProgress = state.routeProgress.heroes[state.hero.id];
        if (heroRouteProgress) {
          this.sharedGame.routeStorySystem.recordEndingUnlock(heroRouteProgress, routeEnding.ending, routeEnding.variant);
        }
        const beforeUnlocks = [...this.sharedGame.metaSystem.state.unlockedHeroes];
        this.sharedGame.metaSystem.recordRunEnd(state, true);
        if (endingKind === 'true') {
          this.sharedGame.metaSystem.unlockTrueEnding();
        }
        this.sharedGame.metaSystem.unlockRouteEnding(routeEnding.ending.id);
        if (routeEnding.variant) {
          this.sharedGame.metaSystem.unlockRouteVariantEnding(routeEnding.variant.id);
        }
        const heroUnlocks = this.sharedGame.storySystem.getHeroUnlockMessages(beforeUnlocks, this.sharedGame.metaSystem.state.unlockedHeroes);
        this.sharedGame.audioSystem.play('victory', this);
        this.sharedGame.clearSave();
        this.scene.start('VictoryScene', {
          endingKind,
          heroUnlocks,
          routeEndingId: routeEnding.ending.id,
          routeVariantEndingId: routeEnding.variant?.id
        });
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
    const stageId = this.sharedGame.stageSystem.getStageByIndex(state.stage)?.id ?? 'stage_sprinkle_sewers';
    const routeScene = this.sharedGame.routeStorySystem.shouldTriggerRouteScene(
      state,
      state.hero.id,
      stageId,
      'after_first_combat_victory'
    );
    if (routeScene) {
      this.scene.start('RouteDialogueScene', {
        sceneId: routeScene.id,
        returnScene: 'RewardScene'
      });
      return;
    }
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
    this.renderHazardTray();
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
            this.displayBoard[targetRow][targetCol] = this.board.createBlockCell(getTetrominoBlockId(current.type));
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
    this.sharedGame.runState.activeHazards
      .filter((hazard) => hazard.kind === 'floating_block')
      .forEach((hazard) => {
        const row = Math.max(0, Math.min(this.boardRows - 1, hazard.row ?? 0));
        const col = Math.max(0, Math.min(this.boardColumns - 1, hazard.column ?? 0));
        if (this.displayBoard[row][col] === 0) {
          this.displayBoard[row][col] = this.board.createBlockCell(hazard.blockId ?? 'block_floaty_rune');
          this.displayAlpha[row][col] = 0.72;
        }
      });
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
        sprite.anims.stop();
        sprite.setVisible(false);
      }
      if (this.renderedTextureKeys[row]) {
        this.renderedTextureKeys[row][col] = '';
      }
      if (this.renderedAnimationKeys[row]) {
        this.renderedAnimationKeys[row][col] = '';
      }
      return;
    }

    const state = this.boardVisualState !== 'base' || this.displayAlpha[row][col] < 1 || this.sharedGame.runState.player.feverActiveLocks > 0
      ? this.boardVisualState === 'clear' ? 'clear' : 'glow'
      : 'base';
    if (state === 'glow' && this.playBoardBlockGlowAnimation(sprite, cell.blockId, row, col)) {
      setBoardBlockDisplaySize(sprite);
      if (!sprite.visible) {
        sprite.setVisible(true);
      }
      return;
    }

    this.stopBoardBlockGlowAnimation(sprite, row, col);
    const textureKey = this.sharedGame.assetSystem.getBoardBlockTexture(this, cell.blockId, state);
    if (this.renderedTextureKeys[row][col] !== textureKey) {
      sprite.setTexture(textureKey);
      setBoardBlockDisplaySize(sprite);
      this.renderedTextureKeys[row][col] = textureKey;
    }
    if (!sprite.visible) {
      sprite.setVisible(true);
    }
  }

  private playBoardBlockGlowAnimation(
    sprite: Phaser.GameObjects.Sprite,
    blockId: string,
    row: number,
    col: number
  ): boolean {
    const frames = this.sharedGame.assetSystem.getLoadedBoardBlockGlowFrames(this, blockId);
    if (frames.length !== BLOCK_ANIM.GLOW_FRAME_COUNT) {
      return false;
    }

    const animationKey = this.sharedGame.assetSystem.getBoardBlockAnimationId(blockId, 'glow') ?? this.getBoardBlockAnimationKey(blockId, 'glow');
    this.createBoardBlockAnimationIfMissing(animationKey, frames, BLOCK_ANIM.GLOW_FRAME_MS, -1);
    if (this.renderedAnimationKeys[row][col] !== animationKey || !sprite.anims.isPlaying) {
      setBoardBlockDisplaySize(sprite);
      sprite.play(animationKey);
      this.renderedAnimationKeys[row][col] = animationKey;
      this.renderedTextureKeys[row][col] = '';
    }
    return true;
  }

  private playVfx(animationId: string | null | undefined, x: number, y: number, size = SPELL_VFX_BOX_SIZE, depth = 120): void {
    const definition = getAnimationDefinition(animationId);
    if (!definition) {
      return;
    }

    const frames = this.sharedGame.assetSystem.getLoadedAnimationFrameKeys(this, definition.id);
    const textureKey = frames[0] ?? this.sharedGame.assetSystem.getTextureKey(this, definition.fallbackKey, 'sprite');
    const sprite = this.add.sprite(x, y, textureKey)
      .setDisplaySize(size, size)
      .setDepth(depth)
      .setAlpha(frames.length > 0 ? 1 : 0.42);
    if (size === BOARD_CELL_SIZE) {
      setBoardVfxDisplaySize(sprite);
    }

    if (frames.length === definition.frameCount && this.sharedGame.assetSystem.playAnimationSafe(sprite, definition.id)) {
      sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => sprite.destroy());
      this.time.delayedCall(Math.ceil((definition.frameCount / definition.frameRate) * 1000) + 80, () => {
        if (sprite.active) {
          sprite.destroy();
        }
      });
      return;
    }

    this.tweens.add({
      targets: sprite,
      alpha: 0,
      scaleX: sprite.scaleX * 1.1,
      scaleY: sprite.scaleY * 1.1,
      duration: 220,
      ease: 'Sine.easeOut',
      onComplete: () => sprite.destroy()
    });
  }

  private getSpellVfxKey(spellId: SpellId): string {
    const contentId = `spl_${spellId.replace(/-/g, '_')}`;
    const spellContent = contentRegistry.getSpell(contentId) as { vfxKey?: string } | null;
    if (spellContent?.vfxKey) {
      return spellContent.vfxKey;
    }
    if (contentId === 'spl_void_cut') {
      return 'anim_spell_clean_cut';
    }
    return `anim_spell_${contentId.replace(/^spl_/, '')}`;
  }

  private getHazardWarningAnimationId(kind: ActiveHazardKind): string {
    const keys: Record<ActiveHazardKind, string> = {
      incoming_junk: 'anim_hazard_incoming_junk_warning',
      floating_block: 'anim_hazard_floaty_countdown',
      freeze: 'anim_hazard_freeze_warning',
      preview: 'anim_hazard_preview_hidden_warning',
      low_ceiling: 'anim_hazard_low_ceiling_warning',
      bad_piece: 'anim_hazard_bad_piece_delivery_warning',
      sleep: 'anim_hazard_preview_hidden_warning',
      speed_wave: 'anim_hazard_speed_wave_warning',
      royal_pattern: 'anim_hazard_royal_pattern_warning'
    };
    return keys[kind];
  }

  private stopBoardBlockGlowAnimation(sprite: Phaser.GameObjects.Sprite, row: number, col: number): void {
    if (this.renderedAnimationKeys[row]?.[col]) {
      sprite.anims.stop();
      this.renderedAnimationKeys[row][col] = '';
      this.renderedTextureKeys[row][col] = '';
    }
  }

  private playBoardBlockClearAnimation(x: number, y: number, blockId: string): Promise<void> {
    const clearFrames = this.sharedGame.assetSystem.getLoadedBoardBlockClearFrames(this, blockId);
    const clearKey = this.sharedGame.assetSystem.getBoardBlockClearKey(blockId);
    const clearStillTexture = this.sharedGame.assetSystem.getFirstTextureKey(this, [clearKey, `${clearKey}__legacy`], 'block');
    const hasClearStill = clearStillTexture !== this.sharedGame.assetSystem.fallbackFor('block');

    if (clearFrames.length !== BLOCK_ANIM.CLEAR_FRAME_COUNT && !hasClearStill) {
      return Promise.resolve();
    }

    const texture = clearFrames[0] ?? clearStillTexture;
    const overlay = this.add.sprite(x, y, texture)
      .setDepth(24);
    setBoardBlockDisplaySize(overlay);

    if (clearFrames.length === BLOCK_ANIM.CLEAR_FRAME_COUNT) {
      const animationKey = this.sharedGame.assetSystem.getBoardBlockAnimationId(blockId, 'clear') ?? this.getBoardBlockAnimationKey(blockId, 'clear');
      this.createBoardBlockAnimationIfMissing(animationKey, clearFrames, BLOCK_ANIM.CLEAR_FRAME_MS, 0);
      return new Promise((resolve) => {
        overlay.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          overlay.destroy();
          resolve();
        });
        overlay.play(animationKey);
      });
    }

    return new Promise((resolve) => {
      this.time.delayedCall(BLOCK_ANIM.CLEAR_TOTAL_MS, () => {
        overlay.destroy();
        resolve();
      });
    });
  }

  private createBoardBlockAnimationIfMissing(
    key: string,
    frames: string[],
    frameMs: number,
    repeat: number
  ): void {
    if (this.anims.exists(key)) {
      return;
    }

    this.anims.create({
      key,
      frames: frames.map((frameKey) => ({ key: frameKey })),
      frameRate: 1000 / frameMs,
      repeat
    });
  }

  private getBoardBlockAnimationKey(blockId: string, state: 'glow' | 'clear'): string {
    return `anim_board_${blockId.replace(/[^a-z0-9_]/gi, '_')}_${state}`;
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

    const state = enemy.roomType === 'boss' && enemy.phase >= 2 ? 'phase_2' : 'idle';
    this.enemySprite
      ?.setTexture(this.sharedGame.assetSystem.getMonsterTexture(this, enemy.id, state))
      .setVisible(true);
    this.fitEnemyBattleSprite(enemy);

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

  private fitHeroBattleSprite(): void {
    if (this.heroPortrait) {
      fitSpriteToBox(this.heroPortrait, HERO_BATTLE_BOX_SIZE, HERO_BATTLE_BOX_SIZE);
    }
  }

  private fitEnemyBattleSprite(enemy: EnemyInstance): void {
    if (this.enemySprite) {
      const boxSize = enemy.roomType === 'boss' ? BOSS_BATTLE_BOX_SIZE : MONSTER_BATTLE_BOX_SIZE;
      fitSpriteToBox(this.enemySprite, boxSize, boxSize);
    }
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
    const previewProtected = this.sharedGame.runState.reactiveState.previewRevealPieces > 0;
    const hidden = !previewProtected && (enemy.previewHiddenTurns > 0 || this.sharedGame.oopsieSystem.shouldHidePreview(this.sharedGame.runState));
    const nextType = this.board.nextPieceType;
    const matrix = TETROMINO_SHAPES[nextType];
    this.previewLabel?.setText(hidden ? 'Preview Hexed' : 'Next');

    this.previewTiles.forEach((tile, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const value = hidden ? 0 : matrix[row]?.[col] ?? 0;
      tile.setFillStyle(COLORS.boardEmpty, 1);
      const sprite = this.previewSprites[index];
      if (sprite) {
        if (value) {
          sprite
            .setTexture(this.sharedGame.assetSystem.getBoardBlockTexture(this, getTetrominoBlockId(nextType), 'base'))
            .setVisible(true);
          setBoardPreviewBlockDisplaySize(sprite);
        } else {
          sprite.setVisible(false);
        }
      }
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

  private renderTetrominoPreview(
    tiles: Phaser.GameObjects.Rectangle[],
    sprites: Phaser.GameObjects.Sprite[],
    symbols: Phaser.GameObjects.Text[],
    type: TetrominoType | null,
    hidden: boolean
  ): void {
    const matrix = type ? TETROMINO_SHAPES[type] : [];
    const settings = this.sharedGame.getSettings();
    tiles.forEach((tile, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const value = !hidden && type ? matrix[row]?.[col] ?? 0 : 0;
      tile
        .setFillStyle(COLORS.boardEmpty, 1)
        .setVisible(Boolean(type && !hidden));
      const sprite = sprites[index];
      if (sprite) {
        if (value && type) {
          sprite
            .setTexture(this.sharedGame.assetSystem.getBoardBlockTexture(this, getTetrominoBlockId(type), 'base'))
            .setVisible(true);
          setBoardPreviewBlockDisplaySize(sprite);
        } else {
          sprite.setVisible(false);
        }
      }
      symbols[index]?.setText(value && settings.colorblindSymbols && type ? type : '');
      symbols[index]?.setVisible(Boolean(value && settings.colorblindSymbols && type && !hidden));
    });
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
    const holdHidden = Boolean(enemy?.holdHiddenTurns);
    this.holdText?.setText(
      holdHidden
        ? 'Hold\nHidden'
        : this.board.holdPieceType
          ? ''
          : 'Hold\nEmpty'
    );
    this.holdText?.setVisible(holdHidden || !this.board.holdPieceType);
    this.renderTetrominoPreview(
      this.holdPreviewTiles,
      this.holdPreviewSprites,
      this.holdPreviewSymbols,
      this.board.holdPieceType,
      holdHidden
    );
    
    const inventorySummary = state.inventory.slice(0, 1).map(stack => `${this.sharedGame.itemSystem.getItem(stack.itemId)?.name} x${stack.count}`).join(', ');
    const bagText = state.inventory.length ? inventorySummary : 'Bag Empty';
    const chaos = this.sharedGame.chaosRuleSystem.getActive(state);
    const objective = this.sharedGame.battleObjectiveSystem.getActive(state);
    const objectiveSummary = this.sharedGame.battleObjectiveSystem.getSummary(state);
    const battleStatusText = [
      `Relics ${state.ownedRewards.length}  Oops ${state.player.oopsies.length}`,
      chaos ? `Chaos: ${chaos.name}` : '',
      objective ? objectiveSummary.replace(/^Objective: /, 'Obj: ') : ''
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
          const hazardCountBefore = state.activeHazards.length;
          const shieldBefore = state.player.shield;
          const msg = this.sharedGame.itemSystem.applyItem(state, stack.itemId, this.board, this.combat);
          this.combat.addLog(msg);
          const itemAnimation = itemDef.useVfxKey ?? itemDef.vfxKey ?? `anim_${stack.itemId}_use`;
          this.playVfx(itemAnimation, x + 22, y + 30, ITEM_VFX_BOX_SIZE, 141);
          if (state.activeHazards.length < hazardCountBefore) {
            this.playVfx(itemDef.counterSuccessVfxKey ?? `anim_${stack.itemId}_counter_success`, x + 22, y + 30, ITEM_VFX_BOX_SIZE, 142);
          }
          if (state.player.shield > shieldBefore) {
            this.playVfx('anim_vfx_shield_gain', this.heroPortrait?.x ?? 112, this.heroPortrait?.y ?? 94, COMBAT_HIT_VFX_BOX_SIZE, 126);
          }
          this.sharedGame.inventorySystem.removeItem(state, stack.itemId, 1);
          state.runStats.itemsUsed += 1;
          this.sharedGame.audioSystem.play('item_use', this);
          this.sharedGame.saveRun();
          
          if (state.inventory.length === 0) {
            this.inventoryExpanded = false;
          }
          this.renderAll();
        }, { iconKey: this.sharedGame.assetSystem.getIcon(this, 'item', stack.itemId, itemDef.iconKey) });
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
