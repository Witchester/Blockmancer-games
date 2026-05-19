# Asset Manifest Contract

Runtime assets must be addressed by key through `AssetSystem` and loaded from `/assets/...`.

## Board Blocks

- Base frame: `/assets/sprites/board-blocks/{blockId}/base/{blockId}__base__f00.png`
- Glow frames: `/assets/sprites/board-blocks/{blockId}/glow/{blockId}__glow__f00.png...`
- Clear frames: `/assets/sprites/board-blocks/{blockId}/clear/{blockId}__clear__f00.png...`
- Special/idle frames: `/assets/sprites/board-blocks/{blockId}/special/{blockId}__{animation}__f00.png`
- Icon: `/assets/icons/board-blocks/ico_{blockId}.png`

## Characters

- Heroes: `/assets/sprites/heroes/{heroId}/{state}/{heroId}__{state}__f00.png`
- Monsters: `/assets/sprites/monsters/{monsterId}/{state}/{monsterId}__{state}__f00.png`
- Bosses: `/assets/sprites/bosses/{bossId}/{state}/{bossId}__{state}__f00.png`
- Hero portraits: `/assets/portraits/heroes/{heroId}__portrait_icon.png`
- NPC/Boss portraits: `/assets/portraits/npcs/{id}__portrait_icon.png`

## Icons

- Items: `/assets/icons/items/ico_{itemId}.png`
- Spells: `/assets/icons/spells/ico_{spellId}.png`
- Relics: `/assets/icons/relics/ico_{relicId}.png`
- Upgrades: `/assets/icons/upgrades/ico_{upgradeId}.png`
- Weapons: `/assets/icons/weapons/ico_{weaponId}.png`
- Status: `/assets/icons/status/ico_{statusId}.png`
- Map nodes: `/assets/icons/map/ico_{nodeId}.png`
- Routes: `/assets/icons/routes/ico_{routeId}.png`

## Effects / UI / Story / Stages

- VFX: `/assets/effects/{vfxId}/{vfxId}__{state}__f00.png`
- UI image: `/assets/ui/{uiAssetId}.png`
- UI animation: `/assets/ui/animations/{animationId}/{animationId}__f00.png`
- Route story image: `/assets/ui/story-routes/{routeId}.png`
- Stage background: `/assets/stages/{stageId}.png` or `/assets/stages/{stageId}/background.png`
- Ending cards: `/assets/story/endings/{endingId}.png`
- Route scene backgrounds: `/assets/stage-backgrounds/route-scenes/{routeSceneId}.png`

## Audio

- SFX: `/assets/audio/sfx/{sfxId}.ogg` (or explicit manifest path)
- Music: `/assets/audio/music/{musicId}.ogg` (or explicit manifest path)

## Fallback and Compatibility

- Missing files must never crash gameplay.
- `AssetSystem` resolves to category fallback keys when missing.
- Compatibility block IDs are normalized (examples: `red`, `spr_block_red`, `block_red_rune` -> `block_red`).
- New assets should only require:
  1) adding files at contract paths,
  2) adding/updating content keys if needed.
