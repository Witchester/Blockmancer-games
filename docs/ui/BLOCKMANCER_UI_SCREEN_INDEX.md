# Blockmancer UI Screen Index

## Purpose
Index every major UI mockup screen and connect it to layout JSON specs, runtime scene evidence, asset placeholders, and pixel-perfect acceptance criteria.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
| Screen ID | Screen | Entry point | Exit point | Layout spec | Existing scene | Layout zones | Asset-drop-in status |
|---|---|---|---|---|---|---|---|
| screen_splash | Splash / Loading | App launch | screen_main_menu | docs/ui/layouts/screen_splash.layout.json | BootScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_main_menu | Main Menu | screen_splash, screen_defeat_summary, screen_victory_ending | screen_hero_select, screen_map, screen_settings, CollectionScene | docs/ui/layouts/screen_main_menu.layout.json | MainMenuScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_hero_select | Hero Select | screen_main_menu | screen_map, screen_main_menu | docs/ui/layouts/screen_hero_select.layout.json | HeroSelectScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_map | Roguelike Map | screen_hero_select, screen_reward, screen_shop, screen_event_room | screen_stage_intro, screen_battle, screen_event_room, screen_shop, RestScene, TreasureScene, screen_boss_rule_card, screen_settings | docs/ui/layouts/screen_map.layout.json | MapScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_stage_intro | Stage Intro / Stage Goal | screen_map | screen_battle, screen_map | docs/ui/layouts/screen_stage_intro.layout.json | StoryScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_battle | Battle Screen | screen_map, screen_boss_rule_card, screen_stage_intro | screen_node_result, screen_defeat_summary, screen_inventory_modal, screen_settings | docs/ui/layouts/screen_battle.layout.json | BattleScene.ts | Exact 25/55/20 battle sections | Ready |
| screen_boss_rule_card | Boss Rule Card / Boss Intro | screen_map | screen_battle | docs/ui/layouts/screen_boss_rule_card.layout.json | BattleScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_route_dialogue | Route Dialogue / Story Choice | screen_map, screen_stage_intro, screen_reward | screen_map, screen_battle, screen_reward | docs/ui/layouts/screen_route_dialogue.layout.json | RouteDialogueScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_event_room | Event Room | screen_map | screen_map, screen_battle, screen_reward | docs/ui/layouts/screen_event_room.layout.json | EventScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_shop | Shop | screen_map | screen_map, screen_inventory_modal | docs/ui/layouts/screen_shop.layout.json | ShopScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_inventory_modal | Inventory / Bag Modal | screen_battle, screen_shop, screen_map | previous_screen | docs/ui/layouts/screen_inventory_modal.layout.json | BattleScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_node_result | Node Result Screen | screen_battle | screen_level_up, screen_reward, screen_map | docs/ui/layouts/screen_node_result.layout.json | NodeResultScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_level_up | Festival Level-Up | screen_node_result | screen_reward | docs/ui/layouts/screen_level_up.layout.json | LevelUpRewardScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_reward | Reward Screen | screen_node_result, screen_level_up, screen_battle | screen_map, screen_route_dialogue | docs/ui/layouts/screen_reward.layout.json | RewardScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_victory_ending | Victory / Ending | screen_reward, screen_battle | screen_main_menu, CollectionScene | docs/ui/layouts/screen_victory_ending.layout.json | VictoryScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_defeat_summary | Defeat / Run Summary | screen_battle | screen_main_menu, screen_hero_select | docs/ui/layouts/screen_defeat_summary.layout.json | GameOverScene.ts | Full portrait scene with 32px safe area | Ready |
| screen_settings | Settings / Accessibility | screen_main_menu, screen_battle | previous_screen | docs/ui/layouts/screen_settings.layout.json | SettingsScene.ts | Full portrait scene with 32px safe area | Ready |

## Screens A-Q
### Splash / Loading
- Purpose: Load fonts, generated placeholders, manifests, and show a cheerful festival loading frame.
- Entry point: App launch
- Exit point: screen_main_menu
- Layout zones: full portrait frame plus 32px safe content area
- Required components: splash_logo_panel, blockomatic_loading_icon, loading_meter, tap_to_start_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, placeholder_icon, ui_meter_xp, ui_button_primary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene BootScene.ts; layout spec docs/ui/layouts/screen_splash.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Main Menu
- Purpose: Primary entry to new run, continue, collection, settings, and help.
- Entry point: screen_splash, screen_defeat_summary, screen_victory_ending
- Exit point: screen_hero_select, screen_map, screen_settings, CollectionScene
- Layout zones: full portrait frame plus 32px safe content area
- Required components: title_panel, new_run_button, continue_button, collection_button, settings_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, ui_button_primary, ui_button_secondary, ui_button_secondary, ui_button_icon
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene MainMenuScene.ts; layout spec docs/ui/layouts/screen_main_menu.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Hero Select
- Purpose: Choose a hero while preserving portrait-readable cards and fallback portraits.
- Entry point: screen_main_menu
- Exit point: screen_map, screen_main_menu
- Layout zones: full portrait frame plus 32px safe content area
- Required components: hero_grid_panel, hero_milo_card_portrait, hero_pippa_card_portrait, hero_lumi_card_portrait, select_hero_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, portrait_hero_milo_blockmancer, portrait_hero_pippa_pyromancer, portrait_hero_lumi_star_witch, ui_button_primary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene HeroSelectScene.ts; layout spec docs/ui/layouts/screen_hero_select.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Roguelike Map
- Purpose: Show current stage path, node state, route choices, and next destination.
- Entry point: screen_hero_select, screen_reward, screen_shop, screen_event_room
- Exit point: screen_stage_intro, screen_battle, screen_event_room, screen_shop, RestScene, TreasureScene, screen_boss_rule_card, screen_settings
- Layout zones: full portrait frame plus 32px safe content area
- Required components: map_header_panel, node_current_slot, node_shop_slot, node_boss_slot, node_preview_panel, map_back_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, ico_node_current, ico_node_shop, ico_node_boss, ui_panel_node_preview, ui_button_secondary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene MapScene.ts; layout spec docs/ui/layouts/screen_map.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Stage Intro / Stage Goal
- Purpose: Introduce current stage, stage goal, and cheerful hazard preview before gameplay.
- Entry point: screen_map
- Exit point: screen_battle, screen_map
- Layout zones: full portrait frame plus 32px safe content area
- Required components: stage_title_panel, stage_goal_panel, stage_goal_icon, start_stage_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, ui_panel_battle, ico_stage_goal_sprinkles, ui_button_primary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene StoryScene.ts; layout spec docs/ui/layouts/screen_stage_intro.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Battle Screen
- Purpose: Canonical portrait battle with combat/event log, puzzle board, and controls in exact 25/55/20 sections.
- Entry point: screen_map, screen_boss_rule_card, screen_stage_intro
- Exit point: screen_node_result, screen_defeat_summary, screen_inventory_modal, screen_settings
- Layout zones: combat 1080x480, puzzle 1080x1056, controls 1080x384
- Required components: battle_background_mid, battle_header_panel, hero_sprite_slot, enemy_sprite_slot, vfx_lane_center, monster_stack_chip, event_log_strip, puzzle_background_mid
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: bg_stage_sprinkle_sewers_battle_mid, ui_panel_battle, hero_milo_blockmancer__idle__f00, mon_cupcake_slime__idle__f00, vfx_enemy_hit, ui_monster_stack_chip, ui_event_log_strip, bg_stage_sprinkle_sewers_puzzle_mid
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene BattleScene.ts; layout spec docs/ui/layouts/screen_battle.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Boss Rule Card / Boss Intro
- Purpose: Show boss mechanics and start-boss affordance before a boss fight.
- Entry point: screen_map
- Exit point: screen_battle
- Layout zones: full portrait frame plus 32px safe content area
- Required components: boss_rule_panel, boss_icon, boss_rule_icon, start_boss_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_boss_rule, ico_boss_cupcake_slime_king, ico_boss_rule_boss_cupcake_slime_king, ui_button_start_boss
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene BattleScene.ts; layout spec docs/ui/layouts/screen_boss_rule_card.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Route Dialogue / Story Choice
- Purpose: Present short story beats and practical/true/risky choices with portrait-safe text.
- Entry point: screen_map, screen_stage_intro, screen_reward
- Exit point: screen_map, screen_battle, screen_reward
- Layout zones: full portrait frame plus 32px safe content area
- Required components: speaker_portrait, dialogue_panel, nameplate_panel, choice_practical, choice_true, choice_risky
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: portrait_hero_milo_blockmancer, ui_panel_dialogue, ui_dialogue_nameplate, ui_choice_card_practical, ui_choice_card_true, ui_choice_card_risky
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene RouteDialogueScene.ts; layout spec docs/ui/layouts/screen_route_dialogue.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Event Room
- Purpose: Resolve cheerful event room choices without covering important text or buttons.
- Entry point: screen_map
- Exit point: screen_map, screen_battle, screen_reward
- Layout zones: full portrait frame plus 32px safe content area
- Required components: event_npc_portrait, event_text_panel, event_choice_one, event_choice_two, event_choice_three
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: portrait_npc_bloop, ui_panel_dialogue, ui_choice_card_practical, ui_choice_card_true, ui_choice_card_risky
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene EventScene.ts; layout spec docs/ui/layouts/screen_event_room.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Shop
- Purpose: Buy items/relics with dynamic prices and quantities rendered by game text.
- Entry point: screen_map
- Exit point: screen_map, screen_inventory_modal
- Layout zones: full portrait frame plus 32px safe content area
- Required components: shop_header_panel, shop_goods_panel, shop_item_icon_one, shop_item_icon_two, shop_item_icon_three, shop_back_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_shop, ui_panel_default, ico_item_mini_cupcake, ico_relic_slime_core, ico_spell_fireball, ui_button_back
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene ShopScene.ts; layout spec docs/ui/layouts/screen_shop.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Inventory / Bag Modal
- Purpose: Paused modal for bag items without hiding resume/close controls.
- Entry point: screen_battle, screen_shop, screen_map
- Exit point: previous_screen
- Layout zones: full portrait frame plus 32px safe content area
- Required components: inventory_modal_panel, inventory_item_slot_one, inventory_item_slot_two, inventory_item_slot_three, inventory_close_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, ico_item_mana_lemonade, ico_item_safety_net, ico_item_alarm_cookie, ui_button_secondary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene BattleScene.ts; layout spec docs/ui/layouts/screen_inventory_modal.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Node Result Screen
- Purpose: Summarize cleared node EXP and progression after battle; no active board behind result.
- Entry point: screen_battle
- Exit point: screen_level_up, screen_reward, screen_map
- Layout zones: full portrait frame plus 32px safe content area
- Required components: node_result_panel, node_clear_banner, xp_meter_before_after, xp_breakdown_rows, xp_gained_counter_icon, level_ready_badge, node_result_continue_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_node_result, ui_node_clear_banner, ui_meter_xp, ui_xp_breakdown_row, ui_xp_gained_counter, ui_level_ready_badge, ui_button_node_result_continue
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene NodeResultScene.ts; layout spec docs/ui/layouts/screen_node_result.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Festival Level-Up
- Purpose: Present three upgrade cards after node clear with dynamic rarity, stack, and effect text.
- Entry point: screen_node_result
- Exit point: screen_reward
- Layout zones: full portrait frame plus 32px safe content area
- Required components: level_up_panel, level_up_xp_meter, level_card_common, level_card_rare, level_card_hero, level_card_icon_one, level_card_icon_two, level_card_icon_three
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_level_up, ui_meter_xp, ui_level_up_card_common, ui_level_up_card_rare, ui_level_up_card_hero, ico_lvl_clear_line_damage, ico_lvl_max_hp_percent, ico_lvl_mana_gain
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene LevelUpRewardScene.ts; layout spec docs/ui/layouts/screen_level_up.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Reward Screen
- Purpose: Choose item/relic/gold rewards with card art and dynamic quantities.
- Entry point: screen_node_result, screen_level_up, screen_battle
- Exit point: screen_map, screen_route_dialogue
- Layout zones: full portrait frame plus 32px safe content area
- Required components: reward_title_panel, reward_card_common, reward_card_rare, reward_card_special, reward_icon_one, reward_icon_two, reward_icon_three, skip_reward_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, ui_reward_card_common, ui_reward_card_rare, ui_reward_card_rare, ico_item_mini_cupcake, ico_relic_star_sticker, ico_spell_star_spark, ui_button_secondary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene RewardScene.ts; layout spec docs/ui/layouts/screen_reward.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Victory / Ending
- Purpose: Show cheerful ending, unlocks, and return flow after final battle or route ending.
- Entry point: screen_reward, screen_battle
- Exit point: screen_main_menu, CollectionScene
- Layout zones: full portrait frame plus 32px safe content area
- Required components: victory_title_panel, victory_hero_portrait, ending_text_panel, victory_main_menu_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, portrait_hero_milo_blockmancer, ui_panel_dialogue, ui_button_primary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene VictoryScene.ts; layout spec docs/ui/layouts/screen_victory_ending.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Defeat / Run Summary
- Purpose: Summarize run end safely with restart and menu actions.
- Entry point: screen_battle
- Exit point: screen_main_menu, screen_hero_select
- Layout zones: full portrait frame plus 32px safe content area
- Required components: defeat_summary_panel, defeat_icon, defeat_progress_meter, try_again_button, defeat_menu_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_default, placeholder_icon, ui_meter_xp, ui_button_primary, ui_button_secondary
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene GameOverScene.ts; layout spec docs/ui/layouts/screen_defeat_summary.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

### Settings / Accessibility
- Purpose: Configure audio, accessibility, controls, and reset options with large touch targets.
- Entry point: screen_main_menu, screen_battle
- Exit point: previous_screen
- Layout zones: full portrait frame plus 32px safe content area
- Required components: settings_panel, tab_audio, tab_accessibility, tab_controls, volume_slider, toggle_reduced_flash, settings_apply_button, settings_back_button
- Text hierarchy: title 56px, body 30px, number 34px, small 22px.
- Asset placeholders: ui_panel_settings, ui_tab_audio, ui_tab_accessibility, ui_tab_controls, ui_slider_default, ui_toggle_on, ui_button_apply, ui_button_back
- Interaction states: default, selected, pressed, disabled, locked/alert where applicable.
- Responsive behavior: canonical coordinates are 1080x1920; runtime scales the portrait frame and rounds positions to whole pixels.
- CodeGraph relationship summary: existing scene SettingsScene.ts; layout spec docs/ui/layouts/screen_settings.layout.json.
- Pixel-perfect requirements: integer rectangles, nearest filtering, no fractional render positions, safe zIndex.
- Asset-drop-in requirements: final PNG must match expectedSourceSize and preserve documented anchor/padding.
- Acceptance criteria: dynamic text is rendered by game text; fallback key exists; final asset import needs no layout JSON change.

## Asset key/fallback rules
Use assetKey for each slot and fallbackAssetKey when final art is absent. Do not bake HP, MP, EXP, score, combo, counts, prices, button labels, or localization into PNGs.

## Pixel-perfect or QA guidance
Run the QA checklist and JSON contract validator before accepting final art. Battle section rectangles are exact and cannot drift.

## Status / known gaps
All mandatory major screens now have layout specs. Runtime implementation may still use existing Phaser scene layout logic until developers wire specs into tooling.
