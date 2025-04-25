import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const token = localStorage.getItem(requireAdmin ? "adminToken" : "userToken");
  const user = JSON.parse(
    localStorage.getItem(requireAdmin ? "adminUser" : "userUser") || "{}"
  );

  if (!token) {
    // Redirect to appropriate login page but save the attempted location
    return (
      <Navigate
        to={requireAdmin ? "/admin/login" : "/user/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requireAdmin && !user.isAdmin) {
    // If admin route but user is not an admin, redirect to user dashboard
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return <Navigate to="/user/books" replace />;
  }

  return children;
}
