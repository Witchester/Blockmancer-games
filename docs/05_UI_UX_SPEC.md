# UI / UX Specification

## 1. UX goals

1. The board must always be readable.
2. Enemy intent must always be clear.
3. Spell costs and available mana must be visible.
4. Reward choices must be understandable in 3 seconds.
5. Mobile controls must be large and forgiving.

## 2. Main screen flow

```text
Boot
-> Main Menu
-> Hero Select
-> Map
-> Room Scene
   -> Battle
   -> Event
   -> Shop
   -> Rest
   -> Treasure
-> Reward
-> Map
-> Game Over / Victory
```

## 3. Main menu

Required buttons:

```text
New Run
Continue
Settings
How to Play
Credits
```

## 4. Hero select

Hero card should show:

```text
portrait
name
class
HP
mana
starting weapon
starting spells
passive
unlock condition
```

## 5. Battle HUD

Required visible information:

```text
player HP
mana
gold
stage
fall speed
combo
enemy HP
enemy intent
next piece
spell buttons
relic/upgrade list
event log
```

## 6. Layout priority

### Desktop

```text
Left: player/map/log secondary info
Center: board
Right: enemy/spells/relics
Bottom: controls/log
```

### Mobile portrait

```text
Top: compact player/enemy status
Center: board
Below board: mobile controls
Bottom drawer: spells/log/relics
```

### Mobile landscape

```text
Left: board
Right: enemy/spells
Bottom: controls
```

## 7. Board readability

Block colors should be distinct by shape/type. Avoid relying only on color; use symbols or small internal patterns for special blocks.

Examples:

```text
Magic block: star/rune mark
Bomb block: round bomb mark
Stone block: cracked texture
Ice block: shine mark
Junk block: dark clutter mark
Void block: black/purple center
```

## 8. Spell button requirements

Each spell button shows:

```text
icon
spell name or number
mana cost
cooldown/disabled state
short tooltip on hover/hold
```

Disabled state reasons:

```text
not enough mana
no enemy target
cooldown
status effect prevents cast
```

## 9. Reward UI

Each reward card shows:

```text
icon
name
rarity
type
short effect
synergy tag if applicable
```

Reward cards should avoid long paragraphs.

## 10. Event log

Event log should be readable but not spammy.

Important events:

```text
line clear damage
mana gained
spell cast
enemy attack
enemy behavior
reward picked
status applied
death cause
```

## 11. Accessibility

Release minimum:

```text
[ ] Colorblind-safe block option
[ ] Screen shake intensity setting
[ ] Sound/music volume sliders
[ ] Reduced motion option
[ ] Large text option
[ ] Keyboard remapping later if possible
[ ] Mobile button scale setting
```

## 12. Onboarding

First-time tutorial should teach:

1. Move and rotate pieces.
2. Clear a line to attack.
3. Mana comes from line clears.
4. Spells can save the board.
5. Enemy intent shows incoming danger.
6. Rewards change the run.

Recommended tutorial format:

```text
first run popups
short objective cards
skip button
no forced long tutorial
```

## 13. Settings screen

Required:

```text
music volume
SFX volume
screen shake amount
mobile button size
colorblind mode
reduced motion
clear save
credits
privacy link if analytics added
```

## 14. UX polish priorities

1. Damage numbers.
2. Mana gain popup.
3. Enemy intent icon/animation.
4. Clear line flash.
5. Spell cast animation.
6. Reward card hover/tap animation.
7. Smooth scene transitions.

## 15. V2 primary layout — portrait only

The primary release layout is **mobile portrait only**. Desktop may use a scaled portrait frame instead of a separate widescreen layout. Landscape support is optional after release.

### Portrait vertical ratio

```text
┌────────────────────────────┐
│ Top 1/5                    │
│ Battle screen              │
│ Suikoden-style combat area │
├────────────────────────────┤
│ Middle 3/5                 │
│ Falling-block board        │
│ Next / hold / inventory    │
│ compact overlays           │
├────────────────────────────┤
│ Bottom 1/5                 │
│ Mobile controls            │
│ Movement + spells          │
└────────────────────────────┘
```

### Top 1/5 — battle screen

Purpose:

```text
Show RPG combat fantasy without stealing attention from the board.
```

Must include:

```text
- Hero portrait or small hero sprite
- Enemy/boss sprite
- Player HP bar
- Enemy HP bar
- Enemy intent
- Stage/act indicator
- Mana mini bar or mana number
- Damage/heal popups
```

Style reference:

```text
Compact 32-bit JRPG battle stage similar in spirit to classic party-vs-enemy combat layouts.
Use side-view composition: hero/team side vs enemy side.
```

Do not include large spell inventory here. The top is for combat feedback, not controls.

### Middle 3/5 — board screen

Purpose:

```text
The board is the primary gameplay area and must remain readable at all times.
```

Must include:

```text
- 10x20 or release-selected board
- Active falling block
- Locked blocks
- Special block symbols
- Hold block panel
- Next block queue
- Compact inventory/relic strip
- Combo indicator
```

Recommended placement:

```text
Board centered.
Hold block: left side of board or top-left board overlay.
Next block queue: right side of board or top-right board overlay.
Inventory/relic quick strip: below board but above controls, or collapsed side rail.
```

The board must not be covered by large event log messages. Use small toast messages or top battle popups.

### Bottom 1/5 — mobile controls

Purpose:

```text
Make one-handed/two-thumb mobile play comfortable.
```

Must include:

```text
- Move left
- Move right
- Rotate
- Soft drop / hard drop
- Hold block
- Spell buttons 1–4
```

Recommended control grouping:

```text
Left half: movement/rotate/drop
Right half: spells and hold
```

Minimum tap target:

```text
44px logical minimum
Prefer 56px+ for main buttons
```

## 16. Inventory, next block, and hold block rules

### Next block queue

Required:

```text
- Show at least 1 next block in MVP
- Release target: show 3 next blocks
- Use miniature pixel block previews
- Do not use text-only next block display in release
```

### Hold block

Required:

```text
- Hold slot visible during battle
- Empty state clearly shown
- Disabled state shown after hold used until piece lock
- Hold button accessible in bottom controls
```

### Inventory quick view

Battle inventory is not a full inventory screen. It is a quick status strip.

Show:

```text
- Current weapon icon
- 3–5 most important relic icons
- Current curse count
- Potion/consumable slot if added
```

Interactions:

```text
Tap icon: show short tooltip
Long press: show detail card
Swipe/collapse: optional after release
```

Full inventory/details screen can be shown from map, shop, reward, or pause menu.

## 17. Portrait UI safe-area rules

Mobile release must account for:

```text
- Notch / camera cutout
- Android navigation bar
- iOS home indicator if ported later
- Different aspect ratios
- Small devices
```

All critical controls must remain inside safe area.

## 18. UI priority in battle

Priority order:

```text
1. Board readability
2. Control reliability
3. HP/mana/enemy intent
4. Next/hold block visibility
5. Spell availability
6. Inventory/relic summary
7. Event log/history
```

If screen size is too small, event log should collapse first, then inventory details. Never hide the board, controls, HP, enemy intent, next block, or hold block.
