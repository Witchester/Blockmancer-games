import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { RewardId } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG, MAX_FALL_SPEED } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

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

    this.add.text(layout.centerX, 160, 'Take one relic or upgrade before returning to the map.', {
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

    this.add.text(layout.centerX, 248, `Reward ${this.rewardIndex + 1} / ${game.runState.pendingRewards.length}`, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '18px'
    }).setOrigin(0.5);

    this.add.rectangle(layout.centerX, 494, layout.contentWidth - 72, 420, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.35);
    this.add.text(layout.centerX, 352, reward.name, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '30px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 112 }
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 410, reward.type, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '20px'
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 510, reward.description, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '21px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 120 },
      lineSpacing: 8
    }).setOrigin(0.5);

    new Button(this, layout.centerX - 150, 765, 180, 54, 'Previous', () => {
      this.rewardIndex = (this.rewardIndex + game.runState.pendingRewards.length - 1) % game.runState.pendingRewards.length;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.pendingRewards.length <= 1);

    new Button(this, layout.centerX + 150, 765, 180, 54, 'Next', () => {
      this.rewardIndex = (this.rewardIndex + 1) % game.runState.pendingRewards.length;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.pendingRewards.length <= 1);

    new Button(this, layout.centerX, 852, 260, 56, 'Take Reward', () => {
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

    this.add.text(layout.centerX, 160, 'One reward at a time for clear portrait play.', {
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
    
    if (state.lastBattleWasBoss) {
      state.stage += 1;
      
      if (state.stage > 6) {
        state.victory = true;
        state.runStatus = 'game-over';
        game.metaSystem.state.normalEndingFinished = true;
        game.metaSystem.save();
        game.saveRun();
        this.scene.start('GameOverScene');
        return;
      }
      
      // Stage advancement: reset map topology
      state.map = game.mapSystem.createMap();
      state.currentNodeId = 'start';
    } else {
      game.mapSystem.completeNode(state, state.currentNodeId);
    }
    
    state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + 0.05);
    state.currentRoomProgress = 'cleared';
    state.runStatus = 'map';
    game.rewardSystem.applyPostBattleEffects(state).forEach((effectMessage) => {
      state.eventLog.unshift(effectMessage);
    });
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    game.saveRun();
    this.scene.start('MapScene');
  }

  private isCompactLayout(): boolean {
    return isCompactLayout(this);
  }
}
