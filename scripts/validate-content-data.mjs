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
const stageAliases = new Map([
  ['stage_1_sprinkle_sewers', 'stage_sprinkle_sewers'],
  ['stage_2_goblin_workshop', 'stage_goblin_workshop'],
  ['stage_3_frosty_pantry', 'stage_frosty_pantry'],
  ['stage_4_pillow_castle', 'stage_pillow_castle'],
  ['stage_5_starfall_arcade', 'stage_starfall_arcade'],
  ['stage_6_bloxley_block_palace', 'stage_bloxley_block_palace'],
  ['stage_6_bloxleys_block_palace', 'stage_bloxley_block_palace'],
  ['stage_bloxleys_block_palace', 'stage_bloxley_block_palace']
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
const levelUpCardTypes = new Set(['general', 'hero', 'hero_specific', 'rare']);
const levelUpUpgradeTypes = new Set(['general', 'hero_specific']);
const levelUpEffectIds = new Set([
  'lvl_clear_line_damage',
  'lvl_max_hp_percent',
  'lvl_flat_hp',
  'lvl_mana_gain',
  'lvl_spell_damage',
  'lvl_cascade_damage',
  'lvl_starting_shield',
  'lvl_heal_after_node',
  'lvl_fever_gain',
  'lvl_hazard_resist',
  'lvl_entry_grace',
  'lvl_reward_reroll',
  'lvl_milo_plink_mana',
  'lvl_milo_calm_board',
  'lvl_milo_listener',
  'lvl_milo_gentle_finish',
  'lvl_pippa_preheat',
  'lvl_pippa_burn_sticky',
  'lvl_pippa_oven_guard',
  'lvl_pippa_hot_combo',
  'lvl_zuzu_bomb_friend',
  'lvl_zuzu_safety_clamp',
  'lvl_zuzu_extra_fuse',
  'lvl_zuzu_gadget_retry',
  'lvl_nixie_chill_timing',
  'lvl_nixie_soft_thaw',
  'lvl_nixie_slow_entry',
  'lvl_nixie_preserve',
  'lvl_bruk_snack_armor',
  'lvl_bruk_table_shield',
  'lvl_bruk_no_snack_lost',
  'lvl_bruk_victory_plate',
  'lvl_lumi_star_guidance',
  'lvl_lumi_cascade_wish',
  'lvl_lumi_preview_light',
  'lvl_lumi_wishkeeper'
]);
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

function walkFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full, predicate);
    return entry.isFile() && predicate(full) ? [full] : [];
  });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function canonicalStageId(stageId) {
  if (typeof stageId !== 'string') return null;
  const normalized = stageId.trim().toLowerCase();
  if (stageIds.has(normalized)) return normalized;
  return stageAliases.get(normalized) ?? null;
}

function validateStageId(value, location) {
  const canonical = canonicalStageId(value);
  if (!canonical) {
    errors.push(`${location}: invalid or missing stageId ${value}`);
    return null;
  }
  if (value !== canonical) {
    errors.push(`${location}: stageId alias ${value} must use canonical runtime ID ${canonical}`);
  }
  return canonical;
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

for (const file of walkJson(path.join(contentRoot, 'upgrades')).filter((file) => path.basename(file) !== 'metadata.json')) {
  const data = readJson(file);
  const rel = path.relative(root, file);
  if (typeof data.id === 'string' && data.id.startsWith('upg_lvl_')) {
    if (!levelUpUpgradeTypes.has(data.upgradeType)) errors.push(`${rel}: invalid upgradeType ${data.upgradeType}`);
    if (!levelUpCardTypes.has(data.cardType)) errors.push(`${rel}: invalid cardType ${data.cardType}`);
    if (!Number.isFinite(data.stackLimit) || data.stackLimit <= 0) errors.push(`${rel}: stackLimit must be > 0`);
    if (!levelUpEffectIds.has(data.effectId)) errors.push(`${rel}: unknown level-up effectId ${data.effectId}`);
    if (data.upgradeType === 'hero_specific' && !heroIds.has(data.heroId)) {
      errors.push(`${rel}: hero-specific level-up card must use valid heroId`);
    }
    if (data.levelUpOnly !== true) {
      warnings.push(`${rel}: expected levelUpOnly=true for upg_lvl_ card`);
    }
  }
}


function visitStrings(value, callback, pointer = '') {
  if (typeof value === 'string') {
    callback(value, pointer);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitStrings(entry, callback, `${pointer}/${index}`));
    return;
  }
  for (const [key, child] of Object.entries(value)) visitStrings(child, callback, `${pointer}/${key}`);
}

const monsterEntries = [];
const monsterIds = new Set();
const duplicateMonsterIds = new Set();
const validMonsterRanks = new Set(['regular', 'elite', 'elite_miniboss', 'boss']);
const validEncounterRanks = new Set(['regular', 'elite', 'boss']);
const monsterRoot = path.join(contentRoot, 'monsters');

for (const file of allJsonFiles) {
  const data = readJson(file);
  visitStrings(data, (value, pointer) => {
    if (value.includes('public/assets') || value.includes('/assets/')) {
      errors.push(`${path.relative(root, file)}${pointer}: content JSON must use asset keys, not raw asset paths`);
    }
  });
}

for (const file of walkJson(monsterRoot).filter((file) => path.basename(file) !== 'metadata.json')) {
  const data = readJson(file);
  monsterEntries.push({ file, data });
  if (monsterIds.has(data.id)) duplicateMonsterIds.add(data.id);
  monsterIds.add(data.id);
}
for (const id of duplicateMonsterIds) errors.push(`Duplicate monster ID: ${id}`);

function expectedMonsterAssetRefs(id) {
  if (id.startsWith('mon_boss_')) {
    const bossId = id.replace(/^mon_/, '');
    return {
      idle: `${bossId}__idle`,
      attack: `${bossId}__attack`,
      hit: `${bossId}__hit`,
      defeat: `${bossId}__defeat`,
      icon: `ico_${bossId}`,
      poseSheet: `${bossId}__pose_sheet_2x2`
    };
  }
  return {
    idle: `${id}__idle`,
    attack: `${id}__attack`,
    hit: `${id}__hit`,
    defeat: `${id}__defeat`,
    icon: `ico_${id}`,
    poseSheet: `${id}__pose_sheet_2x2`
  };
}

for (const { file, data } of monsterEntries) {
  const rel = path.relative(root, file);
  if (typeof data.id !== 'string' || data.id.length === 0) errors.push(`${rel}: missing monster ID`);
  validateStageId(data.stageId, rel);
  if (!validMonsterRanks.has(data.rank)) errors.push(`${rel}: invalid or missing rank ${data.rank}`);
  if (!validEncounterRanks.has(data.encounterRank)) errors.push(`${rel}: invalid or missing encounterRank ${data.encounterRank}`);
  if (typeof data.spriteKey !== 'string' || data.spriteKey.length === 0) errors.push(`${rel}: missing spriteKey`);
  if (typeof data.iconKey !== 'string' || data.iconKey.length === 0) errors.push(`${rel}: missing iconKey`);
  if (!data.assetRefs || typeof data.assetRefs !== 'object') errors.push(`${rel}: missing assetRefs`);
  const expected = expectedMonsterAssetRefs(data.id ?? '');
  if (data.rank === 'boss') {
    const bossId = data.id?.replace(/^mon_/, '');
    if (data.spriteKey !== bossId) errors.push(`${rel}: boss spriteKey should be ${bossId}`);
    if (data.iconKey !== `ico_${bossId}`) errors.push(`${rel}: boss iconKey should be ico_${bossId}`);
  } else {
    if (data.spriteKey !== data.id) errors.push(`${rel}: spriteKey should be ${data.id}`);
    if (data.iconKey !== `ico_${data.id}`) errors.push(`${rel}: iconKey should be ico_${data.id}`);
  }
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (data.assetRefs?.[key] !== expectedValue) errors.push(`${rel}: assetRefs.${key} should be ${expectedValue}`);
  }
  if (data.rank === 'elite' || data.rank === 'elite_miniboss') {
    if (data.role !== 'elite' || data.rarity !== 'elite' || data.encounterRank !== 'elite') errors.push(`${rel}: elite monster must be marked role/rarity/encounterRank elite`);
  }
  if (data.rank === 'regular' && (data.role === 'elite' || data.rarity === 'elite' || data.encounterRank !== 'regular')) {
    errors.push(`${rel}: regular monster is accidentally marked elite`);
  }
}

const monsterMetadata = readJson(path.join(monsterRoot, 'metadata.json'));
for (const [alias, target] of Object.entries(monsterMetadata.compatibilityAliases ?? {})) {
  if (!monsterIds.has(target)) errors.push(`src/game/content/monsters/metadata.json: compatibility alias ${alias} points to missing monster ${target}`);
}

const monsterById = new Map(monsterEntries.map(({ data }) => [data.id, data]));
for (const file of walkJson(path.join(contentRoot, 'stages')).filter((file) => path.basename(file) !== 'metadata.json')) {
  const stage = readJson(file);
  const rel = path.relative(root, file);
  for (const monsterId of stage.monsterPool ?? []) {
    const monster = monsterById.get(monsterId);
    if (!monster) errors.push(`${rel}: monsterPool references missing monster ${monsterId}`);
    else if (monster.rank !== 'regular') errors.push(`${rel}: monsterPool must only contain regular monsters, found ${monsterId}`);
  }
  for (const monsterId of stage.eliteMonsterPool ?? []) {
    const monster = monsterById.get(monsterId);
    if (!monster) errors.push(`${rel}: eliteMonsterPool references missing monster ${monsterId}`);
    else if (!(monster.rank === 'elite' || monster.rank === 'elite_miniboss')) errors.push(`${rel}: eliteMonsterPool must only contain elite monsters, found ${monsterId}`);
  }
  const boss = monsterById.get(stage.bossId);
  if (!boss) errors.push(`${rel}: bossId references missing monster ${stage.bossId}`);
  else if (boss.rank !== 'boss') errors.push(`${rel}: bossId must reference boss monster content, found ${stage.bossId}`);
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
    validateStageId(scene.stageId, scene.id);
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

// Biome Monster Pools Validation
const biomePoolFile = path.join(contentRoot, 'difficulty-scaling', 'biome-monster-pools.json');
if (fs.existsSync(biomePoolFile)) {
  const pools = readJson(biomePoolFile);
  for (const pool of pools) {
    const rel = 'src/game/content/difficulty-scaling/biome-monster-pools.json';
    validateStageId(pool.stageId, `${rel}: pool ${pool.id}`);
    if (!monsterIds.has(pool.fallbackMonsterId)) errors.push(`${rel}: pool ${pool.id} has invalid fallbackMonsterId ${pool.fallbackMonsterId}`);
    if (pool.maxDuplicatePerNode < 1) errors.push(`${rel}: pool ${pool.id} maxDuplicatePerNode must be >= 1`);
    
    for (const rule of pool.monsterRules) {
      if (!monsterIds.has(rule.monsterId)) errors.push(`${rel}: pool ${pool.id} rule references missing monster ${rule.monsterId}`);
      if (rule.weight <= 0) errors.push(`${rel}: pool ${pool.id} monster ${rule.monsterId} has non-positive weight`);
    }
  }
}

// Encounter Pack Scaling Validation
const scalingFile = path.join(contentRoot, 'difficulty-scaling', 'encounter-pack-scaling.json');
if (fs.existsSync(scalingFile)) {
  const rules = readJson(scalingFile);
  for (const rule of rules) {
    const rel = 'src/game/content/difficulty-scaling/encounter-pack-scaling.json';
    validateStageId(rule.stageId, `${rel}: rule ${rule.id}`);
    if (rule.minEnemies > rule.maxEnemies) errors.push(`${rel}: rule ${rule.id} minEnemies > maxEnemies`);
    if (rule.maxEnemies > 5) errors.push(`${rel}: rule ${rule.id} maxEnemies exceeds schema limit of 5`);
    if (rule.stageNumber === 1 && rule.maxEnemies > 2) errors.push(`${rel}: stage 1 rule ${rule.id} maxEnemies > 2 (Release 1 safety)`);
    if (rule.nodeType === 'boss' && rule.maxEnemies > 1) errors.push(`${rel}: boss rule ${rule.id} should only have 1 enemy for Release 1`);
  }
}

// Enemy Entry Effects Validation
const entryEffectsFile = path.join(contentRoot, 'difficulty-scaling', 'enemy-entry-effects.json');
if (fs.existsSync(entryEffectsFile)) {
  const effects = readJson(entryEffectsFile);
  for (const effect of effects) {
    const rel = 'src/game/content/difficulty-scaling/enemy-entry-effects.json';
    if (!effect.warningText && effect.id !== 'entry_none' && effect.id !== 'entry_none_safe') {
      errors.push(`${rel}: effect ${effect.id} missing warningText`);
    }
    if (!effect.eventLogText) errors.push(`${rel}: effect ${effect.id} missing eventLogText`);
    if (effect.pressureEffectId && !effect.playerGiftEffectId) {
      errors.push(`${rel}: pressure effect ${effect.id} must include a playerGiftEffectId for fairness`);
    }
  }
}

const docsRoot = path.join(root, 'docs');
const docsStagePattern = /\bstage_[a-z0-9_]+\b/g;
for (const file of walkFiles(docsRoot, (file) => file.endsWith('.md'))) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  const matches = new Set(text.match(docsStagePattern) ?? []);
  for (const token of matches) {
    const canonical = canonicalStageId(token);
    if (!canonical) continue;
    if (token !== canonical) {
      errors.push(`${rel}: stage ID alias ${token} must be canonicalized to ${canonical}`);
    }
  }
}

if (warnings.length) {
  console.warn(warnings.join('\n'));
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Content validation passed (${allJsonFiles.length} JSON files, ${sceneIds.size} route scenes).`);
