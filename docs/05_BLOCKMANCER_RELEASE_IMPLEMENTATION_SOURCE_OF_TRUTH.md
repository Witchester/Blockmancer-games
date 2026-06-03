# Blockmancer Dungeon — Release Implementation Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for implementation status, release priorities, validation expectations, and agent prompt planning.

## 1. Implementation Truth Policy

Do not treat plans, prompts, or SOT text as proof of implementation.

Implementation status must come from:

```text
repo audit
code inspection
build result
validation result
manual smoke result
automated test result when available
```

This file records target implementation direction and verification gates. If code audit proves status changed, update this file first.

## 2. Current High-Level Status

| Area | Status | Notes |
| --- | --- | --- |
| Cascade Gravity | Implemented target, must be protected by tests/smoke. | Do not rewrite. |
| Fever Showtime Cascade | Target design active; implementation must be audited in repo. | Board-local state never persists between nodes. |
| Upgrade System Redesign | Current target design; implementation should proceed through Prompt 1-8. | Hero / Board / Fever, slots, Lv1-Lv5, Legendary Evolution. |
| Sequential Encounter Packs | Target design active; implementation must be audited. | One active enemy at a time. |
| Node Result Screen | Target design active; implementation must be audited. | Shows EXP gained/breakdown/remaining. |
| Reactive Difficulty | Partial target area until verified. | Hazards require warning + counterplay. |
| Assets/Animation | Fallback-safe target; final art may still be incomplete. | Missing art should warn, not crash. |
| Save Migration | P0 for new run-state fields. | Missing/partial state normalizes safely. |

## 3. Required Validation Commands

Use commands available in the repo. AGENTS.md owns final command usage. Common commands:

```bash
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run build
npm run test
```

If `test` or `lint` does not exist, report that honestly and do not invent scripts.

## 4. Release Guardrails

- Preserve Cascade Gravity behavior.
- Preserve cheerful festival tone.
- Preserve portrait-mobile readability.
- Preserve fallback-safe assets/audio/content.
- Preserve save-facing IDs unless migration is documented.
- Do not create new top-level asset folders without updating `06`.
- Do not let unsupported effect IDs silently do nothing.
- Do not let plans or prompts overwrite audited implementation reality.

## Fever Showtime Cascade — Current Canonical Rules

Fever is Showtime Cascade mode, not a passive always-on buff.

Lifecycle:

```text
Fill Fever meter
→ Activate Showtime
→ Completed lines become Charged Lines
→ Stack during a short lock window
→ Release manually or automatically
→ Clear Charged Lines together
→ Resolve through normal Cascade Gravity
→ Apply combat damage, boss caps, overflow, pressure safety, and upgrade effects
```

Rules:

- Completed rows during Showtime become Charged Lines and do not clear immediately.
- Fever release must resolve through the existing Cascade Gravity system.
- Physical board state is encounter-local.
- Charged Lines, Soft Junk, Fever Heat, and unresolved release state never persist between nodes.
- Bosses and final bosses use Boss Drama Guard caps so Fever cannot one-shot or skip multiple phases.
- Boss/enemy block-add during Fever uses Pressure Budget, Soft Junk, and Fever Heat.
- Fever UI lives in compact HUD/right-rail/control patterns; do not create a separate top HP/Mana/Fever bar.


## Upgrade System Redesign — Current Canonical Rules

The upgrade system is split into three player-chosen categories:

```text
Hero
Board
Fever
```

Level-up flow:

```text
Node cleared
→ Node Result Screen
→ Level Up Ready
→ Choose upgrade category: Hero / Board / Fever
→ Show 3 upgrade cards from the selected category
→ Player picks 1 card
```

Card rarity/rank labels are removed from the normal upgrade system. Do not use Common / Uncommon / Rare / Epic / Legendary as normal card ranks.

Normal card progression is:

```text
Card Lv1 → Lv2 → Lv3 → Lv4 → Lv5 → Legendary Evolution
```

Every upgrade card has exactly 5 normal levels. Every level must provide a meaningfully different effect or behavior change. Avoid simple numeric-only stacking.

Slot rules:

```text
Total run upgrade slots: 5
Hero slots: max 2
Board slots: max 2
Fever slots: max 2
```

Valid examples:

```text
2 Hero / 2 Board / 1 Fever
2 Hero / 1 Board / 2 Fever
1 Hero / 2 Board / 2 Fever
```

Invalid examples:

```text
5 Hero
5 Board
5 Fever
```

Owned-card selection levels the card and does not consume a new slot. New-card selection claims an available category slot.

Owned cards should reappear more often than unowned cards. Higher-level owned cards should reappear more often than lower-level owned cards. Lv4 cards should receive strong priority so players can finish a build. Lv5 and Legendary cards are removed from the normal offer pool.

When a card reaches Lv5:

```text
Card reaches Lv5
→ readyToEvolve = true
→ play or queue evolution transition
→ show 2 Legendary Evolution choices from that card’s pool
→ player chooses 1
→ save legendaryEvolutionId
→ card becomes Legendary
```

Each active card should have at least 10 possible Legendary Evolutions. Only 2 are shown at evolution time. Legendary Evolution uses the same slot and does not consume an extra slot.

Hero-specific cards only appear for the selected hero. Generic Hero cards can appear for any hero. Board cards must preserve Cascade Gravity. Fever cards must respect Fever Showtime caps, Boss Drama Guard, and board-local state rules.


## Upgrade Runtime Data Model

Target card definition:

```ts
type UpgradeCategory = "hero" | "board" | "fever";

type UpgradeCardDefinition = {
  id: string;
  category: UpgradeCategory;
  heroId?: string;
  isGenericHeroCard?: boolean;
  maxLevel: 5;
  slotCost: 1;
  levels: UpgradeCardLevel[];
  legendaryPool: LegendaryEvolutionDefinition[];
};

type UpgradeCardLevel = {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  effectType: string;
  effectConfig: Record<string, unknown>;
};

type LegendaryEvolutionDefinition = {
  id: string;
  name: string;
  description: string;
  effectType: string;
  effectConfig: Record<string, unknown>;
  tags: string[];
  unlockCondition?: LegendaryUnlockCondition;
};
```

Target run state:

```ts
type RunUpgradeCardState = {
  cardId: string;
  category: "hero" | "board" | "fever";
  level: 1 | 2 | 3 | 4 | 5;
  slotIndex: number;
  readyToEvolve?: boolean;
  legendaryEvolutionId?: string;
};

type RunUpgradeSlotState = {
  index: number;
  category?: "hero" | "board" | "fever";
  cardId?: string;
};

type RunUpgradeState = {
  version: number;
  slots: RunUpgradeSlotState[];
  ownedCards: Record<string, RunUpgradeCardState>;
  compatibilityUpgradeIds?: string[];
};
```

Save/load rules:

- New runs create a valid empty `RunUpgradeState` with 5 slots.
- Missing, partial, or malformed upgrade state normalizes safely.
- Compatibility upgrade IDs must not crash old saves.
- Save state preserves card category, level, slot index, ready-to-evolve state, and selected Legendary Evolution.
- Fever board-local state is not stored between nodes.


## Canonical Upgrade Card Pools

### Hero Cards

Hero-specific:

| Hero | Card | Direction |
| --- | --- | --- |
| Milo | Listening Lines | Cascade, mana, warnings, careful board reading. |
| Pippa | Hearthfire | Fire, spell cleanup, sticky/junk control. |
| Zuzu | Safe Prototype | Bombs, gadgets, junk risk control. |
| Nixie | Slow the Room | Freeze, speed, tempo control. |
| Bruk | Table Guard | Shield, pressure response, emergency rescue. |
| Lumi | Star Path | Star blocks, cascade, Fever release timing. |

Hero-generic:

```text
Hero Focus
Festival Courage
Careful Footing
Clever Timing
```

Hero synergy direction:

| Hero | Preferred Build Direction |
| --- | --- |
| Milo | Hero + Board; cascade, mana, warning hints. |
| Pippa | Hero + Board cleanup; fire, sticky, junk control. |
| Zuzu | Hero + Board chaos; bomb, gadget, junk risk control. |
| Nixie | Hero + Board tempo; freeze, speed, ice control. |
| Bruk | Hero + Board defense; shield, pressure, emergency rescue. |
| Lumi | Hero + Fever + Board; star, cascade, Showtime timing. |

### Board Cards

```text
Gravity Choir
Tidy Falling
Deep Stack Rhythm
Space Reader
Pocket Planner
Queue Comb Training
Early Warning Ribbon
Soft Landing
Square Etiquette
```

Board category owns Cascade Gravity rewards, Hold, Next Queue, board space/profile, hazard blocks, Soft Junk, royal blocks, low ceiling, special blocks, and line-clear utility.

### Fever Cards

```text
Festival Hype
Longer Showtime
Bigger Stage
Graceful Release
Safety Confetti
Showtime Overflow
Star Encore
Stagecraft
```

Fever category owns Fever gain, Showtime duration, Charged Lines, manual release, auto release, Fever Heat, Soft Junk conversion, Showtime Overflow, Boss Drama Guard interaction, and Star Encore.

Fever hard limits:

```text
Cannot bypass Boss Drama Guard.
Cannot increase boss direct damage caps unsafely.
Cannot skip multiple boss phases.
Cannot create infinite Fever loops.
Cannot preserve Charged Lines between nodes.
```


## Upgrade Compatibility Mapping

Save-facing upgrade IDs must remain safe. Existing run data that references earlier upgrade IDs should be mapped, aliased, or preserved in compatibility storage.

| Compatibility ID | New Direction |
| --- | --- |
| `upg_clean_stack` | Board / Space Reader or Soft Landing |
| `upg_sharp_sprinkles` | Board / Gravity Choir |
| `upg_extra_frosting` | Hero / Festival Courage |
| `upg_mana_lemonade` | Hero / Hero Focus |
| `upg_combo_cheer` | Board / Gravity Choir or Deep Stack Rhythm |
| `upg_bigger_booms` | Hero / Zuzu — Safe Prototype |
| `upg_hotter_oven` | Hero / Pippa — Hearthfire |
| `upg_chill_zone` | Hero / Nixie — Slow the Room |
| `upg_pocket_snack` | Hero / Bruk — Table Guard or Festival Courage |
| `upg_bonus_preview` | Board / Queue Comb Training |
| `upg_quick_hold` | Board / Pocket Planner |
| `upg_inventory_pouch` | Keep as compatibility/shop/meta utility unless already used by run upgrades |
| `upg_lucky_roll` | Hero / Clever Timing |
| `upg_festival_fever` | Fever / Festival Hype |
| `upg_smooth_cascade` | Board / Gravity Choir |


## Upgrade Validation Rules

Validation should check:

```text
Every card belongs to Hero / Board / Fever.
Every card has maxLevel = 5.
Every card has slotCost = 1.
Every card has exactly 5 normal levels.
Every level has title, description, effectType, and effectConfig.
Every level effectType has a runtime handler or explicit safe fallback warning.
Every active card has a Legendary pool.
Every active card has at least 10 Legendary options, or a tracked warning while content is partial.
Only 2 Legendary options are shown during evolution.
Legendary Evolution does not consume an extra slot.
Category slot limits are respected.
Hero-specific cards only appear for the selected hero.
Generic Hero cards can appear for any hero.
Fever cards cannot bypass Boss Drama Guard.
Fever cards cannot create infinite Fever loops.
Fever cards cannot preserve Charged Lines between nodes.
Board cards cannot replace or break Cascade Gravity.
Lv5 and Legendary cards stop appearing as normal upgrade cards.
Compatibility upgrade IDs are safe.
```


## 5. Upgrade Redesign Implementation Phases

### Prompt 1 — Audit + Data Model + Save Migration Foundation

Goal:

```text
Prepare upgrade-card types, run upgrade state, defaults, normalization, and compatibility storage.
```

Acceptance:

```text
New runs have valid upgrade-card state.
Old saves load safely.
Current reward flow remains unchanged.
```

### Prompt 2 — Slot Enforcement + Category-First Flow

Goal:

```text
Node Result → Level Up Ready → choose Hero / Board / Fever → show category-filtered cards.
```

Acceptance:

```text
5 total slots, max 2 per category, full categories blocked, owned cards level without consuming slots.
```

### Prompt 3 — Card Progression + Reappearance Weighting

Goal:

```text
Lv1-Lv5 progression, owned-card weighting, Lv4 priority, Lv5 readyToEvolve.
```

Acceptance:

```text
Lv5 and Legendary cards leave normal pool; duplicate offers prevented; save/load preserves levels.
```

### Prompt 4 — Content Migration + Runtime Handlers

Goal:

```text
Create Hero / Board / Fever card content, Lv1-Lv5 effects, handlers or explicit safe fallback warnings.
```

Acceptance:

```text
Required card pools exist; every effectType is handled or warned; compatibility IDs remain safe.
```

### Prompt 5 — Legendary Evolution Selection

Goal:

```text
Lv5 card triggers or queues Legendary Evolution; show 2 choices from card pool; save selected Legendary.
```

Acceptance:

```text
Legendary uses same slot; no extra slot consumed; pending evolution survives save/load.
```

### Prompt 6 — Validation + Smoke + Balance Gate

Goal:

```text
Validate schema, slots, categories, handlers, save/load, Fever safety, Cascade safety, and smoke cases.
```

Acceptance:

```text
Build/validation status known; bugs fixed or documented; balance outliers noted.
```

### Prompt 7 — UX Polish + Release Handoff

Goal:

```text
Polish copy, slot feedback, card states, fallback messages, and implementation report.
```

Acceptance:

```text
UI copy is readable; full-slot states clear; docs/report updated; no debug text leaks.
```

### Prompt 8 — Post-Implementation Audit + Regression Gate

Goal:

```text
Audit full implementation honestly: Done / Partial / Missing / Risk / Blocked.
```

Acceptance:

```text
Audit report exists; save/load, Cascade Gravity, Fever Showtime, and upgrade rules verified or risks documented.
```

## 6. Upgrade Audit Matrix

Post-implementation audit must check:

```text
UpgradeCardDefinition type exists
UpgradeCategory supports hero / board / fever
RunUpgradeState exists
Default new-run upgrade state exists
Old-save migration exists
Compatibility upgrade IDs are safe
Category selection appears before card offers
Total slot cap 5 enforced
Max 2 slots per category enforced
Owned cards level without consuming slot
Lv5 cards become readyToEvolve
Legendary Evolution shows 2 choices
Legendary saves legendaryEvolutionId
Hero-specific cards filter correctly
Board cards preserve Cascade Gravity
Fever cards respect Boss Drama Guard
Every active card has 5 levels
Every effectType has handler or explicit fallback
Empty/low-card pools fail safely
UI copy is readable
Validation scripts cover upgrade-card rules
```

## 7. Final Response Format for Implementation Agents

Implementation agents should return:

```text
Files inspected
Files changed
Systems changed
Content added or migrated
Save migration notes
Validation commands run and result
Manual smoke cases tested
Known limitations / follow-up risks
```
