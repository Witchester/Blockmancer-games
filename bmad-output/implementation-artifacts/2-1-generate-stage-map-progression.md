# Implementation Artifact: Story 2.1 - Generate Stage Map Progression

**Story ID:** Epic 2 Story 2.1  
**Story Title:** Generate Stage Map Progression  
**Status:** Complete  
**Implementation Date:** 2026-05-22  
**Developer:** AI Agent  

---

## Overview

This story implements procedural generation of stage maps for all 6 stages of the dungeon run, ensuring each stage has appropriate length, branching paths, and room type distribution.

---

## Implementation Details

### Files Modified/Created

1. **`/workspace/src/game/systems/MapSystem.ts`** - Core map generation system
2. **`/workspace/src/game/systems/StageSystem.ts`** - Stage ordering and progression
3. **`/workspace/src/game/content/stages/`** - 6 stage definition JSON files
4. **`/workspace/src/game/content/map-nodes/`** - Room type definitions

### Key Features Implemented

#### Stage Configuration (`STAGE_NODE_CONFIG`)

Each stage has defined parameters:

| Stage | Main Path Length | Total Nodes Range | Required Rooms | Fight Weight |
|-------|------------------|-------------------|----------------|--------------|
| 1 | 6 | 9-11 | 3 fights, 1 event, 1 treasure, 1 boss | 55% |
| 2 | 8 | 12-14 | 4 fights, 1 event, 1 shop, 1 elite, 1 boss | 50% |
| 3 | 10 | 15-17 | 5 fights, 1 event, 1 rest, 1 treasure, 1 elite, 1 boss | 48% |
| 4 | 12 | 18-21 | 6 fights, 2 events, 1 shop, 1 rest, 1 elite, 1 boss | 45% |
| 5 | 14 | 22-25 | 7 fights, 2 events, 1 shop, 1 treasure, 2 elites, 1 boss | 42% |
| 6 | 16 | 26-30 | 8 fights, 2 events, 1 shop, 1 rest, 3 elites, 1 boss | 40% |

#### Map Generation Algorithm

1. **Main Path Creation:**
   - Creates linear path from start to boss
   - Alternates x-position (0.42/0.58) for visual variety
   - Distributes nodes vertically with proper spacing

2. **Branch Path Creation:**
   - Adds side branches that reconnect to main path
   - Branches use weighted random room type selection
   - Ensures branches don't exceed map boundaries (0.12-0.88 x-range)

3. **Room Type Labels:**
   - Start (S), Fight (F), Event (?), Shop ($), Elite (E), Rest (R), Treasure (T), Boss (B)

### Stage Definitions Content

All 6 stages registered in content registry:

```json
// stage_sprinkle_sewers (Stage 1)
{
  "id": "stage_sprinkle_sewers",
  "name": "Sprinkle Sewers",
  "bossId": "mon_boss_cupcake_slime_king",
  "theme": "sprinkle_sewers"
}

// stage_goblin_workshop (Stage 2)
{
  "id": "stage_goblin_workshop", 
  "name": "Goblin Workshop",
  "bossId": "mon_boss_prototype_no_7",
  "theme": "goblin_workshop"
}

// stage_frosty_pantry (Stage 3)
{
  "id": "stage_frosty_pantry",
  "name": "Frosty Pantry", 
  "bossId": "mon_boss_gelato_golem",
  "theme": "ice_cave"
}

// stage_pillow_castle (Stage 4)
{
  "id": "stage_pillow_castle",
  "name": "Pillow Castle",
  "bossId": "mon_boss_sir_snore_a_lot", 
  "theme": "royal_ruins"
}

// stage_starfall_arcade (Stage 5)
{
  "id": "stage_starfall_arcade",
  "name": "Starfall Arcade",
  "bossId": "mon_boss_high_score_hydra",
  "theme": "void"
}

// stage_bloxley_block_palace (Stage 6)
{
  "id": "stage_bloxley_block_palace",
  "name": "Bloxley's Block Palace",
  "bossId": "mon_boss_king_bloxley",
  "theme": "royal_ruins"
}
```

---

## Verification

### Static Analysis Tests

```javascript
// Test: All 6 stages have valid configurations
const stages = stageSystem.listStages();
assert(stages.length === 6, "Expected 6 stages");

// Test: Stage order is correct
assert(stages[0].id === 'stage_sprinkle_sewers');
assert(stages[5].id === 'stage_bloxley_block_palace');

// Test: Map generation produces valid node counts
for (let stage = 1; stage <= 6; stage++) {
  const map = mapSystem.createMap(stage);
  const config = STAGE_NODE_CONFIG[stage];
  assert(map.length >= config.totalNodes[0]);
  assert(map.length <= config.totalNodes[1]);
}

// Test: All maps have start and boss nodes
for (let stage = 1; stage <= 6; stage++) {
  const map = mapSystem.createMap(stage);
  assert(map.some(n => n.roomType === 'start'));
  assert(map.some(n => n.roomType === 'boss'));
}

// Test: Connections form valid paths
for (let stage = 1; stage <= 6; stage++) {
  const map = mapSystem.createMap(stage);
  const startNode = map.find(n => n.id === 'start');
  assert(startNode.connections.length > 0, "Start node must have connections");
}
```

### FR Traceability

- **FR8**: Six-stage dungeon structure ✅
- **FR31**: Stage-specific content ✅
- **FR34**: Map scaling across stages ✅

---

## Architecture Compliance

### NFR Compliance

- **NFR1**: Phaser 3/TypeScript implementation ✅
- **NFR9**: Scene/system boundaries respected (MapSystem is pure logic) ✅
- **NFR11**: Stable data IDs (stage IDs preserved) ✅
- **NFR19**: Solo-dev friendly (data-driven configuration) ✅

### Content Registry Integration

- All stages registered via `ContentRegistry` with category `'stage'`
- Fallback ID: `stage_sprinkle_sewers`
- Metadata includes validation rules and example IDs

---

## Known Limitations

1. **No Visual Map UI**: This story covers backend generation only; visual map display is part of Battle/Map scene UI work
2. **Deterministic Testing**: Map generation uses `randInt()` which requires seed injection for fully deterministic tests
3. **Branch Complexity**: Branch reconnection logic is simplified; complex branch topologies not supported

---

## Completion Evidence

### Code Artifacts
- [x] `MapSystem.ts` - Complete with `createMap()`, `generateStageMap()`, navigation methods
- [x] `StageSystem.ts` - Complete with `listStages()`, `getStageByIndex()`, `isFinalStage()`
- [x] 6 stage JSON files in `/content/stages/`
- [x] 9 map node type JSON files in `/content/map-nodes/`

### Content Registry
- [x] Stage metadata with validation schema
- [x] All stages marked `enabled: true`
- [x] Fallback configuration present

### Integration Points
- [x] `MapSystem.advanceAfterBoss()` integrates with `StageSystem.isFinalStage()`
- [x] `RunState.map` populated via `MapSystem.createMap()`
- [x] Node navigation via `getAvailableNodes()`, `canVisit()`, `moveToNode()`

---

## Next Steps

1. **Story 2.2**: Track stage goals (separate artifact created)
2. **Story 2.3**: Implement non-combat room flows
3. **Story 2.4**: Show boss rule cards before fights
4. **Story 2.6**: End-to-end run completion testing

---

**Sign-off:** Implementation complete and ready for integration testing.
