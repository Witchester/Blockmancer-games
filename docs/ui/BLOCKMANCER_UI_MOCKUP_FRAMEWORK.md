# Blockmancer UI Mockup Framework

## Purpose
This framework turns UI mockups into a pixel-perfect asset-drop-in contract for Blockmancer Dungeon. Final PNGs should land in canonical folders, bind by asset key, and replace placeholders without layout rectangle changes.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## CodeGraph usage summary
CodeGraph MCP was available and reported 151 indexed files, 2720 nodes, and 7479 edges. It identified Phaser scene files under src/game/scenes, UI helpers under src/game/ui, AssetSystem, and layout helpers. The CodeGraph docs in docs/ui/codegraph are analysis support; SOT docs remain the authority.

## Global UI principles
Blockmancer Dungeon is cheerful portrait-mobile falling-block roguelike RPG UI. Use cozy arcade energy, bright readable pixel art, funny festival chaos, and short mobile-readable labels. Do not introduce horror, gore, grim apocalypse framing, dark curse language, or skull-heavy UI.

## 1080x1920 design canvas
Every layout JSON uses a fixed 1080x1920 portrait canvas. Desktop preview should center that portrait frame rather than redesign into widescreen. All x/y/w/h values are integer pixels.

## Section ratio contract
Battle is fixed: combat/event log x0 y0 w1080 h480, puzzle x0 y480 w1080 h1056, controls x0 y1536 w1080 h384. Combat, puzzle, and controls never overlap. Event Log stays inside Section 1 only.

## Safe area guidance
Full-screen safe padding is 32px. Text inside panels preserves at least 24px. Buttons preserve at least 18px vertical and 24px horizontal internal padding.

## Touch target guidance
Minimum touch target is 88x88px; primary battle controls target 96x96px. Modal close/confirm controls must be visible without scrolling.

## Pixel-art rendering guidance
Use nearest-neighbor/pixelated rendering. Runtime positions must round to whole pixels. No blur, bilinear filtering, soft anti-aliasing, CSS smoothing, or fractional scaling for pixel-art assets.

## UI tone rules
Use cheerful festival fantasy, cute chaos, and readable arcade panels. Oopsies and mishaps are allowed; grim curses and horror presentation are not.

## Asset key rules
Specs reference stable asset keys. canonicalFolder documents where final PNGs should live. Runtime/content should use keys and fallback keys, not ad hoc raw image paths.

## Fallback rules
Every visual slot defines fallbackAssetKey. Missing final art must keep the screen playable and preserve layout bounds. Wrong-size art fails QC and keeps placeholder/fallback.

## Pixel-perfect asset-drop-in principles
The rectangle is the contract. If final art matches expectedSourceSize, anchor, fitMode, scaleMode, safePadding, and zIndex, it should drop in without moving text, controls, board cells, or event log.

## How designers should read the framework
Start with SCREEN_INDEX, then open the matching layout JSON. Export PNGs at expectedSourceSize into canonicalFolder using assetKey names. Keep dynamic text out of images.

## How developers should implement the framework
Use layout JSON as the spec for bounds, zIndex, anchors, fallbacks, and dynamic text ownership. Runtime code can adapt to device scale, but canonical mockup coordinates stay 1080x1920 and round to whole pixels.

## How future agents should use docs/ui/codegraph before coding UI changes
Before coding UI changes, check docs/ui/codegraph for scene flow, component dependencies, asset key mappings, and scene-to-spec traceability. Then use CodeGraph MCP for current code evidence and treat SOT docs as canonical.

## Relevant screen/component/layout content
The package includes one layout JSON per major screen, a component library, placeholder key registry, font scale, QA checklist, pixel-perfect asset contract, and CodeGraph/manual graph docs.

## Asset key/fallback rules
All layout visual components include assetKey, fallbackAssetKey, canonicalFolder, expectedSourceSize, runtimeRenderSize, anchor, fitMode, scaleMode, safePadding, zIndex, dynamicTextAllowed, and pixelPerfect.

## Pixel-perfect or QA guidance
Use BLOCKMANCER_UI_QA_CHECKLIST.md and BLOCKMANCER_UI_PIXEL_PERFECT_ASSET_CONTRACT.md as acceptance gates before importing final PNG assets.

## Status / known gaps
This is a documentation and data-spec package. Runtime scenes are not rewritten in this pass. Some final PNGs are expected to be missing and must use fallback placeholders until art production catches up.
