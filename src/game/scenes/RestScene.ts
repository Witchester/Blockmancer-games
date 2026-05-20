import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';
import { clamp } from '../utils/math';

export class RestScene extends Phaser.Scene {
  constructor() {
    super('RestScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const compact = isCompactLayout(this);
    const layout = getPortraitLayout(this);
    state.runStatus = 'map';
    state.currentRoomProgress = 'entered';
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.addNodeBackdrop();

    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, 640, {
      title: 'Rest Scene · Rest Site',
      body: [
        'A quiet festival nook steadies your hands and restores your breath.',
        '',
        'Choose one cozy benefit before returning to the map.'
      ].join('\n'),
      titleColor: '#65d6a5',
      bodyFontSize: compact ? '20px' : '22px',
      strokeColor: COLORS.success
    });

    this.add.text(layout.centerX, 510, `HP ${state.player.hp}/${state.player.maxHp}   Mana ${state.player.mana}/${state.player.maxMana}   Fall ${state.fallSpeed.toFixed(2)}x`, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      align: 'center'
    }).setOrigin(0.5);

    new Button(this, layout.centerX, 610, 320, 54, 'Snack Nap', () => {
      state.player.hp = clamp(state.player.hp + 12, 0, state.player.maxHp);
      this.finishRest('Snack Nap restores 12 HP.');
    });

    new Button(this, layout.centerX, 688, 320, 54, 'Mana Picnic', () => {
      state.player.mana = clamp(state.player.mana + 40, 0, state.player.maxMana);
      state.player.shield += 4;
      this.finishRest('Mana Picnic restores 40 mana and adds 4 shield.');
    });

    new Button(this, layout.centerX, 766, 320, 54, 'Block Stretch', () => {
      state.fallSpeed = Math.max(0.7, state.fallSpeed - 0.05);
      state.player.hp = clamp(state.player.hp + 6, 0, state.player.maxHp);
      this.finishRest('Block Stretch restores 6 HP and lowers fall speed by 0.05.');
    });
  }

  private finishRest(message: string): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    this.log(message);
    game.mapSystem.completeNode(state, state.currentNodeId);
    state.runStatus = 'map';
    game.saveRun();
    this.scene.start('MapScene');
  }

  private log(message: string): void {
    const state = (this.game as BlockmancerGame).runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
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
}
