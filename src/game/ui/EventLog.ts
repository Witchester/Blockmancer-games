import Phaser from 'phaser';
import type { RunState } from '../types/GameTypes';
import { COLORS } from '../utils/constants';

export class EventLog {
  private readonly body: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    scene.add
      .rectangle(x, y, width, height, COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.accent, 0.35);

    scene.add.text(x + 14, y + 10, 'Event Log', {
      color: '#ffca6b',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '20px'
    });

    this.body = scene.add.text(x + 14, y + 40, '', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '17px',
      wordWrap: { width: width - 28 },
      lineSpacing: 6
    });
  }

  update(state: RunState): void {
    this.body.setText(state.eventLog.map((entry) => `- ${entry}`).join('\n'));
  }
}
