# AGENT.md — Blockmancer Dungeon

Instructions for AI coding agents working on **Blockmancer Dungeon**.

This file defines the project context, coding rules, architecture expectations, content direction, implementation workflow, and Definition of Done.

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
```

---

## 4. Tech Stack

Expected stack:

```text
Vite
TypeScript
Phaser 3
Capacitor Android
HTML/CSS
LocalStorage
No backend for Release 1.0
```

Do not introduce a backend unless explicitly requested.

Do not add large dependencies unless clearly justified.

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
        TutorialScene.ts
        SettingsScene.ts
        GameOverScene.ts
        VictoryScene.ts

      systems/
        AssetSystem.ts
        AudioSystem.ts
        BoardSystem.ts
        CombatSystem.ts
        ContentRegistry.ts
        DifficultySystem.ts
        EnemySystem.ts
        EventSystem.ts
        FeverSystem.ts
        HeroSystem.ts
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
- weapon
- spells
- relics
- upgrades
- items
- oopsies
- current stage
- map state
- current room
- player HP/mana/shield
- gold
- run stats
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

### TutorialScene

```text
- Teach core controls and systems
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
18. Tutorial and onboarding
19. Save/meta progress
20. Asset pipeline integration
21. UI polish
22. Audio and feedback
23. Settings/accessibility
24. Story/dialogue/endings
25. Balance pass
26. QA/debug tools
27. Performance optimization
28. Android/Capacitor release build
29. Store/release metadata
30. Final polish and release candidate
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
2. Identify the smallest safe change.
3. Keep current game playable.
4. Implement the feature.
5. Add or update types.
6. Add or update content data if needed.
7. Add safe fallback handling.
8. Run validation/build.
9. Summarize changes and test steps.
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

Known limitations:
- ...
```

Keep it concise and practical.

---

## 30. Current Release Goal

The current project goal is:

```text
Turn the fun working MVP into a complete Release 1.0 game with cheerful festival content, Cascade Gravity, portrait mobile UI, full roguelike progression, Android build readiness, and polished player-facing systems.
```
