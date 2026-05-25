# Blockmancer UI Font Scale

## Purpose
Define mockup font keys and mobile-readable sizes for the 1080x1920 portrait UI specs.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
| Font key | Use | 1080x1920 size guidance |
|---|---|---:|
| font_pixel_header | Screen titles and major banners | 56-72 px |
| font_pixel_body | Dialogue, descriptions, card body | 28-34 px |
| font_pixel_number | HP, MP, score, EXP, prices, counts | 28-44 px |
| font_pixel_small | HUD labels and compact chips | 18-22 px |

## Asset key/fallback rules
Font keys are runtime text references, not PNG asset keys. Never bake dynamic numbers into PNG assets. Use game text for HP, MP, EXP, score, node count, stack count, damage, gold, item quantity, and EXP remaining.

## Pixel-perfect or QA guidance
Important body text minimum is 28px in 1080x1920 mockups. 20-24px is allowed only for compact HUD labels/chips. Text must fit inside documented safePadding and stay readable after portrait scaling.

## Status / known gaps
Final licensed font files may still use runtime fallback fonts. Layout specs document font keys so final fonts can be swapped without changing asset slots.
