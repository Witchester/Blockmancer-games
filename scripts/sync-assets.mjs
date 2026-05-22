import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ASSET_ROOT = path.join(ROOT, 'public', 'assets');
const CONTENT_ROOT = path.join(ROOT, 'src', 'game', 'content');
const STANDARDS_PATH = path.join(ROOT, 'src', 'game', 'data', 'animation-standards.json');
const REPORT_PATH = path.join(ROOT, 'docs', 'ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md');
const STRICT = process.argv.includes('--strict');

const STAGE_SLUG_TO_ID = {
  sprinkle_sewers: 'stage_sprinkle_sewers',
  goblin_workshop: 'stage_goblin_workshop',
  frosty_pantry: 'stage_frosty_pantry',
  pillow_castle: 'stage_pillow_castle',
  starfall_arcade: 'stage_starfall_arcade',
  bloxley_block_palace: 'stage_bloxley_block_palace'
};

const BOARD_CLEAR_ANIMATIONS = new Set([
  'clear',
  'break',
  'explode',
  'crack_clear',
  'squish_clear',
  'expire_to_junk',
  'clear_burst',
  'stretch_clear'
]);

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function relPublic(filePath) {
  return filePath.replace(path.join(ROOT, 'public'), '').replace(/\\/g, '/');
}

function diskPath(assetPath) {
  return path.join(ROOT, 'public', assetPath.replace(/^\//, ''));
}

function contentFiles() {
  return walkFiles(CONTENT_ROOT).filter((f) => f.endsWith('.json') && !f.endsWith('metadata.json'));
}

function contentEntries(folder) {
  const root = path.join(CONTENT_ROOT, folder);
  return walkFiles(root)
    .filter((f) => f.endsWith('.json') && !f.endsWith('metadata.json'))
    .map((file) => readJson(file));
}

function collectContentKeys(files) {
  const refs = [];
  const fields = ['assetKey', 'imageKey', 'textureKey', 'vfxKey', 'effectKey', 'audioKey', 'sfxKey', 'bgmKey', 'musicKey', 'iconKey', 'spriteKey', 'portraitKey', 'backgroundKey'];
  function visit(value, file, pointer = '') {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, file, `${pointer}/${index}`));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (fields.includes(key) && typeof child === 'string' && child.length > 0) {
        refs.push({ key: child, file, pointer: `${pointer}/${key}` });
      }
      if ((key === 'assetRefs' || key === 'backgrounds') && child && typeof child === 'object') {
        for (const [refKey, refValue] of Object.entries(child)) {
          if (typeof refValue === 'string') refs.push({ key: refValue, file, pointer: `${pointer}/${key}/${refKey}` });
          if (Array.isArray(refValue)) {
            refValue.filter((entry) => typeof entry === 'string').forEach((entry, index) => refs.push({ key: entry, file, pointer: `${pointer}/${key}/${refKey}/${index}` }));
          }
        }
      }
      visit(child, file, `${pointer}/${key}`);
    }
  }
  for (const file of files) {
    visit(readJson(file), file);
  }
  return refs;
}

function assetPath(folder, key, ext = 'png') {
  return `/assets/${folder}/${key}.${ext}`;
}

function boardFolder(assetId, anim) {
  const blockId = assetId.replace(/^spr_/, '');
  if (anim === 'base' || anim === 'glow') return `/assets/sprites/board-blocks/${blockId}/${anim}`;
  if (BOARD_CLEAR_ANIMATIONS.has(anim)) return `/assets/sprites/board-blocks/${blockId}/clear`;
  return `/assets/sprites/board-blocks/${blockId}/special`;
}

function framePath(key) {
  const match = key.match(/^(.+)__([a-z0-9_]+)__f\d{2}$/i);
  if (!match) return null;
  const [, assetId, anim] = match;
  if (assetId.startsWith('hero_')) return `/assets/sprites/heroes/${assetId}/${anim}/${key}.png`;
  if (assetId.startsWith('boss_')) return `/assets/sprites/bosses/${assetId}/${anim}/${key}.png`;
  if (assetId.startsWith('mon_')) return `/assets/sprites/monsters/${assetId}/${anim}/${key}.png`;
  if (assetId.startsWith('spr_block_') || assetId.startsWith('block_')) return `${boardFolder(assetId, anim)}/${key}.png`;
  if (assetId.startsWith('ui_')) return `/assets/ui/animations/${assetId}/${key}.png`;
  return `/assets/effects/${assetId}/${key}.png`;
}

function stagePath(key) {
  let match = key.match(/^bg_stage_(.+)_(battle|puzzle)_(far|mid|near)$/);
  if (match) {
    const [, slug, section] = match;
    const stageId = STAGE_SLUG_TO_ID[slug];
    return stageId ? `/assets/stages/${stageId}/${section}/${key}.png` : null;
  }
  match = key.match(/^bg_stage_(.+)_battle$/);
  if (match) {
    const stageId = STAGE_SLUG_TO_ID[match[1]];
    return stageId ? `/assets/stages/${stageId}/battle/bg_stage_${match[1]}_battle_mid.png` : null;
  }
  match = key.match(/^bg_map_(.+)$/);
  if (match) {
    const stageId = STAGE_SLUG_TO_ID[match[1]];
    return stageId ? `/assets/stages/${stageId}/map/${key}.png` : null;
  }
  match = key.match(/^bg_boss_(.+)_arena$/);
  if (match) {
    const bossToStage = {
      cupcake_slime_king: 'stage_sprinkle_sewers',
      prototype_no_7: 'stage_goblin_workshop',
      gelato_golem: 'stage_frosty_pantry',
      sir_snore_a_lot: 'stage_pillow_castle',
      high_score_hydra: 'stage_starfall_arcade',
      king_bloxley: 'stage_bloxley_block_palace'
    };
    const stageId = bossToStage[match[1]];
    return stageId ? `/assets/stages/${stageId}/boss-arena/${key}.png` : null;
  }
  match = key.match(/^bg_route_(hero_.+)_(stage_.+)$/);
  if (match) return `/assets/stages/${match[2]}/route-scenes/${key}.png`;
  return null;
}

function inferPrimaryPath(key) {
  if (key.includes('/assets/')) return key.startsWith('/') ? key : `/${key}`;
  const frame = framePath(key);
  if (frame) return frame;
  const stage = stagePath(key);
  if (stage) return stage;
  if (key.startsWith('ico_route_')) return assetPath('icons/route-story', key);
  if (key.startsWith('ico_hero_')) return `/assets/portraits/heroes/${key.replace(/^ico_/, '')}__portrait_icon__f00.png`;
  if (key.startsWith('ico_boss_')) return `/assets/portraits/bosses/${key.replace(/^ico_/, '')}__portrait_icon__f00.png`;
  if (key.startsWith('ico_item_') || key.startsWith('icon_item_') || key.startsWith('item_')) return assetPath('icons/items', key);
  if (key.startsWith('ico_spl_') || key.startsWith('icon_spl_') || key.startsWith('spl_')) return assetPath('icons/spells', key);
  if (key.startsWith('ico_rel_') || key.startsWith('icon_rel_') || key.startsWith('rel_')) return assetPath('icons/relics', key);
  if (key.startsWith('ico_upg_') || key.startsWith('icon_upg_') || key.startsWith('upg_')) return assetPath('icons/upgrades', key);
  if (key.startsWith('ico_wpn_') || key.startsWith('icon_wpn_') || key.startsWith('wpn_')) return assetPath('icons/weapons', key);
  if (key.startsWith('currency_')) return assetPath('icons/currencies', key);
  if (key.startsWith('collectible_')) return assetPath('icons/collectibles', key);
  if (key.startsWith('status_')) return assetPath('icons/status-effects', key);
  if (key.startsWith('oopsie_')) return assetPath('icons/oopsies', key);
  if (key.startsWith('ico_block_')) return assetPath('icons/board-blocks', key);
  if (key.startsWith('map_node_') || key.startsWith('node_')) return assetPath('icons/map-nodes', key);
  if (key.startsWith('evt_') || key.startsWith('ico_evt_') || key.startsWith('icon_evt_')) return assetPath('icons/room-events', key);
  if (key.startsWith('prt_')) return assetPath(key.includes('_npc_') ? 'portraits/npcs' : 'portraits/heroes', key);
  if (key.startsWith('story_end_')) return assetPath('story/endings', key);
  if (key.startsWith('ui_route_')) return assetPath('ui/story-routes', key);
  if (key.startsWith('ui_')) return assetPath('ui/panels', key);
  if (key.startsWith('vfx_')) return assetPath('effects', key);
  if (key.startsWith('block_')) return assetPath('board-blocks', key);
  if (key.startsWith('hero_')) return `/assets/sprites/heroes/${key}/idle/${key}__idle__f00.png`;
  if (key.startsWith('mon_boss_')) {
    const bossId = key.replace(/^mon_/, '');
    return `/assets/sprites/bosses/${bossId}/idle/${bossId}__idle__f00.png`;
  }
  if (key.startsWith('mon_')) return `/assets/sprites/monsters/${key}/idle/${key}__idle__f00.png`;
  if (key.startsWith('boss_')) return `/assets/sprites/bosses/${key}/idle/${key}__idle__f00.png`;
  if (key.startsWith('bg_')) return assetPath('stages/global-scenes', key);
  if (key.startsWith('sfx_')) return assetPath(key === 'sfx_button_tap' || key === 'sfx_shop_purchase' ? 'audio/ui' : 'audio/sfx', key.replace(/^sfx_/, '').replace(/_/g, '-'), 'ogg');
  return assetPath('placeholders', key);
}

function fallbackPaths(key) {
  const paths = [
    `/assets/sprites/${key}.png`,
    `/assets/icons/${key}.png`,
    `/assets/backgrounds/legacy/${key}.png`,
    `/assets/stages/${key}.png`,
    `/assets/story/${key}.png`,
    `/assets/icons/map/${key}.png`,
    `/assets/icons/story-routes/${key}.png`,
    `/assets/monsters/${key}.png`,
    `/assets/heroes/${key}.png`
  ];
  if (key.startsWith('sfx_')) paths.push(`/assets/audio/${key.replace(/^sfx_/, '').replace(/_/g, '-')}.ogg`);
  return paths;
}

function addExpectedAnimationFrames(expected) {
  if (!fs.existsSync(STANDARDS_PATH)) return;
  const standards = readJson(STANDARDS_PATH);
  const monsterIds = contentEntries('monsters').map((entry) => entry.id);

  function add(category, assetId, anim, count) {
    for (let index = 0; index < count; index += 1) {
      const key = `${assetId}__${anim}__f${String(index).padStart(2, '0')}`;
      expected.set(key, { primary: framePath(key), fallbacks: [], source: 'animation_manifest' });
    }
  }

  Object.values(standards.boardBlocks ?? {}).forEach((block) => Object.entries(block.animations).forEach(([anim, count]) => add('boardBlock', block.assetId, anim, count)));
  Object.entries(standards.coreVfx ?? {}).forEach(([id, count]) => add('vfx', id, 'play', count));
  Object.entries(standards.spellVfx ?? {}).forEach(([id, count]) => add('spell', id, 'cast', count));
  (standards.items?.basicUseVfx ?? []).forEach((id) => add('item', id, 'use_vfx', 5));
  (standards.items?.reactiveCounterVfx ?? []).forEach((id) => {
    add('item', id, 'use_vfx', 6);
    add('item', id, 'counter_success_vfx', 5);
  });
  (standards.items?.spellCatalystVfx ?? []).forEach((id) => {
    add('item', id, 'catalyst_ready_vfx', 4);
    add('item', id, 'catalyst_consume_vfx', 5);
  });
  (standards.heroes ?? []).forEach((id) => Object.entries(standards.heroAnimations ?? {}).forEach(([anim, count]) => add('hero', id, anim, count)));
  monsterIds.filter((id) => !id.startsWith('mon_boss_')).forEach((id) => Object.entries(standards.monsterAnimations ?? {}).forEach(([anim, count]) => add('monster', id, anim, count)));
  (standards.bosses ?? []).forEach((id) => Object.entries(standards.bossAnimations ?? {}).forEach(([anim, count]) => add('boss', id, anim, count)));
  Object.entries(standards.hazardUi ?? {}).forEach(([id, count]) => add('ui', id, 'warning', count));
  Object.entries(standards.ui ?? {}).forEach(([id, count]) => add('ui', id, 'default', count));
}

const refs = collectContentKeys(contentFiles());
const expected = new Map();
for (const ref of refs) {
  if (!expected.has(ref.key)) {
    expected.set(ref.key, { primary: inferPrimaryPath(ref.key), fallbacks: fallbackPaths(ref.key), source: 'content_json', references: [] });
  }
  expected.get(ref.key).references.push(`${path.relative(ROOT, ref.file).replace(/\\/g, '/')}${ref.pointer}`);
}
addExpectedAnimationFrames(expected);

const physicalFiles = walkFiles(ASSET_ROOT).filter((f) => /\.(png|webp|jpe?g|gif|ogg|mp3|wav)$/i.test(f));
const physicalSet = new Set(physicalFiles.map(relPublic));
const expectedPhysical = new Set();

const missingPrimary = [];
const legacyOnly = [];
const unresolvedContent = [];
const fallbackSafeMissing = [];
for (const [key, entry] of expected) {
  const primary = entry.primary;
  if (primary) expectedPhysical.add(primary);
  const hasPrimary = primary ? physicalSet.has(primary) : false;
  const legacy = (entry.fallbacks ?? []).find((candidate) => physicalSet.has(candidate));
  (entry.fallbacks ?? []).forEach((candidate) => expectedPhysical.add(candidate));
  if (!hasPrimary) {
    missingPrimary.push({ key, primary, source: entry.source });
    if (legacy) legacyOnly.push({ key, legacy });
    else fallbackSafeMissing.push({ key, primary });
  }
  if (entry.source === 'content_json' && !hasPrimary && !legacy) unresolvedContent.push({ key, references: entry.references ?? [] });
}

const orphanPhysical = physicalFiles
  .map(relPublic)
  .filter((file) => !expectedPhysical.has(file) && !file.endsWith('/.gitkeep'));

const nestedSpriteFiles = physicalFiles
  .map(relPublic)
  .filter((file) => file.includes('/assets/sprites/sprites/'));

const legacyBackgroundFiles = physicalFiles
  .map(relPublic)
  .filter((file) => file.includes('/assets/backgrounds/') && !file.includes('/assets/backgrounds/legacy/'));

const lines = [];
lines.push('# ASSET Folder Structure Standardization Audit');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Summary');
lines.push(`- Runtime/content asset-like keys scanned: ${refs.length}`);
lines.push(`- Expected unique keys and exact frames: ${expected.size}`);
lines.push(`- Physical assets scanned: ${physicalFiles.length}`);
lines.push(`- Missing primary files: ${missingPrimary.length}`);
lines.push(`- Legacy-only files: ${legacyOnly.length}`);
lines.push(`- Fallback-safe missing production assets: ${fallbackSafeMissing.length}`);
lines.push(`- Content keys with no physical primary or legacy file: ${unresolvedContent.length}`);
lines.push(`- Physical-only orphan/legacy candidates: ${orphanPhysical.length}`);
lines.push('');
lines.push('## Missing primary files');
missingPrimary.slice(0, 300).forEach((x) => lines.push(`- \`${x.key}\` -> \`${x.primary ?? 'unknown'}\` (${x.source})`));
if (missingPrimary.length === 0) lines.push('- None');
lines.push('');
lines.push('## Files only found in legacy fallback paths');
legacyOnly.slice(0, 200).forEach((x) => lines.push(`- \`${x.key}\` -> \`${x.legacy}\``));
if (legacyOnly.length === 0) lines.push('- None');
lines.push('');
lines.push('## Content keys with no physical file in primary or fallback');
unresolvedContent.slice(0, 300).forEach((x) => lines.push(`- \`${x.key}\` from ${x.references.slice(0, 3).join(', ')}`));
if (unresolvedContent.length === 0) lines.push('- None');
lines.push('');
lines.push('## Duplicate nested sprites/sprites paths');
nestedSpriteFiles.forEach((x) => lines.push(`- \`${x}\``));
if (nestedSpriteFiles.length === 0) lines.push('- None');
lines.push('');
lines.push('## Non-legacy backgrounds folder files');
legacyBackgroundFiles.forEach((x) => lines.push(`- \`${x}\``));
if (legacyBackgroundFiles.length === 0) lines.push('- None');
lines.push('');
lines.push('## Orphan physical files');
orphanPhysical.slice(0, 300).forEach((x) => lines.push(`- \`${x}\``));
if (orphanPhysical.length === 0) lines.push('- None');

fs.writeFileSync(REPORT_PATH, `${lines.join('\n')}\n`, 'utf8');

console.log(`Runtime/content asset-like keys scanned: ${refs.length}`);
console.log(`Expected unique keys and exact frames: ${expected.size}`);
console.log(`Physical assets scanned: ${physicalFiles.length}`);
console.log(`Missing primary files: ${missingPrimary.length}`);
console.log(`Legacy-only files: ${legacyOnly.length}`);
console.log(`Fallback-safe missing production assets: ${fallbackSafeMissing.length}`);
console.log(`Content keys with no physical primary or legacy file: ${unresolvedContent.length}`);
console.log(`Physical-only orphan/legacy candidates: ${orphanPhysical.length}`);
console.log(`Duplicate nested sprites/sprites files: ${nestedSpriteFiles.length}`);

if (STRICT && unresolvedContent.length > 0) {
  process.exitCode = 1;
}
