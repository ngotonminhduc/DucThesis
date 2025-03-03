import { create } from "zustand";
import axios from "axios";
import { useGlobalStore } from "./global-store";
import { toast } from "react-toastify";
import { LoginResponse, RegisterResponse, User } from "@/utils/type";

interface AuthState {
  token: string;
  login: (email: string, password: string) => Promise<LoginResponse | { success: false; message: string }>;
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
  verifyToken: () => Promise<User | { success: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: '',

  login: async (email, password) => {
    const { setLoading, setError, setUser } = useGlobalStore.getState();

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_API}/login`, { email, password, isAdmin: true });
      
      if (res.data.data) {
        set({ token: res.data.data.token });
        document.cookie = `authToken=${res.data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }

      return res.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  },

  register: async (name, email, password) => {
    const { setLoading, setError, setUser } = useGlobalStore.getState();

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_API}/register`, { name, email, password,isAdmin: true });
      if (res.data.data) {
        set({ token: res.data.data.token });
        document.cookie = `authToken=${res.data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
      return res.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  },

  verifyToken: async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_HOST_API}/me`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Token không hợp lệ!";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  logout: () => {
    const { setUser } = useGlobalStore.getState();

    document.cookie = "authToken=; path=/; max-age=0"; // Xoá cookie
    setUser(null);
  },
}));
