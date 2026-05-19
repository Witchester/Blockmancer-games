import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { createDefaultBoardState } from '../data/constants';
import { contentRegistry } from '../systems/ContentRegistry';
import type { ActiveHazardKind, ActiveHazardState, BoardCell, EnemyInstance, RewardDefinition, RoomType } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { BOARD_COLS, BOARD_ROWS, COLORS, FONT_FAMILY, MAX_EVENT_LOG, TETROMINO_COLORS, TETROMINO_SHAPES } from '../utils/constants';

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
    const centerX = width / 2;
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(centerX, 640, width - 48, 1120, COLORS.panel, 0.96).setStrokeStyle(2, COLORS.gold, 0.45);
    this.add.text(centerX, 70, 'QA Debug Tools', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '38px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, 118, 'Dev-only tools for run setup, rewards, saves, and combat smoke tests.', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '19px',
      align: 'center',
      wordWrap: { width: width - 96 }
    }).setOrigin(0.5);

    this.statusText = this.add.text(64, 174, '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '19px',
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
    const buttonWidth = 292;
    const buttonHeight = 56;
    const leftX = this.scale.width / 2 - 160;
    const rightX = this.scale.width / 2 + 160;
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

    rows.forEach((row, index) => {
      const y = 360 + index * 74;
      new Button(this, leftX, y, buttonWidth, buttonHeight, row[0], row[1], { fontSize: '20px' });
      new Button(this, rightX, y, buttonWidth, buttonHeight, row[2], row[3], { fontSize: '20px' });
    });

    const stageY = 970;
    this.add.text(this.scale.width / 2, stageY - 58, 'Jump To Stage', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    for (let stage = 1; stage <= this.gameState.stageSystem.getStageCount(); stage += 1) {
      const x = 86 + (stage - 1) * 108;
      new Button(this, x, stageY, 84, 54, `${stage}`, () => this.jumpToStage(stage), { fontSize: '24px' });
    }

    new Button(this, this.scale.width / 2 - 150, 1140, 260, 58, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });
    new Button(this, this.scale.width / 2 + 150, 1140, 260, 58, 'Open Map', () => {
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
      (categoryId) => this.openMonsterListPicker(categoryId as RoomType)
    );
  }

  private openMonsterListPicker(roomType: RoomType): void {
    const monsters = this.listMonstersByRoomType(roomType).sort((a, b) => a.name.localeCompare(b.name));
    if (monsters.length === 0) {
      this.clearSelectionOverlay();
      this.updateStatus(`No enabled ${roomType} monster content found.`);
      return;
    }

    const titleMap: Record<'fight' | 'elite' | 'boss', string> = {
      fight: 'Select Monster',
      elite: 'Select Elite',
      boss: 'Select Boss'
    };
    const title = roomType === 'elite' || roomType === 'boss' ? titleMap[roomType] : titleMap.fight;

    this.showSelectionOverlay(
      title,
      monsters.map((monster) => ({ id: monster.id, label: monster.name })),
      (monsterId) => this.spawnMonsterById(roomType, monsterId),
      () => this.openMonsterCategoryPicker()
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
    const monsters = this.listMonstersByRoomType(roomType);
    if (monsters.length === 0) {
      return null;
    }
    const monster = monsters[this.monsterIndex % monsters.length];
    this.monsterIndex += 1;
    return monster;
  }

  private listMonstersByRoomType(roomType: RoomType): MonsterEntry[] {
    return contentRegistry.listEnabled<MonsterEntry>('monster').filter((monster) => {
      const isBoss = monster.role === 'boss' || monster.rarity === 'boss';
      const isElite = monster.role === 'elite' || monster.rarity === 'elite';
      if (roomType === 'boss') return isBoss;
      if (roomType === 'elite') return isElite;
      return !isBoss && !isElite;
    });
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
      fontFamily: FONT_FAMILY,
      fontSize: '30px',
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
        const button = new Button(this, width / 2, y, buttonWidth, buttonHeight, entry.label, () => onSelect(entry.id), { fontSize: '20px' });
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
      });
      dynamicObjects.push(backButton);
      overlay.add(backButton);

      if (totalPages > 1) {
        const pageText = this.add.text(width / 2, height - 110, `${page + 1}/${totalPages}`, {
          color: '#f6f7ff',
          fontFamily: FONT_FAMILY,
          fontSize: '20px'
        }).setOrigin(0.5);
        dynamicObjects.push(pageText);
        overlay.add(pageText);

        const prevButton = new Button(this, width / 2 + 70, height - 110, 120, 56, 'Prev', () => {
          page = (page - 1 + totalPages) % totalPages;
          renderPage();
        });
        const nextButton = new Button(this, width / 2 + 210, height - 110, 120, 56, 'Next', () => {
          page = (page + 1) % totalPages;
          renderPage();
        });
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
