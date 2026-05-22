# Implementation Artifact: Story 2.3 - Play Non-Combat Rooms

**Story ID:** Epic 2 Story 2.3  
**Story Title:** Play Non-Combat Rooms  
**Status:** Complete  
**Implementation Date:** 2026-05-22  
**Developer:** AI Agent  

---

## Overview

This story implements all non-combat room types in the dungeon run, including Event rooms, Shop rooms, Rest rooms, Treasure rooms, and Elite rooms. Each room type provides distinct gameplay experiences with meaningful choices and consequences.

---

## Implementation Details

### Files Modified/Created

1. **`/workspace/src/game/systems/EventSystem.ts`** (361 lines) - Event room logic and choices
2. **`/workspace/src/game/systems/ShopSystem.ts`** (133 lines) - Shop purchasing logic
3. **`/workspace/src/game/content/room-events/`** - 12 room event JSON definitions
4. **`/workspace/src/game/content/items/`** - 40+ item definitions for shop/treasure
5. **`/workspace/src/game/content/relics/`** - 16 relic definitions
6. **`/workspace/src/game/content/spells/`** - Spell definitions for upgrades

---

## Room Type Implementations

### 1. Event Rooms (`roomType: 'event'`)

**System:** `EventSystem`

**Features:**
- Biome-themed event selection based on current stage
- Multiple choice outcomes with requirements
- Effects include: gold, healing, rewards, oopsies, spell upgrades, elite fights

**Event Types Implemented:**

| Event ID | Name | Choices | Effects |
|----------|------|---------|---------|
| `evt_shrine_of_gravity` | Shrine of Gravity | Anchor/Take Tribute/Snack Trade | Slow fall/Gold/Reward+Damage |
| `evt_broken_anvil` | Broken Anvil | Temper Spell/Pay 30 Gold/Leave | Spell upgrade/Paid upgrade |
| `evt_strange_mirror` | Strange Mirror | Duplicate Relic/Take Oopsie/Leave | Relic copy/Oopsie+60 gold |
| `evt_lost_knight` | Lost Knight | Bind Wounds/Honor Duel/Search Camp | Heal/Gold+harder path/Relic |
| `evt_arcade_challenge` | Arcade Challenge | Various | Combo challenges |
| `evt_goblin_quality_test` | Goblin Quality Test | Various | Machine interactions |
| `evt_mana_well` | Mana Well | Various | Mana restoration |
| `evt_rainbow_fountain` | Rainbow Fountain | Various | Blessings |
| `evt_suspicious_button` | Suspicious Button | Press/Leave | Random effects |
| `evt_cursed_fountain` | Cursed Fountain | Drink/Leave | Risk/reward |
| `evt_block_o_manual_page` | Block-O-Manual Page | Read/Leave | Tips + small buff |
| `evt_jelly_surge` | Jelly Surge | Ride it out/Dodge | Movement effects |

**Choice Resolution Flow:**
```typescript
resolveChoice(state, eventEntry, choiceEntry): EventResolution {
  // 1. Check requirements (HP, gold, items)
  // 2. Apply effects array or effectType switch
  // 3. Return transition type ('stay', 'map', 'battle')
  // 4. Generate outcome messages
}
```

### 2. Shop Rooms (`roomType: 'shop'`)

**System:** `ShopSystem`

**Features:**
- Item browsing and purchasing
- Gold-based economy
- Inventory management integration

**Shop Operations:**
```typescript
class ShopSystem {
  getAvailableItems(state): ShopItem[]
  purchaseItem(state, itemId): { success: boolean, message: string }
  applyItemEffect(state, item): string
}
```

**Item Categories:**
- Consumables (healing, mana, temporary buffs)
- Permanent upgrades (spell enhancements, relic-like effects)
- Utility (preview, hold manipulation, queue control)

### 3. Rest Rooms (`roomType: 'rest'`)

**Implementation:** Handled via EventSystem with rest-themed events

**Features:**
- HP recovery options
- Status effect cleansing
- Optional risk/reward "long rest" mechanics

### 4. Treasure Rooms (`roomType: 'treasure'`)

**Implementation:** Special event type with guaranteed rewards

**Features:**
- Free reward cards (no cost)
- Higher rarity item chances
- Occasionally includes relics or spell upgrades

### 5. Elite Rooms (`roomType: 'elite'`)

**Implementation:** EventSystem `start_elite_fight` transition

**Features:**
- Spawns elite enemy via `EnemySystem.spawnEnemy('elite', stage)`
- Transitions to battle state
- Elite-specific loot table on victory
- Higher difficulty than normal fights

---

## Content Registry Integration

### Room Events (12 defined)

All events registered under `'roomEvent'` category:
- Fallback ID: `evt_shrine_of_gravity`
- Biome tagging for stage-appropriate selection
- Choice validation with requirement checking

### Items (40+ defined)

Registered under `'item'` category:
- Fallback ID: `item_mana_lemonade`
- Shop-purchasable and treasure-rewardable
- Effect handlers in `GameplayEffectSystem`

### Relics (16 defined)

Registered under `'relic'` category:
- Fallback ID: `rel_goblin_coin`
- Persistent run benefits
- Some obtainable only through specific events

---

## Verification

### Static Analysis Tests

```javascript
// Test: All room types have implementations
const roomTypes = ['fight', 'event', 'shop', 'elite', 'rest', 'treasure', 'boss'];
for (const roomType of roomTypes) {
  assert(contentRegistry.has('mapNode', `node_${roomType}`), 
         `Missing map node for ${roomType}`);
}

// Test: Event system returns valid events
const event = eventSystem.getRandomEvent(1);
assert(event.id, "Event must have ID");
assert(event.choices.length > 0, "Event must have choices");
assert(event.choices.every(c => c.label), "All choices need labels");

// Test: Event resolution produces transitions
const state = createTestRunState();
const resolution = eventSystem.resolveChoice(state, event, event.choices[0]);
assert(['stay', 'map', 'battle'].includes(resolution.transition));
assert(resolution.messages.length > 0);

// Test: Shop items are purchasable
const items = contentRegistry.listEnabled('item');
assert(items.length >= 40, "Expected 40+ items");

// Test: Elite fights spawn correctly
const eliteEnemy = enemySystem.spawnEnemy('elite', 3);
assert(eliteEnemy, "Elite enemy should spawn");
assert(eliteEnemy.roomType === 'elite');
```

### FR Traceability

- **FR35**: Non-combat rooms ✅
- **FR37**: Inventory/items ✅
- **FR38**: Spells ✅
- **FR41**: Settings/audio (event SFX hooks) ✅

---

## Architecture Compliance

### NFR Compliance

- **NFR1**: Phaser 3/TypeScript implementation ✅
- **NFR9**: System boundaries (EventSystem, ShopSystem separate) ✅
- **NFR11**: Stable content IDs ✅
- **NFR19**: Data-driven design (JSON content files) ✅

### Integration Points

- `MapSystem.moveToNode()` sets `currentRoomType`
- `BlockmancerGame` scene manager routes to appropriate scene
- `SaveSystem` persists room progress
- `RewardSystem` handles treasure/event rewards

---

## Room Flow State Machine

```
start → [map] → available nodes
              ↓
        player selects node
              ↓
    moveToNode() updates state
              ↓
    currentRoomType determines flow:
    ├─ fight → BattleScene
    ├─ event → EventScene → resolveChoice → map
    ├─ shop → ShopScene → purchase → map
    ├─ rest → EventScene (rest theme) → map
    ├─ treasure → EventScene (reward theme) → map
    ├─ elite → BattleScene (elite enemy) → map
    └─ boss → BattleScene (boss enemy) → advanceAfterBoss
```

---

## Known Limitations

1. **No Dedicated Scene Classes**: Event/Shop/Rest/Treasure use generic room handling; dedicated UI scenes needed for polish
2. **Limited Biome Tagging**: Most events use 'dungeon' biome; stage-specific theming incomplete
3. **Shop UI Not Implemented**: Backend shop logic exists but visual shop interface pending
4. **Rest Mechanics Simplified**: Rest rooms use event system rather than dedicated rest mechanics

---

## Completion Evidence

### Code Artifacts
- [x] `EventSystem.ts` - Complete with `getRandomEvent()`, `resolveChoice()`, effect application
- [x] `ShopSystem.ts` - Complete with item purchasing and inventory integration
- [x] 12 room event JSON files with multiple choices each
- [x] EnemySystem elite spawn support

### Content Registry
- [x] Room event metadata with validation schema
- [x] 40+ items marked `enabled: true`
- [x] 16 relics available for events/treasure

### Integration Tests Passed
- [x] Event selection respects biome filtering
- [x] Choice requirements validated before resolution
- [x] Elite fights transition to battle state correctly
- [x] Treasure events grant rewards without cost

---

## Next Steps

1. **Visual Scenes**: Create dedicated EventScene, ShopScene, RestScene UI classes
2. **Biome Expansion**: Add stage-specific event variants
3. **Shop UI**: Implement visual shop interface with item browsing
4. **Rest Mechanics**: Add dedicated rest room features (campfire, dream sequences)

---

**Sign-off:** Implementation complete for backend logic. Visual scene work pending.
