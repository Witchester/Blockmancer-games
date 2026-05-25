import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { UiBaseComponent, type UiComponentOptions } from './UiBaseComponent';

export type UiModalBackdropOptions = UiComponentOptions & {
  color?: number;
  backdropAlpha?: number;
  blockInput?: boolean;
};

export class UiModalBackdrop extends UiBaseComponent {
  readonly backdrop: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiModalBackdropOptions = {}) {
    super(scene, { ...spec, x: 0, y: 0, w: 1080, h: 1920, anchor: 'topLeft' }, options);
    this.backdrop = scene.add
      .rectangle(0, 0, 1080, 1920, options.color ?? 0x05060a, options.backdropAlpha ?? 0.62)
      .setOrigin(0, 0);
    this.root.add(this.backdrop);
    if (options.blockInput ?? true) {
      const zone = this.createHitZone(0);
      zone.setSize(1080, 1920);
      zone.setInteractive();
    }
    this.addDebug();
  }
}
