import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { FONT_FAMILY } from '../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    (this.game as BlockmancerGame).assetSystem.preload(this);
  }

  async create(): Promise<void> {
    (this.game as BlockmancerGame).assetSystem.ensureFallbackTextures(this);
    (this.game as BlockmancerGame).assetSystem.registerGameAnimations(this);

    if ('fonts' in document) {
      await Promise.race([
        document.fonts.load(`16px ${FONT_FAMILY}`),
        new Promise((resolve) => window.setTimeout(resolve, 1200))
      ]);
    }

    this.scene.start('MainMenuScene');
  }
}
