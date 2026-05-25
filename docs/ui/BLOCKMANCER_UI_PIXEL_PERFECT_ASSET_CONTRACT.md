# Blockmancer UI Pixel-Perfect Asset Contract

## Purpose
Final assets should drop into canonical folders and work with minimal fixes. This file is the global contract for PNG source sizes, anchors, padding, render rules, fallbacks, and QC.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
All per-screen layout specs live in docs/ui/layouts. Every visual component in those files carries the required asset slot fields.

## Global pixel-perfect rules
- All layout specs use exact integer pixel coordinates in 1080x1920 portrait space.
- Runtime render positions round to whole pixels.
- Pixel art uses nearest-neighbor / pixelated rendering.
- Do not use bilinear filtering, blur, soft anti-aliasing, CSS smoothing, or non-integer scaling for pixel-art assets.
- Component specs define zIndex/layer order so imported art cannot cover text, controls, board cells, or event log.

## Source size table
| Asset family | Expected source PNG size |
|---|---:|
| Board gameplay blocks | 24x24 |
| Board icons | 48x48 |
| Non-board single-frame assets | 627x627 |
| Hero/monster/boss frame assets | 627x627 |
| Hero/monster/boss 2x2 sheets | 1254x1254 with 627x627 cells |
| VFX frames | 627x627 centered transparent |
| Section 1 battle backgrounds | 1080x480 |
| Section 2 puzzle backgrounds | 1080x1056 |
| Section 3 controls background/panel | 1080x384 |
| Full portrait scenes/maps/story backgrounds | 1080x1920 |

## Runtime render size table
| Slot | Runtime render rule |
|---|---|
| Battle background | 1080x480 exact |
| Puzzle background | 1080x1056 exact |
| Controls background | 1080x384 exact |
| Full scene background | 1080x1920 exact |
| Board block | 24x24 |
| Board icon | 48x48 |
| Character slot | Documented integer slot, bottom-center anchor |
| VFX slot | Documented integer target slot, center anchor |
| UI panel/button | Exact slot or nine-slice stretch |
| Dynamic text | Game text layer only |

## Anchor table
| Anchor | Use |
|---|---|
| topLeft | Backgrounds, panels, board frame slots |
| center | Icons, chips, buttons, VFX |
| bottomCenter | Hero, monster, boss battle sprites |
| gridCellTopLeft | Board gameplay blocks |
| boardGrid | Board overlays tied to BoardSystem origin |

## Fit mode table
| Fit mode | Use |
|---|---|
| exact | Source size must match slot or section exactly |
| contain | Fit inside slot without cropping |
| cover | Fill slot and crop only allowed safe areas |
| nineSlice | Scalable UI panels/buttons only |
| tile | Repeatable pattern backgrounds only |
| iconCenter | Icon centered in slot, no crop |
| spriteAnchor | Character sprite anchored to combat pivot |
| vfxCenter | VFX centered on target lane/slot |

## Scale mode table
| Scale mode | Use |
|---|---|
| none | Render at source size |
| integerOnly | Only 1x/2x/3x scaling |
| fitInteger | Nearest safe integer fit |
| uiStretchNineSlice | Nine-slice UI panels only |
| backgroundExact | Background must match section size exactly |
| textDynamic | Game text only |

## Safe padding table
| Area | Minimum safe padding |
|---|---:|
| Full screen | 32 px |
| Text inside panels | 24 px |
| Button internal vertical | 18 px |
| Button internal horizontal | 24 px |
| Touch target | 88x88 px, primary 96x96 px |
| Battle text | Must sit on calm panel/strip |
| Section 2 board center | Must remain visually clean |
| Section 1 VFX lane | Must not cover HP/MP, intent, event log |
| Section 3 controls | Must never be hidden by decorative art |

## Dynamic text rules
Never bake HP values, MP values, EXP values, EXP remaining, level number, score, combo, cascade count, lines, node x/y, damage numbers, shield values, status durations, gold values, stack counts, item quantities, or localized/stateful button labels into PNG assets.

## Per-screen asset slot checklist
- Canvas/section size documented.
- Component rectangle has integer x/y/w/h.
- Required asset fields present.
- Dynamic text is separated from PNGs.
- Z-index keeps text and controls above decorative art.

## Per-component asset slot checklist
assetKey, fallbackAssetKey, canonicalFolder, expectedSourceSize, runtimeRenderSize, x, y, w, h, anchor, fitMode, scaleMode, safePadding, zIndex, dynamicTextAllowed, pixelPerfect, notes.

## Common failure cases and how to catch them
| Failure | Catch |
|---|---|
| wrong source size | Compare PNG dimensions to expectedSourceSize |
| wrong folder | Verify canonicalFolder |
| wrong key | Check assetKey registration and fallbackAssetKey |
| blurry scaling | Inspect screenshot and renderer filtering |
| non-integer position | Assert rounded render coordinates |
| cropped character | Overlay source frame against bottom-center anchor |
| text baked into PNG | Review art for dynamic labels/values |
| background too busy behind UI text | Require panel/safe strip |
| panel art covering controls | Check zIndex order |
| inconsistent character anchor across animation frames | Overlay frame pivots |
| missing fallback key | Validate fallbackAssetKey before import |

## Asset key/fallback rules when applicable
Every slot has fallbackAssetKey. Missing final art keeps fallback and does not change layout.

## Pixel-perfect or QA guidance when applicable
Use BLOCKMANCER_UI_QA_CHECKLIST.md plus per-layout acceptanceCriteria.

## Status / known gaps
The contract is documented. Automated PNG dimension tooling is a recommended follow-up.
