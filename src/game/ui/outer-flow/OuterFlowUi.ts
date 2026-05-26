import Phaser from 'phaser';
import type { BlockmancerGame } from '../../BlockmancerGame';
import type { UiComponentSpec } from '../../types/ui-layout';

export function createOuterUiSpec(
  id: string,
  type: string,
  assetKey: string,
  fallbackAssetKey: string,
  x: number,
  y: number,
  w: number,
  h: number,
  anchor: UiComponentSpec['anchor'],
  zIndex: number
): UiComponentSpec {
  const isIcon = type === 'iconSlot';
  const isSprite = type === 'spriteSlot' || type === 'portraitSlot';
  const isBackground = type === 'backgroundLayer';
  return {
    id,
    type: isSprite ? 'spriteSlot' : type,
    assetKey,
    fallbackAssetKey,
    canonicalFolder: isBackground
      ? 'public/assets/stages/global-scenes/'
      : isSprite
        ? 'public/assets/portraits/heroes/'
        : isIcon
          ? 'public/assets/icons/'
          : 'public/assets/ui/',
    expectedSourceSize: { w, h },
    runtimeRenderSize: { w, h },
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
    anchor,
    fitMode: isIcon ? 'iconCenter' : isSprite ? 'contain' : isBackground ? 'exact' : 'nineSlice',
    scaleMode: isIcon || isSprite ? 'fitInteger' : isBackground ? 'backgroundExact' : 'uiStretchNineSlice',
    safePadding: isIcon || isSprite || isBackground ? 0 : 24,
    zIndex,
    dynamicTextAllowed: !(isIcon || isSprite || isBackground),
    pixelPerfect: {
      integerCoordinates: true,
      allowFractionalScale: false,
      filtering: 'nearest',
      antiAliasing: false,
      roundPixels: true
    }
  };
}

export function addOuterBackground(scene: Phaser.Scene, assetKey: string, alpha = 0.34): void {
  const game = scene.game as BlockmancerGame;
  game.assetSystem
    .createImageByAssetKey(scene, assetKey, 'stageBackground', scene.scale.width / 2, scene.scale.height / 2, { kind: 'background' })
    .setDisplaySize(scene.scale.width, scene.scale.height)
    .setAlpha(alpha);
}
