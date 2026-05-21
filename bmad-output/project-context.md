---
project_name: 'Blockmancer Dungeon'
user_name: 'Binh.pc'
date: '2026-05-21'
sections_completed: ['technology_stack', 'engine_rules', 'performance_rules', 'code_organization_rules', 'testing_rules', 'platform_build_rules', 'critical_dont_miss_rules']
existing_patterns_found: 8
status: 'complete'
rule_count: 46
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing game code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Game/runtime: Phaser `^3.90.0`.
- Language/build: TypeScript `^5.8.3`, Vite `^7.0.0`, package `"type": "module"`.
- Mobile shell: Capacitor `^7.0.1` with Android support.
- Test/smoke tooling: Node smoke script at `tests/run-remediation-smoke.mjs`; Playwright `^1.60.0` is installed.
- Primary viewport: portrait-first `720x1280`, Phaser Scale FIT, `pixelArt: true`, `roundPixels: true`, `antialias: false`.
- Canonical docs: start with `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`, then only the focused source-of-truth file for the task.

## Critical Implementation Rules

### Engine-Specific Rules

- Keep the engine path: Phaser 3 + TypeScript + Vite + Capacitor. Do not propose Unity, Unreal, Godot, or engine migration for Release 1 work.
- `BlockmancerGame` owns long-lived systems as readonly fields. Add shared gameplay services there only when they are cross-scene systems; scene-local UI/state belongs in the relevant `src/game/scenes/*Scene.ts`.
- New screens should follow existing Phaser Scene class patterns under `src/game/scenes/` and be registered in `BlockmancerGame.ts`.
- Preserve portrait-mobile layout first. Desktop is a centered preview of the portrait game, not a separate widescreen design.
- Preserve pixel-art rendering. Do not enable antialiasing or derive render sizes from source PNG dimensions.
- Cascade Gravity is the board identity. Do not replace it with classic row shifting; line clears must remove completed lines, apply column gravity, repeat until stable, and return cascade details.

### Performance Rules

- Battle, board, input, and animation code are hot paths. Avoid per-frame allocation-heavy logic in Phaser `update`, board ticks, pointer handlers, and animation/VFX loops.
- Keep board logic deterministic and grid-based. New random behavior should use existing helpers in `src/game/utils/random.ts` or existing system conventions so tests and smoke checks can reproduce behavior.
- Runtime must remain fallback-safe: missing content, missing images, and missing audio may warn during development but must not crash gameplay.
- Stage 1 vertical slice and portrait-mobile smoke stability take priority over broad feature expansion.
- Reactive hazards must be fair: warning first, counter window, no soft-lock, and no simultaneous impossible hazard stack.

### Code Organization Rules

- Source layout:
  - `src/game/scenes/` for Phaser scene flow and UI screens.
  - `src/game/systems/` for gameplay/domain systems.
  - `src/game/content/**` for data-driven JSON content plus `metadata.json`.
  - `src/game/types/` for shared TypeScript contracts.
  - `src/game/data/` for runtime constants, asset manifests, animation definitions, and defaults.
  - `src/game/ui/` for reusable UI widgets.
  - `src/game/utils/` for small shared helpers.
- Content should be data-driven where practical. Add JSON entries and metadata-compatible fields before hardcoding one-off content in scenes.
- Preserve save-facing IDs and runtime asset IDs. Do not rename content IDs, asset keys, route IDs, hero IDs, or save fields without a documented migration.
- `ContentRegistry` resolves content by category and fallback ID. New content categories need explicit registry configuration, typed contracts, metadata, and validation updates.
- Keep current ID style: content IDs are stable snake/kebab-style runtime identifiers such as `hero_milo_blockmancer`, `block_red`, `stage_sprinkle_sewers`; filenames mirror existing folder conventions.
- Source-of-truth precedence:
  - Core design: `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`.
  - Story/routes/dialogue: `docs/02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md`.
  - Hazards/reactive difficulty: `docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md`.
  - Assets/animations: `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md`.
  - Implementation status/backlog: `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`.
  - Asset folder placement: `docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md`.

### Asset and Animation Rules

- Canonical runtime asset root is `public/assets/`. Content JSON references keys, not raw `public/assets/...` paths.
- Legacy flat `spr_` paths and old `_frame_01` names are fallback-only. Do not create them as primary new assets.
- Exact-frame animation files use `{asset_id}__{animation_name}__f00.png`, `f01`, `f02`, etc. No GIFs and no frame ranges.
- Board gameplay blocks are `24x24`; board icons are `48x48`; non-board character/VFX/UI source frames target `627x627`; monster/boss pose sheets target `1254x1254` with `627x627` cells.
- Runtime render size is controlled by category display rules, not image source size.
- Stage asset folders are not interchangeable: `battle/`, `puzzle/`, `boss-arena/`, `map/`, `route-scenes/`, and `props/` have distinct meanings.

### Testing Rules

- Before declaring implementation complete, run the relevant validation commands:
  - `npm run validate:content`
  - `npm run validate:metadata`
  - `npm run validate:animations`
  - `npm run sync:assets`
  - `npm run audit:asset-variants`
  - `npm run build`
  - `npm test`
- `npm test` currently runs `tests/run-remediation-smoke.mjs`; add targeted deterministic smoke assertions there for release-risk fixes unless a broader test harness is introduced.
- High-risk areas need tests or smoke checks: Cascade Gravity, save migrations, route choice resolution, route rewards/risks, ending unlocks, board hazards, boss callbacks, and portrait-mobile layout.
- `validate:animations` may warn on missing final PNG frames while fallback behavior is intentional. Do not mark release art complete until Priority 1 frame warnings are resolved.

### Platform & Build Rules

- Primary product target is portrait mobile. Android/Capacitor commands exist, but normal web build is still `npm run build`.
- Input must support mobile controls and existing keyboard/debug paths where applicable. Do not regress `MobileControls`, hold/next, spell slots, or active run spell binding.
- Android flow:
  - Initialize only if needed with `npm run android:init`.
  - Sync via `npm run android:sync`.
  - Build debug via `npm run android:build:debug`.
- In this Codex sandbox, Vite/esbuild build may require escalated permissions; treat that as environment-specific, not a project defect.

### Critical Don't-Miss Rules

- Tone is cheerful festival / cute chaos. Avoid dark curse lore, grim tragedy, horror, gore, edgy villain framing, skull-heavy UI, or hopeless apocalypse language.
- Player-facing setbacks should be "Oopsies", "Silly Drawbacks", or "Festival Mishaps", not curses.
- Do not treat design docs or prompts as implementation proof. Implementation status must come from current code, validation, smoke tests, or `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`.
- Route story scope is six Release 1 route heroes across six stages: 36 route scenes. Poplin and Bloop are gated out of active Release 1 hero scope unless explicitly changed.
- Route rewards/risks must stay small, explicit, and testable. Unsupported reward/effect types should fail safe and surface clearly in validation or logs.
- Many gameplay effect systems are intentionally switch-limited. Adding content JSON alone does not guarantee runtime behavior; wire and verify handlers in the relevant system.
- Save migration matters. `SaveSystem` and `normalizeRunState` must tolerate older saves and malformed storage without crashing.
- Placeholder assets are runtime-safe but not final art. Do not claim release-ready visuals/audio while placeholders, missing Priority 1 frames, or fallback audio remain.
- Keep legacy compatibility fallbacks unless a migration and validation update prove they can be removed.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing game code.
- Follow the canonical source-of-truth precedence above when task details conflict.
- When in doubt, preserve save compatibility, fallback safety, portrait-mobile readability, and Cascade Gravity behavior.
- Update this file only when project-wide patterns or technology constraints change.

**For Humans:**

- Keep this file lean and focused on non-obvious agent rules.
- Update when the technology stack, asset contract, save model, or source-of-truth structure changes.
- Remove rules that become obsolete or are enforced elsewhere by tests, validation, or tooling.

Last Updated: 2026-05-21
