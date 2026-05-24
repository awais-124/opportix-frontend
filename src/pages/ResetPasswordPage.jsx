import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState("verifying");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStep("invalid");
    } else {
      const timer = setTimeout(() => setStep("ready"), 300);
      return () => clearTimeout(timer);
    }
  }, [token]);

  function validate() {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password))
      return "Password must contain uppercase, lowercase, number, and special character";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", { token, password, confirmPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <img src="/assets/images/login-background.png" alt="" className="auth-bg-image" />

      <div className="auth-card">
        <h3>Reset Password</h3>

        {step === "verifying" && (
          <p style={{ padding: 20 }}>Verifying your reset link...</p>
        )}

        {step === "invalid" && (
          <div className="form-fields">
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              This reset link is invalid or missing. Please request a new one.
            </p>
            <Link to="/forgot-password" className="auth-btn" style={{ textAlign: "center", textDecoration: "none" }}>
              Request New Link
            </Link>
            <div className="bottom-line">
              <Link to="/auth">Back to Sign In</Link>
            </div>
          </div>
        )}

        {success && (
          <div className="form-fields">
            <p style={{ fontWeight: 600, textAlign: "center", margin: 0 }}>
              Password reset successful!
            </p>
            <p style={{ fontSize: 14, textAlign: "center", margin: 0 }}>
              You can now sign in with your new password.
            </p>
            <Link to="/auth" className="auth-btn" style={{ textAlign: "center", textDecoration: "none" }}>
              Go to Sign In
            </Link>
          </div>
        )}

        {step === "ready" && !success && (
          <form onSubmit={handleSubmit} className="form-fields" style={{ width: "100%" }}>
            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                autoFocus
              />
              <label htmlFor="new-password">New Password</label>
            </div>

            <div className="input-group">
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="confirm-password">Confirm Password</label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="bottom-line">
              <Link to="/auth">Back to Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}