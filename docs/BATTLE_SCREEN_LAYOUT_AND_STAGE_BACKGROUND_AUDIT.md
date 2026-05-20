# BATTLE_SCREEN_LAYOUT_AND_STAGE_BACKGROUND_AUDIT

## 1. Summary
- Battle layout calculator in `BattleScene` uses responsive portrait split with base 25/55/20 and clamp logic.
- Stage/boss background key resolution was standardized via asset manifest helpers and `AssetSystem` alias-aware lookup.
- Canonical folders are scaffolded under `public/assets/stages/{stage_id}/...` and `public/assets/ui/...`.
- Current repo is runtime-safe but still heavily placeholder/missing-art; fallbacks are active.

## 2. Source docs read
- `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`
- `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`
- `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md`
- `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`
- `docs/blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v2.md`

## 3. Current layout status
- `BattleScene.calculateBattleLayout(...)` is active and used at create-time.
- Layout validation exists (`validateBattleLayout`) and debug overlay is dev-only.

## 4. Layout ratio verification
- Base ratios in calculator:
  - combat: `safe.height * 0.25`
  - puzzle: remaining after combat+controls
  - controls: `safe.height * 0.20`
- Clamps are applied to keep readability and touch usability.

## 5. Combat section status
- Combat area + combat log are separated in layout model.
- Boss room now prefers boss arena key path via `getStageBackground(..., 'bossArena')`.
- Normal rooms use far/mid/near stage keys.

## 6. Puzzle board section status
- Board panel rect is independent from combat and controls.
- Hold/Next/right rail bounds come from same layout object.
- Board frame key is now standardized via helper (`ui_panel_board`).

## 7. Controls section status
- Controls use dedicated control area and two row bounds.
- Row-1 movement + row-2 spell/skill/utility remain wired.

## 8. Standardized asset folder status
- Canonical folders are scaffolded by script.
- Legacy folders are not required for runtime correctness but fallback hooks remain in code.

## 9. Stage background switching status
- `AssetSystem.getStageBackground` now normalizes stage aliases and resolves canonical stage battle keys first.
- Stage 1 -> Stage 2 combat background key changes by stage slug.

## 10. Boss arena background status
- `AssetSystem.getStageBackground(..., 'bossArena')` now resolves alias-aware boss arena keys.
- If missing, falls back to stage battle keys then safe placeholder.

## 11. Asset manifest status
- `src/game/data/assets.ts` now includes typed manifest helpers and key lookup APIs:
  - `getAssetEntry`, `getAssetPath`, `getAssetFallbacks`, `getPlaceholderForType`
  - `getStageBattleBackgroundKeys`, `getBossArenaBackgroundKey`
  - `getBoardFrameAssetKey`, `getUiPanelAssetKey`

## 12. Asset placement table
| Use Case | Asset Key | Primary Path | Fallback Path | Status |
| --- | --- | --- | --- | --- |
| Stage 1 combat far | bg_stage_sprinkle_sewers_battle_far | public/assets/stages/stage_sprinkle_sewers/battle/bg_stage_sprinkle_sewers_battle_far.png | public/assets/backgrounds/bg_stage_sprinkle_sewers_battle_far.png | missing |
| Stage 1 combat mid | bg_stage_sprinkle_sewers_battle_mid | public/assets/stages/stage_sprinkle_sewers/battle/bg_stage_sprinkle_sewers_battle_mid.png | public/assets/backgrounds/bg_stage_sprinkle_sewers_battle_mid.png | missing |
| Stage 1 combat near | bg_stage_sprinkle_sewers_battle_near | public/assets/stages/stage_sprinkle_sewers/battle/bg_stage_sprinkle_sewers_battle_near.png | public/assets/backgrounds/bg_stage_sprinkle_sewers_battle_near.png | missing |
| Stage 1 boss arena | bg_boss_cupcake_slime_king_arena | public/assets/stages/stage_sprinkle_sewers/boss-arena/bg_boss_cupcake_slime_king_arena.png | public/assets/backgrounds/bg_boss_cupcake_slime_king_arena.png | missing |
| Stage 2 combat far | bg_stage_goblin_workshop_battle_far | public/assets/stages/stage_goblin_workshop/battle/bg_stage_goblin_workshop_battle_far.png | public/assets/backgrounds/bg_stage_goblin_workshop_battle_far.png | missing |
| Stage 2 boss arena | bg_boss_prototype_no_7_arena | public/assets/stages/stage_goblin_workshop/boss-arena/bg_boss_prototype_no_7_arena.png | public/assets/backgrounds/bg_boss_prototype_no_7_arena.png | missing |
| Board frame | ui_panel_board | public/assets/ui/panels/ui_panel_board.png | ui_panel_default | missing/fallback |
| Event log strip | ui_event_log_strip | public/assets/ui/panels/ui_event_log_strip.png | ui_panel_default | missing/fallback |

## 13. Missing asset keys
- See `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md` (missing primary section).

## 14. Missing physical PNG files
- `npm run sync:assets` reported all scanned runtime-like keys currently missing primary file in canonical location for this branch snapshot.

## 15. Legacy fallback paths preserved
- Asset resolution still supports fallback paths and legacy key aliases where present.

## 16. Fallback behavior
- Missing background/UI keys fall back to generated placeholder textures (`asset_missing_background`, `missing_ui`) and do not crash scene creation.

## 17. Code files changed
- `src/game/data/assets.ts`
- `src/game/systems/AssetSystem.ts`
- `src/game/scenes/BattleScene.ts`
- `scripts/ensure-final-asset-folders.mjs` (already present and used)

## 18. Scripts changed
- Existing scripts were reused:
  - `ensure-final-asset-folders.mjs`
  - `sync-assets.mjs`
  - `audit-asset-variants.mjs`

## 19. Validation/build commands run
- `npm run ensure:asset-folders`
- `npm run sync:assets`
- `npm run audit:asset-variants`
- `npm run validate:content`
- `npm run validate:metadata`
- `npm run validate:animations`
- `npm run build`

## 20. Manual QA checklist
- Code-level verification done for:
  - 25/55/20 layout constants/usage in battle layout calculator
  - boss arena priority path in boss rooms
  - stage alias + boss alias background key mapping
  - board frame stable key mapping
- Full interactive viewport QA steps remain pending manual run in browser/device.

## 21. Known limitations / follow-up tasks
- Final stage battle and boss arena PNGs are not in canonical folders yet.
- UI panel/control art keys mostly resolve to placeholders.
- `sync:assets` currently reports large missing-primary set because art migration/content-key coverage is still in progress.
- Next pass should import real assets into canonical folders and reduce fallback usage.
