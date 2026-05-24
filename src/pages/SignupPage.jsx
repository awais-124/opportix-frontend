import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signupSchema } from "../lib/auth.schema.js";
import { ApiError } from "../lib/api.js";

export default function SignupPage() {
  const { signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      linkedIn: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "applicant",
    },
  });

  async function onSubmit(data) {
    setServerError("");
    setSubmitting(true);
    try {
      const fullname = `${data.firstName} ${data.lastName}`.trim();
      await signUp({
        email: data.email,
        password: data.password,
        fullname,
        username: data.username,
        phone: data.phone,
        role: data.role,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setServerError(
            err.details?.email
              ? "This email is already registered."
              : err.details?.username
                ? "This username is already taken."
                : err.message
          );
        } else {
          setServerError(err.message || "Something went wrong.");
        }
      } else {
        setServerError("Connection error. Make sure the server is running.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="register-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="register-page">
        <div className="register-card">
          <p>You are already signed in as <strong>{user.fullname}</strong>.</p>
          <Link to="/dashboard" className="btn-register" style={{ textAlign: "center", textDecoration: "none", display: "block", marginTop: 20 }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      {serverError && (
        <div className="error-messages">
          <p className="error"><strong>Please fix the following:</strong></p>
          <p className="error">{serverError}</p>
        </div>
      )}

      <form className="register-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="register-image-column" />

        <div className="register-form-content">
          <h3 className="register-heading">Create Account</h3>

          <div className="register-fields-row">
            <div className="register-input-column">
              <div className="input-group-register">
                <input id="firstName" type="text" placeholder=" " disabled={submitting} {...register("firstName")} />
                <label htmlFor="firstName">First Name</label>
                {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
              </div>
              <div className="input-group-register">
                <input id="lastName" type="text" placeholder=" " disabled={submitting} {...register("lastName")} />
                <label htmlFor="lastName">Last Name</label>
                {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
              </div>
              <div className="input-group-register">
                <input id="reg-username" type="text" placeholder=" " disabled={submitting} {...register("username")} />
                <label htmlFor="reg-username">Username</label>
                {errors.username && <span className="field-error">{errors.username.message}</span>}
              </div>
              <div className="input-group-register">
                <input id="reg-email" type="email" placeholder=" " disabled={submitting} {...register("email")} />
                <label htmlFor="reg-email">Email</label>
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </div>
            </div>

            <div className="register-input-column">
              <div className="input-group-register">
                <input id="reg-password" type="password" placeholder=" " disabled={submitting} {...register("password")} />
                <label htmlFor="reg-password">Password</label>
                {errors.password && <span className="field-error">{errors.password.message}</span>}
              </div>
              <div className="input-group-register">
                <input id="confirmPassword" type="password" placeholder=" " disabled={submitting} {...register("confirmPassword")} />
                <label htmlFor="confirmPassword">Confirm Password</label>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
              </div>
              <div className="input-group-register">
                <input id="linkedIn" type="text" placeholder=" " disabled={submitting} {...register("linkedIn")} />
                <label htmlFor="linkedIn">LinkedIn Username</label>
              </div>
              <div className="input-group-register">
                <input id="phone" type="text" placeholder=" " disabled={submitting} {...register("phone")} />
                <label htmlFor="phone">Phone Number</label>
                {errors.phone && <span className="field-error">{errors.phone.message}</span>}
              </div>
            </div>
          </div>

          <div className="register-full-width">
            <div className="role-selection">
              <p className="role-title">Sign Up as:</p>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" value="applicant" disabled={submitting} {...register("role")} />
                  <span>Job Seeker</span>
                </label>
                <label className="radio-option">
                  <input type="radio" value="employer" disabled={submitting} {...register("role")} />
                  <span>Employer</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={submitting}>
              {submitting ? "Please wait..." : "Register"}
            </button>

            <div className="register-bottom-line">
              <p>Already have an account?</p>
              <Link to="/auth">Login Here!</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}