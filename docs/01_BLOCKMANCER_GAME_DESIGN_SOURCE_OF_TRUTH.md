# Blockmancer Dungeon — Game Design Source of Truth

**Generated:** 2026-05-20  
**Authority:** Canonical for product identity, tone, gameplay pillars, layout, stages, heroes, route system rules, save requirements, technical direction, and Release 1 design scope.

## Consolidation Summary

This file uses `01_GDD_MASTER_WITH_STORY_FLOW.md` as the primary source because it contains the latest Source of Truth plus story-flow updates. The older `01_GDD_MASTER.md` is treated as historical unless a missing detail is explicitly needed. The lighthearted content direction files remain wording references, but this document is the design authority.

## Design Ownership

Use this file for:

- Project identity and theme.
- Tone guardrails.
- Core board mechanic rules.
- Portrait mobile layout rules.
- Stage, boss, hero, route, and progression design.
- Content structure and naming conventions.
- Release-scope design requirements.

Do not use this file as the source for final production dialogue lines; use the Story/Routes/Dialogue SOT for that.


---

## Primary Canonical Design

**Source file:** `01_GDD_MASTER_WITH_STORY_FLOW.md`

**Consolidation note:** This is the latest design master with story-flow sections included.

### Blockmancer Dungeon - Source of Truth
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### 0. Current Implementation Status Snapshot — 2026-05-18

This section reflects the latest code audit and asset reports. It does not replace the design goals below; it records what is currently implemented versus what still needs work.

##### Implemented now

- Phaser scene flow, board placement, movement, Hold/Next, Cascade Gravity, combat resolution, map routing, reward flow, save/meta migration, debug scene, Android/Capacitor scaffolding, content registry, asset fallback, audio fallback, and exact-frame animation manifest support are implemented.
- Runtime validations pass for content, metadata, and animation definitions.
- Story route docs for six heroes are prepared in `docs/story board/`, including route voice, choice labels, flags, endings, and implementation guidance.
- Asset runtime mapping reports zero unresolved runtime assets, but audio and final animation frame art still require production.

##### Needs implementation before Release 1.0

- Replace placeholder battle objective checks.
- Complete or de-scope unsupported spell content.
- Finish boss mechanics and rule-card effects.
- Finish reactive difficulty end-to-end behavior and soft-lock tests.
- Add final Priority 1 PNG frame assets and real audio files.
- Run desktop + portrait mobile smoke tests.
- Tone-clean legacy curse/blood content names while preserving save compatibility.
- Decide whether hub upgrades and monster friendship are Release 1 core or post-release backlog.
- Implement the character route story flow at runtime: route triggers, route dialogue UI, rewards, save/load, boss callbacks, and hero-specific Normal/True/Risky variant endings.

##### Story route documentation status

- The character-route story flow is now designed in `docs/story board/`.
- The route design covers 6 playable heroes × 6 stages = **36 unique hero-stage route scenes**.
- Each hero-stage scene requires a unique trigger, story focus, choice labels, dialogue voice, route reward, boss callback, and ending contribution.
- Current status is **design/docs ready, runtime implementation pending** unless the code audit later confirms `RouteStorySystem`, route content JSON, dialogue UI, route rewards, boss callbacks, and route endings are wired.

##### Engine decision

Continue using the planned stack: **Phaser 3 + TypeScript + Vite + Capacitor**. The audit shows the current issue is asset/content/completion risk, not an engine limitation.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

This is the single canonical design, content, technical, and release source of truth for Blockmancer Dungeon.

All other markdown files in this repository are supporting notes, historical references, generated prompt packs, or implementation logs. When any doc disagrees with this file, this file wins.

Primary wording source: `blockmancer_lighthearted_content_direction.md`.

#### 1. Project Identity

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

#### 2. Tone Rules

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

#### 3. Core Gameplay Pillars

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

#### 4. Cascade Gravity

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

#### 5. Portrait Mobile Layout

Portrait mobile is the primary target. Desktop preview should use a centered portrait frame.

Battle layout:

Top 25% — Combat UI + Event Log:
- Compact side-view battle panel
- Hero on the left, enemy on the right
- Center action/VFX lane for attacks, spell effects, damage numbers, and cascade callouts
- Hero and enemy sprites positioned high inside the combat area
- Player and enemy names centered directly below their sprites
- Player stats displayed near the hero:
  - HP bar with visible fill and value
  - MP bar with visible fill and value
  - Shield/status chips
- Enemy stats displayed near the enemy:
  - HP bar with visible fill and value
  - Shield/status chips
  - Intent / attack countdown
- Event Log strip stays fully inside the bottom of the combat area
- No separate top HP / Mana / Fever status bar

Middle 55% — Puzzle Gameplay Area:
- Main falling-block board centered as the primary focus
- Hold block panel on the left rail
- Next Queue panel on the left rail
- Next Queue should show 4 upcoming pieces when space allows
- Right rail stat cards:
  - Fever
  - Combo
  - Cascade
  - Lines
  - Score
  - Next Attack
  - Target Effect
- Inventory compact indicator or button
- Board, Hold, Next Queue, and right rail must not be covered by the Event Log

Bottom 20% — Controls / Spells / Actions:
- Two fixed control rows

Row 1 — Falling-block controls:
- Move Left
- Move Right
- Soft Drop
- Rotate
- Hold
- Hard Drop

Row 2 — Spells / Skills / Utility:
- Spell 1
- Spell 2
- Spell 3
- Spell 4
- Skill 1
- Skill 2
- Bag / Inventory
- Settings

Rules:
- Keep the 25 / 55 / 20 section split.
- Combat, puzzle, and controls must not overlap.
- Controls must always remain visible.
- Event Log must stay inside the combat area only.
- Do not use a separate top status bar.
- Use local stat displays near the hero and enemy instead.

Mobile rules:

- Keep the board central and readable.
- Do not permanently hide next, hold, or inventory.
- Prefer compact labels and expandable panels.
- Detailed text belongs in a modal, card, event log, or separate scene.
- Touch targets must be thumb-friendly.

#### 6. Stages, Monsters, and Bosses

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

#### 7. Playable Heroes and Passives

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


#### 7A. Character Route Story Flow

The six playable heroes share the same Brixonia adventure, but each hero must experience it through a different route lens. The route system is a Release 1 narrative feature and should be implemented as data-driven story content, not hardcoded generic scene text.

Source docs live in:

```text
docs/story board/
```

Required route structure:

```text
Selected hero enters stage -> unique hero-stage route trigger appears -> player chooses Practical, True, or Risky response -> route stat/flag updates -> gameplay reward or risk applies -> boss callback reflects route state -> ending resolver checks Normal, True, and Risky Variant conditions after King Bloxley.
```

##### 7A.1 Route Scope

Release 1 route scope is:

```text
6 playable heroes × 6 stages = 36 unique route scenes
```

Each route scene must have:

- A unique scene ID.
- A unique trigger ID.
- A hero-specific story focus.
- Stage-specific build-up.
- Three choices: Practical, True, Risky.
- Unique choice label text.
- Character-specific dialogue voice.
- Functional reward or risk logic.
- Optional boss callback.
- Save/load support through route progress.
- Safe fallback if dialogue, reward, or asset content is missing.

Do not use one generic route event such as "first route event in this stage" for all heroes. The same stage must feel different when played by different heroes.

##### 7A.2 Character Voice Rules

| Hero | Route Arc | Voice Direction |
| --- | --- | --- |
| Milo | Gentle cleanup to truly hearing the dungeon's frightened block-language. | Soft, observant, careful; uses plink-plonk, rhythm, quiet, space, listening, left/right, and conversation imagery. |
| Pippa | Angry protective fire to hearth-warmth that feeds and protects. | Brisk baker voice; uses oven, tray, batch, frosting, crumbs, hearth, preheat, serve, and share language. |
| Zuzu | Field-test chaos to accountable public repair ethics. | Fast goblin engineer; uses prototype, clamps, calibration, patch, override, ledger, warranty, and safety margin language. |
| Nixie | Freezing problems in place to preserving what matters while allowing thaw. | Calm frostbinder; uses chill, thaw, flavor, syrup, preserve, settle, breathe, and slow timing language. |
| Bruk | Guarding the snack table to hospitality as shared protection. | Loyal snack knight; uses oath, table, ration, shield, plate, provision, guest, banquet, and service language. |
| Lumi | Following pretty lights to becoming keeper of wishes and guidance. | Dreamy star witch; uses lanterns, wishes, constellations, shimmer, paper stars, moonlight, and crownlight language. |

Voice QA rule:

```text
If a dialogue line can move between two heroes without changing words, rewrite it.
```

##### 7A.3 Unique Hero-Stage Trigger Matrix

| Stage | Milo | Pippa | Zuzu | Nixie | Bruk | Lumi |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 — Sprinkle Sewers | Frightened block voice beneath sticky sprinkle flow. | Hungry cupcake slime batch is wrongly blamed. | Old quick patch worsens candy pressure valve. | Warm syrup hides inside chilled frosting flow. | Small sugar-rushed slimes need plates, not punishment. | Sprinkle star carries a tiny unnamed wish. |
| 2 — Goblin Workshop | Machines produce pieces that argue in different rhythms. | Goblin oven overheats because it was never taught to rest. | Prototype No. 7 exposes an undocumented override. | Machine needs cooling without being forced silent. | Hungry goblin testers break machines because nobody feeds the shift. | Gears form a machine constellation with one missing light. |
| 3 — Frosty Pantry | Frozen runes speak slowly and teach patience. | Frozen share-crates must be warmed without spoiling food. | Pantry needs a proper thaw protocol. | Lost flavors ask to be named before they melt. | Warm rations save more crates than a shield wall alone. | Melting star ribbon must be carried before its wish fades. |
| 4 — Pillow Castle | Even rooms need rest, not only repair. | Sleepy guards need midnight rolls more than alarms. | Pillow alarm must be repaired with consent, not forced testing. | Sleeping room teaches that quiet is alive. | Pillow Castle has a sacred nap table. | Sleeping window asks to be lit gently, not brightly. |
| 5 — Starfall Arcade | Arcade chimes drown out a small true rhythm. | Prize cake tempts Pippa to win loudly or share fairly. | Score formula must become fair instead of mysterious. | Arcade score should slow down enough for everyone to understand it. | Winning tickets matter less than splitting the prize table honestly. | Arcade wishlight must be shared, not hoarded as a score. |
| 6 — Bloxley's Block Palace | Palace asks whether order is a crown or a shelter. | Bloxley demands a square cake, but structure can have a soft center. | Royal clamps reveal the cost of clever design without safety notes. | Bloxley's hidden corner must thaw before the palace can soften. | Victory is setting Bloxley a place at the table. | Bloxley's crownlight is crooked because it has been carried alone. |

##### 7A.4 Route Choice Lanes

Every route scene has exactly three choices.

| Lane | Purpose | Required Result |
| --- | --- | --- |
| Practical | Safe, useful, normal-route progression. | +1 practical score and a stable reward. No true flag. No oopsie. |
| True | Deeper empathy/accountability/care/wishkeeping route. | +1 true score, exactly one unique stage true flag, and a thoughtful reward or boss modifier. |
| Risky | Stylish festival action with stronger reward and possible setback. | +1 risky score, higher reward, possible Oopsie or hazard increase. Does not override Normal/True Ending. |

##### 7A.5 Route Stats and Ending Rules

Use a generic route progress model so future heroes can be added without new hardcoded save fields.

```ts
type RouteChoiceLane = "practical" | "true" | "risky";

type HeroRouteProgress = {
  heroId: string;
  practicalScore: number;
  trueScore: number;
  riskyScore: number;
  trueFlags: string[];
  chosenScenes: Record<string, RouteChoiceLane>;
  triggeredScenes: string[];
  unlockedEndingIds: string[];
  variantEndingIds: string[];
};

type RouteProgressState = {
  activeHeroId: string;
  routeVersion: number;
  heroes: Record<string, HeroRouteProgress>;
};
```

Recommended thresholds:

```ts
const TRUE_ENDING_MIN_FLAGS = 5;
const TRUE_ENDING_MIN_SCORE = 5;
const VARIANT_MIN_RISK_SCORE = 3;
```

Ending rules:

- Normal Ending: defeat King Bloxley with selected hero without meeting True Ending threshold.
- True Ending: defeat King Bloxley with selected hero, `trueScore >= 5`, and at least 5 true flags.
- Risky Variant: if `riskyScore >= 3`, add a short flavor panel after Normal or True Ending. It must not replace either ending.

##### 7A.6 Runtime Systems Needed

Required systems or equivalent responsibilities:

| System | Responsibility |
| --- | --- |
| `RouteStorySystem` | Select route scenes, enforce unique triggers, resolve choices, apply route rewards, track flags/stats, provide boss callbacks, resolve endings. |
| `DialogueSystem` | Present skippable route dialogue, choice cards, NPC responses, narration, and ending panels in a mobile-readable format. |
| `ContentRegistry` | Load route scene JSON, route endings, barks, voice tags, and fallback route content. |
| `SaveSystem` | Save and migrate route progress safely. |

Suggested content folders:

```text
src/game/content/story/routes/
  route-scenes.milo.json
  route-scenes.pippa.json
  route-scenes.zuzu.json
  route-scenes.nixie.json
  route-scenes.bruk.json
  route-scenes.lumi.json
  route-endings.json
  route-barks.json
  route-voice-tags.json
```

##### 7A.7 Route Reward Rules

Route rewards must be functional. Do not leave them as flavor text only.

Examples by hero:

| Hero | Practical Reward Direction | True Reward Direction | Risky Reward Direction |
| --- | --- | --- | --- |
| Milo | Safer board setup, small mana, reduced simple hazard. | Warning improvement or boss callback advantage. | Rare reward plus possible Oopsie or harder hazard. |
| Pippa | Burn sticky/junk or fire-themed item. | Boss starts with reduced sticky/junk or shared-hearth modifier. | Stronger fire reward plus overheat hazard. |
| Zuzu | Reduce machine/junk hazard. | Improve warning timers or safer gadget behavior. | Bomb reward plus extra junk risk. |
| Nixie | Slow/freeze mitigation. | Larger counter window or preservation reward. | Strong freeze reward plus speed-wave risk. |
| Bruk | Shield or defense. | Hospitality heal/protect/boss-softening reward. | Big charge reward plus board pressure. |
| Lumi | Preview/star guidance. | Cascade/star/wishkeeper bonus. | Rare star reward plus fever or preview pressure risk. |

##### 7A.8 Trigger Rules

Route scene triggers should follow this priority:

1. Trigger once per run for selected hero and stage.
2. Prefer first eligible Event node in the stage.
3. If no Event node appears before the boss, trigger after first normal combat victory.
4. Never trigger during boss combat.
5. Never trigger more than once for the same hero-stage scene in the same run.
6. If content is missing, use `fallback_route_scene` and log a warning without crashing.


#### 8. Board Blocks

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

#### 9. Map Node Scaling

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

#### 10. Dynamic Board Size

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

#### 11. Replayability Systems

##### Random Gameplay Events

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

##### Stage Goals

Each stage has one optional goal. Success can improve rewards or weaken the boss; failure can make the boss slightly harder.

| Stage | Goal | Success | Failure |
| ---: | --- | --- | --- |
| 1 | Recover 3 Lost Cupcakes | Cupcake Slime King starts with fewer sticky blocks. | Extra sticky blocks. |
| 2 | Disable 2 Goblin Machines | Prototype No. 7 drops less junk. | Prototype starts overclocked. |
| 3 | Save 3 Ice Cream Crates | Player starts boss with shield. | Fall speed spike during boss. |
| 4 | Keep 2 Guards Asleep | Rare treasure or reduced sleep effect. | More Sleepy effects in boss. |
| 5 | Reach combo score target | Start boss with partial Fever meter or Fever Ready state only. | Hydra gains extra combo punishment. |
| 6 | Break 3 Royal Seals | King Bloxley starts weakened. | Final boss starts with royal blocks. |

##### Festival Chaos Rules

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

##### Battle Mini-Objectives

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
- Charge and release Fever Showtime safely.

##### Boss Rule Cards

Every boss fight should show a readable card before combat.

Each card includes:

- Boss gimmick title.
- Short description.
- Phase rules.
- Player tip.
- Dismiss button.

##### Oopsie Risk/Reward Choices

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

##### Festival Hub Progression

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

##### Monster Friendship / Collection

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

#### 12. Content Structure and Naming

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

#### 13. Save Data

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
- Route story progress: active hero route, triggered scenes, chosen choices, practical/true/risky scores, and true flags.

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
- Unlocked route endings and risky variant ending panels.

Save rules:

- Save data has a version.
- Migrations fill missing fields safely.
- Corrupt saves do not crash the game.
- Missing content falls back safely.

#### 14. Technical Architecture

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

#### 15. Asset Direction

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

#### 16. Audio Direction

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

#### 17. Build, Validation, and QA

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
3A. Confirm selected hero's unique Stage 1 route trigger appears once before the boss.
4. Enter a battle.
5. Move, rotate, soft drop, hard drop, and hold.
6. Clear a line and verify Cascade Gravity.
7. Cast a spell.
8. Confirm chaos/objective/event text can appear.
9. Defeat enemy and choose reward.
10. Visit event/shop/rest/treasure rooms.
10A. Choose a Practical/True/Risky route option and confirm reward, score, and flag behavior.
11. Reach a boss and confirm boss rule card.
11A. Confirm selected hero's boss callback reflects the route choice when applicable.
12. Save, refresh, and continue.
13. Defeat King Bloxley and verify the selected hero's Normal or True Ending plus any Risky Variant panel.

#### 18. Marketing and IP Safety

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

#### 19. Documentation Policy

This file is the single source of truth.

Supporting docs may exist for workflow, implementation history, or specialized notes, but they must not override this file. If supporting docs drift, update this file first, then either refresh or archive the supporting docs.

Root reference docs:

- `blockmancer_lighthearted_content_direction.md` is the wording and content direction source used to create this master.
- `blockmancer_lighthearted_story.md` is story source material.
- `docs/story board/00_MASTER_CHARACTER_ROUTE_INDEX.md` and individual hero route files are the route-story implementation reference.
- `blockmancer_vibe_code_release_1_plan.md` and `blockmancer_release_1_agent_phase_prompts.md` are planning/prompt references, not canonical design law.

#### 20. Definition of Done

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
- Route scene triggers, route rewards, route saves, and ending checks are validated if story flow content changed.


#### 21. Difficulty and Reactive Counterplay Expansion

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

##### 21.1 New Difficulty Pressure Mechanics

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

##### 21.2 Incoming Junk Queue Rules

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

##### 21.3 Floating Block Rules

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

##### 21.4 Stage Difficulty Ramp

| Stage | New Challenge Direction |
| ---: | --- |
| 1 | Light sticky blocks, first float tutorial, 1-2 incoming junk warnings, simple cascade objective. |
| 2 | Regular junk queue, bomb risk/reward, board shake, floating blocks from goblin machines, low-ceiling elite modifier. |
| 3 | Ice slide, freeze warnings, hold-preview disruption, speed waves. |
| 4 | Sleepy pressure, soft blocks, shield enemies, blanket/tangle zones. |
| 5 | Combo targets, no-cascade punishment, Fever pressure, preview flashes, arcade score checks. |
| 6 | Royal blocks, symmetry checks, floating royal blocks, pattern junk, low ceiling plus incoming junk overlaps in boss/elite rooms only. |

##### 21.5 Difficulty Fairness Rules

- Stages 1-2 should introduce one pressure mechanic at a time.
- Stages 3-4 may combine two light pressure mechanics.
- Stages 5-6 may combine two major pressure mechanics, especially in elite and boss rooms.
- Never hide Next, Hold, and Inventory at the same time.
- Never apply freeze, low ceiling, and rising floor simultaneously.
- Every hazard must have readable UI text and at least one practical response.
- Failure should create a worse board state, not an immediate unavoidable loss.
- Counterplay through cascades should remain possible even without the perfect item.

#### 22. Reactive Item, Spell, and Relic Counter System

Items are not only healing or mana consumables. Items should be tactical reactions to board hazards and enemy pressure. Spells and relics should also share this counterplay language.

Core loop:

```text
Hazard appears -> warning window opens -> player reacts with cascade, item, spell, relic, or hero passive -> hazard resolves or becomes a setback.
```

##### 22.1 Counter Tags

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

##### 22.2 Reactive Item Fields

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

##### 22.3 Reactive Items

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

##### 22.4 Spell Catalyst Items

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

##### 22.5 Hazard Counter Windows

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

##### 22.6 Item, Spell, Relic, and Cascade Interaction Rules

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

##### 22.7 Inventory and Balance Rules

- Default inventory slots remain 6.
- Common reactive items may stack to 3.
- Strong emergency items should stack to 1.
- Boss-counter items should be rare.
- Spell catalyst items should be uncommon.
- No player can carry every answer at once.
- Shops should sell clear counter identities: cleanup, preview, emergency, spell catalyst, or risky gadget.
- Treasure rooms may offer one targeted counter for the next known boss.

##### 22.8 UI Requirements

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


#### 23. Sequential Encounter Packs and Festival Level-Up Progression

**Added:** 2026-05-22  
**Authority:** Canonical design rule for multi-enemy battle nodes, biome-based monster pools, enemy entry pressure/gift effects, combat-only XP gain, and stackable JRPG-style level-up upgrades.

##### 23.1 Design Goal

Battle nodes may contain more than one monster, but the player fights them **sequentially**, one active monster at a time. This keeps the compact JRPG battle panel readable, preserves Cascade Gravity as the board identity, and makes later stages longer and more strategic without creating unfair simultaneous enemy pressure.

Core rule:

```text
One battle node may contain 1-5 enemies.
Only one enemy is active at a time.
The next enemy enters only after the current enemy is defeated.
The node is clear only after the full encounter pack is defeated.
```

This system must not raise difficulty only through HP and attack inflation. It must combine readable encounter length, stage-themed hazards, counterplay, small entry gifts, and long-term character growth.

##### 23.2 Biome Monster Pools

Encounter packs must be generated from the current stage/biome monster pool. Do not hardcode exact node enemy lists except for tutorials, scripted story battles, royal guard/mini-boss nodes, or boss encounters.

```ts
type MonsterRole = "starter" | "pressure" | "support" | "finisher";

type WeightedMonsterRule = {
  monsterId: string;
  weight: number;
  roles: MonsterRole[];
  minNodeDepthPercent?: number;
  maxNodeDepthPercent?: number;
  allowedNodeTypes?: ("normal" | "elite" | "event_battle")[];
  bannedWithTags?: string[];
};

type BiomeMonsterPool = {
  stageId: string;
  biomeId: string;
  monsterRules: WeightedMonsterRule[];
  maxDuplicatePerNode: number;
  recentMonsterMemoryCount: number;
  bannedPairTags?: string[];
};
```

Generator inputs:

```text
stageId + biomeId + nodeType + nodeDepthPercent + runDifficulty + recentMonsterHistory + encounterBudget
```

Generator rules:

- Pull monsters only from the current stage/biome pool unless a scripted event explicitly overrides it.
- Avoid repeated monsters inside one node unless the pool is too small or the node intentionally represents a swarm.
- Avoid repeating the same monster across too many nearby nodes by using `recentMonsterMemoryCount`.
- Stage 1 must favor `starter` and light `pressure` roles.
- Elite nodes may include stronger `pressure`, `support`, and `finisher` roles.
- Boss nodes remain boss-specific and do not use normal random packs unless the boss explicitly summons helpers in a future design.

##### 23.3 Encounter Pack Data Model

```ts
type NodeEncounterPack = {
  encounterPackId: string;
  nodeId: string;
  stageId: string;
  biomeId: string;
  nodeType: "normal" | "elite" | "boss" | "event_battle" | "royal_guard";
  enemies: EncounterEnemyEntry[];
  currentEnemyIndex: number;
  totalHpBudgetMultiplier: number;
  totalAttackBudgetMultiplier: number;
  maxActiveHazards: number;
  rewardsGrantedOnlyOnNodeClear: true;
  breatherRewardPolicy: BreatherRewardPolicy;
};

type EncounterEnemyEntry = {
  enemyId: string;
  role: MonsterRole;
  hpMultiplier: number;
  attackMultiplier: number;
  entryEffectId?: string;
  entryGracePieces: number;
  xpValueMultiplier: number;
};
```

Recommended node HP budget:

| Enemies in node | Total node HP budget | Per-enemy tuning direction |
| ---: | ---: | --- |
| 1 | 100% | Current single-enemy behavior. |
| 2 | 150-165% | Each enemy usually 70-85% of a normal single-node enemy. |
| 3 | 190-220% | One medium enemy plus two weaker enemies, or three carefully tuned light enemies. |

Recommended enemy-count ramp:

| Stage | Normal node enemy count | Elite / royal guard enemy count | Notes |
| ---: | ---: | ---: | --- |
| 1 | 1 early, 1-2 late | No elite | First multi-enemy node should appear late and remain gentle. |
| 2 | 1-2 | 2 | Introduce sequencing and junk pressure. |
| 3 | 1-2 | 2 | Higher HP with freeze/speed warning windows. |
| 4 | 2 | 2-3 | Shield/Sleepy pressure, still readable. |
| 5 | 2-3 | 3 | Combo/Fever pressure and stronger sustain needs. |
| 6 | 2-3 | 3 | Royal guard and final-stage strategic pressure. |

##### 23.4 Sequential Battle Rules

When the active enemy is defeated:

```text
Defeat animation / poof
-> freeze outgoing enemy intent
-> grant capped breather reward if not final enemy
-> reveal or partially reveal next enemy
-> spawn next enemy
-> reset enemy attack counter
-> apply entry grace
-> apply entry pressure + player gift
-> continue battle on the same board
```

Rules:

- The active board state persists between enemies in the same node.
- Player HP, MP, shield, Fever, inventory, Oopsies, and active run modifiers persist through the full node.
- Enemy attack counters reset on enemy entry.
- New enemies must get a safe entry grace window before their first attack unless the node is a late elite/royal guard with explicit warning.
- Rewards, map completion, route fallback triggers, and node-clear XP screens happen only after the full encounter pack is defeated.
- If save/load happens mid-node, the save must preserve the encounter pack, active enemy index, active enemy HP, queued enemy entries, and active warning state.

Recommended entry grace:

| Stage | Normal enemy entry grace | Elite / royal guard entry grace |
| ---: | ---: | ---: |
| 1 | +2 piece locks | n/a |
| 2 | +2 | +1 |
| 3 | +1-2 | +1 |
| 4 | +1 | +1 |
| 5 | +1 | 0-1 |
| 6 | +1 | 0-1 |

##### 23.5 Enemy Entry Pressure + Player Gift

A new enemy entry should not be only punishment. It should be a small readable pressure paired with a small player-positive gift.

```ts
type EnemyEntryEffect = {
  id: string;
  pressureEffectId?: string;
  playerGiftEffectId?: string;
  entryGracePieces: number;
  warningText: string;
  eventLogText: string;
};
```

| Enemy entry type | Enemy pressure | Player-positive gift |
| --- | --- | --- |
| Sticky enemy enters | Sticky warning or one sticky preview marker. | Spawn one sprinkle block or grant +2 mana. |
| Junk enemy enters | Queue 1-2 incoming junk with visible countdown. | Add one cracked junk that deals bonus damage when cleared, or grant +1 shield. |
| Fast enemy enters | Lower starting intent countdown, still with warning. | +1 extra piece-lock grace for this enemy. |
| Shield enemy enters | Enemy gains small shield. | Player gains +2 shield. |
| Freeze enemy enters | Freeze warning appears, not instant freeze. | Next piece falls slower for one piece or player gains +2 mana. |
| Arcade enemy enters | Combo challenge appears. | Fever gain +10% while that enemy is active. |
| Royal enemy enters | Royal pattern warning appears. | One normal rune becomes a star/sprinkle helper if board space allows. |

Entry effects must never cause instant HP damage, instant board overflow, unavoidable freeze, or a hidden hazard.

##### 23.6 Monster Stack UI

The battle UI must show how many enemies remain without overcrowding the combat section.

Placement:

```text
Top 25% combat area, near the enemy side, below or beside the enemy HP/intent area.
```

Runtime icon size:

| Context | Monster stack icon render size |
| --- | ---: |
| Compact phone | 24 px |
| Standard portrait | 28 px |
| Tablet / desktop preview | 32 px |
| Absolute cap | 36 px |

Display rules:

- Active enemy icon is fully visible.
- Next enemy icon is 40-55% visible and tucked behind the active icon.
- Additional enemies use a covered mystery chip such as `+1` or `+2`.
- Do not fully reveal all future enemies unless a special preview reward says so.
- Use monster icon assets through `AssetSystem`; missing icons must fall back safely.

##### 23.7 Breather Rewards and Sustain

Because later nodes may contain multiple enemies, the player needs limited sustain without turning multi-enemy nodes into free healing farms.

```ts
type BreatherRewardPolicy = {
  enabled: boolean;
  trigger: "after_non_final_enemy_defeat";
  maxHealPercentPerNode: number;
  possibleRewards: BreatherReward[];
};

type BreatherReward =
  | { type: "heal_percent"; amount: number }
  | { type: "mana"; amount: number }
  | { type: "shield"; amount: number }
  | { type: "fever"; amount: number };
```

Recommended non-final enemy defeat reward:

| Reward type | Recommended amount |
| --- | ---: |
| HP heal | 2-4% max HP |
| Mana | +2 to +4 |
| Shield | +1 to +3 |
| Fever | +3% to +5% |

Cap:

```text
Maximum mid-node healing: 15% max HP per node.
```

##### 23.8 Festival Level-Up System

Festival Level-Up is a run-based JRPG-style progression system. The player earns XP during combat, but level-up rewards are only presented after the combat node is fully cleared.

```ts
type PlayerLevelState = {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  pendingLevelUps: number;
  chosenUpgrades: Record<string, number>;
  rerollCharges: number;
};
```

XP source recommendations:

| Source | XP |
| --- | ---: |
| Normal enemy defeated | 6-10 |
| Pressure/support enemy defeated | 8-12 |
| Elite enemy defeated | 20-25 |
| Boss defeated | 40-60 |
| Battle mini-objective success | +5 |
| No HP loss bonus | +5 |
| Cascade 3+ bonus | +3 |

XP curve:

```text
Level 1 -> 2: 25 XP
Level 2 -> 3: 35 XP
Level 3 -> 4: 50 XP
Level 4 -> 5: 70 XP
Level 5+: previous threshold +25 XP
```

Rules:

- XP can be earned per enemy, but reward selection happens only after the full node is clear.
- If multiple level-ups are pending, show one choice screen at a time after node clear.
- Level-up upgrades are run upgrades, not permanent meta progression, unless a future SOT explicitly adds meta-leveling.
- Level-up should support builds: line damage, HP, shield, spell, cascade, Fever, hazard-control, and hero identity.


##### 23.8A Node Result Screen

After the full encounter pack is defeated, the game must show a clear **Node Result Screen** before any level-up card choice or normal reward selection.

Purpose:

```text
Show what happened in this node.
Show how much EXP was earned.
Show how much EXP remains until the next level.
If a level-up is ready, clearly tell the player before opening upgrade choices.
```

Recommended flow:

```text
Final enemy defeated
-> Node Clear banner
-> Node Result Screen shows EXP summary and progress bar
-> If pending level-up exists, continue to Festival Level-Up card selection
-> Then continue to normal node rewards / loot / map flow
```

Node Result Screen data shape:

```ts
type NodeResultXpBreakdown = {
  sourceId: string;
  label: string;
  amount: number;
  sourceType: "enemy" | "elite" | "boss" | "objective" | "cascade_bonus" | "no_damage_bonus" | "route_bonus" | "other";
};

type NodeResultSummary = {
  nodeId: string;
  encounterPackId?: string;
  stageId: string;
  nodeType: "normal" | "elite" | "boss" | "event_battle" | "royal_guard";
  enemiesDefeated: string[];
  xpBefore: number;
  xpGained: number;
  xpAfter: number;
  levelBefore: number;
  levelAfterPreview: number;
  xpToNextLevel: number;
  xpRemainingToNextLevel: number;
  pendingLevelUps: number;
  breakdown: NodeResultXpBreakdown[];
};
```

Display requirements:

- Show **Node Cleared!** or node-type-specific equivalent.
- Show enemies defeated count, for example `2 monsters calmed`.
- Show total EXP gained this node, for example `+34 EXP`.
- Show a short EXP breakdown when space allows: enemy EXP, objective bonus, cascade bonus, no-damage bonus, route bonus.
- Show current level and EXP bar.
- Show remaining EXP clearly: `18 EXP to Level 4`.
- If a level-up is ready, replace remaining text with: `Level Up Ready!` and show pending level-up count if more than one.
- Keep all text short and readable on portrait mobile.
- Do not put the result screen over the active board; it should be its own modal/scene after battle resolution.

Fairness and save rules:

- EXP is granted once when the node is cleared, not once when the result screen is opened.
- Reopening or reloading the result screen must not duplicate EXP.
- Save/load must preserve whether node EXP was already applied, the latest `NodeResultSummary`, and pending level-up count.
- If the player closes or skips the result screen, pending level-up and normal node rewards must still resolve safely.
- The result screen must not grant rewards again if the same node has already been marked complete.

##### 23.9 Level-Up Reward Cards

At each level-up, show three random upgrade cards.

| Card type | Target chance |
| --- | ---: |
| General upgrade | 65% |
| Hero-specific upgrade | 25% |
| Rare upgrade | 10% |

Rules:

- Starting at Level 3, try to include at least one card relevant to the selected hero if valid upgrades remain.
- Cards must clearly show current stack count, stack limit, and per-stack effect.
- The player may choose only one card per level-up.
- Rerolls are allowed only if the player has a reroll charge from an upgrade/relic/reward.
- Upgrade effects must have real runtime handlers; do not add upgrade JSON that validates but does nothing.

##### 23.10 General Level-Up Upgrades

Use `upg_` IDs because upgrades are an existing content category.

| Upgrade ID | Name | Stack limit | Effect per stack | Cap / fairness rule |
| --- | --- | ---: | --- | --- |
| `upg_lvl_clear_line_damage` | Cleaner Lines | 8 | Clear line damage +2. | Max +16. |
| `upg_lvl_max_hp_percent` | Bigger Snack Bag | 5 | Max HP +10%. | Max +50%; recalculate current HP safely. |
| `upg_lvl_flat_hp` | Sturdy Apron | 8 | Max HP +6. | Strong early, less scaling late. |
| `upg_lvl_mana_gain` | Lemonade Flow | 5 | Mana gain from clears +1. | Max +5. |
| `upg_lvl_spell_damage` | Sparkly Spells | 6 | Spell damage +8%. | Max +48%; avoid uncapped multiplicative stacking. |
| `upg_lvl_cascade_damage` | Cascade Rhythm | 5 | Cascade damage +6%. | Max +30%; rewards skill. |
| `upg_lvl_starting_shield` | Comfy Guard | 5 | Start each combat with +2 shield. | Max +10. |
| `upg_lvl_heal_after_node` | Snack Break | 5 | Heal 3% max HP after node clear. | Node-clear only; not per enemy. |
| `upg_lvl_fever_gain` | Festival Hype | 5 | Fever gain +8%. | Max +40%. |
| `upg_lvl_hazard_resist` | Careful Stacking | 4 | Hazard duration/effect -5%. | Max 20%; never fully cancels stage mechanics. |
| `upg_lvl_entry_grace` | Breathing Room | 3 | First new enemy per node gets +1 extra attack delay. | Max +3 piece locks. |
| `upg_lvl_reward_reroll` | Lucky Pick | 2 | Gain +1 level-up reroll charge every 2 levels. | Utility only, limited. |

##### 23.11 Hero-Specific Level-Up Upgrades

Hero-specific upgrades should enhance the selected hero's identity, not patch basic survival problems that all heroes need.

| Hero | Upgrade ID | Name | Stack limit | Effect |
| --- | --- | --- | ---: | --- |
| Milo | `upg_lvl_milo_plink_mana` | Plink-Plonk Practice | 4 | First cascade each combat gives +2 extra mana. |
| Milo | `upg_lvl_milo_calm_board` | Calm Little Board | 3 | After enemy entry, 15% chance to convert one hazard block to normal if safe. |
| Milo | `upg_lvl_milo_listener` | Listener's Rhythm | 3 | Cascade 2+ gives +1 shield. |
| Milo | `upg_lvl_milo_gentle_finish` | Gentle Finish | 2 | Defeating an enemy heals 2 HP, max once per enemy. |
| Pippa | `upg_lvl_pippa_preheat` | Preheat Properly | 4 | Fire spell damage +10%. |
| Pippa | `upg_lvl_pippa_burn_sticky` | Toasty Cleanup | 3 | Fire spells clear +1 sticky or junk block. |
| Pippa | `upg_lvl_pippa_oven_guard` | Oven Mitt Guard | 3 | Gain +2 shield after casting a fire spell. |
| Pippa | `upg_lvl_pippa_hot_combo` | Hot Batch Combo | 2 | First spell after Cascade 2+ costs 20% less mana. |
| Zuzu | `upg_lvl_zuzu_bomb_friend` | Bombs Are Friends | 4 | Bomb block damage +8%. |
| Zuzu | `upg_lvl_zuzu_safety_clamp` | Safety Clamp | 3 | Bomb-related junk side effects reduced by 20%. |
| Zuzu | `upg_lvl_zuzu_extra_fuse` | Extra Fuse | 3 | Bomb effects reduce incoming junk by +1. |
| Zuzu | `upg_lvl_zuzu_gadget_retry` | Warranty Retry | 2 | Once per node, failed risky gadget effect gives +2 shield. |
| Nixie | `upg_lvl_nixie_chill_timing` | Chill Timing | 4 | Freeze/speed hazards last 5% less. |
| Nixie | `upg_lvl_nixie_soft_thaw` | Soft Thaw | 3 | Clearing ice grants +1 mana. |
| Nixie | `upg_lvl_nixie_slow_entry` | Slow the Entrance | 3 | New enemy attack counter +1 delay, once per node. |
| Nixie | `upg_lvl_nixie_preserve` | Preserved Flavor | 2 | If HP drops below 30%, gain +5 shield once per combat. |
| Bruk | `upg_lvl_bruk_snack_armor` | Snack Knight Armor | 5 | Max HP +8. |
| Bruk | `upg_lvl_bruk_table_shield` | Table Shield | 4 | Start combat with +3 shield. |
| Bruk | `upg_lvl_bruk_no_snack_lost` | No Snack Left Behind | 2 | Overflow save restores +5 HP after triggering. |
| Bruk | `upg_lvl_bruk_victory_plate` | Victory Plate | 3 | Defeating an enemy grants +2 shield. |
| Lumi | `upg_lvl_lumi_star_guidance` | Star Guidance | 4 | Star block damage +8%. |
| Lumi | `upg_lvl_lumi_cascade_wish` | Cascade Wish | 3 | Cascade 3+ grants +5% Fever. |
| Lumi | `upg_lvl_lumi_preview_light` | Preview Light | 2 | Preview disruption duration -1 piece. |
| Lumi | `upg_lvl_lumi_wishkeeper` | Wishkeeper Spark | 2 | First Fever trigger each node grants +1 star block if board space allows. |

##### 23.12 Fairness, Save, and Validation Rules

- No upgrade may fully remove a stage mechanic.
- No single upgrade should be mandatory for a fair run.
- Every offensive build path should have a defensive or sustain alternative.
- General upgrades must remain useful for every hero.
- Hero-specific upgrades must remain optional identity amplifiers.
- Stack limits must be enforced at content validation and runtime application.
- Upgrade cards must never offer an upgrade already at max stacks unless the card is explicitly converted into a fallback reward.
- Save data must preserve `PlayerLevelState`, pending level-ups, chosen upgrade stacks, current encounter pack state, active enemy index, active enemy HP, and remaining enemies.
- Missing upgrade content or handlers must fall back safely and log a development warning.
- Content validation must check effect IDs against supported runtime handlers, not only JSON shape.


#### Change Log

- 2026-05-22: Added Sequential Encounter Packs, biome-based monster pool generation, enemy entry pressure/gift effects, monster stack UI rules, limited mid-node breather rewards, Node Result Screen EXP summary, and the Festival Level-Up system with stackable general and hero-specific upgrades.

- 2026-05-18: Added character route story flow requirements: 36 unique hero-stage route scenes, route triggers, dialogue choices, route rewards, save state, boss callbacks, and hero Normal/True/Risky variant endings.

- 2026-05-15: Added difficulty pressure mechanics, floating blocks, incoming junk queue, and Reactive Item/Spell/Relic Counter System.
- 2026-05-15: Rebuilt as the single source of truth and aligned with the lighthearted content direction.


---

## Supporting Content Direction Reference

**Source file:** `blockmancer_lighthearted_content_direction_UPDATED.md`

**Consolidation note:** Use for tone/content wording when expanding JSON content or writing flavor, but do not override the primary canonical design above.

### Blockmancer Dungeon — Lighthearted Content Direction Pack

Use this document as a content direction reference or paste it into a Codex/Cursor/Windsurf prompt.

---

#### 1. New Core Concept

**Blockmancer Dungeon** is a cheerful falling-block roguelike RPG where a magical festival machine called the **Block-O-Matic 3000** goes haywire and creates a colorful dungeon beneath the town square.

The player clears rune block lines, triggers **Cascade Gravity** combos, casts silly spells, collects snacks, relics, upgrades, and unlocks quirky heroes while trying to save the **Festival of Falling Stars** from **King Bloxley**, the self-appointed Block King.

##### Tone

- Cheerful fantasy
- Cute chaos
- Festival adventure
- Funny monsters
- Cozy arcade energy
- Pixel-art 32-bit style
- Bright, playful, readable
- No edgy/dark tragedy
- No grim curse tone

##### Core Theme

> Creativity fixes chaos better than control.

##### Core Fantasy

The player is not saving the world from doom.  
The player is saving a magical festival from becoming a giant blocky mess.

---

#### 2. Content Categories Needed

The game should support these data-driven content categories:

```text
heroes
monsters
bosses
weapons
spells
relics
upgrades
board-blocks
status-effects
items
inventory
room-events
shops
treasures
oopsies / silly drawbacks
stages / biomes
loot-tables
npc
currencies
collectibles
achievements
tutorials
asset keys
```

---

#### 3. Stages / Biomes

##### Stage 1 — Sprinkle Sewers

Theme: Candy sewers under the festival, cupcake slime, rainbow water pipes, frosting blobs.

```text
Main mechanic:
- Sticky blocks
- Sprinkle blocks
- Bonus mana from candy blocks
```

Monsters:

```text
mon_cupcake_slime
mon_sugar_bat
mon_crumb_goblin
mon_jelly_rat
mon_sprinkle_snail
mon_frosting_blob
```

Boss:

```text
boss_cupcake_slime_king
```

---

##### Stage 2 — Goblin Workshop

Theme: Goblin machines, conveyor belts, springs, toy bombs, warning signs that say “Totally Safe”.

```text
Main mechanic:
- Junk blocks
- Bomb blocks
- Board shake
- Random gadget effects
```

Monsters:

```text
mon_wrench_goblin
mon_button_masher
mon_spring_bot
mon_spark_gremlin
mon_gear_slime
mon_rattle_drone
```

Boss:

```text
boss_prototype_no_7
```

---

##### Stage 3 — Frosty Pantry

Theme: Magical freezer, rainbow ice cream, cold pudding, sliding ice blocks.

```text
Main mechanic:
- Ice blocks
- Slow / fast fall speed waves
- Freeze active block
```

Monsters:

```text
mon_ice_cream_imp
mon_popsicle_bat
mon_chill_slime
mon_freezer_mimic
mon_snowcone_sprite
mon_pudding_penguin
```

Boss:

```text
boss_gelato_golem
```

---

##### Stage 4 — Pillow Castle

Theme: Pillow castle, living toys, plush dragons, blanket ghosts, button knights.

```text
Main mechanic:
- Soft blocks
- Shield enemies
- Sleep status
```

Monsters:

```text
mon_button_knight
mon_blanket_ghost
mon_plush_dragon
mon_toy_soldier
mon_pillow_squire
mon_sock_sprite
```

Boss:

```text
boss_sir_snore_a_lot
```

---

##### Stage 5 — Starfall Arcade

Theme: Magical arcade, neon lights, living game machines, prize claw mimics.

```text
Main mechanic:
- Fever meter
- Cascade bonus
- Combo challenge
```

Monsters:

```text
mon_token_sprite
mon_combo_gremlin
mon_neon_bat
mon_prize_claw_mimic
mon_pixel_blob
mon_joystick_jester
```

Boss:

```text
boss_high_score_hydra
```

---

##### Stage 6 — Bloxley’s Block Palace

Theme: Giant block palace, confetti, toy royal guards, square banners, symmetry obsession.

```text
Main mechanic:
- Royal blocks
- Symmetry challenge
- Pattern junk
- Final cascade check
```

Monsters:

```text
mon_royal_block_guard
mon_square_jester
mon_crown_bat
mon_parade_golem
mon_confetti_mage
mon_banner_bug
```

Final Boss:

```text
boss_king_bloxley
```

---

#### 4. Boss List

| ID                        | Name               | Stage | Personality                    | Main Mechanic           |
| ------------------------- | ------------------ | ----: | ------------------------------ | ----------------------- |
| `boss_cupcake_slime_king` | Cupcake Slime King |     1 | Hungry and adorable            | Sticky blocks           |
| `boss_prototype_no_7`     | Prototype No. 7    |     2 | Broken machine with confidence | Junk + bomb blocks      |
| `boss_gelato_golem`       | Gelato Golem       |     3 | Cool, slow, melty              | Ice/freeze              |
| `boss_sir_snore_a_lot`    | Sir Snore-a-Lot    |     4 | Sleepy pillow knight           | Sleep + shield          |
| `boss_high_score_hydra`   | High Score Hydra   |     5 | Obsessed with points           | Combo/cascade test      |
| `boss_king_bloxley`       | King Bloxley       |     6 | Bossy block mascot king        | Symmetry + royal blocks |

---

#### 5. Monster Roster

##### Stage 1 Monsters

| ID                   | Name           | Role      | Behavior                      |
| -------------------- | -------------- | --------- | ----------------------------- |
| `mon_cupcake_slime`  | Cupcake Slime  | basic     | Basic attack, drops sprinkles |
| `mon_sugar_bat`      | Sugar Bat      | disruptor | Hides next block briefly      |
| `mon_crumb_goblin`   | Crumb Goblin   | junk      | Throws crumb junk blocks      |
| `mon_jelly_rat`      | Jelly Rat      | fast      | Attacks faster                |
| `mon_sprinkle_snail` | Sprinkle Snail | support   | Adds sticky blocks slowly     |
| `mon_frosting_blob`  | Frosting Blob  | tank      | Has soft armor                |

##### Stage 2 Monsters

| ID                  | Name          | Role      | Behavior                     |
| ------------------- | ------------- | --------- | ---------------------------- |
| `mon_wrench_goblin` | Wrench Goblin | disruptor | Adds junk block              |
| `mon_button_masher` | Button Masher | chaos     | Board shake                  |
| `mon_spring_bot`    | Spring Bot    | speed     | Speeds up next piece briefly |
| `mon_spark_gremlin` | Spark Gremlin | caster    | Mana zap                     |
| `mon_gear_slime`    | Gear Slime    | tank      | Armor + slow attack          |
| `mon_rattle_drone`  | Rattle Drone  | flying    | Random column junk           |

##### Stage 3 Monsters

| ID                    | Name            | Role      | Behavior                        |
| --------------------- | --------------- | --------- | ------------------------------- |
| `mon_ice_cream_imp`   | Ice Cream Imp   | caster    | Applies freeze                  |
| `mon_popsicle_bat`    | Popsicle Bat    | disruptor | Hides hold block                |
| `mon_chill_slime`     | Chill Slime     | control   | Slows fall speed then spikes it |
| `mon_freezer_mimic`   | Freezer Mimic   | trap      | Freezes active block            |
| `mon_snowcone_sprite` | Snowcone Sprite | support   | Creates ice blocks              |
| `mon_pudding_penguin` | Pudding Penguin | basic     | Slides junk blocks              |

##### Stage 4 Monsters

| ID                  | Name          | Role      | Behavior                |
| ------------------- | ------------- | --------- | ----------------------- |
| `mon_button_knight` | Button Knight | tank      | Shield self             |
| `mon_blanket_ghost` | Blanket Ghost | control   | Sleep effect            |
| `mon_plush_dragon`  | Plush Dragon  | caster    | Cotton candy flame      |
| `mon_toy_soldier`   | Toy Soldier   | basic     | Formation attack        |
| `mon_pillow_squire` | Pillow Squire | defense   | Soft block shield       |
| `mon_sock_sprite`   | Sock Sprite   | disruptor | Swaps next/hold preview |

##### Stage 5 Monsters

| ID                     | Name             | Role      | Behavior                  |
| ---------------------- | ---------------- | --------- | ------------------------- |
| `mon_token_sprite`     | Token Sprite     | economy   | Steals/gives gold         |
| `mon_combo_gremlin`    | Combo Gremlin    | combo     | Punishes no cascade       |
| `mon_neon_bat`         | Neon Bat         | disruptor | Flashes preview           |
| `mon_prize_claw_mimic` | Prize Claw Mimic | trap      | Grabs random block        |
| `mon_pixel_blob`       | Pixel Blob       | basic     | Splits on hit             |
| `mon_joystick_jester`  | Joystick Jester  | chaos     | Reverses controls briefly |

##### Stage 6 Monsters

| ID                      | Name              | Role      | Behavior                |
| ----------------------- | ----------------- | --------- | ----------------------- |
| `mon_royal_block_guard` | Royal Block Guard | tank      | Armor + pattern blocks  |
| `mon_square_jester`     | Square Jester     | disruptor | Creates awkward shapes  |
| `mon_crown_bat`         | Crown Bat         | flying    | Hides inventory briefly |
| `mon_parade_golem`      | Parade Golem      | tank      | Marches junk upward     |
| `mon_confetti_mage`     | Confetti Mage     | caster    | Random colorful blocks  |
| `mon_banner_bug`        | Banner Bug        | support   | Buffs enemy attack      |

---

#### 6. Heroes, Unlock Conditions, and Story Hooks

| ID                          | Name             | Role              | Unlock                              |
| --------------------------- | ---------------- | ----------------- | ----------------------------------- |
| `hero_milo_blockmancer`     | Milo             | Balanced starter  | Default                             |
| `hero_pippa_pyromancer`     | Pippa            | Fire/spell damage | Defeat Stage 1 boss                 |
| `hero_nixie_frostbinder`    | Nixie            | Control/slow      | Clear 3 rooms without taking damage |
| `hero_bruk_snack_knight`    | Bruk             | High HP/defense   | Collect 500 total gold              |
| `hero_zuzu_goblin_engineer` | Zuzu             | Bomb/board chaos  | Defeat Stage 2 boss                 |
| `hero_lumi_star_witch`      | Lumi             | Mana/cascade      | Trigger 10 cascade combos           |
| `hero_poplin_professor`     | Professor Poplin | Weird utility     | Finish normal ending                |
| `hero_bloop_slime_friend`   | Bloop            | Sticky/cute chaos | Befriend 20 slimes                  |

##### Milo — The Blockmancer

Apprentice Blockmancer, originally assigned to lemonade duty. He can hear the “plink plonk” language of rune blocks.

```text
Story vibe: “I can fix this. Probably.”
```

##### Pippa — The Pyromancer

Festival baker whose oven was taken over by rune blocks.

```text
Story vibe: “Nobody steals my cupcakes.”
```

##### Nixie — The Frostbinder

Ice cream cart mage trying to recover her stolen rainbow ice cream.

```text
Story vibe: “Stay chill, stack clean.”
```

##### Bruk — The Snack Knight

Knight sworn to protect festival food.

```text
Story vibe: “No snack left behind.”
```

##### Zuzu — The Goblin Engineer

Goblin engineer, partly responsible for the machine going wild.

```text
Story vibe: “Explosion means progress.”
```

##### Lumi — The Star Witch

Dreamy star witch who thinks shiny blocks are friends.

```text
Story vibe: “That purple block has main character energy.”
```

##### Professor Poplin

Old wizard inventor of the Block-O-Matic 3000.

```text
Story vibe: “I definitely read most of the manual.”
```

##### Bloop

A friendly slime who follows the player after being defeated or befriended enough times.

```text
Story vibe: “Bloop!”
```

---

#### 7. Weapons

The weapon tone should be festival, toy, kitchen, and gadget themed.

| ID                     | Name             | Type   | Effect                    |
| ---------------------- | ---------------- | ------ | ------------------------- |
| `wpn_basic_wand`       | Basic Wand       | wand   | No bonus                  |
| `wpn_lemonade_wand`    | Lemonade Wand    | wand   | Mana gain +10%            |
| `wpn_cookie_spatula`   | Cookie Spatula   | blade  | Fire damage +8            |
| `wpn_snowcone_staff`   | Snowcone Staff   | staff  | Frost effects +0.05 slow  |
| `wpn_spring_hammer`    | Spring Hammer    | hammer | Hard drop damage +5       |
| `wpn_confetti_cannon`  | Confetti Cannon  | gadget | Bomb block chance         |
| `wpn_star_scepter`     | Star Scepter     | wand   | Cascade damage +10%       |
| `wpn_goblin_multitool` | Goblin Multitool | gadget | Junk/bomb manipulation    |
| `wpn_plush_lance`      | Plush Lance      | toy    | Shield +3 on battle start |
| `wpn_arcade_blaster`   | Arcade Blaster   | arcade | Fever gain +15%           |

---

#### 8. Spells

The spell tone should be magical, silly, bright, and festival-themed.

| ID                    | Name            | School  | Effect                    |
| --------------------- | --------------- | ------- | ------------------------- |
| `spl_fireball`        | Fireball        | fire    | Damage enemy              |
| `spl_frost_lock`      | Frost Lock      | frost   | Slow fall speed           |
| `spl_bomb_rune`       | Bomb Rune       | bomb    | Clear area                |
| `spl_clean_cut`       | Clean Cut       | arcane  | Clear row                 |
| `spl_sprinkle_shower` | Sprinkle Shower | candy   | Gain mana + buff blocks   |
| `spl_cupcake_blast`   | Cupcake Blast   | candy   | Damage + sticky clear     |
| `spl_confetti_pop`    | Confetti Pop    | party   | Clear random cells        |
| `spl_bubble_shield`   | Bubble Shield   | defense | Gain shield               |
| `spl_star_spark`      | Star Spark      | star    | Combo-scaling damage      |
| `spl_jelly_bounce`    | Jelly Bounce    | utility | Delay enemy               |
| `spl_snowcone_burst`  | Snowcone Burst  | frost   | Freeze enemy attack       |
| `spl_goblin_gadget`   | Goblin Gadget   | gadget  | Random helpful effect     |
| `spl_rainbow_reroll`  | Rainbow Reroll  | utility | Reroll active/next piece  |
| `spl_snack_break`     | Snack Break     | healing | Heal player               |
| `spl_cascade_cheer`   | Cascade Cheer   | combo   | Boost next cascade reward |

---

#### 9. Relics / Items

Relics should feel like cute collectibles or festival souvenirs.

| ID                     | Name             | Rarity    | Effect                         |
| ---------------------- | ---------------- | --------- | ------------------------------ |
| `rel_goblin_coin`      | Goblin Coin      | common    | Gold gain +20%                 |
| `rel_lucky_cupcake`    | Lucky Cupcake    | common    | Heal after boss                |
| `rel_sparkly_spoon`    | Sparkly Spoon    | common    | Line damage +1                 |
| `rel_sticky_sticker`   | Sticky Sticker   | uncommon  | Sticky blocks give mana        |
| `rel_confetti_popper`  | Confetti Popper  | uncommon  | Chance clear random cell       |
| `rel_rainbow_ticket`   | Rainbow Ticket   | rare      | Extra reward choice            |
| `rel_tiny_toolbox`     | Tiny Toolbox     | uncommon  | Bomb spell cost -5             |
| `rel_plush_helmet`     | Plush Helmet     | rare      | Prevent lethal damage once     |
| `rel_snowflake_charm`  | Snowflake Charm  | uncommon  | Frost spells stronger          |
| `rel_star_cookie`      | Star Cookie      | rare      | Cascade damage +20%            |
| `rel_bouncy_boots`     | Bouncy Boots     | common    | Hard drop gives mana           |
| `rel_arcade_token`     | Arcade Token     | rare      | Fever starts at 25%            |
| `rel_recipe_card`      | Recipe Card      | uncommon  | Fire/candy spell synergy       |
| `rel_friendship_badge` | Friendship Badge | legendary | Monster attacks weaker         |
| `rel_block_o_manual`   | Block-O Manual   | legendary | Once per battle, fix messy row |

---

#### 10. Upgrades

| ID                    | Name            | Category  | Effect                  |
| --------------------- | --------------- | --------- | ----------------------- |
| `upg_clean_stack`     | Clean Stack     | board     | Fall speed -0.05        |
| `upg_sharp_sprinkles` | Sharp Sprinkles | damage    | Line damage +2          |
| `upg_extra_frosting`  | Extra Frosting  | defense   | Max HP +3               |
| `upg_mana_lemonade`   | Mana Lemonade   | mana      | Mana gain +10%          |
| `upg_combo_cheer`     | Combo Cheer     | combo     | Cascade damage +10%     |
| `upg_bigger_booms`    | Bigger Booms    | spell     | Bomb Rune radius +1     |
| `upg_hotter_oven`     | Hotter Oven     | fire      | Fireball +10 damage     |
| `upg_chill_zone`      | Chill Zone      | frost     | Frost Lock stronger     |
| `upg_pocket_snack`    | Pocket Snack    | heal      | Heal 1 after every room |
| `upg_bonus_preview`   | Bonus Preview   | board     | Show extra next block   |
| `upg_quick_hold`      | Quick Hold      | board     | Hold cooldown reduced   |
| `upg_inventory_pouch` | Inventory Pouch | inventory | +2 item slots           |
| `upg_lucky_roll`      | Lucky Roll      | reward    | Reroll reward once      |
| `upg_festival_fever`  | Festival Fever  | fever     | Fever fills faster      |
| `upg_smooth_cascade`  | Smooth Cascade  | cascade   | Cascade gives more mana |

---

#### 11. Board Blocks

Board blocks are a major part of the game's identity.

| ID                  | Name           | Type    | Effect                       |
| ------------------- | -------------- | ------- | ---------------------------- |
| `block_red_rune`    | Red Rune       | normal  | Basic                        |
| `block_blue_rune`   | Blue Rune      | normal  | Basic                        |
| `block_green_rune`  | Green Rune     | normal  | Basic                        |
| `block_yellow_rune` | Yellow Rune    | normal  | Basic                        |
| `block_sprinkle`    | Sprinkle Block | bonus   | +mana on clear               |
| `block_cupcake`     | Cupcake Block  | heal    | Small heal on clear          |
| `block_bomb`        | Bomb Block     | special | Explodes area                |
| `block_star`        | Star Block     | combo   | Boost cascade                |
| `block_jelly`       | Jelly Block    | soft    | Falls/bounces during cascade |
| `block_ice`         | Ice Block      | control | May slide/freeze             |
| `block_sticky`      | Sticky Block   | hazard  | Harder to collapse           |
| `block_crumb_junk`  | Crumb Junk     | junk    | Enemy junk                   |
| `block_royal`       | Royal Block    | boss    | Must clear pattern           |
| `block_confetti`    | Confetti Block | random  | Random bonus                 |
| `block_toolbox`     | Toolbox Block  | gadget  | Gives item charge            |

---

#### 12. Status Effects

Rename dark debuffs into funny, readable statuses.

| ID                   | Name        | Target       | Effect                  |
| -------------------- | ----------- | ------------ | ----------------------- |
| `status_sugar_rush`  | Sugar Rush  | enemy/player | Faster action           |
| `status_sticky`      | Sticky      | board        | Blocks harder to drop   |
| `status_chilled`     | Chilled     | enemy/board  | Slower fall/enemy       |
| `status_sleepy`      | Sleepy      | enemy        | Skip action             |
| `status_dizzy`       | Dizzy       | enemy        | Weaker attack           |
| `status_sparkly`     | Sparkly     | player       | Extra mana gain         |
| `status_bubbled`     | Bubbled     | player       | Shield                  |
| `status_confetti`    | Confetti    | board        | Random bonus cell       |
| `status_snack_boost` | Snack Boost | player       | Heal/mana over time     |
| `status_overclocked` | Overclocked | enemy/board  | More junk, more rewards |

---

#### 13. Items / Inventory

Since the UI includes inventory, the game should support consumable items.

##### Consumables

| ID                   | Name          | Effect                       |
| -------------------- | ------------- | ---------------------------- |
| `item_mini_cupcake`  | Mini Cupcake  | Heal 5 HP                    |
| `item_mana_lemonade` | Mana Lemonade | Gain 30 mana                 |
| `item_rainbow_soda`  | Rainbow Soda  | Fill fever +20%              |
| `item_toolbox`       | Toolbox       | Remove 3 junk blocks         |
| `item_snowcone`      | Snowcone      | Slow fall speed temporarily  |
| `item_party_popper`  | Party Popper  | Clear random 5 cells         |
| `item_bubble_gum`    | Bubble Gum    | Gain 8 shield                |
| `item_lucky_ticket`  | Lucky Ticket  | Reroll reward                |
| `item_hold_coupon`   | Hold Coupon   | Refresh hold block           |
| `item_block_polish`  | Block Polish  | Convert junk to normal block |

##### Inventory Rules

```text
- Inventory visible as compact overlay near board.
- Max slots default: 6.
- Items stack by type.
- Consumables can be used during battle or event depending on item.
- On mobile, tap inventory icon to expand.
```

---

#### 14. Room Events

| ID                        | Name                | Choices                                      |
| ------------------------- | ------------------- | -------------------------------------------- |
| `evt_suspicious_button`   | Suspicious Button   | Press / Label it / Walk away                 |
| `evt_lost_cake_cart`      | Lost Cake Cart      | Take snack / Return cart / Trade             |
| `evt_goblin_quality_test` | Goblin Quality Test | Try gadget / Refuse / Pay for safe version   |
| `evt_rainbow_fountain`    | Rainbow Fountain    | Heal / Gain mana / Get random status         |
| `evt_sleepy_guard`        | Sleepy Guard        | Let him sleep / Wake him / Take key          |
| `evt_arcade_challenge`    | Arcade Challenge    | Combo challenge / Pay token / Leave          |
| `evt_block_o_manual_page` | Manual Page         | Learn tip / Gain upgrade / Confusing diagram |
| `evt_friendship_slime`    | Friendship Slime    | Feed / Pet / Recruit?                        |

---

#### 15. Shops

##### Shop NPCs

| ID                    | Name                        | Shop Type       |
| --------------------- | --------------------------- | --------------- |
| `npc_marnie_merchant` | Marnie the Merchant         | General items   |
| `npc_zuzu_shop`       | Zuzu’s Questionable Gadgets | Bomb/gadget     |
| `npc_nixie_cart`      | Nixie’s Ice Cream Cart      | Heal/control    |
| `npc_ticket_imp`      | Ticket Imp                  | Rerolls/rewards |

##### Shop Items

```text
Mini Cupcake
Mana Lemonade
Toolbox
Lucky Ticket
Random Upgrade
Random Relic
Remove Silly Drawback
Buy Spell Upgrade
Inventory Pouch
```

---

#### 16. Oopsies / Silly Drawbacks

Do not call them curses in the cheerful version. Use:

```text
Silly Drawbacks
Festival Mishaps
Oopsies
```

| ID                         | Name                | Effect                           |
| -------------------------- | ------------------- | -------------------------------- |
| `oops_heavy_blocks`        | Heavy Blocks        | Fall speed +0.1                  |
| `oops_slippery_buttons`    | Slippery Buttons    | Tiny movement delay              |
| `oops_too_much_confetti`   | Too Much Confetti   | Preview flashes sometimes        |
| `oops_snack_tax`           | Snack Tax           | Shop prices +15%                 |
| `oops_sticky_floor`        | Sticky Floor        | More sticky blocks               |
| `oops_overexcited_machine` | Overexcited Machine | More junk, better rewards        |
| `oops_square_only`         | Square Only         | Boss pattern challenge           |
| `oops_sugar_crash`         | Sugar Crash         | Mana gain lower after spell spam |

---

#### 17. NPCs

| ID                       | Name               | Role              |
| ------------------------ | ------------------ | ----------------- |
| `npc_professor_poplin`   | Professor Poplin   | Inventor/tutorial |
| `npc_marnie_merchant`    | Marnie             | Shop              |
| `npc_ticket_imp`         | Ticket Imp         | Arcade challenge  |
| `npc_bloop`              | Bloop              | Slime friend      |
| `npc_king_bloxley`       | King Bloxley       | Final boss        |
| `npc_festival_announcer` | Festival Announcer | Stage intro       |
| `npc_cake_judge`         | Cake Judge         | Side quest        |
| `npc_repair_sprite`      | Repair Sprite      | Upgrade station   |

---

#### 18. Currencies / Collectibles

| ID                             | Name             | Use                  |
| ------------------------------ | ---------------- | -------------------- |
| `currency_gold`                | Gold             | Shop                 |
| `currency_tickets`             | Festival Tickets | Meta unlock / arcade |
| `currency_sprinkles`           | Sprinkles        | Upgrade/cosmetic     |
| `currency_stars`               | Star Tokens      | Rare unlocks         |
| `collectible_lost_cake`        | Lost Cake        | True ending          |
| `collectible_manual_page`      | Manual Page      | Tutorial/lore        |
| `collectible_friendship_badge` | Friendship Badge | Hero/NPC unlock      |
| `collectible_arcade_token`     | Arcade Token     | Starfall Arcade      |

---

#### 19. Loot Tables

Recommended loot tables:

```text
loot_battle_default
loot_stage1_candy
loot_stage2_workshop
loot_stage3_frosty
loot_stage4_pillow
loot_stage5_arcade
loot_stage6_palace
loot_elite_default
loot_boss_default
loot_shop_default
loot_treasure_default
loot_event_default
loot_true_ending
```

Stage-themed loot direction:

```text
Stage 1: cupcake, sprinkle, sticky
Stage 2: gadget, bomb, toolbox
Stage 3: ice, slow, shield
Stage 4: sleep, defense, plush
Stage 5: combo, fever, arcade
Stage 6: royal, symmetry, final upgrades
```

---

#### 20. Asset Direction

##### UI Theme

```text
Pixel-art 32-bit
Bright fantasy
Festival colors
Rounded chunky panels
Candy / toy / rune motifs
No dark edgy skull-heavy UI
```

##### Fonts

Use pixel-style fonts:

```text
font_pixel_header
font_pixel_body
font_pixel_number
```

##### Sprite Categories

```text
heroes/
monsters/
bosses/
spells/
items/
relics/
upgrades/
board-blocks/
ui/
map/
stage-backgrounds/
effects/
npc/
```

---

#### 21. Rename / Replace Old Dark Content

| Old                     | New                        |
| ----------------------- | -------------------------- |
| Falling King            | King Bloxley               |
| Void Scholar dark story | Lumi / cheerful star witch |
| Broken Hourglass        | Wobbly Clock               |
| Cracked Crown           | Crooked Crown              |
| Dragon Tooth            | Plush Dragon Button        |
| Slime Core              | Jelly Core                 |
| Void Cut                | Clean Cut / Magic Slice    |
| Mana Hex                | Sugar Crash                |
| Curse                   | Oopsie / Mishap            |
| Dark Dungeon            | Festival Dungeon           |
| Royal Collapse          | Everything Must Be Square  |

---

#### 22. Recommended Alpha Content Pack

A release-alpha content pack should include:

```text
Heroes: 6
- Milo
- Pippa
- Nixie
- Bruk
- Zuzu
- Lumi

Stages: 6
- Sprinkle Sewers
- Goblin Workshop
- Frosty Pantry
- Pillow Castle
- Starfall Arcade
- Bloxley’s Block Palace

Monsters: 36
- 6 per stage

Bosses: 6
- 1 per stage

Weapons: 10

Spells: 15

Relics: 15

Upgrades: 15

Board Blocks: 15

Status Effects: 10

Items: 10

Events: 8

Oopsies: 8

NPCs: 8

Loot Tables: 12
```

---

#### 23. Codex Prompt — Update Content to New Core Concept

```text
Update Blockmancer Dungeon content to match the new lighthearted cheerful fantasy core concept.

New core concept:
Blockmancer Dungeon is a cheerful falling-block roguelike RPG where a magical festival machine called the Block-O-Matic 3000 goes haywire and creates a colorful dungeon under the town square. The player clears rune block lines, triggers Cascade Gravity combos, casts silly spells, collects snacks/relics/upgrades, unlocks quirky heroes, and saves the Festival of Falling Stars from King Bloxley, the self-appointed Block King.

Tone:
- Cheerful fantasy
- Cute chaos
- Festival adventure
- Pixel-art 32-bit
- Funny monsters
- No edgy/dark tragedy

Replace or update old dark content with new cheerful content.

Create/update content data for:
- heroes
- monsters
- bosses
- weapons
- spells
- relics
- upgrades
- board-blocks
- status-effects
- items
- room-events
- oopsies / silly drawbacks
- NPCs
- currencies / collectibles
- loot-tables
- stages / biomes

Use these stage themes:
1. Sprinkle Sewers
2. Goblin Workshop
3. Frosty Pantry
4. Pillow Castle
5. Starfall Arcade
6. Bloxley’s Block Palace

Final boss:
King Bloxley

Core mechanic:
Cascade Gravity should remain a main identity mechanic.

Rules:
- Keep all JSON valid.
- Use placeholder asset keys.
- Use cute/funny descriptions.
- Preserve gameplay effect types where possible.
- Rename curses to oopsies or silly drawbacks.
- Update loot tables to stage-themed rewards.
- Update hero unlock conditions.
- Update docs to reflect new cheerful story and content.
- Run validation and build after changes.
```

---

#### 24. Summary Direction

The new direction is:

```text
Not a dark cursed dungeon.
A festival machine exploded into a cute chaotic puzzle dungeon.
```

The content that needs the most changes:

```text
1. Monster theme
2. Boss theme
3. Relic/item names
4. Curse -> Oopsie
5. Stage names
6. Hero stories
7. UI/art direction
8. Loot tables
```

---

#### 25. Updated Replayability Direction

The expanded Release 1.0 direction should add variety through **player decisions, surprise board states, optional goals, and long-term collection**, not just more enemies.

New replayability pillars:

```text
1. Random Gameplay Events
2. Stage Goals
3. Festival Chaos Rules
4. Battle Mini-Objectives
5. Boss Rule Cards
6. Oopsie Risk/Reward Choices
7. Hero-Specific Playstyle Passives
8. Dynamic Board Size Modifiers
9. Festival Hub Progression
10. Monster Friendship / Collection
```

Design rule:

> Every new system should either change how the player stacks blocks, chooses a route, prepares for a boss, or values a reward.

---

#### 26. Random Gameplay Events

Random gameplay events are runtime surprises that can trigger during battles, map movement, event rooms, or boss phases.

They should affect at least one of:

```text
- Board state
- Combat state
- Rewards
- Stage goal progress
- Boss difficulty
- Route risk
- Player resources
```

| ID | Name | Trigger | Effect | Gameplay Impact |
| --- | --- | --- | --- | --- |
| `r_evt_jelly_surge` | Jelly Surge | Battle | Jelly/bouncy cells or columns appear | Makes line planning harder but may create cascades |
| `r_evt_sprinkle_rain` | Sprinkle Rain | Battle | More sprinkle blocks for a few pieces | Helps mana recovery |
| `r_evt_sticky_spill` | Sticky Spill | Stage 1+ battle | Sticky blocks appear near lower rows | Threatens board control |
| `r_evt_lost_cake_alarm` | Lost Cake Alarm | Map/event/battle | Clear 2 lines quickly for cake progress | Supports true ending and risk/reward |
| `r_evt_goblin_miswire` | Goblin Miswire | Stage 2+ battle | Swaps next/hold preview once | Disrupts planned placement |
| `r_evt_button_panic` | Button Panic | Workshop/gadget rooms | Board shake and small active-piece nudge | Increases misdrop risk |
| `r_evt_bomb_delivery` | Bomb Delivery | Stage 2+ battle | Adds a bomb block to upcoming pieces | Helps recover messy board |
| `r_evt_freezer_draft` | Freezer Draft | Stage 3+ battle | Fall speed slows, then spikes | Creates setup window then pressure |
| `r_evt_ice_slide` | Ice Slide | Frosty Pantry | Ice blocks slide before gravity stabilizes | Creates or ruins cascades |
| `r_evt_sleepy_moment` | Sleepy Moment | Stage 4+ battle | Enemy skips next action | Gives recovery window |
| `r_evt_blanket_tangle` | Blanket Tangle | Pillow Castle | Rotation disabled for 1 piece | Forces awkward placement |
| `r_evt_arcade_combo_callout` | Arcade Combo Callout | Stage 5+ battle | Trigger cascade within limited pieces | Rewards combo mastery |
| `r_evt_prize_claw_grab` | Prize Claw Grab | Stage 5+ battle/event | Removes a block or steals an item | Can help or hurt |
| `r_evt_neon_flash` | Neon Flash | Stage 5+ battle | Next preview flashes/hides | Makes planning harder |
| `r_evt_royal_decree_square` | Royal Decree: Square! | Stage 6+ battle | Create/clear a 2x2 pattern | Prepares final boss skill |
| `r_evt_symmetry_check` | Symmetry Check | Stage 6/boss | Checks left/right board symmetry | Rewards clean palace play |
| `r_evt_confetti_overload` | Confetti Overload | Any later stage | Random confetti blocks appear | Random bonuses and clutter |
| `r_evt_manual_page_tip` | Manual Page Tip | Event/reward | Reveals next enemy intent or boss tip | Helps strategic planning |
| `r_evt_snack_break` | Snack Break | Between nodes | Small heal or mana gain | Helps long-stage survival |
| `r_evt_machine_hiccup` | Machine Hiccup | Any room | Temporarily changes board size | Directly changes encounter difficulty |

Trigger limits:

```text
Stage 1–2: max 1 active random gameplay event
Stage 3–4: max 1–2 active events depending on node type
Stage 5–6: up to 2 active events, especially elite/boss rooms
```

---

#### 27. Map Node Scaling

Stage length should increase as the run deepens.

| Stage | Main Path Nodes | Total Generated Nodes | Required Structure |
| ---: | ---: | ---: | --- |
| 1 | 6 | 9–11 | 3 Normal, 1 Event, 1 Treasure/Rest, 1 Boss |
| 2 | 8 | 12–14 | 4 Normal, 1 Event, 1 Shop, 1 Elite, 1 Boss |
| 3 | 10 | 15–17 | 5 Normal, 1 Event, 1 Rest, 1 Treasure, 1 Elite, 1 Boss |
| 4 | 12 | 18–21 | 6 Normal, 2 Events, 1 Shop, 1 Rest, 1 Elite, 1 Boss |
| 5 | 14 | 22–25 | 7 Normal, 2 Events, 1 Shop, 1 Treasure, 2 Elites, 1 Boss |
| 6 | 16 | 26–30 | 8 Normal, 2 Events, 1 Shop, 1 Rest, 2 Elites, 1 Royal Guard, 1 Final Boss |

Rules:

```text
- Boss node is always the final required node.
- Elite nodes start from Stage 2.
- Stage 6 includes a special pre-boss / Royal Guard node.
- More nodes should mean more route decisions, not just more fights.
```

---

#### 28. Dynamic Board Size Modifiers

Base board size:

| Stage | Base Board |
| ---: | --- |
| 1 | 8 x 16 |
| 2 | 9 x 17 |
| 3 | 9 x 18 |
| 4 | 10 x 18 |
| 5 | 10 x 19 |
| 6 | 10 x 20 |

Encounter rules:

| Encounter Type | Board Rule | Gameplay Impact |
| --- | --- | --- |
| Normal | Use stage base size | Stable baseline |
| Hard Normal | Base size plus locked hazard row | Slight pressure |
| Elite | Usually width -1 or height -2 | Tighter and riskier |
| Boss Phase 1 | Base size plus boss mechanic | Teaches boss rule |
| Boss Phase 2 | Shrink/expand/reshape temporarily | Difficulty spike |
| Final Boss | Board changes by phase | Memorable finale |
| Treasure/Rest | Safer or slightly larger board | Puzzle/recovery feel |
| Event | Variable by choice | Supports risk/reward |

Safety rules:

```text
- Never shrink below 6 x 12.
- Never expand beyond portrait mobile readability.
- Board resizing must preserve blocks safely or use a clear fallback.
- Dynamic board size must not break Cascade Gravity.
```

Boss board examples:

```text
Cupcake Slime King: 8x16 → 8x15 during sticky phase
Prototype No. 7: 9x17 → 10x17 with bomb lanes
Gelato Golem: 9x18 → 9x16 during frozen fog
Sir Snore-a-Lot: 10x18 → 10x20 while sleeping
High Score Hydra: 10x19 → 10x21 during combo challenge
King Bloxley: 10x20 → 8x20 during Everything Must Be Square
```

---

#### 29. Stage Goals

| Stage | Goal | Success Effect | Fail Effect |
| ---: | --- | --- | --- |
| 1 | Recover 3 Lost Cupcakes | Boss starts with fewer sticky blocks | Boss adds extra sticky blocks |
| 2 | Disable 2 Goblin Machines | Prototype drops less junk | Prototype starts overclocked |
| 3 | Save 3 Ice Cream Crates | Player starts boss with shield | Fall speed spike during boss |
| 4 | Keep 2 Guards Asleep | Rare treasure or reduced Sleepy effect | More Sleepy status in boss |
| 5 | Reach Combo Score Target | Start boss with Fever | Hydra gains stronger combo punishment |
| 6 | Break 3 Royal Seals | King Bloxley starts weakened | Final boss starts with royal blocks |

Stage goals should be visible at stage start, track progress during the route, and resolve before the boss fight.

---

#### 30. Festival Chaos Rules

Chaos rules are room-level modifiers for eligible combat rooms.

| ID | Name | Effect |
| --- | --- | --- |
| `chaos_sprinkle_storm` | Sprinkle Storm | More sprinkle blocks appear |
| `chaos_wobbly_floor` | Wobbly Floor | Board shakes every few pieces |
| `chaos_snack_tax` | Snack Tax | More gold reward, but shop prices increase |
| `chaos_confetti_fever` | Confetti Fever | Cascades fill Fever faster |
| `chaos_goblin_safety_test` | Goblin Safety Test | Bomb blocks and junk blocks both increase |
| `chaos_freezer_draft` | Freezer Draft | Fall speed slows, then spikes |
| `chaos_royal_inspection` | Royal Inspection | Clean board gives bonus; messy board adds royal blocks |
| `chaos_jelly_bounce` | Jelly Bounce | Jelly blocks bounce or shift during cascade |

---

#### 31. Battle Mini-Objectives

| ID | Objective | Reward Direction |
| --- | --- | --- |
| `mini_trigger_cascade` | Trigger 1 cascade | Gold/Fever |
| `mini_clear_two_lines_one_piece` | Clear 2 lines with one piece | Bonus reward |
| `mini_clear_sprinkles` | Clear 5 sprinkle blocks | Mana/gold |
| `mini_clear_all_junk` | Destroy all junk blocks | Item/relic chance |
| `mini_no_spell_win` | Win without using a spell | Gold/relic chance |
| `mini_win_before_enemy_attacks` | Win before enemy attacks 3 times | Fever/gold |
| `mini_use_hold` | Use Hold at least once | Small item |
| `mini_cast_two_spells` | Cast 2 spells in battle | Mana reward |
| `mini_low_board_height` | End with board below 50% height | Extra reward choice chance |
| `mini_trigger_fever` | Trigger Fever before victory | Arcade reward |

---

#### 32. Boss Rule Cards

Boss rule cards should appear before boss combat and explain the gimmick clearly.

| Boss | Rule Card |
| --- | --- |
| Cupcake Slime King | Sticky blocks spread if ignored |
| Prototype No. 7 | Machine drops junk or bombs every few pieces |
| Gelato Golem | Board freezes during cold waves |
| Sir Snore-a-Lot | Sleeps, shields, then wakes stronger |
| High Score Hydra | Low combo play makes Hydra stronger |
| King Bloxley | Symmetry patterns and royal blocks must be managed |

---

#### 33. Hero-Specific Playstyle Passives

| Hero | Passive | Gameplay Identity |
| --- | --- | --- |
| Milo | First cascade each battle gives bonus mana | Beginner-friendly combo hero |
| Pippa | Fire spells burn sticky/junk blocks | Aggressive cleanup |
| Nixie | Once per room, can slow fall speed or soften speed spikes | Control and safety |
| Bruk | Survive board overflow once per battle or gain emergency shield | Defensive rescue |
| Zuzu | Bomb blocks appear more often, but junk increases slightly | Risky chaos |
| Lumi | Star blocks heavily boost cascade damage | Combo mastery |

---

#### 34. Festival Hub Progression

Festival Hub buildings give long-term meta-progression after each run.

| Building | Unlock Direction |
| --- | --- |
| `hub_cake_stall` | Healing items, Pippa dialogue, cupcake relics |
| `hub_ice_cream_cart` | Frost/control items, Nixie upgrades |
| `hub_goblin_workshop` | Bomb/gadget relics, Zuzu event variants |
| `hub_arcade_booth` | Fever challenges, Stage 5 modifiers |
| `hub_snack_table` | Bruk defensive items, rest bonuses |
| `hub_star_lantern_stage` | Lumi cascade upgrades, star block bonuses |
| `hub_repair_tent` | Remove Oopsies, fix board-start penalties |
| `hub_bloxley_statue` | Final-stage challenge modifiers and optional hard mode later |

---

#### 35. Monster Friendship / Collection

Monster friendship gives cute long-term goals and supports the non-grim tone.

| Monster | Friendship Reward |
| --- | --- |
| Cupcake Slime | Start battle with 1 sprinkle block |
| Sugar Bat | Next preview hide duration reduced |
| Crumb Goblin | Junk blocks have chance to become normal blocks |
| Button Masher | Board shake reduced |
| Ice Cream Imp | Freeze effects last shorter |
| Blanket Ghost | Sleepy effect can heal slightly or reduce enemy action |
| Combo Gremlin | Fever gain bonus |
| Square Jester | Royal pattern warning appears earlier |

Gain methods:

```text
- Defeat monster
- Feed item
- Spare/calm monster
- Resolve event choice kindly
```

---

#### 36. Updated Content Categories

Add these categories to the existing data-driven content list:

```text
random-gameplay-events
stage-goals
chaos-rules
battle-objectives
boss-rules
board-size-modifiers
hub-buildings
friendship
hero-passives
```

---

#### 37. Updated Save Data Needs

Meta progress should include:

```text
hubBuildings
monsterFriendship
completedStageGoals
discoveredChaosRules
discoveredBossRules
```

Current run should include:

```text
stageGoals
activeChaosRule
activeBattleObjective
activeRandomGameplayEvents
activeOopsies
currentBossRule
boardSizeModifier
```

<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_START -->
## 2026-06-02 Feature Update — Fever Showtime Cascade

### Purpose

Fever is upgraded from a simple meter into **Fever Showtime Cascade**, a short, high-skill, high-readability power window that rewards planning, cascades, and stylish board control.

Core fantasy:

```text
The player calls Showtime, stacks completed rows as glowing Charged Lines, then releases them together for a festival-bright cascade burst.
```

This feature strengthens Stage 5 identity while remaining usable across the run.

### Core Fever Showtime Loop

```text
1. Player fills Fever meter through line clears, cascades, special blocks, upgrades, and supported hero/relic effects.
2. At 100 meter, Fever becomes Ready.
3. Player manually activates Fever.
4. During active Fever, completed lines become Charged Lines instead of clearing immediately.
5. Fever lasts a short number of piece locks.
6. Player may manually release early.
7. Fever auto-releases when duration expires, max Charged Lines are reached, or cleanup requires it.
8. On release, all Charged Lines clear together.
9. Normal Cascade Gravity runs after the Charged Lines clear.
10. Combat damage, boss caps, Showtime Overflow, Soft Junk, Fever Heat, and upgrade effects resolve.
```

### Base Fever Values

```ts
const FEVER_METER_MAX = 100;
const FEVER_BASE_DURATION_LOCKS = 4;
const FEVER_BASE_MAX_CHARGED_LINES = 4;
const FEVER_RELEASE_METER_REFILL_CAP = 30;
```

### Encounter Caps

| Encounter | Max Fever duration after upgrades | Max Charged Lines | Direct Fever release damage cap |
| --- | ---: | ---: | --- |
| Normal | 7 locks | 6 | No direct HP cap; overkill does not carry to next enemy by default |
| Elite | 6 locks | 5 | 40% of enemy max HP |
| Boss | 5 locks | 4 | 30% of boss max HP |
| Final boss | 5 locks | 4 | 22-25% of boss max HP |

### Boss Drama Guard

A single Fever release may break one boss phase, but may not skip multiple boss phases.

If Fever release damage exceeds an elite/boss/final boss cap, the excess becomes **Showtime Overflow** utility instead of extra direct damage.

Allowed Showtime Overflow utility:

```text
shield
mana
boss intent delay
clear hazard blocks
reduce next boss hazard
score bonus
gold bonus
```

Overflow must not become:

```text
extra boss damage beyond cap
damage to the next enemy
boss phase skipping
Fever refill loops
```

### Board State Lifecycle Rule

The physical board is encounter-local.

Allowed to persist between nodes:

```text
HP
MP
shield/status if existing run rules allow
items
relics
upgrades
Fever meter
Fever Ready state if intended by current design
stage goal rewards
```

Forbidden to persist between nodes:

```text
Charged Lines
paused completed lines
Soft Junk
Fever Heat
active Fever state
releaseRequested
unresolved cascades
Showtime Overflow pending state
enemy countdowns
temporary boss cap state
charged board markers
soft junk board markers
```

Sequential enemy nodes may keep the same node board only while the encounter pack is still active. When the full node ends, board-local Fever state must be cleared.

Boss nodes must always start with a fresh boss board. A player may enter with Fever meter or Ready state, but never with preloaded Charged Lines.

### Fever Pressure Budget

During active Fever, enemy/boss block-add pressure should not be hard-cancelled by hidden scripting.

Instead, pressure scales by board danger:

| Pressure band | Behavior |
| --- | --- |
| Low | Full or near-full pressure applies. |
| Medium | Reduced pressure applies; small Fever Heat gain. |
| High | Small hard pressure applies; excess becomes Soft Junk, Fever Heat, delayed pressure, or boss advantage. |
| Critical | Direct hard pressure is mostly converted into non-instant-loss pressure. Last-resort repair is allowed only for impossible states. |

### Soft Junk

Soft Junk is temporary Fever-compatible board pressure.

Rules:

- Soft Junk may appear during Fever from pressure conversion.
- It should be visually/logically distinct from normal junk.
- It must not spawn directly in the piece spawn zone.
- It must resolve safely when Fever ends.
- It must not persist between nodes.
- It must never create unavoidable instant Game Over.

### Fever Heat

Fever Heat is the greed pressure system.

Heat increases from:

```text
staying in Fever longer
stacking many Charged Lines
boss pressure during Fever
high board pressure
Soft Junk generated during Fever
critical pressure conversion
```

Heat levels:

| Heat | Level |
| ---: | --- |
| 0-19 | none |
| 20-39 | low |
| 40-69 | medium |
| 70-99 | high |
| 100+ | max |

Heat should punish greedy play through reduced rewards, boss advantage, delayed pressure, or lower overflow efficiency. It must not block Fever release or directly cause unavoidable instant Game Over.

### Fever Upgrades

Fever upgrades are allowed but must stay capped.

| Upgrade ID | Name | Effect | Max Stack |
| --- | --- | --- | ---: |
| `upg_fever_gain` | Festival Hype | Fever gain +10% per stack | 5 |
| `upg_fever_duration` | Longer Showtime | Fever duration +1 lock per stack | 3 |
| `upg_fever_capacity` | Bigger Stage | Max Charged Lines +1 per stack | 2 |
| `upg_fever_manual_release` | Graceful Release | Manual Fever release grants +3 shield per stack | 3 |
| `upg_fever_safety_release` | Safety Confetti | High/critical-pressure release clears 1 hazard block per stack | 2 |
| `upg_fever_overflow` | Showtime Overflow | Boss overflow converts 20% more efficiently per stack | 3 |
| `upg_fever_star_encore` | Star Encore | After safe Fever release, create 1 star block if space exists | 1 |

Boss/final boss caps always override upgrade bonuses.

No upgrade may:

```text
increase boss direct damage cap
allow Charged Lines to persist between nodes
increase boss max Charged Lines above 4
increase boss/final boss Fever duration above 5 locks
skip multiple boss phases
create infinite Fever refill loops
```

### UI / UX Placement

Fever UI must stay inside the existing portrait-mobile layout.

Required UI signals:

```text
Fever meter
Ready state
Activate control
Active Showtime state
locks remaining
Charged Lines current/max
Release control
Fever Heat level
Soft Junk indicator
Showtime Overflow summary
Boss Drama Guard feedback
```

Placement rules:

- Use the right rail Fever stat card or compact HUD pattern.
- Activate/Release should use existing action/control patterns.
- Do not add a separate top HP/Mana/Fever status bar.
- Do not cover the board, Hold, Next Queue, right rail, inventory, event log, or bottom controls.

### Stage 5 Goal Clarification

Stage 5 goal success should grant **partial Fever meter or Fever Ready state** at boss start.

It must not grant:

```text
prebuilt Charged Lines
paused completed rows
Soft Junk
Fever Heat
unresolved Fever release
preloaded boss damage
```

### Save / Load Requirements

Old saves without Fever state must normalize safely.

Invalid active Fever state must repair by:

```text
clearing active Fever
clearing Charged Lines
clearing Soft Junk
clearing Heat
clearing release requests
preserving valid meter / Ready state
logging dev warning
```

Player-facing repair message, if needed:

```text
Showtime state repaired safely.
```
<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_END -->
