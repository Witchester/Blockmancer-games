# Asset Variant Integration Report
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## Current Follow-up — 2026-05-18

The integration is valid and should be kept.

### What is done

- Board, hero, monster, boss, stage, map node, reward/control, and audio variant resolution is implemented.
- BattleScene uses board glow/clear states, hero/monster states, boss phase variants, and stage background layers.
- Missing variants safely fall back.

### What remains

- Add final art for optional legacy/future blocks if they stay in scope.
- Add final hero art for Bloop/Professor only if they stay selectable.
- Add dedicated VFX hooks to individual spell/status systems as those behaviors become concrete.
- Add final licensed BGM/SFX files.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

Generated: 2026-05-15

## Categories Now Supporting Variants

- Board blocks: base, glow, clear, icon.
- Heroes: idle, cast, attack, hit, victory, defeat, portrait, locked, icon.
- Monsters: idle, attack, hit, defeat, icon.
- Bosses: idle, attack, special, phase_2, hit, defeat, intro_portrait, icon.
- Stages: battle, far/mid/near battle layers, map background, boss arena.
- Map nodes: available, current, completed, locked.
- Rewards and battle controls: category icon resolution with new `ico_` / `icon_` names before legacy fallbacks.
- Audio: `playSfx` / `playBgm` helpers can play raw keys when files exist and fall back to synthesized cue tones.

## Code Updated

- `src/game/data/assets.ts` now preloads convention-based expanded asset keys from the current content registry.
- `src/game/systems/AssetSystem.ts` now resolves variant textures through normalized helper APIs.
- `src/game/systems/AudioSystem.ts` now exposes key-based SFX/BGM helpers with fallback cues.
- `src/game/scenes/BattleScene.ts` now uses block glow/clear states, hero state sprites, monster/boss state sprites, and stage background layers.
- `src/game/scenes/HeroSelectScene.ts` now uses hero portrait/icon/locked variants where available.
- `src/game/scenes/MapScene.ts` now uses map node state variants.
- `src/game/scenes/RewardScene.ts` now resolves reward icons through the asset resolver.

## Content And Schema Updated

- `src/game/content/board-blocks/metadata.json` documents optional `assetRefs`.
- Board block JSON keeps the legacy `spriteKey` but now includes explicit `assetRefs` where matching checklist/repo files exist.
- Existing content IDs and save-facing IDs were not renamed.

## Variants Used In Gameplay

- Board cells use `base` normally.
- Board cells use `glow` during Fever, floating-warning display, and cascade gravity frames.
- Board cells use `clear` during cascade clear frames when available.
- Hero battle portrait uses `idle`, switches to `cast` on spell cast, `hit` on damage, and `victory` when a battle is won.
- Enemy sprite uses `idle`, switches to `attack` for enemy actions, `hit` on damage, `defeat` on victory, and boss `phase_2` on phase changes.
- Battle scene uses stage far/mid/near background layers when available.
- Map scene uses node state icons for current/available/completed/locked states.

## Fallback Behavior

- Variant resolver order is: explicit `assetRefs` / `backgrounds`, inferred new key, legacy key field, old runtime key, category fallback texture.
- Missing glow/clear/icon/state assets fall back to base or existing placeholder textures.
- Missing audio files continue to use `AudioSystem` synthesized fallback tones.

## Detected Coverage

- Board blocks audited: 21.
- Heroes audited: 8.
- Stages audited: 6.
- Missing optional variants: 26, mostly legacy extra blocks and non-release hero entries; all fall back safely.
- Detailed audit: `docs/ASSET_VARIANT_AUDIT.md`.

## Remaining Manual Work

- Add final variant art for `block_junk`, `block_magic`, `block_stone`, and `block_void` if those blocks should use expanded visuals.
- Add hero state art for `hero_bloop_slime_friend` and `hero_poplin_professor` if they remain selectable.
- Wire dedicated VFX assets into individual spell/status systems as those effect systems gain concrete animation hooks.
- Add licensed BGM/SFX files at the expected `public/assets/audio/` paths.