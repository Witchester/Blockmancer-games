import type { RunState, SpellId } from '../types/GameTypes';
import { SPELL_ID_BY_CONTENT_ID } from '../data/spells';
import { contentRegistry } from './ContentRegistry';

const RELEASE_1_ROUTE_HERO_IDS = new Set([
  'hero_milo_blockmancer',
  'hero_pippa_pyromancer',
  'hero_zuzu_goblin_engineer',
  'hero_nixie_frostbinder',
  'hero_bruk_snack_knight',
  'hero_lumi_star_witch'
]);

const MILO_SAFE_DEFAULT_LOADOUT: SpellId[] = ['fireball', 'frost-lock'];

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
    const configuredSpellIds = Array.isArray(hero.startingLoadout?.spellIds)
      ? hero.startingLoadout.spellIds
      : [];
    const runtimeLoadout: SpellId[] = [];
    for (const contentSpellId of configuredSpellIds) {
      const runtimeSpellId = SPELL_ID_BY_CONTENT_ID[contentSpellId];
      if (!runtimeSpellId) {
        console.warn(`[HeroSystem] Unsupported spell id '${contentSpellId}' in hero loadout '${hero.id}'.`);
        continue;
      }
      if (!runtimeLoadout.includes(runtimeSpellId)) {
        runtimeLoadout.push(runtimeSpellId);
      }
    }

    if (runtimeLoadout.length === 0 && hero.id === 'hero_milo_blockmancer') {
      state.spells = [...MILO_SAFE_DEFAULT_LOADOUT];
    } else {
      state.spells = runtimeLoadout;
    }

    if (!RELEASE_1_ROUTE_HERO_IDS.has(hero.id)) {
      console.warn(`[HeroSystem] Hero '${hero.id}' is outside Release 1 route scope; keeping content-defined loadout only.`);
    }

    // Set HeroState
    state.hero = {
      id: hero.id,
      name: hero.name,
      className: hero.className,
      passiveId: typeof hero.passive?.id === 'string' ? hero.passive.id : 'passive_none',
      unlocked: true // For current run it's true
    };
  }
}
