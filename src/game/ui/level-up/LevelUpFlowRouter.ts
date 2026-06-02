import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { RunState, UpgradeCategory } from '../../types/GameTypes';
import type { LevelUpUpgradeContent } from './LevelUpDataAdapter';
import { completePostNodeFlow, hasPendingRewardScreen } from '../reward/RewardFlowRouter';
import { upgradeCardEffectHandler } from '../../systems/UpgradeCardEffectHandler';
import { contentRegistry } from '../../systems/ContentRegistry';

export type LevelUpNextScene = 'LevelUpRewardScene' | 'RewardScene' | 'MapScene' | 'LegendaryEvolutionScene';

export function resolveLevelUpNextScene(game: BlockmancerGame, state: RunState): LevelUpNextScene {
  if (game.levelUpSystem.hasPendingLegendaryEvolution(state)) {
    return 'LegendaryEvolutionScene';
  }
  if (game.levelUpSystem.hasPendingLevelUp(state)) {
    return 'LevelUpRewardScene';
  }
  if (hasPendingRewardScreen(state)) {
    return 'RewardScene';
  }
  return 'MapScene';
}

export function resetLevelUpOffer(state: RunState, resolved: boolean): void {
  state.levelUpScreenState.offeredUpgradeIds = [];
  state.levelUpScreenState.pendingLevelUpChoices = [];
  state.levelUpScreenState.levelUpSelectionSeed = '';
  state.levelUpScreenState.levelUpScreenResolved = resolved;
  state.levelUpScreenState.selectedCategory = null;
}

export function selectLevelUpCategory(state: RunState, category: UpgradeCategory): void {
  state.levelUpScreenState.selectedCategory = category;
  state.levelUpScreenState.offeredUpgradeIds = [];
  state.levelUpScreenState.pendingLevelUpChoices = [];
}

export function applyLevelUpSelection(
  game: BlockmancerGame,
  state: RunState,
  card: LevelUpUpgradeContent
): string {
  game.levelUpSystem.applyChosenUpgrade(state, card);
  game.levelUpSystem.consumePendingLevelUp(state);
  state.levelUpScreenState.chosenUpgradeIds.push(card.id);

  const category = state.levelUpScreenState.selectedCategory;
  if (category) {
    if (game.levelUpSystem.isCardAlreadyOwned(state, card.id)) {
      game.levelUpSystem.levelUpOwnedCard(state, card.id);
    } else {
      game.levelUpSystem.claimSlotForCategory(state, category, card.id);
    }
  }

  const cardLevel = game.levelUpSystem.getCardLevel(state, card.id);
  const upgradeCard = contentRegistry.getOptionalById('upgradeCard', card.id) as Record<string, unknown> | null;
  let message: string;

  if (upgradeCard && Array.isArray(upgradeCard.levels) && cardLevel >= 1 && cardLevel <= 5) {
    const levelData = upgradeCard.levels[cardLevel - 1] as { effectType?: string; effectConfig?: Record<string, unknown> } | undefined;
    if (levelData?.effectType) {
      message = upgradeCardEffectHandler.applyCardEffect(state, card.id, levelData.effectType, levelData.effectConfig ?? {}, cardLevel);
    } else {
      message = game.upgradeSystem.applyLevelUpUpgrade(state, card.id);
    }
  } else {
    message = game.upgradeSystem.applyLevelUpUpgrade(state, card.id);
  }

  if (cardLevel >= 5 && game.levelUpSystem.isCardReadyToEvolve(state, card.id)) {
    state.levelUpScreenState.pendingLegendaryEvolution = { cardId: card.id };
  }

  resetLevelUpOffer(state, !game.levelUpSystem.hasPendingLevelUp(state));
  return message;
}

export function continueFromLevelUp(scene: Phaser.Scene): void {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;
  const nextScene = resolveLevelUpNextScene(game, state);

  if (nextScene === 'LegendaryEvolutionScene') {
    game.saveRun();
    scene.scene.start(nextScene);
    return;
  }

  if (nextScene === 'LevelUpRewardScene') {
    state.levelUpScreenState.levelUpScreenResolved = false;
    game.saveRun();
    scene.scene.restart();
    return;
  }

  state.levelUpScreenState.levelUpScreenResolved = true;
  if (nextScene === 'MapScene') {
    // completePostNodeFlow handles the direct map route, including game.mapSystem.completeNode for non-boss nodes.
    completePostNodeFlow(scene);
    return;
  }

  game.saveRun();
  scene.scene.start(nextScene);
}

export function rerollLevelUpChoices(game: BlockmancerGame, state: RunState): boolean {
  if (state.playerLevelState.rerollCharges <= 0) {
    return false;
  }
  state.playerLevelState.rerollCharges -= 1;
  resetLevelUpOffer(state, false);
  game.saveRun();
  return true;
}
