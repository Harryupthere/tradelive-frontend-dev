import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Plus, Minus } from "lucide-react";
import "./CTA.scss";

const CTA = () => {
  const [expanded, setExpanded] = useState<string | false>("panel3");

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const faqs = [
    {
      question: "What is TradeLive24?",
      answer:
        "TradeLive24 is an all-in-one trading education and community hub where traders can learn, share strategies, and discuss the markets.",
    },
    {
      question: "Why do you charge $12.0/year?",
      answer:
        "The fee covers hosting, live market data, moderation, and platform improvements. There’s no personal profit — it’s purely to sustain the platform.",
    },
    {
      question: "Can I access free content?",
      answer:
        "Yes. Free users get access to community forums, 3 sample video lessons, and limited discussions.",
    },
    {
      question: "What’s included in the premium plan?",
      answer:
        "Full 10-video trading series, downloadable PDFs/checklists, ad-free browsing, early webinar access, and priority support.",
    },
    {
      question: "How do I pay?",
      answer:
        "Payments are processed securely via Stripe or PayPal. We do not store your card information.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes. You can cancel your annual subscription anytime; your membership will remain active until the end of the paid year.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Yes. We offer a 30-day money-back guarantee if you are not satisfied.",
    },
    {
      question: "Do I need prior trading experience?",
      answer:
        "No. While our videos dive straight into trading style and strategy, beginners are welcome to learn from community discussions.",
    },
    {
      question: "Are your videos beginner-friendly?",
      answer:
        "They are primarily focused on real trading strategies. Beginners can follow, but some prior trading knowledge helps.",
    },
    {
      question: "Can I download videos?",
      answer:
        "Premium users can access downloadable PDFs and checklists. Video downloads are limited to streaming on the platform.",
    },
    {
      question: "Is TradeLive24 ad-free?",
      answer:
        "Yes, for premium users. Free users may see minimal platform messaging.",
    },
    {
      question: "How often is content updated?",
      answer:
        "We continuously add new lessons, trade analyses, and community resources.",
    },
    {
      question: "Can I participate in discussions?",
      answer:
        "Yes. Both free and premium users can participate in community forums, but premium users get early access and priority responses.",
    },
    {
      question: "Are mentors available?",
      answer:
        "Yes. Premium users can book one-on-one sessions with verified mentors for trade analysis and guidance.",
    },
    {
      question: "Can I share my login?",
      answer:
        "Accounts are personal and non-transferable. Sharing may result in account suspension.",
    },
    {
      question: "Do you offer live webinars?",
      answer:
        "Yes. Weekly live webinars and AMAs are hosted for premium users, with free users able to watch limited replays.",
    },
    {
      question: "What markets are covered?",
      answer:
        "Forex, crypto, and major commodities. Our strategy videos focus on price action, market structure, and risk management.",
    },
    {
      question: "Can I suggest new content?",
      answer:
        "Absolutely. Our community-driven approach allows users to request topics, share feedback, and suggest lessons.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We use secure SSL connections, encrypted payments, and never sell your personal information.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Email us at support@tradelive24.com or use the in-platform contact form.",
    },
    {
      question: "Can I get multiple devices access?",
      answer:
        "Yes, your account works on all devices — desktop, tablet, and mobile.",
    },
    {
      question: "Is there a referral program?",
      answer:
        "We don’t offer affiliate or referral programs because TradeLive24 doesn’t take any profit — every dollar goes toward sustaining and improving the platform. Our focus is on keeping education free and accessible, not generating revenue.",
    },
    {
      question: "Can I gift a membership?",
      answer:
        "Yes! You can gift access to TradeLive24 by purchasing an activation code through your account portal. This helps share learning with friends while still supporting platform operations — remember, all fees go directly to running and improving the site.",
    },
  ];

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
          {/* <div className="learning-section__accordions">
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

           
          </div> */}
          <div className="learning-section__accordions-scroll">
            <div className="learning-section__accordions">
              {faqs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  expanded={expanded === `faq${idx}`}
                  onChange={handleChange(`faq${idx}`)}
                  className="learning-accordion"
                >
                  <AccordionSummary
                    expandIcon={
                      expanded === `faq${idx}` ? (
                        <Minus className="accordion-icon" />
                      ) : (
                        <Plus className="accordion-icon" />
                      )
                    }
                    className="accordion-summary"
                  >
                    <span className="accordion-title">{faq.question}</span>
                  </AccordionSummary>
                  <AccordionDetails className="accordion-details">
                    <p className="accordion-content">{faq.answer}</p>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
