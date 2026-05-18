# Blockmancer Dungeon - Source of Truth

This is the single canonical design, content, technical, and release source of truth for Blockmancer Dungeon.

All other markdown files in this repository are supporting notes, historical references, generated prompt packs, or implementation logs. When any doc disagrees with this file, this file wins.

Primary wording source: `blockmancer_lighthearted_content_direction.md`.

## 1. Project Identity

Blockmancer Dungeon is a cheerful portrait-mobile falling-block roguelike RPG.

A magical festival machine called the Block-O-Matic 3000 goes haywire during the Festival of Falling Stars and opens a colorful dungeon beneath the town square. Players clear rune block lines, trigger Cascade Gravity combos, cast silly spells, collect snacks, relics, upgrades, items, and unlock quirky heroes while trying to restore festival order and stop King Bloxley, the self-appointed Block King.

Core fantasy:

```text
You are a Blockmancer cleaning up magical chaos one combo at a time.
```

Core theme:

```text
Creativity fixes chaos better than control.
```

The player is not saving a doomed world. The player is saving a magical festival from becoming a giant blocky mess.

## 2. Tone Rules

Always use this tone:

- Cheerful fantasy
- Cute chaos
- Festival adventure
- Funny monsters
- Cozy arcade energy
- Bright 32-bit pixel-art style
- Lighthearted dungeon crawl
- Readable, colorful, playful UI and text

Never add:

- Dark curse lore
- Grim tragedy
- Horror tone
- Edgy fantasy content
- Realistic gore
- Hopeless apocalypse
- Skull-heavy UI
- Overly serious villain writing

Use "Oopsies", "Silly Drawbacks", or "Festival Mishaps" instead of "curses" in player-facing text.

## 3. Core Gameplay Pillars

1. Falling-block board gameplay.
2. Cascade Gravity as the board identity.
3. Combat through line clears, cascades, mana, spells, items, relics, upgrades, and hero passives.
4. Compact JRPG-style battle panel above the board.
5. Roguelike map progression with normal, elite, event, shop, rest, treasure, and boss nodes.
6. Stage-specific monsters and bosses.
7. Cheerful festival chaos tone.
8. Mobile portrait readability.
9. Data-driven content wherever practical.
10. Safe fallbacks for missing assets, content, and save fields.

## 4. Cascade Gravity

Cascade Gravity must remain the core line-clear behavior. Do not replace it with classic row shifting.

Required behavior:

1. Detect completed lines.
2. Remove cells in completed lines.
3. Apply deterministic grid-based gravity by column.
4. Blocks above fall downward within their own columns.
5. Detect new completed lines.
6. Repeat until the board is stable.
7. Return a `CascadeResult`.

Required shape:

```ts
type CascadeResult = {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  specialBlocksTriggered: string[];
  causedCombo: boolean;
};
```

Cascade rewards:

- Cascade 1: 100% damage.
- Cascade 2: 125% damage.
- Cascade 3: 150% damage.
- Cascade 4+: 200% damage.
- Cascade mana bonus: 50% of normal mana gain.

## 5. Portrait Mobile Layout

Portrait mobile is the primary target. Desktop preview should use a centered portrait frame.

Battle layout:

```text
Top 1/5:
- Compact battle panel
- Hero and enemy
- HP, mana, shield, intent, stage

Middle 3/5:
- Falling-block board
- Next block
- Hold block
- Inventory compact overlay
- Fever meter
- Cascade/combo display

Bottom 1/5:
- Mobile controls
- Left/right
- Rotate
- Soft drop
- Hard drop
- Hold
- Spell buttons
- Item/inventory button
```

Mobile rules:

- Keep the board central and readable.
- Do not permanently hide next, hold, or inventory.
- Prefer compact labels and expandable panels.
- Detailed text belongs in a modal, card, event log, or separate scene.
- Touch targets must be thumb-friendly.

## 6. Stages, Monsters, and Bosses

Release 1.0 has six stages.

| Stage | Name | Theme | Main Mechanics | Boss |
| ---: | --- | --- | --- | --- |
| 1 | Sprinkle Sewers | Candy sewers, frosting pipes, cupcake slime | Sticky blocks, sprinkle blocks, bonus mana | Cupcake Slime King |
| 2 | Goblin Workshop | Machines, conveyor belts, springs, toy bombs | Junk blocks, bombs, board shake | Prototype No. 7 |
| 3 | Frosty Pantry | Magical freezer, rainbow ice cream, slippery blocks | Ice blocks, slow/fast fall waves, freeze | Gelato Golem |
| 4 | Pillow Castle | Pillows, plush toys, blanket ghosts | Soft blocks, shields, Sleepy status | Sir Snore-a-Lot |
| 5 | Starfall Arcade | Neon machines, prize counters, combo signs | Fever, cascade bonuses, combo challenges | High Score Hydra |
| 6 | Bloxley's Block Palace | Royal blocks, square banners, confetti | Royal blocks, symmetry, pattern junk | King Bloxley |

Boss design:

- Bosses should be readable and funny.
- Every boss needs a rule card before combat.
- Phase changes should be clear in UI/log text.
- Boss mechanics should match stage mechanics.

Boss IDs used in code/content may currently be prefixed with `mon_boss_`. Player-facing names should use the names above.

## 7. Playable Heroes and Passives

Hero selection should change board/combat feel, not only stats.

| Hero | ID | Role | Passive ID | Passive Intent |
| --- | --- | --- | --- | --- |
| Milo | `hero_milo_blockmancer` | Balanced starter | `passive_plink_plonk_combo` | First cascade each battle grants bonus mana. |
| Pippa | `hero_pippa_pyromancer` | Fire/spell damage | `passive_preheat_cleanup` | Fire spells burn sticky or junk blocks. |
| Nixie | `hero_nixie_frostbinder` | Control/safety | `passive_stay_chill` | Smooths or slows speed spikes once per room. |
| Bruk | `hero_bruk_snack_knight` | Defense/rescue | `passive_no_snack_left_behind` | Survives board overflow once per battle or gains emergency shield. |
| Zuzu | `hero_zuzu_goblin_engineer` | Bomb chaos | `passive_bombs_are_features` | More bomb blocks, with slightly more junk risk. |
| Lumi | `hero_lumi_star_witch` | Advanced cascade mastery | `passive_main_character_energy` | Star blocks heavily boost cascade damage. |

Unlock direction:

- Milo: default.
- Pippa: defeat Stage 1 boss.
- Zuzu: defeat Stage 2 boss.
- Nixie: control/no-damage style challenge.
- Bruk: total gold meta progress.
- Lumi: cascade/combo mastery.

## 8. Board Blocks

Board block tone should be magical, snack-like, toy-like, or festival-themed.

Core block direction:

| Block ID | Role |
| --- | --- |
| `block_red_rune`, `block_blue_rune`, `block_green_rune`, `block_yellow_rune` | Normal rune blocks. |
| `block_sprinkle` | Mana bonus. |
| `block_cupcake` | Small heal. |
| `block_bomb` | Area clear and damage. |
| `block_star` | Cascade/combo boost. |
| `block_jelly` | Soft/wobbly cascade behavior. |
| `block_ice` | Freeze/slide/chill hooks. |
| `block_sticky` | Board cleanup hazard. |
| `block_crumb_junk` | Enemy junk. |
| `block_royal` | Bloxley boss/pattern block. |
| `block_confetti` | Random bonus with visual chaos. |
| `block_toolbox` | Gadget/item charge. |

## 9. Map Node Scaling

Later stages should be longer and more strategic.

| Stage | Main Path Nodes | Total Generated Nodes | Required Structure |
| ---: | ---: | ---: | --- |
| 1 | 6 | 9-11 | 3 normal, 1 event, 1 treasure/rest, 1 boss. No elite. |
| 2 | 8 | 12-14 | 4 normal, 1 event, 1 shop, 1 elite, 1 boss. |
| 3 | 10 | 15-17 | 5 normal, 1 event, 1 rest, 1 treasure, 1 elite, 1 boss. |
| 4 | 12 | 18-21 | 6 normal, 2 events, 1 shop, 1 rest, 1 elite, 1 boss. |
| 5 | 14 | 22-25 | 7 normal, 2 events, 1 shop, 1 treasure, 2 elites, 1 boss. |
| 6 | 16 | 26-30 | 8 normal, 2 events, 1 shop, 1 rest, 2 elites, 1 mini-boss/royal guard, 1 final boss. |

Map rules:

- Boss node is always the final required node.
- Elite nodes begin at Stage 2.
- Stage 6 has a special pre-boss pressure node.
- Completed/current/available states must save and load.

## 10. Dynamic Board Size

Base board sizes by stage:

| Stage | Base Size |
| ---: | --- |
| 1 | 8x16 |
| 2 | 9x17 |
| 3 | 9x18 |
| 4 | 10x18 |
| 5 | 10x19 |
| 6 | 10x20 |

Rules:

- Normal fights use stage base size.
- Elite rooms can shrink width or height for tighter risk.
- Boss phases may shrink, expand, or reshape temporarily.
- Rest and treasure rooms may be slightly larger or safer.
- Random events and chaos rules may modify size.
- Never shrink below 6x12.
- Never exceed mobile-readable limits.
- If shrink would invalidate occupied cells, use the safest current implementation: prevent, crop carefully with fallback, or reset/clear overflow with feedback.

## 11. Replayability Systems

### Random Gameplay Events

Random events may occur during battles, map movement, or event choices. They can affect board state, combat state, rewards, stage goals, route risk, or boss difficulty.

Initial event IDs:

```text
r_evt_jelly_surge
r_evt_sprinkle_rain
r_evt_sticky_spill
r_evt_lost_cake_alarm
r_evt_goblin_miswire
r_evt_button_panic
r_evt_bomb_delivery
r_evt_freezer_draft
r_evt_ice_slide
r_evt_sleepy_moment
r_evt_blanket_tangle
r_evt_arcade_combo_callout
r_evt_prize_claw_grab
r_evt_neon_flash
r_evt_royal_decree_square
r_evt_symmetry_check
r_evt_confetti_overload
r_evt_manual_page_tip
r_evt_snack_break
r_evt_machine_hiccup
```

Overlap rules:

- Stages 1-2: max 1 active random event.
- Stages 3-4: max 1 or 2 depending on node type.
- Stages 5-6: up to 2, especially elite and boss rooms.
- No event may soft-lock the player.

### Stage Goals

Each stage has one optional goal. Success can improve rewards or weaken the boss; failure can make the boss slightly harder.

| Stage | Goal | Success | Failure |
| ---: | --- | --- | --- |
| 1 | Recover 3 Lost Cupcakes | Cupcake Slime King starts with fewer sticky blocks. | Extra sticky blocks. |
| 2 | Disable 2 Goblin Machines | Prototype No. 7 drops less junk. | Prototype starts overclocked. |
| 3 | Save 3 Ice Cream Crates | Player starts boss with shield. | Fall speed spike during boss. |
| 4 | Keep 2 Guards Asleep | Rare treasure or reduced sleep effect. | More Sleepy effects in boss. |
| 5 | Reach combo score target | Start boss with Fever. | Hydra gains extra combo punishment. |
| 6 | Break 3 Royal Seals | King Bloxley starts weakened. | Final boss starts with royal blocks. |

### Festival Chaos Rules

Combat rooms can roll 0-1 chaos rule. They should be funny, readable, and temporary.

Initial chaos IDs:

```text
chaos_sprinkle_storm
chaos_wobbly_floor
chaos_snack_tax
chaos_confetti_fever
chaos_goblin_safety_test
chaos_freezer_draft
chaos_royal_inspection
chaos_jelly_bounce
```

### Battle Mini-Objectives

Combat can roll 0-1 mini-objective. Success gives a small reward; failure should not be harsh.

Initial objective direction:

- Trigger 1 cascade.
- Clear 2 lines with one piece.
- Clear 5 sprinkle blocks.
- Destroy all junk blocks.
- Win without using a spell.
- Win before enemy attacks 3 times.
- Use Hold at least once.
- Cast 2 spells in one battle.
- End battle with board below 50% height.
- Trigger Fever before victory.

### Boss Rule Cards

Every boss fight should show a readable card before combat.

Each card includes:

- Boss gimmick title.
- Short description.
- Phase rules.
- Player tip.
- Dismiss button.

### Oopsie Risk/Reward Choices

Event choices should often use this structure:

- Small safe reward.
- Big risky reward plus Oopsie.
- Gold payment for controlled reward.
- Walk away option.

Priority events:

```text
evt_suspicious_button
evt_goblin_quality_test
evt_rainbow_fountain
evt_arcade_challenge
evt_block_o_manual_page
```

### Festival Hub Progression

After each run, players can restore festival booths for meta-progression.

Hub buildings:

```text
hub_cake_stall
hub_ice_cream_cart
hub_goblin_workshop
hub_arcade_booth
hub_snack_table
hub_star_lantern_stage
hub_repair_tent
hub_bloxley_statue
```

Currencies:

```text
currency_gold
currency_sprinkles
currency_tickets
currency_stars
```

### Monster Friendship / Collection

Some monsters can be calmed, fed, spared, befriended, or collected. This supports the cute festival tone and long-term goals.

Initial friendship rewards:

- Cupcake Slime: start battle with 1 sprinkle block.
- Sugar Bat: next preview hide duration reduced.
- Crumb Goblin: junk blocks can become normal blocks.
- Button Masher: board shake reduced.
- Ice Cream Imp: freeze effects shorter.
- Blanket Ghost: Sleepy effects can heal slightly or reduce enemy action.
- Combo Gremlin: Fever gain bonus.
- Square Jester: royal pattern warning appears earlier.

## 12. Content Structure and Naming

Runtime content lives under `src/game/content/`.

Canonical content categories:

```text
heroes
monsters
weapons
spells
relics
upgrades
board-blocks
status-effects
items
oopsies
room-events
random-gameplay-events
stage-goals
chaos-rules
battle-objectives
boss-rules
hub-buildings
friendship
stages
loot-tables
map-nodes
currencies
collectibles
npcs
difficulty-scaling
```

ID rules:

- Use lowercase snake_case.
- Use stable prefixes: `hero_`, `mon_`, `wpn_`, `spl_`, `rel_`, `upg_`, `item_`, `block_`, `status_`, `oops_`, `evt_`, `r_evt_`, `goal_`, `chaos_`, `obj_`, `boss_rule_`, `hub_`, `friend_`, `stage_`, `loot_`, `currency_`, `collectible_`, `npc_`.
- Do not rename IDs without save migration.
- Content references assets by key (`assetKey`, `iconKey`, `spriteKey`) instead of hardcoded paths.

## 13. Save Data

Release 1.0 uses LocalStorage.

Current run state must preserve:

- Selected hero, weapon, spells.
- Relics, upgrades, items, Oopsies.
- Stage, map, current room, room progress.
- Player HP, mana, shield, gold.
- Board state if saved mid-battle.
- Run stats.
- Stage goals.
- Active chaos rule.
- Active battle objective.
- Active random gameplay events.
- Current boss rule.
- Board size modifier.

Meta progress must preserve:

- Unlocked heroes.
- Total gold collected.
- Total cascades.
- Bosses defeated.
- Hub buildings.
- Monster friendship.
- Completed stage goals.
- Discovered chaos rules.
- Discovered boss rules.
- Tutorial completion.
- Settings.

Save rules:

- Save data has a version.
- Migrations fill missing fields safely.
- Corrupt saves do not crash the game.
- Missing content falls back safely.

## 14. Technical Architecture

Expected stack:

```text
Vite
TypeScript
Phaser 3
Capacitor Android
HTML/CSS
LocalStorage
No backend for Release 1.0
```

System ownership:

| System | Responsibility |
| --- | --- |
| `ContentRegistry` | Load/query JSON content with fallbacks. |
| `BoardSystem` | Grid, pieces, collisions, Cascade Gravity, special blocks. |
| `CombatSystem` | Damage, mana, HP, shield, combo, battle resolution. |
| `EnemySystem` | Enemy and boss spawn/scaling/intents. |
| `BossSystem` | Boss phases and boss rewards. |
| `MapSystem` | Stage maps, nodes, availability, completion. |
| `StageSystem` | Stage lookup and progression. |
| `RewardSystem` | Loot tables, reward choices, reward application. |
| `EventSystem` | Room event choice resolution. |
| `OopsieSystem` | Oopsie gain, effects, removal. |
| `HeroSystem` | Hero selection, loadouts, passives. |
| `SaveSystem` | Save/load/migrate current run and meta progress. |
| `AssetSystem` | Manifest-based assets and missing asset fallbacks. |
| `AudioSystem` | SFX/music hooks with mute/fallback support. |
| `InputSystem` | Desktop and mobile controls. |

New replayability systems:

```text
RandomGameplayEventSystem
StageGoalSystem
ChaosRuleSystem
BattleObjectiveSystem
BossRuleSystem
BoardSizeModifierSystem
HubProgressionSystem
FriendshipSystem
```

Scenes should render state and collect input. Systems should own gameplay state changes.

## 15. Asset Direction

Visual identity:

- Pixel-art fantasy festival.
- Bright readable colors.
- Cute monsters.
- Toy-like magic machinery.
- Chunky panels.
- Candy, snack, rune, arcade, pillow, frost, and royal toy motifs.

Asset rules:

- Public assets live under `public/assets/`.
- Content uses asset keys, not raw paths.
- Missing assets must use placeholders.
- Animation PNG frame sequences must use exact frame counts from `docs/ANIMATION_ASSET_REQUIREMENTS.md`.
- Do not use unlicensed third-party art.

## 16. Audio Direction

Audio should feel like a cheerful magical arcade cabinet.

Required SFX hooks:

- Line clear.
- Cascade.
- Spell cast.
- Enemy hit.
- Player hit.
- Reward pick.
- Button tap.
- Boss intro.
- Victory.
- Defeat.
- Shop purchase.
- Item use.

Missing audio should never crash the game.

## 17. Build, Validation, and QA

Core commands:

```bash
npm run validate:content
npm run validate:metadata
npm run build
```

Android commands, when needed:

```bash
npm run android:init
npm run android:sync
npm run android:open
npm run android:build:debug
```

Minimum smoke path:

1. Start a new run.
2. Select Milo.
3. Confirm Stage 1 map has 6 main-path nodes.
4. Enter a battle.
5. Move, rotate, soft drop, hard drop, and hold.
6. Clear a line and verify Cascade Gravity.
7. Cast a spell.
8. Confirm chaos/objective/event text can appear.
9. Defeat enemy and choose reward.
10. Visit event/shop/rest/treasure rooms.
11. Reach a boss and confirm boss rule card.
12. Save, refresh, and continue.

## 18. Marketing and IP Safety

Use these genre terms:

```text
falling-block roguelike RPG
block puzzle RPG
cascade puzzle battler
falling-block combat adventure
arcade puzzle roguelike
```

Do not use trademark-risk language in store copy or marketing. Do not copy official falling-block brand assets, sounds, or exact look-and-feel.

Store pitch:

```text
The Festival of Falling Stars has gone sideways. A magical machine called the Block-O-Matic 3000 has opened a colorful dungeon beneath town square, filling it with falling rune blocks, snack-stealing monsters, and one very bossy block king.

Play as Milo and a cast of quirky heroes in a cheerful falling-block roguelike RPG. Clear lines, trigger Cascade Gravity, cast silly spells, collect relics, and save the festival one combo at a time.
```

## 19. Documentation Policy

This file is the single source of truth.

Supporting docs may exist for workflow, implementation history, or specialized notes, but they must not override this file. If supporting docs drift, update this file first, then either refresh or archive the supporting docs.

Root reference docs:

- `blockmancer_lighthearted_content_direction.md` is the wording and content direction source used to create this master.
- `blockmancer_lighthearted_story.md` is story source material.
- `blockmancer_vibe_code_release_1_plan.md` and `blockmancer_release_1_agent_phase_prompts.md` are planning/prompt references, not canonical design law.

## 20. Definition of Done

A change is done when:

- Build passes or the failure is documented.
- Content validation passes if content changed.
- Existing core gameplay remains playable.
- Cascade Gravity remains the board identity.
- Mobile portrait readability is preserved.
- New content is data-driven where practical.
- Missing content/assets have safe fallbacks.
- Save compatibility is considered.
- Player-facing wording follows the cheerful festival tone.


## 21. Difficulty and Reactive Counterplay Expansion

The current difficulty target is higher board pressure with fair counterplay. Do not raise difficulty only by increasing enemy HP, enemy damage, or fall speed. Difficulty should come from readable setbacks that force the player to react with cascades, spells, items, relics, hero passives, and positioning.

Design principle:

```text
Harder does not mean random punishment.
Harder means the board creates a problem, warns the player, and offers multiple ways to solve it.
```

Every major setback should have:

- A readable warning.
- A short counter window measured in pieces, turns, or enemy intent ticks.
- At least one item counter.
- At least one spell, relic, hero passive, or cascade counter.
- A failure result that is challenging but not a soft-lock.
- Cheerful festival-flavored wording.

### 21.1 New Difficulty Pressure Mechanics

| ID | Name | Type | Effect | Main Counterplay |
| --- | --- | --- | --- | --- |
| `block_floaty_rune` | Floaty Rune | Hazard block | Floats for 3 pieces, then drops as junk if ignored. | `item_cloud_pin`, `item_balloon_pop`, Bomb Rune, Clean Cut, nearby cascade. |
| `block_cloud_junk` | Cloud Junk | Floating junk | Hovers above a column, then falls into the lowest valid space. | Floating counters, clear target column, reroll/hold. |
| `block_locked_rune` | Locked Rune | Hazard block | Cannot move, fall, or cascade until unlocked or broken. | `item_goblin_wrench`, Clean Cut, Bomb Rune. |
| `block_cracked_junk` | Cracked Junk | Durable junk | Requires 2 clear hits or 1 bomb hit. | Bomb Rune, Snack Vacuum, Deluxe Block Polish. |
| `hazard_incoming_junk_queue` | Incoming Junk Queue | Enemy pressure | Enemy prepares junk in a warning tray. Cascades reduce it before it drops. | Cascade, `item_snack_shield`, `item_return_stamp`, `item_trash_lid`. |
| `hazard_bad_piece_delivery` | Bad Piece Delivery | Queue pressure | Enemy injects one awkward piece into the next queue. | Hold, Rainbow Reroll, `item_nope_stamp`, `item_queue_comb`. |
| `hazard_low_ceiling` | Low Ceiling | Board size pressure | Temporarily shrinks board height for a set number of pieces. | `item_tent_pole`, `item_expanding_tablecloth`, Clean Cut, Safety Net. |
| `hazard_rising_floor` | Snack Flood | Board pressure | Bottom row rises after several pieces or enemy ticks. | Clear low rows, Snack Vacuum, Clean Cut, Bomb Rune. |
| `hazard_preview_disruption` | Preview Disruption | Information pressure | Hides, flashes, swaps, or fakes Next/Hold preview. | `item_preview_glasses`, relic warning upgrades, friendship bonuses. |
| `hazard_speed_wave` | Speed Wave | Tempo pressure | Slow fall speed briefly, then spike speed briefly. | Frost Lock, `item_speed_brake`, Nixie passive. |
| `hazard_royal_pattern` | Royal Pattern | Boss pressure | King Bloxley creates pattern blocks or symmetry checks. | Royal Eraser, Clean Cut, Star/Cascade setup. |

### 21.2 Incoming Junk Queue Rules

Enemy junk should usually enter a warning queue before landing.

```text
1. Enemy announces incoming junk.
2. UI shows incoming junk amount and timer.
3. Player has a counter window.
4. Cascades reduce incoming junk.
5. Items can delay, cancel, convert, or reflect junk.
6. Remaining junk falls onto the board.
```

Recommended reduction:

| Player Action | Incoming Junk Reduction |
| --- | ---: |
| Single line clear | -1 junk |
| Cascade 1 | -2 junk |
| Cascade 2 | -4 junk |
| Cascade 3 | -6 junk |
| Cascade 4+ | Cancel all incoming junk and weaken enemy intent |
| Bomb block clear | -2 junk |
| Star block in cascade | Additional -1 junk per star block |

Failure result:

```text
Remaining junk drops as crumb junk, cracked junk, or stage-themed hazard blocks.
```

No incoming junk drop may instantly end the run unless the board was already in overflow danger and the player had a clear warning.

### 21.3 Floating Block Rules

Floating blocks create temporary space denial.

```text
- Spawn as a hovering cell or ghosted block marker.
- Does not fall during normal gravity for a short window.
- Shows a countdown marker.
- If cleared, bombed, pinned, or pulled, it resolves safely.
- If ignored, it drops as junk or stage-themed hazard.
```

Recommended defaults:

| Room Type | Float Count | Counter Window |
| --- | ---: | ---: |
| Stage 1 tutorial/event | 1 | 4 pieces |
| Normal battle Stage 2-4 | 1-2 | 3 pieces |
| Elite battle | 2-3 | 2-3 pieces |
| Boss phase | 2-4 | Boss-specific |
| Stage 6 royal phase | 2 royal floaters | 2 pieces |

### 21.4 Stage Difficulty Ramp

| Stage | New Challenge Direction |
| ---: | --- |
| 1 | Light sticky blocks, first float tutorial, 1-2 incoming junk warnings, simple cascade objective. |
| 2 | Regular junk queue, bomb risk/reward, board shake, floating blocks from goblin machines, low-ceiling elite modifier. |
| 3 | Ice slide, freeze warnings, hold-preview disruption, speed waves. |
| 4 | Sleepy pressure, soft blocks, shield enemies, blanket/tangle zones. |
| 5 | Combo targets, no-cascade punishment, Fever pressure, preview flashes, arcade score checks. |
| 6 | Royal blocks, symmetry checks, floating royal blocks, pattern junk, low ceiling plus incoming junk overlaps in boss/elite rooms only. |

### 21.5 Difficulty Fairness Rules

- Stages 1-2 should introduce one pressure mechanic at a time.
- Stages 3-4 may combine two light pressure mechanics.
- Stages 5-6 may combine two major pressure mechanics, especially in elite and boss rooms.
- Never hide Next, Hold, and Inventory at the same time.
- Never apply freeze, low ceiling, and rising floor simultaneously.
- Every hazard must have readable UI text and at least one practical response.
- Failure should create a worse board state, not an immediate unavoidable loss.
- Counterplay through cascades should remain possible even without the perfect item.

## 22. Reactive Item, Spell, and Relic Counter System

Items are not only healing or mana consumables. Items should be tactical reactions to board hazards and enemy pressure. Spells and relics should also share this counterplay language.

Core loop:

```text
Hazard appears -> warning window opens -> player reacts with cascade, item, spell, relic, or hero passive -> hazard resolves or becomes a setback.
```

### 22.1 Counter Tags

Use counter tags to connect hazards, items, spells, relics, upgrades, and hero passives.

```ts
type CounterTag =
  | "counter_junk"
  | "counter_sticky"
  | "counter_float"
  | "counter_freeze"
  | "counter_preview"
  | "counter_speed"
  | "counter_sleep"
  | "counter_incoming_junk"
  | "counter_low_ceiling"
  | "counter_royal"
  | "counter_pattern"
  | "counter_board_size"
  | "counter_piece_queue";
```

Hazards should declare the counter tags they respond to. Items, spells, relics, upgrades, and hero passives should declare the counter tags they can answer.

### 22.2 Reactive Item Fields

Recommended item content fields:

```ts
type ItemCategory =
  | "heal"
  | "mana"
  | "board_cleanse"
  | "hazard_counter"
  | "spell_catalyst"
  | "queue_control"
  | "enemy_pressure"
  | "emergency"
  | "risk_reward";

type ItemTiming =
  | "instant"
  | "before_spell"
  | "after_hazard"
  | "during_enemy_warning"
  | "before_piece_lock"
  | "map_only"
  | "shop_only";

type ReactiveItemContent = {
  id: string;
  name: string;
  description: string;
  itemCategory: ItemCategory;
  counterTags: CounterTag[];
  timing: ItemTiming;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  maxStack: number;
  spellSynergyTags?: string[];
  effectConfig: Record<string, unknown>;
  assetKey?: string;
  iconKey?: string;
};
```

### 22.3 Reactive Items

| Item ID | Name | Category | Timing | Counter Tags | Effect |
| --- | --- | --- | --- | --- | --- |
| `item_snack_vacuum` | Snack Vacuum | `board_cleanse` | `instant` | `counter_junk` | Remove up to 5 junk blocks from a chosen area. |
| `item_festival_mop` | Festival Mop | `board_cleanse` | `instant` | `counter_sticky` | Remove Sticky from one selected row or column. |
| `item_block_polish_plus` | Deluxe Block Polish | `board_cleanse` | `instant` | `counter_junk`, `counter_sticky` | Convert 4 junk/sticky blocks into normal rune blocks. |
| `item_royal_eraser` | Royal Eraser | `hazard_counter` | `instant` | `counter_royal`, `counter_pattern` | Downgrade 2 royal blocks into normal blocks. |
| `item_tiny_broom` | Tiny Broom | `emergency` | `instant` | `counter_junk`, `counter_board_size` | Clear the top 2 occupied cells in one column. |
| `item_sprinkle_shovel` | Sprinkle Shovel | `board_cleanse` | `instant` | `counter_junk` | Dig out 1 bottom-row cell and let above blocks fall. |
| `item_goblin_wrench` | Goblin Wrench | `hazard_counter` | `instant` | `counter_freeze`, `counter_pattern` | Break one locked or frozen block. |
| `item_jelly_sponge` | Jelly Sponge | `hazard_counter` | `after_hazard` | `counter_board_size` | Stabilize jelly/soft/wobbly blocks for 5 pieces. |
| `item_cloud_pin` | Cloud Pin | `hazard_counter` | `after_hazard` | `counter_float` | Force all floating blocks to fall immediately as normal blocks. |
| `item_balloon_pop` | Balloon Pop | `risk_reward` | `after_hazard` | `counter_float` | Destroy all floating blocks, but add 1 junk next enemy tick. |
| `item_anchor_cookie` | Anchor Cookie | `hazard_counter` | `during_enemy_warning` | `counter_float` | Next 3 floating blocks spawn as normal blocks instead. |
| `item_sky_hook` | Sky Hook | `queue_control` | `after_hazard` | `counter_float`, `counter_piece_queue` | Pull one floating block into Hold as a bonus piece. |
| `item_trash_lid` | Trash Lid | `enemy_pressure` | `during_enemy_warning` | `counter_incoming_junk` | Block the next incoming junk drop by 50%. |
| `item_snack_shield` | Snack Shield | `enemy_pressure` | `during_enemy_warning` | `counter_incoming_junk` | Delay incoming junk by 3 pieces. |
| `item_return_stamp` | Return Stamp | `enemy_pressure` | `during_enemy_warning` | `counter_incoming_junk` | Reflect half of incoming junk as enemy damage. |
| `item_cleanup_coupon` | Cleanup Coupon | `risk_reward` | `during_enemy_warning` | `counter_incoming_junk`, `counter_junk` | Cancel incoming junk if the player clears a line within 2 pieces. |
| `item_crumby_compost` | Crumby Compost | `risk_reward` | `during_enemy_warning` | `counter_incoming_junk` | 50% chance to convert incoming junk into sprinkle blocks. |
| `item_preview_glasses` | Preview Glasses | `hazard_counter` | `after_hazard` | `counter_preview` | Reveal hidden Next and Hold for 5 pieces. |
| `item_hold_coupon_plus` | Deluxe Hold Coupon | `queue_control` | `instant` | `counter_piece_queue` | Refresh Hold and allow one extra Hold this piece. |
| `item_queue_comb` | Queue Comb | `queue_control` | `instant` | `counter_piece_queue`, `counter_preview` | Reorder the next 3 pieces. |
| `item_rainbow_receipt` | Rainbow Receipt | `queue_control` | `instant` | `counter_piece_queue` | Reroll active piece and Next piece. |
| `item_piece_whistle` | Piece Whistle | `queue_control` | `instant` | `counter_piece_queue` | Call a simple square or straight piece next. |
| `item_nope_stamp` | Nope Stamp | `hazard_counter` | `during_enemy_warning` | `counter_piece_queue` | Delete the next enemy-injected bad piece. |
| `item_warm_mittens` | Warm Mittens | `hazard_counter` | `during_enemy_warning` | `counter_freeze` | Prevent Freeze for 8 pieces. |
| `item_hot_cocoa` | Hot Cocoa | `hazard_counter` | `after_hazard` | `counter_freeze` | Instantly unfreeze active piece and gain small mana. |
| `item_alarm_cookie` | Alarm Cookie | `hazard_counter` | `after_hazard` | `counter_sleep` | Remove Sleepy and prevent the next Sleepy. |
| `item_comfy_blanket` | Comfy Blanket | `emergency` | `after_hazard` | `counter_sleep` | Reduce enemy damage while Sleepy is active. |
| `item_speed_brake` | Speed Brake | `hazard_counter` | `after_hazard` | `counter_speed` | Slow fall speed for 6 pieces. |
| `item_sugar_socks` | Sugar Socks | `hazard_counter` | `during_enemy_warning` | `counter_speed` | Movement remains responsive during speed waves. |
| `item_tent_pole` | Tent Pole | `hazard_counter` | `after_hazard` | `counter_low_ceiling`, `counter_board_size` | Cancel Low Ceiling for this battle. |
| `item_expanding_tablecloth` | Expanding Tablecloth | `emergency` | `after_hazard` | `counter_board_size` | Add +1 board height for 10 pieces. |
| `item_safety_net` | Safety Net | `emergency` | `before_piece_lock` | `counter_board_size`, `counter_low_ceiling` | If board overflows, clear top row once. |
| `item_pocket_ladder` | Pocket Ladder | `board_cleanse` | `instant` | `counter_board_size` | Move one selected column down by 2 cells if space exists. |
| `item_corner_cutter` | Corner Cutter | `board_cleanse` | `instant` | `counter_pattern`, `counter_royal` | Clear one awkward corner cluster. |

### 22.4 Spell Catalyst Items

Spell catalyst items make item-spell combos valuable.

| Item ID | Name | Timing | Combo Spell | Effect |
| --- | --- | --- | --- | --- |
| `item_firecracker_sugar` | Firecracker Sugar | `before_spell` | Fireball | Next fire spell also burns sticky/junk blocks. |
| `item_frosting_salt` | Frosting Salt | `before_spell` | Frost Lock | Next frost spell converts ice blocks to normal blocks. |
| `item_bomb_fuse` | Bomb Fuse | `before_spell` | Bomb Rune | Next Bomb Rune radius +1. |
| `item_star_syrup` | Star Syrup | `before_spell` | Star Spark | Next spell creates 1 star block. |
| `item_cascade_confetti` | Cascade Confetti | `before_spell` | Cascade Cheer | Next cascade gives double Fever. |
| `item_spell_coupon` | Spell Coupon | `before_spell` | Any spell | Next spell costs 50% less mana. |
| `item_mana_straw` | Mana Straw | `instant` | Mana/sprinkle synergy | Convert 3 sprinkle blocks into mana instantly. |
| `item_cleaning_charm` | Cleaning Charm | `before_spell` | Clean Cut | Next Clean Cut also removes junk/sticky. |

### 22.5 Hazard Counter Windows

Recommended hazard content shape:

```ts
type HazardCounterWindow = {
  hazardId: string;
  name: string;
  warningText: string;
  counterTags: CounterTag[];
  counterWindowPieces: number;
  severity: "minor" | "moderate" | "major" | "boss";
  defaultFailureEffect: string;
  itemCounterHints: string[];
  spellCounterHints: string[];
  cascadeCounterHint?: string;
};
```

Initial hazard windows:

| Hazard ID | Warning Text | Counter Window | Failure Effect |
| --- | --- | ---: | --- |
| `hazard_floaty_rune` | A Floaty Rune is wobbling overhead! | 3 pieces | Drops as crumb junk. |
| `hazard_incoming_junk_queue` | Crumb junk is lining up in the snack tray! | 2-4 pieces | Remaining junk drops onto random columns. |
| `hazard_freeze_warning` | Frost is gathering around your active block! | 1-2 pieces | Active piece freezes briefly. |
| `hazard_preview_hidden` | A Sugar Bat is blocking your preview! | 3 pieces | Next/Hold preview hidden or flashed. |
| `hazard_low_ceiling` | The ceiling is getting suspiciously lower! | 5-8 pieces | Board height shrinks temporarily. |
| `hazard_royal_pattern` | Bloxley demands a proper rectangle! | Boss phase | Royal blocks or symmetry check appears. |
| `hazard_bad_piece_delivery` | A goblin put something weird in the queue! | 1-2 pieces | Awkward piece enters next queue. |
| `hazard_speed_wave` | The floor is wobbling faster! | 3-6 pieces | Fall speed spikes. |

### 22.6 Item, Spell, Relic, and Cascade Interaction Rules

- Cascades are the baseline free counter to incoming junk and some pattern pressure.
- Items are targeted counters and emergency tools.
- Spells are stronger but spend mana.
- Relics improve a counter style over the whole run.
- Hero passives make specific counter styles more reliable.

Examples:

```text
Sticky Spill:
- Item counter: Festival Mop.
- Spell counter: Fireball, Clean Cut, Bomb Rune.
- Relic synergy: Sticky Sticker makes cleared sticky blocks grant mana.
- Hero synergy: Pippa burns sticky/junk with fire spells.
```

```text
Incoming Junk Queue:
- Cascade counter: cascade chains reduce incoming junk before it lands.
- Item counter: Snack Shield, Trash Lid, Return Stamp.
- Spell counter: Bomb Rune or Clean Cut after junk lands.
- Relic synergy: Star Cookie improves cascade counter value.
```

```text
Low Ceiling:
- Item counter: Tent Pole, Expanding Tablecloth, Safety Net.
- Spell counter: Clean Cut.
- Hero synergy: Bruk can survive overflow once.
```

### 22.7 Inventory and Balance Rules

- Default inventory slots remain 6.
- Common reactive items may stack to 3.
- Strong emergency items should stack to 1.
- Boss-counter items should be rare.
- Spell catalyst items should be uncommon.
- No player can carry every answer at once.
- Shops should sell clear counter identities: cleanup, preview, emergency, spell catalyst, or risky gadget.
- Treasure rooms may offer one targeted counter for the next known boss.

### 22.8 UI Requirements

When a hazard warning is active, the battle UI should show:

- Hazard name.
- Countdown in pieces or enemy ticks.
- Incoming effect preview.
- Available item counters in inventory.
- Available spell counters if enough mana.
- Cascade hint where relevant.

Example:

```text
Incoming: 6 Crumb Junk in 3 pieces
Counters ready: Snack Shield, Return Stamp, Bomb Rune
Cascade hint: Trigger a cascade to reduce incoming junk.
```

Do not overload the main board area with text. Use compact icons, a warning tray, tooltip card, or event log line.

## Change Log

- 2026-05-15: Added difficulty pressure mechanics, floating blocks, incoming junk queue, and Reactive Item/Spell/Relic Counter System.
- 2026-05-15: Rebuilt as the single source of truth and aligned with the lighthearted content direction.
