import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { RewardId } from '../types/GameTypes';
import { contentRegistry } from '../systems/ContentRegistry';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG, MAX_FALL_SPEED, POST_BATTLE_FALL_SPEED_STEP } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';
import { ITEM_ICON_SIZE, setIconDisplaySize } from '../data/renderSizes';

export class RewardScene extends Phaser.Scene {
  private rewardIndex = 0;

  constructor() {
    super('RewardScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    state.runStatus = 'reward';
    if (state.pendingRewards.length === 0) {
      this.scene.start('MapScene');
      return;
    }

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.createCompactLayout();
  }

  private createCompactLayout(): void {
    const layout = getPortraitLayout(this);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.35);
    this.add.text(layout.centerX, 112, 'Choose Your Reward', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '36px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 160, 'Pick one prize, or reroll if you saved a ticket.', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 72 }
    }).setOrigin(0.5);

    this.renderCompactRewardCard();
  }

  private renderCompactRewardCard(): void {
    const game = this.game as BlockmancerGame;
    const reward = game.runState.pendingRewards[this.rewardIndex];
    const layout = getPortraitLayout(this);
    this.children.removeAll(true);
    this.createCompactLayoutFrame();

    this.add.text(layout.centerX, 236, `Reward ${this.rewardIndex + 1} / ${game.runState.pendingRewards.length}`, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '20px'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 268, `Rerolls: ${game.runState.rewardRerolls}`, {
      color: game.runState.rewardRerolls > 0 ? '#65d6a5' : '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '20px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(layout.centerX, 500, layout.contentWidth - 72, 430, COLORS.panelAlt, 0.98).setStrokeStyle(3, COLORS.accent, 0.45);
    setIconDisplaySize(
      this.gameAsBlockmancer.assetSystem.addImage(this, layout.centerX, 330, this.getRewardIconKey(reward), 'icon'),
      ITEM_ICON_SIZE
    );
    this.add.text(layout.centerX, 398, reward.name, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 112 }
    }).setOrigin(0.5);
    this.add.rectangle(layout.centerX, 456, 190, 36, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.45);
    this.add.text(layout.centerX, 456, `${reward.type}${reward.rarity ? ` - ${reward.rarity}` : ''}`, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '21px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 560, reward.description, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 120 },
      lineSpacing: 10
    }).setOrigin(0.5);

    new Button(this, layout.centerX - 150, 785, 180, 58, 'Previous', () => {
      this.rewardIndex = (this.rewardIndex + game.runState.pendingRewards.length - 1) % game.runState.pendingRewards.length;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.pendingRewards.length <= 1);

    new Button(this, layout.centerX + 150, 785, 180, 58, 'Next', () => {
      this.rewardIndex = (this.rewardIndex + 1) % game.runState.pendingRewards.length;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.pendingRewards.length <= 1);

    new Button(this, layout.centerX, 720, 220, 56, 'Reroll', () => {
      const message = game.rewardSystem.rerollRewards(game.runState);
      game.runState.eventLog.unshift(message);
      game.runState.eventLog = game.runState.eventLog.slice(0, MAX_EVENT_LOG);
      this.rewardIndex = 0;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.rewardRerolls <= 0);

    new Button(this, layout.centerX, 874, 280, 62, 'Take Reward', () => {
      this.claimReward(reward.id);
    });
  }

  private createCompactLayoutFrame(): void {
    const layout = getPortraitLayout(this);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.35);
    this.add.text(layout.centerX, 112, 'Choose Your Reward', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '36px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 160, 'Pick one prize, or reroll if you saved a ticket.', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 72 }
    }).setOrigin(0.5);
  }

  private claimReward(rewardId: RewardId): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const message = game.rewardSystem.applyReward(state, rewardId);
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    state.pendingRewards = [];
    state.activeEnemy = null;
    state.combo = 0;
    const advancingStage = state.pendingStageAdvance;
    
    if (state.pendingStageAdvance) {
      const result = game.mapSystem.advanceAfterBoss(state, game.stageSystem);
      if (result === 'final-victory') {
        state.victory = true;
        state.runStatus = 'victory';
        const routeEnding = game.routeStorySystem.resolveHeroEnding(state.hero.id, state.routeProgress);
        const endingKind = routeEnding.endingKind;
        const heroRouteProgress = state.routeProgress.heroes[state.hero.id];
        if (heroRouteProgress) {
          game.routeStorySystem.recordEndingUnlock(heroRouteProgress, routeEnding.ending, routeEnding.variant);
        }
        const beforeUnlocks = [...game.metaSystem.state.unlockedHeroes];
        game.metaSystem.recordRunEnd(state, true);
        if (endingKind === 'true') {
          game.metaSystem.unlockTrueEnding();
        }
        game.metaSystem.unlockRouteEnding(routeEnding.ending.id);
        if (routeEnding.variant) {
          game.metaSystem.unlockRouteVariantEnding(routeEnding.variant.id);
        }
        const heroUnlocks = game.storySystem.getHeroUnlockMessages(beforeUnlocks, game.metaSystem.state.unlockedHeroes);
        game.audioSystem.play('victory', this);
        game.clearSave();
        this.scene.start('VictoryScene', {
          endingKind,
          heroUnlocks,
          routeEndingId: routeEnding.ending.id,
          routeVariantEndingId: routeEnding.variant?.id
        });
        return;
      }
    } else {
      game.mapSystem.completeNode(state, state.currentNodeId);
    }
    
    state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + POST_BATTLE_FALL_SPEED_STEP);
    state.currentRoomProgress = advancingStage ? 'idle' : 'cleared';
    state.runStatus = 'map';
    game.rewardSystem.applyPostBattleEffects(state).forEach((effectMessage) => {
      state.eventLog.unshift(effectMessage);
    });
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    game.audioSystem.play('reward_pick', this);
    game.saveRun();
    this.scene.start('MapScene');
  }

  private isCompactLayout(): boolean {
    return isCompactLayout(this);
  }

  private get gameAsBlockmancer(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private getRewardIconKey(reward: { id: string; contentType?: string; type: string }): string {
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
}
