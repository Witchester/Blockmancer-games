import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { RunState } from '../../types/GameTypes';
import type { LevelUpUpgradeContent } from './LevelUpDataAdapter';
import { completePostNodeFlow, hasPendingRewardScreen } from '../reward/RewardFlowRouter';

export type LevelUpNextScene = 'LevelUpRewardScene' | 'RewardScene' | 'MapScene';

export function resolveLevelUpNextScene(game: BlockmancerGame, state: RunState): LevelUpNextScene {
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
  state.levelUpScreenState.levelUpScreenResolved = resolved;
}

export function applyLevelUpSelection(
  game: BlockmancerGame,
  state: RunState,
  card: LevelUpUpgradeContent
): string {
  game.levelUpSystem.applyChosenUpgrade(state, card);
  const message = game.upgradeSystem.applyLevelUpUpgrade(state, card.id);
  game.levelUpSystem.consumePendingLevelUp(state);
  state.levelUpScreenState.chosenUpgradeIds.push(card.id);
  resetLevelUpOffer(state, !game.levelUpSystem.hasPendingLevelUp(state));
  return message;
}

export function continueFromLevelUp(scene: Phaser.Scene): void {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;
  const nextScene = resolveLevelUpNextScene(game, state);

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
