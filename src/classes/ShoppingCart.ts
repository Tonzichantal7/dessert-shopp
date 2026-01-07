import { Dessert, CartItem, CartEvent, CartEventCallback } from "../types/index.js";

export class ShoppingCart {
  private items: Map<string, CartItem> = new Map();
  private subscribers: CartEventCallback[] = [];

  addItem(dessert: Dessert, quantity: number = 1): void {
    const existing = this.items.get(dessert.id);
    if (existing) {
      existing.quantity += quantity;
      this.emit({ type: "QUANTITY_UPDATED", dessertId: dessert.id, quantity: existing.quantity });
    } else {
      const item: CartItem = { dessert, quantity, addedAt: new Date() };
      this.items.set(dessert.id, item);
      this.emit({ type: "ITEM_ADDED", item });
    }
  }

  removeItem(dessertId: string): void {
    if (this.items.delete(dessertId)) {
      this.emit({ type: "ITEM_REMOVED", dessertId });
    }
  }

  updateQuantity(dessertId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(dessertId);
    } else {
      const item = this.items.get(dessertId);
      if (item) {
        item.quantity = quantity;
        this.emit({ type: "QUANTITY_UPDATED", dessertId, quantity });
      }
    }
  }

  incrementQuantity(dessertId: string): void {
    const item = this.items.get(dessertId);
    if (item) this.updateQuantity(dessertId, item.quantity + 1);
  }

  decrementQuantity(dessertId: string): void {
    const item = this.items.get(dessertId);
    if (item) this.updateQuantity(dessertId, item.quantity - 1);
  }

  getTotal(): number {
    return Array.from(this.items.values())
      .reduce((sum, item) => sum + (item.dessert.price * item.quantity), 0);
  }

  getItemCount(): number {
    return Array.from(this.items.values())
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  getItem(dessertId: string): CartItem | undefined {
    return this.items.get(dessertId);
  }

  clear(): void {
    this.items.clear();
    this.emit({ type: "CART_CLEARED" });
  }

  get isEmpty(): boolean {
    return this.items.size === 0;
  }

  hasItem(dessertId: string): boolean {
    return this.items.has(dessertId);
  }

  subscribe(callback: CartEventCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  private emit(event: CartEvent): void {
    this.subscribers.forEach(callback => callback(event));
  }
}