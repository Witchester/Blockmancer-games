# Blockmancer Dungeon

Blockmancer Dungeon is a cheerful portrait-mobile falling-block roguelike RPG built with **Phaser 3 + TypeScript + Vite + Capacitor**.

The Block-O-Matic 3000 has gone haywire during the Festival of Falling Stars, opening a colorful dungeon beneath town square. Players clear rune block lines, trigger **Cascade Gravity** combos, activate **Fever Showtime**, cast silly spells, collect snacks, relics, upgrades, and items, and unlock quirky heroes while trying to restore festival order.

**Tone:** Cheerful festival · Cute chaos · Cozy arcade energy. No dark curse, horror, or edgy fantasy.

---

## Quick Start

```bash
npm install
npm run dev        # Vite dev server (hot reload)
npm run build      # TypeScript check + production build
npm run preview    # Preview production build locally
```

---

## Core Features

### Board Combat
- Falling-block board combat with **Cascade Gravity** (deterministic grid-based gravity, not classic row shifting)
- Hold piece, next piece, piece previews, lock delay
- Special blocks: bombs, stars, ice, sticky, royal, sprinkles, jelly, junk
- Dynamic board sizes per encounter type with spawn zone safety

### Fever Showtime (5-phase implementation)
- **Phase 1:** Fever meter that fills via cascades, activates into Showtime state
- **Phase 2:** Charged Lines — completed lines held during Fever for big release; manual release (debug key `M`)
- **Phase 3:** Combat damage with boss caps (40% elite / 30% boss / 25% final boss), Showtime Overflow conversion
- **Phase 4:** Pressure Budget — board-state-aware junk scaling, Soft Junk temporary blocks, Fever Heat penalties
- **Phase 5:** 7 Fever upgrades: Festival Hype, Longer Showtime, Bigger Stage, Graceful Release, Safety Confetti, Showtime Overflow, Star Encore

### Roguelike Progression
- **6 stages:** Sprinkle Sewers → Frosty Pantry → Pillow Castle → Goblin Workshop → Starfall Arcade → Bloxley Block Palace
- **7 bosses:** Cupcake Slime King, Gelato Golem, Sir Snore-a-Lot, Prototype No. 7, High Score Hydra, King Bloxley + boss rule cards
- **Map routing** with branching nodes (fight, elite, shop, rest, treasure, event, boss)
- **Festival Level-Up system** — XP from combat, 3-card pick-one on level-up, 36 hero-specific upgrades
- **Sequential encounter packs** — 1-3 enemies per node with monster stack UI, entry effects, node result screen

### Heroes (6 playable)
| Hero | Style |
|---|---|
| Milo (Blockmancer) | Balanced board control, mana efficiency |
| Pippa (Pyromancer) | Fire damage, burn scaling |
| Zuzu (Goblin Engineer) | Bomb synergy, gadget randomness |
| Nixie (Frostbinder) | Ice/freeze control, mana from thaws |
| Bruk (Snack Knight) | Tanky HP scaling, snack shields |
| Lumi (Star Witch) | Star blocks, Fever synergy, cascade scoring |

Each hero has a 6-stage route story, dialogue scenes, barks, and endings via `RouteStorySystem`.

### Combat & Items
- **23 spells:** Fireball, Bomb Rune, Frost Lock, Void Cut, Clean Cut, Star Spark, Confetti Pop, Bubble Shield, and more
- **37 consumable items:** themed counter items (anchor cookies, alarm cookies, safety nets), healing snacks, bombs, catalysts
- **16 relics:** passive run modifiers (Cracked Crown, Slime Core, Void Eye, Stone Heart, Star Sticker, etc.)
- **59 upgrades:** 23 general run upgrades + 36 hero-specific level-up cards

### Reactive Difficulty
- **Dynamic hazards:** floating blocks, incoming junk, low ceiling, freeze, preview disruption, speed waves, royal patterns
- **Counter windows:** warnings before hazard triggers, counter items with timing windows
- **Chaos rules:** 9 board-modifying rules (Confetti Fever, Royal Inspection, Snack Tax, etc.)
- **Battle objectives:** 11 optional in-battle goals with reward integration
- **Random events:** 21 mid-battle surprises (Blanket Tangle, Bomb Delivery, Confetti Overload)
- **Oopsies:** 9 cheerful risk/reward drawbacks (Blind Preview, Sugar Crash, Too Much Confetti)

### Meta & Persistence
- LocalStorage save/load (save version 9 with v8→v9 migration)
- Hub progression with meta upgrades and buildings
- Monster friendship system (9 befriendeable monsters with once-per-run rewards)
- Collection tracking, settings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Engine | Phaser 3 |
| Language | TypeScript (strict) |
| Bundler | Vite 7 |
| Mobile | Capacitor 7 (Android) |
| Testing | Playwright + Node smoke tests |
| Font | VT323 (pixel-style) |

---

## Project Structure

```
├── src/game/
│   ├── systems/         # 42 game systems (Board, Fever, Combat, Boss, Route, etc.)
│   ├── scenes/          # 24 scene files (Battle, Map, Reward, LevelUp, NodeResult, etc.)
│   ├── types/           # 9 type definition files
│   ├── content/         # ~388 JSON data-driven content files (26 categories)
│   │   ├── heroes/      # 9 hero definitions + metadata
│   │   ├── stages/      # 7 stages + metadata
│   │   ├── monsters/    # 54 monsters (7 bosses, 10 elites, 35+ regulars)
│   │   ├── spells/      # 23 spells
│   │   ├── weapons/     # 11 weapons
│   │   ├── items/       # 37 items
│   │   ├── relics/      # 16 relics
│   │   ├── upgrades/    # 59 upgrades (23 general + 36 hero level-up)
│   │   ├── story/       # 36 route scenes + barks + endings + voice tags
│   │   ├── loot-tables/ # Battle, boss, elite, shop, event, stage-specific tables
│   │   └── ...          # chaos-rules, battle-objectives, oopsies, friendship, etc.
│   ├── data/            # Default state factories, constants
│   └── utils/           # Shared utilities
├── public/assets/       # Runtime assets (canonical folder structure)
├── docs/                # Source-of-truth files (7 SOT docs) + implementation reports
├── scripts/             # Content validation, asset sync/audit/generation
├── tests/               # Remediation smoke tests
├── android/             # Capacitor Android project
└── _bmad/               # BMad agent workflow outputs
```

---

## Docs — Source of Truth

Read these in order for any task:

| Order | File | Purpose |
|---|---|---|
| 0 | `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` | Doc map, update policy, source precedence |
| 1 | `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` | Core design, gameplay, stages, heroes, routes |
| 2 | `docs/02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` | Story premise, dialogue, route scenes |
| 3 | `docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` | Hazards, counters, reactive difficulty |
| 4 | `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` | Asset folders, PNG contract, pixel art rules |
| 5 | `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` | Implementation status, code audit |
| 6 | `docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` | `public/assets/` tree, fallback policy |
| 7 | `docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` | Monster encyclopedia |

**Implementation report:** `docs/FEVER_SHOWTIME_CASCADE_IMPLEMENTATION_REPORT.md`

---

## Scripts

```bash
npm run dev                   # Vite dev server
npm run build                 # TypeScript check + full production build
npm run preview               # Preview production build locally
npm run test                  # Remediation smoke test
npm run validate:content      # Validate content JSON data
npm run validate:metadata     # Validate content metadata
npm run validate:animations   # Validate animation asset definitions
npm run validate:ui-layouts   # Validate UI layout configs
npm run sync:assets           # Sync assets to canonical folders
npm run audit:asset-variants  # Audit asset variant completeness
npm run assets:folders        # Ensure canonical asset folders exist
npm run assets:placeholders   # Generate placeholder assets
npm run clean                 # Remove dist, .vite cache, android build artifacts

# Android
npm run android:init          # Initialize Capacitor Android project
npm run android:sync          # Build + sync to Android
npm run android:open          # Open in Android Studio
npm run android:build:debug   # Build debug APK
```

---

## AI Agent Assistance

This repository supports AI agent workflows (BMad, Command Code). See:

- `AGENTS.md` — Agent rules, workflow, CodeGraph instructions, SOT reading order
- `.commandcode/taste/` — Learned code preferences
- `.agents/skills/` — Available agent skills (BMad + Game Dev Suite)
- `_bmad/` — BMad PRD, architecture, epics, UX, sprint outputs

---

## Key Conventions

- **Cascade Gravity** is the core board identity — do not replace with classic row shifting
- **Portrait mobile** is the primary target; desktop uses centered portrait frame
- **Cheerful festival tone** — no dark curse, horror, gore, or edgy fantasy
- **Save-facing IDs** must not be renamed/deleted without migration
- **Asset keys** in content (not raw `public/assets/` paths); resolved by `AssetSystem`
- **Exact-frame PNG naming** for animations: `{asset_id}__{anim_name}__f00.png`
- **Missing assets/content must fallback safely** — never crash
- **Board size changes** must preserve existing blocks or prevent shrink

---

## License

Private repository. Add a license before public distribution.
