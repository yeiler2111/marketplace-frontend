// src/store/useGlobalStore.ts
import jwtService from '@/lib/jwt-decode/jwt';
import { create } from 'zustand';

interface JwtPayload {
  username: string;
  user_id: string;
  cart_id: string;
  exp: number;
  iss: string;
  aud: string;
}

interface GlobalStore {
  username: string;
  userId: string;
  cartId: string;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  initializeFromToken: (token: string) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  username: '',
  userId: '',
  cartId: '',
  selectedProductId: '',
  setSelectedProductId: (id: string) => set({ selectedProductId: id }),

  initializeFromToken: (token: string) => {
    try {
      const decoded = jwtService.decodeToken(token);
      const username = decoded.username;
      const userId = decoded.user_id;
      const cartId = decoded.cart_id;

      set({ username, userId, cartId });
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  },
}));


export default useGlobalStore