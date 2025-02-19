import { create } from "zustand";
import axios from "axios";
import { useGlobalStore } from "./global-store";
import ApiService from "@/utils/api";
import { toast } from "react-toastify";


interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
  veryfitoken: () => Promise<User | {sucess: boolean, message: string}>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (email, password) => {
    const { setLoading, setError } = useGlobalStore.getState();

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_API}/login`, { email, password });
      set({ user: res.data.data });
      if (res.data.data) {
        document.cookie = `authToken=${res.data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
      return res.data.data
    } catch (error) {
      toast.error(error.response.data.message);
      // setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  },

  register: async (name, email, password) => {
    const { setLoading, setError } = useGlobalStore.getState();

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_API}/register`, { name, email, password });
      set({ user: res.data });
      return res.data.data
    } catch (error) {
      toast.error(error.response.data.message)
      // setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  },

  veryfitoken: async () =>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_HOST_API}/me`);
    console.log('res: ', res.data);
    return res.data.data
  },

  logout: () => set({ user: null }),
}));
