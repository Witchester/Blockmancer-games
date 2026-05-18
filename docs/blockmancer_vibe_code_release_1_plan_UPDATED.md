# Blockmancer Dungeon — Vibe Coding Plan for Full Game Release 1.0
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## Current Progress Overlay — 2026-05-18

Use the phase plan below as the desired release path, but apply these current statuses from the latest audit:

| Phase group | Current status |
| --- | --- |
| Phase 0–2 Foundation | Mostly done. Build/content/metadata/animation validation exists and passes. |
| Phase 3 Cascade Gravity | Implemented; needs regression tests. |
| Phase 4 Special board blocks | Partial; content/assets exist, behavior coverage needs tests. |
| Phase 5–7 Layout/Input/Combat | Implemented/partial; needs mobile smoke and boss behavior verification. |
| Phase 8 Spells | Partial; content exists but runtime spell roster is incomplete. |
| Phase 9 Items | Partial; reactive item content exists but effect coverage needs audit. |
| Phase 10–16 Run structure/replayability | Mixed; map/rewards exist, boss/rules/objectives/hub/friendship need stabilization. |
| Phase 17–23 Release features | Partial; save/settings/audio/assets exist, but story/audio/final art/accessibility need polish. |
| Phase 24–30 Polish/release | Not ready; add tests, mobile smoke, final assets/audio, Android validation, and release metadata. |

Recommended immediate milestone: **Stage 1 vertical slice stabilization**, not engine migration.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

This document is a practical **vibe coding plan** for turning the current fun MVP into a complete **Release 1.0** game.

Core direction:

> **Blockmancer Dungeon** is a cheerful portrait-mobile falling-block roguelike RPG where the **Block-O-Matic 3000** creates a cute chaotic festival dungeon. The player clears rune block lines, triggers **Cascade Gravity**, casts silly spells, collects snacks/relics/upgrades, unlocks quirky heroes, and saves the Festival of Falling Stars from **King Bloxley**, the self-appointed Block King.

---

## Recommended Engine Stack

```text
Engine: Phaser 3
Language: TypeScript
Build Tool: Vite
Mobile Packaging: Capacitor
Content: JSON/data-driven content loaded through ContentRegistry
Save: Local save first, versioned for migration
Target: Web build first, Android build through Capacitor
```

Why this stack fits:

```text
- Fast iteration for a 2D falling-block roguelike RPG
- Strong fit for portrait mobile UI
- Easy web deployment
- Android packaging through Capacitor matches Release 1.0 target
- TypeScript types keep BoardSystem, CombatSystem, MapSystem, and SaveSystem safer
- JSON content keeps events, monsters, bosses, goals, and rewards easy to tune
```

---

## Release 1.0 Target

### Core Gameplay

```text
- Portrait-only mobile layout
- Falling-block board
- Cascade Gravity line clear
- Hold block
- Next block queue
- Inventory overlay
- Touch controls
- Compact battle panel
- Monsters and bosses
- Spells
- Items
- Relics
- Upgrades
- Roguelike map
- Save/load
- Hero unlocks
- Win/loss conditions
```

### Content Target

```text
- 6 stages
- 6 bosses
- 36 regular monsters
- 6 playable heroes
- 10 weapons
- 15 spells
- 15 relics
- 15 upgrades
- 15 board block types
- 10 consumable items
- 8 oopsies / silly drawbacks
- 8 room events
- 8 NPCs
- 12+ loot tables
- 20 random gameplay events
- 6 stage goals
- 8 festival chaos rules
- 10 battle mini-objectives
- 6 boss rule cards
- 8 festival hub buildings
- 8 monster friendship tracks
- Dynamic board size modifiers by stage/encounter
```

### Release Target

```text
- Web build
- Android build through Capacitor
- Local save
- QA pass
- Store-ready metadata
- Basic analytics hooks
- Credits/licenses
- Settings
- Tutorial
```

---

## Development Rules

```text
1. Keep the game playable after every phase.
2. Do not rewrite working systems unless necessary.
3. Prefer small stable changes over large fragile rewrites.
4. Keep placeholder art allowed until polish phases.
5. Keep content data-driven.
6. Use TypeScript types for all systems.
7. Run build after each phase.
8. Portrait mobile is the main target.
9. Keep cheerful festival tone.
10. Core board mechanic is Cascade Gravity, not classic row shifting.
```

---

## Phase 0 — Release Audit

### Goal

Understand current MVP state and create a clean Release 1.0 task baseline.

### Features

```text
- Audit current scenes
- Audit current systems
- Audit content files
- Audit build scripts
- Audit missing assets
- Audit mobile usability
- Audit save/load status
- Identify broken/placeholder systems
- Create release gap list
```

### Files / Areas

```text
README.md
docs/
src/game/
src/game/scenes/
src/game/systems/
src/game/content/
package.json
```

### Acceptance Criteria

```text
- Current build status is known
- Existing MVP features are listed
- Missing Release 1.0 features are listed
- A release checklist exists
- No gameplay changes unless required to fix build
```

### Test Commands

```bash
npm install
npm run build
npm run validate:content
npm run validate:metadata
```

### Codex Prompt

```text
Audit the current Blockmancer Dungeon repo for Release 1.0 readiness. Do not rewrite systems yet. Create or update docs/RELEASE_1_GAP_AUDIT.md with current implemented features, missing features, broken features, and recommended next phases. Run build and validation commands, then report results.
```

---

## Phase 1 — Architecture Stabilization

### Goal

Make the project structure stable enough for full Release 1.0 development.

### Features

```text
- Ensure all systems are separated
- Ensure scenes have clear responsibilities
- Ensure global state shape is typed
- Ensure constants are centralized
- Ensure ContentRegistry is the only content access layer
- Ensure asset manifest is centralized
- Remove duplicate logic
- Add basic error handling for missing content/assets
```

### Required Systems

```text
BoardSystem
CombatSystem
EnemySystem
SpellSystem
RewardSystem
RelicSystem
UpgradeSystem
HeroSystem
WeaponSystem
InventorySystem
ItemSystem
MapSystem
StageSystem
EventSystem
ShopSystem
DifficultySystem
SaveSystem
AssetSystem
AudioSystem
InputSystem
TutorialSystem
SettingsSystem
RandomGameplayEventSystem
StageGoalSystem
ChaosRuleSystem
BattleObjectiveSystem
BossRuleSystem
BoardSizeModifierSystem
HubProgressionSystem
FriendshipSystem
```

### Acceptance Criteria

```text
- npm run build passes
- No circular imports
- Main game state is typed
- Content can be loaded by ID
- Missing content has safe fallback
- Missing texture has safe fallback
```

### Codex Prompt

```text
Stabilize the Blockmancer Dungeon architecture for Release 1.0. Ensure systems are modular, game state is typed, content is accessed only through ContentRegistry, assets are accessed through a centralized asset manifest, and missing content/assets fall back safely. Do not change core gameplay behavior unless needed for build stability.
```

---

## Phase 2 — Content Data 1.0 Conversion

### Goal

Convert content to the cheerful festival concept and prepare the full 1.0 roster.

### Features

```text
- Replace dark content with cheerful festival content
- Add 6 stages
- Add 6 bosses
- Add 36 monsters
- Add 6 heroes
- Add 10 weapons
- Add 15 spells
- Add 15 relics
- Add 15 upgrades
- Add 15 board block types
- Add 10 items
- Add 8 oopsies
- Add 8 room events
- Add NPCs
- Add currencies and collectibles
- Add stage-specific loot tables
- Add random gameplay events
- Add stage goals
- Add chaos rules
- Add battle mini-objectives
- Add boss rule cards
- Add hub building data
- Add friendship data
```

### Content Areas

```text
src/game/content/heroes/
src/game/content/weapons/
src/game/content/monsters/
src/game/content/bosses/
src/game/content/spells/
src/game/content/relics/
src/game/content/upgrades/
src/game/content/board-blocks/
src/game/content/status-effects/
src/game/content/items/
src/game/content/oopsies/
src/game/content/room-events/
src/game/content/npc/
src/game/content/currencies/
src/game/content/collectibles/
src/game/content/stages/
src/game/content/loot-tables/
src/game/content/difficulty-scaling/
src/game/content/random-gameplay-events/
src/game/content/stage-goals/
src/game/content/chaos-rules/
src/game/content/battle-objectives/
src/game/content/boss-rules/
src/game/content/hub-buildings/
src/game/content/friendship/
```

### Acceptance Criteria

```text
- All Release 1.0 content entries exist
- All content uses cheerful tone
- All old dark references are removed or renamed
- All JSON is valid
- IDs match naming convention
- ContentRegistry loads all content
- validate:content passes
```

### Codex Prompt

```text
Update Blockmancer Dungeon content data to the Release 1.0 cheerful festival concept. Add complete JSON data for 6 stages, 6 bosses, 36 monsters, 6 heroes, 10 weapons, 15 spells, 15 relics, 15 upgrades, 15 board blocks, 10 items, 8 oopsies, 8 room events, NPCs, currencies, collectibles, and stage-specific loot tables. Keep all JSON valid and update ContentRegistry.
```

---

## Phase 3 — Cascade Gravity 1.0

### Goal

Make Cascade Gravity the core board identity.

### Features

```text
- Replace classic line shift with Cascade Gravity
- Clear completed lines
- Remove cleared cells
- Collapse unsupported cells downward by column
- Detect new completed lines
- Repeat until stable
- Track cascade count
- Track blocks dropped
- Trigger combat reward from cascades
- Trigger VFX/log messages
```

### System Functions

```ts
detectCompletedLines();
removeCompletedLines();
applyCascadeGravity();
resolveCascadeClears();
calculateCascadeReward();
getCascadeResult();
```

### Data Type

```ts
type CascadeResult = {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  specialBlocksTriggered: string[];
  causedCombo: boolean;
};
```

### Balance

```text
Cascade 1: 100% damage
Cascade 2: 125% damage
Cascade 3: 150% damage
Cascade 4+: 200% damage
Cascade mana bonus: 50% of normal mana gain
```

### Acceptance Criteria

```text
- Clearing a line removes only cleared cells first
- Blocks above fall down with grid gravity
- New lines can form after falling
- Cascades resolve automatically
- Combat receives CascadeResult
- Event log shows cascade messages
- Build passes
```

### Codex Prompt

```text
Implement Cascade Gravity as the core BoardSystem mechanic. When lines clear, remove cleared cells, collapse blocks downward by column, detect new completed lines, repeat until stable, and return a CascadeResult. Integrate cascade damage/mana bonuses into CombatSystem and add event log messages.
```

---

## Phase 4 — Special Board Blocks

### Goal

Make the board feel unique beyond normal colored blocks.

### Features

```text
- Normal rune blocks
- Sprinkle block
- Cupcake block
- Bomb block
- Star block
- Jelly block
- Ice block
- Sticky block
- Crumb junk block
- Royal block
- Confetti block
- Toolbox block
- Clear effects
- Cascade hooks
```

### Board Block Behavior

```text
block_sprinkle: +mana on clear
block_cupcake: small heal on clear
block_bomb: clear nearby cells
block_star: boost cascade reward
block_jelly: soft cascade block, falls normally now
block_ice: freeze/chill hook
block_sticky: harder to collapse / hazard
block_crumb_junk: enemy junk
block_royal: boss pattern block
block_confetti: random bonus
block_toolbox: item charge
```

### Acceptance Criteria

```text
- Board supports block type data
- Special block effects trigger on clear
- Bomb can trigger additional cascade resolve
- Junk block appears from enemy attacks
- Boss blocks can appear
- All behavior has safe fallback
```

### Codex Prompt

```text
Add special board block support to BoardSystem using content data. Implement clear effects for sprinkle, cupcake, bomb, star, junk, royal, confetti, and toolbox blocks. Ensure special effects integrate with Cascade Gravity and do not break board stability.
```

---

## Phase 5 — Portrait Mobile Layout 1.0

### Goal

Implement the final portrait-only screen layout.

### Layout

```text
Top 1/5:
- Compact battle screen
- JRPG/Suikoden-inspired combat area
- Hero side
- Enemy side
- HP bars
- Intent
- Stage name

Middle 3/5:
- Falling-block board
- Next block queue
- Hold block
- Inventory compact overlay
- Fever meter
- Cascade/combo display

Bottom 1/5:
- Mobile controls
- Left/right
- Rotate
- Soft drop
- Hard drop
- Hold
- Spell buttons
- Item/inventory button
```

### Features

```text
- Lock orientation to portrait where possible
- Refactor BattleScene layout
- Add responsive scaling
- Add safe areas for notches
- Add compact overlays
- Add touch target sizing
- Make UI readable on 1440x3136 and smaller phones
```

### Acceptance Criteria

```text
- Game is portrait-only
- Top combat uses 1/5 height
- Board uses 3/5 height
- Controls use 1/5 height
- Next block is visible
- Hold block is visible
- Inventory is visible/expandable
- Touch controls are playable
- Desktop browser preview still works
```

### Codex Prompt

```text
Refactor BattleScene into a portrait-only mobile layout. Use 1/5 screen height for compact battle, 3/5 for falling-block board with next/hold/inventory overlays, and 1/5 for touch controls. Keep desktop preview usable but prioritize mobile portrait.
```

---

## Phase 6 — Input System 1.0

### Goal

Make controls feel good on both mobile and desktop.

### Controls

```text
Desktop:
- A/Left: move left
- D/Right: move right
- W/Up: rotate
- S/Down: soft drop
- Space: hard drop
- Shift/C: hold
- 1-4: spells
- I: inventory
- Esc: pause

Mobile:
- Left button
- Right button
- Rotate button
- Soft drop button
- Hard drop button
- Hold button
- Spell buttons
- Item/inventory button
```

### Acceptance Criteria

```text
- Mobile buttons feel responsive
- Holding left/right repeats movement
- Soft drop can be held
- Hard drop is single tap
- Rotate is single tap
- Hold works once per piece
- Spell buttons work
- Inventory button works
```

### Codex Prompt

```text
Implement a polished InputSystem for desktop and mobile. Add touch repeat for left/right and soft drop, single-tap rotate/hard drop/hold, spell buttons, and inventory button. Make controls responsive and safe for portrait mobile play.
```

---

## Phase 7 — Combat System 1.0

### Goal

Connect board play, cascade, enemy actions, spells, items, relics, and upgrades into a complete combat loop.

### Features

```text
- Line clear damage
- Cascade bonus damage
- Mana gain
- Combo tracking
- Fever gain
- Enemy intent
- Enemy attack counter
- Player HP/shield
- Enemy HP/armor
- Status effects
- Board-affecting enemy behavior
- Victory/defeat flow
```

### Required Enemy Behaviors

```text
basic_attack
spawn_junk
hide_next_block
hide_hold_block
shake_board
freeze_piece
mana_zap
shield_self
sleep_player
swap_next_hold
reverse_controls
pattern_junk
royal_block_spawn
```

### Acceptance Criteria

```text
- Every enemy behavior has implementation or safe placeholder
- Boss behaviors are unique
- Cascades matter in combat
- Combat logs are readable
- Player can win/lose battle
- Battle reward flow works
```

### Codex Prompt

```text
Upgrade CombatSystem and EnemySystem for Release 1.0. Connect line clears, CascadeResult, mana gain, combo, fever, enemy intents, enemy behaviors, status effects, player HP/shield, victory, and defeat. Implement safe placeholders for any complex enemy behaviors.
```

---

## Phase 8 — Spell System 1.0

### Goal

Make all 15 spells functional and data-driven.

### Spell List

```text
spl_fireball
spl_frost_lock
spl_bomb_rune
spl_clean_cut
spl_sprinkle_shower
spl_cupcake_blast
spl_confetti_pop
spl_bubble_shield
spl_star_spark
spl_jelly_bounce
spl_snowcone_burst
spl_goblin_gadget
spl_rainbow_reroll
spl_snack_break
spl_cascade_cheer
```

### Features

```text
- Spell cost
- Spell cooldown/hook if needed
- Spell button UI
- Spell effects
- Spell upgrades
- Spell VFX hooks
- Not enough mana feedback
- Spell disabled state
```

### Acceptance Criteria

```text
- All spells can be cast if available
- Mana costs apply
- Effects work
- UI updates
- Spell upgrades modify effects
- Build passes
```

### Codex Prompt

```text
Implement all Release 1.0 spells using SpellSystem and spell content data. Add damage, heal, shield, board clear, reroll, cascade boost, slow/freeze, and random gadget effects. Ensure spell buttons show cost and disabled state.
```

---

## Phase 9 — Inventory and Item System 1.0

### Goal

Make the inventory overlay useful during battle and events.

### Features

```text
- Inventory slots
- Stackable consumables
- Item use rules
- Item pickup
- Item reward
- Item shop purchase
- Item cooldown if needed
- Compact overlay
- Expanded overlay
```

### Item List

```text
item_mini_cupcake
item_mana_lemonade
item_rainbow_soda
item_toolbox
item_snowcone
item_party_popper
item_bubble_gum
item_lucky_ticket
item_hold_coupon
item_block_polish
```

### Acceptance Criteria

```text
- Inventory visible in middle board area
- Inventory can expand/collapse
- Items can be used
- Item counts update
- Items can be rewarded/bought
- Inventory capacity upgrades work
```

### Codex Prompt

```text
Implement InventorySystem and ItemSystem for Release 1.0. Add stackable consumable items, compact/expanded inventory UI, item usage during battle, item rewards, shop purchase integration, and inventory capacity upgrades.
```

---

## Phase 10 — Hero, Weapon, and Unlock System

### Goal

Make playable heroes meaningful and unlockable.

### Heroes

```text
Milo: default, balanced
Pippa: fire damage, unlock Stage 1 boss
Nixie: control/slow, unlock 3 rooms no damage
Bruk: high HP/defense, unlock 500 total gold
Zuzu: bomb/board chaos, unlock Stage 2 boss
Lumi: mana/cascade, unlock 10 cascade combos
```

### Features

```text
- Hero select scene
- Hero stories
- Hero stats
- Hero passive
- Starting spells
- Starting weapon
- Unlock conditions
- Meta progress save
- Locked hero UI
```

### Acceptance Criteria

```text
- Hero select shows all heroes
- Locked heroes show unlock condition
- Unlocked heroes persist
- Hero stats affect run
- Hero starting loadout works
- Hero passive works
```

### Codex Prompt

```text
Implement HeroSystem, WeaponSystem, and hero unlock progression. Add hero select UI with locked/unlocked states, hero stories, hero stats, starting loadouts, passives, unlock conditions, and persistent meta progress.
```

---

## Phase 11 — Roguelike Map and Stage System

### Goal

Turn the run into a full 6-stage adventure.

### Features

```text
- Stage progression
- Stage-specific monster pool
- Stage-specific boss
- Stage-specific events
- Stage-specific loot
- Node map generation or fixed map
- Fight/Event/Shop/Rest/Treasure/Elite/Boss nodes
- Completed/current/available states
```

### Stages

```text
1. Sprinkle Sewers
2. Goblin Workshop
3. Frosty Pantry
4. Pillow Castle
5. Starfall Arcade
6. Bloxley’s Block Palace
```


### Stage Node Scaling

```text
Stage 1: 6 main-path nodes, 9–11 total generated nodes, 0 elites
Stage 2: 8 main-path nodes, 12–14 total generated nodes, 1 elite
Stage 3: 10 main-path nodes, 15–17 total generated nodes, 1 elite
Stage 4: 12 main-path nodes, 18–21 total generated nodes, 1–2 elites
Stage 5: 14 main-path nodes, 22–25 total generated nodes, 2 elites
Stage 6: 16 main-path nodes, 26–30 total generated nodes, 2–3 elites plus special pre-boss
```

### Acceptance Criteria

```text
- Player progresses through 6 stages
- Each stage has unique monster pool
- Boss appears at end of each stage
- Defeating boss advances stage
- Final boss victory ends run
- Map state saves/loads
```

### Codex Prompt

```text
Implement Release 1.0 StageSystem and MapSystem. Add 6-stage progression, stage-specific monster pools, boss nodes, events, shops, rest sites, treasures, elites, loot tables, and persistent map state.
```

---

## Phase 12 — Boss System 1.0

### Goal

Make bosses feel unique and memorable.

### Bosses

```text
Cupcake Slime King: sticky blocks
Prototype No. 7: junk + bombs + shake
Gelato Golem: ice/freeze
Sir Snore-a-Lot: sleep + shield
High Score Hydra: combo/cascade challenge
King Bloxley: symmetry + royal blocks
```

### Features

```text
- Boss intro
- Boss phase threshold
- Boss unique behavior
- Boss intent text
- Boss reward
- Boss stage transition
- Final victory
```

### Acceptance Criteria

```text
- All bosses spawn correctly
- Each boss has at least one unique mechanic
- Boss phase 2 exists or placeholder exists
- Boss reward is better than normal
- King Bloxley victory triggers final ending
```

### Codex Prompt

```text
Implement BossSystem or boss behavior support in EnemySystem. Add unique behavior, phase thresholds, intros, better rewards, and stage transitions for all 6 Release 1.0 bosses. King Bloxley should trigger final victory.
```

---

## Phase 13 — Reward, Relic, and Upgrade System 1.0

### Goal

Make post-battle choices exciting and replayable.

### Features

```text
- 3 reward choices
- Rarity weighting
- Stage-specific loot
- Reroll reward
- Relic effects
- Upgrade stacking
- Spell upgrades
- Weapon rewards if enabled
- Item rewards
- Gold/heal rewards
```

### Acceptance Criteria

```text
- Reward screen appears after battle
- Rewards are valid from loot table
- Relics apply effects
- Upgrades apply effects
- Reroll works if player has reroll
- Duplicate/stack rules work
- Boss rewards feel better
```

### Codex Prompt

```text
Upgrade RewardSystem, RelicSystem, and UpgradeSystem for Release 1.0. Use loot tables, rarity weighting, stage-specific rewards, rerolls, stacking rules, relic triggers, upgrade effects, item rewards, gold, heal, and boss reward logic.
```

---

## Phase 14 — Events, Shops, Rest, and Treasure 1.0

### Goal

Make non-combat rooms meaningful.

### Events

```text
Suspicious Button
Lost Cake Cart
Goblin Quality Test
Rainbow Fountain
Sleepy Guard
Arcade Challenge
Block-O Manual Page
Friendship Slime
```

### Features

```text
- Event choices
- Shop purchases
- Rest healing
- Treasure rewards
- Return to map
- Stage-themed event pools
```

### Acceptance Criteria

```text
- All room types work
- Choices affect state
- Shop prices check gold
- Rest heals
- Treasure rewards
- Events are cheerful/funny
```

### Codex Prompt

```text
Implement all non-combat room systems for Release 1.0: EventScene, ShopScene, RestScene, TreasureScene. Add the 8 cheerful room events, shop purchases, rest healing, treasure rewards, and return-to-map flow.
```

---

## Phase 15 — Oopsies / Silly Drawbacks System

### Goal

Add risk/reward without dark curse tone.

### Oopsies

```text
oops_heavy_blocks
oops_slippery_buttons
oops_too_much_confetti
oops_snack_tax
oops_sticky_floor
oops_overexcited_machine
oops_square_only
oops_sugar_crash
```

### Acceptance Criteria

```text
- Oopsies can be gained
- Oopsies affect gameplay
- Oopsies show in run UI
- Oopsies can be removed
- No oopsie soft-locks the player
```

### Codex Prompt

```text
Implement OopsieSystem as the cheerful replacement for curses. Add oopsie effects, UI display, save/load support, shop removal, and event integration. Ensure no oopsie can soft-lock the run.
```

---

## Phase 16 — Fever / Combo / Cascade Meta System

### Goal

Give advanced players a satisfying mastery layer.

### Features

```text
- Fever meter
- Fever gain from cascades
- Fever gain from combo
- Fever activation
- Fever reward multiplier
- Combo UI
- Cascade level UI
- Stage 5 arcade mechanics
```

### Acceptance Criteria

```text
- Fever meter fills
- Fever can activate or auto-trigger
- Fever improves rewards/damage temporarily
- UI clearly shows fever state
- High Score Hydra uses fever/combo mechanic
```

### Codex Prompt

```text
Implement FeverSystem tied to combo and Cascade Gravity. Add fever meter, fever activation, bonus effects, UI feedback, and special Stage 5/High Score Hydra interactions.
```

---

## Phase 16.5 — Festival Chaos & Replayability

### Goal

Add the designer-requested replayability layer that makes each run feel different without changing the cheerful festival identity.

This phase should be implemented after the core run structure exists because it connects MapSystem, StageSystem, BoardSystem, CombatSystem, EventSystem, RewardSystem, HeroSystem, BossSystem, OopsieSystem, SaveSystem, and UI.

### Features

```text
- Random gameplay events during battle/map/event rooms
- Stage Goals for each of the 6 stages
- Festival Chaos Rules as room-level modifiers
- Battle Mini-Objectives
- Boss Rule Cards
- Oopsie risk/reward event choices
- Hero-specific playstyle passives
- Dynamic board size modifiers by encounter type
- Festival Hub progression
- Monster Friendship / Collection
```

### New Required Systems

```text
RandomGameplayEventSystem
StageGoalSystem
ChaosRuleSystem
BattleObjectiveSystem
BossRuleSystem
BoardSizeModifierSystem
HubProgressionSystem
FriendshipSystem
```

### Content Areas

```text
src/game/content/random-gameplay-events/
src/game/content/stage-goals/
src/game/content/chaos-rules/
src/game/content/battle-objectives/
src/game/content/boss-rules/
src/game/content/hub-buildings/
src/game/content/friendship/
```

### Random Gameplay Events

Implement at least these initial events:

```text
r_evt_jelly_surge
r_evt_sprinkle_rain
r_evt_sticky_spill
r_evt_lost_cake_alarm
r_evt_goblin_miswire
r_evt_button_panic
r_evt_bomb_delivery
r_evt_freezer_draft
r_evt_ice_slide
r_evt_sleepy_moment
r_evt_blanket_tangle
r_evt_arcade_combo_callout
r_evt_prize_claw_grab
r_evt_neon_flash
r_evt_royal_decree_square
r_evt_symmetry_check
r_evt_confetti_overload
r_evt_manual_page_tip
r_evt_snack_break
r_evt_machine_hiccup
```

### Map Node Scaling

```text
Stage 1: 6 main-path nodes, 9–11 total generated nodes
Stage 2: 8 main-path nodes, 12–14 total generated nodes
Stage 3: 10 main-path nodes, 15–17 total generated nodes
Stage 4: 12 main-path nodes, 18–21 total generated nodes
Stage 5: 14 main-path nodes, 22–25 total generated nodes
Stage 6: 16 main-path nodes, 26–30 total generated nodes
```

Rules:

```text
- Boss node is always the final required node.
- Elite nodes start from Stage 2.
- Stage 6 includes a special pre-boss / mini-boss / Royal Guard node.
- Map state must save/load.
```

### Base Board Size by Stage

```text
Stage 1: 8 x 16
Stage 2: 9 x 17
Stage 3: 9 x 18
Stage 4: 10 x 18
Stage 5: 10 x 19
Stage 6: 10 x 20
```

Encounter modifiers:

```text
Normal: stage base size
Hard Normal: base size with possible locked hazard row
Elite: usually width -1 or height -2, with better rewards
Boss Phase 1: base size plus boss mechanic
Boss Phase 2: shrink, expand, or reshape temporarily
Final Boss: board changes by phase
Treasure/Rest: slightly safer or larger puzzle board
Event: variable based on event choice
```

Safety rules:

```text
- Never shrink below 6 x 12.
- Never expand beyond mobile-readable layout.
- Board resize must preserve existing blocks safely or use a clear fallback.
- Board size changes must not break Cascade Gravity.
```

### Stage Goals

```text
Stage 1: Recover 3 Lost Cupcakes
Stage 2: Disable 2 Goblin Machines
Stage 3: Save 3 Ice Cream Crates
Stage 4: Keep 2 Guards Asleep
Stage 5: Reach Combo Score Target
Stage 6: Break 3 Royal Seals
```

Each stage goal should affect boss difficulty, rewards, or true-ending progress.

### Festival Chaos Rules

```text
chaos_sprinkle_storm
chaos_wobbly_floor
chaos_snack_tax
chaos_confetti_fever
chaos_goblin_safety_test
chaos_freezer_draft
chaos_royal_inspection
chaos_jelly_bounce
```

### Battle Mini-Objectives

```text
mini_trigger_cascade
mini_clear_two_lines_one_piece
mini_clear_sprinkles
mini_clear_all_junk
mini_no_spell_win
mini_win_before_enemy_attacks
mini_use_hold
mini_cast_two_spells
mini_low_board_height
mini_trigger_fever
```

### Boss Rule Cards

```text
Cupcake Slime King: Sticky blocks spread if ignored.
Prototype No. 7: The machine drops junk or bombs every few pieces.
Gelato Golem: The board freezes during cold waves.
Sir Snore-a-Lot: Sleeps, shields, then wakes stronger.
High Score Hydra: Low combo play makes Hydra stronger.
King Bloxley: Symmetry patterns and royal blocks must be managed.
```

### Hero-Specific Playstyle Passives

```text
Milo: First cascade each battle gives bonus mana.
Pippa: Fire spells burn sticky/junk blocks.
Nixie: Once per room, can slow fall speed or soften speed spikes.
Bruk: Survive board overflow once per battle or gain emergency shield.
Zuzu: Bomb blocks appear more often, but junk increases slightly.
Lumi: Star blocks heavily boost cascade damage.
```

### Festival Hub Buildings

```text
hub_cake_stall
hub_ice_cream_cart
hub_goblin_workshop
hub_arcade_booth
hub_snack_table
hub_star_lantern_stage
hub_repair_tent
hub_bloxley_statue
```

### Monster Friendship Rewards

```text
Cupcake Slime: Start battle with 1 sprinkle block.
Sugar Bat: Next preview hide duration reduced.
Crumb Goblin: Junk blocks have chance to become normal blocks.
Button Masher: Board shake reduced.
Ice Cream Imp: Freeze effects last shorter.
Blanket Ghost: Sleepy effect can heal slightly or reduce enemy action.
Combo Gremlin: Fever gain bonus.
Square Jester: Royal pattern warning appears earlier.
```

### Acceptance Criteria

```text
- At least 10 random gameplay events are implemented.
- Each stage has 1 optional stage goal.
- Combat rooms can roll 0–1 Festival Chaos Rule.
- Combat rooms can roll 0–1 Battle Mini-Objective.
- Bosses show Boss Rule Cards before combat.
- Event choices can grant Oopsies in exchange for stronger rewards.
- Each hero has a unique passive that affects board/combat.
- Board size can change by encounter type and boss phase.
- Hub buildings can be upgraded after runs.
- Monster friendship points can be gained and saved.
- All new content is data-driven.
- Save/load supports all new current-run and meta-progress fields.
- Mobile portrait readability remains intact.
- Build passes.
```

### Codex Prompt

```text
Implement Phase 16.5 — Festival Chaos & Replayability.

Goal:
Add replayability and strategic variety to Blockmancer Dungeon by implementing random gameplay events, stage goals, chaos rules, battle mini-objectives, boss rule cards, oopsie risk/reward choices, hero passives, dynamic board size modifiers, festival hub progression, and monster friendship.

Important:
- Keep cheerful festival / cute chaos tone.
- Do not add dark curse content.
- Keep Cascade Gravity as the core board mechanic.
- Keep all content data-driven.
- Do not rewrite unrelated working systems.
- Keep mobile portrait readability.
- Add safe fallbacks for missing content.
- Save/load new progress safely.
- Build after changes.

Inspect first:
- BoardSystem
- CombatSystem
- EventSystem
- RewardSystem
- OopsieSystem
- HeroSystem
- MapSystem
- StageSystem
- BossSystem / EnemySystem
- SaveSystem
- ContentRegistry
- BattleScene / MapScene / EventScene / RewardScene

Expected output:
- RandomGameplayEventSystem
- StageGoalSystem
- ChaosRuleSystem
- BattleObjectiveSystem
- BossRuleSystem
- BoardSizeModifierSystem
- HubProgressionSystem
- FriendshipSystem
- New content folders and seed content
- UI indicators/cards/placeholders for new systems
- Save data migration/defaults for new fields

Commands:
- npm run build
- npm run validate:content, if available
- npm run validate:metadata, if available

Finish with:
Summary / Files changed / Systems added / Content added / Gameplay impact / Save-load changes / UI changes / Commands run / How to test / Known limitations
```

---

## Phase 17 — Tutorial and Onboarding

### Goal

Teach players without overwhelming them.

### Tutorial Lessons

```text
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
```

### Acceptance Criteria

```text
- New player can learn core loop
- Tutorial can be skipped
- Tutorial state saves
- Help screen exists
- Tutorial does not block returning players
```

### Codex Prompt

```text
Implement TutorialSystem and first-run onboarding for Blockmancer Dungeon. Teach movement, rotation, line clear, Cascade Gravity, spells, hold, inventory, enemy intent, rewards, and map progression. Add skip and help menu.
```

---

## Phase 18 — Save, Meta Progress, and Profiles

### Goal

Make progression persistent and reliable.

### Save Data

```text
Current run:
- Player state
- Hero
- Weapon
- Spells
- Relics
- Upgrades
- Items
- Oopsies
- Stage/map
- Board state if needed
- Current room
- Run stats

Meta:
- Unlocked heroes
- Total gold collected
- Total cascades
- Bosses defeated
- Endings unlocked
- Tutorial completed
- Settings
```

### Acceptance Criteria

```text
- Refresh does not lose run
- Continue works
- Hero unlocks persist
- Corrupt save does not crash
- Save versioning exists
```

### Codex Prompt

```text
Upgrade SaveSystem for Release 1.0. Support current run save, meta progression, hero unlocks, tutorial completion, settings, version migration, corrupt save fallback, and clear save/new run flows.
```

---

## Phase 19 — Art Asset Pipeline Integration

### Goal

Replace placeholder rectangles with asset-driven sprites without breaking fallback.

### Features

```text
- Asset manifest
- Texture preload
- Missing texture fallback
- UI sprites
- Board block sprites
- Hero sprites
- Monster sprites
- Boss sprites
- Spell/item/relic/upgrade icons
- Stage backgrounds
```

### Acceptance Criteria

```text
- Game works without missing asset crash
- Asset keys map to file paths
- Content iconKey/spriteKey loads sprites
- Placeholder fallback remains
- Build passes
```

### Codex Prompt

```text
Integrate the Release 1.0 art asset pipeline. Add AssetSystem and asset manifest support for UI, board blocks, heroes, monsters, bosses, spells, items, relics, upgrades, stages, and VFX. Use spriteKey/iconKey from content JSON and keep safe fallback placeholders.
```

---

## Phase 20 — UI Polish and Readability

### Goal

Make the game feel like a real mobile game, not a prototype.

### Features

```text
- Pixel UI theme
- Better HUD
- Clear HP/mana/fever bars
- Better damage numbers
- Better event log
- Better reward cards
- Better spell buttons
- Better item/inventory UI
- Better stage transitions
- Better boss intro
```

### Acceptance Criteria

```text
- UI readable on phone
- Important information visible
- No clutter in portrait layout
- Touch targets are large enough
- Reward choices are understandable
- Inventory/next/hold are visible
```

### Codex Prompt

```text
Polish the portrait mobile UI for Release 1.0. Improve HUD readability, pixel-art panels, HP/mana/fever bars, damage numbers, reward cards, spell buttons, inventory, next/hold overlays, boss intros, and stage transitions.
```

---

## Phase 21 — Audio and Feedback

### Goal

Add satisfying feedback for gameplay.

### Required Audio Hooks

```text
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
```

### Acceptance Criteria

```text
- Audio can be muted
- Volume settings persist
- SFX trigger at right moments
- Missing audio does not crash
```

### Codex Prompt

```text
Implement AudioSystem for Release 1.0 with SFX hooks for line clear, cascade, spell cast, hit, reward, UI tap, shop, victory, defeat, and boss intro. Add volume/mute settings and missing-audio fallback.
```

---

## Phase 22 — Settings, Accessibility, and UX Options

### Goal

Make the game comfortable on mobile.

### Settings

```text
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
```

### Acceptance Criteria

```text
- Settings screen exists
- Settings persist
- Reduced flashing works
- Screen shake can be disabled
- Left-handed layout works
- Block symbols improve readability
```

### Codex Prompt

```text
Add SettingsScene and accessibility options for Release 1.0: volume, mute, vibration, screen shake, reduced flashing, colorblind-friendly symbols, text speed, left-handed controls, button size, grid toggle, and tutorial reset.
```

---

## Phase 23 — Story, Dialogue, and Endings

### Goal

Deliver the cheerful narrative arc.

### Story Beats

```text
- Opening: Block-O-Matic 3000 breaks festival
- Stage intros
- Boss intros
- Hero unlock dialogue
- King Bloxley intro
- Normal ending
- True ending
```

### Acceptance Criteria

```text
- Story is cheerful
- Each stage has intro
- Each boss has intro
- Normal ending works
- True ending condition exists
- Dialogue can be skipped
```

### Codex Prompt

```text
Implement cheerful story flow for Release 1.0: opening, stage intros, boss intros, hero unlock dialogue, King Bloxley intro, normal ending, true ending, skippable dialogue, and story screens.
```

---

## Phase 24 — Balance Pass 1

### Goal

Make a full run playable from start to finish.

### Balance Areas

```text
- Fall speed curve
- Enemy HP
- Enemy attack
- Mana gain
- Spell costs
- Item power
- Relic strength
- Upgrade stacking
- Boss difficulty
- Stage length
- Reward frequency
```

### Acceptance Criteria

```text
- Average player can clear Stage 1
- Skilled player can reach Stage 6
- Bosses are challenging but fair
- Cascade feels rewarding
- No one strategy dominates too much
- No required content is impossible to unlock
```

### Codex Prompt

```text
Perform a data-driven balance pass for Release 1.0. Tune fall speed, enemy HP/attack, mana gain, spell costs, item values, relics, upgrades, boss difficulty, stage length, and rewards. Keep changes in content/config files where possible.
```

---

## Phase 25 — QA Test Suite and Debug Tools

### Goal

Make release testing efficient.

### Features

```text
- Debug menu
- Give gold
- Give item
- Spawn monster
- Jump to stage
- Trigger boss
- Force reward
- Force cascade test
- Validate content
- Smoke test scenes
```

### Acceptance Criteria

```text
- Debug mode only available in dev
- QA docs exist
- Basic smoke tests pass
- Content validation passes
```

### Codex Prompt

```text
Add QA/debug tools for Release 1.0: dev-only debug menu, stage jump, spawn monster, trigger boss, give gold/item/relic/upgrade, force cascade test, and smoke test helpers. Update QA documentation.
```

---

## Phase 26 — Performance Optimization

### Goal

Ensure smooth mobile performance.

### Targets

```text
- 60 FPS target where possible
- Stable on mid-range Android
- No excessive allocations during board update
- No texture reload during gameplay
- No memory leak across scenes
```

### Acceptance Criteria

```text
- Board updates are smooth
- Cascades do not freeze
- Scene transitions are stable
- No major memory leak after multiple runs
```

### Codex Prompt

```text
Optimize Blockmancer Dungeon for mobile performance. Focus on BoardSystem, Cascade Gravity, VFX pooling, UI object reuse, scene cleanup, texture loading, and memory usage. Do not change gameplay behavior unless required.
```

---

## Phase 27 — Android / Capacitor Release Build

### Goal

Prepare Android build for testing and release.

### Features

```text
- Capacitor config
- Android project sync
- App icon
- Splash screen
- Portrait orientation
- Build debug APK
- Build release AAB
- Signing instructions
- Permissions audit
```

### Acceptance Criteria

```text
- Debug APK builds
- App opens on Android
- Portrait orientation works
- Touch controls work
- Save/load works on device
- No broken asset paths
```

### Codex Prompt

```text
Prepare Android build support for Release 1.0 using Capacitor. Ensure portrait orientation, asset paths, app icon/splash placeholders, Android sync, debug APK build instructions, and device testing checklist.
```

---

## Phase 28 — Store / Release Metadata

### Goal

Prepare publish-facing materials.

### Required Materials

```text
- Game title
- Short description
- Long description
- Feature bullets
- Screenshots
- App icon
- Feature graphic
- Trailer plan
- Privacy policy draft
- Credits/licenses
- Content rating notes
- Support contact
```

### Acceptance Criteria

```text
- Store copy is cheerful and accurate
- Screenshots match portrait gameplay
- No trademark-risk wording like "Tetris"
- Credits/licenses list exists
- Privacy policy notes exist
```

### Codex Prompt

```text
Create store/release metadata for Blockmancer Dungeon Release 1.0. Include short description, long description, feature bullets, screenshot plan, trailer plan, app icon/feature graphic requirements, privacy policy notes, credits/licenses, and IP-safe wording that avoids using "Tetris" in marketing.
```

---

## Phase 29 — Final Polish and Bug Fixing

### Goal

Make the game feel release-ready.

### Tasks

```text
- Fix top 50 bugs
- Polish transitions
- Polish boss fights
- Polish tutorial
- Polish reward pacing
- Polish mobile UI
- Polish save/load edge cases
- Polish audio feedback
- Polish VFX
- Polish balance
```

### Acceptance Criteria

```text
- No known blocker bugs
- No known critical bugs
- Full run can be completed
- Android build works
- Web build works
- QA checklist passes
```

### Codex Prompt

```text
Perform final Release 1.0 polish and bug fixing. Prioritize blocker/critical bugs, full-run stability, Android build, portrait mobile UI, boss fights, tutorial, save/load, audio/VFX feedback, and balance. Keep changes focused and safe.
```

---

## Phase 30 — Release Candidate

### Goal

Create the final Release 1.0 candidate.

### Tasks

```text
- Version bump to 1.0.0
- Build web production
- Build Android release
- Run QA checklist
- Verify credits/licenses
- Verify store assets
- Verify save migration
- Tag release
```

### Acceptance Criteria

```text
- Version is 1.0.0
- Web build passes
- Android build passes
- QA pass is documented
- Release notes exist
- Known issues list exists
```

### Codex Prompt

```text
Prepare Blockmancer Dungeon Release Candidate 1.0.0. Update version, run full build/validation, generate release notes, verify credits/licenses, verify store assets, verify save migration, and create docs/RELEASE_1_0_NOTES.md with known issues and final checklist.
```

---

# Release 1.0 Feature Checklist

## Core Gameplay

```text
[ ] Falling-block board
[ ] Cascade Gravity
[ ] Hold block
[ ] Next block queue
[ ] Inventory overlay
[ ] Mobile touch controls
[ ] Desktop controls
[ ] Combat panel
[ ] Enemy intents
[ ] Player HP/mana/shield
[ ] Fever meter
[ ] Combo/cascade UI
```

## Content

```text
[ ] 6 stages
[ ] 6 bosses
[ ] 36 monsters
[ ] 6 heroes
[ ] 10 weapons
[ ] 15 spells
[ ] 15 relics
[ ] 15 upgrades
[ ] 15 board blocks
[ ] 10 items
[ ] 8 oopsies
[ ] 8 room events
[ ] 8 NPCs
[ ] Loot tables
[ ] Random gameplay events
[ ] Stage goals
[ ] Chaos rules
[ ] Battle mini-objectives
[ ] Boss rule cards
[ ] Hub buildings
[ ] Monster friendship tracks
```

## Systems

```text
[ ] BoardSystem
[ ] Cascade Gravity
[ ] CombatSystem
[ ] EnemySystem
[ ] BossSystem
[ ] SpellSystem
[ ] InventorySystem
[ ] ItemSystem
[ ] RewardSystem
[ ] RelicSystem
[ ] UpgradeSystem
[ ] HeroSystem
[ ] WeaponSystem
[ ] MapSystem
[ ] StageSystem
[ ] EventSystem
[ ] ShopSystem
[ ] OopsieSystem
[ ] FeverSystem
[ ] SaveSystem
[ ] AudioSystem
[ ] AssetSystem
[ ] TutorialSystem
[ ] SettingsSystem
[ ] RandomGameplayEventSystem
[ ] StageGoalSystem
[ ] ChaosRuleSystem
[ ] BattleObjectiveSystem
[ ] BossRuleSystem
[ ] BoardSizeModifierSystem
[ ] HubProgressionSystem
[ ] FriendshipSystem
```

## Mobile / Release

```text
[ ] Portrait-only layout
[ ] Android build
[ ] App icon
[ ] Splash screen
[ ] Store copy
[ ] Screenshots
[ ] Credits/licenses
[ ] Privacy policy notes
[ ] QA checklist
[ ] Release notes
```

---

# Recommended Milestone Grouping

## Milestone A — Foundation

```text
Phase 0
Phase 1
Phase 2
```

## Milestone B — Core Gameplay

```text
Phase 3
Phase 4
Phase 5
Phase 6
Phase 7
Phase 8
Phase 9
```

## Milestone C — Run Structure

```text
Phase 10
Phase 11
Phase 12
Phase 13
Phase 14
Phase 15
Phase 16
```

## Milestone C+ — Festival Chaos & Replayability

```text
Phase 16.5
```

## Milestone D — Release Features

```text
Phase 17
Phase 18
Phase 19
Phase 20
Phase 21
Phase 22
Phase 23
```

## Milestone E — Release Polish

```text
Phase 24
Phase 25
Phase 26
Phase 27
Phase 28
Phase 29
Phase 30
```

---

# Recommended Implementation Order

```text
1. Audit current MVP
2. Stabilize architecture
3. Convert content
4. Implement Cascade Gravity
5. Implement portrait mobile UI
6. Implement combat/spells/items
7. Implement stages/bosses/map
8. Implement hero unlocks/meta
9. Implement rewards/events/shops
9.5. Implement Festival Chaos & Replayability systems
10. Implement tutorial/save/settings
11. Add assets/audio/polish
12. QA/balance/release
```