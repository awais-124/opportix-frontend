import styles from "./JobSkeleton.module.css";

export default function JobSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.header}>
            <div className={`${styles.skeleton} ${styles.logo}`} />
            <div className={styles.headerInfo}>
              <div className={`${styles.skeleton} ${styles.company}`} />
              <div className={`${styles.skeleton} ${styles.title}`} />
            </div>
          </div>
          <div className={`${styles.skeleton} ${styles.meta}`} />
          <div className={styles.badges}>
            <div className={`${styles.skeleton} ${styles.badge}`} />
            <div className={`${styles.skeleton} ${styles.badge}`} />
          </div>
          <div className={styles.skills}>
            <div className={`${styles.skeleton} ${styles.skill}`} />
            <div className={`${styles.skeleton} ${styles.skill}`} />
            <div className={`${styles.skeleton} ${styles.skill}`} />
          </div>
          <div className={`${styles.skeleton} ${styles.cta}`} />
        </div>
      ))}
    </div>
  );
}
