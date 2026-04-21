import { Rating } from "@mui/material";
import "./Productcard.scss";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;
import image from '../../assets/images/thumb1.jpg'
export interface ProductResourceI {
  id: number;
  title: string;
  subtitle:string;
  type?: string;
  preview_image: string;
  // enrolledCount: string;
  // avgRating:number;
 
}

interface ProductResourceCardProps {
  course: ProductResourceI;
}

const ProductResourceCard: React.FC<ProductResourceCardProps> = ({ course }) => {

  const navigate = useNavigate()
  return (
    <div className="course-card" onClick={() => navigate(`${base}resource-overview/${course.id}`)}>
      {/* Tag showing course type (top-right) */}
      {(course.type || course.type) && (
        <div className="course-card__tag">
          {course.type == 1 ? "Free" : "Prime"}
        </div>
      )}
      <div className="course-card-img">
        <img src={course.preview_image || image} alt={course.title} />
      </div>
      <div className="card-content">
        <h3 className="title">{course.title}</h3>
        <p>
          {course.subtitle}
        </p>
     
        <button type="button" className="border-btn">
          View Full Resource
        </button>
      </div>
    </div>
  );
};

export default ProductResourceCard;
