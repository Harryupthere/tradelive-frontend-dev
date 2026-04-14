import { CourseListing } from "../pages";
import DashboardLayout from "../pages/DashboardLayout/DashboardLayout";
import ForexCalculators from "../pages/forexCalculatros/ForexCalculators";
import NewsListing from "../pages/newsListing";
import ProfilePage from "../pages/profile";
import InstructorsPage from "../pages/instructor-page/InstructorsPage";
import ChatDiscussion from "../pages/ChatDiscussion/ChatDiscussion";
import Dashboard from "../pages/dashboard/Index";
import TradeJournal from "../pages/tradeJournal/Index";
import Resources from "../pages/Resouces";
import ActivationCoupons from "../pages/activation-coupons/ActivationCoupons";
import LoginSessions from "../pages/loginSessions";
import PlatformTutorials from "../pages/platformTutorials/Index";
import Faqs from "../pages/faqs/Index";
import BrokerageTutorials from "../pages/brokerageTutorials/Index";
import DepositAndWithdraw from "../pages/depositAndWithdraw/Index";
import HowToNavigate from "../pages/howToNavigate/Index";
import ApplicationForm from "../pages/applicationForm/ApplicationForm";
import AIChatAssistant from "../pages/aIChatAssistant";
import SupportTickets from "../pages/supportTickets";
const base = import.meta.env.VITE_BASE;

export const RoutesArray = [
  {
    element: <DashboardLayout />,
    children: [
      { path: `${base}profile`, element: <ProfilePage /> },
      { path: `${base}courses`, element: <CourseListing /> },
      { path: `${base}news`, element: <NewsListing /> },
      { path: `${base}forax-calculators`, element: <ForexCalculators /> },
      { path: `${base}dashboard`, element: <Dashboard /> },
      { path: `${base}instructors`, element: <InstructorsPage /> },
      { path: `${base}chat-discussions`, element: <ChatDiscussion /> },
      { path: `${base}trade-journal`, element: <TradeJournal /> },
      { path: `${base}resources`, element: <Resources /> },
      { path: `${base}activation-coupons`, element: <ActivationCoupons /> },
      { path: `${base}login-sessions`, element: <LoginSessions /> },
      { path: `${base}platform-tutorial`, element: <PlatformTutorials /> },
      { path: `${base}brokerage-tutorial`, element: <BrokerageTutorials /> },
      { path: `${base}deposit-withdrawal`, element: <DepositAndWithdraw /> },
      { path: `${base}navigate-tradelive`, element: <HowToNavigate /> },
      { path: `${base}ai-chart-chat`, element: <AIChatAssistant /> },
      { path: `${base}support-tickets`, element: <SupportTickets /> },


      { path: `${base}faq`, element: <Faqs /> },


    ],
  },
];
