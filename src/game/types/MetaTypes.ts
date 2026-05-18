import type { GameSettings } from './SettingsTypes';

export interface MetaState {
  saveVersion: number;
  unlockedHeroes: string[];
  totalGoldCollected: number;
  totalCascades: number;
  bossesDefeated: string[];
  endingsUnlocked: string[];
  routeEndingsUnlocked: string[];
  routeVariantEndingsUnlocked: string[];
  hubBuildings: Record<string, number>;
  monsterFriendship: Record<string, number>;
  completedStageGoals: string[];
  discoveredChaosRules: string[];
  discoveredBossRules: string[];
  stage1BossDefeated: boolean;
  stage2BossDefeated: boolean;
  normalEndingFinished: boolean;
  totalCascadeCombos: number;
  slimesBefriended: number;
  roomsClearedWithoutDamage: number;
  tutorialCompleted: boolean;
  tutorialLessonIndex: number;
  settings: GameSettings;
}
