---
project_name: 'New folder'
user_name: 'Binh.pc'
date: '2026-05-14T14:24:30+07:00'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 31
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Runtime: browser-based TypeScript game using Phaser `^3.90.0`.
- Build tooling: Vite `^7.0.0`, TypeScript `^5.8.3`, ESM package mode via `"type": "module"`.
- Mobile shell: Capacitor core/CLI/Android `^7.0.1`, app id `com.blockmancer.dungeon`, `webDir` is `dist`.
- UI font dependency: `@fontsource/vt323` `^5.2.7`.
- Browser automation dependency: Playwright `^1.60.0`; no formal test runner is configured.
- Primary scripts: `npm run build`, `npm run validate:metadata`, `npm run validate:content`, `npm run dev`, `npm run android:sync`.

## Critical Implementation Rules

### Language-Specific Rules

- Keep TypeScript strict-compatible: `strict`, `isolatedModules`, `resolveJsonModule`, and bundler module resolution are enabled.
- Do not rely on emitted TypeScript output; `tsconfig` uses `noEmit`, and builds run `tsc --noEmit && vite build`.
- Preserve ESM import style and explicit local module boundaries. Avoid CommonJS in `src`.
- Run state must remain JSON-serializable because saves use localStorage through `SaveSystem`.
- Use existing domain types in `src/game/types` before introducing new ad hoc shapes.
- Keep IDs stable across save data, content JSON, and systems; migrations belong near default run-state normalization/save handling.

### Framework-Specific Rules

- Phaser scenes live in `src/game/scenes` and should orchestrate rendering, input, and transitions; persistent logic belongs in systems.
- Global game services are instantiated on `BlockmancerGame`; scenes should access shared systems there instead of creating divergent singletons.
- The game is portrait-first at `720x1280` with `Phaser.Scale.FIT`; new UI must account for mobile portrait layout and safe readable spacing.
- Keep scene routing aligned with `RunState.runStatus`, `currentRoomType`, and save/continue behavior.
- Board behavior is deterministic grid logic, not physics. Preserve predictable column-collapse cascade behavior unless explicitly changing the design.
- Orientation lock in `main.ts` is best-effort only; do not assume it succeeds on all devices.

### Content & Data Rules

- Content JSON lives under `src/game/content/<category>` with one `metadata.json` per category.
- Every content data file must include string `id`, string `name`, and `enabled`; content IDs must match folder prefixes enforced by `scripts/validate-content-data.mjs`.
- Content metadata must include the required descriptor keys enforced by `scripts/validate-content-metadata.mjs`.
- Prefer `ContentRegistry` lookups and typed content-facing systems over hardcoded tables for new production content.
- When adding a new content category, update `ContentTypes`, `ContentRegistry`, validation prefix rules, and docs together.
- Disabled content should remain loadable via optional lookup but should not appear in enabled lists or gameplay rolls.

### Testing Rules

- At minimum, run `npm run build` after code changes that touch TypeScript or build configuration.
- Run `npm run validate:metadata` and `npm run validate:content` after content JSON or metadata changes.
- Manual QA is part of the project definition of done: verify scene reachability, save/load, UI feedback, and mobile usability for changed flows.
- No unit test framework is configured yet; do not invent isolated test infrastructure unless the task explicitly includes it.
- For frontend/gameplay changes, verify in browser where practical because Phaser rendering and input bugs often pass TypeScript checks.

### Code Quality & Style Rules

- Follow existing file organization: `data`, `systems`, `scenes`, `types`, `ui`, `utils`, and `content`.
- Use PascalCase for scene, system, UI class, and type files; content JSON filenames are kebab-case or established snake-style names already present.
- Keep reusable UI in `src/game/ui`; do not duplicate button, HUD, progress bar, card, or mobile-control patterns inside scenes.
- Keep comments sparse and focused on non-obvious gameplay/state behavior.
- Avoid broad refactors while implementing a story; this repo has active local changes, so keep edits scoped.
- Preserve lightweight runtime assumptions. Generated shapes and placeholder assets are acceptable until a specific art pass replaces them.

### Development Workflow Rules

- BMad planning artifacts live in `_bmad-output/planning-artifacts`; implementation artifacts and story files live in `_bmad-output/implementation-artifacts`.
- Treat `docs/` as project knowledge. `docs/PHASE_PLAN.md`, `docs/ROADMAP.md`, `docs/TECHNICAL_DESIGN.md`, and `docs/17_DEFINITION_OF_DONE.md` are especially relevant.
- Before story work, read this file plus the relevant story, technical design, and definition of done.
- Do not overwrite user changes in the working tree. Current implementation files may be dirty for unrelated work.
- Keep Android work behind documented scripts; Android builds depend on local SDK/toolchain state.

### Critical Don't-Miss Rules

- Do not break save normalization when adding run-state fields; add defaults and backward-compatible normalization.
- Do not route a room or terminal state without updating save/continue behavior.
- Do not add content IDs that conflict with validation prefixes or existing saved values.
- Do not let UI overlap in portrait mode; battle, board, controls, inventory/hold/next elements must remain readable.
- Do not make the game look or market like a direct falling-block clone; preserve the Blockmancer roguelike/combat identity.
- Do not add licensed third-party art/audio without updating credits/license documentation.
- Do not assume roadmap docs are perfectly current; source code shows several originally missing systems now exist.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update when technology stack changes.
- Review periodically for outdated rules.
- Remove rules that become obvious over time.

Last Updated: 2026-05-14T14:24:30+07:00
