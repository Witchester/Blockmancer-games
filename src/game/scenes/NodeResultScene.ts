import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';
import type { NodeResultSummary } from '../types/GameTypes';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiMeter, UiPanel } from '../ui/components';
import { buildNodeResultViewModel } from '../ui/node-result/NodeResultDataAdapter';
import { continueFromNodeResult } from '../ui/node-result/NodeResultFlowRouter';

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
      continueFromNodeResult(this, null);
      return;
    }

    const layout = getPortraitLayout(this);
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const model = buildNodeResultViewModel(state, this.summary);
    const panelWidth = Math.min(layout.contentWidth, 620);
    const panelHeight = Math.min(layout.height - 84, 820);
    const panelTop = layout.centerY - panelHeight / 2;
    const panelLeft = layout.centerX - panelWidth / 2;

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x050814, 0.82);

    new UiPanel(this, this.uiSpec('node_result_panel', 'panel', 'ui_panel_node_result', 'ui_panel_default', panelLeft, panelTop, panelWidth, panelHeight, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.92,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.4
    });

    new UiPanel(this, this.uiSpec('node_clear_banner', 'panel', 'ui_node_clear_banner', 'ui_panel_default', layout.centerX - Math.min(360, panelWidth - 48) / 2, panelTop + 30, Math.min(360, panelWidth - 48), 54, 'topLeft', 50), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.45,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.35
    });

    this.add.text(layout.centerX, panelTop + 56, model.title, {
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffca6b',
      stroke: '#090b13',
      strokeThickness: 5
    }).setOrigin(0.5);
    const sparkle = game.assetSystem.createImageByAssetKey(this, 'vfx_node_clear_sparkle', 'vfxCombatSmall', layout.centerX + 168, panelTop + 54, { kind: 'sprite', alpha: 0.8 });
    sparkle.setDisplaySize(42, 42);
    this.tweens.add({
      targets: sparkle,
      angle: 360,
      scaleX: 1.18,
      scaleY: 1.18,
      duration: 900,
      repeat: -1,
      yoyo: true
    });

    this.add.text(layout.centerX, panelTop + 100, model.stageLine, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#d8deff'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, panelTop + 126, model.nodeLine, {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#98a0c7'
    }).setOrigin(0.5);

    if (model.enemiesLine) {
      this.add.text(layout.centerX, panelTop + 154, model.enemiesLine, {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#98a0c7'
      }).setOrigin(0.5);
    }

    new UiIconSlot(this, this.uiSpec('xp_gained_counter_icon', 'iconSlot', 'ui_xp_gained_counter', 'asset_missing_icon', layout.centerX - 102, panelTop + 192, 44, 44, 'center', 55));

    this.add.text(layout.centerX, panelTop + 188, 'EXP gained this node', {
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
    this.add.text(layout.centerX - panelWidth / 2 + 34, xpMeterY - 28, `Level ${model.currentLevel}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      color: '#f6f7ff'
    }).setOrigin(0, 0.5);

    const meter = new UiMeter(
      this,
      this.uiSpec('xp_meter_before_after', 'meter', 'ui_meter_xp', 'ui_meter_fallback', layout.centerX - (panelWidth - 68) / 2, xpMeterY - 14, panelWidth - 68, 28, 'topLeft', 70),
      { current: model.xpBefore, max: model.xpMeterMax, fillInset: 5, showValueText: false }
    );
    this.tweens.addCounter({
      from: model.xpBefore,
      to: model.xpAfter,
      duration: 520,
      ease: 'Quad.easeOut',
      onUpdate: (tween) => meter.setValue(Math.round(tween.getValue() ?? model.xpAfter), model.xpMeterMax)
    });

    this.add.text(layout.centerX, xpMeterY + 30, `${model.xpBefore}/${model.xpMeterMax} -> ${model.xpAfter}/${model.xpMeterMax} EXP`, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#d8deff'
    }).setOrigin(0.5);

    if (!model.levelUpReady) {
      new UiIconSlot(this, this.uiSpec('xp_remaining_chip_icon', 'iconSlot', 'ui_xp_remaining_chip', 'asset_missing_icon', layout.centerX - 138, xpMeterY + 58, 24, 24, 'center', 55));
      this.add.text(layout.centerX, xpMeterY + 58, `Remaining to next level: ${model.xpRemaining} EXP`, {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#d8deff'
      }).setOrigin(0.5);
    }

    const rowsStartY = panelTop + 332;
    const rows = model.xpRows;
    if (rows.length === 0) {
      this.add.text(layout.centerX, rowsStartY, 'No detailed EXP breakdown available.', {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#98a0c7'
      }).setOrigin(0.5);
    }
    rows.forEach((row, index) => {
      const y = rowsStartY + index * 34;
      new UiPanel(this, this.uiSpec(`xp_breakdown_row_${index}`, 'panel', 'ui_xp_breakdown_row', 'ui_panel_default', layout.centerX - (panelWidth - 68) / 2, y - 14, panelWidth - 68, 28, 'topLeft', 55), {
        fillColor: COLORS.panelAlt,
        fillAlpha: 0.72,
        strokeColor: COLORS.accent,
        strokeAlpha: 0.22
      });
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
    if (model.levelUpReady) {
      new UiPanel(this, this.uiSpec('level_ready_badge', 'panel', 'ui_level_ready_badge', 'asset_missing_icon', layout.centerX - Math.min(240, panelWidth - 120) / 2, badgeY - 22, Math.min(240, panelWidth - 120), 44, 'topLeft', 55), {
        fillColor: COLORS.danger,
        fillAlpha: 0.36,
        strokeColor: COLORS.gold,
        strokeAlpha: 0.45
      });
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

    new UiButton(this, this.uiSpec('node_result_continue_button', 'button', 'ui_button_node_result_continue', 'ui_button_default', layout.centerX - Math.min(250, panelWidth - 80) / 2, panelTop + panelHeight - 86, Math.min(250, panelWidth - 80), 62, 'topLeft', 90), {
      label: 'Continue',
      onClick: () => {
        this.handleContinue();
      }
    });

    this.tweens.addCounter({
      from: 0,
      to: model.xpTotal,
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
      continueFromNodeResult(this, null);
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

    continueFromNodeResult(this, summary);
  }

  private uiSpec(
    id: string,
    type: string,
    assetKey: string,
    fallbackAssetKey: string,
    x: number,
    y: number,
    w: number,
    h: number,
    anchor: UiComponentSpec['anchor'],
    zIndex: number
  ): UiComponentSpec {
    return {
      id,
      type,
      assetKey,
      fallbackAssetKey,
      canonicalFolder: 'public/assets/ui/',
      expectedSourceSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      runtimeRenderSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.max(1, Math.round(w)),
      h: Math.max(1, Math.round(h)),
      anchor,
      fitMode: type === 'iconSlot' ? 'iconCenter' : type === 'meter' || type === 'button' || type === 'panel' ? 'nineSlice' : 'exact',
      scaleMode: type === 'iconSlot' ? 'fitInteger' : type === 'meter' || type === 'button' || type === 'panel' ? 'uiStretchNineSlice' : 'none',
      safePadding: type === 'iconSlot' ? 0 : 12,
      zIndex,
      dynamicTextAllowed: type !== 'iconSlot',
      pixelPerfect: {
        integerCoordinates: true,
        allowFractionalScale: false,
        filtering: 'nearest',
        antiAliasing: false,
        roundPixels: true
      }
    };
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
