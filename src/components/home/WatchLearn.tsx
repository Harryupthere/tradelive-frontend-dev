import { Play, TrendingUp, BarChart3, LineChart } from 'lucide-react';
import './WatchLearn.scss';

const WatchLearnSection = () => {
  return (
    <div className="watch-learn-section">
      <div className="watch-learn-section__container">
        <div className="watch-learn-section__content">
          <div className="watch-learn-section__badge">
            <Play className="watch-learn-section__badge-icon" />
            <span>Watch & Learn</span>
          </div>

          <h2 className="watch-learn-section__title">
            Learn My Trading Style — Real Market Education.
          </h2>

          <p className="watch-learn-section__description">
            Each video breaks down live price action, structure, and strategy — the way professionals think.
            Practical, actionable, and completely transparent.
          </p>

          <button className="watch-learn-section__cta">
            Watch Lessons
            <Play className="watch-learn-section__cta-icon" />
          </button>

          <div className="watch-learn-section__stats">
            <div className="watch-learn-section__stat">
              <div className="watch-learn-section__stat-icon">
                <TrendingUp />
              </div>
              <div className="watch-learn-section__stat-content">
                <span className="watch-learn-section__stat-number">120+</span>
                <span className="watch-learn-section__stat-label">Video Lessons</span>
              </div>
            </div>
            <div className="watch-learn-section__stat">
              <div className="watch-learn-section__stat-icon">
                <BarChart3 />
              </div>
              <div className="watch-learn-section__stat-content">
                <span className="watch-learn-section__stat-number">50+</span>
                <span className="watch-learn-section__stat-label">Live Webinars</span>
              </div>
            </div>
            <div className="watch-learn-section__stat">
              <div className="watch-learn-section__stat-icon">
                <LineChart />
              </div>
              <div className="watch-learn-section__stat-content">
                <span className="watch-learn-section__stat-number">100%</span>
                <span className="watch-learn-section__stat-label">Free Access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="watch-learn-section__visual">
          <div className="watch-learn-section__video-card">
            <img
              src="https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Trading charts and analysis"
              className="watch-learn-section__video-thumbnail"
            />
            <div className="watch-learn-section__play-overlay">
              <div className="watch-learn-section__play-button">
                <Play className="watch-learn-section__play-icon" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchLearnSection;
