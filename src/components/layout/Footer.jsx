import { Link } from "react-router-dom";
import Logo from "../common/Logo.jsx";
import styles from "./Footer.module.css";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Find Jobs" },
  { to: "/about", label: "About" },
  { to: "/about#contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com", label: "GitHub", icon: "GH" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "LI" },
  { href: "https://twitter.com", label: "Twitter", icon: "TW" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo size="medium" />
            <p className={styles.description}>
              Connecting talented professionals with their dream careers. Your journey starts here.
            </p>
          </div>

          <div className={styles.links}>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className={styles.linkList}>
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.social}>
            <h4 className={styles.heading}>Follow Us</h4>
            <div className={styles.socialIcons}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} Opportix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
