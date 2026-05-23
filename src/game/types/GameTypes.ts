export type RoomType = 'start' | 'fight' | 'event' | 'shop' | 'elite' | 'rest' | 'treasure' | 'boss' | 'mini_boss' | 'royal_guard';
export type EncounterNodeType = 'normal' | 'hard_normal' | 'elite' | 'boss' | 'event' | 'event_battle' | 'shop' | 'rest' | 'treasure' | 'mini_boss' | 'royal_guard';
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type SpellId = string;
export type RunStatus = 'menu' | 'map' | 'battle' | 'reward' | 'game-over' | 'victory';
export type RouteChoiceLane = 'practical' | 'true' | 'risky';
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
  | 'sleep'
  | 'speed_wave'
  | 'royal_pattern';

// Sequential Encounter Pack types (Step 1-2 foundation)
export type MonsterRole = 'starter' | 'pressure' | 'support' | 'finisher';

export type MonsterRank = 'regular' | 'elite' | 'elite_miniboss' | 'boss';

export type WeightedMonsterRule = {
  monsterId: string;
  weight: number;
  roles: MonsterRole[];
  rank?: MonsterRank;
  minNodeDepthPercent?: number;
  maxNodeDepthPercent?: number;
  allowedNodeTypes?: EncounterNodeType[];
  bannedWithTags?: string[];
  tags?: string[];
};

export type BiomeMonsterPool = {
  id: string;
  stageId: string;
  biomeId: string;
  displayName: string;
  monsterRules: WeightedMonsterRule[];
  maxDuplicatePerNode: number;
  recentMonsterMemoryCount: number;
  bannedPairTags?: string[];
  fallbackMonsterId: string;
};

export type BreatherRewardPolicy = {
  enabled: boolean;
  maxHealPercentPerNode: number;
  allowedRewards: Array<'hp' | 'mana' | 'shield' | 'fever'>;
};

export type EncounterEnemyEntry = {
  enemyId: string;
  role: MonsterRole;
  rank: MonsterRank;
  hpMultiplier: number;
  attackMultiplier: number;
  armorMultiplier?: number;
  entryEffectId?: string;
  entryGracePieces: number;
  tags?: string[];
};

export type NodeEncounterPack = {
  encounterPackId: string;
  nodeId: string;
  stageId: string;
  biomeId: string;
  nodeType: EncounterNodeType;
  enemies: EncounterEnemyEntry[];
  currentEnemyIndex: number;
  totalHpBudgetMultiplier: number;
  totalAttackBudgetMultiplier: number;
  maxActiveHazards: number;
  rewardsGrantedOnlyOnNodeClear: true;
  xpGrantedOnlyOnNodeClear: true;
  defeatedEnemyIds: string[];
  defeatedEnemyIndexes: number[];
  remainingEnemyCount: number;
  appliedEntryEffectEnemyIndexes: number[];
  entryGiftClaimedEnemyIndexes: number[];
  encounterPackCompleted: boolean;
  nodeRewardsGranted: boolean;
  routeFallbackTriggeredForEncounterPack: boolean;
  entryEffectAppliedToIndex?: number;
  breatherRewardPolicy?: BreatherRewardPolicy;
  generatedFromPoolId?: string;
  seed?: string | number;
};

export type EncounterPackScalingRule = {
  id: string;
  stageNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stageId: string;
  nodeType: EncounterNodeType;
  minEnemies: number;
  maxEnemies: number;
  earlyNodeEnemyCap?: number;
  lateNodeEnemyCap?: number;
  totalHpBudgetMultiplierRange: [number, number];
  totalAttackBudgetMultiplierRange: [number, number];
  entryGracePieces: number;
  maxActiveHazards: number;
};

export type EnemyEntryEffectContent = {
  id: string;
  name: string;
  description: string;
  pressureEffectId?: string;
  playerGiftEffectId?: string;
  entryGracePieces: number;
  warningText: string;
  eventLogText: string;
  tags?: string[];
};

export type EncounterPackCompletionResult = {
  encounterPackId: string;
  nodeId: string;
  stageId: string;
  nodeType: string;
  defeatedEnemyIds: string[];
  totalEnemiesDefeated: number;
  isFullNodeClear: boolean;
};

export type NodeResultXpBreakdown = {
  enemyXp: number;
  eliteBonusXp: number;
  bossBonusXp: number;
  objectiveBonusXp: number;
  cascadeBonusXp: number;
  noDamageBonusXp: number;
  routeBonusXp: number;
};

export type NodeResultSummary = {
  resultId: string;
  nodeId: string;
  stageId: string;
  nodeType: string;
  encounterPackId?: string;
  enemiesDefeated: number;
  defeatedEnemyIds: string[];
  xpGainedTotal: number;
  xpBreakdown: NodeResultXpBreakdown;
  currentXpBeforeGain?: number;
  currentXpAfterGain?: number;
  xpToNextLevel?: number;
  xpRemainingToNextLevel?: number;
  leveledUp: boolean;
  pendingLevelUps: number;
  rewardsPending: boolean;
};

export type NodeResultClaimState = {
  nodeId: string;
  encounterPackId: string;
  resultId: string;
  resultShown: boolean;
  xpApplied: boolean;
  postNodeHealingApplied?: boolean;
};

export type PlayerLevelState = {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  pendingLevelUps: number;
  chosenUpgrades: Record<string, number>;
  rerollCharges: number;
};

export type LevelUpScreenState = {
  pendingLevelUpChoices: string[];
  offeredUpgradeIds: string[];
  chosenUpgradeIds: string[];
  rerollCharges: number;
  levelUpSelectionSeed: string;
  levelUpScreenResolved: boolean;
};

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
  level: number;
  experience: number;
  xpToNextLevel: number;
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
  nextQueue: TetrominoType[];
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

export type DialogueLine = {
  speakerId: string;
  text: string;
  expression?: string;
  voiceTag?: string;
};

export type RouteTriggerCondition = {
  type: 'first_eligible_event_node' | 'after_first_combat_victory' | 'before_boss';
  stageId: string;
  heroId: string;
  oncePerRun: true;
};

export type RouteRewardConfig = {
  rewardId: string;
  rewardType:
    | 'gold'
    | 'heal'
    | 'mana'
    | 'shield'
    | 'item'
    | 'relic'
    | 'upgrade'
    | 'stage_modifier'
    | 'boss_modifier'
    | 'hazard_modifier'
    | 'battle_modifier';
  amount?: number;
  itemId?: string;
  relicId?: string;
  upgradeId?: string;
  modifierId?: string;
  duration?: 'next_battle' | 'stage' | 'boss' | 'run';
};

export type RouteRiskConfig = {
  oopsieChance?: number;
  addHazardId?: string;
  increaseHazardSeverity?: HazardSeverity;
  bossModifierId?: string;
  rewardTier?: 'stage' | 'rare' | 'hero_themed';
  /** @deprecated route JSON used this before RouteRiskConfig was formalized. */
  hazardIncrease?: string;
};

export type RouteChoiceContent = {
  id: string;
  lane: RouteChoiceLane;
  label: string;
  playerLine: string;
  npcResponse: DialogueLine[];
  narration: string;
  gameplayResult: string;
  rewardConfig: RouteRewardConfig;
  statDelta: Record<string, number>;
  grantFlag?: string;
  riskConfig?: RouteRiskConfig;
};

export type RouteSceneContent = {
  id: string;
  heroId: string;
  stageId: string;
  triggerId: string;
  triggerCondition: RouteTriggerCondition;
  locationName: string;
  title: string;
  storyBeat: string;
  storyboardPanels: string[];
  preChoiceDialogue: DialogueLine[];
  choices: RouteChoiceContent[];
  postChoiceBarks: DialogueLine[];
  victoryCallback: DialogueLine[];
  bossCallback?: DialogueLine[];
  bossCallbackByLane?: Partial<Record<RouteChoiceLane, DialogueLine[]>>;
};

export type HeroRouteProgress = {
  heroId: string;
  practicalScore: number;
  trueScore: number;
  riskyScore: number;
  trueFlags: string[];
  chosenScenes: Record<string, RouteChoiceLane>;
  triggeredScenes: string[];
  unlockedEndingIds: string[];
  variantEndingIds: string[];
};

export type RouteProgressState = {
  activeHeroId: string;
  routeVersion: number;
  heroes: Record<string, HeroRouteProgress>;
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

export type IncomingJunkQueue = ActiveHazardState & {
  kind: 'incoming_junk';
  amount: number;
  originalAmount?: number;
  sourceId: string;
  delayPieces: number;
  remainingPieces: number;
  junkType: string;
};

export type IncomingJunkQueueEntry = {
  id: string;
  sourceId: string;
  sourceName?: string;
  amount: number;
  remainingAmount: number;
  delayPieces: number;
  junkBlockId: string;
  severity: HazardSeverity;
  createdAtPieceCount?: number;
  reason?: string;
};

export type FloatingState = {
  isFloating: boolean;
  countdownPieces: number;
  onExpireBlockId: string;
  sourceId?: string;
};

export type ActiveHazardCounterWindow = ActiveHazardState;

export interface SpellCatalystModifier {
  id: string;
  sourceItemId: string;
  spellFilter?: string | string[];
  effectType?: string;
  value?: number;
  consumed?: boolean;
  remainingCasts: number;
  costMultiplier?: number;
  extraBlockId?: string;
  cleanupTags?: CounterTag[];
  bombRadiusBonus?: number;
  feverMultiplier?: number;
}

export type NextSpellModifier = SpellCatalystModifier;

export type RouteRuntimeModifier = {
  id: string;
  sourceRewardId: string;
  modifierId: string;
  duration: 'next_battle' | 'stage' | 'boss' | 'run';
  stage?: number;
  amount?: number;
  consumed?: boolean;
};

export interface ReactiveBattleState {
  nextSpellModifiers: SpellCatalystModifier[];
  previewRevealPieces: number;
  speedBrakePieces: number;
  freezeGuardPieces: number;
  anchorCookiePieces: number;
  cleanupCouponPieces: number;
  nopeStampPieces: number;
  sleepGuardPieces: number;
  nixieMitigationUsed: boolean;
  lowCeilingCanceled: boolean;
  safetyNetArmed: boolean;
  activeRouteModifiers: RouteRuntimeModifier[];
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
  vfxKey?: string;
  useVfxKey?: string;
  counterSuccessVfxKey?: string;
  animations?: Record<string, string>;
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
  blockIdsMatrix?: (string | null)[][];
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
  clearedCells?: ClearedBoardCell[];
}

export interface ClearedBoardCell {
  row: number;
  col: number;
  cell: BoardCell;
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
  holdsUsed: number;
  enemyAttacks: number;
  feverTriggers: number;
  roomsCleared: number;
  bossesDefeated: string[];
}

export type BattleObjectiveProgress = {
  objectiveId: string;
  startedAtPiecesLocked: number;
  startedAtSpellsCast: number;
  startedAtHoldsUsed: number;
  startedAtEnemyAttacks: number;
  maxCascade: number;
  maxLinesWithOnePiece: number;
  clearedBlockCounts: Record<string, number>;
  usedHold: boolean;
  spellsCast: number;
  enemyAttacks: number;
  feverTriggered: boolean;
};

export interface RunState {
  player: PlayerState;
  hero: HeroState;
  weapon: WeaponState;
  board: BoardState;
  activeEnemy: EnemyInstance | null;
  activeEncounterPack: NodeEncounterPack | null;
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
  battleObjectiveProgress?: BattleObjectiveProgress;
  completedBattleObjectives: string[];
  activeRandomGameplayEvents: string[];
  activeHazards: ActiveHazardState[];
  incomingJunkQueue: IncomingJunkQueueEntry[];
  reactiveState: ReactiveBattleState;
  activeOopsies: string[];
  currentBossRule?: string;
  pendingNodeResult?: NodeResultSummary | null;
  nodeResultClaims: NodeResultClaimState[];
  playerLevelState: PlayerLevelState;
  levelUpScreenState: LevelUpScreenState;
  boardSizeModifier?: BoardSizeModifier;
  routeProgress: RouteProgressState;
  festivalHubVisited: boolean;
  lastBattleWasBoss: boolean;
  pendingStageAdvance: boolean;
  victory: boolean;
  runStats: RunStats;
  saveVersion: number;
}
