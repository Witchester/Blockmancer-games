# AGENT.md — Blockmancer Dungeon — Release 1.0 Current Agent Guide

**Updated:** 2026-05-22  
**Purpose:** Instructions for AI coding agents working on **Blockmancer Dungeon**.

This file defines the current project context, Source-of-Truth reading order, coding rules, canonical asset folder rules, monster-content rules, implementation workflow, validation expectations, and Definition of Done.

---

## 0. Highest-Priority Agent Rules

Follow these before all other project guidance.

```text
1. Use full-path `cd` commands.
2. Do not use patch format or patch tools.
3. Inspect existing files before editing.
4. Prefer modifying existing files in place.
5. Create new files only when the task or current repo structure requires it.
6. Read the focused SOT files before changing behavior/content/assets.
7. Preserve Cascade Gravity.
8. Preserve portrait-mobile readability.
9. Preserve cheerful festival / cute chaos tone.
10. Preserve save-facing IDs unless a current SOT or task explicitly authorizes rename/delete/migration.
11. Missing assets/content must fallback safely and must not crash gameplay.
12. Do not hardcode raw `public/assets/...` paths inside content JSON.
13. Content JSON should reference stable asset keys such as `spriteKey`, `iconKey`, `assetKey`, `portraitKey`, `backgroundKey`, or `assetRefs`.
14. Runtime systems/manifest resolve those keys to canonical paths.
15. If deleting or renaming content IDs, update every reference and add fallback/migration handling when needed.
16. Run validation/build commands after meaningful changes.
17. Report exactly what changed, what was validated, and what remains partial/fallback.
```

Do not ask unnecessary clarifying questions when the task is clear enough. Make the smallest safe change that satisfies the task and keeps the game playable.

---

## 1. Canonical Source-of-Truth Reading Order

Read `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` first. Then read the focused SOT files relevant to the task.

Current canonical SOT order:

| Order | File | Authority |
|---:|---|---|
| 0 | `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` | Documentation map, precedence, update policy. |
| 1 | `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` | Core game identity, tone, gameplay pillars, stages, heroes, Cascade Gravity, map/layout/progression design. |
| 2 | `docs/02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` | Story premise, route scenes, dialogue, boss intros, endings, character voice. |
| 3 | `docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` | Hazards, counterplay, reactive difficulty, warning windows, item/spell counters, soft-lock safety. |
| 4 | `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` | Asset sizes, exact-frame animation contract, asset fallback behavior, animation standards. |
| 5 | `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` | Current implementation status, partial/missing systems, audit findings, release priorities. |
| 6 | `docs/06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` | Canonical runtime asset folder/path authority and fallback path policy. |
| 7 | `docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` | Canonical monster roster, monster metadata, monster gameplay identity, monster asset metadata. |
| 8 | `AGENT.md` | Coding-agent rules and workflow. |

Precedence rules:

```text
- Core gameplay/design: 01 GDD wins.
- Story/dialogue/routes: 02 Story SOT wins.
- Hazards/counters/reactive difficulty: 03 Reactive Difficulty SOT wins.
- Asset sizes/animation/fallback: 04 Asset/Animation SOT wins.
- Current implementation truth: 05 Release Implementation SOT wins.
- Asset folder paths: 06 Canonical Folder Structure SOT wins.
- Monster roster/metadata: 07 Monster Wikipedia SOT wins.
```

If a legacy doc or old prompt disagrees with these SOTs, the focused SOT wins.

---

## 2. Project Identity

**Game Title:** Blockmancer Dungeon

**Genre:** Cheerful portrait-mobile falling-block roguelike RPG

**Platform Target:**

```text
Primary: Mobile portrait web game
Secondary: Android APK/AAB through Capacitor
Development preview: Desktop browser
```

**Core Concept:**

A magical festival machine called the **Block-O-Matic 3000** goes haywire during the Festival of Falling Stars and opens a colorful dungeon beneath the town square. Players clear rune block lines, trigger **Cascade Gravity** combos, cast silly spells, collect snacks, relics, upgrades, items, and unlock quirky heroes while restoring festival order and stopping **King Bloxley**, the self-appointed Block King.

**Core Fantasy:**

```text
You are a Blockmancer cleaning up magical chaos one combo at a time.
```

**Core Theme:**

```text
Creativity fixes chaos better than control.
```

The player is not saving a doomed world. The player is saving a magical festival from becoming a giant blocky mess.

---

## 3. Tone and Creative Direction

Always use this tone:

```text
Cheerful fantasy
Cute chaos
Festival adventure
Funny monsters
Cozy arcade energy
Bright polished 32-bit pixel-art style
Lighthearted dungeon crawl
Readable, colorful, playful UI and text
```

Never add:

```text
Dark curse lore
Grim tragedy
Horror tone
Edgy fantasy content
Realistic gore
Hopeless apocalypse
Skull-heavy UI
Overly serious villain writing
Blood/gore/violent injury language
```

Use **Oopsies**, **Silly Drawbacks**, or **Festival Mishaps** instead of curses in player-facing text.

Preferred tonal references, without copying:

```text
Paper Mario humor
Mario RPG energy
Puyo Puyo silliness
Fantasy Life coziness
Lighthearted arcade roguelike
Storybook festival warmth
```

---

## 4. Tech Stack

Release 1.0 stack:

```text
Phaser 3
TypeScript
Vite
Capacitor Android
HTML/CSS
LocalStorage
No backend for Release 1.0
```

Rules:

```text
- Keep Phaser 3 + TypeScript + Vite.
- Use Capacitor for Android packaging.
- Keep game logic modular and content data-driven.
- Do not migrate to Unity, Godot, or another engine unless explicitly requested.
- Do not introduce a backend unless explicitly requested.
- Avoid large dependencies unless clearly justified.
```

---

## 5. Current Project Structure Expectations

Prefer the current focused-SOT structure, not older generic document names.

```text
project-root/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  capacitor.config.ts
  AGENT.md

  docs/
    00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md
    01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md
    02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md
    03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md
    04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md
    05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md
    06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md
    07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md
    implementation/

  public/assets/
    board-blocks/
    sprites/
    effects/
    icons/
    stages/
    ui/
    portraits/
    story/
    audio/
    fonts/
    placeholders/
    store/
    backgrounds/legacy/

  scripts/

  src/game/
    scenes/
    systems/
    content/
    data/
    types/
    ui/
    utils/
```

Do not introduce new top-level structures unless the current repo already supports them or the task explicitly requires them.

---

## 6. Core Gameplay Pillars

All gameplay decisions should support these pillars:

```text
1. Falling-block board gameplay.
2. Cascade Gravity as the board identity.
3. Combat through line clears, cascades, mana, spells, items, relics, upgrades, weapons, and hero passives.
4. Compact JRPG-style battle panel above the board.
5. Roguelike map progression with normal, elite, event, shop, rest, treasure, and boss nodes.
6. Stage-specific monsters, elite monsters, bosses, hazards, and goals.
7. Cheerful festival chaos tone.
8. Mobile portrait readability.
9. Data-driven content wherever practical.
10. Safe fallbacks for missing assets, content, and save fields.
11. Random gameplay events that affect board/combat/rewards/stage progress.
12. Stage goals that create optional side missions.
13. Festival Chaos Rules that vary combat rooms.
14. Battle mini-objectives that reward skillful play.
15. Dynamic board-size modifiers by stage, encounter, event, and boss phase.
16. Meta-progression through festival hub restoration.
17. Monster friendship / collection that supports the cute festival tone.
```

---

## 7. Portrait Mobile Layout Requirement

Portrait mobile is the primary target. Desktop preview should use a centered portrait frame.

Canonical battle layout uses a fixed portrait frame with these sections:

| Section | Role | Ratio | Canonical Source Size |
|---|---|---:|---:|
| Section 1 | Combat UI + Event Log | 25% | `1080x480` |
| Section 2 | Puzzle Gameplay Area | 55% | `1080x1056` |
| Section 3 | Controls / Spells / Actions | 20% | `1080x384` |

Rules:

```text
- Combat, puzzle, and controls must not overlap.
- Event Log stays inside the combat area only.
- Do not use a separate top HP/Mana/Fever status bar.
- Keep board central and readable.
- Hold, Next Queue, inventory indicator, and controls must remain visible.
- Touch targets must be thumb-friendly.
- Detailed text belongs in modal/card/event log/separate scene, not over the board.
```

---

## 8. Cascade Gravity Requirement

Cascade Gravity is the main board mechanic. Do not replace it with classic row shifting.

Required behavior:

```text
1. Detect completed lines.
2. Remove cells in completed lines.
3. Apply deterministic grid-based gravity by column.
4. Blocks above fall downward within their own columns.
5. Detect new completed lines.
6. Repeat until board is stable.
7. Return a CascadeResult.
```

Required type:

```ts
export type CascadeResult = {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  specialBlocksTriggered: string[];
  causedCombo: boolean;
};
```

Balance baseline:

```text
Cascade 1: 100% damage
Cascade 2: 125% damage
Cascade 3: 150% damage
Cascade 4+: 200% damage
Cascade mana bonus: 50% of normal mana gain
```

Rules:

```text
- Do not use a real physics engine.
- Use deterministic grid-based gravity.
- Keep movement predictable and fair.
- Cascades should trigger damage, mana, combo, Fever, VFX, and counterplay where relevant.
```

---

## 9. Stage and Encounter Design

Release 1.0 has six stages.

| Stage | ID | Name | Main Mechanics | Boss |
|---:|---|---|---|---|
| 1 | `stage_sprinkle_sewers` | Sprinkle Sewers | Sticky blocks, sprinkle blocks, bonus mana | Cupcake Slime King |
| 2 | `stage_goblin_workshop` | Goblin Workshop | Junk blocks, bombs, board shake / machine pressure | Prototype No. 7 |
| 3 | `stage_frosty_pantry` | Frosty Pantry | Ice blocks, slow/fast fall waves, freeze | Gelato Golem |
| 4 | `stage_pillow_castle` | Pillow Castle | Soft blocks, shields, Sleepy status | Sir Snore-a-Lot |
| 5 | `stage_starfall_arcade` | Starfall Arcade | Fever, cascade bonuses, combo challenges | High Score Hydra |
| 6 | `stage_bloxley_block_palace` | Bloxley’s Block Palace | Royal blocks, symmetry, pattern junk | King Bloxley |

Encounter rules:

```text
- Normal nodes spawn normal monsters only.
- Elite nodes spawn elite monsters only.
- Boss nodes spawn bosses only.
- Stage 1 has no elite nodes by default.
- Elite nodes begin at Stage 2.
- Stage 5 and Stage 6 can support multiple elite nodes.
- Stage 6 should include a special pre-boss / mini-boss / Royal Guard pressure node if the current map system supports it.
```

---

## 10. Map Node Scaling Rules

Stage map node counts should scale as the run progresses.

```text
Stage 1 — Sprinkle Sewers: 6 main-path nodes, 9-11 total generated nodes, 0 elites.
Stage 2 — Goblin Workshop: 8 main-path nodes, 12-14 total generated nodes, 1 elite.
Stage 3 — Frosty Pantry: 10 main-path nodes, 15-17 total generated nodes, 1 elite.
Stage 4 — Pillow Castle: 12 main-path nodes, 18-21 total generated nodes, 1-2 elites.
Stage 5 — Starfall Arcade: 14 main-path nodes, 22-25 total generated nodes, 2 elites.
Stage 6 — Bloxley’s Block Palace: 16 main-path nodes, 26-30 total generated nodes, 2-3 elites plus one mini-boss / Royal Guard before final boss.
```

Rules:

```text
- Boss node is always the final required node of a stage.
- Elite nodes begin from Stage 2.
- Stage 6 should include a special pre-boss or mini-boss node.
- Map node state must include completed/current/available/locked states.
- Map state must save/load safely.
```

---

## 11. Dynamic Board Size Rules

Base board sizes:

```text
Stage 1: 8x16
Stage 2: 9x17
Stage 3: 9x18
Stage 4: 10x18
Stage 5: 10x19
Stage 6: 10x20
```

Encounter rules:

```text
Normal: use stage base size.
Hard normal: base size plus possible locked hazard row.
Elite: usually shrink width by 1 or height by 2; reward better loot.
Boss phase 1: base size plus boss mechanic.
Boss phase 2: shrink, expand, or reshape temporarily.
Final boss: board changes by phase, especially symmetry/square challenges.
Treasure/Rest/Event: variable depending on challenge or event choice.
```

Safety rules:

```text
- Never shrink below 6x12.
- Never expand beyond mobile-readable limits.
- When shrinking, preserve blocks safely or prevent shrink if occupied cells would become invalid.
- Use clear compression/overflow rules if unavoidable.
- Board size changes must not break Cascade Gravity.
- UI must rescale the board to remain readable in portrait mode.
```

---

## 12. Reactive Difficulty and Hazard Rules

Major hazards must be readable, counterable, and safe.

Supported/SOT hazard IDs include:

```text
hazard_floaty_rune
hazard_incoming_junk_queue
hazard_freeze_warning
hazard_preview_hidden
hazard_low_ceiling
hazard_royal_pattern
hazard_bad_piece_delivery
hazard_speed_wave
```

Counter tags include:

```text
counter_junk
counter_sticky
counter_float
counter_freeze
counter_preview
counter_speed
counter_sleep
counter_incoming_junk
counter_low_ceiling
counter_royal
counter_pattern
counter_board_size
counter_piece_queue
```

Hard rules:

```text
- Every major hazard needs warning text/counter window before resolving.
- No instant unavoidable loss.
- No soft-locks.
- Do not permanently hide Next, Hold, or Inventory.
- Do not hide Next, Hold, and Inventory all at the same time.
- Do not permanently shrink the board.
- Do not stack freeze + low ceiling + incoming junk/fill pressure unless explicitly safe and tested.
- Unsupported effects must log fallback/dev warning and fail safely.
```

Use existing systems first:

```text
BoardSystem
CombatSystem
DifficultySystem
EnemySystem
ItemSystem
SpellSystem
RelicSystem
HeroSystem
BattleScene warning/event log UI
```

---

## 13. Canonical Asset Folder Structure

Runtime asset root:

```text
public/assets/
```

Canonical folder tree:

```text
public/assets/
  board-blocks/
  sprites/
    board-blocks/
    heroes/
    monsters/
    bosses/
  effects/
  icons/
    board-blocks/
    battle-objectives/
    boss-rules/
    currencies/
    collectibles/
    chaos-rules/
    items/
    oopsies/
    relics/
    room-events/
    random-gameplay-events/
    status-effects/
    upgrades/
    weapons/
    spells/
    map-nodes/
    hub-buildings/
    route-story/
  stages/
    global-scenes/
    {stage_id}/
      battle/
      puzzle/
      boss-arena/
      map/
      route-scenes/
      props/
  ui/
    panels/
    buttons/
    hud/
    meters/
    mobile-controls/
    story-routes/
    animations/
    placeholders/
  portraits/
    heroes/
    npcs/
    bosses/
  story/
    endings/
    route-cards/
    dialogue-panels/
  audio/
    sfx/
    music/
    ui/
  fonts/
  placeholders/
  store/
  backgrounds/
    legacy/
```

Path policy:

```text
- Content JSON uses asset keys, not raw paths.
- Scenes/systems resolve assets through AssetSystem/manifest.
- Manifest primary paths must point at canonical folders.
- Legacy aliases can exist for compatibility but are not primary delivery targets.
- `public/assets/backgrounds/legacy/` is fallback-only.
- `public/assets/sprites/sprites/...` is invalid as a primary path.
```

---

## 14. Exact-Frame PNG Naming Contract

All frame-based animation assets use explicit PNG frames.

Required format:

```text
{asset_id}__{animation_name}__f00.png
{asset_id}__{animation_name}__f01.png
{asset_id}__{animation_name}__f02.png
```

Rules:

```text
- Use two-digit frame suffixes.
- Do not use GIFs as runtime animation sources.
- Do not use frame ranges as delivery contracts.
- Do not use old `_frame_01` names as primary files.
- Do not use old flat `spr_*_defeat.png` files as primary files.
- Missing final frames warn in development and fallback safely.
```

Source-size rules:

```text
Board gameplay blocks: 24x24.
Board icons: 48x48.
Non-board single-frame visual assets: 627x627.
Hero/monster/boss frame source: 627x627.
Hero/monster/boss 2x2 pose sheets: 1254x1254 with 627x627 cells.
VFX frames: 627x627.
Section 1 battle/boss backgrounds: 1080x480.
Section 2 puzzle far/mid/near backgrounds: 1080x1056.
Section 3 controls panels/backgrounds: 1080x384.
Full portrait scene/map/story backgrounds: 1080x1920.
```

Runtime display size is controlled by UI/display rules, not by source PNG dimensions.

---

## 15. Monster Content and 07 Monster Wikipedia Rules

`docs/07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` is the monster roster and metadata authority.

When working on monsters:

```text
- Read 07 Monster Wikipedia first.
- Align `src/game/content/monsters/**` to the 07 SOT roster.
- If the task says to rebuild from 07, you may delete/rename existing monster content.
- If a monster ID is removed/renamed, update all references across the repo.
- Do not leave broken references to removed monster IDs.
- Normal, elite, mini-boss, and boss-like entries must follow current runtime loading conventions.
- Do not keep obsolete monster entries merely for convenience.
```

Required monster metadata, where supported by current schema:

```text
id
name
description
stageId
rank or encounterRank
role
rarity/tier if used
spriteKey
iconKey
assetRefs if supported
stats
intent
behaviors
eliteActions if applicable
bossActions if applicable
resistances
weaknesses
scaling
reward/loot metadata if supported
implementationStatus/notes only if schema supports it
```

Preferred monster asset keys:

```text
spriteKey: "{monster_id}"
iconKey: "ico_{monster_id}"
```

If `assetRefs` is supported:

```json
{
  "assetRefs": {
    "idle": "{monster_id}__idle",
    "attack": "{monster_id}__attack",
    "hit": "{monster_id}__hit",
    "defeat": "{monster_id}__defeat",
    "icon": "ico_{monster_id}",
    "poseSheet": "{monster_id}__pose_sheet_2x2"
  }
}
```

Only add `assetRefs` if the schema supports it or after safely updating schema/validation.

---

## 16. Monster Asset Contract

Monster animation paths:

```text
public/assets/sprites/monsters/{monster_id}/idle/
public/assets/sprites/monsters/{monster_id}/attack/
public/assets/sprites/monsters/{monster_id}/hit/
public/assets/sprites/monsters/{monster_id}/defeat/
public/assets/sprites/monsters/{monster_id}/icon/
public/assets/sprites/monsters/{monster_id}/sheet/
```

Monster frame naming:

```text
{monster_id}__idle__f00.png
{monster_id}__attack__f00.png
{monster_id}__hit__f00.png
{monster_id}__defeat__f00.png
```

Monster icon naming:

```text
ico_{monster_id}.png
```

Monster pose sheet naming:

```text
{monster_id}__pose_sheet_2x2.png
```

Monster asset rules:

```text
- Monster frames are 627x627 source PNGs.
- Monster pose sheets are 1254x1254 with 627x627 cells.
- Runtime anchoring uses bottom-center alignment for battle sprites.
- Old flat `spr_` and `ico_` checklist names are fallback aliases only.
- Missing final monster art must fallback safely.
```

Expected canonical path resolution:

```text
public/assets/sprites/monsters/{monster_id}/idle/{monster_id}__idle__f00.png
public/assets/sprites/monsters/{monster_id}/attack/{monster_id}__attack__f00.png
public/assets/sprites/monsters/{monster_id}/hit/{monster_id}__hit__f00.png
public/assets/sprites/monsters/{monster_id}/defeat/{monster_id}__defeat__f00.png
public/assets/sprites/monsters/{monster_id}/icon/ico_{monster_id}.png
public/assets/sprites/monsters/{monster_id}/sheet/{monster_id}__pose_sheet_2x2.png
```

---

## 17. Elite Monster Rules

Elite monsters are separate monster entries, not stat-scaled normal monsters.

Rules:

```text
- Elite monster IDs should follow the canonical 07 Monster Wikipedia SOT.
- Prefer `mon_elite_*` IDs if the 07 SOT defines them.
- Elite monsters must be marked elite through the current schema.
- Elite monsters use canonical monster asset folders, not boss folders.
- Normal encounter pools must not spawn elites.
- Elite encounter pools must not spawn normal monsters unless the SOT explicitly allows it.
- Stage 1 has no elite by default.
- Elite nodes begin from Stage 2.
- Stage 6 Royal Guard / mini-boss should be wired if current map/runtime supports it.
```

Elite effects must map to existing SOT-supported hooks or safe fallbacks:

```text
incoming junk queue
bad piece delivery
freeze warning
speed wave
preview hidden
low ceiling
royal pattern
block insertion for known blocks such as block_crumb_junk, block_ice, block_royal, block_sticky
shield/status hooks if implemented
combo/cascade quota hooks if implemented
```

Unsupported elite actions must:

```text
- not crash,
- log a dev warning,
- show readable event-log feedback if useful,
- be marked partial/fallback in implementation reports.
```

---

## 18. Boss Asset and Content Boundary

Boss canonical folders:

```text
public/assets/sprites/bosses/{boss_id}/idle/
public/assets/sprites/bosses/{boss_id}/attack/
public/assets/sprites/bosses/{boss_id}/hit/
public/assets/sprites/bosses/{boss_id}/phase_change/
public/assets/sprites/bosses/{boss_id}/special_attack/
public/assets/sprites/bosses/{boss_id}/defeat/
public/assets/sprites/bosses/{boss_id}/portrait_icon/
public/assets/sprites/bosses/{boss_id}/sheet/
```

Rules:

```text
- If boss entries live inside `src/game/content/monsters`, preserve current runtime behavior unless a task explicitly rebuilds it.
- Do not move boss files unless the current runtime and SOT support it.
- Bosses use boss asset folders, not monster folders.
- Boss Rule Cards must match boss mechanics and remain readable on mobile.
```

---

## 19. Content Naming Rules

Use stable lowercase snake_case IDs.

Preferred prefixes:

```text
hero_
mon_
boss_
wpn_
spl_
rel_
upg_
item_
block_
status_
oops_
evt_
npc_
stage_
loot_
currency_
collectible_
r_evt_
goal_
chaos_
obj_
brule_
mod_
hub_
friend_
helper_
passive_
```

Rules:

```text
- Keep IDs stable once used in saves.
- Do not rename IDs without either SOT authority or migration/fallback handling.
- Content JSON should use assetKey/iconKey/spriteKey/assetRefs instead of hardcoded raw file paths.
- If deleting/renaming IDs based on SOT, update all references and document the changes.
```

---

## 20. Save System Rules

Use LocalStorage for Release 1.0 unless otherwise requested.

Save data must include a version field and safe defaults/migrations for new fields.

Save compatibility rules:

```text
- Corrupt save must not crash the game.
- Deleted/renamed monster IDs in old saves must fallback safely.
- Add migration when changing save schema.
- Route progress, stage goals, chaos rules, mini-objectives, random events, board-size modifiers, hub progress, monster friendship, and endings must have safe defaults.
```

---

## 21. Replayability Systems

Milestone C+ systems:

```text
RandomGameplayEventSystem
StageGoalSystem
ChaosRuleSystem
BattleObjectiveSystem
BossRuleSystem
BoardSizeModifierSystem
HubProgressionSystem
FriendshipSystem
```

Content folders:

```text
src/game/content/random-gameplay-events/
src/game/content/stage-goals/
src/game/content/chaos-rules/
src/game/content/battle-objectives/
src/game/content/boss-rules/
src/game/content/board-size-modifiers/
src/game/content/hub-buildings/
src/game/content/friendship/
```

Implementation rules:

```text
- Data-driven where practical.
- Stage/node filtered.
- Bounded randomness.
- Clear event log/toast feedback.
- No soft-locks.
- Safe save/load defaults.
- Mobile-readable HUD indicators.
```

---

## 22. Hero Passives

Each hero should change board/combat feel, not only stats.

```text
Milo: First cascade each battle gives bonus mana.
Pippa: Fire spells burn sticky/junk blocks.
Nixie: Once per room, reduces speed/freeze pressure.
Bruk: Survives board overflow once per battle or gains emergency shield.
Zuzu: More bomb blocks, with slightly more junk risk.
Lumi: Star blocks heavily boost cascade damage.
```

Do not add generic passives that do not visibly affect play.

---

## 23. UI and UX Rules

General UI rules:

```text
- Prioritize readability over decoration.
- Keep labels short.
- Use icons plus text where possible.
- Keep important numbers visible.
- Do not overcrowd the board.
- Avoid tiny text on mobile.
- Use clear button states and disabled states.
- Keep event log inside combat area.
- Keep controls visible.
```

Important HUD elements:

```text
Player HP
Player mana
Shield/status chips
Enemy HP
Enemy intent / attack countdown
Current stage
Gold
Fever meter
Combo/cascade count
Next Queue
Hold block
Inventory
Spell buttons
Active stage goal
Active chaos rule
Active battle mini-objective
Random event toast/log
Active oopsies
Board size modifier reason, when active
Hazard warning tray/counter hints
```

Accessibility options to preserve/support:

```text
screen shake on/off
reduced flashing
colorblind-friendly block symbols
button size
left-handed controls
volume/mute
```

---

## 24. Combat Rules

Combat power sources:

```text
line clears
cascade chains
spells
items
relics
upgrades
hero passives
weapon bonuses
chaos rules
battle mini-objective rewards
stage goal rewards
hub/friendship bonuses
```

Enemy behavior can affect:

```text
player HP
board junk
next preview
hold block
fall speed
mana
controls
status effects
board size modifiers
active random gameplay events
boss phase mechanics
```

Rules:

```text
- Enemy attacks should be readable or foreshadowed.
- Major hazards need warning/counter windows.
- Unsupported effects need fallback handling.
- Victory/defeat/reward flow must stay stable.
```

---

## 25. Validation and Build Commands

After meaningful changes, run relevant commands from the project root.

Use full-path `cd`:

```bash
cd "c:\Users\binh.pc\Desktop\New folder"
```

Content/asset/runtime validation commands:

```bash
npm run validate:content
npm run validate:metadata
npm run validate:animations
npm run sync:assets
npm run audit:asset-variants
npm run build
```

Also run if available:

```bash
npm run test
npm run lint
```

Android commands when mobile/Capacitor work changes:

```bash
npm run android:sync
npm run android:open
npm run android:build:debug
```

If a command does not exist in `package.json`, report it as unavailable. Do not claim it passed.

Validation expectations:

```text
- Missing final art should be warning/fallback-safe unless release-lock mode exists.
- TypeScript/build errors must be fixed.
- Content/schema errors must be fixed.
- Broken references after ID deletion/rename must be fixed.
- Validation reports should be included in implementation docs when requested.
```

---

## 26. Documentation / Implementation Reports

Create or update docs when changing:

```text
core mechanics
content schema
save schema
controls
release/build process
asset pipeline
canonical asset paths
monster roster/metadata
balance values
map-node scaling
dynamic board-size rules
replayability systems
route/story runtime behavior
```

Preferred implementation report folder:

```text
docs/implementation/
```

Useful report names:

```text
canonical_monster_rebuild_report.md
canonical_monster_content_alignment_report.md
elite_monster_runtime_integration_report.md
release_validation_report.md
```

Reports should include:

```text
Summary
Source files read
Files changed
Content matrix / reference matrix if relevant
Runtime/code updates
Validation/build results
Implemented vs partial/fallback vs not implemented
Known limitations
Recommended next steps
```

---

## 27. Agent Workflow

When given a task:

```text
1. `cd` to the project using the full path.
2. Read `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`.
3. Read the focused SOT files for the task.
4. Inspect current files before editing.
5. Identify the smallest safe change.
6. Implement content/schema/runtime updates.
7. Add safe fallback handling.
8. Update references if IDs/assets changed.
9. Update docs/report if requested or behavior changed.
10. Run relevant validation/build commands.
11. Summarize changes, validation results, and limitations.
```

Do not:

```text
- Use patch format.
- Rewrite unrelated systems.
- Remove working features without replacement.
- Introduce dark lore/content.
- Break mobile portrait layout.
- Ignore build/type errors.
- Leave old references to deleted IDs.
- Let content validate structurally while runtime effects silently do nothing.
```

---

## 28. Definition of Done for Any Coding Task

A task is done only when:

```text
[ ] Relevant SOT files were read.
[ ] Existing files were inspected before editing.
[ ] The smallest safe change was made.
[ ] The game builds successfully or build failure is documented honestly.
[ ] Existing gameplay is not broken.
[ ] TypeScript errors are fixed.
[ ] New content is data-driven where practical.
[ ] Missing assets/content have safe fallbacks.
[ ] Mobile portrait layout remains playable.
[ ] Save compatibility is considered.
[ ] Randomness is bounded, explained, and fair.
[ ] Board size changes preserve existing blocks safely.
[ ] New replayability systems are stage/node filtered where relevant.
[ ] Content references do not point to deleted/renamed IDs.
[ ] Canonical asset paths are respected.
[ ] Validation/build results are reported.
[ ] Relevant docs are updated if behavior changed.
```

When implementing a feature, include:

```text
- What changed
- Files changed
- How to test
- Commands run
- Known limitations
```

---

## 29. Manual Smoke Test Baseline

At minimum after gameplay/content changes:

```text
1. Start new run.
2. Select Milo.
3. Enter Stage 1 map.
4. Confirm Stage 1 has no elite node.
5. Enter first battle.
6. Move/rotate/drop piece.
7. Clear a line.
8. Verify Cascade Gravity.
9. Cast a spell.
10. Use an item if available.
11. Defeat monster.
12. Choose reward.
13. Move on map.
14. Save/refresh/continue.
15. Confirm stage goal/chaos/mini-objective UI does not overlap the board.
16. Trigger or simulate a random gameplay event if relevant.
17. Confirm board size changes safely in elite/boss/event scenarios if relevant.
18. Confirm Boss Rule Card appears before boss if relevant.
19. Confirm elite nodes from Stage 2+ spawn only elite monsters if relevant.
20. Confirm missing assets fallback safely.
```

Android smoke test when mobile/build work changes:

```text
1. Build web.
2. Sync Capacitor.
3. Build debug APK.
4. Install/open on Android.
5. Verify portrait orientation.
6. Verify touch controls.
7. Verify save/load.
```

---

## 30. Preferred Coding-Agent Final Response Format

After completing a task, respond with:

```text
Summary:
- ...

Files changed:
- ...

Commands run:
- ...

Validation/build results:
- ...

How to test:
- ...

Known limitations:
- ...
```

Keep it concise and practical. Be honest about partial/fallback/not implemented items.

---

## 31. Current Release Goal

The current project goal is:

```text
Turn the working MVP into a complete Release 1.0 game with cheerful festival content, Cascade Gravity, portrait-mobile UI, full roguelike progression, Android build readiness, canonical asset folder compliance, canonical monster roster/metadata, safe fallback systems, and the Festival Chaos & Replayability layer.
```
