# Asset Pipeline

Release 1.0 art is loaded through a manifest instead of hardcoded scene paths.

## Source Folders

Runtime image files should live under `public/assets/`:

- `ui/`
- `board-blocks/`
- `board-preview/`
- `heroes/`
- `monsters/`
- `bosses/`
- `spells/`
- `relics/`
- `upgrades/`
- `items/`
- `weapons/`
- `status-effects/`
- `oopsies/`
- `npc/`
- `stages/`
- `map/`
- `effects/`
- `inventory/`
- `shop/`
- `rewards/`
- `story/`
- `branding/`

## Manifest

The manifest is built in `src/game/data/assets.ts`.

- Core fallback keys are always registered.
- Content keys are derived from `iconKey`, `spriteKey`, `portraitKey`, and `backgroundKey`.
- Stage backgrounds also support the convention `bg_${theme}`.

Example:

```json
{
  "id": "mon_dungeon_slime",
  "spriteKey": "placeholder_slime"
}
```

Expected file path:

```text
public/assets/monsters/placeholder_slime.png
```

## Fallbacks

`AssetSystem` generates fallback textures at boot:

- `asset_missing`
- `asset_missing_icon`
- `asset_missing_block`
- `asset_missing_background`

Scenes and UI components must resolve images through `AssetSystem.getTextureKey()` or `AssetSystem.addImage()` so missing files do not crash the game.

## Current Runtime Usage

- `BootScene` preloads manifest images.
- `Card` and `Button` can render manifest-backed icons/sprites.
- Battle renders hero portraits, enemy sprites, board-block sprites, item icons, spell icons, and stage backgrounds through safe fallbacks.
- Map renders stage backgrounds and map-node icons through safe fallbacks.
- Reward cards render item/relic/upgrade/oopsie icons through safe fallbacks.
