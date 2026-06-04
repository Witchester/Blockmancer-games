import type {
  BoardState,
  CurrentRoomProgress,
  HeroState,
  RunStatus,
  SpellId,
  WeaponState
} from '../types/GameTypes';
import { BOARD_COLS, BOARD_ROWS } from '../utils/constants';

export const DEFAULT_HERO_ID = 'hero_blockmancer';
export const DEFAULT_WEAPON_ID = 'wpn_basic_wand';
export const DEFAULT_SPELL_IDS: SpellId[] = [
  'fireball',
  'frost-lock',
  'bomb-rune',
  'clean-cut',
  'sprinkle-shower',
  'cupcake-blast',
  'confetti-pop',
  'bubble-shield',
  'star-spark',
  'jelly-bounce',
  'snowcone-burst',
  'goblin-gadget',
  'rainbow-reroll',
  'snack-break',
  'cascade-cheer'
];
export const DEFAULT_STAGE = 1;
export const DEFAULT_FALL_SPEED = 1.0;
export const DEFAULT_GOLD = 50;
export const DEFAULT_RUN_STATUS: RunStatus = 'menu';
export const DEFAULT_EVENT_LOG = ['The dungeon stirs beneath your feet.'];
export const SAVE_VERSION = 11;

export const TOTAL_UPGRADE_SLOTS = 5;
export const MAX_HERO_UPGRADE_SLOTS = 2;
export const MAX_BOARD_UPGRADE_SLOTS = 2;
export const MAX_FEVER_UPGRADE_SLOTS = 2;

export function createDefaultHeroState(): HeroState {
  return {
    id: DEFAULT_HERO_ID,
    name: 'Blockmancer',
    className: 'Blockmancer',
    passiveId: 'passive_none',
    unlocked: true
  };
}

export function createDefaultWeaponState(): WeaponState {
  return {
    id: DEFAULT_WEAPON_ID,
    name: 'Basic Wand',
    weaponType: 'wand'
  };
}

export function createDefaultBoardState(): BoardState {
  return {
    columns: BOARD_COLS,
    rows: BOARD_ROWS,
    activePieceType: null,
    nextPieceType: null,
    nextQueue: [],
    holdPieceType: null,
    topOut: false,
    grid: Array.from({ length: BOARD_ROWS }, () => Array.from({ length: BOARD_COLS }, () => 0)),
    currentPiece: null,
    holdUsedThisPiece: false
  };
}

export const DEFAULT_ROOM_PROGRESS: CurrentRoomProgress = 'idle';
