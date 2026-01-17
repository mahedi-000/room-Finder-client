import { Navigate } from "react-router";
import LoadingSpinner from "../Components/LoadingSpinner";
import UseRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const [role, isRoleLoading] = UseRole();

  if (isRoleLoading) return <LoadingSpinner />;
  if (role === "ADMIN") return children;
  return <Navigate to="/" replace={true} />;
};

export default AdminRoute;