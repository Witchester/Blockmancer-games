import type { RunState, SpellId } from '../types/GameTypes';
import { SPELLS } from '../data/spells';
import { clamp } from '../utils/math';
import { CombatSystem } from './CombatSystem';
import { BoardSystem } from './BoardSystem';
import { OopsieSystem } from './OopsieSystem';

export class SpellSystem {
  private readonly oopsieSystem = new OopsieSystem();

  constructor(
    private readonly state: RunState,
    private readonly board: BoardSystem,
    private readonly combat: CombatSystem
  ) {}

  getCost(spellId: SpellId): number {
    const definition = SPELLS.find((spell) => spell.id === spellId);
    if (!definition) {
      return 999;
    }

    const manaHexPenalty = this.state.activeEnemy?.manaHexTurns ? 10 : 0;
    return Math.max(10, definition.cost - this.state.player.spellCostReduction + manaHexPenalty);
  }

  cast(spellId: SpellId): boolean {
    const enemy = this.state.activeEnemy;
    if (!enemy) {
      this.combat.addLog('No active enemy. The spell fizzles.');
      return false;
    }

    const cost = this.getCost(spellId);
    if (this.state.player.mana < cost) {
      this.combat.addLog(`${this.getSpellLabel(spellId)} needs ${cost} mana.`);
      return false;
    }

    this.state.player.mana -= cost;
    const hpCost = this.oopsieSystem.getSpellHpCost(this.state);
    if (hpCost > 0) {
      this.state.player.hp = Math.max(1, this.state.player.hp - hpCost);
      this.combat.addLog(`An oopsie nibbles ${hpCost} HP from the spell.`);
    }

    switch (spellId) {
      case 'fireball':
        this.combat.applyDirectDamage(22 + this.state.player.spellBonuses.fireball, 'Fireball');
        break;
      case 'frost-lock':
        this.state.fallSpeed = Math.max(0.7, this.state.fallSpeed - 0.1);
        if (this.state.player.frostLockDelayBonus && enemy.attackCounter > 1) {
          enemy.attackCounter += 1;
        }
        this.combat.addLog('Frost Lock slows the battlefield.');
        break;
      case 'bomb-rune': {
        const bonus = this.state.player.spellBonuses['bomb-rune'];
        this.combat.applyDirectDamage(35 + bonus, 'Bomb Rune');
        const removed = this.board.clearRandomFilledArea(1);
        this.combat.addLog(`Bomb Rune blasts a 3x3 area and removes ${removed} blocks.`);
        break;
      }
      case 'void-cut': {
        this.combat.applyDirectDamage(15 + this.state.player.spellBonuses['void-cut'], 'Void Cut');
        const cleared = this.board.clearMessiestRow();
        if (this.state.player.voidCutRefund && cleared >= 8) {
          this.state.player.mana = clamp(this.state.player.mana + 20, 0, this.state.player.maxMana);
          this.combat.addLog('Void Cut refunds 20 mana.');
        }
        this.combat.addLog(`Void Cut removes ${cleared} blocks from a row.`);
        break;
      }
    }

    return true;
  }

  private getSpellLabel(spellId: SpellId): string {
    return SPELLS.find((spell) => spell.id === spellId)?.label ?? 'Unknown spell';
  }
}
