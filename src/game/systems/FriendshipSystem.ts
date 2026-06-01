import type { GameplayEffect } from '../types/GameTypes';
import type { MetaState } from '../types/MetaTypes';
import { contentRegistry } from './ContentRegistry';

export type MonsterFriendshipEntry = {
  id: string;
  monsterId: string;
  name: string;
  pointsRequired: number;
  gainMethods: Array<{
    type: 'defeat' | 'feed_item' | 'spare' | 'event_choice';
    itemId?: string;
    points: number;
  }>;
  unlockReward: {
    helperId?: string;
    effect?: GameplayEffect[];
    unlocks?: string[];
  };
  enabled?: boolean;
};

export class FriendshipSystem {
  list(): MonsterFriendshipEntry[] {
    return contentRegistry.listEnabled<MonsterFriendshipEntry>('friendship');
  }

  getForMonster(monsterId: string): MonsterFriendshipEntry | null {
    return this.list().find((entry) => entry.monsterId === monsterId) ?? null;
  }

  gain(meta: MetaState, monsterId: string, method: MonsterFriendshipEntry['gainMethods'][number]['type']): string | null {
    const entry = this.getForMonster(monsterId);
    const gain = entry?.gainMethods.find((gainMethod) => gainMethod.type === method);
    if (!entry || !gain) {
      return null;
    }
    const next = (meta.monsterFriendship[monsterId] ?? 0) + gain.points;
    meta.monsterFriendship[monsterId] = next;
    return next >= entry.pointsRequired
      ? `${entry.name} friendship complete. Helper reward unlocked.`
      : `${entry.name} friendship ${next}/${entry.pointsRequired}.`;
  }

  getSummary(meta: MetaState): string {
    const entries = this.list();
    const befriended = entries.filter((entry) => (meta.monsterFriendship[entry.monsterId] ?? 0) >= entry.pointsRequired).length;
    return `Friends ${befriended}/${entries.length}`;
  }

  /**
   * Return once-per-run gifts for unlocked friendships. These are small, conservative bonuses.
   */
  getRunStartGifts(meta: MetaState): Array<{ monsterId: string; gold?: number; shield?: number; mana?: number; items?: string[] }> {
    const out: Array<{ monsterId: string; gold?: number; shield?: number; mana?: number; items?: string[] }> = [];
    for (const entry of this.list()) {
      const points = meta.monsterFriendship[entry.monsterId] ?? 0;
      if (points >= entry.pointsRequired) {
        // Conservative mapping for Release 1: map friendly unlocks to small starter gifts
        switch (entry.id) {
          case 'friend_cupcake_slime':
            out.push({ monsterId: entry.monsterId, items: ['item_mini_cupcake'] });
            break;
          case 'friend_blanket_ghost':
            out.push({ monsterId: entry.monsterId, shield: 1 });
            break;
          case 'friend_button_masher':
            out.push({ monsterId: entry.monsterId, mana: 8 });
            break;
          case 'friend_ice_cream_imp':
            out.push({ monsterId: entry.monsterId, mana: 5 });
            break;
          default:
            // fallback: small gold gift for miscellaneous friends
            out.push({ monsterId: entry.monsterId, gold: 8 });
            break;
        }
      }
    }
    return out;
  }

  getEntryEffectSummary(entry: MonsterFriendshipEntry, meta: MetaState): { current: string; next: string; unlocked: boolean } {
    const points = meta.monsterFriendship[entry.monsterId] ?? 0;
    const unlocked = points >= entry.pointsRequired;
    let current = unlocked ? 'Helper gift unlocked for future runs.' : 'No gift yet.';
    let next = `Requires ${entry.pointsRequired} points.`;
    // Provide human-friendly specifics for Release 1 mapped gifts
    if (entry.id === 'friend_cupcake_slime') {
      current = unlocked ? 'Gives a Mini Cupcake at run start.' : 'Gives a Mini Cupcake when unlocked.';
      next = `Next: ${entry.pointsRequired} points to unlock.`;
    }
    if (entry.id === 'friend_blanket_ghost') {
      current = unlocked ? 'Gives +1 shield at run start.' : 'Gives +1 shield when unlocked.';
      next = `Next: ${entry.pointsRequired} points to unlock.`;
    }
    if (entry.id === 'friend_button_masher') {
      current = unlocked ? 'Gives +8 starting mana at run start.' : 'Gives +8 starting mana when unlocked.';
      next = `Next: ${entry.pointsRequired} points to unlock.`;
    }
    if (entry.id === 'friend_ice_cream_imp') {
      current = unlocked ? 'Gives +5 starting mana at run start.' : 'Gives +5 starting mana when unlocked.';
      next = `Next: ${entry.pointsRequired} points to unlock.`;
    }

    return { current, next, unlocked };
  }
}
