# Blockmancer Dungeon — Release Implementation Source of Truth

**Generated:** 2026-05-20  
**Authority:** Canonical for current implementation status, build/validation findings, code audit, route implementation audit, release priorities, next backlog, and coding-agent prompts.

## Consolidation Summary

This file uses `RELEASE_1_CODE_AUDIT_REPORT_WITH_STORY_FLOW.md` as the primary implementation reality because it reflects the story-flow runtime work. The older code audit is included as historical comparison and deeper inventory where useful. The vibe coding plan and agent prompt pack remain planning/prompt references, not proof of implementation.

## Implementation Ownership

Use this file for:

- What is implemented, partial, missing, or risky.
- P0/P1/P2/P3 backlog decisions.
- Build and validation command results.
- RouteStorySystem implementation decisions and reward hook coverage.
- Release 1.0 milestone/phase plan.
- Copy-paste Codex/agent prompts.

Do not treat a plan or prompt as implementation evidence. Implementation status must come from code audits or new verification.


---

## Current Code Audit with Story Flow

**Source file:** `RELEASE_1_CODE_AUDIT_REPORT_WITH_STORY_FLOW.md`

**Consolidation note:** Primary implementation status source.

### Blockmancer Dungeon - Release 1 Code Audit Report With Story Flow

Audit date: 2026-05-18
Workspace: `C:\Users\phamc\Desktop\Blockmancer-games`

#### 1. Executive Summary

Release 1 is now materially further along than the previous report stated. The character route story flow is no longer only documentation-ready: the repo now contains `RouteStorySystem`, route progress save migration, route scene JSON, route dialogue UI, boss callback hooks, route reward hooks, and route ending resolution.

Current release status: buildable and validation-clean, with remaining release risk concentrated in missing final assets/audio, manual smoke-test coverage, placeholder-heavy visual content, shallow switch-based effect implementations, and lack of automated tests/lint.

Keep the current stack: Phaser 3 + TypeScript + Vite + Capacitor remains the pragmatic path. There is enough runtime code, content, validation, and asset fallback infrastructure that an engine migration would slow Release 1 more than it helps.


#### 1A. Feature Delta — Sequential Encounter Packs and Festival Level-Up

**Added:** 2026-05-22  
**Current status:** Implementation present after the 2026-05-23 repo audit and 2026-05-26 determinism patch; remaining risk is focused smoke/balance validation, final assets/audio, and broader gameplay-effect coverage.

New Release 1 feature direction:

- Battle nodes may contain 1-3 sequential enemies generated from the current stage/biome monster pool.
- Only one enemy is active at a time.
- Node rewards, route fallback triggers, and level-up screens happen only after the full encounter pack is defeated.
- New enemy entry resets the enemy attack counter and applies entry grace.
- Enemy entry effects must pair readable pressure with a small player-positive gift.
- Compact monster stack UI shows enemies remaining with small stacked icons.
- Festival Level-Up grants XP from combat but shows upgrade choices only after node clear.
- Node Result Screen appears after node clear to show EXP gained this node, EXP breakdown, and EXP remaining to next level.
- Level-up upgrades are stackable run upgrades split into general upgrades and hero-specific upgrades.

Implementation risk:

- This touches `EnemySystem`, `BattleScene`, save state, reward flow, route fallback timing, UI layout, upgrade handling, and content validation.
- Existing audit already flags item/relic/upgrade effects as switch-based/partial, so every new level-up upgrade must be backed by a real handler and validation.
- Save migration is P0 because active encounter pack state and `PlayerLevelState` become run-state fields.

Required new or updated systems:

```text
EncounterPackSystem or equivalent EnemySystem responsibility
LevelUpSystem
NodeResultScene or result modal in RewardScene/BattleScene flow
LevelUpRewardScene or level-up modal in RewardScene
MonsterStackPreview UI
NodeResultPanel UI
Biome monster pool content
Encounter pack scaling content
Enemy entry effect content
Level-up upgrade content and runtime handlers
Save migration for encounter pack + PlayerLevelState
```


#### 2. Commands Run In This Audit

| Command | Result | Notes |
|---|---|---|
| `npm.cmd run validate:content` | Pass | Content validation passed: 335 JSON files, 36 route scenes. |
| `npm.cmd run validate:metadata` | Pass | Content metadata validation passed. |
| `npm.cmd run validate:animations` | Pass with warnings | Validated 384 exact animation definitions. Warned that 1851 expected PNG frame files are missing; this is non-fatal by design. |
| `npm.cmd run audit:asset-variants` | Pass with fallback report | Board blocks audited: 21; heroes: 8; stages: 6; missing optional variants: 60. |
| `npm.cmd run sync:assets` | Pass | Runtime asset keys found: 209; physical assets scanned: 1694; unresolved assets: 0; 12 missing audio files covered by fallback. |
| `npm.cmd run build` | Fail in sandbox, pass escalated | Sandboxed Vite/esbuild could not read `vite.config.ts`; escalated run passed. |
| `npm run test` | Not available | No `test` script exists. |
| `npm run lint` | Not available | No `lint` script exists. |

#### 3. Current Git / Workspace Notes

- The working tree is dirty with existing content, docs, scripts, asset-folder, and runtime changes.
- `public/assets/**/.gitkeep` scaffold files are now visible to Git by `.gitignore` rules.
- Generated reports were refreshed by `sync:assets` and `audit:asset-variants`.
- This audit does not revert any pre-existing user or generated changes.

#### 4. Highest Severity Findings

##### P0

| Finding | Evidence | Impact | Required Action |
|---|---|---|---|
| No automated test script exists. | `package.json` has no `test`. | Core board, save migration, route rewards, and ending logic can regress silently. | Add deterministic tests or smoke harness for Cascade Gravity, save migration, route choice resolution, and endings. |
| No lint script exists. | `package.json` has no `lint`. | Code quality and dead paths rely on manual review. | Add lint/type-check script or document build-only policy. |
| Build requires sandbox escalation in this environment. | Sandboxed `npm.cmd run build` fails with Vite/esbuild access denied for `vite.config.ts`; escalated build passes. | Local audit can verify build, but CI/dev docs should not depend on this sandbox behavior. | Keep using normal local/CI build; note sandbox-only failure in QA records. |
| Manual gameplay smoke tests were not run. | No browser/dev-server/device smoke in this pass. | Runtime route triggers, mobile layout, rewards, and endings are code-present but not play-verified. | Run desktop and portrait-mobile smoke checklist before release. |

##### P1

| Finding | Evidence | Impact | Required Action |
|---|---|---|---|
| Final animation PNG packages are missing. | `validate:animations` warns about 1851 expected frame files. | Gameplay is fallback-safe but release presentation is incomplete. | Import Priority 1 board, VFX, UI, hero, monster, boss frame sequences. |
| Many visual assets remain placeholders. | `audit:asset-variants` reports 60 optional missing variants; many content entries use `placeholder_*` sprite/icon keys. | Release visuals will feel unfinished even though fallback safety works. | Replace placeholders for Release 1 critical path. |
| Real audio is missing or incomplete. | `sync:assets` reports 12 missing audio files covered by fallback. | Synth/fallback audio is not release-grade unless intentionally accepted. | Add final OGG files or define fallback audio as product style. |
| Gameplay effects are partly switch-based and partial. | `GameplayEffectSystem`, `SpellSystem`, `ItemSystem`, `RelicSystem`, `UpgradeSystem`, and route reward handling use explicit cases. | New content can validate structurally while still doing little or nothing. | Validate every content effect against supported runtime handlers. |
| Boss mechanics are still shallow in places. | `BossSystem` includes safe placeholder mechanics for unknown/unsupported boss behavior. | Bosses may not feel distinct enough for Release 1. | Verify each boss rule has visible mechanical behavior. |

#### 5. Story Flow Audit Result

Previous status: docs complete / runtime pending.

Current status: runtime implemented, validation passing, manual smoke pending.

| Story Flow Requirement | Current Status | Evidence | Remaining Risk |
|---|---|---|---|
| 36 unique hero-stage route scenes | Implemented | 6 route scene files, 36 scenes, 108 choices. `validate:content` reports 36 route scenes. | Needs playthrough smoke verification. |
| Three choices per route scene | Implemented | Route JSON contains 108 total choices. | UX needs portrait-mobile testing. |
| True flags | Implemented | 36 true choices grant true flags. | Ending thresholds need play verification. |
| Route progress save model | Implemented | `RunState.routeProgress`, `defaultRunState`, `SaveSystem` migration version 5. | Needs migration tests for old saves. |
| Route dialogue UI | Implemented | `RouteDialogueScene.ts`. | Layout/text fit needs device screenshots. |
| Route triggers | Implemented | `MapScene`, `BattleScene`, `RouteStorySystem.shouldTriggerRouteScene`. | Trigger timing needs smoke testing across event-node and combat fallback paths. |
| Route rewards | Implemented, partial coverage | `RouteStorySystem.applyRouteReward` supports gold, heal, mana, shield, item, relic, upgrade, battle/stage/boss/hazard modifiers. | Unsupported reward types safely report no hooked effect. |
| Route risks | Implemented | `RouteStorySystem.applyRouteRisk`, hazard queue integration, oopsie chance. | Needs balancing and soft-lock checks. |
| Boss callbacks | Implemented | `BattleScene` calls `getBossCallback` and `applyBossCallbackModifier`. | Needs per-hero/stage visible verification. |
| Normal / True / Risky Variant endings | Implemented | `route-endings.json` has 18 endings; `RewardScene`, `BattleScene`, `VictoryScene`, `MetaSystem`. | Needs final-stage playthrough verification. |
| Route story assets | Manifest/scaffold implemented | `assets.ts`, `AssetSystem.getRouteStoryTexture`, final asset folders. | Real portraits, panels, ending cards, and route icons still missing. |

Route content counts:

| Item | Count |
|---|---:|
| Route scene files | 6 |
| Route scenes | 36 |
| Route choices | 108 |
| True flags | 36 |
| Route endings | 18 |

#### 6. Feature Implementation Matrix

| Area | Status | Evidence | Remaining Gap | Priority |
|---|---|---|---|---|
| Cascade Gravity | Implemented | `BoardSystem.clearLinesCascade`, `applyCascadeGravity`, `CombatSystem.resolveCascadeClear`. | Needs deterministic tests and smoke cases with special blocks. | P0 |
| Board controls | Implemented | `BoardSystem`, `BattleScene`, `InputSystem`, `MobileControls`. | Mobile ergonomics need device verification. | P1 |
| Combat loop | Implemented | `CombatSystem`, `BattleScene`, enemy defeat/reward flow. | More tests for modifiers and bosses. | P1 |
| Enemy system | Implemented / partial behavior depth | `EnemySystem`, monster content. | Advanced behaviors remain light. | P1 |
| Encounter pack system | Mostly implemented | `EncounterPackSystem`, biome monster pools, encounter scaling, battle chaining, `MonsterStackPreview`, save fields. 2026-05-26 patch made entry-effect choice seed-driven. | Manual smoke/balance still needed; pack ID collision risk remains a lower-priority audit item. | P1 |
| Festival Level-Up system | Mostly implemented | `LevelUpSystem`, `LevelUpRewardScene`, level-up adapters/router, stackable upgrades, hero-specific filtering, save fields. 2026-05-26 patch made card offers seed-driven and restorable via persisted offer IDs. | Manual save/load and balance smoke still needed for unresolved level-up offers and upgrade pacing. | P1 |
| Node Result Screen | Implemented, smoke pending | `NodeResultScene`, `NodeResultDataAdapter`, `NodeResultFlowRouter`, pending node-result save state, duplicate EXP claim guard. | Manual save/load replay smoke still needed around result continue timing. | P1 |
| Boss system | Partial | `BossSystem`, `BossRuleSystem`, boss JSON, boss callbacks. | Some mechanics are placeholder-safe rather than fully distinct. | P1 |
| Spell system | Partial | `SpellSystem`, spell content. | Runtime spell behavior coverage does not fully match content roster. | P1 |
| Item system | Partial | `ItemSystem`, item content, route rewards. | Content coverage exceeds verified behavior coverage. | P1 |
| Reward system | Implemented | `RewardSystem`, `RewardScene`, loot tables. | UI/balance smoke pending. | P1 |
| Relic system | Partial | `RelicSystem`, relic content. | Unsupported relics are safe placeholders. | P2 |
| Upgrade system | Partial | `UpgradeSystem`, upgrade content. | Unsupported upgrades are safe placeholders. | P2 |
| Hero system | Partial | `HeroSystem`, hero content, unlock meta. | 8 heroes exist while Release 1 story route covers 6. | P1 |
| Weapon system | Placeholder/partial | `WeaponSystem`, weapon content. | Combat integration is limited. | P2 |
| Map system | Implemented | `MapSystem`, `MapScene`, route trigger integration. | Stage path and route trigger timing need smoke tests. | P1 |
| Stage system | Implemented lookup layer | `StageSystem`, stage content. | Rules remain distributed. | P3 |
| Route story system | Implemented, smoke pending | `RouteStorySystem`, route JSON, `RouteDialogueScene`, `VictoryScene`. | Manual and automated coverage missing. | P1 |
| Event system | Partial | `EventSystem`, room-event content. | Effects are switch-limited. | P1 |
| Shop system | Partial | `ShopSystem`, `ShopScene`. | Economy and inventory smoke pending. | P2 |
| Oopsie system | Partial | `OopsieSystem`, oopsie content. | Needs tone/effect verification. | P1 |
| Fever system | Partial | `FeverSystem`, combat hooks. | UX/balance smoke pending. | P2 |
| Save system | Implemented | `SaveSystem`, `defaultRunState`, meta migration. | No migration tests. | P0 |
| Asset system | Implemented fallback/manifest | `AssetSystem`, `assets.ts`, `animations.ts`, folder script. | Final art missing. | P1 |
| Audio system | Partial fallback | `AudioSystem`, asset sync report. | Real audio missing. | P2 |
| Tutorial system | Partial | `TutorialSystem`, `TutorialScene`. | Does not cover later replayability/story systems. | P2 |
| Settings/accessibility | Partial | `SettingsSystem`, `SettingsScene`. | Device verification needed. | P2 |
| Reactive difficulty | Partial | `DifficultySystem`, hazards, item counters, route risks. | Tuning and soft-lock checks needed. | P1 |
| Random gameplay events | Partial | `RandomGameplayEventSystem`, 20 content files. | Effect coverage must be checked. | P1 |
| Stage goals | Partial | `StageGoalSystem`, 6 content files. | Consequences need verification. | P1 |
| Chaos rules | Partial | `ChaosRuleSystem`, 8 content files. | Supported effects are limited. | P2 |
| Battle objectives | Improved / needs tests | `BattleObjectiveSystem` now has real checks for junk and board height. | Needs deterministic validation. | P1 |
| Hub progression | Placeholder | `HubProgressionSystem`, hub-building content. | Mostly summaries. | P2 |
| Friendship | Placeholder | `FriendshipSystem`, friendship content. | Mostly points/display. | P3 |

#### 7. Content Loading Audit

All listed categories are loaded by `ContentRegistry` and current validation passes.

| Category | Count |
|---|---:|
| battle-objectives | 10 |
| board-blocks | 21 |
| boss-rules | 6 |
| chaos-rules | 8 |
| collectibles | 1 |
| currencies | 1 |
| difficulty-scaling | 4 |
| friendship | 8 |
| heroes | 8 |
| hub-buildings | 8 |
| items | 36 |
| loot-tables | 12 |
| map-nodes | 8 |
| monsters | 42 |
| npcs | 8 |
| oopsies | 8 |
| random-gameplay-events | 20 |
| relics | 15 |
| room-events | 11 |
| spells | 22 |
| stage-goals | 6 |
| stages | 6 |
| status-effects | 7 |
| story route/support files | 9 |
| upgrades | 15 |
| weapons | 10 |

#### 8. Asset / Animation Audit

Current status: fallback-safe, not release-art complete.

- `sync:assets` reports unresolved assets: 0.
- Missing audio is covered by fallback: 12 files.
- `validate:animations` validates 384 exact animation definitions.
- Missing animation frame files: 1851 expected PNGs.
- `audit:asset-variants` reports 60 optional missing variants.
- Final asset folder structure has been scaffolded through `scripts/ensure-final-asset-folders.mjs`.
- Board block exact-frame paths and route story asset manifest entries are implemented.

Release risk: high for presentation, low for crash safety.

#### 9. GDD Compliance

| Requirement | Status | Notes |
|---|---|---|
| Cascade Gravity identity | Compliant | Implemented and should be protected by tests. |
| Portrait mobile primary target | Mostly compliant | Layout helpers and mobile controls exist; device smoke pending. |
| Cheerful festival tone | Mostly compliant | Current route content is aligned; older docs/content may still contain legacy wording. |
| Data-driven content | Mostly compliant | JSON content is broad; effect execution still has hardcoded handlers. |
| Safe fallbacks | Compliant | Assets/audio/content/route/save fallbacks exist. |
| Exact PNG frame sequences | Compliant in code/docs | Missing final PNG packages remain. |
| Six-stage story route | Implemented | 36 route scenes, 18 endings. |
| Functional route choices | Implemented, partial depth | Rewards and risks hook into existing systems, with safe fallback for unsupported paths. |
| Boss callbacks | Implemented | Battle startup applies callback text/modifier when route lane exists. |
| Hero endings | Implemented | Normal/True plus optional Risky Variant path exists. |

#### 10. Manual Smoke Checklist Status

Not manually tested in this pass.

| Smoke Path | Status |
|---|---|
| Start a new run | Code-present, not manually tested |
| Select Milo or another route hero | Code-present, not manually tested |
| Enter Stage 1 map | Code-present, not manually tested |
| Trigger event-node route scene | Code-present, not manually tested |
| Trigger combat-victory route fallback | Code-present, not manually tested |
| Choose Practical / True / Risky route option | Code-present, not manually tested |
| Verify reward/risk effects | Code-present, not manually tested |
| Verify route progress save/load | Code-present, not manually tested |
| Reach boss and see callback | Code-present, not manually tested |
| Finish Stage 6 / King Bloxley | Code-present, not manually tested |
| Resolve Normal/True/Risky Variant ending | Code-present, not manually tested |
| Portrait-mobile text fit | Not manually tested |

#### 11. Priority Backlog

##### P0 - Stabilization

1. Add automated tests or deterministic smoke harness for Cascade Gravity.
2. Add save migration tests, especially route progress and route ending unlocks.
3. Add route choice resolution tests for all reward types and risk branches.
4. Add `test` and `lint` scripts or explicitly document replacements.
5. Run full desktop and portrait-mobile smoke tests.

##### P1 - Release 1 Core

1. Implement biome-based sequential encounter packs and monster stack UI.
2. Implement Festival Level-Up with stackable general and hero-specific upgrades.
1. Import Priority 1 exact-frame PNG animation assets.
2. Replace critical-path placeholder sprites/icons/portraits/ending cards.
3. Verify all route triggers, route rewards, boss callbacks, and endings in play.
4. Verify every boss rule has visible mechanical behavior.
5. Audit item/spell/relic/upgrade/oopsie content against supported effect handlers.
6. Verify random gameplay events, stage goals, battle objectives, chaos rules, and reactive hazards cannot soft-lock runs.
7. Tone-clean remaining legacy wording where it is user-facing.

##### P2 - Release Polish

1. Add final OGG audio or approve fallback audio as the intended style.
2. Add Playwright screenshot script to `package.json` if it is part of QA.
3. Balance shop/economy/rewards.
4. Validate Android debug build.
5. Improve accessibility/settings verification.

##### P3 - Later

1. Expand hub progression into a real upgrade loop.
2. Expand friendship into a full progression loop.
3. Decide whether the two extra heroes are Release 1, unlockable extras, or backlog.
4. Add a dedicated boss intro scene if inline boss cards are not enough.

#### 12. Recommended Next Prompt

Do a Release 1 stabilization pass:

1. Add deterministic tests or a smoke harness for Cascade Gravity, save migration, route choice resolution, route rewards, boss callbacks, and ending resolution.
2. Run a browser smoke test on desktop and portrait-mobile viewports.
3. Fix any route dialogue layout overflow found by screenshots.
4. Verify all 36 route scenes can trigger exactly once per run/hero-stage.
5. Verify route save/load preserves scores, true flags, chosen scenes, triggered scenes, and ending unlocks.
6. Verify each boss callback is visible and mechanically applied.
7. Keep Cascade Gravity, exact-frame PNG naming, fallback-safe assets/audio, and cheerful festival tone intact.

Run:

```bash
npm.cmd run validate:content
npm.cmd run validate:metadata
npm.cmd run validate:animations
npm.cmd run sync:assets
npm.cmd run audit:asset-variants
npm.cmd run build
```

Treat missing final PNG/audio assets as release blockers for presentation, not as crash blockers.


#### 12A. Recommended Prompt — Sequential Encounter Packs and Festival Level-Up

```text
Read docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md first.
Then read docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md, docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md, docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md, docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md, and docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md.

Task:
Implement Sequential Encounter Packs and Festival Level-Up for Blockmancer Dungeon.

Core rules:
- Generate battle node enemy packs from stage/biome monster pools, not hardcoded node lists.
- Fight enemies sequentially. Only one enemy is active at a time.
- Node is cleared only after every enemy in the encounter pack is defeated.
- Reset enemy attack counter when the next enemy enters.
- Apply safe entry grace to new enemies.
- Pair every enemy entry pressure effect with a small player-positive gift.
- Show a compact monster stack UI using small monster icons.
- Grant XP during combat, but show post-node result summary only after the full node is cleared.
- Add Node Result Screen showing EXP gained this node, EXP breakdown, EXP remaining to next level, and Level Up Ready state.
- Add 3-card level-up selection with stackable general and hero-specific upgrades after the result screen when pending level-ups exist.
- Enforce upgrade stack limits and caps.
- Preserve Cascade Gravity, portrait-mobile readability, cheerful festival tone, and fallback safety.

Inspect first:
- src/game/systems/EnemySystem*
- src/game/systems/CombatSystem*
- src/game/systems/BoardSystem*
- src/game/systems/RewardSystem*
- src/game/systems/UpgradeSystem*
- src/game/systems/SaveSystem*
- src/game/scenes/BattleScene*
- src/game/scenes/RewardScene*
- src/game/content/monsters/
- src/game/content/stages/
- src/game/content/difficulty-scaling/
- src/game/content/upgrades/
- src/game/ui/
- src/game/types/

Implementation order:
1. Add run-state and save migration for current encounter pack and PlayerLevelState.
2. Add biome monster pool content and encounter pack scaling content.
3. Add EncounterPackSystem or equivalent EnemySystem generator.
4. Update BattleScene/CombatSystem to advance enemies sequentially inside one node.
5. Gate node rewards, map completion, route fallback triggers, and level-up screens until encounter pack clear.
6. Add enemy entry pressure/gift effects with event log feedback.
7. Add MonsterStackPreview UI with 24-36px icons and fallback-safe mystery chip.
8. Add LevelUpSystem with XP curve and pending level-ups.
9. Add NodeResultScene/NodeResultPanel that shows EXP gained, breakdown, EXP remaining, and level-up-ready state after node clear.
10. Add 3-card reward generation for level-up choices after the result screen.
11. Add general level-up upgrades and hero-specific upgrades from the Game Design SOT.
12. Add real runtime handlers for each upgrade effect and validation for unsupported effects.
13. Add deterministic tests or debug smoke steps for sequential encounter, save/load mid-node, XP, upgrade selection, and caps.

Acceptance criteria:
- Stage 1 early nodes stay single-enemy and late nodes can gently generate 2 enemies.
- Stage 2+ normal/elite nodes can generate fair sequential packs from biome pools.
- Only one enemy is active at a time.
- Next enemy entry resets attack counter and applies entry grace.
- Entry pressure always has a small player gift.
- Rewards are granted once per node, not once per enemy.
- XP accumulates during combat but Node Result Screen appears only after node clear.
- Node Result Screen shows total EXP gained, EXP breakdown, EXP remaining, and Level Up Ready state.
- Level-up selection appears after Node Result Screen when pending level-ups exist.
- General and hero-specific upgrades stack within caps and persist through save/load.
- Unsupported upgrade effect IDs fail validation or produce explicit development warnings.
- npm run validate:content passes.
- npm run validate:metadata passes if metadata changed.
- npm run validate:animations passes or only reports known missing art warnings.
- npm run build passes.

Finish response with:
Summary / Files changed / Systems changed / Content added / Save migration notes / Commands run / Manual test steps / Known limitations.
```


---

## Route Story Implementation Audit

**Source file:** `ROUTE_STORY_IMPLEMENTATION_AUDIT.md`

**Consolidation note:** Primary source for route runtime implementation decisions and risks.

### Route Story Implementation Audit

Date: 2026-05-18

#### Source Documents Read

- `AGENT.md`
- `docs/01_GDD_MASTER.md`
- `docs/story board/blockmancer_master_character_route_index.md`
- `docs/story board/blockmancer_milo_route_variable_choices.md`
- `docs/story board/blockmancer_pippa_route_variable_choices.md`
- `docs/story board/blockmancer_zuzu_route_variable_choices.md`
- `docs/story board/blockmancer_nixie_route_variable_choices.md`
- `docs/story board/blockmancer_bruk_route_variable_choices.md`
- `docs/story board/blockmancer_lumi_route_variable_choices.md`

#### Existing Architecture Findings

- `ContentRegistry` loads known content folders with safe fallback IDs, but route story content did not exist yet.
- `SaveSystem` and `normalizeRunState` already migrate old saves defensively, so route progress can fit into `RunState`.
- `MapScene` owns map-node entry and is the cleanest place to prefer route triggers on Event nodes.
- `BattleScene` owns combat victory and boss intro, so it is the right place for boss callbacks and the no-Event-node route fallback after first combat victory.
- `VictoryScene` already handles Normal/True ending display, but it needed hero-route ending IDs and optional risky variant text.
- `RewardSystem`, `InventorySystem`, and `OopsieSystem` already provide hooks for functional route rewards.

#### Implementation Decisions

- Added a generic route progress model on `RunState.routeProgress`.
- Added meta fields for persisted route ending unlocks and risky variant unlocks.
- Loaded route scenes from JSON files under `src/game/content/story/routes/`.
- Kept each hero route in a separate JSON file.
- Used stable full scene IDs such as `SCN_MILO_01_SPRINKLE_SEWERS`.
- Used unique trigger IDs for all 36 hero-stage route scenes.
- Route events trigger once per hero-stage per run.
- Event-node route triggers are preferred. Combat-victory fallback only fires when no uncompleted Event node remains in the stage map.
- Missing route content returns a safe fallback scene and logs validation warnings instead of crashing.

#### Reward Hook Coverage

- Directly functional: gold, heal, mana, shield, item grants, relic/upgrade grants through `RewardSystem`, battle modifiers, warning modifiers, and Oopsie chance.
- Placeholder-safe: stage, boss, and hazard modifiers use current reactive-state hooks where available and otherwise log a route modifier message.

#### Risks / Follow-Up

- Route scene UI is functional and mobile-readable, but future polish can add portraits and route-specific icons.
- Route rewards intentionally use conservative stat/item/modifier hooks to avoid destabilizing combat balance.
- Boss callbacks currently display at boss intro and apply a small generic practical/true/risky modifier based on the selected route lane.


---

## Updated Files Changelog

**Source file:** `UPDATED_FILES_CHANGELOG.md`

**Consolidation note:** Use for what changed in this documentation refresh package.

### Updated Files Changelog — 2026-05-18

This package refreshes uploaded Blockmancer Release 1 documentation and asset planning files.

#### Global changes

- Added current status snapshots to the uploaded markdown files.
- Clarified what is implemented, partial, missing, or requires verification.
- Kept Phaser 3 + TypeScript + Vite + Capacitor as the recommended stack.
- Separated runtime-safe asset status from final-art production status.
- Added asset production priorities and remaining implementation priorities.
- Preserved existing content and did not remove historical sections.

#### Files updated

- `ASSET_RUNTIME_MAPPING_REPORT.md`
- `ASSET_VARIANT_AUDIT.md`
- `ASSET_VARIANT_INTEGRATION_REPORT.md`
- `blockmancer_release_1_asset_manifest_designer_descriptions.md`
- `BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION.md`
- `PLACEHOLDER_ASSET_GENERATION_REPORT.md`
- `RELEASE_1_CODE_AUDIT_REPORT.md`
- `00_INDEX.md`
- `01_GDD_MASTER.md`
- `02_REACTIVE_DIFFICULTY_IMPLEMENTATION_PLAN.md`
- `ANIMATION_ASSET_REQUIREMENTS.md`
- `ASSET_RUNTIME_ALIGNMENT_REPORT.md`
- `blockmancer_vibe_code_release_1_plan_UPDATED.md`
- `blockmancer_release_1_agent_phase_prompts_UPDATED.md`
- `BLOCKMANCER_RELEASE_1_CURRENT_STATUS_AND_ASSET_PLAN.md`

#### Main interpretation updates

- Runtime asset mapping is safe, but final art and exact-frame PNG imports are still needed.
- Placeholder assets are not final production art.
- Variant support is implemented and fallback-safe.
- Audio fallback works, but final OGG assets are still missing.
- Exact-frame animation requirements are valid and should remain the production contract.
- The next milestone should be Stage 1 vertical slice stabilization.


---

## Historical/Deeper Code Audit

**Source file:** `RELEASE_1_CODE_AUDIT_REPORT.md`

**Consolidation note:** Historical and detailed code inventory; the story-flow audit above wins when statuses conflict.


<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### 0. Follow-up Update — 2026-05-18

Decision after reviewing this audit: **keep Phaser 3 + TypeScript + Vite + Capacitor**. The project already has enough runtime scaffolding that an engine migration would slow progress more than it helps.

##### Updated release focus

1. Stabilize one full Stage 1 vertical slice.
2. Import/verify Priority 1 board and VFX animation assets.
3. Fix P0 objective/test/save issues.
4. Complete Stage 1 boss and core spell/item effects.
5. Run desktop and portrait-mobile smoke tests.
6. Only revisit engine migration if Phaser still blocks performance or maintainability after this vertical slice.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->
﻿# Blockmancer Dungeon — Release 1 Code Audit Report

#### 1. Audit Summary

- Overall build status: pass when run outside the local sandbox. The first sandboxed build attempt failed with a Vite/esbuild filesystem access error, then `npm.cmd run build` passed with escalation.
- Overall implementation status: broad Release 1 scaffold is present. The core battle loop, Cascade Gravity, map routing, reward flow, content registry, save migration, settings, audio fallback, exact-frame animation manifest, and many replayability hooks are implemented. Several systems are functional but shallow, and some content is loaded but not fully executed by runtime gameplay.
- Biggest completed areas: Phaser scene flow, board placement and Cascade Gravity, combat resolution, enemy/boss selection, content registry and validation, exact-frame PNG animation manifest/preload/fallback flow, save/meta migration, reward application, item/relic/upgrade effects, debug scene, Android/Capacitor scaffolding.
- Biggest missing areas: final PNG animation asset packages, full playable spell roster, full boss mechanics, complete hub progression upgrades, complete friendship gameplay, story/endings depth, release-grade audio packages, automated tests/lint, and manual smoke-test evidence.
- Biggest technical risks: runtime depends heavily on generated placeholder textures/audio fallbacks because `public/assets` has no real assets; the new animation validator reports missing expected PNG frame files as nonfatal warnings; several systems use hardcoded effect switches despite data-driven content; legacy curse-named content/effect identifiers conflict with the current cheerful GDD; BattleObjective completion checks contain placeholder `true` branches; mobile layout needs device smoke testing.
- Recommended next milestone: stabilize the Release 1 vertical slice: import Priority 1 exact-frame PNG assets, verify animation fallbacks in battle, complete one full stage-to-boss path with real assets, tone-clean visible GDD text, implement spell/item/reward effects for that slice, and add a repeatable smoke test.

#### 2. Commands Run

| Command | Result | Notes |
|---|---|---|
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd install` | pass | Dependencies were already up to date; audit reported 0 vulnerabilities. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run validate:content` | pass | Validated 291 content files. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run validate:metadata` | pass | Validated 25 metadata files. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run validate:animations` | pass | Validated 365 exact animation definitions. Warned that 1832 expected PNG frame files are not present yet; this is nonfatal by design. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run build` | fail, then pass | Sandboxed run failed with Vite/esbuild access denied resolving `vite.config.ts`; escalated run passed and built `dist/`. |
| `npm run test` | not available | No `test` script exists in `package.json`. |
| `npm run lint` | not available | No `lint` script exists in `package.json`. |

#### 3. Feature Implementation Matrix

| Area | Expected by GDD / Release Plan | Current Status | Evidence in Code | Gaps | Recommended Next Action | Priority |
|---|---|---|---|---|---|---|
| Cascade Gravity | Clear lines, then unsupported blocks fall by column; no classic row shifting. | Implemented | `BoardSystem.clearLinesCascade`, `applyCascadeGravity`, `detectCompletedLines`; `CombatSystem.resolveCascadeClear`. | Needs more test coverage around special blocks, dynamic board sizes, and simultaneous clears. | Add unit/smoke coverage for cascade cases. | P0 |
| BoardSystem | Falling blocks, hold, ghost, special blocks, board mutation safety. | Implemented | `BoardSystem.ts`, `BattleScene.ts`. | Normal tetromino cells are numeric colors while board-block content is richer object data; not every content block type participates in piece generation. | Keep Cascade Gravity and add focused tests before more board features. | P0 |
| CombatSystem | Convert line/cascade clears into damage, mana, combo, fever, enemy effects. | Implemented | `CombatSystem.ts`, `FeverSystem.ts`, `RelicSystem.ts`, `UpgradeSystem.ts`. | Many combat modifiers are switch-based; some boss/passive interactions are shallow. | Stabilize behavior contracts and add battle smoke tests. | P1 |
| EnemySystem | Data-driven normal/elite/boss enemies by stage. | Implemented | `EnemySystem.ts`, `src/game/content/monsters/`. | Behavior strings are mostly descriptive; advanced behavior execution lives elsewhere or is missing. | Expand behavior dispatcher only for Release 1 boss needs. | P1 |
| BossSystem | Six bosses with rules/cards and phase hooks. | Partial | `BossSystem.ts`, `BossRuleSystem.ts`, `BattleScene.showBossRuleCard`, boss monster JSON. | No dedicated `BossIntroScene`; several boss behaviors are lightweight. | Implement stage-boss mechanics and verify boss cards in battle. | P1 |
| SpellSystem | Broad spell roster, mana costs, board/combat effects. | Partial | `SpellSystem.ts`, `src/game/data/spells.ts`, 21 spell content files. | Runtime spell list exposes only four spells from `data/spells.ts`; most content spells are not playable/effect-backed. | Decide Release 1 playable spell roster and wire remaining required effects. | P1 |
| InventorySystem | Items held/used safely during runs. | Partial | `InventorySystem.ts`, `ItemSystem.ts`, `BattleScene` item UI. | Inventory wrapper is thin; item effects are implemented by hardcoded switch. | Keep wrapper but add tests for item use and save restore. | P2 |
| ItemSystem | Reactive items for junk, floating blocks, hazards, utility. | Partial | `ItemSystem.ts`, `src/game/content/items/`. | Some item IDs/effects are supported, but content coverage exceeds behavior coverage. | Audit item JSON against `ItemSystem.applyEffect`. | P1 |
| RewardSystem | Battle/event/shop/treasure rewards, relics, upgrades, items, gold/heal. | Implemented | `RewardSystem.ts`, `RewardScene.ts`, loot table content. | Reward behavior is mostly code-switch based; reward UI is functional but needs polish. | Add smoke tests for reward choices and rerolls. | P1 |
| RelicSystem | Relic passive effects. | Partial | `RelicSystem.ts`, `src/game/content/relics/`. | Effects are hardcoded for known IDs; adding content requires code changes. | Document supported relic effect IDs or add a data-driven interpreter. | P2 |
| UpgradeSystem | Upgrade effects for combat/board modifiers. | Partial | `UpgradeSystem.ts`, upgrade JSON. | Same code-switch scaling risk as relics. | Keep current scope, test Release 1 upgrades. | P2 |
| HeroSystem | Six heroes, passives, unlocks, spell loadouts. | Partial | `HeroSystem.ts`, `MetaSystem.ts`, hero content. | Content has eight heroes; passives are not all deeply implemented. `DEFAULT_HERO_ID` in constants is stale and unused-looking. | Align hero list with Release 1 decision and validate passives. | P1 |
| WeaponSystem | Weapon content and effects. | Placeholder | `WeaponSystem.ts`, weapon content. | System only lists/gets weapons; combat integration is minimal. | Implement or de-scope weapon effects for Release 1. | P2 |
| MapSystem | Six-stage roguelike map with 6 main nodes per stage and boss. | Implemented | `MapSystem.ts`, `MapScene.ts`. | Stage 6 lacks explicit mini-boss/royal-guard node from GDD; legacy hardcoded event cards remain. | Adjust stage 6 route if required by GDD. | P1 |
| StageSystem | Stage content and current stage handling. | Implemented | `StageSystem.ts`, stage content, `BlockmancerGame`. | Stage-specific rules are spread across systems. | Keep as lookup layer; document ownership. | P3 |
| EventSystem | Data-driven event rooms with choices and rewards/oopsies. | Partial | `EventSystem.ts`, `EventScene.ts`, room-event content. | Legacy curse effect names and old event naming conflict with tone; effect support is switch-based. | Rename/tone-clean content and effect aliases without breaking saves. | P1 |
| ShopSystem | Shop rooms, item/relic/upgrade purchases. | Partial | `ShopSystem.ts`, `ShopScene.ts`. | Economy balance and inventory limits need testing; UI is basic. | Smoke test shop purchase and save paths. | P2 |
| OopsieSystem | Silly drawbacks replacing curse framing. | Partial | `OopsieSystem.ts`, oopsie content. | Some legacy names/files include curse/blood wording; effects use direct ID switches. | Tone-clean content and preserve compatibility aliases. | P1 |
| FeverSystem | Fever meter, fever state, combo/cascade meta. | Partial | `FeverSystem.ts`, `CombatSystem.ts`, `BattleScene.ts`. | Fever exists but needs UX balancing and manual verification. | Add smoke test for fever trigger and display. | P2 |
| SaveSystem | LocalStorage run/meta save with migrations and safe defaults. | Implemented | `SaveSystem.ts`, `GameTypes.ts`, `MetaTypes.ts`. | Save coverage for newest fields should keep growing; no automated migration tests. | Add migration tests before changing save shape again. | P0 |
| AssetSystem | Asset manifest, placeholders, missing asset fallback, exact-frame PNG animation preload/playback. | Implemented | `AssetSystem.ts`, `data/assets.ts`, `data/animations.ts`, `data/animation-standards.json`, `BootScene.ts`, `BattleScene.ts`. | Real assets are mostly absent; animation frame assets are expected but missing; fallback is safe but release visuals are placeholder-heavy. | Import final exact-frame PNG assets and verify preload/animation warnings. | P1 |
| AudioSystem | Music/SFX hooks and fallback when assets missing. | Partial | `AudioSystem.ts`, `AssetSystem.ts`. | No real audio files in `public/assets`; synth fallback is not release audio. | Add final audio or explicitly ship fallback style. | P2 |
| InputSystem | Keyboard/mobile input helpers. | Implemented | `InputSystem.ts`, `MobileControls.ts`, `BattleScene.ts`. | Needs device testing for portrait touch ergonomics. | Run mobile smoke tests in browser/device. | P1 |
| TutorialSystem | Onboarding flow. | Partial | `TutorialSystem.ts`, `TutorialScene.ts`, `MainMenuScene.ts`. | Tutorial does not cover all later replayability systems. | Keep first-run tutorial narrow; add contextual tips later. | P2 |
| SettingsSystem | Accessibility/settings persistence. | Partial | `SettingsSystem.ts`, `SettingsScene.ts`. | Basic settings exist; accessibility coverage needs device validation. | Verify reduced motion, audio, and mobile UI scale. | P2 |
| Reactive Difficulty systems | Incoming junk, floating blocks, hazards, counters, relief tools. | Partial | `DifficultySystem.ts`, `ItemSystem.ts`, `RandomGameplayEventSystem.ts`, `BattleScene.ts`. | Several concepts exist but need end-to-end tuning and soft-lock checks. | Build a reactive-difficulty test script/checklist. | P1 |
| Random Gameplay Event system | Room modifiers and run variety. | Partial | `RandomGameplayEventSystem.ts`, 20 event content files. | Effects are real but limited to supported switch cases. | Validate every random event ID/effect is meaningful in play. | P1 |
| Stage Goal system | One optional stage goal with rewards/pressure. | Partial | `StageGoalSystem.ts`, stage-goal content. | Some goal effects are mostly progress/text; boss impact needs verification. | Implement/verify clear stage-goal reward consequences. | P1 |
| Chaos Rule system | Festival chaos modifiers for battles. | Partial | `ChaosRuleSystem.ts`, chaos-rule content. | Start effects support only a few effect types. | Match chaos content to supported effects. | P2 |
| Battle Objective system | Mini-objectives in battle. | Partial | `BattleObjectiveSystem.ts`, content. | Some checks return `true` placeholders (`clear_all_junk`, `low_board_height`) and can grant unearned completion. | Replace placeholder checks before release. | P0 |
| Boss Rule system | Boss rule card shown and rule effects. | Partial | `BossRuleSystem.ts`, boss-rule content, `BattleScene.ts`. | Card lookup exists; mechanical effects are not uniformly enforced. | Audit each boss rule against BattleScene behavior. | P1 |
| Board Size Modifier system | Dynamic board dimensions by stage/encounter. | Partial | `BoardSizeModifierSystem.ts`. | Rules are hardcoded, not content-loaded; resizing can clear current piece. | Test all room transitions and document hardcoded release rules. | P1 |
| Hub Progression system | Meta hub buildings and upgrades. | Placeholder | `HubProgressionSystem.ts`, `HubScene.ts`, hub-building content. | Lists/summaries exist; no complete upgrade purchase/effect loop. | Decide whether hub upgrades are Release 1 core or post-release. | P2 |
| Friendship system | NPC/boss friendship and unlock rewards. | Placeholder | `FriendshipSystem.ts`, friendship content, `CollectionScene.ts`. | Points/content exist; gameplay loop is shallow. | Move to backlog or implement one complete friendship path. | P3 |

#### 4. Implemented Features

##### Core gameplay

- Cascade Gravity works: completed lines are detected, cleared, then unsupported cells fall by column in `BoardSystem.clearLinesCascade` and `applyCascadeGravity`. Combat consumes the resulting line/cascade details through `CombatSystem.resolveCascadeClear`.
- Falling-block controls work through `BoardSystem`, `InputSystem`, `MobileControls`, and `BattleScene`: move, rotate, soft drop, hard drop, hold, ghost position, and current/next piece state all exist.
- Combat loop works: enemy HP, attack counters, player HP/mana/shield, damage, combo, cascade multiplier, fever hooks, rewards, and game over/victory routing are implemented in `BattleScene`, `CombatSystem`, `EnemySystem`, and `RewardSystem`.
- Map flow works: `BlockmancerGame.newRun` creates a map, `MapScene` renders/selects nodes, and rooms route to battle/event/shop/rest/treasure/reward scenes.

##### Content/data

- `ContentRegistry.ts` loads eager JSON content from `src/game/content/**/*.json` for all canonical categories used by GDD.
- Content validation passes for 291 files, and metadata validation passes for 25 metadata files.
- Exact animation standards are centralized in `src/game/data/animation-standards.json` and compiled into runtime definitions by `src/game/data/animations.ts`.
- Board blocks, spells, items, heroes, monsters, and bosses now have optional animation/VFX key references where appropriate, while older content remains valid.
- Fallback IDs are present for registry defaults, including `mon_dungeon_slime`, `hero_milo_blockmancer`, `wpn_basic_wand`, `spl_fireball`, `rel_goblin_coin`, and `block_red`.

##### UI/mobile

- Portrait orientation is requested best-effort in `main.ts`.
- Phaser scale config and scenes are aimed at portrait mobile dimensions.
- Mobile controls exist in `MobileControls.ts` and are used by `BattleScene`.
- Menu, hero select, map, battle, reward, event, shop, rest, treasure, tutorial, settings, help, collection, hub, story, victory, game over, and debug scenes are registered in `BlockmancerGame.ts`.

##### Meta progression

- `SaveSystem.ts` handles run and meta LocalStorage saves with versioned migrations.
- `MetaSystem.ts` tracks unlocks and run completion style progress.
- Hub and friendship content is loaded and visible through thin systems/scenes, though not yet a complete progression loop.

##### Build/release

- Vite build passes outside the sandbox.
- Capacitor config and Android project files exist.
- `package.json` contains Android helper scripts: `android:init`, `android:sync`, `android:open`, and `android:build:debug`.
- `package.json` includes `validate:animations` for exact-frame animation manifest checks.

##### QA/debug

- `DebugScene.ts` is registered in development builds from `MainMenuScene`.
- Validation scripts exist for content, metadata, and exact-frame animation definitions.
- Several asset audit/sync scripts exist under `scripts/`.

#### 5. Partially Implemented Features

- Spell roster: 21 spell content files exist, but runtime spell use is limited to the four spells defined in `src/game/data/spells.ts`. Risk level: high for Release 1 content expectations. Suggested next step: decide the playable Release 1 spell list and implement only those effects first.
- Boss mechanics: six boss monsters and boss rules exist, but many behaviors are not deeply enforced as mechanical rules. Risk level: high. Suggested next step: write a per-boss checklist and implement/verify each boss rule in `BattleScene`/systems.
- Replayability systems: random events, chaos rules, stage goals, battle objectives, dynamic board size, and reactive difficulty all have code and content, but several effects are shallow or switch-limited. Risk level: medium-high. Suggested next step: run every content ID through a supported-effect audit and remove/disable no-op entries.
- Items/relics/upgrades/oopsies: systems apply many effects, but behavior is hardcoded by ID/effect string. Risk level: medium. Suggested next step: document supported effect types and validate content against them.
- Hub progression and friendship: content and summary display exist, but full progression/effect loops are not done. Risk level: medium. Suggested next step: either de-scope to visible collection/progress for Release 1 or implement one complete upgrade/friendship loop.
- Settings/accessibility: settings scene and persistence exist, but full accessibility acceptance needs device testing. Risk level: medium. Suggested next step: test portrait touch, reduced motion, audio toggles, text readability.
- Asset/audio pipeline: fallback systems and exact-frame animation preload/registration exist, but real release assets/audio are absent from `public/assets`. Risk level: high for release presentation. Suggested next step: import final PNG/audio assets and run preload plus animation smoke tests.

#### 6. Not Implemented Features

- Complete weapon effect system: GDD expects meaningful hero/weapon progression. Current `WeaponSystem.ts` is essentially lookup-only. Suggested phase: Release 1 core-loop polish. Priority: P2.
- Dedicated boss intro scene: AGENT/release structure references `BossIntroScene.ts`; current implementation uses inline boss cards in `BattleScene`. Suggested phase: optional polish unless a separate scene is required. Priority: P3.
- Full story/dialogue/endings depth: `StoryScene` and `StorySystem` exist, but story is thin compared with the broad GDD. Suggested phase: narrative polish. Priority: P2.
- Complete friendship gameplay: content exists, but gameplay loop is not complete. Suggested phase: future/replayability milestone. Priority: P3.
- Automated test suite: no `npm run test` script. Suggested phase: before major feature expansion. Priority: P1.
- Lint/static-quality script: no `npm run lint` script. Suggested phase: release readiness. Priority: P2.
- Full release asset/audio package: no real assets found in `public/assets` beyond `.gitkeep`. Suggested phase: before release candidate. Priority: P1.
- Store metadata package: Android project exists, but store listing/art/release metadata is not complete in the inspected codebase. Suggested phase: release packaging. Priority: P2.

#### 7. Added Later / Extra Features

| Item | Evidence | Assessment | Recommendation |
|---|---|---|---|
| Board-block PNG frame animation support | `AssetSystem.ts`, `BoardSystem.ts`, `BattleScene.ts`, `docs/BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION.md` | Added later but compatible with current asset direction. | Keep and document in GDD/assets docs if it is now product direction. |
| Exact-frame animation manifest | `src/game/data/animation-standards.json`, `src/game/data/animations.ts`, `docs/ANIMATION_ASSET_REQUIREMENTS.md`, `scripts/validate-animations.mjs` | Added after the initial audit; now provides the canonical exact-frame PNG sequence definitions for board blocks, VFX, spells, items, heroes, monsters, bosses, hazards, and UI. | Keep. Treat it as the asset production contract and continue wiring only low-risk runtime hooks. |
| Extra heroes beyond the six called out in GDD summary | `src/game/content/heroes/` has 8 hero JSON files | Could be future/backlog content. | Needs product decision: keep locked/future or update GDD. |
| Legacy curse terminology | `EventSystem.ts` effect aliases, content names like cursed/blood wording, deprecated save fields | Conflicts with cheerful no-dark-lore direction even if some UI text is sanitized. | Rename content and keep compatibility aliases internally. |
| Hardcoded legacy event cards | `MapSystem.EVENT_CARDS`, `getRandomEvent` | Appears historical or unused by current `EventScene`. | Remove later only after confirming no callers remain; document as historical now. |
| Development debug entry | `MainMenuScene.ts`, `DebugScene.ts` | Useful dev-only tooling. | Keep dev-gated; ensure it is inaccessible in production builds. |
| Screenshot/UI scripts without npm wrappers | `scripts/check-ui-screenshots.mjs` and related scripts | Useful QA tooling but not integrated into normal validation. | Add package scripts or document manual use. |

#### 8. Broken / Risky Areas

- Build environment risk: `npm.cmd run build` failed inside the sandbox with an access-denied Vite/esbuild resolution error, then passed outside the sandbox. This appears environment-specific, not a code compile failure.
- Missing real asset risk: `public/assets` contains only placeholder `.gitkeep` files. `AssetSystem` fallback generation and exact animation fallback reduce crash risk, but final presentation and preload logging are not release-ready.
- Missing animation frame risk: `validate:animations` expects 365 exact animation definitions and currently warns about 1832 missing PNG frame files. This is nonfatal, but release readiness depends on importing the final Priority 1 frame sequences first.
- Missing real audio risk: `AudioSystem` can synthesize fallback sounds, but actual release music/SFX files are not present.
- Battle objective correctness risk: `BattleObjectiveSystem.isComplete` returns `true` for some objective types such as `clear_all_junk` and `low_board_height`, so objectives can complete without verified behavior.
- Tone compliance risk: legacy curse/blood identifiers and content names conflict with the cheerful magical-festival GDD direction.
- Data-driven gap risk: content is data-driven, but many effects are interpreted by hardcoded `switch` statements in systems. Unsupported effects may silently do nothing.
- Save migration risk: `SaveSystem` has migrations and defaults, but no automated tests protect new fields from future breakage.
- Mobile layout risk: portrait support and mobile controls exist, but no device smoke-test result was recorded during this audit.
- Dynamic board risk: `BoardSizeModifierSystem.resizeBoard` resets the current piece during resizing. That is probably safe on room transitions, but should be tested around random events and boss phases.
- Soft-lock risk: reactive difficulty, incoming junk, floating blocks, and board size changes need combined stress testing to ensure board state remains recoverable.

#### 9. Used vs Unused Code Inventory

| File / Folder | Used by | Status | Evidence | Recommendation |
|---|---|---|---|---|
| `src/game/BlockmancerGame.ts` | `main.ts`, scenes | Used | Owns scene list and systems. | Keep as orchestrator. |
| `src/game/scenes/BattleScene.ts` | `BlockmancerGame` | Used | Main battle loop. | Add tests/smoke coverage before more changes. |
| `src/game/scenes/MapScene.ts` | `BlockmancerGame`, room flow | Used | Node routing. | Verify stage 6 path requirements. |
| `src/game/scenes/RewardScene.ts` | Battle/event flow | Used | Reward selection. | Smoke test reward types. |
| `src/game/scenes/EventScene.ts` | Map event nodes | Used | Uses `EventSystem`. | Tone-clean event content. |
| `src/game/scenes/ShopScene.ts` | Map shop nodes | Used | Uses `ShopSystem`. | Test economy and inventory. |
| `src/game/scenes/RestScene.ts` | Map rest nodes | Used | Heal/rest flow. | Keep. |
| `src/game/scenes/TreasureScene.ts` | Map treasure nodes | Used | Reward flow. | Keep. |
| `src/game/scenes/TutorialScene.ts` | Main menu | Used | Onboarding. | Update after final feature set. |
| `src/game/scenes/DebugScene.ts` | Dev main menu | Used/dev-only | Registered and linked in dev. | Keep dev-gated. |
| `src/game/scenes/CollectionScene.ts` | Main menu | Used | Shows collection/meta style content. | Expand only if Release 1 requires it. |
| `src/game/scenes/HubScene.ts` | Main menu | Used | Hub summary. | Partial; avoid overstating as complete progression. |
| `src/game/scenes/StoryScene.ts` | Main menu | Used | Intro/story. | Expand or de-scope. |
| `src/game/systems/BoardSystem.ts` | Battle/combat | Used | Core board logic. | Protect Cascade Gravity. |
| `src/game/systems/CombatSystem.ts` | Battle | Used | Damage/cascade resolution. | Add tests for edge cases. |
| `src/game/systems/ContentRegistry.ts` | Systems/scenes | Used | Loads content eagerly. | Keep central. |
| `src/game/systems/AssetSystem.ts` | Boot/preload | Used | Manifest and fallbacks. | Verify real asset import. |
| `src/game/systems/AudioSystem.ts` | Game/scenes | Used | SFX/music fallback. | Add real audio assets. |
| `src/game/systems/MapSystem.ts` | Game/map scene | Used | Generates maps. | Remove legacy event cards later if confirmed unused. |
| `src/game/systems/*System.ts` replayability systems | `BlockmancerGame`, `BattleScene`, scenes | Used/partial | Instantiated and referenced. | Audit content-effect support. |
| `src/game/types/` | Systems/content | Used | Shared run/meta/content types. | Keep migrations aligned. |
| `src/game/content/` | `ContentRegistry` | Used | All canonical category folders loaded. | Validate effect support, not just schema. |
| `src/game/data/` | Systems/assets/constants/spells/animations | Used | Constants, runtime spells, assets, exact animation standards and generated animation definitions. | Watch stale constants and keep animation standards aligned with docs. |
| `src/game/ui/` | Scenes | Used | Buttons, HUD, mobile controls, bars. | Continue mobile polish. |
| `scripts/validate-content.mjs` | npm script | Used | `validate:content`. | Keep. |
| `scripts/validate-metadata.mjs` | npm script | Used | `validate:metadata`. | Keep. |
| `scripts/validate-animations.mjs` | npm script | Used | `validate:animations`; checks exact frame counts, required animation IDs, content animation references, and generated frame paths. | Keep and run after animation/content changes. |
| `scripts/generate-placeholder-assets.mjs` | npm script | Possibly Used | `assets:placeholders`. | Keep until real asset pipeline is final. |
| `scripts/sync-assets-from-manifest.mjs` | npm script | Possibly Used | `sync:assets`. | Keep; document asset workflow. |
| `scripts/audit-asset-variants.mjs` | npm script | Possibly Used | `audit:asset-variants`. | Keep for asset QA. |
| `scripts/check-ui-screenshots.mjs` | No npm wrapper found | Possibly Used | Playwright dependency exists. | Add a package script or document manual use. |
| `debug.log`, `.vite-dev.out.txt`, `.vite-dev.err.txt` | Local dev artifacts | Possibly unused | Root generated-looking files. | Do not delete in audit; consider gitignore/cleanup later. |

#### 10. Content Loading Audit

| Content category | Expected by GDD | Existing files | Loaded by ContentRegistry | Validation status | Missing IDs or invalid references | Notes |
|---|---|---:|---|---|---|---|
| heroes | 6 Release 1 heroes | 8 | Yes | pass | None detected by validator | Extra heroes need product decision. |
| monsters | 36 monsters + 6 bosses target | 42 | Yes | pass | None detected | Meets target count. |
| weapons | Hero/weapon progression | 10 | Yes | pass | None detected | Runtime weapon effects are shallow. |
| spells | Multiple spells and loadouts | 21 | Yes | pass | None detected | Runtime playable list is only 4 spells; standards-mapped spells now have VFX animation references. |
| relics | Run modifiers | 15 | Yes | pass | None detected | Effects are ID/switch-driven. |
| upgrades | Run upgrades | 15 | Yes | pass | None detected | Effects are ID/switch-driven. |
| board-blocks | Rune/special/junk board blocks | 21 | Yes | pass | None detected | Normal tetromino cells are still numeric; animation keys now support glow/clear/special references. |
| status-effects | Combat statuses | 7 | Yes | pass | None detected | Execution coverage should be audited. |
| items | Reactive/utility items | 27 | Yes | pass | None detected | Content exceeds verified behavior coverage; item VFX/counter/catalyst animation references are supported where standards exist. |
| oopsies | Silly drawbacks | 8 | Yes | pass | None detected | Some legacy dark naming remains. |
| room-events | Event room choices | 11 | Yes | pass | None detected | Effect support is switch-limited. |
| random-gameplay-events | Replayability modifiers | 20 | Yes | pass | None detected | Effects partial but active. |
| stage-goals | Stage side goals | 6 | Yes | pass | None detected | Consequences need verification. |
| chaos-rules | Festival combat rules | 8 | Yes | pass | None detected | Start effects support only a small set. |
| battle-objectives | Mini-objectives | 10 | Yes | pass | None detected | Some completion checks are placeholders. |
| boss-rules | Boss rule cards | 6 | Yes | pass | None detected | Mechanical enforcement incomplete. |
| hub-buildings | Hub progression | 8 | Yes | pass | None detected | Mostly display/summary. |
| friendship | Friendship progression | 8 | Yes | pass | None detected | Mostly display/points. |
| stages | Six stages | 6 | Yes | pass | None detected | Stage routing exists. |
| loot-tables | Rewards | 12 | Yes | pass | None detected | Used by reward flow. |
| map-nodes | Room node definitions | 8 | Yes | pass | None detected | Used for labels/icons. |
| currencies | Candy coin style economy | 1 | Yes | pass | None detected | Basic economy. |
| collectibles | Meta collectible | 1 | Yes | pass | None detected | Limited collection depth. |
| npcs | Friendly festival NPCs | 8 | Yes | pass | None detected | Dialogue/story use is limited. |
| difficulty-scaling | Reactive scaling | 4 | Yes | pass | None detected | Used by difficulty/enemy systems. |

#### 11. GDD Compliance Findings

- GDD requirement: cheerful magical festival tone with no dark curse lore. Current code behavior: systems and content still include legacy curse/blood identifiers and effect names. File evidence: `EventSystem.ts`, room-event/oopsie content. Impact: tone drift and confusing product vocabulary. Recommended fix: rename content and UI-facing strings, keep internal migration aliases only where needed.
- GDD requirement: Cascade Gravity, not classic row shifting. Current code behavior: Cascade Gravity is implemented and should be preserved. File evidence: `BoardSystem.applyCascadeGravity`. Impact: compliant core identity. Recommended fix: add tests to prevent regressions.
- GDD requirement: portrait mobile as primary target. Current code behavior: portrait orientation request and mobile controls exist. File evidence: `main.ts`, `MobileControls.ts`, Phaser scale config. Impact: likely compliant but unverified on device. Recommended fix: run manual mobile smoke path.
- GDD requirement: data-driven content wherever practical. Current code behavior: content is loaded from JSON, but effect execution is often hardcoded. File evidence: `SpellSystem.ts`, `ItemSystem.ts`, `RelicSystem.ts`, `UpgradeSystem.ts`, `EventSystem.ts`. Impact: adding content can create no-op behavior. Recommended fix: validate effect types against supported interpreters.
- GDD requirement: six-stage route including late-stage special beats. Current code behavior: six stages exist and maps are generated, but Stage 6 does not show an explicit mini-boss/royal-guard node type. File evidence: `MapSystem.getRequiredTypesForStage`. Impact: final stage structure may diverge from GDD. Recommended fix: adjust Stage 6 path or document current route.
- GDD requirement: boss rule cards and boss identity. Current code behavior: boss rule lookup/card exists, but some boss mechanics are shallow. File evidence: `BossRuleSystem.ts`, `BattleScene.ts`. Impact: bosses may not feel distinct enough. Recommended fix: verify each boss rule has a mechanical effect.
- GDD requirement: safe fallbacks for assets/audio/content/saves. Current code behavior: content and save fallbacks are strong; asset/audio fallbacks exist. File evidence: `ContentRegistry.ts`, `SaveSystem.ts`, `AssetSystem.ts`, `AudioSystem.ts`. Impact: compliant for crash safety, but release quality assets are missing. Recommended fix: add final assets/audio and keep fallbacks.
- GDD requirement: exact PNG frame sequences instead of GIF/range-based animation requirements. Current code behavior: `docs/ANIMATION_ASSET_REQUIREMENTS.md`, `src/game/data/animation-standards.json`, `src/game/data/animations.ts`, and `scripts/validate-animations.mjs` define and validate exact frame counts and generated frame paths. File evidence: listed files plus `AssetSystem.ts` preload/registration helpers. Impact: compliant at manifest/code level, but final PNG files are still missing. Recommended fix: import Priority 1 animation frames and rerun `validate:animations`.
- GDD requirement: Release 1 replayability systems. Current code behavior: random gameplay events, stage goals, chaos rules, battle objectives, dynamic board size, reactive difficulty, hub and friendship are present but uneven. File evidence: corresponding systems and content folders. Impact: Release 1 variety exists but needs tightening. Recommended fix: prioritize P0/P1 systems with visible impact.

#### 12. Build, Validation, and QA Findings

- Available scripts: `dev`, `build`, `preview`, `validate:metadata`, `validate:content`, `validate:animations`, `assets:placeholders`, `sync:assets`, `audit:asset-variants`, `android:init`, `android:sync`, `android:open`, `android:build:debug`, `clean`.
- Missing scripts: `test`, `lint`.
- Build result: pass outside sandbox. First sandboxed build failed due environment access error, not TypeScript/Vite compile output.
- Content validation result: pass, 291 files.
- Metadata validation result: pass, 25 metadata files.
- Animation validation result: pass, 365 exact animation definitions; 1832 missing PNG frame files reported as nonfatal warnings.
- Test/lint availability: not available through npm scripts.
- Manual smoke test status: skipped during this audit. No dev server/browser test was requested, and the task was documentation-only.

GDD smoke path status:

| Step | Status | Notes |
|---|---|---|
| Start a new run | Not manually tested | Code path exists in `BlockmancerGame.newRun`. |
| Select Milo | Not manually tested | Hero select and `hero_milo_blockmancer` content exist. |
| Confirm Stage 1 map has 6 main-path nodes | Not manually tested | `MapSystem` generates stage maps. |
| Enter a battle | Not manually tested | Routing exists. |
| Move, rotate, soft drop, hard drop, hold | Not manually tested | Board/input code exists. |
| Clear a line and verify Cascade Gravity | Not manually tested | Cascade code exists. |
| Cast a spell | Not manually tested | Four runtime spells wired. |
| Confirm chaos/objective/event text can appear | Not manually tested | Systems exist. |
| Defeat enemy and choose reward | Not manually tested | Reward flow exists. |
| Visit event/shop/rest/treasure rooms | Not manually tested | Scenes exist. |
| Reach a boss and confirm boss rule card | Not manually tested | Boss card code exists. |
| Save, refresh, and continue | Not manually tested | Save/load code exists. |

#### 13. Priority Backlog

##### P0 — Must fix before more feature work

- Add tests or a deterministic smoke harness for Cascade Gravity, board mutation, and save migration.
- Replace placeholder battle objective checks that currently return `true` without validating the objective.
- Audit save compatibility for all newly added run/meta fields and add migration coverage.
- Confirm no current board/dynamic-size/reactive-difficulty path can soft-lock a run.

##### P1 — Needed for Release 1.0 core loop

- Import real board/UI/scene assets and verify `AssetSystem` resolves them without relying on placeholders.
- Import Priority 1 exact-frame PNG animation sequences and verify `validate:animations` no longer reports missing core board/VFX frames.
- Decide and implement the Release 1 playable spell roster beyond the current four runtime spells, or disable/hide unused spell content.
- Verify each boss rule and boss behavior has a visible mechanical effect.
- Tone-clean legacy curse/blood content and aliases while preserving save compatibility.
- Validate every random gameplay event, stage goal, chaos rule, and item effect against supported runtime behavior.
- Run the full GDD manual smoke path on desktop and portrait mobile.

##### P2 — Needed for polish / release readiness

- Add `npm run test` and `npm run lint` or document explicit alternatives.
- Finish shop/economy balance and inventory UX.
- Improve settings/accessibility verification.
- Add real music/SFX or explicitly define the synth fallback as product style.
- Integrate screenshot/UI scripts into npm commands.
- Complete Android debug build validation and release metadata checklist.

##### P3 — Nice to have / future

- Expand friendship into a complete progression loop.
- Expand hub buildings into upgrade purchases with effects.
- Add a dedicated boss intro scene if the inline card presentation is not enough.
- Move future/extra heroes into a documented backlog or update the GDD.
- Remove historical unused code after a separate cleanup task verifies it has no callers.

#### 14. Recommended Next Prompt

Read `AGENT.md`, `docs/01_GDD_MASTER.md`, `docs/ANIMATION_ASSET_REQUIREMENTS.md`, and `docs/RELEASE_1_CODE_AUDIT_REPORT.md`. Do a P0 stabilization pass only: import or verify Priority 1 exact-frame PNG board/VFX assets, fix placeholder battle objective completion checks, add focused tests or deterministic validation for Cascade Gravity and save migration, and do not change unrelated gameplay. Preserve Cascade Gravity, portrait mobile, cheerful tone, data-driven content, and all existing fallbacks. Run `npm run validate:animations`, `npm run validate:content`, `npm run validate:metadata`, and `npm run build`, and report any missing test/lint scripts without treating them as fatal.


---

## Release 1.0 Vibe Coding Plan

**Source file:** `blockmancer_vibe_code_release_1_plan.md`

**Consolidation note:** Planning source for phases and milestones, not implementation evidence.

### Blockmancer Dungeon — Vibe Coding Plan for Full Game Release 1.0

This document is a practical **vibe coding plan** for turning the current fun MVP into a complete **Release 1.0** game.

Core direction:

> **Blockmancer Dungeon** is a cheerful portrait-mobile falling-block roguelike RPG where the **Block-O-Matic 3000** creates a cute chaotic festival dungeon. The player clears rune block lines, triggers **Cascade Gravity**, casts silly spells, collects snacks/relics/upgrades, unlocks quirky heroes, and saves the Festival of Falling Stars from **King Bloxley**, the self-appointed Block King.

---

#### Release 1.0 Target

##### Core Gameplay

```text
- Portrait-only mobile layout
- Falling-block board
- Cascade Gravity line clear
- Hold block
- Next block queue
- Inventory overlay
- Touch controls
- Compact battle panel
- Monsters and bosses
- Spells
- Items
- Relics
- Upgrades
- Roguelike map
- Save/load
- Hero unlocks
- Win/loss conditions
```

##### Content Target

```text
- 6 stages
- 6 bosses
- 36 regular monsters
- 6 playable heroes
- 10 weapons
- 15 spells
- 15 relics
- 15 upgrades
- 15 board block types
- 10 consumable items
- 8 oopsies / silly drawbacks
- 8 room events
- 8 NPCs
- 12+ loot tables
```

##### Release Target

```text
- Web build
- Android build through Capacitor
- Local save
- QA pass
- Store-ready metadata
- Basic analytics hooks
- Credits/licenses
- Settings
- Tutorial
```

---

#### Development Rules

```text
1. Keep the game playable after every phase.
2. Do not rewrite working systems unless necessary.
3. Prefer small stable changes over large fragile rewrites.
4. Keep placeholder art allowed until polish phases.
5. Keep content data-driven.
6. Use TypeScript types for all systems.
7. Run build after each phase.
8. Portrait mobile is the main target.
9. Keep cheerful festival tone.
10. Core board mechanic is Cascade Gravity, not classic row shifting.
```

---

#### Phase 0 — Release Audit

##### Goal

Understand current MVP state and create a clean Release 1.0 task baseline.

##### Features

```text
- Audit current scenes
- Audit current systems
- Audit content files
- Audit build scripts
- Audit missing assets
- Audit mobile usability
- Audit save/load status
- Identify broken/placeholder systems
- Create release gap list
```

##### Files / Areas

```text
README.md
docs/
src/game/
src/game/scenes/
src/game/systems/
src/game/content/
package.json
```

##### Acceptance Criteria

```text
- Current build status is known
- Existing MVP features are listed
- Missing Release 1.0 features are listed
- A release checklist exists
- No gameplay changes unless required to fix build
```

##### Test Commands

```bash
npm install
npm run build
npm run validate:content
npm run validate:metadata
```

##### Codex Prompt

```text
Audit the current Blockmancer Dungeon repo for Release 1.0 readiness. Do not rewrite systems yet. Create or update docs/RELEASE_1_GAP_AUDIT.md with current implemented features, missing features, broken features, and recommended next phases. Run build and validation commands, then report results.
```

---

#### Phase 1 — Architecture Stabilization

##### Goal

Make the project structure stable enough for full Release 1.0 development.

##### Features

```text
- Ensure all systems are separated
- Ensure scenes have clear responsibilities
- Ensure global state shape is typed
- Ensure constants are centralized
- Ensure ContentRegistry is the only content access layer
- Ensure asset manifest is centralized
- Remove duplicate logic
- Add basic error handling for missing content/assets
```

##### Required Systems

```text
BoardSystem
CombatSystem
EnemySystem
SpellSystem
RewardSystem
RelicSystem
UpgradeSystem
HeroSystem
WeaponSystem
InventorySystem
ItemSystem
MapSystem
StageSystem
EventSystem
ShopSystem
DifficultySystem
SaveSystem
AssetSystem
AudioSystem
InputSystem
TutorialSystem
SettingsSystem
```

##### Acceptance Criteria

```text
- npm run build passes
- No circular imports
- Main game state is typed
- Content can be loaded by ID
- Missing content has safe fallback
- Missing texture has safe fallback
```

##### Codex Prompt

```text
Stabilize the Blockmancer Dungeon architecture for Release 1.0. Ensure systems are modular, game state is typed, content is accessed only through ContentRegistry, assets are accessed through a centralized asset manifest, and missing content/assets fall back safely. Do not change core gameplay behavior unless needed for build stability.
```

---

#### Phase 2 — Content Data 1.0 Conversion

##### Goal

Convert content to the cheerful festival concept and prepare the full 1.0 roster.

##### Features

```text
- Replace dark content with cheerful festival content
- Add 6 stages
- Add 6 bosses
- Add 36 monsters
- Add 6 heroes
- Add 10 weapons
- Add 15 spells
- Add 15 relics
- Add 15 upgrades
- Add 15 board block types
- Add 10 items
- Add 8 oopsies
- Add 8 room events
- Add NPCs
- Add currencies and collectibles
- Add stage-specific loot tables
```

##### Content Areas

```text
src/game/content/heroes/
src/game/content/weapons/
src/game/content/monsters/
src/game/content/bosses/
src/game/content/spells/
src/game/content/relics/
src/game/content/upgrades/
src/game/content/board-blocks/
src/game/content/status-effects/
src/game/content/items/
src/game/content/oopsies/
src/game/content/room-events/
src/game/content/npc/
src/game/content/currencies/
src/game/content/collectibles/
src/game/content/stages/
src/game/content/loot-tables/
src/game/content/difficulty-scaling/
```

##### Acceptance Criteria

```text
- All Release 1.0 content entries exist
- All content uses cheerful tone
- All old dark references are removed or renamed
- All JSON is valid
- IDs match naming convention
- ContentRegistry loads all content
- validate:content passes
```

##### Codex Prompt

```text
Update Blockmancer Dungeon content data to the Release 1.0 cheerful festival concept. Add complete JSON data for 6 stages, 6 bosses, 36 monsters, 6 heroes, 10 weapons, 15 spells, 15 relics, 15 upgrades, 15 board blocks, 10 items, 8 oopsies, 8 room events, NPCs, currencies, collectibles, and stage-specific loot tables. Keep all JSON valid and update ContentRegistry.
```

---

#### Phase 3 — Cascade Gravity 1.0

##### Goal

Make Cascade Gravity the core board identity.

##### Features

```text
- Replace classic line shift with Cascade Gravity
- Clear completed lines
- Remove cleared cells
- Collapse unsupported cells downward by column
- Detect new completed lines
- Repeat until stable
- Track cascade count
- Track blocks dropped
- Trigger combat reward from cascades
- Trigger VFX/log messages
```

##### System Functions

```ts
detectCompletedLines();
removeCompletedLines();
applyCascadeGravity();
resolveCascadeClears();
calculateCascadeReward();
getCascadeResult();
```

##### Data Type

```ts
type CascadeResult = {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  specialBlocksTriggered: string[];
  causedCombo: boolean;
};
```

##### Balance

```text
Cascade 1: 100% damage
Cascade 2: 125% damage
Cascade 3: 150% damage
Cascade 4+: 200% damage
Cascade mana bonus: 50% of normal mana gain
```

##### Acceptance Criteria

```text
- Clearing a line removes only cleared cells first
- Blocks above fall down with grid gravity
- New lines can form after falling
- Cascades resolve automatically
- Combat receives CascadeResult
- Event log shows cascade messages
- Build passes
```

##### Codex Prompt

```text
Implement Cascade Gravity as the core BoardSystem mechanic. When lines clear, remove cleared cells, collapse blocks downward by column, detect new completed lines, repeat until stable, and return a CascadeResult. Integrate cascade damage/mana bonuses into CombatSystem and add event log messages.
```

---

#### Phase 4 — Special Board Blocks

##### Goal

Make the board feel unique beyond normal colored blocks.

##### Features

```text
- Normal rune blocks
- Sprinkle block
- Cupcake block
- Bomb block
- Star block
- Jelly block
- Ice block
- Sticky block
- Crumb junk block
- Royal block
- Confetti block
- Toolbox block
- Clear effects
- Cascade hooks
```

##### Board Block Behavior

```text
block_sprinkle: +mana on clear
block_cupcake: small heal on clear
block_bomb: clear nearby cells
block_star: boost cascade reward
block_jelly: soft cascade block, falls normally now
block_ice: freeze/chill hook
block_sticky: harder to collapse / hazard
block_crumb_junk: enemy junk
block_royal: boss pattern block
block_confetti: random bonus
block_toolbox: item charge
```

##### Acceptance Criteria

```text
- Board supports block type data
- Special block effects trigger on clear
- Bomb can trigger additional cascade resolve
- Junk block appears from enemy attacks
- Boss blocks can appear
- All behavior has safe fallback
```

##### Codex Prompt

```text
Add special board block support to BoardSystem using content data. Implement clear effects for sprinkle, cupcake, bomb, star, junk, royal, confetti, and toolbox blocks. Ensure special effects integrate with Cascade Gravity and do not break board stability.
```

---

#### Phase 5 — Portrait Mobile Layout 1.0

##### Goal

Implement the final portrait-only screen layout.

##### Layout

```text
Top 1/5:
- Compact battle screen
- JRPG/Suikoden-inspired combat area
- Hero side
- Enemy side
- HP bars
- Intent
- Stage name

Middle 3/5:
- Falling-block board
- Next block queue
- Hold block
- Inventory compact overlay
- Fever meter
- Cascade/combo display

Bottom 1/5:
- Mobile controls
- Left/right
- Rotate
- Soft drop
- Hard drop
- Hold
- Spell buttons
- Item/inventory button
```

##### Features

```text
- Lock orientation to portrait where possible
- Refactor BattleScene layout
- Add responsive scaling
- Add safe areas for notches
- Add compact overlays
- Add touch target sizing
- Make UI readable on 1440x3136 and smaller phones
```

##### Acceptance Criteria

```text
- Game is portrait-only
- Top combat uses 1/5 height
- Board uses 3/5 height
- Controls use 1/5 height
- Next block is visible
- Hold block is visible
- Inventory is visible/expandable
- Touch controls are playable
- Desktop browser preview still works
```

##### Codex Prompt

```text
Refactor BattleScene into a portrait-only mobile layout. Use 1/5 screen height for compact battle, 3/5 for falling-block board with next/hold/inventory overlays, and 1/5 for touch controls. Keep desktop preview usable but prioritize mobile portrait.
```

---

#### Phase 6 — Input System 1.0

##### Goal

Make controls feel good on both mobile and desktop.

##### Controls

```text
Desktop:
- A/Left: move left
- D/Right: move right
- W/Up: rotate
- S/Down: soft drop
- Space: hard drop
- Shift/C: hold
- 1-4: spells
- I: inventory
- Esc: pause

Mobile:
- Left button
- Right button
- Rotate button
- Soft drop button
- Hard drop button
- Hold button
- Spell buttons
- Item/inventory button
```

##### Acceptance Criteria

```text
- Mobile buttons feel responsive
- Holding left/right repeats movement
- Soft drop can be held
- Hard drop is single tap
- Rotate is single tap
- Hold works once per piece
- Spell buttons work
- Inventory button works
```

##### Codex Prompt

```text
Implement a polished InputSystem for desktop and mobile. Add touch repeat for left/right and soft drop, single-tap rotate/hard drop/hold, spell buttons, and inventory button. Make controls responsive and safe for portrait mobile play.
```

---

#### Phase 7 — Combat System 1.0

##### Goal

Connect board play, cascade, enemy actions, spells, items, relics, and upgrades into a complete combat loop.

##### Features

```text
- Line clear damage
- Cascade bonus damage
- Mana gain
- Combo tracking
- Fever gain
- Enemy intent
- Enemy attack counter
- Player HP/shield
- Enemy HP/armor
- Status effects
- Board-affecting enemy behavior
- Victory/defeat flow
```

##### Required Enemy Behaviors

```text
basic_attack
spawn_junk
hide_next_block
hide_hold_block
shake_board
freeze_piece
mana_zap
shield_self
sleep_player
swap_next_hold
reverse_controls
pattern_junk
royal_block_spawn
```

##### Acceptance Criteria

```text
- Every enemy behavior has implementation or safe placeholder
- Boss behaviors are unique
- Cascades matter in combat
- Combat logs are readable
- Player can win/lose battle
- Battle reward flow works
```

##### Codex Prompt

```text
Upgrade CombatSystem and EnemySystem for Release 1.0. Connect line clears, CascadeResult, mana gain, combo, fever, enemy intents, enemy behaviors, status effects, player HP/shield, victory, and defeat. Implement safe placeholders for any complex enemy behaviors.
```

---

#### Phase 8 — Spell System 1.0

##### Goal

Make all 15 spells functional and data-driven.

##### Spell List

```text
spl_fireball
spl_frost_lock
spl_bomb_rune
spl_clean_cut
spl_sprinkle_shower
spl_cupcake_blast
spl_confetti_pop
spl_bubble_shield
spl_star_spark
spl_jelly_bounce
spl_snowcone_burst
spl_goblin_gadget
spl_rainbow_reroll
spl_snack_break
spl_cascade_cheer
```

##### Features

```text
- Spell cost
- Spell cooldown/hook if needed
- Spell button UI
- Spell effects
- Spell upgrades
- Spell VFX hooks
- Not enough mana feedback
- Spell disabled state
```

##### Acceptance Criteria

```text
- All spells can be cast if available
- Mana costs apply
- Effects work
- UI updates
- Spell upgrades modify effects
- Build passes
```

##### Codex Prompt

```text
Implement all Release 1.0 spells using SpellSystem and spell content data. Add damage, heal, shield, board clear, reroll, cascade boost, slow/freeze, and random gadget effects. Ensure spell buttons show cost and disabled state.
```

---

#### Phase 9 — Inventory and Item System 1.0

##### Goal

Make the inventory overlay useful during battle and events.

##### Features

```text
- Inventory slots
- Stackable consumables
- Item use rules
- Item pickup
- Item reward
- Item shop purchase
- Item cooldown if needed
- Compact overlay
- Expanded overlay
```

##### Item List

```text
item_mini_cupcake
item_mana_lemonade
item_rainbow_soda
item_toolbox
item_snowcone
item_party_popper
item_bubble_gum
item_lucky_ticket
item_hold_coupon
item_block_polish
```

##### Acceptance Criteria

```text
- Inventory visible in middle board area
- Inventory can expand/collapse
- Items can be used
- Item counts update
- Items can be rewarded/bought
- Inventory capacity upgrades work
```

##### Codex Prompt

```text
Implement InventorySystem and ItemSystem for Release 1.0. Add stackable consumable items, compact/expanded inventory UI, item usage during battle, item rewards, shop purchase integration, and inventory capacity upgrades.
```

---

#### Phase 10 — Hero, Weapon, and Unlock System

##### Goal

Make playable heroes meaningful and unlockable.

##### Heroes

```text
Milo: default, balanced
Pippa: fire damage, unlock Stage 1 boss
Nixie: control/slow, unlock 3 rooms no damage
Bruk: high HP/defense, unlock 500 total gold
Zuzu: bomb/board chaos, unlock Stage 2 boss
Lumi: mana/cascade, unlock 10 cascade combos
```

##### Features

```text
- Hero select scene
- Hero stories
- Hero stats
- Hero passive
- Starting spells
- Starting weapon
- Unlock conditions
- Meta progress save
- Locked hero UI
```

##### Acceptance Criteria

```text
- Hero select shows all heroes
- Locked heroes show unlock condition
- Unlocked heroes persist
- Hero stats affect run
- Hero starting loadout works
- Hero passive works
```

##### Codex Prompt

```text
Implement HeroSystem, WeaponSystem, and hero unlock progression. Add hero select UI with locked/unlocked states, hero stories, hero stats, starting loadouts, passives, unlock conditions, and persistent meta progress.
```

---

#### Phase 11 — Roguelike Map and Stage System

##### Goal

Turn the run into a full 6-stage adventure.

##### Features

```text
- Stage progression
- Stage-specific monster pool
- Stage-specific boss
- Stage-specific events
- Stage-specific loot
- Node map generation or fixed map
- Fight/Event/Shop/Rest/Treasure/Elite/Boss nodes
- Completed/current/available states
```

##### Stages

```text
1. Sprinkle Sewers
2. Goblin Workshop
3. Frosty Pantry
4. Pillow Castle
5. Starfall Arcade
6. Bloxley’s Block Palace
```

##### Acceptance Criteria

```text
- Player progresses through 6 stages
- Each stage has unique monster pool
- Boss appears at end of each stage
- Defeating boss advances stage
- Final boss victory ends run
- Map state saves/loads
```

##### Codex Prompt

```text
Implement Release 1.0 StageSystem and MapSystem. Add 6-stage progression, stage-specific monster pools, boss nodes, events, shops, rest sites, treasures, elites, loot tables, and persistent map state.
```

---

#### Phase 12 — Boss System 1.0

##### Goal

Make bosses feel unique and memorable.

##### Bosses

```text
Cupcake Slime King: sticky blocks
Prototype No. 7: junk + bombs + shake
Gelato Golem: ice/freeze
Sir Snore-a-Lot: sleep + shield
High Score Hydra: combo/cascade challenge
King Bloxley: symmetry + royal blocks
```

##### Features

```text
- Boss intro
- Boss phase threshold
- Boss unique behavior
- Boss intent text
- Boss reward
- Boss stage transition
- Final victory
```

##### Acceptance Criteria

```text
- All bosses spawn correctly
- Each boss has at least one unique mechanic
- Boss phase 2 exists or placeholder exists
- Boss reward is better than normal
- King Bloxley victory triggers final ending
```

##### Codex Prompt

```text
Implement BossSystem or boss behavior support in EnemySystem. Add unique behavior, phase thresholds, intros, better rewards, and stage transitions for all 6 Release 1.0 bosses. King Bloxley should trigger final victory.
```

---

#### Phase 13 — Reward, Relic, and Upgrade System 1.0

##### Goal

Make post-battle choices exciting and replayable.

##### Features

```text
- 3 reward choices
- Rarity weighting
- Stage-specific loot
- Reroll reward
- Relic effects
- Upgrade stacking
- Spell upgrades
- Weapon rewards if enabled
- Item rewards
- Gold/heal rewards
```

##### Acceptance Criteria

```text
- Reward screen appears after battle
- Rewards are valid from loot table
- Relics apply effects
- Upgrades apply effects
- Reroll works if player has reroll
- Duplicate/stack rules work
- Boss rewards feel better
```

##### Codex Prompt

```text
Upgrade RewardSystem, RelicSystem, and UpgradeSystem for Release 1.0. Use loot tables, rarity weighting, stage-specific rewards, rerolls, stacking rules, relic triggers, upgrade effects, item rewards, gold, heal, and boss reward logic.
```

---

#### Phase 14 — Events, Shops, Rest, and Treasure 1.0

##### Goal

Make non-combat rooms meaningful.

##### Events

```text
Suspicious Button
Lost Cake Cart
Goblin Quality Test
Rainbow Fountain
Sleepy Guard
Arcade Challenge
Block-O Manual Page
Friendship Slime
```

##### Features

```text
- Event choices
- Shop purchases
- Rest healing
- Treasure rewards
- Return to map
- Stage-themed event pools
```

##### Acceptance Criteria

```text
- All room types work
- Choices affect state
- Shop prices check gold
- Rest heals
- Treasure rewards
- Events are cheerful/funny
```

##### Codex Prompt

```text
Implement all non-combat room systems for Release 1.0: EventScene, ShopScene, RestScene, TreasureScene. Add the 8 cheerful room events, shop purchases, rest healing, treasure rewards, and return-to-map flow.
```

---

#### Phase 15 — Oopsies / Silly Drawbacks System

##### Goal

Add risk/reward without dark curse tone.

##### Oopsies

```text
oops_heavy_blocks
oops_slippery_buttons
oops_too_much_confetti
oops_snack_tax
oops_sticky_floor
oops_overexcited_machine
oops_square_only
oops_sugar_crash
```

##### Acceptance Criteria

```text
- Oopsies can be gained
- Oopsies affect gameplay
- Oopsies show in run UI
- Oopsies can be removed
- No oopsie soft-locks the player
```

##### Codex Prompt

```text
Implement OopsieSystem as the cheerful replacement for curses. Add oopsie effects, UI display, save/load support, shop removal, and event integration. Ensure no oopsie can soft-lock the run.
```

---

#### Phase 16 — Fever / Combo / Cascade Meta System

##### Goal

Give advanced players a satisfying mastery layer.

##### Features

```text
- Fever meter
- Fever gain from cascades
- Fever gain from combo
- Fever activation
- Fever reward multiplier
- Combo UI
- Cascade level UI
- Stage 5 arcade mechanics
```

##### Acceptance Criteria

```text
- Fever meter fills
- Fever can activate or auto-trigger
- Fever improves rewards/damage temporarily
- UI clearly shows fever state
- High Score Hydra uses fever/combo mechanic
```

##### Codex Prompt

```text
Implement FeverSystem tied to combo and Cascade Gravity. Add fever meter, fever activation, bonus effects, UI feedback, and special Stage 5/High Score Hydra interactions.
```

---

#### Phase 17 — Tutorial and Onboarding

##### Goal

Teach players without overwhelming them.

##### Tutorial Lessons

```text
1. Move piece
2. Rotate piece
3. Soft/hard drop
4. Clear line
5. Cascade Gravity
6. Mana and spells
7. Hold block
8. Inventory item
9. Enemy intent
10. Rewards
11. Map progression
```

##### Acceptance Criteria

```text
- New player can learn core loop
- Tutorial can be skipped
- Tutorial state saves
- Help screen exists
- Tutorial does not block returning players
```

##### Codex Prompt

```text
Implement TutorialSystem and first-run onboarding for Blockmancer Dungeon. Teach movement, rotation, line clear, Cascade Gravity, spells, hold, inventory, enemy intent, rewards, and map progression. Add skip and help menu.
```

---

#### Phase 18 — Save, Meta Progress, and Profiles

##### Goal

Make progression persistent and reliable.

##### Save Data

```text
Current run:
- Player state
- Hero
- Weapon
- Spells
- Relics
- Upgrades
- Items
- Oopsies
- Stage/map
- Board state if needed
- Current room
- Run stats

Meta:
- Unlocked heroes
- Total gold collected
- Total cascades
- Bosses defeated
- Endings unlocked
- Tutorial completed
- Settings
```

##### Acceptance Criteria

```text
- Refresh does not lose run
- Continue works
- Hero unlocks persist
- Corrupt save does not crash
- Save versioning exists
```

##### Codex Prompt

```text
Upgrade SaveSystem for Release 1.0. Support current run save, meta progression, hero unlocks, tutorial completion, settings, version migration, corrupt save fallback, and clear save/new run flows.
```

---

#### Phase 19 — Art Asset Pipeline Integration

##### Goal

Replace placeholder rectangles with asset-driven sprites without breaking fallback.

##### Features

```text
- Asset manifest
- Texture preload
- Missing texture fallback
- UI sprites
- Board block sprites
- Hero sprites
- Monster sprites
- Boss sprites
- Spell/item/relic/upgrade icons
- Stage backgrounds
```

##### Acceptance Criteria

```text
- Game works without missing asset crash
- Asset keys map to file paths
- Content iconKey/spriteKey loads sprites
- Placeholder fallback remains
- Build passes
```

##### Codex Prompt

```text
Integrate the Release 1.0 art asset pipeline. Add AssetSystem and asset manifest support for UI, board blocks, heroes, monsters, bosses, spells, items, relics, upgrades, stages, and VFX. Use spriteKey/iconKey from content JSON and keep safe fallback placeholders.
```

---

#### Phase 20 — UI Polish and Readability

##### Goal

Make the game feel like a real mobile game, not a prototype.

##### Features

```text
- Pixel UI theme
- Better HUD
- Clear HP/mana/fever bars
- Better damage numbers
- Better event log
- Better reward cards
- Better spell buttons
- Better item/inventory UI
- Better stage transitions
- Better boss intro
```

##### Acceptance Criteria

```text
- UI readable on phone
- Important information visible
- No clutter in portrait layout
- Touch targets are large enough
- Reward choices are understandable
- Inventory/next/hold are visible
```

##### Codex Prompt

```text
Polish the portrait mobile UI for Release 1.0. Improve HUD readability, pixel-art panels, HP/mana/fever bars, damage numbers, reward cards, spell buttons, inventory, next/hold overlays, boss intros, and stage transitions.
```

---

#### Phase 21 — Audio and Feedback

##### Goal

Add satisfying feedback for gameplay.

##### Required Audio Hooks

```text
- Line clear
- Cascade
- Spell cast
- Enemy hit
- Player hit
- Reward pick
- Button tap
- Boss intro
- Victory
- Defeat
- Shop purchase
- Item use
```

##### Acceptance Criteria

```text
- Audio can be muted
- Volume settings persist
- SFX trigger at right moments
- Missing audio does not crash
```

##### Codex Prompt

```text
Implement AudioSystem for Release 1.0 with SFX hooks for line clear, cascade, spell cast, hit, reward, UI tap, shop, victory, defeat, and boss intro. Add volume/mute settings and missing-audio fallback.
```

---

#### Phase 22 — Settings, Accessibility, and UX Options

##### Goal

Make the game comfortable on mobile.

##### Settings

```text
- Master volume
- SFX volume
- Music volume
- Vibration on/off
- Screen shake on/off
- Reduced flashing on/off
- Colorblind-friendly block symbols
- Text speed
- Left-handed controls
- Button size
- Show grid on/off
- Tutorial reset
```

##### Acceptance Criteria

```text
- Settings screen exists
- Settings persist
- Reduced flashing works
- Screen shake can be disabled
- Left-handed layout works
- Block symbols improve readability
```

##### Codex Prompt

```text
Add SettingsScene and accessibility options for Release 1.0: volume, mute, vibration, screen shake, reduced flashing, colorblind-friendly symbols, text speed, left-handed controls, button size, grid toggle, and tutorial reset.
```

---

#### Phase 23 — Story, Dialogue, and Endings

##### Goal

Deliver the cheerful narrative arc.

##### Story Beats

```text
- Opening: Block-O-Matic 3000 breaks festival
- Stage intros
- Boss intros
- Hero unlock dialogue
- King Bloxley intro
- Normal ending
- True ending
```

##### Acceptance Criteria

```text
- Story is cheerful
- Each stage has intro
- Each boss has intro
- Normal ending works
- True ending condition exists
- Dialogue can be skipped
```

##### Codex Prompt

```text
Implement cheerful story flow for Release 1.0: opening, stage intros, boss intros, hero unlock dialogue, King Bloxley intro, normal ending, true ending, skippable dialogue, and story screens.
```

---

#### Phase 24 — Balance Pass 1

##### Goal

Make a full run playable from start to finish.

##### Balance Areas

```text
- Fall speed curve
- Enemy HP
- Enemy attack
- Mana gain
- Spell costs
- Item power
- Relic strength
- Upgrade stacking
- Boss difficulty
- Stage length
- Reward frequency
```

##### Acceptance Criteria

```text
- Average player can clear Stage 1
- Skilled player can reach Stage 6
- Bosses are challenging but fair
- Cascade feels rewarding
- No one strategy dominates too much
- No required content is impossible to unlock
```

##### Codex Prompt

```text
Perform a data-driven balance pass for Release 1.0. Tune fall speed, enemy HP/attack, mana gain, spell costs, item values, relics, upgrades, boss difficulty, stage length, and rewards. Keep changes in content/config files where possible.
```

---

#### Phase 25 — QA Test Suite and Debug Tools

##### Goal

Make release testing efficient.

##### Features

```text
- Debug menu
- Give gold
- Give item
- Spawn monster
- Jump to stage
- Trigger boss
- Force reward
- Force cascade test
- Validate content
- Smoke test scenes
```

##### Acceptance Criteria

```text
- Debug mode only available in dev
- QA docs exist
- Basic smoke tests pass
- Content validation passes
```

##### Codex Prompt

```text
Add QA/debug tools for Release 1.0: dev-only debug menu, stage jump, spawn monster, trigger boss, give gold/item/relic/upgrade, force cascade test, and smoke test helpers. Update QA documentation.
```

---

#### Phase 26 — Performance Optimization

##### Goal

Ensure smooth mobile performance.

##### Targets

```text
- 60 FPS target where possible
- Stable on mid-range Android
- No excessive allocations during board update
- No texture reload during gameplay
- No memory leak across scenes
```

##### Acceptance Criteria

```text
- Board updates are smooth
- Cascades do not freeze
- Scene transitions are stable
- No major memory leak after multiple runs
```

##### Codex Prompt

```text
Optimize Blockmancer Dungeon for mobile performance. Focus on BoardSystem, Cascade Gravity, VFX pooling, UI object reuse, scene cleanup, texture loading, and memory usage. Do not change gameplay behavior unless required.
```

---

#### Phase 27 — Android / Capacitor Release Build

##### Goal

Prepare Android build for testing and release.

##### Features

```text
- Capacitor config
- Android project sync
- App icon
- Splash screen
- Portrait orientation
- Build debug APK
- Build release AAB
- Signing instructions
- Permissions audit
```

##### Acceptance Criteria

```text
- Debug APK builds
- App opens on Android
- Portrait orientation works
- Touch controls work
- Save/load works on device
- No broken asset paths
```

##### Codex Prompt

```text
Prepare Android build support for Release 1.0 using Capacitor. Ensure portrait orientation, asset paths, app icon/splash placeholders, Android sync, debug APK build instructions, and device testing checklist.
```

---

#### Phase 28 — Store / Release Metadata

##### Goal

Prepare publish-facing materials.

##### Required Materials

```text
- Game title
- Short description
- Long description
- Feature bullets
- Screenshots
- App icon
- Feature graphic
- Trailer plan
- Privacy policy draft
- Credits/licenses
- Content rating notes
- Support contact
```

##### Acceptance Criteria

```text
- Store copy is cheerful and accurate
- Screenshots match portrait gameplay
- No trademark-risk wording like "Tetris"
- Credits/licenses list exists
- Privacy policy notes exist
```

##### Codex Prompt

```text
Create store/release metadata for Blockmancer Dungeon Release 1.0. Include short description, long description, feature bullets, screenshot plan, trailer plan, app icon/feature graphic requirements, privacy policy notes, credits/licenses, and IP-safe wording that avoids using "Tetris" in marketing.
```

---

#### Phase 29 — Final Polish and Bug Fixing

##### Goal

Make the game feel release-ready.

##### Tasks

```text
- Fix top 50 bugs
- Polish transitions
- Polish boss fights
- Polish tutorial
- Polish reward pacing
- Polish mobile UI
- Polish save/load edge cases
- Polish audio feedback
- Polish VFX
- Polish balance
```

##### Acceptance Criteria

```text
- No known blocker bugs
- No known critical bugs
- Full run can be completed
- Android build works
- Web build works
- QA checklist passes
```

##### Codex Prompt

```text
Perform final Release 1.0 polish and bug fixing. Prioritize blocker/critical bugs, full-run stability, Android build, portrait mobile UI, boss fights, tutorial, save/load, audio/VFX feedback, and balance. Keep changes focused and safe.
```

---

#### Phase 30 — Release Candidate

##### Goal

Create the final Release 1.0 candidate.

##### Tasks

```text
- Version bump to 1.0.0
- Build web production
- Build Android release
- Run QA checklist
- Verify credits/licenses
- Verify store assets
- Verify save migration
- Tag release
```

##### Acceptance Criteria

```text
- Version is 1.0.0
- Web build passes
- Android build passes
- QA pass is documented
- Release notes exist
- Known issues list exists
```

##### Codex Prompt

```text
Prepare Blockmancer Dungeon Release Candidate 1.0.0. Update version, run full build/validation, generate release notes, verify credits/licenses, verify store assets, verify save migration, and create docs/RELEASE_1_0_NOTES.md with known issues and final checklist.
```

---

### Release 1.0 Feature Checklist

#### Core Gameplay

```text
[ ] Falling-block board
[ ] Cascade Gravity
[ ] Hold block
[ ] Next block queue
[ ] Inventory overlay
[ ] Mobile touch controls
[ ] Desktop controls
[ ] Combat panel
[ ] Enemy intents
[ ] Player HP/mana/shield
[ ] Fever meter
[ ] Combo/cascade UI
```

#### Content

```text
[ ] 6 stages
[ ] 6 bosses
[ ] 36 monsters
[ ] 6 heroes
[ ] 10 weapons
[ ] 15 spells
[ ] 15 relics
[ ] 15 upgrades
[ ] 15 board blocks
[ ] 10 items
[ ] 8 oopsies
[ ] 8 room events
[ ] 8 NPCs
[ ] Loot tables
```

#### Systems

```text
[ ] BoardSystem
[ ] Cascade Gravity
[ ] CombatSystem
[ ] EnemySystem
[ ] BossSystem
[ ] SpellSystem
[ ] InventorySystem
[ ] ItemSystem
[ ] RewardSystem
[ ] RelicSystem
[ ] UpgradeSystem
[ ] HeroSystem
[ ] WeaponSystem
[ ] MapSystem
[ ] StageSystem
[ ] EventSystem
[ ] ShopSystem
[ ] OopsieSystem
[ ] FeverSystem
[ ] SaveSystem
[ ] AudioSystem
[ ] AssetSystem
[ ] TutorialSystem
[ ] SettingsSystem
```

#### Mobile / Release

```text
[ ] Portrait-only layout
[ ] Android build
[ ] App icon
[ ] Splash screen
[ ] Store copy
[ ] Screenshots
[ ] Credits/licenses
[ ] Privacy policy notes
[ ] QA checklist
[ ] Release notes
```

---

### Recommended Milestone Grouping

#### Milestone A — Foundation

```text
Phase 0
Phase 1
Phase 2
```

#### Milestone B — Core Gameplay

```text
Phase 3
Phase 4
Phase 5
Phase 6
Phase 7
Phase 8
Phase 9
```

#### Milestone C — Run Structure

```text
Phase 10
Phase 11
Phase 12
Phase 13
Phase 14
Phase 15
Phase 16
```

#### Milestone D — Release Features

```text
Phase 17
Phase 18
Phase 19
Phase 20
Phase 21
Phase 22
Phase 23
```

#### Milestone E — Release Polish

```text
Phase 24
Phase 25
Phase 26
Phase 27
Phase 28
Phase 29
Phase 30
```

---

### Recommended Implementation Order

```text
1. Audit current MVP
2. Stabilize architecture
3. Convert content
4. Implement Cascade Gravity
5. Implement portrait mobile UI
6. Implement combat/spells/items
7. Implement stages/bosses/map
8. Implement hero unlocks/meta
9. Implement rewards/events/shops
10. Implement tutorial/save/settings
11. Add assets/audio/polish
12. QA/balance/release
```


---

## Release 1.0 Agent Prompt Pack

**Source file:** `blockmancer_release_1_agent_phase_prompts.md`

**Consolidation note:** Prompt library for Codex/Cursor/Windsurf; use with the current SOT index first.

### Blockmancer Dungeon — Release 1.0 Agent Prompt Pack

Use this file together with `AGENT.md` and `blockmancer_vibe_code_release_1_plan.md`.

This document gives you **copy-paste prompts** for each milestone and phase. Each prompt includes:

```text
- Clear task instruction
- What the agent should inspect first
- What to look for
- Expected output
- Acceptance checks
- Commands to run
- Response format
```

---

#### How to Use This Prompt Pack

Recommended workflow:

```text
1. Put AGENT.md in the project root.
2. Put blockmancer_vibe_code_release_1_plan.md in docs/ or project root.
3. Open your coding agent tool: Cursor, Windsurf, Codex, Claude Code, etc.
4. Start with Milestone A or Phase 0.
5. Paste only one phase prompt at a time.
6. Let the agent inspect files first.
7. Let it make the smallest safe change.
8. Run build/validation.
9. Commit.
10. Move to the next phase.
```

Do **not** ask the agent to implement all 30 phases in one pass. That will usually cause messy rewrites.

---

#### Universal Rules for Every Prompt

Add this block to the top of every coding prompt:

```text
Read AGENT.md first and follow it as the main project instruction.
Also read blockmancer_vibe_code_release_1_plan.md if it exists.

Project goal:
Turn Blockmancer Dungeon into a cheerful portrait-mobile falling-block roguelike RPG for Release 1.0.

Core rules:
- Keep the game playable after changes.
- Keep cheerful festival / cute chaos tone.
- Do not add dark/edgy curse lore.
- Do not replace Cascade Gravity with classic row shifting.
- Do not rewrite unrelated working systems.
- Keep content data-driven.
- Preserve placeholder-safe asset fallbacks.
- Keep portrait mobile as the primary layout target.
- Run build/validation if possible.

After completing the task, respond with:
Summary:
- ...

Files changed:
- ...

How to test:
- ...

Commands run:
- ...

Known limitations:
- ...
```

---

### Milestone Prompts

---

#### Milestone A — Foundation

Includes:

```text
Phase 0 — Release Audit
Phase 1 — Architecture Stabilization
Phase 2 — Content Data 1.0 Conversion
```

##### Milestone Goal

Prepare the repo for safe Release 1.0 development. The agent should understand the current MVP, stabilize architecture, and convert/prepare content data for the cheerful festival direction.

##### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone A — Foundation.

Scope:
- Phase 0: Release Audit
- Phase 1: Architecture Stabilization
- Phase 2: Content Data 1.0 Conversion

Important:
Do this milestone carefully and incrementally. Do not rewrite the whole game. If the repo is not ready for full implementation, create the audit and foundation docs first, then make only safe changes.

What to inspect first:
- package.json
- README.md
- docs/
- src/game/
- src/game/scenes/
- src/game/systems/
- src/game/content/
- src/game/types/
- public/assets/

What to look for:
- Current build status
- Missing scripts
- Existing scene flow
- Existing board/combat systems
- Whether ContentRegistry exists
- Whether content is JSON/data-driven
- Whether asset manifest exists
- Broken imports or duplicate systems
- Missing save/load support
- Any dark content that conflicts with cheerful festival tone

Expected output:
- docs/RELEASE_1_GAP_AUDIT.md
- Stabilized types/systems where safe
- Content folders prepared or updated
- Validation scripts verified or documented if missing
- No major gameplay rewrite

Acceptance criteria:
- Game still builds, or failures are documented clearly
- Existing MVP remains playable if it was playable before
- Missing Release 1.0 features are listed
- Content direction is aligned with cheerful festival concept
- Safe fallback exists or is planned for missing content/assets

Commands to run:
- npm install, if needed
- npm run build
- npm run validate:content, if available
- npm run validate:metadata, if available

Finish by summarizing files changed, commands run, build status, and next recommended phase.
```

---

#### Milestone B — Core Gameplay

Includes:

```text
Phase 3 — Cascade Gravity 1.0
Phase 4 — Special Board Blocks
Phase 5 — Portrait Mobile Layout 1.0
Phase 6 — Input System 1.0
Phase 7 — Combat System 1.0
Phase 8 — Spell System 1.0
Phase 9 — Inventory and Item System 1.0
```

##### Milestone Goal

Make the game’s core combat-puzzle loop feel complete and mobile-playable.

##### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone B — Core Gameplay.

Scope:
- Cascade Gravity
- Special board blocks
- Portrait mobile layout
- Desktop/mobile input
- Combat loop
- Spell system
- Inventory and items

Important:
Break this milestone into small commits if possible. Start with Cascade Gravity and board behavior before UI polish. Keep the game playable after every step.

What to inspect first:
- BoardSystem
- CombatSystem
- EnemySystem
- SpellSystem
- InventorySystem / ItemSystem if present
- BattleScene
- Input handling
- UI components
- Content data for board-blocks, spells, items, enemies

What to look for:
- Classic row-shift line clear that must be replaced
- Missing CascadeResult type
- Whether CombatSystem can consume line clear/cascade results
- Whether board cells support block types
- Whether mobile controls exist
- Whether next/hold/inventory overlays exist
- Whether spells/items are hardcoded or data-driven

Expected output:
- Cascade Gravity implemented
- Special block hooks implemented
- Portrait battle layout improved
- Mobile controls functional
- Combat loop connected to board results
- Spells and items functional enough for Release 1.0

Acceptance criteria:
- Clearing lines triggers Cascade Gravity
- Cascades can create new line clears
- Combat uses cascade damage/mana rewards
- Board supports special block types safely
- Mobile touch controls work
- Spell buttons work
- Inventory can be opened and items can be used
- Build passes

Commands to run:
- npm run build
- npm run validate:content, if content changed

Finish with manual test steps for a battle from start to reward screen.
```

---

#### Milestone C — Run Structure

Includes:

```text
Phase 10 — Hero, Weapon, and Unlock System
Phase 11 — Roguelike Map and Stage System
Phase 12 — Boss System 1.0
Phase 13 — Reward, Relic, and Upgrade System 1.0
Phase 14 — Events, Shops, Rest, and Treasure 1.0
Phase 15 — Oopsies / Silly Drawbacks System
Phase 16 — Fever / Combo / Cascade Meta System
```

##### Milestone Goal

Turn the battle MVP into a full roguelike run with stages, bosses, unlocks, rewards, events, shops, oopsies, and mastery systems.

##### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone C — Run Structure.

Scope:
- Hero select and unlocks
- Weapons and starting loadouts
- 6-stage roguelike map progression
- Boss encounters
- Rewards, relics, upgrades
- Events, shops, rest, treasure
- Oopsies / silly drawbacks
- Fever/combo/cascade mastery layer

What to inspect first:
- HeroSelectScene
- MapScene
- RewardScene
- EventScene
- ShopScene
- RestScene
- TreasureScene
- VictoryScene
- SaveSystem
- HeroSystem
- StageSystem
- MapSystem
- RewardSystem
- RelicSystem
- UpgradeSystem
- Loot tables

What to look for:
- Missing scene transitions
- Missing stage progression
- Missing boss node logic
- Missing unlock persistence
- Hardcoded rewards
- Missing relic/upgrade trigger hooks
- Missing shop/event choice resolution
- Missing oopsie effects
- Missing fever/combo UI

Expected output:
- Player can start run with selected hero
- Player can move across a map
- Player can fight through stages
- Bosses appear at stage ends
- Rewards apply after battle
- Non-combat rooms work
- Oopsies and fever systems exist
- Progress can be saved where relevant

Acceptance criteria:
- A run can progress from Stage 1 to at least Stage 2
- Boss defeat advances stage
- Rewards are generated from loot tables
- Hero unlock conditions can be tracked
- Oopsies can be gained/removed
- Fever meter interacts with cascades
- Build passes

Commands to run:
- npm run build
- npm run validate:content

Finish with a full run-path test checklist.
```

---

#### Milestone D — Release Features

Includes:

```text
Phase 17 — Tutorial and Onboarding
Phase 18 — Save, Meta Progress, and Profiles
Phase 19 — Art Asset Pipeline Integration
Phase 20 — UI Polish and Readability
Phase 21 — Audio and Feedback
Phase 22 — Settings, Accessibility, and UX Options
Phase 23 — Story, Dialogue, and Endings
```

##### Milestone Goal

Make the game understandable, persistent, polished, accessible, and player-facing.

##### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone D — Release Features.

Scope:
- Tutorial and onboarding
- Save and meta progress
- Asset pipeline
- UI polish
- Audio feedback
- Settings/accessibility
- Story/dialogue/endings

What to inspect first:
- MainMenuScene
- TutorialScene
- SettingsScene
- SaveSystem
- AssetSystem or asset manifest
- BootScene
- AudioSystem
- UI components
- Dialogue/story data
- Victory/GameOver flow

What to look for:
- First-run player confusion points
- Missing save versioning
- Corrupt save crash risks
- Hardcoded asset paths
- Missing fallback textures/audio
- UI readability problems on phone
- Missing settings persistence
- Missing story/endings

Expected output:
- First-run tutorial flow
- Continue run / meta progress support
- Asset manifest and safe fallbacks
- Improved UI readability
- Audio hooks with mute/volume settings
- Accessibility options
- Cheerful story flow and endings

Acceptance criteria:
- Tutorial can be completed or skipped
- Refresh/continue works
- Missing assets/audio do not crash
- Settings persist
- Screen shake/reduced flashing options work
- Normal ending exists
- Build passes

Commands to run:
- npm run build
- npm run validate:content, if content changed

Finish with new-player test steps and save/load test steps.
```

---

#### Milestone E — Release Polish

Includes:

```text
Phase 24 — Balance Pass 1
Phase 25 — QA Test Suite and Debug Tools
Phase 26 — Performance Optimization
Phase 27 — Android / Capacitor Release Build
Phase 28 — Store / Release Metadata
Phase 29 — Final Polish and Bug Fixing
Phase 30 — Release Candidate
```

##### Milestone Goal

Prepare the game for Release Candidate 1.0.

##### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone E — Release Polish.

Scope:
- Balance pass
- QA/debug tools
- Mobile performance
- Android/Capacitor release build
- Store/release metadata
- Final polish/bug fixing
- Release candidate checklist

What to inspect first:
- Balance/content data
- Difficulty scaling
- Debug/dev tools
- Performance-heavy board/VFX/UI code
- package.json scripts
- capacitor.config.ts
- Android project if present
- docs/QA_TEST_PLAN.md
- docs/BUILD_APK.md
- docs/RELEASE_1_0_NOTES.md

What to look for:
- Unfair difficulty spikes
- Memory leaks or excessive allocations
- Missing debug tools for QA
- Missing Android scripts/config
- Broken asset paths in production build
- Missing release docs
- Missing credits/licenses/privacy notes
- Known blocker bugs

Expected output:
- Tuned balance data
- QA checklist/debug tools
- Performance improvements
- Android build support documented
- Store metadata docs
- Release notes
- Known issues list

Acceptance criteria:
- Web build passes
- Android debug build path is documented or builds successfully
- QA checklist exists
- No known blocker bugs remain undocumented
- Release notes exist
- Version can be bumped to 1.0.0 when ready

Commands to run:
- npm run build
- npm run validate:content
- npm run android:sync, if configured
- npm run android:build:debug, if configured

Finish with Release Candidate readiness status.
```

---

### Individual Phase Prompts

---

#### Phase 0 — Release Audit

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Audit the current Blockmancer Dungeon repo for Release 1.0 readiness. Do not rewrite systems yet unless a tiny build fix is required.

Inspect first:
- package.json
- README.md
- docs/
- src/game/
- src/game/scenes/
- src/game/systems/
- src/game/content/
- public/assets/

What to look for:
- Current build status
- Existing MVP features
- Missing Release 1.0 features
- Broken or placeholder systems
- Missing content/data folders
- Missing validation scripts
- Missing asset pipeline
- Mobile portrait layout issues
- Save/load status

Expected output:
- Create or update docs/RELEASE_1_GAP_AUDIT.md
- Include implemented features, missing features, broken/risky areas, recommended next phases, and commands run

Acceptance criteria:
- Current build status is known
- Existing MVP features are listed
- Missing Release 1.0 features are listed
- Release checklist exists
- No gameplay changes unless required to fix build

Commands:
- npm install, if needed
- npm run build
- npm run validate:content, if available
- npm run validate:metadata, if available

Response format:
Summary / Files changed / Commands run / How to test / Known limitations / Recommended next phase
```

---

#### Phase 1 — Architecture Stabilization

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Stabilize the project architecture for Release 1.0 without changing core gameplay behavior unless needed for build stability.

Inspect first:
- src/game/types/
- src/game/systems/
- src/game/scenes/
- src/game/data/
- src/game/content/
- BootScene.ts
- BattleScene.ts

What to look for:
- Giant scene files with mixed logic
- Missing types for game state/content
- Missing ContentRegistry
- Missing AssetSystem or asset manifest
- Duplicate logic across scenes
- Hardcoded content access
- Missing fallbacks for missing assets/content
- Circular imports

Expected output:
- Typed game state and content access patterns
- Centralized constants where needed
- ContentRegistry access pattern established
- Asset manifest/fallback pattern established
- Safe error handling for missing content/assets

Acceptance criteria:
- npm run build passes
- No circular imports
- Main game state is typed
- Content can be loaded by ID
- Missing content has safe fallback
- Missing texture has safe fallback

Commands:
- npm run build

Response format:
Summary / Files changed / Architecture decisions / Commands run / How to test / Known limitations
```

---

#### Phase 2 — Content Data 1.0 Conversion

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Convert or create Release 1.0 content data for the cheerful festival concept.

Inspect first:
- src/game/content/
- src/game/systems/ContentRegistry.ts
- scripts/validate-content-data.mjs
- docs/content docs if present

What to look for:
- Old dark/edgy content to rename or remove
- Missing data folders
- Missing metadata files
- Invalid ID prefixes
- Hardcoded content in code
- Content not loaded by ContentRegistry

Expected output:
Create/update content for:
- 6 stages
- 6 bosses
- 36 monsters
- 6 heroes
- 10 weapons
- 15 spells
- 15 relics
- 15 upgrades
- 15 board blocks
- 10 items
- 8 oopsies
- 8 room events
- NPCs
- currencies
- collectibles
- loot tables
- difficulty scaling

Acceptance criteria:
- All Release 1.0 content entries exist
- All content uses cheerful tone
- Old dark references are removed or renamed
- JSON is valid
- IDs match naming convention
- ContentRegistry loads all content
- validate:content passes

Commands:
- npm run validate:content
- npm run validate:metadata, if available
- npm run build

Response format:
Summary / Content added / Files changed / Commands run / How to test / Known limitations
```

---

#### Phase 3 — Cascade Gravity 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement Cascade Gravity as the core BoardSystem mechanic.

Inspect first:
- BoardSystem
- CombatSystem
- GameTypes / board types
- BattleScene line-clear integration
- EventLog/HUD if present

What to look for:
- Classic row-shift clearing
- Missing line clear result type
- Missing combat integration
- Missing event log messages
- Board mutation bugs
- Places where line count is used directly

Expected output:
- detectCompletedLines()
- removeCompletedLines()
- applyCascadeGravity()
- resolveCascadeClears()
- CascadeResult type
- Combat reward integration
- Event log messages

Acceptance criteria:
- Clearing a line removes only cleared cells first
- Blocks above fall down by column
- New lines can form after falling
- Cascades resolve automatically
- Combat receives CascadeResult
- Event log shows cascade messages
- Build passes

Commands:
- npm run build

Manual test:
Create or simulate a board where a line clear causes blocks above to fall into a new completed line.

Response format:
Summary / Files changed / Cascade behavior / Commands run / How to test / Known limitations
```

---

#### Phase 4 — Special Board Blocks

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Add special board block support using content data and integrate effects with Cascade Gravity.

Inspect first:
- BoardSystem
- board block content data
- CombatSystem
- ItemSystem/InventorySystem if present
- type definitions for board cells

What to look for:
- Board cells storing only color instead of block type
- No hooks for on-clear effects
- No safe fallback for unknown block type
- Bomb effects that could recurse infinitely

Expected output:
Implement support for:
- block_sprinkle
- block_cupcake
- block_bomb
- block_star
- block_jelly
- block_ice
- block_sticky
- block_crumb_junk
- block_royal
- block_confetti
- block_toolbox

Acceptance criteria:
- Board supports block type data
- Special block effects trigger on clear
- Bomb can trigger additional cascade resolve safely
- Junk blocks can appear from enemy attacks
- Boss blocks can appear
- Unknown block types use safe fallback

Commands:
- npm run build
- npm run validate:content, if content changed

Response format:
Summary / Files changed / Block effects implemented / Commands run / How to test / Known limitations
```

---

#### Phase 5 — Portrait Mobile Layout 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Refactor BattleScene into the final portrait-only mobile layout.

Inspect first:
- BattleScene
- UI components
- MobileControls
- Phaser scale config
- CSS/style files
- current board rendering dimensions

What to look for:
- Landscape assumptions
- Fixed desktop-only dimensions
- Board too small on phone
- Controls too small for touch
- Next/hold/inventory hidden or missing
- UI overlap with safe areas/notches

Expected layout:
- Top 1/5: compact battle panel
- Middle 3/5: falling-block board + next/hold/inventory overlays
- Bottom 1/5: mobile controls + spell buttons

Acceptance criteria:
- Game is portrait-only
- Top combat uses about 1/5 height
- Board uses about 3/5 height
- Controls use about 1/5 height
- Next block is visible
- Hold block is visible
- Inventory is visible/expandable
- Touch controls are playable
- Desktop browser preview still works

Commands:
- npm run build

Response format:
Summary / Files changed / Layout decisions / Commands run / How to test / Known limitations
```

---

#### Phase 6 — Input System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement polished desktop and mobile input handling.

Inspect first:
- InputSystem
- BattleScene input code
- MobileControls
- BoardSystem movement methods
- Settings controls if present

What to look for:
- Input duplicated in scenes
- No touch repeat for left/right
- Soft drop not holdable
- Hard drop repeat bugs
- Hold not limited once per piece
- Spell buttons disconnected
- Inventory button missing

Expected output:
- Desktop controls: arrows/WASD, Space, Shift/C, 1-4, I, Esc
- Mobile controls: left/right/rotate/soft drop/hard drop/hold/spells/inventory
- Input repeat/cooldowns handled safely

Acceptance criteria:
- Mobile buttons feel responsive
- Holding left/right repeats movement
- Soft drop can be held
- Hard drop is single tap
- Rotate is single tap
- Hold works once per piece
- Spell buttons work
- Inventory button works

Commands:
- npm run build

Response format:
Summary / Files changed / Controls implemented / Commands run / How to test / Known limitations
```

---

#### Phase 7 — Combat System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Upgrade CombatSystem and EnemySystem into a complete Release 1.0 battle loop.

Inspect first:
- CombatSystem
- EnemySystem
- BoardSystem cascade result integration
- SpellSystem
- RelicSystem / UpgradeSystem
- BattleScene victory/defeat flow
- enemy content data

What to look for:
- Line clears not dealing damage
- Cascades not affecting combat
- Enemy attacks not telegraphed
- Missing status effect hooks
- Missing player HP/shield handling
- Missing victory/defeat transition
- Missing safe placeholders for enemy behaviors

Expected output:
- Line clear damage
- Cascade bonus damage/mana
- Combo tracking
- Fever gain hook
- Enemy intent/attack counter
- Player HP/shield
- Enemy HP/armor
- Status effect hooks
- Victory/defeat flow

Acceptance criteria:
- Every enemy behavior has implementation or safe placeholder
- Boss behaviors can be unique later
- Cascades matter in combat
- Combat logs are readable
- Player can win/lose battle
- Battle reward flow works

Commands:
- npm run build
- npm run validate:content, if enemy data changed

Response format:
Summary / Files changed / Combat behavior / Commands run / How to test / Known limitations
```

---

#### Phase 8 — Spell System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement all 15 Release 1.0 spells as data-driven spell effects.

Inspect first:
- SpellSystem
- spell content data
- CombatSystem
- BoardSystem
- BattleScene spell buttons
- mana UI/HUD

What to look for:
- Hardcoded spells
- Missing mana cost checks
- Missing disabled state
- Missing spell effect routing
- Board-targeting spells not safe
- No feedback when not enough mana

Expected output:
Functional spells:
- spl_fireball
- spl_frost_lock
- spl_bomb_rune
- spl_clean_cut
- spl_sprinkle_shower
- spl_cupcake_blast
- spl_confetti_pop
- spl_bubble_shield
- spl_star_spark
- spl_jelly_bounce
- spl_snowcone_burst
- spl_goblin_gadget
- spl_rainbow_reroll
- spl_snack_break
- spl_cascade_cheer

Acceptance criteria:
- All spells can be cast if available
- Mana costs apply
- Effects work
- UI updates
- Spell upgrades can modify effects where supported
- Build passes

Commands:
- npm run build
- npm run validate:content, if spell data changed

Response format:
Summary / Files changed / Spells implemented / Commands run / How to test / Known limitations
```

---

#### Phase 9 — Inventory and Item System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement InventorySystem and ItemSystem for battle and event usage.

Inspect first:
- InventorySystem / ItemSystem
- BattleScene inventory UI
- item content data
- RewardSystem
- ShopSystem if present
- SaveSystem

What to look for:
- No inventory capacity
- Items not stackable
- Item use hardcoded or missing
- No compact/expanded overlay
- Item counts not saved
- Items not integrated with rewards/shop

Expected output:
- Inventory slots/capacity
- Stackable consumables
- Item use effects
- Compact/expanded inventory overlay
- Item reward/pickup support
- Shop purchase hooks
- Save/load item state

Acceptance criteria:
- Inventory visible in middle board area
- Inventory can expand/collapse
- Items can be used
- Item counts update
- Items can be rewarded/bought
- Inventory capacity upgrades work

Commands:
- npm run build
- npm run validate:content, if item data changed

Response format:
Summary / Files changed / Item behavior / Commands run / How to test / Known limitations
```

---

#### Phase 10 — Hero, Weapon, and Unlock System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement playable heroes, weapons, starting loadouts, passives, and unlock conditions.

Inspect first:
- HeroSelectScene
- HeroSystem
- WeaponSystem
- SaveSystem
- hero/weapon content data
- MainMenuScene new run flow

What to look for:
- No locked/unlocked state
- Missing meta progress
- Hero stats not applied
- Starting spells/weapons hardcoded
- Hero passives not hooked
- Unlock conditions not tracked

Expected output:
- Hero select scene with locked/unlocked UI
- 6 playable heroes
- Hero stats and passives
- Starting weapons/spells
- Unlock condition tracking
- Persistent meta progress

Acceptance criteria:
- Hero select shows all heroes
- Locked heroes show unlock condition
- Unlocked heroes persist
- Hero stats affect run
- Hero starting loadout works
- Hero passive works

Commands:
- npm run build
- npm run validate:content, if content changed

Response format:
Summary / Files changed / Hero unlock behavior / Commands run / How to test / Known limitations
```

---

#### Phase 11 — Roguelike Map and Stage System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement the 6-stage roguelike map and stage progression system.

Inspect first:
- MapScene
- MapSystem
- StageSystem
- stage content data
- monster pools
- boss content data
- SaveSystem
- Loot tables

What to look for:
- Map nodes hardcoded or missing
- No stage progression
- No stage-specific monster pool
- Boss not linked to stage
- Map state not saved
- Missing node completion/current state

Expected output:
- Fight/Event/Shop/Rest/Treasure/Elite/Boss nodes
- Stage-specific monster pools
- Boss node per stage
- Stage advancement after boss
- Persistent map state

Acceptance criteria:
- Player progresses through 6 stages
- Each stage has unique monster pool
- Boss appears at end of each stage
- Defeating boss advances stage
- Final boss victory ends run
- Map state saves/loads

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Map progression behavior / Commands run / How to test / Known limitations
```

---

#### Phase 12 — Boss System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement boss behavior support, boss phases, boss intros, rewards, and final victory trigger.

Inspect first:
- EnemySystem
- BossSystem if present
- CombatSystem
- StageSystem
- boss content data
- BattleScene boss UI
- VictoryScene

What to look for:
- Bosses treated exactly like normal monsters
- No phase threshold support
- No boss intro
- No unique boss mechanics
- No final boss victory route
- Boss rewards same as normal battle

Expected output:
Bosses:
- Cupcake Slime King
- Prototype No. 7
- Gelato Golem
- Sir Snore-a-Lot
- High Score Hydra
- King Bloxley

Acceptance criteria:
- All bosses spawn correctly
- Each boss has at least one unique mechanic
- Boss phase 2 exists or placeholder exists
- Boss reward is better than normal
- King Bloxley victory triggers final ending

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Boss mechanics / Commands run / How to test / Known limitations
```

---

#### Phase 13 — Reward, Relic, and Upgrade System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Upgrade rewards, relics, upgrades, rarity weighting, rerolls, and loot table logic.

Inspect first:
- RewardSystem
- RelicSystem
- UpgradeSystem
- RewardScene
- loot table content
- relic/upgrade content
- SaveSystem

What to look for:
- Rewards hardcoded
- No rarity weighting
- No stage-specific loot
- Relics not applying effects
- Upgrades not stacking correctly
- No reroll logic
- Boss rewards not special

Expected output:
- 3 reward choices
- Rarity weighting
- Stage-specific loot
- Reroll support
- Relic effects
- Upgrade stacking rules
- Spell upgrade hooks
- Item/gold/heal rewards

Acceptance criteria:
- Reward screen appears after battle
- Rewards are valid from loot table
- Relics apply effects
- Upgrades apply effects
- Reroll works if player has reroll
- Duplicate/stack rules work
- Boss rewards feel better

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Reward logic / Commands run / How to test / Known limitations
```

---

#### Phase 14 — Events, Shops, Rest, and Treasure 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement all non-combat room systems and return-to-map flow.

Inspect first:
- EventScene
- ShopScene
- RestScene
- TreasureScene
- EventSystem
- ShopSystem
- room event content
- item/relic/upgrade content
- MapScene transitions

What to look for:
- Missing non-combat scenes
- Events with no real choices
- Shop not checking gold
- No rest healing
- Treasure rewards hardcoded
- No stage-themed event pools
- Missing return-to-map flow

Expected output:
- 8 cheerful room events
- Shop purchases
- Rest healing/benefits
- Treasure rewards
- Choice resolution
- Return to map

Acceptance criteria:
- All room types work
- Choices affect state
- Shop prices check gold
- Rest heals
- Treasure rewards
- Events are cheerful/funny

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Room behavior / Commands run / How to test / Known limitations
```

---

#### Phase 15 — Oopsies / Silly Drawbacks System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement OopsieSystem as the cheerful replacement for curses.

Inspect first:
- oopsie content data
- OopsieSystem if present
- CombatSystem
- BoardSystem
- ShopSystem
- EventSystem
- SaveSystem
- run HUD

What to look for:
- Player-facing use of “curse”
- No oopsie UI
- Oopsie effects not applied
- Oopsies not removable
- Oopsie save/load missing
- Soft-lock risk

Expected output:
- Oopsie data support
- Effects applied to gameplay
- UI display
- Shop/event removal
- Save/load support

Acceptance criteria:
- Oopsies can be gained
- Oopsies affect gameplay
- Oopsies show in run UI
- Oopsies can be removed
- No oopsie soft-locks the player

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Oopsie effects / Commands run / How to test / Known limitations
```

---

#### Phase 16 — Fever / Combo / Cascade Meta System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement FeverSystem tied to combos and Cascade Gravity.

Inspect first:
- CombatSystem
- BoardSystem CascadeResult integration
- FeverSystem if present
- BattleScene/HUD
- High Score Hydra boss behavior
- stage 5 content

What to look for:
- Combo not tracked
- Fever meter missing
- Cascades not rewarding mastery
- UI not showing cascade level
- Stage 5 mechanics missing
- Fever state not saved if needed

Expected output:
- Fever meter
- Fever gain from cascades/combo
- Fever activation or auto-trigger
- Bonus effects
- Cascade/combo UI
- High Score Hydra interactions

Acceptance criteria:
- Fever meter fills
- Fever can activate or auto-trigger
- Fever improves rewards/damage temporarily
- UI clearly shows fever state
- High Score Hydra uses fever/combo mechanic

Commands:
- npm run build

Response format:
Summary / Files changed / Fever mechanics / Commands run / How to test / Known limitations
```

---

#### Phase 17 — Tutorial and Onboarding

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement first-run tutorial and help/onboarding flow.

Inspect first:
- TutorialScene
- MainMenuScene
- BattleScene
- InputSystem
- SaveSystem
- Settings/help UI

What to look for:
- No first-run detection
- Tutorial blocks returning players
- No skip option
- No control highlights
- No Cascade Gravity explanation
- No help screen

Expected output:
Tutorial lessons:
1. Move piece
2. Rotate piece
3. Soft/hard drop
4. Clear line
5. Cascade Gravity
6. Mana and spells
7. Hold block
8. Inventory item
9. Enemy intent
10. Rewards
11. Map progression

Acceptance criteria:
- New player can learn core loop
- Tutorial can be skipped
- Tutorial state saves
- Help screen exists
- Tutorial does not block returning players

Commands:
- npm run build

Response format:
Summary / Files changed / Tutorial flow / Commands run / How to test / Known limitations
```

---

#### Phase 18 — Save, Meta Progress, and Profiles

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Upgrade SaveSystem for current run, meta progress, settings, migration, and corrupt-save fallback.

Inspect first:
- SaveSystem
- defaultRunState
- GameTypes
- Hero unlock logic
- SettingsSystem
- MainMenuScene continue/new run flow

What to look for:
- Save schema missing version
- Current run not saved
- Meta progress missing
- Hero unlocks not persistent
- Corrupt save crash risk
- No clear save/new run flow
- No migration pattern

Expected output:
Current run save:
- Player state
- Hero/weapon/spells
- Relics/upgrades/items/oopsies
- Stage/map/current room
- Run stats

Meta save:
- Unlocked heroes
- Total gold/cascades
- Bosses defeated
- Endings unlocked
- Tutorial completed
- Settings

Acceptance criteria:
- Refresh does not lose run
- Continue works
- Hero unlocks persist
- Corrupt save does not crash
- Save versioning exists

Commands:
- npm run build

Response format:
Summary / Files changed / Save schema / Migration notes / Commands run / How to test / Known limitations
```

---

#### Phase 19 — Art Asset Pipeline Integration

```text
Read AGENT.md first and follow it as the main project instruction.
Also read blockmancer_sprite_asset_spec.md if available.

Task:
Integrate the Release 1.0 art asset pipeline with manifest-based loading and safe fallbacks.

Inspect first:
- public/assets/
- src/game/data/assets.ts
- AssetSystem
- BootScene
- UI components
- Content JSON spriteKey/iconKey fields

What to look for:
- Hardcoded asset paths inside scenes
- Missing fallback textures
- Missing asset manifest
- Content data not using asset keys
- Missing preload in BootScene
- Crashes on missing images

Expected output:
- Asset manifest
- Texture preload
- Missing texture fallback
- UI sprite support
- Board block sprite support
- Hero/monster/boss sprite support
- Spell/item/relic/upgrade icon support
- Stage background support

Acceptance criteria:
- Game works without missing asset crash
- Asset keys map to file paths
- Content iconKey/spriteKey loads sprites
- Placeholder fallback remains
- Build passes

Commands:
- npm run build
- npm run validate:content, if content changed

Response format:
Summary / Files changed / Asset manifest changes / Commands run / How to test / Known limitations
```

---

#### Phase 20 — UI Polish and Readability

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Polish portrait mobile UI readability and presentation.

Inspect first:
- BattleScene
- UI components
- RewardScene
- MapScene
- ShopScene
- InventoryPanel
- MobileControls
- HUD/EventLog

What to look for:
- Tiny text on phone
- Cluttered board area
- Unclear HP/mana/fever bars
- Weak damage feedback
- Poor reward card readability
- Spell/item buttons missing disabled state
- Next/hold/inventory not visible enough

Expected output:
- Better HUD
- Clear HP/mana/fever bars
- Better damage numbers
- Better event log
- Better reward cards
- Better spell buttons
- Better item/inventory UI
- Better stage transitions and boss intro

Acceptance criteria:
- UI readable on phone
- Important information visible
- No clutter in portrait layout
- Touch targets are large enough
- Reward choices are understandable
- Inventory/next/hold are visible

Commands:
- npm run build

Response format:
Summary / Files changed / UI changes / Commands run / How to test / Known limitations
```

---

#### Phase 21 — Audio and Feedback

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement AudioSystem and key gameplay feedback hooks.

Inspect first:
- AudioSystem if present
- BootScene asset loading
- BattleScene
- RewardScene
- ShopScene
- SettingsSystem
- public/assets/audio if present

What to look for:
- No mute/volume settings
- SFX calls scattered or missing
- Missing audio fallback
- Missing hooks for line clear/cascade/spells
- Audio crashing if file missing

Expected output:
Audio hooks for:
- Line clear
- Cascade
- Spell cast
- Enemy hit
- Player hit
- Reward pick
- Button tap
- Boss intro
- Victory
- Defeat
- Shop purchase
- Item use

Acceptance criteria:
- Audio can be muted
- Volume settings persist
- SFX trigger at right moments
- Missing audio does not crash

Commands:
- npm run build

Response format:
Summary / Files changed / Audio hooks / Commands run / How to test / Known limitations
```

---

#### Phase 22 — Settings, Accessibility, and UX Options

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Add SettingsScene and accessibility/UX options.

Inspect first:
- SettingsScene
- SettingsSystem if present
- SaveSystem
- BattleScene
- InputSystem
- AudioSystem
- UI rendering for blocks/VFX

What to look for:
- Settings not persisted
- No mute/volume controls
- No reduced flashing
- No screen shake toggle
- No left-handed controls
- No block symbol accessibility
- No button size option

Expected output settings:
- Master volume
- SFX volume
- Music volume
- Vibration on/off
- Screen shake on/off
- Reduced flashing on/off
- Colorblind-friendly block symbols
- Text speed
- Left-handed controls
- Button size
- Show grid on/off
- Tutorial reset

Acceptance criteria:
- Settings screen exists
- Settings persist
- Reduced flashing works
- Screen shake can be disabled
- Left-handed layout works
- Block symbols improve readability

Commands:
- npm run build

Response format:
Summary / Files changed / Settings added / Commands run / How to test / Known limitations
```

---

#### Phase 23 — Story, Dialogue, and Endings

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement cheerful story flow, dialogue, stage/boss intros, and endings.

Inspect first:
- Story/dialogue data if present
- MainMenuScene
- StageSystem
- BossSystem/EnemySystem
- VictoryScene
- TutorialScene
- NPC content data

What to look for:
- Missing opening story
- Bosses without intros
- Stage transitions with no flavor
- Dark/edgy text that conflicts with tone
- No ending conditions
- Dialogue cannot be skipped

Expected output:
Story beats:
- Opening: Block-O-Matic 3000 breaks festival
- Stage intros
- Boss intros
- Hero unlock dialogue
- King Bloxley intro
- Normal ending
- True ending condition and screen

Acceptance criteria:
- Story is cheerful
- Each stage has intro
- Each boss has intro
- Normal ending works
- True ending condition exists
- Dialogue can be skipped

Commands:
- npm run build
- npm run validate:content, if story content data changed

Response format:
Summary / Files changed / Story flow / Commands run / How to test / Known limitations
```

---

#### Phase 24 — Balance Pass 1

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Perform a data-driven balance pass so a full run is playable from start to finish.

Inspect first:
- difficulty scaling content
- monsters/bosses data
- spells/items/relics/upgrades data
- CombatSystem formulas
- BoardSystem fall speed
- RewardSystem loot frequency

What to look for:
- Early difficulty spikes
- Boss HP/attack too high or too low
- Mana gain too low/high
- Spell cost imbalance
- Relics/upgrades that dominate
- Stage length too long
- Unlock conditions too grindy

Expected output:
- Tuned fall speed curve
- Tuned enemy HP/attack
- Tuned mana gain/spell costs
- Tuned item/relic/upgrade values
- Tuned boss difficulty
- Tuned stage length/reward frequency
- Notes in docs/BALANCE_AND_PROGRESSION.md if present

Acceptance criteria:
- Average player can clear Stage 1
- Skilled player can reach Stage 6
- Bosses are challenging but fair
- Cascade feels rewarding
- No one strategy dominates too much
- No required content is impossible to unlock

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Balance changes / Commands run / How to test / Known limitations
```

---

#### Phase 25 — QA Test Suite and Debug Tools

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Add dev-only QA/debug tools and update QA documentation.

Inspect first:
- existing debug/dev flags
- scenes/systems for test hooks
- package.json scripts
- docs/QA_TEST_PLAN.md
- BoardSystem testability
- SaveSystem reset tools

What to look for:
- No way to jump to stages
- No way to force boss/reward/cascade
- No content validation script
- No smoke test checklist
- Debug UI visible in production

Expected output debug tools:
- Give gold
- Give item
- Give relic/upgrade
- Spawn monster
- Jump to stage
- Trigger boss
- Force reward
- Force cascade test
- Clear save

Acceptance criteria:
- Debug mode only available in dev
- QA docs exist
- Basic smoke tests pass or are documented
- Content validation passes

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Debug tools / Commands run / How to test / Known limitations
```

---

#### Phase 26 — Performance Optimization

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Optimize Blockmancer Dungeon for mobile performance without changing gameplay behavior.

Inspect first:
- BoardSystem loops
- Cascade Gravity implementation
- BattleScene update loop
- VFX/particles
- UI object creation
- scene shutdown/cleanup
- asset loading

What to look for:
- Allocations inside hot update loops
- Recreating UI every frame
- Unpooled VFX objects
- Texture reloads during gameplay
- Scene memory leaks
- Expensive cascade loops

Expected output:
- Board/Cascade optimizations
- VFX pooling where practical
- UI object reuse
- Scene cleanup fixes
- Reduced particle counts if needed
- Performance notes

Acceptance criteria:
- Board updates are smooth
- Cascades do not freeze
- Scene transitions are stable
- No major memory leak after multiple runs
- Build passes

Commands:
- npm run build

Response format:
Summary / Files changed / Optimization notes / Commands run / How to test / Known limitations
```

---

#### Phase 27 — Android / Capacitor Release Build

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Prepare Android build support for Release 1.0 using Capacitor.

Inspect first:
- package.json
- capacitor.config.ts
- vite.config.ts
- android/ if present
- public/assets/
- docs/BUILD_APK.md
- app icon/splash assets

What to look for:
- Missing Capacitor config
- Wrong webDir
- Asset path issues after build
- Portrait orientation not locked
- Missing Android scripts
- Missing app icon/splash placeholders
- Unnecessary permissions

Expected output:
- Capacitor config verified
- Android sync/build scripts added or documented
- Portrait orientation configured where possible
- App icon/splash placeholders documented
- Debug APK build instructions
- Device testing checklist

Acceptance criteria:
- Debug APK builds or blockers are documented
- App opens on Android if build is available
- Portrait orientation works
- Touch controls work
- Save/load works on device
- No broken asset paths

Commands:
- npm run build
- npm run android:sync, if configured
- npm run android:build:debug, if configured

Response format:
Summary / Files changed / Android setup / Commands run / How to test / Known limitations
```

---

#### Phase 28 — Store / Release Metadata

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Create store/release metadata docs for Blockmancer Dungeon Release 1.0.

Inspect first:
- docs/
- branding assets if present
- story/core concept docs
- credits/licenses docs
- privacy policy notes if present

What to look for:
- Missing store description
- Missing screenshot plan
- Missing trailer plan
- Missing credits/licenses
- Missing privacy policy notes
- Trademark-risk wording like “Tetris”
- Store assets not listed

Expected output:
Create/update docs such as:
- docs/STORE_METADATA.md
- docs/SCREENSHOT_PLAN.md
- docs/TRAILER_PLAN.md
- docs/PRIVACY_POLICY_NOTES.md
- docs/CREDITS_AND_LICENSES.md

Required materials:
- Game title
- Short description
- Long description
- Feature bullets
- Screenshot plan
- App icon requirement
- Feature graphic requirement
- Trailer plan
- Privacy policy draft notes
- Credits/licenses
- Content rating notes
- Support contact placeholder

Acceptance criteria:
- Store copy is cheerful and accurate
- Screenshots match portrait gameplay
- No trademark-risk wording like “Tetris”
- Credits/licenses list exists
- Privacy policy notes exist

Commands:
- npm run build, if code changed

Response format:
Summary / Docs changed / Store assets needed / Commands run / How to review / Known limitations
```

---

#### Phase 29 — Final Polish and Bug Fixing

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Perform final Release 1.0 polish and bug fixing. Prioritize blocker and critical bugs.

Inspect first:
- docs/RELEASE_1_GAP_AUDIT.md
- docs/QA_TEST_PLAN.md
- current bug list if present
- BattleScene
- SaveSystem
- Android build config
- UI and VFX-heavy scenes

What to look for:
- Blocker bugs
- Critical crashes
- Full-run blockers
- Save/load edge cases
- Android-specific issues
- Portrait UI overlaps
- Unclear tutorial/reward/boss feedback
- Balance spikes

Expected output:
- Fixed top priority bugs
- Polished transitions
- Polished boss fights
- Polished tutorial/reward pacing
- Polished mobile UI
- Save/load edge cases handled
- Updated known issues list

Acceptance criteria:
- No known blocker bugs
- No known critical bugs undocumented
- Full run can be completed
- Android build works or blockers documented
- Web build works
- QA checklist passes or remaining issues listed

Commands:
- npm run build
- npm run validate:content
- npm run android:build:debug, if configured

Response format:
Summary / Bugs fixed / Files changed / Commands run / QA status / Known remaining issues
```

---

#### Phase 30 — Release Candidate

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Prepare Blockmancer Dungeon Release Candidate 1.0.0.

Inspect first:
- package.json version
- docs/RELEASE_1_0_NOTES.md
- docs/QA_TEST_PLAN.md
- docs/CREDITS_AND_LICENSES.md
- docs/BUILD_APK.md
- SaveSystem migration/version
- Store metadata docs

What to look for:
- Version not updated
- Release notes missing
- QA pass not documented
- Credits/licenses incomplete
- Save migration not verified
- Android build not verified
- Known issues not listed

Expected output:
- Version bump to 1.0.0 if appropriate
- Web production build verified
- Android release/debug build status documented
- QA checklist result documented
- Release notes created/updated
- Known issues list created/updated

Acceptance criteria:
- Version is 1.0.0 or release-candidate version is clearly documented
- Web build passes
- Android build passes or blocker is documented
- QA pass is documented
- Release notes exist
- Known issues list exists

Commands:
- npm run build
- npm run validate:content
- npm run validate:metadata, if available
- npm run android:build:debug, if configured

Response format:
Summary / Version status / Files changed / Commands run / Release candidate status / Known issues
```

---

### Phase Prompt Response Template

Use this response format for every phase:

```text
Summary:
- ...

Files changed:
- ...

What changed:
- ...

Commands run:
- ...

How to test:
1. ...
2. ...
3. ...

Acceptance status:
- [x] ...
- [ ] ...

Known limitations:
- ...

Recommended next step:
- ...
```

---

### Phase Completion Checklist

Before moving to the next phase, verify:

```text
[ ] Agent read AGENT.md
[ ] Scope stayed inside the phase
[ ] Game still builds or failure is documented
[ ] Content validation passes if content changed
[ ] No cheerful tone regression
[ ] No mobile portrait regression
[ ] Cascade Gravity remains core board behavior
[ ] Missing assets/content do not crash
[ ] Save compatibility considered
[ ] Manual test steps provided
[ ] Changes are small enough to review
```

---

### Recommended First Prompt to Use

Start here:

```text
Read AGENT.md first and follow it as the main project instruction.
Also read blockmancer_vibe_code_release_1_plan.md.

Implement Phase 0 — Release Audit only.
Do not rewrite code yet unless a tiny build fix is required.

Create docs/RELEASE_1_GAP_AUDIT.md with:
- current implemented features
- missing Release 1.0 features
- broken/risky areas
- current build status
- validation script status
- recommended next phases

Inspect:
- package.json
- README.md
- docs/
- src/game/
- src/game/scenes/
- src/game/systems/
- src/game/content/
- public/assets/

Run if possible:
- npm install
- npm run build
- npm run validate:content
- npm run validate:metadata

If a command does not exist, document it instead of treating it as a fatal failure.

Finish with:
Summary / Files changed / Commands run / How to test / Known limitations / Recommended next phase
```
