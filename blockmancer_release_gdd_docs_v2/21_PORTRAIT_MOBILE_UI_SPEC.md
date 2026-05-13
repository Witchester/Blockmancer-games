# Portrait Mobile UI Specification

## 1. Purpose

This document defines the primary release layout for Blockmancer Dungeon. The game should be designed for portrait mobile first.

## 2. Global rule

The battle scene uses fixed vertical proportions:

```text
Top 1/5: battle screen
Middle 3/5: Tetris/falling-block board
Bottom 1/5: mobile controls
```

This is the default UX target for Android release.

## 3. Layout wireframe

```text
┌────────────────────────────────┐
│ ACT 2-4      HP 24/30  MP 70   │
│                                │
│ Hero sprite        Enemy sprite │
│ Blockmancer        Goblin       │
│ HP bar             Enemy HP bar │
│ Intent: Throw Junk in 3 locks   │
├────────────────────────────────┤
│ Hold     ┌──────────────┐ Next │
│ [T]      │              │ [L]  │
│          │              │ [O]  │
│          │    BOARD     │ [I]  │
│          │    10x20     │      │
│ Inv: wand relic relic curse     │
├────────────────────────────────┤
│  ◀      Rotate       ▶         │
│  Hold   Drop   Fire Frost Bomb │
│         Void                  │
└────────────────────────────────┘
```

## 4. Top 1/5 — battle screen

Required elements:

```text
- Act/stage label
- Player HP
- Mana
- Hero sprite/portrait
- Enemy sprite
- Enemy HP
- Enemy intent
- Lock countdown or attack timer
- Damage/heal popups
```

Optional elements:

```text
- Gold count
- Current combo
- Boss phase marker
```

Top battle screen should feel like a compact classic JRPG battle panel, not a normal HUD bar.

## 5. Middle 3/5 — board screen

Required elements:

```text
- Board
- Hold block slot
- Next block queue
- Inventory/relic quick strip
- Combo indicator
- Fall speed indicator
```

Board rules:

```text
- Board must be centered.
- Board should use the maximum size possible without overlapping controls.
- Board must remain readable on 720x1280 and similar screens.
- Special blocks must use symbols/patterns, not only colors.
```

Next queue:

```text
MVP: 1 next block
Release: 3 next blocks
Stretch: 5 next blocks via upgrade/relic
```

Hold slot:

```text
- Always visible
- Empty state visible
- Disabled state after use
- Tap hold slot or hold button to hold piece
```

Inventory quick strip:

```text
- Weapon icon
- Up to 5 relic/upgrade icons
- Curse count
- Consumable slot if added
```

## 6. Bottom 1/5 — controls

Required controls:

```text
Move left
Move right
Rotate
Soft drop / hard drop
Hold
Spell 1
Spell 2
Spell 3
Spell 4
```

Recommended button layout:

```text
Left side:
- Left
- Rotate
- Right
- Drop

Right side:
- Hold
- Spell 1
- Spell 2
- Spell 3
- Spell 4
```

Alternative:

```text
Bottom row 1: movement
Bottom row 2: hold + spells
```

## 7. Event log behavior in portrait

A large persistent event log does not fit in battle portrait mode.

Use:

```text
- Short combat toasts
- Damage numbers
- Small recent-event ticker
- Full log available from pause/menu
```

## 8. Reward/event/shop screens

These screens still use portrait layout but do not need the 1/5, 3/5, 1/5 battle split.

Reward screen priority:

```text
Top: title and current build summary
Middle: 3 reward cards
Bottom: reroll/skip/confirm buttons if applicable
```

Shop screen priority:

```text
Top: gold and HP/mana
Middle: shop cards
Bottom: leave button
```

## 9. Desktop behavior

For desktop/web, use a centered portrait game frame:

```text
- Keep same portrait UI
- Add optional side margins/background art
- Do not redesign gameplay into landscape unless later milestone
```

## 10. Acceptance checklist

```text
[ ] Battle UI respects 1/5, 3/5, 1/5 proportions
[ ] Board remains the main visual element
[ ] Next queue is visible
[ ] Hold block is visible
[ ] Inventory quick strip is visible or collapsible
[ ] Spell buttons show cost/disabled state
[ ] Controls are thumb-friendly
[ ] Top battle panel communicates enemy intent
[ ] Bosses fit within top battle panel
[ ] Event messages do not block board or controls
```
