# Board Block Frame Animation Integration

## Files Changed

- `src/game/utils/constants.ts`
- `src/game/data/assets.ts`
- `src/game/systems/AssetSystem.ts`
- `src/game/systems/BoardSystem.ts`
- `src/game/types/GameTypes.ts`
- `src/game/scenes/BattleScene.ts`
- `src/game/content/board-blocks/metadata.json`
- `docs/BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION.md`

## How Frame Animation Works

Board block animations use PNG frame sequences only. GIF files are not supported or required. The exact frame-count and naming standard now lives in `docs/ANIMATION_ASSET_REQUIREMENTS.md`.

Glow animation is visual-only on the existing board sprite. When a block enters a highlighted visual state, the scene tries to play the loaded glow frame sequence. If all 3 glow frames are present, the frames loop until the highlight ends. When the highlight ends, the sprite animation stops and the block returns to its base texture.

Clear animation is visual-only and follows board logic. The board cell is cleared immediately by `BoardSystem`, then `BattleScene` spawns a temporary overlay sprite at the cleared cell position. The overlay plays the clear frame sequence once, then destroys itself. Cascade Gravity continues to use the resolved board state and is not replaced.

## Folder Structure

Preferred still sprite paths:

```text
public/assets/sprites/board-blocks/[color/type]/spr_block_[color/type]_rune.png
public/assets/sprites/board-blocks/[color/type]/spr_block_[color/type]_rune_glow.png
public/assets/sprites/board-blocks/[color/type]/spr_block_[color/type]_rune_clear.png
```

Preferred exact-frame paths:

```text
public/assets/sprites/board-blocks/block_[color/type]_rune/glow/spr_block_[color/type]_rune__glow__f00.png
public/assets/sprites/board-blocks/block_[color/type]_rune/clear/spr_block_[color/type]_rune__clear__f00.png
```

Icon paths:

```text
public/assets/icons/board-blocks/ico_block_[color/type]_rune.png
```

## Backward Compatibility Paths

The manifest also registers old flat sprite paths with legacy texture aliases:

```text
public/assets/sprites/board-blocks/spr_block_[color/type]_rune.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_glow.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_clear.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_glow_frame_01.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_clear_frame_01.png
```

Texture resolution uses explicit `assetRefs` first, then old fields such as `spriteKey` and `iconKey`, then inferred preferred paths, then inferred flat legacy aliases, then generated placeholders.

Legacy `_frame_01` paths remain supported as fallback compatibility. New assets should use the exact `asset_id__animation_name__f00.png` sequence from `docs/ANIMATION_ASSET_REQUIREMENTS.md`.

## Fallback Rules

- Base sprite missing: use the generated board block placeholder.
- Glow frames missing or incomplete: use the glow still sprite if loaded.
- Glow still missing: keep the base sprite.
- Clear frames missing or incomplete: show the clear still sprite briefly if loaded.
- Clear still missing: remove the block visually without crashing.
- Icon missing: use icon fallback behavior, then generated icon placeholder.
- Optional missing animation frames never block gameplay or Cascade Gravity.

## Timing Constants

`BLOCK_ANIM` defines:

```ts
BOARD_BLOCK_SIZE: 24
BOARD_ICON_SIZE: 48
GLOW_FRAME_COUNT: 3
GLOW_FRAME_MS: 50
GLOW_TOTAL_MS: 150
CLEAR_FRAME_COUNT: 5
CLEAR_FRAME_MS: 40
CLEAR_TOTAL_MS: 200
```

Board block sprites are rendered through the board cell size capped by the universal `24px` board block constant. Source images larger than the cell are not rendered at native size.

## Content Schema

Board block content may optionally provide:

```json
{
  "spriteKey": "spr_block_red_rune",
  "iconKey": "ico_block_red_rune",
  "assetRefs": {
    "base": "spr_block_red_rune",
    "glow": "spr_block_red_rune_glow",
    "clear": "spr_block_red_rune_clear",
    "icon": "ico_block_red_rune",
    "glowFrames": [
      "spr_block_red_rune_glow_frame_01",
      "spr_block_red_rune_glow_frame_02",
      "spr_block_red_rune_glow_frame_03"
    ],
    "clearFrames": [
      "spr_block_red_rune_clear_frame_01",
      "spr_block_red_rune_clear_frame_02",
      "spr_block_red_rune_clear_frame_03",
      "spr_block_red_rune_clear_frame_04",
      "spr_block_red_rune_clear_frame_05"
    ]
  }
}
```

Existing board block JSON remains valid because runtime inference fills omitted variants.

## How To Test

1. Start a battle.
2. Confirm normal board rendering remains stable.
3. Add a complete 3-frame glow sequence for a block and trigger a highlighted state such as Fever or a floating hazard.
4. Confirm glow frames loop at 50 ms per frame.
5. End the highlighted state and confirm the block returns to base.
6. Add a complete 5-frame clear sequence for a block and clear it in a line.
7. Confirm the clear overlay plays once at 40 ms per frame and then disappears.
8. Remove one optional frame and confirm the game falls back without crashing.
9. Confirm Cascade Gravity still resolves after line clears.
10. Open UI that uses content icons and confirm missing icons fall back safely.
