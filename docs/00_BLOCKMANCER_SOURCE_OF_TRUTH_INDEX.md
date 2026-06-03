# Blockmancer Dungeon — Source of Truth Index

**Updated:** 2026-06-02  
**Purpose:** Current documentation map, source precedence, and active cross-SOT product decisions.

This pack is the current canonical SOT set for Blockmancer Dungeon. It intentionally contains current project decisions only. Do not keep duplicate historical status sections in this index.

## Canonical Reading Order

| Order | File | Use for |
| ---: | --- | --- |
| 0 | `00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` | Documentation map, update policy, source precedence. |
| 1 | `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` | Core identity, tone, layout, Cascade Gravity, stages, heroes, Fever Showtime, upgrade rules, release design scope. |
| 2 | `02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` | Story premise, route scenes, character voice, dialogue style, boss intros, endings, and microcopy. |
| 3 | `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` | Hazards, counterplay, Pressure Budget, Soft Junk, Fever fairness, route reward/risk modifiers, smoke tests. |
| 4 | `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` | Asset sizes, exact-frame PNG contracts, animation frame counts, VFX, UI assets, fallback behavior. |
| 5 | `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` | Implementation status, phases, validation expectations, agent prompts, release readiness. |
| 6 | `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md` | Canonical `public/assets/` tree, stage folder separation, raw-path policy, fallback path policy. |
| 7 | `07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md` | Monster/boss metadata, stage fit, attack intent, counterplay, Fever interactions, monster asset contracts. |

## Source Precedence

1. Core design: `01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`.
2. Dialogue, routes, boss intros, endings, and player-facing voice: `02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md`.
3. Hazards, item counters, spell catalysts, route risks/rewards, Fever fairness: `03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md`.
4. Asset sizes, frame counts, animation contracts, fallback behavior: `04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md`.
5. Current implementation status and release next steps: `05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`.
6. Asset folder placement and fallback-only path policy: `06_BLOCKMANCER_CANONICAL_FOLDER_STRUCTURE_SOURCE_OF_TRUTH.md`.
7. Monster-facing metadata and boss behavior notes: `07_BLOCKMANCER_MONSTER_WIKIPEDIA_SOURCE_OF_TRUTH.md`.

## Active Product Decisions

| Area | Current Decision |
| --- | --- |
| Engine | Phaser 3 + TypeScript + Vite + Capacitor remains the target stack. |
| Core board identity | Cascade Gravity is the core line-clear behavior; do not replace it with classic row shifting. |
| Tone | Cheerful festival, cute chaos, cozy arcade RPG. No horror, gore, grim tragedy, dark curse framing, or edgy villain fantasy. |
| Primary layout | Portrait mobile, 1080×1920 reference frame, 25% combat / 55% puzzle / 20% controls. |
| Asset root | Runtime assets live under `public/assets/`; content references asset keys, not raw paths. |
| Fever | Fever is Showtime Cascade mode with Charged Lines, release timing, Fever Heat, Soft Junk, Pressure Budget, and Boss Drama Guard. |
| Upgrade system | Level-up uses Hero / Board / Fever category selection, 5 total upgrade slots, Lv1-Lv5 cards, and Legendary Evolution. |
| Save safety | Preserve save-facing IDs unless a migration is documented. Missing fields normalize safely. |
| Fallback safety | Missing assets/audio/content must warn in development and never crash gameplay. |

## Fever Showtime Cascade — Current Canonical Rules

Fever is Showtime Cascade mode, not a passive always-on buff.

Lifecycle:

```text
Fill Fever meter
→ Activate Showtime
→ Completed lines become Charged Lines
→ Stack during a short lock window
→ Release manually or automatically
→ Clear Charged Lines together
→ Resolve through normal Cascade Gravity
→ Apply combat damage, boss caps, overflow, pressure safety, and upgrade effects
```

Rules:

- Completed rows during Showtime become Charged Lines and do not clear immediately.
- Fever release must resolve through the existing Cascade Gravity system.
- Physical board state is encounter-local.
- Charged Lines, Soft Junk, Fever Heat, and unresolved release state never persist between nodes.
- Bosses and final bosses use Boss Drama Guard caps so Fever cannot one-shot or skip multiple phases.
- Boss/enemy block-add during Fever uses Pressure Budget, Soft Junk, and Fever Heat.
- Fever UI lives in compact HUD/right-rail/control patterns; do not create a separate top HP/Mana/Fever bar.


## Upgrade System Redesign — Current Canonical Rules

The upgrade system is split into three player-chosen categories:

```text
Hero
Board
Fever
```

Level-up flow:

```text
Node cleared
→ Node Result Screen
→ Level Up Ready
→ Choose upgrade category: Hero / Board / Fever
→ Show 3 upgrade cards from the selected category
→ Player picks 1 card
```

Card rarity/rank labels are removed from the normal upgrade system. Do not use Common / Uncommon / Rare / Epic / Legendary as normal card ranks.

Normal card progression is:

```text
Card Lv1 → Lv2 → Lv3 → Lv4 → Lv5 → Legendary Evolution
```

Every upgrade card has exactly 5 normal levels. Every level must provide a meaningfully different effect or behavior change. Avoid simple numeric-only stacking.

Slot rules:

```text
Total run upgrade slots: 5
Hero slots: max 2
Board slots: max 2
Fever slots: max 2
```

Valid examples:

```text
2 Hero / 2 Board / 1 Fever
2 Hero / 1 Board / 2 Fever
1 Hero / 2 Board / 2 Fever
```

Invalid examples:

```text
5 Hero
5 Board
5 Fever
```

Owned-card selection levels the card and does not consume a new slot. New-card selection claims an available category slot.

Owned cards should reappear more often than unowned cards. Higher-level owned cards should reappear more often than lower-level owned cards. Lv4 cards should receive strong priority so players can finish a build. Lv5 and Legendary cards are removed from the normal offer pool.

When a card reaches Lv5:

```text
Card reaches Lv5
→ readyToEvolve = true
→ play or queue evolution transition
→ show 2 Legendary Evolution choices from that card’s pool
→ player chooses 1
→ save legendaryEvolutionId
→ card becomes Legendary
```

Each active card should have at least 10 possible Legendary Evolutions. Only 2 are shown at evolution time. Legendary Evolution uses the same slot and does not consume an extra slot.

Hero-specific cards only appear for the selected hero. Generic Hero cards can appear for any hero. Board cards must preserve Cascade Gravity. Fever cards must respect Fever Showtime caps, Boss Drama Guard, and board-local state rules.


## Codex / Agent Prompt Header

Use this at the start of implementation prompts:

```text
Use AGENTS.md.
Use CodeGraph index before editing.
Read docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md first.
Then read only the focused SOT files for the phase.
Keep Cascade Gravity, cheerful festival tone, portrait-mobile readability, fallback-safe assets/audio/content, and existing save-facing IDs.
Fever Showtime board-local state must never persist between nodes.
```

## Update Policy

- Update the focused SOT that owns the fact.
- Update this index only when source ownership, active product decisions, reading order, or cross-SOT rules change.
- Do not duplicate implementation status across design files; implementation truth belongs in `05`.
- Do not add new asset folders in prompts; update `06` first.
- Do not rename save-facing IDs or runtime asset keys without documenting migration behavior.
