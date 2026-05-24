import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import QuickStats from "../components/dashboard/QuickStats.jsx";
import RecentActivity from "../components/dashboard/RecentActivity.jsx";
import styles from "./ApplicantDashboardPage.module.css";

export default function ApplicantDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;

    api
      .get(`/users/${user.userId}/applications`)
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const stats = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      value: applications.length,
      label: "Total Applications",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      value: applications.filter((a) => a.status === "new" || a.status === "reviewed").length,
      label: "Active Applications",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      value: applications.filter((a) => a.status === "shortlisted").length,
      label: "Shortlisted",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      value: applications.filter((a) => a.status === "saved").length,
      label: "Saved",
    },
  ];

  const hasApplications = applications.length > 0;
  const profileComplete = user?.phone && user?.fullname;

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          Welcome back, <span className={styles.welcomeName}>{user?.fullname}</span>!
        </h1>
        <p className={styles.welcomeSub}>
          Here&apos;s an overview of your job applications.
        </p>
      </div>

      <QuickStats stats={stats} loading={loading} />

      {error && !loading && (
        <div className={styles.errorBanner}>
          Could not load your applications. Please try again later.
        </div>
      )}

      {loading ? (
        <RecentActivity loading />
      ) : hasApplications ? (
        <RecentActivity items={applications} />
      ) : (
        !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>No applications yet</h3>
            <p>You haven&apos;t applied to any jobs yet. Start browsing opportunities!</p>
            <Link to="/jobs" className={styles.ctaBtn}>Browse Jobs</Link>
          </div>
        )
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.quickActions}>
          <Link to="/jobs" className={styles.actionCard}>
            <span className={styles.actionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <span className={styles.actionLabel}>Browse Jobs</span>
          </Link>
          {hasApplications && (
            <Link to="/applications" className={styles.actionCard}>
              <span className={styles.actionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </span>
              <span className={styles.actionLabel}>View All Applications</span>
            </Link>
          )}
          {!profileComplete && (
            <Link to="/profile" className={`${styles.actionCard} ${styles.actionCardWarn}`}>
              <span className={styles.actionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className={styles.actionLabel}>Complete Profile</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
