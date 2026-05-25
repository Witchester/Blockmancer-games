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