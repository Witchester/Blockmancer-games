import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { UiBaseComponent, UI_STATE_STYLES, type UiComponentOptions, type UiComponentState } from './UiBaseComponent';
import { UiIconSlot } from './UiIconSlot';
import { createUiTextStyle } from './UiTextLabel';

export type UiChipOptions = UiComponentOptions & {
  text?: string;
  iconKey?: string;
  selected?: boolean;
  disabled?: boolean;
  locked?: boolean;
};

export class UiChip extends UiBaseComponent {
  readonly background: Phaser.GameObjects.Image;
  readonly frame: Phaser.GameObjects.Rectangle;
  readonly label: Phaser.GameObjects.Text;
  readonly icon?: UiIconSlot;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiChipOptions = {}) {
    const state: UiComponentState = options.disabled ? 'disabled' : options.locked ? 'locked' : options.selected ? 'selected' : options.state ?? 'default';
    super(scene, spec, { ...options, state });
    this.frame = scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h, COLORS.panelAlt, 0.35)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.accent, 0.35);
    this.root.add(this.frame);
    this.background = this.createSlotImage(this.resolveAssetKey(), 'ui', { fit: 'exact' });
    const leftPad = options.iconKey ? Math.min(42, this.bounds.h) : this.spec.safePadding;
    if (options.iconKey) {
      const size = Math.max(20, Math.min(this.bounds.h - 8, 36));
      this.icon = new UiIconSlot(scene, {
        ...this.spec,
        id: `${this.id}_icon`,
        type: 'iconSlot',
        assetKey: options.iconKey,
        fallbackAssetKey: 'asset_missing_icon',
        x: this.bounds.x + 8 + size / 2,
        y: this.bounds.y + this.bounds.h / 2,
        w: size,
        h: size,
        anchor: 'center',
        fitMode: 'iconCenter',
        scaleMode: 'fitInteger',
        safePadding: 0,
        zIndex: this.spec.zIndex + 1,
        dynamicTextAllowed: false
      }, { debug: false, state });
      this.icon.root.setPosition(8, Math.round(this.bounds.h / 2 - size / 2));
      this.root.add(this.icon.root);
    }
    this.label = this.createText(
      Math.round(leftPad),
      Math.round(this.bounds.h / 2),
      options.text ?? '',
      createUiTextStyle({ textStyle: 'micro', align: 'left', wordWrapWidth: Math.max(20, this.bounds.w - leftPad - 8), outline: true }, this.spec),
      { x: 0, y: 0.5 }
    );
    this.applyStateStyle();
    this.addDebug();
  }

  setText(text: string): this {
    this.label.setText(text);
    return this;
  }

  setState(state: UiComponentState): this {
    super.setState(state);
    this.applyStateStyle();
    this.icon?.setState(state);
    return this;
  }

  private applyStateStyle(): void {
    this.background.clearTint();
    const style = UI_STATE_STYLES[this.state];
    if (style.tint) this.background.setTint(style.tint);
    this.frame.setStrokeStyle(this.state === 'selected' || this.state === 'alert' ? 3 : 2, style.strokeColor ?? COLORS.accent, this.state === 'default' ? 0.35 : 0.9);
    this.label.setAlpha(this.state === 'disabled' || this.state === 'locked' ? 0.55 : 1);
  }
}
