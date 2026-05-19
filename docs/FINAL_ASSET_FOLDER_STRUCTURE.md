# Final Asset Folder Structure

This is the asset structure contract for Blockmancer Dungeon runtime assets. New art and audio packs should target these folders first. Older flat `spr_` / `ico_` sprite folders and `_frame_01` frame names are fallback-only compatibility paths.

## Runtime Root

```text
public/assets/
  board-blocks/
  sprites/board-blocks/{block_id}/base/
  sprites/board-blocks/{block_id}/glow/
  sprites/board-blocks/{block_id}/clear/
  sprites/board-blocks/{block_id}/special/
  sprites/heroes/{hero_id}/{state}/
  sprites/monsters/{monster_id}/{state}/
  sprites/monsters/{monster_id}/sheet/
  sprites/bosses/{boss_id}/{state}/
  sprites/bosses/{boss_id}/sheet/
  effects/{vfx_id}/
  icons/{category}/
  heroes/
  monsters/
  bosses/
  stages/
  ui/
  ui/animations/
  ui/story-routes/
  portraits/heroes/
  portraits/npcs/
  story/endings/
  stage-backgrounds/route-scenes/
  audio/
```

## Naming Rules

- Static runtime sprites use the current runtime key when one exists, for example `block_red.png`, `hero_milo_blockmancer.png`, and `item_mana_lemonade.png`.
- Exact PNG frame sequences use `asset_id__animation_name__f00.png`, `f01`, `f02`, and so on. Frame ranges are not allowed.
- Preferred monster/boss pose sheet files use:
  - `{monster_id}__pose_sheet_2x2.png`
  - `{boss_id}__pose_sheet_2x2.png`
  - optional `{boss_id}__extended_sheet_2x2.png`
- Board block frame folders are:
  - `sprites/board-blocks/{block_id}/base/{block_id}__base__f00.png`
  - `sprites/board-blocks/{block_id}/glow/{block_id}__glow__f00.png` through exact count
  - `sprites/board-blocks/{block_id}/clear/{block_id}__clear__f00.png` through exact count
  - `sprites/board-blocks/{block_id}/special/{block_id}__{animation_name}__f00.png`
- Do not create new primary `spr_` or old checklist-only names when runtime content already has a current key.
- Old flat paths such as `public/assets/sprites/board-blocks/spr_block_red_rune_glow.png` and old `_frame_01` names are fallback-only.

## Size Rules

- Gameplay board blocks render at `24x24` px.
- Board block source art targets `24x24` px.
- Board block UI icons render at `48x48` px.
- Board block icon source targets `48x48` px and can render at `32-48` depending UI context.
- Non-board-block runtime visual assets target `627x627` source art (heroes, portraits, icons, VFX, UI animation frames).
- Preferred monster/boss runtime pose sheets target `1254x1254` source with `627x627` frame cells (`2x2`).
- Runtime render size must be constrained by asset category rules, not by source PNG size.
- Fullscreen/large backgrounds remain background assets and use cover/contain behavior.
- Use nearest-neighbor / pixelated rendering for board blocks.

## Runtime Key Rules

- Content JSON references asset keys, not hardcoded paths.
- Content IDs are stable and save-facing; do not rename IDs without a migration.
- Static board block keys such as `block_red`, `block_blue`, `block_bomb`, and `block_royal` resolve first to `public/assets/board-blocks/`.
- Animation frames resolve first to the final exact-frame folders above.
- Route-story assets are UI/story assets, not board-block animations.

## Resolution Order

1. Explicit `assetRefs` / `backgrounds` from content JSON.
2. Final inferred key/path from this folder structure.
3. Existing runtime key.
4. Legacy `spriteKey`, `iconKey`, `portraitKey`, or `backgroundKey`.
5. Old flat compatibility path.
6. Category fallback placeholder.

Missing assets must log development warnings only and must never crash gameplay.

## Validation Commands

```bash
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run build
```

`validate:animations` checks exact frame counts and expected frame paths. Missing final PNG files are warnings until final art is imported.

## Asset Pack Zip Layout

Future asset packs should zip the `assets/` folder contents exactly as they should land under `public/assets/`. Do not zip an extra parent folder. Include PNG frame sequences and OGG files at their final paths, and leave legacy fallback folders out unless a compatibility patch specifically needs them.
