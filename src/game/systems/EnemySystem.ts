import type { EnemyDefinition, EnemyInstance, RoomType } from '../types/GameTypes';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { DifficultySystem } from './DifficultySystem';

type MonsterContentEntry = {
  id: string;
  name: string;
  stats: {
    hp: number;
    attack: number;
    attackIntervalLocks: number;
  };
  intent: {
    label: string;
  };
  behaviors: string[];
  role?: string;
  rarity?: string;
};

export class EnemySystem {
  constructor(private readonly difficultySystem: DifficultySystem = new DifficultySystem()) {}

  private getCandidates(roomType: RoomType): EnemyDefinition[] {
    const contentEnemies = contentRegistry.listEnabled<MonsterContentEntry>('monster').map((entry) => this.toDefinition(entry));
    if (roomType === 'boss') {
      return contentEnemies.filter((enemy) => enemy.roomType === 'boss');
    }

    if (roomType === 'elite') {
      return contentEnemies.filter((enemy) => enemy.roomType === 'elite');
    }

    return contentEnemies.filter((enemy) => enemy.roomType === 'fight');
  }

  private toDefinition(entry: MonsterContentEntry): EnemyDefinition {
    const behavior = entry.behaviors[0] ?? 'basic_attack';
    const roomType = entry.role === 'boss' || entry.rarity === 'boss'
      ? 'boss'
      : entry.role === 'elite' || entry.rarity === 'elite'
        ? 'elite'
        : 'fight';

    return {
      id: entry.id,
      name: entry.name,
      baseHp: entry.stats.hp,
      baseAttack: entry.stats.attack,
      attackIntervalLocks: entry.stats.attackIntervalLocks,
      intent: entry.intent.label,
      behavior,
      roomType
    };
  }

  spawnEnemy(roomType: RoomType, stage: number): EnemyInstance | null {
    if (!['fight', 'elite', 'boss'].includes(roomType)) {
      return null;
    }

    const definition = choice(this.getCandidates(roomType));
    const maxHp = this.difficultySystem.getEnemyMaxHp(definition.baseHp, stage);
    const attack = this.difficultySystem.getEnemyAttack(definition.baseAttack, stage);

    return {
      id: definition.id,
      name: definition.name,
      maxHp,
      currentHp: maxHp,
      attack,
      intent: definition.intent,
      behavior: definition.behavior,
      roomType: definition.roomType,
      attackIntervalLocks: definition.attackIntervalLocks,
      attackCounter: definition.attackIntervalLocks,
      previewHiddenTurns: 0,
      manaHexTurns: 0
    };
  }
}
