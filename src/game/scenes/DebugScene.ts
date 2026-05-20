import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { createDefaultBoardState } from '../data/constants';
import { ANIMATION_DEFINITIONS, getAnimationFrameKeys, type AnimationCategory, type AnimationSequenceDefinition } from '../data/animations';
import { contentRegistry } from '../systems/ContentRegistry';
import type { ActiveHazardKind, ActiveHazardState, BoardCell, EnemyInstance, RewardDefinition, RoomType } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { BOARD_COLS, BOARD_ROWS, COLORS, MAX_EVENT_LOG, TETROMINO_COLORS, TETROMINO_SHAPES } from '../utils/constants';

type MonsterEntry = {
  id: string;
  name: string;
  role?: string;
  rarity?: string;
  stats: {
    hp: number;
    attack: number;
    armor?: number;
    attackIntervalLocks: number;
  };
  intent: {
    label: string;
  };
  behaviors: string[];
};

type StageEntry = {
  id: string;
  name: string;
  monsterPool?: string[];
  bossId?: string;
};

type AnimationAuditFilter = 'all' | 'missing' | AnimationCategory;
type AnimationStageScope = '__all' | '__shared' | '__legacy' | string;
type MonsterStageScope = string | null | '__legacy';

type AnimationAuditEntry = {
  definition: AnimationSequenceDefinition;
  loadedFrameCount: number;
  isComplete: boolean;
};

const DEBUG_FONT_FAMILY = '"Segoe UI", Arial, sans-serif';

export class DebugScene extends Phaser.Scene {
  private statusText?: Phaser.GameObjects.Text;
  private selectionOverlay?: Phaser.GameObjects.Container;
  private itemIndex = 0;
  private relicIndex = 0;
  private upgradeIndex = 0;
  private monsterIndex = 0;

  constructor() {
    super('DebugScene');
  }

  create(): void {
    if (!import.meta.env.DEV) {
      this.scene.start('MainMenuScene');
      return;
    }

    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const centerY = height / 2;
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(centerX, centerY, width - 48, height - 48, COLORS.panel, 0.96).setStrokeStyle(2, COLORS.gold, 0.45);
    this.add.text(centerX, 52, 'QA Debug Tools', {
      color: '#ffca6b',
      fontFamily: DEBUG_FONT_FAMILY,
      fontSize: '38px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, 94, 'Dev-only tools for run setup, rewards, saves, and combat smoke tests.', {
      color: '#d8deff',
      fontFamily: DEBUG_FONT_FAMILY,
      fontSize: '20px',
      align: 'center',
      wordWrap: { width: width - 96 }
    }).setOrigin(0.5);

    this.statusText = this.add.text(64, 132, '', {
      color: '#f6f7ff',
      fontFamily: DEBUG_FONT_FAMILY,
      fontSize: '20px',
      lineSpacing: 5,
      wordWrap: { width: width - 128 }
    });

    this.createButtonGrid();
    this.updateStatus('Debug tools ready.');
  }

  private get gameState(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private createButtonGrid(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const sidePadding = Math.max(26, Math.floor(width * 0.07));
    const columnGap = Math.max(16, Math.floor(width * 0.03));
    const twoColButtonWidth = Math.floor((width - sidePadding * 2 - columnGap) / 2);
    const leftX = sidePadding + twoColButtonWidth / 2;
    const rightX = leftX + twoColButtonWidth + columnGap;
    const rows: Array<[string, () => void, string, () => void]> = [
      ['Give 100 Gold', () => this.giveGold(), 'Give Item', () => this.giveItem()],
      ['Give Relic', () => this.giveReward('relic'), 'Give Upgrade', () => this.giveReward('upgrade')],
      ['Spawn Monster', () => this.openMonsterCategoryPicker(), 'Trigger Boss', () => this.triggerBoss()],
      ['Force Reward', () => this.forceReward(), 'Force Cascade Test', () => this.forceCascadeTest()],
      ['Queue Junk', () => this.queueDebugHazard('incoming_junk'), 'Floaty Block', () => this.queueDebugHazard('floating_block')],
      ['Freeze Warning', () => this.queueDebugHazard('freeze'), 'Low Ceiling', () => this.queueDebugHazard('low_ceiling')],
      ['Bad Piece', () => this.queueDebugHazard('bad_piece'), 'Speed Wave', () => this.queueDebugHazard('speed_wave')],
      ['Royal Pattern', () => this.queueDebugHazard('royal_pattern'), 'Sleepy Tune', () => this.queueDebugHazard('sleep')],
      ['Give Reactive Item', () => this.giveReactiveItem(), 'Give Catalyst Item', () => this.giveCatalystItem()],
      ['Apply Route Reward', () => this.applyDebugRouteReward(false), 'Apply Route Risk', () => this.applyDebugRouteReward(true)],
      ['Clear Hazards', () => this.clearHazards(), 'Preview Glitter', () => this.queueDebugHazard('preview')],
      ['Clear Run Save', () => this.clearRunSave(), 'New Debug Run', () => this.newDebugRun()]
    ];

    const animationButtonHeight = 56;
    const animationButtonY = Math.ceil(this.statusText?.getBounds().bottom ?? 260) + 36;
    new Button(this, centerX, animationButtonY, width - sidePadding * 2, animationButtonHeight, 'Animation QA (Category + Stage)', () => this.openAnimationCategoryPicker(), { fontSize: '22px', fontFamily: DEBUG_FONT_FAMILY });

    const footerButtonHeight = 56;
    const footerY = height - 24 - Math.floor(footerButtonHeight / 2);
    const stageButtonHeight = 52;
    const stageButtonY = footerY - Math.floor(footerButtonHeight / 2) - 18 - Math.floor(stageButtonHeight / 2);
    const stageTitleY = stageButtonY - Math.floor(stageButtonHeight / 2) - 16;

    const rowsTop = animationButtonY + Math.floor(animationButtonHeight / 2) + 16;
    const rowsBottom = stageTitleY - 16;
    const minGap = 7;
    const maxButtonHeight = 56;
    const minButtonHeight = 38;
    let rowButtonHeight = maxButtonHeight;
    let rowGap = 12;
    const rowCount = rows.length;
    const requiredAtMax = rowCount * maxButtonHeight + (rowCount - 1) * minGap;
    const availableRowsHeight = rowsBottom - rowsTop;
    if (availableRowsHeight < requiredAtMax) {
      rowButtonHeight = Math.max(minButtonHeight, Math.floor((availableRowsHeight - (rowCount - 1) * minGap) / rowCount));
      rowGap = minGap;
    } else {
      rowGap = Math.min(14, Math.floor((availableRowsHeight - rowCount * rowButtonHeight) / Math.max(1, rowCount - 1)));
    }

    rows.forEach((row, index) => {
      const y = rowsTop + Math.floor(rowButtonHeight / 2) + index * (rowButtonHeight + rowGap);
      new Button(this, leftX, y, twoColButtonWidth, rowButtonHeight, row[0], row[1], { fontSize: rowButtonHeight <= 44 ? '18px' : '22px', fontFamily: DEBUG_FONT_FAMILY });
      new Button(this, rightX, y, twoColButtonWidth, rowButtonHeight, row[2], row[3], { fontSize: rowButtonHeight <= 44 ? '18px' : '22px', fontFamily: DEBUG_FONT_FAMILY });
    });

    this.add.text(centerX, stageTitleY, 'Jump To Stage', {
      color: '#ffca6b',
      fontFamily: DEBUG_FONT_FAMILY,
      fontSize: '28px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const stageCount = this.gameState.stageSystem.getStageCount();
    const stageGap = Math.max(8, Math.floor(width * 0.016));
    const stageButtonWidth = Math.max(44, Math.min(84, Math.floor((width - sidePadding * 2 - stageGap * (stageCount - 1)) / stageCount)));
    const stageTotalWidth = stageCount * stageButtonWidth + (stageCount - 1) * stageGap;
    const stageStartX = centerX - stageTotalWidth / 2 + stageButtonWidth / 2;
    for (let stage = 1; stage <= stageCount; stage += 1) {
      const x = stageStartX + (stage - 1) * (stageButtonWidth + stageGap);
      new Button(this, x, stageButtonY, stageButtonWidth, stageButtonHeight, `${stage}`, () => this.jumpToStage(stage), { fontSize: '26px', fontFamily: DEBUG_FONT_FAMILY });
    }

    const footerButtonWidth = Math.floor((width - sidePadding * 2 - columnGap) / 2);
    new Button(this, leftX, footerY, footerButtonWidth, footerButtonHeight, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });
    new Button(this, rightX, footerY, footerButtonWidth, footerButtonHeight, 'Open Map', () => {
      this.gameState.runState.runStatus = 'map';
      this.gameState.saveRun();
      this.scene.start('MapScene');
    });
  }

  private giveGold(): void {
    const state = this.ensureRun();
    state.player.gold += 100;
    state.player.totalGoldCollected += 100;
    state.gold = state.player.gold;
    this.saveAndReport('Added 100 gold.');
  }

  private giveItem(): void {
    const state = this.ensureRun();
    const items = contentRegistry.listEnabled<{ id: string; name?: string }>('item');
    const item = this.nextEntry(items, 'item');
    if (!item) {
      this.updateStatus('No enabled item content found.');
      return;
    }
    this.gameState.inventorySystem.addItem(state, item.id);
    this.itemIndex += 1;
    this.saveAndReport(`Added item: ${item.name ?? item.id}.`);
  }

  private giveReward(contentType: 'relic' | 'upgrade'): void {
    const pool = this.gameState.rewardSystem.getRewardPool();
    const rewards = pool.filter((reward) => reward.contentType === contentType);
    const reward = rewards[this.getRewardIndex(contentType) % Math.max(1, rewards.length)];
    if (!reward) {
      this.updateStatus(`No enabled ${contentType} rewards found.`);
      return;
    }

    const message = this.gameState.rewardSystem.applyReward(this.ensureRun(), reward.id);
    this.incrementRewardIndex(contentType);
    this.saveAndReport(message);
  }

  private spawnMonster(roomType: RoomType): void {
    const monster = this.nextMonster(roomType);
    if (!monster) {
      this.updateStatus(`No enabled ${roomType} monster content found.`);
      return;
    }

    const state = this.ensureRun();
    state.currentRoomType = roomType;
    state.currentRoomProgress = 'entered';
    state.activeEnemy = this.spawnById(monster.id, roomType);
    state.lastBattleWasBoss = roomType === 'boss';
    state.runStatus = 'battle';
    this.pushLog(`${state.activeEnemy?.name ?? monster.id} spawned by QA debug.`);
    this.gameState.saveRun();
    this.scene.start('BattleScene');
  }

  private triggerBoss(): void {
    this.spawnMonster('boss');
  }

  private openMonsterCategoryPicker(): void {
    const categories: Array<{ id: RoomType; label: string }> = [
      { id: 'fight', label: 'Monster' },
      { id: 'elite', label: 'Elite' },
      { id: 'boss', label: 'Boss' }
    ];

    this.showSelectionOverlay(
      'Select Monster Category',
      categories.map((category) => ({
        id: category.id,
        label: category.label
      })),
      (categoryId) => this.openMonsterStagePicker(categoryId as RoomType)
    );
  }

  private openMonsterStagePicker(roomType: RoomType): void {
    const stages = this.getStageEntries();
    const allAssignedCount = this.listMonstersByRoomType(roomType, null).length;
    const legacyCount = this.listMonstersByRoomType(roomType, '__legacy').length;
    const entries: Array<{ id: string; label: string }> = [{ id: '__all', label: `All Stage-Assigned (${allAssignedCount})` }];
    for (const stage of stages) {
      const count = this.listMonstersByRoomType(roomType, stage.id).length;
      entries.push({
        id: stage.id,
        label: `Stage ${this.getStageNumber(stage.id)} · ${stage.name} (${count})`
      });
    }

    if (legacyCount > 0) {
      entries.push({ id: '__legacy', label: `Legacy / Unassigned (${legacyCount})` });
    }

    this.showSelectionOverlay(
      'Select Stage',
      entries,
      (stageId) => this.openMonsterListPicker(roomType, stageId === '__all' ? null : stageId === '__legacy' ? '__legacy' : stageId),
      () => this.openMonsterCategoryPicker()
    );
  }

  private openAnimationCategoryPicker(): void {
    const allEntries = this.getAnimationAuditEntries('all');
    const total = allEntries.length;
    const missing = allEntries.filter((entry) => !entry.isComplete).length;
    const categories = [...new Set(ANIMATION_DEFINITIONS.map((definition) => definition.category))].sort();

    const options: Array<{ id: string; label: string }> = [
      { id: '__all', label: `All (${total})` },
      { id: '__missing', label: `Missing Frames (${missing})` },
      ...categories.map((category) => {
        const categoryEntries = this.getAnimationAuditEntries(category);
        const categoryMissing = categoryEntries.filter((entry) => !entry.isComplete).length;
        return { id: `cat:${category}`, label: `${category} (${categoryEntries.length}) · missing ${categoryMissing}` };
      })
    ];

    this.showSelectionOverlay('Animation QA Categories', options, (selectedId) => {
      if (selectedId === '__all') {
        this.openAnimationStagePicker('all');
        return;
      }
      if (selectedId === '__missing') {
        this.openAnimationStagePicker('missing');
        return;
      }
      if (selectedId.startsWith('cat:')) {
        this.openAnimationStagePicker(selectedId.replace(/^cat:/, '') as AnimationCategory);
      }
    });
  }

  private openAnimationStagePicker(filter: AnimationAuditFilter): void {
    const scopes = this.getAnimationStageScopes(filter);
    if (scopes.length === 1 && scopes[0].id === '__all') {
      this.openAnimationListPicker(filter, '__all');
      return;
    }

    this.showSelectionOverlay(
      'Animation QA Scope',
      scopes.map((scope) => ({ id: scope.id, label: `${scope.label} (${scope.count})` })),
      (scopeId) => this.openAnimationListPicker(filter, scopeId as AnimationStageScope),
      () => this.openAnimationCategoryPicker()
    );
  }

  private openAnimationListPicker(filter: AnimationAuditFilter, scope: AnimationStageScope): void {
    const entries = this.getAnimationAuditEntries(filter, scope);
    if (entries.length === 0) {
      this.clearSelectionOverlay();
      this.updateStatus('No animation entries found for this filter.');
      return;
    }

    const title = filter === 'all'
      ? 'Animation QA: All'
      : filter === 'missing'
        ? 'Animation QA: Missing Frames'
        : `Animation QA: ${filter}`;

    this.showSelectionOverlay(
      `${title} · ${this.getAnimationScopeLabel(scope)}`,
      entries.map((entry) => {
        const definition = entry.definition;
        const status = entry.isComplete ? 'OK' : `MISS ${entry.loadedFrameCount}/${definition.frameCount}`;
        return {
          id: definition.id,
          label: `[${definition.category}] ${definition.assetId} · ${definition.animationName} · ${status}`
        };
      }),
      (animationId) => this.openAnimationPreview(filter, scope, animationId),
      () => this.openAnimationStagePicker(filter)
    );
  }

  private openAnimationPreview(filter: AnimationAuditFilter, scope: AnimationStageScope, animationId: string): void {
    const entries = this.getAnimationAuditEntries(filter, scope);
    if (entries.length === 0) {
      this.openAnimationStagePicker(filter);
      return;
    }

    let index = Math.max(0, entries.findIndex((entry) => entry.definition.id === animationId));
    if (index < 0) {
      index = 0;
    }

    this.clearSelectionOverlay();

    const overlay = this.add.container(0, 0);
    const width = this.scale.width;
    const height = this.scale.height;

    const blocker = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.64).setInteractive();
    const panel = this.add.rectangle(width / 2, height / 2, width - 90, height - 140, COLORS.panel, 0.98).setStrokeStyle(2, COLORS.gold, 0.55);
    const title = this.add.text(width / 2, 94, 'Animation QA Preview', {
      color: '#ffca6b',
      fontFamily: DEBUG_FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    overlay.add([blocker, panel, title]);

    let previewSprite: Phaser.GameObjects.Sprite | undefined;
    let idText: Phaser.GameObjects.Text | undefined;
    let infoText: Phaser.GameObjects.Text | undefined;

    const renderCurrent = (): void => {
      previewSprite?.destroy();
      idText?.destroy();
      infoText?.destroy();

      const entry = entries[index];
      const definition = entry.definition;
      const availableKeys = this.gameState.assetSystem.getAvailableAnimationFrameKeys(this, definition.id);
      const loadedKeys = this.gameState.assetSystem.getLoadedAnimationFrameKeys(this, definition.id);
      const expectedKeys = getAnimationFrameKeys(definition.id);
      const loadedSet = new Set(availableKeys);
      const missingKeys = expectedKeys.filter((key) => !loadedSet.has(key));

      previewSprite = this.add.sprite(width / 2, height / 2 - 64, this.gameState.assetSystem.fallbackFor('sprite'));
      this.gameState.assetSystem.fitSpriteToBox(previewSprite, Math.min(420, width - 180), 260);

      if (availableKeys.length > 0) {
        previewSprite.setTexture(availableKeys[0]);
      }
      if (entry.isComplete) {
        this.gameState.assetSystem.playAnimationSafe(previewSprite, definition.id);
      }

      const status = entry.isComplete ? 'PASS' : 'FAIL';
      const statusColor = entry.isComplete ? '#65d6a5' : '#ff6673';
      idText = this.add.text(width / 2, 142, `${index + 1}/${entries.length} · ${definition.id}`, {
        color: '#f6f7ff',
        fontFamily: DEBUG_FONT_FAMILY,
        fontSize: '22px',
        align: 'center',
        wordWrap: { width: width - 140 }
      }).setOrigin(0.5, 0);

      const missingPreview = missingKeys.length > 0
        ? missingKeys.slice(0, 4).join(', ') + (missingKeys.length > 4 ? ` (+${missingKeys.length - 4})` : '')
        : 'none';

      infoText = this.add.text(width / 2, height - 312, [
        `Status: ${status}`,
        `Category: ${definition.category}`,
        `Asset: ${definition.assetId}`,
        `Animation: ${definition.animationName}`,
        `Frames available: ${availableKeys.length}/${definition.frameCount}`,
        `Frames animation-ready: ${loadedKeys.length}/${definition.frameCount}`,
        `Missing keys: ${missingPreview}`
      ].join('\n'), {
        color: '#d8deff',
        fontFamily: DEBUG_FONT_FAMILY,
        fontSize: '22px',
        align: 'center',
        lineSpacing: 5,
        wordWrap: { width: width - 170 }
      }).setOrigin(0.5, 0);
      infoText.setTint(Phaser.Display.Color.HexStringToColor(statusColor).color);

      if (previewSprite) {
        overlay.add(previewSprite);
      }
      if (idText) {
        overlay.add(idText);
      }
      if (infoText) {
        overlay.add(infoText);
      }
    };

    const prevButton = new Button(this, width / 2 - 210, height - 96, 160, 56, 'Prev', () => {
      index = (index - 1 + entries.length) % entries.length;
      renderCurrent();
    }, { fontFamily: DEBUG_FONT_FAMILY });
    const nextButton = new Button(this, width / 2 - 20, height - 96, 160, 56, 'Next', () => {
      index = (index + 1) % entries.length;
      renderCurrent();
    }, { fontFamily: DEBUG_FONT_FAMILY });
    const backButton = new Button(this, width / 2 + 170, height - 96, 220, 56, 'Back To List', () => {
      this.openAnimationListPicker(filter, scope);
    }, { fontFamily: DEBUG_FONT_FAMILY });

    overlay.add([prevButton, nextButton, backButton]);

    renderCurrent();
    this.selectionOverlay = overlay;
  }

  private getAnimationAuditEntries(filter: AnimationAuditFilter, scope: AnimationStageScope = '__all'): AnimationAuditEntry[] {
    const all = ANIMATION_DEFINITIONS.map((definition) => {
      const loadedFrameCount = this.gameState.assetSystem.getAvailableAnimationFrameKeys(this, definition.id).length;
      return {
        definition,
        loadedFrameCount,
        isComplete: loadedFrameCount === definition.frameCount
      };
    });

    const filtered = filter === 'all'
      ? all
      : filter === 'missing'
        ? all.filter((entry) => !entry.isComplete)
        : all.filter((entry) => entry.definition.category === filter);

    const scoped = scope === '__all'
      ? filtered
      : filtered.filter((entry) => this.getAnimationEntryScopes(entry.definition).has(scope));

    return scoped.sort((left, right) => {
      if (left.isComplete !== right.isComplete) {
        return left.isComplete ? 1 : -1;
      }
      const categoryOrder = left.definition.category.localeCompare(right.definition.category);
      if (categoryOrder !== 0) {
        return categoryOrder;
      }
      return left.definition.id.localeCompare(right.definition.id);
    });
  }

  private openMonsterListPicker(roomType: RoomType, stageId: MonsterStageScope): void {
    const monsters = this.listMonstersByRoomType(roomType, stageId).sort((a, b) => a.name.localeCompare(b.name));
    if (monsters.length === 0) {
      this.clearSelectionOverlay();
      this.updateStatus(`No enabled ${roomType} monster content found${stageId ? ` for ${this.getMonsterScopeLabel(stageId)}` : ''}.`);
      return;
    }

    const titleMap: Record<'fight' | 'elite' | 'boss', string> = {
      fight: 'Select Monster',
      elite: 'Select Elite',
      boss: 'Select Boss'
    };
    const baseTitle = roomType === 'elite' || roomType === 'boss' ? titleMap[roomType] : titleMap.fight;
    const titleLabel = stageId ? `${baseTitle} · ${this.getMonsterScopeLabel(stageId)}` : `${baseTitle} · All Stage-Assigned`;
    const title = stageId ? `${baseTitle} · ${this.getStageLabel(stageId)}` : `${baseTitle} · All Stages`;

    void title;
    this.showSelectionOverlay(
      titleLabel,
      monsters.map((monster) => ({ id: monster.id, label: monster.name })),
      (monsterId) => this.spawnMonsterById(roomType, monsterId),
      () => this.openMonsterStagePicker(roomType)
    );
  }

  private spawnMonsterById(roomType: RoomType, monsterId: string): void {
    this.clearSelectionOverlay();
    const state = this.ensureRun();
    const selectedMonster = contentRegistry.getOptionalById<MonsterEntry>('monster', monsterId);
    state.currentRoomType = roomType;
    state.currentRoomProgress = 'entered';
    state.activeEnemy = this.spawnById(monsterId, roomType);
    state.lastBattleWasBoss = roomType === 'boss';
    state.runStatus = 'battle';
    this.pushLog(`${state.activeEnemy?.name ?? selectedMonster?.name ?? monsterId} spawned by QA debug.`);
    this.gameState.saveRun();
    this.scene.start('BattleScene');
  }

  private forceReward(): void {
    const state = this.ensureRun();
    state.pendingRewardSource = 'debug';
    state.pendingRewards = this.gameState.rewardSystem.getRandomRewards(4, state, 'boss');
    state.runStatus = 'reward';
    state.currentRoomProgress = 'reward';
    this.pushLog('QA debug forced a reward choice.');
    this.gameState.saveRun();
    this.scene.start('RewardScene');
  }

  private forceCascadeTest(): void {
    const state = this.ensureRun();
    state.board = createDefaultBoardState();
    state.board.grid = this.createCascadeTestGrid();
    state.board.currentPiece = {
      type: 'O',
      matrix: TETROMINO_SHAPES.O.map((row) => [...row]),
      color: TETROMINO_COLORS.O,
      x: 4,
      y: 0
    };
    state.board.activePieceType = 'O';
    state.board.nextPieceType = 'I';
    state.currentRoomType = 'fight';
    state.currentRoomProgress = 'entered';
    state.activeEnemy = this.gameState.enemySystem.spawnEnemy('fight', state.stage);
    state.runStatus = 'battle';
    this.pushLog('QA cascade board loaded. Hard drop once to trigger a cascade.');
    this.gameState.saveRun();
    this.scene.start('BattleScene');
  }

  private queueDebugHazard(kind: ActiveHazardKind): void {
    const state = this.ensureRun();
    state.currentRoomType = 'fight';
    state.currentRoomProgress = 'entered';
    state.activeEnemy = state.activeEnemy ?? this.gameState.enemySystem.spawnEnemy('fight', state.stage);
    state.runStatus = 'battle';
    state.activeHazards.push(this.createDebugHazard(kind));
    this.pushLog(`QA debug queued ${kind.replace(/_/g, ' ')}.`);
    this.gameState.saveRun();
    this.scene.start('BattleScene');
  }

  private giveReactiveItem(): void {
    const state = this.ensureRun();
    const itemIds = [
      'item_snack_vacuum',
      'item_cloud_pin',
      'item_snack_shield',
      'item_return_stamp',
      'item_preview_glasses',
      'item_hot_cocoa',
      'item_speed_brake',
      'item_tent_pole',
      'item_safety_net',
      'item_trash_lid',
      'item_queue_comb',
      'item_nope_stamp',
      'item_alarm_cookie',
      'item_royal_eraser',
      'item_firecracker_sugar',
      'item_spell_coupon'
    ];
    const itemId = itemIds[this.itemIndex % itemIds.length];
    this.gameState.inventorySystem.addItem(state, itemId);
    this.itemIndex += 1;
    this.saveAndReport(`Added reactive item: ${itemId}.`);
  }

  private giveCatalystItem(): void {
    const state = this.ensureRun();
    const itemIds = [
      'item_firecracker_sugar',
      'item_frosting_salt',
      'item_bomb_fuse',
      'item_star_syrup',
      'item_cascade_confetti',
      'item_spell_coupon',
      'item_cleaning_charm'
    ];
    const itemId = itemIds[this.itemIndex % itemIds.length];
    this.gameState.inventorySystem.addItem(state, itemId);
    this.itemIndex += 1;
    this.saveAndReport(`Added spell catalyst item: ${itemId}.`);
  }

  private applyDebugRouteReward(risky: boolean): void {
    const state = this.ensureRun();
    const message = this.gameState.routeStorySystem.applyRouteReward(state, {
      rewardId: risky ? 'debug_route_risky_fever' : 'debug_route_safe_preview',
      rewardType: 'battle_modifier',
      modifierId: risky ? 'route_fever' : 'extra_preview',
      amount: risky ? 20 : 3,
      duration: risky ? 'stage' : 'next_battle'
    });
    if (risky) {
      this.gameState.routeStorySystem.applyRouteRisk({
        addHazardId: 'hazard_machine_junk_route',
        increaseHazardSeverity: 'moderate',
        rewardTier: 'stage'
      }, state).forEach((entry) => this.pushLog(entry));
    }
    this.saveAndReport(message);
  }

  private clearHazards(): void {
    const state = this.ensureRun();
    state.activeHazards = [];
    state.reactiveState.nextSpellModifiers = [];
    state.reactiveState.cleanupCouponPieces = 0;
    state.reactiveState.nopeStampPieces = 0;
    state.reactiveState.sleepGuardPieces = 0;
    this.saveAndReport('Cleared all active hazards and temporary reactive warnings.');
  }

  private clearRunSave(): void {
    this.gameState.clearSave();
    this.gameState.runState = this.gameState.newRun();
    this.updateStatus('Run save cleared and a fresh debug run was created.');
  }

  private newDebugRun(): void {
    this.gameState.newRun();
    this.updateStatus('Fresh debug run created.');
  }

  private jumpToStage(stage: number): void {
    const state = this.ensureRun();
    state.stage = Math.max(1, Math.min(stage, this.gameState.stageSystem.getStageCount()));
    state.map = this.gameState.mapSystem.createMap();
    state.currentNodeId = 'start';
    state.currentRoomType = 'start';
    state.currentRoomProgress = 'idle';
    state.activeEnemy = null;
    state.pendingRewards = [];
    state.runStatus = 'map';
    this.saveAndReport(`Jumped to Stage ${state.stage}.`);
  }

  private ensureRun() {
    if (!this.gameState.runState) {
      this.gameState.newRun();
    }
    return this.gameState.runState;
  }

  private saveAndReport(message: string): void {
    this.pushLog(message);
    this.gameState.saveRun();
    this.updateStatus(message);
  }

  private updateStatus(message: string): void {
    const state = this.gameState.runState;
    this.statusText?.setText([
      message,
      '',
      `Stage: ${state.stage}    Room: ${state.currentRoomType}    Status: ${state.runStatus}`,
      `HP: ${state.player.hp}/${state.player.maxHp}    Mana: ${state.player.mana}/${state.player.maxMana}    Gold: ${state.player.gold}`,
      `Inventory: ${state.inventory.length}/${state.player.inventoryCapacity}    Relics: ${state.relics.length}    Upgrades: ${state.upgrades.length}`,
      `Enemy: ${state.activeEnemy ? `${state.activeEnemy.name} (${state.activeEnemy.currentHp}/${state.activeEnemy.maxHp})` : 'None'}`,
      `Hazards: ${state.activeHazards.length ? state.activeHazards.map((hazard) => `${hazard.name}:${hazard.remainingPieces}`).join(', ') : 'None'}`
    ]);
  }

  private pushLog(message: string): void {
    const state = this.gameState.runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }

  private nextEntry<T>(entries: T[], _kind: 'item'): T | null {
    if (entries.length === 0) {
      return null;
    }
    return entries[this.itemIndex % entries.length];
  }

  private getRewardIndex(contentType: 'relic' | 'upgrade'): number {
    return contentType === 'relic' ? this.relicIndex : this.upgradeIndex;
  }

  private incrementRewardIndex(contentType: 'relic' | 'upgrade'): void {
    if (contentType === 'relic') {
      this.relicIndex += 1;
      return;
    }
    this.upgradeIndex += 1;
  }

  private nextMonster(roomType: RoomType): MonsterEntry | null {
    const stageId = this.getCurrentStageId();
    const monsters = this.listMonstersByRoomType(roomType, stageId);
    if (monsters.length === 0) {
      return null;
    }
    const monster = monsters[this.monsterIndex % monsters.length];
    this.monsterIndex += 1;
    return monster;
  }

  private listMonstersByRoomType(roomType: RoomType, stageId: MonsterStageScope = null): MonsterEntry[] {
    const stageMonsterIds = stageId === null
      ? this.getAssignedMonsterIdsForRoomType(roomType)
      : stageId === '__legacy'
        ? this.getLegacyMonsterIdsForRoomType(roomType)
        : this.getMonsterIdsForStage(roomType, stageId);
    return contentRegistry.listEnabled<MonsterEntry>('monster').filter((monster) => {
      const isBoss = monster.role === 'boss' || monster.rarity === 'boss';
      const isElite = monster.role === 'elite' || monster.rarity === 'elite';
      const matchesRoomType = roomType === 'boss'
        ? isBoss
        : roomType === 'elite'
          ? isElite
          : !isBoss && !isElite;
      if (!matchesRoomType) {
        return false;
      }
      return stageMonsterIds.has(monster.id);
    });
  }

  private getStageEntries(): StageEntry[] {
    return this.gameState.stageSystem.listStages() as StageEntry[];
  }

  private getCurrentStageId(): string | null {
    return this.gameState.stageSystem.getStageByIndex(this.gameState.runState.stage)?.id ?? null;
  }

  private getMonsterIdsForStage(roomType: RoomType, stageId: string): Set<string> {
    const stage = this.getStageEntries().find((entry) => entry.id === stageId);
    if (!stage) {
      return new Set<string>();
    }
    if (roomType === 'boss') {
      return new Set(stage.bossId ? [stage.bossId] : []);
    }
    const pool = new Set(stage.monsterPool ?? []);
    const eliteIds = new Set(contentRegistry.listEnabled<MonsterEntry>('monster')
      .filter((monster) => monster.role === 'elite' || monster.rarity === 'elite')
      .map((monster) => monster.id));
    const bossIds = new Set(contentRegistry.listEnabled<MonsterEntry>('monster')
      .filter((monster) => monster.role === 'boss' || monster.rarity === 'boss')
      .map((monster) => monster.id));
    if (roomType === 'elite') {
      return new Set([...pool].filter((id) => eliteIds.has(id)));
    }
    return new Set([...pool].filter((id) => !eliteIds.has(id) && !bossIds.has(id)));
  }

  private getAssignedMonsterIdsForRoomType(roomType: RoomType): Set<string> {
    const ids = new Set<string>();
    for (const stage of this.getStageEntries()) {
      for (const id of this.getMonsterIdsForStage(roomType, stage.id)) {
        ids.add(id);
      }
    }
    return ids;
  }

  private getLegacyMonsterIdsForRoomType(roomType: RoomType): Set<string> {
    const assigned = this.getAssignedMonsterIdsForRoomType(roomType);
    const legacyIds = contentRegistry.listEnabled<MonsterEntry>('monster')
      .filter((monster) => {
        const isBoss = monster.role === 'boss' || monster.rarity === 'boss';
        const isElite = monster.role === 'elite' || monster.rarity === 'elite';
        return roomType === 'boss'
          ? isBoss
          : roomType === 'elite'
            ? isElite
            : !isBoss && !isElite;
      })
      .map((monster) => monster.id)
      .filter((id) => !assigned.has(id));
    return new Set(legacyIds);
  }

  private getStageNumber(stageId: string): number {
    const index = this.getStageEntries().findIndex((entry) => entry.id === stageId);
    return index >= 0 ? index + 1 : 0;
  }

  private getStageLabel(stageId: string): string {
    const stage = this.getStageEntries().find((entry) => entry.id === stageId);
    if (!stage) {
      return stageId;
    }
    const stageNumber = this.getStageNumber(stageId);
    return stageNumber > 0 ? `Stage ${stageNumber} (${stage.name})` : stage.name;
  }

  private getMonsterScopeLabel(stageId: MonsterStageScope): string {
    if (stageId === '__legacy') {
      return 'Legacy / Unassigned';
    }
    if (stageId === null) {
      return 'All Stage-Assigned';
    }
    return this.getStageLabel(stageId);
  }

  private getAnimationStageScopes(filter: AnimationAuditFilter): Array<{ id: AnimationStageScope; label: string; count: number }> {
    const entries = this.getAnimationAuditEntries(filter, '__all');
    const scopeCounts = new Map<AnimationStageScope, number>();
    scopeCounts.set('__all', entries.length);
    for (const entry of entries) {
      for (const scope of this.getAnimationEntryScopes(entry.definition)) {
        scopeCounts.set(scope, (scopeCounts.get(scope) ?? 0) + 1);
      }
    }

    const scopes: Array<{ id: AnimationStageScope; label: string; count: number }> = [
      { id: '__all', label: 'All Assets', count: scopeCounts.get('__all') ?? 0 }
    ];
    for (const stage of this.getStageEntries()) {
      const count = scopeCounts.get(stage.id) ?? 0;
      if (count > 0) {
        scopes.push({ id: stage.id, label: this.getStageLabel(stage.id), count });
      }
    }
    if ((scopeCounts.get('__shared') ?? 0) > 0) {
      scopes.push({ id: '__shared', label: 'Shared / Global', count: scopeCounts.get('__shared') ?? 0 });
    }
    if ((scopeCounts.get('__legacy') ?? 0) > 0) {
      scopes.push({ id: '__legacy', label: 'Legacy / Unassigned', count: scopeCounts.get('__legacy') ?? 0 });
    }
    return scopes;
  }

  private getAnimationScopeLabel(scope: AnimationStageScope): string {
    if (scope === '__all') {
      return 'All Assets';
    }
    if (scope === '__shared') {
      return 'Shared / Global';
    }
    if (scope === '__legacy') {
      return 'Legacy / Unassigned';
    }
    return this.getStageLabel(scope);
  }

  private getAnimationEntryScopes(definition: AnimationSequenceDefinition): Set<AnimationStageScope> {
    if (definition.category === 'monster') {
      return this.getMonsterAnimationScopes(definition.assetId);
    }
    if (definition.category === 'boss') {
      return this.getBossAnimationScopes(definition.assetId);
    }
    return new Set<AnimationStageScope>(['__shared']);
  }

  private getMonsterAnimationScopes(monsterId: string): Set<AnimationStageScope> {
    const scopes = new Set<AnimationStageScope>();
    for (const stage of this.getStageEntries()) {
      if (stage.monsterPool?.includes(monsterId)) {
        scopes.add(stage.id);
      }
    }
    if (scopes.size === 0) {
      scopes.add('__legacy');
    }
    return scopes;
  }

  private getBossAnimationScopes(assetId: string): Set<AnimationStageScope> {
    const scopes = new Set<AnimationStageScope>();
    const bossMonsterId = assetId.startsWith('boss_') ? `mon_${assetId}` : assetId;
    for (const stage of this.getStageEntries()) {
      if (stage.bossId === bossMonsterId) {
        scopes.add(stage.id);
      }
    }
    if (scopes.size === 0) {
      scopes.add('__legacy');
    }
    return scopes;
  }

  private showSelectionOverlay(
    title: string,
    entries: Array<{ id: string; label: string }>,
    onSelect: (id: string) => void,
    onBack?: () => void
  ): void {
    this.clearSelectionOverlay();

    const overlay = this.add.container(0, 0);
    const width = this.scale.width;
    const height = this.scale.height;

    const blocker = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive();
    const panel = this.add.rectangle(width / 2, height / 2, width - 120, height - 200, COLORS.panel, 0.98).setStrokeStyle(2, COLORS.gold, 0.55);
    const titleText = this.add.text(width / 2, 120, title, {
      color: '#ffca6b',
      fontFamily: DEBUG_FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const staticObjects: Phaser.GameObjects.GameObject[] = [blocker, panel, titleText];
    const dynamicObjects: Phaser.GameObjects.GameObject[] = [];
    overlay.add(staticObjects);

    const buttonWidth = width - 240;
    const buttonHeight = 58;
    const gap = 12;
    const maxVisible = 10;
    let page = 0;
    const totalPages = Math.max(1, Math.ceil(entries.length / maxVisible));

    const renderPage = (): void => {
      dynamicObjects.splice(0).forEach((object) => object.destroy());

      const pageStart = page * maxVisible;
      const pageEntries = entries.slice(pageStart, pageStart + maxVisible);
      const startY = 200;
      pageEntries.forEach((entry, index) => {
        const y = startY + index * (buttonHeight + gap);
        const button = new Button(this, width / 2, y, buttonWidth, buttonHeight, entry.label, () => onSelect(entry.id), { fontSize: '22px', fontFamily: DEBUG_FONT_FAMILY });
        dynamicObjects.push(button);
        overlay.add(button);
      });

      const backLabel = onBack ? 'Back' : 'Close';
      const backButton = new Button(this, width / 2 - 170, height - 110, 220, 56, backLabel, () => {
        if (onBack) {
          onBack();
          return;
        }
        this.clearSelectionOverlay();
      }, { fontFamily: DEBUG_FONT_FAMILY });
      dynamicObjects.push(backButton);
      overlay.add(backButton);

      if (totalPages > 1) {
        const pageText = this.add.text(width / 2, height - 110, `${page + 1}/${totalPages}`, {
          color: '#f6f7ff',
          fontFamily: DEBUG_FONT_FAMILY,
          fontSize: '22px'
        }).setOrigin(0.5);
        dynamicObjects.push(pageText);
        overlay.add(pageText);

        const prevButton = new Button(this, width / 2 + 70, height - 110, 120, 56, 'Prev', () => {
          page = (page - 1 + totalPages) % totalPages;
          renderPage();
        }, { fontFamily: DEBUG_FONT_FAMILY });
        const nextButton = new Button(this, width / 2 + 210, height - 110, 120, 56, 'Next', () => {
          page = (page + 1) % totalPages;
          renderPage();
        }, { fontFamily: DEBUG_FONT_FAMILY });
        dynamicObjects.push(prevButton, nextButton);
        overlay.add([prevButton, nextButton]);
      }
    };

    renderPage();
    this.selectionOverlay = overlay;
  }

  private clearSelectionOverlay(): void {
    this.selectionOverlay?.destroy(true);
    this.selectionOverlay = undefined;
  }

  private spawnById(monsterId: string, roomType: RoomType): EnemyInstance | null {
    const monster = contentRegistry.getOptionalById<MonsterEntry>('monster', monsterId);
    if (!monster) {
      return this.gameState.enemySystem.spawnEnemy(roomType, this.gameState.runState.stage);
    }

    const behaviors = monster.behaviors.length > 0 ? [...monster.behaviors] : ['basic_attack'];
    const maxHp = this.gameState.difficultySystem.getEnemyMaxHp(monster.stats.hp, this.gameState.runState.stage);
    return {
      id: monster.id,
      name: monster.name,
      maxHp,
      currentHp: maxHp,
      attack: this.gameState.difficultySystem.getEnemyAttack(monster.stats.attack, this.gameState.runState.stage),
      armor: monster.stats.armor ?? 0,
      shield: 0,
      intent: monster.intent.label,
      behavior: behaviors[0],
      behaviors,
      roomType: roomType === 'elite' || roomType === 'boss' ? roomType : 'fight',
      attackIntervalLocks: monster.stats.attackIntervalLocks,
      attackCounter: monster.stats.attackIntervalLocks,
      previewHiddenTurns: 0,
      holdHiddenTurns: 0,
      manaHexTurns: 0,
      frozenTurns: 0,
      sleepTurns: 0,
      reverseControlsTurns: 0,
      lineDamageBlockedTurns: 0,
      behaviorIndex: 0,
      phase: 1,
      phase2Triggered: false
    };
  }

  private createCascadeTestGrid(): BoardCell[][] {
    const grid: BoardCell[][] = Array.from({ length: BOARD_ROWS }, () => Array.from({ length: BOARD_COLS }, () => 0 as BoardCell));
    grid[BOARD_ROWS - 1] = Array.from({ length: BOARD_COLS }, () => TETROMINO_COLORS.I);
    grid[BOARD_ROWS - 2] = Array.from({ length: BOARD_COLS }, (_, column) => column === 0 ? 0 : TETROMINO_COLORS.T);
    grid[BOARD_ROWS - 3][0] = TETROMINO_COLORS.L;
    return grid;
  }

  private createDebugHazard(kind: ActiveHazardKind): ActiveHazardState {
    const data: Record<ActiveHazardKind, Pick<ActiveHazardState, 'hazardId' | 'name' | 'warningText' | 'counterTags' | 'severity' | 'defaultFailureEffect' | 'itemCounterHints' | 'spellCounterHints' | 'cascadeCounterHint'>> = {
      incoming_junk: {
        hazardId: 'hazard_incoming_junk_queue',
        name: 'Incoming Junk',
        warningText: 'Crumb junk is lining up in the snack tray!',
        counterTags: ['counter_incoming_junk', 'counter_junk'],
        severity: 'moderate',
        defaultFailureEffect: 'Remaining junk drops onto random columns.',
        itemCounterHints: ['Snack Shield', 'Return Stamp'],
        spellCounterHints: ['Bomb Rune', 'Void Cut'],
        cascadeCounterHint: 'Trigger a cascade to reduce incoming junk.'
      },
      floating_block: {
        hazardId: 'hazard_floaty_rune',
        name: 'Floaty Rune',
        warningText: 'A Floaty Rune is wobbling overhead!',
        counterTags: ['counter_float'],
        severity: 'minor',
        defaultFailureEffect: 'Drops as cloud junk.',
        itemCounterHints: ['Cloud Pin'],
        spellCounterHints: ['Bomb Rune']
      },
      freeze: {
        hazardId: 'hazard_freeze_warning',
        name: 'Freeze Warning',
        warningText: 'Frost is gathering around your active block!',
        counterTags: ['counter_freeze'],
        severity: 'moderate',
        defaultFailureEffect: 'Fall speed nudges upward.',
        itemCounterHints: ['Hot Cocoa'],
        spellCounterHints: ['Frost Lock']
      },
      preview: {
        hazardId: 'hazard_preview_hidden',
        name: 'Preview Glitter',
        warningText: 'A Sugar Bat is blocking your preview!',
        counterTags: ['counter_preview'],
        severity: 'minor',
        defaultFailureEffect: 'Preview hidden briefly.',
        itemCounterHints: ['Preview Glasses'],
        spellCounterHints: []
      },
      low_ceiling: {
        hazardId: 'hazard_low_ceiling',
        name: 'Low Ceiling',
        warningText: 'The ceiling is getting suspiciously lower!',
        counterTags: ['counter_low_ceiling', 'counter_board_size'],
        severity: 'major',
        defaultFailureEffect: 'Top row pressure.',
        itemCounterHints: ['Tent Pole', 'Safety Net'],
        spellCounterHints: ['Void Cut']
      },
      bad_piece: {
        hazardId: 'hazard_bad_piece_delivery',
        name: 'Weird Delivery',
        warningText: 'A goblin put something weird in the queue!',
        counterTags: ['counter_piece_queue'],
        severity: 'minor',
        defaultFailureEffect: 'Awkward piece enters Next.',
        itemCounterHints: ['Return Stamp'],
        spellCounterHints: []
      },
      sleep: {
        hazardId: 'hazard_sleep_warning',
        name: 'Sleepy Tune',
        warningText: 'A pillow-soft tune is trying to make the room drowsy!',
        counterTags: ['counter_sleep'],
        severity: 'moderate',
        defaultFailureEffect: 'Sleepy pressure lands softly.',
        itemCounterHints: ['Alarm Cookie'],
        spellCounterHints: []
      },
      speed_wave: {
        hazardId: 'hazard_speed_wave',
        name: 'Speed Wave',
        warningText: 'The floor is wobbling faster!',
        counterTags: ['counter_speed'],
        severity: 'moderate',
        defaultFailureEffect: 'Fall speed rises slightly.',
        itemCounterHints: ['Speed Brake'],
        spellCounterHints: ['Frost Lock']
      },
      royal_pattern: {
        hazardId: 'hazard_royal_pattern',
        name: 'Royal Pattern',
        warningText: 'Bloxley demands a proper rectangle!',
        counterTags: ['counter_royal', 'counter_pattern'],
        severity: 'boss',
        defaultFailureEffect: 'Royal blocks appear.',
        itemCounterHints: ['Snack Vacuum'],
        spellCounterHints: ['Bomb Rune', 'Void Cut']
      }
    };
    return {
      ...data[kind],
      instanceId: `debug_${kind}_${Date.now()}`,
      kind,
      counterWindowPieces: kind === 'low_ceiling' ? 6 : 3,
      remainingPieces: kind === 'low_ceiling' ? 6 : 3,
      amount: kind === 'incoming_junk' ? 5 : kind === 'royal_pattern' ? 4 : undefined,
      blockId: kind === 'incoming_junk' ? 'block_crumb_junk' : kind === 'floating_block' ? 'block_floaty_rune' : undefined,
      onExpireBlockId: kind === 'floating_block' ? 'block_cloud_junk' : undefined,
      column: kind === 'floating_block' ? 3 : undefined,
      row: kind === 'floating_block' ? 1 : undefined
    };
  }
}
