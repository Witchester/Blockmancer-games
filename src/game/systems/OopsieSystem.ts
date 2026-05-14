import type { RunState, TetrominoType } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';

type OopsieEffect = {
  type: string;
  value?: number;
  hpCost?: number;
};

export type OopsieEntry = {
  id: string;
  name: string;
  description: string;
  effects: OopsieEffect[];
  removeCost?: number;
  enabled?: boolean;
};

const LEGACY_OOPSIE_IDS = [
  'oops_heavy_blocks',
  'oops_too_much_confetti',
  'oops_snack_tax',
  'oops_sticky_floor',
  'oops_overexcited_machine',
  'oops_sugar_crash',
  'oops_slippery_buttons',
  'oops_square_only'
];

export class OopsieSystem {
  listEnabled(): OopsieEntry[] {
    return contentRegistry.listEnabled<OopsieEntry>('oopsie');
  }

  getOopsie(id: string): OopsieEntry | null {
    return contentRegistry.getOptionalById<OopsieEntry>('oopsie', id);
  }

  normalizeState(state: RunState): void {
    const migrated = state.player.oopsies?.length ? state.player.oopsies : [];
    if (migrated.length === 0 && state.player.curses > 0) {
      state.player.oopsies = LEGACY_OOPSIE_IDS.slice(0, state.player.curses);
    } else {
      state.player.oopsies = [...new Set(migrated)];
    }

    state.player.oopsies = state.player.oopsies.filter((id) => Boolean(this.getOopsie(id)));
    state.player.curses = state.player.oopsies.length;
  }

  addRandomOopsie(state: RunState): OopsieEntry | null {
    this.normalizeState(state);
    const candidates = this.listEnabled().filter((entry) => !state.player.oopsies.includes(entry.id));
    if (candidates.length === 0) {
      return null;
    }

    const selected = choice(candidates);
    state.player.oopsies.push(selected.id);
    state.player.curses = state.player.oopsies.length;
    return selected;
  }

  removeOopsie(state: RunState, id?: string): OopsieEntry | null {
    this.normalizeState(state);
    if (state.player.oopsies.length === 0) {
      return null;
    }

    const targetId = id ?? state.player.oopsies[0];
    const index = state.player.oopsies.indexOf(targetId);
    if (index < 0) {
      return null;
    }

    const [removedId] = state.player.oopsies.splice(index, 1);
    state.player.curses = state.player.oopsies.length;
    return this.getOopsie(removedId);
  }

  getActiveOopsies(state: RunState): OopsieEntry[] {
    this.normalizeState(state);
    return state.player.oopsies
      .map((id) => this.getOopsie(id))
      .filter((entry): entry is OopsieEntry => Boolean(entry));
  }

  getSummary(state: RunState): string {
    const active = this.getActiveOopsies(state);
    if (active.length === 0) {
      return 'Oopsies: none';
    }

    const names = active.slice(0, 2).map((entry) => entry.name).join(', ');
    return active.length > 2 ? `Oopsies: ${names} +${active.length - 2}` : `Oopsies: ${names}`;
  }

  getRemovalCost(state: RunState): number {
    const first = this.getActiveOopsies(state)[0];
    return first?.removeCost ?? 50;
  }

  adjustFallSpeed(state: RunState, baseFallSpeed: number): number {
    const bonus = this.sumEffects(state, 'increase_fall_speed');
    return clamp(baseFallSpeed + bonus, 0.7, 2.0);
  }

  adjustManaGain(state: RunState, amount: number): number {
    const reduction = this.sumEffects(state, 'reduce_mana_gain_percent');
    return Math.max(0, Math.floor(amount * (1 - reduction)));
  }

  adjustShopPrice(state: RunState, basePrice: number): number {
    const increase = this.sumEffects(state, 'shop_price_increase_percent');
    return Math.ceil(basePrice * (1 + increase));
  }

  adjustEnemyAttackInterval(state: RunState, baseInterval: number): number {
    const penalty = this.sumEffects(state, 'enemy_attack_interval_penalty');
    return Math.max(1, baseInterval - Math.round(penalty));
  }

  getPiecePool(state: RunState, baseTypes: TetrominoType[]): TetrominoType[] {
    if (!this.hasEffect(state, 'favor_square_blocks')) {
      return baseTypes;
    }

    return [...baseTypes, 'O', 'O'];
  }

  shouldHidePreview(state: RunState): boolean {
    return this.rollChance(state, 'hide_next_piece_chance');
  }

  shouldSlipButton(state: RunState): boolean {
    return this.rollChance(state, 'slippery_button_chance');
  }

  shouldAddConfettiJunk(state: RunState): boolean {
    return this.rollChance(state, 'confetti_junk_chance');
  }

  shouldAddStickyJunk(state: RunState): boolean {
    return this.rollChance(state, 'sticky_junk_chance');
  }

  getSpellHpCost(state: RunState): number {
    for (const effect of this.getEffects(state)) {
      if (effect.type === 'spell_hp_cost_chance' && Math.random() < (effect.value ?? 0)) {
        return Math.max(1, effect.hpCost ?? 1);
      }
    }
    return 0;
  }

  private sumEffects(state: RunState, type: string): number {
    return this.getEffects(state)
      .filter((effect) => effect.type === type)
      .reduce((total, effect) => total + (effect.value ?? 0), 0);
  }

  private hasEffect(state: RunState, type: string): boolean {
    return this.getEffects(state).some((effect) => effect.type === type);
  }

  private rollChance(state: RunState, type: string): boolean {
    const chance = this.sumEffects(state, type);
    return chance > 0 && Math.random() < chance;
  }

  private getEffects(state: RunState): OopsieEffect[] {
    return this.getActiveOopsies(state).flatMap((entry) => entry.effects ?? []);
  }
}
