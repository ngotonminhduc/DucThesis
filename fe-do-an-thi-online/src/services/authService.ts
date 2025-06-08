import { AxiosError, AxiosRequestHeaders } from "axios";
import { AxiosService, TBaseResponseData } from "./axiosService";
import { cookieStorage } from "@/utils/cookie";

export enum RoleName {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

export type TRole = {
  id: string;
  name: RoleName;
  description: string;
};

export type TUser = {
  email: string;
  name: string;
  isAdmin: boolean;
  roles: TRole[];
} & TBaseResponseData;

export type TRegister = Pick<TUser, "name" | "email"> & { password: string };
export type TSocialLoginType = "google" | "facebook";

export class AuthService {
  private static instance: AuthService;
  private api: AxiosService;
  authCookieCname = "authUser";

  private constructor() {
    this.api = AxiosService.init();
    this.setupInterceptors();
  }

  static init(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getToken = () => {
    return cookieStorage.getItem(this.authCookieCname);
  };

  private setupInterceptors(): void {
    this.api.getInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          } as AxiosRequestHeaders;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  login = async (email: string, password: string) => {
    return this.api.post<{ token: string }>("/login", {
      email,
      password,
    });
  };

  loginWithSocial = async (accessToken: string, type: TSocialLoginType) => {
    return this.api.post<{ token: string }>("/social-login", {
      accessToken,
      type,
    });
  };

  register = async ({ email, name, password }: TRegister) => {
    return this.api.post<{ token: string }>("/register", {
      name,
      email,
      password,
    });
  };

  me = () => {
    return this.api.get<TUser>("/me");
  };
}

export const authService = AuthService.init();
