import Phaser from 'phaser';
import { Button } from './Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { MOBILE_CONTROL_BUTTON_SIZE, UI_BUTTON_HEIGHT } from '../data/renderSizes';

export type MobileControlsButtonConfig = {
  label: string;
  onPress: () => void;
  width?: number;
  height?: number;
  repeat?: boolean;
  repeatDelayMs?: number;
  repeatIntervalMs?: number;
  iconKey?: string | null;
  disabled?: boolean;
  onCreate?: (button: Button) => void;
};

export type MobileControlsOptions = {
  title?: string;
  padding?: number;
  rowGap?: number;
  buttonGap?: number;
};

export class MobileControls extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    rows: MobileControlsButtonConfig[][],
    options: MobileControlsOptions = {}
  ) {
    super(scene, x, y);

    const padding = options.padding ?? 18;
    const rowGap = options.rowGap ?? 12;
    const buttonGap = options.buttonGap ?? 10;
    const titleHeight = options.title ? 28 : 0;
    const rowWidths = rows.map((row) =>
      row.reduce((total, button, index) => total + (button.width ?? MOBILE_CONTROL_BUTTON_SIZE) + (index > 0 ? buttonGap : 0), 0)
    );
    const rowHeights = rows.map((row) => Math.max(...row.map((button) => button.height ?? UI_BUTTON_HEIGHT)));
    const width = Math.max(...rowWidths, 0) + padding * 2;
    const height =
      titleHeight +
      rowHeights.reduce((total, rowHeight) => total + rowHeight, 0) +
      Math.max(0, rows.length - 1) * rowGap +
      padding * 2;

    const background = scene.add
      .rectangle(0, 0, width, height, COLORS.panel, 0.94)
      .setOrigin(0.5)
      .setStrokeStyle(2, COLORS.accent, 0.28);
    this.add(background);

    if (options.title) {
      const title = scene.add.text(0, -height / 2 + padding, options.title, {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: '18px'
      }).setOrigin(0.5, 0);
      this.add(title);
    }

    let currentY = -height / 2 + padding + titleHeight;
    rows.forEach((row, rowIndex) => {
      const rowWidth = rowWidths[rowIndex];
      const rowHeight = rowHeights[rowIndex];
      let currentX = -rowWidth / 2;

      row.forEach((buttonConfig) => {
        const buttonWidth = buttonConfig.width ?? MOBILE_CONTROL_BUTTON_SIZE;
        const buttonHeight = buttonConfig.height ?? UI_BUTTON_HEIGHT;
        const button = new Button(
          scene,
          currentX + buttonWidth / 2,
          currentY + rowHeight / 2,
          buttonWidth,
          buttonHeight,
          buttonConfig.label,
          buttonConfig.onPress,
          { iconKey: buttonConfig.iconKey }
        );
        button.setDisabled(Boolean(buttonConfig.disabled));
        buttonConfig.onCreate?.(button);
        if (buttonConfig.repeat) {
          let repeatTimer: Phaser.Time.TimerEvent | null = null;
          const stopRepeat = () => {
            repeatTimer?.remove(false);
            repeatTimer = null;
          };

          button.on('pointerdown', () => {
            stopRepeat();
            repeatTimer = scene.time.addEvent({
              delay: buttonConfig.repeatDelayMs ?? 220,
              callback: () => {
                buttonConfig.onPress();
                repeatTimer = scene.time.addEvent({
                  delay: buttonConfig.repeatIntervalMs ?? 90,
                  callback: buttonConfig.onPress,
                  loop: true
                });
              }
            });
          });
          button.on('pointerup', stopRepeat);
          button.on('pointerout', stopRepeat);
          button.on('pointerupoutside', stopRepeat);
          button.once(Phaser.GameObjects.Events.DESTROY, stopRepeat);
        }
        this.add(button);
        currentX += buttonWidth + buttonGap;
      });

      currentY += rowHeight + rowGap;
    });

    scene.add.existing(this);
  }
}
