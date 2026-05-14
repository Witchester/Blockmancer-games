import Phaser from 'phaser';
import type { RunState } from '../types/GameTypes';
import { OopsieSystem } from '../systems/OopsieSystem';
import { COLORS, FONT_FAMILY } from '../utils/constants';

type HudOptions = {
  compact?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export class Hud {
  private readonly root: Phaser.GameObjects.Container;
  private readonly text: Phaser.GameObjects.Text;
  private readonly compact: boolean;
  private readonly oopsieSystem = new OopsieSystem();

  constructor(scene: Phaser.Scene, options: HudOptions = {}) {
    this.compact = options.compact ?? false;
    const width = options.width ?? scene.scale.width - 40;
    const panelY = options.y ?? (this.compact ? 52 : 46);
    const panelHeight = options.height ?? (this.compact ? 86 : 74);
    const fontSize = this.compact ? '16px' : '20px';
    const panel = scene.add
      .rectangle(options.x ?? scene.scale.width / 2, panelY, width, panelHeight, COLORS.panel, 0.95)
      .setStrokeStyle(2, COLORS.accent, 0.4);

    this.text = scene.add.text((options.x ?? scene.scale.width / 2) - width / 2 + 12, panelY - panelHeight / 2 + 12, '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize,
      wordWrap: { width: width - 20 },
      lineSpacing: this.compact ? 6 : 0
    });

    this.root = scene.add.container(0, 0, [panel, this.text]);
  }

  update(state: RunState): void {
    const stats = [
      `HP ${state.player.hp}/${state.player.maxHp}`,
      `SH ${state.player.shield}`,
      `Mana ${state.player.mana}/${state.player.maxMana}`,
      `Gold ${state.player.gold}`,
      `Stage ${state.stage}`,
      `Fall ${state.fallSpeed.toFixed(2)}x`,
      `Combo ${state.combo}`,
      state.player.feverActiveLocks > 0 ? `Fever ON ${state.player.feverActiveLocks}` : `Fever ${state.player.fever}%`,
      this.oopsieSystem.getSummary(state)
    ];
    this.text.setText(this.compact ? `${stats.slice(0, 4).join('   ')}\n${stats.slice(4).join('   ')}` : stats.join('   '));
  }

  destroy(): void {
    this.root.destroy(true);
  }
}
