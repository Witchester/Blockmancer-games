# Blockmancer Dungeon — Multi-Enemy Encounter + Festival Level-Up SOT Update Summary

**Updated:** 2026-05-22  
**Purpose:** Summary of documentation updates made to align the Source-of-Truth files with the new sequential multi-enemy encounter, biome monster pool, enemy entry pressure/gift, and Festival Level-Up design.

## Directly Updated Source-of-Truth Files and Update Items

### 01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md

Added **Section 23 — Sequential Encounter Packs and Festival Level-Up Progression**.

Update items:

1. Added design goal for one battle node containing 1-3 sequential enemies.
2. Defined biome/stage monster pool generation instead of hardcoded node enemy lists.
3. Added `MonsterRole`, `WeightedMonsterRule`, and `BiomeMonsterPool` model.
4. Added `NodeEncounterPack` and `EncounterEnemyEntry` model.
5. Defined total HP budget rules for 1, 2, and 3 enemy nodes.
6. Defined stage-by-stage enemy count ramp.
7. Added sequential battle rules: one active enemy, current enemy index, attack counter reset, entry grace, and reward gating.
8. Added enemy entry pressure + player gift rules.
9. Added monster stack UI behavior and icon render sizes.
10. Added capped breather rewards between non-final enemies.
11. Added Festival Level-Up system and `PlayerLevelState`.
12. Added XP sources and XP curve.
13. Added level-up card rules and card type probabilities.
14. Added general stackable level-up upgrades with IDs, stack limits, effects, and caps.
15. Added hero-specific level-up upgrades for Milo, Pippa, Zuzu, Nixie, Bruk, and Lumi.
16. Added fairness, save, and validation rules.
17. Added a 2026-05-22 change-log entry.

### 03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md

Added new reactive difficulty scope and phases for encounter packs and level-up.

Update items:

1. Added **Section 1A — Sequential Encounter Packs and Festival Level-Up Scope**.
2. Defined why multi-enemy nodes and level-up are part of reactive difficulty.
3. Added fairness rules for biome-based enemy generation, sequential combat, entry gifts, reward gating, and level-up timing.
4. Added **Phase R11 — Biome-Based Sequential Encounter Packs**.
5. Added `BiomeMonsterPool` and `NodeEncounterPack` implementation model.
6. Added encounter generation tasks and acceptance criteria.
7. Added manual tests for Stage 1 late multi-enemy node, monster stack UI, and save/load mid-node.
8. Added **Phase R12 — Enemy Entry Pressure + Player Gift**.
9. Added `EnemyEntryEffect` model.
10. Added safe entry pressure and player gift examples.
11. Added acceptance criteria to prevent instant damage, instant overflow, and hidden hazards.
12. Added **Phase R13 — Festival Level-Up and Stackable Build Upgrades**.
13. Added `PlayerLevelState` implementation model.
14. Added tasks for XP, pending level-ups, 3-card reward screen, general upgrades, hero upgrades, stack caps, and validation.
15. Added new recommended file/folder changes for EncounterPackSystem, LevelUpSystem, LevelUpRewardScene, MonsterStackPreview, biome pools, encounter scaling, entry effects, and level-up upgrade content.

### 04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md

Added asset and animation rules for monster stack UI, enemy entry feedback, XP, and level-up cards.

Update items:

1. Added **Sequential Encounter and Festival Level-Up Asset Standard**.
2. Defined monster stack UI asset usage and runtime icon sizes.
3. Confirmed monster stack should reuse canonical monster icon assets.
4. Added enemy entry feedback VFX IDs and frame counts.
5. Added monster stack/reveal UI animation IDs and frame counts.
6. Added level-up panel, upgrade card, XP meter, and level badge asset rules.
7. Added level-up UI animation and VFX IDs with exact frame counts.
8. Defined upgrade icon key pattern and `public/assets/icons/upgrades/` placement.
9. Added fallback rules for missing monster icons, stack mystery chip, entry VFX, level-up panel/card art, upgrade icons, and frames.

### 05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md

Added implementation delta, backlog changes, matrix rows, and a Codex implementation prompt.

Update items:

1. Added **Feature Delta — Sequential Encounter Packs and Festival Level-Up**.
2. Marked feature status as design/SOT updated and implementation pending.
3. Listed required systems: EncounterPackSystem, LevelUpSystem, LevelUpRewardScene/modal, MonsterStackPreview, biome pools, encounter scaling, entry effects, level-up content, save migration.
4. Added feature matrix row for Encounter Pack System.
5. Added feature matrix row for Festival Level-Up System.
6. Updated P1 backlog to include sequential encounter packs and Festival Level-Up.
7. Added **Recommended Prompt — Sequential Encounter Packs and Festival Level-Up**.
8. Prompt includes required read order, implementation order, acceptance criteria, validation commands, and final response format.

### 06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md

Added canonical placement rules for the new UI/VFX/assets without adding new top-level folders.

Update items:

1. Added **Encounter Stack and Level-Up Asset Placement Rules**.
2. Confirmed no new top-level folders are needed.
3. Defined monster stack preview placement using existing monster icon folders.
4. Defined enemy entry warning/gift VFX placement.
5. Defined Festival Level-Up UI, HUD, animation, upgrade icon, and VFX placement.
6. Defined runtime render sizes for monster stack icons, level-up card icons, and compact summary icons.
7. Updated Update Policy section numbering from 15 to 16.

## Important Design Decisions Captured

1. Encounter packs are generated from biome/stage monster pools, not hardcoded node enemy lists.
2. Player fights monsters one after another, never all at once.
3. New enemy entry resets attack counter and applies safe entry grace.
4. Enemy entry effects include both pressure and a small player-positive gift.
5. Rewards and level-up screens happen only after the node is fully cleared.
6. XP can be gained during combat, but upgrade choice is post-combat only.
7. Level-up upgrades are stackable and support multiple builds.
8. Upgrades are split into general upgrades and selected-hero-specific upgrades.
9. Every upgrade must have a real runtime handler; JSON-only no-op upgrades are not acceptable.
10. Existing canonical asset folders are reused; no new top-level asset folder was introduced.

## Recommended Next Implementation Order

1. Add save migration for encounter pack state and `PlayerLevelState`.
2. Add biome monster pool and encounter scaling content.
3. Implement encounter pack generation and sequential enemy advancement.
4. Gate rewards/route fallback/level-up until full node clear.
5. Add enemy entry pressure + gift effects.
6. Add monster stack UI.
7. Implement XP and level-up reward cards.
8. Implement general and hero-specific upgrade handlers.
9. Add validation for unsupported upgrade effect IDs.
10. Run content/build validation and manual smoke tests.


## Addendum — Node Result Screen EXP Summary

**Added:** 2026-05-22

### Reason

Sequential multi-enemy nodes and Festival Level-Up need a clear post-node result step. The player must see how much EXP was acquired from the node and how much EXP remains before the next level-up.

### Updated files

| File | Update items |
| --- | --- |
| `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` | Added `23.8A Node Result Screen` with post-node flow, `NodeResultSummary`, EXP breakdown, EXP remaining text, Level Up Ready state, and duplicate-safe save rules. |
| `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` | Added `Phase R14 — Node Result Screen and EXP Summary`, tasks, data shape, acceptance criteria, manual tests, and file paths for `NodeResultScene` / `NodeResultPanel`. |
| `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` | Added Node Result Screen UI asset rules, node clear banner, EXP gained counter, EXP remaining chip, breakdown rows, level-ready badge, and result-screen animation standards. |
| `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` | Updated feature delta, implementation matrix, recommended prompt, implementation order, and acceptance criteria to include the Node Result Screen before level-up card selection. |
| `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` | Added canonical folder placement for Node Result Screen panels, HUD chips, EXP meter reuse, buttons, UI animations, and node clear VFX. |

### New flow

```text
Final enemy defeated
-> Node Clear banner
-> Node Result Screen: EXP gained + breakdown + EXP remaining
-> If level-up pending: Festival Level-Up card selection
-> Normal node rewards / loot / map flow
```

### New implementation items

- `NodeResultSummary` and `NodeResultXpBreakdown` data shape.
- `NodeResultScene` or equivalent modal.
- `NodeResultPanel` UI component.
- EXP gained this node display.
- EXP remaining to next level display.
- `Level Up Ready!` state when pending level-ups exist.
- Save/load guard to prevent duplicate EXP grants.
- Result screen animation and fallback-safe UI assets.
