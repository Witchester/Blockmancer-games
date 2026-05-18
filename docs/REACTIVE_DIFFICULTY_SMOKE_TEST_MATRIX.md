# Reactive Difficulty Smoke Test Matrix

Updated: 2026-05-18

## Incoming Junk

1. Queue 6 junk from DebugScene.
2. Trigger Cascade 2 using the cascade test board.
3. Confirm the event log trims incoming junk before landing.
4. Use Snack Shield and confirm countdown increases by 3 pieces.
5. Use Return Stamp and confirm roughly half reflects as enemy damage.

## Floating Blocks

1. Spawn Floaty Rune from DebugScene.
2. Use Cloud Pin and confirm the floater resolves safely.
3. Spawn Floaty Rune again.
4. Use Balloon Pop and confirm it clears the floater and queues one warned crumb junk.

## Hazard Windows

1. Trigger Freeze Warning and use Hot Cocoa.
2. Confirm the warning clears and mana increases.
3. Trigger Preview Glitter and use Preview Glasses.
4. Confirm Next/Hold readability returns.
5. Trigger Low Ceiling and use Tent Pole or Safety Net.
6. Confirm the hazard resolves without a soft-lock.
7. Trigger Bad Piece, Speed Wave, Sleepy Tune, and Royal Pattern from DebugScene and verify counter hints appear.

## Spell Catalysts

1. Use Firecracker Sugar, then Fireball on a board with sticky/junk.
2. Confirm cleanup occurs and the modifier is consumed.
3. Use Cleaning Charm, then Void/Clean Cut.
4. Confirm row clear also removes junk/sticky.
5. Use Spell Coupon, cast any spell, and confirm reduced mana cost.
6. Use an incompatible catalyst before the wrong spell and confirm it waits.

## Hero And Relic Synergies

1. Pippa: cast Fireball and confirm sticky/junk cleanup.
2. Nixie: trigger freeze or speed wave once and confirm Stay Chill softens it.
3. Bruk: force top-out and confirm No Snack Left Behind clears room once.
4. Zuzu: cast Bomb Rune and confirm stronger bomb output with warned crumb risk chance.
5. Lumi: clear star blocks during incoming junk and confirm extra junk reduction.

## Route Story / Reactive Difficulty

1. Trigger Milo Stage 1 route and choose Practical; confirm shield/safety reward.
2. Trigger Pippa Stage 1 route and choose True; confirm heal/counter reward and true flag.
3. Trigger Zuzu Stage 2 route and choose Risky; confirm reward plus warned junk risk.
4. Trigger Nixie Stage 3 route and choose True; confirm freeze/speed guard modifier.
5. Trigger Bruk Stage 6 route and choose True; confirm boss/route modifier.
6. Trigger Lumi Stage 5 route and choose Risky; confirm reward plus preview/speed/royal warning as configured.

## Save / Load

1. Save with active incoming junk and reload.
2. Confirm it restores or normalizes safely.
3. Save with active floating block and reload.
4. Confirm it restores or normalizes safely.
5. Save with active stage/boss/run route modifier and reload.
6. Confirm route modifier persists if its duration is not battle-only.
7. Confirm missing/corrupt reactive state initializes safely.
