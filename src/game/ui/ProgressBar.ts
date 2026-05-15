import Phaser from 'phaser';
import { COLORS, FONT_FAMILY } from '../utils/constants';

export type ProgressBarOptions = {
  label?: string;
  width?: number;
  height?: number;
  fillColor?: number;
  trackColor?: number;
  textColor?: string;
  showValueText?: boolean;
};

export class ProgressBar extends Phaser.GameObjects.Container {
  private readonly track: Phaser.GameObjects.Rectangle;
  private readonly fill: Phaser.GameObjects.Rectangle;
  private readonly labelText?: Phaser.GameObjects.Text;
  private readonly valueText?: Phaser.GameObjects.Text;
  private readonly fillWidth: number;
  private readonly fillHeight: number;
  private lastValueText = '';
  private lastFillWidth = -1;

  constructor(scene: Phaser.Scene, x: number, y: number, options: ProgressBarOptions = {}) {
    super(scene, x, y);

    this.fillWidth = options.width ?? 400;
    this.fillHeight = options.height ?? 18;
    const showValueText = options.showValueText ?? true;
    const barY = options.label ? 26 : 0;

    if (options.label) {
      this.labelText = scene.add.text(0, 0, options.label, {
        color: options.textColor ?? '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '19px',
        fontStyle: 'bold'
      }).setOrigin(0, 0);
      this.add(this.labelText);
    }

    if (showValueText) {
      this.valueText = scene.add.text(this.fillWidth, 0, '', {
        color: options.textColor ?? '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '19px',
        fontStyle: 'bold'
      }).setOrigin(1, 0);
      this.add(this.valueText);
    }

    this.track = scene.add
      .rectangle(0, barY, this.fillWidth, this.fillHeight, options.trackColor ?? 0x2f3652, 1)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x6570a8, 0.8);
    this.fill = scene.add
      .rectangle(0, barY, this.fillWidth, this.fillHeight, options.fillColor ?? COLORS.danger, 1)
      .setOrigin(0, 0);

    this.add([this.track, this.fill]);
    scene.add.existing(this);
  }

  setValue(current: number, max: number): void {
    const safeMax = Math.max(1, max);
    const ratio = Phaser.Math.Clamp(current / safeMax, 0, 1);
    const nextFillWidth = this.fillWidth * ratio;
    const nextValueText = `${Math.max(0, Math.round(current))}/${safeMax}`;
    if (this.lastFillWidth !== nextFillWidth) {
      this.fill.setDisplaySize(nextFillWidth, this.fillHeight);
      this.lastFillWidth = nextFillWidth;
    }
    if (this.valueText && this.lastValueText !== nextValueText) {
      this.valueText.setText(nextValueText);
      this.lastValueText = nextValueText;
    }
  }

  setLabel(text: string): void {
    this.labelText?.setText(text);
  }
}
