You are a senior game developer, game designer, and mobile build engineer.

Create a complete MVP game project called:

Blockmancer Dungeon

This is a Tetris-inspired physics combat roguelike where the player clears falling blocks to damage monsters, gain mana, cast spells, choose upgrades, and progress through a simple roguelike dungeon map.

This must be a complete runnable project, not just a placeholder mockup.

==================================================
MAIN OBJECTIVE
==================================================

Build a complete MVP project that can:

1. Run as a web game.
2. Be built for production web.
3. Be packaged into an Android APK using Capacitor.
4. Include game source code, UI, docs, and build instructions.
5. Include a full GDD and technical README.
6. Have a playable core gameplay loop.

Do NOT split the work into phases.
Do NOT stop for confirmation.
Generate the full project in one pass.

==================================================
TECH STACK
==================================================

Use:

- Vite
- TypeScript
- Phaser 3
- Capacitor
- HTML/CSS
- No backend
- No external image assets required
- Use simple shapes, text, colors, and generated graphics
- Android build support through Capacitor

The game should run with:

npm install
npm run dev

The web production build should run with:

npm run build

The Android project should be prepared with:

npm run android:init
npm run android:sync
npm run android:open

The debug APK should be buildable with Android Studio or Gradle.

Add clear instructions for Windows and macOS/Linux.

==================================================
PROJECT STRUCTURE
==================================================

Create this structure:

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
BUILD_APK.md
ROADMAP.md
src/
main.ts
styles.css
game/
BlockmancerGame.ts
scenes/
BootScene.ts
MainMenuScene.ts
BattleScene.ts
MapScene.ts
RewardScene.ts
GameOverScene.ts
systems/
BoardSystem.ts
CombatSystem.ts
EnemySystem.ts
SpellSystem.ts
RewardSystem.ts
MapSystem.ts
SaveSystem.ts
data/
enemies.ts
spells.ts
rewards.ts
mapNodes.ts
types/
GameTypes.ts
ui/
Hud.ts
EventLog.ts
Button.ts
utils/
random.ts
constants.ts

Also create Android support using Capacitor.

==================================================
PACKAGE SCRIPTS
==================================================

package.json must include scripts:

- dev
- build
- preview
- android:init
- android:sync
- android:open
- android:build:debug
- clean

Example behavior:

dev:
Start Vite dev server.

build:
Build production web version.

android:init:
Initialize Capacitor Android project if needed.

android:sync:
Build web and sync to Android.

android:open:
Open Android project in Android Studio.

android:build:debug:
Build debug APK through Gradle when Android folder exists.

Make the scripts practical and documented.

==================================================
GAME DESIGN SUMMARY
==================================================

Game title:
Blockmancer Dungeon

Genre:
Tetris-inspired combat roguelike puzzle RPG.

Core hook:
The player is not just stacking blocks. The player is fighting monsters by controlling a collapsing magical battlefield.

Player fantasy:
You are a Blockmancer, a mage trapped inside a cursed dungeon. You use magical falling blocks to attack monsters, generate mana, trigger spells, and survive enemy attacks.

==================================================
CORE GAMEPLAY LOOP
==================================================

The MVP gameplay loop must be:

1. Player enters a room.
2. A monster appears.
3. Player plays a Tetris-like board.
4. Clearing lines damages the enemy.
5. Clearing lines gives mana.
6. Mana can be spent on spells.
7. Enemy attacks after a timer or action counter.
8. Enemy can affect the board.
9. When enemy dies, player chooses a reward.
10. Player moves to next node on the roguelike map.
11. Stage increases and difficulty scales.
12. Boss appears at the end.
13. Win or game over.

==================================================
GAME SCENES
==================================================

Implement these scenes.

---

## BootScene

Responsibilities:

- Initialize basic game config.
- Load or generate simple placeholder graphics.
- Go to MainMenuScene.

No external assets required.

---

## MainMenuScene

Show:

- Game title
- Subtitle
- Start Game button
- Continue button if save exists
- Controls button
- Credits text

Start Game begins a new run.

---

## MapScene

Show a simple roguelike node map.

Node types:

- Start
- Fight
- Event
- Shop
- Elite
- Rest
- Treasure
- Boss

Use simple circles/cards connected by lines.

Clicking a node starts its room.

Map layout example:

          Boss
        /      \
     Fight    Treasure
       \       /
        Rest
      /  |  \

Shop Elite Event
/ | \
 Fight Event Fight
\ | /
Start

Rules:

- Player can only move to connected available nodes.
- Completed nodes should be marked.
- Current node should be highlighted.
- Boss ends the run if defeated.

---

## BattleScene

This is the main playable scene.

Screen layout:

Top:

- HP
- Mana
- Gold
- Stage
- Fall Speed
- Combo

Left/center:

- Tetris-like board

Right:

- Enemy card
- Enemy HP bar
- Enemy intent
- Spell buttons
- Upgrade/relic list

Bottom:

- Event log
- Controls hint

Board:

- 10 columns
- 20 rows
- Falling pieces
- Tetromino-like shapes:
  - I
  - O
  - T
  - S
  - Z
  - J
  - L

Controls:

- Left arrow / A: move piece left
- Right arrow / D: move piece right
- Down arrow / S: soft drop
- Up arrow / W: rotate
- Space: hard drop
- 1: Fireball
- 2: Frost Lock
- 3: Bomb Rune
- 4: Void Cut
- Esc: pause placeholder

Mobile controls:

Add on-screen buttons:

- Left
- Right
- Rotate
- Drop
- Spell 1
- Spell 2
- Spell 3
- Spell 4

Important:
The game must be playable on desktop and mobile.

---

## RewardScene

After battle victory, show 3 reward choices.

Reward types:

- Spell upgrade
- Passive relic
- Gold
- Heal
- Board modifier

Player chooses one reward, then returns to MapScene.

---

## GameOverScene

Show:

- Victory or defeat
- Final stage
- Enemies defeated
- Gold collected
- Restart button
- Main menu button

==================================================
BOARD SYSTEM
==================================================

Implement a real simple falling block system.

Required:

- 10 x 20 grid
- Active falling piece
- Next piece preview
- Collision detection
- Piece movement
- Piece rotation
- Soft drop
- Hard drop
- Lock piece when it lands
- Line clear detection
- Board redraw
- Game over when blocks reach top

This does not need to be perfect Tetris.
It only needs to feel playable and stable.

Line clear effects:

- 1 line: small damage
- 2 lines: medium damage
- 3 lines: high damage
- 4 lines: huge damage
- Back-to-back or combo: bonus damage

Mana gain:

- 1 line: +10 mana
- 2 lines: +25 mana
- 3 lines: +45 mana
- 4 lines: +70 mana

Combo:

- Consecutive line clears increase combo.
- No line clear resets combo.

==================================================
LIGHT PHYSICS PLACEHOLDER
==================================================

Do not implement complex real physics yet.

Implement simple arcade physics-like effects:

- Board shake when enemy attacks.
- Junk blocks can fall from the top.
- Bomb Rune clears nearby cells.
- Some rewards can reduce fall speed.
- Some enemy attacks can increase fall speed.
- Optional: unstable blocks have a small chance to drop down after line clear.

Keep it predictable and fair.

==================================================
COMBAT SYSTEM
==================================================

Player stats:

- Max HP: 30
- Current HP: 30
- Mana: 0 / 100
- Gold: 50
- Stage: 1
- Fall Speed: 1.0
- Base Line Damage: 5

Damage formula:

lineDamage = baseLineDamage + upgradeBonus + lineClearBonus + comboBonus

Line clear bonus:

- 1 line: +0
- 2 lines: +8
- 3 lines: +18
- 4 lines: +35

Combo bonus:

- Combo 1: +0
- Combo 2: +3
- Combo 3: +7
- Combo 4+: +12

Enemy should take damage when player clears lines.

Enemy attack:

- Enemy attacks every few locked pieces or after a countdown.
- Enemy attack reduces player HP.
- Enemy intent should show what it will do next.

==================================================
ENEMY SYSTEM
==================================================

Create these enemies.

1. Slime

- HP: 30
- Attack: 3
- Behavior: basic attack
- Intent: "Bounce Attack"

2. Goblin

- HP: 45
- Attack: 4
- Behavior: adds junk blocks
- Intent: "Throw Junk"

3. Stone Golem

- HP: 75
- Attack: 6
- Behavior: reduces line damage by 2
- Intent: "Stone Guard"

4. Bat

- HP: 25
- Attack: 3
- Behavior: briefly hides next piece preview
- Intent: "Blind Screech"

5. Witch

- HP: 55
- Attack: 5
- Behavior: increases mana cost temporarily
- Intent: "Mana Hex"

6. Elite Knight

- HP: 95
- Attack: 8
- Behavior: attacks harder and spawns junk
- Intent: "Heavy Slam"

7. Falling King Boss

- HP: 160
- Attack: 10
- Behavior:
  - Increases fall speed
  - Spawns junk blocks
  - Shakes board
- Intent: "Royal Collapse"

Enemy scaling:

enemyHp = baseHp + stage \* 8
enemyAttack = baseAttack + floor(stage / 2)

Boss should be much harder.

==================================================
SPELL SYSTEM
==================================================

Implement four spells.

1. Fireball

- Key: 1
- Cost: 30 mana
- Damage: 22
- Effect: Direct damage
- Upgrade: +10 damage

2. Frost Lock

- Key: 2
- Cost: 40 mana
- Damage: 0
- Effect: Reduce fall speed by 0.1 for current battle, minimum 0.7
- Upgrade: also delay enemy attack counter

3. Bomb Rune

- Key: 3
- Cost: 50 mana
- Damage: 35
- Effect: Clear a 3x3 area around random filled cells
- Upgrade: +10 damage and larger explosion

4. Void Cut

- Key: 4
- Cost: 70 mana
- Damage: 15
- Effect: Clear one random filled row or the lowest messy row
- Upgrade: refund 20 mana if it clears many blocks

Rules:

- If not enough mana, show event log message.
- Spells cannot be used when no enemy is active.
- Spell effects must update the board and combat state.
- Spell buttons should show cost.

==================================================
REWARD / RELIC SYSTEM
==================================================

After each battle, show 3 random rewards.

Rewards:

1. Sharp Edges

- Line damage +2

2. Mana Echo

- Spell cost -5, minimum 10

3. Goblin Coin

- Gain +50 gold

4. Stable Hands

- Fall speed -0.05

5. Fire Mastery

- Fireball damage +10

6. Bomb Expert

- Bomb Rune damage +10

7. Combo Heart

- Heal 1 HP when combo reaches 3+

8. Arcane Preview

- Show extra next piece placeholder

9. Stonebreaker

- Ignore Stone Golem damage reduction

10. Emergency Barrier

- Once per battle, prevent lethal damage

Reward UI:

- Show reward name
- Show reward type
- Show description
- Click/tap to choose

After reward:

- Apply upgrade
- Save run state
- Return to map

==================================================
EVENT SYSTEM
==================================================

Implement simple random events.

Event room examples:

1. Shrine of Gravity
   Choices:

- Reduce fall speed by 0.1
- Gain 30 gold
- Take 3 damage and gain a random reward

2. Broken Anvil
   Choices:

- Upgrade random spell
- Pay 30 gold to upgrade selected spell
- Leave

3. Strange Mirror
   Choices:

- Duplicate a random relic
- Gain curse placeholder
- Leave

4. Lost Knight
   Choices:

- Heal 5 HP
- Fight elite
- Gain 20 gold

Events can use simple UI buttons and event log.

==================================================
SHOP SYSTEM
==================================================

Shop room should show simple buy options:

- Heal 8 HP for 30 gold
- Buy random reward for 60 gold
- Remove curse placeholder for 50 gold
- Leave

No complex inventory required.

==================================================
REST SYSTEM
==================================================

Rest room:

- Heal 10 HP
- Reduce fall speed by 0.05
- Add event log

==================================================
TREASURE SYSTEM
==================================================

Treasure room:

- Gain 50 gold
- Gain one random reward
- Add event log

==================================================
DIFFICULTY SCALING
==================================================

After each completed battle:

- Stage +1
- Fall speed +0.05
- Enemy HP scales up
- Enemy attack scales up
- More junk blocks appear at higher stage

Fall speed should remain playable.
Clamp fall speed to a reasonable max.

==================================================
SAVE SYSTEM
==================================================

Implement simple localStorage save.

Save:

- Player HP
- Mana
- Gold
- Stage
- Fall speed
- Upgrades/relics
- Map progress
- Current run status

Add:

- New run
- Continue run
- Clear save when game over or victory

==================================================
UI STYLE
==================================================

Create a dark fantasy arcade style.

Use:

- Dark background
- Purple/blue magical accent colors
- Gold for rewards
- Red for danger/enemy
- Green for healing
- Card panels
- Rounded corners
- Pixel/arcade-inspired but readable text
- Responsive layout

The game should fit:

- Desktop browser
- Mobile portrait
- Mobile landscape

For mobile, prioritize readable buttons and board visibility.

==================================================
AUDIO PLACEHOLDER
==================================================

No audio assets required.

But create an AudioSystem placeholder or simple comments showing where audio would be added later.

Optional:
Use simple WebAudio beep effects for:

- Line clear
- Spell cast
- Enemy hit
- Reward chosen

Only implement if simple and stable.

==================================================
DOCUMENTATION
==================================================

Create README.md with:

1. Project overview
2. Tech stack
3. How to install
4. How to run web dev
5. How to build web
6. How to prepare Android
7. How to build APK
8. Controls
9. Known limitations
10. Future roadmap

Create docs/GDD.md with:

1. Game Overview
2. Core Fantasy
3. Unique Selling Point
4. Target Player Experience
5. Core Gameplay Loop
6. Battle System
7. Board System
8. Combat Rules
9. Enemy Types
10. Spell System
11. Mana System
12. Reward / Relic System
13. Roguelike Map System
14. Event System
15. Difficulty Scaling
16. UI Layout
17. MVP Scope
18. Future Expansion Ideas

Create docs/TECHNICAL_DESIGN.md with:

1. Architecture
2. Scene flow
3. State management
4. Board system
5. Combat system
6. Mobile input
7. Save system
8. Android packaging
9. Extension points

Create docs/BUILD_APK.md with exact instructions.

Include Windows instructions:

- Install Node.js LTS
- Install JDK 17
- Install Android Studio
- Install Android SDK
- Run npm install
- Run npm run build
- Run npm run android:init
- Run npm run android:sync
- Run npm run android:open
- Build APK in Android Studio:
  Build > Build Bundle(s) / APK(s) > Build APK(s)

Also include command line option:

cd android
gradlew.bat assembleDebug

macOS/Linux:

cd android
./gradlew assembleDebug

Mention expected APK output path:

android/app/build/outputs/apk/debug/app-debug.apk

==================================================
ANDROID / CAPACITOR REQUIREMENTS
==================================================

Set Capacitor config:

appId:
com.blockmancer.dungeon

appName:
Blockmancer Dungeon

webDir:
dist

bundledWebRuntime:
false

The Android package should work after:

npm run build
npx cap add android
npx cap sync android
npx cap open android

If Android folder cannot be fully generated automatically, document the exact commands in BUILD_APK.md.

Add comments in README about Android Studio requirement.

==================================================
ACCEPTANCE CRITERIA
==================================================

The final project must satisfy:

1. npm install works.
2. npm run dev starts the game.
3. Main menu is visible.
4. New run starts.
5. Map scene appears.
6. Fight node starts battle.
7. Falling blocks work.
8. Player can move, rotate, soft drop, and hard drop pieces.
9. Lines can be cleared.
10. Line clears damage enemy.
11. Mana increases from line clears.
12. Spells can be cast.
13. Enemy can attack player.
14. Enemy defeat opens reward screen.
15. Reward selection applies upgrade.
16. Player returns to map.
17. Stage and difficulty increase.
18. Boss can appear.
19. Game over and victory screens exist.
20. Save/load through localStorage works.
21. Web production build works.
22. Capacitor Android setup is documented.
23. APK build instructions are clear.
24. Code is readable and easy to extend.

==================================================
CODE QUALITY RULES
==================================================

- Use TypeScript types.
- Keep systems separated.
- Do not put all logic in one huge file.
- Use constants for board size, colors, damage values, and mana values.
- Add comments for important mechanics.
- Keep functions readable.
- Avoid overengineering.
- Avoid complex physics simulation.
- Keep MVP stable and playable.
- Make sure there are no TypeScript errors.
- Make sure there are no missing imports.
- Make sure the project can run immediately after installation.

==================================================
IMPORTANT FINAL OUTPUT
==================================================

After generating the project, provide:

1. Project structure.
2. Commands to run web version.
3. Commands to build production web.
4. Commands to prepare Android.
5. Commands to build APK.
6. APK output path.
7. Summary of implemented gameplay.
8. Known limitations.
9. Suggested next improvements.

Start by creating the full project files now.
Do not ask for confirmation.
Do not stop after docs.
Implement the complete MVP.
