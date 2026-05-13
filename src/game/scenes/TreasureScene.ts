import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, MAX_EVENT_LOG } from '../utils/constants';
import { isCompactLayout } from '../utils/layout';

export class TreasureScene extends Phaser.Scene {
  constructor() {
    super('TreasureScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const compact = isCompactLayout(this);
    state.runStatus = 'map';
    state.currentRoomProgress = 'entered';
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, 640, 400, compact ? 1060 : 980, compact ? 600 : 560, {
      title: 'Treasure Room',
      body: 'A cache of coins and relic scraps waits behind a shattered vault seal.',
      titleColor: '#ffca6b',
      bodyFontSize: compact ? '20px' : '22px',
      strokeColor: COLORS.gold
    });

    new Button(this, 640, compact ? 490 : 450, 300, 56, 'Claim Treasure', () => {
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
