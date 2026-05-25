import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';
import { contentRegistry } from '../systems/ContentRegistry';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiMeter, UiPanel } from '../ui/components';
import {
  applyLevelUpSelection,
  buildLevelUpViewModel,
  continueFromLevelUp,
  rerollLevelUpChoices,
  type LevelUpUpgradeCardViewModel,
  type LevelUpUpgradeContent
} from '../ui/level-up';

export class LevelUpRewardScene extends Phaser.Scene {
  private cards: LevelUpUpgradeContent[] = [];
  private selectedIndex = 0;
  private selectionLocked = false;
  private cardFrames: Phaser.GameObjects.Rectangle[] = [];
  private confirmButton?: UiButton;

  constructor() {
    super('LevelUpRewardScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    this.selectionLocked = false;
    this.selectedIndex = 0;
    this.cardFrames = [];
    this.confirmButton = undefined;

    if (!game.levelUpSystem.hasPendingLevelUp(state)) {
      state.levelUpScreenState.levelUpScreenResolved = true;
      continueFromLevelUp(this);
      return;
    }

    this.cards = this.prepareCards();
    const model = buildLevelUpViewModel(state, this.cards);
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 640);
    const panelHeight = Math.min(layout.height - 64, 900);
    const panelLeft = layout.centerX - panelWidth / 2;
    const panelTop = layout.centerY - panelHeight / 2;

    this.cameras.main.setBackgroundColor(COLORS.background);
    game.assetSystem.createImageByAssetKey(this, 'bg_scene_level_up', 'stageBackground', layout.centerX, layout.centerY, {
      kind: 'background',
      alpha: 0.38
    }).setDisplaySize(layout.width, layout.height);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x090b13, 0.72);

    new UiPanel(this, this.uiSpec('level_up_panel', 'panel', 'ui_panel_level_up', 'ui_panel_default', panelLeft, panelTop, panelWidth, panelHeight, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.92,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.48
    });

    new UiPanel(this, this.uiSpec('level_up_banner', 'panel', 'ui_level_up_panel_intro', 'ui_panel_default', layout.centerX - Math.min(430, panelWidth - 56) / 2, panelTop + 24, Math.min(430, panelWidth - 56), 62, 'topLeft', 50), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.5,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.38
    });

    this.add.text(layout.centerX, panelTop + 55, model.title, {
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffca6b',
      stroke: '#090b13',
      strokeThickness: 5
    }).setOrigin(0.5);

    const sparkle = game.assetSystem.createImageByAssetKey(this, 'vfx_level_up_sparkle', 'vfxCombatSmall', layout.centerX + Math.min(198, panelWidth / 2 - 34), panelTop + 54, {
      kind: 'sprite',
      alpha: 0.8
    });
    sparkle.setDisplaySize(42, 42);
    this.tweens.add({ targets: sparkle, angle: 360, duration: 1000, repeat: -1 });

    this.renderLevelSummary(model, layout.centerX, panelTop + 118, panelWidth);
    this.renderCards(model.cards, panelLeft, panelTop + 250, panelWidth);
    this.renderFooter(model, layout.centerX, panelTop + panelHeight - 74, panelWidth);
    this.updateSelection();
  }

  private prepareCards(): LevelUpUpgradeContent[] {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const screenState = state.levelUpScreenState;
    const hasPendingChoices = screenState.offeredUpgradeIds.length > 0 && !screenState.levelUpScreenResolved;

    if (hasPendingChoices) {
      const offered = screenState.offeredUpgradeIds
        .map((id) => contentRegistry.getUpgrade(id) as unknown as LevelUpUpgradeContent | null)
        .filter((card): card is LevelUpUpgradeContent => Boolean(card));
      if (offered.length >= 3) {
        return offered.slice(0, 3);
      }
    }

    const cards = game.levelUpSystem.pickLevelUpChoices(state, 3) as LevelUpUpgradeContent[];
    screenState.levelUpSelectionSeed = `${state.currentNodeId}:${state.playerLevelState.level}:${state.playerLevelState.pendingLevelUps}:${Date.now()}`;
    screenState.offeredUpgradeIds = cards.map((card) => card.id);
    screenState.pendingLevelUpChoices = [...screenState.offeredUpgradeIds];
    screenState.chosenUpgradeIds = [];
    screenState.rerollCharges = state.playerLevelState.rerollCharges;
    screenState.levelUpScreenResolved = false;
    game.saveRun();
    return cards;
  }

  private renderLevelSummary(model: ReturnType<typeof buildLevelUpViewModel>, centerX: number, y: number, panelWidth: number): void {
    const badgeW = Math.min(112, (panelWidth - 88) / 2);
    const badgeGap = 24;
    const leftX = centerX - badgeW / 2 - badgeGap;
    const rightX = centerX + badgeW / 2 + badgeGap;
    this.renderLevelBadge('Current', model.currentLevel, leftX, y, badgeW);
    this.add.text(centerX, y + 22, '->', {
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffca6b'
    }).setOrigin(0.5);
    this.renderLevelBadge('New', model.newLevel, rightX, y, badgeW);

    const meterWidth = Math.min(430, panelWidth - 86);
    const meterTop = y + 74;
    new UiMeter(
      this,
      this.uiSpec('level_up_xp_meter', 'meter', 'ui_meter_xp', 'ui_meter_fallback', centerX - meterWidth / 2, meterTop, meterWidth, 30, 'topLeft', 70),
      { current: model.currentXp, max: model.xpToNextLevel, fillInset: 5, showValueText: false, fillColor: COLORS.success }
    );
    this.add.text(centerX, meterTop + 50, `${model.currentXp}/${model.xpToNextLevel} EXP toward Level ${model.finalLevel + 1}  |  ${model.pendingLevelUps} level-up${model.pendingLevelUps === 1 ? '' : 's'} pending`, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#d8deff',
      align: 'center',
      wordWrap: { width: panelWidth - 64 }
    }).setOrigin(0.5);
  }

  private renderLevelBadge(label: string, level: number, centerX: number, y: number, width: number): void {
    new UiPanel(this, this.uiSpec(`level_badge_${label.toLowerCase()}`, 'panel', 'ui_level_badge', 'ui_panel_default', centerX - width / 2, y - 25, width, 58, 'topLeft', 58), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.82,
      strokeColor: COLORS.accent,
      strokeAlpha: 0.4
    });
    this.add.text(centerX, y - 8, label, {
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      color: '#98a0c7'
    }).setOrigin(0.5);
    this.add.text(centerX, y + 14, `Lv ${level}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '23px',
      fontStyle: 'bold',
      color: '#f6f7ff'
    }).setOrigin(0.5);
  }

  private renderCards(cards: LevelUpUpgradeCardViewModel[], panelLeft: number, startY: number, panelWidth: number): void {
    const game = this.game as BlockmancerGame;
    const cardW = panelWidth - 64;
    const cardH = 146;
    cards.forEach((card, index) => {
      const x = panelLeft + 32;
      const y = startY + index * (cardH + 16);
      new UiPanel(this, this.uiSpec(`level_card_${index}`, 'panel', card.cardAssetKey, 'ui_panel_default', x, y, cardW, cardH, 'topLeft', 60), {
        fillColor: COLORS.panelAlt,
        fillAlpha: 0.9,
        strokeColor: this.rarityColor(card.rarity),
        strokeAlpha: 0.35
      });
      const frame = this.add.rectangle(x, y, cardW, cardH, 0x000000, 0)
        .setOrigin(0, 0)
        .setStrokeStyle(2, this.rarityColor(card.rarity), 0.2)
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

      new UiIconSlot(this, this.uiSpec(`level_card_icon_${index}`, 'iconSlot', game.assetSystem.getIcon(this, 'upgrade', card.id, card.iconKey), 'placeholder_icon', x + 58, y + cardH / 2, 70, 70, 'center', 72));
      this.add.text(x + 106, y + 18, card.name, {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#f6f7ff',
        wordWrap: { width: cardW - 132 }
      });
      this.add.text(x + 106, y + 49, `${card.rarity.toUpperCase()}  |  Stack ${card.stackCount}/${card.stackLimit}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: this.rarityTextColor(card.rarity)
      });
      this.add.text(x + 106, y + 72, card.description, {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        color: '#d8deff',
        wordWrap: { width: cardW - 132 }
      }).setMaxLines(card.flavorText ? 2 : 3);
      if (card.flavorText) {
        this.add.text(x + 106, y + 118, card.flavorText, {
          fontFamily: FONT_FAMILY,
          fontSize: '13px',
          color: '#9db3ff',
          wordWrap: { width: cardW - 132 }
        }).setMaxLines(1);
      }
    });
  }

  private renderFooter(model: ReturnType<typeof buildLevelUpViewModel>, centerX: number, y: number, panelWidth: number): void {
    const buttonW = Math.min(188, (panelWidth - 88) / 2);
    const confirmX = model.canReroll ? centerX + 14 : centerX - buttonW / 2;
    if (model.canReroll) {
      new UiButton(this, this.uiSpec('level_reroll_button', 'button', 'ui_button_level_reroll', 'ui_button_default', centerX - buttonW - 14, y - 29, buttonW, 58, 'topLeft', 90), {
        label: `Reroll (${model.rerollCharges})`,
        onClick: () => {
          if (this.selectionLocked) return;
          const game = this.game as BlockmancerGame;
          if (rerollLevelUpChoices(game, game.runState)) {
            this.scene.restart();
          }
        }
      });
    }

    this.confirmButton = new UiButton(this, this.uiSpec('level_confirm_button', 'button', 'ui_button_level_confirm', 'ui_button_default', confirmX, y - 29, buttonW, 58, 'topLeft', 90), {
      label: model.remainingAfterChoice > 0 ? `Choose (${model.remainingAfterChoice} more)` : 'Choose',
      onClick: () => this.confirmSelection()
    });
  }

  private confirmSelection(): void {
    if (this.selectionLocked) {
      return;
    }
    const card = this.cards[this.selectedIndex];
    if (!card) {
      return;
    }
    this.selectionLocked = true;
    this.confirmButton?.setEnabled(false);

    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const message = applyLevelUpSelection(game, state, card);
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    game.audioSystem.play('reward_pick', this);
    game.saveRun();
    continueFromLevelUp(this);
  }

  private updateSelection(): void {
    this.cardFrames.forEach((frame, index) => {
      frame.setStrokeStyle(index === this.selectedIndex ? 4 : 2, index === this.selectedIndex ? COLORS.gold : COLORS.accent, index === this.selectedIndex ? 0.95 : 0.22);
    });
  }

  private rarityColor(rarity: LevelUpUpgradeCardViewModel['rarity']): number {
    if (rarity === 'rare') return 0xffca6b;
    if (rarity === 'hero') return 0x9adfff;
    return COLORS.accent;
  }

  private rarityTextColor(rarity: LevelUpUpgradeCardViewModel['rarity']): string {
    if (rarity === 'rare') return '#ffca6b';
    if (rarity === 'hero') return '#9adfff';
    return '#98a0c7';
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
      canonicalFolder: type === 'iconSlot' ? 'public/assets/icons/upgrades/' : 'public/assets/ui/',
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
