import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import './PipCalculator.scss';
import { Info, Search } from "lucide-react";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";

interface CurrencyPair {
  pair: string;
  price: number;
}

interface PipResult {
  pair: string;
  price: number;
  pipSize: number;
  standardLot: number;
  miniLot: number;
  microLot: number;
  pipValueForTradeLots: number;
  valueForPips: number;
  units: {
    standard: number;
    mini: number;
    micro: number;
  };
  quoteToAccountRate: number;
}

interface ApiResponse {
  accountCurrency: string;
  tradeSizeLots: number;
  pips: number;
  generatedAt: string;
  rows: PipResult[];
}

const PipCalculator: React.FC = () => {
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [tradeSize, setTradeSize] = useState<string>('1');
  const [pips, setPips] = useState<string>('1');
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PipResult[]>([]);

  const currencies = ['USD', 'AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'JPY', 'NZD'];


  const currencyPairs: CurrencyPair[] = [
    { pair: 'AUD/CAD', price: 0.91311 },
    { pair: 'AUD/CHF', price: 0.52252 },
    { pair: 'AUD/JPY', price: 99.102 },
    { pair: 'AUD/NZD', price: 1.137 },
    { pair: 'AUD/SGD', price: 0.84614 },
    { pair: 'AUD/USD', price: 0.65272 },
    { pair: 'CAD/CHF', price: 0.57223 },
    { pair: 'CAD/JPY', price: 108.524 },
    { pair: 'CHF/JPY', price: 189.640 },
    { pair: 'CHF/SGD', price: 1.619 },
    { pair: 'EUR/AUD', price: 1.781 },
    { pair: 'EUR/CAD', price: 1.626 },
    { pair: 'EUR/CHF', price: 0.93065 },
    { pair: 'EUR/CZK', price: 24.309 },
    { pair: 'EUR/GBP', price: 0.86994 },
    { pair: 'EUR/HUF', price: 391.527 },
    { pair: 'EUR/JPY', price: 176.490 },
    { pair: 'EUR/MXN', price: 21.460 },
    { pair: 'EUR/NOK', price: 11.716 },
    { pair: 'EUR/NZD', price: 2.025 },
    { pair: 'EUR/PLN', price: 4.260 },
    { pair: 'EUR/SEK', price: 11.034 },
    { pair: 'EUR/SGD', price: 1.458 },
    { pair: 'EUR/USD', price: 1.162 },
    { pair: 'GBP/AUD', price: 2.047 },
    { pair: 'GBP/CAD', price: 1.869 },
    { pair: 'GBP/CHF', price: 1.070 },
    { pair: 'GBP/JPY', price: 202.875 },
    { pair: 'GBP/NZD', price: 2.327 },
    { pair: 'GBP/USD', price: 1.336 },
    { pair: 'NZD/CAD', price: 0.803 },
    { pair: 'NZD/CHF', price: 0.460 },
    { pair: 'NZD/JPY', price: 87.115 },
    { pair: 'NZD/USD', price: 0.574 },
    { pair: 'USD/CAD', price: 1.399 },
    { pair: 'USD/CHF', price: 0.801 },
    { pair: 'USD/CZK', price: 20.925 },
    { pair: 'USD/JPY', price: 151.887 },
    { pair: 'USD/MXN', price: 18.469 },
    { pair: 'USD/NOK', price: 10.082 },
    { pair: 'USD/PLN', price: 3.666 },
    { pair: 'USD/SEK', price: 9.494 },
    { pair: 'USD/SGD', price: 1.255 },
];

  const calculatePipValue = (pair: string, accountCurr: string, lots: number): number => {
    const pairData = currencyPairs.find(p => p.pair === pair);
    if (!pairData) return 0;

    const quoteCurrency = pair.substring(3, 6);
    const baseCurrency = pair.substring(0, 3);

    let pipValue = 0;

    if (quoteCurrency === 'JPY') {
      pipValue = (0.01 / pairData.price) * 100000 * lots;
    } else {
      pipValue = (0.0001 / pairData.price) * 100000 * lots;
    }

    if (quoteCurrency !== accountCurr) {
      const conversionPair = currencyPairs.find(p =>
        p.pair === `${quoteCurrency}${accountCurr}` || p.pair === `${accountCurr}${quoteCurrency}`
      );

      if (conversionPair) {
        if (conversionPair.pair.startsWith(quoteCurrency)) {
          pipValue *= conversionPair.price;
        } else {
          pipValue /= conversionPair.price;
        }
      }
    }

    return pipValue;
  };

  const fetchPipCalculations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(API_ENDPOINTS.pipcalculator, {
        accountCurrency,
        tradeSizeLots: parseFloat(tradeSize) || 0,
        pips: parseFloat(pips) || 0
      });

      const data: ApiResponse = response.data.data;
      setResults(data.rows);
    } catch (err: any) {
      console.error('Failed to fetch pip calculations:', err);
      setError(err?.response?.data?.message || 'Failed to calculate pip values');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAccountCurrency('USD');
    setTradeSize('1');
    setPips('1');
    setSelectedPair(null);
  };

  const handleCalculate = () => {
    fetchPipCalculations();
  };

  const handleRowClick = (pair: string) => {
    setSelectedPair(pair);
  };

  const handleBackToAll = () => {
    setSelectedPair(null);
  };

  const handleBackToCalculators = () => {
    window.history.back();
  };

  const getSelectedPairDetails = () => {
    if (!selectedPair) return null;

    const result = results.find(r => r.pair === selectedPair);
    if (!result) return null;

    const tradeSizeNum = parseFloat(tradeSize) || 1;
    const pipsNum = parseFloat(pips) || 1;

    const standardLotValue = calculatePipValue(selectedPair, accountCurrency, 1) * pipsNum;
    const miniLotValue = standardLotValue / 10;
    const microLotValue = standardLotValue / 100;
    const pipValueTotal = calculatePipValue(selectedPair, accountCurrency, tradeSizeNum) * pipsNum;

    const quoteCurrency = selectedPair.substring(3, 6);
    const pipSize = quoteCurrency === 'JPY' ? '0.01' : '0.0001';
    const standardLotUnits = 100000;
    const miniLotUnits = 10000;
    const microLotUnits = 1000;

    return {
      standardLot: standardLotValue,
      miniLot: miniLotValue,
      microLot: microLotValue,
      pipValue: pipValueTotal,
      pipSize: pipSize,
      price: result.price,
      standardLotUnits,
      miniLotUnits,
      microLotUnits
    };
  };

  if (selectedPair) {
    const details = getSelectedPairDetails();
    if (!details) return null;

    return (
      <div className="pip-calculator">
        <div className="pip-calculator__container">
          <div className="pip-calculator__header">
            <button className="back-button" onClick={handleBackToCalculators}>
              <ArrowLeft size={20} />
              Back to Calculators
            </button>
            <h1 className="pip-calculator__title">{selectedPair} Pip Calculator</h1>
          </div>

          <div className="pip-calculator__card">
            <h2 className="section-title">Values</h2>

            <div className="form-group">
              <label className="form-label">Currency Pair:</label>
              <div className="input-wrapper">
                <select className="form-select" value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
                  {currencyPairs.map((pair) => (
                    <option key={pair.pair} value={pair.pair}>
                      {pair.pair}
                    </option>
                  ))}
                </select>
                <button className="view-all-button" onClick={handleBackToAll}>
                  View All
                </button>
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
              <label className="form-label">Trade Size (Lots):</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  className="form-input"
                  value={tradeSize}
                  onChange={(e) => setTradeSize(e.target.value)}
                  placeholder="Enter trade size"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pips:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  className="form-input"
                  value={pips}
                  onChange={(e) => setPips(e.target.value)}
                  placeholder="Enter pips"
                  step="1"
                />
              </div>
            </div>

            <div className="button-group">
              <button className="btn btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-calculate" onClick={handleCalculate}>
                Calculate
              </button>
            </div>
          </div>

          <div className="pip-calculator__results-detail">
            <div className="result-detail-item">
              <div className="result-detail-label">
                Pip value
                <span className="result-detail-sublabel">{tradeSize} Lots, {pips} Pips</span>
              </div>
              <div className="result-detail-value">${details.pipValue.toFixed(5)}</div>
            </div>

            <div className="result-detail-item">
              <div className="result-detail-label">
                Standard Lot
                <span className="result-detail-sublabel">{pips} Pips</span>
              </div>
              <div className="result-detail-value">${details.standardLot.toFixed(5)}</div>
            </div>

            <div className="result-detail-item">
              <div className="result-detail-label">
                Mini Lot
                <span className="result-detail-sublabel">{pips} Pips</span>
              </div>
              <div className="result-detail-value">${details.miniLot.toFixed(5)}</div>
            </div>

            <div className="result-detail-item">
              <div className="result-detail-label">
                Micro Lot
                <span className="result-detail-sublabel">{pips} Pips</span>
              </div>
              <div className="result-detail-value">${details.microLot.toFixed(5)}</div>
            </div>
          </div>

          <div className="pip-calculator__info">
            <h3 className="info-title">{selectedPair} Pip value</h3>
            <p className="info-text">
              The pip value of 1 standard lot, or {details.standardLotUnits.toLocaleString()} units of {selectedPair} is ${details.standardLot.toFixed(5)}
            </p>
            <p className="info-text">
              The pip value of 1 mini lot, or {details.miniLotUnits.toLocaleString()} units of {selectedPair} is ${details.miniLot.toFixed(5)}
            </p>
            <p className="info-text">
              The pip value of 1 micro lot, or {details.microLotUnits.toLocaleString()} units of {selectedPair} is ${details.microLotValue.toFixed(5)}
            </p>
            <p className="info-text">
              The pip size of {selectedPair} is {details.pipSize}, so with the current {selectedPair} price of {details.price}, the digits {Math.floor(details.price * (selectedPair.includes('JPY') ? 100 : 10000) % 100)} represents {Math.floor(details.price * (selectedPair.includes('JPY') ? 100 : 10000) % 100)} pips.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pip-calculator">
      <div className="pip-calculator__container">
        <div className="pip-calculator__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="pip-calculator__title">Pip Calculator</h1>
        </div>

        <div className="pip-calculator__card">
          <h2 className="section-title">Values</h2>

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
            <label className="form-label">Trade Size (Lots):</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={tradeSize}
                onChange={(e) => setTradeSize(e.target.value)}
                placeholder="Enter trade size"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pips:</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={pips}
                onChange={(e) => setPips(e.target.value)}
                placeholder="Enter pips"
                step="1"
              />
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-calculate" onClick={handleCalculate}>
              Calculate
            </button>
          </div>
        </div>

        <div className="pip-calculator__results">
          <h2 className="section-title">Results</h2>

          <div className="results-table">
            <div className="results-table__header">
              <div className="results-table__cell">Currency</div>
              <div className="results-table__cell">Standard Lot</div>
              <div className="results-table__cell">Mini Lot</div>
              <div className="results-table__cell">Micro Lot</div>
              <div className="results-table__cell">Price</div>
              <div className="results-table__cell">Pip value</div>
            </div>

            {loading ? (
              <div className="results-table__loading">Calculating...</div>
            ) : error ? (
              <div className="results-table__error">{error}</div>
            ) : (
              <div className="results-table__body">
                {results.map((result) => (
                  <div
                    key={result.pair}
                    className="results-table__row"
                    onClick={() => handleRowClick(result.pair)}
                  >
                    <div className="results-table__cell currency-pair">{result.pair}</div>
                    <div className="results-table__cell">${result.standardLot.toFixed(5)}</div>
                    <div className="results-table__cell">${result.miniLot.toFixed(5)}</div>
                    <div className="results-table__cell">${result.microLot.toFixed(5)}</div>
                    <div className="results-table__cell">{result.price.toFixed(5)}</div>
                    <div className="results-table__cell pip-value">
                      ${result.valueForPips.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is pip value?
            </h3>
            <p>
              For example, with a EURUSD price of 1.23456, the digit '5' represents the pip location while the digit '6' represents a partial pip. So, movement of the price by 1 pip would mean 1.23456+0.0001=1.23466.
              <br/><br/>
              If the price would move down to 1.23443, this would represent 1.23456-1.23443=0.00013, a 1.3 pips change.
              <br/><br/>
              The same calculation works with currency pairs where pips are represented by the 2nd decimal.
              <br/><br/>
              The pip value in Monetary value is crucial for Forex Traders as this helps to analyze and understand an account's growth (or loss) in an easy format as well as calculate stop loss and take profit targets. For example, if you set a stop loss of 10 pips for your trade, this could mean $100 or $1000 loss, depending on the lot size you are trading.
              <br/><br/>
              Keep in mind that the value of pip will always differ for the different currency pairs, depending on the quote currency. For example, when trading EURUSD the pip value will be displayed in USD while trading EURGBP it will be in GBP.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to use the pip calculator?
            </h3>
            <p>
              Account currency: your account deposit currency, can be AUD, CAD, CHF, EUR, GBP, JPY, NZD or USD.
              <br/><br/>
              Trade size: the trade size you are trading in lots or units, where 1 lot=100,000 units.
              <br/><br/>
              Once you select your account currency and the trade size, the calculator will calculate the pip value with Standard, Mini and Micro lots with the current market rates.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to calculate the value of a pip?
            </h3>
            <p>
              Depending on your account base currency, you would need to convert the pip value accordingly.
              <br/><br/>
              Pip Value = (1 pip / Quote Currency Exchange Rate to Account Currency) * Lot size in units
              <br/><br/>
              For example, the pip value of EURUSD is $10 per pip with a standard lot size and a USD account:
              <br/>
              Pip Value = (0.0001 / 1)*100000 = $10.
              <br/><br/>
              However, if your account is denominated in EUR, you would need to divide the $10 by the EURUSD exchange rate which would result in a pip value of 8.92 EUR:
              <br/>
              (for example, EURUSD=1.1200)
              <br/>
              Pip Value = (0.0001 / [1.1200])*100000 = EUR 8.92.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipCalculator;
