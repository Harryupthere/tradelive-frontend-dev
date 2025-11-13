import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, BookOpen, Users } from 'lucide-react';
import './InstructorsPage.scss';
import { api } from '../../api/Service';
import { API_ENDPOINTS } from '../../constants/ApiEndPoints';
import { useParams, useNavigate } from "react-router-dom";

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
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

const InstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchInstructors();
  }, []);

      // Simulate API call
    const fetchInstructors = async () => {
      setLoading(true);
     try{
        const res=await api.get(`${API_ENDPOINTS.instructor}/all`)
        if(res.status){
            setInstructors(res.data.data.data);
            setLoading(false)
        }
     }catch(error){
        setLoading(false)
     }
    };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleInstructorClick = (instructorId: string) => {
    navigate(`${base}instructor/${instructorId}`)
  };

  if (loading) {
    return (
      <div className="instructors-page">
        <div className="container">
          <div className="instructors-page__loading">
            <div className="instructors-page__spinner"></div>
            <p>Loading instructors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instructors-page">
        {/* Header */}
        {/* <div className="instructors-page__header">
          <button onClick={handleBackClick} className="back-button">
            <ArrowLeft size={20} />
            Back
          </button>
          
          
        </div> */}

        {/* Title Section */}
        <div className="instructors-page__title-section">
          <h1 className="instructors-page__title">Our Instructors</h1>
          <p className="instructors-page__subtitle">
            Learn from industry experts and experienced professionals
          </p>
          <div className="instructors-page__stats">
            <div className="instructors-page__stat">
              <span className="instructors-page__stat-number">{instructors.length}</span>
              <span className="instructors-page__stat-label">Expert Instructors</span>
            </div>
            <div className="instructors-page__stat">
              <span className="instructors-page__stat-number">
                {instructors.length>0 && instructors.reduce((total, instructor) => total + instructor.products.length, 0)}
              </span>
              <span className="instructors-page__stat-label">Total Courses</span>
            </div>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="instructors-page__grid">
          {instructors.length>0 && instructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="instructors-page__card"
              onClick={() => handleInstructorClick(instructor.id)}
            >
              <div className="instructors-page__card-header">
                <div className="instructors-page__avatar">
                  <img 
                    src={instructor.profile_image} 
                    alt={instructor.name}
                    className="instructors-page__avatar-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('instructors-page__avatar-fallback--hidden');
                    }}
                  />
                  <div className="instructors-page__avatar-fallback instructors-page__avatar-fallback--hidden">
                    <User size={32} />
                  </div>
                </div>
                <div className="instructors-page__card-info">
                  <h3 className="instructors-page__card-name">{instructor.name}</h3>
                  <p className="instructors-page__card-designation">{instructor.designation}</p>
                </div>
              </div>
              
              <div className="instructors-page__card-footer">
                <div className="instructors-page__products-count">
                  <BookOpen size={16} />
                  <span>
                    {instructor.products.length} Course{instructor.products.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="instructors-page__card-arrow">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path 
                      d="M6 12L10 8L6 4" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {instructors.length === 0 && !loading && (
          <div className="instructors-page__empty">
            <Users size={64} />
            <h3>No Instructors Found</h3>
            <p>There are currently no instructors available.</p>
          </div>
        )}
      </div>
  );
};

export default InstructorsPage;