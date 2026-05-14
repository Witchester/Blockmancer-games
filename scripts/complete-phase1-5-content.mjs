import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'game', 'content');

function writeJson(relativePath, data) {
  const fullPath = path.join(contentRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(`${fullPath}`, `${JSON.stringify(data, null, 2)}\n`);
}

const monsterTemplates = [
  ['sprinkle_rat', 'Sprinkle Rat', 'dungeon', 24, 3, 'intent_attack', 'Nibble Dash', 'basic_attack'],
  ['syrup_slug', 'Syrup Slug', 'dungeon', 32, 3, 'intent_guard', 'Sticky Wiggle', 'reduce_line_damage'],
  ['cupcake_imp', 'Cupcake Imp', 'dungeon', 38, 4, 'intent_throw_junk', 'Crumb Toss', 'spawn_junk'],
  ['bubble_bat', 'Bubble Bat', 'dungeon', 30, 3, 'intent_screech', 'Bubble Blind', 'hide_next_piece'],
  ['pipe_peeker', 'Pipe Peeker', 'dungeon', 34, 4, 'intent_attack', 'Pipe Pop', 'basic_attack'],
  ['gadget_goblin', 'Gadget Goblin', 'royal_ruins', 46, 5, 'intent_throw_junk', 'Loose Screws', 'spawn_junk'],
  ['wrench_wisp', 'Wrench Wisp', 'royal_ruins', 40, 4, 'intent_hex', 'Mana Rattle', 'mana_hex'],
  ['spring_bot', 'Spring Bot', 'royal_ruins', 52, 5, 'intent_charge', 'Speed Spring', 'increase_fall_speed'],
  ['gear_gremlin', 'Gear Gremlin', 'royal_ruins', 44, 5, 'intent_summon', 'Gear Scatter', 'spawn_junk'],
  ['bolt_beetle', 'Bolt Beetle', 'royal_ruins', 50, 4, 'intent_guard', 'Shell Guard', 'reduce_line_damage'],
  ['snowcone_sprite', 'Snowcone Sprite', 'ice_cave', 42, 4, 'intent_screech', 'Frost Blink', 'hide_next_piece'],
  ['frosting_fox', 'Frosting Fox', 'ice_cave', 48, 5, 'intent_attack', 'Cold Snap', 'basic_attack'],
  ['gelato_blob', 'Gelato Blob', 'ice_cave', 56, 4, 'intent_guard', 'Gelato Guard', 'reduce_line_damage'],
  ['chilly_churro', 'Chilly Churro', 'ice_cave', 50, 5, 'intent_hex', 'Sugar Chill', 'mana_hex'],
  ['ice_pop_mimic', 'Ice Pop Mimic', 'ice_cave', 58, 6, 'intent_charge', 'Brain Freeze', 'freeze_piece'],
  ['pillow_pawn', 'Pillow Pawn', 'royal_ruins', 60, 5, 'intent_attack', 'Soft Bop', 'basic_attack'],
  ['blanket_bard', 'Blanket Bard', 'royal_ruins', 54, 4, 'intent_hex', 'Lullaby Hex', 'mana_hex'],
  ['snore_squire', 'Snore Squire', 'royal_ruins', 66, 6, 'intent_guard', 'Nap Guard', 'armor_up'],
  ['dream_drummer', 'Dream Drummer', 'royal_ruins', 58, 5, 'intent_heavy_slam', 'Bedtime Boom', 'shake_board'],
  ['quilt_knight', 'Quilt Knight', 'royal_ruins', 72, 7, 'intent_attack', 'Tucked Charge', 'basic_attack'],
  ['arcade_spark', 'Arcade Spark', 'void', 62, 6, 'intent_attack', 'Pixel Zap', 'basic_attack'],
  ['ticket_tumbler', 'Ticket Tumbler', 'void', 64, 5, 'intent_throw_junk', 'Ticket Jam', 'spawn_junk'],
  ['combo_crab', 'Combo Crab', 'void', 70, 6, 'intent_charge', 'Combo Pinch', 'increase_fall_speed'],
  ['joystick_jinxer', 'Joystick Jinxer', 'void', 66, 5, 'intent_hex', 'Button Jinx', 'mana_hex'],
  ['score_specter', 'Score Specter', 'void', 74, 7, 'intent_screech', 'Screen Glitch', 'hide_next_piece'],
  ['royal_page', 'Royal Page', 'royal_ruins', 76, 7, 'intent_throw_junk', 'Royal Errand', 'spawn_junk'],
  ['crown_mime', 'Crown Mime', 'royal_ruins', 78, 6, 'intent_guard', 'Invisible Wall', 'reduce_line_damage'],
  ['block_baron', 'Block Baron', 'royal_ruins', 84, 8, 'intent_heavy_slam', 'Baron Bash', 'shake_board'],
  ['palace_jester', 'Palace Jester', 'royal_ruins', 80, 7, 'intent_hex', 'Royal Razzle', 'mana_hex']
];

for (const [id, name, biome, hp, attack, intentId, intentLabel, behavior] of monsterTemplates) {
  writeJson(`monsters/${id}.json`, {
    id: `mon_${id}`,
    name,
    description: `${name} joins the festival dungeon with cheerful trouble.`,
    rarity: hp >= 70 ? 'rare' : hp >= 50 ? 'uncommon' : 'common',
    tier: Math.min(5, Math.max(1, Math.ceil(hp / 20))),
    role: behavior === 'spawn_junk' ? 'summoner' : behavior === 'mana_hex' ? 'caster' : 'basic',
    biome,
    spriteKey: `placeholder_${id}`,
    stats: { hp, attack, armor: behavior === 'reduce_line_damage' ? 1 : 0, attackIntervalLocks: hp >= 70 ? 3 : 4 },
    intent: { id: intentId, label: intentLabel, description: `${name} prepares ${intentLabel}.` },
    behaviors: [behavior],
    resistances: [],
    weaknesses: [],
    scaling: { hpPerStage: 8, attackPerStage: 0.5, fallSpeedModifier: behavior === 'increase_fall_speed' ? 0.02 : 0 },
    rewards: { goldMin: 10, goldMax: 28, rewardRolls: 1, lootTableId: 'loot_battle_default' },
    tags: ['early_game'],
    enabled: true
  });
}

const bossTemplates = [
  ['cupcake_slime_king', 'Cupcake Slime King', 150, 9, 'Sticky Crown', 'spawn_junk'],
  ['prototype_no_7', 'Prototype No. 7', 170, 10, 'Workshop Whirr', 'shake_board'],
  ['gelato_golem', 'Gelato Golem', 185, 11, 'Frozen Scoop', 'freeze_piece'],
  ['sir_snore_a_lot', 'Sir Snore-a-Lot', 200, 10, 'Sleepy Shield', 'armor_up'],
  ['high_score_hydra', 'High Score Hydra', 220, 12, 'Combo Challenge', 'increase_fall_speed'],
  ['king_bloxley', 'King Bloxley', 250, 13, 'Royal Collapse', 'spawn_junk']
];

for (const [id, name, hp, attack, intentLabel, behavior] of bossTemplates) {
  writeJson(`monsters/boss-${id}.json`, {
    id: `mon_boss_${id}`,
    name,
    description: `${name} rules a festival stage with loud, silly confidence.`,
    rarity: 'boss',
    tier: 5,
    role: 'boss',
    biome: 'royal_ruins',
    spriteKey: `placeholder_${id}`,
    stats: { hp, attack, armor: 1, attackIntervalLocks: 3 },
    intent: { id: 'intent_royal_collapse', label: intentLabel, description: `${name} prepares ${intentLabel}.` },
    behaviors: [behavior],
    resistances: [],
    weaknesses: ['combo_damage'],
    scaling: { hpPerStage: 10, attackPerStage: 1, fallSpeedModifier: 0.02 },
    rewards: { goldMin: 40, goldMax: 75, rewardRolls: 2, lootTableId: 'loot_boss_default' },
    tags: ['boss_phase'],
    enabled: true
  });
}

const stages = [
  ['frosty-pantry', 'stage_frosty_pantry', 'Frosty Pantry', 'A freezer aisle full of snowcones and chilly snacks.', 'ice_cave', 'mon_boss_gelato_golem'],
  ['pillow-castle', 'stage_pillow_castle', 'Pillow Castle', 'A soft fortress where sleepy guards patrol blanket halls.', 'royal_ruins', 'mon_boss_sir_snore_a_lot'],
  ['starfall-arcade', 'stage_starfall_arcade', 'Starfall Arcade', 'A neon arcade where combos become carnival tickets.', 'void', 'mon_boss_high_score_hydra'],
  ['bloxley-block-palace', 'stage_bloxley_block_palace', "Bloxley's Block Palace", 'The final palace stacked high with royal blocks.', 'royal_ruins', 'mon_boss_king_bloxley']
];

for (const [file, id, name, description, theme, bossId] of stages) {
  writeJson(`stages/${file}.json`, {
    id,
    name,
    description,
    theme,
    monsterPool: ['mon_sprinkle_rat', 'mon_gadget_goblin', 'mon_arcade_spark'],
    bossId,
    lootTableId: 'loot_battle_default',
    enabled: true
  });
}

const weapons = [
  ['party-popper', 'wpn_party_popper', 'Party Popper', 'wand'],
  ['star-scepter', 'wpn_star_scepter', 'Star Scepter', 'staff']
];
for (const [file, id, name, weaponType] of weapons) {
  writeJson(`weapons/${file}.json`, {
    id,
    name,
    weaponType,
    rarity: 'rare',
    description: `${name} makes falling blocks feel like a festival trick.`,
    iconKey: 'placeholder_weapon',
    stats: { lineDamageBonus: 1, comboDamageBonus: 1, spellDamageBonus: 1, manaGainBonus: 1, fallSpeedModifier: 0 },
    effects: ['increase_line_damage'],
    allowedHeroes: ['all'],
    unlock: { isUnlockedByDefault: false, condition: 'unlock_by_progress' },
    tags: ['damage'],
    enabled: true
  });
}

const spells = [
  ['sprinkle-shower', 'spl_sprinkle_shower', 'Sprinkle Shower', 'arcane', 'gain_mana'],
  ['cupcake-blast', 'spl_cupcake_blast', 'Cupcake Blast', 'healing', 'heal_player'],
  ['confetti-pop', 'spl_confetti_pop', 'Confetti Pop', 'bomb', 'clear_board_area'],
  ['bubble-shield', 'spl_bubble_shield', 'Bubble Shield', 'healing', 'gain_shield'],
  ['star-spark', 'spl_star_spark', 'Star Spark', 'lightning', 'damage_enemy'],
  ['jelly-bounce', 'spl_jelly_bounce', 'Jelly Bounce', 'gravity', 'reroll_piece'],
  ['snowcone-burst', 'spl_snowcone_burst', 'Snowcone Burst', 'frost', 'freeze_piece'],
  ['goblin-gadget', 'spl_goblin_gadget', 'Goblin Gadget', 'arcane', 'spawn_bomb_block'],
  ['rainbow-reroll', 'spl_rainbow_reroll', 'Rainbow Reroll', 'arcane', 'reroll_piece'],
  ['snack-break', 'spl_snack_break', 'Snack Break', 'healing', 'heal_player'],
  ['cascade-cheer', 'spl_cascade_cheer', 'Cascade Cheer', 'gravity', 'gain_mana']
];
for (const [file, id, name, school, effect] of spells) {
  writeJson(`spells/${file}.json`, {
    id,
    name,
    school,
    rarity: 'uncommon',
    description: `${name} adds a cheerful tactical option to the board.`,
    iconKey: 'placeholder_spell',
    cost: { mana: 25, hp: 0, gold: 0 },
    targetType: effect.includes('board') || effect.includes('piece') || effect.includes('bomb') ? 'board' : effect.includes('heal') || effect.includes('shield') ? 'self' : 'enemy',
    cooldownLocks: 0,
    effects: [effect],
    upgradePath: ['reduce_cost', 'add_secondary_effect'],
    tags: ['utility'],
    enabled: true
  });
}

const relics = [
  ['sprinkle-spoon', 'rel_sprinkle_spoon', 'Sprinkle Spoon'],
  ['cupcake-wrapper', 'rel_cupcake_wrapper', 'Cupcake Wrapper'],
  ['royal-napkin', 'rel_royal_napkin', 'Royal Napkin'],
  ['arcade-token', 'rel_arcade_token', 'Arcade Token'],
  ['star-sticker', 'rel_star_sticker', 'Star Sticker']
];
for (const [file, id, name] of relics) {
  writeJson(`relics/${file}.json`, {
    id,
    name,
    rarity: 'uncommon',
    description: `${name} gives the run a small festival bonus.`,
    iconKey: 'placeholder_relic',
    trigger: 'on_room_clear',
    effects: ['gain_gold'],
    stacking: { stackable: false, maxStacks: 1, stackBehavior: 'none' },
    conflictsWith: [],
    tags: ['economy'],
    enabled: true
  });
}

const upgrades = [
  ['fever-fizz', 'upg_fever_fizz', 'Fever Fizz'],
  ['snack-pockets', 'upg_snack_pockets', 'Snack Pockets'],
  ['cascade-choir', 'upg_cascade_choir', 'Cascade Choir']
];
for (const [file, id, name] of upgrades) {
  writeJson(`upgrades/${file}.json`, {
    id,
    name,
    category: 'utility',
    rarity: 'uncommon',
    description: `${name} improves the run with a compact festival perk.`,
    iconKey: 'placeholder_upgrade',
    appliesTo: { contentType: 'global', ids: [], tags: [] },
    effects: ['increase_line_damage'],
    maxLevel: 3,
    levelScaling: { mode: 'flat', valuePerLevel: 1 },
    tags: ['stackable'],
    enabled: true
  });
}

const blocks = [
  ['sprinkle-block', 'block_sprinkle', 'Sprinkle Block', 'special', 'uncommon', [{ type: 'gain_mana', value: 5 }]],
  ['cupcake-block', 'block_cupcake', 'Cupcake Block', 'special', 'uncommon', [{ type: 'heal_player', value: 1 }]],
  ['star-block', 'block_star', 'Star Block', 'special', 'rare', [{ type: 'boost_cascade', value: 1 }]],
  ['jelly-block', 'block_jelly', 'Jelly Block', 'special', 'common', []],
  ['sticky-block', 'block_sticky', 'Sticky Block', 'hazard', 'uncommon', []],
  ['crumb-junk-block', 'block_crumb_junk', 'Crumb Junk Block', 'hazard', 'common', []],
  ['royal-block', 'block_royal', 'Royal Block', 'hazard', 'rare', [{ type: 'damage_enemy', value: 2 }]],
  ['confetti-block', 'block_confetti', 'Confetti Block', 'special', 'rare', [{ type: 'random_bonus', value: 1 }]],
  ['toolbox-block', 'block_toolbox', 'Toolbox Block', 'special', 'uncommon', [{ type: 'item_charge', value: 1 }]]
];
for (const [file, id, name, blockType, rarity, clearEffects] of blocks) {
  writeJson(`board-blocks/${file}.json`, {
    id,
    name,
    blockType,
    rarity,
    spriteKey: id,
    color: '#ffd166',
    clearEffects,
    tags: ['special'],
    enabled: true
  });
}

const items = [
  ['rainbow-soda', 'item_rainbow_soda', 'Rainbow Soda', 'Gain mana and a tiny heal.', { type: 'mana_and_heal', mana: 25, heal: 2 }],
  ['toolbox', 'item_toolbox', 'Toolbox', 'Clear a small block cluster.', { type: 'clear_cluster', value: 4 }],
  ['snowcone', 'item_snowcone', 'Snowcone', 'Delay the next enemy attack.', { type: 'delay_enemy', value: 1 }],
  ['party-popper', 'item_party_popper', 'Party Popper', 'Pop a random board area.', { type: 'clear_area', value: 1 }],
  ['bubble-gum', 'item_bubble_gum', 'Bubble Gum', 'Gain a little shield.', { type: 'shield', value: 4 }],
  ['lucky-ticket', 'item_lucky_ticket', 'Lucky Ticket', 'Improve the next reward.', { type: 'luck', value: 1 }],
  ['hold-coupon', 'item_hold_coupon', 'Hold Coupon', 'Refresh hold once.', { type: 'refresh_hold', value: 1 }],
  ['block-polish', 'item_block_polish', 'Block Polish', 'Clean a messy row.', { type: 'clear_row', value: 1 }]
];
for (const [file, id, name, description, effect] of items) {
  writeJson(`items/${file}.json`, {
    id,
    name,
    description,
    effect,
    rarity: 'common',
    iconKey: id,
    enabled: true
  });
}

const oopsies = [
  ['too-much-confetti', 'curse_too_much_confetti', 'Too Much Confetti', 'Sometimes the board gets extra sparkle junk.'],
  ['sugar-crash', 'curse_sugar_crash', 'Sugar Crash', 'Mana gains are slightly lower until removed.']
];
for (const [file, id, name, description] of oopsies) {
  writeJson(`oopsies/${file}.json`, {
    id,
    name,
    rarity: 'cursed',
    description,
    iconKey: id,
    effects: [{ type: 'minor_drawback', value: 1 }],
    removeCost: 50,
    tags: ['curse'],
    enabled: true
  });
}

const events = [
  ['suspicious-button', 'evt_suspicious_button', 'Suspicious Button'],
  ['rainbow-fountain', 'evt_rainbow_fountain', 'Rainbow Fountain']
];
for (const [file, id, name] of events) {
  writeJson(`room-events/${file}.json`, {
    id,
    name,
    rarity: 'common',
    description: `${name} offers a bright, risky festival choice.`,
    iconKey: id,
    backgroundKey: 'bg_event_festival',
    biome: 'dungeon',
    choices: [
      {
        id: 'choice_safe',
        label: 'Take the safe treat',
        description: 'Gain a small amount of gold.',
        requirements: [],
        effects: [{ type: 'gain_gold', value: 15 }],
        resultText: 'A tidy prize drops out.'
      },
      {
        id: 'choice_risky',
        label: 'Try the loud option',
        description: 'Take a tiny hit for a random reward.',
        requirements: [],
        effects: [{ type: 'damage_player', value: 2 }, { type: 'gain_random_reward', value: 1 }],
        resultText: 'It was loud, but useful.'
      }
    ],
    tags: ['special'],
    enabled: true
  });
}

const npcs = [
  ['block-o-matic', 'npc_block_o_matic', 'Block-O-Matic 3000', 'machine'],
  ['snack-smith', 'npc_snack_smith', 'Snack Smith', 'shopkeeper'],
  ['map-kid', 'npc_map_kid', 'Map Kid', 'guide'],
  ['professor-poplin', 'npc_professor_poplin', 'Professor Poplin', 'mentor'],
  ['sleepy-guard', 'npc_sleepy_guard', 'Sleepy Guard', 'event'],
  ['arcade-clerk', 'npc_arcade_clerk', 'Arcade Clerk', 'shopkeeper'],
  ['cake-cart-captain', 'npc_cake_cart_captain', 'Cake Cart Captain', 'event']
];
for (const [file, id, name, role] of npcs) {
  writeJson(`npcs/${file}.json`, {
    id,
    name,
    description: `${name} keeps the festival dungeon cheerful.`,
    role,
    dialogue: [`${name} says hello!`, 'Keep those blocks falling in style.'],
    enabled: true
  });
}

const extraLootTables = [
  ['stage-sprinkle-sewers', 'loot_stage_sprinkle_sewers'],
  ['stage-goblin-workshop', 'loot_stage_goblin_workshop'],
  ['stage-frosty-pantry', 'loot_stage_frosty_pantry'],
  ['stage-pillow-castle', 'loot_stage_pillow_castle'],
  ['stage-starfall-arcade', 'loot_stage_starfall_arcade']
];
for (const [file, id] of extraLootTables) {
  writeJson(`loot-tables/${file}.json`, {
    id,
    name: id.replace('loot_', '').replaceAll('_', ' '),
    source: 'battle',
    entries: [
      { contentType: 'upgrade', id: 'upg_line_sharp_edges', weight: 10, rarity: 'common', condition: 'none' },
      { contentType: 'item', id: 'item_mini_cupcake', weight: 8, rarity: 'common', condition: 'none' }
    ],
    rollConfig: { choicesShown: 3, allowDuplicates: false, rarityBias: 'normal' },
    enabled: true
  });
}
