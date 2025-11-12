import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Award,
  BookOpen,
  Newspaper,
  TrendingUp,
  Gift,
  Shield,
  Activity,
  Clock,
  Eye,
  Calculator,
} from "lucide-react";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  profile_image: string;
  joining_date: string;
  membership_type: string;
  enrolled_courses: number;
  news_viewed: number;
  activation_coupons: number;
  trade_journal: number;
  last_course_viewed: string;
  last_news_viewed: string;
  last_calculator_used: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    profile_image: "",
    joining_date: "2024-01-15",
    membership_type: "Pro Member",
    enrolled_courses: 12,
    news_viewed: 45,
    activation_coupons: 3,
    trade_journal: 28,
    last_course_viewed: "Advanced Trading Strategies",
    last_news_viewed: "Market Analysis Update",
    last_calculator_used: "Risk Calculator",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statisticsCards = [
    {
      title: "Joining Date",
      value: formatDate(userData.joining_date),
      icon: Calendar,
      color: "blue",
      description: "Member since",
    },
    {
      title: "Membership Type",
      value: userData.membership_type,
      icon: Shield,
      color: "green",
      description: "Current plan",
    },
    {
      title: "Activation Coupons",
      value: userData.activation_coupons.toString(),
      icon: Gift,
      color: "purple",
      description: "Available coupons",
    },
    {
      title: "Enrolled Courses",
      value: userData.enrolled_courses.toString(),
      icon: BookOpen,
      color: "orange",
      description: "Active enrollments",
    },
    {
      title: "News Viewed",
      value: userData.news_viewed.toString(),
      icon: Newspaper,
      color: "cyan",
      description: "Articles read",
    },
    {
      title: "Trade Journal",
      value: userData.trade_journal.toString(),
      icon: TrendingUp,
      color: "pink",
      description: "Journal entries",
    },
  ];

  const recentActions = [
    {
      title: "Last Course Viewed",
      value: userData.last_course_viewed,
      icon: Eye,
      description: "2 hours ago",
    },
    {
      title: "Last News Views",
      value: userData.last_news_viewed,
      icon: Activity,
      description: "5 hours ago",
    },
    {
      title: "Last Calculator Used",
      value: userData.last_calculator_used,
      icon: Calculator,
      description: "1 day ago",
    },
  ];

  const handlepageChange = async (pageName) => {
    navigate(`${base}pageName`);
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard__container">
          <div className="dashboard__loading">
            <div className="dashboard__spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {/* Header Section */}
        <div className="dashboard__header">
          <div className="dashboard__profile-section">
            <div className="dashboard__profile-image">
              {userData.profile_image ? (
                <img src={userData.profile_image} alt={userData.name} />
              ) : (
                <div className="dashboard__profile-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>
            <div className="dashboard__welcome">
              <h1 className="dashboard__welcome-title">
                Welcome {userData.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="dashboard__welcome-message">
          <div className="dashboard__message-content">
            <h2>Welcome to your learning journey!</h2>
            <p>
              Continue exploring our courses, stay updated with the latest
              market news, and track your progress. Your success is our
              priority.
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="dashboard__statistics">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Your Statics</h2>
            <div className="dashboard__section-line"></div>
          </div>
          <div className="dashboard__stats-grid">
            {statisticsCards.map((stat, index) => (
              <div
                key={stat.title}
                className={`dashboard__stat-card dashboard__stat-card--${stat.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="dashboard__stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="dashboard__stat-content">
                  <h3 className="dashboard__stat-title">{stat.title}</h3>
                  <div className="dashboard__stat-value">{stat.value}</div>
                  <p className="dashboard__stat-description">
                    {stat.description}
                  </p>
                </div>
                <div className="dashboard__stat-glow"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Actions */}
        <div className="dashboard__recent-actions">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Recent Actions</h2>
            <div className="dashboard__section-line"></div>
          </div>

          <div className="dashboard__actions-grid">
            {recentActions.map((action, index) => (
              <div
                key={action.title}
                className="dashboard__action-card"
                style={{ animationDelay: `${(index + 6) * 0.1}s` }}
              >
                <div className="dashboard__action-icon">
                  <action.icon size={28} />
                </div>
                <div className="dashboard__action-content">
                  <h3 className="dashboard__action-title">{action.title}</h3>
                  <div className="dashboard__action-value">{action.value}</div>
                  <div className="dashboard__action-time">
                    <Clock size={14} />
                    <span>{action.description}</span>
                  </div>
                </div>
                <div className="dashboard__action-arrow">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard__quick-actions">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Quick Actions</h2>
            <div className="dashboard__section-line"></div>
          </div>

          <div className="dashboard__quick-buttons">
            <button
              className="dashboard__quick-btn dashboard__quick-btn--primary"
              onClick={() => {
                handlepageChange("course");
              }}
            >
              <BookOpen size={20} />
              Browse Courses
            </button>
            <button
              className="dashboard__quick-btn dashboard__quick-btn--secondary"
              onClick={() => {
                handlepageChange("news");
              }}
            >
              <Newspaper size={20} />
              Latest News
            </button>
            <button
              className="dashboard__quick-btn dashboard__quick-btn--accent"
              onClick={() => {
                handlepageChange("trade-journal");
              }}
            >
              <TrendingUp size={20} />
              Trade Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
