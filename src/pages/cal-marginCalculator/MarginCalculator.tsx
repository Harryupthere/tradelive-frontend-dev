import { useState, useEffect } from 'react';
import './MarginCalculator.scss';
import { ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { api } from '../../api/Service';

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

const MarginCalculator: React.FC = () => {
  const [currencyPair, setCurrencyPair] = useState('EUR/USD');
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [marginRatio, setMarginRatio] = useState('100:1');
  const [tradeSize, setTradeSize] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [result, setResult] = useState<number | null>(null);

  const [currencyPairs, setCurrencyPairs] = useState([
  ]);

  const [currencies, setCurrencies] = useState([]);

  const marginRatios = [
    '50:1', '100:1', '200:1', '400:1', '500:1'
  ];

  useEffect(() => {
    // Fetch supported currency codes
    fetchCurrenciesAndPairs()
  },[])
  useEffect(() => {
    // if (exchangeRates[currencyPair]) {
    //   setExchangeRate(exchangeRates[currencyPair]);
    // }
    fetchCurrentRate()
  }, [currencyPair,accountCurrency]);



  const fetchCurrenciesAndPairs = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.positionList);
      setCurrencies(response.data.data.currencies);
      setCurrencyPairs(response.data.data.currencyPairs);
  }catch(error){
      console.error('Error fetching supported currencies:', error);
    }
  }


  const fetchCurrentRate = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.currencyPairs + `base=${currencyPair.substring(0,3)}&target=${accountCurrency}`);
      if (response && response.data.data.data.conversion_rate) {
        setExchangeRate(response.data.data.data.conversion_rate);
      }
    }catch(error){
      console.error('Error fetching exchange rate:', error);
    }
  }
  const calculateMargin = async () => {
    if (!tradeSize || tradeSize <= 0) {
      setResult(null);
      return;
    }

    const response = await api.post(API_ENDPOINTS.marginCalculator, {
      currencyPair,
      accountCurrency,
      marginRatio,
      tradeSizeLots:tradeSize,
    //  exchangeRate
    });

    // console.log('Margin Calculator Response:', response);

    if (response && response.data.data.requiredMargin) {
      setResult(parseFloat(response.data.data.requiredMargin.toFixed(2)));
    }
  };

  const handleReset = () => {
    setCurrencyPair('EURUSD');
    setAccountCurrency('USD');
    setMarginRatio('100:1');
    setTradeSize(1);
    setResult(null);
    
  };

  const handleBackToCalculators = () => {
    // navigate(`${base}forax-calculators`);
    window.history.back();
  };

  return (
    <div className="margin-calculator">
      <div className="container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="currency-converter__title">Margin Calculator</h1>
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
            <label className="form-label">Margin Ratio:</label>
            <div className="input-wrapper">
              <select
                className="form-select"
                value={marginRatio}
                onChange={(e) => setMarginRatio(e.target.value)}
              >
                {marginRatios.map((ratio) => (
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
            <span className="rate-value">{exchangeRate}</span>
          </div>

          <div className="result-section">
            <div className="result-display">
              <div className="result-label">Result:</div>
              <div className="result-value">
                {result !== null ? `$${result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
              </div>
            </div>
            <div className="button-group">
              <button className="btn btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-calculate" onClick={calculateMargin}>
                Calculate
              </button>
            </div>
          </div>
        </div>

        <div className="info-section">
          <p className="info-description">
            Our forex margin calculator will help you calculate the exact margin needed to open your trading position.
          </p>

          <h3 className="info-heading">How to calculate margin?</h3>
          <p className="info-text">
            Select your currency pair, account currency (deposit base currency) and margin (leverage) ratio, input your trade size (in units, 1 lot= 100,000 units) and click calculate. The calculator will use the current real-time prices for exact values.
          </p>
          <p className="info-text">
            For example, for a USD account with leverage 1:100 and the current forex prices (as of writing), the margin cost would be:
          </p>

          <table className="info-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Base to Deposit Conversion</th>
                <th>Lots</th>
                <th>Margin</th>
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
          </table>

          <h3 className="info-heading">Why is margin important?</h3>
          <p className="info-text">
            Opening a trade with too much margin can quickly lead to a margin call. Opening a trade with insufficient margin could lead to a profitable trade which has little impact on your trading account. Therefore, the margin required should be somewhere in between and according to your risk appetite.
          </p>

          <h3 className="info-heading">What does 1:100 leverage in Forex mean?</h3>
          <p className="info-text">
            If you open an account with $100 and have a leverage of 1:100, this means you have a trading margin of 100*100=$10,000. This could be used to open multiple trades or a single trade, depending on the trade size, while the sum of all used margin cannot go over $10,000.
          </p>

          <h3 className="info-heading">How much margin do I have in my account?</h3>
          <p className="info-text">
            That would depend on your account leverage and open positions. Each open trade in your account takes away from your available margin.
          </p>
          <p className="info-text">
            For example, a trade of 1 lot EURUSD would require $100,000 times the EURUSD rate in margin (to convert from base currency to deposit currency), so if price is 1.1912, this would mean a margin of $119,120, before leverage is applied.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarginCalculator;
