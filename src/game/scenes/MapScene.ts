import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { MapNodeDefinition, RoomType } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { COLORS, MAX_EVENT_LOG } from '../utils/constants';

export class MapScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;
  private mapLayer?: Phaser.GameObjects.Container;
  private availableRoomsLayer?: Phaser.GameObjects.Container;

  constructor() {
    super('MapScene');
  }

  create(): void {
    this.gameState.runState.runStatus = 'map';
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(640, 400, 1280, 800, COLORS.background, 1);
    this.add.rectangle(280, 400, 470, 700, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accent, 0.35);
    this.add.rectangle(870, 400, 700, 700, COLORS.panel, 0.92).setStrokeStyle(2, COLORS.accentSoft, 0.35);

    this.add.text(120, 74, 'Dungeon Map', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold'
    });

    this.add.text(560, 74, 'Path of the Run', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold'
    });

    this.infoText = this.add.text(88, 140, '', {
      color: '#d8deff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '22px',
      lineSpacing: 10,
      wordWrap: { width: 380 }
    });

    new Button(this, 190, 710, 210, 52, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });

    this.renderMap();
    this.renderInfo();
    this.renderAvailableRooms();
  }

  private get gameState(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private log(message: string): void {
    const state = this.gameState.runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }

  private renderInfo(): void {
    const state = this.gameState.runState;
    const currentNode = this.gameState.mapSystem.getNode(state.map, state.currentNodeId);
    this.infoText?.setText([
      `HP: ${state.player.hp}/${state.player.maxHp}`,
      `Mana: ${state.player.mana}/${state.player.maxMana}`,
      `Gold: ${state.player.gold}`,
      `Stage: ${state.stage}`,
      `Fall Speed: ${state.fallSpeed.toFixed(2)}x`,
      `Hero: ${state.hero.name}`,
      `Current Room: ${currentNode?.label ?? 'Unknown'}`,
      `Relics: ${state.ownedRewards.length ? state.ownedRewards.join(', ') : 'None yet'}`,
      '',
      'Recent log:',
      ...state.eventLog.slice(0, 4)
    ]);
  }

  private renderAvailableRooms(): void {
    this.availableRoomsLayer?.destroy(true);
    this.availableRoomsLayer = this.add.container(0, 0);

    if (!this.isCompactLayout()) {
      return;
    }

    const availableNodes = this.gameState.mapSystem.getAvailableNodes(this.gameState.runState);
    this.availableRoomsLayer.add(this.add.text(86, 560, 'Quick Room Select', {
      color: '#ffca6b',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold'
    }));

    this.availableRoomsLayer.add(this.add.text(86, 592, 'Use these larger buttons on smaller screens.', {
      color: '#98a0c7',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '17px',
      wordWrap: { width: 360 }
    }));

    if (availableNodes.length === 0) {
      this.availableRoomsLayer.add(this.add.text(86, 644, 'No connected rooms are available yet.', {
        color: '#d8deff',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        wordWrap: { width: 360 }
      }));
      return;
    }

    availableNodes.slice(0, 3).forEach((node, index) => {
      const button = new Button(
        this,
        220,
        650 + index * 70,
        280,
        56,
        `${node.label} (${node.roomType})`,
        () => this.handleNodeClick(node)
      );
      this.availableRoomsLayer?.add(button);
    });
  }

  private renderMap(): void {
    this.mapLayer?.destroy(true);
    this.mapLayer = this.add.container(0, 0);
    const state = this.gameState.runState;
    const available = new Set(this.gameState.mapSystem.getAvailableNodes(state).map((node) => node.id));

    for (const node of state.map) {
      for (const connection of node.connections) {
        const nextNode = this.gameState.mapSystem.getNode(state.map, connection);
        if (!nextNode) {
          continue;
        }

        const line = this.add.line(
          0,
          0,
          560 + node.x * 560,
          130 + node.y * 520,
          560 + nextNode.x * 560,
          130 + nextNode.y * 520,
          0x38416a,
          1
        ).setLineWidth(3);
        this.mapLayer.add(line);
      }
    }

    for (const node of state.map) {
      const positionX = 560 + node.x * 560;
      const positionY = 130 + node.y * 520;
      const isCurrent = state.currentNodeId === node.id;
      const isAvailable = available.has(node.id);
      const fill = isCurrent ? COLORS.gold : node.completed ? COLORS.success : isAvailable ? COLORS.accent : 0x303750;
      const stroke = isAvailable ? COLORS.gold : 0x616a93;

      const circle = this.add.circle(positionX, positionY, 30, fill, 1).setStrokeStyle(3, stroke, 0.8);
      const label = this.add.text(positionX, positionY - 2, node.icon, {
        color: '#0b0d16',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '26px'
      }).setOrigin(0.5);
      const title = this.add.text(positionX, positionY + 42, node.label, {
        color: '#f6f7ff',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px'
      }).setOrigin(0.5);

      if (isAvailable) {
        circle.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.handleNodeClick(node));
        title.setColor('#ffca6b');
      }

      this.mapLayer.add([circle, label, title]);
    }
  }

  private handleNodeClick(node: MapNodeDefinition): void {
    const moved = this.gameState.mapSystem.moveToNode(this.gameState.runState, node.id);
    if (!moved) {
      return;
    }

    this.log(`Entered ${node.label}.`);
    if (['fight', 'elite', 'boss'].includes(node.roomType)) {
      this.startBattle(node.roomType);
      return;
    }

    switch (node.roomType) {
      case 'event':
        this.gameState.runState.runStatus = 'map';
        this.gameState.saveRun();
        this.scene.start('EventScene');
        break;
      case 'shop':
        this.gameState.runState.runStatus = 'map';
        this.gameState.saveRun();
        this.scene.start('ShopScene');
        break;
      case 'rest':
        this.gameState.runState.runStatus = 'map';
        this.gameState.saveRun();
        this.scene.start('RestScene');
        break;
      case 'treasure':
        this.gameState.runState.runStatus = 'map';
        this.gameState.saveRun();
        this.scene.start('TreasureScene');
        break;
      default:
        break;
    }
  }

  private startBattle(roomType: RoomType): void {
    const state = this.gameState.runState;
    const enemy = this.gameState.enemySystem.spawnEnemy(roomType, state.stage);
    if (!enemy) {
      return;
    }

    state.activeEnemy = enemy;
    state.lastBattleWasBoss = roomType === 'boss';
    state.player.emergencyBarrierUsed = false;
    state.currentRoomProgress = 'entered';
    state.runStatus = 'battle';
    this.log(`${enemy.name} emerges with ${enemy.maxHp} HP.`);
    this.gameState.saveRun();
    this.scene.start('BattleScene');
  }

  private isCompactLayout(): boolean {
    return this.scale.parentSize.width <= 900 || this.scale.parentSize.height <= 720;
  }
}
