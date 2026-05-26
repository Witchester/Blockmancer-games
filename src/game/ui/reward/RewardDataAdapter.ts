import type { RewardDefinition, RunState } from '../../types/GameTypes';

export type RewardCardViewModel = {
  id: string;
  name: string;
  typeLabel: string;
  description: string;
  rarity: string;
  amountLabel: string | null;
  cardAssetKey: string;
};

export type RewardViewModel = {
  title: string;
  banner: string;
  stageLine: string;
  nodeLine: string;
  sourceLine: string;
  rewardSummary: string;
  goldLine: string | null;
  hasChoices: boolean;
  emptyMessage: string;
  cards: RewardCardViewModel[];
};

function titleCaseId(id: string): string {
  return id
    .replace(/^stage_/, '')
    .replace(/^node_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function rewardAmountLabel(reward: RewardDefinition): string | null {
  if (reward.type === 'Gold') {
    return `+${Math.max(0, Math.floor(reward.amount ?? 0))} gold`;
  }
  if (reward.type === 'Heal') {
    return `+${Math.max(0, Math.floor(reward.amount ?? 0))} HP`;
  }
  return null;
}

function rewardCardAssetKey(reward: RewardDefinition): string {
  const rarity = reward.rarity?.toLowerCase();
  if (rarity === 'epic' || rarity === 'legendary') {
    return 'ui_reward_card_epic';
  }
  if (rarity === 'rare' || rarity === 'uncommon') {
    return 'ui_reward_card_rare';
  }
  return 'ui_reward_card_common';
}

function summarizeTypes(rewards: RewardDefinition[]): string {
  const counts = rewards.reduce<Record<string, number>>((acc, reward) => {
    const key = reward.type || 'Reward';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([type, count]) => `${count} ${type}${count === 1 ? '' : 's'}`)
    .join('  |  ');
}

export function buildRewardViewModel(state: RunState): RewardViewModel {
  const rewards = state.pendingRewards;
  const goldTotal = rewards
    .filter((reward) => reward.type === 'Gold')
    .reduce((total, reward) => total + Math.max(0, Math.floor(reward.amount ?? 0)), 0);
  const source = state.pendingRewardSource || state.currentRoomType || 'node';

  return {
    title: 'Festival Rewards',
    banner: rewards.length > 1 ? 'Choose one reward card' : rewards.length === 1 ? 'Claim your reward' : 'No rewards pending',
    stageLine: `Stage: ${state.stage}`,
    nodeLine: `Node: ${titleCaseId(state.currentNodeId)} (${titleCaseId(state.currentRoomType)})`,
    sourceLine: `Source: ${titleCaseId(source)}`,
    rewardSummary: rewards.length > 0 ? summarizeTypes(rewards) : 'No node rewards are waiting.',
    goldLine: goldTotal > 0 ? `Gold available: +${goldTotal}` : null,
    hasChoices: rewards.length > 1,
    emptyMessage: 'The reward table is clear. Continue back to the map.',
    cards: rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      typeLabel: reward.type,
      description: reward.description,
      rarity: reward.rarity ?? 'common',
      amountLabel: rewardAmountLabel(reward),
      cardAssetKey: rewardCardAssetKey(reward)
    }))
  };
}
