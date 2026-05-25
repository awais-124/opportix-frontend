import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api, ApiError } from "../lib/api.js";
import JobForm from "../components/jobs/JobForm.jsx";
import styles from "./PostJobPage.module.css";

export default function PostJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
    api
      .get(`/jobs/${id}`)
      .then((data) => {
        if (data.postedBy !== user?.userId && user?.role !== "admin") {
          setNotFound(true);
          return;
        }
        setInitialData(data);
      })
      .catch((err) => {
        if (err.status === 404) setNotFound(true);
        else setError("Failed to load job data.");
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, user]);

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = { ...formData, category: Number(formData.category) };

      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }

      navigate("/employer/jobs");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to save job. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton}>
          <div className={`${styles.skel} ${styles.skelTitle}`} />
          <div className={`${styles.skel} ${styles.skelForm}`} />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <div className={styles.message}>
          <h2>Job Not Found</h2>
          <p>This job doesn't exist or you don't have permission to edit it.</p>
          <Link to="/employer/jobs" className={styles.link}>&larr; Back to My Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{isEdit ? "Edit Job" : "Post a New Job"}</h1>
          <p className={styles.subtitle}>
            {isEdit ? "Update your job listing details." : "Fill in the details to create a new job posting."}
          </p>
        </div>
        {isEdit && (
          <Link to={`/jobs/${id}`} className={styles.previewLink}>
            View Listing
          </Link>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <JobForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
