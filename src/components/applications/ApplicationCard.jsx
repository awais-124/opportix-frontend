import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import styles from "./ApplicationCard.module.css";

export default function ApplicationCard({ application }) {
  const [coverOpen, setCoverOpen] = useState(false);
  const { job, status, cv, coverLetter, createdAt, experience } = application;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h3 className={styles.jobTitle}>{job?.title}</h3>
          <p className={styles.company}>{job?.companyName}</p>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(createdAt)}
            </span>
            {experience !== undefined && experience !== null && (
              <span className={styles.metaItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {experience} yr{experience === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className={styles.actions}>
        {cv && (
          <a href={cv} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            View CV
          </a>
        )}
        {coverLetter && (
          <button className={styles.actionBtn} onClick={() => setCoverOpen(!coverOpen)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {coverOpen ? "Hide Cover Letter" : "View Cover Letter"}
          </button>
        )}
      </div>

      {coverOpen && coverLetter && (
        <div className={styles.coverLetter}>
          <p>{coverLetter}</p>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
