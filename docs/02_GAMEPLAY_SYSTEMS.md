# Gameplay Systems Specification

## 1. Board system

### Board size

Recommended release default:

```text
10 columns x 20 rows
```

Optional variants can be used as room modifiers:

```text
9x18 compact room
10x18 mobile-friendly room
12x20 boss arena
```

### Pieces

Base pieces can start as familiar falling-block shapes, but the game should rename them as **Rune Pieces** and visually differentiate them.

Required piece families:

- Line Rune
- Square Rune
- Fork Rune
- Snake Rune
- Hook Rune
- Heavy Rune
- Broken Rune

### Core board actions

| Action | Desktop | Mobile |
|---|---|---|
| Move left | Left / A | Left button / swipe |
| Move right | Right / D | Right button / swipe |
| Rotate | Up / W | Rotate button / tap gesture |
| Soft drop | Down / S | Down/hold button |
| Hard drop | Space | Drop button |
| Cast spell | 1–4 | Spell buttons |

### Line clear output

Line clears produce:

1. Enemy damage
2. Mana
3. Combo progress
4. Relic/upgrade triggers
5. Event log feedback
6. Visual/audio feedback

## 2. Combat system

### Damage formula

```text
finalDamage = baseLineDamage + lineClearBonus + comboBonus + weaponBonus + upgradeBonus - enemyReduction
```

### Line clear bonus

| Lines cleared | Bonus damage | Mana gain |
|---:|---:|---:|
| 1 | 0 | 10 |
| 2 | 8 | 25 |
| 3 | 18 | 45 |
| 4 | 35 | 70 |

### Combo bonus

| Combo | Bonus |
|---:|---:|
| 1 | 0 |
| 2 | 3 |
| 3 | 7 |
| 4+ | 12 |

### Enemy attack timing

Enemies attack after a number of locked pieces. This is preferred over real-time timers for fairness and readability.

Example:

```text
Slime attacks every 5 piece locks.
Elite Knight attacks every 4 piece locks.
Boss attacks every 4 piece locks and may act again at phase thresholds.
```

## 3. Enemy intent system

Every enemy must display intent before acting.

Intent examples:

| Intent | Effect |
|---|---|
| Bounce Attack | Damage player. |
| Throw Junk | Damage player and add junk blocks. |
| Stone Guard | Damage player and reduce line damage. |
| Mana Hex | Increase spell costs temporarily. |
| Royal Collapse | Shake board, add junk, increase fall speed. |

## 4. Spell system

### Spell design rules

1. Each spell must have a clear tactical use.
2. Mana costs must create meaningful timing decisions.
3. Spells should support builds, not solve every problem.
4. Each school should have a recognizable role.

### Spell schools

| School | Role |
|---|---|
| Fire | Damage over time and burst damage. |
| Frost | Fall speed and enemy timing control. |
| Bomb | Board clearing and area damage. |
| Void | Row/column deletion and risky control. |
| Lightning | Combo scaling and chain damage. |
| Gravity | Hard drop, board manipulation, delay. |
| Healing | Survival and shield. |
| Arcane | Mana conversion and utility. |

## 5. Relic system

Relics are passive items that change the run. Release relics should avoid invisible effects. Every relic needs clear feedback when triggered.

Trigger types:

```text
passive
on_battle_start
on_piece_lock
on_line_clear
on_combo
on_spell_cast
on_enemy_attack
on_damage_taken
on_room_clear
on_low_hp
```

## 6. Upgrade system

Upgrades are run-based improvements, generally simpler than relics. They can stack and should support build direction.

Upgrade categories:

```text
line_damage
spell
mana
board
defense
economy
combo
weapon
hero
```

## 7. Board block system

Special blocks give the game its identity.

| Block | Role |
|---|---|
| Magic Block | Extra mana on clear. |
| Bomb Block | Explodes and damages enemy. |
| Stone Block | Heavy/hazard block. |
| Ice Block | Frost/control interaction. |
| Junk Block | Enemy-generated hazard. |
| Void Block | Clears nearby cell. |
| Curse Block | Bad effect if not cleared. |
| Gold Block | Gives gold when cleared. |

## 8. Status effect system

Status effects can apply to player, enemy, board, or active piece.

| Status | Target | Effect |
|---|---|---|
| Burn | Enemy | Damage over time. |
| Freeze | Enemy/board | Delay enemy or slow fall. |
| Stun | Enemy | Skip action. |
| Shield | Player | Absorb damage. |
| Mana Hex | Player | Spell costs increase. |
| Vulnerable | Enemy | Takes more damage. |
| Slow | Board | Reduced fall speed. |

## 9. Room systems

### Fight

Normal enemy, normal reward.

### Elite

Harder enemy, better reward, usually more gold.

### Event

Choice-driven room with risk/reward.

### Shop

Spend gold on heal, upgrade, relic, curse removal.

### Rest

Heal and reduce pressure.

### Treasure

Free reward or gold.

### Boss

Final test of build and board mastery.

## 10. Game feel requirements

Every important action needs:

1. Visual feedback
2. Sound feedback
3. Event log feedback
4. State change visibility

Examples:

- Line clear: flash row, hit enemy, sound, damage number.
- Spell: button pulse, mana spend, effect animation, log entry.
- Enemy attack: intent icon, screen shake, HP bar update, log entry.
- Reward: card animation, relic list update, confirmation sound.
