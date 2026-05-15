import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { contentRegistry } from '../systems/ContentRegistry';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

type HeroEntry = {
  id: string;
  name: string;
  className: string;
  description: string;
  portraitKey?: string;
  baseStats: {
    maxHp: number;
    maxMana: number;
    startingGold: number;
    baseLineDamage: number;
    baseFallSpeed: number;
  };
  startingLoadout: {
    weaponId: string;
    spellIds: string[];
  };
  passive: {
    id: string;
    name: string;
    description: string;
  };
};

export class HeroSelectScene extends Phaser.Scene {
  private selectedHeroId: string | null = null;
  private previewCard?: Card;
  private startButton?: Button;

  constructor() {
    super('HeroSelectScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const heroes = contentRegistry.listEnabled<HeroEntry>('hero');
    const compact = isCompactLayout(this);
    const layout = getPortraitLayout(this);

    game.runState.runStatus = 'menu';
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, layout.centerX, 50, layout.contentWidth, 70, {
      title: 'Choose Your Hero',
      titleFontSize: compact ? '24px' : '28px',
      strokeColor: COLORS.accent
    });

    const startY = 140;
    const btnWidth = (layout.contentWidth / 2) - 10;
    
    heroes.forEach((h, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = layout.centerX + (col === 0 ? -(btnWidth/2 + 5) : (btnWidth/2 + 5));
      const y = startY + row * 65;

      const isUnlocked = game.metaSystem.isHeroUnlocked(h.id);
      
      const btn = new Button(this, x, y, btnWidth, 55, h.name, () => {
        this.selectHero(h.id, isUnlocked, h, game);
      }, { iconKey: game.assetSystem.getHeroTexture(this, h.id, isUnlocked ? 'icon' : 'locked') });
      
      if (!isUnlocked) {
        btn.setDisabled(true);
        // Dim or tint
      }
    });

    // Preview Card
    this.previewCard = new Card(this, layout.centerX, 500, layout.contentWidth - 32, 400, {
      title: 'Select a Hero',
      body: '',
      titleColor: '#ffca6b',
      bodyFontSize: compact ? '16px' : '18px',
      strokeColor: COLORS.gold
    });

    this.startButton = new Button(this, layout.centerX, 760, 260, 56, 'Start Run', () => {
      if (this.selectedHeroId) {
        game.newRun(this.selectedHeroId);
        game.runState.runStatus = 'map';
        game.saveRun();
        this.scene.start('MapScene');
      }
    });
    this.startButton.setDisabled(true);

    new Button(this, layout.centerX, 830, 260, 52, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });
    
    // Auto-select milo
    const milo = heroes.find(h => h.id === 'hero_milo_blockmancer') || heroes[0];
    if (milo) {
      this.selectHero(milo.id, game.metaSystem.isHeroUnlocked(milo.id), milo, game);
    }
  }

  private selectHero(id: string, isUnlocked: boolean, hero: HeroEntry | any, game: BlockmancerGame): void {
    this.selectedHeroId = isUnlocked ? id : null;
    this.startButton?.setDisabled(!isUnlocked);
    
    const bodyText = isUnlocked 
      ? [
          hero.description,
          '',
          `HP ${hero.baseStats.maxHp}  Mana ${hero.baseStats.maxMana}  Gold ${hero.baseStats.startingGold}`,
          `Line Damage ${hero.baseStats.baseLineDamage}  Fall Speed ${hero.baseStats.baseFallSpeed.toFixed(2)}x`,
          '',
          `Passive: ${hero.passive.name}`,
          hero.passive.description
        ].join('\n')
      : [
          'LOCKED',
          '',
          `Unlock condition:`,
          hero.unlock?.condition || 'Unknown'
        ].join('\n');

    this.previewCard?.destroy();
    this.previewCard = new Card(this, getPortraitLayout(this).centerX, 500, getPortraitLayout(this).contentWidth - 32, 400, {
      title: hero.name,
      subtitle: isUnlocked ? hero.className : '???',
      body: bodyText,
      imageKey: game.assetSystem.getHeroTexture(this, hero.id, isUnlocked ? 'portrait' : 'locked'),
      imageKind: 'sprite',
      imageSize: 92,
      titleColor: isUnlocked ? '#ffca6b' : '#666666',
      bodyFontSize: isCompactLayout(this) ? '16px' : '18px',
      strokeColor: isUnlocked ? COLORS.gold : COLORS.panelAlt
    });
  }
}
