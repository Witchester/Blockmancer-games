# Asset Migration Legacy Compatibility

## Scope
This pass keeps old paths working while introducing canonical `public/assets/` structure.

## Rules
- Do not delete legacy files in this pass.
- Add canonical keys/paths first.
- Keep fallback aliases for old folders and legacy `spr_`/`ico_` names.
- Missing files are warnings (non-strict), not crashes.

## Current compatibility
- `public/assets/backgrounds/` remains compatibility-only.
- Old flat sprite/icon/background paths remain fallback-resolved.
- Content should move to key-based refs (`assetKey`, `assetRefs`, `iconKey`, etc.), not raw paths.

## Next cleanup pass recommendation
1. Copy remaining legacy-only files into canonical folders.
2. Re-run sync and variant audit.
3. Switch strict mode for unresolved critical keys.
4. Remove obsolete fallback aliases once coverage is complete.
