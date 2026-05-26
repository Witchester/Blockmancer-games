import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { RewardDefinition } from '../types/GameTypes';
import type { UiComponentSpec } from '../types/ui-layout';
import { contentRegistry } from '../systems/ContentRegistry';
import { UiButton, UiIconSlot, UiPanel } from '../ui/components';
import { buildRewardViewModel, claimPendingReward, completePostNodeFlow } from '../ui/reward';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class RewardScene extends Phaser.Scene {
  private selectedRewardIndex = 0;
  private claimLocked = false;
  private cardFrames: Phaser.GameObjects.Rectangle[] = [];
  private claimButton?: UiButton;

  constructor() {
    super('RewardScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    state.runStatus = 'reward';
    this.claimLocked = false;
    this.cardFrames = [];
    this.claimButton = undefined;

    if (game.levelUpSystem.hasPendingLevelUp(state)) {
      state.levelUpScreenState.levelUpScreenResolved = false;
      game.saveRun();
      this.scene.start('LevelUpRewardScene');
      return;
    }

    if (state.pendingRewards.length === 0 && state.pendingStageAdvance) {
      completePostNodeFlow(this);
      return;
    }

    this.renderScene();
  }

  private renderScene(): void {
    const game = this.gameAsBlockmancer;
    const state = game.runState;
    const rewards = state.pendingRewards;
    const model = buildRewardViewModel(state);
    this.selectedRewardIndex = rewards.length > 0
      ? Math.max(0, Math.min(this.selectedRewardIndex, rewards.length - 1))
      : 0;
    const selectedReward = rewards[this.selectedRewardIndex];
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 660);
    const panelHeight = Math.min(layout.height - 64, 900);
    const panelLeft = layout.centerX - panelWidth / 2;
    const panelTop = layout.centerY - panelHeight / 2;

    this.children.removeAll(true);
    this.cardFrames = [];
    this.cameras.main.setBackgroundColor(COLORS.background);
    game.assetSystem.createImageByAssetKey(this, 'bg_scene_reward', 'stageBackground', layout.centerX, layout.centerY, {
      kind: 'background',
      alpha: 0.38
    }).setDisplaySize(layout.width, layout.height);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x050814, 0.72);

    new UiPanel(this, this.uiSpec('reward_panel', 'panel', 'ui_panel_reward', 'ui_panel_default', panelLeft, panelTop, panelWidth, panelHeight, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.93,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.48
    });

    new UiPanel(this, this.uiSpec('reward_banner', 'panel', 'ui_reward_banner', 'ui_panel_default', layout.centerX - Math.min(440, panelWidth - 56) / 2, panelTop + 24, Math.min(440, panelWidth - 56), 66, 'topLeft', 50), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.55,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.38
    });

    this.add.text(layout.centerX, panelTop + 56, model.title, {
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffca6b',
      stroke: '#090b13',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(layout.centerX, panelTop + 104, model.banner, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#d8deff'
    }).setOrigin(0.5);

    this.renderSummary(model, panelLeft, panelTop + 136, panelWidth);

    if (model.cards.length === 0) {
      this.renderEmptyState(layout.centerX, panelTop + 438, panelWidth, model.emptyMessage);
    } else {
      this.renderRewardCards(model.cards, rewards, panelLeft, panelTop + 300, panelWidth);
    }

    const buttonW = Math.min(230, panelWidth - 96);
    this.claimButton = new UiButton(this, this.uiSpec('reward_claim_button', 'button', selectedReward ? 'ui_button_reward_claim' : 'ui_button_reward_continue', 'ui_button_default', layout.centerX - buttonW / 2, panelTop + panelHeight - 84, buttonW, 62, 'topLeft', 90), {
      label: selectedReward ? 'Claim' : 'Continue',
      onClick: () => this.handleClaimOrContinue()
    });
  }

  private renderSummary(model: ReturnType<typeof buildRewardViewModel>, panelLeft: number, top: number, panelWidth: number): void {
    const summaryWidth = panelWidth - 64;
    new UiPanel(this, this.uiSpec('reward_summary_panel', 'panel', 'ui_panel_default', 'ui_panel_default', panelLeft + 32, top, summaryWidth, 146, 'topLeft', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.72,
      strokeColor: COLORS.accent,
      strokeAlpha: 0.3
    });

    const left = panelLeft + 56;
    this.add.text(left, top + 20, model.stageLine, {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#f6f7ff'
    });
    this.add.text(left, top + 45, model.nodeLine, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#d8deff'
    });
    this.add.text(left, top + 70, model.sourceLine, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#98a0c7'
    });
    this.add.text(left, top + 95, model.rewardSummary, {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#d8deff',
      wordWrap: { width: summaryWidth - 48 }
    });
    if (model.goldLine) {
      this.add.text(left, top + 121, model.goldLine, {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffca6b'
      });
    }
  }

  private renderEmptyState(centerX: number, centerY: number, panelWidth: number, message: string): void {
    new UiPanel(this, this.uiSpec('reward_empty_state', 'panel', 'ui_reward_empty_state', 'ui_panel_default', centerX - Math.min(430, panelWidth - 88) / 2, centerY - 90, Math.min(430, panelWidth - 88), 180, 'topLeft', 55), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.76,
      strokeColor: COLORS.accent,
      strokeAlpha: 0.34
    });
    new UiIconSlot(this, this.uiSpec('reward_empty_icon', 'iconSlot', 'placeholder_icon', 'asset_missing_icon', centerX, centerY - 34, 54, 54, 'center', 62));
    this.add.text(centerX, centerY + 28, message, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#d8deff',
      align: 'center',
      wordWrap: { width: Math.min(360, panelWidth - 128) }
    }).setOrigin(0.5);
  }

  private renderRewardCards(cards: ReturnType<typeof buildRewardViewModel>['cards'], rewards: RewardDefinition[], panelLeft: number, startY: number, panelWidth: number): void {
    const cardCount = Math.min(cards.length, 4);
    const gap = 16;
    const columns = cardCount >= 4 ? 2 : cardCount;
    const cardW = columns >= 3 ? Math.floor((panelWidth - 64 - gap * 2) / 3) : Math.min(260, Math.floor((panelWidth - 64 - gap * Math.max(0, columns - 1)) / Math.max(1, columns)));
    const cardH = cardCount >= 4 ? 244 : 332;
    const totalW = columns * cardW + Math.max(0, columns - 1) * gap;
    const startX = panelLeft + (panelWidth - totalW) / 2;

    cards.slice(0, 4).forEach((card, index) => {
      const reward = rewards[index];
      const x = startX + (index % columns) * (cardW + gap);
      const y = startY + Math.floor(index / columns) * (cardH + gap);
      const selected = index === this.selectedRewardIndex;
      new UiPanel(this, this.uiSpec(`reward_card_${index}`, 'panel', card.cardAssetKey, 'ui_panel_default', x, y, cardW, cardH, 'topLeft', 60), {
        fillColor: COLORS.panelAlt,
        fillAlpha: 0.9,
        strokeColor: this.rarityColor(card.rarity),
        strokeAlpha: 0.35
      });
      const frame = this.add.rectangle(x, y, cardW, cardH, 0x000000, 0)
        .setOrigin(0, 0)
        .setStrokeStyle(selected ? 4 : 2, selected ? COLORS.gold : this.rarityColor(card.rarity), selected ? 0.95 : 0.24)
        .setDepth(76);
      this.cardFrames.push(frame);

      this.add.zone(x + cardW / 2, y + cardH / 2, cardW, cardH)
        .setInteractive({ useHandCursor: true })
        .setDepth(96)
        .on('pointerup', () => {
          if (this.claimLocked) return;
          this.selectedRewardIndex = index;
          this.updateSelection();
        });

      const iconSize = cardCount >= 4 ? 58 : 82;
      new UiIconSlot(this, this.uiSpec(`reward_icon_${index}`, 'iconSlot', this.getRewardIconKey(reward), 'placeholder_icon', x + cardW / 2, y + (cardCount >= 4 ? 46 : 74), iconSize, iconSize, 'center', 72));
      this.add.text(x + cardW / 2, y + (cardCount >= 4 ? 82 : 128), card.name, {
        fontFamily: FONT_FAMILY,
        fontSize: cardCount >= 4 ? '16px' : '18px',
        fontStyle: 'bold',
        color: '#f6f7ff',
        align: 'center',
        wordWrap: { width: cardW - 24 }
      }).setOrigin(0.5, 0).setMaxLines(2);
      this.add.text(x + cardW / 2, y + (cardCount >= 4 ? 128 : 182), `${card.rarity.toUpperCase()}  |  ${card.typeLabel}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        color: this.rarityTextColor(card.rarity),
        align: 'center',
        wordWrap: { width: cardW - 18 }
      }).setOrigin(0.5, 0);
      if (card.amountLabel) {
        this.add.text(x + cardW / 2, y + (cardCount >= 4 ? 150 : 206), card.amountLabel, {
          fontFamily: FONT_FAMILY,
          fontSize: '16px',
          fontStyle: 'bold',
          color: '#ffca6b',
          align: 'center'
        }).setOrigin(0.5, 0);
      }
      this.add.text(x + 14, y + (cardCount >= 4 ? 178 : 234), card.description, {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: '#d8deff',
        wordWrap: { width: cardW - 28 }
      }).setMaxLines(cardCount >= 4 ? 3 : 4);
    });
  }

  private handleClaimOrContinue(): void {
    if (this.claimLocked) {
      return;
    }
    const game = this.gameAsBlockmancer;
    const selectedReward = game.runState.pendingRewards[this.selectedRewardIndex];
    this.claimLocked = true;
    this.claimButton?.setState('disabled');

    if (!selectedReward) {
      completePostNodeFlow(this);
      return;
    }

    claimPendingReward(this, selectedReward.id);
  }

  private updateSelection(): void {
    this.cardFrames.forEach((frame, index) => {
      const reward = this.gameAsBlockmancer.runState.pendingRewards[index];
      frame.setStrokeStyle(index === this.selectedRewardIndex ? 4 : 2, index === this.selectedRewardIndex ? COLORS.gold : this.rarityColor(reward?.rarity ?? 'common'), index === this.selectedRewardIndex ? 0.95 : 0.24);
    });
  }

  private get gameAsBlockmancer(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private getRewardIconKey(reward: RewardDefinition): string {
    if (reward.contentType === 'item') {
      const entry = contentRegistry.getItem(reward.id) as { iconKey?: string } | null;
      return this.gameAsBlockmancer.assetSystem.getIcon(this, 'item', reward.id, entry?.iconKey);
    }
    if (reward.contentType === 'relic') {
      const entry = contentRegistry.getRelic(reward.id) as { iconKey?: string } | null;
      return this.gameAsBlockmancer.assetSystem.getIcon(this, 'relic', reward.id, entry?.iconKey);
    }
    if (reward.contentType === 'upgrade') {
      const entry = contentRegistry.getUpgrade(reward.id) as { iconKey?: string } | null;
      return this.gameAsBlockmancer.assetSystem.getIcon(this, 'upgrade', reward.id, entry?.iconKey);
    }
    if (reward.contentType === 'oopsie') {
      const entry = contentRegistry.getOopsie(reward.id) as { iconKey?: string } | null;
      return this.gameAsBlockmancer.assetSystem.getIcon(this, 'oopsie', reward.id, entry?.iconKey);
    }
    return this.gameAsBlockmancer.assetSystem.getIcon(
      this,
      reward.type === 'Gold' ? 'currency' : 'reward',
      reward.type === 'Gold' ? 'currency_candy_coin' : reward.id,
      reward.type === 'Gold' ? 'currency_candy_coin' : 'asset_missing_icon'
    );
  }

  private rarityColor(rarity: string): number {
    const normalized = rarity.toLowerCase();
    if (normalized === 'epic' || normalized === 'legendary') return 0xb48cff;
    if (normalized === 'rare') return 0xffca6b;
    if (normalized === 'uncommon') return 0x65d6a5;
    return COLORS.accent;
  }

  private rarityTextColor(rarity: string): string {
    const normalized = rarity.toLowerCase();
    if (normalized === 'epic' || normalized === 'legendary') return '#d9c2ff';
    if (normalized === 'rare') return '#ffca6b';
    if (normalized === 'uncommon') return '#65d6a5';
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
      canonicalFolder: type === 'iconSlot' ? 'public/assets/icons/' : 'public/assets/ui/',
      expectedSourceSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      runtimeRenderSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.max(1, Math.round(w)),
      h: Math.max(1, Math.round(h)),
      anchor,
      fitMode: type === 'iconSlot' ? 'iconCenter' : type === 'button' || type === 'panel' ? 'nineSlice' : 'exact',
      scaleMode: type === 'iconSlot' ? 'fitInteger' : type === 'button' || type === 'panel' ? 'uiStretchNineSlice' : 'none',
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
