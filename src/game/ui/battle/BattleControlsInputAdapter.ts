import { MOVE_REPEAT_DELAY_MS, MOVE_REPEAT_INTERVAL_MS } from '../../utils/constants';

export type BattleControlsSpellSlot = {
  label: string;
  cost?: number;
  iconKey?: string | null;
  disabled?: boolean;
  empty?: boolean;
};

export type BattleControlsState = {
  inputLocked: boolean;
  leftHanded: boolean;
  inventoryCount: number;
  spellSlots: BattleControlsSpellSlot[];
  skillSlots: BattleControlsSpellSlot[];
};

export type BattleControlsInputHandlers = {
  moveLeft: () => boolean;
  moveRight: () => boolean;
  softDrop: () => boolean;
  hardDrop?: () => boolean;
  rotateClockwise: () => boolean;
  rotateCounterclockwise?: () => boolean;
  hold?: () => boolean;
  castSpell: (slot: number) => void;
  useSkill?: (slot: number) => void;
  openBag: () => void;
  openSettings: () => void;
};

export type BattleControlsInputAdapterOptions = {
  getState: () => BattleControlsState;
  handlers: BattleControlsInputHandlers;
};

export class BattleControlsInputAdapter {
  readonly repeatDelayMs = MOVE_REPEAT_DELAY_MS;
  readonly repeatIntervalMs = MOVE_REPEAT_INTERVAL_MS;

  constructor(private readonly options: BattleControlsInputAdapterOptions) {}

  getState(): BattleControlsState {
    return this.options.getState();
  }

  supportsHardDrop(): boolean {
    return Boolean(this.options.handlers.hardDrop);
  }

  supportsRotateCounterclockwise(): boolean {
    return Boolean(this.options.handlers.rotateCounterclockwise);
  }

  supportsHold(): boolean {
    return Boolean(this.options.handlers.hold);
  }

  pressMoveLeft(): void {
    this.dispatch(() => this.options.handlers.moveLeft());
  }

  pressMoveRight(): void {
    this.dispatch(() => this.options.handlers.moveRight());
  }

  pressSoftDrop(): void {
    this.dispatch(() => this.options.handlers.softDrop());
  }

  pressHardDrop(): void {
    this.dispatch(() => this.options.handlers.hardDrop?.());
  }

  pressRotateClockwise(): void {
    this.dispatch(() => this.options.handlers.rotateClockwise());
  }

  pressRotateCounterclockwise(): void {
    this.dispatch(() => this.options.handlers.rotateCounterclockwise?.());
  }

  pressHold(): void {
    this.dispatch(() => this.options.handlers.hold?.());
  }

  pressSpell(slot: number): void {
    this.dispatch(() => this.options.handlers.castSpell(slot));
  }

  pressSkill(slot: number): void {
    this.dispatch(() => this.options.handlers.useSkill?.(slot));
  }

  pressBag(): void {
    this.dispatch(() => this.options.handlers.openBag());
  }

  pressSettings(): void {
    this.dispatch(() => this.options.handlers.openSettings());
  }

  private dispatch(action: () => unknown): void {
    if (this.options.getState().inputLocked) {
      return;
    }
    action();
  }
}
