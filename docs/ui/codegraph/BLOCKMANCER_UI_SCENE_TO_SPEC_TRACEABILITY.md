# Blockmancer UI Scene To Spec Traceability

## Purpose
Trace every major UI screen from SOT and existing scene evidence to layout JSON, components, placeholder keys, pixel-perfect status, and asset-drop-in readiness.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
| Screen ID | Screen name | Existing scene/class/file | Layout spec file | Primary SOT source | Required components | Placeholder asset keys | CodeGraph/manual evidence | Pixel-perfect status | Asset-drop-in readiness | Missing asset contract fields | Risk of layout fix after final asset import | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| screen_splash | Splash / Loading | src/game/scenes/BootScene.ts | docs/ui/layouts/screen_splash.layout.json | 01,04,05,06 SOT | splash_background, splash_logo_panel, blockomatic_loading_icon, loading_meter, tap_to_start_button | bg_scene_splash, ui_panel_default, placeholder_icon, ui_meter_xp, ui_button_primary | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_main_menu | Main Menu | src/game/scenes/MainMenuScene.ts | docs/ui/layouts/screen_main_menu.layout.json | 01,04,05,06 SOT | main_menu_background, title_panel, new_run_button, continue_button, collection_button, settings_button | bg_scene_main_menu, ui_panel_default, ui_button_primary, ui_button_secondary, ui_button_secondary, ui_button_icon | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_hero_select | Hero Select | src/game/scenes/HeroSelectScene.ts | docs/ui/layouts/screen_hero_select.layout.json | 01,04,05,06 SOT | hero_select_background, hero_grid_panel, hero_milo_card_portrait, hero_pippa_card_portrait, hero_lumi_card_portrait, select_hero_button | bg_scene_hero_select, ui_panel_default, portrait_hero_milo_blockmancer, portrait_hero_pippa_pyromancer, portrait_hero_lumi_star_witch, ui_button_primary | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_map | Roguelike Map | src/game/scenes/MapScene.ts | docs/ui/layouts/screen_map.layout.json | 01,04,05,06 SOT | map_background, map_header_panel, node_current_slot, node_shop_slot, node_boss_slot, node_preview_panel | bg_map_sprinkle_sewers, ui_panel_default, ico_node_current, ico_node_shop, ico_node_boss, ui_panel_node_preview | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_map | Roguelike Map UI-11 runtime note | src/game/scenes/MapScene.ts, src/game/ui/map/MapDataAdapter.ts, src/game/ui/map/MapFlowRouter.ts | docs/ui/layouts/screen_map.layout.json | 01,04,05,06 SOT | map background, header, path lines, node icons/states, node preview, run summary, select/continue buttons | bg_map_sprinkle_sewers, ico_node_normal, ico_node_elite, ico_node_event, ico_node_shop, ico_node_rest, ico_node_treasure, ico_node_boss, ico_node_current, ico_node_completed, ui_panel_node_preview, ui_map_path_unlocked, ui_map_path_locked | CodeGraph UI-11 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing node generation and map availability logic are unchanged. |
| screen_stage_intro | Stage Intro / Stage Goal | src/game/scenes/StoryScene.ts | docs/ui/layouts/screen_stage_intro.layout.json | 01,04,05,06 SOT | stage_intro_background, stage_title_panel, stage_goal_panel, stage_goal_icon, start_stage_button | bg_stage_sprinkle_sewers_intro, ui_panel_default, ui_panel_battle, ico_stage_goal_sprinkles, ui_button_primary | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_stage_intro | Stage Intro UI-11 runtime note | src/game/scenes/StageIntroScene.ts, src/game/ui/stage-intro/StageIntroDataAdapter.ts | docs/ui/layouts/screen_stage_intro.layout.json | 01,04,05,06 SOT | stage intro background, stage title panel, goal panel, goal icon, continue button | bg_stage_sprinkle_sewers_intro, ui_panel_default, ui_panel_battle, placeholder_icon, ui_button_primary | CodeGraph UI-11 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Stage intro uses existing stage, story, and stage goal data, then returns to Map. |
| screen_battle | Battle Screen | src/game/scenes/BattleScene.ts | docs/ui/layouts/screen_battle.layout.json | 01,04,05,06 SOT | battle_background_mid, battle_header_panel, hero_sprite_slot, enemy_sprite_slot, vfx_lane_center, monster_stack_chip | bg_stage_sprinkle_sewers_battle_mid, ui_panel_battle, hero_milo_blockmancer__idle__f00, mon_cupcake_slime__idle__f00, vfx_enemy_hit, ui_monster_stack_chip | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_boss_rule_card | Boss Rule Card / Boss Intro | src/game/scenes/BattleScene.ts | docs/ui/layouts/screen_boss_rule_card.layout.json | 01,04,05,06 SOT | boss_arena_background, boss_rule_panel, boss_icon, boss_rule_icon, start_boss_button | bg_boss_cupcake_slime_king_arena, ui_panel_boss_rule, ico_boss_cupcake_slime_king, ico_boss_rule_boss_cupcake_slime_king, ui_button_start_boss | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_boss_rule_card | Boss Rule Card UI-11 runtime note | src/game/scenes/BossRuleCardScene.ts, src/game/ui/boss-rule/BossRuleDataAdapter.ts | docs/ui/layouts/screen_boss_rule_card.layout.json | 01,04,05,06 SOT | boss arena background, boss rule panel, boss icon, rule icon, start boss button | bg_boss_cupcake_slime_king_arena, ui_panel_boss_rule, ico_boss_cupcake_slime_king, ico_boss_rule_boss_cupcake_slime_king, ui_button_start_boss | CodeGraph UI-11 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Boss nodes route through this scene before BattleScene; boss mechanics and balance are unchanged. |
| screen_route_dialogue | Route Dialogue / Story Choice | src/game/scenes/RouteDialogueScene.ts | docs/ui/layouts/screen_route_dialogue.layout.json | 01,04,05,06 SOT | route_background, speaker_portrait, dialogue_panel, nameplate_panel, choice_practical, choice_true | bg_route_milo_sprinkle_sewers, portrait_hero_milo_blockmancer, ui_panel_dialogue, ui_dialogue_nameplate, ui_choice_card_practical, ui_choice_card_true | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_route_dialogue | Route Dialogue UI-12 runtime note | src/game/scenes/RouteDialogueScene.ts, src/game/ui/route-dialogue/RouteDialogueDataAdapter.ts | docs/ui/layouts/screen_route_dialogue.layout.json | 01,04,05,06 SOT | dialogue background, portrait, nameplate, dialogue panel, continue/skip buttons, practical/true/risky choice cards | bg_route_milo_sprinkle_sewers, ui_panel_dialogue, ui_dialogue_nameplate, ui_choice_card_practical, ui_choice_card_true, ui_choice_card_risky, portrait_hero_milo_blockmancer, portrait_npc_bloop, ico_route_true_flag, ui_button_skip_dialogue, placeholder_portrait | CodeGraph UI-12 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing route choice logic is reused; dynamic speaker/dialogue/choice text is rendered as game text. |
| screen_event_room | Event Room | src/game/scenes/EventScene.ts | docs/ui/layouts/screen_event_room.layout.json | 01,04,05,06 SOT | event_room_background, event_npc_portrait, event_text_panel, event_choice_one, event_choice_two, event_choice_three | bg_scene_event_room, portrait_npc_bloop, ui_panel_dialogue, ui_choice_card_practical, ui_choice_card_true, ui_choice_card_risky | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_shop | Shop | src/game/scenes/ShopScene.ts | docs/ui/layouts/screen_shop.layout.json | 01,04,05,06 SOT | shop_background, shop_header_panel, shop_goods_panel, shop_item_icon_one, shop_item_icon_two, shop_item_icon_three | bg_scene_shop, ui_panel_shop, ui_panel_default, ico_item_mini_cupcake, ico_relic_slime_core, ico_spell_fireball | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_inventory_modal | Inventory / Bag Modal | src/game/scenes/BattleScene.ts | docs/ui/layouts/screen_inventory_modal.layout.json | 01,04,05,06 SOT | inventory_modal_backdrop, inventory_modal_panel, inventory_item_slot_one, inventory_item_slot_two, inventory_item_slot_three, inventory_close_button | ui_modal_backdrop, ui_panel_default, ico_item_mana_lemonade, ico_item_safety_net, ico_item_alarm_cookie, ui_button_secondary | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_node_result | Node Result Screen | src/game/scenes/NodeResultScene.ts | docs/ui/layouts/screen_node_result.layout.json | 01,04,05,06 SOT | node_result_background, node_result_panel, node_clear_banner, xp_meter_before_after, xp_breakdown_rows, xp_gained_counter_icon | bg_scene_node_result, ui_panel_node_result, ui_node_clear_banner, ui_meter_xp, ui_xp_breakdown_row, ui_xp_gained_counter | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_level_up | Festival Level-Up | src/game/scenes/LevelUpRewardScene.ts | docs/ui/layouts/screen_level_up.layout.json | 01,04,05,06 SOT | level_up_background, level_up_panel, level_up_xp_meter, level_card_common, level_card_rare, level_card_hero | bg_scene_level_up, ui_panel_level_up, ui_meter_xp, ui_level_up_card_common, ui_level_up_card_rare, ui_level_up_card_hero | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_reward | Reward Screen | src/game/scenes/RewardScene.ts | docs/ui/layouts/screen_reward.layout.json | 01,04,05,06 SOT | reward_background, reward_title_panel, reward_card_common, reward_card_rare, reward_card_special, reward_icon_one | bg_scene_reward, ui_panel_default, ui_reward_card_common, ui_reward_card_rare, ui_reward_card_rare, ico_item_mini_cupcake | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_reward | Reward Screen UI-10 runtime note | src/game/scenes/RewardScene.ts, src/game/ui/reward/RewardDataAdapter.ts, src/game/ui/reward/RewardFlowRouter.ts | docs/ui/layouts/screen_reward.layout.json | 01,04,05,06 SOT | reward_background, reward_title_panel, reward summary, reward cards, empty state, claim/continue | bg_scene_reward, ui_panel_reward, ui_reward_banner, ui_reward_card_common, ui_reward_card_rare, ui_reward_card_epic, ui_button_reward_claim, ui_button_reward_continue, ui_reward_empty_state, placeholder_icon | CodeGraph UI-10 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Pending reward choices render as selectable cards. No-reward post-node flow skips RewardScene and completes map/stage routing. |
| screen_victory_ending | Victory / Ending | src/game/scenes/VictoryScene.ts | docs/ui/layouts/screen_victory_ending.layout.json | 01,04,05,06 SOT | victory_background, victory_title_panel, victory_hero_portrait, ending_text_panel, victory_main_menu_button | bg_scene_victory_ending, ui_panel_default, portrait_hero_milo_blockmancer, ui_panel_dialogue, ui_button_primary | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_defeat_summary | Defeat / Run Summary | src/game/scenes/GameOverScene.ts | docs/ui/layouts/screen_defeat_summary.layout.json | 01,04,05,06 SOT | defeat_background, defeat_summary_panel, defeat_icon, defeat_progress_meter, try_again_button, defeat_menu_button | bg_scene_defeat_summary, ui_panel_default, placeholder_icon, ui_meter_xp, ui_button_primary, ui_button_secondary | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_settings | Settings / Accessibility | src/game/scenes/SettingsScene.ts | docs/ui/layouts/screen_settings.layout.json | 01,04,05,06 SOT | settings_background, settings_panel, tab_audio, tab_accessibility, tab_controls, volume_slider | bg_scene_settings, ui_panel_settings, ui_tab_audio, ui_tab_accessibility, ui_tab_controls, ui_slider_default | CodeGraph scene file plus manual SOT/layout evidence | Ready | Ready | None | Low if final art matches contract | Existing/Spec | Runtime may still need future wiring to consume specs. |
| screen_shop | Shop UI-13 runtime note | src/game/scenes/ShopScene.ts, src/game/ui/shop/ShopDataAdapter.ts | docs/ui/layouts/screen_shop.layout.json | 01,04,05,06 SOT | shop background, header panel, goods panel, shop item cards, item icons, buy/leave buttons | bg_scene_shop, ui_panel_shop, ui_shop_item_card, ui_button_buy, ui_button_sell, ui_button_back, placeholder_icon | CodeGraph UI-13 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing ShopSystem handlers and pricing are reused; no economy or reward balance changes. |
| screen_inventory_modal | Inventory / Bag Modal UI-13 runtime note | src/game/scenes/BattleScene.ts, src/game/ui/inventory/InventoryDataAdapter.ts | docs/ui/layouts/screen_inventory_modal.layout.json | 01,04,05,06 SOT | inventory modal panel, item/relic/spell list cards, icon slots, detail panel, close button | ui_panel_inventory, ui_inventory_item_card, ui_inventory_detail_panel, ui_button_apply, ui_button_secondary, placeholder_icon | CodeGraph UI-13 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing battle item-use behavior is preserved; relics and spells render as non-consumable inventory details. |
| screen_settings | Settings UI-13 runtime note | src/game/scenes/SettingsScene.ts, src/game/ui/settings/SettingsDataAdapter.ts | docs/ui/layouts/screen_settings.layout.json | 01,04,05,06 SOT | settings background, settings panel, audio/accessibility/controls tabs, sliders, toggles, apply/back buttons | bg_scene_settings, ui_panel_settings, ui_tab_audio, ui_tab_accessibility, ui_tab_controls, ui_slider_default, ui_toggle_on, ui_toggle_off, ui_button_apply, ui_button_back | CodeGraph UI-13 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing settings fields and saveSettings path are reused; no save schema changes. |
| screen_splash | Splash / Loading UI-14 runtime note | src/game/scenes/BootScene.ts, src/game/ui/outer-flow/OuterFlowUi.ts | docs/ui/layouts/screen_splash.layout.json | 01,04,05,06 SOT | splash background, logo panel, loading icon, loading meter, loading button state | bg_scene_splash, ui_panel_default, placeholder_icon, ui_meter_xp, ui_button_primary | CodeGraph UI-14 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Boot preload shows fallback-safe splash UI while existing asset preload/font wait flow remains unchanged. |
| screen_main_menu | Main Menu UI-14 runtime note | src/game/scenes/MainMenuScene.ts, src/game/ui/outer-flow/OuterFlowUi.ts | docs/ui/layouts/screen_main_menu.layout.json | 01,04,05,06 SOT | main menu background, title panel, menu button panel, new run, continue, collection/help/settings buttons | bg_scene_main_menu, ui_panel_main_menu, ui_button_new_run, ui_button_continue, ui_button_settings, ui_button_back | CodeGraph UI-14 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing opening/tutorial/new-run/continue routing is preserved. |
| screen_hero_select | Hero Select UI-14 runtime note | src/game/scenes/HeroSelectScene.ts, src/game/ui/outer-flow/OuterFlowUi.ts | docs/ui/layouts/screen_hero_select.layout.json | 01,04,05,06 SOT | hero select background, hero select panel, hero cards, hero portraits, start/back buttons | bg_scene_hero_select, ui_panel_hero_select, ui_hero_card, portrait_hero_milo_blockmancer, placeholder_portrait, ui_button_new_run, ui_button_back | CodeGraph UI-14 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing hero content and unlock checks are reused; selected unlocked hero still starts via `newRun(heroId)`. |
| screen_defeat_summary | Defeat / Run Summary UI-14 runtime note | src/game/scenes/GameOverScene.ts, src/game/ui/outer-flow/OuterFlowUi.ts | docs/ui/layouts/screen_defeat_summary.layout.json | 01,04,05,06 SOT | defeat/victory background, summary panel, icon, progress meter, restart/hub/menu buttons | bg_scene_defeat, bg_scene_victory, ui_panel_run_summary, ui_meter_xp, ui_button_new_run, ui_button_back | CodeGraph UI-14 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing victory/game-over state setting and clear-save restart/menu handlers are preserved. |
| screen_victory_ending | Victory / Ending UI-14 runtime note | src/game/scenes/VictoryScene.ts, src/game/ui/outer-flow/OuterFlowUi.ts | docs/ui/layouts/screen_victory_ending.layout.json | 01,04,05,06 SOT | victory background, title panel, hero portrait, ending text panel, main menu button | bg_scene_victory, ui_panel_victory, portrait_hero_milo_blockmancer, ui_panel_dialogue, ui_button_back | CodeGraph UI-14 implementation pass | Ready | Ready | None | Low if final art matches contract | Implemented | Existing story/route ending lookup and hero unlock note rendering are preserved. |

## Asset-drop-in readiness status values
- Ready: all slot fields documented and canonical.
- Partial: screen has layout but missing some asset slot contracts.
- Risky: screen likely needs layout fixes after final art import.
- Missing: no screen spec or no asset contract.

## Asset key/fallback rules when applicable
Traceability is only Ready when layout JSON contains all required slot fields and fallback keys.

## Pixel-perfect or QA guidance when applicable
Any new screen must add a trace row and a layout JSON before final art import.

## Status / known gaps
All mandatory screens are now documented as specs. Runtime implementation may still need a future integration pass to load specs directly.

## UI-1 Foundation Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| UI-1 foundation implemented | Yes | `src/game/types/ui-layout.ts`, `src/game/ui/PixelPerfect.ts`, `src/game/ui/UiLayoutValidator.ts`, `src/game/ui/UiLayoutRegistry.ts`, `src/game/ui/UiAssetSlotResolver.ts`, `src/game/ui/UiLayoutDebugReport.ts` | Foundation only; no full scene UI implementation. |
| Runtime layout loader status | Partial | `UiLayoutRegistry.ts` registers all 17 screen IDs and docs layout paths. | Runtime JSON loading is metadata-only until a safe bundling/public delivery path is chosen. |
| Pixel-perfect helper status | Yes | `PixelPerfect.ts` | Provides integer rounding, rect clamping, anchor offsets, integer scale, and component normalization helpers. |
| Asset slot resolver status | Yes | `UiAssetSlotResolver.ts` | Uses `assetKey`/`fallbackAssetKey` and manifest-aware fallback helpers; no raw path rendering. |
| Validation script status | Yes | `scripts/validate-ui-layouts.mjs`, `package.json` script `validate:ui-layouts` | Validates 17 layout JSON specs and exact battle section rectangles. |
| Gameplay rewrite status | Not attempted | No scene/gameplay system rewiring in UI-1. | Cascade Gravity and existing scene IDs remain unchanged. |

## UI-2 Shared Component Primitive Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Shared component primitives implemented | Yes | `src/game/ui/components/UiBaseComponent.ts`, `UiPanel.ts`, `UiButton.ts`, `UiIconSlot.ts`, `UiSpriteSlot.ts`, `UiMeter.ts`, `UiTextLabel.ts`, `UiChip.ts`, `UiCard.ts`, `UiModalBackdrop.ts` | Reusable primitive layer exists; no full screen implementation attempted. |
| Component factory status | Yes | `src/game/ui/components/UiComponentFactory.ts` | Factory creates panel, button, icon slot, sprite slot, meter, text label, chip, card, modal backdrop, or dispatches by `UiComponentSpec.type`. |
| Primitive coverage status | Yes | `src/game/ui/components/index.ts` | Conceptual coverage matches UI-2: panels, buttons, icon/sprite slots, meters, labels, chips, cards, modal backdrop, shared state handling. |
| Asset fallback support | Yes | `UiBaseComponent.resolveAssetKey`, `UiAssetSlotResolver.resolveFallbackSafeAssetKey`, `AssetSystem` fallback textures | Uses asset keys and fallback asset keys; missing final PNGs remain nonfatal. |
| Pixel-perfect support | Yes | `normalizePixelPerfectComponent`, `roundPixel`, integer bounds/depth/text/hit-zone placement | Primitives normalize x/y/w/h and use integer render positions. |
| Dynamic text support | Yes | `UiTextLabel`, `UiButton`, `UiMeter`, `UiChip`, `UiCard` | Dynamic labels, values, quantities, descriptions, and button text are Phaser text objects. |
| Screens still not implemented | Yes | Existing scene trace rows remain Existing/Spec | BattleScene UI, Node Result, and Level-Up screens are still future phases and were not wired in UI-2. |
| Gameplay rewrite status | Not attempted | No changes under gameplay systems or board/combat logic | Save-facing IDs, runtime asset IDs, scene IDs, hero IDs, monster IDs, stage IDs, and asset keys remain unchanged. |

## UI-3 Asset Resolver Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Asset resolver hardened | Yes | `src/game/ui/UiAssetSlotResolver.ts` | Returns structured resolved/unresolved results and checks loaded Phaser textures when scene context exists. |
| Fallback-safe rendering integrated | Yes | `src/game/ui/components/UiBaseComponent.ts` | Shared primitives resolve slots before image creation and keep rectangle fallback surfaces nonfatal. |
| Placeholder policy implemented | Yes | `src/game/ui/UiPlaceholderKeys.ts` | Uses existing generated placeholder/fallback texture keys where available; no new top-level folders required. |
| Asset-drop-in reporting implemented | Yes | `src/game/ui/UiAssetDropInReport.ts` | Reports readiness counts, source-size issues, missing canonical/fallback data, risky fit/scale modes, and dynamic text concerns. |
| Physical asset existence required | No | Resolver/report/script behavior | Missing final PNG assets are warning/report concerns, not runtime fatal errors. |
| Screens still not implemented | Yes | No scene rewiring in UI-3 | BattleScene UI, Node Result, and Level-Up screen implementation remain future phases. |

## UI-4 Battle Screen Shell Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Battle shell implemented | Yes | `src/game/ui/battle/BattleScreenShell.ts` | Creates the structural shell only: root, section containers, background layers, future UI/VFX/event/board/rail/control/modal/debug layers. |
| BattleScene integration status | Partial | `src/game/scenes/BattleScene.ts` | Shell is instantiated and destroyed safely behind existing gameplay UI. Existing detailed BattleScene UI still renders until later migration phases. |
| Exact section split status | Yes | `BATTLE_SHELL_SECTION_BOUNDS`, `scripts/validate-ui-layouts.mjs` | Combat `0,0,1080,480`; puzzle `0,480,1080,1056`; controls `0,1536,1080,384`; non-overlap validation included. |
| Pixel-perfect status | Yes | `src/game/ui/PortraitFrame.ts`, `BattleScreenShell.resize` | Root portrait frame is centered/scaled from 1080x1920; internal section coordinates remain integer design-space pixels. |
| Asset-drop-in readiness | Partial | `BattleScreenShell` background specs + `UiAssetSlotResolver` | Background slots resolve via asset keys/fallback keys and remain nonfatal when final art is missing. Physical PNG dimensions are still not probed. |
| UI-5 remaining work | Complete | `BattleCombatHud`, `BattleEventLog`, `MonsterStackPreview` | Detailed combat HUD, HP/MP/intent, monster stack, and event log content are migrated into combat shell layers. |
| UI-6 remaining work | Pending | Puzzle layers exist | Board rails, Hold, Next Queue, right stat cards, and inventory indicator still need migration. |
| UI-7 remaining work | Pending | Controls layers exist | Mobile controls and action buttons still need migration without rewiring gameplay actions. |

## UI-5 Battle Combat HUD Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Combat HUD implemented | Yes | `src/game/ui/battle/BattleCombatHud.ts`, `src/game/scenes/BattleScene.ts` | Header, hero sprite/stat cluster, enemy sprite/stat cluster, shield/status chips, and enemy intent/countdown render inside Section 1 only. |
| Event Log implemented | Yes | `src/game/ui/battle/BattleEventLog.ts`, `src/game/ui/battle/BattleScreenShell.ts` | Uses `battleShell.eventLogLayer`, `ui_event_log_strip`, dynamic text messages, and a compact max 2 visible message strip at the top of Section 2 to reduce Section 1 clustering. |
| Monster Stack Preview implemented | Yes | `src/game/ui/battle/MonsterStackPreview.ts` | Uses active/next enemy icons plus a dynamic count chip near the enemy side, outside the event log. |
| Phase 3 Monster Stack progression | Complete | `MonsterStackPreview`, `BattleScene`, persisted `activeEncounterPack.currentEnemyIndex` | Compact active/partly tucked next icons and `+N` mystery chip derive from encounter-pack state, clamp malformed indexes, use placeholder-safe icons, refresh on enemy advance/load, and clear on node completion. |
| VFX lane prepared | Yes | `BattleScreenShell.combatVfxLayer`, `BattleCombatHud.vfxLaneBounds` | Center lane is reserved for future VFX/damage numbers; UI-5 adds debug bounds only. |
| BattleScene integration status | Yes | `BattleScene.createBattleCombatUi`, `BattleScene.updateBattleCombatHud` | Existing run/combat state drives the new components without changing combat logic. |
| Pixel-perfect status | Yes | `screen_battle.layout.json`, `PixelPerfect` helpers, UI-2 primitives | UI-5 constants match integer design-space combat bounds; runtime positions are whole pixels. |
| Asset-drop-in readiness | Yes | `UiAssetSlotResolver`, UI-2 primitives, UI-5 components | Uses asset keys and fallbacks; missing final PNGs are nonfatal. |
| UI-6 remaining work | Pending | Puzzle layer still uses existing BattleScene rendering | Hold/Next rails, board panel, right stat rail, and inventory compact indicator remain for UI-6. |
| UI-7 remaining work | Pending | Controls layer still uses existing BattleScene rendering | Controls buttons and spell/action row remain for UI-7. |

## 2026-05-26 Battle Readability Follow-Up

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Combat HUD readability | Updated | `src/game/ui/battle/BattleCombatHud.ts` | HP/MP meters, status chips, header panel, and hero/enemy sprite fit boxes were enlarged inside the combat section to improve scaled portrait readability. |
| Event log placement | Updated | `src/game/ui/battle/BattleEventLog.ts`, `src/game/ui/battle/BattleScreenShell.ts` | Event log moved out of Section 1 and into the beginning of Section 2. The strip is resized to 1032x96 with two visible messages to keep combat HUD less clustered. |
| Puzzle asset scale and next queue | Updated | `src/game/ui/battle/BattlePuzzleSectionUi.ts` | Board grid uses 410x820 design-space below the moved event log, preserving the 10x20 cell aspect. Next queue and side rails remain compact, and the puzzle Bag button was removed because Bag now belongs to the Section 3 controls row. |

## UI-7 Controls Section Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Controls section UI implemented | Yes | `src/game/ui/battle/BattleControlsSectionUi.ts`, `src/game/scenes/BattleScene.ts` | Movement, soft drop, rotate, hold, hard drop, spell slots, locked skill/special slots, bag, and pause shortcut render inside Section 3. |
| Input adapter implemented | Yes | `src/game/ui/battle/BattleControlsInputAdapter.ts` | Touch controls dispatch through existing BattleScene handlers and guard against locked battle state. |
| Section bounds status | Yes | `BattleScreenShell.controlsSection`, `screen_battle.layout.json` | Controls remain inside canonical `x0 y1536 w1080 h384` shell coordinates. |
| Touch target status | Yes | `BattleControlsSectionUi` constants | Primary controls are 96x96; action slots are 128x96. |
| Asset fallback status | Yes | `Button` + `AssetSystem` icon resolution | Runtime references asset keys such as `ico_control_left`, `ico_control_rotate`, `ui_inventory_compact`, and `ico_settings`; missing textures remain fallback-safe. |
| Gameplay rewrite status | Not attempted | Existing `moveHorizontal`, `rotatePiece`, `softDrop`, `hardDrop`, `handleHold`, `tryCast`, and `toggleInventory` callbacks are reused | Movement rules, lock delay, Cascade Gravity, spell cost, and combat formulas are unchanged. |

## UI-8 Node Result Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Node Result screen implemented | Yes | `src/game/scenes/NodeResultScene.ts`, `src/game/ui/node-result/NodeResultDataAdapter.ts` | Renders Node Clear banner, stage/node labels, defeated enemies, total EXP, breakdown rows, current level, before/after XP meter, remaining EXP, and Level Up Ready badge. |
| Battle clear integration | Yes | `src/game/scenes/BattleScene.ts` | Full node clear builds a `NodeResultSummary`, applies node EXP through the idempotent claim path, saves `pendingNodeResult`, then starts `NodeResultScene`. |
| Continue routing | Yes | `src/game/ui/node-result/NodeResultFlowRouter.ts` | Continue routes to Festival Level-Up first when pending, then Reward when rewards/stage advance are pending, otherwise completes the node and returns to Map. |
| Asset fallback status | Yes | `src/game/data/assets.ts`, `src/game/scenes/NodeResultScene.ts` | Uses node-result asset keys and manifest fallbacks; missing final panel, meter, button, icon, badge, or sparkle assets remain nonfatal. |
| Gameplay rewrite status | Not attempted | `LevelUpSystem.applyNodeXpOnce`, `EncounterPackSystem.applyNodeResultXpIfNeeded` | EXP/reward balance, combat formulas, and save schema are unchanged; duplicate EXP application remains guarded by `nodeResultClaims`. |

## UI-9 Festival Level-Up Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Festival Level-Up screen implemented | Yes | `src/game/scenes/LevelUpRewardScene.ts`, `src/game/ui/level-up/LevelUpDataAdapter.ts` | Renders title/banner, current/new level, XP summary, three upgrade choices, rarity, stack count/limit, and effect text. |
| Selection/apply flow | Yes | `src/game/ui/level-up/LevelUpFlowRouter.ts` | Confirm applies the selected upgrade once, consumes exactly one pending level-up, clears the offer, and locks duplicate taps. |
| Multiple pending level-ups | Yes | `resolveLevelUpNextScene`, `continueFromLevelUp` | Remaining pending level-ups restart the Level-Up screen one at a time before reward/map routing. |
| Reroll handling | Yes | `rerollLevelUpChoices` | Reroll button is rendered only when `playerLevelState.rerollCharges > 0`; reroll consumes one charge and creates a fresh offer. |
| Deterministic offer restore | Yes | `LevelUpSystem.pickLevelUpChoices`, `LevelUpRewardScene.prepareCards`, `LevelUpFlowRouter.resetLevelUpOffer` | Level-up card generation uses the persisted `levelUpSelectionSeed`; unresolved offers restore exact `offeredUpgradeIds`, and reset/reroll clears stale seeds before generating a new offer. |
| Asset fallback status | Yes | `src/game/data/assets.ts`, `src/game/scenes/LevelUpRewardScene.ts` | Uses level-up asset keys and manifest fallbacks; missing final panel, card, button, meter, background, icon, or sparkle art remains nonfatal. |
| Gameplay rewrite status | Not attempted | `LevelUpSystem`, `UpgradeSystem` | EXP balance, upgrade balance, reward grants, and save schema are unchanged. |

## UI-10 Reward Screen Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Reward screen implemented | Yes | `src/game/scenes/RewardScene.ts`, `src/game/ui/reward/RewardDataAdapter.ts` | Renders reward banner/title, node/stage/source summary, gold amount when present, reward cards, and an empty state for direct scene entry with no pending rewards. |
| Post-node routing implemented | Yes | `src/game/ui/node-result/NodeResultFlowRouter.ts`, `src/game/ui/level-up/LevelUpFlowRouter.ts`, `src/game/ui/reward/RewardFlowRouter.ts` | Node Result and Level-Up route to Reward only when `pendingRewards` is non-empty; otherwise post-node completion routes to Map or advances boss stage. |
| Claim safety | Yes | `claimPendingReward` | Claims one selected pending reward, then clears `pendingRewards`; duplicate taps are locked by `RewardScene`. |
| Asset fallback status | Yes | `src/game/data/assets.ts`, `RewardScene` | Uses reward asset keys with manifest fallbacks; missing final reward art remains nonfatal. |
| Gameplay rewrite status | Not attempted | `RewardSystem.applyReward`, `MapSystem`, `LevelUpSystem` | Reward/EXP balance and save schema are unchanged. |

## UI-11 Map / Stage Intro / Boss Rule Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Map UI alignment | Yes | `src/game/scenes/MapScene.ts`, `src/game/ui/map/MapDataAdapter.ts` | Uses shared panels, buttons, and icon slots for map screen chrome, node preview, actions, run summary, and node icons. |
| Map layer visibility | Yes | `src/game/scenes/MapScene.ts` | Map background and dimmer are explicitly behind the UI, while node graph, text, summary chips, and action hint are above panel assets. Runtime map nodes draw direct high-contrast circle, icon, glyph, label, and hit-zone objects so the selection nodes remain visible even when icon art falls back. |
| Stage Intro implemented | Yes | `src/game/scenes/StageIntroScene.ts`, `src/game/ui/stage-intro/StageIntroDataAdapter.ts` | Shows dynamic stage title, story flavor, stage goal, progress, modifiers, and continue button. |
| Boss Rule Card implemented | Yes | `src/game/scenes/BossRuleCardScene.ts`, `src/game/ui/boss-rule/BossRuleDataAdapter.ts` | Shows boss name, boss/rule icons, existing boss rule text, warning, and Start Boss button. |
| Routing aligned | Yes | `MapScene`, `MapFlowRouter`, `BossRuleCardScene`, `BattleScene` | Reward/Node Result returns to Map, Map routes to existing room scenes, boss nodes route through Boss Rule Card, and Boss Rule Card starts Battle. |
| Gameplay rewrite status | Not attempted | `MapSystem`, `BossSystem`, `StageSystem`, `StageGoalSystem` | Node generation, stage length, encounter counts, boss mechanics, reward flow, EXP flow, and save schema are unchanged. |

## Battle Runtime Alignment Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Battle board alignment | Yes | `src/game/scenes/BattleScene.ts`, `src/game/ui/battle/BattlePuzzleSectionUi.ts`, `src/game/ui/battle/BattleScreenShell.ts` | The live board now converts the shell's 1080x1920 design board slot through the active portrait frame scale before creating board cells, keeping gameplay blocks aligned to the scaled UI shell on the 720x1280 Phaser canvas. |
| Battle UI visibility | Yes | `src/game/scenes/BattleScene.ts` | The battle shell is raised above legacy background rectangles, and board cells/sprites/symbols render above the board panel/grid so the main gameplay screen remains readable and playable. |

## UI-12 Route Dialogue / Story Choice Status Notes

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Route Dialogue UI aligned | Yes | `src/game/scenes/RouteDialogueScene.ts`, `src/game/ui/route-dialogue/RouteDialogueDataAdapter.ts` | Uses shared UI primitives for background, portrait, nameplate, dialogue panel, and continue/skip buttons. |
| Story choice cards aligned | Yes | `RouteDialogueScene.renderChoiceCard`, `buildRouteChoiceCards` | Practical/true/risky choices render from existing route data with selected/disabled state handling when a route choice is already recorded. |
| Route/save safety | Yes | `RouteStorySystem.resolveRouteChoice` remains the choice handler | Route IDs, choice IDs, true flags, lane scores, rewards, risks, and save-facing route progress are unchanged. |
| Asset fallback status | Yes | `src/game/data/assets.ts`, route/story `.gitkeep` scaffold files | Route backgrounds, portraits, nameplates, choice cards, true flag icon, and skip button have fallback-safe manifest entries. |
| Gameplay rewrite status | Not attempted | No changes to `RouteStorySystem` behavior | Story route logic and content are not rewritten. |
