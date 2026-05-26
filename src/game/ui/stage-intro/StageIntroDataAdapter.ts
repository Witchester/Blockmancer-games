import type { RunState } from '../../types/GameTypes';
import type { StageEntry } from '../../systems/StageSystem';
import type { StageGoalEntry } from '../../systems/StageGoalSystem';
import type { StoryBeat } from '../../systems/StorySystem';

export type StageIntroViewModel = {
  stageId: string;
  title: string;
  subtitle: string;
  flavor: string;
  goalTitle: string;
  goalDescription: string;
  goalProgress: string;
  modifiers: string[];
  backgroundAssetKey: string;
  goalIconAssetKey: string;
};

export function buildStageIntroViewModel(
  state: RunState,
  stage: StageEntry | null,
  goal: StageGoalEntry | null,
  beat: StoryBeat | null
): StageIntroViewModel {
  const stageId = stage?.id ?? `stage_${state.stage}`;
  const theme = stage?.theme ?? 'sprinkle_sewers';
  const progress = goal ? state.stageGoals[goal.id] : null;
  const modifiers = [
    goal?.bossDebuff ? `Success helps boss fight: ${goal.bossDebuff.replace(/_/g, ' ')}` : null,
    goal?.bossBuffOnFail ? `Missed goal warning: ${goal.bossBuffOnFail.replace(/_/g, ' ')}` : null
  ].filter((entry): entry is string => Boolean(entry));

  return {
    stageId,
    title: stage?.name ?? beat?.title ?? 'Festival Stage',
    subtitle: `Stage ${state.stage}`,
    flavor: beat?.lines.join('\n') ?? stage?.description ?? 'A cheerful stage opens ahead.',
    goalTitle: goal?.name ?? 'Stage Goal',
    goalDescription: goal?.description ?? 'Clear the path and keep the festival moving.',
    goalProgress: progress ? `${progress.progress}/${progress.requiredAmount}${progress.completed ? ' complete' : ''}` : 'Ready',
    modifiers,
    backgroundAssetKey: `bg_stage_${theme}_intro`,
    goalIconAssetKey: goal ? `ico_stage_goal_${goal.id.replace(/^goal_stage\d+_/, '')}` : 'placeholder_icon'
  };
}
