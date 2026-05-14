# Asset Pipeline

## 1. Asset location

Use:

```text
public/assets/
```

Recommended structure:

```text
public/assets/
  ui/
    panels/
    buttons/
    bars/
    icons/
    frames/
  board/
  blocks/
  effects/
  monsters/
  heroes/
  spells/
  relics/
  upgrades/
  weapons/
  map/
  audio/
```

## 2. Asset manifest

Centralize asset loading in:

```text
src/game/data/assets.ts
```

The manifest should export:

```ts
IMAGE_ASSETS;
SPRITESHEET_ASSETS;
AUDIO_ASSETS;
hasAssetKey();
getAssetKey();
```

## 3. Content references

Content should reference assets by key, not path.

Example:

```json
{
  "id": "spl_fireball",
  "iconKey": "spell_fireball",
  "effectKey": "effect_fireball"
}
```

## 4. Fallback rule

If texture does not exist:

```text
render placeholder rectangle/icon/text
log warning only in dev mode
never crash release build
```

## 5. Naming convention

| Type         | Example key        |
| ------------ | ------------------ |
| Monster idle | `mon_slime_idle`   |
| Spell icon   | `spell_fireball`   |
| Relic icon   | `rel_goblin_coin`  |
| Upgrade icon | `upg_sharp_edges`  |
| Block sprite | `block_magic`      |
| UI panel     | `ui_panel_default` |
| Map node     | `node_boss`        |

## 6. PNG vs spritesheet

### Use individual PNGs for:

```text
MVP
icons
small UI assets
single monster pose
```

### Use spritesheets/atlases for:

```text
animated monsters
spell effects
large UI skin
release optimization
```

## 7. Import process

When adding new asset:

```text
1. Add file to public/assets
2. Add key/path to assets.ts
3. Reference key in content JSON
4. Confirm BootScene loads it
5. Confirm fallback works if file is removed
6. Run build
```

## 8. Required release asset checklist

```text
[ ] App icon
[ ] Splash screen
[ ] Main menu background
[ ] UI panels/buttons
[ ] HP/mana bars
[ ] All block sprites
[ ] All MVP monster sprites
[ ] All hero portraits
[ ] All spell icons
[ ] All relic icons
[ ] All upgrade icons
[ ] All map node icons
[ ] Spell effects
[ ] Line clear effect
[ ] Enemy hit effect
[ ] Store screenshots/key art
```

## 9. Texture atlas roadmap

Before release candidate, evaluate packing these into atlases:

```text
ui_atlas
blocks_atlas
icons_atlas
monsters_atlas
effects_atlas
```

## 10. Licensing

Every external asset must be recorded in `18_CREDITS_AND_LICENSES.md`.

## 9. V2 required pixel-art asset pipeline additions

Add final-ready folder categories:

```text
public/assets/fonts/
public/assets/ui/portrait/
public/assets/bosses/
public/assets/acts/
public/assets/inventory/
```

### Required font assets

```text
pixel-ui-font
pixel-number-font
pixel-title-font
```

Store license documents next to fonts or in `docs/18_CREDITS_AND_LICENSES.md`.

### Portrait UI assets

```text
battle_frame.png
board_frame.png
control_frame.png
hold_slot_empty.png
hold_slot_active.png
next_queue_frame.png
inventory_strip_frame.png
spell_button_ready.png
spell_button_disabled.png
spell_button_pressed.png
```

### Boss assets

Each boss should eventually include:

```text
idle.png
attack.png
hit.png
phase2.png
phase3.png
death.png
portrait.png
icon.png
```

For MVP-to-alpha transition, `idle.png` and `icon.png` are enough.
