import type { RunState, SpellCatalystModifier, SpellId } from '../types/GameTypes';
import { SPELLS } from '../data/spells';
import { clamp } from '../utils/math';
import { TETROMINO_COLORS } from '../utils/constants';
import { CombatSystem } from './CombatSystem';
import { BoardSystem } from './BoardSystem';
import { OopsieSystem } from './OopsieSystem';
import { WeaponSystem } from './WeaponSystem';

export class SpellSystem {
  private readonly oopsieSystem = new OopsieSystem();
  private readonly weaponSystem = new WeaponSystem();

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
      .reduce((lowest, modifier) => Math.min(lowest, modifier.costMultiplier ?? 1), 1);
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

    const spellPowerBonus = this.weaponSystem.getSpellDamageBonus(this.state, spellId);

    switch (spellId) {
      case 'fireball': {
        this.combat.applyDirectDamage(22 + this.getSpellBonus('fireball') + spellPowerBonus, 'Fireball');
        const cleanupCap = this.state.hero.passiveId === 'passive_preheat_cleanup' || this.hasCleanupModifier(spellModifiers) ? 3 : 2;
        const toasted = this.board.clearBlocksByIds(['block_sticky', 'block_crumb_junk', 'block_cloud_junk'], cleanupCap);
        const reducedIncoming = this.reduceIncomingJunk(1);
        this.combat.addLog(`Fireball toasted ${toasted} sticky or junk block${toasted === 1 ? '' : 's'}.`);
        if (reducedIncoming > 0) {
          this.combat.addLog(`Cascade cleanup reduced incoming junk by ${reducedIncoming}.`);
        }
        break;
      }
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
        this.combat.addLog('Frost Lock cooled the board pressure.');
        break;
      case 'bomb-rune': {
        const zuzuBonus = this.state.hero.passiveId === 'passive_bombs_are_features' ? 8 : 0;
        const bonus = this.getSpellBonus('bomb-rune') + zuzuBonus + spellPowerBonus;
        this.combat.applyDirectDamage(35 + bonus, 'Bomb Rune');
        const radius = 1 + Math.max(0, ...spellModifiers.map((modifier) => modifier.bombRadiusBonus ?? 0));
        const removed = this.board.clearRandomFilledArea(radius);
        const spawn = this.board.tryAddSpecialBlocks('block_bomb', 1, 'spell', 'bomb-rune');
        this.combat.addLog(`Bomb Rune blasts a focused area and removes ${removed} blocks.`);
        if (spawn.success) {
          this.combat.addLog('Bomb Rune primed one Bomb Block.');
        } else {
          this.combat.addLog('Bomb cap reached: no extra Bomb Block this time.');
        }
        break;
      }
      case 'void-cut':
      case 'clean-cut': {
        this.combat.applyDirectDamage(15 + this.getSpellBonus('clean-cut') + this.getSpellBonus('void-cut') + spellPowerBonus, 'Clean Cut');
        const cleared = this.board.clearMessiestRow();
        if (this.state.player.voidCutRefund && cleared >= 8) {
          this.state.player.mana = clamp(this.state.player.mana + 20, 0, this.state.player.maxMana);
          this.combat.addLog('Clean Cut refunds 20 mana.');
        }
        const cleaned = this.board.clearBlocksByIds(['block_sticky', 'block_crumb_junk', 'block_cloud_junk', 'block_cracked_junk', 'block_royal'], 3);
        const reducedIncoming = this.reduceIncomingJunk(2);
        this.combat.addLog(`Clean Cut swept away ${cleaned} troublesome block${cleaned === 1 ? '' : 's'}.`);
        if (reducedIncoming > 0) {
          this.combat.addLog(`Clean Cut also blocked ${reducedIncoming} incoming junk.`);
        }
        if (this.hasCleanupModifier(spellModifiers)) {
          const extraCleaned = this.board.clearBlocksByIds(['block_sticky', 'block_crumb_junk', 'block_cloud_junk'], 2);
          this.combat.addLog(`Cleaning Charm clears ${extraCleaned} extra sticky or junk block${extraCleaned === 1 ? '' : 's'}.`);
        }
        break;
      }
      case 'sprinkle-shower': {
        const added = this.board.addSpecialBlocksForSpell('block_sprinkle', 4);
        this.state.player.mana = clamp(this.state.player.mana + 8, 0, this.state.player.maxMana);
        this.combat.applyDirectDamage(4 + spellPowerBonus, 'Sprinkle Shower');
        this.combat.addLog(`Sprinkle Shower adds ${added} mana-friendly sprinkle blocks.`);
        break;
      }
      case 'cupcake-blast': {
        this.state.player.hp = clamp(this.state.player.hp + 4, 0, this.state.player.maxHp);
        const cleared = this.board.clearBlocksByIds(['block_sticky'], 3);
        this.combat.applyDirectDamage(12 + spellPowerBonus, 'Cupcake Blast');
        this.combat.addLog(`Cupcake Blast heals 4 HP and clears ${cleared} sticky block${cleared === 1 ? '' : 's'}.`);
        break;
      }
      case 'confetti-pop': {
        const added = this.board.addConfettiBlocks(3);
        const cleared = this.board.clearRandomCluster(2);
        this.combat.applyDirectDamage(8 + spellPowerBonus, 'Confetti Pop');
        this.combat.addLog(`Confetti Pop adds ${added} confetti and pops ${cleared} blocks.`);
        break;
      }
      case 'bubble-shield': {
        this.combat.addPlayerShield(10, 'Bubble Shield');
        const delayed = this.delayIncomingJunk(2);
        if (delayed > 0) {
          this.combat.addLog('Snack Shield delayed the mess!');
        } else {
          this.combat.addLog('Bubble Shield wrapped the board in snack-safe sparkle.');
        }
        break;
      }
      case 'star-spark': {
        const spawn = this.board.tryAddSpecialBlocks('block_star', 1, 'spell', 'star-spark');
        this.combat.applyDirectDamage(14 + spellPowerBonus, 'Star Spark');
        if (spawn.success) {
          this.combat.addLog('Star Spark placed a Star Block.');
        } else {
          this.combat.addLog('Star cap reached: no extra Star Block this time.');
        }
        break;
      }
      case 'jelly-bounce': {
        const added = this.board.addSpecialBlocksForSpell('block_jelly', 2);
        this.state.fallSpeed = Math.max(0.7, this.state.fallSpeed - 0.04);
        this.combat.applyDirectDamage(9 + spellPowerBonus, 'Jelly Bounce');
        this.combat.addLog(`Jelly Bounce adds ${added} wobbly blocks and slows the room slightly.`);
        break;
      }
      case 'snowcone-burst': {
        const thawed = this.board.convertBlocksByIds(['block_ice'], TETROMINO_COLORS.I, 4);
        enemy.frozenTurns += 1;
        this.combat.applyDirectDamage(10 + spellPowerBonus, 'Snowcone Burst');
        this.combat.addLog(`Snowcone Burst chills the enemy and thaws ${thawed} ice block${thawed === 1 ? '' : 's'}.`);
        break;
      }
      case 'goblin-gadget': {
        const converted = this.board.convertBlocksByIds(['block_crumb_junk', 'block_cloud_junk', 'block_royal'], TETROMINO_COLORS.T, 3);
        this.combat.applyDirectDamage(10 + spellPowerBonus, 'Goblin Gadget');
        this.combat.addLog(`Goblin Gadget recalibrates ${converted} messy block${converted === 1 ? '' : 's'}.`);
        break;
      }
      case 'rainbow-reroll':
        this.board.rerollActiveAndNext();
        this.state.player.mana = clamp(this.state.player.mana + 5, 0, this.state.player.maxMana);
        this.combat.addLog('Rainbow Reroll refreshed the queue.');
        break;
      case 'snack-break':
        this.state.player.hp = clamp(this.state.player.hp + 6, 0, this.state.player.maxHp);
        this.state.player.mana = clamp(this.state.player.mana + 8, 0, this.state.player.maxMana);
        this.combat.addLog('Snack Break restores 6 HP and 8 mana.');
        break;
      case 'cascade-cheer':
        this.state.player.fever = clamp(this.state.player.fever + 18, 0, 100);
        this.state.player.lineDamageBonus += 1;
        this.combat.applyDirectDamage(6 + spellPowerBonus, 'Cascade Cheer');
        this.combat.addLog('Cascade Cheer is ready for the next chain!');
        break;
      default:
        this.combat.addLog(`${this.getSpellLabel(spellId)} is marked as a safe placeholder.`);
        break;
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

  private delayIncomingJunk(pieces: number): number {
    if (!Array.isArray(this.state.incomingJunkQueue) || this.state.incomingJunkQueue.length === 0) {
      return 0;
    }
    const delayBy = Math.max(1, pieces);
    this.state.incomingJunkQueue.forEach((entry) => {
      entry.delayPieces = Math.min(8, Math.max(1, entry.delayPieces + delayBy));
    });
    return this.state.incomingJunkQueue.length;
  }

  private reduceIncomingJunk(amount: number): number {
    if (!Array.isArray(this.state.incomingJunkQueue) || this.state.incomingJunkQueue.length === 0) {
      return 0;
    }

    let remaining = Math.max(0, Math.floor(amount));
    let reduced = 0;
    this.state.incomingJunkQueue.sort((a, b) => a.delayPieces - b.delayPieces);
    for (const entry of this.state.incomingJunkQueue) {
      if (remaining <= 0) {
        break;
      }
      const take = Math.min(entry.remainingAmount, remaining);
      entry.remainingAmount -= take;
      reduced += take;
      remaining -= take;
    }
    this.state.incomingJunkQueue = this.state.incomingJunkQueue.filter((entry) => entry.remainingAmount > 0);
    return reduced;
  }

  private getSpellLabel(spellId: SpellId): string {
    return SPELLS.find((spell) => spell.id === spellId)?.label ?? 'Unknown spell';
  }

  private getSpellBonus(spellId: SpellId): number {
    return this.state.player.spellBonuses[spellId] ?? 0;
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
          ? this.board.tryAddSpecialBlocks('block_star', 1, 'spell', 'star-syrup').added
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

