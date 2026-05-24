import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext.jsx";
import { api, ApiError } from "../lib/api.js";
import { uploadCV } from "../lib/upload.js";
import styles from "./JobApplicationPage.module.css";

const applicationSchema = z.object({
  experience: z
    .string()
    .min(1, "Experience is required")
    .transform((v) => Number(v))
    .pipe(z.number().min(0, "Experience must be 0 or more")),
  joiningDate: z.string().optional(),
  coverLetter: z
    .string()
    .max(2000, "Cover letter must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export default function JobApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingApp, setExistingApp] = useState(null);
  const [jobError, setJobError] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: { experience: "", joiningDate: "", coverLetter: "" },
  });

  const coverText = watch("coverLetter") || "";

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setJobError(null);

    Promise.all([
      api.get(`/jobs/${id}`),
      api.get(`/applicants?userId=${user.userId}&jobId=${id}`),
    ])
      .then(([jobData, appData]) => {
        setJob(jobData);
        const apps = appData?.data ?? appData ?? [];
        if (Array.isArray(apps) && apps.length > 0) {
          setExistingApp(apps[0]);
        }
      })
      .catch((err) => {
        if (err.status === 404) setJobError("not-found");
        else setJobError("error");
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setCvError(null);

    if (!file) {
      setCvFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setCvError("Only PDF files are accepted");
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCvError("File size must be less than 5MB");
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setCvFile(file);
  }

  async function onSubmit(data) {
    if (!cvFile) {
      setCvError("CV is required");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const uploadResult = await uploadCV(cvFile);
      const cvUrl = uploadResult?.url;

      if (!cvUrl) throw new Error("CV upload returned no URL");

      await api.post("/applicants", {
        userId: user.userId,
        jobId: Number(id),
        cv: cvUrl,
        experience: Number(data.experience),
        joiningDate: data.joiningDate || null,
        coverLetter: data.coverLetter || null,
      });

      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : err.message || "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton}>
          <div className={`${styles.skel} ${styles.skelBack}`} />
          <div className={`${styles.skel} ${styles.skelTitle}`} />
          <div className={`${styles.skel} ${styles.skelBlock}`} />
        </div>
      </div>
    );
  }

  if (jobError === "not-found") {
    return (
      <div className={styles.page}>
        <div className={styles.messageBlock}>
          <h2>Job Not Found</h2>
          <p>This job doesn&apos;t exist or has been removed.</p>
          <Link to="/jobs" className={styles.btn}>&larr; Back to Jobs</Link>
        </div>
      </div>
    );
  }

  if (jobError === "error") {
    return (
      <div className={styles.page}>
        <div className={styles.messageBlock}>
          <h2>Something went wrong</h2>
          <p>Could not load job details. Please try again later.</p>
          <Link to="/jobs" className={styles.btn}>&larr; Back to Jobs</Link>
        </div>
      </div>
    );
  }

  if (job?.status === "closed") {
    return (
      <div className={styles.page}>
        <div className={styles.messageBlock}>
          <h2>Job is no longer accepting applications</h2>
          <p>This position has been closed.</p>
          <Link to="/jobs" className={styles.btn}>&larr; Browse Jobs</Link>
        </div>
      </div>
    );
  }

  if (existingApp) {
    return (
      <div className={styles.page}>
        <div className={styles.messageBlock}>
          <h2>You already applied</h2>
          <p>You have already submitted an application for <strong>{job?.title}</strong> at <strong>{job?.companyName}</strong>.</p>
          <p className={styles.statusText}>Current status: <strong>{existingApp.status}</strong></p>
          <div className={styles.messageActions}>
            <Link to={`/jobs/${id}`} className={styles.btnSecondary}>View Job Details</Link>
            <Link to="/applications" className={styles.btn}>View My Applications</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.messageBlock}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Application Submitted!</h2>
          <p>Your application for <strong>{job?.title}</strong> at <strong>{job?.companyName}</strong> has been received.</p>
          <div className={styles.messageActions}>
            <Link to="/applications" className={styles.btn}>View My Applications</Link>
            <Link to="/jobs" className={styles.btnSecondary}>Browse More Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to={`/jobs/${id}`} className={styles.backLink}>
        &larr; Back to Job Details
      </Link>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Apply for this Job</h1>
          <p className={styles.formSub}>
            {job?.title} &middot; {job?.companyName}
          </p>
        </div>

        {submitError && (
          <div className={styles.errorBanner}>{submitError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>CV / Resume <span className={styles.required}>*</span></label>
            <div
              className={`${styles.dropZone} ${cvError ? styles.dropZoneError : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              {cvFile ? (
                <div className={styles.fileSelected}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>{cvFile.name}</span>
                  <button
                    type="button"
                    className={styles.removeFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCvFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={styles.dropPlaceholder}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p>Drop your PDF here or click to browse</p>
                  <span className={styles.dropHint}>PDF only, max 5MB</span>
                </div>
              )}
            </div>
            {cvError && <span className={styles.fieldError}>{cvError}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Years of Experience <span className={styles.required}>*</span></label>
            <input
              type="number"
              min="0"
              step="1"
              className={`${styles.input} ${errors.experience ? styles.inputError : ""}`}
              {...register("experience")}
            />
            {errors.experience && (
              <span className={styles.fieldError}>{errors.experience.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Earliest Joining Date</label>
            <input
              type="date"
              className={styles.input}
              {...register("joiningDate")}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cover Letter</label>
            <textarea
              className={`${styles.textarea} ${errors.coverLetter ? styles.inputError : ""}`}
              rows="5"
              placeholder="Tell the employer why you're a great fit..."
              {...register("coverLetter")}
            />
            <div className={styles.charCounter}>
              <span className={coverText.length > 2000 ? styles.charOver : ""}>
                {coverText.length}
              </span>
              /2000
            </div>
            {errors.coverLetter && (
              <span className={styles.fieldError}>{errors.coverLetter.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
