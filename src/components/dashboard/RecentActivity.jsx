import styles from "./RecentActivity.module.css";

const STATUS_LABELS = {
  new: "New",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
};

export default function RecentActivity({ items, loading, error }) {
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Recent Applications</h3>
        <div className={styles.activityList}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.activityItem}>
              <div className={styles.activityInfo}>
                <div className={`${styles.skeleton} ${styles.skelTitle}`} />
                <div className={`${styles.skeleton} ${styles.skelMeta}`} />
              </div>
              <div className={`${styles.skeleton} ${styles.skelBadge}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Recent Applications</h3>
        <p className={styles.error}>Could not load recent applications.</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  const recent = items.slice(0, 5);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Recent Applications</h3>
      <div className={styles.activityList}>
        {recent.map((item) => (
          <div key={item.id} className={styles.activityItem}>
            <div className={styles.activityInfo}>
              <span className={styles.activityTitle}>{item.jobTitle}</span>
              <span className={styles.activityMeta}>
                {item.companyName} &middot; {formatDate(item.createdAt || item.date)}
              </span>
            </div>
            <span className={`${styles.statusBadge} ${styles[`status-${item.status}`] || ""}`}>
              {STATUS_LABELS[item.status] || item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
