import { Rating } from "@mui/material";
import "./Productcard.scss";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;
import image from '../../assets/images/thumb1.jpg'
export interface Course {
  id: number;
  title: string;
  subtitle:string;
  enrollments: string;
  rating: number;
  preview_image: string;
  // optional type field - backend may use `type` or `course_type`
  type?: string;
 // course_type?: string;
 avgRating:number;
}

interface ProductCardProps {
  course: Course;
}

const ProductCard: React.FC<ProductCardProps> = ({ course }) => {

  const navigate = useNavigate()
  return (
    <div className="course-card" onClick={() => navigate(`${base}course-overview/${course.id}`)}>
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
        <div className="rating-align">
          <div className="rating">
            <Rating
              name="size-small"
              defaultValue={course.avgRating}
              precision={0.5}
              size="small"
              readOnly
            />{" "}
            <span>({course.avgRating})</span>
          </div>
          <div className="total-enroll">{course.enrolledCount} Enrollments</div>
        </div>
        <button type="button" className="border-btn">
          View Full Course
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
