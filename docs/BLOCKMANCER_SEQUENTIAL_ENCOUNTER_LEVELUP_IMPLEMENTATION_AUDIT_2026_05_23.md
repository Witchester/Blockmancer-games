# BLOCKMANCER Sequential Encounter + Node Result + Festival Level-Up Implementation Audit (2026-05-23)

## Executive Summary
- Overall completion estimate: **~82%** for Steps 1-14 feature-chain readiness (implementation present, but some deterministic/save-edge and balance verification gaps remain).
- Biggest implemented pieces:
  - Sequential encounter pack types, generator, and battle chaining are in place.
  - Node Result + XP application guard + Level-Up scenes are in place.
  - Save migration/versioning and additional idempotency guard fields were added.
  - General + hero-specific upgrade content and many runtime hooks are wired.
- Biggest missing/incomplete pieces:
  - Deterministic behavior gaps in encounter entry-effect pick and level-up card generation.
  - Some level-up card restore logic is fallback/regenerate-oriented rather than strict deterministic replay.
  - Manual smoke-only concerns remain for fairness/route/save edge paths.
- Highest risk areas:
  - Mid-flow save/load determinism around level-up card offerings.
  - Potential duplicate or stale-state behavior in edge timing windows without manual smoke verification.
  - Stage 6 naming alias mismatch risk (`bloxley_block_palace` vs `bloxleys_block_palace`) across docs/content conventions.

## Step-by-Step Matrix
| Step | Name | Status | Evidence | Missing / Risk | Priority | Recommended Fix Prompt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Data contracts | Mostly Implemented | [src/game/types/GameTypes.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/types/GameTypes.ts) defines `NodeEncounterPack`, `EncounterEnemyEntry`, `BiomeMonsterPool`, `WeightedMonsterRule`, `EncounterPackScalingRule`, `EnemyEntryEffectContent`, `NodeResultSummary`, `NodeResultXpBreakdown`, `PlayerLevelState`, `LevelUpScreenState`; level-up card type in [src/game/systems/LevelUpSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/LevelUpSystem.ts). | `NodeEncounterPack` data model still tuned for Release 1 max 3 via generator clamp; future 1-5 not blocked at type level, but not fully behavior-validated. | P2 | "Audit and unify any duplicate/overlapping encounter/level-up types across `types/*` and scene-local interfaces; keep save-facing IDs unchanged." |
| 2 | Biome monster pool content | Mostly Implemented | Files present: [biome-monster-pools.json](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/difficulty-scaling/biome-monster-pools.json), [encounter-pack-scaling.json](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/difficulty-scaling/encounter-pack-scaling.json), [enemy-entry-effects.json](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/difficulty-scaling/enemy-entry-effects.json); loaded by [ContentRegistry.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/ContentRegistry.ts). 6 stage pools and fallback IDs exist. | Stage 6 naming convention differs from some docs (`stage_bloxley_block_palace` in content vs `stage_bloxleys_block_palace` in design docs), potential alias drift risk. | P1 | "Add an explicit stage-ID alias map and validation rule for Bloxley stage IDs across content/docs/runtime lookups." |
| 3 | Encounter Pack Generator | Mostly Implemented | [EncounterPackSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/EncounterPackSystem.ts): `generateEncounterPack`, seed usage (`seededRandom`), nodeType/stage/depth inputs, duplicate cap, banned pair tags, fallback pack, elite/royal/boss filtering, budget multipliers, early/late caps. | Not fully deterministic: `selectEntryEffect` uses `choice(...)` (non-seeded); pack ID uses `pack_${stageId}_${nodeType}_${nodeId}` (can collide across retries/runs). | P1 | "Make entry-effect selection seed-driven and include run-scoped entropy in encounterPackId while preserving backward compatibility for old saves." |
| 4 | Battle-state plumbing | Implemented | `RunState` stores active pack and node-result/level-up state in [GameTypes.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/types/GameTypes.ts); load normalization in [defaultRunState.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/data/defaultRunState.ts); battle initialization in [BattleScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/BattleScene.ts). | Minimal risk: old saves rely on normalization quality; present but manual smoke still needed. | P1 | "Run deterministic battle-state restore smoke matrix (mid-fight, post-final-pre-result, post-result-pre-level-up)." |
| 5 | Enemy defeat transition | Mostly Implemented | [BattleScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/BattleScene.ts) `handleVictory()` advances enemy index, keeps one active enemy, defers rewards/result until full clear, handles boss branch. | Needs manual smoke for all route/boss edge combinations; route fallback now guarded later in NodeResult path. | P1 | "Perform manual smoke on non-final vs final enemy transitions (normal, elite, boss, royal_guard) and verify no premature reward/fallback." |
| 6 | Enemy entry pressure + gift | Mostly Implemented | [EncounterPackSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/EncounterPackSystem.ts) + [BattleScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/BattleScene.ts) apply entry effect with pressure/gift IDs and once-only guards (`appliedEntryEffectEnemyIndexes`, `entryGiftClaimedEnemyIndexes`). | Deterministic risk from non-seeded entry effect choice; fairness needs smoke for instant-loss combinations. | P1 | "Seed entry-effect pick and run manual hazard fairness checklist for Stage 1/2/6 entry effects." |
| 7 | Monster Stack UI | Implemented | [MonsterStackPreview.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/ui/MonsterStackPreview.ts) + wiring in [BattleScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/BattleScene.ts) (`new MonsterStackPreview`, `refresh`). Active/next/mystery behavior present; icon size 24/28/32. | Layout overlap risk remains manual-smoke-only for compact devices. | P2 | "Run portrait-mobile UI smoke across widths 360-430 for monster stack overlap against HP/intent/log." |
| 8 | Node Result / EXP Summary | Mostly Implemented | [NodeResultScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/NodeResultScene.ts) displays enemies, XP total/breakdown, next-level remaining, level-up-ready signal; flow before RewardScene. | Idempotency improved, but still requires manual replay checks around repeated scene entry/load timing. | P1 | "Smoke test repeated save/load around NodeResult Continue to confirm no duplicate XP/heal/reward state transitions." |
| 9 | EXP / PlayerLevelState | Mostly Implemented | [LevelUpSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/LevelUpSystem.ts), [EncounterPackSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/EncounterPackSystem.ts), [defaultRunState.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/data/defaultRunState.ts), [SaveSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/SaveSystem.ts). XP curve 25/35/50/70/+25 present; pending levels tracked. | Some duplicate-guard correctness depends on claim IDs + scene ordering; needs smoke. | P1 | "Add deterministic regression tests for NodeResult claim/xpApplied semantics using existing test runner pattern." |
| 10 | Festival Level-Up screen | Partially Implemented | [LevelUpRewardScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/LevelUpRewardScene.ts), [LevelUpSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/LevelUpSystem.ts), [RewardScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/RewardScene.ts). 3-card flow, one choice, pending loop, reroll support, hero filtering present. | Determinism gap: card generation uses `Math.random`; `levelUpSelectionSeed` saved but not used for deterministic generation/replay. | P0 | "Make level-up card generation seed-driven and restore exact offered cards on load for unresolved selections." |
| 11 | General upgrades | Mostly Implemented | Upgrade content files under [src/game/content/upgrades](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/upgrades); handlers across [UpgradeSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/UpgradeSystem.ts), [CombatSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/CombatSystem.ts), [SpellSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/SpellSystem.ts), [FeverSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/FeverSystem.ts), [EncounterPackSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/EncounterPackSystem.ts), [NodeResultScene.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/scenes/NodeResultScene.ts). | Several effects are passive/indirect; hard caps mostly respected via formulas and content limits; requires manual balancing validation. | P1 | "Audit each general level-up upgrade with before/after combat logs to verify cap enforcement and no duplicate trigger behavior." |
| 12 | Hero-specific upgrades | Mostly Implemented | Full hero-specific content IDs exist in [src/game/content/upgrades](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/upgrades); runtime hooks across Battle/Spell/Combat/Encounter systems; hero filtering in [LevelUpSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/LevelUpSystem.ts). | Level 3 hero-card attempt is heuristic (`level >= 3`) and random; strict deterministic offering not guaranteed. | P1 | "Add deterministic hero-card offer policy and smoke verify once-per-node/combat guards for each hero-specific trigger." |
| 13 | Save/load hardening | Mostly Implemented | Save version bump + migration in [constants.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/data/constants.ts), [SaveSystem.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/systems/SaveSystem.ts); normalization in [defaultRunState.ts](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/data/defaultRunState.ts); idempotency guards in Battle/NodeResult/Reward/LevelUp scenes. | Remaining P0 risk is deterministic restore of unresolved level-up offerings and mid-battle edge timing not smoke-verified. | P0 | "Run focused save/load smoke matrix and patch any remaining duplicate or state-loss windows without adding new tooling." |
| 14 | Balance pass | Unknown / Needs Manual Smoke | Data updates in [encounter-pack-scaling.json](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/difficulty-scaling/encounter-pack-scaling.json) and entry effects in [enemy-entry-effects.json](/C:/Users/phamc/Desktop/Blockmancer-games/src/game/content/difficulty-scaling/enemy-entry-effects.json); formula caps in Combat/Spell/Fever/Encounter systems. | Cannot confirm fairness/no-unavoidable-loss from static audit only; manual runs are required for Stage 1/2/5/6 pacing and hazard readability. | P1 | "Run manual balance sweep for Stage 1, Stage 2 elite, and Stage 5/6 hazard pressure; adjust only conservative numeric ranges." |
| 15 | Skipped | Skipped by Product Decision | Prior implementation instructions explicitly required Step 15 skip; no new debug tooling/smoke harness was added in this audit pass. | None. | P3 | "Keep Step 15 skipped unless product explicitly re-opens debug-tooling scope." |

## Save/Idempotency Risk Review
- Duplicate EXP risk: **Mitigated but not fully proven**. `nodeResultClaims.xpApplied` and `applyNodeResultXpIfNeeded` exist; needs manual save/load timing smoke.
- Duplicate reward risk: **Mitigated** with `activeEncounterPack.nodeRewardsGranted`; still manual verify around scene restarts.
- Duplicate route fallback risk: **Mitigated** with `routeFallbackTriggeredForEncounterPack` gate in NodeResult flow.
- Duplicate entry gift risk: **Mitigated** with `entryGiftClaimedEnemyIndexes`.
- Old save migration risk: **Medium**. Migration to v8 adds defaults, clamping, and fallback fields, but old-schema edge combinations require smoke.
- Mid-battle save/load risk: **Medium-High**. Active enemy/pack fields persist, but deterministic entry-effect and unresolved level-up offering replay is not strict.

## Balance Review
- Stage-by-stage ranges exist and were tuned conservatively in encounter scaling.
- Caps exist in formulas/content for major progression stats:
  - clear line damage (`+16` via 8 stacks x2)
  - max HP percent (`+50%` cap)
  - spell damage (`+48%` cap)
  - cascade damage (`+30%` cap)
  - starting shield (content stack 5 and practical cap behavior through setup formulas)
  - fever gain (`+40%` cap)
  - hazard resistance (`20%` cap)
  - entry grace (`+3` cap)
- Static audit cannot verify "no unavoidable loss" in all hazard combinations; requires play smoke.

## Content Validation Review
- Missing monster IDs: **Not detected in validator output** (`validate:content` pass), but runtime lookup fallback still exists.
- Invalid stage IDs: **No hard validator failure**; however, naming convention drift exists around Bloxley stage alias.
- Bloxley palace alias issue: **Risk present** (`stage_bloxley_block_palace` in content/runtime vs `stage_bloxleys_block_palace` in some docs).
- Unsupported upgrade effect IDs: **Partially guarded** by `LEVEL_UP_EFFECT_IDS` in LevelUpSystem; unsupported IDs filtered out of offers.
- Unsupported entry effect IDs: **Fallback-safe** via `entry_none_safe` and content registry fallback.
- Missing `fallbackMonsterId`: **Not detected** in stage pool files audited.
- Raw asset path violations: `src/game/content` scan found **no `public/assets/` raw path literals**.
- Dark/horror wording violations: content scan found legacy wording traces (e.g., `evt_cursed_fountain`, "professional horror" phrase); tone-cleanup backlog remains.

## Manual Smoke Checklist
- Stage 1 single-enemy node: **Needs manual smoke**.
- Stage 1 two-enemy node: **Needs manual smoke**.
- Stage 2 elite: **Needs manual smoke**.
- Save/load during enemy 2: **Needs manual smoke**.
- Node Result after final enemy: **Needs manual smoke**.
- Level-Up screen: **Needs manual smoke**.
- Upgrade stack persistence: **Needs manual smoke**.
- Boss node: **Needs manual smoke**.
- Route fallback after full node clear: **Needs manual smoke**.

## Commands Run (Audit 2026-05-23)
- `npm run validate:content` -> Pass (`388 JSON files, 36 route scenes`).
- `npm run validate:metadata` -> Pass.
- `npm run validate:animations` -> Pass with non-fatal missing-frame warnings.
- `npm run sync:assets` -> Pass with missing production asset report (fallback-safe).
- `npm run audit:asset-variants` -> Pass with warnings.
- `npm run build` -> Pass.
- `npm run lint` -> Missing script.
- `npm run test` -> Script exists but failed due missing route/story asset scaffold `.gitkeep` files.

## Recommended Next Prompts
1. "Implement deterministic level-up card generation and restore using persisted seed + offered card IDs; preserve save compatibility."
2. "Run and document manual smoke for sequential encounter + node result + level-up save/load edge cases only; do not add new tooling."
3. "Add stage ID alias validation for Bloxley naming drift and enforce a canonical runtime ID across content and docs."
4. "Perform a conservative Stage 1/2/5/6 balance verification pass based on manual smoke findings; adjust only scaling JSON and caps."
