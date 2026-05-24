import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import FeaturedJobSelector from "../../components/admin/FeaturedJobSelector.jsx";
import styles from "./AdminFeaturedJobsPage.module.css";

export default function AdminFeaturedJobsPage() {
  const [featured, setFeatured] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [featuredData, jobsData] = await Promise.all([
        api.get("/admin/featured-jobs"),
        api.get("/jobs", { limit: 1000, status: "active" }),
      ]);
      setFeatured(featuredData);
      setAllJobs(jobsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAddFeatured({ jobId }) {
    setAdding(true);
    try {
      await api.post("/admin/featured-jobs", { jobId });
      setShowSelector(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await api.delete(`/admin/featured-jobs/${removeTarget.id}`);
      setRemoveTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemoving(false);
    }
  }

  const existingJobIds = featured.map((f) => f.jobId);

  const columns = [
    {
      key: "job",
      label: "Job Title",
      render: (val) => val?.title || "-",
    },
    {
      key: "job",
      label: "Company",
      render: (val) => val?.companyName || "-",
    },
    {
      key: "job",
      label: "Category",
      render: (val) => val?.categoryRef?.title || "-",
    },
    {
      key: "createdAt",
      label: "Date Featured",
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <button className={styles.removeBtn} onClick={() => setRemoveTarget(row)}>
          Remove
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Featured Jobs</h1>
        <p>Highlight important job listings</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      {!showSelector ? (
        <button className={styles.addBtn} onClick={() => setShowSelector(true)}>
          + Add Featured Job
        </button>
      ) : (
        <FeaturedJobSelector
          jobs={allJobs}
          existingJobIds={existingJobIds}
          onSubmit={handleAddFeatured}
          onCancel={() => setShowSelector(false)}
          loading={adding}
        />
      )}

      <AdminTable
        columns={columns}
        data={featured}
        loading={loading}
        emptyMessage="No featured jobs yet"
      />

      <ConfirmDialog
        isOpen={!!removeTarget}
        title="Remove Featured Job"
        message={
          removeTarget
            ? `Remove "${removeTarget.job?.title}" from featured jobs?`
            : ""
        }
        variant="warning"
        confirmLabel="Remove"
        onConfirm={handleRemove}
        onCancel={() => setRemoveTarget(null)}
        loading={removing}
      />
    </div>
  );
}
