import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';
import { contentRegistry } from '../systems/ContentRegistry';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiPanel } from '../ui/components';
import { continueFromLevelUp } from '../ui/level-up';
import type { LegendaryEvolutionDefinition } from '../types/GameTypes';

type LegendaryChoice = {
  id: string;
  name: string;
  description: string;
  effectType: string;
  effectConfig: Record<string, unknown>;
  tags: string[];
};

export class LegendaryEvolutionScene extends Phaser.Scene {
  private choices: LegendaryChoice[] = [];
  private selectedIndex = 0;
  private selectionLocked = false;
  private cardFrames: Phaser.GameObjects.Rectangle[] = [];
  private confirmButton?: UiButton;
  private cardId = '';
  private cardName = '';

  constructor() {
    super('LegendaryEvolutionScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const pending = state.levelUpScreenState.pendingLegendaryEvolution;

    if (!pending || !pending.cardId) {
      state.levelUpScreenState.pendingLegendaryEvolution = null;
      continueFromLevelUp(this);
      return;
    }

    const cardState = state.runUpgradeState.ownedCards[pending.cardId];
    if (!cardState || !cardState.readyToEvolve || cardState.legendaryEvolutionId) {
      state.levelUpScreenState.pendingLegendaryEvolution = null;
      continueFromLevelUp(this);
      return;
    }

    this.cardId = pending.cardId;
    this.selectionLocked = false;
    this.selectedIndex = 0;
    this.cardFrames = [];
    this.confirmButton = undefined;

    const cardDef = contentRegistry.getOptionalById('upgradeCard', this.cardId) as { name?: string; category?: string } | null;
    this.cardName = cardDef?.name ?? this.cardId;
    const category = cardDef?.category ?? 'hero';

    this.choices = game.levelUpSystem.generateLegendaryEvolutionChoices(this.cardId, state, 2, Date.now());

    if (this.choices.length === 0) {
      game.levelUpSystem.applyLegendaryEvolution(state, this.cardId, `${this.cardId}_safe_fallback`);
      game.saveRun();
      continueFromLevelUp(this);
      return;
    }

    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 660);
    const panelHeight = Math.min(layout.height - 48, 760);
    const panelLeft = layout.centerX - panelWidth / 2;
    const panelTop = layout.centerY - panelHeight / 2;

    this.cameras.main.setBackgroundColor(COLORS.background);
    game.assetSystem.createImageByAssetKey(this, 'bg_scene_legendary_evo', 'stageBackground', layout.centerX, layout.centerY, {
      kind: 'background',
      alpha: 0.28
    }).setDisplaySize(layout.width, layout.height);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x0a0315, 0.82);

    new UiPanel(this, this.uiSpec('legendary_panel', 'panel', 'ui_panel_legendary', 'ui_panel_default', panelLeft, panelTop, panelWidth, panelHeight, 'topLeft', 30), {
      fillColor: 0x1a0e2e,
      fillAlpha: 0.94,
      strokeColor: 0xff9a3c,
      strokeAlpha: 0.6
    });

    new UiPanel(this, this.uiSpec('legendary_banner', 'panel', 'ui_legendary_banner', 'ui_panel_default', panelLeft + 20, panelTop + 16, panelWidth - 40, 72, 'topLeft', 50), {
      fillColor: 0x2a1a44,
      fillAlpha: 0.6,
      strokeColor: 0xffca6b,
      strokeAlpha: 0.45
    });

    this.add.text(layout.centerX, panelTop + 52, 'Legendary Evolution!', {
      fontFamily: FONT_FAMILY,
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffe082',
      stroke: '#1a0e2e',
      strokeThickness: 5
    }).setOrigin(0.5);

    const subY = panelTop + 108;
    this.add.text(layout.centerX, subY, `Choose how "${this.cardName}" transforms.`, {
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      color: '#c5bae8'
    }).setOrigin(0.5);

    const cat = category.charAt(0).toUpperCase() + category.slice(1);
    this.add.text(layout.centerX, subY + 26, `Category: ${cat}  |  Card Lv5`, {
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      color: '#8a7db8'
    }).setOrigin(0.5);

    const sparkleY = panelTop + 52;
    const sparkleLeft = game.assetSystem.createImageByAssetKey(this, 'vfx_legendary_sparkle', 'vfxCombatSmall', panelLeft + 48, sparkleY, {
      kind: 'sprite',
      alpha: 0.75
    });
    sparkleLeft.setDisplaySize(36, 36);
    this.tweens.add({ targets: sparkleLeft, angle: 360, duration: 1200, repeat: -1 });

    const sparkleRight = game.assetSystem.createImageByAssetKey(this, 'vfx_legendary_sparkle', 'vfxCombatSmall', panelLeft + panelWidth - 48, sparkleY, {
      kind: 'sprite',
      alpha: 0.75
    });
    sparkleRight.setDisplaySize(36, 36);
    this.tweens.add({ targets: sparkleRight, angle: -360, duration: 1200, repeat: -1 });

    this.renderChoices(panelLeft, panelTop + 180, panelWidth);

    const footerY = panelTop + panelHeight - 80;
    const buttonW = Math.min(220, (panelWidth - 80));
    const confirmX = layout.centerX - buttonW / 2;
    this.confirmButton = new UiButton(this, this.uiSpec('legendary_confirm', 'button', 'ui_button_legendary', 'ui_button_default', confirmX, footerY - 16, buttonW, 64, 'topLeft', 90), {
      label: 'Choose Legend',
      onClick: () => this.confirmSelection()
    });

    const backY = footerY + 52;
    this.add.text(layout.centerX, backY, 'You can only choose 1 Legendary Evolution.', {
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      color: '#6a5d8e'
    }).setOrigin(0.5);

    this.updateSelection();
  }

  private renderChoices(panelLeft: number, startY: number, panelWidth: number): void {
    const game = this.game as BlockmancerGame;
    const cardW = panelWidth - 56;
    const cardH = 180;

    this.choices.forEach((choice, index) => {
      const x = panelLeft + 28;
      const y = startY + index * (cardH + 18);

      const rarityColor = index === 0 ? 0xff9a3c : 0xba68ff;
      new UiPanel(this, this.uiSpec(`legendary_card_${index}`, 'panel', 'ui_legendary_card', 'ui_panel_default', x, y, cardW, cardH, 'topLeft', 60), {
        fillColor: 0x1e1240,
        fillAlpha: 0.95,
        strokeColor: rarityColor,
        strokeAlpha: 0.4
      });

      const frame = this.add.rectangle(x, y, cardW, cardH, 0x000000, 0)
        .setOrigin(0, 0)
        .setStrokeStyle(2, rarityColor, 0.2)
        .setDepth(75);
      this.cardFrames.push(frame);

      const hit = this.add.zone(x + cardW / 2, y + cardH / 2, cardW, cardH)
        .setInteractive({ useHandCursor: true })
        .setDepth(96);
      hit.on('pointerup', () => {
        if (this.selectionLocked) return;
        this.selectedIndex = index;
        this.updateSelection();
      });

      const starY = y + 28;
      const star = game.assetSystem.createImageByAssetKey(this, `vfx_choice_star_${index}`, 'vfxCombatSmall', x + 36, starY, {
        kind: 'sprite',
        alpha: 0.7
      });
      star.setDisplaySize(28, 28);
      this.tweens.add({
        targets: star,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.add.text(x + 64, y + 16, `Legendary: ${choice.name}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#f6e8ff',
        wordWrap: { width: cardW - 84 }
      });

      const tagLabels = choice.tags.slice(0, 3).join(' \u00b7 ');
      this.add.text(x + 64, y + 46, tagLabels || 'capstone', {
        fontFamily: FONT_FAMILY,
        fontSize: '13px',
        color: '#9a88c7'
      });

      this.add.text(x + 64, y + 72, choice.description, {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#d8cef0',
        wordWrap: { width: cardW - 84 }
      }).setMaxLines(4);

      const effectLine = `${choice.effectType} (applied at level 5)`;
      this.add.text(x + 64, y + 148, effectLine, {
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        color: '#695d8e'
      });
    });
  }

  private confirmSelection(): void {
    if (this.selectionLocked) return;
    const choice = this.choices[this.selectedIndex];
    if (!choice) return;

    this.selectionLocked = true;
    this.confirmButton?.setEnabled(false);

    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const message = game.levelUpSystem.applyLegendaryEvolution(state, this.cardId, choice.id);

    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    game.audioSystem.play('reward_pick', this);
    game.saveRun();
    continueFromLevelUp(this);
  }

  private updateSelection(): void {
    this.cardFrames.forEach((frame, index) => {
      const color = index === this.selectedIndex ? COLORS.gold : (index === 0 ? 0xff9a3c : 0xba68ff);
      frame.setStrokeStyle(index === this.selectedIndex ? 4 : 2, color, index === this.selectedIndex ? 0.95 : 0.22);
    });
  }

  private uiSpec(
    id: string,
    type: string,
    assetKey: string,
    fallbackAssetKey: string,
    x: number,
    y: number,
    w: number,
    h: number,
    anchor: UiComponentSpec['anchor'],
    zIndex: number
  ): UiComponentSpec {
    return {
      id,
      type,
      assetKey,
      fallbackAssetKey,
      canonicalFolder: type === 'iconSlot' ? 'public/assets/icons/' : 'public/assets/ui/',
      expectedSourceSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      runtimeRenderSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.max(1, Math.round(w)),
      h: Math.max(1, Math.round(h)),
      anchor,
      fitMode: type === 'iconSlot' ? 'iconCenter' : type === 'meter' || type === 'button' || type === 'panel' ? 'nineSlice' : 'exact',
      scaleMode: type === 'iconSlot' ? 'fitInteger' : type === 'meter' || type === 'button' || type === 'panel' ? 'uiStretchNineSlice' : 'none',
      safePadding: type === 'iconSlot' ? 0 : 12,
      zIndex,
      dynamicTextAllowed: type !== 'iconSlot',
      pixelPerfect: {
        integerCoordinates: true,
        allowFractionalScale: false,
        filtering: 'nearest',
        antiAliasing: false,
        roundPixels: true
      }
    };
  }
}
