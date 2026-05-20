# Monster Roster Alignment Report

## Summary
- Current repo monster JSON count: 42
- Current repo regular monster count: 35
- Current repo boss count: 7
- Unique regular monster IDs currently used in stage pools: 34
- Unassigned regular monsters: `mon_bat`
- Extra boss monsters not assigned as a stage boss: `mon_boss_falling_king`
- Safe remediation added in this pass: metadata-driven monster ID aliases plus `ContentRegistry` monster alias resolution; no existing monster ID was renamed or deleted.

## 1. Current Repo Monster Inventory

### mon_arcade_spark
- Filename: `arcade_spark.json`
- ID: `mon_arcade_spark`
- Name: Arcade Spark
- Enabled: true
- Rarity: uncommon
- Tier: 4
- Role: basic
- Biome: void
- Stats: hp 62, attack 6, armor 0, attackIntervalLocks 4
- Intent: intent_attack / Pixel Zap / Arcade Spark prepares Pixel Zap.
- Behaviors: basic_attack
- SpriteKey: placeholder_arcade_spark
- IconKey: ico_mon_arcade_spark
- Animation Keys: idle=anim_mon_arcade_spark_idle, attack=anim_mon_arcade_spark_attack, hit=anim_mon_arcade_spark_hit, defeat=anim_mon_arcade_spark_defeat
- Classification: regular
- Current Stage Usage: Starfall Arcade
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:481`
  - `scripts/complete-phase1-5-content.mjs:111`
  - `src/game/content/monsters/arcade_spark.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/starfall-arcade.json:7`

### mon_bat
- Filename: `bat.json`
- ID: `mon_bat`
- Name: Blind Bat
- Enabled: true
- Rarity: common
- Tier: 1
- Role: disruptor
- Biome: crypt
- Stats: hp 25, attack 3, armor 0, attackIntervalLocks 4
- Intent: intent_screech / Blind Screech / Hides preview information for a short time.
- Behaviors: hide_next_piece
- SpriteKey: placeholder_bat
- IconKey: ico_mon_bat
- Animation Keys: idle=anim_mon_bat_idle, attack=anim_mon_bat_attack, hit=anim_mon_bat_hit, defeat=anim_mon_bat_defeat
- Classification: regular
- Current Stage Usage: Unassigned
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:482`
  - `src/game/content/monsters/bat.json:2,9,48,50,51,52,53`
  - `src/game/content/monsters/metadata.json:12,375`

### mon_blanket_bard
- Filename: `blanket_bard.json`
- ID: `mon_blanket_bard`
- Name: Blanket Bard
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: caster
- Biome: royal_ruins
- Stats: hp 54, attack 4, armor 0, attackIntervalLocks 4
- Intent: intent_hex / Lullaby Hex / Blanket Bard prepares Lullaby Hex.
- Behaviors: mana_hex
- SpriteKey: placeholder_blanket_bard
- IconKey: ico_mon_blanket_bard
- Animation Keys: idle=anim_mon_blanket_bard_idle, attack=anim_mon_blanket_bard_attack, hit=anim_mon_blanket_bard_hit, defeat=anim_mon_blanket_bard_defeat
- Classification: regular
- Current Stage Usage: Pillow Castle
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:483`
  - `src/game/content/friendship/blanket-ghost.json:1`
  - `src/game/content/monsters/blanket_bard.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/pillow-castle.json:8`

### mon_block_baron
- Filename: `block_baron.json`
- ID: `mon_block_baron`
- Name: Block Baron
- Enabled: true
- Rarity: rare
- Tier: 5
- Role: basic
- Biome: royal_ruins
- Stats: hp 84, attack 8, armor 0, attackIntervalLocks 3
- Intent: intent_heavy_slam / Baron Bash / Block Baron prepares Baron Bash.
- Behaviors: shake_board
- SpriteKey: placeholder_block_baron
- IconKey: ico_mon_block_baron
- Animation Keys: idle=anim_mon_block_baron_idle, attack=anim_mon_block_baron_attack, hit=anim_mon_block_baron_hit, defeat=anim_mon_block_baron_defeat
- Classification: regular
- Current Stage Usage: Bloxley's Block Palace
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:484`
  - `src/game/content/monsters/block_baron.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/bloxley-block-palace.json:7`

### mon_bolt_beetle
- Filename: `bolt_beetle.json`
- ID: `mon_bolt_beetle`
- Name: Bolt Beetle
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: basic
- Biome: royal_ruins
- Stats: hp 50, attack 4, armor 1, attackIntervalLocks 4
- Intent: intent_guard / Shell Guard / Bolt Beetle prepares Shell Guard.
- Behaviors: reduce_line_damage
- SpriteKey: placeholder_bolt_beetle
- IconKey: ico_mon_bolt_beetle
- Animation Keys: idle=anim_mon_bolt_beetle_idle, attack=anim_mon_bolt_beetle_attack, hit=anim_mon_bolt_beetle_hit, defeat=anim_mon_bolt_beetle_defeat
- Classification: regular
- Current Stage Usage: Goblin Workshop
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:485`
  - `src/game/content/monsters/bolt_beetle.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/goblin-workshop.json:6`

### mon_boss_cupcake_slime_king
- Filename: `boss-cupcake_slime_king.json`
- ID: `mon_boss_cupcake_slime_king`
- Name: Cupcake Slime King
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 150, attack 9, armor 1, attackIntervalLocks 3
- Intent: intent_royal_collapse / Sticky Crown / Cupcake Slime King prepares Sticky Crown.
- Behaviors: spawn_junk, hide_hold_block
- SpriteKey: placeholder_cupcake_slime_king
- IconKey: ico_mon_boss_cupcake_slime_king
- Animation Keys: idle=anim_boss_cupcake_slime_king_idle, attack=anim_boss_cupcake_slime_king_attack, hit=anim_boss_cupcake_slime_king_hit, phase_change=anim_boss_cupcake_slime_king_phase_change, special_attack=anim_boss_cupcake_slime_king_special_attack, defeat=anim_boss_cupcake_slime_king_defeat
- Classification: boss
- Current Stage Usage: Sprinkle Sewers Boss
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:486`
  - `src/game/content/boss-rules/cupcake-slime-king.json:1`
  - `src/game/content/monsters/boss-cupcake_slime_king.json:2,9,44,46,47,48,49,50,51`
  - `src/game/content/monsters/metadata.json:383`
  - `src/game/content/stage-goals/stage1-lost-cupcakes.json:1`
  - `src/game/content/stages/sprinkle-sewers.json:7`
  - `src/game/data/assets.ts:481`
  - `src/game/systems/BossSystem.ts:23,99,137`
  - `src/game/systems/StorySystem.ts:81`

### mon_boss_gelato_golem
- Filename: `boss-gelato_golem.json`
- ID: `mon_boss_gelato_golem`
- Name: Gelato Golem
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 185, attack 11, armor 1, attackIntervalLocks 3
- Intent: intent_royal_collapse / Frozen Scoop / Gelato Golem prepares Frozen Scoop.
- Behaviors: freeze_piece, hide_next_block
- SpriteKey: placeholder_gelato_golem
- IconKey: ico_mon_boss_gelato_golem
- Animation Keys: idle=anim_boss_gelato_golem_idle, attack=anim_boss_gelato_golem_attack, hit=anim_boss_gelato_golem_hit, phase_change=anim_boss_gelato_golem_phase_change, special_attack=anim_boss_gelato_golem_special_attack, defeat=anim_boss_gelato_golem_defeat
- Classification: boss
- Current Stage Usage: Frosty Pantry Boss
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:488`
  - `scripts/complete-phase1-5-content.mjs:99`
  - `src/game/content/boss-rules/gelato-golem.json:1`
  - `src/game/content/monsters/boss-gelato_golem.json:2,9,44,46,47,48,49,50,51`
  - `src/game/content/monsters/metadata.json:385`
  - `src/game/content/stages/frosty-pantry.json:14`
  - `src/game/data/assets.ts:485`
  - `src/game/systems/BossSystem.ts:37,109,143`
  - `src/game/systems/StorySystem.ts:89`

### mon_boss_high_score_hydra
- Filename: `boss-high_score_hydra.json`
- ID: `mon_boss_high_score_hydra`
- Name: High Score Hydra
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 220, attack 12, armor 1, attackIntervalLocks 3
- Intent: intent_royal_collapse / Combo Challenge / High Score Hydra prepares Combo Challenge.
- Behaviors: hydra_combo_check, increase_fall_speed, reverse_controls
- SpriteKey: placeholder_high_score_hydra
- IconKey: ico_mon_boss_high_score_hydra
- Animation Keys: idle=anim_boss_high_score_hydra_idle, attack=anim_boss_high_score_hydra_attack, hit=anim_boss_high_score_hydra_hit, phase_change=anim_boss_high_score_hydra_phase_change, special_attack=anim_boss_high_score_hydra_special_attack, defeat=anim_boss_high_score_hydra_defeat
- Classification: boss
- Current Stage Usage: Starfall Arcade Boss
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:489`
  - `scripts/complete-phase1-5-content.mjs:101`
  - `src/game/content/boss-rules/high-score-hydra.json:1`
  - `src/game/content/monsters/boss-high_score_hydra.json:2,9,45,47,48,49,50,51,52`
  - `src/game/content/monsters/metadata.json:387`
  - `src/game/content/stages/starfall-arcade.json:14`
  - `src/game/data/assets.ts:489`
  - `src/game/systems/BossSystem.ts:51,119,151`
  - `src/game/systems/CombatSystem.ts:112`
  - `src/game/systems/FeverSystem.ts:75`
  - `src/game/systems/StorySystem.ts:97`

### mon_boss_king_bloxley
- Filename: `boss-king_bloxley.json`
- ID: `mon_boss_king_bloxley`
- Name: King Bloxley
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 250, attack 13, armor 1, attackIntervalLocks 3
- Intent: intent_royal_collapse / Royal Collapse / King Bloxley prepares Royal Collapse.
- Behaviors: royal_block_spawn, swap_next_hold
- SpriteKey: placeholder_king_bloxley
- IconKey: ico_mon_boss_king_bloxley
- Animation Keys: idle=anim_boss_king_bloxley_idle, attack=anim_boss_king_bloxley_attack, hit=anim_boss_king_bloxley_hit, phase_change=anim_boss_king_bloxley_phase_change, special_attack=anim_boss_king_bloxley_special_attack, defeat=anim_boss_king_bloxley_defeat
- Classification: boss
- Current Stage Usage: Bloxley's Block Palace Boss
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:490`
  - `scripts/complete-phase1-5-content.mjs:102`
  - `src/game/content/boss-rules/king-bloxley.json:1`
  - `src/game/content/monsters/boss-king_bloxley.json:2,9,44,46,47,48,49,50,51`
  - `src/game/content/monsters/metadata.json:388`
  - `src/game/content/stages/bloxley-block-palace.json:14`
  - `src/game/data/assets.ts:491`
  - `src/game/systems/BoardSizeModifierSystem.ts:50`
  - `src/game/systems/BossSystem.ts:58,122,154`
  - `src/game/systems/StorySystem.ts:101`

### mon_boss_prototype_no_7
- Filename: `boss-prototype_no_7.json`
- ID: `mon_boss_prototype_no_7`
- Name: Prototype No. 7
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 170, attack 10, armor 1, attackIntervalLocks 3
- Intent: intent_royal_collapse / Workshop Whirr / Prototype No. 7 prepares Workshop Whirr.
- Behaviors: shake_board, pattern_junk
- SpriteKey: placeholder_prototype_no_7
- IconKey: ico_mon_boss_prototype_no_7
- Animation Keys: idle=anim_boss_prototype_no_7_idle, attack=anim_boss_prototype_no_7_attack, hit=anim_boss_prototype_no_7_hit, phase_change=anim_boss_prototype_no_7_phase_change, special_attack=anim_boss_prototype_no_7_special_attack, defeat=anim_boss_prototype_no_7_defeat
- Classification: boss
- Current Stage Usage: Goblin Workshop Boss
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:491`
  - `src/game/content/boss-rules/prototype-no-7.json:1`
  - `src/game/content/monsters/boss-prototype_no_7.json:2,9,44,46,47,48,49,50,51`
  - `src/game/content/monsters/metadata.json:384`
  - `src/game/content/stages/goblin-workshop.json:7`
  - `src/game/data/assets.ts:483`
  - `src/game/systems/BossSystem.ts:30,104,140`
  - `src/game/systems/StorySystem.ts:85`

### mon_boss_sir_snore_a_lot
- Filename: `boss-sir_snore_a_lot.json`
- ID: `mon_boss_sir_snore_a_lot`
- Name: Sir Snore-a-Lot
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 200, attack 10, armor 1, attackIntervalLocks 3
- Intent: intent_royal_collapse / Sleepy Shield / Sir Snore-a-Lot prepares Sleepy Shield.
- Behaviors: armor_up, sleep_player
- SpriteKey: placeholder_sir_snore_a_lot
- IconKey: ico_mon_boss_sir_snore_a_lot
- Animation Keys: idle=anim_boss_sir_snore_a_lot_idle, attack=anim_boss_sir_snore_a_lot_attack, hit=anim_boss_sir_snore_a_lot_hit, phase_change=anim_boss_sir_snore_a_lot_phase_change, special_attack=anim_boss_sir_snore_a_lot_special_attack, defeat=anim_boss_sir_snore_a_lot_defeat
- Classification: boss
- Current Stage Usage: Pillow Castle Boss
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:492`
  - `scripts/complete-phase1-5-content.mjs:100`
  - `src/game/content/boss-rules/sir-snore-a-lot.json:1`
  - `src/game/content/monsters/boss-sir_snore_a_lot.json:2,9,44,46,47,48,49,50,51`
  - `src/game/content/monsters/metadata.json:386`
  - `src/game/content/stages/pillow-castle.json:14`
  - `src/game/data/assets.ts:487`
  - `src/game/systems/BossSystem.ts:44,114,147`
  - `src/game/systems/StorySystem.ts:93`

### mon_bubble_bat
- Filename: `bubble_bat.json`
- ID: `mon_bubble_bat`
- Name: Bubble Bat
- Enabled: true
- Rarity: common
- Tier: 2
- Role: basic
- Biome: dungeon
- Stats: hp 30, attack 3, armor 0, attackIntervalLocks 4
- Intent: intent_screech / Bubble Blind / Bubble Bat prepares Bubble Blind.
- Behaviors: hide_next_piece
- SpriteKey: placeholder_bubble_bat
- IconKey: ico_mon_bubble_bat
- Animation Keys: idle=anim_mon_bubble_bat_idle, attack=anim_mon_bubble_bat_attack, hit=anim_mon_bubble_bat_hit, defeat=anim_mon_bubble_bat_defeat
- Classification: regular
- Current Stage Usage: Frosty Pantry
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:493`
  - `src/game/content/friendship/sugar-bat.json:1`
  - `src/game/content/monsters/bubble_bat.json:2,9,41,43,44,45,46`
  - `src/game/content/monsters/metadata.json:377`
  - `src/game/content/stages/frosty-pantry.json:12`

### mon_chilly_churro
- Filename: `chilly_churro.json`
- ID: `mon_chilly_churro`
- Name: Chilly Churro
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: caster
- Biome: ice_cave
- Stats: hp 50, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_hex / Sugar Chill / Chilly Churro prepares Sugar Chill.
- Behaviors: mana_hex
- SpriteKey: placeholder_chilly_churro
- IconKey: ico_mon_chilly_churro
- Animation Keys: idle=anim_mon_chilly_churro_idle, attack=anim_mon_chilly_churro_attack, hit=anim_mon_chilly_churro_hit, defeat=anim_mon_chilly_churro_defeat
- Classification: regular
- Current Stage Usage: Frosty Pantry
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:494`
  - `src/game/content/monsters/chilly_churro.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/frosty-pantry.json:8`

### mon_combo_crab
- Filename: `combo_crab.json`
- ID: `mon_combo_crab`
- Name: Combo Crab
- Enabled: true
- Rarity: rare
- Tier: 4
- Role: basic
- Biome: void
- Stats: hp 70, attack 6, armor 0, attackIntervalLocks 3
- Intent: intent_charge / Combo Pinch / Combo Crab prepares Combo Pinch.
- Behaviors: increase_fall_speed
- SpriteKey: placeholder_combo_crab
- IconKey: ico_mon_combo_crab
- Animation Keys: idle=anim_mon_combo_crab_idle, attack=anim_mon_combo_crab_attack, hit=anim_mon_combo_crab_hit, defeat=anim_mon_combo_crab_defeat
- Classification: regular
- Current Stage Usage: Starfall Arcade
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:495`
  - `src/game/content/friendship/combo-gremlin.json:1`
  - `src/game/content/monsters/combo_crab.json:2,9,41,43,44,45,46`
  - `src/game/content/monsters/metadata.json:380`
  - `src/game/content/stages/starfall-arcade.json:8`

### mon_crown_mime
- Filename: `crown_mime.json`
- ID: `mon_crown_mime`
- Name: Crown Mime
- Enabled: true
- Rarity: rare
- Tier: 4
- Role: basic
- Biome: royal_ruins
- Stats: hp 78, attack 6, armor 1, attackIntervalLocks 3
- Intent: intent_guard / Invisible Wall / Crown Mime prepares Invisible Wall.
- Behaviors: reduce_line_damage
- SpriteKey: placeholder_crown_mime
- IconKey: ico_mon_crown_mime
- Animation Keys: idle=anim_mon_crown_mime_idle, attack=anim_mon_crown_mime_attack, hit=anim_mon_crown_mime_hit, defeat=anim_mon_crown_mime_defeat
- Classification: regular
- Current Stage Usage: Bloxley's Block Palace, Pillow Castle
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:496`
  - `src/game/content/monsters/crown_mime.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/bloxley-block-palace.json:10`
  - `src/game/content/stages/pillow-castle.json:12`

### mon_cupcake_imp
- Filename: `cupcake_imp.json`
- ID: `mon_cupcake_imp`
- Name: Cupcake Imp
- Enabled: true
- Rarity: common
- Tier: 2
- Role: summoner
- Biome: dungeon
- Stats: hp 38, attack 4, armor 0, attackIntervalLocks 4
- Intent: intent_throw_junk / Crumb Toss / Cupcake Imp prepares Crumb Toss.
- Behaviors: spawn_junk
- SpriteKey: placeholder_cupcake_imp
- IconKey: ico_mon_cupcake_imp
- Animation Keys: idle=anim_mon_cupcake_imp_idle, attack=anim_mon_cupcake_imp_attack, hit=anim_mon_cupcake_imp_hit, defeat=anim_mon_cupcake_imp_defeat
- Classification: regular
- Current Stage Usage: Sprinkle Sewers
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:497`
  - `src/game/content/monsters/cupcake_imp.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/sprinkle-sewers.json:6`

### mon_dream_drummer
- Filename: `dream_drummer.json`
- ID: `mon_dream_drummer`
- Name: Dream Drummer
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: basic
- Biome: royal_ruins
- Stats: hp 58, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_heavy_slam / Bedtime Boom / Dream Drummer prepares Bedtime Boom.
- Behaviors: shake_board
- SpriteKey: placeholder_dream_drummer
- IconKey: ico_mon_dream_drummer
- Animation Keys: idle=anim_mon_dream_drummer_idle, attack=anim_mon_dream_drummer_attack, hit=anim_mon_dream_drummer_hit, defeat=anim_mon_dream_drummer_defeat
- Classification: regular
- Current Stage Usage: Pillow Castle
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:498`
  - `src/game/content/monsters/dream_drummer.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/pillow-castle.json:9`

### mon_elite_knight
- Filename: `elite-knight.json`
- ID: `mon_elite_knight`
- Name: Elite Knight
- Enabled: true
- Rarity: elite
- Tier: 4
- Role: elite
- Biome: royal_ruins
- Stats: hp 95, attack 8, armor 1, attackIntervalLocks 3
- Intent: intent_heavy_slam / Heavy Slam / Deals extra damage and adds junk pressure.
- Behaviors: basic_attack, spawn_junk, shake_board
- SpriteKey: placeholder_elite_knight
- IconKey: ico_mon_elite_knight
- Animation Keys: idle=anim_mon_elite_knight_idle, attack=anim_mon_elite_knight_attack, hit=anim_mon_elite_knight_hit, defeat=anim_mon_elite_knight_defeat
- Classification: regular
- Current Stage Usage: Goblin Workshop
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:501`
  - `src/game/content/monsters/elite-knight.json:2,9,52,54,55,56,57`
  - `src/game/content/monsters/metadata.json:14`
  - `src/game/content/stages/goblin-workshop.json:6`

### mon_boss_falling_king
- Filename: `falling-king.json`
- ID: `mon_boss_falling_king`
- Name: Falling King
- Enabled: true
- Rarity: boss
- Tier: 5
- Role: boss
- Biome: royal_ruins
- Stats: hp 160, attack 10, armor 2, attackIntervalLocks 2
- Intent: intent_royal_collapse / Royal Collapse / Raises fall speed, shakes the board, and spawns junk.
- Behaviors: increase_fall_speed, spawn_junk, shake_board
- SpriteKey: placeholder_falling_king
- IconKey: ico_mon_boss_falling_king
- Animation Keys: idle=anim_boss_falling_king_idle, attack=anim_boss_falling_king_attack, hit=anim_boss_falling_king_hit, phase_change=anim_boss_falling_king_phase_change, special_attack=anim_boss_falling_king_special_attack, defeat=anim_boss_falling_king_defeat
- Classification: boss
- Current Stage Usage: Legacy boss fallback only
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:487`
  - `src/game/content/map-nodes/boss.json:11`
  - `src/game/content/monsters/falling-king.json:2,9,52,54,55,56,57,58,59`
  - `src/game/content/monsters/metadata.json:15`

### mon_frosting_fox
- Filename: `frosting_fox.json`
- ID: `mon_frosting_fox`
- Name: Frosting Fox
- Enabled: true
- Rarity: common
- Tier: 3
- Role: basic
- Biome: ice_cave
- Stats: hp 48, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_attack / Cold Snap / Frosting Fox prepares Cold Snap.
- Behaviors: basic_attack
- SpriteKey: placeholder_frosting_fox
- IconKey: ico_mon_frosting_fox
- Animation Keys: idle=anim_mon_frosting_fox_idle, attack=anim_mon_frosting_fox_attack, hit=anim_mon_frosting_fox_hit, defeat=anim_mon_frosting_fox_defeat
- Classification: regular
- Current Stage Usage: Frosty Pantry
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:502`
  - `src/game/content/monsters/frosting_fox.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/frosty-pantry.json:7`

### mon_gadget_goblin
- Filename: `gadget_goblin.json`
- ID: `mon_gadget_goblin`
- Name: Gadget Goblin
- Enabled: true
- Rarity: common
- Tier: 3
- Role: summoner
- Biome: royal_ruins
- Stats: hp 46, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_throw_junk / Loose Screws / Gadget Goblin prepares Loose Screws.
- Behaviors: spawn_junk
- SpriteKey: placeholder_gadget_goblin
- IconKey: ico_mon_gadget_goblin
- Animation Keys: idle=anim_mon_gadget_goblin_idle, attack=anim_mon_gadget_goblin_attack, hit=anim_mon_gadget_goblin_hit, defeat=anim_mon_gadget_goblin_defeat
- Classification: regular
- Current Stage Usage: Goblin Workshop
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:503`
  - `scripts/complete-phase1-5-content.mjs:111`
  - `src/game/content/friendship/button-masher.json:1`
  - `src/game/content/monsters/gadget_goblin.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/goblin-workshop.json:6`

### mon_gear_gremlin
- Filename: `gear_gremlin.json`
- ID: `mon_gear_gremlin`
- Name: Gear Gremlin
- Enabled: true
- Rarity: common
- Tier: 3
- Role: summoner
- Biome: royal_ruins
- Stats: hp 44, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_summon / Gear Scatter / Gear Gremlin prepares Gear Scatter.
- Behaviors: spawn_junk
- SpriteKey: placeholder_gear_gremlin
- IconKey: ico_mon_gear_gremlin
- Animation Keys: idle=anim_mon_gear_gremlin_idle, attack=anim_mon_gear_gremlin_attack, hit=anim_mon_gear_gremlin_hit, defeat=anim_mon_gear_gremlin_defeat
- Classification: regular
- Current Stage Usage: Goblin Workshop
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:504`
  - `src/game/content/monsters/gear_gremlin.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/goblin-workshop.json:6`

### mon_gelato_blob
- Filename: `gelato_blob.json`
- ID: `mon_gelato_blob`
- Name: Gelato Blob
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: basic
- Biome: ice_cave
- Stats: hp 56, attack 4, armor 1, attackIntervalLocks 4
- Intent: intent_guard / Gelato Guard / Gelato Blob prepares Gelato Guard.
- Behaviors: reduce_line_damage
- SpriteKey: placeholder_gelato_blob
- IconKey: ico_mon_gelato_blob
- Animation Keys: idle=anim_mon_gelato_blob_idle, attack=anim_mon_gelato_blob_attack, hit=anim_mon_gelato_blob_hit, defeat=anim_mon_gelato_blob_defeat
- Classification: regular
- Current Stage Usage: Frosty Pantry
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:505`
  - `src/game/content/friendship/ice-cream-imp.json:1`
  - `src/game/content/monsters/gelato_blob.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/frosty-pantry.json:9`

### mon_dungeon_goblin
- Filename: `goblin.json`
- ID: `mon_dungeon_goblin`
- Name: Dungeon Goblin
- Enabled: true
- Rarity: common
- Tier: 1
- Role: disruptor
- Biome: dungeon
- Stats: hp 45, attack 4, armor 0, attackIntervalLocks 4
- Intent: intent_throw_junk / Throw Junk / Adds junk pressure after attacking.
- Behaviors: basic_attack, spawn_junk
- SpriteKey: placeholder_goblin
- IconKey: ico_mon_dungeon_goblin
- Animation Keys: idle=anim_mon_dungeon_goblin_idle, attack=anim_mon_dungeon_goblin_attack, hit=anim_mon_dungeon_goblin_hit, defeat=anim_mon_dungeon_goblin_defeat
- Classification: regular
- Current Stage Usage: Sprinkle Sewers
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:499`
  - `src/game/content/friendship/crumb-goblin.json:1`
  - `src/game/content/monsters/goblin.json:2,9,47,49,50,51,52`
  - `src/game/content/monsters/metadata.json:10,376`
  - `src/game/content/stages/sprinkle-sewers.json:6`

### mon_ice_pop_mimic
- Filename: `ice_pop_mimic.json`
- ID: `mon_ice_pop_mimic`
- Name: Ice Pop Mimic
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: basic
- Biome: ice_cave
- Stats: hp 58, attack 6, armor 0, attackIntervalLocks 4
- Intent: intent_charge / Brain Freeze / Ice Pop Mimic prepares Brain Freeze.
- Behaviors: freeze_piece
- SpriteKey: placeholder_ice_pop_mimic
- IconKey: ico_mon_ice_pop_mimic
- Animation Keys: idle=anim_mon_ice_pop_mimic_idle, attack=anim_mon_ice_pop_mimic_attack, hit=anim_mon_ice_pop_mimic_hit, defeat=anim_mon_ice_pop_mimic_defeat
- Classification: regular
- Current Stage Usage: Frosty Pantry
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:506`
  - `src/game/content/monsters/ice_pop_mimic.json:2,9,41,43,44,45,46`
  - `src/game/content/monsters/metadata.json:378`
  - `src/game/content/stages/frosty-pantry.json:10`

### mon_joystick_jinxer
- Filename: `joystick_jinxer.json`
- ID: `mon_joystick_jinxer`
- Name: Joystick Jinxer
- Enabled: true
- Rarity: uncommon
- Tier: 4
- Role: caster
- Biome: void
- Stats: hp 66, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_hex / Button Jinx / Joystick Jinxer prepares Button Jinx.
- Behaviors: mana_hex
- SpriteKey: placeholder_joystick_jinxer
- IconKey: ico_mon_joystick_jinxer
- Animation Keys: idle=anim_mon_joystick_jinxer_idle, attack=anim_mon_joystick_jinxer_attack, hit=anim_mon_joystick_jinxer_hit, defeat=anim_mon_joystick_jinxer_defeat
- Classification: regular
- Current Stage Usage: Starfall Arcade
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:507`
  - `src/game/content/monsters/joystick_jinxer.json:2,9,41,43,44,45,46`
  - `src/game/content/monsters/metadata.json:381`
  - `src/game/content/stages/starfall-arcade.json:10`

### mon_palace_jester
- Filename: `palace_jester.json`
- ID: `mon_palace_jester`
- Name: Palace Jester
- Enabled: true
- Rarity: rare
- Tier: 4
- Role: caster
- Biome: royal_ruins
- Stats: hp 80, attack 7, armor 0, attackIntervalLocks 3
- Intent: intent_hex / Royal Razzle / Palace Jester prepares Royal Razzle.
- Behaviors: mana_hex
- SpriteKey: placeholder_palace_jester
- IconKey: ico_mon_palace_jester
- Animation Keys: idle=anim_mon_palace_jester_idle, attack=anim_mon_palace_jester_attack, hit=anim_mon_palace_jester_hit, defeat=anim_mon_palace_jester_defeat
- Classification: regular
- Current Stage Usage: Bloxley's Block Palace
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:508`
  - `src/game/content/friendship/square-jester.json:1`
  - `src/game/content/monsters/metadata.json:382`
  - `src/game/content/monsters/palace_jester.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/bloxley-block-palace.json:9`

### mon_pillow_pawn
- Filename: `pillow_pawn.json`
- ID: `mon_pillow_pawn`
- Name: Pillow Pawn
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: basic
- Biome: royal_ruins
- Stats: hp 60, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_attack / Soft Bop / Pillow Pawn prepares Soft Bop.
- Behaviors: basic_attack
- SpriteKey: placeholder_pillow_pawn
- IconKey: ico_mon_pillow_pawn
- Animation Keys: idle=anim_mon_pillow_pawn_idle, attack=anim_mon_pillow_pawn_attack, hit=anim_mon_pillow_pawn_hit, defeat=anim_mon_pillow_pawn_defeat
- Classification: regular
- Current Stage Usage: Pillow Castle
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:509`
  - `src/game/content/monsters/metadata.json:379`
  - `src/game/content/monsters/pillow_pawn.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/pillow-castle.json:7`

### mon_pipe_peeker
- Filename: `pipe_peeker.json`
- ID: `mon_pipe_peeker`
- Name: Pipe Peeker
- Enabled: true
- Rarity: common
- Tier: 2
- Role: basic
- Biome: dungeon
- Stats: hp 34, attack 4, armor 0, attackIntervalLocks 4
- Intent: intent_attack / Pipe Pop / Pipe Peeker prepares Pipe Pop.
- Behaviors: basic_attack
- SpriteKey: placeholder_pipe_peeker
- IconKey: ico_mon_pipe_peeker
- Animation Keys: idle=anim_mon_pipe_peeker_idle, attack=anim_mon_pipe_peeker_attack, hit=anim_mon_pipe_peeker_hit, defeat=anim_mon_pipe_peeker_defeat
- Classification: regular
- Current Stage Usage: Sprinkle Sewers
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:510`
  - `src/game/content/monsters/pipe_peeker.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/sprinkle-sewers.json:6`

### mon_quilt_knight
- Filename: `quilt_knight.json`
- ID: `mon_quilt_knight`
- Name: Quilt Knight
- Enabled: true
- Rarity: rare
- Tier: 4
- Role: basic
- Biome: royal_ruins
- Stats: hp 72, attack 7, armor 0, attackIntervalLocks 3
- Intent: intent_attack / Tucked Charge / Quilt Knight prepares Tucked Charge.
- Behaviors: basic_attack
- SpriteKey: placeholder_quilt_knight
- IconKey: ico_mon_quilt_knight
- Animation Keys: idle=anim_mon_quilt_knight_idle, attack=anim_mon_quilt_knight_attack, hit=anim_mon_quilt_knight_hit, defeat=anim_mon_quilt_knight_defeat
- Classification: regular
- Current Stage Usage: Bloxley's Block Palace, Pillow Castle
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:511`
  - `src/game/content/monsters/quilt_knight.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/bloxley-block-palace.json:11`
  - `src/game/content/stages/pillow-castle.json:11`

### mon_royal_page
- Filename: `royal_page.json`
- ID: `mon_royal_page`
- Name: Royal Page
- Enabled: true
- Rarity: rare
- Tier: 4
- Role: summoner
- Biome: royal_ruins
- Stats: hp 76, attack 7, armor 0, attackIntervalLocks 3
- Intent: intent_throw_junk / Royal Errand / Royal Page prepares Royal Errand.
- Behaviors: spawn_junk
- SpriteKey: placeholder_royal_page
- IconKey: ico_mon_royal_page
- Animation Keys: idle=anim_mon_royal_page_idle, attack=anim_mon_royal_page_attack, hit=anim_mon_royal_page_hit, defeat=anim_mon_royal_page_defeat
- Classification: regular
- Current Stage Usage: Bloxley's Block Palace
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:512`
  - `src/game/content/monsters/royal_page.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/bloxley-block-palace.json:8`

### mon_score_specter
- Filename: `score_specter.json`
- ID: `mon_score_specter`
- Name: Score Specter
- Enabled: true
- Rarity: rare
- Tier: 4
- Role: basic
- Biome: void
- Stats: hp 74, attack 7, armor 0, attackIntervalLocks 3
- Intent: intent_screech / Screen Glitch / Score Specter prepares Screen Glitch.
- Behaviors: hide_next_piece
- SpriteKey: placeholder_score_specter
- IconKey: ico_mon_score_specter
- Animation Keys: idle=anim_mon_score_specter_idle, attack=anim_mon_score_specter_attack, hit=anim_mon_score_specter_hit, defeat=anim_mon_score_specter_defeat
- Classification: regular
- Current Stage Usage: Starfall Arcade
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:513`
  - `src/game/content/monsters/score_specter.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/starfall-arcade.json:11`

### mon_dungeon_slime
- Filename: `slime.json`
- ID: `mon_dungeon_slime`
- Name: Dungeon Slime
- Enabled: true
- Rarity: common
- Tier: 1
- Role: basic
- Biome: dungeon
- Stats: hp 30, attack 3, armor 0, attackIntervalLocks 4
- Intent: intent_attack / Bounce Attack / Deals direct damage.
- Behaviors: basic_attack
- SpriteKey: placeholder_slime
- IconKey: ico_mon_dungeon_slime
- Animation Keys: idle=anim_mon_dungeon_slime_idle, attack=anim_mon_dungeon_slime_attack, hit=anim_mon_dungeon_slime_hit, defeat=anim_mon_dungeon_slime_defeat
- Classification: regular
- Current Stage Usage: Sprinkle Sewers
- All references found in code/content:
  - `docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md:500`
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:500`
  - `scripts/sync-asset-runtime-map.mjs:74`
  - `src/game/content/friendship/cupcake-slime.json:1`
  - `src/game/content/monsters/metadata.json:9,374`
  - `src/game/content/monsters/slime.json:2,9,45,47,48,49,50`
  - `src/game/content/stages/sprinkle-sewers.json:6`
  - `src/game/systems/ContentRegistry.ts:22`

### mon_snore_squire
- Filename: `snore_squire.json`
- ID: `mon_snore_squire`
- Name: Snore Squire
- Enabled: true
- Rarity: uncommon
- Tier: 4
- Role: basic
- Biome: royal_ruins
- Stats: hp 66, attack 6, armor 0, attackIntervalLocks 4
- Intent: intent_guard / Nap Guard / Snore Squire prepares Nap Guard.
- Behaviors: armor_up
- SpriteKey: placeholder_snore_squire
- IconKey: ico_mon_snore_squire
- Animation Keys: idle=anim_mon_snore_squire_idle, attack=anim_mon_snore_squire_attack, hit=anim_mon_snore_squire_hit, defeat=anim_mon_snore_squire_defeat
- Classification: regular
- Current Stage Usage: Pillow Castle
- All references found in code/content:
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:514`
  - `src/game/content/monsters/snore_squire.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/pillow-castle.json:10`

### mon_snowcone_sprite
- Filename: `snowcone_sprite.json`
- ID: `mon_snowcone_sprite`
- Name: Snowcone Sprite
- Enabled: true
- Rarity: common
- Tier: 3
- Role: basic
- Biome: ice_cave
- Stats: hp 42, attack 4, armor 0, attackIntervalLocks 4
- Intent: intent_screech / Frost Blink / Snowcone Sprite prepares Frost Blink.
- Behaviors: hide_next_piece
- SpriteKey: placeholder_snowcone_sprite
- IconKey: ico_mon_snowcone_sprite
- Animation Keys: idle=anim_mon_snowcone_sprite_idle, attack=anim_mon_snowcone_sprite_attack, hit=anim_mon_snowcone_sprite_hit, defeat=anim_mon_snowcone_sprite_defeat
- Classification: regular
- Current Stage Usage: Frosty Pantry
- All references found in code/content:
  - `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md:1446,1594`
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:515`
  - `docs/blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_STAGE_BUNDLES.md:681,682,683,684,685`
  - `src/game/content/monsters/snowcone_sprite.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/frosty-pantry.json:11`

### mon_spring_bot
- Filename: `spring_bot.json`
- ID: `mon_spring_bot`
- Name: Spring Bot
- Enabled: true
- Rarity: uncommon
- Tier: 3
- Role: basic
- Biome: royal_ruins
- Stats: hp 52, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_charge / Speed Spring / Spring Bot prepares Speed Spring.
- Behaviors: increase_fall_speed
- SpriteKey: placeholder_spring_bot
- IconKey: ico_mon_spring_bot
- Animation Keys: idle=anim_mon_spring_bot_idle, attack=anim_mon_spring_bot_attack, hit=anim_mon_spring_bot_hit, defeat=anim_mon_spring_bot_defeat
- Classification: regular
- Current Stage Usage: Goblin Workshop
- All references found in code/content:
  - `docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md:1414,1581`
  - `docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md:516`
  - `docs/blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_STAGE_BUNDLES.md:573,574,575,576,577`
  - `src/game/content/monsters/spring_bot.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/goblin-workshop.json:6`

### mon_sprinkle_rat
- Filename: `sprinkle_rat.json`
- ID: `mon_sprinkle_rat`
- Name: Sprinkle Rat
- Enabled: true
- Rarity: common
- Tier: 2
- Role: basic
- Biome: dungeon
- Stats: hp 24, attack 3, armor 0, attackIntervalLocks 4
- Intent: intent_attack / Nibble Dash / Sprinkle Rat prepares Nibble Dash.
- Behaviors: basic_attack
- SpriteKey: placeholder_sprinkle_rat
- IconKey: ico_mon_sprinkle_rat
- Animation Keys: idle=anim_mon_sprinkle_rat_idle, attack=anim_mon_sprinkle_rat_attack, hit=anim_mon_sprinkle_rat_hit, defeat=anim_mon_sprinkle_rat_defeat
- Classification: regular
- Current Stage Usage: Sprinkle Sewers
- All references found in code/content:
  - `scripts/complete-phase1-5-content.mjs:111`
  - `src/game/content/monsters/sprinkle_rat.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/sprinkle-sewers.json:6`

### mon_stone_golem
- Filename: `stone-golem.json`
- ID: `mon_stone_golem`
- Name: Stone Golem
- Enabled: true
- Rarity: elite
- Tier: 3
- Role: tank
- Biome: royal_ruins
- Stats: hp 75, attack 6, armor 2, attackIntervalLocks 3
- Intent: intent_guard / Stone Guard / Reduces line damage before striking back.
- Behaviors: reduce_line_damage, armor_up
- SpriteKey: placeholder_stone_golem
- IconKey: ico_mon_stone_golem
- Animation Keys: idle=anim_mon_stone_golem_idle, attack=anim_mon_stone_golem_attack, hit=anim_mon_stone_golem_hit, defeat=anim_mon_stone_golem_defeat
- Classification: regular
- Current Stage Usage: Bloxley's Block Palace
- All references found in code/content:
  - `src/game/content/monsters/metadata.json:11`
  - `src/game/content/monsters/stone-golem.json:2,9,51,53,54,55,56`
  - `src/game/content/stages/bloxley-block-palace.json:12`

### mon_syrup_slug
- Filename: `syrup_slug.json`
- ID: `mon_syrup_slug`
- Name: Syrup Slug
- Enabled: true
- Rarity: common
- Tier: 2
- Role: basic
- Biome: dungeon
- Stats: hp 32, attack 3, armor 1, attackIntervalLocks 4
- Intent: intent_guard / Sticky Wiggle / Syrup Slug prepares Sticky Wiggle.
- Behaviors: reduce_line_damage
- SpriteKey: placeholder_syrup_slug
- IconKey: ico_mon_syrup_slug
- Animation Keys: idle=anim_mon_syrup_slug_idle, attack=anim_mon_syrup_slug_attack, hit=anim_mon_syrup_slug_hit, defeat=anim_mon_syrup_slug_defeat
- Classification: regular
- Current Stage Usage: Sprinkle Sewers
- All references found in code/content:
  - `src/game/content/monsters/syrup_slug.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/sprinkle-sewers.json:6`

### mon_ticket_tumbler
- Filename: `ticket_tumbler.json`
- ID: `mon_ticket_tumbler`
- Name: Ticket Tumbler
- Enabled: true
- Rarity: uncommon
- Tier: 4
- Role: summoner
- Biome: void
- Stats: hp 64, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_throw_junk / Ticket Jam / Ticket Tumbler prepares Ticket Jam.
- Behaviors: spawn_junk
- SpriteKey: placeholder_ticket_tumbler
- IconKey: ico_mon_ticket_tumbler
- Animation Keys: idle=anim_mon_ticket_tumbler_idle, attack=anim_mon_ticket_tumbler_attack, hit=anim_mon_ticket_tumbler_hit, defeat=anim_mon_ticket_tumbler_defeat
- Classification: regular
- Current Stage Usage: Starfall Arcade
- All references found in code/content:
  - `src/game/content/monsters/ticket_tumbler.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/starfall-arcade.json:9`

### mon_witch
- Filename: `witch.json`
- ID: `mon_witch`
- Name: Dungeon Witch
- Enabled: true
- Rarity: rare
- Tier: 2
- Role: caster
- Biome: void
- Stats: hp 55, attack 5, armor 0, attackIntervalLocks 4
- Intent: intent_hex / Mana Hex / Temporarily increases spell costs.
- Behaviors: mana_hex
- SpriteKey: placeholder_witch
- IconKey: ico_mon_witch
- Animation Keys: idle=anim_mon_witch_idle, attack=anim_mon_witch_attack, hit=anim_mon_witch_hit, defeat=anim_mon_witch_defeat
- Classification: regular
- Current Stage Usage: Starfall Arcade
- All references found in code/content:
  - `src/game/content/monsters/metadata.json:13`
  - `src/game/content/monsters/witch.json:2,9,47,49,50,51,52`
  - `src/game/content/stages/starfall-arcade.json:12`

### mon_wrench_wisp
- Filename: `wrench_wisp.json`
- ID: `mon_wrench_wisp`
- Name: Wrench Wisp
- Enabled: true
- Rarity: common
- Tier: 2
- Role: caster
- Biome: royal_ruins
- Stats: hp 40, attack 4, armor 0, attackIntervalLocks 4
- Intent: intent_hex / Mana Rattle / Wrench Wisp prepares Mana Rattle.
- Behaviors: mana_hex
- SpriteKey: placeholder_wrench_wisp
- IconKey: ico_mon_wrench_wisp
- Animation Keys: idle=anim_mon_wrench_wisp_idle, attack=anim_mon_wrench_wisp_attack, hit=anim_mon_wrench_wisp_hit, defeat=anim_mon_wrench_wisp_defeat
- Classification: regular
- Current Stage Usage: Goblin Workshop
- All references found in code/content:
  - `src/game/content/monsters/wrench_wisp.json:2,9,41,43,44,45,46`
  - `src/game/content/stages/goblin-workshop.json:6`

## 2. GDD Target Roster

### Stage 1 Sprinkle Sewers
- `mon_cupcake_slime` - Cupcake Slime
- `mon_sugar_bat` - Sugar Bat
- `mon_crumb_goblin` - Crumb Goblin
- `mon_jelly_rat` - Jelly Rat
- `mon_sprinkle_snail` - Sprinkle Snail
- `mon_frosting_blob` - Frosting Blob

### Stage 2 Goblin Workshop
- `mon_wrench_goblin` - Wrench Goblin
- `mon_button_masher` - Button Masher
- `mon_spring_bot` - Spring Bot
- `mon_spark_gremlin` - Spark Gremlin
- `mon_gear_slime` - Gear Slime
- `mon_rattle_drone` - Rattle Drone

### Stage 3 Frosty Pantry
- `mon_ice_cream_imp` - Ice Cream Imp
- `mon_popsicle_bat` - Popsicle Bat
- `mon_chill_slime` - Chill Slime
- `mon_freezer_mimic` - Freezer Mimic
- `mon_snowcone_sprite` - Snowcone Sprite
- `mon_pudding_penguin` - Pudding Penguin

### Stage 4 Pillow Castle
- `mon_button_knight` - Button Knight
- `mon_blanket_ghost` - Blanket Ghost
- `mon_plush_dragon` - Plush Dragon
- `mon_toy_soldier` - Toy Soldier
- `mon_pillow_squire` - Pillow Squire
- `mon_sock_sprite` - Sock Sprite

### Stage 5 Starfall Arcade
- `mon_token_sprite` - Token Sprite
- `mon_combo_gremlin` - Combo Gremlin
- `mon_neon_bat` - Neon Bat
- `mon_prize_claw_mimic` - Prize Claw Mimic
- `mon_pixel_blob` - Pixel Blob
- `mon_joystick_jester` - Joystick Jester

### Stage 6 Bloxley's Block Palace
- `mon_royal_block_guard` - Royal Block Guard
- `mon_square_jester` - Square Jester
- `mon_crown_bat` - Crown Bat
- `mon_parade_golem` - Parade Golem
- `mon_confetti_mage` - Confetti Mage
- `mon_banner_bug` - Banner Bug

### Bosses
- `boss_cupcake_slime_king` - Cupcake Slime King
- `boss_prototype_no_7` - Prototype No. 7
- `boss_gelato_golem` - Gelato Golem
- `boss_sir_snore_a_lot` - Sir Snore-a-Lot
- `boss_high_score_hydra` - High Score Hydra
- `boss_king_bloxley` - King Bloxley

## 3. Mismatch Table

| GDD target ID | GDD name | Current matching repo ID | Match confidence | Recommended action |
| --- | --- | --- | --- | --- |
| `mon_cupcake_slime` | Cupcake Slime | `mon_dungeon_slime` | high | `add_alias_to_existing_monster` |
| `mon_sugar_bat` | Sugar Bat | `mon_bat` | high | `add_alias_to_existing_monster` |
| `mon_crumb_goblin` | Crumb Goblin | `mon_dungeon_goblin` | high | `add_alias_to_existing_monster` |
| `mon_jelly_rat` | Jelly Rat | `mon_sprinkle_rat` | medium | `needs_manual_product_decision` |
| `mon_sprinkle_snail` | Sprinkle Snail | `mon_syrup_slug` | medium | `needs_manual_product_decision` |
| `mon_frosting_blob` | Frosting Blob | `mon_cupcake_imp` | low | `needs_manual_product_decision` |
| `mon_wrench_goblin` | Wrench Goblin | `mon_gadget_goblin` | medium | `needs_manual_product_decision` |
| `mon_button_masher` | Button Masher | `mon_bolt_beetle` | low | `needs_manual_product_decision` |
| `mon_spring_bot` | Spring Bot | `mon_spring_bot` | exact | `keep_current_id` |
| `mon_spark_gremlin` | Spark Gremlin | `mon_gear_gremlin` | medium | `needs_manual_product_decision` |
| `mon_gear_slime` | Gear Slime | `mon_bolt_beetle` | low | `needs_manual_product_decision` |
| `mon_rattle_drone` | Rattle Drone | `mon_wrench_wisp` | low | `needs_manual_product_decision` |
| `mon_ice_cream_imp` | Ice Cream Imp | `mon_chilly_churro` | medium | `needs_manual_product_decision` |
| `mon_popsicle_bat` | Popsicle Bat | `mon_bubble_bat` | medium | `add_alias_to_existing_monster` |
| `mon_chill_slime` | Chill Slime | `mon_gelato_blob` | medium | `needs_manual_product_decision` |
| `mon_freezer_mimic` | Freezer Mimic | `mon_ice_pop_mimic` | high | `add_alias_to_existing_monster` |
| `mon_snowcone_sprite` | Snowcone Sprite | `mon_snowcone_sprite` | exact | `keep_current_id` |
| `mon_pudding_penguin` | Pudding Penguin | `mon_frosting_fox` | low | `needs_manual_product_decision` |
| `mon_button_knight` | Button Knight | `mon_quilt_knight` | low | `needs_manual_product_decision` |
| `mon_blanket_ghost` | Blanket Ghost | `mon_blanket_bard` | medium | `needs_manual_product_decision` |
| `mon_plush_dragon` | Plush Dragon | `mon_dream_drummer` | low | `needs_manual_product_decision` |
| `mon_toy_soldier` | Toy Soldier | `mon_snore_squire` | low | `needs_manual_product_decision` |
| `mon_pillow_squire` | Pillow Squire | `mon_pillow_pawn` | high | `add_alias_to_existing_monster` |
| `mon_sock_sprite` | Sock Sprite | `mon_crown_mime` | low | `needs_manual_product_decision` |
| `mon_token_sprite` | Token Sprite | `mon_ticket_tumbler` | medium | `needs_manual_product_decision` |
| `mon_combo_gremlin` | Combo Gremlin | `mon_combo_crab` | medium | `add_alias_to_existing_monster` |
| `mon_neon_bat` | Neon Bat | `mon_arcade_spark` | low | `needs_manual_product_decision` |
| `mon_prize_claw_mimic` | Prize Claw Mimic | `mon_score_specter` | low | `needs_manual_product_decision` |
| `mon_pixel_blob` | Pixel Blob | `mon_score_specter` | low | `needs_manual_product_decision` |
| `mon_joystick_jester` | Joystick Jester | `mon_joystick_jinxer` | high | `add_alias_to_existing_monster` |
| `mon_royal_block_guard` | Royal Block Guard | `mon_stone_golem` | medium | `needs_manual_product_decision` |
| `mon_square_jester` | Square Jester | `mon_palace_jester` | high | `add_alias_to_existing_monster` |
| `mon_crown_bat` | Crown Bat | `mon_crown_mime` | low | `needs_manual_product_decision` |
| `mon_parade_golem` | Parade Golem | `mon_block_baron` | medium | `needs_manual_product_decision` |
| `mon_confetti_mage` | Confetti Mage | `mon_royal_page` | low | `needs_manual_product_decision` |
| `mon_banner_bug` | Banner Bug | `mon_royal_page` | low | `needs_manual_product_decision` |
| `boss_cupcake_slime_king` | Cupcake Slime King | `mon_boss_cupcake_slime_king` | high | `add_alias_to_existing_monster` |
| `boss_prototype_no_7` | Prototype No. 7 | `mon_boss_prototype_no_7` | high | `add_alias_to_existing_monster` |
| `boss_gelato_golem` | Gelato Golem | `mon_boss_gelato_golem` | high | `add_alias_to_existing_monster` |
| `boss_sir_snore_a_lot` | Sir Snore-a-Lot | `mon_boss_sir_snore_a_lot` | high | `add_alias_to_existing_monster` |
| `boss_high_score_hydra` | High Score Hydra | `mon_boss_high_score_hydra` | high | `add_alias_to_existing_monster` |
| `boss_king_bloxley` | King Bloxley | `mon_boss_king_bloxley` | high | `add_alias_to_existing_monster` |

## 4. Risk Assessment

| GDD target ID | Current repo ID | References that would break on direct rename | Save migration needed | Safer approach |
| --- | --- | --- | --- | --- |
| `mon_cupcake_slime` | `mon_dungeon_slime` | docs/05_BLOCKMANCER_RELEASE_IMPLEMENTATION_SOURCE_OF_TRUTH.md<br>docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/sync-asset-runtime-map.mjs<br>src/game/content/friendship/cupcake-slime.json<br>src/game/content/monsters/metadata.json<br>src/game/content/monsters/slime.json<br>src/game/content/stages/sprinkle-sewers.json<br>src/game/systems/ContentRegistry.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_sugar_bat` | `mon_bat` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/bat.json<br>src/game/content/monsters/metadata.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_crumb_goblin` | `mon_dungeon_goblin` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/friendship/crumb-goblin.json<br>src/game/content/monsters/goblin.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/sprinkle-sewers.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_jelly_rat` | `mon_sprinkle_rat` | scripts/complete-phase1-5-content.mjs<br>src/game/content/monsters/sprinkle_rat.json<br>src/game/content/stages/sprinkle-sewers.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_sprinkle_snail` | `mon_syrup_slug` | src/game/content/monsters/syrup_slug.json<br>src/game/content/stages/sprinkle-sewers.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_frosting_blob` | `mon_cupcake_imp` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/cupcake_imp.json<br>src/game/content/stages/sprinkle-sewers.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_wrench_goblin` | `mon_gadget_goblin` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/complete-phase1-5-content.mjs<br>src/game/content/friendship/button-masher.json<br>src/game/content/monsters/gadget_goblin.json<br>src/game/content/stages/goblin-workshop.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_button_masher` | `mon_bolt_beetle` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/bolt_beetle.json<br>src/game/content/stages/goblin-workshop.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_spring_bot` | `mon_spring_bot` | docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md<br>docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>docs/blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_STAGE_BUNDLES.md<br>src/game/content/monsters/spring_bot.json<br>src/game/content/stages/goblin-workshop.json | Yes for any save/runtime lookup using the current repo ID. | Keep the current ID stable; no rename needed. |
| `mon_spark_gremlin` | `mon_gear_gremlin` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/gear_gremlin.json<br>src/game/content/stages/goblin-workshop.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_gear_slime` | `mon_bolt_beetle` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/bolt_beetle.json<br>src/game/content/stages/goblin-workshop.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_rattle_drone` | `mon_wrench_wisp` | src/game/content/monsters/wrench_wisp.json<br>src/game/content/stages/goblin-workshop.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_ice_cream_imp` | `mon_chilly_churro` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/chilly_churro.json<br>src/game/content/stages/frosty-pantry.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_popsicle_bat` | `mon_bubble_bat` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/friendship/sugar-bat.json<br>src/game/content/monsters/bubble_bat.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/frosty-pantry.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_chill_slime` | `mon_gelato_blob` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/friendship/ice-cream-imp.json<br>src/game/content/monsters/gelato_blob.json<br>src/game/content/stages/frosty-pantry.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_freezer_mimic` | `mon_ice_pop_mimic` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/ice_pop_mimic.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/frosty-pantry.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_snowcone_sprite` | `mon_snowcone_sprite` | docs/01_BLOCKMANCER_GAME_DESIGN_SOURCE_OF_TRUTH.md<br>docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>docs/blockmancer_pixel_creator_asset_spec_ARTIST_BRIEF_v7_STAGE_BUNDLES.md<br>src/game/content/monsters/snowcone_sprite.json<br>src/game/content/stages/frosty-pantry.json | Yes for any save/runtime lookup using the current repo ID. | Keep the current ID stable; no rename needed. |
| `mon_pudding_penguin` | `mon_frosting_fox` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/frosting_fox.json<br>src/game/content/stages/frosty-pantry.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_button_knight` | `mon_quilt_knight` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/quilt_knight.json<br>src/game/content/stages/bloxley-block-palace.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_blanket_ghost` | `mon_blanket_bard` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/friendship/blanket-ghost.json<br>src/game/content/monsters/blanket_bard.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_plush_dragon` | `mon_dream_drummer` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/dream_drummer.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_toy_soldier` | `mon_snore_squire` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/snore_squire.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_pillow_squire` | `mon_pillow_pawn` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/metadata.json<br>src/game/content/monsters/pillow_pawn.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_sock_sprite` | `mon_crown_mime` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/crown_mime.json<br>src/game/content/stages/bloxley-block-palace.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_token_sprite` | `mon_ticket_tumbler` | src/game/content/monsters/ticket_tumbler.json<br>src/game/content/stages/starfall-arcade.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_combo_gremlin` | `mon_combo_crab` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/friendship/combo-gremlin.json<br>src/game/content/monsters/combo_crab.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/starfall-arcade.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_neon_bat` | `mon_arcade_spark` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/complete-phase1-5-content.mjs<br>src/game/content/monsters/arcade_spark.json<br>src/game/content/stages/starfall-arcade.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_prize_claw_mimic` | `mon_score_specter` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/score_specter.json<br>src/game/content/stages/starfall-arcade.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_pixel_blob` | `mon_score_specter` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/score_specter.json<br>src/game/content/stages/starfall-arcade.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_joystick_jester` | `mon_joystick_jinxer` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/joystick_jinxer.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/starfall-arcade.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_royal_block_guard` | `mon_stone_golem` | src/game/content/monsters/metadata.json<br>src/game/content/monsters/stone-golem.json<br>src/game/content/stages/bloxley-block-palace.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_square_jester` | `mon_palace_jester` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/friendship/square-jester.json<br>src/game/content/monsters/metadata.json<br>src/game/content/monsters/palace_jester.json<br>src/game/content/stages/bloxley-block-palace.json | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `mon_crown_bat` | `mon_crown_mime` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/crown_mime.json<br>src/game/content/stages/bloxley-block-palace.json<br>src/game/content/stages/pillow-castle.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_parade_golem` | `mon_block_baron` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/block_baron.json<br>src/game/content/stages/bloxley-block-palace.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_confetti_mage` | `mon_royal_page` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/royal_page.json<br>src/game/content/stages/bloxley-block-palace.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `mon_banner_bug` | `mon_royal_page` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/monsters/royal_page.json<br>src/game/content/stages/bloxley-block-palace.json | Yes for any save/runtime lookup using the current repo ID. | Document the mismatch and require manual product selection before changing live IDs or stage pools. |
| `boss_cupcake_slime_king` | `mon_boss_cupcake_slime_king` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/boss-rules/cupcake-slime-king.json<br>src/game/content/monsters/boss-cupcake_slime_king.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stage-goals/stage1-lost-cupcakes.json<br>src/game/content/stages/sprinkle-sewers.json<br>src/game/data/assets.ts<br>src/game/systems/BossSystem.ts<br>src/game/systems/StorySystem.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `boss_prototype_no_7` | `mon_boss_prototype_no_7` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>src/game/content/boss-rules/prototype-no-7.json<br>src/game/content/monsters/boss-prototype_no_7.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/goblin-workshop.json<br>src/game/data/assets.ts<br>src/game/systems/BossSystem.ts<br>src/game/systems/StorySystem.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `boss_gelato_golem` | `mon_boss_gelato_golem` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/complete-phase1-5-content.mjs<br>src/game/content/boss-rules/gelato-golem.json<br>src/game/content/monsters/boss-gelato_golem.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/frosty-pantry.json<br>src/game/data/assets.ts<br>src/game/systems/BossSystem.ts<br>src/game/systems/StorySystem.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `boss_sir_snore_a_lot` | `mon_boss_sir_snore_a_lot` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/complete-phase1-5-content.mjs<br>src/game/content/boss-rules/sir-snore-a-lot.json<br>src/game/content/monsters/boss-sir_snore_a_lot.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/pillow-castle.json<br>src/game/data/assets.ts<br>src/game/systems/BossSystem.ts<br>src/game/systems/StorySystem.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `boss_high_score_hydra` | `mon_boss_high_score_hydra` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/complete-phase1-5-content.mjs<br>src/game/content/boss-rules/high-score-hydra.json<br>src/game/content/monsters/boss-high_score_hydra.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/starfall-arcade.json<br>src/game/data/assets.ts<br>src/game/systems/BossSystem.ts<br>src/game/systems/CombatSystem.ts<br>src/game/systems/FeverSystem.ts<br>src/game/systems/StorySystem.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |
| `boss_king_bloxley` | `mon_boss_king_bloxley` | docs/ASSET_FOLDER_STRUCTURE_STANDARDIZATION_AUDIT.md<br>scripts/complete-phase1-5-content.mjs<br>src/game/content/boss-rules/king-bloxley.json<br>src/game/content/monsters/boss-king_bloxley.json<br>src/game/content/monsters/metadata.json<br>src/game/content/stages/bloxley-block-palace.json<br>src/game/data/assets.ts<br>src/game/systems/BoardSizeModifierSystem.ts<br>src/game/systems/BossSystem.ts<br>src/game/systems/StorySystem.ts | Yes for any save/runtime lookup using the current repo ID. | Alias the GDD ID to the current repo ID; do not rename the current ID. |

## Additional Notes
- `mon_boss_falling_king` is a legacy boss that remains referenced by `src/game/content/map-nodes/boss.json` and `src/game/data/enemies.ts`. It must stay stable until those legacy fallbacks are intentionally migrated.
- `mon_quilt_knight` and `mon_crown_mime` are reused in multiple stage pools, which is why the repo currently has 34 unique stage-assigned regular monster IDs across 36 stage slots.
- Many GDD targets only have medium or low-confidence repo matches. Those entries were not force-mapped at runtime and are intentionally left for manual product review.
