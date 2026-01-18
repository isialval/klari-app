import { Routine } from "../types/routine";
import api from "./api";

export const routineService = {
  // Obtener rutina activa de día
  getActiveDayRoutine: async (userId: number): Promise<Routine | null> => {
    try {
      const { data } = await api.get(`/routines/user/${userId}/day/active`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },
  

  // Obtener rutina activa de noche
  getActiveNightRoutine: async (userId: number): Promise<Routine | null> => {
    try {
      const { data } = await api.get(`/routines/user/${userId}/night/active`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  // Crear rutina inicial de día
  createInitialDayRoutine: async (userId: number): Promise<Routine> => {
    const { data } = await api.post(`/routines/user/${userId}/day/initial`);
    return data;
  },

  // Crear rutina inicial de noche
  createInitialNightRoutine: async (userId: number): Promise<Routine> => {
    const { data } = await api.post(`/routines/user/${userId}/night/initial`);
    return data;
  },

  // Agregar producto a rutina
  addProduct: async (routineId: number, productId: number): Promise<void> => {
    await api.post(`/routines/${routineId}/products/${productId}`);
  },

  // Quitar producto de rutina
  removeProduct: async (routineId: number, productId: number): Promise<void> => {
    await api.delete(`/routines/${routineId}/products/${productId}`);
  },

  // Eliminar rutina
  deleteRoutine: async (routineId: number): Promise<void> => {
    await api.delete(`/routines/${routineId}`);
  },

  // Obtener rutina por ID
  getById: async (routineId: number): Promise<Routine> => {
  const { data } = await api.get(`/routines/${routineId}`);
  return data;
},
};