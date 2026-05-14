You are a senior game designer, technical game designer, TypeScript game developer, and mobile build engineer.

I want to create a complete game project called:

Blockmancer Dungeon

This is a Tetris-inspired combat roguelike puzzle RPG.

The game should eventually be a full game, but for now all visuals, sounds, enemies, heroes, weapons, spells, relics, and upgrades can use placeholders.

The goal is to build the project phase by phase using a strong GDD and technical plan.

Do NOT try to create final art.
Do NOT overbuild production-quality content yet.
Use placeholder shapes, colors, text, and generated UI.
Focus on structure, playable loop, clean architecture, and future scalability.

==================================================
HIGH-LEVEL GAME CONCEPT
==================================================

Blockmancer Dungeon is a physics-inspired combat Tetris roguelike where the player clears falling block lines to damage monsters, gain mana, cast spells, survive enemy attacks, choose upgrades, and progress through a roguelike dungeon map.

Core hook:

"The player is not just stacking blocks. The player is fighting monsters by controlling a collapsing magical battlefield."

Player fantasy:

The player is a Blockmancer, a mage trapped inside a cursed dungeon. They use magical falling blocks to attack monsters, generate mana, trigger spells, and survive chaotic monster effects.

==================================================
TECH STACK
==================================================

Use:

- Vite
- TypeScript
- Phaser 3
- Capacitor
- HTML/CSS
- LocalStorage for save data
- No backend
- No real image assets yet
- Placeholder shapes and text only
- Placeholder sound system is acceptable

The project must eventually support:

- Web dev build
- Web production build
- Android APK build through Capacitor

Commands should eventually include:

npm install
npm run dev
npm run build
npm run preview
npm run android:init
npm run android:sync
npm run android:open
npm run android:build:debug

==================================================
PROJECT STRUCTURE TARGET
==================================================

Create or evolve the project toward this structure:

blockmancer-dungeon/
package.json
index.html
vite.config.ts
tsconfig.json
capacitor.config.ts
README.md

docs/
GDD.md
PHASE_PLAN.md
TECHNICAL_DESIGN.md
CONTENT_SYSTEM.md
BUILD_APK.md
ROADMAP.md

scripts/
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
        MapScene.ts
        BattleScene.ts
        RewardScene.ts
        EventScene.ts
        ShopScene.ts
        RestScene.ts
        TreasureScene.ts
        GameOverScene.ts

      systems/
        BoardSystem.ts
        CombatSystem.ts
        EnemySystem.ts
        SpellSystem.ts
        RewardSystem.ts
        RelicSystem.ts
        UpgradeSystem.ts
        HeroSystem.ts
        WeaponSystem.ts
        MapSystem.ts
        EventSystem.ts
        ShopSystem.ts
        DifficultySystem.ts
        SaveSystem.ts
        AudioSystem.ts
        InputSystem.ts
        ContentRegistry.ts

      content/
        monsters/
          metadata.json
          slime.json
          goblin.json
          stone-golem.json
          bat.json
          witch.json
          elite-knight.json
          falling-king.json

        heroes/
          metadata.json
          blockmancer.json

        weapons/
          metadata.json
          basic-wand.json

        spells/
          metadata.json
          fireball.json
          frost-lock.json
          bomb-rune.json
          void-cut.json

        relics/
          metadata.json
          goblin-coin.json
          broken-hourglass.json
          slime-core.json

        upgrades/
          metadata.json
          sharp-edges.json
          mana-echo.json
          stable-hands.json
          fire-mastery.json
          bomb-expert.json
          combo-heart.json

        status-effects/
          metadata.json
          burn.json
          freeze.json
          shield.json
          mana-hex.json

        room-events/
          metadata.json
          shrine-of-gravity.json
          broken-anvil.json
          strange-mirror.json
          lost-knight.json

        loot-tables/
          metadata.json
          battle-default.json
          elite-default.json
          boss-default.json
          shop-default.json
          treasure-default.json

        difficulty-scaling/
          metadata.json
          default-run.json

      data/
        defaultRunState.ts
        constants.ts

      types/
        GameTypes.ts
        ContentTypes.ts

      ui/
        Button.ts
        Hud.ts
        EventLog.ts
        Card.ts
        ProgressBar.ts
        MobileControls.ts

      utils/
        random.ts
        math.ts
        storage.ts
        validation.ts

==================================================
IMPORTANT DEVELOPMENT METHOD
==================================================

Develop the game in phases.

Each phase must have:

1. Goal
2. Scope
3. Files to create or update
4. Placeholder rules
5. Acceptance criteria
6. Test commands
7. Known limitations

If a phase is too large, split it into smaller commits or steps internally.

After finishing each phase, provide:

- What was created
- What files changed
- How to run/test
- What is still placeholder
- What the next phase should do

Do not skip phases.
Do not implement final art.
Do not introduce unnecessary complexity.
Keep the project playable at every major phase.

==================================================
PHASE 0 — GDD AND TECHNICAL FOUNDATION
==================================================

Goal:
Create the full design and technical documentation before coding gameplay.

Scope:
Create the main docs that define the full game direction and current placeholder MVP scope.

Create:

docs/GDD.md
docs/PHASE_PLAN.md
docs/TECHNICAL_DESIGN.md
docs/CONTENT_SYSTEM.md
docs/ROADMAP.md

GDD.md must include:

1. Game Overview
2. Core Fantasy
3. Unique Selling Point
4. Target Player Experience
5. Core Gameplay Loop
6. Run Structure
7. Battle System
8. Board System
9. Light Physics Placeholder Design
10. Combat Rules
11. Heroes
12. Weapons
13. Monsters
14. Spells
15. Mana System
16. Relics
17. Upgrades
18. Status Effects
19. Roguelike Map
20. Events
21. Shops
22. Rest Sites
23. Treasure Rooms
24. Boss Room
25. Difficulty Scaling
26. Save System
27. UI Layout
28. Mobile Controls
29. MVP Scope
30. Full Game Expansion
31. Known Risks

PHASE_PLAN.md must describe all phases from Phase 0 to Phase 14.

TECHNICAL_DESIGN.md must include:

1. Tech Stack
2. Scene Architecture
3. System Architecture
4. Content Registry
5. Game State Model
6. Board Update Loop
7. Combat Flow
8. Save/Load Flow
9. Mobile Build Flow
10. Extension Points

CONTENT_SYSTEM.md must explain:

1. Data-driven content format
2. metadata.json role
3. Content folder structure
4. Required content types
5. Validation rules
6. Example content entry
7. Future content editor notes

ROADMAP.md must include:

- Current placeholder MVP
- Playable alpha
- Content alpha
- Balance beta
- Mobile beta
- Full release candidate

Placeholder rules:
Docs should describe final vision, but clearly mark what is placeholder now.

Acceptance criteria:

- All docs exist
- Full game vision is clear
- Placeholder MVP scope is clear
- Future roadmap is clear

Test commands:
No code tests required yet.

==================================================
PHASE 1 — PROJECT BOOTSTRAP
==================================================

Goal:
Create the base Vite + TypeScript + Phaser 3 project.

Scope:
Set up the project so it can run a blank Phaser game.

Create/update:

package.json
index.html
vite.config.ts
tsconfig.json
src/main.ts
src/styles.css
src/game/BlockmancerGame.ts
src/game/scenes/BootScene.ts
src/game/scenes/MainMenuScene.ts

Required scripts:

- dev
- build
- preview
- clean

Placeholder rules:

- Use simple text and colored background
- No assets required
- Main menu can be basic text/buttons

Acceptance criteria:

- npm install works
- npm run dev works
- npm run build works
- Phaser game canvas appears
- Main menu appears
- Start Game button exists as placeholder

Test commands:

npm install
npm run build

==================================================
PHASE 2 — CORE TYPES AND GAME STATE
==================================================

Goal:
Create the foundational types and default run state.

Scope:
Define TypeScript types for the future game.

Create/update:

src/game/types/GameTypes.ts
src/game/types/ContentTypes.ts
src/game/data/constants.ts
src/game/data/defaultRunState.ts
src/game/systems/SaveSystem.ts
src/game/utils/storage.ts

Core state should include:

- player
- hero
- weapon
- board
- currentEnemy
- spells
- relics
- upgrades
- statusEffects
- map
- currentRoom
- stage
- fallSpeed
- combo
- gold
- eventLog
- runStatus

Placeholder rules:

- Only one hero is required for now
- Only default values are needed
- Save system should use localStorage

Acceptance criteria:

- Types compile
- Default run can be created
- Save/load/clear save functions exist
- Main menu can start a new run
- Continue button can detect saved data

Test commands:

npm run build

==================================================
PHASE 3 — CONTENT METADATA SYSTEM
==================================================

Goal:
Create metadata.json files for all content categories.

Scope:
Create data-driven metadata for:

Required:

- monsters
- heroes
- weapons
- spells
- relics
- upgrades

Recommended:

- status-effects
- room-events
- loot-tables
- difficulty-scaling

Create/update:

src/game/content/\*/metadata.json
scripts/validate-content-metadata.mjs
package.json

Add package script:

validate:metadata

Each metadata.json must include:

- contentType
- version
- idPrefix
- displayName
- description
- idFormat
- exampleIds
- requiredFields
- fields
- dataList
- commonDataList
- defaults

Placeholder rules:

- This phase only creates schemas/metadata
- Do not create many real content entries yet
- JSON must not contain comments

Acceptance criteria:

- All metadata.json files exist
- All files are valid JSON
- validate:metadata passes
- package.json has validate:metadata script

Test commands:

npm run validate:metadata
npm run build

==================================================
PHASE 4 — PLACEHOLDER CONTENT ENTRIES
==================================================

Goal:
Create actual placeholder content JSON entries using the metadata.

Scope:
Create basic content entries for the first playable MVP.

Create/update:

monsters:

- slime
- goblin
- stone-golem
- bat
- witch
- elite-knight
- falling-king

heroes:

- blockmancer

weapons:

- basic-wand

spells:

- fireball
- frost-lock
- bomb-rune
- void-cut

relics:

- goblin-coin
- broken-hourglass
- slime-core

upgrades:

- sharp-edges
- mana-echo
- stable-hands
- fire-mastery
- bomb-expert
- combo-heart

status-effects:

- burn
- freeze
- shield
- mana-hex

room-events:

- shrine-of-gravity
- broken-anvil
- strange-mirror
- lost-knight

loot-tables:

- battle-default
- elite-default
- boss-default
- shop-default
- treasure-default

difficulty-scaling:

- default-run

Create/update:

src/game/systems/ContentRegistry.ts

ContentRegistry should:

- Load/import placeholder content
- Provide getters by ID
- Provide lists by content type
- Provide safe fallback behavior

Placeholder rules:

- Use simple text descriptions
- Use placeholder icon keys
- Balance can be rough
- No art assets

Acceptance criteria:

- Content files are valid JSON
- ContentRegistry can access all entries
- Build passes
- No missing imports

Test commands:

npm run validate:metadata
npm run build

==================================================
PHASE 5 — SCENE FLOW
==================================================

Goal:
Create the full scene flow with placeholder screens.

Scope:
Implement all main scenes and navigation between them.

Create/update:

BootScene
MainMenuScene
HeroSelectScene
MapScene
BattleScene
RewardScene
EventScene
ShopScene
RestScene
TreasureScene
GameOverScene

Required flow:

MainMenuScene
-> HeroSelectScene
-> MapScene
-> BattleScene / EventScene / ShopScene / RestScene / TreasureScene
-> RewardScene after battle
-> MapScene
-> GameOverScene on death or victory

Placeholder rules:

- Scenes may use text buttons and simple rectangles
- No final UI required
- Each scene must be reachable

Acceptance criteria:

- New Run starts correctly
- Hero Select appears
- Selecting hero goes to Map
- Map nodes can open different scenes
- Battle can go to Reward
- Reward can return to Map
- GameOver can return to Main Menu

Test commands:

npm run build
npm run dev

==================================================
PHASE 6 — UI FOUNDATION
==================================================

Goal:
Create reusable placeholder UI components.

Scope:
Create simple Phaser UI helpers.

Create/update:

src/game/ui/Button.ts
src/game/ui/Hud.ts
src/game/ui/EventLog.ts
src/game/ui/Card.ts
src/game/ui/ProgressBar.ts
src/game/ui/MobileControls.ts

UI must support:

- Text buttons
- Cards/panels
- HP bar
- Mana bar
- Enemy HP bar
- Event log
- Mobile controls
- Basic hover/tap states

Placeholder rules:

- Use simple Phaser graphics
- No images
- Keep reusable and simple

Acceptance criteria:

- UI components work in scenes
- Main menu uses Button
- Battle scene can display HUD
- Event log can show messages
- Mobile buttons are visible in BattleScene

Test commands:

npm run build

==================================================
PHASE 7 — MAP SYSTEM
==================================================

Goal:
Create a playable roguelike node map.

Scope:
Implement simple node map progression.

Create/update:

src/game/systems/MapSystem.ts
src/game/content/loot-tables/\*
src/game/scenes/MapScene.ts

Map node types:

- Start
- Fight
- Event
- Shop
- Elite
- Rest
- Treasure
- Boss

Rules:

- Player starts at Start
- Connected nodes become available
- Completed nodes are marked
- Current node is highlighted
- Boss appears at final stage/path
- Clicking available node starts its room

Placeholder rules:

- Use circles/cards and text
- Connections can be simple lines
- Layout can be fixed for now

Acceptance criteria:

- Map is visible
- Nodes are clickable
- Unavailable nodes are disabled
- Room type determines next scene
- Progress is saved in run state

Test commands:

npm run build

==================================================
PHASE 8 — BOARD SYSTEM
==================================================

Goal:
Implement the Tetris-like board.

Scope:
Create a playable falling block system.

Create/update:

src/game/systems/BoardSystem.ts
src/game/scenes/BattleScene.ts
src/game/utils/math.ts
src/game/utils/random.ts

Board requirements:

- 10 columns
- 20 rows
- Tetromino-like pieces:
  - I
  - O
  - T
  - S
  - Z
  - J
  - L
- Active falling piece
- Next piece preview placeholder
- Collision detection
- Move left/right
- Rotate
- Soft drop
- Hard drop
- Lock piece
- Clear lines
- Detect top-out game over
- Render board with simple colored rectangles

Controls:

Desktop:

- Left arrow / A: move left
- Right arrow / D: move right
- Down arrow / S: soft drop
- Up arrow / W: rotate
- Space: hard drop

Mobile:

- On-screen buttons:
  Left
  Right
  Rotate
  Drop

Placeholder rules:

- Physics can be fake/simple
- No advanced T-spin/scoring needed
- Keep movement stable and predictable

Acceptance criteria:

- Pieces fall
- Player can move and rotate
- Lines clear
- Board updates visually
- Top-out triggers loss condition
- Mobile buttons work

Test commands:

npm run build
npm run dev

==================================================
PHASE 9 — COMBAT SYSTEM
==================================================

Goal:
Connect board line clears to combat.

Scope:
Implement player vs enemy combat.

Create/update:

src/game/systems/CombatSystem.ts
src/game/systems/EnemySystem.ts
src/game/systems/DifficultySystem.ts
src/game/scenes/BattleScene.ts

Rules:

Player:

- Max HP: 30
- Mana: 0 / 100
- Gold: 50
- Stage: 1
- Base Line Damage: 5

Line clear effects:

- 1 line: damage enemy, gain 10 mana
- 2 lines: more damage, gain 25 mana
- 3 lines: high damage, gain 45 mana
- 4 lines: huge damage, gain 70 mana

Combo:

- Consecutive line clears increase combo
- No line clear resets combo
- Combo increases damage

Enemy:

- Has HP
- Has attack
- Has intent
- Attacks every few locked pieces
- Can trigger placeholder behavior

Enemy behaviors:

- basic_attack
- spawn_junk
- shake_board
- increase_fall_speed
- hide_next_piece
- reduce_line_damage
- mana_hex

Placeholder rules:

- Enemy intent can be text
- Board shake can be simple camera shake
- Junk can be random filled cells

Acceptance criteria:

- Clearing lines damages enemy
- Mana increases
- Combo works
- Enemy attacks player
- Player HP decreases
- Enemy defeat goes to RewardScene
- Player death goes to GameOverScene

Test commands:

npm run build
npm run dev

==================================================
PHASE 10 — SPELL SYSTEM
==================================================

Goal:
Implement castable spells.

Scope:
Use spell content data to create spell buttons and effects.

Create/update:

src/game/systems/SpellSystem.ts
src/game/scenes/BattleScene.ts
src/game/ui/MobileControls.ts

Required spells:

Fireball:

- Cost: 30 mana
- Direct damage

Frost Lock:

- Cost: 40 mana
- Reduce fall speed temporarily or for battle

Bomb Rune:

- Cost: 50 mana
- Damage enemy
- Clear 3x3 area on board

Void Cut:

- Cost: 70 mana
- Damage enemy
- Clear one row

Controls:

Desktop:

- 1: Fireball
- 2: Frost Lock
- 3: Bomb Rune
- 4: Void Cut

Mobile:

- Spell buttons visible

Rules:

- Check mana
- Spend mana
- Apply effect
- Log result
- Prevent casting if no enemy active
- Show not enough mana message

Placeholder rules:

- Effects can be simple but must work
- No final animations needed

Acceptance criteria:

- All 4 spells work
- Mana costs apply
- Board effects update board
- Enemy HP updates
- UI updates
- Not enough mana warning appears

Test commands:

npm run build

==================================================
PHASE 11 — REWARD, RELIC, AND UPGRADE SYSTEM
==================================================

Goal:
Implement post-battle rewards and passive upgrades.

Scope:
Create reward selection and apply effects.

Create/update:

src/game/systems/RewardSystem.ts
src/game/systems/RelicSystem.ts
src/game/systems/UpgradeSystem.ts
src/game/scenes/RewardScene.ts

Reward flow:

- After enemy defeat, show 3 random reward cards
- Player chooses one
- Reward applies immediately
- Return to MapScene

Reward types:

- Upgrade
- Relic
- Gold
- Heal
- Spell upgrade placeholder

Required upgrades:

- Sharp Edges: line damage +2
- Mana Echo: spell cost -5
- Stable Hands: fall speed -0.05
- Fire Mastery: Fireball damage +10
- Bomb Expert: Bomb Rune damage +10
- Combo Heart: heal on combo 3+

Required relics:

- Goblin Coin: more gold
- Broken Hourglass: slow fall speed at low HP
- Slime Core: gain mana when hit

Placeholder rules:

- Relic icons are text only
- Effects can be simple
- Stacking can be basic

Acceptance criteria:

- Rewards appear after battle
- Picking reward applies effect
- Upgrade/relic list updates
- Stage increases after battle
- Difficulty increases
- Return to map works

Test commands:

npm run build

==================================================
PHASE 12 — EVENT, SHOP, REST, AND TREASURE ROOMS
==================================================

Goal:
Implement non-combat room types.

Scope:
Make all map node types functional.

Create/update:

src/game/systems/EventSystem.ts
src/game/systems/ShopSystem.ts
src/game/scenes/EventScene.ts
src/game/scenes/ShopScene.ts
src/game/scenes/RestScene.ts
src/game/scenes/TreasureScene.ts

Event examples:

Shrine of Gravity:

- Reduce fall speed
- Gain gold
- Take damage for reward

Broken Anvil:

- Upgrade random spell
- Pay gold to upgrade
- Leave

Strange Mirror:

- Duplicate relic placeholder
- Gain curse placeholder
- Leave

Lost Knight:

- Heal
- Gain gold
- Fight elite placeholder

Shop:

- Heal for gold
- Buy random reward
- Remove curse placeholder
- Leave

Rest:

- Heal 10 HP
- Reduce fall speed slightly

Treasure:

- Gain gold
- Gain random reward

Placeholder rules:

- Use simple choice cards/buttons
- No complex inventory

Acceptance criteria:

- Event scene works
- Shop scene works
- Rest scene works
- Treasure scene works
- Choices update run state
- Return to map works

Test commands:

npm run build

==================================================
PHASE 13 — SAVE, LOAD, GAME OVER, AND VICTORY
==================================================

Goal:
Complete run lifecycle.

Scope:
Make the game playable from start to finish.

Create/update:

src/game/systems/SaveSystem.ts
src/game/scenes/MainMenuScene.ts
src/game/scenes/GameOverScene.ts
src/game/scenes/MapScene.ts
src/game/scenes/BattleScene.ts

Save:

- Current hero
- Player stats
- Gold
- Stage
- Fall speed
- Spells
- Relics
- Upgrades
- Map progress
- Current room
- Defeated enemies
- Run status

Game over:

- Triggered by player HP <= 0
- Triggered by board top-out

Victory:

- Triggered by defeating Falling King Boss

GameOverScene shows:

- Victory or defeat
- Final stage
- Enemies defeated
- Gold collected
- Restart button
- Main menu button

Placeholder rules:

- Stats summary can be simple text
- No leaderboard needed

Acceptance criteria:

- Continue run works
- Save persists after refresh
- Death ends run
- Boss victory ends run
- Restart works
- Clear save works

Test commands:

npm run build
npm run dev

==================================================
PHASE 14 — ANDROID / APK SUPPORT
==================================================

Goal:
Prepare the project for Android APK builds.

Scope:
Add Capacitor support and Android build documentation.

Create/update:

capacitor.config.ts
docs/BUILD_APK.md
README.md
package.json

Required package scripts:

- android:init
- android:sync
- android:open
- android:build:debug

Capacitor config:

appId:
com.blockmancer.dungeon

appName:
Blockmancer Dungeon

webDir:
dist

BUILD_APK.md must include:

Windows:

1. Install Node.js LTS
2. Install JDK 17
3. Install Android Studio
4. Install Android SDK
5. Run npm install
6. Run npm run build
7. Run npm run android:init
8. Run npm run android:sync
9. Run npm run android:open
10. Build APK in Android Studio:
    Build > Build Bundle(s) / APK(s) > Build APK(s)

Command line option:

cd android
gradlew.bat assembleDebug

macOS/Linux:

cd android
./gradlew assembleDebug

Expected output:

android/app/build/outputs/apk/debug/app-debug.apk

Placeholder rules:

- No final app icon required yet
- Use default Capacitor icon/splash if necessary
- Mobile controls must remain usable

Acceptance criteria:

- Web build works
- Capacitor config exists
- Android setup commands are documented
- APK build path is documented
- README explains web and APK flow

Test commands:

npm run build
npm run android:sync

If Android folder is not generated automatically, explain exact next commands in docs.

==================================================
PHASE 15 — PLACEHOLDER POLISH PASS
==================================================

Goal:
Make the placeholder MVP feel coherent and playable.

Scope:
Improve clarity, readability, balance, and UX without adding final art.

Polish:

- Better text labels
- Better button states
- Cleaner scene transitions
- Clearer event log messages
- Better board colors
- Better enemy HP bar
- Better mobile layout
- Basic camera shake
- Optional WebAudio beep placeholders
- Basic balancing

Placeholder rules:

- Still no final art
- Still no complex animation
- Keep everything simple and stable

Acceptance criteria:

- Game loop is understandable
- Player can complete a run
- UI is readable on desktop
- UI is usable on mobile
- Build passes
- Known limitations are documented

Test commands:

npm run build
npm run dev

==================================================
BALANCE BASELINE
==================================================

Use these placeholder balance values:

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

- Stage +1 after each battle
- Fall speed +0.05 after battle
- Enemy HP +8 per stage
- Enemy attack +0.5 per stage
- Max fall speed: 2.0

==================================================
PLACEHOLDER VISUAL STYLE
==================================================

Use:

- Dark fantasy arcade background
- Purple/blue magic accents
- Gold rewards
- Red enemy damage
- Green healing
- Simple geometric blocks
- Text labels
- Rectangular cards
- Rounded buttons if using DOM/CSS
- Phaser graphics for board and UI

Do not use external art assets yet.

==================================================
IMPORTANT CODING RULES
==================================================

- Use TypeScript.
- Keep code modular.
- Keep gameplay systems separate.
- Avoid one huge file.
- Avoid unnecessary frameworks.
- Avoid complex real physics for now.
- Keep placeholder logic stable.
- Add comments for important mechanics.
- Use constants instead of magic numbers.
- Ensure npm run build passes after each phase.
- Do not break existing functionality while adding new phases.
- Prefer simple working systems over advanced unfinished systems.

==================================================
FINAL RESPONSE FORMAT AFTER EACH PHASE
==================================================

After implementing a phase, respond with:

1. Phase completed
2. Files created
3. Files updated
4. How to test
5. Placeholder parts still remaining
6. Next recommended phase

Do not claim the game is complete until Phase 15 is done.

Start with Phase 0 unless the repository already contains equivalent docs.
If some files already exist, update them carefully instead of overwriting blindly.
