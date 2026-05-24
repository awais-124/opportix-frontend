import styles from "./QuickStats.module.css";

export default function QuickStats({ stats, loading }) {
  if (loading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.skeleton}`} />
            <div className={styles.statBody}>
              <div className={`${styles.skeleton} ${styles.skelValue}`} />
              <div className={`${styles.skeleton} ${styles.skelLabel}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats || stats.length === 0) return null;

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.statCard}>
          <span className={styles.statIcon}>{stat.icon}</span>
          <div className={styles.statBody}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
