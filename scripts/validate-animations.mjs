import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const standardsPath = path.join(projectRoot, 'src/game/data/animation-standards.json');
const contentRoot = path.join(projectRoot, 'src/game/content');
const docsRoot = path.join(projectRoot, 'docs');
const publicRoot = path.join(projectRoot, 'public');

const requiredAnimationIds = [
  'anim_block_red_glow',
  'anim_block_red_clear',
  'anim_block_bomb_explode',
  'anim_vfx_line_clear',
  'anim_vfx_cascade_pop',
  'anim_vfx_bomb_explosion',
  'anim_vfx_enemy_hit',
  'anim_spell_fireball',
  'anim_item_snack_vacuum_use',
  'anim_hero_milo_blockmancer_idle',
  'anim_hazard_incoming_junk_warning',
  'anim_ui_reward_card_flip'
];

async function listFiles(dir, predicate) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, predicate));
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function assertPositiveExactInteger(value, label, errors) {
  if (!Number.isInteger(value) || value <= 0) {
    errors.push(`${label} must be a positive exact integer frame count.`);
  }
}

function makeAnimationId(category, assetId, animationName) {
  if (category === 'boardBlock') {
    return `anim_${assetId.replace(/^spr_/, '')}_${animationName}`;
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
    return `anim_${assetId}_${animationName}`;
  }
  if (category === 'monster') {
    return `anim_${assetId}_${animationName}`;
  }
  if (category === 'boss') {
    return `anim_${assetId}_${animationName}`;
  }
  return `anim_${assetId}`;
}

function folderFor(category, assetId, animationName) {
  if (category === 'boardBlock') {
    const blockId = assetId.replace(/^spr_/, '');
    return animationName === 'glow' || animationName === 'clear'
      ? `assets/sprites/board-blocks/${blockId}/${animationName}`
      : `assets/sprites/board-blocks/${blockId}/special`;
  }
  if (category === 'spell') return `assets/effects/${assetId}`;
  if (category === 'item') return `assets/effects/items/${assetId}/${animationName}`;
  if (category === 'hero') return `assets/sprites/heroes/${assetId}/${animationName}`;
  if (category === 'monster') return `assets/sprites/monsters/${assetId}/${animationName}`;
  if (category === 'boss') return `assets/sprites/bosses/${assetId}/${animationName}`;
  if (category === 'hazardUi') return `assets/ui/animations/hazards/${assetId}`;
  if (category === 'ui') return `assets/ui/animations/${assetId}`;
  return `assets/effects/${assetId}`;
}

function addDefinition(definitions, category, assetId, animationName, frameCount, errors) {
  assertPositiveExactInteger(frameCount, `${category}:${assetId}:${animationName}`, errors);
  definitions.set(makeAnimationId(category, assetId, animationName), {
    category,
    assetId,
    animationName,
    frameCount
  });
}

async function readContentIds(folder) {
  const dir = path.join(contentRoot, folder);
  const files = await listFiles(dir, (file) => file.endsWith('.json') && !file.endsWith('metadata.json'));
  const ids = [];
  for (const file of files) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    ids.push(parsed.id);
  }
  return ids;
}

async function buildDefinitions(standards, errors) {
  const definitions = new Map();
  Object.values(standards.boardBlocks).forEach((block) => {
    Object.entries(block.animations).forEach(([name, count]) => addDefinition(definitions, 'boardBlock', block.assetId, name, count, errors));
  });
  Object.entries(standards.coreVfx).forEach(([id, count]) => addDefinition(definitions, 'vfx', id, 'play', count, errors));
  Object.entries(standards.spellVfx).forEach(([id, count]) => addDefinition(definitions, 'spell', id, 'cast', count, errors));
  standards.items.basicUseVfx.forEach((id) => addDefinition(definitions, 'item', id, 'use_vfx', 5, errors));
  standards.items.reactiveCounterVfx.forEach((id) => {
    addDefinition(definitions, 'item', id, 'use_vfx', 6, errors);
    addDefinition(definitions, 'item', id, 'counter_success_vfx', 5, errors);
  });
  standards.items.spellCatalystVfx.forEach((id) => {
    addDefinition(definitions, 'item', id, 'catalyst_ready_vfx', 4, errors);
    addDefinition(definitions, 'item', id, 'catalyst_consume_vfx', 5, errors);
  });
  standards.heroes.forEach((id) => {
    Object.entries(standards.heroAnimations).forEach(([name, count]) => addDefinition(definitions, 'hero', id, name, count, errors));
  });
  const monsterIds = (await readContentIds('monsters')).filter((id) => !id.startsWith('mon_boss_'));
  monsterIds.forEach((id) => {
    Object.entries(standards.monsterAnimations).forEach(([name, count]) => addDefinition(definitions, 'monster', id, name, count, errors));
  });
  standards.bosses.forEach((id) => {
    Object.entries(standards.bossAnimations).forEach(([name, count]) => addDefinition(definitions, 'boss', id, name, count, errors));
  });
  Object.entries(standards.hazardUi).forEach(([id, count]) => addDefinition(definitions, 'hazardUi', id, 'warning', count, errors));
  Object.entries(standards.ui).forEach(([id, count]) => addDefinition(definitions, 'ui', id, 'default', count, errors));
  return definitions;
}

async function validateDocs(errors) {
  const docs = await listFiles(docsRoot, (file) => file.endsWith('.md'));
  const frameRangePattern = /\b(?:minimum\s+\d+\s+frames?|around\s+\d+\s+frames?|\d+\s*(?:-|to)\s*\d+\s+frames?)\b/i;
  for (const file of docs) {
    const text = await readFile(file, 'utf8');
    if (frameRangePattern.test(text)) {
      errors.push(`Frame range wording found in ${path.relative(projectRoot, file)}.`);
    }
  }
}

async function validateContentAnimationRefs(definitions, errors) {
  const contentFiles = await listFiles(contentRoot, (file) => file.endsWith('.json') && !file.endsWith('metadata.json'));
  const refKeys = new Set([
    'animationKey',
    'vfxKey',
    'useVfxKey',
    'hitVfxKey',
    'clearAnimationKey',
    'glowAnimationKey',
    'warningAnimationKey',
    'counterSuccessVfxKey',
    'catalystReadyVfxKey',
    'catalystConsumeVfxKey'
  ]);

  function visit(value, file, pointer = '') {
    if (!value || typeof value !== 'object') {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, file, `${pointer}/${index}`));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (refKeys.has(key) && typeof child === 'string' && !definitions.has(child)) {
        errors.push(`Unknown animation reference ${child} at ${path.relative(projectRoot, file)}${pointer}/${key}.`);
      }
      visit(child, file, `${pointer}/${key}`);
    }
  }

  for (const file of contentFiles) {
    visit(JSON.parse(await readFile(file, 'utf8')), file);
  }
}

async function warnMissingPngs(definitions) {
  let missing = 0;
  for (const definition of definitions.values()) {
    const folder = folderFor(definition.category, definition.assetId, definition.animationName);
    for (let index = 0; index < definition.frameCount; index += 1) {
      const relative = `${folder}/${definition.assetId}__${definition.animationName}__f${String(index).padStart(2, '0')}.png`;
      try {
        await stat(path.join(publicRoot, relative));
      } catch {
        missing += 1;
      }
    }
  }
  if (missing > 0) {
    console.warn(`Animation PNG asset warning: ${missing} expected frame file(s) are not present yet. This is non-fatal.`);
  }
}

async function readPngDimensions(filePath) {
  const bytes = await readFile(filePath);
  if (bytes.length < 24) {
    throw new Error('PNG too small');
  }
  const signature = bytes.subarray(0, 8);
  const expected = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!signature.equals(expected)) {
    throw new Error('Invalid PNG signature');
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  return { width, height };
}

async function validateCharacterPoseSheets() {
  const monsterIds = await readContentIds('monsters');
  let badDimensions = 0;
  let missingPreferred = 0;

  for (const monsterId of monsterIds) {
    const isBoss = monsterId.startsWith('mon_boss_');
    const actorId = isBoss ? monsterId.replace(/^mon_/, '') : monsterId;
    const folder = isBoss ? 'bosses' : 'monsters';
    const preferredSheet = path.join(publicRoot, `assets/sprites/${folder}/${actorId}/sheet/${actorId}__pose_sheet_2x2.png`);
    const fallbackIdle = path.join(publicRoot, `assets/sprites/${folder}/${actorId}/idle/${actorId}__idle__f00.png`);

    let hasSheet = false;
    try {
      await stat(preferredSheet);
      hasSheet = true;
      const { width, height } = await readPngDimensions(preferredSheet);
      if (width !== 1254 || height !== 1254) {
        badDimensions += 1;
        console.warn(`Character sheet warning: ${path.relative(projectRoot, preferredSheet)} expected 1254x1254 but got ${width}x${height}.`);
      }
    } catch {
      missingPreferred += 1;
    }

    if (hasSheet) {
      continue;
    }

    try {
      await stat(fallbackIdle);
    } catch {
      console.warn(`Character sheet warning: missing both preferred sheet and fallback idle for ${actorId}.`);
    }
  }

  if (missingPreferred > 0) {
    console.warn(`Character sheet warning: ${missingPreferred} monster/boss entries are missing preferred 2x2 sheets (fallbacks allowed).`);
  }
  if (badDimensions > 0) {
    console.warn(`Character sheet warning: ${badDimensions} preferred sheet(s) have unexpected dimensions.`);
  }
}

async function main() {
  const errors = [];
  const standards = JSON.parse(await readFile(standardsPath, 'utf8'));
  const definitions = await buildDefinitions(standards, errors);

  requiredAnimationIds.forEach((id) => {
    if (!definitions.has(id)) {
      errors.push(`Required animation ID is missing from manifest standards: ${id}`);
    }
  });

  await validateDocs(errors);
  await validateContentAnimationRefs(definitions, errors);
  await warnMissingPngs(definitions);
  await validateCharacterPoseSheets();

  if (errors.length > 0) {
    console.error(`Found ${errors.length} animation validation error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`Validated ${definitions.size} exact animation definition(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
