import type { RewardDefinition } from '../types/GameTypes';

export const REWARDS: RewardDefinition[] = [
  {
    id: 'sharp-edges',
    name: 'Sharp Edges',
    type: 'Upgrade',
    description: 'Line damage +2.',
    persistent: true
  },
  {
    id: 'mana-echo',
    name: 'Mana Echo',
    type: 'Upgrade',
    description: 'Spell cost -5, minimum 10.',
    persistent: true
  },
  {
    id: 'goblin-coin',
    name: 'Goblin Coin',
    type: 'Relic',
    description: 'Gain more gold after battles.',
    persistent: true
  },
  {
    id: 'broken-hourglass',
    name: 'Broken Hourglass',
    type: 'Relic',
    description: 'Slow the board when HP drops low.',
    persistent: true
  },
  {
    id: 'slime-core',
    name: 'Slime Core',
    type: 'Relic',
    description: 'Gain mana when hit.',
    persistent: true
  },
  {
    id: 'stable-hands',
    name: 'Stable Hands',
    type: 'Upgrade',
    description: 'Fall speed -0.05.',
    persistent: true
  },
  {
    id: 'fire-mastery',
    name: 'Fire Mastery',
    type: 'Spell Upgrade',
    description: 'Fireball damage +10.',
    persistent: true
  },
  {
    id: 'bomb-expert',
    name: 'Bomb Expert',
    type: 'Spell Upgrade',
    description: 'Bomb Rune damage +10.',
    persistent: true
  },
  {
    id: 'combo-heart',
    name: 'Combo Heart',
    type: 'Upgrade',
    description: 'Heal 1 HP when combo reaches 3 or more.',
    persistent: true
  },
  {
    id: 'arcane-preview',
    name: 'Arcane Preview',
    type: 'Relic',
    description: 'Show an extra next-piece placeholder.',
    persistent: true
  },
  {
    id: 'stonebreaker',
    name: 'Stonebreaker',
    type: 'Relic',
    description: 'Ignore Stone Golem mitigation.',
    persistent: true
  },
  {
    id: 'emergency-barrier',
    name: 'Emergency Barrier',
    type: 'Relic',
    description: 'Once per battle, prevent lethal damage.',
    persistent: true
  },
  {
    id: 'gold-cache',
    name: 'Gold Cache',
    type: 'Gold',
    description: 'Gain 40 gold immediately.',
    persistent: false
  },
  {
    id: 'healing-glyph',
    name: 'Healing Glyph',
    type: 'Heal',
    description: 'Recover 8 HP immediately.',
    persistent: false
  }
];
