import Phaser from 'phaser';
import type { UiComponentSpec } from '../../types/ui-layout';
import { COLORS, FONT_FAMILY } from '../../utils/constants';
import { computePortraitFrame, PORTRAIT_FRAME_HEIGHT, PORTRAIT_FRAME_WIDTH, type PortraitFrame } from '../PortraitFrame';
import { roundPixel, type UiRect } from '../PixelPerfect';
import { resolveAssetSlot, type UiResolvedAssetSlot } from '../UiAssetSlotResolver';

import { validateUiLayoutSpec } from '../UiLayoutValidator';

export type BattleShellSectionId = 'combat' | 'puzzle' | 'controls';

export type BattleShellSectionBounds = UiRect;

export type BattleScreenShellValidation = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

export type BattleScreenShellOptions = {
  debug?: boolean;
  rootDepth?: number;
};

export type BattleScreenShellBackgroundStatus = {
  componentId: string;
  sectionId: BattleShellSectionId;
  assetKey: string;
  fallbackAssetKey: string;
  resolved: UiResolvedAssetSlot;
};

export const BATTLE_SHELL_SECTION_BOUNDS: Record<BattleShellSectionId, BattleShellSectionBounds> = {
  combat: { x: 0, y: 0, w: 1080, h: 480 },
  puzzle: { x: 0, y: 480, w: 1080, h: 1056 },
  controls: { x: 0, y: 1536, w: 1080, h: 384 }
};

const PIXEL_PERFECT = {
  integerCoordinates: true,
  allowFractionalScale: false,
  filtering: 'nearest' as const,
  antiAliasing: false,
  roundPixels: true
};

function backgroundSpec(
  id: string,
  sectionId: BattleShellSectionId,
  assetKey: string,
  fallbackAssetKey: string,
  canonicalFolder: string,
  zIndex: number,
  alpha = 1
): UiComponentSpec & { shellAlpha: number; sectionId: BattleShellSectionId } {
  const bounds = BATTLE_SHELL_SECTION_BOUNDS[sectionId];
  return {
    id,
    type: 'backgroundLayer',
    assetKey,
    fallbackAssetKey,
    canonicalFolder,
    expectedSourceSize: { w: bounds.w, h: bounds.h },
    runtimeRenderSize: { w: bounds.w, h: bounds.h },
    x: 0,
    y: 0,
    w: bounds.w,
    h: bounds.h,
    anchor: 'topLeft',
    fitMode: 'exact',
    scaleMode: 'backgroundExact',
    safePadding: 0,
    zIndex,
    dynamicTextAllowed: false,
    pixelPerfect: PIXEL_PERFECT,
    notes: `UI-4 ${sectionId} section background layer.`,
    shellAlpha: alpha,
    sectionId
  };
}

export const BATTLE_SHELL_BACKGROUND_SPECS = [
  backgroundSpec('battle_background_far_shell', 'combat', 'bg_stage_sprinkle_sewers_battle_far', 'placeholder_battle_background', 'public/assets/stages/stage_sprinkle_sewers/battle/', 0, 0.58),
  backgroundSpec('battle_background_mid_shell', 'combat', 'bg_stage_sprinkle_sewers_battle_mid', 'placeholder_battle_background', 'public/assets/stages/stage_sprinkle_sewers/battle/', 1, 0.78),
  backgroundSpec('battle_background_near_shell', 'combat', 'bg_stage_sprinkle_sewers_battle_near', 'placeholder_battle_background', 'public/assets/stages/stage_sprinkle_sewers/battle/', 2, 0.9),
  backgroundSpec('puzzle_background_far_shell', 'puzzle', 'bg_stage_sprinkle_sewers_puzzle_far', 'placeholder_puzzle_background', 'public/assets/stages/stage_sprinkle_sewers/puzzle/', 0, 0.34),
  backgroundSpec('puzzle_background_mid_shell', 'puzzle', 'bg_stage_sprinkle_sewers_puzzle_mid', 'placeholder_puzzle_background', 'public/assets/stages/stage_sprinkle_sewers/puzzle/', 1, 0.52),
  backgroundSpec('puzzle_background_near_shell', 'puzzle', 'bg_stage_sprinkle_sewers_puzzle_near', 'placeholder_puzzle_background', 'public/assets/stages/stage_sprinkle_sewers/puzzle/', 2, 0.62),
  backgroundSpec('controls_background_panel_shell', 'controls', 'ui_panel_controls', 'placeholder_controls_background', 'public/assets/ui/mobile-controls/', 0, 0.94)
] as const;

export class BattleScreenShell {
  readonly scene: Phaser.Scene;
  readonly root: Phaser.GameObjects.Container;
  readonly combatSection: Phaser.GameObjects.Container;
  readonly combatBackgroundLayer: Phaser.GameObjects.Container;
  readonly combatUiLayer: Phaser.GameObjects.Container;
  readonly combatVfxLayer: Phaser.GameObjects.Container;
  readonly eventLogLayer: Phaser.GameObjects.Container;
  readonly puzzleSection: Phaser.GameObjects.Container;
  readonly puzzleBackgroundLayer: Phaser.GameObjects.Container;
  readonly boardLayer: Phaser.GameObjects.Container;
  readonly leftRailLayer: Phaser.GameObjects.Container;
  readonly rightRailLayer: Phaser.GameObjects.Container;
  readonly controlsSection: Phaser.GameObjects.Container;
  readonly controlsBackgroundLayer: Phaser.GameObjects.Container;
  readonly controlsButtonLayer: Phaser.GameObjects.Container;
  readonly modalLayer: Phaser.GameObjects.Container;
  readonly debugLayer: Phaser.GameObjects.Container;

  private readonly debugDefault: boolean;
  private frame: PortraitFrame;
  private created = false;
  private debugObjects: Phaser.GameObjects.GameObject[] = [];
  private backgroundStatuses: BattleScreenShellBackgroundStatus[] = [];

  constructor(scene: Phaser.Scene, options: BattleScreenShellOptions = {}) {
    this.scene = scene;
    this.debugDefault = options.debug ?? false;
    this.frame = computePortraitFrame(scene.scale.width, scene.scale.height);
    this.root = this.makeContainer('battleShell.root', 0, 0);
    this.root.setDepth(options.rootDepth ?? -35);

    this.combatSection = this.makeSectionContainer('battleShell.combatSection', 'combat');
    this.combatBackgroundLayer = this.makeContainer('battleShell.combatBackgroundLayer', 0, 0);
    this.combatUiLayer = this.makeContainer('battleShell.combatUiLayer', 0, 0);
    this.combatVfxLayer = this.makeContainer('battleShell.combatVfxLayer', 0, 0);
    this.eventLogLayer = this.makeContainer('battleShell.eventLogLayer', 0, 0);

    this.puzzleSection = this.makeSectionContainer('battleShell.puzzleSection', 'puzzle');
    this.puzzleBackgroundLayer = this.makeContainer('battleShell.puzzleBackgroundLayer', 0, 0);
    this.boardLayer = this.makeContainer('battleShell.boardLayer', 0, 0);
    this.leftRailLayer = this.makeContainer('battleShell.leftRailLayer', 0, 0);
    this.rightRailLayer = this.makeContainer('battleShell.rightRailLayer', 0, 0);

    this.controlsSection = this.makeSectionContainer('battleShell.controlsSection', 'controls');
    this.controlsBackgroundLayer = this.makeContainer('battleShell.controlsBackgroundLayer', 0, 0);
    this.controlsButtonLayer = this.makeContainer('battleShell.controlsButtonLayer', 0, 0);

    this.modalLayer = this.makeContainer('battleShell.modalLayer', 0, 0);
    this.debugLayer = this.makeContainer('battleShell.debugLayer', 0, 0);
  }

  create(): this {
    if (this.created) return this;

    this.root.add([this.combatSection, this.puzzleSection, this.controlsSection, this.modalLayer, this.debugLayer]);
    this.combatSection.add([this.combatBackgroundLayer, this.combatUiLayer, this.combatVfxLayer]);
    this.puzzleSection.add([this.puzzleBackgroundLayer, this.eventLogLayer, this.boardLayer, this.leftRailLayer, this.rightRailLayer]);
    this.controlsSection.add([this.controlsBackgroundLayer, this.controlsButtonLayer]);

    this.createSectionBackgrounds();
    this.createSectionFallbackPanels();
    this.resize(this.scene.scale.width, this.scene.scale.height);
    this.setDebugVisible(this.debugDefault);
    this.created = true;
    return this;
  }

  destroy(): void {
    this.debugObjects.forEach((object) => object.destroy());
    this.debugObjects = [];
    this.root.destroy(true);
    this.created = false;
  }

  resize(viewportWidth: number, viewportHeight: number): PortraitFrame {
    this.frame = computePortraitFrame(viewportWidth, viewportHeight);
    this.root.setPosition(this.frame.frameX, this.frame.frameY);
    this.root.setScale(this.frame.scale);
    return this.frame;
  }

  getFrame(): PortraitFrame {
    return { ...this.frame };
  }

  getBackgroundStatuses(): BattleScreenShellBackgroundStatus[] {
    return [...this.backgroundStatuses];
  }

  getSectionBounds(sectionId: BattleShellSectionId): BattleShellSectionBounds {
    return { ...BATTLE_SHELL_SECTION_BOUNDS[sectionId] };
  }

  getSectionContainer(sectionId: BattleShellSectionId): Phaser.GameObjects.Container {
    if (sectionId === 'combat') return this.combatSection;
    if (sectionId === 'puzzle') return this.puzzleSection;
    return this.controlsSection;
  }

  setDebugVisible(enabled: boolean): void {
    this.debugLayer.setVisible(enabled);
    if (enabled && this.debugObjects.length === 0) {
      this.createDebugOverlay();
    }
  }

  validateShell(): BattleScreenShellValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const expected = BATTLE_SHELL_SECTION_BOUNDS;

    if (expected.combat.y !== 0 || expected.combat.h !== 480) errors.push('combat section must be x0 y0 w1080 h480.');
    if (expected.puzzle.y !== 480 || expected.puzzle.h !== 1056) errors.push('puzzle section must be x0 y480 w1080 h1056.');
    if (expected.controls.y !== 1536 || expected.controls.h !== 384) errors.push('controls section must be x0 y1536 w1080 h384.');
    if (expected.combat.y + expected.combat.h > expected.puzzle.y) errors.push('combat section overlaps puzzle section.');
    if (expected.puzzle.y + expected.puzzle.h > expected.controls.y) errors.push('puzzle section overlaps controls section.');
    if (this.eventLogLayer.parentContainer !== this.puzzleSection) errors.push('eventLogLayer must stay inside puzzleSection.');
    if (!this.controlsSection.visible) warnings.push('controlsSection is currently hidden.');
    if (this.frame.width <= 0 || this.frame.height <= 0 || this.frame.scale <= 0) warnings.push('portrait frame has invalid viewport scale.');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  createDebugOverlay(): void {
    this.debugObjects.forEach((object) => object.destroy());
    this.debugObjects = [];

    const colors: Record<BattleShellSectionId, number> = {
      combat: 0xffca6b,
      puzzle: 0x65d6a5,
      controls: 0x9adfff
    };

    (Object.keys(BATTLE_SHELL_SECTION_BOUNDS) as BattleShellSectionId[]).forEach((sectionId) => {
      const bounds = BATTLE_SHELL_SECTION_BOUNDS[sectionId];
      const rect = this.scene.add
        .rectangle(bounds.x, bounds.y, bounds.w, bounds.h)
        .setOrigin(0, 0)
        .setStrokeStyle(4, colors[sectionId], 0.9)
        .setFillStyle(0x000000, 0);
      const label = this.scene.add.text(bounds.x + 12, bounds.y + 10, `${sectionId} ${bounds.w}x${bounds.h}`, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        backgroundColor: '#05060a'
      });
      this.debugLayer.add([rect, label]);
      this.debugObjects.push(rect, label);
    });
  }

  private createSectionBackgrounds(): void {
    this.backgroundStatuses = [];
    BATTLE_SHELL_BACKGROUND_SPECS.forEach((spec) => {
      const layer = this.backgroundLayerFor(spec.sectionId);
      const resolved = resolveAssetSlot(this.scene, spec, { debug: this.debugDefault });
      this.backgroundStatuses.push({
        componentId: spec.id,
        sectionId: spec.sectionId,
        assetKey: spec.assetKey,
        fallbackAssetKey: spec.fallbackAssetKey,
        resolved
      });

      if (!resolved.textureKey) {
        return;
      }

      const image = this.scene.add.image(0, 0, resolved.textureKey).setOrigin(0, 0);
      image.setName(spec.id);
      image.setDisplaySize(spec.w, spec.h);
      image.setAlpha(spec.shellAlpha);
      image.setDepth(spec.zIndex);
      image.setTexture(resolved.textureKey);
      layer.add(image);
      this.applyNearestTexture(image);
    });
  }

  private createSectionFallbackPanels(): void {
    const panels: Array<[BattleShellSectionId, Phaser.GameObjects.Container, number, number]> = [
      ['combat', this.combatBackgroundLayer, COLORS.panelAlt, 0.28],
      ['puzzle', this.puzzleBackgroundLayer, COLORS.panel, 0.32],
      ['controls', this.controlsBackgroundLayer, COLORS.panelAlt, 0.56]
    ];
    panels.forEach(([sectionId, layer, fill, alpha]) => {
      const bounds = BATTLE_SHELL_SECTION_BOUNDS[sectionId];
      const panel = this.scene.add
        .rectangle(0, 0, bounds.w, bounds.h, fill, alpha)
        .setOrigin(0, 0)
        .setStrokeStyle(2, COLORS.accentSoft, 0.25);
      panel.setName(`battleShell.${sectionId}FallbackPanel`);
      layer.addAt(panel, 0);
    });
  }

  private backgroundLayerFor(sectionId: BattleShellSectionId): Phaser.GameObjects.Container {
    if (sectionId === 'combat') return this.combatBackgroundLayer;
    if (sectionId === 'puzzle') return this.puzzleBackgroundLayer;
    return this.controlsBackgroundLayer;
  }

  private makeSectionContainer(name: string, sectionId: BattleShellSectionId): Phaser.GameObjects.Container {
    const bounds = BATTLE_SHELL_SECTION_BOUNDS[sectionId];
    return this.makeContainer(name, bounds.x, bounds.y);
  }

  private makeContainer(name: string, x: number, y: number): Phaser.GameObjects.Container {
    return this.scene.add.container(roundPixel(x), roundPixel(y)).setName(name);
  }

  private applyNearestTexture(image: Phaser.GameObjects.Image): void {
    image.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
}

export function validateBattleShellAgainstLayoutSpec(): BattleScreenShellValidation {
  const spec = {
    screenId: 'screen_battle',
    screenName: 'Battle Screen',
    canvas: { width: PORTRAIT_FRAME_WIDTH, height: PORTRAIT_FRAME_HEIGHT, orientation: 'portrait' as const },
    entryFrom: [],
    exitTo: [],
    purpose: 'Runtime UI-4 battle shell validation stub aligned to docs/ui/layouts/screen_battle.layout.json.',
    style: { tone: 'cheerful festival fantasy', pixelArt: true, safeAreaPadding: 32 },
    codegraph: { nodeId: 'screen_battle', relatedSceneFiles: [], relatedComponents: [], relatedAssetKeys: [], relatedSotDocs: [] },
    fonts: {
      title: { fontKey: 'font_pixel_header', sizePx: 56 },
      body: { fontKey: 'font_pixel_body', sizePx: 30 },
      number: { fontKey: 'font_pixel_number', sizePx: 34 },
      small: { fontKey: 'font_pixel_small', sizePx: 22 }
    },
    sections: [
      { id: 'combat', x: 0, y: 0, w: 1080, h: 480, role: 'Combat UI + Event Log', components: [] },
      { id: 'puzzle', x: 0, y: 480, w: 1080, h: 1056, role: 'Puzzle Gameplay Area', components: [] },
      { id: 'controls', x: 0, y: 1536, w: 1080, h: 384, role: 'Controls / Spells / Actions', components: [] }
    ],
    components: [...BATTLE_SHELL_BACKGROUND_SPECS],
    assetPlaceholders: [],
    interactions: [],
    fallbackRules: [],
    acceptanceCriteria: []
  };
  const validation = validateUiLayoutSpec(spec);
  return {
    isValid: validation.isValid,
    errors: validation.errors.map((issue) => issue.message),
    warnings: validation.warnings.map((issue) => issue.message)
  };
}
