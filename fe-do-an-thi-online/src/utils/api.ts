import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiService {
  private static instance: AxiosInstance;

  private constructor() {} // Prevent direct instantiation

  public static getInstance(): AxiosInstance {
    if (!ApiService.instance) {
      ApiService.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_HOST_API,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      });

      // Request interceptor
      ApiService.instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem("authToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor
      ApiService.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error("API Error:", error);
          return Promise.reject(error);
        }
      );
    }
    return ApiService.instance;
  }

  // Generic GET request with params
  public static async get<T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().get(url, {
      ...config,
      params,
      withCredentials: true, // Ensure credentials are sent
    });
    return response.data;
  }

  // Generic POST request with body
  public static async post<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().post(url, data, {
      ...config,
      withCredentials: true, // Ensure credentials are sent
    });
    return response.data;
  }

  // Generic PUT request with body
  public static async put<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().put(url, data, {
      ...config,
      withCredentials: true, // Ensure credentials are sent
    });
    return response.data;
  }

  // Generic PATCH request with body
  public static async patch<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().patch(url, data, {
      ...config,
      withCredentials: true, // Ensure credentials are sent
    });
    return response.data;
  }

  // Generic DELETE request with params
  public static async delete<T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().delete(url, {
      ...config,
      params,
      withCredentials: true, // Ensure credentials are sent
    });
    return response.data;
  }
}

export default ApiService;
