import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

type VictorySceneData = {
  endingKind?: 'normal' | 'true';
  heroUnlocks?: string[];
};

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data?: VictorySceneData): void {
    const game = this.game as BlockmancerGame;
    const endingKind = data?.endingKind ?? 'normal';
    const beat = game.storySystem.getEnding(endingKind);
    const layout = getPortraitLayout(this);

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, COLORS.panel, 0.96)
      .setStrokeStyle(3, endingKind === 'true' ? COLORS.success : COLORS.gold, 0.55);

    this.add.text(layout.centerX, 108, beat.title, {
      color: endingKind === 'true' ? '#65d6a5' : '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '40px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 80 }
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 390, beat.lines.join('\n\n'), {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 96 },
      lineSpacing: 8
    }).setOrigin(0.5);

    const unlocks = data?.heroUnlocks ?? [];
    this.add.text(layout.centerX, 690, unlocks.length ? `New hero note:\n${unlocks.join('\n')}` : 'The festival crowd is already planning the next run.', {
      color: unlocks.length ? '#ffca6b' : '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 100 },
      lineSpacing: 8
    }).setOrigin(0.5);

    new Button(this, layout.centerX, 835, 260, 60, 'Main Menu', () => {
      game.clearSave();
      this.scene.start('MainMenuScene');
    });
  }
}
