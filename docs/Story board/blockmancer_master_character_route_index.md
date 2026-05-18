# Blockmancer Dungeon — Master Character Route Index
## Six-Hero Variable Choice Route Implementation Guide

> Purpose: combine the six individual hero route drafts into one implementation-ready route index. This file does **not** replace the full per-character scripts. It defines the shared structure, route variables, choice-label matrices, ending rules, content split, and implementation sequence for the narrative system.

---

# 1. Route System Goal

Blockmancer Dungeon should support character-specific story routes where each playable hero experiences the same six-stage Brixonia adventure through a different emotional lens, voice pattern, and choice language.

The route system should avoid one generic dialogue template. Each character must have:

- A distinct speaking rhythm and vocabulary.
- Stage-specific story build-up.
- Unique choice labels for every stage.
- Practical / True / Risky choice lanes that use that character's personality.
- Route stats and route flags saved in meta/current run data.
- Normal Ending, True Ending, and optional celebratory variant layer.
- Boss callbacks that reflect earlier choices.
- Short battle barks that sound recognizable without the name tag.

Core route pattern:

```text
Stage route scene appears -> player chooses Practical, True, or Risky option -> route stat/flag updates -> gameplay modifier applies -> boss callback checks route state -> final ending resolves after King Bloxley
```

---

# 2. Canonical Stage Spine

Every hero uses the same world and stage order, but the route scene must reveal a different personal concern.

| Stage | Location | Main Hazard Language | Boss | Route Design Purpose |
| ---: | --- | --- | --- | --- |
| 1 | Sprinkle Sewers | sticky blocks, sprinkle blocks, cupcake slime, simple incoming junk warnings | Cupcake Slime King | Introduce the hero's first route value in a low-pressure scene. |
| 2 | Goblin Workshop | junk blocks, bomb blocks, board shake, gadget hazards | Prototype No. 7 | Test the hero's value against machine chaos and junk pressure. |
| 3 | Frosty Pantry | ice blocks, freeze warnings, slow-to-fast fall speed waves | Gelato Golem | Slow the hero down and reveal a hidden emotional clue. |
| 4 | Pillow Castle | soft blocks, shield enemies, Sleepy status | Sir Snore-a-Lot | Use the soft/sleepy stage to test gentleness, restraint, or care. |
| 5 | Starfall Arcade | Fever meter, cascade bonus, combo challenge, preview pressure | High Score Hydra | Turn route values into a public festival challenge. |
| 6 | Bloxley's Block Palace | royal blocks, symmetry checks, pattern junk, final cascade pressure | King Bloxley | Resolve the hero's route against Bloxley's lonely order. |

---

# 3. Character Voice Matrix

Use this section as the first QA gate. If a line can be swapped between two characters without changing words, rewrite it.

| Hero | Route Arc | Speech Pattern | Must Avoid | Sample Line |
| --- | --- | --- | --- | --- |
| **Milo** | From gentle cleanup to truly hearing the dungeon's frightened block-language. | Soft, observant, careful. Uses plink-plonk, rhythm, quiet, space, left/right, conversation, and listening imagery. | Do not make him sarcastic, loud, technical, or heroic in a boastful way. | "The board is not angry. It is overcrowded." |
| **Pippa** | From angry protective fire to hearth-warmth that feeds and protects the festival. | Brisk, practical, warm beneath the heat. Uses oven, tray, batch, frosting, crumbs, hearth, serve, share, preheat language. | Do not make her generic angry. Her temper should sound like kitchen urgency and protective care. | "Heat is not the problem. Bad timing is." |
| **Zuzu** | From field-test chaos to accountable invention and public repair ethics. | Fast, technical, confident, funny through precision. Uses clamps, calibration, prototype, ledger, patch, override, warranty, safety margin. | Do not make her only random. She should be brilliant, evasive, and increasingly honest. | "Exploding is not failure. It is a loud data point. But yes, we should label it better." |
| **Nixie** | From freezing problems in place to preserving what matters while allowing gentle thaw. | Calm, patient, elegant. Uses chill, thaw, settle, flavor, syrup, frost, cart, preserve, breathe, and slow timing. | Do not make her cold or detached. She is composed, not emotionless. | "Let it soften slowly. Even a frozen thing remembers warmth." |
| **Bruk** | From guarding the snack table to understanding hospitality as protection shared with everyone. | Honorable, sturdy, sincere. Uses oath, table, ration, shield, plate, provision, guest, crumb, banquet, service. | Do not make him only food jokes. His snack language is knightly devotion and care. | "A guarded table feeds one corner. A shared table holds the whole hall together." |
| **Lumi** | From following pretty lights to becoming a keeper of wishes and guidance. | Dreamy, poetic, sincere. Uses lanterns, wishes, constellations, shimmer, paper stars, moonlight, crownlight, carry the light. | Do not make her vague all the time. Her wonder should reveal hidden meaning. | "That little block is not shining for attention. It is shining because it was nearly forgotten." |

---

# 4. Route Variables Overview

Each hero gets three route scores:

1. **Practical / Normal score** — stable, safe, practical route progression.
2. **True / Insight score** — empathy, accountability, care, understanding, or wishkeeping route progression.
3. **Risky / Festival score** — high-risk, stylish, celebratory route actions that add rewards, harder hazards, or ending flavor.

| Hero | Practical Score | True Score | Risky Score | True Ending Key | Variant Layer |
| --- | --- | --- | --- | --- | --- |
| Milo | `miloAffinity` | `miloInsight` | `miloFestivalGrace` | `miloInsight >= 5` and at least 5 true flags | Festival Grace Variant if `miloFestivalGrace` threshold met |
| Pippa | `pippaResolve` | `pippaHearth` | `pippaFlambe` | `pippaHearth >= 5` and at least 5 true flags | Festival Flambé Variant if `pippaFlambe` threshold met |
| Zuzu | `zuzuPatchwork` | `zuzuAccountability` | `zuzuOverclock` | `zuzuAccountability >= 5` and at least 5 true flags | Festival Overclock Variant if `zuzuOverclock` threshold met |
| Nixie | `nixieComposure` | `nixieTenderness` | `nixieAurora` | `nixieTenderness >= 5` and at least 5 true flags | Aurora Variant if `nixieAurora` threshold met |
| Bruk | `brukDuty` | `brukHospitality` | `brukGrandCharge` | `brukHospitality >= 5` and at least 5 true flags | Festival Banquet Parade Variant if `brukGrandCharge` threshold met |
| Lumi | `lumiGuidance` | `lumiWishkeeper` | `lumiStargamble` | `lumiWishkeeper >= 5` and at least 5 true flags | Meteor Parade Variant if `lumiStargamble` threshold met |

Recommended thresholds:

```ts
const TRUE_ENDING_MIN_FLAGS = 5;
const TRUE_ENDING_MIN_SCORE = 5;
const VARIANT_MIN_RISK_SCORE = 3;
```

---

# 5. Master Choice Label Matrix

The choice labels below are the quick implementation reference. Full dialogue, narration, rewards, and barks stay in the individual route files.

## 5.1. Milo Choice Labels

Route arc: **From gentle cleanup to truly hearing the dungeon's frightened block-language.**

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | `Sweep a Sprinkle Corner` | `Hear the First Tremble` | `Follow the Sugarbeat` |
| 2 — Goblin Workshop | `Sort the Noisy Gears` | `Name the Counterbeat` | `Ride the Conveyor Song` |
| 3 — Frosty Pantry | `Clear a Warm Pocket` | `Wait for the Ice to Answer` | `Drop on the Second Chime` |
| 4 — Pillow Castle | `Tuck the Board In` | `Learn the Nap-Song` | `Tiptoe Through the Cascade` |
| 5 — Starfall Arcade | `Dim the Score Lights` | `Hear Between Chimes` | `Play the Shimmer Pattern` |
| 6 — Bloxley's Block Palace | `Loosen the Royal Corners` | `Ask the Palace Why` | `Dance the Crooked Square` |

## 5.2. Pippa Choice Labels

Route arc: **From angry protective fire to hearth-warmth that feeds and protects the festival.**

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | `Scrape the Frosting Valve` | `Split the Emergency Batch` | `Caramelize the Spillway` |
| 2 — Goblin Workshop | `Douse the Overheat Tray` | `Teach the Oven to Rest` | `Flash-Bake the Gear Jam` |
| 3 — Frosty Pantry | `Clear the Freezer Vents` | `Thaw by the Crumb` | `Crack the Sugar Ice` |
| 4 — Pillow Castle | `Toast the Guard Crumbs` | `Bake Midnight Rolls` | `Torch the Blanket Tangle` |
| 5 — Starfall Arcade | `Win the Cake Fairly` | `Open the Shared Plate` | `Flambé the Scoreboard` |
| 6 — Bloxley's Block Palace | `Loosen the Royal Frosting` | `Bake the Crooked Center` | `Crown the Cake in Fire` |

## 5.3. Zuzu Choice Labels

Route arc: **From field-test chaos to accountable invention and public repair ethics.**

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | `Tighten the Sprinkle Valve` | `Log the Pressure Fault` | `Overclock the Candy Pump` |
| 2 — Goblin Workshop | `Clamp the Rattle Belt` | `Open the Intern Ledger` | `Boot Prototype No. 7½` |
| 3 — Frosty Pantry | `Rewire the Thaw Relay` | `Write the Thaw Protocol` | `Reverse Snowcone Polarity` |
| 4 — Pillow Castle | `Muffle the Gearbox` | `Issue a Quiet Warranty` | `Launch the Pillow Spring` |
| 5 — Starfall Arcade | `Cap the Prize Multiplier` | `Share the Score Formula` | `Run the Jackpot Spiral` |
| 6 — Bloxley's Block Palace | `Unscrew the Royal Brackets` | `Invalidate the Clamp Patent` | `Detonate Corner Theory` |

## 5.4. Nixie Choice Labels

Route arc: **From freezing problems in place to preserving what matters while allowing gentle thaw.**

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | `Cool the Frosting Flow` | `Taste the Rainbow Melt` | `Freeze the Sprinkle Tide` |
| 2 — Goblin Workshop | `Lower the Boiler Heat` | `Cool the Machine Without Stopping It` | `Skate the Conveyor Loop` |
| 3 — Frosty Pantry | `Stabilize the Gelato Shelves` | `Name Every Lost Flavor` | `Crack the Crystal Scoops` |
| 4 — Pillow Castle | `Quiet the Blanket Draft` | `Hear the Sleeping Room` | `Slide Through the Sock-Ice` |
| 5 — Starfall Arcade | `Dim the Neon Frost` | `Share the Slow Score` | `Spin the Prize Chill` |
| 6 — Bloxley's Block Palace | `Soften the Royal Edges` | `Thaw the Hidden Corner` | `Crown the Crooked Snow` |

## 5.5. Bruk Choice Labels

Route arc: **From guarding the snack table to understanding hospitality as protection shared with everyone.**

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | `Raise the Crumb Shield` | `Serve the Smallest Plate` | `Charge the Frosting Line` |
| 2 — Goblin Workshop | `Barricade the Lunch Belt` | `Feed the Tired Testers` | `Ram the Gear Buffet` |
| 3 — Frosty Pantry | `Stack the Ration Crates` | `Share the Warm Thermos` | `Shoulder the Ice Door` |
| 4 — Pillow Castle | `Hold the Blanket Line` | `Honor the Nap Table` | `Trumpet the Midnight Feast` |
| 5 — Starfall Arcade | `Guard the Prize Counter` | `Split the Winning Tickets` | `Win the Snack Jackpot` |
| 6 — Bloxley's Block Palace | `Brace the Banquet Gate` | `Set a Place for the King` | `Declare the Grand Snack Charge` |

## 5.6. Lumi Choice Labels

Route arc: **From following pretty lights to becoming a keeper of wishes and guidance.**

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | `Pin the Little Star` | `Name the Sprinkle Wish` | `Trace the Sugar Comet` |
| 2 — Goblin Workshop | `Shade the Spark Gear` | `Read the Machine Constellation` | `Launch the Bolt Meteor` |
| 3 — Frosty Pantry | `Warm the Star Ribbon` | `Save the Melting Wish` | `Skate the Moonlit Shelf` |
| 4 — Pillow Castle | `Dim the Dream Lantern` | `Light the Sleeping Window` | `Toss the Pillow Moon` |
| 5 — Starfall Arcade | `Count the Honest Lights` | `Share the Wishlight` | `Spin the Meteor Jackpot` |
| 6 — Bloxley's Block Palace | `Mark the Crooked Crown` | `Carry the Crownlight` | `Bend the Royal Constellation` |

---

# 6. Stage-by-Stage Story Build-Up Index

This table explains what each hero route is *about* at each stage. It prevents every character from reacting to the same hazard in the same way.

## Stage 1 — Sprinkle Sewers

**Shared stage pressure:** sticky blocks, sprinkle blocks, cupcake slime, simple incoming junk warnings  
**Boss:** Cupcake Slime King

| Hero | Route Scene Focus | Practical Choice | True Choice | Risky Choice |
| --- | --- | --- | --- | --- |
| Milo | The first frightened block voice hides beneath the Sprinkle Sewers. | `Sweep a Sprinkle Corner` | `Hear the First Tremble` | `Follow the Sugarbeat` |
| Pippa | The Cupcake Slime batch is hungry, sticky, and wrongly blamed. | `Scrape the Frosting Valve` | `Split the Emergency Batch` | `Caramelize the Spillway` |
| Zuzu | An old quick patch worsens the sewers' candy pressure loop. | `Tighten the Sprinkle Valve` | `Log the Pressure Fault` | `Overclock the Candy Pump` |
| Nixie | Warm syrup hides inside the chilled frosting flow. | `Cool the Frosting Flow` | `Taste the Rainbow Melt` | `Freeze the Sprinkle Tide` |
| Bruk | The smallest slimes are not invaders; they are guests without plates. | `Raise the Crumb Shield` | `Serve the Smallest Plate` | `Charge the Frosting Line` |
| Lumi | A sprinkle star carries a small wish no one has named yet. | `Pin the Little Star` | `Name the Sprinkle Wish` | `Trace the Sugar Comet` |

## Stage 2 — Goblin Workshop

**Shared stage pressure:** junk blocks, bomb blocks, board shake, gadget hazards  
**Boss:** Prototype No. 7

| Hero | Route Scene Focus | Practical Choice | True Choice | Risky Choice |
| --- | --- | --- | --- | --- |
| Milo | Goblin machines produce pieces that argue in different rhythms. | `Sort the Noisy Gears` | `Name the Counterbeat` | `Ride the Conveyor Song` |
| Pippa | A goblin oven overheats because no one taught it when to rest. | `Douse the Overheat Tray` | `Teach the Oven to Rest` | `Flash-Bake the Gear Jam` |
| Zuzu | Prototype No. 7 exposes an override Zuzu hoped nobody would audit. | `Clamp the Rattle Belt` | `Open the Intern Ledger` | `Boot Prototype No. 7½` |
| Nixie | The workshop machine needs cooling without being forced silent. | `Lower the Boiler Heat` | `Cool the Machine Without Stopping It` | `Skate the Conveyor Loop` |
| Bruk | Hungry goblin testers keep breaking machines because no one feeds the shift. | `Barricade the Lunch Belt` | `Feed the Tired Testers` | `Ram the Gear Buffet` |
| Lumi | The workshop gears form a machine constellation with one lonely light missing. | `Shade the Spark Gear` | `Read the Machine Constellation` | `Launch the Bolt Meteor` |

## Stage 3 — Frosty Pantry

**Shared stage pressure:** ice blocks, freeze warnings, slow-to-fast fall speed waves  
**Boss:** Gelato Golem

| Hero | Route Scene Focus | Practical Choice | True Choice | Risky Choice |
| --- | --- | --- | --- | --- |
| Milo | Frozen runes speak slowly and teach Milo not to interrupt silence. | `Clear a Warm Pocket` | `Wait for the Ice to Answer` | `Drop on the Second Chime` |
| Pippa | Frozen share-crates must be warmed without spoiling the festival food. | `Clear the Freezer Vents` | `Thaw by the Crumb` | `Crack the Sugar Ice` |
| Zuzu | The pantry needs a thaw protocol, not a dramatic polarity reversal. | `Rewire the Thaw Relay` | `Write the Thaw Protocol` | `Reverse Snowcone Polarity` |
| Nixie | Lost flavors in the pantry ask to be named before they melt away. | `Stabilize the Gelato Shelves` | `Name Every Lost Flavor` | `Crack the Crystal Scoops` |
| Bruk | Warm rations can save more crates than a shield wall alone. | `Stack the Ration Crates` | `Share the Warm Thermos` | `Shoulder the Ice Door` |
| Lumi | A melting star ribbon must be carried before its wish fades. | `Warm the Star Ribbon` | `Save the Melting Wish` | `Skate the Moonlit Shelf` |

## Stage 4 — Pillow Castle

**Shared stage pressure:** soft blocks, shield enemies, Sleepy status  
**Boss:** Sir Snore-a-Lot

| Hero | Route Scene Focus | Practical Choice | True Choice | Risky Choice |
| --- | --- | --- | --- | --- |
| Milo | The Pillow Castle reveals that even rooms need rest, not only repair. | `Tuck the Board In` | `Learn the Nap-Song` | `Tiptoe Through the Cascade` |
| Pippa | Sleepy guards need midnight rolls more than another alarm. | `Toast the Guard Crumbs` | `Bake Midnight Rolls` | `Torch the Blanket Tangle` |
| Zuzu | A pillow alarm can be repaired only if Zuzu stops treating residents as test subjects. | `Muffle the Gearbox` | `Issue a Quiet Warranty` | `Launch the Pillow Spring` |
| Nixie | The sleeping room teaches Nixie that quiet is a living thing. | `Quiet the Blanket Draft` | `Hear the Sleeping Room` | `Slide Through the Sock-Ice` |
| Bruk | The Pillow Castle has a sacred nap table that deserves respect. | `Hold the Blanket Line` | `Honor the Nap Table` | `Trumpet the Midnight Feast` |
| Lumi | A sleeping window asks Lumi to light it gently, not brightly. | `Dim the Dream Lantern` | `Light the Sleeping Window` | `Toss the Pillow Moon` |

## Stage 5 — Starfall Arcade

**Shared stage pressure:** Fever meter, cascade bonus, combo challenge, preview pressure  
**Boss:** High Score Hydra

| Hero | Route Scene Focus | Practical Choice | True Choice | Risky Choice |
| --- | --- | --- | --- | --- |
| Milo | Arcade chimes nearly drown out a small, true rhythm. | `Dim the Score Lights` | `Hear Between Chimes` | `Play the Shimmer Pattern` |
| Pippa | The arcade prize cake tempts Pippa to win loudly or share fairly. | `Win the Cake Fairly` | `Open the Shared Plate` | `Flambé the Scoreboard` |
| Zuzu | The arcade score formula must become fair instead of profitable and mysterious. | `Cap the Prize Multiplier` | `Share the Score Formula` | `Run the Jackpot Spiral` |
| Nixie | The arcade score can slow down enough for everyone to understand it. | `Dim the Neon Frost` | `Share the Slow Score` | `Spin the Prize Chill` |
| Bruk | Winning tickets matter less than splitting the prize table honestly. | `Guard the Prize Counter` | `Split the Winning Tickets` | `Win the Snack Jackpot` |
| Lumi | The arcade's wishlight must be shared, not hoarded as a score. | `Count the Honest Lights` | `Share the Wishlight` | `Spin the Meteor Jackpot` |

## Stage 6 — Bloxley's Block Palace

**Shared stage pressure:** royal blocks, symmetry checks, pattern junk, final cascade pressure  
**Boss:** King Bloxley

| Hero | Route Scene Focus | Practical Choice | True Choice | Risky Choice |
| --- | --- | --- | --- | --- |
| Milo | Bloxley's palace asks whether order is a crown or a shelter. | `Loosen the Royal Corners` | `Ask the Palace Why` | `Dance the Crooked Square` |
| Pippa | Bloxley demands a square cake, but Pippa can bake structure with a soft center. | `Loosen the Royal Frosting` | `Bake the Crooked Center` | `Crown the Cake in Fire` |
| Zuzu | Bloxley's royal clamps reveal the cost of clever designs without safety notes. | `Unscrew the Royal Brackets` | `Invalidate the Clamp Patent` | `Detonate Corner Theory` |
| Nixie | Bloxley's hidden corner must thaw before the palace can soften. | `Soften the Royal Edges` | `Thaw the Hidden Corner` | `Crown the Crooked Snow` |
| Bruk | Bloxley can be charged, but the truer victory is setting him a place at the table. | `Brace the Banquet Gate` | `Set a Place for the King` | `Declare the Grand Snack Charge` |
| Lumi | Bloxley's crownlight is crooked because it has been carried alone. | `Mark the Crooked Crown` | `Carry the Crownlight` | `Bend the Royal Constellation` |

---

# 7. True Route Flag Registry

True route flags are granted by the stage-specific True / Insight choice. Store these on the current run and copy them into meta progress when the run ends.

## Milo True Flags

| Stage | Flag |
| ---: | --- |
| 1 — Sprinkle Sewers | `milo_flag_heard_first_tremble` |
| 2 — Goblin Workshop | `milo_flag_named_machine_counterbeat` |
| 3 — Frosty Pantry | `milo_flag_waited_for_slow_runes` |
| 4 — Pillow Castle | `milo_flag_learned_nap_song` |
| 5 — Starfall Arcade | `milo_flag_heard_between_chimes` |
| 6 — Bloxley's Block Palace | `milo_flag_asked_palace_why` |

## Pippa True Flags

| Stage | Flag |
| ---: | --- |
| 1 — Sprinkle Sewers | `pippa_flag_spared_cupcake_slime_batch` |
| 2 — Goblin Workshop | `pippa_flag_relit_responsible_oven` |
| 3 — Frosty Pantry | `pippa_flag_warmed_frozen_share_crates` |
| 4 — Pillow Castle | `pippa_flag_baked_midnight_rolls` |
| 5 — Starfall Arcade | `pippa_flag_shared_prize_cakes` |
| 6 — Bloxley's Block Palace | `pippa_flag_baked_square_cake_soft_center` |

## Zuzu True Flags

| Stage | Flag |
| ---: | --- |
| 1 — Sprinkle Sewers | `zuzu_flag_logged_sprinkle_pressure_fault` |
| 2 — Goblin Workshop | `zuzu_flag_admitted_prototype_override` |
| 3 — Frosty Pantry | `zuzu_flag_wrote_thaw_protocol` |
| 4 — Pillow Castle | `zuzu_flag_quieted_alarm_with_consent` |
| 5 — Starfall Arcade | `zuzu_flag_open_sourced_score_formula` |
| 6 — Bloxley's Block Palace | `zuzu_flag_invalidated_royal_clamp_design` |

## Nixie True Flags

| Stage | Flag |
| ---: | --- |
| 1 — Sprinkle Sewers | `nixie_flag_sensed_warm_syrup` |
| 2 — Goblin Workshop | `nixie_flag_cooled_machine_without_stopping_it` |
| 3 — Frosty Pantry | `nixie_flag_named_the_lost_flavors` |
| 4 — Pillow Castle | `nixie_flag_heard_the_sleeping_room` |
| 5 — Starfall Arcade | `nixie_flag_shared_the_slow_score` |
| 6 — Bloxley's Block Palace | `nixie_flag_thawed_the_hidden_corner` |

## Bruk True Flags

| Stage | Flag |
| ---: | --- |
| 1 — Sprinkle Sewers | `bruk_flag_served_sugar_rushed_slimes` |
| 2 — Goblin Workshop | `bruk_flag_fed_goblin_testers` |
| 3 — Frosty Pantry | `bruk_flag_shared_warm_rations` |
| 4 — Pillow Castle | `bruk_flag_respected_pillow_oath` |
| 5 — Starfall Arcade | `bruk_flag_shared_arcade_winnings` |
| 6 — Bloxley's Block Palace | `bruk_flag_invited_bloxley_to_table` |

## Lumi True Flags

| Stage | Flag |
| ---: | --- |
| 1 — Sprinkle Sewers | `lumi_flag_named_sprinkle_wish` |
| 2 — Goblin Workshop | `lumi_flag_read_machine_constellation` |
| 3 — Frosty Pantry | `lumi_flag_saved_melting_star_ribbon` |
| 4 — Pillow Castle | `lumi_flag_lit_the_sleeping_window` |
| 5 — Starfall Arcade | `lumi_flag_shared_arcade_wishlight` |
| 6 — Bloxley's Block Palace | `lumi_flag_carried_bloxley_crownlight` |

---

# 8. Ending Resolution Rules

## 8.1 Normal Ending

A hero Normal Ending should trigger when the player defeats King Bloxley while playing that hero, but the hero has not met the True Ending threshold.

```ts
function hasHeroNormalEnding(routeState, heroKey) {
  return routeState.defeatedKingBloxley
    && routeState.selectedHero === heroKey
    && !hasHeroTrueEnding(routeState, heroKey);
}
```

Normal endings should feel positive, complete, and useful. They should not punish the player for missing the True route. The hero helps repair the festival, but one deeper emotional thread remains partially unresolved.

## 8.2 True Ending

A hero True Ending should trigger when the player defeats King Bloxley with enough true-route choices and true-route score.

```ts
function hasHeroTrueEnding(routeState, heroKey) {
  const hero = routeState.heroes[heroKey];
  return routeState.defeatedKingBloxley
    && routeState.selectedHero === heroKey
    && hero.trueFlags.length >= TRUE_ENDING_MIN_FLAGS
    && hero.trueScore >= TRUE_ENDING_MIN_SCORE;
}
```

True endings should reveal the character's deeper route theme and also contribute to the global Festival True Ending.

## 8.3 Risky Variant Layer

The Risky route should not replace Normal or True Ending. It adds a celebratory flavor layer, bonus scene, rare reward, altered boss line, or extra epilogue panel.

```ts
function getHeroVariant(routeState, heroKey) {
  const hero = routeState.heroes[heroKey];
  return hero.riskyScore >= VARIANT_MIN_RISK_SCORE ? hero.variantEndingId : null;
}
```

## 8.4 Ending Titles

| Hero | Normal Ending | True Ending | Variant Layer |
| --- | --- | --- | --- |
| Milo | The Junior Emergency Dungeon Organizer | The Block Listener | Festival Grace Variant |
| Pippa | The Emergency Festival Baker | The Hearthkeeper of Brixonia | Festival Flambé Variant |
| Zuzu | The Questionable Gadget Supervisor | The Public Safety Engineer | Festival Overclock Variant |
| Nixie | The Festival Freezer Keeper | The Gentle Thaw | Aurora Variant |
| Bruk | The Snack Table Captain | The Knight of the Shared Table | Festival Banquet Parade Variant |
| Lumi | The Star Lantern Decorator | The Wishkeeper of Falling Stars | Meteor Parade Variant |

---

# 9. Route Save Data Model

Use a generic structure so future characters can be added without hardcoding separate save fields everywhere.

```ts
type RouteChoiceLane = "practical" | "true" | "risky";

type HeroRouteProgress = {
  heroId: string;
  practicalScore: number;
  trueScore: number;
  riskyScore: number;
  trueFlags: string[];
  chosenScenes: Record<string, RouteChoiceLane>;
  unlockedEndingIds: string[];
  variantEndingIds: string[];
};

type RouteProgressState = {
  activeHeroId: string;
  routeVersion: number;
  heroes: Record<string, HeroRouteProgress>;
};
```

Example scene choice record:

```json
{
  "activeHeroId": "hero_zuzu_goblin_engineer",
  "routeVersion": 1,
  "heroes": {
    "hero_zuzu_goblin_engineer": {
      "heroId": "hero_zuzu_goblin_engineer",
      "practicalScore": 2,
      "trueScore": 3,
      "riskyScore": 1,
      "trueFlags": ["zuzu_flag_logged_sprinkle_pressure_fault", "zuzu_flag_admitted_prototype_override"],
      "chosenScenes": {
        "SCN_ZUZU_01": "true",
        "SCN_ZUZU_02": "true",
        "SCN_ZUZU_03": "practical"
      },
      "unlockedEndingIds": [],
      "variantEndingIds": []
    }
  }
}
```

---

# 10. Narrative Content JSON Shape

Recommended route scene content shape:

```ts
type RouteSceneContent = {
  id: string;
  heroId: string;
  stageId: string;
  locationName: string;
  title: string;
  storyBeat: string;
  storyboardPanels: string[];
  preChoiceDialogue: DialogueLine[];
  choices: RouteChoiceContent[];
  postChoiceBarks: DialogueLine[];
  victoryCallback: DialogueLine[];
  bossCallback?: DialogueLine[];
};

type RouteChoiceContent = {
  id: string;
  lane: RouteChoiceLane;
  label: string;
  playerLine: string;
  npcResponse: DialogueLine[];
  narration: string;
  gameplayResult: string;
  statDelta: Record<string, number>;
  grantFlag?: string;
  riskConfig?: {
    rewardTier?: "stage" | "rare" | "hero_themed";
    oopsieChance?: number;
    hazardIncrease?: string;
  };
};

type DialogueLine = {
  speakerId: string;
  text: string;
  expression?: string;
  voiceTag?: string;
};
```

---

# 11. Suggested File Split

Keep full scripts readable for writers while also providing structured JSON for implementation.

```text
docs/story/routes/
  00_MASTER_CHARACTER_ROUTE_INDEX.md
  milo_route_dialogue.md
  pippa_route_dialogue.md
  zuzu_route_dialogue.md
  nixie_route_dialogue.md
  bruk_route_dialogue.md
  lumi_route_dialogue.md

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

src/game/systems/
  RouteStorySystem.ts
  DialogueSystem.ts
```

---

# 12. Implementation Order

Do not implement every dialogue line in one pass. Add the structure first, then content.

## Phase S1 — Route Data Foundation

- Add generic route state types.
- Add route progress save migration.
- Add route content schemas.
- Add content validation for route scene IDs, hero IDs, stage IDs, and flags.
- No UI work yet except safe placeholders.

## Phase S2 — Milo Route Implementation

- Add Milo route scene JSON for all six stages.
- Add choice resolution.
- Add route flag/stat updates.
- Add Milo ending check.
- Test one full run path using Milo.

## Phase S3 — Remaining Hero Routes

- Add Pippa, Zuzu, Nixie, Bruk, and Lumi content one hero at a time.
- Keep each hero in a separate JSON file.
- Run content validation after each hero.

## Phase S4 — Dialogue UI and Boss Callbacks

- Add route scene UI card.
- Add choice cards with label, player line preview, and outcome hint.
- Add boss callback lines based on selected hero and route state.
- Keep all text skippable and mobile-readable.

## Phase S5 — Endings and Epilogue

- Add Normal / True / Risky variant ending resolver.
- Add ending screens.
- Add meta progress records for unlocked endings.
- Add global Festival True Ending hooks once all hero routes exist.

---

# 13. QA Checklist

## Voice QA

- [ ] Milo lines cannot be mistaken for Pippa, Zuzu, Nixie, Bruk, or Lumi.
- [ ] Pippa uses baker/fire/hospitality language without becoming generic anger.
- [ ] Zuzu uses technical goblin-engineer language without becoming random nonsense.
- [ ] Nixie is calm and warm, not emotionless.
- [ ] Bruk sounds knightly and protective, not only food-joke driven.
- [ ] Lumi is poetic but still clear enough for gameplay.
- [ ] Block-O-Matic lines are formal diagnostic machine voice.
- [ ] King Bloxley lines are royal, symmetrical, lonely, and theatrical.

## Route QA

- [ ] Every hero has 6 route scenes.
- [ ] Every route scene has 3 choices.
- [ ] No choice label is repeated within the same hero route.
- [ ] Practical choices grant practical score only.
- [ ] True choices grant true score and one true flag.
- [ ] Risky choices grant risky score and may add reward/hazard/oopsie.
- [ ] Ending checks use selected hero, true score, and true flags.
- [ ] Risky variant does not override Normal or True Ending.

## Technical QA

- [ ] Content validates if route JSON is added.
- [ ] Missing route content falls back safely.
- [ ] Route progress saves and loads.
- [ ] Old saves migrate with empty route progress.
- [ ] Dialogue can be skipped.
- [ ] Choice cards fit portrait mobile layout.
- [ ] Boss callbacks do not block gameplay.

---

# 14. Codex Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement the Blockmancer Dungeon character route story system in small safe steps.

Narrative goal:
Each playable hero should experience the same six-stage festival dungeon through a distinct character route. Do not use one generic dialogue template. Each hero needs different choice labels, speaking rhythm, story build-up, route stats, true flags, boss callbacks, and Normal/True Ending logic.

Heroes:
- Milo: gentle block listener, plink-plonk rhythm, listening and space.
- Pippa: brisk festival baker, fire/hearth/batch language.
- Zuzu: fast goblin engineer, prototype/calibration/safety language.
- Nixie: calm frostbinder, chill/thaw/preservation language.
- Bruk: loyal snack knight, oath/table/ration/shield language.
- Lumi: dreamy star witch, lantern/wish/constellation language.

Implement first:
1. Add RouteStorySystem types and safe save migration.
2. Add route content schema for route scenes, choices, barks, and endings.
3. Add Milo route content first as the pilot.
4. Add route choice resolution: practical, true, risky.
5. Add route flag/stat updates and ending resolver.
6. Add dialogue UI that is skippable and mobile-readable.
7. Add Pippa, Zuzu, Nixie, Bruk, and Lumi route content one hero at a time.

Acceptance criteria:
- Every route scene has unique choice labels.
- Character voices are clearly different.
- True choices grant stage-specific true flags.
- Normal and True Ending checks work per hero.
- Risky choices add variant flavor but do not replace endings.
- Route progress saves and loads safely.
- Missing route content uses fallback dialogue and does not crash.
- npm run validate:content passes if content changes.
- npm run build passes.

Finish response with:
Summary / Files changed / Route system behavior / Content added / Commands run / Manual test steps / Known limitations.
```

---

# 15. Source Route Drafts

These are the six individual draft files that this index consolidates:

- `blockmancer_milo_route_variable_choices.md` — full Milo route dialogue and storyboard draft.
- `blockmancer_pippa_route_variable_choices.md` — full Pippa route dialogue and storyboard draft.
- `blockmancer_zuzu_route_variable_choices.md` — full Zuzu route dialogue and storyboard draft.
- `blockmancer_nixie_route_variable_choices.md` — full Nixie route dialogue and storyboard draft.
- `blockmancer_bruk_route_variable_choices.md` — full Bruk route dialogue and storyboard draft.
- `blockmancer_lumi_route_variable_choices.md` — full Lumi route dialogue and storyboard draft.

When editing dialogue, update the individual hero route file first, then refresh this master index if labels, flags, stats, or ending rules changed.
