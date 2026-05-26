import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginSchema } from "../lib/auth.schema.js";
import { ApiError } from "../lib/api.js";
import PasswordField from "../components/auth/PasswordField.jsx";
import Logo from "../components/common/Logo.jsx";
import Toast from "../components/common/Toast.jsx";

export default function AuthPage() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data) {
    setServerError("");
    setSubmitting(true);
    try {
      await signIn({ email: data.email, password: data.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setServerError("Invalid email or password.");
        else setServerError(err.message || "Something went wrong.");
      } else {
        setServerError("Connection error. Make sure the server is running.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="auth-page bg-grid-pattern">
        <div className="auth-card">
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontWeight: 600, color: "#475569" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {serverError && (
        <Toast
          message={serverError}
          type="error"
          onClose={() => setServerError("")}
        />
      )}

      {/* Left Section (Brand Promo Panel) */}
      <div className="auth-left-col">
        <div className="auth-brand-wrapper">
          <Logo size="medium" className="logo-light" />
        </div>
        
        <div className="auth-promo-text-wrapper">
          <h1 className="auth-promo-title">Unlock your professional potential.</h1>
          <p className="auth-promo-desc">
            Empowering teams with data-driven opportunities and growth insights.
          </p>
        </div>
        
        <footer className="auth-left-footer">
          &copy; {new Date().getFullYear()} Opportix. ALL RIGHTS RESERVED.
        </footer>
      </div>

      {/* Right Section (Form Area) */}
      <div className="auth-right-col bg-grid-pattern">
        {/* Top Header/Badge */}
        <div className="admin-badge-container">
          <Link to="/admin-login" className="admin-badge-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: "4px" }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Admin Login
          </Link>
        </div>

        {/* Form Container */}
        <div className="auth-form-container">
          {user ? (
            <div className="auth-authenticated-card">
              <div className="auth-form-header">
                <h2 className="auth-form-title">Already Signed In</h2>
                <p className="auth-form-subtitle">
                  You are currently signed in as <strong>{user.fullname}</strong>
                </p>
              </div>

              <div className="authenticated-info-block">
                <div className="authenticated-info-row">
                  <strong>Role:</strong>
                  <span style={{ textTransform: "capitalize" }}>{user.role}</span>
                </div>
                <div className="authenticated-info-row">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>
                <div className="authenticated-info-row">
                  <strong>Username:</strong>
                  <span>{user.username}</span>
                </div>
              </div>

              <Link to="/dashboard" className="btn-indigo-submit" style={{ textAlign: "center", textDecoration: "none", marginTop: "20px" }}>
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Welcome back</h2>
                <p className="auth-form-subtitle">Enter your details to access your account</p>
              </div>

              <div className="form-fields-vertical">
                <div className="modern-input-group">
                  <label htmlFor="email" className="modern-input-label">Email Address</label>
                  <div className="modern-input-container">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      disabled={submitting}
                      className={`modern-input ${errors.email ? "input-error" : ""}`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <span className="signup-field-error">{errors.email.message}</span>}
                </div>

                <div>
                  <PasswordField label="Password" name="password" register={register} error={errors.password?.message} disabled={submitting} />
                  <div className="modern-forgot-link">
                    <Link to="/forgot-password">Forgot password?</Link>
                  </div>
                </div>

                <button type="submit" className="btn-indigo-submit" disabled={submitting} style={{ marginTop: "8px" }}>
                  {submitting ? "Please wait..." : "Sign In"}
                </button>
              </div>
            </form>
          )}

          <div className="auth-bottom-nav">
            Don't have an account?
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}