export default function RoleToggle({ value, onChange, disabled }) {
  return (
    <div className="role-toggle">
      <button
        type="button"
        className={`role-btn ${value === "applicant" ? "active" : ""}`}
        onClick={() => onChange("applicant")}
        disabled={disabled}
      >
        <span className="role-icon">&#x1F50D;</span>
        Find a Job
      </button>
      <button
        type="button"
        className={`role-btn ${value === "employer" ? "active" : ""}`}
        onClick={() => onChange("employer")}
        disabled={disabled}
      >
        <span className="role-icon">&#x1F3E2;</span>
        Hire Talent
      </button>
    </div>
  );
}