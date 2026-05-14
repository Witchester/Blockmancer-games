import Phaser from 'phaser';
import { FONT_FAMILY } from '../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  async create(): Promise<void> {
    if ('fonts' in document) {
      await Promise.race([
        document.fonts.load(`16px ${FONT_FAMILY}`),
        new Promise((resolve) => window.setTimeout(resolve, 1200))
      ]);
    }

    this.scene.start('MainMenuScene');
  }
}
