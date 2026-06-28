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
const instructorPrice = import.meta.env.VITE_INSTRUCTOR_PRICE;
const whatsappPrice = import.meta.env.VITE_WHATSAPP_PRICE;
const aiPlanPrice = import.meta.env.VITE_AI_PLAN_PRICE;
const feesPrice = import.meta.env.VITE_FEES;
const starterPrice = import.meta.env.VITE_STARTER_FEES;
const premiumPrice = import.meta.env.VITE_PREMIUM_FEES;

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
  subscriptionType:
    | "Yearly Subscription"
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

const Checkout: React.FC = () => {
  const [cryptoCurrencies, setCryptoCurrencies] = useState<any[]>([]);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] =
    useState<any>(null);
  const [openCryptoSelection, setOpenCryptoSelection] =
    useState<boolean>(false);
  const [cryptoQuantity, setCryptoQuantity] = useState<number>(0);

  const fetchActivationCoupon = () => {
    const params = new URLSearchParams(window.location.search);

    const activationCouponRaw = params.get("activationCoupon");
    if (
      activationCouponRaw &&
      (activationCouponRaw.toLowerCase() === "true" ||
        activationCouponRaw === "1")
    ) {
      return true;
    }
  };

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

  const fetchWhatsappTrade = () => {
    const params = new URLSearchParams(window.location.search);

    const activationCouponRaw = params.get("whatsappTrade");
    if (
      activationCouponRaw &&
      (activationCouponRaw.toLowerCase() === "true" ||
        activationCouponRaw === "1")
    ) {
      return true;
    }
  };
  const fetchAIPlan = () => {
    const params = new URLSearchParams(window.location.search);
    const aiPlanRaw = params.get("aiPlan") || params.get("aiplan");
    if (
      aiPlanRaw &&
      (aiPlanRaw.toLowerCase() === "true" || aiPlanRaw === "1")
    ) {
      return true;
    }
  };
  const parseInstructorMeetingFromUrl = (): any | null => {
    try {
      const params = new URLSearchParams(window.location.search);

      const instructorMeetingRaw = params.get("instructorMeeting");
      // treat "true" or "1" as enabled
      const enabled =
        instructorMeetingRaw &&
        (instructorMeetingRaw.toLowerCase() === "true" ||
          instructorMeetingRaw === "1");

      if (!enabled) return null;

      // Accept both correct and misspelled param names
      const instructorId =
        params.get("instructorId") ||
        params.get("instrcutor_id") ||
        params.get("instructor_id");
      const availableId =
        params.get("available_id") || params.get("availableId");

      // If there's an instructorData json blob, try to parse it
      let rawInstructorData: any = null;
      if (params.has("instructorData")) {
        const raw = params.get("instructorData") || "";
        try {
          rawInstructorData = JSON.parse(raw);
        } catch {
          rawInstructorData = raw;
        }
      }

      return {
        enabled: true,
        instructorId: instructorId || null,
        availableId: availableId || null,
        raw: rawInstructorData,
      };
    } catch {
      return null;
    }
  };

  const instructorMeetingFromUrl = parseInstructorMeetingFromUrl();
  const activationCouponFromUrl = fetchActivationCoupon();
  const whatsappTradeFromUrl = fetchWhatsappTrade();
  const aiPlanFromUrl = fetchAIPlan();
  const starterFromUrl = fetchStarterPlan();
  const premiumFromUrl = fetchPremiumrPlan();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    mobileNo: "",
    country: "",
    subscriptionType:
      instructorMeetingFromUrl && instructorMeetingFromUrl.enabled
        ? "Instructor Meeting"
        : aiPlanFromUrl
          ? "AI Plan"
          : whatsappTradeFromUrl
            ? "Whatsapp Trade"
            : getUser()?.userType?.id == 1 || activationCouponFromUrl
              ? "Activation Coupon"
              // : starterFromUrl
              //   ? "Starter Plan"
                 : premiumFromUrl
                  ? "Premium Plan"
                  : "Premium Plan",
    //: "Yearly Subscription",
    paymentGateway: "1",
    couponQuantity: 1,
    meetingReason: "",
  });

  // store parsed instructor meeting data (if any)
  const [instructorMeetingData, setInstructorMeetingData] = useState<any>(
    instructorMeetingFromUrl,
  );
  const [instructorDetails, setInstructorDetails] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [meetingLoading, setMeetingLoading] = useState<boolean>(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);

  const [paymentGateways, setPaymentGateways] = useState<Paymentgateways[]>([]);

  // Fetch instructor and availability details when instructorMeeting is enabled
  useEffect(() => {
    const shouldFetch =
      instructorMeetingData &&
      instructorMeetingData.enabled &&
      (instructorMeetingData.instructorId || instructorMeetingData.raw);
    if (!shouldFetch) return;

    const fetchMeetingDetails = async () => {
      setMeetingLoading(true);
      setMeetingError(null);
      try {
        // If raw instructor obj was provided in URL, prefer that
        if (instructorMeetingData.raw) {
          setInstructorDetails(instructorMeetingData.raw);
        }

        // If instructorId is available, call instructor API to get details (availabilities included)
        const id = instructorMeetingData.instructorId;
        if (id) {
          // NOTE: assumes [`API_ENDPOINTS.instructor`](src/constants/ApiEndPoints.ts) exists and returns instructor with `availabilities`
          const res = await api.get(`${API_ENDPOINTS.instructor}/${id}`);
          if (res?.status) {
            const payload = res.data?.data || res.data;
            setInstructorDetails(payload);
            // try to pick the available slot by availableId
            const availId = instructorMeetingData.availableId;
            if (availId && payload?.availabilities) {
              const found = payload.availabilities.find(
                (a: any) => String(a.id) === String(availId),
              );
              if (found) setSelectedSlot(found);
              else {
                setMeetingError("Selected availability slot not found");
              }
            }
          } else {
            setMeetingError("Unable to fetch instructor details");
          }
        }
      } catch (err: any) {
        console.error("fetchMeetingDetails error:", err);
        setMeetingError("Error fetching instructor details");
      } finally {
        setMeetingLoading(false);
      }
    };

    fetchMeetingDetails();
  }, [instructorMeetingData]);

  // Initialize pricing with 0 fees, will update after API call

  const [pricing, setPricing] = useState<PricingDetails>({
    basePrice:
      instructorMeetingFromUrl && instructorMeetingFromUrl.enabled
        ? instructorDetails?.fees? parseFloat(instructorDetails?.fees) : parseFloat(instructorPrice)
        : whatsappTradeFromUrl
          ? parseFloat(whatsappPrice)
          : aiPlanFromUrl
            ? parseFloat(aiPlanPrice)
            // : starterFromUrl
            //   ? parseFloat(starterPrice)
            //   : premiumFromUrl
            //     ? parseFloat(premiumPrice)
            //     : parseFloat(premiumPrice),
   : planPrice
      ? parseFloat(planPrice)
      : 12.0,
    quantity: 1,
    fees: feesPrice, //0, // Initialize with 0
    total:
      instructorMeetingFromUrl && instructorMeetingFromUrl.enabled
        ? instructorDetails?.fees? parseFloat(instructorDetails?.fees) :parseFloat(instructorPrice)
        : whatsappTradeFromUrl
          ? parseFloat(whatsappPrice)
          : aiPlanFromUrl
            ? parseFloat(aiPlanPrice)
            // : starterFromUrl
            //   ? parseFloat(starterPrice)
            //   : premiumFromUrl
            //     ? parseFloat(premiumPrice)
            //     : parseFloat(premiumPrice),
   : planPrice
      ? parseFloat(planPrice)
      : 12.0, // Initial total without fees
  });

  // Add useEffect to update pricing when payment gateways load
  useEffect(() => {
    if (paymentGateways.length > 0) {
     // fetchMeetingDetails();
      // Update pricing with fees from first gateway
      const shouldFetch =
        instructorMeetingData && instructorMeetingData.enabled;
      const firstGateway =
        getUser()?.userType?.id == 1 ? paymentGateways[0] : paymentGateways[1];
      const basePrice =
        shouldFetch == 1 || shouldFetch
          ? instructorDetails?.fees? parseFloat(instructorDetails?.fees) :parseFloat(instructorPrice)
          : whatsappTradeFromUrl
            ? parseFloat(whatsappPrice)
            : aiPlanFromUrl
              ? parseFloat(aiPlanPrice)
              // : starterFromUrl
              //   ? parseFloat(starterPrice)
              //   : premiumFromUrl
              //     ? parseFloat(premiumPrice)
              //     : parseFloat(premiumPrice);
      : planPrice
        ? parseFloat(planPrice)
        : 12.0;
      const feesPercent = Number(firstGateway.fee_percentage || 0);
      const fees = aiPlanFromUrl ? 1 : parseInt(firstGateway?.fees_amount); // (basePrice * feesPercent) / 100;
     console.log(basePrice,"basePrice")
      // setPricing((prev) => ({
      //   ...prev,
      //   fees,
      //   total: basePrice + fees,
      // }));
      setPricing((prev) => ({
  ...prev,
  basePrice,
  fees,
  total: basePrice + fees,
}));
    }
  }, [paymentGateways, instructorMeetingData, instructorDetails]);

  // validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [whatsappAgreeChecked, setWhatsappAgreeChecked] = useState(false);
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

  // if more complex parsing at mount is required, keep here
  useEffect(() => {
    if (!instructorMeetingData) {
      const parsed = parseInstructorMeetingFromUrl();
      console.log(parsed, "parsed instructorMeetingFromUrl");
      if (parsed) {
        setInstructorMeetingData(parsed);
        // ensure formData subscription type is set
        setFormData((prev) => ({
          ...prev,
          subscriptionType: "Instructor Meeting",
        }));
      }
    }
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
    }else{
      setOpenCryptoSelection(false);
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

    // coupon quantity bounds
    if (formData.subscriptionType === "Activation Coupon") {
      const q = Number(formData.couponQuantity);
      if (q < 1 || q > 50) {
        newErrors.couponQuantity = "Quantity must be between 1 and 50";
      }
    }

    // If booking an instructor meeting, require a brief reason
    if (formData.subscriptionType === "Instructor Meeting") {
      if (!formData.meetingReason || !String(formData.meetingReason).trim()) {
        newErrors.meetingReason =
          "Please provide a brief reason for the meeting";
      }
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

    // if (data.subscriptionType === "Yearly Subscription") {
    //   basePrice = planPrice ? parseFloat(planPrice) : 12.0;
    //   quantity = 1;
    //   fees = feesAmount; // basePrice * (feesPercentage / 100);
    // }
    // if (data.subscriptionType === "Starter Plan") {
    //   basePrice = starterPrice ? parseFloat(starterPrice) : 12.0;
    //   quantity = 1;
    //   fees = feesAmount; // basePrice * (feesPercentage / 100);
    // } else
     if (data.subscriptionType === "Premium Plan") {
      basePrice = premiumPrice ? parseFloat(premiumPrice) : 50.0;
      quantity = 1;
      fees = feesAmount; // basePrice * (feesPercentage / 100);
    }
     else if (data.subscriptionType === "AI Plan") {
      basePrice = aiPlanPrice ? parseFloat(aiPlanPrice) : 10.0;
      quantity = 1;
      fees = 1;
    } else if (data.subscriptionType === "Activation Coupon") {
      basePrice = planPrice ? parseFloat(planPrice) : 12.0;
      quantity = data.couponQuantity || 1;
      fees = feesAmount; // basePrice * quantity * (feesPercentage / 100);
    } else if (data.subscriptionType === "Instructor Meeting") {
      basePrice = instructorDetails?.fees? parseFloat(instructorDetails?.fees) :instructorDetails?.meeting_price
        ? parseFloat(instructorDetails.meeting_price)
        : 99.0; // default meeting price
      quantity = 1;
      fees = feesAmount; //basePrice * (feesPercentage / 100);
    } else if (data.subscriptionType === "Whatsapp Trade") {
      basePrice = whatsappPrice ? parseFloat(whatsappPrice) : 99.0; // default meeting price
      quantity = 1;
      fees = feesAmount; //basePrice * (feesPercentage / 100);
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

      // If Whatsapp Trade, show T&C modal and await user agreement
      if (
        formData.subscriptionType === "Whatsapp Trade" &&
        !showWhatsappModal
      ) {
        setShowWhatsappModal(true);
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
        ...(instructorMeetingData
          ? { instructorMeeting: instructorMeetingData }
          : {}),
        ...(instructorDetails ? { instructorDetails } : {}),
        ...(selectedSlot ? { selectedSlot } : {}),
        ...(formData.subscriptionType === "Whatsapp Trade"
          ? { digitalSignature: signatureName, signatureDate: today }
          : {}),
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
      {/* Whatsapp T&C Modal */}
      {showWhatsappModal && (
        <div className="tnc-modal-overlay">
          <div className="tnc-modal">
            <div className="tnc-modal-header">
              <h3>Whatsapp Trade Terms & Conditions</h3>
            </div>
            <div className="tnc-modal-body">
              <div className="tnc-modal-text">
                <p>
                  By purchasing the Whatsapp Trade subscription you agree that
                  trade signals and trade ideas are for educational purposes
                  only. Tradelive24 is not responsible for any losses. Signals
                  may not always be accurate and market conditions can change
                  rapidly.
                </p>
                <p>
                  Please ensure the mobile number provided is correct and
                  activated for WhatsApp. Standard messaging charges may apply.
                </p>
                <p>
                  Refunds are subject to our refund policy. Continued use of the
                  service implies acceptance of these terms.
                </p>
              </div>

              <label className="tnc-accept">
                <input
                  type="checkbox"
                  checked={whatsappAgreeChecked}
                  onChange={(e) => setWhatsappAgreeChecked(e.target.checked)}
                />
                I have read and agree to the Terms & Conditions.
              </label>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid #ddd",
                }}
              >
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
                >
                  Digital Signature *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name as signature"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    fontFamily: "cursive",
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                  <strong>Date:</strong> {today}
                </div>
                {!signatureName && (
                  <div style={{ fontSize: 12, color: "#e74c3c" }}>
                    Please provide your signature to proceed
                  </div>
                )}
              </div>
            </div>
            <div className="tnc-modal-actions">
              <button
                className="tnc-cancel"
                onClick={() => {
                  setShowWhatsappModal(false);
                  setWhatsappAgreeChecked(false);
                  setSignatureName("");
                }}
              >
                Cancel
              </button>
              <button
                className="tnc-proceed"
                disabled={!whatsappAgreeChecked || !signatureName}
                onClick={async () => {
                  setShowWhatsappModal(false);
                  setWhatsappAgreeChecked(false);
                  // proceed with checkout
                  await executeCheckout();
                }}
              >
                Agree & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="checkout-container">
        <div className="checkout__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Home
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
                {whatsappTradeFromUrl && (
                  <span
                    style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}
                  >
                    Please ensure this is your whatsapp number
                  </span>
                )}
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
                {/* If instructorMeeting data present in URL, show only Instructor Meeting option */}
                {instructorMeetingData && (
                  <div className="subscription-option">
                    <input
                      type="radio"
                      id="Instructor Meeting"
                      name="subscriptionType"
                      checked={
                        formData.subscriptionType === "Instructor Meeting"
                      }
                      onChange={() =>
                        handleInputChange(
                          "subscriptionType",
                          "Instructor Meeting",
                        )
                      }
                    />
                    <label
                      htmlFor="Instructor Meeting"
                      className="subscription-label"
                    >
                      <div className="subscription-header">
                        <LineChart size={20} />
                        <span>Instructor Meeting</span>
                      </div>
                      <div className="subscription-description">
                        {meetingLoading ? (
                          <div>Loading instructor details…</div>
                        ) : meetingError ? (
                          <div style={{ color: "#e74c3c" }}>{meetingError}</div>
                        ) : instructorDetails ? (
                          <div className="instructor-brief">
                            <div
                              style={{
                                display: "flex",
                                gap: 12,
                                alignItems: "center",
                              }}
                            >
                              {instructorDetails.profile_image && (
                                <img
                                  src={instructorDetails.profile_image}
                                  alt={instructorDetails.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 8,
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <div>
                                <div style={{ fontWeight: 700 }}>
                                  {instructorDetails.name ||
                                    instructorDetails.title ||
                                    "Instructor"}
                                </div>
                                <div style={{ color: "#b0b0b0", fontSize: 13 }}>
                                  {instructorDetails.designation ||
                                    instructorDetails.email ||
                                    ""}
                                </div>
                              </div>
                            </div>

                            {selectedSlot ? (
                              <div style={{ marginTop: 8 }}>
                                <div>
                                  <strong>Selected slot:</strong>
                                </div>
                                <div>
                                  {new Date(
                                    selectedSlot.available_date,
                                  ).toLocaleDateString()}{" "}
                                  • {selectedSlot.start_time} -{" "}
                                  {selectedSlot.end_time}
                                </div>
                              </div>
                            ) : instructorDetails.availabilities &&
                              instructorDetails.availabilities.length > 0 ? (
                              <div style={{ marginTop: 8 }}>
                                <div>
                                  <strong>Available slots:</strong>
                                </div>
                                <ul style={{ margin: "6px 0 0 18px" }}>
                                  {instructorDetails.availabilities
                                    .slice(0, 5)
                                    .map((a: any) => (
                                      <li
                                        key={a.id}
                                        style={{ marginBottom: 4 }}
                                      >
                                        <button
                                          type="button"
                                          className="slot-select-btn"
                                          onClick={() => setSelectedSlot(a)}
                                          style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#d5ff2e",
                                            cursor: "pointer",
                                            padding: 0,
                                          }}
                                        >
                                          {new Date(
                                            a.available_date,
                                          ).toLocaleDateString()}{" "}
                                          • {a.start_time} - {a.end_time}
                                        </button>
                                      </li>
                                    ))}
                                </ul>
                                {instructorDetails.availabilities.length >
                                  5 && (
                                  <div
                                    style={{ fontSize: 12, color: "#b0b0b0" }}
                                  >
                                    View more in instructor profile
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>No availability details available</div>
                            )}
                          </div>
                        ) : // fallback to raw query info
                        typeof instructorMeetingData.raw === "object" ? (
                          <div>
                            Instructor:{" "}
                            {instructorMeetingData?.raw?.name ||
                              instructorMeetingData?.raw?.instructor ||
                              instructorMeetingData?.instructorId}
                          </div>
                        ) : (
                          <div>Instructor meeting requested</div>
                        )}
                      </div>
                    </label>
                  </div>
                )}
                {whatsappTradeFromUrl && (
                  <>
                    <div className="subscription-option">
                      <input
                        type="radio"
                        id="Whatsapp Trade"
                        name="subscriptionType"
                        checked={formData.subscriptionType === "Whatsapp Trade"}
                        onChange={() =>
                          handleInputChange(
                            "subscriptionType",
                            "Whatsapp Trade",
                          )
                        }
                      />
                      <label
                        htmlFor="Whatsapp Trade"
                        className="subscription-label"
                      >
                        <div className="subscription-header">
                          <CreditCard size={20} />
                          <span>Trade Signal Subscription</span>
                        </div>
                        <div className="subscription-description">
                          Get whatsapp tips and trade ideas directly on your
                          phone for 3 months
                        </div>
                      </label>
                    </div>
                  </>
                )}
                <>
                  {/* {getUser().userType.id == 1 && (
                    <div className="subscription-option">
                      <input
                        type="radio"
                        id="Yearly Subscription"
                        name="subscriptionType"
                        checked={
                          formData.subscriptionType === "Yearly Subscription"
                        }
                        onChange={() =>
                          handleInputChange(
                            "subscriptionType",
                            "Yearly Subscription",
                          )
                        }
                      />
                      <label
                        htmlFor="Yearly Subscription"
                        className="subscription-label"
                      >
                        <div className="subscription-header">
                          <CreditCard size={20} />
                          <span>Yearly Subscription</span>
                        </div>
                        <div className="subscription-description">
                          Full access to all calculators and premium features
                          for 12 months
                        </div>
                      </label>
                    </div>
                  )} */}
                  {/* <div className="subscription-option">
                      <input
                        type="radio"
                        id="AI Plan"
                        name="subscriptionType"
                        checked={formData.subscriptionType === "AI Plan"}
                        onChange={() =>
                          handleInputChange("subscriptionType", "AI Plan")
                        }
                      />
                      <label htmlFor="AI Plan" className="subscription-label">
                        <div className="subscription-header">
                          <LineChart size={20} />
                          <span>AI Plan</span>
                        </div>
                        <div className="subscription-description">
                          Access to the AI Chart Assistant (AI queries and image
                          analysis)
                        </div>
                      </label>
                    </div> */}
                </>
                {activationCouponFromUrl && (
                  <div className="subscription-option">
                    <input
                      type="radio"
                      id="Activation Coupon"
                      name="subscriptionType"
                      checked={
                        formData.subscriptionType === "Activation Coupon"
                      }
                      onChange={() =>
                        handleInputChange(
                          "subscriptionType",
                          "Activation Coupon",
                        )
                      }
                    />
                    <label
                      htmlFor="Activation Coupon"
                      className="subscription-label"
                    >
                      <div className="subscription-header">
                        <Gift size={20} />
                        <span>Activation Coupon Code</span>
                      </div>
                      <div className="subscription-description">
                        Purchase activation coupons for flexible access
                      </div>
                    </label>
                  </div>
                )}
                {/* {starterFromUrl && (
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

                // {premiumFromUrl && (
                //   <div className="subscription-option">
                //     <input
                //       type="radio"
                //       id="Premium Plan"
                //       name="subscriptionType"
                //       checked={formData.subscriptionType === "Premium Plan"}
                //       onChange={() =>
                //         handleInputChange("subscriptionType", "Premium Plan")
                //       }
                //     />
                //     <label
                //       htmlFor="Premium Plan"
                //       className="subscription-label"
                //     >
                //       <div className="subscription-header">
                //         <Gift size={20} />
                //         <span>Premium Plan</span>
                //       </div>
                //       <div className="subscription-description">
                //         Purchase premium plan for flexible access
                //       </div>
                //     </label>
                //   </div>
                // )} */}
              </div>
              {formData.subscriptionType === "Activation Coupon" && (
                <div className="coupon-section">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        className="form-input"
                        value={formData.couponQuantity}
                        onChange={(e) =>
                          handleInputChange("couponQuantity", e.target.value)
                        }
                        min={1}
                        max={10}
                        placeholder="Enter quantity"
                        style={{
                          borderBottom: errors.couponQuantity
                            ? "2px solid #e74c3c"
                            : undefined,
                        }}
                      />
                    </div>
                    {errors.couponQuantity && (
                      <div
                        style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}
                      >
                        {errors.couponQuantity}
                      </div>
                    )}
                  </div>

                  <div className="coupon-notes">
                    {/* <div className="note-item">
                      <Info size={16} />
                      <span>
                        Each coupon provides 30 days of premium access
                      </span>
                    </div> */}
                    <div className="note-item">
                      <Info size={16} />
                      <span>
                        Coupons can be used immediately or saved for later
                      </span>
                    </div>
                    <div className="note-item">
                      <Info size={16} />
                      <span>Coupon is valid till 1 year</span>
                    </div>
                    <div className="note-item">
                      <Info size={16} />
                      <span>Maximum 50 coupons per purchase</span>
                    </div>
                  </div>
                </div>
              )}

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
                    {
                      // formData.subscriptionType ===
                      // "Yearly Subscription"
                      //   ? "Yearly Subscription"
                      // formData.subscriptionType === "Starter Plan"
                      //   ? "Starter Plan"
                      //   : 
                      formData.subscriptionType === "Premium Plan"
                          ? "Premium Plan"
                          : formData.subscriptionType === "Instructor Meeting"
                            ? "Instructor Meeting"
                            : formData.subscriptionType === "AI Plan"
                              ? "AI Plan"
                              : "Activation Coupons"
                    }
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
                    {/* {formData.subscriptionType === "Yearly Subscription" && (
                      <span className="fee-note">
                        (
                        {formData.paymentGateway === "stripe"
                          ? "Stripe"
                          : "BoomFi"}
                        )
                      </span>
                    )} */}
                    {formData.subscriptionType === "Premium Plan" && (
                      <span className="fee-note">
                        (
                        {formData.paymentGateway === "stripe"
                          ? "Stripe"
                          : "BoomFi"}
                        )
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
                disabled={
                  instructorDetails ? !selectedSlot || meetingError : false
                }
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

export default Checkout;
