import type { PlayerState, TetrominoType } from '../types/GameTypes';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const CELL_SIZE = 24;
export const BOARD_OFFSET_X = 36;
export const BOARD_OFFSET_Y = 118;
export const MAX_EVENT_LOG = 8;
export const BASE_DROP_MS = 900;
export const MAX_FALL_SPEED = 2.0;
export const LINE_CLEAR_BONUS: Record<number, number> = {
  1: 0,
  2: 8,
  3: 18,
  4: 35
};

export const MANA_GAIN: Record<number, number> = {
  1: 10,
  2: 25,
  3: 45,
  4: 70
};

export const CASCADE_MANA_BONUS_MULTIPLIER = 0.5;

export const FONT_FAMILY = [
  '"VT323"',
  '"CaskaydiaCove Nerd Font Mono"',
  '"Cascadia Code"',
  '"Cascadia Mono"',
  '"JetBrains Mono"',
  '"Fira Code"',
  '"Courier New"',
  'monospace'
].join(', ');

export const COLORS = {
  background: 0x090b13,
  panel: 0x12172b,
  panelAlt: 0x171d34,
  accent: 0x5e75ff,
  accentSoft: 0x7b46ff,
  text: 0xf6f7ff,
  gold: 0xffca6b,
  danger: 0xff6673,
  success: 0x65d6a5,
  boardEmpty: 0x1b2038,
  boardGrid: 0x262d4f,
  boardGhost: 0xcad3ff,
  shadow: 0x05060a
} as const;

export const TETROMINO_COLORS: Record<TetrominoType, number> = {
  I: 0x56d3ff,
  O: 0xffd166,
  T: 0xc682ff,
  S: 0x5fe097,
  Z: 0xff7c7c,
  J: 0x5c7cff,
  L: 0xffa85e
};

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

export function createDefaultPlayerState(): PlayerState {
  return {
    maxHp: 30,
    hp: 30,
    maxMana: 100,
    mana: 0,
    gold: 50,
    totalGoldCollected: 50,
    baseLineDamage: 5,
    lineDamageBonus: 0,
    spellCostReduction: 0,
    spellBonuses: {
      fireball: 0,
      'frost-lock': 0,
      'bomb-rune': 0,
      'void-cut': 0
    },
    comboHeart: false,
    extraPreview: false,
    stonebreaker: false,
    emergencyBarrier: false,
    emergencyBarrierUsed: false,
    frostLockDelayBonus: false,
    voidCutRefund: false,
    curses: 0
  };
}
