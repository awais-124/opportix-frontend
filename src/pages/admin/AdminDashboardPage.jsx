import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import StatsGrid from "../../components/admin/StatsGrid.jsx";
import styles from "./AdminDashboardPage.module.css";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, usersData] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users", { page: 1, limit: 5 }),
        ]);
        setStats(statsData);
        setRecentUsers(usersData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) return <div className="page-error">{error}</div>;

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: "users", color: "#6366f1" },
        { label: "Active Jobs", value: stats.activeJobs, icon: "briefcase", color: "#10b981" },
        { label: "Categories", value: stats.totalCategories, icon: "grid", color: "#f59e0b" },
        { label: "Applications", value: stats.totalApplications, icon: "file-text", color: "#ef4444" },
        { label: "Featured Jobs", value: stats.totalFeaturedJobs, icon: "star", color: "#8b5cf6" },
        { label: "Testimonials", value: stats.totalTestimonials, icon: "message", color: "#06b6d4" },
      ]
    : [];

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your platform</p>
      </div>

      <StatsGrid stats={statCards} loading={loading} />

      <div className={styles.quickLinks}>
        <h3>Quick Links</h3>
        <div className={styles.links}>
          <Link to="/admin/users" className={styles.link}>Manage Users</Link>
          <Link to="/admin/jobs" className={styles.link}>Manage Jobs</Link>
          <Link to="/admin/categories" className={styles.link}>Categories</Link>
          <Link to="/admin/featured-jobs" className={styles.link}>Featured Jobs</Link>
          <Link to="/admin/applicants" className={styles.link}>Applicants</Link>
          <Link to="/admin/testimonials" className={styles.link}>Testimonials</Link>
          <Link to="/admin/create-admin" className={styles.link}>Create Admin</Link>
        </div>
      </div>

      <div className={styles.recentSection}>
        <h3>Recent Users</h3>
        {loading ? (
          <div className="page-loading">Loading...</div>
        ) : recentUsers.length === 0 ? (
          <div className="page-empty"><p>No users yet</p></div>
        ) : (
          <div className={styles.recentList}>
            {recentUsers.map((u) => (
              <div key={u.userId} className={styles.recentItem}>
                <span className={styles.recentName}>{u.fullname}</span>
                <span className={styles.recentEmail}>{u.email}</span>
                <span className={styles.recentRole}>{u.role}</span>
                <span className={styles.recentDate}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
