import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { UiBaseComponent, type UiComponentOptions } from './UiBaseComponent';

export type UiSpriteSlotOptions = UiComponentOptions & {
  spriteKey?: string;
  flipX?: boolean;
  alpha?: number;
};

export class UiSpriteSlot extends UiBaseComponent {
  readonly sprite: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiSpriteSlotOptions = {}) {
    super(scene, spec, options);
    const kind = this.spec.id.includes('board_block') || this.spec.expectedSourceSize.w <= 48 ? 'block' : 'sprite';
    this.sprite = this.createSlotImage(options.spriteKey ?? this.resolveAssetKey(), kind, {
      fit: this.spec.fitMode === 'exact' ? 'exact' : 'contain',
      flipX: options.flipX,
      alpha: options.alpha
    });
    this.addDebug();
  }
}
