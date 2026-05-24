import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import JobListingPage from "./pages/JobListingPage.jsx";
import JobDetailPage from "./pages/JobDetailPage.jsx";
import JobApplicationPage from "./pages/JobApplicationPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import MyApplicationsPage from "./pages/MyApplicationsPage.jsx";
import EmployerDashboardPage from "./pages/EmployerDashboardPage.jsx";
import PostJobPage from "./pages/PostJobPage.jsx";
import ManageJobsPage from "./pages/ManageJobsPage.jsx";

import AuthLayout from "./components/layout/AuthLayout.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import EmployerLayout from "./components/layout/EmployerLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminJobsPage from "./pages/admin/AdminJobsPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";
import AdminFeaturedJobsPage from "./pages/admin/AdminFeaturedJobsPage.jsx";
import AdminApplicantsPage from "./pages/admin/AdminApplicantsPage.jsx";
import AdminTestimonialsPage from "./pages/admin/AdminTestimonialsPage.jsx";
import AdminCreateAdminPage from "./pages/admin/AdminCreateAdminPage.jsx";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-page"><div className="auth-card"><p>Loading...</p></div></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Auth (public, no nav/footer) */}
      <Route element={<AuthLayout />}>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Main app - public + applicant routes with navbar/footer */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Protected routes - need auth */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/jobs/:id/apply" element={<JobApplicationPage />} />
      </Route>

      {/* Employer routes */}
      <Route element={<ProtectedRoute allowedRoles={["employer"]}><EmployerLayout /></ProtectedRoute>}>
        <Route path="/employer" element={<EmployerDashboardPage />} />
        <Route path="/employer/post-job" element={<PostJobPage />} />
        <Route path="/employer/jobs" element={<ManageJobsPage />} />
        <Route path="/employer/jobs/:id/edit" element={<PostJobPage />} />
        <Route path="/employer/applicants" element={<div>Employer applicants coming soon</div>} />
        <Route path="/employer/reports" element={<div>Employer reports coming soon</div>} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/jobs" element={<AdminJobsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/featured-jobs" element={<AdminFeaturedJobsPage />} />
        <Route path="/admin/applicants" element={<AdminApplicantsPage />} />
        <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
        <Route path="/admin/create-admin" element={<AdminCreateAdminPage />} />
        <Route path="/admin/reports" element={<div>Admin reports coming soon</div>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
