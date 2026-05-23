import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';
import { contentRegistry } from '../systems/ContentRegistry';

type LevelUpCard = {
  id: string;
  name: string;
  description?: string;
  flavorText?: string;
  iconKey?: string;
  upgradeType?: 'general' | 'hero_specific';
  cardType?: 'general' | 'hero' | 'hero_specific' | 'rare';
  stackLimit?: number;
  effectId?: string;
};

export class LevelUpRewardScene extends Phaser.Scene {
  private cards: LevelUpCard[] = [];

  constructor() {
    super('LevelUpRewardScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    if (!game.levelUpSystem.hasPendingLevelUp(state)) {
      state.levelUpScreenState.levelUpScreenResolved = true;
      this.scene.start('RewardScene');
      return;
    }
    const screenState = state.levelUpScreenState;
    const hasPendingChoices = screenState.offeredUpgradeIds.length > 0 && !screenState.levelUpScreenResolved;
    if (hasPendingChoices) {
      const offered = screenState.offeredUpgradeIds
        .map((id) => contentRegistry.getUpgrade(id) as unknown as LevelUpCard | null)
        .filter((card): card is LevelUpCard => Boolean(card));
      this.cards = offered.length >= 3 ? offered.slice(0, 3) : game.levelUpSystem.pickLevelUpChoices(state, 3);
    } else {
      this.cards = game.levelUpSystem.pickLevelUpChoices(state, 3);
      screenState.levelUpSelectionSeed = `${state.currentNodeId}:${state.playerLevelState.level}:${Date.now()}`;
      screenState.offeredUpgradeIds = this.cards.map((card) => card.id);
      screenState.pendingLevelUpChoices = [...screenState.offeredUpgradeIds];
      screenState.chosenUpgradeIds = [];
      screenState.rerollCharges = state.playerLevelState.rerollCharges;
      screenState.levelUpScreenResolved = false;
      game.saveRun();
    }

    const layout = getPortraitLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x090b13, 0.95);
    this.add.text(layout.centerX, 78, 'Festival Level-Up!', {
      fontFamily: FONT_FAMILY,
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffca6b'
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 116, `Level ${state.playerLevelState.level}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '20px',
      color: '#d8deff'
    }).setOrigin(0.5);

    const cardW = Math.min(620, layout.contentWidth - 32);
    const cardH = 170;
    this.cards.forEach((card, index) => {
      const y = 170 + index * (cardH + 16);
      this.add.rectangle(layout.centerX, y + cardH / 2, cardW, cardH, COLORS.panelAlt, 0.95).setStrokeStyle(2, COLORS.accent, 0.5);
      game.assetSystem.createImageByAssetKey(
        this,
        game.assetSystem.getIcon(this, 'upgrade', card.id, card.iconKey ?? 'asset_missing_icon'),
        'upgradeIcon',
        layout.centerX - cardW / 2 + 42,
        y + cardH / 2,
        { kind: 'icon' }
      ).setDisplaySize(52, 52);
      const stack = game.levelUpSystem.getChosenUpgradeStack(state, card.id);
      const limit = Math.max(1, card.stackLimit ?? 1);
      this.add.text(layout.centerX - cardW / 2 + 78, y + 24, card.name, {
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#f6f7ff'
      });
      this.add.text(layout.centerX - cardW / 2 + 78, y + 56, `${card.cardType ?? card.upgradeType ?? 'general'}  Stack ${stack}/${limit}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        color: '#98a0c7'
      });
      this.add.text(layout.centerX - cardW / 2 + 78, y + 80, card.description ?? 'A festive boost.', {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#d8deff',
        wordWrap: { width: cardW - 180 }
      });
      if (card.flavorText) {
        this.add.text(layout.centerX - cardW / 2 + 78, y + 132, card.flavorText, {
          fontFamily: FONT_FAMILY,
          fontSize: '14px',
          color: '#9db3ff'
        });
      }
      new Button(this, layout.centerX + cardW / 2 - 72, y + cardH / 2, 120, 46, 'Choose', () => {
        game.levelUpSystem.applyChosenUpgrade(state, card);
        game.upgradeSystem.applyLevelUpUpgrade(state, card.id);
        game.levelUpSystem.consumePendingLevelUp(state);
        state.levelUpScreenState.chosenUpgradeIds.push(card.id);
        state.levelUpScreenState.levelUpScreenResolved = true;
        state.levelUpScreenState.offeredUpgradeIds = [];
        state.levelUpScreenState.pendingLevelUpChoices = [];
        game.saveRun();
        if (game.levelUpSystem.hasPendingLevelUp(state)) {
          this.scene.restart();
        } else {
          this.scene.start('RewardScene');
        }
      });
    });

    new Button(this, layout.centerX - 120, layout.height - 54, 180, 48, `Reroll (${state.playerLevelState.rerollCharges})`, () => {
      if (state.playerLevelState.rerollCharges <= 0) return;
      state.playerLevelState.rerollCharges -= 1;
      state.levelUpScreenState.offeredUpgradeIds = [];
      state.levelUpScreenState.pendingLevelUpChoices = [];
      state.levelUpScreenState.levelUpScreenResolved = false;
      game.saveRun();
      this.scene.restart();
    }).setDisabled(state.playerLevelState.rerollCharges <= 0);
  }
}
