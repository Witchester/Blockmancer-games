import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { contentRegistry } from '../systems/ContentRegistry';
import type { MapNodeDefinition, RoomType } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

type Rect = { x: number; y: number; width: number; height: number };

type MapSceneLayout = {
  screen: Rect;
  safe: Rect;
  headerArea: Rect;
  mapArea: Rect;
  nodeGraphArea: Rect;
  selectedNodeArea: Rect;
  runSummaryArea: Rect;
  actionArea: Rect;
  primaryActionButton: Rect;
  backButton: Rect;
  runStatCards: Rect[];
  scaleMode: 'full' | 'compact' | 'tiny';
};

type NodeVisualRef = {
  node: MapNodeDefinition;
  x: number;
  y: number;
  radius: number;
};

export class MapScene extends Phaser.Scene {
  private infoLayer?: Phaser.GameObjects.Container;
  private mapLayer?: Phaser.GameObjects.Container;
  private selectedNodeId: string | null = null;
  private selectedNodeText?: Phaser.GameObjects.Text;
  private primaryActionButton?: Button;
  private primaryActionHint?: Phaser.GameObjects.Text;
  private layout?: MapSceneLayout;

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

    const viewport = getPortraitLayout(this);
    this.layout = this.calculateMapSceneLayout(viewport.width, viewport.height, { top: 0, right: 0, bottom: 0, left: 0 });
    if (!this.validateMapSceneLayout(this.layout)) {
      if (import.meta.env.DEV) {
        console.warn('[MapScene] layout validation failed; attempting fallback layout pass.');
      }
      this.layout = this.calculateMapSceneLayout(viewport.width, viewport.height, { top: 0, right: 0, bottom: 0, left: 0 });
    }

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.drawFrame(this.layout);
    this.drawHeader(this.layout);
    this.drawSelectedNodeArea(this.layout);
    this.drawRunSummary(this.layout);
    this.drawActionArea(this.layout);

    this.selectedNodeId = this.gameState.runState.currentNodeId;
    this.renderMap();
    this.updateSelectedNodeCard();
    this.updatePrimaryAction();
  }

  private get gameState(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private calculateMapSceneLayout(width: number, height: number, safeArea: { top: number; right: number; bottom: number; left: number }): MapSceneLayout {
    const scaleMode: 'full' | 'compact' | 'tiny' = width >= 760 ? 'full' : width >= 520 ? 'compact' : 'tiny';
    const outerPad = scaleMode === 'full' ? 16 : scaleMode === 'compact' ? 12 : 8;
    const gap = scaleMode === 'tiny' ? 6 : 8;
    const availableX = safeArea.left + outerPad;
    const availableY = safeArea.top + outerPad;
    const availableW = width - safeArea.left - safeArea.right - outerPad * 2;
    const availableH = height - safeArea.top - safeArea.bottom - outerPad * 2;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const headerH = Math.floor(clamp(availableH * 0.09, 54, 92));
    const mapH = Math.floor(clamp(availableH * 0.52, 300, 640));
    const selectedH = Math.floor(clamp(availableH * 0.14, 94, 170));
    const summaryH = Math.floor(clamp(availableH * 0.15, 96, 190));
    const actionH = Math.max(96, availableH - headerH - mapH - selectedH - summaryH - gap * 4);

    const headerArea: Rect = { x: availableX, y: availableY, width: availableW, height: headerH };
    const mapArea: Rect = { x: availableX, y: headerArea.y + headerArea.height + gap, width: availableW, height: mapH };
    const nodeGraphArea: Rect = { x: mapArea.x + 8, y: mapArea.y + 8, width: mapArea.width - 16, height: mapArea.height - 16 };
    const selectedNodeArea: Rect = { x: availableX, y: mapArea.y + mapArea.height + gap, width: availableW, height: selectedH };
    const runSummaryArea: Rect = { x: availableX, y: selectedNodeArea.y + selectedNodeArea.height + gap, width: availableW, height: summaryH };
    const actionArea: Rect = { x: availableX, y: runSummaryArea.y + runSummaryArea.height + gap, width: availableW, height: actionH };

    const btnGap = 8;
    const buttonW = Math.floor((actionArea.width - btnGap) / 2);
    const buttonH = Math.floor(clamp(actionArea.height - 12, 54, 74));
    const primaryActionButton: Rect = { x: actionArea.x, y: actionArea.y + 6, width: buttonW, height: buttonH };
    const backButton: Rect = { x: primaryActionButton.x + buttonW + btnGap, y: actionArea.y + 6, width: actionArea.width - buttonW - btnGap, height: buttonH };

    const statGap = 6;
    const cols = scaleMode === 'tiny' ? 3 : 4;
    const rows = 3;
    const cardW = Math.floor((runSummaryArea.width - statGap * (cols - 1)) / cols);
    const cardH = Math.floor((runSummaryArea.height - statGap * (rows - 1)) / rows);
    const runStatCards: Rect[] = [];
    for (let i = 0; i < cols * rows; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      runStatCards.push({
        x: runSummaryArea.x + col * (cardW + statGap),
        y: runSummaryArea.y + row * (cardH + statGap),
        width: cardW,
        height: cardH
      });
    }

    return {
      screen: { x: 0, y: 0, width, height },
      safe: { x: availableX, y: availableY, width: availableW, height: availableH },
      headerArea,
      mapArea,
      nodeGraphArea,
      selectedNodeArea,
      runSummaryArea,
      actionArea,
      primaryActionButton,
      backButton,
      runStatCards,
      scaleMode
    };
  }

  private validateMapSceneLayout(layout: MapSceneLayout): boolean {
    const valid = (r: Rect) => r.width > 0 && r.height > 0;
    const sepY = (a: Rect, b: Rect) => a.y + a.height <= b.y || b.y + b.height <= a.y;
    const contains = (outer: Rect, inner: Rect) => inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;

    if (![layout.headerArea, layout.mapArea, layout.nodeGraphArea, layout.selectedNodeArea, layout.runSummaryArea, layout.actionArea, layout.primaryActionButton, layout.backButton].every(valid)) return false;
    if (!sepY(layout.headerArea, layout.mapArea) || !sepY(layout.mapArea, layout.selectedNodeArea) || !sepY(layout.selectedNodeArea, layout.runSummaryArea) || !sepY(layout.runSummaryArea, layout.actionArea)) return false;
    if (!contains(layout.mapArea, layout.nodeGraphArea)) return false;
    if (!contains(layout.actionArea, layout.primaryActionButton) || !contains(layout.actionArea, layout.backButton)) return false;
    if (!layout.runStatCards.every((r) => valid(r) && contains(layout.runSummaryArea, r))) return false;
    return true;
  }

  private drawFrame(layout: MapSceneLayout): void {
    const centerX = layout.screen.width / 2;
    const centerY = layout.screen.height / 2;
    const background = this.gameState.assetSystem.createImageByAssetKey(
      this,
      this.gameState.assetSystem.getStageBackground(this, this.gameState.runState.stage, 'map'),
      'stageBackground',
      centerX,
      centerY,
      { kind: 'background' }
    );
    background.setDisplaySize(layout.screen.width, layout.screen.height).setAlpha(0.16);

    this.add.rectangle(centerX, centerY, layout.screen.width, layout.screen.height, COLORS.background, 0.72);
    this.add.rectangle(layout.mapArea.x + layout.mapArea.width / 2, layout.mapArea.y + layout.mapArea.height / 2, layout.mapArea.width, layout.mapArea.height, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accent, 0.35);
    this.add.rectangle(layout.selectedNodeArea.x + layout.selectedNodeArea.width / 2, layout.selectedNodeArea.y + layout.selectedNodeArea.height / 2, layout.selectedNodeArea.width, layout.selectedNodeArea.height, COLORS.panelAlt, 0.94).setStrokeStyle(1, COLORS.accentSoft, 0.35);
    this.add.rectangle(layout.runSummaryArea.x + layout.runSummaryArea.width / 2, layout.runSummaryArea.y + layout.runSummaryArea.height / 2, layout.runSummaryArea.width, layout.runSummaryArea.height, COLORS.panelAlt, 0.94).setStrokeStyle(1, COLORS.accentSoft, 0.35);
    this.add.rectangle(layout.actionArea.x + layout.actionArea.width / 2, layout.actionArea.y + layout.actionArea.height / 2, layout.actionArea.width, layout.actionArea.height, COLORS.panel, 0.90).setStrokeStyle(1, COLORS.accentSoft, 0.28);
  }

  private drawHeader(layout: MapSceneLayout): void {
    const state = this.gameState.runState;
    const stage = this.gameState.stageSystem.getStageByIndex(state.stage);
    const stageCount = this.gameState.stageSystem.getStageCount();
    const currentNode = this.gameState.mapSystem.getNode(state.map, state.currentNodeId);

    this.add.text(layout.headerArea.x + layout.headerArea.width / 2, layout.headerArea.y + 2, 'Dungeon Map', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '24px' : '30px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.add.text(layout.headerArea.x + layout.headerArea.width / 2, layout.headerArea.y + layout.headerArea.height - 4, `Stage ${state.stage}/${stageCount} � ${stage?.name ?? 'Festival Dungeon'} � Room ${currentNode?.label ?? 'Start'}`, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '13px' : '15px'
    }).setOrigin(0.5, 1);
  }

  private drawSelectedNodeArea(layout: MapSceneLayout): void {
    this.selectedNodeText = this.add.text(layout.selectedNodeArea.x + 10, layout.selectedNodeArea.y + 8, '', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '13px' : '15px',
      lineSpacing: 4,
      wordWrap: { width: layout.selectedNodeArea.width - 20 }
    });
  }

  private drawRunSummary(layout: MapSceneLayout): void {
    this.infoLayer?.destroy(true);
    this.infoLayer = this.add.container(0, 0);

    const state = this.gameState.runState;
    const currentNode = this.gameState.mapSystem.getNode(state.map, state.currentNodeId);
    const goal = this.getStageGoalSummary();
    const relicSummary = state.ownedRewards.length ? `${state.ownedRewards.length} � ${state.ownedRewards[0]}` : '0';

    const chips = [
      ['HP', `${state.player.hp}/${state.player.maxHp}`],
      ['Mana', `${state.player.mana}/${state.player.maxMana}`],
      ['Gold', `${state.player.gold}`],
      ['Stage', `${state.stage}`],
      ['Goal', goal],
      ['Fall', `${state.fallSpeed.toFixed(2)}x`],
      ['Hero', state.hero.name],
      ['Room', currentNode?.label ?? 'Unknown'],
      ['Relics', relicSummary]
    ];

    chips.forEach((chip, index) => {
      const rect = layout.runStatCards[index];
      if (!rect) return;
      const bg = this.add.rectangle(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, rect.height, COLORS.panel, 0.94).setStrokeStyle(1, COLORS.accentSoft, 0.32);
      const label = this.add.text(rect.x + 6, rect.y + 4, chip[0], {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '10px' : '11px'
      });
      const value = this.add.text(rect.x + 6, rect.y + rect.height - 4, chip[1], {
        color: chip[0] === 'Goal' ? '#ffca6b' : '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: chip[0] === 'Goal' ? (layout.scaleMode === 'tiny' ? '11px' : '12px') : (layout.scaleMode === 'tiny' ? '12px' : '13px'),
        fontStyle: 'bold',
        wordWrap: { width: rect.width - 12 }
      }).setOrigin(0, 1);
      this.infoLayer?.add([bg, label, value]);
    });
  }

  private drawActionArea(layout: MapSceneLayout): void {
    this.primaryActionButton = new Button(
      this,
      layout.primaryActionButton.x + layout.primaryActionButton.width / 2,
      layout.primaryActionButton.y + layout.primaryActionButton.height / 2,
      layout.primaryActionButton.width,
      layout.primaryActionButton.height,
      'Enter Room',
      () => this.enterSelectedNode(),
      { fontSize: layout.scaleMode === 'tiny' ? '16px' : '18px' }
    );

    new Button(
      this,
      layout.backButton.x + layout.backButton.width / 2,
      layout.backButton.y + layout.backButton.height / 2,
      layout.backButton.width,
      layout.backButton.height,
      'Back To Menu',
      () => this.scene.start('MainMenuScene'),
      { fontSize: layout.scaleMode === 'tiny' ? '16px' : '18px' }
    );

    this.primaryActionHint = this.add.text(
      layout.actionArea.x + layout.actionArea.width / 2,
      layout.actionArea.y + layout.actionArea.height - 2,
      '',
      {
        color: '#ffb9c0',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '12px' : '13px'
      }
    ).setOrigin(0.5, 1);
  }

  private renderMap(): void {
    const layout = this.layout;
    if (!layout) return;

    this.mapLayer?.destroy(true);
    this.mapLayer = this.add.container(0, 0);

    const state = this.gameState.runState;
    const availableIds = new Set(this.gameState.mapSystem.getAvailableNodes(state).map((node) => node.id));

    const visuals: NodeVisualRef[] = state.map.map((node) => ({
      node,
      x: layout.nodeGraphArea.x + node.x * layout.nodeGraphArea.width,
      y: layout.nodeGraphArea.y + node.y * layout.nodeGraphArea.height,
      radius: node.roomType === 'boss' ? 30 : node.roomType === 'elite' ? 26 : 24
    }));
    const visualById = new Map(visuals.map((entry) => [entry.node.id, entry]));

    for (const node of state.map) {
      const from = visualById.get(node.id);
      if (!from) continue;
      for (const targetId of node.connections) {
        const to = visualById.get(targetId);
        if (!to) {
          if (import.meta.env.DEV) {
            console.warn('[MapScene] Missing edge target', node.id, targetId);
          }
          continue;
        }
        const start = this.getNodeEdgePoint(from, to);
        const end = this.getNodeEdgePoint(to, from);
        if (!this.isPointInsideRect(start, layout.nodeGraphArea) || !this.isPointInsideRect(end, layout.nodeGraphArea)) {
          continue;
        }
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if (dx * dx + dy * dy < 16) {
          continue;
        }
        const line = this.add.line(0, 0, start.x, start.y, end.x, end.y, 0x44507a, 1).setLineWidth(4);
        this.mapLayer.add(line);
      }
    }

    visuals.forEach((entry) => {
      const node = entry.node;
      const isCurrent = state.currentNodeId === node.id;
      const isSelected = this.selectedNodeId === node.id;
      const isAvailable = availableIds.has(node.id);
      const isLocked = !isCurrent && !isAvailable && !node.completed;

      const radius = entry.radius;
      const fill = isCurrent ? COLORS.gold : node.completed ? COLORS.success : isLocked ? 0x303750 : COLORS.accent;
      const stroke = isSelected ? COLORS.gold : isCurrent ? 0xfff1b5 : isLocked ? 0x5d678c : 0x9ab3ff;

      const circle = this.add.circle(entry.x, entry.y, radius, fill, 1).setStrokeStyle(isSelected ? 5 : 3, stroke, 0.95);
      if (isCurrent) {
        this.mapLayer?.add(this.add.text(entry.x, entry.y - radius - 10, 'YOU', {
          color: '#ffca6b',
          fontFamily: FONT_FAMILY,
          fontSize: layout.scaleMode === 'tiny' ? '11px' : '12px',
          fontStyle: 'bold'
        }).setOrigin(0.5));
      }

      const iconKey = (contentRegistry.getMapNode(`node_${node.roomType}`) as { iconKey?: string } | null)?.iconKey;
      const stateKey = isCurrent ? 'current' : node.completed ? 'completed' : isAvailable ? 'available' : 'locked';
      const texture = this.gameState.assetSystem.getMapNodeTexture(this, node.roomType, stateKey, iconKey);
      const icon = this.gameState.assetSystem.createImageByAssetKey(this, texture, 'mapIcon', entry.x, entry.y, { kind: 'icon' });
      icon.setDisplaySize(radius + 8, radius + 8);
      const fallbackIcon = this.add.text(entry.x, entry.y, node.icon, {
        color: '#0b0d16',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '20px' : '22px'
      }).setOrigin(0.5).setAlpha(texture ? 0 : 1);

      const typeShort = this.getNodeTypeLabel(node.roomType, layout.scaleMode);
      const label = this.add.text(entry.x, entry.y + radius + 8, typeShort, {
        color: isLocked ? '#9198b8' : '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '12px' : '13px',
        fontStyle: isSelected ? 'bold' : 'normal'
      }).setOrigin(0.5, 0);

      const hit = this.add.rectangle(entry.x, entry.y, Math.max(44, radius * 2 + 10), Math.max(44, radius * 2 + 10), 0x000000, 0.001).setInteractive({ useHandCursor: true });
      hit.on('pointerdown', () => {
        this.selectedNodeId = node.id;
        this.renderMap();
        this.updateSelectedNodeCard();
        this.updatePrimaryAction();
      });

      this.mapLayer?.add([circle, icon, fallbackIcon, label, hit]);
    });
  }

  private updateSelectedNodeCard(): void {
    const state = this.gameState.runState;
    const selectedId = this.selectedNodeId ?? state.currentNodeId;
    const node = this.gameState.mapSystem.getNode(state.map, selectedId);
    if (!node) {
      this.selectedNodeText?.setText('Select an available room.');
      return;
    }

    const availableIds = new Set(this.gameState.mapSystem.getAvailableNodes(state).map((n) => n.id));
    const status = state.currentNodeId === node.id
      ? 'Current'
      : node.completed
        ? 'Completed'
        : availableIds.has(node.id)
          ? 'Available'
          : 'Locked';

    const action = this.getPrimaryActionLabel(node.roomType);
    const risk = node.roomType === 'boss' ? 'High risk, stage advance on win.' : node.roomType === 'elite' ? 'Hard battle, better loot.' : 'Clear this room to advance the route.';
    this.selectedNodeText?.setText([
      `${node.label} � ${this.getNodeTypeLabel(node.roomType, 'full')} � ${status}`,
      `${risk}`,
      `Action: ${action}`
    ]);
  }

  private updatePrimaryAction(): void {
    const state = this.gameState.runState;
    const selectedId = this.selectedNodeId ?? state.currentNodeId;
    const node = this.gameState.mapSystem.getNode(state.map, selectedId);
    if (!node) {
      this.primaryActionButton?.setText('Enter Room');
      this.primaryActionButton?.setDisabled(true);
      this.primaryActionHint?.setText('Select an available room.');
      return;
    }

    const isCurrent = state.currentNodeId === node.id;
    const isAvailable = this.gameState.mapSystem.canVisit(state, node.id);
    const canEnter = isAvailable;

    this.primaryActionButton?.setText(this.getPrimaryActionLabel(node.roomType));
    this.primaryActionButton?.setDisabled(!canEnter);

    if (canEnter) {
      this.primaryActionHint?.setText(isCurrent ? 'You are here.' : 'Tap to enter selected room.');
    } else if (node.completed) {
      this.primaryActionHint?.setText('This room is already completed.');
    } else {
      this.primaryActionHint?.setText('This room is locked right now.');
    }
  }

  private enterSelectedNode(): void {
    const state = this.gameState.runState;
    const selectedId = this.selectedNodeId ?? state.currentNodeId;
    const node = this.gameState.mapSystem.getNode(state.map, selectedId);
    if (!node) {
      return;
    }
    this.handleNodeClick(node);
  }

  private getNodeTypeLabel(roomType: MapNodeDefinition['roomType'], mode: 'full' | 'compact' | 'tiny'): string {
    const full: Record<MapNodeDefinition['roomType'], string> = {
      start: 'Start',
      fight: 'Fight',
      elite: 'Elite',
      boss: 'Boss',
      event: 'Event',
      shop: 'Shop',
      rest: 'Rest',
      treasure: 'Treasure',
      mini_boss: 'Mini-Boss',
      royal_guard: 'Royal Guard'
    };
    const short: Record<MapNodeDefinition['roomType'], string> = {
      start: 'STA',
      fight: 'FIG',
      elite: 'ELT',
      boss: 'BOS',
      event: 'EVT',
      shop: 'SHP',
      rest: 'RST',
      treasure: 'TRE',
      mini_boss: 'MIN',
      royal_guard: 'GRD'
    };
    return mode === 'tiny' ? short[roomType] : full[roomType];
  }

  private getPrimaryActionLabel(roomType: MapNodeDefinition['roomType']): string {
    switch (roomType) {
      case 'fight':
        return 'Start Fight';
      case 'elite':
        return 'Start Elite';
      case 'boss':
        return 'Challenge Boss';
      case 'event':
        return 'Open Event';
      case 'shop':
        return 'Open Shop';
      case 'rest':
        return 'Take Rest';
      case 'treasure':
        return 'Claim Treasure';
      default:
        return 'Continue';
    }
  }

  private getNodeEdgePoint(from: NodeVisualRef, to: NodeVisualRef): { x: number; y: number } {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {
      x: from.x + (dx / len) * from.radius,
      y: from.y + (dy / len) * from.radius
    };
  }

  private isPointInsideRect(point: { x: number; y: number }, rect: Rect): boolean {
    return point.x >= rect.x && point.y >= rect.y && point.x <= rect.x + rect.width && point.y <= rect.y + rect.height;
  }

  private log(message: string): void {
    const state = this.gameState.runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
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

  private getStageGoalSummary(): string {
    const goalProgress = this.gameState.stageGoalSystem.getProgress(this.gameState.runState);
    if (!goalProgress) {
      return 'none';
    }
    const { goal, progress } = goalProgress;
    return `${goal.name} ${progress.progress}/${progress.requiredAmount}${progress.completed ? ' done' : ''}`;
  }
}
