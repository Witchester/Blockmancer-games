---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
  - docs/02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md
  - docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md
  - docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
  - docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
  - bmad-output/project-context.md
  - bmad-output/game-architecture.md
status: complete
---

# Blockmancer Dungeon - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Blockmancer Dungeon, decomposing the requirements from the GDD, route/story source of truth, reactive difficulty source of truth, release implementation source of truth, project context, and architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The game must remain a cheerful portrait-mobile falling-block roguelike RPG about restoring the Festival of Falling Stars after the Block-O-Matic 3000 opens a colorful dungeon.

FR2: The board must preserve Cascade Gravity as the core line-clear behavior: detect completed lines, remove cleared cells, apply deterministic per-column gravity, repeat until stable, and return a CascadeResult.

FR3: Cascade rewards must affect combat damage and mana gain, including higher damage multipliers for later cascade levels and a cascade mana bonus.

FR4: The battle screen must provide the canonical 25 percent combat/event-log area, 55 percent puzzle area, and 20 percent controls/spells/actions area without overlap.

FR5: The combat area must show hero and enemy sprites, names, HP, MP where applicable, shield/status chips, enemy intent or attack countdown, VFX, damage numbers, cascade callouts, and an event log contained inside the combat area.

FR6: The puzzle area must keep the board central and readable while keeping Hold, Next Queue, inventory access, and right-rail stats visible.

FR7: The control area must provide fixed falling-block controls and spell/skill/utility controls that remain visible and thumb-friendly on portrait mobile.

FR8: Release 1 must include six stages: Sprinkle Sewers, Goblin Workshop, Frosty Pantry, Pillow Castle, Starfall Arcade, and Bloxley's Block Palace.

FR9: Each stage must provide stage-specific monsters, hazards, loot direction, stage goals, map-node structure, and one boss.

FR10: Every boss must have a readable rule card before combat, clear phase or mechanic communication, stage-matching mechanics, and player-facing cheerful tone.

FR11: Release 1 core hero scope must include Milo, Pippa, Nixie, Bruk, Zuzu, and Lumi, each with a distinct passive that changes board or combat feel.

FR12: Hero unlock direction must support Milo as default and unlock the remaining route heroes through boss defeats, mastery, or meta progress as designed.

FR13: The route story system must support six playable heroes across six stages, producing 36 unique hero-stage route scenes.

FR14: Each route scene must have a unique scene ID, trigger ID, hero-specific story focus, stage-specific build-up, Practical/True/Risky choices, unique choice labels, character voice, reward or risk logic, optional boss callback, save/load support, and fallback behavior.

FR15: Route choices must update route progress through practicalScore, trueScore, riskyScore, trueFlags, chosenScenes, triggeredScenes, unlockedEndingIds, and variantEndingIds.

FR16: Practical route choices must grant safe, useful progression rewards without adding true flags or Oopsies.

FR17: True route choices must grant a true score, exactly one unique stage true flag, and a thoughtful reward or boss modifier.

FR18: Risky route choices must grant a stronger reward and may add Oopsies or hazard pressure without overriding Normal or True Ending resolution.

FR19: Route rewards must be functional gameplay rewards, not flavor-only text.

FR20: Endings must resolve Normal, True, and optional Risky Variant outcomes after King Bloxley based on route scores, true flags, and risky score.

FR21: The game must support a data-driven RouteStorySystem, DialogueSystem, ContentRegistry integration, and SaveSystem integration for route scenes, route endings, barks, voice tags, rewards, risks, boss callbacks, and endings.

FR22: The game must preserve cheerful hero-specific dialogue voices and reject generic dialogue that can be moved between heroes unchanged.

FR23: The game must support LocalStorage persistence for current run state, route progress, meta progress, settings, completed goals, active hazards, active Oopsies, boss rules, board modifiers, and unlocks.

FR24: The game must provide safe save migration, default values, normalization, corrupt-save fallback, clear save/new run flow, and refresh-safe continuation.

FR25: The content architecture must support data-driven categories for heroes, monsters, bosses, weapons, spells, relics, upgrades, board blocks, statuses, items, events, Oopsies, NPCs, currencies, collectibles, loot tables, stages, random gameplay events, stage goals, chaos rules, battle objectives, boss rules, board size modifiers, hub buildings, friendship, and hero passives.

FR26: Content JSON that contains gameplay effects must be paired with runtime handlers in the relevant systems.

FR27: Missing content, unsupported effects, missing images, missing animations, and missing audio must fall back safely without crashing gameplay.

FR28: The game must support reactive difficulty through incoming junk, floating blocks, bad piece delivery, low ceiling pressure, preview disruption, freeze/speed/sleep hazards, royal pattern warnings, route-triggered risk modifiers, and counter windows.

FR29: Every major hazard must have readable warning UI, at least one practical counter route, and no unavoidable instant-loss behavior.

FR30: Items, spells, relics, upgrades, hero passives, and cascades must provide counterplay tags or behavior for board hazards and enemy pressure where applicable.

FR31: Combat rooms may roll temporary chaos rules and battle mini-objectives, with rewards for success and non-harsh failures.

FR32: Stage goals must be visible at stage start, track progress during the route, and resolve before boss fights with clear success/failure consequences.

FR33: The map system must scale stage length and node composition by stage, including normal, elite, event, shop, rest, treasure, boss, and final-stage special pressure nodes as applicable.

FR34: Dynamic board size modifiers must support stage and encounter pressure while preserving block safety, Cascade Gravity, and portrait readability.

FR35: Room systems must support event, shop, rest, and treasure flows with cheerful choices, rewards, and return-to-map behavior.

FR36: The inventory and item systems must support consumable items, stack limits, battle usage, map/shop usage where applicable, reward integration, and reactive hazard counters.

FR37: Spell systems must support a Release 1 playable spell roster with visible costs, disabled states, damage, heal, shield, cleanup, reroll, cascade boost, slow/freeze, and gadget-style effects where scoped.

FR38: Reward, relic, and upgrade systems must support loot tables, stage-specific rewards, rarity weighting, rerolls, stacking rules, boss rewards, and runtime effect hooks.

FR39: The boss system must make each Release 1 boss mechanically visible enough to match its boss rule card.

FR40: The game must provide opening story, stage intros, boss intros, hero unlock dialogue, King Bloxley intro, normal endings, true endings, skippable dialogue, and story screens.

FR41: The audio system must support SFX hooks for line clear, cascade, spell cast, hit, reward, UI tap, shop, victory, defeat, and boss intro, with volume/mute settings and fallback behavior.

FR42: Settings must support volume, mute, vibration, screen shake, reduced flashing, colorblind-friendly symbols, text speed, left-handed controls, button size, grid toggle, and tutorial reset where feasible for Release 1.

FR43: Debug and QA tooling must remain dev-only and support stage jumps, monster/boss spawning, rewards, route events, hazard forcing, cascade tests, and save clearing.

FR44: The project must support Android/Capacitor packaging with web build output, portrait testing, touch controls, save/load, and asset path verification.

FR45: Store/release metadata must be produced before release, including descriptions, feature bullets, screenshot plan, trailer plan, app icon/feature graphic needs, privacy notes, credits/licenses, content rating notes, and IP-safe wording.

### NonFunctional Requirements

NFR1: The game must keep Phaser 3, TypeScript, Vite, and Capacitor for Release 1; engine migration or template reset is out of scope.

NFR2: The primary target is portrait mobile at approximately 720x1280, with desktop acting as a centered portrait preview.

NFR3: The runtime must preserve pixel-art rendering with pixelArt, roundPixels, and no antialiasing.

NFR4: Board, battle, input, warning tray, VFX, and animation hot paths must avoid allocation-heavy per-frame logic.

NFR5: Board logic must remain deterministic and grid-based so cascade, hazards, and smoke tests can be reproduced.

NFR6: Missing assets, missing content, missing animation frames, and missing audio must never crash the game.

NFR7: Fallback safety must not be treated as release readiness; missing final art/audio must remain visible in release tracking.

NFR8: Save compatibility is mandatory. New persistent fields require defaults, normalization, migration, and corrupt-save fallback.

NFR9: Scene/system boundaries must stay clear: systems compute state and scenes render/orchestrate UI, flow, input, and VFX.

NFR10: Phaser timers, tweens, input listeners, global events, scene events, and temporary GameObjects must clean up on scene shutdown or restart.

NFR11: Data-driven content must use stable IDs and runtime asset keys, not raw public asset paths.

NFR12: New asset files must use canonical public/assets folders and exact-frame PNG naming where animation frames are required.

NFR13: Player-facing text must preserve cheerful festival tone and avoid dark curse lore, gore, horror, edgy fantasy, hopeless apocalypse, or skull-heavy UI.

NFR14: Player-facing setbacks must use Oopsies, Silly Drawbacks, or Festival Mishaps instead of curses.

NFR15: Reactive hazards, route risks, and boss pressure must follow the shared fairness policy: warning first, counter window, no soft-lock, no impossible simultaneous pressure.

NFR16: Mobile UI must preserve board readability, visible controls, visible hold/next/inventory access, and tappable controls.

NFR17: Android validation must include app launch, portrait layout, touch controls, save/load, and asset path checks.

NFR18: Release claims must be backed by validation commands, deterministic smoke checks, manual smoke evidence, or implementation evidence from code.

NFR19: Development should optimize for a vibe-coder solo-dev workflow: small focused stories, low-churn changes, direct verification, and no speculative architecture.

### Additional Requirements

- No new starter template should be applied; the repo already has the needed project structure.
- Context7 MCP is recommended for current library documentation lookup; Phaser Editor v5 MCP is optional and only useful if using Phaser Editor.
- Architecture must extend the current Phaser scene/system architecture and avoid broad rewrites.
- BlockmancerGame remains the root composition owner for long-lived shared systems.
- ContentRegistry must remain the central content lookup and fallback point.
- AssetSystem must remain the central asset lookup and fallback point.
- AudioSystem must remain fallback-safe while final OGG/audio production remains tracked.
- New content categories require metadata, type contracts, registry configuration, validation, and runtime consumers.
- New save-facing IDs, route IDs, hero IDs, content IDs, asset keys, and persistent fields must not be renamed without migration.
- New release-risk systems should include DebugScene or equivalent forcing hooks when manual setup would be slow.
- Build and validation commands to preserve as verification paths include npm run build, validate:content, validate:metadata, validate:animations, sync:assets, audit:asset-variants, android:sync, and android:build:debug as relevant.
- The current release implementation source identifies P0/P1 stabilization risks: missing automated tests or smoke harness, missing lint/test script policy, manual smoke not run, missing final animation frames, placeholders, missing audio, partial effect handlers, and shallow boss mechanics.
- Release 1 planning must prioritize stabilization over broad expansion: Cascade Gravity tests, save migration tests, route choice/reward/risk tests, route endings, portrait-mobile smoke, content effect coverage, boss mechanic verification, final asset/audio tracking, and Android smoke.
- Hub progression and monster friendship should be explicitly scoped as Release 1 core, visible-lite, or post-release backlog before implementation stories are generated.
- Two extra heroes beyond the six route heroes must be explicitly scoped as unlockable extras, hidden content, or backlog.

### UX Design Requirements

UX-DR1: The battle screen must use the canonical three-section portrait layout and avoid overlap between combat, puzzle, and control areas.

UX-DR2: The event log must remain inside the combat area and must not cover the board, Hold, Next Queue, inventory, or controls.

UX-DR3: The board must remain central, readable, and stable across desktop preview and portrait mobile.

UX-DR4: Hold and Next Queue must remain visible, with the Next Queue showing four upcoming pieces when space allows.

UX-DR5: Right-rail stats must communicate Fever, Combo, Cascade, Lines, Score, Next Attack, and Target Effect compactly.

UX-DR6: Falling-block controls and spell/action controls must remain visible, thumb-friendly, and understandable on mobile.

UX-DR7: Dialogue, route choices, boss cards, warnings, and rewards must use mobile-readable text and support skippable or compact presentation.

UX-DR8: Boss rule cards must be readable before combat and clearly explain the gimmick and player tip.

UX-DR9: Hazard warnings must show the hazard name/icon, countdown or timing, effect, available item counters, available spell counters, and cascade hints without blocking the board.

UX-DR10: Spell and item buttons must show cost, availability, disabled state, and active catalyst/counter context where practical.

UX-DR11: Reward cards, shop choices, event choices, and inventory panels must be readable on portrait mobile and return cleanly to the main flow.

UX-DR12: Route dialogue choice cards must distinguish Practical, True, and Risky choices clearly through labels, tone, result text, and reward/risk feedback.

UX-DR13: Settings and accessibility controls must expose audio, flashing, screen shake, left-handed controls, button sizing, text speed, symbols, grid, and tutorial reset options where implemented.

UX-DR14: Missing visual assets must fall back to safe placeholder visuals without breaking UX flow, while release tracking still identifies them as unfinished.

### FR Coverage Map

FR1: Epic 1 - Core product identity and playable battle experience.
FR2: Epic 1 - Cascade Gravity board behavior.
FR3: Epic 1 - Cascade combat rewards.
FR4: Epic 1 - Portrait battle layout structure.
FR5: Epic 1 - Combat panel information and feedback.
FR6: Epic 1 - Puzzle area readability and support panels.
FR7: Epic 1 - Mobile controls and spell/action rows.
FR8: Epic 2 - Six Release 1 stages.
FR9: Epic 2 - Stage-specific content, goals, hazards, and bosses.
FR10: Epic 2 - Boss rule cards and boss readability.
FR11: Epic 3 - Six core route heroes and distinct passives.
FR12: Epic 3 - Hero unlock direction.
FR13: Epic 3 - 36 unique hero-stage route scenes.
FR14: Epic 3 - Route scene structure and fallback.
FR15: Epic 3 - Route progress state.
FR16: Epic 3 - Practical route choice behavior.
FR17: Epic 3 - True route choice behavior.
FR18: Epic 3 - Risky route choice behavior.
FR19: Epic 3 - Functional route rewards.
FR20: Epic 3 - Normal, True, and Risky Variant ending resolution.
FR21: Epic 3 - RouteStorySystem, DialogueSystem, ContentRegistry, and SaveSystem integration.
FR22: Epic 3 - Distinct hero voice and route dialogue quality.
FR23: Epic 5 - LocalStorage persistence for run, route, meta, settings, hazards, and unlocks.
FR24: Epic 5 - Save migration, normalization, corrupt-save fallback, and continue/new-run flow.
FR25: Epic 4 - Data-driven content categories.
FR26: Epic 4 - Runtime handlers for effect-bearing content.
FR27: Epic 6 - Fallback safety and release-readiness tracking.
FR28: Epic 4 - Reactive difficulty systems.
FR29: Epic 4 - Hazard warning and fairness behavior.
FR30: Epic 4 - Counterplay through items, spells, relics, upgrades, passives, and cascades.
FR31: Epic 2 - Chaos rules and battle mini-objectives in combat rooms.
FR32: Epic 2 - Stage goals and boss consequence resolution.
FR33: Epic 2 - Stage-scaled map structure.
FR34: Epic 2 - Dynamic board size modifiers by stage/encounter.
FR35: Epic 2 - Event, shop, rest, and treasure room flows.
FR36: Epic 4 - Inventory and item systems.
FR37: Epic 4 - Release 1 spell roster and spell button states.
FR38: Epic 4 - Rewards, relics, upgrades, loot tables, and boss rewards.
FR39: Epic 2 - Visible boss mechanics.
FR40: Epic 3 - Story, intros, dialogue, and endings.
FR41: Epic 5 - Audio hooks, mute, volume, and audio fallback.
FR42: Epic 5 - Settings and accessibility options.
FR43: Epic 6 - Dev-only debug and QA tooling.
FR44: Epic 6 - Android/Capacitor packaging and validation.
FR45: Epic 6 - Store/release metadata.

## Epic List

### Epic 1: Core Battle Experience

Players can start a readable portrait-mobile battle, place blocks, trigger Cascade Gravity, deal damage, gain mana, and use visible controls.

**FRs covered:** FR1-FR7

**Implementation notes:** Protect `BoardSystem`, `CombatSystem`, `BattleScene`, `InputSystem`, `MobileControls`, and portrait layout. This epic must not broaden into route/story, progression, or release packaging.

### Epic 2: Complete Six-Stage Dungeon Run

Players can progress through all six stages with maps, stage goals, encounters, room types, bosses, boss rule cards, and final run completion.

**FRs covered:** FR8-FR10, FR31-FR35, FR39

**Implementation notes:** Deliver the playable run structure end-to-end before polishing optional systems. Keep stage goals, room flow, boss cards, and boss mechanics visible and testable.

### Epic 3: Heroes, Routes, Story, and Endings

Players can choose the six Release 1 heroes, experience unique route scenes, make Practical/True/Risky choices, trigger boss callbacks, and unlock Normal/True/Risky endings.

**FRs covered:** FR11-FR22, FR40

**Implementation notes:** Route progress, dialogue, choices, rewards, boss callbacks, endings, and hero voice QA should be handled together to avoid repeated churn through the same route/story files.

### Epic 4: Tactical Rewards, Content, and Counterplay

Players can build runs through items, spells, relics, upgrades, loot, reactive hazards, Oopsies, battle objectives, and fair counterplay systems.

**FRs covered:** FR25-FR30, FR36-FR38

**Implementation notes:** Keep content, runtime handlers, validation, and smoke/debug hooks paired. Do not add JSON-only gameplay effects without an explicit runtime consumer.

### Epic 5: Save, Meta Progress, Settings, Audio, and Accessibility

Players can safely continue runs, keep unlocks/meta progress, recover from corrupt saves, adjust settings, hear feedback, and use accessibility options.

**FRs covered:** FR23-FR24, FR41-FR42

**Implementation notes:** Treat save compatibility as a release blocker. Settings/audio/accessibility belong here because they share persistent player preference and device-readiness behavior.

### Epic 6: Release Readiness, QA, Assets, and Distribution

Players get a stable release candidate with fallback-safe assets/audio, dev-only QA tools, Android packaging support, and store/release metadata.

**FRs covered:** FR27, FR43-FR45

**Implementation notes:** This epic converts fallback-safe implementation into release evidence: validation, smoke checks, asset/audio tracking, Android packaging, and release/store docs.

## Epic 1: Core Battle Experience

Players can start a readable portrait-mobile battle, place blocks, trigger Cascade Gravity, deal damage, gain mana, and use visible controls.

### Story 1.1: Start a Portrait Battle

**FRs:** FR1, FR4, FR5, FR6, FR7

As a player,
I want to enter a battle with the canonical portrait layout,
So that I can immediately understand combat, board play, and controls.

**Acceptance Criteria:**

**Given** a new or continued run can enter combat
**When** the battle scene opens
**Then** the combat area, puzzle area, and controls area use the 25/55/20 portrait split
**And** hero/enemy status, event log, board, Hold, Next Queue, right-rail stats, and controls are visible without overlap.

### Story 1.2: Place Pieces With Core Controls

**FRs:** FR6, FR7

As a player,
I want responsive movement, rotation, drop, and hold controls,
So that I can play the falling-block board on keyboard and touch.

**Acceptance Criteria:**

**Given** a battle is active with a falling piece
**When** I use move, rotate, soft drop, hard drop, or hold
**Then** the piece responds correctly through keyboard and mobile controls
**And** invalid moves fail safely without corrupting the board.

### Story 1.3: Resolve Cascade Gravity

**FRs:** FR2

As a player,
I want cleared lines to cascade by column,
So that the board identity feels distinct from classic row shifting.

**Acceptance Criteria:**

**Given** a placed piece completes one or more lines
**When** line resolution runs
**Then** completed cells are removed, blocks fall deterministically within their columns, new completed lines are detected, and resolution repeats until stable
**And** a CascadeResult records total lines, cascade count, cleared lines per cascade, dropped blocks, special triggers, and combo status.

### Story 1.4: Convert Cascades Into Combat Rewards

**FRs:** FR3

As a player,
I want cascades to damage enemies and grant mana,
So that board mastery directly affects combat.

**Acceptance Criteria:**

**Given** a CascadeResult is produced
**When** combat resolves the clear
**Then** damage uses the correct cascade multiplier and mana gain includes the cascade bonus
**And** event log feedback explains the result in cheerful player-facing language.

### Story 1.5: Keep Battle UI Readable Under Pressure

**FRs:** FR4, FR5, FR6, FR7

As a mobile player,
I want battle feedback to stay readable while effects happen,
So that I can react without the UI hiding important board information.

**Acceptance Criteria:**

**Given** damage numbers, VFX, cascade callouts, enemy intent, status chips, and log entries are active
**When** the battle updates on portrait mobile
**Then** feedback remains inside its assigned layout area
**And** the board, Hold, Next Queue, inventory access, spell buttons, and controls remain tappable and visible.

## Epic 2: Complete Six-Stage Dungeon Run

Players can progress through all six stages with maps, stage goals, encounters, room types, bosses, boss rule cards, and final run completion.

### Story 2.1: Generate Stage Map Progression

**FRs:** FR8, FR9, FR33

As a player,
I want each stage to present a readable route map,
So that I can choose encounters and progress toward the boss.

**Acceptance Criteria:**

**Given** a run enters a stage
**When** the map is generated
**Then** the stage uses the correct node count and required node mix for its depth
**And** boss nodes are final required nodes, elite nodes start from Stage 2, and Stage 6 includes final-stage pressure.

### Story 2.2: Track Stage Goals

**FRs:** FR9, FR32

As a player,
I want each stage to show and track its stage goal,
So that my route decisions affect the boss fight.

**Acceptance Criteria:**

**Given** a stage begins
**When** I view the stage banner, fight rooms, or reach the boss
**Then** the stage goal is visible, progress updates during play, and success/failure resolves before the boss
**And** failure creates a fair drawback rather than an instant loss.

### Story 2.3: Play Non-Combat Rooms

**FRs:** FR31, FR35

As a player,
I want event, shop, rest, and treasure rooms to work during a run,
So that dungeon routes offer decisions beyond combat.

**Acceptance Criteria:**

**Given** the map contains a non-combat node
**When** I enter an event, shop, rest, or treasure room
**Then** the room presents clear choices, applies rewards or costs, saves meaningful changes, and returns me to the map
**And** missing content falls back safely.

### Story 2.4: Show Boss Rule Cards

**FRs:** FR10

As a player,
I want every boss to explain its rule before combat,
So that boss fights feel readable and fair.

**Acceptance Criteria:**

**Given** I enter a boss node
**When** the boss encounter starts
**Then** a boss rule card shows the boss name, rule, player tip, and fairness note
**And** the card can be dismissed into battle without blocking normal play.

### Story 2.5: Implement Visible Boss Mechanics

**FRs:** FR9, FR10, FR39

As a player,
I want each boss to behave differently,
So that every stage has a distinct climax.

**Acceptance Criteria:**

**Given** I fight any Release 1 boss
**When** the boss uses its stage mechanic
**Then** the mechanic is visible in UI/log/board behavior and matches the rule card
**And** unsupported boss behavior uses a safe placeholder with developer-visible warning.

### Story 2.6: Complete a Full Run

**FRs:** FR8, FR33, FR34, FR35

As a player,
I want to progress from Stage 1 through King Bloxley,
So that a run has a complete beginning, middle, and ending trigger.

**Acceptance Criteria:**

**Given** I clear each stage boss in order
**When** I defeat King Bloxley
**Then** the run transitions to the appropriate victory/ending flow
**And** run completion updates save/meta state without losing existing progress.

## Epic 3: Heroes, Routes, Story, and Endings

Players can choose the six Release 1 heroes, experience unique route scenes, make Practical/True/Risky choices, trigger boss callbacks, and unlock Normal/True/Risky endings.

### Story 3.1: Choose a Release 1 Hero

**FRs:** FR11, FR12

As a player,
I want to choose one of the six route heroes,
So that my run has a distinct passive and story route.

**Acceptance Criteria:**

**Given** I start a new run
**When** I choose Milo, Pippa, Nixie, Bruk, Zuzu, or Lumi
**Then** the run stores the active hero, applies that hero's passive, and initializes route progress
**And** unavailable heroes show clear unlock requirements.

### Story 3.2: Trigger Unique Hero-Stage Route Scenes

**FRs:** FR13, FR14, FR21, FR22

As a player,
I want my selected hero to encounter unique route scenes in each stage,
So that replaying the same dungeon feels different by hero.

**Acceptance Criteria:**

**Given** a run has an active route hero and enters a stage route trigger
**When** the route system selects a scene
**Then** it uses the correct unique hero-stage scene and does not reuse a generic event
**And** triggered scenes are recorded to prevent accidental repeat triggers.

### Story 3.3: Resolve Practical, True, and Risky Choices

**FRs:** FR15, FR16, FR17, FR18, FR19

As a player,
I want route choices to affect story and gameplay,
So that my decisions matter during the run.

**Acceptance Criteria:**

**Given** a route scene presents Practical, True, and Risky choices
**When** I choose one lane
**Then** the correct route score, true flag, reward, risk, and result text are applied
**And** Risky results follow warning/counter/no-soft-lock fairness rules.

### Story 3.4: Apply Route Boss Callbacks

**FRs:** FR14, FR19, FR21

As a player,
I want bosses to react to my route choices,
So that story decisions visibly affect stage climaxes.

**Acceptance Criteria:**

**Given** I made a route choice before a boss
**When** the boss encounter starts
**Then** the route callback text and configured boss modifier apply once
**And** missing callback data falls back safely without blocking the boss fight.

### Story 3.5: Resolve Character Endings

**FRs:** FR20, FR21

As a player,
I want my hero's route progress to determine the ending,
So that route completion feels meaningful.

**Acceptance Criteria:**

**Given** I defeat King Bloxley with a route hero
**When** ending resolution runs
**Then** Normal, True, and optional Risky Variant outcomes resolve from scores, true flags, and risky score
**And** unlocked endings persist in meta progress after refresh.

### Story 3.6: Preserve Polished Story Tone

**FRs:** FR22, FR40

As a player,
I want route dialogue to match each hero's voice,
So that story scenes feel characterful and festival-bright.

**Acceptance Criteria:**

**Given** route, intro, boss, or ending dialogue is displayed
**When** the text appears on portrait mobile
**Then** it uses cheerful polished wording, distinct hero voice, readable line lengths, and skippable presentation
**And** no player-facing text uses dark curse lore or generic interchangeable hero voice.

## Epic 4: Tactical Rewards, Content, and Counterplay

Players can build runs through items, spells, relics, upgrades, loot, reactive hazards, Oopsies, battle objectives, and fair counterplay systems.

### Story 4.1: Enforce Content Runtime Contracts

**FRs:** FR25, FR26

As a developer maintaining player-facing content,
I want effect-bearing content to have runtime handlers,
So that validated JSON cannot silently do nothing.

**Acceptance Criteria:**

**Given** new or existing content contains gameplay effect fields
**When** validation or runtime lookup processes the content
**Then** each effect has an explicit supported handler or safe unsupported warning
**And** content loads through ContentRegistry with fallback IDs.

### Story 4.2: Use Inventory Items In Battle

**FRs:** FR30, FR36

As a player,
I want to use consumable items during battle,
So that I can respond to hazards and recover from pressure.

**Acceptance Criteria:**

**Given** I have items in inventory during battle
**When** I open inventory and use a valid item
**Then** stack counts, target effects, battle state, UI feedback, and save state update correctly
**And** invalid timing or missing item data fails safely with clear feedback.

### Story 4.3: Cast Release 1 Spells

**FRs:** FR30, FR37

As a player,
I want spells with visible costs and effects,
So that mana decisions change battle outcomes.

**Acceptance Criteria:**

**Given** I have spell slots and enough or insufficient mana
**When** I view and cast spells
**Then** spell buttons show cost/disabled state and supported spells apply damage, healing, shield, cleanup, reroll, cascade, slow/freeze, or gadget effects as scoped
**And** unsupported spells are hidden, disabled, or developer-warned rather than presented as complete.

### Story 4.4: Apply Loot, Relics, and Upgrades

**FRs:** FR25, FR26, FR38

As a player,
I want rewards to change my run build,
So that battles and route choices create meaningful progression.

**Acceptance Criteria:**

**Given** I clear combat, treasure, event, boss, or shop reward flow
**When** rewards are generated and selected
**Then** loot tables, rarity, stage theme, rerolls, gold, items, relics, and upgrades apply through runtime systems
**And** selected rewards persist in the current run.

### Story 4.5: Resolve Reactive Hazards With Counterplay

**FRs:** FR28, FR29, FR30

As a player,
I want hazards to warn me before they punish me,
So that difficulty feels fair and tactical.

**Acceptance Criteria:**

**Given** incoming junk, floating blocks, freeze, preview disruption, low ceiling, bad piece, speed wave, sleep, or royal pattern pressure is queued
**When** the hazard becomes active
**Then** warning UI shows the hazard, countdown, effect, counters, and cascade hints
**And** items, spells, relics, passives, or cascades can resolve or soften the hazard where supported.

### Story 4.6: Support Oopsies and Battle Objectives

**FRs:** FR28, FR29, FR31

As a player,
I want optional setbacks and objectives to create variety,
So that runs feel replayable without unfair spikes.

**Acceptance Criteria:**

**Given** a combat room can roll an Oopsie, chaos rule, random event, or mini-objective
**When** it activates or resolves
**Then** the effect is readable, temporary or saved as designed, and offers fair reward/consequence handling
**And** no combination creates an unavoidable soft-lock.

## Epic 5: Save, Meta Progress, Settings, Audio, and Accessibility

Players can safely continue runs, keep unlocks/meta progress, recover from corrupt saves, adjust settings, hear feedback, and use accessibility options.

### Story 5.1: Save and Continue Current Runs

**FRs:** FR23, FR24

As a player,
I want my current run to survive refresh or app restart,
So that I can continue progress safely.

**Acceptance Criteria:**

**Given** I make meaningful run progress
**When** the game saves and reloads
**Then** hero, stage, map, board-relevant state, inventory, rewards, route progress, hazards, Oopsies, settings, and run status restore or normalize safely
**And** corrupt save data falls back without crashing.

### Story 5.2: Persist Meta Progress and Unlocks

**FRs:** FR23, FR24

As a player,
I want unlocks and endings to persist across runs,
So that long-term progress matters.

**Acceptance Criteria:**

**Given** I unlock a hero, ending, badge, meta reward, tutorial state, or collection progress
**When** I return to the menu after refresh
**Then** meta progress reflects the unlock
**And** older save versions migrate to current defaults safely.

### Story 5.3: Configure Settings and Accessibility

**FRs:** FR42

As a player,
I want settings that fit my device and needs,
So that I can play comfortably.

**Acceptance Criteria:**

**Given** I open settings
**When** I change volume, mute, vibration, screen shake, reduced flashing, color symbols, text speed, left-handed controls, button size, grid, or tutorial reset options
**Then** settings apply immediately where practical and persist after reload
**And** unsupported settings are not shown as complete.

### Story 5.4: Play Audio Feedback Safely

**FRs:** FR41

As a player,
I want sound feedback for important actions,
So that the game feels responsive without audio crashes.

**Acceptance Criteria:**

**Given** line clears, cascades, spells, hits, rewards, UI taps, shops, victory, defeat, or boss intro events occur
**When** audio is enabled
**Then** the correct SFX/music hook plays or falls back safely
**And** mute and volume settings are respected.

### Story 5.5: Verify Save and Settings Smoke Paths

**FRs:** FR23, FR24, FR41, FR42

As a developer preparing release,
I want deterministic smoke checks for save and settings behavior,
So that regressions are caught before release.

**Acceptance Criteria:**

**Given** save, meta, settings, audio, or accessibility code changes
**When** the relevant smoke or manual checklist runs
**Then** continue, new run, corrupt save, migration, settings persistence, and audio fallback are verified
**And** failures are documented before claiming completion.

## Epic 6: Release Readiness, QA, Assets, and Distribution

Players get a stable release candidate with fallback-safe assets/audio, dev-only QA tools, Android packaging support, and store/release metadata.

### Story 6.1: Add Dev-Only QA Tools

**FRs:** FR43

As a developer testing the game,
I want fast dev-only controls for hard-to-reach states,
So that route, boss, hazard, reward, and save paths can be verified.

**Acceptance Criteria:**

**Given** the game runs in development mode
**When** I open debug tools
**Then** I can jump stages, spawn monsters/bosses, grant rewards, trigger route scenes, force hazards, run cascade tests, and clear saves
**And** debug tools are unavailable or redirected in production.

### Story 6.2: Track Asset and Audio Release Readiness

**FRs:** FR27

As a release owner,
I want fallback-safe assets separated from final production readiness,
So that missing art/audio is visible before release.

**Acceptance Criteria:**

**Given** asset, animation, or audio validation runs
**When** missing final frames, placeholders, optional variants, or fallback audio are detected
**Then** gameplay remains safe while the release checklist records the gap
**And** canonical public/assets folder and exact-frame naming rules are enforced for new assets.

### Story 6.3: Run Validation and Smoke Gates

**FRs:** FR27, FR43

As a release owner,
I want repeatable validation gates,
So that each release candidate has evidence behind it.

**Acceptance Criteria:**

**Given** a release-readiness pass starts
**When** validation and smoke commands are run
**Then** content, metadata, animations, asset sync, asset variants, build, and relevant smoke/manual checks are recorded
**And** sandbox-only build limitations are documented separately from project defects.

### Story 6.4: Prepare Android Packaging

**FRs:** FR44

As a mobile player,
I want the game to launch and play correctly on Android,
So that portrait mobile is a real supported target.

**Acceptance Criteria:**

**Given** the web build exists and Capacitor is configured
**When** Android sync/build validation runs
**Then** the app uses the correct webDir, launches in portrait, preserves touch controls, save/load, and asset paths
**And** any SDK/device blockers are documented with exact commands.

### Story 6.5: Produce Release and Store Metadata

**FRs:** FR45

As a release owner,
I want complete release metadata,
So that the game can be packaged, reviewed, and presented accurately.

**Acceptance Criteria:**

**Given** the game is approaching release candidate
**When** release metadata is created
**Then** descriptions, feature bullets, screenshot plan, trailer plan, app icon/feature graphic needs, privacy notes, credits/licenses, content rating notes, support contact placeholder, and IP-safe wording are documented
**And** copy reflects the cheerful festival identity without trademark-risk language.

### Story 6.6: Prepare Release Candidate

**FRs:** FR27, FR43, FR44, FR45

As a release owner,
I want a final release candidate checklist,
So that known blockers, validation status, Android status, and remaining risks are explicit.

**Acceptance Criteria:**

**Given** all previous release stories are complete or consciously deferred
**When** a release candidate is prepared
**Then** version status, build status, validation status, QA checklist result, Android status, release notes, and known issues are documented
**And** no fallback-safe placeholder is accidentally marked as final production quality.
