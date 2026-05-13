export type RoomType = 'start' | 'fight' | 'event' | 'shop' | 'elite' | 'rest' | 'treasure' | 'boss';
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type SpellId = 'fireball' | 'frost-lock' | 'bomb-rune' | 'void-cut';
export type RunStatus = 'menu' | 'map' | 'battle' | 'reward' | 'game-over' | 'victory';
export type RewardId =
  | 'sharp-edges'
  | 'mana-echo'
  | 'goblin-coin'
  | 'broken-hourglass'
  | 'slime-core'
  | 'stable-hands'
  | 'fire-mastery'
  | 'bomb-expert'
  | 'combo-heart'
  | 'arcane-preview'
  | 'stonebreaker'
  | 'emergency-barrier'
  | 'gold-cache'
  | 'healing-glyph';
export type EnemyId =
  | 'slime'
  | 'goblin'
  | 'stone-golem'
  | 'bat'
  | 'witch'
  | 'elite-knight'
  | 'falling-king';
export type EventId = 'shrine-of-gravity' | 'broken-anvil' | 'strange-mirror' | 'lost-knight';
export type MapNodeStatus = 'locked' | 'available' | 'completed' | 'current';
export type StatusEffectDurationType = 'turns' | 'piece_locks' | 'seconds' | 'battle' | 'permanent';

export interface PlayerState {
  maxHp: number;
  hp: number;
  maxMana: number;
  mana: number;
  gold: number;
  totalGoldCollected: number;
  baseLineDamage: number;
  lineDamageBonus: number;
  spellCostReduction: number;
  spellBonuses: Record<SpellId, number>;
  comboHeart: boolean;
  extraPreview: boolean;
  stonebreaker: boolean;
  emergencyBarrier: boolean;
  emergencyBarrierUsed: boolean;
  frostLockDelayBonus: boolean;
  voidCutRefund: boolean;
  curses: number;
}

export interface HeroState {
  id: string;
  name: string;
  className: string;
  passiveId: string;
  unlocked: boolean;
}

export interface WeaponState {
  id: string;
  name: string;
  weaponType: string;
}

export interface EnemyDefinition {
  id: EnemyId;
  name: string;
  baseHp: number;
  baseAttack: number;
  attackIntervalLocks: number;
  intent: string;
  behavior: string;
  roomType: 'fight' | 'elite' | 'boss';
}

export interface EnemyInstance {
  id: EnemyId;
  name: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  intent: string;
  behavior: string;
  roomType: 'fight' | 'elite' | 'boss';
  attackIntervalLocks: number;
  attackCounter: number;
  previewHiddenTurns: number;
  manaHexTurns: number;
}

export interface BoardState {
  columns: number;
  rows: number;
  activePieceType: TetrominoType | null;
  nextPieceType: TetrominoType | null;
  topOut: boolean;
}

export interface SpellDefinition {
  id: SpellId;
  label: string;
  key: string;
  cost: number;
  damage: number;
  description: string;
}

export interface RewardDefinition {
  id: RewardId;
  name: string;
  type: string;
  description: string;
  persistent: boolean;
}

export interface MapNodeDefinition {
  id: string;
  label: string;
  icon: string;
  roomType: RoomType;
  x: number;
  y: number;
  connections: string[];
  completed: boolean;
}

export interface EventChoice {
  label: string;
  description: string;
  outcomeKey: string;
}

export interface EventCard {
  id: EventId;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface StatusEffectState {
  id: string;
  stacks: number;
  duration: number;
  durationType: StatusEffectDurationType;
  source: 'player' | 'enemy' | 'board';
}

export interface PieceState {
  type: TetrominoType;
  matrix: number[][];
  color: number;
  x: number;
  y: number;
}

export interface CascadeResult {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  causedCombo: boolean;
}

export interface BoardTickResult {
  moved: boolean;
  locked: boolean;
  clearedLines: number;
  cascadeResult?: CascadeResult;
  toppedOut: boolean;
}

export type CurrentRoomProgress = 'idle' | 'entered' | 'cleared' | 'reward' | 'complete';

export interface RunState {
  player: PlayerState;
  hero: HeroState;
  weapon: WeaponState;
  board: BoardState;
  activeEnemy: EnemyInstance | null;
  spells: SpellId[];
  relics: RewardId[];
  upgrades: RewardId[];
  statusEffects: StatusEffectState[];
  currentNodeId: string;
  currentRoomType: RoomType;
  currentRoomProgress: CurrentRoomProgress;
  currentEventId: EventId | null;
  stage: number;
  fallSpeed: number;
  combo: number;
  gold: number;
  enemiesDefeated: number;
  runStatus: RunStatus;
  map: MapNodeDefinition[];
  eventLog: string[];
  pendingRewards: RewardDefinition[];
  ownedRewards: RewardId[];
  lastBattleWasBoss: boolean;
  victory: boolean;
  saveVersion: number;
}
