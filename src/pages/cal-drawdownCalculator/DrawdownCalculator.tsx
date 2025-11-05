import React, { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Calculator,
  Info,
  TrendingUp,
} from "lucide-react";
import "./DrawdownCalculator.scss";
import { useNavigate } from "react-router-dom";
import { errorMsg } from "../../utils/customFn";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
interface DrawdownResults {
  periods: {
    period: number;
    startingBalance: number;
    endingBalance: number;
    totalProfit: number;
    totalLoss: number;
  }[];
}

const DrawdownCalculator: React.FC = () => {
  const navigate = useNavigate();

  const [startingBalance, setStartingBalance] = useState<string>("");
  const [periods, setPeriods] = useState<string>("");
  const [gainPerPeriod, setGainPerPeriod] = useState<string>("");
  const [results, setResults] = useState<DrawdownResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateDrawdown =async () => {
    const startBalance = parseFloat(startingBalance);
    const numPeriods = parseInt(periods);
    const gainPercent = parseFloat(gainPerPeriod);

    if (isNaN(startBalance) || isNaN(numPeriods) || isNaN(gainPercent)) {
      errorMsg("Please enter valid numbers for all fields");
      return;
    }

    if (startBalance <= 0) {
      errorMsg("Starting balance must be greater than 0");
      return;
    }

    if (numPeriods <= 0) {
      errorMsg("Number of periods must be greater than 0");
      return;
    }

    if (gainPercent < -100) {
      errorMsg("Gain per period cannot be less than -100%");
      return;
    }

   const response=await api.post(API_ENDPOINTS.drawdownCalculator, {
      startingBalance: startBalance,
      periods: numPeriods,
      gainPerPeriod: gainPercent,
    });

    const DrawdownResults=   response.data.data;

    setResults(DrawdownResults);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setStartingBalance("");
    setPeriods("");
    setGainPerPeriod("");
    setResults(null);
    setShowResults(false);
  };

  const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="drawdown-calculator">
      <div className="drawdown-calculator__container">
        <div className="drawdown-calculator__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="drawdown-calculator__title">Drawdown Calculator</h1>
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
                  <label htmlFor="starting-balance">Starting Balance:</label>
                  <input
                    id="starting-balance"
                    type="number"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    placeholder="Enter starting balance"
                    className="price-input"
                    min="0"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="periods">Periods:</label>
                  <input
                    id="periods"
                    type="number"
                    value={periods}
                    onChange={(e) => setPeriods(e.target.value)}
                    placeholder="Enter number of periods"
                    className="price-input"
                    min="1"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="gain-per-period">Gain per Period (%):</label>
                  <input
                    id="gain-per-period"
                    type="number"
                    value={gainPerPeriod}
                    onChange={(e) => setGainPerPeriod(e.target.value)}
                    placeholder="Enter gain percentage"
                    className="price-input"
                  />
                </div>
              </div>

              <div className="button-group">
                <button className="reset-button" onClick={resetCalculator}>
                  Reset
                </button>
                <button
                  className="calculate-button"
                  onClick={calculateDrawdown}
                >
                  Calculate
                </button>
              </div>
            </div>

            {showResults && results && (
              <div className="results-section">
                <h2 className="section-title">
                  <TrendingUp size={24} />
                  Results
                </h2>

                <div className="results-table">
                  <div className="table-header">
                    <div className="header-cell">Periods</div>
                    <div className="header-cell">Starting Balance</div>
                    <div className="header-cell">Ending Balance</div>
                    <div className="header-cell">Total Profit</div>
                    <div className="header-cell">Total Loss</div>
                  </div>

                  <div className="table-body">
                    {results.periods.map((period) => (
                      <div key={period.period} className="table-row">
                        <div className="table-cell period-cell">
                          {period.period}
                        </div>
                        <div className="table-cell">
                          {formatCurrency(period.startingBalance)}
                        </div>
                        <div className="table-cell ending-balance">
                          {formatCurrency(period.endingBalance)}
                        </div>
                        <div className="table-cell profit-cell">
                          {formatCurrency(period.totalProfit)}
                        </div>
                        <div className="table-cell gain-cell">
                          {formatPercentage(period.totalLoss)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-text">
                  <p>
                    To calculate the profit earned over the predefined number of
                    periods, use the calculator above.
                  </p>
                  <p>
                    With a simple input of the starting balance, the number of
                    periods you're Drawdown the starting balance and the
                    percentage gain per each period. You will get the results in
                    a detailed table showing the progress of the investment per
                    each period.
                  </p>
                </div>
              </div>
            )}
          {/* </div> */}
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              How to use the calculator?
            </h3>
            <p>
              Simply enter the starting balance, the number of consecutive
              losses and the loss per trade (in percent) to calculate the
              expected drawdown.{" "}
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What is Drawdown?
            </h3>
            <p>
              Drawdown is one of the key factors when assessing a trading
              systems risk. You may often hear the phrase "there is no gain
              without risk" however how much of a risk is too much?
            </p>
            <p>
              With a drawdown value you can quickly know how much of a risk the
              investment has taken. Drawdown is the highest drop from peak
              (highest point) to valley (lowest point) in either percentage or
              money value. For example, an investment with a 50% drawdown means
              that it had a realized or non-realized loss of 50% of the
              investments value at some point.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What is the formula for Drawdown?
            </h3>
            <div className="formula-section">
              <div className="formula">drawdown = P - L / P</div>
              <div className="formula-explanation">
                <p>
                  <strong>P</strong> = Peak Balance
                </p>
                <p>
                  <strong>L</strong> = Lowest Balance (valley)
                </p>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to calculate Drawdown?
            </h3>
            <p>
              Lets say your account hits a high balance of $100 and drops down
              to $72. That is a drawdown of (100-72)/100=28%.
            </p>
            <p>
              Every time the account hits a new peak, you look for a new low
              point to calculate the new drawdown. If youre getting a higher
              drawdown value than the previous value, you have a new max
              drawdown.
            </p>
            {/* <p>
              You might not even know it but if you have a savings account, it is most likely that the interest is compounded at your bank or financial institution.
            </p>
            <p>
              In the stock market, an account can compound through the reinvestment of dividends while in the forex market, you can reinvest your profits.
            </p> */}
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              Why Drawdown is important?
            </h3>
            <p>
              When you compare 2 trading systems, a trading system with a higher
              return doesnt necessarily mean a better trading strategy - it
              might simply mean that it took bigger risks than the lower return
              system. If you wish to know which system has a better risk to
              reward ratio, you can simply divide the return by drawdown - the
              higher value will be the trading system that took less risk for
              the same return.
            </p>
            <p>
              For example: trading system (a) with a 50% gain and 10% drawdown
              has a risk ratio of 5 trading system (b) with a 70% gain and a 25%
              drawdown has a risk ratio of 2.8 So even though system (b) made
              higher return, it took almost as twice the risk as system (a).
              Some investors would prefer higher return however some will prefer
              to keep risk to the minimum and so will prefer system (a).
            </p>
            {/* <p>
              You might not even know it but if you have a savings account, it is most likely that the interest is compounded at your bank or financial institution.
            </p>
            <p>
              In the stock market, an account can compound through the reinvestment of dividends while in the forex market, you can reinvest your profits.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawdownCalculator;
