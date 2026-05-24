import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ApplicantDashboardPage from "./ApplicantDashboardPage.jsx";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "employer":
      return <Navigate to="/employer" replace />;
    case "applicant":
      return <ApplicantDashboardPage />;
    default:
      return <Navigate to="/" replace />;
  }
}
