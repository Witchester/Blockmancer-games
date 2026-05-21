---
title: 'Game Architecture'
project: 'Blockmancer Dungeon'
date: '2026-05-21'
author: 'Binh.pc'
version: '1.0'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
status: 'complete'
engine: 'Phaser 3'
platform: 'Web and Android via Capacitor'

# Source Documents
gdd: 'docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md'
project_context: 'bmad-output/project-context.md'
epics: null
brief: null
---

# Game Architecture

## Document Status

This architecture document was created through the GDS Architecture Workflow.

**Steps Completed:** 9 of 9 (Complete)

---

## Executive Summary

Blockmancer Dungeon will stay on its existing Phaser 3 + TypeScript + Vite + Capacitor stack for Release 1. The architecture prioritizes solo-dev AI-assisted delivery: extend current scenes/systems, protect Cascade Gravity, require runtime handlers for data-driven content, preserve save compatibility, and keep fallback safety separate from release readiness.

## Project Context

### Game Overview

**Blockmancer Dungeon** is a cheerful portrait-mobile falling-block roguelike RPG. The player clears rune block lines, triggers Cascade Gravity combos, casts spells, uses items/relics/upgrades, unlocks heroes, and resolves stage and route story pressure while restoring festival order.

### Technical Scope

**Platform:** Web-first Phaser runtime with Android support through Capacitor.  
**Genre:** Falling-block roguelike RPG with data-driven progression and route-story systems.  
**Project Level:** High release-coordination complexity on a medium-complexity technical stack.

The architecture must optimize for a solo developer using AI agents: small, testable extensions of existing systems; no speculative rewrites; and clear guardrails so AI-generated changes do not drift.

### Core Systems

| System | Complexity | Architectural Need |
| --- | --- | --- |
| Phaser scene flow | Medium | Keep scenes responsible for screen flow, rendering, and input wiring. |
| `BlockmancerGame` system ownership | Medium | Keep long-lived cross-scene services as readonly systems on the game root. |
| Cascade Gravity / board logic | High | Preserve deterministic grid behavior, cascade result shape, and testability. |
| Combat loop | High | Coordinate board clears, enemy pressure, spells, items, rewards, and VFX without overloading `BattleScene`. |
| Content registry / JSON content | High | Keep content data-driven, but require explicit runtime handlers for effect-bearing fields. |
| Route story system | High | Preserve 36 hero-stage scenes, route progress saves, rewards/risks, boss callbacks, and endings. |
| Reactive difficulty / hazards | High | Use one fairness policy: warning, counter window, no soft-lock, no impossible stacking. |
| Save/meta persistence | High | Treat save compatibility as architectural: defaults, normalization, migration, corrupt-save fallback. |
| Asset/audio fallback | Medium | Keep runtime safe while exposing missing final art/audio as release-readiness gaps. |
| Portrait-mobile UI | High | Protect board readability, hold/next, inventory, warnings, dialogue, and spell controls. |
| Android/Capacitor packaging | Medium | Keep web build as primary, then sync/build Android without raw asset path regressions. |

### Technical Requirements

- Continue with Phaser 3 + TypeScript + Vite + Capacitor; the release risk is completion and verification, not engine capability.
- Preserve Cascade Gravity as the game identity. Architecture decisions must not replace it with classic row shifting or route-specific board logic.
- Preserve data-driven content under `src/game/content/**`, backed by `ContentRegistry`, metadata, validation, typed contracts, and runtime consuming systems.
- Preserve stable save-facing IDs and runtime asset keys. Renames require migration and validation updates.
- Keep asset resolution centralized through `AssetSystem`, animation manifests, and canonical `public/assets/` folder rules.
- Route rewards, route risks, boss modifiers, and reactive hazards must all share the same fairness model.
- Every release-risk change needs a verification path: validation command, deterministic smoke assertion, debug hook, or portrait-mobile smoke checklist.

### Complexity Drivers

- **Release-critical breadth:** board, combat, route story, reactive difficulty, saves, assets, and mobile UI all interact.
- **Content without behavior risk:** JSON can validate structurally while runtime behavior remains shallow or unsupported.
- **Fallback masking risk:** placeholders and fallback audio prevent crashes but can hide unfinished release work.
- **Route-risk stacking:** route choices, boss pressure, and hazards can combine into unfair or unreadable board states.
- **Scene/system boundary pressure:** `BattleScene` can become a catch-all if gameplay rules are not kept in systems.
- **Mobile readability:** desktop preview can look acceptable while portrait mobile crowds controls, warnings, and dialogue.
- **Solo-dev maintenance:** broad abstractions or rewrites increase review load and make AI-generated changes harder to control.

### Technical Risks

- Cascade Gravity regressions in chain resolution, special blocks, combat rewards, or board resizing.
- Save shape drift when adding route progress, hazards, settings, meta progression, or new persistent fields.
- Incomplete runtime handlers for spells, items, relics, upgrades, boss rules, and route rewards.
- Missing final Priority 1 animation frames, art, and audio being mistaken for release-ready because fallbacks work.
- Manual smoke coverage gaps for route triggers, route endings, portrait-mobile UI, Android build, and save/load.
- Phaser lifecycle leaks from unmanaged timers, tweens, input listeners, global events, scene events, or VFX objects.

### Solo Dev Architecture Guardrails

- Prefer the smallest extension of existing Phaser scenes/systems over new architectural layers.
- Every content addition must identify the runtime system that consumes it.
- Every new persistent field requires a default, normalization path, and migration strategy.
- Every visual/audio asset addition must use stable runtime keys and canonical `public/assets/` folders.
- Every hazard, route risk, boss modifier, or board pressure feature must use the shared fairness policy.
- Every UI change touching battle, route dialogue, inventory, warning tray, or controls requires portrait-mobile smoke coverage.
- Gameplay systems should compute state; scenes should render and orchestrate it.
- Save through normalized paths and avoid writing high-frequency transient visual state.
- New timers, tweens, input listeners, global events, and scene events must clean up on shutdown/restart.

### Architecture Decision Seeds

1. **Keep Phaser 3 + TypeScript + Vite + Capacitor.** Current implementation is buildable and validation-clean; changing engines would slow Release 1.
2. **Use the existing scene/system architecture.** `BlockmancerGame` owns long-lived systems; scenes own flow and UI.
3. **Protect Cascade Gravity.** It is core to board identity, combat, rewards, hazards, and tests.
4. **Use content-driven JSON with explicit runtime handlers.** Validation alone is not enough for effect-bearing content.
5. **Separate fallback safety from release readiness.** Runtime fallback prevents crashes; release docs/checklists must still expose missing final assets/audio.
6. **Use one shared fairness policy.** Hazards, route risks, and boss pressure need warning, counterplay, and no soft-lock behavior.
7. **Make save compatibility architectural.** Route progress, hazards, settings, and meta progression are save-facing.
8. **Optimize for AI-assisted solo iteration.** Prefer small, testable, reviewable changes and explicit rationale for any larger departure.

### Comparative Architecture Direction

| Option | Fit for This Project | Decision |
| --- | --- | --- |
| Extend current Phaser scene/system architecture | Best fit; aligns with current code, docs, and solo-dev maintenance | Adopt |
| Add a new architectural framework/layer | Adds coordination overhead and increases AI drift risk | Avoid unless duplication proves need |
| Engine migration | Does not address current release risks | Reject for Release 1 |
| Content-only expansion | Fast, but risks validated content with no behavior | Allow only with runtime handler verification |
| Full rewrite/refactor | High solo-dev cost and high regression risk | Avoid |

## Engine & Framework

### Selected Engine

**Phaser 3** via `phaser@^3.90.0`, with TypeScript, Vite, and Capacitor.

**Rationale:** The current project is already implemented around Phaser scenes, a TypeScript/Vite build, and Capacitor Android packaging. Current Phaser documentation lists Phaser v4 API availability, and the official Phaser Vite TypeScript template has moved toward Phaser 4, but this project's release risk is completion, verification, assets, and mobile polish. Upgrading or migrating the engine before Release 1 would increase solo-dev risk without solving the known blockers.

### Project Initialization

No new starter template should be applied. The repo already has the needed project structure:

```text
index.html
src/main.ts
src/game/
public/assets/
vite.config.ts
capacitor.config.ts
package.json
```

Use the existing scripts:

```bash
npm run dev
npm run build
npm test
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run android:sync
npm run android:build:debug
```

### Engine-Provided Architecture

| Component | Solution | Notes |
| --- | --- | --- |
| Rendering | Phaser WebGL/Canvas via `Phaser.AUTO` | Project config uses pixel-art settings: `pixelArt`, `roundPixels`, no antialiasing. |
| Scene management | Phaser Scene lifecycle | Existing scenes under `src/game/scenes/` define menu, map, battle, route dialogue, reward, settings, debug, and ending flow. |
| Game object model | Phaser GameObjects | Scenes own visual objects, VFX, text, controls, and event/tween lifecycles. |
| Asset loading | Phaser Loader plus project `AssetSystem` | Runtime asset policy is centralized around keys, manifests, exact-frame definitions, and fallbacks. |
| Input | Phaser input plus project `InputSystem` / `MobileControls` | Must preserve keyboard/debug paths and touch controls. |
| Audio | Phaser/browser audio plus project `AudioSystem` | Missing audio uses synthesized/fallback cues; final release audio remains separate. |
| Build system | Vite + TypeScript | `npm run build` runs `tsc --noEmit && vite build`. |
| Mobile packaging | Capacitor Android | `capacitor.config.ts` uses `webDir: 'dist'` and app id `com.blockmancer.dungeon`. |

### Remaining Architectural Decisions

- Exact boundaries between scenes and gameplay systems, especially for `BattleScene`.
- Runtime handler requirements for effect-bearing JSON content.
- Save migration policy for run state, route progress, hazards, settings, and meta progression.
- Shared fairness policy for route risks, hazards, boss modifiers, and board pressure.
- Test/smoke strategy for Cascade Gravity, saves, route outcomes, mobile UI, and Android packaging.
- Asset-release strategy separating fallback safety from production readiness.
- Lifecycle cleanup standards for Phaser timers, tweens, listeners, global events, and VFX objects.

### Starter Template Decision

Do not adopt a new Phaser template. Official Phaser templates exist for Vite and TypeScript, but this project has already diverged into a mature game-specific structure. Re-templating would create churn in `src/game`, `public/assets`, validation scripts, and Capacitor wiring.

### AI Development Tooling

- **Context7 MCP** is recommended for current library documentation lookup. It provides up-to-date, version-specific docs and code examples for libraries such as Phaser, Vite, Capacitor, and Playwright.
- **Phaser Editor v5 MCP Server** is optional. It is included with Phaser Editor v5 and can help AI tools manage Phaser Editor scene/assets workflows, but it is tied to a running Phaser Editor desktop app and is not a replacement for direct source-code editing.
- No Unity/Godot/Unreal MCP is relevant because the selected engine is Phaser.

### Engine Decision Guardrail

Any future proposal to move to Phaser 4, another Phaser template, PixiJS, Godot, Unity, or another engine must explicitly prove that it reduces Release 1 risk more than it increases migration, verification, and solo-maintenance cost.

## Architectural Decisions

### Decision Summary

| Category | Decision | Version / Scope | Rationale |
| --- | --- | --- | --- |
| Engine | Stay on Phaser 3 + TypeScript + Vite + Capacitor | Phaser `^3.90.0`, Vite `^7.0.0`, Capacitor `^7.0.1` | Current code is already built around this stack; Release 1 risk is verification and completion, not engine capability. |
| State management | Root game owns long-lived systems; scenes orchestrate flow and rendering | `BlockmancerGame` + `src/game/systems/*` | Matches current architecture and keeps solo-dev changes small. |
| Board logic | Keep deterministic custom board system | `BoardSystem` / Cascade Gravity | Falling-block rules are domain-specific and should not be delegated to Phaser physics. |
| Persistence | Versioned local JSON storage with migrations and normalization | `SaveSystem`, `normalizeRunState` | Offline-first web/mobile game; no backend/cloud requirement for Release 1. |
| Content architecture | Data-driven JSON with explicit runtime handlers | `src/game/content/**`, `ContentRegistry` | Enables content scale while preventing "valid content that does nothing." |
| Asset management | Centralized asset manifest/fallback strategy | `AssetSystem`, `assets.ts`, `animations.ts` | Missing assets must not crash gameplay, but release readiness must still track placeholders. |
| Scene structure | Keep one scene per major flow/screen | `src/game/scenes/*Scene.ts` | Phaser scenes are the natural state boundary; avoids a new router layer. |
| UI framework | Phaser GameObjects and existing UI helpers | `src/game/ui/*` | Keeps mobile UI inside the game canvas and avoids DOM/game sync complexity. |
| Input | Existing input systems plus touch controls | `InputSystem`, `MobileControls` | Must preserve keyboard/debug and portrait-touch paths. |
| Audio | Existing key-based audio system with fallback cues | `AudioSystem` | Keeps runtime safe while final audio production remains trackable. |
| Networking | None for Release 1 | Single-player/local | No multiplayer requirement appears in source docs; adding networking would be pure scope expansion. |
| Testing | Validation scripts plus deterministic smoke tests | `npm test`, validation scripts | High-risk systems need concrete smoke coverage before release claims. |

### State Management

**Approach:** Root-owned domain systems plus scene orchestration.

`BlockmancerGame` remains the composition root for shared systems such as save, map, reward, content-facing gameplay systems, asset/audio, route story, settings, and stage goals. Scenes should request work from systems and render the results. New cross-scene gameplay capabilities should become systems only when they are genuinely reused or save-facing.

Avoid Redux-style global state, ECS, or a new event bus for Release 1. They add coordination cost and do not address current blockers.

### Data Persistence

**Save System:** Local JSON storage through the existing `SaveSystem`.

All persistent changes must provide:

- Default values for new fields.
- Normalization in default run/meta construction.
- Migration from older save shapes.
- Corrupt-save fallback that clears or repairs safely.
- Smoke coverage for route progress, hazards, endings, and settings if touched.

Do not store transient VFX, temporary Phaser objects, active tweens, frame timers, or visual-only state in saves.

### Asset Management

**Loading Strategy:** Centralized key-based resolution with scene/runtime fallback.

Use `AssetSystem`, `assets.ts`, `animations.ts`, `asset-display-rules.ts`, and the canonical `public/assets/` contract. Content JSON should reference keys, not raw asset paths. Exact-frame animation imports must follow the `asset_id__animation_name__f00.png` convention.

Fallbacks are a crash-safety mechanism, not a release-quality signal. Architecture and QA docs must continue to expose missing Priority 1 frames, placeholder visuals, and fallback audio.

### Content and Effect Handling

Every content addition must name the runtime consumer:

- Combat/effects: `CombatSystem`, `SpellSystem`, `ItemSystem`, `RelicSystem`, `UpgradeSystem`, `GameplayEffectSystem`.
- Routes: `RouteStorySystem`, `RouteDialogueScene`, `RewardScene`, `VictoryScene`, `MetaSystem`.
- Hazards/reactive difficulty: `BattleScene`, `DifficultySystem`, `OopsieSystem`, `BoardSizeModifierSystem`, relevant item/spell systems.
- Stage goals/objectives: `StageGoalSystem`, `BattleObjectiveSystem`.

Effect-bearing JSON is not complete until the consuming system supports it and validation or smoke tests cover it.

### Scene Structure

Keep Phaser scenes as user-flow boundaries:

- `BootScene` loads foundational assets.
- Menu/settings/help/tutorial/collection scenes own non-battle screens.
- `MapScene`, `BattleScene`, `RewardScene`, `RouteDialogueScene`, and ending scenes own run flow.
- `DebugScene` owns dev-only setup and forcing tools.

`BattleScene` is allowed to orchestrate battle UI, controls, warnings, and VFX, but gameplay rules should move into systems when they become reusable, save-facing, or shared with route/boss/stage logic.

### UI and Input

Use Phaser GameObjects and existing UI helpers. Keep portrait-mobile as the primary layout target:

- Board remains central and readable.
- Hold, next, inventory, warnings, spell controls, and dialogue must remain visible/tappable.
- Any route dialogue, warning tray, inventory, or battle control change requires portrait-mobile smoke verification.

Input must preserve both keyboard/debug controls and touch/mobile controls.

### Reactive Difficulty and Fairness

All route risks, boss modifiers, hazards, and board pressure use one policy:

- Warn before impact.
- Provide a counter window where appropriate.
- Avoid unavoidable loss states.
- Avoid stacking impossible simultaneous pressures.
- Queue or defer risk if the warning tray or board state cannot absorb it fairly.
- Preserve Cascade Gravity timing and board invariants.

### Performance and Lifecycle

Performance-sensitive areas are board/cascade resolution, `BattleScene` update work, warning tray/VFX, route dialogue, exact-frame animation, and save/load.

Rules:

- Keep board computation deterministic and free of rendering work.
- Avoid allocation-heavy per-frame logic in scene `update`, pointer handlers, and board ticks.
- Clean up timers, tweens, input listeners, global events, scene events, and temporary GameObjects on shutdown/restart.
- Save deliberately through normalized paths; do not write high-frequency transient state.
- Prefer reuse of lightweight UI/VFX helpers where practical.

### Deployment

Primary build remains web:

```bash
npm run build
```

Android is packaged through Capacitor after the web build:

```bash
npm run android:sync
npm run android:build:debug
```

Capacitor uses `dist` as `webDir`. Android validation must include app launch, portrait layout, touch controls, save/load, and asset path checks.

### Architecture Decision Records

#### ADR-001: Keep Current Phaser Stack for Release 1

**Decision:** Stay on Phaser 3 + TypeScript + Vite + Capacitor.  
**Rationale:** The existing game is already implemented on this stack. Current blockers are content/effect completion, assets/audio, tests, manual smoke, and mobile polish.  
**Consequence:** No engine migration or template reset before Release 1.

#### ADR-002: Protect Cascade Gravity as Core Domain Logic

**Decision:** Keep Cascade Gravity in custom deterministic board logic.  
**Rationale:** It defines the game's identity and touches combat, rewards, hazards, route effects, stage goals, and tests.  
**Consequence:** Phaser physics is not used for board resolution.

#### ADR-003: Require Runtime Consumers for Effect Content

**Decision:** Data-driven JSON remains the content model, but every effect-bearing field needs a consuming runtime system.  
**Rationale:** Validation can prove structure, not behavior.  
**Consequence:** Content-only changes cannot be marked complete when runtime support is missing.

#### ADR-004: Treat Fallback Safety and Release Readiness Separately

**Decision:** Missing assets/audio must fall back safely, but fallback usage must stay visible in release tracking.  
**Rationale:** Placeholder-safe runtime protects development velocity but can hide unfinished production work.  
**Consequence:** Release readiness requires asset/audio verification beyond "game does not crash."

#### ADR-005: Make Save Compatibility a Required Design Constraint

**Decision:** New persistent state requires defaults, normalization, migration, and smoke coverage.  
**Rationale:** Run state, route progress, hazards, settings, and meta progression are save-facing.  
**Consequence:** Save schema changes must be reviewed as architectural changes, not incidental implementation detail.

## Cross-cutting Concerns

These patterns apply to all systems and must be followed by every implementation.

### Error Handling

**Strategy:** Fallback-safe local handling for recoverable runtime issues; explicit normalization/clear for corrupted persistence; developer-visible warnings for missing content/assets.

**Error Levels:**

- **Recoverable runtime issue:** Use fallback behavior and continue gameplay.
- **Corrupt persisted state:** Normalize if possible; otherwise clear the bad save and return to a safe default.
- **Unsupported content effect:** Return a clear placeholder result or warning; do not crash.
- **Invalid layout/asset state:** Log a dev warning and use compact/fallback layout or placeholder asset.
- **Fatal programmer error:** Let TypeScript/build/tests catch it; do not hide it behind broad catch blocks unless gameplay recovery is intentional.

**Example:**

```ts
export function readJsonStorage<T>(key: string): T | null {
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}
```

### Logging

**Format:** Plain console messages with subsystem prefixes for developer-facing diagnostics.  
**Destination:** Browser/dev console and in-game event log where player-facing feedback is useful.

**Log Levels:**

- `console.warn`: Missing assets/content, unsupported effect handlers, invalid layouts, fallback paths.
- `console.log`: Temporary diagnostics only; remove or gate behind `import.meta.env.DEV` before release.
- In-game `eventLog` / combat log: player-readable gameplay consequences only.
- No trace-level logging in board ticks, scene `update`, or hot animation paths.

**Example:**

```ts
if (!hasExactMatch && import.meta.env.DEV) {
  console.warn(`[ContentRegistry] Unknown monster lookup "${id}". Falling back.`);
}
```

### Configuration

**Approach:** Split configuration by volatility and ownership.

- Immutable technical constants: `src/game/data/constants.ts` and `src/game/utils/constants.ts`.
- Player settings: `SettingsSystem`, `MetaSystem`, and local storage.
- Content/balance: JSON entries under `src/game/content/**` with `metadata.json`.
- Assets/animations: `src/game/data/assets.ts`, `src/game/data/animations.ts`, `src/game/data/animation-standards.json`, and canonical `public/assets/` folders.
- Platform/build: `vite.config.ts`, `capacitor.config.ts`, and npm scripts.

**Example:**

```ts
export const SAVE_VERSION = 6;
export const DEFAULT_STAGE = 1;
export const DEFAULT_FALL_SPEED = 1.0;
```

### Event and Communication Pattern

**Pattern:** Direct typed method calls between root-owned systems and scenes. Use Phaser scene events only for scene-local lifecycle or UI events. Avoid adding a global event bus for Release 1.

**Naming:**

- Scene classes: `*Scene`.
- Systems: `*System`.
- Content IDs: stable save-facing ids such as `hero_milo_blockmancer`, `block_red`, `stage_sprinkle_sewers`.
- Warning/hazard IDs: explicit ids such as `hazard_freeze_warning`.

**Example:**

```ts
const message = this.gameState.rewardSystem.applyReward(this.ensureRun(), reward.id);
this.gameState.saveRun();
this.updateStatus(message);
```

### Debug and Development Tools

**Available Tools:**

- `DebugScene` for dev-only run setup, stage jumps, rewards, monsters, bosses, hazards, route rewards/risks, animation QA, and save clearing.
- Validation scripts for content, metadata, animations, asset sync, and asset variants.
- `npm test` smoke harness for deterministic remediation checks.

**Activation:**

- `DebugScene` must remain dev-only via `import.meta.env.DEV`.
- Debug controls must not become required for normal gameplay.
- New release-risk systems should add debug forcing hooks when manual setup would be slow or brittle.

**Example:**

```ts
create(): void {
  if (!import.meta.env.DEV) {
    this.scene.start('MainMenuScene');
    return;
  }
  this.updateStatus('Debug tools ready.');
}
```

### Mandatory Cross-system Rules

- Missing content/assets/audio must never crash gameplay.
- Unsupported effects must be visible to developers and safe for players.
- New persistent fields require save migration and normalization.
- New content must be paired with runtime behavior and validation/smoke coverage.
- New UI/VFX listeners, timers, tweens, and temporary objects must clean up on scene shutdown or restart.
- Player-facing text must preserve the cheerful festival tone.

## Project Structure

### Organization Pattern

**Pattern:** Hybrid by file type with domain-specific systems and data-driven content.

**Rationale:** The current Phaser project already separates scenes, systems, content, data, types, UI, and utilities. This is the clearest structure for AI agents because each change type has an obvious home and the solo-dev workflow avoids feature-folder churn.

### Directory Structure

```text
Blockmancer Dungeon/
  index.html
  package.json
  vite.config.ts
  capacitor.config.ts
  src/
    main.ts
    styles.css
    game/
      BlockmancerGame.ts
      content/
        battle-objectives/
        board-blocks/
        boss-rules/
        chaos-rules/
        difficulty-scaling/
        heroes/
        items/
        loot-tables/
        monsters/
        random-gameplay-events/
        relics/
        room-events/
        spells/
        stage-goals/
        stages/
        story/routes/
        upgrades/
        weapons/
      data/
        animation-standards.json
        animations.ts
        asset-display-rules.ts
        assets.ts
        constants.ts
        defaultRunState.ts
      scenes/
      systems/
      types/
      ui/
      utils/
  public/
    assets/
      audio/
      backgrounds/
      board-blocks/
      effects/
      fonts/
      icons/
      placeholders/
      portraits/
      sprites/
      stages/
      story/
      ui/
  scripts/
  tests/
  docs/
  bmad-output/
```

### System Location Mapping

| System | Location | Responsibility |
| --- | --- | --- |
| Game composition | `src/game/BlockmancerGame.ts` | Phaser config, scene registration, shared system ownership, run lifecycle. |
| Scene flow and UI screens | `src/game/scenes/*Scene.ts` | Menus, map, battle, route dialogue, rewards, shop, settings, debug, endings. |
| Board and Cascade Gravity | `src/game/systems/BoardSystem.ts` | Grid state, pieces, hold/next, line clears, gravity, special blocks. |
| Combat | `src/game/systems/CombatSystem.ts` | Damage, mana, cascade reward resolution, battle calculations. |
| Content registry | `src/game/systems/ContentRegistry.ts` | Loading JSON content, metadata, lookup, fallbacks. |
| Route story | `src/game/systems/RouteStorySystem.ts` and `src/game/content/story/routes/` | Route triggers, choices, rewards, risks, callbacks, endings. |
| Save/meta | `src/game/systems/SaveSystem.ts`, `MetaSystem.ts`, `data/defaultRunState.ts` | Local persistence, migration, normalization, meta progress. |
| Assets/audio | `src/game/systems/AssetSystem.ts`, `AudioSystem.ts`, `src/game/data/assets.ts`, `animations.ts` | Runtime asset/audio lookup, manifests, fallback behavior. |
| Reactive difficulty | `DifficultySystem.ts`, `OopsieSystem.ts`, `ItemSystem.ts`, `BattleScene.ts` | Hazard warnings, counters, route risk pressure, soft-lock prevention. |
| Rewards/economy | `RewardSystem.ts`, `InventorySystem.ts`, `ShopSystem.ts` | Loot, items, relics, upgrades, shop flow. |
| Stage and objectives | `StageSystem.ts`, `StageGoalSystem.ts`, `BattleObjectiveSystem.ts` | Stage data, goals, battle objectives, boss consequences. |
| Reusable UI widgets | `src/game/ui/` | Buttons, cards, HUD, event log, mobile controls, progress bars. |
| Shared contracts | `src/game/types/` | TypeScript interfaces and union types for run state, content, settings, meta. |
| Utilities | `src/game/utils/` | Layout, math, random, storage, constants. |
| Validation and asset scripts | `scripts/*.mjs` | Content validation, metadata validation, animation validation, asset sync/audit. |
| Smoke tests | `tests/` | Deterministic Node smoke harnesses. |
| Canonical docs | `docs/` | Source-of-truth product, gameplay, asset, release, and folder-structure docs. |

### Naming Conventions

#### Files

- Phaser scenes: `PascalCase` ending in `Scene.ts`, e.g. `BattleScene.ts`, `RouteDialogueScene.ts`.
- Systems: `PascalCase` ending in `System.ts`, e.g. `SaveSystem.ts`, `RouteStorySystem.ts`.
- Types: `PascalCase` ending in `Types.ts`, e.g. `GameTypes.ts`.
- UI helpers: `PascalCase.ts`, e.g. `Button.ts`, `MobileControls.ts`.
- Content JSON files: kebab-case descriptive filenames in category folders, e.g. `stage1-lost-cupcakes.json`.
- Scripts/tests: kebab-case `.mjs`, e.g. `validate-content-data.mjs`.

#### Code Elements

| Element | Convention | Example |
| --- | --- | --- |
| Classes | PascalCase | `BoardSystem`, `BattleScene` |
| Methods/functions | camelCase | `applyRouteReward`, `createDefaultRunState` |
| Variables/properties | camelCase | `activeHazards`, `routeProgress` |
| Constants | UPPER_SNAKE or exported Pascal-style semantic constants | `SAVE_VERSION`, `DEFAULT_STAGE` |
| Type aliases/interfaces | PascalCase | `RunState`, `ActiveHazardState` |
| Content IDs | Stable snake/kebab-like runtime IDs | `hero_milo_blockmancer`, `block_red` |
| Animation IDs | Prefixed runtime keys | `anim_block_sticky_sticky_warning` |

### Game Asset Naming

- Static runtime sprites use stable runtime keys such as `block_red.png`, `hero_milo_blockmancer.png`, and `item_mana_lemonade.png`.
- Exact-frame animation files use `{asset_id}__{animation_name}__f00.png`, `f01`, `f02`.
- Content JSON references asset keys, not raw `public/assets/...` paths.
- Legacy `spr_` and `_frame_01` naming is fallback-only.

### Architectural Boundaries

- Do not put persistent gameplay rules directly in scenes when a system owns that domain.
- Do not add content categories without `ContentRegistry`, type, metadata, validation, and runtime consumer updates.
- Do not create new primary asset folders outside `public/assets/` canonical structure.
- Do not rename save-facing IDs without a migration.
- Do not put release-planning facts in code comments; update the relevant source-of-truth doc.
- Do not add broad abstractions unless they remove real duplication across multiple systems.

## Implementation Patterns

These patterns ensure consistent implementation across AI agents.

### Novel Patterns

#### Cascade Gravity Domain Pattern

**Purpose:** Preserve the game's core board identity while allowing combat, rewards, hazards, and route effects to react to line clears.

**Components:**

- `BoardSystem`: owns grid mutation, piece state, line detection, gravity, and cascade result.
- `CombatSystem`: consumes cascade result for damage, mana, and combat effects.
- `BattleScene`: renders board/VFX and orchestrates player/enemy turns.
- Reward/hazard systems: may request board effects through safe helpers, never by replacing cascade behavior.

**Data Flow:**

```text
piece lock -> BoardSystem clear/cascade -> CascadeResult -> CombatSystem rewards/damage -> BattleScene render/log/save
```

**Implementation Guide:**

```ts
const result = boardSystem.clearLinesCascade();
const combatResult = combatSystem.resolveCascadeClear(runState, result);
this.combat.addLog(combatResult.message);
this.gameState.saveRun();
```

**Usage:** Use this pattern for any feature that changes line clears, special blocks, cascade rewards, stage goals, or board hazards.

#### Route Risk Fairness Pattern

**Purpose:** Keep route story risks, boss pressure, and reactive hazards readable and fair.

**Components:**

- `RouteStorySystem`: resolves choice, reward, risk, route progress, and modifiers.
- `BattleScene`: owns warning tray presentation and hazard countdown interaction.
- `ItemSystem` / `SpellSystem`: provide counters.
- `SaveSystem`: persists non-battle-only route modifiers and route progress.

**Data Flow:**

```text
route choice -> reward/risk config -> RouteStorySystem -> active hazard/modifier queue -> BattleScene warning/counter flow
```

**Implementation Guide:**

```ts
const message = routeStorySystem.applyRouteRisk(runState, riskConfig);
if (message) {
  runState.eventLog.unshift(message);
}
game.saveRun();
```

**Usage:** Use this pattern for route choices, boss callbacks, hazard modifiers, and risky rewards.

#### Content Contract Pattern

**Purpose:** Prevent data-driven content from validating structurally while doing nothing at runtime.

**Components:**

- Content JSON and `metadata.json`.
- Type definitions in `src/game/types/`.
- `ContentRegistry`.
- Runtime consuming system.
- Validation script and smoke/debug hook.

**Data Flow:**

```text
content JSON -> metadata/type contract -> ContentRegistry -> runtime system handler -> validation/smoke coverage
```

**Implementation Guide:**

```ts
const item = contentRegistry.getItem(itemId);
const message = item ? itemSystem.applyItem(runState, item.id) : 'Item fallback used safely.';
```

**Usage:** Use this pattern for spells, items, relics, upgrades, bosses, objectives, hazards, route rewards, and stage goals.

### Communication Patterns

**Pattern:** Direct typed calls for systems; Phaser events only for scene-local lifecycle/UI behavior.

**Example:**

```ts
const rewardMessage = this.gameState.rewardSystem.applyReward(this.gameState.runState, reward.id);
this.gameState.saveRun();
this.combat.addLog(rewardMessage);
```

Avoid new global event buses for Release 1 unless multiple systems need decoupled asynchronous communication and direct calls become demonstrably brittle.

### Entity and Content Creation Patterns

**Creation:** Data lookup plus runtime construction.

- Monsters, heroes, stages, items, spells, relics, upgrades, and route scenes come from JSON content.
- Runtime instances are created by systems/scenes from content entries.
- Assets are resolved by key through `AssetSystem`.

**Example:**

```ts
const monster = contentRegistry.getMonster(monsterId);
if (!monster) {
  return this.gameState.enemySystem.createFallbackEnemy();
}
this.gameState.runState.activeEnemy = this.gameState.enemySystem.createEnemy(monster.id);
```

### State Transition Patterns

**Pattern:** Explicit run status, scene transitions, and system-owned state mutation.

- Scene changes use Phaser scene transitions.
- Run progress is stored on `RunState`.
- Meta progress is stored on `MetaState`.
- Save after meaningful player/run changes, not after transient rendering changes.

**Example:**

```ts
this.gameState.runState.runStatus = 'map';
this.gameState.saveRun();
this.scene.start('MapScene');
```

### Data Access Patterns

**Access:** Use centralized systems and typed helpers, not scattered file or localStorage access.

- Content: `ContentRegistry`.
- Saves/settings: `SaveSystem`, `SettingsSystem`, `MetaSystem`.
- Assets/audio: `AssetSystem`, `AudioSystem`.
- Constants/defaults: `src/game/data/*` and `src/game/utils/constants.ts`.

**Example:**

```ts
const stage = contentRegistry.getStage(stageId);
const textureKey = this.gameState.assetSystem.getStageBattleBackground(stage?.id).key;
```

### Consistency Rules

| Pattern | Convention | Enforcement |
| --- | --- | --- |
| New scene | Add `*Scene.ts`, register in `BlockmancerGame.ts`, keep flow/UI there | Build and manual navigation smoke |
| New system | Add `*System.ts`, instantiate in `BlockmancerGame.ts` only if cross-scene/shared | Code review |
| New content category | Add JSON folder, `metadata.json`, type contract, `ContentRegistry` config, validation | `npm run validate:content`, `npm run validate:metadata` |
| New effect content | Add runtime handler and smoke/debug path | `npm test` or DebugScene/manual smoke |
| New persistent state | Add defaults, normalization, migration, corrupt-save handling | Save migration smoke |
| New asset | Use canonical path and runtime key | `npm run sync:assets`, `npm run audit:asset-variants` |
| New animation | Use exact-frame naming and manifest definition | `npm run validate:animations` |
| New hazard/risk | Use shared warning/counter/no-soft-lock policy | DebugScene hazard smoke |
| New mobile UI | Preserve board, hold/next, inventory, warnings, spell controls | Portrait-mobile screenshot/manual smoke |

## Architecture Validation

### Validation Summary

| Check | Result | Notes |
| --- | --- | --- |
| Decision Compatibility | Pass | Phaser 3, scene/system structure, local saves, fallback assets, and no-networking scope align. |
| GDD Coverage | Pass | Core GDD systems are covered: Cascade Gravity, combat, map, rewards, route story, reactive hazards, saves, assets, audio, and portrait-mobile UI. |
| Pattern Completeness | Pass | Communication, entity/content creation, state transitions, data access, error handling, logging, config, debug tools, and lifecycle cleanup are defined. |
| Feature Mapping | Pass | Major release features map to `scenes`, `systems`, `content`, `data`, `types`, `ui`, `utils`, `public/assets`, `scripts`, and `tests`. |
| Document Completeness | Pass with explicit deferrals | API/auth/backend/cloud decisions are not applicable for Release 1 because the architecture is single-player/local-state. |

### Coverage Report

**Systems Covered:** 11/11 major architecture areas.

- Phaser scene flow
- Root-owned systems
- Board and Cascade Gravity
- Combat and rewards
- Content registry and JSON content
- Route story and route risk handling
- Reactive difficulty and hazards
- Save/meta persistence
- Asset/audio fallback
- Portrait-mobile UI
- Android/Capacitor packaging

**Patterns Defined:** 9.

- Cascade Gravity domain pattern
- Route risk fairness pattern
- Content contract pattern
- Communication pattern
- Entity/content creation pattern
- State transition pattern
- Data access pattern
- Cross-cutting error/log/config/debug patterns
- Consistency rules for new scenes, systems, content, effects, saves, assets, animations, hazards, and mobile UI

**Decisions Made:** 12 primary decisions plus 5 ADRs.

### Issues Resolved

- Added explicit solo-dev guardrails to avoid broad rewrites and speculative abstractions.
- Added fallback-vs-release-readiness distinction so placeholders do not mask production gaps.
- Added fairness policy for route risks, hazards, boss modifiers, and board pressure.
- Added save migration/normalization as a mandatory architectural rule.
- Added lifecycle cleanup rules for Phaser timers, tweens, listeners, events, and temporary objects.
- Cleaned non-ASCII quote characters from the architecture file.

### Validation Date

2026-05-21

## Development Environment

### Prerequisites

- Node.js and npm compatible with the current Vite/TypeScript toolchain.
- Existing project dependencies installed from `package-lock.json`.
- Browser for local web testing.
- Android Studio / Android SDK only when building or testing the Capacitor Android project.
- Optional: Phaser Editor v5 if using its MCP server or visual scene tooling.

### AI Tooling (MCP Servers)

| MCP Server | Purpose | Install Type |
| --- | --- | --- |
| Context7 | Current, version-specific documentation lookup for Phaser, Vite, Capacitor, Playwright, and related libraries. | `npx` or Docker MCP server |
| Phaser Editor v5 MCP Server | Optional access to Phaser Editor scene/assets workflows when using the Phaser Editor desktop app. | Included with Phaser Editor v5 |

**Setup Notes:**

- Context7 can be added later to the AI client used for coding. It is recommended because this architecture intentionally depends on current library behavior.
- Phaser Editor MCP is optional and only useful if the project is opened in Phaser Editor v5. Source-code changes should still follow this architecture document.

### Setup Commands

```bash
npm install
npm run dev
npm run build
npm test
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
```

### Android Commands

```bash
npm run android:init
npm run android:sync
npm run android:build:debug
```

### First Steps for AI Agents

1. Read `bmad-output/project-context.md`.
2. Read `bmad-output/game-architecture.md`.
3. Read `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`.
4. Read only the focused source-of-truth doc relevant to the task.
5. Implement the smallest safe change that follows the architecture boundaries.
6. Run the relevant validation/smoke commands before claiming completion.

## Handoff Guidance

### Ready For

- `gds-create-epics-and-stories`
- `gds-check-implementation-readiness`
- Focused implementation stories using `gds-dev-story` or `gds-quick-dev`

### Next Workflow Input

Use these documents as inputs for epic/story creation:

- `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`
- `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`
- `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`
- `bmad-output/project-context.md`
- `bmad-output/game-architecture.md`

### Implementation Priority Reminder

The architecture points toward Release 1 stabilization, not broad expansion:

- Deterministic Cascade Gravity tests/smoke.
- Save migration and route progress verification.
- Route reward/risk and ending smoke coverage.
- Portrait-mobile battle and route dialogue smoke.
- Priority 1 asset/audio replacement tracking.
- Runtime handlers for effect-bearing content.
