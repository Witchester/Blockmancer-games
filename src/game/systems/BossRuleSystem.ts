import { contentRegistry } from './ContentRegistry';

export type BossRuleCardEntry = {
  id: string;
  bossId: string;
  name: string;
  title: string;
  description: string;
  phaseRules: Array<{
    phase: number;
    effect: string;
    playerTip?: string;
  }>;
  enabled?: boolean;
};

export class BossRuleSystem {
  getForBoss(bossId: string): BossRuleCardEntry | null {
    return contentRegistry.listEnabled<BossRuleCardEntry>('bossRule').find((card) => card.bossId === bossId) ?? null;
  }
}
