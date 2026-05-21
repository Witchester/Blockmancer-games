# Blockmancer Dungeon — P0/P1 Remediation Smoke (2026-05-21)

## Environment
- Workspace: `C:\Users\binh.pc\Desktop\New folder`
- Date: 2026-05-21
- Mode: code-level + automated smoke script

## Automated Smoke
- `npm.cmd run test` → Pass (`scripts/run-remediation-smoke.mjs`)
- Coverage from smoke script:
- Hero loadout no longer injects full Release 1 spell pool.
- Release 1 route heroes have explicit starting loadouts.
- Stage-goal target semantics match SOT stage-specific goal types.
- Boss-phase board-size call is wired.
- Route barks/voice-tags are runtime-referenced.
- Route/story asset scaffold folders exist.

## Manual Checklist
1. New run with Milo: Not Run (interactive gameplay not executed in this environment).
2. Verify Milo spell loadout is not full Release 1 spell pool: Pass (code + automated smoke).
3. Verify each Release 1 hero has intended starting spells: Pass (content + automated smoke).
4. Stage 1 goal progress and boss consequence: Not Run (manual play required).
5. Stage 2 goal progress and boss consequence: Not Run (manual play required).
6. Stage 3 goal progress and boss consequence: Not Run (manual play required).
7. Stage 4 goal progress and boss consequence: Not Run (manual play required).
8. Stage 5 goal progress and boss consequence: Not Run (manual play required).
9. Stage 6 goal progress and boss consequence: Not Run (manual play required).
10. Route event trigger for each hero/stage or scripted equivalent: Not Run (full runtime traversal not executed).
11. Practical/True/Risky route choice applies real state change: Not Run (manual route scene play required).
12. Route save/load persists progress: Not Run (manual route save/load scenario not executed).
13. Boss callback is visible and mechanically applied: Not Run (manual boss entry required).
14. Normal/True/Risky Variant ending unlocks persist: Not Run (full-run playthrough required).
15. Incoming junk warning and counter: Not Run.
16. Floating block warning and counter: Not Run.
17. Freeze warning and Hot Cocoa counter: Not Run.
18. Preview hidden warning and Preview Glasses counter: Not Run.
19. Speed wave warning and Speed Brake counter: Not Run.
20. Low ceiling warning and Tent Pole/Safety Net counter: Not Run.
21. Royal pattern warning and Royal Eraser/counter path: Not Run.
22. RouteDialogueScene at 360x640: Not Run (no screenshot capture executed).
23. RewardScene at 360x640: Not Run.
24. EventScene at 360x640: Not Run.
25. ShopScene at 360x640: Not Run.
26. VictoryScene at 360x640: Not Run.
27. Route/story missing asset fallback: Pass (folder scaffold + runtime fallback paths remain; unresolved asset behavior requires in-game manual confirmation).
28. Audio fallback remains non-blocking: Not Run in gameplay; prior asset audit still reports fallback-safe behavior.

## Steps For Next Manual Runner
1. Run `npm.cmd run dev`.
2. Play each Release 1 hero through at least Stage 1 route scene and one boss entry.
3. Capture portrait screenshots at `360x640`, `390x844`, `412x915`, `540x960`, `720x1280`.
4. Verify stage goals and boss consequences in real combat (success and fail paths).
5. Verify endings and route save/load persistence across reload.
