import { Navigate } from "react-router";
import LoadingSpinner from "../Components/LoadingSpinner";
import UseRole from "../hooks/useRole";

const AssistantAdminRoute = ({ children }) => {
  const [role, isRoleLoading] = UseRole();

  if (isRoleLoading) return <LoadingSpinner />;
  if (role === "ASSISTANT_ADMIN") return children;
  return <Navigate replace="true" />;
};

export default AssistantAdminRoute;