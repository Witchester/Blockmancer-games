import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { GameSettings } from '../types/SettingsTypes';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY_STACKS, FONT_SIZE_720 } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

type SettingRow = {
  label: string;
  value: string;
  onPress: () => void;
};

const VOLUME_STEPS = [0, 0.25, 0.5, 0.75, 1];
const TEXT_SPEEDS: GameSettings['textSpeed'][] = ['slow', 'normal', 'fast'];
const BUTTON_SIZES: GameSettings['buttonSize'][] = ['normal', 'large'];

export class SettingsScene extends Phaser.Scene {
  private settings!: GameSettings;

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

    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(centerX, height / 2, contentWidth, height - 72, COLORS.panel, 0.96)
      .setStrokeStyle(2, COLORS.accent, 0.42);

    this.add.text(centerX, 70, 'Settings', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY_STACKS.display,
      fontSize: `${FONT_SIZE_720.modalTitle}px`,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, 114, 'Audio, controls, and readability options', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY_STACKS.ui,
      fontSize: `${FONT_SIZE_720.small}px`
    }).setOrigin(0.5);

    const rows = this.getRows();
    rows.forEach((row, index) => {
      const y = 170 + index * 62;
      this.add.rectangle(centerX, y, contentWidth - 56, 52, COLORS.panelAlt, 0.98)
        .setStrokeStyle(2, COLORS.accentSoft, 0.22);
      this.add.text(centerX - (contentWidth - 96) / 2, y, row.label, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY_STACKS.ui,
        fontSize: `${FONT_SIZE_720.body}px`,
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);
      new Button(this, centerX + 194, y, 154, 44, row.value, row.onPress);
    });

    new Button(this, centerX - 150, height - 78, 220, 54, 'Reset Tutorial', () => {
      game.tutorialSystem.setComplete(false, game.metaSystem.state);
      game.tutorialSystem.setLessonIndex(0, game.metaSystem.state);
      game.metaSystem.save();
      game.audioSystem.play('reward_pick', this);
    });

    new Button(this, centerX + 150, height - 78, 220, 54, 'Back', () => {
      this.saveAndRender();
      this.scene.start('MainMenuScene');
    });
  }

  private getRows(): SettingRow[] {
    return [
      this.volumeRow('Master Volume', 'masterVolume'),
      this.volumeRow('SFX Volume', 'sfxVolume'),
      this.volumeRow('Music Volume', 'musicVolume'),
      this.toggleRow('Vibration', 'vibration'),
      this.toggleRow('Screen Shake', 'screenShake'),
      this.toggleRow('Reduced Flashing', 'reducedFlashing'),
      this.toggleRow('Block Symbols', 'colorblindSymbols'),
      this.cycleRow('Text Speed', 'textSpeed', TEXT_SPEEDS),
      this.toggleRow('Left-Handed Controls', 'leftHandedControls'),
      this.cycleRow('Button Size', 'buttonSize', BUTTON_SIZES),
      this.toggleRow('Show Grid', 'showGrid')
    ];
  }

  private volumeRow(label: string, key: 'masterVolume' | 'sfxVolume' | 'musicVolume'): SettingRow {
    return {
      label,
      value: `${Math.round(this.settings[key] * 100)}%`,
      onPress: () => {
        this.settings[key] = this.nextVolume(this.settings[key]);
        this.saveAndRender();
      }
    };
  }

  private toggleRow(label: string, key: keyof Pick<GameSettings, 'vibration' | 'screenShake' | 'reducedFlashing' | 'colorblindSymbols' | 'leftHandedControls' | 'showGrid'>): SettingRow {
    return {
      label,
      value: this.settings[key] ? 'On' : 'Off',
      onPress: () => {
        this.settings[key] = !this.settings[key];
        this.saveAndRender();
      }
    };
  }

  private cycleRow<TKey extends 'textSpeed' | 'buttonSize'>(
    label: string,
    key: TKey,
    values: GameSettings[TKey][]
  ): SettingRow {
    return {
      label,
      value: String(this.settings[key]),
      onPress: () => {
        const index = values.indexOf(this.settings[key]);
        this.settings[key] = values[(index + 1) % values.length];
        this.saveAndRender();
      }
    };
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
}
