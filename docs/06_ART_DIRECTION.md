# Art Direction

## 1. Visual identity

Blockmancer Dungeon should look like a dark fantasy arcade puzzle game, not a classic falling-block clone.

Keywords:

```text
arcane dungeon
magical rune blocks
glowing spell UI
dark stone panels
colorful but moody
readable combat board
```

## 2. Avoiding clone feel

Avoid:

```text
classic falling-block colors as the only identity
plain black board with simple colored rectangles only
marketing screenshots that look like a standard falling-block clone
using protected names/terminology in UI or marketing
```

Use:

```text
rune motifs
monster panel
spell cards
mana bars
combat damage numbers
dungeon map
special block icons
```

## 3. Asset categories

Required release art:

```text
UI panels/buttons/bars
board background
normal block sprites
special block sprites
monster sprites
hero portraits/spites
spell icons
relic icons
upgrade icons
weapon icons
map node icons
effect sprites
store capsule/key art
app icon
splash screen
```

## 4. Sprite size guide

| Asset                     |                        Size |
| ------------------------- | --------------------------: |
| Board blocks              |              32x32 or 48x48 |
| Spell/relic/upgrade icons |                       64x64 |
| Monster sprites           |          128x128 or 192x192 |
| Hero portraits            |                     256x256 |
| Map nodes                 |                       64x64 |
| UI buttons                |                      256x64 |
| Panels                    | 512x256 or scalable 9-slice |
| Effects                   |          128x128 or 256x256 |
| App icon                  |            1024x1024 source |

## 5. Block design

Each block must be readable at small sizes.

| Block       | Visual direction          |
| ----------- | ------------------------- |
| Red Rune    | red-orange rune glow      |
| Blue Rune   | blue arcane symbol        |
| Green Rune  | emerald glyph             |
| Yellow Rune | golden tile               |
| Magic       | purple star/rune          |
| Bomb        | dark core with red fuse   |
| Stone       | cracked grey chunk        |
| Ice         | pale blue shine           |
| Junk        | dirty dark scrap          |
| Void        | black center, purple edge |

## 6. Monster visual direction

### Slime

Round, readable, low threat, bouncy.

### Goblin

Small, mischievous, carries junk blocks.

### Bat

Flying silhouette, preview-disruption identity.

### Stone Golem

Large blocky body, armor identity.

### Witch

Magic silhouette, mana hex identity.

### Elite Knight

Heavy armor, red/black elite highlight.

### Falling King

Crowned boss, broken gravity, floating blocks around him.

## 7. UI style

Panels should feel like magical stone cards. Buttons should be high contrast.

Rarity colors:

```text
common: grey/white
uncommon: green
rare: blue/purple
epic: violet/gold
legendary: gold/orange
cursed: red/dark purple
```

## 8. Animation priorities

Release minimum:

```text
line clear flash
piece lock pulse
enemy hit flash
enemy attack shake
spell cast effect
reward card select
boss phase transition
```

Can be sprite-based, tween-based, or particle-based.

## 9. Store art direction

Store screenshots should show:

1. Board + enemy combat.
2. Spell casting.
3. Reward selection.
4. Roguelike map.
5. Boss fight.

Do not make the first screenshot look like a plain puzzle board only.

## 10. V2 final theme — pixel-art 32-bit dark fantasy

The final visual style should be **pixel-art / 32-bit inspired**, not smooth vector UI.

Core direction:

```text
32-bit handheld/console RPG battle energy
arcade puzzle readability
high-contrast pixel UI
dark fantasy dungeon mood
rune magic and monster silhouettes
```

### Pixel style rules

```text
- Use crisp pixel edges.
- Avoid anti-aliased vector shapes for final sprites.
- Use limited palettes per biome/act.
- Use readable silhouettes before detail.
- Use 1px or 2px pixel outlines depending on sprite scale.
- Use glow effects sparingly; fake them with pixel clusters where possible.
```

### Font direction

Required font categories:

```text
Primary UI font: readable pixel font for labels/buttons
Number font: bold pixel font for damage, mana, gold, combo
Title font: decorative fantasy pixel font
Fallback font: monospace only during development
```

Font requirements:

```text
- Must support English characters and punctuation.
- Must remain readable on small mobile screens.
- Must include license suitable for commercial release.
- Must be listed in credits/licenses.
```

Potential font sources:

```text
Open Font License pixel fonts
self-made bitmap font
commercial pixel font pack with clear license
```

Do not include fonts in the repo unless the license is confirmed.

## 11. Portrait battle composition

Top 1/5 combat area should use a compact JRPG side-view layout:

```text
Hero side: left or bottom-left
Enemy side: right or top-right
HP bars: close to portraits/sprites
Intent: near enemy
Damage numbers: over target
Spell effects: short and readable
```

For bosses, the boss sprite can occupy more horizontal width, but must not make the board smaller.

## 12. Act visual themes

|                 Act | Palette                          | Motifs                              |
| ------------------: | -------------------------------- | ----------------------------------- |
|   1 Cracked Dungeon | grey, purple, moss green         | stone, slime, runes                 |
| 2 Goblin Scrapworks | rusty orange, brass, dirty green | scrap, gears, junk                  |
|       3 Frost Crypt | dark blue, cyan, bone white      | ice, bones, candles                 |
|     4 Gravity Ruins | indigo, gold, slate              | floating stones, orbs               |
|   5 Royal Void Keep | black, violet, royal red, gold   | crowns, void cracks, cursed banners |

## 13. Required release asset additions

```text
fonts/
  pixel-ui-font
  pixel-number-font
  pixel-title-font

ui/portrait/
  battle-frame
  board-frame
  control-frame
  hold-slot
  next-queue-frame
  inventory-strip-frame

bosses/
  slime-baron
  junkmaster-gob
  cryo-lich
  stone-titan
  mirror-witch
  falling-king
```
