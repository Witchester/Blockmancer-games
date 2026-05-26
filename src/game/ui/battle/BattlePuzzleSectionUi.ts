import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { TetrominoType } from '../../types/GameTypes';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS, FONT_FAMILY, TETROMINO_SHAPES } from '../../utils/constants';
import { getTetrominoBlockId } from '../../systems/BoardSystem';
import { UiPanel } from '../components';
import type { BattleScreenShell } from './BattleScreenShell';

const PIXEL_PERFECT = {
  integerCoordinates: true,
  allowFractionalScale: false,
  filtering: 'nearest' as const,
  antiAliasing: false,
  roundPixels: true
};

// Section 2 starts at y = 480. Coordinates are local to Section 2 container.
export const PUZZLE_SECTION_LOCAL_BOUNDS = {
  hold: { x: 48, y: 152, w: 200, h: 200 }, // absolute 632 - 480 = 152
  next: { x: 48, y: 392, w: 200, h: 288 }, // absolute 872 - 480 = 392
  board: { x: 326, y: 112, w: 428, h: 888 }, // absolute 592 - 480 = 112
  boardGrid: { x: 335, y: 140, w: 410, h: 820 }, // absolute 620 - 480 = 140
  rightRail: { x: 832, y: 152, w: 200, h: 520 } // absolute 632 - 480 = 152
};

function spec(
  id: string,
  type: UiComponentSpec['type'],
  rect: { x: number; y: number; w: number; h: number },
  assetKey: string,
  fallbackAssetKey: string,
  zIndex: number,
  options: Partial<Pick<UiComponentSpec, 'canonicalFolder' | 'anchor' | 'fitMode' | 'scaleMode' | 'safePadding' | 'dynamicTextAllowed' | 'expectedSourceSize'>> = {}
): UiComponentSpec {
  return {
    id,
    type,
    assetKey,
    fallbackAssetKey,
    canonicalFolder: options.canonicalFolder ?? 'public/assets/ui/panels/',
    expectedSourceSize: options.expectedSourceSize ?? { w: rect.w, h: rect.h },
    runtimeRenderSize: { w: rect.w, h: rect.h },
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    anchor: options.anchor ?? 'topLeft',
    fitMode: options.fitMode ?? 'nineSlice',
    scaleMode: options.scaleMode ?? 'uiStretchNineSlice',
    safePadding: options.safePadding ?? 10,
    zIndex,
    dynamicTextAllowed: options.dynamicTextAllowed ?? true,
    pixelPerfect: PIXEL_PERFECT,
    notes: `UI-6 ${id}.`
  };
}

function isTetrominoType(value: string | null | undefined): value is TetrominoType {
  return Boolean(value && Object.prototype.hasOwnProperty.call(TETROMINO_SHAPES, value));
}

export type PuzzleSectionStats = {
  gold: number;
  relics: number;
  oopsies: number;
  lines: number;
  combo: number;
  feverProgress: number;
  feverMax: number;
  objective?: string;
  chaos?: string;
};

export type PuzzleSectionHoldState = {
  pieceType: string | null;
  hidden: boolean;
};

export type PuzzleSectionNextQueueState = {
  queue: (string | null)[];
  hidden: boolean;
};

export type PuzzleSectionInventoryState = {
  count: number;
  active: boolean;
};

export class BattlePuzzleSectionUi {
  readonly scene: Phaser.Scene;
  readonly shell: BattleScreenShell;
  
  // Primitives
  holdPanel!: UiPanel;
  nextQueuePanel!: UiPanel;
  boardPanel!: UiPanel;
  boardGridPanel!: UiPanel;
  rightStatCards!: UiPanel;

  // Hold components
  holdTitle!: Phaser.GameObjects.Text;
  holdEmptyLabel!: Phaser.GameObjects.Text;
  holdPreviewTiles: Phaser.GameObjects.Rectangle[] = [];
  holdPreviewSprites: Phaser.GameObjects.Sprite[] = [];
  holdPreviewSymbols: Phaser.GameObjects.Text[] = [];

  // Next Queue components
  nextTitle!: Phaser.GameObjects.Text;
  nextPreviewSlotLabels: Phaser.GameObjects.Text[] = [];
  nextPreviewTiles: Phaser.GameObjects.Rectangle[] = [];
  nextPreviewSprites: Phaser.GameObjects.Sprite[] = [];
  nextPreviewSymbols: Phaser.GameObjects.Text[] = [];

  // Right Rail components
  rightStatTitle!: Phaser.GameObjects.Text;
  linesText!: Phaser.GameObjects.Text;
  scoreText!: Phaser.GameObjects.Text;
  comboText!: Phaser.GameObjects.Text;
  feverLabelText!: Phaser.GameObjects.Text;
  feverBarBg!: Phaser.GameObjects.Rectangle;
  feverBarFill!: Phaser.GameObjects.Rectangle;
  objectiveText!: Phaser.GameObjects.Text;

  // Callbacks
  onInventoryClicked?: () => void;

  private created = false;

  constructor(scene: Phaser.Scene, shell: BattleScreenShell) {
    this.scene = scene;
    this.shell = shell;
  }

  create(): this {
    if (this.created) return this;

    const game = this.scene.game as BlockmancerGame;

    // 1. Hold Panel (on Left Rail Layer)
    this.holdPanel = new UiPanel(this.scene, spec('puzzle_hold_panel', 'panel', PUZZLE_SECTION_LOCAL_BOUNDS.hold, 'ui_hold_panel', 'ui_panel_default', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.98
    });
    this.shell.leftRailLayer.add(this.holdPanel.root);

    this.holdTitle = this.scene.add.text(100, 22, 'HOLD', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    this.holdPanel.root.add(this.holdTitle);

    this.holdEmptyLabel = this.scene.add.text(100, 112, 'Empty', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      align: 'center',
      wordWrap: { width: 180 }
    }).setOrigin(0.5);
    this.holdPanel.root.add(this.holdEmptyLabel);

    // Create 4x4 Grid for Hold Preview
    for (let index = 0; index < 16; index += 1) {
      const col = index % 4;
      const row = Math.floor(index / 4);
      // Center the 4x4 grid (cellSize = 24) in the compact hold panel.
      const x = 100 - 48 + col * 24 + 12;
      const y = 112 - 48 + row * 24 + 12;

      const tile = this.scene.add.rectangle(x, y, 24, 24, COLORS.boardEmpty, 1)
        .setStrokeStyle(1, COLORS.boardGrid, game.getSettings().showGrid ? 0.9 : 0);
      this.holdPreviewTiles.push(tile);
      this.holdPanel.root.add(tile);

      const sprite = this.scene.add.sprite(x, y, game.assetSystem.getTextureKey(this.scene, null, 'block'))
        .setDisplaySize(24, 24)
        .setVisible(false);
      this.holdPreviewSprites.push(sprite);
      this.holdPanel.root.add(sprite);

      const symbol = this.scene.add.text(x, y + 1, '', {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        fontStyle: 'bold',
        stroke: '#05060a',
        strokeThickness: 2
      }).setOrigin(0.5).setVisible(false);
      this.holdPreviewSymbols.push(symbol);
      this.holdPanel.root.add(symbol);
    }

    // 2. Next Queue Panel (on Left Rail Layer)
    this.nextQueuePanel = new UiPanel(this.scene, spec('puzzle_next_queue_panel', 'panel', PUZZLE_SECTION_LOCAL_BOUNDS.next, 'ui_next_queue_panel', 'ui_panel_default', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.98
    });
    this.shell.leftRailLayer.add(this.nextQueuePanel.root);

    this.nextTitle = this.scene.add.text(100, 22, 'NEXT', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    this.nextQueuePanel.root.add(this.nextTitle);

    // Create 4 slots vertically inside Next Queue panel
    const slotStartY = 46;
    const slotHeight = 50;
    const slotGap = 5;

    for (let slot = 0; slot < 4; slot += 1) {
      const slotY = slotStartY + slot * (slotHeight + slotGap);
      
      // Card frame for each slot
      const card = this.scene.add.rectangle(100, slotY + slotHeight / 2, 176, slotHeight, COLORS.panelAlt, 0.98)
        .setStrokeStyle(1, COLORS.accentSoft, 0.45);
      this.nextQueuePanel.root.add(card);

      const slotLabel = this.scene.add.text(176, slotY + slotHeight / 2, '#' + (slot + 1), {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        fontStyle: 'bold'
      }).setOrigin(1, 0.5);
      this.nextPreviewSlotLabels.push(slotLabel);
      this.nextQueuePanel.root.add(slotLabel);

      // Create mini 4x4 preview for this slot (cellSize = 12)
      const miniGridStartX = 24;
      const miniGridStartY = slotY + 7;
      for (let index = 0; index < 16; index += 1) {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const x = miniGridStartX + col * 10 + 5;
        const y = miniGridStartY + row * 10 + 5;

        const tile = this.scene.add.rectangle(x, y, 10, 10, COLORS.boardEmpty, 1)
          .setStrokeStyle(1, COLORS.boardGrid, game.getSettings().showGrid ? 0.7 : 0);
        this.nextPreviewTiles.push(tile);
        this.nextQueuePanel.root.add(tile);

        const sprite = this.scene.add.sprite(x, y, game.assetSystem.getTextureKey(this.scene, null, 'block'))
          .setDisplaySize(10, 10)
          .setVisible(false);
        this.nextPreviewSprites.push(sprite);
        this.nextQueuePanel.root.add(sprite);

        const symbol = this.scene.add.text(x, y + 1, '', {
          color: '#f6f7ff',
          fontFamily: FONT_FAMILY,
          fontSize: '8px',
          fontStyle: 'bold',
          stroke: '#05060a',
          strokeThickness: 1
        }).setOrigin(0.5).setVisible(false);
        this.nextPreviewSymbols.push(symbol);
        this.nextQueuePanel.root.add(symbol);
      }
    }

    // 3. Board Panel (on Board Layer)
    this.boardPanel = new UiPanel(this.scene, spec('puzzle_board_panel', 'panel', PUZZLE_SECTION_LOCAL_BOUNDS.board, 'ui_panel_board', 'ui_panel_default', 20), {
      fillColor: COLORS.panel,
      fillAlpha: 0.72
    });
    this.shell.boardLayer.add(this.boardPanel.root);

    this.boardGridPanel = new UiPanel(
      this.scene,
      spec('puzzle_board_grid_slot', 'panel', PUZZLE_SECTION_LOCAL_BOUNDS.boardGrid, 'ui_board_grid_10x20', 'ui_board_grid_default', 40, {
        canonicalFolder: 'public/assets/ui/board/',
        fitMode: 'exact',
        scaleMode: 'none',
        safePadding: 0,
        dynamicTextAllowed: false
      }),
      {
        fillColor: COLORS.boardEmpty,
        fillAlpha: 0.34,
        strokeColor: COLORS.accent,
        strokeAlpha: 0.52
      }
    );
    this.shell.boardLayer.add(this.boardGridPanel.root);

    // 4. Right Stat Rail Panel (on Right Rail Layer)
    this.rightStatCards = new UiPanel(this.scene, spec('puzzle_right_stat_cards', 'panel', PUZZLE_SECTION_LOCAL_BOUNDS.rightRail, 'ui_stat_card', 'ui_panel_default', 55), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.96
    });
    this.shell.rightRailLayer.add(this.rightStatCards.root);

    const rightRailWidth = PUZZLE_SECTION_LOCAL_BOUNDS.rightRail.w;
    const rightRailCenterX = rightRailWidth / 2;
    const cardWidth = rightRailWidth - 24;
    const cardStartX = 12;

    this.rightStatTitle = this.scene.add.text(rightRailCenterX, 24, 'STATS', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    this.rightStatCards.root.add(this.rightStatTitle);

    // Create sub-cards / chips for stats inside right rail
    // Stat Row 1: Cleared Lines & Combo
    const row1 = this.scene.add.rectangle(cardStartX + cardWidth / 2, 70, cardWidth, 54, COLORS.panelAlt, 0.98)
      .setStrokeStyle(1, COLORS.accentSoft, 0.45);
    this.rightStatCards.root.add(row1);

    this.linesText = this.scene.add.text(cardStartX + 12, 54, 'Lines: 0', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      fontStyle: 'bold'
    });
    this.comboText = this.scene.add.text(cardStartX + 12, 74, 'Combo: 0', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      fontStyle: 'bold'
    });
    this.rightStatCards.root.add([this.linesText, this.comboText]);

    // Stat Row 2: Score & Gold
    const row2 = this.scene.add.rectangle(cardStartX + cardWidth / 2, 138, cardWidth, 54, COLORS.panelAlt, 0.98)
      .setStrokeStyle(1, COLORS.accentSoft, 0.45);
    this.rightStatCards.root.add(row2);

    this.scoreText = this.scene.add.text(cardStartX + 12, 122, 'Gold: 0\nRelics: 0', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      lineSpacing: 4
    });
    this.rightStatCards.root.add(this.scoreText);

    // Stat Row 3: Fever Meter
    const row3 = this.scene.add.rectangle(cardStartX + cardWidth / 2, 214, cardWidth, 68, COLORS.panelAlt, 0.98)
      .setStrokeStyle(1, COLORS.accentSoft, 0.45);
    this.rightStatCards.root.add(row3);

    this.feverLabelText = this.scene.add.text(rightRailCenterX, 190, 'FEVER', {
      color: '#65d6a5',
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.feverBarBg = this.scene.add.rectangle(rightRailCenterX, 230, cardWidth - 24, 12, COLORS.boardEmpty, 1)
      .setStrokeStyle(1, COLORS.accent, 0.55);
    this.feverBarFill = this.scene.add.rectangle(rightRailCenterX - (cardWidth - 24) / 2, 230, 0, 8, COLORS.success, 1)
      .setOrigin(0, 0.5);

    this.rightStatCards.root.add([this.feverLabelText, this.feverBarBg, this.feverBarFill]);

    // Stat Row 4: Objective / Chaos modifiers
    const row4 = this.scene.add.rectangle(cardStartX + cardWidth / 2, 370, cardWidth, 230, COLORS.panelAlt, 0.98)
      .setStrokeStyle(1, COLORS.accentSoft, 0.45);
    this.rightStatCards.root.add(row4);

    this.objectiveText = this.scene.add.text(cardStartX + 12, 266, 'No objective', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      wordWrap: { width: cardWidth - 24 },
      lineSpacing: 4
    });
    this.rightStatCards.root.add(this.objectiveText);

    this.created = true;
    return this;
  }

  destroy(): void {
    if (!this.created) return;

    this.holdPanel.destroy();
    this.nextQueuePanel.destroy();
    this.boardPanel.destroy();
    this.boardGridPanel.destroy();
    this.rightStatCards.destroy();

    this.holdPreviewTiles.forEach((t) => t.destroy());
    this.holdPreviewSprites.forEach((s) => s.destroy());
    this.holdPreviewSymbols.forEach((t) => t.destroy());

    this.nextPreviewTiles.forEach((t) => t.destroy());
    this.nextPreviewSprites.forEach((s) => s.destroy());
    this.nextPreviewSymbols.forEach((t) => t.destroy());

    this.holdTitle.destroy();
    this.holdEmptyLabel.destroy();
    this.nextTitle.destroy();
    this.nextPreviewSlotLabels.forEach((l) => l.destroy());

    this.rightStatTitle.destroy();
    this.linesText.destroy();
    this.scoreText.destroy();
    this.comboText.destroy();
    this.feverLabelText.destroy();
    this.feverBarBg.destroy();
    this.feverBarFill.destroy();
    this.objectiveText.destroy();

    this.created = false;
  }

  updateHoldPiece(holdState: PuzzleSectionHoldState): void {
    const holdHidden = holdState.hidden;
    const type = holdState.pieceType;

    this.holdEmptyLabel.setText(
      holdHidden
        ? 'Hold\nHidden'
        : type
          ? ''
          : 'Hold\nEmpty'
    );
    this.holdEmptyLabel.setVisible(holdHidden || !type);

    this.renderTetrominoPreview(
      this.holdPreviewTiles,
      this.holdPreviewSprites,
      this.holdPreviewSymbols,
      type,
      holdHidden
    );
  }

  updateNextQueue(queueState: PuzzleSectionNextQueueState): void {
    const game = this.scene.game as BlockmancerGame;
    const settings = game.getSettings();
    const hidden = queueState.hidden;
    const queue = queueState.queue;

    this.nextTitle.setText(hidden ? 'HEXED' : 'NEXT');

    for (let slot = 0; slot < 4; slot += 1) {
      const rawType = queue[slot] ?? null;
      const type = isTetrominoType(rawType) ? rawType : null;
      const matrix = type ? TETROMINO_SHAPES[type] : [];
      this.nextPreviewSlotLabels[slot]?.setText('#' + (slot + 1));
      
      for (let index = 0; index < 16; index += 1) {
        const globalIndex = slot * 16 + index;
        const col = index % 4;
        const row = Math.floor(index / 4);
        const value = hidden || !type ? 0 : matrix[row]?.[col] ?? 0;
        
        const tile = this.nextPreviewTiles[globalIndex];
        tile?.setFillStyle(COLORS.boardEmpty, 1);

        const sprite = this.nextPreviewSprites[globalIndex];
        if (sprite) {
          if (value && type) {
            sprite
              .setTexture(game.assetSystem.getBoardBlockTexture(this.scene, getTetrominoBlockId(type), 'base'))
              .setVisible(true);
          } else {
            sprite.setVisible(false);
          }
        }

        const symbol = this.nextPreviewSymbols[globalIndex];
        symbol?.setText(value && settings.colorblindSymbols && type ? type : '');
        symbol?.setVisible(Boolean(value && settings.colorblindSymbols && type));
      }
    }
  }

  updateRightRail(statsState: PuzzleSectionStats): void {
    this.linesText.setText(`Lines: ${statsState.lines}`);
    this.comboText.setText(`Combo: ${statsState.combo}`);

    this.scoreText.setText(
      `Gold: ${statsState.gold}\n` +
      `Relics: ${statsState.relics}\n` +
      `Oopsies: ${statsState.oopsies}`
    );

    // Fever Meter update
    const pct = statsState.feverMax > 0 ? statsState.feverProgress / statsState.feverMax : 0;
    const barWidth = PUZZLE_SECTION_LOCAL_BOUNDS.rightRail.w - 48;
    this.feverBarFill.width = Math.max(0, Math.min(barWidth - 2, (barWidth - 2) * pct));
    this.feverLabelText.setText(pct >= 1 ? 'FEVER FULL!' : `FEVER ${statsState.feverProgress}/${statsState.feverMax}`);

    // Modifiers / Objectives
    const objMsg = statsState.objective ? statsState.objective : '';
    const chaosMsg = statsState.chaos ? `Chaos: ${statsState.chaos}` : '';
    const details = [objMsg, chaosMsg].filter(Boolean).join('\n\n');
    this.objectiveText.setText(details || 'No objective or modifiers active.');
  }

  updateInventoryIndicator(_inventoryState: PuzzleSectionInventoryState): void {
    // Bag lives in the controls section shortcut row.
  }

  setVisible(visible: boolean): void {
    this.holdPanel.setVisible(visible);
    this.nextQueuePanel.setVisible(visible);
    this.boardPanel.setVisible(visible);
    this.boardGridPanel.setVisible(visible);
    this.rightStatCards.setVisible(visible);
  }

  setDebugVisible(enabled: boolean): void {
    this.holdPanel.setDebugVisible(enabled);
    this.nextQueuePanel.setDebugVisible(enabled);
    this.boardPanel.setDebugVisible(enabled);
    this.boardGridPanel.setDebugVisible(enabled);
    this.rightStatCards.setDebugVisible(enabled);
  }

  getBoardBounds(): { x: number; y: number; w: number; h: number } {
    const frame = this.shell.getFrame();
    const designX = PUZZLE_SECTION_LOCAL_BOUNDS.boardGrid.x;
    const designY = 480 + PUZZLE_SECTION_LOCAL_BOUNDS.boardGrid.y;
    return {
      x: Math.round(frame.frameX + designX * frame.scale),
      y: Math.round(frame.frameY + designY * frame.scale),
      w: Math.round(PUZZLE_SECTION_LOCAL_BOUNDS.boardGrid.w * frame.scale),
      h: Math.round(PUZZLE_SECTION_LOCAL_BOUNDS.boardGrid.h * frame.scale)
    };
  }

  getPuzzleSectionDebugInfo(): Record<string, any> {
    return {
      holdLocal: { ...PUZZLE_SECTION_LOCAL_BOUNDS.hold },
      nextLocal: { ...PUZZLE_SECTION_LOCAL_BOUNDS.next },
      boardLocal: { ...PUZZLE_SECTION_LOCAL_BOUNDS.board },
      boardGridLocal: { ...PUZZLE_SECTION_LOCAL_BOUNDS.boardGrid },
      rightRailLocal: { ...PUZZLE_SECTION_LOCAL_BOUNDS.rightRail },
      puzzleSectionAbsolute: { x: 0, y: 480, w: 1080, h: 1056 }
    };
  }

  private renderTetrominoPreview(
    tiles: Phaser.GameObjects.Rectangle[],
    sprites: Phaser.GameObjects.Sprite[],
    symbols: Phaser.GameObjects.Text[],
    type: string | null,
    hidden: boolean
  ): void {
    const game = this.scene.game as BlockmancerGame;
    const settings = game.getSettings();
    const previewType = isTetrominoType(type) ? type : null;
    const matrix = previewType ? TETROMINO_SHAPES[previewType] : [];

    for (let index = 0; index < 16; index += 1) {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const value = hidden || !previewType ? 0 : matrix[row]?.[col] ?? 0;
      
      const tile = tiles[index];
      tile?.setFillStyle(COLORS.boardEmpty, 1);

      const sprite = sprites[index];
      if (sprite) {
        if (value && previewType) {
          sprite
            .setTexture(game.assetSystem.getBoardBlockTexture(this.scene, getTetrominoBlockId(previewType), 'base'))
            .setVisible(true);
        } else {
          sprite.setVisible(false);
        }
      }

      const symbol = symbols[index];
      symbol?.setText(value && settings.colorblindSymbols && previewType ? previewType : '');
      symbol?.setVisible(Boolean(value && settings.colorblindSymbols && previewType));
    }
  }
}
