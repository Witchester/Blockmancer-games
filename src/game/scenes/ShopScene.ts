import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const compact = isCompactLayout(this);
    const layout = getPortraitLayout(this);
    game.runState.runStatus = 'map';
    game.runState.currentRoomProgress = 'entered';
    this.cameras.main.setBackgroundColor(COLORS.background);

    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, {
      title: 'Dungeon Shop',
      titleColor: '#ffca6b',
      strokeColor: COLORS.accent
    });
    this.add.text(layout.centerX, 220, 'A snack merchant offers bright bargains and questionable remedies.', {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '20px' : '22px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 80 },
      lineSpacing: 6
    }).setOrigin(0.5);

    this.add.text(layout.centerX, 270, `Gold ${game.runState.player.gold}   HP ${game.runState.player.hp}/${game.runState.player.maxHp}   Bag ${game.runState.inventory.length}/${game.runState.player.inventoryCapacity}   Oopsies ${game.runState.player.oopsies.length}`, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '20px' : '22px',
      align: 'center'
    }).setOrigin(0.5);

    this.createOption(compact, 340, 'Heal 8 HP', `Cost: ${game.oopsieSystem.adjustShopPrice(game.runState, 30)} gold`, () => {
      this.resolveShopAction(game.shopSystem.healForGold(game.runState));
    });

    this.createOption(compact, 456, 'Buy Random Reward', `Cost: ${game.oopsieSystem.adjustShopPrice(game.runState, 60)} gold`, () => {
      this.resolveShopAction(game.shopSystem.buyRandomReward(game.runState));
    });

    this.createOption(compact, 572, 'Buy Item', `Cost: ${game.oopsieSystem.adjustShopPrice(game.runState, 25)} gold`, () => {
      this.resolveShopAction(game.shopSystem.buyItem(game.runState));
    });

    this.createOption(compact, 688, 'Remove Oopsie', `Cost: ${game.oopsieSystem.getRemovalCost(game.runState)} gold`, () => {
      this.resolveShopAction(game.shopSystem.removeOopsie(game.runState));
    });

    this.createOption(compact, 804, 'Leave', 'Return to the map.', () => {
      this.resolveShopAction(game.shopSystem.leave());
    });
  }

  private createOption(compact: boolean, y: number, title: string, subtitle: string, action: () => void): void {
    const layout = getPortraitLayout(this);
    new Card(this, layout.centerX - 64, y, layout.contentWidth - 180, 104, {
      title,
      body: subtitle,
      titleFontSize: compact ? '24px' : '26px',
      bodyFontSize: compact ? '18px' : '20px',
      strokeColor: COLORS.gold
    });
    new Button(this, layout.width - 92, y, 116, 56, 'Select', action);
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
    const game = this.game as BlockmancerGame;
    resolution.messages.forEach((message) => this.log(message));
    if (resolution.transition === 'stay') {
      game.audioSystem.play('shop_purchase', this);
    }
    if (resolution.transition === 'map') {
      this.exitToMap();
      return;
    }

    game.saveRun();
    this.scene.restart();
  }

  private log(message: string): void {
    const state = (this.game as BlockmancerGame).runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }
}
