import type { MonsterRole, MonsterRank, RewardDefinition as Reward } from './GameTypes';

export interface BattleState {
  player: Player;
  enemies: Enemy[];
  currentEnemyIndex: number;
  isPlayerTurn: boolean;
  battleLog: string[];
  rewards: Reward[];
}

export interface Player {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  statusEffects: StatusEffect[];
  inventory: InventoryItem[];
  level: number;
  experience: number;
}

export interface Enemy {
  id: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  statusEffects: StatusEffect[];
  role?: MonsterRole;
  rank?: MonsterRank;
  entryGracePieces: number;
  tags?: string[];
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  stacks?: number;
}

export interface InventoryItem {
  id: string;
  count: number;
}
