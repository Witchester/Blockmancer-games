import type { PlayerState, TetrominoType } from '../types/GameTypes';
import { BOARD_BLOCK_ICON_SIZE, BOARD_CELL_SIZE } from '../data/renderSizes';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const BLOCK_ANIM = {
  BOARD_BLOCK_SIZE: BOARD_CELL_SIZE,
  BOARD_ICON_SIZE: BOARD_BLOCK_ICON_SIZE,

  GLOW_FRAME_COUNT: 3,
  GLOW_FRAME_MS: 50,
  GLOW_TOTAL_MS: 150,

  CLEAR_FRAME_COUNT: 5,
  CLEAR_FRAME_MS: 40,
  CLEAR_TOTAL_MS: 200
} as const;

export const CELL_SIZE = BOARD_CELL_SIZE;
export const BOARD_OFFSET_X = 36;
export const BOARD_OFFSET_Y = 118;
export const MAX_EVENT_LOG = 8;
export const BASE_DROP_MS = 940;
export const MAX_FALL_SPEED = 1.85;
export const POST_BATTLE_FALL_SPEED_STEP = 0.035;
export const LINE_CLEAR_BONUS: Record<number, number> = {
  1: 0,
  2: 9,
  3: 21,
  4: 40
};

export const MANA_GAIN: Record<number, number> = {
  1: 12,
  2: 28,
  3: 50,
  4: 76
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
    shield: 0,
    maxMana: 100,
    mana: 0,
    fever: 0,
    feverActiveLocks: 0,
    gold: 50,
    totalGoldCollected: 50,
    baseLineDamage: 5,
    lineDamageBonus: 0,
    spellCostReduction: 0,
    spellBonuses: {
      fireball: 0,
      'frost-lock': 0,
      'bomb-rune': 0,
      'void-cut': 0,
      'clean-cut': 0,
      'sprinkle-shower': 0,
      'cupcake-blast': 0,
      'confetti-pop': 0,
      'bubble-shield': 0,
      'star-spark': 0,
      'jelly-bounce': 0,
      'snowcone-burst': 0,
      'goblin-gadget': 0,
      'rainbow-reroll': 0,
      'snack-break': 0,
      'cascade-cheer': 0
    },
    comboHeart: false,
    extraPreview: false,
    stonebreaker: false,
    emergencyBarrier: false,
    emergencyBarrierUsed: false,
    frostLockDelayBonus: false,
    voidCutRefund: false,
    oopsies: [],
    curses: 0,
    inventoryCapacity: 10
  };
}
