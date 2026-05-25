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

## Relevant screen/component/layout content
See SCREEN_FLOW_GRAPH, COMPONENT_DEPENDENCY_GRAPH, ASSET_KEY_GRAPH, and SCENE_TO_SPEC_TRACEABILITY.

## Asset key/fallback rules when applicable
Use layout JSON asset keys and fallback keys; CodeGraph is evidence, not asset authority.

## Pixel-perfect or QA guidance when applicable
Use CodeGraph to identify affected scenes, then use QA checklist for visual acceptance.

## Status / known gaps
CodeGraph MCP was available, but no standalone CLI output artifact was generated. Manual Mermaid docs are canonical deliverables for this task.

