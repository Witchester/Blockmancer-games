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
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.add
      .rectangle(640, 400, compact ? 1120 : 1180, compact ? 740 : 720, COLORS.panel, 0.92)
      .setStrokeStyle(2, COLORS.accentSoft, 0.35);

    this.add.text(640, compact ? 118 : 130, 'Blockmancer Dungeon', {
      color: '#f6f7ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: compact ? '46px' : '54px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, compact ? 178 : 190, 'A combat roguelike where the battlefield is built from falling magic.', {
      color: '#c4cbff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: compact ? '20px' : '23px',
      align: 'center',
      wordWrap: { width: compact ? 760 : 840 }
    }).setOrigin(0.5);

    new Button(this, 640, compact ? 292 : 310, 260, 58, 'Start Game', () => {
      game.newRun();
      game.runState.runStatus = 'menu';
      this.scene.start('HeroSelectScene');
    });

    const continueButton = new Button(this, 640, compact ? 366 : 390, 260, 58, 'Continue', () => {
      if (!game.loadRun()) {
        return;
      }

      this.scene.start(this.getContinueScene(game), { victory: game.runState.victory });
    });
    continueButton.setDisabled(!game.saveSystem.hasSave());

    new Button(this, 640, compact ? 440 : 470, 260, 58, 'Controls', () => {
      this.controlsText?.setVisible(!this.controlsText.visible);
    });

    this.controlsText = this.add.text(
      640,
      compact ? 570 : 590,
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
        wordWrap: { width: compact ? 760 : 860 },
        lineSpacing: 8
      }
    ).setOrigin(0.5);
    this.controlsText.setVisible(false);

    this.add.text(640, compact ? 726 : 720, 'Built with Vite, TypeScript, Phaser 3, and Capacitor.', {
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
