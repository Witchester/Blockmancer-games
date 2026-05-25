# Blockmancer UI Output Completion Audit

## Purpose
Postflight proof that the mandatory docs/ui package exists, is non-empty, and contains required sections or layout JSON structure after the recovery rerun.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
This audit covers all 8 core UI docs, all 5 CodeGraph docs, and all 17 layout JSON specs.

## Preflight Missing Output Audit
| Required file | Exists before rerun | Current status | Action needed |
|---|---|---|---|
| docs/ui | Yes | Complete | Update/verify |
| docs/ui/layouts | Yes | Complete | Update/verify |
| docs/ui/codegraph | Yes | Complete | Update/verify |
| docs/ui/BLOCKMANCER_UI_MOCKUP_FRAMEWORK.md | No | Missing | Create |
| docs/ui/BLOCKMANCER_UI_SCREEN_INDEX.md | No | Missing | Create |
| docs/ui/BLOCKMANCER_UI_COMPONENT_LIBRARY.md | No | Missing | Create |
| docs/ui/BLOCKMANCER_UI_FONT_SCALE.md | No | Missing | Create |
| docs/ui/BLOCKMANCER_UI_ASSET_PLACEHOLDER_KEYS.md | No | Missing | Create |
| docs/ui/BLOCKMANCER_UI_QA_CHECKLIST.md | No | Missing | Create |
| docs/ui/BLOCKMANCER_UI_PIXEL_PERFECT_ASSET_CONTRACT.md | Yes | Partial | Update/verify |
| docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md | No | Missing | Create |
| docs/ui/codegraph/BLOCKMANCER_UI_CODEGRAPH_REPORT.md | No | Missing | Create |
| docs/ui/codegraph/BLOCKMANCER_UI_SCREEN_FLOW_GRAPH.md | No | Missing | Create |
| docs/ui/codegraph/BLOCKMANCER_UI_COMPONENT_DEPENDENCY_GRAPH.md | No | Missing | Create |
| docs/ui/codegraph/BLOCKMANCER_UI_ASSET_KEY_GRAPH.md | No | Missing | Create |
| docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md | Yes | Partial | Update/verify |
| docs/ui/layouts/screen_splash.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_main_menu.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_hero_select.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_map.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_stage_intro.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_battle.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_boss_rule_card.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_route_dialogue.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_event_room.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_shop.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_inventory_modal.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_node_result.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_level_up.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_reward.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_victory_ending.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_defeat_summary.layout.json | No | Missing | Create |
| docs/ui/layouts/screen_settings.layout.json | No | Missing | Create |

## Postflight Output Audit
| Required file | Exists after rerun | Non-empty | Has required sections | Notes | Final status |
|---|---|---|---|---|---|
| docs/ui/BLOCKMANCER_UI_MOCKUP_FRAMEWORK.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_SCREEN_INDEX.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_COMPONENT_LIBRARY.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_FONT_SCALE.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_ASSET_PLACEHOLDER_KEYS.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_QA_CHECKLIST.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_PIXEL_PERFECT_ASSET_CONTRACT.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/codegraph/BLOCKMANCER_UI_CODEGRAPH_REPORT.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/codegraph/BLOCKMANCER_UI_SCREEN_FLOW_GRAPH.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/codegraph/BLOCKMANCER_UI_COMPONENT_DEPENDENCY_GRAPH.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/codegraph/BLOCKMANCER_UI_ASSET_KEY_GRAPH.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md | Yes | Yes | Yes | Required markdown sections present. | Complete |
| docs/ui/layouts/screen_splash.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_main_menu.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_hero_select.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_map.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_stage_intro.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_battle.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_boss_rule_card.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_route_dialogue.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_event_room.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_shop.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_inventory_modal.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_node_result.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_level_up.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_reward.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_victory_ending.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_defeat_summary.layout.json | Yes | Yes | Yes | ok | Complete |
| docs/ui/layouts/screen_settings.layout.json | Yes | Yes | Yes | ok | Complete |

## Asset key/fallback rules when applicable
Every layout JSON visual component was checked for assetKey, fallbackAssetKey, canonicalFolder, expectedSourceSize, runtimeRenderSize, anchor, fitMode, scaleMode, safePadding, zIndex, dynamicTextAllowed, and pixelPerfect.

## Pixel-perfect or QA guidance when applicable
The postflight JSON validation checked 1080x1920 portrait canvas, required root fields, integer component coordinates, required visual component fields, and exact battle section rectangles.

## Status / known gaps
Final status: Complete. Runtime gameplay systems were intentionally not rewritten. Automated PNG dimension validation remains a future tooling step.

## UI-1 Foundation Implementation Audit

### Files created
- `src/game/types/ui-layout.ts`
- `src/game/ui/PixelPerfect.ts`
- `src/game/ui/UiLayoutValidator.ts`
- `src/game/ui/UiLayoutRegistry.ts`
- `src/game/ui/UiAssetSlotResolver.ts`
- `src/game/ui/UiLayoutDebugReport.ts`
- `scripts/validate-ui-layouts.mjs`

### Files updated
- `src/game/types/index.ts`
- `package.json`
- `docs/ui/layouts/screen_battle.layout.json`
- `docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md`

### Layout type coverage
UI-1 adds `UiLayoutSpec`, `UiCanvasSpec`, `UiStyleSpec`, `UiCodeGraphSpec`, `UiFontSpec`, `UiSectionSpec`, `UiComponentSpec`, `UiAssetSize`, `UiPixelPerfectSpec`, `UiFitMode`, `UiScaleMode`, `UiAnchor`, `UiLayoutValidationIssue`, and `UiLayoutValidationResult`.

### Pixel-perfect helper coverage
`PixelPerfect.ts` provides `roundPixel`, `roundRect`, `assertIntegerRect`, `clampToCanvas`, `computeAnchorOffset`, `getIntegerScale`, `validateNoFractionalCoordinates`, `validateRuntimeRenderSize`, `validatePixelPerfectFlags`, and `normalizePixelPerfectComponent`.

### Layout validator coverage
`UiLayoutValidator.ts` validates the 1080x1920 portrait canvas, integer sections, required visual component asset fields, pixelPerfect config, enum values, zIndex/safePadding types, non-fatal bounds warnings, and exact `screen_battle` combat/puzzle/controls rectangles.

### Asset slot resolver coverage
`UiAssetSlotResolver.ts` exposes assetKey/fallback/source/runtime/folder/anchor/fit/scale accessors, fallback-safe asset key resolution, placeholder fallback inference, debug summaries, and asset-drop-in readiness checks. It uses asset keys and manifest metadata; it does not load raw `public/assets` paths from layout specs.

### Runtime JSON loading status
`UiLayoutRegistry.ts` registers all 17 screen IDs and canonical docs layout paths. Runtime JSON loading is intentionally metadata-only in UI-1 because `docs/` files are not guaranteed to be browser-fetchable. `loadLayoutSpec` explicitly reports that UI-2/UI-4 must choose a safe bundling or public delivery strategy.

### Validation script status
`npm run validate:ui-layouts` is available and validates all 17 `docs/ui/layouts/*.layout.json` specs for required root fields, visual component fields, enum values, integer coordinates, pixelPerfect flags, and the battle 25/55/20 split. It does not require final PNG assets to exist.

### Known limitations
- No full screen rendering was implemented.
- No BattleScene, NodeResultScene, or LevelUpRewardScene UI rewiring was attempted.
- Runtime layout JSON loading remains deferred.
- PNG dimension checks are not implemented yet.
- Missing production assets remain fallback-safe and nonfatal.

### Next phase recommendation
UI-2 should choose the runtime delivery strategy for layout specs, then wire one low-risk screen or debug-only renderer path to consume a loaded `UiLayoutSpec` without replacing existing gameplay UI.

## UI-2 Shared UI Component Primitives Audit

### Files created
- `src/game/ui/components/UiBaseComponent.ts`
- `src/game/ui/components/UiPanel.ts`
- `src/game/ui/components/UiButton.ts`
- `src/game/ui/components/UiIconSlot.ts`
- `src/game/ui/components/UiSpriteSlot.ts`
- `src/game/ui/components/UiMeter.ts`
- `src/game/ui/components/UiTextLabel.ts`
- `src/game/ui/components/UiChip.ts`
- `src/game/ui/components/UiCard.ts`
- `src/game/ui/components/UiModalBackdrop.ts`
- `src/game/ui/components/UiComponentFactory.ts`
- `src/game/ui/components/index.ts`

### Files updated
- `docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md`

### Component primitives implemented
UI-2 adds reusable Phaser-friendly primitives for panels, buttons, icon slots, sprite slots, meters, text labels, chips/badges, cards, modal backdrops, and a component factory. The primitives consume `UiComponentSpec` bounds and asset-slot metadata without implementing full screens.

### Supported component states
Implemented shared state handling for `default`, `disabled`, `pressed`, `selected`, `locked`, `alert`, and `hidden`. Buttons, cards, chips, and icon slots apply simple alpha/tint/outline state styling; disabled and locked buttons do not emit click callbacks.

### Pixel-perfect integration status
All primitives normalize layout specs through `normalizePixelPerfectComponent`, round bounds through `PixelPerfect` helpers, apply integer depth, and use integer hit-area/rectangle/text positions. Pixel-art texture filtering continues through `AssetSystem.applyPixelArtTextureSettings` when image assets are created.

### Asset fallback integration status
Visual primitives resolve asset keys through `UiAssetSlotResolver.resolveFallbackSafeAssetKey` and `AssetSystem` texture fallback behavior. Missing final art remains nonfatal and resolves to manifest or generated fallback textures; components do not hardcode raw `public/assets` paths.

### Dynamic text handling status
Buttons, meters, chips, cards, and labels render dynamic labels, values, quantities, and descriptions with Phaser text objects. No dynamic values are baked into PNG assets.

### Known limitations
- Full screen rendering was intentionally not implemented.
- BattleScene UI, Node Result flow, and Level-Up flow were not wired.
- Animation playback is not implemented in these primitives; sprite slots render still/fallback assets only.
- Nine-slice support is represented as scalable UI image slots; a future pass can swap panel/button rendering to Phaser NineSlice if final assets require sliced borders.
- Runtime layout JSON delivery remains the UI-1 metadata-only approach until a later integration phase chooses bundling/public delivery.

### Next phase recommendation
UI-3 should add a debug-only layout preview scene or harness that instantiates a small subset of layout specs through `UiComponentFactory`, verifies portrait scaling visually, and leaves gameplay scenes untouched until the preview proves the primitive contract.

## UI-3 Asset Slot Resolver + Fallback Rendering Audit

### Files created
- `src/game/ui/UiPlaceholderKeys.ts`
- `src/game/ui/UiAssetDropInReport.ts`

### Files updated
- `src/game/ui/UiAssetSlotResolver.ts`
- `src/game/ui/components/UiBaseComponent.ts`
- `src/game/ui/components/index.ts`
- `scripts/validate-ui-layouts.mjs`
- `docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_ASSET_KEY_GRAPH.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md`

### Resolver status
Implemented. `resolveAssetSlot` returns structured `ready`, `usingFallback`, `usingPlaceholder`, `unresolved`, and `invalidSpec` results. It checks loaded Phaser textures when a scene is provided and reports development warnings without making missing final PNG art fatal.

### Placeholder policy status
Implemented. Placeholder categories cover generic, panel, button, icon, portrait, sprite, background, battle background, puzzle background, full background, meter, card, VFX, and board block slots. The policy prefers existing generated fallback texture keys and does not require new final art.

### Component integration status
Implemented at the shared primitive layer. `UiBaseComponent.createSlotImage` resolves through the hardened resolver before creating images, and existing primitive rectangle frames remain available as safe visual fallback surfaces.

### Asset-drop-in report status
Implemented. `UiAssetDropInReport` summarizes visual component readiness counts, size/folder/fallback issues, risky fit/scale modes, dynamic text concerns, and recommended fixes.

### validate:ui-layouts status
Extended. The script now rejects raw asset paths in asset keys, validates required fallback/canonical/source/runtime fields, validates pixel-perfect filtering, and checks inferable expected source sizes without requiring physical PNG existence.

### Known limitations
- Full screens are still not implemented.
- BattleScene UI, Node Result, and Level-Up runtime flows remain untouched.
- Physical PNG dimension probing is not implemented; UI-3 validates the layout contract, not image files on disk.
- Some layout fallback keys are contract keys and may resolve to generated safe placeholders until final placeholder PNGs are registered or imported.

### Next phase recommendation
Add a debug-only layout preview harness that loads selected layout specs and renders primitive snapshots through `UiComponentFactory`, keeping gameplay scenes unchanged until the visual contract is verified.

## UI-4 Battle Screen Shell Audit

### Files created
- `src/game/ui/PortraitFrame.ts`
- `src/game/ui/battle/BattleScreenShell.ts`
- `src/game/ui/battle/BattleScreenShellDebug.ts`
- `src/game/ui/battle/index.ts`

### Files updated
- `src/game/scenes/BattleScene.ts`
- `scripts/validate-ui-layouts.mjs`
- `docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_SCREEN_FLOW_GRAPH.md`

### Battle shell helper status
Implemented. `BattleScreenShell` creates `battleShell.root`, combat, puzzle, controls, modal, debug, and named sublayers for later UI phases without owning gameplay state.

### Portrait scaling status
Implemented. `PortraitFrame.ts` computes centered 1080x1920 portrait-frame scale and integer frame offsets for desktop/wide preview while preserving integer design-space section coordinates.

### BattleScene integration status
Integrated safely. `BattleScene` instantiates the shell behind the existing gameplay UI and destroys it during scene shutdown. Existing board, combat, input, mobile controls, and Cascade Gravity logic remain unchanged.

### Exact 25/55/20 split validation
Implemented. Shell constants match combat `0,0,1080,480`, puzzle `0,480,1080,1056`, and controls `0,1536,1080,384`. `validate:ui-layouts` also checks exact section rectangles and non-overlap.

### Section background fallback status
Implemented. Combat, puzzle, and controls background layers resolve asset keys through `UiAssetSlotResolver`; missing production art uses fallback or generated placeholder behavior and remains nonfatal.

### Existing UI overlap risks
Known and intentional for UI-4. The legacy BattleScene UI still renders detailed combat HUD, board rails, and controls over the new shell. The shell is a structural layer only; detailed migration is deferred to UI-5, UI-6, and UI-7.

### Known limitations
- No detailed combat HUD was implemented.
- Event log content was not reimplemented.
- Board rails, Hold/Next Queue, right stat cards, inventory indicator, and mobile controls remain on existing BattleScene code.
- Runtime loading of `docs/ui/layouts/screen_battle.layout.json` remains metadata/spec validation only; the shell uses matching constants rather than moving docs JSON into public.

### Next phase recommendation
UI-5 should migrate the combat HUD and event-log strip into `battleShell.combatUiLayer` and `battleShell.eventLogLayer` while preserving the existing combat logic and text ownership.

## UI-5 Battle Combat HUD / Event Log / Monster Stack Audit

### Files created
- `src/game/ui/battle/BattleCombatHud.ts`
- `src/game/ui/battle/BattleEventLog.ts`
- `src/game/ui/battle/MonsterStackPreview.ts`

### Files updated
- `src/game/scenes/BattleScene.ts`
- `src/game/ui/battle/index.ts`
- `docs/ui/layouts/screen_battle.layout.json`
- `scripts/validate-ui-layouts.mjs`
- `docs/ui/BLOCKMANCER_UI_OUTPUT_COMPLETION_AUDIT.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md`
- `docs/ui/codegraph/BLOCKMANCER_UI_COMPONENT_DEPENDENCY_GRAPH.md`

### BattleCombatHud status
Implemented. The HUD attaches to `battleShell.combatUiLayer`, renders inside the `1080x480` combat section, and exposes update methods for header, hero HUD, enemy HUD, status chips, visibility, debug visibility, and bounds debug info. It renders a centered `Stage N — Node X/Y` header, hero/enemy sprites, local HP/MP/shield/status displays, enemy intent/countdown, and a center VFX lane placeholder.

### BattleEventLog status
Implemented. The event log attaches to `battleShell.eventLogLayer`, uses `ui_event_log_strip` with `ui_panel_default` fallback, renders 2-3 compact dynamic text messages, and stays at the bottom of the combat section.

### MonsterStackPreview status
Implemented. The stack preview attaches to `battleShell.combatUiLayer`, renders the active enemy icon, a tucked next enemy icon, and a compact dynamic count/mystery chip when more enemies remain. Missing monster icons remain fallback-safe.

### VFX lane/layer status
Prepared. `BattleScreenShell.combatVfxLayer` remains the named future VFX layer, and `BattleCombatHud.vfxLaneBounds` reserves the center action lane. UI-5 only adds a debug rectangle when debug is enabled.

### BattleScene integration status
Implemented. `BattleScene` creates `BattleCombatHud`, `BattleEventLog`, and `MonsterStackPreview` after the UI-4 shell and updates them from existing run/combat state. The old top-combat HUD objects were removed to avoid overlap; puzzle rails, controls, board logic, combat formulas, and enemy timing were not rewritten.

### Combat section boundary validation
Implemented in `scripts/validate-ui-layouts.mjs`. The validator now checks required UI-5 combat components and verifies combat components, event log, and monster stack remain within `x0 y0 w1080 h480`.

### Fallback asset status
Fallback-safe. UI components use asset keys such as `ui_panel_battle`, `ui_meter_hp`, `ui_meter_mp`, `ui_status_chip`, `ui_event_log_strip`, `ui_monster_stack_chip`, and `ui_monster_stack_mystery_chip` with documented fallback keys and resolver-backed rendering. Missing final PNG art is nonfatal.

### Existing HUD overlap risks
Reduced. Legacy top-combat hero/enemy/stat/log creation was removed from `BattleScene.drawLayout`. Existing hazard tray rendering can still temporarily appear in the combat-log area when hazard warnings are active; that behavior predates UI-5 and remains a known visual-risk area for a later hazard UI pass.

### Known limitations
- Runtime still uses constants matching `screen_battle.layout.json` because docs JSON is not browser-fetchable by the UI-1 loader strategy.
- VFX and damage number behavior are not reimplemented in UI-5.
- Manual portrait-device screenshot QA has not been performed in this audit.

### Next phase recommendation
UI-6 should migrate only the puzzle-section rails and stat cards into shell layers, leaving the board gameplay and controls untouched until their dedicated phases.
