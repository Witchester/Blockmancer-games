import type { InventoryStack, RunState } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';

export class InventorySystem {
  listAvailableItems() {
    return contentRegistry.listEnabled('item');
  }

  addItem(state: RunState, itemId: string, count = 1): void {
    const item = contentRegistry.getItem(itemId) as { maxStack?: number } | null;
    if (!item) {
      return;
    }

    const existing = state.inventory.find((stack) => stack.itemId === itemId);
    if (existing) {
      existing.count = Math.min(item.maxStack ?? 99, existing.count + count);
      return;
    }

    if (state.inventory.length >= state.player.inventoryCapacity) {
      return;
    }

    state.inventory.push({ itemId, count: Math.min(item.maxStack ?? 99, count) });
  }

  removeItem(state: RunState, itemId: string, count = 1): void {
    const existingIndex = state.inventory.findIndex((stack) => stack.itemId === itemId);
    if (existingIndex === -1) {
      return;
    }

    const existing = state.inventory[existingIndex];
    existing.count -= count;
    if (existing.count <= 0) {
      state.inventory.splice(existingIndex, 1);
    }
  }
  /**
 * Returns total count of all items in the inventory.
 */
getItemCount(state: RunState): number {
  return state.inventory.reduce((total, stack) => total + stack.count, 0);
}

/**
 * Returns the total number of items (sum of counts) in the bag.
 */
getBagItemCount(state: RunState): number {
  return state.inventory.reduce((total, stack) => total + stack.count, 0);
}

/**
 * Temporary getter used by the UI to display the remaining item count in the bag button.
 * Returns the same value as `getItemCount` for now.
 */
getRemainingItemCount(state: RunState): number {
  return this.getItemCount(state);
}  }

}
