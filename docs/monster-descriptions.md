# Monster Descriptions

- Source: actual current JSON in `src/game/content/monsters/`.
- Primary IDs stay the current repo IDs; no save-facing monster ID was renamed in this pass.

## Stage 1 Sprinkle Sewers

### mon_dungeon_slime
Current Repo ID: `mon_dungeon_slime`
GDD / Canonical Design ID: `mon_cupcake_slime` (Cupcake Slime)
Match Confidence: high
```json
{
  "id": "mon_dungeon_slime",
  "name": "Dungeon Slime",
  "description": "A gelatinous beginner foe that bounces forward and splashes direct damage.",
  "rarity": "common",
  "tier": 1,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "placeholder_slime",
  "stats": {
    "hp": 30,
    "attack": 3,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Bounce Attack",
    "description": "Deals direct damage."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [
    "fire"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 20,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game",
    "tutorial",
    "small"
  ],
  "enabled": true,
  "iconKey": "ico_mon_dungeon_slime",
  "animations": {
    "idle": "anim_mon_dungeon_slime_idle",
    "attack": "anim_mon_dungeon_slime_attack",
    "hit": "anim_mon_dungeon_slime_hit",
    "defeat": "anim_mon_dungeon_slime_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_dungeon_goblin
Current Repo ID: `mon_dungeon_goblin`
GDD / Canonical Design ID: `mon_crumb_goblin` (Crumb Goblin)
Match Confidence: high
```json
{
  "id": "mon_dungeon_goblin",
  "name": "Dungeon Goblin",
  "description": "A sharp-toothed raider that litters the board with junk while chipping away at the player.",
  "rarity": "common",
  "tier": 1,
  "role": "disruptor",
  "biome": "dungeon",
  "spriteKey": "placeholder_goblin",
  "stats": {
    "hp": 45,
    "attack": 4,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_throw_junk",
    "label": "Throw Junk",
    "description": "Adds junk pressure after attacking."
  },
  "behaviors": [
    "basic_attack",
    "spawn_junk"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 12,
    "goldMax": 24,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game",
    "physical",
    "junk_spawner",
    "board_disruptor"
  ],
  "enabled": true,
  "iconKey": "ico_mon_dungeon_goblin",
  "animations": {
    "idle": "anim_mon_dungeon_goblin_idle",
    "attack": "anim_mon_dungeon_goblin_attack",
    "hit": "anim_mon_dungeon_goblin_hit",
    "defeat": "anim_mon_dungeon_goblin_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_sprinkle_rat
Current Repo ID: `mon_sprinkle_rat`
GDD / Canonical Design ID: `mon_jelly_rat` (Jelly Rat)
Match Confidence: medium
```json
{
  "id": "mon_sprinkle_rat",
  "name": "Sprinkle Rat",
  "description": "Sprinkle Rat joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 2,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "placeholder_sprinkle_rat",
  "stats": {
    "hp": 24,
    "attack": 3,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Nibble Dash",
    "description": "Sprinkle Rat prepares Nibble Dash."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_sprinkle_rat",
  "animations": {
    "idle": "anim_mon_sprinkle_rat_idle",
    "attack": "anim_mon_sprinkle_rat_attack",
    "hit": "anim_mon_sprinkle_rat_hit",
    "defeat": "anim_mon_sprinkle_rat_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_pipe_peeker
Current Repo ID: `mon_pipe_peeker`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_pipe_peeker",
  "name": "Pipe Peeker",
  "description": "Pipe Peeker joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 2,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "placeholder_pipe_peeker",
  "stats": {
    "hp": 34,
    "attack": 4,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Pipe Pop",
    "description": "Pipe Peeker prepares Pipe Pop."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_pipe_peeker",
  "animations": {
    "idle": "anim_mon_pipe_peeker_idle",
    "attack": "anim_mon_pipe_peeker_attack",
    "hit": "anim_mon_pipe_peeker_hit",
    "defeat": "anim_mon_pipe_peeker_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_syrup_slug
Current Repo ID: `mon_syrup_slug`
GDD / Canonical Design ID: `mon_sprinkle_snail` (Sprinkle Snail)
Match Confidence: medium
```json
{
  "id": "mon_syrup_slug",
  "name": "Syrup Slug",
  "description": "Syrup Slug joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 2,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "placeholder_syrup_slug",
  "stats": {
    "hp": 32,
    "attack": 3,
    "armor": 1,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_guard",
    "label": "Sticky Wiggle",
    "description": "Syrup Slug prepares Sticky Wiggle."
  },
  "behaviors": [
    "reduce_line_damage"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_syrup_slug",
  "animations": {
    "idle": "anim_mon_syrup_slug_idle",
    "attack": "anim_mon_syrup_slug_attack",
    "hit": "anim_mon_syrup_slug_hit",
    "defeat": "anim_mon_syrup_slug_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_cupcake_imp
Current Repo ID: `mon_cupcake_imp`
GDD / Canonical Design ID: `mon_frosting_blob` (Frosting Blob)
Match Confidence: low
```json
{
  "id": "mon_cupcake_imp",
  "name": "Cupcake Imp",
  "description": "Cupcake Imp joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 2,
  "role": "summoner",
  "biome": "dungeon",
  "spriteKey": "placeholder_cupcake_imp",
  "stats": {
    "hp": 38,
    "attack": 4,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_throw_junk",
    "label": "Crumb Toss",
    "description": "Cupcake Imp prepares Crumb Toss."
  },
  "behaviors": [
    "spawn_junk"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_cupcake_imp",
  "animations": {
    "idle": "anim_mon_cupcake_imp_idle",
    "attack": "anim_mon_cupcake_imp_attack",
    "hit": "anim_mon_cupcake_imp_hit",
    "defeat": "anim_mon_cupcake_imp_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Stage 2 Goblin Workshop

### mon_gear_gremlin
Current Repo ID: `mon_gear_gremlin`
GDD / Canonical Design ID: `mon_spark_gremlin` (Spark Gremlin)
Match Confidence: medium
```json
{
  "id": "mon_gear_gremlin",
  "name": "Gear Gremlin",
  "description": "Gear Gremlin joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 3,
  "role": "summoner",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_gear_gremlin",
  "stats": {
    "hp": 44,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_summon",
    "label": "Gear Scatter",
    "description": "Gear Gremlin prepares Gear Scatter."
  },
  "behaviors": [
    "spawn_junk"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_gear_gremlin",
  "animations": {
    "idle": "anim_mon_gear_gremlin_idle",
    "attack": "anim_mon_gear_gremlin_attack",
    "hit": "anim_mon_gear_gremlin_hit",
    "defeat": "anim_mon_gear_gremlin_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_gadget_goblin
Current Repo ID: `mon_gadget_goblin`
GDD / Canonical Design ID: `mon_wrench_goblin` (Wrench Goblin)
Match Confidence: medium
```json
{
  "id": "mon_gadget_goblin",
  "name": "Gadget Goblin",
  "description": "Gadget Goblin joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 3,
  "role": "summoner",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_gadget_goblin",
  "stats": {
    "hp": 46,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_throw_junk",
    "label": "Loose Screws",
    "description": "Gadget Goblin prepares Loose Screws."
  },
  "behaviors": [
    "spawn_junk"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_gadget_goblin",
  "animations": {
    "idle": "anim_mon_gadget_goblin_idle",
    "attack": "anim_mon_gadget_goblin_attack",
    "hit": "anim_mon_gadget_goblin_hit",
    "defeat": "anim_mon_gadget_goblin_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_wrench_wisp
Current Repo ID: `mon_wrench_wisp`
GDD / Canonical Design ID: `mon_rattle_drone` (Rattle Drone)
Match Confidence: low
```json
{
  "id": "mon_wrench_wisp",
  "name": "Wrench Wisp",
  "description": "Wrench Wisp joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 2,
  "role": "caster",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_wrench_wisp",
  "stats": {
    "hp": 40,
    "attack": 4,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_hex",
    "label": "Mana Rattle",
    "description": "Wrench Wisp prepares Mana Rattle."
  },
  "behaviors": [
    "mana_hex"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_wrench_wisp",
  "animations": {
    "idle": "anim_mon_wrench_wisp_idle",
    "attack": "anim_mon_wrench_wisp_attack",
    "hit": "anim_mon_wrench_wisp_hit",
    "defeat": "anim_mon_wrench_wisp_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_spring_bot
Current Repo ID: `mon_spring_bot`
GDD / Canonical Design ID: `mon_spring_bot` (Spring Bot)
Match Confidence: exact
```json
{
  "id": "mon_spring_bot",
  "name": "Spring Bot",
  "description": "Spring Bot joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_spring_bot",
  "stats": {
    "hp": 52,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_charge",
    "label": "Speed Spring",
    "description": "Spring Bot prepares Speed Spring."
  },
  "behaviors": [
    "increase_fall_speed"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_spring_bot",
  "animations": {
    "idle": "anim_mon_spring_bot_idle",
    "attack": "anim_mon_spring_bot_attack",
    "hit": "anim_mon_spring_bot_hit",
    "defeat": "anim_mon_spring_bot_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_bolt_beetle
Current Repo ID: `mon_bolt_beetle`
GDD / Canonical Design ID: `mon_gear_slime` (Gear Slime)
Match Confidence: low
```json
{
  "id": "mon_bolt_beetle",
  "name": "Bolt Beetle",
  "description": "Bolt Beetle joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_bolt_beetle",
  "stats": {
    "hp": 50,
    "attack": 4,
    "armor": 1,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_guard",
    "label": "Shell Guard",
    "description": "Bolt Beetle prepares Shell Guard."
  },
  "behaviors": [
    "reduce_line_damage"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_bolt_beetle",
  "animations": {
    "idle": "anim_mon_bolt_beetle_idle",
    "attack": "anim_mon_bolt_beetle_attack",
    "hit": "anim_mon_bolt_beetle_hit",
    "defeat": "anim_mon_bolt_beetle_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_elite_knight
Current Repo ID: `mon_elite_knight`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_elite_knight",
  "name": "Elite Knight",
  "description": "A brutal frontline champion that slams hard and stirs extra debris onto the board.",
  "rarity": "elite",
  "tier": 4,
  "role": "elite",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_elite_knight",
  "stats": {
    "hp": 95,
    "attack": 8,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_heavy_slam",
    "label": "Heavy Slam",
    "description": "Deals extra damage and adds junk pressure."
  },
  "behaviors": [
    "basic_attack",
    "spawn_junk",
    "shake_board"
  ],
  "resistances": [
    "physical"
  ],
  "weaknesses": [
    "void",
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 25,
    "goldMax": 45,
    "rewardRolls": 2,
    "lootTableId": "loot_elite_default"
  },
  "tags": [
    "late_game",
    "armored",
    "physical",
    "junk_spawner",
    "elite"
  ],
  "enabled": true,
  "iconKey": "ico_mon_elite_knight",
  "animations": {
    "idle": "anim_mon_elite_knight_idle",
    "attack": "anim_mon_elite_knight_attack",
    "hit": "anim_mon_elite_knight_hit",
    "defeat": "anim_mon_elite_knight_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Stage 3 Frosty Pantry

### mon_frosting_fox
Current Repo ID: `mon_frosting_fox`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_frosting_fox",
  "name": "Frosting Fox",
  "description": "Frosting Fox joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 3,
  "role": "basic",
  "biome": "ice_cave",
  "spriteKey": "placeholder_frosting_fox",
  "stats": {
    "hp": 48,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Cold Snap",
    "description": "Frosting Fox prepares Cold Snap."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_frosting_fox",
  "animations": {
    "idle": "anim_mon_frosting_fox_idle",
    "attack": "anim_mon_frosting_fox_attack",
    "hit": "anim_mon_frosting_fox_hit",
    "defeat": "anim_mon_frosting_fox_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_chilly_churro
Current Repo ID: `mon_chilly_churro`
GDD / Canonical Design ID: `mon_ice_cream_imp` (Ice Cream Imp)
Match Confidence: medium
```json
{
  "id": "mon_chilly_churro",
  "name": "Chilly Churro",
  "description": "Chilly Churro joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "caster",
  "biome": "ice_cave",
  "spriteKey": "placeholder_chilly_churro",
  "stats": {
    "hp": 50,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_hex",
    "label": "Sugar Chill",
    "description": "Chilly Churro prepares Sugar Chill."
  },
  "behaviors": [
    "mana_hex"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_chilly_churro",
  "animations": {
    "idle": "anim_mon_chilly_churro_idle",
    "attack": "anim_mon_chilly_churro_attack",
    "hit": "anim_mon_chilly_churro_hit",
    "defeat": "anim_mon_chilly_churro_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_gelato_blob
Current Repo ID: `mon_gelato_blob`
GDD / Canonical Design ID: `mon_chill_slime` (Chill Slime)
Match Confidence: medium
```json
{
  "id": "mon_gelato_blob",
  "name": "Gelato Blob",
  "description": "Gelato Blob joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "basic",
  "biome": "ice_cave",
  "spriteKey": "placeholder_gelato_blob",
  "stats": {
    "hp": 56,
    "attack": 4,
    "armor": 1,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_guard",
    "label": "Gelato Guard",
    "description": "Gelato Blob prepares Gelato Guard."
  },
  "behaviors": [
    "reduce_line_damage"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_gelato_blob",
  "animations": {
    "idle": "anim_mon_gelato_blob_idle",
    "attack": "anim_mon_gelato_blob_attack",
    "hit": "anim_mon_gelato_blob_hit",
    "defeat": "anim_mon_gelato_blob_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_ice_pop_mimic
Current Repo ID: `mon_ice_pop_mimic`
GDD / Canonical Design ID: `mon_freezer_mimic` (Freezer Mimic)
Match Confidence: high
```json
{
  "id": "mon_ice_pop_mimic",
  "name": "Ice Pop Mimic",
  "description": "Ice Pop Mimic joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "basic",
  "biome": "ice_cave",
  "spriteKey": "placeholder_ice_pop_mimic",
  "stats": {
    "hp": 58,
    "attack": 6,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_charge",
    "label": "Brain Freeze",
    "description": "Ice Pop Mimic prepares Brain Freeze."
  },
  "behaviors": [
    "freeze_piece"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_ice_pop_mimic",
  "animations": {
    "idle": "anim_mon_ice_pop_mimic_idle",
    "attack": "anim_mon_ice_pop_mimic_attack",
    "hit": "anim_mon_ice_pop_mimic_hit",
    "defeat": "anim_mon_ice_pop_mimic_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_snowcone_sprite
Current Repo ID: `mon_snowcone_sprite`
GDD / Canonical Design ID: `mon_snowcone_sprite` (Snowcone Sprite)
Match Confidence: exact
```json
{
  "id": "mon_snowcone_sprite",
  "name": "Snowcone Sprite",
  "description": "Snowcone Sprite joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 3,
  "role": "basic",
  "biome": "ice_cave",
  "spriteKey": "placeholder_snowcone_sprite",
  "stats": {
    "hp": 42,
    "attack": 4,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_screech",
    "label": "Frost Blink",
    "description": "Snowcone Sprite prepares Frost Blink."
  },
  "behaviors": [
    "hide_next_piece"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_snowcone_sprite",
  "animations": {
    "idle": "anim_mon_snowcone_sprite_idle",
    "attack": "anim_mon_snowcone_sprite_attack",
    "hit": "anim_mon_snowcone_sprite_hit",
    "defeat": "anim_mon_snowcone_sprite_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_bubble_bat
Current Repo ID: `mon_bubble_bat`
GDD / Canonical Design ID: `mon_popsicle_bat` (Popsicle Bat)
Match Confidence: medium
```json
{
  "id": "mon_bubble_bat",
  "name": "Bubble Bat",
  "description": "Bubble Bat joins the festival dungeon with cheerful trouble.",
  "rarity": "common",
  "tier": 2,
  "role": "basic",
  "biome": "dungeon",
  "spriteKey": "placeholder_bubble_bat",
  "stats": {
    "hp": 30,
    "attack": 3,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_screech",
    "label": "Bubble Blind",
    "description": "Bubble Bat prepares Bubble Blind."
  },
  "behaviors": [
    "hide_next_piece"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_bubble_bat",
  "animations": {
    "idle": "anim_mon_bubble_bat_idle",
    "attack": "anim_mon_bubble_bat_attack",
    "hit": "anim_mon_bubble_bat_hit",
    "defeat": "anim_mon_bubble_bat_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Stage 4 Pillow Castle

### mon_pillow_pawn
Current Repo ID: `mon_pillow_pawn`
GDD / Canonical Design ID: `mon_pillow_squire` (Pillow Squire)
Match Confidence: high
```json
{
  "id": "mon_pillow_pawn",
  "name": "Pillow Pawn",
  "description": "Pillow Pawn joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_pillow_pawn",
  "stats": {
    "hp": 60,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Soft Bop",
    "description": "Pillow Pawn prepares Soft Bop."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_pillow_pawn",
  "animations": {
    "idle": "anim_mon_pillow_pawn_idle",
    "attack": "anim_mon_pillow_pawn_attack",
    "hit": "anim_mon_pillow_pawn_hit",
    "defeat": "anim_mon_pillow_pawn_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_blanket_bard
Current Repo ID: `mon_blanket_bard`
GDD / Canonical Design ID: `mon_blanket_ghost` (Blanket Ghost)
Match Confidence: medium
```json
{
  "id": "mon_blanket_bard",
  "name": "Blanket Bard",
  "description": "Blanket Bard joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "caster",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_blanket_bard",
  "stats": {
    "hp": 54,
    "attack": 4,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_hex",
    "label": "Lullaby Hex",
    "description": "Blanket Bard prepares Lullaby Hex."
  },
  "behaviors": [
    "mana_hex"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_blanket_bard",
  "animations": {
    "idle": "anim_mon_blanket_bard_idle",
    "attack": "anim_mon_blanket_bard_attack",
    "hit": "anim_mon_blanket_bard_hit",
    "defeat": "anim_mon_blanket_bard_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_dream_drummer
Current Repo ID: `mon_dream_drummer`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_dream_drummer",
  "name": "Dream Drummer",
  "description": "Dream Drummer joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 3,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_dream_drummer",
  "stats": {
    "hp": 58,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_heavy_slam",
    "label": "Bedtime Boom",
    "description": "Dream Drummer prepares Bedtime Boom."
  },
  "behaviors": [
    "shake_board"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_dream_drummer",
  "animations": {
    "idle": "anim_mon_dream_drummer_idle",
    "attack": "anim_mon_dream_drummer_attack",
    "hit": "anim_mon_dream_drummer_hit",
    "defeat": "anim_mon_dream_drummer_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_snore_squire
Current Repo ID: `mon_snore_squire`
GDD / Canonical Design ID: `mon_toy_soldier` (Toy Soldier)
Match Confidence: low
```json
{
  "id": "mon_snore_squire",
  "name": "Snore Squire",
  "description": "Snore Squire joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 4,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_snore_squire",
  "stats": {
    "hp": 66,
    "attack": 6,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_guard",
    "label": "Nap Guard",
    "description": "Snore Squire prepares Nap Guard."
  },
  "behaviors": [
    "armor_up"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_snore_squire",
  "animations": {
    "idle": "anim_mon_snore_squire_idle",
    "attack": "anim_mon_snore_squire_attack",
    "hit": "anim_mon_snore_squire_hit",
    "defeat": "anim_mon_snore_squire_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_quilt_knight
Current Repo ID: `mon_quilt_knight`
GDD / Canonical Design ID: `mon_button_knight` (Button Knight)
Match Confidence: low
```json
{
  "id": "mon_quilt_knight",
  "name": "Quilt Knight",
  "description": "Quilt Knight joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_quilt_knight",
  "stats": {
    "hp": 72,
    "attack": 7,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_attack",
    "label": "Tucked Charge",
    "description": "Quilt Knight prepares Tucked Charge."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_quilt_knight",
  "animations": {
    "idle": "anim_mon_quilt_knight_idle",
    "attack": "anim_mon_quilt_knight_attack",
    "hit": "anim_mon_quilt_knight_hit",
    "defeat": "anim_mon_quilt_knight_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_crown_mime
Current Repo ID: `mon_crown_mime`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_crown_mime",
  "name": "Crown Mime",
  "description": "Crown Mime joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_crown_mime",
  "stats": {
    "hp": 78,
    "attack": 6,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_guard",
    "label": "Invisible Wall",
    "description": "Crown Mime prepares Invisible Wall."
  },
  "behaviors": [
    "reduce_line_damage"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_crown_mime",
  "animations": {
    "idle": "anim_mon_crown_mime_idle",
    "attack": "anim_mon_crown_mime_attack",
    "hit": "anim_mon_crown_mime_hit",
    "defeat": "anim_mon_crown_mime_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Stage 5 Starfall Arcade

### mon_arcade_spark
Current Repo ID: `mon_arcade_spark`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_arcade_spark",
  "name": "Arcade Spark",
  "description": "Arcade Spark joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 4,
  "role": "basic",
  "biome": "void",
  "spriteKey": "placeholder_arcade_spark",
  "stats": {
    "hp": 62,
    "attack": 6,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_attack",
    "label": "Pixel Zap",
    "description": "Arcade Spark prepares Pixel Zap."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_arcade_spark",
  "animations": {
    "idle": "anim_mon_arcade_spark_idle",
    "attack": "anim_mon_arcade_spark_attack",
    "hit": "anim_mon_arcade_spark_hit",
    "defeat": "anim_mon_arcade_spark_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_combo_crab
Current Repo ID: `mon_combo_crab`
GDD / Canonical Design ID: `mon_combo_gremlin` (Combo Gremlin)
Match Confidence: medium
```json
{
  "id": "mon_combo_crab",
  "name": "Combo Crab",
  "description": "Combo Crab joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "basic",
  "biome": "void",
  "spriteKey": "placeholder_combo_crab",
  "stats": {
    "hp": 70,
    "attack": 6,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_charge",
    "label": "Combo Pinch",
    "description": "Combo Crab prepares Combo Pinch."
  },
  "behaviors": [
    "increase_fall_speed"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_combo_crab",
  "animations": {
    "idle": "anim_mon_combo_crab_idle",
    "attack": "anim_mon_combo_crab_attack",
    "hit": "anim_mon_combo_crab_hit",
    "defeat": "anim_mon_combo_crab_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_ticket_tumbler
Current Repo ID: `mon_ticket_tumbler`
GDD / Canonical Design ID: `mon_token_sprite` (Token Sprite)
Match Confidence: medium
```json
{
  "id": "mon_ticket_tumbler",
  "name": "Ticket Tumbler",
  "description": "Ticket Tumbler joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 4,
  "role": "summoner",
  "biome": "void",
  "spriteKey": "placeholder_ticket_tumbler",
  "stats": {
    "hp": 64,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_throw_junk",
    "label": "Ticket Jam",
    "description": "Ticket Tumbler prepares Ticket Jam."
  },
  "behaviors": [
    "spawn_junk"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_ticket_tumbler",
  "animations": {
    "idle": "anim_mon_ticket_tumbler_idle",
    "attack": "anim_mon_ticket_tumbler_attack",
    "hit": "anim_mon_ticket_tumbler_hit",
    "defeat": "anim_mon_ticket_tumbler_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_joystick_jinxer
Current Repo ID: `mon_joystick_jinxer`
GDD / Canonical Design ID: `mon_joystick_jester` (Joystick Jester)
Match Confidence: high
```json
{
  "id": "mon_joystick_jinxer",
  "name": "Joystick Jinxer",
  "description": "Joystick Jinxer joins the festival dungeon with cheerful trouble.",
  "rarity": "uncommon",
  "tier": 4,
  "role": "caster",
  "biome": "void",
  "spriteKey": "placeholder_joystick_jinxer",
  "stats": {
    "hp": 66,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_hex",
    "label": "Button Jinx",
    "description": "Joystick Jinxer prepares Button Jinx."
  },
  "behaviors": [
    "mana_hex"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_joystick_jinxer",
  "animations": {
    "idle": "anim_mon_joystick_jinxer_idle",
    "attack": "anim_mon_joystick_jinxer_attack",
    "hit": "anim_mon_joystick_jinxer_hit",
    "defeat": "anim_mon_joystick_jinxer_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_score_specter
Current Repo ID: `mon_score_specter`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_score_specter",
  "name": "Score Specter",
  "description": "Score Specter joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "basic",
  "biome": "void",
  "spriteKey": "placeholder_score_specter",
  "stats": {
    "hp": 74,
    "attack": 7,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_screech",
    "label": "Screen Glitch",
    "description": "Score Specter prepares Screen Glitch."
  },
  "behaviors": [
    "hide_next_piece"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_score_specter",
  "animations": {
    "idle": "anim_mon_score_specter_idle",
    "attack": "anim_mon_score_specter_attack",
    "hit": "anim_mon_score_specter_hit",
    "defeat": "anim_mon_score_specter_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_witch
Current Repo ID: `mon_witch`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_witch",
  "name": "Dungeon Witch",
  "description": "A hex-casting foe that punishes spell-heavy runs with mana corruption.",
  "rarity": "rare",
  "tier": 2,
  "role": "caster",
  "biome": "void",
  "spriteKey": "placeholder_witch",
  "stats": {
    "hp": 55,
    "attack": 5,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_hex",
    "label": "Mana Hex",
    "description": "Temporarily increases spell costs."
  },
  "behaviors": [
    "mana_hex"
  ],
  "resistances": [
    "spell_damage"
  ],
  "weaknesses": [
    "line_damage"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 16,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "mid_game",
    "magical",
    "board_disruptor"
  ],
  "enabled": true,
  "iconKey": "ico_mon_witch",
  "animations": {
    "idle": "anim_mon_witch_idle",
    "attack": "anim_mon_witch_attack",
    "hit": "anim_mon_witch_hit",
    "defeat": "anim_mon_witch_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Stage 6 Bloxley's Block Palace

### mon_block_baron
Current Repo ID: `mon_block_baron`
GDD / Canonical Design ID: `mon_parade_golem` (Parade Golem)
Match Confidence: medium
```json
{
  "id": "mon_block_baron",
  "name": "Block Baron",
  "description": "Block Baron joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 5,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_block_baron",
  "stats": {
    "hp": 84,
    "attack": 8,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_heavy_slam",
    "label": "Baron Bash",
    "description": "Block Baron prepares Baron Bash."
  },
  "behaviors": [
    "shake_board"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_block_baron",
  "animations": {
    "idle": "anim_mon_block_baron_idle",
    "attack": "anim_mon_block_baron_attack",
    "hit": "anim_mon_block_baron_hit",
    "defeat": "anim_mon_block_baron_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_royal_page
Current Repo ID: `mon_royal_page`
GDD / Canonical Design ID: `mon_confetti_mage` (Confetti Mage)
Match Confidence: low
```json
{
  "id": "mon_royal_page",
  "name": "Royal Page",
  "description": "Royal Page joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "summoner",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_royal_page",
  "stats": {
    "hp": 76,
    "attack": 7,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_throw_junk",
    "label": "Royal Errand",
    "description": "Royal Page prepares Royal Errand."
  },
  "behaviors": [
    "spawn_junk"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_royal_page",
  "animations": {
    "idle": "anim_mon_royal_page_idle",
    "attack": "anim_mon_royal_page_attack",
    "hit": "anim_mon_royal_page_hit",
    "defeat": "anim_mon_royal_page_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_palace_jester
Current Repo ID: `mon_palace_jester`
GDD / Canonical Design ID: `mon_square_jester` (Square Jester)
Match Confidence: high
```json
{
  "id": "mon_palace_jester",
  "name": "Palace Jester",
  "description": "Palace Jester joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "caster",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_palace_jester",
  "stats": {
    "hp": 80,
    "attack": 7,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_hex",
    "label": "Royal Razzle",
    "description": "Palace Jester prepares Royal Razzle."
  },
  "behaviors": [
    "mana_hex"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_palace_jester",
  "animations": {
    "idle": "anim_mon_palace_jester_idle",
    "attack": "anim_mon_palace_jester_attack",
    "hit": "anim_mon_palace_jester_hit",
    "defeat": "anim_mon_palace_jester_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_crown_mime
Current Repo ID: `mon_crown_mime`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_crown_mime",
  "name": "Crown Mime",
  "description": "Crown Mime joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_crown_mime",
  "stats": {
    "hp": 78,
    "attack": 6,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_guard",
    "label": "Invisible Wall",
    "description": "Crown Mime prepares Invisible Wall."
  },
  "behaviors": [
    "reduce_line_damage"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_crown_mime",
  "animations": {
    "idle": "anim_mon_crown_mime_idle",
    "attack": "anim_mon_crown_mime_attack",
    "hit": "anim_mon_crown_mime_hit",
    "defeat": "anim_mon_crown_mime_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_quilt_knight
Current Repo ID: `mon_quilt_knight`
GDD / Canonical Design ID: `mon_button_knight` (Button Knight)
Match Confidence: low
```json
{
  "id": "mon_quilt_knight",
  "name": "Quilt Knight",
  "description": "Quilt Knight joins the festival dungeon with cheerful trouble.",
  "rarity": "rare",
  "tier": 4,
  "role": "basic",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_quilt_knight",
  "stats": {
    "hp": 72,
    "attack": 7,
    "armor": 0,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_attack",
    "label": "Tucked Charge",
    "description": "Quilt Knight prepares Tucked Charge."
  },
  "behaviors": [
    "basic_attack"
  ],
  "resistances": [],
  "weaknesses": [],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 28,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game"
  ],
  "enabled": true,
  "iconKey": "ico_mon_quilt_knight",
  "animations": {
    "idle": "anim_mon_quilt_knight_idle",
    "attack": "anim_mon_quilt_knight_attack",
    "hit": "anim_mon_quilt_knight_hit",
    "defeat": "anim_mon_quilt_knight_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_stone_golem
Current Repo ID: `mon_stone_golem`
GDD / Canonical Design ID: `mon_royal_block_guard` (Royal Block Guard)
Match Confidence: medium
```json
{
  "id": "mon_stone_golem",
  "name": "Stone Golem",
  "description": "A heavy guardian whose armor blunts ordinary line damage.",
  "rarity": "elite",
  "tier": 3,
  "role": "tank",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_stone_golem",
  "stats": {
    "hp": 75,
    "attack": 6,
    "armor": 2,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_guard",
    "label": "Stone Guard",
    "description": "Reduces line damage before striking back."
  },
  "behaviors": [
    "reduce_line_damage",
    "armor_up"
  ],
  "resistances": [
    "line_damage",
    "combo_damage"
  ],
  "weaknesses": [
    "void",
    "bomb"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 20,
    "goldMax": 35,
    "rewardRolls": 2,
    "lootTableId": "loot_elite_default"
  },
  "tags": [
    "mid_game",
    "large",
    "armored",
    "elite"
  ],
  "enabled": true,
  "iconKey": "ico_mon_stone_golem",
  "animations": {
    "idle": "anim_mon_stone_golem_idle",
    "attack": "anim_mon_stone_golem_attack",
    "hit": "anim_mon_stone_golem_hit",
    "defeat": "anim_mon_stone_golem_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Bosses

### mon_boss_king_bloxley
Current Repo ID: `mon_boss_king_bloxley`
GDD / Canonical Design ID: `boss_king_bloxley` (King Bloxley)
Match Confidence: high
```json
{
  "id": "mon_boss_king_bloxley",
  "name": "King Bloxley",
  "description": "King Bloxley rules a festival stage with loud, silly confidence.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_king_bloxley",
  "stats": {
    "hp": 250,
    "attack": 13,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Royal Collapse",
    "description": "King Bloxley prepares Royal Collapse."
  },
  "behaviors": [
    "royal_block_spawn",
    "swap_next_hold"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 10,
    "attackPerStage": 1,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 40,
    "goldMax": 75,
    "rewardRolls": 2,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "boss_phase"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_king_bloxley",
  "animations": {
    "idle": "anim_boss_king_bloxley_idle",
    "attack": "anim_boss_king_bloxley_attack",
    "hit": "anim_boss_king_bloxley_hit",
    "phase_change": "anim_boss_king_bloxley_phase_change",
    "special_attack": "anim_boss_king_bloxley_special_attack",
    "defeat": "anim_boss_king_bloxley_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_boss_gelato_golem
Current Repo ID: `mon_boss_gelato_golem`
GDD / Canonical Design ID: `boss_gelato_golem` (Gelato Golem)
Match Confidence: high
```json
{
  "id": "mon_boss_gelato_golem",
  "name": "Gelato Golem",
  "description": "Gelato Golem rules a festival stage with loud, silly confidence.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_gelato_golem",
  "stats": {
    "hp": 185,
    "attack": 11,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Frozen Scoop",
    "description": "Gelato Golem prepares Frozen Scoop."
  },
  "behaviors": [
    "freeze_piece",
    "hide_next_block"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 10,
    "attackPerStage": 1,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 40,
    "goldMax": 75,
    "rewardRolls": 2,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "boss_phase"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_gelato_golem",
  "animations": {
    "idle": "anim_boss_gelato_golem_idle",
    "attack": "anim_boss_gelato_golem_attack",
    "hit": "anim_boss_gelato_golem_hit",
    "phase_change": "anim_boss_gelato_golem_phase_change",
    "special_attack": "anim_boss_gelato_golem_special_attack",
    "defeat": "anim_boss_gelato_golem_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_boss_prototype_no_7
Current Repo ID: `mon_boss_prototype_no_7`
GDD / Canonical Design ID: `boss_prototype_no_7` (Prototype No. 7)
Match Confidence: high
```json
{
  "id": "mon_boss_prototype_no_7",
  "name": "Prototype No. 7",
  "description": "Prototype No. 7 rules a festival stage with loud, silly confidence.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_prototype_no_7",
  "stats": {
    "hp": 170,
    "attack": 10,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Workshop Whirr",
    "description": "Prototype No. 7 prepares Workshop Whirr."
  },
  "behaviors": [
    "shake_board",
    "pattern_junk"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 10,
    "attackPerStage": 1,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 40,
    "goldMax": 75,
    "rewardRolls": 2,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "boss_phase"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_prototype_no_7",
  "animations": {
    "idle": "anim_boss_prototype_no_7_idle",
    "attack": "anim_boss_prototype_no_7_attack",
    "hit": "anim_boss_prototype_no_7_hit",
    "phase_change": "anim_boss_prototype_no_7_phase_change",
    "special_attack": "anim_boss_prototype_no_7_special_attack",
    "defeat": "anim_boss_prototype_no_7_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_boss_sir_snore_a_lot
Current Repo ID: `mon_boss_sir_snore_a_lot`
GDD / Canonical Design ID: `boss_sir_snore_a_lot` (Sir Snore-a-Lot)
Match Confidence: high
```json
{
  "id": "mon_boss_sir_snore_a_lot",
  "name": "Sir Snore-a-Lot",
  "description": "Sir Snore-a-Lot rules a festival stage with loud, silly confidence.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_sir_snore_a_lot",
  "stats": {
    "hp": 200,
    "attack": 10,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Sleepy Shield",
    "description": "Sir Snore-a-Lot prepares Sleepy Shield."
  },
  "behaviors": [
    "armor_up",
    "sleep_player"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 10,
    "attackPerStage": 1,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 40,
    "goldMax": 75,
    "rewardRolls": 2,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "boss_phase"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_sir_snore_a_lot",
  "animations": {
    "idle": "anim_boss_sir_snore_a_lot_idle",
    "attack": "anim_boss_sir_snore_a_lot_attack",
    "hit": "anim_boss_sir_snore_a_lot_hit",
    "phase_change": "anim_boss_sir_snore_a_lot_phase_change",
    "special_attack": "anim_boss_sir_snore_a_lot_special_attack",
    "defeat": "anim_boss_sir_snore_a_lot_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_boss_cupcake_slime_king
Current Repo ID: `mon_boss_cupcake_slime_king`
GDD / Canonical Design ID: `boss_cupcake_slime_king` (Cupcake Slime King)
Match Confidence: high
```json
{
  "id": "mon_boss_cupcake_slime_king",
  "name": "Cupcake Slime King",
  "description": "Cupcake Slime King rules a festival stage with loud, silly confidence.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_cupcake_slime_king",
  "stats": {
    "hp": 150,
    "attack": 9,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Sticky Crown",
    "description": "Cupcake Slime King prepares Sticky Crown."
  },
  "behaviors": [
    "spawn_junk",
    "hide_hold_block"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 10,
    "attackPerStage": 1,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 40,
    "goldMax": 75,
    "rewardRolls": 2,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "boss_phase"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_cupcake_slime_king",
  "animations": {
    "idle": "anim_boss_cupcake_slime_king_idle",
    "attack": "anim_boss_cupcake_slime_king_attack",
    "hit": "anim_boss_cupcake_slime_king_hit",
    "phase_change": "anim_boss_cupcake_slime_king_phase_change",
    "special_attack": "anim_boss_cupcake_slime_king_special_attack",
    "defeat": "anim_boss_cupcake_slime_king_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_boss_high_score_hydra
Current Repo ID: `mon_boss_high_score_hydra`
GDD / Canonical Design ID: `boss_high_score_hydra` (High Score Hydra)
Match Confidence: high
```json
{
  "id": "mon_boss_high_score_hydra",
  "name": "High Score Hydra",
  "description": "High Score Hydra rules a festival stage with loud, silly confidence.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_high_score_hydra",
  "stats": {
    "hp": 220,
    "attack": 12,
    "armor": 1,
    "attackIntervalLocks": 3
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Combo Challenge",
    "description": "High Score Hydra prepares Combo Challenge."
  },
  "behaviors": [
    "hydra_combo_check",
    "increase_fall_speed",
    "reverse_controls"
  ],
  "resistances": [],
  "weaknesses": [
    "combo_damage"
  ],
  "scaling": {
    "hpPerStage": 10,
    "attackPerStage": 1,
    "fallSpeedModifier": 0.02
  },
  "rewards": {
    "goldMin": 40,
    "goldMax": 75,
    "rewardRolls": 2,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "boss_phase"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_high_score_hydra",
  "animations": {
    "idle": "anim_boss_high_score_hydra_idle",
    "attack": "anim_boss_high_score_hydra_attack",
    "hit": "anim_boss_high_score_hydra_hit",
    "phase_change": "anim_boss_high_score_hydra_phase_change",
    "special_attack": "anim_boss_high_score_hydra_special_attack",
    "defeat": "anim_boss_high_score_hydra_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```


## Unassigned Or Legacy

### mon_bat
Current Repo ID: `mon_bat`
GDD / Canonical Design ID: `mon_sugar_bat` (Sugar Bat)
Match Confidence: high
```json
{
  "id": "mon_bat",
  "name": "Blind Bat",
  "description": "A shrieking cave flier that obscures the next piece preview.",
  "rarity": "common",
  "tier": 1,
  "role": "disruptor",
  "biome": "crypt",
  "spriteKey": "placeholder_bat",
  "stats": {
    "hp": 25,
    "attack": 3,
    "armor": 0,
    "attackIntervalLocks": 4
  },
  "intent": {
    "id": "intent_screech",
    "label": "Blind Screech",
    "description": "Hides preview information for a short time."
  },
  "behaviors": [
    "hide_next_piece"
  ],
  "resistances": [
    "gravity"
  ],
  "weaknesses": [
    "lightning"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0
  },
  "rewards": {
    "goldMin": 10,
    "goldMax": 18,
    "rewardRolls": 1,
    "lootTableId": "loot_battle_default"
  },
  "tags": [
    "early_game",
    "small",
    "flying",
    "board_disruptor"
  ],
  "enabled": true,
  "iconKey": "ico_mon_bat",
  "animations": {
    "idle": "anim_mon_bat_idle",
    "attack": "anim_mon_bat_attack",
    "hit": "anim_mon_bat_hit",
    "defeat": "anim_mon_bat_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

### mon_boss_falling_king
Current Repo ID: `mon_boss_falling_king`
GDD / Canonical Design ID: No safe GDD mapping
Match Confidence: none
```json
{
  "id": "mon_boss_falling_king",
  "name": "Falling King",
  "description": "The dungeon sovereign who accelerates the battlefield into collapse.",
  "rarity": "boss",
  "tier": 5,
  "role": "boss",
  "biome": "royal_ruins",
  "spriteKey": "placeholder_falling_king",
  "stats": {
    "hp": 160,
    "attack": 10,
    "armor": 2,
    "attackIntervalLocks": 2
  },
  "intent": {
    "id": "intent_royal_collapse",
    "label": "Royal Collapse",
    "description": "Raises fall speed, shakes the board, and spawns junk."
  },
  "behaviors": [
    "increase_fall_speed",
    "spawn_junk",
    "shake_board"
  ],
  "resistances": [
    "line_damage",
    "spell_damage"
  ],
  "weaknesses": [
    "void"
  ],
  "scaling": {
    "hpPerStage": 8,
    "attackPerStage": 0.5,
    "fallSpeedModifier": 0.1
  },
  "rewards": {
    "goldMin": 50,
    "goldMax": 80,
    "rewardRolls": 3,
    "lootTableId": "loot_boss_default"
  },
  "tags": [
    "late_game",
    "large",
    "boss_phase",
    "speed_scaler",
    "junk_spawner"
  ],
  "enabled": true,
  "iconKey": "ico_mon_boss_falling_king",
  "animations": {
    "idle": "anim_boss_falling_king_idle",
    "attack": "anim_boss_falling_king_attack",
    "hit": "anim_boss_falling_king_hit",
    "phase_change": "anim_boss_falling_king_phase_change",
    "special_attack": "anim_boss_falling_king_special_attack",
    "defeat": "anim_boss_falling_king_defeat"
  },
  "hitVfxKey": "anim_vfx_enemy_hit"
}
```

