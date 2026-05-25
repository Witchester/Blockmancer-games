export const PORTRAIT_FRAME_WIDTH = 1080;
export const PORTRAIT_FRAME_HEIGHT = 1920;

export type PortraitFrame = {
  frameX: number;
  frameY: number;
  scale: number;
  width: number;
  height: number;
};

export function computePortraitFrame(
  viewportWidth: number,
  viewportHeight: number,
  designWidth = PORTRAIT_FRAME_WIDTH,
  designHeight = PORTRAIT_FRAME_HEIGHT
): PortraitFrame {
  const safeViewportWidth = Math.max(1, Math.round(viewportWidth));
  const safeViewportHeight = Math.max(1, Math.round(viewportHeight));
  const scale = Math.min(safeViewportWidth / designWidth, safeViewportHeight / designHeight);
  const width = Math.round(designWidth * scale);
  const height = Math.round(designHeight * scale);

  return {
    frameX: Math.round((safeViewportWidth - width) / 2),
    frameY: Math.round((safeViewportHeight - height) / 2),
    scale,
    width,
    height
  };
}
