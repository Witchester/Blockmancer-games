import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { RewardId } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { COLORS, MAX_EVENT_LOG, MAX_FALL_SPEED } from '../utils/constants';

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
    if (this.isCompactLayout()) {
      this.createCompactLayout();
      return;
    }

    this.add.rectangle(640, 400, 1160, 680, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.35);

    this.add.text(640, 120, 'Choose Your Reward', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '42px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, 168, 'Take one relic or upgrade before returning to the map.', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '21px'
    }).setOrigin(0.5);

    state.pendingRewards.forEach((reward, index) => {
      const x = 290 + index * 350;
      this.add.rectangle(x, 410, 290, 360, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.35);
      this.add.text(x, 270, reward.name, {
        color: '#ffca6b',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 240 }
      }).setOrigin(0.5);
      this.add.text(x, 322, reward.type, {
        color: '#98a0c7',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px'
      }).setOrigin(0.5);
      this.add.text(x, 390, reward.description, {
        color: '#d8deff',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px',
        align: 'center',
        wordWrap: { width: 240 }
      }).setOrigin(0.5);

      new Button(this, x, 520, 200, 50, 'Take Reward', () => {
        this.claimReward(reward.id);
      });
    });
  }

  private createCompactLayout(): void {
    this.add.rectangle(640, 400, 1020, 700, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.35);
    this.add.text(640, 110, 'Choose Your Reward', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, 156, 'Mobile layout shows one reward at a time for clearer reading.', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '20px',
      align: 'center'
    }).setOrigin(0.5);

    this.renderCompactRewardCard();
  }

  private renderCompactRewardCard(): void {
    const game = this.game as BlockmancerGame;
    const reward = game.runState.pendingRewards[this.rewardIndex];
    this.children.removeAll(true);
    this.createCompactLayoutFrame();

    this.add.text(640, 230, `Reward ${this.rewardIndex + 1} / ${game.runState.pendingRewards.length}`, {
      color: '#98a0c7',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '18px'
    }).setOrigin(0.5);

    this.add.rectangle(640, 420, 700, 360, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.35);
    this.add.text(640, 300, reward.name, {
      color: '#ffca6b',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 540 }
    }).setOrigin(0.5);
    this.add.text(640, 350, reward.type, {
      color: '#98a0c7',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '20px'
    }).setOrigin(0.5);
    this.add.text(640, 430, reward.description, {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '22px',
      align: 'center',
      wordWrap: { width: 560 },
      lineSpacing: 8
    }).setOrigin(0.5);

    new Button(this, 450, 650, 180, 54, 'Previous', () => {
      this.rewardIndex = (this.rewardIndex + game.runState.pendingRewards.length - 1) % game.runState.pendingRewards.length;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.pendingRewards.length <= 1);

    new Button(this, 830, 650, 180, 54, 'Next', () => {
      this.rewardIndex = (this.rewardIndex + 1) % game.runState.pendingRewards.length;
      this.renderCompactRewardCard();
    }).setDisabled(game.runState.pendingRewards.length <= 1);

    new Button(this, 640, 720, 260, 56, 'Take Reward', () => {
      this.claimReward(reward.id);
    });
  }

  private createCompactLayoutFrame(): void {
    this.add.rectangle(640, 400, 1020, 700, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.gold, 0.35);
    this.add.text(640, 110, 'Choose Your Reward', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, 156, 'Swipe mentally, tap physically: one reward card at a time.', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '20px',
      align: 'center'
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
    state.stage += 1;
    state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + 0.05);
    state.currentRoomProgress = 'cleared';
    state.runStatus = 'map';
    game.rewardSystem.applyPostBattleEffects(state).forEach((effectMessage) => {
      state.eventLog.unshift(effectMessage);
    });
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    game.mapSystem.completeNode(state, state.currentNodeId);
    game.saveRun();
    this.scene.start('MapScene');
  }

  private isCompactLayout(): boolean {
    return this.scale.parentSize.width <= 900 || this.scale.parentSize.height <= 720;
  }
}
