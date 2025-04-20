import { qsStableStringify } from "@/utils/qs";
import axios, { AxiosInstance } from "axios";

type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: never;
};

type ErrorResponse = {
  success: false;
  message: string;
  data?: never;
};

export type TBaseResponseData = {
  id: string;
  createdAt: Date;
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
export class AxiosService {
  private static axiosService: AxiosService;
  private instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_HOST_API,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  get getInstance() {
    return this.instance;
  }

  static init = () => {
    if (!AxiosService.axiosService) {
      AxiosService.axiosService = new AxiosService();
    }
    return AxiosService.axiosService;
  };

  get = async <D = any>(
    path: string,
    query?: Record<string, any>
  ): Promise<ApiResponse<D>> => {
    const q = query
      ? `?${qsStableStringify(query, {
          arrayFormat: "comma",
        })}`
      : "";
    return this.instance
      .get(`${path}${q}`)
      .then((r) => r.data)
      .catch((err) => err.response.data);
  };

  post = async <D = any>(
    path: string,
    body: Record<string, any>
  ): Promise<ApiResponse<D>> => {
    return this.instance
      .post(path, body)
      .then((r) => r.data)
      .catch((err) => err.response.data);
  };
}
