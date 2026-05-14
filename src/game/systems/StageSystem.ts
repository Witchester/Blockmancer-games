import { contentRegistry } from './ContentRegistry';

export type StageEntry = {
  id: string;
  name: string;
  description: string;
  theme: string;
  monsterPool: string[];
  bossId: string;
  lootTableId: string;
  enabled?: boolean;
};

const RELEASE_STAGE_ORDER = [
  'stage_sprinkle_sewers',
  'stage_goblin_workshop',
  'stage_frosty_pantry',
  'stage_pillow_castle',
  'stage_starfall_arcade',
  'stage_bloxley_block_palace'
];

export class StageSystem {
  listStages(): StageEntry[] {
    const stages = contentRegistry.listEnabled<StageEntry>('stage');
    return [...stages].sort((left, right) => this.getStageOrder(left.id) - this.getStageOrder(right.id));
  }

  getStageByIndex(index: number): StageEntry | null {
    const stages = this.listStages();
    return stages[Math.max(0, Math.min(stages.length - 1, index - 1))] ?? stages[0] ?? null;
  }

  getStageCount(): number {
    return this.listStages().length || RELEASE_STAGE_ORDER.length;
  }

  isFinalStage(index: number): boolean {
    return index >= this.getStageCount();
  }

  private getStageOrder(stageId: string): number {
    const orderedIndex = RELEASE_STAGE_ORDER.indexOf(stageId);
    return orderedIndex === -1 ? RELEASE_STAGE_ORDER.length : orderedIndex;
  }
}
