# Blockmancer Dungeon — Monster Wikipedia Source of Truth

**Generated:** 2026-05-22  
**Version:** Full Metadata Revision 2 — Canonical Asset Metadata Overlay  
**Proposed file:** `docs/06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md`  
**Purpose:** Canonical monster encyclopedia and metadata catalog for Blockmancer Dungeon: regular monsters, elite monsters, elite mini-boss / royal guard, bosses, stage identity, attack/effect intent, counterplay, friendship hooks, canonical asset paths, exact animation file contracts, artist brief notes, reward tags, and implementation-status tracking.

> This file is a monster-facing SOT. It organizes monster facts; it does **not** override Game Design, Reactive Difficulty, Asset/Animation, Story, or Release Implementation SOT files.

---

## 0. Source Precedence

Read these files first when updating monster content:

1. `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`
2. `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`
3. `docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md`
4. `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md`
5. `docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md`
6. `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`
7. `docs/06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md`

Conflict rules:

- Game identity, tone, stage list, map structure, hero unlocks, Cascade Gravity, and ID prefixes come from the Game Design SOT.
- Hazard behavior, counter windows, item counters, route reward/risk modifiers, and fairness rules come from the Gameplay / Reactive Difficulty SOT.
- Sprite sizes, animation states, exact-frame naming, and fallback behavior come from the Asset / Animation SOT. Canonical primary folder paths and legacy/fallback path policy come from the Canonical Folder Structure SOT.
- Current runtime status comes from the Release Implementation SOT and new repo audits.
- This file owns monster wiki metadata: role, stage fit, personality, attack intent, hook mapping, counterplay, friendship hooks, asset brief notes, reward notes, and per-monster implementation tracking.

---

## 1. Global Monster Tone Rules

Monster writing must stay:

- Cheerful fantasy.
- Cute chaos.
- Funny and readable.
- Festival adventure / magical arcade energy.
- Friendly enough to support friendship and collection.
- Never horror, gore, grim tragedy, edgy villain fantasy, realistic violence, or “curse/blood” framing.

Use words like:

```text
mess, mishap, hiccup, prank, overexcited, sleepy, sticky, bouncy, royal decree, snack panic, frosting, confetti, toy, festival
```

Avoid words like:

```text
curse, blood, doom, nightmare, plague, death, gore, skull, torture, corruption
```

---

## 2. Monster Rank Taxonomy

| Rank | Content ID Pattern | Node Type | Purpose | Reward Tier |
|---|---|---|---|---|
| Regular | `mon_*` | Normal battle | Teach and repeat stage mechanic safely. | Normal |
| Elite | `mon_elite_*` | Elite node | Test stage mechanic mastery with distinct action pattern. | Better than normal, below boss |
| Elite Mini-Boss / Royal Guard | `mon_elite_*` | Special Stage 6 royal guard / mini-boss node if supported | Final-stage skill check before King Bloxley. | High elite / mini-boss, below boss |
| Boss | `boss_*` or current repo-compatible `mon_boss_*` alias | Boss node | Stage capstone with rule card, phases, and story callback. | Boss |

Rules:

- Stage 1 has no elite node in normal map flow.
- Elite nodes begin at Stage 2.
- Elite monsters are separate content entries, not only stat-scaled regular monsters.
- Boss mechanics must match stage mechanics.
- All major hazards require readable warning/counterplay.
- Unsupported runtime effects must fail safely and be marked as fallback/partial.

---

## 3. Monster Metadata Schema

Use the repo’s existing JSON schema when implementing. This schema is the wiki target so every monster has complete metadata.

```ts
type MonsterWikiMetadata = {
  id: string;
  name: string;
  rank: "regular" | "elite" | "elite_miniboss" | "boss";
  stageNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stageId: string;
  stageName: string;
  biomeTheme: string;
  role: string;
  tier: number;
  rarity: "common" | "uncommon" | "elite" | "elite_miniboss" | "boss";
  spawnNode: "normal" | "elite_node" | "royal_guard_node" | "boss_node";
  personality: string;
  description: string;
  primaryMechanic: string;
  stats: {
    hpTarget: number;
    attackTarget: number;
    armorTarget: number;
    attackIntervalLocks: number | string;
  };
  actions: {
    basicActionId: string;
    basicDamage: number;
    specialActionId: string;
    effectHook: string;
    warningRequired: "Yes" | "No" | "Prefer" | string;
    counterplay: string;
  };
  traits: {
    resistances: string;
    weaknesses: string;
    tags: string;
  };
  rewardNotes: string;
  friendshipHook: string;
  asset: {
    spriteKey: string;
    iconKey: string;
    canonicalFolder: string;
    animationContract: string;
  };
  implementationStatus: "Implemented" | "Partial" | "Fallback Only" | "Not Implemented" | "Unknown" | string;
};
```

Stats in this wiki are **starting balance targets**. Final runtime values may be adjusted by `difficulty-scaling`, stage multipliers, node rank, relics, route modifiers, and balance patches.

---

## 4. Stage Mechanical Identity

| Stage | Stage ID | Stage Name | Biome Theme | Main Mechanics | Boss |
| --- | --- | --- | --- | --- | --- |
| 1 | stage_sprinkle_sewers | Sprinkle Sewers | Candy sewers, frosting pipes, cupcake slime, rainbow runoff | Sticky blocks; sprinkle blocks; bonus mana | boss_cupcake_slime_king |
| 2 | stage_goblin_workshop | Goblin Workshop | Goblin machines, conveyor belts, springs, toy bombs, “Totally Safe” signs | Junk blocks; bomb blocks; board shake; gadget pressure | boss_prototype_no_7 |
| 3 | stage_frosty_pantry | Frosty Pantry | Magical freezer, rainbow ice cream, cold pudding, sliding ice blocks | Ice blocks; slow/fast fall speed waves; active-piece freeze | boss_gelato_golem |
| 4 | stage_pillow_castle | Pillow Castle | Pillow castle, living toys, plush dragons, blanket ghosts, button knights | Soft blocks; shield enemies; Sleepy status | boss_sir_snore_a_lot |
| 5 | stage_starfall_arcade | Starfall Arcade | Magical arcade, neon lights, living game machines, prize claw mimics | Fever meter; cascade bonus; combo challenge | boss_high_score_hydra |
| 6 | stage_bloxleys_block_palace | Bloxley’s Block Palace | Giant block palace, confetti, toy royal guards, square banners, symmetry obsession | Royal blocks; symmetry challenge; pattern junk; final cascade check | boss_king_bloxley |


---

# 5. Regular Monster Full Metadata Catalog


## Stage 1 — Sprinkle Sewers

**Biome:** Candy sewers, frosting pipes, cupcake slime, rainbow runoff  
**Main mechanics:** Sticky blocks; sprinkle blocks; bonus mana  
**Boss:** `boss_cupcake_slime_king`


### Identity Metadata

| ID | Name | Rank | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_cupcake_slime | Cupcake Slime | regular | basic | 1 | common | normal | Bouncy, hungry, cheerful | A small cupcake-shaped slime that treats the dungeon like a snack parade. | Start battle with 1 sprinkle block. |
| mon_sugar_bat | Sugar Bat | regular | disruptor | 1 | common | normal | Fluttery, curious, sugar-rushed | A tiny bat with sugar-dust wings that loves peeking at the next piece before the player does. | Next preview hide duration reduced. |
| mon_crumb_goblin | Crumb Goblin | regular | junk | 1 | common | normal | Messy, proud of tiny piles | A crumb-hoarding goblin who believes every clean board needs a garnish. | Junk blocks have a chance to become normal blocks. |
| mon_jelly_rat | Jelly Rat | regular | fast | 1 | common | normal | Tiny, speedy, wobbly | A little jelly rat that skitters between frosting puddles and teaches attack-tempo awareness. | Slightly improves early speed-warning readability. |
| mon_sprinkle_snail | Sprinkle Snail | regular | support | 1 | common | normal | Slow, polite, accidentally sticky | A decorated snail that leaves frosting trails exactly where the board least expects them. | Sticky warning appears earlier. |
| mon_frosting_blob | Frosting Blob | regular | tank | 1 | uncommon | normal | Round, stubborn, sweet | A glossy frosting mound that makes the first dungeon feel chunky without becoming scary. | Frosting block may convert into a mana treat. |


### Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_cupcake_slime | 28 | 3 | 0 | 6 | act_cupcake_boop | 3 | act_sprinkle_drop | block_sprinkle / mana-positive board bonus | No for basic; Yes if sprinkle placement is targeted | cascade; normal line clear; mana spending | sticky | fire; clean_cut |
| mon_sugar_bat | 24 | 3 | 0 | 5 | act_sugar_nip | 3 | act_sweet_peek_prank | hazard_preview_hidden / light preview flicker | Yes for preview hide | item_preview_glasses; queue memory; quick line clear | none | star; clean_cut |
| mon_crumb_goblin | 34 | 4 | 0 | 5 | act_crumb_toss | 4 | act_crumb_junk_toss | block_crumb_junk / hazard_incoming_junk_queue for stronger variants | Prefer warning when queueing junk | cascade; item_snack_vacuum; spl_clean_cut | junk | bomb; clean_cut |
| mon_jelly_rat | 26 | 4 | 0 | 4 | act_jelly_nibble | 4 | act_wobble_rush | basic_attack with shorter attackIntervalLocks | Intent only | shield; heal; faster clears | jelly | star; bomb |
| mon_sprinkle_snail | 38 | 3 | 1 | 6 | act_slow_squish | 3 | act_sticky_trail | block_sticky insertion | Yes when inserting sticky block | fire; spl_clean_cut; cascade before spread | sticky | fire |
| mon_frosting_blob | 46 | 4 | 2 | 6 | act_frosting_flop | 4 | act_soft_armor | enemy armor / shield-style mitigation | Intent only | spell damage; bomb; sustained cascades | sticky; soft | fire; bomb |


### Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_cupcake_slime | mon_cupcake_slime | ico_mon_cupcake_slime | public/assets/sprites/monsters/mon_cupcake_slime/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | small_gold; item_common; friendship_points | stage_1; basic; block_sprinkle | Unknown until repo audit |
| mon_sugar_bat | mon_sugar_bat | ico_mon_sugar_bat | public/assets/sprites/monsters/mon_sugar_bat/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | small_gold; item_common | stage_1; disruptor; hazard_preview_hidden | Unknown until repo audit |
| mon_crumb_goblin | mon_crumb_goblin | ico_mon_crumb_goblin | public/assets/sprites/monsters/mon_crumb_goblin/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_1; junk; block_crumb_junk | Unknown until repo audit |
| mon_jelly_rat | mon_jelly_rat | ico_mon_jelly_rat | public/assets/sprites/monsters/mon_jelly_rat/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | small_gold; item_common | stage_1; fast; basic_attack with shorter attackIntervalLocks | Unknown until repo audit |
| mon_sprinkle_snail | mon_sprinkle_snail | ico_mon_sprinkle_snail | public/assets/sprites/monsters/mon_sprinkle_snail/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_1; support; block_sticky insertion | Unknown until repo audit |
| mon_frosting_blob | mon_frosting_blob | ico_mon_frosting_blob | public/assets/sprites/monsters/mon_frosting_blob/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; chance_item_uncommon | stage_1; tank; enemy armor | Unknown until repo audit |



## Stage 2 — Goblin Workshop

**Biome:** Goblin machines, conveyor belts, springs, toy bombs, “Totally Safe” signs  
**Main mechanics:** Junk blocks; bomb blocks; board shake; gadget pressure  
**Boss:** `boss_prototype_no_7`


### Identity Metadata

| ID | Name | Rank | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_wrench_goblin | Wrench Goblin | regular | disruptor | 2 | common | normal | Confident repair goblin, dubious safety sense | A workshop goblin who believes every loose bolt should become a board problem. | Shop gadget discount or safer machine event. |
| mon_button_masher | Button Masher | regular | chaos | 2 | common | normal | Overexcited, button-obsessed | A goblin-adjacent gremlin who presses every button because buttons are “clearly invitations.” | Board shake reduced. |
| mon_spring_bot | Spring Bot | regular | speed | 2 | common | normal | Boingy, helpful in the least helpful way | A wind-up spring bot whose bounce tests tempo recovery. | Small soft-drop control bonus event. |
| mon_spark_gremlin | Spark Gremlin | regular | caster | 2 | uncommon | normal | Tiny electrician with dramatic sparks | A glittering workshop pest that treats mana like a loose wire. | Gadget mishap warning appears earlier. |
| mon_gear_slime | Gear Slime | regular | tank | 2 | uncommon | normal | Squelchy gear collector | A slime with little gears floating inside it, slow but annoyingly sturdy. | Machine junk sometimes cracks on cascade. |
| mon_rattle_drone | Rattle Drone | regular | flying | 2 | uncommon | normal | Noisy, dutiful, badly calibrated | A rattling toy drone that drops workshop clutter with surprising ceremony. | Preview disruption duration reduced. |


### Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_wrench_goblin | 42 | 5 | 0 | 5 | act_wrench_bonk | 5 | act_loose_bolt_junk | block_crumb_junk insertion / incoming junk light | Prefer warning for junk queue | cascade; bomb; item_snack_vacuum | machine | bomb |
| mon_button_masher | 40 | 5 | 0 | 4 | act_button_bop | 5 | act_board_shake | board shake warning / visual-only shake if mechanics unsupported | Yes | steady play; item_nope_stamp for upgraded form | none | clean_cut |
| mon_spring_bot | 44 | 5 | 1 | 4 | act_spring_bump | 5 | act_spring_speedup | hazard_speed_wave light / temporary fall-speed change | Yes for speed-up | item_speed_brake; Nixie passive; soft drop discipline | machine | frost |
| mon_spark_gremlin | 38 | 6 | 0 | 4 | act_spark_zap | 6 | act_mana_zap | mana damage/reduction if supported; fallback to basic_attack + event log | Intent only | shield; quick clear; mana item | electric_machine | ice; bomb |
| mon_gear_slime | 58 | 5 | 2 | 5 | act_gear_slam | 5 | act_gear_armor | enemy armor / slow heavy attack | Intent only | bomb; spell damage; cascade multiplier | machine; armor | bomb; fire |
| mon_rattle_drone | 36 | 6 | 0 | 4 | act_rattle_ping | 6 | act_column_junk_drop | incoming junk / column-targeted junk warning | Yes | cascade; item_snack_shield; bomb | flying | star; gadget |


### Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_wrench_goblin | mon_wrench_goblin | ico_mon_wrench_goblin | public/assets/sprites/monsters/mon_wrench_goblin/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; gadget_item_common | stage_2; disruptor; block_crumb_junk insertion | Unknown until repo audit |
| mon_button_masher | mon_button_masher | ico_mon_button_masher | public/assets/sprites/monsters/mon_button_masher/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_2; chaos; board shake warning | Unknown until repo audit |
| mon_spring_bot | mon_spring_bot | ico_mon_spring_bot | public/assets/sprites/monsters/mon_spring_bot/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_2; speed; hazard_speed_wave light | Unknown until repo audit |
| mon_spark_gremlin | mon_spark_gremlin | ico_mon_spark_gremlin | public/assets/sprites/monsters/mon_spark_gremlin/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; mana_item_chance | stage_2; caster; mana damage | Unknown until repo audit |
| mon_gear_slime | mon_gear_slime | ico_mon_gear_slime | public/assets/sprites/monsters/mon_gear_slime/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_uncommon_chance | stage_2; tank; enemy armor | Unknown until repo audit |
| mon_rattle_drone | mon_rattle_drone | ico_mon_rattle_drone | public/assets/sprites/monsters/mon_rattle_drone/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_2; flying; incoming junk | Unknown until repo audit |



## Stage 3 — Frosty Pantry

**Biome:** Magical freezer, rainbow ice cream, cold pudding, sliding ice blocks  
**Main mechanics:** Ice blocks; slow/fast fall speed waves; active-piece freeze  
**Boss:** `boss_gelato_golem`


### Identity Metadata

| ID | Name | Rank | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_ice_cream_imp | Ice Cream Imp | regular | caster | 3 | common | normal | Chilly, mischievous, flavor-proud | A small frozen imp that mistakes “preserve the dessert” for “freeze the player’s plans.” | Freeze effects last shorter. |
| mon_popsicle_bat | Popsicle Bat | regular | disruptor | 3 | common | normal | Cold-winged, nosy, snack-shaped | A bat on a stick that flutters around the Hold panel and chills planning space. | First freeze warning gets +1 piece. |
| mon_chill_slime | Chill Slime | regular | control | 3 | common | normal | Calm until suddenly not calm | A frosty slime that teaches players not to trust the tempo staying gentle forever. | Ice blocks occasionally soften after cascade. |
| mon_freezer_mimic | Freezer Mimic | regular | trap | 3 | uncommon | normal | Patient, boxy, smugly cold | A freezer chest with a tiny grin and a very serious opinion about room temperature. | Freezer hazards telegraph sooner. |
| mon_snowcone_sprite | Snowcone Sprite | regular | support | 3 | common | normal | Bright, sprinkle-loving, accidentally chilly | A floating snowcone helper whose colorful ice makes cheerful trouble. | Grants a tiny shield after ice clear. |
| mon_pudding_penguin | Pudding Penguin | regular | basic | 3 | common | normal | Formal, slippery, dessert-proud | A pudding penguin that waddles with perfect manners and imperfect board effects. | Speed waves shorten slightly. |


### Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_ice_cream_imp | 54 | 6 | 0 | 4 | act_chilly_scoop | 6 | act_freeze_warning | hazard_freeze_warning | Yes | item_hot_cocoa; Nixie passive; frost counter tools | ice | fire |
| mon_popsicle_bat | 48 | 6 | 0 | 4 | act_popsicle_peck | 6 | act_hold_chill | preview/hold disruption; safe visual fallback | Yes | item_preview_glasses; queue memory; quick placement | ice; flying | fire; star |
| mon_chill_slime | 62 | 6 | 1 | 4 | act_chill_bump | 6 | act_slow_then_spike | hazard_speed_wave | Yes | item_speed_brake; Nixie passive; planned stacking | ice; sticky | fire |
| mon_freezer_mimic | 72 | 7 | 2 | 5 | act_freezer_chomp | 7 | act_deep_freeze | hazard_freeze_warning | Yes | item_hot_cocoa; spl_frost_lock normalization; fire | ice; armor | fire; bomb |
| mon_snowcone_sprite | 50 | 6 | 0 | 4 | act_snowflake_tap | 6 | act_ice_sprinkle | block_ice insertion | Prefer warning for targeted insertion | clean_cut; fire; cascade setup | ice | fire |
| mon_pudding_penguin | 58 | 7 | 1 | 4 | act_spoon_peck | 7 | act_slippery_slide | junk slide if supported; fallback to speed_wave/event log | Yes for slide/speed | item_speed_brake; bomb; cascade | ice | fire; star |


### Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_ice_cream_imp | mon_ice_cream_imp | ico_mon_ice_cream_imp | public/assets/sprites/monsters/mon_ice_cream_imp/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; frost_item_common | stage_3; caster; hazard_freeze_warning | Unknown until repo audit |
| mon_popsicle_bat | mon_popsicle_bat | ico_mon_popsicle_bat | public/assets/sprites/monsters/mon_popsicle_bat/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_3; disruptor; preview | Unknown until repo audit |
| mon_chill_slime | mon_chill_slime | ico_mon_chill_slime | public/assets/sprites/monsters/mon_chill_slime/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; frost_item_common | stage_3; control; hazard_speed_wave | Unknown until repo audit |
| mon_freezer_mimic | mon_freezer_mimic | ico_mon_freezer_mimic | public/assets/sprites/monsters/mon_freezer_mimic/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_uncommon_chance | stage_3; trap; hazard_freeze_warning | Unknown until repo audit |
| mon_snowcone_sprite | mon_snowcone_sprite | ico_mon_snowcone_sprite | public/assets/sprites/monsters/mon_snowcone_sprite/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; frost_item_common | stage_3; support; block_ice insertion | Unknown until repo audit |
| mon_pudding_penguin | mon_pudding_penguin | ico_mon_pudding_penguin | public/assets/sprites/monsters/mon_pudding_penguin/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_3; basic; junk slide if supported; fallback to speed_wave | Unknown until repo audit |



## Stage 4 — Pillow Castle

**Biome:** Pillow castle, living toys, plush dragons, blanket ghosts, button knights  
**Main mechanics:** Soft blocks; shield enemies; Sleepy status  
**Boss:** `boss_sir_snore_a_lot`


### Identity Metadata

| ID | Name | Rank | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_button_knight | Button Knight | regular | tank | 4 | common | normal | Brave, plush, extremely formal | A button-eyed knight who believes every nap needs a perimeter. | Small shield start or shield tutorial chip. |
| mon_blanket_ghost | Blanket Ghost | regular | control | 4 | common | normal | Gentle, drifting, nap-protective | A floating blanket spirit that wants everyone to lower their voice and maybe their controls. | Sleepy effect can heal slightly or reduce enemy action. |
| mon_plush_dragon | Plush Dragon | regular | caster | 4 | uncommon | normal | Dramatic, soft, proud of tiny roars | A toy dragon whose “flames” are fluffy enough to block the board anyway. | Soft blocks sometimes grant shield when cleared. |
| mon_toy_soldier | Toy Soldier | regular | basic | 4 | common | normal | Orderly, tiny, proud of marching | A toy soldier that attacks in neat patterns and teaches formation reads. | Pattern hint appears once per stage. |
| mon_pillow_squire | Pillow Squire | regular | defense | 4 | common | normal | Helpful, earnest, too padded | A junior pillow knight that tries to protect everyone with inconvenient cushions. | Rest node bonus. |
| mon_sock_sprite | Sock Sprite | regular | disruptor | 4 | common | normal | Tiny, giggly, impossible to fold | A small sock spirit that rearranges expectations like mismatched laundry. | Minor Sleepy duration reduction. |


### Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_button_knight | 82 | 7 | 2 | 5 | act_button_lance | 7 | act_shield_self | enemy shield/status | Intent text required | burst damage; bomb; cascade multiplier | shield; soft | bomb; clean_cut |
| mon_blanket_ghost | 66 | 7 | 0 | 4 | act_blanket_booh | 7 | act_sleepy_warning | Sleepy status / status_effect hook | Yes | item_alarm_cookie; Bruk safety tools | sleepy; soft | star; clean_cut |
| mon_plush_dragon | 76 | 8 | 1 | 4 | act_plush_puff | 8 | act_cotton_candy_flame | soft block insertion / shield pressure | Yes | bomb; clean_cut; cascade | soft | clean_cut; star |
| mon_toy_soldier | 72 | 8 | 1 | 4 | act_toy_poke | 8 | act_formation_attack | basic_attack + pattern intent / optional block pattern | Intent text required | planned clears; shield | none | bomb |
| mon_pillow_squire | 78 | 7 | 1 | 5 | act_squire_bop | 7 | act_soft_block_shield | soft block insertion / shield | Yes when adding board pressure | clean_cut; bomb; cascade | soft; shield | clean_cut |
| mon_sock_sprite | 60 | 7 | 0 | 4 | act_sock_slap | 7 | act_next_hold_swap | preview/hold disruption; safe fallback if unsupported | Yes | item_preview_glasses; queue memory | none | star |


### Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_button_knight | mon_button_knight | ico_mon_button_knight | public/assets/sprites/monsters/mon_button_knight/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; shield_item_common | stage_4; tank; enemy shield | Unknown until repo audit |
| mon_blanket_ghost | mon_blanket_ghost | ico_mon_blanket_ghost | public/assets/sprites/monsters/mon_blanket_ghost/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; rest_item_common | stage_4; control; Sleepy status | Unknown until repo audit |
| mon_plush_dragon | mon_plush_dragon | ico_mon_plush_dragon | public/assets/sprites/monsters/mon_plush_dragon/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_uncommon_chance | stage_4; caster; soft block insertion | Unknown until repo audit |
| mon_toy_soldier | mon_toy_soldier | ico_mon_toy_soldier | public/assets/sprites/monsters/mon_toy_soldier/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_4; basic; basic_attack + pattern intent | Unknown until repo audit |
| mon_pillow_squire | mon_pillow_squire | ico_mon_pillow_squire | public/assets/sprites/monsters/mon_pillow_squire/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; rest_item_common | stage_4; defense; soft block insertion | Unknown until repo audit |
| mon_sock_sprite | mon_sock_sprite | ico_mon_sock_sprite | public/assets/sprites/monsters/mon_sock_sprite/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_4; disruptor; preview | Unknown until repo audit |



## Stage 5 — Starfall Arcade

**Biome:** Magical arcade, neon lights, living game machines, prize claw mimics  
**Main mechanics:** Fever meter; cascade bonus; combo challenge  
**Boss:** `boss_high_score_hydra`


### Identity Metadata

| ID | Name | Rank | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_token_sprite | Token Sprite | regular | economy | 5 | common | normal | Shiny, excitable, prize-counter minded | A star-token sprite that turns economy into a tiny arcade duel. | Small ticket/gold bonus. |
| mon_combo_gremlin | Combo Gremlin | regular | combo | 5 | common | normal | Score-obsessed, theatrical | An arcade gremlin that applauds cascades and heckles flat play. | Fever gain bonus. |
| mon_neon_bat | Neon Bat | regular | disruptor | 5 | common | normal | Bright, flashy, harmlessly annoying | A neon-winged bat that turns the Next Queue into a blinking arcade marquee. | Neon flash warning earlier. |
| mon_prize_claw_mimic | Prize Claw Mimic | regular | trap | 5 | uncommon | normal | Patient, shiny, prize-hungry | A prize machine pretending very badly not to be alive. | Treasure node bonus. |
| mon_pixel_blob | Pixel Blob | regular | basic | 5 | common | normal | Glitchy, cute, gelatinous | A chunky arcade blob that pops into smaller problems unless hit cleanly. | Fever cosmetic sparkle. |
| mon_joystick_jester | Joystick Jester | regular | chaos | 5 | uncommon | normal | Trickster, bouncy, arcade-proud | A jester that insists every direction is funnier when temporarily questionable. | Controls warning text shorter. |


### Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_token_sprite | 84 | 8 | 0 | 3 | act_token_toss | 8 | act_ticket_tax | gold delta if supported; fallback to basic_attack/event log | Intent text required | quick defeat; cascade; Fever | none | star |
| mon_combo_gremlin | 88 | 8 | 0 | 3 | act_combo_pebble | 8 | act_no_cascade_tax | cascade quota / battle objective check | Yes | cascade setup; spl_cascade_cheer; Lumi passive | combo_pressure | star; fever |
| mon_neon_bat | 76 | 8 | 0 | 3 | act_neon_nip | 8 | act_neon_preview_flash | hazard_preview_hidden / visual preview flash | Yes for hidden preview | item_preview_glasses; queue memory | flying | star |
| mon_prize_claw_mimic | 102 | 9 | 1 | 4 | act_claw_snap | 9 | act_prize_claw_grab | target block threat / fallback to preview_hidden or event log | Yes | clear targeted block; bomb; cascade | machine | bomb; star |
| mon_pixel_blob | 96 | 8 | 1 | 4 | act_pixel_bump | 8 | act_pixel_split | summon/split if supported; fallback to shield/extra HP event | Intent text required | burst damage; cascade; Fever | jelly | star; bomb |
| mon_joystick_jester | 82 | 9 | 0 | 3 | act_joystick_jab | 9 | act_control_prank | control disruption if supported; fallback to bad_piece_delivery/event log | Yes | item_nope_stamp; calm input; quick clear | none | clean_cut; star |


### Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_token_sprite | mon_token_sprite | ico_mon_token_sprite | public/assets/sprites/monsters/mon_token_sprite/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold_variable; ticket_bonus | stage_5; economy; gold delta if supported; fallback to basic_attack | Unknown until repo audit |
| mon_combo_gremlin | mon_combo_gremlin | ico_mon_combo_gremlin | public/assets/sprites/monsters/mon_combo_gremlin/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; fever_item_chance | stage_5; combo; cascade quota | Unknown until repo audit |
| mon_neon_bat | mon_neon_bat | ico_mon_neon_bat | public/assets/sprites/monsters/mon_neon_bat/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_5; disruptor; hazard_preview_hidden | Unknown until repo audit |
| mon_prize_claw_mimic | mon_prize_claw_mimic | ico_mon_prize_claw_mimic | public/assets/sprites/monsters/mon_prize_claw_mimic/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; treasure_bonus_chance | stage_5; trap; target block threat | Unknown until repo audit |
| mon_pixel_blob | mon_pixel_blob | ico_mon_pixel_blob | public/assets/sprites/monsters/mon_pixel_blob/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; fever_item_common | stage_5; basic; summon | Unknown until repo audit |
| mon_joystick_jester | mon_joystick_jester | ico_mon_joystick_jester | public/assets/sprites/monsters/mon_joystick_jester/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_uncommon_chance | stage_5; chaos; control disruption if supported; fallback to bad_piece_delivery | Unknown until repo audit |



## Stage 6 — Bloxley’s Block Palace

**Biome:** Giant block palace, confetti, toy royal guards, square banners, symmetry obsession  
**Main mechanics:** Royal blocks; symmetry challenge; pattern junk; final cascade check  
**Boss:** `boss_king_bloxley`


### Identity Metadata

| ID | Name | Rank | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_royal_block_guard | Royal Block Guard | regular | tank | 6 | common | normal | Stiff, loyal, rectangle-respecting | A toy royal guard that believes the board should stand at attention. | Royal block warning earlier. |
| mon_square_jester | Square Jester | regular | disruptor | 6 | common | normal | Playful, rule-twisting, square-obsessed | A court jester who thinks every shape should become almost-but-not-quite square. | Royal pattern warning appears earlier. |
| mon_crown_bat | Crown Bat | regular | flying | 6 | common | normal | Tiny, regal, dramatic | A bat with a crown too large for its head and a dangerous interest in the Bag button. | Royal preview warning reduced. |
| mon_parade_golem | Parade Golem | regular | tank | 6 | uncommon | normal / royal_guard_candidate | Grand, rhythmic, ceremonial | A parade float-like golem that turns royal marching orders into board pressure. | Final-stage item reward. |
| mon_confetti_mage | Confetti Mage | regular | caster | 6 | uncommon | normal | Festive, chaotic, sincere | A palace caster who believes confetti is a planning language. | One chaos rule hint. |
| mon_banner_bug | Banner Bug | regular | support | 6 | common | normal | Busy, tiny, carries banners too tall | A tiny palace bug that waves banners to make other monsters feel official. | Pattern junk may crack on cascade. |


### Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_royal_block_guard | 124 | 10 | 3 | 4 | act_royal_bash | 10 | act_pattern_blocks | block_royal / pattern junk insertion | Yes | item_royal_eraser; clean_cut; cascade | royal; armor | clean_cut; bomb |
| mon_square_jester | 102 | 10 | 0 | 3 | act_square_jab | 10 | act_awkward_shape | hazard_royal_pattern / bad_piece_delivery | Yes | item_royal_eraser; queue control; cascades | royal | star; clean_cut |
| mon_crown_bat | 94 | 10 | 0 | 3 | act_crown_nip | 10 | act_inventory_curtain | inventory hide if supported; otherwise preview_hidden/event log | Yes; never hide Next/Hold/Inventory together | quick clear; item_preview_glasses fallback | flying | star |
| mon_parade_golem | 138 | 11 | 3 | 4 | act_parade_stomp | 11 | act_marching_junk | hazard_incoming_junk_queue / low ceiling for elite variant | Yes | cascade; snack_shield; bomb | armor; royal | bomb; clean_cut |
| mon_confetti_mage | 98 | 11 | 0 | 3 | act_confetti_spark | 11 | act_confetti_blocks | block_confetti / random block insertion; fallback event log | Prefer warning if harmful | cascade; clean_cut; star | magic | royal_eraser; clean_cut |
| mon_banner_bug | 90 | 10 | 0 | 3 | act_banner_poke | 10 | act_royal_cheer | enemy attack buff/status if supported; fallback event log | Intent text required | priority target; quick defeat; stun/freeze | none | star |


### Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_royal_block_guard | mon_royal_block_guard | ico_mon_royal_block_guard | public/assets/sprites/monsters/mon_royal_block_guard/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; royal_item_common | stage_6; tank; block_royal | Unknown until repo audit |
| mon_square_jester | mon_square_jester | ico_mon_square_jester | public/assets/sprites/monsters/mon_square_jester/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; royal_item_common | stage_6; disruptor; hazard_royal_pattern | Unknown until repo audit |
| mon_crown_bat | mon_crown_bat | ico_mon_crown_bat | public/assets/sprites/monsters/mon_crown_bat/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_6; flying; inventory hide if supported; otherwise preview_hidden | Unknown until repo audit |
| mon_parade_golem | mon_parade_golem | ico_mon_parade_golem | public/assets/sprites/monsters/mon_parade_golem/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_uncommon_chance | stage_6; tank; hazard_incoming_junk_queue | Unknown until repo audit |
| mon_confetti_mage | mon_confetti_mage | ico_mon_confetti_mage | public/assets/sprites/monsters/mon_confetti_mage/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; magic_item_chance | stage_6; caster; block_confetti | Unknown until repo audit |
| mon_banner_bug | mon_banner_bug | ico_mon_banner_bug | public/assets/sprites/monsters/mon_banner_bug/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | gold; item_common | stage_6; support; enemy attack buff | Unknown until repo audit |



---

# 6. Elite Monster Full Metadata Catalog

Elite monsters are distinct content entries. They should never be implemented as regular monsters with only larger stats. Each elite must have a readable intent, at least one special action, and counterplay through existing SOT-supported hooks or safe fallback behavior.


## Elite Identity Metadata

| ID | Name | Rank | Stage | Stage ID | Stage Name | Role | Tier | Rarity | Spawn Node | Personality | Description | Friendship Hook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_elite_crumb_goblin_foreman | Crumb Goblin Foreman | elite | 2 | stage_goblin_workshop | Goblin Workshop | elite_junk_commander | 2 | elite | elite_node | Clipboard goblin, smug but cute | A foreman who files every crumb as official workshop material. | Elite friendship optional; improve junk warning clarity. |
| mon_elite_button_masher_supervisor | Button Masher Supervisor | elite | 2 | stage_goblin_workshop | Goblin Workshop | elite_machine_mishap | 2 | elite | elite_node | Supervisor energy, zero restraint | A button expert whose official advice is “press the bigger one.” | Elite friendship optional; reduce button-prank severity. |
| mon_elite_ice_cream_imp_chillmaster | Ice Cream Imp Chillmaster | elite | 3 | stage_frosty_pantry | Frosty Pantry | elite_freeze_ice | 3 | elite | elite_node | Cold professional, flavor snob | An ice cream imp with a tiny badge that says Chillmaster of the Scoop. | Elite friendship optional; freeze windows widen slightly. |
| mon_elite_freezer_mimic_deluxe | Deluxe Freezer Mimic | elite | 3 | stage_frosty_pantry | Frosty Pantry | elite_speed_wave | 3 | elite | elite_node | Luxury appliance, suspicious grin | A fancy freezer chest that offers premium chilling and no refunds. | Elite friendship optional; speed spikes shorten. |
| mon_elite_blanket_ghost_duchess | Blanket Ghost Duchess | elite | 4 | stage_pillow_castle | Pillow Castle | elite_sleepy_soft | 4 | elite | elite_node | Regal, gentle, nap-law expert | A duchess of blankets who considers waking hours a negotiable tradition. | Elite friendship optional; Sleepy becomes less punishing. |
| mon_elite_button_knight_captain | Button Knight Captain | elite | 4 | stage_pillow_castle | Pillow Castle | elite_shield_wall | 4 | elite | elite_node | Noble, padded, very serious | A captain who commands the softest shield wall in the dungeon. | Elite friendship optional; shield warnings improve. |
| mon_elite_combo_gremlin_scorekeeper | Combo Gremlin Scorekeeper | elite | 5 | stage_starfall_arcade | Starfall Arcade | elite_combo_quota | 5 | elite | elite_node | Scorekeeper with tiny glasses | A gremlin who claps for cascades and files complaints against single clears. | Elite friendship optional; combo quota warnings improve. |
| mon_elite_prize_claw_mimic_jackpot | Jackpot Prize Claw Mimic | elite | 5 | stage_starfall_arcade | Starfall Arcade | elite_preview_disruptor | 5 | elite | elite_node | Glittery, patient, suspiciously generous | A prize claw that waits until the player loves a piece, then reaches for it. | Elite friendship optional; preview blackout shortens. |
| mon_elite_square_jester_prime | Square Jester Prime | elite | 6 | stage_bloxleys_block_palace | Bloxley’s Block Palace | elite_royal_pattern | 6 | elite | elite_node | Prime jester, crooked crown, perfect timing | A square jester whose jokes are mostly geometry problems. | Elite friendship optional; royal pattern appears earlier. |
| mon_elite_royal_block_guard_captain | Royal Block Guard Captain | elite | 6 | stage_bloxleys_block_palace | Bloxley’s Block Palace | elite_low_ceiling_royal | 6 | elite | elite_node | Strict, square, extremely polished | A captain who believes tall boards encourage unruly thoughts. | Elite friendship optional; low-ceiling warnings improve. |
| mon_elite_parade_golem_grand_marshal | Parade Golem Grand Marshal | elite_miniboss | 6 | stage_bloxleys_block_palace | Bloxley’s Block Palace | elite_miniboss_royal_guard | 6 | elite_miniboss | royal_guard_node / mini_boss_node if supported | Ceremonial, booming, oddly courteous | The royal guard’s parade leader and final pre-boss pressure test. | Optional: royal guard collection badge. |


## Elite Combat / Effect Metadata

| ID | HP Target | ATK Target | Armor | Attack Interval Locks | Basic Action | Basic Damage | Special Action | Effect Hook | Warning | Counterplay | Resistances | Weaknesses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mon_elite_crumb_goblin_foreman | 78 | 6 | 1 | 4 | basic_crumb_toss | 6 | elite_junk_work_order | hazard_incoming_junk_queue | 3 pieces | cascade; item_snack_shield; item_return_stamp; item_trash_lid | junk | bomb; clean_cut |
| mon_elite_button_masher_supervisor | 72 | 6 | 1 | 4 | basic_button_bonk | 6 | elite_bad_piece_delivery | hazard_bad_piece_delivery | 1–2 pieces | item_nope_stamp; item_queue_comb; quick clear | machine | clean_cut |
| mon_elite_ice_cream_imp_chillmaster | 92 | 7 | 1 | 4 | basic_chilly_scoop | 7 | elite_freeze_warning | hazard_freeze_warning + block_ice | 1–2 pieces | item_hot_cocoa; Nixie passive; fire; clean_cut | ice | fire |
| mon_elite_freezer_mimic_deluxe | 112 | 8 | 2 | 4 | basic_frost_chomp | 8 | elite_speed_wave | hazard_speed_wave | 3–6 pieces | item_speed_brake; Nixie passive; planned stacking | ice; armor | fire; bomb |
| mon_elite_blanket_ghost_duchess | 108 | 7 | 1 | 4 | basic_blanket_booh | 7 | elite_sleepy_warning | Sleepy status + soft block pressure | Yes | item_alarm_cookie; Bruk passive; clean_cut | sleepy; soft | star; clean_cut |
| mon_elite_button_knight_captain | 128 | 8 | 3 | 5 | basic_pillow_lance | 8 | elite_guarded_nap | enemy shield/status + soft block hook | Intent text required | bomb; clean_cut; cascade burst | shield; soft; armor | bomb; clean_cut |
| mon_elite_combo_gremlin_scorekeeper | 142 | 8 | 1 | 3 | basic_token_toss | 8 | elite_combo_quota | battle objective / cascade quota | Yes | cascade setup; spl_cascade_cheer; Lumi passive; Fever | combo_pressure | star; fever |
| mon_elite_prize_claw_mimic_jackpot | 154 | 8 | 2 | 3 | basic_claw_snap | 8 | elite_preview_hidden | hazard_preview_hidden | 3 pieces | item_preview_glasses; queue memory; quick clear | machine | bomb; star |
| mon_elite_square_jester_prime | 174 | 10 | 1 | 3 | basic_jester_jab | 10 | elite_royal_pattern | hazard_royal_pattern | Yes | item_royal_eraser; spl_clean_cut; spl_bomb_rune; cascades | royal | clean_cut; star |
| mon_elite_royal_block_guard_captain | 198 | 11 | 4 | 3 | basic_banner_bash | 11 | elite_low_ceiling_order | hazard_low_ceiling + block_royal | 5–8 pieces | item_tent_pole; item_safety_net; item_royal_eraser; Bruk passive | royal; armor | bomb; clean_cut |
| mon_elite_parade_golem_grand_marshal | 260 | 12 | 5 | 3 | basic_marshal_stomp | 12 | elite_grand_decree | hazard_royal_pattern + hazard_incoming_junk_queue + conditional low ceiling | Yes; never stack unsafe major hazards | cascade; item_snack_shield; item_return_stamp; item_tent_pole; item_royal_eraser | royal; armor; junk | bomb; clean_cut; star |


## Elite Asset / Reward / Status Metadata

| ID | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Reward Notes | Tags | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mon_elite_crumb_goblin_foreman | mon_elite_crumb_goblin_foreman | ico_mon_elite_crumb_goblin_foreman | public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_junk_counter_item_chance | stage_2; elite_junk_commander; hazard_incoming_junk_queue | Design-ready; runtime integration required |
| mon_elite_button_masher_supervisor | mon_elite_button_masher_supervisor | ico_mon_elite_button_masher_supervisor | public/assets/sprites/monsters/mon_elite_button_masher_supervisor/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_queue_counter_item_chance | stage_2; elite_machine_mishap; hazard_bad_piece_delivery | Design-ready; runtime integration required |
| mon_elite_ice_cream_imp_chillmaster | mon_elite_ice_cream_imp_chillmaster | ico_mon_elite_ice_cream_imp_chillmaster | public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_frost_counter_item_chance | stage_3; elite_freeze_ice; hazard_freeze_warning + block_ice | Design-ready; runtime integration required |
| mon_elite_freezer_mimic_deluxe | mon_elite_freezer_mimic_deluxe | ico_mon_elite_freezer_mimic_deluxe | public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_speed_counter_item_chance | stage_3; elite_speed_wave; hazard_speed_wave | Design-ready; runtime integration required |
| mon_elite_blanket_ghost_duchess | mon_elite_blanket_ghost_duchess | ico_mon_elite_blanket_ghost_duchess | public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_sleep_counter_item_chance | stage_4; elite_sleepy_soft; Sleepy status + soft block pressure | Partial/fallback likely until Sleepy runtime audited |
| mon_elite_button_knight_captain | mon_elite_button_knight_captain | ico_mon_elite_button_knight_captain | public/assets/sprites/monsters/mon_elite_button_knight_captain/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_shield_counter_item_chance | stage_4; elite_shield_wall; enemy shield | Partial/fallback likely until shield/soft hooks audited |
| mon_elite_combo_gremlin_scorekeeper | mon_elite_combo_gremlin_scorekeeper | ico_mon_elite_combo_gremlin_scorekeeper | public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_fever_combo_bonus | stage_5; elite_combo_quota; battle objective | Partial until quota hook verified |
| mon_elite_prize_claw_mimic_jackpot | mon_elite_prize_claw_mimic_jackpot | ico_mon_elite_prize_claw_mimic_jackpot | public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_preview_counter_item_chance | stage_5; elite_preview_disruptor; hazard_preview_hidden | Design-ready; runtime integration required |
| mon_elite_square_jester_prime | mon_elite_square_jester_prime | ico_mon_elite_square_jester_prime | public/assets/sprites/monsters/mon_elite_square_jester_prime/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_royal_counter_item_chance | stage_6; elite_royal_pattern; hazard_royal_pattern | Design-ready; runtime integration required |
| mon_elite_royal_block_guard_captain | mon_elite_royal_block_guard_captain | ico_mon_elite_royal_block_guard_captain | public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_reward_high_royal_item_chance | stage_6; elite_low_ceiling_royal; hazard_low_ceiling + block_royal | Design-ready; runtime integration required |
| mon_elite_parade_golem_grand_marshal | mon_elite_parade_golem_grand_marshal | ico_mon_elite_parade_golem_grand_marshal | public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/ | regular monster contract: idle 4, attack 6, hit 3, defeat 6, icon 1 | elite_miniboss_reward_high_but_below_boss | stage_6; elite_miniboss_royal_guard; hazard_royal_pattern + hazard_incoming_junk_queue + conditional low ceiling | Special node support may be partial |

## Elite Safety Rules

- Use warning windows before applying hazards.
- Do not stack multiple major hazards unless the runtime has explicit safe stacking.
- Do not apply freeze with no warning.
- Do not drop junk instantly with no warning.
- Do not hide Next, Hold, and Inventory at the same time.
- Do not permanently shrink the board.
- Do not break Cascade Gravity.
- Unsupported actions must log and fail safely.

---

# 7. Boss Full Metadata Catalog

Bosses are stage capstones. Every boss needs a readable rule card, clear phase changes, attack telegraphing, and comic/calm defeat presentation.

| ID | Compatibility Alias Note | Name | Rank | Stage | Stage ID | Stage Name | Role | Rarity | Spawn Node | Personality | Rule Card | Main Mechanic | HP Target | ATK Target | Armor | Attack Interval Locks | Action Set | Counterplay | Reward Notes | Sprite Key | Icon Key | Canonical Folder | Animation Contract | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| boss_cupcake_slime_king | mon_boss_cupcake_slime_king if current repo uses compatibility prefix | Cupcake Slime King | boss | 1 | stage_sprinkle_sewers | Sprinkle Sewers | boss_sticky_sprinkle | boss | boss_node | Hungry and adorable | Sticky Situation | Sticky blocks; sprinkle blocks; simple incoming junk warnings | 180 | 6 | 1 | 4 | basic_squish; sticky_frosting_splash; sprinkle_reward_bait; phase_sticky_crown | fire; clean_cut; cascades; clear sticky early | stage_1_boss_reward; unlock_pippa_if enabled | boss_cupcake_slime_king | ico_boss_cupcake_slime_king | public/assets/sprites/bosses/boss_cupcake_slime_king/ | boss contract: idle 6, attack 8, hit 4, phase_change 8, special_attack 8, defeat 10, portrait_icon 1 | Boss content exists; mechanics require runtime verification |
| boss_prototype_no_7 | mon_boss_prototype_no_7 if current repo uses compatibility prefix | Prototype No. 7 | boss | 2 | stage_goblin_workshop | Goblin Workshop | boss_junk_bomb_machine | boss | boss_node | Broken machine with confidence | Totally Safe Machine Test | Junk queue; bomb blocks; board shake; gadget hazards | 260 | 9 | 2 | 4 | basic_piston_poke; queued_junk_test; bomb_lane_test; overclock_phase | cascade junk reduction; bomb; snack_shield; return_stamp | stage_2_boss_reward; unlock_zuzu_if enabled | boss_prototype_no_7 | ico_boss_prototype_no_7 | public/assets/sprites/bosses/boss_prototype_no_7/ | boss contract: idle 6, attack 8, hit 4, phase_change 8, special_attack 8, defeat 10, portrait_icon 1 | Boss content exists; mechanics require runtime verification |
| boss_gelato_golem | mon_boss_gelato_golem if current repo uses compatibility prefix | Gelato Golem | boss | 3 | stage_frosty_pantry | Frosty Pantry | boss_ice_freeze_speed | boss | boss_node | Cool, slow, melty | Brain Freeze Warning | Ice blocks; freeze warnings; slow/fast speed waves | 340 | 11 | 3 | 4 | basic_scoop_slam; freeze_warning; ice_shelf; speed_wave_phase | hot_cocoa; speed_brake; Nixie passive; fire/cleaning tools | stage_3_boss_reward | boss_gelato_golem | ico_boss_gelato_golem | public/assets/sprites/bosses/boss_gelato_golem/ | boss contract: idle 6, attack 8, hit 4, phase_change 8, special_attack 8, defeat 10, portrait_icon 1 | Boss content exists; mechanics require runtime verification |
| boss_sir_snore_a_lot | mon_boss_sir_snore_a_lot if current repo uses compatibility prefix | Sir Snore-a-Lot | boss | 4 | stage_pillow_castle | Pillow Castle | boss_sleep_shield_soft | boss | boss_node | Sleepy pillow knight | Do Not Wake the Pillow Knight | Soft blocks; shielded enemy; Sleepy status | 430 | 13 | 4 | 4 | basic_pillow_lance; sleepy_lullaby; guarded_nap; quilt_wall_phase | alarm_cookie; Bruk passive; bomb; clean_cut; cascades | stage_4_boss_reward | boss_sir_snore_a_lot | ico_boss_sir_snore_a_lot | public/assets/sprites/bosses/boss_sir_snore_a_lot/ | boss contract: idle 6, attack 8, hit 4, phase_change 8, special_attack 8, defeat 10, portrait_icon 1 | Boss content exists; Sleepy/soft mechanics may be partial |
| boss_high_score_hydra | mon_boss_high_score_hydra if current repo uses compatibility prefix | High Score Hydra | boss | 5 | stage_starfall_arcade | Starfall Arcade | boss_combo_fever_preview | boss | boss_node | Obsessed with points | Combo or Be Chomped | Fever; cascade quota; combo challenge; preview disruption | 520 | 15 | 3 | 3 | basic_neon_bite; combo_quota; preview_blackout; fever_score_phase | cascade setup; Fever; star tools; preview_glasses; Lumi passive | stage_5_boss_reward | boss_high_score_hydra | ico_boss_high_score_hydra | public/assets/sprites/bosses/boss_high_score_hydra/ | boss contract: idle 6, attack 8, hit 4, phase_change 8, special_attack 8, defeat 10, portrait_icon 1 | Boss content exists; combo quota mechanics may be partial |
| boss_king_bloxley | mon_boss_king_bloxley if current repo uses compatibility prefix | King Bloxley | boss | 6 | stage_bloxleys_block_palace | Bloxley’s Block Palace | final_boss_royal_pattern | boss | boss_node | Bossy block mascot king | Everything Must Be Square | Royal blocks; symmetry; pattern junk; final cascade check | 680 | 18 | 5 | 3 | basic_scepter_bop; royal_pattern; low_ceiling_decree; final_square_check | royal_eraser; clean_cut; bombs; cascades; route boss modifiers | final_boss_reward; route ending resolution | boss_king_bloxley | ico_boss_king_bloxley | public/assets/sprites/bosses/boss_king_bloxley/ | boss contract: idle 6, attack 8, hit 4, phase_change 8, special_attack 8, defeat 10, portrait_icon 1 | Final boss content exists; mechanics/endings require smoke verification |

---

# 8. Effect / Hazard Hook Dictionary

Use this dictionary when deciding monster attacks. If a hook is unsupported in the current runtime, mark the monster action as **Fallback Only** or **Partial** in the implementation report rather than pretending it is fully implemented.

| Hook / Effect | Stage Fit | Used By | Warning Required? | Counterplay / Runtime Notes |
| --- | --- | --- | --- | --- |
| basic_attack | All | All monsters | No | Existing enemy damage path; HP/shield/healing counters |
| hazard_incoming_junk_queue | 2, 6 | Crumb Goblin, Wrench Goblin, Rattle Drone, Foreman, Parade Golem, Prototype No. 7 | Yes | Cascades; item_snack_shield; item_return_stamp; item_trash_lid; item_snack_vacuum |
| hazard_bad_piece_delivery | 2, 5/6 fallback | Button Masher Supervisor, Joystick Jester fallback, Square Jester fallback | Yes | item_nope_stamp; item_queue_comb; queue memory |
| hazard_freeze_warning | 3 | Ice Cream Imp, Freezer Mimic, Chillmaster, Gelato Golem | Yes | item_hot_cocoa; Nixie passive; fire/frost normalization tools |
| hazard_speed_wave | 3 | Spring Bot, Chill Slime, Pudding Penguin, Freezer Mimic Deluxe, Gelato Golem | Yes | item_speed_brake; Nixie passive; planned stacking |
| hazard_preview_hidden | 1 light, 5, 6 light | Sugar Bat, Popsicle Bat, Neon Bat, Prize Claw Mimic, Crown Bat fallback | Yes for stronger forms | item_preview_glasses; warning tray; queue memory |
| hazard_low_ceiling | 6 elite/boss | Royal Block Guard Captain, Parade Golem Grand Marshal, King Bloxley | Yes | item_tent_pole; item_safety_net; Bruk passive; clear board height before trigger |
| hazard_royal_pattern | 6 | Square Jester, Square Jester Prime, Parade Golem Grand Marshal, King Bloxley | Yes | item_royal_eraser; spl_clean_cut; spl_bomb_rune; cascades |
| block_ice insertion | 3 | Ice Cream Imp, Snowcone Sprite, Chillmaster | Prefer/Yes if targeted | fire; clean_cut; cascades; frost counter tools |
| block_sticky insertion | 1 | Sprinkle Snail, Cupcake Slime King | Prefer/Yes if targeted | fire; clean_cut; cascades |
| block_crumb_junk insertion | 1, 2, 6 | Crumb Goblin, Wrench Goblin, Rattle Drone, Foreman, Parade Golem | Prefer/Yes for larger amount | cascade; clean_cut; bomb; junk counter items |
| block_royal insertion | 6 | Royal Block Guard, Royal Block Guard Captain, King Bloxley | Yes | royal_eraser; clean_cut; bomb; cascade setup |
| enemy shield/status | 4, bosses | Button Knight, Pillow Squire, Button Knight Captain, Sir Snore-a-Lot | Intent text required | burst damage; bomb; cascade multiplier; clean_cut |
| Sleepy status | 4 | Blanket Ghost, Blanket Ghost Duchess, Sir Snore-a-Lot | Yes | item_alarm_cookie; Bruk passive/safety tools |
| combo/cascade quota | 5 | Combo Gremlin, Combo Gremlin Scorekeeper, High Score Hydra | Yes | cascade setup; Fever; star tools; spl_cascade_cheer; Lumi passive |
| gold/reward pressure | 5 | Token Sprite, Prize Claw Mimic | Intent text required | quick defeat; cascade; Fever; treasure/event reward handling |
| control disruption | 5 | Joystick Jester | Yes | safe fallback if unsupported; never make controls unreadable with stacked hazards |

---

# 9. Monster Friendship / Collection Canon

Monster friendship supports the cozy, non-grim tone and gives long-term collection goals. Friendship rewards must stay small, thematic, and non-mandatory.

| Monster ID | Name | Stage | Canonical / Proposed Friendship Reward |
| --- | --- | --- | --- |
| mon_cupcake_slime | Cupcake Slime | 1 | Start battle with 1 sprinkle block. |
| mon_sugar_bat | Sugar Bat | 1 | Next preview hide duration reduced. |
| mon_crumb_goblin | Crumb Goblin | 1 | Junk blocks have a chance to become normal blocks. |
| mon_jelly_rat | Jelly Rat | 1 | Slightly improves early speed-warning readability. |
| mon_sprinkle_snail | Sprinkle Snail | 1 | Sticky warning appears earlier. |
| mon_frosting_blob | Frosting Blob | 1 | Frosting block may convert into a mana treat. |
| mon_wrench_goblin | Wrench Goblin | 2 | Shop gadget discount or safer machine event. |
| mon_button_masher | Button Masher | 2 | Board shake reduced. |
| mon_spring_bot | Spring Bot | 2 | Small soft-drop control bonus event. |
| mon_spark_gremlin | Spark Gremlin | 2 | Gadget mishap warning appears earlier. |
| mon_gear_slime | Gear Slime | 2 | Machine junk sometimes cracks on cascade. |
| mon_rattle_drone | Rattle Drone | 2 | Preview disruption duration reduced. |
| mon_ice_cream_imp | Ice Cream Imp | 3 | Freeze effects last shorter. |
| mon_popsicle_bat | Popsicle Bat | 3 | First freeze warning gets +1 piece. |
| mon_chill_slime | Chill Slime | 3 | Ice blocks occasionally soften after cascade. |
| mon_freezer_mimic | Freezer Mimic | 3 | Freezer hazards telegraph sooner. |
| mon_snowcone_sprite | Snowcone Sprite | 3 | Grants a tiny shield after ice clear. |
| mon_pudding_penguin | Pudding Penguin | 3 | Speed waves shorten slightly. |
| mon_button_knight | Button Knight | 4 | Small shield start or shield tutorial chip. |
| mon_blanket_ghost | Blanket Ghost | 4 | Sleepy effect can heal slightly or reduce enemy action. |
| mon_plush_dragon | Plush Dragon | 4 | Soft blocks sometimes grant shield when cleared. |
| mon_toy_soldier | Toy Soldier | 4 | Pattern hint appears once per stage. |
| mon_pillow_squire | Pillow Squire | 4 | Rest node bonus. |
| mon_sock_sprite | Sock Sprite | 4 | Minor Sleepy duration reduction. |
| mon_token_sprite | Token Sprite | 5 | Small ticket/gold bonus. |
| mon_combo_gremlin | Combo Gremlin | 5 | Fever gain bonus. |
| mon_neon_bat | Neon Bat | 5 | Neon flash warning earlier. |
| mon_prize_claw_mimic | Prize Claw Mimic | 5 | Treasure node bonus. |
| mon_pixel_blob | Pixel Blob | 5 | Fever cosmetic sparkle. |
| mon_joystick_jester | Joystick Jester | 5 | Controls warning text shorter. |
| mon_royal_block_guard | Royal Block Guard | 6 | Royal block warning earlier. |
| mon_square_jester | Square Jester | 6 | Royal pattern warning appears earlier. |
| mon_crown_bat | Crown Bat | 6 | Royal preview warning reduced. |
| mon_parade_golem | Parade Golem | 6 | Final-stage item reward. |
| mon_confetti_mage | Confetti Mage | 6 | One chaos rule hint. |
| mon_banner_bug | Banner Bug | 6 | Pattern junk may crack on cascade. |

Rules:

- Friendship should never invalidate boss mechanics completely.
- Friendship rewards should be implemented as meta progress or run modifiers with safe migration.
- Elite friendship is optional and should usually improve warning clarity or reward flavor, not grant huge power.

---

# 10. Asset and Animation Requirements

Regular monsters and elite monsters use the monster animation contract:

| Asset | Exact Frames |
|---|---:|
| idle | 4 |
| attack | 6 |
| hit | 3 |
| defeat | 6 |
| icon | 1 |

Bosses use the boss animation contract:

| Asset | Exact Frames |
|---|---:|
| idle | 6 |
| attack | 8 |
| hit | 4 |
| phase_change | 8 |
| special_attack | 8 |
| defeat | 10 |
| portrait_icon | 1 |

Preferred monster paths:

```text
public/assets/sprites/monsters/{monster_id}/idle/
public/assets/sprites/monsters/{monster_id}/attack/
public/assets/sprites/monsters/{monster_id}/hit/
public/assets/sprites/monsters/{monster_id}/defeat/
public/assets/sprites/monsters/{monster_id}/sheet/{monster_id}__pose_sheet_2x2.png
```

Preferred boss paths:

```text
public/assets/sprites/bosses/{boss_id}/idle/
public/assets/sprites/bosses/{boss_id}/attack/
public/assets/sprites/bosses/{boss_id}/hit/
public/assets/sprites/bosses/{boss_id}/phase_change/
public/assets/sprites/bosses/{boss_id}/special_attack/
public/assets/sprites/bosses/{boss_id}/defeat/
public/assets/sprites/bosses/{boss_id}/sheet/{boss_id}__pose_sheet_2x2.png
```

Art direction:

- Bright polished 32-bit pixel art.
- Cute/kawaii fantasy.
- Clean dark outline.
- Strong silhouette at battle-panel size.
- Bottom-center anchor consistency.
- No text inside image.
- No watermark, blur, or soft anti-aliased mush.
- No gore, grim damage, horror, or realistic injury.
- Defeat pose means tired/calm/comic, not dead.

---

# 11. Content QA Checklist

Use this checklist when adding or changing any monster.

## Identity

- [ ] ID uses correct prefix.
- [ ] Name matches cheerful fantasy tone.
- [ ] Stage assignment is correct.
- [ ] Role is clear.
- [ ] Personality is readable.
- [ ] Description avoids dark/horror wording.

## Gameplay

- [ ] Attack effect matches stage mechanic.
- [ ] Major hazard has warning/counterplay.
- [ ] Effect maps to a known runtime hook or is marked fallback.
- [ ] Counter items/spells/passives are listed.
- [ ] Does not break Cascade Gravity.
- [ ] Does not create unavoidable loss.
- [ ] Works with reward flow.
- [ ] Save/load safe or fallback-safe.

## Asset

- [ ] Sprite key / icon key exists or fallback is accepted.
- [ ] Regular and elite monsters follow idle/attack/hit/defeat/icon contract.
- [ ] Bosses follow boss animation contract.
- [ ] Silhouette readable in portrait battle panel.
- [ ] No text inside image.
- [ ] No watermark / blur / anti-aliased mush.

## Wiki

- [ ] Entry added to this file.
- [ ] Identity, combat, asset, reward, friendship, and status metadata are filled.
- [ ] Implementation status updated after repo audit.
- [ ] Elite/boss distinctions are clear if applicable.

---

# 12. Recommended Repo Placement

Add this file as:

```text
docs/06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md
```

Then update:

```text
docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
```

Add to canonical reading order:

```text
6 | 06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md | Monster encyclopedia, full monster metadata, regular/elite/boss pages, attack/effect intent, counterplay, friendship hooks, asset metadata, reward notes, and monster implementation tracking.
```

Source precedence addition:

```text
For monster identity, monster roles, monster attack intent, elite monster distinctions, boss wiki summaries, friendship hooks, monster metadata, and monster implementation tracking, use `06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md`.
```

---

# 13. Codex Prompt to Install / Update This Wiki

```text
Read:
1. docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
2. docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
3. docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md
4. docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
5. docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md

Task:
Add or replace the canonical monster encyclopedia SOT file:
docs/06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

Use the provided full-metadata monster wiki content as the starting point.
Update docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md to include this file in the canonical reading order and source precedence rules.

Do not change gameplay code in this task.
Do not rename monster IDs.
Do not alter Cascade Gravity.
Do not add dark/horror/curse language.
Keep the document markdown-only and easy to maintain.

After adding the file, report:
- Files changed.
- Whether the index was updated.
- Current content monster IDs missing from the wiki.
- Wiki monster IDs missing from current content.
- Any implementation-status fields that need repo audit.
```

---

# 14. Open Questions / Follow-up

1. Confirm exact runtime stage IDs in content JSON.
2. Confirm whether boss IDs are `boss_*`, `mon_boss_*`, or both through aliasing.
3. Confirm which elite monster files already exist.
4. Confirm which monster effects are actually handled by `EnemySystem`, `BattleScene`, `DifficultySystem`, `BoardSystem`, and `CombatSystem`.
5. Replace “Unknown until repo audit” statuses after code audit.
6. Tune stat targets using difficulty-scaling after gameplay smoke tests.
7. Decide whether elite friendship rewards are part of Release 1 or post-release.

---

# 12. Revision 2 — Canonical Folder Structure + Artist Brief Overlay

**Updated:** 2026-05-22  
**Reason:** The project now has a separate canonical folder/path SOT plus the v7 canonical artist brief. This revision keeps the existing monster gameplay metadata, then overlays exact canonical delivery paths and artist-facing look/direction notes.

## 12.1 New Source Inputs Used

| Source | Used For |
|---|---|
| `docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` | Final authority for runtime asset root, folder tree, exact-frame file naming, legacy/fallback-only path policy, and stage folder rules. |
| `blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_CANONICAL_PATHS_FIXED_FRAME_EXPANDED.md` | Detailed artist-facing look, stage flavor, QC checks, source sizes, and row-level canonical paths. |

## 12.2 Canonical Monster Asset Contract

Rules for every monster/wiki entry:

- Content JSON must reference asset keys such as `spriteKey`, `iconKey`, `portraitKey`, or `assetRefs`, not hardcoded raw paths.
- The canonical runtime root is `public/assets/`.
- Regular and elite monster animation frames live under `public/assets/sprites/monsters/{monster_id}/{state}/`.
- Boss animation frames live under `public/assets/sprites/bosses/{boss_id}/{state}/`.
- Exact PNG frames use `{asset_id}__{animation_name}__f00.png`, `f01`, `f02`, and so on.
- Frame ranges and GIFs are not valid runtime animation contracts.
- Missing assets are fallback-safe and must not crash gameplay.
- Non-board character frames use `627x627` transparent PNG source art.
- Character pose sheets use `1254x1254` with four `627x627` cells.
- Old flat `spr_` / `ico_` checklist names are aliases or filename hints only when a canonical runtime key already exists.

### Regular / Elite Monster Required Files

| Asset Type | Exact Count | Canonical Folder | Example Filename |
|---|---:|---|---|
| idle frames | 4 | `public/assets/sprites/monsters/{monster_id}/idle/` | `{monster_id}__idle__f00.png` |
| attack frames | 6 | `public/assets/sprites/monsters/{monster_id}/attack/` | `{monster_id}__attack__f00.png` |
| hit frames | 3 | `public/assets/sprites/monsters/{monster_id}/hit/` | `{monster_id}__hit__f00.png` |
| defeat frames | 6 | `public/assets/sprites/monsters/{monster_id}/defeat/` | `{monster_id}__defeat__f00.png` |
| icon | 1 | `public/assets/sprites/monsters/{monster_id}/icon/` | `ico_{monster_id}.png` |
| 2x2 pose sheet | 1 optional/preferred sheet | `public/assets/sprites/monsters/{monster_id}/sheet/` | `{monster_id}__pose_sheet_2x2.png` |

### Boss Required Files

| Asset Type | Exact Count | Canonical Folder | Example Filename |
|---|---:|---|---|
| idle frames | 6 | `public/assets/sprites/bosses/{boss_id}/idle/` | `{boss_id}__idle__f00.png` |
| attack frames | 8 | `public/assets/sprites/bosses/{boss_id}/attack/` | `{boss_id}__attack__f00.png` |
| hit frames | 4 | `public/assets/sprites/bosses/{boss_id}/hit/` | `{boss_id}__hit__f00.png` |
| phase change frames | 8 | `public/assets/sprites/bosses/{boss_id}/phase_change/` | `{boss_id}__phase_change__f00.png` |
| special attack frames | 8 | `public/assets/sprites/bosses/{boss_id}/special_attack/` | `{boss_id}__special_attack__f00.png` |
| defeat frames | 10 | `public/assets/sprites/bosses/{boss_id}/defeat/` | `{boss_id}__defeat__f00.png` |
| portrait icon | 1 | `public/assets/sprites/bosses/{boss_id}/portrait_icon/` | `{boss_id}__portrait_icon__f00.png` |
| 2x2 pose sheet | 1 preferred sheet | `public/assets/sprites/bosses/{boss_id}/sheet/` | `{boss_id}__pose_sheet_2x2.png` |
| extended sheet | optional | `public/assets/sprites/bosses/{boss_id}/sheet/` | `{boss_id}__extended_sheet_2x2.png` |

## 12.3 Stage ID vs Asset Stage Folder

Do not rename save-facing stage IDs without migration. For assets, use the canonical stage folders below.

| Stage | Content Stage ID | Canonical Asset Stage Folder | Notes |
|---:|---|---|---|
| 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | Same as content ID. |
| 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | Same as content ID. |
| 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | Same as content ID. |
| 4 | `stage_pillow_castle` | `stage_pillow_castle` | Same as content ID. |
| 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | Same as content ID. |
| 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | Asset folder uses canonical `stage_bloxley_block_palace`; do not rename content ID without migration. |

## 12.4 Regular Monster Canonical Asset Delivery Matrix

| Monster ID | Name | Rank | Stage | Content Stage ID | Asset Stage Folder | Role | Primary Hook / Effect | Sprite Root | Idle f00 | Attack f00 | Hit f00 | Defeat f00 | Icon | Pose Sheet | Artist Brief Row Found? |
|---|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---:|
| `mon_cupcake_slime` | Cupcake Slime | regular | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | basic | block_sprinkle / mana-positive board bonus | `public/assets/sprites/monsters/mon_cupcake_slime/` | `public/assets/sprites/monsters/mon_cupcake_slime/idle/mon_cupcake_slime__idle__f00.png` | `public/assets/sprites/monsters/mon_cupcake_slime/attack/mon_cupcake_slime__attack__f00.png` | `public/assets/sprites/monsters/mon_cupcake_slime/hit/mon_cupcake_slime__hit__f00.png` | `public/assets/sprites/monsters/mon_cupcake_slime/defeat/mon_cupcake_slime__defeat__f00.png` | `public/assets/sprites/monsters/mon_cupcake_slime/icon/ico_mon_cupcake_slime.png` | `public/assets/sprites/monsters/mon_cupcake_slime/sheet/mon_cupcake_slime__pose_sheet_2x2.png` | Yes |
| `mon_sugar_bat` | Sugar Bat | regular | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | disruptor | hazard_preview_hidden / preview flicker | `public/assets/sprites/monsters/mon_sugar_bat/` | `public/assets/sprites/monsters/mon_sugar_bat/idle/mon_sugar_bat__idle__f00.png` | `public/assets/sprites/monsters/mon_sugar_bat/attack/mon_sugar_bat__attack__f00.png` | `public/assets/sprites/monsters/mon_sugar_bat/hit/mon_sugar_bat__hit__f00.png` | `public/assets/sprites/monsters/mon_sugar_bat/defeat/mon_sugar_bat__defeat__f00.png` | `public/assets/sprites/monsters/mon_sugar_bat/icon/ico_mon_sugar_bat.png` | `public/assets/sprites/monsters/mon_sugar_bat/sheet/mon_sugar_bat__pose_sheet_2x2.png` | Yes |
| `mon_crumb_goblin` | Crumb Goblin | regular | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | junk | block_crumb_junk / incoming junk light | `public/assets/sprites/monsters/mon_crumb_goblin/` | `public/assets/sprites/monsters/mon_crumb_goblin/idle/mon_crumb_goblin__idle__f00.png` | `public/assets/sprites/monsters/mon_crumb_goblin/attack/mon_crumb_goblin__attack__f00.png` | `public/assets/sprites/monsters/mon_crumb_goblin/hit/mon_crumb_goblin__hit__f00.png` | `public/assets/sprites/monsters/mon_crumb_goblin/defeat/mon_crumb_goblin__defeat__f00.png` | `public/assets/sprites/monsters/mon_crumb_goblin/icon/ico_mon_crumb_goblin.png` | `public/assets/sprites/monsters/mon_crumb_goblin/sheet/mon_crumb_goblin__pose_sheet_2x2.png` | Yes |
| `mon_jelly_rat` | Jelly Rat | regular | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | fast | basic_attack with shorter attackIntervalLocks | `public/assets/sprites/monsters/mon_jelly_rat/` | `public/assets/sprites/monsters/mon_jelly_rat/idle/mon_jelly_rat__idle__f00.png` | `public/assets/sprites/monsters/mon_jelly_rat/attack/mon_jelly_rat__attack__f00.png` | `public/assets/sprites/monsters/mon_jelly_rat/hit/mon_jelly_rat__hit__f00.png` | `public/assets/sprites/monsters/mon_jelly_rat/defeat/mon_jelly_rat__defeat__f00.png` | `public/assets/sprites/monsters/mon_jelly_rat/icon/ico_mon_jelly_rat.png` | `public/assets/sprites/monsters/mon_jelly_rat/sheet/mon_jelly_rat__pose_sheet_2x2.png` | Yes |
| `mon_sprinkle_snail` | Sprinkle Snail | regular | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | support | block_sticky insertion | `public/assets/sprites/monsters/mon_sprinkle_snail/` | `public/assets/sprites/monsters/mon_sprinkle_snail/idle/mon_sprinkle_snail__idle__f00.png` | `public/assets/sprites/monsters/mon_sprinkle_snail/attack/mon_sprinkle_snail__attack__f00.png` | `public/assets/sprites/monsters/mon_sprinkle_snail/hit/mon_sprinkle_snail__hit__f00.png` | `public/assets/sprites/monsters/mon_sprinkle_snail/defeat/mon_sprinkle_snail__defeat__f00.png` | `public/assets/sprites/monsters/mon_sprinkle_snail/icon/ico_mon_sprinkle_snail.png` | `public/assets/sprites/monsters/mon_sprinkle_snail/sheet/mon_sprinkle_snail__pose_sheet_2x2.png` | Yes |
| `mon_frosting_blob` | Frosting Blob | regular | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | tank | enemy armor / shield-style mitigation | `public/assets/sprites/monsters/mon_frosting_blob/` | `public/assets/sprites/monsters/mon_frosting_blob/idle/mon_frosting_blob__idle__f00.png` | `public/assets/sprites/monsters/mon_frosting_blob/attack/mon_frosting_blob__attack__f00.png` | `public/assets/sprites/monsters/mon_frosting_blob/hit/mon_frosting_blob__hit__f00.png` | `public/assets/sprites/monsters/mon_frosting_blob/defeat/mon_frosting_blob__defeat__f00.png` | `public/assets/sprites/monsters/mon_frosting_blob/icon/ico_mon_frosting_blob.png` | `public/assets/sprites/monsters/mon_frosting_blob/sheet/mon_frosting_blob__pose_sheet_2x2.png` | Yes |
| `mon_wrench_goblin` | Wrench Goblin | regular | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | disruptor | block_crumb_junk insertion / incoming junk light | `public/assets/sprites/monsters/mon_wrench_goblin/` | `public/assets/sprites/monsters/mon_wrench_goblin/idle/mon_wrench_goblin__idle__f00.png` | `public/assets/sprites/monsters/mon_wrench_goblin/attack/mon_wrench_goblin__attack__f00.png` | `public/assets/sprites/monsters/mon_wrench_goblin/hit/mon_wrench_goblin__hit__f00.png` | `public/assets/sprites/monsters/mon_wrench_goblin/defeat/mon_wrench_goblin__defeat__f00.png` | `public/assets/sprites/monsters/mon_wrench_goblin/icon/ico_mon_wrench_goblin.png` | `public/assets/sprites/monsters/mon_wrench_goblin/sheet/mon_wrench_goblin__pose_sheet_2x2.png` | Yes |
| `mon_button_masher` | Button Masher | regular | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | chaos | board shake warning / visual shake fallback | `public/assets/sprites/monsters/mon_button_masher/` | `public/assets/sprites/monsters/mon_button_masher/idle/mon_button_masher__idle__f00.png` | `public/assets/sprites/monsters/mon_button_masher/attack/mon_button_masher__attack__f00.png` | `public/assets/sprites/monsters/mon_button_masher/hit/mon_button_masher__hit__f00.png` | `public/assets/sprites/monsters/mon_button_masher/defeat/mon_button_masher__defeat__f00.png` | `public/assets/sprites/monsters/mon_button_masher/icon/ico_mon_button_masher.png` | `public/assets/sprites/monsters/mon_button_masher/sheet/mon_button_masher__pose_sheet_2x2.png` | Yes |
| `mon_spring_bot` | Spring Bot | regular | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | speed | hazard_speed_wave light / temporary fall-speed change | `public/assets/sprites/monsters/mon_spring_bot/` | `public/assets/sprites/monsters/mon_spring_bot/idle/mon_spring_bot__idle__f00.png` | `public/assets/sprites/monsters/mon_spring_bot/attack/mon_spring_bot__attack__f00.png` | `public/assets/sprites/monsters/mon_spring_bot/hit/mon_spring_bot__hit__f00.png` | `public/assets/sprites/monsters/mon_spring_bot/defeat/mon_spring_bot__defeat__f00.png` | `public/assets/sprites/monsters/mon_spring_bot/icon/ico_mon_spring_bot.png` | `public/assets/sprites/monsters/mon_spring_bot/sheet/mon_spring_bot__pose_sheet_2x2.png` | Yes |
| `mon_spark_gremlin` | Spark Gremlin | regular | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | caster | mana damage/reduction if supported | `public/assets/sprites/monsters/mon_spark_gremlin/` | `public/assets/sprites/monsters/mon_spark_gremlin/idle/mon_spark_gremlin__idle__f00.png` | `public/assets/sprites/monsters/mon_spark_gremlin/attack/mon_spark_gremlin__attack__f00.png` | `public/assets/sprites/monsters/mon_spark_gremlin/hit/mon_spark_gremlin__hit__f00.png` | `public/assets/sprites/monsters/mon_spark_gremlin/defeat/mon_spark_gremlin__defeat__f00.png` | `public/assets/sprites/monsters/mon_spark_gremlin/icon/ico_mon_spark_gremlin.png` | `public/assets/sprites/monsters/mon_spark_gremlin/sheet/mon_spark_gremlin__pose_sheet_2x2.png` | Yes |
| `mon_gear_slime` | Gear Slime | regular | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | tank | enemy armor / cracked junk pressure | `public/assets/sprites/monsters/mon_gear_slime/` | `public/assets/sprites/monsters/mon_gear_slime/idle/mon_gear_slime__idle__f00.png` | `public/assets/sprites/monsters/mon_gear_slime/attack/mon_gear_slime__attack__f00.png` | `public/assets/sprites/monsters/mon_gear_slime/hit/mon_gear_slime__hit__f00.png` | `public/assets/sprites/monsters/mon_gear_slime/defeat/mon_gear_slime__defeat__f00.png` | `public/assets/sprites/monsters/mon_gear_slime/icon/ico_mon_gear_slime.png` | `public/assets/sprites/monsters/mon_gear_slime/sheet/mon_gear_slime__pose_sheet_2x2.png` | Yes |
| `mon_rattle_drone` | Rattle Drone | regular | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | flying | random column junk / incoming junk light | `public/assets/sprites/monsters/mon_rattle_drone/` | `public/assets/sprites/monsters/mon_rattle_drone/idle/mon_rattle_drone__idle__f00.png` | `public/assets/sprites/monsters/mon_rattle_drone/attack/mon_rattle_drone__attack__f00.png` | `public/assets/sprites/monsters/mon_rattle_drone/hit/mon_rattle_drone__hit__f00.png` | `public/assets/sprites/monsters/mon_rattle_drone/defeat/mon_rattle_drone__defeat__f00.png` | `public/assets/sprites/monsters/mon_rattle_drone/icon/ico_mon_rattle_drone.png` | `public/assets/sprites/monsters/mon_rattle_drone/sheet/mon_rattle_drone__pose_sheet_2x2.png` | Yes |
| `mon_ice_cream_imp` | Ice Cream Imp | regular | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | freeze | hazard_freeze_warning / block_ice | `public/assets/sprites/monsters/mon_ice_cream_imp/` | `public/assets/sprites/monsters/mon_ice_cream_imp/idle/mon_ice_cream_imp__idle__f00.png` | `public/assets/sprites/monsters/mon_ice_cream_imp/attack/mon_ice_cream_imp__attack__f00.png` | `public/assets/sprites/monsters/mon_ice_cream_imp/hit/mon_ice_cream_imp__hit__f00.png` | `public/assets/sprites/monsters/mon_ice_cream_imp/defeat/mon_ice_cream_imp__defeat__f00.png` | `public/assets/sprites/monsters/mon_ice_cream_imp/icon/ico_mon_ice_cream_imp.png` | `public/assets/sprites/monsters/mon_ice_cream_imp/sheet/mon_ice_cream_imp__pose_sheet_2x2.png` | Yes |
| `mon_popsicle_bat` | Popsicle Bat | regular | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | preview/freeze | hazard_preview_hidden or freeze warning | `public/assets/sprites/monsters/mon_popsicle_bat/` | `public/assets/sprites/monsters/mon_popsicle_bat/idle/mon_popsicle_bat__idle__f00.png` | `public/assets/sprites/monsters/mon_popsicle_bat/attack/mon_popsicle_bat__attack__f00.png` | `public/assets/sprites/monsters/mon_popsicle_bat/hit/mon_popsicle_bat__hit__f00.png` | `public/assets/sprites/monsters/mon_popsicle_bat/defeat/mon_popsicle_bat__defeat__f00.png` | `public/assets/sprites/monsters/mon_popsicle_bat/icon/ico_mon_popsicle_bat.png` | `public/assets/sprites/monsters/mon_popsicle_bat/sheet/mon_popsicle_bat__pose_sheet_2x2.png` | Yes |
| `mon_chill_slime` | Chill Slime | regular | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | speed control | hazard_speed_wave | `public/assets/sprites/monsters/mon_chill_slime/` | `public/assets/sprites/monsters/mon_chill_slime/idle/mon_chill_slime__idle__f00.png` | `public/assets/sprites/monsters/mon_chill_slime/attack/mon_chill_slime__attack__f00.png` | `public/assets/sprites/monsters/mon_chill_slime/hit/mon_chill_slime__hit__f00.png` | `public/assets/sprites/monsters/mon_chill_slime/defeat/mon_chill_slime__defeat__f00.png` | `public/assets/sprites/monsters/mon_chill_slime/icon/ico_mon_chill_slime.png` | `public/assets/sprites/monsters/mon_chill_slime/sheet/mon_chill_slime__pose_sheet_2x2.png` | Yes |
| `mon_freezer_mimic` | Freezer Mimic | regular | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | freeze tank | hazard_freeze_warning | `public/assets/sprites/monsters/mon_freezer_mimic/` | `public/assets/sprites/monsters/mon_freezer_mimic/idle/mon_freezer_mimic__idle__f00.png` | `public/assets/sprites/monsters/mon_freezer_mimic/attack/mon_freezer_mimic__attack__f00.png` | `public/assets/sprites/monsters/mon_freezer_mimic/hit/mon_freezer_mimic__hit__f00.png` | `public/assets/sprites/monsters/mon_freezer_mimic/defeat/mon_freezer_mimic__defeat__f00.png` | `public/assets/sprites/monsters/mon_freezer_mimic/icon/ico_mon_freezer_mimic.png` | `public/assets/sprites/monsters/mon_freezer_mimic/sheet/mon_freezer_mimic__pose_sheet_2x2.png` | Yes |
| `mon_snowcone_sprite` | Snowcone Sprite | regular | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | ice support | block_ice insertion | `public/assets/sprites/monsters/mon_snowcone_sprite/` | `public/assets/sprites/monsters/mon_snowcone_sprite/idle/mon_snowcone_sprite__idle__f00.png` | `public/assets/sprites/monsters/mon_snowcone_sprite/attack/mon_snowcone_sprite__attack__f00.png` | `public/assets/sprites/monsters/mon_snowcone_sprite/hit/mon_snowcone_sprite__hit__f00.png` | `public/assets/sprites/monsters/mon_snowcone_sprite/defeat/mon_snowcone_sprite__defeat__f00.png` | `public/assets/sprites/monsters/mon_snowcone_sprite/icon/ico_mon_snowcone_sprite.png` | `public/assets/sprites/monsters/mon_snowcone_sprite/sheet/mon_snowcone_sprite__pose_sheet_2x2.png` | Yes |
| `mon_pudding_penguin` | Pudding Penguin | regular | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | slide/speed | speed wave / junk slide fallback | `public/assets/sprites/monsters/mon_pudding_penguin/` | `public/assets/sprites/monsters/mon_pudding_penguin/idle/mon_pudding_penguin__idle__f00.png` | `public/assets/sprites/monsters/mon_pudding_penguin/attack/mon_pudding_penguin__attack__f00.png` | `public/assets/sprites/monsters/mon_pudding_penguin/hit/mon_pudding_penguin__hit__f00.png` | `public/assets/sprites/monsters/mon_pudding_penguin/defeat/mon_pudding_penguin__defeat__f00.png` | `public/assets/sprites/monsters/mon_pudding_penguin/icon/ico_mon_pudding_penguin.png` | `public/assets/sprites/monsters/mon_pudding_penguin/sheet/mon_pudding_penguin__pose_sheet_2x2.png` | Yes |
| `mon_button_knight` | Button Knight | regular | 4 | `stage_pillow_castle` | `stage_pillow_castle` | shield | enemy shield/status | `public/assets/sprites/monsters/mon_button_knight/` | `public/assets/sprites/monsters/mon_button_knight/idle/mon_button_knight__idle__f00.png` | `public/assets/sprites/monsters/mon_button_knight/attack/mon_button_knight__attack__f00.png` | `public/assets/sprites/monsters/mon_button_knight/hit/mon_button_knight__hit__f00.png` | `public/assets/sprites/monsters/mon_button_knight/defeat/mon_button_knight__defeat__f00.png` | `public/assets/sprites/monsters/mon_button_knight/icon/ico_mon_button_knight.png` | `public/assets/sprites/monsters/mon_button_knight/sheet/mon_button_knight__pose_sheet_2x2.png` | Yes |
| `mon_blanket_ghost` | Blanket Ghost | regular | 4 | `stage_pillow_castle` | `stage_pillow_castle` | sleepy | Sleepy status | `public/assets/sprites/monsters/mon_blanket_ghost/` | `public/assets/sprites/monsters/mon_blanket_ghost/idle/mon_blanket_ghost__idle__f00.png` | `public/assets/sprites/monsters/mon_blanket_ghost/attack/mon_blanket_ghost__attack__f00.png` | `public/assets/sprites/monsters/mon_blanket_ghost/hit/mon_blanket_ghost__hit__f00.png` | `public/assets/sprites/monsters/mon_blanket_ghost/defeat/mon_blanket_ghost__defeat__f00.png` | `public/assets/sprites/monsters/mon_blanket_ghost/icon/ico_mon_blanket_ghost.png` | `public/assets/sprites/monsters/mon_blanket_ghost/sheet/mon_blanket_ghost__pose_sheet_2x2.png` | Yes |
| `mon_plush_dragon` | Plush Dragon | regular | 4 | `stage_pillow_castle` | `stage_pillow_castle` | soft/fire | soft block pressure / cute flame attack | `public/assets/sprites/monsters/mon_plush_dragon/` | `public/assets/sprites/monsters/mon_plush_dragon/idle/mon_plush_dragon__idle__f00.png` | `public/assets/sprites/monsters/mon_plush_dragon/attack/mon_plush_dragon__attack__f00.png` | `public/assets/sprites/monsters/mon_plush_dragon/hit/mon_plush_dragon__hit__f00.png` | `public/assets/sprites/monsters/mon_plush_dragon/defeat/mon_plush_dragon__defeat__f00.png` | `public/assets/sprites/monsters/mon_plush_dragon/icon/ico_mon_plush_dragon.png` | `public/assets/sprites/monsters/mon_plush_dragon/sheet/mon_plush_dragon__pose_sheet_2x2.png` | Yes |
| `mon_toy_soldier` | Toy Soldier | regular | 4 | `stage_pillow_castle` | `stage_pillow_castle` | formation | pattern/formation attack | `public/assets/sprites/monsters/mon_toy_soldier/` | `public/assets/sprites/monsters/mon_toy_soldier/idle/mon_toy_soldier__idle__f00.png` | `public/assets/sprites/monsters/mon_toy_soldier/attack/mon_toy_soldier__attack__f00.png` | `public/assets/sprites/monsters/mon_toy_soldier/hit/mon_toy_soldier__hit__f00.png` | `public/assets/sprites/monsters/mon_toy_soldier/defeat/mon_toy_soldier__defeat__f00.png` | `public/assets/sprites/monsters/mon_toy_soldier/icon/ico_mon_toy_soldier.png` | `public/assets/sprites/monsters/mon_toy_soldier/sheet/mon_toy_soldier__pose_sheet_2x2.png` | Yes |
| `mon_pillow_squire` | Pillow Squire | regular | 4 | `stage_pillow_castle` | `stage_pillow_castle` | defense | soft blocks / shield | `public/assets/sprites/monsters/mon_pillow_squire/` | `public/assets/sprites/monsters/mon_pillow_squire/idle/mon_pillow_squire__idle__f00.png` | `public/assets/sprites/monsters/mon_pillow_squire/attack/mon_pillow_squire__attack__f00.png` | `public/assets/sprites/monsters/mon_pillow_squire/hit/mon_pillow_squire__hit__f00.png` | `public/assets/sprites/monsters/mon_pillow_squire/defeat/mon_pillow_squire__defeat__f00.png` | `public/assets/sprites/monsters/mon_pillow_squire/icon/ico_mon_pillow_squire.png` | `public/assets/sprites/monsters/mon_pillow_squire/sheet/mon_pillow_squire__pose_sheet_2x2.png` | Yes |
| `mon_sock_sprite` | Sock Sprite | regular | 4 | `stage_pillow_castle` | `stage_pillow_castle` | preview trickster | next/hold preview swap if supported | `public/assets/sprites/monsters/mon_sock_sprite/` | `public/assets/sprites/monsters/mon_sock_sprite/idle/mon_sock_sprite__idle__f00.png` | `public/assets/sprites/monsters/mon_sock_sprite/attack/mon_sock_sprite__attack__f00.png` | `public/assets/sprites/monsters/mon_sock_sprite/hit/mon_sock_sprite__hit__f00.png` | `public/assets/sprites/monsters/mon_sock_sprite/defeat/mon_sock_sprite__defeat__f00.png` | `public/assets/sprites/monsters/mon_sock_sprite/icon/ico_mon_sock_sprite.png` | `public/assets/sprites/monsters/mon_sock_sprite/sheet/mon_sock_sprite__pose_sheet_2x2.png` | Yes |
| `mon_token_sprite` | Token Sprite | regular | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | economy | gold/reward pressure | `public/assets/sprites/monsters/mon_token_sprite/` | `public/assets/sprites/monsters/mon_token_sprite/idle/mon_token_sprite__idle__f00.png` | `public/assets/sprites/monsters/mon_token_sprite/attack/mon_token_sprite__attack__f00.png` | `public/assets/sprites/monsters/mon_token_sprite/hit/mon_token_sprite__hit__f00.png` | `public/assets/sprites/monsters/mon_token_sprite/defeat/mon_token_sprite__defeat__f00.png` | `public/assets/sprites/monsters/mon_token_sprite/icon/ico_mon_token_sprite.png` | `public/assets/sprites/monsters/mon_token_sprite/sheet/mon_token_sprite__pose_sheet_2x2.png` | Yes |
| `mon_combo_gremlin` | Combo Gremlin | regular | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | combo challenge | combo/cascade quota | `public/assets/sprites/monsters/mon_combo_gremlin/` | `public/assets/sprites/monsters/mon_combo_gremlin/idle/mon_combo_gremlin__idle__f00.png` | `public/assets/sprites/monsters/mon_combo_gremlin/attack/mon_combo_gremlin__attack__f00.png` | `public/assets/sprites/monsters/mon_combo_gremlin/hit/mon_combo_gremlin__hit__f00.png` | `public/assets/sprites/monsters/mon_combo_gremlin/defeat/mon_combo_gremlin__defeat__f00.png` | `public/assets/sprites/monsters/mon_combo_gremlin/icon/ico_mon_combo_gremlin.png` | `public/assets/sprites/monsters/mon_combo_gremlin/sheet/mon_combo_gremlin__pose_sheet_2x2.png` | Yes |
| `mon_neon_bat` | Neon Bat | regular | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | preview flash | hazard_preview_hidden / preview flash | `public/assets/sprites/monsters/mon_neon_bat/` | `public/assets/sprites/monsters/mon_neon_bat/idle/mon_neon_bat__idle__f00.png` | `public/assets/sprites/monsters/mon_neon_bat/attack/mon_neon_bat__attack__f00.png` | `public/assets/sprites/monsters/mon_neon_bat/hit/mon_neon_bat__hit__f00.png` | `public/assets/sprites/monsters/mon_neon_bat/defeat/mon_neon_bat__defeat__f00.png` | `public/assets/sprites/monsters/mon_neon_bat/icon/ico_mon_neon_bat.png` | `public/assets/sprites/monsters/mon_neon_bat/sheet/mon_neon_bat__pose_sheet_2x2.png` | Yes |
| `mon_prize_claw_mimic` | Prize Claw Mimic | regular | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | grabber | preview/block grab fallback | `public/assets/sprites/monsters/mon_prize_claw_mimic/` | `public/assets/sprites/monsters/mon_prize_claw_mimic/idle/mon_prize_claw_mimic__idle__f00.png` | `public/assets/sprites/monsters/mon_prize_claw_mimic/attack/mon_prize_claw_mimic__attack__f00.png` | `public/assets/sprites/monsters/mon_prize_claw_mimic/hit/mon_prize_claw_mimic__hit__f00.png` | `public/assets/sprites/monsters/mon_prize_claw_mimic/defeat/mon_prize_claw_mimic__defeat__f00.png` | `public/assets/sprites/monsters/mon_prize_claw_mimic/icon/ico_mon_prize_claw_mimic.png` | `public/assets/sprites/monsters/mon_prize_claw_mimic/sheet/mon_prize_claw_mimic__pose_sheet_2x2.png` | Yes |
| `mon_pixel_blob` | Pixel Blob | regular | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | splitter | split on hit / fallback basic attack | `public/assets/sprites/monsters/mon_pixel_blob/` | `public/assets/sprites/monsters/mon_pixel_blob/idle/mon_pixel_blob__idle__f00.png` | `public/assets/sprites/monsters/mon_pixel_blob/attack/mon_pixel_blob__attack__f00.png` | `public/assets/sprites/monsters/mon_pixel_blob/hit/mon_pixel_blob__hit__f00.png` | `public/assets/sprites/monsters/mon_pixel_blob/defeat/mon_pixel_blob__defeat__f00.png` | `public/assets/sprites/monsters/mon_pixel_blob/icon/ico_mon_pixel_blob.png` | `public/assets/sprites/monsters/mon_pixel_blob/sheet/mon_pixel_blob__pose_sheet_2x2.png` | Yes |
| `mon_joystick_jester` | Joystick Jester | regular | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | control trickster | safe control disruption warning | `public/assets/sprites/monsters/mon_joystick_jester/` | `public/assets/sprites/monsters/mon_joystick_jester/idle/mon_joystick_jester__idle__f00.png` | `public/assets/sprites/monsters/mon_joystick_jester/attack/mon_joystick_jester__attack__f00.png` | `public/assets/sprites/monsters/mon_joystick_jester/hit/mon_joystick_jester__hit__f00.png` | `public/assets/sprites/monsters/mon_joystick_jester/defeat/mon_joystick_jester__defeat__f00.png` | `public/assets/sprites/monsters/mon_joystick_jester/icon/ico_mon_joystick_jester.png` | `public/assets/sprites/monsters/mon_joystick_jester/sheet/mon_joystick_jester__pose_sheet_2x2.png` | Yes |
| `mon_royal_block_guard` | Royal Block Guard | regular | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | royal defense | block_royal insertion | `public/assets/sprites/monsters/mon_royal_block_guard/` | `public/assets/sprites/monsters/mon_royal_block_guard/idle/mon_royal_block_guard__idle__f00.png` | `public/assets/sprites/monsters/mon_royal_block_guard/attack/mon_royal_block_guard__attack__f00.png` | `public/assets/sprites/monsters/mon_royal_block_guard/hit/mon_royal_block_guard__hit__f00.png` | `public/assets/sprites/monsters/mon_royal_block_guard/defeat/mon_royal_block_guard__defeat__f00.png` | `public/assets/sprites/monsters/mon_royal_block_guard/icon/ico_mon_royal_block_guard.png` | `public/assets/sprites/monsters/mon_royal_block_guard/sheet/mon_royal_block_guard__pose_sheet_2x2.png` | Yes |
| `mon_square_jester` | Square Jester | regular | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | pattern trickster | hazard_royal_pattern / bad piece | `public/assets/sprites/monsters/mon_square_jester/` | `public/assets/sprites/monsters/mon_square_jester/idle/mon_square_jester__idle__f00.png` | `public/assets/sprites/monsters/mon_square_jester/attack/mon_square_jester__attack__f00.png` | `public/assets/sprites/monsters/mon_square_jester/hit/mon_square_jester__hit__f00.png` | `public/assets/sprites/monsters/mon_square_jester/defeat/mon_square_jester__defeat__f00.png` | `public/assets/sprites/monsters/mon_square_jester/icon/ico_mon_square_jester.png` | `public/assets/sprites/monsters/mon_square_jester/sheet/mon_square_jester__pose_sheet_2x2.png` | Yes |
| `mon_crown_bat` | Crown Bat | regular | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | royal preview | preview/inventory warning fallback | `public/assets/sprites/monsters/mon_crown_bat/` | `public/assets/sprites/monsters/mon_crown_bat/idle/mon_crown_bat__idle__f00.png` | `public/assets/sprites/monsters/mon_crown_bat/attack/mon_crown_bat__attack__f00.png` | `public/assets/sprites/monsters/mon_crown_bat/hit/mon_crown_bat__hit__f00.png` | `public/assets/sprites/monsters/mon_crown_bat/defeat/mon_crown_bat__defeat__f00.png` | `public/assets/sprites/monsters/mon_crown_bat/icon/ico_mon_crown_bat.png` | `public/assets/sprites/monsters/mon_crown_bat/sheet/mon_crown_bat__pose_sheet_2x2.png` | Yes |
| `mon_parade_golem` | Parade Golem | regular | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | junk pressure | pattern junk / incoming junk queue | `public/assets/sprites/monsters/mon_parade_golem/` | `public/assets/sprites/monsters/mon_parade_golem/idle/mon_parade_golem__idle__f00.png` | `public/assets/sprites/monsters/mon_parade_golem/attack/mon_parade_golem__attack__f00.png` | `public/assets/sprites/monsters/mon_parade_golem/hit/mon_parade_golem__hit__f00.png` | `public/assets/sprites/monsters/mon_parade_golem/defeat/mon_parade_golem__defeat__f00.png` | `public/assets/sprites/monsters/mon_parade_golem/icon/ico_mon_parade_golem.png` | `public/assets/sprites/monsters/mon_parade_golem/sheet/mon_parade_golem__pose_sheet_2x2.png` | Yes |
| `mon_confetti_mage` | Confetti Mage | regular | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | chaos caster | random colorful block / confetti pressure | `public/assets/sprites/monsters/mon_confetti_mage/` | `public/assets/sprites/monsters/mon_confetti_mage/idle/mon_confetti_mage__idle__f00.png` | `public/assets/sprites/monsters/mon_confetti_mage/attack/mon_confetti_mage__attack__f00.png` | `public/assets/sprites/monsters/mon_confetti_mage/hit/mon_confetti_mage__hit__f00.png` | `public/assets/sprites/monsters/mon_confetti_mage/defeat/mon_confetti_mage__defeat__f00.png` | `public/assets/sprites/monsters/mon_confetti_mage/icon/ico_mon_confetti_mage.png` | `public/assets/sprites/monsters/mon_confetti_mage/sheet/mon_confetti_mage__pose_sheet_2x2.png` | Yes |
| `mon_banner_bug` | Banner Bug | regular | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | buff support | enemy buff/status | `public/assets/sprites/monsters/mon_banner_bug/` | `public/assets/sprites/monsters/mon_banner_bug/idle/mon_banner_bug__idle__f00.png` | `public/assets/sprites/monsters/mon_banner_bug/attack/mon_banner_bug__attack__f00.png` | `public/assets/sprites/monsters/mon_banner_bug/hit/mon_banner_bug__hit__f00.png` | `public/assets/sprites/monsters/mon_banner_bug/defeat/mon_banner_bug__defeat__f00.png` | `public/assets/sprites/monsters/mon_banner_bug/icon/ico_mon_banner_bug.png` | `public/assets/sprites/monsters/mon_banner_bug/sheet/mon_banner_bug__pose_sheet_2x2.png` | Yes |

## 12.5 Elite Monster Canonical Asset Delivery Matrix

Elites use the same monster animation contract as regular monsters unless a future boss-sized elite SOT explicitly overrides it. The current v7 artist brief does **not** include dedicated elite rows, so these entries are canonical path targets plus gameplay metadata. Dedicated artist rows should be generated for them next.

| Monster ID | Name | Rank | Stage | Content Stage ID | Asset Stage Folder | Role | Primary Hook / Effect | Sprite Root | Idle f00 | Attack f00 | Hit f00 | Defeat f00 | Icon | Pose Sheet | Artist Brief Status |
|---|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| `mon_elite_crumb_goblin_foreman` | Crumb Goblin Foreman | elite | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | elite_junk_commander | hazard_incoming_junk_queue | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/` | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/idle/mon_elite_crumb_goblin_foreman__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/attack/mon_elite_crumb_goblin_foreman__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/hit/mon_elite_crumb_goblin_foreman__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/defeat/mon_elite_crumb_goblin_foreman__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/icon/ico_mon_elite_crumb_goblin_foreman.png` | `public/assets/sprites/monsters/mon_elite_crumb_goblin_foreman/sheet/mon_elite_crumb_goblin_foreman__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_button_masher_supervisor` | Button Masher Supervisor | elite | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | elite_machine_mishap | hazard_bad_piece_delivery | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/` | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/idle/mon_elite_button_masher_supervisor__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/attack/mon_elite_button_masher_supervisor__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/hit/mon_elite_button_masher_supervisor__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/defeat/mon_elite_button_masher_supervisor__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/icon/ico_mon_elite_button_masher_supervisor.png` | `public/assets/sprites/monsters/mon_elite_button_masher_supervisor/sheet/mon_elite_button_masher_supervisor__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_ice_cream_imp_chillmaster` | Ice Cream Imp Chillmaster | elite | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | elite_freeze_ice | hazard_freeze_warning + block_ice | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/` | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/idle/mon_elite_ice_cream_imp_chillmaster__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/attack/mon_elite_ice_cream_imp_chillmaster__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/hit/mon_elite_ice_cream_imp_chillmaster__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/defeat/mon_elite_ice_cream_imp_chillmaster__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/icon/ico_mon_elite_ice_cream_imp_chillmaster.png` | `public/assets/sprites/monsters/mon_elite_ice_cream_imp_chillmaster/sheet/mon_elite_ice_cream_imp_chillmaster__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_freezer_mimic_deluxe` | Deluxe Freezer Mimic | elite | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | elite_speed_wave | hazard_speed_wave | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/` | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/idle/mon_elite_freezer_mimic_deluxe__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/attack/mon_elite_freezer_mimic_deluxe__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/hit/mon_elite_freezer_mimic_deluxe__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/defeat/mon_elite_freezer_mimic_deluxe__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/icon/ico_mon_elite_freezer_mimic_deluxe.png` | `public/assets/sprites/monsters/mon_elite_freezer_mimic_deluxe/sheet/mon_elite_freezer_mimic_deluxe__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_blanket_ghost_duchess` | Blanket Ghost Duchess | elite | 4 | `stage_pillow_castle` | `stage_pillow_castle` | elite_sleepy_soft | Sleepy status + soft block pressure | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/` | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/idle/mon_elite_blanket_ghost_duchess__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/attack/mon_elite_blanket_ghost_duchess__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/hit/mon_elite_blanket_ghost_duchess__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/defeat/mon_elite_blanket_ghost_duchess__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/icon/ico_mon_elite_blanket_ghost_duchess.png` | `public/assets/sprites/monsters/mon_elite_blanket_ghost_duchess/sheet/mon_elite_blanket_ghost_duchess__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_button_knight_captain` | Button Knight Captain | elite | 4 | `stage_pillow_castle` | `stage_pillow_castle` | elite_shield_wall | enemy shield/status + soft block hook | `public/assets/sprites/monsters/mon_elite_button_knight_captain/` | `public/assets/sprites/monsters/mon_elite_button_knight_captain/idle/mon_elite_button_knight_captain__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_button_knight_captain/attack/mon_elite_button_knight_captain__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_button_knight_captain/hit/mon_elite_button_knight_captain__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_button_knight_captain/defeat/mon_elite_button_knight_captain__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_button_knight_captain/icon/ico_mon_elite_button_knight_captain.png` | `public/assets/sprites/monsters/mon_elite_button_knight_captain/sheet/mon_elite_button_knight_captain__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_combo_gremlin_scorekeeper` | Combo Gremlin Scorekeeper | elite | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | elite_combo_quota | battle objective / cascade quota | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/` | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/idle/mon_elite_combo_gremlin_scorekeeper__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/attack/mon_elite_combo_gremlin_scorekeeper__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/hit/mon_elite_combo_gremlin_scorekeeper__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/defeat/mon_elite_combo_gremlin_scorekeeper__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/icon/ico_mon_elite_combo_gremlin_scorekeeper.png` | `public/assets/sprites/monsters/mon_elite_combo_gremlin_scorekeeper/sheet/mon_elite_combo_gremlin_scorekeeper__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_prize_claw_mimic_jackpot` | Jackpot Prize Claw Mimic | elite | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | elite_preview_disruptor | hazard_preview_hidden | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/` | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/idle/mon_elite_prize_claw_mimic_jackpot__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/attack/mon_elite_prize_claw_mimic_jackpot__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/hit/mon_elite_prize_claw_mimic_jackpot__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/defeat/mon_elite_prize_claw_mimic_jackpot__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/icon/ico_mon_elite_prize_claw_mimic_jackpot.png` | `public/assets/sprites/monsters/mon_elite_prize_claw_mimic_jackpot/sheet/mon_elite_prize_claw_mimic_jackpot__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_square_jester_prime` | Square Jester Prime | elite | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | elite_royal_pattern | hazard_royal_pattern | `public/assets/sprites/monsters/mon_elite_square_jester_prime/` | `public/assets/sprites/monsters/mon_elite_square_jester_prime/idle/mon_elite_square_jester_prime__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_square_jester_prime/attack/mon_elite_square_jester_prime__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_square_jester_prime/hit/mon_elite_square_jester_prime__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_square_jester_prime/defeat/mon_elite_square_jester_prime__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_square_jester_prime/icon/ico_mon_elite_square_jester_prime.png` | `public/assets/sprites/monsters/mon_elite_square_jester_prime/sheet/mon_elite_square_jester_prime__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_royal_block_guard_captain` | Royal Block Guard Captain | elite | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | elite_low_ceiling_royal | hazard_low_ceiling + block_royal | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/` | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/idle/mon_elite_royal_block_guard_captain__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/attack/mon_elite_royal_block_guard_captain__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/hit/mon_elite_royal_block_guard_captain__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/defeat/mon_elite_royal_block_guard_captain__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/icon/ico_mon_elite_royal_block_guard_captain.png` | `public/assets/sprites/monsters/mon_elite_royal_block_guard_captain/sheet/mon_elite_royal_block_guard_captain__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |
| `mon_elite_parade_golem_grand_marshal` | Parade Golem Grand Marshal | elite_miniboss | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | elite_miniboss_royal_guard | hazard_royal_pattern + hazard_incoming_junk_queue | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/` | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/idle/mon_elite_parade_golem_grand_marshal__idle__f00.png` | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/attack/mon_elite_parade_golem_grand_marshal__attack__f00.png` | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/hit/mon_elite_parade_golem_grand_marshal__hit__f00.png` | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/defeat/mon_elite_parade_golem_grand_marshal__defeat__f00.png` | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/icon/ico_mon_elite_parade_golem_grand_marshal.png` | `public/assets/sprites/monsters/mon_elite_parade_golem_grand_marshal/sheet/mon_elite_parade_golem_grand_marshal__pose_sheet_2x2.png` | Needs dedicated elite artist brief row |

## 12.6 Boss Canonical Asset Delivery Matrix

| Boss ID | Name | Rank | Stage | Content Stage ID | Asset Stage Folder | Role | Primary Hook / Effect | Sprite Root | Idle f00 | Attack f00 | Hit f00 | Phase f00 | Special f00 | Defeat f00 | Portrait Icon | Pose Sheet | Boss Arena |
|---|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `boss_cupcake_slime_king` | Cupcake Slime King | boss | 1 | `stage_sprinkle_sewers` | `stage_sprinkle_sewers` | boss_sticky_sprinkle | sticky blocks; sprinkle blocks; incoming junk warnings | `public/assets/sprites/bosses/boss_cupcake_slime_king/` | `public/assets/sprites/bosses/boss_cupcake_slime_king/idle/boss_cupcake_slime_king__idle__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/attack/boss_cupcake_slime_king__attack__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/hit/boss_cupcake_slime_king__hit__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/phase_change/boss_cupcake_slime_king__phase_change__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/special_attack/boss_cupcake_slime_king__special_attack__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/defeat/boss_cupcake_slime_king__defeat__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/portrait_icon/boss_cupcake_slime_king__portrait_icon__f00.png` | `public/assets/sprites/bosses/boss_cupcake_slime_king/sheet/boss_cupcake_slime_king__pose_sheet_2x2.png` | `public/assets/stages/stage_sprinkle_sewers/boss-arena/bg_boss_cupcake_slime_king_arena.png` |
| `boss_prototype_no_7` | Prototype No. 7 | boss | 2 | `stage_goblin_workshop` | `stage_goblin_workshop` | boss_junk_bomb_machine | junk blocks; bomb blocks; machine pressure | `public/assets/sprites/bosses/boss_prototype_no_7/` | `public/assets/sprites/bosses/boss_prototype_no_7/idle/boss_prototype_no_7__idle__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/attack/boss_prototype_no_7__attack__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/hit/boss_prototype_no_7__hit__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/phase_change/boss_prototype_no_7__phase_change__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/special_attack/boss_prototype_no_7__special_attack__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/defeat/boss_prototype_no_7__defeat__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/portrait_icon/boss_prototype_no_7__portrait_icon__f00.png` | `public/assets/sprites/bosses/boss_prototype_no_7/sheet/boss_prototype_no_7__pose_sheet_2x2.png` | `public/assets/stages/stage_goblin_workshop/boss-arena/bg_boss_prototype_no_7_arena.png` |
| `boss_gelato_golem` | Gelato Golem | boss | 3 | `stage_frosty_pantry` | `stage_frosty_pantry` | boss_ice_freeze_speed | ice blocks; freeze warnings; speed waves | `public/assets/sprites/bosses/boss_gelato_golem/` | `public/assets/sprites/bosses/boss_gelato_golem/idle/boss_gelato_golem__idle__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/attack/boss_gelato_golem__attack__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/hit/boss_gelato_golem__hit__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/phase_change/boss_gelato_golem__phase_change__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/special_attack/boss_gelato_golem__special_attack__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/defeat/boss_gelato_golem__defeat__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/portrait_icon/boss_gelato_golem__portrait_icon__f00.png` | `public/assets/sprites/bosses/boss_gelato_golem/sheet/boss_gelato_golem__pose_sheet_2x2.png` | `public/assets/stages/stage_frosty_pantry/boss-arena/bg_boss_gelato_golem_arena.png` |
| `boss_sir_snore_a_lot` | Sir Snore-a-Lot | boss | 4 | `stage_pillow_castle` | `stage_pillow_castle` | boss_sleep_shield_soft | soft blocks; shield; Sleepy status | `public/assets/sprites/bosses/boss_sir_snore_a_lot/` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/idle/boss_sir_snore_a_lot__idle__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/attack/boss_sir_snore_a_lot__attack__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/hit/boss_sir_snore_a_lot__hit__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/phase_change/boss_sir_snore_a_lot__phase_change__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/special_attack/boss_sir_snore_a_lot__special_attack__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/defeat/boss_sir_snore_a_lot__defeat__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/portrait_icon/boss_sir_snore_a_lot__portrait_icon__f00.png` | `public/assets/sprites/bosses/boss_sir_snore_a_lot/sheet/boss_sir_snore_a_lot__pose_sheet_2x2.png` | `public/assets/stages/stage_pillow_castle/boss-arena/bg_boss_sir_snore_a_lot_arena.png` |
| `boss_high_score_hydra` | High Score Hydra | boss | 5 | `stage_starfall_arcade` | `stage_starfall_arcade` | boss_combo_fever_preview | Fever; cascade quota; preview disruption | `public/assets/sprites/bosses/boss_high_score_hydra/` | `public/assets/sprites/bosses/boss_high_score_hydra/idle/boss_high_score_hydra__idle__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/attack/boss_high_score_hydra__attack__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/hit/boss_high_score_hydra__hit__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/phase_change/boss_high_score_hydra__phase_change__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/special_attack/boss_high_score_hydra__special_attack__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/defeat/boss_high_score_hydra__defeat__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/portrait_icon/boss_high_score_hydra__portrait_icon__f00.png` | `public/assets/sprites/bosses/boss_high_score_hydra/sheet/boss_high_score_hydra__pose_sheet_2x2.png` | `public/assets/stages/stage_starfall_arcade/boss-arena/bg_boss_high_score_hydra_arena.png` |
| `boss_king_bloxley` | King Bloxley | boss | 6 | `stage_bloxleys_block_palace` | `stage_bloxley_block_palace` | final_boss_royal_pattern | royal blocks; symmetry; pattern junk; final cascade check | `public/assets/sprites/bosses/boss_king_bloxley/` | `public/assets/sprites/bosses/boss_king_bloxley/idle/boss_king_bloxley__idle__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/attack/boss_king_bloxley__attack__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/hit/boss_king_bloxley__hit__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/phase_change/boss_king_bloxley__phase_change__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/special_attack/boss_king_bloxley__special_attack__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/defeat/boss_king_bloxley__defeat__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/portrait_icon/boss_king_bloxley__portrait_icon__f00.png` | `public/assets/sprites/bosses/boss_king_bloxley/sheet/boss_king_bloxley__pose_sheet_2x2.png` | `public/assets/stages/stage_bloxley_block_palace/boss-arena/bg_boss_king_bloxley_arena.png` |

## 12.7 Artist Brief Detail Overlay — Regular Monsters

Use this table to brief artists and image-generation prompts. The gameplay stage assignment in this Monster Wikipedia and the Game Design SOT wins over any accidental stage-flavor mismatch in older artist rows.

| Monster ID | Name | Canonical Stage | Look from v7 Artist Brief | Direction / Original Checklist Note | Stage Note |
|---|---|---|---|---|---|
| `mon_cupcake_slime` | Cupcake Slime | 1 — Sprinkle Sewers | round jelly slime wearing whipped cream and cherry/sprinkles; cute snack thief, never scary. | slime wearing whipped cream; basic enemy that drops sprinkles. |  |
| `mon_sugar_bat` | Sugar Bat | 1 — Sprinkle Sewers | tiny hyper candy bat with sugar-rush wings and mischievous preview-blocking energy. | small candy-rushed bat; disrupts next preview. |  |
| `mon_crumb_goblin` | Crumb Goblin | 1 — Sprinkle Sewers | small giggling goblin with cookie crumbs and junk-block throwing pose. | tiny cookie crumb goblin; throws crumb junk. |  |
| `mon_jelly_rat` | Jelly Rat | 1 — Sprinkle Sewers | small wobbly candy rat with translucent jelly body and quick feet. | fast wobbly rat; quick attacks. |  |
| `mon_sprinkle_snail` | Sprinkle Snail | 1 — Sprinkle Sewers | slow snail carrying a sprinkle shell and sticky candy trail. | slow candy snail; adds sticky blocks. |  |
| `mon_frosting_blob` | Frosting Blob | 1 — Sprinkle Sewers | soft frosting blob tank with creamy swirls and harmless sleepy expression. | soft frosting tank with squishy armor. |  |
| `mon_wrench_goblin` | Wrench Goblin | 2 — Goblin Workshop | workshop goblin holding oversized wrench and junk-rigged gadgets. | goblin with oversized wrench; adds junk blocks. |  |
| `mon_button_masher` | Button Masher | 2 — Goblin Workshop | little robot pressing too many colored buttons at once. | little robot pressing every button; shakes board. |  |
| `mon_spring_bot` | Spring Bot | 2 — Goblin Workshop | toy robot with spring legs and bouncy speed-up silhouette. | spring-legged machine; speeds up next piece. |  |
| `mon_spark_gremlin` | Spark Gremlin | 2 — Goblin Workshop | tiny gremlin made of workshop sparks and zappy mana-stealing pose. | tiny electric gremlin; zaps mana. |  |
| `mon_gear_slime` | Gear Slime | 2 — Goblin Workshop | round slime with safe toy gears embedded like armor. | slime with gear shell; armored tank. |  |
| `mon_rattle_drone` | Rattle Drone | 2 — Goblin Workshop | small rattling toy drone with loose screws and propeller wobble. | shaky flying drone; drops random column junk. |  |
| `mon_ice_cream_imp` | Ice Cream Imp | 3 — Frosty Pantry | tiny imp with ice-cream cone hat and frosty mischievous grin. | mischievous frozen imp; applies freeze. |  |
| `mon_popsicle_bat` | Popsicle Bat | 3 — Frosty Pantry | bat with popsicle wings, chilled colors, hold-preview disruption cue. | cold bat on a stick; hides hold preview. | No stage flavor text in extracted v7 row; use GDD stage assignment. |
| `mon_chill_slime` | Chill Slime | 3 — Frosty Pantry | cool blue slime with frosty cheeks and speed-wave chill aura. | cold slime; slows then spikes fall speed. | No stage flavor text in extracted v7 row; use GDD stage assignment. |
| `mon_freezer_mimic` | Freezer Mimic | 3 — Frosty Pantry | cute freezer/chest mimic sneezing ice, not teeth-focused or horror. | freezer chest monster; freezes active block. |  |
| `mon_snowcone_sprite` | Snowcone Sprite | 3 — Frosty Pantry | floating snowcone fairy with syrup colors and ice crystal sparkle. | small ice sprite; creates ice blocks. |  |
| `mon_pudding_penguin` | Pudding Penguin | 3 — Frosty Pantry | round pudding-like penguin sliding on frosty floor. | cute pudding penguin; slides junk blocks. |  |
| `mon_button_knight` | Button Knight | 4 — Pillow Castle | toy knight with button shield and plush armor. | toy knight with button shield; shields self. | Check stage flavor text before artist handoff; GDD stage assignment wins. |
| `mon_blanket_ghost` | Blanket Ghost | 4 — Pillow Castle | soft blanket-shaped ghost; sleepy, cuddly, non-scary. | soft blanket ghost; applies Sleepy. |  |
| `mon_plush_dragon` | Plush Dragon | 4 — Pillow Castle | stuffed dragon breathing cotton-candy fire, button eyes. | stuffed dragon; cotton-candy flame. |  |
| `mon_toy_soldier` | Toy Soldier | 4 — Pillow Castle | wind-up toy soldier with parade stance. | wind-up soldier; formation attack. |  |
| `mon_pillow_squire` | Pillow Squire | 4 — Pillow Castle | small pillow knight with soft shield and sleepy defense pose. | small cushion squire; defensive soft blocks. |  |
| `mon_sock_sprite` | Sock Sprite | 4 — Pillow Castle | mischievous sock-like sprite swapping next/hold preview. | lost sock trickster; swaps next/hold preview. |  |
| `mon_token_sprite` | Token Sprite | 5 — Starfall Arcade | glowing arcade token fairy with coin sparkle. | living arcade token; steals or gives gold. |  |
| `mon_combo_gremlin` | Combo Gremlin | 5 — Starfall Arcade | neon gremlin obsessed with score/combo callouts. | gremlin obsessed with combos; punishes no cascade. |  |
| `mon_neon_bat` | Neon Bat | 5 — Starfall Arcade | bright arcade bat with flashing wing edges. | glowing bat; flashes preview. |  |
| `mon_prize_claw_mimic` | Prize Claw Mimic | 5 — Starfall Arcade | cute prize machine/claw creature grabbing blocks. | claw machine mimic; grabs random block. |  |
| `mon_pixel_blob` | Pixel Blob | 5 — Starfall Arcade | small blob made of chunky pixels, splits on hit. | arcade blob; splits on hit. |  |
| `mon_joystick_jester` | Joystick Jester | 5 — Starfall Arcade | silly jester with joystick cap and reverse-control gag. | joystick trickster; reverses controls briefly. |  |
| `mon_royal_block_guard` | Royal Block Guard | 6 — Bloxley’s Block Palace | square palace guard made of royal toy blocks. | armored block guard; creates pattern blocks. |  |
| `mon_square_jester` | Square Jester | 6 — Bloxley’s Block Palace | blocky jester creating awkward shapes, comic not sinister. | awkward-shape jester; creates annoying shapes. |  |
| `mon_crown_bat` | Crown Bat | 6 — Bloxley’s Block Palace | small bat wearing oversized toy crown. | royal bat; hides inventory briefly. |  |
| `mon_parade_golem` | Parade Golem | 6 — Bloxley’s Block Palace | confetti parade golem with marching toy blocks. | marching toy golem; pushes junk upward. | Check stage flavor text before artist handoff; GDD stage assignment wins. |
| `mon_confetti_mage` | Confetti Mage | 6 — Bloxley’s Block Palace | party mage throwing colorful blocks and streamers. | party mage; creates random colorful blocks. |  |
| `mon_banner_bug` | Banner Bug | 6 — Bloxley’s Block Palace | tiny banner-carrying bug buffing enemies. | tiny banner bug; buffs enemy attack. |  |

## 12.8 Missing / Follow-up Artist Rows

These monsters are now canonical gameplay/content entries, but the uploaded v7 artist brief did not include dedicated row-level art details for them:

| Monster ID | Needed Row Type | Suggested Action |
|---|---|---|
| `mon_elite_crumb_goblin_foreman` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 2 — Goblin Workshop, role `elite_junk_commander`, and hook `hazard_incoming_junk_queue`. |
| `mon_elite_button_masher_supervisor` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 2 — Goblin Workshop, role `elite_machine_mishap`, and hook `hazard_bad_piece_delivery`. |
| `mon_elite_ice_cream_imp_chillmaster` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 3 — Frosty Pantry, role `elite_freeze_ice`, and hook `hazard_freeze_warning + block_ice`. |
| `mon_elite_freezer_mimic_deluxe` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 3 — Frosty Pantry, role `elite_speed_wave`, and hook `hazard_speed_wave`. |
| `mon_elite_blanket_ghost_duchess` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 4 — Pillow Castle, role `elite_sleepy_soft`, and hook `Sleepy status + soft block pressure`. |
| `mon_elite_button_knight_captain` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 4 — Pillow Castle, role `elite_shield_wall`, and hook `enemy shield/status + soft block hook`. |
| `mon_elite_combo_gremlin_scorekeeper` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 5 — Starfall Arcade, role `elite_combo_quota`, and hook `battle objective / cascade quota`. |
| `mon_elite_prize_claw_mimic_jackpot` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 5 — Starfall Arcade, role `elite_preview_disruptor`, and hook `hazard_preview_hidden`. |
| `mon_elite_square_jester_prime` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 6 — Bloxley’s Block Palace, role `elite_royal_pattern`, and hook `hazard_royal_pattern`. |
| `mon_elite_royal_block_guard_captain` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 6 — Bloxley’s Block Palace, role `elite_low_ceiling_royal`, and hook `hazard_low_ceiling + block_royal`. |
| `mon_elite_parade_golem_grand_marshal` | elite monster idle/attack/hit/defeat/icon/sheet | Add v7-style artist rows using Stage 6 — Bloxley’s Block Palace, role `elite_miniboss_royal_guard`, and hook `hazard_royal_pattern + hazard_incoming_junk_queue`. |


## 12.9 Codex Update Instruction for Repo Docs

Use this prompt when installing this revision into the repo:

```text
Read docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md first.
Then read docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md and docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md.
Update docs/06_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md so every regular monster, elite monster, elite mini-boss, and boss has canonical asset metadata:
- spriteKey and iconKey
- canonical sprite root folder
- idle/attack/hit/defeat frame folders
- boss phase_change/special_attack/portrait_icon folders when applicable
- icon folder
- pose sheet path
- exact f00 filename example
- source size contract
- artist brief look/direction notes when available
- implementation/art status: Found, Missing Artist Row, Placeholder/Fallback, or Needs Runtime Audit
Do not rename save-facing IDs.
Do not hardcode raw public/assets paths into content JSON.
Keep content IDs and asset keys stable.
Use canonical folders as primary paths and legacy folders as fallback-only.
```
