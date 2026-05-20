# Asset Manifest Maintenance Guide

- Canonical source: `src/game/data/assets.ts`.
- Keep keys stable; IDs are save-facing in content.
- Prefer `primaryPath` under canonical folders.
- Keep `fallbackPaths` for old locations until cleanup pass.
- Avoid raw path usage in scenes; use AssetSystem + keys.

## Manifest entry checklist
- `key`
- `type`
- `kind`
- `primaryPath`
- `fallbackPaths` (if legacy exists)
- `sourceSize` and `runtimeSize` where relevant
- tags/category optional for audit tooling

## Validation workflow
- `npm run ensure:asset-folders`
- `npm run sync:assets`
- `npm run audit:asset-variants`
- `npm run validate:content`
- `npm run validate:metadata`
- `npm run validate:animations`
- `npm run build`
