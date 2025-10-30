import { useState } from 'react';
import './FibonacciCalculator.scss';
import { ArrowLeft } from 'lucide-react';
import { errorMsg } from '../../utils/customFn';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { api } from '../../api/Service';

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

interface FibonacciResults {
  retracements: { [key: string]: number };
  extensions: { [key: string]: number };
}

const FibonacciCalculator: React.FC = () => {
  const [highValue, setHighValue] = useState<number>(0);
  const [lowValue, setLowValue] = useState<number>(0);
  const [customValue, setCustomValue] = useState<number>(0);
  const [trendType, setTrendType] = useState<'uptrend' | 'downtrend'>('uptrend');
  const [results, setResults] = useState<FibonacciResults | null>(null);

  const handleRadioChange = (value: 'uptrend' | 'downtrend') => {
    setTrendType(value);
  };

  const calculateFibonacci = async () => {
    console.log('Calculating Fibonacci with:', { highValue, lowValue, customValue, trendType });
    if( highValue === 0 || lowValue === 0 || customValue===0 || isNaN(highValue) || isNaN(lowValue)) {
      errorMsg('Please enter valid numbers for High and Low values');
      return;
    }
        if( highValue === 0 || lowValue === 0 || isNaN(highValue) || isNaN(lowValue)) {
      errorMsg('Please enter valid numbers for High and Low values');
      return;
    }
    if (highValue === 0 || lowValue === 0) {
      return;
    }

    const difference = highValue - lowValue;
    if (difference <= 0) {
      errorMsg('High value must be greater than Low value');
      return;
    }
    const response = await api.post(API_ENDPOINTS.fibonacciCalculator, {
      high: highValue,
      low: lowValue,
      custom: customValue,
      trend: trendType,
    });


    setResults({
      retracements: response.data.data.retracements,
      extensions: response.data.data.extensions,
    });
  };

  const handleReset = () => {
    setHighValue(0);
    setLowValue(0);
    setCustomValue(0);
    setTrendType('uptrend');
    setResults(null);
  };

  const handleBackToCalculators = () => {
    window.history.back();
  };

  return (
    <div className="fibonacci-calculator">
      <div className="calculator-container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="currency-converter__title">Fibonacci Calculator</h1>
        </div>

        <div className="chart-section">
          <div className="chart-item">
            <h3 className="chart-title">Uptrend Fibonacci Retracement</h3>
            <div className="chart-visual">
              <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker
                    id="arrowhead-up"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#1a1a1a" />
                  </marker>
                </defs>
                <polyline
                  points="50,200 100,120 150,100 200,70 250,50"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead-up)"
                />
                <circle cx="50" cy="200" r="12" fill="#d4a574" />
                <text
                  x="50"
                  y="230"
                  textAnchor="middle"
                  fill="#e0e0e0"
                  fontSize="14"
                  fontWeight="500"
                >
                  Low
                </text>
                <circle cx="150" cy="100" r="12" fill="#d4a574" />
                <text
                  x="150"
                  y="85"
                  textAnchor="middle"
                  fill="#e0e0e0"
                  fontSize="14"
                  fontWeight="500"
                >
                  High
                </text>
                <circle cx="200" cy="70" r="12" fill="#d4a574" />
                <text
                  x="220"
                  y="50"
                  textAnchor="start"
                  fill="#e0e0e0"
                  fontSize="14"
                  fontWeight="500"
                >
                  Custom
                </text>
              </svg>
            </div>
          </div>

          <div className="chart-item">
            <h3 className="chart-title">Downtrend Fibonacci Retracement</h3>
            <div className="chart-visual">
              <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker
                    id="arrowhead-down"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#1a1a1a" />
                  </marker>
                </defs>
                <polyline
                  points="50,50 100,100 150,130 200,170 250,200"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead-down)"
                />
                <circle cx="50" cy="50" r="12" fill="#d4a574" />
                <text
                  x="50"
                  y="35"
                  textAnchor="middle"
                  fill="#e0e0e0"
                  fontSize="14"
                  fontWeight="500"
                >
                  High
                </text>
                <circle cx="150" cy="130" r="12" fill="#d4a574" />
                <text
                  x="150"
                  y="155"
                  textAnchor="middle"
                  fill="#e0e0e0"
                  fontSize="14"
                  fontWeight="500"
                >
                  Low
                </text>
                <circle cx="200" cy="170" r="12" fill="#d4a574" />
                <text
                  x="230"
                  y="175"
                  textAnchor="start"
                  fill="#e0e0e0"
                  fontSize="14"
                  fontWeight="500"
                >
                  Custom
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="calculator-card">
          <h2 className="section-title">Values</h2>

          <div className="form-group">
            <label className="form-label">High Value:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={highValue || ''}
                onChange={(e) => setHighValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter high value"
                step="0.0001"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Low Value:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={lowValue || ''}
                onChange={(e) => setLowValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter low value"
                step="0.0001"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Value:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={customValue || ''}
                onChange={(e) => setCustomValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter custom value"
                step="0.0001"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Trend Type:</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="uptrend"
                  name="trendType"
                  value="uptrend"
                  checked={trendType === 'uptrend'}
                  onChange={(e) => handleRadioChange(e.target.value as 'uptrend' | 'downtrend')}
                />
                <label htmlFor="uptrend">Uptrend</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="downtrend"
                  name="trendType"
                  value="downtrend"
                  checked={trendType === 'downtrend'}
                  onChange={(e) => handleRadioChange(e.target.value as 'uptrend' | 'downtrend')}
           
                />
                <label htmlFor="downtrend">Downtrend</label>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-calculate" onClick={calculateFibonacci}>
              Calculate
            </button>
          </div>
        </div>

        {results && (
          <div className="results-section">
            <div className="results-card">
              <h2 className="section-title">Retracements</h2>
              <div className="results-grid">
                {results.retracements.map((level) => (
                  <div key={level.label} className="result-item">
                    <span className="result-label">{level.level}</span>
                    <span className="result-value">
                      {results.retracements[level.value]?.toFixed(3) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-card">
              <h2 className="section-title">Extensions</h2>
              <div className="results-grid">
                {results.extensions.map((level) => (
                  <div key={level.label} className="result-item">
                    <span className="result-label">{level.level}</span>
                    <span className="result-value">
                      {results.extensions[level.value]?.toFixed(3) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="results-card">
              <h2 className="section-title">Custom Level</h2>
              <div className="results-grid">
                {customValue > 0 && (
                  <>
                    <div className="result-item">
                      <span className="result-label">Custom %</span>
                      <span className="result-value">{customValue}%</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Price Level</span>
                      <span className="result-value">
                        {trendType === 'uptrend'
                          ? (highValue - (highValue - lowValue) * (customValue / 100)).toFixed(3)
                          : (lowValue + (highValue - lowValue) * (customValue / 100)).toFixed(3)}
                      </span>
                    </div>
                  </>
                )}
                {customValue === 0 && (
                  <div className="result-item">
                    <span className="result-label">No custom value</span>
                    <span className="result-value">-</span>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        )}

        <div className="info-section">
          <h3 className="info-heading">What are Fibonacci retracement levels?</h3>
          <p className="info-text">
            Fibonacci retracement levels are support and resistance levels that are calculated using
            several important points in a price series such as a high and a low. It is based on the
            famous Fibonacci sequence invented by the Italian mathematician Leonardo Pisano Bigollo. A
            fibonacci number is an integer in an infinite mathematical sequence (1,1,2,3,5...) starting
            from the number 1 and then followed by the sum of the previous 2 integers.
          </p>

          <h3 className="info-heading">How to use Fibonacci in Forex trading?</h3>
          <p className="info-text">
            Fibonacci trading levels are often used as important support or resistance levels (or turning
            points) of a price. This is because numbers in the sequence are frequently found in nature,
            which many traders believe in their relevance in the financial markets as well. In trading,
            the Fibonacci levels are represented by the following retracement levels: 23.6%, 38.2%, 61.8%,
            78.6%, 161.8%, 261.8% (a 50% retracement levels and 100% are also often used although they are
            not official fibonacci levels).
          </p>
          <p className="info-text">
            For example a EURUSD price of 1.3200 can retrace by 23.6% to 1.0084 which can be used as a
            support to buy at. Consequently, these levels can be also used as a stop loss or take profit
            levels.
          </p>

          <h3 className="info-heading">Does Fibonacci work in trading?</h3>
          <p className="info-text">
            Fibonacci is another tool in your trading which can be applied to price action alongside other
            indicators and technical analysis techniques (such as moving averages). They can help you build
            your trading plan and have an easy-to-follow trading style since they can be mathematically
            calculated without any human interpretation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FibonacciCalculator;
