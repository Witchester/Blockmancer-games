import type { CascadeResult, EnemyInstance, RunState } from '../types/GameTypes';
import { CASCADE_MANA_BONUS_MULTIPLIER, LINE_CLEAR_BONUS, MANA_GAIN, MAX_EVENT_LOG } from '../utils/constants';
import { clamp } from '../utils/math';
import { OopsieSystem } from './OopsieSystem';
import { RelicSystem } from './RelicSystem';
import { FeverSystem } from './FeverSystem';

export type EnemyAttackResult = {
  defeated: boolean;
  hpDamage: number;
  shieldBlocked: number;
};

export type CombatResolveResult = {
  damage: number;
  specialDamage: number;
  feverGained: number;
  feverTriggered: boolean;
};

export class CombatSystem {
  private readonly relicSystem = new RelicSystem();
  private readonly oopsieSystem = new OopsieSystem();
  private readonly feverSystem = new FeverSystem();

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

    let mitigation = enemy.armor;
    if ((enemy.id === 'stone-golem' || enemy.behavior === 'reduce_line_damage') && !this.state.player.stonebreaker) {
      mitigation += 2;
    }

    if (enemy.lineDamageBlockedTurns > 0) {
      mitigation += 3;
    }

    return mitigation;
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
      specialBlocksTriggered: [],
      causedCombo: false
    }).damage;
  }

  private firstLineClearMage = true;

  resolveCascadeClear(cascade: CascadeResult): CombatResolveResult {
    const enemy = this.state.activeEnemy;
    if (!enemy || cascade.totalLinesCleared <= 0) {
      this.state.combo = 0;
      this.state.lastCascadeLevel = 0;
      this.state.lastCascadeLines = 0;
      this.addLog('The piece locks without a line clear. Combo resets.');
      if (enemy?.id === 'mon_boss_high_score_hydra') {
        this.addEnemyShield(5);
        this.addLog('High Score Hydra banks a small shield when the combo drops.');
      }
      return { damage: 0, specialDamage: 0, feverGained: 0, feverTriggered: false };
    }

    this.state.combo += cascade.cascadeCount;
    this.state.lastCascadeLevel = cascade.cascadeCount;
    this.state.lastCascadeLines = cascade.totalLinesCleared;
    const comboBonus = this.getComboBonus(this.state.combo);
    const lineBonus = this.getLineClearBonus(cascade.totalLinesCleared);
    const rawDamage =
      this.state.player.baseLineDamage +
      this.state.player.lineDamageBonus +
      lineBonus +
      comboBonus;
    let damage = Math.max(
      1,
      Math.round(this.getCascadeMultiplier(cascade.cascadeCount) * rawDamage - this.getMitigation(enemy))
    );
    const feverMultiplier = this.feverSystem.getDamageMultiplier(this.state);
    if (feverMultiplier > 1) {
      damage = Math.round(damage * feverMultiplier);
    }
    if (this.feverSystem.isHydraComboWeaknessActive(this.state)) {
      damage = Math.round(damage * 1.2);
      this.addLog('High Score Hydra flashes: combo fever hits its weak spot!');
    }
    this.damageEnemy(damage);

    const baseMana = this.oopsieSystem.adjustManaGain(
      this.state,
      this.getLineClearMana(cascade.totalLinesCleared)
    );
    const bonusMana = cascade.cascadeCount > 1 ? Math.floor(baseMana * CASCADE_MANA_BONUS_MULTIPLIER) : 0;
    const feverMana = this.feverSystem.getManaBonus(this.state, baseMana + bonusMana);
    this.state.player.mana = clamp(this.state.player.mana + baseMana + bonusMana + feverMana, 0, this.state.player.maxMana);
    
    // Handle passive_line_mage
    if (this.state.hero.passiveId === 'passive_line_mage' && this.firstLineClearMage) {
      this.firstLineClearMage = false;
      this.state.player.mana = clamp(this.state.player.mana + 15, 0, this.state.player.maxMana);
      this.addLog('Line Mage grants an initial burst of mana!');
    }

    const specialResult = this.applySpecialBlockEffects(cascade.specialBlocksTriggered);

    if (this.state.player.comboHeart && this.state.combo >= 3) {
      this.state.player.hp = clamp(this.state.player.hp + 1, 0, this.state.player.maxHp);
      this.addLog('Combo Heart restores 1 HP.');
    }
    const feverGain = this.feverSystem.gainFromCascade(this.state, cascade);
    if (feverGain.gained > 0) {
      this.addLog(`Fever +${feverGain.gained}.`);
    }
    if (feverGain.triggered) {
      this.addLog(`Fever starts! Cascades hit harder for ${feverGain.activeLocks} locks.`);
    }
    if (feverMana > 0) {
      this.addLog(`Fever adds ${feverMana} bonus mana.`);
    }

    this.addLog('Line cleared!');
    if (cascade.cascadeCount > 1) {
      this.addLog('Cascade Gravity triggered!');
      this.addLog(`Cascade x${cascade.cascadeCount}!`);
      if (cascade.blocksDropped > 0) {
        this.addLog('Blocks collapsed into a new line!');
      }
      if (cascade.specialBlocksTriggered.length > 0) {
        this.addLog(`Special blocks triggered: ${cascade.specialBlocksTriggered.join(', ')}.`);
      }
      this.addLog('Cascade combo dealt bonus damage!');
    }

    this.addLog(
      `Cleared ${cascade.totalLinesCleared} line${cascade.totalLinesCleared > 1 ? 's' : ''} for ${damage} damage and mana gain.`
    );
    specialResult.messages.forEach((message) => this.addLog(message));

    return {
      damage: damage + specialResult.damage,
      specialDamage: specialResult.damage,
      feverGained: feverGain.gained,
      feverTriggered: feverGain.triggered
    };
  }

  private applySpecialBlockEffects(triggered: string[]): { messages: string[]; damage: number } {
    const messages: string[] = [];
    let totalDamage = 0;
    for (const trigger of triggered) {
      const [blockId, effectType, rawValue] = trigger.split(':');
      const value = Number.isFinite(Number(rawValue)) ? Number(rawValue) : undefined;
      switch (effectType) {
        case 'gain_mana':
          this.state.player.mana = clamp(this.state.player.mana + (value ?? 5), 0, this.state.player.maxMana);
          messages.push(`${this.getBlockName(blockId)} restores mana.`);
          break;
        case 'heal_player':
          this.state.player.hp = clamp(this.state.player.hp + (value ?? 1), 0, this.state.player.maxHp);
          messages.push(`${this.getBlockName(blockId)} restores ${value ?? 1} HP.`);
          break;
        case 'damage_enemy': {
          const bonusDamage = value ?? 3;
          this.damageEnemy(bonusDamage);
          totalDamage += bonusDamage;
          messages.push(`${this.getBlockName(blockId)} adds ${bonusDamage} bonus damage.`);
          break;
        }
        case 'boost_cascade':
          if (this.state.activeEnemy) {
            const bonusDamage = value ?? 3;
            this.damageEnemy(bonusDamage);
            totalDamage += bonusDamage;
          }
          messages.push(`${this.getBlockName(blockId)} boosts cascade damage.`);
          break;
        case 'random_bonus':
          this.state.player.gold += value ?? 3;
          this.state.gold = this.state.player.gold;
          messages.push(`${this.getBlockName(blockId)} drops ${value ?? 3} gold.`);
          break;
        case 'item_charge':
          this.state.player.mana = clamp(this.state.player.mana + (value ?? 3), 0, this.state.player.maxMana);
          messages.push(`${this.getBlockName(blockId)} charges your pack.`);
          break;
        default:
          break;
      }
    }

    return { messages, damage: totalDamage };
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

    this.state.activeEnemy.attackCounter = this.oopsieSystem.adjustEnemyAttackInterval(
      this.state,
      this.state.activeEnemy.attackIntervalLocks
    );
  }

  applyDirectDamage(amount: number, label: string): void {
    if (!this.state.activeEnemy) {
      return;
    }

    this.damageEnemy(amount);
    this.addLog(`${label} hits for ${amount} damage.`);
  }

  addPlayerShield(amount: number, label = 'Shield'): void {
    this.state.player.shield = clamp(this.state.player.shield + amount, 0, 99);
    this.addLog(`${label} grants ${amount} shield.`);
  }

  addEnemyShield(amount: number): void {
    const enemy = this.state.activeEnemy;
    if (!enemy) {
      return;
    }

    enemy.shield = clamp(enemy.shield + amount, 0, 99);
    this.addLog(`${enemy.name} gains ${amount} shield.`);
  }

  healEnemy(amount: number): void {
    const enemy = this.state.activeEnemy;
    if (!enemy) {
      return;
    }

    enemy.currentHp = clamp(enemy.currentHp + amount, 0, enemy.maxHp);
    this.addLog(`${enemy.name} patches up ${amount} HP.`);
  }

  applyEnemyDamage(amount: number): boolean {
    return this.applyEnemyAttack(amount).defeated;
  }

  applyEnemyAttack(amount: number): EnemyAttackResult {
    const player = this.state.player;
    const hpBefore = player.hp;
    const blocked = Math.min(player.shield, amount);
    player.shield -= blocked;
    const remainingDamage = amount - blocked;
    if (blocked > 0) {
      this.addLog(`Shield blocks ${blocked} damage.`);
    }

    if (
      player.emergencyBarrier &&
      !player.emergencyBarrierUsed &&
      player.hp - remainingDamage <= 0
    ) {
      player.emergencyBarrierUsed = true;
      player.hp = 1;
      this.addLog('Emergency Barrier prevents lethal damage.');
      return { defeated: false, hpDamage: Math.max(0, hpBefore - 1), shieldBlocked: blocked };
    }

    let hpDamage = 0;
    if (remainingDamage > 0) {
      player.hp = Math.max(0, player.hp - remainingDamage);
      hpDamage = remainingDamage;
      this.state.runStats.damageTaken += remainingDamage;
      this.relicSystem.applyOnDamageTaken(this.state).forEach((message) => this.addLog(message));
    }
    return { defeated: player.hp <= 0, hpDamage, shieldBlocked: blocked };
  }

  private damageEnemy(amount: number): void {
    const enemy = this.state.activeEnemy;
    if (!enemy) {
      return;
    }

    const blocked = Math.min(enemy.shield, amount);
    enemy.shield -= blocked;
    enemy.currentHp = Math.max(0, enemy.currentHp - (amount - blocked));
    if (blocked > 0) {
      this.addLog(`${enemy.name}'s shield blocks ${blocked} damage.`);
    }
  }

  private getBlockName(blockId: string): string {
    const parts = blockId.split('_').filter(Boolean);
    return parts.length ? parts.map((part) => part[0].toUpperCase() + part.slice(1)).join(' ') : 'Special block';
  }

}
