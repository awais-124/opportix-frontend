import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import { updateProfileSchema } from "../lib/auth.schema.js";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    username: user?.username || "",
    phone: user?.phone || "",
    linkedIn: user?.linkedIn || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    setSuccess(false);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const result = updateProfileSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0]] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      await updateProfile(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({
      fullname: user?.fullname || "",
      username: user?.username || "",
      phone: user?.phone || "",
      linkedIn: user?.linkedIn || "",
    });
    setErrors({});
    setSuccess(false);
    setError(null);
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-body">
        <h1>Profile</h1>
        <p>Manage your personal information</p>

        {error && <div className="page-error">{error}</div>}
        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12,
            padding: "12px 16px", color: "#166534", fontSize: 14, marginBottom: 24,
          }}>
            Profile updated successfully
          </div>
        )}

        <div className="dashboard-info" style={{ marginBottom: 24 }}>
          <h3>Account Information</h3>
          <p><strong>Email:</strong> {user?.email} <span style={{ color: "#22c55e", fontSize: 12 }}>Verified</span></p>
          <p><strong>Role:</strong> <span className="dashboard-badge">{user?.role}</span></p>
          <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</p>
        </div>

        <form onSubmit={handleSubmit} className="dashboard-info">
          <h3 style={{ marginBottom: 20 }}>Personal Information</h3>

          <div className="auth-field">
            <label htmlFor="fullname">Full Name</label>
            <input
              id="fullname" name="fullname" value={form.fullname}
              onChange={handleChange} className={errors.fullname ? "input-error" : ""}
            />
            {errors.fullname && <span className="field-error">{errors.fullname}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username" name="username" value={form.username}
              onChange={handleChange} className={errors.username ? "input-error" : ""}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone" name="phone" value={form.phone}
              onChange={handleChange} className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="linkedIn">LinkedIn URL</label>
            <input
              id="linkedIn" name="linkedIn" value={form.linkedIn}
              onChange={handleChange} placeholder="https://linkedin.com/in/..."
              className={errors.linkedIn ? "input-error" : ""}
            />
            {errors.linkedIn && <span className="field-error">{errors.linkedIn}</span>}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" className="auth-btn auth-btn-sm" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="auth-btn auth-btn-sm auth-btn-danger" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
