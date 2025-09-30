const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getTokenKey = () => TOKEN_KEY;
