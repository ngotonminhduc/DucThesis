import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService, TRegister, TUser } from "@/services/authService";
import { cookieStorage } from "@/utils/cookie";

export type AuthType = "default" | "login" | "register";

interface AuthState {
  user: TUser | null;
  type: AuthType;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: TRegister) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: cookieStorage.getItem(authService.authCookieCname) as string,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  type: "default",
  error: null,
  login: async (email, password) => {
    set({ isLoading: true });
    const r = await authService.login(email, password);
    if (r.message) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: r.message,
        type: "login",
      });
      return;
    }
    const { token } = r.data!;
    cookieStorage.setItem(authService.authCookieCname, token);
    set({
      isLoading: false,
      isAuthenticated: true,
      token,
      type: "default",
    });
  },
  register: async (data) => {
    set({
      isLoading: true,
      error: null,
    });
    const r = await authService.register(data);
    if (r.message) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: r.message,
        type: "register",
      });
      return;
    }
    const { token } = r.data!;
    cookieStorage.setItem(authService.authCookieCname, token);
    set({
      isLoading: false,
      isAuthenticated: true,
      type: "default",
      token
    });
  },
  logout: () => {
    cookieStorage.removeItem(authService.authCookieCname);
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  },
  checkAuthStatus: async () => {
    const { token } = get();
    if (!token) return;
    set({ isLoading: true });
    const r = await authService.me();
    if (r.message) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return;
    }
    set({
      isLoading: false,
      isAuthenticated: true,
      user: r.data!,
    });
  },
  clearError: () => {
    set({ error: null });
  },
}));
