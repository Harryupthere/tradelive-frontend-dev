import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Calculator, Info, TrendingUp } from 'lucide-react';
import './CompoundingCalculator.scss';
import { useNavigate } from 'react-router-dom'; 
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
interface CompoundingResults {
  periods: {
    period: number;
    startingBalance: number;
    endingBalance: number;
    totalProfit: number;
    totalGain: number;
  }[];
}

const CompoundingCalculator: React.FC = () => {
          const navigate = useNavigate();
  
  const [startingBalance, setStartingBalance] = useState<string>('');
  const [periods, setPeriods] = useState<string>('');
  const [gainPerPeriod, setGainPerPeriod] = useState<string>('');
  const [results, setResults] = useState<CompoundingResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateCompounding = () => {
    const startBalance = parseFloat(startingBalance);
    const numPeriods = parseInt(periods);
    const gainPercent = parseFloat(gainPerPeriod);

    if (isNaN(startBalance) || isNaN(numPeriods) || isNaN(gainPercent)) {
      alert('Please enter valid numbers for all fields');
      return;
    }

    if (startBalance <= 0) {
      alert('Starting balance must be greater than 0');
      return;
    }

    if (numPeriods <= 0) {
      alert('Number of periods must be greater than 0');
      return;
    }

    if (gainPercent < -100) {
      alert('Gain per period cannot be less than -100%');
      return;
    }

    const gainDecimal = gainPercent / 100;
    const periodsData = [];

    let currentBalance = startBalance;

    for (let i = 1; i <= numPeriods; i++) {
      const startingBalanceForPeriod = currentBalance;
      const endingBalance = currentBalance * (1 + gainDecimal);
      const profit = endingBalance - startingBalanceForPeriod;
      const totalProfit = endingBalance - startBalance;
      const totalGainPercent = ((endingBalance - startBalance) / startBalance) * 100;

      periodsData.push({
        period: i,
        startingBalance: startingBalanceForPeriod,
        endingBalance: endingBalance,
        totalProfit: totalProfit,
        totalGain: totalGainPercent,
      });

      currentBalance = endingBalance;
    }

    const compoundingResults: CompoundingResults = {
      periods: periodsData,
    };

    setResults(compoundingResults);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setStartingBalance('');
    setPeriods('');
    setGainPerPeriod('');
    setResults(null);
    setShowResults(false);
  };

      const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="compounding-calculator">
      <div className="compounding-calculator__container">
        <div className="compounding-calculator__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="compounding-calculator__title">Compounding Calculator</h1>
        </div>

        <div className="calculator-main">
          <div className="calculator-card">
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
                <button className="calculate-button" onClick={calculateCompounding}>
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
                    <div className="header-cell">Total Gain</div>
                  </div>

                  <div className="table-body">
                    {results.periods.map((period) => (
                      <div key={period.period} className="table-row">
                        <div className="table-cell period-cell">{period.period}</div>
                        <div className="table-cell">{formatCurrency(period.startingBalance)}</div>
                        <div className="table-cell ending-balance">{formatCurrency(period.endingBalance)}</div>
                        <div className="table-cell profit-cell">{formatCurrency(period.totalProfit)}</div>
                        <div className="table-cell gain-cell">{formatPercentage(period.totalGain)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-text">
                  <p>
                    To calculate the profit earned over the predefined number of periods, use the calculator above.
                  </p>
                  <p>
                    With a simple input of the starting balance, the number of periods you're compounding the starting balance and the percentage gain per each period. You will get the results in a detailed table showing the progress of the investment per each period.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is compounding?
            </h3>
            <p>
              Compounding is the action of reinvesting the profits back into the investment in order to increase profits even further, or in other words, getting interest on interest. If you're not reinvesting profits, your investments growth will be linear; when compounding profits, since you will be profiting on the initial investment and also the re-invested capital, growth will become exponential.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to calculate compound interest?
            </h3>
            <p>
              You calculate compounded interest using the compounding period profit which can be daily, monthly or annual, and contributing it the number of periods you're interested in.
            </p>
            <p>
              For example, an annual interest rate of 10% compounded for period of time of 2 years with an initial investment of $100 would result in $10 profit for the first year (out of $100) and $11 profit for the second year (out of $110) for a total profit of $21. If you compare this with a non-compounding investment, it would result in only $120 since you would get a fixed $10 profit per each year.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What is the compounding interest formula?
            </h3>
            <div className="formula-section">
              <div className="formula">
                FV = P (1 + r/n)^(n*t)
              </div>
              <div className="formula-explanation">
                <p><strong>FV</strong> = Future Value of your investment</p>
                <p><strong>P</strong> = Principal or Initial deposit</p>
                <p><strong>r</strong> = Interest Rate</p>
                <p><strong>n</strong> = the number of times the investment is compounded in a period</p>
                <p><strong>t</strong> = number of periods</p>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              Why Compounding Interest is important?
            </h3>
            <p>
              You have a profitable investment? Compounding the profits is the way to go! When your investment is profitable, compounding interest will have a huge impact long term on it.
            </p>
            <p>
              Albert Einstein once said that compounding is "the most powerful force in the universe" and he was right! The interest you earn on your investment can double and triple your return, even if you have a daily or monthly contribution to your investment.
            </p>
            <p>
              You might not even know it but if you have a savings account, it is most likely that the interest is compounded at your bank or financial institution.
            </p>
            <p>
              In the stock market, an account can compound through the reinvestment of dividends while in the forex market, you can reinvest your profits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundingCalculator;