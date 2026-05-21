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

## 15. Update Policy

- Update this 06 SOT when canonical folder structure changes.
- Do not change folder rules only inside prompts.
- Do not introduce a new folder in an artist brief without updating this SOT.
- Battle and puzzle folder separation must be preserved unless a future SOT update explicitly changes it.
- Preserve save-facing IDs and runtime asset IDs unless a migration is documented.
