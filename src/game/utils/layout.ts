import Phaser from 'phaser';

export type PortraitLayout = {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  margin: number;
  contentWidth: number;
  topHeight: number;
  middleHeight: number;
  bottomHeight: number;
  safeTop: number;
  safeBottom: number;
};

export function isCompactLayout(scene: Phaser.Scene): boolean {
  return scene.scale.parentSize.width <= 900 || scene.scale.parentSize.height <= 720;
}

export function getPortraitLayout(scene: Phaser.Scene): PortraitLayout {
  const width = scene.scale.width;
  const height = scene.scale.height;
  const margin = width <= 720 ? 20 : 28;
  const safeTop = 18;
  const safeBottom = 18;
  const topHeight = Math.round(height * 0.2);
  const bottomHeight = Math.round(height * 0.2);

  return {
    width,
    height,
    centerX: width / 2,
    centerY: height / 2,
    margin,
    contentWidth: width - margin * 2,
    topHeight,
    middleHeight: height - topHeight - bottomHeight,
    bottomHeight,
    safeTop,
    safeBottom
  };
}

export function portraitFont(scene: Phaser.Scene, compactSize: number, roomySize = compactSize + 2): string {
  return `${isCompactLayout(scene) ? compactSize : roomySize}px`;
}
