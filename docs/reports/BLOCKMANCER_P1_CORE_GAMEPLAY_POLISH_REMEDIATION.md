# Blockmancer P1 Core Gameplay Polish Remediation

## Scope Completed

This pass focused on Release 1 core gameplay behavior gaps, not asset production. Missing PNG/audio/VFX assets remain fallback-safe and were not treated as gameplay failures.

CodeGraph preflight was completed first with `codegraph index`, then CodeGraph context and impact were used for the requested systems before direct file inspection. Direct inspection was limited to the battle/runtime systems, focused content matrices, validation scripts, and smoke harness files identified by CodeGraph.

## Files Changed

- `src/game/scenes/BattleScene.ts`
- `src/game/systems/GameplayEffectSystem.ts`
- `src/game/systems/RandomGameplayEventSystem.ts`
- `src/game/systems/ChaosRuleSystem.ts`
- `src/game/systems/StageGoalSystem.ts`
- `src/game/systems/ShopSystem.ts`
- `src/game/types/GameTypes.ts`
- `tests/run-remediation-smoke.mjs`
- `docs/reports/BLOCKMANCER_P1_CORE_GAMEPLAY_POLISH_REMEDIATION.md`

## Behavior / Effect Matrices

### Enemy Behavior Coverage

| Behavior ID | Runtime Status After Pass | Runtime Hook |
|---|---|---|
| `basic_attack` | Implemented | Damage through `CombatSystem.applyEnemyAttack` |
| `spawn_junk` | Implemented | Warned incoming junk queue, Stage 2+ floaty block pressure |
| `incoming_junk_queue` | Fixed | Larger warned incoming junk queue, reduced immediate damage |
| `pattern_junk` | Implemented | Incoming junk plus `royal_pattern` warning |
| `royal_block_spawn` | Implemented | `royal_pattern` warning |
| `lock_random_column` | Fixed | Routed to `low_ceiling` warning instead of safe fallback bonk |
| `hide_next_piece` / `hide_next_block` | Implemented | `preview` warning |
| `hide_hold_block` | Implemented | `preview` warning |
| `mana_hex` / `mana_zap` | Implemented | Mana reduction and short spell-cost pressure |
| `shake_board` | Fixed | Board shake plus warned `bad_piece` delivery |
| `increase_fall_speed` | Implemented | `speed_wave` warning plus light junk pressure |
| `hydra_combo_check` | Implemented | Combo/Fever reward or block pressure |
| `armor_up` / `reduce_line_damage` | Implemented | Enemy shield plus temporary line damage mitigation |
| `shield_self` | Implemented | Enemy shield |
| `heal_self` | Implemented | Enemy heal |
| `freeze_piece` | Deepened | `freeze` warning now leaves an ice block on failure |
| `sleep_player` | Implemented | `sleep` warning |
| `swap_next_hold` | Implemented | `bad_piece` warning |
| `reverse_controls` | Safe runtime handler | Temporary reverse-control state remains existing behavior |

### Boss Runtime Checklist

| Boss | Runtime Effect |
|---|---|
| Cupcake Slime King | Sticky/sprinkle start, sticky phase 2, warned junk behavior |
| Prototype No. 7 | Junk/bomb start, board shake now warns bad-piece pressure, phase 2 bomb pressure |
| Gelato Golem | Ice start, freeze warnings now leave ice pressure, speed wave pressure |
| Sir Snore-a-Lot | Shield/soft block start, Sleepy warning, phase 2 shield/sleep pressure |
| High Score Hydra | Fever/combo start, combo check, low-combo punishment, phase 2 Fever pressure |
| King Bloxley | Royal block start, royal pattern warnings, `lock_random_column` now warns low-ceiling pressure |

### Event Effect Coverage

| Effect Type | Runtime Status After Pass |
|---|---|
| `add_junk_rows` | Fixed for battle events/chaos: routes through incoming junk queue when hooks are present |
| `speed_spike` / `increase_fall_speed` | Fixed for battle events/chaos: routes through `speed_wave` warning when hooks are present |
| `swap_next_hold` | Fixed for battle events/chaos: routes through `bad_piece` warning when hooks are present |
| `add_sticky_blocks`, `add_confetti_blocks`, `add_royal_blocks`, `add_special_blocks`, `clear_random_blocks` | Implemented existing board hooks |
| `gain_mana`, `heal_player`, `gain_fever`, `enemy_sleep`, `slow_fall_speed`, `stage_goal_progress` | Implemented existing state hooks |

### Stage Goal Coverage

| Goal | Runtime Status After Pass |
|---|---|
| Stage 1 lost cupcakes | Existing cascade tracking, boss consequence now applies after boss spawn |
| Stage 2 machines | Existing objective tracking, boss consequence now applies after boss spawn |
| Stage 3 crates | Existing objective tracking, boss consequence now applies after boss spawn |
| Stage 4 guards | Existing objective/sleep tracking, boss consequence now applies after boss spawn |
| Stage 5 combo score | Existing cascade tracking, boss consequence now applies after boss spawn |
| Stage 6 royal seals | Existing royal block tracking, boss consequence now applies after boss spawn |

## Features Fixed

- Enemy behavior IDs `incoming_junk_queue` and `lock_random_column` no longer fall through to generic safe bonks.
- `shake_board` now produces a readable hazard warning instead of only immediate extra damage.
- Hazard warnings now log their `warningText` when created, improving readability before danger resolves.
- Freeze failure now creates a real ice block pressure point instead of only nudging fall speed.
- Low-ceiling failure now clears breathing room and queues warned cloud junk, preserving fairness without becoming purely beneficial.
- Speed-wave failure now affects enemy countdown pressure as well as fall speed.
- Stage-goal boss consequences now apply after the boss exists and are guarded by `bossEffectApplied` to prevent duplicate application after scene reload/save-load.
- Battle random events and chaos rules can now route junk/speed/queue-disruption effects through warning-window hooks.
- Shop item purchases now spend gold only after an item reward is actually selected.

## Intentionally De-scoped

- No final assets, audio, VFX, portraits, or boss arena art were imported.
- No new economy system was created.
- No new boss intro scene or UI redesign was created.
- Hub progression and friendship progression were not touched.
- No save-facing IDs were renamed.
- No save migration version bump was added; `bossEffectApplied` is optional and defaults safely when absent.

## Remaining Known Limitations

- Manual gameplay smoke is still required for portrait-mobile readability and live boss pacing.
- `reverse_controls` remains a direct runtime state rather than a full warning-window hazard.
- Low ceiling remains a safe pressure mechanic rather than true dynamic board-height shrink.
- Relic and weapon identity were audited through existing hooks, but this pass prioritized behavior, boss, hazard, stage-goal, event, and shop gaps.
- Asset validation still reports fallback-safe missing production assets; those are out of scope for this gameplay remedy.

## Content IDs Disabled Or Marked Fallback

None. No content IDs were disabled, renamed, or marked fallback.

## Save Migration Changes

No migration version change. `StageGoalProgress.bossEffectApplied` was added as an optional guard field; old saves load with the field absent and apply the boss consequence once when eligible.

## Manual Smoke Checklist

1. Fight `mon_elite_crumb_goblin_foreman` and verify `incoming_junk_queue` creates a visible incoming junk warning.
2. Fight `mon_elite_royal_block_guard_captain` or King Bloxley and verify `lock_random_column` creates a low-ceiling warning.
3. Trigger Prototype No. 7 or Button Masher and verify board shake logs a warned weird delivery.
4. Trigger Gelato Golem freeze and let it resolve; verify an ice block appears without soft-lock.
5. Enter a boss after completing or missing a stage goal; reload the battle and verify the boss modifier does not duplicate.
6. Trigger battle random events or chaos rules with speed/junk effects and verify warnings appear before danger resolves.
7. Fill inventory, enter shop, and verify item purchase reports bag-full without spending gold.

## Validation Results

| Command | Result |
|---|---|
| `codegraph index` | Pass; index completed before inspection |
| `npm run validate:content` | Missing npm script |
| `npm run validate:metadata` | Missing npm script |
| `npm run validate:animations` | Missing npm script |
| `npm run lint` | Missing npm script |
| `node scripts/validate-content-data.mjs` | Pass; 388 JSON files, 36 route scenes |
| `node scripts/validate-content-metadata.mjs` | Pass |
| `node scripts/validate-animations.mjs` | Pass with non-fatal missing PNG/sheet warnings |
| `npm run validate:ui-layouts` | Pass; 17 layout specs |
| `npm run sync:assets` | Pass; fallback-safe missing production assets reported |
| `npm run audit:asset-variants` | Pass with 32 asset variant warnings |
| `npm run test` | Pass; remediation smoke passed |
| `node tests/boss-stage-goals-smoke.mjs` | Pass; 18/18 static checks |
| `npm run build` | Pass; TypeScript and Vite production build completed |

## Recommended Next Order

1. Run manual boss/hazard smoke in the browser for the six Release 1 bosses.
2. Add deeper automated runtime tests for hazard countdown resolution and stage-goal save/load duplication.
3. Continue P1 polish on relic and weapon identity with the same matrix approach.
4. Add npm aliases for existing content/metadata/animation validation scripts if project policy wants the documented command names to work.
5. After gameplay is stable, move to final art/audio production without downgrading fallback-safe gameplay systems.
