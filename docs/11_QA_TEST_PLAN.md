# QA Test Plan

## 1. QA goals

Ensure the game is stable, understandable, fair, and releasable on target platforms.

## 2. Test categories

```text
functional
regression
content validation
balance
mobile/device
performance
save/load
accessibility
release smoke
```

## 3. Functional test checklist

### Main menu

```text
[ ] New Run starts
[ ] Continue works when save exists
[ ] Continue hidden/disabled when no save
[ ] Settings opens
[ ] Credits opens
```

### Hero select

```text
[ ] Hero cards display stats
[ ] Locked heroes cannot be selected
[ ] Selected hero loadout applies
```

### Map

```text
[ ] Start node works
[ ] Available nodes are clickable
[ ] Locked nodes are not clickable
[ ] Completed nodes display completed state
[ ] Each node type opens correct scene
```

### Battle

```text
[ ] Piece spawns
[ ] Piece moves left/right
[ ] Piece rotates
[ ] Soft drop works
[ ] Hard drop works
[ ] Piece locks
[ ] Lines clear
[ ] Top-out triggers game over
[ ] Enemy HP decreases on line clear
[ ] Mana increases on line clear
[ ] Combo increments/resets correctly
[ ] Enemy attacks after correct lock count
[ ] Enemy behavior applies
[ ] Enemy death opens reward scene
```

### Spells

```text
[ ] Fireball damages enemy
[ ] Frost Lock reduces fall speed/delays enemy
[ ] Bomb Rune damages and clears area
[ ] Void Cut clears row
[ ] Not enough mana warning appears
[ ] Spell buttons update disabled state
```

### Rewards

```text
[ ] 3 rewards appear
[ ] Picking reward applies effect
[ ] Relic/upgrade list updates
[ ] Stage increases
[ ] Return to map works
```

### Events/shops/rest/treasure

```text
[ ] Event choices apply effects
[ ] Shop purchases deduct gold
[ ] Shop blocks purchase if not enough gold
[ ] Rest heals correctly
[ ] Treasure grants reward/gold
```

## 4. Save/load tests

```text
[ ] Save created on new run
[ ] Save updates after room
[ ] Refresh keeps progress
[ ] Continue restores correct scene/state
[ ] Invalid save recovers gracefully
[ ] Game over clears or archives run save
[ ] Version migration works
```

## 5. Content validation tests

```text
[ ] npm run validate:metadata
[ ] npm run validate:content
[ ] No duplicate IDs
[ ] All loot table references exist
[ ] All starting loadout IDs exist
[ ] All effect types are supported or safely ignored
[ ] All enabled content can be reached or is intentionally locked
```

## 6. Mobile/device tests

Test on:

```text
small Android phone
large Android phone
tablet if possible
Chrome mobile
desktop Chrome
Firefox
Edge/Safari if possible
```

Mobile checklist:

```text
[ ] Buttons large enough
[ ] No critical UI hidden by browser bars
[ ] Board fits screen
[ ] Touch controls responsive
[ ] Rotate/drop not easily mis-tapped
[ ] Performance stable
[ ] Audio starts after user gesture
```

## 7. Performance tests

```text
[ ] No major frame drops during line clear
[ ] No frame drops during boss attacks
[ ] No memory climb across 5 runs
[ ] Asset load completes reliably
[ ] Build size acceptable
```

## 8. Balance test metrics

Record:

```text
run result
stage reached
death reason
hero used
max combo
spells cast
rewards selected
fall speed at death/win
HP after each room
boss HP at death
```

## 9. Release smoke test

Before every release candidate:

```text
[ ] Fresh install/load
[ ] Complete one run or die naturally
[ ] Start second run
[ ] Settings persist
[ ] Save/load persists
[ ] Build version visible
[ ] Credits/licenses accessible
[ ] No console errors in normal gameplay
```

## 10. Bug severity

| Severity | Meaning                                                     |
| -------- | ----------------------------------------------------------- |
| Blocker  | Crash, cannot start/finish game, data loss.                 |
| Critical | Major system broken, frequent softlock, severe input issue. |
| Major    | Important feature broken but workaround exists.             |
| Minor    | Visual/audio/text issue.                                    |
| Tuning   | Balance issue.                                              |

## 12. V2 portrait mobile QA checklist

```text
[ ] Game boots in portrait orientation
[ ] Top battle panel uses roughly 1/5 screen height
[ ] Board uses roughly 3/5 screen height
[ ] Controls use roughly 1/5 screen height
[ ] Board cells remain tappable/readable on small devices
[ ] Hold block is visible
[ ] Next block queue is visible
[ ] Inventory quick strip is visible or collapsible
[ ] Spell buttons are reachable by thumb
[ ] No critical UI overlaps notch/navigation bar
[ ] Damage numbers do not obscure active falling piece
[ ] Event log/toasts do not cover controls
[ ] Boss sprite does not reduce board readability
```

## 13. V2 content expansion QA checklist

```text
[ ] Every hero has unlock condition text
[ ] Every hero has short story text
[ ] Every boss has phase data
[ ] Every act has enemy pool
[ ] Every new monster has readable intent
[ ] Every new monster has at least one counterplay route
[ ] Bosses are beatable with at least three build types
[ ] Unlocks trigger correctly after run summary
```

## 14. Release 1.0 dev-only QA debug tools

Debug tools are available only in Vite dev mode through the main menu `QA Debug` button. They must not appear in production builds.

```text
[ ] `npm run dev` shows QA Debug on the main menu
[ ] `npm run build` production build does not expose QA Debug on the main menu
[ ] Opening DebugScene outside dev returns to MainMenuScene
[ ] Give 100 Gold updates run gold and save data
[ ] Give Item adds an enabled item to inventory
[ ] Give Relic applies a relic reward
[ ] Give Upgrade applies an upgrade reward
[ ] Spawn Monster starts a battle with a regular monster
[ ] Trigger Boss starts a boss battle for the current stage
[ ] Force Reward opens RewardScene with debug reward choices
[ ] Force Cascade Test opens a battle with a cascade-ready board
[ ] Jump To Stage resets the map and sets the selected stage
[ ] Clear Run Save removes the current run save and starts a fresh debug run
```

## 15. Release 1.0 smoke test checklist

Run this after content, balance, save, UI, or debug changes.

```text
[ ] npm run validate:content
[ ] npm run build
[ ] Start dev server
[ ] Start a new run
[ ] Enter first battle
[ ] Move, rotate, soft drop, hard drop
[ ] Clear one line
[ ] Verify cascade-capable board behavior
[ ] Cast a spell
[ ] Defeat monster
[ ] Choose a reward
[ ] Move on map
[ ] Refresh browser
[ ] Continue restores the run
[ ] Open Settings and change one option
[ ] Refresh and confirm setting persists
[ ] In dev mode, use QA Debug to force reward, boss, stage jump, and cascade board
```
