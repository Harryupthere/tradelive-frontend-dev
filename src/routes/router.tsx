
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/layout";
import { RoutesArray } from "./routeArray";
import { PrivateRoute } from "./authRoute";
import CoursesPage from "../components/courses/CoursesPage";


const Router = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <CoursesPage /> },
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
