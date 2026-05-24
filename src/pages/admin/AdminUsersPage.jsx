import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import styles from "./AdminUsersPage.module.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get("/admin/users", params);
      setUsers(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteTarget.userId}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  const columns = [
    { key: "username", label: "Username", sortable: true },
    { key: "fullname", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "role",
      label: "Role",
      render: (val) => (
        <span className={`${styles.roleBadge} ${styles[val]}`}>{val}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          className={styles.deleteBtn}
          onClick={() => setDeleteTarget(row)}
          title="Delete user"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage all platform users</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className={styles.filterSelect}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="employer">Employer</option>
          <option value="applicant">Applicant</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.fullname}? This will also remove all their jobs and applications.`
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
