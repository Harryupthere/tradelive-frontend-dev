import React, { useState } from 'react';
import { ArrowLeft, LineChart, Calculator, Info, TrendingUp } from 'lucide-react';
import './PivotPointCalculator.scss';

interface PivotPointResults {
  floor: {
    r4: number;
    r3: number;
    r2: number;
    r1: number;
    pivot: number;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
  };
  woodie: {
    r4: number | null;
    r3: number | null;
    r2: number;
    r1: number;
    pivot: number;
    s1: number;
    s2: number;
    s3: number | null;
    s4: number | null;
  };
  camarilla: {
    r4: number;
    r3: number;
    r2: number;
    r1: number;
    pivot: number | null;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
  };
  demark: {
    r4: number | null;
    r3: number | null;
    r2: number | null;
    r1: number;
    pivot: number | null;
    s1: number;
    s2: number | null;
    s3: number | null;
    s4: number | null;
  };
}

const PivotPointCalculator: React.FC = () => {
  const [highPrice, setHighPrice] = useState<string>('');
  const [lowPrice, setLowPrice] = useState<string>('');
  const [closePrice, setClosePrice] = useState<string>('');
  const [openPrice, setOpenPrice] = useState<string>('');
  const [results, setResults] = useState<PivotPointResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculatePivotPoints = () => {
    const high = parseFloat(highPrice);
    const low = parseFloat(lowPrice);
    const close = parseFloat(closePrice);
    const open = parseFloat(openPrice);

    if (isNaN(high) || isNaN(low) || isNaN(close) || isNaN(open)) {
      alert('Please enter valid numbers for all price fields');
      return;
    }

    // Floor Pivot Points (Standard)
    const floorPivot = (high + low + close) / 3;
    const floorR1 = (2 * floorPivot) - low;
    const floorS1 = (2 * floorPivot) - high;
    const floorR2 = floorPivot + (high - low);
    const floorS2 = floorPivot - (high - low);
    const floorR3 = high + 2 * (floorPivot - low);
    const floorS3 = low - 2 * (high - floorPivot);
    const floorR4 = high + 3 * (floorPivot - low);
    const floorS4 = low - 3 * (high - floorPivot);

    // Woodie's Pivot Points
    const woodiePivot = (high + low + 2 * close) / 4;
    const woodieR1 = (2 * woodiePivot) - low;
    const woodieS1 = (2 * woodiePivot) - high;
    const woodieR2 = woodiePivot + (high - low);
    const woodieS2 = woodiePivot - (high - low);
    const woodieR3 = high + 2 * (woodiePivot - low);
    const woodieS3 = low - 2 * (high - woodiePivot);

    // Camarilla Pivot Points
    const camarillaPivot = (high + low + close) / 3;
    const camarillaR1 = close + ((high - low) * 1.1) / 12;
    const camarillaS1 = close - ((high - low) * 1.1) / 12;
    const camarillaR2 = close + ((high - low) * 1.1) / 6;
    const camarillaS2 = close - ((high - low) * 1.1) / 6;
    const camarillaR3 = close + ((high - low) * 1.1) / 4;
    const camarillaS3 = close - ((high - low) * 1.1) / 4;
    const camarillaR4 = close + ((high - low) * 1.1) / 2;
    const camarillaS4 = close - ((high - low) * 1.1) / 2;

    // DeMark's Pivot Points
    let demarkX: number;
    if (close < open) {
      demarkX = high + 2 * low + close;
    } else if (close > open) {
      demarkX = 2 * high + low + close;
    } else {
      demarkX = high + low + 2 * close;
    }

    const demarkR1 = demarkX / 2 - low;
    const demarkS1 = demarkX / 2 - high;

    const pivotResults: PivotPointResults = {
      floor: {
        r4: floorR4,
        r3: floorR3,
        r2: floorR2,
        r1: floorR1,
        pivot: floorPivot,
        s1: floorS1,
        s2: floorS2,
        s3: floorS3,
        s4: floorS4,
      },
      woodie: {
        r4: null,
        r3: null,
        r2: woodieR2,
        r1: woodieR1,
        pivot: woodiePivot,
        s1: woodieS1,
        s2: woodieS2,
        s3: null,
        s4: null,
      },
      camarilla: {
        r4: camarillaR4,
        r3: camarillaR3,
        r2: camarillaR2,
        r1: camarillaR1,
        pivot: null,
        s1: camarillaS1,
        s2: camarillaS2,
        s3: camarillaS3,
        s4: camarillaS4,
      },
      demark: {
        r4: null,
        r3: null,
        r2: null,
        r1: demarkR1,
        pivot: null,
        s1: demarkS1,
        s2: null,
        s3: null,
        s4: null,
      },
    };

    setResults(pivotResults);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setHighPrice('');
    setLowPrice('');
    setClosePrice('');
    setOpenPrice('');
    setResults(null);
    setShowResults(false);
  };

  const handleBackToCalculators = () => {
    window.history.back();
  };


  const formatValue = (value: number | null): string => {
    if (value === null) return '-';
    return value.toFixed(5);
  };

  return (
    <div className="pivot-point-calculator">
      <div className="pivot-point-calculator__container">
        <div className="pivot-point-calculator__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="pivot-point-calculator__title">Pivot Point Calculator</h1>
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
                  <label htmlFor="high-price">High Price:</label>
                  <input
                    id="high-price"
                    type="number"
                    value={highPrice}
                    onChange={(e) => setHighPrice(e.target.value)}
                    placeholder="Enter high price"
                    className="price-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="low-price">Low Price:</label>
                  <input
                    id="low-price"
                    type="number"
                    value={lowPrice}
                    onChange={(e) => setLowPrice(e.target.value)}
                    placeholder="Enter low price"
                    className="price-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="close-price">Close Price:</label>
                  <input
                    id="close-price"
                    type="number"
                    value={closePrice}
                    onChange={(e) => setClosePrice(e.target.value)}
                    placeholder="Enter close price"
                    className="price-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="open-price">Open Price:</label>
                  <input
                    id="open-price"
                    type="number"
                    value={openPrice}
                    onChange={(e) => setOpenPrice(e.target.value)}
                    placeholder="Enter open price"
                    className="price-input"
                  />
                </div>
              </div>

              <div className="button-group">
                <button className="reset-button" onClick={resetCalculator}>
                  Reset
                </button>
                <button className="calculate-button" onClick={calculatePivotPoints}>
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
                    <div className="level-column">Level</div>
                    <div className="method-column">Floor Pivot Points</div>
                    <div className="method-column">Woodie's Pivot Points</div>
                    <div className="method-column">Camarilla Pivot Points</div>
                    <div className="method-column">DeMark's Pivot Points</div>
                  </div>

                  <div className="table-body">
                    <div className="table-row resistance">
                      <div className="level-cell">4th Resistance</div>
                      <div className="value-cell">{formatValue(results.floor.r4)}</div>
                      <div className="value-cell">{formatValue(results.woodie.r4)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.r4)}</div>
                      <div className="value-cell">{formatValue(results.demark.r4)}</div>
                    </div>

                    <div className="table-row resistance">
                      <div className="level-cell">3rd Resistance</div>
                      <div className="value-cell">{formatValue(results.floor.r3)}</div>
                      <div className="value-cell">{formatValue(results.woodie.r3)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.r3)}</div>
                      <div className="value-cell">{formatValue(results.demark.r3)}</div>
                    </div>

                    <div className="table-row resistance">
                      <div className="level-cell">2nd Resistance</div>
                      <div className="value-cell">{formatValue(results.floor.r2)}</div>
                      <div className="value-cell">{formatValue(results.woodie.r2)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.r2)}</div>
                      <div className="value-cell">{formatValue(results.demark.r2)}</div>
                    </div>

                    <div className="table-row resistance">
                      <div className="level-cell">1st Resistance</div>
                      <div className="value-cell">{formatValue(results.floor.r1)}</div>
                      <div className="value-cell">{formatValue(results.woodie.r1)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.r1)}</div>
                      <div className="value-cell">{formatValue(results.demark.r1)}</div>
                    </div>

                    <div className="table-row pivot">
                      <div className="level-cell">Pivot Point</div>
                      <div className="value-cell pivot-value">{formatValue(results.floor.pivot)}</div>
                      <div className="value-cell pivot-value">{formatValue(results.woodie.pivot)}</div>
                      <div className="value-cell pivot-value">{formatValue(results.camarilla.pivot)}</div>
                      <div className="value-cell pivot-value">{formatValue(results.demark.pivot)}</div>
                    </div>

                    <div className="table-row support">
                      <div className="level-cell">1st Support</div>
                      <div className="value-cell">{formatValue(results.floor.s1)}</div>
                      <div className="value-cell">{formatValue(results.woodie.s1)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.s1)}</div>
                      <div className="value-cell">{formatValue(results.demark.s1)}</div>
                    </div>

                    <div className="table-row support">
                      <div className="level-cell">2nd Support</div>
                      <div className="value-cell">{formatValue(results.floor.s2)}</div>
                      <div className="value-cell">{formatValue(results.woodie.s2)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.s2)}</div>
                      <div className="value-cell">{formatValue(results.demark.s2)}</div>
                    </div>

                    <div className="table-row support">
                      <div className="level-cell">3rd Support</div>
                      <div className="value-cell">{formatValue(results.floor.s3)}</div>
                      <div className="value-cell">{formatValue(results.woodie.s3)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.s3)}</div>
                      <div className="value-cell">{formatValue(results.demark.s3)}</div>
                    </div>

                    <div className="table-row support">
                      <div className="level-cell">4th Support</div>
                      <div className="value-cell">{formatValue(results.floor.s4)}</div>
                      <div className="value-cell">{formatValue(results.woodie.s4)}</div>
                      <div className="value-cell">{formatValue(results.camarilla.s4)}</div>
                      <div className="value-cell">{formatValue(results.demark.s4)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is the pivot point in forex trading?
            </h3>
            <p>
              Pivot Points are a technical analysis indicator used to determine reversal points on all time frames.
              There are multiple variations of Pivot Points such as:
            </p>
            <ul>
              <li>Floor (standard)</li>
              <li>Woodie's</li>
              <li>Camarilla</li>
              <li>DeMark's</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What is (the) pivot point in forex?
            </h3>
            <p>
              Pivot Points in forex are predetermined levels where the market sentiment could potentially change from bullish to bearish or vice versa.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to trade pivot points in forex?
            </h3>
            <p>
              There are many ways to trade pivot points in forex, but simplicity is key. So, the easiest and most common ways to use Pivot Points in forex trading is by utilizing them as support and resistance levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotPointCalculator;