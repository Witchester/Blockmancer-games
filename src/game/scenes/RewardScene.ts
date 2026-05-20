import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { RewardDefinition, RewardId } from '../types/GameTypes';
import { contentRegistry } from '../systems/ContentRegistry';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG, MAX_FALL_SPEED, POST_BATTLE_FALL_SPEED_STEP } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class RewardScene extends Phaser.Scene {
  private selectedRewardIndex = 0;

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
    this.renderScene();
  }

  private renderScene(): void {
    const game = this.game as BlockmancerGame;
    const rewards = game.runState.pendingRewards;
    this.selectedRewardIndex = Math.max(0, Math.min(this.selectedRewardIndex, rewards.length - 1));
    const selectedReward = rewards[this.selectedRewardIndex];
    const layout = getPortraitLayout(this);

    this.children.removeAll(true);

    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.35);
    this.add.text(layout.centerX, 94, 'Event / Reward Scene', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '32px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 128, 'Choose one item or upgrade card.', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      align: 'center'
    }).setOrigin(0.5);

    const gridStartX = layout.centerX - (layout.contentWidth / 2) + 78;
    const gridStartY = 192;
    const cardW = 132;
    const cardH = 86;
    const gapX = 18;
    const gapY = 14;
    const columns = 3;
    const rows = 4;
    const slots = columns * rows;

    for (let index = 0; index < slots; index += 1) {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = gridStartX + col * (cardW + gapX);
      const y = gridStartY + row * (cardH + gapY);
      const reward = rewards[index];
      const selected = index === this.selectedRewardIndex;

      const card = this.add.rectangle(x, y, cardW, cardH, COLORS.panelAlt, reward ? 0.98 : 0.6)
        .setOrigin(0, 0)
        .setStrokeStyle(2, selected ? COLORS.gold : COLORS.accentSoft, selected ? 0.9 : 0.4);

      if (reward) {
        card.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
          this.selectedRewardIndex = index;
          this.renderScene();
        });

        this.gameAsBlockmancer.assetSystem.createImageByAssetKey(
          this,
          this.getRewardIconKey(reward),
          this.getRewardDisplayCategory(reward),
          x + 22,
          y + cardH / 2,
          { kind: 'icon' }
        ).setDisplaySize(28, 28);

        this.add.text(x + 44, y + 18, reward.name, {
          color: selected ? '#ffca6b' : '#f6f7ff',
          fontFamily: FONT_FAMILY,
          fontSize: '14px',
          fontStyle: selected ? 'bold' : 'normal',
          wordWrap: { width: cardW - 50 }
        });

        this.add.text(x + 44, y + 50, reward.type, {
          color: '#98a0c7',
          fontFamily: FONT_FAMILY,
          fontSize: '12px'
        });
      }
    }

    this.add.rectangle(layout.centerX + 120, 676, 300, 152, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.45);
    this.add.text(layout.centerX - 20, 624, selectedReward.name, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      fontStyle: 'bold'
    });
    this.add.text(layout.centerX - 20, 656, selectedReward.description, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      wordWrap: { width: 268 }
    });

    new Button(this, layout.centerX + 32, 758, 164, 52, `Reroll (${game.runState.rewardRerolls})`, () => {
      const message = game.rewardSystem.rerollRewards(game.runState);
      game.runState.eventLog.unshift(message);
      game.runState.eventLog = game.runState.eventLog.slice(0, MAX_EVENT_LOG);
      this.selectedRewardIndex = 0;
      this.renderScene();
    }).setDisabled(game.runState.rewardRerolls <= 0);

    new Button(this, layout.centerX + 206, 758, 164, 52, 'Choose', () => {
      this.claimReward(selectedReward.id);
    });
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

  private getRewardDisplayCategory(reward: RewardDefinition): import('../data/asset-display-rules').AssetDisplayCategory {
    if (reward.type === 'Gold') {
      return 'itemIcon';
    }
    return this.gameAsBlockmancer.assetSystem.getDisplayCategoryForContentType(reward.contentType ?? reward.type.toLowerCase(), 'card');
  }
}

