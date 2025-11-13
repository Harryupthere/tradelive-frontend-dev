// Privacy Policy — TradeLive24.com
// Effective Date: November 11, 2025
// Entity: TradeLive Ventures LLC
// 1. Introduction
// Welcome to TradeLive24.com, operated by TradeLive Ventures LLC (“we,
// ” “us,
// ” “our”).
// We are a not-for-profit educational platform built to make trading knowledge accessible to
// everyone.
// Your privacy and trust are important to us, and this policy explains how we collect, use, and
// safeguard your data.
// 2. Information We Collect
// We collect only the information necessary to provide and improve our services, including:
// ●
// ●
// ●
// ●
// Account Data: Name, email, and password upon signup.
// Payment Data: Managed securely by Stripe and CoinPayments — we never store or
// view your card or wallet details.
// Usage Data: Login times, page activity, and community engagement metrics.
// Technical Data: Browser, device type, and IP address for analytics and security
// purposes.
// 3. How We Use Your Data
// We use your information to:
// ●
// Operate and maintain your account.
// ●
// Process memberships and verify payments.
// ●
// Improve user experience and develop platform features.
// ●
// ●
// Facilitate mentor applications and communication.
// Ensure compliance with security and legal standards.
// We do not sell or profit from your data.
// All collected information is used strictly to operate, maintain, and develop the platform and its
// educational creators.
// 4. Payments & Security
// All payments are processed through Stripe and CoinPayments, which comply with
// international privacy and financial security standards.
// TradeLive24 does not have access to or store your full payment details.
// 5. Cookies
// We use cookies to enhance site performance and personalize your experience. You may
// disable cookies in your browser settings.
// 6. Data Retention
// Your data is retained only while your account is active or as required by Malaysian law. You can
// request deletion anytime by emailing support@tradelive24.com.
// 7. Mentorship Applications
// Mentor applicants provide verification details through mentor@tradelive24.com.
// This data is confidential and used solely for eligibility and identity verification.
// 8. Legal Disclaimer
// TradeLive24 is an educational platform, not a financial advisory service.
// All content is for learning purposes only. Trading in financial markets involves risk, and any
// loss incurred is the user’s sole responsibility.
// TradeLive Ventures LLC does not provide financial advice or investment recommendations.
// 9. Jurisdiction
// TradeLive24 is governed by the laws of Malaysia.
// However, no legal proceedings will be entertained against the platform, its operators, or
// affiliates for user-incurred trading losses or financial damages.
// 10. Contact
// TradeLive Ventures LLC
// Malaysia
// 📧
// support@tradelive24.com

import React from 'react';
import { ArrowLeft, Shield, Users, FileText, Mail } from 'lucide-react';
import './index.scss';

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
            <span>Effective Date: November 13, 2025</span>
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
                This Privacy Policy explains how <strong>TradeLive24.com</strong> collects, uses, shares and protects your personal
                information when you use our services. We are committed to protecting your privacy and handling your data in a transparent
                and secure manner.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Users className="terms-page__section-icon" size={24} />
              <h2>2. Information We Collect</h2>
            </div>
            <div className="terms-page__section-content">
              <p>We collect the following types of information:</p>
              <ul className="terms-page__policy-list">
                <li>Account details (name, email, profile information).</li>
                <li>Transaction and payment information (when you purchase subscriptions or coupons).</li>
                <li>Usage data (pages visited, courses accessed, timestamps).</li>
                <li>Content you submit (feedback, forum posts, journal entries).</li>
              </ul>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>3. How We Use Your Information</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We use collected information to provide and improve our services, process payments, personalise your experience, and
                communicate important updates. We also use aggregated usage data for analytics and platform improvements.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>4. Cookies & Tracking</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We use cookies and similar technologies to personalise content, remember preferences and measure site performance. You
                can control cookie settings in your browser, but disabling certain cookies may affect functionality.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>5. Data Sharing & Third Parties</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We may share your information with trusted service providers who help operate the platform (payment processors, hosting,
                analytics). We do not sell your personal data. Third parties are required to follow our data handling rules.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>6. Security</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We implement reasonable security measures to protect your data. However, no online transmission is completely secure;
                please exercise caution and choose strong passwords.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Users className="terms-page__section-icon" size={24} />
              <h2>7. Your Rights</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data. To exercise these
                rights, contact us using the details below.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>8. Children</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Our services are not intended for children under 18. We do not knowingly collect personal information from minors.
              </p>
            </div>
          </section>

          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>9. Changes to this Policy</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                We may update this Privacy Policy from time to time. Significant changes will be posted on this page with an updated
                effective date.
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
                For privacy-related inquiries, email us at{' '}
                <a href="mailto:privacy@tradelive24.com" className="terms-page__contact-link">privacy@tradelive24.com</a>.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
