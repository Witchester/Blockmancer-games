# Content System

## 1. Data-Driven Content Format

Blockmancer Dungeon is intended to move toward a data-driven content model where monsters, heroes, weapons, spells, relics, upgrades, events, loot tables, and difficulty rules live in JSON rather than hardcoded TypeScript. The runtime can then resolve those JSON entries through a registry and feed scenes and systems from content IDs.

Current placeholder status:

- Metadata schemas already exist under `src/game/content/*/metadata.json`
- Most runtime gameplay still uses TypeScript data tables and logic-first systems
- Placeholder content entry JSON files have not yet been added for all planned categories

Design goals:

- Separate content authoring from gameplay engine code
- Support editor tooling and validation
- Make balancing and expansion easier
- Keep placeholders cheap to create and replace later

## 2. metadata.json Role

Each content category has a `metadata.json` file that defines the schema for entries in that category. Metadata files do not contain actual content entries. They describe how entries should be shaped.

Each metadata file should define:

- `contentType`
- `version`
- `idPrefix`
- `displayName`
- `description`
- `idFormat`
- `exampleIds`
- `requiredFields`
- `fields`
- `dataList`
- `commonDataList`
- `defaults`

Practical uses:

- Content editors can build dropdowns from `dataList`
- Validators can confirm required fields and ID conventions
- Generators can scaffold new entries from `defaults`
- Runtime registry code can rely on consistent content structure

## 3. Content Folder Structure

Target content structure:

```text
src/game/content/
  monsters/
    metadata.json
    *.json
  heroes/
    metadata.json
    *.json
  weapons/
    metadata.json
    *.json
  spells/
    metadata.json
    *.json
  relics/
    metadata.json
    *.json
  upgrades/
    metadata.json
    *.json
  status-effects/
    metadata.json
    *.json
  room-events/
    metadata.json
    *.json
  loot-tables/
    metadata.json
    *.json
  difficulty-scaling/
    metadata.json
    *.json
```

Current repo status:

- All planned metadata folders now exist
- Only metadata files exist so far
- Placeholder content entry files are the next step

Folder naming rules:

- Use lowercase kebab-case folder names
- Keep one content family per folder
- Keep IDs stable once referenced by gameplay code or save data

## 4. Required Content Types

Required core categories:

- `monsters`
- `heroes`
- `weapons`
- `spells`
- `relics`
- `upgrades`

Recommended supporting categories:

- `status-effects`
- `room-events`
- `loot-tables`
- `difficulty-scaling`

Runtime intent for each type:

- Monsters: enemy definitions, behavior hooks, reward hooks, scaling
- Heroes: starting stats, loadouts, passives, unlock conditions
- Weapons: stat modifiers and playstyle hooks
- Spells: costs, targeting, effect definitions, upgrade paths
- Relics: passive triggers and run modifiers
- Upgrades: direct scaling or targeted bonuses
- Status effects: temporary combat or board modifiers
- Room events: non-combat choice definitions
- Loot tables: weighted or filtered reward sources
- Difficulty scaling: run-level tuning profiles

## 5. Validation Rules

All content JSON should be machine-validated before being trusted by runtime systems.

Baseline validation rules:

- JSON must parse cleanly
- All metadata files must include the required top-level keys
- Entry IDs should match the folder’s prefix and format
- Required fields must exist
- Enum-like values should come from `dataList` when applicable
- Referenced IDs should point to valid content in the expected content type
- Arrays that represent tags or IDs should avoid unintended duplicates

Current validator:

- `scripts/validate-content-metadata.mjs`
- `npm run validate:metadata`

Current validator scope:

- Scans `src/game/content`
- Parses every `metadata.json`
- Verifies required top-level keys exist

Planned validator expansion:

- Validate actual content entry JSON files
- Check ID-to-folder consistency
- Check metadata-to-entry compatibility
- Check cross-reference integrity between content categories

## 6. Example Content Entry

Example placeholder monster entry shape:

```json
{
  "id": "mon_dungeon_slime",
  "name": "Dungeon Slime",
  "description": "A weak gelatinous enemy that attacks directly.",
  "rarity": "common",
  "tier": 1,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "placeholder_slime",
  "stats": {
    "hp": 30,
    "attack": 3,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Bounce Attack",
    "description": "Deals direct damage."
  },
  "behaviors": ["basic_attack"],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 20,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": ["early_game", "small"],
  "enabled": true
}
```

This entry should be validated against `src/game/content/monsters/metadata.json`.

## 7. Future Content Editor Notes

The metadata layer is intentionally shaped for future editor tooling.

Editor expectations:

- Build forms from `fields`
- Populate dropdowns and multiselects from `dataList`
- Use `defaults` for new-entry scaffolding
- Show `exampleIds` and `idFormat` while authoring
- Validate required fields before save
- Validate references before export

Likely future editor features:

- Content browser by category
- ID auto-generation
- Tag filtering
- Balance previews for spells, monsters, and rewards
- Cross-reference navigation
- Import/export support for batch editing

Integration guidance:

- Add a `ContentRegistry` once content entry JSON files exist
- Keep runtime fallback behavior conservative when IDs are missing
- Avoid hardcoding content values in systems once entry files are in use

## Current Recommended Next Step

To move from metadata-only to actual content-driven runtime behavior:

1. Add placeholder content entry JSON files for all core categories.
2. Implement `ContentRegistry` to load and resolve those entries safely.
3. Refactor existing hardcoded data in `src/game/data/*.ts` toward content-driven lookups.
