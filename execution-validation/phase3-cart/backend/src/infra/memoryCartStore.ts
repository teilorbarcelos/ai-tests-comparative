// backend/src/infra/memoryCartStore.ts
import { CartItem } from '../domain/types';

export class MemoryCartStore {
  private items: Map<string, CartItem> = new Map();

  getAll(): CartItem[] {
    return Array.from(this.items.values());
  }

  add(item: CartItem): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.set(item.id, { ...item });
    }
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }
}