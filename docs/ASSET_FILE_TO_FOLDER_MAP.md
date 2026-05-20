# ASSET_FILE_TO_FOLDER_MAP

M?c tiêu: map rõ **file nào di vào folder/subfolder nào** theo chu?n canonical hi?n t?i.

## 1) Board Blocks

| File type | Naming | Folder | Subfolder |
| --- | --- | --- | --- |
| Board block base | `{block_id}.png` | `public/assets/board-blocks/` | - |
| Board block icon | `ico_{block_id}.png` | `public/assets/board-blocks/` | - |
| Board block base frame | `{block_id}__base__f00.png` | `public/assets/sprites/board-blocks/{block_id}/` | `base/` |
| Board block glow frames | `{block_id}__glow__f00.png...` | `public/assets/sprites/board-blocks/{block_id}/` | `glow/` |
| Board block clear frames | `{block_id}__clear__f00.png...` | `public/assets/sprites/board-blocks/{block_id}/` | `clear/` |
| Board block special frames | `{block_id}__{animation_name}__f00.png...` | `public/assets/sprites/board-blocks/{block_id}/` | `special/` |

## 2) Heroes

| File type | Naming | Folder | Subfolder |
| --- | --- | --- | --- |
| Hero idle frames | `{hero_id}__idle__f00.png...` | `public/assets/sprites/heroes/{hero_id}/` | `idle/` |
| Hero cast frames | `{hero_id}__cast_spell__f00.png...` | `public/assets/sprites/heroes/{hero_id}/` | `cast_spell/` |
| Hero attack frames | `{hero_id}__attack__f00.png...` | `public/assets/sprites/heroes/{hero_id}/` | `attack/` |
| Hero hit frames | `{hero_id}__hit__f00.png...` | `public/assets/sprites/heroes/{hero_id}/` | `hit/` |
| Hero victory frames | `{hero_id}__victory__f00.png...` | `public/assets/sprites/heroes/{hero_id}/` | `victory/` |
| Hero defeat frames | `{hero_id}__defeat_tired__f00.png...` | `public/assets/sprites/heroes/{hero_id}/` | `defeat_tired/` |
| Hero portrait icon | `{hero_id}__portrait_icon__f00.png` (ho?c icon tinh) | `public/assets/sprites/heroes/{hero_id}/` | `portrait_icon/` |
| Hero pose sheet | `{hero_id}__pose_sheet_2x2.png` | `public/assets/sprites/heroes/{hero_id}/` | `sheet/` |

## 3) Monsters

| File type | Naming | Folder | Subfolder |
| --- | --- | --- | --- |
| Monster idle frames | `{monster_id}__idle__f00.png...` | `public/assets/sprites/monsters/{monster_id}/` | `idle/` |
| Monster attack frames | `{monster_id}__attack__f00.png...` | `public/assets/sprites/monsters/{monster_id}/` | `attack/` |
| Monster hit frames | `{monster_id}__hit__f00.png...` | `public/assets/sprites/monsters/{monster_id}/` | `hit/` |
| Monster defeat frames | `{monster_id}__defeat__f00.png...` | `public/assets/sprites/monsters/{monster_id}/` | `defeat/` |
| Monster icon | `ico_{monster_id}.png` ho?c equivalent | `public/assets/sprites/monsters/{monster_id}/` | `icon/` |
| Monster pose sheet | `{monster_id}__pose_sheet_2x2.png` | `public/assets/sprites/monsters/{monster_id}/` | `sheet/` |

## 4) Bosses

| File type | Naming | Folder | Subfolder |
| --- | --- | --- | --- |
| Boss idle frames | `{boss_id}__idle__f00.png...` | `public/assets/sprites/bosses/{boss_id}/` | `idle/` |
| Boss attack frames | `{boss_id}__attack__f00.png...` | `public/assets/sprites/bosses/{boss_id}/` | `attack/` |
| Boss hit frames | `{boss_id}__hit__f00.png...` | `public/assets/sprites/bosses/{boss_id}/` | `hit/` |
| Boss phase change | `{boss_id}__phase_change__f00.png...` | `public/assets/sprites/bosses/{boss_id}/` | `phase_change/` |
| Boss special attack | `{boss_id}__special_attack__f00.png...` | `public/assets/sprites/bosses/{boss_id}/` | `special_attack/` |
| Boss defeat | `{boss_id}__defeat__f00.png...` | `public/assets/sprites/bosses/{boss_id}/` | `defeat/` |
| Boss portrait icon | `{boss_id}__portrait_icon__f00.png` | `public/assets/sprites/bosses/{boss_id}/` | `portrait_icon/` |
| Boss pose sheet | `{boss_id}__pose_sheet_2x2.png` | `public/assets/sprites/bosses/{boss_id}/` | `sheet/` |
| Boss extended sheet | `{boss_id}__extended_sheet_2x2.png` | `public/assets/sprites/bosses/{boss_id}/` | `sheet/` |

## 5) Effects (VFX)

| File type | Naming | Folder | Subfolder |
| --- | --- | --- | --- |
| VFX frames | `{vfx_id}__{animation_name}__f00.png...` | `public/assets/effects/{vfx_id}/` | - |

## 6) Icons by Category

| Category | Folder |
| --- | --- |
| Board blocks | `public/assets/icons/board-blocks/` |
| Battle objectives | `public/assets/icons/battle-objectives/` |
| Boss rules | `public/assets/icons/boss-rules/` |
| Currencies | `public/assets/icons/currencies/` |
| Collectibles | `public/assets/icons/collectibles/` |
| Chaos rules | `public/assets/icons/chaos-rules/` |
| Items | `public/assets/icons/items/` |
| Oopsies | `public/assets/icons/oopsies/` |
| Relics | `public/assets/icons/relics/` |
| Room events | `public/assets/icons/room-events/` |
| Random gameplay events | `public/assets/icons/random-gameplay-events/` |
| Status effects | `public/assets/icons/status-effects/` |
| Upgrades | `public/assets/icons/upgrades/` |
| Weapons | `public/assets/icons/weapons/` |
| Spells | `public/assets/icons/spells/` |
| Map nodes | `public/assets/icons/map-nodes/` |
| Hub buildings | `public/assets/icons/hub-buildings/` |
| Route story | `public/assets/icons/route-story/` |

## 7) Stage Backgrounds

| File type | Naming | Folder | Subfolder |
| --- | --- | --- | --- |
| Stage battle far | `bg_stage_{stage_slug}_battle_far.png` | `public/assets/stages/{stage_id}/` | `battle/` |
| Stage battle mid | `bg_stage_{stage_slug}_battle_mid.png` | `public/assets/stages/{stage_id}/` | `battle/` |
| Stage battle near | `bg_stage_{stage_slug}_battle_near.png` | `public/assets/stages/{stage_id}/` | `battle/` |
| Boss arena | `bg_boss_{boss_slug}_arena.png` | `public/assets/stages/{stage_id}/` | `boss-arena/` |
| Map bg | `bg_map_{stage_slug}.png` | `public/assets/stages/{stage_id}/` | `map/` |
| Route scene bg | `bg_route_{hero_slug}_{stage_slug}.png` | `public/assets/stages/{stage_id}/` | `route-scenes/` |
| Stage props | free naming theo key | `public/assets/stages/{stage_id}/` | `props/` |

## 8) UI Assets

| File type | Folder | Subfolder |
| --- | --- | --- |
| Panels | `public/assets/ui/panels/` | - |
| Buttons | `public/assets/ui/buttons/` | - |
| HUD | `public/assets/ui/hud/` | - |
| Meters | `public/assets/ui/meters/` | - |
| Mobile controls | `public/assets/ui/mobile-controls/` | - |
| Story route UI | `public/assets/ui/story-routes/` | - |
| UI animations | `public/assets/ui/animations/` | - |
| UI placeholders | `public/assets/ui/placeholders/` | - |

## 9) Portraits / Story / Audio / Fonts / Placeholders

| File type | Folder |
| --- | --- |
| Hero portraits | `public/assets/portraits/heroes/` |
| NPC portraits | `public/assets/portraits/npcs/` |
| Boss portraits | `public/assets/portraits/bosses/` |
| Story endings | `public/assets/story/endings/` |
| Route cards | `public/assets/story/route-cards/` |
| Dialogue panels | `public/assets/story/dialogue-panels/` |
| Audio SFX | `public/assets/audio/sfx/` |
| Audio music | `public/assets/audio/music/` |
| Audio UI | `public/assets/audio/ui/` |
| Fonts | `public/assets/fonts/` |
| Generic placeholders | `public/assets/placeholders/` |

## 10) Legacy note (compat only)

- `public/assets/backgrounds/` và các path cu ch? gi? làm fallback tuong thích.
- Asset m?i luôn d?t theo canonical structure ? trên.
- Content JSON nên reference b?ng key (`assetKey`, `iconKey`, `spriteKey`, `portraitKey`, `backgroundKey`, `assetRefs`) thay vì hardcode path.
