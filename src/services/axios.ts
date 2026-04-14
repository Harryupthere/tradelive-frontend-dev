import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { getToken, getRefreshToken, setToken } from "../utils/tokenUtils";
import { getDeviceId, getUserAgent } from "../utils/deviceUtils";
import { clearToken } from "../utils/tokenUtils"; // function to remove token from localStorage/session
import { store } from "../utils/redux/store"; // ✅ import store
import { logout, setCredentials } from "../utils/redux/slice"; // ✅ import logout action
import { errorMsg } from "../utils/customFn";
let ReactAppUrl: string;

const base = import.meta.env.VITE_BASE;
if (import.meta.env.VITE_ENV === "production") {
  ReactAppUrl = import.meta.env.VITE_PRODUCTION_API_URL;
} else {
  ReactAppUrl = import.meta.env.VITE_API_URL;
}

const instance: AxiosInstance = axios.create({
  baseURL: ReactAppUrl,
});

let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Make the interceptor async
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // ✅ Wait for device fingerprint (async)
    const deviceId = await getDeviceId();
    const userAgent = getUserAgent();

    const accessToken = getToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // ✅ Always attach device info
    config.headers["x-device-id"] = deviceId;
    config.headers["x-user-agent"] = userAgent;

    return config;
  }
);
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;
    if (!error.response) {
      errorMsg("Network error");
      return Promise.reject(error);
    }
    const { status, data } = error.response;
    const message = data?.message;
    /**
     * 🚨 MULTIPLE LOGIN
     */
    console.log("status",status,message);
    if (status === 401 && message === "Multiple login attempts detected.") {
      //alert("mulyi ex");

      store.dispatch(logout());
      errorMsg(message);
     window.location.href = `${base}login`;
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      message === "Unauthorized" &&
      !originalRequest._retry
    ) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = response.data.data.access_token;

        setToken(newAccessToken);
        store.dispatch(setCredentials({ token: newAccessToken }));

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        console.log(err);
        processQueue(err, null);
        store.dispatch(logout());

        errorMsg("Session expired. Please login again.");
        window.location.href = `${base}login`;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      status === 401 &&
      (message === "REFRESH_TOKEN_EXPIRED" ||
        message === "Invalid refresh token" ||
        message === "Session expired")
    ) {
      // alert("session ex");
      store.dispatch(logout());
      errorMsg("Session expired. Please login again.");
      window.location.href = `${base}login`;
      return Promise.reject(error);
    }

    /**
     * ℹ️ OTHER ERRORS
     */
    errorMsg(message?message:"message" || "Something went wrong");
    return Promise.reject(error);
  }
);

export default instance;
