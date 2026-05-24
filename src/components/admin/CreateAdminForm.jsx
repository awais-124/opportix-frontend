import { useState } from "react";
import styles from "./CreateAdminForm.module.css";

export default function CreateAdminForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ fullname: "", username: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullname.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
      setError("All fields except phone are required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    onSubmit(form);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.heading}>Create New Admin</h3>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="ca-fullname">Full Name *</label>
          <input id="ca-fullname" name="fullname" value={form.fullname} onChange={handleChange} autoFocus />
        </div>
        <div className={styles.field}>
          <label htmlFor="ca-username">Username *</label>
          <input id="ca-username" name="username" value={form.username} onChange={handleChange} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="ca-email">Email *</label>
          <input id="ca-email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label htmlFor="ca-phone">Phone</label>
          <input id="ca-phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="ca-password">Password *</label>
        <input id="ca-password" name="password" type="password" value={form.password} onChange={handleChange} />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>
    </form>
  );
}
