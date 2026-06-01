import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

export class CollectionScene extends Phaser.Scene {
  constructor() {
    super('CollectionScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, layout.centerX, 88, layout.contentWidth, 100, {
      title: 'Monster Friends',
      body: game.friendshipSystem.getSummary(game.metaSystem.state),
      titleColor: '#65d6a5',
      bodyFontSize: compact ? '18px' : '20px',
      strokeColor: COLORS.success
    });

    game.friendshipSystem.list().slice(0, 10).forEach((entry, index) => {
      const points = game.metaSystem.state.monsterFriendship[entry.monsterId] ?? 0;
      const summary = game.friendshipSystem.getEntryEffectSummary(entry, game.metaSystem.state);
      new Card(this, layout.centerX, 190 + index * 86, layout.contentWidth - 24, 70, {
        title: entry.name,
        body: `Friendship points: ${points}/${entry.pointsRequired}\nBenefit: ${summary.current}\nNext: ${summary.next}`,
        titleFontSize: compact ? '18px' : '20px',
        bodyFontSize: compact ? '13px' : '15px',
        strokeColor: COLORS.accentSoft
      });
    });

    new Button(this, layout.centerX, layout.height - 68, 240, 54, 'Back', () => this.scene.start('MainMenuScene'));
  }
}
