import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";
import JobCard from "../components/jobs/JobCard.jsx";
import JobFilters from "../components/jobs/JobFilters.jsx";
import JobSkeleton from "../components/jobs/JobSkeleton.jsx";
import styles from "./JobListingPage.module.css";

export default function JobListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const limit = Math.max(1, parseInt(searchParams.get("limit") || "25", 10));
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filters = {
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    duration: searchParams.get("duration") || "",
    experience: searchParams.get("experience") || "",
    search: searchParams.get("search") || "",
    salaryMin: searchParams.get("salaryMin") || "",
    salaryMax: searchParams.get("salaryMax") || "",
  };

  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.set("page", "1");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    setSearchInput("");
  }, [setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter("search", searchInput);
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);

    const params = new URLSearchParams(searchParams);
    if (!params.has("page")) params.set("page", "1");
    params.set("limit", String(limit));
    params.set("status", "active");

    api
      .get(`/jobs?${params.toString()}`)
      .then((data) => {
        const list = data.jobs ?? data.data ?? data ?? [];
        setJobs(Array.isArray(list) ? list : []);
        setTotal(data.total ?? data.count ?? list.length ?? 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [searchParams, limit]);

  const hasActiveFilters = Object.values(filters).some((v) => v);
  const showEmpty = !loading && !error && jobs.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Find Jobs</h1>
          <p className={styles.subtitle}>
            {loading
              ? "Searching..."
              : `${total} job${total === 1 ? "" : "s"} found`}
          </p>
        </div>
        <div className={styles.limitControl}>
          <label htmlFor="limit-select" className={styles.limitLabel}>Jobs per page:</label>
          <select
            id="limit-select"
            className={styles.limitSelect}
            value={limit}
            onChange={(e) => setFilter("limit", e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search jobs by title, skill, or keyword..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className={styles.searchBtn}>Search</button>
      </form>

      <div className={styles.layout}>
        <JobFilters
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
        />

        <div className={styles.content}>
          {error && (
            <div className={styles.error}>
              Failed to load jobs. Please try again later.
            </div>
          )}

          {loading && <JobSkeleton />}

          {showEmpty && (
            <div className={styles.empty}>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search terms.</p>
              {hasActiveFilters && (
                <button className={styles.resetBtn} onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <>
              <div className={styles.grid}>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    Previous
                  </button>
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          className={`${styles.pageNum} ${p === page ? styles.pageNumActive : ""}`}
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    className={styles.pageBtn}
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
