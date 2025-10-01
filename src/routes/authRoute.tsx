import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  // const check = Cookies.get("__er_urAccess");
  const check = true
  return check ? <Outlet /> : <Navigate to="/login" />;
};

export const  PublicRoute = () => {
  const check = true
  return check ? <Outlet /> : <Navigate to="/" />;
};

