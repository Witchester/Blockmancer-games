import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { UiBaseComponent, UI_STATE_STYLES, type UiComponentOptions } from './UiBaseComponent';

export type UiPanelOptions = UiComponentOptions & {
  fillColor?: number;
  fillAlpha?: number;
  strokeColor?: number;
  strokeAlpha?: number;
};

export class UiPanel extends UiBaseComponent {
  readonly image: Phaser.GameObjects.Image;
  readonly fallbackFrame: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiPanelOptions = {}) {
    super(scene, spec, options);
    this.fallbackFrame = scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h, options.fillColor ?? COLORS.panelAlt, options.fillAlpha ?? 0.25)
      .setOrigin(0, 0)
      .setStrokeStyle(2, options.strokeColor ?? COLORS.accent, options.strokeAlpha ?? 0.35);
    this.root.add(this.fallbackFrame);
    this.image = this.createSlotImage(this.resolveAssetKey(), 'ui', {
      fit: this.spec.fitMode === 'contain' ? 'contain' : 'exact'
    });
    this.applyStateStyle();
    this.addDebug();
  }

  setState(state: Parameters<UiBaseComponent['setState']>[0]): this {
    super.setState(state);
    this.applyStateStyle();
    return this;
  }

  private applyStateStyle(): void {
    this.image.clearTint();
    const style = UI_STATE_STYLES[this.state];
    if (style.tint) {
      this.image.setTint(style.tint);
    }
    this.fallbackFrame.setStrokeStyle(2, style.strokeColor ?? COLORS.accent, this.state === 'default' ? 0.35 : 0.8);
  }
}
