import { Rating } from "@mui/material";
import "./Productcard.scss";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;
export interface Course {
  id: number;
  title: string;
  enrollments: string;
  rating: number;
  preview_image: string;
}

interface ProductCardProps {
  course: Course;
}

const ProductCard: React.FC<ProductCardProps> = ({ course }) => {

  const navigate = useNavigate()
  return (
    <div className="course-card" onClick={() => navigate(`${base}course-overview/${course.id}`)}>
      <div className="course-card-img">
        <img src={course.preview_image} alt={course.title} />
      </div>
      <div className="card-content">
        <h3 className="title">{course.title}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, vel?
        </p>
        <div className="rating-align">
          <div className="rating">
            <Rating
              name="size-small"
              defaultValue={5}
              precision={0.5}
              size="small"
              readOnly
            />{" "}
            <span>({Math.floor(Math.random() * 200)})</span>
          </div>
          <div className="total-enroll">{course.enrollments} Enrollments</div>
        </div>
        <button type="button" className="border-btn">
          View Full Course
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
