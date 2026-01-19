import { Navigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;

const ProtectedPage = ({ children, condition }) => {
  if (!condition) {
    return <Navigate to={base} replace />;
  }
  return children;
};

export default ProtectedPage;
