import { MAP_NODES } from './mapNodes';
import {
  createDefaultBoardState,
  createDefaultHeroState,
  createDefaultWeaponState,
  DEFAULT_EVENT_LOG,
  DEFAULT_FALL_SPEED,
  DEFAULT_GOLD,
  DEFAULT_ROOM_PROGRESS,
  DEFAULT_RUN_STATUS,
  DEFAULT_SPELL_IDS,
  DEFAULT_STAGE,
  SAVE_VERSION
} from './constants';
import type {
  BoardState,
  BoardCell,
  CurrentRoomProgress,
  EnemyInstance,
  HeroState,
  RewardDefinition,
  RewardId,
  RunStats,
  RunState,
  SpellId,
  StatusEffectState,
  WeaponState,
  InventoryStack
} from '../types/GameTypes';
import { createDefaultPlayerState } from '../utils/constants';
import { OopsieSystem } from '../systems/OopsieSystem';

type PartialRunState = Partial<Omit<RunState, 'player' | 'hero' | 'weapon' | 'board'>> & {
  player?: Partial<RunState['player']>;
  hero?: Partial<HeroState>;
  weapon?: Partial<WeaponState>;
  board?: Partial<BoardState>;
  spells?: SpellId[];
  relics?: RewardId[];
  upgrades?: RewardId[];
  statusEffects?: StatusEffectState[];
  inventory?: InventoryStack[];
  pendingRewards?: RewardDefinition[];
  activeEnemy?: EnemyInstance | null;
  /** @deprecated kept for backward save compatibility */
  currentEnemy?: EnemyInstance | null;
  /** @deprecated kept for backward save compatibility */
  currentRoom?: { nodeId?: string; roomType?: string; state?: string };
};

function createDefaultRunStats(): RunStats {
  return {
    piecesLocked: 0,
    linesCleared: 0,
    cascadesTriggered: 0,
    maxCascade: 0,
    damageDealt: 0,
    damageTaken: 0,
    spellsCast: 0,
    itemsUsed: 0,
    roomsCleared: 0,
    bossesDefeated: []
  };
}

function cloneMap() {
  return MAP_NODES.map((node) => ({ ...node }));
}

function cloneBoardCell(cell: unknown): BoardCell {
  if (typeof cell === 'number' && Number.isFinite(cell)) {
    return cell;
  }
  if (cell && typeof cell === 'object') {
    const raw = cell as Partial<Extract<BoardCell, object>>;
    return {
      color: typeof raw.color === 'number' ? raw.color : 0x888888,
      blockId: typeof raw.blockId === 'string' ? raw.blockId : 'block_unknown',
      blockType: raw.blockType ?? 'special',
      clearEffects: Array.isArray(raw.clearEffects) ? raw.clearEffects.map((effect) => ({ ...effect })) : []
    };
  }
  return 0;
}

function normalizeBoardGrid(input: unknown, defaults: BoardState): BoardCell[][] {
  if (!Array.isArray(input)) {
    return defaults.grid.map((row) => [...row]);
  }

  return defaults.grid.map((defaultRow, rowIndex) => {
    const rawRow = input[rowIndex];
    if (!Array.isArray(rawRow)) {
      return [...defaultRow];
    }
    return defaultRow.map((_, columnIndex) => cloneBoardCell(rawRow[columnIndex]));
  });
}

function normalizeEnemy(enemy: EnemyInstance | null | undefined): EnemyInstance | null {
  if (!enemy) {
    return null;
  }

  return {
    ...enemy,
    armor: enemy.armor ?? 0,
    shield: enemy.shield ?? 0,
    behaviors: enemy.behaviors?.length ? [...enemy.behaviors] : [enemy.behavior || 'basic_attack'],
    previewHiddenTurns: enemy.previewHiddenTurns ?? 0,
    holdHiddenTurns: enemy.holdHiddenTurns ?? 0,
    manaHexTurns: enemy.manaHexTurns ?? 0,
    frozenTurns: enemy.frozenTurns ?? 0,
    sleepTurns: enemy.sleepTurns ?? 0,
    reverseControlsTurns: enemy.reverseControlsTurns ?? 0,
    lineDamageBlockedTurns: enemy.lineDamageBlockedTurns ?? 0,
    behaviorIndex: enemy.behaviorIndex ?? 0,
    phase: enemy.phase ?? 1,
    phase2Triggered: enemy.phase2Triggered ?? false
  };
}

const oopsieSystem = new OopsieSystem();

export function createDefaultRunState(): RunState {
  const player = createDefaultPlayerState();
  return {
    player,
    hero: createDefaultHeroState(),
    weapon: createDefaultWeaponState(),
    board: createDefaultBoardState(),
    activeEnemy: null,
    spells: [...DEFAULT_SPELL_IDS],
    relics: [],
    upgrades: [],
    statusEffects: [],
    inventory: [],
    currentNodeId: 'start',
    currentRoomType: 'start',
    currentRoomProgress: DEFAULT_ROOM_PROGRESS,
    currentEventId: null,
    stage: DEFAULT_STAGE,
    fallSpeed: DEFAULT_FALL_SPEED,
    combo: 0,
    lastCascadeLevel: 0,
    lastCascadeLines: 0,
    gold: DEFAULT_GOLD,
    enemiesDefeated: 0,
    runStatus: DEFAULT_RUN_STATUS,
    map: cloneMap(),
    eventLog: [...DEFAULT_EVENT_LOG],
    pendingRewards: [],
    pendingRewardSource: 'battle',
    rewardRerolls: 0,
    ownedRewards: [],
    lastBattleWasBoss: false,
    pendingStageAdvance: false,
    victory: false,
    runStats: createDefaultRunStats(),
    saveVersion: SAVE_VERSION
  };
}

export function normalizeRunState(input: unknown): RunState {
  const defaults = createDefaultRunState();
  const raw = (input ?? {}) as PartialRunState;
  const player = {
    ...defaults.player,
    ...(raw.player ?? {})
  };
  if (!Array.isArray(player.oopsies)) {
    player.oopsies = [];
  }

  const merged: RunState = {
    ...defaults,
    ...raw,
    player,
    hero: {
      ...defaults.hero,
      ...(raw.hero ?? {})
    },
    weapon: {
      ...defaults.weapon,
      ...(raw.weapon ?? {})
    },
    board: {
      ...defaults.board,
      ...(raw.board ?? {}),
      grid: normalizeBoardGrid(raw.board?.grid, defaults.board),
      currentPiece: raw.board?.currentPiece && Array.isArray(raw.board.currentPiece.matrix) ? {
        ...raw.board.currentPiece,
        matrix: raw.board.currentPiece.matrix.map((row) => Array.isArray(row) ? [...row] : [])
      } : defaults.board.currentPiece,
      holdUsedThisPiece: Boolean(raw.board?.holdUsedThisPiece ?? defaults.board.holdUsedThisPiece)
    },
    spells: raw.spells ? [...raw.spells] : [...defaults.spells],
    relics: raw.relics ? [...raw.relics] : [...defaults.relics],
    upgrades: raw.upgrades ? [...raw.upgrades] : [...defaults.upgrades],
    statusEffects: raw.statusEffects ? [...raw.statusEffects] : [...defaults.statusEffects],
    inventory: raw.inventory ? raw.inventory.map(i => ({ ...i })) : [...defaults.inventory],
    map: raw.map ? raw.map.map((node) => ({ ...node })) : defaults.map,
    eventLog: raw.eventLog ? [...raw.eventLog] : [...defaults.eventLog],
    pendingRewards: raw.pendingRewards ? [...raw.pendingRewards] : [...defaults.pendingRewards],
    pendingRewardSource: raw.pendingRewardSource ?? defaults.pendingRewardSource,
    rewardRerolls: raw.rewardRerolls ?? defaults.rewardRerolls,
    ownedRewards: raw.ownedRewards ? [...raw.ownedRewards] : [...defaults.ownedRewards],
    runStats: {
      ...defaults.runStats,
      ...(raw.runStats ?? {}),
      bossesDefeated: raw.runStats?.bossesDefeated ? [...raw.runStats.bossesDefeated] : []
    }
  };

  // Backward compatibility: migrate old saves that used currentEnemy
  merged.activeEnemy = normalizeEnemy(raw.activeEnemy ?? raw.currentEnemy ?? defaults.activeEnemy);

  // Backward compatibility: migrate old saves that used currentRoom struct
  if (raw.currentRoom) {
    merged.currentNodeId = raw.currentNodeId ?? raw.currentRoom.nodeId ?? defaults.currentNodeId;
    merged.currentRoomType = (raw.currentRoomType ?? raw.currentRoom.roomType ?? defaults.currentRoomType) as RunState['currentRoomType'];
    merged.currentRoomProgress = (raw.currentRoomProgress ?? raw.currentRoom.state ?? defaults.currentRoomProgress) as CurrentRoomProgress;
  }

  merged.gold = player.gold;
  merged.lastCascadeLevel = Math.max(0, raw.lastCascadeLevel ?? defaults.lastCascadeLevel);
  merged.lastCascadeLines = Math.max(0, raw.lastCascadeLines ?? defaults.lastCascadeLines);
  merged.currentEventId = typeof raw.currentEventId === 'string' ? raw.currentEventId : null;
  merged.saveVersion = SAVE_VERSION;
  oopsieSystem.normalizeState(merged);

  return merged;
}
