# Blockmancer Dungeon — Release 1.0 Agent Prompt Pack

Use this file together with `AGENT.md` and `blockmancer_vibe_code_release_1_plan.md`.

This document gives you **copy-paste prompts** for each milestone and phase. Each prompt includes:

```text
- Clear task instruction
- What the agent should inspect first
- What to look for
- Expected output
- Acceptance checks
- Commands to run
- Response format
```

---

## How to Use This Prompt Pack

Recommended workflow:

```text
1. Put AGENT.md in the project root.
2. Put blockmancer_vibe_code_release_1_plan.md in docs/ or project root.
3. Open your coding agent tool: Cursor, Windsurf, Codex, Claude Code, etc.
4. Start with Milestone A or Phase 0.
5. Paste only one phase prompt at a time.
6. Let the agent inspect files first.
7. Let it make the smallest safe change.
8. Run build/validation.
9. Commit.
10. Move to the next phase.
```

Do **not** ask the agent to implement all 30 phases in one pass. That will usually cause messy rewrites.

---

## Universal Rules for Every Prompt

Add this block to the top of every coding prompt:

```text
Read AGENT.md first and follow it as the main project instruction.
Also read blockmancer_vibe_code_release_1_plan.md if it exists.

Project goal:
Turn Blockmancer Dungeon into a cheerful portrait-mobile falling-block roguelike RPG for Release 1.0.

Core rules:
- Keep the game playable after changes.
- Keep cheerful festival / cute chaos tone.
- Do not add dark/edgy curse lore.
- Do not replace Cascade Gravity with classic row shifting.
- Do not rewrite unrelated working systems.
- Keep content data-driven.
- Preserve placeholder-safe asset fallbacks.
- Keep portrait mobile as the primary layout target.
- Run build/validation if possible.

After completing the task, respond with:
Summary:
- ...

Files changed:
- ...

How to test:
- ...

Commands run:
- ...

Known limitations:
- ...
```

---

# Milestone Prompts

---

## Milestone A — Foundation

Includes:

```text
Phase 0 — Release Audit
Phase 1 — Architecture Stabilization
Phase 2 — Content Data 1.0 Conversion
```

### Milestone Goal

Prepare the repo for safe Release 1.0 development. The agent should understand the current MVP, stabilize architecture, and convert/prepare content data for the cheerful festival direction.

### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone A — Foundation.

Scope:
- Phase 0: Release Audit
- Phase 1: Architecture Stabilization
- Phase 2: Content Data 1.0 Conversion

Important:
Do this milestone carefully and incrementally. Do not rewrite the whole game. If the repo is not ready for full implementation, create the audit and foundation docs first, then make only safe changes.

What to inspect first:
- package.json
- README.md
- docs/
- src/game/
- src/game/scenes/
- src/game/systems/
- src/game/content/
- src/game/types/
- public/assets/

What to look for:
- Current build status
- Missing scripts
- Existing scene flow
- Existing board/combat systems
- Whether ContentRegistry exists
- Whether content is JSON/data-driven
- Whether asset manifest exists
- Broken imports or duplicate systems
- Missing save/load support
- Any dark content that conflicts with cheerful festival tone

Expected output:
- docs/RELEASE_1_GAP_AUDIT.md
- Stabilized types/systems where safe
- Content folders prepared or updated
- Validation scripts verified or documented if missing
- No major gameplay rewrite

Acceptance criteria:
- Game still builds, or failures are documented clearly
- Existing MVP remains playable if it was playable before
- Missing Release 1.0 features are listed
- Content direction is aligned with cheerful festival concept
- Safe fallback exists or is planned for missing content/assets

Commands to run:
- npm install, if needed
- npm run build
- npm run validate:content, if available
- npm run validate:metadata, if available

Finish by summarizing files changed, commands run, build status, and next recommended phase.
```

---

## Milestone B — Core Gameplay

Includes:

```text
Phase 3 — Cascade Gravity 1.0
Phase 4 — Special Board Blocks
Phase 5 — Portrait Mobile Layout 1.0
Phase 6 — Input System 1.0
Phase 7 — Combat System 1.0
Phase 8 — Spell System 1.0
Phase 9 — Inventory and Item System 1.0
```

### Milestone Goal

Make the game’s core combat-puzzle loop feel complete and mobile-playable.

### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone B — Core Gameplay.

Scope:
- Cascade Gravity
- Special board blocks
- Portrait mobile layout
- Desktop/mobile input
- Combat loop
- Spell system
- Inventory and items

Important:
Break this milestone into small commits if possible. Start with Cascade Gravity and board behavior before UI polish. Keep the game playable after every step.

What to inspect first:
- BoardSystem
- CombatSystem
- EnemySystem
- SpellSystem
- InventorySystem / ItemSystem if present
- BattleScene
- Input handling
- UI components
- Content data for board-blocks, spells, items, enemies

What to look for:
- Classic row-shift line clear that must be replaced
- Missing CascadeResult type
- Whether CombatSystem can consume line clear/cascade results
- Whether board cells support block types
- Whether mobile controls exist
- Whether next/hold/inventory overlays exist
- Whether spells/items are hardcoded or data-driven

Expected output:
- Cascade Gravity implemented
- Special block hooks implemented
- Portrait battle layout improved
- Mobile controls functional
- Combat loop connected to board results
- Spells and items functional enough for Release 1.0

Acceptance criteria:
- Clearing lines triggers Cascade Gravity
- Cascades can create new line clears
- Combat uses cascade damage/mana rewards
- Board supports special block types safely
- Mobile touch controls work
- Spell buttons work
- Inventory can be opened and items can be used
- Build passes

Commands to run:
- npm run build
- npm run validate:content, if content changed

Finish with manual test steps for a battle from start to reward screen.
```

---

## Milestone C — Run Structure

Includes:

```text
Phase 10 — Hero, Weapon, and Unlock System
Phase 11 — Roguelike Map and Stage System
Phase 12 — Boss System 1.0
Phase 13 — Reward, Relic, and Upgrade System 1.0
Phase 14 — Events, Shops, Rest, and Treasure 1.0
Phase 15 — Oopsies / Silly Drawbacks System
Phase 16 — Fever / Combo / Cascade Meta System
```

### Milestone Goal

Turn the battle MVP into a full roguelike run with stages, bosses, unlocks, rewards, events, shops, oopsies, and mastery systems.

### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone C — Run Structure.

Scope:
- Hero select and unlocks
- Weapons and starting loadouts
- 6-stage roguelike map progression
- Boss encounters
- Rewards, relics, upgrades
- Events, shops, rest, treasure
- Oopsies / silly drawbacks
- Fever/combo/cascade mastery layer

What to inspect first:
- HeroSelectScene
- MapScene
- RewardScene
- EventScene
- ShopScene
- RestScene
- TreasureScene
- VictoryScene
- SaveSystem
- HeroSystem
- StageSystem
- MapSystem
- RewardSystem
- RelicSystem
- UpgradeSystem
- Loot tables

What to look for:
- Missing scene transitions
- Missing stage progression
- Missing boss node logic
- Missing unlock persistence
- Hardcoded rewards
- Missing relic/upgrade trigger hooks
- Missing shop/event choice resolution
- Missing oopsie effects
- Missing fever/combo UI

Expected output:
- Player can start run with selected hero
- Player can move across a map
- Player can fight through stages
- Bosses appear at stage ends
- Rewards apply after battle
- Non-combat rooms work
- Oopsies and fever systems exist
- Progress can be saved where relevant

Acceptance criteria:
- A run can progress from Stage 1 to at least Stage 2
- Boss defeat advances stage
- Rewards are generated from loot tables
- Hero unlock conditions can be tracked
- Oopsies can be gained/removed
- Fever meter interacts with cascades
- Build passes

Commands to run:
- npm run build
- npm run validate:content

Finish with a full run-path test checklist.
```

---

## Milestone D — Release Features

Includes:

```text
Phase 17 — Tutorial and Onboarding
Phase 18 — Save, Meta Progress, and Profiles
Phase 19 — Art Asset Pipeline Integration
Phase 20 — UI Polish and Readability
Phase 21 — Audio and Feedback
Phase 22 — Settings, Accessibility, and UX Options
Phase 23 — Story, Dialogue, and Endings
```

### Milestone Goal

Make the game understandable, persistent, polished, accessible, and player-facing.

### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone D — Release Features.

Scope:
- Tutorial and onboarding
- Save and meta progress
- Asset pipeline
- UI polish
- Audio feedback
- Settings/accessibility
- Story/dialogue/endings

What to inspect first:
- MainMenuScene
- TutorialScene
- SettingsScene
- SaveSystem
- AssetSystem or asset manifest
- BootScene
- AudioSystem
- UI components
- Dialogue/story data
- Victory/GameOver flow

What to look for:
- First-run player confusion points
- Missing save versioning
- Corrupt save crash risks
- Hardcoded asset paths
- Missing fallback textures/audio
- UI readability problems on phone
- Missing settings persistence
- Missing story/endings

Expected output:
- First-run tutorial flow
- Continue run / meta progress support
- Asset manifest and safe fallbacks
- Improved UI readability
- Audio hooks with mute/volume settings
- Accessibility options
- Cheerful story flow and endings

Acceptance criteria:
- Tutorial can be completed or skipped
- Refresh/continue works
- Missing assets/audio do not crash
- Settings persist
- Screen shake/reduced flashing options work
- Normal ending exists
- Build passes

Commands to run:
- npm run build
- npm run validate:content, if content changed

Finish with new-player test steps and save/load test steps.
```

---

## Milestone E — Release Polish

Includes:

```text
Phase 24 — Balance Pass 1
Phase 25 — QA Test Suite and Debug Tools
Phase 26 — Performance Optimization
Phase 27 — Android / Capacitor Release Build
Phase 28 — Store / Release Metadata
Phase 29 — Final Polish and Bug Fixing
Phase 30 — Release Candidate
```

### Milestone Goal

Prepare the game for Release Candidate 1.0.

### Copy-Paste Prompt

```text
Read AGENT.md first and follow it as the main project instruction.

Implement Milestone E — Release Polish.

Scope:
- Balance pass
- QA/debug tools
- Mobile performance
- Android/Capacitor release build
- Store/release metadata
- Final polish/bug fixing
- Release candidate checklist

What to inspect first:
- Balance/content data
- Difficulty scaling
- Debug/dev tools
- Performance-heavy board/VFX/UI code
- package.json scripts
- capacitor.config.ts
- Android project if present
- docs/QA_TEST_PLAN.md
- docs/BUILD_APK.md
- docs/RELEASE_1_0_NOTES.md

What to look for:
- Unfair difficulty spikes
- Memory leaks or excessive allocations
- Missing debug tools for QA
- Missing Android scripts/config
- Broken asset paths in production build
- Missing release docs
- Missing credits/licenses/privacy notes
- Known blocker bugs

Expected output:
- Tuned balance data
- QA checklist/debug tools
- Performance improvements
- Android build support documented
- Store metadata docs
- Release notes
- Known issues list

Acceptance criteria:
- Web build passes
- Android debug build path is documented or builds successfully
- QA checklist exists
- No known blocker bugs remain undocumented
- Release notes exist
- Version can be bumped to 1.0.0 when ready

Commands to run:
- npm run build
- npm run validate:content
- npm run android:sync, if configured
- npm run android:build:debug, if configured

Finish with Release Candidate readiness status.
```

---

# Individual Phase Prompts

---

## Phase 0 — Release Audit

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Audit the current Blockmancer Dungeon repo for Release 1.0 readiness. Do not rewrite systems yet unless a tiny build fix is required.

Inspect first:
- package.json
- README.md
- docs/
- src/game/
- src/game/scenes/
- src/game/systems/
- src/game/content/
- public/assets/

What to look for:
- Current build status
- Existing MVP features
- Missing Release 1.0 features
- Broken or placeholder systems
- Missing content/data folders
- Missing validation scripts
- Missing asset pipeline
- Mobile portrait layout issues
- Save/load status

Expected output:
- Create or update docs/RELEASE_1_GAP_AUDIT.md
- Include implemented features, missing features, broken/risky areas, recommended next phases, and commands run

Acceptance criteria:
- Current build status is known
- Existing MVP features are listed
- Missing Release 1.0 features are listed
- Release checklist exists
- No gameplay changes unless required to fix build

Commands:
- npm install, if needed
- npm run build
- npm run validate:content, if available
- npm run validate:metadata, if available

Response format:
Summary / Files changed / Commands run / How to test / Known limitations / Recommended next phase
```

---

## Phase 1 — Architecture Stabilization

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Stabilize the project architecture for Release 1.0 without changing core gameplay behavior unless needed for build stability.

Inspect first:
- src/game/types/
- src/game/systems/
- src/game/scenes/
- src/game/data/
- src/game/content/
- BootScene.ts
- BattleScene.ts

What to look for:
- Giant scene files with mixed logic
- Missing types for game state/content
- Missing ContentRegistry
- Missing AssetSystem or asset manifest
- Duplicate logic across scenes
- Hardcoded content access
- Missing fallbacks for missing assets/content
- Circular imports

Expected output:
- Typed game state and content access patterns
- Centralized constants where needed
- ContentRegistry access pattern established
- Asset manifest/fallback pattern established
- Safe error handling for missing content/assets

Acceptance criteria:
- npm run build passes
- No circular imports
- Main game state is typed
- Content can be loaded by ID
- Missing content has safe fallback
- Missing texture has safe fallback

Commands:
- npm run build

Response format:
Summary / Files changed / Architecture decisions / Commands run / How to test / Known limitations
```

---

## Phase 2 — Content Data 1.0 Conversion

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Convert or create Release 1.0 content data for the cheerful festival concept.

Inspect first:
- src/game/content/
- src/game/systems/ContentRegistry.ts
- scripts/validate-content-data.mjs
- docs/content docs if present

What to look for:
- Old dark/edgy content to rename or remove
- Missing data folders
- Missing metadata files
- Invalid ID prefixes
- Hardcoded content in code
- Content not loaded by ContentRegistry

Expected output:
Create/update content for:
- 6 stages
- 6 bosses
- 36 monsters
- 6 heroes
- 10 weapons
- 15 spells
- 15 relics
- 15 upgrades
- 15 board blocks
- 10 items
- 8 oopsies
- 8 room events
- NPCs
- currencies
- collectibles
- loot tables
- difficulty scaling

Acceptance criteria:
- All Release 1.0 content entries exist
- All content uses cheerful tone
- Old dark references are removed or renamed
- JSON is valid
- IDs match naming convention
- ContentRegistry loads all content
- validate:content passes

Commands:
- npm run validate:content
- npm run validate:metadata, if available
- npm run build

Response format:
Summary / Content added / Files changed / Commands run / How to test / Known limitations
```

---

## Phase 3 — Cascade Gravity 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement Cascade Gravity as the core BoardSystem mechanic.

Inspect first:
- BoardSystem
- CombatSystem
- GameTypes / board types
- BattleScene line-clear integration
- EventLog/HUD if present

What to look for:
- Classic row-shift clearing
- Missing line clear result type
- Missing combat integration
- Missing event log messages
- Board mutation bugs
- Places where line count is used directly

Expected output:
- detectCompletedLines()
- removeCompletedLines()
- applyCascadeGravity()
- resolveCascadeClears()
- CascadeResult type
- Combat reward integration
- Event log messages

Acceptance criteria:
- Clearing a line removes only cleared cells first
- Blocks above fall down by column
- New lines can form after falling
- Cascades resolve automatically
- Combat receives CascadeResult
- Event log shows cascade messages
- Build passes

Commands:
- npm run build

Manual test:
Create or simulate a board where a line clear causes blocks above to fall into a new completed line.

Response format:
Summary / Files changed / Cascade behavior / Commands run / How to test / Known limitations
```

---

## Phase 4 — Special Board Blocks

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Add special board block support using content data and integrate effects with Cascade Gravity.

Inspect first:
- BoardSystem
- board block content data
- CombatSystem
- ItemSystem/InventorySystem if present
- type definitions for board cells

What to look for:
- Board cells storing only color instead of block type
- No hooks for on-clear effects
- No safe fallback for unknown block type
- Bomb effects that could recurse infinitely

Expected output:
Implement support for:
- block_sprinkle
- block_cupcake
- block_bomb
- block_star
- block_jelly
- block_ice
- block_sticky
- block_crumb_junk
- block_royal
- block_confetti
- block_toolbox

Acceptance criteria:
- Board supports block type data
- Special block effects trigger on clear
- Bomb can trigger additional cascade resolve safely
- Junk blocks can appear from enemy attacks
- Boss blocks can appear
- Unknown block types use safe fallback

Commands:
- npm run build
- npm run validate:content, if content changed

Response format:
Summary / Files changed / Block effects implemented / Commands run / How to test / Known limitations
```

---

## Phase 5 — Portrait Mobile Layout 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Refactor BattleScene into the final portrait-only mobile layout.

Inspect first:
- BattleScene
- UI components
- MobileControls
- Phaser scale config
- CSS/style files
- current board rendering dimensions

What to look for:
- Landscape assumptions
- Fixed desktop-only dimensions
- Board too small on phone
- Controls too small for touch
- Next/hold/inventory hidden or missing
- UI overlap with safe areas/notches

Expected layout:
- Top 1/5: compact battle panel
- Middle 3/5: falling-block board + next/hold/inventory overlays
- Bottom 1/5: mobile controls + spell buttons

Acceptance criteria:
- Game is portrait-only
- Top combat uses about 1/5 height
- Board uses about 3/5 height
- Controls use about 1/5 height
- Next block is visible
- Hold block is visible
- Inventory is visible/expandable
- Touch controls are playable
- Desktop browser preview still works

Commands:
- npm run build

Response format:
Summary / Files changed / Layout decisions / Commands run / How to test / Known limitations
```

---

## Phase 6 — Input System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement polished desktop and mobile input handling.

Inspect first:
- InputSystem
- BattleScene input code
- MobileControls
- BoardSystem movement methods
- Settings controls if present

What to look for:
- Input duplicated in scenes
- No touch repeat for left/right
- Soft drop not holdable
- Hard drop repeat bugs
- Hold not limited once per piece
- Spell buttons disconnected
- Inventory button missing

Expected output:
- Desktop controls: arrows/WASD, Space, Shift/C, 1-4, I, Esc
- Mobile controls: left/right/rotate/soft drop/hard drop/hold/spells/inventory
- Input repeat/cooldowns handled safely

Acceptance criteria:
- Mobile buttons feel responsive
- Holding left/right repeats movement
- Soft drop can be held
- Hard drop is single tap
- Rotate is single tap
- Hold works once per piece
- Spell buttons work
- Inventory button works

Commands:
- npm run build

Response format:
Summary / Files changed / Controls implemented / Commands run / How to test / Known limitations
```

---

## Phase 7 — Combat System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Upgrade CombatSystem and EnemySystem into a complete Release 1.0 battle loop.

Inspect first:
- CombatSystem
- EnemySystem
- BoardSystem cascade result integration
- SpellSystem
- RelicSystem / UpgradeSystem
- BattleScene victory/defeat flow
- enemy content data

What to look for:
- Line clears not dealing damage
- Cascades not affecting combat
- Enemy attacks not telegraphed
- Missing status effect hooks
- Missing player HP/shield handling
- Missing victory/defeat transition
- Missing safe placeholders for enemy behaviors

Expected output:
- Line clear damage
- Cascade bonus damage/mana
- Combo tracking
- Fever gain hook
- Enemy intent/attack counter
- Player HP/shield
- Enemy HP/armor
- Status effect hooks
- Victory/defeat flow

Acceptance criteria:
- Every enemy behavior has implementation or safe placeholder
- Boss behaviors can be unique later
- Cascades matter in combat
- Combat logs are readable
- Player can win/lose battle
- Battle reward flow works

Commands:
- npm run build
- npm run validate:content, if enemy data changed

Response format:
Summary / Files changed / Combat behavior / Commands run / How to test / Known limitations
```

---

## Phase 8 — Spell System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement all 15 Release 1.0 spells as data-driven spell effects.

Inspect first:
- SpellSystem
- spell content data
- CombatSystem
- BoardSystem
- BattleScene spell buttons
- mana UI/HUD

What to look for:
- Hardcoded spells
- Missing mana cost checks
- Missing disabled state
- Missing spell effect routing
- Board-targeting spells not safe
- No feedback when not enough mana

Expected output:
Functional spells:
- spl_fireball
- spl_frost_lock
- spl_bomb_rune
- spl_clean_cut
- spl_sprinkle_shower
- spl_cupcake_blast
- spl_confetti_pop
- spl_bubble_shield
- spl_star_spark
- spl_jelly_bounce
- spl_snowcone_burst
- spl_goblin_gadget
- spl_rainbow_reroll
- spl_snack_break
- spl_cascade_cheer

Acceptance criteria:
- All spells can be cast if available
- Mana costs apply
- Effects work
- UI updates
- Spell upgrades can modify effects where supported
- Build passes

Commands:
- npm run build
- npm run validate:content, if spell data changed

Response format:
Summary / Files changed / Spells implemented / Commands run / How to test / Known limitations
```

---

## Phase 9 — Inventory and Item System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement InventorySystem and ItemSystem for battle and event usage.

Inspect first:
- InventorySystem / ItemSystem
- BattleScene inventory UI
- item content data
- RewardSystem
- ShopSystem if present
- SaveSystem

What to look for:
- No inventory capacity
- Items not stackable
- Item use hardcoded or missing
- No compact/expanded overlay
- Item counts not saved
- Items not integrated with rewards/shop

Expected output:
- Inventory slots/capacity
- Stackable consumables
- Item use effects
- Compact/expanded inventory overlay
- Item reward/pickup support
- Shop purchase hooks
- Save/load item state

Acceptance criteria:
- Inventory visible in middle board area
- Inventory can expand/collapse
- Items can be used
- Item counts update
- Items can be rewarded/bought
- Inventory capacity upgrades work

Commands:
- npm run build
- npm run validate:content, if item data changed

Response format:
Summary / Files changed / Item behavior / Commands run / How to test / Known limitations
```

---

## Phase 10 — Hero, Weapon, and Unlock System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement playable heroes, weapons, starting loadouts, passives, and unlock conditions.

Inspect first:
- HeroSelectScene
- HeroSystem
- WeaponSystem
- SaveSystem
- hero/weapon content data
- MainMenuScene new run flow

What to look for:
- No locked/unlocked state
- Missing meta progress
- Hero stats not applied
- Starting spells/weapons hardcoded
- Hero passives not hooked
- Unlock conditions not tracked

Expected output:
- Hero select scene with locked/unlocked UI
- 6 playable heroes
- Hero stats and passives
- Starting weapons/spells
- Unlock condition tracking
- Persistent meta progress

Acceptance criteria:
- Hero select shows all heroes
- Locked heroes show unlock condition
- Unlocked heroes persist
- Hero stats affect run
- Hero starting loadout works
- Hero passive works

Commands:
- npm run build
- npm run validate:content, if content changed

Response format:
Summary / Files changed / Hero unlock behavior / Commands run / How to test / Known limitations
```

---

## Phase 11 — Roguelike Map and Stage System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement the 6-stage roguelike map and stage progression system.

Inspect first:
- MapScene
- MapSystem
- StageSystem
- stage content data
- monster pools
- boss content data
- SaveSystem
- Loot tables

What to look for:
- Map nodes hardcoded or missing
- No stage progression
- No stage-specific monster pool
- Boss not linked to stage
- Map state not saved
- Missing node completion/current state

Expected output:
- Fight/Event/Shop/Rest/Treasure/Elite/Boss nodes
- Stage-specific monster pools
- Boss node per stage
- Stage advancement after boss
- Persistent map state

Acceptance criteria:
- Player progresses through 6 stages
- Each stage has unique monster pool
- Boss appears at end of each stage
- Defeating boss advances stage
- Final boss victory ends run
- Map state saves/loads

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Map progression behavior / Commands run / How to test / Known limitations
```

---

## Phase 12 — Boss System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement boss behavior support, boss phases, boss intros, rewards, and final victory trigger.

Inspect first:
- EnemySystem
- BossSystem if present
- CombatSystem
- StageSystem
- boss content data
- BattleScene boss UI
- VictoryScene

What to look for:
- Bosses treated exactly like normal monsters
- No phase threshold support
- No boss intro
- No unique boss mechanics
- No final boss victory route
- Boss rewards same as normal battle

Expected output:
Bosses:
- Cupcake Slime King
- Prototype No. 7
- Gelato Golem
- Sir Snore-a-Lot
- High Score Hydra
- King Bloxley

Acceptance criteria:
- All bosses spawn correctly
- Each boss has at least one unique mechanic
- Boss phase 2 exists or placeholder exists
- Boss reward is better than normal
- King Bloxley victory triggers final ending

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Boss mechanics / Commands run / How to test / Known limitations
```

---

## Phase 13 — Reward, Relic, and Upgrade System 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Upgrade rewards, relics, upgrades, rarity weighting, rerolls, and loot table logic.

Inspect first:
- RewardSystem
- RelicSystem
- UpgradeSystem
- RewardScene
- loot table content
- relic/upgrade content
- SaveSystem

What to look for:
- Rewards hardcoded
- No rarity weighting
- No stage-specific loot
- Relics not applying effects
- Upgrades not stacking correctly
- No reroll logic
- Boss rewards not special

Expected output:
- 3 reward choices
- Rarity weighting
- Stage-specific loot
- Reroll support
- Relic effects
- Upgrade stacking rules
- Spell upgrade hooks
- Item/gold/heal rewards

Acceptance criteria:
- Reward screen appears after battle
- Rewards are valid from loot table
- Relics apply effects
- Upgrades apply effects
- Reroll works if player has reroll
- Duplicate/stack rules work
- Boss rewards feel better

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Reward logic / Commands run / How to test / Known limitations
```

---

## Phase 14 — Events, Shops, Rest, and Treasure 1.0

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement all non-combat room systems and return-to-map flow.

Inspect first:
- EventScene
- ShopScene
- RestScene
- TreasureScene
- EventSystem
- ShopSystem
- room event content
- item/relic/upgrade content
- MapScene transitions

What to look for:
- Missing non-combat scenes
- Events with no real choices
- Shop not checking gold
- No rest healing
- Treasure rewards hardcoded
- No stage-themed event pools
- Missing return-to-map flow

Expected output:
- 8 cheerful room events
- Shop purchases
- Rest healing/benefits
- Treasure rewards
- Choice resolution
- Return to map

Acceptance criteria:
- All room types work
- Choices affect state
- Shop prices check gold
- Rest heals
- Treasure rewards
- Events are cheerful/funny

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Room behavior / Commands run / How to test / Known limitations
```

---

## Phase 15 — Oopsies / Silly Drawbacks System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement OopsieSystem as the cheerful replacement for curses.

Inspect first:
- oopsie content data
- OopsieSystem if present
- CombatSystem
- BoardSystem
- ShopSystem
- EventSystem
- SaveSystem
- run HUD

What to look for:
- Player-facing use of “curse”
- No oopsie UI
- Oopsie effects not applied
- Oopsies not removable
- Oopsie save/load missing
- Soft-lock risk

Expected output:
- Oopsie data support
- Effects applied to gameplay
- UI display
- Shop/event removal
- Save/load support

Acceptance criteria:
- Oopsies can be gained
- Oopsies affect gameplay
- Oopsies show in run UI
- Oopsies can be removed
- No oopsie soft-locks the player

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Oopsie effects / Commands run / How to test / Known limitations
```

---

## Phase 16 — Fever / Combo / Cascade Meta System

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement FeverSystem tied to combos and Cascade Gravity.

Inspect first:
- CombatSystem
- BoardSystem CascadeResult integration
- FeverSystem if present
- BattleScene/HUD
- High Score Hydra boss behavior
- stage 5 content

What to look for:
- Combo not tracked
- Fever meter missing
- Cascades not rewarding mastery
- UI not showing cascade level
- Stage 5 mechanics missing
- Fever state not saved if needed

Expected output:
- Fever meter
- Fever gain from cascades/combo
- Fever activation or auto-trigger
- Bonus effects
- Cascade/combo UI
- High Score Hydra interactions

Acceptance criteria:
- Fever meter fills
- Fever can activate or auto-trigger
- Fever improves rewards/damage temporarily
- UI clearly shows fever state
- High Score Hydra uses fever/combo mechanic

Commands:
- npm run build

Response format:
Summary / Files changed / Fever mechanics / Commands run / How to test / Known limitations
```

---

## Phase 17 — Tutorial and Onboarding

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement first-run tutorial and help/onboarding flow.

Inspect first:
- TutorialScene
- MainMenuScene
- BattleScene
- InputSystem
- SaveSystem
- Settings/help UI

What to look for:
- No first-run detection
- Tutorial blocks returning players
- No skip option
- No control highlights
- No Cascade Gravity explanation
- No help screen

Expected output:
Tutorial lessons:
1. Move piece
2. Rotate piece
3. Soft/hard drop
4. Clear line
5. Cascade Gravity
6. Mana and spells
7. Hold block
8. Inventory item
9. Enemy intent
10. Rewards
11. Map progression

Acceptance criteria:
- New player can learn core loop
- Tutorial can be skipped
- Tutorial state saves
- Help screen exists
- Tutorial does not block returning players

Commands:
- npm run build

Response format:
Summary / Files changed / Tutorial flow / Commands run / How to test / Known limitations
```

---

## Phase 18 — Save, Meta Progress, and Profiles

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Upgrade SaveSystem for current run, meta progress, settings, migration, and corrupt-save fallback.

Inspect first:
- SaveSystem
- defaultRunState
- GameTypes
- Hero unlock logic
- SettingsSystem
- MainMenuScene continue/new run flow

What to look for:
- Save schema missing version
- Current run not saved
- Meta progress missing
- Hero unlocks not persistent
- Corrupt save crash risk
- No clear save/new run flow
- No migration pattern

Expected output:
Current run save:
- Player state
- Hero/weapon/spells
- Relics/upgrades/items/oopsies
- Stage/map/current room
- Run stats

Meta save:
- Unlocked heroes
- Total gold/cascades
- Bosses defeated
- Endings unlocked
- Tutorial completed
- Settings

Acceptance criteria:
- Refresh does not lose run
- Continue works
- Hero unlocks persist
- Corrupt save does not crash
- Save versioning exists

Commands:
- npm run build

Response format:
Summary / Files changed / Save schema / Migration notes / Commands run / How to test / Known limitations
```

---

## Phase 19 — Art Asset Pipeline Integration

```text
Read AGENT.md first and follow it as the main project instruction.
Also read blockmancer_sprite_asset_spec.md if available.

Task:
Integrate the Release 1.0 art asset pipeline with manifest-based loading and safe fallbacks.

Inspect first:
- public/assets/
- src/game/data/assets.ts
- AssetSystem
- BootScene
- UI components
- Content JSON spriteKey/iconKey fields

What to look for:
- Hardcoded asset paths inside scenes
- Missing fallback textures
- Missing asset manifest
- Content data not using asset keys
- Missing preload in BootScene
- Crashes on missing images

Expected output:
- Asset manifest
- Texture preload
- Missing texture fallback
- UI sprite support
- Board block sprite support
- Hero/monster/boss sprite support
- Spell/item/relic/upgrade icon support
- Stage background support

Acceptance criteria:
- Game works without missing asset crash
- Asset keys map to file paths
- Content iconKey/spriteKey loads sprites
- Placeholder fallback remains
- Build passes

Commands:
- npm run build
- npm run validate:content, if content changed

Response format:
Summary / Files changed / Asset manifest changes / Commands run / How to test / Known limitations
```

---

## Phase 20 — UI Polish and Readability

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Polish portrait mobile UI readability and presentation.

Inspect first:
- BattleScene
- UI components
- RewardScene
- MapScene
- ShopScene
- InventoryPanel
- MobileControls
- HUD/EventLog

What to look for:
- Tiny text on phone
- Cluttered board area
- Unclear HP/mana/fever bars
- Weak damage feedback
- Poor reward card readability
- Spell/item buttons missing disabled state
- Next/hold/inventory not visible enough

Expected output:
- Better HUD
- Clear HP/mana/fever bars
- Better damage numbers
- Better event log
- Better reward cards
- Better spell buttons
- Better item/inventory UI
- Better stage transitions and boss intro

Acceptance criteria:
- UI readable on phone
- Important information visible
- No clutter in portrait layout
- Touch targets are large enough
- Reward choices are understandable
- Inventory/next/hold are visible

Commands:
- npm run build

Response format:
Summary / Files changed / UI changes / Commands run / How to test / Known limitations
```

---

## Phase 21 — Audio and Feedback

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement AudioSystem and key gameplay feedback hooks.

Inspect first:
- AudioSystem if present
- BootScene asset loading
- BattleScene
- RewardScene
- ShopScene
- SettingsSystem
- public/assets/audio if present

What to look for:
- No mute/volume settings
- SFX calls scattered or missing
- Missing audio fallback
- Missing hooks for line clear/cascade/spells
- Audio crashing if file missing

Expected output:
Audio hooks for:
- Line clear
- Cascade
- Spell cast
- Enemy hit
- Player hit
- Reward pick
- Button tap
- Boss intro
- Victory
- Defeat
- Shop purchase
- Item use

Acceptance criteria:
- Audio can be muted
- Volume settings persist
- SFX trigger at right moments
- Missing audio does not crash

Commands:
- npm run build

Response format:
Summary / Files changed / Audio hooks / Commands run / How to test / Known limitations
```

---

## Phase 22 — Settings, Accessibility, and UX Options

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Add SettingsScene and accessibility/UX options.

Inspect first:
- SettingsScene
- SettingsSystem if present
- SaveSystem
- BattleScene
- InputSystem
- AudioSystem
- UI rendering for blocks/VFX

What to look for:
- Settings not persisted
- No mute/volume controls
- No reduced flashing
- No screen shake toggle
- No left-handed controls
- No block symbol accessibility
- No button size option

Expected output settings:
- Master volume
- SFX volume
- Music volume
- Vibration on/off
- Screen shake on/off
- Reduced flashing on/off
- Colorblind-friendly block symbols
- Text speed
- Left-handed controls
- Button size
- Show grid on/off
- Tutorial reset

Acceptance criteria:
- Settings screen exists
- Settings persist
- Reduced flashing works
- Screen shake can be disabled
- Left-handed layout works
- Block symbols improve readability

Commands:
- npm run build

Response format:
Summary / Files changed / Settings added / Commands run / How to test / Known limitations
```

---

## Phase 23 — Story, Dialogue, and Endings

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Implement cheerful story flow, dialogue, stage/boss intros, and endings.

Inspect first:
- Story/dialogue data if present
- MainMenuScene
- StageSystem
- BossSystem/EnemySystem
- VictoryScene
- TutorialScene
- NPC content data

What to look for:
- Missing opening story
- Bosses without intros
- Stage transitions with no flavor
- Dark/edgy text that conflicts with tone
- No ending conditions
- Dialogue cannot be skipped

Expected output:
Story beats:
- Opening: Block-O-Matic 3000 breaks festival
- Stage intros
- Boss intros
- Hero unlock dialogue
- King Bloxley intro
- Normal ending
- True ending condition and screen

Acceptance criteria:
- Story is cheerful
- Each stage has intro
- Each boss has intro
- Normal ending works
- True ending condition exists
- Dialogue can be skipped

Commands:
- npm run build
- npm run validate:content, if story content data changed

Response format:
Summary / Files changed / Story flow / Commands run / How to test / Known limitations
```

---

## Phase 24 — Balance Pass 1

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Perform a data-driven balance pass so a full run is playable from start to finish.

Inspect first:
- difficulty scaling content
- monsters/bosses data
- spells/items/relics/upgrades data
- CombatSystem formulas
- BoardSystem fall speed
- RewardSystem loot frequency

What to look for:
- Early difficulty spikes
- Boss HP/attack too high or too low
- Mana gain too low/high
- Spell cost imbalance
- Relics/upgrades that dominate
- Stage length too long
- Unlock conditions too grindy

Expected output:
- Tuned fall speed curve
- Tuned enemy HP/attack
- Tuned mana gain/spell costs
- Tuned item/relic/upgrade values
- Tuned boss difficulty
- Tuned stage length/reward frequency
- Notes in docs/BALANCE_AND_PROGRESSION.md if present

Acceptance criteria:
- Average player can clear Stage 1
- Skilled player can reach Stage 6
- Bosses are challenging but fair
- Cascade feels rewarding
- No one strategy dominates too much
- No required content is impossible to unlock

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Balance changes / Commands run / How to test / Known limitations
```

---

## Phase 25 — QA Test Suite and Debug Tools

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Add dev-only QA/debug tools and update QA documentation.

Inspect first:
- existing debug/dev flags
- scenes/systems for test hooks
- package.json scripts
- docs/QA_TEST_PLAN.md
- BoardSystem testability
- SaveSystem reset tools

What to look for:
- No way to jump to stages
- No way to force boss/reward/cascade
- No content validation script
- No smoke test checklist
- Debug UI visible in production

Expected output debug tools:
- Give gold
- Give item
- Give relic/upgrade
- Spawn monster
- Jump to stage
- Trigger boss
- Force reward
- Force cascade test
- Clear save

Acceptance criteria:
- Debug mode only available in dev
- QA docs exist
- Basic smoke tests pass or are documented
- Content validation passes

Commands:
- npm run build
- npm run validate:content

Response format:
Summary / Files changed / Debug tools / Commands run / How to test / Known limitations
```

---

## Phase 26 — Performance Optimization

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Optimize Blockmancer Dungeon for mobile performance without changing gameplay behavior.

Inspect first:
- BoardSystem loops
- Cascade Gravity implementation
- BattleScene update loop
- VFX/particles
- UI object creation
- scene shutdown/cleanup
- asset loading

What to look for:
- Allocations inside hot update loops
- Recreating UI every frame
- Unpooled VFX objects
- Texture reloads during gameplay
- Scene memory leaks
- Expensive cascade loops

Expected output:
- Board/Cascade optimizations
- VFX pooling where practical
- UI object reuse
- Scene cleanup fixes
- Reduced particle counts if needed
- Performance notes

Acceptance criteria:
- Board updates are smooth
- Cascades do not freeze
- Scene transitions are stable
- No major memory leak after multiple runs
- Build passes

Commands:
- npm run build

Response format:
Summary / Files changed / Optimization notes / Commands run / How to test / Known limitations
```

---

## Phase 27 — Android / Capacitor Release Build

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Prepare Android build support for Release 1.0 using Capacitor.

Inspect first:
- package.json
- capacitor.config.ts
- vite.config.ts
- android/ if present
- public/assets/
- docs/BUILD_APK.md
- app icon/splash assets

What to look for:
- Missing Capacitor config
- Wrong webDir
- Asset path issues after build
- Portrait orientation not locked
- Missing Android scripts
- Missing app icon/splash placeholders
- Unnecessary permissions

Expected output:
- Capacitor config verified
- Android sync/build scripts added or documented
- Portrait orientation configured where possible
- App icon/splash placeholders documented
- Debug APK build instructions
- Device testing checklist

Acceptance criteria:
- Debug APK builds or blockers are documented
- App opens on Android if build is available
- Portrait orientation works
- Touch controls work
- Save/load works on device
- No broken asset paths

Commands:
- npm run build
- npm run android:sync, if configured
- npm run android:build:debug, if configured

Response format:
Summary / Files changed / Android setup / Commands run / How to test / Known limitations
```

---

## Phase 28 — Store / Release Metadata

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Create store/release metadata docs for Blockmancer Dungeon Release 1.0.

Inspect first:
- docs/
- branding assets if present
- story/core concept docs
- credits/licenses docs
- privacy policy notes if present

What to look for:
- Missing store description
- Missing screenshot plan
- Missing trailer plan
- Missing credits/licenses
- Missing privacy policy notes
- Trademark-risk wording like “Tetris”
- Store assets not listed

Expected output:
Create/update docs such as:
- docs/STORE_METADATA.md
- docs/SCREENSHOT_PLAN.md
- docs/TRAILER_PLAN.md
- docs/PRIVACY_POLICY_NOTES.md
- docs/CREDITS_AND_LICENSES.md

Required materials:
- Game title
- Short description
- Long description
- Feature bullets
- Screenshot plan
- App icon requirement
- Feature graphic requirement
- Trailer plan
- Privacy policy draft notes
- Credits/licenses
- Content rating notes
- Support contact placeholder

Acceptance criteria:
- Store copy is cheerful and accurate
- Screenshots match portrait gameplay
- No trademark-risk wording like “Tetris”
- Credits/licenses list exists
- Privacy policy notes exist

Commands:
- npm run build, if code changed

Response format:
Summary / Docs changed / Store assets needed / Commands run / How to review / Known limitations
```

---

## Phase 29 — Final Polish and Bug Fixing

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Perform final Release 1.0 polish and bug fixing. Prioritize blocker and critical bugs.

Inspect first:
- docs/RELEASE_1_GAP_AUDIT.md
- docs/QA_TEST_PLAN.md
- current bug list if present
- BattleScene
- SaveSystem
- Android build config
- UI and VFX-heavy scenes

What to look for:
- Blocker bugs
- Critical crashes
- Full-run blockers
- Save/load edge cases
- Android-specific issues
- Portrait UI overlaps
- Unclear tutorial/reward/boss feedback
- Balance spikes

Expected output:
- Fixed top priority bugs
- Polished transitions
- Polished boss fights
- Polished tutorial/reward pacing
- Polished mobile UI
- Save/load edge cases handled
- Updated known issues list

Acceptance criteria:
- No known blocker bugs
- No known critical bugs undocumented
- Full run can be completed
- Android build works or blockers documented
- Web build works
- QA checklist passes or remaining issues listed

Commands:
- npm run build
- npm run validate:content
- npm run android:build:debug, if configured

Response format:
Summary / Bugs fixed / Files changed / Commands run / QA status / Known remaining issues
```

---

## Phase 30 — Release Candidate

```text
Read AGENT.md first and follow it as the main project instruction.

Task:
Prepare Blockmancer Dungeon Release Candidate 1.0.0.

Inspect first:
- package.json version
- docs/RELEASE_1_0_NOTES.md
- docs/QA_TEST_PLAN.md
- docs/CREDITS_AND_LICENSES.md
- docs/BUILD_APK.md
- SaveSystem migration/version
- Store metadata docs

What to look for:
- Version not updated
- Release notes missing
- QA pass not documented
- Credits/licenses incomplete
- Save migration not verified
- Android build not verified
- Known issues not listed

Expected output:
- Version bump to 1.0.0 if appropriate
- Web production build verified
- Android release/debug build status documented
- QA checklist result documented
- Release notes created/updated
- Known issues list created/updated

Acceptance criteria:
- Version is 1.0.0 or release-candidate version is clearly documented
- Web build passes
- Android build passes or blocker is documented
- QA pass is documented
- Release notes exist
- Known issues list exists

Commands:
- npm run build
- npm run validate:content
- npm run validate:metadata, if available
- npm run android:build:debug, if configured

Response format:
Summary / Version status / Files changed / Commands run / Release candidate status / Known issues
```

---

# Phase Prompt Response Template

Use this response format for every phase:

```text
Summary:
- ...

Files changed:
- ...

What changed:
- ...

Commands run:
- ...

How to test:
1. ...
2. ...
3. ...

Acceptance status:
- [x] ...
- [ ] ...

Known limitations:
- ...

Recommended next step:
- ...
```

---

# Phase Completion Checklist

Before moving to the next phase, verify:

```text
[ ] Agent read AGENT.md
[ ] Scope stayed inside the phase
[ ] Game still builds or failure is documented
[ ] Content validation passes if content changed
[ ] No cheerful tone regression
[ ] No mobile portrait regression
[ ] Cascade Gravity remains core board behavior
[ ] Missing assets/content do not crash
[ ] Save compatibility considered
[ ] Manual test steps provided
[ ] Changes are small enough to review
```

---

# Recommended First Prompt to Use

Start here:

```text
Read AGENT.md first and follow it as the main project instruction.
Also read blockmancer_vibe_code_release_1_plan.md.

Implement Phase 0 — Release Audit only.
Do not rewrite code yet unless a tiny build fix is required.

Create docs/RELEASE_1_GAP_AUDIT.md with:
- current implemented features
- missing Release 1.0 features
- broken/risky areas
- current build status
- validation script status
- recommended next phases

Inspect:
- package.json
- README.md
- docs/
- src/game/
- src/game/scenes/
- src/game/systems/
- src/game/content/
- public/assets/

Run if possible:
- npm install
- npm run build
- npm run validate:content
- npm run validate:metadata

If a command does not exist, document it instead of treating it as a fatal failure.

Finish with:
Summary / Files changed / Commands run / How to test / Known limitations / Recommended next phase
```
