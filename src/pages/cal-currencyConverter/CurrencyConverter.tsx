import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, Info, ArrowLeft, ChevronDown, Search } from 'lucide-react';
import './CurrencyConverter.scss';
import { useNavigate } from 'react-router-dom'; 
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
interface Currency {
  code: string;
  name: string;
  flag: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

const CurrencyConverter: React.FC = () => {
    const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState<Currency>({ code: 'EUR', name: 'Euro', flag: '🇪🇺' });
  const [toCurrency, setToCurrency] = useState<Currency>({ code: 'USD', name: 'United States Dollar', flag: '🇺🇸' });
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('1.162');
  const [exchangeRate, setExchangeRate] = useState<number>(1.162);
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const [fromSearchTerm, setFromSearchTerm] = useState<string>('');
  const [toSearchTerm, setToSearchTerm] = useState<string>('');

  const currencies: Currency[] = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', name: 'United States Dollar', flag: '🇺🇸' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' }
  ];

  const eurToUsdRates = [
    { amount: '5 EUR', converted: '5.81 USD' },
    { amount: '10 EUR', converted: '11.62 USD' },
    { amount: '25 EUR', converted: '29.05 USD' },
    { amount: '50 EUR', converted: '58.09 USD' },
    { amount: '100 EUR', converted: '116.19 USD' },
    { amount: '500 EUR', converted: '580.95 USD' },
    { amount: '1,000 EUR', converted: '1,161.90 USD' },
    { amount: '5,000 EUR', converted: '5,809.50 USD' },
    { amount: '10,000 EUR', converted: '11,619.00 USD' },
    { amount: '50,000 EUR', converted: '58,095.00 USD' }
  ];

  const usdToEurRates = [
    { amount: '5 USD', converted: '4.30 EUR' },
    { amount: '10 USD', converted: '8.61 EUR' },
    { amount: '25 USD', converted: '21.52 EUR' },
    { amount: '50 USD', converted: '43.03 EUR' },
    { amount: '100 USD', converted: '86.07 EUR' },
    { amount: '500 USD', converted: '430.33 EUR' },
    { amount: '1,000 USD', converted: '860.66 EUR' },
    { amount: '5,000 USD', converted: '4,303.30 EUR' },
    { amount: '10,000 USD', converted: '8,606.59 EUR' },
    { amount: '50,000 USD', converted: '43,032.96 EUR' }
  ];

  const majorCurrencies = [
    { from: '1 EUR to USD', to: 'US Dollar', flag: '🇺🇸', rate: '1.162' },
    { from: '1 EUR to GBP', to: 'British Pound', flag: '🇬🇧', rate: '0.845' },
    { from: '1 EUR to JPY', to: 'Japanese Yen', flag: '🇯🇵', rate: '174.25' },
    { from: '1 EUR to CHF', to: 'Swiss Franc', flag: '🇨🇭', rate: '0.985' },
    { from: '1 EUR to CAD', to: 'Canadian Dollar', flag: '🇨🇦', rate: '1.578' },
    { from: '1 EUR to AUD', to: 'Australian Dollar', flag: '🇦🇺', rate: '1.745' },
    { from: '1 EUR to NZD', to: 'New Zealand Dollar', flag: '🇳🇿', rate: '1.925' }
  ];

  const majorCurrenciesUsd = [
    { from: '1 USD to EUR', to: 'Euro', flag: '🇪🇺', rate: '0.861' },
    { from: '1 USD to GBP', to: 'British Pound', flag: '🇬🇧', rate: '0.727' },
    { from: '1 USD to JPY', to: 'Japanese Yen', flag: '🇯🇵', rate: '149.95' },
    { from: '1 USD to CHF', to: 'Swiss Franc', flag: '🇨🇭', rate: '0.848' },
    { from: '1 USD to CAD', to: 'Canadian Dollar', flag: '🇨🇦', rate: '1.358' },
    { from: '1 USD to AUD', to: 'Australian Dollar', flag: '🇦🇺', rate: '1.502' },
    { from: '1 USD to NZD', to: 'New Zealand Dollar', flag: '🇳🇿', rate: '1.656' }
  ];

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    
    setExchangeRate(1 / exchangeRate);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const numValue = parseFloat(value) || 0;
    setToAmount((numValue * exchangeRate).toFixed(3));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    const numValue = parseFloat(value) || 0;
    setFromAmount((numValue / exchangeRate).toFixed(3));
  };

  const handleFromCurrencySelect = (currency: Currency) => {
    setFromCurrency(currency);
    setShowFromDropdown(false);
    setFromSearchTerm('');
    // Update exchange rate based on new currency pair
    updateExchangeRate(currency, toCurrency);
  };

  const handleToCurrencySelect = (currency: Currency) => {
    setToCurrency(currency);
    setShowToDropdown(false);
    setToSearchTerm('');
    // Update exchange rate based on new currency pair
    updateExchangeRate(fromCurrency, currency);
  };

  const updateExchangeRate = (from: Currency, to: Currency) => {
    // Mock exchange rates - in real app, this would come from an API
    const rates: { [key: string]: number } = {
      'EUR-USD': 1.162,
      'USD-EUR': 0.861,
      'EUR-GBP': 0.845,
      'GBP-EUR': 1.183,
      'EUR-JPY': 174.25,
      'JPY-EUR': 0.0057,
      'USD-GBP': 0.727,
      'GBP-USD': 1.375,
      'USD-JPY': 149.95,
      'JPY-USD': 0.0067,
    };
    
    const rateKey = `${from.code}-${to.code}`;
    const newRate = rates[rateKey] || 1;
    setExchangeRate(newRate);
    
    // Recalculate amounts
    const numFromAmount = parseFloat(fromAmount) || 0;
    setToAmount((numFromAmount * newRate).toFixed(3));
  };

  const filteredFromCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(fromSearchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(fromSearchTerm.toLowerCase())
  );

  const filteredToCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(toSearchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(toSearchTerm.toLowerCase())
  );

  const handleBackToCalculators = () => {
    navigate(`${base}forum-calculators`);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.currency-input')) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="currency-converter">
      <div className="currency-converter__container">
        <div className="currency-converter__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Calculators
          </button>
          <h1 className="currency-converter__title">Currency Converter</h1>
        </div>

        <div className="converter-main">
          <div className="converter-card">
            <div className="currency-input">
              <div className="currency-select" onClick={() => setShowFromDropdown(!showFromDropdown)}>
                <span className="currency-flag">{fromCurrency.flag}</span>
                <div className="currency-info">
                  <span className="currency-code">{fromCurrency.code}</span>
                  <span className="currency-name">- {fromCurrency.name}</span>
                </div>
                <ChevronDown size={20} className={`dropdown-arrow ${showFromDropdown ? 'open' : ''}`} />
              </div>
              
              {showFromDropdown && (
                <div className="currency-dropdown">
                  <div className="dropdown-search">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      value={fromSearchTerm}
                      onChange={(e) => setFromSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="dropdown-list">
                    {filteredFromCurrencies.map((currency) => (
                      <div
                        key={currency.code}
                        className={`dropdown-item ${currency.code === fromCurrency.code ? 'selected' : ''}`}
                        onClick={() => handleFromCurrencySelect(currency)}
                      >
                        <span className="currency-flag">{currency.flag}</span>
                        <div className="currency-info">
                          <span className="currency-code">{currency.code}</span>
                          <span className="currency-name">- {currency.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="amount-input"
              />
            </div>

            <button className="swap-button" onClick={handleSwapCurrencies}>
              <ArrowLeftRight size={24} />
            </button>

            <div className="currency-input">
              <div className="currency-select" onClick={() => setShowToDropdown(!showToDropdown)}>
                <span className="currency-flag">{toCurrency.flag}</span>
                <div className="currency-info">
                  <span className="currency-code">{toCurrency.code}</span>
                  <span className="currency-name">- {toCurrency.name}</span>
                </div>
                <ChevronDown size={20} className={`dropdown-arrow ${showToDropdown ? 'open' : ''}`} />
              </div>
              
              {showToDropdown && (
                <div className="currency-dropdown">
                  <div className="dropdown-search">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      value={toSearchTerm}
                      onChange={(e) => setToSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="dropdown-list">
                    {filteredToCurrencies.map((currency) => (
                      <div
                        key={currency.code}
                        className={`dropdown-item ${currency.code === toCurrency.code ? 'selected' : ''}`}
                        onClick={() => handleToCurrencySelect(currency)}
                      >
                        <span className="currency-flag">{currency.flag}</span>
                        <div className="currency-info">
                          <span className="currency-code">{currency.code}</span>
                          <span className="currency-name">- {currency.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <input
                type="number"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                className="amount-input"
              />
            </div>
          </div>

          <div className="exchange-info">
            <p className="exchange-rate">
              1 {fromCurrency.code} = {exchangeRate.toFixed(3)} {toCurrency.code}
            </p>
            <p className="exchange-rate">
              1 {toCurrency.code} = {(1/exchangeRate).toFixed(5)} {fromCurrency.code}
            </p>
          </div>
        </div>

        <div className="live-rates-section">
          <h2 className="section-title">
            <TrendingUp size={24} />
            Live Exchange Rates
          </h2>

          <div className="rates-grid">
            <div className="rates-table">
              <h3>Convert EUR to USD</h3>
              <div className="table-header">
                <span>EUR</span>
                <span>USD</span>
              </div>
              {eurToUsdRates.map((rate, index) => (
                <div key={index} className="table-row">
                  <span>{rate.amount}</span>
                  <span>{rate.converted}</span>
                </div>
              ))}
            </div>

            <div className="rates-table">
              <h3>Convert USD to EUR</h3>
              <div className="table-header">
                <span>USD</span>
                <span>EUR</span>
              </div>
              {usdToEurRates.map((rate, index) => (
                <div key={index} className="table-row">
                  <span>{rate.amount}</span>
                  <span>{rate.converted}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="major-currencies">
            <div className="major-currency-section">
              <h3>Convert EUR to Majors</h3>
              {majorCurrencies.map((currency, index) => (
                <div key={index} className="major-currency-row">
                  <span className="currency-pair">{currency.from}</span>
                  <div className="currency-result">
                    <span className="currency-name">{currency.to}</span>
                    <span className="currency-flag">{currency.flag}</span>
                    <span className="currency-rate">{currency.rate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="major-currency-section">
              <h3>Convert USD to Majors</h3>
              {majorCurrenciesUsd.map((currency, index) => (
                <div key={index} className="major-currency-row">
                  <span className="currency-pair">{currency.from}</span>
                  <div className="currency-result">
                    <span className="currency-name">{currency.to}</span>
                    <span className="currency-flag">{currency.flag}</span>
                    <span className="currency-rate">{currency.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>
              <Info size={20} />
              What is Currency Exchange?
            </h3>
            <p>
              A currency exchange is when you convert a currency to another. Usually each country has its own currency and if for example you're buying an item with a different currency or traveling to a country with a different currency than you, this would require an exchange of currencies where you sell your currency and buy another (this would usually require a conversion fee) through a financial institution.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              What is the purpose of a currency converter?
            </h3>
            <p>
              A currency converter is a useful tool to quickly convert between different foreign currencies, for example Euros to US Dollars. Using our calculator will do a live currency conversion with the current exchange rates.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              How to convert a currency to another?
            </h3>
            <p>
              If you are converting Euros to US Dollars, you would need to know the current exchange rate. Take for example the current value of 1.19 - this would mean that 1 Euro is equal to 1.19 US Dollars. This can be applied for any amount by just multiplying the conversion value. Moreover, you can convert it the other way around, ie US Dollars to Euro by inverting the conversion value: 1/1.19=0.84 which means that 1 US Dollar is equal to 0.84 Euro.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <Info size={20} />
              Where can I find forex historical data?
            </h3>
            <p>
              If you're looking for historical forex exchange rates, you can find it in our market section, by clicking the desired symbol and scrolling down to the historical data link:
            </p>
            <div className="historical-links">
              <div className="link-section">
                <h4>EURUSD Analysis</h4>
                <a href="#" className="historical-link">EURUSD Historical Data</a>
                <span className="link-description">- Historical EURUSD data selectable by date range and timeframe.</span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">EURUSD Volatility</a>
                <span className="link-description">- EURUSD real time currency volatility analysis.</span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">EURUSD Correlation</a>
                <span className="link-description">- EURUSD real time currency correlation analysis.</span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">EURUSD Indicators</a>
                <span className="link-description">- EURUSD real time indicators.</span>
              </div>
              <div className="link-item">
                <a href="#" className="historical-link">EURUSD Patterns</a>
                <span className="link-description">- EURUSD real time price patterns.</span>
              </div>
            </div>
            <p>
              Our forex historical data includes open, high, low and close values as well as change in pips and percent. You could even narrow down your search using the included time filter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;