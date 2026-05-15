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
}
