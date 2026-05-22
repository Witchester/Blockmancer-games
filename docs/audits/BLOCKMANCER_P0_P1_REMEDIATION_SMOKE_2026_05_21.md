# Blockmancer Dungeon - P0/P1 Remediation Smoke (2026-05-21)

## Environment
- Workspace: `C:\Users\binh.pc\Desktop\New folder`
- Date: 2026-05-21
- Mode: code-level + automated smoke script

## Automated Smoke
- `npm.cmd run test` -> Pass (`tests/run-remediation-smoke.mjs`)
- `npm.cmd run validate:content` -> Pass (`335` JSON files, `36` route scenes)
- `npm.cmd run validate:metadata` -> Pass
- `npm.cmd run build` -> Pass
- Playwright runtime smoke at `360x640` against `http://127.0.0.1:5173` -> Pass for hero spell loadout state/button IDs.
- Playwright runtime smoke against `http://127.0.0.1:5173` -> Pass for Stage 1-6 stage-goal progress and boss success/fail consequences.
- Coverage from smoke script:
- Hero loadout no longer injects full Release 1 spell pool.
- Release 1 route heroes have exact expected runtime spell loadouts mapped from hero content.
- Short hero loadouts do not receive Fireball or any other non-loadout slot filler.
- Empty battle spell slots are represented as disabled/no-op slots.
- Battle spell buttons preserve `runState.spells` order for all six Release 1 route heroes.
- Stage-goal target semantics match SOT stage-specific goal types.
- Stage-goal runtime progress completes through stage-specific hooks for all six stages.
- Boss start consequences mutate real state for success and fail paths across all six stages.
- Boss-phase board-size call is wired.
- Route barks/voice-tags are runtime-referenced.
- Route/story asset scaffold folders exist.

## Manual Checklist
1. New run with Milo: Pass (Playwright runtime smoke).
2. Verify Milo spell loadout is not full Release 1 spell pool: Pass (code + automated smoke).
3. Verify each Release 1 hero has intended starting spells: Pass (content + exact automated smoke + Playwright runtime smoke).
4. Verify Bruk battle slots show only Snack Break and Bomb Rune, with empty slots disabled/no-op: Pass (code + automated smoke + Playwright runtime smoke; hotkey 3 left mana and `spellsCast` unchanged).
5. Stage 1 goal progress and boss consequence: Pass (runtime smoke: cupcakes complete; success delays sticky pressure; fail queues warned sticky pressure).
6. Stage 2 goal progress and boss consequence: Pass (runtime smoke: machines complete; success delays boss attacks; fail overclocks boss attack counter).
7. Stage 3 goal progress and boss consequence: Pass (runtime smoke: crates complete; success grants 8 player shield; fail raises fall speed and advances pressure).
8. Stage 4 goal progress and boss consequence: Pass (runtime smoke: guards complete; success grants sleep guard pieces; fail grants boss shield).
9. Stage 5 goal progress and boss consequence: Pass (runtime smoke: combo target completes; success sets Fever to 50; fail grants boss shield).
10. Stage 6 goal progress and boss consequence: Pass (runtime smoke: royal seals complete; success weakens King Bloxley HP; fail queues royal pattern pressure).
11. Route event trigger for each hero/stage or scripted equivalent: Not Run (full runtime traversal not executed).
12. Practical/True/Risky route choice applies real state change: Not Run (manual route scene play required).
13. Route save/load persists progress: Not Run (manual route save/load scenario not executed).
14. Boss callback is visible and mechanically applied: Not Run (manual boss entry required).
15. Normal/True/Risky Variant ending unlocks persist: Not Run (full-run playthrough required).
16. Incoming junk warning and counter: Not Run.
17. Floating block warning and counter: Not Run.
18. Freeze warning and Hot Cocoa counter: Not Run.
19. Preview hidden warning and Preview Glasses counter: Not Run.
20. Speed wave warning and Speed Brake counter: Not Run.
21. Low ceiling warning and Tent Pole/Safety Net counter: Not Run.
22. Royal pattern warning and Royal Eraser/counter path: Not Run.
23. RouteDialogueScene at 360x640: Not Run (no screenshot capture executed).
24. RewardScene at 360x640: Not Run.
25. EventScene at 360x640: Not Run.
26. ShopScene at 360x640: Not Run.
27. VictoryScene at 360x640: Not Run.
28. Route/story missing asset fallback: Pass (folder scaffold + runtime fallback paths remain; unresolved asset behavior requires in-game manual confirmation).
29. Audio fallback remains non-blocking: Not Run in gameplay; prior asset audit still reports fallback-safe behavior.

## Hero Spell Runtime Evidence

Playwright runtime smoke forced each Release 1 route hero into a fight room and inspected `runState.spells` plus `BattleScene.spellButtons`:

| Hero | `runState.spells` / button IDs |
| --- | --- |
| Milo | `fireball`, `frost-lock` |
| Pippa | `fireball`, `cupcake-blast`, `bomb-rune` |
| Nixie | `frost-lock`, `snowcone-burst`, `clean-cut` |
| Bruk | `snack-break`, `bomb-rune` |
| Zuzu | `goblin-gadget`, `bomb-rune`, `fireball` |
| Lumi | `star-spark`, `cascade-cheer`, `rainbow-reroll` |

Bruk empty-slot regression check: pressing the third spell hotkey left mana at `999` and `spellsCast` at `0`.

## Stage Goal Runtime Evidence

Playwright runtime smoke exercised `StageGoalSystem` through the running game instance for all six stages:

| Stage | Progress proof | Success consequence | Fail consequence |
| --- | --- | --- | --- |
| 1 | `cupcake_recovered` reached `3/3` | Boss attack counter/interval increased; cleanup coupon pieces set to `2` | `hazard_incoming_junk_queue` queued with sticky pressure |
| 2 | `machine_disabled` reached `2/2` | Boss attack counter/interval increased | Boss attack counter reduced from `3` to `2` |
| 3 | `crate_saved` reached `3/3` | Player shield increased to `8` | Fall speed increased to `1.05`; boss attack counter reduced |
| 4 | `guard_kept_asleep` reached `2/2` | Sleep guard pieces set to `3` | Boss shield increased to `6` |
| 5 | `combo_score` reached `4/4` | Fever set to `50` | Boss shield increased to `6` |
| 6 | `royal_seal_broken` reached `3/3` | King Bloxley HP reduced from `280` to `246` | `hazard_royal_pattern` queued with amount `3` |

## Steps For Next Manual Runner
1. Run `npm.cmd run dev`.
2. Play each Release 1 hero through at least Stage 1 route scene and one boss entry.
3. Capture portrait screenshots at `390x844`, `412x915`, `540x960`, `720x1280` if visual artifact proof is needed beyond the `360x640` runtime smoke.
4. Verify endings and route save/load persistence across reload.
