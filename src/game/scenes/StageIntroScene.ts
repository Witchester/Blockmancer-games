import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiPanel } from '../ui/components';
import { buildStageIntroViewModel } from '../ui/stage-intro';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class StageIntroScene extends Phaser.Scene {
  constructor() {
    super('StageIntroScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const stage = game.stageSystem.getStageByIndex(state.stage);
    const goal = game.stageGoalSystem.ensureGoal(state);
    const beat = stage ? game.storySystem.getStageIntro(stage.id) : null;
    if (stage?.id) {
      game.storySystem.markSeen(stage.id);
    }
    const model = buildStageIntroViewModel(state, stage, goal, beat);
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 640);
    const titleTop = 86;
    const goalTop = 258;

    this.cameras.main.setBackgroundColor(COLORS.background);
    game.assetSystem.createImageByAssetKey(this, model.backgroundAssetKey, 'stageBackground', layout.centerX, layout.centerY, {
      kind: 'background',
      alpha: 0.34
    }).setDisplaySize(layout.width, layout.height);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x050814, 0.7);

    new UiPanel(this, this.uiSpec('stage_title_panel', 'panel', 'ui_panel_default', 'ui_panel_default', layout.centerX - panelWidth / 2, titleTop, panelWidth, 142, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.92,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.44
    });
    this.add.text(layout.centerX, titleTop + 36, model.subtitle, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#98a0c7'
    }).setOrigin(0.5);
    this.add.text(layout.centerX, titleTop + 82, model.title, {
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffca6b',
      align: 'center',
      wordWrap: { width: panelWidth - 52 },
      stroke: '#090b13',
      strokeThickness: 5
    }).setOrigin(0.5);

    new UiPanel(this, this.uiSpec('stage_goal_panel', 'panel', 'ui_panel_battle', 'ui_panel_default', layout.centerX - panelWidth / 2, goalTop, panelWidth, 430, 'topLeft', 30), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.9,
      strokeColor: COLORS.accent,
      strokeAlpha: 0.36
    });
    new UiIconSlot(this, this.uiSpec('stage_goal_icon', 'iconSlot', model.goalIconAssetKey, 'placeholder_icon', layout.centerX, goalTop + 78, 86, 86, 'center', 55));
    this.add.text(layout.centerX, goalTop + 140, model.goalTitle, {
      fontFamily: FONT_FAMILY,
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#f6f7ff',
      align: 'center',
      wordWrap: { width: panelWidth - 62 }
    }).setOrigin(0.5);
    this.add.text(layout.centerX, goalTop + 194, model.goalDescription, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#d8deff',
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: panelWidth - 74 }
    }).setOrigin(0.5, 0);
    this.add.text(layout.centerX, goalTop + 294, `Progress: ${model.goalProgress}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#65d6a5'
    }).setOrigin(0.5);

    const modifierText = model.modifiers.length ? model.modifiers.join('\n') : 'No special stage modifiers are active.';
    this.add.text(layout.centerX, goalTop + 334, modifierText, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#98a0c7',
      align: 'center',
      wordWrap: { width: panelWidth - 84 }
    }).setOrigin(0.5, 0);

    this.add.text(layout.centerX, goalTop + 472, model.flavor, {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#f6f7ff',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: panelWidth - 58 }
    }).setOrigin(0.5, 0);

    const buttonW = Math.min(260, panelWidth - 100);
    new UiButton(this, this.uiSpec('start_stage_button', 'button', 'ui_button_primary', 'ui_button_default', layout.centerX - buttonW / 2, layout.height - 118, buttonW, 62, 'topLeft', 90), {
      label: 'Continue',
      onClick: () => this.scene.start('MapScene')
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
