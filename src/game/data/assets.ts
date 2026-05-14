import { contentRegistry } from '../systems/ContentRegistry';

export type AssetKind = 'sprite' | 'icon' | 'audio' | 'background' | 'ui';

export type AssetManifestEntry = {
  key: string;
  path: string;
  kind: AssetKind;
};

type AssetField = 'iconKey' | 'spriteKey' | 'portraitKey' | 'backgroundKey';
type ContentAssetEntry = {
  id: string;
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

export function createContentImageAssets(): AssetManifestEntry[] {
  const assets = new Map<string, AssetManifestEntry>();

  for (const source of CONTENT_ASSET_SOURCES) {
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
