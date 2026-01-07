export enum DessertCategory {
  Waffle = "Waffle",
  CremeBrulee = "Crème Brûlée",
  Macaron = "Macaron",
  Tiramisu = "Tiramisu",
  Baklava = "Baklava",
  Pie = "Pie",
  Cake = "Cake",
  Brownie = "Brownie",
  PannaCotta = "Panna Cotta"
}

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type Currency = "USD" | "EUR" | "GBP";
export type DessertId = string;