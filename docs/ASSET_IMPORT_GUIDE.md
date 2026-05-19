# Asset Import Guide

## Supported Source Formats

- Non-board single-frame assets: `627x627` transparent PNG.
- Character pose sheets: `1254x1254` transparent PNG (`2x2`, `627x627` cells).
- Frame-sequence animations: each frame `627x627`, with exact naming:
  - `{asset_id}__{animation_name}__f00.png`
  - `{asset_id}__{animation_name}__f01.png`
  - `{asset_id}__{animation_name}__f02.png`

## Important Exception

- Board gameplay blocks are not part of the high-res conversion:
  - board block gameplay source/render stays `24x24`
  - board block icons stay `48x48`

## Character Sheet Paths

- Heroes: `public/assets/sprites/heroes/{hero_id}/sheet/{hero_id}__pose_sheet_2x2.png`
- Monsters: `public/assets/sprites/monsters/{monster_id}/sheet/{monster_id}__pose_sheet_2x2.png`
- Bosses: `public/assets/sprites/bosses/{boss_id}/sheet/{boss_id}__pose_sheet_2x2.png`
- Optional extended sheets:
  - `{hero_id}__extended_sheet_2x2.png`
  - `{boss_id}__extended_sheet_2x2.png`

## Runtime Loading Behavior

Resolution order:
1. explicit `assetRefs`
2. explicit content keys (`assetKey`, `iconKey`, `spriteKey`, `portraitKey`, `vfxKey`)
3. preferred high-res paths (including pose sheets)
4. legacy exact-frame paths
5. fallback placeholder

## Validation

Run:

```bash
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run build
```

`validate:animations` warns on missing preferred character sheets and warns on invalid pose sheet dimensions; warnings are non-fatal when fallback paths remain available.
