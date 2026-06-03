# Blockmancer Dungeon — Gameplay Systems and Reactive Difficulty Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for reactive difficulty, hazards, counter windows, route reward/risk modifiers, Fever fairness, pressure systems, and smoke tests.

## 1. Core Difficulty Philosophy

Difficulty should come from readable board pressure and reactive counterplay.

Players solve danger through:

```text
cascades
spells
items
relics
hero passives
smart stacking
category upgrades
Showtime release timing
```

Every major hazard should provide:

```text
warning first
counter window
at least one item counter
at least one spell/cascade/relic/hero/upgrade counter
no unavoidable soft-lock
```

## 2. Counter Tags

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

## 3. Reactive Item Fields

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
```

## 4. Hazard Counter Windows

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

## 5. Priority Reactive Items

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

## 6. Spell Catalyst Items

| Item ID | Combo Spell | Effect |
| --- | --- | --- |
| `item_firecracker_sugar` | Fireball | Burns sticky/junk. |
| `item_frosting_salt` | Frost Lock | Normalizes ice/freeze. |
| `item_bomb_fuse` | Bomb Rune | Radius +1. |
| `item_star_syrup` | Star Spark | Creates 1 star block. |
| `item_cascade_confetti` | Cascade Cheer | Next cascade gives double Fever. |
| `item_spell_coupon` | Any spell | Next spell costs 50% less mana. |
| `item_cleaning_charm` | Clean Cut | Also removes junk/sticky. |

## 7. Route Reward / Risk Modifiers

```ts
type RouteChoiceLane = "practical" | "true" | "risky";

type RouteRewardConfig = {
  rewardId: string;
  rewardType:
    | "gold"
    | "heal"
    | "mana"
    | "shield"
    | "item"
    | "relic"
    | "upgrade"
    | "stage_modifier"
    | "boss_modifier"
    | "hazard_modifier"
    | "battle_modifier";
  amount?: number;
  itemId?: string;
  relicId?: string;
  upgradeId?: string;
  modifierId?: string;
  duration?: "next_battle" | "stage" | "boss" | "run";
};

type RouteRiskConfig = {
  oopsieChance?: number;
  addHazardId?: string;
  increaseHazardSeverity?: "minor" | "moderate" | "major";
  bossModifierId?: string;
  rewardTier?: "stage" | "rare" | "hero_themed";
};
```

Rules:

- Practical choices grant safety or consistency.
- True choices grant thematic counterplay or boss softening.
- Risky choices may add Oopsies or hazards, but must provide stronger rewards.
- No route choice may create an unavoidable loss state.

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


## 8. Pressure Budget, Soft Junk, and Fever Heat

Pressure Budget controls how much danger can be added during sensitive states such as Showtime, low ceiling, boss phases, and sequential enemy entry.

Soft Junk is a safer pressure form used when the board is already under high pressure. It should be readable, counterable, and less punishing than hard junk.

Fever Heat rises when Showtime is extended, overcharged, or held too long. It creates release pressure without silently cancelling player plans.

Rules:

- High pressure converts hard punishment into Soft Junk when possible.
- Fever Heat never persists between nodes.
- Soft Junk never persists between nodes unless explicitly converted into normal board content before node end.
- Boss Drama Guard caps direct damage and converts overflow into utility where supported.

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


## 9. Upgrade Counterplay Ownership

Hero upgrades may improve survivability, warning windows, mana flow, hero passives, and hero-specific counters.

Board upgrades may improve Cascade Gravity rewards, Hold, Next Queue, hazard warnings, low-ceiling safety, Soft Junk mitigation, royal pattern counterplay, and board pressure management.

Fever upgrades may improve Fever gain, Showtime duration, Charged Line capacity within caps, release rewards, Heat handling, Overflow utility, Soft Junk conversion, and Star Encore.

Safety rules:

- Board upgrades cannot replace Cascade Gravity.
- Fever upgrades cannot bypass Boss Drama Guard.
- Fever upgrades cannot preserve Charged Lines between nodes.
- Upgrade effects must have handlers or explicit safe fallback warnings.

## 10. Smoke Test Matrix

Required smoke cases:

```text
Incoming junk warning appears before landing.
Cascade reduces incoming junk.
Floating block appears with countdown and expires safely.
Cloud Pin resolves floating block.
Freeze warning gives counter window.
Preview disruption can be countered.
Speed wave can be countered.
Low ceiling cannot soft-lock the board.
Royal pattern warning appears before punishment.
Route risky reward cannot create unavoidable loss.
Fever Showtime release resolves through Cascade Gravity.
Fever Heat and Charged Lines do not persist between nodes.
Boss Drama Guard prevents Fever one-shot / phase skipping.
Hero / Board / Fever upgrades respect category ownership and safety rules.
```
