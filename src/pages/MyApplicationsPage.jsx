import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import ApplicationCard from "../components/applications/ApplicationCard.jsx";
import styles from "./MyApplicationsPage.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);
    setError(null);

    api
      .get(`/users/${user.userId}/applications`)
      .then((data) => {
        const list = data?.data ?? data ?? [];
        setApplications(Array.isArray(list) ? list : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const filtered = statusFilter
    ? applications.filter((a) => a.status === statusFilter)
    : applications;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Applications</h1>
          <p className={styles.subtitle}>
            {loading ? "Loading..." : `${filtered.length} application${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.filterBtn} ${statusFilter === opt.value ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.skeletonList}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.skeletonCard}>
              <div className={`${styles.skel} ${styles.skelTitle}`} />
              <div className={`${styles.skel} ${styles.skelMeta}`} />
              <div className={`${styles.skel} ${styles.skelActions}`} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          Failed to load applications. Please try again later.
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3>
            {statusFilter
              ? `No ${statusFilter} applications`
              : "No applications yet"}
          </h3>
          <p>
            {statusFilter
              ? `You don't have any applications with status "${statusFilter}".`
              : "You haven't applied to any jobs yet. Start browsing!"}
          </p>
          <Link to="/jobs" className={styles.cta}>
            Browse Jobs
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.list}>
          {filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
