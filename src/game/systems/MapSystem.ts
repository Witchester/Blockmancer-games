import { MAP_NODES } from '../data/mapNodes';
import type { EventCard, MapNodeDefinition, RunState } from '../types/GameTypes';
import { choice, randInt } from '../utils/random';
import type { StageSystem } from './StageSystem';

/**
 * Canonical stage map structure configuration aligned with GDD requirements.
 * Each stage has specific node counts and required structure.
 */
type StageMapStructure = {
  stageId: string;
  stageNumber: number;
  mainPathNodes: number;
  totalGeneratedNodesMin: number;
  totalGeneratedNodesMax: number;
  requiredMainPath: {
    normal: number;
    event: number;
    shop: number;
    rest: number;
    treasure: number;
    elite: number;
    miniBoss?: number;
    boss: number;
  };
  allowedOptionalNodeTypes: string[];
  notes?: string;
};

const STAGE_MAP_STRUCTURES: Record<string, StageMapStructure> = {
  stage_sprinkle_sewers: {
    stageId: 'stage_sprinkle_sewers',
    stageNumber: 1,
    mainPathNodes: 6,
    totalGeneratedNodesMin: 9,
    totalGeneratedNodesMax: 11,
    requiredMainPath: {
      normal: 3,
      event: 1,
      shop: 0,
      rest: 0,
      treasure: 1,
      elite: 0,
      miniBoss: 0,
      boss: 1
    },
    allowedOptionalNodeTypes: ['normal', 'event', 'treasure', 'rest'],
    notes: 'Stage 1: No elite nodes allowed. First stage tutorial.'
  },
  stage_goblin_workshop: {
    stageId: 'stage_goblin_workshop',
    stageNumber: 2,
    mainPathNodes: 8,
    totalGeneratedNodesMin: 12,
    totalGeneratedNodesMax: 14,
    requiredMainPath: {
      normal: 4,
      event: 1,
      shop: 1,
      rest: 0,
      treasure: 0,
      elite: 1,
      miniBoss: 0,
      boss: 1
    },
    allowedOptionalNodeTypes: ['normal', 'event', 'shop', 'treasure', 'rest', 'elite'],
    notes: 'Stage 2: First elite node introduced.'
  },
  stage_frosty_pantry: {
    stageId: 'stage_frosty_pantry',
    stageNumber: 3,
    mainPathNodes: 10,
    totalGeneratedNodesMin: 15,
    totalGeneratedNodesMax: 17,
    requiredMainPath: {
      normal: 5,
      event: 1,
      shop: 0,
      rest: 1,
      treasure: 1,
      elite: 1,
      miniBoss: 0,
      boss: 1
    },
    allowedOptionalNodeTypes: ['normal', 'event', 'shop', 'treasure', 'rest', 'elite'],
    notes: 'Stage 3: Rest node added for recovery before elite.'
  },
  stage_pillow_castle: {
    stageId: 'stage_pillow_castle',
    stageNumber: 4,
    mainPathNodes: 12,
    totalGeneratedNodesMin: 18,
    totalGeneratedNodesMax: 21,
    requiredMainPath: {
      normal: 6,
      event: 2,
      shop: 1,
      rest: 1,
      treasure: 0,
      elite: 1,
      miniBoss: 0,
      boss: 1
    },
    allowedOptionalNodeTypes: ['normal', 'event', 'shop', 'treasure', 'rest', 'elite'],
    notes: 'Stage 4: Two events for more story content.'
  },
  stage_starfall_arcade: {
    stageId: 'stage_starfall_arcade',
    stageNumber: 5,
    mainPathNodes: 14,
    totalGeneratedNodesMin: 22,
    totalGeneratedNodesMax: 25,
    requiredMainPath: {
      normal: 7,
      event: 2,
      shop: 1,
      rest: 0,
      treasure: 1,
      elite: 2,
      miniBoss: 0,
      boss: 1
    },
    allowedOptionalNodeTypes: ['normal', 'event', 'shop', 'treasure', 'rest', 'elite'],
    notes: 'Stage 5: Two elite nodes for increased challenge.'
  },
  stage_bloxley_block_palace: {
    stageId: 'stage_bloxley_block_palace',
    stageNumber: 6,
    mainPathNodes: 16,
    totalGeneratedNodesMin: 26,
    totalGeneratedNodesMax: 30,
    requiredMainPath: {
      normal: 8,
      event: 2,
      shop: 1,
      rest: 1,
      treasure: 0,
      elite: 2,
      miniBoss: 1,
      boss: 1
    },
    allowedOptionalNodeTypes: ['normal', 'event', 'shop', 'treasure', 'rest', 'elite', 'mini_boss', 'royal_guard'],
    notes: 'Stage 6: Final stage with mini-boss/royal guard before final boss.'
  }
};

// Legacy numeric index config for backward compatibility - maps to canonical structures
const STAGE_NODE_CONFIG: Record<number, StageMapStructure> = {
  1: STAGE_MAP_STRUCTURES.stage_sprinkle_sewers,
  2: STAGE_MAP_STRUCTURES.stage_goblin_workshop,
  3: STAGE_MAP_STRUCTURES.stage_frosty_pantry,
  4: STAGE_MAP_STRUCTURES.stage_pillow_castle,
  5: STAGE_MAP_STRUCTURES.stage_starfall_arcade,
  6: STAGE_MAP_STRUCTURES.stage_bloxley_block_palace
};

const NODE_LABELS: Record<MapNodeDefinition['roomType'], { label: string; icon: string }> = {
  start: { label: 'Start', icon: 'S' },
  fight: { label: 'Fight', icon: 'F' },
  event: { label: 'Event', icon: '?' },
  shop: { label: 'Shop', icon: '$' },
  elite: { label: 'Elite', icon: 'E' },
  rest: { label: 'Rest', icon: 'R' },
  treasure: { label: 'Treasure', icon: 'T' },
  boss: { label: 'Boss', icon: 'B' },
  mini_boss: { label: 'Mini-Boss', icon: 'M' },
  royal_guard: { label: 'Royal Guard', icon: 'G' }
};

const EVENT_CARDS: EventCard[] = [
  {
    id: 'shrine-of-gravity',
    title: 'Shrine of Gravity',
    description: 'A tilted altar hums with stabilizing force.',
    choices: [
      { label: 'Anchor', description: 'Reduce fall speed by 0.1.', outcomeKey: 'slow' },
      { label: 'Take Tribute', description: 'Gain 30 gold.', outcomeKey: 'gold' },
      { label: 'Snack Trade', description: 'Take 3 damage and gain a random reward.', outcomeKey: 'reward' }
    ]
  },
  {
    id: 'broken-anvil',
    title: 'Broken Anvil',
    description: 'A smithing altar still crackles with trapped arcana.',
    choices: [
      { label: 'Temper Spell', description: 'Upgrade a random spell effect.', outcomeKey: 'random-spell' },
      { label: 'Pay 30 Gold', description: 'Buy a focused spell upgrade.', outcomeKey: 'paid-spell' },
      { label: 'Leave', description: 'Keep moving.', outcomeKey: 'leave' }
    ]
  },
  {
    id: 'strange-mirror',
    title: 'Strange Mirror',
    description: 'Your reflection offers impossible bargains.',
    choices: [
      { label: 'Duplicate Relic', description: 'Gain a copy of a random owned relic benefit.', outcomeKey: 'duplicate' },
      { label: 'Take Oopsie', description: 'Gain a silly drawback and 60 gold.', outcomeKey: 'oopsie' },
      { label: 'Leave', description: 'Back away from the mirror.', outcomeKey: 'leave' }
    ]
  },
  {
    id: 'lost-knight',
    title: 'Lost Knight',
    description: 'A sleepy knight offers one last festival favor.',
    choices: [
      { label: 'Bind Wounds', description: 'Heal 5 HP.', outcomeKey: 'heal' },
      { label: 'Honor Duel', description: 'Gain 20 gold and brace for a harder path.', outcomeKey: 'gold' },
      { label: 'Search Camp', description: 'Gain a minor relic-like effect.', outcomeKey: 'reward' }
    ]
  }
];

export class MapSystem {
  createMap(stage = 1): MapNodeDefinition[] {
    const config = STAGE_NODE_CONFIG[stage];
    if (!config) {
      return MAP_NODES.map((node) => ({ ...node }));
    }
    return this.generateStageMap(stage, config);
  }

  getNode(map: MapNodeDefinition[], nodeId: string): MapNodeDefinition | undefined {
    return map.find((node) => node.id === nodeId);
  }

  getAvailableNodes(state: RunState): MapNodeDefinition[] {
    const current = this.getNode(state.map, state.currentNodeId);
    if (!current) {
      return [];
    }

    return state.map.filter((node) => current.connections.includes(node.id) && !node.completed);
  }

  canVisit(state: RunState, nodeId: string): boolean {
    return this.getAvailableNodes(state).some((node) => node.id === nodeId);
  }

  moveToNode(state: RunState, nodeId: string): MapNodeDefinition | null {
    if (!this.canVisit(state, nodeId)) {
      return null;
    }

    const previousNode = this.getNode(state.map, state.currentNodeId);
    const node = this.getNode(state.map, nodeId);
    if (!node) {
      return null;
    }

    if (previousNode) {
      previousNode.completed = true;
    }

    state.currentNodeId = node.id;
    state.currentRoomType = node.roomType;
    state.currentRoomProgress = 'entered';
    return node;
  }

  completeNode(state: RunState, nodeId: string): void {
    const node = this.getNode(state.map, nodeId);
    if (node) {
      node.completed = true;
    }
    state.currentRoomProgress = 'complete';
  }

  advanceAfterBoss(state: RunState, stageSystem: StageSystem): 'next-stage' | 'final-victory' {
    this.completeNode(state, state.currentNodeId);

    if (stageSystem.isFinalStage(state.stage)) {
      state.victory = true;
      state.runStatus = 'victory';
      state.currentRoomProgress = 'cleared';
      return 'final-victory';
    }

    state.stage += 1;
    state.map = this.createMap(state.stage);
    state.currentNodeId = 'start';
    state.currentRoomType = 'start';
    state.currentRoomProgress = 'idle';
    state.activeEnemy = null;
    state.lastBattleWasBoss = false;
    state.pendingStageAdvance = false;
    state.runStatus = 'map';
    return 'next-stage';
  }

  getRandomEvent(): EventCard {
    return choice(EVENT_CARDS);
  }

  /**
   * Generate a stage-aware map following GDD-required node structure.
   * Later stages are longer and more strategic.
   */
  private generateStageMap(stage: number, config: StageMapStructure): MapNodeDefinition[] {
    const nodes: MapNodeDefinition[] = [];
    const totalNodes = randInt(config.totalGeneratedNodesMin, config.totalGeneratedNodesMax);
    const required = config.requiredMainPath;

    // Build the main path node sequence from required structure
    const mainPathTypes = this.buildMainPathSequence(required, config.stageNumber);

    nodes.push(this.createNode('start', 'start', 0.5, 0.94));

    let previousId = 'start';
    const mainPathLength = mainPathTypes.length;

    for (let index = 0; index < mainPathLength; index += 1) {
      const roomType = mainPathTypes[index];
      const isBoss = roomType === 'boss';
      const isMiniBoss = roomType === 'mini_boss' || roomType === 'royal_guard';
      const id = isBoss ? 'boss' : isMiniBoss ? `miniboss-${stage}` : `main-${stage}-${index + 1}`;
      // Zigzag x position for visual variety
      const x = index % 2 === 0 ? 0.42 : 0.58;
      // Evenly distribute nodes vertically
      const y = 0.84 - (index * 0.76) / Math.max(1, mainPathLength - 1);
      const node = this.createNode(id, roomType, x, y);
      nodes.push(node);
      this.getNode(nodes, previousId)?.connections.push(id);
      previousId = id;
    }

    // Calculate optional/side nodes (total - start - mainPath)
    const currentCount = nodes.length;
    const branchCount = Math.max(0, totalNodes - currentCount);

    // Add side branches that don't break the main path
    for (let index = 0; index < branchCount; index += 1) {
      // Attach to a non-boss, non-start node on the main path
      const maxAttachIndex = mainPathLength - 1; // Don't attach to boss
      const minAttachIndex = 1; // Don't attach to start
      const attachIndex = minAttachIndex + (index % Math.max(1, maxAttachIndex - minAttachIndex));
      const attach = nodes[attachIndex];
      const rejoinIndex = Math.min(mainPathLength, attachIndex + 2);
      const rejoin = nodes[rejoinIndex];
      const side = index % 2 === 0 ? -1 : 1;
      const roomType = this.getOptionalNodeType(config, stage);
      const id = `side-${stage}-${index + 1}`;
      const node = this.createNode(id, roomType, Math.max(0.12, Math.min(0.88, attach.x + side * 0.24)), Math.max(0.06, attach.y - 0.08));
      node.connections.push(rejoin.id);
      attach.connections.push(id);
      nodes.push(node);
    }

    return nodes;
  }

  /**
   * Build the main path node sequence from required structure.
   * Ensures correct placement: first node normal, boss last, mini-boss before boss for stage 6.
   */
  private buildMainPathSequence(required: StageMapStructure['requiredMainPath'], stageNumber: number): Array<MapNodeDefinition['roomType']> {
    const types: MapNodeDefinition['roomType'][] = [];

    // Add normal (fight) nodes first
    for (let i = 0; i < required.normal; i++) {
      types.push('fight');
    }

    // Add event nodes (distributed, not all at end)
    for (let i = 0; i < required.event; i++) {
      types.push('event');
    }

    // Add shop nodes
    for (let i = 0; i < required.shop; i++) {
      types.push('shop');
    }

    // Add rest nodes
    for (let i = 0; i < required.rest; i++) {
      types.push('rest');
    }

    // Add treasure nodes
    for (let i = 0; i < required.treasure; i++) {
      types.push('treasure');
    }

    // Add elite nodes (Stage 2+, never Stage 1)
    if (stageNumber >= 2) {
      for (let i = 0; i < (required.elite ?? 0); i++) {
        types.push('elite');
      }
    }

    // Add mini-boss / royal guard for Stage 6 (before boss)
    if (stageNumber === 6 && (required.miniBoss ?? 0) > 0) {
      types.push('royal_guard');
    }

    // Boss is always last
    for (let i = 0; i < required.boss; i++) {
      types.push('boss');
    }

    // Reorder for better flow: ensure first node is normal, events distributed, elites after some normals
    return this.reorderMainPathForFlow(types, stageNumber);
  }

  /**
   * Reorder main path nodes for better gameplay flow.
   * - First node should be normal
   * - Events distributed, not clustered at end
   * - Elite nodes appear after at least one normal node
   * - Shop/rest/treasure not as first combat node unless design allows
   * - Mini-boss before boss for Stage 6
   */
  private reorderMainPathForFlow(types: MapNodeDefinition['roomType'][], stageNumber: number): MapNodeDefinition['roomType'][] {
    const result: MapNodeDefinition['roomType'][] = [];
    const remaining = [...types];

    // First node: must be normal (fight)
    const firstNormalIndex = remaining.findIndex(t => t === 'fight');
    if (firstNormalIndex !== -1) {
      result.push(remaining.splice(firstNormalIndex, 1)[0]);
    }

    // Boss is always last - remove and add at end
    const bossIndex = remaining.findIndex(t => t === 'boss');
    if (bossIndex !== -1) {
      remaining.splice(bossIndex, 1);
    }

    // Mini-boss / royal guard should be second-to-last (before boss) for Stage 6
    const miniBossIndex = remaining.findIndex(t => t === 'royal_guard' || t === 'mini_boss');
    let miniBoss: MapNodeDefinition['roomType'] | undefined;
    if (miniBossIndex !== -1 && stageNumber === 6) {
      miniBoss = remaining.splice(miniBossIndex, 1)[0];
    }

    // Distribute events early-mid path
    const eventIndices = remaining.map((t, i) => t === 'event' ? i : -1).filter(i => i !== -1);
    const eventsToPlace: MapNodeDefinition['roomType'][] = [];
    for (const idx of eventIndices.reverse()) {
      eventsToPlace.push(remaining.splice(idx, 1)[0]);
    }

    // Place some events early
    while (eventsToPlace.length > 0 && result.length < Math.ceil(remaining.length / 3)) {
      result.push(eventsToPlace.shift()!);
    }

    // Add remaining non-elite, non-shop, non-rest nodes
    const combatNodes = remaining.filter(t => t === 'fight');
    const otherNodes = remaining.filter(t => !['fight', 'elite', 'shop', 'rest', 'event'].includes(t));
    const utilityNodes = remaining.filter(t => t === 'shop' || t === 'rest');
    const eliteNodes = remaining.filter(t => t === 'elite');

    // Add combat nodes
    result.push(...combatNodes);

    // Add remaining events
    result.push(...eventsToPlace);

    // Add utility nodes (shop/rest) mid-path
    result.push(...utilityNodes);

    // Add elite nodes after some combat experience (not first)
    result.push(...eliteNodes);

    // Add other nodes
    result.push(...otherNodes);

    // Add mini-boss before boss
    if (miniBoss) {
      result.push(miniBoss);
    }

    // Boss is always last
    if (bossIndex !== -1) {
      result.push('boss');
    }

    return result;
  }

  /**
   * Get an optional node type for side branches.
   * Respects allowed types and Stage 1 elite exclusion.
   */
  private getOptionalNodeType(config: StageMapStructure, stageNumber: number): MapNodeDefinition['roomType'] {
    const allowed = config.allowedOptionalNodeTypes;
    // Filter out elite for Stage 1
    const filtered = stageNumber === 1
      ? allowed.filter(t => t !== 'elite')
      : allowed;

    // Map content type names to room types
    const typeMap: Record<string, MapNodeDefinition['roomType']> = {
      normal: 'fight',
      event: 'event',
      shop: 'shop',
      rest: 'rest',
      treasure: 'treasure',
      elite: 'elite',
      mini_boss: 'mini_boss',
      royal_guard: 'royal_guard'
    };

    const validTypes = filtered.map(t => typeMap[t] ?? 'fight').filter(t => t !== 'fight' || stageNumber > 1);
    if (validTypes.length === 0) return 'fight';

    return choice(validTypes);
  }

  private createNode(id: string, roomType: MapNodeDefinition['roomType'], x: number, y: number): MapNodeDefinition {
    const label = NODE_LABELS[roomType] ?? NODE_LABELS.fight;
    return {
      id,
      label: label.label,
      icon: label.icon,
      roomType,
      x,
      y,
      connections: [],
      completed: false
    };
  }

  // Legacy method kept for backward compatibility but no longer used by generateStageMap
  // Note: StageMapConfig is legacy type alias - removed decorator to fix TS error
  private weightedRoomType(_config: any): MapNodeDefinition['roomType'] {
    // Legacy implementation - not used in new GDD-aligned map generation
    return 'fight';
  }
}
