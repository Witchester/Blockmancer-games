import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS } from '../utils/constants';
import { isCompactLayout } from '../utils/layout';

export class MainMenuScene extends Phaser.Scene {
  private controlsText?: Phaser.GameObjects.Text;

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
    const panelHeight = Math.round(height * 0.76);
    const panelCenterY = Math.round(height * 0.5);

    this.cameras.main.setBackgroundColor(COLORS.background);

    this.add
      .rectangle(centerX, panelCenterY, contentWidth, panelHeight, COLORS.panel, 0.92)
      .setStrokeStyle(2, COLORS.accentSoft, 0.35);

    this.add.text(centerX, 96, 'Blockmancer Dungeon', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: compact ? '46px' : '54px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, 170, 'A combat roguelike where the battlefield is built from falling magic.', {
      color: '#c4cbff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: compact ? '20px' : '23px',
      align: 'center',
      wordWrap: { width: contentWidth - 80 }
    }).setOrigin(0.5);

    new Button(this, centerX, 280, 280, 62, 'Start Game', () => {
      game.newRun();
      game.runState.runStatus = 'menu';
      this.scene.start('HeroSelectScene');
    });

    const continueButton = new Button(this, centerX, 362, 280, 62, 'Continue', () => {
      if (!game.loadRun()) {
        return;
      }

      this.scene.start(this.getContinueScene(game), { victory: game.runState.victory });
    });
    continueButton.setDisabled(!game.saveSystem.hasSave());

    new Button(this, centerX, 444, 280, 62, 'Controls', () => {
      this.controlsText?.setVisible(!this.controlsText.visible);
    });

    this.controlsText = this.add.text(
      centerX,
      530,
      [
        'Desktop: A/D or arrows move, W or Up rotates, S or Down soft drops, Space hard drops.',
        'Spells: 1 Fireball, 2 Frost Lock, 3 Bomb Rune, 4 Void Cut.',
        'Mobile: use the on-screen buttons in battle.'
      ].join('\n'),
      {
        color: '#d8deff',
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: compact ? '18px' : '20px',
        align: 'center',
        wordWrap: { width: contentWidth - 80 },
        lineSpacing: 8
      }
    ).setOrigin(0.5);
    this.controlsText.setVisible(false);

    this.add.text(centerX, height - 42, 'Built with Vite, TypeScript, Phaser 3, and Capacitor.', {
      color: '#98a0c7',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
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
