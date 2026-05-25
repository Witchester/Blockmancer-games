# Blockmancer UI Asset Key Graph

## Purpose
Map asset keys to components, screens, canonical folders, source sizes, render sizes, and fallbacks.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
| Asset key | Used by component | Used by screen | Canonical folder | Expected source size | Runtime render size | Fallback key | Missing/available status | Asset-drop-in readiness |
|---|---|---|---|---:|---:|---|---|---|
| bg_scene_splash | splash_background | screen_splash | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | splash_logo_panel | screen_splash | public/assets/ui/panels/ | 760x220 | 760x220 | ui_panel_default | Not exhaustively verified on disk | Ready |
| placeholder_icon | blockomatic_loading_icon | screen_splash | public/assets/ui/placeholders/ | 627x627 | 96x96 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_meter_xp | loading_meter | screen_splash | public/assets/ui/meters/ | 600x48 | 600x48 | ui_meter_fallback | Not exhaustively verified on disk | Ready |
| ui_button_primary | tap_to_start_button | screen_splash | public/assets/ui/buttons/ | 360x96 | 360x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_main_menu | main_menu_background | screen_main_menu | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | title_panel | screen_main_menu | public/assets/ui/panels/ | 840x260 | 840x260 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_button_primary | new_run_button | screen_main_menu | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_secondary | continue_button | screen_main_menu | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_secondary | collection_button | screen_main_menu | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | settings_button | screen_main_menu | public/assets/ui/buttons/ | 128x128 | 128x128 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_hero_select | hero_select_background | screen_hero_select | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | hero_grid_panel | screen_hero_select | public/assets/ui/panels/ | 952x1180 | 952x1180 | ui_panel_default | Not exhaustively verified on disk | Ready |
| portrait_hero_milo_blockmancer | hero_milo_card_portrait | screen_hero_select | public/assets/portraits/heroes/ | 627x627 | 180x180 | placeholder_portrait | Not exhaustively verified on disk | Ready |
| portrait_hero_pippa_pyromancer | hero_pippa_card_portrait | screen_hero_select | public/assets/portraits/heroes/ | 627x627 | 180x180 | placeholder_portrait | Not exhaustively verified on disk | Ready |
| portrait_hero_lumi_star_witch | hero_lumi_card_portrait | screen_hero_select | public/assets/portraits/heroes/ | 627x627 | 180x180 | placeholder_portrait | Not exhaustively verified on disk | Ready |
| ui_button_primary | select_hero_button | screen_hero_select | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_map_sprinkle_sewers | map_background | screen_map | public/assets/stages/stage_sprinkle_sewers/map/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | map_header_panel | screen_map | public/assets/ui/panels/ | 984x132 | 984x132 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_node_current | node_current_slot | screen_map | public/assets/icons/map-nodes/ | 48x48 | 96x96 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_node_shop | node_shop_slot | screen_map | public/assets/icons/map-nodes/ | 48x48 | 96x96 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_node_boss | node_boss_slot | screen_map | public/assets/icons/map-nodes/ | 48x48 | 112x112 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_panel_node_preview | node_preview_panel | screen_map | public/assets/ui/panels/ | 888x240 | 888x240 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_button_secondary | map_back_button | screen_map | public/assets/ui/buttons/ | 240x88 | 240x88 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_stage_sprinkle_sewers_intro | stage_intro_background | screen_stage_intro | public/assets/stages/stage_sprinkle_sewers/route-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | stage_title_panel | screen_stage_intro | public/assets/ui/panels/ | 888x220 | 888x220 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_panel_battle | stage_goal_panel | screen_stage_intro | public/assets/ui/panels/ | 888x480 | 888x480 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_stage_goal_sprinkles | stage_goal_icon | screen_stage_intro | public/assets/icons/stage-goals/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_primary | start_stage_button | screen_stage_intro | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_stage_sprinkle_sewers_battle_mid | battle_background_mid | screen_battle | public/assets/stages/stage_sprinkle_sewers/battle/ | 1080x480 | 1080x480 | placeholder_battle_background | Not exhaustively verified on disk | Ready |
| ui_panel_battle | battle_header_panel | screen_battle | public/assets/ui/panels/ | 984x72 | 984x72 | ui_panel_default | Not exhaustively verified on disk | Ready |
| hero_milo_blockmancer__idle__f00 | hero_sprite_slot | screen_battle | public/assets/sprites/heroes/hero_milo_blockmancer/idle/ | 627x627 | 220x220 | placeholder_sprite | Not exhaustively verified on disk | Ready |
| mon_cupcake_slime__idle__f00 | enemy_sprite_slot | screen_battle | public/assets/sprites/monsters/mon_cupcake_slime/idle/ | 627x627 | 240x240 | placeholder_sprite | Not exhaustively verified on disk | Ready |
| vfx_enemy_hit | vfx_lane_center | screen_battle | public/assets/effects/ | 627x627 | 220x220 | vfx_player_hit | Not exhaustively verified on disk | Ready |
| ui_monster_stack_chip | monster_stack_chip | screen_battle | public/assets/ui/hud/ | 627x627 | 88x88 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_event_log_strip | event_log_strip | screen_battle | public/assets/ui/panels/ | 984x104 | 984x104 | ui_panel_default | Not exhaustively verified on disk | Ready |
| bg_stage_sprinkle_sewers_puzzle_mid | puzzle_background_mid | screen_battle | public/assets/stages/stage_sprinkle_sewers/puzzle/ | 1080x1056 | 1080x1056 | placeholder_puzzle_background | Not exhaustively verified on disk | Ready |
| ui_hold_panel | hold_panel | screen_battle | public/assets/ui/panels/ | 220x220 | 220x220 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_next_queue_panel | next_queue_panel | screen_battle | public/assets/ui/panels/ | 220x360 | 220x360 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_panel_board | board_panel | screen_battle | public/assets/ui/panels/ | 336x576 | 336x576 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_board_grid_10x20 | board_grid_slot | screen_battle | public/assets/ui/board/ | 240x480 | 240x480 | ui_board_grid_default | Not exhaustively verified on disk | Ready |
| block_jelly__idle__f00 | board_block_sprite_slot | screen_battle | public/assets/sprites/board-blocks/block_jelly/idle/ | 24x24 | 24x24 | placeholder_board_block | Not exhaustively verified on disk | Ready |
| ui_stat_card | right_stat_cards | screen_battle | public/assets/ui/panels/ | 240x520 | 240x520 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_inventory_compact | inventory_compact_button | screen_battle | public/assets/ui/buttons/ | 160x96 | 160x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_panel_controls | controls_background_panel | screen_battle | public/assets/ui/mobile-controls/ | 1080x384 | 1080x384 | placeholder_controls_background | Not exhaustively verified on disk | Ready |
| ui_button_icon | move_left_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | move_right_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | soft_drop_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | rotate_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | hold_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | hard_drop_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_spell_slot | spell_button_1 | screen_battle | public/assets/ui/buttons/ | 156x96 | 156x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_spell_slot | spell_button_2 | screen_battle | public/assets/ui/buttons/ | 156x96 | 156x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_spell_slot | skill_button_1 | screen_battle | public/assets/ui/buttons/ | 156x96 | 156x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_spell_slot | skill_button_2 | screen_battle | public/assets/ui/buttons/ | 156x96 | 156x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_icon | settings_battle_button | screen_battle | public/assets/ui/buttons/ | 96x96 | 96x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_boss_cupcake_slime_king_arena | boss_arena_background | screen_boss_rule_card | public/assets/stages/stage_sprinkle_sewers/boss-arena/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_boss_rule | boss_rule_panel | screen_boss_rule_card | public/assets/ui/panels/ | 888x980 | 888x980 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_boss_cupcake_slime_king | boss_icon | screen_boss_rule_card | public/assets/sprites/bosses/boss_cupcake_slime_king/portrait_icon/ | 627x627 | 180x180 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_boss_rule_boss_cupcake_slime_king | boss_rule_icon | screen_boss_rule_card | public/assets/icons/boss-rules/ | 627x627 | 96x96 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_start_boss | start_boss_button | screen_boss_rule_card | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_route_milo_sprinkle_sewers | route_background | screen_route_dialogue | public/assets/stages/stage_sprinkle_sewers/route-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| portrait_hero_milo_blockmancer | speaker_portrait | screen_route_dialogue | public/assets/portraits/heroes/ | 627x627 | 220x220 | placeholder_portrait | Not exhaustively verified on disk | Ready |
| ui_panel_dialogue | dialogue_panel | screen_route_dialogue | public/assets/ui/panels/ | 920x360 | 920x360 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_dialogue_nameplate | nameplate_panel | screen_route_dialogue | public/assets/ui/panels/ | 360x72 | 360x72 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_choice_card_practical | choice_practical | screen_route_dialogue | public/assets/ui/buttons/ | 860x104 | 860x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_choice_card_true | choice_true | screen_route_dialogue | public/assets/ui/buttons/ | 860x104 | 860x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_choice_card_risky | choice_risky | screen_route_dialogue | public/assets/ui/buttons/ | 860x104 | 860x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_event_room | event_room_background | screen_event_room | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| portrait_npc_bloop | event_npc_portrait | screen_event_room | public/assets/portraits/npcs/ | 627x627 | 260x260 | placeholder_portrait | Not exhaustively verified on disk | Ready |
| ui_panel_dialogue | event_text_panel | screen_event_room | public/assets/ui/panels/ | 888x360 | 888x360 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_choice_card_practical | event_choice_one | screen_event_room | public/assets/ui/buttons/ | 840x104 | 840x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_choice_card_true | event_choice_two | screen_event_room | public/assets/ui/buttons/ | 840x104 | 840x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_choice_card_risky | event_choice_three | screen_event_room | public/assets/ui/buttons/ | 840x104 | 840x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_shop | shop_background | screen_shop | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_shop | shop_header_panel | screen_shop | public/assets/ui/panels/ | 952x140 | 952x140 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_panel_default | shop_goods_panel | screen_shop | public/assets/ui/panels/ | 952x1050 | 952x1050 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_item_mini_cupcake | shop_item_icon_one | screen_shop | public/assets/icons/items/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_relic_slime_core | shop_item_icon_two | screen_shop | public/assets/icons/relics/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_spell_fireball | shop_item_icon_three | screen_shop | public/assets/icons/spells/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_back | shop_back_button | screen_shop | public/assets/ui/buttons/ | 280x96 | 280x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_modal_backdrop | inventory_modal_backdrop | screen_inventory_modal | public/assets/ui/panels/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | inventory_modal_panel | screen_inventory_modal | public/assets/ui/panels/ | 920x1120 | 920x1120 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_item_mana_lemonade | inventory_item_slot_one | screen_inventory_modal | public/assets/icons/items/ | 627x627 | 112x112 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_item_safety_net | inventory_item_slot_two | screen_inventory_modal | public/assets/icons/items/ | 627x627 | 112x112 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_item_alarm_cookie | inventory_item_slot_three | screen_inventory_modal | public/assets/icons/items/ | 627x627 | 112x112 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_secondary | inventory_close_button | screen_inventory_modal | public/assets/ui/buttons/ | 320x96 | 320x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_node_result | node_result_background | screen_node_result | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_node_result | node_result_panel | screen_node_result | public/assets/ui/panels/ | 936x1360 | 936x1360 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_node_clear_banner | node_clear_banner | screen_node_result | public/assets/ui/panels/ | 760x140 | 760x140 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_meter_xp | xp_meter_before_after | screen_node_result | public/assets/ui/meters/ | 680x64 | 680x64 | ui_meter_fallback | Not exhaustively verified on disk | Ready |
| ui_xp_breakdown_row | xp_breakdown_rows | screen_node_result | public/assets/ui/panels/ | 720x320 | 720x320 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_xp_gained_counter | xp_gained_counter_icon | screen_node_result | public/assets/ui/hud/ | 627x627 | 96x96 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_level_ready_badge | level_ready_badge | screen_node_result | public/assets/ui/hud/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_node_result_continue | node_result_continue_button | screen_node_result | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_level_up | level_up_background | screen_level_up | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_level_up | level_up_panel | screen_level_up | public/assets/ui/panels/ | 968x1540 | 968x1540 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_meter_xp | level_up_xp_meter | screen_level_up | public/assets/ui/meters/ | 640x56 | 640x56 | ui_meter_fallback | Not exhaustively verified on disk | Ready |
| ui_level_up_card_common | level_card_common | screen_level_up | public/assets/ui/panels/ | 280x720 | 280x720 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_level_up_card_rare | level_card_rare | screen_level_up | public/assets/ui/panels/ | 280x720 | 280x720 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_level_up_card_hero | level_card_hero | screen_level_up | public/assets/ui/panels/ | 280x720 | 280x720 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_lvl_clear_line_damage | level_card_icon_one | screen_level_up | public/assets/icons/upgrades/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_lvl_max_hp_percent | level_card_icon_two | screen_level_up | public/assets/icons/upgrades/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_lvl_mana_gain | level_card_icon_three | screen_level_up | public/assets/icons/upgrades/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_level_reroll | level_reroll_button | screen_level_up | public/assets/ui/buttons/ | 320x96 | 320x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_level_confirm | level_confirm_button | screen_level_up | public/assets/ui/buttons/ | 320x96 | 320x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_reward | reward_background | screen_reward | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | reward_title_panel | screen_reward | public/assets/ui/panels/ | 840x160 | 840x160 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_reward_card_common | reward_card_common | screen_reward | public/assets/ui/panels/ | 280x680 | 280x680 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_reward_card_rare | reward_card_rare | screen_reward | public/assets/ui/panels/ | 280x680 | 280x680 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_reward_card_rare | reward_card_special | screen_reward | public/assets/ui/panels/ | 280x680 | 280x680 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ico_item_mini_cupcake | reward_icon_one | screen_reward | public/assets/icons/items/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_relic_star_sticker | reward_icon_two | screen_reward | public/assets/icons/relics/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ico_spell_star_spark | reward_icon_three | screen_reward | public/assets/icons/spells/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_secondary | skip_reward_button | screen_reward | public/assets/ui/buttons/ | 360x96 | 360x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_victory_ending | victory_background | screen_victory_ending | public/assets/story/endings/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | victory_title_panel | screen_victory_ending | public/assets/ui/panels/ | 888x180 | 888x180 | ui_panel_default | Not exhaustively verified on disk | Ready |
| portrait_hero_milo_blockmancer | victory_hero_portrait | screen_victory_ending | public/assets/portraits/heroes/ | 627x627 | 260x260 | placeholder_portrait | Not exhaustively verified on disk | Ready |
| ui_panel_dialogue | ending_text_panel | screen_victory_ending | public/assets/ui/panels/ | 888x520 | 888x520 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_button_primary | victory_main_menu_button | screen_victory_ending | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_defeat_summary | defeat_background | screen_defeat_summary | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_default | defeat_summary_panel | screen_defeat_summary | public/assets/ui/panels/ | 888x1000 | 888x1000 | ui_panel_default | Not exhaustively verified on disk | Ready |
| placeholder_icon | defeat_icon | screen_defeat_summary | public/assets/ui/placeholders/ | 627x627 | 128x128 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_meter_xp | defeat_progress_meter | screen_defeat_summary | public/assets/ui/meters/ | 640x56 | 640x56 | ui_meter_fallback | Not exhaustively verified on disk | Ready |
| ui_button_primary | try_again_button | screen_defeat_summary | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_secondary | defeat_menu_button | screen_defeat_summary | public/assets/ui/buttons/ | 420x104 | 420x104 | ui_button_default | Not exhaustively verified on disk | Ready |
| bg_scene_settings | settings_background | screen_settings | public/assets/stages/global-scenes/ | 1080x1920 | 1080x1920 | placeholder_background | Not exhaustively verified on disk | Ready |
| ui_panel_settings | settings_panel | screen_settings | public/assets/ui/panels/ | 952x1500 | 952x1500 | ui_panel_default | Not exhaustively verified on disk | Ready |
| ui_tab_audio | tab_audio | screen_settings | public/assets/ui/buttons/ | 220x88 | 220x88 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_tab_accessibility | tab_accessibility | screen_settings | public/assets/ui/buttons/ | 260x88 | 260x88 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_tab_controls | tab_controls | screen_settings | public/assets/ui/buttons/ | 220x88 | 220x88 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_slider_default | volume_slider | screen_settings | public/assets/ui/meters/ | 640x64 | 640x64 | ui_meter_fallback | Not exhaustively verified on disk | Ready |
| ui_toggle_on | toggle_reduced_flash | screen_settings | public/assets/ui/buttons/ | 627x627 | 96x96 | placeholder_icon | Not exhaustively verified on disk | Ready |
| ui_button_apply | settings_apply_button | screen_settings | public/assets/ui/buttons/ | 360x96 | 360x96 | ui_button_default | Not exhaustively verified on disk | Ready |
| ui_button_back | settings_back_button | screen_settings | public/assets/ui/buttons/ | 360x96 | 360x96 | ui_button_default | Not exhaustively verified on disk | Ready |

## Asset key/fallback rules when applicable
If a key is missing on disk, runtime must use fallbackAssetKey. Final production import should preserve the same key and folder.

## Pixel-perfect or QA guidance when applicable
Validate source size before import and check nearest/pixelated runtime rendering.

## Status / known gaps
Disk availability is not exhaustively verified here; this graph is a contract map and should be paired with asset audit tooling.

## UI-9 Festival Level-Up Asset Coverage

Runtime manifest coverage now includes `bg_scene_level_up`, `ui_panel_level_up`, `ui_level_up_card_common`, `ui_level_up_card_rare`, `ui_level_up_card_hero`, `ui_meter_xp`, `ui_level_badge`, `ui_button_level_reroll`, `ui_button_level_confirm`, `ui_level_up_panel_intro`, `ui_level_up_card_flip`, `ui_level_up_card_select`, `ui_xp_meter_fill`, `vfx_level_up_sparkle`, and `placeholder_icon`. Each new key has a fallback path to an existing UI, background, icon, meter, or VFX placeholder so missing final assets remain nonfatal.

## UI-3 Asset Resolver Coverage

- Primary `assetKey` handling: implemented through `UiAssetSlotResolver.resolveAssetSlot` and `resolveTextureKey`, using runtime texture keys instead of raw `public/assets` paths.
- `fallbackAssetKey` handling: implemented. Missing primary textures use the component fallback key when that fallback texture is loaded.
- Placeholder handling: implemented through `UiPlaceholderKeys`. Missing primary and fallback textures use generated safe placeholders such as `asset_missing`, `asset_missing_icon`, `asset_missing_block`, `asset_missing_background`, `missing_ui`, `missing_portrait`, or `missing_vfx` when available.
- Expected source size validation: implemented in resolver/report helpers and `validate:ui-layouts` for inferable categories such as battle, puzzle, controls, full backgrounds, board blocks, board icons, sprites, icons, VFX, and 2x2 pose sheets.
- Runtime render size validation: retained through layout validation and drop-in readiness reporting.
- Unresolved asset behavior: nonfatal. Resolver returns `unresolved` with structured issues if no primary, fallback, or safe placeholder texture is available.
- Asset-drop-in readiness status: implemented with `ready`, `partial`, `risky`, and `missing` summaries in `UiAssetDropInReport`.
