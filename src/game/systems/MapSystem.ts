import { MAP_NODES } from '../data/mapNodes';
import type { EventCard, MapNodeDefinition, RunState } from '../types/GameTypes';
import { choice, randInt } from '../utils/random';
import type { StageSystem } from './StageSystem';

type StageMapConfig = {
  mainPath: number;
  totalNodes: [number, number];
  required: Array<MapNodeDefinition['roomType']>;
  weights: Partial<Record<MapNodeDefinition['roomType'], number>>;
};

const STAGE_NODE_CONFIG: Record<number, StageMapConfig> = {
  1: {
    mainPath: 6,
    totalNodes: [9, 11],
    required: ['fight', 'fight', 'fight', 'event', 'treasure', 'boss'],
    weights: { fight: 55, event: 20, shop: 5, rest: 10, treasure: 10 }
  },
  2: {
    mainPath: 8,
    totalNodes: [12, 14],
    required: ['fight', 'fight', 'fight', 'fight', 'event', 'shop', 'elite', 'boss'],
    weights: { fight: 50, event: 18, elite: 8, shop: 8, rest: 8, treasure: 8 }
  },
  3: {
    mainPath: 10,
    totalNodes: [15, 17],
    required: ['fight', 'fight', 'fight', 'fight', 'fight', 'event', 'rest', 'treasure', 'elite', 'boss'],
    weights: { fight: 48, event: 18, elite: 10, shop: 7, rest: 9, treasure: 8 }
  },
  4: {
    mainPath: 12,
    totalNodes: [18, 21],
    required: ['fight', 'fight', 'fight', 'fight', 'fight', 'fight', 'event', 'event', 'shop', 'rest', 'elite', 'boss'],
    weights: { fight: 45, event: 18, elite: 12, shop: 8, rest: 9, treasure: 8 }
  },
  5: {
    mainPath: 14,
    totalNodes: [22, 25],
    required: ['fight', 'fight', 'fight', 'fight', 'fight', 'fight', 'fight', 'event', 'event', 'shop', 'treasure', 'elite', 'elite', 'boss'],
    weights: { fight: 42, event: 18, elite: 15, shop: 8, rest: 7, treasure: 10 }
  },
  6: {
    mainPath: 16,
    totalNodes: [26, 30],
    required: ['fight', 'fight', 'fight', 'fight', 'fight', 'fight', 'fight', 'fight', 'event', 'event', 'shop', 'rest', 'elite', 'elite', 'elite', 'boss'],
    weights: { fight: 40, event: 16, elite: 16, shop: 8, rest: 8, treasure: 8 }
  }
};

const NODE_LABELS: Record<MapNodeDefinition['roomType'], { label: string; icon: string }> = {
  start: { label: 'Start', icon: 'S' },
  fight: { label: 'Fight', icon: 'F' },
  event: { label: 'Event', icon: '?' },
  shop: { label: 'Shop', icon: '$' },
  elite: { label: 'Elite', icon: 'E' },
  rest: { label: 'Rest', icon: 'R' },
  treasure: { label: 'Treasure', icon: 'T' },
  boss: { label: 'Boss', icon: 'B' }
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

  private generateStageMap(stage: number, config: StageMapConfig): MapNodeDefinition[] {
    const nodes: MapNodeDefinition[] = [];
    const totalNodes = randInt(config.totalNodes[0], config.totalNodes[1]);
    const mainTypes = [...config.required];
    mainTypes[mainTypes.length - 1] = 'boss';
    nodes.push(this.createNode('start', 'start', 0.5, 0.94));

    let previousId = 'start';
    for (let index = 0; index < config.mainPath; index += 1) {
      const roomType = mainTypes[index] ?? (index === config.mainPath - 1 ? 'boss' : 'fight');
      const id = roomType === 'boss' ? 'boss' : `main-${stage}-${index + 1}`;
      const x = index % 2 === 0 ? 0.42 : 0.58;
      const y = 0.84 - (index * 0.76) / Math.max(1, config.mainPath - 1);
      const node = this.createNode(id, roomType, x, y);
      nodes.push(node);
      this.getNode(nodes, previousId)?.connections.push(id);
      previousId = id;
    }

    const branchCount = Math.max(0, totalNodes - nodes.length);
    for (let index = 0; index < branchCount; index += 1) {
      const attachIndex = Math.min(config.mainPath - 2, 1 + (index % Math.max(1, config.mainPath - 2)));
      const attach = nodes[attachIndex];
      const rejoin = nodes[Math.min(nodes.length - 1, attachIndex + 2)];
      const side = index % 2 === 0 ? -1 : 1;
      const roomType = this.weightedRoomType(config);
      const id = `side-${stage}-${index + 1}`;
      const node = this.createNode(id, roomType, Math.max(0.12, Math.min(0.88, attach.x + side * 0.24)), Math.max(0.06, attach.y - 0.08));
      node.connections.push(rejoin.id);
      attach.connections.push(id);
      nodes.push(node);
    }

    return nodes;
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

  private weightedRoomType(config: StageMapConfig): MapNodeDefinition['roomType'] {
    const entries = Object.entries(config.weights) as Array<[MapNodeDefinition['roomType'], number]>;
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [roomType, weight] of entries) {
      roll -= weight;
      if (roll <= 0) {
        return roomType;
      }
    }
    return 'fight';
  }
}
