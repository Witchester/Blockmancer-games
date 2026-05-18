# Blockmancer Dungeon — Pippa Route Dialogue & Storyboard
## Variable Choice Label Pass — Pippa Draft

**Document purpose:**  
This file prepares **Pippa the Pyromancer** as the second full character-route example after Milo.

The goal is to give Pippa her own speaking rhythm, choice language, route flags, stage-specific story escalation, and Normal / True Ending structure.

Pippa should **not** sound like Milo with baking words pasted on top.  
She is brisk, precise, warm-hearted, and slightly volcanic when pastries are threatened.

This route keeps the same cheerful Brixonia festival world, six-stage structure, Cascade Gravity gameplay identity, and happy festival tone.

---

# 1. Pippa Voice Bible

## 1.1 Core Voice

Pippa is the festival baker who became a fire mage because the dungeon stole her oven, her cupcakes, and half of her emergency frosting.

She speaks like someone who can run a kitchen during a parade, a thunderstorm, and a minor goblin incident without dropping a tray.

She is not merely “angry fire girl.”  
Her fire is discipline, care, timing, protection, and hospitality.

### Pippa speaks with:

- brisk confidence;
- clipped but warm phrasing;
- baking verbs and kitchen logic;
- exact temperatures, timing, batches, trays, crumbs, frosting, glaze, batter, dough, proofing, cooling, scorching, and hearth imagery;
- impatience when people waste food;
- deep tenderness when someone is hungry, frightened, or excluded;
- a clear sense that food is how a festival says, “You belong here.”

### Pippa avoids:

- soft mystical listening like Milo;
- long technical explanations like Zuzu;
- dreamy poetic wandering like Lumi;
- cold patience like Nixie;
- knightly oath language like Bruk;
- internet-style sarcasm or meme jokes.

### Example Pippa line style

```text
Pippa: "Right. First we scrape the frosting off the gears, then we ask why the gears were frosting-adjacent in the first place. Nobody touch the blue tray. It is load-bearing." 
```

```text
Pippa: "Fire is not for showing off. Fire is for bread, warmth, and the very careful correction of nonsense." 
```

```text
Pippa: "If Bloxley wants everything square, fine. I can bake a square cake. But I refuse to serve it without a soft center." 
```

---

## 1.2 Pippa Choice Philosophy

Every Pippa choice should feel like one of three different kitchen decisions under pressure.

| Route Lean | Meaning | Pippa Behavior |
| --- | --- | --- |
| Practical / Normal | Stabilize the kitchen and protect the batch. | Pippa clears danger efficiently, saves ingredients, and prevents further disaster. |
| True / Hearth | Understand what the fire is supposed to warm, not only what it can burn. | Pippa turns from revenge to hospitality and earns a true-route flag. |
| Risky / Flambé | Use bold fire for rare rewards. | Pippa creates a brilliant, dangerous burst of magic that may add an Oopsie or harder hazard. |

## 1.3 Choice Label Rules

Choice labels should be short, stage-specific, and unmistakably Pippa.

Bad repeated labels:

```text
Make the board safe first
Listen beneath the hazard
Trust the rhythm
```

Better Pippa labels:

```text
Scrape the Frosting Valve
Toast the Jammed Gear
Warm the Frozen Batch
Serve the Sleepy Guards
Outscore the Prize Oven
Bake the Crooked Square
```

Each Pippa label should be:

- 2–6 words;
- easy to read on mobile;
- tied to the current stage;
- practical, culinary, and expressive;
- funny through situation, not through meme phrasing.

---

# 2. Route Variables

## 2.1 Route Scores

```ts
type PippaRouteState = {
  pippaResolve: number;       // practical cleanup, Normal route stability
  pippaHearth: number;        // true warmth, True route progress
  pippaFlambe: number;        // risky festival spectacle, optional variant rewards
  pippaFlags: string[];
};
```

## 2.2 True Route Flags

| Stage | Flag | Meaning |
| ---: | --- | --- |
| 1 | `pippa_flag_spared_cupcake_slime_batch` | Pippa realizes the slimes were hungry, not malicious. |
| 2 | `pippa_flag_relit_responsible_oven` | Pippa learns heat without restraint ruins the whole kitchen. |
| 3 | `pippa_flag_warmed_frozen_share_crates` | Pippa chooses to thaw food slowly enough to save it for everyone. |
| 4 | `pippa_flag_baked_midnight_rolls` | Pippa feeds the sleepy guards instead of simply waking them. |
| 5 | `pippa_flag_shared_prize_cakes` | Pippa turns competition into shared celebration. |
| 6 | `pippa_flag_baked_square_cake_soft_center` | Pippa answers Bloxley’s order with structure plus kindness. |

## 2.3 Ending Conditions

### Pippa Normal Ending

Unlock if:

```text
Defeat King Bloxley as Pippa
AND pippaHearth < 5
```

or:

```text
Defeat King Bloxley as Pippa
AND fewer than 5 Pippa true-route flags collected
```

### Pippa True Ending

Unlock if:

```text
Defeat King Bloxley as Pippa
AND collect at least 5 Pippa true-route flags
AND pippaHearth >= 5
```

Optional stronger version:

```text
All 6 Pippa true-route flags collected
```

### Festival Flambé Variant

If:

```text
pippaFlambe >= 3
```

then add a small bonus scene after either ending where Pippa performs the first officially approved Festival Flambé: beautiful, harmless, and signed off by three nervous safety sprites.

---

# 3. Route Overview

Pippa’s route begins with indignation.

Her cupcakes were stolen.  
Her oven was invaded.  
Her frosting was treated with disrespect.

At first, she believes the answer is simple: burn the mess away and recover what belongs to the festival.

Stage by stage, she learns that good fire is not only heat. It is judgment.

1. **Sprinkle Sewers** — hunger.
2. **Goblin Workshop** — control.
3. **Frosty Pantry** — patience.
4. **Pillow Castle** — comfort.
5. **Starfall Arcade** — generosity.
6. **Bloxley’s Block Palace** — form and feeling together.

Normal route Pippa becomes the festival’s heroic baker-pyromancer, known for restoring the dessert tables and terrifying every sticky block within three rooms.

True route Pippa becomes the founder of the **Festival Hearth Table**, where heroes, monsters, machines, and one dramatic block king all receive a proper plate.

---

# 4. Shared Pippa Route UI Notes

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
Scrape the Frosting Valve
Clear sticky danger before the batch collapses.
[Practical]
```

---

# 5. SCN_PIPPA_01 — Sprinkle Sewers
## The Batch That Bit Back

```yaml
sceneId: SCN_PIPPA_01
hero: hero_pippa_pyromancer
stage: stage_1_sprinkle_sewers
location: Sprinkle Sewers — Frosting Overflow Gate
trigger: First Pippa route event in Stage 1 after Pippa is unlocked
routeFlagOpportunity: pippa_flag_spared_cupcake_slime_batch
```

## Story Beat

Pippa returns to the Sprinkle Sewers after joining the party. She finds a hidden frosting gate where several small Cupcake Slimes are guarding a stolen tray.

At first, it looks like theft. Then Pippa notices the slimes have arranged the cupcakes in careful rows and are feeding crumbs to smaller jelly rats.

This is the first hint that Pippa’s route is not about revenge. It is about learning who the festival table is for.

## Storyboard Panels

1. The sewer tunnel glows with candy-pipe reflections and drifting sugar mist.
2. A frosting valve sputters, forming sticky blocks across the lower board.
3. A group of Cupcake Slimes huddles around a dented silver tray.
4. One tiny slime pushes a cupcake crumb toward a shivering Jelly Rat.
5. Pippa raises her whisk-wand, then hesitates.
6. The dialogue choice card appears.

## Pre-Choice Dialogue

```text
Pippa: "That is my tray. That is my frosting. And unless my eyes have been lightly caramelized, that is my emergency cupcake batch."

Cupcake Slime: "Gloop?"

Festival Announcer: "A delicate culinary dispute has entered the route menu. Please season your decision responsibly."

Block-O-Matic 3000: "Observed complication: dessert recovery target is also functioning as improvised community meal. Ethical temperature rising."

Pippa: "I came here to take the batch back. I did not come here to steal dinner from something smaller than my mixing bowl."
```

## Dialogue Choices

### A. Normal Lean / Practical

**Choice Label:** `Scrape the Frosting Valve`  
**Choice Preview:** Clear the sticky danger and recover most of the tray.

```text
Pippa: "First rule of kitchens and dungeons: nobody eats beside a leaking valve. Back up. I am scraping this clean."
```

**NPC Response:**

```text
Cupcake Slime: "Gloop!"

Pippa: "Yes, yes. Complain after the floor stops trying to become pudding."
```

**Narration:**  
Pippa clears the frosting spill with careful bursts of fire. The slimes scatter, then return when the floor is safe.

**Gameplay Result:**  
Start the next battle with reduced sticky block spawn rate for 1 room.

**Route Result:**  
`+1 pippaResolve`; leans toward Normal Ending.

---

### B. True Lean / Hearth

**Choice Label:** `Split the Emergency Batch`  
**Choice Preview:** Share the cupcakes and learn why the slimes gathered here.

```text
Pippa: "Half the tray comes home. Half stays here. But you will sit in a line, chew slowly, and stop using frosting as mortar."
```

**NPC Response:**

```text
Cupcake Slime: "Gloooop."

Pippa: "That had better mean thank you. I accept thank yous, clean plates, and written apologies in sprinkle ink."
```

**Narration:**  
The smallest slime reveals a sugar-marked tunnel map. The slimes were hiding food from a larger monster that kept taking everything round and sweet.

**Gameplay Result:**  
Cupcake Slime friendship progress increases. Future sticky blocks may occasionally convert into sprinkle blocks after fire damage.

**Grant Flag:**  
`pippa_flag_spared_cupcake_slime_batch`

**Route Result:**  
`+1 pippaHearth`; contributes to True Ending.

---

### C. Risky Lean / Flambé

**Choice Label:** `Caramelize the Spillway`  
**Choice Preview:** Burn the blockage fast for a rare reward, but risk overcooked chaos.

```text
Pippa: "Stand clear. I am giving this sewer one proper caramel shell and absolutely no second chances."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Warning: caramelization radius exceeds polite dessert boundaries."

Pippa: "Then the dessert boundaries should have filed a complaint earlier."
```

**Narration:**  
Pippa seals the frosting leak in a shining amber crust. It is beautiful, effective, and slightly too dramatic.

**Gameplay Result:**  
Gain a rare candy-themed reward; 25% chance to add `oops_sticky_floor` or spawn one harder sticky hazard in the next room.

**Route Result:**  
`+1 pippaFlambe`; may open a bonus reward bark or altered boss state.

## Post-Choice Battle Bark Pool

```text
Pippa: "A tidy flame is still a flame. Respect both parts."
Pippa: "Sticky on the left. Burn edges first, center last."
Pippa: "No panic near the tray. Panic curdles the frosting."
Block-O-Matic 3000: "Culinary route response archived. Frosting ethics updated."
Festival Announcer: "Choice plated. The judges note a pleasing balance of danger and garnish."
```

## Victory Callback

```text
Pippa: "The tray is lighter, the floor is safer, and nobody chewed through the handle. I will call that progress."
```

## Boss Callback — Cupcake Slime King

If `pippa_flag_spared_cupcake_slime_batch` is active:

```text
Cupcake Slime King: "GLOOOOP!"

Pippa: "I fed your little ones. So you and I are not having a war. We are having a very loud table-manners lesson."
```

Effect suggestion: Cupcake Slime King starts with fewer sticky blocks or loses one sticky phase trigger.

---

# 6. SCN_PIPPA_02 — Goblin Workshop
## The Oven That Would Not Listen

```yaml
sceneId: SCN_PIPPA_02
hero: hero_pippa_pyromancer
stage: stage_2_goblin_workshop
location: Goblin Workshop — Trial Oven Assembly Line
trigger: First Pippa route event in Stage 2
routeFlagOpportunity: pippa_flag_relit_responsible_oven
```

## Story Beat

The workshop contains a goblin-built oven that keeps spitting out bomb blocks and half-baked rune pieces. It is not broken in a simple way. It is heating everything at once because nobody told it when to stop.

Pippa recognizes the danger immediately: uncontrolled heat ruins the batch.

## Storyboard Panels

1. Conveyor belts carry cupcake tins, gears, springs, and warning labels through a bright brass chamber.
2. A Trial Oven coughs sparks and launches bomb blocks into the preview queue.
3. A goblin sign reads: `PREHEAT FOREVER FOR BEST RESULTS?`
4. Pippa stares at the sign in professional horror.
5. The oven door glows too bright, then too dim, then too bright again.
6. The dialogue choice card appears.

## Pre-Choice Dialogue

```text
Pippa: "Preheat forever? Who wrote this? A spoon with confidence?"

Wrench Goblin: "It gets very hot very quickly! That is like baking, yes?"

Pippa: "That is like arson wearing an apron."

Block-O-Matic 3000: "Observed complication: trial oven lacks off-switch humility. Bomb-block probability increasing."

Pippa: "Heat is a promise. If you cannot keep it, you do not get to touch the batter."
```

## Dialogue Choices

### A. Normal Lean / Practical

**Choice Label:** `Douse the Overheat Tray`  
**Choice Preview:** Reduce bomb and junk pressure before the oven worsens.

```text
Pippa: "Water pan under the rack, vents open, sparks away from the dough. Move. I am saving this kitchen from its own enthusiasm."
```

**NPC Response:**

```text
Wrench Goblin: "But the sparks make it look successful!"

Pippa: "So does frosting on a burnt loaf. We still do not serve it."
```

**Narration:**  
Pippa lowers the oven’s heat and clears the most dangerous bomb blocks before they can spread.

**Gameplay Result:**  
Next workshop combat begins with one fewer incoming junk warning or one bomb block safely converted into a normal rune.

**Route Result:**  
`+1 pippaResolve`; leans toward Normal Ending.

---

### B. True Lean / Hearth

**Choice Label:** `Teach the Oven to Rest`  
**Choice Preview:** Recalibrate the oven’s heat cycle instead of simply shutting it down.

```text
Pippa: "Listen carefully, little furnace. A good oven breathes. Hot, then steady. Bright, then patient. Nothing worth serving is bullied into rising."
```

**NPC Response:**

```text
Trial Oven: "Ding?"

Pippa: "Yes. Ding only when ready. Not when lonely, not when proud, and absolutely not every seven seconds."
```

**Narration:**  
The oven’s glow softens. Its bomb blocks become warm toolbox blocks for a moment, as though the machine finally understands that heat can help without shouting.

**Gameplay Result:**  
For the next Stage 2 boss or elite room, one bomb/junk hazard is delayed by 1 piece. Fire spells have a small chance to convert junk into toolbox blocks.

**Grant Flag:**  
`pippa_flag_relit_responsible_oven`

**Route Result:**  
`+1 pippaHearth`; contributes to True Ending.

---

### C. Risky Lean / Flambé

**Choice Label:** `Flash-Bake the Gear Jam`  
**Choice Preview:** Use a bold fire burst to clear the assembly line fast.

```text
Pippa: "Fine. If the gears insist on being batter, I will give them three seconds of festival heat and a lesson in crisp edges."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Temperature spike noted. Confidence level: aromatic but hazardous."

Pippa: "Aromatic is the first step toward forgiveness. Hazardous is why I am standing here."
```

**Narration:**  
Pippa flash-bakes the jammed gears loose. The belts run beautifully for half a minute, then throw confetti and one suspiciously warm screw.

**Gameplay Result:**  
Gain a rare gadget/fire reward; 25% chance to trigger `oops_overexcited_machine` or a harder bomb hazard in the next room.

**Route Result:**  
`+1 pippaFlambe`; may unlock a bonus workshop shortcut or altered Prototype No. 7 bark.

## Post-Choice Battle Bark Pool

```text
Pippa: "That gear is smoking. If it smells like toast, we are already late."
Pippa: "Bomb block on deck. Let it cool or make it useful."
Pippa: "Proper heat, proper timing, fewer goblin lawsuits."
Block-O-Matic 3000: "Oven temperament adjusted. Probability of edible machinery improved by 12%."
Festival Announcer: "Workshop round garnished with sparks. Please applaud from behind the safety ribbon."
```

## Victory Callback

```text
Pippa: "There. Still ridiculous, but now it is ridiculous with a timer."
```

## Boss Callback — Prototype No. 7

If `pippa_flag_relit_responsible_oven` is active:

```text
Prototype No. 7: "MAXIMUM PREHEAT ENGAGED!"

Pippa: "No. Steady heat. You will rise properly, or you will sit in the corner and think about your crumb structure."
```

Effect suggestion: Prototype No. 7 delays its first junk/bomb combo by 1 enemy tick.

---

# 7. SCN_PIPPA_03 — Frosty Pantry
## The Batch Under Ice

```yaml
sceneId: SCN_PIPPA_03
hero: hero_pippa_pyromancer
stage: stage_3_frosty_pantry
location: Frosty Pantry — Gelato Crate Hall
trigger: First Pippa route event in Stage 3
routeFlagOpportunity: pippa_flag_warmed_frozen_share_crates
```

## Story Beat

Pippa finds crates of festival pastries frozen beside Nixie’s rainbow gelato supply. Her first instinct is to melt the ice quickly. Then she realizes too much heat would ruin both the pastries and the ice cream.

This stage teaches Pippa that restraint can be a form of care.

## Storyboard Panels

1. The pantry corridor glitters with frost and tiny rainbow reflections.
2. Festival cake crates sit sealed in ice beside gelato tubs.
3. Frosty rune blocks slide across the board preview.
4. Pippa’s whisk-wand flares, then lowers.
5. A small ice cream imp sneezes frost onto a pastry label.
6. The dialogue choice card appears.

## Pre-Choice Dialogue

```text
Pippa: "Those are my festival sponge rolls. Frozen solid. Beside gelato. In a hallway. This is a storage crime with witnesses."

Nixie: "Warm too quickly and the cream splits. Melt too hard and the cakes sag."

Pippa: "I know. That is why I am not screaming. I am measuring my fury."

Block-O-Matic 3000: "Observed complication: thermal correction requires delicacy. Excess fire will convert dessert inventory into regret."

Pippa: "Nobody is becoming regret on my watch."
```

## Dialogue Choices

### A. Normal Lean / Practical

**Choice Label:** `Clear the Freezer Vents`  
**Choice Preview:** Stabilize the cold air and prevent freeze hazards.

```text
Pippa: "Vents first. Then crates. Then anyone who thought pastry belonged near a draft gets a strongly worded tart."
```

**NPC Response:**

```text
Nixie: "A tart can be strongly worded?"

Pippa: "Mine can. They have excellent posture."
```

**Narration:**  
Pippa clears ice from the freezer vents with small, controlled flames. The room becomes safer, though the frozen crates remain mostly sealed.

**Gameplay Result:**  
The next freeze warning window increases by 1 piece, or the next ice block spawns softened.

**Route Result:**  
`+1 pippaResolve`; leans toward Normal Ending.

---

### B. True Lean / Hearth

**Choice Label:** `Thaw by the Crumb`  
**Choice Preview:** Warm the crates slowly enough to save both cake and gelato.

```text
Pippa: "Low flame. Slow circle. No rushing. A cake comes back to life the way dough rises—quietly, if you respect it."
```

**NPC Response:**

```text
Ice Cream Imp: "Brrip?"

Pippa: "Yes, you may hold the corner. No, you may not lick the inventory tags."
```

**Narration:**  
The crates thaw without splitting, sagging, or flooding the pantry. Pippa sets aside a shared dessert bundle for the pantry creatures and the festival stall.

**Gameplay Result:**  
Gain a `shared_crate` route reward. Future frost hazards in this run may be softened by fire spells once per room.

**Grant Flag:**  
`pippa_flag_warmed_frozen_share_crates`

**Route Result:**  
`+1 pippaHearth`; contributes to True Ending.

---

### C. Risky Lean / Flambé

**Choice Label:** `Crack the Sugar Ice`  
**Choice Preview:** Burst open the ice with dramatic heat for a bigger reward.

```text
Pippa: "All right, frost. You get one clean crack. If you flood my sponge rolls, I am filing you under enemy garnish."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Sugar-ice fracture predicted. Dessert survivability: excitingly uncertain."

Pippa: "Excitingly uncertain is not a recipe. It is a warning label with ambition."
```

**Narration:**  
The ice breaks in a sparkling fan of steam and sugar crystals. Some crates are freed at once. Others wobble dangerously.

**Gameplay Result:**  
Gain a rare frost/fire synergy reward; 25% chance to add `oops_slippery_buttons` or trigger a speed wave in the next battle.

**Route Result:**  
`+1 pippaFlambe`; may unlock a bonus bark with Nixie or a pantry shortcut.

## Post-Choice Battle Bark Pool

```text
Pippa: "Low flame. Do not bully the batter."
Pippa: "Ice on the right. Warm the edge, not the middle."
Pippa: "Careful. Steam can hide a bad piece as easily as fog hides a pothole."
Nixie: "Your fire is quieter than I expected."
Pippa: "It knows when I am serious."
```

## Victory Callback

```text
Pippa: "Saved the cakes, spared the gelato, and only scorched one label. Excellent recovery."
```

## Boss Callback — Gelato Golem

If `pippa_flag_warmed_frozen_share_crates` is active:

```text
Gelato Golem: "FREEZE THE FESTIVAL. PRESERVE THE SWEETNESS."

Pippa: "Sweetness is not preserved by locking it away. It is preserved by serving it before someone drops a spoon."
```

Effect suggestion: Gelato Golem’s first freeze phase is shortened or its ice block count is reduced.

---

# 8. SCN_PIPPA_04 — Pillow Castle
## Rolls Before Midnight

```yaml
sceneId: SCN_PIPPA_04
hero: hero_pippa_pyromancer
stage: stage_4_pillow_castle
location: Pillow Castle — Blanket Banquet Hall
trigger: First Pippa route event in Stage 4
routeFlagOpportunity: pippa_flag_baked_midnight_rolls
```

## Story Beat

Pillow Castle is guarded by sleepy toy soldiers and blanket ghosts. Pippa expects laziness. Instead, she discovers the guards have been awake for too long, trying to keep the festival routes safe.

This stage reveals Pippa’s softer hospitality: feeding someone can solve what fire cannot.

## Storyboard Panels

1. A banquet hall made of quilts, cushions, and stitched banners opens before the party.
2. Toy soldiers nod off while leaning against butter-knife spears.
3. A Blanket Ghost carries a tray of empty cups.
4. Soft blocks appear on the board preview, cushioning line clears.
5. Pippa notices an unused warming drawer tucked beneath a pillow throne.
6. The dialogue choice card appears.

## Pre-Choice Dialogue

```text
Pippa: "Half this castle is asleep standing up. The other half is pretending pillows count as dinner."

Blanket Ghost: "Hoooo... the guards must not abandon their posts."

Pippa: "Hungry guards already abandoned their posts. Their bodies just have not received the paperwork."

Block-O-Matic 3000: "Observed complication: morale sponge density low. Sleepy status likely."

Pippa: "Then we do not shout. We feed them. Quietly. With butter."
```

## Dialogue Choices

### A. Normal Lean / Practical

**Choice Label:** `Toast the Guard Crumbs`  
**Choice Preview:** Give the guards enough food to stay steady in battle.

```text
Pippa: "Small portions. Warm crumbs. Nothing too sweet. A sleepy guard with a sugar rush is just a catapult with boots."
```

**NPC Response:**

```text
Toy Soldier: "Snack received. Posture improving."

Pippa: "Good. Chew before saluting. I am not losing anyone to heroic choking."
```

**Narration:**  
Pippa prepares quick toasted crumbs for the exhausted guards. They stand straighter, and the room’s soft-block pressure eases.

**Gameplay Result:**  
Reduce Sleepy status chance for the next room, or gain small shield at battle start.

**Route Result:**  
`+1 pippaResolve`; leans toward Normal Ending.

---

### B. True Lean / Hearth

**Choice Label:** `Bake Midnight Rolls`  
**Choice Preview:** Feed the whole watch and learn why the castle refuses to rest.

```text
Pippa: "Warming drawer on low. Dough in small rounds. Butter after the rise. Nobody guards a festival on an empty stomach."
```

**NPC Response:**

```text
Blanket Ghost: "Hoooo... the castle remembers dinner."

Pippa: "Good. Then it can remember bedtime next."
```

**Narration:**  
The scent of warm rolls spreads through Pillow Castle. The blanket ghosts stop hovering in anxious circles. A hidden stitch-map reveals how the castle’s sleeplessness began.

**Gameplay Result:**  
Gain `midnight_rolls` route reward. Sleepy effects may heal a small amount or become less punishing once during this stage.

**Grant Flag:**  
`pippa_flag_baked_midnight_rolls`

**Route Result:**  
`+1 pippaHearth`; contributes to True Ending.

---

### C. Risky Lean / Flambé

**Choice Label:** `Torch the Blanket Tangle`  
**Choice Preview:** Burn through the tangled blankets fast, but risk waking the castle.

```text
Pippa: "I can clear that tangle in one breath. Everyone keep feathers, tassels, and heroic capes away from the business end of my whisk."
```

**NPC Response:**

```text
Festival Announcer: "The audience is reminded that blanket flambé is not a recommended home activity."

Pippa: "It is not a recommended castle activity either. That is why I am annoyed."
```

**Narration:**  
Pippa burns a clean path through the blanket knot. The route opens, but the smoke makes several pillow guards sneeze themselves awake.

**Gameplay Result:**  
Gain a rare defense/fire reward; 25% chance to trigger a stronger Sleepy or soft-block hazard in the next battle.

**Route Result:**  
`+1 pippaFlambe`; may open a shortcut or altered Sir Snore-a-Lot bark.

## Post-Choice Battle Bark Pool

```text
Pippa: "Soft block ahead. Do not overmix the landing."
Pippa: "If anyone yawns into the batter, I am starting this room over."
Pippa: "Warmth first. Flames second. Very distant second if pillows are involved."
Blanket Ghost: "Hoooo... butter has improved morale."
Pippa: "Butter often does."
```

## Victory Callback

```text
Pippa: "The room is fed, the guards are upright, and nothing important caught fire. That is practically elegant."
```

## Boss Callback — Sir Snore-a-Lot

If `pippa_flag_baked_midnight_rolls` is active:

```text
Sir Snore-a-Lot: "WHO DISTURBS MY NOBLE NAP?"

Pippa: "Someone who brought rolls. Sit up, eat one, then we can discuss your extremely armed bedtime routine."
```

Effect suggestion: Sir Snore-a-Lot begins with reduced shield or skips one Sleepy setup.

---

# 9. SCN_PIPPA_05 — Starfall Arcade
## The Prize Oven

```yaml
sceneId: SCN_PIPPA_05
hero: hero_pippa_pyromancer
stage: stage_5_starfall_arcade
location: Starfall Arcade — Prize Counter Kitchenette
trigger: First Pippa route event in Stage 5
routeFlagOpportunity: pippa_flag_shared_prize_cakes
```

## Story Beat

The Starfall Arcade has converted a prize machine into a competitive cake dispenser. It awards tiny cakes only to players with high scores, while several monsters watch hungrily from outside the glowing ropes.

Pippa is furious in a new way: not because food was stolen, but because food is being used to exclude.

## Storyboard Panels

1. Neon prize lights pulse across a polished arcade floor.
2. A claw machine labeled `HIGH SCORE CAKE DISPENSER` guards a stack of tiny star cakes.
3. Token Sprites cheer while Combo Gremlins argue over score multipliers.
4. A small Pixel Blob presses its face against the prize glass.
5. Pippa reads the rules card twice, then folds her arms.
6. The dialogue choice card appears.

## Pre-Choice Dialogue

```text
Pippa: "A cake machine that only feeds winners. That is not a prize counter. That is a bad table with lights on it."

Ticket Imp: "Rules are rules! High score earns high sweetness!"

Pippa: "Sweetness is not a trophy. It is how you get people to sit together before they start arguing over chairs."

Block-O-Matic 3000: "Observed complication: dessert distribution model overly competitive. Morale imbalance detected near prize glass."

Pippa: "Then we fix the model. And possibly the glass. Depending on attitude."
```

## Dialogue Choices

### A. Normal Lean / Practical

**Choice Label:** `Win the Cake Fairly`  
**Choice Preview:** Beat the arcade rule and claim the cakes by score.

```text
Pippa: "Fine. If the machine wants points, I will give it points. But when I win, those cakes leave the glass. All of them."
```

**NPC Response:**

```text
Ticket Imp: "Confident! Spicy! Acceptable!"

Pippa: "I am not spicy. I am correctly seasoned."
```

**Narration:**  
Pippa plays the machine on its own terms, stacking clear after clear until the prize lock clicks open.

**Gameplay Result:**  
Start next battle with Fever partially filled, or gain bonus tickets.

**Route Result:**  
`+1 pippaResolve`; leans toward Normal Ending.

---

### B. True Lean / Hearth

**Choice Label:** `Open the Shared Plate`  
**Choice Preview:** Change the prize rule so everyone receives a piece.

```text
Pippa: "New rule. High score cuts the cake. Everyone gets a slice. The winner receives the corner piece, because corners hold frosting properly."
```

**NPC Response:**

```text
Combo Gremlin: "But then what do winners win?"

Pippa: "Applause, first choice of napkin, and the responsibility not to be insufferable."
```

**Narration:**  
The arcade lights soften. The prize machine begins dispensing small star cakes into a shared tray. Even the Pixel Blob receives a careful little square.

**Gameplay Result:**  
Gain `shared_prize_cakes` route reward. Future arcade combo objectives grant a small team-wide benefit even on partial success.

**Grant Flag:**  
`pippa_flag_shared_prize_cakes`

**Route Result:**  
`+1 pippaHearth`; contributes to True Ending.

---

### C. Risky Lean / Flambé

**Choice Label:** `Flambé the Scoreboard`  
**Choice Preview:** Overload the arcade score display for a spectacular reward.

```text
Pippa: "If that scoreboard wants drama, I will give it a dessert course it can see from the moon."
```

**NPC Response:**

```text
Festival Announcer: "The scoreboard has requested a helmet."

Pippa: "Good. Sensible appliance."
```

**Narration:**  
Pippa sends a ribbon of flame up the score lights. The machine showers tickets, star sparks, and one slightly smoking coupon.

**Gameplay Result:**  
Gain a rare fever/fire reward; 25% chance to trigger `oops_too_much_confetti` or a harder preview-flash hazard.

**Route Result:**  
`+1 pippaFlambe`; may open a bonus Ticket Imp shop discount or altered High Score Hydra bark.

## Post-Choice Battle Bark Pool

```text
Pippa: "Combo cleanly. A messy win still leaves crumbs in the gears."
Pippa: "Do not chase points so hard you forget the plate."
Pippa: "Fever rising. Good. Keep it golden, not burnt."
Ticket Imp: "The cake economy is changing!"
Pippa: "About time. It was underproofed."
```

## Victory Callback

```text
Pippa: "There. Scores recorded, cakes served, and the prize glass still mostly attached. A successful service."
```

## Boss Callback — High Score Hydra

If `pippa_flag_shared_prize_cakes` is active:

```text
High Score Hydra: "ONLY THE HIGHEST SCORE MAY FEAST!"

Pippa: "Then you may enjoy the highest score and still pass the plate. You have three heads. Try basic sharing."
```

Effect suggestion: High Score Hydra’s no-cascade punishment weakens after the first successful combo objective.

---

# 10. SCN_PIPPA_06 — Bloxley’s Block Palace
## The Square Cake Problem

```yaml
sceneId: SCN_PIPPA_06
hero: hero_pippa_pyromancer
stage: stage_6_bloxleys_block_palace
location: Bloxley’s Block Palace — Royal Banquet Square
trigger: First Pippa route event in Stage 6 before King Bloxley
routeFlagOpportunity: pippa_flag_baked_square_cake_soft_center
```

## Story Beat

Bloxley’s palace contains a royal banquet table where every plate, napkin, crumb, and cake slice has been forced into a perfect square. Pippa finds a beautiful cake that has been pressed so flat and rigid that no one can enjoy it.

This is Pippa’s final route lesson: structure is not the enemy, but structure without warmth becomes inedible.

## Storyboard Panels

1. A grand banquet hall stretches across the palace in perfect square tiles.
2. Plates sit exactly two block-widths apart.
3. A square cake rests beneath a glass dome, flawless and deeply sad.
4. Royal blocks line the board preview in rigid patterns.
5. Pippa touches the cake with the back of her spoon and frowns.
6. The dialogue choice card appears.

## Pre-Choice Dialogue

```text
Pippa: "This cake is perfect."

Festival Announcer: "That sounds promising."

Pippa: "It was not a compliment. It has no give. No crumb. No welcome. It is architecture with frosting."

Block-O-Matic 3000: "Observed complication: royal dessert meets all geometric standards and fails all hospitality standards."

King Bloxley: "A cake should stand straight, obey corners, and never sag into sentiment!"

Pippa: "A cake should make someone glad they came in from the cold. Corners are optional. Kindness is not."
```

## Dialogue Choices

### A. Normal Lean / Practical

**Choice Label:** `Loosen the Royal Frosting`  
**Choice Preview:** Weaken royal blocks and prepare for the final fight.

```text
Pippa: "Fine. We start with the frosting seams. Too tight, and the whole thing cracks under the knife. Same as a palace."
```

**NPC Response:**

```text
King Bloxley: "My frosting seams are regal!"

Pippa: "They are tense. There is a difference."
```

**Narration:**  
Pippa softens the palace’s frosting-like seals. The royal pattern remains, but its edges become easier to break.

**Gameplay Result:**  
Reduce the first royal block pattern by 1–2 blocks, or reveal the first symmetry warning earlier.

**Route Result:**  
`+1 pippaResolve`; leans toward Normal Ending.

---

### B. True Lean / Hearth

**Choice Label:** `Bake the Crooked Center`  
**Choice Preview:** Answer Bloxley’s square rule with a cake that keeps its shape and its softness.

```text
Pippa: "I will bake your square cake, Bloxley. Proper edges. Clean corners. But the center stays soft, because that is where people meet."
```

**NPC Response:**

```text
King Bloxley: "A soft center is structural weakness!"

Pippa: "No. It is the reason anyone asks for a second slice."
```

**Narration:**  
Pippa bakes a small square cake with warm golden edges and a tender center. For a moment, the royal blocks stop clattering. Even the palace seems to smell butter and reconsider itself.

**Gameplay Result:**  
During the final boss, fire spells can soften royal blocks once per phase. Bloxley’s first symmetry check gives an extra warning.

**Grant Flag:**  
`pippa_flag_baked_square_cake_soft_center`

**Route Result:**  
`+1 pippaHearth`; contributes to True Ending.

---

### C. Risky Lean / Flambé

**Choice Label:** `Crown the Cake in Fire`  
**Choice Preview:** Create a spectacular royal dessert flame for power and risk.

```text
Pippa: "If His Majesty insists on theater, I can provide theater. Nobody blink near the garnish."
```

**NPC Response:**

```text
Block-O-Matic 3000: "Royal flambé event detected. Palace confidence unstable. Dessert visibility exceptional."

Pippa: "Good. If it is going to be ridiculous, it may as well be memorable."
```

**Narration:**  
Pippa crowns the square cake with a harmless tower of festival fire. The palace gasps, the banners shimmer, and several royal blocks become easier to crack.

**Gameplay Result:**  
Gain a rare final-stage fire reward; 25% chance to trigger `oops_square_only` or a harder royal pattern during the final boss.

**Route Result:**  
`+1 pippaFlambe`; may unlock Festival Flambé ending variant.

## Post-Choice Battle Bark Pool

```text
Pippa: "Corners are fine. Cruelty is not."
Pippa: "Royal block ahead. Soften the seam, then cut."
Pippa: "A palace is just a kitchen with worse chairs if nobody feels welcome."
King Bloxley: "Your cake lists dangerously!"
Pippa: "It leans toward generosity. Try to keep up."
```

## Victory Callback

```text
Pippa: "The square held. The center stayed soft. That is not a compromise, Your Majesty. That is baking."
```

## Boss Callback — King Bloxley

If `pippa_flag_baked_square_cake_soft_center` is active:

```text
King Bloxley: "Order must be firm! Corners must command!"

Pippa: "A table can have corners and still make room. Watch closely. This is the part where the palace learns to pass the plate."
```

Effect suggestion: Bloxley’s first royal pattern warning appears earlier, and one royal block softens after Pippa casts Fireball or Cupcake Blast.

---

# 11. Pippa Route Choice Label Summary

| Stage | Practical / Normal | True / Hearth | Risky / Flambé |
| ---: | --- | --- | --- |
| 1 | Scrape the Frosting Valve | Split the Emergency Batch | Caramelize the Spillway |
| 2 | Douse the Overheat Tray | Teach the Oven to Rest | Flash-Bake the Gear Jam |
| 3 | Clear the Freezer Vents | Thaw by the Crumb | Crack the Sugar Ice |
| 4 | Toast the Guard Crumbs | Bake Midnight Rolls | Torch the Blanket Tangle |
| 5 | Win the Cake Fairly | Open the Shared Plate | Flambé the Scoreboard |
| 6 | Loosen the Royal Frosting | Bake the Crooked Center | Crown the Cake in Fire |

---

# 12. Pippa Final Boss Route Dialogue

## 12.1 Before King Bloxley — Normal Lean

Used if Pippa has fewer than 5 true-route flags.

```text
King Bloxley: "Baker of unruly circles, your crumbs offend my court."

Pippa: "Good. Crumbs mean someone ate. A spotless table is usually a lonely one."

King Bloxley: "My palace requires perfect order!"

Pippa: "And my kitchen requires people to leave happier than they arrived. Let us see which rule survives service."
```

## 12.2 Before King Bloxley — True Lean

Used if Pippa has at least 5 true-route flags.

```text
King Bloxley: "You bring fire into my palace of squares?"

Pippa: "I bring an oven, a table, and enough plates for everyone you tried to line up and quiet down."

King Bloxley: "Plates must be even! Portions must be identical! Cakes must obey!"

Pippa: "No. Portions should be fair. Plates should be clean. Cakes should be shared. Obedience is not an ingredient."

Block-O-Matic 3000: "Emotional recipe detected. Components: structure, warmth, permission to belong."

Pippa: "Exactly. Now open the doors before I preheat the throne."
```

## 12.3 Before King Bloxley — Flambé Variant

Used if `pippaFlambe >= 3`.

```text
Festival Announcer: "Additional warning: Pippa has entered the final course with elevated spectacle levels."

Pippa: "I prefer the term properly dramatic."

King Bloxley: "There will be no dramatic frosting in my court!"

Pippa: "Then you should not have built a palace that looks like it needs a centerpiece."
```

---

# 13. Pippa Endings

## 13.1 Pippa Normal Ending — Junior Festival Hearthkeeper

```yaml
endingId: ending_pippa_normal
requirements:
  - defeat_king_bloxley_as_pippa
  - pippaHearth < 5 OR fewer_than_5_pippa_true_flags
```

### Storyboard Panels

1. The Block-O-Matic settles into a gentle hum.
2. Pippa returns to the festival square carrying a recovered tray of cupcakes.
3. The Cake Stall reopens with a line of villagers, monsters, and one nervous goblin safety inspector.
4. Pippa pins a small sign above the oven: `NO PREHEAT WITHOUT PURPOSE`.
5. A Cupcake Slime tries to steal a sprinkle and is handed a napkin instead.

### Ending Text

```text
The festival ovens glowed again.

The cakes were recovered, repaired, re-frosted, and arranged with only modest professional grumbling.

Pippa became the festival’s Junior Hearthkeeper, which mostly meant baking for everyone, scolding unsafe machinery, and keeping one eye on every slime within spoon range.
```

### Final Dialogue

```text
Milo: "The cakes smell like the festival again."

Pippa: "They smell like three hours of work, six ruined towels, and victory. Which is close enough."

Cupcake Slime: "Gloop?"

Pippa: "Yes, you may have one. One means one. Do not make me define numbers with a spatula."
```

### Result

```text
Unlock: Pippa ending gallery entry
Unlock: Cake Stall cosmetic upgrade
Optional: Fire spell cosmetic — Hearth Flame
```

---

## 13.2 Pippa True Ending — The Hearth Table

```yaml
endingId: ending_pippa_true
requirements:
  - defeat_king_bloxley_as_pippa
  - pippaHearth >= 5
  - at_least_5_pippa_true_flags
```

### Storyboard Panels

1. The final royal block cracks open, not with a blast, but with the smell of warm cake.
2. Bloxley’s square banquet table unfolds into a long festival table.
3. The Cupcake Slimes bring plates. Goblins bring repaired utensils. Nixie carries gelato that has not melted.
4. Pippa places a square cake with a soft center at the middle of the table.
5. Bloxley receives the first corner slice.
6. The Block-O-Matic prints a tiny menu card that reads: `FESTIVAL HEARTH MODE ENABLED`.

### Ending Text

```text
Pippa did not defeat the palace by burning it down.

She gave it a table.

The Block-O-Matic learned that order could help a feast, but could not replace one.

From then on, the Festival of Falling Stars began with the Hearth Table: one long meal where villagers, heroes, goblins, slimes, toy soldiers, arcade sprites, and one very particular block king all received a proper plate.
```

### Final Dialogue

```text
King Bloxley: "This cake is square."

Pippa: "Yes."

King Bloxley: "But the center is soft."

Pippa: "Also yes."

King Bloxley: "It is... structurally confusing."

Pippa: "Take a bite before filing a royal complaint."

King Bloxley: "...The complaint is postponed."

Pippa: "Good. Have tea. It improves most constitutions."
```

### Result

```text
Unlock: Pippa True Ending gallery entry
Unlock: Hearth Table hub building upgrade
Unlock: Cupcake Slime friendship bonus upgrade
Unlock: Fire spell visual variant — Hearthfire
```

---

## 13.3 Festival Flambé Variant Scene

```yaml
endingVariantId: ending_pippa_flambe_variant
requirements:
  - pippaFlambe >= 3
  - any_pippa_ending_unlocked
```

### Storyboard Panels

1. Pippa stands beside the restored Cake Stall at night.
2. Safety sprites hold buckets, blankets, and clipboards.
3. The Festival Announcer counts down with solemn importance.
4. Pippa flicks her whisk-wand.
5. A crown of harmless golden fire blooms above a cake and becomes tiny star-shaped sparks.
6. Nobody catches fire. Everyone cheers louder than expected.

### Variant Dialogue

```text
Festival Announcer: "For the first time in Brixonian history, the Festival Flambé has passed safety review."

Safety Sprite: "Barely."

Pippa: "Barely is still baked."

Milo: "It looks like a tiny sunrise."

Pippa: "Good. That is what breakfast has been trying to tell everyone for years."
```

### Result

```text
Unlock: Festival Flambé cosmetic VFX for Pippa victory pose
```

---

# 14. Pippa Hub Bark Pool

Use these after Pippa route scenes or Cake Stall upgrades.

```text
Pippa: "Do not stack cupcakes by height. Stack them by who has not eaten yet."
Pippa: "The oven is behaving today. Suspicious, but welcome."
Pippa: "If a slime offers to help frost something, count your spoons before and after."
Pippa: "Fireball is not anger. Fireball is preheating with boundaries."
Pippa: "A good festival smells like bread, sugar, and someone finally fixing the left banner."
Pippa: "No, Bloxley, square biscuits are not morally superior. They are just easier to pack."
```

---

# 15. Pippa Battle Bark Pool

## 15.1 Generic Combat

```text
Pippa: "Edges first. The center will follow."
Pippa: "That block is underbaked. Hit it again."
Pippa: "Too much clutter. We are clearing counter space."
Pippa: "A clean line is a clean tray. Very satisfying."
Pippa: "Keep the heat steady. Wild flames waste good sugar."
```

## 15.2 Fire Spell Cast

```text
Pippa: "Preheating."
Pippa: "Golden, not burnt."
Pippa: "One clean flame."
Pippa: "Mind the frosting."
Pippa: "Kitchen correction incoming."
```

## 15.3 Sticky / Junk Counter

```text
Pippa: "Sticky mess on the board. Finally, a problem with manners."
Pippa: "Junk blocks are just crumbs with ambition. Sweep them."
Pippa: "Burn the edge, scrape the rest."
Pippa: "No crumb gets to call itself architecture."
```

## 15.4 Low HP

```text
Pippa: "I am not done. The second batch has not even cooled."
Pippa: "Someone guard the tray. I need one clean breath."
Pippa: "Fine. Emergency frosting rules."
```

## 15.5 Victory

```text
Pippa: "Service complete. Next disaster, please wait in line."
Pippa: "Board cleared, snacks saved, dignity mostly intact."
Pippa: "That was messy, but it would pass a festival inspection. Barely."
```

---

# 16. Implementation JSON Draft

This is a lightweight structure for converting Pippa’s route into data files later.

```json
{
  "routeId": "route_pippa_pyromancer",
  "heroId": "hero_pippa_pyromancer",
  "routeScores": {
    "resolve": "pippaResolve",
    "hearth": "pippaHearth",
    "flambe": "pippaFlambe"
  },
  "trueEndingRequiredFlags": 5,
  "scenes": [
    {
      "sceneId": "SCN_PIPPA_01",
      "stageId": "stage_1_sprinkle_sewers",
      "flagOpportunity": "pippa_flag_spared_cupcake_slime_batch",
      "choices": [
        "Scrape the Frosting Valve",
        "Split the Emergency Batch",
        "Caramelize the Spillway"
      ]
    },
    {
      "sceneId": "SCN_PIPPA_02",
      "stageId": "stage_2_goblin_workshop",
      "flagOpportunity": "pippa_flag_relit_responsible_oven",
      "choices": [
        "Douse the Overheat Tray",
        "Teach the Oven to Rest",
        "Flash-Bake the Gear Jam"
      ]
    },
    {
      "sceneId": "SCN_PIPPA_03",
      "stageId": "stage_3_frosty_pantry",
      "flagOpportunity": "pippa_flag_warmed_frozen_share_crates",
      "choices": [
        "Clear the Freezer Vents",
        "Thaw by the Crumb",
        "Crack the Sugar Ice"
      ]
    },
    {
      "sceneId": "SCN_PIPPA_04",
      "stageId": "stage_4_pillow_castle",
      "flagOpportunity": "pippa_flag_baked_midnight_rolls",
      "choices": [
        "Toast the Guard Crumbs",
        "Bake Midnight Rolls",
        "Torch the Blanket Tangle"
      ]
    },
    {
      "sceneId": "SCN_PIPPA_05",
      "stageId": "stage_5_starfall_arcade",
      "flagOpportunity": "pippa_flag_shared_prize_cakes",
      "choices": [
        "Win the Cake Fairly",
        "Open the Shared Plate",
        "Flambé the Scoreboard"
      ]
    },
    {
      "sceneId": "SCN_PIPPA_06",
      "stageId": "stage_6_bloxleys_block_palace",
      "flagOpportunity": "pippa_flag_baked_square_cake_soft_center",
      "choices": [
        "Loosen the Royal Frosting",
        "Bake the Crooked Center",
        "Crown the Cake in Fire"
      ]
    }
  ],
  "endings": {
    "normal": "ending_pippa_normal",
    "true": "ending_pippa_true",
    "variant": "ending_pippa_flambe_variant"
  }
}
```

---

# 17. Codex Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth.

Task:
Implement Pippa's character route dialogue data using the new variable-choice route format.

Goal:
Pippa must have stage-specific route scenes, unique choice labels, distinct baking/fire/hearth voice, route flags, route scores, Normal Ending, True Ending, and optional Festival Flambé variant.

Do not reuse Milo's choice labels or sentence patterns.
Do not make Pippa sound like a generic cheerful hero.
Do not use dark curse lore or grim stakes.
Keep the tone cheerful, warm, festival-themed, and mobile-readable.

Pippa voice:
- brisk festival baker;
- hot-tempered but kind;
- serious about food and hospitality;
- uses baking, oven, frosting, crumb, tray, heat, hearth, batch, glaze, and service wording;
- fire is discipline and warmth, not only anger.

Create or update data for:
- route_pippa_pyromancer
- SCN_PIPPA_01 through SCN_PIPPA_06
- pippa route score fields: pippaResolve, pippaHearth, pippaFlambe
- true route flags:
  - pippa_flag_spared_cupcake_slime_batch
  - pippa_flag_relit_responsible_oven
  - pippa_flag_warmed_frozen_share_crates
  - pippa_flag_baked_midnight_rolls
  - pippa_flag_shared_prize_cakes
  - pippa_flag_baked_square_cake_soft_center
- endings:
  - ending_pippa_normal
  - ending_pippa_true
  - ending_pippa_flambe_variant

Each scene must include:
- sceneId
- heroId
- stageId
- location
- trigger
- storyboard beats
- pre-choice dialogue
- 3 choices with unique labels
- player line
- NPC response
- narration
- gameplay result
- route result
- optional boss callback
- post-choice bark pool
- victory callback

Acceptance criteria:
- No repeated choice label templates across Pippa stages.
- Pippa's lines are recognizable without speaker name.
- Choice A leans practical/Normal.
- Choice B leans True/Hearth and grants the stage flag.
- Choice C leans risky/Flambé and may add Oopsie/reward variance.
- Normal and True ending conditions work.
- Dialogue can be skipped.
- Content validation passes if a validator exists.
- Build passes.

Response format:
Summary / Files changed / Route data added / Commands run / Manual test steps / Known limitations.
```

---

# 18. QA Checklist

## 18.1 Voice QA

- [ ] Pippa sounds brisk, warm, culinary, and protective.
- [ ] Pippa does not sound like Milo.
- [ ] Pippa does not sound like Zuzu, Nixie, Bruk, or Lumi.
- [ ] Fire language is about controlled heat, service, warmth, and correction.
- [ ] Jokes come from kitchen logic and festival situations, not internet phrasing.

## 18.2 Choice Label QA

- [ ] Each stage has three unique choice labels.
- [ ] Choice labels are short enough for mobile UI.
- [ ] Practical choices sound efficient and kitchen-safe.
- [ ] True choices sound generous, warm, and hospitality-driven.
- [ ] Risky choices sound bold, fiery, and spectacle-oriented.

## 18.3 Route Logic QA

- [ ] Choice A increases `pippaResolve`.
- [ ] Choice B increases `pippaHearth` and grants the stage true-route flag.
- [ ] Choice C increases `pippaFlambe` and may add risk/reward variance.
- [ ] Pippa Normal Ending triggers with insufficient true-route progress.
- [ ] Pippa True Ending triggers with at least 5 true-route flags and enough `pippaHearth`.
- [ ] Festival Flambé variant triggers if `pippaFlambe >= 3`.

## 18.4 Gameplay Integration QA

- [ ] Pippa’s passive supports burning sticky/junk blocks.
- [ ] Stage 1 route interacts with sticky/sprinkle pressure.
- [ ] Stage 2 route interacts with junk/bomb/board shake pressure.
- [ ] Stage 3 route interacts with freeze/ice/speed pressure.
- [ ] Stage 4 route interacts with Sleepy/soft block pressure.
- [ ] Stage 5 route interacts with Fever/combo pressure.
- [ ] Stage 6 route interacts with royal blocks/symmetry pressure.

---

# 19. Writer Notes for Future Pippa Scenes

When adding more Pippa content, remember:

```text
Pippa's fire should mature from "give me back my cupcakes" into "everyone deserves a place at the table."
```

Good Pippa scene ingredients:

- something unsafe in the kitchen;
- food used selfishly or carelessly;
- Pippa almost overreacting;
- a chance to choose control, generosity, or spectacle;
- a small culinary image that reveals emotional growth.

Avoid writing Pippa as only angry.  
Her anger should point to care.

