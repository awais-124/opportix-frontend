import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./AdminSidebar.module.css";

const SIDEBAR_LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/featured-jobs", label: "Featured Jobs" },
  { to: "/admin/applicants", label: "Applicants" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/create-admin", label: "Create Admin" },
  { to: "/admin/reports", label: "Reports" },
];

export default function AdminSidebar() {
  const { user } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <span className={styles.avatar}>
          {user?.fullname?.charAt(0)?.toUpperCase() || "A"}
        </span>
        <div className={styles.profileInfo}>
          <p className={styles.name}>{user?.fullname || "Admin"}</p>
          <p className={styles.role}>Administrator</p>
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
