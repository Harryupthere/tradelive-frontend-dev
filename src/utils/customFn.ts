import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { getToken } from "./tokenUtils";
import { AxiosRequestConfig } from "axios";

export const toastOptions = {
    style: {
        padding: "10px 16px",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(22, 163, 74, 0.3)",
    },
    success: {
        style: {
            background: "#22c55e",
            color: "#fff",
        },
    },
    error: {
        style: {
            background: "#ff0101",
            color: "#fff",
        },
    },
};
export const formatDate = (
  dateString: string | Date | null | undefined,
  format: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" = "DD/MM/YYYY"
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
};

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
