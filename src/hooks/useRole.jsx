import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const UseRole = () => {
  const { user, loading } = useAuth();
  console.log("from useRole", user);
  console.log("from useRole loading", loading);

  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!loading && user?.email) {
        setIsRoleLoading(true);
        try {
          const { data } = await axios.get(
            `/user/role?email=${user.email}`
          );
          console.log("from role have", data.role);
          setRole(data.role);
        } catch (error) {
          console.error("Error fetching role:", error);
        } finally {
          setIsRoleLoading(false);
        }
      } else if (!loading && !user) {
        // User logged out - reset role
        setRole(null);
        setIsRoleLoading(false);
      }
    };

    fetchRole();
  }, [loading, user]);

  return [role, isRoleLoading];
};

export default UseRole;
