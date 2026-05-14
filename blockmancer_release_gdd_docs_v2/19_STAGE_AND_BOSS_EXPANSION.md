# Stage and Boss Expansion

## 1. Goal

Expand the MVP from a short proof-of-concept run into a release-ready roguelike structure with multiple acts, boss identities, and escalating board mechanics.

## 2. Release run structure

Release target: **5 acts, 30 stages**.

```text
Act 1: Cracked Dungeon       Stages 1–6
Act 2: Goblin Scrapworks     Stages 7–12
Act 3: Frost Crypt           Stages 13–18
Act 4: Gravity Ruins         Stages 19–24
Act 5: Royal Void Keep       Stages 25–30
```

## 3. Act structure

Each act should include:

```text
- 4–6 normal monsters
- 1–2 elite monsters
- 1 boss
- 3–5 event variants
- 1 act-specific board mechanic
- 1 act-specific visual theme
- 1 or more relics/upgrades that counter the act mechanic
```

## 4. Act 1 — Cracked Dungeon

Purpose: onboarding and basic combat mastery.

Mechanics:

```text
- Basic attacks
- Soft junk introduction
- Simple burn/frost status
- Low fall speed
```

Boss: `mon_boss_slime_baron`

Slime Baron mechanics:

```text
Phase 1: basic body slam
Phase 2: spawns slime blocks
Phase 3: floods lower board with soft junk
```

Counterplay:

```text
- Clear lines quickly
- Bomb Rune clears slime clusters
- Fireball applies burn
```

## 5. Act 2 — Goblin Scrapworks

Purpose: teach junk management and economy decisions.

Mechanics:

```text
- Junk blocks
- Scrap columns
- Gold steal/shop interaction
- Bomb block synergy
```

Boss: `mon_boss_junkmaster_gob`

Junkmaster Gob mechanics:

```text
Phase 1: throws junk blocks
Phase 2: adds scrap columns after timer
Phase 3: mixes bomb and junk blocks
```

Counterplay:

```text
- Bomb builds
- Void Cut
- Gold/shop preparation
- Stable Hands for slower fall speed
```

## 6. Act 3 — Frost Crypt

Purpose: test planning, next queue awareness, and control builds.

Mechanics:

```text
- Freeze blocks
- Hide next queue
- Slow/ice block behavior
- Mana hex variants
```

Boss: `mon_boss_cryo_lich`

Cryo Lich mechanics:

```text
Phase 1: slows pieces and delays rotation briefly
Phase 2: hides next queue intermittently
Phase 3: freezes random locked cells
```

Counterplay:

```text
- Hold block planning
- Fire spells
- Preview upgrades
- Clean board discipline
```

## 7. Act 4 — Gravity Ruins

Purpose: test advanced board control and heavy block management.

Mechanics:

```text
- Heavy stone blocks
- Locked columns
- Fall speed spikes
- Gravity-themed enemy attacks
```

Boss: `mon_boss_stone_titan`

Stone Titan mechanics:

```text
Phase 1: armor reduces line damage
Phase 2: drops heavy blocks
Phase 3: locks one column temporarily
```

Counterplay:

```text
- Stonebreaker upgrade
- Void spells
- Bomb Rune
- Heavy Drop builds
```

## 8. Act 5 — Royal Void Keep

Purpose: final mastery of all systems.

Mechanics:

```text
- Curses
- Void blocks
- Board shake
- High fall speed
- Spell cost manipulation
```

Optional boss: `mon_boss_mirror_witch`

Final boss: `mon_boss_falling_king`

Falling King mechanics:

```text
Phase 1: increases fall speed
Phase 2: spawns junk and shakes board
Phase 3: void collapse removes/warps cells and accelerates timer
```

Counterplay:

```text
- Balanced build
- Board rescue spells
- Mana efficiency
- Enemy intent timing
- Hold/next block mastery
```

## 9. Boss content JSON additions

Boss monster entries should include:

```json
{
  "boss": {
    "act": 1,
    "phaseThresholds": [0.66, 0.33],
    "introText": "The dungeon floor trembles with royal weight.",
    "defeatText": "The curse loses its grip.",
    "musicKey": "music_boss_falling_king",
    "phaseIntents": [
      "intent_attack",
      "intent_spawn_junk",
      "intent_void_collapse"
    ]
  }
}
```

## 10. Release boss list

| ID                        | Name             |        Act | Theme         | Main mechanic                |
| ------------------------- | ---------------- | ---------: | ------------- | ---------------------------- |
| `mon_boss_slime_baron`    | Slime Baron      |          1 | Dungeon       | Slime flood                  |
| `mon_boss_junkmaster_gob` | Junkmaster Gob   |          2 | Scrapworks    | Junk columns                 |
| `mon_boss_cryo_lich`      | Cryo Lich        |          3 | Frost Crypt   | Freeze / preview blind       |
| `mon_boss_stone_titan`    | Stone Titan      |          4 | Gravity Ruins | Armor / locked columns       |
| `mon_boss_mirror_witch`   | Mirror Witch     | 5 optional | Void Keep     | Spell copy / curses          |
| `mon_boss_falling_king`   | The Falling King |    5 final | Royal Void    | Speed / junk / void collapse |
