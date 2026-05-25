import type { UiAnchor, UiAssetSize, UiCanvasSpec, UiComponentSpec } from '../types/ui-layout';

export type UiRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function roundPixel(value: number): number {
  return Math.round(value);
}

export function roundRect<T extends UiRect>(rect: T): T {
  return {
    ...rect,
    x: roundPixel(rect.x),
    y: roundPixel(rect.y),
    w: roundPixel(rect.w),
    h: roundPixel(rect.h)
  };
}

export function assertIntegerRect(rect: UiRect): boolean {
  return Number.isInteger(rect.x) && Number.isInteger(rect.y) && Number.isInteger(rect.w) && Number.isInteger(rect.h);
}

export function clampToCanvas<T extends UiRect>(rect: T, canvas: UiCanvasSpec): T {
  const x = Math.max(0, Math.min(rect.x, canvas.width));
  const y = Math.max(0, Math.min(rect.y, canvas.height));
  const right = Math.max(x, Math.min(rect.x + rect.w, canvas.width));
  const bottom = Math.max(y, Math.min(rect.y + rect.h, canvas.height));
  return {
    ...rect,
    x: roundPixel(x),
    y: roundPixel(y),
    w: roundPixel(right - x),
    h: roundPixel(bottom - y)
  };
}

export function computeAnchorOffset(anchor: UiAnchor, w: number, h: number): { x: number; y: number } {
  if (anchor === 'center' || anchor === 'vfxCenter') {
    return { x: roundPixel(w / 2), y: roundPixel(h / 2) };
  }
  if (anchor === 'bottomCenter') {
    return { x: roundPixel(w / 2), y: roundPixel(h) };
  }
  return { x: 0, y: 0 };
}

export function getIntegerScale(sourceSize: UiAssetSize, targetSize: UiAssetSize): number {
  if (sourceSize.w <= 0 || sourceSize.h <= 0 || targetSize.w <= 0 || targetSize.h <= 0) {
    return 1;
  }
  return Math.max(1, Math.floor(Math.min(targetSize.w / sourceSize.w, targetSize.h / sourceSize.h)));
}

export function validateNoFractionalCoordinates(component: UiComponentSpec): boolean {
  return assertIntegerRect(component);
}

export function validateRuntimeRenderSize(component: UiComponentSpec): boolean {
  return component.runtimeRenderSize.w === component.w && component.runtimeRenderSize.h === component.h;
}

export function validatePixelPerfectFlags(component: UiComponentSpec): boolean {
  const pixelPerfect = component.pixelPerfect;
  return Boolean(
    pixelPerfect &&
      pixelPerfect.integerCoordinates === true &&
      pixelPerfect.antiAliasing === false &&
      pixelPerfect.roundPixels === true &&
      (pixelPerfect.filtering === 'nearest' || pixelPerfect.filtering === 'pixelated')
  );
}

export function normalizePixelPerfectComponent(component: UiComponentSpec): UiComponentSpec {
  return {
    ...component,
    ...roundRect(component),
    safePadding: roundPixel(component.safePadding),
    zIndex: roundPixel(component.zIndex),
    runtimeRenderSize: {
      w: roundPixel(component.runtimeRenderSize.w),
      h: roundPixel(component.runtimeRenderSize.h)
    },
    expectedSourceSize: {
      w: roundPixel(component.expectedSourceSize.w),
      h: roundPixel(component.expectedSourceSize.h)
    },
    pixelPerfect: {
      ...component.pixelPerfect,
      integerCoordinates: true,
      antiAliasing: false,
      roundPixels: true,
      filtering: component.pixelPerfect.filtering === 'pixelated' ? 'pixelated' : 'nearest'
    }
  };
}
