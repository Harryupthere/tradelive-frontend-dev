import image from "../../utils/helpers";

export interface News {
  id: number;
  title: string;
  date: string;
  image: string;
}

interface NewsCard {
  news: News;
}

const ProductCard: React.FC<NewsCard> = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-card-img">
        <img src={image[course.image]} alt={course.title} />
      </div>
      <div className="card-content">
        <h3 className="title">{course.title}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, vel?
        </p>
        <div className="rating-align">
          <div className="rating">
            <span>Date</span>
          </div>
          <div className="total-enroll">{course.date}</div>
        </div>
        <button type="button" className="border-btn">
          View Full News
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
