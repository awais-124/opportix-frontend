import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./EmployerSidebar.module.css";

const SIDEBAR_LINKS = [
  { to: "/employer", label: "Dashboard", end: true },
  { to: "/employer/post-job", label: "Post a Job" },
  { to: "/employer/jobs", label: "My Jobs" },
  { to: "/employer/applicants", label: "Applicants" },
  { to: "/employer/reports", label: "Reports" },
];

export default function EmployerSidebar() {
  const { user } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <span className={styles.avatar}>
          {user?.fullname?.charAt(0)?.toUpperCase() || "E"}
        </span>
        <div className={styles.profileInfo}>
          <p className={styles.name}>{user?.fullname || "Employer"}</p>
          <p className={styles.role}>Employer</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {SIDEBAR_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
