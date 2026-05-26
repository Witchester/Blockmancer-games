import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { UiButton, UiIconSlot, UiMeter, UiPanel } from '../ui/components';
import { addOuterBackground, createOuterUiSpec } from '../ui/outer-flow';
import { COLORS, FONT_FAMILY } from '../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    const game = this.game as BlockmancerGame;
    game.assetSystem.ensureFallbackTextures(this);
    this.renderSplash();
    game.assetSystem.preload(this);
  }

  async create(): Promise<void> {
    (this.game as BlockmancerGame).assetSystem.ensureFallbackTextures(this);
    (this.game as BlockmancerGame).assetSystem.registerGameAnimations(this);

    if ('fonts' in document) {
      await Promise.race([
        document.fonts.load(`16px ${FONT_FAMILY}`),
        new Promise((resolve) => window.setTimeout(resolve, 1200))
      ]);
    }

    this.scene.start('MainMenuScene');
  }

  private renderSplash(): void {
    const centerX = this.scale.width / 2;
    const compact = this.scale.width < 560;
    this.cameras.main.setBackgroundColor(COLORS.background);
    addOuterBackground(this, 'bg_scene_splash', 0.32);

    const panelWidth = Math.min(this.scale.width - 72, 520);
    new UiPanel(this, createOuterUiSpec('splash_logo_panel', 'panel', 'ui_panel_default', 'placeholder_panel', centerX - panelWidth / 2, 132, panelWidth, 148, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.88,
      strokeColor: COLORS.gold
    });
    this.add.text(centerX, 174, 'Blockmancer Dungeon', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '32px' : '40px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    this.add.text(centerX, 224, 'Loading the festival dungeon...', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      align: 'center'
    }).setOrigin(0.5);

    new UiIconSlot(this, createOuterUiSpec('blockomatic_loading_icon', 'iconSlot', 'placeholder_icon', 'placeholder_icon', centerX, 364, 72, 72, 'center', 55));
    const meter = new UiMeter(this, createOuterUiSpec('loading_meter', 'meter', 'ui_meter_xp', 'ui_meter_fallback', centerX - 200, 494, 400, 34, 'topLeft', 70), {
      current: 0,
      max: 100,
      fillColor: COLORS.success,
      showValueText: true,
      fillInset: 5
    });
    this.load.on('progress', (value: number) => meter.setValue(Math.round(value * 100), 100, 0));
    new UiButton(this, createOuterUiSpec('tap_to_start_button', 'button', 'ui_button_primary', 'ui_button_default', centerX, 602, 240, 58, 'center', 90), {
      label: 'Loading',
      disabled: true
    });
  }
}
