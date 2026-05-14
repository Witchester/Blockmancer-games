import Phaser from 'phaser';
import type { RunState } from '../types/GameTypes';
import { COLORS } from '../utils/constants';

type HudOptions = {
  compact?: boolean;
};

export class Hud {
  private readonly root: Phaser.GameObjects.Container;
  private readonly text: Phaser.GameObjects.Text;
  private readonly compact: boolean;

  constructor(scene: Phaser.Scene, options: HudOptions = {}) {
    this.compact = options.compact ?? false;
    const width = scene.scale.width - 40;
    const panelY = this.compact ? 52 : 46;
    const panelHeight = this.compact ? 86 : 74;
    const fontSize = this.compact ? '18px' : '22px';
    const panel = scene.add
      .rectangle(scene.scale.width / 2, panelY, width, panelHeight, COLORS.panel, 0.95)
      .setStrokeStyle(2, COLORS.accent, 0.4);

    this.text = scene.add.text(24, this.compact ? 18 : 24, '', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize,
      wordWrap: { width: width - 20 },
      lineSpacing: this.compact ? 6 : 0
    });

    this.root = scene.add.container(0, 0, [panel, this.text]);
  }

  update(state: RunState): void {
    const stats = [
      `HP ${state.player.hp}/${state.player.maxHp}`,
      `Mana ${state.player.mana}/${state.player.maxMana}`,
      `Gold ${state.player.gold}`,
      `Stage ${state.stage}`,
      `Fall ${state.fallSpeed.toFixed(2)}x`,
      `Combo ${state.combo}`
    ];
    this.text.setText(this.compact ? `${stats.slice(0, 3).join('   ')}\n${stats.slice(3).join('   ')}` : stats.join('   '));
  }

  destroy(): void {
    this.root.destroy(true);
  }
}
