import { CartItem } from "./dessert.types.js";
import { Currency, OrderStatus } from "./enums.types.js";

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: Currency;
}

export interface Order {
  id: string;
  details: OrderDetails;
  status: OrderStatus;
  createdAt: Date;
  confirmedAt?: Date;
}