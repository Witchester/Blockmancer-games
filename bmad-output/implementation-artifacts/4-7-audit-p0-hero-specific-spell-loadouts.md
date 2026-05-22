# Story 4.7: Audit P0 Hero-Specific Spell Loadouts

Status: done

## Story

As a release owner,
I want hero spell loadouts to be enforced from hero content all the way through battle UI and hotkeys,
so that each Release 1 hero keeps their intended combat identity and no run silently receives spells outside its configured loadout.

## Acceptance Criteria

1. Given a new run is started with any enabled Release 1 route hero, when `BlockmancerGame.newRun(heroId)` applies the hero, then `runState.spells` contains exactly the runtime spell IDs mapped from that hero's `startingLoadout.spellIds`, with no Release 1 full-pool injection, no duplicates, and no unsupported IDs.
2. Given a hero has fewer than four starting spells, when `BattleScene` renders spell controls and handles number hotkeys, then empty slots are disabled or no-op and must not display or cast fallback spells such as Fireball unless that spell is in `runState.spells`.
3. Given a hero content file references a starting spell, when validation or smoke tests run, then the spell content ID is present in `SPELL_ID_BY_CONTENT_ID`, appears in enabled spell content, and has a runtime `SpellSystem.cast` path or is explicitly developer-warned/hidden.
4. Given Poplin and Bloop remain outside the active Release 1 route scope, when hero select and loadout tests run, then they remain disabled and cannot start normal Release 1 runs unless release scope is intentionally changed with route/loadout coverage.
5. Given the remediation audit previously marked this P0 as only partially closed, when this story is complete, then automated smoke covers exact hero-to-runtime loadout behavior and battle slot behavior, and the audit smoke/report docs record the remaining manual proof, if any.

## Tasks / Subtasks

- [x] Enforce exact hero loadout mapping at run start (AC: 1, 3, 4)
  - [x] Keep `HeroSystem.applyHeroToRun` driven by `src/game/content/heroes/*.json` and `SPELL_ID_BY_CONTENT_ID`; do not reintroduce `RELEASE_1_SPELL_CONTENT_IDS` into `HeroSystem`.
  - [x] Verify the six Release 1 route heroes are the active enabled scope: Milo, Pippa, Nixie, Bruk, Zuzu, and Lumi.
  - [x] Preserve Milo's safe fallback only for malformed/empty Milo content; do not use it as a generic fallback for every hero.
  - [x] Confirm Poplin and Bloop stay disabled unless a separate release-scope story adds route and loadout support.
- [x] Fix battle spell slot rendering and hotkeys (AC: 2)
  - [x] Update battle spell slot lookup so it returns only spells present in `runState.spells`; do not pad with `SPELLS[0]`.
  - [x] Render empty spell slots as disabled/empty controls or omit them within the existing four-slot layout without shifting the control area.
  - [x] Ensure keyboard hotkeys `1` through `4` only cast real active-run spells; out-of-range slots should no-op with safe player/developer feedback and no mana change.
  - [x] Preserve mobile control layout, inventory, Hold, Next Queue, and existing spell disabled-state behavior for insufficient mana.
- [x] Tighten content and mapping validation (AC: 1, 3)
  - [x] Ensure every `startingLoadout.spellIds` entry used by enabled heroes has a content spell file and a `SPELL_ID_BY_CONTENT_ID` runtime mapping.
  - [x] Check `src/game/content/heroes/metadata.json` does not lag behind actual allowed starting spell IDs, or document why the current validator intentionally permits them.
  - [x] Do not rename existing content IDs or runtime spell IDs; preserve save compatibility.
- [x] Replace string-only smoke checks with behavioral assertions (AC: 1, 2, 3, 4, 5)
  - [x] Extend `tests/run-remediation-smoke.mjs` or add a focused helper under `tests/` that compares each Release 1 hero's expected runtime loadout against the mapped content loadout.
  - [x] Add a regression assertion for heroes with fewer than four spells, especially Bruk, proving BattleScene slot logic cannot surface Fireball or any other non-loadout filler.
  - [x] Keep the Cascade Gravity smoke import in `tests/run-remediation-smoke.mjs`; do not regress previous Story 1.3 coverage.
- [x] Update audit evidence (AC: 5)
  - [x] Update `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_REPORT_2026_05_21.md` with the exact hero-loadout closure evidence.
  - [x] Update `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_SMOKE_2026_05_21.md` with commands run and any manual smoke still not run.

## Dev Notes

### Current State

- The full repo audit identified this P0: hero runs received the full Release 1 spell pool, breaking hero identity, progression, balance, and spell unlock expectations. [Source: `docs/audits/BLOCKMANCER_FULL_REPO_AUDIT_2026_05_21.md`]
- A remediation pass partially fixed run setup: `HeroSystem.applyHeroToRun` now maps `hero.startingLoadout.spellIds` through `SPELL_ID_BY_CONTENT_ID`, warns on unsupported IDs, and no longer imports or appends `RELEASE_1_SPELL_CONTENT_IDS`. [Source: `src/game/systems/HeroSystem.ts`]
- The critical implementation gap found for this story was battle slot behavior: the previous `BattleScene.getPlayableSpells()` logic filtered by `runState.spells` but then padded to four entries with `SPELLS[0]`. For heroes with fewer than four configured spells, that could display/cast Fireball even when Fireball was not in the hero loadout. This story replaced that with nullable, disabled/no-op spell slots. [Source: `src/game/scenes/BattleScene.ts`]
- Existing smoke coverage is partly text-search based. It checks that `HeroSystem.ts` does not contain `RELEASE_1_SPELL_CONTENT_IDS`, but it does not prove run-state equality or spell-slot behavior. [Source: `tests/run-remediation-smoke.mjs`]

### Hero Loadout Facts

Release 1 active route heroes and current starting spell content IDs:

| Hero | Content file | Starting spell content IDs |
| --- | --- | --- |
| Milo | `src/game/content/heroes/milo_blockmancer.json` | `spl_fireball`, `spl_frost_lock` |
| Pippa | `src/game/content/heroes/pippa_pyromancer.json` | `spl_fireball`, `spl_cupcake_blast`, `spl_bomb_rune` |
| Nixie | `src/game/content/heroes/nixie_frostbinder.json` | `spl_frost_lock`, `spl_snowcone_burst`, `spl_clean_cut` |
| Bruk | `src/game/content/heroes/bruk_snack_knight.json` | `spl_snack_break`, `spl_bomb_rune` |
| Zuzu | `src/game/content/heroes/zuzu_goblin_engineer.json` | `spl_goblin_gadget`, `spl_bomb_rune`, `spl_fireball` |
| Lumi | `src/game/content/heroes/lumi_star_witch.json` | `spl_star_spark`, `spl_cascade_cheer`, `spl_rainbow_reroll` |

Poplin and Bloop are content-present but disabled after remediation to keep the active route scope at six heroes. [Source: `src/game/content/heroes/poplin_professor.json`, `src/game/content/heroes/bloop_slime_friend.json`]

### Architecture Compliance

- Keep Phaser 3 + TypeScript + Vite + Capacitor. Do not add a new framework or test runner for this narrow fix. [Source: `bmad-output/project-context.md`]
- `BlockmancerGame` owns long-lived systems and calls `heroSystem.applyHeroToRun` during `newRun`; preserve that flow. [Source: `src/game/BlockmancerGame.ts`]
- Content stays data-driven under `src/game/content/**`, with runtime consumers in systems/scenes. Do not hardcode hero-specific spell arrays in `BattleScene`; read from `runState.spells`. [Source: `bmad-output/game-architecture.md`]
- Preserve save-facing IDs and runtime IDs. Do not rename hero IDs, spell content IDs, or runtime `SpellId` values. [Source: `bmad-output/project-context.md`]
- Mobile UI must preserve visible controls and spell/action controls in the bottom control area. Empty slots must not cause layout jumps or overlap. [Source: `bmad-output/planning-artifacts/epics.md`, UX-DR6]

### Files Expected To Touch

- `src/game/scenes/BattleScene.ts`: fix spell slot list, rendering, disabled state, and hotkey no-op behavior.
- `tests/run-remediation-smoke.mjs`: add behavioral assertions for exact hero loadout mapping and no non-loadout filler spell slots.
- `src/game/content/heroes/metadata.json`: update only if validation metadata is stale for actual starting spell IDs.
- `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_REPORT_2026_05_21.md`: record closure evidence.
- `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_SMOKE_2026_05_21.md`: record command results and manual smoke status.

Touch `src/game/systems/HeroSystem.ts` only if behavioral tests expose a real mapping defect. The current implementation is the intended baseline.

### Testing Requirements

Run at minimum:

```bash
npm.cmd run test
npm.cmd run validate:content
npm.cmd run validate:metadata
npm.cmd run build
```

If content metadata or asset references change, also run:

```bash
npm.cmd run validate:animations
npm.cmd run sync:assets
npm.cmd run audit:asset-variants
```

Manual smoke still needed before calling the P0 fully release-closed:

- Start a new run for each Release 1 route hero and confirm the displayed battle spell buttons match that hero's starting loadout.
- For Bruk, confirm only Snack Break and Bomb Rune are available; Fireball must not appear or cast from empty slots.
- Confirm out-of-range spell hotkeys do not spend mana or cast anything.

### Previous Story Intelligence

Story 1.3 explicitly warned that hero spell loadouts were an out-of-scope audit P0 and should be handled separately. Keep this story focused on loadout enforcement and verification; do not mix in stage goals, route presentation, board-size modifiers, or Cascade Gravity refactors. [Source: `bmad-output/implementation-artifacts/1-3-resolve-cascade-gravity.md`]

Recent remediation docs also show this area was only partially closed because manual gameplay proof was not run. This story should convert the P0 from "partially closed" to code-and-smoke-verified, while honestly recording any manual smoke still pending. [Source: `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_REPORT_2026_05_21.md`]

### Latest Technical Information

No external library update is required for this story. Use the installed stack recorded in `package.json`: Phaser `^3.90.0`, TypeScript `^5.8.3`, Vite `^7.0.0`, Capacitor `^7.0.1`, Playwright `^1.60.0`. Network research was not needed because the story changes local TypeScript/game behavior, not third-party APIs.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd run test` -> Pass
- `npm.cmd run validate:content` -> Pass
- `npm.cmd run validate:metadata` -> Pass
- `npm.cmd run build` -> Pass
- Playwright runtime smoke at `360x640` -> Pass for hero spell state/button IDs and Bruk empty-slot hotkey behavior

### Completion Notes List

- `BattleScene` now builds spell controls from fixed four slots where empty slots are disabled/no-op placeholders instead of padded Fireball entries.
- Keyboard spell hotkeys now use the same slot list and log safe feedback for empty slots.
- Battle spell buttons now preserve `runState.spells` order instead of global spell roster order.
- Remediation smoke now checks exact Release 1 hero runtime loadouts, mapping coverage, content file presence, `SpellSystem.cast` handling, and Bruk's short-loadout no-Fireball regression case.
- Hero metadata starting-spell values now include the active hero loadout spell IDs.
- Audit report and smoke evidence were updated with code/smoke closure and Playwright runtime proof.

### File List

- `src/game/scenes/BattleScene.ts`
- `src/game/content/heroes/metadata.json`
- `tests/run-remediation-smoke.mjs`
- `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_REPORT_2026_05_21.md`
- `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_SMOKE_2026_05_21.md`
- `bmad-output/implementation-artifacts/4-7-audit-p0-hero-specific-spell-loadouts.md`
