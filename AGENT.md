# AGENT.md — Blockmancer Dungeon — Updated Release 1.0 Agent Guide

Instructions for AI coding agents working on **Blockmancer Dungeon**.

This file defines the project context, coding rules, architecture expectations, content direction, implementation workflow, and Definition of Done.

This updated version also includes the new **Festival Chaos & Replayability** direction: random gameplay events, stage goals, map-node scaling, dynamic board-size modifiers, chaos rules, battle mini-objectives, boss rule cards, risk/reward oopsie choices, hero-specific passives, festival hub progression, and monster friendship / collection.

---

## 1. Project Identity

**Game Title:** Blockmancer Dungeon

**Genre:** Cheerful falling-block roguelike RPG

**Platform Target:**

- Primary: Mobile portrait web game
- Secondary: Android APK/AAB through Capacitor
- Development preview: Desktop browser

**Core Concept:**

Blockmancer Dungeon is a cheerful portrait-mobile falling-block roguelike RPG where a magical festival machine called the **Block-O-Matic 3000** goes haywire and creates a colorful dungeon beneath the town square.

The player clears rune block lines, triggers **Cascade Gravity** combos, casts silly spells, collects snacks, relics, upgrades, and unlocks quirky heroes while trying to save the **Festival of Falling Stars** from **King Bloxley**, the self-appointed Block King.

**Core Fantasy:**

The player is not saving the world from doom.  
The player is saving a magical festival from becoming a giant blocky mess.

**Core Theme:**

> Creativity fixes chaos better than control.

---

## 2. Tone and Creative Direction

Always keep the game tone:

```text
Cheerful fantasy
Cute chaos
Festival adventure
Funny monsters
Cozy arcade energy
Bright 32-bit pixel-art style
Lighthearted dungeon crawl
```

Avoid:

```text
Dark edgy horror
Grim curse lore
Heavy tragedy
Realistic gore
Hopeless apocalypse
Skull-heavy UI
Overly serious villain writing
```

Preferred references for tone, without copying:

```text
Paper Mario humor
Mario RPG energy
Puyo Puyo silliness
Fantasy Life coziness
Lighthearted arcade roguelike
```

---

## 3. Main Gameplay Pillars

All gameplay decisions should support these pillars:

```text
1. Falling-block puzzle board
2. Cascade Gravity as core identity
3. Combat through line clears and cascades
4. Mana and silly spell casting
5. Roguelike map progression
6. Cheerful monsters and bosses
7. Mobile portrait readability
8. Quick runs with unlockable heroes
9. Data-driven content
10. Safe fallback for missing assets/content
11. Random gameplay events that affect board/combat/rewards/stage progress
12. Stage goals that create optional side missions
13. Festival Chaos Rules that vary each combat room
14. Battle mini-objectives that reward skillful play
15. Dynamic board size changes by stage, encounter, event, and boss phase
16. Meta-progression through festival hub restoration
17. Monster friendship / collection that supports the cute festival tone
```

---

## 4. Tech Stack

Selected Release 1.0 stack:

```text
Phaser 3
TypeScript
Vite
Capacitor Android
HTML/CSS
LocalStorage
No backend for Release 1.0
```

Engine decision:

```text
Use Phaser 3 + TypeScript + Vite for gameplay and web builds.
Use Capacitor for Android APK/AAB packaging.
Keep game logic modular and content data-driven.
Do not migrate to Unity, Godot, or another engine unless explicitly requested.
```

Do not introduce a backend unless explicitly requested.

Do not add large dependencies unless clearly justified. Prefer small TypeScript systems and JSON/config content over framework-heavy solutions.

---

## 5. Target Project Structure

Prefer this structure or adapt existing files toward it gradually.

```text
blockmancer-dungeon/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  capacitor.config.ts
  README.md

  docs/
    GDD.md
    TECHNICAL_DESIGN.md
    GAMEPLAY_SYSTEMS.md
    BALANCE_AND_PROGRESSION.md
    ASSET_PIPELINE.md
    BUILD_APK.md
    QA_TEST_PLAN.md
    RELEASE_1_GAP_AUDIT.md
    RELEASE_1_0_NOTES.md

  public/assets/
    ui/
    board/
    board-blocks/
    board-preview/
    heroes/
    monsters/
    bosses/
    spells/
    relics/
    upgrades/
    items/
    weapons/
    status-effects/
    oopsies/
    npc/
    stages/
    map/
    effects/
    inventory/
    shop/
    rewards/
    story/
    branding/

  scripts/
    validate-content-data.mjs
    validate-content-metadata.mjs

  src/
    main.ts
    styles.css

    game/
      BlockmancerGame.ts

      scenes/
        BootScene.ts
        MainMenuScene.ts
        HeroSelectScene.ts
        BattleScene.ts
        MapScene.ts
        RewardScene.ts
        EventScene.ts
        ShopScene.ts
        RestScene.ts
        TreasureScene.ts
        BossIntroScene.ts
        HubScene.ts
        MonsterCollectionScene.ts
        TutorialScene.ts
        SettingsScene.ts
        GameOverScene.ts
        VictoryScene.ts

      systems/
        AssetSystem.ts
        AudioSystem.ts
        BoardSystem.ts
        BoardSizeModifierSystem.ts
        CombatSystem.ts
        ContentRegistry.ts
        DifficultySystem.ts
        EnemySystem.ts
        EventSystem.ts
        RandomGameplayEventSystem.ts
        StageGoalSystem.ts
        ChaosRuleSystem.ts
        BattleObjectiveSystem.ts
        BossRuleSystem.ts
        FeverSystem.ts
        HeroSystem.ts
        HubProgressionSystem.ts
        FriendshipSystem.ts
        InputSystem.ts
        InventorySystem.ts
        ItemSystem.ts
        MapSystem.ts
        OopsieSystem.ts
        RelicSystem.ts
        RewardSystem.ts
        SaveSystem.ts
        ShopSystem.ts
        SpellSystem.ts
        StageSystem.ts
        TutorialSystem.ts
        UpgradeSystem.ts
        WeaponSystem.ts

      content/
        heroes/
        weapons/
        monsters/
        bosses/
        spells/
        relics/
        upgrades/
        board-blocks/
        status-effects/
        items/
        oopsies/
        room-events/
        npc/
        currencies/
        collectibles/
        stages/
        loot-tables/
        difficulty-scaling/
        random-gameplay-events/
        stage-goals/
        chaos-rules/
        battle-objectives/
        boss-rules/
        board-size-modifiers/
        hub-buildings/
        friendship/

      data/
        assets.ts
        constants.ts
        defaultRunState.ts

      types/
        GameTypes.ts
        ContentTypes.ts

      ui/
        Hud.ts
        EventLog.ts
        Button.ts
        MobileControls.ts
        RewardCard.ts
        InventoryPanel.ts
        StageGoalPanel.ts
        ChaosRuleBadge.ts
        BattleObjectivePanel.ts
        BossRuleCard.ts
        OopsieBadge.ts
        HubUpgradeCard.ts
        MonsterFriendshipCard.ts

      utils/
        random.ts
        math.ts
        ids.ts
```

---

## 6. Core Layout Requirement

The game is **portrait mobile first**.

Use this screen layout:

```text
Top 1/5:
- Battle screen
- Compact JRPG-style combat area
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

Rules:

```text
- Do not design primarily for landscape.
- Desktop preview may exist, but mobile portrait is the source of truth.
- Do not hide next block, hold block, or inventory permanently.
- Touch targets must be large enough for thumbs.
- Keep board readable and central.
```

---

## 7. Cascade Gravity Requirement

This is the main mechanic. Do not replace it with classic Tetris-style row shifting.

### Required Behavior

When a line clears:

```text
1. Detect completed lines.
2. Remove cells in completed lines.
3. Apply grid-based gravity.
4. Blocks above fall downward within their columns.
5. Detect new completed lines.
6. Repeat until board is stable.
7. Return CascadeResult.
```

### Important Rules

```text
- Do not use a real physics engine.
- Use deterministic grid-based gravity.
- Keep movement predictable and fair.
- Cascades should trigger damage, mana, combo, fever, and VFX.
```

### Required Type

```ts
export type CascadeResult = {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  specialBlocksTriggered: string[];
  causedCombo: boolean;
};
```

### Suggested Functions

```ts
detectCompletedLines(): number[];
removeCompletedLines(lines: number[]): void;
applyCascadeGravity(): CascadeGravityResult;
resolveCascadeClears(): CascadeResult;
calculateCascadeReward(result: CascadeResult): CombatReward;
```

### Suggested Balance

```text
Cascade 1: 100% damage
Cascade 2: 125% damage
Cascade 3: 150% damage
Cascade 4+: 200% damage
Cascade mana bonus: 50% of normal mana gain
```

---

## 8. Content Direction

Release 1.0 content should follow the cheerful festival concept.

### Stages

```text
1. Sprinkle Sewers
2. Goblin Workshop
3. Frosty Pantry
4. Pillow Castle
5. Starfall Arcade
6. Bloxley’s Block Palace
```

### Final Boss

```text
King Bloxley
```

### Playable Heroes

```text
Milo — balanced starter
Pippa — fire/spell damage
Nixie — control/slow
Bruk — high HP/defense
Zuzu — bomb/board chaos
Lumi — mana/cascade
```

### Release 1.0 Content Target

```text
6 stages
6 bosses
36 regular monsters
6 playable heroes
10 weapons
15 spells
15 relics
15 upgrades
15 board block types
10 consumable items
8 oopsies / silly drawbacks
8 room events
8 NPCs
12+ loot tables
```


---

## 8A. Festival Chaos & Replayability Direction

The updated Release 1.0 direction adds a dedicated replayability layer. These systems should be implemented as **Milestone C+ — Festival Chaos & Replayability**, ideally after the core run structure exists.

### New Replayability Systems

Preferred systems:

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

Preferred content folders:

```text
src/game/content/random-gameplay-events/
src/game/content/stage-goals/
src/game/content/chaos-rules/
src/game/content/battle-objectives/
src/game/content/boss-rules/
src/game/content/board-size-modifiers/
src/game/content/hub-buildings/
src/game/content/friendship/
```

### Random Gameplay Events

Random gameplay events can trigger during battle start, piece count, enemy turn, map-node entry, event choice, or boss phase.

They may affect:

```text
- board state
- active/next/hold piece behavior
- fall speed
- enemy intent or enemy action
- rewards
- stage goal progress
- boss difficulty
- board size
```

Initial random events to support:

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

Random event rules:

```text
- Stage 1-2: max 1 active random gameplay event at a time.
- Stage 3-4: max 1-2 active events depending on node type.
- Stage 5-6: allow up to 2 overlapping events, especially elite/boss rooms.
- Events must be weighted and filtered by stage and node type.
- Events must be explained in the event log or a compact battle toast.
- Events must never soft-lock the player.
```

### Stage Goals

Each stage should have one optional goal that can affect boss difficulty, reward quality, true-ending progress, or stage completion quality.

```text
Stage 1: Recover 3 Lost Cupcakes
Stage 2: Disable 2 Goblin Machines
Stage 3: Save 3 Ice Cream Crates
Stage 4: Keep 2 Guards Asleep
Stage 5: Reach combo score target
Stage 6: Break 3 Royal Seals
```

Rules:

```text
- Show the stage goal at stage start and on the map.
- Track progress through battles, events, and node choices.
- Resolve success/failure before the boss fight.
- Success should usually weaken the boss or improve rewards.
- Failure should add pressure but not make the boss unfair.
```

### Festival Chaos Rules

Festival Chaos Rules are room-level modifiers rolled at eligible battle start.

Initial chaos rules:

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

Rules:

```text
- Combat can roll 0-1 chaos rule.
- Chaos rules are weighted by stage and node type.
- Chaos rules must display in battle HUD.
- Chaos rules should end cleanly after the room.
```

### Battle Mini-Objectives

Battle mini-objectives are optional skill goals during combat.

Initial objectives:

```text
Trigger 1 cascade.
Clear 2 lines with one piece.
Clear 5 sprinkle blocks.
Destroy all junk blocks.
Win without using a spell.
Win before enemy attacks 3 times.
Use Hold at least once.
Cast 2 spells in one battle.
End battle with board below 50% height.
Trigger Fever before victory.
```

Rules:

```text
- Combat can roll 0-1 mini-objective.
- Objective progress should update live or after key actions.
- Success gives a small reward.
- Failure should usually have no harsh penalty.
```

### Boss Rule Cards

Boss Rule Cards explain boss gimmicks before combat.

```text
Cupcake Slime King: Sticky blocks spread if ignored.
Prototype No. 7: The machine drops junk or bombs every few pieces.
Gelato Golem: Board freezes during cold waves.
Sir Snore-a-Lot: Sleeps, shields, then wakes stronger.
High Score Hydra: Low combo play makes the Hydra stronger.
King Bloxley: Symmetry patterns and royal blocks must be managed.
```

Rules:

```text
- Boss card appears before boss combat.
- Card can be dismissed.
- Boss mechanic must match the card.
- Card must be readable on mobile.
```

### Hero-Specific Passives

Each hero should change how the board or combat feels.

```text
Milo: First cascade each battle gives bonus mana.
Pippa: Fire spells burn sticky/junk blocks.
Nixie: Once per room, can slow fall speed or reduce speed spike.
Bruk: Survive board overflow once per battle or gain emergency shield.
Zuzu: Bomb blocks appear more often, but junk also increases slightly.
Lumi: Star blocks boost cascade damage heavily.
```

### Festival Hub Progression

After a run, the player can restore festival booths for meta-progression.

Initial hub buildings:

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

Hub upgrades can unlock items, relics, event variants, hero dialogue, stage modifiers, or small persistent bonuses.

### Monster Friendship / Collection

Some monsters can be calmed, fed, befriended, or collected.

Initial friendship rewards:

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

Rules:

```text
- Friendship points persist in meta progress.
- Rewards must be small but noticeable.
- Friendship must not conflict with combat victory.
```
---

## 9. Content Naming Rules

Use stable IDs.

Examples:

```text
hero_milo_blockmancer
hero_pippa_pyromancer
mon_cupcake_slime
boss_king_bloxley
spl_fireball
rel_lucky_cupcake
upg_combo_cheer
item_mana_lemonade
block_sprinkle
oops_heavy_blocks
stage_sprinkle_sewers
loot_stage1_candy
```

Rules:

```text
- Use lowercase snake_case IDs.
- Use clear prefixes.
- Keep IDs stable once used in saves.
- Do not rename IDs without save migration.
- Content JSON should use assetKey/iconKey/spriteKey instead of hardcoded file paths.
```

Preferred prefixes:

```text
hero_
mon_
boss_
wpn_
spl_
rel_
upg_
item_
block_
status_
oops_
evt_
npc_
stage_
loot_
currency_
collectible_
r_evt_
goal_
chaos_
obj_
brule_
mod_
hub_
friend_
helper_
passive_
```

---

## 10. Asset Rules

Assets should be loaded through an asset manifest, not hardcoded randomly in scenes.

Content should reference:

```text
assetKey
iconKey
spriteKey
```

The asset manifest should map those keys to file paths.

Example:

```ts
export const IMAGE_ASSETS = [
  {
    key: "mon_cupcake_slime_idle",
    path: "assets/monsters/cupcake-slime/idle.png",
  },
];
```

Rules:

```text
- Missing assets must fall back safely.
- Missing texture must not crash the game.
- Placeholder rectangles/text are acceptable during development.
- Public assets should live under public/assets/.
- Do not use copyrighted third-party art unless licensed.
- Do not share or commit font files unless license is clear.
```

---

## 11. Required Commands

Use these commands when available:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run validate:content
npm run validate:metadata
npm run android:sync
npm run android:open
npm run android:build:debug
```

If a command does not exist and the task needs it, add it carefully to `package.json`.

Expected scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "validate:content": "node scripts/validate-content-data.mjs",
    "validate:metadata": "node scripts/validate-content-metadata.mjs",
    "android:sync": "npm run build && npx cap sync android",
    "android:open": "npx cap open android",
    "android:build:debug": "cd android && ./gradlew assembleDebug"
  }
}
```

Adapt Windows command scripts if needed.

---

## 12. Save System Rules

Use LocalStorage for Release 1.0 unless otherwise requested.

Save data should include:

### Current Run

```text
- selected hero
- selected hero passive
- weapon
- spells
- relics
- upgrades
- items
- oopsies
- current stage
- map state
- current node/room
- player HP/mana/shield
- gold
- run stats
- stage goal progress
- active chaos rule
- active battle mini-objective
- active random gameplay events
- current boss rule card ID, if applicable
- active board size modifier, if applicable
```

### Meta Progress

```text
- unlocked heroes
- total gold collected
- total cascades
- bosses defeated
- endings unlocked
- tutorial completed
- settings
- completed stage goals
- discovered chaos rules
- discovered boss rule cards
- festival hub building levels
- monster friendship points
- collected helpers / friendship rewards
- currencies such as gold, sprinkles, tickets, and stars where applicable
```

Rules:

```text
- Save data must have a version field.
- Corrupt save must not crash the game.
- Add migration when changing save schema.
- Hero unlock IDs must be stable.
```

---

## 13. UI and UX Rules

General UI rules:

```text
- Prioritize readability over decoration.
- Keep labels short.
- Use icons plus text where possible.
- Keep important numbers visible.
- Do not overcrowd the board.
- Avoid tiny text on mobile.
- Use clear button states.
- Include disabled states for unavailable actions.
```

Important HUD elements:

```text
- Player HP
- Player mana
- Shield
- Enemy HP
- Enemy intent
- Current stage
- Gold
- Fever meter
- Combo/cascade count
- Next block
- Hold block
- Inventory
- Spell buttons
- Active stage goal
- Active chaos rule
- Active battle mini-objective
- Random event toast/log
- Active oopsies
- Board size modifier reason, when active
```

Accessibility options to support:

```text
- screen shake on/off
- reduced flashing
- colorblind-friendly block symbols
- button size
- left-handed controls
- volume/mute
```

---

## 14. Combat Rules

Combat should be tied to board play.

Sources of player power:

```text
- line clears
- cascade chains
- spells
- items
- relics
- upgrades
- hero passives
- weapon bonuses
- chaos rules
- battle mini-objective rewards
- stage goal rewards
- hub/friendship bonuses
```

Enemy behavior can affect:

```text
- player HP
- board junk
- next preview
- hold block
- fall speed
- mana
- controls
- status effects
- board size modifiers
- active random gameplay events
- boss phase mechanics
```

Combat must support:

```text
- victory
- defeat
- boss phase
- rewards
- event log
- enemy intent preview
```

Do not create unavoidable unfair attacks. Enemy attacks should be readable or foreshadowed.

---

## 15. Spell Rules

Spells should be data-driven.

A spell should define:

```text
id
name
description
manaCost
school
targetType
effectType
power
cooldown or usage rule if needed
iconKey
vfxKey
enabled
```

All spells need safe fallback behavior.

Release 1.0 spell list:

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

---

## 16. Item / Inventory Rules

Items should be usable and readable in the compact mobile UI.

Rules:

```text
- Items can stack.
- Inventory has a capacity.
- Inventory can expand/collapse.
- Items can be used in battle or events depending on item data.
- Item count must update immediately.
- Invalid item use should show feedback, not crash.
```

Release 1.0 consumables:

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

---

## 17. Oopsie Rules

Oopsies are the cheerful replacement for curses.

Use names like:

```text
Oopsies
Silly Drawbacks
Festival Mishaps
```

Do not call them curses in player-facing UI.

Rules:

```text
- Oopsies add risk/reward.
- Events may offer stronger rewards in exchange for gaining an Oopsie.
- Player-facing event choices should prefer: safe reward / risky reward + Oopsie / paid controlled reward / walk away.
- Oopsies must be visible in run UI.
- Oopsies can be removed by shop/event.
- Oopsies must not soft-lock the player.
```

Release 1.0 oopsies:

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

---

## 18. Scene Responsibilities

### BootScene

```text
- Load asset manifest
- Register fallback textures
- Load content if needed
- Start MainMenuScene
```

### MainMenuScene

```text
- New run
- Continue run
- Hero select
- Settings
- Credits
```

### HeroSelectScene

```text
- Show heroes
- Show locked/unlocked state
- Show unlock condition
- Start run with selected hero
```

### BattleScene

```text
- Portrait combat layout
- Board gameplay
- Enemy combat
- Spells
- Inventory overlay
- Mobile controls
- Victory/defeat transition
```

### MapScene

```text
- Show current stage map
- Show available nodes
- Route player to selected room
```

### RewardScene

```text
- Show reward choices
- Apply selected reward
- Return to map
```

### EventScene

```text
- Show room event
- Resolve choice
- Return to map
```

### ShopScene

```text
- Buy items/relics/upgrades
- Remove oopsies
- Return to map
```

### RestScene

```text
- Heal or apply rest benefit
- Return to map
```

### TreasureScene

```text
- Grant treasure reward
- Return to map
```

### BossIntroScene

```text
- Show Boss Rule Card
- Explain boss phase mechanic
- Allow dismiss/continue
- Start boss battle
```

### HubScene

```text
- Show festival hub buildings
- Upgrade buildings with meta currencies
- Show unlocked content/bonuses
- Route back to menu or new run
```

### MonsterCollectionScene

```text
- Show monster friendship progress
- Show friendship rewards
- Show helper/unlock status
```

### TutorialScene

```text
- Teach core controls and systems
- Teach stage goals, chaos rules, mini-objectives, and boss rule cards when introduced
- Allow skip
```

### SettingsScene

```text
- UX/audio/accessibility settings
- Save settings
```

### GameOverScene

```text
- Show run summary
- Return to menu
```

### VictoryScene

```text
- Show ending
- Save meta progress
- Return to menu
```

---

## 19. Definition of Done for Any Coding Task

A task is done only when:

```text
[ ] The game builds successfully.
[ ] Existing gameplay is not broken.
[ ] TypeScript errors are fixed.
[ ] New content is data-driven where practical.
[ ] Missing assets/content have safe fallback.
[ ] Mobile portrait layout remains playable.
[ ] Save compatibility is considered.
[ ] Randomness is bounded, explained, and fair.
[ ] Board size changes preserve existing blocks safely.
[ ] New replayability systems are stage/node filtered where relevant.
[ ] Basic manual test path is documented.
[ ] Relevant docs are updated if behavior changed.
```

When implementing a feature, also include:

```text
- What changed
- Files changed
- How to test
- Known limitations
```

---

## 20. Testing Expectations

At minimum, after meaningful changes run:

```bash
npm run build
```

If content changed:

```bash
npm run validate:content
npm run validate:metadata
npm run build
```

Manual smoke test:

```text
1. Start new run.
2. Select Milo.
3. Enter first battle.
4. Move/rotate/drop piece.
5. Clear a line.
6. Verify Cascade Gravity.
7. Cast a spell.
8. Use an item if available.
9. Defeat monster.
10. Choose reward.
11. Move on map.
12. Save/refresh/continue.
13. Confirm Stage 1 map has 6 main-path nodes.
14. Confirm a chaos rule or mini-objective can appear in battle.
15. Trigger or simulate a random gameplay event.
16. Confirm board size changes safely in elite/boss/event scenarios.
17. Confirm Boss Rule Card appears before a boss.
18. Confirm stage goal success/failure can affect boss/reward.
19. Confirm hub progression or monster friendship persists if implemented.
```

Android smoke test when mobile/build work changes:

```text
1. Build web.
2. Sync Capacitor.
3. Build debug APK.
4. Install/open on Android.
5. Verify portrait orientation.
6. Verify touch controls.
7. Verify save/load.
```

---

## 21. Release 1.0 Phase Plan

Recommended implementation order:

```text
1. Release audit
2. Architecture stabilization
3. Content data conversion
4. Cascade Gravity 1.0
5. Special board blocks
6. Portrait mobile layout
7. Input system
8. Combat system
9. Spell system
10. Inventory and item system
11. Hero, weapon, and unlock system
12. Roguelike map and stage system
13. Boss system
14. Reward, relic, and upgrade system
15. Events, shops, rest, and treasure
16. Oopsie system
17. Fever/combo/cascade meta system
18. Milestone C+ — Festival Chaos & Replayability
    - Random gameplay events
    - Stage goals
    - Map node scaling
    - Dynamic board size modifiers
    - Festival Chaos Rules
    - Battle mini-objectives
    - Boss Rule Cards
    - Oopsie risk/reward event choices
    - Hero-specific playstyle passives
    - Festival hub progression
    - Monster friendship / collection
19. Tutorial and onboarding
20. Save/meta progress
21. Asset pipeline integration
22. UI polish
23. Audio and feedback
24. Settings/accessibility
25. Story/dialogue/endings
26. Balance pass
27. QA/debug tools
28. Performance optimization
29. Android/Capacitor release build
30. Store/release metadata
31. Final polish and release candidate
```


---

## 21A. Map Node Scaling Rules

The stage map should grow as the run progresses.

```text
Stage 1 — Sprinkle Sewers: 6 main-path nodes, 9-11 total generated nodes, 0 elites.
Stage 2 — Goblin Workshop: 8 main-path nodes, 12-14 total generated nodes, 1 elite.
Stage 3 — Frosty Pantry: 10 main-path nodes, 15-17 total generated nodes, 1 elite.
Stage 4 — Pillow Castle: 12 main-path nodes, 18-21 total generated nodes, 1-2 elites.
Stage 5 — Starfall Arcade: 14 main-path nodes, 22-25 total generated nodes, 2 elites.
Stage 6 — Bloxley’s Block Palace: 16 main-path nodes, 26-30 total generated nodes, 2-3 elites plus one mini-boss / royal guard before final boss.
```

Rules:

```text
- Boss node is always the final required node of a stage.
- Elite nodes begin from Stage 2.
- Stage 6 should include a special pre-boss or mini-boss node.
- Map node state must include completed/current/available states.
- Map state must save/load safely.
```

---

## 21B. Dynamic Board Size Rules

Board size can change by stage, encounter type, random event, chaos rule, or boss phase.

Base board sizes:

```text
Stage 1: 8x16
Stage 2: 9x17
Stage 3: 9x18
Stage 4: 10x18
Stage 5: 10x19
Stage 6: 10x20
```

Encounter rules:

```text
Normal: use stage base size.
Hard normal: base size plus possible locked hazard row.
Elite: usually shrink width by 1 or height by 2; reward better loot.
Boss phase 1: base size plus boss mechanic.
Boss phase 2: shrink, expand, or reshape temporarily.
Final boss: board changes by phase, especially symmetry/square challenges.
Treasure/Rest: can use a slightly larger or safer board for mini challenges.
Event: variable depending on event choice or machine hiccup.
```

Safety rules:

```text
- Never shrink below 6x12.
- Never expand beyond the mobile-readable limit.
- When shrinking, preserve blocks safely or prevent shrink if occupied cells would be invalid.
- Use a clear compression/overflow rule if unavoidable.
- Board size changes must not break Cascade Gravity.
- UI must rescale the board to remain readable in portrait mode.
```

Example boss board modifiers:

```text
Cupcake Slime King: 8x16 -> 8x15 during sticky phase.
Prototype No. 7: 9x17 -> 10x17 with bomb lanes.
Gelato Golem: 9x18 -> 9x16 during frozen fog.
Sir Snore-a-Lot: 10x18 -> 10x20 while asleep.
High Score Hydra: 10x19 -> 10x21 during combo challenge.
King Bloxley: 10x20 -> 8x20 during Everything Must Be Square.
```
---

## 22. Marketing / IP Safety Rules

Do not use the word **Tetris** in player-facing marketing copy, store text, game title, or metadata.

Use safer genre phrases:

```text
falling-block roguelike RPG
block puzzle RPG
cascade puzzle battler
falling-block combat adventure
arcade puzzle roguelike
```

Do not copy:

```text
- Tetris branding
- official Tetris assets
- exact classic look-and-feel
- official sound effects
- official terminology where avoidable
```

The game identity should focus on:

```text
- Cascade Gravity
- cute festival chaos
- spell casting
- roguelike map
- monsters and bosses
- inventory and relics
```

---

## 23. Code Style

Prefer:

```text
- TypeScript strict-friendly code
- Small pure functions for logic
- Systems over giant scene files
- Data-driven config
- Clear type definitions
- Early returns
- No magic numbers without constants
- Explicit names
```

Avoid:

```text
- Huge monolithic scenes
- Hardcoded content in scene logic
- Random asset paths scattered around
- Silent failures
- Unbounded randomness
- Gameplay logic tied directly to rendering where avoidable
```

---

## 24. Randomness Rules

Roguelike randomness should be controlled.

Use a random utility:

```text
src/game/utils/random.ts
```

Rules:

```text
- Use weighted random for loot.
- Keep random behavior explainable.
- Avoid random movement that feels unfair.
- Boss mechanics should be predictable or telegraphed.
- Random gameplay events must be weighted and filtered by stage/node type.
- Stage 1 should avoid overlapping random events.
- Randomness may create pressure, but it must not create unavoidable failure.
- Show clear event log/toast messages when random events alter the board or encounter.
```

---

## 25. Balance Baseline

Use this as a starting point, then tune with testing.

```text
Player:
- Max HP: 30
- Mana max: 100
- Starting gold: 50
- Base line damage: 5
- Base fall speed: 1.0

Mana gain:
- 1 line: 10
- 2 lines: 25
- 3 lines: 45
- 4 lines: 70

Line damage bonus:
- 1 line: +0
- 2 lines: +8
- 3 lines: +18
- 4 lines: +35

Combo bonus:
- Combo 1: +0
- Combo 2: +3
- Combo 3: +7
- Combo 4+: +12

Difficulty scaling:
- Stage +1 after boss
- Fall speed +0.05 after battle
- Enemy HP +8 per stage
- Enemy attack +0.5 per stage
- Max fall speed: 2.0

Map length baseline:
- Stage 1: 6 main-path nodes
- Stage 2: 8 main-path nodes
- Stage 3: 10 main-path nodes
- Stage 4: 12 main-path nodes
- Stage 5: 14 main-path nodes
- Stage 6: 16 main-path nodes

Board size baseline:
- Stage 1: 8x16
- Stage 2: 9x17
- Stage 3: 9x18
- Stage 4: 10x18
- Stage 5: 10x19
- Stage 6: 10x20
```

---

## 26. Debug Tools

Dev-only debug tools are allowed and encouraged.

Useful debug commands:

```text
- Give gold
- Give item
- Give relic
- Give upgrade
- Unlock hero
- Jump to stage
- Spawn monster
- Trigger boss
- Force reward
- Force cascade test board
- Trigger random gameplay event
- Force chaos rule
- Force battle mini-objective
- Apply board size modifier
- Complete/fail stage goal
- Upgrade hub building
- Add monster friendship points
- Clear save
```

Rules:

```text
- Debug tools must not appear in production UI.
- Use environment/dev flag.
- Keep debug code isolated.
```

---

## 27. Documentation Rules

Update docs when you change:

```text
- Core mechanics
- Content schema
- Save schema
- Controls
- Release/build process
- Asset pipeline
- Balance values
- Map-node scaling
- Dynamic board-size rules
- Replayability systems such as stage goals, chaos rules, mini-objectives, hub, and friendship
```

Preferred docs:

```text
docs/GDD.md
docs/TECHNICAL_DESIGN.md
docs/GAMEPLAY_SYSTEMS.md
docs/BALANCE_AND_PROGRESSION.md
docs/ASSET_PIPELINE.md
docs/BUILD_APK.md
docs/QA_TEST_PLAN.md
docs/RELEASE_1_0_NOTES.md
```

---

## 28. Agent Workflow

When given a task:

```text
1. Inspect relevant files first.
2. Read the relevant updated Blockmancer docs when present.
3. Identify the smallest safe change.
4. Keep current game playable.
5. Implement the feature.
6. Add or update types.
7. Add or update content data if needed.
8. Add safe fallback handling.
9. Run validation/build.
10. Summarize changes and test steps.
```

Do not:

```text
- Ask unnecessary clarification if the task is clear enough.
- Rewrite unrelated systems.
- Remove working features without replacement.
- Introduce dark lore/content.
- Break mobile portrait layout.
- Ignore build/type errors.
```

---

## 29. Preferred Response Format for Coding Agent

After completing a task, respond with:

```text
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

Keep it concise and practical.

---

## 30. Current Release Goal

The current project goal is:

```text
Turn the fun working MVP into a complete Release 1.0 game with cheerful festival content, Cascade Gravity, portrait mobile UI, full roguelike progression, Android build readiness, polished player-facing systems, and the Festival Chaos & Replayability layer.
```


---

## 31. Milestone C+ Implementation Reminder

When implementing the updated replayability content, do not attempt to rewrite the whole game in one pass.

Recommended order:

```text
1. Add types and content folders.
2. Add map-node scaling config.
3. Add base board size config and BoardSizeModifierSystem.
4. Add StageGoalSystem.
5. Add ChaosRuleSystem.
6. Add BattleObjectiveSystem.
7. Add RandomGameplayEventSystem.
8. Add BossRuleSystem and boss rule cards.
9. Extend EventSystem with Oopsie risk/reward choices.
10. Add hero-specific passives.
11. Add HubProgressionSystem.
12. Add FriendshipSystem.
13. Update SaveSystem migrations.
14. Add compact UI indicators.
15. Run build and validation.
```

Milestone C+ Definition of Done:

```text
[ ] Stage node counts follow the updated scaling plan.
[ ] Board size can vary safely by stage/encounter/boss/event.
[ ] At least 10 random gameplay events are implemented or data-ready with safe placeholder effects.
[ ] Each stage has one optional stage goal.
[ ] Combat can roll 0-1 chaos rule.
[ ] Combat can roll 0-1 battle mini-objective.
[ ] Boss Rule Cards exist for all 6 bosses.
[ ] Event choices can grant Oopsies for stronger rewards.
[ ] Each hero has one unique passive.
[ ] Festival hub progression exists or has a functional placeholder scene/system.
[ ] Monster friendship progress exists or has a functional placeholder scene/system.
[ ] Save/load handles all new fields with safe defaults.
[ ] Mobile portrait readability remains intact.
```
