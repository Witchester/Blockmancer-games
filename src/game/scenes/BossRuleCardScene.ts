import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiPanel } from '../ui/components';
import { buildBossRuleViewModel } from '../ui/boss-rule';
import { enterBattleFromMap } from '../ui/map';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class BossRuleCardScene extends Phaser.Scene {
  constructor() {
    super('BossRuleCardScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    if (state.currentRoomType !== 'boss') {
      this.scene.start('MapScene');
      return;
    }

    const stage = game.stageSystem.getStageByIndex(state.stage);
    const card = game.bossRuleSystem.getForBoss(stage?.bossId ?? '');
    if (card) {
      state.currentBossRule = card.id;
      game.metaSystem.recordBossRuleDiscovered(card.id);
    }
    const model = buildBossRuleViewModel(stage, card);
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 650);
    const panelHeight = Math.min(layout.height - 136, 820);
    const panelLeft = layout.centerX - panelWidth / 2;
    const panelTop = layout.centerY - panelHeight / 2;

    this.cameras.main.setBackgroundColor(COLORS.background);
    game.assetSystem.createImageByAssetKey(this, model.arenaBackgroundAssetKey, 'stageBackground', layout.centerX, layout.centerY, {
      kind: 'background',
      alpha: 0.4
    }).setDisplaySize(layout.width, layout.height);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x050814, 0.7);

    new UiPanel(this, this.uiSpec('boss_rule_panel', 'panel', 'ui_panel_boss_rule', 'ui_panel_default', panelLeft, panelTop, panelWidth, panelHeight, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.94,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.5
    });

    new UiIconSlot(this, this.uiSpec('boss_icon', 'iconSlot', model.bossIconAssetKey, 'placeholder_icon', layout.centerX, panelTop + 92, 112, 112, 'center', 55));
    this.add.text(layout.centerX, panelTop + 170, model.bossName, {
      fontFamily: FONT_FAMILY,
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#ffca6b',
      align: 'center',
      wordWrap: { width: panelWidth - 54 },
      stroke: '#090b13',
      strokeThickness: 5
    }).setOrigin(0.5);
    this.add.text(layout.centerX, panelTop + 214, model.title, {
      fontFamily: FONT_FAMILY,
      fontSize: '20px',
      color: '#f6f7ff',
      align: 'center',
      wordWrap: { width: panelWidth - 70 }
    }).setOrigin(0.5);

    new UiPanel(this, this.uiSpec('boss_rule_inner_panel', 'panel', 'ui_panel_default', 'ui_panel_default', panelLeft + 34, panelTop + 264, panelWidth - 68, 310, 'topLeft', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.72,
      strokeColor: COLORS.accent,
      strokeAlpha: 0.3
    });
    new UiIconSlot(this, this.uiSpec('boss_rule_icon', 'iconSlot', model.ruleIconAssetKey, 'placeholder_icon', panelLeft + 88, panelTop + 322, 58, 58, 'center', 56));
    this.add.text(panelLeft + 130, panelTop + 286, model.description, {
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      color: '#d8deff',
      wordWrap: { width: panelWidth - 188 },
      lineSpacing: 5
    });

    const ruleText = model.rules.length ? model.rules.join('\n') : 'Watch for phase changes and keep the board flexible.';
    this.add.text(panelLeft + 58, panelTop + 402, ruleText, {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#f6f7ff',
      wordWrap: { width: panelWidth - 116 },
      lineSpacing: 6
    });
    this.add.text(layout.centerX, panelTop + 610, model.warning, {
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#ffb9c0',
      align: 'center',
      wordWrap: { width: panelWidth - 90 }
    }).setOrigin(0.5);

    const buttonW = Math.min(250, panelWidth - 110);
    new UiButton(this, this.uiSpec('start_boss_button', 'button', 'ui_button_start_boss', 'ui_button_default', layout.centerX - buttonW / 2, panelTop + panelHeight - 88, buttonW, 62, 'topLeft', 90), {
      label: 'Start Boss',
      onClick: () => enterBattleFromMap(this, 'boss', 'BattleScene', { bossRuleCardShown: true })
    });
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
      canonicalFolder: type === 'iconSlot' ? 'public/assets/icons/' : 'public/assets/ui/',
      expectedSourceSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      runtimeRenderSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.max(1, Math.round(w)),
      h: Math.max(1, Math.round(h)),
      anchor,
      fitMode: type === 'iconSlot' ? 'iconCenter' : type === 'button' || type === 'panel' ? 'nineSlice' : 'exact',
      scaleMode: type === 'iconSlot' ? 'fitInteger' : type === 'button' || type === 'panel' ? 'uiStretchNineSlice' : 'none',
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
}
