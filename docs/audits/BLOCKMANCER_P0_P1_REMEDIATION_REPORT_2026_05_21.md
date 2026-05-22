# Blockmancer Dungeon — P0/P1 Remediation Report

## 1. Summary
- Fixed: hero spell loadout no longer injects full Release 1 spell pool; now uses hero content loadout with unsupported-ID warnings and Milo safe fallback.
- Fixed: hero spell slots no longer pad short loadouts with Fireball; empty battle slots are disabled/no-op, preserve hero loadout order, and hotkeys cannot cast non-loadout filler spells.
- Fixed: stage-goal progression now uses stage-specific runtime semantics (cupcake/royal block clears, objective-based machine/crate/guard progression, combo target progression) and added real boss-fight consequence mechanics for success/fail paths.
- Fixed: boss-phase board-size modifier function is now actively called in boss phase transition flow.
- Fixed: route support content integration now references `route-barks.json` and `route-voice-tags.json` in runtime and presents them in route dialogue scene.
- Fixed: route/story asset folders required by manifest are scaffolded with `.gitkeep`.
- Added: narrow `npm test` smoke harness for remediation invariants, including exact hero-to-runtime spell loadout checks.
- Remains: full manual gameplay smoke proof, full portrait-scene screenshot proof, and `sync:assets` script path mismatch in current repository.
- P0 status in this pass: hero spell-loadout and stage-goal P0s are code/runtime-smoke closed.
- P1 status in this pass: partially closed.

## 2. Files Changed
| File | Reason | P0/P1 Finding Addressed |
| --- | --- | --- |
| `src/game/systems/HeroSystem.ts` | Removed full spell-pool injection, enforced hero-specific loadout validation/fallback | P0.1 |
| `src/game/scenes/BattleScene.ts` | Stage-goal progression hooks switched to stage-specific methods; boss phase board-size call wired; spell hotkey list aligned to active run spell slots with disabled empty slots | P0.1, P0.2, P1.3 |
| `src/game/content/heroes/metadata.json` | Starting-spell metadata updated to match active hero loadout content IDs | P0.1 |
| `src/game/systems/StageGoalSystem.ts` | Added stage-specific progression methods and real boss consequence mechanics | P0.2 |
| `src/game/content/stage-goals/stage1-lost-cupcakes.json` | Stage-specific target type | P0.2 |
| `src/game/content/stage-goals/stage2-machines.json` | Stage-specific target type | P0.2 |
| `src/game/content/stage-goals/stage3-crates.json` | Stage-specific target type | P0.2 |
| `src/game/content/stage-goals/stage4-guards.json` | Stage-specific target type | P0.2 |
| `src/game/content/stage-goals/stage6-royal-seals.json` | Stage-specific target type | P0.2 |
| `src/game/systems/BoardSizeModifierSystem.ts` | Added dynamic content-backed board-size modifier consumption from active random events | P1.3 |
| `src/game/systems/RouteStorySystem.ts` | Loaded route bark and voice-tag content and exposed runtime accessors | P1.1 |
| `src/game/scenes/RouteDialogueScene.ts` | Added runtime bark/voice-tag presentation; improved viewport-derived layout sizing | P1.1, P1.2 |
| `src/game/content/heroes/poplin_professor.json` | Gated extra hero out of active Release 1 route scope | P0.1/P1 scope safety |
| `src/game/content/heroes/bloop_slime_friend.json` | Gated extra hero out of active Release 1 route scope | P0.1/P1 scope safety |
| `package.json` | Added `test` script | P1.4 |
| `tests/run-remediation-smoke.mjs` | Added focused remediation smoke checks, exact hero runtime loadout checks, and short-loadout slot regression coverage | P0.1, P1.4 |
| `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_SMOKE_2026_05_21.md` | Required smoke record | P1.4 |
| `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_REPORT_2026_05_21.md` | Required remediation report | Audit follow-up |

## 3. P0 Closure Evidence
| Finding | Before | After | Evidence | Status |
| --- | --- | --- | --- | --- |
| P0.1 Hero spell-loadout logic | All runs injected full `RELEASE_1_SPELL_CONTENT_IDS`; short battle loadouts could be padded with Fireball | Run uses hero-defined loadout only; unsupported spell IDs are warned+ignored; Milo has safe fallback; battle spell slots preserve loadout order; empty slots are disabled/no-op | `HeroSystem.ts`, `BattleScene.ts`, `tests/run-remediation-smoke.mjs`, `npm.cmd run test` pass, Playwright runtime smoke at `360x640` | Code/smoke closed |
| P0.2 Stage goals vs SOT semantics | Mostly generic `battle_objective` counters; some text-only boss effects | Stage-goal semantics split by stage signals; boss consequences apply real state/hazard/shield/speed changes | `StageGoalSystem.ts`, stage-goal JSON target types, Playwright runtime smoke for Stage 1-6 progress and boss success/fail consequences | Code/runtime-smoke closed |

## 4. P1 Closure Evidence
| Finding | Before | After | Evidence | Status |
| --- | --- | --- | --- | --- |
| P1.1 Route integration completeness | barks/voice-tags not runtime referenced | route barks and voice tags loaded and rendered in route scene | `RouteStorySystem.ts`, `RouteDialogueScene.ts` | Partial |
| P1.2 Portrait-mobile outside battle | Route dialogue used fixed Y coordinates | Route dialogue converted to viewport-section based positions/sizing | `RouteDialogueScene.ts` | Partial (other scenes still need screenshot proof) |
| P1.3 Board-size modifier behavior | `applyBossPhaseBoardSize()` unused; dynamic content not consumed | Boss phase call wired; dynamic event board-size modifiers consumed | `BattleScene.ts`, `BoardSizeModifierSystem.ts` | Partial |
| P1.4 Regression/smoke coverage and scripts | no `npm test` script | `npm test` now exists and checks critical invariants, exact hero spell loadouts, and short-loadout slot behavior | `package.json`, `tests/run-remediation-smoke.mjs` | Partial |
| P1.5 Route/story asset fallback readiness | required route/story folders missing | required folders scaffolded with `.gitkeep` | filesystem scaffold + smoke script check | Partial |

## 5. Commands Run
| Command | Result | Notes |
| --- | --- | --- |
| `npm.cmd run validate:content` | Pass | 335 JSON files, 36 route scenes |
| `npm.cmd run validate:metadata` | Pass | metadata validation passed |
| `npm.cmd run validate:animations` | Pass with warnings | missing frame warnings remain non-fatal |
| `npm.cmd run sync:assets` | Fail | Script file `scripts/sync-asset-runtime-map.mjs` missing in repo |
| `npm.cmd run audit:asset-variants` | Pass with warnings | placeholder/missing optional variants still present |
| `npm.cmd run build` | Pass | TypeScript + Vite build succeeded after hero spell-slot fix |
| `npm.cmd run test` | Pass | remediation smoke script passed with exact hero loadout and empty-slot regression assertions |
| `npm.cmd run lint` | Not run | lint script not present |

## 6. Smoke/Test Evidence
- Automated: `npm.cmd run test` passed and validated targeted P0/P1 invariants, including exact Release 1 hero loadouts and no Fireball padding for Bruk's short loadout.
- Runtime: Playwright smoke at `360x640` confirmed all six Release 1 heroes entered a fight room with battle spell button IDs matching `runState.spells` in order. Bruk's third hotkey did not spend mana or increment `spellsCast`.
- Runtime: Playwright smoke confirmed Stage 1-6 goals completed through their stage-specific hooks and each boss success/fail consequence mutated real runtime state.
- Manual: detailed checklist recorded in `docs/audits/BLOCKMANCER_P0_P1_REMEDIATION_SMOKE_2026_05_21.md`; most gameplay/screenshot items remain Not Run in this environment.

## 7. Remaining Risks
- Hero spell-loadout P0 has code, automated smoke, and Playwright runtime smoke for the known full-pool, ordering, and short-slot regressions. Additional screenshot artifacts are optional visual evidence, not a known blocker.
- Stage-goal P0 has code and Playwright runtime smoke for all six progress paths and boss success/fail consequences. Additional full playthrough evidence is useful release confidence, not a known blocker.
- Portrait-mobile verification remains incomplete for Reward/Event/Shop/Victory scenes at all target resolutions.
- `sync:assets` gate is currently broken due to missing script path; unresolved until tooling path is fixed.
- Route progression/endings persistence still needs full interactive run-through evidence.

## 8. Recommended Next Step
Run an execution-only QA pass that does no new system work:
- Fix/restore `sync:assets` script path.
- Continue the remaining route/endings/hazard/portrait smoke checklist with screenshot artifacts at target portrait sizes.
- Record exact pass/fail with route choice traces, ending unlock persistence, hazard counter traces, and portrait-scene screenshots in an updated smoke report.
