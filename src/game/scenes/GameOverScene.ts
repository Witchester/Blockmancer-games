import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data?: { victory?: boolean }): void {
    const game = this.game as BlockmancerGame;
    const victory = Boolean(data?.victory ?? game.runState.victory);
    const state = game.runState;
    const layout = getPortraitLayout(this);
    state.runStatus = victory ? 'victory' : 'game-over';

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, 660, COLORS.panel, 0.95).setStrokeStyle(2, victory ? COLORS.gold : COLORS.danger, 0.4);

    this.add.text(layout.centerX, 240, victory ? 'Dungeon Conquered' : 'Run Ended', {
      color: victory ? '#ffca6b' : '#ff6673',
      fontFamily: FONT_FAMILY,
      fontSize: '42px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(
      layout.centerX,
      430,
      [
        `Final Stage: ${state.stage}`,
        `Enemies Defeated: ${state.enemiesDefeated}`,
        `Gold Collected: ${state.player.totalGoldCollected}`,
        `Relics Claimed: ${state.ownedRewards.length}`
      ].join('\n'),
      {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        align: 'center',
        lineSpacing: 12
      }
    ).setOrigin(0.5);

    new Button(this, layout.centerX, 650, 250, 56, 'Restart Run', () => {
      game.clearSave();
      game.newRun();
      this.scene.start('MapScene');
    });

    new Button(this, layout.centerX, 728, 250, 56, 'Main Menu', () => {
      game.clearSave();
      this.scene.start('MainMenuScene');
    });
  }
}
