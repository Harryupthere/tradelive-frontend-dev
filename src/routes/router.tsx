
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/layout";

import { CourseListing, Home } from "../pages";
import { RoutesArray } from "./routeArray";
import { PrivateRoute } from "./authRoute";
import NewsListing from "../pages/newsListing";


const Router = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/courses", element: <CourseListing /> },
        { path: "/news", element: <NewsListing /> },
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
