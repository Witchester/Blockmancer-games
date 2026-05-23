import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { NodeEncounterPack } from '../types/GameTypes';
import { FONT_FAMILY } from '../utils/constants';

export type MonsterStackPreviewProps = {
  activeEncounterPack?: NodeEncounterPack | null;
  currentEnemyIndex: number;
  getMonsterIconKey: (enemyId: string) => string;
  maxVisibleIcons?: number;
  compact?: boolean;
};

export class MonsterStackPreview extends Phaser.GameObjects.Container {
  private readonly props: MonsterStackPreviewProps;
  private lastRenderedIndex = -1;

  constructor(scene: Phaser.Scene, x: number, y: number, props: MonsterStackPreviewProps) {
    super(scene, x, y);
    this.props = {
      maxVisibleIcons: 3,
      compact: false,
      ...props
    };

    scene.add.existing(this);
    this.updateStack(false);
  }

  refresh(currentEnemyIndex: number, pack?: NodeEncounterPack | null): void {
    const changedIndex = currentEnemyIndex !== this.lastRenderedIndex;
    this.props.currentEnemyIndex = currentEnemyIndex;
    if (pack !== undefined) {
      this.props.activeEncounterPack = pack;
    }

    this.updateStack(changedIndex);
  }

  private updateStack(animate = false): void {
    this.removeAll(true);

    const pack = this.props.activeEncounterPack;
    if (!pack || pack.enemies.length <= 1) {
      this.lastRenderedIndex = this.props.currentEnemyIndex;
      this.setVisible(false);
      return;
    }

    const clampedIndex = Phaser.Math.Clamp(this.props.currentEnemyIndex, 0, Math.max(0, pack.enemies.length - 1));
    const currentEnemy = pack.enemies[clampedIndex];
    const nextEnemy = pack.enemies[clampedIndex + 1];
    const enemiesLeftAfterCurrent = Math.max(0, pack.enemies.length - clampedIndex - 1);
    const hiddenEnemyCount = Math.max(0, enemiesLeftAfterCurrent - 1);
    const iconSize = this.getIconSize();
    const peekOffset = Math.round(iconSize * 0.5);
    const hiddenOffset = Math.round(iconSize * 0.96);
    const textOffset = hiddenEnemyCount > 0 ? hiddenOffset + iconSize * 0.7 : peekOffset + iconSize * 0.7;

    if (!currentEnemy) {
      this.lastRenderedIndex = clampedIndex;
      this.setVisible(false);
      return;
    }

    this.setVisible(true);

    if (hiddenEnemyCount > 0) {
      const mysteryChip = this.createIcon(hiddenOffset, 0, 'ico_mystery_monster');
      mysteryChip.setAlpha(0.76);
      this.add(mysteryChip);
    }

    if (nextEnemy) {
      const nextIcon = this.createIcon(peekOffset, 0, this.props.getMonsterIconKey(nextEnemy.enemyId));
      nextIcon.setAlpha(0.88);
      this.add(nextIcon);
    }

    const activeIcon = this.createIcon(0, 0, this.props.getMonsterIconKey(currentEnemy.enemyId));
    activeIcon.setAlpha(1);
    this.add(activeIcon);

    if (enemiesLeftAfterCurrent > 0) {
      const label = this.scene.add.text(textOffset, 0, `${enemiesLeftAfterCurrent} left`, {
        fontFamily: FONT_FAMILY,
        fontSize: iconSize <= 24 ? '11px' : '12px',
        color: '#f6f7ff',
        stroke: '#090b13',
        strokeThickness: 3
      }).setOrigin(0, 0.5);
      this.add(label);
    }

    this.lastRenderedIndex = clampedIndex;

    if (animate) {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 110,
        yoyo: true,
        ease: 'Quad.easeOut'
      });
    }
  }

  private createIcon(x: number, y: number, assetKey: string): Phaser.GameObjects.Image {
    const image = (this.scene.game as BlockmancerGame).assetSystem.createImageByAssetKey(
      this.scene,
      assetKey,
      'uiIcon',
      x,
      y,
      { kind: 'icon' }
    );
    image.setDisplaySize(this.getIconSize(), this.getIconSize());
    return image;
  }

  private getIconSize(): number {
    if (this.props.compact || this.scene.scale.width <= 430) {
      return 24;
    }
    if (this.scene.scale.width >= 900) {
      return 32;
    }
    return 28;
  }
}
