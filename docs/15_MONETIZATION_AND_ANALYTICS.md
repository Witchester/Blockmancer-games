# Monetization and Analytics

## 1. Recommended monetization

Best options for this game:

### Premium

One-time purchase. Best for Steam/PC and clean mobile release.

### Free demo + paid full version

Good for web/itch/Steam.

### Cosmetic-only IAP

Possible but not required.

### Avoid for first release

```text
energy systems
pay-to-win upgrades
random paid loot boxes
aggressive ads
forced interstitial ads during runs
```

## 2. Ethical mobile monetization

If using ads:

```text
rewarded ad only
never during battle
optional revive or bonus gold
clear disclosure
```

If using IAP:

```text
cosmetic skins
extra heroes as expansion content
supporter pack
soundtrack/art pack
```

## 3. Analytics goals

Use analytics only to improve the game, not to manipulate players.

Track:

```text
run_start
run_end
stage_reached
death_reason
spell_cast
reward_selected
hero_selected
monster_defeated
boss_defeated
shop_purchase
settings_changed
crash/error
```

## 4. Privacy

If any analytics or crash reporting is added:

```text
[ ] Add privacy policy
[ ] Disclose data collected
[ ] Avoid collecting personal data unless necessary
[ ] Provide opt-out if appropriate
```

## 5. Key product metrics

| Metric | Meaning |
|---|---|
| First-run stage reached | Onboarding difficulty. |
| Day-1 return | Fun/retention signal. |
| Average run length | Session fit. |
| Spell usage rate | Spell system clarity. |
| Reward pick distribution | Balance/build variety. |
| Death reasons | Difficulty fairness. |
| Boss win rate | Endgame tuning. |

## 6. Balance dashboard idea

For internal testing, a simple local debug export is enough:

```json
{
  "heroId": "hero_blockmancer",
  "stageReached": 7,
  "deathReason": "top_out",
  "maxCombo": 4,
  "spellsCast": {
    "spl_fireball": 5,
    "spl_bomb_rune": 2
  },
  "rewards": ["upg_line_sharp_edges", "rel_slime_core"]
}
```
