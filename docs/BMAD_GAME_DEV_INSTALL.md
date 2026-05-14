# BMAD Game Dev Studio Setup

This project uses BMAD Game Dev Studio, also called BMGD or GDS, for game planning, story creation, sprint tracking, and agent-guided implementation.

The generated BMAD folders are intentionally gitignored:

- `_bmad/`
- `_bmad-output/`
- `.agents/`
- `.claude/`

Each developer can recreate them locally with the BMAD installer.

## Prerequisites

- Node.js 20 or newer
- npm and `npx`
- This repository checked out locally
- An AI coding environment that can read project-local BMAD skills

## Install BMAD Game Dev Studio

From the project root, run:

```bash
npx bmad-method install
```

When prompted:

1. Choose this repository as the install directory.
2. Select **Game Dev Studio** from the module list.
3. Select any companion modules you want. This project currently works well with the core BMAD helpers and Game Dev Studio.
4. Configure project values to match this repo:
   - Project name: `Blockmancer Dungeon`
   - Planning artifacts: `{project-root}/_bmad-output/planning-artifacts`
   - Implementation artifacts: `{project-root}/_bmad-output/implementation-artifacts`
   - Project knowledge: `{project-root}/docs`
   - Output folder: `{project-root}/_bmad-output`
5. Select the IDE/tool integration you use.

The installer should create local generated folders such as `_bmad/`, `_bmad-output/`, and tool-specific agent folders.

## Verify The Install

After installation, confirm these paths exist:

```text
_bmad/gds/config.yaml
_bmad/_config/bmad-help.csv
_bmad-output/
.agents/skills/gds-create-story/SKILL.md
```

Then ask your AI coding tool to run:

```text
bmad-help
```

For this repo, BMAD should detect a game project and recommend Game Dev Studio workflows.

## Current Project Configuration

The local GDS config used while writing this guide was:

```yaml
game_dev_experience: intermediate
planning_artifacts: "{project-root}/_bmad-output/planning-artifacts"
implementation_artifacts: "{project-root}/_bmad-output/implementation-artifacts"
project_knowledge: "{project-root}/docs"
output_folder: "{project-root}/_bmad-output"
```

This project has already used GDS to produce:

```text
_bmad-output/project-context.md
_bmad-output/planning-artifacts/blockmancer-epics.md
_bmad-output/implementation-artifacts/sprint-status.yaml
_bmad-output/implementation-artifacts/1-1-stabilize-core-run-loop.md
```

Those files are local workflow artifacts. Regenerate them when needed instead of committing generated BMAD output.

## Useful Workflows For This Project

Use these skill names in Codex or another skill-aware coding assistant:

- `bmad-help` - detect the current BMAD state and recommend the next workflow
- `gds-generate-project-context` - regenerate compact project rules for agents
- `gds-create-epics-and-stories` - create or refresh game epics and stories
- `gds-sprint-planning` - generate or update sprint tracking
- `gds-sprint-status` - inspect current sprint progress
- `gds-create-story` - create the next implementation story file
- `gds-dev-story` - implement a ready story
- `gds-code-review` - review completed story work

Some BMAD environments expose slash commands using `bmgd` names, for example `/bmgd-create-story`. In this repo's Codex skill setup, use the `gds-*` skill names above.

## Recommended Workflow

1. Run `bmad-help` in a fresh chat.
2. If planning artifacts are missing, run `gds-generate-project-context`, then `gds-create-epics-and-stories`, then `gds-sprint-planning`.
3. Create the next implementation file with `gds-create-story`.
4. Implement it with `gds-dev-story`.
5. Review with `gds-code-review`.
6. Repeat story creation, development, and review until the epic is complete.

Start a fresh chat for each major BMAD workflow. BMAD workflows rely on clean context and local artifact discovery.

## References

- BMAD Method docs: https://docs.bmad-method.org/
- BMAD custom/community module install docs: https://docs.bmad-method.org/how-to/install-custom-modules/
- Game Dev Studio docs: https://game-dev-studio-docs.bmad-method.org/
- Game Dev Studio module repository: https://github.com/bmad-code-org/bmad-module-game-dev-studio
