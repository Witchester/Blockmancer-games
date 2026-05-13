import type { RewardId, RunState, SpellId } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { EnemySystem } from './EnemySystem';
import { RelicSystem } from './RelicSystem';
import { RewardSystem } from './RewardSystem';

export type RoomEventChoice = {
  label: string;
  effectType: string;
  value: number;
  requirement: string;
  costHp?: number;
  costGold?: number;
  bonusGold?: number;
};

export type RoomEventEntry = {
  id: string;
  name: string;
  description: string;
  choices: RoomEventChoice[];
};

export type EventResolution = {
  transition: 'stay' | 'map' | 'battle';
  messages: string[];
};

export class EventSystem {
  constructor(
    private readonly rewardSystem: RewardSystem = new RewardSystem(),
    private readonly enemySystem: EnemySystem = new EnemySystem(),
    private readonly relicSystem: RelicSystem = new RelicSystem()
  ) {}

  getRandomEvent(): RoomEventEntry {
    return choice(contentRegistry.listEnabled<RoomEventEntry>('roomEvent'));
  }

  getEventById(id: string): RoomEventEntry | null {
    return contentRegistry.getRoomEvent(id) as RoomEventEntry | null;
  }

  resolveChoice(state: RunState, eventEntry: RoomEventEntry, choiceEntry: RoomEventChoice): EventResolution {
    const requirementError = this.checkRequirement(state, choiceEntry);
    if (requirementError) {
      return {
        transition: 'stay',
        messages: [requirementError]
      };
    }

    switch (choiceEntry.effectType) {
      case 'reduce_fall_speed':
        state.fallSpeed = Math.max(0.7, state.fallSpeed - choiceEntry.value);
        return {
          transition: 'map',
          messages: [`${eventEntry.name} steadies the battlefield.`]
        };
      case 'gain_gold':
        state.player.gold += choiceEntry.value;
        state.player.totalGoldCollected += choiceEntry.value;
        state.gold = state.player.gold;
        return {
          transition: 'map',
          messages: [`${eventEntry.name} yields ${choiceEntry.value} gold.`]
        };
      case 'gain_reward':
        state.player.hp = Math.max(1, state.player.hp - (choiceEntry.costHp ?? 0));
        return {
          transition: 'map',
          messages: [
            this.applyRandomReward(state),
            `${eventEntry.name} demands blood for power.`
          ]
        };
      case 'upgrade_spell': {
        if (choiceEntry.costGold) {
          state.player.gold -= choiceEntry.costGold;
          state.gold = state.player.gold;
        }
        const spellId = choice<SpellId>(['fireball', 'frost-lock', 'bomb-rune', 'void-cut']);
        return {
          transition: 'map',
          messages: [this.rewardSystem.applySpellUpgrade(state, spellId)]
        };
      }
      case 'gain_relic': {
        const duplicated = choice(state.relics);
        return {
          transition: 'map',
          messages: [
            `The mirror copies ${duplicated}.`,
            this.relicSystem.applyRelic(state, duplicated)
          ]
        };
      }
      case 'add_curse':
        state.player.curses += 1;
        state.player.gold += choiceEntry.bonusGold ?? 0;
        state.player.totalGoldCollected += choiceEntry.bonusGold ?? 0;
        state.gold = state.player.gold;
        return {
          transition: 'map',
          messages: ['A curse settles in, but your purse grows heavier.']
        };
      case 'heal_player':
        state.player.hp = clamp(state.player.hp + choiceEntry.value, 0, state.player.maxHp);
        return {
          transition: 'map',
          messages: ['The encounter restores your strength.']
        };
      case 'start_elite_fight': {
        const enemy = this.enemySystem.spawnEnemy('elite', state.stage);
        if (!enemy) {
          return {
            transition: 'stay',
            messages: ['The duel fails to take shape.']
          };
        }

        state.activeEnemy = enemy;
        state.lastBattleWasBoss = false;
        state.currentRoomProgress = 'entered';
        state.runStatus = 'battle';
        return {
          transition: 'battle',
          messages: ['The event turns into an elite duel.']
        };
      }
      case 'leave':
        return {
          transition: 'map',
          messages: ['You leave the event unchanged.']
        };
      default:
        return {
          transition: 'stay',
          messages: ['A mysterious outcome fails to resolve.']
        };
    }
  }

  private applyRandomReward(state: RunState): string {
    const reward = this.rewardSystem.getRandomRewards(1)[0];
    return this.rewardSystem.applyReward(state, reward.id as RewardId);
  }

  private checkRequirement(state: RunState, choiceEntry: RoomEventChoice): string | null {
    switch (choiceEntry.requirement) {
      case 'min_gold':
        return state.player.gold >= (choiceEntry.costGold ?? 0) ? null : 'Not enough gold to empower a spell.';
      case 'has_relic':
        return state.relics.length > 0 ? null : 'You have no relic for the mirror to copy.';
      case 'has_spell':
        return state.spells.length > 0 ? null : 'You have no spell to empower.';
      case 'min_hp':
        return state.player.hp > (choiceEntry.costHp ?? 0) ? null : 'You are too weak to pay that price.';
      default:
        return null;
    }
  }
}
