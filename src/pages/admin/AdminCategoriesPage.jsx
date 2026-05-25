import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import CategoryForm from "../../components/admin/CategoryForm.jsx";
import styles from "./AdminCategoriesPage.module.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleCreateOrUpdate(formData) {
    setFormLoading(true);
    try {
      if (editTarget) {
        await api.put(`/admin/categories/${editTarget.id}`, formData);
      } else {
        await api.post("/admin/categories", formData);
      }
      setShowForm(false);
      setEditTarget(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(cat) {
    setEditTarget(cat);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/categories/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "_count",
      label: "Job Count",
      render: (val) => val?.jobs ?? 0,
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className={styles.actionGroup}>
          <button className={styles.editBtn} onClick={() => handleEdit(row)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => setDeleteTarget(row)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Categories</h1>
        <p>Manage job categories</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      {!showForm ? (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + Add Category
        </button>
      ) : (
        <CategoryForm
          initial={editTarget}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCancelForm}
          loading={formLoading}
        />
      )}

      <AdminTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories found"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.title}"? ${
                (deleteTarget._count?.jobs || 0) > 0
                  ? `This category has ${deleteTarget._count.jobs} job(s). They will also be deleted.`
                  : ""
              }`
            : ""
        }
        variant={deleteTarget?._count?.jobs > 0 ? "warning" : "danger"}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
