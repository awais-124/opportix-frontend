import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { signUp, signIn, signOut, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "", password: "", fullname: "", username: "", phone: "", role: "applicant",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = isLogin
        ? await signIn({ email: form.email, password: form.password })
        : await signUp(form);
      if (!result.success) setError(result.error || "Something went wrong");
    } catch {
      setError("Network error. Make sure the server is running.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card"><p>Loading...</p></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">Opportix</div>
            <p>Welcome back, <strong>{user.fullname}</strong>!</p>
            <p className="auth-role">You are signed in as <strong>{user.role}</strong></p>
          </div>
          <div className="auth-divider" />
          <div className="auth-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
          <button className="auth-btn auth-btn-danger" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Opportix</div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Sign in to continue" : "Sign up to get started"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="auth-row">
                <div className="auth-field">
                  <label>Full Name</label>
                  <input name="fullname" value={form.fullname} onChange={handleChange} required placeholder="John Doe" />
                </div>
                <div className="auth-field">
                  <label>Username</label>
                  <input name="username" value={form.username} onChange={handleChange} required placeholder="johndoe" />
                </div>
              </div>
              <div className="auth-field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+92-300-1234567" />
              </div>
            </>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" minLength={6} />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label>I want to</label>
              <div className="auth-role-toggle">
                <button
                  type="button"
                  className={`auth-role-btn ${form.role === "applicant" ? "active" : ""}`}
                  onClick={() => setForm((p) => ({ ...p, role: "applicant" }))}
                >
                  <span className="role-icon">🔍</span>
                  Find a Job
                </button>
                <button
                  type="button"
                  className={`auth-role-btn ${form.role === "employer" ? "active" : ""}`}
                  onClick={() => setForm((p) => ({ ...p, role: "employer" }))}
                >
                  <span className="role-icon">🏢</span>
                  Hire Talent
                </button>
              </div>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="auth-link" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
