import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import StatsCard from "../components/employer/StatsCard.jsx";
import RecentApplicantsWidget from "../components/employer/RecentApplicantsWidget.jsx";
import StatusBadge from "../components/applications/StatusBadge.jsx";
import styles from "./EmployerDashboardPage.module.css";

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      api.get(`/users/${user.userId}/jobs`),
      api.get(`/users/${user.userId}/applicants`),
    ])
      .then(([jobsData, applicantsData]) => {
        const jobList = jobsData?.data ?? jobsData ?? [];
        const appList = applicantsData?.data ?? applicantsData ?? [];
        setJobs(Array.isArray(jobList) ? jobList : []);
        setApplicants(Array.isArray(appList) ? appList : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const activeJobs = jobs.filter((j) => j.status === "active");
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j._count?.applicants ?? j.numberOfApplicants ?? 0),
    0
  );
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const closingSoon = activeJobs.filter(
    (j) => new Date(j.datePosted || j.createdAt) < thirtyDaysAgo
  );
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
  const newThisWeek = applicants.filter(
    (a) => new Date(a.createdAt) > oneWeekAgo
  );

  const recentJobs = jobs.slice(0, 5);
  const hasJobs = jobs.length > 0;
  const hasApplicants = applicants.length > 0;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h3>Failed to load dashboard</h3>
          <p>Could not fetch your data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          Welcome back, <span className={styles.welcomeName}>{user?.fullname}</span>!
        </h1>
        <p className={styles.welcomeSub}>Here&apos;s an overview of your job postings.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatsCard
          title="Active Jobs"
          value={activeJobs.length}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
          color="#6366f1"
          loading={loading}
        />
        <StatsCard
          title="Total Applicants"
          value={totalApplicants}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          color="#3B82F6"
          loading={loading}
        />
        <StatsCard
          title="Closing Soon"
          value={closingSoon.length}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          color="#F59E0B"
          loading={loading}
          trend={closingSoon.length > 0 ? `Review ${closingSoon.length} old posting${closingSoon.length === 1 ? "" : "s"}` : undefined}
        />
        <StatsCard
          title="New This Week"
          value={newThisWeek.length}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          color="#10B981"
          loading={loading}
        />
      </div>

      <div className={styles.quickActions}>
        <Link to="/employer/post-job" className={styles.actionBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post a New Job
        </Link>
        <Link to="/employer/jobs" className={styles.actionBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          View All Jobs
        </Link>
        <Link to="/employer/applicants" className={styles.actionBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          View Applicants
        </Link>
      </div>

      <div className={styles.widgets}>
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>Recent Jobs</h3>
            {hasJobs && <Link to="/employer/jobs" className={styles.widgetLink}>View All</Link>}
          </div>

          {loading ? (
            <div className={styles.skeletonList}>
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.skeletonRow}>
                  <div className={`${styles.skel} ${styles.skelJobTitle}`} />
                  <div className={`${styles.skel} ${styles.skelJobMeta}`} />
                </div>
              ))}
            </div>
          ) : !hasJobs ? (
            <div className={styles.emptyState}>
              <p>You haven&apos;t posted any jobs yet.</p>
              <Link to="/employer/post-job" className={styles.emptyCta}>Post Your First Job</Link>
            </div>
          ) : (
            <div className={styles.jobList}>
              {recentJobs.map((job) => (
                <div key={job.id} className={styles.jobRow}>
                  <div className={styles.jobInfo}>
                    <span className={styles.jobRowTitle}>{job.title}</span>
                    <span className={styles.jobRowMeta}>
                      {job._count?.applicants ?? job.numberOfApplicants ?? 0} applicant{(job._count?.applicants ?? job.numberOfApplicants ?? 0) === 1 ? "" : "s"}
                      {" · "}
                      {relativeDate(job.datePosted || job.createdAt)}
                    </span>
                  </div>
                  <span className={`${styles.statusDot} ${job.status === "active" ? styles.statusActive : styles.statusClosed}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <RecentApplicantsWidget
          applicants={hasApplicants ? applicants : []}
          loading={loading}
        />
      </div>
    </div>
  );
}

function relativeDate(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return "";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
