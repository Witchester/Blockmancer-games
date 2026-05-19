export type AssetDisplayCategory =
  | 'boardBlock'
  | 'boardBlockIcon'
  | 'boardPreviewBlock'
  | 'heroPoseSheet'
  | 'heroExtendedPoseSheet'
  | 'heroSprite'
  | 'monsterSprite'
  | 'bossSprite'
  | 'monsterPoseSheet'
  | 'eliteMonsterPoseSheet'
  | 'bossPoseSheet'
  | 'bossIntroPoseSheet'
  | 'portrait'
  | 'itemIcon'
  | 'spellIcon'
  | 'relicIcon'
  | 'upgradeIcon'
  | 'weaponIcon'
  | 'uiIcon'
  | 'mapIcon'
  | 'roomIcon'
  | 'routeIcon'
  | 'statusIcon'
  | 'oopsieIcon'
  | 'hazardIcon'
  | 'routeBadgeIcon'
  | 'rewardThumbnail'
  | 'shopThumbnail'
  | 'vfxBoardCell'
  | 'vfxCombatSmall'
  | 'vfxCombatLarge'
  | 'vfx'
  | 'boardCellVfx'
  | 'uiAnimation'
  | 'stageBackground';

export type AssetDisplayRule = {
  sourceWidth?: number;
  sourceHeight?: number;
  renderWidth?: number;
  renderHeight?: number;
  maxRenderWidth?: number;
  maxRenderHeight?: number;
  preserveBoardCellSize?: boolean;
  alignCenter?: boolean;
  alignToBoardCellCenter?: boolean;
  pixelArt: boolean;
  renderMode?: 'cover' | 'contain';
  sheetWidth?: number;
  sheetHeight?: number;
  frameWidth?: number;
  frameHeight?: number;
  columns?: number;
  rows?: number;
  originX?: number;
  originY?: number;
  preserveAspectRatio?: boolean;
};

export const ASSET_DISPLAY_RULES: Record<AssetDisplayCategory, AssetDisplayRule> = {
  boardBlock: {
    sourceWidth: 24,
    sourceHeight: 24,
    renderWidth: 24,
    renderHeight: 24,
    preserveBoardCellSize: true,
    pixelArt: true
  },
  boardBlockIcon: {
    sourceWidth: 48,
    sourceHeight: 48,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    pixelArt: true
  },
  boardPreviewBlock: {
    sourceWidth: 24,
    sourceHeight: 24,
    renderWidth: 16,
    renderHeight: 16,
    pixelArt: true
  },
  heroPoseSheet: {
    sheetWidth: 1254,
    sheetHeight: 1254,
    frameWidth: 627,
    frameHeight: 627,
    columns: 2,
    rows: 2,
    maxRenderWidth: 96,
    maxRenderHeight: 96,
    originX: 0.5,
    originY: 1,
    preserveAspectRatio: true,
    pixelArt: true
  },
  heroExtendedPoseSheet: {
    sheetWidth: 1254,
    sheetHeight: 1254,
    frameWidth: 627,
    frameHeight: 627,
    columns: 2,
    rows: 2,
    maxRenderWidth: 180,
    maxRenderHeight: 180,
    originX: 0.5,
    originY: 1,
    preserveAspectRatio: true,
    pixelArt: true
  },
  heroSprite: {
    sourceWidth: 192,
    sourceHeight: 192,
    maxRenderWidth: 72,
    maxRenderHeight: 72,
    pixelArt: true
  },
  monsterSprite: {
    sourceWidth: 192,
    sourceHeight: 192,
    maxRenderWidth: 72,
    maxRenderHeight: 72,
    pixelArt: true
  },
  monsterPoseSheet: {
    sheetWidth: 1254,
    sheetHeight: 1254,
    frameWidth: 627,
    frameHeight: 627,
    columns: 2,
    rows: 2,
    maxRenderWidth: 96,
    maxRenderHeight: 96,
    originX: 0.5,
    originY: 1,
    preserveAspectRatio: true,
    pixelArt: true
  },
  eliteMonsterPoseSheet: {
    sheetWidth: 1254,
    sheetHeight: 1254,
    frameWidth: 627,
    frameHeight: 627,
    columns: 2,
    rows: 2,
    maxRenderWidth: 112,
    maxRenderHeight: 112,
    originX: 0.5,
    originY: 1,
    preserveAspectRatio: true,
    pixelArt: true
  },
  bossSprite: {
    sourceWidth: 192,
    sourceHeight: 192,
    maxRenderWidth: 120,
    maxRenderHeight: 120,
    pixelArt: true
  },
  bossPoseSheet: {
    sheetWidth: 1254,
    sheetHeight: 1254,
    frameWidth: 627,
    frameHeight: 627,
    columns: 2,
    rows: 2,
    maxRenderWidth: 144,
    maxRenderHeight: 144,
    originX: 0.5,
    originY: 1,
    preserveAspectRatio: true,
    pixelArt: true
  },
  bossIntroPoseSheet: {
    sheetWidth: 1254,
    sheetHeight: 1254,
    frameWidth: 627,
    frameHeight: 627,
    columns: 2,
    rows: 2,
    maxRenderWidth: 180,
    maxRenderHeight: 180,
    originX: 0.5,
    originY: 1,
    preserveAspectRatio: true,
    pixelArt: true
  },
  portrait: {
    sourceWidth: 192,
    sourceHeight: 192,
    maxRenderWidth: 128,
    maxRenderHeight: 128,
    pixelArt: true
  },
  itemIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  spellIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  relicIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  upgradeIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  weaponIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  uiIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  mapIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 32,
    maxRenderHeight: 32,
    preserveAspectRatio: true,
    pixelArt: true
  },
  roomIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  routeIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 56,
    maxRenderHeight: 56,
    preserveAspectRatio: true,
    pixelArt: true
  },
  statusIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 32,
    maxRenderHeight: 32,
    preserveAspectRatio: true,
    pixelArt: true
  },
  oopsieIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 32,
    maxRenderHeight: 32,
    preserveAspectRatio: true,
    pixelArt: true
  },
  hazardIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    preserveAspectRatio: true,
    pixelArt: true
  },
  routeBadgeIcon: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 32,
    maxRenderHeight: 32,
    preserveAspectRatio: true,
    pixelArt: true
  },
  rewardThumbnail: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 96,
    maxRenderHeight: 96,
    preserveAspectRatio: true,
    pixelArt: true
  },
  shopThumbnail: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 96,
    maxRenderHeight: 96,
    preserveAspectRatio: true,
    pixelArt: true
  },
  vfxBoardCell: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 48,
    maxRenderHeight: 48,
    alignToBoardCellCenter: true,
    preserveAspectRatio: true,
    pixelArt: true
  },
  vfxCombatSmall: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 96,
    maxRenderHeight: 96,
    alignCenter: true,
    preserveAspectRatio: true,
    pixelArt: true
  },
  vfxCombatLarge: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 180,
    maxRenderHeight: 180,
    alignCenter: true,
    preserveAspectRatio: true,
    pixelArt: true
  },
  uiAnimation: {
    sourceWidth: 627,
    sourceHeight: 627,
    maxRenderWidth: 64,
    maxRenderHeight: 64,
    preserveAspectRatio: true,
    pixelArt: true
  },
  vfx: {
    sourceWidth: 192,
    sourceHeight: 192,
    maxRenderWidth: 96,
    maxRenderHeight: 96,
    alignCenter: true,
    pixelArt: true
  },
  boardCellVfx: {
    sourceWidth: 192,
    sourceHeight: 192,
    maxRenderWidth: 24,
    maxRenderHeight: 24,
    alignToBoardCellCenter: true,
    pixelArt: true
  },
  stageBackground: {
    pixelArt: true,
    renderMode: 'cover'
  }
};

export function getAssetDisplayRule(category: AssetDisplayCategory): AssetDisplayRule {
  return ASSET_DISPLAY_RULES[category];
}
