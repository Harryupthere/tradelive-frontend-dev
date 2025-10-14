import { MessageCircle, Users, TrendingUp, MessageSquare, Share2, Heart } from 'lucide-react';
import './Community.scss';

const   CommunitySection = () => {
  const discussionCards = [
    {
      user: 'TraderMike',
      topic: 'SPY Breaking Key Resistance',
      comments: 24,
      likes: 156,
      time: '2h ago',
      preview: 'Just noticed SPY breaking above 450. What are your thoughts on the next move?'
    },
    {
      user: 'ChartMaster',
      topic: 'Elliott Wave Analysis on NASDAQ',
      comments: 18,
      likes: 89,
      time: '4h ago',
      preview: 'Sharing my complete wave count. Wave 5 might be forming...'
    },
    {
      user: 'DayTrader_Pro',
      topic: 'Best Scalping Setups Today',
      comments: 42,
      likes: 203,
      time: '6h ago',
      preview: 'Found some amazing 5-min chart patterns this morning. Check these out!'
    }
  ];

  return (
    <div className="community-section">
        <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
      <div className="community-section__community-container">
        <div className="community-section__visual">
          <div className="community-section__main-card">
            <div className="community-section__card-header">
              <div className="community-section__header-icon">
                <Users />
              </div>
              <div className="community-section__header-text">
                <h3>Trading Community</h3>
                <p>15,234 Active Traders</p>
              </div>
            </div>

            <div className="community-section__discussions">
              {discussionCards.map((card, index) => (
                <div key={index} className="discussion-card">
                  <div className="discussion-card__header">
                    <div className="discussion-card__avatar">
                      {card.user.charAt(0)}
                    </div>
                    <div className="discussion-card__info">
                      <span className="discussion-card__user">{card.user}</span>
                      <span className="discussion-card__time">{card.time}</span>
                    </div>
                  </div>
                  <h4 className="discussion-card__topic">{card.topic}</h4>
                  <p className="discussion-card__preview">{card.preview}</p>
                  <div className="discussion-card__footer">
                    <div className="discussion-card__stat">
                      <MessageSquare />
                      <span>{card.comments}</span>
                    </div>
                    <div className="discussion-card__stat">
                      <Heart />
                      <span>{card.likes}</span>
                    </div>
                    <div className="discussion-card__stat">
                      <Share2 />
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="community-section__feature-badge community-section__feature-badge--1">
            <TrendingUp className="feature-badge-icon" />
            <span>Live Market Debates</span>
          </div>
          <div className="community-section__feature-badge community-section__feature-badge--2">
            <MessageCircle className="feature-badge-icon" />
            <span>24/7 Active Discussions</span>
          </div>
        </div>

        <div className="community-section__content">
          <div className="community-section__badge">
            <MessageCircle className="community-section__badge-icon" />
            <span>Community Hub</span>
          </div>

          <h2 className="community-section__title">
            Discuss. Share. Grow Together.
          </h2>

          <p className="community-section__description">
            Think Reddit, but built for traders.
            Debate ideas, share charts, and connect with others who actually trade live.
          </p>

          <button className="community-section__cta">
            Join The Discussion
            <MessageCircle className="community-section__cta-icon" />
          </button>

          <div className="community-section__features">
            <div className="community-section__feature">
              <div className="community-section__feature-icon">
                <MessageSquare />
              </div>
              <div className="community-section__feature-content">
                <h4>Real Trader Discussions</h4>
                <p>Connect with active traders sharing real market insights</p>
              </div>
            </div>
            <div className="community-section__feature">
              <div className="community-section__feature-icon">
                <Share2 />
              </div>
              <div className="community-section__feature-content">
                <h4>Share Your Analysis</h4>
                <p>Post charts, strategies, and get feedback from the community</p>
              </div>
            </div>
            <div className="community-section__feature">
              <div className="community-section__feature-icon">
                <Users />
              </div>
              <div className="community-section__feature-content">
                <h4>Learn From Others</h4>
                <p>Discover new perspectives and trading approaches daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
