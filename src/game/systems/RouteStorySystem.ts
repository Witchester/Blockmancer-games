import type {
  DialogueLine,
  HazardSeverity,
  HeroRouteProgress,
  RouteChoiceContent,
  RouteChoiceLane,
  RouteProgressState,
  RouteRiskConfig,
  RouteRuntimeModifier,
  RouteRewardConfig,
  RouteSceneContent,
  RunState
} from '../types/GameTypes';
import { clamp } from '../utils/math';
import { contentRegistry } from './ContentRegistry';
import type { InventorySystem } from './InventorySystem';
import type { OopsieSystem } from './OopsieSystem';
import type { RewardSystem } from './RewardSystem';

export const ROUTE_VERSION = 1;
export const TRUE_ENDING_MIN_FLAGS = 5;
export const TRUE_ENDING_MIN_SCORE = 5;
export const VARIANT_MIN_RISK_SCORE = 3;

export type RouteTriggerContext = 'first_eligible_event_node' | 'after_first_combat_victory' | 'before_boss';

export type RouteEndingContent = {
  id: string;
  heroId: string;
  kind: 'normal' | 'true' | 'variant';
  title: string;
  panels: string[];
  lines: DialogueLine[];
  unlockText?: string;
};

export type RouteEndingResolution = {
  endingKind: 'normal' | 'true';
  ending: RouteEndingContent;
  variant?: RouteEndingContent;
};

type RouteSceneBundle = {
  routeId?: string;
  heroId?: string;
  scenes?: RouteSceneContent[];
};

type RouteEndingBundle = {
  endings?: RouteEndingContent[];
};

type RouteBarksBundle = {
  barks?: Record<string, string[]>;
};

type RouteVoiceTagsBundle = {
  voiceTags?: Record<string, string[]>;
};

const sceneModules = (import.meta as unknown as {
  glob: (pattern: string, options: { eager: boolean; import: string }) => Record<string, unknown>;
}).glob('../content/story/routes/route-scenes.*.json', { eager: true, import: 'default' });

const endingModules = (import.meta as unknown as {
  glob: (pattern: string, options: { eager: boolean; import: string }) => Record<string, unknown>;
}).glob('../content/story/routes/route-endings.json', { eager: true, import: 'default' });

const routeBarkModules = (import.meta as unknown as {
  glob: (pattern: string, options: { eager: boolean; import: string }) => Record<string, unknown>;
}).glob('../content/story/routes/route-barks.json', { eager: true, import: 'default' });

const routeVoiceTagModules = (import.meta as unknown as {
  glob: (pattern: string, options: { eager: boolean; import: string }) => Record<string, unknown>;
}).glob('../content/story/routes/route-voice-tags.json', { eager: true, import: 'default' });

const HERO_IDS = [
  'hero_milo_blockmancer',
  'hero_pippa_pyromancer',
  'hero_zuzu_goblin_engineer',
  'hero_nixie_frostbinder',
  'hero_bruk_snack_knight',
  'hero_lumi_star_witch'
];

const STAGE_IDS = [
  'stage_sprinkle_sewers',
  'stage_goblin_workshop',
  'stage_frosty_pantry',
  'stage_pillow_castle',
  'stage_starfall_arcade',
  'stage_bloxley_block_palace'
];

const FALLBACK_SCENE: RouteSceneContent = {
  id: 'fallback_route_scene',
  heroId: 'hero_milo_blockmancer',
  stageId: 'stage_sprinkle_sewers',
  triggerId: 'trig_fallback_route_scene',
  triggerCondition: {
    type: 'first_eligible_event_node',
    heroId: 'hero_milo_blockmancer',
    stageId: 'stage_sprinkle_sewers',
    oncePerRun: true
  },
  locationName: 'Festival Dungeon',
  title: 'A Helpful Pause',
  storyBeat: 'The route content is missing, so the festival offers a safe fallback.',
  storyboardPanels: ['A soft festival light marks a safe pause in the run.'],
  preChoiceDialogue: [
    { speakerId: 'npc_festival_announcer', text: 'A route story card is missing, but the dungeon remains polite.' }
  ],
  choices: [
    {
      id: 'fallback_practical',
      lane: 'practical',
      label: 'Take Safe Help',
      playerLine: 'Take the stable option.',
      npcResponse: [{ speakerId: 'npc_block_o_matic', text: 'Fallback reward applied safely.' }],
      narration: 'The route system grants a small shield and keeps the run moving.',
      gameplayResult: 'Gain 4 shield.',
      rewardConfig: { rewardId: 'route_fallback_shield', rewardType: 'shield', amount: 4 },
      statDelta: { practicalScore: 1 }
    },
    {
      id: 'fallback_true',
      lane: 'true',
      label: 'Keep Listening',
      playerLine: 'Mark the missing story and continue.',
      npcResponse: [{ speakerId: 'npc_block_o_matic', text: 'Missing route note recorded.' }],
      narration: 'The route system records a fallback true flag.',
      gameplayResult: 'Gain 5 mana.',
      rewardConfig: { rewardId: 'route_fallback_mana', rewardType: 'mana', amount: 5 },
      statDelta: { trueScore: 1 },
      grantFlag: 'fallback_route_true_flag'
    },
    {
      id: 'fallback_risky',
      lane: 'risky',
      label: 'Try Brightly',
      playerLine: 'Accept a small risky sparkle.',
      npcResponse: [{ speakerId: 'npc_festival_announcer', text: 'Sparkle accepted. Please continue responsibly.' }],
      narration: 'The route system grants a little gold and no crash.',
      gameplayResult: 'Gain 15 gold.',
      rewardConfig: { rewardId: 'route_fallback_gold', rewardType: 'gold', amount: 15 },
      statDelta: { riskyScore: 1 }
    }
  ],
  postChoiceBarks: [{ speakerId: 'npc_festival_announcer', text: 'The route fallback has cleared the path.' }],
  victoryCallback: [{ speakerId: 'narrator', text: 'The missing story did not block the run.' }],
  bossCallback: [{ speakerId: 'npc_block_o_matic', text: 'Fallback callback available. Combat may proceed.' }]
};

export class RouteStorySystem {
  private readonly scenes: RouteSceneContent[];
  private readonly endings: RouteEndingContent[];
  private readonly validationWarnings: string[];
  private readonly routeBarks: Record<string, string[]>;
  private readonly routeVoiceTags: Record<string, string[]>;

  constructor(
    private readonly rewardSystem?: RewardSystem,
    private readonly inventorySystem?: InventorySystem,
    private readonly oopsieSystem?: OopsieSystem
  ) {
    this.scenes = this.loadScenes();
    this.endings = this.loadEndings();
    this.routeBarks = this.loadRouteBarks();
    this.routeVoiceTags = this.loadRouteVoiceTags();
    this.validationWarnings = this.validateContent();
  }

  getValidationWarnings(): string[] {
    return [...this.validationWarnings];
  }

  getAllScenes(): RouteSceneContent[] {
    return [...this.scenes];
  }

  getHeroBark(heroId: string): string | null {
    const barks = this.routeBarks[heroId];
    if (!barks?.length) {
      return null;
    }
    return barks[Math.floor(Math.random() * barks.length)] ?? null;
  }

  getHeroVoiceTags(heroId: string): string[] {
    const tagGroupByHeroId: Record<string, string> = {
      hero_milo_blockmancer: 'milo_soft',
      hero_pippa_pyromancer: 'pippa_hearth',
      hero_zuzu_goblin_engineer: 'zuzu_accountable',
      hero_nixie_frostbinder: 'nixie_thaw',
      hero_bruk_snack_knight: 'bruk_hospitality',
      hero_lumi_star_witch: 'lumi_wishkeeper'
    };
    const tagGroup = tagGroupByHeroId[heroId];
    if (!tagGroup) {
      return [];
    }
    return this.routeVoiceTags[tagGroup] ? [...this.routeVoiceTags[tagGroup]] : [];
  }

  getEndingById(id: string): RouteEndingContent | null {
    return this.endings.find((ending) => ending.id === id) ?? null;
  }

  getRouteSceneForHeroStage(heroId: string, stageId: string): RouteSceneContent {
    return this.scenes.find((scene) => scene.heroId === heroId && scene.stageId === stageId) ?? {
      ...FALLBACK_SCENE,
      heroId,
      stageId,
      id: `fallback_route_scene_${heroId}_${stageId}`,
      triggerId: `trig_fallback_${heroId}_${stageId}`,
      triggerCondition: { ...FALLBACK_SCENE.triggerCondition, heroId, stageId }
    };
  }

  shouldTriggerRouteScene(
    runState: RunState,
    heroId: string,
    stageId: string,
    context: RouteTriggerContext
  ): RouteSceneContent | null {
    const scene = this.getRouteSceneForHeroStage(heroId, stageId);
    const progress = this.getHeroProgress(runState.routeProgress, heroId);
    if (progress.triggeredScenes.includes(scene.id) || progress.chosenScenes[scene.id]) {
      return null;
    }
    if (context === 'before_boss' || runState.currentRoomType === 'boss') {
      return null;
    }
    if (context === 'after_first_combat_victory' && this.hasUncompletedEventNode(runState)) {
      return null;
    }
    if (scene.triggerCondition.type !== context && context !== 'after_first_combat_victory') {
      return null;
    }
    return scene;
  }

  markRouteSceneTriggered(runState: RunState, sceneId: string): void {
    const progress = this.getHeroProgress(runState.routeProgress, runState.hero.id);
    if (!progress.triggeredScenes.includes(sceneId)) {
      progress.triggeredScenes.push(sceneId);
    }
  }

  resolveRouteChoice(runState: RunState, sceneId: string, choiceId: string): string[] {
    const scene = this.scenes.find((entry) => entry.id === sceneId) ?? FALLBACK_SCENE;
    const choice = scene.choices.find((entry) => entry.id === choiceId) ?? scene.choices[0];
    const progress = this.getHeroProgress(runState.routeProgress, scene.heroId);
    progress.chosenScenes[scene.id] = choice.lane;
    this.incrementLane(progress, choice.lane);
    if (choice.grantFlag && !progress.trueFlags.includes(choice.grantFlag)) {
      progress.trueFlags.push(choice.grantFlag);
    }

    const messages = [
      `Route choice: ${choice.label}.`,
      this.applyRouteReward(runState, choice.rewardConfig)
    ];
    if (choice.riskConfig) {
      messages.push(...this.applyRouteRisk(choice.riskConfig, runState));
    }

    runState.routeProgress.activeHeroId = scene.heroId;
    runState.eventLog = [...messages, ...runState.eventLog].slice(0, 8);
    return messages;
  }

  getBossCallback(heroId: string, stageId: string, routeState: RouteProgressState): DialogueLine[] {
    const scene = this.getRouteSceneForHeroStage(heroId, stageId);
    const lane = this.getHeroProgress(routeState, heroId).chosenScenes[scene.id];
    if (!lane) {
      return [];
    }
    const laneLines = scene.bossCallbackByLane?.[lane];
    return laneLines?.length ? laneLines : scene.bossCallback ?? [];
  }

  applyBossCallbackModifier(runState: RunState): string | null {
    return this.applyBossRouteModifier(runState.hero.id, STAGE_IDS[runState.stage - 1] ?? 'stage_sprinkle_sewers', runState);
  }

  applyBossRouteModifier(heroId: string, stageId: string, runState: RunState): string | null {
    const scene = this.getRouteSceneForHeroStage(heroId, stageId);
    const lane = this.getHeroProgress(runState.routeProgress, heroId).chosenScenes[scene.id];
    if (!lane) {
      return null;
    }
    if (lane === 'true') {
      runState.reactiveState.previewRevealPieces = Math.max(runState.reactiveState.previewRevealPieces, 2);
      return 'Route boss callback: true-route insight reveals the first warning earlier.';
    }
    if (lane === 'risky') {
      runState.player.mana = clamp(runState.player.mana + 8, 0, runState.player.maxMana);
      return 'Route boss callback: risky-route sparkle grants 8 mana, but the boss stays alert.';
    }
    runState.player.shield += 2;
    return 'Route boss callback: practical-route prep grants 2 shield.';
  }

  resolveHeroEnding(heroId: string, routeState: RouteProgressState): RouteEndingResolution {
    const progress = this.getHeroProgress(routeState, heroId);
    const hasTrueEnding = progress.trueScore >= TRUE_ENDING_MIN_SCORE && progress.trueFlags.length >= TRUE_ENDING_MIN_FLAGS;
    const kind = hasTrueEnding ? 'true' : 'normal';
    const ending = this.findEnding(heroId, kind);
    const variant = progress.riskyScore >= VARIANT_MIN_RISK_SCORE ? this.findEnding(heroId, 'variant') : undefined;
    return { endingKind: kind, ending, variant };
  }

  recordEndingUnlock(progress: HeroRouteProgress, ending: RouteEndingContent, variant?: RouteEndingContent): void {
    if (!progress.unlockedEndingIds.includes(ending.id)) {
      progress.unlockedEndingIds.push(ending.id);
    }
    if (variant && !progress.variantEndingIds.includes(variant.id)) {
      progress.variantEndingIds.push(variant.id);
    }
  }

  private getHeroProgress(routeState: RouteProgressState, heroId: string): HeroRouteProgress {
    routeState.routeVersion = ROUTE_VERSION;
    routeState.activeHeroId = heroId;
    if (!routeState.heroes[heroId]) {
      routeState.heroes[heroId] = {
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
    return routeState.heroes[heroId];
  }

  applyRouteReward(runState: RunState, reward: RouteRewardConfig): string {
    if (!reward?.rewardId || !reward.rewardType) {
      return 'Route reward missing; the festival moves on safely.';
    }

    switch (reward.rewardType) {
      case 'gold': {
        const amount = reward.amount ?? 20;
        runState.player.gold += amount;
        runState.player.totalGoldCollected += amount;
        runState.gold = runState.player.gold;
        return `Route reward ${reward.rewardId}: gained ${amount} gold.`;
      }
      case 'heal': {
        const amount = reward.amount ?? 5;
        runState.player.hp = clamp(runState.player.hp + amount, 0, runState.player.maxHp);
        return `Route reward ${reward.rewardId}: healed ${amount} HP.`;
      }
      case 'mana': {
        const amount = reward.amount ?? 10;
        runState.player.mana = clamp(runState.player.mana + amount, 0, runState.player.maxMana);
        return `Route reward ${reward.rewardId}: gained ${amount} mana.`;
      }
      case 'shield': {
        const amount = reward.amount ?? 4;
        runState.player.shield += amount;
        return `Route reward ${reward.rewardId}: gained ${amount} shield.`;
      }
      case 'item': {
        const itemId = reward.itemId ?? 'item_mana_lemonade';
        if (!contentRegistry.getOptionalById('item', itemId)) {
          return `Route reward ${reward.rewardId}: missing item ${itemId}; skipped safely.`;
        }
        this.inventorySystem?.addItem(runState, itemId, reward.amount ?? 1);
        return `Route reward ${reward.rewardId}: added ${itemId}.`;
      }
      case 'relic':
      case 'upgrade': {
        const contentType = reward.rewardType;
        const rewardId = reward.relicId ?? reward.upgradeId ?? reward.rewardId;
        if (!contentRegistry.getOptionalById(contentType, rewardId)) {
          return `Route reward ${reward.rewardId}: missing ${contentType} ${rewardId}; skipped safely.`;
        }
        const definition = {
          id: rewardId,
          name: rewardId,
          type: reward.rewardType === 'relic' ? 'Relic' : 'Upgrade',
          description: 'Route-granted reward.',
          persistent: true,
          contentType
        };
        runState.pendingRewards = [definition];
        return this.rewardSystem?.applyReward(runState, rewardId) ?? `Route reward ${reward.rewardId}: ${rewardId} queued.`;
      }
      case 'battle_modifier': {
        if (reward.modifierId === 'extra_preview') {
          runState.player.extraPreview = true;
        }
        if (reward.modifierId === 'route_fever') {
          runState.player.fever = clamp(runState.player.fever + (reward.amount ?? 12), 0, 100);
        }
        this.registerRouteModifier(runState, reward);
        return `Route modifier ${reward.modifierId ?? reward.rewardId} applied for ${reward.duration ?? 'battle'}.`;
      }
      case 'stage_modifier':
      case 'boss_modifier':
      case 'hazard_modifier': {
        if (reward.modifierId?.includes('freeze')) {
          runState.reactiveState.freezeGuardPieces = Math.max(runState.reactiveState.freezeGuardPieces, reward.amount ?? 3);
        }
        if (reward.modifierId?.includes('speed')) {
          runState.reactiveState.speedBrakePieces = Math.max(runState.reactiveState.speedBrakePieces, reward.amount ?? 4);
        }
        if (reward.modifierId?.includes('preview') || reward.modifierId?.includes('warning')) {
          runState.reactiveState.previewRevealPieces = Math.max(runState.reactiveState.previewRevealPieces, reward.amount ?? 3);
        }
        this.registerRouteModifier(runState, reward);
        return `Route modifier ${reward.modifierId ?? reward.rewardId} applied for ${reward.duration ?? 'stage'}.`;
      }
      default:
        return `Route reward ${reward.rewardId} has no hooked effect yet.`;
    }
  }

  applyRouteRisk(risk: RouteRiskConfig, runState: RunState): string[] {
    const messages: string[] = [];
    if (risk.oopsieChance && Math.random() < risk.oopsieChance) {
      const oopsie = this.oopsieSystem?.addRandomOopsie(runState);
      if (oopsie) {
        messages.push(`Route risk added oopsie: ${oopsie.name}.`);
      }
    }
    const hazardId = risk.addHazardId ?? risk.hazardIncrease;
    if (hazardId) {
      messages.push(this.applyRiskHazard(runState, hazardId, risk.increaseHazardSeverity));
    }
    if (risk.bossModifierId) {
      this.registerRouteModifier(runState, {
        rewardId: `risk_${risk.bossModifierId}`,
        rewardType: 'boss_modifier',
        modifierId: risk.bossModifierId,
        duration: 'boss'
      });
      messages.push(`Route risk boss modifier ${risk.bossModifierId} registered.`);
    }
    return messages;
  }

  registerRouteModifier(runState: RunState, reward: RouteRewardConfig): RouteRuntimeModifier | null {
    if (!reward.modifierId || !reward.duration || reward.duration === 'next_battle') {
      return null;
    }
    const modifier: RouteRuntimeModifier = {
      id: `${reward.rewardId}_${reward.modifierId}_${runState.stage}`,
      sourceRewardId: reward.rewardId,
      modifierId: reward.modifierId,
      duration: reward.duration,
      stage: reward.duration === 'stage' || reward.duration === 'boss' ? runState.stage : undefined,
      amount: reward.amount,
      consumed: false
    };
    runState.reactiveState.activeRouteModifiers = runState.reactiveState.activeRouteModifiers.filter((entry) => entry.id !== modifier.id);
    runState.reactiveState.activeRouteModifiers.push(modifier);
    return modifier;
  }

  getActiveRouteModifiers(runState: RunState, duration?: RouteRuntimeModifier['duration']): RouteRuntimeModifier[] {
    return runState.reactiveState.activeRouteModifiers.filter((modifier) =>
      !modifier.consumed &&
      (!duration || modifier.duration === duration) &&
      (modifier.duration === 'run' || modifier.stage === undefined || modifier.stage === runState.stage)
    );
  }

  consumeRouteModifier(runState: RunState, modifierId: string): void {
    runState.reactiveState.activeRouteModifiers = runState.reactiveState.activeRouteModifiers.map((modifier) =>
      modifier.modifierId === modifierId ? { ...modifier, consumed: true } : modifier
    );
  }

  private applyRiskHazard(runState: RunState, hazardId: string, severityOverride?: RouteRiskConfig['increaseHazardSeverity']): string {
    const severity = severityOverride ?? 'moderate';
    if (hazardId.includes('speed')) {
      this.queueRiskHazard(runState, 'speed_wave', hazardId, severity);
      return 'Route risk: Speed Wave warning queued with counterplay.';
    }
    if (hazardId.includes('sticky')) {
      this.queueRiskHazard(runState, 'incoming_junk', hazardId, severity, 2, 'block_sticky');
      return 'Route risk: sticky pressure enters the warning tray.';
    }
    if (hazardId.includes('machine') || hazardId.includes('junk')) {
      this.queueRiskHazard(runState, 'incoming_junk', hazardId, severity, 3, 'block_crumb_junk');
      return 'Route risk: machine junk enters the warning tray.';
    }
    if (hazardId.includes('freeze')) {
      this.queueRiskHazard(runState, 'freeze', hazardId, severity);
      return 'Route risk: Freeze warning queued with Hot Cocoa counterplay.';
    }
    if (hazardId.includes('preview')) {
      this.queueRiskHazard(runState, 'preview', hazardId, severity);
      return 'Route risk: Preview warning queued with glasses counterplay.';
    }
    if (hazardId.includes('sleep')) {
      this.queueRiskHazard(runState, 'sleep', hazardId, severity);
      return 'Route risk: Sleepy warning queued with Alarm Cookie counterplay.';
    }
    if (hazardId.includes('royal')) {
      this.queueRiskHazard(runState, 'royal_pattern', hazardId, 'boss', 3);
      return 'Route risk: extra royal pattern warning queued.';
    }
    return `Route risk: ${hazardId}.`;
  }

  private queueRiskHazard(
    runState: RunState,
    kind: RunState['activeHazards'][number]['kind'],
    sourceId: string,
    severity: HazardSeverity,
    amount?: number,
    blockId?: string
  ): void {
    if (runState.activeHazards.length >= (runState.stage <= 2 ? 1 : 2)) {
      runState.eventLog.unshift('Route risk waited because another hazard warning was already active.');
      return;
    }
    const templates: Record<RunState['activeHazards'][number]['kind'], Omit<RunState['activeHazards'][number], 'instanceId' | 'kind' | 'remainingPieces'>> = {
      incoming_junk: {
        hazardId: 'hazard_incoming_junk_queue',
        name: 'Route Junk Tray',
        warningText: 'A risky route choice has lined up extra junk in the snack tray.',
        counterTags: ['counter_incoming_junk', 'counter_junk'],
        counterWindowPieces: 3,
        severity,
        defaultFailureEffect: 'Remaining route junk drops onto safe random columns.',
        itemCounterHints: ['Snack Shield', 'Trash Lid', 'Return Stamp'],
        spellCounterHints: ['Bomb Rune', 'Clean Cut'],
        cascadeCounterHint: 'Trigger a cascade to reduce incoming junk.',
        amount: amount ?? 2,
        sourceId,
        blockId: blockId ?? 'block_crumb_junk'
      },
      floating_block: {
        hazardId: 'hazard_floaty_rune',
        name: 'Route Floaty Rune',
        warningText: 'A risky route sparkle is wobbling overhead.',
        counterTags: ['counter_float'],
        counterWindowPieces: 3,
        severity,
        defaultFailureEffect: 'Drops as cloud junk.',
        itemCounterHints: ['Cloud Pin', 'Balloon Pop'],
        spellCounterHints: ['Bomb Rune']
      },
      freeze: {
        hazardId: 'hazard_freeze_warning',
        name: 'Route Freeze Warning',
        warningText: 'A risky route chill gathers around the active block.',
        counterTags: ['counter_freeze'],
        counterWindowPieces: 2,
        severity,
        defaultFailureEffect: 'Fall speed nudges upward.',
        itemCounterHints: ['Hot Cocoa'],
        spellCounterHints: ['Frost Lock']
      },
      preview: {
        hazardId: 'hazard_preview_hidden',
        name: 'Route Preview Glitter',
        warningText: 'Risky sparkle is drifting toward the Next and Hold windows.',
        counterTags: ['counter_preview'],
        counterWindowPieces: 3,
        severity,
        defaultFailureEffect: 'Preview hides briefly.',
        itemCounterHints: ['Preview Glasses'],
        spellCounterHints: []
      },
      low_ceiling: {
        hazardId: 'hazard_low_ceiling',
        name: 'Route Low Ceiling',
        warningText: 'A risky route banner is lowering toward the board.',
        counterTags: ['counter_low_ceiling', 'counter_board_size'],
        counterWindowPieces: 5,
        severity,
        defaultFailureEffect: 'Top row pressure clears safely.',
        itemCounterHints: ['Tent Pole', 'Safety Net'],
        spellCounterHints: ['Clean Cut']
      },
      bad_piece: {
        hazardId: 'hazard_bad_piece_delivery',
        name: 'Route Weird Delivery',
        warningText: 'A risky route shortcut is nudging a weird piece into the queue.',
        counterTags: ['counter_piece_queue'],
        counterWindowPieces: 2,
        severity,
        defaultFailureEffect: 'Awkward piece enters Next.',
        itemCounterHints: ['Nope Stamp', 'Queue Comb'],
        spellCounterHints: []
      },
      sleep: {
        hazardId: 'hazard_sleep_warning',
        name: 'Route Sleepy Tune',
        warningText: 'A risky route lullaby is drifting through the room.',
        counterTags: ['counter_sleep'],
        counterWindowPieces: 3,
        severity,
        defaultFailureEffect: 'Sleepy pressure lands softly.',
        itemCounterHints: ['Alarm Cookie'],
        spellCounterHints: []
      },
      speed_wave: {
        hazardId: 'hazard_speed_wave',
        name: 'Route Speed Wave',
        warningText: 'A risky route burst makes the floor wobble faster.',
        counterTags: ['counter_speed'],
        counterWindowPieces: 4,
        severity,
        defaultFailureEffect: 'Fall speed rises slightly.',
        itemCounterHints: ['Speed Brake'],
        spellCounterHints: ['Frost Lock']
      },
      royal_pattern: {
        hazardId: 'hazard_royal_pattern',
        name: 'Route Royal Pattern',
        warningText: 'The risky route has made the palace extra square.',
        counterTags: ['counter_royal', 'counter_pattern'],
        counterWindowPieces: 3,
        severity: 'boss',
        defaultFailureEffect: 'Royal blocks appear with extra ceremony.',
        itemCounterHints: ['Royal Eraser', 'Snack Vacuum'],
        spellCounterHints: ['Bomb Rune', 'Clean Cut'],
        amount: amount ?? 3,
        sourceId
      }
    };
    const template = templates[kind];
    runState.activeHazards.push({
      ...template,
      instanceId: `${template.hazardId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      kind,
      remainingPieces: template.counterWindowPieces
    });
  }

  private incrementLane(progress: HeroRouteProgress, lane: RouteChoiceLane): void {
    if (lane === 'practical') {
      progress.practicalScore += 1;
    } else if (lane === 'true') {
      progress.trueScore += 1;
    } else {
      progress.riskyScore += 1;
    }
  }

  private hasUncompletedEventNode(runState: RunState): boolean {
    return runState.map.some((node) => node.roomType === 'event' && !node.completed && node.id !== runState.currentNodeId);
  }

  private findEnding(heroId: string, kind: RouteEndingContent['kind']): RouteEndingContent {
    return this.endings.find((ending) => ending.heroId === heroId && ending.kind === kind)
      ?? this.endings.find((ending) => ending.kind === kind)
      ?? {
        id: `ending_fallback_${kind}`,
        heroId,
        kind,
        title: kind === 'true' ? 'True Festival Ending' : 'Festival Saved',
        panels: ['The festival settles into a safe fallback ending.'],
        lines: [{ speakerId: 'narrator', text: 'The route ending was missing, so the festival celebrates safely.' }]
      };
  }

  private loadScenes(): RouteSceneContent[] {
    const scenes = Object.values(sceneModules).flatMap((module) => {
      const bundle = module as RouteSceneBundle | RouteSceneContent[];
      if (Array.isArray(bundle)) {
        return bundle;
      }
      return Array.isArray(bundle.scenes) ? bundle.scenes : [];
    });
    return scenes.length ? scenes : [FALLBACK_SCENE];
  }

  private loadEndings(): RouteEndingContent[] {
    return Object.values(endingModules).flatMap((module) => {
      const bundle = module as RouteEndingBundle;
      return Array.isArray(bundle.endings) ? bundle.endings : [];
    });
  }

  private loadRouteBarks(): Record<string, string[]> {
    const bundle = Object.values(routeBarkModules)[0] as RouteBarksBundle | undefined;
    return bundle?.barks ?? {};
  }

  private loadRouteVoiceTags(): Record<string, string[]> {
    const bundle = Object.values(routeVoiceTagModules)[0] as RouteVoiceTagsBundle | undefined;
    return bundle?.voiceTags ?? {};
  }

  private validateContent(): string[] {
    const warnings: string[] = [];
    const sceneIds = new Set<string>();
    const triggerIds = new Set<string>();
    const labelsByHero = new Map<string, Set<string>>();
    for (const scene of this.scenes) {
      if (sceneIds.has(scene.id)) warnings.push(`Duplicate route scene id: ${scene.id}`);
      sceneIds.add(scene.id);
      if (triggerIds.has(scene.triggerId)) warnings.push(`Duplicate route trigger id: ${scene.triggerId}`);
      triggerIds.add(scene.triggerId);
      if (!HERO_IDS.includes(scene.heroId)) warnings.push(`Unknown route hero id: ${scene.heroId}`);
      if (!STAGE_IDS.includes(scene.stageId)) warnings.push(`Unknown route stage id: ${scene.stageId}`);
      if (scene.choices.length !== 3) warnings.push(`${scene.id} must have exactly 3 choices.`);
      if (!scene.choices.some((choice) => choice.lane === 'true' && typeof choice.grantFlag === 'string')) {
        warnings.push(`${scene.id} true choice must grant exactly one true flag.`);
      }
      const labels = labelsByHero.get(scene.heroId) ?? new Set<string>();
      for (const choice of scene.choices) {
        if (labels.has(choice.label)) warnings.push(`Repeated route choice label for ${scene.heroId}: ${choice.label}`);
        labels.add(choice.label);
        if (!choice.rewardConfig?.rewardId) warnings.push(`${scene.id}/${choice.id} missing reward config.`);
      }
      labelsByHero.set(scene.heroId, labels);
    }
    for (const heroId of HERO_IDS) {
      const count = this.scenes.filter((scene) => scene.heroId === heroId).length;
      if (count !== 6) warnings.push(`${heroId} has ${count} route scenes; expected 6.`);
    }
    if (warnings.length > 0) {
      console.warn('[RouteStorySystem] Route content validation warnings:', warnings);
    }
    return warnings;
  }
}
