import React from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowLeftRight,
  Target,
  Percent,
  Coins,
  Scale,
  LineChart,
  Activity,
} from "lucide-react";

import "./ForexCalculators.scss";
import { useNavigate } from "react-router-dom";

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
interface CalculatorCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const ForexCalculators: React.FC = () => {
  const navigate = useNavigate();

  const calculators: CalculatorCard[] = [
    {
      id: "currency-converter",
      name: "Currency Converter",
      description:
        "The Currency Converter enables you to swiftly and accurately convert between currencies, including major, minor, and precious metals. It features conversion rates in real-time, allowing you to remain up-to-date on the most recent currency values. Easily convert currencies with our user-friendly Forex calculator online, enabling you to stay ahead in a global market by swiftly assessing exchange rates.",
      icon: <ArrowLeftRight size={32} />,
      route: `${base}currency-converter`,
    },
    {
      id: "position-size",
      name: "Position Size Calculator",
      description:
        "The Position Size Calculator is a crucial forex instrument for effectively controlling risk in your transactions. It determines the necessary position size by considering your currency pair, risk level (expressed as a percentage or monetary value), and the stop loss in pips. Manage risk effectively by determining the optimal position size for your trades with this indispensable trading calculator.",
      icon: <Target size={32} />,
      route: `${base}position-size-calculator`,
    },
    {
      id: "pip-calculator",
      name: "Pip Calculator",
      description:
        "Pips are the basic unit of price movement in the forex market. Precisely measure price movements with our dedicated forex trade calculator. The Pip Calculator simplifies the process of calculating the value of a single pip in your chosen currency pair, helping you understand the potential gains or losses in your trades. This FX calculator helps calculate the pip value for various account types (standard, mini, micro) depending on the selected trade size.",
      icon: <Calculator size={32} />,
      route: `${base}pip-calculator`,
    },
    {
      id: "margin-calculator",
      name: "Margin Calculator",
      description:
        "Free Forex Margin Calculator determine required margin in seconds. Fast, accurate results to plan positions and manage risk.",
      icon: <Scale size={32} />,
      route: `${base}margin-calculator`,
    },
    {
      id: "fibonacci-calculator",
      name: "Fibonacci Calculator",
      description:
        "Fibonacci levels are key in technical analysis for identifying potential support and resistance levels. Our Fibonacci Calculator automates the calculations, making applying Fibonacci analysis to your trading strategies easier. It calculates Fibonacci retracements and Extensions based on 3 values (high, low, and custom value).",
      icon: <TrendingUp size={32} />,
      route: `${base}fibonacci-calculator`,
    },
    {
      id: "pivot-point-calculator",
      name: "Pivot Point Calculator",
      description:
        "Pivot points are crucial for recognizing significant price levels and possible changes in trends. Our Pivot Point Calculator automates pivot point and support/resistance level calculations, will calculate 4 different Pivot Point types, and will calculate 4 levels of resistance and support, saving you time and helping you with your technical analysis.",
      icon: <LineChart size={32} />,
      route: `${base}pivot-point-calculator`,
    },

    {
      id: "risk-of-ruin-calculator",
      name: "Risk/Reward Calculator",
      description:
        "Drawdown refers to the extent of the drop from the highest point to the lowest point in your trading account. Understand your portfolios resilience by calculating drawdowns accurately, an essential feature in our suite of Forex calculator online tools. Our drawdown Calculator helps you assess and understand the extent of potential losses based on historical performance, enabling you to evaluate your risk tolerance and fine-tune your trading strategies.",
      icon: <PieChart size={32} />,
      route: `${base}risk-of-ruin-calculator`,
    },
    {
      id: "compounding-calculator",
      name: "Compounding Calculator",
      description:
        "Leverage can amplify both gains and losses in trading. Optimize your trading strategy by gauging the impact of leverage using our specialized FX calculators. Our Leverage Calculator assists you in determining the most suitable leverage level for your trades by considering your account size, risk tolerance, and trade size, helping you make informed decisions about your risk exposure.",
      icon: <BarChart3 size={32} />,
      route: `${base}compounding-calculator`,
    },
    {
      id: "drawdown-calculator",
      name: "Drawdown Calculator",
      description:
        "Drawdown refers to the extent of the drop from the highest point to the lowest point in your trading account. Understand your portfolios resilience by calculating drawdowns accurately, an essential feature in our suite of Forex calculator online tools. Our drawdown Calculator helps you assess and understand the extent of potential losses based on historical performance, enabling you to evaluate your risk tolerance and fine-tune your trading strategies.",
      icon: <DollarSign size={32} />,
      route: `${base}drawdown-calculator`,
    },
    {
      id: "leverage-calculator",
      name: "Leverage Calculator",
      description:
        "Leverage can amplify both gains and losses in trading. Optimize your trading strategy by gauging the impact of leverage using our specialized FX calculators. Our Leverage Calculator assists you in determining the most suitable leverage level for your trades by considering your account size, risk tolerance, and trade size, helping you make informed decisions about your risk exposure.",
      icon: <Coins size={32} />,
      route: `${base}leverage-calculator`,
    },
    {
      id: "profit-calculator",
      name: "Profit Calculator",
      description:
        "The Profit Calculator provides an estimate of prospective earnings for your trades by considering factors such as entry and exit prices, transaction size, and currency pair. It helps you estimate the potential profit of a trade before you execute it and is a useful tool for setting realistic profit targets and evaluating the potential returns on your investments. Stay on top of your financial goals by accurately calculating profits through our user-friendly calculator trading tool.",
      icon: <Activity size={32} />,
      route: `${base}profit-calculator`,
    },
    {
      id: "rebate-calculator",
      name: "Rebate Calculator",
      description:
        "Rebates can be an additional source of income for traders. Enhance your earnings by calculating rebates effortlessly, a valuable addition to our suite of trading calculators. Our Rebate Calculator helps you estimate the rebates you can earn from your trading volume, depending on your brokers rebate program. This online forex calculator is a valuable tool for optimizing your trading earnings.",
      icon: <Percent size={32} />,
      route: `${base}rebate-calculator`,
    },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="forex-calculators">
      <div className="forex-calculators__container">
        <div className="forex-calculators__header">
          <h1 className="forex-calculators__title">Forex Calculators</h1>

          <div className="forex-calculators__intro">
            <p>
              Forex Calculators are valuable instruments that assist you in
              various trading activities. If you are looking for the best Forex
              calculator, the Myfxbook Forex trade calculator is designed to
              assist both beginners and experienced Forex traders, ensuring that
              you make informed decisions in the dynamic Forex market.
            </p>
            <p>
              Our trading tools are calculated in real-time with current market
              prices to deliver accurate results, allowing traders to evaluate
              risks and monitor profit or loss for each trade.
            </p>
            <p>
              Explore the benefits of our online forex calculator and witness
              the difference in your trading strategy.
            </p>
          </div>
        </div>

        <div className="forex-calculators__grid">
          {calculators.map((calculator) => (
            <div key={calculator.id} className="calculator-card">
              <div className="calculator-card__icon">{calculator.icon}</div>
              <h3 className="calculator-card__name">{calculator.name}</h3>
              <p className="calculator-card__description">
                {calculator.description}
              </p>
              <button
                className="calculator-card__button"
                onClick={() => handleNavigate(calculator.route)}
              >
                View Calculator
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForexCalculators;
