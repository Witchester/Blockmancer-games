import Phaser from 'phaser';

export function isCompactLayout(scene: Phaser.Scene): boolean {
  return scene.scale.parentSize.width <= 900 || scene.scale.parentSize.height <= 720;
}
