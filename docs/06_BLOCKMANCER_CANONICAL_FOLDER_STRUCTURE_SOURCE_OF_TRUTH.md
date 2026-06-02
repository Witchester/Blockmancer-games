# Blockmancer Dungeon — Canonical Folder Structure Source of Truth

## 1. Purpose and Authority

This file is the canonical folder and path authority for Blockmancer Dungeon runtime assets.

It is authoritative for asset folder placement, file placement, exact-frame file naming, path policy, and fallback path policy. Read this file before asset implementation, asset audits, asset-pack creation, validation script changes, or artist delivery work.

This file complements `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md`. It does not replace the gameplay, story, release implementation, or reactive difficulty Source of Truth files.

## 2. Canonical Root

Canonical runtime asset root:

```text
public/assets/
```

Rules:
- All runtime assets live under `public/assets/`.
- Content JSON references assets by key, not raw path.
- Raw `public/assets/...` paths must not be hardcoded inside content JSON.
- Legacy paths are fallback-only.
- Manifest primary paths must point at canonical folders.

## 3. Full Canonical Folder Tree

```text
public/assets/
  board-blocks/
  sprites/
    board-blocks/
    heroes/
    monsters/
    bosses/
  effects/
  icons/
    board-blocks/
    battle-objectives/
    boss-rules/
    currencies/
    collectibles/
    chaos-rules/
    items/
    oopsies/
    relics/
    room-events/
    random-gameplay-events/
    status-effects/
    upgrades/
    weapons/
    spells/
    map-nodes/
    hub-buildings/
    route-story/
  stages/
    global-scenes/
    {stage_id}/
      battle/
      puzzle/
      boss-arena/
      map/
      route-scenes/
      props/
  ui/
    panels/
    buttons/
    hud/
    meters/
    mobile-controls/
    story-routes/
    animations/
    placeholders/
  portraits/
    heroes/
    npcs/
    bosses/
  story/
    endings/
    route-cards/
    dialogue-panels/
  audio/
    sfx/
    music/
    ui/
  fonts/
  placeholders/
  store/
  backgrounds/
    legacy/
```

## 4. Stage Folder Rules

Stage folders are product categories, not interchangeable background bins.

- `battle/` is Section 1 combat and battle background art only.
- `puzzle/` is Section 2 puzzle gameplay background art only.
- `boss-arena/` is boss arena background art only.
- `map/` is stage map background art only.
- `route-scenes/` is story and route scene background art only.
- `props/` is stage decoration and prop art only.

Source sizes:
- `battle/`: `1080x480`
- `puzzle/`: `1080x1056`
- `boss-arena/`: `1080x480`
- `map/`: `1080x1920`
- `route-scenes/`: `1080x1920`
- controls panels: `1080x384`

## 5. Background Layout Size Contract

- Section 1 Combat UI and Event Log: 25 percent of portrait layout, `1080x480`.
- Section 2 Puzzle Gameplay Area: 55 percent of portrait layout, `1080x1056`.
- Section 3 Controls, Spells, and Actions: 20 percent of portrait layout, `1080x384`.
- Full portrait scenes: `1080x1920`.

## 6. Exact-Frame PNG Naming Contract

All frame-based sprite animation assets use explicit PNG frame files.

Required filename format:

```text
{asset_id}__{animation_name}__f00.png
{asset_id}__{animation_name}__f01.png
{asset_id}__{animation_name}__f02.png
```

Rules:
- Use a two-digit frame suffix.
- Do not use GIFs as runtime animation sources.
- Do not use frame ranges as delivery contracts.
- Do not use old `_frame_01` names as primary animation files.
- Do not use old flat `spr_*_defeat.png` files as primary animation files.
- If the frame-expanded artist brief lists explicit filenames, that list wins.

Examples:
- Hero: `hero_milo_blockmancer__idle__f00.png`
- Monster: `mon_candy_rat__attack__f00.png`
- Boss: `boss_cupcake_slime_king__defeat__f00.png`
- Board block: `block_bomb__explode__f00.png`
- VFX: `vfx_line_clear__play__f00.png`

## 7. Board Block Folder Rules

- Static base block PNGs may live under `public/assets/board-blocks/` for compatibility.
- Frame-based board block assets live under `public/assets/sprites/board-blocks/{block_id}/`.
- Primary board block frame folders are only:
- `base/`
- `glow/`
- `clear/`
- `special/`
- Board gameplay blocks are `24x24`.
- Board icons are `48x48`.
- Board gameplay blocks must not use `627x627` source size.

## 8. Hero / Monster / Boss Sprite Folder Rules

Hero animation paths:

```text
public/assets/sprites/heroes/{hero_id}/{state}/
```

Monster animation paths:

```text
public/assets/sprites/monsters/{monster_id}/{state}/
```

Boss animation paths:

```text
public/assets/sprites/bosses/{boss_id}/{state}/
```

Rules:
- Character frame source size is `627x627`.
- Character pose sheets use `1254x1254`.
- Runtime anchoring uses bottom-center alignment for battle sprites.
- Missing final frames must warn in development and fall back safely.
- Old single-state `spr_` keys are aliases only when canonical runtime keys exist.

## 9. Effects and VFX Folder Rules

VFX paths:

```text
public/assets/effects/{vfx_id}/
```

Rules:
- VFX uses exact-frame PNG naming.
- VFX source size is `627x627`.
- VFX PNGs use transparent backgrounds.
- VFX anchors are centered unless a specific animation definition overrides that behavior.

## 10. Icon Category Folder Rules

Icon folders and ownership:
- `board-blocks`: board block icons.
- `battle-objectives`: battle objective icons.
- `boss-rules`: boss rule-card icons and rule visuals.
- `currencies`: currency icons.
- `collectibles`: collectible icons.
- `chaos-rules`: chaos rule icons.
- `items`: item icons.
- `oopsies`: Oopsie icons.
- `relics`: relic icons.
- `room-events`: room event icons.
- `random-gameplay-events`: random gameplay event icons.
- `status-effects`: status effect icons.
- `upgrades`: upgrade icons.
- `weapons`: weapon icons.
- `spells`: spell icons.
- `map-nodes`: map node icons.
- `hub-buildings`: hub building icons.
- `route-story`: route triggers, route badges, and route-story icons.

## 11. UI / Story / Portrait / Audio / Font / Placeholder Rules

- UI panels live under `public/assets/ui/panels/`.
- UI buttons live under `public/assets/ui/buttons/`.
- HUD assets live under `public/assets/ui/hud/`.
- Meters live under `public/assets/ui/meters/`.
- Mobile controls live under `public/assets/ui/mobile-controls/`.
- Story route UI lives under `public/assets/ui/story-routes/`.
- UI animation frames live under `public/assets/ui/animations/`.
- UI placeholders live under `public/assets/ui/placeholders/`.
- Story endings live under `public/assets/story/endings/`.
- Route cards live under `public/assets/story/route-cards/`.
- Dialogue panels live under `public/assets/story/dialogue-panels/`.
- Hero portraits live under `public/assets/portraits/heroes/`.
- NPC portraits live under `public/assets/portraits/npcs/`.
- Boss portraits live under `public/assets/portraits/bosses/`.
- SFX live under `public/assets/audio/sfx/`.
- Music lives under `public/assets/audio/music/`.
- UI audio lives under `public/assets/audio/ui/`.
- Fonts live under `public/assets/fonts/`.
- Global placeholder assets live under `public/assets/placeholders/`.

## 12. Legacy and Fallback-Only Paths

- `public/assets/backgrounds/legacy/` is fallback-only.
- Old flat background folders are fallback-only.
- `public/assets/sprites/sprites/...` is invalid as a primary path.
- Old `spr_` and `ico_` checklist names are aliases only when canonical runtime keys exist.
- Legacy paths must not be used for new primary manifest entries.
- Legacy aliases must remain fallback-safe until a documented migration removes them.

## 13. Asset Key vs Raw Path Policy

- Content JSON uses asset keys.
- Scenes and systems should resolve assets through `AssetSystem`.
- Do not hardcode raw `public/assets/...` paths in content.
- Manifest primary paths should be canonical.
- Legacy aliases can exist for compatibility, but they are not primary delivery targets.

## 14. Validation Expectations

- `ensure:asset-folders` must create this folder tree.
- `validate:animations` must validate exact-frame names and two-digit suffixes.
- `sync:assets` must detect canonical assets, explicit frame filenames, and fallback-safe missing production art.
- `audit:asset-variants` must understand canonical folders versus fallback-only folders.
- Missing final art is warning-only unless a release-lock mode explicitly changes that policy.
- Validation must preserve fallback safety and must not require final production art to exist before gameplay can run.


## 15. Encounter Stack and Level-Up Asset Placement Rules

The sequential encounter and Festival Level-Up systems do not introduce new top-level asset folders. They reuse existing canonical categories so asset packs remain simple and fallback-safe.

### 15.1 Monster Stack Preview

Monster stack preview uses existing monster icons:

```text
public/assets/sprites/monsters/{monster_id}/icon/
```

Rules:
- Source icon size remains `627x627` for non-board monster icons.
- Runtime render size is `24-36px` depending device size.
- Active monster icon is fully visible.
- Next monster icon is partially visible behind the active icon.
- Additional monsters use a generic mystery chip from `public/assets/ui/hud/`.
- Content and scenes reference asset keys, not raw paths.

### 15.2 Enemy Entry Pressure/Gift Feedback

Enemy entry warning and gift VFX use existing effects and UI animation folders:

```text
public/assets/effects/vfx_enemy_entry_warning/
public/assets/effects/vfx_enemy_entry_gift/
public/assets/ui/animations/
```

Rules:
- VFX frames use exact-frame PNG naming.
- VFX source size is `627x627` with transparent background.
- Missing VFX must fall back to event log text and a simple UI pulse.


### 15.3 Node Result Screen UI

Node Result Screen assets reuse existing UI, HUD, meter, button, animation, and effects folders. No new top-level folder is required.

```text
public/assets/ui/panels/
public/assets/ui/hud/
public/assets/ui/meters/
public/assets/ui/buttons/
public/assets/ui/animations/
public/assets/effects/vfx_node_clear_sparkle/
```

Recommended asset keys:

```text
ui_panel_node_result
ui_node_clear_banner
ui_xp_gained_counter
ui_xp_remaining_chip
ui_xp_breakdown_row
ui_button_node_result_continue
ui_level_ready_badge
ui_node_result_panel_intro
ui_node_clear_banner_pop
ui_xp_meter_count_up
ui_xp_breakdown_row_pop
ui_level_ready_badge_pulse
vfx_node_clear_sparkle
```

Rules:
- EXP values and remaining EXP must be rendered by game text, not baked into PNGs.
- The EXP meter may reuse `ui_meter_xp`.
- Missing result screen assets must fall back to existing reward/panel/HUD placeholders.
- Result screen assets are post-battle UI assets; they must not be placed in stage background folders.

### 15.4 Festival Level-Up UI and Icons

Level-up UI uses existing UI, HUD, and upgrade icon folders:

```text
public/assets/ui/panels/
public/assets/ui/hud/
public/assets/ui/animations/
public/assets/icons/upgrades/
public/assets/effects/vfx_level_up_sparkle/
public/assets/effects/vfx_upgrade_pickup/
```

Rules:
- Upgrade icons use `public/assets/icons/upgrades/`.
- Upgrade icon source size is `627x627` transparent PNG.
- Upgrade card icons render around `48-64px`.
- Compact chosen-upgrade summaries render around `24-32px`.
- Missing level-up UI art must use existing reward card or panel fallbacks.
- Do not create raw-path references in upgrade JSON.
- Do not add a new folder in an artist brief unless this SOT is updated first.


## 16. Update Policy

- Update this 06 SOT when canonical folder structure changes.
- Do not change folder rules only inside prompts.
- Do not introduce a new folder in an artist brief without updating this SOT.
- Battle and puzzle folder separation must be preserved unless a future SOT update explicitly changes it.
- Preserve save-facing IDs and runtime asset IDs unless a migration is documented.

<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_START -->
## 17. Fever Showtime Asset Placement Rules

The Fever Showtime Cascade system does not introduce new top-level asset folders.

### 17.1 UI / HUD / Meter Assets

Fever UI assets use existing canonical UI folders:

```text
public/assets/ui/meters/
public/assets/ui/hud/
public/assets/ui/buttons/
public/assets/ui/animations/
public/assets/ui/placeholders/
```

Recommended keys:

```text
ui_meter_fever_showtime
ui_badge_fever_ready
ui_badge_showtime_active
ui_chip_fever_locks
ui_chip_charged_lines
ui_chip_fever_heat
ui_button_fever_activate
ui_button_fever_release
ui_badge_boss_drama_guard
ui_chip_showtime_overflow
ui_charged_line_glow
ui_charged_line_release_flash
ui_soft_junk_marker
ui_fever_heat_pulse
ui_boss_drama_guard_pulse
```

Rules:

- Values such as meter amount, Charged Line count, locks remaining, and Heat level must be rendered by game text.
- Do not bake numbers into PNGs.
- Fever UI should use compact HUD/right-rail patterns.
- Do not add a separate top HP/Mana/Fever status bar.

### 17.2 Fever VFX Assets

Fever VFX uses existing effects folder:

```text
public/assets/effects/{vfx_id}/
```

Recommended VFX folders:

```text
public/assets/effects/vfx_fever_showtime_start/
public/assets/effects/vfx_fever_line_charged/
public/assets/effects/vfx_fever_release_burst/
public/assets/effects/vfx_showtime_overflow_sparkle/
public/assets/effects/vfx_soft_junk_splash/
public/assets/effects/vfx_fever_heat_rise/
public/assets/effects/vfx_boss_drama_guard/
public/assets/effects/vfx_star_encore_spawn/
public/assets/effects/vfx_safety_confetti_clear/
```

Rules:

- Use exact-frame PNG naming.
- VFX source size is `627x627` transparent PNG.
- Missing VFX must fall back to event log text and simple UI pulse.
- VFX must not block board readability.

### 17.3 Fever Upgrade Icons

Fever upgrade icons use:

```text
public/assets/icons/upgrades/
```

Recommended keys:

```text
ico_upg_fever_gain
ico_upg_fever_duration
ico_upg_fever_capacity
ico_upg_fever_manual_release
ico_upg_fever_safety_release
ico_upg_fever_overflow
ico_upg_fever_star_encore
```

Rules:

- Source size is `627x627`.
- Transparent background.
- Missing icons fall back through the existing upgrade placeholder system.
- Upgrade JSON must reference asset keys, not raw paths.

### 17.4 Charged Line and Soft Junk Board Feedback

Charged Line and Soft Junk visuals should be overlays/metadata-driven feedback unless the runtime intentionally creates a special board-block content entry.

Allowed primary placement:

```text
public/assets/ui/animations/
public/assets/effects/
```

Use board-block folders only if a real board block content ID is created and validated:

```text
public/assets/sprites/board-blocks/{block_id}/
```

Rules:

- Board gameplay blocks remain `24x24`.
- Board icons remain `48x48`.
- Charged Line overlay must not change block identity unless the runtime supports it.
- Soft Junk must not create raw-path content references.
- No Fever asset may be delivered in legacy background folders.
<!-- FEVER_SHOWTIME_CASCADE_UPDATE_2026_06_02_END -->
