# Blockmancer UI Component Dependency Graph

## Purpose
Map screens to reusable components and asset keys so implementation work can assess shared UI impact.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
```mermaid
flowchart LR
  Battle --> PanelBattle[ui_panel_battle]
  Battle --> BattleCombatHud[BattleCombatHud]
  BattleCombatHud --> HudMeter[UiMeter]
  BattleCombatHud --> HudSpriteSlot[UiSpriteSlot]
  BattleCombatHud --> HudChip[UiChip]
  BattleCombatHud --> HudText[UiTextLabel]
  Battle --> EventLog[ui_event_log_strip]
  Battle --> BattleEventLog[BattleEventLog]
  BattleEventLog --> EventLogPanel[UiPanel]
  BattleEventLog --> EventLogText[UiTextLabel]
  Battle --> MonsterStackPreview[MonsterStackPreview]
  MonsterStackPreview --> StackIcon[UiIconSlot]
  MonsterStackPreview --> StackChip[UiChip]
  Battle --> BoardPanel[ui_panel_board]
  Battle --> Controls[ui_panel_controls]
  Controls --> BattleControlsSectionUi[BattleControlsSectionUi]
  BattleControlsSectionUi --> ControlsInput[BattleControlsInputAdapter]
  BattleControlsSectionUi --> Button[Button]
  Battle --> SpellButton[ui_button_spell_slot]
  NodeResult --> NodePanel[ui_panel_node_result]
  NodeResult --> XpMeter[ui_meter_xp]
  LevelUp --> LevelPanel[ui_panel_level_up]
  LevelUp --> LevelAdapter[LevelUpDataAdapter]
  LevelUp --> LevelRouter[LevelUpFlowRouter]
  LevelUp --> LevelMeter[UiMeter]
  LevelUp --> LevelButton[UiButton]
  LevelUp --> LevelCard[ui_level_up_card_common / rare / hero]
  Reward --> RewardCard[ui_reward_card_common / rare]
  RouteDialogue --> DialoguePanel[ui_panel_dialogue]
  RouteDialogue --> ChoiceCards[ui_choice_card_practical / true / risky]
  Map --> NodeIcons[ico_node_*]
  Shop --> Buttons[ui_button_primary / secondary]
  Settings --> Toggles[ui_toggle_on / off]
  Settings --> Slider[ui_slider_default]
  PanelBattle --> bg_stage_sprinkle_sewers_battle_mid
  EventLog --> ui_event_log_strip
  BoardPanel --> ui_panel_board
  Controls --> ui_panel_controls
  LevelCard --> ico_lvl_clear_line_damage
  RewardCard --> placeholder_icon
  DialoguePanel --> portrait_hero_milo_blockmancer
```

## Asset key/fallback rules when applicable
Shared components must keep the same asset keys across screens unless a screen-specific variant is documented.

## Pixel-perfect or QA guidance when applicable
Changing a shared component requires checking every screen listed in layout JSON relatedComponents.

## Status / known gaps
This is a manual Mermaid graph based on CodeGraph scene/file evidence and the new layout specs.

## UI-9 Festival Level-Up Status Notes

`LevelUpRewardScene` now uses shared UI primitives for panel, meter, icon slot, and button rendering. `LevelUpDataAdapter` maps upgrade content into card view models with icon, name, rarity, stack count, stack limit, and effect text. `LevelUpFlowRouter` owns one-selection application, pending level-up consumption, reroll reset, and reward/map routing.

## UI-13 Shop / Inventory / Settings Status Notes

`ShopScene` now uses shared `UiPanel`, `UiIconSlot`, and `UiButton` components driven by `ShopDataAdapter`, while all purchases still dispatch through `ShopSystem`. `BattleScene` uses `InventoryDataAdapter` to render the existing bag modal with item, relic, and spell cards plus an item detail panel; only existing battle item-use handlers are actionable. `SettingsScene` uses `SettingsDataAdapter` to group existing settings into audio, accessibility, and controls tabs with shared sliders, toggles, and buttons.

## UI-14 Outer Flow Status Notes

`BootScene`, `MainMenuScene`, `HeroSelectScene`, `GameOverScene`, and `VictoryScene` now use shared `UiPanel`, `UiButton`, `UiIconSlot`, `UiSpriteSlot`, and `UiMeter` primitives through `OuterFlowUi` helpers. Existing new-run, continue, hero unlock, route ending, victory, defeat, clear-save, and settings routing behavior is preserved.
