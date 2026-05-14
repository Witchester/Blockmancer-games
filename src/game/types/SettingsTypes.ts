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

export const DEFAULT_SETTINGS: GameSettings = {
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
