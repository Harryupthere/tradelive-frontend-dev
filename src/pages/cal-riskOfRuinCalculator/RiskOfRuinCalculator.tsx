import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Calculator, Info, TrendingDown } from 'lucide-react';
import './RiskOfRuinCalculator.scss';
import { useNavigate } from 'react-router-dom'; 
import { errorMsg } from '../../utils/customFn';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { api } from '../../api/Service';
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
interface RiskOfRuinResults {
  riskOfDrawdown: number;
  riskOfRuin: number;
}

const RiskOfRuinCalculator: React.FC = () => {
        const navigate = useNavigate();

  const [winRate, setWinRate] = useState<string>('');
  const [averageWin, setAverageWin] = useState<string>('');
  const [averageLoss, setAverageLoss] = useState<string>('');
  const [riskPerTrade, setRiskPerTrade] = useState<string>('');
  const [lossLevel, setLossLevel] = useState<string>('');
  const [numberOfTrades, setNumberOfTrades] = useState<string>('');
  const [results, setResults] = useState<RiskOfRuinResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateRiskOfRuin =async () => {
    const winRateValue = parseFloat(winRate);
    const avgWin = parseFloat(averageWin);
    const avgLoss = parseFloat(averageLoss);
    const riskPerTradeValue = parseFloat(riskPerTrade);
    const lossLevelValue = parseFloat(lossLevel);
    const numTrades = parseFloat(numberOfTrades);

    if (
      isNaN(winRateValue) || 
      isNaN(avgWin) || 
      isNaN(avgLoss) || 
      isNaN(riskPerTradeValue) || 
      isNaN(lossLevelValue) || 
      isNaN(numTrades)
    ) {
      errorMsg('Please enter valid numbers for all fields');
      return;
    }

    if (winRateValue < 0 || winRateValue > 100) {
      errorMsg('Win rate must be between 0 and 100');
      return;
    }

    if (lossLevelValue < 0 || lossLevelValue > 100) {
      errorMsg('Loss level must be between 0 and 100');
      return;
    }

    if (riskPerTradeValue < 0 || riskPerTradeValue > 100) {
      errorMsg('Risk per trade must be between 0 and 100');
      return;
    }

    const response =await api.post(API_ENDPOINTS.riskCalculator, {
      winRate: winRateValue,
      avgWin: avgWin,
     avgLoss: avgLoss,
      riskPerTrade: riskPerTradeValue,
      lossLevel: lossLevelValue,
      numberOfTrades: numTrades,
    });


    setResults(response.data.data.riskOfRuin);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setWinRate('');
    setAverageWin('');
    setAverageLoss('');
    setRiskPerTrade('');
    setLossLevel('');
    setNumberOfTrades('');
    setResults(null);
    setShowResults(false);
  };

    const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="risk-of-ruin-calculator">
      <div className="container">
        <div className="risk-of-ruin-calculator__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="risk-of-ruin-calculator__title">Risk of Ruin Calculator</h1>
        </div>

        <div className="calculator-main">
          {/* <div className="calculator-card"> */}
            <div className="values-section">
              <h2 className="section-title">
                <Calculator size={24} />
                Values
              </h2>
              
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="win-rate">Win Rate (%):</label>
                  <input
                    id="win-rate"
                    type="number"
                    value={winRate}
                    onChange={(e) => setWinRate(e.target.value)}
                    placeholder="Enter win rate percentage"
                    className="price-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="average-win">Average Win:</label>
                  <input
                    id="average-win"
                    type="number"
                    value={averageWin}
                    onChange={(e) => setAverageWin(e.target.value)}
                    placeholder="Enter average win amount"
                    className="price-input"
                    min="0"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="average-loss">Average Loss:</label>
                  <input
                    id="average-loss"
                    type="number"
                    value={averageLoss}
                    onChange={(e) => setAverageLoss(e.target.value)}
                    placeholder="Enter average loss amount"
                    className="price-input"
                    min="0"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="risk-per-trade">Risk per Trade (%):</label>
                  <input
                    id="risk-per-trade"
                    type="number"
                    value={riskPerTrade}
                    onChange={(e) => setRiskPerTrade(e.target.value)}
                    placeholder="Enter risk per trade percentage"
                    className="price-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="loss-level">Loss Level (%):</label>
                  <input
                    id="loss-level"
                    type="number"
                    value={lossLevel}
                    onChange={(e) => setLossLevel(e.target.value)}
                    placeholder="Enter loss level percentage"
                    className="price-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="number-of-trades">Number of Trades:</label>
                  <input
                    id="number-of-trades"
                    type="number"
                    value={numberOfTrades}
                    onChange={(e) => setNumberOfTrades(e.target.value)}
                    placeholder="Enter number of trades"
                    className="price-input"
                    min="1"
                  />
                </div>
              </div>

              <div className="button-group">
                <button className="reset-button" onClick={resetCalculator}>
                  Reset
                </button>
                <button className="calculate-button" onClick={calculateRiskOfRuin}>
                  Calculate
                </button>
              </div>
            </div>

            {showResults && results && (
              <div className="results-section">
                <h2 className="section-title">
                  <TrendingDown size={24} />
                  Results
                </h2>

                <div className="results-grid">
                  <div className="result-card">
                    <div className="result-label">Risk of Drawdown:</div>
                    <div className="result-value drawdown">{formatPercentage(results.riskOfDrawdown)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Risk of Ruin:</div>
                    <div className="result-value ruin">{formatPercentage(results.riskOfRuin)}</div>
                  </div>
                </div>

                <div className="risk-interpretation">
                  <div className="interpretation-card">
                    <AlertTriangle size={20} />
                    <div className="interpretation-content">
                      <h4>Risk Assessment</h4>
                      <p>
                        {results.riskOfRuin < 5 
                          ? "Low risk - Your trading system shows good risk management."
                          : results.riskOfRuin < 20
                          ? "Moderate risk - Consider reducing position sizes or improving win rate."
                          : "High risk - Your current parameters suggest significant risk of capital loss."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {/* </div> */}
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is the Risk of Ruin Calculator?
            </h3>
            <p>
              The risk of ruin calculator is an advanced tool to evaluate a trading system's probability of loss.
            </p>
            <p>
              By inputting the system's metrics, you can calculate the probability to hit a specific drawdown or ruin.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What's the difference between risk of ruin and risk of drawdown?
            </h3>
            <p>
              Risk of ruin is defined as a probability of a specific loss from the original balance, ie if you started with $1000, calculating a risk of ruin of 40% would tell you the probability to lose 40% of your balance or $400. As the equity grows, the risk of ruin decreases.
            </p>
            <p>
              Risk of Drawdown is always the same through the lifetime of your account since your account's peak is always increased once the equity grows (drawdown is the calculation of highest peak-to-valley decrease).
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to calculate risk of ruin?
            </h3>
            <p>Enter the system's metrics:</p>
            <ul>
              <li><strong>Win rate (%)</strong> – how many of the trades end up in profit, in percentage.</li>
              <li><strong>Average win</strong> – average winning trade, in money terms.</li>
              <li><strong>Average loss</strong> – average losing trade, in money terms.</li>
              <li><strong>Risk per trade (%)</strong> – how much of the account you risk per trade, in percentage.</li>
              <li><strong>Loss level (%)</strong> – the drawdown level you want to calculate the risk for.</li>
              <li><strong>Number of trades</strong> – the number of trades in your sample.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskOfRuinCalculator;