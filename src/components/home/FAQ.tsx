import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Plus, Minus } from "lucide-react";
import "./CTA.scss";

const FAQ = () => {
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
      question: "Why do you charge $50.0/year?",
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
    {
  question: "Can I log in from multiple devices at the same time?",
  answer:
    "For security reasons, TradeLive24 does not allow simultaneous logins from multiple devices. If our system detects repeated login attempts from unverified or unauthorized devices, your account will automatically receive warning flags. Continued violations may lead to temporary suspension or permanent deactivation of your ID to protect your data and platform integrity. Always use only your own trusted device to access your account.",
},

  ];
  return(
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
                  sx={{backgroundColor:'#282828',borderRadius:'10px',fontSize:'16px',fontWeight:700}}
                    expandIcon={
                      expanded === `faq${idx}` ? (
                        <Minus className="accordion-icon" />
                      ) : (
                        <Plus className="accordion-icon" />
                      )
                    }
                    className="accordion-summary"
                  >
                    <span className="accordion-title" style={{fontWeight:'700'}}>{faq.question}</span>
                  </AccordionSummary>
                  <AccordionDetails className="accordion-details" sx={{color:'#fff'}}>
                    <p className="accordion-content">{faq.answer}</p>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
  )
}
export default FAQ