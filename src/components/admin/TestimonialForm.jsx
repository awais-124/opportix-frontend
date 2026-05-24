import { useState } from "react";
import styles from "./TestimonialForm.module.css";

export default function TestimonialForm({ initial, users, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(initial?.name || "");
  const [occupation, setOccupation] = useState(initial?.occupation || "");
  const [review, setReview] = useState(initial?.review || "");
  const [image, setImage] = useState(initial?.image || "");
  const [userId, setUserId] = useState(initial?.userId || "");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !review.trim()) {
      setError("Name and review are required");
      return;
    }
    setError("");
    onSubmit({
      name: name.trim(),
      occupation: occupation.trim(),
      review: review.trim(),
      image: image.trim(),
      userId: userId || null,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="test-name">Name *</label>
          <input id="test-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className={styles.field}>
          <label htmlFor="test-occupation">Occupation</label>
          <input id="test-occupation" type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="test-review">Review *</label>
        <textarea id="test-review" value={review} onChange={(e) => setReview(e.target.value)} rows={3} />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="test-image">Image URL</label>
          <input id="test-image" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>
        <div className={styles.field}>
          <label htmlFor="test-user">Linked User (optional)</label>
          <select id="test-user" value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">-- None --</option>
            {(users || []).map((u) => (
              <option key={u.userId} value={u.userId}>{u.fullname} ({u.email})</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update" : "Add Testimonial"}
        </button>
      </div>
    </form>
  );
}
