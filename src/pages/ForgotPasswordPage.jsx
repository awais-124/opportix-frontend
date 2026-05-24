import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
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
        <h3>Forgot Password</h3>

        {error && <div className="auth-error">{error}</div>}

        {sent ? (
          <div className="form-fields">
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              If that email is registered, we&apos;ve sent a password reset link. Please check your inbox and spam folder.
            </p>
            <Link to="/auth" className="auth-btn" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-fields" style={{ width: "100%" }}>
            <div className="input-group">
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                autoFocus
              />
              <label htmlFor="reset-email">Email Address</label>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="bottom-line">
              <p>Remember your password?</p>
              <Link to="/auth">Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}