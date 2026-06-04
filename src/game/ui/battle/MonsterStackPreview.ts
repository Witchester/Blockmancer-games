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

export type MonsterStackViewModel = {
  activeEnemyId: string | null;
  nextEnemyId: string | null;
  hiddenEnemyCount: number;
  totalEnemies: number;
  currentEnemyIndex: number;
  isFinalEnemy: boolean;
  shouldShowStack: boolean;
};

const PIXEL_PERFECT = {
  integerCoordinates: true,
  allowFractionalScale: false,
  filtering: 'nearest' as const,
  antiAliasing: false,
  roundPixels: true
};

export const MONSTER_STACK_BOUNDS: UiRect = { x: 920, y: 104, w: 152, h: 40 };
const ACTIVE_ICON_SIZE = 36;
const NEXT_ICON_SIZE = 32;
const NEXT_PEEK_OFFSET = 18;
const COUNT_CHIP_SIZE = 32;

function enemyIdOf(entry: MonsterStackPreviewQueueEntry | null | undefined): string | null {
  return typeof entry?.enemyId === 'string' && entry.enemyId.length > 0 ? entry.enemyId : null;
}

export function buildMonsterStackViewModel(
  monsters: MonsterStackPreviewQueueEntry[] | NodeEncounterPack | null | undefined
): MonsterStackViewModel {
  const isPack = Boolean(monsters && !Array.isArray(monsters));
  const entries = Array.isArray(monsters)
    ? monsters
    : isPack && Array.isArray((monsters as NodeEncounterPack).enemies)
      ? (monsters as NodeEncounterPack).enemies
      : [];
  const rawIndex = isPack && Number.isFinite((monsters as NodeEncounterPack).currentEnemyIndex)
    ? Math.floor((monsters as NodeEncounterPack).currentEnemyIndex)
    : 0;
  const currentEnemyIndex = entries.length > 0
    ? Phaser.Math.Clamp(rawIndex, 0, entries.length - 1)
    : 0;
  const activeEnemyId = enemyIdOf(entries[currentEnemyIndex]);
  const nextEnemyId = enemyIdOf(entries[currentEnemyIndex + 1]);
  const hiddenEnemyCount = Math.max(0, entries.length - currentEnemyIndex - 2);
  const completed = isPack && (monsters as NodeEncounterPack).encounterPackCompleted === true;

  return {
    activeEnemyId,
    nextEnemyId,
    hiddenEnemyCount,
    totalEnemies: entries.length,
    currentEnemyIndex,
    isFinalEnemy: Boolean(activeEnemyId) && !nextEnemyId,
    shouldShowStack: !completed && Boolean(activeEnemyId) && Boolean(nextEnemyId)
  };
}

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
  readonly bounds: UiRect = { ...MONSTER_STACK_BOUNDS };

  private readonly scene: Phaser.Scene;
  private readonly shell: BattleScreenShell;
  private readonly getMonsterIconKey: (enemyId: string) => string;
  private debugVisible = false;
  private debugRect?: Phaser.GameObjects.Rectangle;
  private renderedObjects: Array<{ destroy: () => void }> = [];
  private renderKey = '';

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
    this.updateQueue([]);
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
    this.updateQueue({ ...pack, currentEnemyIndex });
  }

  updateQueue(monsters: MonsterStackPreviewQueueEntry[] | NodeEncounterPack | null | undefined): void {
    this.render(buildMonsterStackViewModel(monsters));
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
        .rectangle(MONSTER_STACK_BOUNDS.x, MONSTER_STACK_BOUNDS.y, MONSTER_STACK_BOUNDS.w, MONSTER_STACK_BOUNDS.h)
        .setOrigin(0, 0)
        .setStrokeStyle(2, COLORS.gold, 0.8)
        .setFillStyle(0x000000, 0);
      this.root.add(this.debugRect);
    }
    this.debugRect.setVisible(true);
  }

  private render(view: MonsterStackViewModel): void {
    const nextRenderKey = [
      view.activeEnemyId ?? '',
      view.nextEnemyId ?? '',
      view.hiddenEnemyCount,
      view.shouldShowStack ? 'visible' : 'hidden'
    ].join(':');
    if (nextRenderKey === this.renderKey) {
      return;
    }
    this.renderKey = nextRenderKey;
    this.clearRendered();
    if (!view.shouldShowStack || !view.activeEnemyId || !view.nextEnemyId) {
      this.root.setVisible(false);
      this.setDebugVisible(this.debugVisible);
      return;
    }

    this.root.setVisible(true);

    if (view.hiddenEnemyCount > 0) {
      const mystery = new UiChip(
        this.scene,
        chipSpec(
          'monster_stack_mystery_chip',
          MONSTER_STACK_BOUNDS.x + ACTIVE_ICON_SIZE + NEXT_PEEK_OFFSET + 12,
          MONSTER_STACK_BOUNDS.y + 4,
          COUNT_CHIP_SIZE,
          COUNT_CHIP_SIZE,
          'ui_monster_stack_mystery_chip'
        ),
        { text: `+${view.hiddenEnemyCount}`, debug: false }
      );
      mystery.root.setAlpha(0.9);
      this.root.add(mystery.root);
      this.renderedObjects.push(mystery);
    }

    const nextIcon = new UiIconSlot(
      this.scene,
      iconSpec(
        'monster_stack_next_icon',
        MONSTER_STACK_BOUNDS.x + ACTIVE_ICON_SIZE / 2 + NEXT_PEEK_OFFSET,
        MONSTER_STACK_BOUNDS.y + MONSTER_STACK_BOUNDS.h / 2,
        NEXT_ICON_SIZE,
        this.getIconKey(view.nextEnemyId)
      ),
      { debug: false }
    );
    nextIcon.root.setAlpha(0.76);
    this.root.add(nextIcon.root);
    this.renderedObjects.push(nextIcon);

    const activeIcon = new UiIconSlot(
      this.scene,
      iconSpec(
        'monster_stack_active_icon',
        MONSTER_STACK_BOUNDS.x + ACTIVE_ICON_SIZE / 2,
        MONSTER_STACK_BOUNDS.y + MONSTER_STACK_BOUNDS.h / 2,
        ACTIVE_ICON_SIZE,
        this.getIconKey(view.activeEnemyId)
      ),
      { debug: false, selected: true }
    );
    this.root.add(activeIcon.root);
    this.renderedObjects.push(activeIcon);

    this.setDebugVisible(this.debugVisible);
  }

  private getIconKey(enemyId: string): string {
    const raw = this.getMonsterIconKey(enemyId);
    const game = this.scene.game as BlockmancerGame;
    return typeof raw === 'string' && raw.length > 0 && game.assetSystem.hasAssetKey(raw)
      ? raw
      : 'asset_missing_icon';
  }

  private clearRendered(): void {
    this.renderedObjects.forEach((object) => object.destroy());
    this.renderedObjects = [];
  }
}
