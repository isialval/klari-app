export interface Product {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  ingredients: string;
  description: string;
  category: string;  // "LIMPIADOR", "TONICO", etc.
  applicationTime: string;  // "DIA", "NOCHE", "AMBOS"
  goals: string[];
  skinTypes: string[];
}