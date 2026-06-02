# Blockmancer Dungeon — Story, Routes, and Dialogue Source of Truth

**Generated:** 2026-05-20  
**Authority:** Canonical for story premise, polished voice, route scenes, route dialogue, boss intros, storyboards, endings, narrative QA, and character voice.

## Consolidation Summary

This file combines the polished full dialogue/storyboard bible, updated story/core concept, and full character-route reference. The polished dialogue/storyboard bible wins for exact scene text and dialogue tone. The full character-route document is kept as supporting route design context when a route arc or condition is missing from the polished storyboard.

## Narrative Ownership

Use this file for:

- Opening, shared stage, boss intro, and ending storyboards.
- Character route scenes and route flags.
- Choice text, NPC responses, result text, and route lane tone.
- Narrative QA and mobile-readable dialogue style.
- Polished storybook-festival voice.

For gameplay effects attached to choices, cross-check the Gameplay/Reactive Difficulty SOT.


---

## Polished Full Dialogue and Storyboard Bible

**Source file:** `blockmancer_full_dialogue_storyboard_POLISHED.md`

**Consolidation note:** This is the canonical source for exact narrative scene and dialogue text.

### Blockmancer Dungeon — Full Dialogue & Storyboard Bible

**Version:** Release 1.0 narrative expansion draft — polished festival style pass  
**Purpose:** Story implementation source for dialogue data, route cutscenes, choice cards, boss intros, endings, and narrative QA.  
**Style Goal:** More refined and storybook-like than the previous draft, while preserving warmth, festival humor, and joyful fantasy charm.

---

#### 1. Polished Writing Direction

The revised voice should feel like a bright storybook RPG rather than internet banter. Keep the comedy, but make it gentler, cleaner, and character-led.

##### Tone Keywords

```text
Warm
Whimsical
Elegant
Cheerful
Earnest
Festival-bright
Characterful
Readable on mobile
```

##### Avoid

```text
Meme phrasing
Sarcastic Reddit-style punchlines
Overuse of “probably”, “weird”, “random”, “that is worrying”, or “main character energy”
Jokes that undercut emotional moments
Modern slang that breaks the fairytale-festival mood
```

##### Prefer

```text
Gentle wit
Clear emotional intent
Short dialogue lines
Playful but polished descriptions
Distinct hero voices
Comedic situations rather than commentary jokes
```

##### Example Style Shift

Old flavor:

> “That sentence had both helpful and chaos in it. I have concerns.”

Polished flavor:

> “Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom.”

Old flavor:

> “That purple block has main character energy.”

Polished flavor:

> “That violet block is shining as though it has been waiting for its entrance.”

---

#### 2. Dialogue Data Format

```ts
type DialogueChoice = {
  id: string;
  label: string;
  playerLine: string;
  npcResponse: string;
  resultText: string;
  routeDelta?: { affinity?: number; insight?: number; festivalGrace?: number };
  grantsFlag?: string;
  gameplayEffect?: string;
};

type StoryboardScene = {
  id: string;
  routeId?: string;
  stageId?: string;
  trigger: string;
  location: string;
  storyboardPanels: string[];
  dialogue: { speaker: string; line: string }[];
  choices?: DialogueChoice[];
  nextSceneRules?: string[];
};
```

---

### 3. Shared Campaign Storyboard

#### SCN_SHARED_000 — Opening Cutscene: The Button Beneath the Ribbon

**Trigger:** New player starts the game or chooses Replay Opening.  
**Location:** Brixonia town square, Festival of Falling Stars.  
**Purpose:** Introduce the festival, Block-O-Matic 3000, Milo, Professor Poplin, and the cheerful disaster that opens the dungeon.

##### Storyboard Panels

1. A vertical wide shot of Brixonia town square: paper stars drift overhead, lanterns gleam above cake stalls, and the jelly fountain still looks like an ordinary fountain.
2. The camera settles on the Block-O-Matic 3000 beneath a ribboned pavilion. Its buttons read Build, Bake, Bounce, Battle, Festival, and Do Not Press During Festival Mode.
3. Professor Poplin presents his festival upgrade while Milo carries lemonade nearby, carefully balancing a tray and pretending the tray is not winning.
4. A shimmer travels across the forbidden button. Confetti lands, a slime nudges a rope, and the ribbon slips with ceremonial timing.
5. The button depresses with a polite little chime. The machine’s mode dial spins from Festival to Battle to Do Not Press.
6. The ground gives a splendid hiccup. Cakes rise, the fountain becomes jelly, and a staircase of glowing blocks opens beneath the square.
7. Milo lifts his wand. A rune block answers with a small musical plink.
8. Title card: **Blockmancer Dungeon — Clear lines. Cast spells. Save the festival.**

##### Dialogue

- **Festival Announcer:** "Welcome to the Festival of Falling Stars, where every lantern is bright, every cake is admired, and every suspicious button is strictly decorative."
- **Professor Poplin:** "Citizens of Brixonia, behold the Block-O-Matic 3000, now improved to make our celebration thirty-seven percent more wondrous."
- **Milo:** "Professor, is the extra seven percent covered by the safety forms?"
- **Professor Poplin:** "Naturally. Several forms exist, and one of them is almost certainly signed."
- **Block-O-Matic 3000:** "Build mode ready. Bake mode ready. Bounce mode ready. Festival mode eager."
- **Festival Announcer:** "A courteous reminder: the large red button beneath the ribbon is not part of the entertainment."
- **SFX:** "chime."
- **Professor Poplin:** "Ah. That was a very well-mannered warning sound. I distrust it immediately."
- **Block-O-Matic 3000:** "Festival mode combined with Battle mode. Assistance overflowing."
- **Milo:** "The fountain has become jelly. Beautiful jelly, but still a concern."
- **Rune Block:** "Plink. Plonk."
- **Milo:** "All right. One careful stack at a time."

##### Gameplay Transition

- Start Tutorial Battle with Milo.
- Board begins with basic red, blue, green, and yellow rune blocks.
- Tutorial teaches movement, rotation, hard drop, line clear, mana, spells, hold, and Cascade Gravity.

---

### 4. Shared Stage Storyboards


#### SCN_SHARED_STAGE_01_INTRO — Sprinkle Sewers Entrance

**Trigger:** Enter Sprinkle Sewers for the first time in a run.  
**Location:** Sprinkle Sewers.  
**Visual Tone:** rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.  
**Gameplay Hook:** sticky blocks, sprinkle blocks, and simple incoming junk warnings.  
**Stage Goal:** Recover 3 Lost Cupcakes.

##### Storyboard Panels

1. The camera enters Sprinkle Sewers and frames the hero in the compact battle panel while the board glows awake below.
2. A stage banner unfolds with a polished festival seal: **Recover 3 Lost Cupcakes**.
3. The Block-O-Matic projects a tidy safety notice, though several words rearrange themselves before settling.
4. The first monster appears with a stolen ribbon, crumb, gear, spoon, pillow tassel, token, or royal seal depending on the stage.
5. The board drops the opening piece as the Festival Announcer delivers the room’s challenge.

##### Dialogue

- **Festival Announcer:** "The sewers beneath the square have become a river of frosting and misplaced pastries."
- **Block-O-Matic 3000:** "Stage goal recorded. Lost cupcakes have been detected in multiple damp but festive locations."
- **Milo:** "Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom."
- **Festival Announcer:** "Stage goal: Recover 3 Lost Cupcakes. Success will make the boss encounter kinder; failure will only make it more theatrical."
- **Block-O-Matic 3000:** "Hazard note: The board may gain sticky cells after enemy attacks. Sprinkle blocks reward careful clears with extra mana."

##### Stage Goal Card

- **Goal:** Recover 3 Lost Cupcakes
- **Success Result:** Boss begins with fewer sticky blocks.
- **Failure Result:** extra sticky blocks at boss if ignored; never an instant-loss state.
- **Route Note:** Recovering cupcakes becomes easier and may add route insight for the active hero.

---

#### SCN_SHARED_STAGE_01_BOSS_CARD — Cupcake Slime King Rule Card

**Trigger:** Enter boss node in Sprinkle Sewers.  
**Purpose:** Teach the boss rule in a bright, readable, theatrical way.

##### Boss Rule Card Text

- **Title:** Sticky Situation
- **Boss:** Cupcake Slime King
- **Rule:** This battle emphasizes sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Player Tip:** Clear sticky blocks early, then use cascades to keep the frosting from taking over the board.
- **Fairness Note:** The boss may add pressure, but every major setback has a visible warning and at least one counterplay route.

##### Boss Intro Dialogue

- **Festival Announcer:** "Challenger, prepare for sticky situation!"
- **Cupcake Slime King:** "The festival has reached my room, and therefore my room shall be appropriately impressive."
- **Block-O-Matic 3000:** "Boss rule prepared. Drama balanced against readability."
- **Hero:** "Then we will answer with clean lines, clear choices, and one graceful cascade at a time."

---

#### SCN_SHARED_STAGE_02_INTRO — Goblin Workshop Entrance

**Trigger:** Enter Goblin Workshop for the first time in a run.  
**Location:** Goblin Workshop.  
**Visual Tone:** brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.  
**Gameplay Hook:** junk blocks, bomb blocks, board shake, and gadget hazards.  
**Stage Goal:** Disable 2 Goblin Machines.

##### Storyboard Panels

1. The camera enters Goblin Workshop and frames the hero in the compact battle panel while the board glows awake below.
2. A stage banner unfolds with a polished festival seal: **Disable 2 Goblin Machines**.
3. The Block-O-Matic projects a tidy safety notice, though several words rearrange themselves before settling.
4. The first monster appears with a stolen ribbon, crumb, gear, spoon, pillow tassel, token, or royal seal depending on the stage.
5. The board drops the opening piece as the Festival Announcer delivers the room’s challenge.

##### Dialogue

- **Festival Announcer:** "Welcome to the workshop, where every lever has a label and none of the labels agree."
- **Block-O-Matic 3000:** "Machine safety notice: all current machines are almost certainly intentional."
- **Milo:** "Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom."
- **Festival Announcer:** "Stage goal: Disable 2 Goblin Machines. Success will make the boss encounter kinder; failure will only make it more theatrical."
- **Block-O-Matic 3000:** "Hazard note: Enemies queue junk and may shake the board. Bomb blocks are powerful when used with patience."

##### Stage Goal Card

- **Goal:** Disable 2 Goblin Machines
- **Success Result:** Prototype No. 7 queues less junk.
- **Failure Result:** Prototype begins slightly overclocked; never an instant-loss state.
- **Route Note:** Machine hazards become clearer and may add route insight for the active hero.

---

#### SCN_SHARED_STAGE_02_BOSS_CARD — Prototype No. 7 Rule Card

**Trigger:** Enter boss node in Goblin Workshop.  
**Purpose:** Teach the boss rule in a bright, readable, theatrical way.

##### Boss Rule Card Text

- **Title:** Totally Safe Machine Test
- **Boss:** Prototype No. 7
- **Rule:** This battle emphasizes junk blocks, bomb blocks, board shake, and gadget hazards.
- **Player Tip:** Watch the junk queue. Bombs can save the board, but careless explosions invite more trouble.
- **Fairness Note:** The boss may add pressure, but every major setback has a visible warning and at least one counterplay route.

##### Boss Intro Dialogue

- **Festival Announcer:** "Challenger, prepare for totally safe machine test!"
- **Prototype No. 7:** "The festival has reached my room, and therefore my room shall be appropriately impressive."
- **Block-O-Matic 3000:** "Boss rule prepared. Drama balanced against readability."
- **Hero:** "Then we will answer with clean lines, clear choices, and one graceful cascade at a time."

---

#### SCN_SHARED_STAGE_03_INTRO — Frosty Pantry Entrance

**Trigger:** Enter Frosty Pantry for the first time in a run.  
**Location:** Frosty Pantry.  
**Visual Tone:** glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.  
**Gameplay Hook:** ice blocks, freeze warnings, and slow-to-fast fall speed waves.  
**Stage Goal:** Save 3 Ice Cream Crates.

##### Storyboard Panels

1. The camera enters Frosty Pantry and frames the hero in the compact battle panel while the board glows awake below.
2. A stage banner unfolds with a polished festival seal: **Save 3 Ice Cream Crates**.
3. The Block-O-Matic projects a tidy safety notice, though several words rearrange themselves before settling.
4. The first monster appears with a stolen ribbon, crumb, gear, spoon, pillow tassel, token, or royal seal depending on the stage.
5. The board drops the opening piece as the Festival Announcer delivers the room’s challenge.

##### Dialogue

- **Festival Announcer:** "The pantry is beautifully chilled, mildly enchanted, and deeply offended by warm hands."
- **Block-O-Matic 3000:** "Preservation mode unstable. Gelato integrity is now considered a heroic concern."
- **Milo:** "Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom."
- **Festival Announcer:** "Stage goal: Save 3 Ice Cream Crates. Success will make the boss encounter kinder; failure will only make it more theatrical."
- **Block-O-Matic 3000:** "Hazard note: Ice blocks may slide after cascades, and freeze warnings can lock the active piece if ignored."

##### Stage Goal Card

- **Goal:** Save 3 Ice Cream Crates
- **Success Result:** player starts boss with small shield.
- **Failure Result:** first speed wave arrives earlier; never an instant-loss state.
- **Route Note:** Frozen crates remain intact and may add route insight for the active hero.

---

#### SCN_SHARED_STAGE_03_BOSS_CARD — Gelato Golem Rule Card

**Trigger:** Enter boss node in Frosty Pantry.  
**Purpose:** Teach the boss rule in a bright, readable, theatrical way.

##### Boss Rule Card Text

- **Title:** Brain Freeze Warning
- **Boss:** Gelato Golem
- **Rule:** This battle emphasizes ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Player Tip:** Slow the tempo before speed waves spike. Use frost counters before the active piece becomes trapped.
- **Fairness Note:** The boss may add pressure, but every major setback has a visible warning and at least one counterplay route.

##### Boss Intro Dialogue

- **Festival Announcer:** "Challenger, prepare for brain freeze warning!"
- **Gelato Golem:** "The festival has reached my room, and therefore my room shall be appropriately impressive."
- **Block-O-Matic 3000:** "Boss rule prepared. Drama balanced against readability."
- **Hero:** "Then we will answer with clean lines, clear choices, and one graceful cascade at a time."

---

#### SCN_SHARED_STAGE_04_INTRO — Pillow Castle Entrance

**Trigger:** Enter Pillow Castle for the first time in a run.  
**Location:** Pillow Castle.  
**Visual Tone:** blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.  
**Gameplay Hook:** soft blocks, shielded enemies, and Sleepy status effects.  
**Stage Goal:** Keep 2 Guards Asleep.

##### Storyboard Panels

1. The camera enters Pillow Castle and frames the hero in the compact battle panel while the board glows awake below.
2. A stage banner unfolds with a polished festival seal: **Keep 2 Guards Asleep**.
3. The Block-O-Matic projects a tidy safety notice, though several words rearrange themselves before settling.
4. The first monster appears with a stolen ribbon, crumb, gear, spoon, pillow tassel, token, or royal seal depending on the stage.
5. The board drops the opening piece as the Festival Announcer delivers the room’s challenge.

##### Dialogue

- **Festival Announcer:** "Step softly. Pillow Castle is under strict nap-time protection."
- **Block-O-Matic 3000:** "Quiet mode enabled. Volume reduced. Strategic whispering recommended."
- **Milo:** "Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom."
- **Festival Announcer:** "Stage goal: Keep 2 Guards Asleep. Success will make the boss encounter kinder; failure will only make it more theatrical."
- **Block-O-Matic 3000:** "Hazard note: Soft blocks absorb pressure, while Sleepy effects can slow player responses unless countered."

##### Stage Goal Card

- **Goal:** Keep 2 Guards Asleep
- **Success Result:** Sleepy effects are reduced.
- **Failure Result:** boss gains extra shield if guards wake; never an instant-loss state.
- **Route Note:** Castle remains peaceful and may add route insight for the active hero.

---

#### SCN_SHARED_STAGE_04_BOSS_CARD — Sir Snore-a-Lot Rule Card

**Trigger:** Enter boss node in Pillow Castle.  
**Purpose:** Teach the boss rule in a bright, readable, theatrical way.

##### Boss Rule Card Text

- **Title:** Do Not Wake the Pillow Knight
- **Boss:** Sir Snore-a-Lot
- **Rule:** This battle emphasizes soft blocks, shielded enemies, and Sleepy status effects.
- **Player Tip:** Shielded enemies reward careful setup. Keep the board calm and avoid needless commotion.
- **Fairness Note:** The boss may add pressure, but every major setback has a visible warning and at least one counterplay route.

##### Boss Intro Dialogue

- **Festival Announcer:** "Challenger, prepare for do not wake the pillow knight!"
- **Sir Snore-a-Lot:** "The festival has reached my room, and therefore my room shall be appropriately impressive."
- **Block-O-Matic 3000:** "Boss rule prepared. Drama balanced against readability."
- **Hero:** "Then we will answer with clean lines, clear choices, and one graceful cascade at a time."

---

#### SCN_SHARED_STAGE_05_INTRO — Starfall Arcade Entrance

**Trigger:** Enter Starfall Arcade for the first time in a run.  
**Location:** Starfall Arcade.  
**Visual Tone:** neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.  
**Gameplay Hook:** Fever gain, cascade challenges, score callouts, and preview disruption.  
**Stage Goal:** Reach Combo Score Target.

##### Storyboard Panels

1. The camera enters Starfall Arcade and frames the hero in the compact battle panel while the board glows awake below.
2. A stage banner unfolds with a polished festival seal: **Reach Combo Score Target**.
3. The Block-O-Matic projects a tidy safety notice, though several words rearrange themselves before settling.
4. The first monster appears with a stolen ribbon, crumb, gear, spoon, pillow tassel, token, or royal seal depending on the stage.
5. The board drops the opening piece as the Festival Announcer delivers the room’s challenge.

##### Dialogue

- **Festival Announcer:** "The arcade recognizes courage, style, and the elegant arrangement of unreasonable block shapes."
- **Block-O-Matic 3000:** "Scorekeeping mode activated. Applause may occur before or after success."
- **Milo:** "Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom."
- **Festival Announcer:** "Stage goal: Reach Combo Score Target. Success will make the boss encounter kinder; failure will only make it more theatrical."
- **Block-O-Matic 3000:** "Hazard note: Combos and Fever matter. Low-cascade play may invite pressure, while elegant chains earn breathing room."

##### Stage Goal Card

- **Goal:** Reach Combo Score Target
- **Success Result:** player starts boss with partial Fever meter or Fever Ready state; never preloaded Charged Lines.
- **Failure Result:** Hydra adds one extra score demand; never an instant-loss state.
- **Route Note:** Arcade score path opens and may add route insight for the active hero.

---

#### SCN_SHARED_STAGE_05_BOSS_CARD — High Score Hydra Rule Card

**Trigger:** Enter boss node in Starfall Arcade.  
**Purpose:** Teach the boss rule in a bright, readable, theatrical way.

##### Boss Rule Card Text

- **Title:** Combo or Be Chomped
- **Boss:** High Score Hydra
- **Rule:** This battle emphasizes Fever Showtime, cascade challenges, score callouts, preview disruption, and safe pressure conversion.
- **Player Tip:** The Hydra respects clean cascades. Build Charged Lines, release before Fever Heat gets messy, and let Cascade Gravity do the applause.
- **Fairness Note:** The boss may add pressure, but every major setback has a visible warning and at least one counterplay route.

##### Boss Intro Dialogue

- **Festival Announcer:** "Challenger, prepare for combo or be chomped!"
- **High Score Hydra:** "The festival has reached my room, and therefore my room shall be appropriately impressive."
- **Block-O-Matic 3000:** "Boss rule prepared. Drama balanced against readability."
- **Hero:** "Then we will answer with clean lines, clear choices, and one graceful cascade at a time."

---

#### SCN_SHARED_STAGE_06_INTRO — Bloxley's Block Palace Entrance

**Trigger:** Enter Bloxley's Block Palace for the first time in a run.  
**Location:** Bloxley's Block Palace.  
**Visual Tone:** square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.  
**Gameplay Hook:** royal blocks, symmetry checks, pattern junk, and final board pressure.  
**Stage Goal:** Break 3 Royal Seals.

##### Storyboard Panels

1. The camera enters Bloxley's Block Palace and frames the hero in the compact battle panel while the board glows awake below.
2. A stage banner unfolds with a polished festival seal: **Break 3 Royal Seals**.
3. The Block-O-Matic projects a tidy safety notice, though several words rearrange themselves before settling.
4. The first monster appears with a stolen ribbon, crumb, gear, spoon, pillow tassel, token, or royal seal depending on the stage.
5. The board drops the opening piece as the Festival Announcer delivers the room’s challenge.

##### Dialogue

- **Festival Announcer:** "At the palace gate, even the confetti appears to be standing at attention."
- **Block-O-Matic 3000:** "Royal protocol detected. Please remain imaginative within approved rectangular limits."
- **Milo:** "Helpful chaos is still chaos. Let us keep the helpful part and give the rest a broom."
- **Festival Announcer:** "Stage goal: Break 3 Royal Seals. Success will make the boss encounter kinder; failure will only make it more theatrical."
- **Block-O-Matic 3000:** "Hazard note: Royal blocks and symmetry checks test planning. Preserve space for cascades before the final phase."

##### Stage Goal Card

- **Goal:** Break 3 Royal Seals
- **Success Result:** Bloxley starts with fewer royal blocks.
- **Failure Result:** final phase starts with extra royal pattern; never an instant-loss state.
- **Route Note:** Royal seals weaken and may add route insight for the active hero.

---

#### SCN_SHARED_STAGE_06_BOSS_CARD — King Bloxley Rule Card

**Trigger:** Enter boss node in Bloxley's Block Palace.  
**Purpose:** Teach the boss rule in a bright, readable, theatrical way.

##### Boss Rule Card Text

- **Title:** Everything Must Be Square
- **Boss:** King Bloxley
- **Rule:** This battle emphasizes royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Player Tip:** Royal blocks reward planned clears. Break the pattern without letting the palace dictate the whole board.
- **Fairness Note:** The boss may add pressure, but every major setback has a visible warning and at least one counterplay route.

##### Boss Intro Dialogue

- **Festival Announcer:** "Challenger, prepare for everything must be square!"
- **King Bloxley:** "The festival has reached my room, and therefore my room shall be appropriately impressive."
- **Block-O-Matic 3000:** "Boss rule prepared. Drama balanced against readability."
- **Hero:** "Then we will answer with clean lines, clear choices, and one graceful cascade at a time."

---

### 5. Character Route Dialogue Storyboards


#### Route 1 — Milo, the Blockmancer

**Route ID:** `route_milo_blockmancer`  
**Theme:** Listening is stronger than control.  
**Core Conflict:** Milo can hear the rune blocks, but he believes every answer must come through him. His route teaches him to translate, trust, and invite others into the work of repair.  
**Focus NPC:** Bloop  
**Normal Ending:** Junior Festival Organizer  
**True Ending:** The Plink-Plonk Parade

##### True Ending Requirements

To unlock **The Plink-Plonk Parade**, the player should satisfy most of these requirements in the same completed route run:


- Earn route flag `milo_flag_understood_block_fear`.

- Earn route flag `milo_flag_translated_machine_hum`.

- Earn route flag `milo_flag_invited_party_to_listen`.

- Earn route flag `milo_flag_bloxley_heard`.

- Defeat King Bloxley with Milo selected.
- Avoid choosing only practical/direct answers across the entire route.
- Recover at least 3 Lost Cakes across the campaign or complete 3 stage goals.
- Trigger at least 5 cascades in the final stage or satisfy the route-specific final choice.

##### Route Scene Index

| Scene ID | Stage | Route Beat | True Flag |
| --- | --- | --- | --- |

| `SCN_MILO_01` | Sprinkle Sewers | Sticky blocks are not merely stuck; they are frightened of being swept away. | `milo_flag_understood_block_fear` |

| `SCN_MILO_02` | Goblin Workshop | Goblin machines are producing pieces that argue in different rhythms. | `milo_flag_translated_machine_hum` |

| `SCN_MILO_03` | Frosty Pantry | Frozen blocks speak slowly, and Milo must learn not to interrupt them. | `milo_flag_invited_party_to_listen` |

| `SCN_MILO_04` | Pillow Castle | Pillow Castle blocks refuse to fall because they are keeping guard over sleeping toys. | `milo_flag_bloxley_heard` |

| `SCN_MILO_05` | Starfall Arcade | Arcade blocks glow brighter when every color gets a chance to contribute. | `milo_flag_bloxley_heard` |

| `SCN_MILO_06` | Bloxley's Block Palace | Royal blocks want leadership, but not a king who silences every shape. | `milo_flag_bloxley_heard` |


---


##### SCN_MILO_01 — Milo Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Milo.  
**Location:** Sprinkle Sewers.  
**Story Beat:** Sticky blocks are not merely stuck; they are frightened of being swept away.  
**Route Flag Opportunity:** `milo_flag_understood_block_fear` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Sprinkle Sewers; rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.
2. A route-specific detail catches Milo's attention: sticky blocks are not merely stuck; they are frightened of being swept away.
3. The board preview flickers with a small thematic warning linked to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
4. The focus NPC, **Bloop**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Milo:** "Let me listen before we tidy anything away."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Sticky blocks are not merely stuck; they are frightened of being swept away."
- **Bloop:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Milo:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "We can solve the shape first and ask questions after the board is safe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Milo resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "No one speaks clearly while frightened. I will listen to the whole pattern."
- **NPC Response:** "Then hear this: the first frightened block voice."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Milo's personal fear becomes clear.
- **Gameplay Result:** blocks whisper before they harden.
- **Grant Flag:** `milo_flag_understood_block_fear`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Festival Flourish

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I have an idea. It involves trust, timing, and perhaps too many lanterns."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Milo:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Milo:** "The board sounds lighter now. Not quiet exactly—more willing."
- **Route Note:** Store `milo_flag_understood_block_fear` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_MILO_02 — Milo Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Milo.  
**Location:** Goblin Workshop.  
**Story Beat:** Goblin machines are producing pieces that argue in different rhythms.  
**Route Flag Opportunity:** `milo_flag_translated_machine_hum` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Goblin Workshop; brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.
2. A route-specific detail catches Milo's attention: goblin machines are producing pieces that argue in different rhythms.
3. The board preview flickers with a small thematic warning linked to junk blocks, bomb blocks, board shake, and gadget hazards.
4. The focus NPC, **Bloop**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Milo:** "Let me listen before we tidy anything away."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Goblin machines are producing pieces that argue in different rhythms."
- **Bloop:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Milo:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "We can solve the shape first and ask questions after the board is safe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Milo resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to junk blocks, bomb blocks, board shake, and gadget hazards.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "No one speaks clearly while frightened. I will listen to the whole pattern."
- **NPC Response:** "Then hear this: the machine hum underneath the noise."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Milo's personal fear becomes clear.
- **Gameplay Result:** machines pause one tick before spawning junk.
- **Grant Flag:** `milo_flag_translated_machine_hum`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Festival Flourish

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I have an idea. It involves trust, timing, and perhaps too many lanterns."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Milo:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Milo:** "The board sounds lighter now. Not quiet exactly—more willing."
- **Route Note:** Store `milo_flag_translated_machine_hum` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_MILO_03 — Milo Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Milo.  
**Location:** Frosty Pantry.  
**Story Beat:** Frozen blocks speak slowly, and Milo must learn not to interrupt them.  
**Route Flag Opportunity:** `milo_flag_invited_party_to_listen` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Frosty Pantry; glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.
2. A route-specific detail catches Milo's attention: frozen blocks speak slowly, and milo must learn not to interrupt them.
3. The board preview flickers with a small thematic warning linked to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
4. The focus NPC, **Bloop**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Milo:** "Let me listen before we tidy anything away."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Frozen blocks speak slowly, and Milo must learn not to interrupt them."
- **Bloop:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Milo:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "We can solve the shape first and ask questions after the board is safe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Milo resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "No one speaks clearly while frightened. I will listen to the whole pattern."
- **NPC Response:** "Then hear this: the patience of chilled runes."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Milo's personal fear becomes clear.
- **Gameplay Result:** freeze warning window expands once.
- **Grant Flag:** `milo_flag_invited_party_to_listen`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Festival Flourish

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I have an idea. It involves trust, timing, and perhaps too many lanterns."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Milo:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Milo:** "The board sounds lighter now. Not quiet exactly—more willing."
- **Route Note:** Store `milo_flag_invited_party_to_listen` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_MILO_04 — Milo Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Milo.  
**Location:** Pillow Castle.  
**Story Beat:** Pillow Castle blocks refuse to fall because they are keeping guard over sleeping toys.  
**Route Flag Opportunity:** `milo_flag_bloxley_heard` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Pillow Castle; blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.
2. A route-specific detail catches Milo's attention: pillow castle blocks refuse to fall because they are keeping guard over sleeping toys.
3. The board preview flickers with a small thematic warning linked to soft blocks, shielded enemies, and Sleepy status effects.
4. The focus NPC, **Bloop**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Milo:** "Let me listen before we tidy anything away."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Pillow Castle blocks refuse to fall because they are keeping guard over sleeping toys."
- **Bloop:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Milo:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "We can solve the shape first and ask questions after the board is safe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Milo resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to soft blocks, shielded enemies, and Sleepy status effects.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "No one speaks clearly while frightened. I will listen to the whole pattern."
- **NPC Response:** "Then hear this: why soft blocks resist gravity."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Milo's personal fear becomes clear.
- **Gameplay Result:** soft blocks grant a small shield when cleared cleanly.
- **Grant Flag:** `milo_flag_bloxley_heard`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Festival Flourish

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I have an idea. It involves trust, timing, and perhaps too many lanterns."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Milo:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Milo:** "The board sounds lighter now. Not quiet exactly—more willing."
- **Route Note:** Store `milo_flag_bloxley_heard` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_MILO_05 — Milo Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Milo.  
**Location:** Starfall Arcade.  
**Story Beat:** Arcade blocks glow brighter when every color gets a chance to contribute.  
**Route Flag Opportunity:** `milo_flag_bloxley_heard` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Starfall Arcade; neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.
2. A route-specific detail catches Milo's attention: arcade blocks glow brighter when every color gets a chance to contribute.
3. The board preview flickers with a small thematic warning linked to Fever gain, cascade challenges, score callouts, and preview disruption.
4. The focus NPC, **Bloop**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Milo:** "Let me listen before we tidy anything away."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Arcade blocks glow brighter when every color gets a chance to contribute."
- **Bloop:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Milo:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "We can solve the shape first and ask questions after the board is safe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Milo resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to Fever gain, cascade challenges, score callouts, and preview disruption.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "No one speaks clearly while frightened. I will listen to the whole pattern."
- **NPC Response:** "Then hear this: the festival rhythm inside cascades."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Milo's personal fear becomes clear.
- **Gameplay Result:** first cascade of battle grants bonus Fever.
- **Grant Flag:** `milo_flag_bloxley_heard`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Festival Flourish

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I have an idea. It involves trust, timing, and perhaps too many lanterns."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Milo:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Milo:** "The board sounds lighter now. Not quiet exactly—more willing."
- **Route Note:** Store `milo_flag_bloxley_heard` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_MILO_06 — Milo Route Scene in Bloxley's Block Palace

**Trigger:** First route event in Bloxley's Block Palace while playing Milo.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Royal blocks want leadership, but not a king who silences every shape.  
**Route Flag Opportunity:** `milo_flag_bloxley_heard` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Bloxley's Block Palace; square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.
2. A route-specific detail catches Milo's attention: royal blocks want leadership, but not a king who silences every shape.
3. The board preview flickers with a small thematic warning linked to royal blocks, symmetry checks, pattern junk, and final board pressure.
4. The focus NPC, **Bloop**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Milo:** "Let me listen before we tidy anything away."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Royal blocks want leadership, but not a king who silences every shape."
- **Bloop:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Milo:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "We can solve the shape first and ask questions after the board is safe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Milo resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "No one speaks clearly while frightened. I will listen to the whole pattern."
- **NPC Response:** "Then hear this: the difference between order and invitation."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Milo's personal fear becomes clear.
- **Gameplay Result:** royal warning appears one piece earlier.
- **Grant Flag:** `milo_flag_bloxley_heard`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Festival Flourish

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I have an idea. It involves trust, timing, and perhaps too many lanterns."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Milo:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Milo:** "The board sounds lighter now. Not quiet exactly—more willing."
- **Route Note:** Store `milo_flag_bloxley_heard` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_MILO_FINAL_BLOXLEY — Final Route Choice Before King Bloxley

**Trigger:** Before the final phase of the King Bloxley fight while playing Milo.  
**Location:** Bloxley's Block Palace throne room.  
**Purpose:** Resolve the character route and select Normal or True Ending eligibility.

###### Storyboard Panels

1. King Bloxley sits upon a throne of radiant royal blocks. Every corner is polished; every banner is measured.
2. The active hero steps forward while the rest of the party holds the board steady.
3. Bloxley raises his scepter. Royal blocks form a square frame around the final battlefield.
4. The route choice card appears, offering practical challenge, compassionate truth, or festive provocation.

###### Pre-Choice Dialogue

- **King Bloxley:** "Behold a palace of proper lines, obedient corners, and excellent symmetry. Why does the festival resist perfection?"
- **Milo:** "Because a festival is not a statue. It is a place where people gather, move, spill crumbs, and still belong."
- **King Bloxley:** "Belonging without order becomes a pile."
- **Milo:** "Order without welcome becomes a wall."

###### Final Dialogue Choices

###### A. "Order can serve the festival."

- **Player Line:** "A festival needs room to move, even when the banners are neatly hung."
- **King Bloxley:** "A measured answer. Sensible. Respectable. Slightly insufficient, but not without merit."
- **Result:** Eligible for Normal Ending if True Ending flags are incomplete.

###### B. "You wanted an invitation."

- **Player Line:** "You did not want obedience, Your Majesty. You wanted to be welcomed."
- **King Bloxley:** "Invited? I am the king. Kings do not wait beside the lantern table."
- **Milo:** "Perhaps they should, if they wish to know why the lanterns shine."
- **Result:** Grants final insight flag and checks True Ending eligibility.

###### C. "Let the festival answer you in its own shape."

- **Player Line:** "If every shape must be square, the cake committee will riot with frosting."
- **King Bloxley:** "That is either nonsense or pageantry. I am alarmed that I enjoy both."
- **Result:** Adds an extra royal pattern but increases final reward if defeated.

###### Ending Branch Logic

- If required true flags and campaign requirements are met: trigger `END_MILO_TRUE`.
- Otherwise: trigger `END_MILO_NORMAL`.
- If player chose C and wins: add a bonus festival postcard to either ending.

---

##### END_MILO_NORMAL — Junior Festival Organizer

**Ending Type:** Character Normal Ending.  
**Tone:** Successful, warm, and complete, but not the deepest emotional resolution.

###### Storyboard Panels & Script

1. **Panel 1:** King Bloxley is defeated, and the palace releases its strictest royal blocks into a shower of harmless confetti.
2. **Panel 2:** Milo helps restore the festival booth most closely tied to their route.
3. **Panel 3:** The crowd cheers, the monsters settle, and the Block-O-Matic 3000 folds the dungeon pressure into a neat festival cube.
4. **Panel 4:** Milo receives a commemorative ribbon, carefully lettered by the Festival Announcer.
5. **Panel 5:** The final shot shows the festival safe, bright, and slightly more organized than before.

###### Ending Dialogue

- **Festival Announcer:** "By courage, kindness, and unusually tidy block work, the festival stands restored."
- **Milo:** "There is still much to mend, but tonight there is music. That is a fine beginning."
- **Block-O-Matic 3000:** "Celebration stabilized. Gratitude pending."
- **King Bloxley:** "I shall permit this arrangement. Temporarily. For morale."

###### Reward

- Milo gains a permanent +1 starting mana bonus.
- Unlock route badge: `badge_junior_festival_organizer`

---

##### END_MILO_TRUE — The Plink-Plonk Parade

**Ending Type:** Character True Ending.  
**Tone:** Joyful resolution with deeper understanding of the Block-O-Matic, Bloxley, and the chosen hero.

###### Storyboard Panels & Script

1. **Panel 1:** After the final cascade, the palace does not collapse. It unfolds into a festival stage, each block finding a new place without being forced.
2. **Panel 2:** Milo recognizes that the chaos was not malice. It was an invitation written in the only language the machine knew: blocks, pressure, and spectacle.
3. **Panel 3:** King Bloxley removes his crown and places it on the stage railing, where anyone may admire it without obeying it.
4. **Panel 4:** The Block-O-Matic 3000 is given an official role in the festival, not as ruler or mistake, but as Game Master.
5. **Panel 5:** Milo's restored booth becomes part of a yearly celebration where monsters, townsfolk, and heroes compete in friendly cascade battles.

###### Ending Dialogue

- **Milo:** "The festival did not need to be perfect. It needed to be shared."
- **King Bloxley:** "Shared order. Voluntary symmetry. Ceremonial rectangles. I will consider this compromise magnificent."
- **Block-O-Matic 3000:** "Invitation received. Festival Game Master mode unlocked."
- **Festival Announcer:** "Let it be recorded: the dungeon is now allowed to open only with snacks, safety rails, and proper applause."
- **Milo:** "Then let the next game begin gently."

###### Reward

- Unlocks the Parade Board skin and a yearly Festival Game Master epilogue card.
- Unlock true route badge: `badge_the_plink_plonk_parade`
- Add ending gallery card: `route_milo_blockmancer_true_gallery_card`

---

#### Route 2 — Pippa, the Pyromancer

**Route ID:** `route_pippa_pyromancer`  
**Theme:** Protecting what you love does not mean scorching every inconvenience.  
**Core Conflict:** Pippa begins the route treating every monster as a pastry thief. Her true path reveals hunger, confusion, and bad instructions behind the bakery disaster.  
**Focus NPC:** Cupcake Slime King  
**Normal Ending:** Emergency Frosting Victory  
**True Ending:** The Great Slime Bake-Off

##### True Ending Requirements

To unlock **The Great Slime Bake-Off**, the player should satisfy most of these requirements in the same completed route run:


- Earn route flag `pippa_flag_read_fake_orders`.

- Earn route flag `pippa_flag_spared_hungry_slimes`.

- Earn route flag `pippa_flag_shared_recipe`.

- Earn route flag `pippa_flag_bloxley_banquet`.

- Defeat King Bloxley with Pippa selected.
- Avoid choosing only practical/direct answers across the entire route.
- Recover at least 3 Lost Cakes across the campaign or complete 3 stage goals.
- Trigger at least 5 cascades in the final stage or satisfy the route-specific final choice.

##### Route Scene Index

| Scene ID | Stage | Route Beat | True Flag |
| --- | --- | --- | --- |

| `SCN_PIPPA_01` | Sprinkle Sewers | Cupcake Slimes are wearing stolen frosting because they followed a mislabeled delivery note. | `pippa_flag_read_fake_orders` |

| `SCN_PIPPA_02` | Goblin Workshop | A goblin machine stamps cupcake molds into bomb casings. | `pippa_flag_spared_hungry_slimes` |

| `SCN_PIPPA_03` | Frosty Pantry | Frozen labels reveal the slimes were trying to preserve the cupcakes, not steal them. | `pippa_flag_shared_recipe` |

| `SCN_PIPPA_04` | Pillow Castle | Pillow guards have hidden emergency flour sacks under blankets. | `pippa_flag_bloxley_banquet` |

| `SCN_PIPPA_05` | Starfall Arcade | Arcade tickets can be traded for Pippa’s missing oven knob. | `pippa_flag_bloxley_banquet` |

| `SCN_PIPPA_06` | Bloxley's Block Palace | Bloxley has banned round cakes from the royal banquet. | `pippa_flag_bloxley_banquet` |


---


##### SCN_PIPPA_01 — Pippa Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Pippa.  
**Location:** Sprinkle Sewers.  
**Story Beat:** Cupcake Slimes are wearing stolen frosting because they followed a mislabeled delivery note.  
**Route Flag Opportunity:** `pippa_flag_read_fake_orders` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Sprinkle Sewers; rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.
2. A route-specific detail catches Pippa's attention: cupcake slimes are wearing stolen frosting because they followed a mislabeled delivery note.
3. The board preview flickers with a small thematic warning linked to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
4. The focus NPC, **Cupcake Slime King**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Pippa:** "I will not let panic ruin the bake. But I will hear the kitchen out."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Cupcake Slimes are wearing stolen frosting because they followed a mislabeled delivery note."
- **Cupcake Slime King:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Pippa:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "First we clear the frosting. Then we discuss manners."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Pippa resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "A hungry guest is still a guest. Show me who sent you here."
- **NPC Response:** "Then hear this: the fake bakery order."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Pippa's personal fear becomes clear.
- **Gameplay Result:** sticky blocks clear faster after fire damage.
- **Grant Flag:** `pippa_flag_read_fake_orders`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Improvised Recipe

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Very well. We improvise a recipe under battlefield conditions."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Pippa:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Pippa:** "The heat is kinder when it knows what it is warming."
- **Route Note:** Store `pippa_flag_read_fake_orders` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_PIPPA_02 — Pippa Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Pippa.  
**Location:** Goblin Workshop.  
**Story Beat:** A goblin machine stamps cupcake molds into bomb casings.  
**Route Flag Opportunity:** `pippa_flag_spared_hungry_slimes` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Goblin Workshop; brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.
2. A route-specific detail catches Pippa's attention: a goblin machine stamps cupcake molds into bomb casings.
3. The board preview flickers with a small thematic warning linked to junk blocks, bomb blocks, board shake, and gadget hazards.
4. The focus NPC, **Cupcake Slime King**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Pippa:** "I will not let panic ruin the bake. But I will hear the kitchen out."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: A goblin machine stamps cupcake molds into bomb casings."
- **Cupcake Slime King:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Pippa:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "First we clear the frosting. Then we discuss manners."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Pippa resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to junk blocks, bomb blocks, board shake, and gadget hazards.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "A hungry guest is still a guest. Show me who sent you here."
- **NPC Response:** "Then hear this: who altered the oven diagram."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Pippa's personal fear becomes clear.
- **Gameplay Result:** bomb blocks appear with clearer warning highlights.
- **Grant Flag:** `pippa_flag_spared_hungry_slimes`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Improvised Recipe

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Very well. We improvise a recipe under battlefield conditions."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Pippa:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Pippa:** "The heat is kinder when it knows what it is warming."
- **Route Note:** Store `pippa_flag_spared_hungry_slimes` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_PIPPA_03 — Pippa Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Pippa.  
**Location:** Frosty Pantry.  
**Story Beat:** Frozen labels reveal the slimes were trying to preserve the cupcakes, not steal them.  
**Route Flag Opportunity:** `pippa_flag_shared_recipe` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Frosty Pantry; glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.
2. A route-specific detail catches Pippa's attention: frozen labels reveal the slimes were trying to preserve the cupcakes, not steal them.
3. The board preview flickers with a small thematic warning linked to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
4. The focus NPC, **Cupcake Slime King**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Pippa:** "I will not let panic ruin the bake. But I will hear the kitchen out."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Frozen labels reveal the slimes were trying to preserve the cupcakes, not steal them."
- **Cupcake Slime King:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Pippa:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "First we clear the frosting. Then we discuss manners."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Pippa resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "A hungry guest is still a guest. Show me who sent you here."
- **NPC Response:** "Then hear this: the pantry preservation mistake."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Pippa's personal fear becomes clear.
- **Gameplay Result:** ice blocks may convert to cupcake blocks once.
- **Grant Flag:** `pippa_flag_shared_recipe`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Improvised Recipe

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Very well. We improvise a recipe under battlefield conditions."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Pippa:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Pippa:** "The heat is kinder when it knows what it is warming."
- **Route Note:** Store `pippa_flag_shared_recipe` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_PIPPA_04 — Pippa Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Pippa.  
**Location:** Pillow Castle.  
**Story Beat:** Pillow guards have hidden emergency flour sacks under blankets.  
**Route Flag Opportunity:** `pippa_flag_bloxley_banquet` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Pillow Castle; blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.
2. A route-specific detail catches Pippa's attention: pillow guards have hidden emergency flour sacks under blankets.
3. The board preview flickers with a small thematic warning linked to soft blocks, shielded enemies, and Sleepy status effects.
4. The focus NPC, **Cupcake Slime King**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Pippa:** "I will not let panic ruin the bake. But I will hear the kitchen out."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Pillow guards have hidden emergency flour sacks under blankets."
- **Cupcake Slime King:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Pippa:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "First we clear the frosting. Then we discuss manners."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Pippa resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to soft blocks, shielded enemies, and Sleepy status effects.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "A hungry guest is still a guest. Show me who sent you here."
- **NPC Response:** "Then hear this: the snack panic beneath the castle."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Pippa's personal fear becomes clear.
- **Gameplay Result:** rest node healing improves if the guard remains asleep.
- **Grant Flag:** `pippa_flag_bloxley_banquet`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Improvised Recipe

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Very well. We improvise a recipe under battlefield conditions."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Pippa:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Pippa:** "The heat is kinder when it knows what it is warming."
- **Route Note:** Store `pippa_flag_bloxley_banquet` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_PIPPA_05 — Pippa Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Pippa.  
**Location:** Starfall Arcade.  
**Story Beat:** Arcade tickets can be traded for Pippa’s missing oven knob.  
**Route Flag Opportunity:** `pippa_flag_bloxley_banquet` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Starfall Arcade; neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.
2. A route-specific detail catches Pippa's attention: arcade tickets can be traded for pippa’s missing oven knob.
3. The board preview flickers with a small thematic warning linked to Fever gain, cascade challenges, score callouts, and preview disruption.
4. The focus NPC, **Cupcake Slime King**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Pippa:** "I will not let panic ruin the bake. But I will hear the kitchen out."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Arcade tickets can be traded for Pippa’s missing oven knob."
- **Cupcake Slime King:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Pippa:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "First we clear the frosting. Then we discuss manners."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Pippa resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to Fever gain, cascade challenges, score callouts, and preview disruption.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "A hungry guest is still a guest. Show me who sent you here."
- **NPC Response:** "Then hear this: how rewards were redirected."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Pippa's personal fear becomes clear.
- **Gameplay Result:** combo target reward includes a baking item.
- **Grant Flag:** `pippa_flag_bloxley_banquet`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Improvised Recipe

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Very well. We improvise a recipe under battlefield conditions."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Pippa:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Pippa:** "The heat is kinder when it knows what it is warming."
- **Route Note:** Store `pippa_flag_bloxley_banquet` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_PIPPA_06 — Pippa Route Scene in Bloxley's Block Palace

**Trigger:** First route event in Bloxley's Block Palace while playing Pippa.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Bloxley has banned round cakes from the royal banquet.  
**Route Flag Opportunity:** `pippa_flag_bloxley_banquet` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Bloxley's Block Palace; square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.
2. A route-specific detail catches Pippa's attention: bloxley has banned round cakes from the royal banquet.
3. The board preview flickers with a small thematic warning linked to royal blocks, symmetry checks, pattern junk, and final board pressure.
4. The focus NPC, **Cupcake Slime King**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Pippa:** "I will not let panic ruin the bake. But I will hear the kitchen out."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Bloxley has banned round cakes from the royal banquet."
- **Cupcake Slime King:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Pippa:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "First we clear the frosting. Then we discuss manners."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Pippa resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "A hungry guest is still a guest. Show me who sent you here."
- **NPC Response:** "Then hear this: why square-only rules harmed the festival table."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Pippa's personal fear becomes clear.
- **Gameplay Result:** royal blocks take bonus fire damage once.
- **Grant Flag:** `pippa_flag_bloxley_banquet`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Improvised Recipe

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Very well. We improvise a recipe under battlefield conditions."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Pippa:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Pippa:** "The heat is kinder when it knows what it is warming."
- **Route Note:** Store `pippa_flag_bloxley_banquet` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_PIPPA_FINAL_BLOXLEY — Final Route Choice Before King Bloxley

**Trigger:** Before the final phase of the King Bloxley fight while playing Pippa.  
**Location:** Bloxley's Block Palace throne room.  
**Purpose:** Resolve the character route and select Normal or True Ending eligibility.

###### Storyboard Panels

1. King Bloxley sits upon a throne of radiant royal blocks. Every corner is polished; every banner is measured.
2. The active hero steps forward while the rest of the party holds the board steady.
3. Bloxley raises his scepter. Royal blocks form a square frame around the final battlefield.
4. The route choice card appears, offering practical challenge, compassionate truth, or festive provocation.

###### Pre-Choice Dialogue

- **King Bloxley:** "Behold a palace of proper lines, obedient corners, and excellent symmetry. Why does the festival resist perfection?"
- **Pippa:** "Because a festival is not a statue. It is a place where people gather, move, spill crumbs, and still belong."
- **King Bloxley:** "Belonging without order becomes a pile."
- **Pippa:** "Order without welcome becomes a wall."

###### Final Dialogue Choices

###### A. "Order can serve the festival."

- **Player Line:** "A banquet cannot be ruled with corners alone."
- **King Bloxley:** "A measured answer. Sensible. Respectable. Slightly insufficient, but not without merit."
- **Result:** Eligible for Normal Ending if True Ending flags are incomplete.

###### B. "You wanted an invitation."

- **Player Line:** "You were trying to host everyone, but you forgot to ask what they could eat."
- **King Bloxley:** "Invited? I am the king. Kings do not wait beside the lantern table."
- **Pippa:** "Perhaps they should, if they wish to know why the lanterns shine."
- **Result:** Grants final insight flag and checks True Ending eligibility.

###### C. "Let the festival answer you in its own shape."

- **Player Line:** "I challenge the throne to a cake tasting. Winner chooses the table shape."
- **King Bloxley:** "That is either nonsense or pageantry. I am alarmed that I enjoy both."
- **Result:** Adds an extra royal pattern but increases final reward if defeated.

###### Ending Branch Logic

- If required true flags and campaign requirements are met: trigger `END_PIPPA_TRUE`.
- Otherwise: trigger `END_PIPPA_NORMAL`.
- If player chose C and wins: add a bonus festival postcard to either ending.

---

##### END_PIPPA_NORMAL — Emergency Frosting Victory

**Ending Type:** Character Normal Ending.  
**Tone:** Successful, warm, and complete, but not the deepest emotional resolution.

###### Storyboard Panels & Script

1. **Panel 1:** King Bloxley is defeated, and the palace releases its strictest royal blocks into a shower of harmless confetti.
2. **Panel 2:** Pippa helps restore the festival booth most closely tied to their route.
3. **Panel 3:** The crowd cheers, the monsters settle, and the Block-O-Matic 3000 folds the dungeon pressure into a neat festival cube.
4. **Panel 4:** Pippa receives a commemorative ribbon, carefully lettered by the Festival Announcer.
5. **Panel 5:** The final shot shows the festival safe, bright, and slightly more organized than before.

###### Ending Dialogue

- **Festival Announcer:** "By courage, kindness, and unusually tidy block work, the festival stands restored."
- **Pippa:** "There is still much to mend, but tonight there is music. That is a fine beginning."
- **Block-O-Matic 3000:** "Celebration stabilized. Gratitude pending."
- **King Bloxley:** "I shall permit this arrangement. Temporarily. For morale."

###### Reward

- Pippa starts future runs with Fireball upgraded once.
- Unlock route badge: `badge_emergency_frosting_victory`

---

##### END_PIPPA_TRUE — The Great Slime Bake-Off

**Ending Type:** Character True Ending.  
**Tone:** Joyful resolution with deeper understanding of the Block-O-Matic, Bloxley, and the chosen hero.

###### Storyboard Panels & Script

1. **Panel 1:** After the final cascade, the palace does not collapse. It unfolds into a festival stage, each block finding a new place without being forced.
2. **Panel 2:** Pippa recognizes that the chaos was not malice. It was an invitation written in the only language the machine knew: blocks, pressure, and spectacle.
3. **Panel 3:** King Bloxley removes his crown and places it on the stage railing, where anyone may admire it without obeying it.
4. **Panel 4:** The Block-O-Matic 3000 is given an official role in the festival, not as ruler or mistake, but as Game Master.
5. **Panel 5:** Pippa's restored booth becomes part of a yearly celebration where monsters, townsfolk, and heroes compete in friendly cascade battles.

###### Ending Dialogue

- **Pippa:** "The festival did not need to be perfect. It needed to be shared."
- **King Bloxley:** "Shared order. Voluntary symmetry. Ceremonial rectangles. I will consider this compromise magnificent."
- **Block-O-Matic 3000:** "Invitation received. Festival Game Master mode unlocked."
- **Festival Announcer:** "Let it be recorded: the dungeon is now allowed to open only with snacks, safety rails, and proper applause."
- **Pippa:** "Then let the next game begin gently."

###### Reward

- Unlocks Slime Bake-Off event rooms and a pastry-themed spell cosmetic.
- Unlock true route badge: `badge_the_great_slime_bake_off`
- Add ending gallery card: `route_pippa_pyromancer_true_gallery_card`

---

#### Route 3 — Zuzu, the Goblin Engineer

**Route ID:** `route_zuzu_goblin_engineer`  
**Theme:** A brilliant invention still needs responsibility.  
**Core Conflict:** Zuzu masks guilt with speed, confidence, and enthusiastic explosions. Her true path has her document mistakes, repair what she can, and admit that a feature becomes a flaw when nobody can trust it.  
**Focus NPC:** Professor Poplin  
**Normal Ending:** Certified Mostly-Safe Engineer  
**True Ending:** The Grand Repair Guild

##### True Ending Requirements

To unlock **The Grand Repair Guild**, the player should satisfy most of these requirements in the same completed route run:


- Earn route flag `zuzu_flag_admitted_test_error`.

- Earn route flag `zuzu_flag_repaired_warning_lights`.

- Earn route flag `zuzu_flag_shared_safety_notes`.

- Earn route flag `zuzu_flag_bloxley_manual`.

- Defeat King Bloxley with Zuzu selected.
- Avoid choosing only practical/direct answers across the entire route.
- Recover at least 3 Lost Cakes across the campaign or complete 3 stage goals.
- Trigger at least 5 cascades in the final stage or satisfy the route-specific final choice.

##### Route Scene Index

| Scene ID | Stage | Route Beat | True Flag |
| --- | --- | --- | --- |

| `SCN_ZUZU_01` | Sprinkle Sewers | A frosting valve is connected to a confetti pressure line that Zuzu once “improved.” | `zuzu_flag_admitted_test_error` |

| `SCN_ZUZU_02` | Goblin Workshop | Prototype No. 7 is running on Zuzu’s abandoned enthusiasm checklist. | `zuzu_flag_repaired_warning_lights` |

| `SCN_ZUZU_03` | Frosty Pantry | A freezer fan spins backward because its arrow was drawn “more excitingly.” | `zuzu_flag_shared_safety_notes` |

| `SCN_ZUZU_04` | Pillow Castle | Pillow Castle springs were installed as “morale launchers.” | `zuzu_flag_bloxley_manual` |

| `SCN_ZUZU_05` | Starfall Arcade | An arcade cabinet uses Zuzu’s score booster without a grounding charm. | `zuzu_flag_bloxley_manual` |

| `SCN_ZUZU_06` | Bloxley's Block Palace | Bloxley’s royal seals are attached with technically beautiful, ethically questionable clamps. | `zuzu_flag_bloxley_manual` |


---


##### SCN_ZUZU_01 — Zuzu Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Zuzu.  
**Location:** Sprinkle Sewers.  
**Story Beat:** A frosting valve is connected to a confetti pressure line that Zuzu once “improved.”  
**Route Flag Opportunity:** `zuzu_flag_admitted_test_error` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Sprinkle Sewers; rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.
2. A route-specific detail catches Zuzu's attention: a frosting valve is connected to a confetti pressure line that zuzu once “improved.”
3. The board preview flickers with a small thematic warning linked to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
4. The focus NPC, **Professor Poplin**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Zuzu:** "Before anyone asks, I can explain most of this, and repair slightly more than most of it."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: A frosting valve is connected to a confetti pressure line that Zuzu once “improved.”"
- **Professor Poplin:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Zuzu:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Shut it down, label the sparks, and no one touches the lever twice."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Zuzu resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "This machine is overcorrecting. Let us find what command it thought it heard."
- **NPC Response:** "Then hear this: the first altered valve."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Zuzu's personal fear becomes clear.
- **Gameplay Result:** sticky hazards show pressure meters.
- **Grant Flag:** `zuzu_flag_admitted_test_error`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Live Calibration

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will tune it live. Everyone admire the confidence from a respectful distance."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Zuzu:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Zuzu:** "There. Still eccentric, but now the eccentricity has guardrails."
- **Route Note:** Store `zuzu_flag_admitted_test_error` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_ZUZU_02 — Zuzu Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Zuzu.  
**Location:** Goblin Workshop.  
**Story Beat:** Prototype No. 7 is running on Zuzu’s abandoned enthusiasm checklist.  
**Route Flag Opportunity:** `zuzu_flag_repaired_warning_lights` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Goblin Workshop; brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.
2. A route-specific detail catches Zuzu's attention: prototype no. 7 is running on zuzu’s abandoned enthusiasm checklist.
3. The board preview flickers with a small thematic warning linked to junk blocks, bomb blocks, board shake, and gadget hazards.
4. The focus NPC, **Professor Poplin**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Zuzu:** "Before anyone asks, I can explain most of this, and repair slightly more than most of it."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Prototype No. 7 is running on Zuzu’s abandoned enthusiasm checklist."
- **Professor Poplin:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Zuzu:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Shut it down, label the sparks, and no one touches the lever twice."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Zuzu resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to junk blocks, bomb blocks, board shake, and gadget hazards.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "This machine is overcorrecting. Let us find what command it thought it heard."
- **NPC Response:** "Then hear this: the missing safety appendix."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Zuzu's personal fear becomes clear.
- **Gameplay Result:** junk queue delays by one extra piece after repair.
- **Grant Flag:** `zuzu_flag_repaired_warning_lights`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Live Calibration

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will tune it live. Everyone admire the confidence from a respectful distance."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Zuzu:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Zuzu:** "There. Still eccentric, but now the eccentricity has guardrails."
- **Route Note:** Store `zuzu_flag_repaired_warning_lights` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_ZUZU_03 — Zuzu Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Zuzu.  
**Location:** Frosty Pantry.  
**Story Beat:** A freezer fan spins backward because its arrow was drawn “more excitingly.”  
**Route Flag Opportunity:** `zuzu_flag_shared_safety_notes` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Frosty Pantry; glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.
2. A route-specific detail catches Zuzu's attention: a freezer fan spins backward because its arrow was drawn “more excitingly.”
3. The board preview flickers with a small thematic warning linked to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
4. The focus NPC, **Professor Poplin**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Zuzu:** "Before anyone asks, I can explain most of this, and repair slightly more than most of it."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: A freezer fan spins backward because its arrow was drawn “more excitingly.”"
- **Professor Poplin:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Zuzu:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Shut it down, label the sparks, and no one touches the lever twice."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Zuzu resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "This machine is overcorrecting. Let us find what command it thought it heard."
- **NPC Response:** "Then hear this: how the fan was mislabeled."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Zuzu's personal fear becomes clear.
- **Gameplay Result:** speed waves become smoother once.
- **Grant Flag:** `zuzu_flag_shared_safety_notes`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Live Calibration

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will tune it live. Everyone admire the confidence from a respectful distance."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Zuzu:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Zuzu:** "There. Still eccentric, but now the eccentricity has guardrails."
- **Route Note:** Store `zuzu_flag_shared_safety_notes` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_ZUZU_04 — Zuzu Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Zuzu.  
**Location:** Pillow Castle.  
**Story Beat:** Pillow Castle springs were installed as “morale launchers.”  
**Route Flag Opportunity:** `zuzu_flag_bloxley_manual` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Pillow Castle; blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.
2. A route-specific detail catches Zuzu's attention: pillow castle springs were installed as “morale launchers.”
3. The board preview flickers with a small thematic warning linked to soft blocks, shielded enemies, and Sleepy status effects.
4. The focus NPC, **Professor Poplin**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Zuzu:** "Before anyone asks, I can explain most of this, and repair slightly more than most of it."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Pillow Castle springs were installed as “morale launchers.”"
- **Professor Poplin:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Zuzu:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Shut it down, label the sparks, and no one touches the lever twice."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Zuzu resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to soft blocks, shielded enemies, and Sleepy status effects.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "This machine is overcorrecting. Let us find what command it thought it heard."
- **NPC Response:** "Then hear this: why sleep rooms bounce too much."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Zuzu's personal fear becomes clear.
- **Gameplay Result:** Sleepy effect has a reduced duration.
- **Grant Flag:** `zuzu_flag_bloxley_manual`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Live Calibration

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will tune it live. Everyone admire the confidence from a respectful distance."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Zuzu:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Zuzu:** "There. Still eccentric, but now the eccentricity has guardrails."
- **Route Note:** Store `zuzu_flag_bloxley_manual` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_ZUZU_05 — Zuzu Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Zuzu.  
**Location:** Starfall Arcade.  
**Story Beat:** An arcade cabinet uses Zuzu’s score booster without a grounding charm.  
**Route Flag Opportunity:** `zuzu_flag_bloxley_manual` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Starfall Arcade; neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.
2. A route-specific detail catches Zuzu's attention: an arcade cabinet uses zuzu’s score booster without a grounding charm.
3. The board preview flickers with a small thematic warning linked to Fever gain, cascade challenges, score callouts, and preview disruption.
4. The focus NPC, **Professor Poplin**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Zuzu:** "Before anyone asks, I can explain most of this, and repair slightly more than most of it."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: An arcade cabinet uses Zuzu’s score booster without a grounding charm."
- **Professor Poplin:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Zuzu:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Shut it down, label the sparks, and no one touches the lever twice."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Zuzu resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to Fever gain, cascade challenges, score callouts, and preview disruption.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "This machine is overcorrecting. Let us find what command it thought it heard."
- **NPC Response:** "Then hear this: why the cabinet overrewards chaos."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Zuzu's personal fear becomes clear.
- **Gameplay Result:** Fever gain becomes more predictable.
- **Grant Flag:** `zuzu_flag_bloxley_manual`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Live Calibration

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will tune it live. Everyone admire the confidence from a respectful distance."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Zuzu:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Zuzu:** "There. Still eccentric, but now the eccentricity has guardrails."
- **Route Note:** Store `zuzu_flag_bloxley_manual` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_ZUZU_06 — Zuzu Route Scene in Bloxley's Block Palace

**Trigger:** First route event in Bloxley's Block Palace while playing Zuzu.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Bloxley’s royal seals are attached with technically beautiful, ethically questionable clamps.  
**Route Flag Opportunity:** `zuzu_flag_bloxley_manual` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Bloxley's Block Palace; square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.
2. A route-specific detail catches Zuzu's attention: bloxley’s royal seals are attached with technically beautiful, ethically questionable clamps.
3. The board preview flickers with a small thematic warning linked to royal blocks, symmetry checks, pattern junk, and final board pressure.
4. The focus NPC, **Professor Poplin**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Zuzu:** "Before anyone asks, I can explain most of this, and repair slightly more than most of it."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Bloxley’s royal seals are attached with technically beautiful, ethically questionable clamps."
- **Professor Poplin:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Zuzu:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Shut it down, label the sparks, and no one touches the lever twice."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Zuzu resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "This machine is overcorrecting. Let us find what command it thought it heard."
- **NPC Response:** "Then hear this: the palace’s borrowed mechanism."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Zuzu's personal fear becomes clear.
- **Gameplay Result:** Royal Eraser effect improves for this route.
- **Grant Flag:** `zuzu_flag_bloxley_manual`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Live Calibration

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will tune it live. Everyone admire the confidence from a respectful distance."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Zuzu:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Zuzu:** "There. Still eccentric, but now the eccentricity has guardrails."
- **Route Note:** Store `zuzu_flag_bloxley_manual` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_ZUZU_FINAL_BLOXLEY — Final Route Choice Before King Bloxley

**Trigger:** Before the final phase of the King Bloxley fight while playing Zuzu.  
**Location:** Bloxley's Block Palace throne room.  
**Purpose:** Resolve the character route and select Normal or True Ending eligibility.

###### Storyboard Panels

1. King Bloxley sits upon a throne of radiant royal blocks. Every corner is polished; every banner is measured.
2. The active hero steps forward while the rest of the party holds the board steady.
3. Bloxley raises his scepter. Royal blocks form a square frame around the final battlefield.
4. The route choice card appears, offering practical challenge, compassionate truth, or festive provocation.

###### Pre-Choice Dialogue

- **King Bloxley:** "Behold a palace of proper lines, obedient corners, and excellent symmetry. Why does the festival resist perfection?"
- **Zuzu:** "Because a festival is not a statue. It is a place where people gather, move, spill crumbs, and still belong."
- **King Bloxley:** "Belonging without order becomes a pile."
- **Zuzu:** "Order without welcome becomes a wall."

###### Final Dialogue Choices

###### A. "Order can serve the festival."

- **Player Line:** "Your palace is well built, but it is hostile to maintenance."
- **King Bloxley:** "A measured answer. Sensible. Respectable. Slightly insufficient, but not without merit."
- **Result:** Eligible for Normal Ending if True Ending flags are incomplete.

###### B. "You wanted an invitation."

- **Player Line:** "You made rules because you feared collapse. I know that feeling better than I like."
- **King Bloxley:** "Invited? I am the king. Kings do not wait beside the lantern table."
- **Zuzu:** "Perhaps they should, if they wish to know why the lanterns shine."
- **Result:** Grants final insight flag and checks True Ending eligibility.

###### C. "Let the festival answer you in its own shape."

- **Player Line:** "I can make the palace applaud when it rearranges. Is that wise? No. Is it delightful? Yes."
- **King Bloxley:** "That is either nonsense or pageantry. I am alarmed that I enjoy both."
- **Result:** Adds an extra royal pattern but increases final reward if defeated.

###### Ending Branch Logic

- If required true flags and campaign requirements are met: trigger `END_ZUZU_TRUE`.
- Otherwise: trigger `END_ZUZU_NORMAL`.
- If player chose C and wins: add a bonus festival postcard to either ending.

---

##### END_ZUZU_NORMAL — Certified Mostly-Safe Engineer

**Ending Type:** Character Normal Ending.  
**Tone:** Successful, warm, and complete, but not the deepest emotional resolution.

###### Storyboard Panels & Script

1. **Panel 1:** King Bloxley is defeated, and the palace releases its strictest royal blocks into a shower of harmless confetti.
2. **Panel 2:** Zuzu helps restore the festival booth most closely tied to their route.
3. **Panel 3:** The crowd cheers, the monsters settle, and the Block-O-Matic 3000 folds the dungeon pressure into a neat festival cube.
4. **Panel 4:** Zuzu receives a commemorative ribbon, carefully lettered by the Festival Announcer.
5. **Panel 5:** The final shot shows the festival safe, bright, and slightly more organized than before.

###### Ending Dialogue

- **Festival Announcer:** "By courage, kindness, and unusually tidy block work, the festival stands restored."
- **Zuzu:** "There is still much to mend, but tonight there is music. That is a fine beginning."
- **Block-O-Matic 3000:** "Celebration stabilized. Gratitude pending."
- **King Bloxley:** "I shall permit this arrangement. Temporarily. For morale."

###### Reward

- Zuzu starts with one Bomb Rune charge.
- Unlock route badge: `badge_certified_mostly_safe_engineer`

---

##### END_ZUZU_TRUE — The Grand Repair Guild

**Ending Type:** Character True Ending.  
**Tone:** Joyful resolution with deeper understanding of the Block-O-Matic, Bloxley, and the chosen hero.

###### Storyboard Panels & Script

1. **Panel 1:** After the final cascade, the palace does not collapse. It unfolds into a festival stage, each block finding a new place without being forced.
2. **Panel 2:** Zuzu recognizes that the chaos was not malice. It was an invitation written in the only language the machine knew: blocks, pressure, and spectacle.
3. **Panel 3:** King Bloxley removes his crown and places it on the stage railing, where anyone may admire it without obeying it.
4. **Panel 4:** The Block-O-Matic 3000 is given an official role in the festival, not as ruler or mistake, but as Game Master.
5. **Panel 5:** Zuzu's restored booth becomes part of a yearly celebration where monsters, townsfolk, and heroes compete in friendly cascade battles.

###### Ending Dialogue

- **Zuzu:** "The festival did not need to be perfect. It needed to be shared."
- **King Bloxley:** "Shared order. Voluntary symmetry. Ceremonial rectangles. I will consider this compromise magnificent."
- **Block-O-Matic 3000:** "Invitation received. Festival Game Master mode unlocked."
- **Festival Announcer:** "Let it be recorded: the dungeon is now allowed to open only with snacks, safety rails, and proper applause."
- **Zuzu:** "Then let the next game begin gently."

###### Reward

- Unlocks the Repair Guild hub booth and safer gadget variants in shops.
- Unlock true route badge: `badge_the_grand_repair_guild`
- Add ending gallery card: `route_zuzu_goblin_engineer_true_gallery_card`

---

#### Route 4 — Nixie, the Frostbinder

**Route ID:** `route_nixie_frostbinder`  
**Theme:** Calm is not distance; it is care with steady hands.  
**Core Conflict:** Nixie uses composure to keep others safe, but she sometimes freezes her own worry in place. Her true route turns control into trust and preservation into generosity.  
**Focus NPC:** Gelato Golem  
**Normal Ending:** Rainbow Gelato Restored  
**True Ending:** The Midnight Snowcone Festival

##### True Ending Requirements

To unlock **The Midnight Snowcone Festival**, the player should satisfy most of these requirements in the same completed route run:


- Earn route flag `nixie_flag_saved_crates_gently`.

- Earn route flag `nixie_flag_warmed_frozen_note`.

- Earn route flag `nixie_flag_shared_gelato`.

- Earn route flag `nixie_flag_bloxley_thawed`.

- Defeat King Bloxley with Nixie selected.
- Avoid choosing only practical/direct answers across the entire route.
- Recover at least 3 Lost Cakes across the campaign or complete 3 stage goals.
- Trigger at least 5 cascades in the final stage or satisfy the route-specific final choice.

##### Route Scene Index

| Scene ID | Stage | Route Beat | True Flag |
| --- | --- | --- | --- |

| `SCN_NIXIE_01` | Sprinkle Sewers | Sprinkle Sewers frosting has chilled into candy glass around missing gelato tokens. | `nixie_flag_saved_crates_gently` |

| `SCN_NIXIE_02` | Goblin Workshop | Workshop fans are blowing warm sparks into the pantry supply route. | `nixie_flag_warmed_frozen_note` |

| `SCN_NIXIE_03` | Frosty Pantry | The Gelato Golem is guarding crates because it believes melting means failure. | `nixie_flag_shared_gelato` |

| `SCN_NIXIE_04` | Pillow Castle | Pillow Castle blankets keep the freezer crates stable during travel. | `nixie_flag_bloxley_thawed` |

| `SCN_NIXIE_05` | Starfall Arcade | Arcade prize coolers contain tickets exchanged for stolen gelato spoons. | `nixie_flag_bloxley_thawed` |

| `SCN_NIXIE_06` | Bloxley's Block Palace | Bloxley insists every dessert must be cut into perfect squares before serving. | `nixie_flag_bloxley_thawed` |


---


##### SCN_NIXIE_01 — Nixie Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Nixie.  
**Location:** Sprinkle Sewers.  
**Story Beat:** Sprinkle Sewers frosting has chilled into candy glass around missing gelato tokens.  
**Route Flag Opportunity:** `nixie_flag_saved_crates_gently` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Sprinkle Sewers; rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.
2. A route-specific detail catches Nixie's attention: sprinkle sewers frosting has chilled into candy glass around missing gelato tokens.
3. The board preview flickers with a small thematic warning linked to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
4. The focus NPC, **Gelato Golem**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Nixie:** "Steady now. Even a storm of blocks has a temperature."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Sprinkle Sewers frosting has chilled into candy glass around missing gelato tokens."
- **Gelato Golem:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Nixie:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Lower the heat, clear the lane, and give the board room to breathe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Nixie resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Nothing melts because it is weak. It melts because the room changed."
- **NPC Response:** "Then hear this: the cold sugar trail."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Nixie's personal fear becomes clear.
- **Gameplay Result:** sticky blocks may become brittle when chilled.
- **Grant Flag:** `nixie_flag_saved_crates_gently`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Glittering Chill

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Let the cold sparkle a little. Carefully. Elegantly. No avalanches, please."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Nixie:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Nixie:** "There. The room has remembered how to be gentle."
- **Route Note:** Store `nixie_flag_saved_crates_gently` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_NIXIE_02 — Nixie Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Nixie.  
**Location:** Goblin Workshop.  
**Story Beat:** Workshop fans are blowing warm sparks into the pantry supply route.  
**Route Flag Opportunity:** `nixie_flag_warmed_frozen_note` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Goblin Workshop; brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.
2. A route-specific detail catches Nixie's attention: workshop fans are blowing warm sparks into the pantry supply route.
3. The board preview flickers with a small thematic warning linked to junk blocks, bomb blocks, board shake, and gadget hazards.
4. The focus NPC, **Gelato Golem**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Nixie:** "Steady now. Even a storm of blocks has a temperature."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Workshop fans are blowing warm sparks into the pantry supply route."
- **Gelato Golem:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Nixie:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Lower the heat, clear the lane, and give the board room to breathe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Nixie resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to junk blocks, bomb blocks, board shake, and gadget hazards.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Nothing melts because it is weak. It melts because the room changed."
- **NPC Response:** "Then hear this: the misplaced heat source."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Nixie's personal fear becomes clear.
- **Gameplay Result:** freeze hazards show earlier warnings.
- **Grant Flag:** `nixie_flag_warmed_frozen_note`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Glittering Chill

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Let the cold sparkle a little. Carefully. Elegantly. No avalanches, please."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Nixie:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Nixie:** "There. The room has remembered how to be gentle."
- **Route Note:** Store `nixie_flag_warmed_frozen_note` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_NIXIE_03 — Nixie Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Nixie.  
**Location:** Frosty Pantry.  
**Story Beat:** The Gelato Golem is guarding crates because it believes melting means failure.  
**Route Flag Opportunity:** `nixie_flag_shared_gelato` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Frosty Pantry; glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.
2. A route-specific detail catches Nixie's attention: the gelato golem is guarding crates because it believes melting means failure.
3. The board preview flickers with a small thematic warning linked to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
4. The focus NPC, **Gelato Golem**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Nixie:** "Steady now. Even a storm of blocks has a temperature."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: The Gelato Golem is guarding crates because it believes melting means failure."
- **Gelato Golem:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Nixie:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Lower the heat, clear the lane, and give the board room to breathe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Nixie resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Nothing melts because it is weak. It melts because the room changed."
- **NPC Response:** "Then hear this: the golem’s fear of change."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Nixie's personal fear becomes clear.
- **Gameplay Result:** ice blocks may melt into mana once.
- **Grant Flag:** `nixie_flag_shared_gelato`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Glittering Chill

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Let the cold sparkle a little. Carefully. Elegantly. No avalanches, please."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Nixie:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Nixie:** "There. The room has remembered how to be gentle."
- **Route Note:** Store `nixie_flag_shared_gelato` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_NIXIE_04 — Nixie Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Nixie.  
**Location:** Pillow Castle.  
**Story Beat:** Pillow Castle blankets keep the freezer crates stable during travel.  
**Route Flag Opportunity:** `nixie_flag_bloxley_thawed` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Pillow Castle; blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.
2. A route-specific detail catches Nixie's attention: pillow castle blankets keep the freezer crates stable during travel.
3. The board preview flickers with a small thematic warning linked to soft blocks, shielded enemies, and Sleepy status effects.
4. The focus NPC, **Gelato Golem**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Nixie:** "Steady now. Even a storm of blocks has a temperature."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Pillow Castle blankets keep the freezer crates stable during travel."
- **Gelato Golem:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Nixie:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Lower the heat, clear the lane, and give the board room to breathe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Nixie resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to soft blocks, shielded enemies, and Sleepy status effects.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Nothing melts because it is weak. It melts because the room changed."
- **NPC Response:** "Then hear this: how softness protects cold."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Nixie's personal fear becomes clear.
- **Gameplay Result:** Sleepy status grants small shield after clearing.
- **Grant Flag:** `nixie_flag_bloxley_thawed`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Glittering Chill

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Let the cold sparkle a little. Carefully. Elegantly. No avalanches, please."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Nixie:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Nixie:** "There. The room has remembered how to be gentle."
- **Route Note:** Store `nixie_flag_bloxley_thawed` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_NIXIE_05 — Nixie Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Nixie.  
**Location:** Starfall Arcade.  
**Story Beat:** Arcade prize coolers contain tickets exchanged for stolen gelato spoons.  
**Route Flag Opportunity:** `nixie_flag_bloxley_thawed` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Starfall Arcade; neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.
2. A route-specific detail catches Nixie's attention: arcade prize coolers contain tickets exchanged for stolen gelato spoons.
3. The board preview flickers with a small thematic warning linked to Fever gain, cascade challenges, score callouts, and preview disruption.
4. The focus NPC, **Gelato Golem**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Nixie:** "Steady now. Even a storm of blocks has a temperature."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Arcade prize coolers contain tickets exchanged for stolen gelato spoons."
- **Gelato Golem:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Nixie:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Lower the heat, clear the lane, and give the board room to breathe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Nixie resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to Fever gain, cascade challenges, score callouts, and preview disruption.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Nothing melts because it is weak. It melts because the room changed."
- **NPC Response:** "Then hear this: where the spoons were hidden."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Nixie's personal fear becomes clear.
- **Gameplay Result:** Fever activation slows speed briefly.
- **Grant Flag:** `nixie_flag_bloxley_thawed`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Glittering Chill

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Let the cold sparkle a little. Carefully. Elegantly. No avalanches, please."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Nixie:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Nixie:** "There. The room has remembered how to be gentle."
- **Route Note:** Store `nixie_flag_bloxley_thawed` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_NIXIE_06 — Nixie Route Scene in Bloxley's Block Palace

**Trigger:** First route event in Bloxley's Block Palace while playing Nixie.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Bloxley insists every dessert must be cut into perfect squares before serving.  
**Route Flag Opportunity:** `nixie_flag_bloxley_thawed` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Bloxley's Block Palace; square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.
2. A route-specific detail catches Nixie's attention: bloxley insists every dessert must be cut into perfect squares before serving.
3. The board preview flickers with a small thematic warning linked to royal blocks, symmetry checks, pattern junk, and final board pressure.
4. The focus NPC, **Gelato Golem**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Nixie:** "Steady now. Even a storm of blocks has a temperature."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Bloxley insists every dessert must be cut into perfect squares before serving."
- **Gelato Golem:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Nixie:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Lower the heat, clear the lane, and give the board room to breathe."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Nixie resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Nothing melts because it is weak. It melts because the room changed."
- **NPC Response:** "Then hear this: why the pantry rebelled."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Nixie's personal fear becomes clear.
- **Gameplay Result:** royal pattern timer slows once.
- **Grant Flag:** `nixie_flag_bloxley_thawed`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Glittering Chill

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "Let the cold sparkle a little. Carefully. Elegantly. No avalanches, please."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Nixie:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Nixie:** "There. The room has remembered how to be gentle."
- **Route Note:** Store `nixie_flag_bloxley_thawed` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_NIXIE_FINAL_BLOXLEY — Final Route Choice Before King Bloxley

**Trigger:** Before the final phase of the King Bloxley fight while playing Nixie.  
**Location:** Bloxley's Block Palace throne room.  
**Purpose:** Resolve the character route and select Normal or True Ending eligibility.

###### Storyboard Panels

1. King Bloxley sits upon a throne of radiant royal blocks. Every corner is polished; every banner is measured.
2. The active hero steps forward while the rest of the party holds the board steady.
3. Bloxley raises his scepter. Royal blocks form a square frame around the final battlefield.
4. The route choice card appears, offering practical challenge, compassionate truth, or festive provocation.

###### Pre-Choice Dialogue

- **King Bloxley:** "Behold a palace of proper lines, obedient corners, and excellent symmetry. Why does the festival resist perfection?"
- **Nixie:** "Because a festival is not a statue. It is a place where people gather, move, spill crumbs, and still belong."
- **King Bloxley:** "Belonging without order becomes a pile."
- **Nixie:** "Order without welcome becomes a wall."

###### Final Dialogue Choices

###### A. "Order can serve the festival."

- **Player Line:** "A palace may be orderly without being frozen still."
- **King Bloxley:** "A measured answer. Sensible. Respectable. Slightly insufficient, but not without merit."
- **Result:** Eligible for Normal Ending if True Ending flags are incomplete.

###### B. "You wanted an invitation."

- **Player Line:** "You feared the festival would melt into confusion, so you hardened it too much."
- **King Bloxley:** "Invited? I am the king. Kings do not wait beside the lantern table."
- **Nixie:** "Perhaps they should, if they wish to know why the lanterns shine."
- **Result:** Grants final insight flag and checks True Ending eligibility.

###### C. "Let the festival answer you in its own shape."

- **Player Line:** "I propose an ice sculpture contest. The first rule: no one measures the corners."
- **King Bloxley:** "That is either nonsense or pageantry. I am alarmed that I enjoy both."
- **Result:** Adds an extra royal pattern but increases final reward if defeated.

###### Ending Branch Logic

- If required true flags and campaign requirements are met: trigger `END_NIXIE_TRUE`.
- Otherwise: trigger `END_NIXIE_NORMAL`.
- If player chose C and wins: add a bonus festival postcard to either ending.

---

##### END_NIXIE_NORMAL — Rainbow Gelato Restored

**Ending Type:** Character Normal Ending.  
**Tone:** Successful, warm, and complete, but not the deepest emotional resolution.

###### Storyboard Panels & Script

1. **Panel 1:** King Bloxley is defeated, and the palace releases its strictest royal blocks into a shower of harmless confetti.
2. **Panel 2:** Nixie helps restore the festival booth most closely tied to their route.
3. **Panel 3:** The crowd cheers, the monsters settle, and the Block-O-Matic 3000 folds the dungeon pressure into a neat festival cube.
4. **Panel 4:** Nixie receives a commemorative ribbon, carefully lettered by the Festival Announcer.
5. **Panel 5:** The final shot shows the festival safe, bright, and slightly more organized than before.

###### Ending Dialogue

- **Festival Announcer:** "By courage, kindness, and unusually tidy block work, the festival stands restored."
- **Nixie:** "There is still much to mend, but tonight there is music. That is a fine beginning."
- **Block-O-Matic 3000:** "Celebration stabilized. Gratitude pending."
- **King Bloxley:** "I shall permit this arrangement. Temporarily. For morale."

###### Reward

- Nixie gains improved Frost Lock duration.
- Unlock route badge: `badge_rainbow_gelato_restored`

---

##### END_NIXIE_TRUE — The Midnight Snowcone Festival

**Ending Type:** Character True Ending.  
**Tone:** Joyful resolution with deeper understanding of the Block-O-Matic, Bloxley, and the chosen hero.

###### Storyboard Panels & Script

1. **Panel 1:** After the final cascade, the palace does not collapse. It unfolds into a festival stage, each block finding a new place without being forced.
2. **Panel 2:** Nixie recognizes that the chaos was not malice. It was an invitation written in the only language the machine knew: blocks, pressure, and spectacle.
3. **Panel 3:** King Bloxley removes his crown and places it on the stage railing, where anyone may admire it without obeying it.
4. **Panel 4:** The Block-O-Matic 3000 is given an official role in the festival, not as ruler or mistake, but as Game Master.
5. **Panel 5:** Nixie's restored booth becomes part of a yearly celebration where monsters, townsfolk, and heroes compete in friendly cascade battles.

###### Ending Dialogue

- **Nixie:** "The festival did not need to be perfect. It needed to be shared."
- **King Bloxley:** "Shared order. Voluntary symmetry. Ceremonial rectangles. I will consider this compromise magnificent."
- **Block-O-Matic 3000:** "Invitation received. Festival Game Master mode unlocked."
- **Festival Announcer:** "Let it be recorded: the dungeon is now allowed to open only with snacks, safety rails, and proper applause."
- **Nixie:** "Then let the next game begin gently."

###### Reward

- Unlocks Midnight Snowcone event and chill-themed cascade VFX.
- Unlock true route badge: `badge_the_midnight_snowcone_festival`
- Add ending gallery card: `route_nixie_frostbinder_true_gallery_card`

---

#### Route 5 — Bruk, the Snack Knight

**Route ID:** `route_bruk_snack_knight`  
**Theme:** Guardianship means nourishment, not possession.  
**Core Conflict:** Bruk believes every missing snack is a personal failure. His true route teaches him to protect the table by sharing it wisely, not by standing between everyone and every crumb.  
**Focus NPC:** Cake Judge  
**Normal Ending:** Snack Table Secure  
**True Ending:** The Open Table Oath

##### True Ending Requirements

To unlock **The Open Table Oath**, the player should satisfy most of these requirements in the same completed route run:


- Earn route flag `bruk_flag_shared_rations`.

- Earn route flag `bruk_flag_protected_without_scolding`.

- Earn route flag `bruk_flag_invited_monsters_to_table`.

- Earn route flag `bruk_flag_bloxley_fed`.

- Defeat King Bloxley with Bruk selected.
- Avoid choosing only practical/direct answers across the entire route.
- Recover at least 3 Lost Cakes across the campaign or complete 3 stage goals.
- Trigger at least 5 cascades in the final stage or satisfy the route-specific final choice.

##### Route Scene Index

| Scene ID | Stage | Route Beat | True Flag |
| --- | --- | --- | --- |

| `SCN_BRUK_01` | Sprinkle Sewers | Sewer monsters hoard cupcakes because the snack table looked guarded, not welcoming. | `bruk_flag_shared_rations` |

| `SCN_BRUK_02` | Goblin Workshop | Goblin workers skipped lunch and replaced good judgment with buttons. | `bruk_flag_protected_without_scolding` |

| `SCN_BRUK_03` | Frosty Pantry | Freezer creatures protected snacks from melting but forgot to tell anyone. | `bruk_flag_invited_monsters_to_table` |

| `SCN_BRUK_04` | Pillow Castle | Pillow guards sleep near flour sacks because they have been on duty too long. | `bruk_flag_bloxley_fed` |

| `SCN_BRUK_05` | Starfall Arcade | Arcade prizes include snack vouchers no one knows how to redeem. | `bruk_flag_bloxley_fed` |

| `SCN_BRUK_06` | Bloxley's Block Palace | Bloxley’s palace stores food by shape instead of need. | `bruk_flag_bloxley_fed` |


---


##### SCN_BRUK_01 — Bruk Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Bruk.  
**Location:** Sprinkle Sewers.  
**Story Beat:** Sewer monsters hoard cupcakes because the snack table looked guarded, not welcoming.  
**Route Flag Opportunity:** `bruk_flag_shared_rations` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Sprinkle Sewers; rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.
2. A route-specific detail catches Bruk's attention: sewer monsters hoard cupcakes because the snack table looked guarded, not welcoming.
3. The board preview flickers with a small thematic warning linked to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
4. The focus NPC, **Cake Judge**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Bruk:** "No snack shall be abandoned. Also, perhaps no guest should be frightened away from the table."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Sewer monsters hoard cupcakes because the snack table looked guarded, not welcoming."
- **Cake Judge:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Bruk:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Secure the supplies first. Hospitality works better when the pantry is not escaping."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Bruk resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Tell me who is hungry, and I will not draw my shield before hearing the answer."
- **NPC Response:** "Then hear this: the fear around the table."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Bruk's personal fear becomes clear.
- **Gameplay Result:** befriended slimes reduce sticky spawns.
- **Grant Flag:** `bruk_flag_shared_rations`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Ceremonial Snack Truce

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I shall announce a snack truce. Loudly. With ceremonial crackers."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Bruk:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Bruk:** "The table is safer when more hands help protect it."
- **Route Note:** Store `bruk_flag_shared_rations` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_BRUK_02 — Bruk Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Bruk.  
**Location:** Goblin Workshop.  
**Story Beat:** Goblin workers skipped lunch and replaced good judgment with buttons.  
**Route Flag Opportunity:** `bruk_flag_protected_without_scolding` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Goblin Workshop; brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.
2. A route-specific detail catches Bruk's attention: goblin workers skipped lunch and replaced good judgment with buttons.
3. The board preview flickers with a small thematic warning linked to junk blocks, bomb blocks, board shake, and gadget hazards.
4. The focus NPC, **Cake Judge**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Bruk:** "No snack shall be abandoned. Also, perhaps no guest should be frightened away from the table."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Goblin workers skipped lunch and replaced good judgment with buttons."
- **Cake Judge:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Bruk:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Secure the supplies first. Hospitality works better when the pantry is not escaping."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Bruk resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to junk blocks, bomb blocks, board shake, and gadget hazards.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Tell me who is hungry, and I will not draw my shield before hearing the answer."
- **NPC Response:** "Then hear this: the hungry workshop."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Bruk's personal fear becomes clear.
- **Gameplay Result:** shop prices reduce after ration sharing.
- **Grant Flag:** `bruk_flag_protected_without_scolding`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Ceremonial Snack Truce

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I shall announce a snack truce. Loudly. With ceremonial crackers."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Bruk:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Bruk:** "The table is safer when more hands help protect it."
- **Route Note:** Store `bruk_flag_protected_without_scolding` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_BRUK_03 — Bruk Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Bruk.  
**Location:** Frosty Pantry.  
**Story Beat:** Freezer creatures protected snacks from melting but forgot to tell anyone.  
**Route Flag Opportunity:** `bruk_flag_invited_monsters_to_table` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Frosty Pantry; glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.
2. A route-specific detail catches Bruk's attention: freezer creatures protected snacks from melting but forgot to tell anyone.
3. The board preview flickers with a small thematic warning linked to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
4. The focus NPC, **Cake Judge**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Bruk:** "No snack shall be abandoned. Also, perhaps no guest should be frightened away from the table."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Freezer creatures protected snacks from melting but forgot to tell anyone."
- **Cake Judge:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Bruk:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Secure the supplies first. Hospitality works better when the pantry is not escaping."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Bruk resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Tell me who is hungry, and I will not draw my shield before hearing the answer."
- **NPC Response:** "Then hear this: the pantry watch rotation."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Bruk's personal fear becomes clear.
- **Gameplay Result:** ice enemies deal less damage after parley.
- **Grant Flag:** `bruk_flag_invited_monsters_to_table`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Ceremonial Snack Truce

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I shall announce a snack truce. Loudly. With ceremonial crackers."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Bruk:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Bruk:** "The table is safer when more hands help protect it."
- **Route Note:** Store `bruk_flag_invited_monsters_to_table` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_BRUK_04 — Bruk Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Bruk.  
**Location:** Pillow Castle.  
**Story Beat:** Pillow guards sleep near flour sacks because they have been on duty too long.  
**Route Flag Opportunity:** `bruk_flag_bloxley_fed` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Pillow Castle; blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.
2. A route-specific detail catches Bruk's attention: pillow guards sleep near flour sacks because they have been on duty too long.
3. The board preview flickers with a small thematic warning linked to soft blocks, shielded enemies, and Sleepy status effects.
4. The focus NPC, **Cake Judge**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Bruk:** "No snack shall be abandoned. Also, perhaps no guest should be frightened away from the table."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Pillow guards sleep near flour sacks because they have been on duty too long."
- **Cake Judge:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Bruk:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Secure the supplies first. Hospitality works better when the pantry is not escaping."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Bruk resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to soft blocks, shielded enemies, and Sleepy status effects.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Tell me who is hungry, and I will not draw my shield before hearing the answer."
- **NPC Response:** "Then hear this: the exhausted guards."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Bruk's personal fear becomes clear.
- **Gameplay Result:** rest node restores more HP.
- **Grant Flag:** `bruk_flag_bloxley_fed`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Ceremonial Snack Truce

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I shall announce a snack truce. Loudly. With ceremonial crackers."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Bruk:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Bruk:** "The table is safer when more hands help protect it."
- **Route Note:** Store `bruk_flag_bloxley_fed` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_BRUK_05 — Bruk Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Bruk.  
**Location:** Starfall Arcade.  
**Story Beat:** Arcade prizes include snack vouchers no one knows how to redeem.  
**Route Flag Opportunity:** `bruk_flag_bloxley_fed` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Starfall Arcade; neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.
2. A route-specific detail catches Bruk's attention: arcade prizes include snack vouchers no one knows how to redeem.
3. The board preview flickers with a small thematic warning linked to Fever gain, cascade challenges, score callouts, and preview disruption.
4. The focus NPC, **Cake Judge**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Bruk:** "No snack shall be abandoned. Also, perhaps no guest should be frightened away from the table."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Arcade prizes include snack vouchers no one knows how to redeem."
- **Cake Judge:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Bruk:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Secure the supplies first. Hospitality works better when the pantry is not escaping."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Bruk resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to Fever gain, cascade challenges, score callouts, and preview disruption.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Tell me who is hungry, and I will not draw my shield before hearing the answer."
- **NPC Response:** "Then hear this: the missing ticket rule."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Bruk's personal fear becomes clear.
- **Gameplay Result:** ticket rewards improve.
- **Grant Flag:** `bruk_flag_bloxley_fed`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Ceremonial Snack Truce

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I shall announce a snack truce. Loudly. With ceremonial crackers."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Bruk:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Bruk:** "The table is safer when more hands help protect it."
- **Route Note:** Store `bruk_flag_bloxley_fed` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_BRUK_06 — Bruk Route Scene in Bloxley's Block Palace

**Trigger:** First route event in Bloxley's Block Palace while playing Bruk.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Bloxley’s palace stores food by shape instead of need.  
**Route Flag Opportunity:** `bruk_flag_bloxley_fed` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Bloxley's Block Palace; square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.
2. A route-specific detail catches Bruk's attention: bloxley’s palace stores food by shape instead of need.
3. The board preview flickers with a small thematic warning linked to royal blocks, symmetry checks, pattern junk, and final board pressure.
4. The focus NPC, **Cake Judge**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Bruk:** "No snack shall be abandoned. Also, perhaps no guest should be frightened away from the table."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Bloxley’s palace stores food by shape instead of need."
- **Cake Judge:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Bruk:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Secure the supplies first. Hospitality works better when the pantry is not escaping."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Bruk resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Tell me who is hungry, and I will not draw my shield before hearing the answer."
- **NPC Response:** "Then hear this: the royal ration error."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Bruk's personal fear becomes clear.
- **Gameplay Result:** royal junk drops less often after appeal.
- **Grant Flag:** `bruk_flag_bloxley_fed`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Ceremonial Snack Truce

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I shall announce a snack truce. Loudly. With ceremonial crackers."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Bruk:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Bruk:** "The table is safer when more hands help protect it."
- **Route Note:** Store `bruk_flag_bloxley_fed` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_BRUK_FINAL_BLOXLEY — Final Route Choice Before King Bloxley

**Trigger:** Before the final phase of the King Bloxley fight while playing Bruk.  
**Location:** Bloxley's Block Palace throne room.  
**Purpose:** Resolve the character route and select Normal or True Ending eligibility.

###### Storyboard Panels

1. King Bloxley sits upon a throne of radiant royal blocks. Every corner is polished; every banner is measured.
2. The active hero steps forward while the rest of the party holds the board steady.
3. Bloxley raises his scepter. Royal blocks form a square frame around the final battlefield.
4. The route choice card appears, offering practical challenge, compassionate truth, or festive provocation.

###### Pre-Choice Dialogue

- **King Bloxley:** "Behold a palace of proper lines, obedient corners, and excellent symmetry. Why does the festival resist perfection?"
- **Bruk:** "Because a festival is not a statue. It is a place where people gather, move, spill crumbs, and still belong."
- **King Bloxley:** "Belonging without order becomes a pile."
- **Bruk:** "Order without welcome becomes a wall."

###### Final Dialogue Choices

###### A. "Order can serve the festival."

- **Player Line:** "A feast arranged by fear will never feed the festival."
- **King Bloxley:** "A measured answer. Sensible. Respectable. Slightly insufficient, but not without merit."
- **Result:** Eligible for Normal Ending if True Ending flags are incomplete.

###### B. "You wanted an invitation."

- **Player Line:** "You built a palace because you wanted to provide, but provision cannot be locked behind a throne."
- **King Bloxley:** "Invited? I am the king. Kings do not wait beside the lantern table."
- **Bruk:** "Perhaps they should, if they wish to know why the lanterns shine."
- **Result:** Grants final insight flag and checks True Ending eligibility.

###### C. "Let the festival answer you in its own shape."

- **Player Line:** "I challenge your crown to a picnic. Bring your finest square napkins."
- **King Bloxley:** "That is either nonsense or pageantry. I am alarmed that I enjoy both."
- **Result:** Adds an extra royal pattern but increases final reward if defeated.

###### Ending Branch Logic

- If required true flags and campaign requirements are met: trigger `END_BRUK_TRUE`.
- Otherwise: trigger `END_BRUK_NORMAL`.
- If player chose C and wins: add a bonus festival postcard to either ending.

---

##### END_BRUK_NORMAL — Snack Table Secure

**Ending Type:** Character Normal Ending.  
**Tone:** Successful, warm, and complete, but not the deepest emotional resolution.

###### Storyboard Panels & Script

1. **Panel 1:** King Bloxley is defeated, and the palace releases its strictest royal blocks into a shower of harmless confetti.
2. **Panel 2:** Bruk helps restore the festival booth most closely tied to their route.
3. **Panel 3:** The crowd cheers, the monsters settle, and the Block-O-Matic 3000 folds the dungeon pressure into a neat festival cube.
4. **Panel 4:** Bruk receives a commemorative ribbon, carefully lettered by the Festival Announcer.
5. **Panel 5:** The final shot shows the festival safe, bright, and slightly more organized than before.

###### Ending Dialogue

- **Festival Announcer:** "By courage, kindness, and unusually tidy block work, the festival stands restored."
- **Bruk:** "There is still much to mend, but tonight there is music. That is a fine beginning."
- **Block-O-Matic 3000:** "Celebration stabilized. Gratitude pending."
- **King Bloxley:** "I shall permit this arrangement. Temporarily. For morale."

###### Reward

- Bruk starts with extra shield in future runs.
- Unlock route badge: `badge_snack_table_secure`

---

##### END_BRUK_TRUE — The Open Table Oath

**Ending Type:** Character True Ending.  
**Tone:** Joyful resolution with deeper understanding of the Block-O-Matic, Bloxley, and the chosen hero.

###### Storyboard Panels & Script

1. **Panel 1:** After the final cascade, the palace does not collapse. It unfolds into a festival stage, each block finding a new place without being forced.
2. **Panel 2:** Bruk recognizes that the chaos was not malice. It was an invitation written in the only language the machine knew: blocks, pressure, and spectacle.
3. **Panel 3:** King Bloxley removes his crown and places it on the stage railing, where anyone may admire it without obeying it.
4. **Panel 4:** The Block-O-Matic 3000 is given an official role in the festival, not as ruler or mistake, but as Game Master.
5. **Panel 5:** Bruk's restored booth becomes part of a yearly celebration where monsters, townsfolk, and heroes compete in friendly cascade battles.

###### Ending Dialogue

- **Bruk:** "The festival did not need to be perfect. It needed to be shared."
- **King Bloxley:** "Shared order. Voluntary symmetry. Ceremonial rectangles. I will consider this compromise magnificent."
- **Block-O-Matic 3000:** "Invitation received. Festival Game Master mode unlocked."
- **Festival Announcer:** "Let it be recorded: the dungeon is now allowed to open only with snacks, safety rails, and proper applause."
- **Bruk:** "Then let the next game begin gently."

###### Reward

- Unlocks Open Table hub upgrade and monster friendship bonuses.
- Unlock true route badge: `badge_the_open_table_oath`
- Add ending gallery card: `route_bruk_snack_knight_true_gallery_card`

---

#### Route 6 — Lumi, the Star Witch

**Route ID:** `route_lumi_star_witch`  
**Theme:** Wonder becomes wisdom when it notices others.  
**Core Conflict:** Lumi sees beauty everywhere, sometimes so much that she forgets to ask what the beauty means. Her true route turns sparkle into attention and attention into guidance.  
**Focus NPC:** Festival Announcer  
**Normal Ending:** Star Lantern Finale  
**True Ending:** The Constellation of Lost Wishes

##### True Ending Requirements

To unlock **The Constellation of Lost Wishes**, the player should satisfy most of these requirements in the same completed route run:


- Earn route flag `lumi_flag_named_lonely_star`.

- Earn route flag `lumi_flag_followed_soft_light`.

- Earn route flag `lumi_flag_mapped_wish_pattern`.

- Earn route flag `lumi_flag_bloxley_constellation`.

- Defeat King Bloxley with Lumi selected.
- Avoid choosing only practical/direct answers across the entire route.
- Recover at least 3 Lost Cakes across the campaign or complete 3 stage goals.
- Trigger at least 5 cascades in the final stage or satisfy the route-specific final choice.

##### Route Scene Index

| Scene ID | Stage | Route Beat | True Flag |
| --- | --- | --- | --- |

| `SCN_LUMI_01` | Sprinkle Sewers | Sprinkles fall in a star pattern around the first lost lantern. | `lumi_flag_named_lonely_star` |

| `SCN_LUMI_02` | Goblin Workshop | Workshop bulbs blink in a rhythm that matches the Block-O-Matic’s oldest memory. | `lumi_flag_followed_soft_light` |

| `SCN_LUMI_03` | Frosty Pantry | Frost on the pantry window forms a map of missing wishes. | `lumi_flag_mapped_wish_pattern` |

| `SCN_LUMI_04` | Pillow Castle | Pillow Castle dreams glow above sleeping guards like soft constellations. | `lumi_flag_bloxley_constellation` |

| `SCN_LUMI_05` | Starfall Arcade | The arcade high-score board is spelling names, not numbers. | `lumi_flag_bloxley_constellation` |

| `SCN_LUMI_06` | Bloxley's Block Palace | Bloxley’s palace lights are arranged like a crown-shaped lonely star. | `lumi_flag_bloxley_constellation` |


---


##### SCN_LUMI_01 — Lumi Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Lumi.  
**Location:** Sprinkle Sewers.  
**Story Beat:** Sprinkles fall in a star pattern around the first lost lantern.  
**Route Flag Opportunity:** `lumi_flag_named_lonely_star` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Sprinkle Sewers; rainbow runoff, frosting pipes, sugar-bright puddles, and cupcake slime bubbles drifting beneath the festival square.
2. A route-specific detail catches Lumi's attention: sprinkles fall in a star pattern around the first lost lantern.
3. The board preview flickers with a small thematic warning linked to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
4. The focus NPC, **Festival Announcer**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Lumi:** "That light is not only pretty. It is trying to be found."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Sprinkles fall in a star pattern around the first lost lantern."
- **Festival Announcer:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Lumi:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Follow the brightest path and keep the board clear enough to see it."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Lumi resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to sticky blocks, sprinkle blocks, and simple incoming junk warnings.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Every sparkle has a source. Let us ask what wish it is carrying."
- **NPC Response:** "Then hear this: the lonely lantern sign."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Lumi's personal fear becomes clear.
- **Gameplay Result:** first star block grants extra mana.
- **Grant Flag:** `lumi_flag_named_lonely_star`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Lantern Pattern

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will connect the lights as they fall. If it becomes a parade, that is acceptable."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Lumi:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Lumi:** "The room is shining with intention now."
- **Route Note:** Store `lumi_flag_named_lonely_star` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_LUMI_02 — Lumi Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Lumi.  
**Location:** Goblin Workshop.  
**Story Beat:** Workshop bulbs blink in a rhythm that matches the Block-O-Matic’s oldest memory.  
**Route Flag Opportunity:** `lumi_flag_followed_soft_light` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Goblin Workshop; brass gears, spring ramps, little warning placards, toy bombs, and conveyor belts cheerfully moving in the wrong direction.
2. A route-specific detail catches Lumi's attention: workshop bulbs blink in a rhythm that matches the block-o-matic’s oldest memory.
3. The board preview flickers with a small thematic warning linked to junk blocks, bomb blocks, board shake, and gadget hazards.
4. The focus NPC, **Festival Announcer**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Lumi:** "That light is not only pretty. It is trying to be found."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Workshop bulbs blink in a rhythm that matches the Block-O-Matic’s oldest memory."
- **Festival Announcer:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Lumi:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Follow the brightest path and keep the board clear enough to see it."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Lumi resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to junk blocks, bomb blocks, board shake, and gadget hazards.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Every sparkle has a source. Let us ask what wish it is carrying."
- **NPC Response:** "Then hear this: the machine’s star rhythm."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Lumi's personal fear becomes clear.
- **Gameplay Result:** preview disruption lasts one fewer piece.
- **Grant Flag:** `lumi_flag_followed_soft_light`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Lantern Pattern

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will connect the lights as they fall. If it becomes a parade, that is acceptable."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Lumi:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Lumi:** "The room is shining with intention now."
- **Route Note:** Store `lumi_flag_followed_soft_light` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_LUMI_03 — Lumi Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Lumi.  
**Location:** Frosty Pantry.  
**Story Beat:** Frost on the pantry window forms a map of missing wishes.  
**Route Flag Opportunity:** `lumi_flag_mapped_wish_pattern` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Frosty Pantry; glittering freezers, rainbow gelato shelves, frosted jars, and rune blocks sliding over polished ice.
2. A route-specific detail catches Lumi's attention: frost on the pantry window forms a map of missing wishes.
3. The board preview flickers with a small thematic warning linked to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
4. The focus NPC, **Festival Announcer**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Lumi:** "That light is not only pretty. It is trying to be found."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Frost on the pantry window forms a map of missing wishes."
- **Festival Announcer:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Lumi:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Follow the brightest path and keep the board clear enough to see it."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Lumi resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to ice blocks, freeze warnings, and slow-to-fast fall speed waves.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Every sparkle has a source. Let us ask what wish it is carrying."
- **NPC Response:** "Then hear this: the frozen wish map."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Lumi's personal fear becomes clear.
- **Gameplay Result:** ice clears may spawn one star block.
- **Grant Flag:** `lumi_flag_mapped_wish_pattern`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Lantern Pattern

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will connect the lights as they fall. If it becomes a parade, that is acceptable."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Lumi:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Lumi:** "The room is shining with intention now."
- **Route Note:** Store `lumi_flag_mapped_wish_pattern` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_LUMI_04 — Lumi Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Lumi.  
**Location:** Pillow Castle.  
**Story Beat:** Pillow Castle dreams glow above sleeping guards like soft constellations.  
**Route Flag Opportunity:** `lumi_flag_bloxley_constellation` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Pillow Castle; blanket banners, quilted walls, plush dragons, button knights, and moonlit cushions stacked like castle stones.
2. A route-specific detail catches Lumi's attention: pillow castle dreams glow above sleeping guards like soft constellations.
3. The board preview flickers with a small thematic warning linked to soft blocks, shielded enemies, and Sleepy status effects.
4. The focus NPC, **Festival Announcer**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Lumi:** "That light is not only pretty. It is trying to be found."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Pillow Castle dreams glow above sleeping guards like soft constellations."
- **Festival Announcer:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Lumi:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Follow the brightest path and keep the board clear enough to see it."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Lumi resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to soft blocks, shielded enemies, and Sleepy status effects.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Every sparkle has a source. Let us ask what wish it is carrying."
- **NPC Response:** "Then hear this: the dream-lights over the castle."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Lumi's personal fear becomes clear.
- **Gameplay Result:** Sleepy hazards may reveal route hints.
- **Grant Flag:** `lumi_flag_bloxley_constellation`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Lantern Pattern

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will connect the lights as they fall. If it becomes a parade, that is acceptable."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Lumi:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Lumi:** "The room is shining with intention now."
- **Route Note:** Store `lumi_flag_bloxley_constellation` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_LUMI_05 — Lumi Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Lumi.  
**Location:** Starfall Arcade.  
**Story Beat:** The arcade high-score board is spelling names, not numbers.  
**Route Flag Opportunity:** `lumi_flag_bloxley_constellation` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Starfall Arcade; neon prize counters, cabinet sprites, star tokens, score banners, and cascades reflected in polished arcade glass.
2. A route-specific detail catches Lumi's attention: the arcade high-score board is spelling names, not numbers.
3. The board preview flickers with a small thematic warning linked to Fever gain, cascade challenges, score callouts, and preview disruption.
4. The focus NPC, **Festival Announcer**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Lumi:** "That light is not only pretty. It is trying to be found."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: The arcade high-score board is spelling names, not numbers."
- **Festival Announcer:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Lumi:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Follow the brightest path and keep the board clear enough to see it."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Lumi resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to Fever gain, cascade challenges, score callouts, and preview disruption.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Every sparkle has a source. Let us ask what wish it is carrying."
- **NPC Response:** "Then hear this: the hidden wish list."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Lumi's personal fear becomes clear.
- **Gameplay Result:** Fever activation adds cascade sparkle bonus.
- **Grant Flag:** `lumi_flag_bloxley_constellation`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Lantern Pattern

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will connect the lights as they fall. If it becomes a parade, that is acceptable."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Lumi:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Lumi:** "The room is shining with intention now."
- **Route Note:** Store `lumi_flag_bloxley_constellation` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_LUMI_06 — Lumi Route Scene in Bloxley's Block Palace

**Trigger:** First route event in Bloxley's Block Palace while playing Lumi.  
**Location:** Bloxley's Block Palace.  
**Story Beat:** Bloxley’s palace lights are arranged like a crown-shaped lonely star.  
**Route Flag Opportunity:** `lumi_flag_bloxley_constellation` through Choice B.

###### Storyboard Panels

1. The party enters a quieter corner of Bloxley's Block Palace; square carpets, confetti cannons, royal banners, toy guards, and severe architecture made from very cheerful blocks.
2. A route-specific detail catches Lumi's attention: bloxley’s palace lights are arranged like a crown-shaped lonely star.
3. The board preview flickers with a small thematic warning linked to royal blocks, symmetry checks, pattern junk, and final board pressure.
4. The focus NPC, **Festival Announcer**, appears either directly or through a sign, echo, recipe note, machine label, sleepy guard report, or star-lit clue.
5. The dialogue choice card appears with three tones: practical action, compassionate insight, or bold festival gambit.

###### Pre-Choice Dialogue

- **Lumi:** "That light is not only pretty. It is trying to be found."
- **Festival Announcer:** "A route matter has appeared. Please approach with courage, courtesy, and adequate board space."
- **Block-O-Matic 3000:** "Observed complication: Bloxley’s palace lights are arranged like a crown-shaped lonely star."
- **Festival Announcer:** "The room is not only causing trouble. It is trying to complete an unfinished instruction."
- **Lumi:** "Then we should answer the instruction, not merely silence the room."

###### Dialogue Choices

###### A. Normal Lean / Practical

- **Choice Label:** "Stabilize the room first."
- **Player Line:** "Follow the brightest path and keep the board clear enough to see it."
- **NPC Response:** "A clean board gives everyone a safer place to speak."
- **Narration:** Lumi resolves the immediate pressure with practiced skill. The room steadies, though the deeper reason remains only partly understood.
- **Gameplay Result:** Gain a small combat advantage tied to royal blocks, symmetry checks, pattern junk, and final board pressure.
- **Route Result:** +1 affinity; leans toward Normal Ending.

###### B. True Lean / Compassionate

- **Choice Label:** "Listen for the cause beneath the hazard."
- **Player Line:** "Every sparkle has a source. Let us ask what wish it is carrying."
- **NPC Response:** "Then hear this: the crown constellation."
- **Narration:** The room softens. A hidden connection between the dungeon, the festival, and Lumi's personal fear becomes clear.
- **Gameplay Result:** royal pattern shows a clearer outline.
- **Grant Flag:** `lumi_flag_bloxley_constellation`
- **Route Result:** +1 insight; contributes to True Ending.

###### C. Risky Lean / Lantern Pattern

- **Choice Label:** "Attempt a dazzling festival solution."
- **Player Line:** "I will connect the lights as they fall. If it becomes a parade, that is acceptable."
- **NPC Response:** "That is wonderfully bold. Please inform the board before it faints."
- **Narration:** The room accepts the flourish and responds with both a reward and a sharper challenge.
- **Gameplay Result:** Gain a rare or themed reward; 25% chance to add an Oopsie or harder hazard.
- **Route Result:** +1 festivalGrace; may open a shortcut, bonus bark, or altered boss state.

###### Post-Choice Battle Bark Pool

- **Lumi:** "The board is listening. Let us answer with care."
- **Block-O-Matic 3000:** "Assistance recalibrated. Courtesy level improved."
- **Festival Announcer:** "Choice recorded. The festival applauds thoughtful stacking."

###### Victory Callback

- **Lumi:** "The room is shining with intention now."
- **Route Note:** Store `lumi_flag_bloxley_constellation` if Choice B was selected. Continue to the next stage route beat.

---

##### SCN_LUMI_FINAL_BLOXLEY — Final Route Choice Before King Bloxley

**Trigger:** Before the final phase of the King Bloxley fight while playing Lumi.  
**Location:** Bloxley's Block Palace throne room.  
**Purpose:** Resolve the character route and select Normal or True Ending eligibility.

###### Storyboard Panels

1. King Bloxley sits upon a throne of radiant royal blocks. Every corner is polished; every banner is measured.
2. The active hero steps forward while the rest of the party holds the board steady.
3. Bloxley raises his scepter. Royal blocks form a square frame around the final battlefield.
4. The route choice card appears, offering practical challenge, compassionate truth, or festive provocation.

###### Pre-Choice Dialogue

- **King Bloxley:** "Behold a palace of proper lines, obedient corners, and excellent symmetry. Why does the festival resist perfection?"
- **Lumi:** "Because a festival is not a statue. It is a place where people gather, move, spill crumbs, and still belong."
- **King Bloxley:** "Belonging without order becomes a pile."
- **Lumi:** "Order without welcome becomes a wall."

###### Final Dialogue Choices

###### A. "Order can serve the festival."

- **Player Line:** "A crown may sparkle, but a festival needs many lights."
- **King Bloxley:** "A measured answer. Sensible. Respectable. Slightly insufficient, but not without merit."
- **Result:** Eligible for Normal Ending if True Ending flags are incomplete.

###### B. "You wanted an invitation."

- **Player Line:** "You arranged the palace like a star that wanted company."
- **King Bloxley:** "Invited? I am the king. Kings do not wait beside the lantern table."
- **Lumi:** "Perhaps they should, if they wish to know why the lanterns shine."
- **Result:** Grants final insight flag and checks True Ending eligibility.

###### C. "Let the festival answer you in its own shape."

- **Player Line:** "Let us turn your throne room into a lantern dance. Square steps optional."
- **King Bloxley:** "That is either nonsense or pageantry. I am alarmed that I enjoy both."
- **Result:** Adds an extra royal pattern but increases final reward if defeated.

###### Ending Branch Logic

- If required true flags and campaign requirements are met: trigger `END_LUMI_TRUE`.
- Otherwise: trigger `END_LUMI_NORMAL`.
- If player chose C and wins: add a bonus festival postcard to either ending.

---

##### END_LUMI_NORMAL — Star Lantern Finale

**Ending Type:** Character Normal Ending.  
**Tone:** Successful, warm, and complete, but not the deepest emotional resolution.

###### Storyboard Panels & Script

1. **Panel 1:** King Bloxley is defeated, and the palace releases its strictest royal blocks into a shower of harmless confetti.
2. **Panel 2:** Lumi helps restore the festival booth most closely tied to their route.
3. **Panel 3:** The crowd cheers, the monsters settle, and the Block-O-Matic 3000 folds the dungeon pressure into a neat festival cube.
4. **Panel 4:** Lumi receives a commemorative ribbon, carefully lettered by the Festival Announcer.
5. **Panel 5:** The final shot shows the festival safe, bright, and slightly more organized than before.

###### Ending Dialogue

- **Festival Announcer:** "By courage, kindness, and unusually tidy block work, the festival stands restored."
- **Lumi:** "There is still much to mend, but tonight there is music. That is a fine beginning."
- **Block-O-Matic 3000:** "Celebration stabilized. Gratitude pending."
- **King Bloxley:** "I shall permit this arrangement. Temporarily. For morale."

###### Reward

- Lumi starts future runs with extra Fever.
- Unlock route badge: `badge_star_lantern_finale`

---

##### END_LUMI_TRUE — The Constellation of Lost Wishes

**Ending Type:** Character True Ending.  
**Tone:** Joyful resolution with deeper understanding of the Block-O-Matic, Bloxley, and the chosen hero.

###### Storyboard Panels & Script

1. **Panel 1:** After the final cascade, the palace does not collapse. It unfolds into a festival stage, each block finding a new place without being forced.
2. **Panel 2:** Lumi recognizes that the chaos was not malice. It was an invitation written in the only language the machine knew: blocks, pressure, and spectacle.
3. **Panel 3:** King Bloxley removes his crown and places it on the stage railing, where anyone may admire it without obeying it.
4. **Panel 4:** The Block-O-Matic 3000 is given an official role in the festival, not as ruler or mistake, but as Game Master.
5. **Panel 5:** Lumi's restored booth becomes part of a yearly celebration where monsters, townsfolk, and heroes compete in friendly cascade battles.

###### Ending Dialogue

- **Lumi:** "The festival did not need to be perfect. It needed to be shared."
- **King Bloxley:** "Shared order. Voluntary symmetry. Ceremonial rectangles. I will consider this compromise magnificent."
- **Block-O-Matic 3000:** "Invitation received. Festival Game Master mode unlocked."
- **Festival Announcer:** "Let it be recorded: the dungeon is now allowed to open only with snacks, safety rails, and proper applause."
- **Lumi:** "Then let the next game begin gently."

###### Reward

- Unlocks constellation map markers and star-themed ending gallery art.
- Unlock true route badge: `badge_the_constellation_of_lost_wishes`
- Add ending gallery card: `route_lumi_star_witch_true_gallery_card`

---

### 6. Shared Festival Endings

#### END_GLOBAL_NORMAL — Festival Restored

**Trigger:** Defeat King Bloxley without satisfying a character True Ending route.

##### Storyboard Panels

1. The final royal blocks dissolve into confetti and settle around Brixonia town square.
2. The Block-O-Matic 3000 folds the unstable dungeon into a small glowing cube.
3. Professor Poplin places the cube into a velvet case labeled **For Supervised Festival Use Only**.
4. Cakes are recovered, though several have unusual square corners.
5. The jelly fountain remains jelly, but the town quietly agrees it is an improvement.

##### Dialogue

- **Professor Poplin:** "The machine is calm, the dungeon is folded, and only three forms remain unsigned. A triumph by any reasonable measure."
- **Festival Announcer:** "The Festival of Falling Stars is officially saved. Please return borrowed cupcakes to the nearest grateful baker."
- **King Bloxley:** "I have been defeated, but I maintain that rectangles were underappreciated."
- **Milo:** "We can appreciate them without letting them run the town."

##### Result

- Unlock Normal Ending gallery.
- Unlock postgame route hints.
- Record `ending_global_normal` in meta progress.

---

#### END_GLOBAL_TRUE — Festival Game Master

**Trigger:** Defeat King Bloxley after unlocking all heroes, finding all Lost Cakes, clearing enough route insight flags, and completing the selected hero True Ending.

##### Storyboard Panels

1. Professor Poplin finally reads the oldest page of the manual, which had been tucked behind a recipe for self-stirring pudding.
2. The page reveals that the Block-O-Matic 3000 was built not only to construct festival decorations, but to play games with the people it served.
3. Brixonia invites the machine to become the official Festival Game Master.
4. King Bloxley is given a ceremonial role: Keeper of Fair Rules and Inspector of Voluntary Squares.
5. The dungeon opens once a year as a safe, supervised cascade tournament full of monsters, snacks, prizes, and cheering lanterns.
6. The heroes stand together beneath falling stars as the first friendly block battle begins.

##### Dialogue

- **Professor Poplin:** "Remarkable. The machine was never asking to rule the festival. It was asking to join it."
- **Block-O-Matic 3000:** "Invitation accepted. Helpful chaos converted to scheduled delight."
- **Festival Announcer:** "By unanimous applause, the Block-O-Matic 3000 is appointed Festival Game Master."
- **King Bloxley:** "I demand a title as well. Preferably one with a sash."
- **Milo:** "Keeper of Fair Rules?"
- **Pippa:** "Inspector of Cake Corners."
- **Zuzu:** "Emergency Button Consultant."
- **Nixie:** "Seasonal Chill Supervisor."
- **Bruk:** "Guardian of the Snack Queue."
- **Lumi:** "Royal Lantern Who Learned to Share the Sky."
- **King Bloxley:** "All titles accepted. Prepare the sash collection."

##### Result

- Record `ending_global_true`.
- Unlock Festival Game Master mode.
- Unlock all route epilogue postcards already earned.
- Add annual friendly dungeon mode as postgame framing.

---

### 7. Hub Dialogue Bark Library — Polished Pass

Use these as short, mobile-readable lines between stages, after hub upgrades, or when the player returns from a run.

#### Milo

- "The blocks are quieter near the fountain. I think they like the lanterns."
- "A tidy board is helpful, but a listened-to board is kinder."
- "I wrote down the plink-plonk rhythm. It looks like music if you tilt the page."

#### Pippa

- "No one touches the emergency frosting without signing the spoon ledger."
- "The slimes are learning recipes. Slowly. Enthusiastically. Stickily."
- "A warm oven can be stern and welcoming at the same time."

#### Zuzu

- "I have improved the warning lights. They now warn before, during, and after the situation."
- "The machine and I have agreed that explosions require appointments."
- "Safety is just engineering with better handwriting."

#### Nixie

- "The gelato is safe. The spoons are missing, but I suspect diplomacy will recover them."
- "A calm room is not an empty one. It is a room where everyone has time to breathe."
- "If the board freezes, do not scold it. Warm the edges first."

#### Bruk

- "The snack table is defended. More importantly, it is open."
- "I have learned that a shared cupcake is not a lost cupcake. This remains emotionally difficult."
- "My shield now protects guests and sandwiches with equal honor."

#### Lumi

- "The stars above the arcade spell encouragement. Also, possibly snack instructions."
- "A bright thing is lovelier when you ask why it shines."
- "I named the lantern near the fountain. It seemed pleased."

#### King Bloxley

- "Voluntary squares are a promising civic development."
- "I have inspected the cake table. Its roundness remains provocative, but morale is high."
- "The festival is untidy, yes. Yet I concede it has excellent pageantry."

---

### 8. Implementation Notes

#### Recommended Dialogue File Split

```text
src/game/content/story/shared/opening.json
src/game/content/story/shared/stage-intros.json
src/game/content/story/shared/boss-rule-cards.json
src/game/content/story/routes/milo.json
src/game/content/story/routes/pippa.json
src/game/content/story/routes/zuzu.json
src/game/content/story/routes/nixie.json
src/game/content/story/routes/bruk.json
src/game/content/story/routes/lumi.json
src/game/content/story/endings/normal.json
src/game/content/story/endings/true.json
src/game/content/story/hub-barks.json
```

#### Route State Fields

```ts
type CharacterRouteState = {
  activeRouteId: string;
  affinity: number;
  insight: number;
  festivalGrace: number;
  flags: string[];
  selectedChoices: Record<string, string>;
  endingUnlocked?: 'normal' | 'true';
};
```

#### Dialogue Presentation Rules

- Show no more than 2–3 lines of dialogue at once on mobile.
- Choice labels should be concise, with the fuller line revealed after selection.
- Use route flags for ending logic, but do not show raw flag names to players.
- Keep jokes in character voice; avoid author-commentary humor.
- Let serious emotional turns breathe before adding a playful line.

---

### 9. Codex Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement the polished character-route dialogue and storyboard system for Blockmancer Dungeon.

Use this Markdown file as the narrative source.
Convert the shared opening, stage intros, boss rule cards, hero route scenes, final route choices, normal endings, true endings, and hub bark library into data-driven content.

Writing style requirements:
- Use polished storybook JRPG language.
- Keep the atmosphere cheerful, bright, and festival-like.
- Avoid meme slang, Reddit-style jokes, and overly sarcastic commentary.
- Keep dialogue short enough for portrait mobile display.
- Preserve distinct hero voices.

Required systems:
- DialogueScene or dialogue overlay.
- Choice cards with three choice styles: Practical, Compassionate, Festival Gambit.
- Route flag tracking.
- Normal/True ending branch logic.
- Skippable dialogue.
- Save/load support for route flags and selected choices.
- Boss rule card display before boss fights.
- Hub bark rotation.

Acceptance criteria:
- Each of the six heroes has six route scenes and a final Bloxley route choice.
- Each route has Normal and True Ending scripts.
- True Ending checks route flags and campaign requirements.
- Dialogue is data-driven, not hardcoded into scenes.
- Mobile UI shows dialogue and choices clearly.
- Build passes.
- Content validation passes if story validation exists.

Finish with:
Summary / Files changed / Story content added / Route flags added / Commands run / Manual test steps / Known limitations.
```

---

### 10. Narrative QA Checklist

- [ ] Opening cutscene plays once for new players and can be replayed.
- [ ] Each stage intro is readable within portrait mobile constraints.
- [ ] Each boss rule card appears before its boss fight.
- [ ] Each hero route scene appears only for the selected hero.
- [ ] Each route scene offers three choices with distinct outcomes.
- [ ] Practical choices support Normal Ending progression.
- [ ] Compassionate choices grant True Ending flags.
- [ ] Festival Gambit choices provide reward plus risk without unfair punishment.
- [ ] Final Bloxley route choice resolves correctly.
- [ ] Character Normal Ending triggers when True Ending requirements are incomplete.
- [ ] Character True Ending triggers when requirements are complete.
- [ ] Global Normal and Global True Endings record meta progress.
- [ ] Dialogue can be skipped without breaking route state.
- [ ] Tone remains cheerful, sophisticated, and festival-bright.
```


---

## Updated Story and Core Concept Reference

**Source file:** `blockmancer_lighthearted_story_UPDATED.md`

**Consolidation note:** Use for high-level story, premise, hero bios, and broad route context when adding new content.

### Blockmancer Dungeon — Lighthearted Story & Core Concept

#### Core Concept Summary

**Blockmancer Dungeon** is a cheerful portrait-mobile falling-block roguelike RPG where players clear magical rune lines to battle silly monsters, cast spells, trigger cascade gravity combos, collect upgrades, and save a chaotic fantasy festival.

The game mixes a **falling-block puzzle board** with a compact **JRPG-style battle screen**. The top of the portrait screen shows the hero party fighting monsters, the middle focuses on the falling-block board with **Next Block**, **Hold Block**, and **Inventory**, and the bottom provides mobile controls for movement, dropping, rotating, and casting spells.

Unlike classic falling-block games, clearing a line does not simply shift rows down. Instead, the game uses a **Cascade Gravity System**: cleared blocks disappear, unsupported blocks above fall down like Puyo-style gravity, and new lines can form automatically. These cascades create bonus damage, mana, combo chains, and fun “magical mess” moments.

The tone is **bright fantasy, cozy-chaotic, and playful**. The player is not saving a doomed world from darkness. They are fixing a festival disaster caused by a magical block-making machine, recovering stolen snacks, unlocking quirky heroes, and stopping an overly dramatic block mascot king.

Core fantasy:

> You are a Blockmancer cleaning up magical chaos one combo at a time.

Core hook:

> Clear lines, trigger cascades, cast silly spells, and save the festival from becoming the world’s biggest block pile.

---

### Story Overview

#### Logline

In the cheerful kingdom of **Brixonia**, a magical block-making machine goes haywire during the annual Festival of Falling Stars. Rune blocks begin raining everywhere, snack-stealing monsters flood the dungeon below town square, and only a young apprentice Blockmancer named **Milo** can stack, clear, and combo the chaos back into order.

---

#### Premise

Every year, Brixonia celebrates the **Festival of Falling Stars**, a colorful holiday filled with cakes, fireworks, flying lanterns, magical games, and suspiciously glowing buttons.

At the center of the festival is an ancient machine called:

```text
The Block-O-Matic 3000
```

Usually, the machine creates harmless magical rune blocks used to build stalls, decorate streets, launch confetti, repair bridges, and run puzzle games for children.

But this year, **Professor Poplin** tries to upgrade the machine to make the festival “exactly 37% more magical.” Unfortunately, someone presses the button labeled:

```text
DO NOT PRESS DURING FESTIVAL MODE
```

The machine overloads.

It sucks up the festival cakes, spits out thousands of magical rune blocks, turns the town fountain into jelly, and opens a colorful dungeon beneath the town square.

Inside the dungeon, monsters eat too much rune candy and become hyperactive. They start stealing snacks, throwing junk blocks, shaking the board, freezing pieces, and declaring themselves rulers of rectangular objects.

The player enters the dungeon to:

- Fix the Block-O-Matic 3000.
- Recover the missing festival cakes.
- Calm down the sugar-rushed monsters.
- Unlock quirky heroes.
- Defeat **King Bloxley**, the self-appointed king of all blocks.

---

### Tone Direction

The game should feel like:

```text
Cheerful fantasy
Comedic adventure
Cute chaos
Low-stakes but exciting
Colorful dungeon crawl
Saturday morning cartoon energy
```

Avoid:

```text
Tragic dead kingdom
Heavy grief
Dark curse
Edgy villain
Horror monsters
Overly serious lore
```

Good tonal references, without copying:

```text
Mario RPG energy
Paper Mario humor
Fantasy Life coziness
Puyo Puyo silliness
Lighthearted dungeon crawler
```

Main theme:

> Creativity fixes chaos better than control.

Core story sentence:

> The dungeon is not evil. It is just very, very bad at organizing a festival.

---

### Main Character

#### Milo — The Blockmancer

Milo is a slightly clumsy but optimistic apprentice mage. He is not the best at traditional magic, but he has one unusual talent: he can hear the tiny “plink plonk” language of rune blocks.

Before the disaster, Milo’s official festival job was temporary lemonade assistant. After the Block-O-Matic 3000 goes wild, he becomes the only person calm enough to look at a magical dungeon full of falling blocks and say:

> “Well, at least this looks stackable.”

##### Personality

- Optimistic.
- Creative.
- Talks to blocks.
- Believes most problems can be solved with a good combo.
- A little clumsy, but charming.

##### Gameplay Role

```text
Balanced starter hero
Good mana gain
Simple and beginner-friendly
```

##### Unlock Condition

```text
Unlocked by default
```

---

### Playable Heroes

#### Milo — The Blockmancer

##### Role

```text
Balanced starter
```

##### Story

Milo wants to prove he is more than the festival’s backup lemonade assistant. He believes that if things are placed in the right order, even a chaotic magical dungeon can become cute and manageable.

##### Unlock Condition

```text
Unlocked by default
```

---

#### Pippa — The Pyromancer

Pippa is the festival baker. After her oven is invaded by rune blocks and slime monsters eat half her emergency frosting, she turns her whisk into a fire wand.

##### Role

```text
Fire damage / aggressive spell hero
```

##### Personality

- Hot-tempered but kind.
- Very serious about cookies.
- Calls Fireball “preheating.”

##### Unlock Condition

```text
Defeat Cupcake Slime Boss in Stage 1
```

##### Story Hook

> “The slimes ate my cupcakes. This is personal.”

---

#### Nixie — The Frostbinder

Nixie runs the magical ice cream cart. She enters the dungeon because monsters stole her rainbow gelato supply.

##### Role

```text
Slow fall speed / control / defensive
```

##### Personality

- Calm.
- Loves ice puns.
- Hates when blocks fall too fast.

##### Unlock Condition

```text
Clear 3 rooms without taking damage
```

##### Story Hook

> “Relax. Every problem is easier when chilled.”

---

#### Bruk — The Snack Knight

Bruk is the knight in charge of guarding the snack table. His armor is covered in crumbs, but his sense of duty is unshakable.

##### Role

```text
High HP / heavy drop / defensive hero
```

##### Personality

- Loyal.
- Loves snacks.
- Talks about potato chips like ancient treasure.

##### Unlock Condition

```text
Collect 500 total gold across runs
```

##### Story Hook

> “No snack left behind.”

---

#### Zuzu — The Goblin Engineer

Zuzu is a goblin engineer and former intern for Professor Poplin. She insists she did not break the Block-O-Matic. She only “tested it enthusiastically.”

##### Role

```text
Bomb blocks / board manipulation / risky utility
```

##### Personality

- Talks quickly.
- Overconfident.
- Calls every bug a feature.

##### Unlock Condition

```text
Defeat Goblin Workshop miniboss
```

##### Story Hook

> “If it explodes, it means it works.”

---

#### Lumi — The Star Witch

Lumi is a young witch who decorates the festival with paper stars and tiny light spells. She gets lost in the dungeon after following a suspiciously shiny block.

##### Role

```text
Mana / spell chaining / cascade bonus
```

##### Personality

- Dreamy.
- Loves sparkly things.
- Names every special block she sees.

##### Unlock Condition

```text
Trigger 10 cascade combos across runs
```

##### Story Hook

> “That purple block has main character energy.”

---

### Main Villain

#### King Bloxley, the Self-Appointed Block King

King Bloxley is not a real king. He was originally a wooden mascot from the festival game **Stack the Crown**.

When the Block-O-Matic 3000 overloaded, a huge burst of rune magic hit the mascot and brought him to life. He immediately climbed onto a pile of blocks and declared:

> “I am King Bloxley, ruler of all rectangular things!”

He is not evil. He is just extremely dramatic and obsessed with order.

##### Goal

King Bloxley wants to:

- Turn the festival into a perfectly square block palace.
- Force everyone to line up by color.
- Ban round cakes because they do not have corners.
- Make every room symmetrical, even if nobody asked.

##### Final Boss Vibe

```text
Funny tyrant
Silly but challenging
Overdramatic
Loves symmetry
```

---

### World

#### Brixonia

Brixonia is a cheerful fantasy kingdom where magic is used for everyday convenience.

Magic helps people:

- Stir soup automatically.
- Fly ice cream carts.
- Build festival stages.
- Launch cat-shaped fireworks.
- Create rune blocks for construction and games.

People are not afraid of magic. They are mostly afraid of magic knocking over the dessert table.

---

#### The Block-O-Matic 3000

The Block-O-Matic 3000 is an ancient machine repaired and upgraded by generations of wizards. It has several modes:

```text
Build
Bake
Bounce
Battle
Festival
Do Not Press
```

Professor Poplin accidentally activates:

```text
Festival + Battle + Do Not Press
```

That combination creates the dungeon.

---

### Stage Structure

#### Stage 1 — Sprinkle Sewers

##### Theme

A colorful sewer under the festival, filled with spilled candy, frosting pipes, cupcake slime, and rainbow water.

##### Monsters

- Cupcake Slime
- Sugar Bat
- Crumb Goblin
- Jelly Rat

##### Boss

```text
Cupcake Slime Boss
```

##### Mechanics

- Sticky blocks.
- Mana sprinkles.
- Beginner-friendly enemies.

##### Unlock

```text
Defeat boss to unlock Pippa.
```

---

#### Stage 2 — Goblin Workshop

##### Theme

A chaotic machine workshop full of conveyor belts, toy bombs, springs, spinning gears, and signs that say “Totally Safe.”

##### Monsters

- Wrench Goblin
- Button Masher
- Spring Bot
- Spark Gremlin

##### Boss

```text
Zuzu’s Prototype No. 7
```

##### Mechanics

- Junk blocks.
- Bomb blocks.
- Light board shake.

##### Unlock

```text
Defeat boss to unlock Zuzu.
```

---

#### Stage 3 — Frosty Pantry

##### Theme

A magical frozen pantry with rainbow ice cream, enchanted pudding, slippery tiles, and frosty rune blocks.

##### Monsters

- Ice Cream Imp
- Popsicle Bat
- Chill Slime
- Freezer Mimic

##### Boss

```text
The Gelato Golem
```

##### Mechanics

- Ice blocks.
- Fall speed waves.
- Some blocks slide after cascade.

##### Unlock

```text
Clear 3 rooms without taking damage to unlock Nixie.
```

---

#### Stage 4 — Pillow Castle

##### Theme

A soft castle made of pillows, plush toys, blanket ghosts, toy soldiers, and sleepy enemies.

##### Monsters

- Button Knight
- Blanket Ghost
- Plush Dragon
- Toy Soldier

##### Boss

```text
Sir Snore-a-Lot
```

##### Mechanics

- Sleep status.
- Soft blocks.
- Shield enemies.

##### Unlock

```text
Collect 500 total gold across runs to unlock Bruk.
```

---

#### Stage 5 — Starfall Arcade

##### Theme

A glowing magical arcade with neon machines, prize counters, combo signs, and animated game cabinets.

##### Monsters

- Token Sprite
- Combo Gremlin
- Neon Bat
- Prize Claw Mimic

##### Boss

```text
The High Score Hydra
```

##### Mechanics

- Rewards cascade combos.
- Punishes low combo play.
- Fever meter fills faster.

##### Unlock

```text
Trigger 10 cascade combos across runs to unlock Lumi.
```

---

#### Stage 6 — Bloxley’s Block Palace

##### Theme

A giant palace built from colorful blocks, toy flags, square carpets, confetti cannons, and overdramatic royal decorations.

##### Monsters

- Royal Block Guard
- Square Jester
- Crown Bat
- Parade Golem

##### Final Boss

```text
King Bloxley
```

##### Mechanics

- Rearranges junk blocks into patterns.
- Demands symmetry.
- Spawns royal blocks.
- Final phase: “Everything Must Be Square!”

---

### Monster Tone

Monsters should be:

```text
Silly
Readable
Cute-chaotic
Annoying but charming
```

They should not feel scary or grotesque. They should look like festival creatures, magical accidents, snack thieves, toy monsters, or overexcited dungeon mascots.

---

### Example Monsters

#### Cupcake Slime

A slime wearing whipped cream like a hat. When hit, it drops sprinkles.

##### Behavior

```text
Sticky blocks
Mana sprinkles
```

---

#### Crumb Goblin

A tiny goblin that eats cookie crumbs and throws junk blocks while giggling.

##### Behavior

```text
Spawn junk
```

---

#### Sugar Bat

A small bat that flies too fast because it ate too much candy.

##### Behavior

```text
Hide next block briefly
```

---

#### Button Masher

A little workshop robot that presses every button at once.

##### Behavior

```text
Random board shake
```

---

#### Freezer Mimic

A treasure chest hiding in the freezer. When opened, it sneezes ice.

##### Behavior

```text
Freeze active piece
```

---

#### Plush Dragon

A stuffed dragon that breathes cotton-candy fire.

##### Behavior

```text
Burn blocks
```

---

### Opening Cutscene

```text
Every year, the kingdom of Brixonia held the Festival of Falling Stars.

There were cakes.
There were fireworks.
There were suspiciously glowing buttons.

Professor Poplin promised his new invention would make the festival
“exactly 37% more magical.”

Then someone pressed the button labeled:

DO NOT PRESS DURING FESTIVAL MODE.

The ground burped.
The fountain turned into jelly.
And a dungeon full of falling rune blocks opened beneath the town square.

Milo, apprentice Blockmancer and temporary lemonade assistant,
picked up his wand.

“Well,” he said,
“at least this looks stackable.”
```

---

### Short Intro

```text
The festival is a mess.

Blocks are falling.
Monsters are snacking.
The dungeon is growing.
And someone needs to turn off the Block-O-Matic 3000.

Clear lines.
Cast spells.
Save the snacks.
Fix the dungeon.
```

---

### Stage Clear Texts

#### After Stage 1

```text
The Cupcake Slime pops into a shower of sprinkles.

Pippa dusts flour from her sleeves.

“That was my emergency frosting.
You’re lucky I’m joining you.”
```

---

#### After Stage 2

```text
Prototype No. 7 explodes into three smaller prototypes,
then politely shuts itself down.

Zuzu grins.

“Great news! It only exploded once this time.”
```

---

#### After Stage 3

```text
The Gelato Golem melts into a perfectly acceptable smoothie.

Nixie sighs.

“I leave the pantry alone for ten minutes...”
```

---

#### After Stage 4

```text
Sir Snore-a-Lot falls asleep mid-battle.

Bruk carefully covers him with a blanket.

“Victory is best served with snacks.”
```

---

#### After Stage 5

```text
The High Score Hydra loses all three heads at once.

Lumi claps.

“Triple game over. Very stylish.”
```

---

#### Before Final Boss

```text
King Bloxley sits on a throne made of suspiciously familiar blocks.

“At last,” he declares,
“a worthy stacker approaches.”

Milo raises his wand.

“Can we fix the festival now?”

The king gasps.

“Not until everything is perfectly rectangular!”
```

---

### Ending

#### Normal Ending

After King Bloxley is defeated, the Block-O-Matic 3000 calms down. The dungeon folds itself into a tiny cube and lands in Professor Poplin’s pocket.

The festival is saved, although the fountain is still jelly.

```text
The blocks stopped falling.

The monsters stopped snacking.

The cake was mostly recovered.

And Milo was promoted from lemonade assistant
to Junior Emergency Dungeon Organizer.
```

---

#### True Ending

##### Unlock Requirements

```text
Defeat King Bloxley
Unlock all heroes
Trigger 20 cascade combos
Find all missing festival cakes
```

##### Ending Text

```text
Professor Poplin finally reads the manual.

The Block-O-Matic 3000 was not broken.
It was lonely.

It had spent hundreds of years building things,
but never got invited to the festival.

So Brixonia gives it a job:
Festival Game Master.

From then on, once a year,
the dungeon opens safely for brave players,
silly monsters,
and competitive snack-based block battles.
```

---

### Store Page Story Summary

```text
The Festival of Falling Stars has gone completely sideways.

A magical machine called the Block-O-Matic 3000 has created a colorful dungeon beneath town square, filling it with falling rune blocks, snack-stealing monsters, and one very bossy block king.

Play as Milo and a cast of quirky heroes in a cheerful falling-block roguelike RPG. Clear lines, trigger cascades, cast silly spells, collect relics, and save the festival one combo at a time.
```

---

### Gameplay-Story Integration

#### Line Clears

Line clears represent cleaning up the magical mess caused by the Block-O-Matic.

#### Cascade Gravity

Cascades feel like magical domino effects. When the player clears a line, unsupported blocks collapse downward, creating more clears, more mana, more damage, and more chaos.

#### Spells

Spells should feel playful and practical:

- Fireball is Pippa’s “preheating.”
- Frost Lock is Nixie cooling the board down.
- Bomb Rune is Zuzu’s “tested” invention.
- Heal Glyph is festival first aid.

#### Relics and Upgrades

Relics should feel like festival souvenirs, magical snacks, toy tools, lucky charms, or broken machine parts.

Examples:

- Goblin Coin
- Sprinkle Compass
- Jelly Fountain Cup
- Poplin’s Spare Button
- Lucky Cake Fork
- Tiny Trophy Crown

---

### UI / Visual Story Direction

The visual style should support the cheerful tone.

#### Theme

```text
Pixel-art fantasy festival
32-bit inspired look
Bright readable colors
Cute monsters
Chunky UI panels
Toy-like magic machinery
```

#### Portrait Layout Story Logic

The portrait-only UI should feel like a magical arcade cabinet on a phone:

```text
Top 1/5:
Compact battle scene with party vs monsters

Middle 3/5:
Main falling-block board with Hold, Next Block, and Inventory overlays

Bottom 1/5:
Mobile controls for movement, drop, rotate, and spells
```

The top battle screen shows the result of the puzzle battle. The middle board is the core “magical mess” being cleaned. The bottom controls are the player’s spellbook and action panel.

---

### Festival Chaos & Replayability Story Layer

The expanded game structure should make the dungeon feel like a living festival machine that keeps improvising.

The Block-O-Matic 3000 is not only spawning monsters. It is also accidentally creating:

```text
Random room mishaps
Stage-specific side goals
Boss rule announcements
Festival hub repair projects
Monster friendship moments
Board-size hiccups
Silly risk/reward Oopsies
```

This keeps the story lighthearted while explaining why each run feels different.

Core story rule:

> The dungeon changes because the Block-O-Matic is trying to help, but it has the planning skills of a confetti cannon.

---

### Stage Goals — Story Motivation

Each stage should have one optional side goal that gives players a reason to care about the route beyond simply reaching the boss.

| Stage | Story Goal | Narrative Result |
| ---: | --- | --- |
| 1 | Recover 3 Lost Cupcakes | Pippa gets enough emergency frosting to weaken the Cupcake Slime King |
| 2 | Disable 2 Goblin Machines | Zuzu identifies which workshop buttons should definitely not be glowing |
| 3 | Save 3 Ice Cream Crates | Nixie keeps the gelato supply from becoming soup |
| 4 | Keep 2 Guards Asleep | Bruk preserves the Pillow Castle’s sacred nap schedule |
| 5 | Reach Combo Score Target | Lumi wins enough arcade tickets to calm the High Score Hydra |
| 6 | Break 3 Royal Seals | King Bloxley’s “perfectly square” palace rules begin to wobble |

Failure should not feel like grim punishment. It should feel like comedic inconvenience:

```text
The boss gets stickier.
The machine gets overexcited.
The palace adds more royal blocks.
The arcade gets smug.
```

---

### Map Progression Story Logic

The dungeon should feel larger and stranger as the player gets closer to King Bloxley.

```text
Stage 1: 6 main-path nodes — short, beginner-friendly sewer cleanup
Stage 2: 8 main-path nodes — more workshop route choices
Stage 3: 10 main-path nodes — frozen pantry detours
Stage 4: 12 main-path nodes — sleepy castle exploration
Stage 5: 14 main-path nodes — arcade challenge route
Stage 6: 16 main-path nodes — final palace gauntlet
```

The increase in nodes represents the Block-O-Matic becoming more creative, confused, and dramatic.

---

### Dynamic Board Size Story Logic

Board size changes are caused by the Block-O-Matic physically reshaping the magical playfield.

Examples:

```text
Cupcake Slime King squeezes the board with frosting.
Prototype No. 7 expands the board with unstable bomb lanes.
Gelato Golem freezes the board edges inward.
Sir Snore-a-Lot accidentally gives the player extra space while napping.
High Score Hydra expands the board for combo challenges.
King Bloxley narrows the board because “rectangular discipline builds character.”
```

These changes should feel funny and readable, not unfair.

---

### Festival Chaos Rules — Story Logic

Festival Chaos Rules are temporary room conditions announced by the dungeon like a chaotic carnival game.

Examples:

```text
Sprinkle Storm: “Free sprinkles! Probably too many!”
Wobbly Floor: “Please enjoy our unstable safety-certified tiles.”
Snack Tax: “All snacks now cost one dramatic sigh extra.”
Confetti Fever: “Combos are now legally exciting.”
Royal Inspection: “Stand up straight. The squares are watching.”
```

They should explain room modifiers in a playful way before battle starts.

---

### Battle Mini-Objectives — Story Logic

Battle Mini-Objectives are small challenges shouted by the Festival Announcer, Ticket Imp, Professor Poplin, or the Block-O-Matic itself.

Examples:

```text
“Clear two lines with one piece for bonus tickets!”
“Trigger a cascade before the monster finishes chewing!”
“Keep the board tidy and the Cake Judge will be impressed!”
```

These objectives should make players feel clever, not punished.

---

### Boss Rule Cards — Story Logic

Boss Rule Cards should feel like theatrical announcements before each major fight.

```text
Cupcake Slime King: Sticky Situation!
Prototype No. 7: Totally Safe Machine Test!
Gelato Golem: Brain Freeze Warning!
Sir Snore-a-Lot: Do Not Wake the Pillow Knight!
High Score Hydra: Combo or Be Chomped!
King Bloxley: Everything Must Be Square!
```

Boss cards help teach mechanics while preserving the game’s Saturday-morning-cartoon tone.

---

### Oopsie Risk/Reward Story Logic

Oopsies are not curses. They are funny festival mishaps.

Good examples:

```text
Heavy Blocks
Slippery Buttons
Too Much Confetti
Snack Tax
Sticky Floor
Overexcited Machine
Square Only
Sugar Crash
```

Events should offer choices like:

```text
Take a safe small reward.
Try a weird gadget for a rare reward plus an Oopsie.
Pay gold for a safer controlled reward.
Walk away with dignity, or at least most of it.
```

---

### Hero Passive Story Logic

Hero passives should express personality through gameplay.

| Hero | Passive Story |
| --- | --- |
| Milo | He listens to blocks, so his first cascade gives bonus mana |
| Pippa | Her fire magic burns through sticky/junk messes |
| Nixie | She keeps the board chill when things speed up |
| Bruk | He refuses to fall before the snacks are safe |
| Zuzu | Her bombs are “features,” but they invite more junk |
| Lumi | Star blocks shine brighter when cascades get dramatic |

---

### Festival Hub Progression

After runs, the player should return to a festival hub where the town slowly recovers.

Hub buildings:

```text
Cake Stall
Ice Cream Cart
Goblin Workshop
Arcade Booth
Snack Table
Star Lantern Stage
Repair Tent
Bloxley Statue
```

Narrative purpose:

```text
- Failed runs still help repair the festival.
- Restored booths unlock new items, relics, events, or dialogue.
- The festival becomes more alive as the player progresses.
```

The hub should feel cozy, not grindy.

---

### Monster Friendship / Collection

Some monsters are not evil. They are sugar-rushed, confused, overexcited, or stuck in a weird job created by the Block-O-Matic.

Friendship examples:

```text
Feed a Cupcake Slime enough times and it becomes a Sprinkle Buddy.
Help a Crumb Goblin clean up and junk blocks become less annoying.
Calm a Button Masher and board shake becomes weaker.
Befriend a Square Jester and royal pattern warnings appear earlier.
```

Theme:

> Winning is good. Befriending the chaos is better.

---

### Updated One-Sentence Pitch

```text
A cheerful portrait-mobile falling-block roguelike RPG where a clumsy apprentice mage clears rune lines, triggers cascades, survives random festival chaos, befriends silly monsters, restores the festival hub, and defeats a dramatic block king who insists everything must be square.
```

---

### One-Sentence Pitch

```text
A cheerful falling-block roguelike RPG where a clumsy apprentice mage clears rune lines, triggers magical cascades, casts silly spells, and saves a festival from the world’s most overexcited block machine.
```


---

## Full Character Route Reference

**Source file:** `blockmancer_lighthearted_story_FULL_CHARACTER_ROUTES.md`

**Consolidation note:** Use as supporting source for complete route arcs and route conditions if a detail is not present in the polished storyboard bible.

### Blockmancer Dungeon — Lighthearted Story & Core Concept

#### Core Concept Summary

**Blockmancer Dungeon** is a cheerful portrait-mobile falling-block roguelike RPG where players clear magical rune lines to battle silly monsters, cast spells, trigger cascade gravity combos, collect upgrades, and save a chaotic fantasy festival.

The game mixes a **falling-block puzzle board** with a compact **JRPG-style battle screen**. The top of the portrait screen shows the hero party fighting monsters, the middle focuses on the falling-block board with **Next Block**, **Hold Block**, and **Inventory**, and the bottom provides mobile controls for movement, dropping, rotating, and casting spells.

Unlike classic falling-block games, clearing a line does not simply shift rows down. Instead, the game uses a **Cascade Gravity System**: cleared blocks disappear, unsupported blocks above fall down like Puyo-style gravity, and new lines can form automatically. These cascades create bonus damage, mana, combo chains, and fun “magical mess” moments.

The tone is **bright fantasy, cozy-chaotic, and playful**. The player is not saving a doomed world from darkness. They are fixing a festival disaster caused by a magical block-making machine, recovering stolen snacks, unlocking quirky heroes, and stopping an overly dramatic block mascot king.

Core fantasy:

> You are a Blockmancer cleaning up magical chaos one combo at a time.

Core hook:

> Clear lines, trigger cascades, cast silly spells, and save the festival from becoming the world’s biggest block pile.

---

### Story Overview

#### Logline

In the cheerful kingdom of **Brixonia**, a magical block-making machine goes haywire during the annual Festival of Falling Stars. Rune blocks begin raining everywhere, snack-stealing monsters flood the dungeon below town square, and only a young apprentice Blockmancer named **Milo** can stack, clear, and combo the chaos back into order.

---

#### Premise

Every year, Brixonia celebrates the **Festival of Falling Stars**, a colorful holiday filled with cakes, fireworks, flying lanterns, magical games, and suspiciously glowing buttons.

At the center of the festival is an ancient machine called:

```text
The Block-O-Matic 3000
```

Usually, the machine creates harmless magical rune blocks used to build stalls, decorate streets, launch confetti, repair bridges, and run puzzle games for children.

But this year, **Professor Poplin** tries to upgrade the machine to make the festival “exactly 37% more magical.” Unfortunately, someone presses the button labeled:

```text
DO NOT PRESS DURING FESTIVAL MODE
```

The machine overloads.

It sucks up the festival cakes, spits out thousands of magical rune blocks, turns the town fountain into jelly, and opens a colorful dungeon beneath the town square.

Inside the dungeon, monsters eat too much rune candy and become hyperactive. They start stealing snacks, throwing junk blocks, shaking the board, freezing pieces, and declaring themselves rulers of rectangular objects.

The player enters the dungeon to:

- Fix the Block-O-Matic 3000.
- Recover the missing festival cakes.
- Calm down the sugar-rushed monsters.
- Unlock quirky heroes.
- Defeat **King Bloxley**, the self-appointed king of all blocks.

---

### Tone Direction

The game should feel like:

```text
Cheerful fantasy
Comedic adventure
Cute chaos
Low-stakes but exciting
Colorful dungeon crawl
Saturday morning cartoon energy
```

Avoid:

```text
Tragic dead kingdom
Heavy grief
Dark curse
Edgy villain
Horror monsters
Overly serious lore
```

Good tonal references, without copying:

```text
Mario RPG energy
Paper Mario humor
Fantasy Life coziness
Puyo Puyo silliness
Lighthearted dungeon crawler
```

Main theme:

> Creativity fixes chaos better than control.

Core story sentence:

> The dungeon is not evil. It is just very, very bad at organizing a festival.

---

### Main Character

#### Milo — The Blockmancer

Milo is a slightly clumsy but optimistic apprentice mage. He is not the best at traditional magic, but he has one unusual talent: he can hear the tiny “plink plonk” language of rune blocks.

Before the disaster, Milo’s official festival job was temporary lemonade assistant. After the Block-O-Matic 3000 goes wild, he becomes the only person calm enough to look at a magical dungeon full of falling blocks and say:

> “Well, at least this looks stackable.”

##### Personality

- Optimistic.
- Creative.
- Talks to blocks.
- Believes most problems can be solved with a good combo.
- A little clumsy, but charming.

##### Gameplay Role

```text
Balanced starter hero
Good mana gain
Simple and beginner-friendly
```

##### Unlock Condition

```text
Unlocked by default
```

---

### Playable Heroes

#### Milo — The Blockmancer

##### Role

```text
Balanced starter
```

##### Story

Milo wants to prove he is more than the festival’s backup lemonade assistant. He believes that if things are placed in the right order, even a chaotic magical dungeon can become cute and manageable.

##### Unlock Condition

```text
Unlocked by default
```

---

#### Pippa — The Pyromancer

Pippa is the festival baker. After her oven is invaded by rune blocks and slime monsters eat half her emergency frosting, she turns her whisk into a fire wand.

##### Role

```text
Fire damage / aggressive spell hero
```

##### Personality

- Hot-tempered but kind.
- Very serious about cookies.
- Calls Fireball “preheating.”

##### Unlock Condition

```text
Defeat Cupcake Slime Boss in Stage 1
```

##### Story Hook

> “The slimes ate my cupcakes. This is personal.”

---

#### Nixie — The Frostbinder

Nixie runs the magical ice cream cart. She enters the dungeon because monsters stole her rainbow gelato supply.

##### Role

```text
Slow fall speed / control / defensive
```

##### Personality

- Calm.
- Loves ice puns.
- Hates when blocks fall too fast.

##### Unlock Condition

```text
Clear 3 rooms without taking damage
```

##### Story Hook

> “Relax. Every problem is easier when chilled.”

---

#### Bruk — The Snack Knight

Bruk is the knight in charge of guarding the snack table. His armor is covered in crumbs, but his sense of duty is unshakable.

##### Role

```text
High HP / heavy drop / defensive hero
```

##### Personality

- Loyal.
- Loves snacks.
- Talks about potato chips like ancient treasure.

##### Unlock Condition

```text
Collect 500 total gold across runs
```

##### Story Hook

> “No snack left behind.”

---

#### Zuzu — The Goblin Engineer

Zuzu is a goblin engineer and former intern for Professor Poplin. She insists she did not break the Block-O-Matic. She only “tested it enthusiastically.”

##### Role

```text
Bomb blocks / board manipulation / risky utility
```

##### Personality

- Talks quickly.
- Overconfident.
- Calls every bug a feature.

##### Unlock Condition

```text
Defeat Goblin Workshop miniboss
```

##### Story Hook

> “If it explodes, it means it works.”

---

#### Lumi — The Star Witch

Lumi is a young witch who decorates the festival with paper stars and tiny light spells. She gets lost in the dungeon after following a suspiciously shiny block.

##### Role

```text
Mana / spell chaining / cascade bonus
```

##### Personality

- Dreamy.
- Loves sparkly things.
- Names every special block she sees.

##### Unlock Condition

```text
Trigger 10 cascade combos across runs
```

##### Story Hook

> “That purple block has main character energy.”

---

### Main Villain

#### King Bloxley, the Self-Appointed Block King

King Bloxley is not a real king. He was originally a wooden mascot from the festival game **Stack the Crown**.

When the Block-O-Matic 3000 overloaded, a huge burst of rune magic hit the mascot and brought him to life. He immediately climbed onto a pile of blocks and declared:

> “I am King Bloxley, ruler of all rectangular things!”

He is not evil. He is just extremely dramatic and obsessed with order.

##### Goal

King Bloxley wants to:

- Turn the festival into a perfectly square block palace.
- Force everyone to line up by color.
- Ban round cakes because they do not have corners.
- Make every room symmetrical, even if nobody asked.

##### Final Boss Vibe

```text
Funny tyrant
Silly but challenging
Overdramatic
Loves symmetry
```

---

### World

#### Brixonia

Brixonia is a cheerful fantasy kingdom where magic is used for everyday convenience.

Magic helps people:

- Stir soup automatically.
- Fly ice cream carts.
- Build festival stages.
- Launch cat-shaped fireworks.
- Create rune blocks for construction and games.

People are not afraid of magic. They are mostly afraid of magic knocking over the dessert table.

---

#### The Block-O-Matic 3000

The Block-O-Matic 3000 is an ancient machine repaired and upgraded by generations of wizards. It has several modes:

```text
Build
Bake
Bounce
Battle
Festival
Do Not Press
```

Professor Poplin accidentally activates:

```text
Festival + Battle + Do Not Press
```

That combination creates the dungeon.

---

### Stage Structure

#### Stage 1 — Sprinkle Sewers

##### Theme

A colorful sewer under the festival, filled with spilled candy, frosting pipes, cupcake slime, and rainbow water.

##### Monsters

- Cupcake Slime
- Sugar Bat
- Crumb Goblin
- Jelly Rat

##### Boss

```text
Cupcake Slime Boss
```

##### Mechanics

- Sticky blocks.
- Mana sprinkles.
- Beginner-friendly enemies.

##### Unlock

```text
Defeat boss to unlock Pippa.
```

---

#### Stage 2 — Goblin Workshop

##### Theme

A chaotic machine workshop full of conveyor belts, toy bombs, springs, spinning gears, and signs that say “Totally Safe.”

##### Monsters

- Wrench Goblin
- Button Masher
- Spring Bot
- Spark Gremlin

##### Boss

```text
Zuzu’s Prototype No. 7
```

##### Mechanics

- Junk blocks.
- Bomb blocks.
- Light board shake.

##### Unlock

```text
Defeat boss to unlock Zuzu.
```

---

#### Stage 3 — Frosty Pantry

##### Theme

A magical frozen pantry with rainbow ice cream, enchanted pudding, slippery tiles, and frosty rune blocks.

##### Monsters

- Ice Cream Imp
- Popsicle Bat
- Chill Slime
- Freezer Mimic

##### Boss

```text
The Gelato Golem
```

##### Mechanics

- Ice blocks.
- Fall speed waves.
- Some blocks slide after cascade.

##### Unlock

```text
Clear 3 rooms without taking damage to unlock Nixie.
```

---

#### Stage 4 — Pillow Castle

##### Theme

A soft castle made of pillows, plush toys, blanket ghosts, toy soldiers, and sleepy enemies.

##### Monsters

- Button Knight
- Blanket Ghost
- Plush Dragon
- Toy Soldier

##### Boss

```text
Sir Snore-a-Lot
```

##### Mechanics

- Sleep status.
- Soft blocks.
- Shield enemies.

##### Unlock

```text
Collect 500 total gold across runs to unlock Bruk.
```

---

#### Stage 5 — Starfall Arcade

##### Theme

A glowing magical arcade with neon machines, prize counters, combo signs, and animated game cabinets.

##### Monsters

- Token Sprite
- Combo Gremlin
- Neon Bat
- Prize Claw Mimic

##### Boss

```text
The High Score Hydra
```

##### Mechanics

- Rewards cascade combos.
- Punishes low combo play.
- Fever meter fills faster.

##### Unlock

```text
Trigger 10 cascade combos across runs to unlock Lumi.
```

---

#### Stage 6 — Bloxley’s Block Palace

##### Theme

A giant palace built from colorful blocks, toy flags, square carpets, confetti cannons, and overdramatic royal decorations.

##### Monsters

- Royal Block Guard
- Square Jester
- Crown Bat
- Parade Golem

##### Final Boss

```text
King Bloxley
```

##### Mechanics

- Rearranges junk blocks into patterns.
- Demands symmetry.
- Spawns royal blocks.
- Final phase: “Everything Must Be Square!”

---

### Monster Tone

Monsters should be:

```text
Silly
Readable
Cute-chaotic
Annoying but charming
```

They should not feel scary or grotesque. They should look like festival creatures, magical accidents, snack thieves, toy monsters, or overexcited dungeon mascots.

---

### Example Monsters

#### Cupcake Slime

A slime wearing whipped cream like a hat. When hit, it drops sprinkles.

##### Behavior

```text
Sticky blocks
Mana sprinkles
```

---

#### Crumb Goblin

A tiny goblin that eats cookie crumbs and throws junk blocks while giggling.

##### Behavior

```text
Spawn junk
```

---

#### Sugar Bat

A small bat that flies too fast because it ate too much candy.

##### Behavior

```text
Hide next block briefly
```

---

#### Button Masher

A little workshop robot that presses every button at once.

##### Behavior

```text
Random board shake
```

---

#### Freezer Mimic

A treasure chest hiding in the freezer. When opened, it sneezes ice.

##### Behavior

```text
Freeze active piece
```

---

#### Plush Dragon

A stuffed dragon that breathes cotton-candy fire.

##### Behavior

```text
Burn blocks
```

---

### Opening Cutscene

```text
Every year, the kingdom of Brixonia held the Festival of Falling Stars.

There were cakes.
There were fireworks.
There were suspiciously glowing buttons.

Professor Poplin promised his new invention would make the festival
“exactly 37% more magical.”

Then someone pressed the button labeled:

DO NOT PRESS DURING FESTIVAL MODE.

The ground burped.
The fountain turned into jelly.
And a dungeon full of falling rune blocks opened beneath the town square.

Milo, apprentice Blockmancer and temporary lemonade assistant,
picked up his wand.

“Well,” he said,
“at least this looks stackable.”
```

---

### Short Intro

```text
The festival is a mess.

Blocks are falling.
Monsters are snacking.
The dungeon is growing.
And someone needs to turn off the Block-O-Matic 3000.

Clear lines.
Cast spells.
Save the snacks.
Fix the dungeon.
```

---

### Stage Clear Texts

#### After Stage 1

```text
The Cupcake Slime pops into a shower of sprinkles.

Pippa dusts flour from her sleeves.

“That was my emergency frosting.
You’re lucky I’m joining you.”
```

---

#### After Stage 2

```text
Prototype No. 7 explodes into three smaller prototypes,
then politely shuts itself down.

Zuzu grins.

“Great news! It only exploded once this time.”
```

---

#### After Stage 3

```text
The Gelato Golem melts into a perfectly acceptable smoothie.

Nixie sighs.

“I leave the pantry alone for ten minutes...”
```

---

#### After Stage 4

```text
Sir Snore-a-Lot falls asleep mid-battle.

Bruk carefully covers him with a blanket.

“Victory is best served with snacks.”
```

---

#### After Stage 5

```text
The High Score Hydra loses all three heads at once.

Lumi claps.

“Triple game over. Very stylish.”
```

---

#### Before Final Boss

```text
King Bloxley sits on a throne made of suspiciously familiar blocks.

“At last,” he declares,
“a worthy stacker approaches.”

Milo raises his wand.

“Can we fix the festival now?”

The king gasps.

“Not until everything is perfectly rectangular!”
```

---

### Ending

#### Normal Ending

After King Bloxley is defeated, the Block-O-Matic 3000 calms down. The dungeon folds itself into a tiny cube and lands in Professor Poplin’s pocket.

The festival is saved, although the fountain is still jelly.

```text
The blocks stopped falling.

The monsters stopped snacking.

The cake was mostly recovered.

And Milo was promoted from lemonade assistant
to Junior Emergency Dungeon Organizer.
```

---

#### True Ending

##### Unlock Requirements

```text
Defeat King Bloxley
Unlock all heroes
Trigger 20 cascade combos
Find all missing festival cakes
```

##### Ending Text

```text
Professor Poplin finally reads the manual.

The Block-O-Matic 3000 was not broken.
It was lonely.

It had spent hundreds of years building things,
but never got invited to the festival.

So Brixonia gives it a job:
Festival Game Master.

From then on, once a year,
the dungeon opens safely for brave players,
silly monsters,
and competitive snack-based block battles.
```

---

### Store Page Story Summary

```text
The Festival of Falling Stars has gone completely sideways.

A magical machine called the Block-O-Matic 3000 has created a colorful dungeon beneath town square, filling it with falling rune blocks, snack-stealing monsters, and one very bossy block king.

Play as Milo and a cast of quirky heroes in a cheerful falling-block roguelike RPG. Clear lines, trigger cascades, cast silly spells, collect relics, and save the festival one combo at a time.
```

---

### Gameplay-Story Integration

#### Line Clears

Line clears represent cleaning up the magical mess caused by the Block-O-Matic.

#### Cascade Gravity

Cascades feel like magical domino effects. When the player clears a line, unsupported blocks collapse downward, creating more clears, more mana, more damage, and more chaos.

#### Spells

Spells should feel playful and practical:

- Fireball is Pippa’s “preheating.”
- Frost Lock is Nixie cooling the board down.
- Bomb Rune is Zuzu’s “tested” invention.
- Heal Glyph is festival first aid.

#### Relics and Upgrades

Relics should feel like festival souvenirs, magical snacks, toy tools, lucky charms, or broken machine parts.

Examples:

- Goblin Coin
- Sprinkle Compass
- Jelly Fountain Cup
- Poplin’s Spare Button
- Lucky Cake Fork
- Tiny Trophy Crown

---

### UI / Visual Story Direction

The visual style should support the cheerful tone.

#### Theme

```text
Pixel-art fantasy festival
32-bit inspired look
Bright readable colors
Cute monsters
Chunky UI panels
Toy-like magic machinery
```

#### Portrait Layout Story Logic

The portrait-only UI should feel like a magical arcade cabinet on a phone:

```text
Top 1/5:
Compact battle scene with party vs monsters

Middle 3/5:
Main falling-block board with Hold, Next Block, and Inventory overlays

Bottom 1/5:
Mobile controls for movement, drop, rotate, and spells
```

The top battle screen shows the result of the puzzle battle. The middle board is the core “magical mess” being cleaned. The bottom controls are the player’s spellbook and action panel.

---

### Festival Chaos & Replayability Story Layer

The expanded game structure should make the dungeon feel like a living festival machine that keeps improvising.

The Block-O-Matic 3000 is not only spawning monsters. It is also accidentally creating:

```text
Random room mishaps
Stage-specific side goals
Boss rule announcements
Festival hub repair projects
Monster friendship moments
Board-size hiccups
Silly risk/reward Oopsies
```

This keeps the story lighthearted while explaining why each run feels different.

Core story rule:

> The dungeon changes because the Block-O-Matic is trying to help, but it has the planning skills of a confetti cannon.

---

### Stage Goals — Story Motivation

Each stage should have one optional side goal that gives players a reason to care about the route beyond simply reaching the boss.

| Stage | Story Goal | Narrative Result |
| ---: | --- | --- |
| 1 | Recover 3 Lost Cupcakes | Pippa gets enough emergency frosting to weaken the Cupcake Slime King |
| 2 | Disable 2 Goblin Machines | Zuzu identifies which workshop buttons should definitely not be glowing |
| 3 | Save 3 Ice Cream Crates | Nixie keeps the gelato supply from becoming soup |
| 4 | Keep 2 Guards Asleep | Bruk preserves the Pillow Castle’s sacred nap schedule |
| 5 | Reach Combo Score Target | Lumi wins enough arcade tickets to calm the High Score Hydra |
| 6 | Break 3 Royal Seals | King Bloxley’s “perfectly square” palace rules begin to wobble |

Failure should not feel like grim punishment. It should feel like comedic inconvenience:

```text
The boss gets stickier.
The machine gets overexcited.
The palace adds more royal blocks.
The arcade gets smug.
```

---

### Map Progression Story Logic

The dungeon should feel larger and stranger as the player gets closer to King Bloxley.

```text
Stage 1: 6 main-path nodes — short, beginner-friendly sewer cleanup
Stage 2: 8 main-path nodes — more workshop route choices
Stage 3: 10 main-path nodes — frozen pantry detours
Stage 4: 12 main-path nodes — sleepy castle exploration
Stage 5: 14 main-path nodes — arcade challenge route
Stage 6: 16 main-path nodes — final palace gauntlet
```

The increase in nodes represents the Block-O-Matic becoming more creative, confused, and dramatic.

---

### Dynamic Board Size Story Logic

Board size changes are caused by the Block-O-Matic physically reshaping the magical playfield.

Examples:

```text
Cupcake Slime King squeezes the board with frosting.
Prototype No. 7 expands the board with unstable bomb lanes.
Gelato Golem freezes the board edges inward.
Sir Snore-a-Lot accidentally gives the player extra space while napping.
High Score Hydra expands the board for combo challenges.
King Bloxley narrows the board because “rectangular discipline builds character.”
```

These changes should feel funny and readable, not unfair.

---

### Festival Chaos Rules — Story Logic

Festival Chaos Rules are temporary room conditions announced by the dungeon like a chaotic carnival game.

Examples:

```text
Sprinkle Storm: “Free sprinkles! Probably too many!”
Wobbly Floor: “Please enjoy our unstable safety-certified tiles.”
Snack Tax: “All snacks now cost one dramatic sigh extra.”
Confetti Fever: “Combos are now legally exciting.”
Royal Inspection: “Stand up straight. The squares are watching.”
```

They should explain room modifiers in a playful way before battle starts.

---

### Battle Mini-Objectives — Story Logic

Battle Mini-Objectives are small challenges shouted by the Festival Announcer, Ticket Imp, Professor Poplin, or the Block-O-Matic itself.

Examples:

```text
“Clear two lines with one piece for bonus tickets!”
“Trigger a cascade before the monster finishes chewing!”
“Keep the board tidy and the Cake Judge will be impressed!”
```

These objectives should make players feel clever, not punished.

---

### Boss Rule Cards — Story Logic

Boss Rule Cards should feel like theatrical announcements before each major fight.

```text
Cupcake Slime King: Sticky Situation!
Prototype No. 7: Totally Safe Machine Test!
Gelato Golem: Brain Freeze Warning!
Sir Snore-a-Lot: Do Not Wake the Pillow Knight!
High Score Hydra: Combo or Be Chomped!
King Bloxley: Everything Must Be Square!
```

Boss cards help teach mechanics while preserving the game’s Saturday-morning-cartoon tone.

---

### Oopsie Risk/Reward Story Logic

Oopsies are not curses. They are funny festival mishaps.

Good examples:

```text
Heavy Blocks
Slippery Buttons
Too Much Confetti
Snack Tax
Sticky Floor
Overexcited Machine
Square Only
Sugar Crash
```

Events should offer choices like:

```text
Take a safe small reward.
Try a weird gadget for a rare reward plus an Oopsie.
Pay gold for a safer controlled reward.
Walk away with dignity, or at least most of it.
```

---

### Hero Passive Story Logic

Hero passives should express personality through gameplay.

| Hero | Passive Story |
| --- | --- |
| Milo | He listens to blocks, so his first cascade gives bonus mana |
| Pippa | Her fire magic burns through sticky/junk messes |
| Nixie | She keeps the board chill when things speed up |
| Bruk | He refuses to fall before the snacks are safe |
| Zuzu | Her bombs are “features,” but they invite more junk |
| Lumi | Star blocks shine brighter when cascades get dramatic |

---

### Festival Hub Progression

After runs, the player should return to a festival hub where the town slowly recovers.

Hub buildings:

```text
Cake Stall
Ice Cream Cart
Goblin Workshop
Arcade Booth
Snack Table
Star Lantern Stage
Repair Tent
Bloxley Statue
```

Narrative purpose:

```text
- Failed runs still help repair the festival.
- Restored booths unlock new items, relics, events, or dialogue.
- The festival becomes more alive as the player progresses.
```

The hub should feel cozy, not grindy.

---

### Monster Friendship / Collection

Some monsters are not evil. They are sugar-rushed, confused, overexcited, or stuck in a weird job created by the Block-O-Matic.

Friendship examples:

```text
Feed a Cupcake Slime enough times and it becomes a Sprinkle Buddy.
Help a Crumb Goblin clean up and junk blocks become less annoying.
Calm a Button Masher and board shake becomes weaker.
Befriend a Square Jester and royal pattern warnings appear earlier.
```

Theme:

> Winning is good. Befriending the chaos is better.

---

### Updated One-Sentence Pitch

```text
A cheerful portrait-mobile falling-block roguelike RPG where a clumsy apprentice mage clears rune lines, triggers cascades, survives random festival chaos, befriends silly monsters, restores the festival hub, and defeats a dramatic block king who insists everything must be square.
```

---

### One-Sentence Pitch

```text
A cheerful falling-block roguelike RPG where a clumsy apprentice mage clears rune lines, triggers magical cascades, casts silly spells, and saves a festival from the world’s most overexcited block machine.
```

---

### Character Story Routes & Multiple Endings Expansion

#### Purpose

This section expands the story from one shared campaign ending into a **route-based story structure**.

The world, stages, bosses, and festival disaster remain the same for every character. What changes is the emotional focus, dialogue choices, side objectives, and final resolution.

Design goal:

```text
Same Brixonia.
Same Block-O-Matic disaster.
Same six-stage dungeon.
Different hero perspective.
Different dialogue choices.
Different personal ending.
```

Player fantasy:

> Pick a hero, travel through the same festival dungeon, make route-specific choices, and decide what kind of helper, friend, inventor, protector, or star you become.

---

#### Route System Overview

Each playable hero has a personal route.

Core Release 1.0 routes:

```text
route_milo_blockmancer
route_pippa_pyromancer
route_zuzu_goblin_engineer
route_nixie_frostbinder
route_bruk_snack_knight
route_lumi_star_witch
```

Optional postgame / future routes:

```text
route_poplin_professor
route_bloop_slime_friend
```

Each route includes:

```text
- Route theme
- Route conflict
- Six stage story beats
- Dialogue choices
- Route flags
- Normal character ending
- True character ending
```

The shared global story still has:

```text
- Festival Normal Ending
- Festival True Ending
```

Character endings sit between the global ending structure:

```text
Defeat King Bloxley
↓
Check selected hero route state
↓
Show Character Normal End or Character True End
↓
If global true requirements are met, show Festival True Ending epilogue after the character true ending
```

---

#### Ending Types

#### 1. Festival Normal Ending

The player defeats King Bloxley and calms the Block-O-Matic, but not every personal or festival mystery is resolved.

Use when:

```text
- King Bloxley defeated
- Selected hero route completed at basic level
- True ending requirements are not met
```

Tone:

```text
Happy
Funny
Satisfying
Slightly incomplete
Leaves room for another run
```

---

#### 2. Character Normal Ending

The selected hero gets a personal conclusion, but they solve the problem in the most straightforward way.

Use when:

```text
- King Bloxley defeated with selected hero
- Hero route has enough route progress
- Hero does not complete all True Route requirements
```

Example:

```text
Pippa saves the cakes and reopens the bakery, but still treats the slimes mostly as frosting criminals.
```

---

#### 3. Character True Ending

The selected hero resolves their personal route with empathy, creativity, and a better understanding of the festival chaos.

Use when:

```text
- King Bloxley defeated with selected hero
- Hero route core flags completed
- Hero route final dialogue choice selected
- Route-specific side goal completed
```

Example:

```text
Pippa turns the slime problem into a cupcake decorating team and discovers that the dungeon was not stealing cakes. It was trying to bake.
```

---

#### 4. Festival True Ending

The full festival truth is discovered: the Block-O-Matic was not evil or broken. It was lonely, overworked, and trying to join the festival.

Use when:

```text
- King Bloxley defeated
- All core heroes unlocked
- All missing festival cakes found
- 20+ cascade combos achieved across runs
- At least 3 Character True Endings unlocked
- Final Bloxley dialogue uses empathy instead of only force
```

This ending can play as a final epilogue after any Character True Ending.

---

#### Route Progress Values

Each route tracks three simple values.

```ts
type HeroRouteProgress = {
  routeId: string;
  selectedHeroId: string;
  affinity: number;
  insight: number;
  chaosMercy: number;
  completedStageBeats: string[];
  trueFlags: string[];
  normalEndingUnlocked: boolean;
  trueEndingUnlocked: boolean;
};
```

##### Affinity

Represents trust between the hero and the party/NPCs.

Increased by:

```text
Kind dialogue
Helping NPCs
Returning stolen items
Choosing patience over shortcuts
```

##### Insight

Represents understanding the real cause of the route problem.

Increased by:

```text
Reading manual pages
Completing stage goals
Asking why monsters are behaving strangely
Choosing creative solutions
```

##### Chaos Mercy

Represents how often the player calms, befriends, repairs, or redirects chaos instead of only defeating it.

Increased by:

```text
Befriending monsters
Choosing non-punitive event outcomes
Using route-specific compassionate choices
Accepting funny inconvenience instead of harsh punishment
```

---

#### Dialogue Choice Rules

Each major route scene should offer **3 choices**.

##### Choice A — Direct / Practical

Usually leads toward the Normal Ending.

```text
Fast
Clear
Competent
Solves the immediate problem
Often gives combat/reward benefit
```

##### Choice B — Empathetic / Creative

Usually leads toward the True Ending.

```text
Kind
Curious
Creative
Asks why the chaos is happening
Often gives route insight or friendship progress
```

##### Choice C — Chaotic / Risky

Usually gives a funny reward, an Oopsie, or a harder room.

```text
Silly
Greedy
Experimental
Can create shortcuts
May reduce true ending consistency if overused
```

Important rule:

> A player should not permanently fail a True Ending from one bad dialogue choice. Require several True Route flags, not perfect choices.

Recommended True Ending requirement per hero:

```text
- Complete at least 4 of 6 route true flags
- Complete the route-specific stage goal
- Choose the empathetic final dialogue choice before King Bloxley
```

---

#### Shared Final Boss Dialogue

Before fighting King Bloxley, the selected hero gets a route-specific final dialogue.

King Bloxley says:

```text
"Enough! I built a palace with corners, rules, and excellent right angles.
Why does everyone keep calling it a mess?"
```

The player receives three final choices.

| Choice | Meaning | Ending Impact |
| --- | --- | --- |
| "Because festivals need room to move." | Practical but kind | Normal or True depending on route flags |
| "Because you wanted to be invited, not obeyed." | Empathetic insight | Required for Character True Ending |
| "Because round cakes are objectively superior." | Funny provocation | Boss starts with extra royal blocks; does not grant true final flag |

---

### Route 1 — Milo, The Blockmancer

#### Route ID

```text
route_milo_blockmancer
```

#### Route Theme

```text
Leadership is not stacking every problem alone.
```

#### Personal Conflict

Milo believes that because he can hear the blocks, he has to personally fix every mess by himself. His route teaches him to trust friends, listen clearly, and organize without controlling everyone.

#### Route Meter Names

```text
Affinity: Party Trust
Insight: Plink-Plonk Understanding
Chaos Mercy: Gentle Stacking
```

#### Route True Ending Requirements

```text
- Complete at least 4 Milo True Flags
- Trigger at least 5 cascades in a single Milo run
- Use Hold at least once during King Bloxley fight
- Choose "Because you wanted to be invited, not obeyed."
```

#### Stage Story Beats

| Stage | Story Beat | Choice A — Normal Lean | Choice B — True Lean | Choice C — Risky Lean |
| ---: | --- | --- | --- | --- |
| 1 | Milo hears blocks crying "too sticky!" in the Sprinkle Sewers. | "Stack first, ask questions later." Gain small damage bonus. | "What are the blocks trying to say?" Gain `milo_flag_listened_to_sticky_blocks`. | "Ask the jelly fountain to translate." Gain mana, add Wobbly Floor chaos. |
| 2 | Goblin machines produce blocks that argue with each other. | "Sort them by color." Reduce junk this room. | "Let each machine explain its job." Gain `milo_flag_respected_machine_noise`. | "Press the least shiny button." Gain random item, add one Oopsie chance. |
| 3 | Frozen blocks speak slowly and Milo keeps interrupting. | "Warm them up quickly." Remove one ice block. | "Wait for the whole plink-plonk sentence." Gain `milo_flag_patient_listener`. | "Translate using ice cream flavors." Gain heal, but enemy starts chilled and annoyed. |
| 4 | Pillow Castle blocks refuse to fall because they are sleepy. | "Shake the board gently." Speed up combat. | "Let them nap in neat columns." Gain `milo_flag_respected_nap_order`. | "Declare a pillow meeting." Gain shield, add Sleepy status chance. |
| 5 | Arcade blocks cheer only for flashy cascades. | "Play for score." Gain Fever. | "Play so every block gets a turn." Gain `milo_flag_shared_spotlight`. | "Name every block on screen." Gain random star block, lose preview briefly. |
| 6 | Royal blocks demand Milo become their new organizer. | "I can make a better system." Lower royal pattern difficulty. | "You do not need a ruler. You need friends." Gain `milo_flag_rejected_control`. | "Can I be Duke of Rectangles?" King Bloxley laughs, then adds royal blocks. |

#### Milo Normal Ending — Junior Emergency Dungeon Organizer

Unlock condition:

```text
Defeat King Bloxley with Milo
Complete fewer than 4 Milo True Flags
```

Ending text:

```text
The Block-O-Matic calms down with one last polite clunk.

Milo opens a notebook titled:
"Things I Definitely Organized On Purpose."

The festival council promotes him from temporary lemonade assistant
to Junior Emergency Dungeon Organizer.

He gets a sash.
He gets a tiny desk.
He gets seventeen blocks asking for appointments.

Milo smiles.

"Well," he says,
"at least this looks schedulable."
```

Result:

```text
Unlocks Milo route badge: badge_junior_organizer
Unlocks 1 extra tutorial tip slot
```

#### Milo True Ending — The Plink-Plonk Parade

Unlock condition:

```text
Defeat King Bloxley with Milo
Complete 4+ Milo True Flags
Choose the empathetic final Bloxley dialogue
```

Ending text:

```text
Milo lowers his wand.

For the first time, he does not tell the blocks where to go.

He listens.

The rune blocks plink.
The jelly fountain plonks.
The Block-O-Matic hums a shy little festival song.

Milo translates for everyone:

"It says it wanted to help build the festival,
but nobody asked what it wanted to make."

So Brixonia adds a new event:
The Plink-Plonk Parade.

Every year, the blocks build one ridiculous float by themselves.

The first float is a lemonade cup with legs.

Milo cries a little.

The cup wins second place.
```

Result:

```text
Unlocks Milo true badge: badge_plink_plonk_parade
New passive cosmetic: Milo's blocks briefly bounce when cascades trigger
Counts toward Festival True Ending
```

---

### Route 2 — Pippa, The Pyromancer

#### Route ID

```text
route_pippa_pyromancer
```

#### Route Theme

```text
Protecting what you love does not mean burning every inconvenience.
```

#### Personal Conflict

Pippa is furious because the slimes ruined her bakery and stole her cupcakes. Her route teaches her that some monsters are not thieves; they are confused, hungry, and bad at reading recipe cards.

#### Route Meter Names

```text
Affinity: Bakery Trust
Insight: Recipe Clarity
Chaos Mercy: Frosting Forgiveness
```

#### Route True Ending Requirements

```text
- Complete at least 4 Pippa True Flags
- Recover 3 Lost Cupcakes in Stage 1
- Use a fire spell to clear sticky or junk blocks without defeating the enemy immediately at least once
- Choose "Because you wanted to be invited, not obeyed."
```

#### Stage Story Beats

| Stage | Story Beat | Choice A — Normal Lean | Choice B — True Lean | Choice C — Risky Lean |
| ---: | --- | --- | --- | --- |
| 1 | Cupcake Slimes are wearing stolen frosting as hats. | "Return the frosting. Now." Boss starts with less HP. | "Taste the frosting trail first." Gain `pippa_flag_found_recipe_misprint`. | "Challenge the slime to a bake-off." Gain reward, boss gets stickier. |
| 2 | A goblin machine has been stamping cupcake molds into bomb shapes. | "Melt the machine shut." Disable one gadget hazard. | "Check why it thinks bombs are cupcakes." Gain `pippa_flag_read_goblin_recipe_card`. | "Bake the bomb cupcakes." Gain Bomb Rune charge, add overexcited machine risk. |
| 3 | Frozen gelato labels reveal the slimes followed a fake delivery order. | "Thaw the labels fast." Gain gold. | "Save the labels as evidence." Gain `pippa_flag_spotted_fake_order`. | "Invent spicy ice cream." Gain fire damage, Nixie complains. |
| 4 | Pillow guards hide emergency flour sacks under blankets. | "Confiscate the flour." Gain item reward. | "Ask why they hid it." Gain `pippa_flag_learned_snack_panic`. | "Bake pillow bread." Gain shield, add Sleepy risk. |
| 5 | Arcade tickets can be traded for a missing oven knob. | "Win enough tickets." Gain Fever. | "Trade fairly with Ticket Imp." Gain `pippa_flag_fair_trade_ticket_imp`. | "Bet double or frosting." Gain rare reward or Oopsie. |
| 6 | Bloxley bans round cakes from the palace banquet. | "Preheat everything." Start boss with burn damage. | "Bake him a square cake with a round heart." Gain `pippa_flag_square_cake_round_heart`. | "Throw a cupcake at the throne." Funny boss intro; extra royal block. |

#### Pippa Normal Ending — Emergency Frosting Victory

Unlock condition:

```text
Defeat King Bloxley with Pippa
Complete fewer than 4 Pippa True Flags
```

Ending text:

```text
Pippa reopens the Cake Stall before the confetti settles.

The cupcakes are rescued.
The frosting is guarded.
The oven is reinforced with a tiny "NO SLIMES" sign.

Cupcake Slimes still press their faces against the window.

Pippa narrows her eyes.

Then she slides one slightly burnt cupcake outside.

"This is not forgiveness," she says.

The slimes cheer anyway.
```

Result:

```text
Unlocks Pippa route badge: badge_emergency_frosting
Shop cupcakes heal +1 HP
```

#### Pippa True Ending — The Great Slime Bake-Off

Unlock condition:

```text
Defeat King Bloxley with Pippa
Complete 4+ Pippa True Flags
Recover 3 Lost Cupcakes
Choose the empathetic final Bloxley dialogue
```

Ending text:

```text
Pippa discovers the truth in a frosting-stained manual page.

The slimes did not steal the cupcakes.

The Block-O-Matic printed a recipe that said:
"Please collect cake samples for festival happiness calibration."

Unfortunately, it printed the recipe in Slime.

Pippa stares at the Cupcake Slime King.

The Cupcake Slime King stares back.

Then it offers her a sprinkle.

One week later, the Cake Stall reopens as:
Pippa & Slimes: Questionably Safe Bakery.

Their first special is a square cupcake with round frosting.

King Bloxley buys twelve.
```

Result:

```text
Unlocks Pippa true badge: badge_great_slime_bakeoff
Cupcake Slime friendship starts at level 1 in future runs
Counts toward Festival True Ending
```

---

### Route 3 — Zuzu, The Goblin Engineer

#### Route ID

```text
route_zuzu_goblin_engineer
```

#### Route Theme

```text
A feature becomes a bug when nobody agreed to be exploded.
```

#### Personal Conflict

Zuzu insists the Block-O-Matic disaster was an "enthusiastic test." Her route is about learning responsibility without losing her inventiveness.

#### Route Meter Names

```text
Affinity: Workshop Trust
Insight: Manual Honesty
Chaos Mercy: Safe Experimenting
```

#### Route True Ending Requirements

```text
- Complete at least 4 Zuzu True Flags
- Disable 2 Goblin Machines in Stage 2
- Use Bomb Rune or a bomb block to solve a hazard without damaging yourself
- Choose "Because you wanted to be invited, not obeyed."
```

#### Stage Story Beats

| Stage | Story Beat | Choice A — Normal Lean | Choice B — True Lean | Choice C — Risky Lean |
| ---: | --- | --- | --- | --- |
| 1 | Zuzu finds a goblin wrench inside a cupcake slime. | "Take it back. No questions." Gain gadget item. | "Ask why the slime swallowed it." Gain `zuzu_flag_checked_first_accident`. | "Upgrade the slime." Gain reward, adds sticky gadget effect. |
| 2 | Prototype No. 7 calls Zuzu "temporary assistant number three." | "Shut it down." Easier boss phase. | "Admit I skipped the safety checklist." Gain `zuzu_flag_admitted_skipped_checklist`. | "Turn safety checklist into confetti." Gain bomb blocks, more junk. |
| 3 | Ice blocks preserve old machine logs. | "Download the useful logs only." Gain spell catalyst. | "Read the embarrassing logs too." Gain `zuzu_flag_read_full_logs`. | "Overclock the freezer." Gain rare item, speed wave risk. |
| 4 | Toy soldiers found Zuzu's old warning labels and used them as blankets. | "Take the labels." Gain shop discount. | "Write better labels with pictures." Gain `zuzu_flag_made_readable_warnings`. | "Invent screaming labels." Enemies start Sleepy, player may too. |
| 5 | Arcade cabinet displays Zuzu's high score under "Most Property Damage." | "Beat my score." Gain Fever. | "Change scoring to reward clean fixes." Gain `zuzu_flag_rewarded_safe_design`. | "Add explosions to the scoreboard." Gain high reward, add Oopsie. |
| 6 | Bloxley offers Zuzu a royal engineering license if she makes perfect square machines. | "Accept and sabotage later." Reduce royal hazards. | "No more secret buttons." Gain `zuzu_flag_no_secret_buttons`. | "Ask if the license includes explosions." Extra boss phase gag. |

#### Zuzu Normal Ending — Mostly Safe Workshop

Unlock condition:

```text
Defeat King Bloxley with Zuzu
Complete fewer than 4 Zuzu True Flags
```

Ending text:

```text
Zuzu rebuilds the Goblin Workshop with twelve new safety signs.

One says:
"DO NOT PRESS."

Another says:
"DO NOT PRESS, EVEN IF IT GLOWS."

A third says:
"ZUZZU, THIS MEANS YOU."

The workshop still explodes every Thursday,
but now it explodes in a clearly marked direction.
```

Result:

```text
Unlocks Zuzu route badge: badge_mostly_safe
Bomb items appear slightly more often in shops
```

#### Zuzu True Ending — The Enthusiastic Safety Manual

Unlock condition:

```text
Defeat King Bloxley with Zuzu
Complete 4+ Zuzu True Flags
Disable 2 Goblin Machines
Choose the empathetic final Bloxley dialogue
```

Ending text:

```text
Zuzu stands before Professor Poplin, the goblins, and one extremely judgmental Cupcake Slime.

She opens a new manual.

Chapter One:
"If someone says 'What does this button do?', the answer is not 'science.'"

The goblins gasp.

Zuzu continues.

Chapter Two:
"Explosions are allowed only when everyone has goggles, snacks, and signed permission."

The Block-O-Matic whirs happily.

Together, Zuzu and Poplin install the first honest machine mode:

HELPFUL CHAOS
with a smaller button underneath:
ASK FIRST.
```

Result:

```text
Unlocks Zuzu true badge: badge_enthusiastic_safety
Goblin Workshop hub upgrade starts with one extra repair level
Counts toward Festival True Ending
```

---

### Route 4 — Nixie, The Frostbinder

#### Route ID

```text
route_nixie_frostbinder
```

#### Route Theme

```text
Staying calm does not mean freezing your feelings.
```

#### Personal Conflict

Nixie keeps everything under control by staying cool, but she avoids admitting how much the stolen gelato and chaotic festival hurt her. Her route is about calm honesty, not emotional ice walls.

#### Route Meter Names

```text
Affinity: Chill Trust
Insight: Melted Truth
Chaos Mercy: Gentle Thaw
```

#### Route True Ending Requirements

```text
- Complete at least 4 Nixie True Flags
- Clear 3 rooms without taking damage across the run
- Save 3 Ice Cream Crates in Stage 3
- Choose "Because you wanted to be invited, not obeyed."
```

#### Stage Story Beats

| Stage | Story Beat | Choice A — Normal Lean | Choice B — True Lean | Choice C — Risky Lean |
| ---: | --- | --- | --- | --- |
| 1 | Slimes try to turn cupcakes into ice cream sandwiches. | "Freeze the frosting trail." Slow enemies. | "Ask who taught them dessert science." Gain `nixie_flag_questioned_dessert_chaos`. | "Invent sewer sorbet." Heal, but slippery block chance. |
| 2 | Workshop fans blow warm air toward the pantry. | "Break the fans." Reduce speed wave. | "Redirect the airflow safely." Gain `nixie_flag_fixed_warm_airflow`. | "Make turbo snow." Gain frost power, board shake risk. |
| 3 | The Gelato Golem guards the stolen rainbow supply. | "Take the crates back." Gain boss advantage. | "Ask why it is guarding soup." Gain `nixie_flag_heard_gelato_golem`. | "Challenge it to a chill contest." Gain reward, freeze warning risk. |
| 4 | Pillow Castle offers Nixie the quietest room in Brixonia. | "Rest and recover." Heal. | "Invite others to rest too." Gain `nixie_flag_shared_quiet_room`. | "Freeze a pillow fort." Shield, Sleepy risk. |
| 5 | Arcade lights overwhelm Nixie. | "Dim the machine." Reduce preview disruption. | "Ask Lumi for help with the lights." Gain `nixie_flag_accepted_sparkle_help`. | "Turn neon into snow." Gain Fever, low visibility risk. |
| 6 | Bloxley praises Nixie for making neat frozen rectangles. | "Use his praise against him." Easier pattern. | "Tell him neat is not the same as kind." Gain `nixie_flag_rejected_cold_order`. | "Build an ice throne and immediately regret it." Extra royal ice blocks. |

#### Nixie Normal Ending — Rainbow Gelato Restored

Unlock condition:

```text
Defeat King Bloxley with Nixie
Complete fewer than 4 Nixie True Flags
```

Ending text:

```text
Nixie's Ice Cream Cart returns to the festival square.

The rainbow gelato is safe.
The freezer is fixed.
The popsicle bats are banned from taste testing.

Nixie serves the first scoop herself.

"Everything is back under control," she says.

Then the scoop sneezes.

Nixie sighs.

"Mostly."
```

Result:

```text
Unlocks Nixie route badge: badge_rainbow_gelato
Future runs start with one Snowcone item after Nixie is selected
```

#### Nixie True Ending — The Warmest Snow Day

Unlock condition:

```text
Defeat King Bloxley with Nixie
Complete 4+ Nixie True Flags
Save 3 Ice Cream Crates
Choose the empathetic final Bloxley dialogue
```

Ending text:

```text
Nixie returns the last ice cream crate to the cart.

Then she does something nobody expects.

She lets it melt a little.

The rainbow gelato softens into perfect festival swirls,
and the Frosty Pantry monsters line up with tiny bowls.

Nixie smiles.

"I thought staying calm meant keeping everything frozen."

She hands the Gelato Golem a spoon.

"But some things are better when they soften."

That afternoon, Brixonia holds its first Warm Snow Day.

Nobody understands the name.

Everyone asks for seconds.
```

Result:

```text
Unlocks Nixie true badge: badge_warm_snow_day
Freeze hazards show warnings one piece earlier in future runs
Counts toward Festival True Ending
```

---

### Route 5 — Bruk, The Snack Knight

#### Route ID

```text
route_bruk_snack_knight
```

#### Route Theme

```text
A knight protects people, not just the snack table.
```

#### Personal Conflict

Bruk defines his worth by guarding the food perfectly. His route teaches him that snacks matter because they bring people together, not because they are treasure to hoard.

#### Route Meter Names

```text
Affinity: Table Trust
Insight: Snack Purpose
Chaos Mercy: Shared Feast
```

#### Route True Ending Requirements

```text
- Complete at least 4 Bruk True Flags
- Collect 500 total gold across runs or during meta progress
- Keep 2 Pillow Castle Guards asleep in Stage 4
- Use a defensive item or shield spell to save yourself from overflow or lethal damage once
- Choose "Because you wanted to be invited, not obeyed."
```

#### Stage Story Beats

| Stage | Story Beat | Choice A — Normal Lean | Choice B — True Lean | Choice C — Risky Lean |
| ---: | --- | --- | --- | --- |
| 1 | Cupcake Slimes invade the snack reserve. | "Guard the reserve." Gain shield. | "Give them one snack and ask why they came." Gain `bruk_flag_shared_first_snack`. | "Eat the evidence." Heal, lose gold chance. |
| 2 | Goblins use chip bowls as machine parts. | "Recover the bowls." Gain gold. | "Trade bowls for safer parts." Gain `bruk_flag_traded_for_safety`. | "Wear a bowl as a helmet." Gain defense, funny Oopsie chance. |
| 3 | Frozen snacks are stuck behind ice blocks. | "Break the ice." Gain item. | "Thaw enough for everyone." Gain `bruk_flag_thawed_shared_snacks`. | "Declare ice chips a snack." Gain mana, Nixie judges silently. |
| 4 | Sleepy guards are supposed to protect sacred midnight snacks. | "Take over guard duty." Reduce boss attack. | "Let them sleep and set a quiet alarm." Gain `bruk_flag_protected_the_nap`. | "Whisper a snack oath too loudly." Wake one guard, gain reward. |
| 5 | Arcade prizes include a legendary potato chip trophy. | "Win the trophy." Gain relic. | "Use tickets to feed waiting kids." Gain `bruk_flag_chose_kids_over_trophy`. | "Challenge Hydra for snack rights." Higher reward, harder fight. |
| 6 | Bloxley wants snacks sorted by corner count. | "Sort them faster than him." Reduce royal check. | "Explain snacks are for sharing, not sorting." Gain `bruk_flag_snacks_are_for_sharing`. | "Bite the royal seal." It cracks; Bruk takes damage and smiles. |

#### Bruk Normal Ending — Snack Table Secured

Unlock condition:

```text
Defeat King Bloxley with Bruk
Complete fewer than 4 Bruk True Flags
```

Ending text:

```text
Bruk returns to the snack table at dawn.

The chips are stacked.
The cupcakes are counted.
The emergency pretzels are saluted.

He plants his lance beside the table.

"No snack left behind," he declares.

A Cupcake Slime slowly reaches for a cookie.

Bruk watches.

Then slides the cookie closer.

"One snack may advance with permission."
```

Result:

```text
Unlocks Bruk route badge: badge_snack_table_secured
Future Bruk runs begin with +1 shield
```

#### Bruk True Ending — The Great Shared Feast

Unlock condition:

```text
Defeat King Bloxley with Bruk
Complete 4+ Bruk True Flags
Keep 2 Pillow Castle Guards asleep
Choose the empathetic final Bloxley dialogue
```

Ending text:

```text
Bruk stands before the restored snack table.

For years, he thought guarding snacks meant keeping everyone away.

But the table looks wrong when nobody is laughing around it.

So he removes the velvet rope.

Cupcake Slimes get sprinkle bowls.
Goblin engineers get crunchy things that cannot explode.
Pillow guards get midnight cookies.
King Bloxley receives one square cracker and one round cake.

Bruk raises his shield.

"Today, I guard the feast by sharing it."

The festival cheers.

The snack table survives for almost six minutes.
A new record.
```

Result:

```text
Unlocks Bruk true badge: badge_great_shared_feast
Snack-based items appear more often in future shops
Counts toward Festival True Ending
```

---

### Route 6 — Lumi, The Star Witch

#### Route ID

```text
route_lumi_star_witch
```

#### Route Theme

```text
Everyone can have main character energy.
```

#### Personal Conflict

Lumi sees stories and sparkle everywhere, but she sometimes treats danger like a performance. Her route teaches her to share the spotlight and notice quieter forms of bravery.

#### Route Meter Names

```text
Affinity: Star Trust
Insight: Shared Spotlight
Chaos Mercy: Sparkle Kindness
```

#### Route True Ending Requirements

```text
- Complete at least 4 Lumi True Flags
- Trigger 10 cascade combos across runs before or during Lumi route
- Reach the Stage 5 combo score target
- Create or clear at least 3 Star Blocks in one run
- Choose "Because you wanted to be invited, not obeyed."
```

#### Stage Story Beats

| Stage | Story Beat | Choice A — Normal Lean | Choice B — True Lean | Choice C — Risky Lean |
| ---: | --- | --- | --- | --- |
| 1 | Lumi names a Sprinkle Block "Captain Sparklecrumb." | "Focus on the fight." Gain mana. | "Let Captain Sparklecrumb lead the way." Gain `lumi_flag_respected_small_star`. | "Give every block a dramatic title." Gain star block, lose time. |
| 2 | Workshop lights flicker like broken constellations. | "Fix the brightest lights." Reduce preview flash. | "Fix the tiny guide lights too." Gain `lumi_flag_fixed_small_lights`. | "Make the warning signs sparkle." Gain reward, goblins misread them. |
| 3 | Frozen reflections show Lumi as the only hero on stage. | "Accept the dramatic vision." Gain spell power. | "Look for everyone else in the reflection." Gain `lumi_flag_saw_party_reflection`. | "Pose dramatically on ice." Gain Fever, slip risk. |
| 4 | Pillow Castle wants a bedtime story. | "Tell a story about Lumi." Gain charm reward. | "Tell a story where the guards are heroes." Gain `lumi_flag_shared_bedtime_story`. | "Add fireworks to bedtime." Wake a guard, gain star effect. |
| 5 | High Score Hydra demands the flashiest combo. | "Outscore the Hydra." Gain boss advantage. | "Make the crowd cheer for every player." Gain `lumi_flag_shared_high_score`. | "Name each Hydra head after a genre." Harder but funnier boss. |
| 6 | Bloxley offers Lumi the role of Royal Star of the Square Stage. | "Take the title temporarily." Easier first phase. | "The whole festival is the stage." Gain `lumi_flag_everyone_gets_spotlight`. | "Ask for a cape made of neon tickets." Gain cosmetic flag, extra pattern. |

#### Lumi Normal Ending — Star Lantern Encore

Unlock condition:

```text
Defeat King Bloxley with Lumi
Complete fewer than 4 Lumi True Flags
```

Ending text:

```text
Lumi repairs the Star Lantern Stage with a sweep of her wand.

The lanterns rise.
The arcade lights sparkle.
The crowd cheers.

Lumi bows so deeply her hat falls over her face.

"Thank you," she says,
"to my stars, my blocks, and that purple rune with undeniable stage presence."

The purple rune blinks.

Nobody is sure how.
```

Result:

```text
Unlocks Lumi route badge: badge_star_lantern_encore
Future Lumi runs start with slightly higher Fever
```

#### Lumi True Ending — Main Character Energy For Everyone

Unlock condition:

```text
Defeat King Bloxley with Lumi
Complete 4+ Lumi True Flags
Reach Stage 5 combo score target
Choose the empathetic final Bloxley dialogue
```

Ending text:

```text
Lumi steps onto the Star Lantern Stage.

Then she steps aside.

The first spotlight lands on Milo.
The second on Pippa.
Then Nixie, Bruk, Zuzu, the Cupcake Slime King,
a nervous Crumb Goblin,
and one confused Royal Block Guard.

Lumi raises her wand.

"I thought stories needed one shining hero."

The lanterns float higher.

"But this festival is brighter when everyone gets a scene."

That night, every lantern contains a tiny memory from the dungeon:
a combo, a mistake, a shared snack, a square cake,
and a block that finally felt invited.
```

Result:

```text
Unlocks Lumi true badge: badge_everyone_gets_spotlight
Star blocks gain a subtle sparkle cosmetic in future runs
Counts toward Festival True Ending
```

---

### Optional Postgame Route — Professor Poplin

#### Route ID

```text
route_poplin_professor
```

#### Unlock Direction

```text
Unlock after first Festival Normal Ending
```

#### Route Theme

```text
An inventor is responsible for what the invention feels, not only what it does.
```

#### Personal Conflict

Poplin keeps treating the Block-O-Matic like a machine with settings, but the True Ending reveals it has needs, memories, and loneliness.

#### Route Structure

Poplin's route should be shorter than core hero routes unless expanded for DLC.

Recommended structure:

```text
- 3 major route scenes
- 1 final route scene
- Normal Ending
- True Ending
```

#### Poplin Normal Ending — Manual Reader At Last

```text
Professor Poplin finally reads the manual from cover to cover.

Then he writes a sticky note:

"Next time, read this before pressing anything."

He places the note directly over the Do Not Press button.

The button glows.

Poplin sweats.
```

#### Poplin True Ending — Co-Inventor Mode

```text
Poplin stops calling the Block-O-Matic "my invention."

He clears his throat.

"Our invention," he says.

The machine hums so loudly that three cupcakes rise into the air.

Together, Poplin and the Block-O-Matic build a new mode:

ASK ME WHAT I WANT TO MAKE.

It is the safest mode in the machine.

It is also the weirdest.
```

---

### Optional Friendship Route — Bloop, The Slime Friend

#### Route ID

```text
route_bloop_slime_friend
```

#### Unlock Direction

```text
Unlock after befriending enough slime monsters
```

#### Route Theme

```text
Small friends can change big messes.
```

#### Bloop Normal Ending — Bloop Gets A Hat

```text
Bloop helps save the festival.

Nobody understands exactly how.

But Bloop receives a tiny hat,
three sprinkles,
and the official title of Assistant Friend.

"Bloop," says Bloop.

The crowd agrees.
```

#### Bloop True Ending — The Slime Translation Club

```text
Bloop climbs onto the restored Cake Stall counter.

Milo listens.
Pippa squints.
The Cupcake Slime King wiggles politely.

For the first time, Brixonia holds a Slime Translation Club meeting.

The first translated sentence is:

"Please label frosting clearly."

The second is:

"Also, hats are snacks sometimes."

This explains a lot.
```

---

### Global Ending Matrix

| Selected Hero Ending | Festival Requirements Met? | Final Output |
| --- | --- | --- |
| Character route incomplete | No | Festival Normal Ending only |
| Character Normal Ending unlocked | No | Character Normal Ending + Festival Normal wrap-up |
| Character True Ending unlocked | No | Character True Ending |
| Character True Ending unlocked | Yes | Character True Ending + Festival True Ending epilogue |
| 3+ Character True Endings unlocked | Yes | Full Festival True Ending with expanded credits scene |
| All core Character True Endings unlocked | Yes | Grand Festival Epilogue / completion screen |

---

### Grand Festival Epilogue

Unlock condition:

```text
Unlock all six core Character True Endings
Unlock Festival True Ending
```

Ending text:

```text
One year later, the Festival of Falling Stars opens again.

This time, the Block-O-Matic 3000 is not hidden behind ropes.

It sits in the center of town square wearing a paper crown,
a safety ribbon,
and a sign that says:

ASK BEFORE PRESSING.

Milo leads the Plink-Plonk Parade.
Pippa judges the Great Slime Bake-Off.
Zuzu runs the Surprisingly Safe Gadget Booth.
Nixie hosts Warm Snow Day.
Bruk guards the Great Shared Feast by sharing it.
Lumi lights the Star Lantern Stage for everyone.

King Bloxley stands beside the cake table.

He looks at the round cakes.
He looks at the square cakes.
He takes one of each.

"Acceptable," he says.

The festival cheers.

The blocks fall.

The heroes stack.

And for once,
the chaos knows exactly where it belongs.
```

Result:

```text
Unlocks completion badge: badge_festival_of_falling_stars
Unlocks optional postgame challenge: Safe Dungeon Festival Mode
```

---

### Route Dialogue Node Format

Use this structure if implementing the route system in data.

```ts
type StoryRoute = {
  id: string;
  heroId: string;
  title: string;
  theme: string;
  normalEndingId: string;
  trueEndingId: string;
  requiredTrueFlags: number;
  routeFlags: string[];
  stageBeats: StoryStageBeat[];
};

type StoryStageBeat = {
  id: string;
  routeId: string;
  stageId: string;
  trigger: "stage_intro" | "event_room" | "boss_intro" | "stage_clear" | "final_boss_intro";
  speakerIds: string[];
  setupText: string;
  choices: DialogueChoice[];
};

type DialogueChoice = {
  id: string;
  label: string;
  tone: "direct" | "empathetic" | "risky";
  resultText: string;
  routeEffects: {
    affinity?: number;
    insight?: number;
    chaosMercy?: number;
    addTrueFlag?: string;
    addOopsieId?: string;
    addItemId?: string;
    modifyBoss?: string;
  };
};
```

---

### Example Implementable Dialogue Node

```json
{
  "id": "dlg_pippa_stage1_frosting_trail",
  "routeId": "route_pippa_pyromancer",
  "stageId": "stage_1_sprinkle_sewers",
  "trigger": "stage_intro",
  "speakerIds": ["hero_pippa_pyromancer", "mon_cupcake_slime"],
  "setupText": "Pippa finds a frosting trail leading deeper into the Sprinkle Sewers. A Cupcake Slime is wearing her emergency frosting like a tiny hat.",
  "choices": [
    {
      "id": "choice_pippa_take_frosting_back",
      "label": "Return the frosting. Now.",
      "tone": "direct",
      "resultText": "Pippa points her whisk like a sword. The slime squeaks and drops a frosting clue.",
      "routeEffects": {
        "affinity": 1,
        "modifyBoss": "boss_stage1_less_hp"
      }
    },
    {
      "id": "choice_pippa_taste_trail",
      "label": "Taste the frosting trail first.",
      "tone": "empathetic",
      "resultText": "Pippa notices the frosting has machine oil and sugar-rune dust. The slimes were following a broken recipe.",
      "routeEffects": {
        "affinity": 1,
        "insight": 2,
        "chaosMercy": 1,
        "addTrueFlag": "pippa_flag_found_recipe_misprint"
      }
    },
    {
      "id": "choice_pippa_bakeoff",
      "label": "Challenge the slime to a bake-off.",
      "tone": "risky",
      "resultText": "The slime accepts by vibrating dramatically. The room smells like victory and questionable frosting.",
      "routeEffects": {
        "addItemId": "item_mini_cupcake",
        "addOopsieId": "oops_sticky_floor"
      }
    }
  ]
}
```

---

### Content Files To Add Later

Recommended data files:

```text
src/game/content/story-routes/story-routes.json
src/game/content/dialogue/dialogue-milo-route.json
src/game/content/dialogue/dialogue-pippa-route.json
src/game/content/dialogue/dialogue-zuzu-route.json
src/game/content/dialogue/dialogue-nixie-route.json
src/game/content/dialogue/dialogue-bruk-route.json
src/game/content/dialogue/dialogue-lumi-route.json
src/game/content/endings/character-endings.json
src/game/content/endings/festival-endings.json
```

Save data additions:

```ts
type MetaProgress = {
  unlockedCharacterEndings: string[];
  unlockedTrueCharacterEndings: string[];
  unlockedFestivalEndings: string[];
  routeProgressByHero: Record<string, HeroRouteProgress>;
};
```

---

### Story Route Implementation Prompt

Use this prompt when ready to implement the route system in code.

```text
Read AGENT.md first and follow docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement the Blockmancer Dungeon story route system with per-hero character endings.

Goal:
Each playable hero should have a personal story route through the same Brixonia festival dungeon. Dialogue choices should affect route progress and determine whether the player unlocks that hero's Normal Ending or True Ending.

Use the same world, same six stages, same bosses, and same cheerful festival tone.

Implement these route IDs:
- route_milo_blockmancer
- route_pippa_pyromancer
- route_zuzu_goblin_engineer
- route_nixie_frostbinder
- route_bruk_snack_knight
- route_lumi_star_witch

Add optional placeholder support for:
- route_poplin_professor
- route_bloop_slime_friend

Required systems/content:
1. Add story route content data.
2. Add dialogue node content data.
3. Add ending definition content data.
4. Add route progress state to current run and meta save.
5. Add dialogue choice resolution.
6. Track affinity, insight, chaosMercy, completed stage beats, and true flags.
7. Show route dialogue at stage intros, key events, boss intros, stage clears, and final boss intro.
8. After King Bloxley, resolve Character Normal Ending or Character True Ending.
9. If global requirements are met, play Festival True Ending epilogue after the character true ending.
10. Make dialogue skippable and mobile-readable.

Acceptance criteria:
- Starting a run with a hero assigns the correct route.
- Each stage can trigger one route dialogue beat.
- Dialogue choices update route progress.
- Normal Ending triggers when the route is completed but true requirements are not met.
- True Ending triggers when enough true flags and route requirements are met.
- Festival True Ending can play after a Character True Ending.
- Endings persist in meta progress.
- Missing dialogue/endings fall back safely.
- Player-facing text remains cheerful, cute, and non-dark.
- npm run validate:content passes.
- npm run build passes.

Finish with:
Summary / Files changed / Route data added / Save fields added / Commands run / Manual test steps / Known limitations.
```

---

### Route QA Checklist

Use this checklist to verify story routes.

```text
[ ] Start a Milo run and confirm route_milo_blockmancer is active.
[ ] Trigger Stage 1 Milo dialogue.
[ ] Select Direct choice and confirm Normal route progress increases.
[ ] Select Empathetic choice and confirm True Flag is added.
[ ] Select Risky choice and confirm reward/Oopsie behavior works.
[ ] Defeat Stage 1 boss and confirm route stage beat is saved.
[ ] Complete a run with insufficient True Flags and confirm Character Normal Ending.
[ ] Complete a run with 4+ True Flags and final empathetic choice and confirm Character True Ending.
[ ] Unlock at least 3 Character True Endings and confirm Festival True Ending epilogue condition.
[ ] Confirm endings persist after refresh.
[ ] Confirm missing dialogue node uses fallback text instead of crashing.
[ ] Confirm dialogue is readable in portrait mobile layout.
```

---

### Final Story Design Note

The route structure should keep the game replayable without making the first clear feel incomplete.

Recommended player experience:

```text
First clear:
"I saved the festival!"

Second/third hero clear:
"I saw another side of the same festival disaster."

True route clear:
"I understand why this hero matters."

Festival True Ending:
"The whole world makes emotional sense now."
```

Main writing rule:

> Every route should solve a personal problem and a festival problem at the same time.

<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_START -->
## 2026-06-02 Feature Update — Fever Showtime Story and Microcopy

### Narrative Purpose

Fever Showtime should feel like a cheerful arcade-festival spotlight moment, not a dark rage mode or emergency cheat.

Preferred flavor:

```text
Showtime
stage lights
festival beat
arcade sparkle
charged lines
grand cascade
messy but safe pressure
Boss Drama Guard
```

Avoid:

```text
rage
curse
doom
blood
corruption
execution
instant kill
```

### Core Player-Facing Terms

| System Term | Player-Facing Term |
| --- | --- |
| Fever active | Showtime |
| completed Fever row | Charged Line |
| Fever release | Showtime Release |
| boss damage cap | Boss Drama Guard |
| overflow damage | Showtime Overflow |
| Fever pressure conversion | Showtime Pressure |
| Soft Junk | Soft Junk |
| Fever Heat | Fever Heat / Showtime Heat |
| messy high-Heat release | Messy Showtime Release |

### Event Log Message Pool

Use short, mobile-readable lines:

```text
Showtime is ready!
Fever Showtime begins!
Showtime line charged!
Charged Lines: {current}/{max}
Release when the stage feels right!
Showtime released!
The final beat has arrived!
The stage is full of charged lines!
Cascade Showtime!
Showtime fizzled safely.
Fever Heat is rising!
Messy Showtime release!
Soft Junk splashed onto the board!
Soft Junk cleared safely!
Soft Junk became delayed junk!
Showtime Overflow became shield!
Showtime Overflow sparkled into mana!
Showtime Overflow cleared a hazard!
Showtime Overflow delayed the boss!
Boss Drama Guard softened the burst!
The boss holds the stage for the next act!
Star Encore placed a star block!
Safety Confetti cleared a hazard!
Showtime state repaired safely.
```

### Stage 5 — Starfall Arcade Updated Hazard Note

Replace generic Fever references with:

```text
Hazard note: Showtime rewards elegant setup. During Fever, completed lines become Charged Lines. Release them carefully for a grand cascade, but greedy stacking can raise Fever Heat.
```

### Stage 5 Goal Result Clarification

For **Reach Combo Score Target**:

```text
Success Result: player starts the boss with partial Fever meter or Fever Ready state.
Failure Result: Hydra adds one extra score demand; never an instant-loss state.
```

The success reward must not imply that Charged Lines or a prepared board carry into the boss.

### High Score Hydra Updated Boss Rule Card

- **Title:** Showtime Score Rush
- **Boss:** High Score Hydra
- **Rule:** This battle emphasizes Fever Showtime, cascade challenges, score callouts, preview disruption, and safe pressure conversion.
- **Player Tip:** Build clean Charged Lines, release before Fever Heat gets messy, and let Cascade Gravity do the applause.
- **Fairness Note:** The Hydra may pressure the board during Showtime, but pressure scales by board danger. Unsafe pressure becomes Soft Junk, Fever Heat, delayed pressure, or boss advantage instead of an unavoidable instant loss.
- **Boss Drama Guard Note:** A single Showtime burst can push the Hydra to the next act, but it cannot skip the whole performance.

### High Score Hydra Intro Addendum

Suggested extra lines:

- **Festival Announcer:** "The arcade lights dim, the score bells wake, and Showtime rules are now in effect."
- **High Score Hydra:** "Stack your applause, little Blockmancer. I count every cascade."
- **Block-O-Matic 3000:** "Showtime advisory: charged rows are dramatic, but drama still requires safety rails."
- **Hero:** "Then we will release the stage lights at exactly the right beat."

### Boss Drama Guard Microcopy

When Fever release is capped:

```text
Boss Drama Guard softened the burst!
The boss holds the stage for the next act!
Showtime burst reached the boss cap!
```

Tone rule:

```text
Explain the cap as theatrical structure, not punishment.
```

### Fever Upgrade Microcopy

| Upgrade | Trigger Text |
| --- | --- |
| Festival Hype | Festival Hype filled the meter faster! |
| Longer Showtime | Longer Showtime adds one more beat! |
| Bigger Stage | Bigger Stage can hold more charged lines! |
| Graceful Release | Graceful Release grants shield! |
| Safety Confetti | Safety Confetti cleared a hazard! |
| Showtime Overflow | Showtime Overflow sparkled into extra utility! |
| Star Encore | Star Encore placed a star block! |

### Route Integration Notes

Route rewards may mention Fever only when supported by real gameplay effects.

Examples:

- Milo true route may improve warning clarity or first-cascade Fever gain.
- Lumi true route may add star/Fever guidance.
- Zuzu risky route may add gadget pressure during Fever, but must remain fair.
- Bruk route rewards may convert Showtime Overflow into shield.
- Pippa may help clear sticky/junk during Showtime release.
- Nixie may reduce Fever Heat or slow pressure if supported.

No route dialogue should promise Charged Lines carrying into a boss or between nodes.
<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_END -->
