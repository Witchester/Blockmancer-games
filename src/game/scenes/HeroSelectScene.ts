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
  constructor() {
    super('HeroSelectScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const heroes = contentRegistry.listEnabled<HeroEntry>('hero');
    const hero = heroes[0];
    const compact = isCompactLayout(this);
    const layout = getPortraitLayout(this);

    game.runState.runStatus = 'menu';
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, {
      title: 'Choose Your Hero',
      subtitle: 'Phase 5 placeholder flow: one hero is playable now, with room for expansion later.',
      titleFontSize: compact ? '30px' : '34px',
      subtitleFontSize: compact ? '16px' : '18px',
      strokeColor: COLORS.accent
    });

    new Card(this, layout.centerX, 430, layout.contentWidth - 64, 430, {
      title: hero.name,
      subtitle: hero.className,
      body: [
        hero.description,
        '',
        `HP ${hero.baseStats.maxHp}  Mana ${hero.baseStats.maxMana}  Gold ${hero.baseStats.startingGold}`,
        `Line Damage ${hero.baseStats.baseLineDamage}  Fall Speed ${hero.baseStats.baseFallSpeed.toFixed(2)}x`,
        '',
        `Passive: ${hero.passive.name}`,
        hero.passive.description
      ].join('\n'),
      titleColor: '#ffca6b',
      bodyFontSize: compact ? '17px' : '19px',
      strokeColor: COLORS.gold
    });

    new Button(this, layout.centerX, 745, 260, 56, 'Select Hero', () => {
      game.runState.hero = {
        id: hero.id,
        name: hero.name,
        className: hero.className,
        passiveId: hero.passive.id,
        unlocked: true
      };
      game.runState.weapon.id = hero.startingLoadout.weaponId;
      game.runState.spells = hero.startingLoadout.spellIds.map((spellId) => {
        switch (spellId) {
          case 'spl_fireball':
            return 'fireball';
          case 'spl_frost_lock':
            return 'frost-lock';
          case 'spl_bomb_rune':
            return 'bomb-rune';
          case 'spl_void_cut':
            return 'void-cut';
          default:
            return 'fireball';
        }
      });
      game.runState.runStatus = 'map';
      game.saveRun();
      this.scene.start('MapScene');
    });

    new Button(this, layout.centerX, 818, 260, 52, 'Back To Menu', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
