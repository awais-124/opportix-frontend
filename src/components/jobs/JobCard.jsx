import { Link } from "react-router-dom";
import styles from "./JobCard.module.css";

const TYPE_STYLES = {
  remote: { class: styles.typeRemote, label: "Remote" },
  onsite: { class: styles.typeOnsite, label: "On-site" },
  hybrid: { class: styles.typeHybrid, label: "Hybrid" },
};

const DURATION_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const EXP_LABELS = {
  entry: "Entry",
  mid: "Mid-level",
  senior: "Senior",
  expert: "Expert",
};

export default function JobCard({ job }) {
  const typeStyle = TYPE_STYLES[job.type] || {};
  const salary =
    job.salaryMin && job.salaryMax
      ? `$${formatSalary(job.salaryMin)} - $${formatSalary(job.salaryMax)}`
      : job.salaryMin
        ? `From $${formatSalary(job.salaryMin)}`
        : null;

  const skills = job.skills
    ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const logoLetter = job.companyName?.charAt(0).toUpperCase() || "J";

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logo}>{logoLetter}</div>
        <div className={styles.headerInfo}>
          <span className={styles.company}>{job.companyName}</span>
          <Link to={`/jobs/${job.id}`} className={styles.title}>
            {job.title}
          </Link>
        </div>
      </div>

      <div className={styles.meta}>
        {job.location && (
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.location}
          </span>
        )}
        {salary && <span className={styles.metaItem}>{salary}</span>}
        <span className={styles.postedDate}>{relativeDate(job.createdAt)}</span>
      </div>

      <div className={styles.badges}>
        {typeStyle.class && (
          <span className={`${styles.badge} ${typeStyle.class}`}>{typeStyle.label}</span>
        )}
        {job.duration && (
          <span className={`${styles.badge} ${styles.durationBadge}`}>
            {DURATION_LABELS[job.duration] || job.duration}
          </span>
        )}
        {job.experience && (
          <span className={`${styles.badge} ${styles.expBadge}`}>
            {EXP_LABELS[job.experience] || job.experience}
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div className={styles.skills}>
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className={styles.skillTag}>{skill}</span>
          ))}
          {skills.length > 3 && (
            <span className={styles.skillTag}>+{skills.length - 3}</span>
          )}
        </div>
      )}

      <Link to={`/jobs/${job.id}`} className={styles.cta}>
        View Details
      </Link>
    </article>
  );
}

function formatSalary(val) {
  const n = Number(val);
  if (isNaN(n)) return val;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function relativeDate(dateStr) {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diff = now - then;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
