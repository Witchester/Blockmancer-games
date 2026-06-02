# Upgrade System Redesign — Post-Implementation Audit

**Date:** 2026-06-02  
**Branch:** main  
**SAVE_VERSION:** 10  
**Overall Status:** Functional — with documented gaps in Legendary pool content

---

## 1. Executive Summary

The upgrade system redesign is **functionally complete** across all seven prompts. The core loop works: category-first selection → card offering with weighted progression → runtime effect application → Legendary Evolution at Lv5. Build passes (571 modules, 0 type errors), all validation commands pass, and the remediation smoke test passes.

**Key gaps:** Legendary pools are placeholders (1 entry per card), and balance numbers are draft estimates. These do not block the feature — they block release-readiness for a production build.

**Bugs fixed during audit:** `defaultRunState.ts` was missing uncommitted Prompt 1/P5 additions (the `git checkout` during Prompt 7 restoration wiped them). These have been re-added: import of `RunUpgradeState`/`RunUpgradeCardState`/`RunUpgradeSlotState`, `createDefaultRunUpgradeState()`, `normalizeRunUpgradeState()`, `getUpgradeCategorySlotCounts()`, `isUpgradeCardStateValid()`, `selectedCategory` and `pendingLegendaryEvolution` fields in `createDefaultLevelUpScreenState` and `normalizeLevelUpScreenState`.

---

## 2. Full Audit Matrix

| # | Area | Expected | Actual | Status | Evidence | Follow-up |
|---|------|----------|--------|--------|----------|-----------|
| 1 | UpgradeCardDefinition type | All fields present | All fields present + maxLevel:5, slotCost:1 | **Done** | GameTypes.ts:219-231 | — |
| 2 | UpgradeCategory | hero/board/fever | hero/board/fever | **Done** | GameTypes.ts:204 | — |
| 3 | UpgradeCardLevel Lv1-Lv5 | level: 1-5 union | level: 1\|2\|3\|4\|5 | **Done** | GameTypes.ts:211 | — |
| 4 | LegendaryEvolutionDefinition | All fields present | id/name/desc/effectType/effectConfig/tags/unlockCondition | **Done** | GameTypes.ts:224-231 | — |
| 5 | RunUpgradeState exists | version/slots/ownedCards/legacyUpgradeIds | All present | **Done** | GameTypes.ts:255-260 | — |
| 6 | Default new-run state | 5 slots, empty cards | 3 slots (grow dynamically), empty cards | **Partial** | defaultRunState.ts creates 3 slots, expandable to 5 | Slots grow on demand via `findAvailableSlotIndex`. Should create 5 upfront for clarity? Minor. |
| 7 | Old-save migration | v9→v10 preserves legacy IDs | v10 migration preserves upgrades[] in legacyUpgradeIds[] | **Done** | SaveSystem.ts:328-342 | — |
| 8 | Corrupt save normalization | Safe defaults on any corruption | normalizeRunUpgradeState validates all fields strictly | **Done** | defaultRunState.ts:220-283 | — |
| 9 | Legacy IDs preserved | Not deleted, aliased | legacyUpgradeIds[] array + legacyAliases on each card JSON | **Done** | 27 card JSONs have legacyAliases | — |
| 10 | Category selection first | Pick category → see cards | createCategorySelection() shows 3 buttons | **Done** | LevelUpRewardScene.ts:137-256 | — |
| 11 | Hero category filters | Hero cards only | loadNewCardsForCategory filters by heroId/isGenericHeroCard | **Done** | LevelUpSystem.ts:400-418 | — |
| 12 | Board category filters | Board cards only | category === 'board' filter | **Done** | LevelUpSystem.ts:393-394 | — |
| 13 | Fever category filters | Fever cards only | category === 'fever' filter | **Done** | LevelUpSystem.ts:393-394 | — |
| 14 | Total slot cap 5 | enforced | canSelectCategory checks total < 5 | **Done** | LevelUpSystem.ts:173 | — |
| 15 | Hero slot cap 2 | enforced | canSelectCategory checks hero < 2 | **Done** | LevelUpSystem.ts:174 | — |
| 16 | Board slot cap 2 | enforced | canSelectCategory checks board < 2 | **Done** | LevelUpSystem.ts:175 | — |
| 17 | Fever slot cap 2 | enforced | canSelectCategory checks fever < 2 | **Done** | LevelUpSystem.ts:176 | — |
| 18 | Owned cards level up | No new slot consumed | levelUpOwnedCard increments level in-place | **Done** | LevelUpSystem.ts:216-229 | — |
| 19 | New cards consume slot | Correct category slot | claimSlotForCategory assigns category + slotIndex | **Done** | LevelUpSystem.ts:198-214 | — |
| 20 | Owned cards reappear more often | Weighted 150→500 | getCardOfferWeight returns ascending weights | **Done** | LevelUpSystem.ts:314-323 | — |
| 21 | Lv4 prioritized | Weight = 500 | weight[4] = 500, highest non-zero | **Done** | LevelUpSystem.ts:320 | — |
| 22 | Lv5 → readyToEvolve | Flag set | levelUpOwnedCard sets readyToEvolve = true at Lv5 | **Done** | LevelUpSystem.ts:225-226 | — |
| 23 | Lv5 leaves normal offers | Excluded | isCardExcludedFromOffers checks level >= 5 | **Done** | LevelUpSystem.ts:252 | — |
| 24 | Legendary leaves normal offers | Excluded | checks legendaryEvolutionId is not empty | **Done** | LevelUpSystem.ts:252,256 | — |
| 25 | Legendary Evolution 2 choices | Two unique from pool | generateLegendaryEvolutionChoices returns 2 | **Done** | LevelUpSystem.ts:354-368 | — |
| 26 | Legendary saves ID | legendaryEvolutionId | applyLegendaryEvolution sets it | **Done** | LevelUpSystem.ts:382-384 | — |
| 27 | Legendary uses same slot | No slot change | slotIndex unchanged | **Done** | TableGuard — same slotIndex in ownedCards | — |
| 28 | Legendary no new slot | No slot consumed | No claimSlotForCategory call | **Done** | LegendaryEvolutionScene:confirmSelection | — |
| 29 | Hero-specific cards | Matching hero only | loadNewCardsForCategory checks heroId === state.hero.id | **Done** | LevelUpSystem.ts:406-407 | — |
| 30 | Generic Hero cards | All heroes | isGenericHeroCard bypasses heroId check | **Done** | LevelUpSystem.ts:404-405 | — |
| 31 | Board: Cascade Gravity preserved | No gravity changes | No handler mutates gravity; only cascade/damage bonuses | **Done** | UpgradeCardEffectHandler board handlers | — |
| 32 | Fever: Boss Drama Guard | Not bypassed | Fever handlers only add shield/mana/delay, no cap changes | **Done** | UpgradeCardEffectHandler fever handlers | — |
| 33 | Fever: Charged Lines | Not persisted between nodes | clearFeverBoardMarkers called on node end | **Done** | FeverSystem.ts + SaveSystem.ts | — |
| 34 | Every card has 5 levels | cards[0-4] | All 27 cards have exactly 5 levels | **Done** | 27 card JSONs verified | — |
| 35 | Legendary pool or warning | >=10 entries or warn | All 27 cards have 1 placeholder entry | **Risk** | Card JSONs: 1 placeholder each | Need 10 real legendary definitions per card |
| 36 | Every effectType has handler | 28 registered | 28 effectTypes registered in UpgradeCardEffectHandler | **Done** | UpgradeCardEffectHandler.ts:20-50 | — |
| 37 | Empty/low-card pools fail safely | Readable message | Fallback card shown, returns to categories | **Done** | LevelUpRewardScene.ts:118-127 | — |
| 38 | UI copy readable | No debug text | All text is player-facing, consistent colors | **Done** | LevelUpRewardScene.ts cardStatusText | — |
| 39 | Validation scripts cover rules | Smoke test passes | test assertions updated for new method names | **Done** | run-remediation-smoke.mjs line 48 | — |
| 40 | Manual smoke checklist | Exists | Covered in implementation report | **Done** | docs/reports/UPGRADE_REDESIGN_IMPLEMENTATION_REPORT.md | — |
| 41 | Implementation report | Exists | Full report with phases 1-7 | **Done** | docs/reports/UPGRADE_REDESIGN_IMPLEMENTATION_REPORT.md | — |
| 42 | Save: New run upgrade state | Initialized correctly | createDefaultRunUpgradeState called | **Done** | defaultRunState.ts createDefaultRunState | — |
| 43 | Save: Old save without upgrade state | Migrated safely | v10 migration creates default state | **Done** | SaveSystem.ts:328-342 | — |
| 44 | Save: Old save with legacy IDs | Preserved | legacyUpgradeIds array populated | **Done** | SaveSystem.ts:335-337 | — |
| 45 | Save/reload normal upgrade | State preserved | ownedCards, slots survive save/load | **Done** | normalizeRunUpgradeState validates structure | — |
| 46 | Save/reload pending evolution | Survives | pendingLegendaryEvolution normalized in save | **Done** | normalizeLevelUpScreenState (fixed in audit) | — |
| 47 | Save/reload after Legendary | State preserved | legendaryEvolutionId survives save/load | **Done** | normalizeRunUpgradeState preserves field | — |

---

## 3. Files Inspected

`src/game/types/GameTypes.ts`, `src/game/data/defaultRunState.ts`, `src/game/data/constants.ts`, `src/game/systems/SaveSystem.ts`, `src/game/systems/ContentRegistry.ts`, `src/game/systems/LevelUpSystem.ts`, `src/game/systems/UpgradeCardEffectHandler.ts`, `src/game/systems/FeverSystem.ts`, `src/game/scenes/LevelUpRewardScene.ts`, `src/game/scenes/LegendaryEvolutionScene.ts`, `src/game/ui/level-up/LevelUpFlowRouter.ts`, `src/game/ui/level-up/LevelUpDataAdapter.ts`, `src/game/BlockmancerGame.ts`, `tests/run-remediation-smoke.mjs`, `src/game/content/upgrade-cards/` (27 card JSONs), `docs/reports/`

## 4. Files Changed

| File | Change |
|------|--------|
| `src/game/data/defaultRunState.ts` | **Bug fix.** Re-added missing Prompt 1/P5 additions (RunUpgradeState imports, createDefaultRunUpgradeState, normalizeRunUpgradeState, getUpgradeCategorySlotCounts, isUpgradeCardStateValid, selectedCategory + pendingLegendaryEvolution fields in both createDefaultLevelUpScreenState and normalizeLevelUpScreenState). These were accidentally lost during git operations in Prompt 7. |

## 5. Bugs Fixed

1. **`defaultRunState.ts` missing Prompt 1/P5 functions** — `createDefaultRunUpgradeState`, `normalizeRunUpgradeState`, `getUpgradeCategorySlotCounts`, `isUpgradeCardStateValid`, `selectedCategory` and `pendingLegendaryEvolution` fields were deleted by `git checkout` during Prompt 7 restoration. Re-added via Node.js script.

## 6. Validation Results

| Command | Result |
|---------|--------|
| `npm run build` | **Pass** — 571 modules, 0 type errors |
| `npm run validate:ui-layouts` | **Pass** (17 layout specs) |
| `npm run test` | **Pass** (remediation smoke) |

## 7. Cascade Gravity Safety

**Verified safe.** Board card handlers (`board_cascade_bonus`, `board_line_damage`, etc.) only modify damage/mana/Fever bonus numbers on existing cascade results. No handler touches gravity rules, column shifting logic, or `resolveCascadeGravity()` in `CascadeGravitySystem.ts`. The handler only reads cascade metadata, never writes to it.

## 8. Fever Showtime / Boss Drama Guard Safety

**Verified safe.** Fever capacity handler uses `Math.min(100, state.feverShowtime.maxChargedLines + bonus)` — capped at 100. No handler modifies boss damage caps, phase skipping, or Charged Line node persistence. `clearFeverBoardMarkers` and `clearSoftJunkForNodeEnd` are called on node end from `SaveSystem.saveRun`. FeverShowtime state normalization validates all fields strictly with safe defaults.

## 9. Save/Load Compatibility

**Verified safe.** v10 migration: old `upgrades[]` → `legacyUpgradeIds[]`. Corrupt `runUpgradeState` normalizes to 3 empty slots, empty ownedCards. `pendingLegendaryEvolution` survives save/load (fixed — previously dropped in normalize). Stale pending states auto-clean on load via `hasPendingLegendaryEvolution()`.

## 10. Done / Partial / Missing Summary

| Status | Count | Items |
|--------|-------|-------|
| **Done** | 44 | Types, slots, categories, filters, weights, handlers, UI, save/load |
| **Partial** | 1 | Default slots start at 3 (grow to 5 dynamically) — functionally correct but starts below cap |
| **Risk** | 1 | Legendary pools: 27 cards × 1 placeholder; need 10 real options per card |
| **Missing** | 0 | All required features implemented |
| **Blocked** | 0 | Nothing blocked |
| **Not Applicable** | 0 | — |

## 11. Recommended Next Prompts / Backlog

1. **Legendary pool completion:** Create 10 real `LegendaryEvolutionDefinition` entries per card (270 total) with dedicated effectTypes and handlers
2. **Pool size validation:** Add automated check that `card.legendaryPool.length >= 10` (currently all cards have 1 placeholder)
3. **Card art production:** Replace `placeholder_upgrade` iconKey with real card icons
4. **Balance pass:** Tune all 135 level values (damage, HP, shield, mana numbers)
5. **Slot expansion:** Consider initializing `runUpgradeState` with 5 slots upfront for consistency
6. **Automated regression tests:** Add E2E tests for upgrade flows (category selection, card offering, level-up, legendary evolution, save/reload)
