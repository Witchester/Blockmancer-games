import { contentRegistry } from './ContentRegistry';

export class WeaponSystem {
  listWeapons() {
    return contentRegistry.listEnabled('weapon');
  }

  getWeapon(id: string) {
    return contentRegistry.getWeapon(id);
  }
}
