import { Navigate } from "react-router-dom";
import { getUser } from "../utils/tokenUtils";

const base = import.meta.env.VITE_BASE;

const ProtectedPage = ({ children, condition }) => {
const isUser = getUser();

  // console.log(isUser);
  // console.log("ProtectedPage rendered with condition:", children);
  if (!isUser) {
    return <Navigate to={base} replace />;
  }
  return children;
};

export default ProtectedPage;
