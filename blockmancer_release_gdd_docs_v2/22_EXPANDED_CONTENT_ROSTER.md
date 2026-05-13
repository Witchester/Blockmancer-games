# Expanded Content Roster

## 1. Purpose

This document lists release-target content additions beyond the current MVP.

## 2. Heroes

| ID | Name | Role | Unlock |
|---|---|---|---|
| `hero_blockmancer` | Blockmancer | Balanced starter | Start unlocked |
| `hero_pyromancer` | Pyromancer | Fire damage | Defeat Slime Baron |
| `hero_frostbinder` | Frostbinder | Control/survival | Defeat Junkmaster Gob |
| `hero_gravity_knight` | Gravity Knight | Heavy drop/armor | Clear 100 lines or defeat Stone Titan |
| `hero_void_scholar` | Void Scholar | Void/curses | Reach Act 5 or accept 3 curses |
| `hero_rune_engineer` | Rune Engineer | Bombs/tools | Cast Bomb Rune 50 times |

## 3. Bosses

| ID | Name | Act | Mechanic |
|---|---|---:|---|
| `mon_boss_slime_baron` | Slime Baron | 1 | Slime flood |
| `mon_boss_junkmaster_gob` | Junkmaster Gob | 2 | Junk columns |
| `mon_boss_cryo_lich` | Cryo Lich | 3 | Freeze / preview blind |
| `mon_boss_stone_titan` | Stone Titan | 4 | Heavy blocks / locked columns |
| `mon_boss_mirror_witch` | Mirror Witch | 5 optional | Curses / spell copy |
| `mon_boss_falling_king` | The Falling King | 5 final | Speed / junk / void collapse |

## 4. Normal and elite monsters

### Act 1

```text
mon_dungeon_slime
mon_moss_slime
mon_cracked_bat
mon_rune_rat
mon_candle_wisp
mon_slime_barrel
```

### Act 2

```text
mon_dungeon_goblin
mon_scrap_goblin
mon_goblin_bomber
mon_coin_thief
mon_junk_totem
mon_goblin_shaman
```

### Act 3

```text
mon_crypt_bat
mon_ice_slime
mon_frost_witch
mon_snow_golem
mon_bone_mage
mon_crypt_guard
```

### Act 4

```text
mon_stone_golem
mon_gravity_imp
mon_ruin_sentinel
mon_orb_watcher
mon_heavy_knight
mon_falling_statue
```

### Act 5

```text
mon_dungeon_witch
mon_void_acolyte
mon_mirror_duelist
mon_cursed_knight
mon_royal_guard
mon_collapse_mage
```

### Elite monsters

```text
mon_elite_knight
mon_elite_scrap_brute
mon_elite_frost_guardian
mon_elite_gravity_sentinel
mon_elite_void_champion
```

## 5. New spells to support expanded acts

```text
spl_fireball
spl_frost_lock
spl_bomb_rune
spl_void_cut
spl_lightning_chain
spl_gravity_flip
spl_heal_glyph
spl_mana_burst
spl_burn_line
spl_ice_wall
spl_cleanse_curse
spl_stonebreaker_bolt
spl_rune_barrier
spl_scrap_magnet
spl_time_skip
spl_void_anchor
```

## 6. New board blocks

```text
block_red
block_blue
block_green
block_yellow
block_magic
block_bomb
block_stone
block_ice
block_junk
block_void
block_slime
block_scrap
block_frozen_junk
block_heavy_stone
block_cursed
block_rainbow_rune
```

## 7. Inventory and item categories

Release inventory should support:

```text
weapons
relics
upgrades
curses
consumables // optional
key items // optional story/unlock items
```

Battle view shows only a compact inventory strip. Full details are shown in pause/map/shop/reward screens.

## 8. Minimum release content counts

```text
Heroes: 5–6
Bosses: 5–6
Normal monsters: 30
Elite monsters: 5
Spells: 16
Weapons: 15
Relics: 35
Upgrades: 45
Events: 25
Curses: 12
Board block types: 16
Acts: 5
Stages: 30
```
