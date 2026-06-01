## codegraph

This project uses CodeGraph as the codebase/navigation graph for source files, docs, UI specs, scene relationships, component dependencies, and asset-key traceability.

When the user types `/codegraph`, inspect and refresh CodeGraph before doing anything else.

Rules:
- For codebase questions or implementation tasks, inspect CodeGraph before coding.
- First check for existing CodeGraph outputs and reports, such as:
  - docs/ui/codegraph/
  - codegraph-out/
  - .codegraph/
  - codegraph/
  - graph.json
  - graph.html
  - repo-graph.json
  - dependency-graph.json
- Also inspect package.json for CodeGraph-related scripts before guessing commands.
- Prefer project-local npm scripts over global commands.
- Look for scripts named like:
  - codegraph
  - code-graph
  - codegraph:update
  - update:codegraph
  - codegraph:index
  - graph
  - repo-map
  - analyze
  - index
- Do not invent a CodeGraph command. Only run a command that exists in package.json, repo docs, or project config.
- If CodeGraph supports query/path/explain style commands in this repo, use them before raw source browsing:
  - query for the feature/task
  - path for relationships between scene/component/system files
  - explain for focused concepts
- If CodeGraph output exists but appears dirty/stale, dirty graph files are not a reason to skip CodeGraph. Refresh CodeGraph after coding if a safe update command exists.
- If CodeGraph is unavailable, continue with manual inspection, but document that CodeGraph was unavailable and update docs/ui/codegraph/ manually where relevant.
- For UI implementation tasks, always inspect:
  - docs/ui/codegraph/BLOCKMANCER_UI_CODEGRAPH_REPORT.md
  - docs/ui/codegraph/BLOCKMANCER_UI_SCENE_TO_SPEC_TRACEABILITY.md
  - docs/ui/codegraph/BLOCKMANCER_UI_COMPONENT_DEPENDENCY_GRAPH.md
  - docs/ui/codegraph/BLOCKMANCER_UI_ASSET_KEY_GRAPH.md
  - docs/ui/codegraph/BLOCKMANCER_UI_SCREEN_FLOW_GRAPH.md
- Before coding, use CodeGraph findings to identify the exact existing files/classes/functions to update.
- After modifying code, run the safest available CodeGraph refresh/update command and update relevant docs/ui/codegraph/ traceability notes.
- CodeGraph is analysis support only. Source-of-truth docs remain higher authority than graph output.

## Essential Commands

Run these from the project root (`C:\Users\binh.pc\Desktop\New folder`):

**Development:**
- `npm run dev` - Start Vite dev server with `--force`
- `npm run build` - Build for production (runs `tsc --noEmit && vite build`)
- `npm run preview` - Preview production build locally

**Validation (run before building):**
- `npm run validate:content` - Validate content data
- `npm run validate:metadata` - Validate content metadata
- `npm run validate:animations` - Validate animation assets
- `npm run sync:assets` - Sync assets to canonical folders
- `npm run audit:asset-variants` - Audit asset variants

**Testing:**
- `npm run test` - Run remediation smoke test (checks specific content/system expectations)

**Android (after `npm run android:init`):**
- `npm run android:sync` - Build web and sync to Android project
- `npm run android:open` - Open in Android Studio
- `npm run android:build:debug` - Build debug APK

**Other:**
- `npm run assets:folders` - Ensure final asset folders exist
- `npm run assets:placeholders` - Generate placeholder assets
- `npm run clean` - Remove dist, node_modules/.vite, android/.gradle, android/app/build

## Source-of-Truth (SOT) Reading Order

**Always read `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` first**, then read the focused SOT file matching your task.

**Precedence rules (focused SOT wins):**
1. Core gameplay/design: `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`
2. Story/dialogue/routes: `02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md`
3. Hazards/counters/reactive difficulty: `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md`
4. Asset sizes/animation/fallback: `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md`
5. Current implementation truth: `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`
6. Asset folder paths: `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md`
7. Monster roster/metadata: `07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md`
8. Coding-agent rules/workflow: `AGENT.md`

## Key Conventions (Would Likely Be Missed Without Help)

- **No patch format**: Modify existing files in place; create new files only when required by task/repo structure.
- **Read focused SOT before changing behavior/assets**: Trust executable sources (configs/scripts) over prose if they conflict.
- **Preserve Cascade Gravity**: Do not replace with classic row shifting; use deterministic grid-based gravity.
- **Preserve portrait-mobile readability**: Primary target is mobile portrait; desktop uses centered portrait frame.
- **Preserve cheerful festival / cute chaos tone**: No dark curse, horror, grim tragedy, or edgy fantasy content.
- **Preserve save-facing IDs**: Do not rename/delete without SOT authority or migration/fallback handling.
- **Content JSON uses asset keys**: Reference `spriteKey`, `iconKey`, `assetKey`, etc., not raw `public/assets/...` paths.
- **Runtime systems resolve keys**: AssetSystem/manifest resolves asset keys to canonical paths.
- **Exact-frame PNG naming**: Animations require `{asset_id}__{animation_name}__f00.png`, `__f01.png`, etc.
- **Missing assets/content must fallback safely**: Must not crash gameplay.
- **Save compatibility**: Corrupt save must not crash; deleted/renamed IDs in old saves must fallback safely.
- **Board size changes**: Never shrink below 6x12; preserve blocks safely or prevent shrink if occupied cells would become invalid.
- **Monster, boss, and asset folders follow strict canonical structure** (see `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md`).

## Project Structure Highlights

- `src/game/` - Gameplay systems, scenes, UI, data, types
- `src/game/content/` - Data-driven content JSON
- `public/assets/` - Runtime assets (use canonical subfolders: `board-blocks/`, `sprites/`, `effects/`, `icons/`, `stages/`, `ui/`, `portraits/`, `story/`, `audio/`, `fonts/`, `placeholders/`, `store/`, `backgrounds/legacy/`)
- `docs/` - Canonical source-of-truth files (00-07) plus supporting/historical docs
- `scripts/` - Content validation and asset tools (`validate-*.mjs`, `sync-assets.mjs`, `audit-asset-variants.mjs`, etc.)
- `android/` - Capacitor Android project

## Agent Workflow & Definition of Done

**When given a task:**
1. `cd` to project using full path
2. Read `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`
3. Read focused SOT files for the task
4. Inspect current files before editing
5. Identify smallest safe change
6. Implement content/schema/runtime updates
7. Add safe fallback handling
8. Update references if IDs/assets changed
9. Update docs/report if requested or behavior changed
10. Run relevant validation/build commands
11. Summarize changes, validation results, and limitations

**Do not:**
- Use patch format
- Rewrite unrelated systems
- Remove working features without replacement
- Introduce dark lore/content
- Break mobile portrait layout
- Ignore build/type errors
- Leave old references to deleted IDs
- Let content validate structurally while runtime effects silently do nothing

**A task is done only when:**
- Relevant SOT files were read
- Existing files inspected before editing
- Smallest safe change made
- Game builds successfully or build failure documented honestly
- Existing gameplay not broken
- TypeScript errors fixed
- New content data-driven where practical
- Missing assets/content have safe fallbacks
- Mobile portrait layout remains playable
- Save compatibility considered
- Randomness bounded, explained, and fair
- Board size changes preserve existing blocks safely
- New replayability systems stage/node filtered where relevant
- Content references do not point to deleted/renamed IDs
- Canonical asset paths respected
- Validation/build results reported
- Relevant docs updated if behavior changed
