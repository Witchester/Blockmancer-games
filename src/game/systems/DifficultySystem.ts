import { contentRegistry } from './ContentRegistry';

type DifficultyScalingEntry = {
  id: string;
  name: string;
  stageRules: {
    maxStage: number;
    bossStage: number;
    eliteStageInterval: number;
  };
  enemyScaling: {
    hpPerStage: number;
    attackPerStage: number;
    armorPerStage: number;
  };
  boardScaling: {
    fallSpeedPerStage: number;
    maxFallSpeed: number;
    junkChancePerStage: number;
  };
  rewardScaling: {
    goldPerStage: number;
    rareChancePerStage: number;
  };
  enabled?: boolean;
};

const DEFAULT_SCALING: DifficultyScalingEntry = {
  id: 'scale_default_run',
  name: 'Default Run',
  stageRules: { maxStage: 6, bossStage: 6, eliteStageInterval: 2 },
  enemyScaling: { hpPerStage: 6, attackPerStage: 0.35, armorPerStage: 0 },
  boardScaling: { fallSpeedPerStage: 0.035, maxFallSpeed: 1.85, junkChancePerStage: 0.02 },
  rewardScaling: { goldPerStage: 7, rareChancePerStage: 0.025 }
};

export class DifficultySystem {
  private scaling: DifficultyScalingEntry;

  constructor(scalingId = 'scale_default_run') {
    const entry = contentRegistry.getDifficultyScaling(scalingId) as DifficultyScalingEntry | null;
    this.scaling = entry ?? DEFAULT_SCALING;
  }

  /** Calculate enemy max HP for a given stage */
  getEnemyMaxHp(baseHp: number, stage: number): number {
    const stageIndex = this.getStageIndex(stage);
    return baseHp + stageIndex * this.scaling.enemyScaling.hpPerStage;
  }

  /** Calculate enemy attack for a given stage */
  getEnemyAttack(baseAttack: number, stage: number): number {
    const stageIndex = this.getStageIndex(stage);
    return Number((baseAttack + stageIndex * this.scaling.enemyScaling.attackPerStage).toFixed(1));
  }

  /** Calculate fall speed increase for a given stage */
  getFallSpeedForStage(baseFallSpeed: number, stage: number): number {
    const stageIndex = this.getStageIndex(stage);
    const speed = baseFallSpeed + stageIndex * this.scaling.boardScaling.fallSpeedPerStage;
    return Math.min(speed, this.scaling.boardScaling.maxFallSpeed);
  }

  /** Get max fall speed cap */
  getMaxFallSpeed(): number {
    return this.scaling.boardScaling.maxFallSpeed;
  }

  /** Get bonus gold per stage */
  getGoldBonusForStage(stage: number): number {
    return this.getStageIndex(stage) * this.scaling.rewardScaling.goldPerStage;
  }

  /** Get junk row chance for a given stage (0.0 - 1.0) */
  getJunkChanceForStage(stage: number): number {
    return Math.min(1, this.getStageIndex(stage) * this.scaling.boardScaling.junkChancePerStage);
  }

  /** Get rare reward chance for a given stage (0.0 - 1.0) */
  getRareChanceForStage(stage: number): number {
    return Math.min(1, this.getStageIndex(stage) * this.scaling.rewardScaling.rareChancePerStage);
  }

  /** Check if a stage should be an elite stage */
  isEliteStage(stage: number): boolean {
    return stage > 0 && stage % this.scaling.stageRules.eliteStageInterval === 0;
  }

  /** Check if we've reached the boss stage */
  isBossStage(stage: number): boolean {
    return stage >= this.scaling.stageRules.bossStage;
  }

  /** Get max stage */
  getMaxStage(): number {
    return this.scaling.stageRules.maxStage;
  }

  /** Get the raw scaling config for inspection */
  getScalingConfig(): DifficultyScalingEntry {
    return this.scaling;
  }

  private getStageIndex(stage: number): number {
    return Math.max(0, stage - 1);
  }
}
