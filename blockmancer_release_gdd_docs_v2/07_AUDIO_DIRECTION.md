# Audio Direction

## 1. Audio goals

Audio should make board actions feel powerful and make combat readable without becoming noisy.

## 2. Music

Suggested tracks:

| Track               | Use                            |
| ------------------- | ------------------------------ |
| Main Theme          | Main menu / title.             |
| Dungeon Loop        | Normal battles/map.            |
| Elite Battle        | Elite fights.                  |
| Boss Theme          | Falling King and other bosses. |
| Victory Theme       | Run victory.                   |
| Defeat Theme        | Game over.                     |
| Shop/Event Ambience | Non-combat rooms.              |

## 3. SFX list

Required SFX:

```text
button_hover
button_click
piece_move
piece_rotate
piece_lock
soft_drop
hard_drop
line_clear_1
line_clear_2
line_clear_3
line_clear_4
combo_up
mana_gain
spell_fireball
spell_frost_lock
spell_bomb_rune
spell_void_cut
enemy_hit
enemy_attack
player_hit
reward_select
shop_buy
heal
boss_phase
game_over
victory
```

## 4. Audio mixing

Prioritize:

```text
1. gameplay feedback
2. spell clarity
3. enemy warning
4. music mood
```

Avoid overlapping too many SFX during multi-line clears. Use sound cooldowns or pitch variants.

## 5. Placeholder pipeline

MVP can use simple WebAudio beeps. Release should replace them with authored SFX.

Suggested pipeline:

```text
placeholder beep
-> temporary SFX pack with license
-> custom SFX pass
-> final mix pass
```

## 6. Settings

Required audio settings:

```text
master volume
music volume
SFX volume
mute toggle
```

## 7. Implementation notes

Use an `AudioSystem` wrapper so scenes do not directly hardcode audio keys. Example events:

```text
audio.play('line_clear_4')
audio.play('spell_fireball')
audio.playMusic('boss_theme')
```
