import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { roundPixel } from '../PixelPerfect';
import { UiBaseComponent, UI_STATE_STYLES, type UiComponentOptions, type UiComponentState } from './UiBaseComponent';
import { createUiTextStyle } from './UiTextLabel';

export type UiIconSlotOptions = UiComponentOptions & {
  iconKey?: string;
  quantityText?: string;
  selected?: boolean;
  locked?: boolean;
  disabled?: boolean;
};

export class UiIconSlot extends UiBaseComponent {
  readonly icon: Phaser.GameObjects.Image;
  readonly outline: Phaser.GameObjects.Rectangle;
  readonly overlay: Phaser.GameObjects.Rectangle;
  readonly quantity?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiIconSlotOptions = {}) {
    const state: UiComponentState = options.disabled ? 'disabled' : options.locked ? 'locked' : options.selected ? 'selected' : options.state ?? 'default';
    super(scene, spec, { ...options, state });
    this.outline = scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.accent, 0.25)
      .setFillStyle(0x000000, 0);
    this.root.add(this.outline);
    this.icon = this.createSlotImage(options.iconKey ?? this.resolveAssetKey(), 'icon', { fit: 'contain' });
    this.overlay = scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h, 0x05060a, 0)
      .setOrigin(0, 0);
    this.root.add(this.overlay);
    if (options.quantityText) {
      this.quantity = this.createText(
        this.bounds.w - 6,
        this.bounds.h - 6,
        options.quantityText,
        createUiTextStyle({ textStyle: 'micro', align: 'right', outline: true }, this.spec),
        { x: 1, y: 1 }
      );
    }
    this.applyStateStyle();
    this.addDebug();
  }

  setQuantity(text: string): this {
    this.quantity?.setText(text);
    return this;
  }

  setState(state: UiComponentState): this {
    super.setState(state);
    this.applyStateStyle();
    return this;
  }

  private applyStateStyle(): void {
    this.icon.clearTint();
    const style = UI_STATE_STYLES[this.state];
    if (style.tint) this.icon.setTint(style.tint);
    this.outline.setStrokeStyle(roundPixel(this.state === 'selected' || this.state === 'alert' ? 4 : 2), style.strokeColor ?? COLORS.accent, this.state === 'default' ? 0.25 : 0.9);
    this.overlay.setFillStyle(0x05060a, this.state === 'disabled' || this.state === 'locked' ? 0.35 : 0);
  }
}
