import { DessertCategory, DessertId } from "./enums.types.js";

export interface Dessert {
  id: DessertId;
  name: string;
  category: DessertCategory;
  price: number;
  image: string;
  description?: string;
  inStock: boolean;
}

export interface CartItem {
  dessert: Dessert;
  quantity: number;
  addedAt: Date;
}