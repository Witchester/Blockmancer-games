import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { UiBaseComponent, UI_STATE_STYLES, type UiComponentOptions, type UiComponentState } from './UiBaseComponent';
import { UiIconSlot } from './UiIconSlot';
import { createUiTextStyle } from './UiTextLabel';

export type UiButtonOptions = UiComponentOptions & {
  label?: string;
  iconKey?: string;
  onClick?: (button: UiButton) => void;
  minTouchSize?: number;
  disabled?: boolean;
  locked?: boolean;
  selected?: boolean;
};

export class UiButton extends UiBaseComponent {
  readonly background: Phaser.GameObjects.Image;
  readonly fallbackFrame: Phaser.GameObjects.Rectangle;
  readonly label?: Phaser.GameObjects.Text;
  readonly icon?: UiIconSlot;
  private readonly onClick?: (button: UiButton) => void;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiButtonOptions = {}) {
    const state: UiComponentState = options.disabled ? 'disabled' : options.locked ? 'locked' : options.selected ? 'selected' : options.state ?? 'default';
    super(scene, spec, { ...options, state });
    this.onClick = options.onClick;
    this.fallbackFrame = scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h, COLORS.panelAlt, 0.35)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.accent, 0.55);
    this.root.add(this.fallbackFrame);
    this.background = this.createSlotImage(this.resolveAssetKey(), 'ui', { fit: 'exact', hideMissingUi: true });
    if (options.iconKey) {
      const iconSpec = {
        ...this.spec,
        id: `${this.id}_icon`,
        type: 'iconSlot',
        assetKey: options.iconKey,
        fallbackAssetKey: 'asset_missing_icon',
        x: this.bounds.x + Math.min(52, this.bounds.w / 2),
        y: this.bounds.y + this.bounds.h / 2,
        w: Math.min(56, this.bounds.w - 12),
        h: Math.min(56, this.bounds.h - 12),
        anchor: 'center' as const,
        fitMode: 'iconCenter' as const,
        scaleMode: 'fitInteger' as const,
        safePadding: 0,
        zIndex: this.spec.zIndex + 1,
        dynamicTextAllowed: false
      };
      this.icon = new UiIconSlot(scene, iconSpec, { debug: false, state });
      this.icon.root.setPosition(Math.min(24, this.bounds.w / 4), this.bounds.h / 2 - this.icon.getBounds().h / 2);
      this.root.add(this.icon.root);
    }
    if (options.label) {
      const x = this.icon ? Math.round(this.bounds.w / 2 + 14) : Math.round(this.bounds.w / 2);
      const wrapWidth = Math.max(20, this.bounds.w - (this.icon ? 76 : 24));
      this.label = this.createText(
        x,
        Math.round(this.bounds.h / 2),
        options.label,
        createUiTextStyle({ textStyle: 'button', align: 'center', wordWrapWidth: wrapWidth, outline: true }, this.spec),
        { x: 0.5, y: 0.5 }
      );
    }
    const zone = this.createHitZone(options.minTouchSize ?? 88);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      if (this.state === 'default') this.setState('selected');
    });
    zone.on('pointerout', () => {
      if (this.state === 'selected') this.setState('default');
    });
    zone.on('pointerdown', () => {
      if (this.state !== 'disabled' && this.state !== 'locked') this.setState('pressed');
    });
    zone.on('pointerup', () => {
      if (this.state === 'disabled' || this.state === 'locked') return;
      this.setState(options.selected ? 'selected' : 'default');
      this.game.audioSystem.play('button_tap', scene);
      this.onClick?.(this);
    });
    this.applyStateStyle();
    this.addDebug();
  }

  setText(text: string): this {
    this.label?.setText(text);
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
    this.fallbackFrame.setStrokeStyle(this.state === 'selected' || this.state === 'pressed' ? 4 : 2, style.strokeColor ?? COLORS.accent, this.state === 'default' ? 0.55 : 0.95);
    this.label?.setAlpha(this.state === 'disabled' || this.state === 'locked' ? 0.55 : 1);
  }
}
