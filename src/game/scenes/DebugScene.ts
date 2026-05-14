import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { createDefaultBoardState } from '../data/constants';
import { contentRegistry } from '../systems/ContentRegistry';
import type { BoardCell, EnemyInstance, RewardDefinition, RoomType } from '../types/GameTypes';
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
      ['Spawn Monster', () => this.spawnMonster('fight'), 'Trigger Boss', () => this.triggerBoss()],
      ['Force Reward', () => this.forceReward(), 'Force Cascade Test', () => this.forceCascadeTest()],
      ['Clear Run Save', () => this.clearRunSave(), 'New Debug Run', () => this.newDebugRun()]
    ];

    rows.forEach((row, index) => {
      const y = 360 + index * 74;
      new Button(this, leftX, y, buttonWidth, buttonHeight, row[0], row[1], { fontSize: '20px' });
      new Button(this, rightX, y, buttonWidth, buttonHeight, row[2], row[3], { fontSize: '20px' });
    });

    const stageY = 760;
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

    new Button(this, this.scale.width / 2 - 150, 920, 260, 58, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });
    new Button(this, this.scale.width / 2 + 150, 920, 260, 58, 'Open Map', () => {
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
      `Enemy: ${state.activeEnemy ? `${state.activeEnemy.name} (${state.activeEnemy.currentHp}/${state.activeEnemy.maxHp})` : 'None'}`
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
    const monsters = contentRegistry.listEnabled<MonsterEntry>('monster').filter((monster) => {
      const isBoss = monster.role === 'boss' || monster.rarity === 'boss';
      const isElite = monster.role === 'elite' || monster.rarity === 'elite';
      if (roomType === 'boss') return isBoss;
      if (roomType === 'elite') return isElite;
      return !isBoss && !isElite;
    });
    if (monsters.length === 0) {
      return null;
    }
    const monster = monsters[this.monsterIndex % monsters.length];
    this.monsterIndex += 1;
    return monster;
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
}
