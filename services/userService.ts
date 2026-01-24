import api from "./api";

export type ProductSummaryDTO = {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  category: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  skinType: string;
  goals: string[];
};

export const userService = {
  getProfile: async (userId: number): Promise<UserProfile> => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  getFavorites: async (
    userId: number,
    page: number = 0,
    size: number = 10,
    category?: string,
  ): Promise<PageResponse<ProductSummaryDTO>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (category) {
      params.append("category", category);
    }
    const { data } = await api.get(
      `/users/${userId}/favorites/summary?${params}`,
    );
    return data;
  },

  isFavorite: async (userId: number, productId: number): Promise<boolean> => {
    const { data } = await api.get(
      `/users/${userId}/favorites/${productId}/exists`,
    );
    return data;
  },

  addFavorite: async (userId: number, productId: number): Promise<void> => {
    await api.post(`/users/${userId}/favorites/${productId}`);
  },

  removeFavorite: async (userId: number, productId: number): Promise<void> => {
    await api.delete(`/users/${userId}/favorites/${productId}`);
  },

  getInventory: async (
    userId: number,
    page: number = 0,
    size: number = 10,
    category?: string,
  ): Promise<PageResponse<ProductSummaryDTO>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (category) {
      params.append("category", category);
    }
    const { data } = await api.get(
      `/users/${userId}/inventory/summary?${params}`,
    );
    return data;
  },

  isInInventory: async (
    userId: number,
    productId: number,
  ): Promise<boolean> => {
    const { data } = await api.get(
      `/users/${userId}/inventory/${productId}/exists`,
    );
    return data;
  },

  addToInventory: async (userId: number, productId: number): Promise<void> => {
    await api.post(`/users/${userId}/inventory/${productId}`);
  },

  removeFromInventory: async (
    userId: number,
    productId: number,
  ): Promise<void> => {
    await api.delete(`/users/${userId}/inventory/${productId}`);
  },
};
