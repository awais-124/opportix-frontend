import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import styles from "./JobDetailPage.module.css";

const TYPE_LABELS = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

const DURATION_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const EXP_LABELS = {
  entry: "Entry Level",
  mid: "Mid-level",
  senior: "Senior",
  expert: "Expert",
};

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    api
      .get(`/jobs/${id}`)
      .then((data) => setJob(data))
      .catch((err) => {
        if (err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader}>
          <div className={`${styles.skeleton} ${styles.skelBack}`} />
          <div className={`${styles.skeleton} ${styles.skelTitle}`} />
          <div className={`${styles.skeleton} ${styles.skelCompany}`} />
        </div>
        <div className={styles.skeletonBody}>
          <div className={`${styles.skeleton} ${styles.skelRow}`} />
          <div className={`${styles.skeleton} ${styles.skelRow}`} />
          <div className={`${styles.skeleton} ${styles.skelRow}`} />
          <div className={`${styles.skeleton} ${styles.skelBlock}`} />
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2>Job Not Found</h2>
          <p>The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link to="/jobs" className={styles.backLink}>&larr; Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const skills = job.skills
    ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const canApply = user?.role === "applicant";
  const isAuthenticated = !!user;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate("/jobs")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Jobs
      </button>

      <div className={styles.main}>
        <div className={styles.contentCol}>
          <div className={styles.headerCard}>
            <div className={styles.titleRow}>
              <div className={styles.logo}>
                {job.companyName?.charAt(0).toUpperCase() || "J"}
              </div>
              <div>
                <h1 className={styles.jobTitle}>{job.title}</h1>
                <p className={styles.companyName}>{job.companyName}</p>
              </div>
            </div>

            <div className={styles.quickInfo}>
              {job.location && (
                <span className={styles.infoChip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </span>
              )}
              {job.salaryMin && (
                <span className={styles.infoChip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  ${Number(job.salaryMin).toLocaleString()}
                  {job.salaryMax ? ` - $${Number(job.salaryMax).toLocaleString()}` : "+"}
                </span>
              )}
              {job.type && (
                <span className={styles.infoChip}>{TYPE_LABELS[job.type] || job.type}</span>
              )}
              {job.duration && (
                <span className={styles.infoChip}>{DURATION_LABELS[job.duration] || job.duration}</span>
              )}
              {job.experience && (
                <span className={styles.infoChip}>{EXP_LABELS[job.experience] || job.experience}</span>
              )}
              {job.department && (
                <span className={styles.infoChip}>{job.department}</span>
              )}
            </div>

            <p className={styles.postedDate}>
              Posted {relativeDate(job.createdAt)}
              {job.applicantsCount > 0 && (
                <> &middot; {job.applicantsCount} applicant{job.applicantsCount === 1 ? "" : "s"}</>
              )}
            </p>
          </div>

          {skills.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Skills Required</h3>
              <div className={styles.skillsList}>
                {skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <div className={styles.bodyText}>{job.description}</div>
          </div>

          {job.requirements && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Requirements</h3>
              <div className={styles.bodyText}>{job.requirements}</div>
            </div>
          )}
        </div>

        <div className={styles.sidebarCol}>
          <div className={styles.sidebarCard}>
            <h4 className={styles.sidebarTitle}>Apply for this job</h4>
            {canApply ? (
              <Link to={`/jobs/${job.id}/apply`} className={styles.applyBtn}>
                Apply Now
              </Link>
            ) : isAuthenticated ? (
              <p className={styles.sidebarNote}>
                Only applicants can apply to jobs.
              </p>
            ) : (
              <>
                <p className={styles.sidebarNote}>
                  You need to sign in to apply for this job.
                </p>
                <Link to="/auth" className={styles.applyBtn}>
                  Login to Apply
                </Link>
              </>
            )}
          </div>

          <div className={styles.sidebarCard}>
            <h4 className={styles.sidebarTitle}>About the Employer</h4>
            <div className={styles.employerRow}>
              <div className={styles.employerAvatar}>
                {job.companyName?.charAt(0).toUpperCase() || "E"}
              </div>
              <div>
                <p className={styles.employerName}>{job.companyName}</p>
                {job.postedByUser?.fullname && (
                  <p className={styles.employerPosted}>
                    Posted by {job.postedByUser.fullname}
                  </p>
                )}
              </div>
            </div>
          </div>

          {job.category && (
            <div className={styles.sidebarCard}>
              <h4 className={styles.sidebarTitle}>Category</h4>
              <p className={styles.categoryName}>{job.category.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function relativeDate(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return "";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
