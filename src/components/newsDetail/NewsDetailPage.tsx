import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Users, Award, DollarSign } from "lucide-react";
import "./NewsDetailPage.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface NewsDetails {
  id: number;
  title: string;
  subtitle: string;
  cover_image: string;
content:string;
published_date:string;

}

const mockCourseDetail: NewsDetails = {
  id: 1,
  title: "React Advanced Patterns",
  subtitle:
    "Master React hooks, context, and performance optimization techniques",
  preview_image:
    "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800",
  description: `
    <h2>Overview</h2>
    <p>This comprehensive React course will take you from intermediate to advanced level, covering the most important patterns and techniques used in modern React development.</p>
    
    <p>You'll learn how to build scalable, maintainable React applications using advanced patterns like compound components, render props, and custom hooks. We'll dive deep into React's performance optimization techniques and explore the latest features in React 18.</p>
    
    <h3>What You'll Learn</h3>
    <ul>
      <li>Advanced React Hooks (useCallback, useMemo, useReducer)</li>
      <li>Context API and state management patterns</li>
      <li>Performance optimization techniques</li>
      <li>Custom hooks development</li>
      <li>Component composition patterns</li>
      <li>Testing strategies for React applications</li>
    </ul>
    
    <h3>Prerequisites</h3>
    <p>Basic knowledge of React, JavaScript ES6+, and HTML/CSS is required. You should be comfortable with React components, props, and basic state management.</p>
    
    <h3>Course Structure</h3>
    <p>The course is divided into 8 modules, each building upon the previous one. You'll work on practical projects throughout the course to reinforce your learning and build a portfolio of advanced React applications.</p>
  `,
  meta: {
    educator: "Sarah Johnson",
    type: "Video Course",
    price: "$149",
    duration: "12 weeks",
    students: "2,847",
    level: "Advanced",
  },
  status: "Live",
};

const NewsDetailPage: React.FC = () => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaGFyc2guY2hvdWhhbjAxMEBnbWFpbC5jb20iLCJzdWJfaWQiOiIxIiwidHlwZSI6ImxvZ2luIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTg3NDEyMzksImV4cCI6MTc1ODc0NDgzOX0.c-lp29O2ycNqRrwGub2q2XFADIYYmGC118KiTutGKrQ`;

  const navigate=useNavigate()

  const { id } = useParams<{ id: string }>(); // 👈 get id from URL

  const [news, setNews] = useState();
  const [loading, setLoading] = useState(false);
  const [htmlContent,setHtmlContent]=useState()

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5003/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 add bearer token
          },
        });
        setNews(res.data.data.data);
        const htmls=decodeHtml(res.data.data.data.content)
        setHtmlContent(htmls)
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);



  function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <div className="news-detail">
      {news && (
        <div className="news-detail__container">
          {/* Back Button */}
          <button onClick={()=>navigate(`/news`)} className="news-detail__back-btn">
            <ArrowLeft size={20} />
            Back to News
          </button>

          {/* Header Section */}
          <header className="news-detail__header">
            <h1 className="news-detail__title">{news.title}</h1>
            <p className="news-detail__subtitle">{news.subtitle}</p>
            <p className="news-detail__subtitle">{new Date(news.published_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}</p>

          </header>

          {/* Main Content */}
          <main className="news-detail__main">
            {/* Left Column */}
            <div className="news-detail__content">
              <div className="news-detail__image-wrapper">
                <img
                  src={news.cover_image}
                  alt={news.title}
                  className="news-detail__image"
                />
                {/* <div
                  className={`news-detail__status news-detail__status--${news.status.toLowerCase()}`}
                >
                  {news.status}
                </div> */}
              </div>
              <div className="news-detail__description">
                <div
                  dangerouslySetInnerHTML={{
                    __html: htmlContent,
                  }}
                />
              </div>
            </div>


          </main>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
