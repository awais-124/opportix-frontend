import { useState } from "react";
import styles from "./FeaturedJobSelector.module.css";

export default function FeaturedJobSelector({ jobs, onSubmit, onCancel, loading, existingJobIds }) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [error, setError] = useState("");

  const available = (jobs || []).filter((j) => !(existingJobIds || []).includes(j.id));

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedJobId) {
      setError("Please select a job");
      return;
    }
    setError("");
    onSubmit({ jobId: parseInt(selectedJobId) });
    setSelectedJobId("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="featured-job">Select Job to Feature</label>
        <select
          id="featured-job"
          value={selectedJobId}
          onChange={(e) => { setSelectedJobId(e.target.value); setError(""); }}
          className={error ? styles.selectError : ""}
        >
          <option value="">-- Select a job --</option>
          {available.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.companyName}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
        {available.length === 0 && (
          <p className={styles.hint}>All jobs are already featured or no jobs available.</p>
        )}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={loading || available.length === 0}>
          {loading ? "Adding..." : "Add Featured"}
        </button>
      </div>
    </form>
  );
}
