# Asset Brief Frame Expansion Changelog

Generated: 2026-05-21

## Summary

Updated the artist brief so sprite-animation rows list explicit PNG frame filenames instead of one single state key.

## Files Changed

- Source read: `blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_CANONICAL_PATHS_FIXED.md`
- Updated brief generated: `blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_CANONICAL_PATHS_FIXED_FRAME_EXPANDED.md`

## Total Sprite Animation Entries Converted

- Total converted: **222**
- Boss entries converted: **42**
- Monster entries converted: **144**
- Hero entries converted: **36**

## Frame Count Rules Applied

### Bosses

- idle: 6 frames (`f00`-`f05`)
- attack: 8 frames (`f00`-`f07`)
- hit: 4 frames (`f00`-`f03`)
- phase_change: 8 frames (`f00`-`f07`)
- special_attack: 8 frames (`f00`-`f07`)
- defeat: 10 frames (`f00`-`f09`)
- portrait_icon: 1 frame (`f00`)

### Monsters

- idle: 4 frames (`f00`-`f03`)
- attack: 6 frames (`f00`-`f05`)
- hit: 3 frames (`f00`-`f02`)
- defeat: 6 frames (`f00`-`f05`)

### Heroes

- idle: 4 frames (`f00`-`f03`)
- cast_spell: 6 frames (`f00`-`f05`)
- attack: 6 frames (`f00`-`f05`)
- hit: 3 frames (`f00`-`f02`)
- victory: 5 frames (`f00`-`f04`)
- defeat_tired: 4 frames (`f00`-`f03`)

## Notes

- Hero `attack` rows were expanded to 6 frames because the canonical folder structure includes hero `attack/` and the brief labels these rows as `attack or cast spell`.
- Static hero portrait and silhouette rows were not expanded because they are not animation rows.
- Static NPC, hub, weapon, UI, icon, portrait, and background rows were not changed.
- This pass focused on `spr_boss_*`, `spr_mon_*`, and animated `spr_hero_*` entries, matching the requested sprite-animation entry format.

## Sample Converted Entries

- `spr_boss_cupcake_slime_king_idle` -> `spr_boss_cupcake_slime_king__idle__f00.png` ... `spr_boss_cupcake_slime_king__idle__f05.png` (6 frames)
- `spr_boss_cupcake_slime_king_attack` -> `spr_boss_cupcake_slime_king__attack__f00.png` ... `spr_boss_cupcake_slime_king__attack__f07.png` (8 frames)
- `spr_boss_cupcake_slime_king_special` -> `spr_boss_cupcake_slime_king__special_attack__f00.png` ... `spr_boss_cupcake_slime_king__special_attack__f07.png` (8 frames)
- `spr_boss_cupcake_slime_king_phase_2` -> `spr_boss_cupcake_slime_king__phase_change__f00.png` ... `spr_boss_cupcake_slime_king__phase_change__f07.png` (8 frames)
- `spr_boss_cupcake_slime_king_hit` -> `spr_boss_cupcake_slime_king__hit__f00.png` ... `spr_boss_cupcake_slime_king__hit__f03.png` (4 frames)
- `spr_boss_cupcake_slime_king_defeat` -> `spr_boss_cupcake_slime_king__defeat__f00.png` ... `spr_boss_cupcake_slime_king__defeat__f09.png` (10 frames)
- `spr_boss_cupcake_slime_king_intro_portrait` -> `spr_boss_cupcake_slime_king__portrait_icon__f00.png` ... `spr_boss_cupcake_slime_king__portrait_icon__f00.png` (1 frames)
- `spr_mon_cupcake_slime_idle` -> `spr_mon_cupcake_slime__idle__f00.png` ... `spr_mon_cupcake_slime__idle__f03.png` (4 frames)
- `spr_mon_cupcake_slime_attack` -> `spr_mon_cupcake_slime__attack__f00.png` ... `spr_mon_cupcake_slime__attack__f05.png` (6 frames)
- `spr_mon_cupcake_slime_hit` -> `spr_mon_cupcake_slime__hit__f00.png` ... `spr_mon_cupcake_slime__hit__f02.png` (3 frames)
- `spr_mon_cupcake_slime_defeat` -> `spr_mon_cupcake_slime__defeat__f00.png` ... `spr_mon_cupcake_slime__defeat__f05.png` (6 frames)
- `spr_mon_sugar_bat_idle` -> `spr_mon_sugar_bat__idle__f00.png` ... `spr_mon_sugar_bat__idle__f03.png` (4 frames)
- `spr_mon_sugar_bat_attack` -> `spr_mon_sugar_bat__attack__f00.png` ... `spr_mon_sugar_bat__attack__f05.png` (6 frames)
- `spr_mon_sugar_bat_hit` -> `spr_mon_sugar_bat__hit__f00.png` ... `spr_mon_sugar_bat__hit__f02.png` (3 frames)
- `spr_mon_sugar_bat_defeat` -> `spr_mon_sugar_bat__defeat__f00.png` ... `spr_mon_sugar_bat__defeat__f05.png` (6 frames)
- `spr_mon_crumb_goblin_idle` -> `spr_mon_crumb_goblin__idle__f00.png` ... `spr_mon_crumb_goblin__idle__f03.png` (4 frames)
- `spr_mon_crumb_goblin_attack` -> `spr_mon_crumb_goblin__attack__f00.png` ... `spr_mon_crumb_goblin__attack__f05.png` (6 frames)
- `spr_mon_crumb_goblin_hit` -> `spr_mon_crumb_goblin__hit__f00.png` ... `spr_mon_crumb_goblin__hit__f02.png` (3 frames)
- `spr_mon_crumb_goblin_defeat` -> `spr_mon_crumb_goblin__defeat__f00.png` ... `spr_mon_crumb_goblin__defeat__f05.png` (6 frames)
- `spr_mon_jelly_rat_idle` -> `spr_mon_jelly_rat__idle__f00.png` ... `spr_mon_jelly_rat__idle__f03.png` (4 frames)
- `spr_mon_jelly_rat_attack` -> `spr_mon_jelly_rat__attack__f00.png` ... `spr_mon_jelly_rat__attack__f05.png` (6 frames)
- `spr_mon_jelly_rat_hit` -> `spr_mon_jelly_rat__hit__f00.png` ... `spr_mon_jelly_rat__hit__f02.png` (3 frames)
- `spr_mon_jelly_rat_defeat` -> `spr_mon_jelly_rat__defeat__f00.png` ... `spr_mon_jelly_rat__defeat__f05.png` (6 frames)
- `spr_mon_sprinkle_snail_idle` -> `spr_mon_sprinkle_snail__idle__f00.png` ... `spr_mon_sprinkle_snail__idle__f03.png` (4 frames)
- `spr_mon_sprinkle_snail_attack` -> `spr_mon_sprinkle_snail__attack__f00.png` ... `spr_mon_sprinkle_snail__attack__f05.png` (6 frames)
- `spr_mon_sprinkle_snail_hit` -> `spr_mon_sprinkle_snail__hit__f00.png` ... `spr_mon_sprinkle_snail__hit__f02.png` (3 frames)
- `spr_mon_sprinkle_snail_defeat` -> `spr_mon_sprinkle_snail__defeat__f00.png` ... `spr_mon_sprinkle_snail__defeat__f05.png` (6 frames)
- `spr_mon_frosting_blob_idle` -> `spr_mon_frosting_blob__idle__f00.png` ... `spr_mon_frosting_blob__idle__f03.png` (4 frames)
- `spr_mon_frosting_blob_attack` -> `spr_mon_frosting_blob__attack__f00.png` ... `spr_mon_frosting_blob__attack__f05.png` (6 frames)
- `spr_mon_frosting_blob_hit` -> `spr_mon_frosting_blob__hit__f00.png` ... `spr_mon_frosting_blob__hit__f02.png` (3 frames)

## Skipped Static Sprite-Like Rows

- static hero portrait/locked visual, not frame animation: 12

## Ambiguous Entries

- None

## Validation Checks

| Check | Result |
| --- | --- |
| Boss defeat example has `f09` | PASS |
| Old single boss defeat key removed from direct row key | PASS |
| Hero cast_spell example has `f05` | PASS |
| Monster attack example has `f05` | PASS |
