import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { NodeResultSummary, RunState } from '../../types/GameTypes';
import { completePostNodeFlow, hasPendingRewardScreen } from '../reward/RewardFlowRouter';

function applyPostNodeHealing(game: BlockmancerGame, state: RunState, summary: NodeResultSummary): void {
  const claim = game.encounterPackSystem.getOrCreateNodeResultClaim(state, summary);
  const healStacks = Math.max(0, state.playerLevelState.chosenUpgrades['upg_lvl_heal_after_node'] ?? 0);
  if (healStacks <= 0 || claim.postNodeHealingApplied) {
    return;
  }

  const healAmount = Math.max(1, Math.floor(state.player.maxHp * (0.03 * healStacks)));
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
  state.eventLog.unshift(`Festival Rest heals ${healAmount} HP.`);
  claim.postNodeHealingApplied = true;
}

export function resolveNodeResultNextScene(game: BlockmancerGame, state: RunState): 'LevelUpRewardScene' | 'RewardScene' | 'MapScene' {
  if (game.levelUpSystem.hasPendingLevelUp(state)) {
    return 'LevelUpRewardScene';
  }
  if (hasPendingRewardScreen(state)) {
    return 'RewardScene';
  }
  return 'MapScene';
}

export function continueFromNodeResult(scene: Phaser.Scene, summary: NodeResultSummary | null | undefined): void {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;

  if (summary) {
    game.encounterPackSystem.markNodeResultShown(state, summary);
    applyPostNodeHealing(game, state, summary);
  }

  state.pendingNodeResult = null;
  state.activeEnemy = null;

  const nextScene = resolveNodeResultNextScene(game, state);
  if (nextScene === 'LevelUpRewardScene') {
    state.levelUpScreenState.levelUpScreenResolved = false;
  }

  if (nextScene !== 'LevelUpRewardScene') {
    state.activeEncounterPack = null;
  }

  if (nextScene === 'MapScene') {
    completePostNodeFlow(scene);
    return;
  }

  game.saveRun();
  scene.scene.start(nextScene);
}
