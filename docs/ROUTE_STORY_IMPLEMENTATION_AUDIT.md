# Route Story Implementation Audit

Date: 2026-05-18

## Source Documents Read

- `AGENT.md`
- `docs/01_GDD_MASTER.md`
- `docs/story board/blockmancer_master_character_route_index.md`
- `docs/story board/blockmancer_milo_route_variable_choices.md`
- `docs/story board/blockmancer_pippa_route_variable_choices.md`
- `docs/story board/blockmancer_zuzu_route_variable_choices.md`
- `docs/story board/blockmancer_nixie_route_variable_choices.md`
- `docs/story board/blockmancer_bruk_route_variable_choices.md`
- `docs/story board/blockmancer_lumi_route_variable_choices.md`

## Existing Architecture Findings

- `ContentRegistry` loads known content folders with safe fallback IDs, but route story content did not exist yet.
- `SaveSystem` and `normalizeRunState` already migrate old saves defensively, so route progress can fit into `RunState`.
- `MapScene` owns map-node entry and is the cleanest place to prefer route triggers on Event nodes.
- `BattleScene` owns combat victory and boss intro, so it is the right place for boss callbacks and the no-Event-node route fallback after first combat victory.
- `VictoryScene` already handles Normal/True ending display, but it needed hero-route ending IDs and optional risky variant text.
- `RewardSystem`, `InventorySystem`, and `OopsieSystem` already provide hooks for functional route rewards.

## Implementation Decisions

- Added a generic route progress model on `RunState.routeProgress`.
- Added meta fields for persisted route ending unlocks and risky variant unlocks.
- Loaded route scenes from JSON files under `src/game/content/story/routes/`.
- Kept each hero route in a separate JSON file.
- Used stable full scene IDs such as `SCN_MILO_01_SPRINKLE_SEWERS`.
- Used unique trigger IDs for all 36 hero-stage route scenes.
- Route events trigger once per hero-stage per run.
- Event-node route triggers are preferred. Combat-victory fallback only fires when no uncompleted Event node remains in the stage map.
- Missing route content returns a safe fallback scene and logs validation warnings instead of crashing.

## Reward Hook Coverage

- Directly functional: gold, heal, mana, shield, item grants, relic/upgrade grants through `RewardSystem`, battle modifiers, warning modifiers, and Oopsie chance.
- Placeholder-safe: stage, boss, and hazard modifiers use current reactive-state hooks where available and otherwise log a route modifier message.

## Risks / Follow-Up

- Route scene UI is functional and mobile-readable, but future polish can add portraits and route-specific icons.
- Route rewards intentionally use conservative stat/item/modifier hooks to avoid destabilizing combat balance.
- Boss callbacks currently display at boss intro and apply a small generic practical/true/risky modifier based on the selected route lane.
