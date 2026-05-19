import { contentRegistry } from '../systems/ContentRegistry';
import { ANIMATION_DEFINITIONS, getAnimationFrameKeys } from './animations';
import { BLOCK_ANIM } from '../utils/constants';

export type AssetKind = 'sprite' | 'icon' | 'audio' | 'background' | 'ui';

export type AssetManifestEntry = {
  key: string;
  path: string;
  kind: AssetKind;
};

type AssetField = 'iconKey' | 'spriteKey' | 'portraitKey' | 'backgroundKey';
type ContentAssetEntry = {
  id: string;
  theme?: string;
  bossId?: string;
  assetRefs?: Record<string, string | string[]>;
  backgrounds?: Record<string, string>;
  [key: string]: unknown;
};

type ContentAssetSource = {
  contentType:
    | 'boardBlock'
    | 'collectible'
    | 'currency'
    | 'hero'
    | 'item'
    | 'mapNode'
    | 'monster'
    | 'npc'
    | 'oopsie'
    | 'relic'
    | 'roomEvent'
    | 'spell'
    | 'stage'
    | 'statusEffect'
    | 'upgrade'
    | 'weapon';
  folder: string;
  field: AssetField;
  kind: AssetKind;
};

const CONTENT_ASSET_SOURCES: ContentAssetSource[] = [
  { contentType: 'boardBlock', folder: 'board-blocks', field: 'spriteKey', kind: 'sprite' },
  { contentType: 'collectible', folder: 'collectibles', field: 'iconKey', kind: 'icon' },
  { contentType: 'currency', folder: 'currencies', field: 'iconKey', kind: 'icon' },
  { contentType: 'hero', folder: 'heroes', field: 'portraitKey', kind: 'sprite' },
  { contentType: 'item', folder: 'items', field: 'iconKey', kind: 'icon' },
  { contentType: 'mapNode', folder: 'map', field: 'iconKey', kind: 'icon' },
  { contentType: 'monster', folder: 'monsters', field: 'spriteKey', kind: 'sprite' },
  { contentType: 'npc', folder: 'npc', field: 'spriteKey', kind: 'sprite' },
  { contentType: 'oopsie', folder: 'oopsies', field: 'iconKey', kind: 'icon' },
  { contentType: 'relic', folder: 'relics', field: 'iconKey', kind: 'icon' },
  { contentType: 'roomEvent', folder: 'story', field: 'iconKey', kind: 'icon' },
  { contentType: 'roomEvent', folder: 'stages', field: 'backgroundKey', kind: 'background' },
  { contentType: 'spell', folder: 'spells', field: 'iconKey', kind: 'icon' },
  { contentType: 'stage', folder: 'stages', field: 'backgroundKey', kind: 'background' },
  { contentType: 'statusEffect', folder: 'status-effects', field: 'iconKey', kind: 'icon' },
  { contentType: 'upgrade', folder: 'upgrades', field: 'iconKey', kind: 'icon' },
  { contentType: 'weapon', folder: 'weapons', field: 'iconKey', kind: 'icon' }
];

export const CORE_IMAGE_ASSETS: AssetManifestEntry[] = [
  { key: 'asset_missing', path: '/assets/ui/fallback-missing.png', kind: 'sprite' },
  { key: 'asset_missing_icon', path: '/assets/ui/fallback-icon.png', kind: 'icon' },
  { key: 'asset_missing_block', path: '/assets/board-blocks/fallback-block.png', kind: 'sprite' },
  { key: 'asset_missing_background', path: '/assets/stages/fallback-background.png', kind: 'background' },
  { key: 'ui_button_default', path: '/assets/ui/button-default.png', kind: 'ui' },
  { key: 'ui_card_default', path: '/assets/ui/card-default.png', kind: 'ui' }
];

export const AUDIO_ASSETS: AssetManifestEntry[] = [
  { key: 'sfx_line_clear', path: '/assets/audio/line-clear.ogg', kind: 'audio' },
  { key: 'sfx_cascade', path: '/assets/audio/cascade.ogg', kind: 'audio' },
  { key: 'sfx_spell_cast', path: '/assets/audio/spell-cast.ogg', kind: 'audio' },
  { key: 'sfx_enemy_hit', path: '/assets/audio/enemy-hit.ogg', kind: 'audio' },
  { key: 'sfx_player_hit', path: '/assets/audio/player-hit.ogg', kind: 'audio' },
  { key: 'sfx_reward_pick', path: '/assets/audio/reward-pick.ogg', kind: 'audio' },
  { key: 'sfx_button_tap', path: '/assets/audio/button-tap.ogg', kind: 'audio' },
  { key: 'sfx_boss_intro', path: '/assets/audio/boss-intro.ogg', kind: 'audio' },
  { key: 'sfx_victory', path: '/assets/audio/victory.ogg', kind: 'audio' },
  { key: 'sfx_defeat', path: '/assets/audio/defeat.ogg', kind: 'audio' },
  { key: 'sfx_shop_purchase', path: '/assets/audio/shop-purchase.ogg', kind: 'audio' },
  { key: 'sfx_item_use', path: '/assets/audio/item-use.ogg', kind: 'audio' }
];

function getAssetValue(entry: Record<string, unknown>, field: AssetField): string | null {
  const value = entry[field];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function assetPath(folder: string, key: string): string {
  return `/assets/${folder}/${key}.png`;
}

function normalizeFinalBoardBlockId(key: string): string {
  const aliases: Record<string, string> = {
    block_red_rune: 'block_red',
    block_blue_rune: 'block_blue',
    block_green_rune: 'block_green',
    block_yellow_rune: 'block_yellow',
    spr_block_red_rune: 'block_red',
    spr_block_blue_rune: 'block_blue',
    spr_block_green_rune: 'block_green',
    spr_block_yellow_rune: 'block_yellow'
  };
  return aliases[key] ?? key.replace(/^spr_/, '');
}

function addAsset(assets: Map<string, AssetManifestEntry>, key: string | null | undefined, folder: string, kind: AssetKind): void {
  if (!key || assets.has(key)) {
    return;
  }

  assets.set(key, {
    key,
    path: assetPath(folder, key),
    kind
  });
}

function addAssetPath(assets: Map<string, AssetManifestEntry>, key: string | null | undefined, path: string, kind: AssetKind): void {
  if (!key || assets.has(key)) {
    return;
  }

  assets.set(key, {
    key,
    path,
    kind
  });
}

function addAnimationFrameAssets(assets: Map<string, AssetManifestEntry>): void {
  for (const definition of ANIMATION_DEFINITIONS) {
    const keys = getAnimationFrameKeys(definition.id);
    keys.forEach((key, index) => {
      addAssetPath(assets, key, definition.expectedFiles[index], definition.category === 'ui' || definition.category === 'hazardUi' ? 'ui' : 'sprite');
    });
  }
}

function boardBlockStem(entry: ContentAssetEntry): string {
  return normalizeFinalBoardBlockId(getAssetValue(entry, 'spriteKey') ?? entry.id);
}

function boardBlockStemFromKey(key: string): string {
  const aliases: Record<string, string> = {
    block_red_rune: 'block_red',
    block_blue_rune: 'block_blue',
    block_green_rune: 'block_green',
    block_yellow_rune: 'block_yellow',
    spr_block_red_rune: 'block_red',
    spr_block_blue_rune: 'block_blue',
    spr_block_green_rune: 'block_green',
    spr_block_yellow_rune: 'block_yellow'
  };
  return aliases[key] ?? key.replace(/^spr_/, '');
}

function boardBlockTypeFromKey(key: string): string {
  const stem = boardBlockStemFromKey(key)
    .replace(/^block_/, '')
    .replace(/_(?:glow|clear)(?:_frame_\d{2})?$/, '')
    .replace(/__(?:base|glow|clear|[a-z0-9_]+)__f\d{2}$/, '');
  return stem.endsWith('_rune') ? stem.slice(0, -'_rune'.length) : stem;
}

function boardBlockIdFromFrameKey(key: string): string {
  return normalizeFinalBoardBlockId(key.replace(/__(?:base|glow|clear|[a-z0-9_]+)__f\d{2}$/, '').replace(/_(?:glow|clear)(?:_frame_\d{2})?$/, ''));
}

function boardBlockAssetPath(key: string, variant: 'base' | 'glow' | 'clear' | 'glowFrame' | 'clearFrame' | 'specialFrame' | 'icon', legacy = false): string {
  if (variant === 'icon') {
    return `/assets/icons/board-blocks/${key}.png`;
  }

  if (legacy) {
    return `/assets/sprites/board-blocks/${key}.png`;
  }

  const blockId = boardBlockIdFromFrameKey(key);
  if (variant === 'base') {
    return `/assets/sprites/board-blocks/${blockId}/base/${blockId}__base__f00.png`;
  }
  if (variant === 'glowFrame') {
    return `/assets/sprites/board-blocks/${blockId}/glow/${key}.png`;
  }
  if (variant === 'clearFrame') {
    return `/assets/sprites/board-blocks/${blockId}/clear/${key}.png`;
  }
  if (variant === 'specialFrame') {
    return `/assets/sprites/board-blocks/${blockId}/special/${key}.png`;
  }
  const animationName = variant === 'glow' ? 'glow' : 'clear';
  return `/assets/sprites/board-blocks/${blockId}/${animationName}/${key}.png`;
}

function stageSlug(stage: ContentAssetEntry): string {
  return stage.id.replace(/^stage_/, '');
}

function bossSlug(stage: ContentAssetEntry): string | null {
  return typeof stage.bossId === 'string' ? stage.bossId.replace(/^mon_boss_/, '') : null;
}

function collectExplicitRefs(entry: ContentAssetEntry): string[] {
  const assetRefs = Object.values(entry.assetRefs ?? {}).flatMap((value) => Array.isArray(value) ? value : [value]);
  return [
    ...assetRefs,
    ...Object.values(entry.backgrounds ?? {})
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);
}

function inferBoardBlockFrameKeys(stem: string, state: 'glow' | 'clear'): string[] {
  const count = state === 'glow' ? BLOCK_ANIM.GLOW_FRAME_COUNT : BLOCK_ANIM.CLEAR_FRAME_COUNT;
  return Array.from({ length: count }, (_, index) => `${stem}__${state}__f${String(index).padStart(2, '0')}`);
}

function addBoardBlockAsset(
  assets: Map<string, AssetManifestEntry>,
  key: string,
  variant: 'base' | 'glow' | 'clear' | 'glowFrame' | 'clearFrame' | 'specialFrame' | 'icon'
): void {
  addAssetPath(assets, key, boardBlockAssetPath(key, variant), variant === 'icon' ? 'icon' : 'sprite');
  if (variant !== 'icon') {
    addAssetPath(assets, `${key}__legacy`, boardBlockAssetPath(key, variant, true), 'sprite');
  }
}

export function createContentImageAssets(): AssetManifestEntry[] {
  const assets = new Map<string, AssetManifestEntry>();

  for (const source of CONTENT_ASSET_SOURCES) {
    if (source.contentType === 'boardBlock') {
      continue;
    }

    for (const entry of contentRegistry.list<ContentAssetEntry>(source.contentType)) {
      const key = getAssetValue(entry, source.field);
      if (!key || assets.has(key)) {
        continue;
      }

      assets.set(key, {
        key,
        path: assetPath(source.folder, key),
        kind: source.kind
      });

      for (const explicitRef of collectExplicitRefs(entry)) {
        addAsset(assets, explicitRef, source.folder, source.kind);
      }
    }
  }

  for (const stage of contentRegistry.list<ContentAssetEntry>('stage')) {
    if (typeof stage.theme !== 'string' || stage.theme.length === 0) {
      continue;
    }
    const key = `bg_${stage.theme}`;
    if (!assets.has(key)) {
      assets.set(key, {
        key,
        path: assetPath('stages', key),
        kind: 'background'
      });
    }
  }

  for (const block of contentRegistry.list<ContentAssetEntry>('boardBlock')) {
    const stem = boardBlockStem(block);
    const base = typeof block.assetRefs?.base === 'string' ? block.assetRefs.base : `${stem}__base__f00`;
    const glow = typeof block.assetRefs?.glow === 'string' ? block.assetRefs.glow : `${stem}__glow__f00`;
    const clear = typeof block.assetRefs?.clear === 'string' ? block.assetRefs.clear : `${stem}__clear__f00`;
    const icon = typeof block.assetRefs?.icon === 'string'
      ? block.assetRefs.icon
      : typeof block.iconKey === 'string'
        ? block.iconKey
        : `ico_${stem}`;
    const glowFrames = Array.isArray(block.assetRefs?.glowFrames)
      ? block.assetRefs.glowFrames.filter((key): key is string => typeof key === 'string' && key.length > 0)
      : inferBoardBlockFrameKeys(stem, 'glow');
    const clearFrames = Array.isArray(block.assetRefs?.clearFrames)
      ? block.assetRefs.clearFrames.filter((key): key is string => typeof key === 'string' && key.length > 0)
      : inferBoardBlockFrameKeys(stem, 'clear');
    const specialFrames = Array.isArray(block.assetRefs?.specialFrames)
      ? block.assetRefs.specialFrames.filter((key): key is string => typeof key === 'string' && key.length > 0)
      : [];

    addBoardBlockAsset(assets, base, 'base');
    addBoardBlockAsset(assets, glow, 'glow');
    addBoardBlockAsset(assets, clear, 'clear');
    addBoardBlockAsset(assets, icon, 'icon');
    glowFrames.forEach((key) => addBoardBlockAsset(assets, key, 'glowFrame'));
    clearFrames.forEach((key) => addBoardBlockAsset(assets, key, 'clearFrame'));
    specialFrames.forEach((key) => addBoardBlockAsset(assets, key, 'specialFrame'));
  }

  for (const hero of contentRegistry.list<ContentAssetEntry>('hero')) {
    addAsset(assets, hero.id, 'heroes', 'sprite');
    addAssetPath(assets, `${hero.id}__pose_sheet_2x2`, `/assets/sprites/heroes/${hero.id}/sheet/${hero.id}__pose_sheet_2x2.png`, 'sprite');
    addAssetPath(assets, `${hero.id}__extended_sheet_2x2`, `/assets/sprites/heroes/${hero.id}/sheet/${hero.id}__extended_sheet_2x2.png`, 'sprite');
    for (const state of ['idle', 'cast_spell', 'attack', 'hit', 'victory', 'defeat_tired', 'portrait', 'silhouette_locked']) {
      addAssetPath(assets, `${hero.id}__${state}__f00`, `/assets/sprites/heroes/${hero.id}/${state}/${hero.id}__${state}__f00.png`, 'sprite');
      addAsset(assets, `spr_${hero.id}_${state}`, 'sprites/heroes', 'sprite');
    }
    addAsset(assets, `ico_${hero.id}`, 'icons/heroes', 'icon');
  }

  for (const monster of contentRegistry.list<ContentAssetEntry>('monster')) {
    const isBoss = monster.id.startsWith('mon_boss_');
    const actorId = isBoss ? monster.id.replace(/^mon_/, '') : monster.id;
    const folder = isBoss ? 'sprites/bosses' : 'sprites/monsters';
    const states = monster.id.startsWith('mon_boss_')
      ? ['idle', 'attack', 'hit', 'phase_change', 'special_attack', 'defeat', 'intro_portrait']
      : ['idle', 'attack', 'hit', 'defeat'];
    addAsset(assets, actorId, isBoss ? 'bosses' : 'monsters', 'sprite');
    addAssetPath(assets, `${actorId}__pose_sheet_2x2`, `/assets/${folder}/${actorId}/sheet/${actorId}__pose_sheet_2x2.png`, 'sprite');
    if (isBoss) {
      addAssetPath(assets, `${actorId}__extended_sheet_2x2`, `/assets/${folder}/${actorId}/sheet/${actorId}__extended_sheet_2x2.png`, 'sprite');
    }
    for (const state of states) {
      addAssetPath(assets, `${actorId}__${state}__f00`, `/assets/${folder}/${actorId}/${state}/${actorId}__${state}__f00.png`, 'sprite');
      addAsset(assets, `spr_${monster.id}_${state}`, folder, 'sprite');
    }
    addAsset(assets, `ico_${actorId}`, monster.id.startsWith('mon_boss_') ? 'icons/bosses' : 'icons/monsters', 'icon');
    addAsset(assets, `ico_${monster.id}`, monster.id.startsWith('mon_boss_') ? 'icons/bosses' : 'icons/monsters', 'icon');
  }

  for (const stage of contentRegistry.list<ContentAssetEntry>('stage')) {
    const slug = stageSlug(stage);
    const boss = bossSlug(stage);
    addAsset(assets, `bg_${slug}`, 'stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle`, 'stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle_far`, 'stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle_mid`, 'stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle_near`, 'stages', 'background');
    addAsset(assets, `bg_map_${slug}`, 'stage-backgrounds/route-scenes', 'background');
    if (boss) {
      addAsset(assets, `bg_boss_${boss}_arena`, 'stages', 'background');
    }
  }

  for (const node of contentRegistry.list<ContentAssetEntry>('mapNode')) {
    const room = node.id.replace(/^node_/, '');
    const stem = room === 'fight' ? 'map_node_normal' : `map_node_${room}`;
    for (const state of ['available', 'current', 'completed', 'locked']) {
      addAsset(assets, `${stem}_${state}`, 'icons/map', 'icon');
    }
  }

  const iconSources: Array<[keyof Pick<ContentAssetEntry, 'id'>, string, ContentAssetSource['contentType']]> = [
    ['id', 'icons/items', 'item'],
    ['id', 'icons/spells', 'spell'],
    ['id', 'icons/relics', 'relic'],
    ['id', 'icons/upgrades', 'upgrade'],
    ['id', 'icons/weapons', 'weapon'],
    ['id', 'icons/status-effects', 'statusEffect'],
    ['id', 'icons/oopsies', 'oopsie'],
    ['id', 'icons/currencies', 'currency'],
    ['id', 'icons/collectibles', 'collectible'],
    ['id', 'icons/events', 'roomEvent']
  ];
  for (const [, folder, contentType] of iconSources) {
    for (const entry of contentRegistry.list<ContentAssetEntry>(contentType)) {
      addAsset(assets, `ico_${entry.id}`, folder, 'icon');
      addAsset(assets, `icon_${entry.id}`, folder, 'icon');
    }
  }

  addAsset(assets, 'ui_route_dialogue_panel', 'ui/story-routes', 'ui');
  addAsset(assets, 'ui_route_choice_card_practical', 'ui/story-routes', 'ui');
  addAsset(assets, 'ui_route_choice_card_true', 'ui/story-routes', 'ui');
  addAsset(assets, 'ui_route_choice_card_risky', 'ui/story-routes', 'ui');
  ['practical', 'true', 'risky'].forEach((lane) => addAsset(assets, `ico_route_badge_${lane}`, 'icons/story-routes', 'icon'));
  for (const hero of contentRegistry.list<ContentAssetEntry>('hero')) {
    for (const stage of contentRegistry.list<ContentAssetEntry>('stage')) {
      addAsset(assets, `ico_route_trigger_${hero.id}_${stage.id}`, 'icons/story-routes', 'icon');
      addAsset(assets, `bg_route_${hero.id}_${stage.id}`, 'stage-backgrounds/route-scenes', 'background');
    }
    for (const expression of ['neutral', 'happy', 'worried', 'determined']) {
      addAsset(assets, `prt_route_${hero.id}_${expression}`, 'portraits/heroes', 'sprite');
    }
    for (const ending of ['normal', 'true', 'variant']) {
      addAsset(assets, `story_end_${hero.id}_${ending}`, 'story/endings', 'background');
    }
  }
  for (const npc of contentRegistry.list<ContentAssetEntry>('npc')) {
    for (const expression of ['neutral', 'happy', 'worried']) {
      addAsset(assets, `prt_route_${npc.id}_${expression}`, 'portraits/npcs', 'sprite');
    }
  }
  addAssetPath(assets, 'vfx_route_reward_sparkle__play__f00', '/assets/effects/vfx_route_reward_sparkle/vfx_route_reward_sparkle__play__f00.png', 'sprite');
  addAssetPath(assets, 'vfx_route_risky_oopsie__play__f00', '/assets/effects/vfx_route_risky_oopsie/vfx_route_risky_oopsie__play__f00.png', 'sprite');

  addAnimationFrameAssets(assets);

  return [...assets.values()].sort((left, right) => left.key.localeCompare(right.key));
}

export const IMAGE_ASSETS: AssetManifestEntry[] = [
  ...CORE_IMAGE_ASSETS,
  ...createContentImageAssets()
];

export const ASSET_MANIFEST: AssetManifestEntry[] = [
  ...IMAGE_ASSETS,
  ...AUDIO_ASSETS
];
