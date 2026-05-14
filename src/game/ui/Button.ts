import Phaser from 'phaser';
import { COLORS, FONT_FAMILY } from '../utils/constants';

export class Button extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;
  private disabled = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    onClick: () => void
  ) {
    super(scene, x, y);

    this.background = scene.add
      .rectangle(0, 0, width, height, COLORS.panelAlt, 0.98)
      .setStrokeStyle(2, COLORS.accent, 0.7)
      .setOrigin(0.5);

    this.label = scene.add
      .text(0, 0, text, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        align: 'center',
        wordWrap: { width: width - 18 }
      })
      .setOrigin(0.5);

    this.add([this.background, this.label]);
    this.setSize(width, height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    this.on('pointerover', () => {
      if (!this.disabled) {
        this.background.setFillStyle(COLORS.accentSoft, 0.98);
      }
    });

    this.on('pointerout', () => {
      if (!this.disabled) {
        this.background.setFillStyle(COLORS.panelAlt, 0.98);
      }
    });

    this.on('pointerdown', () => {
      if (!this.disabled) {
        onClick();
      }
    });

    scene.add.existing(this);
  }

  setDisabled(disabled: boolean): this {
    this.disabled = disabled;
    this.background.setFillStyle(disabled ? 0x34384e : COLORS.panelAlt, 0.98);
    this.background.setStrokeStyle(2, disabled ? 0x555a75 : COLORS.accent, 0.7);
    this.label.setAlpha(disabled ? 0.55 : 1);
    return this;
  }

  setText(text: string): void {
    this.label.setText(text);
  }
}
