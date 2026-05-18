# Blockmancer Dungeon - Release 1 Code Audit Report With Story Flow

Audit date: 2026-05-18
Workspace: `C:\Users\phamc\Desktop\Blockmancer-games`

## 1. Executive Summary

Release 1 is now materially further along than the previous report stated. The character route story flow is no longer only documentation-ready: the repo now contains `RouteStorySystem`, route progress save migration, route scene JSON, route dialogue UI, boss callback hooks, route reward hooks, and route ending resolution.

Current release status: buildable and validation-clean, with remaining release risk concentrated in missing final assets/audio, manual smoke-test coverage, placeholder-heavy visual content, shallow switch-based effect implementations, and lack of automated tests/lint.

Keep the current stack: Phaser 3 + TypeScript + Vite + Capacitor remains the pragmatic path. There is enough runtime code, content, validation, and asset fallback infrastructure that an engine migration would slow Release 1 more than it helps.

## 2. Commands Run In This Audit

| Command | Result | Notes |
|---|---|---|
| `npm.cmd run validate:content` | Pass | Content validation passed: 335 JSON files, 36 route scenes. |
| `npm.cmd run validate:metadata` | Pass | Content metadata validation passed. |
| `npm.cmd run validate:animations` | Pass with warnings | Validated 384 exact animation definitions. Warned that 1851 expected PNG frame files are missing; this is non-fatal by design. |
| `npm.cmd run audit:asset-variants` | Pass with fallback report | Board blocks audited: 21; heroes: 8; stages: 6; missing optional variants: 60. |
| `npm.cmd run sync:assets` | Pass | Runtime asset keys found: 209; physical assets scanned: 1694; unresolved assets: 0; 12 missing audio files covered by fallback. |
| `npm.cmd run build` | Fail in sandbox, pass escalated | Sandboxed Vite/esbuild could not read `vite.config.ts`; escalated run passed. |
| `npm run test` | Not available | No `test` script exists. |
| `npm run lint` | Not available | No `lint` script exists. |

## 3. Current Git / Workspace Notes

- The working tree is dirty with existing content, docs, scripts, asset-folder, and runtime changes.
- `public/assets/**/.gitkeep` scaffold files are now visible to Git by `.gitignore` rules.
- Generated reports were refreshed by `sync:assets` and `audit:asset-variants`.
- This audit does not revert any pre-existing user or generated changes.

## 4. Highest Severity Findings

### P0

| Finding | Evidence | Impact | Required Action |
|---|---|---|---|
| No automated test script exists. | `package.json` has no `test`. | Core board, save migration, route rewards, and ending logic can regress silently. | Add deterministic tests or smoke harness for Cascade Gravity, save migration, route choice resolution, and endings. |
| No lint script exists. | `package.json` has no `lint`. | Code quality and dead paths rely on manual review. | Add lint/type-check script or document build-only policy. |
| Build requires sandbox escalation in this environment. | Sandboxed `npm.cmd run build` fails with Vite/esbuild access denied for `vite.config.ts`; escalated build passes. | Local audit can verify build, but CI/dev docs should not depend on this sandbox behavior. | Keep using normal local/CI build; note sandbox-only failure in QA records. |
| Manual gameplay smoke tests were not run. | No browser/dev-server/device smoke in this pass. | Runtime route triggers, mobile layout, rewards, and endings are code-present but not play-verified. | Run desktop and portrait-mobile smoke checklist before release. |

### P1

| Finding | Evidence | Impact | Required Action |
|---|---|---|---|
| Final animation PNG packages are missing. | `validate:animations` warns about 1851 expected frame files. | Gameplay is fallback-safe but release presentation is incomplete. | Import Priority 1 board, VFX, UI, hero, monster, boss frame sequences. |
| Many visual assets remain placeholders. | `audit:asset-variants` reports 60 optional missing variants; many content entries use `placeholder_*` sprite/icon keys. | Release visuals will feel unfinished even though fallback safety works. | Replace placeholders for Release 1 critical path. |
| Real audio is missing or incomplete. | `sync:assets` reports 12 missing audio files covered by fallback. | Synth/fallback audio is not release-grade unless intentionally accepted. | Add final OGG files or define fallback audio as product style. |
| Gameplay effects are partly switch-based and partial. | `GameplayEffectSystem`, `SpellSystem`, `ItemSystem`, `RelicSystem`, `UpgradeSystem`, and route reward handling use explicit cases. | New content can validate structurally while still doing little or nothing. | Validate every content effect against supported runtime handlers. |
| Boss mechanics are still shallow in places. | `BossSystem` includes safe placeholder mechanics for unknown/unsupported boss behavior. | Bosses may not feel distinct enough for Release 1. | Verify each boss rule has visible mechanical behavior. |

## 5. Story Flow Audit Result

Previous status: docs complete / runtime pending.

Current status: runtime implemented, validation passing, manual smoke pending.

| Story Flow Requirement | Current Status | Evidence | Remaining Risk |
|---|---|---|---|
| 36 unique hero-stage route scenes | Implemented | 6 route scene files, 36 scenes, 108 choices. `validate:content` reports 36 route scenes. | Needs playthrough smoke verification. |
| Three choices per route scene | Implemented | Route JSON contains 108 total choices. | UX needs portrait-mobile testing. |
| True flags | Implemented | 36 true choices grant true flags. | Ending thresholds need play verification. |
| Route progress save model | Implemented | `RunState.routeProgress`, `defaultRunState`, `SaveSystem` migration version 5. | Needs migration tests for old saves. |
| Route dialogue UI | Implemented | `RouteDialogueScene.ts`. | Layout/text fit needs device screenshots. |
| Route triggers | Implemented | `MapScene`, `BattleScene`, `RouteStorySystem.shouldTriggerRouteScene`. | Trigger timing needs smoke testing across event-node and combat fallback paths. |
| Route rewards | Implemented, partial coverage | `RouteStorySystem.applyRouteReward` supports gold, heal, mana, shield, item, relic, upgrade, battle/stage/boss/hazard modifiers. | Unsupported reward types safely report no hooked effect. |
| Route risks | Implemented | `RouteStorySystem.applyRouteRisk`, hazard queue integration, oopsie chance. | Needs balancing and soft-lock checks. |
| Boss callbacks | Implemented | `BattleScene` calls `getBossCallback` and `applyBossCallbackModifier`. | Needs per-hero/stage visible verification. |
| Normal / True / Risky Variant endings | Implemented | `route-endings.json` has 18 endings; `RewardScene`, `BattleScene`, `VictoryScene`, `MetaSystem`. | Needs final-stage playthrough verification. |
| Route story assets | Manifest/scaffold implemented | `assets.ts`, `AssetSystem.getRouteStoryTexture`, final asset folders. | Real portraits, panels, ending cards, and route icons still missing. |

Route content counts:

| Item | Count |
|---|---:|
| Route scene files | 6 |
| Route scenes | 36 |
| Route choices | 108 |
| True flags | 36 |
| Route endings | 18 |

## 6. Feature Implementation Matrix

| Area | Status | Evidence | Remaining Gap | Priority |
|---|---|---|---|---|
| Cascade Gravity | Implemented | `BoardSystem.clearLinesCascade`, `applyCascadeGravity`, `CombatSystem.resolveCascadeClear`. | Needs deterministic tests and smoke cases with special blocks. | P0 |
| Board controls | Implemented | `BoardSystem`, `BattleScene`, `InputSystem`, `MobileControls`. | Mobile ergonomics need device verification. | P1 |
| Combat loop | Implemented | `CombatSystem`, `BattleScene`, enemy defeat/reward flow. | More tests for modifiers and bosses. | P1 |
| Enemy system | Implemented / partial behavior depth | `EnemySystem`, monster content. | Advanced behaviors remain light. | P1 |
| Boss system | Partial | `BossSystem`, `BossRuleSystem`, boss JSON, boss callbacks. | Some mechanics are placeholder-safe rather than fully distinct. | P1 |
| Spell system | Partial | `SpellSystem`, spell content. | Runtime spell behavior coverage does not fully match content roster. | P1 |
| Item system | Partial | `ItemSystem`, item content, route rewards. | Content coverage exceeds verified behavior coverage. | P1 |
| Reward system | Implemented | `RewardSystem`, `RewardScene`, loot tables. | UI/balance smoke pending. | P1 |
| Relic system | Partial | `RelicSystem`, relic content. | Unsupported relics are safe placeholders. | P2 |
| Upgrade system | Partial | `UpgradeSystem`, upgrade content. | Unsupported upgrades are safe placeholders. | P2 |
| Hero system | Partial | `HeroSystem`, hero content, unlock meta. | 8 heroes exist while Release 1 story route covers 6. | P1 |
| Weapon system | Placeholder/partial | `WeaponSystem`, weapon content. | Combat integration is limited. | P2 |
| Map system | Implemented | `MapSystem`, `MapScene`, route trigger integration. | Stage path and route trigger timing need smoke tests. | P1 |
| Stage system | Implemented lookup layer | `StageSystem`, stage content. | Rules remain distributed. | P3 |
| Route story system | Implemented, smoke pending | `RouteStorySystem`, route JSON, `RouteDialogueScene`, `VictoryScene`. | Manual and automated coverage missing. | P1 |
| Event system | Partial | `EventSystem`, room-event content. | Effects are switch-limited. | P1 |
| Shop system | Partial | `ShopSystem`, `ShopScene`. | Economy and inventory smoke pending. | P2 |
| Oopsie system | Partial | `OopsieSystem`, oopsie content. | Needs tone/effect verification. | P1 |
| Fever system | Partial | `FeverSystem`, combat hooks. | UX/balance smoke pending. | P2 |
| Save system | Implemented | `SaveSystem`, `defaultRunState`, meta migration. | No migration tests. | P0 |
| Asset system | Implemented fallback/manifest | `AssetSystem`, `assets.ts`, `animations.ts`, folder script. | Final art missing. | P1 |
| Audio system | Partial fallback | `AudioSystem`, asset sync report. | Real audio missing. | P2 |
| Tutorial system | Partial | `TutorialSystem`, `TutorialScene`. | Does not cover later replayability/story systems. | P2 |
| Settings/accessibility | Partial | `SettingsSystem`, `SettingsScene`. | Device verification needed. | P2 |
| Reactive difficulty | Partial | `DifficultySystem`, hazards, item counters, route risks. | Tuning and soft-lock checks needed. | P1 |
| Random gameplay events | Partial | `RandomGameplayEventSystem`, 20 content files. | Effect coverage must be checked. | P1 |
| Stage goals | Partial | `StageGoalSystem`, 6 content files. | Consequences need verification. | P1 |
| Chaos rules | Partial | `ChaosRuleSystem`, 8 content files. | Supported effects are limited. | P2 |
| Battle objectives | Improved / needs tests | `BattleObjectiveSystem` now has real checks for junk and board height. | Needs deterministic validation. | P1 |
| Hub progression | Placeholder | `HubProgressionSystem`, hub-building content. | Mostly summaries. | P2 |
| Friendship | Placeholder | `FriendshipSystem`, friendship content. | Mostly points/display. | P3 |

## 7. Content Loading Audit

All listed categories are loaded by `ContentRegistry` and current validation passes.

| Category | Count |
|---|---:|
| battle-objectives | 10 |
| board-blocks | 21 |
| boss-rules | 6 |
| chaos-rules | 8 |
| collectibles | 1 |
| currencies | 1 |
| difficulty-scaling | 4 |
| friendship | 8 |
| heroes | 8 |
| hub-buildings | 8 |
| items | 36 |
| loot-tables | 12 |
| map-nodes | 8 |
| monsters | 42 |
| npcs | 8 |
| oopsies | 8 |
| random-gameplay-events | 20 |
| relics | 15 |
| room-events | 11 |
| spells | 22 |
| stage-goals | 6 |
| stages | 6 |
| status-effects | 7 |
| story route/support files | 9 |
| upgrades | 15 |
| weapons | 10 |

## 8. Asset / Animation Audit

Current status: fallback-safe, not release-art complete.

- `sync:assets` reports unresolved assets: 0.
- Missing audio is covered by fallback: 12 files.
- `validate:animations` validates 384 exact animation definitions.
- Missing animation frame files: 1851 expected PNGs.
- `audit:asset-variants` reports 60 optional missing variants.
- Final asset folder structure has been scaffolded through `scripts/ensure-final-asset-folders.mjs`.
- Board block exact-frame paths and route story asset manifest entries are implemented.

Release risk: high for presentation, low for crash safety.

## 9. GDD Compliance

| Requirement | Status | Notes |
|---|---|---|
| Cascade Gravity identity | Compliant | Implemented and should be protected by tests. |
| Portrait mobile primary target | Mostly compliant | Layout helpers and mobile controls exist; device smoke pending. |
| Cheerful festival tone | Mostly compliant | Current route content is aligned; older docs/content may still contain legacy wording. |
| Data-driven content | Mostly compliant | JSON content is broad; effect execution still has hardcoded handlers. |
| Safe fallbacks | Compliant | Assets/audio/content/route/save fallbacks exist. |
| Exact PNG frame sequences | Compliant in code/docs | Missing final PNG packages remain. |
| Six-stage story route | Implemented | 36 route scenes, 18 endings. |
| Functional route choices | Implemented, partial depth | Rewards and risks hook into existing systems, with safe fallback for unsupported paths. |
| Boss callbacks | Implemented | Battle startup applies callback text/modifier when route lane exists. |
| Hero endings | Implemented | Normal/True plus optional Risky Variant path exists. |

## 10. Manual Smoke Checklist Status

Not manually tested in this pass.

| Smoke Path | Status |
|---|---|
| Start a new run | Code-present, not manually tested |
| Select Milo or another route hero | Code-present, not manually tested |
| Enter Stage 1 map | Code-present, not manually tested |
| Trigger event-node route scene | Code-present, not manually tested |
| Trigger combat-victory route fallback | Code-present, not manually tested |
| Choose Practical / True / Risky route option | Code-present, not manually tested |
| Verify reward/risk effects | Code-present, not manually tested |
| Verify route progress save/load | Code-present, not manually tested |
| Reach boss and see callback | Code-present, not manually tested |
| Finish Stage 6 / King Bloxley | Code-present, not manually tested |
| Resolve Normal/True/Risky Variant ending | Code-present, not manually tested |
| Portrait-mobile text fit | Not manually tested |

## 11. Priority Backlog

### P0 - Stabilization

1. Add automated tests or deterministic smoke harness for Cascade Gravity.
2. Add save migration tests, especially route progress and route ending unlocks.
3. Add route choice resolution tests for all reward types and risk branches.
4. Add `test` and `lint` scripts or explicitly document replacements.
5. Run full desktop and portrait-mobile smoke tests.

### P1 - Release 1 Core

1. Import Priority 1 exact-frame PNG animation assets.
2. Replace critical-path placeholder sprites/icons/portraits/ending cards.
3. Verify all route triggers, route rewards, boss callbacks, and endings in play.
4. Verify every boss rule has visible mechanical behavior.
5. Audit item/spell/relic/upgrade/oopsie content against supported effect handlers.
6. Verify random gameplay events, stage goals, battle objectives, chaos rules, and reactive hazards cannot soft-lock runs.
7. Tone-clean remaining legacy wording where it is user-facing.

### P2 - Release Polish

1. Add final OGG audio or approve fallback audio as the intended style.
2. Add Playwright screenshot script to `package.json` if it is part of QA.
3. Balance shop/economy/rewards.
4. Validate Android debug build.
5. Improve accessibility/settings verification.

### P3 - Later

1. Expand hub progression into a real upgrade loop.
2. Expand friendship into a full progression loop.
3. Decide whether the two extra heroes are Release 1, unlockable extras, or backlog.
4. Add a dedicated boss intro scene if inline boss cards are not enough.

## 12. Recommended Next Prompt

Do a Release 1 stabilization pass:

1. Add deterministic tests or a smoke harness for Cascade Gravity, save migration, route choice resolution, route rewards, boss callbacks, and ending resolution.
2. Run a browser smoke test on desktop and portrait-mobile viewports.
3. Fix any route dialogue layout overflow found by screenshots.
4. Verify all 36 route scenes can trigger exactly once per run/hero-stage.
5. Verify route save/load preserves scores, true flags, chosen scenes, triggered scenes, and ending unlocks.
6. Verify each boss callback is visible and mechanically applied.
7. Keep Cascade Gravity, exact-frame PNG naming, fallback-safe assets/audio, and cheerful festival tone intact.

Run:

```bash
npm.cmd run validate:content
npm.cmd run validate:metadata
npm.cmd run validate:animations
npm.cmd run sync:assets
npm.cmd run audit:asset-variants
npm.cmd run build
```

Treat missing final PNG/audio assets as release blockers for presentation, not as crash blockers.
