import { CourseListing } from "../pages";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import NewsListing from "../pages/newsListing";
import ProfilePage from "../pages/profile";
const base = import.meta.env.VITE_BASE;

export const RoutesArray = [
    {element: <DashboardLayout />, children:
            [
                { path: `${base}profile`, element: <ProfilePage /> },
                { path: `${base}courses`, element: <CourseListing /> },
        { path: `${base}news`, element: <NewsListing /> },
            ]
    }
];


