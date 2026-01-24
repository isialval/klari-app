export interface Product {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  ingredients: string;
  description: string;
  category: string;
  applicationTime: string;
  goals: string[];
  skinTypes: string[];
}

export type ProductSummaryDTO = {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  category: string;
};

export type PageResponse<T> = {
  content: T[];
  last: boolean;
  first: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};
