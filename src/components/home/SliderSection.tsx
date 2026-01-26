import {  Heart } from 'lucide-react';
import './SliderSection.scss';
const coursesColumn1 = [
  {
    id: 1,
    type: 'course',
    title: 'Forex Sessions & Timing Mastery',
    instructor: 'Sitamparam R.M.',
    color: 'red'
  },
  {
    id: 2,
    type: 'WEBINAR',
    title: 'Understanding Market Structure Like a Pro',
    instructor: 'Sitamparam R.M.',
    color: 'lime'
  },
  {
    id: 3,
    type: 'course',
    title: 'Pure Price Action: Reading the Naked Chart',
    instructor: 'Sitamparam R.M.',
    color: 'green'
  },
  {
    id: 4,
    type: 'WEBINAR',
    title: 'Why I Trade Only GJ & Gold',
    instructor: 'Sitamparam R.M.',
    color: 'teal'
  },

  {
    id: 5,
    type: 'course',
    title: 'Risk Management: The Real Edge in Forex',
    instructor: 'Sitamparam R.M.',
    color: 'purple'
  },
  {
    id: 6,
    type: 'webinar',
    title: 'Stop Trading Too Many Pairs — Focus Creates Profit',
    instructor: 'Sitamparam R.M.',
    color: 'lime'
  },
  {
    id: 7,
    type: 'course',
    title: 'Mastering Trendlines & Key Levels',
    instructor: 'Sitamparam R.M',
    color: 'red'
  },
];

const coursesColumn2 = [


  {
    id: 8,
    type: 'webinar',
    title: 'Percentage vs. Profit — Which One Really Matters',
    instructor: 'Sitamparam R.M.',
    color: 'green'
  },
  {
    id: 9,
    type: 'course',
    title: 'Building a Profitable Mindset in Forex',
    instructor: 'Sitamparam R.M.',
    color: 'teal'
  },
  {
    id: 10,
    type: 'webiar',
    title: 'Why Prop Firms Are the Modern Cheat Code',
    instructor: 'Sitamparam R.M.',
    color: 'purple'
  },
  {
    id: 11,
    type: 'webinar',
    title: 'Stop Looking for Holy Grails — Learn the Process Instead',
    instructor: 'Sitamparam R.M',
    color: 'red'
  },
  {
    id: 12,
    type: 'course',
    title: 'Trade Execution & Confirmation Through Structure',
    instructor: 'Sitamparam R.M.',
    color: 'lime'
  },
  {
    id: 13,
    type: 'course',
    title: 'From Impulse to Discipline: Emotional Control in Trading',
    instructor: 'Sitamparam R.M',
    color: 'red'
  },
];

const coursesColumn3 = [

  {
    id: 14,
    type: 'webinar',
    title: 'How to Identify Liquidity Traps & False Breakouts',
    instructor: 'Sitamparam R.M.',
    color: 'green'
  },
  {
    id: 15,
    type: 'course',
    title: 'The Art of Patience — Waiting for Your Setup',
    instructor: 'Sitamparam R.M.',
    color: 'teal'
  },
  {
    id: 16,
    type: 'webinar',
    title: 'Understanding Forex Session Overlaps for Better Entries',
    instructor: 'Sitamparam R.M.',
    color: 'purple'
  },

  {
    id: 17,
    type: 'course',
    title: 'The Truth About Profitability — Consistency Over Wins',
    instructor: 'Sitamparam R.M.',
    color: 'lime'
  },
  {
    id: 18,
    type: 'webinar',
    title: 'Trade Less, Earn More: The Power of Selectivity',
    instructor: 'Sitamparam R.M',
    color: 'red'
  },
  {
    id: 19,
    type: 'course',
    title: 'High-Probability Trading Through Market Structure Flow',
    instructor: 'Sitamparam R.M.',
    color: 'lime'
  },
  {
    id: 20,
    type: 'webinar',
    title: 'How to Think Like a Funded Trader, Not a Gambler',
    instructor: 'Sitamparam R.M',
    color: 'red'
  },
];
const SliderSection = () => {
  return (
 <div className="marquee-section">
        <div className="marquee-column">
          <div className="marquee-content">
            {[...coursesColumn1, ...coursesColumn1].map((course, index) => (
              <div key={index} className={`course-card ${course.color}`}>
                <div className="course-header">
                  {course.type === 'course' ? (
                   <span className="course-badge"><span className="badge-icon">📘 </span>COURSE</span>
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
                   <span className="course-badge"><span className="badge-icon">📘 </span>COURSE</span>
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
                    <span className="course-badge"><span className="badge-icon">📘 </span>COURSE</span>
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
  )
}

export default SliderSection