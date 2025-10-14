import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Plus, Minus } from 'lucide-react';
import './CTA.scss';

const CTA = () => {
  const [expanded, setExpanded] = useState<string | false>('panel3');

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="learning-section">
      <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
      <div className="learning-section__container">
        <div className="learning-section__left" data-aos="fade-right">
          <div className="learning-section__hero-card">
            <img
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Students learning together"
              className="learning-section__hero-image"
            />
            <div className="learning-section__cta-card">
              <h2 className="learning-section__cta-title">
               Learn. Adapt. React.
              </h2>
              <p className="learning-section__cta-text">
               Start Your Trading Journey — Free.
              </p>
              <button className="learning-section__cta-button">
                Get Started
                <span className="learning-section__cta-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="learning-section__right" data-aos="fade-left">
          <div className="learning-section__accordions">
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChange('panel1')}
              className="learning-accordion"
            >
              <AccordionSummary
                expandIcon={expanded === 'panel1' ? <Minus className="accordion-icon" /> : <Plus className="accordion-icon" />}
                className="accordion-summary"
              >
                <span className="accordion-title">Learn Anywhere, Anytime You Want</span>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <p className="accordion-content">
                  Access your courses from any device, whether you're at home, commuting, or traveling.
                  Our platform ensures seamless learning experiences across all your devices.
                </p>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleChange('panel2')}
              className="learning-accordion"
            >
              <AccordionSummary
                expandIcon={expanded === 'panel2' ? <Minus className="accordion-icon" /> : <Plus className="accordion-icon" />}
                className="accordion-summary"
              >
                <span className="accordion-title">Expert Mentors Guiding Your Growth</span>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <p className="accordion-content">
                  Learn from industry professionals with years of real-world experience.
                  Get personalized feedback and mentorship to accelerate your learning journey.
                </p>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleChange('panel3')}
              className="learning-accordion"
            >
              <AccordionSummary
                expandIcon={expanded === 'panel3' ? <Minus className="accordion-icon" /> : <Plus className="accordion-icon" />}
                className="accordion-summary"
              >
                <span className="accordion-title">Interactive Learning That Feels Fun</span>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <div className="accordion-content-with-image">
                  <p className="accordion-content">
                    Enjoy engaging lessons, quizzes, and activities designed to keep learning exciting,
                    enjoyable, and truly effective for lasting results.
                  </p>
                  <div className="accordion-image-wrapper">
                    <img
                      src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Student celebrating success"
                      className="accordion-image"
                    />
                  </div>
                </div>
                <button className="accordion-button">Click here</button>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'panel4'}
              onChange={handleChange('panel4')}
              className="learning-accordion"
            >
              <AccordionSummary
                expandIcon={expanded === 'panel4' ? <Minus className="accordion-icon" /> : <Plus className="accordion-icon" />}
                className="accordion-summary"
              >
                <span className="accordion-title">Career Skills For Real Success</span>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <p className="accordion-content">
                  Build practical skills that employers are looking for. Our curriculum is designed
                  to prepare you for real-world challenges and career advancement.
                </p>
              </AccordionDetails>
            </Accordion>

            {/* <Accordion
              expanded={expanded === 'panel5'}
              onChange={handleChange('panel5')}
              className="learning-accordion"
            >
              <AccordionSummary
                expandIcon={expanded === 'panel5' ? <Minus className="accordion-icon" /> : <Plus className="accordion-icon" />}
                className="accordion-summary"
              >
                <span className="accordion-title">Affordable Quality That Inspires Progress</span>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <p className="accordion-content">
                  Get premium education at prices that won't break the bank. We believe quality
                  learning should be accessible to everyone pursuing their dreams.
                </p>
              </AccordionDetails>
            </Accordion> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
