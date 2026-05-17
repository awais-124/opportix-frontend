import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-page"><div className="auth-card"><p>Loading...</p></div></div>;
  return user ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-page"><div className="auth-card"><p>Loading...</p></div></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
