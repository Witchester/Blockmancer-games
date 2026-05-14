import type { RewardId, RunState, SpellId } from '../types/GameTypes';
import { clamp } from '../utils/math';
import { choice } from '../utils/random';
import { contentRegistry } from './ContentRegistry';
import { EnemySystem } from './EnemySystem';
import { InventorySystem } from './InventorySystem';
import { OopsieSystem } from './OopsieSystem';
import { RewardSystem } from './RewardSystem';

type RoomEventEffect = { type: string; value?: number };

export type RoomEventChoice = {
  label: string;
  effectType: string;
  value: number;
  requirement: string;
  description?: string;
  effects?: RoomEventEffect[];
  requirements?: string[];
  resultText?: string;
  costHp?: number;
  costGold?: number;
  bonusGold?: number;
};

export type RoomEventEntry = {
  id: string;
  name: string;
  description: string;
  biome?: string;
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
    private readonly inventorySystem: InventorySystem = new InventorySystem(),
    private readonly oopsieSystem: OopsieSystem = new OopsieSystem()
  ) {}

  getRandomEvent(stage = 1): RoomEventEntry {
    const events = contentRegistry.listEnabled<RoomEventEntry>('roomEvent');
    const stageBiome = this.getStageBiome(stage);
    const themed = events.filter((eventEntry) => eventEntry.biome === stageBiome || eventEntry.biome === 'dungeon');
    return this.normalizeEvent(choice(themed.length > 0 ? themed : events));
  }

  getEventById(id: string): RoomEventEntry | null {
    const eventEntry = contentRegistry.getRoomEvent(id) as RoomEventEntry | null;
    return eventEntry ? this.normalizeEvent(eventEntry) : null;
  }

  private normalizeEvent(eventEntry: RoomEventEntry): RoomEventEntry {
    return {
      ...eventEntry,
      choices: eventEntry.choices.map((choiceEntry) => {
        const firstEffect = choiceEntry.effects?.[0];
        return {
          ...choiceEntry,
          effectType: choiceEntry.effectType ?? this.normalizeEffectType(firstEffect?.type),
          value: firstEffect?.value ?? choiceEntry.value ?? 0,
          requirement: choiceEntry.requirement ?? choiceEntry.requirements?.[0] ?? 'none',
          costHp: choiceEntry.costHp ?? choiceEntry.effects?.find((effect) => effect.type === 'damage_player')?.value
        };
      })
    };
  }

  private normalizeEffectType(effectType?: string): string {
    switch (effectType) {
      case 'gain_gold':
        return 'gain_gold';
      case 'gain_mana':
        return 'gain_mana';
      case 'gain_random_reward':
      case 'gain_random_spell':
        return 'gain_reward';
      case 'heal_player':
      case 'heal_full':
      case 'restore_mana_full':
        return 'heal_player';
      case 'increase_fall_speed':
        return 'increase_fall_speed';
      case 'reduce_fall_speed':
        return 'reduce_fall_speed';
      case 'gain_random_curse':
      case 'gain_random_oopsie':
        return 'add_oopsie';
      case 'remove_curse':
      case 'remove_oopsie':
        return 'remove_oopsie';
      default:
        return 'leave';
    }
  }

  resolveChoice(state: RunState, eventEntry: RoomEventEntry, choiceEntry: RoomEventChoice): EventResolution {
    const requirementError = this.checkRequirement(state, choiceEntry);
    if (requirementError) {
      return {
        transition: 'stay',
        messages: [requirementError]
      };
    }

    if (choiceEntry.effects?.length) {
      const messages = this.applyEffects(state, eventEntry, choiceEntry);
      return {
        transition: 'map',
        messages: messages.length > 0 ? messages : [choiceEntry.resultText ?? 'The event resolves with a cheerful sparkle.']
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
            `${eventEntry.name} asks for a dramatic snack-powered trade.`
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
            this.rewardSystem.applyReward(state, duplicated)
          ]
        };
      }
      case 'add_curse':
      case 'add_oopsie': {
        const oopsie = this.oopsieSystem.addRandomOopsie(state);
        state.player.gold += choiceEntry.bonusGold ?? 0;
        state.player.totalGoldCollected += choiceEntry.bonusGold ?? 0;
        state.gold = state.player.gold;
        return {
          transition: 'map',
          messages: [
            oopsie
              ? `${oopsie.name} joins the run, but your purse grows heavier.`
              : 'The oopsie basket is empty, so you just pocket the gold.'
          ]
        };
      }
      case 'remove_oopsie': {
        const removed = this.oopsieSystem.removeOopsie(state);
        return {
          transition: 'map',
          messages: [removed ? `${removed.name} gets polished away.` : 'No oopsie needed cleaning.']
        };
      }
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
    const reward = this.rewardSystem.getRandomRewards(1, state, 'event')[0];
    state.pendingRewards = [reward];
    const message = this.rewardSystem.applyReward(state, reward.id as RewardId);
    state.pendingRewards = [];
    return message;
  }

  private applyEffects(state: RunState, eventEntry: RoomEventEntry, choiceEntry: RoomEventChoice): string[] {
    const messages: string[] = [];
    for (const effect of choiceEntry.effects ?? []) {
      messages.push(...this.applyEffect(state, eventEntry, effect));
    }

    if (choiceEntry.resultText) {
      messages.push(choiceEntry.resultText);
    }

    return messages;
  }

  private applyEffect(state: RunState, eventEntry: RoomEventEntry, effect: RoomEventEffect): string[] {
    const value = effect.value ?? 0;
    switch (effect.type) {
      case 'gain_gold':
        state.player.gold += value;
        state.player.totalGoldCollected += value;
        state.gold = state.player.gold;
        return [`${eventEntry.name} gives you ${value} gold.`];
      case 'lose_gold': {
        const spent = Math.min(state.player.gold, value);
        state.player.gold -= spent;
        state.gold = state.player.gold;
        return [`${eventEntry.name} takes ${spent} gold for the snack fund.`];
      }
      case 'damage_player':
        state.player.hp = Math.max(1, state.player.hp - value);
        return [`${eventEntry.name} bonks you for ${value} HP.`];
      case 'heal_player':
        state.player.hp = clamp(state.player.hp + value, 0, state.player.maxHp);
        return [`${eventEntry.name} restores ${value} HP.`];
      case 'heal_full':
        state.player.hp = state.player.maxHp;
        return [`${eventEntry.name} tops off your HP.`];
      case 'gain_mana':
        state.player.mana = clamp(state.player.mana + value, 0, state.player.maxMana);
        return [`${eventEntry.name} restores ${value} mana.`];
      case 'restore_mana_full':
        state.player.mana = state.player.maxMana;
        return [`${eventEntry.name} fills your mana.`];
      case 'increase_mana_gain_passive':
        state.player.maxMana += Math.max(5, Math.round(value * 100));
        state.player.mana = state.player.maxMana;
        return [`${eventEntry.name} raises max mana to ${state.player.maxMana}.`];
      case 'gain_random_reward':
      case 'gain_random_spell':
        return [this.applyRandomReward(state)];
      case 'gain_random_curse':
      case 'add_curse':
      case 'gain_random_oopsie':
      case 'add_oopsie': {
        const gained: string[] = [];
        const count = Math.max(1, value || 1);
        for (let index = 0; index < count; index += 1) {
          const oopsie = this.oopsieSystem.addRandomOopsie(state);
          if (oopsie) {
            gained.push(oopsie.name);
          }
        }
        return [gained.length ? `Oopsie gained: ${gained.join(', ')}.` : 'The oopsie basket is empty.'];
      }
      case 'remove_curse': {
        const removedNames: string[] = [];
        const count = Math.max(1, value || 1);
        for (let index = 0; index < count; index += 1) {
          const removed = this.oopsieSystem.removeOopsie(state);
          if (removed) {
            removedNames.push(removed.name);
          }
        }
        return [removedNames.length ? `${removedNames.join(', ')} gets polished away.` : 'No oopsie needed cleaning.'];
      }
      case 'remove_oopsie': {
        const removed = this.oopsieSystem.removeOopsie(state);
        return [removed ? `${removed.name} gets polished away.` : 'No oopsie needed cleaning.'];
      }
      case 'gain_random_item': {
        const items = contentRegistry.listEnabled<{ id: string }>('item');
        const item = items.length > 0 ? choice(items) : null;
        if (!item) return ['The prize basket is empty.'];
        this.inventorySystem.addItem(state, item.id);
        return [`${eventEntry.name} adds ${item.id} to your bag.`];
      }
      case 'reduce_fall_speed':
        state.fallSpeed = Math.max(0.7, state.fallSpeed - value);
        return [`${eventEntry.name} steadies the falling blocks.`];
      case 'increase_fall_speed':
        state.fallSpeed = Math.min(2, state.fallSpeed + value);
        return [`${eventEntry.name} makes the blocks a little bouncier.`];
      default:
        return [`${eventEntry.name} sparkles, but nothing major changes.`];
    }
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

  private getStageBiome(stage: number): string {
    switch (stage) {
      case 4:
        return 'crypt';
      case 5:
        return 'void';
      case 6:
        return 'royal_ruins';
      default:
        return 'dungeon';
    }
  }
}
