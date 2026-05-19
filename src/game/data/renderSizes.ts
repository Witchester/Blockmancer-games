import Phaser from 'phaser';
import { getAssetDisplayRule, type AssetDisplayCategory } from './asset-display-rules';

export const BOARD_CELL_SIZE = 24;
export const BOARD_BLOCK_SOURCE_SIZE = 24;
export const BOARD_PREVIEW_CELL_SIZE = 16;
export const BOARD_MINI_CELL_SIZE = 12;

export const ICON_SIZE = 48;
export const ITEM_ICON_SIZE = ICON_SIZE;
export const RELIC_ICON_SIZE = ICON_SIZE;
export const UPGRADE_ICON_SIZE = ICON_SIZE;
export const WEAPON_ICON_SIZE = ICON_SIZE;
export const BOARD_BLOCK_ICON_SIZE = ICON_SIZE;
export const STATUS_ICON_SIZE = 32;
export const MAP_NODE_ICON_SIZE = 32;
export const ROUTE_BADGE_ICON_SIZE = 32;

export const HERO_BATTLE_BOX_SIZE = 72;
export const MONSTER_BATTLE_BOX_SIZE = 64;
export const BOSS_BATTLE_BOX_SIZE = 96;
export const HERO_SELECT_SPRITE_BOX_SIZE = 96;
export const DIALOGUE_PORTRAIT_SIZE = 128;
export const BOSS_INTRO_PORTRAIT_SIZE = 160;

export const MOBILE_CONTROL_BUTTON_SIZE = 56;
export const UI_BUTTON_HEIGHT = 48;
export const UI_CARD_ICON_SIZE = ICON_SIZE;

export const BOARD_VFX_CELL_SIZE = BOARD_CELL_SIZE;
export const SPELL_VFX_BOX_SIZE = ICON_SIZE;
export const ITEM_VFX_BOX_SIZE = ICON_SIZE;
export const COMBAT_HIT_VFX_BOX_SIZE = ICON_SIZE;
export const BOSS_VFX_BOX_SIZE = BOSS_BATTLE_BOX_SIZE;

type DisplaySizedGameObject = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
type DisplaySizedOrRectGameObject = Phaser.GameObjects.Rectangle | DisplaySizedGameObject;

function sizeByCategory<T extends DisplaySizedOrRectGameObject>(gameObject: T, category: AssetDisplayCategory): T {
  const rule = getAssetDisplayRule(category);
  const width = rule.renderWidth ?? rule.maxRenderWidth;
  const height = rule.renderHeight ?? rule.maxRenderHeight;
  if (width && height) {
    gameObject.setDisplaySize(width, height);
  }
  return gameObject;
}

export function setBoardBlockDisplaySize<T extends DisplaySizedGameObject>(sprite: T): T {
  return sizeByCategory(sprite, 'boardBlock');
}

export function setBoardPreviewBlockDisplaySize<T extends Phaser.GameObjects.Rectangle | DisplaySizedGameObject>(gameObject: T): T {
  return sizeByCategory(gameObject, 'boardPreviewBlock');
}

export function setBoardVfxDisplaySize<T extends DisplaySizedGameObject>(sprite: T): T {
  return sizeByCategory(sprite, 'boardCellVfx');
}

export function setIconDisplaySize<T extends DisplaySizedGameObject>(sprite: T, size = ICON_SIZE): T {
  if (size === ICON_SIZE) {
    const rule = getAssetDisplayRule('uiIcon');
    return setSquareDisplaySize(sprite, Math.min(size, rule.maxRenderWidth ?? size));
  }
  return setSquareDisplaySize(sprite, size);
}

export function fitSpriteToBox<T extends DisplaySizedGameObject>(sprite: T, maxWidth: number, maxHeight = maxWidth): T {
  const sourceWidth = sprite.width || maxWidth;
  const sourceHeight = sprite.height || maxHeight;
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
  sprite.setDisplaySize(Math.max(1, Math.round(sourceWidth * scale)), Math.max(1, Math.round(sourceHeight * scale)));
  return sprite;
}

function setSquareDisplaySize<T extends Phaser.GameObjects.Rectangle | DisplaySizedGameObject>(gameObject: T, size: number): T {
  gameObject.setDisplaySize(size, size);
  return gameObject;
}
