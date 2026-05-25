import Phaser from 'phaser';
import { Button } from '../Button';
import { COLORS, FONT_FAMILY_STACKS } from '../../utils/constants';
import type { BattleScreenShell } from './BattleScreenShell';
import { BattleControlsInputAdapter, type BattleControlsSpellSlot } from './BattleControlsInputAdapter';

type ControlButtonId =
  | 'move_left'
  | 'move_right'
  | 'soft_drop'
  | 'hard_drop'
  | 'rotate_clockwise'
  | 'rotate_counterclockwise'
  | 'hold_piece'
  | `spell_${number}`
  | `skill_${number}`
  | 'bag_shortcut'
  | 'settings_shortcut';

type ControlButtonRecord = {
  id: ControlButtonId;
  button: Button;
  baseDisabled: boolean;
};

type ControlButtonConfig = {
  id: ControlButtonId;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  iconKey: string;
  onPress: () => void;
  repeat: boolean;
  disabled: boolean;
};

const ROW_ONE_Y = 104;
const ROW_TWO_Y = 264;
const PRIMARY_BUTTON_SIZE = 96;
const SLOT_WIDTH = 128;
const SLOT_HEIGHT = 96;

export class BattleControlsSectionUi {
  readonly scene: Phaser.Scene;
  readonly shell: BattleScreenShell;
  private readonly input: BattleControlsInputAdapter;
  private created = false;
  private readonly buttons: ControlButtonRecord[] = [];
  private readonly spellButtons: Button[] = [];
  private readonly skillButtons: Button[] = [];
  private bagButton?: Button;

  constructor(scene: Phaser.Scene, shell: BattleScreenShell, input: BattleControlsInputAdapter) {
    this.scene = scene;
    this.shell = shell;
    this.input = input;
  }

  create(): this {
    if (this.created) return this;

    this.createRowPanels();
    this.createMovementRow();
    this.createActionRow();
    this.refresh();

    this.created = true;
    return this;
  }

  refresh(): void {
    const state = this.input.getState();
    this.spellButtons.forEach((button, index) => {
      const slot = state.spellSlots[index];
      button.setText(this.slotLabel(slot, `Spell ${index + 1}`));
      button.setDisabled(state.inputLocked || !slot || Boolean(slot.disabled || slot.empty));
    });
    this.skillButtons.forEach((button, index) => {
      const slot = state.skillSlots[index];
      button.setText(this.slotLabel(slot, `Skill ${index + 1}`));
      button.setDisabled(state.inputLocked || !slot || Boolean(slot.disabled || slot.empty));
    });
    this.bagButton?.setText(`Bag\n${state.inventoryCount}`);
    this.buttons.filter(({ id }) => !id.startsWith('spell_') && !id.startsWith('skill_')).forEach(({ button, baseDisabled }) => {
      button.setDisabled(state.inputLocked || baseDisabled);
    });
  }

  private createRowPanels(): void {
    [
      { x: 40, y: 44, w: 1000, h: 132 },
      { x: 40, y: 204, w: 1000, h: 132 }
    ].forEach((rect) => {
      const panel = this.scene.add
        .rectangle(rect.x, rect.y, rect.w, rect.h, COLORS.panelAlt, 0.34)
        .setOrigin(0, 0)
        .setStrokeStyle(2, COLORS.accentSoft, 0.22);
      this.shell.controlsButtonLayer.add(panel);
    });
  }

  private createMovementRow(): void {
    const controls = [
      this.buttonConfig('move_left', 132, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Left', 'ico_control_left', () => this.input.pressMoveLeft(), true),
      this.buttonConfig('move_right', 276, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Right', 'ico_control_right', () => this.input.pressMoveRight(), true),
      this.buttonConfig('soft_drop', 420, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Down', 'ico_control_down', () => this.input.pressSoftDrop(), true),
      this.buttonConfig('rotate_clockwise', 564, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Rot', 'ico_control_rotate', () => this.input.pressRotateClockwise()),
      this.buttonConfig('hold_piece', 708, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Hold', 'ico_control_hold', () => this.input.pressHold(), false, !this.input.supportsHold()),
      this.buttonConfig('hard_drop', 852, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Drop', 'ico_control_hard_drop', () => this.input.pressHardDrop(), false, !this.input.supportsHardDrop())
    ];

    if (this.input.supportsRotateCounterclockwise()) {
      controls.splice(
        4,
        0,
        this.buttonConfig('rotate_counterclockwise', 636, ROW_ONE_Y, PRIMARY_BUTTON_SIZE, PRIMARY_BUTTON_SIZE, 'Rot L', 'ico_control_rotate_ccw', () =>
          this.input.pressRotateCounterclockwise()
        )
      );
    }

    this.addButtons(controls);
  }

  private createActionRow(): void {
    const actionButtons = [
      this.buttonConfig('spell_0', 80, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Spell 1\nEmpty', 'ui_button_spell_slot', () => this.input.pressSpell(0)),
      this.buttonConfig('spell_1', 224, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Spell 2\nEmpty', 'ui_button_spell_slot', () => this.input.pressSpell(1)),
      this.buttonConfig('spell_2', 368, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Spell 3\nEmpty', 'ui_button_spell_slot', () => this.input.pressSpell(2)),
      this.buttonConfig('skill_0', 512, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Skill 1\nLocked', 'ui_button_spell_slot', () => this.input.pressSkill(0)),
      this.buttonConfig('skill_1', 656, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Special\nLocked', 'ui_button_spell_slot', () => this.input.pressSkill(1)),
      this.buttonConfig('bag_shortcut', 800, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Bag\n0', 'ui_inventory_compact', () => this.input.pressBag()),
      this.buttonConfig('settings_shortcut', 944, ROW_TWO_Y, SLOT_WIDTH, SLOT_HEIGHT, 'Pause', 'ico_settings', () => this.input.pressSettings())
    ];

    this.addButtons(actionButtons);
  }

  private addButtons(configs: ControlButtonConfig[]): void {
    configs.forEach((config) => {
      const button = new Button(this.scene, config.x, config.y, config.w, config.h, config.label, config.onPress, {
        iconKey: config.iconKey,
        fontFamily: FONT_FAMILY_STACKS.pixelSmall,
        fontSize: config.w <= PRIMARY_BUTTON_SIZE ? '18px' : '17px'
      });
      button.setName(`battleControls.${config.id}`);
      button.setDisabled(config.disabled);
      if (config.repeat) {
        this.enableRepeat(button, config.onPress);
      }
      this.shell.controlsButtonLayer.add(button);
      const record = { id: config.id, button, baseDisabled: config.disabled };
      this.buttons.push(record);
      if (config.id.startsWith('spell_')) this.spellButtons.push(button);
      if (config.id.startsWith('skill_')) this.skillButtons.push(button);
      if (config.id === 'bag_shortcut') this.bagButton = button;
    });
  }

  private buttonConfig(
    id: ControlButtonId,
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    iconKey: string,
    onPress: () => void,
    repeat = false,
    disabled = false
  ): ControlButtonConfig {
    const wrappedPress = () => {
      onPress();
      this.refresh();
    };
    return {
      id,
      x,
      y,
      w,
      h,
      label,
      iconKey,
      onPress: wrappedPress,
      repeat,
      disabled
    };
  }

  private enableRepeat(button: Button, onPress: () => void): void {
    let repeatTimer: Phaser.Time.TimerEvent | null = null;
    const stopRepeat = () => {
      repeatTimer?.remove(false);
      repeatTimer = null;
    };

    button.on('pointerdown', () => {
      stopRepeat();
      repeatTimer = this.scene.time.addEvent({
        delay: this.input.repeatDelayMs,
        callback: () => {
          onPress();
          repeatTimer = this.scene.time.addEvent({
            delay: this.input.repeatIntervalMs,
            callback: onPress,
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

  private slotLabel(slot: BattleControlsSpellSlot | undefined, fallback: string): string {
    if (!slot) {
      return `${fallback}\nEmpty`;
    }
    if (slot.empty) {
      return `${slot.label}\nEmpty`;
    }
    if (typeof slot.cost === 'number') {
      return `${slot.label}\n${slot.cost}`;
    }
    return slot.label;
  }
}
