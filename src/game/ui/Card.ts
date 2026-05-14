import Phaser from 'phaser';
import { COLORS, FONT_FAMILY } from '../utils/constants';

type TextAlign = 'left' | 'center' | 'right';

export type CardOptions = {
  title?: string;
  subtitle?: string;
  body?: string;
  titleColor?: string;
  subtitleColor?: string;
  bodyColor?: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  bodyFontSize?: string;
  bodyAlign?: TextAlign;
  strokeColor?: number;
  fillColor?: number;
  fillAlpha?: number;
  padding?: number;
};

export class Card extends Phaser.GameObjects.Container {
  private readonly widthPx: number;
  private readonly heightPx: number;
  private readonly padding: number;
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly titleText?: Phaser.GameObjects.Text;
  private readonly subtitleText?: Phaser.GameObjects.Text;
  private readonly bodyText?: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    options: CardOptions = {}
  ) {
    super(scene, x, y);

    this.widthPx = width;
    this.heightPx = height;
    this.padding = options.padding ?? 24;

    this.background = scene.add
      .rectangle(0, 0, width, height, options.fillColor ?? COLORS.panelAlt, options.fillAlpha ?? 0.98)
      .setOrigin(0.5)
      .setStrokeStyle(2, options.strokeColor ?? COLORS.accent, 0.25);

    this.add(this.background);

    if (options.title) {
      this.titleText = scene.add.text(0, 0, options.title, {
        color: options.titleColor ?? '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: options.titleFontSize ?? '30px',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: width - this.padding * 2 }
      }).setOrigin(0.5, 0);
      this.add(this.titleText);
    }

    if (options.subtitle) {
      this.subtitleText = scene.add.text(0, 0, options.subtitle, {
        color: options.subtitleColor ?? '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: options.subtitleFontSize ?? '20px',
        align: 'center',
        wordWrap: { width: width - this.padding * 2 }
      }).setOrigin(0.5, 0);
      this.add(this.subtitleText);
    }

    if (options.body) {
      this.bodyText = scene.add.text(0, 0, options.body, {
        color: options.bodyColor ?? '#d8deff',
        fontFamily: FONT_FAMILY,
        fontSize: options.bodyFontSize ?? '20px',
        align: options.bodyAlign ?? 'center',
        wordWrap: { width: width - this.padding * 2 },
        lineSpacing: 8
      }).setOrigin(0.5);
      this.add(this.bodyText);
    }

    this.layout();
    scene.add.existing(this);
  }

  setTitle(text: string): void {
    this.titleText?.setText(text);
    this.layout();
  }

  setSubtitle(text: string): void {
    this.subtitleText?.setText(text);
    this.layout();
  }

  setBody(text: string): void {
    this.bodyText?.setText(text);
    this.layout();
  }

  private layout(): void {
    let top = -this.heightPx / 2 + this.padding;

    if (this.titleText) {
      this.titleText.setPosition(0, top);
      top += this.titleText.height + 12;
    }

    if (this.subtitleText) {
      this.subtitleText.setPosition(0, top);
      top += this.subtitleText.height + 18;
    }

    if (this.bodyText) {
      const contentBottom = this.heightPx / 2 - this.padding;
      const bodyCenterY = top + Math.max(0, contentBottom - top) / 2;
      this.bodyText.setPosition(0, bodyCenterY);
    }
  }
}
