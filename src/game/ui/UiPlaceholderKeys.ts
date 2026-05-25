import type { UiComponentSpec } from '../types/ui-layout';

export type UiPlaceholderCategory =
  | 'generic'
  | 'panel'
  | 'button'
  | 'icon'
  | 'portrait'
  | 'sprite'
  | 'background'
  | 'battleBackground'
  | 'puzzleBackground'
  | 'fullBackground'
  | 'meter'
  | 'card'
  | 'vfx'
  | 'boardBlock';

export const UI_PLACEHOLDER_KEYS: Record<UiPlaceholderCategory, readonly string[]> = {
  generic: ['asset_missing', 'placeholder_sprite'],
  panel: ['ui_panel_default', 'missing_ui', 'asset_missing'],
  button: ['ui_button_disabled', 'ui_button_primary', 'ui_button_default', 'missing_ui', 'asset_missing'],
  icon: ['asset_missing_icon', 'placeholder_icon', 'missing_item_icon', 'asset_missing'],
  portrait: ['missing_portrait', 'placeholder_portrait', 'asset_missing'],
  sprite: ['asset_missing', 'placeholder_sprite', 'missing_hero', 'missing_monster'],
  background: ['asset_missing_background', 'placeholder_background', 'asset_missing'],
  battleBackground: ['asset_missing_background', 'placeholder_battle_background', 'placeholder_background', 'asset_missing'],
  puzzleBackground: ['asset_missing_background', 'placeholder_puzzle_background', 'placeholder_background', 'asset_missing'],
  fullBackground: ['asset_missing_background', 'placeholder_background', 'asset_missing'],
  meter: ['ui_meter_default', 'ui_panel_default', 'missing_ui', 'asset_missing'],
  card: ['ui_panel_default', 'ui_card_default', 'missing_ui', 'asset_missing'],
  vfx: ['missing_vfx', 'placeholder_vfx', 'asset_missing'],
  boardBlock: ['asset_missing_block', 'placeholder_board_block', 'asset_missing']
};

export function getPlaceholderCategory(component: UiComponentSpec): UiPlaceholderCategory {
  const folder = component.canonicalFolder.toLowerCase();
  const id = component.id.toLowerCase();

  if (component.type === 'button') return 'button';
  if (component.type === 'meter') return 'meter';
  if (component.type === 'card') return 'card';
  if (component.type === 'panel' || component.type === 'chip' || component.type === 'badge') return 'panel';
  if (component.type === 'portraitSlot' || folder.includes('/portraits/')) return 'portrait';
  if (component.type === 'iconSlot') return 'icon';
  if (component.type === 'vfxSlot' || folder.includes('/effects/')) return 'vfx';
  if (component.type === 'spriteSlot' && (id.includes('board_block') || component.expectedSourceSize.w === 24)) return 'boardBlock';
  if (component.type === 'spriteSlot') return 'sprite';
  if (folder.includes('/battle/')) return 'battleBackground';
  if (folder.includes('/puzzle/')) return 'puzzleBackground';
  if (component.type === 'backgroundLayer' && component.expectedSourceSize.h === 1920) return 'fullBackground';
  if (component.type === 'backgroundLayer') return 'background';

  return 'generic';
}

export function getPlaceholderCandidates(component: UiComponentSpec): readonly string[] {
  return UI_PLACEHOLDER_KEYS[getPlaceholderCategory(component)];
}
