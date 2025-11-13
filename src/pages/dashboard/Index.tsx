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
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { getUser } from "../../utils/tokenUtils";
const base = import.meta.env.VITE_BASE;
interface UserData {
  name: string;
  profile_image: string;
  joiningDate: string;
  membership_type: string;
  enrolledCourses: number;
  newsViewed: number;
  couponCount: number;
  journalCount: number;
  lastCourse: {};
  lastNews: {};
  lastCalculator: {};
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: getUser()?.first_name || "",
    profile_image: getUser()?.profile_image || "",
    joiningDate: "",
    membership_type: getUser()?.userType.id == 2 ? "Premium" : "Lite",
    enrolledCourses: 0,
    newsViewed: 0,
    couponCount: 0,
    journalCount: 0,
    lastCourse: {},
    lastNews: {},
    lastCalculator: {},
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

  // returns human readable relative time like '2 hours ago', '3 days ago'
  const timeAgo = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const then = new Date(dateString).getTime();
      if (isNaN(then)) return "-";
      const diff = Date.now() - then; // ms
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
      if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
      if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
      if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
      if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
      if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    } catch (e) {
      return "-";
    }
  };

  useEffect(() => {
    // You can add any side effects or data fetching here if needed
    callDashboardApi();
  }, []);

  const callDashboardApi = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.dashboard);
      if (res.data.status) {
        setUserData({
          name: getUser()?.first_name || "",
          profile_image: getUser()?.profile_image || "",
          joiningDate: res.data.data.data.joiningDate,
          membership_type: getUser()?.userType.id == `1` ? "Premium" : "Lite",
          enrolledCourses: res.data.data.data.enrolledCourses,
          newsViewed: res.data.data.data.newsViewed,
          couponCount: res.data.data.data.couponCount,
          journalCount: res.data.data.data.journalCount,
          lastCourse: res.data.data.data.lastCourse,
          lastNews: res.data.data.data.lastNews,
          lastCalculator: res.data.data.data.lastCalculator,
        });
      }
    } catch (error) {
      console.log("Error fetching dashboard data", error);
    }
  };

  const statisticsCards = [
    {
      title: "Joining Date",
      value: formatDate(userData.joiningDate),
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
      value: userData.couponCount.toString(),
      icon: Gift,
      color: "purple",
      description: "Available coupons",
    },
    {
      title: "Enrolled Courses",
      value: userData.enrolledCourses.toString(),
      icon: BookOpen,
      color: "orange",
      description: "Active enrollments",
    },
    {
      title: "News Viewed",
      value: userData.newsViewed.toString(),
      icon: Newspaper,
      color: "cyan",
      description: "Articles read",
    },
    {
      title: "Trade Journal",
      value: userData.journalCount.toString(),
      icon: TrendingUp,
      color: "pink",
      description: "Journal entries",
    },
  ];

  const recentActions = [
    {
      title: "Last Course Viewed",
      value:
        userData.lastCourse != null
          ? userData.lastCourse?.course?.name
          : "No Course viewed. Please click here to view latest courses",
      icon: Eye,
      description:
        userData.lastCourse != null
          ? timeAgo(userData.lastCourse?.created_at)
          : null,
      pageName: "courses",
    },
    {
      title: "Last News Views",
      value:
        userData.lastNews != null
          ? userData.lastNews?.news?.title
          : "No News viewed. Please click here to view latest news",
      icon: Activity,
      description:
        userData.lastNews != null
          ? timeAgo(userData.lastNews?.created_at)
          : null,
      pageName: "news",
    },
    {
      title: "Last Calculator Used",
      value:
        userData.lastCalculator != null
          ? userData.lastCalculator?.calculator?.name
          : "No Calculator used. Please click here to use latest calculators",
      icon: Calculator,
      description:
        userData.lastCalculator != null
          ? timeAgo(userData.lastCalculator?.created_at)
          : null,
      pageName: "forax-calculators",
    },
  ];

  const handlepageChange = async (pageName) => {
    navigate(`${base}${pageName}`);
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
        {/* Header Section */}
        <div className="dashboard__header">
          <div className="dashboard__profile-section">
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
                    {action.description && (
                      <>
                        <Clock size={14} />
                        <span>{action.description}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="dashboard__action-arrow" onClick={() => {
                  handlepageChange(action.pageName);
                }}>
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
  );
};

export default Dashboard;
