import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'game', 'content');
const routeRoot = path.join(contentRoot, 'story', 'routes');
const heroIds = new Set([
  'hero_milo_blockmancer',
  'hero_pippa_pyromancer',
  'hero_zuzu_goblin_engineer',
  'hero_nixie_frostbinder',
  'hero_bruk_snack_knight',
  'hero_lumi_star_witch'
]);
const stageIds = new Set([
  'stage_sprinkle_sewers',
  'stage_goblin_workshop',
  'stage_frosty_pantry',
  'stage_pillow_castle',
  'stage_starfall_arcade',
  'stage_bloxley_block_palace'
]);

function walkJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJson(full);
    return entry.isFile() && entry.name.endsWith('.json') ? [full] : [];
  });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const errors = [];
for (const file of walkJson(contentRoot)) {
  try {
    readJson(file);
  } catch (error) {
    errors.push(`${path.relative(root, file)}: invalid JSON: ${error.message}`);
  }
}

const sceneIds = new Set();
const triggerIds = new Set();
const labelsByHero = new Map();
const scenesByHero = new Map();

for (const file of walkJson(routeRoot).filter((file) => path.basename(file).startsWith('route-scenes.'))) {
  const data = readJson(file);
  for (const scene of data.scenes ?? []) {
    if (sceneIds.has(scene.id)) errors.push(`Duplicate route scene id: ${scene.id}`);
    sceneIds.add(scene.id);
    if (triggerIds.has(scene.triggerId)) errors.push(`Duplicate route trigger id: ${scene.triggerId}`);
    triggerIds.add(scene.triggerId);
    if (!heroIds.has(scene.heroId)) errors.push(`${scene.id}: invalid heroId ${scene.heroId}`);
    if (!stageIds.has(scene.stageId)) errors.push(`${scene.id}: invalid stageId ${scene.stageId}`);
    if (scene.triggerCondition?.oncePerRun !== true) errors.push(`${scene.id}: triggerCondition.oncePerRun must be true`);
    if (!Array.isArray(scene.choices) || scene.choices.length !== 3) errors.push(`${scene.id}: must have exactly 3 choices`);
    const trueChoices = (scene.choices ?? []).filter((choice) => choice.lane === 'true');
    if (trueChoices.length !== 1 || typeof trueChoices[0]?.grantFlag !== 'string') {
      errors.push(`${scene.id}: must have exactly one true choice with one grantFlag`);
    }
    scenesByHero.set(scene.heroId, (scenesByHero.get(scene.heroId) ?? 0) + 1);
    const labels = labelsByHero.get(scene.heroId) ?? new Set();
    for (const choice of scene.choices ?? []) {
      if (labels.has(choice.label)) errors.push(`${scene.heroId}: repeated choice label ${choice.label}`);
      labels.add(choice.label);
      if (!choice.rewardConfig?.rewardId || !choice.rewardConfig?.rewardType) {
        errors.push(`${scene.id}/${choice.id}: missing functional rewardConfig`);
      }
    }
    labelsByHero.set(scene.heroId, labels);
  }
}

for (const heroId of heroIds) {
  const count = scenesByHero.get(heroId) ?? 0;
  if (count !== 6) errors.push(`${heroId}: expected 6 route scenes, found ${count}`);
}
if (sceneIds.size !== 36) errors.push(`Expected 36 route scenes, found ${sceneIds.size}`);
if (triggerIds.size !== 36) errors.push(`Expected 36 route triggers, found ${triggerIds.size}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Content validation passed (${walkJson(contentRoot).length} JSON files, ${sceneIds.size} route scenes).`);
