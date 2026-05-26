import type { DialogueLine, RouteChoiceContent, RouteSceneContent, RunState } from '../../types/GameTypes';
import type { DialogueSystem } from '../../systems/DialogueSystem';

export type RouteChoiceCardViewModel = {
  id: string;
  label: string;
  lane: RouteChoiceContent['lane'];
  laneLabel: string;
  playerLine: string;
  gameplayResult: string;
  selected: boolean;
  disabled: boolean;
  assetKey: string;
  routeStateText: string;
};

export type RouteDialogueLineViewModel = {
  speakerId: string;
  speakerName: string;
  text: string;
  portraitAssetKey: string;
};

export type RouteDialogueViewModel = {
  title: string;
  locationName: string;
  storyBeat: string;
  backgroundAssetKey: string;
  activeSpeakerName: string;
  activePortraitAssetKey: string;
  lines: RouteDialogueLineViewModel[];
};

const CHOICE_ASSET_BY_LANE: Record<RouteChoiceContent['lane'], string> = {
  practical: 'ui_choice_card_practical',
  true: 'ui_choice_card_true',
  risky: 'ui_choice_card_risky'
};

function laneLabel(lane: RouteChoiceContent['lane']): string {
  if (lane === 'true') return 'True';
  if (lane === 'risky') return 'Risky';
  return 'Practical';
}

function portraitKeyForSpeaker(speakerId: string, fallbackHeroId: string): string {
  const id = speakerId === 'narrator' ? fallbackHeroId : speakerId;
  if (id.startsWith('hero_')) return `portrait_${id}`;
  if (id.startsWith('npc_')) return `portrait_${id}`;
  return 'placeholder_portrait';
}

export function buildRouteDialogueViewModel(
  routeScene: RouteSceneContent,
  lines: DialogueLine[],
  state: RunState,
  dialogueSystem: DialogueSystem
): RouteDialogueViewModel {
  const activeLine = lines[0] ?? routeScene.preChoiceDialogue[0] ?? { speakerId: state.hero.id, text: '' };
  const speakerName = dialogueSystem.getSpeakerName(activeLine.speakerId) || routeScene.locationName;
  return {
    title: routeScene.title,
    locationName: routeScene.locationName,
    storyBeat: routeScene.storyBeat,
    backgroundAssetKey: `bg_route_${state.hero.id}_${routeScene.stageId}`,
    activeSpeakerName: speakerName,
    activePortraitAssetKey: portraitKeyForSpeaker(activeLine.speakerId, state.hero.id),
    lines: lines.map((line) => ({
      speakerId: line.speakerId,
      speakerName: dialogueSystem.getSpeakerName(line.speakerId),
      text: line.text,
      portraitAssetKey: portraitKeyForSpeaker(line.speakerId, state.hero.id)
    }))
  };
}

export function buildRouteChoiceCards(routeScene: RouteSceneContent, state: RunState): RouteChoiceCardViewModel[] {
  const progress = state.routeProgress.heroes[routeScene.heroId];
  const chosenLane = progress?.chosenScenes?.[routeScene.id];
  return routeScene.choices.map((choice) => {
    const selected = chosenLane === choice.lane;
    const disabled = Boolean(chosenLane && !selected);
    const score = choice.lane === 'true'
      ? progress?.trueScore ?? 0
      : choice.lane === 'risky'
        ? progress?.riskyScore ?? 0
        : progress?.practicalScore ?? 0;
    return {
      id: choice.id,
      label: choice.label,
      lane: choice.lane,
      laneLabel: laneLabel(choice.lane),
      playerLine: choice.playerLine,
      gameplayResult: choice.gameplayResult,
      selected,
      disabled,
      assetKey: CHOICE_ASSET_BY_LANE[choice.lane],
      routeStateText: selected ? 'Selected' : `${laneLabel(choice.lane)} score ${score}`
    };
  });
}

