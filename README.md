# Blockmancer Dungeon

Blockmancer Dungeon is a cheerful portrait-mobile falling-block roguelike RPG built with Vite, TypeScript, Phaser 3, and Capacitor.

The canonical project source of truth is:

```text
docs/01_GDD_MASTER.md
```

Use that file for design, content direction, tone, gameplay rules, technical direction, save requirements, release scope, and acceptance criteria. Other markdown files are supporting or historical references.

## Core Direction

The Block-O-Matic 3000 has gone haywire during the Festival of Falling Stars, opening a colorful dungeon beneath town square. Players clear rune block lines, trigger Cascade Gravity combos, cast silly spells, collect snacks, relics, upgrades, and items, and unlock quirky heroes while trying to restore festival order and stop King Bloxley.

Tone rules:

- Cheerful fantasy.
- Cute chaos.
- Festival adventure.
- Funny monsters.
- Cozy arcade energy.
- No dark curse lore, horror tone, grim tragedy, or edgy fantasy content.

## Core Features

- Falling-block board combat.
- Cascade Gravity line clears.
- Compact JRPG-style battle panel.
- Spells, relics, upgrades, and consumable items.
- Roguelike map progression.
- Stage-specific monsters and bosses.
- Oopsies as cheerful risk/reward drawbacks.
- Random gameplay events, stage goals, chaos rules, mini-objectives, boss rule cards, hub progression, and monster friendship hooks.
- Data-driven content in `src/game/content/`.
- LocalStorage save/load.
- Web build and Android packaging support.

## Tech Stack

- Vite
- TypeScript
- Phaser 3
- Capacitor
- HTML/CSS
- LocalStorage

## Getting Started

Install dependencies:

```bash
npm install
```

Run the web development server:

```bash
npm run dev
```

Build the web app:

```bash
npm run build
```

## Validation

Validate content before release builds:

```bash
npm run validate:metadata
npm run validate:content
npm run build
```

## Android

Initialize Android support:

```bash
npm run android:init
```

Sync the native project:

```bash
npm run android:sync
```

Open Android Studio:

```bash
npm run android:open
```

Build a debug APK:

```bash
npm run android:build:debug
```

## Documentation

- Canonical source: `docs/01_GDD_MASTER.md`
- Documentation index: `docs/00_INDEX.md`
- Wording reference: `blockmancer_lighthearted_content_direction.md`
- Story reference: `blockmancer_lighthearted_story.md`

## Project Structure

- `src/game/` - gameplay systems, scenes, UI, data, and types.
- `src/game/content/` - data-driven content JSON.
- `public/assets/` - runtime assets.
- `docs/` - canonical source plus supporting/historical docs.
- `scripts/` - content validation scripts.
- `android/` - Capacitor Android project.

## License

This repository is currently private. Add a license before public distribution.
