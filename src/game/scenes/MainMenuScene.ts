import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { UiButton, UiPanel } from '../ui/components';
import { addOuterBackground, createOuterUiSpec } from '../ui/outer-flow';
import { COLORS, FONT_FAMILY_STACKS, FONT_SIZE_720 } from '../utils/constants';
import { isCompactLayout } from '../utils/layout';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const compact = isCompactLayout(this);
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const panelWidth = Math.min(width - 56, 560);
    const panelLeft = centerX - panelWidth / 2;

    game.runState.runStatus = 'menu';
    this.cameras.main.setBackgroundColor(COLORS.background);
    addOuterBackground(this, 'bg_scene_main_menu', 0.36);

    new UiPanel(this, createOuterUiSpec('main_menu_title_panel', 'panel', 'ui_panel_main_menu', 'ui_panel_default', panelLeft, 78, panelWidth, 176, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.88,
      strokeColor: COLORS.gold
    });
    this.add.text(centerX, 126, 'Blockmancer Dungeon', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY_STACKS.display,
      fontSize: compact ? `${FONT_SIZE_720.stageBanner}px` : `${FONT_SIZE_720.title}px`,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: panelWidth - 48 }
    }).setOrigin(0.5);
    this.add.text(centerX, 196, 'Falling-block magic meets festival dungeon runs.', {
      color: '#c4cbff',
      fontFamily: FONT_FAMILY_STACKS.ui,
      fontSize: compact ? `${FONT_SIZE_720.small}px` : `${FONT_SIZE_720.body}px`,
      align: 'center',
      wordWrap: { width: panelWidth - 72 }
    }).setOrigin(0.5);

    new UiPanel(this, createOuterUiSpec('main_menu_button_panel', 'panel', 'ui_panel_default', 'placeholder_panel', panelLeft, 288, panelWidth, import.meta.env.DEV ? 518 : 456, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.78,
      strokeColor: COLORS.accent
    });

    const buttonWidth = Math.min(360, panelWidth - 88);
    this.addMenuButton('new_run_button', centerX, 340, buttonWidth, 'New Run', 'ui_button_new_run', () => this.startNewRun(game));
    this.addMenuButton('continue_button', centerX, 410, buttonWidth, 'Continue', 'ui_button_continue', () => {
      if (!game.loadRun()) {
        return;
      }
      this.scene.start(this.getContinueScene(game), { victory: game.runState.victory });
    }, !game.saveSystem.hasSave());
    this.addMenuButton('tutorial_button', centerX, 480, buttonWidth, 'Tutorial', 'ui_button_secondary', () => this.scene.start('TutorialScene'));
    this.addMenuButton('hub_button', centerX, 550, buttonWidth, 'Festival Hub', 'ui_button_secondary', () => this.scene.start('HubScene'));
    this.addMenuButton('collection_button', centerX, 620, buttonWidth, 'Monster Friends', 'ui_button_secondary', () => this.scene.start('CollectionScene'));
    this.addMenuButton('help_button', centerX, 690, buttonWidth, 'Help', 'ui_button_secondary', () => this.scene.start('HelpScene'));
    this.addMenuButton('settings_button', centerX, 760, buttonWidth, 'Settings', 'ui_button_settings', () => this.scene.start('SettingsScene'));

    if (import.meta.env.DEV) {
      this.addMenuButton('qa_debug_button', centerX, 830, buttonWidth, 'QA Debug', 'ui_button_secondary', () => this.scene.start('DebugScene'));
    }

    this.add.text(centerX, height - 42, 'Built with Vite, TypeScript, Phaser 3, and Capacitor.', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY_STACKS.readable,
      fontSize: compact ? `${FONT_SIZE_720.tiny}px` : `${FONT_SIZE_720.small}px`
    }).setOrigin(0.5);
  }

  private addMenuButton(id: string, x: number, y: number, width: number, label: string, assetKey: string, onClick: () => void, disabled = false): void {
    new UiButton(this, createOuterUiSpec(id, 'button', assetKey, 'ui_button_default', x, y, width, 56, 'center', 90), {
      label,
      disabled,
      onClick
    });
  }

  private startNewRun(game: BlockmancerGame): void {
    const nextScene = !game.tutorialSystem.isComplete(game.metaSystem.state) ? 'TutorialScene' : 'HeroSelectScene';
    if (!game.storySystem.hasSeen('opening')) {
      this.scene.start('StoryScene', {
        beat: game.storySystem.getOpening(),
        beatId: 'opening',
        returnScene: nextScene
      });
      return;
    }

    if (!game.tutorialSystem.isComplete(game.metaSystem.state)) {
      this.scene.start('TutorialScene');
      return;
    }

    this.scene.start('HeroSelectScene');
  }

  private getContinueScene(game: BlockmancerGame): string {
    switch (game.runState.runStatus) {
      case 'battle':
        return 'BattleScene';
      case 'reward':
        return 'RewardScene';
      case 'game-over':
      case 'victory':
        return 'GameOverScene';
      default:
        break;
    }

    if (game.runState.currentRoomProgress === 'entered') {
      switch (game.runState.currentRoomType) {
        case 'event':
          return 'EventScene';
        case 'shop':
          return 'ShopScene';
        case 'rest':
          return 'RestScene';
        case 'treasure':
          return 'TreasureScene';
        default:
          break;
      }
    }

    game.runState.runStatus = 'map';
    return 'MapScene';
  }
}
