import type { CascadeResult, RunState, SpellId } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { contentRegistry } from './ContentRegistry';
import type { BoardSystem } from './BoardSystem';
import type { CombatSystem } from './CombatSystem';

type WeaponContent = {
  id: string;
  name: string;
  weaponType: string;
  stats?: {
    lineDamageBonus?: number;
    comboDamageBonus?: number;
    spellDamageBonus?: number;
    manaGainBonus?: number;
  };
  effects?: Array<string | { type: string; value?: number }>;
};

const WEAPON_ALIASES: Record<string, string> = {
  wpn_lemonade_wand: 'wpn_apprentice_staff',
  wpn_cookie_spatula: 'wpn_fire_tome',
  wpn_snowcone_staff: 'wpn_frost_staff',
  wpn_spring_hammer: 'wpn_stone_hammer',
  wpn_confetti_cannon: 'wpn_party_popper',
  wpn_goblin_multitool: 'wpn_apprentice_staff',
  wpn_plush_lance: 'wpn_rune_blade',
  wpn_arcade_blaster: 'wpn_gravity_orb'
};

export class WeaponSystem {
  listWeapons() {
    return contentRegistry.listEnabled('weapon');
  }

  getWeapon(id: string) {
    return contentRegistry.getWeapon(id) ?? contentRegistry.getWeapon(WEAPON_ALIASES[id] ?? id);
  }

  applyBattleStart(state: RunState, combat: CombatSystem, board?: BoardSystem): void {
    const weaponId = this.getWeaponId(state);
    switch (weaponId) {
      case 'wpn_plush_lance':
      case 'wpn_rune_blade':
        state.player.shield += 5;
        combat.addLog('Plush Lance starts the battle with 5 shield.');
        break;
      case 'wpn_goblin_multitool':
        if (board) {
          const converted = board.convertBlocksByIds(['block_crumb_junk', 'block_cloud_junk'], 0x9adfff, 1);
          if (converted > 0) {
            combat.addLog('Goblin Multitool preps one junk block into a safe rune.');
          }
        }
        break;
      default:
        break;
    }
  }

  afterPieceLock(state: RunState, board: BoardSystem, combat: CombatSystem, cascade: CascadeResult): void {
    const weaponId = this.getWeaponId(state);
    if ((weaponId === 'wpn_confetti_cannon' || weaponId === 'wpn_party_popper') && Math.random() < 0.18) {
      const added = board.addConfettiBlocks(1);
      if (added > 0) {
        combat.addLog('Confetti Cannon adds a bonus confetti block.');
      }
    }
    if (weaponId === 'wpn_arcade_blaster' || weaponId === 'wpn_gravity_orb') {
      const bonus = cascade.cascadeCount > 1 ? 5 : 1;
      state.player.fever = clamp(state.player.fever + bonus, 0, 100);
      combat.addLog(`Arcade Blaster adds ${bonus} Fever.`);
    }
    if ((weaponId === 'wpn_star_scepter') && cascade.cascadeCount > 1) {
      combat.applyDirectDamage(4, 'Star Scepter');
    }
  }

  onHardDrop(state: RunState, combat: CombatSystem): void {
    const weaponId = this.getWeaponId(state);
    if (weaponId === 'wpn_spring_hammer' || weaponId === 'wpn_stone_hammer') {
      state.player.mana = clamp(state.player.mana + 3, 0, state.player.maxMana);
      combat.applyDirectDamage(3, 'Spring Hammer');
    }
  }

  getManaGainBonus(state: RunState): number {
    const weapon = this.getContent(state);
    const weaponId = this.getWeaponId(state);
    if (weaponId === 'wpn_lemonade_wand' || weaponId === 'wpn_apprentice_staff') {
      return 3;
    }
    return weapon?.stats?.manaGainBonus ?? 0;
  }

  getSpellDamageBonus(state: RunState, spellId: SpellId): number {
    const weaponId = this.getWeaponId(state);
    if ((weaponId === 'wpn_cookie_spatula' || weaponId === 'wpn_fire_tome') && this.isFireSpell(spellId)) {
      return 6;
    }
    if ((weaponId === 'wpn_snowcone_staff' || weaponId === 'wpn_frost_staff') && this.isFrostSpell(spellId)) {
      return 4;
    }
    if ((weaponId === 'wpn_goblin_multitool') && (spellId === 'bomb-rune' || spellId === 'goblin-gadget')) {
      return 5;
    }
    return this.getContent(state)?.stats?.spellDamageBonus ?? 0;
  }

  getCascadeDamageBonus(state: RunState, cascade: CascadeResult): number {
    const weaponId = this.getWeaponId(state);
    if ((weaponId === 'wpn_star_scepter') && cascade.cascadeCount > 1) {
      return 5;
    }
    return this.getContent(state)?.stats?.comboDamageBonus ?? 0;
  }

  private getContent(state: RunState): WeaponContent | null {
    return this.getWeapon(state.weapon.id) as WeaponContent | null;
  }

  private getWeaponId(state: RunState): string {
    return state.weapon.id;
  }

  private isFireSpell(spellId: SpellId): boolean {
    return spellId === 'fireball' || spellId === 'cupcake-blast';
  }

  private isFrostSpell(spellId: SpellId): boolean {
    return spellId === 'frost-lock' || spellId === 'snowcone-burst';
  }
}
