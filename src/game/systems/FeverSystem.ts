import type { CascadeResult, RunState } from '../types/GameTypes';
import { clamp } from '../utils/math';

const FEVER_MAX = 100;
const BASE_ACTIVE_LOCKS = 5;
const BASE_DAMAGE_MULTIPLIER = 1.35;
const FEVER_FIZZ_DAMAGE_MULTIPLIER = 1.45;

export type FeverGainResult = {
  gained: number;
  triggered: boolean;
  activeLocks: number;
};

export class FeverSystem {
  calculateCascadeGain(state: RunState, cascade: CascadeResult): number {
    if (cascade.totalLinesCleared <= 0) {
      return 0;
    }

    const cascadeBonus = cascade.cascadeCount * 8;
    const lineBonus = cascade.totalLinesCleared * 4;
    const dropBonus = Math.min(10, Math.floor(cascade.blocksDropped / 6));
    const comboBonus = state.combo >= 4 ? 10 : state.combo >= 3 ? 6 : state.combo >= 2 ? 3 : 0;
    const choirBonus = state.ownedRewards.includes('upg_cascade_choir') && cascade.cascadeCount > 1 ? 6 : 0;

    const baseGain = cascadeBonus + lineBonus + dropBonus + comboBonus + choirBonus;
    const levelBonusPct = Math.min(0.4, ((state.playerLevelState?.chosenUpgrades?.['upg_lvl_fever_gain'] ?? 0) * 0.08));
    return Math.round(baseGain * (1 + levelBonusPct));
  }

  gainFromCascade(state: RunState, cascade: CascadeResult): FeverGainResult {
    if (state.player.feverActiveLocks > 0) {
      return { gained: 0, triggered: false, activeLocks: state.player.feverActiveLocks };
    }

    const gained = this.calculateCascadeGain(state, cascade);
    state.player.fever = clamp(state.player.fever + gained, 0, FEVER_MAX);

    if (state.player.fever < FEVER_MAX) {
      return { gained, triggered: false, activeLocks: 0 };
    }

    state.player.fever = 0;
    state.player.feverActiveLocks = this.getActiveLocks(state);
    return { gained, triggered: true, activeLocks: state.player.feverActiveLocks };
  }

  getDamageMultiplier(state: RunState): number {
    if (state.player.feverActiveLocks <= 0) {
      return 1;
    }

    return state.ownedRewards.includes('upg_fever_fizz')
      ? FEVER_FIZZ_DAMAGE_MULTIPLIER
      : BASE_DAMAGE_MULTIPLIER;
  }

  getManaBonus(state: RunState, manaGain: number): number {
    if (state.player.feverActiveLocks <= 0 || manaGain <= 0) {
      return 0;
    }

    return Math.max(1, Math.floor(manaGain * 0.25));
  }

  tickActiveLock(state: RunState): boolean {
    if (state.player.feverActiveLocks <= 0) {
      return false;
    }

    state.player.feverActiveLocks -= 1;
    return state.player.feverActiveLocks === 0;
  }

  isHydraComboWeaknessActive(state: RunState): boolean {
    return state.activeEnemy?.id === 'mon_boss_high_score_hydra' && (state.combo >= 3 || state.player.feverActiveLocks > 0);
  }

  private getActiveLocks(state: RunState): number {
    return state.ownedRewards.includes('upg_fever_fizz') ? BASE_ACTIVE_LOCKS + 1 : BASE_ACTIVE_LOCKS;
  }
}
