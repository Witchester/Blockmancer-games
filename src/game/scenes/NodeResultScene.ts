import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';
import type { NodeResultSummary } from '../types/GameTypes';

type XpRow = {
  label: string;
  value: number;
};

export class NodeResultScene extends Phaser.Scene {
  private summary!: NodeResultSummary;

  constructor() {
    super('NodeResultScene');
  }

  init(data: { summary?: NodeResultSummary }): void {
    const game = this.game as BlockmancerGame;
    this.summary = data.summary ?? game.runState.pendingNodeResult ?? null!;
  }

  create(): void {
    if (!this.summary) {
      this.scene.start('RewardScene');
      return;
    }

    const layout = getPortraitLayout(this);
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const panelWidth = Math.min(layout.contentWidth, 620);
    const panelHeight = Math.min(layout.height - 84, 820);
    const panelTop = layout.centerY - panelHeight / 2;

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x050814, 0.82);

    game.assetSystem.createImageByAssetKey(this, 'ui_panel_node_result', 'uiIcon', layout.centerX, layout.centerY, { kind: 'ui', alpha: 0.95 })
      .setDisplaySize(panelWidth, panelHeight);
    this.add.rectangle(layout.centerX, layout.centerY, panelWidth, panelHeight, COLORS.panel, 0.92).setStrokeStyle(3, COLORS.gold, 0.4);

    game.assetSystem.createImageByAssetKey(this, 'ui_node_clear_banner', 'uiIcon', layout.centerX, panelTop + 54, { kind: 'ui', alpha: 0.95 })
      .setDisplaySize(Math.min(280, panelWidth - 48), 46);

    this.add.text(layout.centerX, panelTop + 50, 'Node Clear!', {
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffca6b',
      stroke: '#090b13',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(layout.centerX, panelTop + 92, 'Festival trouble cleaned up!', {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#d8deff'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, panelTop + 134, `${this.summary.enemiesDefeated} enemy${this.summary.enemiesDefeated === 1 ? '' : 'ies'} defeated`, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#98a0c7'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, panelTop + 182, 'EXP gained this node', {
      fontFamily: FONT_FAMILY,
      fontSize: '20px',
      color: '#98a0c7'
    }).setOrigin(0.5);

    const xpValueText = this.add.text(layout.centerX, panelTop + 222, '0 EXP', {
      fontFamily: FONT_FAMILY,
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#65d6a5',
      stroke: '#090b13',
      strokeThickness: 4
    }).setOrigin(0.5);

    const xpMeterY = panelTop + 276;
    if (typeof this.summary.currentXpBeforeGain === 'number' && typeof this.summary.currentXpAfterGain === 'number' && typeof this.summary.xpToNextLevel === 'number') {
      this.add.text(layout.centerX - panelWidth / 2 + 34, xpMeterY - 18, `Level ${state.playerLevelState.level}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '17px',
        color: '#f6f7ff'
      }).setOrigin(0, 0.5);

      this.add.rectangle(layout.centerX, xpMeterY, panelWidth - 68, 18, 0x1b2342, 1).setStrokeStyle(2, COLORS.accentSoft, 0.45);
      const fillMaxWidth = panelWidth - 76;
      const beforeRatio = this.summary.xpToNextLevel > 0 ? Phaser.Math.Clamp(this.summary.currentXpBeforeGain / this.summary.xpToNextLevel, 0, 1) : 0;
      const afterRatio = this.summary.xpToNextLevel > 0 ? Phaser.Math.Clamp(this.summary.currentXpAfterGain / this.summary.xpToNextLevel, 0, 1) : beforeRatio;
      const meterFill = this.add.rectangle(layout.centerX - fillMaxWidth / 2, xpMeterY, Math.max(8, fillMaxWidth * beforeRatio), 10, COLORS.success, 1).setOrigin(0, 0.5);
      this.tweens.add({
        targets: meterFill,
        width: Math.max(8, fillMaxWidth * afterRatio),
        duration: 520,
        ease: 'Quad.easeOut'
      });

      if (typeof this.summary.xpRemainingToNextLevel === 'number') {
        this.add.text(layout.centerX, xpMeterY + 26, `Remaining to next level: ${this.summary.xpRemainingToNextLevel} EXP`, {
          fontFamily: FONT_FAMILY,
          fontSize: '16px',
          color: '#d8deff'
        }).setOrigin(0.5);
      }
    } else {
      this.add.text(layout.centerX, xpMeterY, 'EXP meter will light up once level tracking is fully wired.', {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#d8deff',
        align: 'center',
        wordWrap: { width: panelWidth - 80 }
      }).setOrigin(0.5);
    }

    const rows: XpRow[] = [
      { label: 'Enemies', value: this.summary.xpBreakdown.enemyXp },
      { label: 'Elite bonus', value: this.summary.xpBreakdown.eliteBonusXp },
      { label: 'Boss bonus', value: this.summary.xpBreakdown.bossBonusXp },
      { label: 'Objective bonus', value: this.summary.xpBreakdown.objectiveBonusXp },
      { label: 'Cascade 3+ bonus', value: this.summary.xpBreakdown.cascadeBonusXp },
      { label: 'No damage bonus', value: this.summary.xpBreakdown.noDamageBonusXp },
      { label: 'Route bonus', value: this.summary.xpBreakdown.routeBonusXp }
    ].filter((row) => row.value > 0);

    const rowsStartY = panelTop + 332;
    rows.forEach((row, index) => {
      const y = rowsStartY + index * 34;
      this.add.rectangle(layout.centerX, y, panelWidth - 68, 28, COLORS.panelAlt, 0.88).setStrokeStyle(1, COLORS.accent, 0.22);
      this.add.text(layout.centerX - panelWidth / 2 + 34, y, row.label, {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#d8deff'
      }).setOrigin(0, 0.5);
      this.add.text(layout.centerX + panelWidth / 2 - 34, y, `+${row.value}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#f6f7ff'
      }).setOrigin(1, 0.5);
    });

    const badgeY = rowsStartY + Math.max(1, rows.length) * 34 + 34;
    if (this.summary.pendingLevelUps > 0) {
      game.assetSystem.createImageByAssetKey(this, 'ui_level_ready_badge', 'uiIcon', layout.centerX, badgeY, { kind: 'ui', alpha: 0.96 })
        .setDisplaySize(Math.min(220, panelWidth - 120), 42);
      const badge = this.add.text(layout.centerX, badgeY, 'Level Up Ready!', {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#b84657',
        strokeThickness: 4
      }).setOrigin(0.5);
      this.tweens.add({
        targets: badge,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 520,
        yoyo: true,
        repeat: -1
      });
    }

    new Button(this, layout.centerX, panelTop + panelHeight - 56, Math.min(230, panelWidth - 80), 56, 'Continue', () => {
      this.handleContinue();
    });

    this.tweens.addCounter({
      from: 0,
      to: this.summary.xpGainedTotal,
      duration: 440,
      ease: 'Quad.easeOut',
      onUpdate: (tween) => {
        xpValueText.setText(`${Math.round(tween.getValue() ?? 0)} EXP`);
      }
    });
  }

  private handleContinue(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const summary = state.pendingNodeResult ?? this.summary;

    if (!summary) {
      this.scene.start('MapScene');
      return;
    }

    game.encounterPackSystem.markNodeResultShown(state, summary);
    const claim = game.encounterPackSystem.getOrCreateNodeResultClaim(state, summary);
    state.pendingNodeResult = null;
    state.activeEnemy = null;
    const healStacks = Math.max(0, state.playerLevelState.chosenUpgrades['upg_lvl_heal_after_node'] ?? 0);
    if (healStacks > 0 && !claim.postNodeHealingApplied) {
      const healAmount = Math.max(1, Math.floor(state.player.maxHp * (0.03 * healStacks)));
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
      state.eventLog.unshift(`Festival Rest heals ${healAmount} HP.`);
      claim.postNodeHealingApplied = true;
    }

    if (state.lastBattleWasBoss && game.stageSystem.isFinalStage(state.stage)) {
      this.finishFinalBossVictory();
      return;
    }

    game.saveRun();

    const stageId = game.stageSystem.getStageByIndex(state.stage)?.id ?? 'stage_sprinkle_sewers';
    let routeScene = null;
    if (!state.activeEncounterPack?.routeFallbackTriggeredForEncounterPack) {
      routeScene = game.routeStorySystem.shouldTriggerRouteScene(
        state,
        state.hero.id,
        stageId,
        'after_first_combat_victory'
      );
    }
    if (routeScene) {
      if (state.activeEncounterPack) {
        state.activeEncounterPack.routeFallbackTriggeredForEncounterPack = true;
      }
      this.scene.start('RouteDialogueScene', {
        sceneId: routeScene.id,
        returnScene: 'RewardScene'
      });
      return;
    }

    if (game.levelUpSystem.hasPendingLevelUp(state)) {
      state.levelUpScreenState.levelUpScreenResolved = false;
      this.scene.start('LevelUpRewardScene');
      return;
    }

    state.activeEncounterPack = null;
    if (state.pendingRewards.length > 0 || state.pendingStageAdvance) {
      this.scene.start('RewardScene');
      return;
    }

    game.mapSystem.completeNode(state, state.currentNodeId);
    state.runStatus = 'map';
    game.saveRun();
    this.scene.start('MapScene');
  }

  private finishFinalBossVictory(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;

    game.mapSystem.advanceAfterBoss(state, game.stageSystem);
    state.victory = true;

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
    game.audioSystem.play('victory', this);
    game.clearSave();
    this.scene.start('VictoryScene', {
      endingKind,
      heroUnlocks,
      routeEndingId: routeEnding.ending.id,
      routeVariantEndingId: routeEnding.variant?.id
    });
  }
}
