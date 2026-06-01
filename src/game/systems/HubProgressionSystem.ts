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
  // Release 1: small, conservative hub effects mapping by building id and level
  private static readonly HUB_EFFECTS: Record<string, Record<number, { desc: string; gold?: number; shield?: number; mana?: number; items?: string[]; reroll?: number }>> = {
    hub_cake_stall: {
      1: { desc: 'Start run with a Mini Cupcake.', items: ['item_mini_cupcake'] }
    },
    hub_repair_tent: {
      1: { desc: 'Start run with +1 shield.', shield: 1 }
    },
    hub_snack_table: {
      1: { desc: 'Start run with +15 gold.', gold: 15 }
    },
    hub_arcade_booth: {
      1: { desc: 'Start run with an extra reward reroll.', reroll: 1 }
    },
    hub_star_lantern_stage: {
      1: { desc: 'Start run with +10 mana.', mana: 10 }
    }
  };

  getRunStartBonuses(meta: MetaState): { startingGold: number; startingShield: number; startingMana: number; items: string[]; rewardRerolls: number } {
    const out = { startingGold: 0, startingShield: 0, startingMana: 0, items: [] as string[], rewardRerolls: 0 };
    for (const [buildingId, level] of Object.entries(meta.hubBuildings)) {
      const mapping = HubProgressionSystem.HUB_EFFECTS[buildingId];
      if (!mapping) continue;
      // Apply only the highest level mapping that is <= current level
      const applicableLevels = Object.keys(mapping).map((k) => Number(k)).sort((a, b) => a - b);
      for (const lvl of applicableLevels) {
        if (level >= lvl) {
          const cfg = mapping[lvl];
          if (cfg.gold) out.startingGold += cfg.gold;
          if (cfg.shield) out.startingShield += cfg.shield;
          if (cfg.mana) out.startingMana += cfg.mana;
          if (cfg.items) out.items.push(...cfg.items);
          if (cfg.reroll) out.rewardRerolls += cfg.reroll;
        }
      }
    }
    return out;
  }

  getBuildingEffectDescription(buildingId: string, meta: MetaState): { current: string; next: string } {
    const mapping = HubProgressionSystem.HUB_EFFECTS[buildingId] ?? {};
    const currentLevel = meta.hubBuildings[buildingId] ?? 0;
    const currentCfg = mapping[currentLevel] ?? null;
    const nextCfg = mapping[currentLevel + 1] ?? null;
    return {
      current: currentCfg ? currentCfg.desc : 'No Release 1 effect yet.',
      next: nextCfg ? nextCfg.desc : 'No additional Release 1 effect.'
    };
  }
  listBuildings(): HubBuildingEntry[] {
    return contentRegistry.listEnabled<HubBuildingEntry>('hubBuilding');
  }

  canUpgrade(meta: MetaState, buildingId: string): boolean {
    const building = contentRegistry.getOptionalById<HubBuildingEntry>('hubBuilding', buildingId);
    if (!building) {
      return false;
    }
    return (meta.hubBuildings[buildingId] ?? 0) < building.maxLevel && this.canAfford(meta, buildingId);
  }

  getNextLevel(buildingId: string, meta: MetaState): HubBuildingLevel | null {
    const building = contentRegistry.getOptionalById<HubBuildingEntry>('hubBuilding', buildingId);
    if (!building) {
      return null;
    }
    const current = meta.hubBuildings[buildingId] ?? 0;
    return building.levels.find((level) => level.level === current + 1) ?? null;
  }

  canAfford(meta: MetaState, buildingId: string): boolean {
    const level = this.getNextLevel(buildingId, meta);
    if (!level) {
      return false;
    }
    return Object.entries(level.cost).every(([currencyId, amount]) => this.getCurrency(meta, currencyId) >= amount);
  }

  upgrade(meta: MetaState, buildingId: string): string {
    const building = contentRegistry.getOptionalById<HubBuildingEntry>('hubBuilding', buildingId);
    const level = this.getNextLevel(buildingId, meta);
    if (!building || !level) {
      return 'That booth is already at its current Release 1 limit.';
    }
    if (!this.canAfford(meta, buildingId)) {
      return `${building.name} needs ${this.formatCost(level.cost)}.`;
    }
    for (const [currencyId, amount] of Object.entries(level.cost)) {
      this.spendCurrency(meta, currencyId, amount);
    }
    meta.hubBuildings[buildingId] = level.level;
    this.applyLevelEffect(meta, buildingId, level);
    return `${building.name} upgraded to Lv.${level.level}. Unlocks: ${level.unlocks.join(', ') || 'festival polish'}.`;
  }

  getSummary(meta: MetaState): string {
    const buildings = this.listBuildings();
    if (buildings.length === 0) {
      return 'Hub: festival booths pending setup.';
    }
    return buildings.slice(0, 3).map((building) => `${building.name} Lv.${meta.hubBuildings[building.id] ?? 0}`).join('   ');
  }

  formatCost(cost: Record<string, number>): string {
    return Object.entries(cost).map(([currencyId, amount]) => `${amount} ${currencyId.replace(/^currency_/, '')}`).join(', ');
  }

  private getCurrency(meta: MetaState, currencyId: string): number {
    if (currencyId === 'currency_gold') {
      return meta.totalGoldCollected;
    }
    return 0;
  }

  private spendCurrency(meta: MetaState, currencyId: string, amount: number): void {
    if (currencyId === 'currency_gold') {
      meta.totalGoldCollected = Math.max(0, meta.totalGoldCollected - amount);
    }
  }

  private applyLevelEffect(meta: MetaState, buildingId: string, level: HubBuildingLevel): void {
    if (buildingId === 'hub_cake_stall' && level.level >= 1 && !meta.unlockedHeroes.includes('hero_pippa_pyromancer')) {
      meta.unlockedHeroes.push('hero_pippa_pyromancer');
    }
    if (buildingId === 'hub_arcade_booth' && level.level >= 1 && !meta.discoveredChaosRules.includes('chaos_confetti_fever')) {
      meta.discoveredChaosRules.push('chaos_confetti_fever');
    }
  }
}
