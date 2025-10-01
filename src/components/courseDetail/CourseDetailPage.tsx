import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Users, Award, DollarSign } from "lucide-react";
import "./CourseDetailPage.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;


interface CourseDetail {
  id: number;
  title: string;
  subtitle: string;
  preview_image: string;
  enrolledCount: number;
  description: string;

  price: string;
  created_at: string;
  status: "Live" | "Upcoming";
  meta: Record<string, any>; // 👈 any object with unknown keys
}

const mockCourseDetail: CourseDetail = {
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

const CourseDetailPage: React.FC = () => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaGFyc2guY2hvdWhhbjAxMEBnbWFpbC5jb20iLCJzdWJfaWQiOiIxIiwidHlwZSI6ImxvZ2luIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTg3NDEyMzksImV4cCI6MTc1ODc0NDgzOX0.c-lp29O2ycNqRrwGub2q2XFADIYYmGC118KiTutGKrQ`;

  const navigate=useNavigate()

  const { id } = useParams<{ id: string }>(); // 👈 get id from URL

  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 add bearer token
          },
        });
        setCourse(res.data.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollClick = async(e,enrollerd) => {
     e.preventDefault();

  if (enrollerd) {
    navigate(`${base}course/${id}`);
  } else {
    try {
      const res= await axios.post(
        "${apiUrl}enrollments",
        {
          product_id: parseInt(id, 10), // ✅ send product_id in body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ bearer token
          },
        }
      );

      console.log("Enrollment successful:", res.data);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };
}



  function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <div className="course-detail">
      {course && (
        <div className="course-detail__container">
          {/* Back Button */}
          <button onClick={()=>navigate(`${base}`)} className="course-detail__back-btn">
            <ArrowLeft size={20} />
            Back to Courses
          </button>

          {/* Header Section */}
          <header className="course-detail__header">
            <h1 className="course-detail__title">{course.title}</h1>
            <p className="course-detail__subtitle">{course.subtitle}</p>
          </header>

          {/* Main Content */}
          <main className="course-detail__main">
            {/* Left Column */}
            <div className="course-detail__content">
              <div className="course-detail__image-wrapper">
                <img
                  src={course.preview_image}
                  alt={course.title}
                  className="course-detail__image"
                />
                <div
                  className={`course-detail__status course-detail__status--${course.status.toLowerCase()}`}
                >
                  {course.status}
                </div>
              </div>

              <div className="course-detail__description">
                <div
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(course.description),
                  }}
                />
              </div>
            </div>

            {/* Right Column - Meta Box */}
            <aside className="course-detail__sidebar">
              <div className="course-detail__meta-box">
                <div className="course-detail__meta-content">
                  {Object.entries(course.meta).map(([key, value]) => (
                    <div key={key} className="course-detail__meta-item">
                      <div className="course-detail__meta-info">
                        <span className="course-detail__meta-label">{key}</span>
                        <span className="course-detail__meta-value">
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* <div className="course-detail__meta-item">
                  <Users className="course-detail__meta-icon" size={20} />
                  <div className="course-detail__meta-info">
                    <span className="course-detail__meta-label">Instructor</span>
                    <span className="course-detail__meta-value">{mockCourseDetail.meta.educator}</span>
                  </div>
                </div>

                <div className="course-detail__meta-item">
                  <Award className="course-detail__meta-icon" size={20} />
                  <div className="course-detail__meta-info">
                    <span className="course-detail__meta-label">Level</span>
                    <span className="course-detail__meta-value">{mockCourseDetail.meta.level}</span>
                  </div>
                </div>

                <div className="course-detail__meta-item">
                  <Clock className="course-detail__meta-icon" size={20} />
                  <div className="course-detail__meta-info">
                    <span className="course-detail__meta-label">Duration</span>
                    <span className="course-detail__meta-value">{mockCourseDetail.meta.duration}</span>
                  </div>
                </div>

                <div className="course-detail__meta-item">
                  <Users className="course-detail__meta-icon" size={20} />
                  <div className="course-detail__meta-info">
                    <span className="course-detail__meta-label">Students</span>
                    <span className="course-detail__meta-value">{mockCourseDetail.meta.students}</span>
                  </div>
                </div>

                <div className="course-detail__meta-item">
                  <span className="course-detail__meta-icon">📹</span>
                  <div className="course-detail__meta-info">
                    <span className="course-detail__meta-label">Type</span>
                    <span className="course-detail__meta-value">{mockCourseDetail.meta.type}</span>
                  </div>
                </div> */}

                  <div className="course-detail__price">
                    <DollarSign
                      className="course-detail__price-icon"
                      size={24}
                    />
                    <span className="course-detail__price-value">
                      {course.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e)=>handleEnrollClick(e,course.enrolled)}
                  className="course-detail__enroll-btn"
                >
                 {!course.enrolled? "Enroll Now":"Open"}
                </button>
              </div>
            </aside>
          </main>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
