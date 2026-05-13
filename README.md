# Blockmancer Dungeon

Blockmancer Dungeon is a Phaser 3 puzzle-combat roguelike MVP built with Vite, TypeScript, and Capacitor. The game blends falling-block mechanics with tactical combat, mana-driven spellcasting, rewards, and branching room progression.

## Features
- Puzzle combat using a falling-block board
- Mana generation and spellcasting
- Enemy waves with unique disruption behaviors
- Reward selection with relics and upgrades
- Branching map progression with combat and event rooms
- Web-ready build and Android packaging support
- Data-driven content for easy balancing and expansion

## Tech Stack
- Vite
- TypeScript
- Phaser 3
- Capacitor
- HTML/CSS

## Getting Started
1. Install dependencies
```bash
npm install
```
2. Run the web development server
```bash
npm run dev
```
3. Open the app at the local URL shown by Vite

## Build
Build and preview the web app:
```bash
npm run build
npm run preview
```

## Android
Capacitor is configured for Android packaging. The local environment should include:
- Node.js LTS
- JDK 17
- Android Studio
- Android SDK

Initialize Android support:
```bash
npm run android:init
```

Sync the native project:
```bash
npm run android:sync
```

Open the Android project in Android Studio:
```bash
npm run android:open
```

Build a debug APK from Android Studio or via CLI:
```bash
cd android
gradlew.bat assembleDebug
```

Expected output:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Validation
Validate content metadata and content data before building:
```bash
npm run validate:metadata
npm run validate:content
```

## Controls
Desktop:
- `A` / `Left Arrow`: Move left
- `D` / `Right Arrow`: Move right
- `S` / `Down Arrow`: Soft drop
- `W` / `Up Arrow`: Rotate
- `Space`: Hard drop
- `1` / `2` / `3` / `4`: Cast spells
- `Esc`: Pause placeholder

Mobile:
- On-screen movement, rotation, drop, and spell buttons

## Project Structure
- `src/` — main game source code
- `src/game/` — gameplay systems, scenes, and content definitions
- `docs/` — design docs, technical notes, and build guides
- `scripts/` — validation scripts for content metadata and data
- `android/` — generated Android native project files

## Notes
- Game content is data-driven and stored in `src/game/content/` for easy iteration.
- Placeholder asset keys are used in content data and can be swapped for real art assets later.
- The gameplay board is designed for lightweight, fun puzzle-combat rather than competitive Tetris precision.

## Useful Docs
- `docs/GDD.md` — game design document
- `docs/TECHNICAL_DESIGN.md` — technical design notes
- `docs/BUILD_APK.md` — Android build instructions
- `docs/ROADMAP.md` — planned feature roadmap

## License
This repository is currently private. Add a license block here if you choose a public license.
