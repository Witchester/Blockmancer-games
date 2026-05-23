import type { MonsterRole, MonsterRank } from './GameTypes';

export interface MonsterData {
  id: string;
  name: string;
  description: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  roles: MonsterRole[];
  rank: MonsterRank;
  tags?: string[];
  entryEffectId?: string;
}

export interface EnemyEntryEffect {
  id: string;
  name: string;
  description: string;
  pressureEffectId?: string;
  playerGiftEffectId?: string;
  entryGracePieces: number;
  warningText: string;
  eventLogText: string;
  tags?: string[];
}
