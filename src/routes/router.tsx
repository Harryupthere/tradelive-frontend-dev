
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/layout";

import CoursesPage from "../components/courses/CoursesPage";
import { Home } from "../pages";
import { RoutesArray } from "./routeArray";
import { PrivateRoute } from "./authRoute";


const Router = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <CoursesPage /> },
        { path: "/", element: <Home /> },
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
