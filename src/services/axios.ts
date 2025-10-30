import axios, { AxiosInstance, InternalAxiosRequestConfig ,AxiosError} from "axios";
import { getToken } from "../utils/tokenUtils";
import { getDeviceId, getUserAgent } from "../utils/deviceUtils";
import { clearToken } from "../utils/tokenUtils"; // function to remove token from localStorage/session
import { store } from "../utils/redux/store"; // ✅ import store
import { logout } from "../utils/redux/slice"; // ✅ import logout action
let ReactAppUrl: string;

const base=import.meta.env.VITE_BASE;
if (import.meta.env.VITE_ENV === "production") {
  ReactAppUrl = import.meta.env.VITE_PRODUCTION_API_URL;
} else {
  ReactAppUrl = import.meta.env.VITE_API_URL;
}

const instance: AxiosInstance = axios.create({
  baseURL: ReactAppUrl,
});

// ✅ Make the interceptor async
instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
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
});
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      // Check for session expiry or invalid device
      if (
        status === 401 &&
        message === "Session expired or invalid device."
      ) {
        // Logout only if the user is logged in
        const currentState = store.getState();
        if (currentState.auth.status === "authenticated") {
          store.dispatch(logout());
        }

        // Optional: redirect to login page
        window.location.href = `${base}login`;
      }
    }

    // Pass error forward so you can still catch it in components if needed
    return Promise.reject(error);
  }
);

export default instance;
