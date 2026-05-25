# Blockmancer UI QA Checklist

## Purpose
Provide screen-level, asset-level, CodeGraph, and pixel-perfect checks for the UI mockup framework.

## Source of truth references
- docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
- docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
- docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
- docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
- docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
- docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md

## Relevant screen/component/layout content
Use this checklist against every file in docs/ui/layouts plus the CodeGraph docs.

## Screen-level QA checklist
- 1080x1920 portrait base.
- Text readable at mobile scale.
- Important action button visible without scrolling.
- Uses cheerful festival tone, no horror/skull-heavy framing.

## Battle layout QA checklist
- No overlap between combat, puzzle, and controls.
- Event Log stays inside combat area.
- Controls always visible.
- Board, Hold, Next Queue, right stat rail, and inventory remain visible.
- Combat sections exactly x0 y0 w1080 h480, x0 y480 w1080 h1056, x0 y1536 w1080 h384.

## Text readability QA checklist
- Dynamic values are game text, not baked into PNGs.
- Dialogue/body text is at least 28px in canonical mockups.
- HUD labels/chips use 20-24px only when compact.

## Asset key QA checklist
- Uses asset keys, not ad hoc raw paths.
- Uses canonical asset folders.
- Has fallback placeholder keys.

## Fallback QA checklist
- Missing final art resolves to fallbackAssetKey.
- Missing fallbacks are documented before import.

## Touch target QA checklist
- Touch target is at least 88-96px on 1080 mockup for important controls.
- Modal close/confirm buttons are visible and tappable.

## Portrait/mobile QA checklist
- Desktop preview remains a centered portrait frame.
- No component uses fractional position after scaling.

## Node Result QA checklist
- Node Clear title/banner is present.
- Enemies defeated, total EXP, breakdown rows, current level, XP before/after, EXP remaining or Level Up Ready badge, and Continue are represented as dynamic text/layers.
- No active board behind result screen.

## Level-Up QA checklist
- Festival Level Up title, XP/level summary, three cards, icon/name/rarity/stack/effect text, reroll, and confirm are present.
- Hero-specific badge support exists.

## Route Dialogue QA checklist
- Dialogue panel has safe padding.
- Practical/true/risky choice cards are separate and readable.
- Portraits and backgrounds do not bake dialogue text.

## CodeGraph graph QA checklist
- CodeGraph report exists or explains availability.
- Screen flow graph covers all major screens.
- Component dependency graph maps screens to components.
- Asset key graph maps asset keys to components and folders.
- Scene-to-spec traceability identifies existing, partial, spec-only, and missing screens.

## Pixel-perfect QA checklist
- Coordinates are integer pixels.
- Slot size is integer pixels.
- Source PNG size matches expectedSourceSize.
- Runtime render size matches runtimeRenderSize.
- Anchor is documented.
- Fit mode is documented.
- Scale mode is documented.
- No non-integer scaling unless explicitly allowed for UI nine-slice.
- No blur or anti-aliasing.
- No cropped important subject.
- No text baked into PNG where dynamic text is required.
- Fallback asset exists or fallback behavior is documented.
- Z-index does not cover interactive UI.
- Mobile touch targets meet minimum size.
- Imported final asset can replace placeholder without changing layout JSON.

## Asset-drop-in QA checklist
- Wrong source size, wrong folder, wrong key, blurry scaling, non-integer coordinates, cropped character, baked text, busy backgrounds, panel art covering controls, inconsistent animation anchors, and missing fallback keys are all caught before final import.

## Asset key/fallback rules
Fallback keys are mandatory and are validated in layout JSON. Dynamic text never belongs in PNG requirements.

## Status / known gaps
Automated image dimension checks are not implemented in this docs pass; use this checklist manually or wire it into future tooling.
