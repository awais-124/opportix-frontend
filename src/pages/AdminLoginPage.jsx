import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { adminLoginSchema } from "../lib/auth.schema.js";
import { ApiError } from "../lib/api.js";
import PasswordField from "../components/auth/PasswordField.jsx";
import Logo from "../components/common/Logo.jsx";

export default function AdminLoginPage() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(data) {
    setServerError("");
    setSubmitting(true);
    try {
      const response = await signIn({ username: data.username, password: data.password });
      if (response.user && response.user.role !== "admin") {
        setServerError("Access denied. Admin role required.");
      } else {
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setServerError("Invalid username or password.");
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
      <div className="admin-login-page bg-grid-pattern">
        <div className="auth-card">
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontWeight: 600, color: "#475569" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page bg-grid-pattern">
      <div className="auth-card">
        {/* Logo and Titles */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <Logo size="medium" />
        </div>
        
        <div className="auth-form-header" style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 className="auth-form-title" style={{ fontSize: "26px" }}>Admin Dashboard</h2>
          <p className="auth-form-subtitle">Enter your admin credentials below</p>
        </div>

        {user && user.role === "admin" ? (
          <div className="auth-authenticated-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ textAlign: "center", color: "#475569" }}>
              You are currently logged in as administrator <strong>{user.fullname}</strong>
            </p>
            <Link to="/admin" className="btn-indigo-submit" style={{ textAlign: "center", textDecoration: "none" }}>
              Go to Admin Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-fields-vertical">
              <div className="modern-input-group">
                <label htmlFor="username" className="modern-input-label">Username</label>
                <div className="modern-input-container">
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    disabled={submitting}
                    className={`modern-input ${errors.username ? "input-error" : ""}`}
                    {...register("username")}
                  />
                </div>
                {errors.username && <span className="signup-field-error">{errors.username.message}</span>}
              </div>

              <div>
                <PasswordField label="Password" name="password" register={register} error={errors.password?.message} disabled={submitting} />
              </div>

              {serverError && <div className="form-alert-error">{serverError}</div>}

              <button type="submit" className="btn-indigo-submit" disabled={submitting} style={{ marginTop: "8px" }}>
                {submitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        )}

        <div className="auth-bottom-nav" style={{ marginTop: "24px" }}>
          <Link to="/auth" style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
            Applicant/Employer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
