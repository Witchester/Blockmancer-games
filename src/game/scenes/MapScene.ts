import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { contentRegistry } from '../systems/ContentRegistry';
import type { MapNodeDefinition, RoomType } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class MapScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;
  private mapLayer?: Phaser.GameObjects.Container;
  private availableRoomsLayer?: Phaser.GameObjects.Container;

  constructor() {
    super('MapScene');
  }

  create(): void {
    this.gameState.runState.runStatus = 'map';
    this.gameState.stageGoalSystem.ensureGoal(this.gameState.runState);
    const stageStoryId = this.gameState.stageSystem.getStageStoryId(this.gameState.runState.stage);
    if (stageStoryId && !this.gameState.storySystem.hasSeen(stageStoryId)) {
      const beat = this.gameState.storySystem.getStageIntro(stageStoryId);
      if (beat) {
        this.scene.start('StoryScene', {
          beat,
          beatId: stageStoryId,
          returnScene: 'MapScene'
        });
        return;
      }
    }

    const layout = getPortraitLayout(this);
    const { width, height, centerX, contentWidth, margin } = layout;

    this.cameras.main.setBackgroundColor(COLORS.background);
    const background = this.gameState.assetSystem.createImageByAssetKey(
      this,
      this.gameState.stageSystem.getStageBackgroundKey(this.gameState.runState.stage),
      'stageBackground',
      centerX,
      height / 2,
      { kind: 'background' }
    );
    background.setDisplaySize(width, height).setAlpha(0.16);
    this.add.rectangle(centerX, height / 2, width, height, COLORS.background, 0.72);
    this.add.rectangle(centerX, 384, contentWidth, 620, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accent, 0.35);
    this.add.rectangle(centerX, height - 260, contentWidth, 456, COLORS.panel, 0.92).setStrokeStyle(2, COLORS.accentSoft, 0.35);

    this.add.text(centerX, 54, 'Dungeon Map', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '32px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, 96, 'Path of the Run', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '20px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.infoText = this.add.text(margin + 16, height - 472, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      lineSpacing: 7,
      wordWrap: { width: contentWidth - 32 }
    });

    new Button(this, centerX, height - 48, 260, 48, 'Back To Menu', () => {
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
    const currentStage = this.gameState.stageSystem.getStageByIndex(state.stage);
    const stageCount = this.gameState.stageSystem.getStageCount();
    this.infoText?.setText([
      `HP: ${state.player.hp}/${state.player.maxHp}    Mana: ${state.player.mana}/${state.player.maxMana}    Gold: ${state.player.gold}`,
      `Stage ${state.stage}/${stageCount}: ${currentStage?.name ?? 'Festival Dungeon'}`,
      this.getStageGoalSummary(),
      `Fall Speed: ${state.fallSpeed.toFixed(2)}x`,
      `Hero: ${state.hero.name}`,
      `Current Room: ${currentNode?.label ?? 'Unknown'}`,
      `Relics: ${state.ownedRewards.length ? state.ownedRewards.slice(0, 3).join(', ') : 'None yet'}`
    ]);
  }

  private renderAvailableRooms(): void {
    this.availableRoomsLayer?.destroy(true);
    this.availableRoomsLayer = this.add.container(0, 0);

    if (!this.isCompactLayout()) {
      return;
    }

    const layout = getPortraitLayout(this);
    const { width, height, margin, contentWidth } = layout;
    const startY = height - 270;

    const availableNodes = this.gameState.mapSystem.getAvailableNodes(this.gameState.runState);
    this.availableRoomsLayer.add(this.add.text(margin + 16, startY, 'Quick Room Select', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      fontStyle: 'bold'
    }));

    this.availableRoomsLayer.add(this.add.text(margin + 16, startY + 30, 'Tap an available room.', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      wordWrap: { width: contentWidth - 32 }
    }));

    if (availableNodes.length === 0) {
      this.availableRoomsLayer.add(this.add.text(margin + 16, startY + 72, 'No connected rooms are available yet.', {
        color: '#d8deff',
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        wordWrap: { width: contentWidth - 32 }
      }));
      return;
    }

    availableNodes.slice(0, 3).forEach((node, index) => {
      const button = new Button(
        this,
        width / 2,
        startY + 76 + index * 62,
        contentWidth - 48,
        54,
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

    const width = this.scale.width;
    const margin = 48;
    const mapWidth = width - margin * 2;
    const mapHeight = 440;
    const mapStartX = margin;
    const mapStartY = 170;

    for (const node of state.map) {
      for (const connection of node.connections) {
        const nextNode = this.gameState.mapSystem.getNode(state.map, connection);
        if (!nextNode) {
          continue;
        }

        const line = this.add.line(
          0,
          0,
          mapStartX + node.x * mapWidth,
          mapStartY + node.y * mapHeight,
          mapStartX + nextNode.x * mapWidth,
          mapStartY + nextNode.y * mapHeight,
          0x38416a,
          1
        ).setLineWidth(3);
        this.mapLayer.add(line);
      }
    }

    for (const node of state.map) {
      const positionX = mapStartX + node.x * mapWidth;
      const positionY = mapStartY + node.y * mapHeight;
      const isCurrent = state.currentNodeId === node.id;
      const isAvailable = available.has(node.id);
      const nodeState = isCurrent ? 'current' : node.completed ? 'completed' : isAvailable ? 'available' : 'locked';
      const fill = isCurrent ? COLORS.gold : node.completed ? COLORS.success : isAvailable ? COLORS.accent : 0x303750;
      const stroke = isAvailable ? COLORS.gold : 0x616a93;

      const circle = this.add.circle(positionX, positionY, 32, fill, 1).setStrokeStyle(3, stroke, 0.8);
      const iconKey = (contentRegistry.getMapNode(`node_${node.roomType}`) as { iconKey?: string } | null)?.iconKey;
      const nodeTexture = this.gameState.assetSystem.getMapNodeTexture(this, node.roomType, nodeState, iconKey);
      const icon = this.gameState.assetSystem.createImageByAssetKey(this, nodeTexture, 'mapIcon', positionX, positionY, { kind: 'icon' });
      const label = this.add.text(positionX, positionY - 2, node.icon, {
        color: '#0b0d16',
        fontFamily: FONT_FAMILY,
        fontSize: '26px'
      }).setOrigin(0.5).setAlpha(nodeTexture ? 0 : 1);
      const title = this.add.text(positionX, positionY + 48, node.label, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        align: 'center',
        wordWrap: { width: 88 }
      }).setOrigin(0.5);

      if (isAvailable) {
        circle.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.handleNodeClick(node));
        title.setColor('#ffca6b');
      }

      this.mapLayer.add([circle, icon, label, title]);
    }
  }

  private handleNodeClick(node: MapNodeDefinition): void {
    const state = this.gameState.runState;
    const moved = this.gameState.mapSystem.moveToNode(state, node.id);
    if (!moved) {
      return;
    }

    this.log(`Entered ${node.label}.`);
    const mapEvent = this.gameState.randomGameplayEventSystem.roll(state, 'map_node_enter');
    if (mapEvent) {
      this.log(`Random event: ${mapEvent.name}.`);
      this.gameState.randomGameplayEventSystem.applyEffects(state, mapEvent, (message) => this.log(message));
    }
    if (['fight', 'elite', 'boss'].includes(node.roomType)) {
      this.startBattle(node.roomType);
      return;
    }

    switch (node.roomType) {
      case 'event':
        if (this.startRouteSceneIfNeeded('first_eligible_event_node', 'EventScene')) {
          return;
        }
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
    const randomEvent = this.gameState.randomGameplayEventSystem.roll(state, 'battle_start');
    if (randomEvent) {
      this.log(`Random event incoming: ${randomEvent.name}.`);
    }
    const boardSizeMessage = this.gameState.boardSizeModifierSystem.applyEncounterBoardSize(state);
    if (boardSizeMessage) {
      this.log(boardSizeMessage);
    }
    const chaosRule = this.gameState.chaosRuleSystem.rollForCombat(state);
    if (chaosRule) {
      this.gameState.metaSystem.recordChaosRuleDiscovered(chaosRule.id);
      this.log(`Festival Chaos rolled: ${chaosRule.name}.`);
    }
    const objective = this.gameState.battleObjectiveSystem.rollForCombat(state);
    if (objective) {
      this.log(`Mini-objective: ${objective.name}.`);
    }
    if (roomType === 'boss') {
      const goalMessage = this.gameState.stageGoalSystem.applyBossStartEffect(state);
      if (goalMessage) {
        this.log(goalMessage);
      }
      const card = this.gameState.bossRuleSystem.getForBoss(enemy.id);
      state.currentBossRule = card?.id;
      if (card) {
        this.gameState.metaSystem.recordBossRuleDiscovered(card.id);
      }
    }
    state.player.emergencyBarrierUsed = false;
    state.currentRoomProgress = 'entered';
    state.runStatus = 'battle';
    this.log(`${enemy.name} emerges with ${enemy.maxHp} HP.`);
    this.gameState.saveRun();
    this.scene.start('BattleScene');
  }

  private startRouteSceneIfNeeded(context: 'first_eligible_event_node' | 'after_first_combat_victory', returnScene: string): boolean {
    const state = this.gameState.runState;
    const stageId = this.gameState.stageSystem.getStageByIndex(state.stage)?.id ?? 'stage_sprinkle_sewers';
    const scene = this.gameState.routeStorySystem.shouldTriggerRouteScene(state, state.hero.id, stageId, context);
    if (!scene) {
      return false;
    }
    this.log(`Route story: ${scene.title}.`);
    state.runStatus = 'map';
    this.gameState.saveRun();
    this.scene.start('RouteDialogueScene', {
      sceneId: scene.id,
      returnScene
    });
    return true;
  }

  private isCompactLayout(): boolean {
    return this.scale.parentSize.width <= 900 || this.scale.parentSize.height <= 720;
  }

  private getStageGoalSummary(): string {
    const goalProgress = this.gameState.stageGoalSystem.getProgress(this.gameState.runState);
    if (!goalProgress) {
      return 'Stage Goal: none';
    }
    const { goal, progress } = goalProgress;
    return `Stage Goal: ${goal.name} ${progress.progress}/${progress.requiredAmount}${progress.completed ? ' done' : ''}`;
  }
}
