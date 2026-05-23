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
  ActiveHazardState,
  BoardState,
  BoardCell,
  CurrentRoomProgress,
  EnemyInstance,
  HeroRouteProgress,
  HeroState,
  ReactiveBattleState,
  RewardDefinition,
  RewardId,
  RouteProgressState,
  RunStats,
  RunState,
  SpellId,
  StatusEffectState,
  WeaponState,
  InventoryStack,
  IncomingJunkQueueEntry,
  HazardSeverity,
  NodeEncounterPack,
  PlayerLevelState,
  LevelUpScreenState
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
  activeHazards?: ActiveHazardState[];
  reactiveState?: Partial<ReactiveBattleState>;
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
    holdsUsed: 0,
    enemyAttacks: 0,
    feverTriggers: 0,
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

function createDefaultReactiveState(): ReactiveBattleState {
  return {
    nextSpellModifiers: [],
    previewRevealPieces: 0,
    speedBrakePieces: 0,
    freezeGuardPieces: 0,
    anchorCookiePieces: 0,
    cleanupCouponPieces: 0,
    nopeStampPieces: 0,
    sleepGuardPieces: 0,
    nixieMitigationUsed: false,
    lowCeilingCanceled: false,
    safetyNetArmed: false,
    activeRouteModifiers: []
  };
}

export function createDefaultPlayerLevelState(): PlayerLevelState {
  return {
    level: 1,
    currentXp: 0,
    xpToNextLevel: 25,
    pendingLevelUps: 0,
    chosenUpgrades: {},
    rerollCharges: 0
  };
}

export function createDefaultLevelUpScreenState(): LevelUpScreenState {
  return {
    pendingLevelUpChoices: [],
    offeredUpgradeIds: [],
    chosenUpgradeIds: [],
    rerollCharges: 0,
    levelUpSelectionSeed: '',
    levelUpScreenResolved: true
  };
}

function normalizePlayerLevelState(value: unknown): PlayerLevelState {
  const defaults = createDefaultPlayerLevelState();
  const raw = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Partial<PlayerLevelState>
    : {};
  const chosenUpgrades = raw.chosenUpgrades && typeof raw.chosenUpgrades === 'object' && !Array.isArray(raw.chosenUpgrades)
    ? Object.fromEntries(
        Object.entries(raw.chosenUpgrades)
          .filter(([key, stack]) => typeof key === 'string' && typeof stack === 'number' && Number.isFinite(stack) && stack > 0)
          .map(([key, stack]) => [key, Math.floor(stack as number)])
      )
    : {};

  return {
    level: Math.max(1, Math.floor(Number(raw.level ?? defaults.level))),
    currentXp: Math.max(0, Math.floor(Number(raw.currentXp ?? defaults.currentXp))),
    xpToNextLevel: Math.max(1, Math.floor(Number(raw.xpToNextLevel ?? defaults.xpToNextLevel))),
    pendingLevelUps: Math.max(0, Math.floor(Number(raw.pendingLevelUps ?? defaults.pendingLevelUps))),
    chosenUpgrades,
    rerollCharges: Math.max(0, Math.floor(Number(raw.rerollCharges ?? defaults.rerollCharges)))
  };
}

function normalizeLevelUpScreenState(value: unknown, levelState: PlayerLevelState): LevelUpScreenState {
  const defaults = createDefaultLevelUpScreenState();
  const raw = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Partial<LevelUpScreenState>
    : {};
  const toStringArray = (input: unknown): string[] =>
    Array.isArray(input)
      ? input.filter((entry): entry is string => typeof entry === 'string')
      : [];

  const offeredUpgradeIds = toStringArray(raw.offeredUpgradeIds);
  const pendingLevelUpChoices = toStringArray(raw.pendingLevelUpChoices);
  const chosenUpgradeIds = toStringArray(raw.chosenUpgradeIds);
  const rerollCharges = Math.max(0, Math.floor(Number(raw.rerollCharges ?? defaults.rerollCharges)));
  const levelUpScreenResolved = Boolean(raw.levelUpScreenResolved ?? defaults.levelUpScreenResolved);

  return {
    pendingLevelUpChoices: pendingLevelUpChoices.length > 0 ? pendingLevelUpChoices : offeredUpgradeIds,
    offeredUpgradeIds,
    chosenUpgradeIds,
    rerollCharges: Math.min(rerollCharges, Math.max(0, levelState.rerollCharges)),
    levelUpSelectionSeed: typeof raw.levelUpSelectionSeed === 'string' ? raw.levelUpSelectionSeed : defaults.levelUpSelectionSeed,
    levelUpScreenResolved: levelState.pendingLevelUps <= 0 ? true : levelUpScreenResolved
  };
}

function normalizeNodeResultSummary(value: unknown): RunState['pendingNodeResult'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const toNumber = (input: unknown, fallback = 0): number => {
    const n = Number(input);
    return Number.isFinite(n) ? n : fallback;
  };
  const nodeId = typeof raw.nodeId === 'string' ? raw.nodeId : 'unknown_node';
  const stageId = typeof raw.stageId === 'string' ? raw.stageId : 'stage_sprinkle_sewers';
  const encounterPackId = typeof raw.encounterPackId === 'string' ? raw.encounterPackId : 'unknown_pack';
  const resultId = typeof raw.resultId === 'string' ? raw.resultId : `${stageId}:${nodeId}:${encounterPackId}`;
  const toStringArray = (input: unknown): string[] =>
    Array.isArray(input) ? input.filter((entry): entry is string => typeof entry === 'string') : [];
  const xpBreakdownRaw = raw.xpBreakdown && typeof raw.xpBreakdown === 'object' && !Array.isArray(raw.xpBreakdown)
    ? raw.xpBreakdown as Record<string, unknown>
    : {};

  return {
    resultId,
    nodeId,
    stageId,
    nodeType: typeof raw.nodeType === 'string' ? raw.nodeType : 'normal',
    encounterPackId,
    enemiesDefeated: Math.max(0, Math.floor(toNumber(raw.enemiesDefeated))),
    defeatedEnemyIds: toStringArray(raw.defeatedEnemyIds),
    xpGainedTotal: Math.max(0, Math.floor(toNumber(raw.xpGainedTotal))),
    xpBreakdown: {
      enemyXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.enemyXp))),
      eliteBonusXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.eliteBonusXp))),
      bossBonusXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.bossBonusXp))),
      objectiveBonusXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.objectiveBonusXp))),
      cascadeBonusXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.cascadeBonusXp))),
      noDamageBonusXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.noDamageBonusXp))),
      routeBonusXp: Math.max(0, Math.floor(toNumber(xpBreakdownRaw.routeBonusXp)))
    },
    currentXpBeforeGain: Math.max(0, Math.floor(toNumber(raw.currentXpBeforeGain))),
    currentXpAfterGain: Math.max(0, Math.floor(toNumber(raw.currentXpAfterGain))),
    xpToNextLevel: Math.max(1, Math.floor(toNumber(raw.xpToNextLevel, 25))),
    xpRemainingToNextLevel: Math.max(0, Math.floor(toNumber(raw.xpRemainingToNextLevel))),
    leveledUp: Boolean(raw.leveledUp),
    pendingLevelUps: Math.max(0, Math.floor(toNumber(raw.pendingLevelUps))),
    rewardsPending: Boolean(raw.rewardsPending)
  };
}

function normalizeActiveEncounterPack(value: unknown): NodeEncounterPack | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const enemies = Array.isArray(raw.enemies)
    ? raw.enemies.filter((entry): entry is NodeEncounterPack['enemies'][number] => Boolean(entry) && typeof entry === 'object')
    : [];
  if (enemies.length <= 0) {
    return null;
  }
  const boundedIndex = Math.max(0, Math.min(enemies.length - 1, Math.floor(Number(raw.currentEnemyIndex ?? 0))));
  const toIndexArray = (input: unknown): number[] =>
    Array.isArray(input)
      ? input
          .map((entry) => Math.floor(Number(entry)))
          .filter((entry) => Number.isFinite(entry) && entry >= 0 && entry < enemies.length)
      : [];
  const defeatedEnemyIds = Array.isArray(raw.defeatedEnemyIds)
    ? raw.defeatedEnemyIds.filter((entry): entry is string => typeof entry === 'string')
    : [];
  const defeatedEnemyIndexes = [...new Set(toIndexArray(raw.defeatedEnemyIndexes))];
  const appliedEntryEffectEnemyIndexes = [...new Set(toIndexArray(raw.appliedEntryEffectEnemyIndexes))];
  const entryGiftClaimedEnemyIndexes = [...new Set(toIndexArray(raw.entryGiftClaimedEnemyIndexes))];
  const remainingEnemyCount = Math.max(0, enemies.length - defeatedEnemyIndexes.length);

  return {
    encounterPackId: typeof raw.encounterPackId === 'string' ? raw.encounterPackId : 'unknown_pack',
    nodeId: typeof raw.nodeId === 'string' ? raw.nodeId : 'unknown_node',
    stageId: typeof raw.stageId === 'string' ? raw.stageId : 'stage_sprinkle_sewers',
    biomeId: typeof raw.biomeId === 'string' ? raw.biomeId : 'biome_sprinkle_sewers',
    nodeType: typeof raw.nodeType === 'string' ? raw.nodeType as NodeEncounterPack['nodeType'] : 'normal',
    enemies,
    currentEnemyIndex: boundedIndex,
    totalHpBudgetMultiplier: Math.max(0.1, Number(raw.totalHpBudgetMultiplier ?? 1)),
    totalAttackBudgetMultiplier: Math.max(0.1, Number(raw.totalAttackBudgetMultiplier ?? 1)),
    maxActiveHazards: Math.max(1, Math.floor(Number(raw.maxActiveHazards ?? 1))),
    rewardsGrantedOnlyOnNodeClear: true,
    xpGrantedOnlyOnNodeClear: true,
    defeatedEnemyIds,
    defeatedEnemyIndexes,
    remainingEnemyCount,
    appliedEntryEffectEnemyIndexes,
    entryGiftClaimedEnemyIndexes,
    encounterPackCompleted: Boolean(raw.encounterPackCompleted),
    nodeRewardsGranted: Boolean(raw.nodeRewardsGranted),
    routeFallbackTriggeredForEncounterPack: Boolean(raw.routeFallbackTriggeredForEncounterPack),
    entryEffectAppliedToIndex: typeof raw.entryEffectAppliedToIndex === 'number' ? raw.entryEffectAppliedToIndex : undefined,
    breatherRewardPolicy: raw.breatherRewardPolicy as NodeEncounterPack['breatherRewardPolicy'],
    generatedFromPoolId: typeof raw.generatedFromPoolId === 'string' ? raw.generatedFromPoolId : undefined,
    seed: typeof raw.seed === 'number' || typeof raw.seed === 'string' ? raw.seed : undefined
  };
}

function normalizeActiveHazards(value: unknown): ActiveHazardState[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is Partial<ActiveHazardState> => Boolean(entry) && typeof entry === 'object')
    .filter((entry) => typeof entry.hazardId === 'string' && typeof entry.kind === 'string')
    .map((entry, index) => ({
      hazardId: entry.hazardId ?? 'hazard_unknown',
      instanceId: typeof entry.instanceId === 'string' ? entry.instanceId : `${entry.hazardId ?? 'hazard_unknown'}_${index}`,
      kind: entry.kind as ActiveHazardState['kind'],
      name: typeof entry.name === 'string' ? entry.name : 'Festival Hazard',
      warningText: typeof entry.warningText === 'string' ? entry.warningText : 'A festival hazard is warming up.',
      counterTags: Array.isArray(entry.counterTags) ? [...entry.counterTags] : [],
      counterWindowPieces: Math.max(0, Number(entry.counterWindowPieces ?? entry.remainingPieces ?? 0)),
      remainingPieces: Math.max(0, Number(entry.remainingPieces ?? entry.counterWindowPieces ?? 0)),
      severity: entry.severity ?? 'minor',
      defaultFailureEffect: typeof entry.defaultFailureEffect === 'string' ? entry.defaultFailureEffect : 'It makes the board messier.',
      itemCounterHints: Array.isArray(entry.itemCounterHints) ? [...entry.itemCounterHints] : [],
      spellCounterHints: Array.isArray(entry.spellCounterHints) ? [...entry.spellCounterHints] : [],
      cascadeCounterHint: typeof entry.cascadeCounterHint === 'string' ? entry.cascadeCounterHint : undefined,
      amount: typeof entry.amount === 'number' ? Math.max(0, entry.amount) : undefined,
      sourceId: typeof entry.sourceId === 'string' ? entry.sourceId : undefined,
      blockId: typeof entry.blockId === 'string' ? entry.blockId : undefined,
      onExpireBlockId: typeof entry.onExpireBlockId === 'string' ? entry.onExpireBlockId : undefined,
      column: typeof entry.column === 'number' ? entry.column : undefined,
      row: typeof entry.row === 'number' ? entry.row : undefined
    }))
    .filter((entry) => entry.remainingPieces >= 0);
}

function normalizeIncomingJunkQueue(value: unknown): IncomingJunkQueueEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowedSeverity = new Set<HazardSeverity>(['minor', 'moderate', 'major', 'boss']);
  return value
    .filter((entry): entry is Partial<IncomingJunkQueueEntry> => Boolean(entry) && typeof entry === 'object')
    .map((entry, index) => {
      const amount = Math.max(0, Number(entry.amount ?? 0));
      const remainingAmount = Math.max(0, Number(entry.remainingAmount ?? amount));
      const delayPieces = Math.max(1, Number(entry.delayPieces ?? 1));
      return {
        id: typeof entry.id === 'string' ? entry.id : `incoming_junk_${index}`,
        sourceId: typeof entry.sourceId === 'string' ? entry.sourceId : 'unknown_source',
        sourceName: typeof entry.sourceName === 'string' ? entry.sourceName : undefined,
        amount,
        remainingAmount,
        delayPieces,
        junkBlockId: typeof entry.junkBlockId === 'string' ? entry.junkBlockId : 'block_crumb_junk',
        severity: typeof entry.severity === 'string' && allowedSeverity.has(entry.severity as HazardSeverity)
          ? entry.severity as HazardSeverity
          : 'minor',
        createdAtPieceCount: typeof entry.createdAtPieceCount === 'number' ? Math.max(0, entry.createdAtPieceCount) : undefined,
        reason: typeof entry.reason === 'string' ? entry.reason : undefined
      };
    })
    .filter((entry) => entry.remainingAmount > 0);
}

function normalizeReactiveState(value: Partial<ReactiveBattleState> | undefined): ReactiveBattleState {
  const defaults = createDefaultReactiveState();
  return {
    ...defaults,
    ...(value ?? {}),
    nextSpellModifiers: Array.isArray(value?.nextSpellModifiers)
      ? value.nextSpellModifiers
          .filter((modifier) => modifier && typeof modifier.id === 'string' && typeof modifier.sourceItemId === 'string')
          .map((modifier) => ({
            ...modifier,
            remainingCasts: Math.max(1, Number(modifier.remainingCasts ?? 1))
          }))
      : [],
    previewRevealPieces: Math.max(0, Number(value?.previewRevealPieces ?? 0)),
    speedBrakePieces: Math.max(0, Number(value?.speedBrakePieces ?? 0)),
    freezeGuardPieces: Math.max(0, Number(value?.freezeGuardPieces ?? 0)),
    anchorCookiePieces: Math.max(0, Number(value?.anchorCookiePieces ?? 0)),
    cleanupCouponPieces: Math.max(0, Number(value?.cleanupCouponPieces ?? 0)),
    nopeStampPieces: Math.max(0, Number(value?.nopeStampPieces ?? 0)),
    sleepGuardPieces: Math.max(0, Number(value?.sleepGuardPieces ?? 0)),
    nixieMitigationUsed: Boolean(value?.nixieMitigationUsed),
    lowCeilingCanceled: Boolean(value?.lowCeilingCanceled),
    safetyNetArmed: Boolean(value?.safetyNetArmed),
    activeRouteModifiers: Array.isArray(value?.activeRouteModifiers)
      ? value.activeRouteModifiers
          .filter((modifier) => modifier && typeof modifier.id === 'string' && typeof modifier.modifierId === 'string')
          .map((modifier) => ({
            ...modifier,
            duration: modifier.duration === 'stage' || modifier.duration === 'boss' || modifier.duration === 'run'
              ? modifier.duration
              : 'next_battle',
            consumed: Boolean(modifier.consumed)
          }))
      : []
  };
}

function normalizeBoardGrid(input: unknown, defaults: BoardState, columns = defaults.columns, rows = defaults.rows): BoardCell[][] {
  const defaultGrid = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => (defaults.grid[rowIndex]?.[columnIndex] ?? 0) as BoardCell)
  );
  if (!Array.isArray(input)) {
    return defaultGrid.map((row) => [...row]);
  }

  return defaultGrid.map((defaultRow, rowIndex) => {
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
const ROUTE_VERSION = 1;

function createDefaultHeroRouteProgress(heroId: string): HeroRouteProgress {
  return {
    heroId,
    practicalScore: 0,
    trueScore: 0,
    riskyScore: 0,
    trueFlags: [],
    chosenScenes: {},
    triggeredScenes: [],
    unlockedEndingIds: [],
    variantEndingIds: []
  };
}

export function createDefaultRouteProgress(heroId = 'hero_milo_blockmancer'): RouteProgressState {
  return {
    activeHeroId: heroId,
    routeVersion: ROUTE_VERSION,
    heroes: {
      [heroId]: createDefaultHeroRouteProgress(heroId)
    }
  };
}

function normalizeHeroRouteProgress(heroId: string, value: unknown): HeroRouteProgress {
  const raw = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Partial<HeroRouteProgress>
    : {};
  const stringArray = (input: unknown) => Array.isArray(input)
    ? [...new Set(input.filter((item): item is string => typeof item === 'string'))]
    : [];
  const chosenScenes = raw.chosenScenes && typeof raw.chosenScenes === 'object' && !Array.isArray(raw.chosenScenes)
    ? Object.fromEntries(Object.entries(raw.chosenScenes).filter(([, lane]) => lane === 'practical' || lane === 'true' || lane === 'risky'))
    : {};

  return {
    heroId: typeof raw.heroId === 'string' ? raw.heroId : heroId,
    practicalScore: Math.max(0, Number(raw.practicalScore ?? 0)),
    trueScore: Math.max(0, Number(raw.trueScore ?? 0)),
    riskyScore: Math.max(0, Number(raw.riskyScore ?? 0)),
    trueFlags: stringArray(raw.trueFlags),
    chosenScenes,
    triggeredScenes: stringArray(raw.triggeredScenes),
    unlockedEndingIds: stringArray(raw.unlockedEndingIds),
    variantEndingIds: stringArray(raw.variantEndingIds)
  };
}

function normalizeRouteProgress(value: unknown, activeHeroId: string): RouteProgressState {
  const raw = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Partial<RouteProgressState>
    : {};
  const heroes: Record<string, HeroRouteProgress> = {};
  if (raw.heroes && typeof raw.heroes === 'object' && !Array.isArray(raw.heroes)) {
    for (const [heroId, progress] of Object.entries(raw.heroes)) {
      if (typeof heroId === 'string') {
        heroes[heroId] = normalizeHeroRouteProgress(heroId, progress);
      }
    }
  }

  const normalizedActiveHeroId = typeof raw.activeHeroId === 'string' ? raw.activeHeroId : activeHeroId;
  if (!heroes[normalizedActiveHeroId]) {
    heroes[normalizedActiveHeroId] = createDefaultHeroRouteProgress(normalizedActiveHeroId);
  }

  return {
    activeHeroId: normalizedActiveHeroId,
    routeVersion: ROUTE_VERSION,
    heroes
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
    activeEncounterPack: null,
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
    stageGoals: {},
    activeChaosRule: undefined,
    activeBattleObjective: undefined,
    battleObjectiveProgress: undefined,
    completedBattleObjectives: [],
    activeRandomGameplayEvents: [],
    activeHazards: [],
    incomingJunkQueue: [],
    reactiveState: createDefaultReactiveState(),
    activeOopsies: [],
    currentBossRule: undefined,
    pendingNodeResult: null,
    nodeResultClaims: [],
    playerLevelState: createDefaultPlayerLevelState(),
    levelUpScreenState: createDefaultLevelUpScreenState(),
    boardSizeModifier: undefined,
    routeProgress: createDefaultRouteProgress(),
    festivalHubVisited: false,
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
  const fallbackNodeId = typeof raw.currentNodeId === 'string' ? raw.currentNodeId : defaults.currentNodeId;
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
      columns: typeof raw.board?.columns === 'number' ? raw.board.columns : defaults.board.columns,
      rows: typeof raw.board?.rows === 'number' ? raw.board.rows : defaults.board.rows,
      grid: normalizeBoardGrid(
        raw.board?.grid,
        defaults.board,
        typeof raw.board?.columns === 'number' ? raw.board.columns : defaults.board.columns,
        typeof raw.board?.rows === 'number' ? raw.board.rows : defaults.board.rows
      ),
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
    stageGoals: raw.stageGoals ? { ...raw.stageGoals } : { ...defaults.stageGoals },
    activeChaosRule: raw.activeChaosRule,
    activeBattleObjective: raw.activeBattleObjective,
    battleObjectiveProgress: raw.battleObjectiveProgress ? {
      objectiveId: String(raw.battleObjectiveProgress.objectiveId ?? raw.activeBattleObjective ?? ''),
      startedAtPiecesLocked: Math.max(0, Number(raw.battleObjectiveProgress.startedAtPiecesLocked ?? 0)),
      startedAtSpellsCast: Math.max(0, Number(raw.battleObjectiveProgress.startedAtSpellsCast ?? 0)),
      startedAtHoldsUsed: Math.max(0, Number(raw.battleObjectiveProgress.startedAtHoldsUsed ?? 0)),
      startedAtEnemyAttacks: Math.max(0, Number(raw.battleObjectiveProgress.startedAtEnemyAttacks ?? 0)),
      maxCascade: Math.max(0, Number(raw.battleObjectiveProgress.maxCascade ?? 0)),
      maxLinesWithOnePiece: Math.max(0, Number(raw.battleObjectiveProgress.maxLinesWithOnePiece ?? 0)),
      clearedBlockCounts: raw.battleObjectiveProgress.clearedBlockCounts && typeof raw.battleObjectiveProgress.clearedBlockCounts === 'object'
        ? Object.fromEntries(Object.entries(raw.battleObjectiveProgress.clearedBlockCounts).map(([key, value]) => [key, Math.max(0, Number(value))]))
        : {},
      usedHold: Boolean(raw.battleObjectiveProgress.usedHold),
      spellsCast: Math.max(0, Number(raw.battleObjectiveProgress.spellsCast ?? 0)),
      enemyAttacks: Math.max(0, Number(raw.battleObjectiveProgress.enemyAttacks ?? 0)),
      feverTriggered: Boolean(raw.battleObjectiveProgress.feverTriggered)
    } : undefined,
    completedBattleObjectives: raw.completedBattleObjectives ? [...raw.completedBattleObjectives] : [],
    activeRandomGameplayEvents: raw.activeRandomGameplayEvents ? [...raw.activeRandomGameplayEvents] : [],
    activeEncounterPack: normalizeActiveEncounterPack(raw.activeEncounterPack) ?? defaults.activeEncounterPack,
    activeHazards: normalizeActiveHazards(raw.activeHazards),
    incomingJunkQueue: normalizeIncomingJunkQueue((raw as { incomingJunkQueue?: unknown }).incomingJunkQueue),
    reactiveState: normalizeReactiveState(raw.reactiveState),
    activeOopsies: raw.activeOopsies ? [...raw.activeOopsies] : [...player.oopsies],
    currentBossRule: raw.currentBossRule,
    pendingNodeResult: normalizeNodeResultSummary(raw.pendingNodeResult) ?? defaults.pendingNodeResult,
    nodeResultClaims: Array.isArray((raw as { nodeResultClaims?: unknown[] }).nodeResultClaims)
      ? ((raw as { nodeResultClaims?: unknown[] }).nodeResultClaims ?? [])
          .filter((claim): claim is Record<string, unknown> => Boolean(claim) && typeof claim === 'object')
          .map((claim) => ({
            nodeId: typeof claim.nodeId === 'string' ? claim.nodeId : fallbackNodeId,
            encounterPackId: typeof claim.encounterPackId === 'string' ? claim.encounterPackId : 'unknown_pack',
            resultId: typeof claim.resultId === 'string'
              ? claim.resultId
              : `${typeof claim.nodeId === 'string' ? claim.nodeId : fallbackNodeId}:${typeof claim.encounterPackId === 'string' ? claim.encounterPackId : 'unknown_pack'}`,
            resultShown: Boolean(claim.resultShown),
            xpApplied: Boolean(claim.xpApplied),
            postNodeHealingApplied: Boolean(claim.postNodeHealingApplied)
          }))
      : [...defaults.nodeResultClaims],
    playerLevelState: normalizePlayerLevelState((raw as { playerLevelState?: unknown }).playerLevelState),
    levelUpScreenState: createDefaultLevelUpScreenState(),
    boardSizeModifier: raw.boardSizeModifier ? { ...raw.boardSizeModifier } : undefined,
    routeProgress: normalizeRouteProgress(raw.routeProgress, raw.hero?.id ?? defaults.hero.id),
    festivalHubVisited: Boolean(raw.festivalHubVisited),
    runStats: {
      ...defaults.runStats,
      ...(raw.runStats ?? {}),
      holdsUsed: Math.max(0, Number(raw.runStats?.holdsUsed ?? 0)),
      enemyAttacks: Math.max(0, Number(raw.runStats?.enemyAttacks ?? 0)),
      feverTriggers: Math.max(0, Number(raw.runStats?.feverTriggers ?? 0)),
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
  // Migrate legacy XP fields into playerLevelState when older saves do not have it.
  if (!(raw as { playerLevelState?: unknown }).playerLevelState) {
    merged.playerLevelState.level = Math.max(1, Math.floor(Number(player.level ?? 1)));
    merged.playerLevelState.currentXp = Math.max(0, Math.floor(Number(player.experience ?? 0)));
    merged.playerLevelState.xpToNextLevel = Math.max(1, Math.floor(Number(player.xpToNextLevel ?? 25)));
  }
  merged.lastCascadeLevel = Math.max(0, raw.lastCascadeLevel ?? defaults.lastCascadeLevel);
  merged.lastCascadeLines = Math.max(0, raw.lastCascadeLines ?? defaults.lastCascadeLines);
  merged.currentEventId = typeof raw.currentEventId === 'string' ? raw.currentEventId : null;
  merged.saveVersion = SAVE_VERSION;
  oopsieSystem.normalizeState(merged);
  merged.activeOopsies = [...merged.player.oopsies];
  merged.routeProgress = normalizeRouteProgress(merged.routeProgress, merged.hero.id);
  merged.playerLevelState.pendingLevelUps = Math.max(0, Math.floor(merged.playerLevelState.pendingLevelUps));
  merged.levelUpScreenState = normalizeLevelUpScreenState(
    (raw as { levelUpScreenState?: unknown }).levelUpScreenState,
    merged.playerLevelState
  );
  merged.routeProgress.activeHeroId = merged.hero.id;
  if (!merged.routeProgress.heroes[merged.hero.id]) {
    merged.routeProgress.heroes[merged.hero.id] = createDefaultHeroRouteProgress(merged.hero.id);
  }

  return merged;
}
