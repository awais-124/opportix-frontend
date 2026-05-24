import { useState } from "react";

export default function PasswordField({ label, name, register, error, disabled }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group">
      <input
        id={name}
        type={visible ? "text" : "password"}
        placeholder=" "
        disabled={disabled}
        className={error ? "input-error" : ""}
        {...register(name)}
      />
      <label htmlFor={name}>{label}</label>
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}