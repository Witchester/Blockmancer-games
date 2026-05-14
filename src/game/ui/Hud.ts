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
  private readonly hpFill: Phaser.GameObjects.Rectangle;
  private readonly manaFill: Phaser.GameObjects.Rectangle;
  private readonly feverFill: Phaser.GameObjects.Rectangle;
  private readonly hpText: Phaser.GameObjects.Text;
  private readonly manaText: Phaser.GameObjects.Text;
  private readonly feverText: Phaser.GameObjects.Text;
  private readonly metaText: Phaser.GameObjects.Text;
  private readonly compact: boolean;
  private readonly barWidth: number;
  private readonly oopsieSystem = new OopsieSystem();

  constructor(scene: Phaser.Scene, options: HudOptions = {}) {
    this.compact = options.compact ?? false;
    const width = options.width ?? scene.scale.width - 40;
    const panelY = options.y ?? (this.compact ? 52 : 46);
    const panelHeight = options.height ?? (this.compact ? 104 : 90);
    const panelX = options.x ?? scene.scale.width / 2;
    const left = panelX - width / 2 + 14;
    const top = panelY - panelHeight / 2 + 10;
    const fontSize = this.compact ? '18px' : '20px';
    this.barWidth = Math.floor((width - 48) / 3);
    const panel = scene.add
      .rectangle(panelX, panelY, width, panelHeight, COLORS.panel, 0.97)
      .setStrokeStyle(2, COLORS.accent, 0.4);

    const createLabel = (x: number, y: number, color: string) => scene.add.text(x, y, '', {
      color,
      fontFamily: FONT_FAMILY,
      fontSize,
      fontStyle: 'bold'
    });
    const createTrack = (x: number, y: number) => scene.add
      .rectangle(x, y, this.barWidth, 14, 0x252c49, 1)
      .setOrigin(0, 0)
      .setStrokeStyle(1, COLORS.boardGrid, 1);
    const createFill = (x: number, y: number, color: number) => scene.add
      .rectangle(x, y, this.barWidth, 10, color, 1)
      .setOrigin(0, 0);

    const hpX = left;
    const manaX = left + this.barWidth + 10;
    const feverX = left + (this.barWidth + 10) * 2;
    this.hpText = createLabel(hpX, top, '#ffb3ba');
    this.manaText = createLabel(manaX, top, '#9adfff');
    this.feverText = createLabel(feverX, top, '#ffca6b');
    const barY = top + 28;
    const hpTrack = createTrack(hpX, barY);
    const manaTrack = createTrack(manaX, barY);
    const feverTrack = createTrack(feverX, barY);
    this.hpFill = createFill(hpX + 2, barY + 2, COLORS.danger);
    this.manaFill = createFill(manaX + 2, barY + 2, COLORS.accent);
    this.feverFill = createFill(feverX + 2, barY + 2, COLORS.gold);

    this.metaText = scene.add.text(left, barY + 22, '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: this.compact ? '17px' : '19px',
      wordWrap: { width: width - 28 },
      lineSpacing: 4
    });

    this.root = scene.add.container(0, 0, [
      panel,
      hpTrack,
      manaTrack,
      feverTrack,
      this.hpFill,
      this.manaFill,
      this.feverFill,
      this.hpText,
      this.manaText,
      this.feverText,
      this.metaText
    ]);
  }

  update(state: RunState): void {
    const hpText = `HP ${state.player.hp}/${state.player.maxHp}${state.player.shield > 0 ? ` +${state.player.shield}` : ''}`;
    const manaText = `Mana ${state.player.mana}/${state.player.maxMana}`;
    const feverText = state.player.feverActiveLocks > 0 ? `Fever ON ${state.player.feverActiveLocks}` : `Fever ${state.player.fever}%`;
    const hpWidth = this.getFillWidth(state.player.hp, state.player.maxHp);
    const manaWidth = this.getFillWidth(state.player.mana, state.player.maxMana);
    const feverWidth = this.getFillWidth(state.player.fever, 100);
    const metaText = [
      `Gold ${state.player.gold}   Stage ${state.stage}   Combo ${state.combo}   Fall ${state.fallSpeed.toFixed(2)}x`,
      this.oopsieSystem.getSummary(state)
    ].join('\n');

    this.hpText.setText(hpText);
    this.manaText.setText(manaText);
    this.feverText.setText(feverText);
    this.hpFill.width = hpWidth;
    this.manaFill.width = manaWidth;
    this.feverFill.width = feverWidth;
    this.metaText.setText(metaText);
  }

  destroy(): void {
    this.root.destroy(true);
  }

  private getFillWidth(current: number, max: number): number {
    const ratio = Phaser.Math.Clamp(current / Math.max(1, max), 0, 1);
    return Math.max(0, Math.floor((this.barWidth - 4) * ratio));
  }
}
