# Blockmancer Dungeon — Reactive Difficulty & Item Counter Implementation Plan
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## Current Reactive Difficulty Status — 2026-05-18

The reactive difficulty direction remains correct, but it is **partial** at runtime.

| Phase | Status | Notes / next action |
| --- | --- | --- |
| R0 Audit | Done | Integration points were audited in the Release 1 code audit. |
| R1 Counter tags / item schema | Partial/Done | Counter items and schema support exist, but behavior coverage must be checked against `ItemSystem.applyEffect`. |
| R2 Incoming junk queue | Partial | Warning/counter concepts exist, but end-to-end enemy behavior, cascade reduction, and item counter smoke tests are required. |
| R3 Floating blocks | Partial | Floaty block content/assets exist; countdown/counter behavior needs full gameplay verification. |
| R4 Hazard counter windows | Partial | Hazard UI/warnings exist conceptually; every hazard needs a test case and counter verification. |
| R5 Spell catalysts | Partial | Catalyst item content exists; next-spell modifier behavior must be confirmed for each catalyst. |
| R6 Relic/hero synergies | Partial | Passives/relics exist but many are shallow or switch-based. |
| R7 Warning tray/counter hints | Partial | Runtime has warning/variant hooks; UI must be tested on portrait mobile. |
| R8 Balance | Not complete | Tune after Stage 1 vertical slice is stable. |
| R9 QA/debug | Partial | Debug scene exists; add specific hazard triggers and smoke checklist. |

Priority next step: build a **reactive difficulty smoke test matrix** for incoming junk, floaty blocks, freeze, low ceiling, preview disruption, speed wave, royal pattern, and item/spell counters.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

This plan implements the new difficulty/setback direction from `docs/01_GDD_MASTER.md` sections 21 and 22.

Goal:

```text
Raise difficulty by adding readable board pressure and reactive counterplay.
Players should solve danger through cascades, spells, items, relics, hero passives, and smart stacking.
```

Do not implement everything in one pass. Use the phases below so the game remains playable after each step.

---

## 1. Scope Summary

Add these systems and content:

- Floating blocks.
- Incoming junk queue.
- Bad piece delivery.
- Low ceiling / board size pressure.
- Preview disruption improvements.
- Speed/freeze/sleep counter windows.
- Royal pattern warnings.
- Reactive item counter tags.
- Spell catalyst items.
- Item/spell/relic/cascade synergy hooks.
- Hazard warning UI.
- Balance and QA coverage.

Core rule:

```text
Every major hazard must have at least one item counter and one spell/cascade/relic/hero counter.
```

---

## 2. New Data Model

### Counter Tags

```ts
type CounterTag =
  | "counter_junk"
  | "counter_sticky"
  | "counter_float"
  | "counter_freeze"
  | "counter_preview"
  | "counter_speed"
  | "counter_sleep"
  | "counter_incoming_junk"
  | "counter_low_ceiling"
  | "counter_royal"
  | "counter_pattern"
  | "counter_board_size"
  | "counter_piece_queue";
```

### Reactive Item Fields

```ts
type ItemCategory =
  | "heal"
  | "mana"
  | "board_cleanse"
  | "hazard_counter"
  | "spell_catalyst"
  | "queue_control"
  | "enemy_pressure"
  | "emergency"
  | "risk_reward";

type ItemTiming =
  | "instant"
  | "before_spell"
  | "after_hazard"
  | "during_enemy_warning"
  | "before_piece_lock"
  | "map_only"
  | "shop_only";

type ReactiveItemContent = {
  id: string;
  name: string;
  description: string;
  itemCategory: ItemCategory;
  counterTags: CounterTag[];
  timing: ItemTiming;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  maxStack: number;
  spellSynergyTags?: string[];
  effectConfig: Record<string, unknown>;
  assetKey?: string;
  iconKey?: string;
};
```

### Hazard Counter Window Fields

```ts
type HazardCounterWindow = {
  hazardId: string;
  name: string;
  warningText: string;
  counterTags: CounterTag[];
  counterWindowPieces: number;
  severity: "minor" | "moderate" | "major" | "boss";
  defaultFailureEffect: string;
  itemCounterHints: string[];
  spellCounterHints: string[];
  cascadeCounterHint?: string;
};
```

---

## 3. Content to Add

### Board / Hazard Blocks

| ID | Name | Role |
| --- | --- | --- |
| `block_floaty_rune` | Floaty Rune | Floating hazard; drops as junk if ignored. |
| `block_cloud_junk` | Cloud Junk | Floating junk variant. |
| `block_locked_rune` | Locked Rune | Does not fall/cascade until broken. |
| `block_cracked_junk` | Cracked Junk | Needs 2 clears or 1 bomb. |

### Hazard Windows

| Hazard ID | Counter Tags | Window |
| --- | --- | ---: |
| `hazard_floaty_rune` | `counter_float` | 3 pieces |
| `hazard_incoming_junk_queue` | `counter_incoming_junk`, `counter_junk` | 2-4 pieces |
| `hazard_freeze_warning` | `counter_freeze` | 1-2 pieces |
| `hazard_preview_hidden` | `counter_preview` | 3 pieces |
| `hazard_low_ceiling` | `counter_low_ceiling`, `counter_board_size` | 5-8 pieces |
| `hazard_royal_pattern` | `counter_royal`, `counter_pattern` | boss phase |
| `hazard_bad_piece_delivery` | `counter_piece_queue` | 1-2 pieces |
| `hazard_speed_wave` | `counter_speed` | 3-6 pieces |

### Reactive Items

Implement this minimum set first:

| Priority | Item ID | Purpose |
| ---: | --- | --- |
| 1 | `item_snack_vacuum` | Remove junk. |
| 1 | `item_festival_mop` | Remove sticky. |
| 1 | `item_cloud_pin` | Counter floating blocks. |
| 1 | `item_snack_shield` | Delay incoming junk. |
| 1 | `item_return_stamp` | Reflect incoming junk. |
| 1 | `item_preview_glasses` | Reveal hidden preview. |
| 1 | `item_hot_cocoa` | Unfreeze active piece. |
| 1 | `item_speed_brake` | Counter speed spike. |
| 1 | `item_tent_pole` | Cancel low ceiling. |
| 1 | `item_safety_net` | Emergency overflow protection. |
| 2 | `item_balloon_pop` | Risky floating clear. |
| 2 | `item_trash_lid` | Partial junk block. |
| 2 | `item_queue_comb` | Reorder next queue. |
| 2 | `item_nope_stamp` | Delete enemy bad piece. |
| 2 | `item_alarm_cookie` | Remove Sleepy. |
| 2 | `item_royal_eraser` | Counter royal blocks. |
| 3 | Remaining utility, risk/reward, and spell catalyst items. |

### Spell Catalyst Items

| Item ID | Combo Spell | Effect |
| --- | --- | --- |
| `item_firecracker_sugar` | Fireball | Burns sticky/junk. |
| `item_frosting_salt` | Frost Lock | Normalizes ice/freeze. |
| `item_bomb_fuse` | Bomb Rune | Radius +1. |
| `item_star_syrup` | Star Spark | Creates 1 star block. |
| `item_cascade_confetti` | Cascade Cheer | Next cascade gives double Fever. |
| `item_spell_coupon` | Any spell | Next spell costs 50% less mana. |
| `item_cleaning_charm` | Clean Cut | Also removes junk/sticky. |

---

## 4. Implementation Phases

## Phase R0 — Audit Current Difficulty and Item Support

### Goal

Find the safest integration points before editing gameplay.

### Inspect First

```text
src/game/types/
src/game/systems/BoardSystem*
src/game/systems/CombatSystem*
src/game/systems/EnemySystem*
src/game/systems/ItemSystem*
src/game/systems/InventorySystem*
src/game/systems/SpellSystem*
src/game/systems/RelicSystem*
src/game/systems/ContentRegistry*
src/game/scenes/BattleScene*
src/game/content/items/
src/game/content/board-blocks/
src/game/content/spells/
src/game/content/relics/
src/game/content/random-gameplay-events/
src/game/content/chaos-rules/
src/game/content/difficulty-scaling/
```

### Deliverables

- Document current item, spell, relic, and hazard integration points.
- Identify if board cells already support block type metadata.
- Identify if enemy attacks already have warning/intent timers.
- Identify if inventory use can target board cells.

### Acceptance Criteria

- No gameplay rewrite yet.
- Build status known.
- Missing systems are listed.

### Commands

```bash
npm run validate:content
npm run build
```

---

## Phase R1 — Add Counter Tags and Reactive Item Content Schema

### Goal

Add the shared language that connects hazards to counters.

### Tasks

1. Add `CounterTag`, `ItemCategory`, `ItemTiming`, and `ReactiveItemContent` types.
2. Extend item content validation to allow:
   - `itemCategory`
   - `counterTags`
   - `timing`
   - `maxStack`
   - `spellSynergyTags`
   - `effectConfig`
3. Add safe defaults for older items.
4. Add the Priority 1 reactive items.

### Acceptance Criteria

- Existing items still load.
- New item fields are optional or safely defaulted.
- Content validation passes.
- Inventory still displays old and new items.

### Commands

```bash
npm run validate:content
npm run build
```

---

## Phase R2 — Implement Incoming Junk Queue

### Goal

Make enemy junk attacks readable and counterable.

### Tasks

1. Add `IncomingJunkQueue` state to battle/combat state.
2. Add functions:

```ts
queueIncomingJunk(amount, sourceId, delayPieces, junkType);
reduceIncomingJunk(amount, reason);
resolveIncomingJunkQueue();
clearIncomingJunkQueue(reason);
```

3. Connect enemy attacks like Crumb Goblin and Prototype No. 7 to queue junk instead of instantly dropping it.
4. Let cascades reduce incoming junk.
5. Add UI warning tray.
6. Add item effects:
   - `item_snack_shield`
   - `item_return_stamp`
   - `item_trash_lid`

### Acceptance Criteria

- Enemy can queue junk with a visible countdown.
- Cascades reduce incoming junk before it lands.
- Items can delay, reduce, or reflect incoming junk.
- Remaining junk drops safely.
- No instant unavoidable overflow.

### Manual Test

1. Fight Crumb Goblin.
2. Confirm incoming junk warning appears.
3. Trigger a cascade before countdown ends.
4. Confirm incoming junk is reduced.
5. Use Snack Shield and confirm delay.
6. Let remaining junk land.

---

## Phase R3 — Implement Floating Blocks

### Goal

Add the floating block pressure mechanic.

### Tasks

1. Add board cell state for floating blocks:

```ts
type FloatingState = {
  isFloating: boolean;
  countdownPieces: number;
  onExpireBlockId: string;
};
```

2. Add board methods:

```ts
spawnFloatingBlock(blockId, column, row, countdownPieces);
resolveFloatingCountdown();
pinFloatingBlocks();
popFloatingBlocks();
expireFloatingBlocks();
```

3. Add item effects:
   - `item_cloud_pin`
   - `item_balloon_pop`
   - `item_anchor_cookie`
   - `item_sky_hook`
4. Add one Stage 1 tutorial random event using a single floating block.
5. Add Stage 2+ enemy/boss usage.

### Acceptance Criteria

- Floating block appears with readable countdown.
- It does not break Cascade Gravity.
- Cloud Pin resolves it safely.
- Balloon Pop removes it with risk.
- Expired floating block drops as junk.
- No soft-lock if spawn position is invalid.

---

## Phase R4 — Implement Hazard Counter Windows

### Goal

Standardize hazard warnings for freeze, preview disruption, bad piece, speed wave, low ceiling, and royal pattern.

### Tasks

1. Add `HazardCounterWindow` runtime state.
2. Add hazard events:
   - `hazard_freeze_warning`
   - `hazard_preview_hidden`
   - `hazard_bad_piece_delivery`
   - `hazard_speed_wave`
   - `hazard_low_ceiling`
   - `hazard_royal_pattern`
3. Add item counters:
   - `item_preview_glasses`
   - `item_hot_cocoa`
   - `item_speed_brake`
   - `item_tent_pole`
   - `item_safety_net`
   - `item_nope_stamp`
   - `item_queue_comb`
4. Add UI counter hints.

### Acceptance Criteria

- Hazards show warning text before or as they happen.
- UI shows available item/spell counters.
- Using a valid counter resolves or weakens the hazard.
- Unsupported hazards fall back safely.

---

## Phase R5 — Add Spell Catalyst Item Support

### Goal

Make items and spells interact directly.

### Tasks

1. Add temporary `nextSpellModifiers` to player/battle state.
2. Add item timing support for `before_spell`.
3. Implement catalyst effects:
   - Firecracker Sugar + Fireball burns sticky/junk.
   - Frosting Salt + Frost Lock normalizes ice/freeze.
   - Bomb Fuse + Bomb Rune radius +1.
   - Star Syrup + Star Spark creates a star block.
   - Cascade Confetti + Cascade Cheer doubles Fever gain.
   - Spell Coupon halves next spell mana cost.
   - Cleaning Charm + Clean Cut removes junk/sticky.
4. Clear modifier after next spell cast.

### Acceptance Criteria

- Catalyst item can be used before casting a spell.
- Next spell consumes modifier once.
- Spell UI reflects active catalyst where practical.
- No catalyst can stack into broken values.

---

## Phase R6 — Relic and Hero Counter Synergies

### Goal

Make relics and hero passives enhance counterplay style.

### Tasks

Add or update synergies:

| Existing System | Counter Synergy |
| --- | --- |
| Pippa passive | Fire spells burn sticky/junk more reliably. |
| Nixie passive | Reduces speed/freeze hazard severity once per room. |
| Bruk passive | Safety Net-like overflow save once per battle. |
| Zuzu passive | Bomb counters are stronger but may create minor junk risk. |
| Lumi passive | Star blocks increase incoming junk reduction during cascades. |
| Sticky Sticker relic | Sticky blocks grant mana when cleared. |
| Star Cookie relic | Cascades reduce more incoming junk. |
| Block-O Manual relic | Once per battle, highlights best counter option. |

### Acceptance Criteria

- Existing passives remain readable.
- Relics enhance counter styles without being mandatory.
- No one synergy fully invalidates a boss mechanic.

---

## Phase R7 — UI/UX Warning Tray and Counter Hints

### Goal

Make difficulty readable on portrait mobile.

### Tasks

1. Add compact warning tray near battle panel or board overlay.
2. Show:
   - Hazard icon/name.
   - Countdown.
   - Incoming amount/effect.
   - Available item counters.
   - Available spell counters.
   - Cascade hint.
3. Add event log lines for hazard start, counter used, and hazard resolved.

### Acceptance Criteria

- Warning tray is readable on mobile.
- Board remains central and not blocked.
- Counter hints update when inventory/mana changes.
- Player can ignore hints without UI spam.

---

## Phase R8 — Balance Pass

### Goal

Tune difficulty to be harder but fair.

### Balance Rules

- Stage 1 introduces mechanics one at a time.
- Stage 2 uses junk queue and floating blocks lightly.
- Stage 3 adds freeze/speed/ice complexity.
- Stage 4 adds Sleepy/soft blocks.
- Stage 5 pressures cascade mastery.
- Stage 6 combines royal pattern, floating blocks, and incoming junk carefully.

### Recommended Starting Values

| Mechanic | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 | Stage 6 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Max active hazards | 1 | 1 | 1-2 | 1-2 | 2 | 2 |
| Incoming junk amount | 1-2 | 2-4 | 3-5 | 3-5 | 4-7 | 5-8 |
| Floating blocks | 0-1 | 1-2 | 1-2 | 1-2 | 2-3 | 2-4 |
| Counter window | 4 pieces | 3 pieces | 2-3 pieces | 2-3 pieces | 2 pieces | 2 pieces |
| Low ceiling | No | Elite only | Rare | Elite only | Elite/boss | Boss/elite |

### Acceptance Criteria

- Average player can still clear Stage 1.
- Stage 2 feels noticeably harder.
- Stage 5+ requires active item/spell/cascade decisions.
- No hazard combination causes unavoidable loss.

---

## Phase R9 — QA and Debug Tools

### Goal

Make new hazards easy to test.

### Debug Tools

Add dev-only controls to:

- Queue incoming junk.
- Spawn floating block.
- Trigger low ceiling.
- Hide preview.
- Inject bad piece.
- Trigger freeze warning.
- Give specific reactive item.
- Give spell catalyst item.
- Force cascade test board.

### Smoke Tests

1. Start Stage 1 and verify no unfair stacked hazards.
2. Spawn incoming junk and reduce it with cascade.
3. Use Snack Shield to delay junk.
4. Spawn Floaty Rune and resolve with Cloud Pin.
5. Use Balloon Pop and confirm risk result.
6. Trigger Freeze and counter with Hot Cocoa.
7. Hide preview and counter with Preview Glasses.
8. Trigger Low Ceiling and counter with Tent Pole.
9. Use Firecracker Sugar then Fireball on sticky/junk.
10. Verify save/load does not lose active hazard state.

---

## 5. Recommended File/Folder Changes

Exact paths may vary depending on the current repo. Prefer updating existing files rather than creating unnecessary new ones.

```text
src/game/types/counterTypes.ts
src/game/types/itemTypes.ts
src/game/types/hazardTypes.ts
src/game/systems/ItemSystem.ts
src/game/systems/InventorySystem.ts
src/game/systems/SpellSystem.ts
src/game/systems/BoardSystem.ts
src/game/systems/CombatSystem.ts
src/game/systems/EnemySystem.ts
src/game/systems/HazardCounterSystem.ts
src/game/systems/IncomingJunkQueueSystem.ts
src/game/systems/FloatingBlockSystem.ts
src/game/ui/HazardWarningTray.ts
src/game/content/items/reactive-items.json
src/game/content/items/spell-catalyst-items.json
src/game/content/board-blocks/hazard-blocks.json
src/game/content/hazard-counter-windows/hazard-counter-windows.json
src/game/content/random-gameplay-events/reactive-difficulty-events.json
src/game/content/difficulty-scaling/reactive-difficulty-scaling.json
```

If the project already keeps content in a different structure, follow the existing structure and update `ContentRegistry` accordingly.

---

## 6. Acceptance Criteria for the Full Feature

- Difficulty pressure is readable before it becomes dangerous.
- Floating blocks work and have item/spell counters.
- Incoming junk queue works and cascades reduce it.
- Reactive items can counter hazards.
- Spell catalyst items modify the next spell once.
- Relics and hero passives enhance counter styles.
- UI shows hazard warnings and available counters.
- No hazard soft-locks the player.
- Save/load handles active hazard state safely.
- Content validation passes.
- Build passes.
- Mobile portrait readability remains intact.

---

## 7. Copy-Paste Implementation Prompt

```text
Read AGENT.md first and follow it as the main project instruction.
Also read docs/01_GDD_MASTER.md as the canonical source of truth, especially sections 21 and 22.

Task:
Implement Reactive Difficulty and Item Counterplay for Blockmancer Dungeon in small safe steps.

Goal:
Raise difficulty through readable hazards and counterplay. Players should react to floating blocks, incoming junk, freeze, preview disruption, low ceiling, speed waves, bad piece delivery, and royal patterns using cascades, items, spells, relics, and hero passives.

Do not make difficulty rely only on higher HP, higher damage, or faster fall speed.
Do not add unavoidable punishment.
Do not break Cascade Gravity.
Keep cheerful festival tone.

First inspect:
- src/game/types/
- src/game/systems/BoardSystem*
- src/game/systems/CombatSystem*
- src/game/systems/EnemySystem*
- src/game/systems/ItemSystem*
- src/game/systems/InventorySystem*
- src/game/systems/SpellSystem*
- src/game/systems/RelicSystem*
- src/game/systems/ContentRegistry*
- src/game/scenes/BattleScene*
- src/game/content/items/
- src/game/content/board-blocks/
- src/game/content/spells/
- src/game/content/relics/
- src/game/content/random-gameplay-events/
- src/game/content/chaos-rules/
- src/game/content/difficulty-scaling/

Implement in this order:
1. Add CounterTag, ItemCategory, ItemTiming, and hazard counter window types with safe defaults.
2. Add Priority 1 reactive item content.
3. Implement Incoming Junk Queue with cascade reduction.
4. Implement Floating Blocks with countdown and counters.
5. Add hazard warning windows for freeze, preview, low ceiling, bad piece, speed wave, and royal pattern.
6. Add item effects for reactive counters.
7. Add spell catalyst support for next-spell modifiers.
8. Add compact battle UI warning tray and counter hints.
9. Add balance values by stage.
10. Add dev-only debug triggers and QA checklist updates.

Required Priority 1 items:
- item_snack_vacuum
- item_festival_mop
- item_cloud_pin
- item_snack_shield
- item_return_stamp
- item_preview_glasses
- item_hot_cocoa
- item_speed_brake
- item_tent_pole
- item_safety_net

Required spell catalyst items:
- item_firecracker_sugar
- item_frosting_salt
- item_bomb_fuse
- item_star_syrup
- item_cascade_confetti
- item_spell_coupon
- item_cleaning_charm

Acceptance criteria:
- Enemy can queue incoming junk with a visible countdown.
- Cascades reduce incoming junk.
- Floating blocks appear, count down, and resolve safely.
- Items can counter hazards using counterTags.
- Spell catalyst items modify the next spell once.
- UI shows active hazard and available counters.
- No hazard can soft-lock the player.
- Save/load safely handles active hazards or clears them with fallback.
- npm run validate:content passes.
- npm run build passes.

Finish response with:
Summary / Files changed / Systems changed / Content added / Commands run / Manual test steps / Known limitations.
```

---

## 8. Manual Test Matrix

| Test | Setup | Expected Result |
| --- | --- | --- |
| Incoming junk reduced by cascade | Queue 6 junk, trigger Cascade 2 | Junk reduced before landing. |
| Incoming junk delayed by item | Queue 6 junk, use Snack Shield | Countdown increases by 3 pieces. |
| Incoming junk reflected | Queue 6 junk, use Return Stamp | Half reflected as enemy damage. |
| Floating block pinned | Spawn Floaty Rune, use Cloud Pin | Floaty block lands safely as normal block. |
| Floating block popped | Spawn Floaty Rune, use Balloon Pop | Float removed, 1 junk added later. |
| Freeze countered | Trigger Freeze, use Hot Cocoa | Active piece unfreezes and player gains small mana. |
| Preview restored | Hide Next/Hold, use Preview Glasses | Preview becomes visible. |
| Low ceiling canceled | Trigger Low Ceiling, use Tent Pole | Board height returns to normal. |
| Fire catalyst combo | Use Firecracker Sugar then Fireball | Fireball burns sticky/junk. |
| Clean Cut catalyst combo | Use Cleaning Charm then Clean Cut | Clean Cut removes row and junk/sticky. |
| Safety Net overflow | Fill top row, trigger overflow with Safety Net | Top row clears once instead of defeat. |
| Save/load active hazard | Save with incoming junk and floaty block | Load safely restores or clears with feedback. |