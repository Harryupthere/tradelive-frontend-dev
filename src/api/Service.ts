import { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "../services/axios";

type ApiData = Record<string, any>;

export async function apiRequest<T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: ApiData,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    method,
    url,
    ...options,
  };

  if (data) {
    if (method === "get" || method === "delete") {
      config.params = data;
    } else {
      config.data = data;
    }
  }

  return axios(config);
}

// Convenience methods
export const api = {
  get: <T = any>(url: string, params?: ApiData, options?: AxiosRequestConfig) =>
    apiRequest<T>("get", url, params, options),

  post: <T = any>(url: string, data?: ApiData, options?: AxiosRequestConfig) =>
    apiRequest<T>("post", url, data, options),

  put: <T = any>(url: string, data?: ApiData, options?: AxiosRequestConfig) =>
    apiRequest<T>("put", url, data, options),

  patch: <T = any>(url: string, data?: ApiData, options?: AxiosRequestConfig) =>
    apiRequest<T>("patch", url, data, options),

  delete: <T = any>(url: string, params?: ApiData, options?: AxiosRequestConfig) =>
    apiRequest<T>("delete", url, params, options),
};