import type { BlockmancerGame } from '../BlockmancerGame';
import type {
  BiomeMonsterPool,
  EncounterEnemyEntry,
  EncounterPackScalingRule,
  EnemyEntryEffectContent,
  MonsterRank,
  MonsterRole,
  NodeEncounterPack,
  RunState,
  WeightedMonsterRule
} from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';

/**
 * Sequential Encounter Pack System (Step 5-6)
 * 
 * Responsible for:
 * - Loading biome monster pools
 * - Generating encounter packs at node entry
 * - Providing encounter scaling rules
 * - Managing enemy entry effects
 */
export class EncounterPackSystem {
  private game: BlockmancerGame;
  private loadedPools: Map<string, BiomeMonsterPool> = new Map();
  private scalingRules: Map<string, EncounterPackScalingRule> = new Map();
  private entryEffects: Map<string, EnemyEntryEffectContent> = new Map();
  private recentMonsterMemory: Map<string, string[]> = new Map(); // nodeId -> recently used monsterIds

  constructor(game: BlockmancerGame) {
    this.game = game;
  }

  /**
   * Initialize by loading all encounter-related content
   */
  initialize(): void {
    this.loadBiomeMonsterPools();
    this.loadEncounterPackScaling();
    this.loadEnemyEntryEffects();
  }

  /**
   * Load biome monster pool definitions from content registry
   */
  private loadBiomeMonsterPools(): void {
    const pools = contentRegistry.getBiomeMonsterPools();
    if (!pools || pools.length === 0) {
      console.warn('[EncounterPackSystem] No biome monster pools found in content registry');
      return;
    }

    for (const pool of pools) {
      if (pool.enabled !== false) {
        this.loadedPools.set(pool.id, pool);
      }
    }

    console.log(`[EncounterPackSystem] Loaded ${this.loadedPools.size} biome monster pools`);
  }

  /**
   * Load encounter pack scaling rules from content registry
   */
  private loadEncounterPackScaling(): void {
    const rules = contentRegistry.getEncounterPackScalingRules();
    if (!rules || rules.length === 0) {
      console.warn('[EncounterPackSystem] No encounter pack scaling rules found');
      return;
    }

    for (const rule of rules) {
      if (rule.enabled !== false) {
        this.scalingRules.set(rule.id, rule);
      }
    }

    console.log(`[EncounterPackSystem] Loaded ${this.scalingRules.size} encounter pack scaling rules`);
  }

  /**
   * Load enemy entry effect definitions from content registry
   */
  private loadEnemyEntryEffects(): void {
    const effects = contentRegistry.getEnemyEntryEffects();
    if (!effects || effects.length === 0) {
      console.warn('[EncounterPackSystem] No enemy entry effects found');
      return;
    }

    for (const effect of effects) {
      this.entryEffects.set(effect.id, effect);
    }

    console.log(`[EncounterPackSystem] Loaded ${this.entryEffects.size} enemy entry effects`);
  }

  /**
   * Get a biome monster pool by stage ID
   */
  getPoolForStage(stageId: string): BiomeMonsterPool | undefined {
    for (const pool of this.loadedPools.values()) {
      if (pool.stageId === stageId) {
        return pool;
      }
    }
    // Fallback to first available pool
    return this.loadedPools.values().next().value;
  }

  /**
   * Get scaling rule for a specific stage and node type
   */
  getScalingRule(stageId: string, nodeType: string): EncounterPackScalingRule | undefined {
    for (const rule of this.scalingRules.values()) {
      if (rule.stageId === stageId && rule.nodeType === nodeType) {
        return rule;
      }
    }
    // Fallback: try to find any rule for this nodeType
    for (const rule of this.scalingRules.values()) {
      if (rule.nodeType === nodeType) {
        return rule;
      }
    }
    return undefined;
  }

  /**
   * Get an enemy entry effect by ID
   */
  getEntryEffect(effectId: string): EnemyEntryEffectContent | undefined {
    return this.entryEffects.get(effectId);
  }

  /**
   * Generate an encounter pack for a node
   * 
   * @param state - Current run state
   * @param nodeId - The node being entered
   * @param nodeType - Type of node (normal, elite, boss, etc.)
   * @returns Generated NodeEncounterPack or null if generation fails
   */
  generateEncounterPack(
    state: RunState,
    nodeId: string,
    nodeType: string
  ): NodeEncounterPack | null {
    const stageId = this.game.stageSystem.getStageByIndex(state.stage)?.id ?? 'stage_sprinkle_sewers';
    const pool = this.getPoolForStage(stageId);
    const scalingRule = this.getScalingRule(stageId, nodeType);

    if (!pool) {
      console.warn(`[EncounterPackSystem] No monster pool found for stage ${stageId}`);
      return null;
    }

    if (!scalingRule) {
      console.warn(`[EncounterPackSystem] No scaling rule found for ${stageId}/${nodeType}`);
      return null;
    }

    // Determine enemy count based on node position (early vs late)
    const totalNodesInStage = this.game.mapSystem.getNodesForStage(state.stage).length;
    const currentNodeIndex = this.game.mapSystem.getNodeIndexById(nodeId);
    const nodeDepthPercent = totalNodesInStage > 0 ? (currentNodeIndex / totalNodesInStage) * 100 : 0;

    let enemyCount = scalingRule.minEnemies;
    if (scalingRule.earlyNodeEnemyCap && nodeDepthPercent < 50) {
      enemyCount = Math.min(enemyCount, scalingRule.earlyNodeEnemyCap);
    } else if (scalingRule.lateNodeEnemyCap && nodeDepthPercent >= 50) {
      enemyCount = Math.max(enemyCount, Math.min(scalingRule.maxEnemies, scalingRule.lateNodeEnemyCap));
    } else {
      enemyCount = this.randomInt(scalingRule.minEnemies, scalingRule.maxEnemies);
    }

    // Boss and elite nodes are always single enemy (or defined otherwise)
    if (nodeType === 'boss' || nodeType === 'elite') {
      enemyCount = Math.min(enemyCount, 1);
    }

    // Select monsters from pool
    const selectedMonsters = this.selectMonstersFromPool(
      pool,
      enemyCount,
      nodeType,
      nodeId,
      state
    );

    if (selectedMonsters.length === 0) {
      console.error('[EncounterPackSystem] Failed to select any monsters for encounter pack');
      return null;
    }

    // Calculate budget multipliers
    const [hpMin, hpMax] = scalingRule.totalHpBudgetMultiplierRange;
    const [atkMin, atkMax] = scalingRule.totalAttackBudgetMultiplierRange;
    const totalHpMultiplier = hpMin + Math.random() * (hpMax - hpMin);
    const totalAtkMultiplier = atkMin + Math.random() * (atkMax - atkMin);

    // Distribute budgets across enemies
    const enemies: EncounterEnemyEntry[] = selectedMonsters.map((monster, index) => {
      const perEnemyHpMultiplier = totalHpMultiplier / selectedMonsters.length;
      const perEnemyAtkMultiplier = totalAtkMultiplier / selectedMonsters.length;

      // Determine role-based entry effect
      let entryEffectId = 'entry_none';
      if (monster.roles.includes('pressure')) {
        entryEffectId = 'entry_junk_pressure';
      } else if (monster.roles.includes('support')) {
        entryEffectId = 'entry_preview_block';
      }

      return {
        enemyId: monster.monsterId,
        role: monster.roles[0] ?? 'starter',
        rank: monster.rank ?? 'regular',
        hpMultiplier: perEnemyHpMultiplier,
        attackMultiplier: perEnemyAtkMultiplier,
        entryEffectId,
        entryGracePieces: scalingRule.entryGracePieces,
        tags: monster.tags
      };
    });

    const encounterPackId = `pack_${stageId}_${nodeId}_${Date.now()}`;

    const pack: NodeEncounterPack = {
      encounterPackId,
      nodeId,
      stageId,
      biomeId: pool.biomeId,
      nodeType: nodeType as any,
      enemies,
      currentEnemyIndex: 0,
      totalHpBudgetMultiplier: totalHpMultiplier,
      totalAttackBudgetMultiplier: totalAtkMultiplier,
      maxActiveHazards: scalingRule.maxActiveHazards,
      rewardsGrantedOnlyOnNodeClear: true,
      xpGrantedOnlyOnNodeClear: true,
      generatedFromPoolId: pool.id,
      seed: Date.now()
    };

    // Update recent monster memory
    this.updateRecentMonsterMemory(nodeId, selectedMonsters.map(m => m.monsterId));

    console.log(`[EncounterPackSystem] Generated encounter pack ${encounterPackId} with ${enemies.length} enemies`);
    return pack;
  }

  /**
   * Select monsters from pool using weighted random selection
   */
  private selectMonstersFromPool(
    pool: BiomeMonsterPool,
    count: number,
    nodeType: string,
    nodeId: string,
    state: RunState
  ): WeightedMonsterRule[] {
    const selected: WeightedMonsterRule[] = [];
    const recentMemory = this.recentMonsterMemory.get(nodeId) ?? [];
    const allowedRoles = this.getAllowedRolesForNodeType(nodeType);

    // Filter eligible monsters
    const eligibleMonsters = pool.monsterRules.filter(rule => {
      // Check role eligibility
      if (!rule.roles.some(role => allowedRoles.includes(role))) {
        return false;
      }

      // Check node type restrictions
      if (rule.allowedNodeTypes && !rule.allowedNodeTypes.includes(nodeType as any)) {
        return false;
      }

      // Check banned pairs with already selected monsters
      if (rule.bannedWithTags) {
        for (const alreadySelected of selected) {
          if (alreadySelected.tags?.some(tag => rule.bannedWithTags!.includes(tag))) {
            return false;
          }
        }
      }

      // Check duplicate limit
      const duplicateCount = selected.filter(s => s.monsterId === rule.monsterId).length;
      if (duplicateCount >= pool.maxDuplicatePerNode) {
        return false;
      }

      // Prefer monsters not in recent memory
      if (recentMemory.includes(rule.monsterId) && selected.length < count) {
        // Still allow but with reduced priority (handled by weight adjustment below)
      }

      return true;
    });

    if (eligibleMonsters.length === 0) {
      // Fallback to any monster in pool
      console.warn('[EncounterPackSystem] No eligible monsters found, using fallback');
      if (pool.monsterRules.length > 0) {
        return [pool.monsterRules[0]];
      }
      return [];
    }

    // Weighted selection
    for (let i = 0; i < count; i++) {
      const chosen = this.weightedRandomSelect(eligibleMonsters, recentMemory);
      if (chosen) {
        selected.push(chosen);

        // Remove from eligible if duplicates not allowed
        if (pool.maxDuplicatePerNode <= 1) {
          const idx = eligibleMonsters.indexOf(chosen);
          if (idx >= 0) {
            eligibleMonsters.splice(idx, 1);
          }
        }
      }

      if (eligibleMonsters.length === 0) {
        break;
      }
    }

    // Ensure at least one monster
    if (selected.length === 0 && pool.monsterRules.length > 0) {
      selected.push(pool.monsterRules[0]);
    }

    return selected;
  }

  /**
   * Get allowed monster roles for a node type
   */
  private getAllowedRolesForNodeType(nodeType: string): MonsterRole[] {
    switch (nodeType) {
      case 'normal':
        return ['starter', 'pressure', 'support', 'finisher'];
      case 'elite':
        return ['pressure', 'support', 'finisher'];
      case 'boss':
        return ['finisher'];
      case 'mini_boss':
      case 'royal_guard':
        return ['pressure', 'finisher'];
      default:
        return ['starter', 'pressure', 'support', 'finisher'];
    }
  }

  /**
   * Weighted random selection with recent memory penalty
   */
  private weightedRandomSelect(
    candidates: WeightedMonsterRule[],
    recentMemory: string[]
  ): WeightedMonsterRule | null {
    if (candidates.length === 0) {
      return null;
    }

    // Calculate total weight with penalties
    const weights = candidates.map(candidate => {
      let weight = candidate.weight;
      if (recentMemory.includes(candidate.monsterId)) {
        weight *= 0.5; // Reduce weight for recently used monsters
      }
      return weight;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < candidates.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return candidates[i];
      }
    }

    return candidates[candidates.length - 1];
  }

  /**
   * Update recent monster memory for a node
   */
  private updateRecentMonsterMemory(nodeId: string, monsterIds: string[]): void {
    const memory = this.recentMonsterMemory.get(nodeId) ?? [];
    for (const id of monsterIds) {
      if (!memory.includes(id)) {
        memory.push(id);
      }
    }

    // Keep only recent entries
    const maxMemory = 5;
    while (memory.length > maxMemory) {
      memory.shift();
    }

    this.recentMonsterMemory.set(nodeId, memory);
  }

  /**
   * Get the current enemy from an encounter pack
   */
  getCurrentEnemy(pack: NodeEncounterPack): EncounterEnemyEntry | null {
    if (pack.currentEnemyIndex < 0 || pack.currentEnemyIndex >= pack.enemies.length) {
      return null;
    }
    return pack.enemies[pack.currentEnemyIndex];
  }

  /**
   * Advance to the next enemy in the pack
   * @returns true if there is a next enemy, false if pack is complete
   */
  advanceToNextEnemy(pack: NodeEncounterPack): boolean {
    pack.currentEnemyIndex += 1;
    return pack.currentEnemyIndex < pack.enemies.length;
  }

  /**
   * Check if the encounter pack is fully cleared
   */
  isPackCleared(pack: NodeEncounterPack): boolean {
    return pack.currentEnemyIndex >= pack.enemies.length;
  }

  /**
   * Get remaining enemy count in pack
   */
  getRemainingEnemyCount(pack: NodeEncounterPack): number {
    return pack.enemies.length - pack.currentEnemyIndex - 1; // Exclude current
  }

  /**
   * Get total enemy count in pack
   */
  getTotalEnemyCount(pack: NodeEncounterPack): number {
    return pack.enemies.length;
  }

  /**
   * Simple random integer helper
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Clear runtime state (for new run)
   */
  clearRuntimeState(): void {
    this.recentMonsterMemory.clear();
  }
}
