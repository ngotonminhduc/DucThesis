// store/global-store.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface GlobalStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ✅ Tạo Zustand Store với kiểu GlobalStore
export const useGlobalStore = create<GlobalStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
