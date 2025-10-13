import { useState, useEffect } from "react";
import "./RebateCalculator.scss";
import { ArrowLeft } from "lucide-react";

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

const RebateCalculator: React.FC = () => {
  const [currencyPair, setCurrencyPair] = useState("EURUSD");
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [rebateRatio, setRebateRatio] = useState("100:1");
  const [tradeSize, setTradeSize] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(1.16055);
  const [result, setResult] = useState<number | null>(null);

  const currencyPairs = [
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "USDCHF",
    "AUDUSD",
    "USDCAD",
    "NZDUSD",
    "EURGBP",
    "EURJPY",
    "GBPJPY",
    "AUDJPY",
    "EURAUD",
  ];

  const currencies = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"];

  const rebateRatios = ["50:1", "100:1", "200:1", "400:1", "500:1"];

  const exchangeRates: { [key: string]: number } = {
    EURUSD: 1.16055,
    GBPUSD: 1.3842,
    USDJPY: 110.25,
    USDCHF: 0.9215,
    AUDUSD: 0.77402,
    USDCAD: 1.2568,
    NZDUSD: 0.7185,
    EURGBP: 0.8412,
    EURJPY: 128.55,
    GBPJPY: 152.68,
    AUDJPY: 85.32,
    EURAUD: 1.5012,
  };

  useEffect(() => {
    if (exchangeRates[currencyPair]) {
      setExchangeRate(exchangeRates[currencyPair]);
    }
  }, [currencyPair]);

  const calculateRebate = () => {
    if (!tradeSize || tradeSize <= 0) {
      setResult(null);
      return;
    }

    const leverage = parseInt(rebateRatio.split(":")[0]);
    const baseCurrency = currencyPair.substring(0, 3);
    const quoteCurrency = currencyPair.substring(3, 6);

    let rebate = 0;
    const contractSize = tradeSize * 100000;

    if (quoteCurrency === accountCurrency) {
      rebate = (contractSize * exchangeRate) / leverage;
    } else if (baseCurrency === accountCurrency) {
      rebate = contractSize / leverage;
    } else {
      rebate = (contractSize * exchangeRate) / leverage;
    }

    setResult(parseFloat(rebate.toFixed(2)));
  };

  const handleReset = () => {
    setCurrencyPair("EURUSD");
    setAccountCurrency("USD");
    setRebateRatio("100:1");
    setTradeSize(1);
    setExchangeRate(1.16055);
    setResult(null);
  };

  const handleBackToCalculators = () => {
    // navigate(`${base}forum-calculators`);
    window.history.back();
  };

  return (
    <div className="rebate-calculator">
      <div className="calculator-container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="currency-converter__title">Rebate Calculator</h1>
        </div>

        <div className="calculator-card">
          <h2 className="section-title">Values</h2>

          <div className="form-group">
            <label className="form-label">Currency Pair:</label>
            <div className="input-wrapper">
              <select
                className="form-select"
                value={currencyPair}
                onChange={(e) => setCurrencyPair(e.target.value)}
              >
                {currencyPairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Currency:</label>
            <div className="input-wrapper">
              <select
                className="form-select"
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rebate Ratio:</label>
            <div className="input-wrapper">
              <select
                className="form-select"
                value={rebateRatio}
                onChange={(e) => setRebateRatio(e.target.value)}
              >
                {rebateRatios.map((ratio) => (
                  <option key={ratio} value={ratio}>
                    {ratio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Trade Size (Lots):</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={tradeSize}
                onChange={(e) => setTradeSize(parseFloat(e.target.value) || 0)}
                placeholder="Enter trade size"
                step="0.01"
              />
            </div>
          </div>

          <div className="exchange-rate-display">
            <span className="rate-label">{currencyPair}:</span>
            <span className="rate-value">{exchangeRate.toFixed(5)}</span>
          </div>

          <div className="result-section">
            <div className="result-display">
              <div className="result-label">Result:</div>
              <div className="result-value">
                {result !== null
                  ? `$${result.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "-"}
              </div>
            </div>
            <div className="button-group">
              <button className="btn btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-calculate" onClick={calculateRebate}>
                Calculate
              </button>
            </div>
          </div>
        </div>

        <div className="info-section">
          <p className="info-description">
            Calculate your exact rebate or loss before entering a position and
            plan your trading plan accordingly. Using the forex rebate
            calculator you can adjust your trade size or take rebate and stop
            loss levels to increase or decrease potential gain or loss to match
            your trading plan.{" "}
          </p>

          <h3 className="info-heading">How to use the calculator?</h3>
          <p className="info-text">
            Complete the following fields: Currency pair - the currency you are
            trading Account currency - the deposit currency of your trading
            account Trade size - the trade size in lots or units Open price -
            the entry price of your trade Close price - the exit price of your
            trade Direction - either buy or sell (long or short). The rebate
            calculator takes the difference of entry and exit prices and
            multiplies it based on the pip value of your trade. The pip value
            calculation takes into account the currency pair, the lot size and
            your base currency (account currency).
          </p>
          {/* <p className="info-text">
            For example, for a USD account with leverage 1:100 and the current forex prices (as of writing), the rebate cost would be:
          </p>

          <table className="info-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Base to Deposit Conversion</th>
                <th>Lots</th>
                <th>Rebate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EURUSD</td>
                <td>1.19477 (EUR-USD)</td>
                <td>1</td>
                <td>$1194.78</td>
              </tr>
              <tr>
                <td>AUDUSD</td>
                <td>0.77402 (AUD-USD)</td>
                <td>1</td>
                <td>$774.02</td>
              </tr>
              <tr>
                <td>USDJPY</td>
                <td>1 (USD-USD)</td>
                <td>1</td>
                <td>$1000.00</td>
              </tr>
            </tbody>
          </table> */}

          <h3 className="info-heading">
            Why is it important to use the calculator?
          </h3>
          <p className="info-text">
            When planning your trade, it is important to understand the
            potential rebate or loss of a trade. Our Forex rebate loss
            calculator can be used as a take rebate or stop loss calculator
            whether you’re actually using sl/tp values or closing the trade
            manually. If you wish to calculate your rebate with a more advanced
            calculator to include the exact risk you wish to use, head over to
            our position size calculator.{" "}
          </p>

          <h3 className="info-heading">
            How is rebate calculated in forex trading?
          </h3>
          <p className="info-text">
            Rebate In foreign exchange is the difference between your open and
            close price. When trading forex, you can open a trade in 2
            directions: buy (long) and sell (short). To make a rebate with a buy
            trade, you need to buy a currency at a low price and sell at a
            higher price. To make a rebate with a sell trade, you need to sell a
            currency at a high price and buy it back at a lower price. For
            example, using our calculator as a gold rebate calculator, if you
            buy 100 units (standard lot of gold) of gold at $1890.00 and sell it
            at $1891.00, you would rebate $100.
          </p>

          {/* <h3 className="info-heading">How much rebate do I have in my account?</h3>
          <p className="info-text">
            That would depend on your account leverage and open positions. Each open trade in your account takes away from your available rebate.
          </p>
          <p className="info-text">
            For example, a trade of 1 lot EURUSD would require $100,000 times the EURUSD rate in rebate (to convert from base currency to deposit currency), so if price is 1.1912, this would mean a rebate of $119,120, before leverage is applied.
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default RebateCalculator;
