import type { EnemyDefinition, EnemyInstance, RoomType } from '../types/GameTypes';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { DifficultySystem } from './DifficultySystem';
import { StageSystem } from './StageSystem';

type MonsterContentEntry = {
  id: string;
  name: string;
  stats: {
    hp: number;
    attack: number;
    armor?: number;
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
  constructor(
    private readonly difficultySystem: DifficultySystem = new DifficultySystem(),
    private readonly stageSystem: StageSystem = new StageSystem()
  ) {}

  private getCandidates(roomType: RoomType, stageIndex: number): EnemyDefinition[] {
    const stageDef = this.stageSystem.getStageByIndex(stageIndex) as any;
    const contentEnemies = contentRegistry.listEnabled<MonsterContentEntry>('monster').map((entry) => this.toDefinition(entry));
    
    if (roomType === 'boss') {
      const bossId = stageDef?.bossId;
      if (bossId) {
        const boss = contentEnemies.find(e => e.id === bossId);
        if (boss) return [boss];
      }
      return contentEnemies.filter((enemy) => enemy.roomType === 'boss');
    }

    let candidates = contentEnemies;
    if (stageDef?.monsterPool) {
      candidates = contentEnemies.filter(e => stageDef.monsterPool.includes(e.id));
    }

    if (roomType === 'elite') {
      const elites = candidates.filter((enemy) => enemy.roomType === 'elite');
      if (elites.length > 0) return elites;
      return contentEnemies.filter((enemy) => enemy.roomType === 'elite'); // fallback
    }

    const fights = candidates.filter((enemy) => enemy.roomType === 'fight');
    if (fights.length > 0) return fights;
    return contentEnemies.filter((enemy) => enemy.roomType === 'fight'); // fallback
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
      armor: entry.stats.armor ?? 0,
      attackIntervalLocks: entry.stats.attackIntervalLocks,
      intent: entry.intent.label,
      behavior,
      behaviors: entry.behaviors.length > 0 ? [...entry.behaviors] : ['basic_attack'],
      roomType
    };
  }

  spawnEnemy(roomType: RoomType, stage: number): EnemyInstance | null {
    if (!['fight', 'elite', 'boss'].includes(roomType)) {
      return null;
    }

    const definition = choice(this.getCandidates(roomType, stage));
    const maxHp = this.difficultySystem.getEnemyMaxHp(definition.baseHp, stage);
    const attack = this.difficultySystem.getEnemyAttack(definition.baseAttack, stage);

    return {
      id: definition.id,
      name: definition.name,
      maxHp,
      currentHp: maxHp,
      attack,
      armor: definition.armor ?? 0,
      shield: 0,
      intent: definition.intent,
      behavior: definition.behavior,
      behaviors: definition.behaviors?.length ? [...definition.behaviors] : [definition.behavior],
      roomType: definition.roomType,
      attackIntervalLocks: definition.attackIntervalLocks,
      attackCounter: definition.attackIntervalLocks,
      previewHiddenTurns: 0,
      holdHiddenTurns: 0,
      manaHexTurns: 0,
      frozenTurns: 0,
      sleepTurns: 0,
      reverseControlsTurns: 0,
      lineDamageBlockedTurns: 0,
      behaviorIndex: 0
    };
  }
}
