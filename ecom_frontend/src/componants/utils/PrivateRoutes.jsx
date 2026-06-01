import React from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./Auth";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const { auth, isInitialized } = useAuth();

  const location = useLocation();

  // Wait for auth to initialize
  if (!isInitialized) {
    return null;
  }

  // Determine expected role from route
  const getExpectedRole = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/vendor")) return "vendor";
    if (location.pathname.startsWith("/user")) return "user";
    return null;
  };

  const expectedRole = getExpectedRole();

  // Get the user for the expected role, or fallback to first authenticated user
  const activeUser = expectedRole 
    ? auth[expectedRole] 
    : (auth.admin || auth.vendor || auth.user);

  if (!activeUser || !activeUser.id) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Normalize role comparison to uppercase
  const userRole = activeUser.role?.toUpperCase() || "";
  const normalizedAllowedRoles = allowedRoles.map(r => typeof r === 'string' ? r.toUpperCase() : r);

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole.toUpperCase())) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
