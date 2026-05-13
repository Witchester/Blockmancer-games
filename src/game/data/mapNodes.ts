import type { MapNodeDefinition } from '../types/GameTypes';

export const MAP_NODES: MapNodeDefinition[] = [
  {
    id: 'start',
    label: 'Start',
    icon: 'S',
    roomType: 'start',
    x: 0.5,
    y: 0.88,
    connections: ['fight-a', 'event-a', 'fight-b'],
    completed: false
  },
  {
    id: 'fight-a',
    label: 'Fight',
    icon: 'F',
    roomType: 'fight',
    x: 0.22,
    y: 0.7,
    connections: ['shop'],
    completed: false
  },
  {
    id: 'event-a',
    label: 'Event',
    icon: '?',
    roomType: 'event',
    x: 0.5,
    y: 0.7,
    connections: ['elite'],
    completed: false
  },
  {
    id: 'fight-b',
    label: 'Fight',
    icon: 'F',
    roomType: 'fight',
    x: 0.78,
    y: 0.7,
    connections: ['event-b'],
    completed: false
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: '$',
    roomType: 'shop',
    x: 0.22,
    y: 0.52,
    connections: ['rest'],
    completed: false
  },
  {
    id: 'elite',
    label: 'Elite',
    icon: 'E',
    roomType: 'elite',
    x: 0.5,
    y: 0.52,
    connections: ['rest'],
    completed: false
  },
  {
    id: 'event-b',
    label: 'Event',
    icon: '?',
    roomType: 'event',
    x: 0.78,
    y: 0.52,
    connections: ['rest'],
    completed: false
  },
  {
    id: 'rest',
    label: 'Rest',
    icon: 'R',
    roomType: 'rest',
    x: 0.5,
    y: 0.34,
    connections: ['fight-c', 'treasure'],
    completed: false
  },
  {
    id: 'fight-c',
    label: 'Fight',
    icon: 'F',
    roomType: 'fight',
    x: 0.34,
    y: 0.16,
    connections: ['boss'],
    completed: false
  },
  {
    id: 'treasure',
    label: 'Treasure',
    icon: 'T',
    roomType: 'treasure',
    x: 0.66,
    y: 0.16,
    connections: ['boss'],
    completed: false
  },
  {
    id: 'boss',
    label: 'Boss',
    icon: 'B',
    roomType: 'boss',
    x: 0.5,
    y: 0.04,
    connections: [],
    completed: false
  }
];
