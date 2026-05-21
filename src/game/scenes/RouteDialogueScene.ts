import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { DialogueLine, RouteChoiceContent, RouteSceneContent } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

type RouteDialogueSceneData = {
  sceneId?: string;
  returnScene?: string;
  returnData?: Record<string, unknown>;
};

export class RouteDialogueScene extends Phaser.Scene {
  private routeScene!: RouteSceneContent;
  private returnScene = 'MapScene';
  private returnData?: Record<string, unknown>;
  private lineIndex = 0;
  private selectedChoice?: RouteChoiceContent;
  private rewardMessages: string[] = [];

  constructor() {
    super('RouteDialogueScene');
  }

  create(data?: RouteDialogueSceneData): void {
    const game = this.gameAsBlockmancer;
    const stage = game.stageSystem.getStageByIndex(game.runState.stage);
    this.routeScene = data?.sceneId
      ? game.routeStorySystem.getAllScenes().find((scene) => scene.id === data.sceneId)
        ?? game.routeStorySystem.getRouteSceneForHeroStage(game.runState.hero.id, stage?.id ?? 'stage_sprinkle_sewers')
      : game.routeStorySystem.getRouteSceneForHeroStage(game.runState.hero.id, stage?.id ?? 'stage_sprinkle_sewers');
    this.returnScene = data?.returnScene ?? 'MapScene';
    this.returnData = data?.returnData;
    this.lineIndex = 0;
    this.selectedChoice = undefined;
    this.rewardMessages = [];
    game.routeStorySystem.markRouteSceneTriggered(game.runState, this.routeScene.id);
    game.saveRun();
    this.renderPreChoice();
  }

  private renderPreChoice(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const panelTop = 36;
    const panelBottom = layout.height - 36;
    const panelHeight = panelBottom - panelTop;
    const titleY = panelTop + 28;
    const locationY = titleY + 38;
    const storyY = panelTop + panelHeight * 0.26;
    const dialogY = panelTop + panelHeight * 0.5;
    const buttonY = panelBottom - 44;
    const bark = this.gameAsBlockmancer.routeStorySystem.getHeroBark(this.gameAsBlockmancer.runState.hero.id);
    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 72, COLORS.panel, 0.97)
      .setStrokeStyle(3, COLORS.gold, 0.55);
    this.add.text(layout.centerX, titleY, this.routeScene.title, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '24px' : '30px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 64 }
    }).setOrigin(0.5);
    this.add.text(layout.centerX, locationY, this.routeScene.locationName, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '15px' : '17px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 88 }
    }).setOrigin(0.5);
    this.add.text(layout.centerX, storyY, this.routeScene.storyBeat, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '15px' : '17px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 76 },
      lineSpacing: 4
    }).setOrigin(0.5);

    const visibleLines = this.routeScene.preChoiceDialogue.slice(this.lineIndex, this.lineIndex + 3);
    this.add.text(layout.centerX, dialogY, this.formatLines(visibleLines), {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '17px' : '20px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 88 },
      lineSpacing: 6
    }).setOrigin(0.5);
    if (bark) {
      this.add.text(layout.centerX, buttonY - 40, `"${bark}"`, {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '13px' : '14px',
        align: 'center',
        wordWrap: { width: layout.contentWidth - 96 }
      }).setOrigin(0.5);
    }

    const canAdvance = this.lineIndex + 3 < this.routeScene.preChoiceDialogue.length;
    new Button(this, layout.centerX - 110, buttonY, 180, 50, canAdvance ? 'Skip To Choices' : 'Choices', () => {
      this.renderChoices();
    });
    new Button(this, layout.centerX + 110, buttonY, 180, 50, canAdvance ? 'Continue' : 'Choices', () => {
      if (canAdvance) {
        this.lineIndex += 3;
        this.renderPreChoice();
      } else {
        this.renderChoices();
      }
    });
  }

  private renderChoices(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const panelTop = 36;
    const panelBottom = layout.height - 36;
    const headerY = panelTop + 24;
    const choiceAreaTop = panelTop + 82;
    const choiceAreaBottom = panelBottom - 74;
    const slotHeight = (choiceAreaBottom - choiceAreaTop) / 3;
    const voiceTags = this.gameAsBlockmancer.routeStorySystem.getHeroVoiceTags(this.gameAsBlockmancer.runState.hero.id);
    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor(COLORS.background);
    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, layout.height - 72, {
      title: this.routeScene.title,
      subtitle: 'Choose a route response',
      titleFontSize: compact ? '28px' : '34px',
      bodyFontSize: compact ? '17px' : '19px',
      strokeColor: COLORS.gold
    });

    this.add.text(layout.centerX, headerY + 18, voiceTags.length ? `Voice tags: ${voiceTags.slice(0, 4).join(' · ')}` : '', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '12px' : '13px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 90 }
    }).setOrigin(0.5);

    this.routeScene.choices.forEach((choice, index) => {
      const y = choiceAreaTop + slotHeight * index + slotHeight / 2;
      const cardHeight = Math.max(136, slotHeight - 10);
      const laneLabel = choice.lane === 'true' ? 'True' : choice.lane === 'risky' ? 'Risky' : 'Practical';
      this.add.rectangle(layout.centerX, y, layout.contentWidth - 58, cardHeight, COLORS.panelAlt, 0.98)
        .setStrokeStyle(2, this.getLaneColor(choice.lane), 0.65);
      this.add.text(layout.centerX, y - 48, `${choice.label}  [${laneLabel}]`, {
        color: '#ffca6b',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '18px' : '20px',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: layout.contentWidth - 96 }
      }).setOrigin(0.5);
      this.add.text(layout.centerX, y + 6, `${choice.playerLine}\n${choice.gameplayResult}`, {
        color: '#f6f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '14px' : '15px',
        align: 'center',
        wordWrap: { width: layout.contentWidth - 112 },
        lineSpacing: 3
      }).setOrigin(0.5);
      new Button(this, layout.centerX, y + Math.min(62, cardHeight / 2 - 12), 170, 40, 'Choose', () => this.choose(choice));
    });

    new Button(this, layout.centerX, panelBottom - 26, 180, 44, 'Back', () => this.renderPreChoice());
  }

  private choose(choice: RouteChoiceContent): void {
    const game = this.gameAsBlockmancer;
    this.selectedChoice = choice;
    this.rewardMessages = game.routeStorySystem.resolveRouteChoice(game.runState, this.routeScene.id, choice.id);
    game.saveRun();
    this.renderResolution();
  }

  private renderResolution(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const panelTop = 36;
    const panelBottom = layout.height - 36;
    const titleY = panelTop + 30;
    const npcY = panelTop + (panelBottom - panelTop) * 0.38;
    const narrationY = panelTop + (panelBottom - panelTop) * 0.58;
    const resultY = panelTop + (panelBottom - panelTop) * 0.76;
    const choice = this.selectedChoice;
    if (!choice) {
      this.renderChoices();
      return;
    }
    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.rectangle(layout.centerX, layout.centerY, layout.contentWidth, layout.height - 72, COLORS.panel, 0.97)
      .setStrokeStyle(3, this.getLaneColor(choice.lane), 0.65);
    this.add.text(layout.centerX, titleY, choice.label, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '24px' : '30px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 72 }
    }).setOrigin(0.5);
    this.add.text(layout.centerX, npcY, this.formatLines(choice.npcResponse), {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '17px' : '20px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 88 },
      lineSpacing: 6
    }).setOrigin(0.5);
    this.add.text(layout.centerX, narrationY, choice.narration, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '14px' : '16px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 86 },
      lineSpacing: 4
    }).setOrigin(0.5);
    this.add.text(layout.centerX, resultY, this.rewardMessages.join('\n'), {
      color: '#65d6a5',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '13px' : '14px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 100 },
      lineSpacing: 4
    }).setOrigin(0.5);
    new Button(this, layout.centerX, panelBottom - 26, 220, 48, 'Continue', () => this.finish());
  }

  private finish(): void {
    this.scene.start(this.returnScene, this.returnData);
  }

  private formatLines(lines: DialogueLine[]): string {
    return lines.map((line) => this.gameAsBlockmancer.dialogueSystem.formatLine(line)).join('\n\n');
  }

  private getLaneColor(lane: RouteChoiceContent['lane']): number {
    if (lane === 'true') {
      return COLORS.success;
    }
    if (lane === 'risky') {
      return COLORS.accentSoft;
    }
    return COLORS.gold;
  }

  private get gameAsBlockmancer(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }
}
