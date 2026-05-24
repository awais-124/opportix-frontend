import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api, ApiError } from "../lib/api.js";
import styles from "./ManageJobsPage.module.css";

export default function ManageJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("active");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;
    setLoading(true);
    setError(null);

    api
      .get(`/users/${user.userId}/jobs`)
      .then((data) => {
        const list = data?.data ?? data ?? [];
        setJobs(Array.isArray(list) ? list : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const filteredJobs = tab === "active" ? jobs.filter((j) => j.status === "active") : jobs;

  async function toggleStatus(job) {
    setActionError(null);
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      const updated = await api.put(`/jobs/${job.id}`, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...updated } : j)));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update job status.");
    }
  }

  async function handleDelete(jobId) {
    setActionError(null);
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setConfirmDelete(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to delete job.");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Jobs</h1>
          <p className={styles.subtitle}>
            {loading ? "Loading..." : `${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link to="/employer/post-job" className={styles.postBtn}>
          + Post a Job
        </Link>
      </div>

      {actionError && <div className={styles.actionError}>{actionError}</div>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "active" ? styles.tabActive : ""}`}
          onClick={() => setTab("active")}
        >
          Active
        </button>
        <button
          className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`}
          onClick={() => setTab("all")}
        >
          All Jobs
        </button>
      </div>

      {loading && (
        <div className={styles.skeletonList}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.skeletonRow}>
              <div className={`${styles.skel} ${styles.skelJobTitle}`} />
              <div className={`${styles.skel} ${styles.skelJobMeta}`} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          Failed to load jobs. Please try again later.
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className={styles.empty}>
          <h3>{tab === "active" ? "No active jobs" : "No jobs yet"}</h3>
          <p>
            {tab === "active"
              ? "You don't have any active job postings."
              : "You haven't posted any jobs yet."}
          </p>
          <Link to="/employer/post-job" className={styles.emptyCta}>
            Post Your First Job
          </Link>
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.colTitle}>Job Title</span>
            <span className={styles.colCategory}>Category</span>
            <span className={styles.colApplicants}>Applicants</span>
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colDate}>Posted</span>
            <span className={styles.colActions}>Actions</span>
          </div>
          {filteredJobs.map((job) => (
            <div key={job.id} className={styles.tableRow}>
              <span className={styles.colTitle}>
                <Link to={`/jobs/${job.id}`} className={styles.jobLink}>
                  {job.title}
                </Link>
              </span>
              <span className={styles.colCategory}>
                {job.categoryRef?.title || `Category ${job.category}`}
              </span>
              <span className={styles.colApplicants}>
                {job._count?.applicants ?? job.numberOfApplicants ?? 0}
              </span>
              <span className={styles.colStatus}>
                <span className={`${styles.statusDot} ${job.status === "active" ? styles.statusActive : styles.statusClosed}`} />
                {job.status === "active" ? "Active" : "Closed"}
              </span>
              <span className={styles.colDate}>
                {formatDate(job.datePosted || job.createdAt)}
              </span>
              <span className={styles.colActions}>
                <Link to={`/employer/jobs/${job.id}/edit`} className={styles.actionLink}>
                  Edit
                </Link>
                <button
                  className={styles.actionBtn}
                  onClick={() => toggleStatus(job)}
                >
                  {job.status === "active" ? "Close" : "Reopen"}
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.actionDelete}`}
                  onClick={() => setConfirmDelete(job.id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Job?</h3>
            <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={() => handleDelete(confirmDelete)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
