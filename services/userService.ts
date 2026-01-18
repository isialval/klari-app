import { Product } from "../types/product";
import api from "./api";

export const userService = {
  // Favoritos
  getFavorites: async (userId: number): Promise<Product[]> => {
    const { data } = await api.get(`/users/${userId}/favorites`);
    return data;
  },

  addFavorite: async (userId: number, productId: number): Promise<void> => {
    await api.post(`/users/${userId}/favorites/${productId}`);
  },

  removeFavorite: async (userId: number, productId: number): Promise<void> => {
    await api.delete(`/users/${userId}/favorites/${productId}`);
  },

  // Inventario
  getInventory: async (userId: number): Promise<Product[]> => {
    const { data } = await api.get(`/users/${userId}/inventory`);
    return data;
  },

  addToInventory: async (userId: number, productId: number): Promise<void> => {
    await api.post(`/users/${userId}/inventory/${productId}`);
  },

  removeFromInventory: async (userId: number, productId: number): Promise<void> => {
    await api.delete(`/users/${userId}/inventory/${productId}`);
  },
};