# Story 1.3: Resolve Cascade Gravity

Status: review

## Story

As a player,
I want cleared lines to cascade by column,
so that the board identity feels distinct from classic row shifting.

## Acceptance Criteria

1. Given a placed piece completes one or more lines, when line resolution runs, completed cells are removed.
2. Given unsupported cells remain above cleared spaces, when gravity resolves, blocks fall deterministically within their own columns.
3. Given gravity creates new completed lines, when cascade resolution continues, the system detects and clears those lines until the board is stable.
4. Given cascade resolution finishes, when the result is returned, `CascadeResult` records `totalLinesCleared`, `cascadeCount`, `clearedLinesPerCascade`, `blocksDropped`, `specialBlocksTriggered`, and `causedCombo`.
5. Given junk/hazard cells that intentionally anchor board pressure are present, when gravity resolves, existing block-specific behavior is preserved and no board corruption occurs.
6. Given this story is implemented, when verification runs, deterministic cascade smoke coverage proves single-line, multi-line, chained-cascade, no-clear, and anchored-junk scenarios.

## Tasks / Subtasks

- [x] Audit current cascade behavior before editing (AC: 1-6)
  - [x] Read `src/game/systems/BoardSystem.ts` and identify the current flow from `lockPiece()` to `clearLinesCascade()`.
  - [x] Confirm current helper responsibilities: `detectCompletedLines`, `removeCompletedLines`, `applyCascadeGravity`, `handleSpecialBlockClear`.
  - [x] Record whether any implementation change is actually needed beyond testability and smoke coverage.
- [x] Preserve or correct Cascade Gravity behavior (AC: 1-5)
  - [x] Keep line removal before gravity.
  - [x] Keep column-local falling; do not introduce row shifting.
  - [x] Keep repeated detection after each gravity pass.
  - [x] Preserve existing special-block trigger collection and anchored junk behavior unless a failing test proves it is wrong.
  - [x] Keep `CascadeResult` shape compatible with `src/game/types/GameTypes.ts`.
- [x] Add deterministic cascade smoke coverage (AC: 6)
  - [x] Add test cases for no-clear, one-line clear, multi-line clear, chained cascade, and anchored junk.
  - [x] Use the existing `npm test` path through `tests/run-remediation-smoke.mjs` unless a tighter project-native harness is added with clear rationale.
  - [x] Avoid visual-only or screenshot-only validation for this story; the core board mutation must be asserted deterministically.
- [x] Verify combat integration is not regressed (AC: 4)
  - [x] Confirm `CombatSystem.resolveCascadeClear()` still consumes `CascadeResult`.
  - [x] Confirm Story 1.4 remains responsible for reward tuning; this story only protects board/cascade result integrity.
- [x] Run required checks (AC: 1-6)
  - [x] `npm test`
  - [x] `npm run build`
  - [x] If content or metadata is touched unexpectedly, also run `npm run validate:content` and `npm run validate:metadata`.

## Dev Notes

### Story Context

This is a stabilization story for the core board mechanic. Readiness review recommends starting high-risk implementation with Cascade Gravity tests/smoke before broad feature expansion. The goal is not to redesign the board system; the goal is to protect and, only if needed, correct the existing behavior.

Source requirement:

- FR2: The board must preserve Cascade Gravity as the core line-clear behavior: detect completed lines, remove cleared cells, apply deterministic per-column gravity, repeat until stable, and return a `CascadeResult`. [Source: bmad-output/planning-artifacts/epics.md#Functional-Requirements]

Full repo audit addendum:

- `docs/audits/BLOCKMANCER_FULL_REPO_AUDIT_2026_05_21.md` classifies Cascade Gravity as implemented and already one of the stronger project areas. Treat this story as regression coverage and stabilization first, not a rewrite.
- The audit's gap for Cascade Gravity is smoke verification: deterministic evidence is missing even though the runtime path exists.
- The audit also identifies P0/P1 release risks in hero spell loadouts, stage-goal runtime behavior, route presentation, portrait-mobile scene overflow, and board-size modifiers. Those are out of scope for this story and should become separate stories; do not mix them into Cascade Gravity implementation.
- The audit says `npm run test` was not available at audit time, but current `package.json` has `npm test` wired to `tests/run-remediation-smoke.mjs`. Use the current package script unless it fails for a real project reason.

### Current Implementation Snapshot

Current files and behavior found during story creation:

- `src/game/systems/BoardSystem.ts`
  - `lockPiece()` places the current piece into `grid`, calls `clearLinesCascade()`, then spawns the next piece.
  - `clearLinesCascade()` currently detects completed lines, removes cells, records animation frames, applies gravity, repeats detection, sets `causedCombo`, and returns `CascadeResult`.
  - `applyCascadeGravity()` is column-based and does not perform classic row shifting.
  - Anchored junk behavior exists: `isJunkBlockCell()` causes junk-like cells to hold their row and block falling through them.
  - `clearLinesCascade()` is currently private; if tests need direct access, prefer the smallest safe test seam over a broad refactor.
- `src/game/types/GameTypes.ts`
  - Defines `CascadeResult`, `CascadeAnimationFrame`, `ClearedBoardCell`, `BoardTickResult`, `BoardCell`, and `BoardBlockCell`.
- `src/game/systems/CombatSystem.ts`
  - `resolveCascadeClear(cascade: CascadeResult)` consumes `cascadeCount`, `totalLinesCleared`, `blocksDropped`, and `specialBlocksTriggered`.
- `tests/run-remediation-smoke.mjs`
  - Existing `npm test` entry point.
  - Currently checks several release-remediation invariants but does not yet assert Cascade Gravity behavior.
- `package.json`
  - `npm test` runs `node tests/run-remediation-smoke.mjs`.
  - `npm run build` runs `tsc --noEmit && vite build`.

### Architecture Compliance

Follow these architecture rules:

- Preserve the existing Phaser 3 + TypeScript + Vite + Capacitor stack. No engine migration, no starter template, no board rewrite. [Source: bmad-output/game-architecture.md#Engine-&-Framework]
- Keep board computation in `BoardSystem`; scenes render and orchestrate. [Source: bmad-output/game-architecture.md#Project-Structure]
- Use the Cascade Gravity Domain Pattern: piece lock -> `BoardSystem` clear/cascade -> `CascadeResult` -> `CombatSystem` rewards/damage -> `BattleScene` render/log/save. [Source: bmad-output/game-architecture.md#Cascade-Gravity-Domain-Pattern]
- Do not add a global event bus or broad abstraction for this story. [Source: bmad-output/game-architecture.md#Communication-Patterns]
- Board/cascade code is a hot path; avoid allocation-heavy per-frame logic and keep computation deterministic. [Source: bmad-output/project-context.md#Performance-Rules]

### Implementation Guardrails

- Do not replace Cascade Gravity with classic row shifting.
- Do not move board rules into `BattleScene`.
- Do not rewrite piece spawning, hold, next queue, spell systems, route systems, or rewards for this story.
- Do not change save schema for this story.
- Do not rename content IDs, asset keys, or block IDs.
- Do not remove fallback behavior for legacy numeric cells or board-block cells.
- Keep `CascadeResult` backward-compatible. If adding fields, make them optional and do not break `CombatSystem`.
- If exposing a test seam, keep it narrow. Acceptable options include making `clearLinesCascade()` public with a clear comment, adding a targeted debug/test-only helper, or adding a pure internal cascade helper only if it reduces complexity.
- Preserve anchored junk behavior unless deterministic tests show it violates current design. If changed, document the gameplay reason in the story completion notes.

### Deterministic Smoke Scenarios

The developer should add deterministic assertions for at least:

1. **No clear:** partially filled board resolves with `totalLinesCleared = 0`, `cascadeCount = 0`, `causedCombo = false`, and no grid mutation beyond the locked piece.
2. **Single-line clear:** one completed row is removed and unsupported blocks above fall within their columns.
3. **Multi-line clear:** two or more completed rows in the same pass produce `clearedLinesPerCascade[0]` equal to the number cleared.
4. **Chained cascade:** gravity creates another complete line, causing `cascadeCount > 1`, `causedCombo = true`, and multiple `clearedLinesPerCascade` entries.
5. **Anchored junk:** junk-like cells preserve their intended anchoring behavior and do not corrupt columns.
6. **Special block trigger:** clearing a board-block cell with clear effects records the block/effect in `specialBlocksTriggered`.

### Project Structure Notes

Expected touched files:

- `src/game/systems/BoardSystem.ts` only if behavior or a narrow test seam is needed.
- `tests/run-remediation-smoke.mjs` for smoke coverage.
- Optional: a new focused test helper under `tests/` if keeping the existing smoke file readable requires splitting.

Files that should normally not be touched:

- `src/game/scenes/BattleScene.ts`
- `src/game/systems/CombatSystem.ts`
- `src/game/systems/SaveSystem.ts`
- `src/game/content/**`
- `public/assets/**`

### Project Context Rules

- Phaser `^3.90.0`, TypeScript `^5.8.3`, Vite `^7.0.0`, Capacitor `^7.0.1`.
- Primary viewport is portrait-first `720x1280`; this story is board-logic focused, so no UI redesign is expected.
- Preserve pixel-art rendering settings if touching game config, though game config changes are not expected.
- Runtime must remain fallback-safe.
- Source-of-truth precedence starts at `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`, with core design in `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`.
- High-risk areas need tests or smoke checks; Cascade Gravity is explicitly high risk.

### Testing Requirements

Required:

```bash
npm test
npm run build
```

Conditional:

```bash
npm run validate:content
npm run validate:metadata
```

Only run the conditional commands if implementation unexpectedly touches content or metadata.

Build note: previous project context says Vite/esbuild may need escalation in this Codex sandbox. Treat sandbox-only build failure separately from project defects and report exact output.

### References

- [Epics Story 1.3](../../planning-artifacts/epics.md)
- [Project Context](../project-context.md)
- [Game Architecture](../game-architecture.md)
- [Readiness Report](../planning-artifacts/implementation-readiness-report-2026-05-21.md)
- [Full Repo Audit](../../docs/audits/BLOCKMANCER_FULL_REPO_AUDIT_2026_05_21.md)
- [GDD Cascade Gravity](../../docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md)
- [Release Implementation SOT](../../docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md)
- [BoardSystem](../../src/game/systems/BoardSystem.ts)
- [GameTypes](../../src/game/types/GameTypes.ts)
- [CombatSystem](../../src/game/systems/CombatSystem.ts)
- [Smoke Harness](../../tests/run-remediation-smoke.mjs)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm test` failed initially on pre-existing route/story scaffold smoke expectations: missing `public/assets/icons/story-routes/.gitkeep` and `public/assets/stage-backgrounds/route-scenes/.gitkeep`.
- Added the missing empty scaffold files because they were already required by the existing smoke gate and the full repo audit.
- `npm test` passed after scaffold files and Cascade Gravity smoke coverage were added.
- `npm run build` passed with `tsc --noEmit && vite build`.

### Completion Notes List

- Extracted Cascade Gravity resolution into `src/game/systems/CascadeGravitySystem.ts` so the same deterministic line-clear/gravity loop used by `BoardSystem` can be smoke-tested without loading Phaser/Vite runtime.
- Kept `BoardSystem` behavior equivalent: line removal before gravity, per-column falling, repeated cascade detection, anchored junk blocking, special-block trigger collection, and `CascadeResult` compatibility are preserved.
- Added deterministic smoke coverage for no-clear, single-line, multi-line, chained cascade, anchored junk, and special-block trigger scenarios.
- Wired the existing `npm test` remediation smoke harness to run the Cascade Gravity smoke suite.
- Added two missing route/story scaffold `.gitkeep` files required by the existing smoke harness and the full repo audit.

### File List

- `src/game/systems/CascadeGravitySystem.ts`
- `src/game/systems/BoardSystem.ts`
- `tests/cascade-gravity-smoke.mjs`
- `tests/run-remediation-smoke.mjs`
- `public/assets/icons/story-routes/.gitkeep`
- `public/assets/stage-backgrounds/route-scenes/.gitkeep`
- `.gitignore`
- `bmad-output/implementation-artifacts/1-3-resolve-cascade-gravity.md`

### Change Log

- 2026-05-21: Implemented Story 1.3 Cascade Gravity stabilization and deterministic smoke coverage; story moved to review.
