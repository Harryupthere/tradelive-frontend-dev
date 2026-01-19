import React, { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import "./Login-new.scss";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/Service";
import { errorMsg, successMsg } from "../../utils/customFn";

const base = import.meta.env.VITE_BASE;

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verify = async () => {
      setStatus("loading");
      try {
        const res = await api.get(`auth/verify-email?token=${encodeURIComponent(token)}`);
        if (res?.status) {
          setStatus("success");
          setMessage(res?.data?.message || "Your email has been verified successfully.");
          successMsg(res?.data?.message || "Email verified");
        } else {
          setStatus("error");
          const msg = res?.data?.message || "Verification failed.";
          setMessage(msg);
          errorMsg(msg);
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Verification failed.";
        setStatus("error");
        setMessage(msg);
        errorMsg(msg);
      }
    };

    verify();
  }, []);

  const goHome = () => navigate(`${base}`);
  const goLogin = () => navigate(`${base}login`);

  return (
    <div className="login-page">
      <div className="login-page__form-section">
        <div className="login-page__form-container">
          <div className="login-page__header">
            <Link to={`${base}`} className="show-mobile">
              <img src="/test/logo3.png" alt="logo" />
            </Link>
            <div className="login-page__header-left">
              <h2 className="login-page__title">Verify Email</h2>
              <p className="login-page__subtitle">We are verifying your email now.</p>
            </div>
          </div>

          <div className="verify-body">
            {status === "loading" && (
              <div className="verify-status">
                <div className="spinner" />
                <p>Verifying your email—please wait...</p>
              </div>
            )}

            {status === "success" && (
              <div className="verify-status success">
                <div className="icon"><CheckCircle size={48} /></div>
                <h3>Email Verified</h3>
                <p>{message}</p>
                <div className="verify-actions">
                  {/* <button className="btn btn--primary" onClick={goLogin}>Proceed to Login</button> */}
                  <button className="btn" onClick={goHome}>Go to Home</button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="verify-status error">
                <div className="icon"><AlertTriangle size={48} /></div>
                <h3>Verification Failed</h3>
                <p>{message}</p>
                <div className="verify-actions">
                  <button className="btn" onClick={goHome}>Return Home</button>
                  <button className="btn btn--primary" onClick={goLogin}>Login</button>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="verify-status">
                <p>Preparing verification...</p>
              </div>
            )}
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

export default VerifyEmail;
