import type {
  NodeEncounterPack,
  EncounterEnemyEntry,
  EnemyInstance,
  RoomType,
  RunState
} from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';
import { DifficultySystem } from './DifficultySystem';
import { StageSystem } from './StageSystem';
import { choice, seededRandom } from '../utils/random';

type BiomeMonsterPool = {
  id: string;
  stageId: string;
  biomeId: string;
  displayName: string;
  maxDuplicatePerNode: number;
  recentMonsterMemoryCount: number;
  fallbackMonsterId: string;
  bannedPairTags: string[];
  monsterRules: Array<{
    monsterId: string;
    weight: number;
    roles: string[];
    rank: string;
    tags: string[];
    allowedNodeTypes?: string[];
    bannedWithTags?: string[];
  }>;
  enabled?: boolean;
};

type EncounterPackScalingRule = {
  id: string;
  stageNumber: number;
  stageId: string;
  nodeType: string;
  minEnemies: number;
  maxEnemies: number;
  earlyNodeEnemyCap?: number;
  lateNodeEnemyCap?: number;
  totalHpBudgetMultiplierRange: [number, number];
  totalAttackBudgetMultiplierRange: [number, number];
  entryGracePieces: number;
  maxActiveHazards: number;
  enabled?: boolean;
};

type EnemyEntryEffect = {
  id: string;
  name: string;
  description: string;
  pressureEffectId?: string;
  playerGiftEffectId?: string;
  entryGracePieces: number;
  warningText: string;
  eventLogText: string;
  tags: string[];
};

export class EncounterPackSystem {
  private readonly recentMonsterMemory: Map<string, string[]> = new Map();

  constructor(
    private readonly difficultySystem: DifficultySystem = new DifficultySystem(),
    private readonly stageSystem: StageSystem = new StageSystem()
  ) {}

  /**
   * Main API used by current runtime code.
   */
  generatePack(
    stageId: string,
    nodeType: RoomType,
    nodeId: string,
    isEarlyNode: boolean,
    recentMonsterIds: string[] = [],
    seed?: number
  ): NodeEncounterPack | null {
    const activeSeed = seed ?? Date.now();
    const stageIndex = this.stageSystem.getStageIndex(stageId);

    if (stageIndex === -1) {
      console.warn(`[EncounterPackSystem] Unknown stageId: ${stageId}`);
      return null;
    }

    const scalingRules = contentRegistry
      .listEnabled<EncounterPackScalingRule>('difficultyScaling')
      .filter(rule => rule.id.startsWith('scale_encounter_'));

    const matchingRule = scalingRules.find(
      rule =>
        rule.stageId === stageId &&
        rule.nodeType === nodeType &&
        rule.enabled !== false
    );

    if (!matchingRule) {
      console.warn(`[EncounterPackSystem] No scaling rule for ${stageId}/${nodeType}`);
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    let enemyCount = Math.floor(
      seededRandom(
        activeSeed,
        matchingRule.minEnemies,
        matchingRule.maxEnemies + 1
      )
    );

    if (isEarlyNode && matchingRule.earlyNodeEnemyCap) {
      enemyCount = Math.min(enemyCount, matchingRule.earlyNodeEnemyCap);
    } else if (!isEarlyNode && matchingRule.lateNodeEnemyCap) {
      enemyCount = Math.min(enemyCount, matchingRule.lateNodeEnemyCap);
    }

    if (nodeType === 'boss' || nodeType === 'elite') {
      enemyCount = 1;
    }

    enemyCount = Math.max(1, Math.min(enemyCount, matchingRule.maxEnemies));

    const biomeId = `biome_${stageId.replace('stage_', '')}`;
    const pool = this.getBiomePool(stageId, biomeId);

    if (!pool) {
      console.warn(`[EncounterPackSystem] No biome pool for ${stageId}`);
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    const effectiveRecentMonsterIds =
      recentMonsterIds.length > 0
        ? recentMonsterIds
        : this.recentMonsterMemory.get(nodeId) ?? [];

    const enemies: EncounterEnemyEntry[] = [];
    const usedMonsterIds = new Set<string>();

    for (let i = 0; i < enemyCount; i += 1) {
      const enemy = this.generateEnemyEntry(
        pool,
        nodeType,
        matchingRule,
        usedMonsterIds,
        effectiveRecentMonsterIds,
        i === 0,
        activeSeed + i * 7919
      );

      if (enemy) {
        enemies.push(enemy);
        usedMonsterIds.add(enemy.enemyId);
      }
    }

    if (enemies.length === 0) {
      console.error('[EncounterPackSystem] Failed to generate any enemies');
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    const hpRange = matchingRule.totalHpBudgetMultiplierRange;
    const atkRange = matchingRule.totalAttackBudgetMultiplierRange;

    const hpRand = seededRandom(activeSeed + 101, 0, 1);
    const atkRand = seededRandom(activeSeed + 202, 0, 1);

    const totalHpBudgetMultiplier =
      hpRange[0] + hpRand * (hpRange[1] - hpRange[0]);

    const totalAttackBudgetMultiplier =
      atkRange[0] + atkRand * (atkRange[1] - atkRange[0]);

    const perEnemyHpBase = totalHpBudgetMultiplier / enemies.length;
    const perEnemyAttackBase = totalAttackBudgetMultiplier / enemies.length;

    enemies.forEach((enemy, index) => {
      enemy.hpMultiplier = perEnemyHpBase * (1 + index * 0.1);
      enemy.attackMultiplier = perEnemyAttackBase * (1 + index * 0.05);
      enemy.entryGracePieces = matchingRule.entryGracePieces;
    });

    this.updateRecentMonsterMemory(
      nodeId,
      enemies.map(enemy => enemy.enemyId),
      pool.recentMonsterMemoryCount
    );

    return {
      encounterPackId: `pack_${stageId}_${nodeType}_${nodeId}`,
      nodeId,
      stageId,
      biomeId: pool.biomeId,
      nodeType: nodeType as any,
      enemies,
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier,
      totalAttackBudgetMultiplier,
      maxActiveHazards: matchingRule.maxActiveHazards,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true,
      breatherRewardPolicy:
        enemyCount > 1
          ? {
              enabled: true,
              maxHealPercentPerNode: 5,
              allowedRewards: ['hp', 'mana', 'shield']
            }
          : undefined,
      generatedFromPoolId: pool.id,
      seed: activeSeed
    };
  }

  /**
   * Compatibility API for prompts/older integration code that call generateEncounterPack.
   */
  generateEncounterPack(
    state: RunState,
    nodeId: string,
    nodeType: string
  ): NodeEncounterPack | null {
    const stageId = this.getStageIdFromRunState(state);
    const isEarlyNode = this.isEarlyNodeFromRunState(state);
    return this.generatePack(stageId, nodeType as RoomType, nodeId, isEarlyNode);
  }

  private getStageIdFromRunState(state: RunState): string {
    const looseState = state as any;

    if (typeof looseState.stageId === 'string') {
      return looseState.stageId;
    }

    if (typeof looseState.currentStageId === 'string') {
      return looseState.currentStageId;
    }

    const stageNumber = Number(looseState.stage ?? looseState.stageNumber ?? 1);

    const stageIdByNumber: Record<number, string> = {
      1: 'stage_sprinkle_sewers',
      2: 'stage_goblin_workshop',
      3: 'stage_frosty_pantry',
      4: 'stage_pillow_castle',
      5: 'stage_starfall_arcade',
      6: 'stage_bloxleys_block_palace'
    };

    return stageIdByNumber[stageNumber] ?? 'stage_sprinkle_sewers';
  }

  private isEarlyNodeFromRunState(state: RunState): boolean {
    const looseState = state as any;
    const nodeIndex =
      looseState.currentNodeIndex ??
      looseState.mapProgress?.currentNodeIndex ??
      looseState.currentMapNodeIndex;

    if (typeof nodeIndex !== 'number') {
      return true;
    }

    return nodeIndex < 3;
  }

  private getBiomePool(stageId: string, biomeId: string): BiomeMonsterPool | null {
    const allDifficulty = contentRegistry.listEnabled<any>('difficultyScaling');
    const pool = allDifficulty.find(
      entry => entry.stageId === stageId && entry.biomeId === biomeId
    );

    if (pool && pool.monsterRules) {
      return pool as BiomeMonsterPool;
    }

    if (stageId === 'stage_sprinkle_sewers') {
      return {
        id: 'pool_sprinkle_sewers',
        stageId: 'stage_sprinkle_sewers',
        biomeId: 'biome_sprinkle_sewers',
        displayName: 'Sprinkle Sewers Monster Pool',
        maxDuplicatePerNode: 1,
        recentMonsterMemoryCount: 2,
        fallbackMonsterId: 'mon_cupcake_slime',
        bannedPairTags: ['heavy_hazard', 'double_sticky'],
        monsterRules: [
          {
            monsterId: 'mon_cupcake_slime',
            weight: 35,
            roles: ['starter'],
            rank: 'regular',
            tags: ['stage_1']
          },
          {
            monsterId: 'mon_sugar_bat',
            weight: 20,
            roles: ['pressure'],
            rank: 'regular',
            tags: ['stage_1']
          },
          {
            monsterId: 'mon_crumb_goblin',
            weight: 20,
            roles: ['pressure'],
            rank: 'regular',
            tags: ['stage_1']
          },
          {
            monsterId: 'mon_jelly_rat',
            weight: 15,
            roles: ['finisher'],
            rank: 'regular',
            tags: ['stage_1']
          },
          {
            monsterId: 'mon_sprinkle_snail',
            weight: 10,
            roles: ['support'],
            rank: 'regular',
            tags: ['stage_1']
          },
          {
            monsterId: 'mon_frosting_blob',
            weight: 10,
            roles: ['support'],
            rank: 'regular',
            tags: ['stage_1']
          }
        ],
        enabled: true
      };
    }

    return null;
  }

  private generateEnemyEntry(
    pool: BiomeMonsterPool,
    nodeType: RoomType,
    scalingRule: EncounterPackScalingRule,
    usedMonsterIds: Set<string>,
    recentMonsterIds: string[],
    isFirstEnemy: boolean,
    seed: number
  ): EncounterEnemyEntry | null {
    const allowedRoles = this.getAllowedRolesForNodeType(nodeType);

    let candidates = pool.monsterRules.filter(rule => {
      if (usedMonsterIds.has(rule.monsterId)) {
        return false;
      }

      if (
        rule.allowedNodeTypes &&
        !rule.allowedNodeTypes.includes(nodeType as string)
      ) {
        return false;
      }

      if (
        rule.roles.length > 0 &&
        !rule.roles.some(role => allowedRoles.includes(role))
      ) {
        return false;
      }

      return !recentMonsterIds.includes(rule.monsterId);
    });

    if (candidates.length === 0) {
      candidates = pool.monsterRules.filter(rule => !usedMonsterIds.has(rule.monsterId));
    }

    if (candidates.length === 0) {
      const fallback = contentRegistry.getMonster(pool.fallbackMonsterId);
      if (!fallback) {
        return null;
      }

      return {
        enemyId: pool.fallbackMonsterId,
        role: 'starter' as any,
        rank: 'regular' as any,
        hpMultiplier: 1.0,
        attackMultiplier: 1.0,
        armorMultiplier: 1.0,
        entryGracePieces: scalingRule.entryGracePieces,
        entryEffectId: isFirstEnemy ? undefined : 'entry_junk_pressure',
        tags: ['fallback']
      };
    }

    const totalWeight = candidates.reduce((sum, candidate) => {
      const recentPenalty = recentMonsterIds.includes(candidate.monsterId) ? 0.5 : 1;
      return sum + candidate.weight * recentPenalty;
    }, 0);

    let randomWeight = seededRandom(seed, 0, totalWeight);
    let selected = candidates[0];

    for (const candidate of candidates) {
      const recentPenalty = recentMonsterIds.includes(candidate.monsterId) ? 0.5 : 1;
      randomWeight -= candidate.weight * recentPenalty;

      if (randomWeight <= 0) {
        selected = candidate;
        break;
      }
    }

    const monster = contentRegistry.getMonster(selected.monsterId);
    if (!monster) {
      console.warn(`[EncounterPackSystem] Monster not found: ${selected.monsterId}`);
      return null;
    }

    const entryEffectId = isFirstEnemy
      ? undefined
      : this.selectEntryEffect(nodeType);

    return {
      enemyId: selected.monsterId,
      role: (selected.roles[0] || 'starter') as any,
      rank: (selected.rank || 'regular') as any,
      hpMultiplier: 1.0,
      attackMultiplier: 1.0,
      armorMultiplier: 1.0,
      entryEffectId,
      entryGracePieces: scalingRule.entryGracePieces,
      tags: selected.tags
    };
  }

  private getAllowedRolesForNodeType(nodeType: RoomType): string[] {
    switch (nodeType) {
      case 'normal':
        return ['starter', 'pressure', 'support', 'finisher'];
      case 'elite':
        return ['pressure', 'support', 'finisher', 'elite'];
      case 'boss':
        return ['finisher', 'boss'];
      default:
        return ['starter', 'pressure', 'support', 'finisher'];
    }
  }

  private selectEntryEffect(nodeType: RoomType): string {
    const effects = contentRegistry
      .listEnabled<EnemyEntryEffect>('difficultyScaling')
      .filter(effect => effect.id.startsWith('entry_') && effect.id !== 'entry_none');

    if (effects.length === 0) {
      return 'entry_none_safe';
    }

    const safeEffects = effects.filter(
      effect => !effect.tags.includes('boss') || nodeType === 'boss'
    );

    const selected = choice(safeEffects.length > 0 ? safeEffects : effects);
    return selected.id;
  }

  private createFallbackPack(
    stageId: string,
    nodeType: RoomType,
    nodeId: string
  ): NodeEncounterPack {
    return {
      encounterPackId: `pack_fallback_${nodeId}`,
      nodeId,
      stageId,
      biomeId: 'biome_sprinkle_sewers',
      nodeType: nodeType as any,
      enemies: [
        {
          enemyId: 'mon_cupcake_slime',
          role: 'starter' as any,
          rank: 'regular' as any,
          hpMultiplier: 1.0,
          attackMultiplier: 1.0,
          armorMultiplier: 1.0,
          entryGracePieces: 3,
          entryEffectId: nodeType === 'boss' ? undefined : 'entry_junk_pressure',
          tags: ['fallback']
        }
      ],
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier: 1.0,
      totalAttackBudgetMultiplier: 1.0,
      maxActiveHazards: 1,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true,
      generatedFromPoolId: 'pool_sprinkle_sewers',
      seed: Date.now()
    };
  }

  hasRemainingEncounterEnemies(pack: NodeEncounterPack | null): boolean {
    if (!pack) {
      return false;
    }

    return pack.currentEnemyIndex < pack.enemies.length - 1;
  }

  getCurrentEncounterEnemy(pack: NodeEncounterPack | null): EncounterEnemyEntry | null {
    if (!pack || pack.currentEnemyIndex >= pack.enemies.length) {
      return null;
    }

    return pack.enemies[pack.currentEnemyIndex];
  }

  getCurrentEnemy(pack: NodeEncounterPack): EncounterEnemyEntry | null {
    return this.getCurrentEncounterEnemy(pack);
  }

  getNextEncounterEnemy(pack: NodeEncounterPack | null): EncounterEnemyEntry | null {
    if (!pack || pack.currentEnemyIndex >= pack.enemies.length - 1) {
      return null;
    }

    return pack.enemies[pack.currentEnemyIndex + 1];
  }

  advanceEncounterEnemy(pack: NodeEncounterPack): NodeEncounterPack {
    if (this.hasRemainingEncounterEnemies(pack)) {
      pack.currentEnemyIndex += 1;
    }

    return pack;
  }

  advanceToNextEnemy(pack: NodeEncounterPack): boolean {
    this.advanceEncounterEnemy(pack);
    return this.hasRemainingEncounterEnemies(pack) || !this.isPackCleared(pack);
  }

  isPackCleared(pack: NodeEncounterPack): boolean {
    return pack.currentEnemyIndex >= pack.enemies.length - 1;
  }

  getRemainingEnemyCount(pack: NodeEncounterPack): number {
    return Math.max(0, pack.enemies.length - pack.currentEnemyIndex - 1);
  }

  getTotalEnemyCount(pack: NodeEncounterPack): number {
    return pack.enemies.length;
  }

  spawnEncounterEnemy(
    entry: EncounterEnemyEntry,
    stageIndex: number,
    baseGracePieces: number = 0
  ): EnemyInstance | null {
    const monster = contentRegistry.getMonster(entry.enemyId);

    if (!monster) {
      console.warn(`[EncounterPackSystem] Cannot spawn unknown monster: ${entry.enemyId}`);
      return null;
    }

    const baseHp = (monster as any).stats?.hp || 20;
    const baseAttack = (monster as any).stats?.attack || 3;
    const baseArmor = (monster as any).stats?.armor || 0;
    const baseAttackInterval = (monster as any).stats?.attackIntervalLocks || 6;

    const maxHp = Math.round(
      this.difficultySystem.getEnemyMaxHp(baseHp, stageIndex) * entry.hpMultiplier
    );

    const attack = Math.round(
      this.difficultySystem.getEnemyAttack(baseAttack, stageIndex) *
        entry.attackMultiplier
    );

    const armor = Math.round((baseArmor || 0) * (entry.armorMultiplier || 1.0));

    const entryEffect = entry.entryEffectId
      ? contentRegistry.getById<EnemyEntryEffect>(
          'difficultyScaling',
          entry.entryEffectId
        )
      : null;

    const effectGrace = entryEffect?.entryGracePieces || 0;
    const totalGrace = baseGracePieces + effectGrace;
    const attackCounter = Math.max(1, baseAttackInterval + totalGrace);

    return {
      id: entry.enemyId,
      name: monster.name,
      maxHp,
      currentHp: maxHp,
      attack,
      armor,
      shield: 0,
      intent: (monster as any).intent?.label || 'Attack',
      behavior: (monster as any).behaviors?.[0] || 'basic_attack',
      behaviors: (monster as any).behaviors?.length
        ? [...(monster as any).behaviors]
        : ['basic_attack'],
      roomType:
        entry.rank === 'boss'
          ? 'boss'
          : entry.rank === 'elite'
            ? 'elite'
            : 'fight',
      attackIntervalLocks: baseAttackInterval,
      attackCounter,
      previewHiddenTurns: 0,
      holdHiddenTurns: 0,
      manaHexTurns: 0,
      frozenTurns: 0,
      sleepTurns: 0,
      reverseControlsTurns: 0,
      lineDamageBlockedTurns: 0,
      behaviorIndex: 0,
      phase: 1,
      phase2Triggered: false
    };
  }

  applyEnemyEntryEffect(
    state: RunState,
    entry: EncounterEnemyEntry,
    logCallback: (message: string) => void
  ): { pressureApplied: boolean; giftApplied: boolean; messages: string[] } {
    const messages: string[] = [];
    let pressureApplied = false;
    let giftApplied = false;

    if (!entry.entryEffectId || entry.entryEffectId === 'entry_none') {
      const message = 'A new festival troublemaker hops in!';
      messages.push(message);
      logCallback(message);
      return { pressureApplied, giftApplied, messages };
    }

    const effect = contentRegistry.getById<EnemyEntryEffect>(
      'difficultyScaling',
      entry.entryEffectId
    );

    if (!effect) {
      const message = 'Another guest arrives!';
      messages.push(message);
      logCallback(message);
      return { pressureApplied, giftApplied, messages };
    }

    if (effect.warningText) {
      messages.push(effect.warningText);
      logCallback(effect.warningText);
    }

    if (effect.eventLogText) {
      messages.push(effect.eventLogText);
      logCallback(effect.eventLogText);
    }

    if (effect.pressureEffectId) {
      pressureApplied = true;
      messages.push(`Pressure: ${effect.pressureEffectId} is queued.`);
    }

    if (effect.playerGiftEffectId) {
      const looseState = state as any;

      if (
        typeof looseState.mana === 'number' &&
        typeof looseState.maxMana === 'number'
      ) {
        looseState.mana = Math.min(looseState.mana + 2, looseState.maxMana);
        giftApplied = true;

        const giftMessage = 'You gain +2 mana from the festive chaos!';
        messages.push(giftMessage);
        logCallback(giftMessage);
      }
    }

    return { pressureApplied, giftApplied, messages };
  }

  completeEncounterPack(pack: NodeEncounterPack): {
    encounterPackId: string;
    nodeId: string;
    stageId: string;
    nodeType: string;
    defeatedEnemyIds: string[];
    totalEnemiesDefeated: number;
    isFullNodeClear: boolean;
  } {
    const defeatedEnemyIds = pack.enemies
      .slice(0, pack.currentEnemyIndex + 1)
      .map(enemy => enemy.enemyId);

    return {
      encounterPackId: pack.encounterPackId,
      nodeId: pack.nodeId,
      stageId: pack.stageId,
      nodeType: pack.nodeType,
      defeatedEnemyIds,
      totalEnemiesDefeated: pack.currentEnemyIndex + 1,
      isFullNodeClear: pack.currentEnemyIndex >= pack.enemies.length - 1
    };
  }

  clearRuntimeState(): void {
    this.recentMonsterMemory.clear();
  }

  private updateRecentMonsterMemory(
    nodeId: string,
    monsterIds: string[],
    maxMemory: number
  ): void {
    const memory = this.recentMonsterMemory.get(nodeId) ?? [];

    for (const monsterId of monsterIds) {
      if (!memory.includes(monsterId)) {
        memory.push(monsterId);
      }
    }

    while (memory.length > Math.max(1, maxMemory)) {
      memory.shift();
    }

    this.recentMonsterMemory.set(nodeId, memory);
  }
}