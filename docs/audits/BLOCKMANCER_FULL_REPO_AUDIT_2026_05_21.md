# Blockmancer Dungeon - Full Repo Audit

## 1. Executive Summary

Overall repo status: install state appears usable, core validations pass, and `npm run build` succeeds outside the workspace sandbox. The repo is not release-ready yet. The current branch is technically buildable, but several Release 1 systems are only partially aligned with the Source of Truth, and newer route/reactive/content systems still rely on placeholder-safe or shallow behavior in important areas.

Highest release risks are not crash bugs so much as silent design drift and incomplete feature depth. The largest P0/P1 concerns are: hero runs receiving the full Release 1 spell set instead of hero-specific progression, stage goals being represented by generic objective counters instead of the SOT's stage-specific collectible/board goals, route support content and route assets being incomplete or unused, portrait-mobile overflow risk in non-battle scenes, and incomplete verification coverage because `test`/`lint` scripts are absent and no smoke evidence is checked into the repo.

Recommended next milestone: stabilize Release 1 route/story/reactive systems and close the top gameplay-alignment gaps before adding more content scope. Keep Cascade Gravity, preserve save-facing IDs, preserve fallback behavior, and focus on proving newer systems in runtime with smoke coverage.

## 2. Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `npm run validate:content` | Pass | `Content validation passed (335 JSON files, 36 route scenes).` |
| `npm run validate:metadata` | Pass | `Content metadata validation passed.` |
| `npm run validate:animations` | Pass with warnings | Validated `384` exact animation definitions. Warned about `1633` missing expected PNG frame files. Warned that `42` monster/boss entries are missing preferred `2x2` sheets, but fallbacks are allowed. |
| `npm run sync:assets` | Pass with warnings | Runtime asset keys `203`, unresolved assets `0`, files copied `0`, placeholders generated `0`, missing audio covered by fallback `12`. Report refreshed at `docs/ASSET_RUNTIME_MAPPING_REPORT.md`. |
| `npm run audit:asset-variants` | Pass with warnings | Optional variants missing: `79`. Heroes audited `8`, stages audited `6`, board blocks audited `21`. Report refreshed at `docs/ASSET_VARIANT_AUDIT.md`. |
| `npm run build` | Pass | Initial sandboxed build failed due to access restrictions resolving `vite.config.ts`; rerun outside sandbox passed. Final build transformed `422` modules and produced a Vite bundle successfully. |
| `npm run test` | Not available | `npm error Missing script: "test"`. |
| `npm run lint` | Not available | `npm error Missing script: "lint"`. |

## 3. Source of Truth Files Read

| File | Purpose | Notes |
| --- | --- | --- |
| `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md` | Reading order and authority rules | Used first as required. |
| `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md` | Core loop, board, combat, structure | Primary source for gameplay expectations. |
| `docs/02_BLOCKMANCER_STORY_ROUTES_DIALOGUE_SOURCE_OF_TRUTH.md` | Routes, dialogue, endings | Primary source for 36-scene route scope and dialogue expectations. |
| `docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md` | Hazards, counters, catalysts, fairness | Primary source for reactive difficulty audit. |
| `docs/04_BLOCKMANCER_ASSET_ANIMATION_SOURCE_OF_TRUTH.md` | Asset contracts, folder structure, exact-frame rules | Primary source for asset, animation, and fallback audit. |
| `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md` | Current implementation, release risks, proof rules | Used to separate documented intent from actual implemented evidence. |

## 4. Repo Structure Audited

| Folder/File | Audited | Notes |
| --- | --- | --- |
| `package.json` | Yes | Script surface, dependency/tooling status. |
| `tsconfig.json` | Yes | TypeScript strictness and included roots. |
| `vite.config.ts` | Yes | Build config, chunking, sandbox-related build failure context. |
| `capacitor.config.ts` | Yes | Android/web output config. |
| `src/game/` | Yes | Core runtime systems, scenes, content loaders, save/meta/runtime handlers. |
| `src/game/scenes/` | Yes | Battle, map, route dialogue, event, reward, shop, victory, hero select. |
| `src/game/systems/` | Yes | Board, combat, route, hazards, effects, content handlers, save, meta, hub, friendship. |
| `src/game/content/` | Yes | JSON content categories and route/story data. |
| `src/game/data/` | Yes | Runtime asset manifest, default run state, spell/runtime content mapping. |
| `src/game/types/` | Yes | Route/save/content type contracts and migration fields. |
| `public/assets/` | Yes | Folder structure, placeholders, missing route/story assets, audio state, duplicate legacy trees. |
| `scripts/` | Yes | Validation, asset sync, audit tooling, UI screenshot helper. |
| `docs/` | Yes | SOT, asset reports, supporting audits, duplicate/legacy documentation surface. |
| `android/` | Yes | Capacitor Android project present with app and Gradle files. |
| `dist/` | Yes | Existing build output present; final build regenerated successfully. |

## 5. Feature Implementation Matrix

| Area | Expected by SOT | Current Status | Evidence in Code | Gap | Priority | Recommended Action |
| --- | --- | --- | --- | --- | --- | --- |
| Cascade Gravity | Core identity mechanic | Implemented | `src/game/systems/BoardSystem.ts` clears then drops surviving cells by gravity, not row shift | Needs smoke verification only | P1 | Keep as-is and add regression coverage. |
| Board controls | Falling movement, lock, rotate, hold, next queue | Implemented | `BoardSystem` + `BattleScene` support movement, hold, preview | Needs smoke verification on touch/mobile | P1 | Add manual and automated input smoke. |
| Combat loop | Puzzle actions feed battle resolution | Implemented | `CombatSystem.ts`, `BattleScene.ts` | Balance and feature-depth still unverified | P1 | Add focused battle smoke/tests. |
| Enemy system | Normal enemy turns and scaling | Implemented | `EnemySystem`, `CombatSystem`, content-backed enemies | Mostly switch-based and needs encounter coverage | P2 | Add smoke coverage across stage archetypes. |
| Boss system | Stage bosses with mechanics and callbacks | Partially implemented | `BossSystem.ts`, `BattleScene.ts`, route callback hook | Mechanics are present but still shallow/generic vs SOT | P1 | Deepen/verify boss-specific mechanics. |
| Spell system | Hero-appropriate spell roster and runtime effects | Implemented but not aligned with SOT | `SpellSystem.ts`, `spells.ts`, `HeroSystem.ts` | Full Release 1 spell roster gets added to every run; 6 content spells have no runtime mapping | P0 | Fix hero spell loadout and add handler coverage/tests. |
| Item system | Items, counters, catalysts | Implemented | `ItemSystem.ts` has broad reactive effect coverage | Still switch-based; needs runtime verification | P1 | Smoke-test hazard counters and catalysts. |
| Relic system | Relic effects | Implemented | `RelicSystem.ts` supports 15 effect IDs matching 15 content entries | Switch-limited, no automated tests | P2 | Add regression tests for triggered relics. |
| Upgrade system | Upgrade effects | Implemented | `UpgradeSystem.ts` supports 15 IDs matching content count | Switch-limited, no test coverage | P2 | Add targeted tests. |
| Hero system | Hero identity, loadout, route ownership | Implemented but not aligned with SOT | `HeroSystem.ts`, hero content | All heroes receive the full Release 1 spell list during run setup | P0 | Restrict run spells to intended hero/content loadout. |
| Weapon system | Weapon identity and effect hooks | Partially implemented | `WeaponSystem.ts`, weapon content | Several content unlocks appear generic-only; e.g. `wpn_void_grimoire` special effect not evident | P2 | Audit each weapon unlock/effect path. |
| Map system | Six-stage run flow, route/event/boss integration | Implemented but not aligned with SOT | `MapScene.ts`, `MapSystem.ts` | Stage 6 structure does not show the documented Royal Guard pre-boss pattern | P1 | Align Stage 6 node structure with SOT. |
| Stage system | Six stages with themed hazards/goals | Partially implemented | stage content + systems | Stage goals are abstracted into generic counters rather than fully themed board goals | P1 | Replace generic goal progression with stage-specific handlers. |
| RouteStorySystem | 36 route scenes, three lanes, true flags, endings | Partially implemented | `RouteStorySystem.ts`, `route-scenes.*.json`, `route-endings.json` | Runtime exists, but some reward types are not hooked and route support content/assets are incomplete | P1 | Finish hook coverage and smoke route progression/endings. |
| Dialogue UI | Portrait-readable route/event dialogue | Partially implemented | `RouteDialogueScene.ts` | Uses fixed pixel Y positions and generic panels; route portraits/assets absent | P1 | Make responsive and prove portrait fit. |
| Route endings | Normal/True/Risky route endings | Partially implemented | `RouteStorySystem.resolveHeroEnding`, `VictoryScene.ts`, `MetaSystem.ts` | Endings unlock logic exists, but route art/assets are missing and no smoke evidence confirms unlock flow | P1 | Manually verify Stage 6 ending flows and persistence. |
| Event system | Event choices with rewards/risks/oopsies | Implemented | `EventSystem.ts`, `EventScene.ts` | Switch-limited and some legacy wording/IDs remain | P2 | Keep IDs, clean display wording where needed. |
| Shop system | Purchases, oopsie removal, rewards | Implemented | `ShopSystem.ts`, `ShopScene.ts` | Layout risk on portrait and no test coverage | P2 | Add responsive pass and smoke checks. |
| Oopsie system | Cheerful drawback system replacing darker wording | Implemented | `OopsieSystem.ts`, event/shop hooks | Legacy cursed IDs still remain in content for compatibility | P2 | Keep IDs, normalize presentation text. |
| Fever system | Fever gain/use in battle | Implemented | `CombatSystem.ts`, `BattleScene.ts`, effect systems | Needs balance/smoke verification | P2 | Add battle smoke coverage. |
| Save system | Save/load during run, route progress migration | Implemented | `SaveSystem.ts`, `defaultRunState.ts`, route version fields | Needs manual migration verification for route fields/endings | P1 | Add save/load smoke with route and ending states. |
| Asset system | Fallback-safe runtime asset lookup | Implemented | `AssetSystem.ts`, `assets.ts` | Many route/story/art assets still missing; duplicate legacy sprite tree present | P1 | Keep fallback safety, reduce release-facing placeholder surface. |
| Audio system | Audio files or safe fallbacks | Placeholder-safe but not release-ready | Asset sync report shows `12` missing audio covered by fallback | No actual audio files under `public/assets/audio` | P2 | Add final audio or accept fallback for non-blocking release slice. |
| Input/mobile controls | Portrait-mobile touch readability | Partially implemented | `BattleScene.ts` has responsive layout | Non-battle scenes still use fixed coordinates; touch target verification absent | P1 | Complete responsive pass for route/event/shop/reward/victory. |
| Tutorial system | New-player onboarding | Partially implemented | Tutorial/supporting scene references exist indirectly | No strong implementation proof found during audit | P2 | Confirm scope or backlog it explicitly. |
| Settings/accessibility | Mobile readability and usability | Partially implemented | Some responsive layout helpers exist | No comprehensive accessibility/settings proof surfaced | P2 | Audit settings/accessibility separately. |
| Reactive difficulty | Hazard/counterplay system | Partially implemented | `ReactiveDifficultySystem.ts`, `ItemSystem.ts`, `GameplayEffectSystem.ts` | Some hazards are real, but board-size/event integrations and fairness verification remain partial | P1 | Smoke-test every hazard/counter pairing. |
| Random gameplay events | Mid-battle systemic modifiers | Implemented but shallow | `RandomGameplayEventSystem.ts` + content | Content effects are supported structurally, but some deeper fields like event board-size data are ignored | P2 | Expand data-driven runtime handling. |
| Stage goals | Stage-specific objective arcs | Implemented but not aligned with SOT | `StageGoalSystem.ts`, stage goal content | Mostly generic `battle_objective` tracking; some boss effects text-only | P0 | Implement real stage-specific goal handlers. |
| Chaos rules | Optional chaos modifiers | Implemented but shallow | `ChaosRuleSystem.ts`, `GameplayEffectSystem.ts` | Structurally supported, but feature depth remains generic | P2 | Keep for now; add verification before expansion. |
| Battle objectives | Encounter-specific objective cards | Implemented | `BattleObjectiveSystem.ts` | Good coverage but still unverified in full stage flow | P2 | Add objective completion smoke. |
| Boss rule cards | Carded boss rules | Implemented but shallow | `BossRuleSystem.ts` content lookup, `BattleScene.ts` UI | Informational lookup only; rule card logic is not a separate gameplay engine | P2 | Clarify intended scope and smoke verify boss/card sync. |
| Board size modifier | Stage/encounter/phase board size changes | Partially implemented | `BoardSizeModifierSystem.ts`, `MapScene.ts` | `applyBossPhaseBoardSize()` is unused; content-defined board-size modifiers are not fully data-driven | P1 | Wire phase logic and consume content-driven modifiers. |
| Hub progression | Building unlocks and meta progression | Partially implemented | `HubProgressionSystem.ts`, hub content | Only a small subset of building unlocks have runtime effects | P2 | Either finish unlock handlers or de-scope from Release 1. |
| Friendship system | Monster friendships and rewards | Partially implemented | `FriendshipSystem.ts`, friendship content | Points track, but `unlockReward` and `helperId` are not applied in runtime | P2 | Implement unlock effects/helpers or backlog them. |

## 6. GDD / SOT Compliance

| Requirement | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Cascade Gravity identity | Implemented | `BoardSystem.ts` gravity-based clear/drop flow | Preserved correctly. |
| Cheerful festival tone | Partially implemented | Display text uses cheerful tone in many places; legacy IDs like `evt_cursed_fountain`, `spl_void_cut`, `rel_void_eye`, `wpn_void_grimoire` remain | Save-facing IDs should stay; presentation wording still needs cleanup in some content/themes. |
| Portrait mobile layout | Partially implemented | `BattleScene.ts` uses responsive layout; `RouteDialogueScene.ts`, `RewardScene.ts`, `EventScene.ts`, `ShopScene.ts`, `VictoryScene.ts` use hard-coded positions | Main battle is stronger than adjacent scenes. |
| Six-stage structure | Implemented | Stage content and map generation cover six stages | Stage 6 structure is not fully aligned with the documented Royal Guard lead-in. |
| Six-hero route scope | Implemented | 36 scenes across 6 heroes x 6 stages validated by content command | There are 8 heroes in content, so route scope and extra hero support need clearer release boundaries. |
| Route choices | Implemented | 108 route choices present and validated | Runtime exists; needs smoke verification. |
| Save requirements | Implemented | `SaveSystem.ts`, `defaultRunState.ts`, route migration fields and meta ending arrays | Needs manual migration verification. |
| Data-driven content | Partially implemented | Content registry and JSON-first content model are present | Many systems still rely on hardcoded switch handlers. |
| Fallback safety | Implemented | `RouteStorySystem` fallback scene, `AssetSystem` missing asset fallbacks, asset sync unresolved `0` | Strong crash safety, weaker release presentation. |
| Exact-frame PNG animation contract | Partially implemented | Validator recognizes exact-frame definitions; naming contract exists in data/scripts | `1633` expected frame PNG files are still missing. |
| Asset folder structure | Partially implemented | Asset reports and manifest exist | Route/story folders are missing; duplicate `public/assets/sprites/sprites` tree suggests legacy drift. |
| Reactive difficulty fairness | Partially implemented | Hazards, warnings, counters, and modifiers exist in code/content | Needs manual smoke to prove fairness and no soft-lock cases. |
| Boss rule cards | Partially implemented | UI/content lookup exists | Behavior is mostly informational. |
| Stage goals | Implemented but not aligned with SOT | Stage goal content exists and runtime tracks goals | Goals are abstracted into generic objective counters instead of the documented themed goals. |
| Content ID stability | Implemented | Legacy IDs retained across content/runtime | Correctly preserved for save compatibility. |

## 7. Core Gameplay Audit

Board state, falling movement, hold, next queue, line clear, and Cascade Gravity are implemented in runtime and appear to be the strongest part of the repo. `BoardSystem.ts` handles movement, hold, queue generation, line detection, gravity-based collapse, floating block hazard state, and special block interactions. `CombatSystem.ts` converts clears and cascades into damage, mana, shield, fever, and effect triggers. Enemy and boss turns are wired through battle state and scene flow.

The main alignment gap is not that the core loop is absent; it is that newer systems around the loop are bending progression rules. `HeroSystem.ts` currently appends the entire Release 1 spell set into each run, which cuts across hero identity, unlock pacing, and spell balance. `BattleScene.ts` also slices displayed spells down to four buttons, which can hide the fact that the run state contains a broader spell pool than intended.

Save/load during run is implemented. `defaultRunState.ts`, `SaveSystem.ts`, and route version fields normalize and migrate route progress, pending rewards, board modifiers, and active oopsies. That said, route-ending persistence and route-progress migration need manual verification because there is no automated save suite and no checked-in smoke evidence.

Known gaps:

- Stage goals are mostly generic objective counters instead of stage-specific board interactions.
- Boss phase board-size logic exists but is not wired in.
- Boss rule cards are present mainly as informational UI/content, not as a distinct gameplay engine.
- Core systems lack `test` and `lint` script coverage.

## 8. Story Route Audit

Route content coverage is structurally strong: `validate:content` confirmed `36` route scenes, node inspection confirmed `108` route choices and `36` true flags, and `route-endings.json` contains `18` endings. `RouteStorySystem.ts` validates unique trigger IDs, three choices per scene, true-flag grants, and fallback scene behavior when content is missing.

The main problems are implementation depth and presentation readiness. Reward/risk application exists, but some route reward types still fall through to a "no hooked effect yet" message. `route-barks.json` and `route-voice-tags.json` exist in content/docs but have no runtime references. `RouteDialogueScene.ts` currently renders generic panel/text/button UI with fixed coordinates, and the route portrait/background/end-card asset folders expected by the asset manifest are missing under `public/assets/`.

| Route Area | Status | Evidence | Risk | Recommended Action |
| --- | --- | --- | --- | --- |
| Route scene count | Implemented | `36` scenes validated; six `route-scenes.*.json` files loaded by `RouteStorySystem.ts` | Low | Keep validated. |
| Route choice count | Implemented | `108` choices across route content | Low | Keep validated. |
| True flag count | Implemented | `36` true flags present in route content | Medium | Smoke true-ending thresholds. |
| Trigger behavior | Implemented | `MapScene.ts` triggers route scenes through `startRouteSceneIfNeeded(...)` | Medium | Smoke each hero/stage trigger path. |
| Reward/risk behavior | Partially implemented | `RouteStorySystem.ts` applies several reward types | Some reward types can log "no hooked effect yet" | Finish hook coverage and route-specific smoke. |
| Boss callback behavior | Partially implemented | `getBossCallback()` and `applyBossCallbackModifier()` exist | Effects are lane-generic and modest compared with SOT flavor | Decide final Release 1 callback scope and verify. |
| Ending behavior | Partially implemented | `resolveHeroEnding()`, `MetaSystem` route ending unlock arrays, `VictoryScene.ts` | Needs full Stage 6 smoke; ending art is missing | Verify unlocks and asset fallback behavior. |
| Save/load behavior | Implemented but unverified | `SaveSystem.ts`, `defaultRunState.ts`, route version normalization | Migration could regress silently without tests | Add route save/load smoke checklist. |
| Missing tests/smoke | Missing | No `test` script; no route smoke harness in scripts | High | Add manual smoke checklist and minimal automated save/route tests. |

## 9. Reactive Difficulty Audit

| Hazard / Counter System | Expected Behavior | Current Evidence | Status | Gap | Priority |
| --- | --- | --- | --- | --- | --- |
| Incoming junk queue | Queue/fair warning/counterplay | Reactive difficulty content + item handlers like `block_incoming_junk`, `delay_incoming_junk`, `reflect_incoming_junk` | Partially implemented | Needs full battle smoke and visibility verification | P1 |
| Floating blocks | Timed/persistent hazard with counters | `BoardSystem.ts` spawn/pin/pop/expire helpers | Implemented but needs smoke verification | Hazard fairness and persistence not proven in play | P1 |
| Freeze warning | Warning and freeze mitigation | Content + item handler `counter_freeze` + enemy/hazard hooks | Partially implemented | Manual verification needed for visibility/fairness | P1 |
| Preview hidden | Preview disruption with reveal tools | `BattleScene.ts` hides preview; item effects can reveal preview | Implemented but shallow | Needs smoke verification on timing clarity | P1 |
| Bad piece delivery | Distorted piece pool with counters | Oopsie/piece pool hooks and item `delete_bad_piece`/queue reorder tools | Partially implemented | Data-driven coverage is not obvious across all hazard sources | P2 |
| Speed wave | Increased fall speed with warnings/brakes | `GameplayEffectSystem.ts` supports `speed_spike`/`increase_fall_speed`; item `speed_brake` exists | Implemented but shallow | Needs fairness verification on mobile | P1 |
| Low ceiling | Reduced effective board size | `BoardSizeModifierSystem.ts` encounter/stage modifiers | Partially implemented | Phase wiring absent; event content modifiers not fully consumed | P1 |
| Royal pattern | Stage 6 royal hazard patterns | Royal blocks and warning references exist | Partially implemented | Stage 6 structure and some fail effects remain shallow/text-only | P1 |
| Counter items | Hazard counters must actually resolve hazards | `ItemSystem.ts` covers many counters explicitly | Implemented | Needs matrix smoke against each hazard | P1 |
| Spell catalysts | Items/spells modifying hazard response | `ItemSystem.ts` includes `spell_catalyst`; spell runtime exists | Partially implemented | Coverage depth unclear and untested | P2 |
| Route-triggered hazard/reward modifiers | Route choices should influence later risk/reward | `RouteStorySystem.ts` supports `battle_modifier`, `stage_modifier`, `boss_modifier`, `hazard_modifier` | Partially implemented | Some modifier types may still be shallow or unhooked | P1 |

## 10. Asset / Animation / Audio Audit

Unresolved runtime assets are currently `0`, which is good for crash safety. That does not mean the presentation layer is finished. The animation validator reported `1633` missing expected frame PNG files. Asset variant auditing reported `79` missing optional variants. Asset sync reported `12` missing audio files covered by fallback. Route/story asset folders expected by the manifest are not present under `public/assets/`.

| Asset Area | Expected | Current Evidence | Status | Gap | Priority |
| --- | --- | --- | --- | --- | --- |
| Runtime asset keys | All runtime references resolved | `sync:assets` reported unresolved assets `0` | Implemented | None for crash safety | P2 |
| Exact-frame PNG naming | `asset_id__animation_name__f00.png` contract | Validator and asset manifest are built around exact-frame naming | Partially implemented | Actual frame files are largely missing | P1 |
| Missing animation frames | Expected frame files present | `validate:animations` reported `1633` missing expected PNGs | Placeholder-safe but not release-ready | Large release-presentation gap | P1 |
| Monster/boss 2x2 sheets | Preferred `1254x1254` sheets | Validator warned `42` entries missing preferred sheets, fallback allowed | Partially implemented | Presentation quality gap | P2 |
| Board block 24x24 contract | Exact board tile contract | Asset SOT + board asset structure support it | Implemented | Needs spot verification only | P2 |
| Board icon 48x48 contract | Icon contract | Asset manifest/display rules support icon usage | Implemented | Needs asset art completion | P2 |
| Non-board 627x627 contract | Portrait/UI/background contract | Asset SOT defines it; route/story folders absent | Placeholder-safe but incomplete | Missing source art in story-route areas | P1 |
| Route/story assets | Portraits, route backgrounds, ending cards, dialogue panel art | Asset manifest expects them; folders like `public/assets/ui/story-routes`, `public/assets/portraits/heroes`, `public/assets/story/endings` are missing | Placeholder-safe but not release-ready | Missing visible route presentation layer | P1 |
| Audio | Final audio files or safe fallback | `public/assets/audio` has folders but no actual audio files; sync report says `12` missing audio covered by fallback | Placeholder-safe but not release-ready | Final audio absent | P2 |
| Legacy fallback paths | Old paths should not crash | Asset system has fallback groups and placeholder IDs | Implemented | Duplicate `public/assets/sprites/sprites` tree suggests cleanup debt | P3 |

## 11. Content Runtime Handler Audit

| Content Area | Content Exists | Runtime Handler Evidence | Gap / Unsupported IDs | Priority | Recommended Action |
| --- | --- | --- | --- | --- | --- |
| Spells | `22` JSON entries | `SpellSystem.ts`, `spells.ts` explicit runtime mapping | Content exists but runtime handler/mapping missing for `spl_burn_line`, `spl_gravity_flip`, `spl_heal_glyph`, `spl_ice_wall`, `spl_lightning_chain`, `spl_mana_burst` | P0 | Either implement handlers/mapping or de-scope these IDs from active pools. |
| Items | `36` JSON entries | `ItemSystem.ts` covers a broad set of effect types | No hard evidence of unsupported active item IDs found, but system is switch-based and needs smoke verification | P1 | Build a hazard-counter smoke matrix. |
| Relics | `15` JSON entries | `RelicSystem.ts` supports `15` effect IDs | Coverage count matches content, but behavior is finite and switch-limited | P2 | Add regression tests around trigger conditions. |
| Upgrades | `15` JSON entries | `UpgradeSystem.ts` supports `15` effect IDs | Coverage count matches content, but behavior is switch-limited | P2 | Add regression tests. |
| Oopsies | `8` JSON entries | `OopsieSystem.ts`, battle/event/shop hooks | Appears implemented, but still needs behavior smoke on preview/fall-speed/piece-pool side effects | P2 | Add focused oopsie smoke checklist. |
| Route rewards | Route scene JSON | `RouteStorySystem.ts` applies several reward types | Some reward types can report `no hooked effect yet` | P1 | Enumerate and close missing reward hooks. |
| Route risks | Route scene JSON | Route risk application exists through system hooks | Fairness and complete handler coverage not proven | P1 | Smoke risky route outcomes and soft-lock safety. |
| Random gameplay events | `20` JSON entries | `RandomGameplayEventSystem.ts` + `GameplayEffectSystem.ts` | `machine-hiccup` includes `boardSizeModifiers` data that runtime does not actually consume | P2 | Either consume content field or remove misleading data. |
| Stage goals | `6` JSON entries | `StageGoalSystem.ts` and `BattleScene.ts` progress hooks | Goals are mostly generic `battle_objective`; some boss effects like `fewer_sticky_blocks`, `extra_sticky`, `extra_royal_blocks` are text-only or shallow | P0 | Implement real goal semantics and real boss consequences. |
| Chaos rules | `8` JSON entries | `ChaosRuleSystem.ts` + `GameplayEffectSystem.ts` | Supported structurally, but shallow/generic | P2 | Keep limited scope and verify. |
| Battle objectives | `10` JSON entries | `BattleObjectiveSystem.ts` explicit handlers | Good coverage found | P2 | Add tests rather than expand feature count. |
| Boss rules | `6` JSON entries | `BossRuleSystem.ts` lookup and `BattleScene.ts` presentation | Informational only; no separate gameplay rule interpreter | P2 | Clarify intended scope. |
| Hero passives | Hero content | `HeroSystem.ts` applies hero setup | Current spell-loadout behavior undermines hero identity | P0 | Fix spell-loadout logic first. |
| Weapons | `10` JSON entries | `WeaponSystem.ts` special hooks | Some content unlock/effect implications appear generic-only, including `wpn_void_grimoire` | P2 | Audit per-weapon effect parity. |
| Hub buildings | `8` JSON entries | `HubProgressionSystem.ts` | Most building unlocks exist in content but lack runtime effect application | P2 | Finish minimal unlock set or backlog. |
| Friendship | `8` JSON entries | `FriendshipSystem.ts` tracks points and summary | `unlockReward`/`helperId` content exists but runtime unlock application is missing | P2 | Implement or backlog friendship rewards/helpers. |

## 12. Mobile Portrait UI Audit

| UI Area | Expected Layout | Current Evidence | Risk | Recommended Action |
| --- | --- | --- | --- | --- |
| Combat panel | Top 25% readable with no overlap | `BattleScene.ts` has responsive layout calculations and validation | Medium | Keep and manually smoke across small phones. |
| Event log | Top section, readable and non-overlapping | `BattleScene.ts` dynamically compacts labels/log text | Medium | Smoke long-text cases. |
| Hero/enemy stats | Visible beside combat layer | `BattleScene.ts` has compact/tiny layout branches | Medium | Verify edge cases with oopsies/relic counts. |
| Board | Middle 55% primary focus | `BattleScene.ts` scales around viewport | Low | Keep. |
| Hold panel | Bottom/gameplay support zone | Present in battle UI | Medium | Touch-size smoke on portrait mobile. |
| Next queue | Visible and not occluding board | Present in battle UI | Medium | Verify preview-hidden states and warning overlays. |
| Right rail stats | No overlap with board | Present in battle UI layout logic | Medium | Verify smallest portrait widths. |
| Inventory button | Bottom control zone | Present in battle UI | Medium | Smoke touch target size. |
| Control rows | Bottom 20% | Battle layout supports control compaction | Medium | Verify on sub-700px tall viewports. |
| Spell/action buttons | Bottom 20%, readable | `BattleScene.ts` limits to four visible spell buttons | Medium | Verify text length and tap spacing. |
| Route dialogue UI | Portrait-readable narrative layout | `RouteDialogueScene.ts` uses fixed Y positions around `760`, `832`, etc. | High | Rework to responsive layout before release. |
| Reward UI | No overlap and readable choices | `RewardScene.ts` uses fixed coordinates | High | Rework to responsive layout. |
| Boss rule card UI | Readable on portrait | Present in battle scene | Medium | Needs smoke verification with long copy. |

## 13. New / Recently Added Features Not Yet Properly Implemented

| Feature | Why It Looks New / Recently Added | Current Evidence | Implementation Quality | What Is Missing | Release Risk | Priority | Recommended Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RouteStorySystem | New subsystem, route-specific versioning, fallback scene, JSON packs | `RouteStorySystem.ts`, route content packs | Implemented but needs manual smoke verification | Full reward/risk hook parity, route support content usage, end-to-end proof | High | P1 | Freeze feature scope and smoke all route flows. |
| RouteDialogueScene | Dedicated route scene/UI | `RouteDialogueScene.ts` | Placeholder-safe but not release-ready | Responsive portrait layout, final art usage | High | P1 | Make layout responsive and smoke on phone viewport. |
| Route scene JSON | 36-scene content pack added after core loop | `route-scenes.*.json`, content validator count | Runtime exists but content coverage is incomplete at presentation layer | Full asset support and route bark/voice runtime usage | Medium | P1 | Keep content, finish runtime integration. |
| Route endings | New content/state/meta layer | `route-endings.json`, `MetaSystem.ts`, `VictoryScene.ts` | Implemented but needs manual smoke verification | Full unlock proof, ending card assets | High | P1 | Smoke all ending unlock paths. |
| Route rewards | New route-specific reward configs | `RouteStorySystem.ts` reward application | Partially implemented | Some reward types still unhooked | High | P1 | Enumerate and implement missing reward types. |
| Route risks | New route-specific risk configs | Route risk hooks in system/content | Partially implemented | Full fairness/no-soft-lock proof | High | P1 | Smoke risky lanes and add fallback assertions. |
| Boss callbacks | Route-to-boss connective system | `getBossCallback()`, `applyBossCallbackModifier()` | No-op or shallow switch-based behavior | Richer per-route boss consequences, stronger verification | Medium | P2 | Keep minimal Release 1 scope unless stronger design is required. |
| Route story asset manifest | Asset keys added for route portraits, backgrounds, endings | `src/game/data/assets.ts`, `AssetSystem.ts` | Runtime exists but content coverage is incomplete | Actual folders/files under `public/assets/` | High | P1 | Fill minimal Release 1 route art set or accept placeholder UI explicitly. |
| Exact-frame PNG animation support | New animation pipeline | Validator/tooling and manifest support | Implemented but needs manual smoke verification | Actual frame production coverage | High | P1 | Finish critical animation sets first. |
| Animation validator | New tooling for frame contracts | `validate:animations` script output | Fully implemented and verified | N/A | Low | P2 | Keep using it as release gate. |
| Asset variant audit/sync tooling | New asset pipeline tools | `sync:assets`, `audit:asset-variants`, refreshed docs | Fully implemented and verified | Better checklist parsing, typo cleanup like `ico_block_tolbox.png` in report surface | Low | P2 | Keep and tighten report quality. |
| Reactive difficulty systems | Expanded post-core loop hazard layer | Reactive difficulty content and systems | Implemented but needs manual smoke verification | Full fairness, no-soft-lock proof, content-driven completeness | High | P1 | Add hazard/counter smoke matrix before expansion. |
| Incoming junk | Hazard-specific runtime/counter layer | Content plus item/system hooks | Implemented but needs manual smoke verification | Warning timing and route/event interactions | High | P1 | Smoke in battle across stages. |
| Floating blocks | Expanded hazard runtime | `BoardSystem.ts` floating block APIs | Implemented but needs manual smoke verification | Battle proof and edge-case coverage | High | P1 | Add smoke/test coverage. |
| Hazard warning UI | Warning windows/trays | Warning hooks exist in battle systems/UI | Partially implemented | Consistent visibility/fairness proof on mobile | High | P1 | Verify every warning type on portrait viewport. |
| Spell catalysts | New reactive item/spell interaction layer | Item effect type exists | Partially implemented | Full gameplay verification and content breadth | Medium | P2 | Keep limited until verified. |
| Board size modifier | Expanded board-shape system | `BoardSizeModifierSystem.ts` | Partially implemented | Boss phase hook unused; content-defined modifiers not fully consumed | High | P1 | Wire phase logic and data-driven modifier consumption. |
| Battle objectives | New encounter objective layer | `BattleObjectiveSystem.ts` | Implemented but needs manual smoke verification | Full flow verification with rewards/goals | Medium | P2 | Add tests before adding more objective types. |
| Random gameplay events | New encounter modifier layer | `RandomGameplayEventSystem.ts` | Implemented but needs manual smoke verification | Full data-driven field coverage | Medium | P2 | Keep stable, avoid expanding until tested. |
| Chaos rules | New optional modifier pack | `ChaosRuleSystem.ts` | Implemented but needs manual smoke verification | Deeper content coverage not yet proven | Medium | P2 | Hold scope steady. |
| Stage goals | New stage arc system replacing simple stage progress | `StageGoalSystem.ts`, stage goal content | Conflicts with current SOT | Real stage-specific logic, non-text-only boss effects | High | P0 | Rework to match SOT before release. |
| Hub progression | Meta layer beyond base run loop | `HubProgressionSystem.ts`, hub content | Partially implemented | Most unlocks have no runtime effect | Medium | P2 | De-scope or finish only minimum unlocks. |
| Friendship | New meta/content layer | `FriendshipSystem.ts`, friendship content | Content exists but runtime handler is missing | `unlockReward` and `helperId` application | Medium | P2 | Backlog unless required for Release 1. |
| Extra heroes beyond Release 1 route scope | Content count exceeds route scope | `8` heroes in content; route SOT is 6-hero route scope | Conflicts with current SOT | Clear release scope, route/story support parity | Medium | P2 | Mark extras as backlog or clearly out-of-scope. |
| Debug scene / smoke tooling | Auxiliary validation/scripts added later | `scripts/check-ui-screenshots.mjs`, validation scripts | Implemented but needs manual smoke verification | No npm wrapper and no checked-in smoke results | Medium | P2 | Add a stable smoke command without generating broad artifact churn. |

### New Feature Stabilization Recommendation

Finish now for Release 1:

- Fix hero spell-loadout logic.
- Rework stage goals to match SOT semantics and remove text-only boss effects.
- Stabilize route scene flow, route rewards/risks, route ending unlocks, and portrait route UI.
- Wire board-size modifier phase/content behavior that is already scaffolded.

Keep fallback-safe but not release-blocking:

- Missing route portraits/backgrounds/ending cards if placeholder UI is explicitly accepted for the release slice.
- Missing optional animation variants, missing preferred boss sheets, and missing audio if fallback remains stable.

Move to P2/P3 backlog:

- Friendship helper rewards.
- Most hub building unlocks beyond the minimum release unlock set.
- Extra heroes beyond the six-hero route scope unless release scope is expanded intentionally.

Needs manual smoke verification:

- All route triggers, Practical/True/Risky choices, Stage 6 ending unlocks, boss callbacks, every major hazard/counter pair, and portrait viewport dialogue/reward/shop flows.

Needs automated tests:

- Hero loadout/spell roster setup.
- Route progress save/load migration.
- Stage goal progression and boss consequence application.
- Board-size modifier application at stage/encounter/phase boundaries.

## 14. Broken / Risky Areas

### P0 - Release Blockers / Silent Regression Risks

Finding: Hero runs receive the full Release 1 spell pool.
Evidence: `src/game/systems/HeroSystem.ts` appends `RELEASE_1_SPELL_CONTENT_IDS` to `state.spells`.
Impact: Silently breaks hero identity, progression, balancing, and spell unlock expectations.
Recommended action: Restrict run spell population to intended hero/content loadout and add regression coverage.

Finding: Stage goals do not match the Source of Truth's stage-specific design.
Evidence: `src/game/content/stage-goals/*.json`, `StageGoalSystem.ts`, and `BattleScene.ts` mostly drive progress via generic `battle_objective`; some boss effects like `fewer_sticky_blocks`, `extra_sticky`, and `extra_royal_blocks` are text-only or shallow.
Impact: Core stage identity can silently drift while still "working."
Recommended action: Implement explicit stage-goal handlers and real boss consequence effects before release.

### P1 - Release 1 Core Risks

Finding: Route runtime exists, but route presentation/content integration is incomplete.
Evidence: `RouteStorySystem.ts` is present, but `route-barks.json` and `route-voice-tags.json` have no runtime references, and route asset folders expected by `src/game/data/assets.ts` are missing from `public/assets/`.
Impact: Route content can feel unfinished even if it does not crash.
Recommended action: Finish the minimal Release 1 route integration set and smoke all 36 route triggers.

Finding: Portrait-mobile risk remains high outside the battle scene.
Evidence: `RouteDialogueScene.ts`, `RewardScene.ts`, `EventScene.ts`, `ShopScene.ts`, and `VictoryScene.ts` use fixed coordinates rather than validated responsive layout.
Impact: Release-target mobile readability can fail in route/event/reward flows.
Recommended action: Move these scenes onto the same responsive discipline already used in `BattleScene.ts`.

Finding: Board-size modifier system is scaffolded but not fully wired.
Evidence: `BoardSizeModifierSystem.ts` exposes `applyBossPhaseBoardSize()`, but no call site was found; content-defined board-size modifier data is not fully consumed.
Impact: Low-ceiling/phase/reactive board-size behaviors can silently underperform relative to design.
Recommended action: Wire phase application and consume content-defined modifiers where declared.

Finding: Validation/build coverage is stronger than runtime verification coverage.
Evidence: No `test` or `lint` scripts in `package.json`; no checked-in smoke results proving route/endings/hazards.
Impact: Silent regressions are likely in newer systems.
Recommended action: Add a narrow smoke/test pass focused on release-critical flows.

### P2 - Polish / Important Follow-up

Finding: Asset and audio fallback safety is ahead of final production completeness.
Evidence: `1633` missing animation frames, `79` optional variant gaps, `12` missing audio files, and route/story art folders missing.
Impact: Presentation quality is below release target, but fallback behavior appears safe.
Recommended action: Prioritize visible Release 1 assets first, then optional variants.

Finding: Hub progression and friendship are scaffolded more than fully shipped.
Evidence: `HubProgressionSystem.ts` implements only a small subset of building effects; `FriendshipSystem.ts` tracks points but does not apply `unlockReward`/`helperId`.
Impact: Content can imply depth that runtime does not fully deliver.
Recommended action: De-scope or clearly gate these systems unless finishing them soon.

### P3 - Backlog / Future

Finding: Duplicate legacy sprite tree exists.
Evidence: `public/assets/sprites/sprites/...`.
Impact: Confusing asset maintenance, but not a direct release blocker.
Recommended action: Clean up only after release-facing asset paths are stabilized.

Finding: Supporting docs surface is broad and partially duplicative.
Evidence: Multiple legacy asset and audit docs under `docs/`.
Impact: Audit complexity and drift risk increase.
Recommended action: Keep SOT-first discipline and archive stale supporting docs later.

## 15. Added Later / Extra Features

| Feature | Evidence | Keep / De-scope / Backlog | Reason |
| --- | --- | --- | --- |
| Friendship system | `src/game/content/friendship/`, `FriendshipSystem.ts` | Backlog | Runtime unlock rewards/helpers are not implemented. |
| Hub progression buildings | `src/game/content/hub-buildings/`, `HubProgressionSystem.ts` | Backlog | Most unlocks have no runtime effect yet. |
| Extra heroes beyond six-hero route scope | `8` hero content entries vs six-hero route SOT | De-scope or clarify | Route/story scope and hero scope are not cleanly aligned. |
| Debug/UI screenshot tooling | `scripts/check-ui-screenshots.mjs` | Keep | Useful, but not yet part of a stable release gate. |
| Optional asset variants pipeline | `audit:asset-variants`, asset report docs | Keep | Good tooling, but optional variant count is still far from complete. |

## 16. Not Implemented / Missing

| Missing Feature | Expected by SOT | Current Evidence | Priority | Recommended Action |
| --- | --- | --- | --- | --- |
| Final route portrait/background/ending art set | Story-route presentation support | Manifest expects folders/files; route/story asset folders are absent | P1 | Add minimal Release 1 asset set or accept placeholder UI explicitly. |
| Runtime use of `route-barks.json` and `route-voice-tags.json` | Dialogue flavor/supporting route content | Content exists; no runtime references found | P1 | Hook them into route dialogue flow or remove them from active release claims. |
| Real stage-specific stage-goal logic | Cupcakes/machines/crates/etc. as actual gameplay goals | Goal content exists but runtime mostly uses generic battle objectives | P0 | Implement explicit goal handlers. |
| Boss phase board-size application | Phase-based board resizing | Method exists; no call site found | P1 | Wire it into boss battle flow. |
| Final audio files | Audio contract or final fallback decision | Audio folders present, actual audio absent | P2 | Add final audio or document fallback-only release scope. |
| Test script | Release-critical automation | `npm run test` missing | P1 | Add a narrow regression suite. |
| Lint script | Static quality gate | `npm run lint` missing | P2 | Add lint only if it will be enforced and maintained. |

## 17. Manual Smoke Checklist Needed

- Desktop browser smoke: launch a fresh run, enter Stage 1 battle, clear lines, confirm Cascade Gravity, damage, enemy turn, reward flow.
- Portrait mobile viewport smoke: verify battle, route, event, reward, shop, and victory scenes fit without overlap on a small phone viewport.
- New run: verify hero selection, save creation, and no broken loadout state.
- Hero select: confirm only intended heroes are selectable for the release slice.
- Stage 1 map: verify node flow, event, battle, shop, treasure, and boss paths.
- Route event trigger: for each hero/stage route trigger, confirm the correct route scene appears.
- Combat fallback trigger: confirm missing route assets use safe placeholder behavior without runtime crash.
- Practical/True/Risky route choices: verify each lane applies the expected reward/risk and records the expected route state.
- Route save/load: save during route progress, reload, and confirm `routeProgress`, chosen scenes, true flags, and pending route outcomes persist.
- Boss callback: verify boss callback dialogue and modifier apply for practical/true/risky route outcomes.
- Boss rule card: verify card display timing and text readability in portrait layout.
- Stage 6 ending: complete a run and verify route ending resolution path.
- Route ending unlock: confirm normal, true, and variant ending unlocks are persisted in meta state.
- Reactive hazard counter test: verify incoming junk, floating blocks, freeze, preview hide, speed wave, low ceiling, and royal hazards each have visible warnings and working counters.
- Item/spell test: verify hazard counters, catalysts, and hero spell availability behave as intended.
- Asset fallback test: temporarily exercise a route/story asset lookup path and confirm placeholder/fallback rendering instead of crash.
- Audio fallback test: verify missing audio cases stay silent or fallback cleanly without blocking play.

## 18. Recommended Next Prompt

Copy-paste prompt for the next implementation pass:

```text
Audit and fix only the top Release 1 stability issues in Blockmancer Dungeon.

Scope:
- Fix hero run spell population so each hero only receives the intended starting spell loadout.
- Rework stage goal runtime handling so Stage 1-6 goals match the Source of Truth instead of generic battle-objective placeholders.
- Implement the currently text-only/stub boss consequences tied to stage goals where the content already expects real effects.
- Wire and verify board-size modifier behavior that is already scaffolded, including any missing boss-phase application points.
- Add narrow automated coverage for:
  - hero loadout spell population
  - route progress save/load normalization
  - stage goal progression and boss consequence application
  - board-size modifier application
- If needed, add a minimal smoke harness, but do not add broad new systems.

Constraints:
- Preserve Cascade Gravity.
- Preserve existing save-facing IDs.
- Preserve fallback behavior for missing assets/content.
- Do not rename IDs.
- Do not rewrite unrelated gameplay systems.
- Do not add new feature scope beyond the fixes above.

Before editing:
- Read `docs/00_BLOCKMANCER_SOURCE_OF_TRUTH_INDEX.md`
- Read `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md`
- Read `docs/03_BLOCKMANCER_GAMEPLAY_REACTIVE_DIFFICULTY_SOURCE_OF_TRUTH.md`
- Read `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md`
- Reuse the findings in `docs/audits/BLOCKMANCER_FULL_REPO_AUDIT_2026_05_21.md`

Deliver:
- code changes only for the scoped fixes
- concise summary of what changed
- commands run and results
- remaining risks if any
```
