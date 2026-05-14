import { contentRegistry } from './ContentRegistry';

export class StageSystem {
  listStages() {
    return contentRegistry.listEnabled('stage');
  }

  getStageByIndex(index: number) {
    const stages = this.listStages();
    return stages[Math.max(0, Math.min(stages.length - 1, index - 1))] ?? stages[0] ?? null;
  }
}
