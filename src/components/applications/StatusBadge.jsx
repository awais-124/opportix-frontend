import styles from "./StatusBadge.module.css";

const STATUS_CONFIG = {
  new: { class: styles.new, label: "New" },
  reviewed: { class: styles.reviewed, label: "Reviewed" },
  shortlisted: { class: styles.shortlisted, label: "Shortlisted" },
  rejected: { class: styles.rejected, label: "Rejected" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { class: "", label: status };
  return (
    <span className={`${styles.badge} ${config.class}`}>
      {config.label}
    </span>
  );
}
