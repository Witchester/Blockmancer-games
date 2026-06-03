# Blockmancer Dungeon — Asset and Animation Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for asset sizes, runtime keys, exact-frame PNG animation contract, frame counts, VFX/UI assets, fallback behavior, and 32-bit pixel style rules.

## 1. Runtime Root

```text
public/assets/
```

Content JSON references asset keys, not raw paths.

Missing assets must log development warnings and fall back safely. Missing art must never crash gameplay.

## 2. Pixel Art Style

Use:

```text
bright polished 32-bit pixel art
cute kawaii fantasy proportions
cheerful magical festival tone
rounded toy-like forms
clean dark outlines
crisp nearest-neighbor edges
transparent background for sprites/icons/VFX
strong readable silhouettes
visible depth, highlights, shadows, rim shading
mobile-readable contrast
```

Avoid:

```text
blur
watermark
text baked into art
checkerboard backgrounds
dark horror
gore
skull-heavy visuals
muddy colors
flat low-depth shapes
realistic violence
```

## 3. Source Size Contract

| Asset Type | Source Size |
| --- | --- |
| Board gameplay blocks | 24×24 |
| Board block UI icons | 48×48 |
| Non-board single-frame assets | 627×627 |
| Hero / monster / boss pose sheets | 1254×1254 with 627×627 cells |
| VFX / UI animation frames | 627×627 unless board-specific |
| Battle backgrounds | 1080×480 |
| Puzzle backgrounds | 1080×1056 |
| Controls backgrounds | 1080×384 |
| Full portrait scenes | 1080×1920 |

Runtime render size is controlled by asset category rules, not by PNG dimensions alone.

## 4. Exact-Frame PNG Naming

Frame sequences use:

```text
{asset_id}__{animation_name}__f00.png
{asset_id}__{animation_name}__f01.png
{asset_id}__{animation_name}__f02.png
```

Rules:

- Use two-digit frame suffixes.
- Do not use GIFs as runtime animation sources.
- Do not use frame ranges as delivery contracts.
- Do not use old `_frame_01` names as primary files.
- Exact listed filenames win over broad naming guesses.

## 5. Core Folder Contract

```text
public/assets/board-blocks/
public/assets/sprites/board-blocks/{block_id}/base/
public/assets/sprites/board-blocks/{block_id}/glow/
public/assets/sprites/board-blocks/{block_id}/clear/
public/assets/sprites/board-blocks/{block_id}/special/
public/assets/sprites/heroes/{hero_id}/{state}/
public/assets/sprites/monsters/{monster_id}/{state}/
public/assets/sprites/bosses/{boss_id}/{state}/
public/assets/effects/{vfx_id}/
public/assets/icons/{category}/
public/assets/ui/
public/assets/portraits/
public/assets/stages/
public/assets/audio/
```

Legacy paths are fallback-only, not primary delivery targets.

## 6. Character Animation Contracts

Hero states:

| State | Frames |
| --- | ---: |
| idle | 4 |
| cast_spell | 6 |
| hit | 3 |
| victory | 5 |
| defeat_tired | 4 |
| portrait_icon | 1 |

Monster states:

| State | Frames |
| --- | ---: |
| idle | 4 |
| attack | 6 |
| hit | 3 |
| defeat | 6 |
| icon | 1 |

Boss states:

| State | Frames |
| --- | ---: |
| idle | 6 |
| attack | 8 |
| hit | 4 |
| phase_change | 8 |
| special_attack | 8 |
| defeat | 10 |
| portrait_icon | 1 |

Monster/boss pose sheet format:

```text
1254×1254 transparent PNG
2 columns × 2 rows
627×627 cell size
Top-left: idle
Top-right: attack
Bottom-left: hit / phase / special
Bottom-right: defeat
```

## 7. Board Block Animation Contract

Normal rune blocks:

| Asset | Frames |
| --- | ---: |
| base | 1 |
| glow | 3 |
| clear | 5 |
| icon | 1 |

Special/hazard blocks keep exact-frame contracts and must include readable warning or clear states where relevant.

Important hazard blocks:

```text
block_bomb
block_star
block_jelly
block_ice
block_sticky
block_royal
block_floaty_rune
block_cloud_junk
block_locked_rune
block_crumb_junk
block_cracked_junk
```

## 8. Core VFX IDs

```text
vfx_line_clear
vfx_cascade_pop
vfx_cascade_chain_bonus
vfx_bomb_explosion
vfx_star_burst
vfx_mana_gain
vfx_heal_pop
vfx_enemy_hit
vfx_enemy_defeat_poof
vfx_player_hit
vfx_shield_gain
vfx_reward_pickup
```

## 9. Fever Showtime Assets

Fever UI assets use existing folders:

```text
public/assets/ui/meters/
public/assets/ui/hud/
public/assets/ui/buttons/
public/assets/ui/animations/
public/assets/ui/placeholders/
public/assets/effects/{vfx_id}/
```

Recommended keys:

```text
ui_meter_fever_showtime
ui_badge_fever_ready
ui_badge_showtime_active
ui_chip_fever_locks
ui_chip_charged_lines
ui_chip_fever_heat
ui_button_fever_activate
ui_button_fever_release
ui_badge_boss_drama_guard
ui_chip_showtime_overflow
ui_charged_line_glow
ui_charged_line_release_flash
ui_soft_junk_marker
ui_fever_heat_pulse
ui_boss_drama_guard_pulse
vfx_showtime_start
vfx_charged_line_mark
vfx_showtime_release
vfx_showtime_overflow
vfx_fever_heat_warning
vfx_boss_drama_guard
```

Rules:

- Values such as Fever amount, Charged Line count, locks remaining, and Heat level are rendered by game text.
- Do not bake numbers into PNGs.
- Fever UI should use compact HUD/right-rail/control patterns.
- Do not add a separate top HP/Mana/Fever status bar.

## 10. Upgrade System Assets

The redesigned upgrade system uses existing UI, icon, animation, and effects folders. Do not add new top-level asset folders.

Folders:

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

Upgrade icon rules:

- Upgrade icons live under `public/assets/icons/upgrades/`.
- Source size is 627×627 transparent PNG.
- Upgrade card icons render around 48-64px.
- Compact chosen-upgrade summaries render around 24-32px.
- Values, levels, slot counts, and descriptions are rendered by game text, not baked into PNGs.

## 11. Node Result and Level-Up Assets

Node Result uses existing UI assets:

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

EXP values and remaining EXP are rendered by game text.

## 12. Validation Commands

```bash
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run build
```

Missing final PNGs are warning-only unless a release-lock mode explicitly changes that policy.
