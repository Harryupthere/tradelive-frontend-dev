
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/layout";

import { ContactUs, CourseListing, Home } from "../pages";
import { RoutesArray } from "./routeArray";
import { PrivateRoute } from "./authRoute";
import CourseOverview from "../pages/courseOverview";
import NewsDetailPage from "../components/newsDetail/NewsDetailPage";
import CourseDetail from "../pages/courseDetail";
import ForumPage from "../pages/forumCategory/ForumPage";
import ForumTopicsPage from "../pages/ForumTopic/ForumTopicsPage";
import ForexCalculators from "../pages/forexCalculatros/ForexCalculators";
import CurrencyConverter from "../pages/cal-currencyConverter/CurrencyConverter";
import PositionSizeCalculator from "../pages/cal-positionSizeCalculator/PositionSizeCalculator";
import PipCalculator from "../pages/cal-pipCalculator/PipCalculator";
import MarginCalculator from "../pages/cal-marginCalculator/MarginCalculator";
import FibonacciCalculator from "../pages/cal-fibonacciCalculator/FibonacciCalculator";
import PivotPointCalculator from "../pages/cal-pivotPointCalculator/PivotPointCalculator";
import RiskOfRuinCalculator from "../pages/cal-riskOfRuinCalculator/RiskOfRuinCalculator";
import CompoundingCalculator from "../pages/cal-compoundingCalculator/CompoundingCalculator";
import DrawdownCalculator from "../pages/cal-drawdownCalculator/DrawdownCalculator";
import LeverageCalculator from "../pages/cal-leverageCalculator/LeverageCalculator";
import ProfitCalculator from "../pages/cal-profitCalculator/ProfitCalculator";
import RebateCalculator from "../pages/cal-rebateCalculator/RebateCalculator";
import AboutUs from "../pages/aboutus";
import LoginPage from "../pages/login/Login-new";
import TermsConditions from "../pages/term-and-condition";
import SignupPage from "../pages/login/Signup";
import ResetPasswordPage from "../pages/login/ResetPassword";
import ForgetPasswordPage from "../pages/login/ForgetPassword";
import Checkout from "../pages/checkout";
import PaymentSuccess from "../pages/checkout/PaymentSuccess";
import PaymentFailure from "../pages/checkout/PaymentFailure";
import ActivationCoupons from "../pages/activation-coupons/ActivationCoupons";
import ProfilePage from "../pages/profile";
import InstructorProfile from "../pages/instructors/InstructorProfile";
import InstructorsPage from "../pages/instructor-page/InstructorsPage";
const base = import.meta.env.VITE_BASE;


const Router = () => {
  const router = createBrowserRouter([
    // { path: `${base}login`, element: <Login /> },
    { path: `${base}login`, element: <LoginPage /> },
    { path: `${base}signup`, element: <SignupPage /> },
    { path: `${base}reset-password`, element: <ResetPasswordPage /> },
    { path: `${base}forgot-password`, element: <ForgetPasswordPage /> },
    { path: `${base}payment-success`, element: <PaymentSuccess /> },
    { path: `${base}payment-failure`, element: <PaymentFailure /> },



    {
      element: <Layout />,
      children: [
        { path: `${base}`, element: <Home /> },
        { path: `${base}news-detail/:id`, element: <NewsDetailPage /> },
        { path: `${base}course-overview/:id`, element: <CourseOverview /> },
        { path: `${base}course/detail/:id`, element: <CourseDetail /> },
        // { path: `${base}coursesss`, element: <CoursesPage /> },
        { path: `${base}forum`, element: <ForumPage /> },
        { path: `${base}forum/:forumId`, element: <ForumTopicsPage /> },
        { path: `${base}forum-calculators`, element: <ForexCalculators /> },
        { path: `${base}currency-converter`, element: <CurrencyConverter /> },
        { path: `${base}position-size-calculator`, element: <PositionSizeCalculator /> },
        { path: `${base}pip-calculator`, element: <PipCalculator /> },
        { path: `${base}margin-calculator`, element: <MarginCalculator /> },
        { path: `${base}fibonacci-calculator`, element: <FibonacciCalculator /> },
        { path: `${base}pivot-point-calculator`, element: <PivotPointCalculator /> },
        { path: `${base}risk-of-ruin-calculator`, element: <RiskOfRuinCalculator /> },
        { path: `${base}compounding-calculator`, element: <CompoundingCalculator /> },
        { path: `${base}drawdown-calculator`, element: <DrawdownCalculator /> },
        { path: `${base}leverage-calculator`, element: <LeverageCalculator /> },
        { path: `${base}profit-calculator`, element: <ProfitCalculator /> },
        { path: `${base}rebate-calculator`, element: <RebateCalculator /> },
        { path: `${base}terms-and-condition`, element: <TermsConditions /> },
        { path: `${base}contactus`, element: <ContactUs /> },

        { path: `${base}about-us`, element: <AboutUs /> },
        { path: `${base}checkout`, element: <Checkout/> },
        { path: `${base}activation-coupons`, element: <ActivationCoupons /> },

        { path: `${base}instructor/:id`, element: <InstructorProfile /> },

        { path: `${base}instructors`, element: <InstructorsPage /> },

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
