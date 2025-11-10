import { useState } from 'react';
import { Mail, Clock, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import './contactus.scss';
import { Grid } from '@mui/material';

import { api } from '../../api/Service';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { successMsg } from '../../utils/customFn';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  
  const submit = async (payload: any) => {
    try {
      const res = await api.post(API_ENDPOINTS.contactUs, payload);
      return res;
    } catch (err) {
      throw err;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      const payload = { ...formData };
      const res = await submit(payload);
      // backend may respond with { data: { status: true, data: { message: '...' } } }
      const ok = res?.data?.status ?? res?.status === 200;
      console.log(res.data)
      if (ok) {
        setStatus('success');
        successMsg(res?.data?.data?.message || 'Message sent successfully');
        setFormData({ name: '', email: '', subject: '', message: '' });
        // reset success state after a short delay
        setTimeout(() => setStatus('idle'), 3500);
      } else {
        setStatus('error');
        const errMsg = res?.data?.message || 'Failed to send message';
        setErrorMessage(errMsg);
      }
    } catch (error: any) {
      console.error('Contact form submit failed', error);
      setStatus('error');
      setErrorMessage(error?.message || 'Network error');
    }
  };

  return (
    <div className="contact-us">
      <div className="contact-us__hero">
        <div className='contact-us__container'>
            <h2 className='contact-us__hero-title-main'>Contact US</h2>
          <h1 className="contact-us__hero-title">
            Got a question, idea, or partnership proposal?
          </h1>
          <p className="contact-us__hero-subtitle">
            We'd love to hear from you.
          </p>
          <p className="contact-us__hero-description">
            Use the form below to reach our team — whether it's about your account, technical issues, or collaboration opportunities, we'll get back to you within 24–48 hours.
          </p>
        </div>
      </div>

      <div className="contact-us__main">
        <div className="contact-us__container">
          <div className="contact-us__content">
            <div className="contact-us__info-section">
              <h2 className="info-section__title">Support Inquiries</h2>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-card__icon">
                    <Mail />
                  </div>
                  <div className="info-card__content">
                    <h3 className="info-card__label">Email</h3>
                    <a href="mailto:support@tradelive24.com" className="info-card__value">
                      support@tradelive24.com
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card__icon">
                    <Clock />
                  </div>
                  <div className="info-card__content">
                    <h3 className="info-card__label">Response Time</h3>
                    <p className="info-card__value">Within 1–2 business days</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card__icon">
                    <MessageCircle />
                  </div>
                  <div className="info-card__content">
                    <h3 className="info-card__label">Community Help</h3>
                    <p className="info-card__value">Ask quick questions directly in our forums for faster responses</p>
                  </div>
                </div>
              </div>

              <div className="privacy-notice">
                <AlertCircle className="privacy-notice__icon" />
                <p>We value your privacy — your message and email are never shared with anyone.</p>
              </div>
            </div>

            <div className="contact-us__form-section">
              <div className="form-wrapper">
                <h2 className="form-section__title">Send us a message</h2>

                {status === 'success' && (
                  <div className="form-alert form-alert--success">
                    <CheckCircle className="form-alert__icon" />
                    <div>
                      <h4>Message sent successfully!</h4>
                      <p>We'll get back to you within 24-48 hours.</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="form-alert form-alert--error">
                    <AlertCircle className="form-alert__icon" />
                    <div>
                      <h4>Failed to send message</h4>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="John Doe"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="john@example.com"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="How can we help?"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="form-textarea"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      disabled={status === 'loading'}
                    />
                  </div>

                  <button
                    type="submit"
                    className="form-submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="form-submit__icon" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
