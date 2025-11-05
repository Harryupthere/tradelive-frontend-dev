import React, { useState,useEffect } from "react";
import { Mail } from "lucide-react";
import "./Login-new.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { errorMsg, successMsg } from "../../utils/customFn";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
 import { getUser
} from "../../utils/tokenUtils";
const base = import.meta.env.VITE_BASE;

type FormValues = {
  email: string;
};

const ForgetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
    useEffect(()=>{
      if(getUser()?.email){
        navigate(`${base}`)
      } 
    },[])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.forgetPassword, {
        email: data.email,
      });
      successMsg(res?.data.data?.message || "Password reset link generated.");
      // backend prints reset link to console — navigate user to login
      navigate(`${base}login`);
    } catch (err: any) {
      errorMsg(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-page__form-section">
        <div className="login-page__form-container">
          <div className="login-page__header">
            <div className="login-page__header-left">
                <Link to={`${base}`} className="show-mobile">
                  <img src="/test/logo3.png" alt="logo" />
                </Link>
              <h2 className="login-page__title">Forgot Password</h2>
              <p className="login-page__subtitle">Enter your registered email</p>
            </div>
            <div className="login-page__header-right">
              <span className="login-page__new-user">Remembered? </span>
              <a onClick={() => navigate(`${base}login`)} className="login-page__signup-link">
                Login
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
              {errors.email && <p className="login-page__error">{errors.email.message}</p>}
            </div>

            <button type="submit" className="login-page__send-otp-btn" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="login-page__divider">
            <span>Or</span>
          </div>

          <div className="login-page__legal">
            <p>
              By requesting a reset, you agree to our{" "}
              <a href={`${base}terms-and-condition`} className="login-page__legal-link">
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
                <div className="login-page__tagline">
                  {" "}
                  Built by traders, for traders
                </div>
                <Link to={`${base}`}>
                  <img src="/test/graph-logo.png" alt="logo" />
                </Link>
              </div>
            </div>
    </div>
  );
};

export default ForgetPasswordPage;