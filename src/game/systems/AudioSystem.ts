import { SettingsSystem } from './SettingsSystem';
import type Phaser from 'phaser';

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

type AudioCueConfig = {
  key: string;
  frequency: number;
  durationMs: number;
  type: OscillatorType;
  volume: number;
};

const AUDIO_CUES: Record<AudioCue, AudioCueConfig> = {
  line_clear: { key: 'sfx_line_clear', frequency: 640, durationMs: 90, type: 'triangle', volume: 0.4 },
  cascade: { key: 'sfx_cascade', frequency: 880, durationMs: 140, type: 'sine', volume: 0.48 },
  spell_cast: { key: 'sfx_spell_cast', frequency: 520, durationMs: 130, type: 'sawtooth', volume: 0.34 },
  enemy_hit: { key: 'sfx_enemy_hit', frequency: 180, durationMs: 80, type: 'square', volume: 0.34 },
  player_hit: { key: 'sfx_player_hit', frequency: 130, durationMs: 130, type: 'square', volume: 0.42 },
  reward_pick: { key: 'sfx_reward_pick', frequency: 1040, durationMs: 150, type: 'triangle', volume: 0.42 },
  button_tap: { key: 'sfx_button_tap', frequency: 420, durationMs: 45, type: 'sine', volume: 0.22 },
  boss_intro: { key: 'sfx_boss_intro', frequency: 96, durationMs: 260, type: 'sawtooth', volume: 0.42 },
  victory: { key: 'sfx_victory', frequency: 760, durationMs: 300, type: 'triangle', volume: 0.48 },
  defeat: { key: 'sfx_defeat', frequency: 110, durationMs: 320, type: 'sawtooth', volume: 0.38 },
  shop_purchase: { key: 'sfx_shop_purchase', frequency: 720, durationMs: 110, type: 'triangle', volume: 0.35 },
  item_use: { key: 'sfx_item_use', frequency: 560, durationMs: 120, type: 'sine', volume: 0.34 }
};

export class AudioSystem {
  private audioContext: AudioContext | null = null;

  constructor(private readonly settingsSystem = new SettingsSystem()) {}

  play(cue: AudioCue, scene?: Phaser.Scene): void {
    const settings = this.settingsSystem.load();
    if (settings.masterVolume <= 0 || settings.sfxVolume <= 0) {
      return;
    }

    const config = AUDIO_CUES[cue];
    const volume = Math.max(0, Math.min(1, settings.masterVolume * settings.sfxVolume * config.volume));
    if (volume <= 0) {
      return;
    }

    if (scene?.cache.audio.exists(config.key)) {
      try {
        scene.sound.play(config.key, { volume });
        return;
      } catch {
        // Fall through to synthesized fallback.
      }
    }

    this.playFallback(config, volume);
  }

  setMuted(muted: boolean): void {
    const settings = this.settingsSystem.load();
    this.settingsSystem.save({
      ...settings,
      masterVolume: muted ? 0 : Math.max(settings.masterVolume, this.settingsSystem.defaults.masterVolume)
    });
  }

  isMuted(): boolean {
    const settings = this.settingsSystem.load();
    return settings.masterVolume <= 0 || settings.sfxVolume <= 0;
  }

  private playFallback(config: AudioCueConfig, volume: number): void {
    try {
      const audioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext };
      const AudioContextConstructor = window.AudioContext || audioWindow.webkitAudioContext;
      if (!AudioContextConstructor) {
        return;
      }
      this.audioContext ??= new AudioContextConstructor();
      const context = this.audioContext;
      if (!context) {
        return;
      }
      if (context.state === 'suspended') {
        void context.resume();
      }

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + config.durationMs / 1000);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + config.durationMs / 1000 + 0.03);
    } catch {
      // Audio feedback is optional; never let browser audio policy or missing APIs break gameplay.
    }
  }
}
