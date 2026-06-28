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
} from "lucide-react";
import "./pricingPlans.scss";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/tokenUtils";
import { createPortal } from "react-dom";
const base = import.meta.env.VITE_BASE;
const planPrice = import.meta.env.VITE_PLAN_PRICE;
const whatsappPrice = import.meta.env.VITE_WHATSAPP_PRICE;
const aiPlanPrice = import.meta.env.VITE_AI_PLAN_PRICE;
const feesPrice = import.meta.env.VITE_FEES;

interface PlanFeature {
  name: string;
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
  popular?: boolean;
  premium?: boolean;
  features: PlanFeature[];
  buttonText: string;
  badge?: string;
  icon: React.ReactNode;
  visible: boolean;
}

interface UserStatus {
  isLoggedIn: boolean;
  currentPlan?: string;
  hasActivePlan: boolean;
}

const PricingPlans: React.FC = () => {
  const navigate = useNavigate();
  const { courses_allowance, ai_plan } = getUser();

  const [plans, setPlans] = useState<PricingPlan[]>([]);

  const [loading, setLoading] = useState(true);

  // Mock plans data - replace with API call
  const mockPlans: PricingPlan[] = [
    {
      id: "checkout",
      name: "Yearly Subscription",
      description:
        "Get full access to all trading courses, resources, and expert-led learning materials.",
      price: planPrice,
      currency: "$",
      period: "year",
      features: [
        {
          name: "Complete access to all trading courses",
          included: true,
          highlight: true,
        },
        { name: "Beginner to advanced trading concepts", included: true },
        { name: "Step-by-step learning modules", included: true },
        { name: "Recorded sessions & resources", included: true },
        {
          name: "Strategy-based learning from experts",
          included: true,
          highlight: true,
        },
        {
          name: "Lifetime learning updates during subscription",
          included: true,
        },
      ],
      buttonText: "Buy Yearly Access",
      icon: <Calendar size={32} />,
      visible: true,
    },

    {
      id: "whatsappTrade",
      name: "WhatsApp Trading Group",
      description:
        "Join our exclusive WhatsApp group to receive live trading tips, signals, and expert insights.",
      price: whatsappPrice,
      currency: "$",
      period: "month",
      features: [
        {
          name: "Access to private WhatsApp group",
          included: true,
          highlight: true,
        },
        {
          name: "Live trading tips & signals",
          included: true,
          highlight: true,
        },
        { name: "Market updates & trade setups", included: true },
        { name: "Direct insights from trading experts", included: true },
        { name: "Community discussions & support", included: true },
      ],
      buttonText: "Join WhatsApp Group",
      icon: <MessageCircle size={32} />,
      visible: true,
    },

    {
      id: "aiPlan",
      name: "AI Chart Chat",
      description:
        "Analyze your trading charts using AI. Upload your chart and ask questions to get smart insights.",
      price: aiPlanPrice,
      currency: "$",
      period: "month",
      features: [
        {
          name: "Upload chart images for analysis",
          included: true,
          highlight: true,
        },
        { name: "Ask AI trading-related questions", included: true },
        { name: "1 question per week (Free users)", included: true },
        {
          name: "Up to 3 questions daily (with plan)",
          included: true,
          highlight: true,
        },
        { name: "AI-powered insights & suggestions", included: true },
      ],
      buttonText: "Activate AI Chat",
      icon: <Brain size={32} />,
      visible: true,
    },

    {
      id: "activationCoupon",
      name: "Activation Coupon",
      description:
        "Purchase coupons to activate yearly subscriptions for yourself or gift them to others.",
      price: planPrice,
      currency: "$",
      period: "one-time",
      features: [
        {
          name: "Activate Yearly Subscription using coupon",
          included: true,
          highlight: true,
        },
        {
          name: "Gift subscription to friends or clients",
          included: true,
          highlight: true,
        },
        { name: "Easy coupon redemption system", included: true },
        { name: "No expiration (based on admin settings)", included: true },
        { name: "Perfect for promotions & referrals", included: true },
      ],
      buttonText: "Buy Coupon",
      icon: <Gift size={32} />,
      visible: true,
    },
  ];

  useEffect(() => {
    let filteredPlans = [...mockPlans];

    // ✅ Condition 1: courses_allowance
    if (courses_allowance === 1 || courses_allowance === 2) {
      // Hide only Yearly Subscription
      filteredPlans = filteredPlans.filter((plan) => plan.id !== "checkout");
    }

    // ✅ Condition 2: ai_plan
    if (ai_plan === 1) {
      // Hide AI Chart Chat
      filteredPlans = filteredPlans.filter((plan) => plan.id !== "aiPlan");
    }

    setPlans(filteredPlans);
    setLoading(false);
  }, [courses_allowance, ai_plan]);

  const handlePlanSelect = (planId: string) => {
    navigate(`${base}checkout?${planId}=true`);
  };

  const getVisiblePlans = () => {
    return plans.filter((plan) => plan.visible);
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

  return (
    <div className="pricing-plans">
      <div className="pricing-plans__container">
        <div className="pricing-plans__header">
          <h1 className="pricing-plans__title">Choose Your Trading Plan</h1>
          <p className="pricing-plans__subtitle">
            Unlock your trading potential with our comprehensive plans designed
            for every level of trader. From beginners to professionals, we have
            the perfect solution for your trading journey.
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
                {plan.originalPrice && (
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
                )}
              </div>

              <div className="pricing-card__features">
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`features-list__item ${
                        feature.included ? "included" : "excluded"
                      } ${feature.highlight ? "highlight" : ""}`}
                    >
                      <div className="feature-icon">
                        {feature.included ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </div>
                      <span className="feature-text">{feature.name}</span>
                    </li>
                  ))}
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

export default PricingPlans;
