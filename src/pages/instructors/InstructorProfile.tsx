import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Calendar, ChevronLeft, ChevronRight, Play, Star, Users, Clock } from 'lucide-react';
import './InstructorProfile.scss';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { api } from '../../api/Service';
import { useNavigate, useParams } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  preview_image: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_image: string;
  designation: string;
  social_links: string[];
  created_at: string;
  updated_at: string;
  products: Product[];
}

const InstructorProfile: React.FC = () => {
      const { id } = useParams(); // ✅ get instructor ID from URL

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // const mockData: Instructor = {
    //   id: "1",
    //   name: "Sitamparam Ramlingam",
    //   email: "Sitamxxx@gmail.com",
    //   bio: "Experienced trading instructor with over 10 years in financial markets. Specializing in forex trading, technical analysis, and risk management strategies. Passionate about helping traders develop profitable and sustainable trading skills.",
    //   profile_image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    //   designation: "Senior Trading Instructor & Market Analyst",
    //   social_links: ["Sitamparam"],
    //   created_at: "2025-10-30T11:37:49.000Z",
    //   updated_at: "2025-10-30T11:38:31.000Z",
    //   products: [
    //     {
    //       id: "1",
    //       title: "Make Trading Easy - Complete Forex Course",
    //       preview_image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400"
    //     },
    //     {
    //       id: "2",
    //       title: "Advanced Technical Analysis Masterclass",
    //       preview_image: "https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=400"
    //     },
    //     {
    //       id: "3",
    //       title: "Risk Management for Professional Traders",
    //       preview_image: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=400"
    //     },
    //     {
    //       id: "4",
    //       title: "Psychology of Trading Success",
    //       preview_image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400"
    //     },
    //     {
    //       id: "5",
    //       title: "Cryptocurrency Trading Fundamentals",
    //       preview_image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400"
    //     }
    //   ]
    // };

    // setTimeout(() => {
    //   setInstructor(mockData);
    //   setLoading(false);
    // }, 1000);

    callApi()
  }, []);

  const callApi=async()=>{
try{

    const res=await api.get(`${API_ENDPOINTS.instructor}/${id}`)

    if(res.data.status){
        setInstructor(res.data.data)
    }
}catch(error){
    console.log(error)
}
  }

  const handleBackToInstructors = () => {
    window.history.back();
  };

  const getCardsPerView = () => {
    if (!instructor?.products) return 1;
    const productCount = instructor.products.length;
    if (productCount >= 3) return 3;
    if (productCount === 2) return 2;
    return 1;
  };

  const cardsPerView = getCardsPerView();
  const maxSlide = Math.max(0, (instructor?.products.length || 0) - cardsPerView);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="instructor-profile">
        <div className="instructor-profile__container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading instructor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="instructor-profile">
        <div className="instructor-profile__container">
          <div className="error-message">
            <p>Instructor not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-profile">
      <div className="instructor-profile__container">
        <div className="instructor-profile__header">
          <button className="back-button" onClick={handleBackToInstructors}>
            <ArrowLeft size={20} />
            Back to Instructors
          </button>
        </div>

        <div className="instructor-hero">
          <div className="instructor-hero__content">
            <div className="instructor-hero__image">
              <img 
                src={instructor.profile_image || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                alt={instructor.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
              <div className="instructor-hero__badge">
                <Star size={16} />
                Expert Instructor
              </div>
            </div>
            
            <div className="instructor-hero__info">
              <h1 className="instructor-hero__name">{instructor.name}</h1>
              <p className="instructor-hero__designation">
                {instructor.designation || 'Trading Instructor'}
              </p>
              
              <div className="instructor-hero__stats">
                <div className="stat-item">
                  <Users size={20} />
                  <span>1,250+ Students</span>
                </div>
                <div className="stat-item">
                  <Play size={20} />
                  <span>{instructor.products.length} Courses</span>
                </div>
                <div className="stat-item">
                  <Clock size={20} />
                  <span>50+ Hours Content</span>
                </div>
              </div>

              <div className="instructor-hero__contact">
                <div className="contact-item">
                  <Mail size={18} />
                  <span>{instructor.email}</span>
                </div>
                <div className="contact-item">
                  <Calendar size={18} />
                  <span>Joined {formatDate(instructor.created_at)}</span>
                </div>
              </div>

              {instructor.social_links && instructor.social_links.length > 0 && (
                <div className="instructor-hero__social">
                  <h4>Connect with me:</h4>
                  <div className="social-links">
                    {instructor.social_links.map((link, index) => (
                      <a key={index} href="#" className="social-link">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {instructor.bio && (
          <div className="instructor-bio">
            <h2 className="section-title">About the Instructor</h2>
            <p className="bio-text">{instructor.bio}</p>
          </div>
        )}

        <div className="instructor-courses">
          <div className="courses-header">
            <h2 className="section-title">Featured Courses</h2>
            <div className="courses-navigation">
              <button 
                className={`nav-button ${currentSlide === 0 ? 'disabled' : ''}`}
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="slide-indicator">
                {currentSlide + 1} / {maxSlide + 1}
              </span>
              <button 
                className={`nav-button ${currentSlide >= maxSlide ? 'disabled' : ''}`}
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="courses-slider">
            <div 
              className="courses-track"
              style={{
                transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`,
                gridTemplateColumns: `repeat(${instructor.products.length}, ${100 / cardsPerView}%)`
              }}
            >
              {instructor.products.map((product) => (
                <div key={product.id} className="course-card">
                  <div className="course-card__image">
                    <img 
                      src={product.preview_image} 
                      alt={product.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="course-card__overlay">
                      <Play size={24} />
                    </div>
                  </div>
                  
                  <div className="course-card__content">
                    <h3 className="course-card__title">{product.title}</h3>
                    
                    <div className="course-card__meta">
                      {/* <div className="course-rating">
                        <Star size={14} />
                        <span>4.8</span>
                      </div> */}
                      {/* <div className="course-students">
                        <Users size={14} />
                        <span>250+ students</span>
                      </div> */}
                    </div>

                    {/* <div className="course-card__price">
                      <span className="current-price">$99</span>
                      <span className="original-price">$149</span>
                    </div> */}

                    <button className="course-card__button">
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="instructor-achievements">
          <h2 className="section-title">Achievements & Recognition</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">
                <Star size={32} />
              </div>
              <h3>Top Rated Instructor</h3>
              <p>Consistently rated 4.8+ stars by students</p>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-icon">
                <Users size={32} />
              </div>
              <h3>1000+ Students Taught</h3>
              <p>Successfully mentored over 1000 trading students</p>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-icon">
                <Play size={32} />
              </div>
              <h3>Expert Content Creator</h3>
              <p>Created comprehensive trading education content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;