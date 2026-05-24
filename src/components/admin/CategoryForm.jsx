import { useState } from "react";
import styles from "./CategoryForm.module.css";

export default function CategoryForm({ initial, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSubmit({ title: title.trim() });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="cat-title">Category Title</label>
        <input
          id="cat-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Technology"
          className={error ? styles.inputError : ""}
          autoFocus
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update" : "Add Category"}
        </button>
      </div>
    </form>
  );
}
