# Game Content Data Structure

This document describes the data-driven content system for Blockmancer Dungeon.

## Overview

All game content is defined as JSON data files in `src/game/content/`. This allows for easy modification and balancing without touching game code.

## Content Folders

- **heroes/**: Playable character definitions
- **weapons/**: Equipment that modifies player stats and abilities
- **monsters/**: Enemy definitions with behaviors and rewards
- **spells/**: Magic abilities that players can cast
- **relics/**: Passive items that provide long-term benefits
- **upgrades/**: One-time or stackable temporary improvements
- **status-effects/**: Buffs and debuffs applied during combat
- **board-blocks/**: Special block types with unique behaviors
- **room-events/**: Interactive encounters and choices
- **curses/**: Negative modifiers that persist during a run
- **loot-tables/**: Reward pools for different encounter types
- **difficulty-scaling/**: Difficulty mode configurations
- **map-nodes/**: Map tile definitions and room types

## ID Naming Conventions

Each content piece has a unique ID using lowercase kebab-case with a type prefix:

| Content Type | Prefix | Example |
|---|---|---|
| Heroes | `hero_` | `hero_blockmancer` |
| Weapons | `wpn_` | `wpn_fire_tome` |
| Monsters | `mon_` | `mon_dungeon_slime` |
| Spells | `spl_` | `spl_fireball` |
| Relics | `rel_` | `rel_goblin_coin` |
| Upgrades | `upg_` | `upg_sharp_edges` |
| Status Effects | `status_` | `status_burn` |
| Board Blocks | `block_` | `block_magic` |
| Room Events | `evt_` | `evt_shrine_of_gravity` |
| Curses | `curse_` | `curse_heavy_blocks` |
| Loot Tables | `loot_` | `loot_battle_default` |
| Difficulty Scaling | `scale_` | `scale_easy` |
| Map Nodes | `node_` | `node_fight` |

## Asset Key References

All content uses placeholder asset keys instead of actual image/audio files. Asset keys follow patterns:

- Sprites: `hero_blockmancer_idle`, `mon_slime_attack`
- Icons: `spell_fireball`, `rel_goblin_coin`
- Effects: `effect_fireball`, `effect_burn`
- Backgrounds: `bg_event_shrine`

Assets can be added later by replacing these keys with actual art.

## How to Add a New Monster

1. Create a file: `src/game/content/monsters/my-monster.json`

2. Use this template:
```json
{
  "id": "mon_my_monster",
  "name": "My Monster",
  "description": "A custom monster.",
  "rarity": "common",
  "tier": 1,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "mon_my_monster_idle",
  "sprite": {
    "idle": "mon_my_monster_idle",
    "hit": "mon_my_monster_hit",
    "attack": "mon_my_monster_attack",
    "death": "mon_my_monster_death"
  },
  "stats": {
    "hp": 30,
    "attack": 3,
    "armor": 0,
    "attackIntervalLocks": 5
  },
  "intent": {
    "id": "intent_attack",
    "label": "Basic Attack",
    "description": "Deals damage."
  },
  "behaviors": ["basic_attack"],
  "resistances": [],
  "weaknesses": ["fire"],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 8,
    "goldMax": 18,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": ["early_game", "basic"],
  "enabled": true
}
```

3. Add the import and entry to `src/game/systems/ContentRegistry.ts`:
```typescript
import myMonster from '../content/monsters/my-monster.json';
// In constructor:
monsters: [...existing, myMonster],
```

4. Run validation: `npm run validate:content`

## How to Add a New Spell

1. Create a file: `src/game/content/spells/my-spell.json`

2. Use this template:
```json
{
  "id": "spl_my_spell",
  "name": "My Spell",
  "school": "fire",
  "rarity": "common",
  "description": "Does something magical.",
  "iconKey": "spell_my_spell",
  "effectKey": "effect_my_spell",
  "cost": {
    "mana": 30,
    "hp": 0,
    "gold": 0
  },
  "targetType": "enemy",
  "cooldownLocks": 0,
  "effects": [
    {
      "type": "damage_enemy",
      "value": 20
    }
  ],
  "upgradePath": [],
  "tags": ["damage", "fire"],
  "enabled": true
}
```

3. Add to ContentRegistry (see Monster section above)
4. Run validation: `npm run validate:content`

## How to Add a New Relic

1. Create a file: `src/game/content/relics/my-relic.json`

2. Use this template:
```json
{
  "id": "rel_my_relic",
  "name": "My Relic",
  "rarity": "uncommon",
  "description": "A powerful artifact.",
  "iconKey": "rel_my_relic",
  "trigger": "passive",
  "effects": [
    {
      "type": "increase_mana_gain",
      "value": 0.1
    }
  ],
  "stacking": {
    "stackable": false,
    "maxStacks": 1,
    "stackBehavior": "none"
  },
  "conflictsWith": [],
  "tags": ["utility"],
  "enabled": true
}
```

3. Add to ContentRegistry
4. Run validation: `npm run validate:content`

## How to Add a New Upgrade

1. Create a file: `src/game/content/upgrades/my-upgrade.json`

2. Use this template:
```json
{
  "id": "upg_my_upgrade",
  "name": "My Upgrade",
  "category": "board",
  "rarity": "common",
  "description": "Improves something.",
  "iconKey": "upg_my_upgrade",
  "appliesTo": {
    "contentType": "global",
    "ids": [],
    "tags": []
  },
  "effects": [
    {
      "type": "increase_line_damage",
      "value": 2
    }
  ],
  "maxLevel": 3,
  "levelScaling": {
    "mode": "linear",
    "valuePerLevel": 2
  },
  "tags": ["damage"],
  "enabled": true
}
```

3. Add to ContentRegistry
4. Run validation: `npm run validate:content`

## Loot Tables

Loot tables define what rewards are available in different scenarios. Each entry has:

- `contentType`: The type of content (upgrade, relic, gold, healing, etc.)
- `id`: The specific item ID
- `weight`: Relative probability (higher = more likely)
- `rarity`: The item's rarity level
- `amount`: For gold/healing items, the amount awarded
- `condition`: When this entry is available (optional)

Example entry:
```json
{
  "contentType": "upgrade",
  "id": "upg_sharp_edges",
  "weight": 15,
  "rarity": "common",
  "condition": "none"
}
```

## Difficulty Scaling

Each difficulty mode defines how enemies and the board scale as stages progress:

- `hpPerStage`: Enemy HP increase per stage
- `attackPerStage`: Enemy damage increase per stage
- `fallSpeedPerStage`: Block fall speed increase per stage
- `junkChancePerStage`: Probability of junk blocks spawning
- `goldPerStage`: Bonus gold reward increase per stage
- `rareChancePerStage`: Rare item drop rate increase per stage

## Validation

The content system includes automatic validation:

```bash
# Validate all content data
npm run validate:content

# Validate only metadata
npm run validate:metadata

# Run full build (includes validation)
npm run build
```

The validator checks:
- All JSON files parse correctly
- All content has `id`, `name`, and `enabled` fields
- ID prefixes match the content type folder
- No duplicate IDs across all content
- Required structure for each content type

## Accessing Content in Code

Use the `ContentRegistry` to access content at runtime:

```typescript
import { contentRegistry } from '../systems/ContentRegistry';

// Get a specific hero
const hero = contentRegistry.getHero('hero_blockmancer');

// List all enabled spells
const spells = contentRegistry.listEnabled('spell');

// Check if content exists
if (contentRegistry.has('monster', 'mon_dungeon_slime')) {
  // ...
}

// Get with fallback
const monster = contentRegistry.getMonster('mon_unknown') ?? contentRegistry.getMonster('mon_dungeon_slime');
```

## Best Practices

1. **Balance**: Keep numbers rough but playable. Tweak based on testing.
2. **Consistency**: Use the same effect types and patterns across similar content.
3. **Asset Keys**: Always use placeholder asset keys - they can be replaced later.
4. **Descriptions**: Keep descriptions short and clear for UI display.
5. **Tagging**: Use tags to organize content for filtering and grouping.
6. **Versioning**: Content metadata includes version info for future updates.

## Troubleshooting

**"Invalid JSON"**: Check for missing commas, quotes, or trailing commas in JSON.

**"Duplicate ID"**: Each content piece must have a unique ID. Check other files.

**"Unknown content type"**: Make sure the folder name is correct and the file is in the right directory.

**"Missing required fields"**: Ensure `id`, `name`, and `enabled` are present.
