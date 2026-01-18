import { Product } from "./product";

export interface Routine {
  id: number;
  routineType: "DIA" | "NOCHE";
  active: boolean;
  createdAt: string;
  products: Product[];
}