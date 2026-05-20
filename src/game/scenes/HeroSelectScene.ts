import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { contentRegistry } from '../systems/ContentRegistry';
import { Button } from '../ui/Button';
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

type Rect = { x: number; y: number; width: number; height: number };

type HeroSelectLayout = {
  screen: Rect;
  safe: Rect;
  titleArea: Rect;
  heroGridArea: Rect;
  heroCards: Rect[];
  detailArea: Rect;
  portraitArea: Rect;
  heroInfoArea: Rect;
  statsArea: Rect;
  passiveArea: Rect;
  loadoutArea: Rect;
  actionArea: Rect;
  startButton: Rect;
  backButton: Rect;
  scaleMode: 'full' | 'compact' | 'tiny';
};

type HeroCardUI = {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  name: Phaser.GameObjects.Text;
  role: Phaser.GameObjects.Text;
  state: Phaser.GameObjects.Text;
  lockReason: Phaser.GameObjects.Text;
  icon: Phaser.GameObjects.Image;
  hero: HeroEntry;
  unlocked: boolean;
};

export class HeroSelectScene extends Phaser.Scene {
  private selectedHeroId: string | null = null;
  private selectedHeroUnlocked = false;
  private startButton?: Button;
  private startReasonText?: Phaser.GameObjects.Text;
  private heroCards: HeroCardUI[] = [];
  private detailObjects: Phaser.GameObjects.GameObject[] = [];
  private layout?: HeroSelectLayout;

  constructor() {
    super('HeroSelectScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const heroes = contentRegistry.listEnabled<HeroEntry>('hero');
    const viewport = getPortraitLayout(this);

    this.layout = this.calculateHeroSelectLayout(viewport.width, viewport.height, { top: 0, right: 0, bottom: 0, left: 0 }, heroes.length);
    if (!this.validateHeroSelectLayout(this.layout)) {
      if (import.meta.env.DEV) {
        console.warn('[HeroSelect] Invalid layout detected; using compact fallback pass.');
      }
      this.layout = this.calculateHeroSelectLayout(viewport.width, viewport.height, { top: 0, right: 0, bottom: 0, left: 0 }, heroes.length);
    }

    game.runState.runStatus = 'menu';
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.drawBackground(this.layout);
    this.drawTitle(this.layout);
    this.drawHeroGrid(this.layout, heroes, game);
    this.drawActionArea(this.layout, game);

    const milo = heroes.find((h) => h.id === 'hero_milo_blockmancer') ?? heroes[0];
    if (milo) {
      this.selectHero(milo);
    }
  }

  private calculateHeroSelectLayout(width: number, height: number, safeArea: { top: number; right: number; bottom: number; left: number }, heroCount: number): HeroSelectLayout {
    const scaleMode: 'full' | 'compact' | 'tiny' = width >= 760 ? 'full' : width >= 520 ? 'compact' : 'tiny';
    const outerPadding = scaleMode === 'full' ? 16 : scaleMode === 'compact' ? 12 : 8;

    const availableX = safeArea.left + outerPadding;
    const availableY = safeArea.top + outerPadding;
    const availableW = width - safeArea.left - safeArea.right - outerPadding * 2;
    const availableH = height - safeArea.top - safeArea.bottom - outerPadding * 2;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const sectionGap = scaleMode === 'tiny' ? 8 : 10;

    const titleH = Math.floor(clamp(availableH * 0.09, 56, 90));
    const gridH = Math.floor(clamp(availableH * 0.28, 180, 320));
    const actionH = Math.floor(clamp(availableH * 0.17, 140, 220));
    const detailH = Math.max(220, availableH - titleH - gridH - actionH - sectionGap * 3);

    const titleArea: Rect = { x: availableX, y: availableY, width: availableW, height: titleH };
    const heroGridArea: Rect = { x: availableX, y: titleArea.y + titleArea.height + sectionGap, width: availableW, height: gridH };
    const detailArea: Rect = { x: availableX, y: heroGridArea.y + heroGridArea.height + sectionGap, width: availableW, height: detailH };
    const actionArea: Rect = { x: availableX, y: detailArea.y + detailArea.height + sectionGap, width: availableW, height: actionH };

    const cardGap = scaleMode === 'tiny' ? 8 : 10;
    const minCardW = scaleMode === 'tiny' ? 150 : 200;
    const columns = scaleMode === 'tiny' && availableW < 360 ? 1 : 2;
    const cardW = columns === 1
      ? heroGridArea.width
      : Math.floor((heroGridArea.width - cardGap) / 2);
    const cardH = Math.floor(clamp((heroGridArea.height - (Math.ceil(heroCount / columns) - 1) * cardGap) / Math.ceil(heroCount / columns), 76, 118));
    const heroCards: Rect[] = [];
    for (let i = 0; i < heroCount; i += 1) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const w = Math.max(minCardW, cardW);
      const x = heroGridArea.x + (columns === 1 ? 0 : col * (cardW + cardGap));
      heroCards.push({ x, y: heroGridArea.y + row * (cardH + cardGap), width: columns === 1 ? heroGridArea.width : cardW, height: cardH });
    }

    const detailPad = scaleMode === 'tiny' ? 8 : 12;
    const detailGap = scaleMode === 'tiny' ? 8 : 10;
    const leftW = Math.floor(detailArea.width * (scaleMode === 'tiny' ? 0.32 : 0.34));
    const portraitArea: Rect = { x: detailArea.x + detailPad, y: detailArea.y + detailPad, width: leftW - detailPad, height: Math.floor(detailArea.height * 0.44) };
    const loadoutArea: Rect = { x: detailArea.x + detailPad, y: portraitArea.y + portraitArea.height + detailGap, width: leftW - detailPad, height: detailArea.y + detailArea.height - detailPad - (portraitArea.y + portraitArea.height + detailGap) };
    const rightX = detailArea.x + leftW + detailGap;
    const rightW = detailArea.width - leftW - detailPad - detailGap;
    const heroInfoArea: Rect = { x: rightX, y: detailArea.y + detailPad, width: rightW, height: Math.floor(detailArea.height * 0.34) };
    const statsArea: Rect = { x: rightX, y: heroInfoArea.y + heroInfoArea.height + detailGap, width: rightW, height: Math.floor(detailArea.height * 0.26) };
    const passiveArea: Rect = { x: rightX, y: statsArea.y + statsArea.height + detailGap, width: rightW, height: detailArea.y + detailArea.height - detailPad - (statsArea.y + statsArea.height + detailGap) };

    const buttonGap = 10;
    const buttonW = Math.floor(actionArea.width * 0.84);
    const buttonH = Math.floor(clamp(actionArea.height * 0.38, 56, 74));
    const startButton: Rect = { x: actionArea.x + Math.floor((actionArea.width - buttonW) / 2), y: actionArea.y + 8, width: buttonW, height: buttonH };
    const backButton: Rect = { x: actionArea.x + Math.floor((actionArea.width - buttonW) / 2), y: startButton.y + buttonH + buttonGap, width: buttonW, height: buttonH };

    return {
      screen: { x: 0, y: 0, width, height },
      safe: { x: availableX, y: availableY, width: availableW, height: availableH },
      titleArea,
      heroGridArea,
      heroCards,
      detailArea,
      portraitArea,
      heroInfoArea,
      statsArea,
      passiveArea,
      loadoutArea,
      actionArea,
      startButton,
      backButton,
      scaleMode
    };
  }

  private validateHeroSelectLayout(layout: HeroSelectLayout): boolean {
    const validRect = (r: Rect) => r.width > 0 && r.height > 0;
    const contains = (outer: Rect, inner: Rect) => inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;
    const noOverlapY = (a: Rect, b: Rect) => a.y + a.height <= b.y || b.y + b.height <= a.y;

    if (![layout.safe, layout.titleArea, layout.heroGridArea, layout.detailArea, layout.actionArea, layout.startButton, layout.backButton].every(validRect)) return false;
    if (!noOverlapY(layout.titleArea, layout.heroGridArea) || !noOverlapY(layout.heroGridArea, layout.detailArea) || !noOverlapY(layout.detailArea, layout.actionArea)) return false;
    if (!layout.heroCards.every((r) => validRect(r) && contains(layout.heroGridArea, r))) return false;
    if (![layout.portraitArea, layout.heroInfoArea, layout.statsArea, layout.passiveArea, layout.loadoutArea].every((r) => validRect(r) && contains(layout.detailArea, r))) return false;
    if (!contains(layout.actionArea, layout.startButton) || !contains(layout.actionArea, layout.backButton)) return false;
    return true;
  }

  private drawBackground(layout: HeroSelectLayout): void {
    this.add.rectangle(layout.safe.x + layout.safe.width / 2, layout.safe.y + layout.safe.height / 2, layout.safe.width, layout.safe.height, COLORS.panel, 0.18);
    this.add.rectangle(layout.heroGridArea.x + layout.heroGridArea.width / 2, layout.heroGridArea.y + layout.heroGridArea.height / 2, layout.heroGridArea.width, layout.heroGridArea.height, COLORS.panelAlt, 0.32).setStrokeStyle(2, COLORS.accentSoft, 0.25);
    this.add.rectangle(layout.detailArea.x + layout.detailArea.width / 2, layout.detailArea.y + layout.detailArea.height / 2, layout.detailArea.width, layout.detailArea.height, COLORS.panelAlt, 0.34).setStrokeStyle(2, COLORS.accent, 0.28);
    this.add.rectangle(layout.actionArea.x + layout.actionArea.width / 2, layout.actionArea.y + layout.actionArea.height / 2, layout.actionArea.width, layout.actionArea.height, COLORS.panelAlt, 0.24).setStrokeStyle(1, COLORS.accentSoft, 0.3);
  }

  private drawTitle(layout: HeroSelectLayout): void {
    this.add.text(layout.titleArea.x + layout.titleArea.width / 2, layout.titleArea.y + 6, 'Choose Your Hero', {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'full' ? '38px' : layout.scaleMode === 'compact' ? '32px' : '26px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.add.text(layout.titleArea.x + layout.titleArea.width / 2, layout.titleArea.y + layout.titleArea.height - 4, 'Pick your Blockmancer and start the festival dive.', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '14px' : '16px'
    }).setOrigin(0.5, 1);
  }

  private drawHeroGrid(layout: HeroSelectLayout, heroes: HeroEntry[], game: BlockmancerGame): void {
    this.heroCards.forEach((card) => card.container.destroy());
    this.heroCards = [];

    heroes.forEach((hero, index) => {
      const cardRect = layout.heroCards[index];
      if (!cardRect) return;
      const unlocked = game.metaSystem.isHeroUnlocked(hero.id);

      const container = this.add.container(cardRect.x, cardRect.y);
      const bg = this.add.rectangle(cardRect.width / 2, cardRect.height / 2, cardRect.width, cardRect.height, COLORS.panelAlt, 0.96)
        .setStrokeStyle(2, unlocked ? COLORS.accentSoft : 0x6b6f85, 0.75)
        .setOrigin(0.5);

      const iconSize = Math.floor(Math.min(cardRect.height - 18, 62));
      const icon = game.assetSystem.addImage(this, 14 + iconSize / 2, cardRect.height / 2, game.assetSystem.getHeroTexture(this, hero.id, unlocked ? 'icon' : 'locked'), 'sprite');
      icon.setDisplaySize(iconSize, iconSize);

      const name = this.add.text(28 + iconSize, 12, hero.name, {
        color: unlocked ? '#f6f7ff' : '#b1b5c9',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '16px' : '18px',
        fontStyle: 'bold',
        wordWrap: { width: cardRect.width - (38 + iconSize) - 8 }
      }).setOrigin(0, 0);

      const role = this.add.text(28 + iconSize, cardRect.height / 2 - 2, hero.className, {
        color: unlocked ? '#98a0c7' : '#8085a1',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '13px' : '14px'
      }).setOrigin(0, 0.5);

      const state = this.add.text(cardRect.width - 10, 10, unlocked ? 'READY' : 'LOCKED', {
        color: unlocked ? '#65d6a5' : '#ff9aa6',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '11px' : '12px',
        fontStyle: 'bold'
      }).setOrigin(1, 0);

      const lockReason = this.add.text(28 + iconSize, cardRect.height - 10, unlocked ? '' : this.getUnlockCondition(hero.id, hero), {
        color: '#ffb9c0',
        fontFamily: FONT_FAMILY,
        fontSize: layout.scaleMode === 'tiny' ? '11px' : '12px',
        wordWrap: { width: cardRect.width - (38 + iconSize) - 8 }
      }).setOrigin(0, 1);

      container.add([bg, icon, name, role, state, lockReason]);
      container.setSize(cardRect.width, cardRect.height);
      container.setInteractive(new Phaser.Geom.Rectangle(0, 0, cardRect.width, cardRect.height), Phaser.Geom.Rectangle.Contains);
      container.on('pointerdown', () => this.selectHero(hero));

      this.heroCards.push({ container, bg, name, role, state, lockReason, icon, hero, unlocked });
    });

    this.refreshHeroCardStates();
  }

  private drawActionArea(layout: HeroSelectLayout, game: BlockmancerGame): void {
    this.startButton = new Button(
      this,
      layout.startButton.x + layout.startButton.width / 2,
      layout.startButton.y + layout.startButton.height / 2,
      layout.startButton.width,
      layout.startButton.height,
      'Start Run',
      () => {
        if (!this.selectedHeroId) return;
        game.newRun(this.selectedHeroId);
        game.runState.runStatus = 'map';
        game.saveRun();
        this.scene.start('MapScene');
      },
      { fontSize: layout.scaleMode === 'tiny' ? '18px' : '20px' }
    );

    new Button(
      this,
      layout.backButton.x + layout.backButton.width / 2,
      layout.backButton.y + layout.backButton.height / 2,
      layout.backButton.width,
      layout.backButton.height,
      'Back To Menu',
      () => this.scene.start('MainMenuScene'),
      { fontSize: layout.scaleMode === 'tiny' ? '16px' : '18px' }
    );

    this.startReasonText = this.add.text(layout.actionArea.x + layout.actionArea.width / 2, layout.actionArea.y + 2, '', {
      color: '#ffb9c0',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '13px' : '14px'
    }).setOrigin(0.5, 0);
  }

  private selectHero(hero: HeroEntry): void {
    const game = this.game as BlockmancerGame;
    this.selectedHeroUnlocked = game.metaSystem.isHeroUnlocked(hero.id);
    this.selectedHeroId = this.selectedHeroUnlocked ? hero.id : null;

    this.refreshHeroCardStates();
    this.renderHeroDetails(hero, this.selectedHeroUnlocked, game);
    this.startButton?.setDisabled(!this.selectedHeroUnlocked);
    this.startReasonText?.setText(this.selectedHeroUnlocked ? '' : 'Unlock this hero first.');
  }

  private refreshHeroCardStates(): void {
    const selectedId = this.selectedHeroId;
    this.heroCards.forEach((card) => {
      const selected = selectedId ? card.hero.id === selectedId : false;
      const fill = card.unlocked ? (selected ? COLORS.accentSoft : COLORS.panelAlt) : 0x363a4f;
      const stroke = selected ? COLORS.gold : card.unlocked ? COLORS.accentSoft : 0x6b6f85;
      card.bg.setFillStyle(fill, selected ? 0.98 : 0.92).setStrokeStyle(2, stroke, 0.95);
      card.name.setColor(selected ? '#fff5cf' : card.unlocked ? '#f6f7ff' : '#b1b5c9');
      card.state.setText(card.unlocked ? (selected ? 'SELECTED' : 'READY') : 'LOCKED');
      card.icon.setAlpha(card.unlocked ? 1 : 0.7);
    });
  }

  private renderHeroDetails(hero: HeroEntry, unlocked: boolean, game: BlockmancerGame): void {
    const layout = this.layout;
    if (!layout) return;

    this.detailObjects.forEach((obj) => obj.destroy());
    this.detailObjects = [];

    const addObj = <T extends Phaser.GameObjects.GameObject>(obj: T): T => {
      this.detailObjects.push(obj);
      return obj;
    };

    addObj(this.add.rectangle(layout.portraitArea.x + layout.portraitArea.width / 2, layout.portraitArea.y + layout.portraitArea.height / 2, layout.portraitArea.width, layout.portraitArea.height, COLORS.panel, 0.95).setStrokeStyle(2, COLORS.accentSoft, 0.5));
    const portrait = game.assetSystem.addImage(this, layout.portraitArea.x + layout.portraitArea.width / 2, layout.portraitArea.y + layout.portraitArea.height / 2, game.assetSystem.getHeroTexture(this, hero.id, unlocked ? 'portrait' : 'locked'), 'sprite');
    game.assetSystem.fitSpriteToBox(portrait, layout.portraitArea.width - 12, layout.portraitArea.height - 12);
    addObj(portrait);

    addObj(this.add.rectangle(layout.heroInfoArea.x + layout.heroInfoArea.width / 2, layout.heroInfoArea.y + layout.heroInfoArea.height / 2, layout.heroInfoArea.width, layout.heroInfoArea.height, COLORS.panel, 0.94).setStrokeStyle(1, COLORS.accentSoft, 0.45));
    addObj(this.add.text(layout.heroInfoArea.x + 10, layout.heroInfoArea.y + 8, hero.name, {
      color: unlocked ? '#ffca6b' : '#c7cadb',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '22px' : '26px',
      fontStyle: 'bold',
      wordWrap: { width: layout.heroInfoArea.width - 20 }
    }));
    addObj(this.add.text(layout.heroInfoArea.x + 10, layout.heroInfoArea.y + 40, unlocked ? hero.className : 'Locked Hero', {
      color: '#98a0c7',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '14px' : '16px'
    }));

    const desc = unlocked
      ? (hero.tagline ?? hero.description).split('.').slice(0, 2).join('. ').trim()
      : this.getUnlockCondition(hero.id, hero);
    addObj(this.add.text(layout.heroInfoArea.x + 10, layout.heroInfoArea.y + 64, desc || hero.description, {
      color: unlocked ? '#d8deff' : '#ffb9c0',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '13px' : '14px',
      wordWrap: { width: layout.heroInfoArea.width - 20 },
      lineSpacing: 3
    }));

    addObj(this.add.rectangle(layout.statsArea.x + layout.statsArea.width / 2, layout.statsArea.y + layout.statsArea.height / 2, layout.statsArea.width, layout.statsArea.height, COLORS.panel, 0.94).setStrokeStyle(1, COLORS.accentSoft, 0.45));
    const stats = [
      ['HP', String(hero.baseStats.maxHp)],
      ['Mana', String(hero.baseStats.maxMana)],
      ['Gold', String(hero.baseStats.startingGold)],
      ['Line Dmg', String(hero.baseStats.baseLineDamage)],
      ['Fall', hero.baseStats.baseFallSpeed.toFixed(2) + 'x']
    ];
    const chipGap = 6;
    const chipW = Math.floor((layout.statsArea.width - 22 - chipGap) / 2);
    const chipH = Math.floor((layout.statsArea.height - 20 - chipGap * 2) / 3);
    stats.forEach((entry, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = layout.statsArea.x + 10 + col * (chipW + chipGap);
      const y = layout.statsArea.y + 8 + row * (chipH + chipGap);
      addObj(this.add.rectangle(x + chipW / 2, y + chipH / 2, chipW, chipH, COLORS.panelAlt, 0.96).setStrokeStyle(1, COLORS.accent, 0.3));
      addObj(this.add.text(x + 6, y + 4, entry[0], { color: '#98a0c7', fontFamily: FONT_FAMILY, fontSize: layout.scaleMode === 'tiny' ? '11px' : '12px' }));
      addObj(this.add.text(x + chipW - 6, y + chipH - 4, entry[1], { color: '#f6f7ff', fontFamily: FONT_FAMILY, fontSize: layout.scaleMode === 'tiny' ? '13px' : '14px', fontStyle: 'bold' }).setOrigin(1, 1));
    });

    addObj(this.add.rectangle(layout.passiveArea.x + layout.passiveArea.width / 2, layout.passiveArea.y + layout.passiveArea.height / 2, layout.passiveArea.width, layout.passiveArea.height, 0x27324f, 0.96).setStrokeStyle(1, COLORS.gold, 0.45));
    const passiveName = hero.passive?.name ?? 'Festival Instinct';
    const passiveDesc = unlocked ? (hero.passive?.description ?? 'Default starter passive.') : 'Unlock this hero to use their passive.';
    addObj(this.add.text(layout.passiveArea.x + 10, layout.passiveArea.y + 8, 'Passive · ' + passiveName, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '14px' : '16px',
      fontStyle: 'bold',
      wordWrap: { width: layout.passiveArea.width - 20 }
    }));
    addObj(this.add.text(layout.passiveArea.x + 10, layout.passiveArea.y + 30, passiveDesc, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '12px' : '13px',
      wordWrap: { width: layout.passiveArea.width - 20 },
      lineSpacing: 3
    }));

    addObj(this.add.rectangle(layout.loadoutArea.x + layout.loadoutArea.width / 2, layout.loadoutArea.y + layout.loadoutArea.height / 2, layout.loadoutArea.width, layout.loadoutArea.height, COLORS.panel, 0.92).setStrokeStyle(1, COLORS.accentSoft, 0.4));
    const weaponName = hero.startingLoadout?.weaponId ? (contentRegistry.getWeapon(hero.startingLoadout.weaponId) as { name?: string } | null)?.name ?? hero.startingLoadout.weaponId : 'Default Wand';
    const spellNames = (hero.startingLoadout?.spellIds ?? []).slice(0, 3).map((id) => (contentRegistry.getSpell(id) as { name?: string } | null)?.name ?? id);
    addObj(this.add.text(layout.loadoutArea.x + 8, layout.loadoutArea.y + 8, 'Loadout', { color: '#98a0c7', fontFamily: FONT_FAMILY, fontSize: layout.scaleMode === 'tiny' ? '12px' : '13px', fontStyle: 'bold' }));
    addObj(this.add.text(layout.loadoutArea.x + 8, layout.loadoutArea.y + 24, 'Weapon: ' + weaponName, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '11px' : '12px',
      wordWrap: { width: layout.loadoutArea.width - 16 }
    }));
    addObj(this.add.text(layout.loadoutArea.x + 8, layout.loadoutArea.y + 42, 'Spells: ' + (spellNames.length ? spellNames.join(', ') : 'Default starter loadout'), {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: layout.scaleMode === 'tiny' ? '11px' : '12px',
      wordWrap: { width: layout.loadoutArea.width - 16 }
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
