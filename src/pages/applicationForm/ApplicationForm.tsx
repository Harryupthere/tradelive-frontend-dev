import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Send, ArrowLeft, User, FileText, Lock } from 'lucide-react';
import './applicationForm.scss';
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
import { successMsg } from '../../utils/customFn';
import { useNavigate } from 'react-router-dom';
const base = import.meta.env.VITE_BASE;

type FormValues = { [key: number]: string };

interface FormErrors {
  [key: string]: string;
}

interface Question {
  id: number;
  question_code?: string;
  question_text?: string;
  title?: string;
  question?: string;
  minLength?: number;
  min_length?: number;
  icon?: React.ReactNode;
}

const ApplicationForm: React.FC = () => {

    const navigate = useNavigate();
  // formData is keyed by question ID (dynamic)
  const [formData, setFormData] = useState<FormValues>({});

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const foundersNote: string = `<p>If you are here, it means you are looking for a trading system because you don't have a consistent one yet. I am handing you the blueprint that took me 5 years to perfect and has generated over 7 figures in profit. I am providing this for the mere price of $4.1, but in exchange, you must value it and follow it to the absolute tee.</p><p>This is the first review form before I open TradeLive24 to the public. As part of this first batch, you will be mentored by me personally. You will have access to my personal contact number for the first 90 days—more than enough time to build and perfect my system from your side. My time is the most valuable asset I have; do not waste it.</p>`;
  const securityNote: string = `<p>TradeLive24 systems are built with utmost care. Every video within the modules is embedded with forensic watermarking; your username is tagged on every frame. If any videos are leaked, we will know exactly which account the leak originated from. You will face immediate legal consequences and a permanent ban.</p>`;

 const guidance: string =  ` <li>
                  <strong>Zero Tolerance on Security:</strong> If a candidate seems hesitant about the username tagging 
                  or the legal consequences of leaking, reject them immediately. They are a risk to your intellectual property.
                </li>
                <li>
                  <strong>The 90-Day Mindset:</strong> Focus on those who mention they want to learn your logic 
                  rather than just wanting "signals."
                </li>`

                const [content,setContent]=useState<any>({guidance:guidance,securityNote:securityNote,foundersNote:foundersNote});

  useEffect(() => {
    getQuestions();
    getContent()
  },[]);

  const getContent = async () => {
    try {
        const response=await api.get(`${API_ENDPOINTS?.application_content}`);
        const testcontent=response.data.data
        if(response?.data.status){
          setContent({foundersNote:testcontent[0].content,securityNote:testcontent[1].content,guidance:testcontent[2].content});
        }
        
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  const getQuestions = async () => {
    try {
        const response=await api.get(`${API_ENDPOINTS?.application_questions}`);
        if(response?.status){
          setQuestions(response?.data?.data);
        }
        
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  const handleInputChange = (questionId: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Clear error when user starts typing
    if (errors[String(questionId)]) {
      setErrors(prev => ({
        ...prev,
        [String(questionId)]: ''
      }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    questions.forEach(question => {
      const id = question.id;
      const value = (formData[id] || '').trim();
      const minLen = 10//question.minLength ?? question.min_length ?? 100;

      if (!value) {
        newErrors[String(id)] = 'This question is mandatory and cannot be left empty.';
      } else if (value.length < minLen) {
        newErrors[String(id)] = `Response must be at least ${minLen} characters. Current: ${value.length}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // alert(validateForm());
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {


     const payload = {
       answers: questions.map(q => ({
         question_id: q.id,
         answer: formData[q.id] || ''
       }))
     };

     const response = await api.post(`${API_ENDPOINTS?.application_submit}`, payload);
     successMsg(response?.data?.message || 'Application submitted successfully!');
     
     setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    // window.history.back();
    navigate(`${base}dashboard`);
  };

  if (submitted) {
    return (
      <div className="application-form">
        <div className="application-form__container">
          <div className="submission-success">
            <div className="success-animation">
              <div className="success-circle">
                <CheckCircle size={80} />
              </div>
              <div className="success-particles">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`particle particle-${i + 1}`} />
                ))}
              </div>
            </div>
            
            <h1 className="success-title">Application Submitted Successfully!</h1>
            <p className="success-message">
              Your application for TradeLive24 Batch 01 has been received and is under personal review. 
              You will be contacted within 48-72 hours regarding your application status.
            </p>
            
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Submission Status:</span>
                <span className="detail-value">Successfull</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Review Timeline:</span>
                <span className="detail-value">48-72 Hours</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value status-pending">Under Review</span>
              </div>
            </div>

            <button className="btn btn--primary" onClick={handleGoBack}>
              <ArrowLeft size={18} />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-form">
      <div className="application-form__container">
        {/* <button className="back-button" onClick={handleGoBack}>
          <ArrowLeft size={16} />
          Back
        </button> */}

        <div className="application-form__header">
          <div className="header-badge">
            <Shield size={20} />
            <span>Batch 01 Exclusive</span>
          </div>
          
          <h1 className="page-title">TradeLive24: Batch 01 Exclusive Intake Review</h1>
          
          <div className="founder-note">
            <div className="founder-note__header">
              <User size={24} />
              <h2>Founder's Note</h2>
            </div>
            {/* here i want to get the dynamic html content */}
            <div className="founder-note__content" dangerouslySetInnerHTML={{ __html: content.foundersNote }} ></div>
          </div>

          <div className="security-notice">
            <div className="security-notice__header">
              <Lock size={24} />
              <h3>SECURITY & LEGAL NOTICE</h3>
            </div>
                        <div className="security__content" dangerouslySetInnerHTML={{ __html: content.securityNote }} ></div>

          </div>
        </div>

        <form onSubmit={handleSubmit} className="application-form__form">
          <div className="form-section">
            <div className="section-header">
              <FileText size={28} />
              <h2>📋 Mandatory Questionnaire</h2>
            </div>
            <p className="section-subtitle">
              Please answer every question in detail. Short or lazy answers will result in immediate rejection.
            </p>

            <div className="questions-grid">
              {questions.map((question, index) => {
                const qTitle = question.question_code ?? question.title ?? `Question ${index + 1}`;
                const qText = question.question_text ?? question.question ?? '';
                const minLen = question.minLength ?? question.min_length ?? 100;
                const currentValue = formData[question.id] || '';
                const currentLen = currentValue.length;
                const errorMsg = errors[String(question.id)];

                return (
                  <div key={question.id} className="question-card">
                    <div className="question-card__header">
                      <div className="question-number">{index + 1}</div>
                      {/* <div className="question-icon">{question.icon}</div> */}
                      <h3 className="question-title">{qTitle}</h3>
                    </div>
                    
                    <div className="question-content">
                      <p className="question-text">{qText}</p>
                      
                      <div className="textarea-wrapper">
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          placeholder="Provide a detailed and thoughtful response..."
                          className={`question-textarea ${errorMsg ? 'error' : ''}`}
                          rows={6}
                        />
                        <div className="character-count">
                          <span className={currentLen >= minLen ? 'valid' : 'invalid'}>
                            {currentLen}
                          </span>
                          <span className="min-required">/ {minLen} min</span>
                        </div>
                      </div>
                      
                      {errorMsg && (
                        <div className="error-message">
                          <AlertTriangle size={16} />
                          {errorMsg}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-footer">
            <div className="guidance-section">
              <h3>💡 Guidance for Batch 01 Selection:</h3>
              <ul className="guidance-list">
               <div className="guidance__content" dangerouslySetInnerHTML={{ __html: content.guidance }} ></div>
              </ul>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Application for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;