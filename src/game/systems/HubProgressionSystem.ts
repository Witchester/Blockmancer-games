import type { MetaState } from '../types/MetaTypes';
import type { GameplayEffect } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';

type HubBuildingLevel = {
  level: number;
  cost: Record<string, number>;
  unlocks: string[];
  effect?: GameplayEffect[];
};

export type HubBuildingEntry = {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  levels: HubBuildingLevel[];
  enabled?: boolean;
};

export class HubProgressionSystem {
  listBuildings(): HubBuildingEntry[] {
    return contentRegistry.listEnabled<HubBuildingEntry>('hubBuilding');
  }

  canUpgrade(meta: MetaState, buildingId: string): boolean {
    const building = contentRegistry.getOptionalById<HubBuildingEntry>('hubBuilding', buildingId);
    if (!building) {
      return false;
    }
    return (meta.hubBuildings[buildingId] ?? 0) < building.maxLevel;
  }

  getSummary(meta: MetaState): string {
    const buildings = this.listBuildings();
    if (buildings.length === 0) {
      return 'Hub: festival booths pending setup.';
    }
    return buildings.slice(0, 3).map((building) => `${building.name} Lv.${meta.hubBuildings[building.id] ?? 0}`).join('   ');
  }
}
