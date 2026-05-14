# Performance Notes

## Mobile pass

The Release 1.0 mobile performance pass keeps gameplay behavior unchanged and focuses on reducing per-frame and per-lock allocations.

Hot path changes:

```text
- Board line detection now reuses a completed-line buffer.
- Cascade gravity now compacts columns in place instead of allocating per-column arrays.
- Special block trigger collection avoids per-cell Set allocation.
- Board rendering reuses display/alpha buffers instead of cloning the grid every render.
- Board cells cache last color, alpha, texture, and accessibility symbol.
- Floating damage text is pooled instead of created and destroyed for every hit.
- Inventory overlay only rebuilds when the visible inventory contents change.
- Event log, HUD, and buttons avoid redundant setText/style work.
- BattleScene shutdown clears input hooks, tweens, timers, pooled text, and overlay objects.
```

Manual checks:

```text
1. Start a battle on a mobile-sized viewport.
2. Move, rotate, soft drop, hard drop, and hold repeatedly.
3. Use QA Debug -> Force Cascade Test and hard drop once.
4. Enter and exit multiple battles, reward screens, and map transitions.
5. Confirm no visible behavior changed and no stale overlay/VFX objects remain.
```
