import type { NodeResultSummary, RunState } from '../../types/GameTypes';

export type NodeResultXpRow = {
  label: string;
  value: number;
};

export type NodeResultViewModel = {
  title: string;
  stageLine: string;
  nodeLine: string;
  enemiesLine: string | null;
  xpTotal: number;
  xpRows: NodeResultXpRow[];
  currentLevel: number;
  xpBefore: number;
  xpAfter: number;
  xpMeterMax: number;
  xpRemaining: number;
  levelUpReady: boolean;
};

const XP_ROW_LABELS: Array<[keyof NodeResultSummary['xpBreakdown'], string]> = [
  ['enemyXp', 'Enemies'],
  ['eliteBonusXp', 'Elite bonus'],
  ['bossBonusXp', 'Boss bonus'],
  ['objectiveBonusXp', 'Objective bonus'],
  ['cascadeBonusXp', 'Cascade 3+ bonus'],
  ['noDamageBonusXp', 'No damage bonus'],
  ['routeBonusXp', 'Route bonus']
];

function titleCaseId(id: string): string {
  return id
    .replace(/^stage_/, '')
    .replace(/^node_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildNodeResultViewModel(state: RunState, summary: NodeResultSummary): NodeResultViewModel {
  const currentLevel = Math.max(1, state.playerLevelState?.level ?? state.player.level ?? 1);
  const xpMeterMax = Math.max(1, summary.xpToNextLevel ?? state.playerLevelState?.xpToNextLevel ?? state.player.xpToNextLevel ?? 1);
  const levelUpReady = (state.playerLevelState?.pendingLevelUps ?? 0) > 0 || summary.pendingLevelUps > 0 || summary.leveledUp;
  const xpBefore = Math.max(0, summary.currentXpBeforeGain ?? state.playerLevelState?.currentXp ?? state.player.experience ?? 0);
  const rawAfter = Math.max(0, summary.currentXpAfterGain ?? state.playerLevelState?.currentXp ?? state.player.experience ?? 0);
  const xpAfter = levelUpReady ? xpMeterMax : Math.min(rawAfter, xpMeterMax);
  const xpRemaining = levelUpReady
    ? 0
    : Math.max(0, summary.xpRemainingToNextLevel ?? xpMeterMax - xpAfter);

  const xpRows = XP_ROW_LABELS
    .map(([key, label]) => ({
      label,
      value: Math.max(0, Math.floor(summary.xpBreakdown[key] ?? 0))
    }))
    .filter((row) => row.value > 0);

  return {
    title: 'Node Clear!',
    stageLine: `Stage: ${titleCaseId(summary.stageId)}`,
    nodeLine: `Node: ${titleCaseId(summary.nodeId)} (${titleCaseId(summary.nodeType)})`,
    enemiesLine: Number.isFinite(summary.enemiesDefeated) ? `${summary.enemiesDefeated} enemy${summary.enemiesDefeated === 1 ? '' : 'ies'} defeated` : null,
    xpTotal: Math.max(0, Math.floor(summary.xpGainedTotal)),
    xpRows,
    currentLevel,
    xpBefore: Math.min(xpBefore, xpMeterMax),
    xpAfter,
    xpMeterMax,
    xpRemaining,
    levelUpReady
  };
}
