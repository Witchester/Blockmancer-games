import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

type TutorialLesson = {
  title: string;
  body: string;
  highlight: 'controls' | 'board' | 'spell' | 'hold' | 'inventory' | 'enemy' | 'reward' | 'map';
};

const LESSONS: TutorialLesson[] = [
  {
    title: '1. Move Piece',
    body: 'Slide the falling block left or right to aim for gaps. Use A/D, arrow keys, or the left and right touch buttons.',
    highlight: 'controls'
  },
  {
    title: '2. Rotate Piece',
    body: 'Rotate to fit the shape before it lands. Use W, Up, or the Rot button.',
    highlight: 'controls'
  },
  {
    title: '3. Drop Piece',
    body: 'Soft drop nudges the block down. Hard drop locks it fast when the landing spot is right.',
    highlight: 'controls'
  },
  {
    title: '4. Clear Line',
    body: 'Fill a whole row with rune blocks to clear it. Clears deal damage and refill mana.',
    highlight: 'board'
  },
  {
    title: '5. Cascade Gravity',
    body: 'After a clear, blocks above fall straight down in their own columns. If they form another full row, the chain continues for bigger rewards.',
    highlight: 'board'
  },
  {
    title: '6. Mana And Spells',
    body: 'Line clears give mana. Spend mana on spells when you need damage, control, or a messy board fix.',
    highlight: 'spell'
  },
  {
    title: '7. Hold Block',
    body: 'Hold saves the current block for later. You can only hold once per falling block, so use it for setups.',
    highlight: 'hold'
  },
  {
    title: '8. Inventory Item',
    body: 'Open the bag to use snacks and tools. Items can heal, restore mana, or clean up awkward boards.',
    highlight: 'inventory'
  },
  {
    title: '9. Enemy Intent',
    body: 'Enemies show what they are about to do and how many block locks remain. Plan clears before the next attack.',
    highlight: 'enemy'
  },
  {
    title: '10. Rewards',
    body: 'After battles, pick one reward to shape the run. Relics, upgrades, and items can make cascades stronger.',
    highlight: 'reward'
  },
  {
    title: '11. Map Progression',
    body: 'Choose rooms on the dungeon map, beat the stage boss, and keep the festival adventure moving.',
    highlight: 'map'
  }
];

export class TutorialScene extends Phaser.Scene {
  private lessonIndex = 0;
  private lessonLayer?: Phaser.GameObjects.Container;

  constructor() {
    super('TutorialScene');
  }

  create(): void {
    const game = this.sharedGame;
    this.lessonIndex = Math.min(
      game.tutorialSystem.getLessonIndex(game.metaSystem.state),
      LESSONS.length - 1
    );
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.renderLesson();
  }

  private get sharedGame(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }

  private renderLesson(): void {
    this.lessonLayer?.destroy(true);
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const lesson = LESSONS[this.lessonIndex];
    this.lessonLayer = this.add.container(0, 0);

    this.lessonLayer.add(this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, COLORS.background, 1));
    this.lessonLayer.add(this.add.rectangle(layout.centerX, 132, layout.contentWidth, 170, COLORS.panel, 0.96).setStrokeStyle(2, COLORS.accent, 0.35));
    this.lessonLayer.add(this.add.text(layout.centerX, 82, 'Blockmancer Basics', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '30px' : '36px',
      fontStyle: 'bold'
    }).setOrigin(0.5));

    this.lessonLayer.add(this.add.text(layout.centerX, 128, lesson.title, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '24px' : '28px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5));

    this.lessonLayer.add(this.add.text(layout.centerX, 182, lesson.body, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '19px' : '22px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 80 },
      lineSpacing: 7
    }).setOrigin(0.5));

    this.drawMockBattle(layout.centerX, 560, layout.contentWidth, compact);
    this.drawHighlight(lesson.highlight, layout.centerX, 560, layout.contentWidth);

    this.lessonLayer.add(this.add.text(layout.centerX, 920, `${this.lessonIndex + 1} / ${LESSONS.length}`, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '20px'
    }).setOrigin(0.5));

    this.lessonLayer.add(new Button(this, layout.centerX - 180, 1010, 180, 54, 'Back', () => this.previousLesson()));
    this.lessonLayer.add(new Button(this, layout.centerX + 180, 1010, 180, 54, this.lessonIndex === LESSONS.length - 1 ? 'Start' : 'Next', () => this.nextLesson()));
    this.lessonLayer.add(new Button(this, layout.centerX, 1090, 260, 52, 'Skip Tutorial', () => this.finishTutorial()));
    this.lessonLayer.add(new Button(this, layout.centerX, 1160, 220, 48, 'Main Menu', () => this.scene.start('MainMenuScene')));
  }

  private drawMockBattle(centerX: number, centerY: number, width: number, compact: boolean): void {
    const left = centerX - width / 2 + 24;
    const top = centerY - 300;
    const battleWidth = width - 48;
    const boardX = centerX - 96;
    const boardY = top + 178;

    this.lessonLayer?.add(this.add.rectangle(centerX, centerY, battleWidth, 640, COLORS.panel, 0.94).setStrokeStyle(2, COLORS.accentSoft, 0.28));
    this.lessonLayer?.add(this.add.rectangle(centerX, top + 70, battleWidth - 32, 110, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.28));
    this.lessonLayer?.add(this.add.text(left + 20, top + 38, 'Enemy Intent', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      fontStyle: 'bold'
    }));
    this.lessonLayer?.add(this.add.text(left + 20, top + 72, 'Attack in 3 blocks', {
      color: '#ff6673',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '17px' : '19px'
    }));

    this.lessonLayer?.add(this.add.rectangle(left + 76, boardY + 86, 112, 72, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.24));
    this.lessonLayer?.add(this.add.text(left + 76, boardY + 86, 'Hold\nT', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      align: 'center'
    }).setOrigin(0.5));

    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const filled = row > 7 || (row === 7 && col < 6) || (row === 6 && [1, 2, 5].includes(col));
        this.lessonLayer?.add(this.add.rectangle(
          boardX + col * 24,
          boardY + row * 24,
          22,
          22,
          filled ? [0x56d3ff, 0xffd166, 0xc682ff, 0x5fe097][(row + col) % 4] : COLORS.boardEmpty,
          1
        ).setStrokeStyle(1, COLORS.boardGrid, 0.85));
      }
    }

    this.lessonLayer?.add(this.add.rectangle(centerX + 210, boardY + 84, 120, 118, COLORS.panelAlt, 0.98).setStrokeStyle(2, COLORS.accent, 0.24));
    this.lessonLayer?.add(this.add.text(centerX + 210, boardY + 22, 'Mana / Spells', {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '17px'
    }).setOrigin(0.5));
    this.lessonLayer?.add(this.add.text(centerX + 210, boardY + 82, 'Mana 40\nFireball', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      align: 'center'
    }).setOrigin(0.5));

    this.lessonLayer?.add(this.add.rectangle(left + 114, boardY + 320, 210, 62, COLORS.panelAlt, 0.96).setStrokeStyle(2, COLORS.accentSoft, 0.2));
    this.lessonLayer?.add(this.add.text(left + 114, boardY + 320, 'Bag\nMini Cupcake x1', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      align: 'center'
    }).setOrigin(0.5));

    const controlY = top + 570;
    ['<', '>', 'Rot', 'Soft', 'Drop', 'Hold'].forEach((label, index) => {
      this.lessonLayer?.add(this.add.rectangle(centerX - 210 + index * 84, controlY, 72, 46, COLORS.panelAlt, 1).setStrokeStyle(2, COLORS.accent, 0.25));
      this.lessonLayer?.add(this.add.text(centerX - 210 + index * 84, controlY, label, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '17px',
        fontStyle: 'bold'
      }).setOrigin(0.5));
    });

    this.lessonLayer?.add(this.add.text(centerX, boardY + 286, 'Reward card and map choices appear after battles.', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      align: 'center',
      wordWrap: { width: width - 96 }
    }).setOrigin(0.5));
  }

  private drawHighlight(target: TutorialLesson['highlight'], centerX: number, centerY: number, width: number): void {
    const left = centerX - width / 2 + 24;
    const top = centerY - 300;
    const rects: Record<TutorialLesson['highlight'], [number, number, number, number]> = {
      enemy: [centerX, top + 70, width - 80, 126],
      hold: [left + 76, top + 264, 132, 92],
      board: [centerX - 12, top + 286, 226, 292],
      spell: [centerX + 210, top + 264, 142, 138],
      inventory: [left + 114, top + 498, 232, 84],
      controls: [centerX, top + 570, width - 86, 68],
      reward: [centerX, top + 502, width - 120, 86],
      map: [centerX, top + 502, width - 120, 86]
    };
    const [x, y, w, h] = rects[target];
    this.lessonLayer?.add(this.add.rectangle(x, y, w, h, 0x000000, 0).setStrokeStyle(4, COLORS.gold, 0.95));
  }

  private previousLesson(): void {
    this.lessonIndex = Math.max(0, this.lessonIndex - 1);
    this.saveProgress();
    this.renderLesson();
  }

  private nextLesson(): void {
    if (this.lessonIndex >= LESSONS.length - 1) {
      this.finishTutorial();
      return;
    }

    this.lessonIndex += 1;
    this.saveProgress();
    this.renderLesson();
  }

  private saveProgress(): void {
    const game = this.sharedGame;
    game.tutorialSystem.setLessonIndex(this.lessonIndex, game.metaSystem.state);
    game.metaSystem.save();
  }

  private finishTutorial(): void {
    const game = this.sharedGame;
    game.tutorialSystem.setComplete(true, game.metaSystem.state);
    game.metaSystem.save();
    this.scene.start('HeroSelectScene');
  }
}
