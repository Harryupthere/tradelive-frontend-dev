import { CourseListing } from "../pages";
import DashboardLayout from "../pages/DashboardLayout/DashboardLayout";
import ForexCalculators from "../pages/forexCalculatros/ForexCalculators";
import NewsListing from "../pages/newsListing";
import ProfilePage from "../pages/profile";
import InstructorsPage from "../pages/instructor-page/InstructorsPage";
import ChatDiscussion from "../pages/ChatDiscussion/ChatDiscussion";
import Dashboard from "../pages/dashboard/Index";
import TradeJournal from '../pages/tradeJournal/Index'
const base = import.meta.env.VITE_BASE;

export const RoutesArray = [
  {
    element: <DashboardLayout />,
    children: [
      { path: `${base}profile`, element: <ProfilePage /> },
      { path: `${base}courses`, element: <CourseListing /> },
      { path: `${base}news`, element: <NewsListing /> },
      { path: `${base}forum-calculators`, element: <ForexCalculators /> },
      { path: `${base}dashboard`, element: <Dashboard /> },
      { path: `${base}instructors`, element: <InstructorsPage /> },
      { path: `${base}chat-discussions`, element: <ChatDiscussion /> },
      { path: `${base}trade-journal`, element: <TradeJournal /> },

    ],
  },
];
