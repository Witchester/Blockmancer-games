import Phaser from 'phaser';
import { INPUT_BUFFER_MS, MOVE_REPEAT_DELAY_MS, MOVE_REPEAT_INTERVAL_MS } from '../utils/constants';

export type InputActionHandlers = {
  moveLeft: () => boolean;
  moveRight: () => boolean;
  rotate: () => boolean;
  softDrop: () => boolean;
  hardDrop: () => boolean;
  hold: () => boolean;
  castSpell: (slot: number) => void;
  inventory: () => void;
  pause: () => void;
};

type BufferedAction = 'moveLeft' | 'moveRight' | 'rotate' | 'softDrop' | 'hardDrop' | 'hold';

type PendingInput = {
  action: BufferedAction;
  expiresAt: number;
};

export class InputSystem {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key>;
  private leftHeldMs = 0;
  private rightHeldMs = 0;
  private softDropHeldMs = 0;
  private leftRepeated = false;
  private rightRepeated = false;
  private leftWasDown = false;
  private rightWasDown = false;
  private softDropWasDown = false;
  private readonly pendingInputs: PendingInput[] = [];

  private readonly handleRotateUp = () => this.tryAction('rotate', () => this.handlers.rotate());
  private readonly handleRotateW = () => this.tryAction('rotate', () => this.handlers.rotate());
  private readonly handleHardDrop = () => this.tryAction('hardDrop', () => this.handlers.hardDrop());
  private readonly handleHoldShift = () => this.tryAction('hold', () => this.handlers.hold());
  private readonly handleHoldC = () => this.tryAction('hold', () => this.handlers.hold());
  private readonly handleInventory = () => this.handlers.inventory();
  private readonly handlePause = () => this.handlers.pause();
  private readonly handleCastOne = () => this.handlers.castSpell(0);
  private readonly handleCastTwo = () => this.handlers.castSpell(1);
  private readonly handleCastThree = () => this.handlers.castSpell(2);
  private readonly handleCastFour = () => this.handlers.castSpell(3);

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly handlers: InputActionHandlers
  ) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keys = scene.input.keyboard!.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      w: Phaser.Input.Keyboard.KeyCodes.W
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    scene.input.keyboard!.on('keydown-UP', this.handleRotateUp);
    scene.input.keyboard!.on('keydown-W', this.handleRotateW);
    scene.input.keyboard!.on('keydown-SPACE', this.handleHardDrop);
    scene.input.keyboard!.on('keydown-SHIFT', this.handleHoldShift);
    scene.input.keyboard!.on('keydown-C', this.handleHoldC);
    scene.input.keyboard!.on('keydown-I', this.handleInventory);
    scene.input.keyboard!.on('keydown-ESC', this.handlePause);
    scene.input.keyboard!.on('keydown-ONE', this.handleCastOne);
    scene.input.keyboard!.on('keydown-TWO', this.handleCastTwo);
    scene.input.keyboard!.on('keydown-THREE', this.handleCastThree);
    scene.input.keyboard!.on('keydown-FOUR', this.handleCastFour);
  }

  update(delta: number): void {
    this.flushBufferedInputs();
    const leftDown = this.cursors.left.isDown || this.keys.a.isDown;
    const rightDown = this.cursors.right.isDown || this.keys.d.isDown;
    const softDropDown = this.cursors.down.isDown || this.keys.s.isDown;

    if (leftDown && !this.leftWasDown) {
      this.leftHeldMs = 0;
      this.leftRepeated = false;
      this.tryAction('moveLeft', () => this.handlers.moveLeft());
    } else if (leftDown) {
      this.leftHeldMs += delta;
      const threshold = this.leftRepeated ? MOVE_REPEAT_INTERVAL_MS : MOVE_REPEAT_DELAY_MS;
      if (this.leftHeldMs >= threshold) {
        this.leftHeldMs = 0;
        this.leftRepeated = true;
        this.tryAction('moveLeft', () => this.handlers.moveLeft());
      }
    } else {
      this.leftHeldMs = 0;
      this.leftRepeated = false;
    }

    if (rightDown && !this.rightWasDown) {
      this.rightHeldMs = 0;
      this.rightRepeated = false;
      this.tryAction('moveRight', () => this.handlers.moveRight());
    } else if (rightDown) {
      this.rightHeldMs += delta;
      const threshold = this.rightRepeated ? MOVE_REPEAT_INTERVAL_MS : MOVE_REPEAT_DELAY_MS;
      if (this.rightHeldMs >= threshold) {
        this.rightHeldMs = 0;
        this.rightRepeated = true;
        this.tryAction('moveRight', () => this.handlers.moveRight());
      }
    } else {
      this.rightHeldMs = 0;
      this.rightRepeated = false;
    }

    if (softDropDown && !this.softDropWasDown) {
      this.softDropHeldMs = 0;
      this.tryAction('softDrop', () => this.handlers.softDrop());
    } else if (softDropDown) {
      this.softDropHeldMs += delta;
      if (this.softDropHeldMs >= MOVE_REPEAT_INTERVAL_MS) {
        this.softDropHeldMs = 0;
        this.tryAction('softDrop', () => this.handlers.softDrop());
      }
    } else {
      this.softDropHeldMs = 0;
    }

    this.leftWasDown = leftDown;
    this.rightWasDown = rightDown;
    this.softDropWasDown = softDropDown;
  }

  private tryAction(action: BufferedAction, invoke: () => boolean): void {
    const applied = invoke();
    if (applied) {
      this.pendingInputs.splice(0, this.pendingInputs.length, ...this.pendingInputs.filter((entry) => entry.action !== action));
      return;
    }
    this.queueInput(action);
  }

  private queueInput(action: BufferedAction): void {
    const now = this.scene.time.now;
    this.pendingInputs.push({ action, expiresAt: now + INPUT_BUFFER_MS });
  }

  private flushBufferedInputs(): void {
    if (this.pendingInputs.length === 0) {
      return;
    }
    const now = this.scene.time.now;
    const remaining: PendingInput[] = [];
    for (const input of this.pendingInputs) {
      if (input.expiresAt < now) {
        continue;
      }
      const applied = this.invokeBuffered(input.action);
      if (!applied) {
        remaining.push(input);
      }
    }
    this.pendingInputs.length = 0;
    this.pendingInputs.push(...remaining);
  }

  private invokeBuffered(action: BufferedAction): boolean {
    switch (action) {
      case 'moveLeft':
        return this.handlers.moveLeft();
      case 'moveRight':
        return this.handlers.moveRight();
      case 'rotate':
        return this.handlers.rotate();
      case 'softDrop':
        return this.handlers.softDrop();
      case 'hardDrop':
        return this.handlers.hardDrop();
      case 'hold':
        return this.handlers.hold();
      default:
        return false;
    }
  }

  destroy(): void {
    this.scene.input.keyboard?.off('keydown-UP', this.handleRotateUp);
    this.scene.input.keyboard?.off('keydown-W', this.handleRotateW);
    this.scene.input.keyboard?.off('keydown-SPACE', this.handleHardDrop);
    this.scene.input.keyboard?.off('keydown-SHIFT', this.handleHoldShift);
    this.scene.input.keyboard?.off('keydown-C', this.handleHoldC);
    this.scene.input.keyboard?.off('keydown-I', this.handleInventory);
    this.scene.input.keyboard?.off('keydown-ESC', this.handlePause);
    this.scene.input.keyboard?.off('keydown-ONE', this.handleCastOne);
    this.scene.input.keyboard?.off('keydown-TWO', this.handleCastTwo);
    this.scene.input.keyboard?.off('keydown-THREE', this.handleCastThree);
    this.scene.input.keyboard?.off('keydown-FOUR', this.handleCastFour);
    this.pendingInputs.length = 0;
  }
}
