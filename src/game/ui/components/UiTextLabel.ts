import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS, FONT_FAMILY_STACKS } from '../../utils/constants';
import { roundPixel } from '../PixelPerfect';
import { UiBaseComponent, type UiComponentOptions } from './UiBaseComponent';

export type UiFontKey = 'font_pixel_header' | 'font_pixel_body' | 'font_pixel_number' | 'font_pixel_small';
export type UiTextStyleKey = 'title' | 'sectionHeader' | 'button' | 'body' | 'hudLabel' | 'number' | 'micro';
export type UiTextAlign = 'left' | 'center' | 'right';

export type UiTextLabelOptions = UiComponentOptions & {
  text?: string;
  fontKey?: UiFontKey;
  textStyle?: UiTextStyleKey;
  align?: UiTextAlign;
  color?: string;
  wordWrapWidth?: number;
  maxLines?: number;
  lineSpacing?: number;
  outline?: boolean;
  shadow?: boolean;
};

const FONT_FAMILY_BY_KEY: Record<UiFontKey, string> = {
  font_pixel_header: FONT_FAMILY_STACKS.display,
  font_pixel_body: FONT_FAMILY_STACKS.ui,
  font_pixel_number: FONT_FAMILY_STACKS.pixelSmall,
  font_pixel_small: FONT_FAMILY_STACKS.pixelSmall
};

const TEXT_STYLE_BY_KEY: Record<UiTextStyleKey, { fontKey: UiFontKey; size: number; color: string; fontStyle?: string }> = {
  title: { fontKey: 'font_pixel_header', size: 64, color: '#f6f7ff', fontStyle: 'bold' },
  sectionHeader: { fontKey: 'font_pixel_header', size: 42, color: '#f6f7ff', fontStyle: 'bold' },
  button: { fontKey: 'font_pixel_body', size: 30, color: '#f6f7ff', fontStyle: 'bold' },
  body: { fontKey: 'font_pixel_body', size: 30, color: '#d8deff' },
  hudLabel: { fontKey: 'font_pixel_small', size: 22, color: '#f6f7ff', fontStyle: 'bold' },
  number: { fontKey: 'font_pixel_number', size: 34, color: '#ffca6b', fontStyle: 'bold' },
  micro: { fontKey: 'font_pixel_small', size: 20, color: '#d8deff' }
};

export function createUiTextStyle(options: UiTextLabelOptions, component?: UiComponentSpec): Phaser.Types.GameObjects.Text.TextStyle {
  const styleKey = options.textStyle ?? 'body';
  const base = TEXT_STYLE_BY_KEY[styleKey];
  const fontKey = options.fontKey ?? base.fontKey;
  const wrapWidth = roundPixel(options.wordWrapWidth ?? Math.max(20, (component?.w ?? 240) - (component?.safePadding ?? 0) * 2));
  return {
    color: options.color ?? base.color,
    fontFamily: FONT_FAMILY_BY_KEY[fontKey],
    fontSize: `${base.size}px`,
    fontStyle: base.fontStyle,
    align: options.align ?? 'left',
    wordWrap: { width: wrapWidth },
    lineSpacing: options.lineSpacing ?? 4,
    stroke: options.outline ? '#05060a' : undefined,
    strokeThickness: options.outline ? 4 : 0,
    shadow: options.shadow
      ? {
          offsetX: 2,
          offsetY: 2,
          color: '#05060a',
          blur: 0,
          stroke: true,
          fill: true
        }
      : undefined
  };
}

export class UiTextLabel extends UiBaseComponent {
  readonly text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiTextLabelOptions = {}) {
    super(scene, spec, options);
    const padding = roundPixel(this.spec.safePadding);
    const align = options.align ?? 'left';
    const originX = align === 'center' ? 0.5 : align === 'right' ? 1 : 0;
    const x = align === 'center' ? this.bounds.w / 2 : align === 'right' ? this.bounds.w - padding : padding;
    const y = padding;
    this.text = this.createText(
      x,
      y,
      options.text ?? '',
      createUiTextStyle({ ...options, align }, this.spec),
      { x: originX, y: 0 }
    );
    this.text.setFixedSize(Math.max(1, this.bounds.w - padding * 2), Math.max(1, this.bounds.h - padding * 2));
    if (options.maxLines) {
      this.text.setMaxLines(options.maxLines);
    }
    this.addDebug();
  }

  setText(text: string): this {
    if (this.text.text !== text) {
      this.text.setText(text);
    }
    return this;
  }

  setState(state: Parameters<UiBaseComponent['setState']>[0]): this {
    super.setState(state);
    if (state === 'alert') {
      this.text.setColor('#ff6673');
    } else if (state === 'disabled' || state === 'locked') {
      this.text.setColor('#98a0c7');
    } else {
      this.text.setColor(String(this.text.style.color ?? COLORS.text));
    }
    return this;
  }
}
