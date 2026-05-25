import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

export default function Logo({ size = "medium", className = "" }) {
  return (
    <Link to="/" className={`${styles.logoContainer} ${styles[size]} ${className}`}>
      <img
        src="/assets/logos/opportix-logo.png"
        alt="Opportix"
        className={styles.logoImg}
      />
      <span className={styles.logoText}>Opportix</span>
    </Link>
  );
}
