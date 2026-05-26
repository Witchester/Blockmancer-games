import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { UiButton, UiPanel, UiSpriteSlot } from '../ui/components';
import { addOuterBackground, createOuterUiSpec } from '../ui/outer-flow';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

type VictorySceneData = {
  endingKind?: 'normal' | 'true';
  heroUnlocks?: string[];
  routeEndingId?: string;
  routeVariantEndingId?: string;
};

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data?: VictorySceneData): void {
    const game = this.game as BlockmancerGame;
    const endingKind = data?.endingKind ?? 'normal';
    const routeEnding = data?.routeEndingId ? game.routeStorySystem.getEndingById(data.routeEndingId) : null;
    const routeVariant = data?.routeVariantEndingId ? game.routeStorySystem.getEndingById(data.routeVariantEndingId) : null;
    const beat = routeEnding
      ? {
          title: routeEnding.title,
          lines: [
            ...routeEnding.lines.map((line) => game.dialogueSystem.formatLine(line)),
            ...(routeVariant ? ['', routeVariant.title, ...routeVariant.lines.map((line) => game.dialogueSystem.formatLine(line))] : [])
          ]
        }
      : game.storySystem.getEnding(endingKind);
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 640);
    const panelLeft = layout.centerX - panelWidth / 2;

    this.cameras.main.setBackgroundColor(COLORS.background);
    addOuterBackground(this, 'bg_scene_victory', 0.34);
    new UiPanel(this, createOuterUiSpec('victory_title_panel', 'panel', 'ui_panel_victory', 'ui_panel_default', panelLeft, 56, panelWidth, 124, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.88,
      strokeColor: endingKind === 'true' ? COLORS.success : COLORS.gold
    });
    this.add.text(layout.centerX, 116, beat.title, {
      color: endingKind === 'true' ? '#65d6a5' : '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: panelWidth - 70 }
    }).setOrigin(0.5);

    new UiSpriteSlot(this, createOuterUiSpec('victory_hero_portrait', 'spriteSlot', 'portrait_hero_milo_blockmancer', 'placeholder_portrait', layout.centerX, 298, 156, 156, 'center', 45));
    new UiPanel(this, createOuterUiSpec('ending_text_panel', 'panel', 'ui_panel_dialogue', 'ui_panel_default', panelLeft, 402, panelWidth, 330, 'topLeft', 35), {
      fillColor: COLORS.panel,
      fillAlpha: 0.86,
      strokeColor: COLORS.accent
    });
    this.add.text(layout.centerX, 566, beat.lines.join('\n\n'), {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: routeVariant ? '17px' : '20px',
      align: 'center',
      wordWrap: { width: panelWidth - 80 },
      lineSpacing: routeVariant ? 4 : 6
    }).setOrigin(0.5);

    const unlocks = data?.heroUnlocks ?? [];
    this.add.text(layout.centerX, 784, unlocks.length ? `New hero note:\n${unlocks.join('\n')}` : 'The festival crowd is already planning the next run.', {
      color: unlocks.length ? '#ffca6b' : '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      align: 'center',
      wordWrap: { width: panelWidth - 90 },
      lineSpacing: 6
    }).setOrigin(0.5);

    new UiButton(this, createOuterUiSpec('victory_main_menu_button', 'button', 'ui_button_back', 'ui_button_default', layout.centerX, 900, 280, 58, 'center', 90), {
      label: 'Main Menu',
      onClick: () => {
        game.clearSave();
        this.scene.start('MainMenuScene');
      }
    });
  }
}
