import React, { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  TrendingUp,
  Info,
  ArrowLeft,
  ChevronDown,
  Search,
} from "lucide-react";
import "./CurrencyConverter.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

interface Currency {
  code: string;
  name: string;
  flag?: string; // Made optional since API won't provide flags
}

interface ConversionRate {
  conversion_rate: number;
  base: string;
  target: string;
  last_updated: string;
}

interface TableData {
  amount_major_base: string[];
  amount_major_target: string[];
  major_currencies: Array<{
    from: string;
    to: string;
    rate: string;
  }>;
}

const CurrencyConverter: React.FC = () => {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState<Currency>({
    code: "EUR",
    name: "Euro",
    flag: "🇪🇺",
  });
  const [toCurrency, setToCurrency] = useState<Currency>({
    code: "USD",
    name: "United States Dollar",
    flag: "🇺🇸",
  });
  const [fromAmount, setFromAmount] = useState<string>("1");
  const [toAmount, setToAmount] = useState<string>("1.162");
  const [exchangeRate, setExchangeRate] = useState<number>(1.162);
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const [fromSearchTerm, setFromSearchTerm] = useState<string>("");
  const [toSearchTerm, setToSearchTerm] = useState<string>("");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [eurToUsdRates, setEurToUsdRates] = useState<
    { amount: string; converted: string }[]
  >([]);
  const [usdToEurRates, setUsdToEurRates] = useState<
    { amount: string; converted: string }[]
  >([]);
  const [majorCurrencies, setMajorCurrencies] = useState<
    { name: string;  symbol: string; flag: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchSupportedCurrencies = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.currencySupportedCodes);
        const supportedCodes = response.data.data.data;

        // Transform API data to our Currency interface
        const formattedCurrencies: Currency[] = supportedCodes.map(
          ([code, name]: [string, string]) => ({
            code,
            name,
            flag: getFlagEmoji(code), // Helper function to get flag emoji
          })
        );

        // Update currencies state
        setCurrencies(formattedCurrencies);

        // Set default currencies if available
        const defaultEUR = formattedCurrencies.find((c) => c.code === "EUR");
        const defaultUSD = formattedCurrencies.find((c) => c.code === "USD");

        if (defaultEUR && defaultUSD) {
          setFromCurrency(defaultEUR);
          setToCurrency(defaultUSD);
          // Fetch initial conversion rate
          fetchConversionRate(defaultEUR.code, defaultUSD.code);
        }
      } catch (err) {
        console.error("Failed to fetch supported currencies:", err);
        setError("Failed to load currencies");
      } finally {
        setLoading(false);
      }
    };

    fetchSupportedCurrencies();
  }, []);

  // Fetch conversion rate when currencies change
  const fetchConversionRate = async (baseCode: string, targetCode: string) => {
    try {
      // Get latest rates for base currency
      const latestResponse = await api.get(
        `${API_ENDPOINTS.currencyLatest}${baseCode}`
      );

      // Get specific pair rate
      const pairResponse = await api.get(
        `${API_ENDPOINTS.currencyPairs}base=${baseCode}&target=${targetCode}`
      );

      const rate = pairResponse.data.data.data.conversion_rate;
      setExchangeRate(rate);

      // Update amount based on new rate
      const numFromAmount = parseFloat(fromAmount) || 0;
      setToAmount((numFromAmount * rate).toFixed(3));

      // Fetch tables for the currency pair
      fetchConversionTables(baseCode, targetCode);
    } catch (err) {
      console.error("Failed to fetch conversion rate:", err);
      setError("Failed to update conversion rate");
    }
  };

  // Fetch conversion tables
  const fetchConversionTables = async (
    baseCode: string,
    targetCode: string
  ) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.currencyTables}?base=${baseCode}&target=${targetCode}`
      );

      const tables = response.data.data; // Adjust based on your API response structure
      // Ensure we have valid arrays before updating state
      if (Array.isArray(tables.amount_major_base) && Array.isArray(tables.amount_major_target)) {
        setEurToUsdRates(
          formatTableData(tables.amount_major_base, tables.amount_major_target)
        );
        setUsdToEurRates(
          formatTableData(tables.amount_major_target, tables.amount_major_base)
        );
      }

      if (Array.isArray(tables.major_currencies)) {
        setMajorCurrencies(formatMajorCurrencies(tables.major_currencies));
      }
    } catch (err) {
      console.error("Failed to fetch conversion tables:", err);
      setError("Failed to load conversion tables");
    }
  };

  // Helper to format table data
  const formatTableData = (amounts: any[], converted: any[]) => {
    return amounts.map((amount, index) => ({
      amount: typeof amount === 'object' ? amount.base_amount : amount,
      converted: typeof converted[index] === 'object' ? converted[index].target_amount : converted[index]
    }));
  };

  // Helper to format major currencies
  const formatMajorCurrencies = (majors: any[]) => {
 
    return majors.map((m) => ({
      name: m.name || '',
      symbol: m.symbol || '',
      flag: getFlagEmoji(m.symbol || 'USD'),
     // rate: typeof m.rate === 'object' ? m.rate.conversion_rate : m.rate
    }));
  };

  // Update handlers to use API
  const handleFromCurrencySelect = (currency: Currency) => {
    setFromCurrency(currency);
    setShowFromDropdown(false);
    setFromSearchTerm("");
    fetchConversionRate(currency.code, toCurrency.code);
  };

  const handleToCurrencySelect = (currency: Currency) => {
    setToCurrency(currency);
    setShowToDropdown(false);
    setToSearchTerm("");
    fetchConversionRate(fromCurrency.code, currency.code);
  };

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    fetchConversionRate(toCurrency.code, fromCurrency.code);
  };

  // Handle changes to the "from" amount input
  const handleFromAmountChange = (value: string) => {
    // allow empty input
    const raw = String(value);
    // Normalize commas to dots and strip invalid chars (allow digits, dot, minus)
    const cleaned = raw.replace(/,/g, ".").replace(/[^\d.\-]/g, "");
    setFromAmount(cleaned);

    // If cleaned is empty or not a valid number, clear converted value
    const num = parseFloat(cleaned);
    if (!cleaned || Number.isNaN(num) || !exchangeRate) {
      setToAmount("");
      return;
    }

    const converted = num * (exchangeRate || 0);
    setToAmount(isFinite(converted) ? converted.toFixed(3) : "");
  };

  // Handle changes to the "to" amount input (reverse conversion)
  const handleToAmountChange = (value: string) => {
    const raw = String(value);
    const cleaned = raw.replace(/,/g, ".").replace(/[^\d.\-]/g, "");
    setToAmount(cleaned);

    const num = parseFloat(cleaned);
    if (!cleaned || Number.isNaN(num) || !exchangeRate) {
      setFromAmount("");
      return;
    }

    const converted = num / (exchangeRate || 1);
    setFromAmount(isFinite(converted) ? converted.toFixed(3) : "");
  };

  // Helper to get flag emoji from currency code
  const getFlagEmoji = (countryCode: string) => {
    // Special case for EUR
    if (countryCode === "EUR") return "🇪🇺";

    // Convert currency code to country code (usually first two letters)
    const cc = countryCode.slice(0, 2);
    return cc
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  };

  if (loading) {
    return <div className="loading">Loading currency data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }


    const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  return (
    <div className="currency-converter">
      <div className="container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="currency-converter__title">Currency Converter</h1>
        </div>

        <div className="converter-main">
          <div className="converter-card">
            <div className="currency-input">
              <div
                className="currency-select"
                onClick={() => setShowFromDropdown(!showFromDropdown)}
              >
                <span className="currency-flag">{fromCurrency.flag}</span>
                <div className="currency-info">
                  <span className="currency-code">{fromCurrency.code}</span>
                  <span className="currency-name">- {fromCurrency.name}</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`dropdown-arrow ${showFromDropdown ? "open" : ""}`}
                />
              </div>

              {showFromDropdown && (
                <div className="currency-dropdown">
                  <div className="dropdown-search">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      value={fromSearchTerm}
                      onChange={(e) => setFromSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="dropdown-list">
                    {currencies
                      .filter(
                        (currency) =>
                          currency.code
                            .toLowerCase()
                            .includes(fromSearchTerm.toLowerCase()) ||
                          currency.name
                            .toLowerCase()
                            .includes(fromSearchTerm.toLowerCase())
                      )
                      .map((currency) => (
                        <div
                          key={currency.code}
                          className={`dropdown-item ${
                            currency.code === fromCurrency.code
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleFromCurrencySelect(currency)}
                        >
                          <span className="currency-flag">{currency.flag}</span>
                          <div className="currency-info">
                            <span className="currency-code">
                              {currency.code}
                            </span>
                            <span className="currency-name">
                              - {currency.name}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="amount-input"
              />
            </div>

            <button className="swap-button" onClick={handleSwapCurrencies}>
              <ArrowLeftRight size={24} />
            </button>

            <div className="currency-input">
              <div
                className="currency-select"
                onClick={() => setShowToDropdown(!showToDropdown)}
              >
                <span className="currency-flag">{toCurrency.flag}</span>
                <div className="currency-info">
                  <span className="currency-code">{toCurrency.code}</span>
                  <span className="currency-name">- {toCurrency.name}</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`dropdown-arrow ${showToDropdown ? "open" : ""}`}
                />
              </div>

              {showToDropdown && (
                <div className="currency-dropdown">
                  <div className="dropdown-search">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      value={toSearchTerm}
                      onChange={(e) => setToSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="dropdown-list">
                    {currencies
                      .filter(
                        (currency) =>
                          currency.code
                            .toLowerCase()
                            .includes(toSearchTerm.toLowerCase()) ||
                          currency.name
                            .toLowerCase()
                            .includes(toSearchTerm.toLowerCase())
                      )
                      .map((currency) => (
                        <div
                          key={currency.code}
                          className={`dropdown-item ${
                            currency.code === toCurrency.code ? "selected" : ""
                          }`}
                          onClick={() => handleToCurrencySelect(currency)}
                        >
                          <span className="currency-flag">{currency.flag}</span>
                          <div className="currency-info">
                            <span className="currency-code">
                              {currency.code}
                            </span>
                            <span className="currency-name">
                              - {currency.name}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <input
                type="number"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                className="amount-input"
              />
            </div>
          </div>

          <div className="exchange-info">
            <p className="exchange-rate">
              1 {fromCurrency.code} = {exchangeRate.toFixed(3)}{" "}
              {toCurrency.code}
            </p>
            <p className="exchange-rate">
              1 {toCurrency.code} = {(1 / exchangeRate).toFixed(5)}{" "}
              {fromCurrency.code}
            </p>
          </div>
        </div>

        <div className="live-rates-section">
          <h2 className="section-title">
            <TrendingUp size={24} />
            Live Exchange Rates
          </h2>

          {/* <div className="rates-grid">
            <div className="rates-table">
              <h3>Convert EUR to USD</h3>
              <div className="table-header">
                <span>EUR</span>
                <span>USD</span>
              </div>
              {eurToUsdRates.map((rate, index) => (
                <div key={index} className="table-row">
                  <span>{rate.amount}</span>
                  <span>{rate.converted}</span>
                </div>
              ))}
            </div>

            <div className="rates-table">
              <h3>Convert USD to EUR</h3>
              <div className="table-header">
                <span>USD</span>
                <span>EUR</span>
              </div>
              {usdToEurRates.map((rate, index) => (
                <div key={index} className="table-row">
                  <span>{rate.amount}</span>
                  <span>{rate.converted}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="major-currencies">
            <div className="major-currency-section">
              <h3>Convert EUR to Majors</h3>
              {majorCurrencies.map((currency, index) => (
                <div key={index} className="major-currency-row">
                  <span className="currency-pair">{currency.from}</span>
                  <div className="currency-result">
                    <span className="currency-name">{currency.to}</span>
                    <span className="currency-flag">{currency.flag}</span>
                    <span className="currency-rate">{currency.rate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="major-currency-section">
              <h3>Convert USD to Majors</h3>
              {majorCurrencies.map((currency, index) => (
                <div key={index} className="major-currency-row">
                  <span className="currency-pair">{currency.from}</span>
                  <div className="currency-result">
                    <span className="currency-name">{currency.to}</span>
                    <span className="currency-flag">{currency.flag}</span>
                    <span className="currency-rate">{currency.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div className="rates-grid">
            <div className="rates-table">
              <h3>
                Convert {fromCurrency.code} to {toCurrency.code}
              </h3>
              <div className="table-header">
                <span>{fromCurrency.code}</span>
                <span>{toCurrency.code}</span>
              </div>
              {eurToUsdRates.map((rate, index) => (
                <div key={index} className="table-row">
                  <span>{rate.amount || 0}</span>
                  <span>{rate.converted || 0}</span>
                </div>
              ))}
            </div>

            <div className="rates-table">
              <h3>
                Convert {toCurrency.code} to {fromCurrency.code}
              </h3>
              <div className="table-header">
                <span>{toCurrency.code}</span>
                <span>{fromCurrency.code}</span>
              </div>
              {usdToEurRates.map((rate, index) => (
                <div key={index} className="table-row">
                  <span>{rate.amount || 0}</span>
                  <span>{rate.converted || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="major-currencies">
            <div className="major-currency-section">
              <h3>Convert {fromCurrency.code} to Majors</h3>
              {majorCurrencies.map((currency, index) => (
                <div key={index} className="major-currency-row">
                  <span className="currency-pair">{currency.name || ''}</span>
                  <div className="currency-result">
                    <span className="currency-name">{fromCurrency.code || ''}</span>
                    <span className="currency-flag">{currency.symbol || ''}</span>
                    <span className="currency-rate">{currency.flag}</span>
                  </div>
                </div>
              ))}
            </div>

             <div className="major-currency-section">
              <h3>Convert {toCurrency.code} to Majors</h3>
              {majorCurrencies.map((currency, index) => (
                <div key={index} className="major-currency-row">
                  <span className="currency-pair">{currency.name || ''}</span>
                  <div className="currency-result">
                    <span className="currency-name">{currency.symbol || ''}</span>
                    <span className="currency-flag">{toCurrency.code || ''}</span>
                    <span className="currency-rate">{currency.flag || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>

        

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is Currency Exchange?
            </h3>
            <p>
              A currency exchange is when you convert a currency to another.
              Usually each country has its own currency and if for example
              you're buying an item with a different currency or traveling to a
              country with a different currency than you, this would require an
              exchange of currencies where you sell your currency and buy
              another (this would usually require a conversion fee) through a
              financial institution.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What is the purpose of a currency converter?
            </h3>
            <p>
              A currency converter is a useful tool to quickly convert between
              different foreign currencies, for example Euros to US Dollars.
              Using our calculator will do a live currency conversion with the
              current exchange rates.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to convert a currency to another?
            </h3>
            <p>
              If you are converting Euros to US Dollars, you would need to know
              the current exchange rate. Take for example the current value of
              1.19 - this would mean that 1 Euro is equal to 1.19 US Dollars.
              This can be applied for any amount by just multiplying the
              conversion value. Moreover, you can convert it the other way
              around, ie US Dollars to Euro by inverting the conversion value:
              1/1.19=0.84 which means that 1 US Dollar is equal to 0.84 Euro.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              Where can I find forex historical data?
            </h3>
            <p>
              If you're looking for historical forex exchange rates, you can
              find it in our market section, by clicking the desired symbol and
              scrolling down to the historical data link:
            </p>
            <div className="historical-links">
              <div className="link-section">
                <h4>EURUSD Analysis</h4>
                <a href="#" className="historical-link">
                  EURUSD Historical Data
                </a>
                <span className="link-description">
                  - Historical EURUSD data selectable by date range and
                  timeframe.
                </span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">
                  EURUSD Volatility
                </a>
                <span className="link-description">
                  - EURUSD real time currency volatility analysis.
                </span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">
                  EURUSD Correlation
                </a>
                <span className="link-description">
                  - EURUSD real time currency correlation analysis.
                </span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">
                  EURUSD Indicators
                </a>
                <span className="link-description">
                  - EURUSD real time indicators.
                </span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">
                  EURUSD Patterns
                </a>
                <span className="link-description">
                  - EURUSD real time price patterns.
                </span>
              </div>
            </div>
            <p>
              Our forex historical data includes open, high, low and close
              values as well as change in pips and percent. You could even
              narrow down your search using the included time filter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
