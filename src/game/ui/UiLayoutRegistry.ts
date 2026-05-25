import type { UiLayoutSpec } from '../types/ui-layout';
import { validateUiLayoutSpec } from './UiLayoutValidator';

export const UI_LAYOUT_SCREEN_IDS = [
  'screen_splash',
  'screen_main_menu',
  'screen_hero_select',
  'screen_map',
  'screen_stage_intro',
  'screen_battle',
  'screen_boss_rule_card',
  'screen_route_dialogue',
  'screen_event_room',
  'screen_shop',
  'screen_inventory_modal',
  'screen_node_result',
  'screen_level_up',
  'screen_reward',
  'screen_victory_ending',
  'screen_defeat_summary',
  'screen_settings'
] as const;

export type UiLayoutScreenId = (typeof UI_LAYOUT_SCREEN_IDS)[number];

export type UiLayoutRegistryEntry = {
  screenId: UiLayoutScreenId;
  specPath: string;
  relatedSceneFile: string;
  runtimeLoadStatus: 'metadataOnly';
};

export const UI_LAYOUT_REGISTRY: Record<UiLayoutScreenId, UiLayoutRegistryEntry> = Object.fromEntries(
  UI_LAYOUT_SCREEN_IDS.map((screenId) => [
    screenId,
    {
      screenId,
      specPath: `docs/ui/layouts/${screenId}.layout.json`,
      relatedSceneFile: relatedSceneFileFor(screenId),
      runtimeLoadStatus: 'metadataOnly'
    }
  ])
) as Record<UiLayoutScreenId, UiLayoutRegistryEntry>;

function relatedSceneFileFor(screenId: UiLayoutScreenId): string {
  const map: Record<UiLayoutScreenId, string> = {
    screen_splash: 'src/game/scenes/BootScene.ts',
    screen_main_menu: 'src/game/scenes/MainMenuScene.ts',
    screen_hero_select: 'src/game/scenes/HeroSelectScene.ts',
    screen_map: 'src/game/scenes/MapScene.ts',
    screen_stage_intro: 'src/game/scenes/StoryScene.ts',
    screen_battle: 'src/game/scenes/BattleScene.ts',
    screen_boss_rule_card: 'src/game/scenes/BattleScene.ts',
    screen_route_dialogue: 'src/game/scenes/RouteDialogueScene.ts',
    screen_event_room: 'src/game/scenes/EventScene.ts',
    screen_shop: 'src/game/scenes/ShopScene.ts',
    screen_inventory_modal: 'src/game/scenes/BattleScene.ts',
    screen_node_result: 'src/game/scenes/NodeResultScene.ts',
    screen_level_up: 'src/game/scenes/LevelUpRewardScene.ts',
    screen_reward: 'src/game/scenes/RewardScene.ts',
    screen_victory_ending: 'src/game/scenes/VictoryScene.ts',
    screen_defeat_summary: 'src/game/scenes/GameOverScene.ts',
    screen_settings: 'src/game/scenes/SettingsScene.ts'
  };
  return map[screenId];
}

export function isUiLayoutScreenId(screenId: string): screenId is UiLayoutScreenId {
  return UI_LAYOUT_SCREEN_IDS.includes(screenId as UiLayoutScreenId);
}

export function getUiLayoutRegistryEntry(screenId: UiLayoutScreenId): UiLayoutRegistryEntry {
  return UI_LAYOUT_REGISTRY[screenId];
}

export function listUiLayoutRegistryEntries(): UiLayoutRegistryEntry[] {
  return UI_LAYOUT_SCREEN_IDS.map((screenId) => UI_LAYOUT_REGISTRY[screenId]);
}

export function validateLoadedUiLayoutSpec(spec: UiLayoutSpec): ReturnType<typeof validateUiLayoutSpec> {
  return validateUiLayoutSpec(spec);
}

export async function loadLayoutSpec(screenId: UiLayoutScreenId): Promise<UiLayoutSpec> {
  const entry = getUiLayoutRegistryEntry(screenId);
  throw new Error(
    `UI layout JSON loading is not wired at runtime yet for ${entry.screenId}. ` +
      `Spec metadata is registered at ${entry.specPath}; UI-2/UI-4 should choose a safe bundling or public delivery strategy.`
  );
}
