import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import EmployerSidebar from "./EmployerSidebar.jsx";
import styles from "./EmployerLayout.module.css";

export default function EmployerLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.body}>
        <EmployerSidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
