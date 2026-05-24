import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(false);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = "Current password is required";
    if (!form.newPassword) errs.newPassword = "New password is required";
    else if (form.newPassword.length < 8) errs.newPassword = "Must be at least 8 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.newPassword))
      errs.newPassword = "Must include uppercase, lowercase, number, and special character";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your new password";
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put(`/users/${user.userId}/password`, form);
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-body">
        <h1>Settings</h1>
        <p>Manage your account settings</p>

        {error && <div className="page-error">{error}</div>}
        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12,
            padding: "12px 16px", color: "#166534", fontSize: 14, marginBottom: 24,
          }}>
            Password updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="dashboard-info" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Change Password</h3>

          <div className="auth-field">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword" name="currentPassword" type="password"
              value={form.currentPassword} onChange={handleChange}
              className={fieldErrors.currentPassword ? "input-error" : ""}
            />
            {fieldErrors.currentPassword && (
              <span className="field-error">{fieldErrors.currentPassword}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword" name="newPassword" type="password"
              value={form.newPassword} onChange={handleChange}
              className={fieldErrors.newPassword ? "input-error" : ""}
            />
            {fieldErrors.newPassword && (
              <span className="field-error">{fieldErrors.newPassword}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password"
              value={form.confirmPassword} onChange={handleChange}
              className={fieldErrors.confirmPassword ? "input-error" : ""}
            />
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-btn auth-btn-sm" disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="dashboard-info">
          <h3 style={{ marginBottom: 12 }}>Account Actions</h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
            Need to manage your notification preferences or deactivate your account? These features are coming soon.
          </p>
          <button className="auth-btn auth-btn-sm auth-btn-danger" disabled style={{ opacity: 0.5 }}>
            Delete Account (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
