import { useState } from 'react';
import './LeverageCalculator.scss';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const base = import.meta.env.VITE_BASE;

interface CalculationResults {
  requiredMargin: number;
  leverageRatio: string;
  positionValue: number;
  marginPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const LeverageCalculator: React.FC = () => {
  const navigate = useNavigate();

  const [accountBalance, setAccountBalance] = useState(10000);
  const [positionSize, setPositionSize] = useState(100000);
  const [leverage, setLeverage] = useState(100);
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string>('');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];
  const leverageOptions = [1, 2, 5, 10, 20, 25, 30, 50, 100, 200, 300, 400, 500];

  const calculateLeverage = () => {
    setError('');

    if (accountBalance <= 0) {
      setError('Account balance must be greater than 0');
      return;
    }

    if (positionSize <= 0) {
      setError('Position size must be greater than 0');
      return;
    }

    if (leverage <= 0) {
      setError('Leverage must be greater than 0');
      return;
    }

    try {
      const requiredMargin = positionSize / leverage;
      const leverageRatio = `${leverage}:1`;
      const marginPercentage = (requiredMargin / accountBalance) * 100;

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (leverage >= 100) riskLevel = 'high';
      else if (leverage >= 50) riskLevel = 'medium';

      if (requiredMargin > accountBalance) {
        setError('Insufficient account balance for this position size and leverage');
        return;
      }

      setResults({
        requiredMargin: parseFloat(requiredMargin.toFixed(2)),
        leverageRatio,
        positionValue: positionSize,
        marginPercentage: parseFloat(marginPercentage.toFixed(2)),
        riskLevel,
      });
    } catch (err) {
      setError('An error occurred during calculation');
    }
  };

  const handleReset = () => {
    setAccountBalance(10000);
    setPositionSize(100000);
    setLeverage(100);
    setCurrency('USD');
    setResults(null);
    setError('');
  };

  const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  const getRiskWarning = () => {
    if (!results) return null;

    if (results.riskLevel === 'high') {
      return 'High Risk: Leverage above 100:1 can lead to significant losses. Trade with caution.';
    } else if (results.riskLevel === 'medium') {
      return 'Medium Risk: Moderate leverage requires careful risk management.';
    }
    return null;
  };

  return (
    <div className="leverage-calculator">
      <div className="container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="calculator-title">Leverage Calculator</h1>
        </div>

        <div className="calculator-card">
          <h2 className="section-title">Values</h2>

          <div className="form-group">
            <label className="form-label">Account Balance:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                placeholder="Enter account balance"
                min="0"
                step="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Position Size:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={positionSize}
                onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
                placeholder="Enter position size"
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Leverage:</label>
            <div className="input-wrapper">
              <select
                className="form-select"
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value))}
              >
                {leverageOptions.map((lev) => (
                  <option key={lev} value={lev}>
                    {lev}:1
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
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {leverage >= 50 && (
            <div className="leverage-info">
              Leverage {leverage}:1 - {leverage >= 100 ? 'High Risk' : 'Medium Risk'} Trading
            </div>
          )}

          <div className="button-group">
            <button className="btn btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-calculate" onClick={calculateLeverage}>
              Calculate
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        {results && (
          <div className="results-card">
            <h2 className="section-title">Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Required Margin</span>
                <span className="result-value">
                  {currency} {results.requiredMargin.toLocaleString()}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Leverage Ratio</span>
                <span className="result-value">{results.leverageRatio}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Position Value</span>
                <span className="result-value">
                  {currency} {results.positionValue.toLocaleString()}
                </span>
              </div>
              <div className={`result-item ${results.riskLevel === 'high' ? 'danger' : results.riskLevel === 'medium' ? 'warning' : ''}`}>
                <span className="result-label">Margin Usage</span>
                <span className="result-value">{results.marginPercentage.toFixed(2)}%</span>
              </div>
              <div className={`result-item ${results.riskLevel === 'high' ? 'danger' : results.riskLevel === 'medium' ? 'warning' : ''}`}>
                <span className="result-label">Risk Level</span>
                <span className="result-value">
                  {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)}
                </span>
              </div>
            </div>

            {getRiskWarning() && (
              <div className="risk-warning">
                ⚠️ {getRiskWarning()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeverageCalculator;