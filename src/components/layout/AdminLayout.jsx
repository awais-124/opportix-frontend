import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.body}>
        <AdminSidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
