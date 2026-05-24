import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Find Jobs" },
  { to: "/about", label: "About" },
  { to: "/about#contact", label: "Contact" },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <img src="/assets/logos/logo.png" alt="nav-logo" className={styles.logoImg} />
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span /><span /><span />
        </button>

        <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/" || link.to === "/about"}
              className={({ isActive }) => {
                const isHashLink = link.to.includes("#");
                const currentFull = location.pathname + location.hash;
                const isCurrentActive = isHashLink
                  ? currentFull === link.to
                  : isActive && !location.hash;
                return `${styles.navLink} ${isCurrentActive ? styles.active : ""}`;
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className={styles.userSection}>
          {loading ? null : !user ? (
            <div className={styles.authButtons}>
              <Link to="/auth" className={styles.signInBtn}>Sign In</Link>
              <Link to="/auth" className={styles.signUpBtn}>Sign Up</Link>
            </div>
          ) : (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.userToggle}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={styles.avatar}>
                  {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className={styles.userName}>{user.fullname}</span>
                <span className={`${styles.chevron} ${dropdownOpen ? styles.chevronUp : ""}`}>▾</span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user.fullname}</p>
                    <p className={styles.dropdownRole}>{roleLabel}</p>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <NavLink
                    to="/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </NavLink>
                  {user.role === "employer" && (
                    <NavLink
                      to="/employer"
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Employer Dashboard
                    </NavLink>
                  )}
                  {user.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </NavLink>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
