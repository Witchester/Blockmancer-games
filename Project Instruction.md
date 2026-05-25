Project Instruction — Blockmancer Dungeon

Use CodeGraph index before editing.

Purpose:
This instruction applies to all Blockmancer Dungeon implementation tasks, including gameplay, UI, assets, content, monsters, bosses, story, systems, validation, bug fixes, audits, and refactors.

CodeGraph index purpose:
- Use CodeGraph index as the first navigation layer.
- Use it to reduce token/context usage.
- Use it to locate relevant systems, files, classes, functions, docs, data files, asset keys, relationships, and validation scripts.
- Do not read all Source of Truth docs by default.
- Read only the scoped docs/files that CodeGraph index or the task proves are relevant.

CodeGraph index workflow:
1. Inspect package.json for CodeGraph/index-related scripts.
2. Use CodeGraph index context to locate the relevant systems.
3. Use CodeGraph index impact to identify affected files/classes/functions.
4. Inspect relevant files only.
5. If Source of Truth confirmation is needed, read only the relevant sections.
6. Make the smallest safe implementation.
7. Do not rewrite unrelated systems.
8. Do not edit ignored/generated/cache/build files.
9. Add or update tests if the project already has tests nearby.
10. Run the most relevant validation command.
11. Summarize changed files and validation result.

Core project identity:
- Blockmancer Dungeon is a cheerful portrait-mobile falling-block roguelike RPG.
- Cascade Gravity is the core board identity.
- Tone should stay cheerful fantasy, cute chaos, magical festival, cozy arcade adventure.
- Avoid grimdark, horror, gore, skull-heavy UI, grotesque monster design, and edgy fantasy tone.

Core safety rules:
- Preserve Cascade Gravity.
- Preserve cheerful festival fantasy tone.
- Preserve portrait-mobile readability.
- Preserve existing save-facing IDs, runtime IDs, hero IDs, monster IDs, boss IDs, stage IDs, node IDs, asset keys, content IDs, route IDs, and save keys.
- Use asset keys instead of raw public/assets paths in runtime/content/layout references.
- Missing assets, audio, content, metadata, optional fields, and noncritical data must be fallback-safe and must not crash gameplay.
- Do not create new top-level asset folders unless the canonical folder Source of Truth is updated first.
- Do not silently change combat formulas, board gravity, piece spawn logic, special block spawn rules, EXP balance, reward balance, reactive difficulty rules, save format, or route/story state.
- Do not implement unrelated improvements in the same task.

Scoped Source of Truth reading:
Do not read every SOT doc by default.

Use CodeGraph index first, then read only relevant docs/sections.

Read relevant SOT docs only when the task touches that domain:

- Gameplay / board / combat / rewards:
  - Read gameplay SOT only if the task changes or depends on board, combat, rewards, EXP, node clear, enemy behavior, or player progression.
- Reactive difficulty / node generation / scaling:
  - Read reactive difficulty SOT only if the task touches encounter scaling, node structure, stage length, enemy scaling, elite/boss pacing, or adaptive difficulty.
- Assets / animation / folders:
  - Read asset animation and canonical folder SOT only if the task touches asset keys, folders, manifests, animation frames, placeholders, or rendering contracts.
- Story / routes / dialogue:
  - Read story/dialogue SOT only if the task touches routes, dialogue, choices, story flags, endings, or narrative state.
- Monsters / bosses:
  - Read monster/boss docs only if the task touches monster data, boss data, enemy behavior, monster art, stage placement, or combat role.
- UI / layout / screens:
  - Read UI docs/layout specs only if the task touches UI, screen layout, component rendering, controls, panels, HUD, result screens, or mobile readability.
- Release / audit / validation:
  - Read release/audit docs only if the task touches milestone status, readiness, validation, smoke testing, or implementation tracking.

If CodeGraph index and SOT docs conflict:
- Source of Truth docs define intended canonical behavior.
- CodeGraph index shows current repo state.
- Use both: SOT for rules, CodeGraph index for where to implement.

Implementation behavior:
- Modify the smallest safe set of files.
- Reuse existing systems and handlers.
- Prefer integration over rewrites.
- Keep gameplay behavior stable unless the task explicitly asks for gameplay changes.
- Avoid duplicate systems.
- Avoid raw path hardcoding.
- Avoid changing IDs unless the task explicitly requires migration.
- Add fallback behavior for missing optional assets/content/data.
- Keep runtime errors nonfatal when missing optional data can safely fallback.

Gameplay rules:
- Do not change board rules unless explicitly requested.
- Do not change Cascade Gravity unless explicitly requested.
- Do not change piece spawn logic unless explicitly requested.
- Do not change special block spawn rules unless explicitly requested.
- Do not change combat formulas unless explicitly requested.
- Do not change EXP/reward balance unless explicitly requested.
- Do not change reactive difficulty unless explicitly requested.
- Avoid double-awarding EXP, rewards, gold, relics, unlocks, or story flags.
- Avoid save schema changes unless migration is explicitly required and documented.

Asset rules:
- Canonical asset root is public/assets/.
- Runtime/content/layout should reference asset keys, not raw paths.
- Missing final assets must be fallback-safe.
- Use fallbackAssetKey where available.
- If fallback is missing, use safe placeholder behavior.
- Do not require final art to exist for builds to pass.
- Do not bake dynamic text into images.
- Do not create new top-level asset folders unless the canonical folder SOT is updated first.

Content/data rules:
- Keep content/data ID-stable.
- Preserve schemas and validators.
- Preserve required fields.
- Do not invent new required fields without updating validators and fallback defaults.
- Do not remove content IDs used by saves, scenes, tests, or docs.
- Do not add raw asset paths where asset keys are expected.
- Keep content validation passing where available.

Testing and validation:
Run only commands that exist in this repo.

Prefer, when available:
- npm run validate:ui-layouts
- npm run validate:content
- npm run validate:metadata
- npm run validate:animations
- npm run sync:assets
- npm run test
- npm run build

If a command is unavailable, document it.
If a command fails, report it and fix it only if it is within task scope.

Ignored/generated/cache/build files:
Do not edit:
- node_modules/
- dist/
- build/
- cache folders
- generated graph output, unless the task explicitly asks to update graph docs
- minified/build artifacts
- lockfiles, unless dependency changes are explicitly required

Documentation:
Update docs only when the task actually changes:
- architecture
- systems
- UI phases
- content contracts
- asset contracts
- folder rules
- validation behavior
- traceability
- implementation status

Do not update broad docs just to make a small code change look complete.

Final response format:
Summary
CodeGraph index preflight status
CodeGraph index command/script used, if any
Files identified by CodeGraph index
Scoped files inspected
Files created
Files updated
Implementation status
Commands run
Build/validation result
Known limitations
Next recommended step