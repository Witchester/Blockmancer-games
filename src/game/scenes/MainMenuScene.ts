import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
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
    const contentWidth = width - 48;
    const panelHeight = Math.round(height * 0.58);
    const panelCenterY = Math.round(height * 0.48);

    this.cameras.main.setBackgroundColor(COLORS.background);

    this.add
      .rectangle(centerX, panelCenterY, contentWidth, panelHeight, COLORS.panel, 0.92)
      .setStrokeStyle(2, COLORS.accentSoft, 0.35);

    this.add.text(centerX, 96, 'Blockmancer Dungeon', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '46px' : '54px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, 170, 'A combat roguelike where the battlefield is built from falling magic.', {
      color: '#c4cbff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '20px' : '23px',
      align: 'center',
      wordWrap: { width: contentWidth - 80 }
    }).setOrigin(0.5);

    new Button(this, centerX, 310, 280, 62, 'Start Game', () => {
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
    });

    const continueButton = new Button(this, centerX, 392, 280, 62, 'Continue', () => {
      if (!game.loadRun()) {
        return;
      }

      this.scene.start(this.getContinueScene(game), { victory: game.runState.victory });
    });
    continueButton.setDisabled(!game.saveSystem.hasSave());

    new Button(this, centerX, 474, 280, 62, 'Tutorial', () => {
      this.scene.start('TutorialScene');
    });

    new Button(this, centerX, 548, 280, 58, 'Festival Hub', () => {
      this.scene.start('HubScene');
    });

    new Button(this, centerX, 620, 280, 58, 'Monster Friends', () => {
      this.scene.start('CollectionScene');
    });

    new Button(this, centerX, 692, 280, 58, 'Help', () => {
      this.scene.start('HelpScene');
    });

    new Button(this, centerX, 764, 280, 58, 'Settings', () => {
      this.scene.start('SettingsScene');
    });

    if (import.meta.env.DEV) {
      new Button(this, centerX, 836, 280, 52, 'QA Debug', () => {
        this.scene.start('DebugScene');
      });
    }

    this.add.text(centerX, height - 42, 'Built with Vite, TypeScript, Phaser 3, and Capacitor.', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '16px' : '18px'
    }).setOrigin(0.5);
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
