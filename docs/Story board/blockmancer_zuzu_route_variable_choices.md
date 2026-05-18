# Blockmancer Dungeon — Zuzu Route Dialogue & Storyboard
## Variable Choice Label Pass — Zuzu Draft

**Document purpose:**  
This file prepares **Zuzu the Goblin Engineer** as the next full character-route example after Milo and Pippa.

The goal is to give Zuzu her own unmistakable speaking pattern, stage-specific story build-up, variable choice labels, route flags, gameplay consequences, and Normal / True Ending structure.

Zuzu should **not** sound like Milo with tool words added, and she should **not** sound like Pippa with explosions added.  
She is quick, brilliant, overconfident, mechanically curious, and secretly more responsible than she first admits.

This route keeps the same cheerful Brixonia festival world, six-stage structure, Cascade Gravity gameplay identity, mobile-readable dialogue rules, and happy festival atmosphere.

---

# 1. Zuzu Voice Bible

## 1.1 Core Voice

Zuzu is a goblin engineer and former intern for Professor Poplin. She insists she did not break the Block-O-Matic 3000. She merely gave several systems “opportunities for energetic self-expression.”

She speaks like someone who has already built the solution, the backup solution, the unsafe backup solution, and a tiny commemorative button labeled **Probably Fine**.

Zuzu is not only “chaos goblin.”  
Her real route is about the difference between invention and responsibility.

At the start of her route, Zuzu treats every accident as useful data.  
By the end of her route, she learns that useful data is not enough if nobody consented to be part of the experiment.

### Zuzu speaks with:

- fast, compact technical logic;
- confident declarations that are almost too precise;
- phrases like **hypothesis**, **calibration**, **field test**, **load-bearing**, **safety margin**, **prototype**, **appendix**, **unscheduled feature**, **documented anomaly**, **ethically questionable**, **technically beautiful**, **minor combustion**, and **acceptable wobble**;
- numbered thoughts when nervous;
- cheerful goblin engineering pride;
- sudden sincerity when admitting fault;
- comedy through over-formal safety language applied to silly festival problems.

### Zuzu avoids:

- Milo’s soft listening language;
- Pippa’s kitchen warmth and baking metaphors;
- Nixie’s calm slow phrasing;
- Bruk’s oath and table language;
- Lumi’s dreamy star poetry;
- internet-style sarcasm, meme language, or “lol chaos” jokes.

### Example Zuzu line style

```text
Zuzu: "Correction: I did not break the frosting pipe. I improved its enthusiasm beyond the pipe's emotional capacity. Different category. Still wet, yes."
```

```text
Zuzu: "Observed problem: the machine is obeying a bad instruction perfectly. That is the worst kind of working."
```

```text
Zuzu: "Fine. New rule. If a device can affect the festival, the festival gets to read the label before I press the button."
```

```text
Zuzu: "This clamp is technically elegant, structurally unnecessary, and morally about as sturdy as soggy confetti. I hate that I admire it."
```

---

## 1.2 Zuzu Choice Philosophy

Every Zuzu choice should feel like an engineering decision under festival pressure.

| Route Lean | Meaning | Zuzu Behavior |
| --- | --- | --- |
| Practical / Normal | Stabilize the machine and prevent immediate disaster. | Zuzu repairs, clamps, rewires, vents pressure, and earns practical progress. |
| True / Accountability | Understand who was affected and correct the design principle, not only the fault. | Zuzu documents, admits, asks, labels, shares, or redesigns with care. |
| Risky / Overclock | Attempt a brilliant experimental shortcut. | Zuzu creates powerful results with a chance of Oopsie, junk, board shake, or volatile reward. |

## 1.3 Choice Label Rules

Choice labels should be short, stage-specific, and unmistakably Zuzu.

Bad repeated labels:

```text
Make the board safe first
Listen beneath the hazard
Trust the rhythm
```

Better Zuzu labels:

```text
Tighten the Sprinkle Valve
Open the Intern Ledger
Reverse the Snowcone Polarity
Issue a Quiet Warranty
Share the Score Formula
Invalidate the Clamp Patent
```

Each Zuzu label should be:

- 2–6 words;
- readable on mobile;
- linked to the current stage hazard;
- technical but still playful;
- specific enough that it would not fit Milo, Pippa, Nixie, Bruk, or Lumi.

---

# 2. Route Variables

## 2.1 Route Scores

```ts
type ZuzuRouteState = {
  zuzuPatchwork: number;       // practical repair, Normal route stability
  zuzuAccountability: number;  // true repair ethics, True route progress
  zuzuOverclock: number;       // risky invention, optional variant rewards
  zuzuFlags: string[];
};
```

## 2.2 True Route Flags

| Stage | Flag | Meaning |
| ---: | --- | --- |
| 1 | `zuzu_flag_logged_sprinkle_pressure_fault` | Zuzu discovers one of her old quick patches worsened the Sprinkle Sewers pressure loop. |
| 2 | `zuzu_flag_admitted_prototype_override` | Zuzu admits Prototype No. 7 used her temporary override without proper safeguards. |
| 3 | `zuzu_flag_wrote_thaw_protocol` | Zuzu learns the frozen systems need a careful protocol, not a dramatic heat reversal. |
| 4 | `zuzu_flag_quieted_alarm_with_consent` | Zuzu fixes a pillow alarm system without startling the sleeping castle residents. |
| 5 | `zuzu_flag_open_sourced_score_formula` | Zuzu shares the arcade scoring logic so the game becomes fair again. |
| 6 | `zuzu_flag_invalidated_royal_clamp_design` | Zuzu recognizes that Bloxley’s palace uses her clamp design and publicly releases the safe counter-design. |

## 2.3 Ending Conditions

### Zuzu Normal Ending

Unlock if:

```text
Defeat King Bloxley as Zuzu
AND zuzuAccountability < 5
```

or:

```text
Defeat King Bloxley as Zuzu
AND fewer than 5 Zuzu true-route flags collected
```

### Zuzu True Ending

Unlock if:

```text
Defeat King Bloxley as Zuzu
AND collect at least 5 Zuzu true-route flags
AND zuzuAccountability >= 5
```

Optional stronger version:

```text
All 6 Zuzu true-route flags collected
```

### Festival Overclock Variant

If:

```text
zuzuOverclock >= 3
```

then add a small bonus scene after either ending where Zuzu performs the first officially approved **Festival Overclock Demonstration**: three fireworks, two self-folding banners, one spring-loaded cupcake tray, and zero actual injuries.

---

# 3. Route Overview

Zuzu’s route begins with denial.

She did not break the Block-O-Matic 3000.  
She tested it enthusiastically.  
Several systems responded with unexpected sincerity.

At first, Zuzu treats the dungeon as the world’s best machine audit. Every monster is data. Every hazard is a clue. Every explosion is either a mistake or a promising draft.

Stage by stage, she discovers that many of the dungeon’s problems were made worse by old shortcuts, unfinished labels, temporary overrides, and clever devices she once left behind.

Her growth is not about becoming less inventive.  
It is about becoming the kind of inventor whose work can safely join a festival.

1. **Sprinkle Sewers** — pressure.
2. **Goblin Workshop** — admission.
3. **Frosty Pantry** — protocol.
4. **Pillow Castle** — consent.
5. **Starfall Arcade** — transparency.
6. **Bloxley’s Block Palace** — responsibility.

Normal route Zuzu becomes Brixonia’s official emergency mechanic, famous for stopping disasters quickly and labeling her gadgets slightly better than before.

True route Zuzu becomes the founder of the **Public Test Garden**, where every invention must have a readable label, a safety margin, and a button children are actually allowed to press.

---

# 4. Shared Zuzu Route UI Notes

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
Short preview text
Route lean icon
Optional hazard/reward preview
```

Example:

```text
[True / Accountability]
Open the Intern Ledger
"Find the original note before touching the machine."
```

## 4.3 Zuzu Route Result Terms

Use these result labels in UI or debug logs:

```text
+1 Patchwork
+1 Accountability
+1 Overclock
Grant Flag: zuzu_flag_...
Add Oopsie Chance
Add Gadget Reward Chance
```

---

# 5. Zuzu Route Scene Summary Table

| Scene ID | Stage | Practical Choice | True Choice | Risky Choice | True Flag |
| --- | ---: | --- | --- | --- | --- |
| `SCN_ZUZU_01` | 1 | Tighten the Sprinkle Valve | Log the Pressure Fault | Overclock the Candy Pump | `zuzu_flag_logged_sprinkle_pressure_fault` |
| `SCN_ZUZU_02` | 2 | Clamp the Rattle Belt | Open the Intern Ledger | Boot Prototype No. 7½ | `zuzu_flag_admitted_prototype_override` |
| `SCN_ZUZU_03` | 3 | Rewire the Thaw Relay | Write the Thaw Protocol | Reverse Snowcone Polarity | `zuzu_flag_wrote_thaw_protocol` |
| `SCN_ZUZU_04` | 4 | Muffle the Gearbox | Issue a Quiet Warranty | Launch the Pillow Spring | `zuzu_flag_quieted_alarm_with_consent` |
| `SCN_ZUZU_05` | 5 | Cap the Prize Multiplier | Share the Score Formula | Run the Jackpot Spiral | `zuzu_flag_open_sourced_score_formula` |
| `SCN_ZUZU_06` | 6 | Unscrew the Royal Brackets | Invalidate the Clamp Patent | Detonate Corner Theory | `zuzu_flag_invalidated_royal_clamp_design` |

---

# 6. Full Route Scenes

---

## SCN_ZUZU_01 — Zuzu Route Scene in Sprinkle Sewers

**Trigger:** First route event in Sprinkle Sewers while playing Zuzu.  
**Location:** Sprinkle Sewers.  
**Story Beat:** A frosting pressure valve bears Zuzu’s old initials and is making the sewer’s sprinkle current dangerously eager.  
**Route Flag Opportunity:** `zuzu_flag_logged_sprinkle_pressure_fault` through Choice B.

### Storyboard Panels

1. The party enters a bright candy sewer tunnel where frosting pipes cross over rainbow water channels.
2. A brass pressure valve bounces in place, puffing sugar steam in polite little bursts.
3. Zuzu spots a scratched goblin maker’s mark on the valve: **Z.Z. — temporary, probably**.
4. Sticky blocks begin appearing near the preview panel while sprinkle blocks glow too brightly.
5. Bloop wears a tiny paper warning tag that reads **DO NOT OVER-SPRINKLE**.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Zuzu: "Interesting. Terrible, but interesting. That valve is venting frosting at parade strength inside a sewer-rated pipe. Bold plumbing. Questionable citizenship."

Professor Poplin: "Zuzu, is that your handwriting on the warning label?"

Zuzu: "No. Maybe. It is my emergency handwriting. That version of me had limited supervision and excellent confidence."

Block-O-Matic 3000: "Observed complication: sprinkle pressure exceeds festival merriment tolerance by forty-two percent. Sticky escalation probable."

Bloop: "Bloop. Too sweet. Floor very clingy."

Zuzu: "Good news: I know exactly how this broke. Bad news: because I may have taught it."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Tighten the Sprinkle Valve`  
**Player Line:**

```text
Zuzu: "First repair rule: stop the part currently screaming. I will tighten the valve, vent the sugar steam, and pretend the initials are historical graffiti."
```

**NPC Response:**

```text
Professor Poplin: "A sensible repair, despite the alarming amount of pretending."
```

**Narration:**  
Zuzu clamps the valve with three quick turns and one unnecessary flourish. The sticky pressure drops, the sprinkle glow steadies, and the sewer becomes less like a dessert trap.

**Gameplay Result:**  
Reduce sticky block spawn rate for the next battle. Add one `block_toolbox` or small gadget reward chance.

**Route Result:**  
`+1 zuzuPatchwork`; leans toward Normal Ending.

---

#### B. True Lean / Accountability

**Choice Label:** `Log the Pressure Fault`  
**Player Line:**

```text
Zuzu: "No clamping yet. I need the original fault. If my patch caused this, the repair must say so in ink big enough for future goblins to resent."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Documentation request accepted. Previous note found: temporary sugar-flow shortcut. Expiration date: yesterday, three festivals ago."
```

**Narration:**  
Zuzu reads the old maintenance note instead of hiding it. The valve did not fail from malice. It obeyed a shortcut long after the shortcut should have been removed.

**Gameplay Result:**  
Sticky hazards show a one-piece warning before hardening for the next two rooms.

**Grant Flag:**  
`zuzu_flag_logged_sprinkle_pressure_fault`

**Route Result:**  
`+1 zuzuAccountability`; contributes to True Ending.

---

#### C. Risky Lean / Overclock

**Choice Label:** `Overclock the Candy Pump`  
**Player Line:**

```text
Zuzu: "Alternative proposal: increase pressure briefly, route the excess through a controlled sparkle burst, and harvest the resulting candy kinetic optimism."
```

**NPC Response:**

```text
Bloop: "Bloop?"

Professor Poplin: "That was either a plan or a confession."
```

**Narration:**  
Zuzu overclocks the candy pump. A beautiful ribbon of sprinkle light arcs across the board, clearing several sticky patches before the tunnel hiccups out a fresh glob of frosting.

**Gameplay Result:**  
Gain a rare candy/gadget reward; 25% chance to add `oops_sticky_floor` or spawn extra sticky blocks in the next fight.

**Route Result:**  
`+1 zuzuOverclock`; may open bonus gadget bark or altered boss state.

### Post-Choice Battle Bark Pool

```text
Zuzu: "Valve pressure normalized. Mostly. Do not lick the gauge."
Zuzu: "If it sticks, it is not stuck. It is awaiting tool-based persuasion."
Zuzu: "Sprinkle flow now within legal joy limits. Probably."
Block-O-Matic 3000: "Route response archived. Sugar pressure recalibrated. Liability ribbon updated."
Festival Announcer: "Choice recorded. Please applaud at a safe distance from the frosting valve."
```

### Victory Callback

```text
Zuzu: "Sewer stable. Initials unexploded. Personal growth not yet confirmed, but the graph is trending."
```

### Boss Callback — Cupcake Slime King

If true flag collected:

```text
Zuzu: "The slimes were following pressure, not orders. Fix the valve, calm the frosting, reduce slime enthusiasm. Beautiful chain. Slightly embarrassing chain."
```

---

## SCN_ZUZU_02 — Zuzu Route Scene in Goblin Workshop

**Trigger:** First route event in Goblin Workshop while playing Zuzu.  
**Location:** Goblin Workshop.  
**Story Beat:** Zuzu returns to her old intern bench and finds Prototype No. 7 running on a temporary override she never removed.  
**Route Flag Opportunity:** `zuzu_flag_admitted_prototype_override` through Choice B.

### Storyboard Panels

1. Conveyor belts carry toy bombs, springs, brass bolts, and cupcakes wearing safety goggles.
2. A corner workbench has a crooked plaque: **Zuzu — Intern, Temporary Genius**.
3. Prototype No. 7’s old blueprint flutters beside a blinking red lever.
4. The board preview jitters. Junk blocks line up in the warning tray.
5. A tiny machine prints a receipt reading **OVERRIDE STILL ACTIVE**.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Zuzu: "Ah. My bench. My beloved terrible bench. Observe the scorch marks: each one represents learning, courage, or insufficient ventilation."

Professor Poplin: "Prototype No. 7 appears to be using your old override circuit."

Zuzu: "Impossible. That circuit was temporary."

Block-O-Matic 3000: "Clarification: temporary override has operated continuously for two years, eleven months, six days, and one dramatic afternoon."

Zuzu: "That is... a very committed temporary."

Bloop: "Bloop. Machine still wearing old hat."

Zuzu: "Fine. Hypothesis: if I admit the override exists, the room becomes less smug."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Clamp the Rattle Belt`  
**Player Line:**

```text
Zuzu: "Contain first, confess later. I will clamp the rattle belt before it donates junk blocks to every available column."
```

**NPC Response:**

```text
Professor Poplin: "A direct fix. I approve of the direction, if not the clamping noises."
```

**Narration:**  
Zuzu slaps a polished clamp onto the conveyor belt. The junk queue slows, the bombs stop rolling into snack baskets, and the workshop becomes almost civilized.

**Gameplay Result:**  
Incoming junk queue delay increases by one piece for the next battle. Bomb blocks become slightly more likely to appear as player-helpful blocks.

**Route Result:**  
`+1 zuzuPatchwork`; leans toward Normal Ending.

---

#### B. True Lean / Accountability

**Choice Label:** `Open the Intern Ledger`  
**Player Line:**

```text
Zuzu: "No more heroic wrenching until I read the ledger. If my name is in the fault chain, the repair begins there."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Ledger opened. Entry found: override installed by Zuzu to save festival rehearsal. Review note: remove before final celebration. Removal status: not removed."
```

**Narration:**  
The workshop quiets around the ledger. Zuzu does not joke for three whole seconds, which in goblin engineering time is practically a public ceremony.

**Gameplay Result:**  
Workshop machines pause one tick before spawning junk for the next two rooms. Prototype-related hazards display clearer warning text.

**Grant Flag:**  
`zuzu_flag_admitted_prototype_override`

**Route Result:**  
`+1 zuzuAccountability`; contributes to True Ending.

---

#### C. Risky Lean / Overclock

**Choice Label:** `Boot Prototype No. 7½`  
**Player Line:**

```text
Zuzu: "Counterproposal: we launch a smaller, friendlier, legally distinct prototype to argue with the first one. Machines respect peer review."
```

**NPC Response:**

```text
Professor Poplin: "Machines do not respect peer review."

Zuzu: "Not with that attitude, Professor."
```

**Narration:**  
Zuzu boots a tiny helper prototype with a banner that reads **Version 7½: Less Certain, More Polite**. It redirects several junk blocks, then sneezes a spring into the hold queue.

**Gameplay Result:**  
Gain a rare gadget reward or temporary bomb-block boost; 25% chance to add `oops_overexcited_machine` or an extra board shake in the next fight.

**Route Result:**  
`+1 zuzuOverclock`; may alter Prototype No. 7 boss intro.

### Post-Choice Battle Bark Pool

```text
Zuzu: "Workshop rule: if it rattles, it either needs oil, praise, or a firmer threat."
Zuzu: "Incoming junk has entered the snack tray. Rude, but beautifully queued."
Zuzu: "Bomb block deployed. Stand near confidence, away from eyebrows."
Block-O-Matic 3000: "Route response archived. Goblin override variance preserved."
Festival Announcer: "Choice recorded. The workshop requests applause, ear protection, and a small insurance form."
```

### Victory Callback

```text
Zuzu: "Prototype behavior reduced from catastrophic to educational. That is a real category. I checked."
```

### Boss Callback — Prototype No. 7

If true flag collected:

```text
Zuzu: "No more blaming the machine. I left the override in. Prototype, you were loud because I forgot to finish listening."
```

---

## SCN_ZUZU_03 — Zuzu Route Scene in Frosty Pantry

**Trigger:** First route event in Frosty Pantry while playing Zuzu.  
**Location:** Frosty Pantry.  
**Story Beat:** Zuzu discovers that an old heat-reversal gadget is making the freezer alternate between gentle chill and dramatic block-freezing panic.  
**Route Flag Opportunity:** `zuzu_flag_wrote_thaw_protocol` through Choice B.

### Storyboard Panels

1. The Frosty Pantry glitters with rainbow gelato shelves and frosted rune blocks.
2. A copper coil hums inside an icebox labeled **Thermal Correction Device — Do Not Hug**.
3. The active piece briefly freezes, then drops too quickly after thawing.
4. Zuzu recognizes the coil’s wiring as her own “quick thaw” design.
5. Nixie’s cart bell rings faintly in the distance, worried but polite.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Zuzu: "This pantry is not cold. It is negotiating with several temperatures at once and losing the minutes."

Nixie: "Zuzu, why does my freezer have a copper coil wearing goggles?"

Zuzu: "Because bare coils lack confidence. Also because I may have improved your thaw speed during last year's pudding emergency."

Block-O-Matic 3000: "Observed complication: heat-reversal device causes freeze spikes and speed waves. Snack preservation index declining."

Bloop: "Bloop. Ice says too fast. Then too faster."

Zuzu: "Machines, desserts, and feelings all dislike abrupt polarity reversal. Noted reluctantly."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Rewire the Thaw Relay`  
**Player Line:**

```text
Zuzu: "I will reroute the thaw relay through the slow coil. Less dramatic, fewer frozen knuckles, acceptable loss of spectacle."
```

**NPC Response:**

```text
Nixie: "A careful thaw is still a thaw. Thank you."
```

**Narration:**  
Zuzu rewires the relay with quick, nimble hands. The freezer hum lowers into a steadier note, and the board stops lunging between frozen and frantic.

**Gameplay Result:**  
Reduce one freeze hazard duration or speed-wave severity in the next Frosty Pantry battle.

**Route Result:**  
`+1 zuzuPatchwork`; leans toward Normal Ending.

---

#### B. True Lean / Accountability

**Choice Label:** `Write the Thaw Protocol`  
**Player Line:**

```text
Zuzu: "No more mystery knobs. I will write the protocol first: warm slowly, check the gelato, ask the cart owner, then touch wires. In that order. Painful but advanced."
```

**NPC Response:**

```text
Nixie: "That order sounds peaceful. I like peaceful machinery."
```

**Narration:**  
Zuzu writes a proper thaw protocol on a freezer card. The device does not become less clever. It becomes kinder.

**Gameplay Result:**  
Freeze warning windows expand once per Frosty Pantry room. Ice hazards display clearer counter hints.

**Grant Flag:**  
`zuzu_flag_wrote_thaw_protocol`

**Route Result:**  
`+1 zuzuAccountability`; contributes to True Ending.

---

#### C. Risky Lean / Overclock

**Choice Label:** `Reverse Snowcone Polarity`  
**Player Line:**

```text
Zuzu: "Or we reverse polarity, convert panic frost into useful snowcone pressure, and accept the small possibility of aggressive dessert weather."
```

**NPC Response:**

```text
Nixie: "Define small."

Zuzu: "Small for goblins. Medium for furniture."
```

**Narration:**  
Zuzu flips the polarity. Frost pops into glittering snowcone sparks, clearing several ice blocks before the pantry exhales a gust that makes the next piece wobble.

**Gameplay Result:**  
Gain a frost/gadget themed reward; 25% chance to trigger a brief speed wave or add `oops_slippery_buttons`.

**Route Result:**  
`+1 zuzuOverclock`; may open bonus bark with Nixie.

### Post-Choice Battle Bark Pool

```text
Zuzu: "Thermal variance corrected. Do not applaud near the coil; it gets ideas."
Zuzu: "Freeze warning detected. Good. A machine that warns you is already apologizing."
Zuzu: "If the ice slides, negotiate with the bottom row."
Block-O-Matic 3000: "Route response archived. Pantry thermal ethics updated."
Festival Announcer: "Choice recorded. Please enjoy the freezer's new commitment to manners."
```

### Victory Callback

```text
Zuzu: "Pantry stable. Gelato survivability improved. My wires are learning social skills."
```

### Boss Callback — Gelato Golem

If true flag collected:

```text
Zuzu: "Big frozen friend, I brought a protocol this time. No surprise thawing. No mystery levers. Just slow repair and maybe one respectful gadget."
```

---

## SCN_ZUZU_04 — Zuzu Route Scene in Pillow Castle

**Trigger:** First route event in Pillow Castle while playing Zuzu.  
**Location:** Pillow Castle.  
**Story Beat:** A toy alarm system Zuzu once designed is startling the castle guards awake, causing Sleepy effects, shielded enemies, and soft-block tangles.  
**Route Flag Opportunity:** `zuzu_flag_quieted_alarm_with_consent` through Choice B.

### Storyboard Panels

1. The party enters a hallway of quilted banners, button shields, and plush guard posts.
2. A small clockwork rooster tiptoes across a pillow ramp, then honks directly into a sleeping knight’s helmet.
3. Zuzu recognizes the alarm’s springwork: **WakeMaster Mini — prototype sleep-respect pending**.
4. Soft blocks drift down like folded blankets, and shield icons appear over sleepy enemies.
5. Bruk puts a finger to his helmet and shushes the entire corridor.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Bruk: "Engineer Zuzu. Why is a rooster made of brass declaring battle inside a nap corridor?"

Zuzu: "Because silent alarms underperformed in trials. Nobody woke up, which was rude to the data."

Block-O-Matic 3000: "Observed complication: WakeMaster Mini triggers defensive pillow formations and Sleepy backlash. Comfort index unstable."

Bloop: "Bloop. Honk too sharp. Blanket sad."

Zuzu: "Right. New information: sleeping people do not enjoy being converted into test participants by surprise poultry."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Muffle the Gearbox`  
**Player Line:**

```text
Zuzu: "I will pad the gearbox, soften the spring, and reduce honk output to a dignified peep. Mechanical mercy by felt washer."
```

**NPC Response:**

```text
Bruk: "A peep is more honorable than a honk at dawn."
```

**Narration:**  
Zuzu tucks a felt washer into the alarm’s gearbox. The rooster still marches, but now it sounds like a teaspoon tapping a pillow.

**Gameplay Result:**  
Reduce Sleepy duration or soften the next shielded enemy’s opening defense.

**Route Result:**  
`+1 zuzuPatchwork`; leans toward Normal Ending.

---

#### B. True Lean / Accountability

**Choice Label:** `Issue a Quiet Warranty`  
**Player Line:**

```text
Zuzu: "No more unrequested wake-up technology. I will mark the device: ask first, ring gently, include snooze, respect pillows."
```

**NPC Response:**

```text
Bruk: "A warranty that protects rest is a worthy document."
```

**Narration:**  
Zuzu writes a quiet warranty on a tiny tag and ties it to the clockwork rooster. The castle accepts the promise. Even the soft blocks fall more gently.

**Gameplay Result:**  
The next Sleepy warning appears earlier. Soft blocks gain a small chance to settle safely instead of tangling.

**Grant Flag:**  
`zuzu_flag_quieted_alarm_with_consent`

**Route Result:**  
`+1 zuzuAccountability`; contributes to True Ending.

---

#### C. Risky Lean / Overclock

**Choice Label:** `Launch the Pillow Spring`  
**Player Line:**

```text
Zuzu: "Or we redirect the alarm spring into a pillow-launch assist. It clears space, boosts morale, and only mildly violates ceiling expectations."
```

**NPC Response:**

```text
Bruk: "I request that no pillows be dishonored."

Zuzu: "They will fly with excellent posture."
```

**Narration:**  
Zuzu launches the pillow spring. A soft burst clears a cluster of blocks, then drops a fluffy hazard into the corner with suspicious cheer.

**Gameplay Result:**  
Clear a small cluster or gain shield; 25% chance to add `oops_too_much_confetti` or spawn a soft-block tangle.

**Route Result:**  
`+1 zuzuOverclock`; may open bonus bark with Bruk.

### Post-Choice Battle Bark Pool

```text
Zuzu: "Alarm output reduced from rude to conversational."
Zuzu: "Soft block incoming. Treat it like machinery wearing pajamas."
Zuzu: "Shielded enemy detected. Apply patience, then a calibrated thump."
Block-O-Matic 3000: "Route response archived. Pillow compliance improved."
Festival Announcer: "Choice recorded. The castle applauds by not waking up."
```

### Victory Callback

```text
Zuzu: "Pillow Castle stable. Honk index humane. I am adding that to my résumé."
```

### Boss Callback — Sir Snore-a-Lot

If true flag collected:

```text
Zuzu: "Sir Snore-a-Lot, I have retired the rude rooster. Your nap is now protected by written engineering policy."
```

---

## SCN_ZUZU_05 — Zuzu Route Scene in Starfall Arcade

**Trigger:** First route event in Starfall Arcade while playing Zuzu.  
**Location:** Starfall Arcade.  
**Story Beat:** Zuzu’s old auto-celebration algorithm is exaggerating scores, overfeeding the Fever meter, and making the arcade competition unfair.  
**Route Flag Opportunity:** `zuzu_flag_open_sourced_score_formula` through Choice B.

### Storyboard Panels

1. Neon cabinets hum beneath paper stars and prize banners.
2. A scoreboard flashes impossible numbers, then awards tickets to a broom.
3. Zuzu squints at the algorithm stamp: **ZUZU CELEBRATION LOGIC — confidence build**.
4. The board preview sparkles too brightly. Combo Gremlins clap in suspicious synchronization.
5. Ticket Imp waves a stack of confused prize vouchers.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
Ticket Imp: "The cabinet awarded the broom seven thousand tickets and a commemorative spoon. Customers have concerns."

Zuzu: "The broom may have excellent form. We should not dismiss broom talent."

Block-O-Matic 3000: "Observed complication: auto-celebration algorithm inflates scores beyond fair festival range. Combo pressure unstable."

Bloop: "Bloop. Lights too proud."

Zuzu: "Ah. That algorithm. It was designed to make every player feel like a genius. Minor flaw: it also made the machine feel like a genius."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Cap the Prize Multiplier`  
**Player Line:**

```text
Zuzu: "We cap the multiplier, restore ticket gravity, and gently inform the broom that its championship is under review."
```

**NPC Response:**

```text
Ticket Imp: "The broom will be devastated but statistically manageable."
```

**Narration:**  
Zuzu installs a score cap. The arcade lights dim to a friendly sparkle, and the next combo challenge becomes clear enough to trust.

**Gameplay Result:**  
Fever meter gains become more stable for the next arcade battle. Reward odds improve slightly without extra hazard.

**Route Result:**  
`+1 zuzuPatchwork`; leans toward Normal Ending.

---

#### B. True Lean / Accountability

**Choice Label:** `Share the Score Formula`  
**Player Line:**

```text
Zuzu: "No hidden scoring. I will post the formula where every player can read it. If the rules sparkle, the sparkle must be honest."
```

**NPC Response:**

```text
Ticket Imp: "Transparent mathematics? At an arcade? Daring. Possibly historic."
```

**Narration:**  
Zuzu prints the score formula in bright letters. The Combo Gremlins stop arguing with the cabinet and start practicing.

**Gameplay Result:**  
Battle mini-objectives show clearer scoring hints. High Score Hydra’s combo punishment is reduced if the player attempts the stated objective.

**Grant Flag:**  
`zuzu_flag_open_sourced_score_formula`

**Route Result:**  
`+1 zuzuAccountability`; contributes to True Ending.

---

#### C. Risky Lean / Overclock

**Choice Label:** `Run the Jackpot Spiral`  
**Player Line:**

```text
Zuzu: "Or we route the inflated score through a jackpot spiral, harvest the excess tickets, and accept one tasteful neon panic."
```

**NPC Response:**

```text
Ticket Imp: "Define tasteful."

Zuzu: "Symmetrical, brief, and only a little loud."
```

**Narration:**  
Zuzu runs the jackpot spiral. Tickets burst upward like golden confetti, the Fever meter surges, and one cabinet loudly declares itself emotionally undefeated.

**Gameplay Result:**  
Gain extra tickets, Fever, or a rare arcade reward; 25% chance to add `oops_too_much_confetti` or trigger preview flashing in the next battle.

**Route Result:**  
`+1 zuzuOverclock`; may open bonus arcade bark.

### Post-Choice Battle Bark Pool

```text
Zuzu: "Score formula visible. No secret gears, except the decorative ones."
Zuzu: "Combo pressure rising. Make the board do something impressive and mathematically legal."
Zuzu: "Fever meter stable. The lights are excited, not lying."
Block-O-Matic 3000: "Route response archived. Arcade fairness recalibrated."
Festival Announcer: "Choice recorded. The broom's appeal will be reviewed after the parade."
```

### Victory Callback

```text
Zuzu: "Arcade stable. Broom demoted to promising amateur. Fairness restored with only minor neon residue."
```

### Boss Callback — High Score Hydra

If true flag collected:

```text
Zuzu: "Hydra, the formula is posted. Three heads, one rulebook. Try not to eat the math."
```

---

## SCN_ZUZU_06 — Zuzu Route Scene in Bloxley’s Block Palace

**Trigger:** First route event in Bloxley’s Block Palace while playing Zuzu.  
**Location:** Bloxley’s Block Palace.  
**Story Beat:** Zuzu discovers that King Bloxley’s royal seals use a clamp design she invented for fast festival construction, now twisted into rigid palace control.  
**Route Flag Opportunity:** `zuzu_flag_invalidated_royal_clamp_design` through Choice B.

### Storyboard Panels

1. The palace corridors are built from bright royal blocks, square carpets, toy banners, and suspiciously perfect corners.
2. Three royal seals lock a gate shut with elegant brass clamps.
3. Zuzu freezes when she sees the clamp geometry: her old quick-build design.
4. The board narrows briefly as royal pattern warnings appear.
5. King Bloxley’s voice echoes from a square speaking trumpet.
6. The dialogue choice card appears.

### Pre-Choice Dialogue

```text
King Bloxley: "Behold! My palace holds because every corner obeys!"

Zuzu: "That clamp profile. That hinge angle. That smug little pressure notch."

Professor Poplin: "Zuzu?"

Zuzu: "Observed complication: Bloxley’s royal seals are attached with technically beautiful, ethically questionable clamps."

Block-O-Matic 3000: "Design origin detected: Zuzu fast-build festival bracket, prototype license unresolved."

Zuzu: "I made it to help stalls stand quickly. He used it to make rooms stop arguing. That is not a repair. That is a wall wearing manners."
```

### Dialogue Choices

#### A. Normal Lean / Practical

**Choice Label:** `Unscrew the Royal Brackets`  
**Player Line:**

```text
Zuzu: "Fastest answer: remove the brackets, loosen the seals, keep the palace from turning the board into a filing cabinet."
```

**NPC Response:**

```text
Professor Poplin: "A clean reversal of the mechanism. Efficient."
```

**Narration:**  
Zuzu unscrews the royal brackets in a blur of practiced motion. The palace walls flex, and several royal blocks downgrade into ordinary runes.

**Gameplay Result:**  
Reduce royal block count or weaken the next symmetry check.

**Route Result:**  
`+1 zuzuPatchwork`; leans toward Normal Ending.

---

#### B. True Lean / Accountability

**Choice Label:** `Invalidate the Clamp Patent`  
**Player Line:**

```text
Zuzu: "No. Bigger repair. I release the counter-design publicly. Any clamp that silences a room must include a release lever anyone can reach."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Public safety revision accepted. Royal seal authority reduced. Accessibility lever requirement added."
```

**Narration:**  
Zuzu stamps the palace blueprint with a bright red revision mark. The royal seals do not simply break. They become answerable.

**Gameplay Result:**  
Royal pattern warnings appear earlier. King Bloxley’s first royal seal phase begins weakened or with a visible counter hint.

**Grant Flag:**  
`zuzu_flag_invalidated_royal_clamp_design`

**Route Result:**  
`+1 zuzuAccountability`; contributes to True Ending.

---

#### C. Risky Lean / Overclock

**Choice Label:** `Detonate Corner Theory`  
**Player Line:**

```text
Zuzu: "Or we prove a palace can survive without corner tyranny by applying one careful, educational, corner-adjacent boom."
```

**NPC Response:**

```text
King Bloxley: "You would explode a royal corner?"

Zuzu: "Only the controlling part. And possibly the dramatic part. They overlap."
```

**Narration:**  
Zuzu plants a tiny bomb rune near the palace corner. The blast pops several royal blocks into confetti, but the palace retaliates with a stricter square pattern.

**Gameplay Result:**  
Clear royal blocks or gain a rare bomb reward; 25% chance to add `oops_square_only` or trigger a harder royal pattern.

**Route Result:**  
`+1 zuzuOverclock`; may unlock Festival Overclock variant.

### Post-Choice Battle Bark Pool

```text
Zuzu: "Royal clamp weakened. Palace obedience down twelve percent and wobbling beautifully."
Zuzu: "Pattern warning detected. Bloxley thinks symmetry is a personality."
Zuzu: "Bomb counter ready. Please direct applause away from load-bearing eyebrows."
Block-O-Matic 3000: "Route response archived. Royal clamp ethics updated."
Festival Announcer: "Choice recorded. The palace has filed a formal complaint with the corner department."
```

### Victory Callback

```text
Zuzu: "Palace loosened. Clamps corrected. Corners still legal, but no longer in charge."
```

### Final Boss Callback — King Bloxley

If true flag collected:

```text
Zuzu: "Bloxley, I built a thing that made control too easy. That part is mine. But you chose to lock people into it. That part is yours. Now we fix both."
```

---

# 7. Zuzu Final Boss Dialogue

## 7.1 Before King Bloxley — Normal Route Version

```text
King Bloxley: "Ah, the goblin of unnecessary buttons approaches. Have you come to admire my excellent clamps?"

Zuzu: "I have come to remove them, revise them, and possibly add a customer feedback slot."

King Bloxley: "Feedback is disorder wearing shoes."

Zuzu: "Incorrect. Feedback is how you learn the shoes are on fire."

Block-O-Matic 3000: "Final route confrontation initialized. Goblin engineering confidence high. Accountability variable incomplete."

Zuzu: "Incomplete still builds. Watch closely. I am very good at emergency improvements."
```

## 7.2 Before King Bloxley — True Route Version

Requires at least 5 true-route flags.

```text
King Bloxley: "Your inventions helped my palace stand. You should be proud."

Zuzu: "I was. Then I saw what standing did when nobody could leave."

King Bloxley: "A perfect palace needs no exits."

Zuzu: "Every good machine needs a stop button. Every good room needs a door. Every good festival asks before it rearranges people."

Block-O-Matic 3000: "Safety revision confirmed. Consent lever requirement active."

Zuzu: "Bloxley, final test. This time, the machine does not choose for everyone. Everyone gets a lever."
```

## 7.3 Phase Change Bark

```text
King Bloxley: "Enough! I command every block to hold its proper corner!"

Zuzu: "Counter-command: corners may apply for flexible scheduling."

Block-O-Matic 3000: "Royal pattern instability detected. Suggested response: calibrated cascade, bomb counter, or public safety lever."
```

## 7.4 Final Hit Bark

```text
Zuzu: "Prototype palace, final revision: release, breathe, and stop being square at people!"
```

---

# 8. Zuzu Endings

---

## 8.1 Zuzu Normal Ending — Certified Emergency Mechanic

### Unlock Condition

```text
Defeat King Bloxley as Zuzu
AND true-route requirements not met
```

### Storyboard Panels

1. Bloxley’s palace folds into a bright pile of harmless construction blocks.
2. Zuzu gathers loose gears, clamps, springs, and tiny levers into a rolling toolbox.
3. Professor Poplin hands her an official festival badge.
4. The badge reads **Certified Emergency Mechanic — provisional but promising**.
5. Zuzu immediately improves the badge with a tiny flashing light.
6. The festival reopens with clearer warning signs and fewer unlicensed buttons.

### Ending Dialogue

```text
Professor Poplin: "Zuzu, your repairs saved the festival."

Zuzu: "Correct. My repairs saved the festival from several problems, including possibly two that were mine."

Professor Poplin: "Possibly?"

Zuzu: "Strongly possibly. I am leaving room for peer review."

Block-O-Matic 3000: "Festival systems stable. Emergency mechanic credential issued. Warning-label compliance improved by sixty-one percent."

Zuzu: "Excellent. Next year we add labels, vents, consent levers, and one button that does absolutely nothing so people can safely get the button-touching out of their system."

Bloop: "Bloop!"

Zuzu: "Yes, Bloop. It will be a very important useless button."
```

### Closing Text

```text
Zuzu became Brixonia’s official emergency mechanic.

She still built bold devices.
She still said "probably" too often.
But every gadget came with a clearer label,
a safer spring,
and at least one lever marked STOP, PLEASE.

The festival remained wonderfully inventive.
It was simply less surprised about it.
```

---

## 8.2 Zuzu True Ending — The Public Test Garden

### Unlock Condition

```text
Defeat King Bloxley as Zuzu
AND zuzuAccountability >= 5
AND at least 5 Zuzu true-route flags collected
```

### Storyboard Panels

1. The Block-O-Matic lowers a tiny blueprint table into the festival square.
2. Zuzu spreads out revised plans from every stage: sewer valve, workshop override, thaw protocol, quiet warranty, score formula, clamp release lever.
3. Festival-goers, monsters, and machines gather around the table.
4. Zuzu places a sign at the front: **Public Test Garden — Ask First, Label Clearly, Celebrate Safely**.
5. The first allowed test is a spring-loaded cupcake tray that gently offers snacks instead of launching them.
6. Even King Bloxley receives a small square booth with an enormous round window.

### Ending Dialogue

```text
Zuzu: "I need everyone to hear this before I touch another lever."

Professor Poplin: "The square is listening."

Zuzu: "I built clever things. Some helped. Some caused trouble because I did not write enough, ask enough, or stop soon enough."

Bloop: "Bloop..."

Zuzu: "New rule: no hidden overrides. No surprise participants. No button without a label. No clamp without a release lever."

Block-O-Matic 3000: "Public Test Garden policy accepted. Festival invention mode revised."

King Bloxley: "Must the release lever be so... reachable?"

Zuzu: "Yes. Especially yours."

King Bloxley: "Hmph. It is at least a well-aligned lever."

Zuzu: "Thank you. I made it accessible and handsome. Growth can have polish."
```

### Closing Text

```text
Zuzu founded the Public Test Garden.

Every invention had a label.
Every label could be read by children, goblins, slimes, and mildly dramatic block kings.
Every dangerous button had a harmless practice button nearby.

Zuzu still tested enthusiastically.
But now the festival tested with her.

And when the first spring-loaded cupcake tray worked perfectly,
Zuzu wrote down the most important result:

SUCCESSFUL BECAUSE EVERYONE KNEW WHAT WOULD HAPPEN.
```

---

## 8.3 Festival Overclock Variant

### Unlock Condition

```text
zuzuOverclock >= 3
```

This variant can play after either Normal or True Ending.

### Bonus Scene

```text
Festival Announcer: "Presenting the first officially approved Festival Overclock Demonstration!"

Zuzu: "Three fireworks, two banners, one cupcake tray, six safety sprites, and a signed permission slip from Pippa. We are making history responsibly."

Pippa: "If one cupcake catches fire, I am taking the wrench."

Zuzu: "Accepted. Harsh but educational."

Block-O-Matic 3000: "Overclock demonstration authorized. Panic probability: ceremonial."

The machine hums.
The banners unfold.
The fireworks bloom into tiny wrench-shaped stars.
The cupcake tray springs forward and offers one cupcake to every guest.

Nothing explodes.

Zuzu wipes away a very small tear and pretends it is gear oil.

Zuzu: "Perfect. Terrifying. I have never been prouder of a non-explosion."
```

---

# 9. Zuzu Hub Dialogue Barks

## 9.1 Early Route

```text
Zuzu: "I have identified seventeen problems, four opportunities, and one pipe making eye contact with me."
Zuzu: "Do not worry. My inventions are much safer after the second apology."
Zuzu: "The Block-O-Matic likes buttons. I respect that. I also fear that."
```

## 9.2 Mid Route

```text
Zuzu: "Temporary fixes are like goblin sandwiches. Useful in emergencies, dangerous when forgotten under machinery."
Zuzu: "I am updating my labels. Bigger letters. Fewer decorative sparks. More honesty."
Zuzu: "A warning sign is not an insult to a gadget. It is a love letter to everyone nearby."
```

## 9.3 True Route Progress

```text
Zuzu: "I used to think a clever machine proved itself by working. Now I think it proves itself by letting people say no."
Zuzu: "The new lever is very reachable. I dislike the loss of drama but respect the safety."
Zuzu: "Documentation is just engineering that talks after you leave. Mine used to mumble. Not anymore."
```

## 9.4 Post Ending

```text
Zuzu: "Public Test Garden open! Please sign the cheerful consent ribbon before touching anything that hums."
Zuzu: "Today’s lesson: not exploding can be exciting if properly announced."
Zuzu: "The useless button is our most popular invention. It does nothing. Perfectly."
```

---

# 10. Zuzu Battle Bark Library

## 10.1 General Battle

```text
Zuzu: "Board state unstable. Excellent. I brought tools."
Zuzu: "That column needs either a cascade or a sternly worded wrench."
Zuzu: "Piece rotation clean. Emotional rotation pending."
Zuzu: "Junk incoming. Rude delivery system, readable timing."
Zuzu: "Bomb block ready. Stand behind common sense. If unavailable, stand behind Bruk."
```

## 10.2 Low HP

```text
Zuzu: "Minor status update: we are approaching the part of the graph labeled do not be here."
Zuzu: "Emergency margin thin. Deploying confidence because shield is temporarily absent."
Zuzu: "If this works, it was strategy. If it fails, it was data. Move anyway."
```

## 10.3 Cascade

```text
Zuzu: "Cascade chain confirmed. Gravity has agreed to collaborate."
Zuzu: "Second cascade! The board understands compound interest."
Zuzu: "Beautiful collapse. Structurally rude, tactically perfect."
```

## 10.4 Bomb / Gadget

```text
Zuzu: "Bomb rune armed. Friendly boom radius: mostly friendly."
Zuzu: "Toolbox block! The board has provided a tiny committee of solutions."
Zuzu: "Gadget online. Please admire after impact."
```

## 10.5 Boss Pressure

```text
Zuzu: "Boss phase shift. The machine is changing topics loudly."
Zuzu: "Pattern warning visible. See? A rude hazard with manners."
Zuzu: "Royal blocks detected. Someone has mistaken squares for leadership."
```

---

# 11. Zuzu Route Implementation JSON Draft

Use this as a structural example only. Final implementation should follow the project’s actual content schema.

```json
{
  "routeId": "route_zuzu_goblin_engineer",
  "heroId": "hero_zuzu_goblin_engineer",
  "routeScores": {
    "zuzuPatchwork": 0,
    "zuzuAccountability": 0,
    "zuzuOverclock": 0
  },
  "trueEndingRequirements": {
    "minAccountability": 5,
    "minTrueFlags": 5
  },
  "variantRequirements": {
    "festivalOverclock": {
      "minOverclock": 3
    }
  },
  "scenes": [
    {
      "sceneId": "SCN_ZUZU_01",
      "stageId": "stage_sprinkle_sewers",
      "locationName": "Sprinkle Sewers",
      "trueFlag": "zuzu_flag_logged_sprinkle_pressure_fault",
      "choices": [
        {
          "choiceId": "zuzu_01_a",
          "label": "Tighten the Sprinkle Valve",
          "routeLean": "normal",
          "scoreDelta": { "zuzuPatchwork": 1 }
        },
        {
          "choiceId": "zuzu_01_b",
          "label": "Log the Pressure Fault",
          "routeLean": "true",
          "scoreDelta": { "zuzuAccountability": 1 },
          "grantFlag": "zuzu_flag_logged_sprinkle_pressure_fault"
        },
        {
          "choiceId": "zuzu_01_c",
          "label": "Overclock the Candy Pump",
          "routeLean": "risky",
          "scoreDelta": { "zuzuOverclock": 1 },
          "oopsieChance": 0.25
        }
      ]
    }
  ]
}
```

---

# 12. Codex Implementation Prompt — Zuzu Route

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement Zuzu's character route dialogue and route progression data.

Use the file blockmancer_zuzu_route_variable_choices.md as the dialogue/storyboard source.

Goals:
- Add Zuzu-specific route scenes across all 6 stages.
- Keep Zuzu's voice distinct: fast technical goblin engineer, confident, formal safety wording, funny through engineering logic, sincere in accountability moments.
- Do not reuse Milo or Pippa choice labels.
- Each stage must have unique choice label text and unique story lead-up.
- Track practical, true, and risky route scores.
- Grant true-route flags when the player selects the accountability choice.
- Add Zuzu Normal Ending, True Ending, and Festival Overclock variant.

Route scores:
- zuzuPatchwork
- zuzuAccountability
- zuzuOverclock

True route flags:
- zuzu_flag_logged_sprinkle_pressure_fault
- zuzu_flag_admitted_prototype_override
- zuzu_flag_wrote_thaw_protocol
- zuzu_flag_quieted_alarm_with_consent
- zuzu_flag_open_sourced_score_formula
- zuzu_flag_invalidated_royal_clamp_design

Acceptance criteria:
- Zuzu route scenes can trigger once per stage while playing Zuzu.
- Choice labels are unique per stage.
- Zuzu dialogue does not sound like Milo or Pippa.
- Route scores update after choices.
- True route flags persist in current run state.
- Zuzu Normal Ending triggers if True route conditions are not met.
- Zuzu True Ending triggers if at least 5 true flags and zuzuAccountability >= 5.
- Festival Overclock variant triggers if zuzuOverclock >= 3.
- Dialogue remains cheerful, readable, and mobile-friendly.
- Build passes.

Finish response with:
Summary / Files changed / Route data added / How to test / Known limitations.
```

---

# 13. QA Checklist — Zuzu Route

## 13.1 Dialogue Voice QA

- [ ] Zuzu uses engineering terms naturally.
- [ ] Zuzu speaks faster and more technically than Milo.
- [ ] Zuzu does not use Pippa’s baking/hearth pattern.
- [ ] Zuzu’s risky choices feel experimental, not random.
- [ ] Zuzu’s true choices show accountability, documentation, consent, and safety.
- [ ] Block-O-Matic keeps formal diagnostic voice.
- [ ] Professor Poplin sounds like a concerned mentor, not a scolding villain.

## 13.2 Choice Label QA

- [ ] Stage 1 labels mention valve / pressure / candy pump.
- [ ] Stage 2 labels mention belt / ledger / prototype.
- [ ] Stage 3 labels mention thaw / protocol / polarity.
- [ ] Stage 4 labels mention gearbox / warranty / pillow spring.
- [ ] Stage 5 labels mention multiplier / formula / jackpot.
- [ ] Stage 6 labels mention brackets / patent / corner theory.
- [ ] No stage reuses the same generic labels.

## 13.3 Route Logic QA

- [ ] Practical choices add `zuzuPatchwork`.
- [ ] True choices add `zuzuAccountability` and grant stage flag.
- [ ] Risky choices add `zuzuOverclock` and may add Oopsie or hazard.
- [ ] True Ending requires at least 5 true flags and enough Accountability.
- [ ] Festival Overclock variant checks `zuzuOverclock >= 3`.
- [ ] Route flags persist through save/load.

## 13.4 Gameplay Tie QA

- [ ] Stage 1 effects interact with sticky/sprinkle pressure.
- [ ] Stage 2 effects interact with junk, bombs, board shake, and Prototype No. 7.
- [ ] Stage 3 effects interact with freeze, speed waves, and ice blocks.
- [ ] Stage 4 effects interact with Sleepy, shield, and soft blocks.
- [ ] Stage 5 effects interact with Fever, score, and combo challenge.
- [ ] Stage 6 effects interact with royal blocks, symmetry, and clamp/pattern warnings.

---

# 14. Next Character Recommendation

After Zuzu, the next route should be **Nixie**.

Reason:

```text
Nixie gives the strongest contrast after Zuzu.
Zuzu is fast, technical, and impulsive.
Nixie should be slow, calm, precise, and emotionally cooling.
```

Nixie’s route should focus on:

```text
patience,
preservation,
not rushing a thaw,
protecting fragile things,
and learning when stillness helps versus when it hides fear.
```
