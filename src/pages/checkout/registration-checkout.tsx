import { useState, useEffect } from "react";
import "./Checkout.scss";
import { ArrowLeft, CreditCard, Gift, Info, LineChart } from "lucide-react";
import { allCountries } from "country-telephone-data";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
import { getUser } from "../../utils/tokenUtils";
import { errorMsg } from "../../utils/customFn";

const base = import.meta.env.VITE_BASE;
const planPrice = import.meta.env.VITE_PLAN_PRICE;
const starterPrice = import.meta.env.VITE_STARTER_FEES;
const premiumPrice = import.meta.env.VITE_PREMIUM_FEES;
const feesPrice = import.meta.env.VITE_FEES;

// small helper to convert iso2 to emoji flag
const iso2ToFlag = (iso2: string) => {
  if (!iso2) return "";
  return iso2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
};

// countries list for select (map to {name, iso2, dialCode})
const countries = allCountries.map((c: any) => ({
  name: c.name,
  iso2: c.iso2,
  dialCode: c.dialCode,
}));

interface Paymentgateways {
  id: number;
  name: string;
  description: string;
  image: string;
  fees_percent?: string;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  mobileNo: string;
  country: string;
  subscriptionType: // | "Yearly Subscription"
    | "Activation Coupon"
    | "Instructor Meeting"
    | "Whatsapp Trade"
    | "AI Plan"
    | "Starter Plan"
    | "Premium Plan";

  paymentGateway: "stripe" | "boomfi" | string;
  couponQuantity: number;
  meetingReason?: string;
}

interface PricingDetails {
  basePrice: number;
  quantity: number;
  fees: number;
  total: number;
}

const RegistrationCheckout: React.FC = () => {
  const [cryptoCurrencies, setCryptoCurrencies] = useState<any[]>([]);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] =
    useState<any>(null);
  const [openCryptoSelection, setOpenCryptoSelection] =
    useState<boolean>(false);
  const [cryptoQuantity, setCryptoQuantity] = useState<number>(0);

  const fetchStarterPlan = () => {
    const params = new URLSearchParams(window.location.search);

    const starter = params.get("starter");
    if (starter && (starter.toLowerCase() === "true" || starter === "1")) {
      return true;
    }
  };

  const fetchPremiumrPlan = () => {
    const params = new URLSearchParams(window.location.search);

    const premium = params.get("premium");
    if (premium && (premium.toLowerCase() === "true" || premium === "1")) {
      return true;
    }
  };

  const starterFromUrl = fetchStarterPlan();
  const premiumFromUrl = fetchPremiumrPlan();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    mobileNo: "",
    country: "",
    subscriptionType: starterFromUrl
      ? "Starter Plan"
      : premiumFromUrl
        ? "Premium Plan"
        : "Premium Plan",
    paymentGateway: "1",
    couponQuantity: 1,
    meetingReason: "",
  });

  const [paymentGateways, setPaymentGateways] = useState<Paymentgateways[]>([]);

  // Initialize pricing with 0 fees, will update after API call

  const [pricing, setPricing] = useState<PricingDetails>({
    basePrice: starterFromUrl
      ? parseFloat(starterPrice)
      : premiumFromUrl
        ? parseFloat(premiumPrice)
        : parseFloat(premiumPrice),
    quantity: 1,
    fees: feesPrice, //0, // Initialize with 0
    total: starterFromUrl
      ? parseFloat(starterPrice)
      : premiumFromUrl
        ? parseFloat(premiumPrice)
        : parseFloat(premiumPrice),
  });

  // Add useEffect to update pricing when payment gateways load
  useEffect(() => {
    if (paymentGateways.length > 0) {
      // Update pricing with fees from first gateway

      const firstGateway =
        getUser()?.userType?.id == 1 ? paymentGateways[0] : paymentGateways[1];
      const basePrice = starterFromUrl
        ? parseFloat(starterPrice)
        : premiumFromUrl
          ? parseFloat(premiumPrice)
          : parseFloat(premiumPrice);
      const feesPercent = Number(firstGateway.fee_percentage || 0);
      const fees = parseInt(firstGateway?.fees_amount); // (basePrice * feesPercent) / 100;
      setPricing((prev) => ({
        ...prev,
        fees,
        total: basePrice + fees,
      }));
    }
  }, [paymentGateways]);

  // validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [signatureName, setSignatureName] = useState("");
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    callPaymentGateways();
    callCryptoCurrencies();
  }, []);

  const callPaymentGateways = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.paymentgateways);
      // adapter: adjust depending on real response shape
      setPaymentGateways(res?.data?.data.data || []);
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
    }
  };

  const callCryptoCurrencies = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.cryptoCurrencies);
      // adapter: adjust depending on real response shape
      setCryptoCurrencies(res?.data?.data.data || []);
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
    }
  };

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | number,
  ) => {
    if (value == "2") {
      setOpenCryptoSelection(true);
    }
    const updatedFormData = { ...formData, [field]: value } as CheckoutFormData;
    setFormData(updatedFormData);

    // clear validation for this field on change
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[String(field)];
      return copy;
    });

    // Update pricing based on subscription type and quantity
    updatePricing(updatedFormData);
  };

  const validateEmail = (email: string) => {
    // basic email validation
    return /^\S+@\S+\.\S+$/.test(email.trim());
  };

  const validateMobile = (mobile: string) => {
    // require exactly 10 digits (strip non-digits first)
    const digits = String(mobile).replace(/\D/g, "");
    return /^\d{10}$/.test(digits);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.mobileNo || !formData.mobileNo.toString().trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!validateMobile(formData.mobileNo.toString())) {
      newErrors.mobileNo = "Mobile number must be 10 digits";
    }

    if (!formData.country || !formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePricing = (data: CheckoutFormData) => {
    let basePrice = 0;
    let quantity = 1;
    let fees = 0;

    const selectedGateway = paymentGateways.find(
      (g) => String(g.id) === String(data.paymentGateway),
    );
    const feesPercentage = Number(
      (selectedGateway as any)?.fee_percentage ||
        (selectedGateway as any)?.fees_percent ||
        0,
    );

    const feesAmount = Number(
      (selectedGateway as any)?.fees_amount ||
        (selectedGateway as any)?.fees_percent ||
        feesPrice,
    );

    if (data.subscriptionType === "Starter Plan") {
      basePrice = starterPrice ? parseFloat(starterPrice) : 12.0;
      quantity = 1;
      fees = feesAmount; // basePrice * (feesPercentage / 100);
    } else if (data.subscriptionType === "Premium Plan") {
      basePrice = premiumPrice ? parseFloat(premiumPrice) : 12.0;
      quantity = 1;
      fees = feesAmount; // basePrice * (feesPercentage / 100);
    }
    const total = basePrice * quantity + fees;

    setPricing({
      basePrice: basePrice || 0,
      quantity: quantity || 0,
      fees: fees || 0,
      total: total || 0,
    });
  };

  // Helpers for crypto selection and calculation
  const calculateCryptoAmount = (rate: number | string) => {
    const r = Number(rate) || 1;
    if (!r) return 0;
    return pricing.total * r;
  };

  const handleSelectCrypto = (c: any) => {
    setSelectedCryptoCurrency(c);
    console.log(c, "selectedCryptoCurrency");

    const qty = calculateCryptoAmount(c.rate.rate);
    const decimals = Number(c.decimal_places ?? 6);
    setCryptoQuantity(Number(qty.toFixed(2)));
  };

  // Keep crypto quantity in sync when pricing changes
  useEffect(() => {
    if (selectedCryptoCurrency) {
      const qty = calculateCryptoAmount(selectedCryptoCurrency.rate.rate);
      const decimals = Number(selectedCryptoCurrency.decimal_places ?? 6);
      setCryptoQuantity(Number(qty.toFixed(decimals)));
    }
  }, [selectedCryptoCurrency, pricing.total]);

  // Keep crypto quantity in sync when pricing changes
  useEffect(() => {
    if (selectedCryptoCurrency) {
      const qty = calculateCryptoAmount(selectedCryptoCurrency.rate.rate);
      const decimals = Number(selectedCryptoCurrency.decimal_places ?? 6);
      setCryptoQuantity(Number(qty.toFixed(decimals)));
    }
  }, [selectedCryptoCurrency, pricing.total]);

  const handleBackToCalculators = () => {
    window.history.back();
  };

  const handleProceed = async () => {
    try {
      if (!validateForm()) {
        // focus first error field (optional)
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          const el = document.querySelector(
            `[name="${firstErrorField}"], #${firstErrorField}`,
          ) as HTMLElement | null;
          el?.focus();
        }
        return;
      }

      // Process checkout
      await executeCheckout();
    } catch (error) {
      console.log(error);
      errorMsg(
        error.message
          ? error.message
          : "Something went wrong during checkout process. or already booked",
      );
    }
  };

  const executeCheckout = async () => {
    try {
      const metadata = {
        ...formData,
        ...pricing,
      };
      const payload = {
        transactionType: formData.subscriptionType,
        amount: pricing.total,
        metadata,
      };
      if (formData.paymentGateway == 1) {
        const res = await api.post(API_ENDPOINTS.stripeCreateSession, payload);

        if (res.data.status) {
          // Redirect to Stripe Checkout
          window.location.href = res?.data?.data?.checkoutUrl;
        }
      } else {
        payload.selectedCrypto = selectedCryptoCurrency?.id;
        const res = await api.post(API_ENDPOINTS.coinpaymentInvoice, payload);
        if (res.data.status) {
          // Redirect to Stripe Checkout
          window.location.href = res?.data?.data?.checkoutUrl;
        }
      }
    } catch (err: any) {
      console.error("executeCheckout error:", err);
      errorMsg(
        err?.response?.data?.message || err?.message || "Checkout failed",
      );
    }
  };
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Learning Plans
          </button>
          <h1 className="checkout__title">Checkout</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <div className="checkout-card">
              <h2 className="section-title">Personal Information</h2>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-wrapper">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    style={{
                      borderBottom: errors.fullName
                        ? "2px solid #e74c3c"
                        : undefined,
                    }}
                  />
                </div>
                {errors.fullName && (
                  <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    style={{
                      borderBottom: errors.email
                        ? "2px solid #e74c3c"
                        : undefined,
                    }}
                  />
                </div>
                {errors.email && (
                  <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile No. *</label>

                <div className="input-wrapper">
                  <input
                    id="mobileNo"
                    name="mobileNo"
                    type="tel"
                    className="form-input"
                    value={formData.mobileNo}
                    onChange={(e) =>
                      handleInputChange("mobileNo", e.target.value)
                    }
                    placeholder="Enter your mobile number"
                    style={{
                      borderBottom: errors.mobileNo
                        ? "2px solid #e74c3c"
                        : undefined,
                    }}
                  />
                </div>

                {errors.mobileNo && (
                  <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>
                    {errors.mobileNo}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Country *</label>
                <div className="input-wrapper">
                  <select
                    id="country"
                    name="country"
                    className="form-select"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    style={{
                      borderBottom: errors.country
                        ? "2px solid #e74c3c"
                        : undefined,
                    }}
                  >
                    <option value="">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.iso2} value={c.name}>
                        {iso2ToFlag(c.iso2)} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>
                    {errors.country}
                  </div>
                )}
              </div>

              {formData.subscriptionType === "Instructor Meeting" && (
                <div style={{ marginTop: 12 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Reason for meeting
                  </label>
                  <textarea
                    rows={4}
                    value={formData.meetingReason}
                    onChange={(e) =>
                      handleInputChange("meetingReason", e.target.value)
                    }
                    placeholder="Briefly describe what you'd like to discuss with the mentor (issues, goals, topics)..."
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                  {errors.meetingReason && (
                    <div
                      style={{
                        color: "#e74c3c",
                        fontSize: 12,
                        marginTop: 6,
                      }}
                    >
                      {errors.meetingReason}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#888",
                      marginTop: 6,
                    }}
                  >
                    This will be sent to the instructor along with your booking.
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-card">
              <h2 className="section-title">Subscription Options</h2>

              <div className="subscription-options">
                {starterFromUrl && (
                  <div className="subscription-option">
                    <input
                      type="radio"
                      id="Starter Plan"
                      name="subscriptionType"
                      checked={formData.subscriptionType === "Starter Plan"}
                      onChange={() =>
                        handleInputChange("subscriptionType", "Starter Plan")
                      }
                    />
                    <label
                      htmlFor="Starter Plan"
                      className="subscription-label"
                    >
                      <div className="subscription-header">
                        <Gift size={20} />
                        <span>Starter Plan</span>
                      </div>
                      <div className="subscription-description">
                        Purchase starter plan for flexible access
                      </div>
                    </label>
                  </div>
                )}

                {premiumFromUrl && (
                  <div className="subscription-option">
                    <input
                      type="radio"
                      id="Premium Plan"
                      name="subscriptionType"
                      checked={formData.subscriptionType === "Premium Plan"}
                      onChange={() =>
                        handleInputChange("subscriptionType", "Premium Plan")
                      }
                    />
                    <label
                      htmlFor="Premium Plan"
                      className="subscription-label"
                    >
                      <div className="subscription-header">
                        <Gift size={20} />
                        <span>Premium Plan</span>
                      </div>
                      <div className="subscription-description">
                        Purchase premium plan for flexible access
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="payment-gateway-section">
                <h3 className="subsection-title">Choose Payment Gateway</h3>

                {paymentGateways.length > 0 ? (
                  paymentGateways.map((g) => (
                    <div className="payment-option" key={g.id}>
                      <input
                        type="radio"
                        id={`gateway-${g.id}`}
                        name="paymentGateway"
                        checked={
                          String(formData.paymentGateway) === String(g.id)
                        }
                        onChange={() =>
                          handleInputChange("paymentGateway", String(g.id))
                        }
                      />
                      <label
                        htmlFor={`gateway-${g.id}`}
                        className="payment-label"
                      >
                        <div className="payment-header">
                          <div className={`payment-logo`}>
                            {g.image && (
                              <img
                                src={g.image}
                                alt={g.name}
                                style={{ height: 24 }}
                              />
                            )}
                          </div>
                          <span>{g.name}</span>
                        </div>
                        <div className="payment-description">
                          {g.description || g.name}
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="stripe"
                        name="paymentGateway"
                        checked={String(formData.paymentGateway) === "stripe"}
                        onChange={() =>
                          handleInputChange("paymentGateway", "stripe")
                        }
                      />
                      <label htmlFor="stripe" className="payment-label">
                        <div className="payment-header">
                          <div className="payment-logo stripe-logo">Stripe</div>
                        </div>
                        <div className="payment-description">
                          Secure payment processing with credit/debit cards
                        </div>
                      </label>
                    </div>
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="boomfi"
                        name="paymentGateway"
                        checked={String(formData.paymentGateway) === "boomfi"}
                        onChange={() =>
                          handleInputChange("paymentGateway", "boomfi")
                        }
                      />
                      <label htmlFor="boomfi" className="payment-label">
                        <div className="payment-header">
                          <div className="payment-logo boomfi-logo">BoomFi</div>
                        </div>
                        <div className="payment-description">
                          Cryptocurrency and alternative payment methods
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {openCryptoSelection && (
                <div className="crypto-selection-box">
                  {cryptoCurrencies.map((item, index) => (
                    <label key={item.id} className="crypto-option">
                      <input
                        type="radio"
                        name="crypto"
                        value={item.id}
                        onChange={() => handleSelectCrypto(item)}
                      />

                      <img
                        src={item.logo_url}
                        alt={item.name}
                        className="crypto-logo"
                      />

                      <div className="crypto-info">
                        <span className="crypto-name">{item.name}</span>
                        <span className="crypto-symbol">({item.symbol})</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="checkout-summary-section">
            <div className="summary-card">
              <h2 className="section-title">Order Summary</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">
                    {formData.subscriptionType === "Starter Plan"
                      ? "6 Months Enrollment"
                      : "12 Months Enrollment"}
                  </span>

                  <span className="summary-value">
                    ${pricing.basePrice.toFixed(2)}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Quantity</span>
                  <span className="summary-value">{pricing.quantity}</span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">
                    ${(pricing.basePrice * pricing.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">
                    Processing Fees
                    {(formData.subscriptionType === "Starter Plan" ||
                      formData.subscriptionType === "Premium Plan") && (
                      <span className="fee-note">
                        ({formData.paymentGateway == '1' ? "Stripe" : "BoomFi"})
                      </span>
                    )}
                  </span>
                  <span className="summary-value">
                    ${parseFloat(pricing.fees).toFixed(2)}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-item summary-total">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">
                    ${parseFloat(pricing.total).toFixed(2)}
                  </span>
                </div>
                {selectedCryptoCurrency && (
                  <div className="summary-item">
                    <span className="summary-label">
                      Crypto ({selectedCryptoCurrency.symbol}) Quantity
                    </span>

                    <span className="summary-value">
                      {cryptoQuantity} {selectedCryptoCurrency.symbol}
                    </span>
                  </div>
                )}
              </div>
              <button
                className="proceed-button"
                disabled={false}
                onClick={handleProceed}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCheckout;
