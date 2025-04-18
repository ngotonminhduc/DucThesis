import { StateStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { getSecond } from "./time";

const COOKIE_EXPIRY_DAYS = getSecond(7, "day");

export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = Cookies.get(name);
    return value ? value : null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: COOKIE_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};
