# Blockmancer Upgrade System Redesign — Clean SOT Update Report

**Updated:** 2026-06-02

## What changed

The SOT files were rebuilt as clean current-canonical documents.

This version removes additive overlay sections, update markers, generated-package notes, and historical status blocks that are no longer needed in the working SOT set.

## Files rebuilt

```text
00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md
03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md
04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md
```

## Current canonical additions retained

- Fever Showtime Cascade rules.
- Hero / Board / Fever upgrade categories.
- Category-first level-up flow.
- No normal card rarity/rank labels.
- Lv1-Lv5 upgrade card progression.
- 5 total slots, max 2 per category.
- Owned-card reappearance and Lv4 priority.
- Legendary Evolution rules.
- Hero / Board / Fever card pools.
- Compatibility upgrade ID mapping.
- Runtime safety rules for Cascade Gravity, Fever Showtime, Boss Drama Guard, and save/load.
- Upgrade UI/icon/VFX/folder placement.
- Implementation phases Prompt 1-8.
- Post-implementation audit matrix.

## Notes

- These are documentation updates only.
- Implementation status still requires repo audit, validation, and smoke tests.
- The clean files do not contain overlay markers or historical append-only update blocks.
