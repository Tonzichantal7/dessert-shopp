import {
  Order,
  OrderStatus,
  Currency,
  OrderDetails,
  CartItem
} from "../types/index.js";
import { ShoppingCart } from "./ShoppingCart.js";

export class OrderManager {
  private orders: Map<string, Order>;
  private orderIdCounter: number;

  constructor() {
    this.orders = new Map();
    this.orderIdCounter = 1;
  }

  private calculateTotal(items: CartItem[], taxRate: number = 0): { subtotal: number; tax: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.dessert.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  private generateOrderId(counter: number): string {
    return `ORDER-${counter.toString().padStart(4, '0')}`;
  }

  createOrder(
    cart: ShoppingCart,
    currency: Currency = "USD",
    taxRate: number = 0
  ): Order {
    if (cart.isEmpty) {
      throw new Error("Cannot create order from empty cart");
    }

    const items = cart.getItems();
    const { subtotal, tax, total } = this.calculateTotal(items, taxRate);
    
    const orderDetails: OrderDetails = {
      items,
      subtotal,
      tax,
      total,
      currency
    };

    const order: Order = {
      id: this.generateOrderId(this.orderIdCounter++),
      details: orderDetails,
      status: "pending",
      createdAt: new Date()
    };

    this.orders.set(order.id, order);
    return order;
  }

  confirmOrder(orderId: string): Order {
    const order = this.orders.get(orderId);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status: "confirmed" as OrderStatus, confirmedAt: new Date() };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return Array.from(this.orders.values()).filter(order => order.status === status);
  }

  getTotalRevenue(): number {
    return this.getAllOrders()
      .filter(order => order.status === "completed")
      .reduce((sum, order) => sum + order.details.total, 0);
  }

  deleteOrder(orderId: string): boolean {
    return this.orders.delete(orderId);
  }

  clearAllOrders(): void {
    this.orders.clear();
  }
}