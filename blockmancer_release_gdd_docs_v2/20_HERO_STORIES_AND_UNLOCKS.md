# Hero Stories and Unlock Conditions

## 1. Goal

Every hero should feel like a different character, not just a stat sheet. Each hero needs a small story, a gameplay identity, a tradeoff, and a clear unlock condition.

## 2. Hero unlock design rules

Unlocks should be:

```text
- Easy to understand
- Visible from Hero Select
- Achievable through normal play
- Not overly grindy
- Connected to the hero fantasy
```

## 3. Hero data fields

Add these fields to hero JSON:

```json
{
  "story": {
    "shortBio": "...",
    "motivation": "...",
    "relationshipToDungeon": "..."
  },
  "unlock": {
    "isUnlockedByDefault": false,
    "condition": "defeat_slime_baron",
    "description": "Defeat the Slime Baron once."
  },
  "preferredBuilds": ["fire", "spell_damage"],
  "tradeoffs": ["low_hp", "higher_fall_speed"]
}
```

## 4. Hero roster

### Blockmancer

```text
ID: hero_blockmancer
Class: Starter Mage
Role: balanced / mana / beginner-friendly
Unlock: available from start
```

Story:

```text
Once a failed apprentice of the Royal Academy, the Blockmancer survived the dungeon collapse by binding their soul to rune blocks. They do not fully control the battlefield yet, but the blocks answer their will better than anyone else's.
```

Gameplay identity:

```text
- Balanced stats
- Better mana from line clears
- Good starter spells
- No major weakness
```

### Pyromancer

```text
ID: hero_pyromancer
Class: Fire Mage
Role: high damage / burn / risky speed
Unlock: defeat Slime Baron once
```

Story:

```text
The Pyromancer entered the dungeon searching for the original flame rune. Their magic burns through monsters quickly, but every spell pulls more heat into an already unstable battlefield.
```

Gameplay identity:

```text
- Strong fire spell damage
- Burn status synergy
- Lower HP
- Slightly faster fall speed
```

### Frostbinder

```text
ID: hero_frostbinder
Class: Control Mage
Role: slow / survival / preview planning
Unlock: clear Act 2 or defeat Junkmaster Gob
```

Story:

```text
A guardian from the Frost Crypt who once sealed the dungeon's lower gates. They return to freeze the spreading curse before the Royal Void opens again.
```

Gameplay identity:

```text
- Lower fall speed
- More defensive/control spells
- Lower mana pool
- Lower burst damage
```

### Gravity Knight

```text
ID: hero_gravity_knight
Class: Heavy Control
Role: hard drop / armor / impact damage
Unlock: clear 100 total lines or defeat Stone Titan
```

Story:

```text
A knight crushed by the first dungeon collapse and rebuilt with gravity runes. They fight by turning falling blocks into weapons of weight and momentum.
```

Gameplay identity:

```text
- High HP
- Higher line damage
- Hard drop damage
- Lower mana
- Faster fall speed
```

### Void Scholar

```text
ID: hero_void_scholar
Class: Risk Mage
Role: void / curses / high mana
Unlock: reach Act 5 or accept 3 curses in one run
```

Story:

```text
The Void Scholar studied the curse too closely and learned to cut holes in reality. Their power is efficient and dangerous, but the dungeon recognizes them as one of its own.
```

Gameplay identity:

```text
- High mana
- Void spell discount
- Strong board rescue
- Low HP
- Curse synergy / curse risk
```

### Rune Engineer

```text
ID: hero_rune_engineer
Class: Bomb Technician
Role: bombs / board tools / economy
Unlock: cast Bomb Rune 50 times or defeat Junkmaster Gob
```

Story:

```text
A goblin-trained human engineer who learned to speak with unstable runes. They do not cast elegant spells; they build solutions that explode at the right time.
```

Gameplay identity:

```text
- Bomb block synergy
- Extra board tools
- Shop/economy bonuses
- Average HP
- Weaker direct spell damage
```

## 5. Unlock tracking

SaveSystem should track:

```text
bossesDefeated
actsCleared
totalLinesCleared
totalSpellsCastById
maxActReached
cursesAcceptedInRun
heroesUnlocked
```

## 6. Hero select requirements

Locked hero card shows:

```text
portrait silhouette
name
class
short role
unlock requirement
progress if trackable
```

Example:

```text
Gravity Knight
Locked
Clear 100 total lines. Progress: 67/100.
```
