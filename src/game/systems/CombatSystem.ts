import type { CascadeResult, EnemyInstance, RunState } from '../types/GameTypes';
import { CASCADE_MANA_BONUS_MULTIPLIER, LINE_CLEAR_BONUS, MANA_GAIN, MAX_EVENT_LOG } from '../utils/constants';
import { clamp } from '../utils/math';
import { RelicSystem } from './RelicSystem';

export class CombatSystem {
  private readonly relicSystem = new RelicSystem();

  constructor(private readonly state: RunState) {}

  private getComboBonus(combo: number): number {
    if (combo >= 4) {
      return 12;
    }
    if (combo === 3) {
      return 7;
    }
    if (combo === 2) {
      return 3;
    }
    return 0;
  }

  private getCascadeMultiplier(cascadeCount: number): number {
    if (cascadeCount >= 4) {
      return 2.0;
    }
    if (cascadeCount === 3) {
      return 1.5;
    }
    if (cascadeCount === 2) {
      return 1.25;
    }
    return 1.0;
  }

  private getLineClearBonus(lines: number): number {
    if (lines <= 4) {
      return LINE_CLEAR_BONUS[lines] ?? 0;
    }
    return LINE_CLEAR_BONUS[4] + (lines - 4) * 10;
  }

  private getLineClearMana(lines: number): number {
    if (lines <= 4) {
      return MANA_GAIN[lines] ?? 0;
    }
    return MANA_GAIN[4] + (lines - 4) * 25;
  }

  private getMitigation(enemy: EnemyInstance | null): number {
    if (!enemy) {
      return 0;
    }

    if (enemy.id === 'stone-golem' && !this.state.player.stonebreaker) {
      return 2;
    }

    return 0;
  }

  addLog(message: string): void {
    this.state.eventLog.unshift(message);
    this.state.eventLog = this.state.eventLog.slice(0, MAX_EVENT_LOG);
  }

  resolveLineClear(lines: number): number {
    return this.resolveCascadeClear({
      totalLinesCleared: lines,
      cascadeCount: lines > 0 ? 1 : 0,
      clearedLinesPerCascade: lines > 0 ? [lines] : [],
      blocksDropped: 0,
      causedCombo: false
    });
  }

  resolveCascadeClear(cascade: CascadeResult): number {
    const enemy = this.state.activeEnemy;
    if (!enemy || cascade.totalLinesCleared <= 0) {
      this.state.combo = 0;
      this.addLog('The piece locks without a line clear. Combo resets.');
      return 0;
    }

    this.state.combo += cascade.cascadeCount;
    const comboBonus = this.getComboBonus(this.state.combo);
    const lineBonus = this.getLineClearBonus(cascade.totalLinesCleared);
    const rawDamage =
      this.state.player.baseLineDamage +
      this.state.player.lineDamageBonus +
      lineBonus +
      comboBonus;
    const damage = Math.max(
      1,
      Math.round(this.getCascadeMultiplier(cascade.cascadeCount) * rawDamage - this.getMitigation(enemy))
    );
    enemy.currentHp = Math.max(0, enemy.currentHp - damage);

    const baseMana = this.getLineClearMana(cascade.totalLinesCleared);
    const bonusMana = cascade.cascadeCount > 1 ? Math.floor(baseMana * CASCADE_MANA_BONUS_MULTIPLIER) : 0;
    this.state.player.mana = clamp(
      this.state.player.mana + baseMana + bonusMana,
      0,
      this.state.player.maxMana
    );

    if (this.state.player.comboHeart && this.state.combo >= 3) {
      this.state.player.hp = clamp(this.state.player.hp + 1, 0, this.state.player.maxHp);
      this.addLog('Combo Heart restores 1 HP.');
    }

    this.addLog('Line cleared!');
    if (cascade.cascadeCount > 1) {
      this.addLog('Cascade Gravity triggered!');
      this.addLog(`Cascade x${cascade.cascadeCount}!`);
      if (cascade.blocksDropped > 0) {
        this.addLog('Blocks collapsed into a new line!');
      }
      this.addLog('Cascade combo dealt bonus damage!');
    }

    this.addLog(
      `Cleared ${cascade.totalLinesCleared} line${cascade.totalLinesCleared > 1 ? 's' : ''} for ${damage} damage and mana gain.`
    );

    return damage;
  }

  countDownEnemyAttack(): boolean {
    if (!this.state.activeEnemy) {
      return false;
    }

    this.state.activeEnemy.attackCounter -= 1;
    return this.state.activeEnemy.attackCounter <= 0;
  }

  resetEnemyCounter(): void {
    if (!this.state.activeEnemy) {
      return;
    }

    this.state.activeEnemy.attackCounter = this.state.activeEnemy.attackIntervalLocks;
  }

  applyDirectDamage(amount: number, label: string): void {
    if (!this.state.activeEnemy) {
      return;
    }

    this.state.activeEnemy.currentHp = Math.max(0, this.state.activeEnemy.currentHp - amount);
    this.addLog(`${label} hits for ${amount} damage.`);
  }

  applyEnemyDamage(amount: number): boolean {
    const player = this.state.player;
    if (
      player.emergencyBarrier &&
      !player.emergencyBarrierUsed &&
      player.hp - amount <= 0
    ) {
      player.emergencyBarrierUsed = true;
      player.hp = 1;
      this.addLog('Emergency Barrier prevents lethal damage.');
      return false;
    }

    player.hp = Math.max(0, player.hp - amount);
    this.relicSystem.applyOnDamageTaken(this.state).forEach((message) => this.addLog(message));
    return player.hp <= 0;
  }
}
