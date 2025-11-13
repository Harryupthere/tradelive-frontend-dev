import React from "react";
import { ArrowLeft, Shield, Users, FileText, Mail } from "lucide-react";
import "./index.scss";

const PrivacyPolicy: React.FC = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="terms-page">
      <div className="terms-page__container">
        {/* Title Section */}
        <div className="terms-page__title-section">
          <h1 className="terms-page__title">Privacy Policy</h1>
          <p className="terms-page__subtitle">TradeLive24.com</p>
          <div className="terms-page__effective-date">
            <span>Effective Date: November 11, 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="terms-page__content">
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>1. Introduction</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Welcome to <strong>TradeLive24.com</strong> operated by
                TradeLive Ventures LLC.(“we, ” “us, ” “our”). We are a
                not-for-profit educational platform built to make trading
                knowledge accessible to everyone. Your privacy and trust are
                important to us, and this policy explains how we collect, use,
                and safeguard your data.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Users className="terms-page__section-icon" size={24} />
              <h2>2. Information We Collect</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We collect only the information necessary to provide and improve
                our services, including:
              </p>
              <ul className="terms-page__policy-list">
                <li>
                  <strong>Account Data:</strong> Name, email, and password upon
                  signup.
                </li>
                <li>
                  <strong>Payment Data:</strong> Managed securely by Stripe and
                  CoinPayments — we never store or view your card or wallet
                  details.
                </li>
                <li>
                  <strong>Usage Data:</strong> Login times, page activity, and
                  community engagement metrics.
                </li>
                <li>
                  <strong>Technical Data:</strong> Browser, device type, and IP
                  address for analytics and security purposes.
                </li>
              </ul>
             
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>3. How We Use Your Data</h2>
            </div>
            <div className="terms-page__section-content">
              <p>We use your information to:</p>
              <ul className="terms-page__policy-list">
                <li>Operate and maintain your account.</li>
                <li>Process memberships and verify payments.</li>
                <li>Improve user experience and develop platform features.</li>
                <li>Facilitate mentor applications and communication.</li>
                <li>Ensure compliance with security and legal standards.</li>
              </ul>
               <p>We do not sell or profit from your data.<br/>
All collected information is used strictly to <strong>operate, maintain, and develop </strong>the platform and its
educational creators.</p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>4. Payments & Security</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
               All payments are processed through <strong>Stripe</strong> and <strong>CoinPayments</strong>, which comply with
international privacy and financial security standards.<br/>
TradeLive24 does not have access to or store your full payment details.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>5. Cookies</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We use cookies to enhance site performance and personalize your experience. You may
disable cookies in your browser settings.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>6. Data Retention</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Your data is retained only while your account is active or as required by Malaysian law. You can
request deletion anytime by emailing <strong>support@tradelive24.com</strong>.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Users className="terms-page__section-icon" size={24} />
              <h2>7.  Mentorship Applications</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Mentor applicants provide verification details through <strong>mentor@tradelive24.com</strong>.<br/>
This data is confidential and used solely for eligibility and identity verification.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>8. Legal Disclaimer</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
              TradeLive24 is an <strong>educational</strong> platform, not a financial advisory service.<br/>
All content is for <strong>learning purposes only.</strong> Trading in financial markets involves risk, and any
loss incurred is the <strong>user’s sole responsibility.</strong><br/>
TradeLive Ventures LLC does <strong>not</strong> provide financial advice or investment recommendations.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>9. Jurisdiction</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
               TradeLive24 is governed by the laws of <strong>Malaysia</strong>.
However, <strong>no legal proceedings</strong> will be entertained against the platform, its operators, or
affiliates for user-incurred trading losses or financial damages.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Mail className="terms-page__section-icon" size={24} />
              <h2>10. Contact</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
              <strong>TradeLive Ventures LLC</strong><br/>
              Malaysia<br/>
📧
                <a
                  href="mailto:privacy@tradelive24.com"
                  className="terms-page__contact-link"
                >
                  support@tradelive24.com
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
