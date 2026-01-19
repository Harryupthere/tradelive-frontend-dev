const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const USER_KEY = import.meta.env.VITE_USER_KEY || "APP_USER";
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token: string) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const removeRefreshToken = () =>
  localStorage.removeItem(REFRESH_TOKEN_KEY);


export const getTokenKey = () => TOKEN_KEY;

// user helpers
export const setUser = (user: any): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user || null));
  } catch {
    // ignore
  }
};

export const getUser = (): any | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};
