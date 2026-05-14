import { DEFAULT_SETTINGS, type GameSettings } from '../types/SettingsTypes';

export type { GameSettings };

export class SettingsSystem {
  readonly defaults: GameSettings = DEFAULT_SETTINGS;

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
