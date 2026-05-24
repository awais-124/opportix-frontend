import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginSchema } from "../lib/auth.schema.js";
import { ApiError } from "../lib/api.js";
import PasswordField from "../components/auth/PasswordField.jsx";

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
      <div className="auth-page">
        <img src="/assets/images/login-background.png" alt="" className="auth-bg-image" />
        <div className="auth-card"><p>Loading...</p></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-page">
        <img src="/assets/images/login-background.png" alt="" className="auth-bg-image" />
        <div className="auth-card">
          <h3>Welcome back</h3>
          <p>Signed in as <strong>{user.fullname}</strong> ({user.role})</p>
          <div className="auth-divider" />
          <div className="auth-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
          <Link to="/dashboard" className="auth-btn" style={{ textAlign: "center", textDecoration: "none", margin: 0 }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <img src="/assets/images/login-background.png" alt="" className="auth-bg-image" />

      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Welcome Back</h3>

        <div className="form-fields">
          <div className="input-group">
            <input id="email" type="email" placeholder=" " disabled={submitting} className={errors.email ? "input-error" : ""} {...register("email")} />
            <label htmlFor="email">Email</label>
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <PasswordField label="Password" name="password" register={register} error={errors.password?.message} disabled={submitting} />

          <div className="auth-forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Please wait..." : "Login"}
          </button>
        </div>

        <div className="bottom-line">
          <p>Don't have an account?</p>
          <Link to="/register">Create Now!</Link>
        </div>
      </form>

      <Link to="/admin" className="top-right-btn" style={{ textDecoration: "none", display: "inline-block" }}>
        ADMIN LOGIN
      </Link>
    </div>
  );
}