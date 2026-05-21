import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_ASSETS = path.join(ROOT, 'public', 'assets');

const STAGE_IDS = [
  'stage_sprinkle_sewers',
  'stage_goblin_workshop',
  'stage_frosty_pantry',
  'stage_pillow_castle',
  'stage_starfall_arcade',
  'stage_bloxley_block_palace'
];

const ICON_CATEGORIES = [
  'board-blocks',
  'battle-objectives',
  'boss-rules',
  'currencies',
  'collectibles',
  'chaos-rules',
  'items',
  'oopsies',
  'relics',
  'room-events',
  'random-gameplay-events',
  'status-effects',
  'upgrades',
  'weapons',
  'spells',
  'map-nodes',
  'hub-buildings',
  'route-story'
];

function ensureDir(relativePath) {
  const dir = path.join(PUBLIC_ASSETS, relativePath);
  fs.mkdirSync(dir, { recursive: true });
  const keep = path.join(dir, '.gitkeep');
  if (!fs.existsSync(keep)) {
    fs.writeFileSync(keep, '\n', 'utf8');
  }
}

const dirs = new Set([
  'board-blocks',
  'sprites',
  'sprites/board-blocks',
  'sprites/heroes',
  'sprites/monsters',
  'sprites/bosses',
  'effects',
  'icons',
  'stages',
  'stages/global-scenes',
  'backgrounds/legacy',
  'ui',
  'ui/panels',
  'ui/buttons',
  'ui/hud',
  'ui/meters',
  'ui/mobile-controls',
  'ui/story-routes',
  'ui/animations',
  'ui/placeholders',
  'portraits',
  'portraits/heroes',
  'portraits/npcs',
  'portraits/bosses',
  'story',
  'story/endings',
  'story/route-cards',
  'story/dialogue-panels',
  'audio',
  'audio/sfx',
  'audio/music',
  'audio/ui',
  'fonts',
  'placeholders',
  'store'
]);

for (const stageId of STAGE_IDS) {
  dirs.add(`stages/${stageId}`);
  dirs.add(`stages/${stageId}/battle`);
  dirs.add(`stages/${stageId}/puzzle`);
  dirs.add(`stages/${stageId}/boss-arena`);
  dirs.add(`stages/${stageId}/map`);
  dirs.add(`stages/${stageId}/route-scenes`);
  dirs.add(`stages/${stageId}/props`);
}

for (const category of ICON_CATEGORIES) {
  dirs.add(`icons/${category}`);
}

for (const relativePath of [...dirs].sort()) {
  ensureDir(relativePath);
}

console.log(`Ensured ${dirs.size} standardized asset folder(s).`);
