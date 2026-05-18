
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## 0. Follow-up Update — 2026-05-18

Decision after reviewing this audit: **keep Phaser 3 + TypeScript + Vite + Capacitor**. The project already has enough runtime scaffolding that an engine migration would slow progress more than it helps.

### Updated release focus

1. Stabilize one full Stage 1 vertical slice.
2. Import/verify Priority 1 board and VFX animation assets.
3. Fix P0 objective/test/save issues.
4. Complete Stage 1 boss and core spell/item effects.
5. Run desktop and portrait-mobile smoke tests.
6. Only revisit engine migration if Phaser still blocks performance or maintainability after this vertical slice.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->
﻿# Blockmancer Dungeon — Release 1 Code Audit Report

## 1. Audit Summary

- Overall build status: pass when run outside the local sandbox. The first sandboxed build attempt failed with a Vite/esbuild filesystem access error, then `npm.cmd run build` passed with escalation.
- Overall implementation status: broad Release 1 scaffold is present. The core battle loop, Cascade Gravity, map routing, reward flow, content registry, save migration, settings, audio fallback, exact-frame animation manifest, and many replayability hooks are implemented. Several systems are functional but shallow, and some content is loaded but not fully executed by runtime gameplay.
- Biggest completed areas: Phaser scene flow, board placement and Cascade Gravity, combat resolution, enemy/boss selection, content registry and validation, exact-frame PNG animation manifest/preload/fallback flow, save/meta migration, reward application, item/relic/upgrade effects, debug scene, Android/Capacitor scaffolding.
- Biggest missing areas: final PNG animation asset packages, full playable spell roster, full boss mechanics, complete hub progression upgrades, complete friendship gameplay, story/endings depth, release-grade audio packages, automated tests/lint, and manual smoke-test evidence.
- Biggest technical risks: runtime depends heavily on generated placeholder textures/audio fallbacks because `public/assets` has no real assets; the new animation validator reports missing expected PNG frame files as nonfatal warnings; several systems use hardcoded effect switches despite data-driven content; legacy curse-named content/effect identifiers conflict with the current cheerful GDD; BattleObjective completion checks contain placeholder `true` branches; mobile layout needs device smoke testing.
- Recommended next milestone: stabilize the Release 1 vertical slice: import Priority 1 exact-frame PNG assets, verify animation fallbacks in battle, complete one full stage-to-boss path with real assets, tone-clean visible GDD text, implement spell/item/reward effects for that slice, and add a repeatable smoke test.

## 2. Commands Run

| Command | Result | Notes |
|---|---|---|
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd install` | pass | Dependencies were already up to date; audit reported 0 vulnerabilities. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run validate:content` | pass | Validated 291 content files. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run validate:metadata` | pass | Validated 25 metadata files. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run validate:animations` | pass | Validated 365 exact animation definitions. Warned that 1832 expected PNG frame files are not present yet; this is nonfatal by design. |
| `Set-Location -LiteralPath 'C:\Users\binh.pc\Desktop\New folder'; npm.cmd run build` | fail, then pass | Sandboxed run failed with Vite/esbuild access denied resolving `vite.config.ts`; escalated run passed and built `dist/`. |
| `npm run test` | not available | No `test` script exists in `package.json`. |
| `npm run lint` | not available | No `lint` script exists in `package.json`. |

## 3. Feature Implementation Matrix

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

## 4. Implemented Features

### Core gameplay

- Cascade Gravity works: completed lines are detected, cleared, then unsupported cells fall by column in `BoardSystem.clearLinesCascade` and `applyCascadeGravity`. Combat consumes the resulting line/cascade details through `CombatSystem.resolveCascadeClear`.
- Falling-block controls work through `BoardSystem`, `InputSystem`, `MobileControls`, and `BattleScene`: move, rotate, soft drop, hard drop, hold, ghost position, and current/next piece state all exist.
- Combat loop works: enemy HP, attack counters, player HP/mana/shield, damage, combo, cascade multiplier, fever hooks, rewards, and game over/victory routing are implemented in `BattleScene`, `CombatSystem`, `EnemySystem`, and `RewardSystem`.
- Map flow works: `BlockmancerGame.newRun` creates a map, `MapScene` renders/selects nodes, and rooms route to battle/event/shop/rest/treasure/reward scenes.

### Content/data

- `ContentRegistry.ts` loads eager JSON content from `src/game/content/**/*.json` for all canonical categories used by GDD.
- Content validation passes for 291 files, and metadata validation passes for 25 metadata files.
- Exact animation standards are centralized in `src/game/data/animation-standards.json` and compiled into runtime definitions by `src/game/data/animations.ts`.
- Board blocks, spells, items, heroes, monsters, and bosses now have optional animation/VFX key references where appropriate, while older content remains valid.
- Fallback IDs are present for registry defaults, including `mon_dungeon_slime`, `hero_milo_blockmancer`, `wpn_basic_wand`, `spl_fireball`, `rel_goblin_coin`, and `block_red`.

### UI/mobile

- Portrait orientation is requested best-effort in `main.ts`.
- Phaser scale config and scenes are aimed at portrait mobile dimensions.
- Mobile controls exist in `MobileControls.ts` and are used by `BattleScene`.
- Menu, hero select, map, battle, reward, event, shop, rest, treasure, tutorial, settings, help, collection, hub, story, victory, game over, and debug scenes are registered in `BlockmancerGame.ts`.

### Meta progression

- `SaveSystem.ts` handles run and meta LocalStorage saves with versioned migrations.
- `MetaSystem.ts` tracks unlocks and run completion style progress.
- Hub and friendship content is loaded and visible through thin systems/scenes, though not yet a complete progression loop.

### Build/release

- Vite build passes outside the sandbox.
- Capacitor config and Android project files exist.
- `package.json` contains Android helper scripts: `android:init`, `android:sync`, `android:open`, and `android:build:debug`.
- `package.json` includes `validate:animations` for exact-frame animation manifest checks.

### QA/debug

- `DebugScene.ts` is registered in development builds from `MainMenuScene`.
- Validation scripts exist for content, metadata, and exact-frame animation definitions.
- Several asset audit/sync scripts exist under `scripts/`.

## 5. Partially Implemented Features

- Spell roster: 21 spell content files exist, but runtime spell use is limited to the four spells defined in `src/game/data/spells.ts`. Risk level: high for Release 1 content expectations. Suggested next step: decide the playable Release 1 spell list and implement only those effects first.
- Boss mechanics: six boss monsters and boss rules exist, but many behaviors are not deeply enforced as mechanical rules. Risk level: high. Suggested next step: write a per-boss checklist and implement/verify each boss rule in `BattleScene`/systems.
- Replayability systems: random events, chaos rules, stage goals, battle objectives, dynamic board size, and reactive difficulty all have code and content, but several effects are shallow or switch-limited. Risk level: medium-high. Suggested next step: run every content ID through a supported-effect audit and remove/disable no-op entries.
- Items/relics/upgrades/oopsies: systems apply many effects, but behavior is hardcoded by ID/effect string. Risk level: medium. Suggested next step: document supported effect types and validate content against them.
- Hub progression and friendship: content and summary display exist, but full progression/effect loops are not done. Risk level: medium. Suggested next step: either de-scope to visible collection/progress for Release 1 or implement one complete upgrade/friendship loop.
- Settings/accessibility: settings scene and persistence exist, but full accessibility acceptance needs device testing. Risk level: medium. Suggested next step: test portrait touch, reduced motion, audio toggles, text readability.
- Asset/audio pipeline: fallback systems and exact-frame animation preload/registration exist, but real release assets/audio are absent from `public/assets`. Risk level: high for release presentation. Suggested next step: import final PNG/audio assets and run preload plus animation smoke tests.

## 6. Not Implemented Features

- Complete weapon effect system: GDD expects meaningful hero/weapon progression. Current `WeaponSystem.ts` is essentially lookup-only. Suggested phase: Release 1 core-loop polish. Priority: P2.
- Dedicated boss intro scene: AGENT/release structure references `BossIntroScene.ts`; current implementation uses inline boss cards in `BattleScene`. Suggested phase: optional polish unless a separate scene is required. Priority: P3.
- Full story/dialogue/endings depth: `StoryScene` and `StorySystem` exist, but story is thin compared with the broad GDD. Suggested phase: narrative polish. Priority: P2.
- Complete friendship gameplay: content exists, but gameplay loop is not complete. Suggested phase: future/replayability milestone. Priority: P3.
- Automated test suite: no `npm run test` script. Suggested phase: before major feature expansion. Priority: P1.
- Lint/static-quality script: no `npm run lint` script. Suggested phase: release readiness. Priority: P2.
- Full release asset/audio package: no real assets found in `public/assets` beyond `.gitkeep`. Suggested phase: before release candidate. Priority: P1.
- Store metadata package: Android project exists, but store listing/art/release metadata is not complete in the inspected codebase. Suggested phase: release packaging. Priority: P2.

## 7. Added Later / Extra Features

| Item | Evidence | Assessment | Recommendation |
|---|---|---|---|
| Board-block PNG frame animation support | `AssetSystem.ts`, `BoardSystem.ts`, `BattleScene.ts`, `docs/BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION.md` | Added later but compatible with current asset direction. | Keep and document in GDD/assets docs if it is now product direction. |
| Exact-frame animation manifest | `src/game/data/animation-standards.json`, `src/game/data/animations.ts`, `docs/ANIMATION_ASSET_REQUIREMENTS.md`, `scripts/validate-animations.mjs` | Added after the initial audit; now provides the canonical exact-frame PNG sequence definitions for board blocks, VFX, spells, items, heroes, monsters, bosses, hazards, and UI. | Keep. Treat it as the asset production contract and continue wiring only low-risk runtime hooks. |
| Extra heroes beyond the six called out in GDD summary | `src/game/content/heroes/` has 8 hero JSON files | Could be future/backlog content. | Needs product decision: keep locked/future or update GDD. |
| Legacy curse terminology | `EventSystem.ts` effect aliases, content names like cursed/blood wording, deprecated save fields | Conflicts with cheerful no-dark-lore direction even if some UI text is sanitized. | Rename content and keep compatibility aliases internally. |
| Hardcoded legacy event cards | `MapSystem.EVENT_CARDS`, `getRandomEvent` | Appears historical or unused by current `EventScene`. | Remove later only after confirming no callers remain; document as historical now. |
| Development debug entry | `MainMenuScene.ts`, `DebugScene.ts` | Useful dev-only tooling. | Keep dev-gated; ensure it is inaccessible in production builds. |
| Screenshot/UI scripts without npm wrappers | `scripts/check-ui-screenshots.mjs` and related scripts | Useful QA tooling but not integrated into normal validation. | Add package scripts or document manual use. |

## 8. Broken / Risky Areas

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

## 9. Used vs Unused Code Inventory

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

## 10. Content Loading Audit

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

## 11. GDD Compliance Findings

- GDD requirement: cheerful magical festival tone with no dark curse lore. Current code behavior: systems and content still include legacy curse/blood identifiers and effect names. File evidence: `EventSystem.ts`, room-event/oopsie content. Impact: tone drift and confusing product vocabulary. Recommended fix: rename content and UI-facing strings, keep internal migration aliases only where needed.
- GDD requirement: Cascade Gravity, not classic row shifting. Current code behavior: Cascade Gravity is implemented and should be preserved. File evidence: `BoardSystem.applyCascadeGravity`. Impact: compliant core identity. Recommended fix: add tests to prevent regressions.
- GDD requirement: portrait mobile as primary target. Current code behavior: portrait orientation request and mobile controls exist. File evidence: `main.ts`, `MobileControls.ts`, Phaser scale config. Impact: likely compliant but unverified on device. Recommended fix: run manual mobile smoke path.
- GDD requirement: data-driven content wherever practical. Current code behavior: content is loaded from JSON, but effect execution is often hardcoded. File evidence: `SpellSystem.ts`, `ItemSystem.ts`, `RelicSystem.ts`, `UpgradeSystem.ts`, `EventSystem.ts`. Impact: adding content can create no-op behavior. Recommended fix: validate effect types against supported interpreters.
- GDD requirement: six-stage route including late-stage special beats. Current code behavior: six stages exist and maps are generated, but Stage 6 does not show an explicit mini-boss/royal-guard node type. File evidence: `MapSystem.getRequiredTypesForStage`. Impact: final stage structure may diverge from GDD. Recommended fix: adjust Stage 6 path or document current route.
- GDD requirement: boss rule cards and boss identity. Current code behavior: boss rule lookup/card exists, but some boss mechanics are shallow. File evidence: `BossRuleSystem.ts`, `BattleScene.ts`. Impact: bosses may not feel distinct enough. Recommended fix: verify each boss rule has a mechanical effect.
- GDD requirement: safe fallbacks for assets/audio/content/saves. Current code behavior: content and save fallbacks are strong; asset/audio fallbacks exist. File evidence: `ContentRegistry.ts`, `SaveSystem.ts`, `AssetSystem.ts`, `AudioSystem.ts`. Impact: compliant for crash safety, but release quality assets are missing. Recommended fix: add final assets/audio and keep fallbacks.
- GDD requirement: exact PNG frame sequences instead of GIF/range-based animation requirements. Current code behavior: `docs/ANIMATION_ASSET_REQUIREMENTS.md`, `src/game/data/animation-standards.json`, `src/game/data/animations.ts`, and `scripts/validate-animations.mjs` define and validate exact frame counts and generated frame paths. File evidence: listed files plus `AssetSystem.ts` preload/registration helpers. Impact: compliant at manifest/code level, but final PNG files are still missing. Recommended fix: import Priority 1 animation frames and rerun `validate:animations`.
- GDD requirement: Release 1 replayability systems. Current code behavior: random gameplay events, stage goals, chaos rules, battle objectives, dynamic board size, reactive difficulty, hub and friendship are present but uneven. File evidence: corresponding systems and content folders. Impact: Release 1 variety exists but needs tightening. Recommended fix: prioritize P0/P1 systems with visible impact.

## 12. Build, Validation, and QA Findings

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

## 13. Priority Backlog

### P0 — Must fix before more feature work

- Add tests or a deterministic smoke harness for Cascade Gravity, board mutation, and save migration.
- Replace placeholder battle objective checks that currently return `true` without validating the objective.
- Audit save compatibility for all newly added run/meta fields and add migration coverage.
- Confirm no current board/dynamic-size/reactive-difficulty path can soft-lock a run.

### P1 — Needed for Release 1.0 core loop

- Import real board/UI/scene assets and verify `AssetSystem` resolves them without relying on placeholders.
- Import Priority 1 exact-frame PNG animation sequences and verify `validate:animations` no longer reports missing core board/VFX frames.
- Decide and implement the Release 1 playable spell roster beyond the current four runtime spells, or disable/hide unused spell content.
- Verify each boss rule and boss behavior has a visible mechanical effect.
- Tone-clean legacy curse/blood content and aliases while preserving save compatibility.
- Validate every random gameplay event, stage goal, chaos rule, and item effect against supported runtime behavior.
- Run the full GDD manual smoke path on desktop and portrait mobile.

### P2 — Needed for polish / release readiness

- Add `npm run test` and `npm run lint` or document explicit alternatives.
- Finish shop/economy balance and inventory UX.
- Improve settings/accessibility verification.
- Add real music/SFX or explicitly define the synth fallback as product style.
- Integrate screenshot/UI scripts into npm commands.
- Complete Android debug build validation and release metadata checklist.

### P3 — Nice to have / future

- Expand friendship into a complete progression loop.
- Expand hub buildings into upgrade purchases with effects.
- Add a dedicated boss intro scene if the inline card presentation is not enough.
- Move future/extra heroes into a documented backlog or update the GDD.
- Remove historical unused code after a separate cleanup task verifies it has no callers.

## 14. Recommended Next Prompt

Read `AGENT.md`, `docs/01_GDD_MASTER.md`, `docs/ANIMATION_ASSET_REQUIREMENTS.md`, and `docs/RELEASE_1_CODE_AUDIT_REPORT.md`. Do a P0 stabilization pass only: import or verify Priority 1 exact-frame PNG board/VFX assets, fix placeholder battle objective completion checks, add focused tests or deterministic validation for Cascade Gravity and save migration, and do not change unrelated gameplay. Preserve Cascade Gravity, portrait mobile, cheerful tone, data-driven content, and all existing fallbacks. Run `npm run validate:animations`, `npm run validate:content`, `npm run validate:metadata`, and `npm run build`, and report any missing test/lint scripts without treating them as fatal.