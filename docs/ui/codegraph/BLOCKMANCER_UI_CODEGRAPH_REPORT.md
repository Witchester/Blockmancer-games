# Blockmancer UI CodeGraph Report

## Purpose
Summarize CodeGraph/manual analysis used to connect SOT docs, Phaser scenes, UI components, layout specs, asset keys, and validation responsibilities.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## CodeGraph availability
CodeGraph MCP and the global codegraph CLI were available. package.json has no codegraph script. MCP initially reported 151 files, 2720 nodes, and 7479 edges; `codegraph status .` later reported 152 files, 2763 nodes, 7564 edges, and an up-to-date .codegraph index.

## Command or script used
Used CodeGraph MCP tools: codegraph_status, codegraph_context, and codegraph_files. Also ran `codegraph --help` and `codegraph status .` as safe read-only CLI checks. No generated codegraph.html/json was created by this pass.

## Generated output paths
Manual graph deliverables are in docs/ui/codegraph/. Existing .codegraph/ remains the project index location.

## Summary of UI-relevant graph clusters
- Scenes: BattleScene, BootScene, MainMenuScene, HeroSelectScene, MapScene, StoryScene, RouteDialogueScene, EventScene, ShopScene, RestScene, TreasureScene, NodeResultScene, LevelUpRewardScene, RewardScene, VictoryScene, GameOverScene, SettingsScene, CollectionScene.
- UI helpers: Button, Card, EventLog, Hud, MobileControls, MonsterStackPreview, ProgressBar.
- Runtime systems: AssetSystem, MapSystem, RewardSystem, LevelUpSystem.
- Layout helpers: src/game/utils/layout.ts and BattleScene layout types.

## Scene flow findings
The screen flow is map/run based: splash/menu -> hero select -> map -> room/battle -> node result -> level up/reward -> map, with settings accessible from utility routes and victory/defeat terminal routes.

## Component dependency findings
Most reusable components are panel/button/meter/card abstractions in runtime or spec form. Battle has additional board, hold, next queue, event log, monster stack, and mobile control dependencies.

## Asset key/folder findings
SOT requires canonical public/assets categories with stage battle/puzzle/full-scene separation, exact-frame PNG naming, fallback-safe placeholders, and key-based references.

## Pixel-perfect readiness findings
The new layout JSON specs are ready as asset contracts. Runtime code has its own responsive layout logic and is not modified by this docs pass.

## Asset-drop-in risk findings
Risk remains where runtime scenes have not yet been wired to consume the specs; final art should still match source sizes and anchors to minimize implementation drift.

## Conflicts or gaps found
No root AGENT.md exists; docs/AGENT.md and AGENTS.md provided project instructions. graphify-out/graph.json was not present, so graphify query/update was not used.

## Manual fallback method if CodeGraph was unavailable
Manual fallback would inspect src/game/scenes, src/game/ui, src/game/systems/AssetSystem.ts, docs SOT files, public/assets, package scripts, and README/AGENTS docs, then maintain Mermaid graphs in this folder.

## Recommended future use of CodeGraph before UI implementation prompts
Before UI implementation prompts, query CodeGraph for the target scene and AssetSystem impact, then compare against docs/ui/layouts and this traceability matrix.

## UI-9 CodeGraph Findings

For UI-9, CodeGraph MCP status reported an initialized index with 183 files, 3444 nodes, and 8307 edges. `codegraph_context` identified `LevelUpRewardScene`, `NodeResultScene`, `LevelUpSystem`, `UpgradeSystem`, `RewardScene`, and `src/game/data/assets.ts` as the key implementation surface. `codegraph_impact LevelUpRewardScene` showed a narrow impact radius limited to the scene itself, while file/layout inspection tied the work to `screen_level_up.layout.json`, `screen_node_result.layout.json`, `screen_reward.layout.json`, and the shared UI primitive layer.

## Relevant screen/component/layout content
See SCREEN_FLOW_GRAPH, COMPONENT_DEPENDENCY_GRAPH, ASSET_KEY_GRAPH, and SCENE_TO_SPEC_TRACEABILITY.

## Asset key/fallback rules when applicable
Use layout JSON asset keys and fallback keys; CodeGraph is evidence, not asset authority.

## Pixel-perfect or QA guidance when applicable
Use CodeGraph to identify affected scenes, then use QA checklist for visual acceptance.

## Status / known gaps
CodeGraph MCP was available, but no standalone CLI output artifact was generated. Manual Mermaid docs are canonical deliverables for this task.

## UI-10 Reward Screen Findings

For UI-10, CodeGraph MCP status reported an initialized index with 188 files, 3497 nodes, and 9673 edges. `codegraph_context` and `codegraph_impact` identified `RewardScene`, `RewardSystem`, `NodeResultFlowRouter`, `LevelUpFlowRouter`, `MapSystem`, `RunState.pendingRewards`, and `RunState.pendingStageAdvance` as the implementation surface.

Runtime reward routing now prefers pending level-ups first, then `RewardScene` only when `pendingRewards` contains claimable rewards. When no rewards remain, post-node completion routes directly to map/next-node flow while still advancing boss stages safely. Reward claiming applies one selected pending reward, clears `pendingRewards` after claim, applies post-battle effects, clears active encounter state, and saves before returning to map.

## UI-11 Map / Stage Intro / Boss Rule Findings

For UI-11, CodeGraph MCP status reported an initialized index with 191 files, 3529 nodes, and 9761 edges before implementation. `codegraph_context` and `codegraph_impact` identified `MapScene`, `StoryScene`, `BattleScene.showBossRuleCard`, `MapSystem`, `StageSystem`, `StageGoalSystem`, `BossSystem`, `BossRuleSystem`, shared UI primitives, and the map/stage/boss layout JSON files as the relevant surface.

Runtime map rendering now uses shared UI panel/button/icon primitives for the map frame, header, node preview, run summary, actions, and node icons while preserving existing `MapSystem` node generation. Stage intro is handled by a focused `StageIntroScene` before returning to map. Boss nodes route to a dedicated `BossRuleCardScene`, which shows existing boss rule data and then starts `BattleScene` without replaying the legacy in-battle rule overlay.

## UI-12 Route Dialogue / Story Choice Findings

For UI-12, CodeGraph MCP status reported an initialized index with 193 files, 3560 nodes, and 8434 edges before implementation. `codegraph_context` and `codegraph_impact` identified `RouteDialogueScene`, `DialogueSystem`, `RouteStorySystem`, `RouteStorySystem.resolveRouteChoice`, route progress state, shared UI primitives, asset fallback helpers, and `screen_route_dialogue.layout.json` as the implementation surface.

Runtime route dialogue now uses shared panels, buttons, and icon slots for background, portrait, nameplate, dialogue panel, continue/skip controls, and route choice cards. Route choice application still delegates to the existing `RouteStorySystem.resolveRouteChoice`, preserving route IDs, route flags, lane scores, rewards, risks, and save keys.

## UI-13 Shop / Inventory / Settings Findings

For UI-13, CodeGraph MCP status reported an initialized index with 202 files, 3608 nodes, and 9990 edges before implementation. `codegraph_context` and `codegraph_impact` identified `ShopScene`, `ShopSystem`, `BattleScene` inventory overlay methods, `InventorySystem`, `ItemSystem`, `SettingsScene`, `SettingsSystem`, shared UI primitives, asset fallback helpers, and the shop/inventory/settings layout JSON files as the implementation surface.

Runtime shop rendering now uses shared UI primitives and a presentation adapter while preserving all existing shop handlers and prices. The battle inventory modal now renders item, relic, and spell inventory data with shared panels/icons/buttons; item use still delegates to the existing battle item-use path. Settings now renders tabbed audio/accessibility/controls rows over the existing settings fields and save path without changing save keys or schema.

## UI-14 Outer Flow Findings

For UI-14, CodeGraph MCP status reported an initialized index with 208 files, 3655 nodes, and 10158 edges before implementation. `codegraph_context` and `codegraph_impact` identified `BootScene`, `MainMenuScene`, `HeroSelectScene`, `GameOverScene`, `VictoryScene`, run start/continue methods on `BlockmancerGame`, hero content/unlock checks, shared UI primitives, asset fallback helpers, and the splash/main-menu/hero-select/defeat/victory layout JSON files as the implementation surface.

Runtime outer-flow screens now use shared UI primitives through `OuterFlowUi` while preserving existing routing and state behavior: Boot still preloads assets and waits for fonts, Main Menu still routes through opening/tutorial/new-run/continue handlers, Hero Select still uses existing hero content and unlock checks before `newRun(heroId)`, Game Over still sets victory/defeat status and clears saves on exit actions, and Victory still uses existing story/route ending lookup.

## 2026-05-26 Sequential Encounter / Level-Up Audit Follow-Up

CodeGraph and SOT comparison found that the older Release Implementation SOT rows still described encounter packs, Festival Level-Up, and Node Result as pending, while runtime code and UI CodeGraph notes showed those features present. The SOT rows were updated to implemented/mostly implemented status.

Implementation follow-up closed the highest deterministic restore gap: `LevelUpSystem` now generates offers from a persisted seed, `LevelUpRewardScene` reuses `levelUpSelectionSeed` and exact `offeredUpgradeIds`, `LevelUpFlowRouter` clears stale seeds on reset, and `EncounterPackSystem` selects entry effects from the encounter seed. `npm run build`, `npm test`, and `npm run validate:ui-layouts` passed after the patch.

## 2026-06-02 Battle Wireframe Visibility Fix

Battle UI wireframe/debug overlays now require an explicit dev URL opt-in through `?uiDebug=1` or `?uiDebug=true`. Registry-only and persisted browser state no longer enable the overlay, preventing debug frames from covering normal battle text and assets.

## 2026-06-02 Shared UI Depth Fix

Shared UI components now keep scene root depth at normal creation-order depth unless a caller explicitly supplies `depthOffset` or calls `setDepth`. This prevents panel and slot fallback frames from rendering above later normal Phaser text/assets on reward, hero select, menu, and other mixed UI scenes.

Panel and button components also suppress the generated `missing_ui` image when UI art is unavailable, relying on their styled fallback rectangles instead. This keeps missing panel/button art from appearing as bright placeholder wireframes across normal screens.

## 2026-06-02 Level-Up Upgrade Screen Cleanup

The 3-lane level-up upgrade screen no longer displays card rank/level copy on offer cards; owned cards now show neutral ownership text. Item-like reroll/resource rewards were removed from level-up offers and fallbacks so consumable/reward resources stay in post-battle reward flow.

