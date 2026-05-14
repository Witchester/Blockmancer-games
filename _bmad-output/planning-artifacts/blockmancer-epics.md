# Blockmancer Dungeon Epics and Stories

This BMad-compatible epic inventory is derived from the existing project docs, especially `docs/PHASE_PLAN.md`, `docs/ROADMAP.md`, `docs/10_PRODUCTION_ROADMAP.md`, `docs/12_RELEASE_CHECKLIST.md`, and `docs/17_DEFINITION_OF_DONE.md`.

## Epic 1: MVP Stabilization

Goal: keep the current playable loop stable, readable, and safe to extend.

### Story 1.1: Stabilize Core Run Loop

Ensure new run, continue, map progression, battle, reward, game over, and victory remain reachable without crashes.

Acceptance criteria:
- One full run can be completed or fail cleanly.
- Core loop actions produce visible UI and event-log feedback where relevant.
- `npm run build` passes.

### Story 1.2: Add Save Migration Safety

Harden save/load behavior as run-state fields expand.

Acceptance criteria:
- New run-state fields have defaults in normalization.
- Old saves do not crash continue flow.
- Terminal states clear or preserve save data intentionally.

### Story 1.3: Improve Tutorial And Settings Flow

Make onboarding and player settings clear enough for repeated manual testing.

Acceptance criteria:
- Tutorial prompts explain core board/combat/spell actions.
- Settings are reachable and persist where applicable.
- Normal gameplay has no console errors from settings/tutorial paths.

### Story 1.4: Integrate Validation Into Manual Workflow

Make content and metadata validation part of the expected development loop.

Acceptance criteria:
- `npm run validate:metadata` passes.
- `npm run validate:content` passes.
- Documentation points agents to both commands after content changes.

## Epic 2: Content Alpha

Goal: expand content breadth while keeping the runtime content-driven.

### Story 2.1: Audit Content Registry Coverage

Verify all runtime systems can access the content categories they need through `ContentRegistry` or documented bridging code.

Acceptance criteria:
- Missing category accessors are identified or added.
- Fallback IDs resolve to enabled content.
- Content-driven systems avoid duplicate hardcoded definitions.

### Story 2.2: Reach Target Hero And Weapon Breadth

Expand and validate hero and weapon entries for content alpha.

Acceptance criteria:
- At least 3 playable heroes exist and validate.
- At least 10 weapons exist and validate.
- Hero and weapon IDs are connected to unlock/loadout paths.

### Story 2.3: Reach Target Enemy And Boss Breadth

Expand monster and boss content for replayable runs.

Acceptance criteria:
- At least 18 monsters exist and validate.
- At least 3 bosses exist and validate.
- Enemy selection covers fight, elite, and boss room types.

### Story 2.4: Reach Target Reward And Event Breadth

Expand spells, relics, upgrades, events, curses, and board blocks.

Acceptance criteria:
- Content targets in `docs/10_PRODUCTION_ROADMAP.md` are met or explicitly deferred.
- Loot tables reference reachable enabled entries.
- At least 5 runs feel meaningfully different in manual testing.

## Epic 3: UX Audio Visual Alpha

Goal: replace placeholder feel with a coherent, readable game presentation.

### Story 3.1: Apply UI Skin Pass

Improve core UI readability and identity without changing gameplay rules.

Acceptance criteria:
- Main menu, map, battle, reward, and room scenes share a coherent UI style.
- Text remains legible on desktop and mobile.
- Screenshots no longer look purely placeholder.

### Story 3.2: Add Gameplay Feedback Pass

Improve feedback for line clears, damage, spells, rewards, and enemy actions.

Acceptance criteria:
- Core combat actions have visual feedback.
- Important outcomes have event-log feedback.
- Feedback does not obscure the board or critical controls.

### Story 3.3: Add Audio Foundation

Connect placeholder audio feedback through `AudioSystem`.

Acceptance criteria:
- Core actions have basic SFX hooks.
- Audio can be muted or controlled through settings.
- No autoplay or mobile audio errors block gameplay.

### Story 3.4: Prepare Pixel Art Asset Path

Prepare the 32-bit pixel-art conversion path without requiring final art.

Acceptance criteria:
- Asset naming and placement are documented.
- Placeholder keys map cleanly to future sprites/icons.
- Credits/license tracking is updated for any new assets.

## Epic 4: Balance Beta

Goal: tune the game for fair, repeatable, replayable runs.

### Story 4.1: Add Manual Run Telemetry

Capture enough run data to support balance decisions.

Acceptance criteria:
- Manual testers can record stage reached, death reason, build, hero, weapon, and key rewards.
- Data does not require analytics collection or privacy changes.
- Balance notes can be compared between runs.

### Story 4.2: Tune Early Stage Pacing

Adjust first-run difficulty and onboarding pressure.

Acceptance criteria:
- New players usually reach mid-run after understanding controls.
- Early enemy pressure is readable and recoverable.
- Spell costs and mana gain support meaningful decisions.

### Story 4.3: Tune Boss And Elite Pressure

Make bosses and elites distinct, fair, and threatening.

Acceptance criteria:
- Boss intent and counterplay are readable.
- Elite rooms provide a clear risk/reward bump.
- Victory remains achievable without dominant reward combinations.

### Story 4.4: Tune Economy And Reward Rarity

Balance shop value, reward rolls, relics, upgrades, and difficulty modes.

Acceptance criteria:
- Shop purchases feel useful but not mandatory.
- Reward rarity creates meaningful choices.
- Easy, normal, and hard tuning differences are documented.

## Epic 5: Mobile Beta

Goal: make Android/mobile play reliable and comfortable.

### Story 5.1: Implement Portrait Layout Gate

Bring battle, board, controls, hold, next, and inventory UI into the target portrait structure.

Acceptance criteria:
- Top battle area, middle board area, and bottom controls follow the documented proportions.
- Hold block, next block queue, and inventory/relic quick access remain visible or intentionally accessible.
- Safe-area handling is verified.

### Story 5.2: Polish Touch Controls

Make mobile controls comfortable for repeated play.

Acceptance criteria:
- Move, rotate, soft drop, hard drop, hold, and spells are reachable.
- Buttons do not overlap or resize unexpectedly.
- Touch feedback is clear.

### Story 5.3: Validate Android Build Path

Verify web build, Capacitor sync, and debug build path on a configured Android machine.

Acceptance criteria:
- `npm run build` passes.
- `npm run android:sync` works when SDK/tooling is configured.
- Debug build output path is documented.

### Story 5.4: Run Mobile Performance Pass

Reduce obvious mobile performance and readability issues.

Acceptance criteria:
- No major frame spikes during normal play on target devices.
- Text and board state are readable.
- Audio and back-button behavior are acceptable.

## Epic 6: Release Candidate

Goal: prepare a store-ready release candidate with documented limitations.

### Story 6.1: Complete QA Regression Pass

Run release-focused QA across web and Android targets.

Acceptance criteria:
- Release checklist blockers are resolved or documented.
- Save/load, victory, game over, and full-run completion are verified.
- Known issues are captured with severity.

### Story 6.2: Complete Store Assets And Metadata

Prepare store-facing materials without overstating unfinished features.

Acceptance criteria:
- Short description, long description, screenshots, icon, and feature/key art are prepared.
- Trailer is prepared or explicitly deferred.
- Store tags and content rating inputs are reviewed.

### Story 6.3: Complete Credits Licenses And Privacy Review

Close legal and platform compliance gaps.

Acceptance criteria:
- Third-party asset and code licenses are tracked.
- Credits page is complete.
- Privacy policy exists if analytics, crash reporting, ads, or IAP are added.

### Story 6.4: Lock Release Build And Notes

Create a reproducible release candidate snapshot.

Acceptance criteria:
- Build version and build hash are recorded.
- Release notes are drafted.
- Release sign-off template is completed with a go/no-go decision.
