# Balance and Progression Notes

## Release 1.0 balance pass

Release 1.0 is tuned around a 6-stage run. Stage 1 uses base enemy values with no scaling tax, then each later stage adds moderate HP, attack, fall speed, reward gold, and rare reward chance.

Current run targets:

| Area | Target |
| ---- | ------ |
| Stage 1 | Average players should clear the first stage after learning holds, mana, and one reward pick. |
| Stage 3 | Players should have a visible build direction through spells, line damage, or board control. |
| Stage 6 | Skilled players can reach the final boss with a mixed build and careful spell use. |
| Bosses | Phase 2 should add pressure without requiring a single exact counter. |
| Cascades | Multi-clears should feel clearly better through damage bonus and mana gain. |
| Unlocks | Hero unlocks should use tracked meta counters so progress is always reachable. |

Balance knobs changed in the first pass:

```text
default max stage: 6
enemy HP per stage: 6
enemy attack per stage: 0.35
fall speed per stage: 0.035
fall speed cap: 1.85
post-battle speed step: 0.035
mana gain: 12 / 28 / 50 / 76
line clear bonus: 0 / 9 / 21 / 40
```
