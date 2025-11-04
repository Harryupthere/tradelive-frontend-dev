import { Target, Users, Shield, TrendingUp, Zap, Heart, BookOpen, Award } from 'lucide-react';
import './about.scss';
const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us__hero">
        <div className="about-us__container">
          <h2 className='about-us__hero-title-main'>About US</h2>
          <h1 className="about-us__hero-title">
            Trading Knowledge Should Be Free, Honest, and Accessible to Everyone.
          </h1>
          <p className="about-us__hero-subtitle">
            We're not a brokerage. We're not a prop firm. We're a movement — created by traders, for traders.
          </p>
        </div>
      </div>

      <div className="about-us__who-we-are">
        <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
        <div className="about-us__container">
          <div className="about-us__section-header">
            {/* <Users className="section-icon" /> */}
            <h2 className="section-title">Who We Are</h2>
          </div>
          <div className="about-us__content-grid">
            <div className="content-card">
              <p className="content-text">
                <strong>TradeLive24</strong> is a fintech-inspired trading education and community platform built on one simple belief:
              </p>
              <div className="highlight-box">
                Trading knowledge should be free, honest, and accessible to everyone.
              </div>
              <p className="content-text">
                We're not a brokerage. We're not a prop firm. We're a <span className="text-accent">movement</span> — created by traders, for traders — to eliminate misinformation, overpriced "courses," and empty promises.
              </p>
            </div>
            <div className="image-card">
              <div className="placeholder-image">
                <Users size={64} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-us__mission">
     
        <div className="about-us__container">
          <div className="about-us__section-header">
            {/* <Target className="section-icon" /> */}
            <h2 className="section-title">Our Mission</h2>
          </div>
          <p className="mission-intro">To create a space where anyone can:</p>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-card__icon">
                <BookOpen />
              </div>
              <h3 className="mission-card__title">Learn Trading</h3>
              <p className="mission-card__text">
                Through real, structured education focused on price action, market structure, psychology, and risk management.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-card__icon">
                <Users />
              </div>
              <h3 className="mission-card__title">Connect Globally</h3>
              <p className="mission-card__text">
                With like-minded traders around the world, sharing experiences and growing together.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-card__icon">
                <Shield />
              </div>
              <h3 className="mission-card__title">Access Reliable Insights</h3>
              <p className="mission-card__text">
                Without being sold false dreams or manipulated by marketing tactics.
              </p>
            </div>
          </div>
          <div className="mission-statement">
            We focus on <span className="highlight">price action</span>, <span className="highlight">market structure</span>, <span className="highlight">psychology</span>, and <span className="highlight">risk management</span> — the foundations that actually make traders profitable, not the flashy stuff that sells.
          </div>
        </div>
      </div>

      <div className="about-us__different">
            <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
        <div className="about-us__container">
          <div className="about-us__section-header">
            <Zap className="section-icon" />
            <h2 className="section-title">How We're Different</h2>
          </div>
          <div className="different-grid">
            <div className="different-card">
              <div className="different-card__header">
                <div className="different-card__icon">
                  <Heart />
                </div>
                <h3 className="different-card__title">No Profit Motive</h3>
              </div>
              <p className="different-card__text">
                Every dollar collected through the $9.99 annual sustainability fee is used to cover hosting, data feeds, and platform improvements.
              </p>
            </div>
            <div className="different-card">
              <div className="different-card__header">
                <div className="different-card__icon">
                  <Users />
                </div>
                <h3 className="different-card__title">Community-Driven</h3>
              </div>
              <p className="different-card__text">
                Users can discuss strategies, share trade ideas, and grow together — just like a trading-focused version of Reddit.
              </p>
            </div>
            <div className="different-card">
              <div className="different-card__header">
                <div className="different-card__icon">
                  <Shield />
                </div>
                <h3 className="different-card__title">Transparent and Real</h3>
              </div>
              <p className="different-card__text">
                No hype, no marketing tricks. Just practical trading education and real discussions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-us__philosophy">
        <div className="about-us__container">
          <div className="philosophy-card">
            <div className="philosophy-card__icon">
              <Award />
            </div>
            <h2 className="philosophy-card__title">Our Philosophy</h2>
            <div className="philosophy-card__quote">
              "We don't teach shortcuts — we teach structure. We don't sell dreams — we show the process."
            </div>
            <p className="philosophy-card__text">
              TradeLive24 exists to help traders <span className="text-green">Learn. Adapt. React.</span>
            </p>
            <p className="philosophy-card__text">
              Because when traders grow together, the industry changes for the better.
            </p>
            <div className="philosophy-card__cta">
              <button className="cta-button">
                <TrendingUp className="cta-icon" />
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default AboutUs;
