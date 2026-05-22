import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const failures = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const heroSystemText = readText('src/game/systems/HeroSystem.ts');
assert(!heroSystemText.includes('RELEASE_1_SPELL_CONTENT_IDS'), 'HeroSystem still injects full Release 1 spell pool.');

const battleSceneText = readText('src/game/scenes/BattleScene.ts');
assert(battleSceneText.includes('this.getPlayableSpells()[slot]'), 'BattleScene hotkey spell cast is not bound to active run spell list.');
assert(battleSceneText.includes('applyBossPhaseBoardSize'), 'Boss phase board-size modifier is not wired in BattleScene.');

const releaseRouteHeroes = [
  'milo_blockmancer',
  'pippa_pyromancer',
  'zuzu_goblin_engineer',
  'nixie_frostbinder',
  'bruk_snack_knight',
  'lumi_star_witch'
];
for (const heroFile of releaseRouteHeroes) {
  const hero = readJson(`src/game/content/heroes/${heroFile}.json`);
  assert(Array.isArray(hero?.startingLoadout?.spellIds) && hero.startingLoadout.spellIds.length > 0, `${hero.id} has empty starting spell loadout.`);
}

const poplin = readJson('src/game/content/heroes/poplin_professor.json');
const bloop = readJson('src/game/content/heroes/bloop_slime_friend.json');
assert(poplin.enabled === false, 'Poplin should be gated out of active Release 1 hero scope.');
assert(bloop.enabled === false, 'Bloop should be gated out of active Release 1 hero scope.');

const stageGoalTargets = [
  ['src/game/content/stage-goals/stage1-lost-cupcakes.json', 'cupcake_recovered'],
  ['src/game/content/stage-goals/stage2-machines.json', 'machine_disabled'],
  ['src/game/content/stage-goals/stage3-crates.json', 'crate_saved'],
  ['src/game/content/stage-goals/stage4-guards.json', 'guard_kept_asleep'],
  ['src/game/content/stage-goals/stage5-combo.json', 'combo_score'],
  ['src/game/content/stage-goals/stage6-royal-seals.json', 'royal_seal_broken']
];
for (const [goalPath, expectedType] of stageGoalTargets) {
  const goal = readJson(goalPath);
  assert(goal.targetType === expectedType, `${goal.id} targetType mismatch: expected ${expectedType}, got ${goal.targetType}.`);
}

const stageGoalSystemText = readText('src/game/systems/StageGoalSystem.ts');
assert(stageGoalSystemText.includes('recordCascadeProgress'), 'StageGoalSystem missing cascade-driven stage goal progression.');
assert(stageGoalSystemText.includes('recordBattleVictoryProgress'), 'StageGoalSystem missing battle-victory stage goal progression.');
assert(stageGoalSystemText.includes('activeHazards.push'), 'StageGoalSystem boss fail consequences are still text-only.');

const routeStorySystemText = readText('src/game/systems/RouteStorySystem.ts');
const routeDialogueSceneText = readText('src/game/scenes/RouteDialogueScene.ts');
assert(routeStorySystemText.includes('getHeroBark'), 'RouteStorySystem does not expose route barks to runtime.');
assert(routeStorySystemText.includes('getHeroVoiceTags'), 'RouteStorySystem does not expose route voice tags to runtime.');
assert(routeDialogueSceneText.includes('getHeroBark'), 'RouteDialogueScene does not render route bark flavor.');
assert(routeDialogueSceneText.includes('getHeroVoiceTags'), 'RouteDialogueScene does not render route voice tags.');

const requiredAssetFolders = [
  'public/assets/ui/story-routes/.gitkeep',
  'public/assets/icons/story-routes/.gitkeep',
  'public/assets/portraits/heroes/.gitkeep',
  'public/assets/portraits/npcs/.gitkeep',
  'public/assets/story/endings/.gitkeep',
  'public/assets/stage-backgrounds/route-scenes/.gitkeep',
  'public/assets/effects/story-routes/.gitkeep'
];
for (const filePath of requiredAssetFolders) {
  assert(fs.existsSync(path.join(repoRoot, filePath)), `Missing route/story asset scaffold: ${filePath}`);
}

if (failures.length > 0) {
  console.error('Remediation smoke failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Remediation smoke passed.');
