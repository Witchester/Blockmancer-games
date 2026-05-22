import type { NodeEncounterPack, EncounterEnemyEntry, EnemyInstance, RoomType, RunState } from '../types/GameTypes';
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
  constructor(
    private readonly difficultySystem: DifficultySystem = new DifficultySystem(),
    private readonly stageSystem: StageSystem = new StageSystem()
  ) {}

  /**
   * Generate an encounter pack for a node based on stage, node type, and position.
   */
  generatePack(
    stageId: string,
    nodeType: RoomType,
    nodeId: string,
    isEarlyNode: boolean,
    recentMonsterIds: string[] = [],
    seed?: number
  ): NodeEncounterPack | null {
    const stageIndex = this.stageSystem.getStageIndex(stageId);
    if (stageIndex === -1) {
      console.warn(`[EncounterPackSystem] Unknown stageId: ${stageId}`);
      return null;
    }

    // Get scaling rule
    const scalingRules = contentRegistry.listEnabled<EncounterPackScalingRule>('difficultyScaling')
      .filter(r => r.id.startsWith('scale_encounter_'));
    
    const matchingRule = scalingRules.find(r => 
      r.stageId === stageId && 
      r.nodeType === nodeType &&
      r.enabled !== false
    );

    if (!matchingRule) {
      console.warn(`[EncounterPackSystem] No scaling rule for ${stageId}/${nodeType}`);
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    // Determine enemy count
    let enemyCount = seededRandom(seed || Date.now(), 0, 1) < 0.5 
      ? matchingRule.minEnemies 
      : matchingRule.maxEnemies;

    // Apply early/late node caps
    if (isEarlyNode && matchingRule.earlyNodeEnemyCap) {
      enemyCount = Math.min(enemyCount, matchingRule.earlyNodeEnemyCap);
    } else if (!isEarlyNode && matchingRule.lateNodeEnemyCap) {
      enemyCount = Math.min(enemyCount, matchingRule.lateNodeEnemyCap);
    }

    // Boss and elite nodes are always 1 enemy for now
    if (nodeType === 'boss' || nodeType === 'elite') {
      enemyCount = 1;
    }

    enemyCount = Math.max(1, Math.min(enemyCount, matchingRule.maxEnemies));

    // Get biome pool
    const biomeId = `biome_${stageId.replace('stage_', '')}`;
    const pool = this.getBiomePool(stageId, biomeId);
    
    if (!pool) {
      console.warn(`[EncounterPackSystem] No biome pool for ${stageId}`);
      return this.createFallbackPack(stageId, nodeType, nodeId);
    }

    // Generate enemies
    const enemies: EncounterEnemyEntry[] = [];
    const usedMonsterIds = new Set<string>();

    for (let i = 0; i < enemyCount; i++) {
      const enemy = this.generateEnemyEntry(
        pool,
        nodeType,
        stageIndex,
        matchingRule,
        usedMonsterIds,
        recentMonsterIds,
        i === 0 // first enemy
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

    // Calculate budget multipliers
    const hpRange = matchingRule.totalHpBudgetMultiplierRange;
    const atkRange = matchingRule.totalAttackBudgetMultiplierRange;
    const rand = seededRandom((seed || Date.now()) + enemies.length, 0, 1);

    return {
      encounterPackId: `pack_${stageId}_${nodeType}_${nodeId}`,
      nodeId,
      stageId,
      biomeId: pool.biomeId,
      nodeType: nodeType as any,
      enemies,
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier: hpRange[0] + rand * (hpRange[1] - hpRange[0]),
      totalAttackBudgetMultiplier: atkRange[0] + rand * (atkRange[1] - atkRange[0]),
      maxActiveHazards: matchingRule.maxActiveHazards,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true,
      breatherRewardPolicy: enemyCount > 1 ? {
        enabled: true,
        maxHealPercentPerNode: 5,
        allowedRewards: ['hp', 'mana', 'shield']
      } : undefined,
      generatedFromPoolId: pool.id,
      seed: seed ?? Date.now()
    };
  }

  private getBiomePool(stageId: string, biomeId: string): BiomeMonsterPool | null {
    // Try to load from content registry - currently stored as difficultyScaling
    // In future, this could be its own category
    const allDifficulty = contentRegistry.listEnabled<any>('difficultyScaling');
    const pool = allDifficulty.find((r: any) => r.stageId === stageId && r.biomeId === biomeId);
    
    if (pool && pool.monsterRules) {
      return pool as BiomeMonsterPool;
    }

    // Fallback: try direct lookup by known pool ID pattern
    const poolId = `pool_${biomeId.replace('biome_', '')}`;
    // For now, use hardcoded fallback for Stage 1
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
          { monsterId: 'mon_cupcake_slime', weight: 35, roles: ['starter'], rank: 'regular', tags: ['stage_1'] },
          { monsterId: 'mon_sugar_bat', weight: 20, roles: ['pressure'], rank: 'regular', tags: ['stage_1'] },
          { monsterId: 'mon_crumb_goblin', weight: 20, roles: ['pressure'], rank: 'regular', tags: ['stage_1'] },
          { monsterId: 'mon_jelly_rat', weight: 15, roles: ['finisher'], rank: 'regular', tags: ['stage_1'] },
          { monsterId: 'mon_sprinkle_snail', weight: 10, roles: ['support'], rank: 'regular', tags: ['stage_1'] },
          { monsterId: 'mon_frosting_blob', weight: 10, roles: ['support'], rank: 'regular', tags: ['stage_1'] }
        ],
        enabled: true
      };
    }

    return null;
  }

  private generateEnemyEntry(
    pool: BiomeMonsterPool,
    nodeType: RoomType,
    stageIndex: number,
    scalingRule: EncounterPackScalingRule,
    usedMonsterIds: Set<string>,
    recentMonsterIds: string[],
    isFirstEnemy: boolean
  ): EncounterEnemyEntry | null {
    // Filter available monsters
    let candidates = pool.monsterRules.filter(r => 
      !usedMonsterIds.has(r.monsterId) &&
      !recentMonsterIds.includes(r.monsterId)
    );

    if (candidates.length === 0) {
      // Allow duplicates if no fresh options
      candidates = pool.monsterRules.filter(r => !usedMonsterIds.has(r.monsterId));
    }

    if (candidates.length === 0) {
      // Complete fallback
      const fallback = contentRegistry.getMonster(pool.fallbackMonsterId);
      if (!fallback) return null;
      
      return {
        enemyId: pool.fallbackMonsterId,
        role: 'starter' as any,
        rank: 'regular' as any,
        hpMultiplier: 1.0,
        attackMultiplier: 1.0,
        entryGracePieces: scalingRule.entryGracePieces,
        entryEffectId: isFirstEnemy ? undefined : 'entry_junk_pressure'
      };
    }

    // Weighted selection
    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    let rand = seededRandom(Date.now() + candidates.length, 0, totalWeight);
    
    let selected = candidates[0];
    for (const c of candidates) {
      rand -= c.weight;
      if (rand <= 0) {
        selected = c;
        break;
      }
    }

    const monster = contentRegistry.getMonster(selected.monsterId);
    if (!monster) {
      console.warn(`[EncounterPackSystem] Monster not found: ${selected.monsterId}`);
      return null;
    }

    // Calculate multipliers based on position in pack
    const enemyIndex = usedMonsterIds.size;
    const hpMultiplier = 1.0 + (enemyIndex * 0.1); // Later enemies slightly tankier
    const attackMultiplier = 1.0 + (enemyIndex * 0.05);

    // Entry effect for non-first enemies
    const entryEffectId = isFirstEnemy 
      ? undefined 
      : this.selectEntryEffect(nodeType, stageIndex);

    return {
      enemyId: selected.monsterId,
      role: (selected.roles[0] || 'starter') as any,
      rank: (selected.rank || 'regular') as any,
      hpMultiplier,
      attackMultiplier,
      armorMultiplier: 1.0,
      entryEffectId,
      entryGracePieces: scalingRule.entryGracePieces,
      tags: selected.tags
    };
  }

  private selectEntryEffect(nodeType: RoomType, stageIndex: number): string {
    const effects = contentRegistry.listEnabled<EnemyEntryEffect>('difficultyScaling')
      .filter(e => e.id.startsWith('entry_') && e.id !== 'entry_none');
    
    if (effects.length === 0) return 'entry_none_safe';

    // Stage-appropriate selection
    const safeEffects = effects.filter(e => 
      !e.tags.includes('boss') || nodeType === 'boss'
    );

    const selected = choice(safeEffects.length > 0 ? safeEffects : effects);
    return selected.id;
  }

  private createFallbackPack(stageId: string, nodeType: RoomType, nodeId: string): NodeEncounterPack {
    const fallbackMonster = contentRegistry.getMonster('mon_cupcake_slime');
    
    return {
      encounterPackId: `pack_fallback_${nodeId}`,
      nodeId,
      stageId,
      biomeId: 'biome_sprinkle_sewers',
      nodeType: nodeType as any,
      enemies: [{
        enemyId: 'mon_cupcake_slime',
        role: 'starter',
        rank: 'regular',
        hpMultiplier: 1.0,
        attackMultiplier: 1.0,
        entryGracePieces: 3,
        entryEffectId: nodeType === 'boss' ? undefined : 'entry_junk_pressure'
      }],
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier: 1.0,
      totalAttackBudgetMultiplier: 1.0,
      maxActiveHazards: 1,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true
    };
  }

  /**
   * Check if there are remaining enemies in the pack.
   */
  hasRemainingEncounterEnemies(pack: NodeEncounterPack | null): boolean {
    if (!pack) return false;
    return pack.currentEnemyIndex < pack.enemies.length - 1;
  }

  /**
   * Get the current active enemy entry.
   */
  getCurrentEncounterEnemy(pack: NodeEncounterPack | null): EncounterEnemyEntry | null {
    if (!pack || pack.currentEnemyIndex >= pack.enemies.length) return null;
    return pack.enemies[pack.currentEnemyIndex];
  }

  /**
   * Get the next enemy entry without advancing.
   */
  getNextEncounterEnemy(pack: NodeEncounterPack | null): EncounterEnemyEntry | null {
    if (!pack || pack.currentEnemyIndex >= pack.enemies.length - 1) return null;
    return pack.enemies[pack.currentEnemyIndex + 1];
  }

  /**
   * Advance to the next enemy in the pack.
   */
  advanceEncounterEnemy(pack: NodeEncounterPack): NodeEncounterPack {
    if (this.hasRemainingEncounterEnemies(pack)) {
      pack.currentEnemyIndex += 1;
    }
    return pack;
  }

  /**
   * Create an EnemyInstance from an EncounterEnemyEntry.
   */
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
      this.difficultySystem.getEnemyAttack(baseAttack, stageIndex) * entry.attackMultiplier
    );
    const armor = Math.round((baseArmor || 0) * (entry.armorMultiplier || 1.0));

    // Calculate attack counter with grace pieces
    const entryEffect = entry.entryEffectId 
      ? contentRegistry.getById<EnemyEntryEffect>('difficultyScaling', entry.entryEffectId)
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
      behaviors: (monster as any).behaviors?.length ? [...(monster as any).behaviors] : ['basic_attack'],
      roomType: entry.role === 'boss' ? 'boss' : entry.role === 'elite' ? 'elite' : 'fight',
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

  /**
   * Apply enemy entry effect (pressure + gift).
   * Returns event log messages.
   */
  applyEnemyEntryEffect(
    state: RunState,
    entry: EncounterEnemyEntry,
    logCallback: (message: string) => void
  ): { pressureApplied: boolean; giftApplied: boolean; messages: string[] } {
    const messages: string[] = [];
    let pressureApplied = false;
    let giftApplied = false;

    if (!entry.entryEffectId) {
      // No special entry effect
      logCallback('A new festival troublemaker hops in!');
      return { pressureApplied: false, giftApplied: false, messages };
    }

    const effect = contentRegistry.getById<EnemyEntryEffect>(
      'difficultyScaling',
      entry.entryEffectId
    );

    if (!effect) {
      logCallback('Another guest arrives!');
      return { pressureApplied: false, giftApplied: false, messages };
    }

    // Log warning and event text
    if (effect.warningText) {
      messages.push(effect.warningText);
      logCallback(effect.warningText);
    }
    
    if (effect.eventLogText) {
      messages.push(effect.eventLogText);
      logCallback(effect.eventLogText);
    }

    // Apply pressure effect (simplified - full implementation in later steps)
    if (effect.pressureEffectId) {
      // TODO: Implement full pressure effect handlers
      // For now, just acknowledge the pressure
      pressureApplied = true;
      messages.push(`Pressure: ${effect.pressureEffectId} (pending full implementation)`);
    }

    // Apply player gift effect (simplified - full implementation in later steps)
    if (effect.playerGiftEffectId) {
      // TODO: Implement full gift effect handlers
      // For now, grant a small mana bonus as universal gift
      state.mana = Math.min(state.mana + 2, state.maxMana);
      giftApplied = true;
      messages.push('You gain +2 mana from the festive chaos!');
      logCallback('You gain +2 mana from the festive chaos!');
    }

    return { pressureApplied, giftApplied, messages };
  }

  /**
   * Complete the encounter pack and return summary.
   */
  completeEncounterPack(pack: NodeEncounterPack): {
    encounterPackId: string;
    nodeId: string;
    stageId: string;
    nodeType: string;
    defeatedEnemyIds: string[];
    totalEnemiesDefeated: number;
    isFullNodeClear: boolean;
  } {
    const defeatedEnemyIds = pack.enemies.slice(0, pack.currentEnemyIndex + 1).map(e => e.enemyId);
    
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
}
