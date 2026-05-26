import type {
  NodeEncounterPack,
  NodeResultSummary,
  NodeResultClaimState,
  EncounterEnemyEntry,
  EnemyInstance,
  RoomType,
  RunState,
  MonsterRole,
  MonsterRank,
  EncounterNodeType,
  BiomeMonsterPool,
  WeightedMonsterRule,
  EncounterPackScalingRule,
  EnemyEntryEffectContent as EnemyEntryEffect,
  EncounterPackCompletionResult
} from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';
import { DifficultySystem } from './DifficultySystem';
import { StageSystem } from './StageSystem';
import { LevelUpSystem } from './LevelUpSystem';
import { seededRandom } from '../utils/random';

export type GenerateEncounterPackInput = {
  stageId: string;
  stageNumber: number;
  biomeId?: string;
  nodeId: string;
  nodeType: EncounterNodeType;
  nodeDepthPercent: number;
  seed?: string | number;
  recentMonsterIds?: string[];
};

export class EncounterPackSystem {
  private readonly recentMonsterMemory: Map<string, string[]> = new Map();
  private readonly levelUpSystem = new LevelUpSystem();

  constructor(
    private readonly difficultySystem: DifficultySystem = new DifficultySystem(),
    private readonly stageSystem: StageSystem = new StageSystem()
  ) {}

  /**
   * Main API for encounter pack generation.
   */
  generateEncounterPack(input: GenerateEncounterPackInput): NodeEncounterPack {
    const { stageId, nodeId, nodeType, nodeDepthPercent, recentMonsterIds = [] } = input;
    const activeSeed = typeof input.seed === 'number' ? input.seed : this.hashSeed(input.seed ?? nodeId);

    const scalingRules = contentRegistry
      .listEnabled<EncounterPackScalingRule>('encounterPackScaling');

    const matchingRule = scalingRules.find(
      rule =>
        rule.stageId === stageId &&
        rule.nodeType === nodeType
    );

    if (!matchingRule) {
      console.warn(`[EncounterPackSystem] No scaling rule for ${stageId}/${nodeType}. Using fallback.`);
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    let enemyCount = Math.floor(
      seededRandom(
        activeSeed,
        matchingRule.minEnemies,
        matchingRule.maxEnemies + 1
      )
    );
    if (typeof matchingRule.earlyNodeEnemyCap === 'number' && nodeDepthPercent <= 40) {
      enemyCount = Math.min(enemyCount, Math.max(1, Math.floor(matchingRule.earlyNodeEnemyCap)));
    }
    if (typeof matchingRule.lateNodeEnemyCap === 'number' && nodeDepthPercent >= 60) {
      enemyCount = Math.min(enemyCount, Math.max(1, Math.floor(matchingRule.lateNodeEnemyCap)));
    }

    // Release 1 Clamp: Max 3 enemies for generated packs
    enemyCount = Math.max(1, Math.min(enemyCount, matchingRule.maxEnemies, 3));

    // Bosses are always 1 in Release 1 unless scripted helpers added
    if (nodeType === 'boss') {
      enemyCount = 1;
    }

    const biomeId = input.biomeId ?? `biome_${stageId.replace('stage_', '')}`;
    const pool = this.getBiomePool(stageId, biomeId);

    if (!pool) {
      console.warn(`[EncounterPackSystem] No biome pool for ${stageId}. Using fallback.`);
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    const effectiveRecentMonsterIds =
      recentMonsterIds.length > 0
        ? recentMonsterIds
        : this.recentMonsterMemory.get(nodeId) ?? [];

    const enemies: EncounterEnemyEntry[] = [];
    const usedMonsterIds: string[] = [];
    const activeTags: string[] = [];

    for (let i = 0; i < enemyCount; i += 1) {
      const enemy = this.generateEnemyEntry(
        pool,
        nodeType,
        matchingRule,
        nodeDepthPercent,
        usedMonsterIds,
        activeTags,
        effectiveRecentMonsterIds,
        i === 0,
        activeSeed + i * 7919
      );

      if (enemy) {
        enemies.push(enemy);
        usedMonsterIds.push(enemy.enemyId);
        if (enemy.tags) activeTags.push(...enemy.tags);
      }
    }

    if (enemies.length === 0) {
      console.error('[EncounterPackSystem] Failed to generate any enemies. Using fallback.');
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    // Budget distribution based on enemy count
    const hpRange = matchingRule.totalHpBudgetMultiplierRange;
    const atkRange = matchingRule.totalAttackBudgetMultiplierRange;

    const hpRand = seededRandom(activeSeed + 101, 0, 1);
    const atkRand = seededRandom(activeSeed + 202, 0, 1);

    const totalHpBudgetMultiplier =
      hpRange[0] + hpRand * (hpRange[1] - hpRange[0]);

    const totalAttackBudgetMultiplier =
      atkRange[0] + atkRand * (atkRange[1] - atkRange[0]);

    // Distribute budget
    enemies.forEach((enemy, index) => {
      // Simple distribution: equal base, slight ramp for later enemies
      const baseHp = totalHpBudgetMultiplier / enemies.length;
      const baseAtk = totalAttackBudgetMultiplier / enemies.length;
      
      // First enemy slightly weaker if multiple? Or just equal?
      // Design recommendation: 2 enemies -> ~1.5x total. 3 enemies -> ~2.1x total.
      enemy.hpMultiplier = baseHp;
      enemy.attackMultiplier = baseAtk;
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
      nodeType,
      enemies,
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier,
      totalAttackBudgetMultiplier,
      maxActiveHazards: matchingRule.maxActiveHazards,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true,
      defeatedEnemyIds: [],
      defeatedEnemyIndexes: [],
      remainingEnemyCount: enemies.length,
      appliedEntryEffectEnemyIndexes: [],
      entryGiftClaimedEnemyIndexes: [],
      encounterPackCompleted: false,
      nodeRewardsGranted: false,
      routeFallbackTriggeredForEncounterPack: false,
      breatherRewardPolicy:
        enemies.length > 1
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
   * Compatibility method for existing calls.
   */
  generatePack(
    stageId: string,
    nodeType: RoomType,
    nodeId: string,
    isEarlyNode: boolean,
    recentMonsterIds: string[] = [],
    seed?: number
  ): NodeEncounterPack | null {
    const nodeTypeMap: Record<string, EncounterNodeType> = {
      fight: 'normal',
      elite: 'elite',
      boss: 'boss',
      event: 'event_battle',
      royal_guard: 'royal_guard'
    };

    return this.generateEncounterPack({
      stageId,
      stageNumber: this.stageSystem.getStageIndex(stageId),
      nodeId,
      nodeType: nodeTypeMap[nodeType] ?? 'normal',
      nodeDepthPercent: isEarlyNode ? 20 : 70,
      seed,
      recentMonsterIds
    });
  }

  private hashSeed(seed: string | number): number {
    if (typeof seed === 'number') return seed;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  private getBiomePool(stageId: string, _biomeId: string): BiomeMonsterPool | null {
    const pools = contentRegistry.listEnabled<BiomeMonsterPool>('biomeMonsterPool');
    return pools.find(p => p.stageId === stageId || p.id === `pool_${stageId.replace('stage_', '')}`) || null;
  }

  private generateEnemyEntry(
    pool: BiomeMonsterPool,
    nodeType: EncounterNodeType,
    scalingRule: EncounterPackScalingRule,
    nodeDepthPercent: number,
    usedMonsterIds: string[],
    activeTags: string[],
    recentMonsterIds: string[],
    isFirstEnemy: boolean,
    seed: number
  ): EncounterEnemyEntry | null {
    const allowedRoles = this.getAllowedRolesForNodeType(nodeType, isFirstEnemy);

    let candidates = pool.monsterRules.filter(rule => {
      // Respect maxDuplicatePerNode
      const count = usedMonsterIds.filter(id => id === rule.monsterId).length;
      if (count >= pool.maxDuplicatePerNode) return false;

      // Respect nodeDepthPercent
      if (rule.minNodeDepthPercent && nodeDepthPercent < rule.minNodeDepthPercent) return false;
      if (rule.maxNodeDepthPercent && nodeDepthPercent > rule.maxNodeDepthPercent) return false;

      // Respect allowedNodeTypes
      if (rule.allowedNodeTypes && !rule.allowedNodeTypes.includes(nodeType)) return false;

      // Respect roles
      if (rule.roles.length > 0 && !rule.roles.some(role => allowedRoles.includes(role))) return false;

      // Rank matching
      if (nodeType === 'elite' && rule.rank !== 'elite' && rule.rank !== 'elite_miniboss') return false;
      if (nodeType === 'royal_guard' && rule.rank !== 'elite_miniboss') return false;

      // Avoid banned pair tags
      if (pool.bannedPairTags && rule.tags) {
        if (rule.tags.some(tag => activeTags.includes(tag) && pool.bannedPairTags?.includes(tag))) return false;
      }

      // Filter recent (will fallback if empty)
      return !recentMonsterIds.includes(rule.monsterId);
    });

    // Fallback if recent filter killed all candidates
    if (candidates.length === 0) {
      candidates = pool.monsterRules.filter(rule => {
        const count = usedMonsterIds.filter(id => id === rule.monsterId).length;
        if (count >= pool.maxDuplicatePerNode) return false;
        if (rule.minNodeDepthPercent && nodeDepthPercent < rule.minNodeDepthPercent) return false;
        if (rule.maxNodeDepthPercent && nodeDepthPercent > rule.maxNodeDepthPercent) return false;
        if (rule.allowedNodeTypes && !rule.allowedNodeTypes.includes(nodeType)) return false;
        if (rule.roles.length > 0 && !rule.roles.some(role => allowedRoles.includes(role))) return false;
        return true;
      });
    }

    if (candidates.length === 0) {
      return {
        enemyId: pool.fallbackMonsterId,
        role: 'starter',
        rank: 'regular',
        hpMultiplier: 1.0,
        attackMultiplier: 1.0,
        armorMultiplier: 1.0,
        entryGracePieces: scalingRule.entryGracePieces,
      entryEffectId: 'entry_none_safe',
        tags: ['fallback']
      };
    }

    const totalWeight = candidates.reduce((sum, candidate) => {
      const recentPenalty = recentMonsterIds.includes(candidate.monsterId) ? 0.2 : 1;
      return sum + candidate.weight * recentPenalty;
    }, 0);

    let randomWeight = seededRandom(seed, 0, totalWeight);
    let selected = candidates[0];

    for (const candidate of candidates) {
      const recentPenalty = recentMonsterIds.includes(candidate.monsterId) ? 0.2 : 1;
      randomWeight -= candidate.weight * recentPenalty;

      if (randomWeight <= 0) {
        selected = candidate;
        break;
      }
    }

    const entryEffectId = isFirstEnemy
      ? 'entry_none_safe'
      : this.selectEntryEffect(nodeType, scalingRule.stageNumber, seed + 409);

    return {
      enemyId: selected.monsterId,
      role: selected.roles[0] || 'starter',
      rank: selected.rank || 'regular',
      hpMultiplier: 1.0,
      attackMultiplier: 1.0,
      armorMultiplier: 1.0,
      entryEffectId,
      entryGracePieces: scalingRule.entryGracePieces,
      tags: selected.tags
    };
  }

  private getAllowedRolesForNodeType(nodeType: EncounterNodeType, isFirstEnemy: boolean): MonsterRole[] {
    if (isFirstEnemy) {
      return ['starter', 'support'];
    }

    switch (nodeType) {
      case 'normal':
      case 'event_battle':
        return ['pressure', 'support', 'finisher'];
      case 'elite':
        return ['pressure', 'support', 'finisher'];
      case 'royal_guard':
        return ['pressure', 'finisher'];
      case 'boss':
        return ['finisher'];
      default:
        return ['starter', 'pressure', 'support', 'finisher'];
    }
  }

  private selectEntryEffect(nodeType: EncounterNodeType, stageNumber: number, seed: number): string {
    const effects = contentRegistry
      .listEnabled<EnemyEntryEffect>('enemyEntryEffect')
      .filter(effect => effect.id !== 'entry_none_safe');

    if (effects.length === 0) {
      return 'entry_none_safe';
    }

    let filtered = effects.filter(
      effect => !effect.tags?.includes('boss') || nodeType === 'boss'
    );
    if (nodeType === 'boss') {
      filtered = filtered.filter((effect) => effect.tags?.includes('boss') || effect.id === 'entry_royal_warning_gift');
    } else if (stageNumber <= 2) {
      filtered = filtered.filter((effect) => !effect.tags?.includes('boss'));
    }
    if (stageNumber === 1) {
      filtered = filtered.filter((effect) => ['entry_none_safe', 'entry_sprinkle_gift', 'entry_shield_trade'].includes(effect.id));
    }

    const pool = (filtered.length > 0 ? filtered : effects).sort((left, right) => left.id.localeCompare(right.id));
    const index = Math.min(pool.length - 1, Math.floor(seededRandom(seed, 0, pool.length)));
    const selected = pool[index];
    return selected.id;
  }

  private createFallbackPack(
    stageId: string,
    nodeType: EncounterNodeType,
    nodeId: string
  ): NodeEncounterPack {
    return {
      encounterPackId: `pack_fallback_${nodeId}`,
      nodeId,
      stageId,
      biomeId: 'biome_sprinkle_sewers',
      nodeType,
      enemies: [
        {
          enemyId: 'mon_cupcake_slime',
          role: 'starter',
          rank: 'regular',
          hpMultiplier: 1.0,
          attackMultiplier: 1.0,
          armorMultiplier: 1.0,
          entryGracePieces: 3,
          entryEffectId: 'entry_none_safe',
          tags: ['fallback']
        }
      ],
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier: 1.0,
      totalAttackBudgetMultiplier: 1.0,
      maxActiveHazards: 1,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true,
      defeatedEnemyIds: [],
      defeatedEnemyIndexes: [],
      remainingEnemyCount: 1,
      appliedEntryEffectEnemyIndexes: [],
      entryGiftClaimedEnemyIndexes: [],
      encounterPackCompleted: false,
      nodeRewardsGranted: false,
      routeFallbackTriggeredForEncounterPack: false,
      seed: Date.now()
    };
  }

  /**
   * Spawns an enemy instance from an entry.
   */
  spawnEncounterEnemy(
    entry: EncounterEnemyEntry,
    stageIndex: number,
    baseGracePieces: number = 0,
    state?: RunState
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
          'enemyEntryEffect',
          entry.entryEffectId
        )
      : null;

    const effectGrace = entryEffect?.entryGracePieces || 0;
    const entryGraceBonus = Math.min(3, Math.max(0, state?.playerLevelState?.chosenUpgrades?.['upg_lvl_entry_grace'] ?? 0));
    const totalGrace = baseGracePieces + effectGrace + entryGraceBonus;
    const attackCounter = Math.max(1, baseAttackInterval + totalGrace);

    return {
      id: entry.enemyId,
      name: (monster as any).name || 'Unknown Monster',
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
  ): { pressureEffectId?: string; playerGiftEffectId?: string; messages: string[] } {
    const messages: string[] = [];

    if (!entry.entryEffectId || entry.entryEffectId === 'entry_none_safe') {
      const message = 'A new festival troublemaker hops in!';
      messages.push(message);
      logCallback(message);
      return { messages };
    }

    const effect = contentRegistry.getById<EnemyEntryEffect>(
      'enemyEntryEffect',
      entry.entryEffectId
    );

    if (!effect) {
      const message = 'Another guest arrives!';
      messages.push(message);
      logCallback(message);
      return { messages };
    }

    if (effect.warningText) {
      messages.push(effect.warningText);
      logCallback(effect.warningText);
    }

    if (effect.eventLogText) {
      messages.push(effect.eventLogText);
      logCallback(effect.eventLogText);
    }

    return {
      pressureEffectId: effect.pressureEffectId,
      playerGiftEffectId: effect.playerGiftEffectId,
      messages
    };
  }

  hasRemainingEncounterEnemies(pack: NodeEncounterPack | null): boolean {
    if (!pack) return false;
    return pack.currentEnemyIndex < pack.enemies.length - 1;
  }

  getCurrentEncounterEnemy(pack: NodeEncounterPack | null): EncounterEnemyEntry | null {
    if (!pack) return null;
    return pack.enemies[pack.currentEnemyIndex];
  }

  getNextEncounterEnemy(pack: NodeEncounterPack | null): EncounterEnemyEntry | null {
    if (!this.hasRemainingEncounterEnemies(pack)) return null;
    return pack!.enemies[pack!.currentEnemyIndex + 1];
  }

  advanceEncounterEnemy(pack: NodeEncounterPack): NodeEncounterPack {
    if (this.hasRemainingEncounterEnemies(pack)) {
      pack.currentEnemyIndex += 1;
    }
    pack.remainingEnemyCount = Math.max(0, pack.enemies.length - pack.defeatedEnemyIndexes.length);
    return pack;
  }

  completeEncounterPack(pack: NodeEncounterPack): EncounterPackCompletionResult {
    pack.encounterPackCompleted = true;
    pack.remainingEnemyCount = 0;
    return {
      encounterPackId: pack.encounterPackId,
      nodeId: pack.nodeId,
      stageId: pack.stageId,
      nodeType: pack.nodeType,
      defeatedEnemyIds: pack.enemies.slice(0, pack.currentEnemyIndex + 1).map(e => e.enemyId),
      totalEnemiesDefeated: pack.currentEnemyIndex + 1,
      isFullNodeClear: pack.currentEnemyIndex >= pack.enemies.length - 1
    };
  }

  buildNodeResultSummary(state: RunState, pack: NodeEncounterPack): NodeResultSummary {
    const defeatedCount = pack.defeatedEnemyIds.length;
    let enemyXp = 0;
    let eliteBonusXp = 0;
    let bossBonusXp = 0;

    pack.enemies.forEach(enemy => {
      if (pack.defeatedEnemyIds.includes(enemy.enemyId)) {
        let base = 8;
        if (enemy.role === 'pressure' || enemy.role === 'support') base = 10;
        if (enemy.role === 'finisher') base = 12;

        enemyXp += base;

        if (enemy.rank === 'elite') eliteBonusXp += 20;
        if (enemy.rank === 'elite_miniboss') eliteBonusXp += 25;
        if (enemy.rank === 'boss') bossBonusXp += 50;
      }
    });

    const objectiveCompleted = state.completedBattleObjectives.includes(state.activeBattleObjective ?? '');
    const objectiveBonusXp = objectiveCompleted ? 5 : 0;
    const cascadeBonusXp = state.runStats.maxCascade >= 3 ? 3 : 0;
    const noDamageBonusXp = state.runStats.damageTaken <= 0 ? 5 : 0;
    const routeBonusXp = 0;
    const xpGainedTotal = enemyXp + eliteBonusXp + bossBonusXp + objectiveBonusXp + cascadeBonusXp + noDamageBonusXp + routeBonusXp;
    const xpProjection = this.projectPlayerXp(state, xpGainedTotal);
    const resultId = `${pack.stageId}:${pack.nodeId}:${pack.encounterPackId}`;

    return {
      resultId,
      nodeId: pack.nodeId,
      stageId: pack.stageId,
      nodeType: pack.nodeType,
      encounterPackId: pack.encounterPackId,
      enemiesDefeated: defeatedCount,
      defeatedEnemyIds: [...pack.defeatedEnemyIds],
      xpGainedTotal,
      xpBreakdown: {
        enemyXp,
        eliteBonusXp,
        bossBonusXp,
        objectiveBonusXp,
        cascadeBonusXp,
        noDamageBonusXp,
        routeBonusXp
      },
      currentXpBeforeGain: state.playerLevelState.currentXp,
      currentXpAfterGain: xpProjection.experience,
      xpToNextLevel: xpProjection.xpToNextLevel,
      xpRemainingToNextLevel: xpProjection.xpRemainingToNextLevel,
      leveledUp: xpProjection.pendingLevelUps > 0,
      pendingLevelUps: xpProjection.pendingLevelUps,
      rewardsPending: true
    };
  }

  getOrCreateNodeResultClaim(state: RunState, summary: NodeResultSummary): NodeResultClaimState {
    const encounterPackId = summary.encounterPackId ?? 'unknown_pack';
    const existing = state.nodeResultClaims.find(
      (claim) => claim.resultId === summary.resultId || (claim.nodeId === summary.nodeId && claim.encounterPackId === encounterPackId)
    );
    if (existing) {
      return existing;
    }

    const created: NodeResultClaimState = {
      nodeId: summary.nodeId,
      encounterPackId,
      resultId: summary.resultId,
      resultShown: false,
      xpApplied: false,
      postNodeHealingApplied: false
    };
    state.nodeResultClaims.push(created);
    return created;
  }

  applyNodeResultXpIfNeeded(state: RunState, summary: NodeResultSummary): NodeResultClaimState {
    const claim = this.getOrCreateNodeResultClaim(state, summary);
    if (claim.xpApplied) {
      return claim;
    }

    this.levelUpSystem.applyNodeXpOnce(state, summary);
    claim.xpApplied = true;
    return claim;
  }

  markNodeResultShown(state: RunState, summary: NodeResultSummary): NodeResultClaimState {
    const claim = this.getOrCreateNodeResultClaim(state, summary);
    claim.resultShown = true;
    return claim;
  }

  clearRuntimeState(): void {
    this.recentMonsterMemory.clear();
  }

  private projectPlayerXp(
    state: RunState,
    xpGain: number
  ): {
    level: number;
    experience: number;
    xpToNextLevel: number;
    xpRemainingToNextLevel: number;
    pendingLevelUps: number;
  } {
    let level = Math.max(1, state.playerLevelState.level);
    let experience = Math.max(0, state.playerLevelState.currentXp + Math.max(0, xpGain));
    let xpToNextLevel = Math.max(1, state.playerLevelState.xpToNextLevel);
    let pendingLevelUps = Math.max(0, state.playerLevelState.pendingLevelUps);

    while (experience >= xpToNextLevel) {
      experience -= xpToNextLevel;
      level += 1;
      pendingLevelUps += 1;
      xpToNextLevel = this.levelUpSystem.getXpToNextLevel(level);
    }

    return {
      level,
      experience,
      xpToNextLevel,
      xpRemainingToNextLevel: Math.max(0, xpToNextLevel - experience),
      pendingLevelUps
    };
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
