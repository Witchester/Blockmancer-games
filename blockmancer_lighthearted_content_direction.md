# Blockmancer Dungeon — Lighthearted Content Direction Pack

Use this document as a content direction reference or paste it into a Codex/Cursor/Windsurf prompt.

---

## 1. New Core Concept

**Blockmancer Dungeon** is a cheerful falling-block roguelike RPG where a magical festival machine called the **Block-O-Matic 3000** goes haywire and creates a colorful dungeon beneath the town square.

The player clears rune block lines, triggers **Cascade Gravity** combos, casts silly spells, collects snacks, relics, upgrades, and unlocks quirky heroes while trying to save the **Festival of Falling Stars** from **King Bloxley**, the self-appointed Block King.

### Tone

- Cheerful fantasy
- Cute chaos
- Festival adventure
- Funny monsters
- Cozy arcade energy
- Pixel-art 32-bit style
- Bright, playful, readable
- No edgy/dark tragedy
- No grim curse tone

### Core Theme

> Creativity fixes chaos better than control.

### Core Fantasy

The player is not saving the world from doom.  
The player is saving a magical festival from becoming a giant blocky mess.

---

## 2. Content Categories Needed

The game should support these data-driven content categories:

```text
heroes
monsters
bosses
weapons
spells
relics
upgrades
board-blocks
status-effects
items
inventory
room-events
shops
treasures
oopsies / silly drawbacks
stages / biomes
loot-tables
npc
currencies
collectibles
achievements
tutorials
asset keys
```

---

## 3. Stages / Biomes

### Stage 1 — Sprinkle Sewers

Theme: Candy sewers under the festival, cupcake slime, rainbow water pipes, frosting blobs.

```text
Main mechanic:
- Sticky blocks
- Sprinkle blocks
- Bonus mana from candy blocks
```

Monsters:

```text
mon_cupcake_slime
mon_sugar_bat
mon_crumb_goblin
mon_jelly_rat
mon_sprinkle_snail
mon_frosting_blob
```

Boss:

```text
boss_cupcake_slime_king
```

---

### Stage 2 — Goblin Workshop

Theme: Goblin machines, conveyor belts, springs, toy bombs, warning signs that say “Totally Safe”.

```text
Main mechanic:
- Junk blocks
- Bomb blocks
- Board shake
- Random gadget effects
```

Monsters:

```text
mon_wrench_goblin
mon_button_masher
mon_spring_bot
mon_spark_gremlin
mon_gear_slime
mon_rattle_drone
```

Boss:

```text
boss_prototype_no_7
```

---

### Stage 3 — Frosty Pantry

Theme: Magical freezer, rainbow ice cream, cold pudding, sliding ice blocks.

```text
Main mechanic:
- Ice blocks
- Slow / fast fall speed waves
- Freeze active block
```

Monsters:

```text
mon_ice_cream_imp
mon_popsicle_bat
mon_chill_slime
mon_freezer_mimic
mon_snowcone_sprite
mon_pudding_penguin
```

Boss:

```text
boss_gelato_golem
```

---

### Stage 4 — Pillow Castle

Theme: Pillow castle, living toys, plush dragons, blanket ghosts, button knights.

```text
Main mechanic:
- Soft blocks
- Shield enemies
- Sleep status
```

Monsters:

```text
mon_button_knight
mon_blanket_ghost
mon_plush_dragon
mon_toy_soldier
mon_pillow_squire
mon_sock_sprite
```

Boss:

```text
boss_sir_snore_a_lot
```

---

### Stage 5 — Starfall Arcade

Theme: Magical arcade, neon lights, living game machines, prize claw mimics.

```text
Main mechanic:
- Fever meter
- Cascade bonus
- Combo challenge
```

Monsters:

```text
mon_token_sprite
mon_combo_gremlin
mon_neon_bat
mon_prize_claw_mimic
mon_pixel_blob
mon_joystick_jester
```

Boss:

```text
boss_high_score_hydra
```

---

### Stage 6 — Bloxley’s Block Palace

Theme: Giant block palace, confetti, toy royal guards, square banners, symmetry obsession.

```text
Main mechanic:
- Royal blocks
- Symmetry challenge
- Pattern junk
- Final cascade check
```

Monsters:

```text
mon_royal_block_guard
mon_square_jester
mon_crown_bat
mon_parade_golem
mon_confetti_mage
mon_banner_bug
```

Final Boss:

```text
boss_king_bloxley
```

---

## 4. Boss List

| ID                        | Name               | Stage | Personality                    | Main Mechanic           |
| ------------------------- | ------------------ | ----: | ------------------------------ | ----------------------- |
| `boss_cupcake_slime_king` | Cupcake Slime King |     1 | Hungry and adorable            | Sticky blocks           |
| `boss_prototype_no_7`     | Prototype No. 7    |     2 | Broken machine with confidence | Junk + bomb blocks      |
| `boss_gelato_golem`       | Gelato Golem       |     3 | Cool, slow, melty              | Ice/freeze              |
| `boss_sir_snore_a_lot`    | Sir Snore-a-Lot    |     4 | Sleepy pillow knight           | Sleep + shield          |
| `boss_high_score_hydra`   | High Score Hydra   |     5 | Obsessed with points           | Combo/cascade test      |
| `boss_king_bloxley`       | King Bloxley       |     6 | Bossy block mascot king        | Symmetry + royal blocks |

---

## 5. Monster Roster

### Stage 1 Monsters

| ID                   | Name           | Role      | Behavior                      |
| -------------------- | -------------- | --------- | ----------------------------- |
| `mon_cupcake_slime`  | Cupcake Slime  | basic     | Basic attack, drops sprinkles |
| `mon_sugar_bat`      | Sugar Bat      | disruptor | Hides next block briefly      |
| `mon_crumb_goblin`   | Crumb Goblin   | junk      | Throws crumb junk blocks      |
| `mon_jelly_rat`      | Jelly Rat      | fast      | Attacks faster                |
| `mon_sprinkle_snail` | Sprinkle Snail | support   | Adds sticky blocks slowly     |
| `mon_frosting_blob`  | Frosting Blob  | tank      | Has soft armor                |

### Stage 2 Monsters

| ID                  | Name          | Role      | Behavior                     |
| ------------------- | ------------- | --------- | ---------------------------- |
| `mon_wrench_goblin` | Wrench Goblin | disruptor | Adds junk block              |
| `mon_button_masher` | Button Masher | chaos     | Board shake                  |
| `mon_spring_bot`    | Spring Bot    | speed     | Speeds up next piece briefly |
| `mon_spark_gremlin` | Spark Gremlin | caster    | Mana zap                     |
| `mon_gear_slime`    | Gear Slime    | tank      | Armor + slow attack          |
| `mon_rattle_drone`  | Rattle Drone  | flying    | Random column junk           |

### Stage 3 Monsters

| ID                    | Name            | Role      | Behavior                        |
| --------------------- | --------------- | --------- | ------------------------------- |
| `mon_ice_cream_imp`   | Ice Cream Imp   | caster    | Applies freeze                  |
| `mon_popsicle_bat`    | Popsicle Bat    | disruptor | Hides hold block                |
| `mon_chill_slime`     | Chill Slime     | control   | Slows fall speed then spikes it |
| `mon_freezer_mimic`   | Freezer Mimic   | trap      | Freezes active block            |
| `mon_snowcone_sprite` | Snowcone Sprite | support   | Creates ice blocks              |
| `mon_pudding_penguin` | Pudding Penguin | basic     | Slides junk blocks              |

### Stage 4 Monsters

| ID                  | Name          | Role      | Behavior                |
| ------------------- | ------------- | --------- | ----------------------- |
| `mon_button_knight` | Button Knight | tank      | Shield self             |
| `mon_blanket_ghost` | Blanket Ghost | control   | Sleep effect            |
| `mon_plush_dragon`  | Plush Dragon  | caster    | Cotton candy flame      |
| `mon_toy_soldier`   | Toy Soldier   | basic     | Formation attack        |
| `mon_pillow_squire` | Pillow Squire | defense   | Soft block shield       |
| `mon_sock_sprite`   | Sock Sprite   | disruptor | Swaps next/hold preview |

### Stage 5 Monsters

| ID                     | Name             | Role      | Behavior                  |
| ---------------------- | ---------------- | --------- | ------------------------- |
| `mon_token_sprite`     | Token Sprite     | economy   | Steals/gives gold         |
| `mon_combo_gremlin`    | Combo Gremlin    | combo     | Punishes no cascade       |
| `mon_neon_bat`         | Neon Bat         | disruptor | Flashes preview           |
| `mon_prize_claw_mimic` | Prize Claw Mimic | trap      | Grabs random block        |
| `mon_pixel_blob`       | Pixel Blob       | basic     | Splits on hit             |
| `mon_joystick_jester`  | Joystick Jester  | chaos     | Reverses controls briefly |

### Stage 6 Monsters

| ID                      | Name              | Role      | Behavior                |
| ----------------------- | ----------------- | --------- | ----------------------- |
| `mon_royal_block_guard` | Royal Block Guard | tank      | Armor + pattern blocks  |
| `mon_square_jester`     | Square Jester     | disruptor | Creates awkward shapes  |
| `mon_crown_bat`         | Crown Bat         | flying    | Hides inventory briefly |
| `mon_parade_golem`      | Parade Golem      | tank      | Marches junk upward     |
| `mon_confetti_mage`     | Confetti Mage     | caster    | Random colorful blocks  |
| `mon_banner_bug`        | Banner Bug        | support   | Buffs enemy attack      |

---

## 6. Heroes, Unlock Conditions, and Story Hooks

| ID                          | Name             | Role              | Unlock                              |
| --------------------------- | ---------------- | ----------------- | ----------------------------------- |
| `hero_milo_blockmancer`     | Milo             | Balanced starter  | Default                             |
| `hero_pippa_pyromancer`     | Pippa            | Fire/spell damage | Defeat Stage 1 boss                 |
| `hero_nixie_frostbinder`    | Nixie            | Control/slow      | Clear 3 rooms without taking damage |
| `hero_bruk_snack_knight`    | Bruk             | High HP/defense   | Collect 500 total gold              |
| `hero_zuzu_goblin_engineer` | Zuzu             | Bomb/board chaos  | Defeat Stage 2 boss                 |
| `hero_lumi_star_witch`      | Lumi             | Mana/cascade      | Trigger 10 cascade combos           |
| `hero_poplin_professor`     | Professor Poplin | Weird utility     | Finish normal ending                |
| `hero_bloop_slime_friend`   | Bloop            | Sticky/cute chaos | Befriend 20 slimes                  |

### Milo — The Blockmancer

Apprentice Blockmancer, originally assigned to lemonade duty. He can hear the “plink plonk” language of rune blocks.

```text
Story vibe: “I can fix this. Probably.”
```

### Pippa — The Pyromancer

Festival baker whose oven was taken over by rune blocks.

```text
Story vibe: “Nobody steals my cupcakes.”
```

### Nixie — The Frostbinder

Ice cream cart mage trying to recover her stolen rainbow ice cream.

```text
Story vibe: “Stay chill, stack clean.”
```

### Bruk — The Snack Knight

Knight sworn to protect festival food.

```text
Story vibe: “No snack left behind.”
```

### Zuzu — The Goblin Engineer

Goblin engineer, partly responsible for the machine going wild.

```text
Story vibe: “Explosion means progress.”
```

### Lumi — The Star Witch

Dreamy star witch who thinks shiny blocks are friends.

```text
Story vibe: “That purple block has main character energy.”
```

### Professor Poplin

Old wizard inventor of the Block-O-Matic 3000.

```text
Story vibe: “I definitely read most of the manual.”
```

### Bloop

A friendly slime who follows the player after being defeated or befriended enough times.

```text
Story vibe: “Bloop!”
```

---

## 7. Weapons

The weapon tone should be festival, toy, kitchen, and gadget themed.

| ID                     | Name             | Type   | Effect                    |
| ---------------------- | ---------------- | ------ | ------------------------- |
| `wpn_basic_wand`       | Basic Wand       | wand   | No bonus                  |
| `wpn_lemonade_wand`    | Lemonade Wand    | wand   | Mana gain +10%            |
| `wpn_cookie_spatula`   | Cookie Spatula   | blade  | Fire damage +8            |
| `wpn_snowcone_staff`   | Snowcone Staff   | staff  | Frost effects +0.05 slow  |
| `wpn_spring_hammer`    | Spring Hammer    | hammer | Hard drop damage +5       |
| `wpn_confetti_cannon`  | Confetti Cannon  | gadget | Bomb block chance         |
| `wpn_star_scepter`     | Star Scepter     | wand   | Cascade damage +10%       |
| `wpn_goblin_multitool` | Goblin Multitool | gadget | Junk/bomb manipulation    |
| `wpn_plush_lance`      | Plush Lance      | toy    | Shield +3 on battle start |
| `wpn_arcade_blaster`   | Arcade Blaster   | arcade | Fever gain +15%           |

---

## 8. Spells

The spell tone should be magical, silly, bright, and festival-themed.

| ID                    | Name            | School  | Effect                    |
| --------------------- | --------------- | ------- | ------------------------- |
| `spl_fireball`        | Fireball        | fire    | Damage enemy              |
| `spl_frost_lock`      | Frost Lock      | frost   | Slow fall speed           |
| `spl_bomb_rune`       | Bomb Rune       | bomb    | Clear area                |
| `spl_clean_cut`       | Clean Cut       | arcane  | Clear row                 |
| `spl_sprinkle_shower` | Sprinkle Shower | candy   | Gain mana + buff blocks   |
| `spl_cupcake_blast`   | Cupcake Blast   | candy   | Damage + sticky clear     |
| `spl_confetti_pop`    | Confetti Pop    | party   | Clear random cells        |
| `spl_bubble_shield`   | Bubble Shield   | defense | Gain shield               |
| `spl_star_spark`      | Star Spark      | star    | Combo-scaling damage      |
| `spl_jelly_bounce`    | Jelly Bounce    | utility | Delay enemy               |
| `spl_snowcone_burst`  | Snowcone Burst  | frost   | Freeze enemy attack       |
| `spl_goblin_gadget`   | Goblin Gadget   | gadget  | Random helpful effect     |
| `spl_rainbow_reroll`  | Rainbow Reroll  | utility | Reroll active/next piece  |
| `spl_snack_break`     | Snack Break     | healing | Heal player               |
| `spl_cascade_cheer`   | Cascade Cheer   | combo   | Boost next cascade reward |

---

## 9. Relics / Items

Relics should feel like cute collectibles or festival souvenirs.

| ID                     | Name             | Rarity    | Effect                         |
| ---------------------- | ---------------- | --------- | ------------------------------ |
| `rel_goblin_coin`      | Goblin Coin      | common    | Gold gain +20%                 |
| `rel_lucky_cupcake`    | Lucky Cupcake    | common    | Heal after boss                |
| `rel_sparkly_spoon`    | Sparkly Spoon    | common    | Line damage +1                 |
| `rel_sticky_sticker`   | Sticky Sticker   | uncommon  | Sticky blocks give mana        |
| `rel_confetti_popper`  | Confetti Popper  | uncommon  | Chance clear random cell       |
| `rel_rainbow_ticket`   | Rainbow Ticket   | rare      | Extra reward choice            |
| `rel_tiny_toolbox`     | Tiny Toolbox     | uncommon  | Bomb spell cost -5             |
| `rel_plush_helmet`     | Plush Helmet     | rare      | Prevent lethal damage once     |
| `rel_snowflake_charm`  | Snowflake Charm  | uncommon  | Frost spells stronger          |
| `rel_star_cookie`      | Star Cookie      | rare      | Cascade damage +20%            |
| `rel_bouncy_boots`     | Bouncy Boots     | common    | Hard drop gives mana           |
| `rel_arcade_token`     | Arcade Token     | rare      | Fever starts at 25%            |
| `rel_recipe_card`      | Recipe Card      | uncommon  | Fire/candy spell synergy       |
| `rel_friendship_badge` | Friendship Badge | legendary | Monster attacks weaker         |
| `rel_block_o_manual`   | Block-O Manual   | legendary | Once per battle, fix messy row |

---

## 10. Upgrades

| ID                    | Name            | Category  | Effect                  |
| --------------------- | --------------- | --------- | ----------------------- |
| `upg_clean_stack`     | Clean Stack     | board     | Fall speed -0.05        |
| `upg_sharp_sprinkles` | Sharp Sprinkles | damage    | Line damage +2          |
| `upg_extra_frosting`  | Extra Frosting  | defense   | Max HP +3               |
| `upg_mana_lemonade`   | Mana Lemonade   | mana      | Mana gain +10%          |
| `upg_combo_cheer`     | Combo Cheer     | combo     | Cascade damage +10%     |
| `upg_bigger_booms`    | Bigger Booms    | spell     | Bomb Rune radius +1     |
| `upg_hotter_oven`     | Hotter Oven     | fire      | Fireball +10 damage     |
| `upg_chill_zone`      | Chill Zone      | frost     | Frost Lock stronger     |
| `upg_pocket_snack`    | Pocket Snack    | heal      | Heal 1 after every room |
| `upg_bonus_preview`   | Bonus Preview   | board     | Show extra next block   |
| `upg_quick_hold`      | Quick Hold      | board     | Hold cooldown reduced   |
| `upg_inventory_pouch` | Inventory Pouch | inventory | +2 item slots           |
| `upg_lucky_roll`      | Lucky Roll      | reward    | Reroll reward once      |
| `upg_festival_fever`  | Festival Fever  | fever     | Fever fills faster      |
| `upg_smooth_cascade`  | Smooth Cascade  | cascade   | Cascade gives more mana |

---

## 11. Board Blocks

Board blocks are a major part of the game's identity.

| ID                  | Name           | Type    | Effect                       |
| ------------------- | -------------- | ------- | ---------------------------- |
| `block_red_rune`    | Red Rune       | normal  | Basic                        |
| `block_blue_rune`   | Blue Rune      | normal  | Basic                        |
| `block_green_rune`  | Green Rune     | normal  | Basic                        |
| `block_yellow_rune` | Yellow Rune    | normal  | Basic                        |
| `block_sprinkle`    | Sprinkle Block | bonus   | +mana on clear               |
| `block_cupcake`     | Cupcake Block  | heal    | Small heal on clear          |
| `block_bomb`        | Bomb Block     | special | Explodes area                |
| `block_star`        | Star Block     | combo   | Boost cascade                |
| `block_jelly`       | Jelly Block    | soft    | Falls/bounces during cascade |
| `block_ice`         | Ice Block      | control | May slide/freeze             |
| `block_sticky`      | Sticky Block   | hazard  | Harder to collapse           |
| `block_crumb_junk`  | Crumb Junk     | junk    | Enemy junk                   |
| `block_royal`       | Royal Block    | boss    | Must clear pattern           |
| `block_confetti`    | Confetti Block | random  | Random bonus                 |
| `block_toolbox`     | Toolbox Block  | gadget  | Gives item charge            |

---

## 12. Status Effects

Rename dark debuffs into funny, readable statuses.

| ID                   | Name        | Target       | Effect                  |
| -------------------- | ----------- | ------------ | ----------------------- |
| `status_sugar_rush`  | Sugar Rush  | enemy/player | Faster action           |
| `status_sticky`      | Sticky      | board        | Blocks harder to drop   |
| `status_chilled`     | Chilled     | enemy/board  | Slower fall/enemy       |
| `status_sleepy`      | Sleepy      | enemy        | Skip action             |
| `status_dizzy`       | Dizzy       | enemy        | Weaker attack           |
| `status_sparkly`     | Sparkly     | player       | Extra mana gain         |
| `status_bubbled`     | Bubbled     | player       | Shield                  |
| `status_confetti`    | Confetti    | board        | Random bonus cell       |
| `status_snack_boost` | Snack Boost | player       | Heal/mana over time     |
| `status_overclocked` | Overclocked | enemy/board  | More junk, more rewards |

---

## 13. Items / Inventory

Since the UI includes inventory, the game should support consumable items.

### Consumables

| ID                   | Name          | Effect                       |
| -------------------- | ------------- | ---------------------------- |
| `item_mini_cupcake`  | Mini Cupcake  | Heal 5 HP                    |
| `item_mana_lemonade` | Mana Lemonade | Gain 30 mana                 |
| `item_rainbow_soda`  | Rainbow Soda  | Fill fever +20%              |
| `item_toolbox`       | Toolbox       | Remove 3 junk blocks         |
| `item_snowcone`      | Snowcone      | Slow fall speed temporarily  |
| `item_party_popper`  | Party Popper  | Clear random 5 cells         |
| `item_bubble_gum`    | Bubble Gum    | Gain 8 shield                |
| `item_lucky_ticket`  | Lucky Ticket  | Reroll reward                |
| `item_hold_coupon`   | Hold Coupon   | Refresh hold block           |
| `item_block_polish`  | Block Polish  | Convert junk to normal block |

### Inventory Rules

```text
- Inventory visible as compact overlay near board.
- Max slots default: 6.
- Items stack by type.
- Consumables can be used during battle or event depending on item.
- On mobile, tap inventory icon to expand.
```

---

## 14. Room Events

| ID                        | Name                | Choices                                      |
| ------------------------- | ------------------- | -------------------------------------------- |
| `evt_suspicious_button`   | Suspicious Button   | Press / Label it / Walk away                 |
| `evt_lost_cake_cart`      | Lost Cake Cart      | Take snack / Return cart / Trade             |
| `evt_goblin_quality_test` | Goblin Quality Test | Try gadget / Refuse / Pay for safe version   |
| `evt_rainbow_fountain`    | Rainbow Fountain    | Heal / Gain mana / Get random status         |
| `evt_sleepy_guard`        | Sleepy Guard        | Let him sleep / Wake him / Take key          |
| `evt_arcade_challenge`    | Arcade Challenge    | Combo challenge / Pay token / Leave          |
| `evt_block_o_manual_page` | Manual Page         | Learn tip / Gain upgrade / Confusing diagram |
| `evt_friendship_slime`    | Friendship Slime    | Feed / Pet / Recruit?                        |

---

## 15. Shops

### Shop NPCs

| ID                    | Name                        | Shop Type       |
| --------------------- | --------------------------- | --------------- |
| `npc_marnie_merchant` | Marnie the Merchant         | General items   |
| `npc_zuzu_shop`       | Zuzu’s Questionable Gadgets | Bomb/gadget     |
| `npc_nixie_cart`      | Nixie’s Ice Cream Cart      | Heal/control    |
| `npc_ticket_imp`      | Ticket Imp                  | Rerolls/rewards |

### Shop Items

```text
Mini Cupcake
Mana Lemonade
Toolbox
Lucky Ticket
Random Upgrade
Random Relic
Remove Silly Drawback
Buy Spell Upgrade
Inventory Pouch
```

---

## 16. Oopsies / Silly Drawbacks

Do not call them curses in the cheerful version. Use:

```text
Silly Drawbacks
Festival Mishaps
Oopsies
```

| ID                         | Name                | Effect                           |
| -------------------------- | ------------------- | -------------------------------- |
| `oops_heavy_blocks`        | Heavy Blocks        | Fall speed +0.1                  |
| `oops_slippery_buttons`    | Slippery Buttons    | Tiny movement delay              |
| `oops_too_much_confetti`   | Too Much Confetti   | Preview flashes sometimes        |
| `oops_snack_tax`           | Snack Tax           | Shop prices +15%                 |
| `oops_sticky_floor`        | Sticky Floor        | More sticky blocks               |
| `oops_overexcited_machine` | Overexcited Machine | More junk, better rewards        |
| `oops_square_only`         | Square Only         | Boss pattern challenge           |
| `oops_sugar_crash`         | Sugar Crash         | Mana gain lower after spell spam |

---

## 17. NPCs

| ID                       | Name               | Role              |
| ------------------------ | ------------------ | ----------------- |
| `npc_professor_poplin`   | Professor Poplin   | Inventor/tutorial |
| `npc_marnie_merchant`    | Marnie             | Shop              |
| `npc_ticket_imp`         | Ticket Imp         | Arcade challenge  |
| `npc_bloop`              | Bloop              | Slime friend      |
| `npc_king_bloxley`       | King Bloxley       | Final boss        |
| `npc_festival_announcer` | Festival Announcer | Stage intro       |
| `npc_cake_judge`         | Cake Judge         | Side quest        |
| `npc_repair_sprite`      | Repair Sprite      | Upgrade station   |

---

## 18. Currencies / Collectibles

| ID                             | Name             | Use                  |
| ------------------------------ | ---------------- | -------------------- |
| `currency_gold`                | Gold             | Shop                 |
| `currency_tickets`             | Festival Tickets | Meta unlock / arcade |
| `currency_sprinkles`           | Sprinkles        | Upgrade/cosmetic     |
| `currency_stars`               | Star Tokens      | Rare unlocks         |
| `collectible_lost_cake`        | Lost Cake        | True ending          |
| `collectible_manual_page`      | Manual Page      | Tutorial/lore        |
| `collectible_friendship_badge` | Friendship Badge | Hero/NPC unlock      |
| `collectible_arcade_token`     | Arcade Token     | Starfall Arcade      |

---

## 19. Loot Tables

Recommended loot tables:

```text
loot_battle_default
loot_stage1_candy
loot_stage2_workshop
loot_stage3_frosty
loot_stage4_pillow
loot_stage5_arcade
loot_stage6_palace
loot_elite_default
loot_boss_default
loot_shop_default
loot_treasure_default
loot_event_default
loot_true_ending
```

Stage-themed loot direction:

```text
Stage 1: cupcake, sprinkle, sticky
Stage 2: gadget, bomb, toolbox
Stage 3: ice, slow, shield
Stage 4: sleep, defense, plush
Stage 5: combo, fever, arcade
Stage 6: royal, symmetry, final upgrades
```

---

## 20. Asset Direction

### UI Theme

```text
Pixel-art 32-bit
Bright fantasy
Festival colors
Rounded chunky panels
Candy / toy / rune motifs
No dark edgy skull-heavy UI
```

### Fonts

Use pixel-style fonts:

```text
font_pixel_header
font_pixel_body
font_pixel_number
```

### Sprite Categories

```text
heroes/
monsters/
bosses/
spells/
items/
relics/
upgrades/
board-blocks/
ui/
map/
stage-backgrounds/
effects/
npc/
```

---

## 21. Rename / Replace Old Dark Content

| Old                     | New                        |
| ----------------------- | -------------------------- |
| Falling King            | King Bloxley               |
| Void Scholar dark story | Lumi / cheerful star witch |
| Broken Hourglass        | Wobbly Clock               |
| Cracked Crown           | Crooked Crown              |
| Dragon Tooth            | Plush Dragon Button        |
| Slime Core              | Jelly Core                 |
| Void Cut                | Clean Cut / Magic Slice    |
| Mana Hex                | Sugar Crash                |
| Curse                   | Oopsie / Mishap            |
| Dark Dungeon            | Festival Dungeon           |
| Royal Collapse          | Everything Must Be Square  |

---

## 22. Recommended Alpha Content Pack

A release-alpha content pack should include:

```text
Heroes: 6
- Milo
- Pippa
- Nixie
- Bruk
- Zuzu
- Lumi

Stages: 6
- Sprinkle Sewers
- Goblin Workshop
- Frosty Pantry
- Pillow Castle
- Starfall Arcade
- Bloxley’s Block Palace

Monsters: 36
- 6 per stage

Bosses: 6
- 1 per stage

Weapons: 10

Spells: 15

Relics: 15

Upgrades: 15

Board Blocks: 15

Status Effects: 10

Items: 10

Events: 8

Oopsies: 8

NPCs: 8

Loot Tables: 12
```

---

## 23. Codex Prompt — Update Content to New Core Concept

```text
Update Blockmancer Dungeon content to match the new lighthearted cheerful fantasy core concept.

New core concept:
Blockmancer Dungeon is a cheerful falling-block roguelike RPG where a magical festival machine called the Block-O-Matic 3000 goes haywire and creates a colorful dungeon under the town square. The player clears rune block lines, triggers Cascade Gravity combos, casts silly spells, collects snacks/relics/upgrades, unlocks quirky heroes, and saves the Festival of Falling Stars from King Bloxley, the self-appointed Block King.

Tone:
- Cheerful fantasy
- Cute chaos
- Festival adventure
- Pixel-art 32-bit
- Funny monsters
- No edgy/dark tragedy

Replace or update old dark content with new cheerful content.

Create/update content data for:
- heroes
- monsters
- bosses
- weapons
- spells
- relics
- upgrades
- board-blocks
- status-effects
- items
- room-events
- oopsies / silly drawbacks
- NPCs
- currencies / collectibles
- loot-tables
- stages / biomes

Use these stage themes:
1. Sprinkle Sewers
2. Goblin Workshop
3. Frosty Pantry
4. Pillow Castle
5. Starfall Arcade
6. Bloxley’s Block Palace

Final boss:
King Bloxley

Core mechanic:
Cascade Gravity should remain a main identity mechanic.

Rules:
- Keep all JSON valid.
- Use placeholder asset keys.
- Use cute/funny descriptions.
- Preserve gameplay effect types where possible.
- Rename curses to oopsies or silly drawbacks.
- Update loot tables to stage-themed rewards.
- Update hero unlock conditions.
- Update docs to reflect new cheerful story and content.
- Run validation and build after changes.
```

---

## 24. Summary Direction

The new direction is:

```text
Not a dark cursed dungeon.
A festival machine exploded into a cute chaotic puzzle dungeon.
```

The content that needs the most changes:

```text
1. Monster theme
2. Boss theme
3. Relic/item names
4. Curse -> Oopsie
5. Stage names
6. Hero stories
7. UI/art direction
8. Loot tables
```
