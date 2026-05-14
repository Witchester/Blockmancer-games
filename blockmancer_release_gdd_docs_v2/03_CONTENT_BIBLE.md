# Content Bible

## 1. Purpose

This document defines how game content should be written, named, balanced, and expanded.

## 2. ID rules

| Content type | Prefix    | Example                 |
| ------------ | --------- | ----------------------- |
| Hero         | `hero_`   | `hero_blockmancer`      |
| Weapon       | `wpn_`    | `wpn_basic_wand`        |
| Monster      | `mon_`    | `mon_dungeon_slime`     |
| Spell        | `spl_`    | `spl_fireball`          |
| Relic        | `rel_`    | `rel_slime_core`        |
| Upgrade      | `upg_`    | `upg_line_sharp_edges`  |
| Status       | `status_` | `status_burn`           |
| Block        | `block_`  | `block_magic`           |
| Event        | `evt_`    | `evt_shrine_of_gravity` |
| Curse        | `curse_`  | `curse_heavy_blocks`    |
| Loot Table   | `loot_`   | `loot_battle_default`   |
| Scaling      | `scale_`  | `scale_default_run`     |
| Map Node     | `node_`   | `node_fight`            |

## 3. Content quality bar

Every content entry should have:

```text
id
name
description
rarity or category
iconKey/spriteKey where relevant
effects
tags
enabled
```

## 4. Writing style

Use short, readable descriptions. Avoid vague text.

Good:

```text
Gain 10 mana when you take damage.
```

Bad:

```text
A mysterious force echoes through your soul.
```

Flavor can exist, but gameplay text must be clear.

## 5. Monster design rules

Each monster should have:

1. A readable intent.
2. One main behavior.
3. One optional secondary behavior after stage 5.
4. A weakness or counter.
5. A board-specific identity.

### Monster families

| Family | Gameplay identity                  |
| ------ | ---------------------------------- |
| Slime  | Basic attacks, forgiving.          |
| Goblin | Junk block pressure.               |
| Bat    | Preview/control disruption.        |
| Golem  | Armor and damage reduction.        |
| Witch  | Mana/spell disruption.             |
| Royal  | Boss mechanics and board collapse. |

## 6. Spell design rules

A spell must answer at least one of these needs:

```text
single-target damage
board rescue
mana efficiency
fall speed control
enemy delay
combo support
survival
```

Avoid spells that are purely better versions of another spell unless they are rare upgrades.

## 7. Relic design rules

Relics should create build direction. A good relic makes the player think:

```text
Now I want to play differently.
```

Examples:

- Combo Heart encourages combo play.
- Cracked Crown encourages risky high damage.
- Broken Hourglass supports low HP survival.
- Bomb Charm supports board explosion builds.

## 8. Upgrade design rules

Upgrades should be simpler than relics and can stack.

Good upgrade categories:

```text
+line damage
-spell cost
+mana gain
+spell damage
+max HP
-fall speed
+reward choices
```

## 9. Event design rules

Every event should offer at least two meaningful choices.

Recommended structure:

```text
safe choice
resource choice
risk/reward choice
leave choice where appropriate
```

## 10. Release content minimum

### Heroes

Minimum 3:

```text
Blockmancer — balanced starter
Pyromancer — damage/risk
Frostbinder — control/survival
```

### Bosses

Minimum 3:

```text
The Falling King — speed/junk/shake
The Mirror Witch — spell cost/status/curses
The Stone Titan — armor/heavy blocks/board lock
```

### Enemy count

Minimum 18 monsters:

```text
6 early-game
6 mid-game
3 elite
3 bosses
```

### Reward count

Minimum:

```text
30 relics
40 upgrades
16 spells
20 events
12 curses
```

## 11. Tag taxonomy

Use consistent tags:

```text
damage
mana
board_control
spell
combo
defense
economy
curse
risk_reward
early_game
mid_game
late_game
boss_reward
shop
mobile_friendly
```

## 12. Content review checklist

Before adding content to a release build:

```text
[ ] JSON validates
[ ] ID follows naming rules
[ ] Description is clear
[ ] Effect exists in systems
[ ] Icon/sprite key is valid or has fallback
[ ] Balance value is not extreme
[ ] Tags are consistent
[ ] Content appears in at least one loot table or unlock path
[ ] Tested in one run
```

## 13. Expanded release monster roster

The release version should have enough monster variety to make each act feel different. The minimum target is **30 normal/elite monsters + 6 bosses**.

### Act 1 — Cracked Dungeon

| ID                  | Name         | Role      | Main mechanic               |
| ------------------- | ------------ | --------- | --------------------------- |
| `mon_dungeon_slime` | Slime        | basic     | Simple attack               |
| `mon_moss_slime`    | Moss Slime   | sustain   | Heals small amount          |
| `mon_cracked_bat`   | Cracked Bat  | disruptor | Hides next block briefly    |
| `mon_rune_rat`      | Rune Rat     | speed     | Attacks quickly             |
| `mon_candle_wisp`   | Candle Wisp  | caster    | Applies burn                |
| `mon_slime_barrel`  | Slime Barrel | hazard    | Splits or spawns slime junk |

### Act 2 — Goblin Scrapworks

| ID                   | Name          | Role      | Main mechanic                       |
| -------------------- | ------------- | --------- | ----------------------------------- |
| `mon_dungeon_goblin` | Goblin        | disruptor | Throws junk                         |
| `mon_scrap_goblin`   | Scrap Goblin  | junk      | Adds metal junk blocks              |
| `mon_goblin_bomber`  | Goblin Bomber | burst     | Places bomb/junk mix                |
| `mon_coin_thief`     | Coin Thief    | economy   | Steals gold unless defeated quickly |
| `mon_junk_totem`     | Junk Totem    | summoner  | Periodic junk columns               |
| `mon_goblin_shaman`  | Goblin Shaman | caster    | Buffs junk durability               |

### Act 3 — Frost Crypt

| ID                | Name        | Role       | Main mechanic       |
| ----------------- | ----------- | ---------- | ------------------- |
| `mon_crypt_bat`   | Crypt Bat   | disruptor  | Preview blind       |
| `mon_ice_slime`   | Ice Slime   | control    | Slippery/ice blocks |
| `mon_frost_witch` | Frost Witch | caster     | Freeze / slow       |
| `mon_snow_golem`  | Snow Golem  | tank       | Armor + frozen junk |
| `mon_bone_mage`   | Bone Mage   | debuff     | Mana hex            |
| `mon_crypt_guard` | Crypt Guard | elite-lite | Column lock         |

### Act 4 — Gravity Ruins

| ID                   | Name           | Role      | Main mechanic             |
| -------------------- | -------------- | --------- | ------------------------- |
| `mon_stone_golem`    | Stone Golem    | tank      | Reduces line damage       |
| `mon_gravity_imp`    | Gravity Imp    | disruptor | Speed spikes              |
| `mon_ruin_sentinel`  | Ruin Sentinel  | armor     | Locks a column            |
| `mon_orb_watcher`    | Orb Watcher    | caster    | Alters next queue         |
| `mon_heavy_knight`   | Heavy Knight   | bruiser   | Heavy attacks after timer |
| `mon_falling_statue` | Falling Statue | hazard    | Drops stone blocks        |

### Act 5 — Royal Void Keep

| ID                   | Name           | Role         | Main mechanic            |
| -------------------- | -------------- | ------------ | ------------------------ |
| `mon_dungeon_witch`  | Witch          | caster       | Mana hex                 |
| `mon_void_acolyte`   | Void Acolyte   | void         | Deletes/warps cells      |
| `mon_mirror_duelist` | Mirror Duelist | counter      | Copies last spell effect |
| `mon_cursed_knight`  | Cursed Knight  | bruiser      | Applies curse pressure   |
| `mon_royal_guard`    | Royal Guard    | elite-lite   | Armor + junk             |
| `mon_collapse_mage`  | Collapse Mage  | boss-support | Increases fall speed     |

## 14. Boss design target

Each boss needs:

```text
intro text
unique intent set
phase threshold
board mechanic
counterplay
reward identity
story clue
```

| Boss           |        Act | Core mechanic                       | Counterplay                           |
| -------------- | ---------: | ----------------------------------- | ------------------------------------- |
| Slime Baron    |          1 | Floods board with soft slime blocks | Bombs, fast line clears               |
| Junkmaster Gob |          2 | Junk economy, scrap columns         | Void Cut, Bomb Rune, shop prep        |
| Cryo Lich      |          3 | Freezes blocks and hides next queue | Frost resistance, hold block planning |
| Stone Titan    |          4 | Armor, heavy blocks, locked columns | Stonebreaker, bomb/void builds        |
| Mirror Witch   | 5 optional | Copies spells and applies curses    | Low-cost spells, cleanse, timing      |
| Falling King   |      Final | Speed, junk, shake, void collapse   | Full build mastery                    |

## 15. Hero unlock and story requirements

Every hero content JSON should include:

```json
{
  "story": {
    "shortBio": "...",
    "motivation": "...",
    "relationshipToDungeon": "..."
  },
  "unlock": {
    "isUnlockedByDefault": false,
    "condition": "defeat_slime_baron",
    "description": "Defeat the Slime Baron once."
  }
}
```

Hero unlocks must be visible on the Hero Select screen even before the hero is unlocked.

## 16. Required additional content categories for release

Add or keep these categories in the content registry:

```text
bosses or boss-specific monster entries
acts/stages
font assets
ui-layout-presets
inventory-items
block-skins
story-events
unlock-achievements
```

`bosses` can be implemented as `monsters` with `rarity: boss`, but the docs and content registry should still support boss-specific fields such as `phases`, `bossMusicKey`, and `introText`.
