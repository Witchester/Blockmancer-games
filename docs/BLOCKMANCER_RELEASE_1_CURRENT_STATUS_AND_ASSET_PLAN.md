# Blockmancer Dungeon — Current Release 1 Status & Asset Update Plan

Generated: 2026-05-18

## Executive decision

Keep the current stack: **Phaser 3 + TypeScript + Vite + Capacitor**. The latest audit shows the project already has a strong Release 1 scaffold. The blockers are completion, assets, tests, and mobile verification—not the engine.

## Current implementation status

### Done

- Core Phaser scene flow.
- Board placement, movement, Hold, Next, and ghost piece.
- Cascade Gravity and combat cascade integration.
- Combat loop with HP, mana, shield, enemy counters, rewards, victory/defeat routing.
- Map routing and core room flow.
- ContentRegistry loading JSON content.
- Save/meta migration and safe defaults.
- AssetSystem runtime manifest, variant fallback, exact-frame animation manifest, preload/fallback behavior.
- Debug scene and Android/Capacitor scaffolding.
- Content, metadata, and animation validation scripts.

### Partial

- Spell roster: content exists, runtime implementation is incomplete.
- Boss mechanics: rule cards exist, but mechanics need visible gameplay verification.
- Item/relic/upgrade/oopsie effects: many work, but behavior remains switch-based and must be audited against content.
- Reactive difficulty: incoming junk, floating blocks, hazard windows, and counters exist conceptually/partially but need end-to-end tests.
- Replayability systems: random events, stage goals, chaos rules, battle objectives, hub, and friendship exist but are uneven.
- Audio: fallback works, final OGG files missing.
- Mobile: portrait layout exists, device smoke test not yet proven.

### Must fix next

| Priority | Task |
| --- | --- |
| P0 | Fix battle objective placeholder `true` checks. |
| P0 | Add deterministic tests/smoke harness for Cascade Gravity and save migration. |
| P0 | Stress-test soft-lock risk from dynamic board size + hazards. |
| P1 | Finish Stage 1 vertical slice from map start to boss/reward. |
| P1 | Import/verify Priority 1 exact-frame PNG assets. |
| P1 | Complete Stage 1 spell/item/reward/boss behavior. |
| P1 | Run desktop + portrait mobile smoke test. |
| P1 | Tone-clean legacy curse/blood wording from player-facing content. |
| P2 | Add final audio or define fallback audio as intentional style. |
| P2 | Decide hub/friendship Release 1 scope. |

## Asset list update

### Runtime facts

| Metric | Value |
| --- | ---: |
| Checklist rows parsed | 992 |
| Runtime asset keys found | 199 |
| Runtime files already OK | 187 |
| Runtime unresolved assets | 0 |
| Audio files missing but fallback-safe | 12 |
| Placeholder image files created/copied | 853 |
| Existing non-empty files preserved | 197 |
| Exact animation definitions | 365 |
| Missing expected PNG frame files from audit | 1832 nonfatal warnings |

### Asset priorities

| Priority | Asset group | Required action |
| --- | --- | --- |
| P1 | Board blocks | Finalize base/glow/clear exact frames for normal runes and key special blocks. |
| P1 | Core VFX | Finalize line clear, cascade pop, bomb explosion, enemy hit, enemy defeat, hazard warning UI. |
| P1 | Stage 1 content | Finalize Milo/Pippa/Nixie/Bruk/Zuzu/Lumi release hero minimum, Stage 1 monsters, Cupcake Slime King, Sprinkle Sewers backgrounds. |
| P1 | UI basics | Finalize buttons, cards, controls, reward cards, HUD icons. |
| P2 | Spells/items | Finalize runtime-supported spell VFX and reactive item VFX after behavior is implemented. |
| P2 | Audio | Add 12 runtime SFX plus broader BGM/ambience backlog. |
| P3 | Future content | Bloop, Professor Poplin, optional legacy blocks, full hub/friendship art. |

## Updated files included

The package includes refreshed versions of all uploaded markdown files plus an updated Excel workbook with new status/backlog sheets.

## Recommended next Codex prompt

```text
Read AGENT.md, docs/01_GDD_MASTER.md, docs/RELEASE_1_CODE_AUDIT_REPORT.md, docs/ANIMATION_ASSET_REQUIREMENTS.md, and the updated asset checklist.

Task:
Do a P0/P1 Stage 1 vertical slice stabilization pass only.

Scope:
- Fix placeholder battle objective checks.
- Add deterministic Cascade Gravity and save migration smoke tests or validation helpers.
- Verify Stage 1 map → battle → reward → boss path.
- Import or verify Priority 1 exact-frame board/VFX assets.
- Complete Stage 1 boss rule behavior and core spell/item effects needed for the vertical slice.
- Keep Phaser 3 + TypeScript + Vite + Capacitor.
- Preserve Cascade Gravity, portrait mobile readability, cheerful tone, and safe asset fallbacks.

Run:
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run build

Report:
Summary / Files changed / Tests added / Commands run / Manual smoke path / Known limitations.
```
