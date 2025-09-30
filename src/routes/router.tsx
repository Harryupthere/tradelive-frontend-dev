
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/layout";

import { CourseListing, Home } from "../pages";
import { RoutesArray } from "./routeArray";
import { PrivateRoute } from "./authRoute";
import NewsListing from "../pages/newsListing";
import CourseOverview from "../pages/courseOverview";
import NewsDetailPage from "../components/newsDetail/NewsDetailPage";


const Router = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/courses", element: <CourseListing /> },
        { path: "/news", element: <NewsListing /> },
        { path: "/news-detail/:id", element: <NewsDetailPage /> },
        { path: "/course-overview/:id", element: <CourseOverview /> },
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
