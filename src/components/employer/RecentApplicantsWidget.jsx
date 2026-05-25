import { Link } from "react-router-dom";
import StatusBadge from "../applications/StatusBadge.jsx";
import styles from "./RecentApplicantsWidget.module.css";

export default function RecentApplicantsWidget({ applicants, loading }) {
  if (loading) {
    return (
      <div className={styles.widget}>
        <h3 className={styles.title}>Recent Applicants</h3>
        <div className={styles.list}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={`${styles.skeleton} ${styles.skelName}`} />
                <div className={`${styles.skeleton} ${styles.skelJob}`} />
              </div>
              <div className={`${styles.skeleton} ${styles.skelBadge}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className={styles.widget}>
        <h3 className={styles.title}>Recent Applicants</h3>
        <div className={styles.empty}>
          <p>No applications received yet.</p>
          <Link to="/employer/jobs" className={styles.emptyLink}>View your job listings</Link>
        </div>
      </div>
    );
  }

  const recent = applicants.slice(0, 5);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Applicants</h3>
        <Link to="/employer/applicants" className={styles.viewAll}>View All</Link>
      </div>
      <div className={styles.list}>
        {recent.map((app) => {
          const name = app.user?.fullname || "Unknown";
          const jobTitle = app.job?.title || "Unknown Job";
          return (
            <div key={app.id} className={styles.item}>
              <div className={styles.avatar}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.name}>{name}</span>
                <span className={styles.jobTitle}>{jobTitle}</span>
                <span className={styles.date}>{relativeDate(app.createdAt)}</span>
              </div>
              <StatusBadge status={app.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function relativeDate(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return "";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}
