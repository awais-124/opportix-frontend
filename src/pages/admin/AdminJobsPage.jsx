import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import styles from "./AdminJobsPage.module.css";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/admin/jobs", params);
      setJobs(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleToggleStatus(job) {
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      await api.patch(`/admin/jobs/${job.id}/status`, { status: newStatus });
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/jobs/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "companyName", label: "Company" },
    {
      key: "categoryRef",
      label: "Category",
      render: (val) => val?.title || "-",
    },
    {
      key: "postedByUser",
      label: "Posted By",
      render: (val) => val?.fullname || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`${styles.statusBadge} ${styles[val]}`}>{val}</span>
      ),
    },
    {
      key: "_count",
      label: "Applicants",
      render: (val) => val?.applicants ?? 0,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className={styles.actionGroup}>
          <button
            className={`${styles.toggleBtn} ${row.status === "active" ? styles.closeBtn : styles.activateBtn}`}
            onClick={() => handleToggleStatus(row)}
          >
            {row.status === "active" ? "Close" : "Activate"}
          </button>
          <button className={styles.deleteBtn} onClick={() => setDeleteTarget(row)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Jobs</h1>
        <p>Moderate all job listings</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className={styles.filterSelect}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={jobs}
        loading={loading}
        emptyMessage="No jobs found"
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Job"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}" at ${deleteTarget.companyName}? This cannot be undone.`
            : ""
        }
        variant="danger"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
