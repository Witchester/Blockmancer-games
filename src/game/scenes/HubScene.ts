import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

export class HubScene extends Phaser.Scene {
  constructor() {
    super('HubScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const layout = getPortraitLayout(this);
    const compact = isCompactLayout(this);
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, layout.centerX, 96, layout.contentWidth, 120, {
      title: 'Festival Hub',
      body: `Restore booths between runs. Meta gold: ${game.metaSystem.state.totalGoldCollected}`,
      titleColor: '#ffca6b',
      bodyFontSize: compact ? '17px' : '19px',
      strokeColor: COLORS.gold
    });

    game.hubProgressionSystem.listBuildings().slice(0, 8).forEach((building, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = layout.centerX + (col === 0 ? -layout.contentWidth / 4 : layout.contentWidth / 4);
      const y = 230 + row * 132;
      const level = game.metaSystem.state.hubBuildings[building.id] ?? 0;
      const nextLevel = game.hubProgressionSystem.getNextLevel(building.id, game.metaSystem.state);
      const costText = nextLevel ? `Cost: ${game.hubProgressionSystem.formatCost(nextLevel.cost)}` : 'Locked for backlog';
      const effects = game.hubProgressionSystem.getBuildingEffectDescription(building.id, game.metaSystem.state);
      const bodyText = `${building.description}\nCurrent: ${effects.current}\nNext: ${effects.next}\n${costText}`;
      new Card(this, x, y, layout.contentWidth / 2 - 20, 104, {
        title: `${building.name} Lv.${level}`,
        body: bodyText,
        titleFontSize: compact ? '18px' : '20px',
        bodyFontSize: compact ? '14px' : '15px',
        strokeColor: COLORS.accentSoft
      });
      const button = new Button(this, x, y + 58, 128, 36, 'Upgrade', () => {
        const message = game.hubProgressionSystem.upgrade(game.metaSystem.state, building.id);
        game.runState.eventLog.unshift(message);
        game.metaSystem.save();
        this.scene.restart();
      }, { fontSize: '15px' });
      button.setDisabled(!game.hubProgressionSystem.canUpgrade(game.metaSystem.state, building.id));
    });

    new Button(this, layout.centerX, layout.height - 68, 240, 54, 'Back', () => this.scene.start('MainMenuScene'));
  }
}
