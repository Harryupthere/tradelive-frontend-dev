import React, { useState, useEffect } from "react";
import {
  Check,
  Star,
  Crown,
  Zap,
  Shield,
  ArrowRight,
  X,
  MessageCircle,
  Brain,
  Gift,
  Calendar,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import "./pricingPlans.scss";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/tokenUtils";
import { removeToken, removeUser } from "../../utils/tokenUtils";
import TermsAcceptanceModal from "../../components/common/TncPopup";
import { createPortal } from "react-dom";

const base = import.meta.env.VITE_BASE;
const planPrice = import.meta.env.VITE_PLAN_PRICE;
const whatsappPrice = import.meta.env.VITE_WHATSAPP_PRICE;
const aiPlanPrice = import.meta.env.VITE_AI_PLAN_PRICE;
const feesPrice = import.meta.env.VITE_FEES;
const starterPrice = import.meta.env.VITE_STARTER_FEES;
const premiumPrice = import.meta.env.VITE_PREMIUM_FEES;

interface PlanFeature {
  name: string;
  description?: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period: string;

  premium?: boolean;
  popular?: boolean;
  badge?: string;

  buttonText: string;
  icon: React.ReactNode;

  features: PlanFeature[];
  visible: boolean;
}
interface UserStatus {
  isLoggedIn: boolean;
  currentPlan?: string;
  hasActivePlan: boolean;
}

const RegistrationPricingPlans: React.FC = () => {
  const navigate = useNavigate();
  const { courses_allowance, ai_plan } = getUser();

  const [plans, setPlans] = useState<PricingPlan[]>([]);

  const [loading, setLoading] = useState(true);

  // Mock plans data - replace with API call
  const mockPlans: PricingPlan[] = [
    // {
    //   id: "starter",
    //   name: "6 Months Enrollment",
    //   description: "Perfect for getting started",

    //   price: starterPrice,
    //   originalPrice: 36,

    //   currency: "$",
    //   period: "6 months",

    //   buttonText: "Get Started",

    //   icon: <Shield size={32} />,

    //   features: [
    //     {
    //       name: "Access to All Trading Courses",
    //       description:
    //         "Learn price action, risk management, psychology, and trading strategies through structured courses.",
    //       included: true,
    //     },
    //     {
    //       name: "Trading Community Access",
    //       description:
    //         "Connect with fellow traders, discuss setups, and grow alongside the community.",
    //       included: true,
    //     },
    //     {
    //       name: "Market Updates",
    //       description:
    //         "Stay informed with educational market commentary and trading insights.",
    //       included: true,
    //     },
    //     {
    //       name: "6 Months Access",
    //       description: "Full access to the learning platform for six months.",
    //       included: true,
    //       highlight: true,
    //     },
    //   ],
    //   visible: true,
    // },

    {
      id: "premium",
      name: "12 Months Enrollment",

      description: "Best value for serious traders",

      price: premiumPrice,
      originalPrice: 60,

      currency: "$",
      period: "12 months",

      premium: true,
      popular: true,

      badge: "⭐ MOST POPULAR",

      buttonText: "Start Learning",

      icon: <Crown size={32} />,

      features: [
        {
          name: "Activate Your Learning Journey",
          description:
            "Includes all trading courses, community access, market updates, and educational resources.",
          included: true,
          highlight: true,
        },

        {
          name: "12 Months Full Access",
          description:
            "Enjoy uninterrupted access to all courses, updates, recordings, and learning materials for a full year.",
          included: true,
          highlight: true,
        },

        {
          name: "Monthly Performance Review",
          description:
            "Attend our monthly Group Trade Review & Q&A Session where live market conditions are analyzed and your trading questions are answered in real-time.",
          included: true,
          highlight: true,
        },

        {
          name: "Personal 30-Minute One-on-One Trade Audit",
          description:
            "Receive one complimentary private session to review your trading history, identify weaknesses, and create a roadmap for improvement.",
          included: true,
          highlight: true,
        },

        {
          name: "Institutional Funding Opportunity",
          description:
            "Exceptional students may qualify for opportunities to participate in professional fund management programs and demonstrate their consistency.",
          included: true,
          highlight: true,
        },

        {
          name: "VUE AI: Your Personal Trading Analyst",
          description:
            "Get 3 free advanced AI analysis requests per week. VUE AI studies your trading behavior, identifies strengths and weaknesses, and provides expert-level feedback.",
          included: true,
          highlight: true,
        },
      ],
      visible: true,
    },
  ];
  useEffect(() => {
    let filteredPlans = [...mockPlans];

    setPlans(filteredPlans);
    setLoading(false);
  }, [courses_allowance, ai_plan]);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePlanSelect = (planId: string) => {
    if (getUser() && getUser().tnc_accepted == 0) {
      setShowTermsModal(true);
    } else {
      navigate(`${base}registration-checkout?${planId}=true`);
    }

    // navigate(`${base}registration-checkout?${planId}=true`);
    // navigate(`${base}checkout?${planId}=true`);
  };

  const getVisiblePlans = () => {
    return plans.filter((plan) => plan.visible);
  };

  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const handleBackToCalculators = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="pricing-plans">
        <div className="pricing-plans__container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  const visiblePlans = getVisiblePlans();

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate(`${base}login`);
  };

  if (showTermsModal) {
    return createPortal(
      <TermsAcceptanceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        termsPath={`${base}terms-and-condition`}
        // onAccept={handleAcceptTerms}
        redirectPath={`${base}registration-checkout?${plans[0].id}=true`}
        sourcePath="registration-plan"
      />,
      document.body,
    );
  }
  return (
    <div className="pricing-plans">
      <div className="pricing-plans__container">
        <div className="pricing-plans__header">
          {getUser() && getUser().userType && getUser().userType.id == 2 ? (
            <button className="back-button" onClick={handleBackToCalculators}>
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="back-button"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
          <h1 className="pricing-plans__title">Choose Your Learning Plan</h1>
          <p className="pricing-plans__subtitle">
            Choose the learning path that matches your commitment level. Whether
            you're just starting your trading journey or ready to accelerate
            your growth with advanced mentorship and AI-powered insights, our
            enrollment plans are designed to help you become a consistently
            profitable trader.
          </p>
        </div>

        <div
          className={`pricing-plans__grid pricing-plans__grid--${visiblePlans.length}`}
        >
          {visiblePlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "pricing-card--popular" : ""} ${
                plan.premium ? "pricing-card--premium" : ""
              } `}
            >
              {plan.badge && (
                <div className="pricing-card__badge">{plan.badge}</div>
              )}

              <div className="pricing-card__header">
                <div className="pricing-card__icon">{plan.icon}</div>
                <h3 className="pricing-card__name">{plan.name}</h3>
                <p className="pricing-card__description">{plan.description}</p>
              </div>

              <div className="pricing-card__price">
                <div className="price-main">
                  <span className="currency">{plan.currency}</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                {/* {plan.originalPrice && plan.id == "premium" && (
                  <div className="price-original">
                    <span>
                      Was {plan.currency}
                      {plan.originalPrice}/{plan.period}
                    </span>
                    <span className="discount">
                      Save{" "}
                      {Math.round(
                        ((plan.originalPrice - plan.price) /
                          plan.originalPrice) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                )} */}
              </div>

              <div className="pricing-card__features">
                <ul className="features-list">
                  {plan.features.map((feature, index) => {
                    const featureKey = `${plan.id}-${index}`;
                    const isOpen = expandedFeature === featureKey;

                    return (
                      <li
                        key={index}
                        className={`features-list__item ${
                          feature.included ? "included" : "excluded"
                        } ${feature.highlight ? "highlight" : ""}`}
                      >
                        <div
                          className="feature-header"
                          onClick={() =>
                            setExpandedFeature(isOpen ? null : featureKey)
                          }
                        >
                          <div className="feature-left">
                            <div className="feature-icon">
                              {feature.included ? (
                                <Check size={16} />
                              ) : (
                                <X size={16} />
                              )}
                            </div>

                            <span className="feature-text">{feature.name}</span>
                          </div>

                          <div
                            className={`accordion-icon ${isOpen ? "open" : ""}`}
                          >
                            +
                          </div>
                        </div>

                        {isOpen && feature.description && (
                          <div className="feature-description">
                            {feature.description}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pricing-card__footer">
                <button
                  type="button"
                  className="pricing-card__button"
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.buttonText}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPricingPlans;
