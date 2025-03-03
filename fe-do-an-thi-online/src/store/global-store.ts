import { create } from "zustand";

interface User {
  // id: string;
  name: string;
  email: string;
  isAdmin: boolean
}

interface GlobalStore {
  user: User | null;
  loading: boolean;
  statusCreateUpdate: { label: string; status: boolean };
  error: string | null;
  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  
  setError: (error: string | null) => void;
  clearError: () => void;

  createStatusCreateUpdate: (label: string, status: boolean) => void;
  clearStatusCreateUpdate: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  statusCreateUpdate: { label: "", status: false },
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  createStatusCreateUpdate: (label, status) => set({ statusCreateUpdate: { label, status } }),
  clearStatusCreateUpdate: () => set({ statusCreateUpdate: { label: "", status: false } }),
}));
