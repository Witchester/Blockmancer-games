import type { GameSettings } from '../../types/SettingsTypes';

export type SettingsTabId = 'audio' | 'accessibility' | 'controls';

export type SettingsRowAction =
  | { type: 'volume'; key: 'masterVolume' | 'sfxVolume' | 'musicVolume' }
  | { type: 'toggle'; key: keyof Pick<GameSettings, 'vibration' | 'screenShake' | 'reducedFlashing' | 'colorblindSymbols' | 'leftHandedControls' | 'showGrid'> }
  | { type: 'cycle'; key: 'textSpeed' | 'buttonSize' };

export type SettingsRowViewModel = {
  label: string;
  value: string;
  action: SettingsRowAction;
  control: 'slider' | 'toggle' | 'button';
  meterValue?: number;
  enabled?: boolean;
};

export type SettingsTabViewModel = {
  id: SettingsTabId;
  label: string;
  assetKey: string;
  iconKey: string;
  rows: SettingsRowViewModel[];
};

export const SETTINGS_TABS: SettingsTabId[] = ['audio', 'accessibility', 'controls'];

export function createSettingsTabs(settings: GameSettings): SettingsTabViewModel[] {
  return [
    {
      id: 'audio',
      label: 'Audio',
      assetKey: 'ui_tab_audio',
      iconKey: 'ui_slider_default',
      rows: [
        volumeRow(settings, 'Master Volume', 'masterVolume'),
        volumeRow(settings, 'SFX Volume', 'sfxVolume'),
        volumeRow(settings, 'Music Volume', 'musicVolume')
      ]
    },
    {
      id: 'accessibility',
      label: 'Access',
      assetKey: 'ui_tab_accessibility',
      iconKey: settings.reducedFlashing ? 'ui_toggle_on' : 'ui_toggle_off',
      rows: [
        toggleRow(settings, 'Reduced Flashing', 'reducedFlashing'),
        toggleRow(settings, 'Block Symbols', 'colorblindSymbols'),
        toggleRow(settings, 'Show Grid', 'showGrid'),
        cycleRow(settings, 'Text Speed', 'textSpeed')
      ]
    },
    {
      id: 'controls',
      label: 'Controls',
      assetKey: 'ui_tab_controls',
      iconKey: settings.leftHandedControls ? 'ui_toggle_on' : 'ui_toggle_off',
      rows: [
        toggleRow(settings, 'Vibration', 'vibration'),
        toggleRow(settings, 'Screen Shake', 'screenShake'),
        toggleRow(settings, 'Left-Handed Controls', 'leftHandedControls'),
        cycleRow(settings, 'Button Size', 'buttonSize')
      ]
    }
  ];
}

function volumeRow(settings: GameSettings, label: string, key: 'masterVolume' | 'sfxVolume' | 'musicVolume'): SettingsRowViewModel {
  return {
    label,
    value: `${Math.round(settings[key] * 100)}%`,
    action: { type: 'volume', key },
    control: 'slider',
    meterValue: settings[key]
  };
}

function toggleRow(
  settings: GameSettings,
  label: string,
  key: keyof Pick<GameSettings, 'vibration' | 'screenShake' | 'reducedFlashing' | 'colorblindSymbols' | 'leftHandedControls' | 'showGrid'>
): SettingsRowViewModel {
  return {
    label,
    value: settings[key] ? 'On' : 'Off',
    action: { type: 'toggle', key },
    control: 'toggle',
    enabled: settings[key]
  };
}

function cycleRow(settings: GameSettings, label: string, key: 'textSpeed' | 'buttonSize'): SettingsRowViewModel {
  return {
    label,
    value: String(settings[key]),
    action: { type: 'cycle', key },
    control: 'button'
  };
}
