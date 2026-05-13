# Production Roadmap

## Current state

The MVP is playable and fun. The next work is production hardening, content expansion, polish, and release readiness.

## Milestone 1 — MVP stabilization

Goal: Keep the fun loop stable and remove obvious friction.

Tasks:

```text
[ ] Fix known bugs
[ ] Add settings scene
[ ] Add clear tutorial prompts
[ ] Improve mobile controls
[ ] Add content validation to CI/manual workflow
[ ] Add fallback asset pipeline
[ ] Add save migration version
```

Exit criteria:

```text
Game can be played 10 times without crash.
All core loop actions work.
Build passes.
```

## Milestone 2 — Content alpha

Goal: Add enough content for replayability.

Targets:

```text
3 heroes
10 weapons
18 monsters
3 bosses
16 spells
30 relics
40 upgrades
20 events
12 curses
14 board blocks
```

Exit criteria:

```text
At least 5 runs feel meaningfully different.
No content entry is unreachable unless intentionally locked.
```

## Milestone 3 — UX/audio/visual alpha

Goal: Replace placeholder feel with coherent presentation.

Tasks:

```text
[ ] UI skin pass
[ ] First full block sprite set
[ ] Enemy sprite pass for MVP enemies
[ ] Spell/relic/upgrade icons
[ ] Basic SFX pass
[ ] Music placeholder or licensed temp music
[ ] Damage numbers and improved feedback
```

Exit criteria:

```text
Screenshots no longer look placeholder.
Core actions have audio/visual feedback.
```

## Milestone 4 — Balance beta

Goal: Tune for fairness and replayability.

Tasks:

```text
[ ] Run telemetry or manual stat logging
[ ] Tune early stages
[ ] Tune boss fights
[ ] Tune shop economy
[ ] Tune relic/upgrade rarity
[ ] Add easy/normal/hard modes
```

Exit criteria:

```text
New players usually reach mid-run.
Experienced players can win but still feel pressure.
```

## Milestone 5 — Mobile beta

Goal: Android build ready for external testing.

Tasks:

```text
[ ] Capacitor sync/build
[ ] Test APK on multiple devices
[ ] Touch controls polish
[ ] Performance pass
[ ] App icon/splash
[ ] Store-compatible AAB path
```

Exit criteria:

```text
Android build installs and runs.
Touch controls are usable.
No major performance spikes.
```

## Milestone 6 — Release candidate

Goal: Store-ready build.

Tasks:

```text
[ ] Final content lock
[ ] QA regression pass
[ ] Store page assets
[ ] Trailer/screenshots
[ ] Credits/licenses
[ ] Privacy policy if analytics added
[ ] Content rating questionnaire
[ ] Release notes
```

Exit criteria:

```text
No blocker bugs.
Release checklist complete.
Build submitted for review where applicable.
```

## Post-release roadmap

### Patch 1

```text
bug fixes
balance hotfix
mobile UX fixes
```

### Update 1

```text
new hero
new boss
new spell school
new relic pack
```

### Update 2

```text
daily runs
challenge modifiers
leaderboard if appropriate
```

## V2 roadmap additions

### Milestone A — portrait mobile rebuild

Goal: make the current MVP conform to the final portrait-only layout.

Tasks:

```text
[ ] Lock/design primary portrait aspect
[ ] Implement top 1/5 battle panel
[ ] Implement middle 3/5 board panel
[ ] Implement bottom 1/5 mobile controls
[ ] Add hold block UI
[ ] Add next block queue UI
[ ] Add inventory/relic quick strip
[ ] Add portrait safe-area handling
```

### Milestone B — act and boss expansion

```text
[ ] Add act data files
[ ] Add Slime Baron boss
[ ] Add Junkmaster Gob boss
[ ] Add Cryo Lich boss
[ ] Add Stone Titan boss
[ ] Add Mirror Witch optional boss/event boss
[ ] Expand Falling King final boss phases
```

### Milestone C — hero stories and unlocks

```text
[ ] Add story fields to hero JSON
[ ] Add unlock condition tracker
[ ] Add locked hero cards
[ ] Add unlock toast/summary after run
[ ] Add hero-specific starting loadouts
```

### Milestone D — 32-bit pixel-art conversion

```text
[ ] Pick licensed pixel fonts
[ ] Replace placeholder vector UI with pixel UI skins
[ ] Create block sprites
[ ] Create hero portraits
[ ] Create boss sprites
[ ] Create UI frames for portrait layout
```
