import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getToken, getUser, removeToken, removeUser, setToken, setUser } from "../tokenUtils";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
  status: "idle" | "authenticated" | "logged_out";
};

const initialState: AuthState = {
  token: getToken() || null,
  user: (getUser() as User) || null,
  status: getToken() ? "authenticated" : "logged_out",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user?: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user || state.user;
      state.status = "authenticated";
      setToken(action.payload.token);
      if (action.payload.user) setUser(action.payload.user);
    },
    setUserProfile: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) setUser(action.payload); else removeUser();
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = "logged_out";
      removeToken();
      removeUser();
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;
export default authSlice.reducer;