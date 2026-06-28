import { useState, useEffect } from "react";
import "./checkout-live-session.scss";
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
const LiveSessionPrice = import.meta.env.VITE_LIVE_SESSION_FEES;

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
  subscriptionType: "Live Session"; // | "Yearly Subscription"

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

const LiveSessionCheckout: React.FC = () => {
  const [cryptoCurrencies, setCryptoCurrencies] = useState<any[]>([]);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] =
    useState<any>(null);
  const [openCryptoSelection, setOpenCryptoSelection] =
    useState<boolean>(false);
  const [cryptoQuantity, setCryptoQuantity] = useState<number>(0);

  const [liveSession, setLiveSessione] = useState<any>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    mobileNo: "",
    country: "",
    subscriptionType: "Live Session",
    paymentGateway: "1",
    couponQuantity: 1,
    meetingReason: "",
  });

  const [paymentGateways, setPaymentGateways] = useState<Paymentgateways[]>([]);

  // Initialize pricing with 0 fees, will update after API call

  const [pricing, setPricing] = useState<PricingDetails>({
    basePrice: parseFloat(LiveSessionPrice),
    quantity: 1,
    fees: feesPrice, //0, // Initialize with 0
    total: parseFloat(LiveSessionPrice),
  });

  // Add useEffect to update pricing when payment gateways load
  useEffect(() => {
    if (paymentGateways.length > 0) {
      // Update pricing with fees from first gateway

      const firstGateway = paymentGateways[0];
      const basePrice = parseFloat(LiveSessionPrice);
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
    callLiveSessionDetails();
  }, []);

  const callLiveSessionDetails = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.liveSessionDetails);
      const data = res?.data?.data.data;
      if (data) {
        // Assuming response has price field, adjust as needed
        setLiveSessione(data);
      }
    } catch (error) {
      console.error("Error fetching live session details:", error);
    }
  };

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

    basePrice = parseFloat(liveSession?.price || LiveSessionPrice);
    quantity = 1;
    fees = feesAmount; // basePrice * (feesPercentage / 100);

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
    <>
      <div className="live-page">
        <div className="checkout__header">
                  <button className="back-button" onClick={handleBackToCalculators}>
                    <ArrowLeft size={20} />
                    Back to Home
                  </button>
                  {/* <h1 className="checkout__title">Checkout</h1> */}
                </div>
        {/* ========================= */}
        {/* PART 1 */}
        {/* ========================= */}

        <section className="session-header">
          <div className="live-brand">
            <span className="brand-dot"></span>

            <span>THE TRADING ROOM · BY TRADELIVE24</span>
          </div>

          <div className="live-hero">
            <div className="live-label">
              LIVE SESSION ·{" "}
              {new Date(liveSession?.sessionDateTime).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </div>

            <h1>
              The Trading Room
            </h1>
            <h3>
              By Tradelive24
            </h3>

            <p>{liveSession?.description}</p>
          </div>

          <div className="live-meta">
            <div className="meta-item">
              <strong>Date</strong>

              <span>
                {new Date(liveSession?.sessionDateTime).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </span>
            </div>

            <div className="meta-item">
              <strong>Time</strong>

              <span>9:00 AM – 1:00 PM</span>
            </div>

            <div className="meta-item">
              <strong>Duration</strong>

              <span>{liveSession?.sessionDuration} Hours</span>
            </div>

            <div className="meta-item">
              <strong>Seats</strong>

              <span>{liveSession?.sessionOccupancy} Seats only</span>
            </div>

            <div className="meta-item">
              <strong>Location</strong>

              <span>{liveSession?.displayLocation} </span>
            </div>

            <div className="meta-item">
              <strong>Total Seats Left</strong>

              <span>
                {parseInt(liveSession?.sessionOccupancy) -
                  parseInt(liveSession?.sessionOccupancyCount)}{" "}
                 seats
              </span>
            </div>
          </div>
        </section>

        {/* ========================= */}
        {/* PART 2 + PART 3 */}
        {/* ========================= */}

        <div className="session-body">
          {/* ========================= */}
          {/* PART 2 */}
          {/* ========================= */}

          <section className="session-details">
            <h3>INSIDE THE SESSION</h3>

            <div className="session-html">
              <div
                dangerouslySetInnerHTML={{
                  __html: liveSession?.sessionDescription || "",
                }}
              />
            </div>

            {/* <div className="session-points">

        {liveSession?.sessionKeypoints?.map(
          (item, index) => (
            <div
              key={index}
              className="point-item"
            >
              ✓ {item}
            </div>
          )
        )}

      </div> */}
          </section>

          {/* ========================= */}
          {/* PART 3 */}
          {/* ========================= */}

          <aside className="session-booking">
            <div className="booking-card">
              <div className="booking-price">
                <h2>${pricing.basePrice}</h2>

                <span>one-time session fee</span>
              </div>

              <div className="seat-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: "45%",
                    }}
                  />
                </div>

                <span>Limited seats available</span>
              </div>

              {/* FULL NAME */}

              <div className="booking-group">
                <label>Full Name</label>

                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                />
              </div>

              {/* EMAIL */}

              <div className="booking-group">
                <label>Email Address</label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              {/* MOBILE */}

              <div className="booking-group">
                <label>Mobile Number</label>

                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    handleInputChange("mobileNo", e.target.value)
                  }
                />
              </div>

              {/* COUNTRY */}

              <div className="booking-group">
                <label>Country</label>

                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                >
                  <option value="">Select Country</option>

                  {countries.map((c) => (
                    <option key={c.iso2} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PAYMENT */}

              <div className="payment-section">
                <label>Payment Method</label>

                <div className="payment-methods">
                  {paymentGateways.map((g) => (
                    <div
                      key={g.id}
                      className={`payment-method ${
                        String(formData.paymentGateway) === String(g.id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleInputChange("paymentGateway", String(g.id))
                      }
                    >
                      <div className="gateway-top">
                        <img src={g.image} alt={g.name} />

                        <div>
                          <h4>{g.name}</h4>

                          <p>{g.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CRYPTOS */}

                {openCryptoSelection && (
                  <div className="crypto-list">
                    {cryptoCurrencies.map((token) => (
                      <label key={token.id} className="crypto-item">
                        <input
                          type="radio"
                          name="crypto"
                          checked={selectedCryptoCurrency?.id === token.id}
                          onChange={() => handleSelectCrypto(token)}
                        />

                        <img src={token.logo_url} alt={token.symbol} />

                        <div>
                          <strong>{token.symbol}</strong>

                          <small>
                            {cryptoQuantity} {token.symbol}
                          </small>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button className="reserve-btn" onClick={handleProceed}>
                Reserve Your Seat — ${pricing.total.toFixed(2)}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default LiveSessionCheckout;
