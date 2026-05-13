# Phase Plan

This document defines the phased development plan for Blockmancer Dungeon. It tracks the intended order of work, the MVP placeholder boundaries, and the acceptance checks that keep the project playable while systems are added.

## Phase 0 - GDD And Technical Foundation
Goal:
- Establish the full game direction and the current placeholder MVP scope before expanding gameplay systems.

Scope:
- Maintain `docs/GDD.md`
- Maintain `docs/PHASE_PLAN.md`
- Maintain `docs/TECHNICAL_DESIGN.md`
- Maintain `docs/CONTENT_SYSTEM.md`
- Maintain `docs/ROADMAP.md`

Acceptance criteria:
- Core design vision is documented
- Technical structure is documented
- Content system expectations are documented
- Roadmap is documented

Known limitations:
- Documentation may lead implementation in some areas
- Placeholder assumptions remain until content and scene systems catch up

## Phase 1 - Project Bootstrap
Goal:
- Keep the Vite + TypeScript + Phaser base healthy and buildable.

Scope:
- Base scripts and config
- `src/main.ts`
- `src/styles.css`
- `src/game/BlockmancerGame.ts`
- `BootScene` and `MainMenuScene`

Acceptance criteria:
- `npm install` works
- `npm run dev` starts the game
- `npm run build` succeeds
- Main menu appears

Known limitations:
- Menu remains placeholder-first
- No final art or audio required

## Phase 2 - Core Types And Game State
Goal:
- Define durable run-state and content-facing TypeScript foundations.

Scope:
- `GameTypes`
- `ContentTypes`
- default run-state model
- local save helpers
- save/load lifecycle

Acceptance criteria:
- Types compile
- New run can be created
- Save/load/clear functions exist
- Continue run logic can detect saved data

Known limitations:
- Early state models may remain thinner than the target full-game structure

## Phase 3 - Content Metadata System
Goal:
- Define schema metadata for all data-driven content categories.

Scope:
- `src/game/content/*/metadata.json`
- metadata validation script
- package script for metadata validation

Acceptance criteria:
- Metadata files exist for all planned categories
- JSON is valid
- `npm run validate:metadata` passes

Known limitations:
- Metadata alone does not provide actual content entries

## Phase 4 - Placeholder Content Entries
Goal:
- Add actual placeholder content JSON entries and a registry for loading them.

Scope:
- Monster entries
- Hero entries
- Weapon entries
- Spell entries
- Relic entries
- Upgrade entries
- Status effect entries
- Room event entries
- Loot table entries
- Difficulty scaling entries
- `ContentRegistry`

Acceptance criteria:
- Placeholder content files exist
- ContentRegistry can resolve entries by ID
- Build passes

Known limitations:
- Balance and descriptive text can remain rough

## Phase 5 - Scene Flow
Goal:
- Make every major room or run state reachable through dedicated scene flow.

Scope:
- `HeroSelectScene`
- `MapScene`
- `BattleScene`
- `RewardScene`
- `EventScene`
- `ShopScene`
- `RestScene`
- `TreasureScene`
- `GameOverScene`

Acceptance criteria:
- New run reaches hero select
- Hero select reaches map
- Map opens the right destination scenes
- Reward returns to map
- Game over returns to menu

Known limitations:
- Placeholder layouts and buttons are expected

## Phase 6 - UI Foundation
Goal:
- Build reusable Phaser UI primitives for menus, battle, and room scenes.

Scope:
- Buttons
- HUD
- Event log
- Cards
- Progress bars
- Mobile controls

Acceptance criteria:
- Shared UI elements render cleanly
- Battle HUD and logs update correctly
- Mobile controls are visible and usable

Known limitations:
- UI remains placeholder style
- No final visual polish required

## Phase 7 - Map System
Goal:
- Build a playable roguelike node map with progression state.

Scope:
- Map generation or fixed layout
- Available and completed node state
- Room routing
- Save integration for map progress

Acceptance criteria:
- Map renders
- Available nodes are clickable
- Current and completed state is visible
- Node choice determines room resolution

Known limitations:
- Layout can stay fixed
- Procedural maps are out of scope for the placeholder MVP

## Phase 8 - Board System
Goal:
- Deliver a stable falling-block board as the core battle input system.

Scope:
- Grid
- Tetromino-like pieces
- Movement and rotation
- Soft and hard drop
- Locking
- Line clear detection
- Next preview
- Top-out loss

Acceptance criteria:
- Pieces fall and lock correctly
- Player can move and rotate pieces
- Lines clear correctly
- Top-out triggers defeat

Known limitations:
- Exact Tetris guideline behavior is not required

## Phase 9 - Combat System
Goal:
- Connect line clears and enemy behavior into a combat loop.

Scope:
- Player damage and mana gain
- Combo scaling
- Enemy HP, attack, intent, and attack timing
- Placeholder enemy board disruption
- Difficulty scaling hooks

Acceptance criteria:
- Line clears damage enemies
- Mana increases on clears
- Combo affects damage
- Enemy actions damage or disrupt the player
- Victory and defeat routes work

Known limitations:
- Intent presentation can stay text-first
- Board disruption can remain simple and predictable

## Phase 10 - Spell System
Goal:
- Implement mana-driven spell casting in battle.

Scope:
- Fireball
- Frost Lock
- Bomb Rune
- Void Cut
- Keyboard and mobile spell inputs

Acceptance criteria:
- Spell costs apply correctly
- Not-enough-mana feedback appears
- Enemy and board state update after casting
- UI stays in sync

Known limitations:
- Spell effects can remain simple
- Final animation and sound are optional

## Phase 11 - Reward, Relic, And Upgrade System
Goal:
- Resolve post-battle reward choices into persistent run bonuses.

Scope:
- Reward selection UI
- Reward rolling
- Upgrade effects
- Relic effects
- Stage progression after victory

Acceptance criteria:
- Rewards appear after battle wins
- Selected rewards apply to run state
- Upgrade or relic lists update
- Return to map works

Known limitations:
- Stacking and specialization can remain basic

## Phase 12 - Event, Shop, Rest, And Treasure Rooms
Goal:
- Make non-combat room types fully functional and scene-safe.

Scope:
- Event resolution
- Shop purchases
- Rest bonuses
- Treasure rewards
- Choice persistence

Acceptance criteria:
- Each room type resolves correctly
- State changes persist
- Return to map works after completion

Known limitations:
- Room content breadth can remain narrow in the MVP

## Phase 13 - Save, Load, Game Over, And Victory
Goal:
- Complete the run lifecycle from menu start to boss win or defeat.

Scope:
- Full save coverage
- Continue flow
- Game over flow
- Victory flow
- Save clearing on terminal states

Acceptance criteria:
- Saved runs can continue after refresh
- Death ends the run cleanly
- Boss victory ends the run cleanly
- Restart and menu exits work

Known limitations:
- Save granularity may be scene-based rather than frame-perfect

## Phase 14 - Android / APK Support
Goal:
- Prepare the web build for Android packaging through Capacitor.

Scope:
- `capacitor.config.ts`
- Android shell creation
- Android sync flow
- APK build documentation
- README setup instructions

Acceptance criteria:
- Web build works
- Capacitor config exists
- Android commands are documented
- Expected APK output path is documented

Known limitations:
- Local Android SDK setup remains machine-dependent
- Default Capacitor icon/splash is acceptable

## Phase 15 - Placeholder Polish Pass
Goal:
- Make the placeholder MVP coherent, readable, and reasonably balanced.

Scope:
- UI clarity
- Button states
- Event log readability
- Board color tuning
- Mobile layout tuning
- Camera shake and small polish effects
- Rough balance cleanup

Acceptance criteria:
- Run loop is understandable
- Desktop readability is goodcomplete 
- Mobile usability is acceptable
- Build still passes
- Known limitations are documented

Known limitations:
- Still not final art
- Still not final audio
- Still not full production content

## Current Tracking Notes
- The repo already contains meaningful work beyond early phases.
- Some later systems were implemented before all planned foundational docs and content-entry layers were finished.
- Use this phase plan as the reference for bringing implementation back into alignment with the intended structure.
