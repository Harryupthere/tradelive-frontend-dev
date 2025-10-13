import { useState } from 'react';
import './PositionSizeCalculator.scss';
import { useNavigate } from 'react-router-dom'; 
import {  Info, ArrowLeft, ChevronDown, Search } from 'lucide-react';

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

interface CalculationResults {
  moneyAtRisk: number;
  units: number;
  lotSize: number;
}

const PositionSizeCalculator : React.FC = ()  => {
        const navigate = useNavigate();
    
  const [currencyPair, setCurrencyPair] = useState('EURUSD');
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [accountSize, setAccountSize] = useState(10000);
  const [riskRatio, setRiskRatio] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [tradeSize, setTradeSize] = useState(1);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const currencyPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD',
    'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'EURAUD'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

  const getPipValue = (pair: string, accountCurr: string): number => {
    const standardPipValue: { [key: string]: number } = {
      'EURUSD': 10,
      'GBPUSD': 10,
      'AUDUSD': 10,
      'NZDUSD': 10,
      'USDJPY': 9.09,
      'USDCHF': 10,
      'USDCAD': 7.69,
      'EURGBP': 12.86,
      'EURJPY': 9.17,
      'GBPJPY': 9.17,
      'AUDJPY': 9.17,
      'EURAUD': 6.67,
    };

    return standardPipValue[pair] || 10;
  };

  const calculatePositionSize = () => {
    if (accountSize <= 0 || riskRatio <= 0 || stopLossPips <= 0) {
      return;
    }

    const moneyAtRisk = (accountSize * riskRatio) / 100;
    const pipValue = getPipValue(currencyPair, accountCurrency);
    const units = moneyAtRisk / (stopLossPips * (pipValue / 100000));
    const lotSize = units / 100000;

    setResults({
      moneyAtRisk: parseFloat(moneyAtRisk.toFixed(2)),
      units: parseFloat(units.toFixed(0)),
      lotSize: parseFloat(lotSize.toFixed(2)),
    });
  };

  const handleReset = () => {
    setCurrencyPair('EURUSD');
    setAccountCurrency('USD');
    setAccountSize(10000);
    setRiskRatio(1);
    setStopLossPips(50);
    setTradeSize(1);
    setResults(null);
  };

  const handleSwap = () => {
    const baseCurrency = currencyPair.substring(0, 3);
    const quoteCurrency = currencyPair.substring(3, 6);

    const reversedPair = quoteCurrency + baseCurrency;

    if (currencyPairs.includes(reversedPair)) {
      setCurrencyPair(reversedPair);
    }
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
          <h1 className="currency-converter__title">Position Size Calculator</h1>
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
                onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
                placeholder="Enter account size"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Risk Ratio, %:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={riskRatio}
                onChange={(e) => setRiskRatio(parseFloat(e.target.value) || 0)}
                placeholder="Enter risk percentage"
                step="0.1"
              />
              <button className="swap-button" onClick={handleSwap}>
                Swap with Money
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
                onChange={(e) => setStopLossPips(parseFloat(e.target.value) || 0)}
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
            <button className="btn btn-calculate" onClick={calculatePositionSize}>
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
                <span className="result-value">${results.moneyAtRisk.toFixed(2)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Units</span>
                <span className="result-value">{results.units.toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Sizing</span>
                <span className="result-value">{results.lotSize.toFixed(2)} lots</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionSizeCalculator;
