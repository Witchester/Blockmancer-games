import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, MAX_EVENT_LOG } from '../utils/constants';
import { isCompactLayout } from '../utils/layout';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const compact = isCompactLayout(this);
    game.runState.runStatus = 'map';
    game.runState.currentRoomProgress = 'entered';
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, 640, 400, compact ? 1100 : 1040, 660, {
      title: 'Dungeon Shop',
      body: 'A crooked merchant offers immediate bargains and questionable remedies.',
      titleColor: '#ffca6b',
      bodyFontSize: compact ? '20px' : '22px',
      strokeColor: COLORS.accent
    });

    this.createOption(compact, compact ? 280 : 300, 'Heal 8 HP', 'Cost: 30 gold', () => {
      this.resolveShopAction(game.shopSystem.healForGold(game.runState));
    });

    this.createOption(compact, compact ? 390 : 430, 'Buy Random Reward', 'Cost: 60 gold', () => {
      this.resolveShopAction(game.shopSystem.buyRandomReward(game.runState));
    });

    this.createOption(compact, compact ? 500 : 560, 'Remove Curse', 'Cost: 50 gold', () => {
      this.resolveShopAction(game.shopSystem.removeCurse(game.runState));
    });

    this.createOption(compact, compact ? 610 : 690, 'Leave', 'Keep your gold.', () => {
      this.resolveShopAction(game.shopSystem.leave());
    });
  }

  private createOption(compact: boolean, y: number, title: string, subtitle: string, action: () => void): void {
    new Card(this, compact ? 600 : 640, y, compact ? 760 : 760, compact ? 84 : 90, {
      title,
      body: subtitle,
      titleFontSize: compact ? '22px' : '26px',
      bodyFontSize: compact ? '16px' : '18px',
      strokeColor: COLORS.gold
    });
    new Button(this, compact ? 1020 : 950, y, compact ? 132 : 140, 44, 'Select', action);
  }

  private exitToMap(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    game.mapSystem.completeNode(state, state.currentNodeId);
    state.runStatus = 'map';
    game.saveRun();
    this.scene.start('MapScene');
  }

  private resolveShopAction(resolution: { transition: 'stay' | 'map'; messages: string[] }): void {
    resolution.messages.forEach((message) => this.log(message));
    if (resolution.transition === 'map') {
      this.exitToMap();
    }
  }

  private log(message: string): void {
    const state = (this.game as BlockmancerGame).runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }
}
