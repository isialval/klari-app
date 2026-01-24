import { Routine } from "../types/routine";
import api from "./api";

export const routineService = {
  getActiveDayRoutine: async (userId: number): Promise<Routine | null> => {
    try {
      const { data } = await api.get(`/routines/user/${userId}/day/active`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  getActiveNightRoutine: async (userId: number): Promise<Routine | null> => {
    try {
      const { data } = await api.get(`/routines/user/${userId}/night/active`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  createInitialDayRoutine: async (userId: number): Promise<Routine> => {
    const { data } = await api.post(`/routines/user/${userId}/day/initial`);
    return data;
  },

  createInitialNightRoutine: async (userId: number): Promise<Routine> => {
    const { data } = await api.post(`/routines/user/${userId}/night/initial`);
    return data;
  },

  addProduct: async (routineId: number, productId: number): Promise<void> => {
    await api.post(`/routines/${routineId}/products/${productId}`);
  },

  removeProduct: async (
    routineId: number,
    productId: number,
  ): Promise<void> => {
    await api.delete(`/routines/${routineId}/products/${productId}`);
  },

  deleteRoutine: async (routineId: number): Promise<void> => {
    await api.delete(`/routines/${routineId}`);
  },

  getById: async (routineId: number): Promise<Routine> => {
    const { data } = await api.get(`/routines/${routineId}`);
    return data;
  },
};
