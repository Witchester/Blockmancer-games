# Definition of Done

## 1. Feature done

A feature is done when:

```text
[ ] It works in the intended scene
[ ] It is connected to run state
[ ] It has UI feedback
[ ] It has event log feedback when relevant
[ ] It has placeholder or final audio/visual feedback
[ ] It does not break save/load
[ ] It is tested manually
[ ] npm run build passes
```

## 2. Content done

A content entry is done when:

```text
[ ] JSON validates
[ ] ID is unique and correctly prefixed
[ ] Effects are supported
[ ] Description is clear
[ ] Rarity/tags are correct
[ ] Appears in loot table/unlock path
[ ] Has placeholder icon/sprite key
[ ] Tested in at least one run
```

## 3. Scene done

A scene is done when:

```text
[ ] It can be reached naturally
[ ] It has clear exit paths
[ ] It handles invalid/missing state
[ ] It supports keyboard/touch where needed
[ ] It fits desktop layout
[ ] It fits mobile layout or has fallback
[ ] No console errors
```

## 4. Release candidate done

Release candidate requires:

```text
[ ] Full run is completable
[ ] Boss victory works
[ ] Game over works
[ ] Save/load works
[ ] Settings work
[ ] Credits/licenses present
[ ] QA smoke pass complete
[ ] Store assets ready
[ ] Content rating prepared
[ ] Build version locked
[ ] No blocker/critical bugs
```

## 5. No-go conditions

Do not release if:

```text
[ ] Game crashes during normal run
[ ] Player can lose save data
[ ] Android build cannot install/run
[ ] Main controls fail on target device
[ ] Store build has missing required metadata
[ ] Third-party asset license unknown
[ ] Payment/ads/privacy not disclosed if used
```

## 6. Release sign-off template

```text
Release version:
Date:
Platform:
Build artifact:
QA status:
Known issues:
Decision:
Owner:
```
