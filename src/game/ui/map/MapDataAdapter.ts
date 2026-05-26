import type { MapNodeDefinition, RunState } from '../../types/GameTypes';

export type MapNodeViewModel = {
  id: string;
  label: string;
  roomType: MapNodeDefinition['roomType'];
  state: 'current' | 'completed' | 'available' | 'locked';
  iconAssetKey: string;
  pathAssetKey: string;
};

export function getMapNodeAssetKey(roomType: MapNodeDefinition['roomType'], state: MapNodeViewModel['state']): string {
  if (state === 'current') return 'ico_node_current';
  if (state === 'completed') return 'ico_node_completed';
  const normalized = roomType === 'fight' ? 'normal' : roomType;
  return `ico_node_${normalized}`;
}

export function getMapPathAssetKey(state: MapNodeViewModel['state']): string {
  return state === 'locked' ? 'ui_map_path_locked' : 'ui_map_path_unlocked';
}

export function buildMapNodeViewModels(
  state: RunState,
  availableNodes: MapNodeDefinition[]
): MapNodeViewModel[] {
  const availableIds = new Set(availableNodes.map((node) => node.id));
  return state.map.map((node) => {
    const nodeState: MapNodeViewModel['state'] = state.currentNodeId === node.id
      ? 'current'
      : node.completed
        ? 'completed'
        : availableIds.has(node.id)
          ? 'available'
          : 'locked';
    return {
      id: node.id,
      label: node.label,
      roomType: node.roomType,
      state: nodeState,
      iconAssetKey: getMapNodeAssetKey(node.roomType, nodeState),
      pathAssetKey: getMapPathAssetKey(nodeState)
    };
  });
}
