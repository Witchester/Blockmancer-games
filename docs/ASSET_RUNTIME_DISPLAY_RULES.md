# Asset Runtime Display Rules

Canonical runtime sizing is category-based and defined in `src/game/data/asset-display-rules.ts`.

## Fixed Board Rules

- Board gameplay blocks: `24x24` source and `24x24` render.
- Board block icons: `48x48` source, `32-48` render depending UI context.
- Board block frame contracts remain exact-frame and unchanged.

## Non-Board High-Res Source Rules

- Single-frame non-board assets may use `627x627` source PNG.
- Pose sheet assets use `1254x1254` (`2x2`) with `627x627` frame cells.
- Source dimensions never imply runtime render size.
- Runtime size is always constrained by category rules.

## Key Runtime Categories

- `heroPoseSheet`, `monsterPoseSheet`, `eliteMonsterPoseSheet`, `bossPoseSheet`, `bossIntroPoseSheet`
- `itemIcon`, `spellIcon`, `relicIcon`, `upgradeIcon`, `weaponIcon`
- `statusIcon`, `oopsieIcon`, `hazardIcon`, `mapIcon`, `roomIcon`, `routeIcon`
- `rewardThumbnail`, `shopThumbnail`, `portrait`
- `vfxBoardCell`, `vfxCombatSmall`, `vfxCombatLarge`, `uiIcon`, `uiAnimation`
- `stageBackground` (cover/contain behavior for fullscreen art)

## Runtime Requirements

- Preserve aspect ratio.
- Preserve nearest-neighbor / pixel-art sampling.
- Never render raw source size directly in UI/battle.
- Missing assets resolve to safe fallback placeholders and must not crash gameplay.
