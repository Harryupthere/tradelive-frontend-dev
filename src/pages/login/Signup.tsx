import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import "./Login-new.scss";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
// import { useGoogleSignup } from "@react-oauth/google";
import axios from "axios";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPo ints";
import { SignupPayload, signupService } from "../../api/authServices";
import { errorMsg, successMsg } from "../../utils/customFn";
import TelegramSignup from "./telegram";
import { useGoogleLogin } from "@react-oauth/google";

const base = import.meta.env.VITE_BASE;

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  referral_id?: string; // made optional
};

const SignupPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [urlReferral, setUrlReferral] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referral_id: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      // prefer referral from URL (set in useEffect), fallback to form field (trimmed).
      const referralFromUrl = urlReferral?.trim();
      const referralFromForm = data.referral_id?.trim();
      const referral = referralFromUrl || referralFromForm || null;

      const payload: SignupPayload = {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email,
        registration_type_id: 1, // form signup
        password: data.password,
      } as any;

      // add referral_id only when present
      if (referral) {
        payload.referral_id = referral;
      }

      const res = await signupService(payload);
      if (res?.status) {
        // login and redirect same as login flow
        // login(res?.data?.data?.access_token);
        successMsg(res.message);
        navigate(`${base}login`);
      } else {
        errorMsg(res?.message || "Signup failed");
      }
    } catch (err: any) {
      errorMsg(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // (Optional) Google signup flow should set registration_type_id = 2 — not implemented here.

  const passwordValue = watch("password");

  // fetch referral id from URL and save it in state + set form value
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const referral = params.get("referral") || params.get("ref") || "";
      if (referral) {
        setUrlReferral(referral);
        setValue("referral_id", referral);
      }
    } catch (e) {
      // ignore parsing errors
      console.warn("Failed to parse referral from URL", e);
    }
  }, [setValue]);

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

        // prefer referral from URL (set in useEffect), fallback to form field (trimmed).
        const referralFromUrl = urlReferral?.trim();
        // const referralFromForm = data.referral_id?.trim();
        const referral = referralFromUrl || null;

        const payload: SignupPayload = {
          first_name: res.data.given_name,
          last_name: res.data.family_name,
          email: res.data.email,
          password: null,
          login_type: 2,
        } as any;
        // add referral_id only when present
        if (referral) {
          payload.referral_id = referral;
        }

        const ress = await signupService(payload);
        if (ress?.status) {
          login(ress?.data?.data?.access_token);
          successMsg(ress.message);
          navigate(`${base}`);
        } else {
          errorMsg(ress?.message || "Google login failed");
        }
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
      <div className="login-page__promo">
        <div className="login-page__video-container">
          <video
            className="login-page__video"
            autoPlay
            muted
            loop
            poster="/test/signup-image.jpg"
          >
            <source src="/test/signup-video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="login-page__form-section">
        <div className="login-page__form-container">
          <div className="login-page__header">
            {
              <div className="login-page__header-left">
                <h2 className="login-page__title">Signup</h2>
                <p className="login-page__subtitle">Welcome!</p>
              </div>
            }
            <div className="login-page__header-right">
              {<span className="login-page__new-user">Existing User? </span>}
              <a
                onClick={() => navigate(`${base}login`)}
                className="login-page__signup-link"
              >
                Login
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* First Name */}
            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">First Name</span>
                <input
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  type="text"
                  placeholder="First name"
                  className="login-page__phone-field"
                />
              </div>
              {errors.first_name && (
                <p className="login-page__error">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">Last Name</span>
                <input
                  {...register("last_name")}
                  type="text"
                  placeholder="Last name"
                  className="login-page__phone-field"
                />
              </div>
            </div>

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
                  placeholder="Enter email"
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  placeholder="Enter password"
                  className="login-page__phone-field"
                />
              </div>
              {errors.password && (
                <p className="login-page__error">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">Confirm</span>
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val: string) =>
                      val === passwordValue || "Passwords do not match",
                  })}
                  type="password"
                  placeholder="Confirm password"
                  className="login-page__phone-field"
                />
              </div>
              {errors.confirmPassword && (
                <p className="login-page__error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Referral Id */}
            {/* {!urlReferral && <div className="login-page__input-group">
              <div className="login-page__phone-input">
                <span className="login-page__country-code">Referral ID</span>
                <input
                  {...register("referral_id")}
                  type="text"
                  placeholder="Enter Referral ID"
                  className="login-page__phone-field"
                />
              </div>
             
            </div>} */}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="login-page__send-otp-btn"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="login-page__divider">
            <span>Or</span>
          </div>

          {/* Social Signup Buttons (left commented as per existing file) */}
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
              By signing up, you agree to our{" "}
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
    </div>
  );
};

export default SignupPage;
