# Blockmancer Dungeon — Story, Routes, and Dialogue Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for story premise, writing style, route scenes, character voice, boss intros, endings, and player-facing microcopy.

## 1. Story Premise

During the Festival of Falling Stars, the Block-O-Matic 3000 mixes festival mode with battle mode and opens a colorful dungeon beneath Brixonia. The heroes restore the festival by clearing magical block chaos, helping monsters calm down, and showing King Bloxley that order should make room for welcome.

Story tone is warm, whimsical, polished, and readable on mobile.

## 2. Writing Direction

Use:

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

Avoid:

```text
Meme phrasing
Sarcastic Reddit-style punchlines
Modern slang that breaks the fairytale-festival mood
Jokes that undercut emotional moments
Dark curse / doom / gore / horror language
```

Prefer:

```text
Gentle wit
Clear emotional intent
Short dialogue lines
Playful but polished descriptions
Distinct hero voices
Comedic situations rather than commentary jokes
```

## 3. Opening Story Beat

Opening summary:

```text
Festival square is bright with lanterns and paper stars.
Professor Poplin presents the Block-O-Matic 3000.
A forbidden button is pressed by festive accident.
The machine combines Festival Mode and Battle Mode.
The town square becomes a cheerful block dungeon entrance.
Milo hears the first rune block say plink-plonk.
Tutorial begins.
```

## 4. Route Structure

Release route scope:

```text
6 playable heroes × 6 stages = 36 unique hero-stage route scenes
```

Route flow:

```text
Selected hero enters stage
→ unique hero-stage route trigger appears
→ player chooses Practical / True / Risky
→ route stat and flag update
→ gameplay reward or risk applies
→ boss callback reflects route state
→ ending resolver checks Normal / True / Risky Variant after King Bloxley
```

Every route scene has exactly three choices:

| Lane | Purpose | Required Result |
| --- | --- | --- |
| Practical | Safe, useful, normal-route progression. | +1 practical score and a stable reward. No true flag. No oopsie. |
| True | Empathy, accountability, care, wishkeeping, or deeper route insight. | +1 true score, one unique stage true flag, and a thoughtful reward or boss modifier. |
| Risky | Stylish festival action with stronger reward and possible setback. | +1 risky score, stronger reward, possible Oopsie or hazard increase. |

## 5. Hero Voice Rules

| Hero | Route Arc | Voice Direction |
| --- | --- | --- |
| Milo | Listening is stronger than control. | Soft, observant, careful; plink-plonk, rhythm, quiet, space, listening. |
| Pippa | Protective fire becomes hearth-warmth. | Brisk baker voice; oven, tray, batch, frosting, crumbs, hearth. |
| Zuzu | Field-test chaos becomes accountable repair ethics. | Fast goblin engineer; prototype, clamps, calibration, patch, warranty, safety margin. |
| Nixie | Freezing problems becomes preserving what matters. | Calm frostbinder; chill, thaw, flavor, syrup, preserve, settle, breathe. |
| Bruk | Guarding snacks becomes hospitality as protection. | Loyal snack knight; oath, table, ration, shield, plate, guest, banquet. |
| Lumi | Following lights becomes keeping wishes. | Dreamy star witch; lanterns, wishes, constellations, shimmer, paper stars, crownlight. |

Voice QA rule:

```text
If a dialogue line can move between two heroes without changing words, rewrite it.
```

## 6. Stage Story Hooks

| Stage | Shared Story Hook | Boss Rule Card Direction |
| ---: | --- | --- |
| 1 | Recover lost cupcakes in candy sewers. | Sticky Situation. Clear sticky blocks early, then cascade. |
| 2 | Disable goblin machines safely. | Totally Safe Machine Test. Watch junk queue and use bombs patiently. |
| 3 | Save ice cream crates in a magical freezer. | Brain Freeze Warning. Counter freeze before active piece traps. |
| 4 | Keep Pillow Castle peaceful. | Do Not Wake the Pillow Knight. Manage soft blocks and Sleepy. |
| 5 | Reach arcade combo target. | Combo or Be Chomped. Build and release Showtime safely. |
| 6 | Break royal seals in Bloxley’s palace. | Everything Must Be Square. Break royal patterns without obeying the whole board. |

## 7. Ending Rules

Recommended thresholds:

```ts
const TRUE_ENDING_MIN_FLAGS = 5;
const TRUE_ENDING_MIN_SCORE = 5;
const VARIANT_MIN_RISK_SCORE = 3;
```

Ending behavior:

- Normal Ending: defeat King Bloxley without meeting True Ending threshold.
- True Ending: defeat King Bloxley with enough true score and true flags.
- Risky Variant: if risky score is high enough, add a flavor panel after Normal or True Ending. It must not replace either ending.

## 8. Fever Showtime Microcopy

Use Fever wording that feels theatrical and clear, not technical-only.

Recommended terms:

```text
Fever Ready
Showtime!
Charged Lines
Release Showtime
Fever Heat
Soft Junk
Boss Drama Guard
Showtime Overflow
Star Encore
```

Safety copy examples:

```text
Showtime is getting crowded. Release soon!
The boss braces for drama. Overflow becomes a safer reward.
Charged Lines fade after this battle. Spend them with style.
```

Do not imply Charged Lines persist between nodes.

## 9. Upgrade System Microcopy

Upgrade flow copy:

```text
Choose your upgrade path.
Hero improves your character.
Board improves stacking, cascades, Hold, Queue, and hazard control.
Fever improves Showtime, Charged Lines, release timing, Heat, and Overflow.
```

Slot copy:

```text
Hero Slots: 1/2
Board Slots: 0/2
Fever Slots: 1/2
Total Slots: 2/5
```

Full-category copy:

```text
Hero slots full.
Board slots full.
Fever slots full.
Upgrade slots full. Level owned cards or evolve Lv5 cards.
```

Card-state labels:

```text
New Card
Owned Card
Lv1
Lv2
Lv3
Lv4
Lv5
Ready to Evolve
Legendary Evolution
Legendary
```

Legendary Evolution copy:

```text
Legendary Evolution!
Choose how this card transforms.
```

Fallback copy:

```text
No valid cards available in this category right now. Choose another path.
This card is waiting for a valid Legendary Evolution.
```

## 10. Dialogue Data Shape

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

## 11. Narrative QA

- Route scenes must be mobile-readable.
- Choice labels should be short.
- Dialogue should not exceed the card layout.
- Boss rule text should teach mechanics clearly.
- Upgrade and Fever text must not contradict gameplay rules.
- Avoid generic hero dialogue that erases hero identity.
