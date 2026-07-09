import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";

export default function PrivateRoutes({ allowedRoles = [] }) {
  const { auth, isInitialized } = useAuth();

  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  const currentUser = auth.user || auth.vendor || auth.admin;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
