import styles from "./StatsCard.module.css";

export default function StatsCard({ title, value, icon, color, trend, loading }) {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={`${styles.skeleton} ${styles.skelIcon}`} />
          <div className={styles.textArea}>
            <div className={`${styles.skeleton} ${styles.skelValue}`} />
            <div className={`${styles.skeleton} ${styles.skelTitle}`} />
          </div>
        </div>
        {trend !== undefined && <div className={`${styles.skeleton} ${styles.skelTrend}`} />}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <span className={styles.icon} style={{ background: color ? `${color}15` : undefined, color: color || undefined }}>
          {icon}
        </span>
        <div className={styles.textArea}>
          <span className={styles.value}>{value ?? 0}</span>
          <span className={styles.title}>{title}</span>
        </div>
      </div>
      {trend && <span className={styles.trend}>{trend}</span>}
    </div>
  );
}
