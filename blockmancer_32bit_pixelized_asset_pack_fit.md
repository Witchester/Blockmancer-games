# Blockmancer Dungeon — 32-bit Pixelized Asset Pack Fit Guide

## Purpose

This document explains whether the recommended asset-pack strategy can satisfy the **Blockmancer 32-bit pixelized art direction** and what rules should be enforced before using third-party packs in production.

## Short Answer

The recommended packs can support the **32-bit pixelized condition**, but **not fully out of the box**.

They mostly satisfy a **pixel-art / retro / 16-bit-to-32-bit inspired** direction, but they will not automatically look like one consistent Blockmancer visual style unless the team standardizes them through a shared art pipeline.

For Blockmancer, treat **“32-bit pixelized”** as an art-direction requirement, not a literal hardware bit-depth requirement.

It should mean:

- Chunky readable pixel art
- Bright fantasy colors
- Clean silhouettes
- Consistent pixel scale
- Integer upscaling only
- No blur or vector-like softness
- Playful arcade/festival readability

## Blockmancer 32-bit Pixelized Style Definition

```text
Blockmancer 32-bit pixelized style:
Bright 32-bit inspired pixel art, 16x16/32x32 base scale, integer upscale only, nearest-neighbor rendering, chunky readable silhouettes, cheerful festival palette, no blurry/vector-looking assets, no mixed outline styles.
```

## Pack Fit Summary

| Pack | 32-bit pixelized fit | Use for final? | Notes |
| --- | ---: | --- | --- |
| Kenney All-in-1 | Partial | Mostly placeholder/support | Includes many useful pixel assets, UI, icons, audio, and fonts, but also includes assets that may not match the final style. Use selectively. |
| Kenney Pixel UI Pack | Strong | Yes for UI | Good fit for pixel buttons, cards, panels, and HUD base. |
| Ninja Adventure | Strong | Good base | Strong pixel fantasy pack. Useful for characters, monsters, props, VFX, tiles, and placeholder content. Needs recolor/theme edits to become Blockmancer-specific. |
| Pixel Frog Pixel Adventure 1/2 | Strong | Good for monsters/placeholders | Good colorful pixel-art base for cute enemies and props. More platformer/adventure oriented than puzzle RPG, so adapt carefully. |
| Tiny Swords | Strong | Good for monsters/props | Cute fantasy style fits Blockmancer’s cheerful tone. Useful for enemy and environment inspiration. |
| LimeZu Modern UI | Strong | Yes for UI/inventory/shop | Useful for windows, buttons, inventory UI, shop UI, and small item props. |
| TomMusic / Pixel Combat / Kenney Audio | N/A visual | Yes for audio | Not related to visual pixel style, but useful for SFX/BGM placeholder and production audio. |

## What Can Use Asset Packs Safely

These categories can mostly use asset packs with light editing:

| Asset category | Pack-safe? | Notes |
| --- | ---: | --- |
| UI buttons/cards/panels | Yes | Use one UI pack style only to avoid visual mismatch. |
| HUD meters and frames | Yes | Recolor and resize for portrait mobile readability. |
| Map nodes | Yes | Generic node icons can come from packs. Boss/final-boss nodes may need custom polish. |
| Generic item icons | Yes | Most consumables and tools can use pack icons with recolor/overlay. |
| Relic icons | Yes | Use pack items as bases, then add rarity frames or sparkle treatment. |
| Upgrade icons | Yes | Use simple readable symbols. Avoid over-detailed icons. |
| Weapon icons | Yes | Pack-safe, but hero signature weapons may need custom art. |
| Currency icons | Yes | Coins, tickets, stars, and tokens are easy to cover with packs. |
| Collectible icons | Yes | Manual pages, cakes, badges, and tokens can be adapted from packs. |
| Basic SFX | Yes | Button taps, hits, reward sounds, shop sounds, and simple UI cues can come from packs. |
| Placeholder BGM | Yes | Use pack music as placeholder, then replace key tracks later if needed. |
| Generic monsters | Mostly yes | Pack monsters are fine for early production and filler enemies. |
| Generic backgrounds | Mostly yes | Use tiles/props to compose backgrounds, but key stages still need art direction pass. |

## What Should Stay Custom

These categories should be custom or heavily edited because they define the game identity and readability:

| Asset category | Why it should be custom |
| --- | --- |
| Main heroes | Milo, Pippa, Nixie, Bruk, Zuzu, and Lumi define the brand identity. |
| Bosses | Cupcake Slime King, Prototype No. 7, Gelato Golem, Sir Snore-a-Lot, High Score Hydra, and King Bloxley need unique silhouettes and stage personality. |
| Board blocks | The board is the core gameplay. Blocks must be instantly readable on mobile. |
| Special hazard blocks | Floaty Rune, Cloud Junk, Sticky, Royal, Ice, and Toolbox blocks need clear gameplay communication. |
| Spell icons | Players tap spells often. Icons must be unified, readable, and specific to mechanics. |
| Title art | First impression and store screenshots need custom polish. |
| Final stage/key art | Bloxley’s Block Palace and final boss presentation should not feel generic. |

## Required Art Rules

Use these rules when importing, editing, or commissioning assets.

| Rule | Requirement |
| --- | --- |
| Pixel base size | Prefer 16x16, 32x32, 48x48, or 64x64 source assets. |
| Scaling | Use integer scale only: 2x, 3x, 4x. |
| Filtering | Use nearest-neighbor / pixelated rendering. No bilinear blur. |
| Palette | Recolor assets into one bright festival palette. |
| Outline | Use consistent 1px or 2px outline style across characters, blocks, and icons. |
| Lighting | Keep one light direction, usually top-left. |
| Shadow style | Use consistent soft pixel shadows. Avoid mixing realistic gradients with pixel sprites. |
| Icon size | Keep icons readable at small mobile HUD size. |
| Sprite silhouette | Important gameplay objects must be recognizable even in grayscale/silhouette. |
| Animation frame count | Prefer short readable loops over complex animations. |
| UI style | Do not mix multiple UI packs unless they are recolored and reframed into one style. |
| File naming | Keep current project asset keys and map pack files to those names. Do not rename runtime keys casually. |

## Recommended Pixel Size Targets

| Asset type | Recommended source size | Notes |
| --- | ---: | --- |
| Board block | 32x32 | Most important readability asset. Keep symbol simple. |
| Board block glow/clear frame | 32x32 | Same silhouette as base block. |
| Item/relic/upgrade icon | 32x32 or 48x48 | Must read well in small UI. |
| Spell icon | 48x48 or 64x64 | Bigger because it is tappable and mechanic-critical. |
| Status/oopsie icon | 32x32 | Simple symbolic design. |
| Map node icon | 32x32 or 48x48 | Must work on portrait map. |
| Small enemy sprite | 32x32 to 64x64 | Use strong silhouette. |
| Boss sprite | 96x96 to 160x160 | Large enough for personality, still readable in battle panel. |
| Hero portrait | 96x96 to 160x160 | Used in hero select/dialogue. |
| Hero battle sprite | 64x64 to 96x96 | Needs readable pose in top battle panel. |
| Background tile/prop | 16x16 or 32x32 tiles | Compose into larger scenes. |
| Scene background | 320x180, 480x270, or portrait-safe layout | Leave room for UI overlay. |

## Pack Usage Decision Table

| Asset group | Use pack directly | Use pack with edits | Custom recommended |
| --- | ---: | ---: | ---: |
| UI buttons | Yes | Yes | No |
| UI panels/cards | Yes | Yes | No |
| Generic icons | Yes | Yes | No |
| Items | Some | Yes | Only signature items |
| Relics/upgrades | Some | Yes | Only legendary/signature relics |
| Weapons | Some | Yes | Hero signature weapons |
| Currencies | Yes | Yes | No |
| Map nodes | Some | Yes | Boss/final-boss nodes |
| Board blocks | No | Yes | Yes |
| Special hazard blocks | No | Yes | Yes |
| Spell icons | No | Yes | Yes |
| Heroes | No | Yes for base only | Yes |
| Monsters | Some | Yes | Key monsters only |
| Bosses | No | Base/reference only | Yes |
| Stage backgrounds | Some | Yes | Key scenes/stages |
| BGM | Yes as placeholder | Yes | Main theme/final boss optional custom |
| SFX | Yes | Yes | Only signature sounds |

## Practical Recommendation

Use asset packs as a **production base**, not as the final visual identity.

Recommended approach:

1. Pick one main pixel-art pack family as the base style.
2. Pick one UI pack only.
3. Recolor everything into the Blockmancer festival palette.
4. Replace the most important gameplay assets with custom art.
5. Keep pack assets for generic filler, placeholders, and low-priority backlog rows.

## Best Final Pack Strategy

### Base pack stack

| Pack type | Recommended use |
| --- | --- |
| Kenney All-in-1 | General placeholders, audio, icons, fonts, UI support. |
| Kenney Pixel UI or LimeZu Modern UI | Final UI base. Choose one primary UI style. |
| Ninja Adventure | Pixel fantasy characters, props, tiles, VFX, placeholder enemies. |
| Pixel Frog / Tiny Swords | Cute monster and environment base. |
| TomMusic / Pixel Combat / Kenney Audio | SFX and BGM placeholders. |

### Avoid

- Mixing high-resolution painted assets with pixel sprites
- Mixing vector UI with pixel UI
- Scaling assets by non-integer values
- Using blurred sprites
- Using different outline thicknesses per pack
- Using dark/grim fantasy packs without recolor
- Using assets with horror/skull/gore-heavy tone

## Final Answer

The recommended packs **can satisfy the 32-bit pixelized condition**, but only after a style pass.

They are acceptable for:

- UI
- Items
- Generic icons
- Generic monsters
- Map assets
- Placeholder backgrounds
- SFX/BGM

They are **not enough by themselves** for:

- Main heroes
- Bosses
- Board blocks
- Spell icons
- Title/key art

The correct production direction is:

```text
Use packs to reduce asset workload, then custom-polish the assets that define gameplay readability and Blockmancer identity.
```

## Recommended Scope Reduction

The current checklist is very large. Instead of trying to produce all assets as custom work, use this target:

| Phase | Asset count target | Focus |
| --- | ---: | --- |
| Prototype polish | 120–180 | One full stage, core UI, board blocks, one hero, key monsters, key SFX. |
| Vertical slice | 220–320 | Two stages, two bosses, map, reward/shop/event screens. |
| Release candidate | 400–550 | Six stages, all heroes/bosses, enough icons/audio/VFX. |
| Backlog only | 550+ | Extra animation variants, alternates, premium polish. |

## Designer Checklist Before Accepting a Pack Asset

Use this checklist before marking a third-party asset as usable:

```text
[ ] Asset is pixel art, not vector or painted style.
[ ] Asset still looks sharp after integer scaling.
[ ] Asset uses nearest-neighbor rendering with no blur.
[ ] Asset matches Blockmancer’s cheerful festival tone.
[ ] Asset is readable on a portrait phone screen.
[ ] Asset has consistent outline thickness.
[ ] Asset can be recolored to the shared palette.
[ ] Asset does not introduce dark curse, horror, gore, or skull-heavy tone.
[ ] Asset filename can be mapped safely to the current project key.
[ ] Asset license allows commercial game usage.
```
