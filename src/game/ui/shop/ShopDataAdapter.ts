import type { BlockmancerGame } from '../../BlockmancerGame';
import type { RunState } from '../../types/GameTypes';

export type ShopActionId = 'heal' | 'randomReward' | 'item' | 'removeOopsie' | 'leave';

export type ShopOptionViewModel = {
  id: ShopActionId;
  title: string;
  description: string;
  priceText: string;
  iconKey: string;
  buttonAssetKey: string;
  disabled: boolean;
};

export type ShopViewModel = {
  title: string;
  subtitle: string;
  statsText: string;
  options: ShopOptionViewModel[];
};

export function createShopViewModel(game: BlockmancerGame, state: RunState): ShopViewModel {
  const healCost = game.shopSystem.getScaledPrice(state, 30);
  const rewardCost = game.shopSystem.getScaledPrice(state, 60);
  const itemCost = game.shopSystem.getScaledPrice(state, 25);
  const oopsieCost = game.oopsieSystem.getRemovalCost(state);
  const bagFull = state.inventory.length >= state.player.inventoryCapacity;

  return {
    title: 'Dungeon Shop',
    subtitle: 'A snack merchant offers bright bargains and questionable remedies.',
    statsText: `Gold ${state.player.gold}   HP ${state.player.hp}/${state.player.maxHp}   Bag ${state.inventory.length}/${state.player.inventoryCapacity}   Oopsies ${state.player.oopsies.length}`,
    options: [
      {
        id: 'heal',
        title: 'Heal 8 HP',
        description: 'Patch up before the next room.',
        priceText: `${healCost} gold`,
        iconKey: 'ico_item_mini_cupcake',
        buttonAssetKey: 'ui_button_buy',
        disabled: state.player.gold < healCost || state.player.hp >= state.player.maxHp
      },
      {
        id: 'randomReward',
        title: 'Random Reward',
        description: 'A surprise from the reward table.',
        priceText: `${rewardCost} gold`,
        iconKey: 'ico_relic_slime_core',
        buttonAssetKey: 'ui_button_buy',
        disabled: state.player.gold < rewardCost
      },
      {
        id: 'item',
        title: 'Bag Item',
        description: bagFull ? 'Your bag is full.' : 'A reactive item for the road.',
        priceText: `${itemCost} gold`,
        iconKey: 'ico_item_mana_lemonade',
        buttonAssetKey: 'ui_button_buy',
        disabled: state.player.gold < itemCost || bagFull
      },
      {
        id: 'removeOopsie',
        title: 'Remove Oopsie',
        description: state.player.oopsies.length > 0 ? 'Clean up one run drawback.' : 'No oopsies to remove.',
        priceText: `${oopsieCost} gold`,
        iconKey: 'placeholder_icon',
        buttonAssetKey: 'ui_button_sell',
        disabled: state.player.gold < oopsieCost || state.player.oopsies.length === 0
      },
      {
        id: 'leave',
        title: 'Leave Shop',
        description: 'Return to the map.',
        priceText: 'No cost',
        iconKey: 'placeholder_icon',
        buttonAssetKey: 'ui_button_back',
        disabled: false
      }
    ]
  };
}
