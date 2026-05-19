import standards from './animation-standards.json';
import { contentRegistry } from '../systems/ContentRegistry';

export type AnimationFrameCount = number;
export type AnimationCategory =
  | 'boardBlock'
  | 'vfx'
  | 'spell'
  | 'item'
  | 'hero'
  | 'monster'
  | 'boss'
  | 'hazardUi'
  | 'ui';

export type AnimationSequenceDefinition = {
  id: string;
  category: AnimationCategory;
  assetId: string;
  animationName: string;
  frameCount: AnimationFrameCount;
  frameRate: number;
  loop: boolean;
  folder: string;
  filenamePattern: string;
  fallbackKey: string;
  expectedFiles: string[];
};

export type SpriteAssetDefinition = {
  assetId: string;
  staticKey?: string;
  iconKey?: string;
  animations: string[];
};

export type VfxAssetDefinition = SpriteAssetDefinition;
export type UiAnimationDefinition = AnimationSequenceDefinition;
export type AnimationManifest = Record<string, AnimationSequenceDefinition>;

type RawStandards = typeof standards;
type BoardBlockStandards = RawStandards['boardBlocks'];

const DEFAULT_FRAME_RATE = 12;
const BOARD_GLOW_FRAME_RATE = 20;
const BOARD_CLEAR_FRAME_RATE = 25;
const VFX_FRAME_RATE = 20;
const UI_FRAME_RATE = 16;

const FALLBACK_BY_CATEGORY: Record<AnimationCategory, string> = {
  boardBlock: 'asset_missing_block',
  vfx: 'asset_missing',
  spell: 'asset_missing',
  item: 'asset_missing',
  hero: 'asset_missing',
  monster: 'asset_missing',
  boss: 'asset_missing',
  hazardUi: 'asset_missing_icon',
  ui: 'asset_missing_icon'
};

function animationId(category: AnimationCategory, assetId: string, animationName: string): string {
  if (category === 'boardBlock') {
    const blockName = assetId.replace(/^spr_block_/, 'block_');
    return `anim_${blockName}_${animationName}`;
  }
  if (category === 'vfx') {
    return `anim_${assetId}`;
  }
  if (category === 'spell') {
    return `anim_spell_${assetId.replace(/^spl_/, '')}`;
  }
  if (category === 'item') {
    const suffix = animationName === 'use_vfx'
      ? 'use'
      : animationName === 'counter_success_vfx'
        ? 'counter_success'
        : animationName.replace(/_vfx$/, '');
    return `anim_${assetId}_${suffix}`;
  }
  if (category === 'hero') {
    return `anim_${assetId.replace(/^hero_/, 'hero_')}_${animationName}`;
  }
  if (category === 'monster') {
    return `anim_${assetId.replace(/^mon_/, 'mon_')}_${animationName}`;
  }
  if (category === 'boss') {
    return `anim_${assetId}_${animationName}`;
  }
  if (category === 'hazardUi') {
    return `anim_${assetId}`;
  }
  return `anim_${assetId}`;
}

function boardBlockFolder(assetId: string, animationName: string): string {
  const blockId = assetId.replace(/^spr_/, '');
  if (animationName === 'glow' || animationName === 'clear') {
    return `/assets/sprites/board-blocks/${blockId}/${animationName}`;
  }
  return `/assets/sprites/board-blocks/${blockId}/special`;
}

function folderFor(category: AnimationCategory, assetId: string, animationName: string): string {
  switch (category) {
    case 'boardBlock':
      return boardBlockFolder(assetId, animationName);
    case 'spell':
      return `/assets/effects/${assetId}`;
    case 'item':
      return `/assets/effects/items/${assetId}/${animationName}`;
    case 'hero':
      return `/assets/sprites/heroes/${assetId}/${animationName}`;
    case 'monster':
      return `/assets/sprites/monsters/${assetId}/${animationName}`;
    case 'boss':
      return `/assets/sprites/bosses/${assetId}/${animationName}`;
    case 'hazardUi':
      return `/assets/ui/animations/hazards/${assetId}`;
    case 'ui':
      return `/assets/ui/animations/${assetId}`;
    case 'vfx':
    default:
      return `/assets/effects/${assetId}`;
  }
}

function frameRateFor(category: AnimationCategory, animationName: string): number {
  if (category === 'boardBlock' && animationName === 'glow') {
    return BOARD_GLOW_FRAME_RATE;
  }
  if (category === 'boardBlock' && (animationName === 'clear' || animationName.includes('clear') || animationName === 'break')) {
    return BOARD_CLEAR_FRAME_RATE;
  }
  if (category === 'vfx' || category === 'spell' || category === 'item') {
    return VFX_FRAME_RATE;
  }
  if (category === 'hazardUi' || category === 'ui') {
    return UI_FRAME_RATE;
  }
  return DEFAULT_FRAME_RATE;
}

function shouldLoop(category: AnimationCategory, animationName: string): boolean {
  return (
    animationName === 'glow' ||
    animationName === 'idle' ||
    animationName.includes('pulse') ||
    animationName.includes('warning') ||
    category === 'hazardUi'
  );
}

function createDefinition(
  category: AnimationCategory,
  assetId: string,
  animationName: string,
  frameCount: number
): AnimationSequenceDefinition {
  const folder = folderFor(category, assetId, animationName);
  const filenamePattern = `${assetId}__${animationName}__f{frame}.png`;
  const expectedFiles = Array.from({ length: frameCount }, (_, index) =>
    `${folder}/${assetId}__${animationName}__f${String(index).padStart(2, '0')}.png`
  );
  return {
    id: animationId(category, assetId, animationName),
    category,
    assetId,
    animationName,
    frameCount,
    frameRate: frameRateFor(category, animationName),
    loop: shouldLoop(category, animationName),
    folder,
    filenamePattern,
    fallbackKey: FALLBACK_BY_CATEGORY[category],
    expectedFiles
  };
}

function addDefinition(
  entries: AnimationSequenceDefinition[],
  category: AnimationCategory,
  assetId: string,
  animationName: string,
  frameCount: number
): void {
  if (!Number.isInteger(frameCount) || frameCount <= 0) {
    return;
  }
  entries.push(createDefinition(category, assetId, animationName, frameCount));
}

function bossAssetFromMonsterId(monsterId: string): string {
  return monsterId.replace(/^mon_/, '');
}

function createDefinitions(): AnimationSequenceDefinition[] {
  const entries: AnimationSequenceDefinition[] = [];

  for (const config of Object.values(standards.boardBlocks as BoardBlockStandards)) {
    for (const [name, count] of Object.entries(config.animations)) {
      addDefinition(entries, 'boardBlock', config.assetId, name, count);
    }
  }

  for (const [assetId, count] of Object.entries(standards.coreVfx)) {
    addDefinition(entries, 'vfx', assetId, 'play', count);
  }

  for (const [assetId, count] of Object.entries(standards.spellVfx)) {
    addDefinition(entries, 'spell', assetId, 'cast', count);
  }

  for (const itemId of standards.items.basicUseVfx) {
    addDefinition(entries, 'item', itemId, 'use_vfx', 5);
  }
  for (const itemId of standards.items.reactiveCounterVfx) {
    addDefinition(entries, 'item', itemId, 'use_vfx', 6);
    addDefinition(entries, 'item', itemId, 'counter_success_vfx', 5);
  }
  for (const itemId of standards.items.spellCatalystVfx) {
    addDefinition(entries, 'item', itemId, 'catalyst_ready_vfx', 4);
    addDefinition(entries, 'item', itemId, 'catalyst_consume_vfx', 5);
  }

  for (const heroId of standards.heroes) {
    for (const [name, count] of Object.entries(standards.heroAnimations)) {
      addDefinition(entries, 'hero', heroId, name, count);
    }
  }

  const regularMonsterIds = contentRegistry
    .list<{ id: string }>('monster')
    .map((monster) => monster.id)
    .filter((id) => !id.startsWith('mon_boss_'));
  for (const monsterId of regularMonsterIds) {
    for (const [name, count] of Object.entries(standards.monsterAnimations)) {
      addDefinition(entries, 'monster', monsterId, name, count);
    }
  }

  for (const bossId of standards.bosses) {
    for (const [name, count] of Object.entries(standards.bossAnimations)) {
      addDefinition(entries, 'boss', bossId, name, count);
    }
  }
  for (const bossMonster of contentRegistry.list<{ id: string }>('monster').filter((monster) => monster.id.startsWith('mon_boss_'))) {
    const assetId = bossAssetFromMonsterId(bossMonster.id);
    for (const [name, count] of Object.entries(standards.bossAnimations)) {
      addDefinition(entries, 'boss', assetId, name, count);
    }
  }

  for (const [assetId, count] of Object.entries(standards.hazardUi)) {
    addDefinition(entries, 'hazardUi', assetId, 'warning', count);
  }

  for (const [assetId, count] of Object.entries(standards.ui)) {
    addDefinition(entries, 'ui', assetId, 'default', count);
  }

  const unique = new Map<string, AnimationSequenceDefinition>();
  entries.forEach((entry) => unique.set(entry.id, entry));
  return [...unique.values()].sort((left, right) => left.id.localeCompare(right.id));
}

export const ANIMATION_DEFINITIONS: AnimationSequenceDefinition[] = createDefinitions();
export const ANIMATION_MANIFEST: AnimationManifest = Object.fromEntries(
  ANIMATION_DEFINITIONS.map((definition) => [definition.id, definition])
);

export function getAnimationDefinition(animationId: string | null | undefined): AnimationSequenceDefinition | null {
  return animationId ? ANIMATION_MANIFEST[animationId] ?? null : null;
}

export function hasAnimationDefinition(animationId: string | null | undefined): boolean {
  return Boolean(animationId && ANIMATION_MANIFEST[animationId]);
}

export function getAnimationFrameCount(animationId: string | null | undefined): number {
  return getAnimationDefinition(animationId)?.frameCount ?? 0;
}

export function getAnimationFramePaths(animationId: string | null | undefined): string[] {
  return getAnimationDefinition(animationId)?.expectedFiles ?? [];
}

export function getAnimationFrameKeys(animationId: string | null | undefined): string[] {
  const definition = getAnimationDefinition(animationId);
  if (!definition) {
    return [];
  }
  return Array.from({ length: definition.frameCount }, (_, index) =>
    `${definition.assetId}__${definition.animationName}__f${String(index).padStart(2, '0')}`
  );
}

export function getFallbackAnimation(category: AnimationCategory): AnimationSequenceDefinition | null {
  return ANIMATION_DEFINITIONS.find((definition) => definition.category === category) ?? null;
}

export function getBoardBlockStandard(blockId: string): { assetId: string; animations: Record<string, number> } | null {
  const normalized = blockId in standards.boardBlocks
    ? blockId
    : blockId === 'block_red_rune'
      ? 'block_red'
      : blockId === 'block_blue_rune'
        ? 'block_blue'
        : blockId === 'block_green_rune'
          ? 'block_green'
          : blockId === 'block_yellow_rune'
            ? 'block_yellow'
            : blockId;
  return (standards.boardBlocks as Record<string, { assetId: string; animations: Record<string, number> }>)[normalized] ?? null;
}

