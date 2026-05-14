# Technical Design Document

## 1. Architecture goals

The game should stay data-driven, modular, and easy to port.

Required qualities:

```text
fast load time
stable board logic
reliable save/load
content JSON validation
mobile-friendly input
buildable web output
Capacitor Android packaging
```

## 2. Tech stack

```text
Vite
TypeScript
Phaser 3
Capacitor
LocalStorage
JSON content files
```

## 3. Scene architecture

```text
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
SettingsScene
CreditsScene
```

## 4. Systems

| System           | Responsibility                               |
| ---------------- | -------------------------------------------- |
| BoardSystem      | Grid, pieces, collision, line clears.        |
| CombatSystem     | Damage, mana, HP, battle flow.               |
| EnemySystem      | Enemy creation, scaling, intents, behaviors. |
| SpellSystem      | Spell casting and effects.                   |
| RewardSystem     | Reward rolls and application.                |
| RelicSystem      | Passive triggers.                            |
| UpgradeSystem    | Upgrade stacking and modifiers.              |
| HeroSystem       | Hero selection and starting loadout.         |
| WeaponSystem     | Weapon effects.                              |
| MapSystem        | Node generation/progression.                 |
| EventSystem      | Event choices and effects.                   |
| ShopSystem       | Shop inventory/purchases.                    |
| DifficultySystem | Stage scaling.                               |
| SaveSystem       | Save/load/clear run.                         |
| AudioSystem      | Music/SFX wrapper.                           |
| InputSystem      | Keyboard, touch, mobile controls.            |
| ContentRegistry  | Load and query JSON content.                 |
| AnalyticsSystem  | Optional event tracking.                     |

## 5. Data flow

```text
Content JSON -> ContentRegistry -> Systems -> Run State -> Scenes/UI
```

Scenes should render state and receive input. Systems should mutate state through clear APIs.

## 6. Save model

Save:

```text
version
runId
createdAt
updatedAt
heroId
player stats
stage
fallSpeed
gold
spells
relics
upgrades
curses
map state
current node
defeated enemies
unlocks
settings
```

Use a save version and migration function:

```ts
migrateSave(save: UnknownSave): RunSave
```

## 7. Board logic requirements

Board system should be deterministic enough for testing.

Recommended APIs:

```ts
spawnPiece();
movePiece(dx);
rotatePiece();
softDrop();
hardDrop();
lockPiece();
clearLines();
addJunk(count);
clearArea(x, y, radius);
clearRow(row);
isTopOut();
```

## 8. Effect system

Long-term, content effects should be interpreted by a central effect resolver.

Example:

```json
{ "type": "damage_enemy", "value": 22 }
```

Resolver applies to battle state.

## 9. Android packaging

Capacitor config:

```text
appId: com.blockmancer.dungeon
appName: Blockmancer Dungeon
webDir: dist
```

Google Play publishing should use Android App Bundle (`.aab`) for store release. Debug APK is useful for testing.

## 10. Performance targets

| Target         |                   Minimum |
| -------------- | ------------------------: |
| Desktop FPS    |                        60 |
| Mobile FPS     |                     45–60 |
| Initial load   |        < 5 seconds target |
| Memory         | Avoid large texture waste |
| Save operation |                   < 50 ms |

## 11. Error handling

Required fallbacks:

```text
missing asset -> placeholder rectangle/icon
missing content -> safe fallback content
invalid save -> show warning and start new run
unsupported audio -> silently disable audio
```

## 12. Build commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run validate:metadata
npm run validate:content
npm run android:sync
```

## 13. Release branch strategy

Recommended:

```text
main — stable
release/* — release candidate
feature/* — feature development
content/* — content/balance changes
hotfix/* — urgent fixes
```

## 14. Automated checks

Minimum:

```text
TypeScript build
content JSON validation
metadata validation
lint if configured
smoke test script if possible
```

## 11. V2 technical requirements — portrait mobile-first

The runtime should support a fixed portrait-first layout manager.

Required systems:

```text
PortraitLayoutSystem or layout helper
SafeArea calculation
BattleTopPanel
BoardPanel
ControlPanel
InventoryStrip
NextQueuePanel
HoldBlockPanel
```

The game can run on desktop inside a centered portrait frame. Desktop widescreen layout is optional and should not block release.

### Scene layout contract

BattleScene must reserve vertical sections:

```text
battleAreaHeight = screenHeight * 0.20
boardAreaHeight = screenHeight * 0.60
controlAreaHeight = screenHeight * 0.20
```

Allow small adaptive adjustments for extreme aspect ratios, but preserve the visual hierarchy.

### Next and hold block systems

BoardSystem should expose:

```ts
getNextPieces(count: number)
getHoldPiece()
canHoldCurrentPiece()
holdCurrentPiece()
```

UI should never read private BoardSystem state directly.

### Inventory quick view

Run state should expose compact inventory data:

```ts
currentWeaponId;
relicIds;
upgradeIds;
curseIds;
consumableIds; // optional
```

Battle UI should show icons only. Details belong in a tooltip, pause screen, or full inventory screen.

## 12. Boss and stage data requirements

Add boss-specific fields to monster content entries:

```json
{
  "boss": {
    "act": 1,
    "phaseThresholds": [0.66, 0.33],
    "introText": "...",
    "defeatText": "...",
    "musicKey": "music_boss_slime_baron"
  }
}
```

Add stage/act data or a stage generation config:

```text
acts/
  act-1-cracked-dungeon.json
  act-2-goblin-scrapworks.json
  act-3-frost-crypt.json
  act-4-gravity-ruins.json
  act-5-royal-void-keep.json
```

Each act should define enemy pools, boss ID, event pool, shop pool, treasure pool, visual theme, and special board modifiers.
