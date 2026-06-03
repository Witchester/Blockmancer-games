# Blockmancer Dungeon — Canonical Folder Structure Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for runtime asset folder placement, exact-frame file naming, raw-path policy, and fallback path policy.

## 1. Canonical Root

```text
public/assets/
```

Rules:

- All runtime assets live under `public/assets/`.
- Content JSON references asset keys, not raw paths.
- Raw `public/assets/...` paths must not be hardcoded inside content JSON.
- Manifest primary paths must point at canonical folders.
- Legacy paths are fallback-only.

## 2. Full Canonical Folder Tree

```text
public/assets/
  board-blocks/
  sprites/
    board-blocks/
    heroes/
    monsters/
    bosses/
  effects/
  icons/
    board-blocks/
    battle-objectives/
    boss-rules/
    currencies/
    collectibles/
    chaos-rules/
    items/
    oopsies/
    relics/
    room-events/
    random-gameplay-events/
    status-effects/
    upgrades/
    weapons/
    spells/
    map-nodes/
    hub-buildings/
    route-story/
  stages/
    global-scenes/
    {stage_id}/
      battle/
      puzzle/
      boss-arena/
      map/
      route-scenes/
      props/
  ui/
    panels/
    buttons/
    hud/
    meters/
    mobile-controls/
    story-routes/
    animations/
    placeholders/
  portraits/
    heroes/
    npcs/
    bosses/
  story/
    endings/
    route-cards/
    dialogue-panels/
  audio/
    sfx/
    music/
    ui/
  fonts/
  placeholders/
  store/
  backgrounds/
    legacy/
```

## 3. Stage Folder Rules

| Folder | Use | Source Size |
| --- | --- | --- |
| `battle/` | Section 1 combat/battle background art only | 1080×480 |
| `puzzle/` | Section 2 puzzle gameplay background art only | 1080×1056 |
| `boss-arena/` | Boss arena background art only | 1080×480 |
| `map/` | Stage map background art | 1080×1920 |
| `route-scenes/` | Story and route scene background art | 1080×1920 |
| `props/` | Stage decoration and prop art | category-dependent |

Controls panels use 1080×384. Full portrait scenes use 1080×1920.

## 4. Exact-Frame PNG Contract

```text
{asset_id}__{animation_name}__f00.png
{asset_id}__{animation_name}__f01.png
{asset_id}__{animation_name}__f02.png
```

Rules:

- Use two-digit frame suffix.
- Do not use GIFs as runtime animation sources.
- Do not use frame ranges as delivery contracts.
- Do not use old `_frame_01` names as primary files.
- Do not use old flat `spr_*` files as primary animation files.

## 5. Board Block Folder Rules

```text
public/assets/board-blocks/
public/assets/sprites/board-blocks/{block_id}/base/
public/assets/sprites/board-blocks/{block_id}/glow/
public/assets/sprites/board-blocks/{block_id}/clear/
public/assets/sprites/board-blocks/{block_id}/special/
```

Rules:

- Board gameplay blocks are 24×24.
- Board icons are 48×48.
- Board gameplay blocks must not use 627×627 source size.

## 6. Character Sprite Folder Rules

```text
public/assets/sprites/heroes/{hero_id}/{state}/
public/assets/sprites/monsters/{monster_id}/{state}/
public/assets/sprites/bosses/{boss_id}/{state}/
```

Rules:

- Character frame source size is 627×627.
- Character pose sheets use 1254×1254.
- Runtime anchoring uses bottom-center alignment for battle sprites.
- Missing frames warn in development and fall back safely.

## 7. Effects and Icons

VFX:

```text
public/assets/effects/{vfx_id}/
```

Icons:

```text
public/assets/icons/{category}/
```

Upgrade icons use:

```text
public/assets/icons/upgrades/
```

## 8. Fever Showtime Asset Placement

Fever Showtime uses existing folders only:

```text
public/assets/ui/meters/
public/assets/ui/hud/
public/assets/ui/buttons/
public/assets/ui/animations/
public/assets/ui/placeholders/
public/assets/effects/{vfx_id}/
public/assets/icons/upgrades/
public/assets/sprites/board-blocks/{block_id}/special/
```

No new top-level Fever folder is allowed.

## 9. Upgrade System Asset Placement

Upgrade Redesign uses existing folders only:

```text
public/assets/icons/upgrades/
public/assets/ui/panels/
public/assets/ui/hud/
public/assets/ui/buttons/
public/assets/ui/animations/
public/assets/effects/vfx_upgrade_pickup/
public/assets/effects/vfx_level_up_sparkle/
public/assets/effects/vfx_upgrade_evolution/
public/assets/effects/vfx_legendary_choice/
```

Recommended keys:

```text
ui_panel_upgrade_category
ui_card_upgrade_normal
ui_card_upgrade_owned
ui_card_upgrade_ready_to_evolve
ui_card_upgrade_legendary
ui_badge_upgrade_hero
ui_badge_upgrade_board
ui_badge_upgrade_fever
ui_chip_upgrade_slot_full
ui_chip_upgrade_slot_count
ui_badge_ready_to_evolve
ui_banner_legendary_evolution
vfx_upgrade_card_flip
vfx_upgrade_level_up
vfx_upgrade_evolution
vfx_legendary_choice_confirm
```

Rules:

- Upgrade levels, slot counts, category labels, and descriptions are rendered by game text.
- Do not bake numbers into PNGs.
- Missing upgrade art falls back to existing reward-card/panel placeholders.
- Do not add a new folder in an artist brief unless this SOT is updated first.

## 10. Node Result and Level-Up Asset Placement

```text
public/assets/ui/panels/
public/assets/ui/hud/
public/assets/ui/meters/
public/assets/ui/buttons/
public/assets/ui/animations/
public/assets/effects/vfx_node_clear_sparkle/
```

Recommended keys:

```text
ui_panel_node_result
ui_node_clear_banner
ui_xp_gained_counter
ui_xp_remaining_chip
ui_xp_breakdown_row
ui_button_node_result_continue
ui_level_ready_badge
ui_meter_xp
vfx_node_clear_sparkle
```

EXP values are rendered by game text.

## 11. Legacy and Fallback-Only Paths

- `public/assets/backgrounds/legacy/` is fallback-only.
- Old flat background folders are fallback-only.
- `public/assets/sprites/sprites/...` is invalid as a primary path.
- Old `spr_` and `ico_` checklist names are aliases only when canonical runtime keys exist.
- Legacy aliases remain fallback-safe until a documented migration removes them.

## 12. Validation Expectations

- Folder scripts must create this folder tree.
- `validate:animations` validates exact-frame names and two-digit suffixes.
- `sync:assets` detects canonical assets, explicit frame filenames, and fallback-safe missing production art.
- `audit:asset-variants` understands canonical folders versus fallback-only folders.
- Missing final art is warning-only unless release-lock mode explicitly changes that policy.
