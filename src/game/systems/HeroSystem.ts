import type { RunState, SpellId } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';

const SPELL_ID_BY_CONTENT_ID: Record<string, SpellId> = {
  spl_fireball: 'fireball',
  spl_frost_lock: 'frost-lock',
  spl_bomb_rune: 'bomb-rune',
  spl_void_cut: 'void-cut'
};

export class HeroSystem {
  listHeroes() {
    return contentRegistry.listEnabled('hero');
  }

  getHero(id: string) {
    return contentRegistry.getHero(id);
  }

  applyHeroToRun(state: RunState, heroId: string): void {
    const hero = this.getHero(heroId) as any;
    if (!hero) return;

    // Apply stats
    state.player.maxHp = hero.baseStats.maxHp;
    state.player.hp = hero.baseStats.maxHp;
    state.player.maxMana = hero.baseStats.maxMana;
    state.player.mana = 0; // Starts at 0
    state.player.gold = hero.baseStats.startingGold;
    state.gold = hero.baseStats.startingGold;
    state.player.totalGoldCollected = hero.baseStats.startingGold;
    state.player.baseLineDamage = hero.baseStats.baseLineDamage;
    state.fallSpeed = hero.baseStats.baseFallSpeed;

    // Apply loadout
    state.weapon.id = hero.startingLoadout.weaponId;
    state.spells = hero.startingLoadout.spellIds
      .map((spellId: string) => SPELL_ID_BY_CONTENT_ID[spellId] ?? spellId)
      .filter((spellId: string): spellId is SpellId => ['fireball', 'frost-lock', 'bomb-rune', 'void-cut'].includes(spellId));

    // Set HeroState
    state.hero = {
      id: hero.id,
      name: hero.name,
      className: hero.className,
      passiveId: hero.passive.id,
      unlocked: true // For current run it's true
    };
  }
}
