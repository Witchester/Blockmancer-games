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

const { runCascadeGravitySmoke } = await import('./cascade-gravity-smoke.mjs');

const heroSystemText = readText('src/game/systems/HeroSystem.ts');
assert(!heroSystemText.includes('RELEASE_1_SPELL_CONTENT_IDS'), 'HeroSystem still injects full Release 1 spell pool.');

const battleSceneText = readText('src/game/scenes/BattleScene.ts');
assert(battleSceneText.includes('this.getPlayableSpellSlots()[slot]'), 'BattleScene hotkey spell cast is not bound to active run spell slots.');
assert(!battleSceneText.includes('playableSpells.push(SPELLS[0])'), 'BattleScene still pads empty spell slots with Fireball fallback.');
assert(battleSceneText.includes('playableSpells.push(null)'), 'BattleScene empty spell slots are not represented as disabled/no-op slots.');
assert(battleSceneText.includes('No spell in that slot yet.'), 'BattleScene missing safe no-op feedback for empty spell slots.');
assert(battleSceneText.includes('this.sharedGame.runState.spells'), 'BattleScene spell slots are not ordered from active run spell loadout.');
assert(battleSceneText.includes('applyBossPhaseBoardSize'), 'Boss phase board-size modifier is not wired in BattleScene.');
assert(battleSceneText.includes("this.scene.start('NodeResultScene'"), 'BattleScene victory flow does not open NodeResultScene before reward/map routing.');

const nodeResultSceneText = readText('src/game/scenes/NodeResultScene.ts');
const nodeResultRouterText = readText('src/game/ui/node-result/NodeResultFlowRouter.ts');
const levelUpSceneText = readText('src/game/scenes/LevelUpRewardScene.ts');
const levelUpAdapterText = readText('src/game/ui/level-up/LevelUpDataAdapter.ts');
const levelUpRouterText = readText('src/game/ui/level-up/LevelUpFlowRouter.ts');
assert(nodeResultSceneText.includes('buildNodeResultViewModel'), 'NodeResultScene does not use the node result display adapter.');
assert(nodeResultSceneText.includes('continueFromNodeResult'), 'NodeResultScene does not use the node result flow router.');
assert(nodeResultRouterText.indexOf("'LevelUpRewardScene'") < nodeResultRouterText.indexOf("'RewardScene'"), 'Node result flow should prefer pending level-up before reward routing.');
assert(nodeResultRouterText.includes('state.pendingNodeResult = null'), 'Node result flow does not clear pendingNodeResult after continue.');
assert(levelUpSceneText.includes('buildLevelUpViewModel'), 'LevelUpRewardScene does not use the level-up display adapter.');
assert(levelUpSceneText.includes('applyLevelUpSelection'), 'LevelUpRewardScene does not use the level-up selection router.');
assert(levelUpSceneText.includes('selectionLocked'), 'LevelUpRewardScene does not guard against duplicate selection application.');
assert(levelUpAdapterText.includes('stackCount') && levelUpAdapterText.includes('stackLimit'), 'Level-up adapter does not expose stack count and limit.');
assert(levelUpRouterText.includes('consumePendingLevelUp'), 'Level-up selection does not consume one pending level-up.');
assert(levelUpRouterText.indexOf("'LevelUpRewardScene'") < levelUpRouterText.indexOf("'RewardScene'"), 'Level-up flow should resolve multiple pending level-ups before reward routing.');
assert(levelUpRouterText.includes('game.mapSystem.completeNode'), 'Level-up flow does not return directly to map when no rewards remain.');

const spellSystemText = readText('src/game/systems/SpellSystem.ts');
const spellsDataText = readText('src/game/data/spells.ts');
const spellContentIdMapBlock = spellsDataText.match(/export const SPELL_ID_BY_CONTENT_ID:[\s\S]*?= \{([\s\S]*?)\};/);
assert(Boolean(spellContentIdMapBlock), 'Unable to parse SPELL_ID_BY_CONTENT_ID mapping.');
const spellIdByContentId = {};
for (const line of (spellContentIdMapBlock?.[1] ?? '').split('\n')) {
  const match = line.match(/^\s*([a-z0-9_]+): '([^']+)'/);
  if (match) {
    spellIdByContentId[match[1]] = match[2];
  }
}

const releaseRouteHeroes = [
  'milo_blockmancer',
  'pippa_pyromancer',
  'zuzu_goblin_engineer',
  'nixie_frostbinder',
  'bruk_snack_knight',
  'lumi_star_witch'
];

const expectedHeroRuntimeLoadouts = {
  hero_milo_blockmancer: ['fireball', 'frost-lock'],
  hero_pippa_pyromancer: ['fireball', 'cupcake-blast', 'bomb-rune'],
  hero_zuzu_goblin_engineer: ['goblin-gadget', 'bomb-rune', 'fireball'],
  hero_nixie_frostbinder: ['frost-lock', 'snowcone-burst', 'clean-cut'],
  hero_bruk_snack_knight: ['snack-break', 'bomb-rune'],
  hero_lumi_star_witch: ['star-spark', 'cascade-cheer', 'rainbow-reroll']
};

for (const heroFile of releaseRouteHeroes) {
  const hero = readJson(`src/game/content/heroes/${heroFile}.json`);
  assert(Array.isArray(hero?.startingLoadout?.spellIds) && hero.startingLoadout.spellIds.length > 0, `${hero.id} has empty starting spell loadout.`);
  const runtimeLoadout = hero.startingLoadout.spellIds.map((contentId) => spellIdByContentId[contentId]).filter(Boolean);
  const expectedRuntimeLoadout = expectedHeroRuntimeLoadouts[hero.id];
  assert(Boolean(expectedRuntimeLoadout), `${hero.id} is missing an expected runtime loadout in smoke coverage.`);
  assert(
    JSON.stringify(runtimeLoadout) === JSON.stringify(expectedRuntimeLoadout),
    `${hero.id} runtime loadout mismatch: expected ${expectedRuntimeLoadout?.join(', ')}, got ${runtimeLoadout.join(', ')}.`
  );
  assert(new Set(runtimeLoadout).size === runtimeLoadout.length, `${hero.id} runtime spell loadout contains duplicates.`);
  for (const contentId of hero.startingLoadout.spellIds) {
    assert(Boolean(spellIdByContentId[contentId]), `${hero.id} starting spell ${contentId} has no runtime mapping.`);
    assert(fs.existsSync(path.join(repoRoot, `src/game/content/spells/${contentId.replace(/^spl_/, '').replace(/_/g, '-')}.json`)), `${hero.id} starting spell ${contentId} has no spell content file.`);
  }
  for (const runtimeId of runtimeLoadout) {
    assert(
      spellSystemText.includes(`case '${runtimeId}'`) || spellSystemText.includes(`case '${runtimeId.replace('void-cut', 'clean-cut')}'`),
      `${hero.id} runtime spell ${runtimeId} is not handled by SpellSystem.cast.`
    );
  }
}

const brukRuntimeLoadout = expectedHeroRuntimeLoadouts.hero_bruk_snack_knight;
assert(brukRuntimeLoadout.length < 4, 'Bruk should remain a short-loadout regression fixture.');
assert(!brukRuntimeLoadout.includes('fireball'), 'Bruk loadout unexpectedly includes Fireball; empty-slot regression fixture is invalid.');

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

await runCascadeGravitySmoke(assert);

if (failures.length > 0) {
  console.error('Remediation smoke failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Remediation smoke passed.');
