import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoursesPage from "./components/courses/CoursesPage";
import NewsPage from "./components/news/NewsPage"; // 👈 TSX page

import CourseDetailPage from './components/courseDetail/CourseDetailPage'
import CourseLearnPage from "./components/courseLearning/CourseLearnPage";
import NewsDetailPage from "./components/newsDetail/NewsDetailPage";
import ForumPage from "./components/forumCategory/ForumPage";
import ForumTopicsPage from "./components/ForumTopic/ForumTopicsPage";
const baseUrl = import.meta.env.VITE_BASE;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={`${baseUrl}`} element={<CoursesPage />} />
        <Route path={`${baseUrl}news`} element={<NewsPage />} />
        <Route path={`${baseUrl}course-detail/:id`} element={<CourseDetailPage />} />
        <Route path={`${baseUrl}course/:id`} element={<CourseLearnPage />} />
        <Route path={`${baseUrl}news/:id`} element={<NewsDetailPage />} />

        <Route path={`${baseUrl}forum`} element={<ForumPage />} />
        <Route path={`${baseUrl}forum-topic/:forumId`} element={<ForumTopicsPage />} />


        




      </Routes>
    </Router>
  );
};

export default App;
