import { Product } from "../types/product";
import api from "./api";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get("/products");
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  search: async (query?: string, category?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    const { data } = await api.get(`/products/search?${params}`);
    return data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await api.get(`/products/category/${category}`);
    return data;
  },
};