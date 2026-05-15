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
}
