import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { GameSettings } from '../types/SettingsTypes';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiMeter, UiPanel } from '../ui/components';
import { createSettingsTabs, type SettingsRowAction, type SettingsRowViewModel, type SettingsTabId } from '../ui/settings';
import { COLORS, FONT_FAMILY_STACKS, FONT_SIZE_720 } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

const VOLUME_STEPS = [0, 0.25, 0.5, 0.75, 1];
const TEXT_SPEEDS: GameSettings['textSpeed'][] = ['slow', 'normal', 'fast'];
const BUTTON_SIZES: GameSettings['buttonSize'][] = ['normal', 'large'];

export class SettingsScene extends Phaser.Scene {
  private settings!: GameSettings;
  private activeTab: SettingsTabId = 'audio';

  constructor() {
    super('SettingsScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    this.settings = game.getSettings();
    this.render();
  }

  private render(): void {
    const game = this.game as BlockmancerGame;
    const layout = getPortraitLayout(this);
    const { centerX, contentWidth, height } = layout;
    const panelWidth = Math.min(contentWidth, 640);
    const panelLeft = centerX - panelWidth / 2;
    const tabs = createSettingsTabs(this.settings);
    const active = tabs.find((tab) => tab.id === this.activeTab) ?? tabs[0];

    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.addSettingsBackdrop();

    new UiPanel(this, this.uiSpec('settings_panel', 'panel', 'ui_panel_settings', 'ui_panel_default', panelLeft, 72, panelWidth, height - 156, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.88,
      strokeColor: COLORS.accent
    });

    this.add.text(centerX, 118, 'Settings', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY_STACKS.display,
      fontSize: `${FONT_SIZE_720.modalTitle}px`,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(centerX, 158, 'Audio, accessibility, and controls', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY_STACKS.ui,
      fontSize: `${FONT_SIZE_720.small}px`
    }).setOrigin(0.5);

    const tabWidth = Math.floor((panelWidth - 72) / 3);
    tabs.forEach((tab, index) => {
      new UiButton(
        this,
        this.uiSpec(`settings_tab_${tab.id}`, 'button', tab.assetKey, 'ui_button_default', panelLeft + 36 + index * tabWidth + tabWidth / 2, 218, tabWidth - 10, 60, 'center', 50),
        {
          label: tab.label,
          selected: tab.id === this.activeTab,
          onClick: () => {
            this.activeTab = tab.id;
            this.render();
          }
        }
      );
    });

    active.rows.forEach((row, index) => {
      this.renderSettingRow(row, panelLeft + 36, 294 + index * 116, panelWidth - 72);
    });

    new UiButton(this, this.uiSpec('settings_apply_button', 'button', 'ui_button_apply', 'ui_button_default', centerX, height - 156, 220, 56, 'center', 90), {
      label: 'Apply',
      onClick: () => this.saveAndRender()
    });
    new UiButton(this, this.uiSpec('settings_reset_tutorial', 'button', 'ui_button_secondary', 'ui_button_default', centerX - 126, height - 88, 220, 54, 'center', 90), {
      label: 'Reset Tutorial',
      onClick: () => {
        game.tutorialSystem.setComplete(false, game.metaSystem.state);
        game.tutorialSystem.setLessonIndex(0, game.metaSystem.state);
        game.metaSystem.save();
        game.audioSystem.play('reward_pick', this);
      }
    });
    new UiButton(this, this.uiSpec('settings_back_button', 'button', 'ui_button_back', 'ui_button_default', centerX + 126, height - 88, 220, 54, 'center', 90), {
      label: 'Back',
      onClick: () => {
        this.saveAndRender();
        this.scene.start('MainMenuScene');
      }
    });
  }

  private renderSettingRow(row: SettingsRowViewModel, x: number, y: number, width: number): void {
    new UiPanel(this, this.uiSpec(`settings_row_${row.action.key}`, 'panel', 'ui_panel_default', 'placeholder_panel', x, y, width, 88, 'topLeft', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.82,
      strokeColor: COLORS.accentSoft,
      strokeAlpha: 0.28
    });
    this.add.text(x + 18, y + 20, row.label, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY_STACKS.ui,
      fontSize: `${FONT_SIZE_720.body}px`,
      fontStyle: 'bold'
    });

    if (row.control === 'slider') {
      new UiMeter(this, this.uiSpec(`settings_meter_${row.action.key}`, 'meter', 'ui_slider_default', 'ui_meter_fallback', x + width - 250, y + 28, 154, 30, 'topLeft', 60), {
        current: Math.round((row.meterValue ?? 0) * 100),
        max: 100,
        fillColor: COLORS.success,
        showValueText: false,
        fillInset: 5
      });
    } else if (row.control === 'toggle') {
      new UiIconSlot(
        this,
        this.uiSpec(`settings_toggle_${row.action.key}`, 'iconSlot', row.enabled ? 'ui_toggle_on' : 'ui_toggle_off', 'placeholder_icon', x + width - 190, y + 44, 46, 46, 'center', 60),
        { selected: row.enabled }
      );
    }

    new UiButton(this, this.uiSpec(`settings_control_${row.action.key}`, 'button', row.control === 'toggle' ? (row.enabled ? 'ui_toggle_on' : 'ui_toggle_off') : 'ui_button_apply', 'ui_button_default', x + width - 74, y + 44, 126, 52, 'center', 65), {
      label: row.value,
      selected: row.enabled,
      onClick: () => this.applyRowAction(row.action)
    });
  }

  private applyRowAction(action: SettingsRowAction): void {
    switch (action.type) {
      case 'volume':
        this.settings[action.key] = this.nextVolume(this.settings[action.key]);
        break;
      case 'toggle':
        this.settings[action.key] = !this.settings[action.key];
        break;
      case 'cycle':
        if (action.key === 'textSpeed') {
          this.settings.textSpeed = this.nextValue(TEXT_SPEEDS, this.settings.textSpeed);
        } else {
          this.settings.buttonSize = this.nextValue(BUTTON_SIZES, this.settings.buttonSize);
        }
        break;
      default:
        break;
    }
    this.saveAndRender();
  }

  private nextValue<TValue>(values: TValue[], current: TValue): TValue {
    const index = values.indexOf(current);
    return values[(index + 1) % values.length];
  }

  private nextVolume(value: number): number {
    const index = VOLUME_STEPS.findIndex((step) => step > value + 0.01);
    return index === -1 ? VOLUME_STEPS[0] : VOLUME_STEPS[index];
  }

  private saveAndRender(): void {
    const game = this.game as BlockmancerGame;
    game.saveSettings(this.settings);
    game.audioSystem.play('button_tap', this);
    this.settings = game.getSettings();
    this.render();
  }

  private addSettingsBackdrop(): void {
    const game = this.game as BlockmancerGame;
    const background = game.assetSystem.createImageByAssetKey(this, 'bg_scene_settings', 'stageBackground', this.scale.width / 2, this.scale.height / 2, { kind: 'background' });
    background.setDisplaySize(this.scale.width, this.scale.height).setAlpha(0.25);
  }

  private uiSpec(
    id: string,
    type: string,
    assetKey: string,
    fallbackAssetKey: string,
    x: number,
    y: number,
    w: number,
    h: number,
    anchor: UiComponentSpec['anchor'],
    zIndex: number
  ): UiComponentSpec {
    return {
      id,
      type,
      assetKey,
      fallbackAssetKey,
      canonicalFolder: type === 'iconSlot' ? 'public/assets/icons/' : 'public/assets/ui/',
      expectedSourceSize: { w, h },
      runtimeRenderSize: { w, h },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
      anchor,
      fitMode: type === 'iconSlot' ? 'iconCenter' : 'nineSlice',
      scaleMode: type === 'iconSlot' ? 'fitInteger' : 'uiStretchNineSlice',
      safePadding: type === 'iconSlot' ? 0 : 24,
      zIndex,
      dynamicTextAllowed: type !== 'iconSlot',
      pixelPerfect: {
        integerCoordinates: true,
        allowFractionalScale: false,
        filtering: 'nearest',
        antiAliasing: false,
        roundPixels: true
      }
    };
  }
}
