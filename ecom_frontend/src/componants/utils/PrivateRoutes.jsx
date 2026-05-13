import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../utils/Auth";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const { user, users, loading, switchRole } = useAuth();
  const location = useLocation();

  const availableAllowedRole = allowedRoles.find((role) => users[role]);

  useEffect(() => {
    if (
      allowedRoles.length > 0 &&
      user &&
      !allowedRoles.includes(user.role) &&
      availableAllowedRole
    ) {
      switchRole(availableAllowedRole);
    }
  }, [allowedRoles, availableAllowedRole, switchRole, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (availableAllowedRole) {
      return <div>Loading...</div>;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
