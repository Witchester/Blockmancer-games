import { SettingsSystem } from './SettingsSystem';

export type AudioCue =
  | 'line_clear'
  | 'cascade'
  | 'spell_cast'
  | 'enemy_hit'
  | 'player_hit'
  | 'reward_pick'
  | 'button_tap'
  | 'boss_intro'
  | 'victory'
  | 'defeat'
  | 'shop_purchase'
  | 'item_use';

export class AudioSystem {
  constructor(private readonly settingsSystem = new SettingsSystem()) {}

  play(cue: AudioCue): void {
    const settings = this.settingsSystem.load();
    if (settings.masterVolume <= 0 || settings.sfxVolume <= 0) {
      return;
    }

    void cue;
  }
}
