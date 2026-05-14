import type { InventoryStack, RunState } from '../types/GameTypes';
import { contentRegistry } from './ContentRegistry';

export class InventorySystem {
  listAvailableItems() {
    return contentRegistry.listEnabled('item');
  }

  addItem(state: RunState, itemId: string, count = 1): void {
    const existing = state.inventory.find((stack) => stack.itemId === itemId);
    if (existing) {
      existing.count += count;
      return;
    }

    if (state.inventory.length >= state.player.inventoryCapacity || !contentRegistry.getItem(itemId)) {
      return;
    }

    state.inventory.push({ itemId, count });
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
}
