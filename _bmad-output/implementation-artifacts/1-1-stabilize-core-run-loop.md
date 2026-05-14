# Story 1.1: Stabilize Core Run Loop

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a release-focused game developer,
I want the current run loop to be stable from new run through victory or defeat,
so that future content, UX, and balance work can build on a playable baseline without chasing scene-flow crashes.

## Acceptance Criteria

1. A new run can be started from the main menu, routed through hero select, enter the map, and reach the first playable room without a crash.
2. Continue can load a saved run and route to the correct scene for map, battle, reward, non-combat room, game-over, or victory states.
3. Map progression can enter fight, elite, boss, event, shop, rest, and treasure rooms through existing systems; each room has a clear path back to map or battle where applicable.
4. Battle resolution routes cleanly to reward, game over, or victory. Boss victory and final victory preserve the intended meta-state updates and terminal save behavior.
5. Reward claim, stage advance after boss, and node completion leave `RunState` in a valid state with visible UI feedback and event-log feedback where relevant.
6. One full manual run can be completed or fail cleanly without normal gameplay console errors.
7. `npm run build` passes after implementation.

## Tasks / Subtasks

- [ ] Trace and harden run entry points. (AC: 1, 2)
  - [ ] Verify `MainMenuScene` start and continue paths call existing `BlockmancerGame.newRun()`, `loadRun()`, and `saveRun()` consistently.
  - [ ] Verify `HeroSelectScene` starts map only after an unlocked hero is selected and leaves `runStatus` as `map`.
  - [ ] Verify `MainMenuScene.getContinueScene()` handles every current `RunStatus` and non-combat `currentRoomProgress === 'entered'` route.
- [ ] Trace and harden map-to-room progression. (AC: 3, 5)
  - [ ] Verify `MapScene.handleNodeClick()` and `MapSystem.moveToNode()` agree on `currentNodeId`, `currentRoomType`, and `currentRoomProgress`.
  - [ ] Verify event, shop, rest, and treasure scenes set `runStatus`, save before transitions, and return to map with state changes preserved.
  - [ ] Add missing guardrails only where a scene can currently crash on missing or invalid state; prefer returning to `MapScene` with a log entry over introducing new scene types.
- [ ] Trace and harden battle resolution. (AC: 4, 5)
  - [ ] Verify `BattleScene` can spawn or reuse `activeEnemy` for fight, elite, and boss rooms.
  - [ ] Verify player death/top-out routes through `finishRun(false)` to `GameOverScene` and clears the active run save intentionally.
  - [ ] Verify enemy defeat routes to `RewardScene`, boss reward/stage advance, or final victory without leaving stale `activeEnemy`, `pendingRewards`, or `pendingStageAdvance`.
- [ ] Trace and harden reward completion. (AC: 4, 5)
  - [ ] Verify `RewardScene.claimReward()` clears pending rewards, applies post-battle effects, completes nodes, advances stages after boss, and saves map continuation.
  - [ ] Verify final victory from reward path updates `victory`, `runStatus`, `metaSystem.state.normalEndingFinished`, and clears the run save intentionally.
- [ ] Add or update focused manual QA notes if the fix changes the expected run-loop workflow. (AC: 6)
  - [ ] Capture at least: new run, continue from map, continue from battle, continue from reward, defeat, boss stage advance, and final victory.
  - [ ] Keep documentation changes minimal and close to existing docs if needed.
- [ ] Run verification. (AC: 6, 7)
  - [ ] Run `npm run build`.
  - [ ] Manually smoke-test the run loop in browser where practical because Phaser scene/input issues can pass TypeScript checks.

## Dev Notes

### Current Run-Loop Shape

- `BlockmancerGame` owns the shared `runState` plus global systems. Use those existing systems rather than creating new scene-level singletons. Key entry points are `newRun()`, `loadRun()`, `saveRun()`, and `clearSave()` in `src/game/BlockmancerGame.ts`.
- `RunStatus` is currently `'menu' | 'map' | 'battle' | 'reward' | 'game-over' | 'victory'`. `CurrentRoomProgress` is currently `'idle' | 'entered' | 'cleared' | 'reward' | 'complete'`. Keep route decisions aligned with these types in `src/game/types/GameTypes.ts`.
- `createDefaultRunState()` and `normalizeRunState()` already provide defaults and backward compatibility for old `currentEnemy` and `currentRoom` save shapes. Do not remove those migration paths while stabilizing the loop.
- `SaveSystem` writes the active run to localStorage and returns raw data for normalization. Terminal run states currently clear the active run save intentionally.

### Scene Flow To Preserve

- Boot: `BootScene` starts `MainMenuScene`.
- New run: `MainMenuScene` starts `HeroSelectScene`; `HeroSelectScene` applies the selected hero, sets `runStatus = 'map'`, saves, then starts `MapScene`.
- Continue: `MainMenuScene.getContinueScene()` routes `battle` to `BattleScene`, `reward` to `RewardScene`, terminal states to `GameOverScene`, entered non-combat rooms to their room scenes, and otherwise falls back to `MapScene`.
- Map: `MapScene.handleNodeClick()` uses `MapSystem.moveToNode()`. Combat rooms call `startBattle()`, set `activeEnemy`, `lastBattleWasBoss`, `currentRoomProgress = 'entered'`, `runStatus = 'battle'`, save, then start `BattleScene`.
- Battle: `BattleScene.handleVictory()` routes normal/elite wins to rewards, non-final boss wins to boss rewards plus stage advance, and final boss wins to `GameOverScene` with victory.
- Rewards: `RewardScene.claimReward()` applies reward effects, clears battle state, completes nodes or advances after boss, saves map continuation, and routes to `MapScene`; final victory routes to `GameOverScene`.
- Defeat: `BattleScene.finishRun(false)` sets terminal state, clears save, and starts `GameOverScene`.

### Implementation Guardrails

- Keep fixes scoped. This story is stabilization, not a redesign of scenes, content, rewards, or saves.
- Prefer reusing `MapSystem`, `RewardSystem`, `EnemySystem`, `BossSystem`, `StageSystem`, `MetaSystem`, and existing UI classes over duplicating logic in scenes.
- If a missing-state fallback is needed, use a visible screen transition and event-log message where possible. Silent returns are acceptable only when the current code already uses them and no user-visible action was attempted.
- Do not add a unit test framework in this story. The project currently relies on build validation and manual gameplay smoke checks.
- Avoid save-model expansion unless required to stop a crash. Save migration hardening is Story 1.2.
- Avoid tutorial/settings changes unless they directly block the core loop. Tutorial and settings are Story 1.3.
- Avoid content registry breadth changes unless a missing content fallback blocks run-loop completion. Content breadth starts in Epic 2.

### Project Structure Notes

- Scene files live in `src/game/scenes`.
- Shared systems live in `src/game/systems`.
- Run-state types live in `src/game/types/GameTypes.ts`.
- Default and normalized run-state construction lives in `src/game/data/defaultRunState.ts`.
- UI primitives live in `src/game/ui`; do not duplicate button, card, HUD, event log, or progress bar behavior inside scenes.
- Documentation and manual QA notes belong under `docs/` if a persistent note is needed.

### Project Context Rules

- The game is a browser-based TypeScript/Phaser project with Vite, Capacitor, ESM package mode, strict-compatible TypeScript, and `tsc --noEmit && vite build` as the production build gate.
- Run state must remain JSON-serializable because saves use localStorage through `SaveSystem`.
- Phaser scenes should orchestrate rendering, input, and transitions; persistent logic belongs in systems.
- The game is portrait-first at `720x1280` with `Phaser.Scale.FIT`; any visible loop feedback must remain readable in mobile portrait.
- Board behavior is deterministic grid logic, not physics.
- Content IDs must remain stable across save data, content JSON, and systems.
- Do not overwrite user changes in this dirty working tree; keep edits narrow and inspect files before changing them.

### Testing Requirements

- Required automated check: `npm run build`.
- Required manual smoke path:
  1. Start a new run from `MainMenuScene`.
  2. Select a hero and reach `MapScene`.
  3. Enter at least one fight and resolve it to `RewardScene`.
  4. Claim a reward and return to `MapScene`.
  5. Refresh or restart from at least map, battle, and reward saves and verify Continue routes correctly.
  6. Trigger or play to defeat and verify `GameOverScene` appears without a crash.
  7. Play or force a boss win path and verify stage advance or final victory behavior.
- Optional if touched: run `npm run validate:metadata` and `npm run validate:content` only when content JSON or metadata changes.

### References

- [Source: _bmad-output/planning-artifacts/blockmancer-epics.md#Story 1.1: Stabilize Core Run Loop]
- [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: docs/TECHNICAL_DESIGN.md#Scene Architecture]
- [Source: docs/TECHNICAL_DESIGN.md#Game State Model]
- [Source: docs/TECHNICAL_DESIGN.md#Save/Load Flow]
- [Source: docs/17_DEFINITION_OF_DONE.md#Feature done]
- [Source: docs/17_DEFINITION_OF_DONE.md#Scene done]
- [Source: docs/12_RELEASE_CHECKLIST.md#General release gates]
- [Source: src/game/BlockmancerGame.ts]
- [Source: src/game/data/defaultRunState.ts]
- [Source: src/game/systems/SaveSystem.ts]
- [Source: src/game/systems/MapSystem.ts]
- [Source: src/game/scenes/MainMenuScene.ts]
- [Source: src/game/scenes/HeroSelectScene.ts]
- [Source: src/game/scenes/MapScene.ts]
- [Source: src/game/scenes/BattleScene.ts]
- [Source: src/game/scenes/RewardScene.ts]
- [Source: src/game/scenes/GameOverScene.ts]

## Dev Agent Record

### Agent Model Used

TBD by dev agent

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
