# Blockmancer Dungeon Animation Asset Requirements

This is the exact-frame animation standard for game-ready PNG frame sequences. Do not create GIF files. Every entry below has an exact frame count; frame ranges are not allowed.

Runtime keys are defined in `src/game/data/animation-standards.json` and expanded by `src/game/data/animations.ts`.

## Naming Rules

Frame sequences use:

```text
asset_id__animation_name__f00.png
asset_id__animation_name__f01.png
asset_id__animation_name__f02.png
```

Static assets use their static key:

```text
spr_block_red_rune.png
ico_block_red_rune.png
```

## Folder Structure

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

public/assets/sprites/bosses/{boss_id}/idle/
public/assets/sprites/bosses/{boss_id}/attack/
public/assets/sprites/bosses/{boss_id}/hit/
public/assets/sprites/bosses/{boss_id}/phase_change/
public/assets/sprites/bosses/{boss_id}/special_attack/
public/assets/sprites/bosses/{boss_id}/defeat/

public/assets/effects/{vfx_id}/
public/assets/icons/items/
public/assets/icons/spells/
public/assets/icons/relics/
public/assets/icons/upgrades/
public/assets/ui/animations/
```

## Board Block Animation Standard

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

## Core VFX Animation Standard

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

## Spell VFX Animation Standard

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

## Item Use VFX Animation Standard

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

## Hero Animation Standard

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

## Monster Animation Standard

Applies to regular monsters.

| Asset | Exact frames |
| --- | ---: |
| idle | 4 |
| attack | 6 |
| hit | 3 |
| defeat | 6 |
| icon | 1 |

Total per monster: 20 PNG files.

## Boss Animation Standard

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

## Hazard UI Animation Standard

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

## UI Animation Standard

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

