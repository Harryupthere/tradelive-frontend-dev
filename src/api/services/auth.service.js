import { useState } from "react";
import { apiService } from "../Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useNavigate } from "react-router-dom";
import { buildUrl, errorMsg } from "../../utils/customFn";

const useAuthService = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (data, params = {}) => {
    setLoading(true);
    try {
      const url = buildUrl(API_ENDPOINTS?.login, params);
      return await apiService.post(url, data, navigate);
    } catch (error) {
      errorMsg(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data, params = {}) => {
    setLoading(true);
    try {
      const url = buildUrl(API_ENDPOINTS?.forgot_password, params);
      return await apiService.post(url, data, navigate);
    } catch (error) {
      errorMsg(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (data, params = {}) => {
    setLoading(true);
    try {
      const url = buildUrl(API_ENDPOINTS?.verify_otp, params);
      return await apiService.post(url, data, navigate);
    } catch (error) {
      errorMsg(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data, params = {}) => {
    setLoading(true);
    try {
      const url = buildUrl(API_ENDPOINTS?.update_password, params);
      return await apiService.post(url, data, navigate);
    } catch (error) {
      errorMsg(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    forgotPassword,
    verifyOTP,
    updatePassword,
  };
};

export default useAuthService;
