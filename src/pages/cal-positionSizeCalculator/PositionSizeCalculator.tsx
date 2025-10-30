import { useEffect, useState } from "react";
import "./PositionSizeCalculator.scss";
import { useNavigate } from "react-router-dom";
import { Info, ArrowLeft, ChevronDown, Search } from "lucide-react";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

interface CalculationResults {
  moneyAtRisk: number;
  units: number;
  lotSize: number;
}

const PositionSizeCalculator: React.FC = () => {
  const navigate = useNavigate();

  const [currencyPair, setCurrencyPair] = useState();
  const [accountCurrency, setAccountCurrency] = useState();
  const [accountSize, setAccountSize] = useState();
  const [riskRatio, setRiskRatio] = useState();
  const [stopLossPips, setStopLossPips] = useState();
  const [tradeSize, setTradeSize] = useState();
  const [riskAmount, setRiskAmount] = useState();
  const [results, setResults] = useState<CalculationResults | null>(null);

  const [riskPercentageBool,setRiskPercentageBool]=useState(true);


  const [currencyPairs, setCurrencyPairs] = useState([
    
  ]);

  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchList()
  }, []);

  const fetchList = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.positionList);
      setCurrencyPairs(response.data.data.currencyPairs)
      setCurrencies(response.data.data.currencies)

              // Set default currencies if available
       
         setCurrencyPair( "EUR/USD");
    setAccountCurrency("USD");
    } catch (error) {
      console.error("Error fetching position list:", error);
    }
  }


  const calculatePositionSize = async() => {
    if (accountSize <= 0 || riskRatio <= 0 || stopLossPips <= 0) {
      return;
    }

   const payload={currencyPair,accountCurrency,accountSize,risk:riskPercentageBool?riskRatio:riskAmount,riskType:riskPercentageBool?"percent":"money",stopLossPips,"tradeSizeLots":tradeSize};

   const response= await api.post(`${API_ENDPOINTS.positionSizeCalculator}`,payload);
   const result = response.data.data;

    setResults({
      moneyAtRisk: parseFloat(result.riskAmount.toFixed(2)),
      units: parseFloat(result.units.toFixed(0)),
      lotSize: parseFloat(result.lots.toFixed(2)),
    });
  };

  const handleReset = () => {
    setCurrencyPair("EURUSD");
    setAccountCurrency("USD");
    setAccountSize();
    setRiskRatio();
    setStopLossPips();
    setTradeSize();
    setResults();
  };


  const handleSwap = () => {
    setRiskPercentageBool(!riskPercentageBool);
    // const baseCurrency = currencyPair.substring(0, 3);
    // const quoteCurrency = currencyPair.substring(3, 6);

    // const reversedPair = quoteCurrency + baseCurrency;

    // if (currencyPairs.includes(reversedPair)) {
    //   setCurrencyPair(reversedPair);
    // }
  };

  const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  return (
    <div className="position-size-calculator">
      <div className="calculator-container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="currency-converter__title">
            Position Size Calculator
          </h1>
        </div>
        {/* <h1 className="calculator-title">Position Size Calculator</h1> */}

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
            <label className="form-label">Account Size:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={accountSize}
                onChange={(e) =>
                  setAccountSize(parseFloat(e.target.value) || 0)
                }
                placeholder="Enter account size"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{`Risk Ratio, ${riskPercentageBool ? "%" : "Amount"}`}</label>
            <div className="input-wrapper">
             { riskPercentageBool?<input
                type="number"
                className="form-input"
                value={riskRatio}
                onChange={(e) => setRiskRatio(parseFloat(e.target.value) || 0)}
                placeholder="Enter risk percentage"
                step="0.1"
              />
              :
              <input
                type="number"
                className="form-input"
                value={riskAmount}
                onChange={(e) => setRiskAmount(parseFloat(e.target.value) || 0)}
                placeholder="Enter risk amount"
                step="0.1"
              />}
              <button className="swap-button" onClick={handleSwap}>
                {`Swap with ${riskPercentageBool ? "Amount" : "Percentage"}`}
              </button>
            </div>
          </div>

          

          <div className="form-group">
            <label className="form-label">Stop-Loss, Pips:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={stopLossPips}
                onChange={(e) =>
                  setStopLossPips(parseFloat(e.target.value) || 0)
                }
                placeholder="Enter stop loss in pips"
              />
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

          <div className="button-group">
            <button className="btn btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button
              className="btn btn-calculate"
              onClick={calculatePositionSize}
            >
              Calculate
            </button>
          </div>
        </div>

        {results && (
          <div className="results-card">
            <h2 className="section-title">Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Money, {accountCurrency}</span>
                <span className="result-value">
                  ${results.moneyAtRisk.toFixed(2)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Units</span>
                <span className="result-value">
                  {results.units.toLocaleString()}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Sizing</span>
                <span className="result-value">
                  {results.lotSize.toFixed(2)} lots
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is Position Size Calculator?
            </h3>
            <p>
              A position size calculator helps traders determine the optimal lot size for their trades based on their account size, risk tolerance, and stop-loss level. It's an essential risk management tool that ensures you don't risk more than a predetermined percentage of your trading account on any single trade.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How does Position Sizing work?
            </h3>
            <p>
              Position sizing works by calculating the appropriate lot size based on three main factors: your account size, the percentage of your account you're willing to risk per trade, and your stop-loss in pips. The calculator automatically computes the exact position size that keeps your potential loss within your risk parameters.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              Why is Position Sizing important?
            </h3>
            <p>
              Proper position sizing is crucial for risk management in forex trading. It helps you:
              • Protect your trading capital from significant losses
              • Maintain consistent risk across different trades
              • Stay within your risk comfort zone
              • Achieve more sustainable trading results
              • Avoid emotional trading decisions
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to use the Position Size Calculator?
            </h3>
            <p>
              1. Enter your account size and currency
              2. Specify your risk percentage (usually 1-2% per trade)
              3. Input your stop-loss in pips
              4. Select your trading pair
              5. The calculator will show you:
                 • The exact lot size to trade
                 • The total units of currency
                 • The amount of money at risk
            </p>
          </div>
        </div>

      </div> {/* Close calculator-container */}
    </div> 
  );
}

export default PositionSizeCalculator;
