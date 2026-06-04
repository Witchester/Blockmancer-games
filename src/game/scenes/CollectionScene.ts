import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { contentRegistry } from '../systems/ContentRegistry';
import { COLORS } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

type CollectionMonster = {
  id: string;
  name?: string;
  iconKey?: string;
  stageId?: string;
  rank?: string;
  role?: string;
};

export class CollectionScene extends Phaser.Scene {
  constructor() {
    super('CollectionScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);
    const discoveredIds = new Set(game.metaSystem.state.discoveredMonsterIds);
    const monsters = contentRegistry.listEnabled<CollectionMonster>('monster')
      .sort((left, right) => {
        const discoveryOrder = Number(discoveredIds.has(right.id)) - Number(discoveredIds.has(left.id));
        return discoveryOrder || (left.name ?? left.id).localeCompare(right.name ?? right.id);
      });
    const rowHeight = compact ? 168 : 190;
    const firstRowY = 232;
    const contentBottom = firstRowY + Math.max(0, monsters.length - 1) * rowHeight + rowHeight;
    const maxScroll = Math.max(0, contentBottom - layout.height + 170);
    this.cameras.main.setBounds(0, 0, layout.width, Math.max(layout.height, contentBottom + 100));
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _over: Phaser.GameObjects.GameObject[], _dx: number, dy: number) => {
      this.cameras.main.scrollY = Phaser.Math.Clamp(this.cameras.main.scrollY + dy * 0.55, 0, maxScroll);
    });
    let dragStartY: number | null = null;
    let dragStartScrollY = 0;
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      dragStartY = pointer.y;
      dragStartScrollY = this.cameras.main.scrollY;
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (dragStartY === null || !pointer.isDown) {
        return;
      }
      this.cameras.main.scrollY = Phaser.Math.Clamp(dragStartScrollY + dragStartY - pointer.y, 0, maxScroll);
    });
    this.input.on('pointerup', () => {
      dragStartY = null;
    });

    const header = new Card(this, layout.centerX, 88, layout.contentWidth, 100, {
      title: 'Monster Collection',
      body: `${discoveredIds.size}/${monsters.length} discovered | ${game.friendshipSystem.getSummary(game.metaSystem.state)}`,
      titleColor: '#65d6a5',
      bodyFontSize: compact ? '18px' : '20px',
      strokeColor: COLORS.success
    });
    header.setScrollFactor(0).setDepth(100);

    monsters.forEach((monster, index) => {
      const discovered = discoveredIds.has(monster.id);
      const friendship = game.friendshipSystem.getForMonster(monster.id);
      const points = game.metaSystem.state.monsterFriendship[monster.id] ?? 0;
      const friendshipLine = friendship ? ` | Friendship ${points}/${friendship.pointsRequired}` : '';
      new Card(this, layout.centerX, firstRowY + index * rowHeight, layout.contentWidth - 24, rowHeight - 12, {
        title: discovered ? monster.name ?? monster.id : 'Mystery Festival Friend',
        subtitle: discovered ? `${monster.stageId ?? 'Unknown stage'} | ${monster.rank ?? monster.role ?? 'monster'}` : 'Keep exploring to discover this entry.',
        body: discovered ? `${monster.id}${friendshipLine}` : '???',
        imageKey: discovered ? monster.iconKey ?? 'placeholder_icon' : 'placeholder_icon',
        imageKind: 'icon',
        imageSize: compact ? 30 : 36,
        padding: compact ? 12 : 16,
        titleFontSize: compact ? '18px' : '20px',
        subtitleFontSize: compact ? '13px' : '15px',
        bodyFontSize: compact ? '12px' : '14px',
        strokeColor: COLORS.accentSoft
      });
    });

    this.add.rectangle(layout.centerX, layout.height - 58, layout.width, 116, COLORS.background, 0.96)
      .setScrollFactor(0)
      .setDepth(105);
    const back = new Button(this, layout.centerX, layout.height - 68, 240, 54, 'Back', () => this.scene.start('MainMenuScene'));
    back.setScrollFactor(0).setDepth(110);
  }
}
