import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { UiButton, UiIconSlot, UiMeter, UiPanel } from '../ui/components';
import { addOuterBackground, createOuterUiSpec } from '../ui/outer-flow';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data?: { victory?: boolean }): void {
    const game = this.game as BlockmancerGame;
    const victory = Boolean(data?.victory ?? game.runState.victory);
    const state = game.runState;
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 640);
    const panelLeft = layout.centerX - panelWidth / 2;
    state.runStatus = victory ? 'victory' : 'game-over';

    this.cameras.main.setBackgroundColor(COLORS.background);
    addOuterBackground(this, victory ? 'bg_scene_victory' : 'bg_scene_defeat', 0.28);
    new UiPanel(this, createOuterUiSpec('defeat_summary_panel', 'panel', 'ui_panel_run_summary', 'ui_panel_default', panelLeft, 112, panelWidth, 548, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.9,
      strokeColor: victory ? COLORS.gold : COLORS.danger
    });
    new UiIconSlot(this, createOuterUiSpec('defeat_icon', 'iconSlot', victory ? 'placeholder_icon' : 'placeholder_icon', 'placeholder_icon', layout.centerX, 198, 78, 78, 'center', 55), {
      selected: victory
    });

    this.add.text(layout.centerX, 278, victory ? 'Dungeon Conquered' : 'Run Ended', {
      color: victory ? '#ffca6b' : '#ff6673',
      fontFamily: FONT_FAMILY,
      fontSize: '38px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: panelWidth - 64 }
    }).setOrigin(0.5);

    const summaryLines = [
      `Final Stage: ${state.stage}`,
      `Enemies Defeated: ${state.enemiesDefeated}`,
      `Gold Collected: ${state.player.totalGoldCollected}`,
      `Relics Claimed: ${state.ownedRewards.length}`,
      `Rooms Cleared: ${state.runStats.roomsCleared}`
    ];
    this.add.text(layout.centerX, 414, summaryLines.join('\n'), {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    new UiMeter(this, createOuterUiSpec('defeat_progress_meter', 'meter', 'ui_meter_xp', 'ui_meter_fallback', layout.centerX - 210, 570, 420, 36, 'topLeft', 70), {
      current: Math.max(0, state.runStats.roomsCleared),
      max: Math.max(1, state.map.length || state.runStats.roomsCleared || 1),
      fillColor: victory ? COLORS.success : COLORS.gold,
      showValueText: true,
      fillInset: 5
    });

    new UiButton(this, createOuterUiSpec('try_again_button', 'button', 'ui_button_new_run', 'ui_button_default', layout.centerX, 730, 280, 58, 'center', 90), {
      label: 'Restart Run',
      onClick: () => {
        game.clearSave();
        game.newRun();
        this.scene.start('MapScene');
      }
    });
    new UiButton(this, createOuterUiSpec('defeat_hub_button', 'button', 'ui_button_secondary', 'ui_button_default', layout.centerX, 802, 280, 54, 'center', 90), {
      label: 'Festival Hub',
      onClick: () => {
        game.clearSave();
        this.scene.start('HubScene');
      }
    });
    new UiButton(this, createOuterUiSpec('defeat_menu_button', 'button', 'ui_button_back', 'ui_button_default', layout.centerX, 870, 280, 54, 'center', 90), {
      label: 'Main Menu',
      onClick: () => {
        game.clearSave();
        this.scene.start('MainMenuScene');
      }
    });
  }
}
