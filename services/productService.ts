import api from "./api";

export type ProductSummaryDTO = {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  category: string;
};

export type Product = {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  category: string;
  description: string;
  ingredients: string[];
  applicationTime: string;
  skinTypes: string[];
  goals: string[];
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

export const productService = {
  getPage: async (
    page: number = 0,
    size: number = 20,
  ): Promise<PageResponse<ProductSummaryDTO>> => {
    const { data } = await api.get(
      `/products/summary?page=${page}&size=${size}`,
    );
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  getSummaryById: async (id: number): Promise<ProductSummaryDTO> => {
    const { data } = await api.get(`/products/${id}/summary`);
    return data;
  },

  search: async (
    query?: string,
    category?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PageResponse<Product>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    const { data } = await api.get(`/products/search?${params}`);
    return data;
  },

  getByCategory: async (
    category: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PageResponse<Product>> => {
    const { data } = await api.get(
      `/products/category/${category}?page=${page}&size=${size}`,
    );
    return data;
  },

  getRecommendations: async (
    category: string,
    time: string,
    skinType: string,
    goals: string[],
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<ProductSummaryDTO>> => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("time", time);
    params.append("skinType", skinType);
    params.append("goals", goals.join(","));
    params.append("page", page.toString());
    params.append("size", size.toString());
    const { data } = await api.get(`/products/routine/recommend?${params}`);
    return data;
  },

  getRecommendationsSimple: async (
    category: string,
    time: string,
    skinType: string,
    goals: string[],
    limit: number = 10,
  ): Promise<ProductSummaryDTO[]> => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("time", time);
    params.append("skinType", skinType);
    params.append("goals", goals.join(","));
    params.append("limit", limit.toString());
    const { data } = await api.get(
      `/products/routine/recommend/simple?${params}`,
    );
    return data;
  },
};
