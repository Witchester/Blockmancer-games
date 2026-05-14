import { contentRegistry } from './ContentRegistry';

export type InventoryStack = {
  itemId: string;
  count: number;
};

export class InventorySystem {
  private readonly capacity = 10;

  listAvailableItems() {
    return contentRegistry.listEnabled('item');
  }

  addItem(inventory: InventoryStack[], itemId: string, count = 1): InventoryStack[] {
    const existing = inventory.find((stack) => stack.itemId === itemId);
    if (existing) {
      existing.count += count;
      return inventory;
    }

    if (inventory.length >= this.capacity || !contentRegistry.getItem(itemId)) {
      return inventory;
    }

    inventory.push({ itemId, count });
    return inventory;
  }

  removeItem(inventory: InventoryStack[], itemId: string, count = 1): InventoryStack[] {
    const existing = inventory.find((stack) => stack.itemId === itemId);
    if (!existing) {
      return inventory;
    }

    existing.count -= count;
    return inventory.filter((stack) => stack.count > 0);
  }
}
