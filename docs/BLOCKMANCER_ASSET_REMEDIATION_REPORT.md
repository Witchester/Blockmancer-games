# Blockmancer Asset Remediation Report

## 1. Executive Summary

- Total files changed by this remediation pass: 12 project/report files plus generated folder scaffolding and canonical asset cleanup.
- Total manifest entries added or updated: dynamic manifest generation now recognizes canonical content keys, route/story aliases, audio category paths, placeholders, map-node fallback paths, room-event fallback paths, boss/monster icon aliases, and exact animation frames. `sync:assets` now tracks 2130 unique expected keys and exact frames.
- Total aliases added: pattern-based legacy aliases for hero cast/defeat states, boss actor sprite keys, monster/boss icon keys, route-story icons, old map-node icons, old room-event/story paths, flat audio paths, and placeholder paths.
- Total exact-frame animation definitions updated: 384 definitions validated; board block base and clear-style special animations now resolve to canonical `base/`, `glow/`, `clear/`, or `special/` folders.
- Total content references updated: 0 content IDs renamed; 0 save-facing IDs changed. Runtime/content references remain asset-key based.
- Total physical assets wired: 566 physical assets scanned after cleanup; 13 legacy-only files remain as fallback paths rather than primary paths.
- Total canonical cleanup actions: 58 files moved into canonical folders, 49 duplicate nested sprite files removed, and 10 empty uncanonical directories removed.
- Total remaining missing production assets: 1667 fallback-safe missing production assets after canonical sync classification.
- Total remaining orphan/legacy files: 103 physical-only orphan/legacy candidates; 0 nested `sprites/sprites/...` files remain.
- Top remaining risks: missing final character sheets and frames, missing boss arena files, route/story art gaps, incomplete icon/VFX/audio production art, and fallback-only flat audio assets.

## 2. Canonical Folder Enforcement

| Category | Canonical path | Old/legacy path found | Action taken | Fallback kept? | Notes |
|---|---|---|---|---|---|
| Stage battle backgrounds | `public/assets/stages/{stage_id}/battle/` | flat `backgrounds/` and stage-level files | Canonical scaffold enforced | Yes | Battle is Section 1 only. |
| Stage puzzle backgrounds | `public/assets/stages/{stage_id}/puzzle/` | missing folders on several stages | Added scaffold to `ensure:asset-folders` | Yes | Puzzle is Section 2 only. |
| Boss arenas | `public/assets/stages/{stage_id}/boss-arena/` | stage-level fallback backgrounds | Canonical scaffold enforced | Yes | Six boss arena files remain missing. |
| Map backgrounds | `public/assets/stages/{stage_id}/map/` | stage-level fallback backgrounds | Canonical scaffold enforced | Yes | Map scenes are full portrait. |
| Route scenes | `public/assets/stages/{stage_id}/route-scenes/` | old route/story folders | Canonical scaffold enforced | Yes | Route visuals remain fallback-safe. |
| Board blocks | `public/assets/sprites/board-blocks/{block_id}/` | flat `board-blocks/` | Exact-frame folders aligned | Yes | Static flat base remains compatibility. |
| Icons | `public/assets/icons/{category}/` | `icons/map`, `icons/story-routes`, `story/` | Manifest fallback paths added | Yes | Primary map-node and route-story paths are canonical. |
| Audio | `public/assets/audio/{sfx,music,ui}/` | flat `public/assets/audio/*.ogg` | Manifest primary paths moved logically | Yes | Missing audio remains fallback-safe. |
| Legacy backgrounds | `public/assets/backgrounds/legacy/` | `public/assets/backgrounds/` | Script no longer creates flat primary folder | Yes | Existing files were not deleted. |
| Nested sprites | invalid as primary | `public/assets/sprites/sprites/...` | Merged into canonical sprite folders where missing; duplicate files removed | No | `sprites/sprites` no longer exists. |
| Top-level hero placeholders | `public/assets/portraits/heroes/` | `public/assets/heroes/` | Moved files to canonical portrait folder | No | Runtime still resolves by key. |
| Top-level monster placeholders | `public/assets/placeholders/` | `public/assets/monsters/` | Moved files to canonical placeholder folder | No | Manifest primary path adjusted for `placeholder_*` monster sprite keys. |
| Map node icons | `public/assets/icons/map-nodes/` | `public/assets/icons/map/` | Moved files to canonical map-node folder | No | Legacy folder removed after move. |

## 3. Frame-Expanded Animation Alignment

| Asset family | Animation | Expected frame count | Expected canonical path | Physical files found | Missing frames | Runtime fallback | Notes |
|---|---:|---:|---|---:|---:|---|---|
| Board blocks | `base` | from standards | `public/assets/sprites/board-blocks/{block_id}/base/` | partial | warning-only | `asset_missing_block` | Fixed previous `special/` misroute. |
| Board blocks | `glow` | from standards | `public/assets/sprites/board-blocks/{block_id}/glow/` | partial | warning-only | `asset_missing_block` | Two-digit exact frames. |
| Board blocks | clear-style specials | from standards | `public/assets/sprites/board-blocks/{block_id}/clear/` | partial | warning-only | `asset_missing_block` | Includes explode, break, clear-burst style animations. |
| Board blocks | non-clear specials | from standards | `public/assets/sprites/board-blocks/{block_id}/special/` | partial | warning-only | `asset_missing_block` | Special folder remains canonical. |
| Heroes | all standard states | from standards | `public/assets/sprites/heroes/{hero_id}/{state}/` | partial | warning-only | `asset_missing` | Old `spr_hero_*` keys are alias fallback only. |
| Monsters | all standard states | from standards | `public/assets/sprites/monsters/{monster_id}/{state}/` | partial | warning-only | `asset_missing` | Missing sheets are warnings. |
| Bosses | all standard states | from standards | `public/assets/sprites/bosses/{boss_id}/{state}/` | partial | warning-only | `asset_missing` | Nested duplicate boss frames remain fallback-only. |
| VFX | standards-driven | from standards | `public/assets/effects/{vfx_id}/` | partial | warning-only | `asset_missing` | No GIF primary support added. |
| UI animations | standards-driven | from standards | `public/assets/ui/animations/{asset_id}/` | partial | warning-only | `asset_missing_icon` | Exact-frame validation remains nonfatal for missing final art. |

## 4. Alias Mapping Added

| Old/checklist key | Canonical runtime key or frame family | Canonical primary path | Fallback behavior | Notes |
|---|---|---|---|---|
| `spr_hero_{id}_cast` | `{hero_id}__cast_spell__f00` family | `public/assets/sprites/heroes/{hero_id}/cast_spell/` | Falls back to old key then idle/placeholder | Runtime alias added. |
| `spr_hero_{id}_defeat` | `{hero_id}__defeat_tired__f00` family | `public/assets/sprites/heroes/{hero_id}/defeat_tired/` | Falls back safely | Runtime alias added. |
| `spr_boss_{id}_{state}` | `boss_{id}__{state}__f00` family | `public/assets/sprites/bosses/{boss_id}/{state}/` | Old monster-prefixed key still works | Runtime alias added. |
| `ico_mon_boss_*` | boss portrait icon frame | `public/assets/portraits/bosses/` | Old `icons/bosses` path retained | Manifest fallback added. |
| `ico_route_*` | route-story icon | `public/assets/icons/route-story/` | Old `icons/story-routes` path retained | Manifest fallback added. |
| `map_node_*` | map-node icon | `public/assets/icons/map-nodes/` | Old `icons/map` path retained | Manifest fallback added. |
| room event icon keys | room-event icon | `public/assets/icons/room-events/` | Old `story/` path retained | Manifest fallback added. |
| `sfx_*` flat audio | categorized audio | `public/assets/audio/sfx/` or `public/assets/audio/ui/` | Old flat audio path retained | Manifest fallback added. |

## 5. Content Reference Changes

| File | Old key | New canonical key | Reason | Save-facing ID affected? |
|---|---|---|---|---|
| Content JSON | none | none | No content IDs or asset references were renamed in this pass. | no |
| Runtime manifest generation | legacy path assumptions | canonical primary paths with fallback aliases | Keeps content asset-key based while aligning runtime delivery paths. | no |

## 6. Existing Physical Assets Now Wired

| File path | Canonical key/frame | Category | Referenced from | Notes |
|---|---|---|---|---|
| `public/assets/stages/stage_sprinkle_sewers/battle/` | `bg_stage_sprinkle_sewers_battle_*` | Stages | stage/background manifest | Canonical battle primary. |
| `public/assets/stages/stage_sprinkle_sewers/puzzle/` | `bg_stage_sprinkle_sewers_puzzle_*` | Stages | stage/background manifest | Canonical puzzle primary. |
| `public/assets/sprites/bosses/boss_cupcake_slime_king/` | boss exact frames | Bosses | animation manifest | Canonical boss folder is primary; duplicate nested files were removed. |
| `public/assets/icons/map-nodes/` | `node_*` and `map_node_*` icons | UI/map icons | manifest primary | Files moved from old `icons/map/`. |
| `public/assets/icons/story-routes/` | route-story legacy fallback | Story/routes | manifest fallback | Primary is now `icons/route-story/`. |
| `public/assets/story/` | room-event legacy fallback | Story/routes | manifest fallback | Primary is now `icons/room-events/` for icons. |
| `public/assets/audio/*.ogg` | categorized audio fallback | Audio | audio manifest | Primary is now `audio/sfx/` or `audio/ui/`. |

## 7. Remaining Missing Production Assets

| Group | Asset key / frame filename | Expected canonical path | Priority | Fallback placeholder | Notes |
|---|---|---|---|---|---|
| Stages | stage battle/map/route files beyond current physical set | `public/assets/stages/{stage_id}/` | P1 | `asset_missing_background` | Stage 1 has partial physical coverage; other stages remain art gaps. |
| Puzzle backgrounds | `bg_stage_{slug}_puzzle_*` | `public/assets/stages/{stage_id}/puzzle/` | P1 | `asset_missing_background` | Folder scaffold exists for all Release 1 stages. |
| Boss arenas | `bg_boss_*_arena.png` | `public/assets/stages/{stage_id}/boss-arena/` | P0 | `asset_missing_background` | Six boss arena images are missing. |
| Heroes | hero exact-frame state files and portrait icons | `public/assets/sprites/heroes/{hero_id}/{state}/` | P1 | `asset_missing` | Validation reports missing portrait icons and sheets. |
| Monsters | monster exact-frame state files, icons, sheets | `public/assets/sprites/monsters/{monster_id}/{state}/` | P1 | `asset_missing` | Missing sheets are warning-only. |
| Bosses | boss exact-frame state files, portraits, sheets | `public/assets/sprites/bosses/{boss_id}/{state}/` | P0 | `asset_missing` | Release boss presentation risk remains. |
| Board blocks | some exact frames and special folders | `public/assets/sprites/board-blocks/{block_id}/` | P1 | `asset_missing_block` | Four board-block special folders remain absent. |
| Items | item icons and VFX | `public/assets/icons/items/`, `public/assets/effects/` | P2 | `asset_missing_icon` | Content remains key based. |
| Spells | spell icons and VFX | `public/assets/icons/spells/`, `public/assets/effects/` | P2 | `asset_missing_icon` | Exact VFX validation is warning-only. |
| Relics | relic icons | `public/assets/icons/relics/` | P2 | `asset_missing_icon` | Production art gap. |
| Upgrades / Weapons | upgrade and weapon icons | `public/assets/icons/upgrades/`, `public/assets/icons/weapons/` | P2 | `asset_missing_icon` | Production art gap. |
| UI | UI panels, meters, animation frames | `public/assets/ui/` | P2 | `asset_missing_icon` | Placeholder-safe. |
| Story / Routes / Endings | route icons, route scenes, endings | `public/assets/icons/route-story/`, `public/assets/story/`, `public/assets/stages/{stage_id}/route-scenes/` | P2 | `asset_missing_background` | Dialogue and rewards should not block. |
| VFX | core VFX and item VFX frames | `public/assets/effects/{vfx_id}/` | P2 | `asset_missing` | Exact-frame warnings only. |
| Audio | categorized SFX/UI/music files | `public/assets/audio/` | P2 | audio fallback key | Flat audio retained as fallback. |
| Fonts | final font files | `public/assets/fonts/` | P3 | browser/font fallback | Folder scaffold exists. |
| Store assets | store assets | `public/assets/store/` | P3 | placeholder | Folder scaffold exists. |

## 8. Remaining Orphan / Legacy Assets

| File path | Reason still orphan/legacy | Suggested future action | Safe to delete later? |
|---|---|---|---|
| `public/assets/backgrounds/legacy/` | Compatibility fallback folder | Keep for legacy fallback behavior | no |
| `public/assets/audio/*.ogg` | Old flat audio folder | Keep as compatibility fallback | unknown |

## 9. Conflicts Resolved

- Battle and puzzle folder separation is enforced in scaffold and reports.
- Old flat backgrounds remain fallback-only and are no longer created as a primary folder by the scaffold script.
- Old single-state sprite keys are runtime aliases, not primary animation delivery keys.
- `spr_` and `ico_` checklist aliases are retained for compatibility.
- Duplicate nested `sprites/sprites/...` files were merged or removed and are no longer present.
- Old `_frame_01` naming is not used by animation definitions.
- Boss icon and boss portrait aliases now point toward boss portrait folders first.
- Monster icon drift is handled through canonical monster icon frame paths with legacy icon folder fallbacks.
- Board block base, glow, clear, and special folder rules are now reflected in runtime animation definitions and validation.

## 10. Commands Run

| Command | Result |
|---|---|
| `npm.cmd run ensure:asset-folders` | Passed. Ensured 95 standardized asset folders. |
| `npm.cmd run validate:content` | Passed. Content validation passed for 335 JSON files and 36 route scenes. |
| `npm.cmd run validate:metadata` | Passed. Content metadata validation passed. |
| `npm.cmd run validate:animations` | Passed. Validated 384 exact animation definitions. Warned that 1554 expected frame files are not present yet; non-fatal. Warned that 42 monster/boss entries are missing preferred sheets; fallback allowed. |
| `npm.cmd run sync:assets` | Passed. Scanned 521 runtime/content asset-like keys, 2130 expected unique keys and frames, and 566 physical assets. Reported 1680 missing primary files, 13 legacy-only files, 1667 fallback-safe missing production assets, 113 content keys with no physical primary or legacy file, 103 physical-only orphan/legacy candidates, and 0 nested `sprites/sprites` files. |
| `npm.cmd run audit:asset-variants` | Passed with warnings. Reported 122 warning-only findings, mostly missing production art folders/files. |
| `npm.cmd run build` | Passed. `tsc --noEmit` and `vite build` completed successfully. |

## 11. Manual Test Checklist

1. Start new run.
2. Select Milo.
3. Enter Stage 1.
4. Confirm battle background resolves from `stage_sprinkle_sewers/battle/`.
5. Confirm puzzle background resolves from `stage_sprinkle_sewers/puzzle/`.
6. Confirm Cupcake Slime King frames resolve from canonical boss frame folders.
7. Trigger boss hit animation.
8. Trigger boss defeat animation.
9. Trigger a missing frame scenario and confirm fallback does not crash.
10. Trigger route dialogue and confirm route assets fallback safely.
11. Confirm no scene depends on `sprites/sprites/...`.
12. Confirm no content JSON hardcodes raw paths.
13. Run validation and confirm missing final art is warning-only.
