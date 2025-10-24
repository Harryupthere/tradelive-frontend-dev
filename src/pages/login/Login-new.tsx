import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Login-new.scss";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { LoginPayload, loginService } from "../../api/authServices";
import { errorMsg, successMsg } from "../../utils/customFn";
import TelegramLogin from "./telegram";
import { useAppDispatch } from "../../utils/redux/typedHook";
import { setCredentials } from "../../utils/redux/slice";
import {
  setToken as persistToken,
  setUser as persistUser,
  getUser
} from "../../utils/tokenUtils";

const base = import.meta.env.VITE_BASE;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(()=>{
    if(getUser()?.email){
      navigate(`${base}`)
    } 
  },[])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    defaultValues: { email: "", password: "", login_type: 1 },
  });

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    setLoading(true);
    try {
      data.login_type = 1;
      const res = await loginService(data);
      if (res?.status) {
        const token = res?.data?.data?.access_token;
        // if backend also returns user object, adapt the path accordingly.
        const user = res?.data?.data?.user || res?.data?.data?.profile || null;

        // maintain existing context login if you still use it
        login(token);

        // persist token + user and set in redux
        if (token) {
          persistToken(token);
        }
        if (user) {
          persistUser(user);
        }

        // dispatch to redux
        dispatch(setCredentials({ token, user }));

        successMsg(res.message);
        navigate(`${base}`);
      } else {
        errorMsg(res?.message || "Login failed");
      }
    } catch (err: any) {
      errorMsg(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google login (placeholder / simulate login_type=2)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const payload: LoginPayload = {
          email: res.data.email,
          password: "",
          login_type: 2,
        } as any;
        const ress = await loginService(payload);
        const token = ress?.data?.data?.access_token;
        // if backend also returns user object, adapt the path accordingly.
        const user = ress?.data?.data?.user || ress?.data?.data?.profile || null;

        // maintain existing context login if you still use it
        login(token);

        // persist token + user and set in redux
        if (token) {
          persistToken(token);
        }
        if (user) {
          persistUser(user);
        }

        // dispatch to redux
        dispatch(setCredentials({ token, user }));

        successMsg(ress.message);
        navigate(`${base}`);
      } catch (err: any) {
        errorMsg(err?.response?.data?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="login-page">
      <div className="login-page__form-section">
        <div className="login-page__form-container">
          <div className="login-page__header">
            {<div className="login-page__header-left">
              <h2 className="login-page__title">Login</h2>
              <p className="login-page__subtitle">Welcome Back!</p>
            </div>
            }
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">Email</span>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Enter a valid email",
                    },
                  })}
                  type="email"
                  placeholder="Enter registered email"
                  className="login-page__phone-field"
                />
              </div>
              {errors.email && (
                <p className="login-page__error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">Password</span>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="login-page__phone-field"
                />
                <button
                  type="button"
                  className="login-page__toggle-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="login-page__error">{errors.password.message}</p>
              )}

              <p className="login-page__otp-info">
                <a
                  onClick={() => navigate(`${base}forgot-password`)}
                  className="login-page__signup-link"
                >
                  Forget Password?
                </a>
              </p>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="login-page__send-otp-btn"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-page__divider">
            <span>Or</span>
          </div>

          {/* Social Login Buttons */}
          <div className="login-page__social-buttons">
            <button
              onClick={() => handleGoogleLogin()}
              className="login-page__social-btn login-page__google-btn"
              type="button"
              disabled={loading}
            >
              <div className="login-page__google-icon">G</div>
              Continue With Google
            </button>
            <div className="login-page__header-right">
              <span className="login-page__new-user">New User? </span>
              <a
                onClick={() => navigate(`${base}signup`)}
                className="login-page__signup-link">
                Sign Up
              </a>
            </div>
            {/* <TelegramLogin
              redirectUrl={"https://tradelive.com/test/telegram-auth"}
            >
              <button
                //onClick={() => window.open(`${base}/telegram-login`, "_blank")}
                className="login-page__social-btn login-page__email-btn"
                type="button"
                disabled={loading}
              >
                <Mail className="login-page__email-icon" size={20} />
                Continue With Telegram
              </button>
            </TelegramLogin> */}
          </div>

          <div className="login-page__consent">
            <label className="login-page__checkbox-container">
              <input
                type="checkbox"
                checked={acceptMarketing}
                onChange={(e) => setAcceptMarketing(e.target.checked)}
              />
              <span className="login-page__checkmark"></span>
              <span className="login-page__consent-text">
                I accept to receive marketing & promotional mails from
                Tradelive24
              </span>
            </label>
          </div>

          <div className="login-page__legal">
            <p>
              By signing in, you agree to our{" "}
              <a
                href={`${base}terms-and-condition`}
                className="login-page__legal-link"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href={`${base}terms-and-condition`}
                className="login-page__legal-link"
              >
                Terms & Conditions
              </a>
            </p>
          </div>

        </div>

      </div>

      <div className="login-page__promo">
        <div className="login-page__video-container">
          <h2 className="login-page__heading">Learn.</h2>
          <h2 className="login-page__heading">Adapt.</h2>
          <h2 className="login-page__heading">React.</h2>
          <div className="login-page__tagline"> Built by traders, for traders</div>
          <Link to={`${base}`}>
          <img src="/test/graph-logo.png" alt="logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
