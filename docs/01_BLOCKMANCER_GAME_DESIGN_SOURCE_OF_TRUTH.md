# Blockmancer Dungeon — Game Design Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for product identity, tone, gameplay pillars, layout, stages, heroes, Cascade Gravity, Fever Showtime, and upgrade design.

## 1. Project Identity

Blockmancer Dungeon is a cheerful portrait-mobile falling-block roguelike RPG.

A magical festival machine called the Block-O-Matic 3000 goes haywire during the Festival of Falling Stars and opens a colorful dungeon beneath the town square. Players clear rune block lines, trigger Cascade Gravity combos, cast silly spells, collect snacks, relics, upgrades, items, and unlock quirky heroes while restoring festival order.

Core fantasy:

```text
You are a Blockmancer cleaning up magical chaos one combo at a time.
```

Core theme:

```text
Creativity fixes chaos better than control.
```

## 2. Tone Rules

Use:

```text
cheerful fantasy
cute chaos
festival adventure
funny monsters
cozy arcade energy
bright 32-bit pixel-art style
lighthearted dungeon crawl
readable, colorful, playful UI and text
```

Avoid:

```text
dark curse lore
grim tragedy
horror tone
edgy fantasy content
realistic gore
hopeless apocalypse
skull-heavy UI
overly serious villain writing
```

Use **Oopsies**, **Silly Drawbacks**, or **Festival Mishaps** instead of curse language in player-facing text.

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

Cascade reward direction:

```text
Cascade 1: 100% damage
Cascade 2: 125% damage
Cascade 3: 150% damage
Cascade 4+: 200% damage
Cascade mana bonus: 50% of normal mana gain
```

## 5. Portrait Mobile Layout

Canonical reference frame:

```text
1080 × 1920
```

Section ratios:

| Section | Percent | Size |
| --- | ---: | --- |
| Combat UI + Event Log | 25% | 1080×480 |
| Puzzle Gameplay Area | 55% | 1080×1056 |
| Controls / Spells / Actions | 20% | 1080×384 |

Combat section rules:

- Hero left, enemy right.
- Center VFX lane for attacks, spells, damage numbers, and cascade callouts.
- Names centered below sprites.
- Player HP/MP/shield near hero.
- Enemy HP/shield/intent near enemy.
- Event Log stays inside bottom of combat area.
- Monster stack preview sits near enemy side without covering the board or log.
- No separate top HP/Mana/Fever bar.

Puzzle section rules:

- Main board centered.
- Hold panel on left rail.
- Next Queue on left rail, up to 4 upcoming pieces when space allows.
- Right rail stat cards: Fever, Combo, Cascade, Lines, Score, Next Attack, Target Effect.
- Inventory compact indicator or button.
- Board, Hold, Next Queue, and right rail must not be covered by Event Log.

Controls section rules:

- Row 1: Move Left, Move Right, Soft Drop, Rotate, Hold, Hard Drop.
- Row 2: Spell 1-4, Skill 1-2, Bag/Inventory, Settings.
- Controls must remain visible.
- Touch targets must be thumb-friendly.

## 6. Stages and Bosses

| Stage | Stage ID | Name | Theme | Main Mechanics | Boss |
| ---: | --- | --- | --- | --- | --- |
| 1 | `stage_sprinkle_sewers` | Sprinkle Sewers | Candy sewers, frosting pipes, cupcake slime | Sticky blocks, sprinkle blocks, bonus mana | `boss_cupcake_slime_king` |
| 2 | `stage_goblin_workshop` | Goblin Workshop | Machines, conveyor belts, toy bombs | Junk blocks, bombs, board shake | `boss_prototype_no_7` |
| 3 | `stage_frosty_pantry` | Frosty Pantry | Magical freezer, rainbow ice cream | Ice blocks, speed waves, freeze | `boss_gelato_golem` |
| 4 | `stage_pillow_castle` | Pillow Castle | Pillows, plush toys, blanket ghosts | Soft blocks, shields, Sleepy status | `boss_sir_snore_a_lot` |
| 5 | `stage_starfall_arcade` | Starfall Arcade | Neon machines, prize counters | Fever Showtime, cascade bonuses, combo challenge | `boss_high_score_hydra` |
| 6 | `stage_bloxleys_block_palace` | Bloxley’s Block Palace | Royal blocks, square banners, confetti | Royal blocks, symmetry, pattern junk | `boss_king_bloxley` |

Boss rules:

- Bosses are readable and funny.
- Every boss has a rule card before combat.
- Phase changes are clear in UI/log text.
- Boss mechanics match stage mechanics.
- Boss Drama Guard prevents one-shot or multi-phase skip from Fever.

## 7. Playable Heroes

| Hero | ID | Role | Passive Intent |
| --- | --- | --- | --- |
| Milo | `hero_milo_blockmancer` | Balanced starter | First cascade each battle grants bonus mana. |
| Pippa | `hero_pippa_pyromancer` | Fire/spell damage | Fire spells burn sticky or junk blocks. |
| Nixie | `hero_nixie_frostbinder` | Control/safety | Smooths speed spikes or freeze pressure once per room. |
| Bruk | `hero_bruk_snack_knight` | Defense/rescue | Survives overflow once or gains emergency shield. |
| Zuzu | `hero_zuzu_goblin_engineer` | Bomb chaos | More bomb blocks with controlled junk risk. |
| Lumi | `hero_lumi_star_witch` | Advanced cascade mastery | Star blocks heavily boost cascade damage. |

## 8. Map Node Scaling

| Stage | Main Path Nodes | Total Generated Nodes | Required Structure |
| ---: | ---: | ---: | --- |
| 1 | 6 | 9-11 | 3 normal, 1 event, 1 treasure/rest, 1 boss. No elite. |
| 2 | 8 | 12-14 | 4 normal, 1 event, 1 shop, 1 elite, 1 boss. |
| 3 | 10 | 15-17 | 5 normal, 1 event, 1 rest, 1 treasure, 1 elite, 1 boss. |
| 4 | 12 | 18-21 | 6 normal, 2 events, 1 shop, 1 rest, 1 elite, 1 boss. |
| 5 | 14 | 22-25 | 7 normal, 2 events, 1 shop, 1 treasure, 2 elites, 1 boss. |
| 6 | 16 | 26-30 | 8 normal, 2 events, 1 shop, 1 rest, 2 elites, 1 royal guard/mini-boss, 1 final boss. |

## 9. Dynamic Board Size

| Stage | Base Size |
| ---: | --- |
| 1 | 8×16 |
| 2 | 9×17 |
| 3 | 9×18 |
| 4 | 10×18 |
| 5 | 10×19 |
| 6 | 10×20 |

Rules:

- Normal fights use stage base size.
- Elite rooms can shrink width or height for tighter risk.
- Boss phases may shrink, expand, or reshape temporarily.
- Rest and treasure rooms may be slightly larger or safer.
- Never shrink below 6×12.
- Never exceed mobile-readable limits.
- If shrink would invalidate occupied cells, prevent, crop carefully with fallback, or clear overflow with clear feedback.

## Fever Showtime Cascade — Current Canonical Rules

Fever is Showtime Cascade mode, not a passive always-on buff.

Lifecycle:

```text
Fill Fever meter
→ Activate Showtime
→ Completed lines become Charged Lines
→ Stack during a short lock window
→ Release manually or automatically
→ Clear Charged Lines together
→ Resolve through normal Cascade Gravity
→ Apply combat damage, boss caps, overflow, pressure safety, and upgrade effects
```

Rules:

- Completed rows during Showtime become Charged Lines and do not clear immediately.
- Fever release must resolve through the existing Cascade Gravity system.
- Physical board state is encounter-local.
- Charged Lines, Soft Junk, Fever Heat, and unresolved release state never persist between nodes.
- Bosses and final bosses use Boss Drama Guard caps so Fever cannot one-shot or skip multiple phases.
- Boss/enemy block-add during Fever uses Pressure Budget, Soft Junk, and Fever Heat.
- Fever UI lives in compact HUD/right-rail/control patterns; do not create a separate top HP/Mana/Fever bar.


## Upgrade System Redesign — Current Canonical Rules

The upgrade system is split into three player-chosen categories:

```text
Hero
Board
Fever
```

Level-up flow:

```text
Node cleared
→ Node Result Screen
→ Level Up Ready
→ Choose upgrade category: Hero / Board / Fever
→ Show 3 upgrade cards from the selected category
→ Player picks 1 card
```

Card rarity/rank labels are removed from the normal upgrade system. Do not use Common / Uncommon / Rare / Epic / Legendary as normal card ranks.

Normal card progression is:

```text
Card Lv1 → Lv2 → Lv3 → Lv4 → Lv5 → Legendary Evolution
```

Every upgrade card has exactly 5 normal levels. Every level must provide a meaningfully different effect or behavior change. Avoid simple numeric-only stacking.

Slot rules:

```text
Total run upgrade slots: 5
Hero slots: max 2
Board slots: max 2
Fever slots: max 2
```

Valid examples:

```text
2 Hero / 2 Board / 1 Fever
2 Hero / 1 Board / 2 Fever
1 Hero / 2 Board / 2 Fever
```

Invalid examples:

```text
5 Hero
5 Board
5 Fever
```

Owned-card selection levels the card and does not consume a new slot. New-card selection claims an available category slot.

Owned cards should reappear more often than unowned cards. Higher-level owned cards should reappear more often than lower-level owned cards. Lv4 cards should receive strong priority so players can finish a build. Lv5 and Legendary cards are removed from the normal offer pool.

When a card reaches Lv5:

```text
Card reaches Lv5
→ readyToEvolve = true
→ play or queue evolution transition
→ show 2 Legendary Evolution choices from that card’s pool
→ player chooses 1
→ save legendaryEvolutionId
→ card becomes Legendary
```

Each active card should have at least 10 possible Legendary Evolutions. Only 2 are shown at evolution time. Legendary Evolution uses the same slot and does not consume an extra slot.

Hero-specific cards only appear for the selected hero. Generic Hero cards can appear for any hero. Board cards must preserve Cascade Gravity. Fever cards must respect Fever Showtime caps, Boss Drama Guard, and board-local state rules.


## Canonical Upgrade Card Pools

### Hero Cards

Hero-specific:

| Hero | Card | Direction |
| --- | --- | --- |
| Milo | Listening Lines | Cascade, mana, warnings, careful board reading. |
| Pippa | Hearthfire | Fire, spell cleanup, sticky/junk control. |
| Zuzu | Safe Prototype | Bombs, gadgets, junk risk control. |
| Nixie | Slow the Room | Freeze, speed, tempo control. |
| Bruk | Table Guard | Shield, pressure response, emergency rescue. |
| Lumi | Star Path | Star blocks, cascade, Fever release timing. |

Hero-generic:

```text
Hero Focus
Festival Courage
Careful Footing
Clever Timing
```

Hero synergy direction:

| Hero | Preferred Build Direction |
| --- | --- |
| Milo | Hero + Board; cascade, mana, warning hints. |
| Pippa | Hero + Board cleanup; fire, sticky, junk control. |
| Zuzu | Hero + Board chaos; bomb, gadget, junk risk control. |
| Nixie | Hero + Board tempo; freeze, speed, ice control. |
| Bruk | Hero + Board defense; shield, pressure, emergency rescue. |
| Lumi | Hero + Fever + Board; star, cascade, Showtime timing. |

### Board Cards

```text
Gravity Choir
Tidy Falling
Deep Stack Rhythm
Space Reader
Pocket Planner
Queue Comb Training
Early Warning Ribbon
Soft Landing
Square Etiquette
```

Board category owns Cascade Gravity rewards, Hold, Next Queue, board space/profile, hazard blocks, Soft Junk, royal blocks, low ceiling, special blocks, and line-clear utility.

### Fever Cards

```text
Festival Hype
Longer Showtime
Bigger Stage
Graceful Release
Safety Confetti
Showtime Overflow
Star Encore
Stagecraft
```

Fever category owns Fever gain, Showtime duration, Charged Lines, manual release, auto release, Fever Heat, Soft Junk conversion, Showtime Overflow, Boss Drama Guard interaction, and Star Encore.

Fever hard limits:

```text
Cannot bypass Boss Drama Guard.
Cannot increase boss direct damage caps unsafely.
Cannot skip multiple boss phases.
Cannot create infinite Fever loops.
Cannot preserve Charged Lines between nodes.
```


## Upgrade Runtime Data Model

Target card definition:

```ts
type UpgradeCategory = "hero" | "board" | "fever";

type UpgradeCardDefinition = {
  id: string;
  category: UpgradeCategory;
  heroId?: string;
  isGenericHeroCard?: boolean;
  maxLevel: 5;
  slotCost: 1;
  levels: UpgradeCardLevel[];
  legendaryPool: LegendaryEvolutionDefinition[];
};

type UpgradeCardLevel = {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  effectType: string;
  effectConfig: Record<string, unknown>;
};

type LegendaryEvolutionDefinition = {
  id: string;
  name: string;
  description: string;
  effectType: string;
  effectConfig: Record<string, unknown>;
  tags: string[];
  unlockCondition?: LegendaryUnlockCondition;
};
```

Target run state:

```ts
type RunUpgradeCardState = {
  cardId: string;
  category: "hero" | "board" | "fever";
  level: 1 | 2 | 3 | 4 | 5;
  slotIndex: number;
  readyToEvolve?: boolean;
  legendaryEvolutionId?: string;
};

type RunUpgradeSlotState = {
  index: number;
  category?: "hero" | "board" | "fever";
  cardId?: string;
};

type RunUpgradeState = {
  version: number;
  slots: RunUpgradeSlotState[];
  ownedCards: Record<string, RunUpgradeCardState>;
  compatibilityUpgradeIds?: string[];
};
```

Save/load rules:

- New runs create a valid empty `RunUpgradeState` with 5 slots.
- Missing, partial, or malformed upgrade state normalizes safely.
- Compatibility upgrade IDs must not crash old saves.
- Save state preserves card category, level, slot index, ready-to-evolve state, and selected Legendary Evolution.
- Fever board-local state is not stored between nodes.


## Upgrade Compatibility Mapping

Save-facing upgrade IDs must remain safe. Existing run data that references earlier upgrade IDs should be mapped, aliased, or preserved in compatibility storage.

| Compatibility ID | New Direction |
| --- | --- |
| `upg_clean_stack` | Board / Space Reader or Soft Landing |
| `upg_sharp_sprinkles` | Board / Gravity Choir |
| `upg_extra_frosting` | Hero / Festival Courage |
| `upg_mana_lemonade` | Hero / Hero Focus |
| `upg_combo_cheer` | Board / Gravity Choir or Deep Stack Rhythm |
| `upg_bigger_booms` | Hero / Zuzu — Safe Prototype |
| `upg_hotter_oven` | Hero / Pippa — Hearthfire |
| `upg_chill_zone` | Hero / Nixie — Slow the Room |
| `upg_pocket_snack` | Hero / Bruk — Table Guard or Festival Courage |
| `upg_bonus_preview` | Board / Queue Comb Training |
| `upg_quick_hold` | Board / Pocket Planner |
| `upg_inventory_pouch` | Keep as compatibility/shop/meta utility unless already used by run upgrades |
| `upg_lucky_roll` | Hero / Clever Timing |
| `upg_festival_fever` | Fever / Festival Hype |
| `upg_smooth_cascade` | Board / Gravity Choir |


## Upgrade Validation Rules

Validation should check:

```text
Every card belongs to Hero / Board / Fever.
Every card has maxLevel = 5.
Every card has slotCost = 1.
Every card has exactly 5 normal levels.
Every level has title, description, effectType, and effectConfig.
Every level effectType has a runtime handler or explicit safe fallback warning.
Every active card has a Legendary pool.
Every active card has at least 10 Legendary options, or a tracked warning while content is partial.
Only 2 Legendary options are shown during evolution.
Legendary Evolution does not consume an extra slot.
Category slot limits are respected.
Hero-specific cards only appear for the selected hero.
Generic Hero cards can appear for any hero.
Fever cards cannot bypass Boss Drama Guard.
Fever cards cannot create infinite Fever loops.
Fever cards cannot preserve Charged Lines between nodes.
Board cards cannot replace or break Cascade Gravity.
Lv5 and Legendary cards stop appearing as normal upgrade cards.
Compatibility upgrade IDs are safe.
```


## 10. Result Screen and Level-Up Timing

Node rewards and upgrade decisions happen after the full battle node is cleared.

Required post-node flow:

```text
Full encounter pack defeated
→ Node Result Screen
→ Show EXP gained this node
→ Show EXP breakdown
→ Show EXP remaining to next level
→ If Level Up Ready, enter upgrade category selection
→ Return to map after pending rewards are resolved
```

## 11. Save Requirements

Run save must include:

- Player HP, mana, shield, gold.
- Board state only when safe and intended.
- Stage, map, node, route progress, and encounter pack state.
- Current enemy pack/index when mid-node save is supported.
- Player level, EXP, pending level-ups.
- Upgrade slots, card levels, category ownership, Legendary selection.
- Route choices, true flags, endings, and meta unlocks.

Save rules:

- Missing fields normalize safely.
- Content IDs are save-facing and stable.
- Do not rename IDs without migration.
- Fever board-local state never persists between nodes.
