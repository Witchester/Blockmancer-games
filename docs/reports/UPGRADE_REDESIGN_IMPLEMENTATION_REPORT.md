# Upgrade System Redesign — Implementation Report

**Date:** 2026-06-02
**Branch:** main
**SAVE_VERSION:** 10
**Status:** Release-ready (Legendary pools are placeholder — see Known Limitations)

---

## 1. Feature Summary

The upgrade system was redesigned from a flat stack-based model into a structured card-based system across seven prompts:

| Prompt | Scope | Status |
|--------|-------|--------|
| P1 | Data model + save migration | Complete |
| P2 | Category-first level-up flow + slot enforcement | Complete |
| P3 | Card progression + weighted offer logic | Complete |
| P4 | Content migration + 27 card definitions + 28 runtime handlers | Complete |
| P5 | Legendary Evolution selection | Complete |
| P6 | (Validation + smoke) — incorporated across prompts | Complete |
| P7 | UX polish + documentation | Complete |

---

## 2. Data Model

### Types (GameTypes.ts)

- `UpgradeCategory` = `"hero" | "board" | "fever"`
- `UpgradeCardDefinition` — card template (id, category, heroId, 5 levels, legendaryPool)
- `UpgradeCardLevel` — single level (level: 1-5, title, description, effectType, effectConfig)
- `LegendaryEvolutionDefinition` — legendary capstone (id, name, description, effectType, tags)
- `RunUpgradeCardState` — runtime card instance (cardId, category, level: 1-5, slotIndex, readyToEvolve, legendaryEvolutionId)
- `RunUpgradeSlotState` — slot record (index, category, cardId)
- `RunUpgradeState` — container (version, slots[], ownedCards{}, legacyUpgradeIds[])
- `LevelUpScreenState.pendingLegendaryEvolution` — pending evolution trigger

### Save Migration (v10)

- Old `upgrades[]` array preserved in `legacyUpgradeIds[]`
- New `runUpgradeState` initialized with 5 empty slots, empty ownedCards
- `pendingLegendaryEvolution` survives save/load with full validation

---

## 3. Category + Slot Rules

- **5 total slots, 2 per category** (Hero, Board, Fever)
- Category-first flow: player picks category → sees 3 filtered cards
- Full categories dimmed/disabled with "Full — 2/2" label
- Total 5/5 blocks all categories with "0 total slot(s) free"
- New card claims slot; owned card levels up without new slot

---

## 4. Card Progression

- **Lv1 → Lv5**: Each level has unique effectType + effectConfig
- **Weighted offers**: Unowned=100, Lv1=150, Lv2=220, Lv3=320, Lv4=500
- **Lv5 → readyToEvolve**: Automatic flag
- **Lv5 / Legendary cards excluded** from normal offers
- **Seeded randomness** ensures deterministic replay

---

## 5. Legendary Evolution

- Triggers when card hits Lv5 (via `pendingLegendaryEvolution`)
- Routes to `LegendaryEvolutionScene`
- Shows 2 unique choices from card's `legendaryPool`
- Player picks 1 → `legendaryEvolutionId` saved, effect applied
- Same slot, same category, no new slot consumed
- Pending state survives save/load
- Stale pending auto-cleaned on load

---

## 6. Card Content (27 cards)

### Hero-specific (6)
Listening Lines (Milo), Hearthfire (Pippa), Safe Prototype (Zuzu), Slow the Room (Nixie), Table Guard (Bruk), Star Path (Lumi)

### Generic Hero (4)
Hero Focus, Festival Courage, Careful Footing, Clever Timing

### Board (9)
Gravity Choir, Tidy Falling, Deep Stack Rhythm, Space Reader, Pocket Planner, Queue Comb Training, Early Warning Ribbon, Soft Landing, Square Etiquette

### Fever (8)
Festival Hype, Longer Showtime, Bigger Stage, Graceful Release, Safety Confetti, Showtime Overflow, Star Encore, Stagecraft

---

## 7. Runtime Handler Coverage (28 effectTypes)

**Hero (12):** `hero_max_hp_boost`, `hero_shield_start`, `hero_heal_after_node`, `hero_mana_gain`, `hero_spell_damage`, `hero_warning_timing`, `hero_milo_mana_bonus`, `hero_pippa_fire_mastery`, `hero_zuzu_bomb_safety`, `hero_nixie_slow_timing`, `hero_bruk_guard_bonus`, `hero_lumi_star_bonus`

**Board (8):** `board_line_damage`, `board_cascade_bonus`, `board_hold_bonus`, `board_next_queue_reveal`, `board_soft_junk_reduction`, `board_hazard_warning`, `board_low_ceiling_safety`, `board_stack_rhythm`

**Fever (8):** `fever_gain_bonus`, `fever_duration_bonus`, `fever_capacity_bonus`, `fever_release_shield`, `fever_release_safety`, `fever_overflow_utility`, `fever_star_encore`, `fever_stagecraft`

All unsupported types log `console.warn` + safe fallback text.

---

## 8. UX Polish (Prompt 7)

- Category screen: "Choose Your Upgrade Path" with descriptive helper text
- Slots: "Full — 2/2" and "1/2 — 3 slot(s) free"
- Card status: "New Card" / "Card LvN" / "Ready to Evolve" / "Legendary"
- Empty pool fallback: "No cards available in this category right now."
- Legendary fallback: safe auto-apply with placeholder ID if pool empty
- EXP display unified in `#98a0c7` (#d8deff was inconsistent)

---

## 9. Files Changed (All Prompts)

| File | Prompts |
|------|---------|
| `src/game/types/GameTypes.ts` | P1, P2, P5, P7 |
| `src/game/types/ContentTypes.ts` | P4 |
| `src/game/data/constants.ts` | P1 |
| `src/game/data/defaultRunState.ts` | P1, P5, P7 |
| `src/game/systems/SaveSystem.ts` | P1 |
| `src/game/systems/ContentRegistry.ts` | P4 |
| `src/game/systems/LevelUpSystem.ts` | P2, P3, P4, P5 |
| `src/game/systems/UpgradeCardEffectHandler.ts` | P4 (new) |
| `src/game/ui/level-up/LevelUpFlowRouter.ts` | P2, P4, P5 |
| `src/game/ui/level-up/LevelUpDataAdapter.ts` | P3, P7 |
| `src/game/scenes/LevelUpRewardScene.ts` | P2, P3, P4, P7 |
| `src/game/scenes/LegendaryEvolutionScene.ts` | P5 (new) |
| `src/game/BlockmancerGame.ts` | P5 |
| `tests/run-remediation-smoke.mjs` | P7 |
| `src/game/content/upgrade-cards/*.json` | P4 (28 new) |

---

## 10. Legacy Compatibility

- Old `upg_lvl_*` IDs mapped to new cards via `legacyAliases`
- Old upgrade content still loads via `upgrade` category pool
- New card pool takes priority; legacy fills gaps
- Old saves v9 and below migrate safely to v10

---

## 11. Validation Results

| Command | Result |
|---------|--------|
| `npm run build` | Pass (571 modules) |
| `npm run validate:ui-layouts` | Pass (17 specs) |
| `npm run test` | Pass |

---

## 12. Known Limitations

1. **Legendary pools are placeholders** — all 27 cards have a single placeholder entry. Need 10 real legendary definitions per card.
2. **Pool size validation** — the `>= 10` check is not automated; 27 cards currently have 1 placeholder each.
3. **Legendary effect handlers** — placeholder legendary entries re-use base handlers (e.g., `board_line_damage`). Real legendary-specific effects need dedicated handlers.
4. **Card icon assets** — all cards use `placeholder_upgrade`. Production icons needed.
5. **Balance numbers** — damage, HP, mana, and shield values are draft estimates. Full balance pass needed.
6. **Progressive upgrades are capped at 5 total** — if a player fills all 5 slots before reaching Lv5 on any card, they cannot level existing cards further without changing slots (no unslot feature yet). Intentional design but worth noting.

---

## 13. Recommended Future Tuning

- **Legendary pool completion**: 10 real legendary definitions per card with dedicated handlers
- **Balance pass**: Damage/HP/shield/mana numbers across all 27 × 5 levels
- **Card art production**: Upgrade card icons, legendary card art, evolution VFX
- **Slot management UI**: Ability to view/manage owned cards and slots outside of level-up flow
- **Save compatibility test suite**: Automated regression for old saves across versions
- **Multi-hero runs**: Currently only one hero per run; hero-specific cards for non-selected heroes are excluded
- **Fever saturation check**: Multiple fever cards with `maxChargedLines` bonus could exceed 100 cap — already clamped but should be verified
