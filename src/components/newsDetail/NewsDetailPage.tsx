import React, { useState, useEffect } from "react";
import "./NewsDetailPage.scss";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";

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

  const [news, setNews] = useState<NewsDetails>({});
  const [htmlContent, setHtmlContent] = useState();

  const fetchNewsDetail = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS?.news_detail}/${id}`);
      if (response?.status) {
        const htmls = decodeHtml(response?.data?.data?.data?.content);
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

  return (
    <div className="news-detail">
      {news && (
        <div className="news-detail__container">
          <header className="news-detail__header">
            <h1 className="news-detail__title">{news.title}</h1>
            <p className="news-detail__subtitle">{news.subtitle}</p>
            <p className="news-detail__subtitle">
              {new Date(news.published_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
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
                <div
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
