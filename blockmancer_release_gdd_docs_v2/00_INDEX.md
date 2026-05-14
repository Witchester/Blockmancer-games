# Blockmancer Dungeon — Release Documentation Pack

This documentation pack turns the current fun MVP into a structured, release-ready game project.

## Recommended repo location

Place these files under:

```text
/docs/
```

## Document map

| File                               | Purpose                                                               |
| ---------------------------------- | --------------------------------------------------------------------- |
| `01_GDD_MASTER.md`                 | Main game design document and product vision.                         |
| `02_GAMEPLAY_SYSTEMS.md`           | Detailed gameplay systems: board, combat, spells, enemies, rewards.   |
| `03_CONTENT_BIBLE.md`              | Content rules, naming, IDs, content categories, expansion guidelines. |
| `04_BALANCE_AND_PROGRESSION.md`    | Numbers, curves, run length, difficulty, reward economy.              |
| `05_UI_UX_SPEC.md`                 | Screen flows, HUD, mobile controls, accessibility, user experience.   |
| `06_ART_DIRECTION.md`              | Visual identity, sprite needs, UI asset guide, animation priorities.  |
| `07_AUDIO_DIRECTION.md`            | Music/SFX direction and placeholder-to-final pipeline.                |
| `08_TECHNICAL_DESIGN.md`           | Architecture, systems, data loading, save, mobile build.              |
| `09_ASSET_PIPELINE.md`             | Asset folders, naming, import rules, texture atlas roadmap.           |
| `10_PRODUCTION_ROADMAP.md`         | Milestones from MVP to release candidate.                             |
| `11_QA_TEST_PLAN.md`               | Functional, regression, device, balance, performance QA.              |
| `12_RELEASE_CHECKLIST.md`          | Release readiness checklist for web, Android, Steam/PC.               |
| `13_STORE_AND_MARKETING.md`        | Store assets, page copy, launch plan, screenshots, trailer.           |
| `14_LEGAL_IP_RISK.md`              | Practical IP/copyright/trademark risk reduction notes.                |
| `15_MONETIZATION_AND_ANALYTICS.md` | Ethical monetization options and analytics events.                    |
| `16_LIVEOPS_POST_RELEASE.md`       | Patches, events, content drops, telemetry-driven balancing.           |
| `17_DEFINITION_OF_DONE.md`         | Release gates and acceptance criteria.                                |
| `18_CREDITS_AND_LICENSES.md`       | Credits, third-party license tracking, attribution template.          |

## Current project assumption

The MVP already proves that the core loop is fun:

```text
falling blocks -> line clear -> damage enemy -> gain mana -> cast spell -> choose reward -> map progression
```

The next goal is not to rebuild the MVP. The next goal is to harden it into a production project with reliable content, polish, QA, release pipelines, and identity strong enough to avoid being seen as a simple clone.

## V2 update — release expansion notes

This docs pack has been updated for the post-MVP direction:

```text
[19] Stage and Boss Expansion
[20] Hero Stories and Unlock Conditions
[21] Portrait Mobile UI Specification
[22] Expanded Content Roster
```

These documents override older high-level notes when conflicts exist. The most important changes are:

```text
- Release run is expanded from a simple 10-stage MVP into a multi-act structure.
- More bosses and mini-bosses are planned.
- Every hero requires story, passive identity, and unlock condition.
- Visual direction is pixel-art / 32-bit dark fantasy arcade.
- The primary mobile layout is portrait-only.
- Battle screen, board screen, and mobile controls use fixed vertical proportions.
- Inventory, next block, and hold block must be visible and prioritized correctly.
```
