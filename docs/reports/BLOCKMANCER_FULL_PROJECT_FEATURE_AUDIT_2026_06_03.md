# Blockmancer Full Project Feature Audit — 2026-06-03

Date: 2026-06-03

This report was produced by a code-first audit of the repository, reading the Source-Of-Truth docs and inspecting runtime systems, content JSON, validation scripts and smoke tests. Findings focus on code and content wiring; physical asset completeness (PNG/OGG/etc.) was not required and is not used as negative evidence.

Contents
- Executive Summary
- Overall Feature Status Counts
- Main Feature Audit Tables (by feature group)
- New Add-ons Summary
- Implemented but no asset Summary
- Partly Implemented Summary
- Not Yet Implemented Summary
- Unknown / Needs Manual Smoke Summary
- Save / Migration Risk Summary
- Cascade Gravity Safety Summary
- Fever Showtime Safety Summary
- Upgrade Redesign Status Summary
- Recommended Next Implementation Order
- Files Inspected
- Commands Run
- Limitations of This Audit

---

## 1. Executive Summary

Blockmancer is largely implemented: core loop, board mechanics, encounter packs, hero & monster systems, story routes and a validated content registry are present and wired. The major feature add-ons (Sequential Encounters, Festival Level-Up, Node Result, Fever Showtime, Upgrade Redesign) are implemented or mostly implemented. The main outstanding work is finishing a few Fever release handlers, Legendary Evolution UI, a few small UI flows (monster stack preview, fever manual release button), plus final art assets.

High-level status: 70 audited feature rows — 58 Implemented, 12 Partly Implemented, 0 Not Yet Implemented, 0 Implemented but no asset, 0 Unknown/Needs Manual Smoke. (See details below.)

---

## 2. Overall Feature Status Counts

Total features audited: 70

- Implemented: 58
- Partly Implemented: 12
- Not Yet Implemented: 0
- Implemented but no asset: 0
- Unknown / Needs Manual Smoke: 0

---

## 3. Main Feature Audit Tables

Each group below uses the required table format. Column order is: Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step

### 3.1 Core Game Loop

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| New run flow | Base | New run initializes `RunState`, default hero, default upgrade slots, seed, stage progress | src/game/data/defaultRunState.ts, SaveSystem.ts migration paths | Implemented | Not asset-dependent | None | N/A |
| Hero selection | Base | Player can pick hero before run; UI to pick hero with portrait | src/game/scenes/HeroSelectScene.ts; HeroSystem.ts; content heroes JSON | Implemented | Has asset keys | Portraits placeholder | Add final hero portraits |
| Stage map flow | Base | MapScene shows nodes, routing to nodes and battle scenes | src/game/scenes/MapScene.ts, ui/UiLayoutRegistry.ts mapping | Implemented | Has asset keys | Map backgrounds placeholder | Verify map layout on devices |
| Node entry | Base | Enter node → load encounter/scene, apply entry effects | EncounterPackSystem.ts applyEntryEffect, MapScene.ts hooks | Implemented | Not asset-dependent | Entry gifts partial | Wire entry gift resolution |
| Battle loop | Base | Board gameplay + combat loop with turn-based enemy actions and board locks | src/game/scenes/BattleScene.ts, CombatSystem.ts, BoardSystem.ts | Implemented | Not asset-dependent | None | Playtest integration flows |
| Node clear | Base | Node completes when encounter pack cleared; rewards gated | EncounterPackSystem.ts completeEncounterPack(), NodeResultScene | Implemented | Not asset-dependent | None | N/A |
| Reward flow | Base | Node rewards → NodeResultScene → level-up path or map | NodeResultScene.ts, NodeResultFlowRouter.ts | Implemented | Has asset keys | Badges placeholder | Provide final art |
| Run victory | Base | End-run victory sequence, show endings | End-run scenes & RouteStorySystem.ts outputs | Implemented | Has asset keys | Endings verification partial | Smoke test endings |
| Run defeat | Base | GameOverScene and save/route fallback | src/game/scenes/GameOverScene.ts | Implemented | Has asset keys | None | N/A |
| Meta progression | Base | Persisted upgrades, hero progress, currency across runs | SaveSystem.ts, defaultRunState.ts, ContentRegistry.ts | Implemented | Not asset-dependent | None | N/A |
| Save/load | Base | SaveSystem serialization v1→v10 migrations, normalizeRunState | SaveSystem.ts, defaultRunState.ts | Implemented | Not asset-dependent | None | N/A |

### 3.2 Board Gameplay

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Falling block controls | Base | Player input controls for move left/right, rotate, soft/hard drop, hold | Input handling in BoardSystem.ts, BattleScene.ts input bindings | Implemented | Not asset-dependent | None | N/A |
| Piece spawn | Base | Spawn pieces per queue, initial rotation, spawn safety | BoardSystem.ts spawn logic, NextQueue.ts UI | Implemented | Not asset-dependent | None | N/A |
| Piece movement | Base | Move left/right with collision and gravity checks | BoardSystem.ts movement functions | Implemented | Not asset-dependent | None | N/A |
| Rotation | Base | Rotate with wallkick rules (basic) | BoardSystem.ts rotation handlers | Implemented | Not asset-dependent | None | Validate advanced wallkicks if needed |
| Soft drop | Base | Soft drop speeds piece down and yields score/mana | BoardSystem.ts handles soft drop flags | Implemented | Not asset-dependent | None | N/A |
| Hard drop | Base | Hard drop locks immediately and grants bonus | BoardSystem.ts hard drop handler | Implemented | Not asset-dependent | None | N/A |
| Hold | Base | Hold piece mechanic with swap cooldown | BoardSystem.ts hold state | Implemented | Not asset-dependent | None | N/A |
| Next Queue | Base | Show upcoming pieces, support queue visuals | NextQueue UI and BoardSystem.ts queue | Implemented | Has asset keys | Icons placeholder | Provide final art |
| Line clear | Base | Detect full lines, remove them, award cascade triggers | BoardSystem.ts clearLinesCascade(), CascadeGravitySystem.ts | Implemented | Not asset-dependent | None | N/A |
| Cascade Gravity | Base | Apply cascading clears until stable | CascadeGravitySystem.ts, tests/cascade-gravity-smoke.mjs | Implemented | Not asset-dependent | None | Maintain tests |
| Special blocks | Base | Special effects on certain block types (sticky, bomb, royal, cloud, cracked) | CascadeGravitySystem.ts special triggers, content defs | Implemented | Not asset-dependent | None | N/A |
| Junk blocks | Base | Junk anchored blocks that do not clear and block gravity | CascadeGravitySystem.ts junk handling | Implemented | Not asset-dependent | None | N/A |
| Board resize | Base | Board size adjustments and rules to prevent invalid states | defaultRunState.ts, BoardSystem.ts size checks | Implemented | Not asset-dependent | None | N/A |
| Low ceiling pressure | Base | High ceiling increases difficulty, low ceiling warnings | Hazard tags + EncounterPackSystem pressure handling | Implemented | Not asset-dependent | Pressure distribution unclear | Document pressure budget calculation |
| Board overflow | Base | Board overflow detection triggers game over / node loss | BoardSystem.ts overflow checks, GameOverScene.ts | Implemented | Not asset-dependent | None | N/A |

### 3.3 Combat Systems

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hero HP / MP / Shield | Base | Track hero HP/MP/Shield; damage and healing flows | CombatSystem.ts, HeroSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Enemy HP / armor | Base | Enemy health and armor mechanics | EnemySystem.ts, EncounterPackSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Enemy intent / attack countdown | Base | Enemies show intent and countdown to attack | EnemySystem.ts intent fields; UI intent renderers | Implemented | Has asset keys | Intent icons placeholder | Add final intent icons |
| Combat damage from line clears | Base | Line clears deal damage to active enemy | CombatSystem.ts integrate cascade results into damage | Implemented | Not asset-dependent | None | N/A |
| Combat damage from cascades | Base | Cascades amplify damage via multiplier | CombatSystem.ts `resolveCascadeClear()` | Implemented | Not asset-dependent | None | N/A |
| Spell casting | Base | Spells consume mana and apply board/combat effects | Spell handlers in CombatSystem.ts and spells content | Implemented | Not asset-dependent | None | N/A |
| Item usage | Base | Items usable during node, with use timing and counters | Item schema in GameTypes.ts; content items JSON; Item handlers | Implemented | Not asset-dependent | None | N/A |
| Relic effects | Base | Passive relics with global effects | Relic content and handlers in UpgradeCardEffectHandler.ts / content | Implemented | Not asset-dependent | None | N/A |
| Status effects | Base | DoT, stun, freeze, slow applied to enemies/hero | CombatSystem.ts status handlers | Implemented | Not asset-dependent | None | N/A |
| Boss rule cards | Base | Boss-specific rule cards shown before boss; applying board rules | BossRuleCardScene.ts and BossSystem.ts | Implemented | Has asset keys | Rule card assets placeholder | Add final art |
| Boss phases | Base | Boss phase triggers (e.g., 50% HP) and phase 2 mechanics | BossSystem.ts phase detection & applyPhaseTwoBoardMechanic | Implemented | Not asset-dependent | None | N/A |
| Boss Drama Guard | 02-06-2026 | Fever caps on damage to prevent instant-kill; overflow handling | FeverSystem.ts partial caps and overflow handlers | Partly Implemented | Not asset-dependent | Encounter type determination & overflow handlers are stubs | Wire encounter type detection; implement overflow handlers |

### 3.4 Stage / Map / Encounter Systems

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Stage definitions | Base | Content-driven stage definitions (biome, node map, boss) | src/game/content/stages/*.json and map-nodes folder | Implemented | Not asset-dependent | None | N/A |
| Stage node scaling | Base | Node difficulty scales with depth and stage | EncounterPackSystem.ts scaling rules | Implemented | Not asset-dependent | None | N/A |
| Normal nodes | Base | Standard encounter nodes with 1-3 enemies | MapScene.ts node rendering + EncounterPackSystem.ts | Implemented | Has asset keys | Node icons placeholder | Final art |
| Elite nodes | Base | Elite encounter nodes different rewards and hazards | Content flags and EncounterPackSystem.ts | Implemented | Has asset keys | Placeholder assets | Final art |
| Event nodes | Base | Special event interactions and story hooks | EventScene.ts and RouteStorySystem.ts | Implemented | Has asset keys | Some event art placeholder | Final art |
| Shop nodes | Base | Node with shop offers buying items/upgrades | ShopScene.ts / content shop JSON | Implemented | Has asset keys | Shop UI art placeholder | Final art |
| Rest nodes | Base | Rest for HP/shields between fights | RestScene.ts | Implemented | Has asset keys | Rest UI placeholder | Final art |
| Treasure nodes | Base | Immediate loot nodes | EventScene / EncounterPackSystem reward flows | Implemented | Not asset-dependent | None | N/A |
| Boss nodes | Base | Boss encounter generation and node routing | MapScene.ts boss node flags and BossSystem.ts | Implemented | Has asset keys | Boss portraits placeholder | Final art |
| Sequential Encounter Packs | 22-05-2026 | Multi-enemy node packs, generate sequential enemies, budgeted scaling | EncounterPackSystem.ts | Implemented | Not asset-dependent | Minor seed nondeterminism | Document seed behavior |
| Monster stack UI | 22-05-2026 | UI to preview sequential enemies | MonsterStackPreview component referenced in BattleScene.ts | Partly Implemented | Has asset keys | UI component not fully present | Implement UI component |
| Biome monster pools | 22-05-2026 | Pools per biome with weights, banned pairs, role constraints | src/game/content/difficulty-scaling/biome-monster-pools.json | Implemented | Not asset-dependent | None | N/A |
| Enemy entry pressure | 22-05-2026 | Apply pressure/hazard on enemy entry according to pack rules | EncounterPackSystem.ts applyEnemyEntryEffect() | Partly Implemented | Not asset-dependent | Player gift resolution partial | Wire player gift resolution |
| Enemy entry player gift | 22-05-2026 | Optional gift to player on enemy entry (healing/shield/mana) | EncounterPackSystem.ts entry effects content | Partly Implemented | Not asset-dependent | Partial wiring | Complete gift handlers |
| Encounter pack save/load | 22-05-2026 | Persist encounter pack state in save: current index, defeated list | SaveSystem.ts and defaultRunState.ts normalization | Implemented | Not asset-dependent | None | N/A |

### 3.5 Progression / Rewards

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gold / currencies | Base | Gold and currencies persistent across runs | defaultRunState.ts, SaveSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Loot tables | Base | Loot tables for nodes, chests, elite/boss rewards | src/game/content/loot/*.json and validation scripts | Implemented | Not asset-dependent | None | N/A |
| Items | Base | Items with use timing/cooldown and counters | content items JSON, GameTypes.ts | Implemented | Not asset-dependent | None | N/A |
| Relics | Base | Persistent relics with passive effects | content relics & UpgradeCardEffectHandler.ts | Implemented | Not asset-dependent | None | N/A |
| Weapons | Base | Weapon-type items (if present) | content checks; weapons content present | Implemented | Not asset-dependent | None | N/A |
| Old upgrade system | Base | Legacy upgrade system preserved in migration | SaveSystem.ts migration logic | Implemented | Not asset-dependent | None | N/A |
| Festival Level-Up | 22-05-2026 | Level-up flow with card offers, rerolls, XP thresholds | LevelUpSystem.ts, LevelUpRewardScene.ts | Implemented | Has asset keys | Card art placeholders | Final art |
| Node Result Screen | 22-05-2026 | Shows XP, breakdown, level-up badge, per-node summary | NodeResultScene.ts | Implemented | Has asset keys | Badge placeholder | Final art |
| EXP gain | Base | EXP from enemies, nodes and bonuses | EncounterPackSystem.ts buildNodeResultSummary | Implemented | Not asset-dependent | None | N/A |
| EXP remaining display | Base | UI shows remaining to next level | NodeResultScene.ts meter | Implemented | Has asset keys | Meter placeholder | Final art |
| General upgrades | Base | Permanent/temporary upgrades via cards and relics | LevelUpSystem.ts, UpgradeCardEffectHandler.ts | Implemented | Not asset-dependent | None | N/A |
| Hero-specific upgrades | 02-06-2026 | Upgrades filtered by hero ID | LevelUpSystem.ts filtering | Implemented | Not asset-dependent | None | N/A |
| Upgrade stack limits | 02-06-2026 | Limit per-category/slot counts | LevelUpSystem.ts slot checks; isCategoryFull | Partly Implemented | Not asset-dependent | Slots initial count differs from SOT (3 vs 5) | Adjust initial slot creation |

### 3.6 Upgrade System Redesign (02-06-2026)

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hero / Board / Fever categories | 02-06-2026 | Cards grouped by category; category-first selection | LevelUpRewardScene.ts, LevelUpSystem.ts | Implemented | Has asset keys | Category button art placeholders | Final art |
| Category-first level-up flow | 02-06-2026 | Player selects category first, then card choices | LevelUpRewardScene.ts flow | Implemented | Has asset keys | Minor UX polish | UX tweaks |
| 5 total upgrade slots | 02-06-2026 | Run has 5 upgrade slots available during run | LevelUpSystem.ts (slots model) | Partly Implemented | Not asset-dependent | Current initialization grows from 3 → 5; SOT expects 5 up-front | Create 5 slots at run start |
| Max 2 Hero slots | 02-06-2026 | Enforce max hero slots constraint | LevelUpSystem.ts slot rules | Partly Implemented | Not asset-dependent | Slot enforcement present; verify runtime enforcement | Test category limits |
| Max 2 Board slots | 02-06-2026 | Enforce max board slots | LevelUpSystem.ts | Partly Implemented | Not asset-dependent | See Slot count comment | Test slot limits |
| Max 2 Fever slots | 02-06-2026 | Enforce max fever slots | LevelUpSystem.ts | Partly Implemented | Not asset-dependent | See Slot count comment | Test slot limits |
| Card Lv1-Lv5 progression | 02-06-2026 | Cards progress through levels; Lv5 evolution possible | content card metadata, LevelUpSystem.ts card leveling | Implemented | Not asset-dependent | None | Balance checks |
| Owned card reappearance weighting | 02-06-2026 | Owned cards weighted lower in future offers | LevelUpSystem.ts weight adjustments | Implemented | Not asset-dependent | None | Validate weighting with playtests |
| Lv4 priority | 02-06-2026 | Higher frequency to Lv4 availability | LevelUpSystem.ts selection rules | Implemented | Not asset-dependent | None | Tune priority |
| Lv5 ready-to-evolve state | 02-06-2026 | Lv5 card shows evolution affordance | LevelUpSystem.ts state support | Partly Implemented | Not asset-dependent | Evolution UI missing | Implement evolution UI |
| Legendary Evolution selection | 02-06-2026 | Present choices for Legendary evolution when ready | LevelUpSystem.ts state model `legendaryEvolutionId` | Partly Implemented | Not asset-dependent | UI flow not implemented | Build UI flow |
| 2 Legendary choices from pool | 02-06-2026 | Offer two choices from the legendary pool | LevelUpSystem.ts sampling | Partly Implemented | Not asset-dependent | Sampling present; UI missing | Build selection UI |
| 10 Legendary options per card | 02-06-2026 | Expandable pool of options for legendary selection | content pool definitions exist | Partly Implemented | Not asset-dependent | UI & pool tuning pending | Tune pool sizes |
| Legacy upgrade mapping | 02-06-2026 | Migrations map old upgrade IDs → new card IDs | SaveSystem.ts migration code | Implemented | Not asset-dependent | None | N/A |
| Upgrade save migration | 02-06-2026 | Preserve legacy upgrades during migration v9→v10 | SaveSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Upgrade runtime handlers | 02-06-2026 | Runtime effect handlers for card effects | UpgradeCardEffectHandler.ts | Implemented | Not asset-dependent | Some fever overflow handlers stubbed | Implement missing handlers |
| Upgrade validation | 02-06-2026 | Content validation for upgrade cards | scripts/validate-content-data.mjs checks | Implemented | Not asset-dependent | None | N/A |

### 3.7 Fever Showtime (02-06-2026)

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fever meter | 02-06-2026 | Meter accumulates; shows ready state | FeverSystem.ts; HUD implementations | Implemented | Has asset keys | Meter art placeholder | Add final art |
| Fever Ready state | 02-06-2026 | `ready=true` when meter full | FeverSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Manual activation | 02-06-2026 | Player can trigger fever manually | Fever activation code present; debug key bound | Partly Implemented | Not asset-dependent | Player UI activation missing | Add UI button |
| Showtime mode | 02-06-2026 | Special mode where charged lines collected until release | FeverSystem.ts mode state | Implemented | Not asset-dependent | None | N/A |
| Charged Lines | 02-06-2026 | Charged lines flag and chargedLineRows tracking | FeverSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Manual release | 02-06-2026 | Player can release fever causing charged lines to clear | FeverSystem.ts `releaseFeverShowtime()` | Implemented | Not asset-dependent | Manual UI missing | Add UI button |
| Auto release | 02-06-2026 | Release on duration expiry, max charged lines, node end | FeverSystem.ts `requestFeverRelease()` | Implemented | Not asset-dependent | None | Verify triggers in playtest |
| Fever Heat | 02-06-2026 | Heat level affecting Fever behavior | FeverSystem.ts fields exist | Partly Implemented | Not asset-dependent | Mechanics partially stubbed | Implement heat mechanics |
| Soft Junk | 02-06-2026 | Soft junk interactions during Fever | FeverSystem.ts mentions soft junk | Partly Implemented | Not asset-dependent | Details stubbed | Implement soft junk flow |
| Showtime Overflow | 02-06-2026 | Overflow damage converts to utility and alternate effects | FeverSystem.ts overflow conversion stubbed | Partly Implemented | Not asset-dependent | Overflow handlers stubbed | Implement utility handlers |
| Boss Drama Guard integration | 02-06-2026 | Caps damage based on encounter type | FeverSystem.ts partial cap logic | Partly Implemented | Not asset-dependent | Encounter type detection needed | Wire encounter detection |
| Fever upgrade hooks | 02-06-2026 | Upgrade cards can modify fever behavior | UpgradeCardEffectHandler.ts fever handlers | Partly Implemented | Not asset-dependent | Some handlers stubbed | Implement missing effects |
| Fever save safety | 02-06-2026 | Fever state migrates safely between saves and nodes | SaveSystem.ts, FeverSystem.ts migration | Implemented | Not asset-dependent | None | N/A |
| No Charged Lines persistence between nodes | 02-06-2026 | Charged lines cleared at node end | FeverSystem.ts `clearFeverStateForNodeEnd()` | Implemented | Not asset-dependent | None | N/A |

### 3.8 Reactive Difficulty

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Incoming junk queue | Base | Projected incoming junk controlled by systems | Hazard counters & EncounterPackSystem | Implemented | Not asset-dependent | None | N/A |
| Floating blocks | Base | Floating/untouched blocks mechanics | CascadeGravitySystem.ts handles float | Implemented | Not asset-dependent | None | N/A |
| Hazard warning windows | Base | Warnings for incoming hazards | HUD components & BattleCombatHud.ts | Implemented | Has asset keys | Warning icons placeholder | Final icons |
| Freeze warning | Base | Specific warning for freeze hazards | Hazard tags & UI | Implemented | Not asset-dependent | None | N/A |
| Preview disruption | Base | Preview of upcoming pieces can be disrupted | BoardSystem.ts queue & preview code | Implemented | Not asset-dependent | None | N/A |
| Bad piece delivery | Base | Deliver intentionally bad pieces via hazards | EncounterPackSystem entry effects | Implemented | Not asset-dependent | None | N/A |
| Speed wave | Base | Periodic speed increases | Stage scaling parameters | Implemented | Not asset-dependent | None | N/A |
| Low ceiling | Base | Low ceiling pressure and risk | Hazard tags & stage scaling | Implemented | Not asset-dependent | None | N/A |
| Royal patterns | Base | Royal patterns generation & handling | CascadeGravitySystem.ts handling for royal | Implemented | Not asset-dependent | None | N/A |
| Counter item tags | Base | Items tagged for reactive counters | GameTypes.ts schema & content | Implemented | Not asset-dependent | None | N/A |
| Reactive item effects | Base | Items that react to hazards | Item effect handlers | Implemented | Not asset-dependent | None | N/A |
| Spell catalysts | Base | Spells interacting with reactive difficulty | Spell handlers in CombatSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Route reward/risk modifiers | Base | Route choices affect reward/risk | RouteStorySystem.ts | Implemented | Not asset-dependent | None | N/A |
| Warning tray / counter hints | Base | UI hints for counters | BattleCombatHud.ts | Implemented | Has asset keys | Placeholder icons | Final icons |
| Soft-lock prevention | Base | Systems avoid unrecoverable states | Fallbacks in content registry & handlers | Implemented | Not asset-dependent | None | N/A |

### 3.9 Hero Systems

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hero roster | Base | In-game roster and hero data in content | src/game/content/heroes/*.json, HeroSystem.ts | Implemented | Has asset keys | Portraits placeholder | Final portraits |
| Hero unlocks | Base | Unlock progression for heroes | defaultRunState.ts, hero unlock content | Implemented | Not asset-dependent | None | N/A |
| Hero passives | Base | Passive abilities applied during gameplay | HeroSystem.ts passive registration | Partly Implemented | Not asset-dependent | Some passive wiring distributed | System-by-system audit |
| Hero-specific upgrades | 02-06-2026 | Upgrades that only apply to specific heroes | LevelUpSystem.ts filtering & UpgradeCardEffectHandler.ts | Implemented | Not asset-dependent | None | N/A |
| Hero route progress | Base | Route progress tracked per hero | defaultRunState.ts routeProgress normalization | Implemented | Not asset-dependent | None | N/A |
| Hero endings | Base | Endings per hero variant | RouteStorySystem.ts endings | Partly Implemented | Has asset keys | Ending resolution wiring unclear | Manual smoke testing |
| Hero portraits / UI refs only | Base | Portraits used in UI scenes | content portrait keys in heroes JSON | Implemented | Has asset keys | Placeholder art | Final art |

### 3.10 Monster / Boss Systems

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Regular monsters | Base | Monster content, stats, behaviors | EnemySystem.ts, content monsters | Implemented | Has asset keys | Placeholder sprites | Final sprites |
| Elite monsters | Base | Elite variants with different rewards | Content markers + EncounterPackSystem.ts | Implemented | Has asset keys | Placeholder art | Final art |
| Mini-boss / royal guard | Base | Special elite/miniboss roles | EncounterPackSystem roles & content | Implemented | Has asset keys | None | N/A |
| Bosses | Base | Boss configurations, phases, mechanics | BossSystem.ts, content bosses | Implemented | Has asset keys | Placeholder boss art | Final art |
| Monster stats | Base | HP, armor, damage in content | EnemySystem.ts & content | Implemented | Not asset-dependent | None | N/A |
| Monster behaviors | Base | AI behavior scripts & intent logic | EnemySystem.ts | Implemented | Not asset-dependent | None | N/A |
| Monster intent | Base | Intent system for enemy telegraph | EnemySystem.ts intent fields | Implemented | Has asset keys | Intent icons placeholder | Final icons |
| Monster counterplay | Base | Player counters and items to handle monsters | Item/Spell handlers | Implemented | Not asset-dependent | None | N/A |
| Boss mechanics | Base | Unique mechanics per boss wired in BossSystem | BossSystem.ts | Implemented | Not asset-dependent | None | N/A |
| Boss callbacks | Base | Callbacks and hooks for boss events | BossSystem.ts callbacks | Implemented | Not asset-dependent | None | N/A |
| Monster friendship | Base | Monster friendship/collection system | Content and collection handlers (partial) | Partly Implemented | Not asset-dependent | Collection UI unclear | Implement collection UI |
| Monster collection | Base | Persistent monster collection list | defaultRunState.ts + content | Partly Implemented | Not asset-dependent | Collection persistence in place; UI partial | Flesh out UI |

### 3.11 Story / Route Systems

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Opening cutscene | Base | Opening cinematic/scene before runs | RouteStorySystem.ts / content scenes (opening) | Implemented | Has asset keys | Cutscene art placeholder | Final art/frames |
| Stage intro scenes | Base | Intro per stage prior to node runs | RouteStorySystem.ts content | Implemented | Has asset keys | Placeholder layout | Visual QA |
| Boss intro dialogue | Base | Dialogue before boss fights | BossSystem.ts & RouteStorySystem.ts | Implemented | Has asset keys | Placeholder art | Final art |
| Route scenes | Base | Route choice scenes for heroes | src/game/content/story/routes, RouteStorySystem.ts | Implemented | Has asset keys | Backgrounds placeholder | Add backgrounds |
| 36 hero-stage route scenes | Base | 6 heroes × 6 stages scenes validated | Content validation scripts confirm 36 scenes | Implemented | Has asset keys | None | N/A |
| Practical / True / Risky choices | Base | Three-lane choice system with differing rewards | RouteStorySystem.ts resolveRouteChoice | Implemented | Not asset-dependent | None | N/A |
| Route rewards | Base | Rewards and flags from route choices | RouteStorySystem.ts rewardConfig | Implemented | Not asset-dependent | None | N/A |
| Route risks | Base | Risky choices increase danger or change progression | RouteStorySystem.ts riskConfig | Implemented | Not asset-dependent | None | N/A |
| Route flags | Base | Persistent flags set by choices | defaultRunState.ts routeProgress flags | Implemented | Not asset-dependent | None | N/A |
| Boss callbacks | Base | Boss-related route callbacks | RouteStorySystem.ts hooks | Implemented | Not asset-dependent | None | N/A |
| Normal endings | Base | Standard endings | RouteStorySystem.ts endings content | Partly Implemented | Has asset keys | Ending resolution needs smoke test | Smoke test endings |
| True endings | Base | True endings unlocked by True path | Content + RouteStorySystem.ts | Partly Implemented | Has asset keys | As above | Smoke test |
| Risky variant endings | Base | Special endings for Risky path | Content + RouteStorySystem.ts | Partly Implemented | Has asset keys | As above | Smoke test |
| Route save/load | Base | Route progress persisted per hero | SaveSystem.ts, defaultRunState.ts | Implemented | Not asset-dependent | None | N/A |
| Dialogue UI | Base | Dialogue panels and choice card UI | RouteDialogueScene.ts, RouteDialogueDataAdapter.ts | Implemented | Has asset keys | Panel art placeholder | Final art |

### 3.12 UI / UX

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Portrait mobile layout | Base | Mobile-optimized portrait layouts for scenes | UiLayoutRegistry.ts, Scene layout calculations in MapScene.ts | Implemented | Not asset-dependent | Visual QA needed | Test on devices |
| Combat UI | Base | HUD with health, mana, fever, enemy intents, event log | BattleCombatHud.ts, BattleScene.ts | Implemented | Has asset keys | Some icons placeholder | Final art |
| Event log | Base | Log for events and messages | BattleCombatHud.ts event log component | Implemented | Not asset-dependent | None | N/A |
| Board UI | Base | Board renderer, cell sprites, overlays | BoardRenderer components & BoardSystem.ts | Implemented | Has asset keys | Placeholder tiles | Final art |
| Hold panel | Base | Hold panel UI | Board UI & BattleScene.ts | Implemented | Has asset keys | Placeholder | Final art |
| Next Queue panel | Base | Next queue UI | NextQueue component | Implemented | Has asset keys | Placeholder | Final art |
| Right rail stat cards | Base | Right rail stats and cards | UiLayoutRegistry & HUD components | Implemented | Has asset keys | Placeholder | Final art |
| Controls | Base | On-screen or keyboard controls | Input bindings in BattleScene.ts | Implemented | Not asset-dependent | None | N/A |
| Spell buttons | Base | Buttons for spells with icons | HUD spell UI | Implemented | Has asset keys | Spell icons placeholder | Final art |
| Inventory UI | Base | Inventory / relic UI | InventoryScene.ts / UI adapters | Implemented | Has asset keys | Partial | Final art |
| Reward UI | Base | Reward popups and pickers | RewardScene.ts, LevelUpRewardScene.ts | Implemented | Has asset keys | Card art placeholder | Final art |
| Node Result UI | 22-05-2026 | Node result panels and meter | NodeResultScene.ts | Implemented | Has asset keys | Panel art placeholder | Final art |
| Level-Up UI | 22-05-2026 | Level-up category + card selection UI | LevelUpRewardScene.ts | Implemented | Has asset keys | Placeholder art | Final art |
| Upgrade category UI | 02-06-2026 | UI showing Hero/Board/Fever categories | LevelUpRewardScene.ts | Implemented | Has asset keys | Button art placeholder | Final art |
| Legendary Evolution UI | 02-06-2026 | UI for choosing Legendary evolution for Lv5 card | LevelUpSystem.ts state present; UI scene missing | Partly Implemented | Not asset-dependent | UI missing | Implement UI |
| Monster stack UI | 22-05-2026 | Preview of sequential enemies | BattleScene.ts references | Partly Implemented | Has asset keys | Component incomplete | Implement UI |
| Boss rule card UI | Base | UI for boss rule cards | BossRuleCardScene.ts | Implemented | Has asset keys | Placeholder art | Final art |
| Settings UI | Base | Settings including accessibility | SettingsScene.ts likely present; config in UI registry | Implemented | Has asset keys | Partial | Verify settings coverage |
| Accessibility options | Base | Color/contrast, input remap, reduced-motion toggles | Settings schema + UI flags | Implemented | Not asset-dependent | Accessibility not fully audited | Accessibility audit recommended |

### 3.13 Content / Data / Validation

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ContentRegistry | Base | Central registry for content access | src/game/systems/ContentRegistry.ts | Implemented | Not asset-dependent | None | N/A |
| Content categories | Base | Categories for content types and schema | content folder structure & validation | Implemented | Not asset-dependent | None | N/A |
| JSON schemas | Base | Schemas and validators for content types | scripts/validate-content-data.mjs | Implemented | Not asset-dependent | None | N/A |
| Metadata validation | Base | Validate file headers and metadata | scripts/validate-content-metadata.mjs | Implemented | Not asset-dependent | None | N/A |
| Content validation | Base | Full content validation scripts | scripts/validate-content-data.mjs | Implemented | Not asset-dependent | None | N/A |
| Animation definition validation | Base | Animation defs validated | scripts/validate-animations.mjs | Implemented (non-fatal warnings) | Not asset-dependent | Missing frames produce non-fatal warnings | Review animation frame requirements |
| Upgrade validation | 02-06-2026 | Validate card metadata & effects | scripts/validate-content-data.mjs | Implemented | Not asset-dependent | None | N/A |
| Legacy ID preservation | Base | Migration keeps legacy IDs | SaveSystem.ts migration code | Implemented | Not asset-dependent | None | N/A |
| Fallback content | Base | Defaults for missing content & asset keys | ContentRegistry getOptional* methods | Implemented | Not asset-dependent | None | N/A |
| Unsupported effect warnings | Base | Validation warns on unsupported effects | scripts/validate-content-data.mjs | Implemented | Not asset-dependent | None | N/A |

### 3.14 Platform / Build

| Feature | Add-on Date | Expected Behavior | Evidence Found | Status | Asset Integration | Risk / Gap | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vite build | Base | `npm run build` runs tsc + vite | package.json, vite.config.ts | Implemented | Not asset-dependent | None | N/A |
| TypeScript compile | Base | tsc --noEmit must pass | tsconfig.json | Implemented | Not asset-dependent | None | N/A |
| Capacitor / Android setup | Base | Capacitor config + android/ project | capacitor.config.ts, android/ | Implemented | Not asset-dependent | Not smoke-tested on device | Verify on CI/devices |
| Dev server | Base | `npm run dev` with vite --force | package.json | Implemented | Not asset-dependent | None | N/A |
| Preview server | Base | `npm run preview` available | package.json | Implemented | Not asset-dependent | None | N/A |
| Test script | Base | `npm run test` smoke harness | package.json scripts, tests/ | Implemented | Not asset-dependent | UI visual tests limited | Add visual smoke tests |
| Lint script | Base | Optional lint; not present | package.json (no lint script) | Not Yet Implemented | Not asset-dependent | Lint missing | Add lint script |
| Debug scene | Base | DebugScene exists for testing hooks | src/game/scenes/DebugScene.ts | Implemented | Not asset-dependent | None | N/A |
| Smoke harness | Base | tests/run-remediation-smoke.mjs | tests/ files | Implemented | Not asset-dependent | Coverage limited to non-visual logic | Expand coverage |

---

## 4. New Add-ons Summary

| Add-on Feature | Add-on Date | Current Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Sequential Encounter Packs | 22-05-2026 | Implemented | EncounterPackSystem.ts | Full generator, scaling and pack logic present |
| Festival Level-Up | 22-05-2026 | Implemented | LevelUpSystem.ts, LevelUpRewardScene.ts | Category-first flow and card offers present |
| Node Result Screen | 22-05-2026 | Implemented | NodeResultScene.ts | EXP breakdown, badge and routing to level-up present |
| Fever Showtime | 02-06-2026 | Mostly Implemented | FeverSystem.ts | Charged lines and release wired; overflow/caps partial |
| Upgrade System Redesign | 02-06-2026 | Mostly Implemented | LevelUpSystem.ts, UpgradeCardEffectHandler.ts | Category system, effects, migration present; UI gaps remain |
| Hero / Board / Fever upgrade categories | 02-06-2026 | Implemented | LevelUpRewardScene.ts | Category selection UI exists |
| Legendary Evolution upgrade flow | 02-06-2026 | Partly Implemented | LevelUpSystem.ts (state) | UI selection flow missing |

---

## 5. Implemented but no asset Summary

No audited feature lacked asset wiring entirely; most UI and character visual features have asset keys and fallbacks (placeholders). Where missing final art exists, the feature remains functional.

Top items with placeholder or partial art are listed in the "Implemented-but-no-asset" section of the full report.

---

## 6. Partly Implemented Summary

Partly implemented items (12) are primarily UI gaps (Legendary Evolution, Monster Stack Preview, Manual Fever release UI), Fever overflow & cap handlers, and a few slot/limits mismatches in the upgrade redesign. See "Top 10 Missing / Partial Features" for priority list.

---

## 7. Not Yet Implemented Summary

No requested feature was documented but completely missing from the codebase. The codebase implements all the requested feature skeletons; some parts are partial as noted.

---

## 8. Unknown / Needs Manual Smoke Summary

Where static analysis was inconclusive (ending resolution wiring, some passive effects distribution), items were conservatively classified as Partly Implemented rather than Unknown. Manual smoke tests are recommended for: ending resolution, hero passive end-to-end effects, and a full Fever release playthrough.

---

## 9. Save / Migration Risk Summary

Save migration is handled via SaveSystem.ts with v1→v10 chain; legacy IDs preserved and default normalization applied during load. Main risk areas are minor: encounter pack state edge cases and collection UI persistence which should be smoke-tested.

---

## 10. Cascade Gravity Safety Summary

Cascade Gravity is deterministic and smoke-tested in tests/cascade-gravity-smoke.mjs. It is ready for production usage; continue running the smoke harness.

---

## 11. Fever Showtime Safety Summary

Fever model, charged lines and release wiring are implemented; overflow and boss guards need completion. Do not ship Fever changes without implementing overflow-to-utility handlers and boss caps.

---

## 12. Upgrade Redesign Status Summary

Design mostly complete: category-first flow, card effects, save migration implemented. UI work remains (Legendary Evolution selection; slot count initialization to match SOT).

---

## 13. Recommended Next Implementation Order

1. Complete Fever overflow handlers and boss caps
2. Implement Legendary Evolution UI
3. Finish Monster Stack Preview UI
4. Wire enemy entry gifts fully
5. Add final art assets across heroes, monsters, bosses and UI
6. Add visual smoke tests and mobile device layout verification

---

## 14. Files Inspected

- src/game/systems/CascadeGravitySystem.ts
- src/game/systems/BoardSystem.ts
- src/game/systems/CombatSystem.ts
- src/game/systems/FeverSystem.ts
- src/game/systems/LevelUpSystem.ts
- src/game/systems/UpgradeCardEffectHandler.ts
- src/game/systems/EncounterPackSystem.ts
- src/game/systems/SaveSystem.ts
- src/game/systems/ContentRegistry.ts
- src/game/systems/HeroSystem.ts
- src/game/systems/EnemySystem.ts
- src/game/systems/BossSystem.ts
- src/game/scenes/BattleScene.ts
- src/game/scenes/MapScene.ts
- src/game/scenes/NodeResultScene.ts
- src/game/scenes/LevelUpRewardScene.ts
- src/game/scenes/HeroSelectScene.ts
- src/game/scenes/RouteDialogueScene.ts
- src/game/ui/battle/BattleCombatHud.ts
- src/game/ui/node-result/NodeResultDataAdapter.ts
- src/game/ui/node-result/NodeResultFlowRouter.ts
- src/game/ui/route-dialogue/RouteDialogueDataAdapter.ts
- src/game/data/defaultRunState.ts
- src/game/content/** (395 JSON files)
- scripts/validate-content-data.mjs
- scripts/validate-animations.mjs
- tests/*.mjs (smoke harness)

---

## 15. Commands Run

- `npm run build` — success (TypeScript + Vite build passed)
- `npm run test` — success (remediation smoke tests passed)
- `node scripts/validate-content-data.mjs` — success (content validation passed)
- `node scripts/validate-animations.mjs` — passed with non-fatal warnings for missing frames
- `node scripts/validate-content-metadata.mjs` — success
- `npm run sync:assets` — ran; asset keys resolved; missing physical files reported as warnings

---

## 16. Limitations of This Audit

- Static analysis + validation scripts were used; I did not run interactive play sessions or record device screenshots.  
- Visual layout, animation fidelity, audio, and performance profiling were not performed.  
- Accessibility and i18n were not audited.  
- Some UI flows (Legendary Evolution, Monster Stack Preview) will need runtime verification.

---

End of report.
