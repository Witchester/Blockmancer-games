import type { MapNodeDefinition } from '../types/GameTypes';

export const MAP_NODES: MapNodeDefinition[] = [
  {
    id: 'start',
    label: 'Start',
    icon: 'S',
    roomType: 'start',
    x: 0.5,
    y: 0.94,
    connections: ['main-1-1', 'side-1-1'],
    completed: false
  },
  {
    id: 'main-1-1',
    label: 'Fight',
    icon: 'F',
    roomType: 'fight',
    x: 0.42,
    y: 0.84,
    connections: ['main-1-2', 'side-1-2'],
    completed: false
  },
  {
    id: 'main-1-2',
    label: 'Fight',
    icon: 'F',
    roomType: 'fight',
    x: 0.58,
    y: 0.69,
    connections: ['main-1-3'],
    completed: false
  },
  {
    id: 'main-1-3',
    label: 'Fight',
    icon: 'F',
    roomType: 'fight',
    x: 0.42,
    y: 0.54,
    connections: ['main-1-4', 'side-1-3'],
    completed: false
  },
  {
    id: 'main-1-4',
    label: 'Event',
    icon: '?',
    roomType: 'event',
    x: 0.58,
    y: 0.39,
    connections: ['main-1-5'],
    completed: false
  },
  {
    id: 'main-1-5',
    label: 'Treasure',
    icon: 'T',
    roomType: 'treasure',
    x: 0.42,
    y: 0.23,
    connections: ['boss'],
    completed: false
  },
  {
    id: 'boss',
    label: 'Boss',
    icon: 'B',
    roomType: 'boss',
    x: 0.5,
    y: 0.06,
    connections: [],
    completed: false
  },
  {
    id: 'side-1-1',
    label: 'Rest',
    icon: 'R',
    roomType: 'rest',
    x: 0.2,
    y: 0.76,
    connections: ['main-1-2'],
    completed: false
  },
  {
    id: 'side-1-2',
    label: 'Event',
    icon: '?',
    roomType: 'event',
    x: 0.82,
    y: 0.61,
    connections: ['main-1-3'],
    completed: false
  },
  {
    id: 'side-1-3',
    label: 'Treasure',
    icon: 'T',
    roomType: 'treasure',
    x: 0.2,
    y: 0.36,
    connections: ['main-1-5'],
    completed: false
  }
];
