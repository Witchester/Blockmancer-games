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
const levelUpSystemText = readText('src/game/systems/LevelUpSystem.ts');
const encounterPackSystemText = readText('src/game/systems/EncounterPackSystem.ts');
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
assert(levelUpSystemText.includes('seededRandom') && !levelUpSystemText.includes('Math.random'), 'Level-up choices are not fully seed-driven.');
assert(levelUpSceneText.includes('levelUpSelectionSeed') && levelUpSceneText.includes('filterLevelUpChoicesByCategory'), 'LevelUpRewardScene does not persist and reuse the level-up offer seed.');
assert(levelUpRouterText.includes("levelUpSelectionSeed = ''"), 'Level-up offer reset does not clear stale offer seeds.');
assert(encounterPackSystemText.includes('selectEntryEffect(nodeType, scalingRule.stageNumber, seed + 409)'), 'Encounter entry effects are not generated from the encounter seed.');
assert(encounterPackSystemText.includes('entryGiftClaimedEnemyIndexes'), 'Encounter packs do not track claimed entry gifts for save/load duplicate prevention.');
assert(encounterPackSystemText.includes('Unsupported enemy entry effect'), 'Malformed enemy entry effects do not emit a safe debug warning.');
assert(encounterPackSystemText.includes('entry.entryGracePieces'), 'Configured encounter entry grace is not included in enemy attack countdown.');
assert(battleSceneText.includes('giftApplied = result.playerGiftEffectId'), 'Enemy entry pressure is not paired with a resolved player gift.');
assert(battleSceneText.includes("this.applySafeFallbackEntryGift('the pressure arrived without a matching gift')"), 'Mechanical entry pressure without a gift does not receive a safe fallback gift.');
assert(battleSceneText.includes('Pressure warning skipped because no safe Entry Gift could be delivered.'), 'Entry pressure is not skipped when its paired gift cannot resolve safely.');
assert(battleSceneText.includes("this.queueEntryHazardWarning('freeze'"), 'Freeze entry pressure is not routed through the warning queue.');
assert(battleSceneText.includes("this.queueEntryHazardWarning('speed_wave'"), 'Speed-wave entry pressure is not routed through the warning queue.');
assert(battleSceneText.includes("this.queueEntryHazardWarning('royal_pattern'"), 'Royal-pattern entry pressure is not routed through the warning queue.');
assert(battleSceneText.includes('Entry Grace added'), 'Entry grace does not produce readable event-log feedback.');
assert(battleSceneText.includes('Unknown pressure warning skipped safely. No instant punishment.'), 'Unsupported pressure IDs do not fail safely.');
const boardSystemText = readText('src/game/systems/BoardSystem.ts');
assert(boardSystemText.includes('safeTopRows') && boardSystemText.includes('safeCells.sort'), 'Helper entry gifts do not use deterministic lower-board safe placement.');
assert(boardSystemText.includes('countActiveBlockId(normalized) >= this.getActiveCapForBlock(normalized)'), 'Helper entry gifts do not respect active special-block caps.');
const enemyEntryEffects = readJson('src/game/content/difficulty-scaling/enemy-entry-effects.json');
for (const effect of enemyEntryEffects) {
  if (effect.pressureEffectId) {
    assert(typeof effect.playerGiftEffectId === 'string' && effect.playerGiftEffectId.length > 0, `${effect.id} applies mechanical pressure without a configured player gift.`);
    assert(typeof effect.warningText === 'string' && effect.warningText.length > 0, `${effect.id} applies mechanical pressure without readable warning text.`);
  }
}

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
assert(stageGoalSystemText.includes('bossEffectApplied'), 'Stage goal boss consequences are not guarded against duplicate application.');
assert(battleSceneText.includes('stageGoalSystem.applyBossStartEffect(state)'), 'BattleScene does not apply stage-goal boss consequences after boss spawn.');
assert(battleSceneText.includes("case 'incoming_junk_queue'"), 'Enemy behavior incoming_junk_queue is not handled by BattleScene.');
assert(battleSceneText.includes("case 'lock_random_column'"), 'Enemy behavior lock_random_column is not routed to a warning-window handler.');
assert(battleSceneText.includes('hazard.warningText'), 'Hazard warning tray starts without logging readable warning text.');

const gameplayEffectSystemText = readText('src/game/systems/GameplayEffectSystem.ts');
assert(gameplayEffectSystemText.includes('queueHazard'), 'GameplayEffectSystem cannot route event effects through hazard warning windows.');
assert(gameplayEffectSystemText.includes('queueIncomingJunk'), 'GameplayEffectSystem cannot route junk effects through incoming junk queue.');

const shopSystemText = readText('src/game/systems/ShopSystem.ts');
const buyItemBlock = shopSystemText.slice(shopSystemText.indexOf('buyItem(state: RunState)'), shopSystemText.indexOf('leave(): ShopResolution'));
assert(buyItemBlock.indexOf('const items = this.rewardSystem.getRewardPool()') < buyItemBlock.indexOf('state.player.gold -= cost'), 'ShopSystem.buyItem spends gold before confirming stock.');

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

// Release 1 Hub/Friendship remediation checks
const hubProgText = readText('src/game/systems/HubProgressionSystem.ts');
assert(hubProgText.includes('getRunStartBonuses'), 'HubProgressionSystem missing getRunStartBonuses helper.');
const friendshipText = readText('src/game/systems/FriendshipSystem.ts');
assert(friendshipText.includes('getRunStartGifts'), 'FriendshipSystem missing getRunStartGifts helper.');
const collectionSceneText = readText('src/game/scenes/CollectionScene.ts');
const metaSystemText = readText('src/game/systems/MetaSystem.ts');
assert(metaSystemText.includes('recordMonsterDiscovered'), 'MetaSystem must persist discovered monster IDs.');
assert(readText('src/game/systems/SaveSystem.ts').includes('discoveredMonsterIds'), 'SaveSystem must normalize discovered monster IDs.');
assert(collectionSceneText.includes("listEnabled<CollectionMonster>('monster')"), 'CollectionScene must render the enabled monster roster, not only friendship entries.');
assert(collectionSceneText.includes('Mystery Festival Friend'), 'CollectionScene must render safe mystery entries for undiscovered monsters.');
assert(collectionSceneText.includes("monster.iconKey ?? 'placeholder_icon'"), 'CollectionScene must use placeholder-safe monster icons.');
assert(collectionSceneText.includes("this.input.on('wheel'"), 'CollectionScene must support portrait-safe scrolling.');
assert(battleSceneText.indexOf('recordMonsterDiscovered(enemyId)') < battleSceneText.indexOf('hasRemainingEncounterEnemies(state.activeEncounterPack)'), 'Sequential enemies must be recorded before the encounter advances.');
assert(battleSceneText.indexOf("friendshipSystem.gain(this.sharedGame.metaSystem.state, enemyId, 'defeat')") < battleSceneText.indexOf('hasRemainingEncounterEnemies(state.activeEncounterPack)'), 'Sequential enemy friendship gains must be recorded before the encounter advances.');
const blockGameText = readText('src/game/BlockmancerGame.ts');
assert(blockGameText.includes('metaBonusesApplied'), 'BlockmancerGame.newRun must guard meta bonuses with metaBonusesApplied.');
assert(blockGameText.includes('claimedFriendRewards'), 'BlockmancerGame.newRun must initialize claimedFriendRewards for per-run friendship gifts.');
const defaultRunText = readText('src/game/data/defaultRunState.ts');
assert(defaultRunText.includes('metaBonusesApplied') && defaultRunText.includes('claimedFriendRewards'), 'Default run state must include metaBonusesApplied and claimedFriendRewards defaults.');

// Phase 9 hero passive and ending wiring smoke
const mapFlowRouterText = readText('src/game/ui/map/MapFlowRouter.ts');
const combatSystemText = readText('src/game/systems/CombatSystem.ts');
const spellSystemPhase9Text = readText('src/game/systems/SpellSystem.ts');
const routeEndingContent = readJson('src/game/content/story/routes/route-endings.json');
assert(heroSystemText.includes("typeof hero.passive?.id === 'string'") && heroSystemText.includes("'passive_none'"), 'HeroSystem must safely fall back when passive content is missing.');
assert(combatSystemText.includes("'passive_plink_plonk_combo'") && combatSystemText.includes('Plink-Plonk Combo grants bonus mana!'), 'Milo passive is not wired to cascade mana.');
assert(spellSystemPhase9Text.includes("'passive_preheat_cleanup'") && spellSystemPhase9Text.includes('sticky or junk'), 'Pippa passive is not wired to fire cleanup.');
assert(boardSystemText.includes("'passive_bombs_are_features'") && spellSystemPhase9Text.includes('zuzuBonus'), 'Zuzu passive is not wired to board and bomb spell behavior.');
assert(battleSceneText.includes("'passive_stay_chill'") && mapFlowRouterText.includes('nixieMitigationUsed = false'), 'Nixie passive is not wired with a per-battle reset.');
assert(battleSceneText.includes("'passive_no_snack_left_behind'") && mapFlowRouterText.includes('emergencyBarrierUsed = false'), 'Bruk passive is not wired with a per-battle reset.');
assert(combatSystemText.includes("'passive_main_character_energy'") && battleSceneText.includes('Main Character Energy makes star blocks'), 'Lumi passive is not wired to star cascade value.');
assert(routeEndingContent.endings.length === 18, `Expected 18 route endings, found ${routeEndingContent.endings.length}.`);
for (const heroId of Object.keys(expectedHeroRuntimeLoadouts)) {
  const kinds = routeEndingContent.endings.filter((ending) => ending.heroId === heroId).map((ending) => ending.kind);
  assert(kinds.includes('normal') && kinds.includes('true') && kinds.includes('variant'), `${heroId} is missing normal, true, or variant ending content.`);
}
assert(routeStorySystemText.includes('resolveHeroEnding') && routeStorySystemText.includes('VARIANT_MIN_RISK_SCORE'), 'Route ending resolver is missing normal/true/variant routing.');
assert(nodeResultSceneText.includes('unlockRouteEnding') && nodeResultSceneText.includes('unlockRouteVariantEnding'), 'Final boss node-result flow does not persist route ending unlocks.');

// Phase 1 Fever Showtime State Model assertions
assert(defaultRunText.includes('feverShowtime: createDefaultFeverShowtimeState(),'), 'defaultRunState.ts must initialize feverShowtime.');
assert(defaultRunText.includes('feverShowtime: normalizeFeverShowtimeState('), 'defaultRunState.ts must normalize feverShowtime.');
const gameTypesText = readText('src/game/types/GameTypes.ts');
assert(gameTypesText.includes('export type FeverShowtimeState = {'), 'GameTypes.ts must define FeverShowtimeState type.');
assert(gameTypesText.includes('feverShowtime: FeverShowtimeState;'), 'GameTypes.ts must include feverShowtime inside RunState.');
const saveSystemText = readText('src/game/systems/SaveSystem.ts');
assert(saveSystemText.includes('version < 9'), 'SaveSystem.ts must include version 9 save migration block.');

// Phase 1 — Upgrade Slot Rules: Central constants
const constantsText = readText('src/game/data/constants.ts');
assert(constantsText.includes('TOTAL_UPGRADE_SLOTS'), 'constants.ts must export TOTAL_UPGRADE_SLOTS.');
assert(constantsText.includes('MAX_HERO_UPGRADE_SLOTS'), 'constants.ts must export MAX_HERO_UPGRADE_SLOTS.');
assert(constantsText.includes('MAX_BOARD_UPGRADE_SLOTS'), 'constants.ts must export MAX_BOARD_UPGRADE_SLOTS.');
assert(constantsText.includes('MAX_FEVER_UPGRADE_SLOTS'), 'constants.ts must export MAX_FEVER_UPGRADE_SLOTS.');
assert(constantsText.includes('TOTAL_UPGRADE_SLOTS = 5'), 'TOTAL_UPGRADE_SLOTS must equal 5.');
assert(constantsText.includes('MAX_HERO_UPGRADE_SLOTS = 2'), 'MAX_HERO_UPGRADE_SLOTS must equal 2.');
assert(constantsText.includes('MAX_BOARD_UPGRADE_SLOTS = 2'), 'MAX_BOARD_UPGRADE_SLOTS must equal 2.');
assert(constantsText.includes('MAX_FEVER_UPGRADE_SLOTS = 2'), 'MAX_FEVER_UPGRADE_SLOTS must equal 2.');

// Phase 1 — Upgrade Slot Rules: Default run state
assert(defaultRunText.includes('TOTAL_UPGRADE_SLOTS'), 'defaultRunState.ts must import TOTAL_UPGRADE_SLOTS.');
assert(defaultRunText.includes('Array.from({ length: TOTAL_UPGRADE_SLOTS }'), 'createDefaultRunUpgradeState must create TOTAL_UPGRADE_SLOTS slots.');
assert(defaultRunText.includes('version: 2'), 'createDefaultRunUpgradeState must use internal version 2.');

// Phase 1 — Upgrade Slot Rules: Normalization
assert(defaultRunText.includes('while (slots.length < TOTAL_UPGRADE_SLOTS)'), 'normalizeRunUpgradeState must pad to TOTAL_UPGRADE_SLOTS using constant.');
assert(defaultRunText.includes('while (slots.length > TOTAL_UPGRADE_SLOTS)'), 'normalizeRunUpgradeState must truncate excess slots to TOTAL_UPGRADE_SLOTS.');
assert(defaultRunText.includes('categoryLimits'), 'normalizeRunUpgradeState must enforce category limits during normalization.');
assert(defaultRunText.includes('Math.max(version, 2)'), 'normalizeRunUpgradeState must bump version to 2 for old saves.');

// Phase 1 — Upgrade Slot Rules: LevelUpSystem
assert(levelUpSystemText.includes('TOTAL_UPGRADE_SLOTS'), 'LevelUpSystem must import TOTAL_UPGRADE_SLOTS.');
assert(levelUpSystemText.includes('MAX_HERO_UPGRADE_SLOTS'), 'LevelUpSystem must import MAX_HERO_UPGRADE_SLOTS.');
assert(levelUpSystemText.includes('canAddUpgrade'), 'LevelUpSystem must expose canAddUpgrade utility method.');
assert(levelUpSystemText.includes('canAddUpgrade(state, upg.id, category).allowed'), 'filterLevelUpChoicesByCategory must filter illegal choices via canAddUpgrade.');
assert(levelUpSystemText.includes('counts.total >= TOTAL_UPGRADE_SLOTS'), 'LevelUpSystem.canSelectCategory must use TOTAL_UPGRADE_SLOTS constant.');
assert(levelUpSystemText.includes('counts.hero >= MAX_HERO_UPGRADE_SLOTS'), 'LevelUpSystem.canSelectCategory must use MAX_HERO_UPGRADE_SLOTS constant.');
assert(levelUpSystemText.includes('counts.board >= MAX_BOARD_UPGRADE_SLOTS'), 'LevelUpSystem.canSelectCategory must use MAX_BOARD_UPGRADE_SLOTS constant.');
assert(levelUpSystemText.includes('counts.fever >= MAX_FEVER_UPGRADE_SLOTS'), 'LevelUpSystem.canSelectCategory must use MAX_FEVER_UPGRADE_SLOTS constant.');

// Phase 1 — Upgrade Slot Rules: SaveSystem migration
assert(saveSystemText.includes('TOTAL_UPGRADE_SLOTS'), 'SaveSystem must import TOTAL_UPGRADE_SLOTS.');
assert(saveSystemText.includes('version < 11'), 'SaveSystem must include version 11 migration block.');
assert(saveSystemText.includes('categoryLimits'), 'SaveSystem migration must normalize category overflow.');
assert(saveSystemText.includes('while (slots.length > TOTAL_UPGRADE_SLOTS)'), 'SaveSystem migration must truncate excess slots.');

// Phase 1 — Upgrade Slot Rules: Type definitions
assert(gameTypesText.includes('UpgradeCategory'), 'GameTypes.ts must define UpgradeCategory type.');
assert(gameTypesText.includes('RunUpgradeState'), 'GameTypes.ts must define RunUpgradeState type.');
assert(gameTypesText.includes('RunUpgradeSlotState'), 'GameTypes.ts must define RunUpgradeSlotState type.');

// Phase 1 — Upgrade Slot Rules: UI integration
assert(levelUpSceneText.includes('isCategoryFull'), 'LevelUpRewardScene must display category full state.');
assert(levelUpSceneText.includes('getUsedSlotCount'), 'LevelUpRewardScene must display used slot counts per category.');
assert(levelUpSystemText.includes('canApplyCardToRun'), 'LevelUpSystem must have canApplyCardToRun with canAddUpgrade integration.');

// ===== Phase 2 — Legendary Evolution Core UI assertions =====

// LegendaryEvolutionScene exists and has required structure
const legendarySceneText = readText('src/game/scenes/LegendaryEvolutionScene.ts');
assert(legendarySceneText.includes('class LegendaryEvolutionScene'), 'LegendaryEvolutionScene must exist as a scene class.');
assert(legendarySceneText.includes('Legendary Evolution!'), 'LegendaryEvolutionScene must display the "Legendary Evolution!" title.');
assert(legendarySceneText.includes('generateLegendaryEvolutionChoices'), 'LegendaryEvolutionScene must call generateLegendaryEvolutionChoices for sampling.');
assert(legendarySceneText.includes('applyLegendaryEvolution'), 'LegendaryEvolutionScene must call applyLegendaryEvolution on confirm.');
assert(legendarySceneText.includes('selectionLocked'), 'LegendaryEvolutionScene must guard against duplicate selection.');
assert(legendarySceneText.includes('confirmSelection'), 'LegendaryEvolutionScene must have a confirmSelection method.');
assert(legendarySceneText.includes('continueFromLevelUp'), 'LegendaryEvolutionScene must use continueFromLevelUp to return to flow after selection.');

// LevelUpSystem legendary methods
assert(levelUpSystemText.includes('getLegendaryPoolForCard'), 'LevelUpSystem must have getLegendaryPoolForCard method.');
assert(levelUpSystemText.includes('getEligibleLegendaryOptions'), 'LevelUpSystem must have getEligibleLegendaryOptions method.');
assert(levelUpSystemText.includes('generateLegendaryEvolutionChoices'), 'LevelUpSystem must have generateLegendaryEvolutionChoices method.');
assert(levelUpSystemText.includes('applyLegendaryEvolution'), 'LevelUpSystem must have applyLegendaryEvolution method.');
assert(levelUpSystemText.includes('hasPendingLegendaryEvolution'), 'LevelUpSystem must have hasPendingLegendaryEvolution method.');
assert(levelUpSystemText.includes('isCardReadyToEvolve'), 'LevelUpSystem must have isCardReadyToEvolve method.');
assert(levelUpSystemText.includes('isCardLegendary'), 'LevelUpSystem must have isCardLegendary method.');
assert(levelUpSystemText.includes('getPendingEvolutionCards'), 'LevelUpSystem must have getPendingEvolutionCards method.');

// LevelUpDataAdapter exposes legendary state
assert(levelUpAdapterText.includes('readyToEvolve'), 'LevelUpDataAdapter must expose readyToEvolve in card view model.');
assert(levelUpAdapterText.includes('isLegendary'), 'LevelUpDataAdapter must expose isLegendary in card view model.');

// LevelUpFlowRouter routes to LegendaryEvolutionScene
assert(levelUpRouterText.includes('LegendaryEvolutionScene'), 'LevelUpFlowRouter must route to LegendaryEvolutionScene.');
assert(levelUpRouterText.includes('pendingLegendaryEvolution'), 'LevelUpFlowRouter must check pendingLegendaryEvolution.');
assert(levelUpRouterText.includes('hasPendingLegendaryEvolution'), 'LevelUpFlowRouter must use hasPendingLegendaryEvolution for routing.');

// LevelUpRewardScene shows ready-to-evolve state
assert(levelUpSceneText.includes('Ready to Evolve'), 'LevelUpRewardScene must display "Ready to Evolve" status.');
assert(levelUpSceneText.includes('Legendary'), 'LevelUpRewardScene must display "Legendary" status.');

// GameTypes defines legendary types
assert(gameTypesText.includes('LegendaryEvolutionDefinition'), 'GameTypes.ts must define LegendaryEvolutionDefinition type.');
assert(gameTypesText.includes('legendaryEvolutionId'), 'GameTypes.ts must include legendaryEvolutionId in RunUpgradeCardState.');
assert(gameTypesText.includes('readyToEvolve'), 'GameTypes.ts must include readyToEvolve in RunUpgradeCardState.');
assert(gameTypesText.includes('pendingLegendaryEvolution'), 'GameTypes.ts must include pendingLegendaryEvolution in LevelUpScreenState.');

// UpgradeCardEffectHandler handles legendary effect types
const effectHandlerText = readText('src/game/systems/UpgradeCardEffectHandler.ts');
assert(effectHandlerText.includes('applyCardEffect'), 'UpgradeCardEffectHandler must have applyCardEffect method.');
assert(effectHandlerText.includes('hero_max_hp_boost'), 'UpgradeCardEffectHandler must handle hero_max_hp_boost effect type.');
assert(effectHandlerText.includes('board_line_damage'), 'UpgradeCardEffectHandler must handle board_line_damage effect type.');
assert(effectHandlerText.includes('fever_gain_bonus'), 'UpgradeCardEffectHandler must handle fever_gain_bonus effect type.');
assert(effectHandlerText.includes('Unsupported effectType'), 'UpgradeCardEffectHandler must have safe fallback for unsupported effect types.');

// Content cards have real legendary pools (not placeholders)
const cardFiles = [
  'card_hero_focus', 'card_hero_star_path', 'card_hero_table_guard', 'card_hero_slow_the_room',
  'card_hero_safe_prototype', 'card_hero_hearthfire', 'card_hero_listening_lines',
  'card_careful_footing', 'card_clever_timing', 'card_festival_courage',
  'card_board_deep_stack', 'card_board_early_warning', 'card_board_pocket_planner',
  'card_board_queue_comb', 'card_board_soft_landing', 'card_board_space_reader',
  'card_board_tidy_falling', 'card_board_gravity_choir', 'card_board_square_etiquette',
  'card_fever_festival_hype', 'card_fever_bigger_stage', 'card_fever_longer_showtime',
  'card_fever_graceful_release', 'card_fever_safety_confetti', 'card_fever_showtime_overflow',
  'card_fever_star_encore', 'card_fever_stagecraft'
];

for (const cardId of cardFiles) {
  const card = readJson(`src/game/content/upgrade-cards/${cardId}.json`);
  assert(Array.isArray(card.legendaryPool), `${cardId} must have legendaryPool array.`);
  assert(card.legendaryPool.length >= 3, `${cardId} must have at least 3 legendary options (target: 10, got ${card.legendaryPool.length}).`);
  for (const option of card.legendaryPool) {
    assert(typeof option.id === 'string' && option.id.length > 0, `${cardId} legendary option must have a valid id.`);
    assert(typeof option.name === 'string' && option.name.length > 0, `${cardId} legendary option must have a valid name.`);
    assert(typeof option.description === 'string' && option.description.length > 0, `${cardId} legendary option must have a valid description.`);
    assert(typeof option.effectType === 'string' && option.effectType.length > 0, `${cardId} legendary option must have a valid effectType.`);
    assert(typeof option.effectConfig === 'object', `${cardId} legendary option must have effectConfig object.`);
    assert(Array.isArray(option.tags), `${cardId} legendary option must have tags array.`);
    assert(!option.placeholder, `${cardId} legendary option must not be a placeholder.`);
  }
}

// Save/load normalization preserves legendary state
assert(defaultRunText.includes('readyToEvolve: typeof'), 'normalizeRunUpgradeState must preserve readyToEvolve field.');
assert(defaultRunText.includes('legendaryEvolutionId: typeof'), 'normalizeRunUpgradeState must preserve legendaryEvolutionId field.');
assert(defaultRunText.includes('pendingLegendaryEvolution'), 'normalizeLevelUpScreenState must handle pendingLegendaryEvolution.');

const feverSystemText = readText('src/game/systems/FeverSystem.ts');
assert(feverSystemText.includes('getDefaultFeverShowtimeState'), 'FeverSystem.ts must implement getDefaultFeverShowtimeState.');
assert(feverSystemText.includes('normalizeFeverState'), 'FeverSystem.ts must implement normalizeFeverState.');
assert(feverSystemText.includes('gainFever'), 'FeverSystem.ts must implement gainFever.');
assert(feverSystemText.includes('canActivateFever'), 'FeverSystem.ts must implement canActivateFever.');
assert(feverSystemText.includes('activateFever'), 'FeverSystem.ts must implement activateFever.');
assert(feverSystemText.includes('tickFeverOnPieceLock'), 'FeverSystem.ts must implement tickFeverOnPieceLock.');
assert(feverSystemText.includes('requestFeverRelease'), 'FeverSystem.ts must implement requestFeverRelease.');
assert(feverSystemText.includes('clearFeverStateForNodeEnd'), 'FeverSystem.ts must implement clearFeverStateForNodeEnd.');

// Phase 3 — Monster Stack UI
const monsterStackPreviewText = readText('src/game/ui/battle/MonsterStackPreview.ts');
assert(monsterStackPreviewText.includes('buildMonsterStackViewModel'), 'Monster stack preview is missing a derived encounter-pack view model.');
assert(monsterStackPreviewText.includes('encounterPackCompleted === true'), 'Monster stack preview does not hide completed encounter packs.');
assert(monsterStackPreviewText.includes('Phaser.Math.Clamp(rawIndex'), 'Monster stack preview does not safely clamp malformed saved enemy indexes.');
assert(monsterStackPreviewText.includes('text: `+${view.hiddenEnemyCount}`'), 'Monster stack preview does not use a mystery count chip for enemies after next.');
assert(monsterStackPreviewText.includes("fallbackAssetKey: 'placeholder_icon'"), 'Monster stack preview icon slots are not placeholder-safe.');
assert(monsterStackPreviewText.includes("return typeof raw === 'string'") && monsterStackPreviewText.includes("'asset_missing_icon'"), 'Monster stack preview does not safely fall back for missing monster icons.');
assert(monsterStackPreviewText.includes('NEXT_PEEK_OFFSET = 18'), 'Monster stack preview does not keep the next enemy partly tucked behind the active enemy.');
assert(monsterStackPreviewText.includes('MONSTER_STACK_BOUNDS: UiRect = { x: 920, y: 104, w: 152, h: 40 }'), 'Monster stack preview bounds no longer stay in the compact top combat area.');
assert(battleSceneText.includes('this.monsterStackPreview?.updateQueue(state.activeEncounterPack);'), 'BattleScene does not restore the monster stack from saved encounter-pack state.');
assert(battleSceneText.includes('this.monsterStackPreview?.refresh(state.activeEncounterPack!.currentEnemyIndex'), 'BattleScene does not refresh the monster stack after advancing enemies.');
assert(battleSceneText.includes('this.monsterStackPreview?.updateQueue(null);'), 'BattleScene does not clear the monster stack after full node completion.');
assert(saveSystemText.includes('pack.currentEnemyIndex = Math.max(0, Math.min(Math.max(0, enemies.length - 1), currentEnemyIndex));'), 'SaveSystem does not clamp restored encounter-pack enemy indexes.');
const uiScreenshotText = readText('scripts/check-ui-screenshots.mjs');
assert(uiScreenshotText.includes("encounterPackId: 'ui_smoke_monster_stack'"), 'UI screenshot smoke is missing a deterministic three-enemy monster-stack fixture.');

await runCascadeGravitySmoke(assert);

if (failures.length > 0) {
  console.error('Remediation smoke failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Remediation smoke passed.');
