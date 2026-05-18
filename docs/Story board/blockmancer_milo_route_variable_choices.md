# Blockmancer Dungeon — Milo Route Dialogue & Storyboard
## Variable Choice Label Pass — Milo First Draft

**Document purpose:**  
This file prepares Milo's character route as the first full example for the revised dialogue system.

The goal is to fix the earlier problem where every stage reused the same choice labels and sentence patterns. Milo's route now has:

- stage-specific story build-up;
- unique choice label text per stage;
- different player lines per stage;
- different route flags per stage;
- distinct practical / true-insight / risky-festival options;
- boss-state callbacks;
- Normal Ending and True Ending logic;
- implementation notes for data-driven dialogue.

This is written for the same cheerful Brixonia festival world and should remain warm, bright, and readable on mobile.

---

# 1. Milo Voice Bible

## 1.1 Core Voice

Milo is a gentle apprentice Blockmancer who hears the tiny language of rune blocks.

He does not sound like a confident hero or a joke machine.  
He sounds like someone carefully listening to a room before touching anything.

### Milo speaks with:

- soft certainty;
- careful spatial words;
- listening verbs;
- short pauses;
- humble confidence;
- occasional block-sound words like **plink**, **plonk**, **hum**, **tick**, **tap**, **hush**, and **chime**;
- practical kindness.

### Milo avoids:

- loud bragging;
- sarcastic meme-style comments;
- long technical explanations;
- overly poetic speeches;
- angry heroic declarations.

### Example Milo line style

```text
Milo: "The board is not angry. It is crowded. Give it one quiet corner, and it may tell us the rest."
```

```text
Milo: "That was not a mistake. That was a frightened plink trying to become a brave plonk."
```

```text
Milo: "Left side first. Slowly. The little blue rune is holding its breath."
```

---

## 1.2 Milo Choice Philosophy

Every Milo choice should feel like one of three different ways to listen.

| Route Lean | Meaning | Milo Behavior |
| --- | --- | --- |
| Practical / Normal | Solve the immediate board problem first. | Milo makes space, protects the run, and keeps the room safe. |
| True / Insight | Understand the hidden emotional or magical pattern. | Milo listens longer, learns the Block-O-Matic's deeper language, and gains a true-route flag. |
| Risky / Festival | Trust a strange rhythm for a bigger reward. | Milo follows a playful block-song and risks an Oopsie or harder hazard. |

## 1.3 Choice Label Rules

Choice labels should **not** reuse the same words every stage.

Bad repeated labels:

```text
Make the board safe first
Listen beneath the hazard
Trust the plink-plonk rhythm
```

Better Milo labels:

```text
Sweep a Sprinkle Corner
Name the Counterbeat
Wait for the Ice to Answer
Learn the Nap-Song
Hear the Quiet Between Chimes
Ask the Palace Why
```

Each label should be:

- 2–6 words;
- specific to the stage;
- easy to read on mobile;
- recognizable as Milo's gentle listening style.

---

# 2. Route Variables

## 2.1 Route Scores

```ts
type MiloRouteState = {
  miloAffinity: number;       // practical kindness, Normal route stability
  miloInsight: number;        // true understanding, True route progress
  miloFestivalGrace: number;  // risky playful trust, optional variant rewards
  miloFlags: string[];
};
```

## 2.2 True Route Flags

| Stage | Flag | Meaning |
| ---: | --- | --- |
| 1 | `milo_flag_heard_first_tremble` | Milo hears that the blocks are frightened, not hostile. |
| 2 | `milo_flag_named_machine_counterbeat` | Milo learns the workshop machines are copying the wrong rhythm. |
| 3 | `milo_flag_waited_for_slow_runes` | Milo proves he can listen without rushing. |
| 4 | `milo_flag_learned_nap_song` | Milo discovers the dungeon also needs rest, not only repair. |
| 5 | `milo_flag_heard_between_chimes` | Milo hears the quiet beneath the arcade score noise. |
| 6 | `milo_flag_asked_palace_why` | Milo understands Bloxley's order is loneliness in disguise. |

## 2.3 Ending Conditions

### Milo Normal Ending

Unlock if:

```text
Defeat King Bloxley as Milo
AND miloInsight < 5
```

or:

```text
Defeat King Bloxley as Milo
AND fewer than 5 Milo true-route flags collected
```

### Milo True Ending

Unlock if:

```text
Defeat King Bloxley as Milo
AND collect at least 5 Milo true-route flags
AND miloInsight >= 5
```

Optional stronger version:

```text
All 6 Milo true-route flags collected
```

### Festival Grace Variant

If:

```text
miloFestivalGrace >= 3
```

then add a small bonus scene after either ending where the blocks perform a bright, slightly crooked festival song for Milo.

---

# 3. Route Overview

Milo's route is about learning that the dungeon is not simply messy.

At first, he believes he only needs to arrange blocks correctly.  
Stage by stage, he discovers the blocks are carrying messages:

1. **Sprinkle Sewers** — fear.
2. **Goblin Workshop** — confusion.
3. **Frosty Pantry** — patience.
4. **Pillow Castle** — rest.
5. **Starfall Arcade** — attention.
6. **Bloxley's Block Palace** — loneliness.

Normal route Milo becomes a capable Junior Emergency Dungeon Organizer.

True route Milo becomes the first Blockmancer who can invite the Block-O-Matic itself into the festival.

---

# 4. Shared Milo Route UI Notes

## 4.1 Dialogue Card Layout

Recommended mobile card order:

```text
Scene Title
1–2 short narration lines
Speaker portrait + dialogue
Choice A / B / C
Small route-result text after selection
Return to battle/map
```

## 4.2 Choice Card Style

Each choice should show:

```text
Choice Label
1-line preview
Route Lean icon
```

Example:

```text
Sweep a Sprinkle Corner
Make safe space before asking questions.
[Practical]
```

---

# 5. SCN_MILO_01 — Sprinkle Sewers
## First Tremble Beneath the Frosting

```yaml
sceneId: SCN_MILO_01
hero: hero_milo_blockmancer
stage: stage_1_sprinkle_sewers
location: Sprinkle Sewers — Frosting Pipe Alcove
trigger: First Milo route event in Stage 1
trueFlag: milo_flag_heard_first_tremble
normalScore: miloAffinity
trueScore: miloInsight
riskyScore: miloFestivalGrace
```

## 5.1 Story Lead-Up

The first route scene begins after Milo has cleared enough of the Sprinkle Sewers to hear something beneath the dripping frosting pipes.

The sewers are cheerful, but not calm. Rainbow water sloshes through candy-stone gutters. Cupcake Slimes wobble nearby with frosting hats tilted over their eyes. Sticky blocks cling to the board with tiny squeaks.

Milo pauses beside a pipe where pink frosting has hardened around a cluster of rune blocks.

At first, the blocks sound like they are simply stuck.

Then one little rune trembles.

This is the first sign that the dungeon's blocks are not only magical clutter. They are frightened pieces of a machine that woke up too suddenly.

## 5.2 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | Milo steps into a candy sewer alcove lit by soft sprinkle lanterns. |
| 2 | Sticky blocks pulse faintly inside hardened frosting. |
| 3 | Bloop peeks from behind a gumdrop pipe and makes a tiny warning sound. |
| 4 | The board preview flickers. One sprinkle block trembles out of rhythm. |
| 5 | Dialogue card opens. |

## 5.3 Pre-Choice Dialogue

```text
Milo: "Hold on. That was not a drip."

Bloop: "Bloop?"

Milo: "The little yellow rune made a sound before the frosting pulled at it."

Festival Announcer: "Attention, festival guests. The sewer alcove is now quieter than usual, which is suspiciously meaningful."

Block-O-Matic 3000: "Observation: sticky blockage detected. Emotional classification: uncertain wobble."

Milo: "No, not uncertain. Frightened."

Bloop: "Bloo...?"

Milo: "Yes. I think so. It is trying to say, 'Please do not stack me where I cannot breathe.'"
```

## 5.4 Dialogue Choices

### A. Practical / Normal Lean

**Choice Label:** `Sweep a Sprinkle Corner`  
**Choice Preview:** Make safe space before asking deeper questions.

```text
Player Line:
Milo: "First, a corner. Every frightened sound needs somewhere to sit."

NPC Response:
Bloop: "Bloop!"

Narration:
Milo clears the nearest sticky cluster and opens a small safe pocket on the board. The trembling rune settles, but the deeper message fades before he can hear all of it.

Gameplay Result:
- Remove 2 sticky blocks at battle start, or
- Convert 1 sticky block into `block_sprinkle`.

Route Result:
+1 miloAffinity
Normal route lean.
```

### B. True / Insight Lean

**Choice Label:** `Hear the First Tremble`  
**Choice Preview:** Pause long enough to learn what the blocks fear.

```text
Player Line:
Milo: "I will not pull you free until I know what hurt you."

NPC Response:
Bloop presses close to the frosting pipe and hums a round little note.

Bloop: "Bloo-oop."

Narration:
The trembling rune answers in two tiny sounds: plink, hush. Milo hears the first true pattern. The blocks are not angry about falling. They are afraid of being placed without being heard.

Gameplay Result:
- Sticky blocks show a 1-piece warning shimmer before hardening for the next 2 battles.
- First cascade in this battle grants bonus mana.

Grant Flag:
milo_flag_heard_first_tremble

Route Result:
+1 miloInsight
True route progress.
```

### C. Risky / Festival Flourish

**Choice Label:** `Follow the Sugarbeat`  
**Choice Preview:** Trust the sewer's candy rhythm for a brighter reward.

```text
Player Line:
Milo: "All right. Plink on the left, plonk on the right. I will follow before the frosting changes its mind."

NPC Response:
The sewer pipes answer with bright candy notes. Bloop bounces once, then immediately looks concerned.

Bloop: "Bloop?!"

Narration:
Milo follows the strange sugarbeat and sets up a daring chain. The room sparkles with mana sprinkles, but the frosting pipes wake up and demand a livelier board.

Gameplay Result:
- Add 2 `block_sprinkle` to the starting board.
- 25% chance to gain `oops_sticky_floor` for this stage only, or spawn 1 extra sticky block in the next fight.

Route Result:
+1 miloFestivalGrace
May unlock a later bonus bark.
```

## 5.5 Post-Choice Battle Bark Pool

```text
Milo: "There. A little room. Keep breathing, small one."

Milo: "The board is crowded, not cruel."

Milo: "Plink first. Then wait. The plonk comes after."

Bloop: "Bloop-bloop."

Block-O-Matic 3000: "Acoustic block response recorded. Adjusting stickiness with cautious optimism."
```

## 5.6 Victory Callback

```text
Milo: "It sounds lighter now. Not fixed, maybe, but less alone."
```

## 5.7 Boss Callback — Cupcake Slime King

If `milo_flag_heard_first_tremble` is active:

```text
Cupcake Slime King: "Gloop! Frosting is for hugging!"

Milo: "Only if the little runes can still breathe."

Cupcake Slime King: "Gloop?"

Milo: "We can make room for cake and corners."
```

Boss effect:

```text
Cupcake Slime King starts with 1 fewer sticky block wave.
```

---

# 6. SCN_MILO_02 — Goblin Workshop
## The Counterbeat in the Gears

```yaml
sceneId: SCN_MILO_02
hero: hero_milo_blockmancer
stage: stage_2_goblin_workshop
location: Goblin Workshop — Misaligned Conveyor Chapel
trigger: First Milo route event in Stage 2
trueFlag: milo_flag_named_machine_counterbeat
```

## 6.1 Story Lead-Up

By the time Milo reaches the Goblin Workshop, the dungeon has become louder.

The machines do not simply clank. They chatter. Springs twang. Conveyor belts carry pieces one way, then apologize by carrying them back. Toy bombs roll in tidy circles, proud of themselves for not exploding yet.

A row of goblin machines stamps rune pieces with the wrong rhythm. Their blocks fall in patterns that almost make sense, then trip over one extra beat.

Milo hears the problem: the machines are trying to copy the Block-O-Matic, but they have mistaken panic for music.

## 6.2 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | Milo enters a narrow conveyor room with brass gears and painted safety stars. |
| 2 | A goblin stamping machine taps out a crooked rhythm: tick-tick-plonk-tick. |
| 3 | Junk blocks appear in the preview queue, each stamped with tiny gear marks. |
| 4 | Bloop sits on a toolbox, listening with serious roundness. |
| 5 | Dialogue card opens with a soft mechanical hum underneath the music. |

## 6.3 Pre-Choice Dialogue

```text
Milo: "That machine is not broken in the usual way."

Bloop: "Bloop?"

Milo: "It is copying a sound it does not understand."

Block-O-Matic 3000: "Workshop unit output: ninety-two percent enthusiastic, thirty-one percent aligned, twelve percent apology."

Festival Announcer: "The festival reminds all machines that enthusiasm is not a substitute for rhythm."

Milo: "There. Hear it? The gears are answering a panic beat."

Bloop: "Bloop... tick?"

Milo: "Yes. Tick where it should plink. Plonk where it should rest."
```

## 6.4 Dialogue Choices

### A. Practical / Normal Lean

**Choice Label:** `Sort the Noisy Gears`  
**Choice Preview:** Quiet the workshop enough to keep the board stable.

```text
Player Line:
Milo: "I will steady the loudest gear first. The small sounds can wait one turn."

NPC Response:
Bloop nods with the solemn dignity of a slime appointed assistant mechanic.

Bloop: "Bloop."

Narration:
Milo adjusts the nearest conveyor rhythm and clears the worst of the junk pressure. The board becomes safer, though the hidden counterbeat slips deeper into the machines.

Gameplay Result:
- Reduce next incoming junk queue by 2.
- Next board shake has reduced duration.

Route Result:
+1 miloAffinity
Normal route lean.
```

### B. True / Insight Lean

**Choice Label:** `Name the Counterbeat`  
**Choice Preview:** Identify the wrong rhythm before fixing the machine.

```text
Player Line:
Milo: "It is not noise. It is a second song trying to stand inside the first."

NPC Response:
The stamping machine pauses. One gear turns backward, then forward, as if embarrassed.

Block-O-Matic 3000: "Correction accepted. Sub-pattern identified: counterbeat. Emotional classification updated: confused imitation."

Bloop: "Bloop-bloop!"

Narration:
Milo gives the rhythm a name, and the workshop recognizes it. For a moment, every conveyor belt moves in the right direction at the same time.

Gameplay Result:
- Machines pause 1 tick before spawning junk for the next 2 workshop battles.
- Bomb blocks no longer spawn adjacent to fresh junk during this scene's battle.

Grant Flag:
milo_flag_named_machine_counterbeat

Route Result:
+1 miloInsight
True route progress.
```

### C. Risky / Festival Flourish

**Choice Label:** `Ride the Conveyor Song`  
**Choice Preview:** Let the machinery carry the next cascade.

```text
Player Line:
Milo: "If the belts insist on singing, we may as well step in time."

NPC Response:
A conveyor belt gives a proud little squeal and launches a harmless spring into the air.

Festival Announcer: "Workshop waltz detected. Please keep hands, hats, and heroic intentions inside the marked area."

Narration:
Milo times the board to the conveyor song. The pieces slide into a surprisingly graceful chain, but the machines become thrilled and over-helpful.

Gameplay Result:
- Start next battle with 1 `block_bomb`.
- 25% chance to queue 2 delayed junk blocks after 3 pieces.

Route Result:
+1 miloFestivalGrace
May alter Prototype No. 7 intro dialogue.
```

## 6.5 Post-Choice Battle Bark Pool

```text
Milo: "Tick is not bad. It only needs somewhere to land."

Milo: "Careful. That gear is trying very hard to help."

Milo: "Plink, tick, plonk. There. The machine can breathe too."

Bloop: "Bloop-tick!"

Block-O-Matic 3000: "Counterbeat calibration improved. Workshop dignity partially restored."
```

## 6.6 Victory Callback

```text
Milo: "The gears still argue, but now they are taking turns."
```

## 6.7 Boss Callback — Prototype No. 7

If `milo_flag_named_machine_counterbeat` is active:

```text
Prototype No. 7: "I AM OPERATING AT MAXIMUM HELPFULNESS."

Milo: "You are operating at maximum panic."

Prototype No. 7: "DIFFERENCE NOT FOUND."

Milo: "Then we will find it together. Slowly."
```

Boss effect:

```text
Prototype No. 7 delays first junk queue by +1 piece.
```

---

# 7. SCN_MILO_03 — Frosty Pantry
## The Long Pause of Ice

```yaml
sceneId: SCN_MILO_03
hero: hero_milo_blockmancer
stage: stage_3_frosty_pantry
location: Frosty Pantry — Rainbow Freezer Gallery
trigger: First Milo route event in Stage 3
trueFlag: milo_flag_waited_for_slow_runes
```

## 7.1 Story Lead-Up

The Frosty Pantry is quiet in a different way.

In the sewers, the blocks trembled.  
In the workshop, they argued.  
Here, they answer slowly.

Rune blocks sit beneath layers of sparkling frost. Their sounds stretch thin and silver, like bells heard through snow. The board asks for patience, and Milo feels how difficult patience can be when pieces are still falling.

A frozen blue rune begins to speak, but each word arrives one breath late.

## 7.2 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | Milo walks between freezer shelves filled with rainbow gelato jars. |
| 2 | Blue and white rune blocks gleam under frost. |
| 3 | A slow chime travels from one block to another. |
| 4 | The active piece becomes rimmed with ice, but does not freeze yet. |
| 5 | Dialogue card opens while snowflake particles drift across the UI. |

## 7.3 Pre-Choice Dialogue

```text
Milo: "This place is not silent."

Bloop: "Bloop?"

Milo: "It is speaking very, very slowly."

Block-O-Matic 3000: "Thermal delay detected. Message delivery speed reduced by seventy-four percent."

Festival Announcer: "The pantry requests patience. Also mittens, where available."

Milo: "If I hurry, I will only hear the first half of every word."

Bloop: "Bloo... ooop."

Milo: "Exactly. Like that."
```

## 7.4 Dialogue Choices

### A. Practical / Normal Lean

**Choice Label:** `Clear a Warm Pocket`  
**Choice Preview:** Make room before the frost closes in.

```text
Player Line:
Milo: "I will warm one small place. The rest can thaw after the board is safe."

NPC Response:
Bloop presses against the nearest ice block like a determined little hand warmer.

Narration:
Milo clears a warm pocket in the frozen board. The immediate freeze danger softens, but the slowest rune never finishes its sentence.

Gameplay Result:
- Prevent the next freeze on active piece.
- Convert 1 `block_ice` into a normal blue rune.

Route Result:
+1 miloAffinity
Normal route lean.
```

### B. True / Insight Lean

**Choice Label:** `Wait for the Ice to Answer`  
**Choice Preview:** Let the slow rune finish speaking.

```text
Player Line:
Milo: "I hear you. I will not answer until your last chime arrives."

NPC Response:
The frozen rune glows once, then waits, then glows again. Bloop copies the rhythm with careful patience.

Bloop: "Bloop... ...bloop."

Narration:
Milo resists the urge to fix the board too quickly. The frozen rune completes its message: not every delay is danger. Some delays are how the dungeon asks to be treated gently.

Gameplay Result:
- Freeze warning window expands by +1 piece once per Frosty Pantry battle.
- First ice block cleared in each battle grants small mana.

Grant Flag:
milo_flag_waited_for_slow_runes

Route Result:
+1 miloInsight
True route progress.
```

### C. Risky / Festival Flourish

**Choice Label:** `Drop on the Second Chime`  
**Choice Preview:** Time a cascade to the pantry's slow bell.

```text
Player Line:
Milo: "Not the first chime. The second. That is where the blue rune breathes."

NPC Response:
The freezer shelves ring like tiny glass bells. Bloop looks impressed and slightly chilly.

Narration:
Milo waits until the second chime and drops the piece into a narrow opening. The cascade is beautiful, but the pantry answers with a playful freeze wave.

Gameplay Result:
- Next cascade deals +25% damage.
- 25% chance to trigger a short speed-wave after the cascade.

Route Result:
+1 miloFestivalGrace
May unlock a special Frosty Pantry victory bark.
```

## 7.5 Post-Choice Battle Bark Pool

```text
Milo: "Slow is still a sound."

Milo: "Wait. The ice has not finished its plonk."

Milo: "Blue rune on the right. It is cold, not stubborn."

Bloop: "Bloo...oop."

Block-O-Matic 3000: "Patience variable increased. Frost complaint volume reduced."
```

## 7.6 Victory Callback

```text
Milo: "I think the pantry was not asking us to hurry. It was asking us to stay."
```

## 7.7 Boss Callback — Gelato Golem

If `milo_flag_waited_for_slow_runes` is active:

```text
Gelato Golem: "Slow... scoop... slow... stomp."

Milo: "I can wait."

Gelato Golem: "Most... do... not."

Milo: "Then I will be most unusual."
```

Boss effect:

```text
First freeze warning from Gelato Golem has +1 piece counter window.
```

---

# 8. SCN_MILO_04 — Pillow Castle
## The Nap-Song Under the Blankets

```yaml
sceneId: SCN_MILO_04
hero: hero_milo_blockmancer
stage: stage_4_pillow_castle
location: Pillow Castle — Quilt Hall of Almost-Naps
trigger: First Milo route event in Stage 4
trueFlag: milo_flag_learned_nap_song
```

## 8.1 Story Lead-Up

Pillow Castle is softer than the other stages, but not easier to hear.

Blanket Ghosts drift through quilted halls. Button Knights stand guard with their eyes half-closed. Plush dragons breathe warm cotton-candy sparks in their sleep.

Here, the blocks do not tremble or argue. They yawn.

Milo realizes the dungeon has been awake since the disaster began. Even magical machines and rune blocks need rest. If the party only pushes forward, the castle will defend its sleep with soft walls, shielded enemies, and drowsy hazards.

## 8.2 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | Milo enters a hall of stacked pillows and hanging quilts. |
| 2 | A sleepy rune block blinks like a night-light. |
| 3 | Blanket Ghosts drift across the background, carrying tiny pillows. |
| 4 | The board dims slightly as Sleepy status hovers near the UI. |
| 5 | Dialogue card opens with a lullaby-like rhythm. |

## 8.3 Pre-Choice Dialogue

```text
Milo: "Do you hear that?"

Bloop: "Bloop?"

Milo: "No clanks. No frosting squeaks. No freezer bells."

Festival Announcer: "Pillow Castle asks all visitors to lower their voices and their heroic expectations."

Block-O-Matic 3000: "Drowsiness density elevated. Combat efficiency may become politely horizontal."

Milo: "The blocks are not asking us to win louder."

Bloop: "Bloop..."

Milo: "They are asking whether anyone will let them rest."
```

## 8.4 Dialogue Choices

### A. Practical / Normal Lean

**Choice Label:** `Tuck the Board In`  
**Choice Preview:** Calm the Sleepy hazard before it spreads.

```text
Player Line:
Milo: "We will make the board tidy enough to rest without tripping over itself."

NPC Response:
Bloop pulls a tiny napkin over one corner of the board like a blanket.

Narration:
Milo clears the most tangled soft blocks and prevents the castle's Sleepy magic from spreading too quickly. The room relaxes, but its oldest lullaby remains hidden.

Gameplay Result:
- Remove 1 soft block or shield block from the starting board.
- Reduce first Sleepy duration by 1 turn.

Route Result:
+1 miloAffinity
Normal route lean.
```

### B. True / Insight Lean

**Choice Label:** `Learn the Nap-Song`  
**Choice Preview:** Listen to the castle's rest rhythm.

```text
Player Line:
Milo: "I will count the pauses. One for the pillow, one for the block, one for the machine."

NPC Response:
A Blanket Ghost stops drifting and, very carefully, hums three notes.

Bloop: "Bloop... bloop... bloop."

Narration:
Milo learns the Nap-Song: a rhythm that tells the board when to move and when to leave a piece alone. The castle lowers its defenses, not because it is defeated, but because it has been respected.

Gameplay Result:
- Once per Pillow Castle battle, first Sleepy effect becomes a small shield instead.
- Soft blocks cleared by cascade grant +1 mana.

Grant Flag:
milo_flag_learned_nap_song

Route Result:
+1 miloInsight
True route progress.
```

### C. Risky / Festival Flourish

**Choice Label:** `Tiptoe Through the Cascade`  
**Choice Preview:** Set up a quiet chain without waking the guards.

```text
Player Line:
Milo: "Tiny steps. Quiet drops. Let the cascade walk in slippers."

NPC Response:
The nearest Button Knight snores approvingly. Bloop raises a tiny imaginary finger to its mouth.

Narration:
Milo builds a delicate cascade through the soft blocks. It works beautifully if kept gentle, but one loud drop may wake the castle's shield magic.

Gameplay Result:
- If the player triggers a cascade within the next 5 pieces, gain rare reward chance.
- If no cascade occurs, next enemy gains temporary shield.

Route Result:
+1 miloFestivalGrace
May open a shortcut event in Stage 4.
```

## 8.5 Post-Choice Battle Bark Pool

```text
Milo: "Softly. The board is almost asleep."

Milo: "Not every block wants to fall quickly."

Milo: "That gap is a pillow. Let the piece land gently."

Bloop: "Bloop-shhh."

Block-O-Matic 3000: "Nap-Song partially integrated. Yawn subroutine contained."
```

## 8.6 Victory Callback

```text
Milo: "We did not wake the whole castle. That feels like a victory with manners."
```

## 8.7 Boss Callback — Sir Snore-a-Lot

If `milo_flag_learned_nap_song` is active:

```text
Sir Snore-a-Lot: "Who approaches the sacred nap?"

Milo: "Someone who has learned to close the door quietly."

Sir Snore-a-Lot: "Honorable."

Milo: "Sleep well after this. We will keep the board neat."
```

Boss effect:

```text
Sir Snore-a-Lot's first Sleepy action grants reduced duration or a small player shield.
```

---

# 9. SCN_MILO_05 — Starfall Arcade
## The Quiet Between Chimes

```yaml
sceneId: SCN_MILO_05
hero: hero_milo_blockmancer
stage: stage_5_starfall_arcade
location: Starfall Arcade — Prize Counter of Very Loud Triumphs
trigger: First Milo route event in Stage 5
trueFlag: milo_flag_heard_between_chimes
```

## 9.1 Story Lead-Up

Starfall Arcade is the loudest place in the dungeon.

Score bells ring. Token Sprites zip through neon rails. Combo Gremlins cheer for bigger chains and boo politely when nothing explodes. Every cabinet flashes with messages about points, prizes, streaks, and absolutely official festival records.

At first, Milo cannot hear the blocks at all.

Then he realizes the lesson of the arcade is not louder listening. It is listening in the little silence after each chime.

The blocks do not want to be impressive. They want to be noticed before the next score light covers them.

## 9.2 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | Milo stands before a glowing arcade cabinet shaped like a falling-block board. |
| 2 | Score lights flash: COMBO! FEVER! PRIZE! |
| 3 | The board preview sparkles too brightly to read for a moment. |
| 4 | Bloop wears a tiny paper ticket like a cape. |
| 5 | Dialogue card opens during the half-second after a score bell fades. |

## 9.3 Pre-Choice Dialogue

```text
Milo: "I cannot hear them."

Bloop: "Bloop?"

Milo: "Not because they stopped. Because everything else is trying to be important."

Festival Announcer: "Starfall Arcade proudly presents several hundred exciting noises, most of them approved."

Block-O-Matic 3000: "Score pressure elevated. Listening accuracy reduced by prize-light interference."

Milo: "Then we wait for the small space after the bell."

Bloop: "Bloop."

Milo: "Yes. The quiet there is thin, but it is real."
```

## 9.4 Dialogue Choices

### A. Practical / Normal Lean

**Choice Label:** `Dim the Score Lights`  
**Choice Preview:** Reduce visual noise and stabilize the board.

```text
Player Line:
Milo: "I will lower the lights just enough to see the pieces."

NPC Response:
Bloop taps a prize button. The nearest cabinet politely becomes less dazzling.

Narration:
Milo dims the arcade pressure and regains control of the board. The room becomes easier to read, though the hidden quiet remains only half-heard.

Gameplay Result:
- Prevent next preview flash or reduce preview disruption.
- Fever gain +10% for this battle.

Route Result:
+1 miloAffinity
Normal route lean.
```

### B. True / Insight Lean

**Choice Label:** `Hear Between Chimes`  
**Choice Preview:** Listen in the silence after the score bell.

```text
Player Line:
Milo: "Do not speak at the bell. Speak after it. I will be there."

NPC Response:
The arcade cabinet rings once. Milo waits. In the tiny silence afterward, three star blocks pulse like a whispered answer.

Bloop: "Bloop..."

Narration:
Milo hears the blocks beneath the arcade's excitement. They are not asking for higher scores. They are asking to matter even when no one is cheering.

Gameplay Result:
- First star block cleared in each Stage 5 battle adds extra Fever and mana.
- Combo Gremlin's no-cascade punishment warning appears 1 piece earlier.

Grant Flag:
milo_flag_heard_between_chimes

Route Result:
+1 miloInsight
True route progress.
```

### C. Risky / Festival Flourish

**Choice Label:** `Play the Shimmer Pattern`  
**Choice Preview:** Match the arcade's rhythm for a prize cascade.

```text
Player Line:
Milo: "If the lights insist on dancing, I will ask the blocks for the first step."

NPC Response:
The prize counter spills three tickets into Bloop's path. Bloop looks rich and deeply unprepared.

Festival Announcer: "Shimmer Pattern accepted. Please enjoy either glory or educational chaos."

Narration:
Milo follows the arcade's shimmer pattern and primes the board for a high-value cascade. The prize lights brighten, and the arcade expects a performance.

Gameplay Result:
- Next cascade grants +1 reward roll or extra tickets.
- If no cascade happens within 6 pieces, gain `oops_too_much_confetti` for this stage only.

Route Result:
+1 miloFestivalGrace
May alter High Score Hydra dialogue.
```

## 9.5 Post-Choice Battle Bark Pool

```text
Milo: "Wait for the bell to fade."

Milo: "A high score is loud. A kind stack is steadier."

Milo: "Star block on the left. It wants to shine after the chime."

Bloop: "Bloop-ticket!"

Block-O-Matic 3000: "Prize-light interference reduced. Humble scoring mode considered."
```

## 9.6 Victory Callback

```text
Milo: "That was still very bright. But I heard them."
```

## 9.7 Boss Callback — High Score Hydra

If `milo_flag_heard_between_chimes` is active:

```text
High Score Hydra: "COMBO HIGHER! SCORE LOUDER! WIN BRIGHTER!"

Milo: "May I listen smaller?"

High Score Hydra: "SMALLER IS NOT ON THE SCOREBOARD."

Milo: "Then the scoreboard is missing something."
```

Boss effect:

```text
High Score Hydra's first combo punishment warning appears earlier and is easier to counter.
```

---

# 10. SCN_MILO_06 — Bloxley's Block Palace
## The Palace That Forgot How to Ask

```yaml
sceneId: SCN_MILO_06
hero: hero_milo_blockmancer
stage: stage_6_bloxleys_block_palace
location: Bloxley's Block Palace — Royal Symmetry Hall
trigger: First Milo route event in Stage 6 before King Bloxley
trueFlag: milo_flag_asked_palace_why
```

## 10.1 Story Lead-Up

Bloxley's Block Palace is beautiful in a strict, uncomfortable way.

Every banner hangs exactly straight. Every carpet square points the same direction. Royal blocks line the halls in perfect colors, perfect rows, perfect silence.

At first, Milo thinks this is order.

Then he notices that none of the blocks are speaking.

They have been arranged so tightly that no tiny plink can escape.

King Bloxley did not only build a palace. He built a place where nothing has to ask for attention because everything is already assigned a position.

Milo understands the final route question:

Is order still kind if nobody inside it can breathe?

## 10.2 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | Milo enters a shining square hall with royal blocks fitted like tiles. |
| 2 | The hall is symmetrical, but stiff. No block glow flickers naturally. |
| 3 | Bloop rolls forward and makes no echo. |
| 4 | The Block-O-Matic emits a low diagnostic hum that almost sounds sad. |
| 5 | Dialogue card opens before the final royal seal. |

## 10.3 Pre-Choice Dialogue

```text
Milo: "It is too quiet."

Bloop: "Bloop?"

Milo: "Not resting quiet. Not listening quiet."

Block-O-Matic 3000: "Royal arrangement detected. Variance: zero. Comfort: unconfirmed."

Festival Announcer: "Bloxley's Palace requests admiration in straight lines."

Milo: "The blocks are not arguing anymore."

Bloop: "Bloop..."

Milo: "That is what worries me."
```

## 10.4 Dialogue Choices

### A. Practical / Normal Lean

**Choice Label:** `Loosen the Royal Corners`  
**Choice Preview:** Break the seal safely and prepare for Bloxley.

```text
Player Line:
Milo: "We will loosen the corners first. Even a palace needs room at the edges."

NPC Response:
Bloop presses against a royal block until it shifts one tiny, scandalous inch.

Narration:
Milo softens the palace pattern enough to move forward safely. The royal silence cracks, but its reason remains mostly hidden.

Gameplay Result:
- Convert 1 `block_royal` into a normal rune at boss start.
- Reduce first royal pattern difficulty slightly.

Route Result:
+1 miloAffinity
Normal route lean.
```

### B. True / Insight Lean

**Choice Label:** `Ask the Palace Why`  
**Choice Preview:** Question the silence instead of only breaking it.

```text
Player Line:
Milo: "Who told you that perfect rows were safer than being heard?"

NPC Response:
The palace does not answer at once. Then a single royal block gives the smallest possible plink.

Block-O-Matic 3000: "Unexpected query received. Palace silence contains archived loneliness."

Bloop: "Bloop..."

Narration:
Milo asks the palace why it became so still. The answer is faint but clear: Bloxley's order is not cruelty first. It is fear of being ignored unless everything stays perfectly in place.

Gameplay Result:
- Royal pattern warnings appear 1 piece earlier.
- Once during the final boss, a royal block may convert into a star block after a cascade.

Grant Flag:
milo_flag_asked_palace_why

Route Result:
+1 miloInsight
True route progress.
```

### C. Risky / Festival Flourish

**Choice Label:** `Dance the Crooked Square`  
**Choice Preview:** Break symmetry with a joyful pattern.

```text
Player Line:
Milo: "A square can still dance if one corner is brave."

NPC Response:
Bloop gasps in slime language. The nearest royal carpet rotates half an inch and looks delighted with itself.

Festival Announcer: "Unauthorized palace dancing detected. The festival will allow it on artistic grounds."

Narration:
Milo introduces a crooked rhythm into Bloxley's perfect hall. The palace brightens with forbidden cheer, but the royal guards take the disturbance personally.

Gameplay Result:
- Add 1 `block_star` to the final boss starting board.
- 25% chance King Bloxley begins with an extra royal block pattern.

Route Result:
+1 miloFestivalGrace
Unlocks festival-grace ending variant if route threshold is met.
```

## 10.5 Post-Choice Battle Bark Pool

```text
Milo: "A perfect row can still be lonely."

Milo: "Let one corner breathe. The rest will remember."

Milo: "Plink. There it is. The palace still has a voice."

Bloop: "Bloop..."

Block-O-Matic 3000: "Royal silence compromised. Emotional ventilation improved."
```

## 10.6 Victory Callback Before Final Boss

```text
Milo: "I think he built all of this so no one would have to ask where he belonged."
```

---

# 11. Final Boss Dialogue — Milo vs King Bloxley

```yaml
sceneId: SCN_MILO_FINAL_BOSS
trigger: Enter final boss as Milo
conditionVariants:
  normal: fewer than 5 true flags
  true: at least 5 true flags
  festivalGrace: miloFestivalGrace >= 3
```

## 11.1 Standard Opening

```text
King Bloxley: "At last! The lemonade apprentice arrives at the royal center of proper geometry."

Milo: "I am also a Blockmancer."

King Bloxley: "A junior one."

Milo: "Yes."

King Bloxley: "You admit it?"

Milo: "It is easier to stack from where I am actually standing."

King Bloxley: "Hmph. Sensible. Annoyingly unsquare, but sensible."
```

## 11.2 If True Route Flags >= 5

```text
Milo: "Your palace is very quiet."

King Bloxley: "Because it is orderly."

Milo: "No. Because nothing inside it is allowed to answer."

King Bloxley: "Answering creates disagreement. Disagreement creates wobble. Wobble creates collapse."

Milo: "Sometimes wobble is how a thing says it is alive."

King Bloxley: "I was ignored when I was a mascot."

Milo: "So you made a kingdom where no one could ignore you."

King Bloxley: "A king must be seen."

Milo: "A friend can be heard."
```

## 11.3 If Festival Grace >= 3

```text
King Bloxley: "Why is that square dancing?"

Milo: "It had a very persuasive corner."

King Bloxley: "Corners are for discipline!"

Milo: "This one asked for music."

King Bloxley: "Preposterous."

Bloop: "Bloop!"

King Bloxley: "...Moderately rhythmic, but preposterous."
```

## 11.4 Phase Change Dialogue

### Phase 2 — Everything Must Be Square

```text
King Bloxley: "Enough! All rows shall match! All corners shall report for inspection!"

Milo: "Then I will listen to the corners first."

King Bloxley: "Corners do not get opinions!"

Milo: "That may be why they keep wobbling."
```

### Phase 3 — The Lonely Throne

Trigger only if true-route condition is met.

```text
King Bloxley: "Do not unstack my palace."

Milo: "I am not unstacking it."

King Bloxley: "You are making gaps!"

Milo: "Doors."

King Bloxley: "Gaps."

Milo: "Places where someone can come in."
```

---

# 12. Milo Normal Ending
## Junior Emergency Dungeon Organizer

```yaml
sceneId: END_MILO_NORMAL
condition: defeat King Bloxley as Milo, true route condition not met
```

## 12.1 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | The palace folds into neat, harmless blocks. |
| 2 | The festival square reappears under sunset lanterns. |
| 3 | Milo holds a clipboard almost too large for him. |
| 4 | Bloop sits in a tiny assistant basket. |
| 5 | The fountain is still jelly, but now has a sign: "Please do not drink with a straw." |

## 12.2 Ending Dialogue

```text
Festival Announcer: "By festival authority and general relief, Milo is hereby promoted."

Professor Poplin: "From temporary lemonade assistant to Junior Emergency Dungeon Organizer."

Milo: "That is a real title?"

Professor Poplin: "It is now."

Bloop: "Bloop!"

Milo: "Thank you. I will do my best to keep the blocks comfortable and the lemonade mostly upright."

Block-O-Matic 3000: "New operational note: Milo's stacking approach reduces panic, improves festival recovery, and produces acceptable corners."

Milo: "Acceptable corners are a fine beginning."
```

## 12.3 Ending Narration

```text
The blocks stopped falling quite so urgently.

The monsters returned most of the snacks.

King Bloxley agreed to supervise square tablecloths under careful guidance.

And Milo, who had once been trusted with lemons and not much else, became the first person Brixonia called when the board began to hum.
```

## 12.4 Unlock / Reward Suggestions

```text
- Unlock Milo alternate costume: Junior Organizer Vest.
- Unlock starting relic: Tiny Clipboard.
- Add hub building upgrade: Listening Corner.
```

---

# 13. Milo True Ending
## The First Invitation

```yaml
sceneId: END_MILO_TRUE
condition: defeat King Bloxley as Milo, collect at least 5 Milo true-route flags
```

## 13.1 Storyboard Panels

| Panel | Visual |
| ---: | --- |
| 1 | The final cascade stops before clearing the last royal block. |
| 2 | Milo reaches out instead of casting another spell. |
| 3 | The Block-O-Matic opens a small panel shaped like a festival ticket window. |
| 4 | Tiny block voices rise from every restored stage: sewer, workshop, pantry, castle, arcade, palace. |
| 5 | Milo places one handmade invitation card inside the machine. |
| 6 | The machine lights shift from warning red to festival gold. |

## 13.2 Ending Dialogue

```text
King Bloxley: "You won. Clear the last block, then."

Milo: "No."

King Bloxley: "No?"

Milo: "It is still speaking."

King Bloxley: "It is a block."

Milo: "So were you, once."

King Bloxley: "I was a mascot of great structural importance."

Milo: "And nobody asked whether you wanted to join the festival."

King Bloxley: "..."

Block-O-Matic 3000: "Archived statement detected: not invited."

Professor Poplin: "Oh."

Festival Announcer: "The festival requests a brief pause for emotional recalibration."

Milo: "Block-O-Matic 3000?"

Block-O-Matic 3000: "Listening."

Milo: "Would you like to come to the festival as a guest, not only as a machine?"

Block-O-Matic 3000: "Processing."

Bloop: "Bloop."

Block-O-Matic 3000: "Processing with unexpected difficulty."

Milo: "You may take your time."

Block-O-Matic 3000: "Response: yes."
```

## 13.3 True Ending Narration

```text
The dungeon did not disappear.

It unfolded.

The Sprinkle Sewers became a candy-water race.

The Goblin Workshop became a supervised invention booth with only three emergency levers.

The Frosty Pantry opened as a rainbow gelato hall.

Pillow Castle became the official nap tent.

Starfall Arcade rang its bells at a kinder volume.

And Bloxley's Palace became a square dance floor, though King Bloxley insisted the squares remain historically accurate.

Every year after that, the Block-O-Matic 3000 opened the festival dungeon on purpose.

Not as a mistake.

As an invitation.
```

## 13.4 Final True Ending Dialogue

```text
Milo: "There. Hear that?"

Professor Poplin: "The machine?"

Milo: "The whole festival."

Bloop: "Bloop?"

Milo: "Yes. It plinks a little off-beat."

King Bloxley: "A royal off-beat."

Milo: "Of course."

Block-O-Matic 3000: "Festival status: imperfect, audible, accepted."

Festival Announcer: "And with that, the Festival of Falling Stars is officially open."
```

## 13.5 Unlock / Reward Suggestions

```text
- Unlock ending: Milo True End — The First Invitation.
- Unlock hub upgrade: Festival Game Master Stage.
- Unlock Block-O-Matic dialogue barks in future runs.
- Unlock optional route: Professor Poplin.
```

---

# 14. Festival Grace Variant Scene
## The Crooked Little Song

```yaml
sceneId: END_MILO_FESTIVAL_GRACE_VARIANT
condition: miloFestivalGrace >= 3
placement: after Normal or True Ending
```

```text
Narration:
As the lanterns rise, one square in the festival floor shifts half an inch out of line.

King Bloxley notices immediately.

King Bloxley: "That square is crooked."

Milo: "It is dancing."

King Bloxley: "Squares do not dance."

The square gives a tiny plink.

Bloop gives a tiny bloop.

Then, from the Cake Stall to the Arcade Booth, the restored blocks answer one by one.

Plink. Plonk. Chime. Tick. Hush. Bloop.

King Bloxley folds his wooden arms.

King Bloxley: "The rhythm is irregular."

Milo: "Yes."

King Bloxley: "The spacing is inconsistent."

Milo: "Very."

King Bloxley: "The corner work is... surprisingly festive."

Milo: "Would you like the first dance?"

King Bloxley: "For inspection purposes only."

Narration:
And so the festival learned its first crooked little song.
```

---

# 15. Milo Route Choice Label Summary

Use this table for implementation or quick review.

| Stage | Practical / Normal | True / Insight | Risky / Festival |
| ---: | --- | --- | --- |
| 1 Sprinkle Sewers | Sweep a Sprinkle Corner | Hear the First Tremble | Follow the Sugarbeat |
| 2 Goblin Workshop | Sort the Noisy Gears | Name the Counterbeat | Ride the Conveyor Song |
| 3 Frosty Pantry | Clear a Warm Pocket | Wait for the Ice to Answer | Drop on the Second Chime |
| 4 Pillow Castle | Tuck the Board In | Learn the Nap-Song | Tiptoe Through the Cascade |
| 5 Starfall Arcade | Dim the Score Lights | Hear Between Chimes | Play the Shimmer Pattern |
| 6 Bloxley's Block Palace | Loosen the Royal Corners | Ask the Palace Why | Dance the Crooked Square |

---

# 16. Milo Route Data Draft

This is a compact implementation shape for `src/game/content/dialogue/milo-route.json`.

```json
{
  "routeId": "route_milo_blockmancer",
  "heroId": "hero_milo_blockmancer",
  "routeScores": ["miloAffinity", "miloInsight", "miloFestivalGrace"],
  "trueFlags": [
    "milo_flag_heard_first_tremble",
    "milo_flag_named_machine_counterbeat",
    "milo_flag_waited_for_slow_runes",
    "milo_flag_learned_nap_song",
    "milo_flag_heard_between_chimes",
    "milo_flag_asked_palace_why"
  ],
  "trueEndingRequirement": {
    "minInsight": 5,
    "minTrueFlags": 5
  },
  "festivalGraceVariantRequirement": {
    "minFestivalGrace": 3
  },
  "scenes": [
    {
      "sceneId": "SCN_MILO_01",
      "stageId": "stage_1_sprinkle_sewers",
      "choiceLabels": [
        "Sweep a Sprinkle Corner",
        "Hear the First Tremble",
        "Follow the Sugarbeat"
      ]
    },
    {
      "sceneId": "SCN_MILO_02",
      "stageId": "stage_2_goblin_workshop",
      "choiceLabels": [
        "Sort the Noisy Gears",
        "Name the Counterbeat",
        "Ride the Conveyor Song"
      ]
    },
    {
      "sceneId": "SCN_MILO_03",
      "stageId": "stage_3_frosty_pantry",
      "choiceLabels": [
        "Clear a Warm Pocket",
        "Wait for the Ice to Answer",
        "Drop on the Second Chime"
      ]
    },
    {
      "sceneId": "SCN_MILO_04",
      "stageId": "stage_4_pillow_castle",
      "choiceLabels": [
        "Tuck the Board In",
        "Learn the Nap-Song",
        "Tiptoe Through the Cascade"
      ]
    },
    {
      "sceneId": "SCN_MILO_05",
      "stageId": "stage_5_starfall_arcade",
      "choiceLabels": [
        "Dim the Score Lights",
        "Hear Between Chimes",
        "Play the Shimmer Pattern"
      ]
    },
    {
      "sceneId": "SCN_MILO_06",
      "stageId": "stage_6_bloxleys_block_palace",
      "choiceLabels": [
        "Loosen the Royal Corners",
        "Ask the Palace Why",
        "Dance the Crooked Square"
      ]
    }
  ]
}
```

---

# 17. Implementation Prompt — Milo Route Only

Paste this into Codex/Cursor/Windsurf when ready to implement Milo's route.

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement Milo's character route dialogue as a data-driven route with unique stage-specific choice labels and outcomes.

Goal:
Milo should no longer reuse generic choice labels like "Make the board safe first", "Listen beneath the hazard", or "Trust the plink-plonk rhythm". Each stage must have its own story lead-up and unique choices while preserving Milo's voice: gentle, listening-focused, humble, practical, and softly whimsical.

Create or update dialogue content for:
- SCN_MILO_01 — Sprinkle Sewers / First Tremble Beneath the Frosting
- SCN_MILO_02 — Goblin Workshop / The Counterbeat in the Gears
- SCN_MILO_03 — Frosty Pantry / The Long Pause of Ice
- SCN_MILO_04 — Pillow Castle / The Nap-Song Under the Blankets
- SCN_MILO_05 — Starfall Arcade / The Quiet Between Chimes
- SCN_MILO_06 — Bloxley's Block Palace / The Palace That Forgot How to Ask
- SCN_MILO_FINAL_BOSS
- END_MILO_NORMAL
- END_MILO_TRUE
- END_MILO_FESTIVAL_GRACE_VARIANT

Route state:
- miloAffinity
- miloInsight
- miloFestivalGrace
- true flags:
  - milo_flag_heard_first_tremble
  - milo_flag_named_machine_counterbeat
  - milo_flag_waited_for_slow_runes
  - milo_flag_learned_nap_song
  - milo_flag_heard_between_chimes
  - milo_flag_asked_palace_why

Acceptance criteria:
- Every Milo stage route scene has different choice label text.
- Every stage has unique story context that leads into the choice.
- Choice A is practical/Normal route.
- Choice B is true-insight route and grants a stage-specific flag.
- Choice C is risky/festival route and can add reward plus risk.
- Dialogue is cheerful, polished, and character-specific.
- Dialogue can be skipped.
- Route flags save/load safely.
- Normal and True endings can be selected by route state.
- No dark/edgy curse tone is added.
- Build passes.
- Content validation passes if dialogue content is validated.
```

---

# 18. QA Checklist — Milo Route

| Test | Expected Result |
| --- | --- |
| Start run as Milo | Milo route state initializes. |
| Trigger Stage 1 Milo event | Choice labels are `Sweep a Sprinkle Corner`, `Hear the First Tremble`, `Follow the Sugarbeat`. |
| Pick Stage 1 True option | `milo_flag_heard_first_tremble` is saved. |
| Trigger Stage 2 Milo event | Choice labels are unique to Goblin Workshop. |
| Pick all True choices through Stage 6 | At least 5 true flags unlock Milo True Ending. |
| Pick mostly Practical choices | Milo Normal Ending triggers after King Bloxley. |
| Pick 3+ Festival choices | Festival Grace variant scene appears after ending. |
| Save/load mid-route | Route flags and scores persist. |
| Replay route | Previously seen scenes can be skipped if skip system exists. |
| Mobile check | Choice labels fit within dialogue card without wrapping badly. |

---

# 19. Next Character Pattern

After Milo is approved, repeat the same structure for each hero, but change the choice philosophy.

Do not reuse Milo's three-lean wording exactly.

Examples:

| Hero | Practical Lean | True Lean | Risky Lean |
| --- | --- | --- | --- |
| Pippa | Recipe discipline | Feed/forgive the hungry mess | Overbake for reward |
| Zuzu | Safe calibration | Admit responsibility | Field-test chaos |
| Nixie | Preserve supplies | Let feelings thaw | Freeze-dance gamble |
| Bruk | Guard the table | Share the oath | Heroic snack charge |
| Lumi | Follow the map-star | Hear the hidden wish | Chase the shiny omen |
