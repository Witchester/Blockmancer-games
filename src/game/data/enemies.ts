import type { EnemyDefinition } from '../types/GameTypes';

export const ENEMIES: EnemyDefinition[] = [
  {
    id: 'slime',
    name: 'Slime',
    baseHp: 30,
    baseAttack: 3,
    attackIntervalLocks: 4,
    intent: 'Bounce Attack',
    behavior: 'basic_attack',
    roomType: 'fight'
  },
  {
    id: 'goblin',
    name: 'Goblin',
    baseHp: 45,
    baseAttack: 4,
    attackIntervalLocks: 3,
    intent: 'Throw Junk',
    behavior: 'spawn_junk',
    roomType: 'fight'
  },
  {
    id: 'stone-golem',
    name: 'Stone Golem',
    baseHp: 75,
    baseAttack: 6,
    attackIntervalLocks: 3,
    intent: 'Stone Guard',
    behavior: 'reduce_line_damage',
    roomType: 'elite'
  },
  {
    id: 'bat',
    name: 'Bat',
    baseHp: 25,
    baseAttack: 3,
    attackIntervalLocks: 4,
    intent: 'Blind Screech',
    behavior: 'hide_next_piece',
    roomType: 'fight'
  },
  {
    id: 'witch',
    name: 'Witch',
    baseHp: 55,
    baseAttack: 5,
    attackIntervalLocks: 3,
    intent: 'Mana Hex',
    behavior: 'mana_hex',
    roomType: 'elite'
  },
  {
    id: 'elite-knight',
    name: 'Elite Knight',
    baseHp: 95,
    baseAttack: 8,
    attackIntervalLocks: 3,
    intent: 'Heavy Slam',
    behavior: 'shake_board',
    roomType: 'elite'
  },
  {
    id: 'falling-king',
    name: 'Falling King',
    baseHp: 160,
    baseAttack: 10,
    attackIntervalLocks: 2,
    intent: 'Royal Collapse',
    behavior: 'increase_fall_speed',
    roomType: 'boss'
  }
];
