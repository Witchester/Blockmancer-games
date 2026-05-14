import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { StoryBeat } from '../systems/StorySystem';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

type StorySceneData = {
  beat?: StoryBeat;
  beatId?: string;
  returnScene?: string;
  returnData?: Record<string, unknown>;
};

export class StoryScene extends Phaser.Scene {
  private beat!: StoryBeat;
  private returnScene = 'MainMenuScene';
  private returnData?: Record<string, unknown>;
  private index = 0;
  private bodyText?: Phaser.GameObjects.Text;
  private progressText?: Phaser.GameObjects.Text;

  constructor() {
    super('StoryScene');
  }

  create(data?: StorySceneData): void {
    const game = this.game as BlockmancerGame;
    this.beat = data?.beat ?? game.storySystem.getOpening();
    this.returnScene = data?.returnScene ?? 'MainMenuScene';
    this.returnData = data?.returnData;
    this.index = 0;
    if (data?.beatId || this.beat.id) {
      game.storySystem.markSeen(data?.beatId ?? this.beat.id);
    }
    this.render();
  }

  private render(): void {
    const layout = getPortraitLayout(this);
    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, COLORS.panel, 0.96)
      .setStrokeStyle(3, COLORS.gold, 0.45);

    this.add.text(layout.centerX, 118, this.beat.title, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: '40px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 80 }
    }).setOrigin(0.5);

    if (this.beat.speaker) {
      this.add.text(layout.centerX, 178, this.beat.speaker, {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    this.bodyText = this.add.text(layout.centerX, 430, this.beat.lines[this.index] ?? '', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '30px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 96 },
      lineSpacing: 12
    }).setOrigin(0.5);

    this.progressText = this.add.text(layout.centerX, 688, `${this.index + 1}/${this.beat.lines.length}`, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '20px'
    }).setOrigin(0.5);

    new Button(this, layout.centerX - 150, 780, 220, 58, 'Skip', () => this.finish());
    new Button(this, layout.centerX + 150, 780, 220, 58, this.index >= this.beat.lines.length - 1 ? 'Continue' : 'Next', () => this.next());
  }

  private next(): void {
    if (this.index >= this.beat.lines.length - 1) {
      this.finish();
      return;
    }
    this.index += 1;
    this.bodyText?.setText(this.beat.lines[this.index] ?? '');
    this.progressText?.setText(`${this.index + 1}/${this.beat.lines.length}`);
    this.render();
  }

  private finish(): void {
    this.scene.start(this.returnScene, this.returnData);
  }
}
