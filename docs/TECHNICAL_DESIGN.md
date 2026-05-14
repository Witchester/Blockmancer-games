# Technical Design

## 1. Tech Stack

The project uses:

- Vite for development and bundling
- TypeScript for typed gameplay code
- Phaser 3 for rendering, scenes, input, and game loop structure
- Capacitor for Android packaging
- localStorage for save persistence

Current placeholder philosophy:

- Prefer stable, readable logic over advanced simulation
- Prefer generated shapes and text over external art assets
- Keep the runtime lightweight and easy to refactor toward content-driven systems

## 2. Scene Architecture

Current implemented scenes:

- `BootScene`
- `MainMenuScene`
- `MapScene`
- `BattleScene`
- `RewardScene`
- `GameOverScene`

Planned full scene architecture:

- `BootScene`
- `MainMenuScene`
- `HeroSelectScene`
- `MapScene`
- `BattleScene`
- `RewardScene`
- `EventScene`
- `ShopScene`
- `RestScene`
- `TreasureScene`
- `GameOverScene`

Current flow:

- Boot to Main Menu
- Main Menu to Map
- Map to Battle for combat nodes
- Battle to Reward or Game Over
- Reward back to Map
- Boss victory to Game Over

Current deviation from target:

- Event, shop, rest, and treasure logic are handled as overlays or inline map resolution rather than dedicated scenes
- Hero select does not yet exist as a separate scene

## 3. System Architecture

Current implemented systems:

- `BoardSystem`
- `CombatSystem`
- `EnemySystem`
- `SpellSystem`
- `RewardSystem`
- `MapSystem`
- `SaveSystem`

Planned system architecture:

- `BoardSystem`
- `CombatSystem`
- `EnemySystem`
- `SpellSystem`
- `RewardSystem`
- `RelicSystem`
- `UpgradeSystem`
- `HeroSystem`
- `WeaponSystem`
- `MapSystem`
- `EventSystem`
- `ShopSystem`
- `DifficultySystem`
- `SaveSystem`
- `AudioSystem`
- `InputSystem`
- `ContentRegistry`

Current design principle:

- Keep core logic in systems where possible
- Let scenes orchestrate input, render, and scene transitions
- Avoid burying all game state changes inside scene classes long term

## 4. Content Registry

The long-term content architecture should move away from runtime hardcoded TypeScript tables and toward JSON-driven content under `src/game/content`.

Target `ContentRegistry` responsibilities:

- Load content entries by category
- Provide `getById()` and `list()` accessors
- Validate references during load
- Offer safe fallbacks when IDs are missing
- Bridge runtime systems to content IDs rather than static constants

Current status:

- Metadata schemas exist under `src/game/content/*/metadata.json`
- Actual content entry JSON files do not yet exist
- Runtime still uses TypeScript data modules for enemies, rewards, spells, and map layout

Recommended next step:

- Add placeholder content entry files
- Implement `ContentRegistry`
- Refactor runtime data access toward content IDs

## 5. Game State Model

Current game state lives on the custom `BlockmancerGame` instance as a mutable `runState`.

Current model includes:

- Player stats
- Stage and fall speed
- Combo
- Enemies defeated
- Current node and room type
- Map node state
- Active enemy
- Event log
- Pending rewards
- Owned rewards
- Victory flag

Target expansion for the full state model:

- Selected hero
- Equipped weapon
- Known spells
- Owned relics and upgrades separated by type
- Status effects
- Full room-state payloads
- Run status
- More explicit save versioning

Design requirement:

- The run state must remain serializable for localStorage persistence

## 6. Board Update Loop

The board update loop currently works as follows:

1. The battle scene owns a `BoardSystem` instance.
2. A timer based on fall speed drives piece descent.
3. Keyboard or touch input mutates the current piece position.
4. Soft drop and hard drop advance the piece more quickly.
5. On collision, the piece locks into the grid.
6. Completed lines are detected and removed.
7. Remaining blocks fall straight down within their own columns.
8. The board is checked again for new completed lines.
9. Repeat until the board is stable.
10. Return a `CascadeResult` summarizing the total lines cleared, cascade count, cleared lines per cascade, blocks dropped, and whether a cascade combo occurred.

The board uses a deterministic grid-based Cascade Gravity System rather than a physics engine. Each occupied cell collapses straight down in its column, so the behavior is fair, predictable, and mobile-friendly.

Supporting board behaviors:

- Simple wall-kick-like rotation attempts
- Next piece preview
- Random cluster clearing for bomb-like effects
- Junk row insertion from enemy behavior
- Row clearing from spell effects

Current tradeoff:

- Stable and understandable placeholder implementation
- Not a tournament-accurate Tetris engine

## 7. Combat Flow

Combat flow currently works as follows:

1. A room spawns an enemy based on room type and stage.
2. The battle scene initializes board, combat, and spell systems.
3. Each piece lock resolves line clears.
4. Line clears produce damage and mana.
5. Combo state modifies damage output.
6. Enemy attack counters tick down after locks.
7. Enemy attacks deal damage and may apply disruption effects.
8. Spells can be cast if mana is sufficient and an enemy is active.
9. Enemy death routes to rewards or victory.
10. Player death or top-out routes to game over.

Current enemy disruption examples:

- Junk spawning
- Preview hiding
- Mana cost hex
- Fall speed increase
- Camera shake

## 8. Save/Load Flow

Current save flow:

1. New run creates a default run state.
2. `SaveSystem` serializes the run state to localStorage.
3. Save writes occur on important transitions such as room changes, reward changes, and battle state changes.
4. Main menu checks whether a save exists.
5. Continue loads the save and routes to the correct scene based on run state.
6. Terminal run states clear the save.

Current strengths:

- Good enough for run continuation
- Simple and easy to inspect

Current limitations:

- No save schema versioning yet
- No migration path yet
- No granular board replay state

## 9. Mobile Build Flow

Current mobile build flow:

1. Build the web app with Vite into `dist`
2. Use Capacitor to add or sync the Android shell
3. Open the Android project in Android Studio
4. Build the debug APK through Android Studio or Gradle

Configured assets:

- `capacitor.config.ts` exists
- `appId` is `com.blockmancer.dungeon`
- `appName` is `Blockmancer Dungeon`
- `webDir` is `dist`

Current practical constraint:

- Successful APK builds depend on the local Android SDK and toolchain being configured on the machine running the commands

## 10. Extension Points

Key extension points for future work:

- Add `ContentRegistry` so systems consume content IDs rather than hardcoded constants
- Split map overlays into dedicated `EventScene`, `ShopScene`, `RestScene`, and `TreasureScene`
- Add `HeroSelectScene` and hero-specific passive systems
- Add dedicated `RelicSystem`, `UpgradeSystem`, and `DifficultySystem`
- Add `AudioSystem` for placeholder beeps first, then full sound design later
- Expand the save model with versioning and migration
- Add utilities for validation, balance tuning, and content import
