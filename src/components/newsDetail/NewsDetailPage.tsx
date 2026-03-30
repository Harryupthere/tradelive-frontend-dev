import React, { useState, useEffect } from "react";
import "./NewsDetailPage.scss";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
import { Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 
import DOMPurify from "dompurify";

const base = import.meta.env.VITE_BASE;

interface NewsDetails {
  id: number;
  title: string;
  subtitle: string;
  cover_image: string;
  content: string;
  published_date: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
          const navigate = useNavigate();

  const [news, setNews] = useState<NewsDetails>({});
  const [htmlContent, setHtmlContent] = useState();

  const fetchNewsDetail = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS?.news_detail}/${id}`);
      if (response?.status) {
        const htmls = decodeHtml(response?.data?.data?.data?.content);
//         const cleanHTML = DOMPurify.sanitize(htmls, {
//   ALLOWED_TAGS: [
//     "h1","h2","h3","p","img","figure","figcaption",
//     "blockquote","ul","ol","li","a","strong","em","br"
//   ],
//   ALLOWED_ATTR: ["href","src","alt","target"]
// });
        setHtmlContent(htmls);
        setNews(response?.data?.data?.data);
      }
    } catch (error) {
      console.log("Failed to fetch news", error);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
  }, []);

  function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
      const handleBackToCalculators = () => {
    navigate(`${base}news`);
  };
  return (
    <div className="news-detail">
       
      {news && (
        <div className="news-detail__container">
          <div className="compounding-calculator__header">
                <button className="back-button" onClick={handleBackToCalculators}>
                  <ArrowLeft size={20} />
                  Back to News
                </button>
              </div>
          <header className="news-detail__header">
            <h1 className="news-detail__title">{news.title}</h1>
            <p className="news-detail__subtitle">{news.subtitle}</p>
            <div className="news-detail__meta-info">
              <div className="news-detail__date">
                <Calendar size={18} />
                <span>
                  {new Date(news.published_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          <main className="news-detail__main">
            <div className="news-detail__content">
              <div className="news-detail__image-wrapper">
                <img
                  src={news.cover_image}
                  alt={news.title}
                  className="news-detail__image"
                />
              </div>
              <div className="news-detail__description">
                {/* <div
                  dangerouslySetInnerHTML={{
                    __html: htmlContent,
                  }}
                /> */}
                <div
    className="news-article"
    dangerouslySetInnerHTML={{
      __html: htmlContent,
    }}
  />
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
