# Blockmancer Dungeon — Monster Wikipedia Source of Truth

**Updated:** 2026-06-02  
**Authority:** Current canonical source for monster/boss metadata, stage fit, attack intent, counterplay notes, Fever interactions, reward notes, and monster asset contracts.

## 1. Monster Tone Rules

Monster writing must stay:

```text
cheerful fantasy
cute chaos
funny and readable
festival adventure / magical arcade energy
friendly enough to support friendship and collection
```

Avoid:

```text
curse
blood
doom
nightmare
plague
death
gore
skull
torture
corruption
```

Use words like:

```text
mess
mishap
hiccup
prank
overexcited
sleepy
sticky
bouncy
royal decree
snack panic
frosting
confetti
toy
festival
```

## 2. Monster Rank Taxonomy

| Rank | Content ID Pattern | Node Type | Purpose | Reward Tier |
| --- | --- | --- | --- | --- |
| Regular | `mon_*` | Normal battle | Teach and repeat stage mechanic safely. | Normal |
| Elite | `mon_elite_*` | Elite node | Test mechanic mastery with distinct action pattern. | Better than normal, below boss |
| Elite Mini-Boss / Royal Guard | `mon_elite_*` | Stage 6 royal guard / mini-boss | Final-stage skill check before King Bloxley. | High elite / mini-boss |
| Boss | `boss_*` or compatible alias | Boss node | Stage capstone with rule card, phases, story callback. | Boss |

Rules:

- Stage 1 has no elite node in normal map flow.
- Elite nodes begin at Stage 2.
- Elite monsters are separate content entries, not only stat-scaled regular monsters.
- Boss mechanics must match stage mechanics.
- All major hazards require readable warning/counterplay.
- Unsupported runtime effects fail safely and are marked fallback/partial in audit reports.

## 3. Monster Metadata Schema

```ts
type MonsterWikiMetadata = {
  id: string;
  name: string;
  rank: "regular" | "elite" | "elite_miniboss" | "boss";
  stageNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stageId: string;
  stageName: string;
  biomeTheme: string;
  role: string;
  tier: number;
  rarity: "common" | "uncommon" | "elite" | "elite_miniboss" | "boss";
  spawnNode: "normal" | "elite_node" | "royal_guard_node" | "boss_node";
  personality: string;
  description: string;
  primaryMechanic: string;
  stats: {
    hpTarget: number;
    attackTarget: number;
    armorTarget: number;
    attackIntervalLocks: number | string;
  };
  actions: {
    basicActionId: string;
    basicDamage: number;
    specialActionId: string;
    effectHook: string;
    warningRequired: "Yes" | "No" | "Prefer" | string;
    counterplay: string;
  };
  traits: {
    resistances: string;
    weaknesses: string;
    tags: string;
  };
  rewardNotes: string;
  friendshipHook: string;
  asset: {
    spriteKey: string;
    iconKey: string;
    canonicalFolder: string;
    animationContract: string;
  };
  implementationStatus: "Implemented" | "Partial" | "Fallback Only" | "Not Implemented" | "Unknown" | string;
};
```

## 4. Stage Mechanical Identity

| Stage | Stage ID | Stage Name | Main Mechanics | Boss |
| ---: | --- | --- | --- | --- |
| 1 | `stage_sprinkle_sewers` | Sprinkle Sewers | Sticky blocks, sprinkle blocks, bonus mana | `boss_cupcake_slime_king` |
| 2 | `stage_goblin_workshop` | Goblin Workshop | Junk blocks, bomb blocks, board shake, gadget pressure | `boss_prototype_no_7` |
| 3 | `stage_frosty_pantry` | Frosty Pantry | Ice blocks, speed waves, active-piece freeze | `boss_gelato_golem` |
| 4 | `stage_pillow_castle` | Pillow Castle | Soft blocks, shield enemies, Sleepy status | `boss_sir_snore_a_lot` |
| 5 | `stage_starfall_arcade` | Starfall Arcade | Fever Showtime, cascade bonus, combo challenge | `boss_high_score_hydra` |
| 6 | `stage_bloxleys_block_palace` | Bloxley’s Block Palace | Royal blocks, symmetry, pattern junk, final cascade check | `boss_king_bloxley` |

## 5. Regular Monster Catalog

| Stage | Monster IDs |
| ---: | --- |
| 1 | `mon_cupcake_slime`, `mon_sugar_bat`, `mon_crumb_goblin`, `mon_jelly_rat`, `mon_sprinkle_snail`, `mon_frosting_blob` |
| 2 | `mon_wrench_goblin`, `mon_button_masher`, `mon_spring_bot`, `mon_spark_gremlin`, `mon_gear_slime`, `mon_rattle_drone` |
| 3 | `mon_ice_cream_imp`, `mon_popsicle_bat`, `mon_chill_slime`, `mon_freezer_mimic`, `mon_snowcone_sprite`, `mon_pudding_penguin` |
| 4 | `mon_button_knight`, `mon_blanket_ghost`, `mon_plush_dragon`, `mon_toy_soldier`, `mon_pillow_squire`, `mon_sock_sprite` |
| 5 | `mon_token_sprite`, `mon_combo_gremlin`, `mon_neon_bat`, `mon_prize_claw_mimic`, `mon_pixel_blob`, `mon_joystick_jester` |
| 6 | `mon_square_jester`, `mon_royal_blockling`, `mon_pattern_squire`, `mon_confetti_guard`, `mon_crown_mimic`, `mon_symmetry_sprite` |

## 6. Boss Fever Interaction Metadata

### Cupcake Slime King

- Uses sticky/sprinkle pressure.
- Fever release may clear pressure but cannot remove boss phases.
- Overflow should convert into small mana/shield/cleanup utility if damage cap is reached.

### Prototype No. 7

- Uses junk, gadget, and bomb pressure.
- Fever release may reduce queued junk through supported handlers.
- Boss Drama Guard blocks one-shot machine phase skips.

### Gelato Golem

- Uses ice/freeze/speed pressure.
- Fever release may help recover tempo but cannot cancel all freeze mechanics permanently.
- Fever Heat should not combine with speed waves into unavoidable loss.

### Sir Snore-a-Lot

- Uses soft blocks, shield, and Sleepy.
- Fever release may reduce Soft Junk or create shield utility.
- Sleepy status must remain counterable.

### High Score Hydra

- Stage 5 boss is the primary Fever Showtime showcase.
- Uses combo challenge, score pressure, preview disruption, and Showtime pressure conversion.
- Must clearly demonstrate Charged Lines, manual release, Fever Heat, Showtime Overflow, and Boss Drama Guard.
- Cannot be one-shot by Fever.
- Cannot skip multiple phases from one release.

### King Bloxley

- Uses royal blocks, pattern pressure, symmetry checks, and final board pressure.
- Fever release must obey final boss caps.
- Board/Fever upgrades may improve warnings, release timing, and Overflow utility but must not remove royal mechanics.

## 7. Monster Stack Preview Rules

Sequential encounter packs show only one active enemy at a time.

Monster stack UI:

- Active enemy icon fully visible.
- Next enemy icon partly visible behind active icon.
- Later enemies use a mystery/count chip.
- Runtime render size: 24-36px.
- Use existing monster icon keys.
- Missing monster icons fall back safely.

## 8. Asset Contract

Regular monster animation contract:

```text
idle 4
attack 6
hit 3
defeat 6
icon 1
```

Boss animation contract:

```text
idle 6
attack 8
hit 4
phase_change 8
special_attack 8
defeat 10
portrait_icon 1
```

Canonical folders:

```text
public/assets/sprites/monsters/{monster_id}/
public/assets/sprites/bosses/{boss_id}/
public/assets/icons/... when a separate icon category is required
```

## 9. Upgrade Interaction Notes

Hero-specific upgrade cards should reinforce monster-stage identity:

| Hero | Monster/Boss Interaction Direction |
| --- | --- |
| Milo | Earlier warnings and cascade/mana response to frightened or noisy mechanics. |
| Pippa | Fire cleanup for sticky/junk/soft/hazard blocks. |
| Zuzu | Bomb/gadget counterplay for machine and junk pressure. |
| Nixie | Freeze/speed/tempo control. |
| Bruk | Shield and hospitality protection under pressure. |
| Lumi | Star/cascade/Fever timing against score, wishes, and royal pressure. |

Board upgrades provide general counterplay across monsters. Fever upgrades provide Showtime control but cannot bypass boss drama rules.

## 10. Implementation Status Tracking

Use these status values in audits:

```text
Implemented
Partial
Fallback Only
Not Implemented
Unknown
```

Do not mark a monster/boss behavior as implemented from this SOT alone. Verify in repo code and content.
