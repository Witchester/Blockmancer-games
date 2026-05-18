# Board Block Frame Animation Integration
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## Current Follow-up — 2026-05-18

Board block frame animation is implemented and should remain in place.

### Current status

- PNG frame sequences are supported.
- GIF files are not required.
- Glow and clear animations are visual-only and do not replace Cascade Gravity.
- Board block size is capped by the universal 24px board block constant.
- Missing frames fall back safely.

### Story route asset note

- Story-route assets such as route trigger icons, choice badges, dialogue panels, portraits, and ending cards are not board-block animations.
- They should use the same asset manifest/fallback philosophy, but they must not alter Cascade Gravity or board clear timing.
- If a route reward highlights a board hazard or special block, use the existing glow/clear frame hooks instead of adding route-specific board logic.

### Remaining work

- Import final exact-frame PNG packages using `asset_id__animation_name__f00.png` naming.
- Verify complete Priority 1 block animations in battle.
- Keep legacy `_frame_01` paths only for fallback compatibility; new art should use exact-frame naming.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

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
public/assets/board-blocks/block_[color/type].png
public/assets/sprites/board-blocks/block_[color/type]/glow/block_[color/type]__glow__f00.png
public/assets/sprites/board-blocks/block_[color/type]/clear/block_[color/type]__clear__f00.png
```

Preferred exact-frame paths:

```text
public/assets/sprites/board-blocks/block_[color/type]/glow/block_[color/type]__glow__f00.png
public/assets/sprites/board-blocks/block_[color/type]/clear/block_[color/type]__clear__f00.png
```

Icon paths:

```text
public/assets/icons/board-blocks/ico_block_[color/type].png
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
  "spriteKey": "block_red",
  "iconKey": "ico_block_red",
  "assetRefs": {
    "base": "block_red",
    "glow": "block_red_glow",
    "clear": "block_red_clear",
    "icon": "ico_block_red",
    "glowFrames": [
      "block_red__glow__f00",
      "block_red__glow__f01",
      "block_red__glow__f02"
    ],
    "clearFrames": [
      "block_red__clear__f00",
      "block_red__clear__f01",
      "block_red__clear__f02",
      "block_red__clear__f03",
      "block_red__clear__f04"
    ]
  }
}
```

Existing board block JSON remains valid because runtime inference fills omitted variants.


## Story Route Visual Integration

The character route story flow adds UI and narrative assets that may appear near the board, but they are separate from board-block animation.

Recommended route asset categories:

```text
public/assets/ui/story-routes/
public/assets/icons/story-routes/
public/assets/portraits/heroes/
public/assets/portraits/npcs/
public/assets/story/endings/
public/assets/stage-backgrounds/route-scenes/
public/assets/effects/story-routes/
```

Recommended asset key patterns:

```text
ui_route_dialogue_panel
ui_route_choice_card_practical
ui_route_choice_card_true
ui_route_choice_card_risky
ico_route_trigger_[hero]_[stage]
ico_route_badge_practical
ico_route_badge_true
ico_route_badge_risky
prt_route_[speaker]_[expression]
story_end_[hero]_normal
story_end_[hero]_true
story_end_[hero]_variant
vfx_route_reward_sparkle
vfx_route_risky_oopsie
```

Rules:

- Route dialogue panels and choice cards are UI assets, not board-block sprites.
- Route trigger icons should be loaded through the asset manifest with fallback icons.
- Hero portraits and NPC portraits should fall back to safe placeholder portraits.
- Ending cards should fall back to a generic festival ending card.
- Route reward VFX may highlight board blocks, but should call existing board highlight/glow helpers.
- Missing route visual assets must never block dialogue, choice resolution, rewards, or endings.

If a route reward clears, glows, pins, freezes, or transforms a board block, the visual sequence should use the board block's existing `glowFrames` and `clearFrames` where available. Do not create separate board logic just for the story system.


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
11. Trigger a route story event and confirm dialogue/choice UI assets fall back safely if missing.
12. Choose a route reward that highlights or clears blocks and confirm it uses existing glow/clear frame hooks without changing Cascade Gravity.
