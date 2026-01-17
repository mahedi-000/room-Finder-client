import { Navigate } from "react-router";
import LoadingSpinner from "../Components/LoadingSpinner";
import UseRole from "../hooks/useRole";

const TeacherRoute = ({ children }) => {
  const [role, isRoleLoading] = UseRole();

  if (isRoleLoading) return <LoadingSpinner />;
  if (role === "TEACHER") return children;
  return <Navigate replace="true" />;
};

export default TeacherRoute;