import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { roundPixel } from '../PixelPerfect';
import { UiBaseComponent, type UiComponentOptions } from './UiBaseComponent';
import { createUiTextStyle } from './UiTextLabel';

export type UiMeterOptions = UiComponentOptions & {
  label?: string;
  current?: number;
  min?: number;
  max?: number;
  fillColor?: number;
  trackColor?: number;
  showValueText?: boolean;
  fillInset?: number;
};

export class UiMeter extends UiBaseComponent {
  readonly frame: Phaser.GameObjects.Image;
  readonly track: Phaser.GameObjects.Rectangle;
  readonly fill: Phaser.GameObjects.Rectangle;
  readonly labelText?: Phaser.GameObjects.Text;
  readonly valueText?: Phaser.GameObjects.Text;
  private readonly fillInset: number;
  private current = 0;
  private min = 0;
  private max = 1;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiMeterOptions = {}) {
    super(scene, spec, options);
    this.fillInset = roundPixel(options.fillInset ?? Math.max(4, this.spec.safePadding));
    this.track = scene.add
      .rectangle(this.fillInset, this.fillInset, Math.max(1, this.bounds.w - this.fillInset * 2), Math.max(1, this.bounds.h - this.fillInset * 2), options.trackColor ?? 0x252c49, 1)
      .setOrigin(0, 0);
    this.fill = scene.add
      .rectangle(this.fillInset, this.fillInset, 1, Math.max(1, this.bounds.h - this.fillInset * 2), options.fillColor ?? COLORS.success, 1)
      .setOrigin(0, 0);
    this.root.add([this.track, this.fill]);
    this.frame = this.createSlotImage(this.resolveAssetKey(), 'ui', { fit: 'exact', alpha: 0.95 });
    if (options.label) {
      this.labelText = this.createText(0, -30, options.label, createUiTextStyle({ textStyle: 'hudLabel', align: 'left' }, this.spec));
    }
    if (options.showValueText ?? true) {
      this.valueText = this.createText(
        this.bounds.w / 2,
        this.bounds.h / 2,
        '',
        createUiTextStyle({ textStyle: 'number', align: 'center', outline: true }, this.spec),
        { x: 0.5, y: 0.5 }
      );
    }
    this.setValue(options.current ?? 0, options.max ?? 1, options.min ?? 0);
    this.addDebug();
  }

  setValue(current: number, max = this.max, min = this.min): this {
    this.current = current;
    this.min = min;
    this.max = Math.max(min + 1, max);
    const ratio = Phaser.Math.Clamp((current - min) / (this.max - min), 0, 1);
    const fillWidth = roundPixel(Math.max(0, this.bounds.w - this.fillInset * 2) * ratio);
    this.fill.setDisplaySize(fillWidth, Math.max(1, this.bounds.h - this.fillInset * 2));
    this.valueText?.setText(`${Math.max(min, Math.round(current))}/${Math.round(this.max)}`);
    return this;
  }

  setLabel(text: string): this {
    this.labelText?.setText(text);
    return this;
  }
}
