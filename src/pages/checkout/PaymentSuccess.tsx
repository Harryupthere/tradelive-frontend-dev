import { useState, useEffect } from "react";
import "./PaymentResult.scss";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
const base = import.meta.env.VITE_BASE;

interface PaymentStatus {
  status:
    | "pending"
    | "completed"
    | "cancelled"
    | "rejected"
    | "expired"
    | "failed";
  transactionId?: string;
  message?: string;
}

const PaymentSuccess: React.FC = () => {
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get session_id from URL query params
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        if (!sessionId) {
          throw new Error("No session ID found");
        }

        const response = await api.get(
          `${API_ENDPOINTS.checkPaymentStatus}?session_id=${sessionId}`
        );
        const result = response?.data?.data;

        if (result.status === "completed") {
          setStatus({
            status: "completed",
            transactionId: result.transactionId,
            message: result.message,
          });
          setLoading(false);
          startRedirectCountdown();
        } else if (result.status === "pending" && attempts < 5) {
          // Retry after 2 seconds if still pending
          setAttempts((prev) => prev + 1);
          setTimeout(checkPaymentStatus, 2000);
        } else {
          // Either failed or max attempts reached
          window.location.href = `${base}payment-failure?session_id=${sessionId}`;
        }
      } catch (error) {
        console.error("Payment status check failed:", error);
        window.location.href = `${base}payment-failure`;
      }
    };

    checkPaymentStatus();
  }, [attempts]);

  const startRedirectCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = `${base}profile`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleGoToProfile = () => {
    window.location.href = `${base}profile`;
  };

  if (loading) {
    return (
      <div className="payment-result success">
        <div className="payment-result__container">
          <div className="payment-result__loading">
            <div className="payment-result__loading-spinner"></div>
            <p>
              Verifying your payment
              {attempts > 0 ? ` (Attempt ${attempts}/5)` : ""}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!status || status.status !== "completed") {
    return null; // Will redirect to failure page from useEffect
  }

  return (
    <div className="payment-result success">
      <div className="payment-result__container">
        <div className="payment-result__content">
          {/* Animated Success Icon */}
          <div className="payment-result__icon-container success-animation">
            <div className="success-circle">
              <CheckCircle className="success-icon" size={80} />
            </div>
            <div className="sparkle sparkle-1">
              <Sparkles size={20} />
            </div>
            <div className="sparkle sparkle-2">
              <Sparkles size={16} />
            </div>
            <div className="sparkle sparkle-3">
              <Sparkles size={18} />
            </div>
            <div className="sparkle sparkle-4">
              <Sparkles size={14} />
            </div>
          </div>

          {/* Success Message */}
          <div className="payment-result__message">
            <h1 className="payment-result__title success-title">
              Payment Successful!
            </h1>
            <p className="payment-result__subtitle">
              {status.message ||
                "Thank you for your purchase. Your subscription has been activated successfully."}
            </p>
          </div>

          {/* Success Details */}
          <div className="payment-result__details">
            <div className="detail-item">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">
                #{status.transactionId ? status.transactionId.slice(0, 15) : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value success-status">Completed</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Access:</span>
              <span className="detail-value">Activated</span>
            </div>
          </div>

          {/* Countdown and Action */}
          <div className="payment-result__action">
            <div className="countdown-container">
              <div className="countdown-circle">
                <span className="countdown-number">{countdown}</span>
              </div>
              <p className="countdown-text">
                Redirecting to your profile in {countdown} seconds...
              </p>
            </div>

            <button
              className="payment-result__button success-button"
              onClick={handleGoToProfile}
            >
              <span>Go to Profile</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="background-animation">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="floating-element element-4"></div>
          <div className="floating-element element-5"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
