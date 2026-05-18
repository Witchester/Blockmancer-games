# Asset Variant Audit
<!-- BLOCKMANCER_STATUS_UPDATE_2026-05-18 -->
## Current Interpretation — 2026-05-18

Variant audit confirms the **variant system is working and fallback-safe**.

### Production notes

- Release 1 heroes are ready; Bloop and Professor Poplin are future/backlog unless explicitly promoted.
- Board blocks are mostly ready, but `block_junk`, `block_magic`, `block_stone`, and `block_void` still fall back for expanded variants.
- All six stage variants are ready and should be smoke-tested in portrait mobile.
- Variant readiness does not guarantee final polished art; it means runtime can resolve a usable asset or fallback.
<!-- END_BLOCKMANCER_STATUS_UPDATE -->

Generated: 2026-05-15T18:51:22.797Z

## Board Blocks

| ID | Base | Glow | Clear | Icon |
| --- | --- | --- | --- | --- |
| block_blue | ready | ready | ready | ready |
| block_bomb | ready | ready | ready | ready |
| block_cloud_junk | ready | ready | ready | ready |
| block_confetti | ready | ready | ready | ready |
| block_crumb_junk | ready | ready | ready | ready |
| block_cupcake | ready | ready | ready | ready |
| block_floaty_rune | ready | ready | ready | ready |
| block_green | ready | ready | ready | ready |
| block_ice | ready | ready | ready | ready |
| block_jelly | ready | ready | ready | ready |
| block_junk | fallback | fallback | fallback | fallback |
| block_magic | fallback | fallback | fallback | fallback |
| block_red | ready | ready | ready | ready |
| block_royal | ready | ready | ready | ready |
| block_sprinkle | ready | ready | ready | ready |
| block_star | ready | ready | ready | ready |
| block_sticky | ready | ready | ready | ready |
| block_stone | fallback | fallback | fallback | fallback |
| block_toolbox | ready | ready | ready | ready |
| block_void | fallback | fallback | fallback | fallback |
| block_yellow | ready | ready | ready | ready |

## Heroes

| ID | Idle | Cast | Hit | Victory | Icon |
| --- | --- | --- | --- | --- | --- |
| hero_bloop_slime_friend | fallback | fallback | fallback | fallback | fallback |
| hero_bruk_snack_knight | ready | ready | ready | ready | ready |
| hero_lumi_star_witch | ready | ready | ready | ready | ready |
| hero_milo_blockmancer | ready | ready | ready | ready | ready |
| hero_nixie_frostbinder | ready | ready | ready | ready | ready |
| hero_pippa_pyromancer | ready | ready | ready | ready | ready |
| hero_poplin_professor | fallback | fallback | fallback | fallback | fallback |
| hero_zuzu_goblin_engineer | ready | ready | ready | ready | ready |

## Stages

| ID | Far | Mid | Near | Map | Boss Arena |
| --- | --- | --- | --- | --- | --- |
| stage_bloxley_block_palace | ready | ready | ready | ready | ready |
| stage_frosty_pantry | ready | ready | ready | ready | ready |
| stage_goblin_workshop | ready | ready | ready | ready | ready |
| stage_pillow_castle | ready | ready | ready | ready | ready |
| stage_sprinkle_sewers | ready | ready | ready | ready | ready |
| stage_starfall_arcade | ready | ready | ready | ready | ready |