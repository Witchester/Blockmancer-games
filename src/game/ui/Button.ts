import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { UI_BUTTON_HEIGHT } from '../data/renderSizes';
import type { AssetDisplayCategory } from '../data/asset-display-rules';

type ButtonOptions = {
  iconKey?: string | null;
  iconCategory?: AssetDisplayCategory;
  fontSize?: string;
};

export class Button extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;
  private readonly icon?: Phaser.GameObjects.Image;
  private disabled = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    onClick: () => void,
    options: ButtonOptions = {}
  ) {
    super(scene, x, y);
    const renderHeight = Math.max(height, UI_BUTTON_HEIGHT);

    this.background = scene.add
      .rectangle(0, 0, width, renderHeight, COLORS.panelAlt, 0.98)
      .setStrokeStyle(2, COLORS.accent, 0.7)
      .setOrigin(0.5);

    if (options.iconKey) {
      const compactIcon = width < 90;
      this.icon = (scene.game as BlockmancerGame).assetSystem
        .addImage(scene, compactIcon ? 0 : -width / 2 + 28, compactIcon ? -9 : 0, options.iconKey, 'icon');
      (scene.game as BlockmancerGame).assetSystem.setSpriteDisplaySizeByCategory(this.icon, options.iconCategory ?? 'uiIcon');
      const size = Math.min(compactIcon ? 20 : 28, renderHeight - 16);
      this.icon.setDisplaySize(size, size);
    }

    const compactIcon = Boolean(this.icon && width < 90);
    const labelX = compactIcon ? 0 : this.icon ? 12 : 0;
    const labelY = compactIcon ? 13 : 0;
    const labelWidth = compactIcon ? width - 8 : this.icon ? width - 58 : width - 18;
    this.label = scene.add
      .text(labelX, labelY, text, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: options.fontSize ?? (compactIcon ? '14px' : '18px'),
        align: 'center',
        wordWrap: { width: Math.max(20, labelWidth) },
        lineSpacing: -2
      })
      .setOrigin(0.5);

    this.add(this.icon ? [this.background, this.icon, this.label] : [this.background, this.label]);
    this.setSize(width, renderHeight);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -renderHeight / 2, width, renderHeight),
      Phaser.Geom.Rectangle.Contains
    );

    this.on('pointerover', () => {
      if (!this.disabled) {
        this.background.setFillStyle(COLORS.accentSoft, 0.98);
      }
    });

    this.on('pointerout', () => {
      if (!this.disabled) {
        this.background.setFillStyle(COLORS.panelAlt, 0.98);
      }
    });

    this.on('pointerdown', () => {
      if (!this.disabled) {
        (scene.game as BlockmancerGame).audioSystem.play('button_tap', scene);
        onClick();
      }
    });

    scene.add.existing(this);
  }

  setDisabled(disabled: boolean): this {
    if (this.disabled === disabled) {
      return this;
    }
    this.disabled = disabled;
    this.background.setFillStyle(disabled ? 0x34384e : COLORS.panelAlt, 0.98);
    this.background.setStrokeStyle(2, disabled ? 0x555a75 : COLORS.accent, 0.7);
    this.label.setAlpha(disabled ? 0.55 : 1);
    this.icon?.setAlpha(disabled ? 0.55 : 1);
    return this;
  }

  setText(text: string): void {
    if (this.label.text !== text) {
      this.label.setText(text);
    }
  }
}
