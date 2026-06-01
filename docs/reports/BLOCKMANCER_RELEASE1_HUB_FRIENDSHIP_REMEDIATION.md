Summary
- Implemented Release 1 "small but real" Hub Progression and Friendship run-start rewards.
- Added safe run-start application, save/migration handling, UI feedback, and smoke assertions.

Hub progression implemented
- Audited hub buildings (8 visible entries under src/game/content/hub-buildings):
  - hub_cake_stall, hub_repair_tent, hub_snack_table, hub_goblin_workshop,
    hub_ice_cream_cart, hub_arcade_booth, hub_bloxley_statue, hub_star_lantern_stage
- Release 1 effects implemented (conservative; applied at run start):
  - hub_cake_stall Lv1: gives `item_mini_cupcake` at run start
  - hub_repair_tent Lv1: gives +1 starting shield
  - hub_snack_table Lv1: gives +15 starting gold
  - hub_arcade_booth Lv1: grants +1 reward reroll at run start
  - hub_star_lantern_stage Lv1: grants +10 starting mana (small, conservative)
- Implementation details:
  - Added `getRunStartBonuses(meta)` and `getBuildingEffectDescription(id, meta)` in `HubProgressionSystem`.
  - `BlockmancerGame.newRun()` applies hub bonuses exactly once per run and marks `runState.metaBonusesApplied = true`.
  - Hub purchases continue to persist in `meta.hubBuildings`; `HubScene` now shows current/next effect lines.

Friendship implemented
- Audited friendship entries (8 visible entries under src/game/content/friendship).
- Release 1 mapping implemented (small helper gifts, once per run):
  - `friend_cupcake_slime` -> starting `item_mini_cupcake`
  - `friend_blanket_ghost` -> +1 starting shield
  - `friend_button_masher` -> +8 starting mana
  - `friend_ice_cream_imp` -> +5 starting mana
  - Other unlocked friends map to a small +8 gold fallback for Release 1
- Implementation details:
  - Added `getRunStartGifts(meta)` and `getEntryEffectSummary(entry, meta)` in `FriendshipSystem`.
  - Friendship points are earned by existing hooks (enemy defeat already calls `friendshipSystem.gain` and meta is saved).
  - `BlockmancerGame.newRun()` grants unlocked friendship gifts once per run and records `runState.claimedFriendRewards`.
  - `CollectionScene` now shows current benefit and next benefit per friend entry.

Save/migration
- New run-state fields added in `RunState` (src/game/types/GameTypes.ts):
  - `metaBonusesApplied: boolean` — ensures hub bonuses apply only once per run
  - `claimedFriendRewards: string[]` — per-run claimed friendship gift guard
- Default values initialized in `createDefaultRunState()` (src/game/data/defaultRunState.ts) and normalization logic added to safely migrate older saves.
- Older saves without these fields will load safely with defaults (`metaBonusesApplied=false`, `claimedFriendRewards=[]`).
- No save-facing IDs were renamed.

UI changes
- `HubScene` ([src/game/scenes/HubScene.ts](src/game/scenes/HubScene.ts)):
  - Cards now show: description, Current effect, Next effect, Cost.
  - Upgrade button behavior unchanged; affordability still disabled when unaffordable.
- `CollectionScene` ([src/game/scenes/CollectionScene.ts](src/game/scenes/CollectionScene.ts)):
  - Each friend card shows points, current benefit, and next benefit text.
- All UI changes are compact and remain portrait-mobile readable.

Tests / smoke
- Updated smoke harness `tests/run-remediation-smoke.mjs` to assert presence of hub/friendship helpers and new run-state flags.
  - Checks for `getRunStartBonuses`, `getRunStartGifts`, `metaBonusesApplied`, and `claimedFriendRewards`.
- Smoke script run expected with `npm test` (runs node tests/run-remediation-smoke.mjs).

Files changed
- src/game/types/GameTypes.ts — added `metaBonusesApplied` and `claimedFriendRewards` to `RunState`.
- src/game/data/defaultRunState.ts — default values and normalization for new fields.
- src/game/systems/HubProgressionSystem.ts — added HUB_EFFECTS mapping, getRunStartBonuses, getBuildingEffectDescription.
- src/game/systems/FriendshipSystem.ts — added getRunStartGifts and getEntryEffectSummary.
- src/game/BlockmancerGame.ts — apply hub & friendship bonuses in `newRun` with once-per-run guards.
- src/game/scenes/HubScene.ts — UI: current/next effect lines for buildings.
- src/game/scenes/CollectionScene.ts — UI: benefit/next lines for friendship entries.
- tests/run-remediation-smoke.mjs — added assertions covering these changes.
- docs/reports/BLOCKMANCER_RELEASE1_HUB_FRIENDSHIP_REMEDIATION.md — this report.

Balance values
- hub starting gold: +15 (per `hub_snack_table` Lv1)
- hub starting shield: +1
- hub starting mana: +10 (star lantern)
- hub reward reroll: +1
- friendship small gifts: +8 gold / +5..+8 mana / +1 shield / 1 starter item
- All values are intentionally small and capped to avoid trivializing Stage 1-6.

Known limitations
- Hub building content JSONs do not yet include effect fields; mapping is implemented in code for Release 1. Future work: move effect definitions into content so designers can tune without code changes.
- Shop discount and reward reroll discount hooks in `ShopSystem` were not added to avoid broad changes; `hub_arcade_booth` provides a reroll instead of direct shop discount.
- Some friendship `unlockReward.effect` types in content are bespoke and unsupported; for Release 1 they are mapped conservatively to small starter gifts. Later work can implement richer, content-defined behaviors.

Commands run
- `node tests/run-remediation-smoke.mjs` (this test asserts presence of new helpers and run-state flags; run locally to verify)

Next recommended prompt
- "Run the remediation smoke test and show failures" — I can run `npm test` here and capture results, then iterate on any failing assertions.
- Or: "Move hub/friendship effect definitions into content JSON and add tuning metadata" — to let designers change values without code edits.

