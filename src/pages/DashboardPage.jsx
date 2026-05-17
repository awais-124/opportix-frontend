import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-nav">
        <div className="dashboard-logo">Opportix</div>
        <div className="dashboard-user">
          <span>{user.fullname}</span>
          <span className="dashboard-badge">{user.role}</span>
          <button className="auth-btn auth-btn-sm" onClick={signOut}>Sign Out</button>
        </div>
      </div>

      <div className="dashboard-body">
        <h1>Dashboard</h1>
        <p>Welcome, {user.fullname}! You are signed in as <strong>{user.role}</strong>.</p>

        <div className="dashboard-cards">
          <div className="dash-card">
            <h3>{user.role === "employer" ? "My Posted Jobs" : "Browse Jobs"}</h3>
            <p>{user.role === "employer" ? "Manage your job listings" : "Find your next opportunity"}</p>
          </div>
          <div className="dash-card">
            <h3>{user.role === "employer" ? "Applicants" : "My Applications"}</h3>
            <p>{user.role === "employer" ? "Review candidates" : "Track your applications"}</p>
          </div>
          <div className="dash-card">
            <h3>Profile</h3>
            <p>Manage your account settings</p>
          </div>
        </div>

        <div className="dashboard-info">
          <h3>Account Details</h3>
          <p><strong>User ID:</strong> {user.userId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
}
