import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any <Route> tree that should only be reachable while logged in.
 * Renders the nested routes when a user is present; otherwise redirects to
 * /login and remembers the page that was requested (via location state) so
 * Login can send the person back where they meant to go.
 */
export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
