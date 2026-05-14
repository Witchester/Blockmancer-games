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
  CurrentRoomProgress,
  EnemyInstance,
  HeroState,
  RewardDefinition,
  RewardId,
  RunState,
  SpellId,
  StatusEffectState,
  WeaponState,
  InventoryStack
} from '../types/GameTypes';
import { createDefaultPlayerState } from '../utils/constants';

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

function cloneMap() {
  return MAP_NODES.map((node) => ({ ...node }));
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
    behaviorIndex: enemy.behaviorIndex ?? 0
  };
}

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
    gold: DEFAULT_GOLD,
    enemiesDefeated: 0,
    runStatus: DEFAULT_RUN_STATUS,
    map: cloneMap(),
    eventLog: [...DEFAULT_EVENT_LOG],
    pendingRewards: [],
    ownedRewards: [],
    lastBattleWasBoss: false,
    victory: false,
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
      ...(raw.board ?? {})
    },
    spells: raw.spells ? [...raw.spells] : [...defaults.spells],
    relics: raw.relics ? [...raw.relics] : [...defaults.relics],
    upgrades: raw.upgrades ? [...raw.upgrades] : [...defaults.upgrades],
    statusEffects: raw.statusEffects ? [...raw.statusEffects] : [...defaults.statusEffects],
    inventory: raw.inventory ? raw.inventory.map(i => ({ ...i })) : [...defaults.inventory],
    map: raw.map ? raw.map.map((node) => ({ ...node })) : defaults.map,
    eventLog: raw.eventLog ? [...raw.eventLog] : [...defaults.eventLog],
    pendingRewards: raw.pendingRewards ? [...raw.pendingRewards] : [...defaults.pendingRewards],
    ownedRewards: raw.ownedRewards ? [...raw.ownedRewards] : [...defaults.ownedRewards]
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
  merged.currentEventId = typeof raw.currentEventId === 'string' ? raw.currentEventId : null;

  return merged;
}
