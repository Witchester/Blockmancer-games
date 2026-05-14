import Phaser from 'phaser';
import { BlockmancerGame } from '../BlockmancerGame';
import type { EventId } from '../types/GameTypes';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { COLORS, FONT_FAMILY, MAX_EVENT_LOG } from '../utils/constants';
import { getPortraitLayout, isCompactLayout } from '../utils/layout';
import type { RoomEventChoice, RoomEventEntry } from '../systems/EventSystem';

export class EventScene extends Phaser.Scene {
  constructor() {
    super('EventScene');
  }

  create(): void {
    const game = this.game as BlockmancerGame;
    const eventEntry = this.resolveEventEntry();
    const compact = isCompactLayout(this);
    const layout = getPortraitLayout(this);
    game.runState.runStatus = 'map';
    game.runState.currentRoomProgress = 'entered';

    this.cameras.main.setBackgroundColor(COLORS.background);
    new Card(this, layout.centerX, layout.centerY, layout.contentWidth, layout.height - 96, {
      title: eventEntry.name,
      titleColor: '#ffca6b',
      strokeColor: COLORS.accentSoft
    });
    this.add.text(layout.centerX, 220, eventEntry.description, {
      color: '#d8deff',
      fontFamily: FONT_FAMILY,
      fontSize: compact ? '18px' : '20px',
      align: 'center',
      wordWrap: { width: layout.contentWidth - 80 },
      lineSpacing: 6
    }).setOrigin(0.5);

    eventEntry.choices.forEach((choiceEntry, index) => {
      const y = 345 + index * 132;
      new Card(this, layout.centerX - 64, y, layout.contentWidth - 180, 104, {
        title: choiceEntry.label,
        body: this.describeChoice(choiceEntry),
        titleFontSize: compact ? '22px' : '26px',
        bodyFontSize: compact ? '16px' : '18px',
        strokeColor: COLORS.gold
      });

      new Button(this, layout.width - 92, y, 116, 48, 'Choose', () => {
        this.applyChoice(eventEntry, choiceEntry);
      });
    });
  }

  private resolveEventEntry(): RoomEventEntry {
    const game = this.game as BlockmancerGame;
    const persistedEventId = game.runState.currentEventId;
    const persistedEvent = persistedEventId ? game.eventSystem.getEventById(persistedEventId) : null;
    if (persistedEvent) {
      return persistedEvent;
    }

    const eventEntry = game.eventSystem.getRandomEvent(game.runState.stage);
    game.runState.currentEventId = eventEntry.id as EventId;
    game.saveRun();
    return eventEntry;
  }

  private describeChoice(choiceEntry: RoomEventChoice): string {
    if (choiceEntry.description) {
      return choiceEntry.description;
    }

    switch (choiceEntry.effectType) {
      case 'reduce_fall_speed':
        return `Reduce fall speed by ${choiceEntry.value.toFixed(2)}.`;
      case 'gain_gold':
        return `Gain ${choiceEntry.value} gold.`;
      case 'gain_reward':
        return `Take ${choiceEntry.costHp ?? 0} damage and gain a random reward.`;
      case 'upgrade_spell':
        return choiceEntry.costGold ? `Pay ${choiceEntry.costGold} gold to empower a spell.` : 'Upgrade a random spell.';
      case 'add_curse':
      case 'add_oopsie':
        return `Gain a silly oopsie and ${choiceEntry.bonusGold ?? 0} gold.`;
      case 'remove_oopsie':
        return 'Polish away one oopsie.';
      case 'heal_player':
        return `Heal ${choiceEntry.value} HP.`;
      case 'start_elite_fight':
        return 'Immediately start a harder elite encounter.';
      case 'leave':
        return 'Leave without changing the run.';
      default:
        return 'A mysterious outcome.';
    }
  }

  private applyChoice(eventEntry: RoomEventEntry, choiceEntry: RoomEventChoice): void {
    const game = this.game as BlockmancerGame;
    const state = game.runState;
    const resolution = game.eventSystem.resolveChoice(state, eventEntry, choiceEntry);
    resolution.messages.forEach((message) => this.log(message));

    if (resolution.transition === 'stay') {
      return;
    }

    if (resolution.transition === 'battle') {
      state.currentEventId = null;
      game.saveRun();
      this.scene.start('BattleScene');
      return;
    }

    game.mapSystem.completeNode(state, state.currentNodeId);
    state.currentEventId = null;
    state.runStatus = 'map';
    game.saveRun();
    this.scene.start('MapScene');
  }

  private log(message: string): void {
    const state = (this.game as BlockmancerGame).runState;
    state.eventLog.unshift(message);
    state.eventLog = state.eventLog.slice(0, MAX_EVENT_LOG);
  }
}
