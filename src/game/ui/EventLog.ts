import Phaser from 'phaser';
import type { RunState } from '../types/GameTypes';
import { COLORS, FONT_FAMILY } from '../utils/constants';

export class EventLog {
  private readonly body: Phaser.GameObjects.Text;
  private readonly latestText: Phaser.GameObjects.Text;
  private latestCache = '';
  private bodyCache = '';

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    scene.add
      .rectangle(x, y, width, height, COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.accent, 0.35);

    scene.add.text(x + 14, y + 10, 'Event Log', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '21px',
      fontStyle: 'bold'
    });

    this.latestText = scene.add.text(x + 126, y + 10, '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '19px',
      fontStyle: 'bold',
      wordWrap: { width: width - 148 }
    });

    this.body = scene.add.text(x + 14, y + 44, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      wordWrap: { width: width - 28 },
      lineSpacing: 5
    });
  }

  update(state: RunState): void {
    const [latest, ...rest] = state.eventLog;
    const latestValue = latest ?? '';
    const bodyValue = rest.slice(0, 3).map((entry) => `- ${entry}`).join('\n');
    if (latestValue !== this.latestCache) {
      this.latestText.setText(latestValue);
      this.latestCache = latestValue;
    }
    if (bodyValue !== this.bodyCache) {
      this.body.setText(bodyValue);
      this.bodyCache = bodyValue;
    }
  }
}
