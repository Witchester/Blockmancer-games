# Blockmancer Feature Implementation Audit

## 1. Audit Scope

This audit checks feature implementation status only. It intentionally ignores asset production gaps when judging gameplay/system implementation. If code, content, save state, scene flow, and runtime fallback behavior are present but final PNG/audio/VFX/portrait/UI production assets are missing, the feature is marked **Asset Missing** instead of **Partly Implemented**.

Docs, plans, and prompts were treated as expected behavior only. Implementation evidence came from TypeScript runtime code, JSON content loaded by `ContentRegistry`, save migrations/default state, scene flow, validation/build scripts, and build/runtime references.

## 2. Method

- Ran `codegraph index` first. Result: indexed 181 files during the CLI run; CodeGraph status then reported 210 indexed files, 3,674 nodes, 10,194 edges.
- Used CodeGraph context for board/combat, progression/rewards, route/save/UI/tooling, and reactive difficulty areas before direct file inspection.
- Used CodeGraph impact for `BoardSystem`, `CombatSystem`, `EnemySystem`, `BossSystem`, `MapSystem`, `RewardSystem`, `RouteStorySystem`, `SaveSystem`, `ItemSystem`, `InventorySystem`, `StageGoalSystem`, `FeverSystem`, `RandomGameplayEventSystem`, `AssetSystem`, `SettingsSystem`, and `AudioSystem`.
- Used CodeGraph exploration once for core systems and scene wiring, then direct inspection was limited to files identified by CodeGraph and focused content counts.
- No code fixes or asset creation were performed.
- The only written artifact is this audit report.

## 3. Executive Summary

- Implemented: 45
- Asset Missing: 1
- Partly Implemented: 17
- Not Implemented: 0

The repo is structurally broad and buildable. Core board play, Cascade Gravity, combat, route story, save migration, map flow, node result, encounter packs, level-up flow, asset fallbacks, mobile controls, and many reactive counter mechanics are implemented. Remaining implementation risk is concentrated in shallow/switch-limited effect depth, boss distinctiveness, dynamic hazard fidelity, hub/friendship depth, and package-script/test coverage. Final art/audio remains a production gap, not a gameplay implementation blocker.

## 4. Feature Status Matrix

| Feature | Status | Evidence | Reason | Gap / Asset Note | Next Action | Confidence |
|---|---|---|---|---|---|---|
| Core falling-block board | Implemented | `src/game/systems/BoardSystem.ts`; `BattleScene.renderBoard`, `syncBoardState` | Board grid, active piece, spawn, collision, lock, render, and save sync exist. |  | Add deterministic board smoke tests. | High |
| Cascade Gravity | Implemented | `CascadeGravitySystem.resolveCascadeGravity`; `BoardSystem.clearLinesCascade`; `CombatSystem.resolveCascadeClear` | Completed lines are removed, per-column gravity resolves repeatedly, and combat consumes cascade results. |  | Protect with tests for special blocks and chained clears. | High |
| Piece movement, rotation, hard drop, soft drop, lock delay | Implemented | `BoardSystem.move/rotate/tick/hardDrop`; `InputSystem`; `BattleScene.moveHorizontal/softDrop/hardDrop/tryResetLockDelay` | Keyboard/touch input and board mechanics are wired into battle flow. |  | Add input/lock-delay smoke cases. | High |
| Hold block | Implemented | `BoardSystem.hold`; `BattleScene.handleHold`; `BattlePuzzleSectionUi.updateHoldPiece` | Hold state, once-per-piece guard, UI update, and save sync exist. |  | Add save/reload hold-state test. | High |
| Next queue | Implemented | `BoardSystem.refillNextQueue/getNextQueueTypes`; `BattlePuzzleSectionUi.updateNextQueue` | Queue is persisted and rendered with multiple upcoming pieces. |  | Add queue determinism test if seeded play is needed. | High |
| Board special blocks | Implemented | `BoardSystem.createBoardBlockCell/addSpecialBlocks/handleSpecialBlockClear`; `src/game/content/board-blocks` | Content-backed block IDs and clear effects are recognized at runtime. |  | Expand tests for each special clear effect. | High |
| Combat loop | Implemented | `BattleScene.resolveLockedPiece/resolveEnemyAttack/handleVictory`; `CombatSystem` | Lock -> cascade -> damage/mana -> enemy countdown/attack -> victory flow is connected. |  | Add end-to-end combat smoke. | High |
| Damage from line clears/cascades | Implemented | `CombatSystem.resolveCascadeClear`, `getCascadeMultiplier`, `damageEnemy` | Damage uses line count, combo, cascade multiplier, mitigation, fever, weapon bonuses. |  | Balance pass after smoke tests. | High |
| Mana and spell casting | Implemented | `CombatSystem.resolveCascadeClear`; `SpellSystem.cast/getCost`; `BattleScene.tryCast` | Mana gain/cost, spell buttons, spell effects, and cast logs are runtime connected. |  | Audit spell roster coverage against content names. | High |
| Hero HP/MP/shield/status | Implemented | `GameTypes.RunState.player`; `CombatSystem.applyEnemyAttack/addPlayerShield`; `BattleCombatHud` | HP, mana, shield, and combat HUD updates exist. |  | Add status-effect regression tests. | High |
| Enemy HP/intent/attack countdown | Implemented | `EnemySystem.spawnEnemy`; `CombatSystem.countDownEnemyAttack/resetEnemyCounter`; `BattleScene.renderCombatUi` | Enemy stats, intent labels, counters, attacks, and HP resolution are connected. |  | Smoke all behavior classes. | High |
| Enemy system and monster behaviors | Partly Implemented | `EnemySystem`; `BattleScene.resolveEnemyAttack`; `src/game/content/monsters` | Monster spawning and behavior IDs work, but actual behavior execution is switch-limited and not every content intent has a distinct handler. | Add behavior handlers/tests for every monster behavior ID. | Build behavior coverage matrix from monster content. | High |
| Boss system and boss rule mechanics | Partly Implemented | `BossSystem`; `BossRuleCardScene`; `BossRuleSystem`; boss JSON | Boss intro, phase two, start mechanics, rule card flow, and rewards exist, but mechanics are relatively shallow and fallback-safe. | Make each boss rule mechanically distinct and tested. | Prioritize six boss smoke tests. | High |
| Stage system | Implemented | `StageSystem`; `src/game/content/stages`; `MapSystem.createMap` | Stage lookup and stage content are connected to map/combat/background flow. |  | Add stage progression smoke. | High |
| Roguelike map generation and node types | Implemented | `MapSystem.generateStageMap/createNode`; `MapScene`; `map-nodes` content | Normal, elite, event, shop, rest, treasure, boss, mini-boss/royal guard node types exist and render. |  | Add deterministic map structure tests. | High |
| Stage node structure and stage length rules | Implemented | `MapSystem.STAGE_MAP_STRUCTURES` | Stage 1-6 main path and total node min/max rules are encoded. |  | Test generated counts over many seeds. | High |
| Elite monster nodes | Implemented | `MapSystem` elite placement; `EnemySystem.getCandidates`; monster content | Stage 2+ elite nodes and elite monster pools are supported. |  | Smoke elite encounter selection. | High |
| Sequential encounter packs / multi-enemy node flow | Implemented | `EncounterPackSystem`; `BattleScene.handleVictory`; `NodeEncounterPack` save fields | 1-3 enemy packs, current index, chaining, node-only rewards/XP, and save migration exist. |  | Manual pack smoke and pack ID collision audit. | High |
| Monster stack preview UI | Implemented | `MonsterStackPreview`; `BattleScene.createBattleCombatUi/updateBattleCombatHud` | Multi-enemy stack preview updates from active encounter pack. |  | Device screenshot smoke. | High |
| Enemy entry reset/grace/effects | Implemented | `EncounterPackSystem.spawnEncounterEnemy/applyEnemyEntryEffect`; `BattleScene.applyEntryEffectsForEnemy` | New enemies reset counters with grace and can apply pressure/gift entry effects. |  | Test each entry effect from difficulty-scaling content. | High |
| Node clear reward gating | Implemented | `EncounterPackSystem.rewardsGrantedOnlyOnNodeClear`; `BattleScene.handleVictory`; `RewardFlowRouter` | Rewards and XP are deferred until full encounter pack/node clear. |  | Add duplicate-claim test. | High |
| Node Result Screen with EXP gained and EXP remaining | Implemented | `NodeResultScene`; `NodeResultDataAdapter`; `EncounterPackSystem.buildNodeResultSummary` | EXP gained, breakdown, before/after meter, remaining EXP, and continue flow exist. |  | Smoke save/reload at result screen. | High |
| Festival Level-Up system | Implemented | `LevelUpSystem`; `LevelUpRewardScene`; `LevelUpFlowRouter`; level-up save fields | XP thresholds, pending level-ups, persisted offers, choices, reroll, and upgrade application flow exist. |  | Balance offer pacing and reroll economy. | High |
| General upgrades | Partly Implemented | `UpgradeSystem.applyUpgrade/applyLevelUpUpgrade`; `src/game/content/upgrades` | Legacy upgrades have concrete handlers; many level-up upgrades are stored and referenced by other systems but `applyLevelUpUpgrade` often returns generic text. | Prove each upgrade has runtime effect, not only stack storage. | Add upgrade effect coverage tests. | High |
| Hero-specific upgrades | Partly Implemented | `LevelUpSystem.canOfferUpgrade`; `UpgradeSystem`; `BattleScene` hero upgrade hooks | Hero-specific filtering and many hooks exist, but coverage is distributed and several cards rely on generic stack-side effects. | Complete handler documentation/tests for each hero upgrade. | Start with one full hero upgrade smoke per hero. | Medium |
| Reward system | Implemented | `RewardSystem`; `RewardScene`; loot tables | Loot tables, reward pools, rerolls, apply handlers, and post-battle effects are connected. |  | Balance reward weights. | High |
| Items and inventory | Implemented | `InventorySystem`; `ItemSystem.applyItem`; `BattleScene.useInventoryItem` | Inventory capacity/count and item use are wired into battle and rewards. |  | Add inventory full/save tests. | High |
| Reactive counter items | Implemented | `ItemSystem.applyItem`; item content IDs such as `item_snack_shield`, `item_return_stamp`, `item_hot_cocoa` | Counter effects clear/delay/reflect incoming junk, reveal preview, counter freeze/speed/low ceiling, and arm safety net. |  | Smoke each required counter item. | High |
| Spell catalyst items | Implemented | `ItemSystem.createSpellModifier`; `SpellSystem.cast/applySharedSpellModifiers`; catalyst item content | Before-spell modifiers are stored, compatibility checked, consumed once, and affect spell cost/effects. |  | Add incompatible-catalyst persistence test. | High |
| Relics | Partly Implemented | `RelicSystem`; relic content | 15 relic IDs have switch handlers, but behavior is shallow and mostly immediate/two hook points. | Add richer combat/map hooks or mark simple relics as intentional. | Test each relic against expected effect. | High |
| Weapons | Partly Implemented | `WeaponSystem`; weapon content | Weapon stats and several battle hooks exist, but aliases and limited hook coverage mean some content is light. | Finish per-weapon identity coverage. | Add weapon behavior matrix. | Medium |
| Oopsies / silly drawbacks | Implemented | `OopsieSystem`; `ShopSystem.removeOopsie`; route risks | Oopsies can be added/removed, saved, and affect fall speed, mana, shop prices, piece pool, preview, sticky/confetti, and spell HP cost. |  | Tone-clean legacy alias text where visible. | High |
| Reactive difficulty hazards | Partly Implemented | `BattleScene.startHazardWarning/resolveHazard`; `ItemSystem`; `RouteStorySystem.queueRiskHazard` | Hazard framework is broad, but some hazards resolve as safe/simple pressure rather than full mechanics. | Increase fidelity and add soft-lock tests. | Prioritize freeze/speed/low-ceiling/royal smoke. | High |
| Incoming junk queue | Implemented | `BattleScene.queueIncomingJunk/reduceIncomingJunk/resolveIncomingJunkCountdown/dropIncomingJunk`; `ItemSystem` | Queue entries, warning tray sync, cascade reduction, delay/block/reflect, and safe landing exist. |  | Add deterministic queue tests. | High |
| Floating blocks | Partly Implemented | `BoardSystem.spawnFloatingBlock/expireFloatingBlocks`; `BattleScene.dropFloatingBlock`; `ItemSystem` | Floaters exist as active hazard markers and expire safely, but are not embedded persistent board cells as originally designed. | Convert to board-cell state only if gameplay needs it. | Smoke current marker-based design. | High |
| Freeze / speed wave / preview disruption / low ceiling / royal pattern hazards | Partly Implemented | `BattleScene.resolveEnemyAttack/startHazardWarning/resolveHazard`; `ItemSystem` | Warnings and effects exist, but low ceiling is safe top-row pressure and several effects are shallow timers/parameter changes. | Deepen mechanics and test counters. | Implement/verify one hazard family at a time. | High |
| Hazard warning UI and counter windows | Implemented | `BattleScene.renderHazardTray`; `HAZARD_WINDOWS`; `ItemSystem` | Active hazards carry names, counters, remaining pieces, hints, and render in battle. |  | Portrait device screenshot smoke. | High |
| Stage goals | Partly Implemented | `StageGoalSystem`; `MapScene.getStageGoalSummary`; stage-goal content | Goals track selected progress and boss start consequences, but target coverage is explicit and limited. | Verify each stage goal can be completed naturally. | Add stage goal smoke per stage. | Medium |
| Battle objectives | Implemented | `BattleObjectiveSystem`; battle-objective content | Objectives roll, track hold/spells/cascades/junk/height/fever, evaluate victory, and grant rewards. |  | Add deterministic objective tests. | High |
| Random gameplay events | Partly Implemented | `RandomGameplayEventSystem`; `GameplayEffectSystem`; random-event content | Events roll and apply generic effects, but content effect coverage must be verified and is generic/switch-based. | Add handler coverage for each event effect. | Build event effect matrix. | Medium |
| Room events | Partly Implemented | `EventSystem`; `EventScene`; room-event content | Event rooms, choices, costs, rewards, and simple effects exist, but effect handling is switch-limited. | Add richer typed handlers and tests. | Smoke all event choice branches. | High |
| Shop system | Partly Implemented | `ShopSystem`; `ShopScene`; loot tables | Shop can heal, buy random reward/item, remove oopsie, and leave, but SOT shop item variety/economy is not fully exposed. | Expand shop catalog/actions if Release 1 requires them. | Add shop inventory/economy smoke. | High |
| Fever system | Implemented | `FeverSystem`; `CombatSystem.resolveCascadeClear`; `BattleScene.advanceStatusTimers`; Hydra hooks | Fever gain, auto-trigger, active locks, damage/mana bonuses, UI hooks, and Hydra interaction exist. |  | Balance Stage 5 tuning. | High |
| Hero selection and unlocks | Implemented | `HeroSelectScene`; `HeroSystem`; `MetaSystem.checkUnlockConditions` | Hero selection applies run stats/passives and meta unlock rules persist. |  | Verify 6 route heroes plus extra heroes behavior. | High |
| Route story system | Implemented | `RouteStorySystem`; 36 route scenes/108 choices/18 endings | Route content loading, validation, progress, rewards, risks, modifiers, callbacks, and endings exist. |  | Full route smoke for one hero, then spot-check all. | High |
| Route triggers | Implemented | `RouteStorySystem.shouldTriggerRouteScene`; `MapScene.startRouteSceneIfNeeded`; battle fallback flow | Event-node and post-combat route trigger paths are present and once-per-scene guarded. |  | Smoke trigger timing across skipped event nodes. | High |
| Route dialogue UI | Implemented | `RouteDialogueScene`; `DialogueSystem`; route UI adapters | Pre-choice dialogue, choices, resolution, skip/continue, portraits, and fallback assets exist. |  | Mobile text-fit screenshots. | High |
| Route choices: Practical / True / Risky | Implemented | `RouteStorySystem.resolveRouteChoice`; route JSON | Three lanes update scores/flags, apply rewards, and risky effects. |  | Validate each scene has one true flag; current content count supports this. | High |
| Route rewards and risks | Implemented | `RouteStorySystem.applyRouteReward/applyRouteRisk`; `ItemSystem`; `RewardSystem` | Gold/heal/mana/shield/items/relics/upgrades/modifiers and warned risks are wired with safe skips. |  | Test unsupported reward fallback logs. | High |
| Boss callbacks | Implemented | `RouteStorySystem.getBossCallback/applyBossCallbackModifier`; `BattleScene.create` | Callback text/modifiers apply based on chosen lane before boss. |  | Smoke all six Stage 6 callbacks. | High |
| Route endings | Implemented | `RouteStorySystem.resolveHeroEnding/recordEndingUnlock`; `NodeResultScene.finishFinalBossVictory`; `VictoryScene` | Normal/true/variant ending resolution and meta unlocks exist. |  | Add ending threshold tests. | High |
| Save/load and migrations | Implemented | `SaveSystem.migrateRun/migrateMeta`; `defaultRunState`; `BlockmancerGame.loadRun/saveRun` | Versioned save/migration covers route, reactive, level-up, encounter-pack, meta, corrupt fallback. |  | Add migration fixtures for older saves. | High |
| Meta progression | Implemented | `MetaSystem`; `SaveSystem.saveMeta/loadMeta` | Bosses, endings, route endings, hero unlocks, gold/cascades, hub/friendship fields persist. |  | Add meta regression tests. | High |
| Tutorial | Implemented | `TutorialSystem`; `TutorialScene`; `SettingsScene` reset | 11 lessons, progress save, skip, completion, and tutorial reset exist. |  | Verify first-run entry path if required. | High |
| Settings/accessibility | Implemented | `SettingsSystem`; `SettingsScene`; `BattleScene` settings uses | Volume, vibration, screen shake, reduced flashing, colorblind symbols, left-handed controls, button size, show grid, text speed persist and drive battle UI. |  | Device smoke all accessibility toggles. | High |
| Audio system | Asset Missing | `AudioSystem`; `AssetSystem.preload`; `sync:assets` result | Runtime cues, mute/volume, file playback, and synthesized fallback exist. Final audio files are the remaining production issue. | Missing primary audio/production assets are fallback-safe; `sync:assets` reports 2,250 fallback-safe missing production assets overall. | Add final OGG/SFX assets or approve synth fallback as style. | High |
| Asset system fallback behavior | Implemented | `AssetSystem.ensureFallbackTextures/resolveAssetKey/getTextureKey`; `sync-assets.mjs` | Missing textures/audio fall back safely; build does not require final assets. |  | Keep asset sync in CI once script aliases are fixed. | High |
| Portrait-mobile layout implementation | Implemented | `BlockmancerGame` 720x1280 config; `layout.ts`; `BattleScreenShell`; `MapScene` layouts | Portrait canvas, responsive sections, layout validators, and mobile UI coordinates are implemented. |  | Run Playwright/device screenshots. | High |
| Mobile controls | Implemented | `MobileControls`; `BattleScene.createMobileControls`; battle control UI adapter | Touch rows for movement, hold, hard/soft drop, spells, bag, and settings exist with repeat handling. |  | Smoke left-handed/large button variants. | High |
| Build/validation scripts | Partly Implemented | `scripts/validate-*.mjs`, `scripts/sync-assets.mjs`, `package.json` | Validation script files exist, but requested npm aliases `validate:content`, `validate:metadata`, and `validate:animations` are missing from `package.json`. | Add package aliases to call existing scripts. | Fix npm script names, then rerun validations. | High |
| Test/lint/smoke harness availability | Partly Implemented | `package.json` `test`; `tests/run-remediation-smoke.mjs`; no `lint` script | Smoke harness exists through `npm run test`; lint script is absent and coverage is not broad enough for all systems. | Add lint and focused regression tests for board/save/routes/effects. | Expand tests before feature expansion. | High |
| Hub progression | Partly Implemented | `HubProgressionSystem`; `HubScene`; hub-building content; meta fields | Buildings, costs, levels, summary, and a few effects exist, but hub effects are sparse. | Decide Release 1 scope and wire building effects to gameplay. | Implement useful building bonuses or move to backlog. | Medium |
| Friendship system | Partly Implemented | `FriendshipSystem`; friendship content; `MetaSystem.addFriendship` | Points, methods, summary, and meta storage exist, but helper rewards are not meaningfully applied to gameplay. | Wire friendship rewards into run start/battle/events. | Treat as post-release unless needed for Release 1. | Medium |

## 5. Implemented Features

### Core gameplay

- Falling-block board, Cascade Gravity, movement/rotation/drops/lock delay, hold, next queue, special blocks, incoming junk queue, battle objectives, fever, and mobile controls are runtime implemented.
- Evidence: `BoardSystem`, `CascadeGravitySystem`, `InputSystem`, `BattleScene`, `BattleObjectiveSystem`, `FeverSystem`, `MobileControls`.

### Combat

- Combat loop, cascade damage, mana gain, spell casting, hero/enemy stats, enemy intent/counters, encounter packs, enemy entry effects, node-clear gating, and monster stack preview are implemented.
- Evidence: `CombatSystem`, `SpellSystem`, `EnemySystem`, `EncounterPackSystem`, `BattleScene`, `MonsterStackPreview`.

### Progression

- Roguelike map, stage structure, elite nodes, reward flow, node result, Festival Level-Up, hero unlocks, meta progression, save/load, tutorial, and settings are implemented.
- Evidence: `MapSystem`, `RewardSystem`, `NodeResultScene`, `LevelUpSystem`, `HeroSelectScene`, `MetaSystem`, `SaveSystem`, `TutorialScene`, `SettingsScene`.

### Content/data

- Content is broad and loaded through `ContentRegistry`: 54 monsters, 37 items, 23 spells, 16 relics, 52 upgrades, 21 random events, 12 room events, 7 stages, 7 stage goals, 7 boss rules, and 58 loot-table entries were found in focused content counts.

### Story/routes

- Route story runtime is implemented: 36 scenes, 108 choices, 18 endings, triggers, dialogue UI, rewards, risks, boss callbacks, route progress save/migration, and ending unlocks.
- Evidence: `RouteStorySystem`, `RouteDialogueScene`, route JSON under `src/game/content/story/routes/`, `NodeResultScene`, `VictoryScene`.

### Save/meta

- Run and meta saves are versioned and migrated. Current migration covers route progress, reactive state, level-up state, and encounter-pack state.
- Evidence: `SaveSystem.migrateRun/migrateMeta`, `defaultRunState`, `MetaSystem`.

### UI/mobile

- Portrait battle/map/settings/tutorial/route/node-result/level-up layouts exist, with mobile controls, colorblind symbols, grid toggle, reduced flashing, screen shake/vibration toggles, and left-handed controls.

### Validation/tooling

- `npm run build` passes.
- `npm run sync:assets` passes and reports fallback-safe missing production assets.
- Validation script files exist in `scripts/`, but required npm aliases are missing.

## 6. Asset Missing But Otherwise Implemented

- Audio system: `AudioSystem` implements cue playback, settings volume/mute behavior, file-backed playback, and synthesized fallback. `sync:assets` reports missing production assets covered by fallback, so the feature runs but final audio production is missing.

## 7. Partly Implemented Features

- Enemy behaviors: spawning/content integration is real, but behavior execution is switch-limited in `BattleScene.resolveEnemyAttack`.
- Boss mechanics: rule cards, starts, phase two, and rewards exist, but mechanics remain shallow for a six-boss release.
- General and hero-specific upgrades: offer/persistence flow works, but many level-up effects are stack markers consumed by scattered hooks or generic messages.
- Relics and weapons: all core structures exist, but gameplay depth is limited to explicit cases and a small number of hooks.
- Reactive hazards: framework is strong, but floating blocks are hazard markers rather than board-cell state, low ceiling is safe top-row pressure, and several hazards are simple timer/effect changes.
- Stage goals, random events, room events, and shop: content and UI/system wiring exist, but effect coverage is explicit and limited.
- Build/validation tooling: validation scripts exist, but requested npm aliases are missing.
- Test/lint/smoke: smoke tests exist, but lint is absent and coverage is narrow.
- Hub progression and friendship: content/meta storage exist, but gameplay rewards are sparse or not applied deeply.

## 8. Not Implemented Features

No requested feature area was found to be entirely docs-only. The repo contains at least meaningful runtime scaffolding and player-facing behavior for every feature area in this audit. Several areas are still **Partly Implemented**, but none met the **Not Implemented** definition.

## 9. Risk Hotspots

- No `lint` script in `package.json`.
- Required `validate:content`, `validate:metadata`, and `validate:animations` npm aliases are missing even though corresponding scripts exist.
- Effect systems are switch-limited: content can validate structurally while runtime effect depth remains shallow.
- Save migrations are broad but lack fixture tests for old saves.
- Route endings/rewards and encounter-pack result gating need automated regression tests.
- Mobile portrait layout and text fit need screenshot/device smoke.
- Boss mechanics, reactive hazards, level-up upgrade hooks, relics, weapons, room events, and random events can regress because coverage is mostly manual.

## 10. Recommended Implementation Order

1. Add/fix package aliases for `validate:content`, `validate:metadata`, and `validate:animations`; add a `lint` script or document the replacement quality gate.
2. Add deterministic tests for Cascade Gravity, save migration, route choice resolution, node result duplicate-claim prevention, and encounter-pack chaining.
3. Complete effect coverage matrices for enemy behaviors, boss behaviors, upgrades, relics, weapons, room events, random events, and reactive hazards.
4. Deepen boss mechanics and reactive hazards before spending engineering time on presentation-only asset gaps.
5. Decide Release 1 scope for hub progression and friendship; either wire meaningful gameplay rewards or explicitly backlog them.
6. Run portrait-mobile screenshot smoke after the gameplay gaps above are stabilized.
7. Import final audio/art assets after runtime behavior is locked, using existing fallback/manifest rules.

## 11. Validation Results

| Command | Result | Notes |
|---|---|---|
| `npm run validate:content` | Failed: missing script | `package.json` does not define `validate:content`. |
| `npm run validate:metadata` | Failed: missing script | `package.json` does not define `validate:metadata`. |
| `npm run validate:animations` | Failed: missing script | `package.json` does not define `validate:animations`. |
| `npm run sync:assets` | Passed | Runtime/content asset-like keys scanned: 909; expected unique keys and exact frames: 2,693; physical assets scanned: 581; missing primary files: 2,263; fallback-safe missing production assets: 2,250; unresolved blocking failure: none reported. |
| `npm run build` | Passed | `tsc --noEmit && vite build`; 533 modules transformed; production build completed successfully. |

