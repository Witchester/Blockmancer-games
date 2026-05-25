import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { UiBaseComponent, UI_STATE_STYLES, type UiComponentOptions, type UiComponentState } from './UiBaseComponent';
import { UiChip } from './UiChip';
import { UiIconSlot } from './UiIconSlot';
import { UiSpriteSlot } from './UiSpriteSlot';
import { createUiTextStyle } from './UiTextLabel';

export type UiCardOptions = UiComponentOptions & {
  title?: string;
  body?: string;
  iconKey?: string;
  spriteKey?: string;
  chipText?: string;
  chipIconKey?: string;
  selected?: boolean;
  disabled?: boolean;
  locked?: boolean;
  onClick?: (card: UiCard) => void;
};

export class UiCard extends UiBaseComponent {
  readonly background: Phaser.GameObjects.Image;
  readonly frame: Phaser.GameObjects.Rectangle;
  readonly title?: Phaser.GameObjects.Text;
  readonly body?: Phaser.GameObjects.Text;
  readonly icon?: UiIconSlot;
  readonly sprite?: UiSpriteSlot;
  readonly chip?: UiChip;
  private readonly onClick?: (card: UiCard) => void;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiCardOptions = {}) {
    const state: UiComponentState = options.disabled ? 'disabled' : options.locked ? 'locked' : options.selected ? 'selected' : options.state ?? 'default';
    super(scene, spec, { ...options, state });
    this.onClick = options.onClick;
    const padding = Math.max(16, this.spec.safePadding);
    this.frame = scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h, COLORS.panelAlt, 0.35)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.accent, 0.35);
    this.root.add(this.frame);
    this.background = this.createSlotImage(this.resolveAssetKey(), 'ui', { fit: 'exact' });
    if (options.title) {
      this.title = this.createText(
        this.bounds.w / 2,
        padding,
        options.title,
        createUiTextStyle({ textStyle: 'sectionHeader', align: 'center', wordWrapWidth: this.bounds.w - padding * 2, outline: true }, this.spec),
        { x: 0.5, y: 0 }
      );
    }
    const artSize = Math.min(128, Math.max(56, this.bounds.w - padding * 2));
    if (options.iconKey) {
      this.icon = new UiIconSlot(scene, {
        ...this.spec,
        id: `${this.id}_icon`,
        type: 'iconSlot',
        assetKey: options.iconKey,
        fallbackAssetKey: 'asset_missing_icon',
        x: this.bounds.x + this.bounds.w / 2,
        y: this.bounds.y + padding + 112,
        w: artSize,
        h: artSize,
        anchor: 'center',
        fitMode: 'iconCenter',
        scaleMode: 'fitInteger',
        safePadding: 0,
        zIndex: this.spec.zIndex + 1,
        dynamicTextAllowed: false
      }, { debug: false, state });
      this.icon.root.setPosition(Math.round(this.bounds.w / 2 - artSize / 2), padding + 76);
      this.root.add(this.icon.root);
    } else if (options.spriteKey) {
      this.sprite = new UiSpriteSlot(scene, {
        ...this.spec,
        id: `${this.id}_sprite`,
        type: 'spriteSlot',
        assetKey: options.spriteKey,
        fallbackAssetKey: 'asset_missing',
        x: this.bounds.x + this.bounds.w / 2,
        y: this.bounds.y + padding + 160,
        w: artSize,
        h: artSize,
        anchor: 'bottomCenter',
        fitMode: 'spriteAnchor',
        scaleMode: 'fitInteger',
        safePadding: 0,
        zIndex: this.spec.zIndex + 1,
        dynamicTextAllowed: false
      }, { debug: false, state });
      this.sprite.root.setPosition(Math.round(this.bounds.w / 2 - artSize / 2), padding + 76);
      this.root.add(this.sprite.root);
    }
    if (options.chipText) {
      this.chip = new UiChip(scene, {
        ...this.spec,
        id: `${this.id}_chip`,
        type: 'panel',
        assetKey: 'ui_status_chip',
        fallbackAssetKey: 'ui_panel_default',
        x: this.bounds.x + this.bounds.w / 2,
        y: this.bounds.y + this.bounds.h - padding - 24,
        w: Math.min(this.bounds.w - padding * 2, 160),
        h: 44,
        anchor: 'center',
        fitMode: 'nineSlice',
        scaleMode: 'uiStretchNineSlice',
        safePadding: 8,
        zIndex: this.spec.zIndex + 2,
        dynamicTextAllowed: true
      }, { debug: false, text: options.chipText, iconKey: options.chipIconKey, state });
      this.chip.root.setPosition(Math.round(this.bounds.w / 2 - this.chip.getBounds().w / 2), this.bounds.h - padding - 44);
      this.root.add(this.chip.root);
    }
    if (options.body) {
      this.body = this.createText(
        padding,
        Math.round(this.bounds.h * 0.48),
        options.body,
        createUiTextStyle({ textStyle: 'body', align: 'left', wordWrapWidth: this.bounds.w - padding * 2 }, this.spec),
        { x: 0, y: 0 }
      );
      this.body.setMaxLines(8);
    }
    if (options.onClick) {
      const zone = this.createHitZone(88);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => {
        if (this.state === 'disabled' || this.state === 'locked') return;
        this.onClick?.(this);
      });
    }
    this.applyStateStyle();
    this.addDebug();
  }

  setState(state: UiComponentState): this {
    super.setState(state);
    this.applyStateStyle();
    this.icon?.setState(state);
    this.sprite?.setState(state);
    this.chip?.setState(state);
    return this;
  }

  private applyStateStyle(): void {
    this.background.clearTint();
    const style = UI_STATE_STYLES[this.state];
    if (style.tint) this.background.setTint(style.tint);
    this.frame.setStrokeStyle(this.state === 'selected' ? 4 : 2, style.strokeColor ?? COLORS.accent, this.state === 'default' ? 0.35 : 0.9);
    const textAlpha = this.state === 'disabled' || this.state === 'locked' ? 0.55 : 1;
    this.title?.setAlpha(textAlpha);
    this.body?.setAlpha(textAlpha);
  }
}
