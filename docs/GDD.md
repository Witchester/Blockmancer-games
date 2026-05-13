# Blockmancer Dungeon GDD

## 1. Game Overview
Blockmancer Dungeon is a Tetris-inspired combat roguelike puzzle RPG where the player clears falling block lines to damage enemies, generate mana, cast spells, survive board disruption, choose rewards, and progress through a dungeon map. The current project target is a placeholder-heavy but fully playable MVP built with Vite, TypeScript, Phaser 3, and Capacitor support for future Android packaging.

Current placeholder status:
- Gameplay systems are implemented with shapes, text, and generated UI
- No final art pipeline is in scope yet
- Audio can remain placeholder or absent
- Content breadth is intentionally limited while architecture is stabilized

## 2. Core Fantasy
The player is a Blockmancer, a mage trapped in a cursed dungeon. Instead of wielding swords or conventional spells alone, the player manipulates a magical falling-block battlefield. Each line clear feels like collapsing arcane terrain beneath an enemy’s feet.

## 3. Unique Selling Point
The core hook is:

The player is not just stacking blocks. The player is fighting monsters by controlling a collapsing magical battlefield.

What differentiates the game:
- Puzzle actions are combat actions
- Enemies attack both the player and the board state
- Mana and spells reward board mastery instead of replacing it
- Roguelike decisions shape each run through map routing and rewards

## 4. Target Player Experience
The intended player experience is:
- Immediate readability
- Constant tactical pressure
- Momentum through combos and spell timing
- Satisfying room-to-room progression
- Clear run identity through rewards, relics, and upgrades

The placeholder MVP should already feel like:
- A combat puzzle game rather than pure score attack
- A run-based dungeon crawl rather than isolated battles
- A system that can scale into deeper content later

## 5. Core Gameplay Loop
The long-term core loop:
1. Start a run and choose a hero.
2. Move through a dungeon node map.
3. Resolve room type.
4. In battle rooms, play the falling-block board.
5. Clear lines to deal damage and gain mana.
6. Cast spells to stabilize the board or burst enemies down.
7. Survive enemy attacks and disruption.
8. Win the room and choose rewards.
9. Continue deeper until defeat or boss victory.

Current placeholder MVP loop:
1. Start a run from the main menu.
2. Enter the map.
3. Select room nodes.
4. Fight on a 10x20 board.
5. Gain rewards and progress stage difficulty.
6. Reach the boss or die.

## 6. Run Structure
A run is a sequence of linked dungeon rooms that gradually increase pressure. Each run tracks:
- Player HP
- Mana
- Gold
- Stage
- Fall speed
- Owned rewards or relic-like upgrades
- Map progress
- Current room state
- Defeat or victory outcome

Room categories:
- Start
- Fight
- Event
- Shop
- Elite
- Rest
- Treasure
- Boss

Current placeholder implementation uses a fixed branching map rather than procedural generation.

## 7. Battle System
Battles take place inside a dedicated board-driven combat scene. The player manipulates tetromino-like pieces while an enemy waits on the right panel and attacks after a lock-based cadence.

Battle flow:
1. Spawn the enemy.
2. Spawn a falling piece.
3. Let the player place and rotate pieces.
4. Lock the piece.
5. Resolve line clears.
6. Apply damage, mana gain, and combo changes.
7. Count down enemy attacks.
8. Resolve enemy behavior if the attack counter reaches zero.
9. Continue until enemy death, player death, or top-out.

Current placeholder rules prioritize clarity and stability over high simulation depth.

## 8. Board System
The board is the heart of the game and uses a playable falling-block model:
- 10 columns
- 20 rows
- Tetromino-like I, O, T, S, Z, J, and L pieces
- Active piece movement
- Rotation with simple kick behavior
- Soft drop
- Hard drop
- Collision detection
- Piece locking
- Line clear detection
- Next piece preview
- Top-out loss condition

### Cascade Gravity System
Blockmancer Dungeon uses a core mechanic called Cascade Gravity System. When the player clears one or more completed rows, remaining blocks above fall straight down within their own columns instead of shifting full rows downward like classic Tetris. This creates Puyo-style cascade clears while keeping the board deterministic and fair.

Key design points:
- Completed lines are detected and removed.
- Remaining cells in each column collapse downward to fill empty spaces.
- After gravity settles, the board is scanned again for new completed lines.
- New completed lines clear automatically and can trigger additional cascades.
- Cascades award extra combo, damage, and mana.
- This is intentionally not a real physics engine: the behavior is grid-based, deterministic, and performance-friendly.

Why this is different from classic Tetris:
- Classic Tetris shifts whole rows down when a line clears.
- Cascade Gravity collapses each column independently, so blocks fall straight down into holes below.
- The result is more chain-friendly, with predictable cascades rather than row-based row shakes.
- The system is designed to be playable on mobile and easy to tune for balance.

Current placeholder status:
- The board is fully playable
- Advanced guideline behavior is not required yet
- No hold queue exists yet
- No final scoring layer exists yet

## 9. Light Physics Placeholder Design
The game fantasy references collapsing magical terrain and unstable board pressure, but the current build intentionally avoids real physics simulation.

Placeholder physics-like effects:
- Junk blocks rising from enemy attacks
- Camera shake on enemy impact
- Board cell clearing from bomb-like spells
- Fall speed increases from pressure effects
- Preview hiding from bat-like enemies
- Mana hex effects from caster enemies

Future expansion can add:
- Unstable blocks
- Board shake affecting control windows
- Partial collapse behavior
- More dynamic enemy disruption patterns

## 10. Combat Rules
Baseline player values:
- Max HP: 30
- Max Mana: 100
- Starting Gold: 50
- Base Line Damage: 5
- Base Fall Speed: 1.0

Mana gain baseline:
- 1 line: +10 mana
- 2 lines: +25 mana
- 3 lines: +45 mana
- 4 lines: +70 mana

Line-clear damage bonus baseline:
- 1 line: +0
- 2 lines: +8
- 3 lines: +18
- 4 lines: +35

Combo bonus baseline:
- Combo 1: +0
- Combo 2: +3
- Combo 3: +7
- Combo 4+: +12

Enemy attacks:
- Trigger after a lock countdown
- Deal direct damage
- May also modify the board or battle rules

Win conditions:
- Enemy HP reaches zero
- Boss defeat ends the run in victory

Loss conditions:
- Player HP reaches zero
- Board top-out

## 11. Heroes
Long-term hero design includes multiple playable archetypes with different passives, loadouts, and unlock conditions.

Planned hero examples:
- Blockmancer
- Pyromancer
- Frostbinder
- Gravity Knight
- Void Scholar
- Rune Engineer

Current placeholder state:
- The runtime does not yet have full hero-select content integration
- The current playable run behaves like a default hero template
- Hero metadata exists, but actual hero content entries and selection flow remain future work

## 12. Weapons
Weapons are long-term hero modifiers that shape playstyle through line damage, mana gain, spell power, combo incentives, or fall-speed tradeoffs.

Planned weapon examples:
- Basic Wand
- Apprentice Staff
- Fire Tome
- Gravity Orb
- Rune Blade

Current placeholder state:
- Weapons are not yet fully integrated into runtime gameplay
- Weapon metadata exists for future content-driven authoring

## 13. Monsters
Enemy design centers on readable archetypes with simple disruption hooks:
- Slime: basic attack
- Goblin: junk pressure
- Stone Golem: line-damage mitigation
- Bat: preview denial
- Witch: mana hex
- Elite Knight: heavier attack and junk pressure
- Falling King: boss pressure through speed and junk

Current placeholder state:
- These enemy archetypes are represented in runtime logic
- Content metadata exists
- JSON content entries are still pending

## 14. Spells
Spells convert mana into direct power or board control.

Current core spell set:
- Fireball: direct damage
- Frost Lock: reduce fall speed
- Bomb Rune: damage and clear a board cluster
- Void Cut: damage and clear a row

Long-term spell goals:
- More schools
- More support and utility spells
- Better upgrade paths
- More status effects and board manipulation

## 15. Mana System
Mana ties puzzle execution to magical power.

Rules:
- Generated from line clears
- Capped at a fixed maximum
- Spent when casting spells
- Modified by upgrades, relics, or enemy hexes

Design intent:
- Encourage active board play
- Reward larger clears
- Give the player a second combat axis beyond line damage

## 16. Relics
Relics are passive items that change run texture over time. They should trigger on combat events, room events, or economy hooks.

Planned examples:
- Goblin Coin
- Broken Hourglass
- Slime Core
- Cracked Crown

Current placeholder state:
- Reward logic supports relic-like reward effects
- Full relic content entries and a dedicated runtime system are not fully separated yet

## 17. Upgrades
Upgrades are more immediate bonuses that shape run power.

Current core upgrade pool:
- Sharp Edges
- Mana Echo
- Stable Hands
- Fire Mastery
- Bomb Expert
- Combo Heart
- Arcane Preview
- Stonebreaker
- Emergency Barrier

Current placeholder state:
- Many of these effects exist in runtime logic
- Full content-driven upgrade loading is still pending

## 18. Status Effects
Status effects are temporary conditions that affect player, enemy, or board behavior.

Planned examples:
- Burn
- Freeze
- Stun
- Shield
- Mana Hex
- Slow
- Vulnerable

Current placeholder state:
- Some effect behaviors exist directly in battle code
- A generalized status-effect runtime system does not exist yet
- Metadata exists for future expansion

## 19. Roguelike Map
The map provides routing and room pacing between battles.

Current placeholder behavior:
- Fixed node graph
- Connected progression
- Available-node highlighting
- Completed-node tracking
- Boss node at the final route

Future expansion:
- Procedural routes
- Alternate acts or biomes
- Route difficulty indicators
- Better event clustering

## 20. Events
Events are non-combat choice moments that trade risk, reward, and pacing.

Current placeholder examples:
- Shrine of Gravity
- Broken Anvil
- Strange Mirror
- Lost Knight

Current placeholder state:
- Event logic exists in the map flow
- Dedicated event scenes and content-driven event entries are still planned

## 21. Shops
Shops provide gold sinks and controlled reward access.

Planned shop interactions:
- Heal for gold
- Buy a random reward
- Remove curse placeholder
- Leave

Current placeholder state:
- Shop behavior is implemented inline in map logic
- No dedicated shop scene or inventory model yet

## 22. Rest Sites
Rest sites slow pacing and provide recovery.

Placeholder behavior:
- Heal HP
- Slightly reduce fall speed

Design purpose:
- Give the player a safe node
- Create route tension between safety and reward

## 23. Treasure Rooms
Treasure rooms provide a stronger positive spike.

Placeholder behavior:
- Gain gold
- Gain a random reward

Design purpose:
- Create exciting pacing breaks
- Support reward variety outside combat wins

## 24. Boss Room
The boss room is the run climax. The current boss is the Falling King.

Boss design goals:
- More HP than normal enemies
- More disruptive board pressure
- Stronger attacks
- Higher stage stakes

Current placeholder state:
- Boss spawn and victory are implemented
- No multi-phase behavior yet

## 25. Difficulty Scaling
Current baseline difficulty scaling:
- Stage increases after each battle
- Fall speed increases by 0.05 per battle
- Enemy HP gains +8 per stage
- Enemy attack scales upward
- Fall speed is clamped to a playable cap

Future scaling improvements:
- Stronger elite pacing
- Different curves by mode
- More board-disruption intensity by stage
- Separate mobile-friendly tuning

## 26. Save System
The save system preserves run continuity through localStorage.

Current save scope:
- Player stats
- Stage
- Fall speed
- Map progress
- Current room state
- Reward state
- Enemy state when relevant

Current placeholder limitation:
- Save granularity is scene-safe rather than every-frame exact
- Future content-driven runs may need a more explicit default-run-state model

## 27. UI Layout
Battle layout currently follows:

Top:
- HP
- Mana
- Gold
- Stage
- Fall speed
- Combo

Left:
- Board grid
- Preview

Right:
- Enemy card
- Enemy HP bar
- Enemy intent
- Spells
- Reward or upgrade summary

Bottom:
- Event log
- Controls hint
- Mobile buttons

Current UI status:
- Clean placeholder readability
- No final art assets
- No full design system yet

## 28. Mobile Controls
The project is intended to remain mobile-aware from the MVP stage.

Current mobile controls:
- Left
- Right
- Rotate
- Drop
- Spell buttons

Current placeholder limitation:
- Layout is serviceable but not fully tuned for small screens
- No dedicated touch-input abstraction layer yet

## 29. MVP Scope
The current MVP target includes:
- Playable web build
- Buildable production web output
- Phaser scene flow for menu, map, battle, reward, and game over
- Falling-block board
- Enemy combat loop
- Four spells
- Reward progression
- Basic save/load
- Capacitor Android preparation

The MVP does not yet require:
- Final art
- Final audio
- Full procedural map generation
- Full content authoring pipeline in runtime
- Exact competitive Tetris behavior

## 30. Full Game Expansion
Planned expansion areas:
- Hero select and hero-specific passives
- Weapon-driven playstyles
- More monsters and status effects
- Dedicated event, shop, rest, and treasure scenes
- ContentRegistry and content entry JSON loading
- Audio system
- Better mobile UX
- Procedural maps and multiple acts
- Meta progression and unlocks

## 31. Known Risks
Current project risks:
- Implementation has moved ahead of some planned documentation and content layers
- Some systems are still hardcoded instead of fully content-driven
- Scene responsibilities are broader than the intended final split
- Mobile usability needs more tuning
- Android build success depends on local SDK setup
- Save structure may need migration once hero and content-entry systems are added

Mitigation approach:
- Finish missing docs and content scaffolding first
- Add ContentRegistry before deeper content expansion
- Split inline room logic into dedicated scenes and systems over time
