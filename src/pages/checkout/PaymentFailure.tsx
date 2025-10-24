import { useState, useEffect } from 'react';
import './PaymentResult.scss';
import { XCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to profile
          window.location.href = '/profile';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoToProfile = () => {
    window.location.href = '/profile';
  };

  const handleTryAgain = () => {
    window.history.back();
  };

  return (
    <div className="payment-result failure">
      <div className="payment-result__container">
        <div className="payment-result__content">
          {/* Animated Failure Icon */}
          <div className="payment-result__icon-container failure-animation">
            <div className="failure-circle">
              <XCircle className="failure-icon" size={80} />
            </div>
            <div className="warning warning-1">
              <AlertTriangle size={16} />
            </div>
            <div className="warning warning-2">
              <AlertTriangle size={14} />
            </div>
            <div className="warning warning-3">
              <AlertTriangle size={18} />
            </div>
          </div>

          {/* Failure Message */}
          <div className="payment-result__message">
            <h1 className="payment-result__title failure-title">
              Payment Failed
            </h1>
            <p className="payment-result__subtitle">
              We couldn't process your payment. Please check your payment details and try again.
            </p>
          </div>

          {/* Failure Details */}
          <div className="payment-result__details">
            <div className="detail-item">
              <span className="detail-label">Error Code:</span>
              <span className="detail-value">#ERR-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value failure-status">Failed</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Reason:</span>
              <span className="detail-value">Payment declined</span>
            </div>
          </div>

          {/* Countdown and Actions */}
          <div className="payment-result__action">
            <div className="countdown-container">
              <div className="countdown-circle failure-countdown">
                <span className="countdown-number">{countdown}</span>
              </div>
              <p className="countdown-text">
                Redirecting to your profile in {countdown} seconds...
              </p>
            </div>
            
            <div className="button-group">
              <button className="payment-result__button retry-button" onClick={handleTryAgain}>
                <span>Try Again</span>
              </button>
              <button className="payment-result__button failure-button" onClick={handleGoToProfile}>
                <span>Go to Profile</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="background-animation failure-bg">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;