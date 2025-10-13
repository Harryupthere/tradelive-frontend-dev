import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import './PipCalculator.scss';

interface CurrencyPair {
  pair: string;
  price: number;
}

interface PipResult {
  pair: string;
  standardLot: string;
  miniLot: string;
  microLot: string;
  price: number;
  pipValue: number;
}

const PipCalculator: React.FC = () => {
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [tradeSize, setTradeSize] = useState<string>('1');
  const [pips, setPips] = useState<string>('1');
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  const currencies = ['USD', 'AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'JPY', 'NZD'];

  const currencyPairs: CurrencyPair[] = [
    { pair: 'AUDCAD', price: 0.91311 },
    { pair: 'AUDCHF', price: 0.52252 },
    { pair: 'AUDJPY', price: 99.102 },
    { pair: 'AUDNZD', price: 1.137 },
    { pair: 'AUDSGD', price: 0.84614 },
    { pair: 'AUDUSD', price: 0.65272 },
    { pair: 'CADCHF', price: 0.57223 },
    { pair: 'CADJPY', price: 108.524 },
    { pair: 'CHFJPY', price: 189.640 },
    { pair: 'CHFSGD', price: 1.619 },
    { pair: 'EURAUD', price: 1.781 },
    { pair: 'EURCAD', price: 1.626 },
    { pair: 'EURCHF', price: 0.93065 },
    { pair: 'EURCZK', price: 24.309 },
    { pair: 'EURGBP', price: 0.86994 },
    { pair: 'EURHUF', price: 391.527 },
    { pair: 'EURJPY', price: 176.490 },
    { pair: 'EURMXN', price: 21.460 },
    { pair: 'EURNOK', price: 11.716 },
    { pair: 'EURNZD', price: 2.025 },
    { pair: 'EURPLN', price: 4.260 },
    { pair: 'EURSEK', price: 11.034 },
    { pair: 'EURSGD', price: 1.458 },
    { pair: 'EURUSD', price: 1.162 },
    { pair: 'GBPAUD', price: 2.047 },
    { pair: 'GBPCAD', price: 1.869 },
    { pair: 'GBPCHF', price: 1.070 },
    { pair: 'GBPJPY', price: 202.875 },
    { pair: 'GBPNZD', price: 2.327 },
    { pair: 'GBPUSD', price: 1.336 },
    { pair: 'NZDCAD', price: 0.803 },
    { pair: 'NZDCHF', price: 0.460 },
    { pair: 'NZDJPY', price: 87.115 },
    { pair: 'NZDUSD', price: 0.574 },
    { pair: 'USDCAD', price: 1.399 },
    { pair: 'USDCHF', price: 0.801 },
    { pair: 'USDCZK', price: 20.925 },
    { pair: 'USDJPY', price: 151.887 },
    { pair: 'USDMXN', price: 18.469 },
    { pair: 'USDNOK', price: 10.082 },
    { pair: 'USDPLN', price: 3.666 },
    { pair: 'USDSEK', price: 9.494 },
    { pair: 'USDSGD', price: 1.255 },
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

  const generateResults = (): PipResult[] => {
    const tradeSizeNum = parseFloat(tradeSize) || 0;

    return currencyPairs.map(pair => {
      const standardLotValue = calculatePipValue(pair.pair, accountCurrency, 1);
      const miniLotValue = standardLotValue / 10;
      const microLotValue = standardLotValue / 100;
      const pipValueForTradeSize = calculatePipValue(pair.pair, accountCurrency, tradeSizeNum);

      return {
        pair: pair.pair,
        standardLot: standardLotValue > 0 ? `$${standardLotValue.toFixed(5)}` : '-',
        miniLot: miniLotValue > 0 ? `$${miniLotValue.toFixed(5)}` : '-',
        microLot: microLotValue > 0 ? `$${microLotValue.toFixed(5)}` : '-',
        price: pair.price,
        pipValue: pipValueForTradeSize
      };
    });
  };

  const results = generateResults();

  const handleReset = () => {
    setAccountCurrency('USD');
    setTradeSize('1');
    setPips('1');
    setSelectedPair(null);
  };

  const handleCalculate = () => {
    // Trigger recalculation by updating state
    setTradeSize(tradeSize);
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

            <div className="results-table__body">
              {results.map((result) => (
                <div
                  key={result.pair}
                  className="results-table__row"
                  onClick={() => handleRowClick(result.pair)}
                >
                  <div className="results-table__cell currency-pair">{result.pair}</div>
                  <div className="results-table__cell">{result.standardLot}</div>
                  <div className="results-table__cell">{result.miniLot}</div>
                  <div className="results-table__cell">{result.microLot}</div>
                  <div className="results-table__cell">{result.price.toFixed(5)}</div>
                  <div className="results-table__cell pip-value">
                    ${result.pipValue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipCalculator;
