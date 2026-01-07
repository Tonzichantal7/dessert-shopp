import { CartItem } from "./dessert.types.js";
import { DessertId } from "./enums.types.js";

export type CartEvent =
  | { type: "ITEM_ADDED"; item: CartItem }
  | { type: "ITEM_REMOVED"; dessertId: DessertId }
  | { type: "QUANTITY_UPDATED"; dessertId: DessertId; quantity: number }
  | { type: "CART_CLEARED" }
  | { type: "CART_LOADED"; items: CartItem[] };

export type CartEventCallback = (event: CartEvent) => void;