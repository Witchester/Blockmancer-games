# Roadmap

## Current Placeholder MVP

Current target:

- A fully playable placeholder run loop on web
- Phaser-based menu, map, battle, reward, and game-over flow
- Working falling-block combat
- Basic enemy variety
- Four core spells
- Reward progression
- localStorage save and continue
- Android packaging documentation and shell support

Current remaining gaps:

- Missing hero-select flow
- Missing dedicated event/shop/rest/treasure scenes
- Missing content entry JSON files and `ContentRegistry`
- Missing fuller polish and mobile tuning

## Playable Alpha

Goals:

- All major room types are reachable
- Dedicated scenes exist for non-combat rooms
- Save/load works across a full run
- Boss win and defeat loop are stable
- Placeholder UI is readable on desktop and acceptable on mobile

Focus:

- Scene completeness
- Runtime stability
- Core run pacing

## Content Alpha

Goals:

- Add placeholder content entry JSON files for all core categories
- Implement `ContentRegistry`
- Shift enemy, spell, reward, and difficulty data toward content-driven loading
- Add more sample content breadth without changing final art direction

Focus:

- Content authoring pipeline
- Validation
- Runtime content lookup

## Balance Beta

Goals:

- Tune line-clear damage and mana curves
- Tune spell costs and reward pacing
- Tune enemy scaling and disruption frequency
- Tune map progression and room reward value

Focus:

- System balance
- Run fairness
- Boss difficulty clarity

## Mobile Beta

Goals:

- Improve touch layout and spacing
- Improve readability in portrait and landscape
- Validate Android packaging workflow on a configured machine
- Reduce friction in mobile controls and scene transitions

Focus:

- Mobile UX
- Android testing
- Performance and readability

## Full Release Candidate

Goals:

- Complete content-driven runtime pipeline
- Tighten placeholder polish into a coherent production candidate
- Improve effects, sound, and visual feedback
- Document known limitations and release setup clearly

Focus:

- Cohesion
- Stability
- Deployment readiness
