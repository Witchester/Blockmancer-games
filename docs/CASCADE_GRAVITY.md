# Cascade Gravity System

## Overview

The **Cascade Gravity System** is the core falling-block clearing mechanic in Blockmancer Dungeon. When the player clears completed rows, remaining blocks fall straight down within their columns in a deterministic, grid-based cascade rather than shifting rows like classic Tetris. This creates Puyo-style chain clears while maintaining predictable, fair, and mobile-friendly gameplay.

## How It Works

### 1. Line Clear Phase
After a piece locks, the board scans all rows to identify **completed rows** (rows where every cell contains a block).

### 2. Cascade Loop
For each cascade iteration:
- **Detect** all completed rows
- **Remove** all blocks in those rows
- **Apply Gravity** by collapsing blocks in each column downward
- **Repeat** until no completed rows remain

### 3. Result
A single lock action can trigger **multiple cascades**, each clearing more rows as blocks fall into new positions below.

## Key Design Principles

### ✓ Deterministic
- No randomness in gravity behavior
- Each block falls straight down in its column
- Same board state always produces the same cascade result

### ✓ Grid-Based (Not Physics)
- No real physics engine
- Fast and mobile-friendly
- Predictable for balance tuning

### ✓ Fair
- Cascades are earned through skill, not luck
- Combo scaling rewards careful play
- Special blocks (future) can extend interactions without breaking balance

### ✓ Engaging
- Multiple cascades from one move create satisfying moments
- Cascade count directly increases damage and mana
- Event log messages communicate cascade progress to the player

## Combat Integration

### Cascade Damage Multiplier
```
Cascade 1 (initial clear):    100% base damage
Cascade 2:                    125% base damage
Cascade 3:                    150% base damage
Cascade 4+:                   200% base damage
```

### Cascade Mana Bonus
- Initial line clear grants **baseline mana** (from `MANA_GAIN` constants)
- Each cascade beyond the first grants **50% bonus mana** on top of baseline

### Cascade Combo
- Each cascade increments the **combo counter**
- Combo bonus stacks on top of damage calculations
- No line clear resets combo (only works if cascade clears 0 lines)

### Event Log Messages
```
Line cleared!
Cascade Gravity triggered!
Cascade x2!
Blocks collapsed into a new line!
Cascade combo dealt bonus damage!
```

## Balance Values

Located in `src/game/utils/constants.ts`:

```typescript
// Line clear mana gains (per lines cleared)
export const MANA_GAIN: Record<number, number> = {
  1: 10,
  2: 25,
  3: 45,
  4: 70
};

// Line clear damage bonuses (per lines cleared)
export const LINE_CLEAR_BONUS: Record<number, number> = {
  1: 0,
  2: 8,
  3: 18,
  4: 35
};

// Combo bonus (cumulative damage bonus)
// Combo 1: +0, Combo 2: +3, Combo 3: +7, Combo 4+: +12

// Cascade mana bonus multiplier
export const CASCADE_MANA_BONUS_MULTIPLIER = 0.5; // 50% of baseline
```

## Technical Implementation

### CascadeResult Type
```typescript
type CascadeResult = {
  totalLinesCleared: number;        // Sum of all lines across all cascades
  cascadeCount: number;             // How many cascade iterations occurred
  clearedLinesPerCascade: number[]; // Array of line counts per cascade
  blocksDropped: number;            // Total cells that moved downward
  causedCombo: boolean;             // true if cascadeCount > 1
};
```

### BoardSystem Methods

#### `detectCompletedLines(): number[]`
Scans all rows and returns indices of completed rows.

#### `removeCompletedLines(rowIndices: number[]): void`
Clears blocks from specified rows. Calls `handleSpecialBlockClear()` for each block (future hook).

#### `applyCascadeGravity(): number`
Collapses blocks in each column downward, filling empty spaces. Returns total blocks moved.

#### `clearLinesCascade(): CascadeResult`
Orchestrates the full cascade loop until board stabilizes.

### CombatSystem Methods

#### `resolveCascadeClear(cascade: CascadeResult): number`
Applies cascade result to combat:
- Increments combo by `cascadeCount`
- Applies cascade damage multiplier
- Adds baseline + bonus mana
- Logs cascade events
- Returns total damage dealt

#### `getCascadeMultiplier(cascadeCount: number): number`
Returns damage multiplier for cascade iteration:
```
1 → 1.0x
2 → 1.25x
3 → 1.5x
4+ → 2.0x
```

## Special Blocks (Future)

The system includes a placeholder hook in `BoardSystem.handleSpecialBlockClear()` for future special block types:

- **block_magic**: Grant bonus mana when cleared in a cascade
- **block_bomb**: Clear nearby cells, then trigger another cascade iteration
- **block_stone**: Heavy block placeholder (maybe immune to some clears)
- **block_ice**: Slide/freeze behavior (future exploration)
- **block_void**: Delete adjacent blocks when cleared

Current implementation is vanilla—no special blocks are active yet. The hook is ready for expansion.

## Testing Checklist

- [ ] Piece locks and clears a single line → 1 cascade, correct damage
- [ ] Falling blocks create a new line → 2 cascades, increased damage
- [ ] Multiple cascades in sequence → cascadeCount incremented correctly
- [ ] Mana gain = baseline + cascade bonus (if cascadeCount > 1)
- [ ] Event log shows "Cascade x2!", "Cascade x3!", etc.
- [ ] Combo counter increments by cascadeCount (not just by 1)
- [ ] No cascades → combo resets, message "Combo resets"
- [ ] Board remains stable after cascade (no orphaned blocks)
- [ ] Mobile touch input triggers cascades correctly
- [ ] No frame drops during multi-cascade events

## Mobile Considerations

- Cascade gravity is grid-based, not physics-based → no performance impact
- Event log messages are brief and quick to display
- Cascade animations (if added later) can use simple tween-based drops
- Column-based gravity is friendly to tall narrow mobile screens

## Future Enhancements

1. **Cascade Animations**
   - Tween blocks downward over 0.2-0.4s per cascade
   - Visual feedback for combo milestone (e.g., flash on x3+)

2. **Sound Design**
   - Distinct SFX for cascade trigger vs. initial clear
   - Pitch variation or stacking for multiple cascades
   - Combo milestone chimes

3. **Special Block Physics**
   - Implement special block clear hooks
   - Chain bonus for magic blocks, bomb blocks, etc.

4. **Score Tracking**
   - Cascade-weighted scoring for leaderboards
   - Cascade milestone achievements

5. **Advanced Board States**
   - Unstable blocks that only fall after certain conditions
   - Weighted/sticky blocks that fall slower
   - Lock delay extension on cascade

## FAQ

**Q: Is this real physics?**  
A: No. It's deterministic grid-based gravity. Each column collapses independently. This makes it fair, fast, and tunable.

**Q: Can I get cascades on purpose?**  
A: Yes. By setting up blocks so that cleared lines leave gaps for cascades to fill.

**Q: Does cascade reset on a non-clear?**  
A: Yes. Any lock that clears 0 lines resets the combo to 0.

**Q: Can special blocks make cascades more powerful?**  
A: Yes. The hook `handleSpecialBlockClear()` is ready for custom behavior per block type.

**Q: How is this different from Puyo Puyo?**  
A: Puyo uses colored group matching. Blockmancer uses line clearing. But both use cascading gravity. The mechanic feels similar but emerges from different board state logic.

## References

- `src/game/systems/BoardSystem.ts` – Cascade detection and gravity logic
- `src/game/systems/CombatSystem.ts` – Damage/mana scaling from cascades
- `src/game/types/GameTypes.ts` – CascadeResult type definition
- `src/game/utils/constants.ts` – Balance tuning values
- `docs/GDD.md` – Game design overview
- `docs/TECHNICAL_DESIGN.md` – Architecture and system flow
