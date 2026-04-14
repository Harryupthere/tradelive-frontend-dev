import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/tokenUtils";

const base = import.meta.env.VITE_BASE;
export const PrivateRoute = () => {
const isUser = getUser();

  // const check = Cookies.get("__er_urAccess");
  const check = isUser
  return check ? <Outlet /> : <Navigate to="/login" />;
};

export const  PublicRoute = () => {
  const check = true
  return check ? <Outlet /> : <Navigate to="/" />;
};

