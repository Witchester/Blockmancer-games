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

## Change Log

- 2026-05-15: Rebuilt as the single source of truth and aligned with the lighthearted content direction.
