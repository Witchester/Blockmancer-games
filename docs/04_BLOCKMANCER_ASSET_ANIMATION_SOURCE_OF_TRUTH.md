# Blockmancer Dungeon — Asset and Animation Source of Truth

**Generated:** 2026-05-20  
**Authority:** Canonical for final asset folder structure, runtime keys, source sizes, exact-frame PNG animation contract, pose sheets, fallback behavior, placeholder interpretation, asset variants, and 32-bit pixelized style rules.

## Consolidation Summary

This file combines the final folder contract, animation asset requirements, variant integration/audit reports, placeholder report, board-block frame integration, and 32-bit pixel style guidance. `FINAL_ASSET_FOLDER_STRUCTURE.md` and `ANIMATION_ASSET_REQUIREMENTS.md` are the highest-priority production contracts inside this file.

## Asset Ownership

Use this file for:

- Folder paths under `public/assets/`.
- Static asset naming and runtime key rules.
- Exact PNG frame sequence naming.
- Source-size contracts: 24×24 board blocks, 48×48 board icons, 627×627 non-board single frames, 1254×1254 2×2 pose sheets.
- Board block glow/clear frame counts and timing.
- Missing asset fallback rules.
- Placeholder vs final art status.
- 32-bit pixelized style and third-party asset-pack usage.

For character/story meaning of an asset, cross-check the Story SOT.


---

## Final Asset Folder Structure

**Source file:** `FINAL_ASSET_FOLDER_STRUCTURE.md`

**Consolidation note:** Highest authority for runtime folders, naming, size rules, key rules, and resolution order.

### Final Asset Folder Structure

This is the asset structure contract for Blockmancer Dungeon runtime assets. New art and audio packs should target these folders first. Older flat `spr_` / `ico_` sprite folders and `_frame_01` frame names are fallback-only compatibility paths.

#### Runtime Root

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

#### Naming Rules

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

#### Size Rules

- Gameplay board blocks render at `24x24` px.
- Board block source art targets `24x24` px.
- Board block UI icons render at `48x48` px.
- Board block icon source targets `48x48` px and can render at `32-48` depending UI context.
- Non-board-block runtime visual assets target `627x627` source art (heroes, portraits, icons, VFX, UI animation frames).
- Preferred monster/boss runtime pose sheets target `1254x1254` source with `627x627` frame cells (`2x2`).
- Runtime render size must be constrained by asset category rules, not by source PNG size.
- Fullscreen/large backgrounds remain background assets and use cover/contain behavior.
- Use nearest-neighbor / pixelated rendering for board blocks.

#### Runtime Key Rules

- Content JSON references asset keys, not hardcoded paths.
- Content IDs are stable and save-facing; do not rename IDs without a migration.
- Static board block keys such as `block_red`, `block_blue`, `block_bomb`, and `block_royal` resolve first to `public/assets/board-blocks/`.
- Animation frames resolve first to the final exact-frame folders above.
- Route-story assets are UI/story assets, not board-block animations.

#### Resolution Order

1. Explicit `assetRefs` / `backgrounds` from content JSON.
2. Final inferred key/path from this folder structure.
3. Existing runtime key.
4. Legacy `spriteKey`, `iconKey`, `portraitKey`, or `backgroundKey`.
5. Old flat compatibility path.
6. Category fallback placeholder.

Missing assets must log development warnings only and must never crash gameplay.

#### Validation Commands

```bash
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run build
```

`validate:animations` checks exact frame counts and expected frame paths. Missing final PNG files are warnings until final art is imported.

#### Asset Pack Zip Layout

Future asset packs should zip the `assets/` folder contents exactly as they should land under `public/assets/`. Do not zip an extra parent folder. Include PNG frame sequences and OGG files at their final paths, and leave legacy fallback folders out unless a compatibility patch specifically needs them.


---

## Animation Asset Requirements

**Source file:** `ANIMATION_ASSET_REQUIREMENTS.md`

**Consolidation note:** Highest authority for exact-frame PNG animation contract and source sizes.

### Blockmancer Dungeon Animation Asset Requirements
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### Current Runtime / Production Status — 2026-05-18

Exact-frame animation support is implemented at manifest/runtime level.

| Item | Status |
| --- | --- |
| Exact-frame contract | Done. This document is the production contract. Frame ranges are not allowed. |
| Runtime definitions | Done. `src/game/data/animation-standards.json` and `src/game/data/animations.ts` define/expand animation definitions. |
| Validation | Done. `npm run validate:animations` validates exact frame counts and expected paths. |
| Fallback behavior | Done. Missing animation frames are nonfatal and fall back to still sprites/placeholders. |
| Asset production | Partial. Final PNG frame packages still need to be imported for release-quality visuals. |
| Priority 1 import target | Normal rune blocks, bomb/star/ice/sticky/crumb junk/royal/floaty rune, line clear, cascade pop, bomb explosion, enemy hit, and hazard warning UI. |

Do not mark the animation asset pipeline as release-complete until final PNG frame packages are present and `validate:animations` reports no missing Priority 1 frame warnings.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

This is the exact-frame animation standard for game-ready PNG frame sequences. Do not create GIF files. Every entry below has an exact frame count; frame ranges are not allowed.

Runtime keys are defined in `src/game/data/animation-standards.json` and expanded by `src/game/data/animations.ts`.
Render size is controlled at runtime by asset category display rules in `src/game/data/asset-display-rules.ts`.

#### Source Size Contract

- Board gameplay blocks keep `24x24` source and render `24x24`.
- Board block icons keep `48x48` source; UI render remains capped for readability.
- Non-board-block animation sources (hero/monster/boss, VFX, hazard UI, UI animation) target `627x627` source frames.
- Character pose sheets target `1254x1254` (`2x2`, `627x627` cell size).
- Source size and render size are intentionally decoupled; do not infer runtime display size from PNG dimensions.

#### Naming Rules

Frame sequences use:

```text
asset_id__animation_name__f00.png
asset_id__animation_name__f01.png
asset_id__animation_name__f02.png
```

Static assets use their static key:

```text
block_red.png
ico_block_red.png
```

#### Folder Structure

```text
public/assets/sprites/board-blocks/{block_id}/base/
public/assets/sprites/board-blocks/{block_id}/glow/
public/assets/sprites/board-blocks/{block_id}/clear/
public/assets/sprites/board-blocks/{block_id}/special/

public/assets/sprites/heroes/{hero_id}/idle/
public/assets/sprites/heroes/{hero_id}/cast_spell/
public/assets/sprites/heroes/{hero_id}/hit/
public/assets/sprites/heroes/{hero_id}/victory/
public/assets/sprites/heroes/{hero_id}/defeat_tired/

public/assets/sprites/monsters/{monster_id}/idle/
public/assets/sprites/monsters/{monster_id}/attack/
public/assets/sprites/monsters/{monster_id}/hit/
public/assets/sprites/monsters/{monster_id}/defeat/
public/assets/sprites/monsters/{monster_id}/sheet/{monster_id}__pose_sheet_2x2.png

public/assets/sprites/bosses/{boss_id}/idle/
public/assets/sprites/bosses/{boss_id}/attack/
public/assets/sprites/bosses/{boss_id}/hit/
public/assets/sprites/bosses/{boss_id}/phase_change/
public/assets/sprites/bosses/{boss_id}/special_attack/
public/assets/sprites/bosses/{boss_id}/defeat/
public/assets/sprites/bosses/{boss_id}/sheet/{boss_id}__pose_sheet_2x2.png
public/assets/sprites/bosses/{boss_id}/sheet/{boss_id}__extended_sheet_2x2.png

public/assets/effects/{vfx_id}/
public/assets/icons/items/
public/assets/icons/spells/
public/assets/icons/relics/
public/assets/icons/upgrades/
public/assets/ui/animations/
```

#### Monster/Boss 2x2 Pose Sheet Format

- Preferred runtime format for monster and boss poses.
- Sheet size: `1254x1254` transparent PNG.
- Frame size: `627x627`, `2 columns x 2 rows`.
- Frame order:
  - top-left: idle
  - top-right: attack
  - bottom-left: hit or phase/special
  - bottom-right: defeat
- Exact-frame folders remain supported as fallback.

#### Board Block Animation Standard

Normal rune blocks apply to `block_red_rune`, `block_blue_rune`, `block_green_rune`, and `block_yellow_rune`.

Required files per block:

| Asset | Exact frames |
| --- | ---: |
| base | 1 |
| glow | 3 |
| clear | 5 |
| icon | 1 |

Glow order: normal glow, dim glow, bright glow.

Clear order: glow start, small cracks, medium cracks, heavy cracks, completely broken or burst.

Total per normal rune block: 10 PNG files.

Bonus blocks apply to `block_sprinkle`, `block_cupcake`, `block_confetti`, and `block_toolbox`.

| Asset | Exact frames |
| --- | ---: |
| base | 1 |
| idle | 4 |
| glow | 3 |
| clear | 5 |
| icon | 1 |

Total per bonus block: 14 PNG files.

Special and hazard block requirements:

| Block | Base | Animation A | Animation B | Animation C | Animation D | Icon | Total PNG files |
| --- | ---: | --- | --- | --- | --- | ---: | ---: |
| `block_bomb` | 1 | idle: 4 | fuse: 4 | glow: 3 | explode: 6 | 1 | 19 |
| `block_star` | 1 | idle_sparkle: 4 | glow: 3 | clear_burst: 5 | cascade_boost: 5 | 1 | 19 |
| `block_jelly` | 1 | idle_wobble: 4 | glow: 3 | squish_clear: 5 | cascade_bounce: 4 | 1 | 18 |
| `block_ice` | 1 | frost_shimmer: 4 | glow: 3 | crack_clear: 5 | freeze_effect: 4 | 1 | 18 |
| `block_sticky` | 1 | goo_pulse: 4 | glow: 3 | stretch_clear: 5 | sticky_warning: 3 | 1 | 17 |
| `block_royal` | 1 | royal_pulse: 4 | warning_glow: 3 | pattern_lock: 4 | break: 5 | 1 | 18 |
| `block_floaty_rune` | 1 | hover: 4 | countdown_warning: 3 | safe_drop: 3 | expire_to_junk: 5 | 1 | 17 |
| `block_cloud_junk` | 1 | hover: 4 | countdown_warning: 3 | safe_drop: 3 | expire_to_junk: 5 | 1 | 17 |
| `block_locked_rune` | 1 | lock_pulse: 4 | unlock: 4 | break: 5 | - | 1 | 15 |

Junk blocks apply to `block_crumb_junk` and `block_cracked_junk`.

| Asset | Exact frames |
| --- | ---: |
| base | 1 |
| damaged | 3 |
| break | 5 |
| icon | 1 |

Total per junk block: 10 PNG files.

#### Core VFX Animation Standard

| VFX ID | Exact frames |
| --- | ---: |
| `vfx_line_clear` | 6 |
| `vfx_cascade_pop` | 6 |
| `vfx_cascade_chain_bonus` | 5 |
| `vfx_bomb_explosion` | 8 |
| `vfx_star_burst` | 6 |
| `vfx_mana_gain` | 5 |
| `vfx_heal_pop` | 5 |
| `vfx_enemy_hit` | 4 |
| `vfx_enemy_defeat_poof` | 6 |
| `vfx_player_hit` | 4 |
| `vfx_shield_gain` | 5 |
| `vfx_reward_pickup` | 5 |

#### Spell VFX Animation Standard

Each spell also needs one spell icon.

| Spell ID | Exact VFX frames |
| --- | ---: |
| `spl_fireball` | 8 |
| `spl_frost_lock` | 6 |
| `spl_bomb_rune` | 8 |
| `spl_clean_cut` | 6 |
| `spl_sprinkle_shower` | 6 |
| `spl_cupcake_blast` | 6 |
| `spl_confetti_pop` | 6 |
| `spl_bubble_shield` | 6 |
| `spl_star_spark` | 7 |
| `spl_jelly_bounce` | 6 |
| `spl_snowcone_burst` | 6 |
| `spl_goblin_gadget` | 7 |
| `spl_rainbow_reroll` | 7 |
| `spl_snack_break` | 6 |
| `spl_cascade_cheer` | 7 |

#### Item Use VFX Animation Standard

Basic consumable item use applies to `item_mini_cupcake`, `item_mana_lemonade`, `item_rainbow_soda`, `item_toolbox`, `item_snowcone`, `item_party_popper`, `item_bubble_gum`, `item_lucky_ticket`, `item_hold_coupon`, and `item_block_polish`.

| Asset | Exact frames |
| --- | ---: |
| icon | 1 |
| use_vfx | 5 |

Reactive counter item use applies to `item_snack_vacuum`, `item_festival_mop`, `item_cloud_pin`, `item_snack_shield`, `item_return_stamp`, `item_preview_glasses`, `item_hot_cocoa`, `item_speed_brake`, `item_tent_pole`, `item_safety_net`, `item_balloon_pop`, `item_trash_lid`, `item_queue_comb`, `item_nope_stamp`, `item_alarm_cookie`, and `item_royal_eraser`.

| Asset | Exact frames |
| --- | ---: |
| icon | 1 |
| use_vfx | 6 |
| counter_success_vfx | 5 |

Spell catalyst item use applies to `item_firecracker_sugar`, `item_frosting_salt`, `item_bomb_fuse`, `item_star_syrup`, `item_cascade_confetti`, `item_spell_coupon`, and `item_cleaning_charm`.

| Asset | Exact frames |
| --- | ---: |
| icon | 1 |
| catalyst_ready_vfx | 4 |
| catalyst_consume_vfx | 5 |

#### Hero Animation Standard

Applies to `hero_milo_blockmancer`, `hero_pippa_pyromancer`, `hero_nixie_frostbinder`, `hero_bruk_snack_knight`, `hero_zuzu_goblin_engineer`, and `hero_lumi_star_witch`.

| Asset | Exact frames |
| --- | ---: |
| idle | 4 |
| cast_spell | 6 |
| hit | 3 |
| victory | 5 |
| defeat_tired | 4 |
| portrait_icon | 1 |

Total per hero: 23 PNG files.

#### Monster Animation Standard

Applies to regular monsters.

| Asset | Exact frames |
| --- | ---: |
| idle | 4 |
| attack | 6 |
| hit | 3 |
| defeat | 6 |
| icon | 1 |

Total per monster: 20 PNG files.

#### Boss Animation Standard

Applies to `boss_cupcake_slime_king`, `boss_prototype_no_7`, `boss_gelato_golem`, `boss_sir_snore_a_lot`, `boss_high_score_hydra`, and `boss_king_bloxley`.

| Asset | Exact frames |
| --- | ---: |
| idle | 6 |
| attack | 8 |
| hit | 4 |
| phase_change | 8 |
| special_attack | 8 |
| defeat | 10 |
| portrait_icon | 1 |

Total per boss: 45 PNG files.

#### Hazard UI Animation Standard

| Hazard UI ID | Exact frames |
| --- | ---: |
| `hazard_incoming_junk_warning` | 4 |
| `hazard_floaty_countdown` | 4 |
| `hazard_freeze_warning` | 4 |
| `hazard_preview_hidden_warning` | 4 |
| `hazard_low_ceiling_warning` | 4 |
| `hazard_bad_piece_delivery_warning` | 4 |
| `hazard_speed_wave_warning` | 4 |
| `hazard_royal_pattern_warning` | 6 |

#### UI Animation Standard

| UI animation ID | Exact frames |
| --- | ---: |
| `ui_button_press` | 3 |
| `ui_spell_button_ready` | 4 |
| `ui_spell_button_disabled` | 1 |
| `ui_inventory_open` | 5 |
| `ui_reward_card_flip` | 6 |
| `ui_boss_rule_card_intro` | 6 |
| `ui_stage_transition` | 8 |
| `ui_victory_banner` | 8 |
| `ui_defeat_banner` | 8 |


---

## Sequential Encounter and Festival Level-Up Asset Standard

**Added:** 2026-05-22  
**Authority:** Canonical asset, icon, UI, VFX, and fallback rules for sequential multi-enemy encounter packs, monster stack previews, enemy entry pressure/gift feedback, Node Result Screens, XP gain/remaining display, Festival Level-Up screens, XP display, and level-up upgrade cards.

### Design Context

The new encounter model allows one battle node to contain 1-3 enemies generated from the current stage or biome monster pool. The player fights only one active enemy at a time. Additional enemies are represented through a compact monster stack UI, not through simultaneous battle sprites.

The Festival Level-Up system grants XP during combat but presents upgrade choices only after the full node is cleared. Level-up cards use existing upgrade/icon categories and must remain readable on portrait mobile.

### Monster Stack UI Asset Rules

Monster stack previews should reuse existing canonical monster icon assets instead of creating a separate icon family.

| UI Use | Source Asset | Canonical Folder | Runtime Render Size |
| --- | --- | --- | ---: |
| Active enemy stack icon | `ico_{monster_id}` or monster `icon` variant | `public/assets/sprites/monsters/{monster_id}/icon/` | 28px default, 24px compact, max 36px |
| Partly hidden next enemy icon | same monster icon variant | `public/assets/sprites/monsters/{monster_id}/icon/` | 24-28px, 40-55% tucked behind active icon |
| Unknown later-enemy chip | `ui_monster_stack_mystery_chip` | `public/assets/ui/hud/` | 24-28px |
| Remaining count chip | `ui_monster_stack_count_chip` | `public/assets/ui/hud/` | 20-24px |

Rules:

- Do not create new primary monster-stack-specific monster icons when a canonical monster icon already exists.
- The active enemy icon may be fully visible.
- The next enemy icon should be partly visible to preserve surprise.
- Enemies after the next should use a generic mystery/count chip such as `+1` or `+2` rendered by UI text, not baked into the image.
- Monster stack UI must sit in the top 25% combat area and must not cover the board, Hold, Next Queue, right stat cards, or event log.
- Missing monster icons fall back to the monster placeholder icon and must not block battle progression.

### Enemy Entry Pressure + Player Gift Feedback Assets

Each new enemy entry may show both pressure and a positive player gift. These should use small readable VFX, HUD chips, and event log lines.

| Asset ID | Exact Frames | Folder | Purpose |
| --- | ---: | --- | --- |
| `vfx_enemy_entry_poof` | 6 | `public/assets/effects/vfx_enemy_entry_poof/` | Friendly spawn transition for the next sequential enemy. |
| `vfx_enemy_entry_pressure_warning` | 5 | `public/assets/effects/vfx_enemy_entry_pressure_warning/` | Shows safe incoming pressure, warning, or stage hazard preview. |
| `vfx_enemy_entry_player_gift` | 5 | `public/assets/effects/vfx_enemy_entry_player_gift/` | Shows player-positive entry gift such as mana, shield, sprinkle block, slowed piece, or grace. |
| `vfx_enemy_entry_attack_reset` | 4 | `public/assets/effects/vfx_enemy_entry_attack_reset/` | Optional countdown/intent reset feedback. |
| `ui_entry_grace_chip` | 1 | `public/assets/ui/hud/` | Small HUD chip for entry grace pieces. |
| `ui_entry_gift_chip` | 1 | `public/assets/ui/hud/` | Small HUD chip for entry gift notice. |

Rules:

- Entry pressure VFX must communicate warning, not instant punishment.
- Entry gift VFX should be cheerful and positive, such as sparkle, snack, shield, or mana glow.
- Do not obscure the falling-block board with entry VFX.
- Missing entry VFX falls back to event log text and safe HUD placeholder.

### Monster Stack / Reveal UI Animation Standard

| UI Animation ID | Exact Frames | Folder | Notes |
| --- | ---: | --- | --- |
| `ui_monster_stack_slide_in` | 5 | `public/assets/ui/animations/` | Stack appears at battle start or node transition. |
| `ui_monster_stack_next_reveal` | 6 | `public/assets/ui/animations/` | Next monster icon becomes active after current enemy defeat. |
| `ui_monster_stack_count_pulse` | 4 | `public/assets/ui/animations/` | Remaining count updates. |
| `ui_monster_stack_clear` | 5 | `public/assets/ui/animations/` | Node encounter fully cleared. |


### Node Result Screen UI Asset Rules

The Node Result Screen appears after a battle node is fully cleared and before Festival Level-Up card selection or normal node rewards.

| UI Use | Asset Key Pattern | Folder | Runtime Render Size |
| --- | --- | --- | ---: |
| Node result panel | `ui_panel_node_result` | `public/assets/ui/panels/` | Modal responsive |
| Node clear banner | `ui_node_clear_banner` | `public/assets/ui/hud/` | Combat/result header responsive |
| EXP gained counter | `ui_xp_gained_counter` | `public/assets/ui/hud/` | Text/chip responsive |
| EXP remaining chip | `ui_xp_remaining_chip` | `public/assets/ui/hud/` | Text/chip responsive |
| EXP breakdown row | `ui_xp_breakdown_row` | `public/assets/ui/panels/` | Compact row |
| Continue button | `ui_button_node_result_continue` | `public/assets/ui/buttons/` | Touch-friendly |
| Level ready badge | `ui_level_ready_badge` | `public/assets/ui/hud/` | 32-48px |

Rules:

- The result panel must be readable in portrait mobile and should use short labels.
- EXP amount and EXP remaining must be text-rendered by UI, not baked into images.
- The EXP bar may reuse `ui_meter_xp` from the Festival Level-Up UI.
- Result screen art must not cover active gameplay because it appears after battle resolution.
- Missing result screen art falls back to `ui_panel_default`, `ui_meter_xp`, and simple text.

### Node Result Screen Animation Standard

| Asset ID | Exact Frames | Folder | Purpose |
| --- | ---: | --- | --- |
| `ui_node_result_panel_intro` | 6 | `public/assets/ui/animations/` | Result screen opens after node clear. |
| `ui_node_clear_banner_pop` | 5 | `public/assets/ui/animations/` | Node clear title/badge appears. |
| `ui_xp_meter_count_up` | 8 | `public/assets/ui/animations/` | EXP meter fills from previous value to new value. |
| `ui_xp_breakdown_row_pop` | 4 | `public/assets/ui/animations/` | Each EXP breakdown row appears. |
| `ui_level_ready_badge_pulse` | 6 | `public/assets/ui/animations/` | Level-up ready badge pulses when pending level-up exists. |
| `vfx_node_clear_sparkle` | 6 | `public/assets/effects/vfx_node_clear_sparkle/` | Cheerful node-clear sparkle, optional. |

Fallback rule: if these animations are missing, show the static result panel and text. Missing result animations must never block EXP application, pending level-up routing, or reward flow.

### Festival Level-Up UI Asset Rules

Festival Level-Up uses existing UI, upgrade icon, VFX, and HUD categories. No new top-level asset folder is required.

| UI Use | Asset Key Pattern | Folder | Runtime Render Size |
| --- | --- | --- | ---: |
| Level-up panel | `ui_panel_level_up` | `public/assets/ui/panels/` | Section/modal responsive |
| Level-up card frame | `ui_level_up_card_common`, `ui_level_up_card_rare`, `ui_level_up_card_hero` | `public/assets/ui/panels/` | Card responsive |
| XP meter | `ui_meter_xp` | `public/assets/ui/meters/` | HUD/modal responsive |
| Level badge | `ui_level_badge` | `public/assets/ui/hud/` | 32-48px |
| Upgrade icon | `ico_{upgrade_id}` | `public/assets/icons/upgrades/` | 48px on card, 24-32px compact |
| Reroll button | `ui_button_level_reroll` | `public/assets/ui/buttons/` | Touch-friendly |
| Confirm button | `ui_button_level_confirm` | `public/assets/ui/buttons/` | Touch-friendly |

Rules:

- Level-up cards must be readable on portrait mobile.
- Upgrade icons should be centered, no text baked into the image, and readable at 24-48px.
- Card rarity/hero-specific styling should use frames, borders, small symbols, or color treatment from UI assets, not hardcoded raw paths.
- Hero-specific level-up cards may use the selected hero portrait/icon as a small badge, but should not require new hero art.
- Missing card art falls back to `ui_panel_default` and generated icon placeholders.

### Festival Level-Up Animation and VFX Standard

| Asset ID | Exact Frames | Folder | Purpose |
| --- | ---: | --- | --- |
| `ui_level_up_panel_intro` | 8 | `public/assets/ui/animations/` | Level-up screen opens after node clear. |
| `ui_level_up_card_flip` | 6 | `public/assets/ui/animations/` | Three upgrade cards reveal. |
| `ui_level_up_card_select` | 5 | `public/assets/ui/animations/` | Selected upgrade confirmation. |
| `ui_xp_meter_fill` | 6 | `public/assets/ui/animations/` | XP bar fills after combat. |
| `vfx_level_up_sparkle` | 8 | `public/assets/effects/vfx_level_up_sparkle/` | Cheerful level-up sparkle. |
| `vfx_upgrade_apply_general` | 5 | `public/assets/effects/vfx_upgrade_apply_general/` | General upgrade applied. |
| `vfx_upgrade_apply_hero` | 6 | `public/assets/effects/vfx_upgrade_apply_hero/` | Hero-specific upgrade applied. |

### Upgrade Icon Key Rules

Level-up upgrades use the existing upgrade icon category.

Recommended key pattern:

```text
ico_lvl_clear_line_damage
ico_lvl_max_hp_percent
ico_lvl_mana_gain
ico_lvl_spell_damage
ico_lvl_cascade_damage
ico_lvl_starting_shield
ico_lvl_entry_grace
ico_lvl_milo_plink_mana
ico_lvl_pippa_preheat
ico_lvl_zuzu_bomb_friend
ico_lvl_nixie_chill_timing
ico_lvl_bruk_snack_armor
ico_lvl_lumi_star_guidance
```

Rules:

- Use `public/assets/icons/upgrades/` for all level-up upgrade icons.
- Keep source icon assets at `627x627` unless a future UI-specific icon rule says otherwise.
- Runtime card display should render upgrade icons at approximately 48px.
- Compact summary/history displays should render upgrade icons at 24-32px.
- Do not hardcode raw icon paths in content JSON; content should use `iconKey` / `assetKey`.

### Fallback Rules

- Missing monster stack icon: use monster placeholder icon.
- Missing monster mystery chip: use generic UI placeholder chip.
- Missing entry VFX: show event log text and a simple HUD pulse.
- Missing node result panel art: use `ui_panel_default`, `ui_meter_xp`, and generated text/chips.
- Missing level-up panel/card art: use `ui_panel_default` and generated fallback frame.
- Missing upgrade icon: use generic upgrade placeholder icon.
- Missing level-up animation frames: show static panel/card state without blocking upgrade choice.
- Missing VFX must never block encounter progression, enemy transition, XP gain, upgrade selection, save/load, or node clear.

### Validation Expectations

The following validation/sync systems must understand the new asset references as canonical assets, not legacy paths:

```bash
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run build
```

Missing final art remains warning-only unless release-lock mode is explicitly enabled. Runtime must stay fallback-safe.

## Board Block Frame Animation Integration

**Source file:** `BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION_WITH_STORY_FLOW.md`

**Consolidation note:** Use for runtime behavior, fallback rules, and board animation timing details.

### Board Block Frame Animation Integration
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### Current Follow-up — 2026-05-18

Board block frame animation is implemented and should remain in place.

##### Current status

- PNG frame sequences are supported.
- GIF files are not required.
- Glow and clear animations are visual-only and do not replace Cascade Gravity.
- Board block size is capped by the universal 24px board block constant.
- Missing frames fall back safely.

##### Story route asset note

- Story-route assets such as route trigger icons, choice badges, dialogue panels, portraits, and ending cards are not board-block animations.
- They should use the same asset manifest/fallback philosophy, but they must not alter Cascade Gravity or board clear timing.
- If a route reward highlights a board hazard or special block, use the existing glow/clear frame hooks instead of adding route-specific board logic.

##### Remaining work

- Import final exact-frame PNG packages using `asset_id__animation_name__f00.png` naming.
- Verify complete Priority 1 block animations in battle.
- Keep legacy `_frame_01` paths only for fallback compatibility; new art should use exact-frame naming.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

#### Files Changed

- `src/game/utils/constants.ts`
- `src/game/data/assets.ts`
- `src/game/systems/AssetSystem.ts`
- `src/game/systems/BoardSystem.ts`
- `src/game/types/GameTypes.ts`
- `src/game/scenes/BattleScene.ts`
- `src/game/content/board-blocks/metadata.json`
- `docs/BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION.md`

#### How Frame Animation Works

Board block animations use PNG frame sequences only. GIF files are not supported or required. The exact frame-count and naming standard now lives in `docs/ANIMATION_ASSET_REQUIREMENTS.md`.

Glow animation is visual-only on the existing board sprite. When a block enters a highlighted visual state, the scene tries to play the loaded glow frame sequence. If all 3 glow frames are present, the frames loop until the highlight ends. When the highlight ends, the sprite animation stops and the block returns to its base texture.

Clear animation is visual-only and follows board logic. The board cell is cleared immediately by `BoardSystem`, then `BattleScene` spawns a temporary overlay sprite at the cleared cell position. The overlay plays the clear frame sequence once, then destroys itself. Cascade Gravity continues to use the resolved board state and is not replaced.

#### Folder Structure

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

#### Backward Compatibility Paths

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

#### Fallback Rules

- Base sprite missing: use the generated board block placeholder.
- Glow frames missing or incomplete: use the glow still sprite if loaded.
- Glow still missing: keep the base sprite.
- Clear frames missing or incomplete: show the clear still sprite briefly if loaded.
- Clear still missing: remove the block visually without crashing.
- Icon missing: use icon fallback behavior, then generated icon placeholder.
- Optional missing animation frames never block gameplay or Cascade Gravity.

#### Timing Constants

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

#### Content Schema

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


#### Story Route Visual Integration

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


#### How To Test

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


---

## Asset Variant Integration Report

**Source file:** `ASSET_VARIANT_INTEGRATION_REPORT.md`

**Consolidation note:** Use for what variant resolution supports in runtime.

### Asset Variant Integration Report
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### Current Follow-up — 2026-05-18

The integration is valid and should be kept.

##### What is done

- Board, hero, monster, boss, stage, map node, reward/control, and audio variant resolution is implemented.
- BattleScene uses board glow/clear states, hero/monster states, boss phase variants, and stage background layers.
- Missing variants safely fall back.

##### What remains

- Add final art for optional legacy/future blocks if they stay in scope.
- Add final hero art for Bloop/Professor only if they stay selectable.
- Add dedicated VFX hooks to individual spell/status systems as those behaviors become concrete.
- Add final licensed BGM/SFX files.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

Generated: 2026-05-15

#### Categories Now Supporting Variants

- Board blocks: base, glow, clear, icon.
- Heroes: idle, cast, attack, hit, victory, defeat, portrait, locked, icon.
- Monsters: idle, attack, hit, defeat, icon.
- Bosses: idle, attack, special, phase_2, hit, defeat, intro_portrait, icon.
- Stages: battle, far/mid/near battle layers, map background, boss arena.
- Map nodes: available, current, completed, locked.
- Rewards and battle controls: category icon resolution with new `ico_` / `icon_` names before legacy fallbacks.
- Audio: `playSfx` / `playBgm` helpers can play raw keys when files exist and fall back to synthesized cue tones.

#### Code Updated

- `src/game/data/assets.ts` now preloads convention-based expanded asset keys from the current content registry.
- `src/game/systems/AssetSystem.ts` now resolves variant textures through normalized helper APIs.
- `src/game/systems/AudioSystem.ts` now exposes key-based SFX/BGM helpers with fallback cues.
- `src/game/scenes/BattleScene.ts` now uses block glow/clear states, hero state sprites, monster/boss state sprites, and stage background layers.
- `src/game/scenes/HeroSelectScene.ts` now uses hero portrait/icon/locked variants where available.
- `src/game/scenes/MapScene.ts` now uses map node state variants.
- `src/game/scenes/RewardScene.ts` now resolves reward icons through the asset resolver.

#### Content And Schema Updated

- `src/game/content/board-blocks/metadata.json` documents optional `assetRefs`.
- Board block JSON keeps the legacy `spriteKey` but now includes explicit `assetRefs` where matching checklist/repo files exist.
- Existing content IDs and save-facing IDs were not renamed.

#### Variants Used In Gameplay

- Board cells use `base` normally.
- Board cells use `glow` during Fever, floating-warning display, and cascade gravity frames.
- Board cells use `clear` during cascade clear frames when available.
- Hero battle portrait uses `idle`, switches to `cast` on spell cast, `hit` on damage, and `victory` when a battle is won.
- Enemy sprite uses `idle`, switches to `attack` for enemy actions, `hit` on damage, `defeat` on victory, and boss `phase_2` on phase changes.
- Battle scene uses stage far/mid/near background layers when available.
- Map scene uses node state icons for current/available/completed/locked states.

#### Fallback Behavior

- Variant resolver order is: explicit `assetRefs` / `backgrounds`, inferred new key, legacy key field, old runtime key, category fallback texture.
- Missing glow/clear/icon/state assets fall back to base or existing placeholder textures.
- Missing audio files continue to use `AudioSystem` synthesized fallback tones.

#### Detected Coverage

- Board blocks audited: 21.
- Heroes audited: 8.
- Stages audited: 6.
- Missing optional variants: 26, mostly legacy extra blocks and non-release hero entries; all fall back safely.
- Detailed audit: `docs/ASSET_VARIANT_AUDIT.md`.

#### Remaining Manual Work

- Add final variant art for `block_junk`, `block_magic`, `block_stone`, and `block_void` if those blocks should use expanded visuals.
- Add hero state art for `hero_bloop_slime_friend` and `hero_poplin_professor` if they remain selectable.
- Wire dedicated VFX assets into individual spell/status systems as those effect systems gain concrete animation hooks.
- Add licensed BGM/SFX files at the expected `public/assets/audio/` paths.


---

## Asset Variant Audit

**Source file:** `ASSET_VARIANT_AUDIT.md`

**Consolidation note:** Use for current ready/fallback coverage by category.

### Asset Variant Audit

Generated: 2026-05-18T16:07:38.485Z

#### Board Blocks

| ID | Base | Glow | Clear | Icon |
| --- | --- | --- | --- | --- |
| block_blue | ready | fallback | fallback | fallback |
| block_bomb | ready | fallback | fallback | ready |
| block_cloud_junk | ready | fallback | fallback | ready |
| block_confetti | ready | fallback | fallback | ready |
| block_crumb_junk | ready | fallback | fallback | ready |
| block_cupcake | ready | fallback | fallback | ready |
| block_floaty_rune | ready | fallback | fallback | ready |
| block_green | ready | fallback | fallback | fallback |
| block_ice | ready | fallback | fallback | ready |
| block_jelly | ready | fallback | fallback | ready |
| block_junk | ready | fallback | fallback | fallback |
| block_magic | ready | fallback | fallback | fallback |
| block_red | ready | fallback | fallback | fallback |
| block_royal | ready | fallback | fallback | ready |
| block_sprinkle | ready | fallback | fallback | ready |
| block_star | ready | fallback | fallback | ready |
| block_sticky | ready | fallback | fallback | ready |
| block_stone | ready | fallback | fallback | fallback |
| block_toolbox | ready | fallback | fallback | ready |
| block_void | ready | fallback | fallback | fallback |
| block_yellow | ready | fallback | fallback | fallback |

#### Heroes

| ID | Idle | Cast | Hit | Victory | Icon |
| --- | --- | --- | --- | --- | --- |
| hero_bloop_slime_friend | fallback | fallback | fallback | fallback | fallback |
| hero_bruk_snack_knight | ready | ready | ready | ready | ready |
| hero_lumi_star_witch | ready | ready | ready | ready | ready |
| hero_milo_blockmancer | ready | ready | ready | ready | ready |
| hero_nixie_frostbinder | ready | ready | ready | ready | ready |
| hero_pippa_pyromancer | ready | ready | ready | ready | ready |
| hero_poplin_professor | fallback | fallback | fallback | fallback | fallback |
| hero_zuzu_goblin_engineer | ready | ready | ready | ready | ready |

#### Stages

| ID | Far | Mid | Near | Map | Boss Arena |
| --- | --- | --- | --- | --- | --- |
| stage_bloxley_block_palace | ready | ready | ready | ready | ready |
| stage_frosty_pantry | ready | ready | ready | ready | ready |
| stage_goblin_workshop | ready | ready | ready | ready | ready |
| stage_pillow_castle | ready | ready | ready | ready | ready |
| stage_sprinkle_sewers | ready | ready | ready | ready | ready |
| stage_starfall_arcade | ready | ready | ready | ready | ready |


---

## Placeholder Asset Generation Report

**Source file:** `PLACEHOLDER_ASSET_GENERATION_REPORT.md`

**Consolidation note:** Use to separate runtime-safe placeholders from release-quality art/audio needs.

### Placeholder Asset Generation Report
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### Current Interpretation — 2026-05-18

Placeholder generation solved runtime safety, not final art quality.

| Result | Meaning |
| --- | --- |
| 853 placeholder images created/copied | The game can render missing visual assets safely. |
| 197 existing files preserved | Existing non-empty files were not overwritten. |
| 125 audio rows unresolved | Final audio still needs licensed OGG assets. |
| 4 font rows unresolved | Font assets still need final licensed files or confirmed fallback. |

Next step: replace placeholders by production priority, starting with board blocks, VFX, UI, heroes, Stage 1 monsters, and Stage 1 boss.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

Generated: 2026-05-15T18:27:42.223Z

#### Workbook Parsed

- Workbook: `blockmancer_release_1_asset_checklist.xlsx`
- Category sheets parsed: 39
- Checklist rows parsed: 992

#### Counts

- Files already existing and skipped: 197
- New placeholder image files created/copied: 853
- Runtime alias files created: 0
- Runtime placeholders generated directly: 0
- Audio files copied: 0
- Audio files synthesized: 0
- Audio rows unresolved: 125
- Font files copied: 0
- Font rows unresolved: 4
- Other unresolved rows: 0

#### Metadata Action Summary

- copied: 853
- existing: 197
- unresolved: 129

#### Existing Files Not Overwritten

- 197 existing non-empty files were preserved.
- Use `npm run assets:placeholders -- --force` only to regenerate files previously tracked in `public/assets/generated-placeholders.json` as generated/copied/runtime aliases.

#### Audio And Font Handling

- Existing valid OGG source: none found
- ffmpeg available: no
- Licensed repo TTF source: none found
- Fake `.ogg` and `.ttf` files were not created.

#### Runtime Alias Files Created

- None needed.

#### Runtime Inventory Covered

- Runtime image paths checked: 187
- Runtime sources scanned: `src/game/data/assets.ts` and `src/game/content/**/*.json`.
- Fields scanned: `spriteKey`, `iconKey`, `portraitKey`, `backgroundKey`, `assetKey`, `textureKey`, `imageKey`, `atlasKey`, `bgmKey`, `sfxKey`.

#### Known Naming Mismatches

- `public/assets/sprites/board-blocks/spr_block_red_rune.png` -> `public/assets/board-blocks/block_red.png`
- `spr_block_red_rune.png` -> `public/assets/board-blocks/block_red.png`
- `spr_block_blue_rune.png` -> `public/assets/board-blocks/block_blue.png`
- `spr_block_green_rune.png` -> `public/assets/board-blocks/block_green.png`
- `spr_block_yellow_rune.png` -> `public/assets/board-blocks/block_yellow.png`
- `spr_block_bomb.png` -> `public/assets/board-blocks/block_bomb.png`
- `spr_block_sprinkle.png` -> `public/assets/board-blocks/block_sprinkle.png`
- `spr_block_cupcake.png` -> `public/assets/board-blocks/block_cupcake.png`
- `spr_block_star.png` -> `public/assets/board-blocks/block_star.png`
- `spr_block_jelly.png` -> `public/assets/board-blocks/block_jelly.png`
- `spr_block_ice.png` -> `public/assets/board-blocks/block_ice.png`
- `spr_block_sticky.png` -> `public/assets/board-blocks/block_sticky.png`
- `spr_block_crumb_junk.png` -> `public/assets/board-blocks/block_crumb_junk.png`
- `spr_block_cloud_junk.png` -> `public/assets/board-blocks/block_cloud_junk.png`
- `spr_block_floaty_rune.png` -> `public/assets/board-blocks/block_floaty_rune.png`
- `spr_block_royal.png` -> `public/assets/board-blocks/block_royal.png`
- `spr_block_confetti.png` -> `public/assets/board-blocks/block_confetti.png`
- `spr_block_toolbox.png` -> `public/assets/board-blocks/block_toolbox.png`

#### Unresolved Assets

- `placeholder_audio_silence` (audio) from 00 Global Placeholder: public/assets/placeholders/placeholder_audio_silence.ogg
- `bgm_title_festival_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_main_menu_cozy_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_hub_brixonia_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_map_adventure_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_tutorial_playful_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_shop_marnie_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_reward_sparkle_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_event_silly_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_rest_cozy_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_treasure_twinkle_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_victory_fanfare` (audio) from 01 BGM: audio/bgm/
- `bgm_defeat_soft_stinger` (audio) from 01 BGM: audio/bgm/
- `bgm_ending_normal_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_ending_true_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_stage_sprinkle_sewers_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_stage_goblin_workshop_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_stage_frosty_pantry_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_stage_pillow_castle_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_stage_starfall_arcade_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_stage_bloxley_block_palace_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_boss_cupcake_slime_king_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_boss_prototype_no_7_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_boss_gelato_golem_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_boss_sir_snore_a_lot_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_boss_high_score_hydra_loop` (audio) from 01 BGM: audio/bgm/
- `bgm_boss_king_bloxley_loop` (audio) from 01 BGM: audio/bgm/
- `amb_festival_crowd_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_stage_sprinkle_sewers_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_stage_goblin_workshop_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_stage_frosty_pantry_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_stage_pillow_castle_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_stage_starfall_arcade_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_stage_bloxley_block_palace_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_shop_small_bells_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `amb_treasure_sparkle_loop` (audio) from 02 Ambient Audio: audio/ambience/
- `sfx_board_piece_spawn` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_piece_move` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_piece_rotate` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_piece_soft_drop` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_piece_hard_drop` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_piece_lock` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_hold_piece` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_swap_next_hold` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_line_clear` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_line_clear_big` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_cascade_1` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_cascade_2` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_cascade_3` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_cascade_mega` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_combo_tick` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_fever_ready` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_fever_start` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_fever_end` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_overflow_warning` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_board_overflow_defeat` (audio) from 03 SFX - Board: audio/sfx/board/
- `sfx_block_sprinkle_clear` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_cupcake_clear` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_bomb_explode` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_star_clear` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_jelly_bounce` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_ice_crack` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_sticky_squish` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_crumb_junk_land` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_royal_spawn` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_royal_clear` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_confetti_pop` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_toolbox_charge` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_floaty_rune_warn` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_floaty_rune_drop` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_cloud_junk_drop` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_locked_rune_break` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_cracked_junk_hit` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_block_cracked_junk_break` (audio) from 04 SFX - Special Blocks: audio/sfx/blocks/
- `sfx_combat_enemy_hit` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_defeat` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_player_hit` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_player_heal` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_player_shield_gain` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_shield_break` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_intent_warning` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_attack_basic` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_attack_junk` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_attack_freeze` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_attack_sleep` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_enemy_attack_royal` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_boss_intro` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_boss_phase_change` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_boss_defeat` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_victory` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_combat_defeat` (audio) from 05 SFX - Combat: audio/sfx/combat/
- `sfx_spl_fireball_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_frost_lock_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_bomb_rune_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_clean_cut_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_sprinkle_shower_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_cupcake_blast_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_confetti_pop_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_bubble_shield_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_star_spark_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_jelly_bounce_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_snowcone_burst_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_goblin_gadget_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_rainbow_reroll_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_snack_break_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_spl_cascade_cheer_cast` (audio) from 06 SFX - Spells: audio/sfx/spells/
- `sfx_ui_button_tap` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_button_confirm` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_button_cancel` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_button_disabled` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_menu_open` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_menu_close` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_card_flip` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_reward_pick` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_shop_purchase` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_shop_error` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_inventory_open` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_inventory_close` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_item_use` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_save_success` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_load_success` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_dialogue_blip` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_dialogue_skip` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_map_node_select` (audio) from 07 SFX - UI: audio/sfx/ui/
- `sfx_ui_map_path_unlock` (audio) from 07 SFX - UI: audio/sfx/ui/
- `font_pixel_header` (font) from 37 Font: fonts/
- `font_pixel_body` (font) from 37 Font: fonts/
- `font_pixel_number` (font) from 37 Font: fonts/
- `font_pixel_small` (font) from 37 Font: fonts/

#### Next Recommended Cleanup

- Replace P0 generated placeholders with final cheerful 32-bit pixel art first.
- Keep current runtime asset keys stable; replace file contents at the existing paths rather than renaming content IDs.
- Add final licensed audio/font files before enabling release audio/font checklist rows.


---

## 32-bit Pixelized Asset Pack Fit Guide

**Source file:** `blockmancer_32bit_pixelized_asset_pack_fit.md`

**Consolidation note:** Use for art direction and third-party pack acceptance rules.

### Blockmancer Dungeon — 32-bit Pixelized Asset Pack Fit Guide

#### Purpose

This document explains whether the recommended asset-pack strategy can satisfy the **Blockmancer 32-bit pixelized art direction** and what rules should be enforced before using third-party packs in production.

#### Short Answer

The recommended packs can support the **32-bit pixelized condition**, but **not fully out of the box**.

They mostly satisfy a **pixel-art / retro / 16-bit-to-32-bit inspired** direction, but they will not automatically look like one consistent Blockmancer visual style unless the team standardizes them through a shared art pipeline.

For Blockmancer, treat **“32-bit pixelized”** as an art-direction requirement, not a literal hardware bit-depth requirement.

It should mean:

- Chunky readable pixel art
- Bright fantasy colors
- Clean silhouettes
- Consistent pixel scale
- Integer upscaling only
- No blur or vector-like softness
- Playful arcade/festival readability

#### Blockmancer 32-bit Pixelized Style Definition

```text
Blockmancer 32-bit pixelized style:
Bright 32-bit inspired pixel art, 16x16/32x32 base scale, integer upscale only, nearest-neighbor rendering, chunky readable silhouettes, cheerful festival palette, no blurry/vector-looking assets, no mixed outline styles.
```

#### Pack Fit Summary

| Pack | 32-bit pixelized fit | Use for final? | Notes |
| --- | ---: | --- | --- |
| Kenney All-in-1 | Partial | Mostly placeholder/support | Includes many useful pixel assets, UI, icons, audio, and fonts, but also includes assets that may not match the final style. Use selectively. |
| Kenney Pixel UI Pack | Strong | Yes for UI | Good fit for pixel buttons, cards, panels, and HUD base. |
| Ninja Adventure | Strong | Good base | Strong pixel fantasy pack. Useful for characters, monsters, props, VFX, tiles, and placeholder content. Needs recolor/theme edits to become Blockmancer-specific. |
| Pixel Frog Pixel Adventure 1/2 | Strong | Good for monsters/placeholders | Good colorful pixel-art base for cute enemies and props. More platformer/adventure oriented than puzzle RPG, so adapt carefully. |
| Tiny Swords | Strong | Good for monsters/props | Cute fantasy style fits Blockmancer’s cheerful tone. Useful for enemy and environment inspiration. |
| LimeZu Modern UI | Strong | Yes for UI/inventory/shop | Useful for windows, buttons, inventory UI, shop UI, and small item props. |
| TomMusic / Pixel Combat / Kenney Audio | N/A visual | Yes for audio | Not related to visual pixel style, but useful for SFX/BGM placeholder and production audio. |

#### What Can Use Asset Packs Safely

These categories can mostly use asset packs with light editing:

| Asset category | Pack-safe? | Notes |
| --- | ---: | --- |
| UI buttons/cards/panels | Yes | Use one UI pack style only to avoid visual mismatch. |
| HUD meters and frames | Yes | Recolor and resize for portrait mobile readability. |
| Map nodes | Yes | Generic node icons can come from packs. Boss/final-boss nodes may need custom polish. |
| Generic item icons | Yes | Most consumables and tools can use pack icons with recolor/overlay. |
| Relic icons | Yes | Use pack items as bases, then add rarity frames or sparkle treatment. |
| Upgrade icons | Yes | Use simple readable symbols. Avoid over-detailed icons. |
| Weapon icons | Yes | Pack-safe, but hero signature weapons may need custom art. |
| Currency icons | Yes | Coins, tickets, stars, and tokens are easy to cover with packs. |
| Collectible icons | Yes | Manual pages, cakes, badges, and tokens can be adapted from packs. |
| Basic SFX | Yes | Button taps, hits, reward sounds, shop sounds, and simple UI cues can come from packs. |
| Placeholder BGM | Yes | Use pack music as placeholder, then replace key tracks later if needed. |
| Generic monsters | Mostly yes | Pack monsters are fine for early production and filler enemies. |
| Generic backgrounds | Mostly yes | Use tiles/props to compose backgrounds, but key stages still need art direction pass. |

#### What Should Stay Custom

These categories should be custom or heavily edited because they define the game identity and readability:

| Asset category | Why it should be custom |
| --- | --- |
| Main heroes | Milo, Pippa, Nixie, Bruk, Zuzu, and Lumi define the brand identity. |
| Bosses | Cupcake Slime King, Prototype No. 7, Gelato Golem, Sir Snore-a-Lot, High Score Hydra, and King Bloxley need unique silhouettes and stage personality. |
| Board blocks | The board is the core gameplay. Blocks must be instantly readable on mobile. |
| Special hazard blocks | Floaty Rune, Cloud Junk, Sticky, Royal, Ice, and Toolbox blocks need clear gameplay communication. |
| Spell icons | Players tap spells often. Icons must be unified, readable, and specific to mechanics. |
| Title art | First impression and store screenshots need custom polish. |
| Final stage/key art | Bloxley’s Block Palace and final boss presentation should not feel generic. |

#### Required Art Rules

Use these rules when importing, editing, or commissioning assets.

| Rule | Requirement |
| --- | --- |
| Pixel base size | Prefer 16x16, 32x32, 48x48, or 64x64 source assets. |
| Scaling | Use integer scale only: 2x, 3x, 4x. |
| Filtering | Use nearest-neighbor / pixelated rendering. No bilinear blur. |
| Palette | Recolor assets into one bright festival palette. |
| Outline | Use consistent 1px or 2px outline style across characters, blocks, and icons. |
| Lighting | Keep one light direction, usually top-left. |
| Shadow style | Use consistent soft pixel shadows. Avoid mixing realistic gradients with pixel sprites. |
| Icon size | Keep icons readable at small mobile HUD size. |
| Sprite silhouette | Important gameplay objects must be recognizable even in grayscale/silhouette. |
| Animation frame count | Prefer short readable loops over complex animations. |
| UI style | Do not mix multiple UI packs unless they are recolored and reframed into one style. |
| File naming | Keep current project asset keys and map pack files to those names. Do not rename runtime keys casually. |

#### Recommended Pixel Size Targets

| Asset type | Recommended source size | Notes |
| --- | ---: | --- |
| Board block | 32x32 | Most important readability asset. Keep symbol simple. |
| Board block glow/clear frame | 32x32 | Same silhouette as base block. |
| Item/relic/upgrade icon | 32x32 or 48x48 | Must read well in small UI. |
| Spell icon | 48x48 or 64x64 | Bigger because it is tappable and mechanic-critical. |
| Status/oopsie icon | 32x32 | Simple symbolic design. |
| Map node icon | 32x32 or 48x48 | Must work on portrait map. |
| Small enemy sprite | 32x32 to 64x64 | Use strong silhouette. |
| Boss sprite | 96x96 to 160x160 | Large enough for personality, still readable in battle panel. |
| Hero portrait | 96x96 to 160x160 | Used in hero select/dialogue. |
| Hero battle sprite | 64x64 to 96x96 | Needs readable pose in top battle panel. |
| Background tile/prop | 16x16 or 32x32 tiles | Compose into larger scenes. |
| Scene background | 320x180, 480x270, or portrait-safe layout | Leave room for UI overlay. |

#### Pack Usage Decision Table

| Asset group | Use pack directly | Use pack with edits | Custom recommended |
| --- | ---: | ---: | ---: |
| UI buttons | Yes | Yes | No |
| UI panels/cards | Yes | Yes | No |
| Generic icons | Yes | Yes | No |
| Items | Some | Yes | Only signature items |
| Relics/upgrades | Some | Yes | Only legendary/signature relics |
| Weapons | Some | Yes | Hero signature weapons |
| Currencies | Yes | Yes | No |
| Map nodes | Some | Yes | Boss/final-boss nodes |
| Board blocks | No | Yes | Yes |
| Special hazard blocks | No | Yes | Yes |
| Spell icons | No | Yes | Yes |
| Heroes | No | Yes for base only | Yes |
| Monsters | Some | Yes | Key monsters only |
| Bosses | No | Base/reference only | Yes |
| Stage backgrounds | Some | Yes | Key scenes/stages |
| BGM | Yes as placeholder | Yes | Main theme/final boss optional custom |
| SFX | Yes | Yes | Only signature sounds |

#### Practical Recommendation

Use asset packs as a **production base**, not as the final visual identity.

Recommended approach:

1. Pick one main pixel-art pack family as the base style.
2. Pick one UI pack only.
3. Recolor everything into the Blockmancer festival palette.
4. Replace the most important gameplay assets with custom art.
5. Keep pack assets for generic filler, placeholders, and low-priority backlog rows.

#### Best Final Pack Strategy

##### Base pack stack

| Pack type | Recommended use |
| --- | --- |
| Kenney All-in-1 | General placeholders, audio, icons, fonts, UI support. |
| Kenney Pixel UI or LimeZu Modern UI | Final UI base. Choose one primary UI style. |
| Ninja Adventure | Pixel fantasy characters, props, tiles, VFX, placeholder enemies. |
| Pixel Frog / Tiny Swords | Cute monster and environment base. |
| TomMusic / Pixel Combat / Kenney Audio | SFX and BGM placeholders. |

##### Avoid

- Mixing high-resolution painted assets with pixel sprites
- Mixing vector UI with pixel UI
- Scaling assets by non-integer values
- Using blurred sprites
- Using different outline thicknesses per pack
- Using dark/grim fantasy packs without recolor
- Using assets with horror/skull/gore-heavy tone

#### Final Answer

The recommended packs **can satisfy the 32-bit pixelized condition**, but only after a style pass.

They are acceptable for:

- UI
- Items
- Generic icons
- Generic monsters
- Map assets
- Placeholder backgrounds
- SFX/BGM

They are **not enough by themselves** for:

- Main heroes
- Bosses
- Board blocks
- Spell icons
- Title/key art

The correct production direction is:

```text
Use packs to reduce asset workload, then custom-polish the assets that define gameplay readability and Blockmancer identity.
```

#### Recommended Scope Reduction

The current checklist is very large. Instead of trying to produce all assets as custom work, use this target:

| Phase | Asset count target | Focus |
| --- | ---: | --- |
| Prototype polish | 120–180 | One full stage, core UI, board blocks, one hero, key monsters, key SFX. |
| Vertical slice | 220–320 | Two stages, two bosses, map, reward/shop/event screens. |
| Release candidate | 400–550 | Six stages, all heroes/bosses, enough icons/audio/VFX. |
| Backlog only | 550+ | Extra animation variants, alternates, premium polish. |

#### Designer Checklist Before Accepting a Pack Asset

Use this checklist before marking a third-party asset as usable:

```text
[ ] Asset is pixel art, not vector or painted style.
[ ] Asset still looks sharp after integer scaling.
[ ] Asset uses nearest-neighbor rendering with no blur.
[ ] Asset matches Blockmancer’s cheerful festival tone.
[ ] Asset is readable on a portrait phone screen.
[ ] Asset has consistent outline thickness.
[ ] Asset can be recolored to the shared palette.
[ ] Asset does not introduce dark curse, horror, gore, or skull-heavy tone.
[ ] Asset filename can be mapped safely to the current project key.
[ ] Asset license allows commercial game usage.
```

<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_START -->
## 2026-06-02 Feature Update — Fever Showtime Asset and Animation Standard

### Purpose

Fever Showtime requires readable HUD, board-overlay, and VFX feedback while preserving fallback safety and portrait-mobile clarity.

No new top-level asset folders are introduced.

### Fever UI Asset Keys

Recommended Fever UI asset keys:

| Asset Key | Folder | Purpose | Source / Render Notes |
| --- | --- | --- | --- |
| `ui_meter_fever_showtime` | `public/assets/ui/meters/` | Fever meter | meter art, text rendered by UI |
| `ui_badge_fever_ready` | `public/assets/ui/hud/` | Ready indicator | compact HUD badge |
| `ui_badge_showtime_active` | `public/assets/ui/hud/` | Active Showtime badge | compact HUD badge |
| `ui_chip_fever_locks` | `public/assets/ui/hud/` | Locks remaining chip | value rendered by UI text |
| `ui_chip_charged_lines` | `public/assets/ui/hud/` | Charged Lines count | value rendered by UI text |
| `ui_chip_fever_heat` | `public/assets/ui/hud/` | Heat level chip | label rendered by UI text |
| `ui_button_fever_activate` | `public/assets/ui/buttons/` | Activate Fever control | use existing button fallback |
| `ui_button_fever_release` | `public/assets/ui/buttons/` | Manual release control | use existing button fallback |
| `ui_badge_boss_drama_guard` | `public/assets/ui/hud/` | Boss cap feedback | compact boss feedback badge |
| `ui_chip_showtime_overflow` | `public/assets/ui/hud/` | Overflow summary | text rendered by UI |

### Fever Board Feedback Asset Keys

| Asset Key | Folder | Exact Frames | Purpose |
| --- | --- | ---: | --- |
| `ui_charged_line_glow` | `public/assets/ui/animations/` | 4 | Row/cell overlay for Charged Lines |
| `ui_charged_line_release_flash` | `public/assets/ui/animations/` | 6 | Release flash before Cascade Gravity |
| `ui_soft_junk_marker` | `public/assets/ui/animations/` | 4 | Soft Junk board marker |
| `ui_fever_heat_pulse` | `public/assets/ui/animations/` | 5 | Heat warning pulse |
| `ui_boss_drama_guard_pulse` | `public/assets/ui/animations/` | 5 | Boss cap feedback pulse |

Frame naming uses the exact-frame contract:

```text
{asset_id}__play__f00.png
{asset_id}__play__f01.png
```

### Fever VFX Asset Keys

| VFX ID | Folder | Exact Frames | Purpose |
| --- | --- | ---: | --- |
| `vfx_fever_showtime_start` | `public/assets/effects/vfx_fever_showtime_start/` | 8 | Activate Fever |
| `vfx_fever_line_charged` | `public/assets/effects/vfx_fever_line_charged/` | 5 | Completed row becomes Charged Line |
| `vfx_fever_release_burst` | `public/assets/effects/vfx_fever_release_burst/` | 8 | Manual/auto release |
| `vfx_showtime_overflow_sparkle` | `public/assets/effects/vfx_showtime_overflow_sparkle/` | 6 | Overflow utility conversion |
| `vfx_soft_junk_splash` | `public/assets/effects/vfx_soft_junk_splash/` | 5 | Soft Junk placement |
| `vfx_fever_heat_rise` | `public/assets/effects/vfx_fever_heat_rise/` | 5 | Heat increase |
| `vfx_boss_drama_guard` | `public/assets/effects/vfx_boss_drama_guard/` | 6 | Boss cap/phase guard |
| `vfx_star_encore_spawn` | `public/assets/effects/vfx_star_encore_spawn/` | 6 | Star Encore upgrade trigger |
| `vfx_safety_confetti_clear` | `public/assets/effects/vfx_safety_confetti_clear/` | 6 | Safety Confetti hazard clear |

### Fever Upgrade Icons

Fever upgrade icons use:

```text
public/assets/icons/upgrades/
```

Recommended icon keys:

```text
ico_upg_fever_gain
ico_upg_fever_duration
ico_upg_fever_capacity
ico_upg_fever_manual_release
ico_upg_fever_safety_release
ico_upg_fever_overflow
ico_upg_fever_star_encore
```

Rules:

- Source size: `627x627` transparent PNG.
- Runtime card render: `48-64px`.
- Compact summary render: `24-32px`.
- Missing icons must fall back to existing upgrade placeholder.

### Board Block Metadata / Visual Rules

Charged Lines and Soft Junk may use board cell metadata, but they do not require new board block source sizes.

Preferred metadata:

```ts
cell.feverCharged = true;
cell.softJunk = true;
cell.feverGenerated = true;
```

Rules:

- Charged Line marker must not change block identity unless the runtime explicitly supports it.
- Soft Junk must be visually distinct from normal junk if possible.
- Overlay/VFX must not make board cells unreadable.
- Missing final Fever VFX must fall back to event log text and simple UI pulse.
- No Fever overlay may break Cascade Gravity or collision logic.

### Animation Validation

`validate:animations` should understand these exact-frame definitions when implemented. Missing final PNGs remain warning-only unless release-lock mode is enabled.

### Asset Production Priority

Priority 1 for Fever presentation:

```text
ui_meter_fever_showtime
ui_badge_fever_ready
ui_badge_showtime_active
ui_charged_line_glow
ui_soft_junk_marker
vfx_fever_showtime_start
vfx_fever_line_charged
vfx_fever_release_burst
vfx_boss_drama_guard
```

Priority 2:

```text
Showtime Overflow VFX
Fever Heat VFX
Star Encore VFX
Safety Confetti VFX
upgrade icons
```
<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_END -->
