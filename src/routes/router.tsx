
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/layout";

import { CourseListing, Home } from "../pages";
import { RoutesArray } from "./routeArray";
import { PrivateRoute } from "./authRoute";
import NewsListing from "../pages/newsListing";
import CourseOverview from "../pages/courseOverview";
import NewsDetailPage from "../components/newsDetail/NewsDetailPage";
import Login from "../pages/login";
import CourseDetail from "../pages/courseDetail";
import CoursesPage from "../components/courses/CoursesPage";
import ForumPage from "../components/forumCategory/ForumPage";
import ForumTopicsPage from "../components/ForumTopic/ForumTopicsPage";
const base = import.meta.env.VITE_BASE;


const Router = () => {
  const router = createBrowserRouter([
    { path: `${base}login`, element: <Login /> },
    {
      element: <Layout />,
      children: [
        { path: `${base}`, element: <Home /> },
        { path: `${base}courses`, element: <CourseListing /> },
        { path: `${base}news`, element: <NewsListing /> },
        { path: `${base}news-detail/:id`, element: <NewsDetailPage /> },
        { path: `${base}course-overview/:id`, element: <CourseOverview /> },
        { path: `${base}course/detail/:id`, element: <CourseDetail /> },
        // { path: `${base}coursesss`, element: <CoursesPage /> },
        { path: `${base}forum`, element: <ForumPage /> },
        { path: `${base}forum/:forumId`, element: <ForumTopicsPage /> },
      ],
    },
    {
      element: <PrivateRoute />,
      children: [{ element: <Layout />, children: RoutesArray }],
    },

  ]);
  return <RouterProvider router={router} />;
};

export default Router;
