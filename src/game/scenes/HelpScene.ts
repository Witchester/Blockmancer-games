import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

const HELP_SECTIONS = [
  {
    title: 'Controls',
    lines: [
      'Move: A/D, arrows, or touch left/right.',
      'Rotate: W, Up, or Rot.',
      'Soft drop: S, Down, or Soft.',
      'Hard drop: Space or Drop.',
      'Hold: Shift, C, or Hold.'
    ]
  },
  {
    title: 'Cascade Gravity',
    lines: [
      'Fill a row to clear it.',
      'Blocks above fall straight down inside their columns.',
      'New full rows clear again for combo, damage, mana, and fever.'
    ]
  },
  {
    title: 'Combat Loop',
    lines: [
      'Line clears damage the enemy and build mana.',
      'Spells spend mana for burst effects.',
      'Watch enemy intent and attack countdown.',
      'Use bag items when the board or HP gets rough.'
    ]
  },
  {
    title: 'Run Progress',
    lines: [
      'Choose rewards after battles.',
      'Pick map rooms to shape the run.',
      'Beat the boss to advance to the next stage.'
    ]
  }
];

export class HelpScene extends Phaser.Scene {
  constructor() {
    super('HelpScene');
  }

  create(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, COLORS.panel, 0.95)
      .setStrokeStyle(2, COLORS.accent, 0.35);

    this.add.text(layout.centerX, 80, 'Help', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '38px' : '44px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    let y = 160;
    HELP_SECTIONS.forEach((section) => {
      this.add.text(layout.margin + 36, y, section.title, {
        color: '#ffca6b',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '24px' : '28px',
        fontStyle: 'bold'
      });
      y += compact ? 34 : 40;

      this.add.text(layout.margin + 52, y, section.lines.join('\n'), {
        color: '#d8deff',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '18px' : '21px',
        wordWrap: { width: layout.contentWidth - 104 },
        lineSpacing: compact ? 5 : 7
      });
      y += section.lines.length * (compact ? 26 : 31) + 34;
    });

    new Button(this, layout.centerX, layout.height - 76, 260, 54, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
