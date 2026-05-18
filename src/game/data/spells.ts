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

export const RELEASE_1_SPELL_CONTENT_IDS = [
  'spl_fireball',
  'spl_frost_lock',
  'spl_bomb_rune',
  'spl_clean_cut',
  'spl_sprinkle_shower',
  'spl_cupcake_blast',
  'spl_confetti_pop',
  'spl_bubble_shield',
  'spl_star_spark',
  'spl_jelly_bounce',
  'spl_snowcone_burst',
  'spl_goblin_gadget',
  'spl_rainbow_reroll',
  'spl_snack_break',
  'spl_cascade_cheer'
] as const;

export const SPELL_ID_BY_CONTENT_ID: Record<string, SpellId> = {
  spl_fireball: 'fireball',
  spl_frost_lock: 'frost-lock',
  spl_bomb_rune: 'bomb-rune',
  spl_clean_cut: 'clean-cut',
  spl_void_cut: 'clean-cut',
  spl_sprinkle_shower: 'sprinkle-shower',
  spl_cupcake_blast: 'cupcake-blast',
  spl_confetti_pop: 'confetti-pop',
  spl_bubble_shield: 'bubble-shield',
  spl_star_spark: 'star-spark',
  spl_jelly_bounce: 'jelly-bounce',
  spl_snowcone_burst: 'snowcone-burst',
  spl_goblin_gadget: 'goblin-gadget',
  spl_rainbow_reroll: 'rainbow-reroll',
  spl_snack_break: 'snack-break',
  spl_cascade_cheer: 'cascade-cheer'
};

export const SPELL_CONTENT_ID_BY_ID: Record<SpellId, string> = Object.fromEntries(
  Object.entries(SPELL_ID_BY_CONTENT_ID).map(([contentId, runtimeId]) => [runtimeId, contentId])
);

const SPELL_KEY_BY_ID: Record<SpellId, string> = {
  fireball: '1',
  'frost-lock': '2',
  'bomb-rune': '3',
  'clean-cut': '4',
  'sprinkle-shower': '5',
  'cupcake-blast': '6',
  'confetti-pop': '7',
  'bubble-shield': '8',
  'star-spark': '9',
  'jelly-bounce': '10',
  'snowcone-burst': '11',
  'goblin-gadget': '12',
  'rainbow-reroll': '13',
  'snack-break': '14',
  'cascade-cheer': '15'
};

const SPELL_DAMAGE_BY_ID: Record<SpellId, number> = {
  fireball: 22,
  'frost-lock': 0,
  'bomb-rune': 35,
  'clean-cut': 15,
  'sprinkle-shower': 4,
  'cupcake-blast': 12,
  'confetti-pop': 8,
  'bubble-shield': 0,
  'star-spark': 14,
  'jelly-bounce': 9,
  'snowcone-burst': 10,
  'goblin-gadget': 10,
  'rainbow-reroll': 0,
  'snack-break': 0,
  'cascade-cheer': 6
};

function createFallbackSpell(id: SpellId): SpellDefinition {
  return {
    id,
    label: id.replace(/-/g, ' '),
    key: SPELL_KEY_BY_ID[id] ?? '?',
    cost: 999,
    damage: SPELL_DAMAGE_BY_ID[id] ?? 0,
    description: 'Missing spell content entry.'
  };
}

export const SPELLS: SpellDefinition[] = RELEASE_1_SPELL_CONTENT_IDS.map((contentId) => {
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
    damage: SPELL_DAMAGE_BY_ID[runtimeId] ?? 0,
    description: entry.description
  };
});
