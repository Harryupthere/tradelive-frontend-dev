import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/customFn";
const base = import.meta.env.VITE_BASE;

export interface News {
  id: number;
  title: string;
  updated_at: string;
  cover_image: string;
}

interface NewsCardProps {
  news: News;
}

const NewsCards: React.FC<NewsCardProps> = ({ news }) => {

  const navigate = useNavigate()
  return (
    <div className="course-card" onClick={() => navigate(`${base}news-detail/${news.id}`)}>
      <div className="course-card-img">
        <img src={news.cover_image} alt={news.title} />
      </div>
      <div className="card-content">
        <h3 className="title">{news.title}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, vel?
        </p>
        <div className="rating-align">
          <div className="rating">
            <span>Date</span>
          </div>
          <div className="total-enroll">{formatDate(news.updated_at)}</div>
        </div>
        <button type="button" className="border-btn">
          View Full News
        </button>
      </div>
    </div>
  );
};

export default NewsCards;
