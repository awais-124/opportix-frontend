import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import TestimonialForm from "../../components/admin/TestimonialForm.jsx";
import styles from "./AdminTestimonialsPage.module.css";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [testimonialsData, usersData] = await Promise.all([
        api.get("/testimonials"),
        api.get("/users"),
      ]);
      setTestimonials(testimonialsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreateOrUpdate(formData) {
    setFormLoading(true);
    try {
      if (editTarget) {
        await api.put(`/admin/testimonials/${editTarget.id}`, formData);
      } else {
        await api.post("/admin/testimonials", formData);
      }
      setShowForm(false);
      setEditTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(test) {
    setEditTarget(test);
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
      await api.delete(`/admin/testimonials/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "occupation", label: "Occupation" },
    {
      key: "review",
      label: "Review",
      render: (val) =>
        val?.length > 80 ? `${val.substring(0, 80)}...` : val || "-",
    },
    {
      key: "user",
      label: "Linked User",
      render: (val) => val?.fullname || "-",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (val) => new Date(val).toLocaleDateString(),
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
        <h1>Testimonials</h1>
        <p>Manage user testimonials and reviews</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      {!showForm ? (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + Add Testimonial
        </button>
      ) : (
        <div className={styles.formWrap}>
          <TestimonialForm
            initial={editTarget}
            users={users}
            onSubmit={handleCreateOrUpdate}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        </div>
      )}

      <AdminTable
        columns={columns}
        data={testimonials}
        loading={loading}
        emptyMessage="No testimonials yet"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Testimonial"
        message={
          deleteTarget
            ? `Delete testimonial from ${deleteTarget.name}?`
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
