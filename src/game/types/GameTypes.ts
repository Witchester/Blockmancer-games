export type RoomType = 'start' | 'fight' | 'event' | 'shop' | 'elite' | 'rest' | 'treasure' | 'boss';
export type EncounterNodeType = 'normal' | 'hard_normal' | 'elite' | 'boss' | 'event' | 'shop' | 'rest' | 'treasure';
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type SpellId = 'fireball' | 'frost-lock' | 'bomb-rune' | 'void-cut';
export type RunStatus = 'menu' | 'map' | 'battle' | 'reward' | 'game-over' | 'victory';
export type RewardId = string;
export type EnemyId = string;
export type EventId = 'shrine-of-gravity' | 'broken-anvil' | 'strange-mirror' | 'lost-knight';
export type MapNodeStatus = 'locked' | 'available' | 'completed' | 'current';
export type StatusEffectDurationType = 'turns' | 'piece_locks' | 'seconds' | 'battle' | 'permanent';
export type CounterTag =
  | 'counter_junk'
  | 'counter_sticky'
  | 'counter_float'
  | 'counter_freeze'
  | 'counter_preview'
  | 'counter_speed'
  | 'counter_sleep'
  | 'counter_incoming_junk'
  | 'counter_low_ceiling'
  | 'counter_royal'
  | 'counter_pattern'
  | 'counter_board_size'
  | 'counter_piece_queue';
export type ItemCategory =
  | 'heal'
  | 'mana'
  | 'board_cleanse'
  | 'hazard_counter'
  | 'spell_catalyst'
  | 'queue_control'
  | 'enemy_pressure'
  | 'emergency'
  | 'risk_reward';
export type ItemTiming =
  | 'instant'
  | 'before_spell'
  | 'after_hazard'
  | 'during_enemy_warning'
  | 'before_piece_lock'
  | 'map_only'
  | 'shop_only';
export type HazardSeverity = 'minor' | 'moderate' | 'major' | 'boss';
export type ActiveHazardKind =
  | 'incoming_junk'
  | 'floating_block'
  | 'freeze'
  | 'preview'
  | 'low_ceiling'
  | 'bad_piece'
  | 'speed_wave'
  | 'royal_pattern';

export interface PlayerState {
  maxHp: number;
  hp: number;
  shield: number;
  maxMana: number;
  mana: number;
  fever: number;
  feverActiveLocks: number;
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
  oopsies: string[];
  /** @deprecated migrated to named oopsies */
  curses: number;
  inventoryCapacity: number;
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
  armor?: number;
  attackIntervalLocks: number;
  intent: string;
  behavior: string;
  behaviors?: string[];
  roomType: 'fight' | 'elite' | 'boss';
}

export interface EnemyInstance {
  id: EnemyId;
  name: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  armor: number;
  shield: number;
  intent: string;
  behavior: string;
  behaviors: string[];
  roomType: 'fight' | 'elite' | 'boss';
  attackIntervalLocks: number;
  attackCounter: number;
  previewHiddenTurns: number;
  holdHiddenTurns: number;
  manaHexTurns: number;
  frozenTurns: number;
  sleepTurns: number;
  reverseControlsTurns: number;
  lineDamageBlockedTurns: number;
  behaviorIndex: number;
  phase: number;
  phase2Triggered: boolean;
}

export interface BoardState {
  columns: number;
  rows: number;
  activePieceType: TetrominoType | null;
  nextPieceType: TetrominoType | null;
  holdPieceType: TetrominoType | null;
  topOut: boolean;
  grid: BoardCell[][];
  currentPiece: PieceState | null;
  holdUsedThisPiece: boolean;
}

export type GameplayEffect = {
  type: string;
  value?: number;
  blockId?: string;
  text?: string;
  targetId?: string;
  duration?: number;
};

export type RewardModifier = {
  goldMultiplier?: number;
  extraRewardChoices?: number;
  shopPriceMultiplier?: number;
};

export type StageGoalProgress = {
  goalId: string;
  progress: number;
  requiredAmount: number;
  completed: boolean;
  failed: boolean;
};

export type BoardSizeModifier = {
  id: string;
  encounterType: EncounterNodeType;
  widthDelta?: number;
  heightDelta?: number;
  lockedRows?: number;
  duration: 'room' | 'phase' | 'turns' | 'pieces';
  durationValue?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  reasonText: string;
};

export interface HazardCounterWindow {
  hazardId: string;
  name: string;
  warningText: string;
  counterTags: CounterTag[];
  counterWindowPieces: number;
  severity: HazardSeverity;
  defaultFailureEffect: string;
  itemCounterHints: string[];
  spellCounterHints: string[];
  cascadeCounterHint?: string;
}

export interface ActiveHazardState extends HazardCounterWindow {
  instanceId: string;
  kind: ActiveHazardKind;
  remainingPieces: number;
  amount?: number;
  sourceId?: string;
  blockId?: string;
  onExpireBlockId?: string;
  column?: number;
  row?: number;
}

export interface SpellCatalystModifier {
  id: string;
  sourceItemId: string;
  remainingCasts: number;
  costMultiplier?: number;
  extraBlockId?: string;
  cleanupTags?: CounterTag[];
  bombRadiusBonus?: number;
  feverMultiplier?: number;
}

export interface ReactiveBattleState {
  nextSpellModifiers: SpellCatalystModifier[];
  previewRevealPieces: number;
  speedBrakePieces: number;
  freezeGuardPieces: number;
  anchorCookiePieces: number;
  lowCeilingCanceled: boolean;
  safetyNetArmed: boolean;
}

export interface ReactiveItemContent {
  id: string;
  name: string;
  description: string;
  effect?: {
    type?: string;
    [key: string]: unknown;
  };
  itemCategory?: ItemCategory;
  counterTags?: CounterTag[];
  timing?: ItemTiming;
  rarity?: string;
  maxStack?: number;
  spellSynergyTags?: string[];
  effectConfig?: Record<string, unknown>;
  iconKey?: string;
  enabled?: boolean;
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
  rarity?: string;
  amount?: number;
  contentType?: string;
  source?: string;
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

export type BoardBlockClearEffect = {
  type: string;
  value?: number;
};

export type BoardBlockCell = {
  color: number;
  blockId: string;
  blockType: 'normal' | 'special' | 'heavy' | 'hazard';
  clearEffects: BoardBlockClearEffect[];
};

export type BoardCell = number | BoardBlockCell;

export interface CascadeResult {
  totalLinesCleared: number;
  cascadeCount: number;
  clearedLinesPerCascade: number[];
  blocksDropped: number;
  specialBlocksTriggered: string[];
  causedCombo: boolean;
  animationFrames?: CascadeAnimationFrame[];
}

export interface CascadeAnimationFrame {
  type: 'clear' | 'gravity';
  grid: BoardCell[][];
  clearedLines: number;
  droppedRows: number;
}

export interface BoardTickResult {
  moved: boolean;
  locked: boolean;
  clearedLines: number;
  cascadeResult?: CascadeResult;
  toppedOut: boolean;
}

export type InventoryStack = {
  itemId: string;
  count: number;
};

export type CurrentRoomProgress = 'idle' | 'entered' | 'cleared' | 'reward' | 'complete';

export interface RunStats {
  piecesLocked: number;
  linesCleared: number;
  cascadesTriggered: number;
  maxCascade: number;
  damageDealt: number;
  damageTaken: number;
  spellsCast: number;
  itemsUsed: number;
  roomsCleared: number;
  bossesDefeated: string[];
}

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
  inventory: InventoryStack[];
  currentNodeId: string;
  currentRoomType: RoomType;
  currentRoomProgress: CurrentRoomProgress;
  currentEventId: EventId | null;
  stage: number;
  fallSpeed: number;
  combo: number;
  lastCascadeLevel: number;
  lastCascadeLines: number;
  gold: number;
  enemiesDefeated: number;
  runStatus: RunStatus;
  map: MapNodeDefinition[];
  eventLog: string[];
  pendingRewards: RewardDefinition[];
  pendingRewardSource: string;
  rewardRerolls: number;
  ownedRewards: RewardId[];
  stageGoals: Record<string, StageGoalProgress>;
  activeChaosRule?: string;
  activeBattleObjective?: string;
  completedBattleObjectives: string[];
  activeRandomGameplayEvents: string[];
  activeHazards: ActiveHazardState[];
  reactiveState: ReactiveBattleState;
  activeOopsies: string[];
  currentBossRule?: string;
  boardSizeModifier?: BoardSizeModifier;
  festivalHubVisited: boolean;
  lastBattleWasBoss: boolean;
  pendingStageAdvance: boolean;
  victory: boolean;
  runStats: RunStats;
  saveVersion: number;
}
