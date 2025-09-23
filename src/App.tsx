import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoursesPage from "./components/courses/CoursesPage";
import NewsPage from "./components/news/NewsPage"; // 👈 TSX page

import CourseDetailPage from './components/courseDetail/CourseDetailPage'
import CourseLearnPage from "./components/courseLearning/CourseLearnPage";
import NewsDetailPage from "./components/newsDetail/NewsDetailPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/course-detail/:id" element={<CourseDetailPage />} />
        <Route path="/course/:id" element={<CourseLearnPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />



      </Routes>
    </Router>
  );
};

export default App;
