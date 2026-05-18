import type { RunState, SpellCatalystModifier, SpellId } from '../types/GameTypes';
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
    const multiplier = this.state.reactiveState.nextSpellModifiers
      .filter((modifier) => this.isModifierCompatible(spellId, modifier))
      .reduce(
      (lowest, modifier) => Math.min(lowest, modifier.costMultiplier ?? 1),
      1
    );
    return Math.max(0, Math.round((definition.cost - this.state.player.spellCostReduction + manaHexPenalty) * multiplier));
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
    const spellModifiers = this.state.reactiveState.nextSpellModifiers.filter((modifier) =>
      this.isModifierCompatible(spellId, modifier)
    );
    const hpCost = this.oopsieSystem.getSpellHpCost(this.state);
    if (hpCost > 0) {
      this.state.player.hp = Math.max(1, this.state.player.hp - hpCost);
      this.combat.addLog(`An oopsie nibbles ${hpCost} HP from the spell.`);
    }

    switch (spellId) {
      case 'fireball':
        this.combat.applyDirectDamage(22 + this.state.player.spellBonuses.fireball, 'Fireball');
        if (this.state.hero.passiveId === 'passive_preheat_cleanup' || this.hasCleanupModifier(spellModifiers)) {
          const cleared = this.board.clearBlocksByIds(['block_sticky', 'block_crumb_junk', 'block_cloud_junk'], this.hasCleanupModifier(spellModifiers) ? 4 : 2);
          this.combat.addLog(`Preheat Cleanup burns ${cleared} sticky or junk-prone blocks.`);
        }
        break;
      case 'frost-lock':
        this.state.fallSpeed = Math.max(0.7, this.state.fallSpeed - 0.1);
        if (spellModifiers.some((modifier) => modifier.id === 'frosting_salt')) {
          const thawed = this.board.convertBlocksByIds(['block_ice'], 0x56d3ff, 4);
          this.combat.addLog(`Frosting Salt tidies ${thawed} icy block${thawed === 1 ? '' : 's'}.`);
        }
        if (this.state.hero.passiveId === 'passive_stay_chill') {
          this.state.fallSpeed = Math.max(0.7, this.state.fallSpeed - 0.05);
          this.combat.addLog('Stay Chill smooths the speed spike.');
        }
        if (this.state.player.frostLockDelayBonus && enemy.attackCounter > 1) {
          enemy.attackCounter += 1;
        }
        this.combat.addLog('Frost Lock slows the battlefield.');
        break;
      case 'bomb-rune': {
        const zuzuBonus = this.state.hero.passiveId === 'passive_bombs_are_features' ? 8 : 0;
        const bonus = this.state.player.spellBonuses['bomb-rune'] + zuzuBonus;
        this.combat.applyDirectDamage(35 + bonus, 'Bomb Rune');
        const radius = 1 + Math.max(0, ...spellModifiers.map((modifier) => modifier.bombRadiusBonus ?? 0));
        const removed = this.board.clearRandomFilledArea(radius);
        this.combat.addLog(`Bomb Rune blasts a 3x3 area and removes ${removed} blocks.`);
        if (this.state.hero.passiveId === 'passive_bombs_are_features' && Math.random() < 0.25) {
          this.state.activeHazards.push({
            hazardId: 'hazard_incoming_junk_queue',
            instanceId: `zuzu_bomb_junk_${Date.now()}`,
            kind: 'incoming_junk',
            name: 'Goblin Bomb Crumbs',
            warningText: 'Zuzu made the bomb stronger, and one crumb delivery is wobbling loose.',
            counterTags: ['counter_incoming_junk', 'counter_junk'],
            counterWindowPieces: 3,
            remainingPieces: 3,
            severity: 'minor',
            defaultFailureEffect: 'One crumb junk drops into a safe random column.',
            itemCounterHints: ['Snack Shield', 'Return Stamp'],
            spellCounterHints: ['Bomb Rune', 'Clean Cut'],
            cascadeCounterHint: 'Any line clear can trim it.',
            amount: 1,
            sourceId: 'passive_bombs_are_features',
            blockId: 'block_crumb_junk'
          });
          this.combat.addLog('Bombs Are Features adds power, with one warned crumb risk.');
        }
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
        if (this.hasCleanupModifier(spellModifiers)) {
          const cleaned = this.board.clearBlocksByIds(['block_sticky', 'block_crumb_junk', 'block_cloud_junk'], 4);
          this.combat.addLog(`Cleaning Charm clears ${cleaned} extra sticky or junk block${cleaned === 1 ? '' : 's'}.`);
        }
        break;
      }
    }

    this.applySharedSpellModifiers(spellModifiers);
    this.state.reactiveState.nextSpellModifiers = this.state.reactiveState.nextSpellModifiers.filter((modifier) => {
      if (!spellModifiers.includes(modifier)) {
        return true;
      }
      modifier.consumed = true;
      modifier.remainingCasts -= 1;
      return modifier.remainingCasts > 0;
    });
    const waiting = this.state.reactiveState.nextSpellModifiers.length;
    if (waiting > 0 && spellModifiers.length === 0) {
      this.combat.addLog('Your spell catalyst waits for a compatible spell.');
    }
    return true;
  }

  private getSpellLabel(spellId: SpellId): string {
    return SPELLS.find((spell) => spell.id === spellId)?.label ?? 'Unknown spell';
  }

  private hasCleanupModifier(modifiers: SpellCatalystModifier[]): boolean {
    return modifiers.some((modifier) => modifier.cleanupTags?.some((tag) => tag === 'counter_junk' || tag === 'counter_sticky'));
  }

  private isModifierCompatible(spellId: SpellId, modifier: SpellCatalystModifier): boolean {
    const filter = modifier.spellFilter;
    if (!filter) {
      return true;
    }
    if (Array.isArray(filter)) {
      return filter.includes(spellId) || filter.includes('any');
    }
    return filter === spellId || filter === 'any';
  }

  private applySharedSpellModifiers(modifiers: SpellCatalystModifier[]): void {
    modifiers.forEach((modifier) => {
      if (modifier.extraBlockId) {
        const added = modifier.extraBlockId === 'block_star'
          ? this.board.addSpecialBlocksForSpell('block_star', 1)
          : 0;
        this.combat.addLog(`Star Syrup leaves ${added} bright star block${added === 1 ? '' : 's'} behind.`);
      }
      if (modifier.feverMultiplier) {
        this.state.player.fever = clamp(this.state.player.fever + Math.round(12 * modifier.feverMultiplier), 0, 100);
        this.combat.addLog('Cascade Confetti charges fever for the next big play.');
      }
    });
  }
}
