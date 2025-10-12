import { ArrowRight, Heart, Home } from 'lucide-react';
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

const Banner = () => {
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
            Start Learning
            <ArrowRight size={20} />
          </button>
        </div>

        <button className="google-btn">
          <Home size={20} />
          Join The Community
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
