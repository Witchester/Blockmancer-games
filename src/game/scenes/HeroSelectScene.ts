import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { contentRegistry } from '../systems/ContentRegistry';
import { UiButton, UiPanel, UiSpriteSlot } from '../ui/components';
import { addOuterBackground, createOuterUiSpec } from '../ui/outer-flow';
import { COLORS, FONT_FAMILY } from '../utils/constants';
import { getPortraitLayout } from '../utils/layout';

type HeroEntry = {
  id: string;
  name: string;
  className: string;
  description: string;
  tagline?: string;
  unlock?: { condition?: string };
  baseStats: {
    maxHp: number;
    maxMana: number;
    startingGold: number;
    baseLineDamage: number;
    baseFallSpeed: number;
  };
  startingLoadout?: {
    weaponId?: string;
    spellIds?: string[];
  };
  passive?: {
    id: string;
    name: string;
    description: string;
  };
};

type HeroCardUi = {
  panel: UiPanel;
  name: Phaser.GameObjects.Text;
  state: Phaser.GameObjects.Text;
  icon: UiSpriteSlot;
  hero: HeroEntry;
  unlocked: boolean;
};

export class HeroSelectScene extends Phaser.Scene {
  private selectedHeroId: string | null = null;
  private startButton?: UiButton;
  private startReasonText?: Phaser.GameObjects.Text;
  private heroCards: HeroCardUi[] = [];
  private detailObjects: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('HeroSelectScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const heroes = contentRegistry.listEnabled<HeroEntry>('hero');
    const layout = getPortraitLayout(this);
    const panelWidth = Math.min(layout.contentWidth, 640);
    const panelLeft = layout.centerX - panelWidth / 2;

    game.runState.runStatus = 'menu';
    this.cameras.main.setBackgroundColor(COLORS.background);
    addOuterBackground(this, 'bg_scene_hero_select', 0.3);

    new UiPanel(this, createOuterUiSpec('hero_select_title_panel', 'panel', 'ui_panel_hero_select', 'ui_panel_default', panelLeft, 38, panelWidth, 104, 'topLeft', 25), {
      fillColor: COLORS.panel,
      fillAlpha: 0.86,
      strokeColor: COLORS.gold
    });
    this.add.text(layout.centerX, 72, 'Choose Your Hero', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '34px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 112, 'Pick your Blockmancer and start the festival dive.', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      align: 'center',
      wordWrap: { width: panelWidth - 52 }
    }).setOrigin(0.5);

    const gridTop = 162;
    const gridHeight = Math.min(316, Math.max(244, Math.floor(layout.height * 0.26)));
    new UiPanel(this, createOuterUiSpec('hero_grid_panel', 'panel', 'ui_panel_hero_select', 'ui_panel_default', panelLeft, gridTop, panelWidth, gridHeight, 'topLeft', 25), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.34,
      strokeColor: COLORS.accentSoft
    });

    const detailTop = gridTop + gridHeight + 16;
    const detailHeight = Math.min(360, layout.height - detailTop - 190);
    new UiPanel(this, createOuterUiSpec('hero_detail_panel', 'panel', 'ui_panel_default', 'placeholder_panel', panelLeft, detailTop, panelWidth, detailHeight, 'topLeft', 25), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.36,
      strokeColor: COLORS.accent
    });

    this.drawHeroGrid(heroes, game, panelLeft + 18, gridTop + 18, panelWidth - 36, gridHeight - 36);
    this.drawActionArea(game, layout.centerX, detailTop + detailHeight + 70, Math.min(420, panelWidth - 90));

    const milo = heroes.find((h) => h.id === 'hero_milo_blockmancer') ?? heroes[0];
    if (milo) {
      this.selectHero(milo, detailTop, panelLeft, panelWidth, detailHeight);
    }
  }

  private drawHeroGrid(heroes: HeroEntry[], game: BlockmancerGame, x: number, y: number, width: number, height: number): void {
    const visibleHeroes = heroes.slice(0, 6);
    const columns = width >= 560 ? 3 : 2;
    const gap = 10;
    const cardW = Math.floor((width - gap * (columns - 1)) / columns);
    const rows = Math.ceil(visibleHeroes.length / columns);
    const cardH = Math.max(86, Math.floor((height - gap * (rows - 1)) / rows));

    visibleHeroes.forEach((hero, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const cardX = x + col * (cardW + gap);
      const cardY = y + row * (cardH + gap);
      const unlocked = game.metaSystem.isHeroUnlocked(hero.id);
      const panel = new UiPanel(this, createOuterUiSpec(`hero_card_${hero.id}`, 'panel', 'ui_hero_card', 'ui_panel_default', cardX, cardY, cardW, cardH, 'topLeft', 40), {
        fillColor: unlocked ? COLORS.panelAlt : 0x363a4f,
        fillAlpha: 0.9,
        strokeColor: unlocked ? COLORS.accentSoft : 0x6b6f85
      });
      const iconSize = Math.min(58, cardH - 22);
      const icon = new UiSpriteSlot(this, createOuterUiSpec(`hero_icon_${hero.id}`, 'spriteSlot', `portrait_${hero.id}`, 'placeholder_portrait', cardX + 12 + iconSize / 2, cardY + cardH / 2, iconSize, iconSize, 'center', 45), {
        spriteKey: game.assetSystem.getHeroTexture(this, hero.id, unlocked ? 'icon' : 'locked'),
        alpha: unlocked ? 1 : 0.72
      });
      const name = this.add.text(cardX + iconSize + 24, cardY + 14, hero.name, {
        color: unlocked ? '#f6f7ff' : '#b1b5c9',
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        fontStyle: 'bold',
        wordWrap: { width: cardW - iconSize - 34 }
      });
      const state = this.add.text(cardX + iconSize + 24, cardY + cardH - 16, unlocked ? 'READY' : 'LOCKED', {
        color: unlocked ? '#65d6a5' : '#ff9aa6',
        fontFamily: FONT_FAMILY,
        fontSize: '11px',
        fontStyle: 'bold'
      }).setOrigin(0, 1);

      panel.root.setInteractive(new Phaser.Geom.Rectangle(0, 0, cardW, cardH), Phaser.Geom.Rectangle.Contains);
      panel.root.on('pointerdown', () => this.selectHero(hero));
      this.heroCards.push({ panel, name, state, icon, hero, unlocked });
    });
  }

  private drawActionArea(game: BlockmancerGame, centerX: number, y: number, width: number): void {
    this.startButton = new UiButton(this, createOuterUiSpec('select_hero_button', 'button', 'ui_button_new_run', 'ui_button_default', centerX, y, width, 58, 'center', 90), {
      label: 'Start Run',
      onClick: () => {
        if (!this.selectedHeroId) return;
        game.newRun(this.selectedHeroId);
        game.runState.runStatus = 'map';
        game.saveRun();
        this.scene.start('MapScene');
      }
    });
    new UiButton(this, createOuterUiSpec('hero_select_back_button', 'button', 'ui_button_back', 'ui_button_default', centerX, y + 70, width, 54, 'center', 90), {
      label: 'Back To Menu',
      onClick: () => this.scene.start('MainMenuScene')
    });
    this.startReasonText = this.add.text(centerX, y - 44, '', {
      color: '#ffb9c0',
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      align: 'center'
    }).setOrigin(0.5);
  }

  private selectHero(hero: HeroEntry, detailTop?: number, panelLeft?: number, panelWidth?: number, detailHeight?: number): void {
    const game = this.game as BlockmancerGame;
    const layout = getPortraitLayout(this);
    const resolvedPanelWidth = panelWidth ?? Math.min(layout.contentWidth, 640);
    const resolvedPanelLeft = panelLeft ?? layout.centerX - resolvedPanelWidth / 2;
    const resolvedDetailTop = detailTop ?? Math.min(494, layout.height * 0.42);
    const resolvedDetailHeight = detailHeight ?? 340;
    const unlocked = game.metaSystem.isHeroUnlocked(hero.id);
    this.selectedHeroId = unlocked ? hero.id : null;

    this.heroCards.forEach((card) => {
      const selected = card.hero.id === hero.id;
      card.panel.setState(selected ? 'selected' : card.unlocked ? 'default' : 'locked');
      card.name.setColor(selected ? '#fff5cf' : card.unlocked ? '#f6f7ff' : '#b1b5c9');
      card.state.setText(card.unlocked ? (selected ? 'SELECTED' : 'READY') : 'LOCKED');
      card.icon.setState(selected ? 'selected' : card.unlocked ? 'default' : 'locked');
    });
    this.startButton?.setEnabled(unlocked);
    this.startReasonText?.setText(unlocked ? '' : 'Unlock this hero first.');
    this.renderHeroDetails(hero, unlocked, game, resolvedPanelLeft, resolvedDetailTop, resolvedPanelWidth, resolvedDetailHeight);
  }

  private renderHeroDetails(hero: HeroEntry, unlocked: boolean, game: BlockmancerGame, x: number, y: number, width: number, height: number): void {
    this.detailObjects.forEach((obj) => obj.destroy());
    this.detailObjects = [];
    const addObj = <T extends Phaser.GameObjects.GameObject>(obj: T): T => {
      this.detailObjects.push(obj);
      return obj;
    };

    const portraitSize = Math.min(172, height - 36);
    const portrait = new UiSpriteSlot(this, createOuterUiSpec('hero_detail_portrait', 'spriteSlot', `portrait_${hero.id}`, 'placeholder_portrait', x + 24 + portraitSize / 2, y + 24 + portraitSize / 2, portraitSize, portraitSize, 'center', 50), {
      spriteKey: game.assetSystem.getHeroTexture(this, hero.id, unlocked ? 'portrait' : 'locked')
    });
    addObj(portrait.root);

    const textX = x + portraitSize + 52;
    const textWidth = Math.max(190, width - portraitSize - 76);
    addObj(this.add.text(textX, y + 24, hero.name, {
      color: unlocked ? '#ffca6b' : '#c7cadb',
      fontFamily: FONT_FAMILY,
      fontSize: '26px',
      fontStyle: 'bold',
      wordWrap: { width: textWidth }
    }));
    addObj(this.add.text(textX, y + 58, unlocked ? hero.className : 'Locked Hero', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: '16px'
    }));
    const desc = unlocked ? (hero.tagline ?? hero.description) : this.getUnlockCondition(hero.id, hero);
    addObj(this.add.text(textX, y + 86, desc, {
      color: unlocked ? '#d8deff' : '#ffb9c0',
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      wordWrap: { width: textWidth },
      lineSpacing: 4
    }));

    const statsText = [
      `HP ${hero.baseStats.maxHp}`,
      `Mana ${hero.baseStats.maxMana}`,
      `Gold ${hero.baseStats.startingGold}`,
      `Line Damage ${hero.baseStats.baseLineDamage}`,
      `Fall ${hero.baseStats.baseFallSpeed.toFixed(2)}x`
    ].join('   ');
    addObj(this.add.text(x + 24, y + height - 92, statsText, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      wordWrap: { width: width - 48 }
    }));

    const passive = hero.passive ? `${hero.passive.name}: ${hero.passive.description}` : 'Default starter passive.';
    addObj(this.add.text(x + 24, y + height - 58, passive, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      wordWrap: { width: width - 48 }
    }));
  }

  private getUnlockCondition(heroId: string, hero: HeroEntry): string {
    if (hero.unlock?.condition) {
      return 'Locked: ' + hero.unlock.condition;
    }

    const fallback: Record<string, string> = {
      hero_milo_blockmancer: 'Available by default.',
      hero_pippa_pyromancer: 'Locked: Defeat Stage 1 Boss.',
      hero_zuzu_goblin_engineer: 'Locked: Defeat Stage 2 Boss.',
      hero_bruk_snack_knight: 'Locked: Collect 500 total gold.',
      hero_lumi_star_witch: 'Locked: Trigger 10 cascade combos.',
      hero_nixie_frostbinder: 'Locked: Trigger 6 total cascades.',
      hero_poplin_professor: 'Locked: Complete a normal ending.',
      hero_bloop_slime_friend: 'Locked: Defeat 4 bosses.'
    };
    return fallback[heroId] ?? 'Locked: Complete more festival progress.';
  }
}
