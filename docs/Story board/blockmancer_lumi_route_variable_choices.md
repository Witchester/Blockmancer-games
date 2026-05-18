# Blockmancer Dungeon — Lumi Route Dialogue & Storyboard
## Variable Choice Label Pass — Lumi Draft

**Document purpose:**  
This file prepares **Lumi the Star Witch** as a full character-route example after Milo, Pippa, Zuzu, Nixie, and Bruk.

The goal is to give Lumi her own unmistakable speaking pattern, stage-specific story build-up, variable choice labels, route flags, gameplay consequences, and Normal / True Ending structure.

Lumi should **not** sound like Milo with stars added. She should **not** sound like Nixie with sparkles.  
She is dreamy, observant, gentle, poetic, playful, quietly brave, and more precise than she first appears.

This route keeps the same cheerful Brixonia festival world, six-stage structure, Cascade Gravity gameplay identity, mobile-readable dialogue rules, and happy festival atmosphere.

---

# 1. Lumi Voice Bible

## 1.1 Core Voice

Lumi is the young Star Witch who decorates the Festival of Falling Stars with paper stars, tiny lantern spells, wish-ribbons, and little lights that remember where people laughed.

At first glance, Lumi seems distracted. She follows shiny blocks, gives names to special runes, and talks to lanterns as if they are shy guests. But her route should reveal that Lumi is not careless. She notices patterns other heroes miss: how wishes gather, how frightened creatures hide behind brightness, how a cascade can resemble a constellation falling into place.

Lumi speaks as someone who believes every little light has a name, and every name deserves to be remembered.

At the start of her route, Lumi treats the dungeon like a trail of sparkles calling her deeper.  
By the end of her route, she learns that wonder is not only following light:

> Wonder is holding a lantern steady so someone else can find the way home.

### Lumi speaks with:

- soft star, lantern, wish, constellation, ribbon, shimmer, moon, glow, and night-sky imagery;
- gentle surprise, not loud chaos;
- poetic but short lines that still fit mobile dialogue boxes;
- affectionate names for strange blocks and special patterns;
- a sense that she is listening to invisible music in the light;
- warm courage hidden under dreamy phrasing;
- quiet emotional clarity during True Route scenes.

### Lumi avoids:

- Milo's block-listening vocabulary such as “plink-plonk”;
- Pippa's baking/oven command rhythm;
- Zuzu's technical goblin engineering words;
- Nixie's controlled frost-preservation speech;
- Bruk's oath/table/provision formality;
- vague “sparkly yay” filler;
- meme phrasing, internet sarcasm, or modern slang.

### Example Lumi line style

```text
Lumi: "That little star block is trembling. I think it remembered a wish too loudly."
```

```text
Lumi: "Do not chase every light. Some lights are asking to be carried."
```

```text
Lumi: "A cascade is a constellation deciding, very politely, to fall into place."
```

```text
Lumi: "I named that purple block Maribelle. She has heroic corners."
```

---

## 1.2 Lumi Choice Philosophy

Every Lumi choice should feel like a decision about wonder, attention, and how to use light.

| Route Lean | Meaning | Lumi Behavior |
| --- | --- | --- |
| Practical / Normal | Use star magic to guide the board safely. | Lumi dims glare, marks patterns, steadies previews, and turns sparkle into readable guidance. |
| True / Wishkeeper | Understand the wish, loneliness, or hidden feeling inside the stage's bright chaos. | Lumi names lights, follows quiet constellations, carries lost wishes, and helps the dungeon feel included. |
| Risky / Starlit Gamble | Follow a beautiful but unstable pattern for a bigger reward. | Lumi chases shimmer, draws risky star trails, accepts Oopsies, or turns the board into a festival sky. |

## 1.3 Choice Label Rules

Choice labels should be short, stage-specific, and unmistakably Lumi.

Bad repeated labels:

```text
Make the board safe first
Listen beneath the hazard
Trust the rhythm
```

Better Lumi labels:

```text
Pin the Little Star
Name the Lost Wish
Trace the Sugar Comet
Read the Lantern Queue
Carry Bloxley's Crownlight
```

Each Lumi label should be:

- 2–6 words;
- readable on mobile;
- connected to the stage's current hazard;
- star, lantern, wish, shimmer, constellation, or gentle light themed;
- specific enough that it would not fit Milo, Pippa, Zuzu, Nixie, or Bruk.

---

# 2. Route Variables

## 2.1 Route Scores

```ts
type LumiRouteState = {
  lumiGuidance: number;      // practical light control, Normal route stability
  lumiWishkeeper: number;    // true-route empathy and hidden-wish progress
  lumiStargamble: number;    // risky wonder choices, optional variant rewards
  flags: LumiRouteFlag[];
};
```

## 2.2 Route Flags

```ts
type LumiRouteFlag =
  | "lumi_flag_named_sprinkle_wish"
  | "lumi_flag_read_machine_constellation"
  | "lumi_flag_saved_melting_star_ribbon"
  | "lumi_flag_lit_the_sleeping_window"
  | "lumi_flag_shared_arcade_wishlight"
  | "lumi_flag_carried_bloxley_crownlight";
```

## 2.3 Ending Logic

### Lumi Normal Ending Requirements

```text
Defeat King Bloxley while playing Lumi.
LumiWishkeeper true-route flags fewer than 5.
```

### Lumi True Ending Requirements

```text
Defeat King Bloxley while playing Lumi.
Collect at least 5 of 6 Lumi true-route flags.
Trigger at least 12 cascade combos in the run, or meet the current cascade-mastery unlock threshold if already tracked globally.
Optional bonus: Clear at least one boss phase with a Star Block or Cascade Cheer effect active.
```

### Lumi Starlit Gamble Variant

```text
If lumiStargamble >= 3, add the Meteor Parade variant to either ending.
This should not replace the Normal or True Ending. It adds a celebratory flavor layer.
```

---

# 3. Lumi Route Summary

## 3.1 Character Arc

Lumi begins her route by following the brightest thing in the room. She names every unusual block, treats every star as a possible friend, and assumes that anything shiny must be leading somewhere important.

Across the six stages, she learns that brightness and guidance are not the same. Some lights dazzle. Some lights warn. Some lights are lonely. Some lights are the last little wish a frightened creature remembered to keep.

By the final stage, Lumi can defeat Bloxley with star magic alone. But her True Ending asks for something kinder:

> Instead of breaking the king's crownlight, carry it somewhere it can shine without ruling anyone.

## 3.2 Route Theme

```text
Wonder becomes wisdom when a light is used to guide, not to dazzle.
```

## 3.3 Route Motifs

- Paper stars caught in machinery.
- Wish-ribbons tied to strange blocks.
- Star Blocks that brighten during cascades.
- Lanterns that reveal hidden hazard warnings.
- Arcade lights that mistake scoring for being seen.
- A crooked crownlight that is lonely, not wicked.
- The idea that every festival light was made for someone to find their way back.

---

# 4. Stage Choice Label Overview

| Stage | Practical / Normal | True / Wishkeeper | Risky / Starlit Gamble |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | Pin the Little Star | Name the Sprinkle Wish | Trace the Sugar Comet |
| 2 — Goblin Workshop | Shade the Spark Gear | Read the Machine Constellation | Launch the Bolt Meteor |
| 3 — Frosty Pantry | Warm the Star Ribbon | Save the Melting Wish | Skate the Moonlit Shelf |
| 4 — Pillow Castle | Dim the Dream Lantern | Light the Sleeping Window | Toss the Pillow Moon |
| 5 — Starfall Arcade | Count the Honest Lights | Share the Wishlight | Spin the Meteor Jackpot |
| 6 — Bloxley's Block Palace | Mark the Crooked Crown | Carry the Crownlight | Bend the Royal Constellation |

---

# 5. Scene Template Notes

Each Lumi route scene includes:

```text
- Scene ID
- Trigger
- Location
- Story Beat
- Route Flag Opportunity
- Storyboard Panels
- Pre-Choice Dialogue
- 3 Dialogue Choices
- Post-Choice Battle Bark Pool
- Boss Callback
- Victory Callback
- Route Note
```

Keep each dialogue box short enough for portrait-mobile display.  
Use longer story explanation in narration or codex/storyboard notes, not in the spoken line itself.

---

# 6. Lumi Route Scenes

---

## SCN_LUMI_01 — Sprinkle Sewers: The Sprinkle Wish

**Trigger:** First Lumi route event in Stage 1 after Lumi is unlocked or selected in a later run.  
**Location:** Sprinkle Sewers.  
**Story Beat:** A star-shaped sprinkle block is stuck in a frosting current. It glows each time a frightened slime passes by.  
**Route Flag Opportunity:** `lumi_flag_named_sprinkle_wish` through Choice B.

### Storyboard Panels

1. The sewer channel glitters with rainbow water and drifting frosting bubbles.
2. A tiny star-shaped sprinkle block blinks near a pipe, brighter than the candy around it.
3. Lumi kneels beside the board frame and watches the star's glow pulse in time with nearby Cupcake Slimes.
4. The board preview shows sticky blocks forming near the left wall.
5. A paper star falls from Lumi's sleeve and lands gently on the glowing sprinkle.
6. Choice card appears.

### Pre-Choice Dialogue

```text
Lumi: "Oh. That sprinkle has a wish tucked inside it. A very sticky wish."

Festival Announcer: "The sewer lights have dimmed for a small and meaningful sparkle."

Block-O-Matic 3000: "Observed luminous anomaly: confectionery star fragment emitting emotional glitter above acceptable frosting range."

Lumi: "It is not trying to be difficult. It is trying to be found."
```

### Dialogue Choices

#### A. Practical / Normal

**Choice Label:** `Pin the Little Star`

**Player Line:**

```text
Lumi: "I will hold its light steady first. Wishes are easier to help when they stop sliding."
```

**NPC Response:**

```text
Cupcake Slime: "Gloop?"

Lumi: "Yes, little frosting moon. You may stand behind me."
```

**Narration:**  
Lumi pins the star sprinkle with a soft lantern mark. The sticky current slows, and the board becomes easier to read.

**Gameplay Result:**  
Remove or soften 1–2 sticky blocks. Reveal the next incoming sticky hazard one piece earlier.

**Route Result:**  
`+1 lumiGuidance`; leans toward Normal Ending.

#### B. True / Wishkeeper

**Choice Label:** `Name the Sprinkle Wish`

**Player Line:**

```text
Lumi: "A nameless light gets lonely. I will call this one Sweetlittle Star."
```

**NPC Response:**

```text
Cupcake Slime: "Glooop..."

Lumi: "There. It was saving a wish for the slimes who lost their cake table."
```

**Narration:**  
The star sprinkle brightens without flaring. A small hidden wish appears: the slimes are not only stealing cupcakes; they are trying to rebuild a birthday table the machine washed away.

**Gameplay Result:**  
Create 1 friendly `block_star` after the next cascade. Cupcake Slime sticky effects are slightly reduced for this room.

**Grant Flag:**  
`lumi_flag_named_sprinkle_wish`

**Route Result:**  
`+1 lumiWishkeeper`; contributes to True Ending.

#### C. Risky / Starlit Gamble

**Choice Label:** `Trace the Sugar Comet`

**Player Line:**

```text
Lumi: "If it wants to fly, I will draw the sky quickly. Everyone duck, but beautifully."
```

**NPC Response:**

```text
Festival Announcer: "Audience advisory: the comet is charming, sticky, and not fully scheduled."
```

**Narration:**  
Lumi draws a comet path through the frosting channel. The star sprinkle streaks across the board, clearing a bright trail and shaking loose extra candy blocks.

**Gameplay Result:**  
Gain a rare candy/star reward or bonus mana. 25% chance to add `oops_too_much_confetti` or spawn 1 sticky block after battle.

**Route Result:**  
`+1 lumiStargamble`; may open a bonus reward or altered boss bark.

### Post-Choice Battle Bark Pool

```text
Lumi: "Left column. The little star wants room to breathe."
Lumi: "That cascade looked like a spoonful of sky."
Lumi: "Careful. Bright is not always safe, but it is almost always honest."
Block-O-Matic 3000: "Luminous route response archived. Glitter containment recalibrated."
Festival Announcer: "Choice recorded. Please applaud in twinkles, not thunder."
```

### Boss Callback — Cupcake Slime King

```text
Cupcake Slime King: "Gloooop! Mine cake! Mine stars!"

Lumi: "You may keep a star, Your Frostiness. But it must not be used to trap everyone else's wishes."
```

### Victory Callback

```text
Lumi: "Sweetlittle Star is quieter now. Not dimmer. Just less afraid."
```

### Route Note

Store `lumi_flag_named_sprinkle_wish` if Choice B was selected.  
Continue to Stage 2 route beat.

---

## SCN_LUMI_02 — Goblin Workshop: The Machine Constellation

**Trigger:** First Lumi route event in Stage 2 while playing Lumi.  
**Location:** Goblin Workshop.  
**Story Beat:** Sparks from goblin machines form repeating star patterns. Lumi realizes the machines are not random; they are trying to spell an apology in light.  
**Route Flag Opportunity:** `lumi_flag_read_machine_constellation` through Choice B.

### Storyboard Panels

1. The party enters a workshop balcony lined with brass gears and flickering bulbs.
2. Sparks leap between conveyor belts, forming little constellations before falling into junk pieces.
3. A machine coughs out a star-shaped bolt, then hides behind steam.
4. Lumi tilts her head, tracing the spark pattern with one finger.
5. The board preview shakes with junk blocks and bomb blocks waiting in the queue.
6. Choice card appears.

### Pre-Choice Dialogue

```text
Lumi: "Those sparks are not misbehaving. They are writing in very nervous stars."

Block-O-Matic 3000: "Observed complication: workshop lumens have arranged themselves into an apology diagram with insufficient punctuation."

Zuzu: "For legal clarity, machines cannot apologize unless their warranty allows emotional subroutines."

Lumi: "Then I will read the parts too shy for the warranty."
```

### Dialogue Choices

#### A. Practical / Normal

**Choice Label:** `Shade the Spark Gear`

**Player Line:**

```text
Lumi: "First, a little shade. Sparks shout when no one gives them a quiet wall."
```

**NPC Response:**

```text
Zuzu: "Shade panel deployed. Emotional shouting reduced by, uh, a visible amount."
```

**Narration:**  
Lumi covers the brightest gear with a paper moon charm. The sparks become readable, and the board shake softens.

**Gameplay Result:**  
Reduce board shake for this room. Delay the next junk queue by 1 piece.

**Route Result:**  
`+1 lumiGuidance`; leans toward Normal Ending.

#### B. True / Wishkeeper

**Choice Label:** `Read the Machine Constellation`

**Player Line:**

```text
Lumi: "This one says, 'I dropped the bolts because everyone was clapping for the fireworks.' Poor little gear."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Translation accepted. Machine embarrassment detected. Please do not make direct eye contact with Gear Unit Three."
```

**Narration:**  
Lumi reads the spark pattern as a constellation of mistakes. The workshop machines are not trying to ruin the festival; they are competing to be useful and crashing into one another.

**Gameplay Result:**  
For this room, the first bomb block spawned by a machine becomes a friendly `block_star` if cleared in a cascade.

**Grant Flag:**  
`lumi_flag_read_machine_constellation`

**Route Result:**  
`+1 lumiWishkeeper`; contributes to True Ending.

#### C. Risky / Starlit Gamble

**Choice Label:** `Launch the Bolt Meteor`

**Player Line:**

```text
Lumi: "If the sparks are already falling, let us give them a graceful orbit."
```

**NPC Response:**

```text
Zuzu: "Graceful orbit is not a standard safety category, but I am deeply interested."
```

**Narration:**  
Lumi turns loose sparks into a tiny meteor shower. The board gains star power, but the workshop gets a little too enthusiastic.

**Gameplay Result:**  
Add 2 `block_star` opportunities or bonus cascade damage. 25% chance to queue extra junk after the reward.

**Route Result:**  
`+1 lumiStargamble`; may alter Prototype No. 7 boss dialogue.

### Post-Choice Battle Bark Pool

```text
Lumi: "That gear is blinking in threes. It wants us to wait one piece."
Lumi: "The sparks are not stars yet, but they are practicing."
Lumi: "A messy sky can still have a map."
Block-O-Matic 3000: "Constellation parsing improved. Workshop shame levels reduced."
```

### Boss Callback — Prototype No. 7

```text
Prototype No. 7: "CONFIDENCE LEVEL: UNREASONABLE."

Lumi: "Then I will draw you a softer confidence, with fewer flying bolts."
```

### Victory Callback

```text
Lumi: "The machines blinked goodbye. One of them tried to wink and dropped a spring."
```

### Route Note

Store `lumi_flag_read_machine_constellation` if Choice B was selected.  
Continue to Stage 3 route beat.

---

## SCN_LUMI_03 — Frosty Pantry: The Melting Wish

**Trigger:** First Lumi route event in Stage 3 while playing Lumi.  
**Location:** Frosty Pantry.  
**Story Beat:** A wish-ribbon frozen inside a gelato shelf begins to melt. If rushed, it shatters; if held too long, it fades.  
**Route Flag Opportunity:** `lumi_flag_saved_melting_star_ribbon` through Choice B.

### Storyboard Panels

1. The pantry glows with blue ice and rainbow gelato jars.
2. A paper star ribbon floats inside a block of clear ice, moving like a slow candle flame.
3. Frost warning symbols flicker over the active piece.
4. Lumi presses both palms to the glass and speaks softly to the ribbon.
5. Snowcone Sprites gather, whispering in icy little chimes.
6. Choice card appears.

### Pre-Choice Dialogue

```text
Lumi: "This ribbon is melting from the inside. That means the wish is trying very hard to stay warm."

Nixie: "Do not rush it. Frozen things remember pressure."

Block-O-Matic 3000: "Thermal note: wish-ribbon integrity is currently poetic but unstable."

Lumi: "Then we will be careful enough for both science and poetry."
```

### Dialogue Choices

#### A. Practical / Normal

**Choice Label:** `Warm the Star Ribbon`

**Player Line:**

```text
Lumi: "A small lantern. Not enough to melt it. Just enough to keep it company."
```

**NPC Response:**

```text
Nixie: "Good. Warmth with manners."
```

**Narration:**  
Lumi sets a tiny lantern beside the frozen ribbon. The ice stops cracking, and freeze warnings become easier to anticipate.

**Gameplay Result:**  
Extend the next freeze warning by 1 piece or reduce active freeze duration once.

**Route Result:**  
`+1 lumiGuidance`; leans toward Normal Ending.

#### B. True / Wishkeeper

**Choice Label:** `Save the Melting Wish`

**Player Line:**

```text
Lumi: "Little ribbon, I will not pull. I will wait until you remember which way is out."
```

**NPC Response:**

```text
Snowcone Sprite: "Ting..."

Lumi: "Yes. It was tied to the first lantern lit for the festival tonight. It did not want to miss the sky."
```

**Narration:**  
The ribbon unwinds by itself, revealing a wish from a child who wanted the first lantern to float safely. Lumi preserves it without breaking the ice around it.

**Gameplay Result:**  
Create a temporary lantern marker: the next safe cascade column is highlighted once. Star block cascade bonus slightly increases for this room.

**Grant Flag:**  
`lumi_flag_saved_melting_star_ribbon`

**Route Result:**  
`+1 lumiWishkeeper`; contributes to True Ending.

#### C. Risky / Starlit Gamble

**Choice Label:** `Skate the Moonlit Shelf`

**Player Line:**

```text
Lumi: "The shelf is slippery, the moon is watching, and I have made several questionable promises to gravity."
```

**NPC Response:**

```text
Nixie: "I object calmly. I am also watching."
```

**Narration:**  
Lumi skates a quick crescent across the pantry shelf, drawing a shining route through the ice. The board rewards speed and precision.

**Gameplay Result:**  
Gain bonus mana and a cascade boost if the player clears a line within the next 2 pieces. 25% chance to trigger a short speed wave afterward.

**Route Result:**  
`+1 lumiStargamble`; may unlock a bonus bark.

### Post-Choice Battle Bark Pool

```text
Lumi: "The ice is singing slowly. We should answer slowly too."
Lumi: "That block is a frozen lantern. It wants to fall, but politely."
Lumi: "Star light looks different through ice. Quieter, but not smaller."
Block-O-Matic 3000: "Wish-ribbon preservation successful within acceptable whimsy range."
```

### Boss Callback — Gelato Golem

```text
Gelato Golem: "Cold keeps shape. Shape keeps order."

Lumi: "And warmth keeps wishes from forgetting their names. We need both."
```

### Victory Callback

```text
Lumi: "The ribbon is safe. It says the first lantern may still rise tonight."
```

### Route Note

Store `lumi_flag_saved_melting_star_ribbon` if Choice B was selected.  
Continue to Stage 4 route beat.

---

## SCN_LUMI_04 — Pillow Castle: The Sleeping Window

**Trigger:** First Lumi route event in Stage 4 while playing Lumi.  
**Location:** Pillow Castle.  
**Story Beat:** A window made of folded blankets reflects a night sky that is not outside. Lumi realizes the Pillow Castle is dreaming of the festival lanterns.  
**Route Flag Opportunity:** `lumi_flag_lit_the_sleeping_window` through Choice B.

### Storyboard Panels

1. The party moves through halls of stacked pillows and sleepy toy soldiers.
2. A blanket window glows with a tiny false night sky.
3. Blanket Ghosts drift near the board, yawning out Sleepy status wisps.
4. Lumi lifts a lantern and the window reflection answers with one dim star.
5. The board shows soft blocks and shielded enemies preparing a lullaby trap.
6. Choice card appears.

### Pre-Choice Dialogue

```text
Lumi: "This castle is asleep, but the window is awake. That feels important."

Bruk: "A guard post with its eyes open during nap hour deserves respect."

Block-O-Matic 3000: "Dream-surface detected. Please avoid excessive trumpet, bell, or meteor activity near the pillow infrastructure."

Lumi: "I will use a quiet light. The kind that does not wake the dream, only comforts it."
```

### Dialogue Choices

#### A. Practical / Normal

**Choice Label:** `Dim the Dream Lantern`

**Player Line:**

```text
Lumi: "Too much glow will stir the blankets. I will shade the lantern with one sleepy hand."
```

**NPC Response:**

```text
Blanket Ghost: "Hoooo... soft..."
```

**Narration:**  
Lumi dims her lantern until the blanket window stops fluttering. Sleepy wisps slow down and the board remains stable.

**Gameplay Result:**  
Reduce or delay the next Sleepy effect. Gain a small shield or safe soft-block conversion.

**Route Result:**  
`+1 lumiGuidance`; leans toward Normal Ending.

#### B. True / Wishkeeper

**Choice Label:** `Light the Sleeping Window`

**Player Line:**

```text
Lumi: "Window, I brought one festival star. You may dream of the rest until we return."
```

**NPC Response:**

```text
Blanket Ghost: "The lanterns... outside..."

Lumi: "Yes. The castle wanted to see them without waking everyone."
```

**Narration:**  
The blanket window brightens with a gentle reflected festival sky. The ghosts settle, no longer trying to pull every visitor into the dream.

**Gameplay Result:**  
The first Sleepy hazard in this room becomes a small heal or shield instead of a penalty if countered with a cascade.

**Grant Flag:**  
`lumi_flag_lit_the_sleeping_window`

**Route Result:**  
`+1 lumiWishkeeper`; contributes to True Ending.

#### C. Risky / Starlit Gamble

**Choice Label:** `Toss the Pillow Moon`

**Player Line:**

```text
Lumi: "That round cushion is clearly a moon. It has been waiting for dramatic employment."
```

**NPC Response:**

```text
Bruk: "I approve only if the moon lands respectfully."
```

**Narration:**  
Lumi tosses a moon-shaped pillow into the dream window. The room erupts into a soft, bouncing starfield.

**Gameplay Result:**  
Gain a large cascade or Fever boost. 25% chance to add a temporary soft-block hazard or `oops_slippery_buttons`.

**Route Result:**  
`+1 lumiStargamble`; may alter Sir Snore-a-Lot dialogue.

### Post-Choice Battle Bark Pool

```text
Lumi: "The pillows are dreaming in square shapes. How tidy of them."
Lumi: "Do not startle the soft blocks. They are very proud of being soft."
Lumi: "A sleeping room still needs a star in the window."
Block-O-Matic 3000: "Dream-window interaction logged. Pillow morale: improved."
```

### Boss Callback — Sir Snore-a-Lot

```text
Sir Snore-a-Lot: "Zzz... defend the nap... zzz..."

Lumi: "We will defend the nap, Sir Knight. We only need to borrow a path through it."
```

### Victory Callback

```text
Lumi: "The window is dreaming of lanterns now. I think the castle will sleep better."
```

### Route Note

Store `lumi_flag_lit_the_sleeping_window` if Choice B was selected.  
Continue to Stage 5 route beat.

---

## SCN_LUMI_05 — Starfall Arcade: The Wishlight Score

**Trigger:** First Lumi route event in Stage 5 while playing Lumi.  
**Location:** Starfall Arcade.  
**Story Beat:** The arcade score lights are not only counting points. They are gathering tiny wishes from players who wanted to be noticed.  
**Route Flag Opportunity:** `lumi_flag_shared_arcade_wishlight` through Choice B.

### Storyboard Panels

1. Neon machines flash across prize counters and combo signs.
2. Score lights burst into little stars whenever a combo lands.
3. Lumi watches the high score board; some names shine brighter than others, then fade.
4. Token Sprites carry tiny wishlights into a prize cabinet.
5. The board preview shows Fever and cascade prompts pulsing rapidly.
6. Choice card appears.

### Pre-Choice Dialogue

```text
Lumi: "The score lights are not only counting. They are trying to remember everyone who played."

Ticket Imp: "Remembering costs three tickets, unless emotionally discounted."

Block-O-Matic 3000: "Arcade wishlight compression exceeds recommended nostalgia capacity."

Lumi: "Then we should make room. A wish should not have to win first place to stay bright."
```

### Dialogue Choices

#### A. Practical / Normal

**Choice Label:** `Count the Honest Lights`

**Player Line:**

```text
Lumi: "I will count the lights that are truly helping. The noisy ones may blink somewhere else."
```

**NPC Response:**

```text
Ticket Imp: "Honest counting? In an arcade? Bold."
```

**Narration:**  
Lumi separates helpful score lights from distracting flashes. The Fever meter becomes easier to read.

**Gameplay Result:**  
Reduce preview flashing. Gain a clearer Fever/cascade bonus indicator for this room.

**Route Result:**  
`+1 lumiGuidance`; leans toward Normal Ending.

#### B. True / Wishkeeper

**Choice Label:** `Share the Wishlight`

**Player Line:**

```text
Lumi: "First place may keep its crown. But every small wish gets a lantern."
```

**NPC Response:**

```text
Combo Gremlin: "Even bad scores?"

Lumi: "Especially the brave little bad scores. They tried."
```

**Narration:**  
Lumi opens the prize cabinet and releases the stored wishlights. The arcade signs soften from competition into celebration.

**Gameplay Result:**  
Next cascade grants extra Fever and creates 1 `block_star`. High Score Hydra's first no-cascade punishment is weakened.

**Grant Flag:**  
`lumi_flag_shared_arcade_wishlight`

**Route Result:**  
`+1 lumiWishkeeper`; contributes to True Ending.

#### C. Risky / Starlit Gamble

**Choice Label:** `Spin the Meteor Jackpot`

**Player Line:**

```text
Lumi: "The jackpot wheel has a tiny galaxy trapped in it. I should probably not spin it. I will spin it gently."
```

**NPC Response:**

```text
Ticket Imp: "Gently is not a recognized jackpot speed, but carry on."
```

**Narration:**  
Lumi spins the jackpot wheel until neon meteors rain across the board. The arcade cheers, then immediately asks for another combo.

**Gameplay Result:**  
Gain a rare arcade/star reward and a large Fever boost. 25% chance to add `oops_too_much_confetti` or a stricter combo objective.

**Route Result:**  
`+1 lumiStargamble`; may add Meteor Parade variant.

### Post-Choice Battle Bark Pool

```text
Lumi: "The score is not the wish. The wish is why the score glows."
Lumi: "Cascade now. The lights are leaning forward."
Lumi: "That star block wants a friend. Perhaps two friends. Perhaps a parade."
Block-O-Matic 3000: "Wishlight overflow reduced. Arcade smugness remains moderate."
```

### Boss Callback — High Score Hydra

```text
High Score Hydra: "Only the highest score shines!"

Lumi: "No. The highest score shines loudly. That is different."
```

### Victory Callback

```text
Lumi: "The arcade remembers more names now. Some are spelled badly, but very brightly."
```

### Route Note

Store `lumi_flag_shared_arcade_wishlight` if Choice B was selected.  
Continue to Stage 6 route beat.

---

## SCN_LUMI_06 — Bloxley's Block Palace: The Crownlight

**Trigger:** Final Lumi route event before or during Stage 6 final route branch.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** King Bloxley's crown contains a crooked star-light from the original festival mascot display. It is not evil; it is lonely and overprotected.  
**Route Flag Opportunity:** `lumi_flag_carried_bloxley_crownlight` through Choice B.

### Storyboard Panels

1. Bloxley's palace glows with square banners, royal blocks, and confetti cannons.
2. The crown above the throne shines with a small crooked light.
3. Every time Bloxley demands symmetry, the crownlight flickers harder.
4. Lumi sees a tiny paper-star shadow trapped beneath the crown's square frame.
5. Royal blocks form a pattern around the board.
6. Choice card appears.

### Pre-Choice Dialogue

```text
King Bloxley: "Behold! My crown shines with perfect rectangular authority!"

Lumi: "Your crown is bright, Your Majesty. But the little light inside it keeps looking for the exit."

King Bloxley: "Preposterous. Royal lights do not wander. They illuminate obedience."

Block-O-Matic 3000: "Observed crownlight status: technically regal, emotionally overcompressed."

Lumi: "Then I will make it less alone. Even a crown should have a window."
```

### Dialogue Choices

#### A. Practical / Normal

**Choice Label:** `Mark the Crooked Crown`

**Player Line:**

```text
Lumi: "I will mark the crooked corner. Once we can see it, we can stop tripping over its shadow."
```

**NPC Response:**

```text
King Bloxley: "My crown has no crooked corners. It has character under royal review."
```

**Narration:**  
Lumi marks the unstable crownlight with a lantern seal. Royal patterns become easier to predict, but the deeper loneliness remains unresolved.

**Gameplay Result:**  
Reveal the next royal pattern warning early. Reduce the first royal block penalty.

**Route Result:**  
`+1 lumiGuidance`; leans toward Normal Ending.

#### B. True / Wishkeeper

**Choice Label:** `Carry the Crownlight`

**Player Line:**

```text
Lumi: "Little crownlight, you do not have to rule the room to be seen. I can carry you to the festival sky."
```

**NPC Response:**

```text
King Bloxley: "Carry it? Away from the throne? But then... what will prove I matter?"

Lumi: "Being invited. Being remembered. Being allowed to shine without ordering anyone into corners."
```

**Narration:**  
Lumi opens her lantern and lets the crownlight step into it. The palace does not collapse. It exhales. Bloxley stares at the empty crown frame as if seeing his own fear for the first time.

**Gameplay Result:**  
Royal block patterns become less punishing. During the final boss, the first `block_star` cascade weakens Bloxley's symmetry demand.

**Grant Flag:**  
`lumi_flag_carried_bloxley_crownlight`

**Route Result:**  
`+1 lumiWishkeeper`; contributes to True Ending.

#### C. Risky / Starlit Gamble

**Choice Label:** `Bend the Royal Constellation`

**Player Line:**

```text
Lumi: "Squares are lovely, but tonight the sky would like to try a curve."
```

**NPC Response:**

```text
King Bloxley: "A curve? In my palace? Guards, fetch the geometry cushion!"
```

**Narration:**  
Lumi draws a looping constellation through the royal blocks. The palace trembles, then shines in dazzling asymmetry.

**Gameplay Result:**  
Gain a powerful final-stage cascade/star boost. 25% chance to trigger a stricter royal pattern or `oops_square_only` before the boss.

**Route Result:**  
`+1 lumiStargamble`; may add Meteor Parade variant to ending.

### Post-Choice Battle Bark Pool

```text
Lumi: "The crownlight is watching the board. Let us show it a kind pattern."
Lumi: "Royal blocks are only lonely stars with too many rules."
Lumi: "The palace wants symmetry. The festival wants welcome. We can draw both, perhaps."
Block-O-Matic 3000: "Crownlight migration logged. Palace rigidity reduced by one heartfelt margin."
```

### Boss Callback — King Bloxley

```text
King Bloxley: "You cannot rearrange royalty with lanterns!"

Lumi: "No. But I can help royalty see where everyone else is standing."
```

### Victory Callback

```text
Lumi: "The crownlight is in my lantern now. It is still bright. Maybe brighter."
```

### Route Note

Store `lumi_flag_carried_bloxley_crownlight` if Choice B was selected.  
Proceed to Lumi ending evaluation.

---

# 7. Lumi Final Boss Dialogue

## 7.1 Standard Final Confrontation

```text
King Bloxley: "Star Witch! Your lights wander. Your blocks tumble. Your constellations refuse proper alignment."

Lumi: "They are not refusing. They are finding each other."

King Bloxley: "A kingdom cannot be built on wandering lights!"

Lumi: "No. But a festival can."
```

## 7.2 True Route Final Confrontation

Requires at least 5 Lumi Wishkeeper flags.

```text
King Bloxley: "Why does the crown feel quiet? Why does the throne look so large?"

Lumi: "Because the light was never proof that you mattered. It was only a lantern you were holding too tightly."

King Bloxley: "If I let it shine elsewhere, will anyone still look at me?"

Lumi: "Yes. But they will look because you are there, not because you command the room to face you."

King Bloxley: "That sounds... dangerously unsquare."

Lumi: "Most invitations are."
```

## 7.3 Starlit Gamble Variant Boss Bark

Requires `lumiStargamble >= 3`.

```text
Festival Announcer: "Meteor Parade condition detected. Please remain calm while the sky rehearses indoors."

King Bloxley: "No meteors in the throne room! Meteors do not respect carpet geometry!"

Lumi: "They respect entrances. Watch this one."
```

---

# 8. Lumi Endings

---

## 8.1 Lumi Normal Ending — The Lantern Star

**Requirement:** Defeat King Bloxley with Lumi, but fewer than 5 true-route flags.

### Storyboard Panels

1. The final royal blocks dissolve into quiet stardust.
2. Lumi gathers fallen paper stars from the palace floor.
3. The festival sky reopens, bright but slightly uneven.
4. Lumi hangs one new lantern above the Star Lantern Stage.
5. The crowd cheers as small star blocks twinkle during the final parade.

### Ending Text

```text
The palace lights settled.
The arcade signs stopped arguing with the moon.
The paper stars were repaired, one careful fold at a time.

Lumi returned to the Star Lantern Stage with a pocket full of rescued shimmer
and a list of names for every special block she had met.

Some wishes were still missing.
Some lights still flickered at the edge of the square palace.

But when the final lantern rose,
Lumi smiled.

"Not every star comes home at once," she said.
"Some need another night to find the path."
```

### Unlock / Reward Suggestion

```text
Unlock cosmetic: Lantern Star Trail.
Unlock relic hint: Star Cookie appears slightly more often in future runs.
```

---

## 8.2 Lumi True Ending — The Festival Sky Remembers

**Requirement:** Defeat King Bloxley with Lumi and collect at least 5 of 6 Lumi true-route flags.

### Storyboard Panels

1. Lumi opens her lantern and releases every wishlight gathered across the stages.
2. The Sprinkle Sewers, Workshop, Pantry, Pillow Castle, Arcade, and Palace each send one small light upward.
3. Bloxley's crownlight joins them, crooked but bright.
4. The Block-O-Matic 3000 projects a safe festival dungeon map shaped like a constellation.
5. The townspeople write wishes on paper stars and hang them without needing to win, rule, or be perfect.
6. Lumi watches from the Star Lantern Stage as the sky becomes a shared map home.

### Ending Text

```text
Lumi did not put the crownlight back on the throne.

She carried it to the Star Lantern Stage,
where the smallest children could see it without bowing,
and the shyest monsters could stand beneath it without being counted wrong.

One by one, the rescued wishlights rose.

A sprinkle wish.
A machine apology.
A melting ribbon.
A sleeping window.
An arcade name that had almost faded.
A crooked crownlight, no longer trapped in royal corners.

The lights did not form a perfect square.

They formed a path.

Professor Poplin sniffled into the manual.
The Block-O-Matic 3000 printed a note labeled:

FESTIVAL SKY CONFIGURATION: ACCEPTABLY WONDERFUL.

Lumi tied the final paper star to the lantern rail.

"There," she whispered.
"Now everyone has a way back."
```

### Unlock / Reward Suggestion

```text
Unlock Lumi True Ending record.
Unlock Star Lantern Stage hub upgrade.
Unlock passive cosmetic: Wishlight Cascade VFX.
Future runs: first Stage 5 arcade event has one extra friendly choice.
```

---

## 8.3 Starlit Gamble Variant — Meteor Parade

**Requirement:** `lumiStargamble >= 3`.

This variant can attach to either Normal or True Ending.

### Variant Text

```text
As the festival lanterns rose, Lumi noticed one meteor-shaped sparkle lagging behind.

"Oh," she said. "That one wants an entrance."

The sparkle shot across the sky,
looped around the jelly fountain,
bounced once off Bloxley's empty crown frame,
and burst into harmless confetti above the snack table.

The Festival Announcer paused for exactly one dignified second.

"Meteor Parade approved," they declared.
"Future meteors must register at the lantern booth."
```

### Gameplay / Reward Suggestion

```text
Unlock optional cosmetic: Meteor Parade Clear VFX.
Add rare room event: evt_meteor_wish_booth.
```

---

# 9. Lumi Hub Dialogue

Use these as hub barks after route progress.

## After Stage 1 Route Scene

```text
Lumi: "I named the sprinkle star Sweetlittle Star. It has requested a shorter name, but I am negotiating."
```

## After Stage 2 Route Scene

```text
Lumi: "One workshop gear blinked an apology at me. I blinked back. We are corresponding now."
```

## After Stage 3 Route Scene

```text
Lumi: "The frozen ribbon is safe. It says the lantern launch should begin with a slower song."
```

## After Stage 4 Route Scene

```text
Lumi: "The Pillow Castle dreams of festival lights. Please wave gently if you pass a blanket window."
```

## After Stage 5 Route Scene

```text
Lumi: "The arcade remembered the low scores too. They twinkle with excellent bravery."
```

## Before Final Stage

```text
Lumi: "Bloxley's crownlight is bright, but not happy. I know that kind of glow."
```

## After Normal Ending

```text
Lumi: "Some stars came home. Some are still wandering. That is not failure. That is tomorrow's map."
```

## After True Ending

```text
Lumi: "The sky remembers everyone now. Even the crooked lights. Especially those."
```

---

# 10. Lumi Battle Bark Pools

## General Battle Start

```text
Lumi: "Let us draw a small sky on the board."
Lumi: "That block has a brave little glow. I trust it. Mostly."
Lumi: "If the stars fall, we will help them land kindly."
```

## Cascade Trigger

```text
Lumi: "There. A constellation found its shape."
Lumi: "The stars agreed with us. How generous."
Lumi: "Again, if the sky is willing."
```

## Star Block Appears

```text
Lumi: "Oh! A special one. I shall name it after victory."
Lumi: "Do you see that corner? Heroic. Very heroic."
Lumi: "That star block is waiting for a chorus."
```

## Low HP / Danger

```text
Lumi: "Our lantern is flickering. Hold it with both hands."
Lumi: "Do not panic. Even small lights know how to stay."
Lumi: "We need one kind pattern. Just one."
```

## Victory

```text
Lumi: "The room is brighter, but softer. That is usually a good sign."
Lumi: "I think the board is smiling in angles."
Lumi: "Another little light safely placed."
```

---

# 11. Implementation Data Draft

This section is not final JSON, but it gives the data shape for implementation.

```json
{
  "routeId": "route_lumi_star_witch",
  "heroId": "hero_lumi_star_witch",
  "routeScores": ["lumiGuidance", "lumiWishkeeper", "lumiStargamble"],
  "trueEndingRequiredFlags": 5,
  "variantScore": {
    "scoreId": "lumiStargamble",
    "threshold": 3,
    "variantId": "ending_variant_lumi_meteor_parade"
  },
  "scenes": [
    {
      "sceneId": "SCN_LUMI_01",
      "stageId": "stage_1_sprinkle_sewers",
      "trueFlag": "lumi_flag_named_sprinkle_wish",
      "choices": [
        {
          "choiceId": "lumi_01_a",
          "label": "Pin the Little Star",
          "routeScore": "lumiGuidance",
          "scoreDelta": 1
        },
        {
          "choiceId": "lumi_01_b",
          "label": "Name the Sprinkle Wish",
          "routeScore": "lumiWishkeeper",
          "scoreDelta": 1,
          "grantFlag": "lumi_flag_named_sprinkle_wish"
        },
        {
          "choiceId": "lumi_01_c",
          "label": "Trace the Sugar Comet",
          "routeScore": "lumiStargamble",
          "scoreDelta": 1,
          "risk": "oops_or_hazard_25_percent"
        }
      ]
    },
    {
      "sceneId": "SCN_LUMI_02",
      "stageId": "stage_2_goblin_workshop",
      "trueFlag": "lumi_flag_read_machine_constellation"
    },
    {
      "sceneId": "SCN_LUMI_03",
      "stageId": "stage_3_frosty_pantry",
      "trueFlag": "lumi_flag_saved_melting_star_ribbon"
    },
    {
      "sceneId": "SCN_LUMI_04",
      "stageId": "stage_4_pillow_castle",
      "trueFlag": "lumi_flag_lit_the_sleeping_window"
    },
    {
      "sceneId": "SCN_LUMI_05",
      "stageId": "stage_5_starfall_arcade",
      "trueFlag": "lumi_flag_shared_arcade_wishlight"
    },
    {
      "sceneId": "SCN_LUMI_06",
      "stageId": "stage_6_bloxley_block_palace",
      "trueFlag": "lumi_flag_carried_bloxley_crownlight"
    }
  ]
}
```

---

# 12. Codex Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Add Lumi's character route dialogue and variable choice labels to the story/dialogue system.

Input document:
- blockmancer_lumi_route_variable_choices.md

Goal:
Implement Lumi's route as a data-driven character story route with 6 stage-specific scenes, unique choice labels, route flags, route score tracking, battle barks, boss callbacks, and Normal / True Ending logic.

Lumi voice direction:
- Dreamy star witch.
- Gentle, poetic, whimsical, but still concise.
- Uses lantern, star, wish, constellation, shimmer, ribbon, moon, glow, and sky imagery.
- Avoids sounding like Milo, Pippa, Zuzu, Nixie, or Bruk.

Required scenes:
- SCN_LUMI_01 — Sprinkle Sewers: The Sprinkle Wish
- SCN_LUMI_02 — Goblin Workshop: The Machine Constellation
- SCN_LUMI_03 — Frosty Pantry: The Melting Wish
- SCN_LUMI_04 — Pillow Castle: The Sleeping Window
- SCN_LUMI_05 — Starfall Arcade: The Wishlight Score
- SCN_LUMI_06 — Bloxley's Block Palace: The Crownlight

Route scores:
- lumiGuidance
- lumiWishkeeper
- lumiStargamble

True-route flags:
- lumi_flag_named_sprinkle_wish
- lumi_flag_read_machine_constellation
- lumi_flag_saved_melting_star_ribbon
- lumi_flag_lit_the_sleeping_window
- lumi_flag_shared_arcade_wishlight
- lumi_flag_carried_bloxley_crownlight

Ending rules:
- Normal Ending: defeat King Bloxley with fewer than 5 Lumi true-route flags.
- True Ending: defeat King Bloxley with at least 5 of 6 Lumi true-route flags.
- Meteor Parade variant: lumiStargamble >= 3.

Implementation requirements:
- Keep dialogue data-driven.
- Keep choice labels short and mobile-readable.
- Store route flags in save/meta or current run route state as appropriate.
- Do not hardcode route-specific logic inside unrelated systems.
- If story route system does not exist yet, create the smallest safe data structure and renderer hooks.
- Preserve Cascade Gravity and existing gameplay behavior.
- Missing dialogue should fall back safely.

Acceptance criteria:
- Lumi route scene can appear once per stage while playing Lumi.
- Each stage has unique labels and dialogue.
- Choice A increments lumiGuidance.
- Choice B increments lumiWishkeeper and grants the stage true-route flag.
- Choice C increments lumiStargamble and applies the configured risk/reward.
- Boss callbacks can appear when relevant.
- Normal, True, and Meteor Parade variant ending logic can be evaluated.
- npm run build passes.
- npm run validate:content passes if content validation exists.

Finish response with:
Summary / Files changed / Dialogue data added / Route flags added / Commands run / How to test / Known limitations.
```

---

# 13. QA Checklist

## Dialogue Voice QA

```text
[ ] Lumi does not sound like Milo.
[ ] Lumi does not sound like Pippa.
[ ] Lumi does not sound like Zuzu.
[ ] Lumi does not sound like Nixie.
[ ] Lumi does not sound like Bruk.
[ ] Lumi uses star/lantern/wish/constellation language naturally.
[ ] Dialogue remains readable on mobile.
[ ] No modern meme phrasing or Reddit-style jokes.
```

## Route Choice QA

```text
[ ] Stage 1 choice labels are unique to Sprinkle Sewers.
[ ] Stage 2 choice labels are unique to Goblin Workshop.
[ ] Stage 3 choice labels are unique to Frosty Pantry.
[ ] Stage 4 choice labels are unique to Pillow Castle.
[ ] Stage 5 choice labels are unique to Starfall Arcade.
[ ] Stage 6 choice labels are unique to Bloxley's Block Palace.
[ ] Choice A always gives practical/Normal progress.
[ ] Choice B always gives true-route flag progress.
[ ] Choice C always gives risky/variant progress.
```

## Ending QA

```text
[ ] Normal Ending triggers with fewer than 5 true-route flags.
[ ] True Ending triggers with at least 5 true-route flags.
[ ] Meteor Parade variant appears when lumiStargamble >= 3.
[ ] True Ending mentions the crownlight, wishlights, and Star Lantern Stage.
[ ] Ending does not become dark, tragic, or overly serious.
```

## Gameplay Integration QA

```text
[ ] Lumi route rewards support cascade/star gameplay.
[ ] Stage 5 route scene supports Fever/cascade mastery.
[ ] Stage 6 route scene supports royal pattern and star block counterplay.
[ ] Star block rewards do not break balance.
[ ] Risky choices can add Oopsies or hazards without soft-locking.
```

---

# 14. Next Character Work

All six main hero route drafts are now prepared:

```text
Milo — listener / block-language / gentle structure.
Pippa — baker / fire / hearth warmth.
Zuzu — goblin engineer / prototypes / accountability.
Nixie — frostbinder / preservation / gentle thaw.
Bruk — snack knight / oath / hospitality.
Lumi — star witch / wishes / guiding light.
```

Recommended next file:

```text
blockmancer_character_routes_master_index.md
```

Purpose:
- combine all six route overviews;
- standardize route score naming;
- verify choice label uniqueness across all characters;
- define global Normal / True Ending selection priority;
- prepare final implementation import list.
