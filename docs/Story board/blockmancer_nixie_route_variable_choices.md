# Blockmancer Dungeon — Nixie Route Variable Choices

## Purpose

This document prepares **Nixie — The Frostbinder** as the next full character route after Milo, Pippa, and Zuzu.

The goal is to make Nixie feel immediately distinct from the other heroes through:

- A unique speaking rhythm.
- Stage-specific story build-up.
- Different choice label text in every stage.
- Different practical / true / risky outcomes in every stage.
- A clear Normal Ending, True Ending, and Risky Festival variant.
- Route flags that can be implemented as data-driven story state.

Nixie's route should feel like a calm, bright, magical ice-cream story. She is not cold because she lacks feeling. She is calm because she is trying to protect delicate things from melting, rushing, or breaking.

---

# 1. Nixie Voice Bible

## Core Voice

Nixie speaks with soft confidence. She uses measured words, gentle pauses, and cooling imagery. Her humor is dry and lightly punny, but never loud. She prefers to lower the temperature of a situation before solving it.

She sounds like someone who can calm a room without demanding silence.

## Speech Texture

Use:

```text
calm
steady
gentle
precise
cool
softly amused
patient
protective
observant
```

Avoid:

```text
hyperactive goblin wording
baker/fire metaphors
Milo's plink-plonk block language
Bruk's knightly oath language
Lumi's dreamy star poetry
too many ice puns in a row
internet sarcasm
```

## Common Word Bank

Nixie often says:

```text
chill
settle
thaw
drift
frost
melt
scoop
flavor
cart
syrup
snow
shiver
quiet
steady
slowly
preserve
soften
cool the edge
do not rush the freeze
```

## Sentence Pattern

Nixie often uses short, balanced lines.

Example:

```text
"Slowly. A cracked scoop can still be served."
"Let the frost settle before we decide what it means."
"Cold is not the same as cruel."
"Too much hurry ruins both spells and sorbet."
```

## Emotional Arc

Nixie begins by using cold as control. She believes if the board slows down, nobody gets hurt and nothing important melts.

Across the route, she learns that preservation is not the same as freezing everything in place.

Her True Ending is about learning when to cool, when to wait, and when to let something thaw.

## Route Meters

```text
nixieComposure
- Practical route value.
- Represents safe board control, careful defense, and stable decisions.
- Leads toward Normal Ending if this dominates.

nixieTenderness
- True route value.
- Represents patience, emotional warmth, and preserving meaning instead of merely preserving shape.
- Required for True Ending.

nixieAurora
- Risky festival route value.
- Represents beautiful, daring frost magic and high-risk spectacle.
- Can unlock special boss barks, rare rewards, or a variant ending.
```

## True Route Flags

```text
nixie_flag_sensed_warm_syrup
nixie_flag_cooled_machine_without_stopping_it
nixie_flag_named_the_lost_flavors
nixie_flag_heard_the_sleeping_room
nixie_flag_shared_the_slow_score
nixie_flag_thawed_the_hidden_corner
```

## Route Ending Logic Draft

```ts
type NixieRouteState = {
  nixieComposure: number;
  nixieTenderness: number;
  nixieAurora: number;
  flags: {
    nixie_flag_sensed_warm_syrup?: boolean;
    nixie_flag_cooled_machine_without_stopping_it?: boolean;
    nixie_flag_named_the_lost_flavors?: boolean;
    nixie_flag_heard_the_sleeping_room?: boolean;
    nixie_flag_shared_the_slow_score?: boolean;
    nixie_flag_thawed_the_hidden_corner?: boolean;
  };
};

function getNixieEnding(state: NixieRouteState) {
  const trueFlags = Object.values(state.flags).filter(Boolean).length;

  if (trueFlags >= 5 && state.nixieTenderness >= 5) {
    return "nixie_true_ending";
  }

  if (state.nixieAurora >= 4 && state.nixieTenderness >= 3) {
    return "nixie_aurora_variant";
  }

  return "nixie_normal_ending";
}
```

---

# 2. Route Summary

## Route Theme

```text
Control is useful. Care is warmer.
```

## Route Question

```text
Can Nixie save what is melting without freezing the festival's heart?
```

## Route Object

```text
The Rainbow Gelato Ledger
```

A little waterproof notebook from Nixie's ice cream cart. Each page lists one festival flavor. As the route progresses, missing flavors return as story clues.

Examples:

```text
Sprinkle Sunrise
Goblin Lime Spark
Quiet Vanilla Pillow
Arcade Blueberry Pop
Royal Raspberry Corner
```

## Recurring Focus NPC

```text
Bloop
```

For Nixie, Bloop behaves like a tiny temperature gauge. It shivers, melts slightly, becomes rounder, or hums quietly depending on the emotional temperature of the room.

## Recurring Machine Voice

The Block-O-Matic 3000 should sound formal and diagnostic, especially when describing Nixie's route.

Example:

```text
Block-O-Matic 3000:
"Thermal observation: Nixie's restraint has reduced immediate damage by 42%. Emotional thaw remains pending."
```

---

# 3. Choice Design Rules for Nixie

Each Nixie route scene has three choices:

## A. Practical / Composure

Nixie controls the room safely.

- Safer board.
- Small defense or control reward.
- Normal Ending lean.
- Uses words like stabilize, cool, settle, vent, slow.

## B. True / Tenderness

Nixie notices the feeling inside the frozen problem.

- Grants a true-route flag.
- Reveals a route clue.
- Improves future hazard counterplay.
- Uses words like thaw, listen, name, preserve, share.

## C. Risky / Aurora

Nixie creates a beautiful but risky frost spectacle.

- Rare or themed reward.
- Higher risk: Oopsie, stronger hazard, speed wave, freeze complication, or elite bonus rule.
- May alter boss state.
- Uses words like aurora, crystal, skate, shimmer, silver, frostlight.

---

# 4. Nixie Stage Route Overview

| Stage | Scene ID | Story Beat | Practical Choice | True Choice | Risky Choice | True Flag |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `SCN_NIXIE_01` | Warm syrup is making the sewers unstable. | Cool the Frosting Flow | Taste the Rainbow Melt | Freeze the Sprinkle Tide | `nixie_flag_sensed_warm_syrup` |
| 2 | `SCN_NIXIE_02` | Goblin machines are overheating from trying to help. | Lower the Boiler Heat | Cool the Machine Without Stopping It | Skate the Conveyor Loop | `nixie_flag_cooled_machine_without_stopping_it` |
| 3 | `SCN_NIXIE_03` | The pantry contains missing gelato memories. | Stabilize the Gelato Shelves | Name Every Lost Flavor | Crack the Crystal Scoops | `nixie_flag_named_the_lost_flavors` |
| 4 | `SCN_NIXIE_04` | Pillow Castle is too sleepy to explain its own danger. | Quiet the Blanket Draft | Hear the Sleeping Room | Slide Through the Sock-Ice | `nixie_flag_heard_the_sleeping_room` |
| 5 | `SCN_NIXIE_05` | The arcade is scoring too fast for anyone to enjoy. | Dim the Neon Frost | Share the Slow Score | Spin the Prize Chill | `nixie_flag_shared_the_slow_score` |
| 6 | `SCN_NIXIE_06` | Bloxley's palace is frozen around a hidden fear of disorder. | Soften the Royal Edges | Thaw the Hidden Corner | Crown the Crooked Snow | `nixie_flag_thawed_the_hidden_corner` |

---

# 5. Full Route Scenes

---

## SCN_NIXIE_01 — Sprinkle Sewers: The Warm Syrup Under the Frosting

```yaml
sceneId: SCN_NIXIE_01
hero: hero_nixie_frostbinder
stage: stage_1_sprinkle_sewers
trigger: first_route_event_in_stage_1_while_playing_nixie
location: Sprinkle Sewers
routeFlagOpportunity: nixie_flag_sensed_warm_syrup
```

### Story Beat

The sewers are not merely sticky. Under the frosting pipes, a warm rainbow syrup is rushing too quickly and melting the rune blocks before they can settle. Nixie realizes the dungeon's first problem is not heat itself. It is heat with nowhere gentle to go.

### Storyboard Panels

1. The party enters a round sewer chamber where frosting pipes drip in slow, colorful ribbons.
2. Rainbow syrup glows beneath the grates, too warm for the stage's candy blocks.
3. Bloop sits on the board edge and slowly slides into a tiny puddle shape.
4. Nixie kneels beside the syrup and touches the surface with one finger.
5. The board preview shows sticky blocks forming near warm spots.
6. The dialogue card opens with three Nixie-specific choices.

### Pre-Choice Dialogue

**Festival Announcer:**  
"The Sprinkle Sewers request calm feet, clean stacks, and absolutely no swimming in the frosting channel."

**Block-O-Matic 3000:**  
"Thermal observation: syrup velocity exceeds recommended festival sweetness. Sticky block formation imminent."

**Bloop:**  
"Bloo...op."

**Nixie:**  
"Poor thing. You are not melting. You are being hurried."

**Pippa:**  
"Can syrup be hurried?"

**Nixie:**  
"Yes. It becomes a panic with sugar in it."

**Nixie:**  
"Let me cool the edge. Not the heart."

### Dialogue Choices

#### A. Practical / Composure

**Choice Label:**  
"Cool the Frosting Flow"

**Player Line:**  
"I will slow the warm channels first. A calmer syrup makes a cleaner board."

**NPC Response:**  
Bloop firms back into a round shape and gives one approving wobble.

**Narration:**  
Nixie cools the pipe seams without freezing them shut. The frosting resumes a slower drip, and the sticky blocks lose some of their grip.

**Gameplay Result:**  
Reduce sticky block spawn chance for the next battle. Start the battle with one `block_ice` that clears safely for bonus mana.

**Route Result:**  
`+1 nixieComposure`

**Ending Lean:**  
Normal Ending

#### B. True / Tenderness

**Choice Label:**  
"Taste the Rainbow Melt"

**Player Line:**  
"This syrup is carrying a flavor. I should know what it is before I silence it."

**NPC Response:**  
Bloop lifts a tiny droplet toward Nixie. It tastes like melted festival lanterns and lost strawberry laughter.

**Narration:**  
Nixie recognizes the syrup as part of her missing rainbow gelato supply. It was not stolen carelessly; it was swept into the dungeon's panic and warmed until it forgot its shape.

**Gameplay Result:**  
For the next three rooms, the first freeze or sticky warning gains +1 counter window piece.

**Grant Flag:**  
`nixie_flag_sensed_warm_syrup`

**Route Result:**  
`+1 nixieTenderness`

**Ending Lean:**  
True Ending

#### C. Risky / Aurora

**Choice Label:**  
"Freeze the Sprinkle Tide"

**Player Line:**  
"A bright freeze, then. Quick, clean, and just dramatic enough to be useful."

**NPC Response:**  
The syrup flashes into glittering candy glass. Bloop taps it and slides across the room with a delighted squeak.

**Narration:**  
Nixie's frost catches the syrup mid-rush and turns the sewer floor into a sparkling rink. The board becomes easier to clean, but every careless move may slide farther than expected.

**Gameplay Result:**  
Gain a rare Stage 1 reward or extra sprinkles. Add temporary Oopsie candidate: `oops_slippery_buttons` or trigger one extra ice slide hazard in the next fight.

**Route Result:**  
`+1 nixieAurora`

**Ending Lean:**  
Risky Festival Variant

### Post-Choice Battle Bark Pool

**Nixie:**  
"Slow hands. Clear eyes. Let the board cool into place."

**Nixie:**  
"That sticky corner is not stubborn. It is overheated."

**Nixie:**  
"Do not rush the drop. Let it settle, then decide."

**Block-O-Matic 3000:**  
"Route temperature adjusted. Syrup confidence rising."

**Festival Announcer:**  
"The sewers are now pleasantly chilled. Please compliment the frosting responsibly."

### Victory Callback

**Nixie:**  
"Better. The syrup remembers it is sweet, not frantic."

### Boss Callback — Cupcake Slime King

If `nixie_flag_sensed_warm_syrup` is true:

**Nixie:**  
"Your frosting is too warm, little king. Sit still. We will save the flavor before it melts again."

**Cupcake Slime King:**  
"Glorb?"

**Nixie:**  
"Yes. That means you may keep some sprinkles."

---

## SCN_NIXIE_02 — Goblin Workshop: Heat in the Helpful Machine

```yaml
sceneId: SCN_NIXIE_02
hero: hero_nixie_frostbinder
stage: stage_2_goblin_workshop
trigger: first_route_event_in_stage_2_while_playing_nixie
location: Goblin Workshop
routeFlagOpportunity: nixie_flag_cooled_machine_without_stopping_it
```

### Story Beat

The Goblin Workshop is loud, hot, and proud of both facts. A machine is trying to sort blocks faster than its little gears can bear. Nixie must decide whether to stop the machine, soothe it, or use its speed for a dazzling route.

### Storyboard Panels

1. Brass pipes hiss sugar steam over conveyor belts.
2. Toy bombs roll gently in circles, each wearing a warning ribbon.
3. A goblin machine stamps "HELPFUL" on every block, including junk.
4. Bloop sits beside a gauge labeled "Completely Fine" while the needle trembles.
5. Nixie raises a cool palm and watches frost form on one gear tooth.
6. The dialogue card opens.

### Pre-Choice Dialogue

**Zuzu:**  
"Workshop rule: if the gauge is shaking, it is technically still attached."

**Nixie:**  
"That is not a rule. That is a confession with bolts."

**Block-O-Matic 3000:**  
"Thermal observation: goblin sorting device is producing assistance at unsafe enthusiasm levels."

**Bloop:**  
"Bloop-bloop... hot little wheels."

**Nixie:**  
"It wants to help. That makes stopping it simple, but not kind."

**Zuzu:**  
"I object to kindness that reduces output."

**Nixie:**  
"Then I will make it precise enough to embarrass you."

### Dialogue Choices

#### A. Practical / Composure

**Choice Label:**  
"Lower the Boiler Heat"

**Player Line:**  
"I will cool the pressure tank first. Helpful machines should not steam like soup."

**NPC Response:**  
The gauge needle drops from "Completely Fine" to "Actually Fine."

**Narration:**  
Nixie lowers the boiler heat and slows the machine's worst bursts. The room keeps moving, but its junk rhythm becomes easier to read.

**Gameplay Result:**  
Reduce board shake duration and delay the first incoming junk queue by one piece.

**Route Result:**  
`+1 nixieComposure`

**Ending Lean:**  
Normal Ending

#### B. True / Tenderness

**Choice Label:**  
"Cool the Machine Without Stopping It"

**Player Line:**  
"Little engine, keep your purpose. Lose only the fever."

**NPC Response:**  
The machine releases a soft puff of steam shaped like a relieved cube.

**Narration:**  
Nixie traces frost along the overheating gears without freezing the axle. The machine continues helping, this time slowly enough to choose what help means.

**Gameplay Result:**  
For this stage, the first gadget hazard each room reveals its warning one piece earlier.

**Grant Flag:**  
`nixie_flag_cooled_machine_without_stopping_it`

**Route Result:**  
`+1 nixieTenderness`

**Ending Lean:**  
True Ending

#### C. Risky / Aurora

**Choice Label:**  
"Skate the Conveyor Loop"

**Player Line:**  
"If the belt insists on moving, I will make it graceful."

**NPC Response:**  
Nixie freezes a thin ribbon over the conveyor and glides beside the next queue as if the workshop were a winter parade.

**Narration:**  
The conveyor loop becomes a glittering track. The next pieces arrive faster, but Nixie can read them while skating the rhythm.

**Gameplay Result:**  
Gain an extra Next preview for one battle. Add a chance for `hazard_speed_wave` or temporary faster piece delivery.

**Route Result:**  
`+1 nixieAurora`

**Ending Lean:**  
Risky Festival Variant

### Post-Choice Battle Bark Pool

**Nixie:**  
"A machine may hurry. We do not have to join it."

**Nixie:**  
"Cool the belt, not the idea."

**Nixie:**  
"That junk queue is warming up. Let us answer before it boils."

**Block-O-Matic 3000:**  
"Workshop fever reduced. Goblin pride remains above safe limit."

**Zuzu:**  
"I heard that. Pride is a renewable fuel."

### Victory Callback

**Nixie:**  
"There. The machine is still helpful, and no longer sweating screws."

### Boss Callback — Prototype No. 7

If `nixie_flag_cooled_machine_without_stopping_it` is true:

**Prototype No. 7:**  
"ASSISTANCE MODE: EXCESSIVE."

**Nixie:**  
"Keep the assistance. Lower the panic."

**Zuzu:**  
"That is... annoyingly good engineering."

---

## SCN_NIXIE_03 — Frosty Pantry: The Names of Missing Flavors

```yaml
sceneId: SCN_NIXIE_03
hero: hero_nixie_frostbinder
stage: stage_3_frosty_pantry
trigger: first_route_event_in_stage_3_while_playing_nixie
location: Frosty Pantry
routeFlagOpportunity: nixie_flag_named_the_lost_flavors
```

### Story Beat

This is Nixie's home territory: the Frosty Pantry. But the dungeon has frozen her rainbow gelato supply into silent crystals. Each missing flavor is trapped in a block of ice. Nixie can stabilize the shelves, remember the names, or crack the crystals for power.

### Storyboard Panels

1. The party enters a pantry aisle lined with floating jars of syrup and enchanted cold boxes.
2. Rainbow gelato crates sit sealed in frost, each label blurred.
3. Bloop presses its face to a crate and shivers.
4. Nixie opens her Rainbow Gelato Ledger.
5. The pages are damp but readable, except for several missing flavor names.
6. The board preview shows ice blocks and freeze warnings.

### Pre-Choice Dialogue

**Festival Announcer:**  
"Welcome to the Frosty Pantry. Please do not lick historical evidence."

**Block-O-Matic 3000:**  
"Thermal observation: flavor identity stored beneath layered ice. Forceful extraction may damage dessert memory."

**Nixie:**  
"This shelf knows me."

**Milo:**  
"Can shelves know people?"

**Nixie:**  
"Of course. Good freezers remember who closes the door gently."

**Bloop:**  
"Bloop... cold names."

**Nixie:**  
"Yes. They are still here. Just under too much winter."

### Dialogue Choices

#### A. Practical / Composure

**Choice Label:**  
"Stabilize the Gelato Shelves"

**Player Line:**  
"First, the shelves. Nothing can be recovered while the pantry is sliding."

**NPC Response:**  
The nearest crate settles with a soft wooden sigh.

**Narration:**  
Nixie braces the shelves with careful frost and stops the ice blocks from drifting into dangerous shapes. The missing labels remain blurred, but the pantry becomes safer.

**Gameplay Result:**  
Reduce ice slide effects for the next two battles. Gain a small shield at battle start.

**Route Result:**  
`+1 nixieComposure`

**Ending Lean:**  
Normal Ending

#### B. True / Tenderness

**Choice Label:**  
"Name Every Lost Flavor"

**Player Line:**  
"Sprinkle Sunrise. Moonmint. Lanternberry. I remember you. Come back slowly."

**NPC Response:**  
The blurred labels sharpen one by one. Bloop hums each name badly but sincerely.

**Narration:**  
Nixie does not break the ice. She names what is inside it. The flavors answer as faint colors beneath the frost, and one lost page in the ledger dries itself.

**Gameplay Result:**  
Unlock a route buff: the first freeze hazard in each Frosty Pantry room becomes a `chilled_warning` instead of a hard freeze.

**Grant Flag:**  
`nixie_flag_named_the_lost_flavors`

**Route Result:**  
`+1 nixieTenderness`

**Ending Lean:**  
True Ending

#### C. Risky / Aurora

**Choice Label:**  
"Crack the Crystal Scoops"

**Player Line:**  
"A clean fracture, then. Pretty enough to forgive, careful enough to serve."

**NPC Response:**  
The frozen gelato crystals burst into glittering scoop-shaped shards.

**Narration:**  
Nixie cracks the ice with a beautiful spiral of frostlight. The room showers rare ingredients across the board, but a few crystals splinter into tricky ice blocks.

**Gameplay Result:**  
Gain a rare frost-themed reward. Add extra `block_ice` or a one-room freeze warning hazard.

**Route Result:**  
`+1 nixieAurora`

**Ending Lean:**  
Risky Festival Variant

### Post-Choice Battle Bark Pool

**Nixie:**  
"Careful. Ice remembers pressure."

**Nixie:**  
"A frozen block is not quiet. It is waiting."

**Nixie:**  
"Let the warning frost speak before it bites."

**Block-O-Matic 3000:**  
"Flavor identity partially restored. Dessert morale improving."

**Festival Announcer:**  
"Recovered flavors should report to the cart in orderly scoops."

### Victory Callback

**Nixie:**  
"The pantry is breathing again. Coldly, but that is its preference."

### Boss Callback — Gelato Golem

If `nixie_flag_named_the_lost_flavors` is true:

**Gelato Golem:**  
"GRRROOOP."

**Nixie:**  
"I know. You are not one flavor. You are all of them, frightened together."

**Gelato Golem:**  
"...gloop?"

**Nixie:**  
"We will sort the scoops. No one is being thrown away."

---

## SCN_NIXIE_04 — Pillow Castle: The Temperature of Sleep

```yaml
sceneId: SCN_NIXIE_04
hero: hero_nixie_frostbinder
stage: stage_4_pillow_castle
trigger: first_route_event_in_stage_4_while_playing_nixie
location: Pillow Castle
routeFlagOpportunity: nixie_flag_heard_the_sleeping_room
```

### Story Beat

Pillow Castle is wrapped in soft blocks and sleepy magic. Nixie notices that the room is not simply asleep. It is trying to rest after too much noise from the dungeon. She can quiet the draft, listen to the room, or skate through with risky grace.

### Storyboard Panels

1. The party enters a castle hallway made of stacked pillows and quilted banners.
2. Frost gathers in the corners where blanket ghosts have been drifting.
3. A sleeping guard mumbles about cold toes.
4. Bloop pulls a tiny blanket over itself and immediately rolls under the board.
5. Nixie lowers her voice until the UI text feels softer.
6. The dialogue card opens.

### Pre-Choice Dialogue

**Festival Announcer:**  
"Pillow Castle asks all visitors to lower their weapons, voices, and unnecessary crunching."

**Bruk:**  
"I have never crunched unnecessarily."

**Nixie:**  
"That is a brave claim."

**Block-O-Matic 3000:**  
"Comfort observation: room requires rest. Current hazard set includes soft blocks, Sleepy status, and shielded plush resistance."

**Bloop:**  
"Bloop... shhh."

**Nixie:**  
"Yes. This is not a trap first. It is tired first."

### Dialogue Choices

#### A. Practical / Composure

**Choice Label:**  
"Quiet the Blanket Draft"

**Player Line:**  
"I will stop the cold draft. Sleep should not have sharp edges."

**NPC Response:**  
The blanket ghosts stop fluttering and settle into curtain shapes.

**Narration:**  
Nixie seals the draft curling around the pillow walls. The room stays sleepy, but the Sleepy status becomes easier to predict.

**Gameplay Result:**  
Reduce Sleepy duration by one tick in the next battle. Gain a small defensive shield.

**Route Result:**  
`+1 nixieComposure`

**Ending Lean:**  
Normal Ending

#### B. True / Tenderness

**Choice Label:**  
"Hear the Sleeping Room"

**Player Line:**  
"I will not wake it yet. Dreams sometimes explain what alarms cannot."

**NPC Response:**  
The pillow walls exhale. Bloop's tiny blanket rises and falls like a moonlit tide.

**Narration:**  
Nixie listens to the rhythm of the room's sleep. Beneath the soft blocks, she hears the dungeon trying to rest between disasters.

**Gameplay Result:**  
Once per Pillow Castle room, Sleepy becomes `drowsy_guard` instead: it delays action but grants a small shield when cleared.

**Grant Flag:**  
`nixie_flag_heard_the_sleeping_room`

**Route Result:**  
`+1 nixieTenderness`

**Ending Lean:**  
True Ending

#### C. Risky / Aurora

**Choice Label:**  
"Slide Through the Sock-Ice"

**Player Line:**  
"If the floor wants quiet, I can cross it without a single thump."

**NPC Response:**  
Nixie freezes a whisper-thin path across the carpet. Bloop slides after her under its blanket like a determined dumpling.

**Narration:**  
The party glides through the hallway in near-perfect silence. It is elegant, successful, and only slightly likely to send everyone into a cushion pile.

**Gameplay Result:**  
Skip or weaken one minor encounter. Add a chance of `oops_slippery_buttons` or a surprise soft-block cluster.

**Route Result:**  
`+1 nixieAurora`

**Ending Lean:**  
Risky Festival Variant

### Post-Choice Battle Bark Pool

**Nixie:**  
"Softly. The board is half asleep."

**Nixie:**  
"Do not break the dream. Turn it over."

**Nixie:**  
"A shield can be a pillow, if placed kindly."

**Block-O-Matic 3000:**  
"Room comfort increased. Snore interference remains charming."

**Bruk:**  
"A battle that respects naps. I approve."

### Victory Callback

**Nixie:**  
"There. Still sleepy. No longer scared."

### Boss Callback — Sir Snore-a-Lot

If `nixie_flag_heard_the_sleeping_room` is true:

**Sir Snore-a-Lot:**  
"Zzz... defend the nap..."

**Nixie:**  
"You may defend it. We only need the hallway back."

**Bruk:**  
"A treaty of pillows."

**Nixie:**  
"With warm socks included."

---

## SCN_NIXIE_05 — Starfall Arcade: A Slower Score

```yaml
sceneId: SCN_NIXIE_05
hero: hero_nixie_frostbinder
stage: stage_5_starfall_arcade
trigger: first_route_event_in_stage_5_while_playing_nixie
location: Starfall Arcade
routeFlagOpportunity: nixie_flag_shared_the_slow_score
```

### Story Beat

The Starfall Arcade rewards speed, combos, and flashing lights. Nixie senses that the scoreboards are rushing players into mistakes. Her route asks whether victory must always be loud and fast.

### Storyboard Panels

1. Neon scoreboards blink too quickly for the eye to follow.
2. Prize counters rattle with tickets, each one stamped with a combo number.
3. A Token Sprite tries to count points and drops half of them from nerves.
4. Bloop turns blue, then pink, then blue again under the arcade lights.
5. Nixie shades her eyes with one hand and exhales frost across the nearest screen.
6. The dialogue card opens.

### Pre-Choice Dialogue

**Festival Announcer:**  
"Starfall Arcade reminds all contestants that panic is not a scoring category."

**Lumi:**  
"But sparkle is."

**Nixie:**  
"Sparkle may remain. Panic should take a seat."

**Block-O-Matic 3000:**  
"Tempo observation: score acceleration exceeds participant delight. Enjoyment variance declining."

**Bloop:**  
"Bloop-bloop-bloop-bloop—"

**Nixie:**  
"Exactly. Too many bloops per breath."

### Dialogue Choices

#### A. Practical / Composure

**Choice Label:**  
"Dim the Neon Frost"

**Player Line:**  
"I will cool the lights. A score is easier to earn when it stops shouting."

**NPC Response:**  
The scoreboard dims from frantic sparkle to readable festival glow.

**Narration:**  
Nixie lowers the visual noise without ending the arcade challenge. The combo targets remain, but the preview stops flickering so aggressively.

**Gameplay Result:**  
Reduce preview disruption chance in the next battle. Start with a small Fever meter bonus.

**Route Result:**  
`+1 nixieComposure`

**Ending Lean:**  
Normal Ending

#### B. True / Tenderness

**Choice Label:**  
"Share the Slow Score"

**Player Line:**  
"Let everyone take the point together. A good score should leave room to smile."

**NPC Response:**  
The Token Sprite stops trembling and places its tickets into a shared bowl.

**Narration:**  
Nixie convinces the arcade machine to count careful plays as beautifully as fast ones. A slow cascade earns a soft chime, and the room remembers that games are for delight.

**Gameplay Result:**  
Unlock route modifier: the first cascade after a speed wave grants extra Fever and reduces one incoming hazard.

**Grant Flag:**  
`nixie_flag_shared_the_slow_score`

**Route Result:**  
`+1 nixieTenderness`

**Ending Lean:**  
True Ending

#### C. Risky / Aurora

**Choice Label:**  
"Spin the Prize Chill"

**Player Line:**  
"If the arcade wants spectacle, I can give it one with clean edges."

**NPC Response:**  
Nixie sends a ring of frost around the prize wheel. It spins in a blue-white blur, raining tickets like snow.

**Narration:**  
The arcade cheers as frostlight circles the machines. The reward is generous, but the next room expects Nixie to keep pace with the spectacle she created.

**Gameplay Result:**  
Gain bonus tickets or a rare arcade reward. Add a stronger combo objective or speed-wave hazard next room.

**Route Result:**  
`+1 nixieAurora`

**Ending Lean:**  
Risky Festival Variant

### Post-Choice Battle Bark Pool

**Nixie:**  
"Fast is not the same as graceful."

**Nixie:**  
"Let the combo breathe. It will last longer."

**Nixie:**  
"Too much light. I will keep the important glow."

**Block-O-Matic 3000:**  
"Score enjoyment recalibrated. Panic no longer receives bonus tickets."

**Lumi:**  
"The lights are softer. They look like stars under ice."

### Victory Callback

**Nixie:**  
"That score felt earned. Better, it felt shared."

### Boss Callback — High Score Hydra

If `nixie_flag_shared_the_slow_score` is true:

**High Score Hydra:**  
"MORE POINTS. FASTER POINTS. LOUDER POINTS."

**Nixie:**  
"Lower your heads. A good game does not need to frighten its players."

**High Score Hydra:**  
"...medium points?"

**Nixie:**  
"Lovely. We can begin there."

---

## SCN_NIXIE_06 — Bloxley's Block Palace: The Hidden Corner

```yaml
sceneId: SCN_NIXIE_06
hero: hero_nixie_frostbinder
stage: stage_6_bloxleys_block_palace
trigger: first_route_event_in_stage_6_while_playing_nixie
location: Bloxley's Block Palace
routeFlagOpportunity: nixie_flag_thawed_the_hidden_corner
```

### Story Beat

Bloxley's palace is not merely square; it is frozen into perfection. Nixie discovers a corner of the palace where the royal blocks are colder than the rest. It is the place Bloxley has hidden every crooked, funny, festival-shaped thing he could not control.

### Storyboard Panels

1. The party enters a hallway of polished square tiles and perfectly aligned banners.
2. Confetti cannons fire in straight lines, which looks deeply unnatural.
3. Royal blocks form a wall with one corner frosted over.
4. Bloop presses against the frosted corner and hears a tiny trapped jingle.
5. Nixie places her hand on the wall, then immediately pulls it back.
6. The dialogue card opens.

### Pre-Choice Dialogue

**King Bloxley:**  
"Behold! A corridor of flawless angles. Even the confetti has learned discipline."

**Nixie:**  
"Your palace is cold in the wrong places."

**King Bloxley:**  
"Impossible. It is uniformly majestic."

**Block-O-Matic 3000:**  
"Structural observation: one royal corner contains suppressed festival irregularities. Contents include laughter, round cakes, and noncompliant ribbon curls."

**Bloop:**  
"Bloop... trapped jingle."

**Nixie:**  
"Perfection can freeze a room faster than winter."

### Dialogue Choices

#### A. Practical / Composure

**Choice Label:**  
"Soften the Royal Edges"

**Player Line:**  
"I will warm the edges first. Sharp corners are where panic gathers."

**NPC Response:**  
The royal blocks lose their harsh shine and become easier to read.

**Narration:**  
Nixie softens the royal block edges without breaking the palace wall. The route forward is safer, though the hidden corner remains mostly sealed.

**Gameplay Result:**  
Reduce royal block hardness or pattern complexity in the next palace battle.

**Route Result:**  
`+1 nixieComposure`

**Ending Lean:**  
Normal Ending

#### B. True / Tenderness

**Choice Label:**  
"Thaw the Hidden Corner"

**Player Line:**  
"I will not break it. I will make it warm enough to tell the truth."

**NPC Response:**  
The corner thaws slowly. A ribbon curl slips out first, then a tiny laugh, then the scent of round raspberry cake.

**Narration:**  
Nixie reveals the palace's hidden store of imperfect festival things. Bloxley does not shout at first. He only stares, as if the crooked ribbons were something he missed without permission.

**Gameplay Result:**  
During the King Bloxley fight, the first royal pattern warning appears earlier and one royal block converts into a normal rune after a cascade.

**Grant Flag:**  
`nixie_flag_thawed_the_hidden_corner`

**Route Result:**  
`+1 nixieTenderness`

**Ending Lean:**  
True Ending

#### C. Risky / Aurora

**Choice Label:**  
"Crown the Crooked Snow"

**Player Line:**  
"If he wants a crown, let it be made of snow that refuses to stay square."

**NPC Response:**  
Nixie sends frost up the palace wall in curling aurora patterns. The royal banners glitter beautifully, then sag into charmingly uneven shapes.

**Narration:**  
The palace gasps. Bloxley is offended, impressed, and briefly unable to choose between the two. The board gains a powerful frostlight opening, but the final fight becomes more dramatic.

**Gameplay Result:**  
Start final boss with bonus shield and Fever. Add an extra royal-pattern phase or stronger aurora hazard.

**Route Result:**  
`+1 nixieAurora`

**Ending Lean:**  
Risky Festival Variant

### Post-Choice Battle Bark Pool

**Nixie:**  
"Square things may still be gentle."

**Nixie:**  
"This corner is colder than command. That means fear."

**Nixie:**  
"Thaw slowly. Truth cracks if rushed."

**Block-O-Matic 3000:**  
"Royal temperature variance detected. Hidden festival contents emotionally significant."

**King Bloxley:**  
"Those ribbons are not regulation."

**Nixie:**  
"Good. They are happy."

### Victory Callback

**Nixie:**  
"The palace is still standing. It is simply less afraid of curves."

### Final Boss Callback — King Bloxley

If `nixie_flag_thawed_the_hidden_corner` is true:

**King Bloxley:**  
"I made every room perfect. No one could laugh at a perfect room."

**Nixie:**  
"No. But they could not rest in it either."

**King Bloxley:**  
"Rest is for pillows."

**Nixie:**  
"Then borrow one. Brixonia has plenty."

---

# 6. Nixie Ending Scripts

---

## Nixie Normal Ending — The Cart Reopens

```yaml
endingId: nixie_normal_ending
requirements:
  - defeat_king_bloxley
  - true_flags_below_5
  - nixieComposure_dominant_or_default
```

### Storyboard Panels

1. The final battle ends. Royal blocks settle into harmless colorful cubes.
2. Nixie returns to her ice cream cart in the festival hub.
3. The rainbow gelato supply is mostly restored, though a few labels are still smudged.
4. Children line up for scoops while Bloop guards the toppings.
5. Nixie serves a careful cone with a tiny frost flower on top.
6. The fountain remains jelly, but now it is chilled jelly.

### Ending Dialogue

**Festival Announcer:**  
"With the dungeon freshly de-stacked, Nixie's Ice Cream Cart is pleased to resume safe, delicious service."

**Bloop:**  
"Bloop!"

**Nixie:**  
"One at a time, please. Frozen things do best without a stampede."

**Milo:**  
"You saved the gelato."

**Nixie:**  
"Most of it."

**Pippa:**  
"Most?"

**Nixie:**  
"Some flavors are still shy. I will not rush them."

**Block-O-Matic 3000:**  
"Festival note: frozen dessert availability restored to 82%. Public joy level rising."

**Nixie:**  
"That is enough for today. Tomorrow, we thaw another label."

### Ending Result

```text
Unlock:
- Nixie route badge: "Calm Cart Keeper"
- Nixie hub bark set: normal
- Small meta bonus: start future Nixie runs with +1 shield or slower first speed wave
```

### Ending Tone

Warm, safe, slightly incomplete. Nixie fixed the immediate problem but has not fully learned the deeper truth of the missing flavors.

---

## Nixie True Ending — The Gentle Thaw Festival

```yaml
endingId: nixie_true_ending
requirements:
  - defeat_king_bloxley
  - nixieTenderness >= 5
  - at_least_5_nixie_true_flags
```

### Storyboard Panels

1. The Block-O-Matic 3000 projects a soft snowflake-shaped menu over the festival square.
2. Nixie's Rainbow Gelato Ledger opens by itself, every flavor name restored.
3. The recovered flavors rise as tiny glowing scoops and settle into the cart.
4. King Bloxley receives a round raspberry scoop in a square cup.
5. The palace's hidden ribbons are hung across the ice cream cart.
6. The festival begins a new event: The Gentle Thaw, where players share slow desserts and tell the stories behind each flavor.

### Ending Dialogue

**Block-O-Matic 3000:**  
"Festival proposal: annual Gentle Thaw event. Purpose: preserve dessert memory while allowing safe emotional melting."

**Professor Poplin:**  
"That is... rather poetic for a machine."

**Block-O-Matic 3000:**  
"Correction: thermally poetic."

**Nixie:**  
"I accept."

**Milo:**  
"The flavors came back."

**Nixie:**  
"No. They were waiting to be called by name."

**Bloop:**  
"Bloopberry!"

**Nixie:**  
"Not an official flavor."

**Bloop:**  
"Bloopberry."

**Nixie:**  
"...A seasonal flavor."

**King Bloxley:**  
"This scoop is round."

**Nixie:**  
"Yes."

**King Bloxley:**  
"It is in a square cup."

**Nixie:**  
"Also yes."

**King Bloxley:**  
"I find this arrangement... tolerable."

**Nixie:**  
"That is how thawing starts."

### Final Narration

The festival did not become quieter. It became kinder to quiet things.

The ice cream cart served every restored flavor, including the ones that had once been trapped beneath panic, noise, and perfect corners. The Block-O-Matic 3000 learned a new mode called **Gentle Thaw**, which opened the dungeon slowly, with warning signs, soft chimes, and complimentary spoons.

Nixie still cooled the board when danger rose.

But now, when something froze, she asked what it was trying to keep safe.

### Ending Result

```text
Unlock:
- Nixie route badge: "Gentle Thaw"
- Nixie true ending illustration
- Nixie cosmetic: Aurora Cart Ribbon
- Future Nixie passive upgrade candidate: first freeze/speed hazard each room becomes a warning instead of immediate effect
```

### Ending Tone

Emotionally complete, still cheerful. Nixie learns that the best cold protects warmth instead of replacing it.

---

## Nixie Aurora Variant — The Snowlight Sundae Show

```yaml
endingId: nixie_aurora_variant
requirements:
  - defeat_king_bloxley
  - nixieAurora >= 4
  - nixieTenderness >= 3
```

### Storyboard Panels

1. Nixie turns the festival square into a harmless snowlight rink.
2. Bloop slides between stalls carrying spoon samples.
3. The Block-O-Matic 3000 creates aurora-colored block arches above the street.
4. Pippa objects to cold cake, then admits the frosting holds beautifully.
5. The arcade starts a new attraction: Chill Combo Skating.
6. Nixie bows once, quietly, while the whole festival glows.

### Ending Dialogue

**Festival Announcer:**  
"Presenting the first annual Snowlight Sundae Show, which has been declared mostly safe by someone confident."

**Zuzu:**  
"That someone was me."

**Nixie:**  
"Then I will add a second safety layer."

**Pippa:**  
"My cake is cold."

**Nixie:**  
"Your frosting is standing taller."

**Pippa:**  
"...Continue."

**Bloop:**  
"Bloop-bloop wheee."

**Nixie:**  
"Small slides only, Bloop. We are festive, not reckless."

**Block-O-Matic 3000:**  
"Aurora mode stabilized. Spectacle risk acceptable. Joy reflection index high."

**Nixie:**  
"Good. A little shimmer is allowed, if everyone lands softly."

### Ending Result

```text
Unlock:
- Nixie route badge: "Aurora Sundae"
- Cosmetic VFX: snowlight cascade sparkle
- Optional future relic: rel_aurora_spoon
```

### Ending Tone

Beautiful, playful, and celebratory. This is not the deepest Nixie ending, but it rewards players who choose her risky, stylish frost routes without losing her tenderness entirely.

---

# 7. Nixie Battle Barks

## General Battle Start

```text
Nixie: "Steady board. Gentle hands."
Nixie: "Let us lower the panic first."
Nixie: "Cold enough to help. Warm enough to care."
Nixie: "Watch the corners. Trouble likes to freeze there."
```

## Line Clear

```text
Nixie: "Cleanly done."
Nixie: "There. A little breathing room."
Nixie: "The board settles when treated kindly."
```

## Cascade

```text
Nixie: "A quiet cascade. Lovely."
Nixie: "See? Gravity can be graceful."
Nixie: "Let it fall. Let it find its place."
```

## Spell Cast

```text
Nixie: "Frost, but gently."
Nixie: "Chill the edge."
Nixie: "No need to shatter what can soften."
```

## Taking Damage

```text
Nixie: "A sharp lesson."
Nixie: "Still steady."
Nixie: "That was colder than necessary."
```

## Low HP

```text
Nixie: "We are thin as shaved ice. Carefully now."
Nixie: "One calm move at a time."
Nixie: "Do not hurry. Hurrying is how things crack."
```

## Victory

```text
Nixie: "Safe, chilled, and still sweet."
Nixie: "The room can rest now."
Nixie: "No flavor lost. I will count that as victory."
```

---

# 8. Nixie Hub Barks

## Early Hub

```text
Nixie: "My cart is still missing three wheels, two flavors, and one very smug scoop."
Nixie: "If you see rainbow gelato walking by itself, please ask where it is going."
Nixie: "The fountain jelly is better chilled. I refuse to say this was an improvement."
```

## Mid Route

```text
Nixie: "Some flavors are returning, but softly. We should let them arrive in their own time."
Nixie: "Bloop has requested a flavor named Bloopberry. This is not how menus work. Usually."
Nixie: "I used to think keeping something safe meant keeping it still. I am revising the recipe."
```

## True Route Near Completion

```text
Nixie: "The ledger remembers more names today."
Nixie: "A gentle thaw is still a thaw. That matters."
Nixie: "When the dungeon freezes, it is often hiding something warm underneath."
```

## Post-Normal Ending

```text
Nixie: "The cart is open. Some flavors remain mysterious, which is acceptable for dessert."
Nixie: "Please form one line. Two lines create unnecessary emotional geometry."
```

## Post-True Ending

```text
Nixie: "Gentle Thaw begins at sunset. Bring a spoon and one thing you are ready to forgive."
Nixie: "Bloopberry has sold out. I have no explanation."
```

---

# 9. Nixie Route Data Draft

```json
{
  "routeId": "route_nixie_frostbinder",
  "heroId": "hero_nixie_frostbinder",
  "routeTitle": "The Gentle Thaw",
  "routeTheme": "Control is useful. Care is warmer.",
  "routeMeters": {
    "practical": "nixieComposure",
    "true": "nixieTenderness",
    "risky": "nixieAurora"
  },
  "trueFlagsRequired": 5,
  "scenes": [
    {
      "sceneId": "SCN_NIXIE_01",
      "stageId": "stage_1_sprinkle_sewers",
      "flagOpportunity": "nixie_flag_sensed_warm_syrup",
      "choices": [
        {
          "choiceId": "nixie_01_a",
          "label": "Cool the Frosting Flow",
          "routeMeter": "nixieComposure",
          "routeDelta": 1
        },
        {
          "choiceId": "nixie_01_b",
          "label": "Taste the Rainbow Melt",
          "routeMeter": "nixieTenderness",
          "routeDelta": 1,
          "grantFlag": "nixie_flag_sensed_warm_syrup"
        },
        {
          "choiceId": "nixie_01_c",
          "label": "Freeze the Sprinkle Tide",
          "routeMeter": "nixieAurora",
          "routeDelta": 1,
          "risk": "oops_slippery_buttons"
        }
      ]
    },
    {
      "sceneId": "SCN_NIXIE_02",
      "stageId": "stage_2_goblin_workshop",
      "flagOpportunity": "nixie_flag_cooled_machine_without_stopping_it",
      "choices": [
        {
          "choiceId": "nixie_02_a",
          "label": "Lower the Boiler Heat",
          "routeMeter": "nixieComposure",
          "routeDelta": 1
        },
        {
          "choiceId": "nixie_02_b",
          "label": "Cool the Machine Without Stopping It",
          "routeMeter": "nixieTenderness",
          "routeDelta": 1,
          "grantFlag": "nixie_flag_cooled_machine_without_stopping_it"
        },
        {
          "choiceId": "nixie_02_c",
          "label": "Skate the Conveyor Loop",
          "routeMeter": "nixieAurora",
          "routeDelta": 1,
          "risk": "hazard_speed_wave"
        }
      ]
    },
    {
      "sceneId": "SCN_NIXIE_03",
      "stageId": "stage_3_frosty_pantry",
      "flagOpportunity": "nixie_flag_named_the_lost_flavors",
      "choices": [
        {
          "choiceId": "nixie_03_a",
          "label": "Stabilize the Gelato Shelves",
          "routeMeter": "nixieComposure",
          "routeDelta": 1
        },
        {
          "choiceId": "nixie_03_b",
          "label": "Name Every Lost Flavor",
          "routeMeter": "nixieTenderness",
          "routeDelta": 1,
          "grantFlag": "nixie_flag_named_the_lost_flavors"
        },
        {
          "choiceId": "nixie_03_c",
          "label": "Crack the Crystal Scoops",
          "routeMeter": "nixieAurora",
          "routeDelta": 1,
          "risk": "extra_block_ice"
        }
      ]
    },
    {
      "sceneId": "SCN_NIXIE_04",
      "stageId": "stage_4_pillow_castle",
      "flagOpportunity": "nixie_flag_heard_the_sleeping_room",
      "choices": [
        {
          "choiceId": "nixie_04_a",
          "label": "Quiet the Blanket Draft",
          "routeMeter": "nixieComposure",
          "routeDelta": 1
        },
        {
          "choiceId": "nixie_04_b",
          "label": "Hear the Sleeping Room",
          "routeMeter": "nixieTenderness",
          "routeDelta": 1,
          "grantFlag": "nixie_flag_heard_the_sleeping_room"
        },
        {
          "choiceId": "nixie_04_c",
          "label": "Slide Through the Sock-Ice",
          "routeMeter": "nixieAurora",
          "routeDelta": 1,
          "risk": "oops_slippery_buttons"
        }
      ]
    },
    {
      "sceneId": "SCN_NIXIE_05",
      "stageId": "stage_5_starfall_arcade",
      "flagOpportunity": "nixie_flag_shared_the_slow_score",
      "choices": [
        {
          "choiceId": "nixie_05_a",
          "label": "Dim the Neon Frost",
          "routeMeter": "nixieComposure",
          "routeDelta": 1
        },
        {
          "choiceId": "nixie_05_b",
          "label": "Share the Slow Score",
          "routeMeter": "nixieTenderness",
          "routeDelta": 1,
          "grantFlag": "nixie_flag_shared_the_slow_score"
        },
        {
          "choiceId": "nixie_05_c",
          "label": "Spin the Prize Chill",
          "routeMeter": "nixieAurora",
          "routeDelta": 1,
          "risk": "stronger_combo_objective"
        }
      ]
    },
    {
      "sceneId": "SCN_NIXIE_06",
      "stageId": "stage_6_bloxleys_block_palace",
      "flagOpportunity": "nixie_flag_thawed_the_hidden_corner",
      "choices": [
        {
          "choiceId": "nixie_06_a",
          "label": "Soften the Royal Edges",
          "routeMeter": "nixieComposure",
          "routeDelta": 1
        },
        {
          "choiceId": "nixie_06_b",
          "label": "Thaw the Hidden Corner",
          "routeMeter": "nixieTenderness",
          "routeDelta": 1,
          "grantFlag": "nixie_flag_thawed_the_hidden_corner"
        },
        {
          "choiceId": "nixie_06_c",
          "label": "Crown the Crooked Snow",
          "routeMeter": "nixieAurora",
          "routeDelta": 1,
          "risk": "extra_royal_pattern_phase"
        }
      ]
    }
  ],
  "endings": {
    "normal": "nixie_normal_ending",
    "true": "nixie_true_ending",
    "variant": "nixie_aurora_variant"
  }
}
```

---

# 10. Codex Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Add Nixie's variable character route dialogue and choice structure.

Context:
Nixie is the Frostbinder hero. She is calm, precise, protective, and tied to ice cream, cooling, slow fall speed, freeze warnings, speed-wave control, and defensive counterplay. Her route theme is "Control is useful. Care is warmer."

Do not make her sound like Milo, Pippa, or Zuzu.
- Do not use Milo's plink-plonk block language.
- Do not use Pippa's baking/fire temper voice.
- Do not use Zuzu's fast engineering bug-feature voice.
- Nixie should speak with calm, measured, cool, lightly witty wording.

Implement:
1. Add route data for route_nixie_frostbinder.
2. Add six route scenes:
   - SCN_NIXIE_01: Sprinkle Sewers
   - SCN_NIXIE_02: Goblin Workshop
   - SCN_NIXIE_03: Frosty Pantry
   - SCN_NIXIE_04: Pillow Castle
   - SCN_NIXIE_05: Starfall Arcade
   - SCN_NIXIE_06: Bloxley's Block Palace
3. Each scene must have unique choice labels:
   - No repeated "Make the board safe first"
   - No repeated "Listen beneath the hazard"
   - No repeated "Trust the rhythm"
4. Track meters:
   - nixieComposure
   - nixieTenderness
   - nixieAurora
5. Track true-route flags:
   - nixie_flag_sensed_warm_syrup
   - nixie_flag_cooled_machine_without_stopping_it
   - nixie_flag_named_the_lost_flavors
   - nixie_flag_heard_the_sleeping_room
   - nixie_flag_shared_the_slow_score
   - nixie_flag_thawed_the_hidden_corner
6. Add endings:
   - nixie_normal_ending
   - nixie_true_ending
   - nixie_aurora_variant
7. Add Nixie battle barks and hub barks.
8. Make dialogue skippable and mobile-readable.
9. Store route state in save/meta progress safely.

Acceptance Criteria:
- Nixie's dialogue reads differently from every other hero.
- Every stage has a different story beat and choice labels.
- Practical choices lean toward Normal Ending.
- True choices grant unique true-route flags.
- Risky choices give rare rewards or stylish advantages with fair drawbacks.
- Nixie true ending requires at least 5 true flags and high nixieTenderness.
- Build passes.
- Content validation passes if route content is data-driven.
```

---

# 11. QA Checklist

## Voice QA

```text
[ ] Nixie does not sound like Milo.
[ ] Nixie does not sound like Pippa.
[ ] Nixie does not sound like Zuzu.
[ ] Nixie uses calm, cooling, preservation, ice cream, and careful-control language.
[ ] Ice puns are light and not overused.
[ ] Emotional lines are warm without becoming tragic.
```

## Choice Label QA

```text
[ ] Stage 1 choice labels are unique.
[ ] Stage 2 choice labels are unique.
[ ] Stage 3 choice labels are unique.
[ ] Stage 4 choice labels are unique.
[ ] Stage 5 choice labels are unique.
[ ] Stage 6 choice labels are unique.
[ ] No route choice repeats the same generic wording from Milo's draft.
```

## Route Logic QA

```text
[ ] Practical choices increase nixieComposure.
[ ] True choices increase nixieTenderness.
[ ] Risky choices increase nixieAurora.
[ ] True choices grant the correct stage flag.
[ ] Normal Ending can trigger.
[ ] True Ending can trigger.
[ ] Aurora Variant can trigger.
[ ] Route flags are saved and loaded safely.
```

## Gameplay Integration QA

```text
[ ] Nixie choices connect to freeze, ice, speed wave, Sleepy, preview disruption, Fever, or royal pattern mechanics where appropriate.
[ ] No choice creates an unavoidable failure state.
[ ] Risky choices use Oopsies or stronger hazards fairly.
[ ] Nixie passive synergy remains readable: speed/freeze hazards become softer or better warned.
```

---

# 12. Quick Reference — Nixie Choice Labels Only

| Stage | Practical | True / Tenderness | Risky / Aurora |
| ---: | --- | --- | --- |
| 1 | Cool the Frosting Flow | Taste the Rainbow Melt | Freeze the Sprinkle Tide |
| 2 | Lower the Boiler Heat | Cool the Machine Without Stopping It | Skate the Conveyor Loop |
| 3 | Stabilize the Gelato Shelves | Name Every Lost Flavor | Crack the Crystal Scoops |
| 4 | Quiet the Blanket Draft | Hear the Sleeping Room | Slide Through the Sock-Ice |
| 5 | Dim the Neon Frost | Share the Slow Score | Spin the Prize Chill |
| 6 | Soften the Royal Edges | Thaw the Hidden Corner | Crown the Crooked Snow |
