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
const counterTags = new Set([
  'counter_junk',
  'counter_sticky',
  'counter_float',
  'counter_freeze',
  'counter_preview',
  'counter_speed',
  'counter_sleep',
  'counter_incoming_junk',
  'counter_low_ceiling',
  'counter_royal',
  'counter_pattern',
  'counter_board_size',
  'counter_piece_queue'
]);
const itemCategories = new Set(['heal', 'mana', 'board_cleanse', 'hazard_counter', 'spell_catalyst', 'queue_control', 'enemy_pressure', 'emergency', 'risk_reward']);
const itemTimings = new Set(['instant', 'before_spell', 'after_hazard', 'during_enemy_warning', 'before_piece_lock', 'map_only', 'shop_only']);
const rewardTypes = new Set(['gold', 'heal', 'mana', 'shield', 'item', 'relic', 'upgrade', 'stage_modifier', 'boss_modifier', 'hazard_modifier', 'battle_modifier']);
const knownHazards = new Map([
  ['hazard_floaty_rune', { warningText: 'A Floaty Rune is wobbling overhead!', severity: 'minor', itemCounterHints: ['Cloud Pin'], spellCounterHints: ['Bomb Rune'], cascadeCounterHint: 'Clear space below it before it drops.' }],
  ['hazard_incoming_junk_queue', { warningText: 'Crumb junk is lining up in the snack tray!', severity: 'moderate', itemCounterHints: ['Snack Shield', 'Return Stamp', 'Trash Lid'], spellCounterHints: ['Bomb Rune'], cascadeCounterHint: 'Trigger a cascade to reduce incoming junk.' }],
  ['hazard_freeze_warning', { warningText: 'Frost is gathering around your active block!', severity: 'moderate', itemCounterHints: ['Hot Cocoa'], spellCounterHints: ['Frost Lock'] }],
  ['hazard_preview_hidden', { warningText: 'A Sugar Bat is blocking your preview!', severity: 'minor', itemCounterHints: ['Preview Glasses'], spellCounterHints: [] }],
  ['hazard_low_ceiling', { warningText: 'The ceiling is getting suspiciously lower!', severity: 'major', itemCounterHints: ['Tent Pole', 'Safety Net'], spellCounterHints: ['Clean Cut'] }],
  ['hazard_royal_pattern', { warningText: 'Bloxley demands a proper rectangle!', severity: 'boss', itemCounterHints: ['Royal Eraser'], spellCounterHints: ['Bomb Rune'], cascadeCounterHint: 'Cascades soften pattern pressure.' }],
  ['hazard_bad_piece_delivery', { warningText: 'A goblin put something weird in the queue!', severity: 'minor', itemCounterHints: ['Nope Stamp', 'Queue Comb'], spellCounterHints: [] }],
  ['hazard_speed_wave', { warningText: 'The floor is wobbling faster!', severity: 'moderate', itemCounterHints: ['Speed Brake'], spellCounterHints: ['Frost Lock'] }],
  ['hazard_sleep_warning', { warningText: 'A pillow-soft tune is trying to make the room drowsy!', severity: 'moderate', itemCounterHints: ['Alarm Cookie'], spellCounterHints: [] }]
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
const warnings = [];
const allJsonFiles = walkJson(contentRoot);
for (const file of allJsonFiles) {
  try {
    const data = readJson(file);
    for (const keyField of ['spriteKey', 'iconKey', 'portraitKey', 'backgroundKey']) {
      if (data[keyField] !== undefined && (typeof data[keyField] !== 'string' || data[keyField].length === 0)) {
        errors.push(`${path.relative(root, file)}: ${keyField} must be a non-empty string when present`);
      }
    }
    if (data.assetRefs !== undefined) {
      if (!data.assetRefs || typeof data.assetRefs !== 'object' || Array.isArray(data.assetRefs)) {
        errors.push(`${path.relative(root, file)}: assetRefs must be an object`);
      } else {
        for (const [refKey, refValue] of Object.entries(data.assetRefs)) {
          const valid = typeof refValue === 'string' || (Array.isArray(refValue) && refValue.every((entry) => typeof entry === 'string' && entry.length > 0));
          if (!valid) errors.push(`${path.relative(root, file)}: assetRefs.${refKey} must be a string or string array`);
        }
      }
    }
    if (file.includes(`${path.sep}items${path.sep}`) && path.basename(file) !== 'metadata.json') {
      if (data.itemCategory && !itemCategories.has(data.itemCategory)) errors.push(`${path.relative(root, file)}: invalid itemCategory ${data.itemCategory}`);
      if (data.timing && !itemTimings.has(data.timing)) errors.push(`${path.relative(root, file)}: invalid timing ${data.timing}`);
      if (data.maxStack !== undefined && (!Number.isFinite(data.maxStack) || data.maxStack <= 0)) errors.push(`${path.relative(root, file)}: maxStack must be positive`);
      for (const tag of data.counterTags ?? []) {
        if (!counterTags.has(tag)) errors.push(`${path.relative(root, file)}: invalid counterTag ${tag}`);
      }
    }
  } catch (error) {
    errors.push(`${path.relative(root, file)}: invalid JSON: ${error.message}`);
  }
}

for (const [hazardId, hazard] of knownHazards) {
  if (!hazard.warningText) errors.push(`${hazardId}: missing warning text`);
  if ((hazard.severity === 'major' || hazard.severity === 'boss') && hazard.itemCounterHints.length === 0) {
    errors.push(`${hazardId}: major/boss hazard needs item counter hints`);
  }
  if ((hazard.severity === 'major' || hazard.severity === 'boss') && hazard.spellCounterHints.length === 0 && !hazard.cascadeCounterHint) {
    errors.push(`${hazardId}: major/boss hazard needs spell or cascade counter hint`);
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
      } else if (!rewardTypes.has(choice.rewardConfig.rewardType)) {
        errors.push(`${scene.id}/${choice.id}: invalid route rewardType ${choice.rewardConfig.rewardType}`);
      }
      const riskHazard = choice.riskConfig?.addHazardId ?? choice.riskConfig?.hazardIncrease;
      if (riskHazard && ![...knownHazards.keys()].some((hazardId) => riskHazard.includes(hazardId) || riskHazard.includes(hazardId.replace(/^hazard_/, '').replace(/_warning$/, '')) || riskHazard.includes('sticky') || riskHazard.includes('machine') || riskHazard.includes('junk') || riskHazard.includes('sleep') || riskHazard.includes('preview'))) {
        errors.push(`${scene.id}/${choice.id}: risky route hazard ${riskHazard} has no counter metadata mapping`);
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

if (warnings.length) {
  console.warn(warnings.join('\n'));
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Content validation passed (${allJsonFiles.length} JSON files, ${sceneIds.size} route scenes).`);
