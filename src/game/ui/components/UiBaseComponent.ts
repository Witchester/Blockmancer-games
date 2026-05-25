import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { AssetKind } from '../../data/assets';
import type { AssetDisplayCategory } from '../../data/asset-display-rules';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS, FONT_FAMILY } from '../../utils/constants';
import { normalizePixelPerfectComponent, roundPixel, type UiRect } from '../PixelPerfect';
import {
  inferAssetKind,
  resolveAssetSlot,
  resolveFallbackSafeAssetKey,
  validateAssetDropInReadiness,
  type UiResolvedAssetSlot
} from '../UiAssetSlotResolver';

export type UiComponentState = 'default' | 'disabled' | 'pressed' | 'selected' | 'locked' | 'alert' | 'hidden';

export type UiComponentOptions = {
  debug?: boolean;
  state?: UiComponentState;
  visible?: boolean;
  alpha?: number;
  depthOffset?: number;
};

export type UiStateStyle = {
  alpha: number;
  tint?: number;
  strokeColor?: number;
  fillColor?: number;
};

export const UI_STATE_STYLES: Record<UiComponentState, UiStateStyle> = {
  default: { alpha: 1 },
  disabled: { alpha: 0.5, tint: 0x8a8fa8, strokeColor: 0x555a75 },
  pressed: { alpha: 0.9, tint: 0xd9e2ff, strokeColor: COLORS.gold },
  selected: { alpha: 1, strokeColor: COLORS.success },
  locked: { alpha: 0.45, tint: 0x778099, strokeColor: 0x5c617a },
  alert: { alpha: 1, strokeColor: COLORS.danger },
  hidden: { alpha: 0 }
};

export function getUiAssetDisplayCategory(component: UiComponentSpec): AssetDisplayCategory {
  if (component.type === 'backgroundLayer') return 'stageBackground';
  if (component.type === 'iconSlot') return 'uiIcon';
  if (component.type === 'spriteSlot' && component.id.includes('board_block')) return 'boardBlock';
  if (component.type === 'spriteSlot' && component.assetKey.startsWith('hero_')) return 'heroPoseSheet';
  if (component.type === 'spriteSlot' && component.assetKey.startsWith('boss_')) return 'bossPoseSheet';
  if (component.type === 'spriteSlot' && component.assetKey.startsWith('mon_')) return 'monsterPoseSheet';
  if (component.type === 'vfxSlot') return component.w >= 160 || component.h >= 160 ? 'vfxCombatLarge' : 'vfxCombatSmall';
  if (component.type === 'meter' || component.type === 'button' || component.type === 'panel') return 'uiIcon';
  return 'uiIcon';
}

export function getComponentOrigin(component: UiComponentSpec): { x: number; y: number } {
  if (component.anchor === 'center' || component.anchor === 'vfxCenter') return { x: 0.5, y: 0.5 };
  if (component.anchor === 'bottomCenter') return { x: 0.5, y: 1 };
  return { x: 0, y: 0 };
}

export function getComponentBounds(component: UiComponentSpec): UiRect {
  const spec = normalizePixelPerfectComponent(component);
  if (spec.anchor === 'center' || spec.anchor === 'vfxCenter') {
    return {
      x: roundPixel(spec.x - spec.w / 2),
      y: roundPixel(spec.y - spec.h / 2),
      w: spec.w,
      h: spec.h
    };
  }
  if (spec.anchor === 'bottomCenter') {
    return {
      x: roundPixel(spec.x - spec.w / 2),
      y: roundPixel(spec.y - spec.h),
      w: spec.w,
      h: spec.h
    };
  }
  return {
    x: spec.x,
    y: spec.y,
    w: spec.w,
    h: spec.h
  };
}

export function getComponentCenter(component: UiComponentSpec): { x: number; y: number } {
  const bounds = getComponentBounds(component);
  return {
    x: roundPixel(bounds.x + bounds.w / 2),
    y: roundPixel(bounds.y + bounds.h / 2)
  };
}

export function isUiDebugEnabled(scene: Phaser.Scene, explicit?: boolean): boolean {
  if (explicit !== undefined) return explicit;
  const registryValue = scene.registry?.get('uiDebug');
  return registryValue === true || (import.meta.env.DEV && registryValue === 'true');
}

export class UiBaseComponent {
  readonly id: string;
  readonly scene: Phaser.Scene;
  readonly spec: UiComponentSpec;
  readonly root: Phaser.GameObjects.Container;

  protected readonly bounds: UiRect;
  protected state: UiComponentState;
  protected readonly debug: boolean;
  protected debugObjects: Phaser.GameObjects.GameObject[] = [];
  protected interactiveTarget?: Phaser.GameObjects.GameObject;

  constructor(scene: Phaser.Scene, spec: UiComponentSpec, options: UiComponentOptions = {}) {
    this.scene = scene;
    this.spec = normalizePixelPerfectComponent(spec);
    this.id = this.spec.id;
    this.bounds = getComponentBounds(this.spec);
    this.state = options.state ?? 'default';
    this.debug = isUiDebugEnabled(scene, options.debug);
    this.root = scene.add.container(this.bounds.x, this.bounds.y);
    this.root.setDepth(roundPixel(this.spec.zIndex + (options.depthOffset ?? 0)));
    this.root.setVisible(options.visible ?? this.state !== 'hidden');
    this.root.setAlpha(options.alpha ?? UI_STATE_STYLES[this.state].alpha);
  }

  validate(): string[] {
    return validateAssetDropInReadiness(this.spec).errors;
  }

  getBounds(): UiRect {
    return { ...this.bounds };
  }

  setVisible(visible: boolean): this {
    this.root.setVisible(visible);
    return this;
  }

  setAlpha(alpha: number): this {
    this.root.setAlpha(alpha);
    return this;
  }

  setDepth(depth: number): this {
    this.root.setDepth(roundPixel(depth));
    return this;
  }

  setState(state: UiComponentState): this {
    this.state = state;
    const style = UI_STATE_STYLES[state];
    this.root.setAlpha(style.alpha);
    this.root.setVisible(state !== 'hidden');
    return this;
  }

  setEnabled(enabled: boolean): this {
    this.setState(enabled ? 'default' : 'disabled');
    if (this.interactiveTarget) {
      if (enabled) {
        this.interactiveTarget.setInteractive();
      } else {
        this.interactiveTarget.disableInteractive();
      }
    }
    return this;
  }

  destroy(): void {
    this.debugObjects.forEach((object) => object.destroy());
    this.debugObjects = [];
    this.root.destroy(true);
  }

  protected get game(): BlockmancerGame {
    return this.scene.game as BlockmancerGame;
  }

  protected resolveAssetKey(kind?: AssetKind | 'block'): string {
    const assetSystem = this.game.assetSystem;
    return resolveFallbackSafeAssetKey(this.spec, (assetKey) => assetSystem.hasAssetKey(assetKey));
  }

  protected resolveAssetSlot(assetKey?: string, fallbackAssetKey = this.spec.fallbackAssetKey): UiResolvedAssetSlot {
    const component = assetKey
      ? {
          ...this.spec,
          assetKey,
          fallbackAssetKey
        }
      : this.spec;
    return resolveAssetSlot(this.scene, component, { debug: this.debug });
  }

  protected createSlotImage(
    assetKey?: string,
    kind: AssetKind | 'block' = inferAssetKind(this.spec),
    options: { fit?: 'exact' | 'contain'; flipX?: boolean; alpha?: number } = {}
  ): Phaser.GameObjects.Image {
    const local = this.getLocalAnchorPoint();
    const resolved = this.resolveAssetSlot(assetKey);
    const image = this.game.assetSystem.addImage(this.scene, local.x, local.y, resolved.textureKey ?? resolved.placeholderKey ?? this.resolveAssetKey(kind), kind);
    const origin = getComponentOrigin(this.spec);
    image.setOrigin(origin.x, origin.y);
    if (options.flipX) image.setFlipX(true);
    if (typeof options.alpha === 'number') image.setAlpha(options.alpha);
    this.fitImageToSlot(image, options.fit ?? (this.spec.fitMode === 'contain' ? 'contain' : 'exact'));
    image.setDepth(this.root.depth);
    this.root.add(image);
    return image;
  }

  protected fitImageToSlot(image: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, fit: 'exact' | 'contain' = 'exact'): void {
    const width = Math.max(1, this.spec.w);
    const height = Math.max(1, this.spec.h);
    if (fit === 'contain') {
      this.game.assetSystem.fitSpriteToBox(image, width, height);
      image.setDisplaySize(roundPixel(image.displayWidth), roundPixel(image.displayHeight));
      return;
    }
    image.setDisplaySize(width, height);
  }

  protected addDebug(): void {
    if (!this.debug) return;
    const outline = this.scene.add
      .rectangle(0, 0, this.bounds.w, this.bounds.h)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.gold, 0.85)
      .setFillStyle(0x000000, 0);
    const label = this.scene.add.text(4, 4, `${this.id} z${this.spec.zIndex}`, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      backgroundColor: '#05060a'
    });
    this.root.add([outline, label]);
    this.debugObjects.push(outline, label);
  }

  protected createHitZone(minSize = 0): Phaser.GameObjects.Zone {
    const width = Math.max(this.bounds.w, minSize);
    const height = Math.max(this.bounds.h, minSize);
    const zone = this.scene.add.zone(roundPixel(this.bounds.w / 2), roundPixel(this.bounds.h / 2), width, height);
    zone.setOrigin(0.5, 0.5);
    this.root.add(zone);
    this.interactiveTarget = zone;
    return zone;
  }

  protected createText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    origin: { x: number; y: number } = { x: 0, y: 0 }
  ): Phaser.GameObjects.Text {
    const label = this.scene.add.text(roundPixel(x), roundPixel(y), text, style).setOrigin(origin.x, origin.y);
    label.setResolution(1);
    this.root.add(label);
    return label;
  }

  private getLocalAnchorPoint(): { x: number; y: number } {
    if (this.spec.anchor === 'center' || this.spec.anchor === 'vfxCenter') {
      return { x: roundPixel(this.bounds.w / 2), y: roundPixel(this.bounds.h / 2) };
    }
    if (this.spec.anchor === 'bottomCenter') {
      return { x: roundPixel(this.bounds.w / 2), y: this.bounds.h };
    }
    return { x: 0, y: 0 };
  }
}
