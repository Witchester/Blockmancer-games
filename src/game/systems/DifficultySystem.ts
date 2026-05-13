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
  stageRules: { maxStage: 10, bossStage: 10, eliteStageInterval: 3 },
  enemyScaling: { hpPerStage: 8, attackPerStage: 0.5, armorPerStage: 0 },
  boardScaling: { fallSpeedPerStage: 0.05, maxFallSpeed: 2, junkChancePerStage: 0.03 },
  rewardScaling: { goldPerStage: 5, rareChancePerStage: 0.02 }
};

export class DifficultySystem {
  private scaling: DifficultyScalingEntry;

  constructor(scalingId = 'scale_default_run') {
    const entry = contentRegistry.getDifficultyScaling(scalingId) as DifficultyScalingEntry | null;
    this.scaling = entry ?? DEFAULT_SCALING;
  }

  /** Calculate enemy max HP for a given stage */
  getEnemyMaxHp(baseHp: number, stage: number): number {
    return baseHp + stage * this.scaling.enemyScaling.hpPerStage;
  }

  /** Calculate enemy attack for a given stage */
  getEnemyAttack(baseAttack: number, stage: number): number {
    return Number((baseAttack + stage * this.scaling.enemyScaling.attackPerStage).toFixed(1));
  }

  /** Calculate fall speed increase for a given stage */
  getFallSpeedForStage(baseFallSpeed: number, stage: number): number {
    const speed = baseFallSpeed + stage * this.scaling.boardScaling.fallSpeedPerStage;
    return Math.min(speed, this.scaling.boardScaling.maxFallSpeed);
  }

  /** Get max fall speed cap */
  getMaxFallSpeed(): number {
    return this.scaling.boardScaling.maxFallSpeed;
  }

  /** Get bonus gold per stage */
  getGoldBonusForStage(stage: number): number {
    return stage * this.scaling.rewardScaling.goldPerStage;
  }

  /** Get junk row chance for a given stage (0.0 - 1.0) */
  getJunkChanceForStage(stage: number): number {
    return Math.min(1, stage * this.scaling.boardScaling.junkChancePerStage);
  }

  /** Get rare reward chance for a given stage (0.0 - 1.0) */
  getRareChanceForStage(stage: number): number {
    return Math.min(1, stage * this.scaling.rewardScaling.rareChancePerStage);
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
}
