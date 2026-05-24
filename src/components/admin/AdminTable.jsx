import styles from "./AdminTable.module.css";

function SortIcon({ active, direction }) {
  return (
    <span className={`${styles.sortIcon} ${active ? styles.sortActive : ""}`}>
      {active ? (direction === "asc" ? "\u25B2" : "\u25BC") : "\u25B4\u25BE"}
    </span>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className={styles.pagination}>
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={styles.pageBtn}>
        Prev
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={styles.pageBtn}>1</button>
          {start > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`${styles.pageBtn} ${p === page ? styles.pageActive : ""}`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
          <button onClick={() => onPageChange(totalPages)} className={styles.pageBtn}>{totalPages}</button>
        </>
      )}
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={styles.pageBtn}>
        Next
      </button>
    </div>
  );
}

function SkeletonRows({ columns }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i}>
      {columns.map((col) => (
        <td key={col.key}>
          <div className={`skeleton ${styles.skeletonCell}`} />
        </td>
      ))}
    </tr>
  ));
}

export default function AdminTable({
  columns,
  data,
  loading,
  emptyMessage = "No data found",
  sortKey,
  sortDir,
  onSort,
  pagination,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SkeletonRows columns={columns} />
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className="page-empty">
          <h3>{emptyMessage}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? styles.sortable : ""}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                {col.label}
                {col.sortable && (
                  <SortIcon
                    active={sortKey === col.key}
                    direction={sortDir}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
