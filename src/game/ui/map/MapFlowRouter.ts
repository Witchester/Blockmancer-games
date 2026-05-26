import Phaser from 'phaser';
import { BlockmancerGame } from '../../BlockmancerGame';
import type { RoomType } from '../../types/GameTypes';
import { MAX_EVENT_LOG } from '../../utils/constants';

function log(game: BlockmancerGame, message: string): void {
  const state = game.runState;
  state.eventLog.unshift(message);
  state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
}

export function enterBattleFromMap(
  scene: Phaser.Scene,
  roomType: RoomType,
  destinationScene = 'BattleScene',
  data?: Record<string, unknown>
): void {
  const game = scene.game as BlockmancerGame;
  const state = game.runState;
  state.activeEnemy = null;
  state.activeEncounterPack = null;
  state.pendingNodeResult = null;
  state.lastBattleWasBoss = roomType === 'boss';
  const randomEvent = game.randomGameplayEventSystem.roll(state, 'battle_start');
  if (randomEvent) {
    log(game, `Random event incoming: ${randomEvent.name}.`);
  }
  const boardSizeMessage = game.boardSizeModifierSystem.applyEncounterBoardSize(state);
  if (boardSizeMessage) {
    log(game, boardSizeMessage);
  }
  const chaosRule = game.chaosRuleSystem.rollForCombat(state);
  if (chaosRule) {
    game.metaSystem.recordChaosRuleDiscovered(chaosRule.id);
    log(game, `Festival Chaos rolled: ${chaosRule.name}.`);
  }
  const objective = game.battleObjectiveSystem.rollForCombat(state);
  if (objective) {
    log(game, `Mini-objective: ${objective.name}.`);
  }
  if (roomType === 'boss') {
    const goalMessage = game.stageGoalSystem.applyBossStartEffect(state);
    if (goalMessage) {
      log(game, goalMessage);
    }
    state.currentBossRule = undefined;
  }
  state.player.emergencyBarrierUsed = false;
  state.currentRoomProgress = 'entered';
  state.runStatus = 'battle';
  log(game, roomType === 'boss' ? 'The boss arena lights up for a big festival showdown.' : 'A fresh batch of festival troublemakers hops in.');
  game.saveRun();
  scene.scene.start(destinationScene, data);
}
