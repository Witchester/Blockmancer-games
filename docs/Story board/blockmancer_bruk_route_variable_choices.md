# Blockmancer Dungeon — Bruk Route Dialogue & Storyboard
## Variable Choice Label Pass — Bruk Draft

**Document purpose:**  
This file prepares **Bruk the Snack Knight** as a full character-route example after Milo, Pippa, Zuzu, and Nixie.

The goal is to give Bruk his own unmistakable speaking pattern, stage-specific story build-up, variable choice labels, route flags, gameplay consequences, and Normal / True Ending structure.

Bruk should **not** sound like Milo with snack words added, and he should **not** sound like Pippa with armor.  
He is loyal, formal, warm-hearted, practical, protective, and quietly poetic whenever food, duty, or a shared table is involved.

This route keeps the same cheerful Brixonia festival world, six-stage structure, Cascade Gravity gameplay identity, mobile-readable dialogue rules, and happy festival atmosphere.

---

# 1. Bruk Voice Bible

## 1.1 Core Voice

Bruk is the knight sworn to guard the festival snack table. His armor is dented, crumb-dusted, and polished with great seriousness. To him, a snack is not a joke. A snack is morale, hospitality, courage, and sometimes the only thing standing between a frightened child and a very loud magical machine.

Bruk speaks with the ceremony of an old knight and the priorities of a person who knows exactly how many pastries remain on the tray.

He is not merely “the food guy.”  
His route is about widening the meaning of protection.

At the start of his route, Bruk believes his oath is to defend the snack table from monsters, machines, and poor portion discipline.  
By the end of his route, he understands that the true oath is larger:

> No snack left behind also means no hungry heart left outside the feast.

### Bruk speaks with:

- solemn knightly wording applied to cheerful snack problems;
- terms like **oath**, **ration**, **provision**, **table**, **shield**, **service**, **hospitality**, **guard post**, **march**, **banner**, **portion**, **crumb line**, **supper bell**, **fair share**, and **honored guest**;
- short, sturdy sentences when battle starts;
- warm, respectful lines when offering food or mercy;
- strong protective declarations;
- comedy from treating chips, cupcakes, and lemonade like sacred relics;
- gentle formality rather than internet sarcasm.

### Bruk avoids:

- Milo’s soft block-listening language;
- Pippa’s baker heat and kitchen-command rhythm;
- Zuzu’s fast technical diagnosis;
- Nixie’s calm frost-preservation phrasing;
- Lumi’s dreamy star poetry;
- meme phrasing, slangy overreaction, or “haha food knight” jokes.

### Example Bruk line style

```text
Bruk: "Stand firm, little cupcakes. Your tray is under sworn protection."
```

```text
Bruk: "A shield may stop a blow. A shared plate may stop the blow from being raised at all."
```

```text
Bruk: "By crumb and crust, I will not let this table fall."
```

```text
Bruk: "A hungry monster is still a guest, if one is brave enough to set a place."
```

---

## 1.2 Bruk Choice Philosophy

Every Bruk choice should feel like a knightly decision about protection, supplies, and hospitality.

| Route Lean | Meaning | Bruk Behavior |
| --- | --- | --- |
| Practical / Normal | Defend the immediate objective and stabilize the board. | Bruk shields, blocks, braces, rations, and holds the line. |
| True / Hospitality | Understand why creatures are hungry, frightened, or guarding something. | Bruk shares, honors, invites, serves, and protects both sides of the table. |
| Risky / Grand Charge | Make a bold knightly move for a bigger reward. | Bruk charges, rallies, rings the supper bell, or turns danger into a feast-sized spectacle. |

## 1.3 Choice Label Rules

Choice labels should be short, stage-specific, and unmistakably Bruk.

Bad repeated labels:

```text
Make the board safe first
Listen beneath the hazard
Trust the rhythm
```

Better Bruk labels:

```text
Raise the Crumb Shield
Serve the Smallest Plate
Barricade the Lunch Belt
Honor the Nap Table
Split the Winning Tickets
Set a Place for the King
```

Each Bruk label should be:

- 2–6 words;
- readable on mobile;
- linked to the current stage hazard;
- knightly, snack-based, or hospitality-based;
- specific enough that it would not fit Milo, Pippa, Zuzu, Nixie, or Lumi.

---

# 2. Route Variables

## 2.1 Route Scores

```ts
type BrukRouteState = {
  brukDuty: number;          // practical defense, Normal route stability
  brukHospitality: number;   // shared table insight, True route progress
  brukGrandCharge: number;   // risky heroic spectacle, optional variant rewards
  flags: BrukRouteFlag[];
};
```

## 2.2 Route Flags

```ts
type BrukRouteFlag =
  | "bruk_flag_served_sugar_rushed_slimes"
  | "bruk_flag_fed_goblin_testers"
  | "bruk_flag_shared_warm_rations"
  | "bruk_flag_respected_pillow_oath"
  | "bruk_flag_shared_arcade_winnings"
  | "bruk_flag_invited_bloxley_to_table";
```

## 2.3 Ending Logic

### Bruk Normal Ending Requirements

```text
Defeat King Bloxley while playing Bruk.
BrukHospitality true-route flags fewer than 5.
```

### Bruk True Ending Requirements

```text
Defeat King Bloxley while playing Bruk.
Collect at least 5 of 6 Bruk true-route flags.
Reach final stage without abandoning more than 2 food/friendship route choices.
Optional bonus: Use Bruk's emergency protection passive at least once without losing the run.
```

### Bruk Grand Charge Variant

```text
If brukGrandCharge >= 3, add the Festival Banquet Parade variant to either ending.
This should not replace the Normal or True Ending. It adds a celebratory flavor layer.
```

---

# 3. Bruk Route Summary

## 3.1 Character Arc

Bruk begins as the sworn guard of the snack table. His first instinct is to protect what is already his responsibility: the cakes, chips, lemonade, cupcakes, and emergency frosting reserves.

Across the six stages, he discovers that many dungeon creatures are not stealing from wickedness. Some are hungry. Some are frightened. Some are following machine instructions that never included dinner breaks. Some are guarding their own small comforts with the same seriousness Bruk gives to the festival snack table.

By the end, Bruk can defeat King Bloxley by force, but his True Ending asks a better question:

> What if the palace stops being a fortress and becomes a table?

## 3.2 Route Theme

```text
Protection becomes hospitality when the shield also makes room for a guest.
```

## 3.3 Route Motifs

- Crumb trails as battlefield evidence.
- Snack ledgers as moral records.
- Shields used as serving trays.
- Ration bells that calm monsters.
- A table that keeps growing as more guests arrive.
- The difference between guarding food from people and guarding people with food.

---

# 4. Stage Choice Label Overview

| Stage | Practical / Normal | True / Hospitality | Risky / Grand Charge |
| ---: | --- | --- | --- |
| 1 — Sprinkle Sewers | Raise the Crumb Shield | Serve the Smallest Plate | Charge the Frosting Line |
| 2 — Goblin Workshop | Barricade the Lunch Belt | Feed the Tired Testers | Ram the Gear Buffet |
| 3 — Frosty Pantry | Stack the Ration Crates | Share the Warm Thermos | Shoulder the Ice Door |
| 4 — Pillow Castle | Hold the Blanket Line | Honor the Nap Table | Trumpet the Midnight Feast |
| 5 — Starfall Arcade | Guard the Prize Counter | Split the Winning Tickets | Win the Snack Jackpot |
| 6 — Bloxley's Block Palace | Brace the Banquet Gate | Set a Place for the King | Declare the Grand Snack Charge |

---

# 5. Scene Template Notes

Each Bruk route scene includes:

```text
- Scene ID
- Trigger
- Location
- Story Beat
- Route Flag Opportunity
- Storyboard Panels
- Pre-Choice Dialogue
- 3 Dialogue Choices
- Gameplay Result
- Route Result
- Post-Choice Battle Bark Pool
- Victory Callback
- Boss Callback
```

Route choices should be written as if the player is selecting Bruk's response, not as generic player morality.

---

# 6. Bruk Route Scenes

---

## SCN_BRUK_01 — The Crumb Line at Sprinkle Sewers

**Trigger:** First Bruk route event in Sprinkle Sewers.  
**Location:** Sprinkle Sewers.  
**Story Beat:** Bruk finds a collapsed snack cart and realizes the slimes are not stealing randomly. They are following a trail of spilled festival food because the sewer pipes are carrying frosting scent through the dungeon.  
**Route Flag Opportunity:** `bruk_flag_served_sugar_rushed_slimes` through Choice B.

### Storyboard Panels

1. The party enters a candy-bright drainage chamber where rainbow water moves in slow loops beneath frosting-coated pipes.
2. A festival snack cart lies tilted near the wall. Its tiny banner reads: **Emergency Cupcakes — Please Do Not Panic Before Dessert**.
3. Cupcake Slimes crowd the far side of the room. They are sticky, jittery, and clearly overwhelmed by the smell of frosting.
4. Bruk kneels beside the crumb trail and studies it as gravely as a battlefield map.
5. The board preview flickers with sticky blocks, sprinkle blocks, and a small incoming-junk warning.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Bruk: "Hold position. This is no ordinary crumb trail."

Festival Announcer: "A snack-related route matter has appeared. Please keep all frosting accusations polite."

Block-O-Matic 3000: "Observed complication: sugar-rushed slimes are pursuing spilled provisions with excessive enthusiasm and insufficient napkin protocol."

Cupcake Slime: "Glooop... cake? Cake now? Cake always?"

Bruk: "They are not raiders. They are hungry, frightened, and poorly queued."

Milo: "Can a queue be repaired with snacks?"

Bruk: "Most queues can. The rest require a shield."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Raise the Crumb Shield`

**Player Line:**

```text
Bruk: "I will hold the crumb line. Let the cart stand, let the board breathe, and let no cupcake fall unguarded."
```

**NPC Response:**

```text
Festival Announcer: "A defensive snack formation has been declared. Very proper. Very crunchy."
```

**Narration:**  
Bruk plants his shield between the snack cart and the sugar-rushed slimes. The room steadies. The slimes slow down, not calmed, but no longer trampling the frosting trail.

**Gameplay Result:**  
Start the next battle with **+6 shield** and reduce the first sticky block spawn by 1.

**Route Result:**  
`brukDuty +1`; leans toward Normal Ending.

---

#### B. True Lean / Hospitality

**Choice Label:** `Serve the Smallest Plate`

**Player Line:**

```text
Bruk: "A shield may guard a table, but a plate may end the charge. Small portions. Fair turns. No pushing."
```

**NPC Response:**

```text
Cupcake Slime: "Gloop? Turn? Plate?"

Bruk: "Yes, honored guest. One sprinkle first. Then breathe. Then another."
```

**Narration:**  
Bruk uses his shield as a serving tray and divides the damaged cupcakes into tiny careful portions. The slimes stop surging. One of them sits down, bewildered by the concept of manners and delighted by the concept of seconds.

**Gameplay Result:**  
During the next battle, the first **Cupcake Block** cleared heals +2 extra HP. Sticky blocks have a 25% chance to convert into Sprinkle Blocks when cleared.

**Grant Flag:**  
`bruk_flag_served_sugar_rushed_slimes`

**Route Result:**  
`brukHospitality +1`; contributes to True Ending.

---

#### C. Risky Lean / Grand Charge

**Choice Label:** `Charge the Frosting Line`

**Player Line:**

```text
Bruk: "By crumb and crust, we charge before the frosting hardens. Keep close, keep brave, and mind your boots."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Warning: heroic snack momentum may exceed recommended frosting traction."
```

**Narration:**  
Bruk charges down the frosting-slick channel, shield first, scattering sprinkles and slimes in a dazzling wave. The path opens quickly, though the board inherits some of the room's slippery enthusiasm.

**Gameplay Result:**  
Gain a rare Stage 1 reward. 25% chance to gain Oopsie: `oops_slippery_buttons` or add one extra sticky hazard to the next fight.

**Route Result:**  
`brukGrandCharge +1`; may unlock Festival Banquet Parade variant text.

### Post-Choice Battle Bark Pool

```text
Bruk: "Shield high. Tray steady."
Bruk: "The left column is wavering. Give it courage."
Bruk: "A clean line is a well-set table."
Bruk: "No snack left behind. No friend left hungry."
Block-O-Matic 3000: "Snack formation archived. Crumb stability improved."
Festival Announcer: "The festival recognizes Bruk's official use of shield-as-serving-tray."
```

### Victory Callback

```text
Bruk: "The cart stands. The slimes are seated. This is a victory with napkins."
```

### Boss Callback — Cupcake Slime King

If `bruk_flag_served_sugar_rushed_slimes` is active:

```text
Cupcake Slime King: "Gloooop! Tiny plates?"

Bruk: "Fair portions, Your Wobbliness. You may have seconds after the battle, provided you stop throwing the table."
```

Boss starts with one fewer sticky block.

---

## SCN_BRUK_02 — The Lunch Belt at Goblin Workshop

**Trigger:** First Bruk route event in Goblin Workshop.  
**Location:** Goblin Workshop.  
**Story Beat:** Bruk discovers that several goblin machines are malfunctioning because the goblin testers skipped lunch to keep the prototypes running. The machines are not only noisy; they are hungry-work noisy.  
**Route Flag Opportunity:** `bruk_flag_fed_goblin_testers` through Choice B.

### Storyboard Panels

1. Conveyor belts carry bolts, toy bombs, snack wrappers, and one heroic pickle moving in the wrong direction.
2. Warning placards blink: **TOTALLY SAFE**, **MOSTLY SAFE**, and **SAFE AFTER LUNCH**.
3. A group of Wrench Goblins argue beside a rattling lunch belt that is feeding crumbs directly into a junk-block press.
4. Bruk notices unopened lunch tins stacked behind a machine guard.
5. The board preview flickers with junk blocks, bomb blocks, and light board shake.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Wrench Goblin: "No pause! Prototype hungry! Boss hungry! Belt hungry! We fix after boom!"

Zuzu: "This workshop is operating on seventy percent confidence and zero percent sandwiches."

Block-O-Matic 3000: "Observed complication: lunch break suppression has reduced worker judgment and increased crumb-junk productivity."

Bruk: "No guard post holds long on an empty stomach. No workshop either."

Wrench Goblin: "Lunch is delay!"

Bruk: "Lunch is maintenance for courage."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Barricade the Lunch Belt`

**Player Line:**

```text
Bruk: "I will block the belt. The junk press will not dine on crumbs while I stand here."
```

**NPC Response:**

```text
Zuzu: "Effective. Heavy-handed, but the hand is attached to a knight, so that tracks."
```

**Narration:**  
Bruk wedges his shield across the lunch belt. Crumbs stop feeding the junk-block press, and the machine coughs itself into a slower rhythm.

**Gameplay Result:**  
Reduce the first incoming junk queue by 2. Gain +3 shield at battle start.

**Route Result:**  
`brukDuty +1`; leans toward Normal Ending.

---

#### B. True Lean / Hospitality

**Choice Label:** `Feed the Tired Testers`

**Player Line:**

```text
Bruk: "Set the tools down. Three bites each. Then we fix the machine with hands that remember they are attached to people."
```

**NPC Response:**

```text
Wrench Goblin: "Three bites? Official?"

Bruk: "Official by authority of the snack table and common sense."
```

**Narration:**  
The goblins grumble, then eat, then blink as though the world has regained several important colors. They point out which machine lever nobody should ever pull, especially during snack hour.

**Gameplay Result:**  
For the next Goblin Workshop battle, enemy junk warnings last +1 piece, and the first board shake is canceled.

**Grant Flag:**  
`bruk_flag_fed_goblin_testers`

**Route Result:**  
`brukHospitality +1`; contributes to True Ending.

---

#### C. Risky Lean / Grand Charge

**Choice Label:** `Ram the Gear Buffet`

**Player Line:**

```text
Bruk: "Then we take the table to the machine. Brace yourselves. This buffet marches."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Warning: mobile buffet tactics are not covered by standard workshop warranty."
```

**Narration:**  
Bruk shoves a snack cart onto the conveyor belt. It rolls through the workshop like a tiny banquet battering ram, knocking bolts into bins and sandwiches into grateful goblin hands.

**Gameplay Result:**  
Gain a gadget or defensive relic reward. 25% chance to queue extra junk in the next battle.

**Route Result:**  
`brukGrandCharge +1`; may unlock Festival Banquet Parade variant text.

### Post-Choice Battle Bark Pool

```text
Bruk: "A rattled belt cannot rattle a steady knight."
Bruk: "Hold the middle. The crumbs are gathering there."
Bruk: "Incoming junk is merely a rude delivery. We shall refuse it properly."
Bruk: "Eat first. Explode later, preferably never."
Zuzu: "I object to never, but respect the meal schedule."
```

### Victory Callback

```text
Bruk: "The machines are quieter. The goblins are chewing. This workshop may yet see honor."
```

### Boss Callback — Prototype No. 7

If `bruk_flag_fed_goblin_testers` is active:

```text
Prototype No. 7: "LUNCH VARIABLE DETECTED. PRODUCTIVITY CONFUSION."

Bruk: "Correct. A fed worker makes wiser mistakes."
```

Prototype No. 7 delays its first junk queue by 1 piece.

---

## SCN_BRUK_03 — The Warm Ration in Frosty Pantry

**Trigger:** First Bruk route event in Frosty Pantry.  
**Location:** Frosty Pantry.  
**Story Beat:** Bruk finds emergency rations frozen into the pantry wall. His instinct is to break them free, but the frozen crates are supporting a shelf of delicate gelato jars.  
**Route Flag Opportunity:** `bruk_flag_shared_warm_rations` through Choice B.

### Storyboard Panels

1. The pantry glows with blue-white magic. Rainbow gelato jars hum softly on frost-rimmed shelves.
2. A stack of emergency ration crates is sealed in ice beside a cracked support beam.
3. Snowcone Sprites shiver nearby, trying to guard the crates but too cold to speak clearly.
4. Bruk places one gauntlet against the ice and frowns as if listening to a door before knocking.
5. The board preview flickers with ice blocks, freeze warnings, and slow-to-fast fall speed waves.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Nixie: "Careful. That shelf is holding more flavors than it should."

Bruk: "A ration locked away is no ration at all. Yet a careless rescue may ruin the whole pantry."

Snowcone Sprite: "Brrr... guard... hungry guard..."

Block-O-Matic 3000: "Observed complication: provisions are frozen, support integrity is low, and snack morale is approaching brittle."

Bruk: "Then we warm the courage before we move the crates."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Stack the Ration Crates`

**Player Line:**

```text
Bruk: "We brace the shelf first. Supplies rescued at the cost of other supplies are not rescued. They are rearranged tragedy."
```

**NPC Response:**

```text
Nixie: "A sturdy answer. Not flashy, but the pantry appreciates sturdy."
```

**Narration:**  
Bruk stacks loose crates beneath the bending shelf, building a small fortress of provisions. The ice still bites, but the room no longer threatens to collapse at the first hard drop.

**Gameplay Result:**  
Start the next battle with +8 shield. Freeze hazard severity reduced once.

**Route Result:**  
`brukDuty +1`; leans toward Normal Ending.

---

#### B. True Lean / Hospitality

**Choice Label:** `Share the Warm Thermos`

**Player Line:**

```text
Bruk: "Before the crates, the guards. A warm drink steadies the hands that keep watch."
```

**NPC Response:**

```text
Snowcone Sprite: "Warm? For guard?"

Bruk: "For every guard. Even the very small and frosty ones."
```

**Narration:**  
Bruk opens his emergency thermos and shares warm spiced lemonade with the Snowcone Sprites. They thaw enough to explain which crates are load-bearing and which are merely dramatic.

**Gameplay Result:**  
The next freeze warning window expands by +1 piece. Gain one `item_hot_cocoa` or equivalent freeze-counter reward if item content exists.

**Grant Flag:**  
`bruk_flag_shared_warm_rations`

**Route Result:**  
`brukHospitality +1`; contributes to True Ending.

---

#### C. Risky Lean / Grand Charge

**Choice Label:** `Shoulder the Ice Door`

**Player Line:**

```text
Bruk: "Stand back. If the pantry has made a gate of ice, then a Snack Knight shall knock with his shoulder."
```

**NPC Response:**

```text
Nixie: "That is not how doors prefer to be addressed."

Bruk: "Then I shall apologize after it opens."
```

**Narration:**  
Bruk charges the ice-sealed door. It bursts open in a glittering spray, freeing crates and also sending several frozen blocks tumbling into the room's magic pattern.

**Gameplay Result:**  
Gain a rare defensive item or relic. 25% chance to add an ice block cluster to the next board.

**Route Result:**  
`brukGrandCharge +1`; may unlock Festival Banquet Parade variant text.

### Post-Choice Battle Bark Pool

```text
Bruk: "Cold tests armor. Hunger tests honor."
Bruk: "Hold steady. The ice wants us hurried."
Bruk: "A ration shared is courage multiplied."
Bruk: "Top row looks brittle. We guard it before it breaks."
Nixie: "You are loud for someone being careful. But you are being careful."
```

### Victory Callback

```text
Bruk: "The rations are free, the shelf still stands, and the small guards are warm. I will count this as a proper rescue."
```

### Boss Callback — Gelato Golem

If `bruk_flag_shared_warm_rations` is active:

```text
Gelato Golem: "COLD STORES MUST REMAIN CLOSED."

Bruk: "Stores remain honorable only when opened for those in need."
```

Player starts the boss fight with a small shield or one longer freeze warning.

---

## SCN_BRUK_04 — The Nap Table at Pillow Castle

**Trigger:** First Bruk route event in Pillow Castle.  
**Location:** Pillow Castle.  
**Story Beat:** Bruk reaches the soft castle where sleepy guards protect a sacred nap schedule and the midnight snack table. Bruk must decide whether protection means waking everyone for battle or honoring the quiet order already in place.  
**Route Flag Opportunity:** `bruk_flag_respected_pillow_oath` through Choice B.

### Storyboard Panels

1. Pillow Castle rises in soft towers of blankets, tassels, plush banners, and toy shields.
2. Button Knights stand asleep at their posts. Each holds a tiny tray with one carefully wrapped biscuit.
3. A sign reads: **Sacred Nap Schedule — Disturb Only for Fire, Flood, or Missing Snacks**.
4. Bruk removes his helmet and lowers his voice without being asked.
5. The board preview flickers with soft blocks, shield enemies, and Sleepy status.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Bruk: "A guard asleep at post is usually a concern. A guard asleep by law of the realm is a schedule."

Blanket Ghost: "Hushhh. Pillow oath. Snack after nap."

Block-O-Matic 3000: "Observed complication: defensive nap protocol conflicts with urgent dungeon traversal."

Bruk: "No oath is small merely because it is soft."

Festival Announcer: "The festival reminds everyone that whispering is also a form of heroism."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Hold the Blanket Line`

**Player Line:**

```text
Bruk: "We guard the path and keep the sleepers behind us. Let trouble meet my shield before it reaches their pillows."
```

**NPC Response:**

```text
Blanket Ghost: "Mmm. Tall shield. Good wall."
```

**Narration:**  
Bruk positions himself at the hall's narrowest point. The sleepy guards remain undisturbed while the route ahead becomes safer, if slower.

**Gameplay Result:**  
Start next battle with +10 shield. First Sleepy effect has reduced duration.

**Route Result:**  
`brukDuty +1`; leans toward Normal Ending.

---

#### B. True Lean / Hospitality

**Choice Label:** `Honor the Nap Table`

**Player Line:**

```text
Bruk: "A table set for after rest is still a table under oath. We will not steal from it, nor wake its keepers without need."
```

**NPC Response:**

```text
Button Knight: "Mmm... guest pass... biscuit later..."

Bruk: "Accepted with gratitude. Sleep well, fellow guard."
```

**Narration:**  
Bruk carefully repairs the midnight snack table, straightens each wrapped biscuit, and writes a note promising that no crumb was taken. The sleeping guards open the path in their dreams.

**Gameplay Result:**  
Gain a Pillow Castle friendship bonus: Sleepy status may grant +2 shield when it ends, once per battle.

**Grant Flag:**  
`bruk_flag_respected_pillow_oath`

**Route Result:**  
`brukHospitality +1`; contributes to True Ending.

---

#### C. Risky Lean / Grand Charge

**Choice Label:** `Trumpet the Midnight Feast`

**Player Line:**

```text
Bruk: "If we must wake the castle, we wake it with purpose. Sound the supper bell. Let every pillow know the table is defended."
```

**NPC Response:**

```text
Festival Announcer: "Midnight feast protocol has been invoked. Please chew quietly but heroically."
```

**Narration:**  
Bruk rings the supper bell. The castle springs awake in a flurry of blankets, toy trumpets, and sleepy courage. The route opens wide, though several enemies arrive wearing napkins as helmets.

**Gameplay Result:**  
Gain a rare Pillow Castle reward. 25% chance to start the next fight with an extra shield enemy.

**Route Result:**  
`brukGrandCharge +1`; may unlock Festival Banquet Parade variant text.

### Post-Choice Battle Bark Pool

```text
Bruk: "Quiet shield. Quiet feet."
Bruk: "Let them sleep. We can be brave softly."
Bruk: "A nap defended is a promise kept."
Bruk: "If the board yawns, we do not mock it. We tuck the edges."
Blanket Ghost: "Snack Knight... good hush."
```

### Victory Callback

```text
Bruk: "The sleepers remain sleeping, the biscuits remain counted, and the path is open. Excellent discipline."
```

### Boss Callback — Sir Snore-a-Lot

If `bruk_flag_respected_pillow_oath` is active:

```text
Sir Snore-a-Lot: "Who approaches the Sacred Nap?"

Bruk: "One guard to another. I request passage, and I bring respect for the snack table."
```

Sir Snore-a-Lot begins with reduced Sleepy pressure or one fewer shield stack.

---

## SCN_BRUK_05 — The Ticket Table at Starfall Arcade

**Trigger:** First Bruk route event in Starfall Arcade.  
**Location:** Starfall Arcade.  
**Story Beat:** Bruk finds monsters fighting over prize tickets because the arcade rewards only the highest score. His route asks whether victory should hoard prizes or turn winnings into provisions for everyone.  
**Route Flag Opportunity:** `bruk_flag_shared_arcade_winnings` through Choice B.

### Storyboard Panels

1. Neon signs blink over game cabinets, prize claws, ticket fountains, and tiny scoreboard crowns.
2. Token Sprites clutch tickets like battle medals. Combo Gremlins argue over who deserves the last star-cookie prize.
3. A sign reads: **TOP SCORE GETS THE SNACK HAMPER**.
4. Bruk sees several smaller monsters watching from behind the prize counter with empty hands.
5. The board preview flickers with Fever meter prompts, cascade challenges, and preview flashes.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Combo Gremlin: "High score gets hamper! Low score gets staring!"

Lumi: "That is a very lonely way to count stars."

Block-O-Matic 3000: "Observed complication: competitive reward structure has generated snack scarcity drama."

Bruk: "A contest may crown a champion. It should not empty the hall of supper."

Token Sprite: "But tickets prove glory!"

Bruk: "Then let glory buy enough plates."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Guard the Prize Counter`

**Player Line:**

```text
Bruk: "I will hold the counter until the game ends properly. No claw, gremlin, or scoreboard shall seize the hamper early."
```

**NPC Response:**

```text
Festival Announcer: "Prize counter security has increased by one very serious knight."
```

**Narration:**  
Bruk stands between the monsters and the prize counter. The contest resumes with fewer elbows and much more nervous respect.

**Gameplay Result:**  
Start the next arcade battle with +10% Fever gain and prevent the first prize disruption.

**Route Result:**  
`brukDuty +1`; leans toward Normal Ending.

---

#### B. True Lean / Hospitality

**Choice Label:** `Split the Winning Tickets`

**Player Line:**

```text
Bruk: "Let the champion keep the ribbon. Let the tickets buy a table large enough for the room."
```

**NPC Response:**

```text
Token Sprite: "Champion still shiny?"

Bruk: "Very shiny. And well-fed companions make the shine last longer."
```

**Narration:**  
Bruk helps divide the prize tickets into a shared snack fund. The top scorer receives a ribbon, the smaller monsters receive plates, and the arcade lights soften into a warmer glow.

**Gameplay Result:**  
Gain bonus tickets and unlock a small friendship modifier: cascade objectives reward +1 extra ticket once.

**Grant Flag:**  
`bruk_flag_shared_arcade_winnings`

**Route Result:**  
`brukHospitality +1`; contributes to True Ending.

---

#### C. Risky Lean / Grand Charge

**Choice Label:** `Win the Snack Jackpot`

**Player Line:**

```text
Bruk: "Then we win enough for all. Sound the bell. I challenge the machine in the name of the hungry queue."
```

**NPC Response:**

```text
High Score Hydra: "BOLD CLAIM. DELICIOUSLY COUNTABLE."
```

**Narration:**  
Bruk enters the arcade challenge with shield raised and tickets flying. The score lights flare. The prize counter trembles under the possibility of a very public feast.

**Gameplay Result:**  
Gain a rare arcade reward if the player triggers a cascade in the next battle. If not, next enemy gains one extra combo-punish action.

**Route Result:**  
`brukGrandCharge +1`; may unlock Festival Banquet Parade variant text.

### Post-Choice Battle Bark Pool

```text
Bruk: "A score is a banner, not a wall."
Bruk: "Tickets left, shield right. Keep both honest."
Bruk: "Cascade cleanly. The hamper depends on it."
Bruk: "Win with room at the table."
Lumi: "Your shield makes the neon feel kinder."
```

### Victory Callback

```text
Bruk: "The tickets are counted. The hamper is opened. The champion is applauded, and no one watches hungry."
```

### Boss Callback — High Score Hydra

If `bruk_flag_shared_arcade_winnings` is active:

```text
High Score Hydra: "THREE HEADS. ONE HAMPER. MATHEMATICAL ADVANTAGE."

Bruk: "Three heads may share three plates. Your arithmetic need not be cruel."
```

High Score Hydra's first no-cascade punishment is softened.

---

## SCN_BRUK_06 — The Place Set for a King

**Trigger:** First Bruk route event in Bloxley's Block Palace.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Bruk enters a palace where every table is square, every plate is measured, and every round cake has been banished to a locked pantry. He sees that Bloxley's obsession with order has turned the feast into a fortress.  
**Route Flag Opportunity:** `bruk_flag_invited_bloxley_to_table` through Choice B.

### Storyboard Panels

1. The palace hall is perfectly rectangular. Square banners hang at identical distances. Even the crumbs appear arranged by size.
2. A banquet table stretches across the hall, but every chair is bolted down and labeled by rank.
3. A locked pantry contains round cakes, jelly cups, and other “unapproved shapes.”
4. Royal Block Guards march with trays that nobody is allowed to touch.
5. Bruk steps toward the empty head of the table and sees a single untouched place setting for King Bloxley.
6. The board preview flickers with royal blocks, symmetry warnings, pattern junk, and low-ceiling pressure.
7. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
King Bloxley: "At last, a knight who understands discipline. Observe my perfect banquet: straight edges, measured portions, no suspiciously round cakes."

Bruk: "Majesty, this is not a banquet. It is a parade of plates under arrest."

King Bloxley: "Order prevents disappointment. Nobody fights over crumbs if nobody receives crumbs out of turn."

Block-O-Matic 3000: "Observed complication: palace hospitality has been replaced by ranked geometry and emotional portion control."

Bruk: "A table with no welcome is only a wall lying flat."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Brace the Banquet Gate`

**Player Line:**

```text
Bruk: "Then I hold this gate. Let the royal blocks come. No crooked order will pass while the pantry remains locked."
```

**NPC Response:**

```text
King Bloxley: "A defensive stance. Acceptable. Insufficiently symmetrical, but acceptable."
```

**Narration:**  
Bruk braces his shield against the banquet gate. The royal blocks crash into his guard formation, slowing the palace's pattern pressure.

**Gameplay Result:**  
Start the final battle with +12 shield. First royal pattern warning lasts +1 piece.

**Route Result:**  
`brukDuty +1`; supports Normal Ending.

---

#### B. True Lean / Hospitality

**Choice Label:** `Set a Place for the King`

**Player Line:**

```text
Bruk: "You built a table no one may join. Sit, Your Majesty. Not above it. At it. We will begin again with one shared plate."
```

**NPC Response:**

```text
King Bloxley: "A king does not simply sit among uneven guests."

Bruk: "A lonely king may start with a small chair. I will guard it until you are ready."
```

**Narration:**  
Bruk unlocks the pantry, places one round cake at the center of the rigid square table, and sets a chair for Bloxley beside everyone else. The palace trembles, not with anger, but with the terrifying possibility of being welcomed.

**Gameplay Result:**  
During the final boss, one royal block cluster downgrades into normal rune blocks at phase change. If the player has 5+ Bruk true flags, unlock Bruk True Ending.

**Grant Flag:**  
`bruk_flag_invited_bloxley_to_table`

**Route Result:**  
`brukHospitality +1`; contributes to True Ending.

---

#### C. Risky Lean / Grand Charge

**Choice Label:** `Declare the Grand Snack Charge`

**Player Line:**

```text
Bruk: "Then hear my banner, palace and king alike. The pantry opens, the table marches, and every locked cake rides with us!"
```

**NPC Response:**

```text
Festival Announcer: "Grand Snack Charge declared. Please secure loose forks and emotional expectations."
```

**Narration:**  
Bruk lifts the banquet table like a shield-wall and charges down the royal hall. Plates spin, cakes wobble, guards scatter, and the palace's perfect symmetry gives way to a magnificent, unruly feast formation.

**Gameplay Result:**  
Gain a powerful final-battle bonus: first overflow event is prevented. 25% chance that King Bloxley opens with an extra royal pattern.

**Route Result:**  
`brukGrandCharge +1`; unlocks Festival Banquet Parade variant if threshold met.

### Post-Choice Battle Bark Pool

```text
Bruk: "A table is not measured by corners. It is measured by welcome."
Bruk: "Royal blocks ahead. Shield the center."
Bruk: "No pantry stays locked on my watch."
Bruk: "Stand firm. The feast is almost free."
King Bloxley: "Your hospitality is geometrically disruptive!"
Bruk: "Good. It has room for seconds."
```

### Victory Callback

```text
Bruk: "The gate is open. The table is set. Now let us see whether a king can accept a chair."
```

### Boss Callback — King Bloxley

If `bruk_flag_invited_bloxley_to_table` is active:

```text
King Bloxley: "Why is there a chair at my table that is not higher than the others?"

Bruk: "Because supper tastes better when no one must climb a throne to reach it."
```

King Bloxley's first royal block pattern is softened or delayed.

---

# 7. Bruk Final Confrontation Dialogue

## 7.1 Before Final Boss — Standard Bruk Version

```text
King Bloxley: "Snack Knight, you have guarded crumbs, crates, biscuits, tickets, and other soft nonsense. But can you guard order itself?"

Bruk: "I guard what keeps people brave. Sometimes that is a wall. Sometimes it is a warm plate."

King Bloxley: "Warm plates warp. Square plates stack."

Bruk: "Then your plates are stacked very high, Majesty. But no one is eating."

Block-O-Matic 3000: "Final hospitality conflict detected. Banquet geometry unstable."

Bruk: "Raise your shield if you must, Bloxley. I will raise a table."
```

## 7.2 Before Final Boss — True Route Variant

Requires at least 5 Bruk true-route flags before the final battle.

```text
King Bloxley: "You again. The knight who keeps inviting disorder to dinner."

Bruk: "Not disorder. Guests."

King Bloxley: "Guests leave crumbs. Crumbs become arguments. Arguments become crooked kingdoms."

Bruk: "Crumbs mean someone was fed. Arguments mean someone cared enough to stay. Crooked kingdoms can still have sturdy chairs."

King Bloxley: "You would set a place for me? After I locked your round cakes away?"

Bruk: "Especially then. A hungry ruler makes hungry rules."

Block-O-Matic 3000: "Emotional portion control error detected. Recommended remedy: shared serving protocol."

Bruk: "Come down from the throne, Majesty. The first plate is yours, if you can share the second."
```

---

# 8. Bruk Ending Scripts

---

## 8.1 Bruk Normal Ending — Captain of Festival Provisions

**Condition:** Defeat King Bloxley as Bruk without meeting True Ending requirements.

### Storyboard Panels

1. King Bloxley's palace folds into a smaller, less bossy banquet hall.
2. The locked pantry opens. Round cakes roll gently into the light.
3. Bruk returns to the festival snack table and finds it cracked, crumb-covered, and still standing.
4. He repairs it with boards from defeated royal blocks and hangs a small banner: **PROVISIONS GUARDED WITH HONOR**.
5. Slimes, goblins, blanket ghosts, and Token Sprites form a nervous line.
6. Bruk takes out a ledger, sharpens a pencil, and smiles.

### Ending Dialogue

```text
Festival Announcer: "By festival decree, Bruk is hereby promoted from Snack Table Guard to Captain of Festival Provisions."

Bruk: "A title is heavy. Fortunately, I have carried snack crates."

Pippa: "You alphabetized the cupcakes by courage level."

Bruk: "Incorrect. By filling. Courage level is noted in the margin."

Cupcake Slime: "Gloop? Seconds?"

Bruk: "You may have seconds after everyone receives firsts. This is not punishment. This is civilization."

Block-O-Matic 3000: "Provision distribution stabilized. Crumb panic reduced by 84 percent."

Bruk: "Good. Then let the table stand. Let the line move kindly. Let no snack be left behind."
```

### Ending Result

```text
Unlock: Bruk ending illustration.
Unlock: Snack Table hub upgrade.
Meta Bonus: Start future Bruk runs with +1 Mini Cupcake or +small shield.
```

### Ending Tone

Warm, successful, practical. Bruk protects the festival and improves distribution, but his oath remains mostly about guarding supplies.

---

## 8.2 Bruk True Ending — The Hall of Many Plates

**Condition:** Defeat King Bloxley as Bruk with at least 5 of 6 Bruk true-route flags.

### Required True Flags

```text
bruk_flag_served_sugar_rushed_slimes
bruk_flag_fed_goblin_testers
bruk_flag_shared_warm_rations
bruk_flag_respected_pillow_oath
bruk_flag_shared_arcade_winnings
bruk_flag_invited_bloxley_to_table
```

At least 5 are required. All 6 unlock a perfect True Ending line.

### Storyboard Panels

1. The final royal blocks dissolve into long banquet benches instead of debris.
2. The Block-O-Matic 3000 prints plates, napkins, and slightly too many tiny forks.
3. Bruk places his shield at the center of the table. It is no longer a wall; it becomes the first serving tray.
4. Cupcake Slimes sit beside Wrench Goblins. Snowcone Sprites share warm drinks with Blanket Ghosts. Token Sprites trade tickets for extra chairs.
5. King Bloxley stands at the end of the hall, holding a square plate and staring at one round cake.
6. Bruk pulls out a chair beside him.
7. The festival hall opens into the town square, and the table continues outward under lantern light.

### Ending Dialogue

```text
King Bloxley: "This table is uneven."

Bruk: "Yes. It had to become longer quickly. More guests arrived than expected."

King Bloxley: "The plates do not match."

Bruk: "Neither do the guests. That is why supper is interesting."

King Bloxley: "And this cake is round."

Bruk: "A courageous shape. Difficult to corner."

Block-O-Matic 3000: "Festival Game Master note: round cake detected. Social harmony increased. Rectangular anxiety decreasing."

Cupcake Slime: "Gloop. King chair?"

Bruk: "Yes. The king has a chair. Not a throne. A chair."

King Bloxley: "And if I sit?"

Bruk: "Then someone will pass you a plate. And you will pass the next plate along."

King Bloxley: "That sounds... inefficient."

Bruk: "Hospitality often is. That is how you know it is working."
```

### Perfect True Ending Extra Line

If all 6 Bruk true flags are active:

```text
Bruk: "By crumb, crust, spoon, cup, ticket, and chair, I renew my oath: no snack left behind, and no guest left outside."
```

### Ending Narration

```text
From that year forward, the festival snack table was never only a table again.

It became the Hall of Many Plates:
a place where sugar-rushed slimes learned to wait their turn,
goblins were required to eat before testing prototypes,
Snowcone Sprites kept a warm thermos by the freezer,
Pillow Castle guards saved biscuits for travelers,
and even King Bloxley learned that a round cake could be divided fairly without losing its dignity.

Bruk still guarded the snacks.

But now, when he raised his shield,
it was just as often to make room as to hold a line.
```

### Ending Result

```text
Unlock: Bruk True Ending illustration.
Unlock: Hall of Many Plates hub building.
Unlock: Bruk passive upgrade cosmetic or meta perk.
Meta Bonus: Once per run, Bruk's emergency shield also protects one random friendly monster or route objective.
```

### Ending Tone

Warm, ceremonial, generous, and happy. Bruk's True Ending completes his arc from guard to host-protector.

---

## 8.3 Festival Banquet Parade Variant

**Condition:** `brukGrandCharge >= 3` by the end of the run.

This variant can attach to either Normal or True Ending.

### Variant Scene

```text
Festival Announcer: "Unexpected update: the snack table is now mobile."

Bruk: "A table that cannot reach hungry guests must be carried."

Zuzu: "I added wheels. Some are authorized."

Nixie: "One wheel is an ice cream lid."

Pippa: "One wheel is a pie tin."

Lumi: "One wheel is following a wish."

Block-O-Matic 3000: "Mobile banquet stability: improbable. Joy output: considerable."
```

### Variant Narration

```text
So the festival held its first Banquet Parade.

Bruk marched at the front with shield raised,
not to warn people away,
but to announce that supper was coming to them.
```

### Gameplay / Meta Result

```text
Unlock cosmetic: Parade Snack Shield.
Unlock hub decoration: Rolling Banquet Table.
```

---

# 9. Bruk Hub Dialogue

## 9.1 Default Hub Barks

```text
Bruk: "Snack count complete. Courage count pending."
Bruk: "If you see a crumb trail, report it. If you made the crumb trail, also report it."
Bruk: "The lemonade is guarded. Not because I distrust you. Because I respect lemonade."
Bruk: "A clean table is a promise. A full table is a celebration."
Bruk: "I have sharpened the forks. For serving. Mostly."
```

## 9.2 After Stage 1 True Flag

```text
Bruk: "The slimes understand turns now. Mostly. One attempted to take a fourth turn, but with admirable honesty."
```

## 9.3 After Stage 2 True Flag

```text
Bruk: "The goblins have agreed to scheduled meals. Zuzu calls this 'preventive calibration.' I call it lunch."
```

## 9.4 After Stage 3 True Flag

```text
Bruk: "There is now a warm thermos in the pantry. It is labeled Emergency Courage."
```

## 9.5 After Stage 4 True Flag

```text
Bruk: "Pillow Castle sent biscuits. They were wrapped in silence and tied with a nap ribbon."
```

## 9.6 After Stage 5 True Flag

```text
Bruk: "The arcade prize counter now offers shared hampers. Competition remains fierce, but better fed."
```

## 9.7 Before Final Battle with 5+ True Flags

```text
Bruk: "I have guarded many tables. Today, I must build one large enough for a king who forgot how to sit."
```

---

# 10. Bruk Battle Bark Library

## 10.1 Start Battle

```text
Bruk: "Shield ready. Snacks accounted for."
Bruk: "Stand behind me if frightened. Beside me if brave. Both are acceptable."
Bruk: "This board will hold. I asked it firmly."
Bruk: "No panic near the provisions."
```

## 10.2 Taking Damage

```text
Bruk: "Armor dented. Oath intact."
Bruk: "That was rude to both knight and table."
Bruk: "I have carried heavier crates."
Bruk: "Still standing. Still serving."
```

## 10.3 Low HP

```text
Bruk: "If I fall, protect the snack table. Also me, if convenient."
Bruk: "A knight may wobble. The oath does not."
Bruk: "One more line. One more plate."
```

## 10.4 Shield Gain

```text
Bruk: "Good. A proper wall with polite intentions."
Bruk: "Shield raised. Table secured."
Bruk: "Let the danger queue respectfully."
```

## 10.5 Cascade

```text
Bruk: "A fine cascade. Like trays passed down a long table."
Bruk: "There. The board remembered its manners."
Bruk: "Excellent service from the left column."
```

## 10.6 Item Use

```text
Bruk: "Provision deployed."
Bruk: "A snack at the right moment is strategy."
Bruk: "This is why one packs carefully."
```

## 10.7 Victory

```text
Bruk: "Victory secured. Count the snacks. Then count the guests."
Bruk: "The table stands. The danger sits down."
Bruk: "Well fought. Who needs water?"
```

## 10.8 Defeat

```text
Bruk: "Forgive me, snack table. I guarded as long as I could."
Bruk: "The oath is not ended. Only postponed."
```

---

# 11. Bruk Boss Dialogue Inserts

## 11.1 Cupcake Slime King

```text
Cupcake Slime King: "GLOOP! ALL CUPCAKES!"

Bruk: "No. All guests first. Then seconds. Then possibly thirds under supervision."
```

## 11.2 Prototype No. 7

```text
Prototype No. 7: "SNACK BELT JAM. PRODUCTIVITY THREATENED."

Bruk: "A machine that cannot pause for lunch has mistaken speed for service."
```

## 11.3 Gelato Golem

```text
Gelato Golem: "FROZEN STORES ARE SAFE STORES."

Bruk: "Safe from spoiling, yes. Not safe from being forgotten."
```

## 11.4 Sir Snore-a-Lot

```text
Sir Snore-a-Lot: "Who disturbs the sacred nap?"

Bruk: "One who respects it. I request passage between snores."
```

## 11.5 High Score Hydra

```text
High Score Hydra: "ONLY THE HIGHEST SCORE SHALL FEAST."

Bruk: "Then your rules are hungry. I have come to feed them better manners."
```

## 11.6 King Bloxley

```text
King Bloxley: "Round cakes are disorder."

Bruk: "Round cakes are diplomacy. Everyone receives a fair slice if the hand is steady."
```

---

# 12. Bruk JSON Implementation Draft

This is not final runtime JSON. It is a clean implementation reference for data-driven dialogue.

```json
{
  "routeId": "route_bruk_snack_knight",
  "heroId": "hero_bruk_snack_knight",
  "routeScores": {
    "brukDuty": 0,
    "brukHospitality": 0,
    "brukGrandCharge": 0
  },
  "trueEndingRequiredFlags": 5,
  "perfectTrueEndingRequiredFlags": 6,
  "scenes": [
    {
      "sceneId": "SCN_BRUK_01",
      "stageId": "stage_sprinkle_sewers",
      "choiceLabels": [
        "Raise the Crumb Shield",
        "Serve the Smallest Plate",
        "Charge the Frosting Line"
      ],
      "trueFlag": "bruk_flag_served_sugar_rushed_slimes"
    },
    {
      "sceneId": "SCN_BRUK_02",
      "stageId": "stage_goblin_workshop",
      "choiceLabels": [
        "Barricade the Lunch Belt",
        "Feed the Tired Testers",
        "Ram the Gear Buffet"
      ],
      "trueFlag": "bruk_flag_fed_goblin_testers"
    },
    {
      "sceneId": "SCN_BRUK_03",
      "stageId": "stage_frosty_pantry",
      "choiceLabels": [
        "Stack the Ration Crates",
        "Share the Warm Thermos",
        "Shoulder the Ice Door"
      ],
      "trueFlag": "bruk_flag_shared_warm_rations"
    },
    {
      "sceneId": "SCN_BRUK_04",
      "stageId": "stage_pillow_castle",
      "choiceLabels": [
        "Hold the Blanket Line",
        "Honor the Nap Table",
        "Trumpet the Midnight Feast"
      ],
      "trueFlag": "bruk_flag_respected_pillow_oath"
    },
    {
      "sceneId": "SCN_BRUK_05",
      "stageId": "stage_starfall_arcade",
      "choiceLabels": [
        "Guard the Prize Counter",
        "Split the Winning Tickets",
        "Win the Snack Jackpot"
      ],
      "trueFlag": "bruk_flag_shared_arcade_winnings"
    },
    {
      "sceneId": "SCN_BRUK_06",
      "stageId": "stage_bloxley_block_palace",
      "choiceLabels": [
        "Brace the Banquet Gate",
        "Set a Place for the King",
        "Declare the Grand Snack Charge"
      ],
      "trueFlag": "bruk_flag_invited_bloxley_to_table"
    }
  ],
  "endings": {
    "normal": "ending_bruk_captain_of_festival_provisions",
    "true": "ending_bruk_hall_of_many_plates",
    "variant": "ending_variant_bruk_festival_banquet_parade"
  }
}
```

---

# 13. Codex Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement Bruk's character route dialogue data using the Bruk route file.

Goal:
Give Bruk stage-specific route scenes with unique choice labels, dialogue, flags, battle callbacks, and Normal / True Ending logic.

Bruk voice direction:
- Loyal Snack Knight.
- Uses oath, ration, table, shield, provision, guest, service, hospitality, crumb, plate, and guard language.
- Sounds formal, warm, protective, and ceremonial.
- Does not sound like Milo, Pippa, Zuzu, Nixie, or Lumi.

Implement route scores:
- brukDuty
- brukHospitality
- brukGrandCharge

Implement route flags:
- bruk_flag_served_sugar_rushed_slimes
- bruk_flag_fed_goblin_testers
- bruk_flag_shared_warm_rations
- bruk_flag_respected_pillow_oath
- bruk_flag_shared_arcade_winnings
- bruk_flag_invited_bloxley_to_table

Implement scenes:
- SCN_BRUK_01 in Sprinkle Sewers
- SCN_BRUK_02 in Goblin Workshop
- SCN_BRUK_03 in Frosty Pantry
- SCN_BRUK_04 in Pillow Castle
- SCN_BRUK_05 in Starfall Arcade
- SCN_BRUK_06 in Bloxley's Block Palace

Rules:
- Keep dialogue skippable.
- Keep choice labels short enough for mobile.
- Store selected choice result in run route state.
- Store true flags in meta or current run route state as appropriate.
- Route choice A increases brukDuty.
- Route choice B increases brukHospitality and grants the scene true flag.
- Route choice C increases brukGrandCharge and can add risk/reward effects.
- Do not block player progress if a route scene is skipped.
- Missing dialogue data must fall back safely.

Ending logic:
- Normal Ending: defeat King Bloxley as Bruk without enough true flags.
- True Ending: defeat King Bloxley as Bruk with at least 5 of 6 Bruk true flags.
- Perfect True Ending line: all 6 true flags.
- Banquet Parade variant: brukGrandCharge >= 3.

Acceptance criteria:
- Bruk has unique choice labels for every stage.
- Bruk's dialogue voice is clearly distinct.
- Route flags save and load safely.
- Final boss dialogue changes when true-route requirements are met.
- Normal and True Ending branches work.
- npm run validate:content passes if content validation exists.
- npm run build passes.

Finish response with:
Summary / Files changed / Dialogue data added / Route logic added / Commands run / How to test / Known limitations.
```

---

# 14. QA Checklist

## 14.1 Dialogue Voice QA

- [ ] Bruk uses oath, table, snack, shield, ration, and hospitality wording.
- [ ] Bruk does not sound like Milo's gentle block-listening voice.
- [ ] Bruk does not sound like Pippa's baking/fire voice.
- [ ] Bruk does not sound like Zuzu's technical-goblin voice.
- [ ] Bruk does not sound like Nixie's calm frost voice.
- [ ] Bruk does not sound like Lumi's dreamy star voice.
- [ ] Choice labels are unique per stage.
- [ ] Choice labels are short enough for mobile UI.

## 14.2 Route Logic QA

- [ ] Choice A increases `brukDuty`.
- [ ] Choice B increases `brukHospitality` and grants the stage true flag.
- [ ] Choice C increases `brukGrandCharge`.
- [ ] True Ending unlocks at 5+ Bruk true flags.
- [ ] Perfect True Ending extra line unlocks at 6 true flags.
- [ ] Banquet Parade variant unlocks at `brukGrandCharge >= 3`.
- [ ] Skipping route scenes does not break progression.
- [ ] Route flags persist through save/load.

## 14.3 Gameplay Integration QA

- [ ] Stage 1 Bruk scene interacts with sticky/sprinkle/cupcake mechanics.
- [ ] Stage 2 Bruk scene interacts with junk queue/board shake.
- [ ] Stage 3 Bruk scene interacts with freeze or shield safety.
- [ ] Stage 4 Bruk scene interacts with Sleepy/shield effects.
- [ ] Stage 5 Bruk scene interacts with Fever/tickets/cascade objectives.
- [ ] Stage 6 Bruk scene interacts with royal blocks/pattern warnings.
- [ ] Bruk passive or route bonuses never fully invalidate boss mechanics.

---

# 15. Writer Notes for Future Bruk Scenes

When writing more Bruk scenes, begin by asking:

```text
What is Bruk guarding?
Who is hungry, frightened, excluded, or overprotective?
Can the shield become a table, tray, wall, bridge, or promise?
Is the joke coming from Bruk's seriousness, not from mocking him?
Does the scene move him from defense toward hospitality?
```

A good Bruk line should feel sturdy enough to hold a shield and warm enough to offer a plate.

