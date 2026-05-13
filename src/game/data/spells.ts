import { contentRegistry } from '../systems/ContentRegistry';
import type { SpellDefinition, SpellId } from '../types/GameTypes';

type SpellContentEntry = {
  id: string;
  name: string;
  description: string;
  cost: {
    mana: number;
  };
  enabled?: boolean;
};

const SPELL_CONTENT_IDS: string[] = ['spl_fireball', 'spl_frost_lock', 'spl_bomb_rune', 'spl_void_cut'];

const SPELL_ID_BY_CONTENT_ID: Record<string, SpellId> = {
  spl_fireball: 'fireball',
  spl_frost_lock: 'frost-lock',
  spl_bomb_rune: 'bomb-rune',
  spl_void_cut: 'void-cut'
};

const SPELL_KEY_BY_ID: Record<SpellId, string> = {
  fireball: '1',
  'frost-lock': '2',
  'bomb-rune': '3',
  'void-cut': '4'
};

const SPELL_DAMAGE_BY_ID: Record<SpellId, number> = {
  fireball: 22,
  'frost-lock': 0,
  'bomb-rune': 35,
  'void-cut': 15
};

function createFallbackSpell(id: SpellId): SpellDefinition {
  return {
    id,
    label: id,
    key: SPELL_KEY_BY_ID[id],
    cost: 999,
    damage: SPELL_DAMAGE_BY_ID[id],
    description: 'Missing spell content entry.'
  };
}

export const SPELLS: SpellDefinition[] = SPELL_CONTENT_IDS.map((contentId) => {
  const runtimeId = SPELL_ID_BY_CONTENT_ID[contentId];
  const entry = contentRegistry.getSpell(contentId) as SpellContentEntry | null;

  if (!entry) {
    return createFallbackSpell(runtimeId);
  }

  return {
    id: runtimeId,
    label: entry.name,
    key: SPELL_KEY_BY_ID[runtimeId],
    cost: entry.cost.mana,
    damage: SPELL_DAMAGE_BY_ID[runtimeId],
    description: entry.description
  };
});
