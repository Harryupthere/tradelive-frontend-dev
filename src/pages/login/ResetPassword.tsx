import React, { useState, useEffect } from "react";
import "./Login-new.scss";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { errorMsg, successMsg } from "../../utils/customFn";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";

const base = import.meta.env.VITE_BASE;

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("token");
      if(!t){
        navigate(`${base}`)
      }
      setToken(t);
    } catch (e) {
      console.warn("Failed to parse token from URL", e);
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const passwordValue = watch("newPassword");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!token) {
      errorMsg("Missing or invalid token");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.resetPassword, {
        token,
        newPassword: data.newPassword,
      });
      successMsg(res?.data.data?.message || "Password has been reset successfully");
      navigate(`${base}login`);
    } catch (err: any) {
      errorMsg(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__promo">
        <div className="login-page__video-container">
          <video className="login-page__video" autoPlay muted loop poster="/test/signup-image.jpg">
            <source src="/test/signup-video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="login-page__form-section">
        <div className="login-page__form-container">
          <div className="login-page__header">
            <div className="login-page__header-left">
              <h2 className="login-page__title">Reset Password</h2>
              <p className="login-page__subtitle">Set a new password</p>
            </div>
            <div className="login-page__header-right">
              <span className="login-page__new-user">Back to </span>
              <a onClick={() => navigate(`${base}login`)} className="login-page__signup-link">
                Login
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">New Password</span>
                <input
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  type="password"
                  placeholder="Enter new password"
                  className="login-page__phone-field"
                />
              </div>
              {errors.newPassword && <p className="login-page__error">{errors.newPassword.message}</p>}
            </div>

            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">Confirm</span>
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val: string) => val === passwordValue || "Passwords do not match",
                  })}
                  type="password"
                  placeholder="Confirm password"
                  className="login-page__phone-field"
                />
              </div>
              {errors.confirmPassword && <p className="login-page__error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="login-page__send-otp-btn" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="login-page__divider">
            <span>Or</span>
          </div>

          <div className="login-page__legal">
            <p>
              By resetting your password you agree to our{" "}
              <a href={`${base}terms-and-condition`} className="login-page__legal-link">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;