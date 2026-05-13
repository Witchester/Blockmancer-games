import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS } from '../utils/constants';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data?: { victory?: boolean }): void {
    const game = this.game as BlockmancerGame;
    const victory = Boolean(data?.victory ?? game.runState.victory);
    const state = game.runState;
    state.runStatus = victory ? 'victory' : 'game-over';

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(640, 400, 980, 620, COLORS.panel, 0.95).setStrokeStyle(2, victory ? COLORS.gold : COLORS.danger, 0.4);

    this.add.text(640, 180, victory ? 'Dungeon Conquered' : 'Run Ended', {
      color: victory ? '#ffca6b' : '#ff6673',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '52px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(
      640,
      330,
      [
        `Final Stage: ${state.stage}`,
        `Enemies Defeated: ${state.enemiesDefeated}`,
        `Gold Collected: ${state.player.totalGoldCollected}`,
        `Relics Claimed: ${state.ownedRewards.length}`
      ].join('\n'),
      {
        color: '#f6f7ff',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '26px',
        align: 'center',
        lineSpacing: 12
      }
    ).setOrigin(0.5);

    new Button(this, 640, 520, 250, 56, 'Restart Run', () => {
      game.clearSave();
      game.newRun();
      this.scene.start('MapScene');
    });

    new Button(this, 640, 600, 250, 56, 'Main Menu', () => {
      game.clearSave();
      this.scene.start('MainMenuScene');
    });
  }
}
