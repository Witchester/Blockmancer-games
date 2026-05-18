# Blockmancer Dungeon Documentation Index
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## Latest Documentation Status — 2026-05-18

Use this order when working from the docs:

1. `01_GDD_MASTER.md` — canonical design/source of truth.
2. `RELEASE_1_CODE_AUDIT_REPORT.md` — implementation reality and P0/P1 gaps.
3. `ANIMATION_ASSET_REQUIREMENTS.md` — exact-frame PNG production contract.
4. `ASSET_RUNTIME_MAPPING_REPORT.md` and `ASSET_RUNTIME_ALIGNMENT_REPORT.md` — runtime asset keys/paths.
5. `ASSET_VARIANT_AUDIT.md` and `ASSET_VARIANT_INTEGRATION_REPORT.md` — variant readiness and fallback behavior.
6. `blockmancer_release_1_asset_checklist.xlsx` — designer-facing asset list and production tracker.
7. `02_REACTIVE_DIFFICULTY_IMPLEMENTATION_PLAN.md` — reactive difficulty implementation status and next steps.
8. `docs/story board/` — character route story docs, full dialogue/storyboards, six hero route drafts, and master route implementation index.

Current decision: **do not migrate engines**. Continue with Phaser 3 + TypeScript + Vite + Capacitor until at least one full Stage 1 vertical slice is stable.

Story route status: **docs complete / runtime pending**. Use `docs/story board/` as the narrative source for RouteStorySystem, route dialogue UI, route rewards, boss callbacks, and hero endings.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

## Canonical Source

The single source of truth is:

```text
docs/01_GDD_MASTER.md
```

Use it for project identity, tone, gameplay rules, content direction, technical direction, save requirements, release scope, and acceptance criteria.

If another markdown file disagrees with `docs/01_GDD_MASTER.md`, treat that other file as historical or supporting context.

## Documentation Policy

- Update `docs/01_GDD_MASTER.md` first for design, content, technical, release, or tone changes.
- Keep wording aligned with `blockmancer_lighthearted_content_direction.md`.
- Do not reintroduce dark curse lore, horror tone, grim tragedy, or edgy fantasy content.
- Do not replace Cascade Gravity with classic row shifting.
- Supporting docs may be refreshed from the source of truth, but they are not canonical.
- When story-route wording changes, update the individual hero route file first, then refresh the master route index, then update `01_GDD_MASTER.md` if rules, flags, triggers, rewards, or endings changed.

## Supporting References

These files can still be useful, but they are not the source of truth:

- `blockmancer_lighthearted_content_direction.md` - wording and content direction reference.
- `blockmancer_lighthearted_story.md` - story and dialogue reference.
- `blockmancer_vibe_code_release_1_plan.md` - release planning reference.
- `blockmancer_release_1_agent_phase_prompts.md` - prompt pack reference.
- `02_REACTIVE_DIFFICULTY_IMPLEMENTATION_PLAN.md` - implementation plan for harder reactive hazards, floating blocks, incoming junk, and item/spell counterplay.
- `docs/story board/00_MASTER_CHARACTER_ROUTE_INDEX.md` - implementation guide for the six-hero variable choice route system.
- `docs/story board/milo_route_dialogue.md` - Milo route dialogue and storyboard reference.
- `docs/story board/pippa_route_dialogue.md` - Pippa route dialogue and storyboard reference.
- `docs/story board/zuzu_route_dialogue.md` - Zuzu route dialogue and storyboard reference.
- `docs/story board/nixie_route_dialogue.md` - Nixie route dialogue and storyboard reference.
- `docs/story board/bruk_route_dialogue.md` - Bruk route dialogue and storyboard reference.
- `docs/story board/lumi_route_dialogue.md` - Lumi route dialogue and storyboard reference.
- Numbered docs in `docs/` - historical/supporting breakdowns.
- Older docs in `blockmancer_release_gdd_docs_v2/` - archived source material.

## Current Canonical Scope

`docs/01_GDD_MASTER.md` covers:

- Project identity and tone.
- Cascade Gravity.
- Portrait mobile layout.
- Six stages and bosses.
- Heroes and passives.
- Character route story flow: 36 unique hero-stage route scenes, dialogue choices, route rewards, boss callbacks, and hero endings.
- Board blocks.
- Map node scaling.
- Dynamic board size.
- Random gameplay events.
- Stage goals.
- Festival chaos rules.
- Battle mini-objectives.
- Boss rule cards.
- Oopsie risk/reward choices.
- Festival Hub progression.
- Monster friendship/collection.
- Reactive difficulty and item/spell/relic counterplay.
- Floating blocks, incoming junk queue, and hazard counter windows.
- Content structure and naming.
- Save and meta progress, including route progress and unlocked route endings.
- Technical architecture.
- Asset/audio direction.
- Build, validation, QA, marketing, and Definition of Done.