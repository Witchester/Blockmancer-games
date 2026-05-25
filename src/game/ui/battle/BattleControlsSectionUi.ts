import Phaser from 'phaser';
import type { MobileControlsButtonConfig } from '../MobileControls';
import { MobileControls } from '../MobileControls';
import type { BattleScreenShell } from './BattleScreenShell';

/**
 * UI-7: Controls Section UI (Section 3) for the Battle Screen.
 * Implements movement, rotate, drop, hold, spell/action, skill, bag, and settings buttons.
 * Uses placeholder icons/assets where real assets are not yet available.
 */
export class BattleControlsSectionUi {
  readonly scene: Phaser.Scene;
  readonly shell: BattleScreenShell;
  private created = false;

  constructor(scene: Phaser.Scene, shell: BattleScreenShell) {
    this.scene = scene;
    this.shell = shell;
  }

  create(): this {
    if (this.created) return this;

    const rows: MobileControlsButtonConfig[][] = [
      // Row 0: Movement & Rotation controls
      [
        { label: '←', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: '→', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: '⟲', onPress: () => {}, iconKey: 'placeholder_icon' }, // rotate left
        { label: '⟳', onPress: () => {}, iconKey: 'placeholder_icon' }, // rotate right
        { label: '↓', onPress: () => {}, iconKey: 'placeholder_icon' }, // soft drop
        { label: '⤓', onPress: () => {}, iconKey: 'placeholder_icon' }  // hard drop
      ],
      // Row 1: Hold + Spell slots (4 placeholders)
      [
        { label: 'Hold', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Spell 1', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Spell 2', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Spell 3', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Spell 4', onPress: () => {}, iconKey: 'placeholder_icon' }
      ],
      // Row 2: Skills, Bag, Settings
      [
        { label: 'Skill 1', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Skill 2', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Bag', onPress: () => {}, iconKey: 'placeholder_icon' },
        { label: 'Settings', onPress: () => {}, iconKey: 'placeholder_icon' }
      ]
    ];

    const mobileControls = new MobileControls(
      this.scene,
      0,
      0,
      rows,
      { title: 'Controls', padding: 12, rowGap: 8, buttonGap: 8 }
    );

    // Add the controls container to the controls button layer.
    this.shell.controlsButtonLayer.add(mobileControls);

    this.created = true;
    return this;
  }
}
