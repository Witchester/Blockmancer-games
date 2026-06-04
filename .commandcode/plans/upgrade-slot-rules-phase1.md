# Phase 1 — Upgrade Slot Rules Implementation Plan

## Problem
`createDefaultRunUpgradeState()` creates only 3 upgrade slots. The SOT requires 5 slots upfront. Category limits (2 Hero / 2 Board / 2 Fever) and enforcement logic in `LevelUpSystem` and the UI are already correct — the gap is purely slot initialization and migration.

## Changes

### 1. `src/game/data/constants.ts` — Version bump
- Change `SAVE_VERSION` from `10` to `11`

### 2. `src/game/data/defaultRunState.ts` — 5-slot initialization
- `createDefaultRunUpgradeState()`: 3 → 5 slots, internal version 1 → 2
- `createDefaultRunUpgradeSlotState(count = 3)`: default 3 → 5
- `normalizeRunUpgradeState()`: pad to 5 slots, version 2, dev warning

### 3. `src/game/systems/SaveSystem.ts` — Migration
- Add `version < 11` block: pad `runUpgradeState.slots` to 5

### 4. `tests/run-remediation-smoke.mjs` — Assertions
- Verify 5-slot initialization, normalization padding, category limits

## Files NOT Changed
- Category enforcement (already correct)
- LevelUpRewardScene UI (already correct)
- GameTypes.ts (no type changes needed)
- Cascade Gravity, Fever Showtime, Legendary Evolution — untouched
