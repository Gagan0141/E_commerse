import React from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./Auth";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const { auth } = useAuth();

  const location = useLocation();

  // Determine expected role from route
  const getExpectedRole = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/vendor")) return "vendor";
    if (location.pathname.startsWith("/user")) return "user";
    return null;
  };

  const expectedRole = getExpectedRole();

  // If no expected role, find first authenticated user
  const fallbackUser = auth.admin || auth.vendor || auth.user;

  const activeUser = expectedRole ? auth[expectedRole] : fallbackUser;

  const currentUser = activeUser || fallbackUser;

  if (!currentUser) {
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

  const userRole = currentUser.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
