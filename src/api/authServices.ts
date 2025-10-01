import { API_ENDPOINTS } from "../constants/ApiEndPoints";
import { api } from "./Service";

export interface LoginPayload {
  email: string;
  password: string;
  login_type:number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    [key: string]: any; // in case backend sends extras
  };
}

export const loginService = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(API_ENDPOINTS.login, data);
  return response.data;
};
