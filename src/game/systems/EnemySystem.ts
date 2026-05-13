import { ENEMIES } from '../data/enemies';
import type { EnemyDefinition, EnemyInstance, RoomType } from '../types/GameTypes';
import { choice } from '../utils/random';
import { DifficultySystem } from './DifficultySystem';

export class EnemySystem {
  constructor(private readonly difficultySystem: DifficultySystem = new DifficultySystem()) {}

  private getCandidates(roomType: RoomType): EnemyDefinition[] {
    if (roomType === 'boss') {
      return ENEMIES.filter((enemy) => enemy.roomType === 'boss');
    }

    if (roomType === 'elite') {
      return ENEMIES.filter((enemy) => enemy.roomType === 'elite');
    }

    return ENEMIES.filter((enemy) => enemy.roomType === 'fight');
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
