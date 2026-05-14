import { MAP_NODES } from '../data/mapNodes';
import type { EventCard, MapNodeDefinition, RunState } from '../types/GameTypes';
import { choice } from '../utils/random';
import type { StageSystem } from './StageSystem';

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
  createMap(): MapNodeDefinition[] {
    return MAP_NODES.map((node) => ({ ...node }));
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
    state.map = this.createMap();
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
}
