import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { EncounterEnemyEntry, NodeEncounterPack } from '../../types/GameTypes';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS } from '../../utils/constants';
import { roundPixel, type UiRect } from '../PixelPerfect';
import { UiChip, UiIconSlot } from '../components';
import type { BattleScreenShell } from './BattleScreenShell';

export type MonsterStackPreviewQueueEntry = EncounterEnemyEntry | {
  enemyId: string;
};

const PIXEL_PERFECT = {
  integerCoordinates: true,
  allowFractionalScale: false,
  filtering: 'nearest' as const,
  antiAliasing: false,
  roundPixels: true
};

const STACK_BOUNDS: UiRect = { x: 842, y: 292, w: 214, h: 64 };

function iconSpec(id: string, x: number, y: number, size: number, assetKey: string): UiComponentSpec {
  return {
    id,
    type: 'iconSlot',
    assetKey,
    fallbackAssetKey: 'placeholder_icon',
    canonicalFolder: 'public/assets/sprites/monsters/',
    expectedSourceSize: { w: 627, h: 627 },
    runtimeRenderSize: { w: size, h: size },
    x,
    y,
    w: size,
    h: size,
    anchor: 'center',
    fitMode: 'iconCenter',
    scaleMode: 'fitInteger',
    safePadding: 0,
    zIndex: 56,
    dynamicTextAllowed: false,
    pixelPerfect: PIXEL_PERFECT,
    notes: 'UI-5 monster stack icon. Counts render as text.'
  };
}

function chipSpec(id: string, x: number, y: number, w: number, h: number, assetKey: string): UiComponentSpec {
  return {
    id,
    type: 'chip',
    assetKey,
    fallbackAssetKey: 'ui_panel_default',
    canonicalFolder: 'public/assets/ui/hud/',
    expectedSourceSize: { w: 627, h: 627 },
    runtimeRenderSize: { w, h },
    x,
    y,
    w,
    h,
    anchor: 'topLeft',
    fitMode: 'iconCenter',
    scaleMode: 'fitInteger',
    safePadding: 8,
    zIndex: 58,
    dynamicTextAllowed: true,
    pixelPerfect: PIXEL_PERFECT,
    notes: 'UI-5 monster stack chip. Dynamic count is Phaser text.'
  };
}

export class MonsterStackPreview {
  readonly root: Phaser.GameObjects.Container;
  readonly bounds: UiRect = { ...STACK_BOUNDS };

  private readonly scene: Phaser.Scene;
  private readonly shell: BattleScreenShell;
  private readonly getMonsterIconKey: (enemyId: string) => string;
  private debugVisible = false;
  private debugRect?: Phaser.GameObjects.Rectangle;
  private renderedObjects: Array<{ destroy: () => void }> = [];

  constructor(
    scene: Phaser.Scene,
    shell: BattleScreenShell,
    options: { getMonsterIconKey?: (enemyId: string) => string } = {}
  ) {
    this.scene = scene;
    this.shell = shell;
    this.getMonsterIconKey = options.getMonsterIconKey ?? ((enemyId) => `ico_${enemyId}`);
    this.root = scene.add.container(0, 0).setName('monsterStackPreview.root');
  }

  create(): this {
    this.shell.combatUiLayer.add(this.root);
    this.render([]);
    return this;
  }

  destroy(): void {
    this.clearRendered();
    this.debugRect?.destroy();
    this.root.destroy(true);
  }

  refresh(currentEnemyIndex: number, pack?: NodeEncounterPack | null): void {
    if (!pack) {
      this.updateQueue([]);
      return;
    }
    const queue = pack.enemies.slice(Math.max(0, currentEnemyIndex));
    this.updateQueue(queue);
  }

  updateQueue(monsters: MonsterStackPreviewQueueEntry[] | NodeEncounterPack | null | undefined): void {
    if (!monsters) {
      this.render([]);
      return;
    }
    if (Array.isArray(monsters)) {
      this.render(monsters);
      return;
    }
    this.render(monsters.enemies.slice(Math.max(0, monsters.currentEnemyIndex)));
  }

  setVisible(visible: boolean): void {
    this.root.setVisible(visible);
  }

  setDebugVisible(enabled: boolean): void {
    this.debugVisible = enabled;
    if (!enabled) {
      this.debugRect?.setVisible(false);
      return;
    }
    if (!this.debugRect) {
      this.debugRect = this.scene.add
        .rectangle(STACK_BOUNDS.x, STACK_BOUNDS.y, STACK_BOUNDS.w, STACK_BOUNDS.h)
        .setOrigin(0, 0)
        .setStrokeStyle(2, COLORS.gold, 0.8)
        .setFillStyle(0x000000, 0);
      this.root.add(this.debugRect);
    }
    this.debugRect.setVisible(true);
  }

  private render(queue: MonsterStackPreviewQueueEntry[]): void {
    this.clearRendered();
    if (queue.length <= 1) {
      this.root.setVisible(false);
      this.setDebugVisible(this.debugVisible);
      return;
    }

    this.root.setVisible(true);
    const iconSize = 56;
    const active = queue[0];
    const next = queue[1];
    const hiddenCount = Math.max(0, queue.length - 2);

    if (hiddenCount > 0) {
      const mystery = new UiChip(
        this.scene,
        chipSpec('monster_stack_mystery_chip', STACK_BOUNDS.x + 104, STACK_BOUNDS.y + 16, 52, 32, 'ui_monster_stack_mystery_chip'),
        { text: `+${hiddenCount}`, debug: false }
      );
      mystery.root.setAlpha(0.84);
      this.root.add(mystery.root);
      this.renderedObjects.push(mystery);
    }

    if (next) {
      const nextIcon = new UiIconSlot(
        this.scene,
        iconSpec('monster_stack_next_icon', STACK_BOUNDS.x + 64, STACK_BOUNDS.y + 32, iconSize, this.getIconKey(next.enemyId)),
        { debug: false }
      );
      nextIcon.root.setAlpha(0.72);
      this.root.add(nextIcon.root);
      this.renderedObjects.push(nextIcon);
    }

    const activeIcon = new UiIconSlot(
      this.scene,
      iconSpec('monster_stack_active_icon', STACK_BOUNDS.x + 32, STACK_BOUNDS.y + 32, iconSize, this.getIconKey(active.enemyId)),
      { debug: false, selected: true }
    );
    this.root.add(activeIcon.root);
    this.renderedObjects.push(activeIcon);

    const count = new UiChip(
      this.scene,
      chipSpec('monster_stack_count_chip', STACK_BOUNDS.x + 128, STACK_BOUNDS.y + 18, 76, 28, 'ui_monster_stack_chip'),
      { text: `${queue.length} left`, debug: false }
    );
    this.root.add(count.root);
    this.renderedObjects.push(count);

    this.setDebugVisible(this.debugVisible);
  }

  private getIconKey(enemyId: string): string {
    const raw = this.getMonsterIconKey(enemyId);
    const game = this.scene.game as BlockmancerGame;
    return game.assetSystem.hasAssetKey(raw) ? raw : `ico_${enemyId}`;
  }

  private clearRendered(): void {
    this.renderedObjects.forEach((object) => object.destroy());
    this.renderedObjects = [];
  }
}
