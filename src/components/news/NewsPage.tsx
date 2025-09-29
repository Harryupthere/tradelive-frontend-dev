import React, { useState, useMemo,useEffect } from "react";
import { Search } from "lucide-react";
import "./NewsPage.scss";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

interface News {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  published_date: string;
}

const mockCourses: News[] = [
 
];

const NewsPage: React.FC = () => {
   const token=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaGFyc2guY2hvdWhhbjAxMEBnbWFpbC5jb20iLCJzdWJfaWQiOiIxIiwidHlwZSI6ImxvZ2luIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTg3NDEyMzksImV4cCI6MTc1ODc0NDgzOX0.c-lp29O2ycNqRrwGub2q2XFADIYYmGC118KiTutGKrQ`
  
   const navigate=useNavigate()
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0)
        const [news, setNews] = useState<News[]>([]);
    
  const [loading, setLoading] = useState(false);
  const coursesPerPage = 16;

     useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://16.16.127.61/api/v1/news?status=&page=${currentPage}&limit=${coursesPerPage}`,{ headers: {
        Authorization: `Bearer ${token}`, // 👈 add bearer token
      }},);

        // Map API data → Course type
        const mappedCourses: News[] = res.data.data.data.news.map((item: any) => (
         
          {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          image: item.cover_image,
          published_date: item.published_date,
        }
      ));


        setNews(mappedCourses);
        setTotalPages(res.data.data.data.total_pages)
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage]);


  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination__btn"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="pagination__number"
            >
              1
            </button>
            {startPage > 2 && <span className="pagination__ellipsis">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination__number ${
              currentPage === page ? "pagination__number--active" : ""
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="pagination__ellipsis">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="pagination__number"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination__btn"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="news-page">
      <div className="news-page__container">
        <header className="news-page__header">
          <h1 className="news-page__title">News Catalog</h1>
          <div className="search-bar">
            <div className="search-bar__wrapper">
              <Search className="search-bar__icon" size={20} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar__input"
              />
              <button className="search-bar__btn">Search</button>
            </div>
          </div>
        </header>

        <main className="news-page__main">
          {news.length > 0 ? (
            <div className="news-grid">
              {news.map((course) => (
                <div key={course.id} className="news-card" onClick={()=>navigate(`/news/${course.id}`)}>
                  <div className="news-card__image-wrapper">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="news-card__image"
                    />
                    <div
                      className={`news-card__status news-card__status--${course.published_date.toLowerCase()}`}
                    >
                      {new Date(course.published_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}
                    </div>
                  </div>
                  <div className="news-card__content">
                    <h3 className="news-card__title">{course.title}</h3>
                    <p className="news-card__subtitle">{course.subtitle}</p>
                    <button className="news-card__btn">View News</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="news-page__empty">
              <h2>No courses found</h2>
              <p>Try adjusting your search terms</p>
            </div>
          )}
        </main>

        {totalPages > 1 && (
          <footer className="news-page__footer">{renderPagination()}</footer>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
