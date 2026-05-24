import { useState } from "react";
import { api } from "../../lib/api.js";
import CreateAdminForm from "../../components/admin/CreateAdminForm.jsx";

export default function AdminCreateAdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleCreate(formData) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post("/admin/create-admin", formData);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Create Admin</h1>
        <p>Add a new administrator account</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      {result ? (
        <div style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "12px",
          padding: "24px",
          color: "#166534",
          fontSize: "14px",
          lineHeight: 1.6,
        }}>
          <strong>Admin created successfully!</strong>
          <br />
          Name: {result.fullname}
          <br />
          Email: {result.email}
          <br />
          Role: {result.role}
        </div>
      ) : (
        <CreateAdminForm onSubmit={handleCreate} loading={loading} />
      )}
    </div>
  );
}
