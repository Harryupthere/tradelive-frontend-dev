import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getToken } from "../utils/tokenUtils";

let ReactAppUrl: string;

if (import.meta.env.VITE_ENV === "production") {
  ReactAppUrl = import.meta.env.VITE_PRODUCTION_API_URL;
} else {
  ReactAppUrl = import.meta.env.VITE_API_URL;
}

const instance: AxiosInstance = axios.create({
  baseURL: ReactAppUrl,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  
  const accessToken = getToken();
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

export default instance;