import { useState, useEffect } from "react";
import { api } from "../../lib/api.js";
import styles from "./JobFilters.module.css";

const JOB_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

const DURATIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const EXP_LEVELS = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" },
];

export default function JobFilters({ filters, onFilterChange, onClear }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/categories")
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        <button className={styles.clearBtn} onClick={onClear}>Clear all</button>
      </div>

      <div className={styles.group}>
        <label className={styles.groupLabel}>Category</label>
        <select
          className={styles.select}
          value={filters.category || ""}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Job Type</legend>
        {JOB_TYPES.map((t) => (
          <label key={t.value} className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={filters.type === t.value}
              onChange={() =>
                onFilterChange("type", filters.type === t.value ? "" : t.value)
              }
            />
            {t.label}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Duration</legend>
        {DURATIONS.map((d) => (
          <label key={d.value} className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={filters.duration === d.value}
              onChange={() =>
                onFilterChange("duration", filters.duration === d.value ? "" : d.value)
              }
            />
            {d.label}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Experience</legend>
        {EXP_LEVELS.map((e) => (
          <label key={e.value} className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={filters.experience === e.value}
              onChange={() =>
                onFilterChange("experience", filters.experience === e.value ? "" : e.value)
              }
            />
            {e.label}
          </label>
        ))}
      </fieldset>

      <div className={styles.group}>
        <label className={styles.groupLabel}>Salary Range</label>
        <div className={styles.salaryRow}>
          <input
            className={styles.salaryInput}
            type="number"
            placeholder="Min"
            min="0"
            value={filters.salaryMin || ""}
            onChange={(e) => onFilterChange("salaryMin", e.target.value)}
          />
          <span className={styles.salarySep}>-</span>
          <input
            className={styles.salaryInput}
            type="number"
            placeholder="Max"
            min="0"
            value={filters.salaryMax || ""}
            onChange={(e) => onFilterChange("salaryMax", e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}
