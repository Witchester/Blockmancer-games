import type { RunState, SpellId } from '../types/GameTypes';
import { RELEASE_1_SPELL_CONTENT_IDS, SPELL_ID_BY_CONTENT_ID } from '../data/spells';
import { contentRegistry } from './ContentRegistry';

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
      .filter((spellId: string): spellId is SpellId => Object.values(SPELL_ID_BY_CONTENT_ID).includes(spellId));
    for (const contentId of RELEASE_1_SPELL_CONTENT_IDS) {
      const spellId = SPELL_ID_BY_CONTENT_ID[contentId];
      if (!state.spells.includes(spellId)) {
        state.spells.push(spellId);
      }
    }

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
