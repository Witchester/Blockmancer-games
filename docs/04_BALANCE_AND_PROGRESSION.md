# Balance and Progression

## 1. Balance goal

The release version should support short runs that feel tense but fair. A good player should be able to recover from mistakes using spells, rewards, and board skill.

## 2. Target run length

| Platform | Target length |
|---|---:|
| Mobile casual run | 8–15 minutes |
| Standard web/PC run | 15–25 minutes |
| Boss/endless challenge | 25+ minutes |

## 3. Player baseline

| Stat | Value |
|---|---:|
| Max HP | 30 |
| Mana Max | 100 |
| Starting Gold | 50 |
| Base Line Damage | 5 |
| Base Fall Speed | 1.0 |

## 4. Mana economy

| Lines | Mana gain |
|---:|---:|
| 1 | 10 |
| 2 | 25 |
| 3 | 45 |
| 4 | 70 |

### Mana design rule

A player should usually cast:

```text
1 small spell every 2–4 line clears
1 emergency spell after strong clears or good setup
```

## 5. Spell cost target

| Spell type | Cost range |
|---|---:|
| Small damage | 20–35 |
| Control | 35–55 |
| Board rescue | 50–80 |
| Heal/shield | 40–70 |
| Ultimate/rare | 80–100 |

## 6. Enemy scaling

Default:

```json
{
  "hpPerStage": 8,
  "attackPerStage": 0.5,
  "fallSpeedPerStage": 0.05,
  "maxFallSpeed": 2.0
}
```

Recommended tuning:

| Stage | Enemy HP multiplier | Attack pressure | Board pressure |
|---:|---:|---|---|
| 1–2 | Low | Low | Low |
| 3–5 | Medium | Medium | Moderate junk |
| 6–8 | High | High | Faster attacks |
| 9 | Very high | High | Pre-boss stress |
| 10 | Boss | Boss patterns | Phase mechanics |

## 7. Reward economy

### Battle rewards

Normal fight should give one of:

```text
upgrade
small relic chance
gold
heal
```

### Elite rewards

Elite should be worth the risk:

```text
higher rare chance
more gold
stronger relic pool
```

### Boss rewards

Boss rewards should create excitement even if the run ends, by unlocking future content or meta progression.

## 8. Gold economy

| Source | Amount |
|---|---:|
| Normal fight | 8–35 |
| Elite fight | 35–60 |
| Treasure | 50+ |
| Boss | 100+ |
| Event | 20–60 |

Shop prices:

| Item | Price |
|---|---:|
| Heal 8 HP | 30 |
| Common upgrade | 45–60 |
| Uncommon upgrade | 70–90 |
| Common relic | 80–110 |
| Curse removal | 50–100 |

## 9. Difficulty curves

### Easy

Use for onboarding/accessibility.

```text
lower fall speed
lower enemy HP
higher gold
more heals
```

### Normal

Default intended experience.

### Hard

Unlocked after first boss victory.

```text
higher fall speed
more elite nodes
lower heal frequency
more curse events
```

## 10. Balance telemetry

Track these metrics during testing:

```text
run_start
run_end
stage_reached
death_reason
boss_defeated
enemy_killed
spell_cast
line_clear_count
combo_max
reward_selected
relic_owned
upgrade_owned
fall_speed_at_death
hp_at_room_start
hp_at_room_end
mana_wasted_at_cap
```

## 11. Common balance problems

| Problem | Sign | Fix |
|---|---|---|
| Too easy | Most players win first run | Increase enemy HP/attack or reduce reward strength. |
| Too hard | Players die before stage 3 | Reduce early fall speed and junk attacks. |
| Spells unused | Mana ends capped | Lower costs or make spells more visible. |
| Rewards boring | Same picks every run | Add build-specific synergies. |
| Board unfair | Death after random junk | Telegraph enemy attacks and limit junk stacking. |

## 12. Release balance target

A skilled new player should usually reach stage 5–7 on first run. A returning player should win within 3–8 runs depending on difficulty.

## 11. V2 act and stage progression

Release target: **30 stages across 5 acts**.

| Act | Stages | Expected pressure | Boss |
|---:|---|---|---|
| 1 | 1–6 | Teach combat, line damage, basic spells | Slime Baron |
| 2 | 7–12 | Junk management, economy pressure | Junkmaster Gob |
| 3 | 13–18 | Freeze, preview disruption, control counters | Cryo Lich |
| 4 | 19–24 | Armor, heavy blocks, locked columns | Stone Titan |
| 5 | 25–30 | Curses, void, speed, final mastery | Falling King |

### Stage pacing

```text
Stages 1–2: safe learning
Stage 3: first meaningful reward synergy
Stage 6: first boss
Stage 12: second boss / build check
Stage 18: control check
Stage 24: board management check
Stage 30: final boss
```

### Boss HP baseline

| Boss | HP baseline | Attack | Main pressure |
|---|---:|---:|---|
| Slime Baron | 120 | 6 | soft blocks / board flood |
| Junkmaster Gob | 180 | 8 | junk columns |
| Cryo Lich | 220 | 9 | freeze and preview blind |
| Stone Titan | 280 | 11 | armor and locked columns |
| Mirror Witch | 240 | 10 | spell copy and curse |
| Falling King | 360 | 14 | speed/junk/void collapse |

Boss values should be tuned after playtests. The goal is for each boss to test a different build weakness without requiring one exact counter.

## 12. Hero unlock progression

Unlock pacing should give the player a new toy after major achievements:

```text
Run 1: Blockmancer only
After first boss: Pyromancer
After Act 2 clear: Frostbinder
After line-clear achievement or Act 4: Gravity Knight
After curse/void achievement: Void Scholar
After bomb/junk achievement: Rune Engineer
```

Avoid making unlocks too grindy. Most players should unlock 3 heroes within the first 2–4 hours.
