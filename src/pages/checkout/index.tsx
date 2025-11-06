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
    | "Instructor Meeting";
  paymentGateway: "stripe" | "boomfi" | string;
  couponQuantity: number;
}

interface PricingDetails {
  basePrice: number;
  quantity: number;
  fees: number;
  total: number;
}

const Checkout: React.FC = () => {
  // detect instructor meeting data from URL and set default subscription
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

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    mobileNo: "",
    country: "",
    subscriptionType:
      instructorMeetingFromUrl && instructorMeetingFromUrl.enabled
        ? "Instructor Meeting"
        : getUser()?.userType.id == 1
        ? "Yearly Subscription"
        : "Activation Coupon",
    paymentGateway: "1",
    couponQuantity: 1,
  });

  // store parsed instructor meeting data (if any)
  const [instructorMeetingData, setInstructorMeetingData] = useState<any>(
    instructorMeetingFromUrl
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
                (a: any) => String(a.id) === String(availId)
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
    basePrice:  instructorMeetingFromUrl && instructorMeetingFromUrl.enabled ? 99.0 : planPrice ? parseFloat(planPrice) : 12.0,
    quantity: 1,
    fees: 0, // Initialize with 0
    total: instructorMeetingFromUrl && instructorMeetingFromUrl.enabled ? 99.0 : planPrice ? parseFloat(planPrice) : 12.0, // Initial total without fees
  });

  // Add useEffect to update pricing when payment gateways load
  useEffect(() => {
    if (paymentGateways.length > 0) {
      // Update pricing with fees from first gateway
      const shouldFetch =
        instructorMeetingData &&
        instructorMeetingData.enabled;
      const firstGateway =
        getUser().userType.id == 1 ? paymentGateways[0] : paymentGateways[1];
      const basePrice = shouldFetch==1 || shouldFetch ?99.00:planPrice ? parseFloat(planPrice) : 12.0;
      const feesPercent = Number(firstGateway.fee_percentage || 0);
      const fees = (basePrice * feesPercent) / 100;
      console.log(basePrice,"????")
      setPricing((prev) => ({
        ...prev,
        fees,
        total: basePrice + fees,
      }));
    }
  }, [paymentGateways,instructorMeetingData, instructorDetails]);

  // validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    callPaymentGateways();
  }, []);

  // if more complex parsing at mount is required, keep here
  useEffect(() => {
    if (!instructorMeetingData) {
      const parsed = parseInstructorMeetingFromUrl();
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

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | number
  ) => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePricing = (data: CheckoutFormData) => {
    let basePrice = 0;
    let quantity = 1;
    let fees = 0;

    const selectedGateway = paymentGateways.find(
      (g) => String(g.id) === String(data.paymentGateway)
    );
    const feesPercentage = Number(
      (selectedGateway as any)?.fee_percentage ||
        (selectedGateway as any)?.fees_percent ||
        0
    );

    if (data.subscriptionType === "Yearly Subscription") {
      basePrice = planPrice ? parseFloat(planPrice) : 12.0;
      quantity = 1;
      fees = basePrice * (feesPercentage / 100);
    } else if(data.subscriptionType === "Activation Coupon") {
      basePrice = planPrice ? parseFloat(planPrice) : 12.0;
      quantity = data.couponQuantity || 1;
      fees = basePrice * quantity * (feesPercentage / 100);
    }else if(data.subscriptionType === "Instructor Meeting") {
      basePrice = instructorDetails?.meeting_price
        ? parseFloat(instructorDetails.meeting_price)
        : 99.00; // default meeting price
      quantity = 1;
      fees = basePrice * (feesPercentage / 100);
    }

    const total = basePrice * quantity + fees;

    setPricing({
      basePrice: basePrice || 0,
      quantity: quantity || 0,
      fees: fees || 0,
      total: total || 0,
    });
  };

  const handleBackToCalculators = () => {
    window.history.back();
  };

  const handleProceed = async () => {
    try{
    if (!validateForm()) {
      // focus first error field (optional)
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const el = document.querySelector(
          `[name="${firstErrorField}"], #${firstErrorField}`
        ) as HTMLElement | null;
        el?.focus();
      }
      return;
    }

    // Process checkout
    // include instructorMeetingData in metadata if present
    const metadata = {
      ...formData,
      ...pricing,
      ...(instructorMeetingData
        ? { instructorMeeting: instructorMeetingData }
        : {}),
      ...(instructorDetails ? { instructorDetails } : {}),
      ...(selectedSlot ? { selectedSlot } : {}),
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
      const res = await api.post(API_ENDPOINTS.stripeCreateSession, payload);
    }
  }catch(error){
    console.log(error);
    errorMsg(error.message?error.message:"Something went wrong during checkout process. or already booked")
  }
  };
  return (
    <div className="checkout-page">
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
            </div>

            <div className="checkout-card">
              <h2 className="section-title">Subscription Options</h2>

              <div className="subscription-options">
                {/* If instructorMeeting data present in URL, show only Instructor Meeting option */}
                {instructorMeetingData ? (
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
                          "Instructor Meeting"
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
                                    selectedSlot.available_date
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
                                            a.available_date
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
                ) : (
                  <>
                    {getUser().userType.id == 1 && (
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
                              "Yearly Subscription"
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
                    )}

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
                            "Activation Coupon"
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
                  </>
                )}
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
            </div>
          </div>

          <div className="checkout-summary-section">
            <div className="summary-card">
              <h2 className="section-title">Order Summary</h2>

              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">
                    {formData.subscriptionType === "Yearly Subscription"
                      ? "Yearly Subscription"
                      : formData.subscriptionType === "Instructor Meeting"
                      ? "Instructor Meeting"
                      : "Activation Coupons"}
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
                    {formData.subscriptionType === "Yearly Subscription" && (
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
                    ${pricing.fees.toFixed(2)}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-item summary-total">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">
                    ${pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="proceed-button"
                disabled={instructorDetails ? !selectedSlot || meetingError : false}
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
