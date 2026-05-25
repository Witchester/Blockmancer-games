# Blockmancer UI Asset Placeholder Keys

## Purpose
List placeholder and target asset keys used by the UI layout specs so final PNGs can drop into canonical folders without changing screen rectangles.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
Global:
- ui_panel_default
- ui_button_primary
- ui_button_secondary
- ui_button_disabled
- ui_modal_backdrop
- placeholder_icon
- placeholder_portrait
- placeholder_sprite
- placeholder_background

Battle:
- bg_stage_sprinkle_sewers_battle_far
- bg_stage_sprinkle_sewers_battle_mid
- bg_stage_sprinkle_sewers_battle_near
- bg_stage_sprinkle_sewers_puzzle_far
- bg_stage_sprinkle_sewers_puzzle_mid
- bg_stage_sprinkle_sewers_puzzle_near
- ui_panel_battle
- ui_panel_board
- ui_panel_controls
- ui_event_log_strip
- ui_hold_panel
- ui_next_queue_panel
- ui_stat_card
- ui_inventory_compact
- ui_meter_hp
- ui_meter_mp
- hero_milo_blockmancer__idle__f00
- mon_cupcake_slime__idle__f00
- ico_mon_cupcake_slime
- ui_monster_stack_chip
- ui_monster_stack_mystery_chip
- vfx_enemy_hit
- vfx_player_hit

Node Result:
- ui_panel_node_result
- ui_node_clear_banner
- ui_xp_gained_counter
- ui_xp_remaining_chip
- ui_xp_breakdown_row
- ui_button_node_result_continue
- ui_level_ready_badge
- ui_meter_xp
- ui_node_result_panel_intro
- ui_node_clear_banner_pop
- ui_xp_meter_count_up
- ui_xp_breakdown_row_pop
- ui_level_ready_badge_pulse
- vfx_node_clear_sparkle

Level-Up:
- ui_panel_level_up
- ui_level_up_card_common
- ui_level_up_card_rare
- ui_level_up_card_hero
- ui_meter_xp
- ui_level_badge
- ico_lvl_clear_line_damage
- ico_lvl_max_hp_percent
- ico_lvl_mana_gain
- ico_lvl_spell_damage
- ico_lvl_cascade_damage
- ico_lvl_starting_shield
- ico_lvl_entry_grace
- ui_button_level_reroll
- ui_button_level_confirm
- ui_level_up_panel_intro
- ui_level_up_card_flip
- ui_level_up_card_select
- ui_xp_meter_fill
- vfx_level_up_sparkle

Route Dialogue:
- bg_route_milo_sprinkle_sewers
- ui_panel_dialogue
- ui_dialogue_nameplate
- ui_choice_card_practical
- ui_choice_card_true
- ui_choice_card_risky
- portrait_hero_milo_blockmancer
- portrait_npc_bloop
- ico_route_true_flag
- ui_button_skip_dialogue

Map:
- bg_map_sprinkle_sewers
- ico_node_normal
- ico_node_elite
- ico_node_event
- ico_node_shop
- ico_node_rest
- ico_node_treasure
- ico_node_boss
- ico_node_current
- ico_node_completed
- ui_panel_node_preview
- ui_map_path_unlocked
- ui_map_path_locked

Boss Rule:
- bg_boss_cupcake_slime_king_arena
- ui_panel_boss_rule
- ico_boss_cupcake_slime_king
- ico_boss_rule_boss_cupcake_slime_king
- ui_button_start_boss

Settings:
- bg_scene_settings
- ui_panel_settings
- ui_tab_audio
- ui_tab_accessibility
- ui_tab_controls
- ui_slider_default
- ui_toggle_on
- ui_toggle_off
- ui_button_apply
- ui_button_back

## Asset key/fallback rules
Each layout JSON maps these keys to canonicalFolder and fallbackAssetKey. Missing production art must fall back to placeholder_icon, placeholder_portrait, placeholder_sprite, placeholder_background, ui_panel_default, or ui_button_default as appropriate.

## Pixel-perfect or QA guidance
Use the expectedSourceSize and runtimeRenderSize in each layout JSON. Reject wrong-size PNGs before import.

## Status / known gaps
This registry includes required placeholder keys even where final art is not discoverable in public/assets yet. Runtime fallback remains required.
