import { ArrowRight, Heart } from 'lucide-react';
import './Banner.scss';

const coursesColumn1 = [
  {
    id: 1,
    type: 'course',
    title: 'Stock Market Investing For Beginners',
    instructor: 'Deepak Taunk',
    color: 'red'
  },
  {
    id: 2,
    type: 'course',
    title: 'Technical Analysis Masterclass',
    instructor: 'Kunal Patel',
    color: 'lime'
  },
  {
    id: 3,
    type: 'webinar',
    title: 'Mutual Fund Simplified For Beginners',
    instructor: 'CA Manish Singh',
    color: 'green'
  },
  {
    id: 4,
    type: 'course',
    title: 'Technical Analysis For Beginners',
    instructor: 'Hitesh Singh',
    color: 'teal'
  }
];

const coursesColumn2 = [
  {
    id: 5,
    type: 'webinar',
    title: 'Trade with RSI, MA & Price Action',
    instructor: 'Akhand Pratap Singh',
    color: 'purple'
  },
  {
    id: 6,
    type: 'course',
    title: 'Technical Analysis Masterclass',
    instructor: 'Kunal Patel',
    color: 'lime'
  },
  {
    id: 7,
    type: 'course',
    title: 'Stock Market Investing For Beginners',
    instructor: 'Deepak Taunk',
    color: 'red'
  },
  {
    id: 8,
    type: 'webinar',
    title: 'Mutual Fund Simplified For Beginners',
    instructor: 'CA Manish Singh',
    color: 'green'
  }
];

const coursesColumn3 = [
  {
    id: 9,
    type: 'course',
    title: 'Technical Analysis For Beginners',
    instructor: 'Hitesh Singh',
    color: 'teal'
  },
  {
    id: 10,
    type: 'webinar',
    title: 'Trade with RSI, MA & Price Action',
    instructor: 'Akhand Pratap Singh',
    color: 'purple'
  },
  {
    id: 11,
    type: 'course',
    title: 'Stock Market Investing For Beginners',
    instructor: 'Deepak Taunk',
    color: 'red'
  },
  {
    id: 12,
    type: 'course',
    title: 'Technical Analysis Masterclass',
    instructor: 'Kunal Patel',
    color: 'lime'
  }
];

const  Banner = () => {
  return (
    <div className="landing-container">
      <div className="content-section">
        <h1 className="main-heading">
          <div className="white-text">Learn To Trade</div>
          <div className="gradient-text">The Right Way</div>
        </h1>

        <p className="description">
         Master real market structure, price action, and mindset — not just theory.
Join a community built by traders, for traders.

        </p>

        <div className="input-section">
          <div className="phone-input">
            <span className="country-code">+91</span>
            <input type="tel" placeholder="Enter Mobile Number" />
          </div>
          <button className="get-started-btn">
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>

        <button className="google-btn">
          <div className="google-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          Continue with Google
        </button>
      </div>

      <div className="marquee-section">
        <div className="marquee-column">
          <div className="marquee-content">
            {[...coursesColumn1, ...coursesColumn1].map((course, index) => (
               <div key={index} className={`course-card ${course.color}`}>
                <div className="course-header">
                  {course.type === 'course' ? (
                    <span className="course-badge">COURSE</span>
                  ) : (
                    <span className="webinar-badge">
                      <span className="badge-icon">▶</span>
                      WEBINAR
                    </span>
                  )}
                  <h3 className="course-title">{course.title}</h3>
                </div>
                <div className="course-footer">
                  <div className="instructor">
                    <span>—</span>
                    <span>{course.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-column">
          <div className="marquee-content reverse">
            {[...coursesColumn2, ...coursesColumn2].map((course, index) => (
              <div key={index} className={`course-card ${course.color}`}>
                <div className="course-header">
                  {course.type === 'course' ? (
                    <span className="course-badge">COURSE</span>
                  ) : (
                    <span className="webinar-badge">
                      <span className="badge-icon">▶</span>
                      WEBINAR
                    </span>
                  )}
                  <h3 className="course-title">{course.title}</h3>
                </div>
                <div className="course-footer">
                  <div className="instructor">
                    <span>—</span>
                    <span>{course.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-column">
          <div className="marquee-content">
            {[...coursesColumn3, ...coursesColumn3].map((course, index) => (
              <div key={index} className={`course-card ${course.color}`}>
                <div className="course-header">
                  {course.type === 'course' ? (
                    <span className="course-badge">COURSE</span>
                  ) : (
                    <span className="webinar-badge">
                      <span className="badge-icon">▶</span>
                      WEBINAR
                    </span>
                  )}
                  <h3 className="course-title">{course.title}</h3>
                </div>
                <div className="course-footer">
                  <div className="instructor">
                    <span>—</span>
                    <span>{course.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
