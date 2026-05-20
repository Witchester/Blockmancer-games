# Asset Folder Structure Standard

Canonical root is `public/assets/`.

## Canonical tree
- `board-blocks/`
- `sprites/board-blocks/{block_id}/{base|glow|clear|special}/`
- `sprites/heroes/{hero_id}/{idle|cast_spell|attack|hit|victory|defeat_tired|portrait_icon|sheet}/`
- `sprites/monsters/{monster_id}/{idle|attack|hit|defeat|icon|sheet}/`
- `sprites/bosses/{boss_id}/{idle|attack|hit|phase_change|special_attack|defeat|portrait_icon|sheet}/`
- `effects/{vfx_id}/`
- `icons/{category}/`
- `stages/{stage_id}/{battle|boss-arena|map|route-scenes|props}/`
- `backgrounds/legacy/` (compatibility only)
- `ui/{panels|buttons|hud|meters|mobile-controls|story-routes|animations|placeholders}/`
- `portraits/{heroes|npcs|bosses}/`
- `story/{endings|route-cards|dialogue-panels}/`
- `audio/{sfx|music|ui}/`
- `fonts/`
- `placeholders/`

## Naming
- Exact frame format: `{asset_id}__{animation_name}__f00.png`
- No frame ranges.
- Board blocks: 24x24 source/runtime.
- Board icons: 48x48 source.
- Non-board source: 627x627 where applicable.
- Pose sheets: 1254x1254 (2x2, 627 cell).

## Fallback policy
Resolution order:
1. content `assetRefs/backgrounds`
2. canonical manifest primary path
3. runtime key path
4. legacy key fields (`spriteKey/iconKey/portraitKey/backgroundKey`)
5. old flat compatibility path
6. placeholder by category

Missing assets must warn in dev only and never crash gameplay.

## Adding a new stage in the future
1. Add content JSON in `src/game/content/stages/`.
2. Add folder `public/assets/stages/{stage_id}/`.
3. Add `battle/`, `boss-arena/`, `map/`, `route-scenes/`, `props/`.
4. Add stage battle background keys to manifest.
5. Add boss arena key to manifest.
6. Add map background key to manifest.
7. Run:
   - `npm run ensure:asset-folders`
   - `npm run sync:assets`
   - `npm run audit:asset-variants`
   - `npm run validate:content`
   - `npm run validate:animations`
   - `npm run build`

## Adding a new asset safely
1. Choose stable lowercase snake_case key.
2. Place file in canonical folder.
3. Add/verify manifest entry.
4. Reference key in content JSON.
5. Do not hardcode path in scene code.
6. Run sync and validations.
7. Confirm fallback behavior.
