import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { getToken } from "./tokenUtils";
import { AxiosRequestConfig } from "axios";

export const errorMsg = (message?: string): string | undefined => {
  const msg = message || "Something went wrong";
  toast.error(msg, { id: "error-toast" });
  return message;
};

export const successMsg = (message: string = "Success"): void => {
  toast.success(message, { id: "success-toast" });
};

export const getHeader = (): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: getToken(),  
    },
  };
};

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: {
        detail?: string;
      };
    };
  };
}

export const handleCatchErrors = (error: ApiError, navigate: NavigateFunction): void => {
  const { status, data } = error.response || {};

  if (error.response !== undefined) {
    if (data?.message) {
      errorMsg(data?.error?.detail || data?.message);
    }
    switch (status) {
      case 409:
        if (data?.message) {
          errorMsg(data?.message);
        }
        break;
      case 403:
      case 401:
      case 402:
      case 400:
      case 404:
      case 422:
      case 500:
        break;
      default:
        navigate("/");
    }
  }
};

export const buildUrl = (
  baseUrl: string,
  params: Record<string, string | number | boolean> = {}
): string => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {})
  ).toString();

  return query ? `${baseUrl}?${query}` : baseUrl;
};
