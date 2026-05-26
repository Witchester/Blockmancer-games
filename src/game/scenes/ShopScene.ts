import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { UiComponentSpec } from '../types/ui-layout';
import { UiButton, UiIconSlot, UiPanel } from '../ui/components';
import { createShopViewModel, type ShopActionId, type ShopOptionViewModel } from '../ui/shop';
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
    const panelWidth = Math.min(layout.contentWidth, 640);
    const panelLeft = layout.centerX - panelWidth / 2;
    const model = createShopViewModel(game, game.runState);

    game.runState.runStatus = 'map';
    game.runState.currentRoomProgress = 'entered';
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.addShopBackdrop();

    new UiPanel(this, this.uiSpec('shop_header_panel', 'panel', 'ui_panel_shop', 'ui_panel_default', panelLeft, 48, panelWidth, 132, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.78,
      strokeColor: COLORS.gold
    });
    this.add.text(layout.centerX, 82, model.title, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '30px' : '34px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    this.add.text(layout.centerX, 128, model.subtitle, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '17px' : '19px',
      align: 'center',
      wordWrap: { width: panelWidth - 64 }
    }).setOrigin(0.5);

    new UiPanel(this, this.uiSpec('shop_goods_panel', 'panel', 'ui_panel_default', 'placeholder_panel', panelLeft, 204, panelWidth, 642, 'topLeft', 30), {
      fillColor: COLORS.panel,
      fillAlpha: 0.86,
      strokeColor: COLORS.accent
    });
    this.add.text(layout.centerX, 236, model.statsText, {
      color: '#ffca6b',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '16px' : '18px',
      align: 'center',
      wordWrap: { width: panelWidth - 56 }
    }).setOrigin(0.5);

    model.options.forEach((option, index) => {
      this.renderShopOption(option, panelLeft + 26, 282 + index * 104, panelWidth - 52, compact);
    });
  }

  private renderShopOption(option: ShopOptionViewModel, x: number, y: number, width: number, compact: boolean): void {
    const rowHeight = 88;
    new UiPanel(this, this.uiSpec(`shop_item_card_${option.id}`, 'panel', 'ui_shop_item_card', 'ui_panel_default', x, y, width, rowHeight, 'topLeft', 45), {
      fillColor: COLORS.panelAlt,
      fillAlpha: 0.82,
      strokeColor: option.disabled ? 0x555a75 : COLORS.gold,
      strokeAlpha: option.disabled ? 0.28 : 0.42
    }).setState(option.disabled ? 'disabled' : 'default');
    new UiIconSlot(
      this,
      this.uiSpec(`shop_item_icon_${option.id}`, 'iconSlot', option.iconKey, 'placeholder_icon', x + 42, y + rowHeight / 2, 56, 56, 'center', 55),
      { disabled: option.disabled }
    );

    this.add.text(x + 82, y + 16, option.title, {
      color: '#f6f7ff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      fontStyle: 'bold',
      wordWrap: { width: width - 230 }
    });
    this.add.text(x + 82, y + 44, `${option.description}  ${option.priceText}`, {
      color: option.disabled ? '#8a8fa8' : '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '14px' : '16px',
      wordWrap: { width: width - 230 }
    });

    new UiButton(
      this,
      this.uiSpec(`shop_button_${option.id}`, 'button', option.buttonAssetKey, 'ui_button_default', x + width - 76, y + rowHeight / 2, 120, 54, 'center', 60),
      {
        label: option.id === 'leave' ? 'Leave' : 'Buy',
        disabled: option.disabled,
        onClick: () => this.handleShopAction(option.id)
      }
    );
  }

  private handleShopAction(actionId: ShopActionId): void {
    const game = this.game as BlockmancerGame;
    switch (actionId) {
      case 'heal':
        this.resolveShopAction(game.shopSystem.healForGold(game.runState));
        return;
      case 'randomReward':
        this.resolveShopAction(game.shopSystem.buyRandomReward(game.runState));
        return;
      case 'item':
        this.resolveShopAction(game.shopSystem.buyItem(game.runState));
        return;
      case 'removeOopsie':
        this.resolveShopAction(game.shopSystem.removeOopsie(game.runState));
        return;
      case 'leave':
        this.resolveShopAction(game.shopSystem.leave());
        return;
      default:
        return;
    }
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

  private addShopBackdrop(): void {
    const game = this.game as BlockmancerGame;
    const background = game.assetSystem.createImageByAssetKey(this, 'bg_scene_shop', 'stageBackground', this.scale.width / 2, this.scale.height / 2, { kind: 'background' });
    background.setDisplaySize(this.scale.width, this.scale.height).setAlpha(0.28);
    if (!game.assetSystem.hasAssetKey('bg_scene_shop')) {
      this.addNodeBackdrop();
    }
  }

  private addNodeBackdrop(): void {
    const game = this.game as BlockmancerGame;
    const layers = [
      game.assetSystem.getStageBackground(this, game.runState.stage, 'battleFar'),
      game.assetSystem.getStageBackground(this, game.runState.stage, 'battleMid'),
      game.assetSystem.getStageBackground(this, game.runState.stage, 'battleNear')
    ];
    const unique = layers.filter((key, index, all) => all.indexOf(key) === index);
    unique.forEach((key, index) => {
      game.assetSystem.createImageByAssetKey(this, key, 'stageBackground', this.scale.width / 2, this.scale.height / 2, { kind: 'background' })
        .setDisplaySize(this.scale.width, this.scale.height)
        .setAlpha([0.12, 0.15, 0.1][index] ?? 0.12);
    });
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
      canonicalFolder: type === 'iconSlot' ? 'public/assets/icons/' : 'public/assets/ui/',
      expectedSourceSize: { w, h },
      runtimeRenderSize: { w, h },
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
      anchor,
      fitMode: type === 'iconSlot' ? 'iconCenter' : 'nineSlice',
      scaleMode: type === 'iconSlot' ? 'fitInteger' : 'uiStretchNineSlice',
      safePadding: type === 'iconSlot' ? 0 : 24,
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
}
