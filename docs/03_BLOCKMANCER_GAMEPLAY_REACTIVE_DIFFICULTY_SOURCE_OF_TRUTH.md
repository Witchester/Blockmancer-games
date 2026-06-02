# Blockmancer Dungeon — Gameplay Systems and Reactive Difficulty Source of Truth

**Generated:** 2026-05-20  
**Authority:** Canonical for reactive difficulty, hazard warning windows, counter item design, spell catalysts, route-triggered reward/risk modifiers, runtime verification notes, and smoke tests.

## Consolidation Summary

This file uses `02_REACTIVE_DIFFICULTY_IMPLEMENTATION_PLAN_WITH_STORY_FLOW.md` as the primary design/implementation plan because it includes route reward/risk integration. Runtime status is then merged from the runtime audit and smoke test matrix. Board-block frame animation integration is included here only where it affects gameplay feedback; asset production rules live in the Asset/Animation SOT.

## Gameplay Ownership

Use this file for:

- Floating blocks, incoming junk, low ceiling, freeze, preview disruption, speed waves, royal patterns, bad piece delivery, and other hazards.
- Counter tags, item timing, reactive item content, and spell catalyst behavior.
- Route-triggered reward/risk modifiers.
- QA smoke matrix for reactive difficulty.
- Runtime audit of what currently exists vs. switch-limited.

For exact asset paths/frame counts, use the Asset/Animation SOT.


---

## Reactive Difficulty Plan with Story-Flow Integration

**Source file:** `02_REACTIVE_DIFFICULTY_IMPLEMENTATION_PLAN_WITH_STORY_FLOW.md`

**Consolidation note:** Primary source for hazard/counter design and route reward/risk integration.

### Blockmancer Dungeon — Reactive Difficulty & Item Counter Implementation Plan
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### Current Reactive Difficulty Status — 2026-05-18

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

Priority next step: build a **reactive difficulty smoke test matrix** for incoming junk, floaty blocks, freeze, low ceiling, preview disruption, speed wave, royal pattern, item/spell counters, and route-triggered reward/risk modifiers.

##### Character route integration status

The new route story system should interact with reactive difficulty as a controlled reward/risk layer, not as a replacement for hazard rules.

- Practical route choices may grant small safety tools such as shield, mana, reduced junk, or a one-battle hazard reduction.
- True route choices may grant stage-specific counter advantages, wider warning windows, or boss softening tied to that hero's route theme.
- Risky route choices may grant stronger rewards while adding an Oopsie, hazard pressure, or boss modifier.
- Route-triggered hazards must still follow fairness rules: warning first, counter window, no soft-lock, and no simultaneous impossible hazard stack.
- Current status is **design ready, runtime verification pending** until route rewards and hazards are wired through code.

<!-- END_BLOCKMANCER_STATUS_UPDATE -->

This plan implements the new difficulty/setback direction from `docs/01_GDD_MASTER.md` sections 21 and 22.

Goal:

```text
Raise difficulty by adding readable board pressure and reactive counterplay.
Players should solve danger through cascades, spells, items, relics, hero passives, and smart stacking.
```

Do not implement everything in one pass. Use the phases below so the game remains playable after each step.

---

#### 1. Scope Summary

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
- Route-triggered reward/risk modifiers from the six hero story routes.

Core rule:

```text
Every major hazard must have at least one item counter and one spell/cascade/relic/hero counter.
```

---

#### 2. New Data Model

##### Counter Tags

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

##### Reactive Item Fields

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


##### Route Reward / Risk Modifier Fields

Route choices may apply reactive difficulty modifiers. Keep them small, explicit, and testable.

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

Route reward rules:

- Practical choices grant safety or consistency.
- True choices grant thematic counterplay or boss softening.
- Risky choices may add Oopsies or hazards, but must also provide stronger rewards.
- No route choice may create an unavoidable loss state.
- Route rewards should use existing systems first: `RewardSystem`, `ItemSystem`, `CombatSystem`, `BoardSystem`, `BossSystem`, `OopsieSystem`, and hazard-counter systems.


##### Hazard Counter Window Fields

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

#### 3. Content to Add

##### Board / Hazard Blocks

| ID | Name | Role |
| --- | --- | --- |
| `block_floaty_rune` | Floaty Rune | Floating hazard; drops as junk if ignored. |
| `block_cloud_junk` | Cloud Junk | Floating junk variant. |
| `block_locked_rune` | Locked Rune | Does not fall/cascade until broken. |
| `block_cracked_junk` | Cracked Junk | Needs 2 clears or 1 bomb. |

##### Hazard Windows

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

##### Reactive Items

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

##### Spell Catalyst Items

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


##### Route-Triggered Counterplay Rewards

The character route story system may grant small route-specific counterplay rewards. These must be implemented as real gameplay modifiers, not flavor text only.

| Hero | Practical Reward Direction | True Reward Direction | Risky Reward Direction |
| --- | --- | --- | --- |
| Milo | Safer board setup, small mana, reduced simple hazard. | Better warning/counter timing or boss callback advantage. | Rare reward plus possible Oopsie or harder hazard. |
| Pippa | Burn sticky/junk or gain fire-themed item. | Reduce sticky/junk pressure for boss or stage. | Stronger fire reward plus overheat or speed risk. |
| Zuzu | Reduce machine/junk hazard. | Improve warning timers or safer gadget behavior. | Bomb reward plus extra junk risk. |
| Nixie | Slow/freeze mitigation. | Wider freeze/speed counter window or preservation reward. | Strong freeze reward plus speed-wave risk. |
| Bruk | Shield or overflow protection. | Hospitality heal/protect/boss-softening reward. | Big charge reward plus board pressure. |
| Lumi | Preview/star guidance. | Cascade/star/wishkeeper bonus. | Rare star reward plus fever or preview pressure risk. |


#### 4. Implementation Phases

#### Phase R0 — Audit Current Difficulty and Item Support

##### Goal

Find the safest integration points before editing gameplay.

##### Inspect First

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

##### Deliverables

- Document current item, spell, relic, and hazard integration points.
- Identify if board cells already support block type metadata.
- Identify if enemy attacks already have warning/intent timers.
- Identify if inventory use can target board cells.

##### Acceptance Criteria

- No gameplay rewrite yet.
- Build status known.
- Missing systems are listed.

##### Commands

```bash
npm run validate:content
npm run build
```

---

#### Phase R1 — Add Counter Tags and Reactive Item Content Schema

##### Goal

Add the shared language that connects hazards to counters.

##### Tasks

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

##### Acceptance Criteria

- Existing items still load.
- New item fields are optional or safely defaulted.
- Content validation passes.
- Inventory still displays old and new items.

##### Commands

```bash
npm run validate:content
npm run build
```

---

#### Phase R2 — Implement Incoming Junk Queue

##### Goal

Make enemy junk attacks readable and counterable.

##### Tasks

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

##### Acceptance Criteria

- Enemy can queue junk with a visible countdown.
- Cascades reduce incoming junk before it lands.
- Items can delay, reduce, or reflect incoming junk.
- Remaining junk drops safely.
- No instant unavoidable overflow.

##### Manual Test

1. Fight Crumb Goblin.
2. Confirm incoming junk warning appears.
3. Trigger a cascade before countdown ends.
4. Confirm incoming junk is reduced.
5. Use Snack Shield and confirm delay.
6. Let remaining junk land.

---

#### Phase R3 — Implement Floating Blocks

##### Goal

Add the floating block pressure mechanic.

##### Tasks

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

##### Acceptance Criteria

- Floating block appears with readable countdown.
- It does not break Cascade Gravity.
- Cloud Pin resolves it safely.
- Balloon Pop removes it with risk.
- Expired floating block drops as junk.
- No soft-lock if spawn position is invalid.

---

#### Phase R4 — Implement Hazard Counter Windows

##### Goal

Standardize hazard warnings for freeze, preview disruption, bad piece, speed wave, low ceiling, and royal pattern.

##### Tasks

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

##### Acceptance Criteria

- Hazards show warning text before or as they happen.
- UI shows available item/spell counters.
- Using a valid counter resolves or weakens the hazard.
- Unsupported hazards fall back safely.

---

#### Phase R5 — Add Spell Catalyst Item Support

##### Goal

Make items and spells interact directly.

##### Tasks

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

##### Acceptance Criteria

- Catalyst item can be used before casting a spell.
- Next spell consumes modifier once.
- Spell UI reflects active catalyst where practical.
- No catalyst can stack into broken values.

---

#### Phase R6 — Relic and Hero Counter Synergies

##### Goal

Make relics and hero passives enhance counterplay style.

##### Tasks

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

##### Acceptance Criteria

- Existing passives remain readable.
- Relics enhance counter styles without being mandatory.
- No one synergy fully invalidates a boss mechanic.

---

#### Phase R7 — UI/UX Warning Tray and Counter Hints

##### Goal

Make difficulty readable on portrait mobile.

##### Tasks

1. Add compact warning tray near battle panel or board overlay.
2. Show:
   - Hazard icon/name.
   - Countdown.
   - Incoming amount/effect.
   - Available item counters.
   - Available spell counters.
   - Cascade hint.
3. Add event log lines for hazard start, counter used, and hazard resolved.

##### Acceptance Criteria

- Warning tray is readable on mobile.
- Board remains central and not blocked.
- Counter hints update when inventory/mana changes.
- Player can ignore hints without UI spam.

---

#### Phase R8 — Balance Pass

##### Goal

Tune difficulty to be harder but fair.

##### Balance Rules

- Stage 1 introduces mechanics one at a time.
- Stage 2 uses junk queue and floating blocks lightly.
- Stage 3 adds freeze/speed/ice complexity.
- Stage 4 adds Sleepy/soft blocks.
- Stage 5 pressures cascade mastery.
- Stage 6 combines royal pattern, floating blocks, and incoming junk carefully.

##### Recommended Starting Values

| Mechanic | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 | Stage 6 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Max active hazards | 1 | 1 | 1-2 | 1-2 | 2 | 2 |
| Incoming junk amount | 1-2 | 2-4 | 3-5 | 3-5 | 4-7 | 5-8 |
| Floating blocks | 0-1 | 1-2 | 1-2 | 1-2 | 2-3 | 2-4 |
| Counter window | 4 pieces | 3 pieces | 2-3 pieces | 2-3 pieces | 2 pieces | 2 pieces |
| Low ceiling | No | Elite only | Rare | Elite only | Elite/boss | Boss/elite |

##### Acceptance Criteria

- Average player can still clear Stage 1.
- Stage 2 feels noticeably harder.
- Stage 5+ requires active item/spell/cascade decisions.
- No hazard combination causes unavoidable loss.

---

#### Phase R9 — QA and Debug Tools

##### Goal

Make new hazards easy to test.

##### Debug Tools

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

##### Smoke Tests

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


#### Phase R10 — Route Story Reward/Risk Integration

##### Goal

Connect character route choices to reactive difficulty in a fair and testable way.

##### Tasks

1. Read route content from `docs/story board/` and generated route JSON.
2. Add route reward application support for:
   - `stage_modifier`
   - `boss_modifier`
   - `hazard_modifier`
   - `battle_modifier`
3. Route Practical choices should apply small safety rewards.
4. Route True choices should apply thematic counter bonuses or boss softening.
5. Route Risky choices should apply stronger rewards plus optional Oopsie/hazard increase.
6. Add route reward event-log messages.
7. Ensure route-triggered hazards obey the same hazard warning/counter rules as normal hazards.

##### Acceptance Criteria

- Route rewards are functional, not text-only.
- Each hero has at least one route reward that interacts with that hero's gameplay identity.
- Risky route choices cannot create unavoidable loss.
- Route rewards save/load safely if their duration is stage, boss, or run.
- Boss callbacks can apply a small boss modifier when configured.
- Content validation and build pass.

##### Manual Test

1. Trigger Milo Stage 1 route scene and choose Practical; verify safety reward applies.
2. Trigger Pippa Stage 1 route scene and choose True; verify sticky/junk or boss-softening modifier applies.
3. Trigger Zuzu Stage 2 route scene and choose Risky; verify reward and extra junk/hazard risk are both applied safely.
4. Trigger Nixie Stage 3 route scene and choose True; verify freeze/speed counter window changes.
5. Trigger Bruk Stage 6 route scene and choose True; verify boss modifier or protection reward applies.
6. Trigger Lumi Stage 5 route scene and choose Risky; verify star/fever reward and preview/fever pressure risk are safe.



#### Phase R11 — Biome-Based Sequential Encounter Packs

##### Goal

Replace one-enemy-per-node battle generation with fair sequential encounter packs generated from the stage/biome monster pool.

##### Tasks

1. Add or update encounter data types:

```ts
type MonsterRole = "starter" | "pressure" | "support" | "finisher";

type BiomeMonsterPool = {
  stageId: string;
  biomeId: string;
  monsterRules: WeightedMonsterRule[];
  maxDuplicatePerNode: number;
  recentMonsterMemoryCount: number;
  bannedPairTags?: string[];
};

type NodeEncounterPack = {
  encounterPackId: string;
  nodeId: string;
  stageId: string;
  biomeId: string;
  nodeType: "normal" | "elite" | "boss" | "event_battle" | "royal_guard";
  enemies: EncounterEnemyEntry[];
  currentEnemyIndex: number;
  totalHpBudgetMultiplier: number;
  totalAttackBudgetMultiplier: number;
  maxActiveHazards: number;
  rewardsGrantedOnlyOnNodeClear: true;
};
```

2. Add `EncounterPackSystem` or equivalent responsibility inside the current enemy/battle generation flow.
3. Create content for biome monster pools and encounter scaling under `src/game/content/difficulty-scaling/` or the existing equivalent folder.
4. Generate enemy count by stage, node type, node depth, and budget.
5. Tune total HP budget so 2 enemies are about 150-165% of a single node and 3 enemies are about 190-220%.
6. Store current encounter pack state in run save data.
7. Advance to the next enemy after defeat without clearing the node.
8. Grant normal node rewards, route fallback triggers, and level-up screens only after all enemies are defeated.
9. Add compact monster stack UI using monster icons.

##### Acceptance Criteria

- Normal battle nodes can contain 1-3 sequential enemies.
- Only one enemy is active at once.
- Enemy selection is generated from biome/stage monster pools.
- New enemy entry resets attack counter and applies entry grace.
- Rewards are not duplicated per enemy.
- Save/load preserves active encounter pack, active enemy index, active enemy HP, and remaining enemies.
- Stage 1 remains gentle and beginner-readable.
- Build and content validation pass.

##### Manual Test

1. Start Stage 1 and confirm early nodes are still single enemy.
2. Reach a late Stage 1 normal node and confirm it can generate two sequential enemies from the Stage 1 pool.
3. Confirm the next enemy enters only after the current enemy is defeated.
4. Confirm the monster stack UI updates from `2 left` to `1 left` to node clear.
5. Save/load mid-node and verify the same active enemy and remaining queue are restored safely.

---

#### Phase R12 — Enemy Entry Pressure + Player Gift

##### Goal

Make enemy entry effects fair and readable by pairing every pressure effect with a small player-positive gift.

##### Tasks

1. Add `EnemyEntryEffect` content/config:

```ts
type EnemyEntryEffect = {
  id: string;
  pressureEffectId?: string;
  playerGiftEffectId?: string;
  entryGracePieces: number;
  warningText: string;
  eventLogText: string;
};
```

2. Add safe pressure effects:
   - sticky warning
   - incoming junk warning
   - freeze warning
   - shielded enemy entry
   - combo/Fever challenge
   - royal pattern warning
3. Add player gifts:
   - +2 mana
   - +1 to +3 shield
   - spawn one sprinkle/star helper if board space allows
   - +1 entry grace piece
   - temporary Fever gain bonus
4. Ensure the entry gift cannot create immediate board overflow or invalid state.
5. Add event log text for both the pressure and the gift.

##### Acceptance Criteria

- Enemy entry never causes instant damage, instant overflow, hidden freeze, or unavoidable loss.
- Every mechanical pressure entry has a readable warning.
- Every pressure entry has a small player-positive gift.
- Gifts are small enough to avoid becoming a farm.
- Stage 1 uses only gentle entry effects.

---

#### Phase R13 — Festival Level-Up and Stackable Build Upgrades

##### Goal

Add JRPG-style run progression so players can survive and specialize through longer later-stage encounters.

##### Tasks

1. Add `PlayerLevelState` to run state and save migration:

```ts
type PlayerLevelState = {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  pendingLevelUps: number;
  chosenUpgrades: Record<string, number>;
  rerollCharges: number;
};
```

2. Add `LevelUpSystem` or equivalent responsibility.
3. Grant XP from defeated enemies, elite enemies, bosses, objectives, no-damage bonuses, and cascade bonuses.
4. Accumulate pending level-ups during combat, but do not show the level-up screen until the full node is cleared.
5. Add a level-up reward scene/modal with 3 cards.
6. Add general level-up upgrades:
   - `upg_lvl_clear_line_damage`
   - `upg_lvl_max_hp_percent`
   - `upg_lvl_flat_hp`
   - `upg_lvl_mana_gain`
   - `upg_lvl_spell_damage`
   - `upg_lvl_cascade_damage`
   - `upg_lvl_starting_shield`
   - `upg_lvl_heal_after_node`
   - `upg_lvl_fever_gain`
   - `upg_lvl_hazard_resist`
   - `upg_lvl_entry_grace`
   - `upg_lvl_reward_reroll`
7. Add hero-specific level-up upgrades for Milo, Pippa, Zuzu, Nixie, Bruk, and Lumi as defined in the Game Design SOT.
8. Enforce stack limits and caps.
9. Ensure every upgrade has a real runtime effect handler or is rejected by validation.

##### Acceptance Criteria

- XP is earned during combat and applied after node clear.
- Level-up choices appear only after the full encounter pack is defeated.
- Player gets 3 upgrade cards per level-up.
- General and hero-specific upgrades can both appear.
- Upgrade stacks persist in save data.
- Upgrades affect real combat/board/stat behavior.
- No upgrade fully cancels a core stage mechanic.
- Unsupported upgrade effect IDs fail validation or produce a clear development warning.

##### Manual Test

1. Defeat a multi-enemy node and verify XP accumulates from each enemy.
2. Confirm the level-up screen appears only after node clear.
3. Pick `upg_lvl_clear_line_damage` and verify line-clear damage increases.
4. Pick `upg_lvl_max_hp_percent` and verify max HP updates safely.
5. Pick a hero-specific upgrade and verify it only appears for the selected hero.
6. Save/load after taking upgrades and confirm stack counts persist.

---


#### Phase R14 — Node Result Screen and EXP Summary

##### Goal

Add a clear post-node result screen that shows how much EXP the player earned from the cleared node and how much EXP remains before the next Festival Level-Up.

This screen is required because sequential encounters can contain multiple enemies, objectives, cascade bonuses, route bonuses, and no-damage bonuses. The player must understand why they gained EXP and how close they are to the next upgrade choice.

##### Tasks

1. Add `NodeResultSummary` and `NodeResultXpBreakdown` types or equivalent fields.
2. Add a `NodeResultScene`, `NodeResultModal`, or equivalent post-battle screen.
3. Gate it so it appears only after the **full encounter pack** is cleared, not after each enemy.
4. Show:
   - node clear title,
   - enemies defeated count,
   - total EXP gained this node,
   - EXP breakdown rows,
   - current level,
   - EXP meter before/after gain,
   - EXP remaining to next level,
   - `Level Up Ready!` if pending level-ups exist.
5. Ensure this screen runs before level-up card selection and before normal node reward selection.
6. Persist enough result state so save/load cannot duplicate EXP or rewards.
7. Add skip/continue handling that still safely routes to pending level-up cards or node rewards.

##### Data Shape

```ts
type NodeResultXpBreakdown = {
  sourceId: string;
  label: string;
  amount: number;
  sourceType: "enemy" | "elite" | "boss" | "objective" | "cascade_bonus" | "no_damage_bonus" | "route_bonus" | "other";
};

type NodeResultSummary = {
  nodeId: string;
  encounterPackId?: string;
  stageId: string;
  nodeType: "normal" | "elite" | "boss" | "event_battle" | "royal_guard";
  enemiesDefeated: string[];
  xpBefore: number;
  xpGained: number;
  xpAfter: number;
  levelBefore: number;
  levelAfterPreview: number;
  xpToNextLevel: number;
  xpRemainingToNextLevel: number;
  pendingLevelUps: number;
  breakdown: NodeResultXpBreakdown[];
};
```

##### Acceptance Criteria

- Result screen appears after node clear and before level-up/reward screens.
- Result screen never appears after non-final enemy defeats.
- Total EXP gained this node is visible.
- EXP remaining to next level is visible when no level-up is pending.
- `Level Up Ready!` is visible when one or more level-ups are pending.
- EXP breakdown includes enemy EXP and at least one supported bonus type when applicable.
- EXP is not duplicated after save/load, scene reload, or back/continue navigation.
- Mobile portrait layout remains readable.

##### Manual Test

1. Clear a single-enemy Stage 1 node and verify result screen shows that node's EXP and remaining EXP.
2. Clear a two-enemy node and verify EXP includes both enemies but appears only once after the second enemy.
3. Trigger an objective/cascade bonus and verify the breakdown row appears.
4. Reach enough EXP to level up and verify the result screen says `Level Up Ready!` before opening level-up cards.
5. Save/load after node clear but before choosing an upgrade and verify EXP is not granted twice.

---

#### 5. Recommended File/Folder Changes

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
src/game/systems/RouteStorySystem.ts
src/game/systems/DialogueSystem.ts
src/game/content/story/routes/route-scenes.*.json
src/game/content/story/routes/route-endings.json
src/game/content/items/reactive-items.json
src/game/content/items/spell-catalyst-items.json
src/game/content/board-blocks/hazard-blocks.json
src/game/content/hazard-counter-windows/hazard-counter-windows.json
src/game/content/random-gameplay-events/reactive-difficulty-events.json
src/game/content/difficulty-scaling/reactive-difficulty-scaling.json

src/game/systems/EncounterPackSystem.ts
src/game/systems/LevelUpSystem.ts
src/game/scenes/LevelUpRewardScene.ts
src/game/scenes/NodeResultScene.ts
src/game/ui/MonsterStackPreview.ts
src/game/ui/NodeResultPanel.ts
src/game/content/difficulty-scaling/biome-monster-pools.json
src/game/content/difficulty-scaling/encounter-pack-scaling.json
src/game/content/difficulty-scaling/enemy-entry-effects.json
src/game/content/upgrades/level-up-general.json
src/game/content/upgrades/level-up-hero.json
```

If the project already keeps content in a different structure, follow the existing structure and update `ContentRegistry` accordingly.

---

#### 6. Acceptance Criteria for the Full Feature

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
- Route-triggered rewards and risks use the same counterplay fairness rules and never bypass hazard warnings.

---

#### 7. Copy-Paste Implementation Prompt

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
11. Integrate route story reward/risk modifiers from RouteStorySystem without bypassing hazard fairness rules.

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
- Route story choices can apply functional reward/risk modifiers safely.
- No hazard can soft-lock the player.
- Save/load safely handles active hazards or clears them with fallback.
- npm run validate:content passes.
- npm run build passes.

Finish response with:
Summary / Files changed / Systems changed / Content added / Commands run / Manual test steps / Known limitations.
```

---

#### 8. Manual Test Matrix

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

##### Route Story / Reactive Difficulty Tests

| Test | Setup | Expected Result |
| --- | --- | --- |
| Route Practical reward | Choose a practical route option | Small safety reward applies without adding hazard. |
| Route True reward | Choose a true route option | True flag is granted and thematic counter/boss modifier applies. |
| Route Risky reward | Choose a risky route option | Stronger reward applies; optional Oopsie/hazard appears with warning and counterplay. |
| Route reward save/load | Save after a stage/boss/run route modifier | Load restores or safely clears modifier with feedback. |
| Boss callback modifier | Enter boss after route scene choice | Boss callback appears and configured modifier applies once. |


---

## Reactive Difficulty Runtime Audit

**Source file:** `REACTIVE_DIFFICULTY_RUNTIME_AUDIT.md`

**Consolidation note:** Use to understand current implementation coverage and switch-limited areas.

### Reactive Difficulty Runtime Audit

Updated: 2026-05-18

#### Systems Already Present

- `BoardSystem`: Cascade Gravity, special board block cells, junk/royal/sticky/confetti block insertion, row/cluster cleanup, queue/hold helpers, and safe top-row clearing.
- `BattleScene`: active hazard warnings, compact warning tray, enemy behavior hooks, incoming junk queue, floating block warnings, freeze/preview/low-ceiling/bad-piece/speed/royal pressure, boss callbacks, item use, spell buttons, and save calls.
- `ItemSystem`: reactive item switch hooks for cleanup, incoming junk, preview/freeze/speed/low ceiling, safety net, spell catalysts, and now Priority 2 counter items.
- `SpellSystem`: runtime spells for Fireball, Frost Lock, Bomb Rune, and Void/Clean Cut, with next-spell catalyst support.
- `RelicSystem`: switch-based relic hooks, including star/cascade support through battle code.
- `HeroSystem` and `CombatSystem`: hero passives are applied at run start and through combat/battle hooks.
- `RouteStorySystem`: 36 route scenes, route choice resolution, route rewards, route risks, boss callbacks, endings, and route modifier persistence hooks.
- `DebugScene`: dev-only QA controls for battle setup, hazard forcing, reactive items, catalysts, route reward/risk, and hazard clearing.
- `SaveSystem`: versioned run/meta saves with migration and corrupt-save fallback.

#### Existing Content IDs

- Hazard blocks: `block_floaty_rune`, `block_cloud_junk`, `block_crumb_junk`, `block_sticky`, `block_royal`, `block_ice`.
- Priority reactive items: `item_snack_vacuum`, `item_festival_mop`, `item_cloud_pin`, `item_snack_shield`, `item_return_stamp`, `item_preview_glasses`, `item_hot_cocoa`, `item_speed_brake`, `item_tent_pole`, `item_safety_net`.
- Additional counters added/verified: `item_balloon_pop`, `item_trash_lid`, `item_queue_comb`, `item_nope_stamp`, `item_alarm_cookie`, `item_royal_eraser`, `item_anchor_cookie`, `item_sky_hook`, `item_cleanup_coupon`.
- Spell catalysts: `item_firecracker_sugar`, `item_frosting_salt`, `item_bomb_fuse`, `item_star_syrup`, `item_cascade_confetti`, `item_spell_coupon`, `item_cleaning_charm`.
- Route content: six route-scene JSON files plus route endings under `src/game/content/story/routes/`.

#### Supported Effects

- Incoming junk warning tray, countdown, cascade reduction, delayed/blocked/reflected/canceled by items, safe landing.
- Floating block warnings, visual overlay, Cloud Pin/Balloon Pop/Anchor Cookie/Sky Hook counters, safe expiry into cloud junk.
- Hazard windows for incoming junk, floaty rune, freeze, preview, low ceiling, bad piece, sleep, speed wave, and royal pattern.
- Spell catalysts modify the next compatible spell once; incompatible catalysts wait.
- Hero synergies: Milo bonus mana on first cascade, Pippa fire cleanup, Nixie one hazard mitigation, Bruk overflow rescue, Zuzu stronger bombs with warned crumb risk, Lumi star cascade junk reduction.
- Route rewards apply HP/mana/shield/gold/items/relics/upgrades/reactive modifiers, and risky route hazards enter the same warning tray.

#### Switch-Limited Areas

- Spell runtime is still limited to four battle spell IDs; content spells outside `SPELLS` remain data-ready rather than fully playable.
- Relic behavior is switch-based; only existing relic IDs with hooks affect combat.
- Low ceiling currently resolves as safe top-row pressure rather than true dynamic board-height shrink during battle.
- Floating blocks are represented as active hazard markers over the board, not embedded persistent board cells.

#### Files Changed In This Pass

- `src/game/types/GameTypes.ts`
- `src/game/data/constants.ts`
- `src/game/data/defaultRunState.ts`
- `src/game/systems/SaveSystem.ts`
- `src/game/systems/BoardSystem.ts`
- `src/game/systems/ItemSystem.ts`
- `src/game/systems/SpellSystem.ts`
- `src/game/systems/RouteStorySystem.ts`
- `src/game/scenes/BattleScene.ts`
- `src/game/scenes/DebugScene.ts`
- `src/game/content/items/*.json`
- `scripts/validate-content-data.mjs`

#### Risky Areas

- Save migration: active hazards and route modifiers are persisted, but battle-only timers are normalized defensively.
- Board mutation: all hazard failure effects use safe insertion/cleanup helpers and avoid replacing Cascade Gravity.
- Mobile UI: the warning tray is compact and sits above the event log, but still needs a device smoke test for crowding with inventory expanded.
- Route risks: risky choices queue warning-window hazards where possible; if the tray is full, the risk waits/logs instead of stacking unfairly.


---

## Reactive Difficulty Smoke Test Matrix

**Source file:** `REACTIVE_DIFFICULTY_SMOKE_TEST_MATRIX.md`

**Consolidation note:** Use as the manual QA checklist for hazards, counters, route rewards, and save/load.

### Reactive Difficulty Smoke Test Matrix

Updated: 2026-05-18

#### Incoming Junk

1. Queue 6 junk from DebugScene.
2. Trigger Cascade 2 using the cascade test board.
3. Confirm the event log trims incoming junk before landing.
4. Use Snack Shield and confirm countdown increases by 3 pieces.
5. Use Return Stamp and confirm roughly half reflects as enemy damage.

#### Floating Blocks

1. Spawn Floaty Rune from DebugScene.
2. Use Cloud Pin and confirm the floater resolves safely.
3. Spawn Floaty Rune again.
4. Use Balloon Pop and confirm it clears the floater and queues one warned crumb junk.

#### Hazard Windows

1. Trigger Freeze Warning and use Hot Cocoa.
2. Confirm the warning clears and mana increases.
3. Trigger Preview Glitter and use Preview Glasses.
4. Confirm Next/Hold readability returns.
5. Trigger Low Ceiling and use Tent Pole or Safety Net.
6. Confirm the hazard resolves without a soft-lock.
7. Trigger Bad Piece, Speed Wave, Sleepy Tune, and Royal Pattern from DebugScene and verify counter hints appear.

#### Spell Catalysts

1. Use Firecracker Sugar, then Fireball on a board with sticky/junk.
2. Confirm cleanup occurs and the modifier is consumed.
3. Use Cleaning Charm, then Void/Clean Cut.
4. Confirm row clear also removes junk/sticky.
5. Use Spell Coupon, cast any spell, and confirm reduced mana cost.
6. Use an incompatible catalyst before the wrong spell and confirm it waits.

#### Hero And Relic Synergies

1. Pippa: cast Fireball and confirm sticky/junk cleanup.
2. Nixie: trigger freeze or speed wave once and confirm Stay Chill softens it.
3. Bruk: force top-out and confirm No Snack Left Behind clears room once.
4. Zuzu: cast Bomb Rune and confirm stronger bomb output with warned crumb risk chance.
5. Lumi: clear star blocks during incoming junk and confirm extra junk reduction.

#### Route Story / Reactive Difficulty

1. Trigger Milo Stage 1 route and choose Practical; confirm shield/safety reward.
2. Trigger Pippa Stage 1 route and choose True; confirm heal/counter reward and true flag.
3. Trigger Zuzu Stage 2 route and choose Risky; confirm reward plus warned junk risk.
4. Trigger Nixie Stage 3 route and choose True; confirm freeze/speed guard modifier.
5. Trigger Bruk Stage 6 route and choose True; confirm boss/route modifier.
6. Trigger Lumi Stage 5 route and choose Risky; confirm reward plus preview/speed/royal warning as configured.

#### Save / Load

1. Save with active incoming junk and reload.
2. Confirm it restores or normalizes safely.
3. Save with active floating block and reload.
4. Confirm it restores or normalizes safely.
5. Save with active stage/boss/run route modifier and reload.
6. Confirm route modifier persists if its duration is not battle-only.
7. Confirm missing/corrupt reactive state initializes safely.


---

## Board Block Frame Animation Gameplay Integration

**Source file:** `BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION_WITH_STORY_FLOW.md`

**Consolidation note:** Included because board glow/clear animations affect hazard and cascade feedback, but production asset rules remain in the Asset/Animation SOT.

### Board Block Frame Animation Integration
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
#### Current Follow-up — 2026-05-18

Board block frame animation is implemented and should remain in place.

##### Current status

- PNG frame sequences are supported.
- GIF files are not required.
- Glow and clear animations are visual-only and do not replace Cascade Gravity.
- Board block size is capped by the universal 24px board block constant.
- Missing frames fall back safely.

##### Story route asset note

- Story-route assets such as route trigger icons, choice badges, dialogue panels, portraits, and ending cards are not board-block animations.
- They should use the same asset manifest/fallback philosophy, but they must not alter Cascade Gravity or board clear timing.
- If a route reward highlights a board hazard or special block, use the existing glow/clear frame hooks instead of adding route-specific board logic.

##### Remaining work

- Import final exact-frame PNG packages using `asset_id__animation_name__f00.png` naming.
- Verify complete Priority 1 block animations in battle.
- Keep legacy `_frame_01` paths only for fallback compatibility; new art should use exact-frame naming.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

#### Files Changed

- `src/game/utils/constants.ts`
- `src/game/data/assets.ts`
- `src/game/systems/AssetSystem.ts`
- `src/game/systems/BoardSystem.ts`
- `src/game/types/GameTypes.ts`
- `src/game/scenes/BattleScene.ts`
- `src/game/content/board-blocks/metadata.json`
- `docs/BOARD_BLOCK_FRAME_ANIMATION_INTEGRATION.md`

#### How Frame Animation Works

Board block animations use PNG frame sequences only. GIF files are not supported or required. The exact frame-count and naming standard now lives in `docs/ANIMATION_ASSET_REQUIREMENTS.md`.

Glow animation is visual-only on the existing board sprite. When a block enters a highlighted visual state, the scene tries to play the loaded glow frame sequence. If all 3 glow frames are present, the frames loop until the highlight ends. When the highlight ends, the sprite animation stops and the block returns to its base texture.

Clear animation is visual-only and follows board logic. The board cell is cleared immediately by `BoardSystem`, then `BattleScene` spawns a temporary overlay sprite at the cleared cell position. The overlay plays the clear frame sequence once, then destroys itself. Cascade Gravity continues to use the resolved board state and is not replaced.

#### Folder Structure

Preferred still sprite paths:

```text
public/assets/board-blocks/block_[color/type].png
public/assets/sprites/board-blocks/block_[color/type]/glow/block_[color/type]__glow__f00.png
public/assets/sprites/board-blocks/block_[color/type]/clear/block_[color/type]__clear__f00.png
```

Preferred exact-frame paths:

```text
public/assets/sprites/board-blocks/block_[color/type]/glow/block_[color/type]__glow__f00.png
public/assets/sprites/board-blocks/block_[color/type]/clear/block_[color/type]__clear__f00.png
```

Icon paths:

```text
public/assets/icons/board-blocks/ico_block_[color/type].png
```

#### Backward Compatibility Paths

The manifest also registers old flat sprite paths with legacy texture aliases:

```text
public/assets/sprites/board-blocks/spr_block_[color/type]_rune.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_glow.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_clear.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_glow_frame_01.png
public/assets/sprites/board-blocks/spr_block_[color/type]_rune_clear_frame_01.png
```

Texture resolution uses explicit `assetRefs` first, then old fields such as `spriteKey` and `iconKey`, then inferred preferred paths, then inferred flat legacy aliases, then generated placeholders.

Legacy `_frame_01` paths remain supported as fallback compatibility. New assets should use the exact `asset_id__animation_name__f00.png` sequence from `docs/ANIMATION_ASSET_REQUIREMENTS.md`.

#### Fallback Rules

- Base sprite missing: use the generated board block placeholder.
- Glow frames missing or incomplete: use the glow still sprite if loaded.
- Glow still missing: keep the base sprite.
- Clear frames missing or incomplete: show the clear still sprite briefly if loaded.
- Clear still missing: remove the block visually without crashing.
- Icon missing: use icon fallback behavior, then generated icon placeholder.
- Optional missing animation frames never block gameplay or Cascade Gravity.

#### Timing Constants

`BLOCK_ANIM` defines:

```ts
BOARD_BLOCK_SIZE: 24
BOARD_ICON_SIZE: 48
GLOW_FRAME_COUNT: 3
GLOW_FRAME_MS: 50
GLOW_TOTAL_MS: 150
CLEAR_FRAME_COUNT: 5
CLEAR_FRAME_MS: 40
CLEAR_TOTAL_MS: 200
```

Board block sprites are rendered through the board cell size capped by the universal `24px` board block constant. Source images larger than the cell are not rendered at native size.

#### Content Schema

Board block content may optionally provide:

```json
{
  "spriteKey": "block_red",
  "iconKey": "ico_block_red",
  "assetRefs": {
    "base": "block_red",
    "glow": "block_red_glow",
    "clear": "block_red_clear",
    "icon": "ico_block_red",
    "glowFrames": [
      "block_red__glow__f00",
      "block_red__glow__f01",
      "block_red__glow__f02"
    ],
    "clearFrames": [
      "block_red__clear__f00",
      "block_red__clear__f01",
      "block_red__clear__f02",
      "block_red__clear__f03",
      "block_red__clear__f04"
    ]
  }
}
```

Existing board block JSON remains valid because runtime inference fills omitted variants.


#### Story Route Visual Integration

The character route story flow adds UI and narrative assets that may appear near the board, but they are separate from board-block animation.

Recommended route asset categories:

```text
public/assets/ui/story-routes/
public/assets/icons/story-routes/
public/assets/portraits/heroes/
public/assets/portraits/npcs/
public/assets/story/endings/
public/assets/stage-backgrounds/route-scenes/
public/assets/effects/story-routes/
```

Recommended asset key patterns:

```text
ui_route_dialogue_panel
ui_route_choice_card_practical
ui_route_choice_card_true
ui_route_choice_card_risky
ico_route_trigger_[hero]_[stage]
ico_route_badge_practical
ico_route_badge_true
ico_route_badge_risky
prt_route_[speaker]_[expression]
story_end_[hero]_normal
story_end_[hero]_true
story_end_[hero]_variant
vfx_route_reward_sparkle
vfx_route_risky_oopsie
```

Rules:

- Route dialogue panels and choice cards are UI assets, not board-block sprites.
- Route trigger icons should be loaded through the asset manifest with fallback icons.
- Hero portraits and NPC portraits should fall back to safe placeholder portraits.
- Ending cards should fall back to a generic festival ending card.
- Route reward VFX may highlight board blocks, but should call existing board highlight/glow helpers.
- Missing route visual assets must never block dialogue, choice resolution, rewards, or endings.

If a route reward clears, glows, pins, freezes, or transforms a board block, the visual sequence should use the board block's existing `glowFrames` and `clearFrames` where available. Do not create separate board logic just for the story system.


#### How To Test

1. Start a battle.
2. Confirm normal board rendering remains stable.
3. Add a complete 3-frame glow sequence for a block and trigger a highlighted state such as Fever or a floating hazard.
4. Confirm glow frames loop at 50 ms per frame.
5. End the highlighted state and confirm the block returns to base.
6. Add a complete 5-frame clear sequence for a block and clear it in a line.
7. Confirm the clear overlay plays once at 40 ms per frame and then disappears.
8. Remove one optional frame and confirm the game falls back without crashing.
9. Confirm Cascade Gravity still resolves after line clears.
10. Open UI that uses content icons and confirm missing icons fall back safely.
11. Trigger a route story event and confirm dialogue/choice UI assets fall back safely if missing.
12. Choose a route reward that highlights or clears blocks and confirm it uses existing glow/clear frame hooks without changing Cascade Gravity.

<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_START -->
## 2026-06-02 Feature Update — Fever Showtime Reactive Difficulty

### Purpose

Fever Showtime adds a new reactive difficulty layer: the player may delay line clears for a stronger release, while enemies and bosses may continue applying readable pressure.

The design target is:

```text
Greedy Fever play should be tempting, understandable, and risky, but never an unavoidable instant-loss trap.
```

### Fever Pressure Budget

During active Fever, any enemy/boss effect that adds blocks, junk, hazards, board pressure, preview disruption, or board-shape pressure should route through Fever Pressure Budget when practical.

Pressure bands:

```ts
type FeverPressureBand = "low" | "medium" | "high" | "critical";
```

Pressure snapshot should consider:

```text
occupied cell ratio
highest occupied row / danger height
spawn-zone safety
Charged Line count
Soft Junk count
active hazard count
incoming junk queue
requested pressure amount
board size
```

Suggested result shape:

```ts
type FeverPressureBudgetResult = {
  requestedCells: number;
  appliedHardCells: number;
  softJunkCells: number;
  delayedJunkCells: number;
  heatAdded: number;
  shieldDamage: number;
  bossAdvantagePoints: number;
  skippedUnsafeCells: number;
  pressureBand: FeverPressureBand;
};
```

### Pressure Conversion Rules

| Pressure Band | Hard Pressure | Converted Pressure | Heat |
| --- | ---: | ---: | ---: |
| Low | 100% | 0% | +0 |
| Medium | ~70% | ~30% | +5 |
| High | ~40% | ~60% | +10 |
| Critical | 0-20% only if spawn-safe | 80-100% | +15 |

Converted pressure may become:

```text
Soft Junk
Fever Heat
delayed junk
shield damage, if current combat rules support it
boss advantage
reduced reward
event log pressure
```

Converted pressure must not become:

```text
unavoidable instant Game Over
unwarned spawn-zone block
uncounterable boss kill
permanent board corruption
```

### Soft Junk

Soft Junk is temporary pressure created by Fever Pressure Budget.

Rules:

1. Soft Junk may appear during Fever or from Fever pressure conversion.
2. Soft Junk occupies board space but is less punishing than normal hard junk.
3. Soft Junk must not spawn directly in the piece spawn zone.
4. Soft Junk should prefer lower/mid board safe cells.
5. Soft Junk should be visually/logically distinct from normal junk.
6. Soft Junk may clear during Fever release if affected by the cleared/charged area.
7. Remaining Soft Junk resolves after Fever ends:
   - safe conversion -> normal junk
   - unsafe conversion -> delayed junk or Fever Heat penalty
   - no delayed-junk support -> reduced reward or boss shield fallback
8. Soft Junk never persists between nodes.

### Fever Heat

Fever Heat is the greed pressure score.

Heat sources:

```text
staying in Fever longer
charging many lines
boss pressure during Fever
high/critical board pressure
Soft Junk generated during Fever
critical pressure conversion
```

Heat effects apply on Fever release:

| Heat Level | Effect Direction |
| --- | --- |
| none / low | no penalty |
| medium | reduce Fever mana gain slightly |
| high | reduce Fever mana gain, reduce overflow efficiency, possible small boss shield |
| max | messy release: stronger reward reduction, delayed pressure, or boss advantage |

Rules:

- Heat must not prevent Fever release.
- Heat must not directly cause unavoidable instant Game Over.
- Heat should punish greed through reward/utility changes, delayed pressure, or boss advantage.
- Heat must clear at node end.

### Fever Hazard Fairness Rules

Every Fever pressure interaction must obey the core reactive difficulty rules:

```text
warning first
counter window
no soft-lock
no simultaneous impossible hazard stack
fallback-safe if unsupported
```

Additional Fever-specific rules:

```text
No direct hard-pressure spawn in the active piece spawn zone during Fever.
No pressure effect may rely on hidden cancellation as normal behavior.
Critical pressure converts rather than instantly kills.
Last-resort repair exists only for invalid/impossible states.
Player must understand why a pressure effect changed form.
```

### Route Reward / Risk Integration

Route choices may interact with Fever only if the runtime effect is real.

Allowed route reward examples:

```text
Milo: first cascade of battle grants bonus Fever.
Pippa: Fever release cleans sticky/junk if supported.
Zuzu: gadget Fever pressure converts more safely.
Nixie: lowers Fever Heat gain once per node.
Bruk: Showtime Overflow converts into shield.
Lumi: Star Encore or star/Fever guidance.
```

Risky route choices may add Fever pressure, but must still pass Fever Pressure Budget.

### Fever Smoke Test Matrix

Add these to reactive difficulty smoke tests:

| Test Area | Expected Result |
| --- | --- |
| Normal Fever activation | Completed rows become Charged Lines; no immediate clear. |
| Manual release | Charged Lines clear together; Cascade Gravity resolves. |
| Duration expiry | Fever releases safely and clears active state. |
| Max Charged Lines | Auto-release triggers; no duplicate charged rows. |
| Boss cap | Boss direct damage cap applies; overflow converts to utility. |
| Pressure low | Boss pressure applies mostly normally. |
| Pressure high | Excess pressure converts to Soft Junk/Heat/delayed pressure/boss advantage. |
| Pressure critical | No unavoidable instant Game Over. |
| Soft Junk | No spawn-zone placement; resolves safely after Fever. |
| Heat | Heat affects reward/utility but does not block release. |
| Node end | Charged Lines, Soft Junk, Heat, and active Fever state are cleared. |
| Save/load | Old saves and invalid active Fever states repair safely. |
<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_END -->
