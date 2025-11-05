import React, { useState } from 'react';
import { ArrowLeft, LineChart, Calculator, Info, TrendingUp } from 'lucide-react';
import '../cal-compoundingCalculator/CompoundingCalculator.scss';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { api } from '../../api/Service';

const base = import.meta.env.VITE_BASE;

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

//  "data": {
//         "floor": {
//             "PP": 6,
//             "R1": 7,
//             "R2": 11,
//             "R3": 12,
//             "S1": 2,
//             "S2": 1,
//             "S3": -3
//         },
//         "woodie": {
//             "PP": 5.25,
//             "R1": 5.5,
//             "R2": 10.25,
//             "S1": 0.5,
//             "S2": 0.25
//         },
//         "camarilla": {
//             "R4": 5.75,
//             "R3": 4.375,
//             "R2": 3.91667,
//             "R1": 3.45833,
//             "S1": 2.54167,
//             "S2": 2.08333,
//             "S3": 1.625,
//             "S4": 0.25
//         },
//         "demark": {
//             "PP": 7,
//             "R1": 9,
//             "S1": 4
//         }
//     }

const PivotPointCalculator: React.FC = () => {
  const [highPrice, setHighPrice] = useState<string>('');
  const [lowPrice, setLowPrice] = useState<string>('');
  const [closePrice, setClosePrice] = useState<string>('');
  const [openPrice, setOpenPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PivotPointResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculatePivotPoints = async () => {
    setError(null);

    const high = parseFloat(highPrice);
    const low = parseFloat(lowPrice);
    const close = parseFloat(closePrice);
    const open = parseFloat(openPrice);

    if (isNaN(high) || isNaN(low) || isNaN(close) || isNaN(open)) {
      setError('Please enter valid numbers for all price fields');
      return;
    }

    if (high < low) {
      setError('High value should not be less than low value');
      return;
    }



    try {
      setLoading(true);
      const resp = await api.post(API_ENDPOINTS.pivotCalculato, {
        high,
        low,
        close,
        open,
      });

      const data = resp?.data?.data ?? resp?.data;

      // data expected to be object with keys floor, woodie, camarilla, demark
      const getNum = (obj: any, key: string) => {
        if (!obj) return null;
        const v = obj[key];
        return v === undefined || v === null || Number.isNaN(Number(v)) ? null : Number(v);
      };

      const mapMethod = (methodObj: any): PivotPointResults['floor'] => ({
        r4: getNum(methodObj, 'R4') ?? getNum(methodObj, 'r4') ?? null,
        r3: getNum(methodObj, 'R3') ?? getNum(methodObj, 'r3') ?? null,
        r2: getNum(methodObj, 'R2') ?? getNum(methodObj, 'r2') ?? null,
        r1: getNum(methodObj, 'R1') ?? getNum(methodObj, 'r1') ?? null,
        pivot: getNum(methodObj, 'PP') ?? getNum(methodObj, 'pivot') ?? null,
        s1: getNum(methodObj, 'S1') ?? getNum(methodObj, 's1') ?? null,
        s2: getNum(methodObj, 'S2') ?? getNum(methodObj, 's2') ?? null,
        s3: getNum(methodObj, 'S3') ?? getNum(methodObj, 's3') ?? null,
        s4: getNum(methodObj, 'S4') ?? getNum(methodObj, 's4') ?? null,
      });

      const mapped: PivotPointResults = {
        floor: mapMethod(data.floor),
        woodie: mapMethod(data.woodie),
        camarilla: mapMethod(data.camarilla),
        demark: mapMethod(data.demark),
      };

      setResults(mapped);
      setShowResults(true);
    } catch (err: any) {
      console.error('Pivot points API error', err);
      setError(err?.response?.data?.message || 'Failed to fetch pivot points');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
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
    <div className="compounding-calculator">
      <div className="compounding-calculator__container">
        <div className="compounding-calculator__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="compounding-calculator__title">Pivot Point Calculator</h1>
        </div>
            

        <div className="calculator-main">
            
          {/* <div className="calculator-card"> */}
            {/* <input type="number" value="forex" /> */}
            {/* <div className="values-section"> */}
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
            {/* </div> */}

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
          {/* </div> */}
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