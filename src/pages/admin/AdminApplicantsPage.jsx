import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import styles from "./AdminApplicantsPage.module.css";

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/admin/applicants", params);
      setApplicants(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/applicants/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchApplicants();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: "user",
      label: "Name",
      render: (val) => val?.fullname || "-",
    },
    {
      key: "user",
      label: "Email",
      render: (val) => val?.email || "-",
    },
    {
      key: "user",
      label: "Phone",
      render: (val) => val?.phone || "-",
    },
    {
      key: "job",
      label: "Job Title",
      render: (val) => val?.title || "-",
    },
    {
      key: "experience",
      label: "Experience",
      render: (val) => `${val} yr${val !== 1 ? "s" : ""}`,
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`${styles.statusBadge} ${styles[val]}`}>{val}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <button className={styles.deleteBtn} onClick={() => setDeleteTarget(row)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Applicants</h1>
        <p>Monitor all job applications</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email..."
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
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={applicants}
        loading={loading}
        emptyMessage="No applicants found"
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Application"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.user?.fullname}'s application for "${deleteTarget.job?.title}"?`
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
