# Reactive Difficulty Runtime Audit

Updated: 2026-05-18

## Systems Already Present

- `BoardSystem`: Cascade Gravity, special board block cells, junk/royal/sticky/confetti block insertion, row/cluster cleanup, queue/hold helpers, and safe top-row clearing.
- `BattleScene`: active hazard warnings, compact warning tray, enemy behavior hooks, incoming junk queue, floating block warnings, freeze/preview/low-ceiling/bad-piece/speed/royal pressure, boss callbacks, item use, spell buttons, and save calls.
- `ItemSystem`: reactive item switch hooks for cleanup, incoming junk, preview/freeze/speed/low ceiling, safety net, spell catalysts, and now Priority 2 counter items.
- `SpellSystem`: runtime spells for Fireball, Frost Lock, Bomb Rune, and Void/Clean Cut, with next-spell catalyst support.
- `RelicSystem`: switch-based relic hooks, including star/cascade support through battle code.
- `HeroSystem` and `CombatSystem`: hero passives are applied at run start and through combat/battle hooks.
- `RouteStorySystem`: 36 route scenes, route choice resolution, route rewards, route risks, boss callbacks, endings, and route modifier persistence hooks.
- `DebugScene`: dev-only QA controls for battle setup, hazard forcing, reactive items, catalysts, route reward/risk, and hazard clearing.
- `SaveSystem`: versioned run/meta saves with migration and corrupt-save fallback.

## Existing Content IDs

- Hazard blocks: `block_floaty_rune`, `block_cloud_junk`, `block_crumb_junk`, `block_sticky`, `block_royal`, `block_ice`.
- Priority reactive items: `item_snack_vacuum`, `item_festival_mop`, `item_cloud_pin`, `item_snack_shield`, `item_return_stamp`, `item_preview_glasses`, `item_hot_cocoa`, `item_speed_brake`, `item_tent_pole`, `item_safety_net`.
- Additional counters added/verified: `item_balloon_pop`, `item_trash_lid`, `item_queue_comb`, `item_nope_stamp`, `item_alarm_cookie`, `item_royal_eraser`, `item_anchor_cookie`, `item_sky_hook`, `item_cleanup_coupon`.
- Spell catalysts: `item_firecracker_sugar`, `item_frosting_salt`, `item_bomb_fuse`, `item_star_syrup`, `item_cascade_confetti`, `item_spell_coupon`, `item_cleaning_charm`.
- Route content: six route-scene JSON files plus route endings under `src/game/content/story/routes/`.

## Supported Effects

- Incoming junk warning tray, countdown, cascade reduction, delayed/blocked/reflected/canceled by items, safe landing.
- Floating block warnings, visual overlay, Cloud Pin/Balloon Pop/Anchor Cookie/Sky Hook counters, safe expiry into cloud junk.
- Hazard windows for incoming junk, floaty rune, freeze, preview, low ceiling, bad piece, sleep, speed wave, and royal pattern.
- Spell catalysts modify the next compatible spell once; incompatible catalysts wait.
- Hero synergies: Milo bonus mana on first cascade, Pippa fire cleanup, Nixie one hazard mitigation, Bruk overflow rescue, Zuzu stronger bombs with warned crumb risk, Lumi star cascade junk reduction.
- Route rewards apply HP/mana/shield/gold/items/relics/upgrades/reactive modifiers, and risky route hazards enter the same warning tray.

## Switch-Limited Areas

- Spell runtime is still limited to four battle spell IDs; content spells outside `SPELLS` remain data-ready rather than fully playable.
- Relic behavior is switch-based; only existing relic IDs with hooks affect combat.
- Low ceiling currently resolves as safe top-row pressure rather than true dynamic board-height shrink during battle.
- Floating blocks are represented as active hazard markers over the board, not embedded persistent board cells.

## Files Changed In This Pass

- `src/game/types/GameTypes.ts`
- `src/game/data/constants.ts`
- `src/game/data/defaultRunState.ts`
- `src/game/systems/SaveSystem.ts`
- `src/game/systems/BoardSystem.ts`
- `src/game/systems/ItemSystem.ts`
- `src/game/systems/SpellSystem.ts`
- `src/game/systems/RouteStorySystem.ts`
- `src/game/scenes/BattleScene.ts`
- `src/game/scenes/DebugScene.ts`
- `src/game/content/items/*.json`
- `scripts/validate-content-data.mjs`

## Risky Areas

- Save migration: active hazards and route modifiers are persisted, but battle-only timers are normalized defensively.
- Board mutation: all hazard failure effects use safe insertion/cleanup helpers and avoid replacing Cascade Gravity.
- Mobile UI: the warning tray is compact and sits above the event log, but still needs a device smoke test for crowding with inventory expanded.
- Route risks: risky choices queue warning-window hazards where possible; if the tray is full, the risk waits/logs instead of stacking unfairly.
