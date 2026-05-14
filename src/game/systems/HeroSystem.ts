import { contentRegistry } from './ContentRegistry';

export class HeroSystem {
  listHeroes() {
    return contentRegistry.listEnabled('hero');
  }

  getHero(id: string) {
    return contentRegistry.getHero(id);
  }
}
