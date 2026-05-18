import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_ASSETS = path.join(ROOT, 'public', 'assets');
const CONTENT_ROOT = path.join(ROOT, 'src', 'game', 'content');
const STANDARDS_PATH = path.join(ROOT, 'src', 'game', 'data', 'animation-standards.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listContentIds(folder) {
  const dir = path.join(CONTENT_ROOT, folder);
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.json') && file !== 'metadata.json')
    .map((file) => readJson(path.join(dir, file)).id)
    .filter((id) => typeof id === 'string' && id.length > 0);
}

function ensureDir(relativePath) {
  const dir = path.join(PUBLIC_ASSETS, relativePath);
  fs.mkdirSync(dir, { recursive: true });
  const keep = path.join(dir, '.gitkeep');
  if (!fs.existsSync(keep)) {
    fs.writeFileSync(keep, '\n', 'utf8');
  }
}

function bossAssetId(monsterId) {
  return monsterId.replace(/^mon_/, '');
}

const standards = readJson(STANDARDS_PATH);
const dirs = new Set([
  'board-blocks',
  'sprites',
  'effects',
  'icons',
  'heroes',
  'monsters',
  'bosses',
  'stages',
  'ui',
  'ui/animations',
  'ui/story-routes',
  'icons/story-routes',
  'portraits/heroes',
  'portraits/npcs',
  'story/endings',
  'stage-backgrounds/route-scenes',
  'audio'
]);

for (const block of Object.values(standards.boardBlocks)) {
  const blockId = block.assetId.replace(/^spr_/, '');
  dirs.add(`sprites/board-blocks/${blockId}/base`);
  dirs.add(`sprites/board-blocks/${blockId}/glow`);
  dirs.add(`sprites/board-blocks/${blockId}/clear`);
  dirs.add(`sprites/board-blocks/${blockId}/special`);
}

for (const heroId of listContentIds('heroes')) {
  for (const state of ['idle', 'cast_spell', 'attack', 'hit', 'victory', 'defeat_tired', 'portrait', 'silhouette_locked']) {
    dirs.add(`sprites/heroes/${heroId}/${state}`);
  }
}

for (const monsterId of listContentIds('monsters')) {
  if (monsterId.startsWith('mon_boss_')) {
    const actorId = bossAssetId(monsterId);
    for (const state of ['idle', 'attack', 'hit', 'phase_change', 'special_attack', 'defeat', 'intro_portrait']) {
      dirs.add(`sprites/bosses/${actorId}/${state}`);
    }
    continue;
  }

  for (const state of ['idle', 'attack', 'hit', 'defeat']) {
    dirs.add(`sprites/monsters/${monsterId}/${state}`);
  }
}

for (const vfxId of Object.keys(standards.coreVfx)) {
  dirs.add(`effects/${vfxId}`);
}

for (const spellId of Object.keys(standards.spellVfx)) {
  dirs.add(`effects/${spellId}`);
}

for (const itemId of [
  ...standards.items.basicUseVfx,
  ...standards.items.reactiveCounterVfx,
  ...standards.items.spellCatalystVfx
]) {
  for (const state of ['use_vfx', 'counter_success_vfx', 'catalyst_ready_vfx', 'catalyst_consume_vfx']) {
    dirs.add(`effects/items/${itemId}/${state}`);
  }
}

for (const hazardId of Object.keys(standards.hazardUi)) {
  dirs.add(`ui/animations/hazards/${hazardId}`);
}

for (const uiId of Object.keys(standards.ui)) {
  dirs.add(`ui/animations/${uiId}`);
}

for (const relativePath of [...dirs].sort()) {
  ensureDir(relativePath);
}

console.log(`Ensured ${dirs.size} final asset folder(s).`);
