import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { DialogueLine, RouteChoiceContent, RouteSceneContent } from '../types/GameTypes';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiPanel } from '../ui/components';
import { buildRouteChoiceCards, buildRouteDialogueViewModel, type RouteChoiceCardViewModel } from '../ui/route-dialogue';
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
  private choiceLocked = false;

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
    this.choiceLocked = false;
    game.routeStorySystem.markRouteSceneTriggered(game.runState, this.routeScene.id);
    game.saveRun();
    this.renderPreChoice();
  }

  private renderPreChoice(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const game = this.gameAsBlockmancer;
    const visibleLines = this.routeScene.preChoiceDialogue.slice(this.lineIndex, this.lineIndex + 3);
    const model = buildRouteDialogueViewModel(this.routeScene, visibleLines, game.runState, game.dialogueSystem);
    const canAdvance = this.lineIndex + 3 < this.routeScene.preChoiceDialogue.length;
    const bark = game.routeStorySystem.getHeroBark(game.runState.hero.id);

    this.children.removeAll(true);
    this.renderBackground(model.backgroundAssetKey);
    this.renderHeader(model.title, model.locationName, this.routeScene.stageId);

    new UiIconSlot(this, this.uiSpec('speaker_portrait', 'iconSlot', model.activePortraitAssetKey, 'placeholder_portrait', layout.centerX, 322, compact ? 112 : 138, compact ? 112 : 138, 'center', 48));
    new UiPanel(this, this.uiSpec('nameplate_panel', 'panel', 'ui_dialogue_nameplate', 'placeholder_panel', layout.centerX - 150, 430, 300, 52, 'topLeft', 55), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.9,
      strokeColor: COLORS.gold,
      strokeAlpha: 0.36
    });
    this.add.text(layout.centerX, 456, model.activeSpeakerName, {
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      fontStyle: 'bold',
      color: '#ffca6b'
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 520, model.storyBeat, {
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '15px' : '17px',
      color: '#d8deff',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 72 },
      lineSpacing: 5
    }).setOrigin(0.5, 0);

    this.renderDialoguePanel(visibleLines, 706, compact);

    if (bark) {
      this.add.text(layout.centerX, layout.height - 148, `"${bark}"`, {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '13px' : '14px',
        align: 'center',
        wordWrap: { width: layout.contentWidth - 96 }
      }).setOrigin(0.5);
    }

    const buttonY = layout.height - 100;
    new UiButton(this, this.uiSpec('skip_dialogue_button', 'button', 'ui_button_skip_dialogue', 'ui_button_default', layout.centerX - 218, buttonY - 28, 196, 56, 'topLeft', 90), {
      label: canAdvance ? 'Skip To Choices' : 'Choices',
      onClick: () => this.renderChoices()
    });
    new UiButton(this, this.uiSpec('continue_dialogue_button', 'button', 'ui_button_primary', 'ui_button_default', layout.centerX + 22, buttonY - 28, 196, 56, 'topLeft', 90), {
      label: canAdvance ? 'Continue' : 'Choices',
      onClick: () => {
        if (canAdvance) {
          this.lineIndex += 3;
          this.renderPreChoice();
        } else {
          this.renderChoices();
        }
      }
    });
  }

  private renderChoices(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const game = this.gameAsBlockmancer;
    const cards = buildRouteChoiceCards(this.routeScene, game.runState);
    const voiceTags = game.routeStorySystem.getHeroVoiceTags(game.runState.hero.id);

    this.children.removeAll(true);
    this.renderBackground(`bg_route_${game.runState.hero.id}_${this.routeScene.stageId}`);
    this.renderHeader(this.routeScene.title, 'Choose a route response', this.routeScene.stageId);
    if (voiceTags.length) {
      this.add.text(layout.centerX, 170, `Voice tags: ${voiceTags.slice(0, 4).join(' | ')}`, {
        color: '#98a0c7',
        fontFamily: FONT_FAMILY,
        fontSize: compact ? '12px' : '13px',
        align: 'center',
        wordWrap: { width: layout.contentWidth - 90 }
      }).setOrigin(0.5);
    }

    const startY = 222;
    const cardH = compact ? 152 : 170;
    cards.forEach((card, index) => {
      const choice = this.routeScene.choices[index];
      if (!choice) return;
      this.renderChoiceCard(card, choice, layout.centerX - (layout.contentWidth - 48) / 2, startY + index * (cardH + 18), layout.contentWidth - 48, cardH, compact);
    });

    new UiButton(this, this.uiSpec('choices_back_button', 'button', 'ui_button_secondary', 'ui_button_default', layout.centerX - 96, layout.height - 92, 192, 54, 'topLeft', 90), {
      label: 'Back',
      onClick: () => this.renderPreChoice()
    });
  }

  private renderChoiceCard(model: RouteChoiceCardViewModel, choice: RouteChoiceContent, x: number, y: number, w: number, h: number, compact: boolean): void {
    new UiPanel(this, this.uiSpec(`choice_${model.lane}`, 'panel', model.assetKey, 'ui_button_default', x, y, w, h, 'topLeft', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: model.disabled ? 0.52 : 0.94,
      strokeColor: this.getLaneColor(model.lane),
      strokeAlpha: model.selected ? 0.9 : 0.55
    }).setState(model.selected ? 'selected' : model.disabled ? 'disabled' : 'default');
    if (model.lane === 'true') {
      new UiIconSlot(this, this.uiSpec(`choice_${model.id}_flag`, 'iconSlot', 'ico_route_true_flag', 'placeholder_icon', x + 34, y + 34, 36, 36, 'center', 58));
    }
    this.add.text(x + 62, y + 18, `${model.label}  [${model.laneLabel}]`, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '17px' : '19px',
      fontStyle: 'bold',
      wordWrap: { width: w - 86 }
    }).setAlpha(model.disabled ? 0.58 : 1);
    this.add.text(x + 62, y + 50, model.playerLine, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '14px' : '15px',
      wordWrap: { width: w - 90 }
    }).setMaxLines(2).setAlpha(model.disabled ? 0.58 : 1);
    this.add.text(x + 62, y + h - 48, model.gameplayResult, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '13px' : '14px',
      wordWrap: { width: w - 260 }
    }).setMaxLines(2).setAlpha(model.disabled ? 0.58 : 1);
    this.add.text(x + w - 28, y + h - 28, model.routeStateText, {
      color: model.selected ? '#65d6a5' : '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '12px' : '13px',
      align: 'right'
    }).setOrigin(1, 0.5);

    const hit = this.add.zone(x + w / 2, y + h / 2, w, h).setDepth(96);
    if (!model.disabled && !model.selected) {
      hit.setInteractive({ useHandCursor: true }).on('pointerup', () => this.choose(choice));
    }
  }

  private choose(choice: RouteChoiceContent): void {
    if (this.choiceLocked) {
      return;
    }
    const game = this.gameAsBlockmancer;
    this.choiceLocked = true;
    this.selectedChoice = choice;
    this.rewardMessages = game.routeStorySystem.resolveRouteChoice(game.runState, this.routeScene.id, choice.id);
    game.saveRun();
    this.renderResolution();
  }

  private renderResolution(): void {
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    const choice = this.selectedChoice;
    if (!choice) {
      this.renderChoices();
      return;
    }
    const model = buildRouteDialogueViewModel(this.routeScene, choice.npcResponse, this.gameAsBlockmancer.runState, this.gameAsBlockmancer.dialogueSystem);

    this.children.removeAll(true);
    this.renderBackground(model.backgroundAssetKey);
    this.renderHeader(choice.label, `${choice.lane.toUpperCase()} route response`, this.routeScene.stageId, this.getLaneColor(choice.lane));
    new UiIconSlot(this, this.uiSpec('resolution_portrait', 'iconSlot', model.activePortraitAssetKey, 'placeholder_portrait', layout.centerX, 278, compact ? 108 : 132, compact ? 108 : 132, 'center', 48));
    new UiPanel(this, this.uiSpec('resolution_nameplate', 'panel', 'ui_dialogue_nameplate', 'placeholder_panel', layout.centerX - 150, 384, 300, 52, 'topLeft', 55), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.9,
      strokeColor: this.getLaneColor(choice.lane),
      strokeAlpha: 0.42
    });
    this.add.text(layout.centerX, 410, model.activeSpeakerName, {
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      fontStyle: 'bold',
      color: '#ffca6b'
    }).setOrigin(0.5);

    this.renderDialoguePanel(choice.npcResponse, 482, compact, this.getLaneColor(choice.lane));
    this.add.text(layout.centerX, 760, choice.narration, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '15px' : '16px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 86 },
      lineSpacing: 5
    }).setOrigin(0.5, 0);
    this.add.text(layout.centerX, 888, this.rewardMessages.join('\n'), {
      color: '#65d6a5',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '13px' : '14px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 100 },
      lineSpacing: 4
    }).setOrigin(0.5, 0);
    new UiButton(this, this.uiSpec('resolution_continue_button', 'button', 'ui_button_primary', 'ui_button_default', layout.centerX - 110, layout.height - 96, 220, 56, 'topLeft', 90), {
      label: 'Continue',
      onClick: () => this.finish()
    });
  }

  private renderBackground(assetKey: string): void {
    const layout = getPortraitLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.gameAsBlockmancer.assetSystem.createImageByAssetKey(this, assetKey, 'stageBackground', layout.centerX, layout.centerY, {
      kind: 'background',
      alpha: 0.36
    }).setDisplaySize(layout.width, layout.height);
    this.add.rectangle(layout.centerX, layout.centerY, layout.width, layout.height, 0x050814, 0.72);
  }

  private renderHeader(title: string, subtitle: string, stageId: string, strokeColor: number = COLORS.gold): void {
    const layout = getPortraitLayout(this);
    new UiPanel(this, this.uiSpec('route_header_panel', 'panel', 'ui_panel_dialogue', 'ui_panel_default', layout.centerX - Math.min(layout.contentWidth, 640) / 2, 36, Math.min(layout.contentWidth, 640), 122, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.88,
      strokeColor,
      strokeAlpha: 0.42
    });
    this.add.text(layout.centerX, 72, title, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: isCompactLayout(this) ? '24px' : '30px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 72 },
      stroke: '#090b13',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 122, `${subtitle}  |  ${stageId.replace(/^stage_/, '').replace(/_/g, ' ')}`, {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: isCompactLayout(this) ? '13px' : '15px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 90 }
    }).setOrigin(0.5);
  }

  private renderDialoguePanel(lines: DialogueLine[], y: number, compact: boolean, strokeColor: number = COLORS.gold): void {
    const layout = getPortraitLayout(this);
    const panelWidth = layout.contentWidth - 44;
    new UiPanel(this, this.uiSpec('dialogue_panel', 'panel', 'ui_panel_dialogue', 'ui_panel_default', layout.centerX - panelWidth / 2, y, panelWidth, 246, 'topLeft', 35), {
      fillColor: COLORS.panel,
      fillAlpha: 0.92,
      strokeColor,
      strokeAlpha: 0.4
    });
    this.add.text(layout.centerX, y + 36, this.formatLines(lines), {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '17px' : '20px',
      align: 'center',
      wordWrap: { width: panelWidth - 72 },
      lineSpacing: 7
    }).setOrigin(0.5, 0);
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
      canonicalFolder: type === 'iconSlot' ? 'public/assets/portraits/' : 'public/assets/ui/',
      expectedSourceSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      runtimeRenderSize: { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.max(1, Math.round(w)),
      h: Math.max(1, Math.round(h)),
      anchor,
      fitMode: type === 'iconSlot' ? 'contain' : type === 'button' || type === 'panel' ? 'nineSlice' : 'exact',
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

  private get gameAsBlockmancer(): BlockmancerGame {
    return this.game as BlockmancerGame;
  }
}
