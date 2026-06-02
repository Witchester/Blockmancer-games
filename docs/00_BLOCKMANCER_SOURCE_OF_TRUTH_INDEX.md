# Blockmancer Dungeon — Source of Truth Index

**Generated:** 2026-05-20  
**Purpose:** Clean replacement documentation pack created by consolidating the uploaded Blockmancer Release 1 files into multiple focused sources of truth.

This pack splits the project documentation by ownership area so future updates are less likely to create conflicts.

## Canonical Reading Order

| Order | File | Use for |
| ---: | --- | --- |
| 0 | `00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` | Documentation map, update policy, and source precedence. |
| 1 | `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` | Core game identity, tone, layout, Cascade Gravity, stages, heroes, routes, board systems, release design scope. |
| 2 | `02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` | Story premise, polished writing direction, route scenes, dialogue, boss intros, endings, and narrative QA. |
| 3 | `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` | Reactive difficulty, hazards, counter items, route reward/risk modifiers, runtime audit, and smoke tests. |
| 4 | `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` | Asset folders, exact-frame PNG contract, board block animations, variants, placeholders, and 32-bit pixel style rules. |
| 5 | `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` | Current implementation status, code audit, route implementation audit, release plan, and agent prompts. |
| 6 | `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` | Final `public/assets/` folder tree, stage folder separation, raw-path policy, and fallback-only path policy. |
| 7 | `07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` | Monster/boss metadata, stage fit, attack intent, counterplay notes, boss Fever interaction metadata, and monster asset contracts. |

## Source Precedence Rules

1. For **core design**, `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` wins.
2. For **actual dialogue, route scenes, and storyboards**, `02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` wins.
3. For **hazards, item counters, spell catalysts, and route-triggered risks/rewards**, `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` wins.
4. For **asset sizes, folder paths, animation frame counts, and fallback behavior**, `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` wins.
5. For **what is implemented, partial, missing, or next**, `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` wins.
6. For **canonical asset folder placement and fallback-only path policy**, `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` wins.
7. Older uploaded files are historical unless explicitly embedded in one of the files above.

## Active Product Decisions

| Decision | Current source |
| --- | --- |
| Engine remains Phaser 3 + TypeScript + Vite + Capacitor. | Game Design SOT + Release Implementation SOT |
| Core board identity is Cascade Gravity, not classic row shifting. | Game Design SOT |
| Tone stays cheerful festival / cute chaos. No dark curse, horror, grim tragedy, gore, or edgy villain framing. | Game Design SOT + Story SOT |
| Route story scope is 6 heroes × 6 stages = 36 route scenes. | Game Design SOT + Story SOT |
| Route story is runtime-implemented but still needs manual smoke verification. | Release Implementation SOT |
| Exact-frame PNG animation support exists, but final production frames are still incomplete. | Asset/Animation SOT |
| Placeholder assets are runtime-safe but not final art. | Asset/Animation SOT |
| Canonical asset root is `public/assets/`; stage `battle/` and `puzzle/` folders are separate; legacy paths are fallback-only. | Canonical Folder Structure SOT |
| Next product focus is Stage 1 vertical slice stabilization, P0 tests, Priority 1 assets/VFX/audio, and manual portrait-mobile smoke tests. | Release Implementation SOT |

## Update Policy

When making a change:

1. Update the relevant focused SOT first.
2. Update this index only when file ownership, status, or reading order changes.
3. Do not edit multiple SOT files for the same fact unless the fact truly belongs to multiple ownership areas.
4. If a code audit proves the implementation status changed, update `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` first, then summarize the status in the other SOT only if it changes design or production rules.
5. Preserve save-facing IDs and runtime asset IDs unless a migration is documented.

## Codex / Agent Instruction

Use this exact instruction at the start of future implementation prompts:

```text
Read docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md first.
Then read only the focused source-of-truth file that matches the task.
Do not rely on older duplicated docs unless the index says they are supporting context.
Keep Cascade Gravity, cheerful festival tone, portrait-mobile readability, placeholder-safe fallbacks, and existing save-facing IDs.
```

## Generated Files

```text
blockmancer_sot_pack_2026_05_20/
  00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
  01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
  02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md
  03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md
  04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
  05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
  06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
  07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md
  SOURCE_MANIFEST.json
```

<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_START -->
## 2026-06-02 Update — Fever Showtime Cascade Documentation Overlay

This update adds the new **Fever Showtime Cascade** feature as a cross-SOT product decision.

### Feature Definition

Fever is no longer only a simple meter. It becomes **Fever Showtime**, a controlled cascade-building mode:

```text
Fill Fever meter -> activate Showtime -> completed lines become Charged Lines -> stack during a short lock window -> release manually or automatically -> clear Charged Lines together -> run normal Cascade Gravity -> apply combat damage, boss caps, overflow, pressure safety, and upgrade effects.
```

### Source Ownership

| Area | Canonical owner |
| --- | --- |
| Core gameplay rules, board lifecycle, Fever caps, upgrade rules, layout placement | `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` |
| Fever wording, event log lines, boss card phrasing, story-safe microcopy | `02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` |
| Fever Pressure Budget, Soft Junk, Fever Heat, hazard fairness, smoke tests | `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` |
| Fever UI/VFX/asset keys, frame counts, fallback behavior | `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` |
| Implementation phases, current status, validation, release readiness | `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` |
| Canonical asset folder placement for Fever UI/VFX/icons | `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` |
| Monster and boss Fever interaction metadata, especially High Score Hydra | `07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` |

### New Active Product Decisions

| Decision | Rule |
| --- | --- |
| Fever mode | Fever is **Showtime Cascade mode**, not a passive always-on buff. |
| Line clear behavior during Fever | Completed rows become **Charged Lines** and do not clear immediately until Fever releases. |
| Cascade identity | Fever release must still resolve through the existing **Cascade Gravity** system. |
| Battle lifecycle | Physical board state is encounter-local. Charged Lines, Soft Junk, Fever Heat, and unresolved release state never persist between nodes. |
| Boss safety | Bosses and final bosses use Boss Drama Guard caps so Fever cannot one-shot or skip multiple phases. |
| Pressure safety | Boss/enemy block-add during Fever uses systemic **Pressure Budget**, **Soft Junk**, and **Fever Heat**, not hidden scripted cancellation. |
| Upgrade safety | Fever upgrades are allowed, but capped and unable to bypass boss caps or create infinite Fever loops. |
| UI placement | Fever UI must live in existing compact HUD/right-rail/control patterns. No separate top HP/Mana/Fever bar. |
| Asset policy | Fever assets reuse existing `public/assets/ui/`, `public/assets/effects/`, `public/assets/icons/upgrades/`, and `public/assets/sprites/board-blocks/` folders. No new top-level folders. |

### Updated Canonical Reading Order Addition

`07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` is now part of the active SOT pack for monster/boss metadata. It does not override design, gameplay, asset, release, or folder SOTs, but it owns monster-facing implementation metadata and boss behavior notes.

### Prompt Instruction Update

Future Fever implementation prompts should start with:

```text
Use AGENTS.md.
Use CodeGraph index before editing.
Read docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md first.
Then read the focused SOT files for the phase.
Keep Cascade Gravity, cheerful festival tone, portrait-mobile readability, fallback-safe assets/audio/content, and existing save-facing IDs.
Fever Showtime board-local state must never persist between nodes.
```
<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_END -->
