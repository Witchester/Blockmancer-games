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
  { key: 'asset_missing', path: 'assets/ui/fallback-missing.png', kind: 'sprite' },
  { key: 'asset_missing_icon', path: 'assets/ui/fallback-icon.png', kind: 'icon' },
  { key: 'asset_missing_block', path: 'assets/board-blocks/fallback-block.png', kind: 'sprite' },
  { key: 'asset_missing_background', path: 'assets/stages/fallback-background.png', kind: 'background' },
  { key: 'ui_button_default', path: 'assets/ui/button-default.png', kind: 'ui' },
  { key: 'ui_card_default', path: 'assets/ui/card-default.png', kind: 'ui' }
];

export const AUDIO_ASSETS: AssetManifestEntry[] = [
  { key: 'sfx_line_clear', path: 'assets/audio/line-clear.ogg', kind: 'audio' },
  { key: 'sfx_cascade', path: 'assets/audio/cascade.ogg', kind: 'audio' },
  { key: 'sfx_spell_cast', path: 'assets/audio/spell-cast.ogg', kind: 'audio' },
  { key: 'sfx_enemy_hit', path: 'assets/audio/enemy-hit.ogg', kind: 'audio' },
  { key: 'sfx_player_hit', path: 'assets/audio/player-hit.ogg', kind: 'audio' },
  { key: 'sfx_reward_pick', path: 'assets/audio/reward-pick.ogg', kind: 'audio' },
  { key: 'sfx_button_tap', path: 'assets/audio/button-tap.ogg', kind: 'audio' },
  { key: 'sfx_boss_intro', path: 'assets/audio/boss-intro.ogg', kind: 'audio' },
  { key: 'sfx_victory', path: 'assets/audio/victory.ogg', kind: 'audio' },
  { key: 'sfx_defeat', path: 'assets/audio/defeat.ogg', kind: 'audio' },
  { key: 'sfx_shop_purchase', path: 'assets/audio/shop-purchase.ogg', kind: 'audio' },
  { key: 'sfx_item_use', path: 'assets/audio/item-use.ogg', kind: 'audio' }
];

function getAssetValue(entry: Record<string, unknown>, field: AssetField): string | null {
  const value = entry[field];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function assetPath(folder: string, key: string): string {
  return `assets/${folder}/${key}.png`;
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
  return boardBlockStemFromKey(getAssetValue(entry, 'spriteKey') ?? entry.id);
}

function boardBlockStemFromKey(key: string): string {
  const aliases: Record<string, string> = {
    block_red: 'spr_block_red_rune',
    block_blue: 'spr_block_blue_rune',
    block_green: 'spr_block_green_rune',
    block_yellow: 'spr_block_yellow_rune'
  };
  return aliases[key] ?? (key.startsWith('spr_') ? key : `spr_${key}`);
}

function boardBlockTypeFromKey(key: string): string {
  const stem = boardBlockStemFromKey(key)
    .replace(/^spr_block_/, '')
    .replace(/_(?:glow|clear)(?:_frame_\d{2})?$/, '');
  return stem.endsWith('_rune') ? stem.slice(0, -'_rune'.length) : stem;
}

function boardBlockAssetPath(key: string, variant: 'base' | 'glow' | 'clear' | 'glowFrame' | 'clearFrame' | 'icon', legacy = false): string {
  if (variant === 'icon') {
    return `assets/icons/board-blocks/${key}.png`;
  }

  if (legacy) {
    return `assets/sprites/board-blocks/${key}.png`;
  }

  const type = boardBlockTypeFromKey(key);
  if (variant === 'glowFrame') {
    return `assets/sprites/board-blocks/${type}/animations/glow/${key}.png`;
  }
  if (variant === 'clearFrame') {
    return `assets/sprites/board-blocks/${type}/animations/clear/${key}.png`;
  }
  return `assets/sprites/board-blocks/${type}/${key}.png`;
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
  return Array.from({ length: count }, (_, index) => `${stem}_${state}_frame_${String(index + 1).padStart(2, '0')}`);
}

function addBoardBlockAsset(
  assets: Map<string, AssetManifestEntry>,
  key: string,
  variant: 'base' | 'glow' | 'clear' | 'glowFrame' | 'clearFrame' | 'icon'
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
    const base = typeof block.assetRefs?.base === 'string' ? block.assetRefs.base : stem;
    const glow = typeof block.assetRefs?.glow === 'string' ? block.assetRefs.glow : `${stem}_glow`;
    const clear = typeof block.assetRefs?.clear === 'string' ? block.assetRefs.clear : `${stem}_clear`;
    const icon = typeof block.assetRefs?.icon === 'string'
      ? block.assetRefs.icon
      : typeof block.iconKey === 'string'
        ? block.iconKey
        : stem.replace(/^spr_/, 'ico_');
    const glowFrames = Array.isArray(block.assetRefs?.glowFrames)
      ? block.assetRefs.glowFrames.filter((key): key is string => typeof key === 'string' && key.length > 0)
      : inferBoardBlockFrameKeys(stem, 'glow');
    const clearFrames = Array.isArray(block.assetRefs?.clearFrames)
      ? block.assetRefs.clearFrames.filter((key): key is string => typeof key === 'string' && key.length > 0)
      : inferBoardBlockFrameKeys(stem, 'clear');

    addBoardBlockAsset(assets, base, 'base');
    addBoardBlockAsset(assets, glow, 'glow');
    addBoardBlockAsset(assets, clear, 'clear');
    addBoardBlockAsset(assets, icon, 'icon');
    glowFrames.forEach((key) => addBoardBlockAsset(assets, key, 'glowFrame'));
    clearFrames.forEach((key) => addBoardBlockAsset(assets, key, 'clearFrame'));
  }

  for (const hero of contentRegistry.list<ContentAssetEntry>('hero')) {
    for (const state of ['idle', 'cast', 'attack', 'hit', 'victory', 'defeat', 'portrait', 'silhouette_locked']) {
      addAsset(assets, `spr_${hero.id}_${state}`, 'sprites/heroes', 'sprite');
    }
    addAsset(assets, `ico_${hero.id}`, 'icons/heroes', 'icon');
  }

  for (const monster of contentRegistry.list<ContentAssetEntry>('monster')) {
    const folder = monster.id.startsWith('mon_boss_') ? 'sprites/bosses' : 'sprites/monsters';
    const states = monster.id.startsWith('mon_boss_')
      ? ['idle', 'attack', 'special', 'phase_2', 'hit', 'defeat', 'intro_portrait']
      : ['idle', 'attack', 'hit', 'defeat'];
    for (const state of states) {
      addAsset(assets, `spr_${monster.id}_${state}`, folder, 'sprite');
    }
    addAsset(assets, `ico_${monster.id}`, monster.id.startsWith('mon_boss_') ? 'icons/bosses' : 'icons/monsters', 'icon');
  }

  for (const stage of contentRegistry.list<ContentAssetEntry>('stage')) {
    const slug = stageSlug(stage);
    const boss = bossSlug(stage);
    addAsset(assets, `bg_stage_${slug}_battle`, 'backgrounds/stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle_far`, 'backgrounds/stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle_mid`, 'backgrounds/stages', 'background');
    addAsset(assets, `bg_stage_${slug}_battle_near`, 'backgrounds/stages', 'background');
    addAsset(assets, `bg_map_${slug}`, 'backgrounds/maps', 'background');
    if (boss) {
      addAsset(assets, `bg_boss_${boss}_arena`, 'backgrounds/stages', 'background');
    }
  }

  for (const node of contentRegistry.list<ContentAssetEntry>('mapNode')) {
    const room = node.id.replace(/^node_/, '');
    const stem = room === 'fight' ? 'map_node_normal' : `map_node_${room}`;
    for (const state of ['available', 'current', 'completed', 'locked']) {
      addAsset(assets, `${stem}_${state}`, 'map/nodes', 'icon');
    }
  }

  const iconSources: Array<[keyof Pick<ContentAssetEntry, 'id'>, string, ContentAssetSource['contentType']]> = [
    ['id', 'icons/items', 'item'],
    ['id', 'icons/spells', 'spell'],
    ['id', 'icons/relics', 'relic'],
    ['id', 'icons/upgrades', 'upgrade'],
    ['id', 'icons/weapons', 'weapon'],
    ['id', 'icons/statuses', 'statusEffect'],
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
