import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

export class TreasureScene extends Phaser.Scene {
  constructor() {
    super('TreasureScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const compact = isCompactLayout(this);
    const layout = getPortraitLayout(this);
    state.runStatus = 'map';
    state.currentRoomProgress = 'entered';
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, 640, {
      title: 'Treasure Room',
      body: 'A cheerful cache of coins and relic scraps waits inside a ribbon-wrapped vault.',
      titleColor: '#ffca6b',
      bodyFontSize: compact ? '20px' : '22px',
      strokeColor: COLORS.gold
    });

    new Button(this, layout.centerX, 760, 300, 56, 'Claim Treasure', () => {
      state.player.gold += 50;
      state.player.totalGoldCollected += 50;
      state.gold = state.player.gold;
      const reward = game.rewardSystem.getRandomRewards(1)[0];
      this.log('Treasure spills into your pack.');
      this.log(game.rewardSystem.applyReward(state, reward.id));
      game.mapSystem.completeNode(state, state.currentNodeId);
      state.runStatus = 'map';
      game.saveRun();
      this.scene.start('MapScene');
    });
  }

  private log(message: string): void {
    const state = (this.game as BlockmancerGame).runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }
}
