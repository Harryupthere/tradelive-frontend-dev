import React from 'react';
import { ArrowLeft, Shield, Users, CreditCard, FileText, AlertCircle, Mail } from 'lucide-react';
import './index.scss';

const TermsConditions: React.FC = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="terms-page">
      <div className="terms-page__container">
        {/* Title Section */}
        <div className="terms-page__title-section">
          <h1 className="terms-page__title">Terms & Conditions</h1>
          <p className="terms-page__subtitle">TradeLive24.com</p>
          <div className="terms-page__effective-date">
            <span>Effective Date: November 11, 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="terms-page__content">
          {/* Overview Section */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>1. Overview</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Welcome to <strong>TradeLive24.com</strong>, a community-driven education hub operated by{' '}
                <strong>TradeLive Ventures LLC</strong>
              </p>
              <p>By accessing our platform, you agree to these Terms & Conditions.</p>
              <p>
                TradeLive24 operates as a <strong>not-for-profit platform</strong> — all revenue is reinvested into hosting,
                maintenance, development, and supporting creators who contribute educational content.
              </p>
            </div>
          </section>

          {/* Eligibility Section */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Users className="terms-page__section-icon" size={24} />
              <h2>2. Eligibility</h2>
            </div>
            <div className="terms-page__section-content">
              <p>You must be <strong>at least 18 years old</strong> to use this site.</p>
              <p>By registering, you confirm that you meet the age requirement.</p>
            </div>
          </section>

          {/* Membership Section */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>3. Membership</h2>
            </div>
            <div className="terms-page__section-content">
              <p>TradeLive24 offers two user tiers:</p>
              <div className="terms-page__membership-tiers">
                <div className="terms-page__tier">
                  <div className="terms-page__tier-header">
                    <div className="terms-page__tier-badge terms-page__tier-badge--free">Free</div>
                    <h3>Explorer (Free)</h3>
                  </div>
                  <p>Basic access to community discussions and limited content.</p>
                </div>
                <div className="terms-page__tier">
                  <div className="terms-page__tier-header">
                    <div className="terms-page__tier-badge terms-page__tier-badge--paid">Paid</div>
                    <h3>Pro Member (Paid)</h3>
                  </div>
                  <p>Full access to advanced education, mentor content, and premium tools.</p>
                </div>
              </div>
              <div className="terms-page__membership-note">
                <p>
                  Membership fees are minimal and exist <strong>solely to sustain the platform</strong>, not for company profit.
                </p>
              </div>
            </div>
          </section>

          {/* Payment Policy Section */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <CreditCard className="terms-page__section-icon" size={24} />
              <h2>4. Payment Policy</h2>
            </div>
            <div className="terms-page__section-content">
              <ul className="terms-page__policy-list">
                <li>
                  Payments are handled securely through <strong>Stripe</strong> and <strong>CoinPayments</strong>.
                </li>
                <li>
                  There is <strong>no refund policy</strong>, as payments directly support operational continuity.
                </li>
                <li>
                  Auto-renewals may occur annually unless cancelled before renewal.
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Educational Disclaimer */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <AlertCircle className="terms-page__section-icon" size={24} />
              <h2>5. Educational Disclaimer</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                TradeLive24 provides educational materials only. We do not offer financial or investment advice.
                Users are fully responsible for their trading decisions and any resulting profits or losses.
                By using our platform, you acknowledge that trading involves risk and agree that
                TradeLive24, its team, or contributors cannot be held liable for financial outcomes.
              </p>
            </div>
          </section>

          {/* 6. Mentor Program */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Users className="terms-page__section-icon" size={24} />
              <h2>6. Mentor Program</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                Users may apply to become mentors by completing verification through{' '}
                <a href="mailto:mentor@tradelive24.com" className="terms-page__contact-link">mentor@tradelive24.com</a>.
                Mentors are independent educators, not employees or financial advisors of TradeLive Ventures LLC.
              </p>
            </div>
          </section>

          {/* 7. Community Conduct */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>7. Community Conduct</h2>
            </div>
            <div className="terms-page__section-content">
              <ul className="terms-page__policy-list">
                <li>Maintain professionalism and respect in all discussions.</li>
                <li>Avoid posting misleading, abusive, or promotional content.</li>
                <li>Not impersonate any other user, mentor, or brand representative.</li>
                <li>Accounts violating these standards may be suspended or terminated.</li>
              </ul>
            </div>
          </section>

          {/* 8. Intellectual Property */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <FileText className="terms-page__section-icon" size={24} />
              <h2>8. Intellectual Property</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                All educational materials, branding, videos, and site design are owned by TradeLive Ventures LLC.
                Users may not copy, distribute, or resell content without permission.
              </p>
            </div>
          </section>

          {/* 9. Non-Profit and Transparency Clause */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>9. Non-Profit and Transparency Clause</h2>
            </div>
            <div className="terms-page__section-content">
              <p>TradeLive24 does not operate for profit. All membership fees and income are used exclusively for:</p>
              <ul className="terms-page__policy-list">
                <li>Site hosting and maintenance.</li>
                <li>Platform security and technology development.</li>
                <li>Supporting educational creators and improving content.</li>
              </ul>
              <p>
                There are no commissions, affiliate payouts, or referral incentives.
                Users may, however, gift memberships via activation codes purchased in their portal.
              </p>
            </div>
          </section>

          {/* 10. Risk and Liability */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <AlertCircle className="terms-page__section-icon" size={24} />
              <h2>10. Risk and Liability</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                All users acknowledge that trading financial instruments carries inherent risk.
                TradeLive24 is not responsible for any trading losses or financial damages.
                Use of educational material is at your own discretion and risk.
              </p>
            </div>
          </section>

          {/* 11. Legal Proceedings */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Shield className="terms-page__section-icon" size={24} />
              <h2>11. Legal Proceedings</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                This platform operates under Malaysian law, but TradeLive Ventures LLC does not entertain
                legal proceedings regarding trading outcomes or personal financial losses incurred by users.
              </p>
            </div>
          </section>

          {/* 12. Termination of Service */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <AlertCircle className="terms-page__section-icon" size={24} />
              <h2>12. Termination of Service</h2>
            </div>
            <div className="terms-page__section-content">
              <p>We reserve the right to suspend or terminate any account for violation of terms or misuse of the platform.</p>
            </div>
          </section>

          {/* 13. Contact Information */}
          <section className="terms-page__section">
            <div className="terms-page__section-header">
              <Mail className="terms-page__section-icon" size={24} />
              <h2>13. Contact Information</h2>
            </div>
            <div className="terms-page__section-content">
              <p>
                <strong>General inquiries:</strong>{' '}
                <a href="mailto:support@tradelive24.com" className="terms-page__contact-link">support@tradelive24.com</a>
              </p>
              <p>
                <strong>Mentor applications:</strong>{' '}
                <a href="mailto:mentor@tradelive24.com" className="terms-page__contact-link">mentor@tradelive24.com</a>
              </p>
              <p>TradeLive Ventures LLC, Malaysia</p>
            </div>
          </section>
        </div>

        {/* Footer (optional) */}
        {/* ...existing footer code (if any) ... */}
      </div>
    </div>
  );
};

export default TermsConditions;