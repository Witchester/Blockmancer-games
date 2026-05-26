import { SPELL_CONTENT_ID_BY_ID, SPELLS } from '../../data/spells';
import { contentRegistry } from '../../systems/ContentRegistry';
import type { ReactiveItemContent, RewardId, RunState } from '../../types/GameTypes';

export type InventoryEntryKind = 'item' | 'relic' | 'spell';

export type InventoryEntryViewModel = {
  id: string;
  kind: InventoryEntryKind;
  title: string;
  description: string;
  detail: string;
  quantityText?: string;
  iconKey: string;
  canUse: boolean;
};

export type InventoryViewModel = {
  title: string;
  summary: string;
  entries: InventoryEntryViewModel[];
  selected?: InventoryEntryViewModel;
};

type ContentEntry = {
  id: string;
  name?: string;
  description?: string;
  iconKey?: string;
  type?: string;
  rarity?: string;
};

export function createInventoryViewModel(state: RunState, selectedId?: string): InventoryViewModel {
  const itemEntries = state.inventory.map((stack): InventoryEntryViewModel => {
    const item = contentRegistry.getItem(stack.itemId) as ReactiveItemContent | null;
    const title = item?.name ?? stack.itemId;
    const timing = item?.timing ? `Timing: ${item.timing}` : 'Timing: item';
    return {
      id: stack.itemId,
      kind: 'item',
      title,
      description: item?.description ?? 'Missing item details.',
      detail: `${timing}   Count: ${stack.count}`,
      quantityText: `x${stack.count}`,
      iconKey: item?.iconKey ?? `ico_${stack.itemId}`,
      canUse: true
    };
  });

  const relicEntries = uniqueIds([...state.relics, ...state.ownedRewards]).map((rewardId): InventoryEntryViewModel => {
    const entry = getRewardContent(rewardId);
    return {
      id: rewardId,
      kind: 'relic',
      title: entry?.name ?? rewardId,
      description: entry?.description ?? 'Persistent run reward.',
      detail: entry?.rarity ? `Relic   ${entry.rarity}` : 'Relic',
      iconKey: entry?.iconKey ?? `ico_${rewardId}`,
      canUse: false
    };
  });

  const spellEntries = state.spells.map((spellId): InventoryEntryViewModel => {
    const spell = SPELLS.find((entry) => entry.id === spellId);
    const contentId = SPELL_CONTENT_ID_BY_ID[spellId] ?? `spl_${spellId.replace(/-/g, '_')}`;
    const content = contentRegistry.getSpell(contentId) as ContentEntry | null;
    return {
      id: spellId,
      kind: 'spell',
      title: spell?.label ?? content?.name ?? spellId,
      description: spell?.description ?? content?.description ?? 'Known spell.',
      detail: spell ? `Spell   Mana ${spell.cost}` : 'Spell',
      iconKey: content?.iconKey ?? `ico_${contentId}`,
      canUse: false
    };
  });

  const entries = [...itemEntries, ...relicEntries, ...spellEntries];
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];
  return {
    title: 'Inventory',
    summary: `Items ${state.inventory.length}/${state.player.inventoryCapacity}   Relics ${relicEntries.length}   Spells ${spellEntries.length}`,
    entries,
    selected
  };
}

function getRewardContent(rewardId: RewardId): ContentEntry | null {
  return (
    contentRegistry.getOptionalById('relic', rewardId) as ContentEntry | null
  ) ?? (
    contentRegistry.getOptionalById('upgrade', rewardId) as ContentEntry | null
  );
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}
