export type GameSettings = {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  vibration: boolean;
  screenShake: boolean;
  reducedFlashing: boolean;
  colorblindSymbols: boolean;
  textSpeed: 'slow' | 'normal' | 'fast';
  leftHandedControls: boolean;
  buttonSize: 'normal' | 'large';
  showGrid: boolean;
};

export class SettingsSystem {
  readonly defaults: GameSettings = {
    masterVolume: 1,
    sfxVolume: 1,
    musicVolume: 0.8,
    vibration: true,
    screenShake: true,
    reducedFlashing: false,
    colorblindSymbols: false,
    textSpeed: 'normal',
    leftHandedControls: false,
    buttonSize: 'normal',
    showGrid: true
  };

  load(storage = globalThis.localStorage): GameSettings {
    const raw = storage?.getItem('blockmancer:settings');
    if (!raw) {
      return { ...this.defaults };
    }

    try {
      return { ...this.defaults, ...JSON.parse(raw) };
    } catch {
      return { ...this.defaults };
    }
  }

  save(settings: GameSettings, storage = globalThis.localStorage): void {
    storage?.setItem('blockmancer:settings', JSON.stringify({ ...this.defaults, ...settings }));
  }
}
