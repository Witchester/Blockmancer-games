import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, MAX_EVENT_LOG } from '../utils/constants';
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

    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, 640, {
      title: 'Rest Site',
      body: [
        'A quiet chamber steadies your hands and restores your breath.',
        '',
        'Recover 10 HP and reduce fall speed by 0.05.'
      ].join('\n'),
      titleColor: '#65d6a5',
      bodyFontSize: compact ? '20px' : '22px',
      strokeColor: COLORS.success
    });

    new Button(this, layout.centerX, 760, 260, 56, 'Rest', () => {
      state.player.hp = clamp(state.player.hp + 10, 0, state.player.maxHp);
      state.fallSpeed = Math.max(0.7, state.fallSpeed - 0.05);
      this.log('The rest site heals you and steadies your hands.');
      game.mapSystem.completeNode(state, state.currentNodeId);
      state.runStatus = 'map';
      game.saveRun();
      this.scene.start('MapScene');
    });
  }

  private log(message: string): void {
    const state = (this.game as BlockmancerGame).runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }
}
