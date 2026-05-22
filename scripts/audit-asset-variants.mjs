import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ASSET_ROOT = path.join(ROOT, 'public', 'assets');

function exists(rel) {
  return fs.existsSync(path.join(ASSET_ROOT, rel));
}

function listDirs(rel) {
  const full = path.join(ASSET_ROOT, rel);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
}

function walkFiles(rel = '') {
  const full = path.join(ASSET_ROOT, rel);
  if (!fs.existsSync(full)) return [];
  const out = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const childRel = path.join(rel, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) out.push(...walkFiles(childRel));
    else out.push(childRel);
  }
  return out;
}

const warnings = [];

for (const blockId of listDirs('sprites/board-blocks')) {
  for (const folder of ['base', 'glow', 'clear', 'special']) {
    if (!exists(`sprites/board-blocks/${blockId}/${folder}`)) {
      warnings.push(`board-block ${blockId} missing folder ${folder}`);
    }
  }
}

for (const heroId of listDirs('sprites/heroes')) {
  for (const state of ['idle', 'cast_spell', 'attack', 'hit', 'victory', 'defeat_tired', 'portrait_icon', 'sheet']) {
    if (!exists(`sprites/heroes/${heroId}/${state}`)) warnings.push(`hero ${heroId} missing ${state}`);
  }
}

for (const monId of listDirs('sprites/monsters')) {
  for (const state of ['idle', 'attack', 'hit', 'defeat', 'icon', 'sheet']) {
    if (!exists(`sprites/monsters/${monId}/${state}`)) warnings.push(`monster ${monId} missing ${state}`);
  }
}

for (const bossId of listDirs('sprites/bosses')) {
  for (const state of ['idle', 'attack', 'hit', 'phase_change', 'special_attack', 'defeat', 'portrait_icon', 'sheet']) {
    if (!exists(`sprites/bosses/${bossId}/${state}`)) warnings.push(`boss ${bossId} missing ${state}`);
  }
}

const stages = [
  ['stage_sprinkle_sewers', 'bg_boss_cupcake_slime_king_arena.png'],
  ['stage_goblin_workshop', 'bg_boss_prototype_no_7_arena.png'],
  ['stage_frosty_pantry', 'bg_boss_gelato_golem_arena.png'],
  ['stage_pillow_castle', 'bg_boss_sir_snore_a_lot_arena.png'],
  ['stage_starfall_arcade', 'bg_boss_high_score_hydra_arena.png'],
  ['stage_bloxley_block_palace', 'bg_boss_king_bloxley_arena.png']
];
for (const [stageId, bossArena] of stages) {
  for (const folder of ['battle', 'puzzle', 'boss-arena', 'map', 'route-scenes', 'props']) {
    if (!exists(`stages/${stageId}/${folder}`)) warnings.push(`stage ${stageId} missing ${folder}`);
  }
  if (!exists(`stages/${stageId}/boss-arena/${bossArena}`)) {
    warnings.push(`stage ${stageId} missing boss arena ${bossArena}`);
  }
}

for (const file of walkFiles('sprites/sprites')) {
  warnings.push(`nested sprites/sprites path is fallback-only and invalid as primary: ${file}`);
}

for (const file of walkFiles('backgrounds')) {
  if (!file.startsWith('backgrounds/legacy/')) {
    warnings.push(`backgrounds root path is fallback-only and invalid as primary: ${file}`);
  }
}

console.log(`Asset variant audit warnings: ${warnings.length}`);
for (const warning of warnings.slice(0, 500)) {
  console.log(`WARN: ${warning}`);
}
