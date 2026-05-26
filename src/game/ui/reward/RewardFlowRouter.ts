import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { RewardId, RunState } from '../../types/GameTypes';
import { MAX_EVENT_LOG, MAX_FALL_SPEED, POST_BATTLE_FALL_SPEED_STEP } from '../../utils/constants';

export function hasPendingRewardScreen(state: RunState): boolean {
  return state.pendingRewards.length > 0;
}

export function completePostNodeFlow(scene: Phaser.Scene): void {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;
  const advancingStage = state.pendingStageAdvance;

  if (state.pendingStageAdvance) {
    const result = game.mapSystem.advanceAfterBoss(state, game.stageSystem);
    if (result === 'final-victory') {
      finishVictory(scene);
      return;
    }
  } else {
    game.mapSystem.completeNode(state, state.currentNodeId);
  }

  state.activeEnemy = null;
  state.activeEncounterPack = null;
  state.combo = 0;
  state.fallSpeed = Math.min(MAX_FALL_SPEED, state.fallSpeed + POST_BATTLE_FALL_SPEED_STEP);
  state.currentRoomProgress = advancingStage ? 'idle' : 'cleared';
  state.runStatus = 'map';
  state.levelUpScreenState.levelUpScreenResolved = true;
  state.levelUpScreenState.offeredUpgradeIds = [];
  state.levelUpScreenState.pendingLevelUpChoices = [];
  game.rewardSystem.applyPostBattleEffects(state).forEach((effectMessage) => {
    state.eventLog.unshift(effectMessage);
  });
  state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  game.saveRun();
  scene.scene.start('MapScene');
}

export function claimPendingReward(scene: Phaser.Scene, rewardId: RewardId): boolean {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;
  const reward = state.pendingRewards.find((entry) => entry.id === rewardId);
  if (!reward) {
    state.eventLog.unshift('The reward table is already clear.');
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
    game.saveRun();
    return false;
  }

  const message = game.rewardSystem.applyReward(state, rewardId);
  state.eventLog.unshift(message);
  state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  state.pendingRewards = [];
  game.audioSystem.play('reward_pick', scene);
  completePostNodeFlow(scene);
  return true;
}

function finishVictory(scene: Phaser.Scene): void {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;
  state.victory = true;
  state.runStatus = 'victory';

  const routeEnding = game.routeStorySystem.resolveHeroEnding(state.hero.id, state.routeProgress);
  const endingKind = routeEnding.endingKind;
  const heroRouteProgress = state.routeProgress.heroes[state.hero.id];
  if (heroRouteProgress) {
    game.routeStorySystem.recordEndingUnlock(heroRouteProgress, routeEnding.ending, routeEnding.variant);
  }

  const beforeUnlocks = [...game.metaSystem.state.unlockedHeroes];
  game.metaSystem.recordRunEnd(state, true);
  if (endingKind === 'true') {
    game.metaSystem.unlockTrueEnding();
  }
  game.metaSystem.unlockRouteEnding(routeEnding.ending.id);
  if (routeEnding.variant) {
    game.metaSystem.unlockRouteVariantEnding(routeEnding.variant.id);
  }

  const heroUnlocks = game.storySystem.getHeroUnlockMessages(beforeUnlocks, game.metaSystem.state.unlockedHeroes);
  game.audioSystem.play('victory', scene);
  game.clearSave();
  scene.scene.start('VictoryScene', {
    endingKind,
    heroUnlocks,
    routeEndingId: routeEnding.ending.id,
    routeVariantEndingId: routeEnding.variant?.id
  });
}
